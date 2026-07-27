import { initials } from '../../lib/utils.js';
import { LocalTextarea } from '../LocalField.jsx';

export default function CommentsView({ active, store }) {
  const comments = active.comments || [];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div className="vb-eyebrow" style={{ marginBottom: 9 }}>Internal notes</div>
          <h1 style={{ fontFamily: 'var(--vb-font-serif)', fontWeight: 400, fontSize: 32, letterSpacing: '-.01em', margin: 0 }}>Comments</h1>
          <p style={{ fontSize: 14, color: 'var(--vb-ink-3)', margin: '8px 0 0' }}>Notes and flags for the onboarding team on this project.</p>
        </div>
        <button type="button" className="vb-btn-primary" onClick={store.addComment}>+ Add note</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 820 }}>
        {comments.map((c) => (
          <div key={c.id} className="vb-comment-card">
            <div className="vb-comment-avatar">{initials(c.author)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--vb-ink)' }}>{c.author}</span>
                <span style={{ fontSize: 12, color: 'var(--vb-ink-4)' }}>{c.when}</span>
              </div>
              <LocalTextarea
                className="vb-comment-textarea"
                rows={2}
                autoGrow
                placeholder="Write a note…"
                value={c.text}
                onCommit={(v) => store.editComment(c.id, v)}
              />
            </div>
            <button type="button" className="vb-task-delete" onClick={() => store.delComment(c.id)}>×</button>
          </div>
        ))}
      </div>
    </>
  );
}
