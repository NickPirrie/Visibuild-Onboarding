import { STATUS, PHASE_OPTIONS } from '../lib/constants.js';
import { risk, initials, ownerColor } from '../lib/utils.js';
import StatusPicker from './StatusPicker.jsx';
import EvidenceDrop from './EvidenceDrop.jsx';

export default function ItemCard({ item, today, sid, tid, cat, menuOpen, store }) {
  const r = item.due ? risk(item, today) : { label: 'No date', color: 'var(--vb-ink-4)', key: '' };

  return (
    <div
      className="vb-item-card"
      style={{ border: '1px solid ' + (r.key === 'overdue' ? 'var(--vb-defect)' : 'var(--vb-line)') }}
      onDragOver={(e) => e.preventDefault()}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            className="vb-item-title-input"
            value={item.title}
            onChange={(e) => store.editItem(sid, tid, cat, item.id, 'title', e.target.value)}
          />
          <div className="vb-item-controls">
            <div className="vb-field-col">
              <span className="vb-field-label">Status</span>
              <StatusPicker
                status={item.status}
                open={menuOpen}
                onToggle={() => store.openStatusMenu(item.id)}
                onPick={(k) => store.setItemStatus(sid, tid, cat, item.id, k)}
              />
            </div>
            <div className="vb-field-col">
              <span className="vb-field-label">Phase</span>
              <select className="vb-select" value={item.phase} onChange={(e) => store.editItem(sid, tid, cat, item.id, 'phase', e.target.value)}>
                {PHASE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="vb-field-col">
              <span className="vb-field-label">Due date</span>
              <input type="date" className="vb-date-input" value={item.due} onChange={(e) => store.editItem(sid, tid, cat, item.id, 'due', e.target.value)} />
            </div>
            <div className="vb-field-col">
              <span className="vb-field-label">Risk</span>
              <span className="vb-risk-label" style={{ color: r.color }}>{r.label}</span>
            </div>
            <div className="vb-field-col">
              <span className="vb-field-label">Owner</span>
              <div className="vb-owner-row">
                <div className="vb-owner-avatar" style={{ background: ownerColor(item.owner) }}>{initials(item.owner) || '–'}</div>
                <input
                  className="vb-owner-input"
                  placeholder="Assign owner"
                  value={item.owner}
                  onChange={(e) => store.editItem(sid, tid, cat, item.id, 'owner', e.target.value)}
                  list="vb-owners-list"
                />
              </div>
            </div>
          </div>
          <EvidenceDrop
            evidence={item.evidence}
            onAttach={() => store.openFilePicker({ kind: 'item', sid, tid, cat, id: item.id })}
            onDropFiles={(files) => store.ingestFiles(files, { kind: 'item', sid, tid, cat, id: item.id })}
            onRemove={(fid) => store.removeFile('item', { sid, tid, cat, iid: item.id }, fid)}
          />
        </div>
        <button type="button" className="vb-task-delete" onClick={() => store.delItem(sid, tid, cat, item.id)}>×</button>
      </div>
    </div>
  );
}
