import { useCallback } from 'react';
import { STATUS, STATUS_KEYS } from '../../lib/constants.js';
import { addDays, diffDays, fmtDate, risk, todayIso } from '../../lib/utils.js';

export default function ProgrammeView({ active, state, store }) {
  const today = todayIso();
  const nameW = state.ganttNameW || 300;
  const winDays = Math.max(1, diffDays(active.start, active.golive));
  const pos = (iso) => Math.max(0, Math.min(100, (diffDays(active.start, iso) / winDays) * 100));
  const p30 = pos(active.phase1End || addDays(active.start, 30));
  const p60 = pos(active.phase2End || addDays(active.start, 60));

  const startDrag = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = nameW;
    const move = (ev) => store.setGanttNameW(Math.max(160, Math.min(560, startW + (ev.clientX - startX))));
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }, [nameW, store]);

  const groups = active.workstreams.filter((w) => w.tasks.length).map((w) => ({
    id: w.id, name: w.name,
    done: w.tasks.filter((t) => t.status === 'done').length,
    total: w.tasks.length,
    rows: w.tasks.slice().sort((a, b) => new Date(a.start) - new Date(b.start)),
  }));

  const legend = STATUS_KEYS.map((k) => ({ label: STATUS[k].label, color: STATUS[k].bar }));

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div className="vb-eyebrow" style={{ marginBottom: 9 }}>Phased rollout</div>
        <h1 style={{ fontFamily: 'var(--vb-font-serif)', fontWeight: 400, fontSize: 32, letterSpacing: '-.01em', margin: 0 }}>Rollout programme</h1>
        <div className="sub">{fmtDate(active.start)} – {fmtDate(active.golive)} · risk auto-flagged from due dates</div>
      </div>

      <div className="vb-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="vb-gantt-head">
          <div className="vb-gantt-name-col" style={{ width: nameW }}>
            Task
            <div className="vb-gantt-resize-handle" title="Drag to resize" onMouseDown={startDrag} />
          </div>
          <div className="vb-gantt-phase-cells">
            <div className="vb-gantt-phase-cell" style={{ width: p30 + '%' }}>Phase 1<span className="sub">Setup &amp; config</span></div>
            <div className="vb-gantt-phase-cell" style={{ width: (p60 - p30) + '%' }}>Phase 2<span className="sub">First inspections</span></div>
            <div className="vb-gantt-phase-cell" style={{ flex: 1 }}>Phase 3<span className="sub">Full adoption</span></div>
          </div>
        </div>
        <div className="vb-gantt-body">
          {groups.map((g) => (
            <div key={g.id}>
              <div className="vb-gantt-group-head">
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--vb-ink-2)' }}>{g.name}</span>
                <span style={{ fontSize: 11.5, color: 'var(--vb-ink-4)', marginLeft: 9 }}>{g.done}/{g.total} done</span>
              </div>
              {g.rows.map((t) => {
                const l = pos(t.start), rgt = pos(t.due), width = Math.max(rgt - l, 1.4);
                const meta = STATUS[t.status];
                const r = risk(t, today);
                return (
                  <div key={t.id} className="vb-gantt-row" onClick={() => store.go('ws:' + g.id)}>
                    <div className="vb-gantt-row-name" style={{ width: nameW }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', flex: 'none', background: meta.dot }} />
                      <span style={{ fontSize: 13, color: 'var(--vb-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</span>
                    </div>
                    <div className="vb-gantt-row-track">
                      <div className="vb-gantt-gridline" style={{ left: p30 + '%' }} />
                      <div className="vb-gantt-gridline" style={{ left: p60 + '%' }} />
                      {state.showTodayLine !== false && <div className="vb-gantt-today" style={{ left: pos(today) + '%' }} />}
                      <div
                        className="vb-gantt-bar"
                        style={{
                          left: l + '%', width: width + '%', minWidth: 8, background: meta.bar,
                          boxShadow: r.key === 'overdue' ? '0 0 0 1.5px var(--vb-defect)' : 'none',
                        }}
                      >
                        <span className="vb-gantt-bar-label" style={{ color: r.color }}>{fmtDate(t.due)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="vb-gantt-legend">
        {legend.map((l) => (
          <div key={l.label} className="vb-legend-item"><span className="vb-legend-swatch" style={{ width: 12, height: 12, background: l.color }} />{l.label}</div>
        ))}
        <div className="vb-legend-item"><span style={{ width: 2, height: 14, background: 'var(--vb-defect)' }} />Today</div>
      </div>
    </>
  );
}
