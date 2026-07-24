import { STATUS, STATUS_KEYS } from '../lib/constants.js';

export default function StatusPicker({ status, open, onToggle, onPick }) {
  const meta = STATUS[status] || STATUS.not_started;
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        className="vb-status-btn"
        style={{ background: meta.bg, color: meta.fg }}
        onClick={onToggle}
      >
        <span className="vb-status-dot" style={{ background: meta.dot }} />
        {meta.label}
        <span style={{ fontSize: 9, opacity: 0.6 }}>▾</span>
      </button>
      {open && (
        <>
          <div className="vb-status-menu-backdrop" onClick={onToggle} />
          <div className="vb-status-menu">
            {STATUS_KEYS.map((k) => (
              <button key={k} type="button" className="vb-status-menu-item" onClick={() => onPick(k)}>
                <span className="vb-status-dot" style={{ background: STATUS[k].dot }} />
                {STATUS[k].label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
