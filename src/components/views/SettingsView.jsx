import { addDays, diffDays, fmtDate } from '../../lib/utils.js';
import { LocalInput } from '../LocalField.jsx';

export default function SettingsView({ active, store }) {
  const span = Math.max(1, diffDays(active.start, active.golive));
  const phaseWindows = [
    { label: 'Phase 1', window: fmtDate(active.start) + ' → ' + fmtDate(addDays(active.start, 30)), detail: 'Setup & configuration' },
    { label: 'Phase 2', window: fmtDate(addDays(active.start, 30)) + ' → ' + fmtDate(addDays(active.start, 60)), detail: 'First live inspections' },
    { label: 'Phase 3', window: fmtDate(addDays(active.start, 60)) + ' → ' + fmtDate(active.golive), detail: 'Full adoption' },
  ];

  const field = (label, value, field, type = 'text') => (
    <label className="vb-field-block">
      <span className="flabel">{label}</span>
      {type === 'date'
        ? <input type="date" className="vb-settings-input" value={value} onChange={(e) => store.editProject(field, e.target.value)} />
        : <LocalInput className="vb-settings-input" value={value} onCommit={(v) => store.editProject(field, v)} />
      }
    </label>
  );

  return (
    <>
      <div style={{ marginBottom: 22 }}>
        <div className="vb-eyebrow" style={{ marginBottom: 9 }}>Project settings</div>
        <h1 style={{ fontFamily: 'var(--vb-font-serif)', fontWeight: 400, fontSize: 32, letterSpacing: '-.01em', margin: 0 }}>Settings</h1>
        <p style={{ fontSize: 14, color: 'var(--vb-ink-3)', margin: '8px 0 0', lineHeight: 1.5 }}>Adjust the onsite start date, go-live target and project details. The Phase 1 / Phase 2 / Phase 3 windows and all risk flags recalculate automatically.</p>
      </div>

      <div className="vb-settings-grid">
        <div className="vb-card vb-card-pad">
          <h3 style={{ marginBottom: 18 }}>Programme dates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {field('Onsite start date', active.start, 'start', 'date')}
            {field('Go-live target', active.golive, 'golive', 'date')}
            <div style={{ fontSize: 12.5, color: 'var(--vb-ink-4)', paddingTop: 2 }}>Programme span: <b style={{ color: 'var(--vb-ink-2)', fontWeight: 600 }}>{span} days</b></div>
          </div>
          <div style={{ height: 1, background: 'var(--vb-line)', margin: '20px 0' }} />
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--vb-ink-3)', marginBottom: 12 }}>Phase windows</div>
          {phaseWindows.map((w) => (
            <div key={w.label} className="vb-phase-window-row">
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--vb-ink)' }}>{w.label}</div>
                <div style={{ fontSize: 12, color: 'var(--vb-ink-4)' }}>{w.detail}</div>
              </div>
              <span style={{ fontSize: 12.5, color: 'var(--vb-ink-2)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{w.window}</span>
            </div>
          ))}
        </div>

        <div className="vb-card vb-card-pad">
          <h3 style={{ marginBottom: 18 }}>Project details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {field('Project name', active.name, 'name')}
            {field('Client', active.client, 'client')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {field('Sector', active.sector, 'sector')}
              {field('Region', active.region, 'region')}
            </div>
            {field('Onboarding lead', active.csOwner, 'csOwner')}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: -4 }}>
              <span style={{ fontSize: 12, color: 'var(--vb-ink-4)', lineHeight: 1.4 }}>Default owner for all new tasks</span>
              <button
                type="button"
                className="vb-btn-sm"
                onClick={() => store.bulkSetOwner(active.csOwner)}
              >Apply to all existing tasks</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
