import { addDays, allTasks, diffDays, fmtDate, todayIso } from '../lib/utils.js';
import { PHASE_LABEL } from '../lib/constants.js';

function StatusIcon({ status }) {
  if (status === 'done') {
    return <span style={{ width: 14, display: 'inline-block', color: '#006E57', fontWeight: 700 }}>✓</span>;
  }
  if (status === 'in_progress') {
    return (
      <span style={{ width: 14, display: 'inline-block' }}>
        <svg width="11" height="11" viewBox="0 0 12 12" style={{ display: 'block' }}>
          <circle cx="6" cy="6" r="5" fill="none" stroke="#C6CAD0" strokeWidth="1.5" />
          <path d="M6,1 A5,5 0 0,1 6,11 L6,6 Z" fill="#4272FF" />
        </svg>
      </span>
    );
  }
  if (status === 'blocked') {
    return <span style={{ width: 14, display: 'inline-block', color: '#C8331E', fontWeight: 700 }}>!</span>;
  }
  return <span style={{ width: 14, display: 'inline-block', color: '#C6CAD0' }}>○</span>;
}

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

  const p1End = active.phase1End || addDays(active.start, 30);
  const p2End = active.phase2End || active.golive;
  const p3End = active.phase3End || addDays(active.golive, 60);
  const phaseWindows = {
    '30': fmtDate(active.start) + ' → ' + fmtDate(p1End),
    '60': fmtDate(p1End) + ' → ' + fmtDate(p2End),
    '90': fmtDate(p2End) + ' → ' + fmtDate(p3End),
  };

  const printPhases = ['30', '60', '90'].map((ph) => {
    const ts = all.filter((t) => t.phase === ph).sort((a, b) => new Date(a.due) - new Date(b.due));
    const d = ts.filter((t) => t.status === 'done').length;
    return { ph, label: PHASE_LABEL[ph], window: phaseWindows[ph], detail: d + ' of ' + ts.length + ' complete', tasks: ts };
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
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, padding: '10px 14px', background: '#F5F6F7', borderRadius: 7, flexWrap: 'wrap' }}>
        {[
          { status: 'not_started', label: 'Not started' },
          { status: 'in_progress', label: 'In progress' },
          { status: 'done', label: 'Done' },
          { status: 'blocked', label: 'Waiting on information' },
        ].map(({ status, label }) => (
          <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#4B545C' }}>
            <StatusIcon status={status} />
            {label}
          </div>
        ))}
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
            <div style={{ fontFamily: 'var(--vb-font-serif)', fontSize: 17 }}>{p.label} — {p.window}</div>
            <div style={{ fontSize: 13, color: 'var(--vb-ink-3)' }}>{p.detail}</div>
          </div>
          {p.tasks.map((t) => {
            const overdueTask = t.status !== 'done' && diffDays(today, t.due) < 0;
            return (
              <div key={t.id} className="vb-print-task-row">
                <StatusIcon status={t.status} />
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
