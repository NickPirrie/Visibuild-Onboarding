import { STATUS, STATUS_KEYS, PHASE_META } from '../../lib/constants.js';
import { allTasks, diffDays, fmtDate, initials, avatarColor, risk, todayIso } from '../../lib/utils.js';

export default function SummaryView({ active, state, store }) {
  const today = todayIso();
  const all = allTasks(active);
  const done = all.filter((t) => t.status === 'done').length;
  const total = all.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const outstanding = total - done;
  const overdue = all.filter((t) => t.status !== 'done' && diffDays(today, t.due) < 0).length;
  const dtg = diffDays(today, active.golive);
  const dayNo = diffDays(active.start, today);
  const span = diffDays(active.start, active.golive);
  const curPhase = dayNo <= 30 ? '30' : dayNo <= 60 ? '60' : '90';
  const phaseMeta = PHASE_META[curPhase];

  const legend = STATUS_KEYS.map((k) => ({ label: STATUS[k].label, color: STATUS[k].bar, count: all.filter((t) => t.status === k).length }));

  const kpis = [
    { label: 'Complete', value: done, sub: 'signed off', color: 'var(--vb-ink)' },
    { label: 'Outstanding', value: outstanding, sub: 'still to do', color: 'var(--vb-ink)' },
    { label: 'Overdue', value: overdue, sub: overdue ? 'need attention now' : 'nothing overdue', color: overdue ? 'var(--vb-defect)' : 'var(--vb-ink)' },
    { label: 'Days to go-live', value: dtg, sub: fmtDate(active.golive) + ' target', color: 'var(--vb-ink)' },
  ];

  const behindMap = {};
  all.forEach((t) => {
    if (t.status === 'done') return;
    const r = risk(t, today);
    if (r.key === 'overdue' || r.key === 'soon') {
      const k = t.owner;
      behindMap[k] = behindMap[k] || { name: t.owner, role: t.role, overdue: 0, soon: 0 };
      if (r.key === 'overdue') behindMap[k].overdue++; else behindMap[k].soon++;
    }
  });
  const behind = Object.values(behindMap).sort((a, b) => b.overdue - a.overdue || b.soon - a.soon);

  const upcoming = all.filter((t) => t.status !== 'done')
    .sort((a, b) => new Date(a.due) - new Date(b.due))
    .slice(0, 6);

  const phaseHealth = ['30', '60', '90'].map((ph) => {
    const ts = all.filter((t) => t.phase === ph);
    const d = ts.filter((t) => t.status === 'done').length;
    const od = ts.filter((t) => t.status !== 'done' && diffDays(today, t.due) < 0).length;
    const pc = ts.length ? Math.round((d / ts.length) * 100) : 0;
    let statusLabel = 'On track', pillBg = 'var(--vb-info-soft)', pillFg = '#2947C4';
    if (pc === 100) { statusLabel = 'Complete'; pillBg = 'var(--vb-pass-soft)'; pillFg = '#004C3D'; }
    else if (od) { statusLabel = 'At risk'; pillBg = 'var(--vb-defect-soft)'; pillFg = '#9A2617'; }
    return { ph, window: PHASE_META[ph].window, statusLabel, pillBg, pillFg, pc, od, d, total: ts.length };
  });

  return (
    <>
      <div className="vb-page-head">
        <div>
          <div className="vb-eyebrow" style={{ marginBottom: 9 }}>Onboarding summary</div>
          <h1>{active.name}</h1>
          <div className="sub">{active.client} · {active.sector} · {active.region}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="vb-day-pill">
            <span style={{ fontSize: 13, color: 'var(--vb-ink-3)' }}>Day {dayNo} of {span}</span>
            <span style={{ width: 1, height: 16, background: 'var(--vb-line-strong)' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: phaseMeta.color }}>{phaseMeta.label}</span>
          </div>
        </div>
      </div>

      <div className="vb-kpi-row">
        <div className="vb-card vb-progress-card">
          <div className="vb-progress-ring" style={{ background: `conic-gradient(var(--vb-pass) ${pct}%, var(--vb-charcoal-10) 0)` }}>
            <div className="vb-progress-ring-inner">{pct}%</div>
          </div>
          <div>
            <div className="vb-label-eyebrow">Onboarding progress</div>
            <div style={{ fontSize: 13.5, color: 'var(--vb-ink-3)', marginTop: 4 }}>{done} of {total} tasks complete</div>
          </div>
        </div>
        {kpis.map((k) => (
          <div key={k.label} className="vb-card vb-kpi-card">
            <div className="vb-label-eyebrow">{k.label}</div>
            <div className="vb-kpi-value" style={{ color: k.color }}>{k.value}</div>
            <div className="vb-kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="vb-two-col">
        <div className="vb-card vb-card-pad">
          <h3>Onboarding status by workstream</h3>
          <p style={{ fontSize: 13, color: 'var(--vb-ink-4)', margin: '5px 0 20px' }}>Task completion across every setup workstream. Expand a row to see its tasks, or click the name to open it.</p>
          {active.workstreams.map((w) => {
            const tt = w.tasks.length;
            const d = w.tasks.filter((t) => t.status === 'done').length;
            const od = w.tasks.filter((t) => t.status !== 'done' && diffDays(today, t.due) < 0).length;
            const breakdown = STATUS_KEYS.map((k) => {
              const c = w.tasks.filter((t) => t.status === k).length;
              return c ? c + ' ' + STATUS[k].label.toLowerCase() : null;
            }).filter(Boolean).join(', ');
            const isOpen = !!state.expanded['sumws:' + w.id];
            return (
              <div key={w.id}>
                <div className="vb-ws-bar-row" title={w.name + ' — ' + (breakdown || 'no tasks') + (od ? ' · ' + od + ' overdue' : '')}>
                  <button type="button" className="vb-ws-bar-caret" onClick={() => store.toggleNode('sumws:' + w.id)}>{isOpen ? '▾' : '›'}</button>
                  <div className="vb-ws-bar-name" onClick={() => store.go('ws:' + w.id)}>{w.name}</div>
                  <div className="vb-ws-bar-track" onClick={() => store.toggleNode('sumws:' + w.id)}>
                    {STATUS_KEYS.slice().reverse().map((k) => {
                      const c = w.tasks.filter((t) => t.status === k).length;
                      return <div key={k} title={c ? c + ' ' + STATUS[k].label.toLowerCase() : ''} style={{ width: (tt ? (c / tt) * 100 : 0) + '%', height: '100%', background: STATUS[k].bar }} />;
                    })}
                  </div>
                  <div className="vb-ws-bar-count" style={{ color: od ? 'var(--vb-defect)' : 'var(--vb-ink-3)' }}>{tt ? d + '/' + tt : '—'}</div>
                </div>
                {isOpen && (
                  <div className="vb-ws-drop">
                    {w.tasks.map((t) => {
                      const m = STATUS[t.status] || STATUS.not_started;
                      const r = risk(t, today);
                      return (
                        <div key={t.id} className="vb-ws-drop-row" onClick={() => store.go('ws:' + w.id)}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', flex: 'none', background: m.dot }} />
                          <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: 'var(--vb-ink-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</span>
                          <span style={{ flex: 'none', fontSize: 11.5, fontWeight: 500, color: r.color }}>{t.status === 'done' ? '' : r.label}</span>
                          <span style={{ flex: 'none', fontSize: 11.5, color: 'var(--vb-ink-4)', width: 52, textAlign: 'right' }}>{fmtDate(t.due)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <div className="vb-legend-row">
            {legend.map((l) => (
              <div key={l.label} className="vb-legend-item">
                <span className="vb-legend-swatch" style={{ background: l.color }} />{l.label} <b style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--vb-ink-2)' }}>{l.count}</b>
              </div>
            ))}
          </div>
        </div>

        <div className="vb-card vb-card-pad">
          <h3 style={{ marginBottom: 16 }}>Programme health</h3>
          {phaseHealth.map((p) => (
            <div key={p.ph} className="vb-phase-health-row">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                <div><span style={{ fontSize: 14, fontWeight: 600, color: 'var(--vb-ink)' }}>{p.ph}-day</span> <span style={{ fontSize: 12.5, color: 'var(--vb-ink-4)' }}>· {p.window}</span></div>
                <span className="vb-pill" style={{ background: p.pillBg, color: p.pillFg }}>{p.statusLabel}</span>
              </div>
              <div className="vb-phase-health-track"><div style={{ width: p.pc + '%', height: '100%', background: p.od ? 'var(--vb-defect)' : 'var(--vb-pass)' }} /></div>
              <div style={{ fontSize: 12, color: 'var(--vb-ink-4)', marginTop: 6 }}>{p.d} of {p.total} done{p.od ? ' · ' + p.od + ' overdue' : ''}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="vb-two-col-even">
        <div className="vb-card vb-card-pad">
          <h3 style={{ marginBottom: 4 }}>Who's behind</h3>
          <p style={{ fontSize: 13, color: 'var(--vb-ink-4)', margin: '0 0 14px' }}>People with overdue or imminent work blocking the programme.</p>
          {behind.length ? behind.map((b, i) => (
            <div key={i} className="vb-behind-row">
              <div className="vb-behind-avatar" style={{ background: avatarColor(b.role) }}>{initials(b.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--vb-ink)' }}>{b.name}</div>
                <div style={{ fontSize: 12, color: 'var(--vb-ink-4)' }}>{b.role}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12.5 }}>
                <span style={{ fontWeight: 600, color: b.overdue ? 'var(--vb-defect)' : 'var(--vb-hold)' }}>
                  {(b.overdue ? b.overdue + ' overdue' : '') + (b.overdue && b.soon ? ' · ' : '') + (b.soon ? b.soon + ' due soon' : '')}
                </span>
              </div>
            </div>
          )) : <div style={{ padding: 20, textAlign: 'center', fontSize: 13.5, color: 'var(--vb-pass)' }}>Everyone's on track — no overdue or imminent work.</div>}
        </div>

        <div className="vb-card vb-card-pad">
          <h3 style={{ marginBottom: 14 }}>Next up &amp; at risk</h3>
          {upcoming.map((t) => {
            const r = risk(t, today);
            return (
              <div key={t.id} className="vb-upcoming-row" onClick={() => store.go('ws:' + t.wsId)}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', flex: 'none', background: r.color }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, color: 'var(--vb-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--vb-ink-4)' }}>{t.wsName} · {t.owner} · due {fmtDate(t.due)}</div>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: r.color, whiteSpace: 'nowrap' }}>{r.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
