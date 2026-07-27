export const STATUS = {
  not_started: { label: 'Not started', bar: '#C6CAD0', bg: 'var(--vb-charcoal-10)', fg: 'var(--vb-ink-2)', dot: '#9AA1A9' },
  in_progress: { label: 'In progress', bar: 'var(--vb-blue)', bg: '#E3EAFF', fg: '#2947C4', dot: 'var(--vb-blue)' },
  blocked: { label: 'Waiting on issue of information', bar: 'var(--vb-defect)', bg: 'var(--vb-defect-soft)', fg: '#9A2617', dot: 'var(--vb-defect)' },
  done: { label: 'Done', bar: 'var(--vb-pass)', bg: 'var(--vb-pass-soft)', fg: '#004C3D', dot: 'var(--vb-pass)' },
};

export const STATUS_KEYS = ['not_started', 'in_progress', 'blocked', 'done'];

export const PHASE_OPTIONS = [
  { value: '30', label: 'Phase 1' },
  { value: '60', label: 'Phase 2' },
  { value: '90', label: 'Phase 3' },
];

export const PHASE_LABEL = { '30': 'Phase 1', '60': 'Phase 2', '90': 'Phase 3' };

export const CHANNEL_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'call', label: 'Call' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'site', label: 'Site visit' },
];

export const CHANNEL_COLORS = {
  email: { bg: 'var(--vb-info-soft)', fg: '#2947C4' },
  call: { bg: '#EAE0FF', fg: '#6B3FB0' },
  meeting: { bg: 'var(--vb-pass-soft)', fg: '#004C3D' },
  site: { bg: 'var(--vb-hold-soft)', fg: '#8A4200' },
};

export const WORKSTREAM_DEFS = [
  ['loc', 'Location tree'],
  ['tpl', 'Templates & ITP/ITC'],
  ['train', 'Training'],
  ['doc', 'Document control'],
  ['data', 'Data import'],
  ['prog', 'Programme & milestones'],
  ['golive', 'Go-live & adoption'],
];

export const WS_DESCRIPTIONS = {
  loc: 'Set up the project structure and location tree so every inspection has a home — levels, zones and lots.',
  tpl: 'Configure the ITP and ITC template library so every inspection is standardised and compliant.',
  trades: 'Invite, train and activate each trade partner — from first login to their first completed inspection.',
  train: 'Get the client’s admin and field teams confident in Visibuild with hands-on sessions.',
  doc: 'Connect the drawing register and revision workflow so the field always works from current drawings.',
  data: 'Bring historical NCRs, registers and tickets across so nothing starts from a blank slate.',
  prog: 'Link Visibuild milestones to the master programme and configure the progress trackers.',
  golive: 'Take the project live and drive adoption through the Phase 1 / Phase 2 / Phase 3 checkpoints.',
};

export const PHASE_META = {
  '30': { label: 'Setup phase', color: 'var(--vb-blue)', window: 'Setup & config' },
  '60': { label: 'First-inspections phase', color: 'var(--vb-hold)', window: 'First live inspections' },
  '90': { label: 'Adoption phase', color: 'var(--vb-mid-green)', window: 'Full adoption' },
};

export const RISK_WINDOW_DAYS = 7;
