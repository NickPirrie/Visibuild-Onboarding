import { LocalTextarea } from './LocalField.jsx';

function fmtNoteTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return d.getDate() + ' ' + M[d.getMonth()] + ', ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

export default function NotesList({ notes, onAddNote, onEditNote, onDeleteNote }) {
  return (
    <div className="vb-notes-row">
      <span className="vb-notes-label">Notes</span>
      <div className="vb-notes-list">
        {(notes || []).map((n) => (
          <div key={n.id} className="vb-note-row">
            {(n.author || n.createdAt) && (
              <div className="vb-note-meta">
                {n.author && <span className="vb-note-author">{n.author}</span>}
                {n.createdAt && <span className="vb-note-time">{fmtNoteTime(n.createdAt)}</span>}
              </div>
            )}
            <div className="vb-note-row-inner">
              <LocalTextarea
                className="vb-note-textarea"
                rows={1}
                placeholder="Add a note…"
                value={n.text}
                onCommit={(v) => onEditNote(n.id, v)}
              />
              <button type="button" className="vb-note-remove" onClick={() => onDeleteNote(n.id)} title="Remove note">×</button>
            </div>
          </div>
        ))}
        <button type="button" className="vb-add-note-btn" onClick={onAddNote}>＋ Add note</button>
      </div>
    </div>
  );
}
