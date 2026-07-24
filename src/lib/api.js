const STATE_URL = '/.netlify/functions/state';
const FILES_URL = '/.netlify/functions/files';

export async function fetchState() {
  const res = await fetch(STATE_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load shared data (' + res.status + ')');
  return res.json();
}

export async function saveState(state) {
  const res = await fetch(STATE_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(state),
  });
  if (!res.ok) throw new Error('Failed to save (' + res.status + ')');
  return res.json();
}

export async function uploadFile(file) {
  const res = await fetch(FILES_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/octet-stream',
      'x-file-name': encodeURIComponent(file.name),
      'x-file-type': file.type || 'application/octet-stream',
    },
    body: file,
  });
  if (!res.ok) throw new Error('Upload failed (' + res.status + ')');
  return res.json();
}

export function fileUrl(id) {
  return FILES_URL + '?id=' + encodeURIComponent(id);
}

export async function deleteFile(id) {
  try {
    await fetch(FILES_URL + '?id=' + encodeURIComponent(id), { method: 'DELETE' });
  } catch {
    /* best-effort */
  }
}

const NAME_KEY = 'vb-onb-username';

export function getSavedName() {
  try {
    return localStorage.getItem(NAME_KEY) || '';
  } catch {
    return '';
  }
}

export function saveName(name) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    /* ignore */
  }
}
