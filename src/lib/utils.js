import { STATUS, RISK_WINDOW_DAYS } from './constants.js';

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function dt(iso) {
  return new Date(iso + 'T00:00:00');
}

export function diffDays(a, b) {
  return Math.round((dt(b) - dt(a)) / 86400000);
}

export function addDays(iso, n) {
  const d = dt(iso);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function fmtDate(iso) {
  if (!iso) return '';
  const d = dt(iso);
  return d.getDate() + ' ' + MONTHS[d.getMonth()];
}

export function initials(name) {
  const m = (name || '').replace(/\(.*\)/, '').trim().split(/\s+/);
  return ((m[0] || '')[0] || '') + ((m[1] || '')[0] || '');
}

export function avatarColor(role) {
  return role === 'Visibuild CS' ? 'var(--vb-mid-green)' : role === 'Client' ? 'var(--vb-blue)' : 'var(--vb-purple)';
}

const OWNER_PALETTE = [
  '#2E7D6B', '#2947C4', '#7B3FB0', '#C07000', '#B52D2D',
  '#1B6FA8', '#4A7C3F', '#8B4513', '#5C5EA8', '#A0522D',
];

export function ownerColor(name) {
  if (!name) return '#9AA1A9';
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xFFFFFF;
  return OWNER_PALETTE[Math.abs(h) % OWNER_PALETTE.length];
}

export function risk(task, today) {
  if (task.status === 'done') return { key: 'done', label: 'Complete', color: 'var(--vb-pass)' };
  const d = diffDays(today, task.due);
  if (d < 0) return { key: 'overdue', label: (-d) + 'd overdue', color: 'var(--vb-defect)' };
  if (d <= RISK_WINDOW_DAYS) return { key: 'soon', label: d === 0 ? 'Due today' : 'Due in ' + d + 'd', color: 'var(--vb-hold)' };
  return { key: 'ontrack', label: 'On track', color: 'var(--vb-ink-4)' };
}

export function ragColor(tasks, today) {
  let overdue = 0, soon = 0, open = 0;
  tasks.forEach((t) => {
    if (t.status === 'done') return;
    open++;
    const d = diffDays(today, t.due);
    if (d < 0) overdue++;
    else if (d <= RISK_WINDOW_DAYS) soon++;
  });
  if (overdue) return 'var(--vb-defect)';
  if (soon) return 'var(--vb-hold)';
  if (open) return 'var(--vb-blue)';
  return 'var(--vb-pass)';
}

export function ragColorItems(items) {
  if (items.some((i) => i.status === 'blocked')) return 'var(--vb-defect)';
  const open = items.filter((i) => i.status !== 'done');
  if (items.length && !open.length) return 'var(--vb-pass)';
  if (open.length) return 'var(--vb-blue)';
  return 'var(--vb-charcoal-20)';
}

export function fileExt(name) {
  const p = (name || '').split('.');
  return (p.length > 1 ? p.pop() : 'file').slice(0, 4).toUpperCase();
}

export function sizeLabel(b) {
  if (b == null) return '';
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(0) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

export function isImageType(t) {
  return (t || '').indexOf('image/') === 0;
}

export function uid(prefix) {
  return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function allTasks(project) {
  const a = [];
  project.workstreams.forEach((w) => w.tasks.forEach((t) => a.push({ ...t, wsId: w.id, wsName: w.name })));
  return a;
}

export function findTask(project, id) {
  for (const w of project.workstreams) {
    const t = w.tasks.find((x) => x.id === id);
    if (t) return t;
  }
  return null;
}

export function findSub(project, id) {
  return (project.subcontractors || []).find((s) => s.id === id);
}

export function findTrade(project, sid, tid) {
  const s = findSub(project, sid);
  return s ? s.trades.find((t) => t.id === tid) : null;
}

export function findItem(project, sid, tid, cat, iid) {
  const t = findTrade(project, sid, tid);
  return t ? (t[cat] || []).find((x) => x.id === iid) : null;
}
