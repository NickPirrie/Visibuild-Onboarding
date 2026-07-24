import { initials } from '../lib/utils.js';

export default function Header({ userName, saving, onOpenPicker, onExport }) {
  return (
    <header className="vb-header">
      <img className="logo" src="/assets/icon-green.png" alt="Visibuild" />
      <button type="button" className="vb-header-btn" onClick={onOpenPicker}>
        <span style={{ fontWeight: 500 }}>Project</span>
        <span style={{ opacity: 0.6, fontSize: 10 }}>▾</span>
      </button>
      <div className="vb-header-search">
        <span style={{ opacity: 0.7 }}>⌕</span>
        <span style={{ opacity: 0.7 }}>Search onboarding…</span>
      </div>
      <div className="vb-save-indicator">
        <span className="vb-save-dot" style={{ background: saving ? 'var(--vb-hold)' : 'var(--vb-green)' }} />
        {saving ? 'Saving…' : 'All changes saved'}
      </div>
      <button type="button" className="vb-export-btn" onClick={onExport}>Export PDF</button>
      <div className="vb-avatar" title={userName}>{initials(userName) || '–'}</div>
    </header>
  );
}
