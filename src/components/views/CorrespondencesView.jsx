import { CHANNEL_OPTIONS, CHANNEL_COLORS } from '../../lib/constants.js';
import EvidenceDrop from '../EvidenceDrop.jsx';
import { LocalInput, LocalTextarea } from '../LocalField.jsx';

export default function CorrespondencesView({ active, store }) {
  const correspondences = active.correspondences || [];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div className="vb-eyebrow" style={{ marginBottom: 9 }}>Client comms</div>
          <h1 style={{ fontFamily: 'var(--vb-font-serif)', fontWeight: 400, fontSize: 32, letterSpacing: '-.01em', margin: 0 }}>Correspondences</h1>
          <p style={{ fontSize: 14, color: 'var(--vb-ink-3)', margin: '8px 0 0' }}>A running record of every touchpoint with the client team.</p>
        </div>
        <button type="button" className="vb-btn-primary" onClick={store.addCorr}>+ Log correspondence</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {correspondences.map((c) => {
          const cc = CHANNEL_COLORS[c.channel] || CHANNEL_COLORS.email;
          return (
            <div key={c.id} className="vb-corr-card">
              <div className="vb-corr-top">
                <select className="vb-channel-select" style={{ background: cc.bg, color: cc.fg }} value={c.channel} onChange={(e) => store.editCorr(c.id, 'channel', e.target.value)}>
                  {CHANNEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <LocalInput className="vb-corr-who-input" placeholder="Who" value={c.who} onCommit={(v) => store.editCorr(c.id, 'who', v)} />
                <input type="date" className="vb-corr-date-input" value={c.date} onChange={(e) => store.editCorr(c.id, 'date', e.target.value)} />
                <button type="button" className="vb-task-delete" onClick={() => store.delCorr(c.id)}>×</button>
              </div>
              <LocalTextarea
                className="vb-corr-summary"
                rows={2}
                placeholder="What was discussed or sent…"
                value={c.summary}
                onCommit={(v) => store.editCorr(c.id, 'summary', v)}
              />
              <EvidenceDrop
                evidence={c.attachments}
                thumbSize={26}
                onAttach={() => store.openFilePicker({ kind: 'corr', id: c.id })}
                onDropFiles={(files) => store.ingestFiles(files, { kind: 'corr', id: c.id })}
                onRemove={(fid) => store.removeFile('corr', c.id, fid)}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
