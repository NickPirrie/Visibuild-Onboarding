import { STATUS, PHASE_OPTIONS } from '../lib/constants.js';
import { risk, initials, ownerColor } from '../lib/utils.js';
import StatusPicker from './StatusPicker.jsx';
import EvidenceDrop from './EvidenceDrop.jsx';
import NotesList from './NotesList.jsx';

export default function TaskCard({ task, today, menuOpen, canDrag, store }) {
  const meta = STATUS[task.status] || STATUS.not_started;
  const r = risk(task, today);
  const notes = task.notes || (task.note ? [{ id: task.id + '-lg', text: task.note }] : []);

  return (
    <div
      className="vb-task-card"
      style={{ border: '1px solid ' + (r.key === 'overdue' ? 'var(--vb-defect)' : 'var(--vb-line)') }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); store.reorderTask(task.id); }}
    >
      <div className="vb-task-card-row">
        <div
          className="vb-task-grip"
          draggable={canDrag}
          onDragStart={() => { store.dragIdRef.current = task.id; }}
          title="Drag to reorder"
          style={{ cursor: canDrag ? 'grab' : 'default', opacity: canDrag ? 1 : 0.35 }}
        >
          <div style={{
            width: 3, height: 3, borderRadius: '50%', background: 'var(--vb-ink-4)',
            boxShadow: '6px 0 var(--vb-ink-4),0 6px var(--vb-ink-4),6px 6px var(--vb-ink-4),0 12px var(--vb-ink-4),6px 12px var(--vb-ink-4)',
          }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            className="vb-task-title-input"
            value={task.title}
            onChange={(e) => store.editTask(task.id, 'title', e.target.value)}
          />
          <div className="vb-task-controls">
            <div className="vb-field-col">
              <span className="vb-field-label">Status</span>
              <StatusPicker
                status={task.status}
                open={menuOpen}
                onToggle={() => store.openStatusMenu(task.id)}
                onPick={(k) => store.setStatus(task.id, k)}
              />
            </div>
            <div className="vb-field-col">
              <span className="vb-field-label">Phase</span>
              <select className="vb-select" value={task.phase} onChange={(e) => store.editTask(task.id, 'phase', e.target.value)}>
                {PHASE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="vb-field-col">
              <span className="vb-field-label">Due date</span>
              <input type="date" className="vb-date-input" value={task.due} onChange={(e) => store.editTask(task.id, 'due', e.target.value)} />
            </div>
            <div className="vb-field-col">
              <span className="vb-field-label">Risk</span>
              <span className="vb-risk-label" style={{ color: r.color }}>{r.label}</span>
            </div>
            <div className="vb-field-col">
              <span className="vb-field-label">Owner · {task.role}</span>
              <div className="vb-owner-row">
                <div className="vb-owner-avatar" style={{ background: ownerColor(task.owner) }}>{initials(task.owner) || '–'}</div>
                <input className="vb-owner-input" value={task.owner} onChange={(e) => store.editTask(task.id, 'owner', e.target.value)} list="vb-owners-list" />
              </div>
            </div>
          </div>
          <NotesList
            notes={notes}
            onAddNote={() => store.addNote(task.id)}
            onEditNote={(nid, v) => store.editNote(task.id, nid, v)}
            onDeleteNote={(nid) => store.delNote(task.id, nid)}
          />
          <EvidenceDrop
            evidence={task.evidence}
            onAttach={() => store.openFilePicker({ kind: 'task', id: task.id })}
            onDropFiles={(files) => store.ingestFiles(files, { kind: 'task', id: task.id })}
            onRemove={(fid) => store.removeFile('task', task.id, fid)}
          />
        </div>
        <button type="button" className="vb-task-delete" onClick={() => store.delTask(task.id)}>×</button>
      </div>
      <datalist id="vb-owners-list">
        {(store.teamMembers || []).map((m) => <option key={m} value={m} />)}
      </datalist>
    </div>
  );
}
