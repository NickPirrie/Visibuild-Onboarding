export default function NotesList({ notes, onAddNote, onEditNote, onDeleteNote }) {
  return (
    <div className="vb-notes-row">
      <span className="vb-notes-label">Notes</span>
      <div className="vb-notes-list">
        {(notes || []).map((n) => (
          <div key={n.id} className="vb-note-row">
            <textarea
              className="vb-note-textarea"
              rows={1}
              placeholder="Add a note…"
              value={n.text}
              onChange={(e) => onEditNote(n.id, e.target.value)}
            />
            <button type="button" className="vb-note-remove" onClick={() => onDeleteNote(n.id)} title="Remove note">×</button>
          </div>
        ))}
        <button type="button" className="vb-add-note-btn" onClick={onAddNote}>＋ Add note</button>
      </div>
    </div>
  );
}
