import { useRef, useState } from 'react';
import { allTasks, ragColor, ragColorItems, todayIso } from '../lib/utils.js';
import { PHASE_LABEL } from '../lib/constants.js';

function NavRow({ active, dot, label, badge, onClick }) {
  return (
    <button type="button" className={'vb-nav-row' + (active ? ' active' : '')} onClick={onClick}>
      {dot && <span className="dot" style={{ background: dot }} />}
      <span className="label">{label}</span>
      {badge != null && <span className={'vb-nav-badge' + (active ? ' active' : '')}>{badge}</span>}
    </button>
  );
}

function DragRow({ id, active, dot, label, badge, onClick, dragRef, onReorder }) {
  const [over, setOver] = useState(false);
  return (
    <div
      className={'vb-drag-row' + (over ? ' vb-drag-over' : '')}
      draggable
      onDragStart={(e) => { dragRef.current = id; e.dataTransfer.effectAllowed = 'move'; }}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={() => { onReorder(dragRef.current, id); dragRef.current = null; setOver(false); }}
      onDragEnd={() => { dragRef.current = null; setOver(false); }}
    >
      <span className="vb-drag-grip">⠿</span>
      <button type="button" className={'vb-nav-row' + (active ? ' active' : '')} onClick={onClick}>
        {dot && <span className="dot" style={{ background: dot }} />}
        <span className="label">{label}</span>
        {badge != null && <span className={'vb-nav-badge' + (active ? ' active' : '')}>{badge}</span>}
      </button>
    </div>
  );
}

export default function Sidebar({ state, active, store, onOpenPicker }) {
  const wsDragRef = useRef(null);
  const subDragRef = useRef(null);
  const today = todayIso();
  const sec = state.section;
  const all = allTasks(active);

  const wsOpen = state.groups.workstreams !== false;
  const subsOpen = state.groups.subs !== false;
  const rollOpen = state.groups.rollout !== false;

  const subs = active.subcontractors || [];

  return (
    <aside className="vb-sidebar">
      <button type="button" className="vb-project-switch" onClick={onOpenPicker}>
        <div className="code">{active.code}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="name">{active.name}</div>
          <div className="client">{active.client}</div>
        </div>
        <span style={{ color: 'var(--vb-charcoal-20)', fontSize: 11 }}>▾</span>
      </button>

      <nav className="vb-nav">
        <NavRow active={sec === 'summary'} label="Onboarding summary" onClick={() => store.go('summary')} />
        <NavRow active={sec === 'programme'} label="Programme" onClick={() => store.go('programme')} />
        <NavRow active={sec === 'correspondences'} label="Correspondences" badge={(active.correspondences || []).length || null} onClick={() => store.go('correspondences')} />

        <button type="button" className="vb-nav-group-header" onClick={() => store.toggleGroup('workstreams')}>
          Workstreams<span style={{ fontSize: 9 }}>{wsOpen ? '▾' : '▸'}</span>
        </button>
        {wsOpen && (
          <>
            {active.workstreams.map((w) => {
              const outstanding = w.tasks.filter((t) => t.status !== 'done').length;
              return (
                <DragRow
                  key={w.id}
                  id={w.id}
                  active={sec === 'ws:' + w.id}
                  dot={ragColor(w.tasks, today)}
                  label={w.name}
                  badge={outstanding || null}
                  onClick={() => store.go('ws:' + w.id)}
                  dragRef={wsDragRef}
                  onReorder={store.reorderWs}
                />
              );
            })}
            <button type="button" className="vb-nav-add" onClick={store.addWs}>＋ Add workstream</button>
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0 5px' }}>
          <button
            type="button"
            style={{ flex: 1, textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 10.5, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: sec === 'subs' ? '#fff' : '#6b7683', padding: '4px 11px' }}
            onClick={() => store.go('subs')}
          >Subcontractors</button>
          <button type="button" style={{ flex: 'none', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7683', fontSize: 9, padding: '4px 11px' }} onClick={() => store.toggleGroup('subs')}>
            {subsOpen ? '▾' : '▸'}
          </button>
        </div>
        {subsOpen && (
          subs.length ? subs.map((s) => {
            const items = [];
            s.trades.forEach((t) => { (t.itps || []).forEach((i) => items.push(i)); (t.training || []).forEach((i) => items.push(i)); });
            const outstanding = items.filter((i) => i.status !== 'done').length;
            return (
              <DragRow
                key={s.id}
                id={s.id}
                active={false}
                dot={ragColorItems(items)}
                label={s.name}
                badge={outstanding || null}
                onClick={() => store.go('subs')}
                dragRef={subDragRef}
                onReorder={store.reorderSub}
              />
            );
          }) : <div className="vb-nav-empty">No subcontractors yet</div>
        )}

        <button type="button" className="vb-nav-group-header" onClick={() => store.toggleGroup('rollout')}>
          Rollout<span style={{ fontSize: 9 }}>{rollOpen ? '▾' : '▸'}</span>
        </button>
        {rollOpen && ['30', '60', '90'].map((ph) => {
          const ts = all.filter((t) => t.phase === ph);
          const d = ts.filter((t) => t.status === 'done').length;
          const pct = ts.length ? Math.round((d / ts.length) * 100) : 0;
          return (
            <NavRow key={ph} active={sec === 'phase:' + ph} label={PHASE_LABEL[ph]} badge={pct + '%'} onClick={() => store.go('phase:' + ph)} />
          );
        })}

        <div className="vb-nav-divider" />
        <NavRow active={sec === 'comments'} label="Comments" badge={(active.comments || []).length || null} onClick={() => store.go('comments')} />
        <NavRow active={sec === 'settings'} label="Settings" onClick={() => store.go('settings')} />
      </nav>

      <div className="vb-sidebar-footer">
        <div className="saving-row"><span className="saving-dot" /> Auto-saving · live for the team</div>
        <div style={{ marginTop: 2 }}>Onboarding lead · {active.csOwner}</div>
      </div>
    </aside>
  );
}
