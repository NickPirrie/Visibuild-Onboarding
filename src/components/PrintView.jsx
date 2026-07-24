import { allTasks, diffDays, fmtDate, todayIso } from '../lib/utils.js';

export default function PrintView({ active, userName }) {
  const today = todayIso();
  const all = allTasks(active);
  const done = all.filter((t) => t.status === 'done').length;
  const total = all.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const overdue = all.filter((t) => t.status !== 'done' && diffDays(today, t.due) < 0).length;

  const printKpis = [
    { label: 'Progress', value: pct + '%' },
    { label: 'Complete', value: done + ' / ' + total },
    { label: 'Overdue', value: String(overdue) },
    { label: 'Go-live', value: fmtDate(active.golive) },
  ];

  const printPhases = ['30', '60', '90'].map((ph) => {
    const ts = all.filter((t) => t.phase === ph).sort((a, b) => new Date(a.due) - new Date(b.due));
    const d = ts.filter((t) => t.status === 'done').length;
    const window = ({ '30': 'Setup & config', '60': 'First live inspections', '90': 'Full adoption' })[ph];
    return { ph, window, detail: d + ' of ' + ts.length + ' complete', tasks: ts };
  });

  return (
    <div className="vb-print" style={{ fontFamily: 'var(--vb-font-sans)', color: 'var(--vb-ink)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--vb-ink)', paddingBottom: 14, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--vb-ink-3)' }}>Visibuild onboarding programme</div>
          <div style={{ fontFamily: 'var(--vb-font-serif)', fontSize: 26, marginTop: 6 }}>{active.name}</div>
          <div style={{ fontSize: 13, color: 'var(--vb-ink-3)', marginTop: 3 }}>{active.client} · {active.sector} · {active.region}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--vb-ink-3)', lineHeight: 1.6 }}>
          <div>Prepared by {userName || active.csOwner}</div>
          <div>{fmtDate(today)}</div>
          <div>{pct}% complete</div>
        </div>
      </div>
      <div className="vb-print-kpis">
        {printKpis.map((k) => (
          <div key={k.label} style={{ flex: 1 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--vb-ink-3)' }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, marginTop: 3 }}>{k.value}</div>
          </div>
        ))}
      </div>
      {printPhases.map((p) => (
        <div key={p.ph} className="vb-print-phase">
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--vb-line-strong)', paddingBottom: 5, marginBottom: 8 }}>
            <div style={{ fontFamily: 'var(--vb-font-serif)', fontSize: 17 }}>{p.ph}-day milestone — {p.window}</div>
            <div style={{ fontSize: 13, color: 'var(--vb-ink-3)' }}>{p.detail}</div>
          </div>
          {p.tasks.map((t) => {
            const overdueTask = t.status !== 'done' && diffDays(today, t.due) < 0;
            return (
              <div key={t.id} className="vb-print-task-row">
                <span style={{ width: 14, color: t.status === 'done' ? 'var(--vb-pass)' : 'var(--vb-ink-4)' }}>{t.status === 'done' ? '✓' : '□'}</span>
                <span style={{ flex: 1 }}>{t.title}</span>
                <span style={{ width: 130, color: 'var(--vb-ink-3)' }}>{t.owner}</span>
                <span style={{ width: 70, textAlign: 'right', color: overdueTask ? 'var(--vb-defect)' : 'var(--vb-ink-3)' }}>{fmtDate(t.due)}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
