import { WS_DESCRIPTIONS } from '../../lib/constants.js';
import { allTasks, diffDays, todayIso, ownerColor, initials } from '../../lib/utils.js';
import TaskCard from '../TaskCard.jsx';

function groupByOwner(tasks) {
  const map = new Map();
  tasks.forEach((t) => {
    const key = t.owner || '';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(t);
  });
  return [...map.entries()].map(([owner, tasks]) => ({ owner, tasks }));
}

const PHASE_DESC = {
  '30': 'Everything that must be set up and configured in the first 30 days.',
  '60': 'First live inspections on site — the product proving itself with real work.',
  '90': 'Full adoption: every trade active and the project self-sufficient.',
};

export default function TaskListView({ active, state, store }) {
  const today = todayIso();
  const sec = state.section;
  const isWs = sec.indexOf('ws:') === 0;

  let tasks = [], title = '', kicker = '', desc = '', canAdd = false;
  let wsId = null, ph = null;

  if (isWs) {
    wsId = sec.slice(3);
    const w = active.workstreams.find((x) => x.id === wsId);
    tasks = w ? w.tasks : [];
    title = w ? w.name : '';
    kicker = 'Workstream';
    desc = WS_DESCRIPTIONS[wsId] || '';
    canAdd = true;
  } else {
    ph = sec.slice(6);
    tasks = allTasks(active).filter((t) => t.phase === ph);
    title = ph + '-day milestone';
    kicker = 'Rollout';
    desc = PHASE_DESC[ph] || '';
  }

  const sf = state.taskStatusFilter || 'all';
  const pf = state.taskPhaseFilter || 'all';
  const sort = state.taskSort || 'order';

  let filtered = tasks.slice();
  if (sf === 'outstanding') filtered = filtered.filter((t) => t.status !== 'done');
  else if (sf === 'done') filtered = filtered.filter((t) => t.status === 'done');
  else if (sf === 'overdue') filtered = filtered.filter((t) => t.status !== 'done' && diffDays(today, t.due) < 0);
  if (isWs && pf !== 'all') filtered = filtered.filter((t) => t.phase === pf);
  if (sort === 'due') filtered = filtered.slice().sort((a, b) => new Date(a.due) - new Date(b.due));

  const canDrag = sort === 'order' && sf === 'all' && pf === 'all';
  const dn = tasks.filter((t) => t.status === 'done').length;
  const listPct = tasks.length ? Math.round((dn / tasks.length) * 100) : 0;
  const listEmpty = tasks.length === 0;
  const filterEmpty = filtered.length === 0 && tasks.length > 0;

  return (
    <>
      <div className="vb-list-head">
        <div style={{ maxWidth: 660, flex: 1, minWidth: 0 }}>
          <div className="vb-eyebrow" style={{ marginBottom: 9 }}>{kicker}</div>
          {isWs ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                className="vb-ws-title-input"
                value={title}
                onChange={(e) => store.editWs(wsId, e.target.value)}
                title="Rename workstream"
              />
              <button type="button" className="vb-btn-danger-outline" onClick={() => store.delWs(wsId)}>Delete</button>
            </div>
          ) : (
            <h1 style={{ fontFamily: 'var(--vb-font-serif)', fontWeight: 400, fontSize: 32, letterSpacing: '-.01em', margin: 0 }}>{title}</h1>
          )}
          <p style={{ fontSize: 14, color: 'var(--vb-ink-3)', margin: '8px 0 0', lineHeight: 1.5 }}>{desc}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 26, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--vb-ink)' }}>{listPct}%</div>
            <div style={{ fontSize: 12, color: 'var(--vb-ink-4)' }}>{(filtered.length !== tasks.length ? filtered.length + ' of ' + tasks.length + ' shown · ' : '') + dn + ' of ' + tasks.length + ' done'}</div>
          </div>
          {canAdd && <button type="button" className="vb-btn-primary" onClick={() => store.addTask(wsId, ph)}>+ New task</button>}
        </div>
      </div>

      <div className="vb-filter-row">
        <span className="vb-filter-label">Filter</span>
        {[['all', 'All'], ['outstanding', 'Outstanding'], ['overdue', 'Overdue'], ['done', 'Complete']].map(([v, l]) => (
          <button key={v} type="button" className={'vb-chip' + (sf === v ? ' active' : '')} onClick={() => store.setFilter('taskStatusFilter', v)}>{l}</button>
        ))}
        {isWs && (
          <>
            <span className="vb-filter-sep" />
            {[['all', 'All phases'], ['30', '30-day'], ['60', '60-day'], ['90', '90-day']].map(([v, l]) => (
              <button key={v} type="button" className={'vb-chip' + (pf === v ? ' active' : '')} onClick={() => store.setFilter('taskPhaseFilter', v)}>{l}</button>
            ))}
          </>
        )}
        <span style={{ flex: 1 }} />
        <button
          type="button"
          className={'vb-chip' + (sort === 'due' ? ' active' : '')}
          onClick={() => store.setFilter('taskSort', sort === 'due' ? 'order' : 'due')}
        >{sort === 'due' ? '▾ Due date' : '↕ Manual order'}</button>
      </div>

      {filterEmpty && (
        <div className="vb-empty-state compact"><div className="title">No tasks match this filter.</div></div>
      )}
      {listEmpty && (
        <div className="vb-empty-state">
          <div className="title">No tasks here yet.</div>
          <div className="detail">Add the first task to start tracking this workstream.</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {groupByOwner(filtered).map(({ owner, tasks: group }) => (
          <div key={owner} style={{ marginBottom: 20 }}>
            <div className="vb-owner-group-header">
              <div className="vb-owner-group-avatar" style={{ background: ownerColor(owner) }}>{initials(owner) || '?'}</div>
              <span className="vb-owner-group-label">{owner || 'Unassigned'}</span>
              <span className="vb-owner-group-count">{group.length} task{group.length !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {group.map((t) => (
                <TaskCard key={t.id} task={t} today={today} menuOpen={state.statusMenuFor === t.id} canDrag={canDrag} store={store} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
