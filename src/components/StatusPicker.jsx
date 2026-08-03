import { useRef, useEffect, useState } from 'react';
import { STATUS, STATUS_KEYS } from '../lib/constants.js';

export default function StatusPicker({ status, open, onToggle, onPick }) {
  const meta = STATUS[status] || STATUS.not_started;
  const btnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 5, left: r.left });
    }
  }, [open]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        ref={btnRef}
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
          <div className="vb-status-menu" style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }}>
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
