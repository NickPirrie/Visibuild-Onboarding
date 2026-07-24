import { allTasks, diffDays, todayIso } from '../lib/utils.js';

export default function ProjectPicker({ state, store, onClose }) {
  const today = todayIso();

  return (
    <div className="vb-modal-backdrop" onClick={onClose}>
      <div className="vb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="vb-modal-head">
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--vb-ink-3)' }}>Switch project</div>
          <button type="button" className="vb-btn-primary" style={{ padding: '7px 13px', fontSize: 12.5 }} onClick={store.addProject}>＋ New project</button>
        </div>
        <div className="vb-modal-body">
          {state.projects.map((pr) => {
            const a = allTasks(pr);
            const d = a.filter((t) => t.status === 'done').length;
            const pct = a.length ? Math.round((d / a.length) * 100) : 0;
            const od = a.filter((t) => t.status !== 'done' && diffDays(today, t.due) < 0).length;
            const isActive = pr.id === state.activeId;
            return (
              <div key={pr.id} className="vb-project-row-wrap" style={{ background: isActive ? 'var(--vb-paper-2)' : 'transparent' }}>
                <button type="button" className="vb-project-row" onClick={() => store.pickProject(pr.id)}>
                  <div className="code">{pr.code}</div>
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--vb-ink)' }}>{pr.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--vb-ink-4)' }}>{pr.client} · {pr.sector.split(' · ')[0]} · {pr.region}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: od ? 'var(--vb-defect)' : pct === 100 ? 'var(--vb-pass)' : 'var(--vb-ink)' }}>{pct}%</div>
                    <div style={{ fontSize: 10.5, color: 'var(--vb-ink-4)' }}>{od ? od + ' overdue' : pct === 100 ? 'complete' : 'on track'}</div>
                  </div>
                  {isActive && <span style={{ color: 'var(--vb-blue)', fontWeight: 700, marginLeft: 4 }}>✓</span>}
                </button>
                <button
                  type="button"
                  className="vb-project-row-delete"
                  title="Delete project"
                  onClick={() => store.delProject(pr.id)}
                >×</button>
              </div>
            );
          })}
        </div>
        <div className="vb-modal-foot">Rename dates and details for the current project in <b style={{ fontWeight: 600, color: 'var(--vb-ink-3)' }}>Settings</b>.</div>
      </div>
    </div>
  );
}
