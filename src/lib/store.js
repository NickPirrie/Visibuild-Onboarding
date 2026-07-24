import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchState, saveState, uploadFile, deleteFile } from './api.js';
import { seedProjects, newProject } from './seed.js';
import { addDays, findTask, findSub, findTrade, findItem, todayIso, uid } from './utils.js';

const POLL_MS = 8000;
const SAVE_DEBOUNCE_MS = 500;
const QUIET_WINDOW_MS = 4000;

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function useStore(userName) {
  const [state, setState] = useState(() => ({
    projects: [],
    activeId: null,
    loaded: false,
    saving: false,
    toast: null,
    section: 'summary',
    pickerOpen: false,
    statusMenuFor: null,
    expanded: {},
    groups: { workstreams: true, subs: true, rollout: true },
    ganttNameW: 300,
    taskStatusFilter: 'all',
    taskPhaseFilter: 'all',
    taskSort: 'order',
  }));

  const lastEditRef = useRef(0);
  const saveTimerRef = useRef(null);
  const toastTimerRef = useRef(null);
  const dragIdRef = useRef(null);
  const pendingTargetRef = useRef(null);
  const fileInputRef = useRef(null);

  // ---------------- initial load + polling ----------------
  useEffect(() => {
    let cancelled = false;
    async function boot() {
      try {
        const remote = await fetchState();
        if (cancelled) return;
        if (remote && Array.isArray(remote.projects) && remote.projects.length) {
          setState((s) => ({ ...s, projects: remote.projects, activeId: s.activeId || remote.projects[0].id, loaded: true }));
        } else {
          const seeded = seedProjects();
          setState((s) => ({ ...s, projects: seeded, activeId: seeded[0].id, loaded: true }));
          saveState({ projects: seeded }).catch(() => {});
        }
      } catch (e) {
        console.warn('Failed to load shared state, falling back to local seed', e);
        if (cancelled) return;
        const seeded = seedProjects();
        setState((s) => ({ ...s, projects: seeded, activeId: seeded[0].id, loaded: true }));
      }
    }
    boot();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const iv = setInterval(async () => {
      if (Date.now() - lastEditRef.current < QUIET_WINDOW_MS) return;
      try {
        const remote = await fetchState();
        if (remote && Array.isArray(remote.projects)) {
          setState((s) => {
            const stillActive = remote.projects.find((p) => p.id === s.activeId);
            return { ...s, projects: remote.projects, activeId: stillActive ? s.activeId : (remote.projects[0]?.id || null) };
          });
        }
      } catch {
        /* offline / transient — keep local state */
      }
    }, POLL_MS);
    return () => clearInterval(iv);
  }, []);

  const persist = useCallback((projects) => {
    setState((s) => ({ ...s, saving: true }));
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await saveState({ projects });
      } catch (e) {
        console.warn('save failed', e);
      } finally {
        setState((s) => ({ ...s, saving: false }));
      }
    }, SAVE_DEBOUNCE_MS);
  }, []);

  const mutate = useCallback((fn) => {
    lastEditRef.current = Date.now();
    setState((s) => {
      const projects = s.projects.map((p) => (p.id === s.activeId ? clone(p) : p));
      const active = projects.find((p) => p.id === s.activeId);
      if (active) fn(active);
      persist(projects);
      return { ...s, projects };
    });
  }, [persist]);

  const toast = useCallback((msg) => {
    setState((s) => ({ ...s, toast: msg }));
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setState((s) => ({ ...s, toast: null })), 2200);
  }, []);

  const go = useCallback((section) => {
    setState((s) => ({ ...s, section, statusMenuFor: null, pickerOpen: false }));
  }, []);

  const active = state.projects.find((p) => p.id === state.activeId) || state.projects[0];

  // ---------------- project CRUD ----------------
  const pickProject = useCallback((id) => {
    setState((s) => ({ ...s, activeId: id, pickerOpen: false, section: 'summary', statusMenuFor: null }));
  }, []);

  const addProject = useCallback(() => {
    const proj = newProject();
    lastEditRef.current = Date.now();
    setState((s) => {
      const projects = [...s.projects, proj];
      persist(projects);
      return { ...s, projects, activeId: proj.id, pickerOpen: false, section: 'settings', statusMenuFor: null };
    });
    toast('Project created');
  }, [persist, toast]);

  const delProject = useCallback((id) => {
    setState((s) => {
      if (s.projects.length <= 1) return s;
      const projects = s.projects.filter((p) => p.id !== id);
      const activeId = s.activeId === id ? projects[0].id : s.activeId;
      lastEditRef.current = Date.now();
      persist(projects);
      return { ...s, projects, activeId, statusMenuFor: null };
    });
    toast('Project deleted');
  }, [persist, toast]);

  const editProject = useCallback((field, val) => {
    mutate((p) => { p[field] = val; });
  }, [mutate]);

  // ---------------- workstream / task ----------------
  const editWs = useCallback((id, val) => mutate((p) => {
    const w = p.workstreams.find((x) => x.id === id);
    if (w) w.name = val;
  }), [mutate]);

  const delWs = useCallback((id) => {
    mutate((p) => { p.workstreams = p.workstreams.filter((w) => w.id !== id); });
    setState((s) => ({ ...s, section: 'summary' }));
    toast('Workstream deleted');
  }, [mutate, toast]);

  const addWs = useCallback(() => {
    const id = 'ws-' + Date.now().toString(36);
    mutate((p) => { p.workstreams.push({ id, name: 'New workstream', tasks: [] }); });
    go('ws:' + id);
  }, [mutate, go]);

  const setStatus = useCallback((id, key) => {
    mutate((p) => { const t = findTask(p, id); if (t) t.status = key; });
    setState((s) => ({ ...s, statusMenuFor: null }));
  }, [mutate]);

  const editTask = useCallback((id, field, val) => {
    mutate((p) => { const t = findTask(p, id); if (t) t[field] = val; });
  }, [mutate]);

  const addNote = useCallback((id) => {
    mutate((p) => {
      const t = findTask(p, id);
      if (t) { t.notes = t.notes || []; t.notes.push({ id: uid('n'), text: '' }); }
    });
  }, [mutate]);

  const editNote = useCallback((id, nid, v) => {
    mutate((p) => {
      const t = findTask(p, id);
      if (t && t.notes) { const n = t.notes.find((x) => x.id === nid); if (n) n.text = v; }
    });
  }, [mutate]);

  const delNote = useCallback((id, nid) => {
    mutate((p) => { const t = findTask(p, id); if (t) t.notes = (t.notes || []).filter((x) => x.id !== nid); });
  }, [mutate]);

  const addTask = useCallback((wsId, phase) => {
    mutate((p) => {
      const w = p.workstreams.find((x) => x.id === wsId);
      if (w) {
        const today = todayIso();
        w.tasks.push({
          id: uid('t'), title: 'New task', owner: active?.csOwner || '', role: 'Visibuild CS',
          phase: phase || '60', status: 'not_started', start: today, due: addDays(today, 14),
          notes: [], evidence: [],
        });
      }
    });
  }, [mutate, active]);

  const delTask = useCallback((id) => {
    mutate((p) => { p.workstreams.forEach((w) => { w.tasks = w.tasks.filter((t) => t.id !== id); }); });
    toast('Task deleted');
  }, [mutate, toast]);

  const reorderTask = useCallback((targetId) => {
    const drag = dragIdRef.current;
    if (!drag || drag === targetId) return;
    mutate((p) => {
      for (const w of p.workstreams) {
        const from = w.tasks.findIndex((t) => t.id === drag);
        const to = w.tasks.findIndex((t) => t.id === targetId);
        if (from > -1 && to > -1) { const [m] = w.tasks.splice(from, 1); w.tasks.splice(to, 0, m); break; }
      }
    });
    dragIdRef.current = null;
  }, [mutate]);

  // ---------------- subcontractors ----------------
  const addSub = useCallback(() => {
    mutate((p) => { p.subcontractors = p.subcontractors || []; p.subcontractors.push({ id: uid('s'), name: 'New subcontractor', trades: [] }); });
  }, [mutate]);

  const delSub = useCallback((id) => {
    mutate((p) => { p.subcontractors = (p.subcontractors || []).filter((s) => s.id !== id); });
    toast('Subcontractor removed');
  }, [mutate, toast]);

  const editSub = useCallback((id, v) => mutate((p) => { const s = findSub(p, id); if (s) s.name = v; }), [mutate]);

  const addTrade = useCallback((sid) => {
    const tid = uid('t');
    const today = todayIso();
    mutate((p) => {
      const s = findSub(p, sid);
      if (s) {
        s.trades.push({
          id: tid, name: 'New trade',
          itps: [{ id: uid('it'), title: 'ITP submission & digitisation', status: 'not_started', owner: '', role: 'Trade partner', phase: '60', due: addDays(today, 21), evidence: [] }],
          training: [{ id: uid('it'), title: 'Field training', status: 'not_started', owner: '', role: 'Trade partner', phase: '60', due: addDays(today, 21), evidence: [] }],
        });
      }
    });
    setState((s) => ({ ...s, expanded: { ...s.expanded, ['sub:' + sid]: true, ['trade:' + tid]: true } }));
  }, [mutate]);

  const delTrade = useCallback((sid, tid) => {
    mutate((p) => { const s = findSub(p, sid); if (s) s.trades = s.trades.filter((t) => t.id !== tid); });
  }, [mutate]);

  const editTrade = useCallback((sid, tid, v) => mutate((p) => { const t = findTrade(p, sid, tid); if (t) t.name = v; }), [mutate]);

  const addItem = useCallback((sid, tid, cat) => {
    const today = todayIso();
    mutate((p) => {
      const t = findTrade(p, sid, tid);
      if (t) {
        t[cat] = t[cat] || [];
        t[cat].push({ id: uid('it'), title: cat === 'itps' ? 'New ITP' : 'New training', status: 'not_started', owner: '', role: 'Trade partner', phase: '60', due: addDays(today, 21), evidence: [] });
      }
    });
  }, [mutate]);

  const delItem = useCallback((sid, tid, cat, iid) => {
    mutate((p) => { const t = findTrade(p, sid, tid); if (t) t[cat] = (t[cat] || []).filter((x) => x.id !== iid); });
  }, [mutate]);

  const editItem = useCallback((sid, tid, cat, iid, field, v) => {
    mutate((p) => { const it = findItem(p, sid, tid, cat, iid); if (it) it[field] = v; });
  }, [mutate]);

  const setItemStatus = useCallback((sid, tid, cat, iid, key) => {
    mutate((p) => { const it = findItem(p, sid, tid, cat, iid); if (it) it.status = key; });
    setState((s) => ({ ...s, statusMenuFor: null }));
  }, [mutate]);

  // ---------------- correspondences ----------------
  const addCorr = useCallback(() => {
    mutate((p) => {
      p.correspondences = p.correspondences || [];
      p.correspondences.unshift({ id: uid('c'), date: todayIso(), who: '', channel: 'email', summary: '', attachments: [] });
    });
  }, [mutate]);

  const editCorr = useCallback((id, f, v) => mutate((p) => { const c = (p.correspondences || []).find((x) => x.id === id); if (c) c[f] = v; }), [mutate]);
  const delCorr = useCallback((id) => mutate((p) => { p.correspondences = (p.correspondences || []).filter((x) => x.id !== id); }), [mutate]);

  // ---------------- comments ----------------
  const addComment = useCallback(() => {
    const today = todayIso();
    mutate((p) => {
      p.comments = p.comments || [];
      p.comments.unshift({ id: uid('m'), author: userName || active?.csOwner || 'Team', when: fmtShort(today), text: '' });
    });
  }, [mutate, userName, active]);

  const editComment = useCallback((id, v) => mutate((p) => { const c = (p.comments || []).find((x) => x.id === id); if (c) c.text = v; }), [mutate]);
  const delComment = useCallback((id) => mutate((p) => { p.comments = (p.comments || []).filter((x) => x.id !== id); }), [mutate]);

  // ---------------- files ----------------
  const ingestFiles = useCallback(async (fileList, target) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const metas = [];
    for (const file of files) {
      try {
        const meta = await uploadFile(file);
        metas.push(meta);
      } catch (e) {
        console.warn('upload failed', e);
      }
    }
    if (!metas.length) return;
    mutate((p) => {
      if (target.kind === 'task') {
        const t = findTask(p, target.id);
        if (t) t.evidence = (t.evidence || []).concat(metas);
      } else if (target.kind === 'item') {
        const it = findItem(p, target.sid, target.tid, target.cat, target.id);
        if (it) it.evidence = (it.evidence || []).concat(metas);
      } else if (target.kind === 'corr') {
        const c = (p.correspondences || []).find((x) => x.id === target.id);
        if (c) c.attachments = (c.attachments || []).concat(metas);
      }
    });
    toast(metas.length + ' file' + (metas.length > 1 ? 's' : '') + ' attached');
  }, [mutate, toast]);

  const removeFile = useCallback((kind, owner, fileId) => {
    deleteFile(fileId);
    mutate((p) => {
      let holder = null, key = 'evidence';
      if (kind === 'task') holder = findTask(p, owner);
      else if (kind === 'item') holder = findItem(p, owner.sid, owner.tid, owner.cat, owner.iid);
      else { holder = (p.correspondences || []).find((x) => x.id === owner); key = 'attachments'; }
      if (holder) holder[key] = (holder[key] || []).filter((x) => x.id !== fileId);
    });
  }, [mutate]);

  const openFilePicker = useCallback((target) => {
    pendingTargetRef.current = target;
    if (fileInputRef.current) fileInputRef.current.click();
  }, []);

  const onFilesPicked = useCallback((e) => {
    if (pendingTargetRef.current) ingestFiles(e.target.files, pendingTargetRef.current);
    e.target.value = '';
  }, [ingestFiles]);

  // ---------------- misc UI ----------------
  const toggleGroup = useCallback((k) => setState((s) => ({ ...s, groups: { ...s.groups, [k]: !s.groups[k] } })), []);
  const toggleNode = useCallback((k) => setState((s) => ({ ...s, expanded: { ...s.expanded, [k]: !s.expanded[k] } })), []);
  const setFilter = useCallback((field, v) => setState((s) => ({ ...s, [field]: v })), []);
  const openStatusMenu = useCallback((id) => setState((s) => ({ ...s, statusMenuFor: s.statusMenuFor === id ? null : id })), []);
  const closeStatusMenu = useCallback(() => setState((s) => ({ ...s, statusMenuFor: null })), []);
  const setGanttNameW = useCallback((w) => setState((s) => ({ ...s, ganttNameW: w })), []);
  const setPickerOpen = useCallback((v) => setState((s) => ({ ...s, pickerOpen: v })), []);

  const exportPdf = useCallback(() => window.print(), []);

  return {
    state, active, dragIdRef, fileInputRef,
    go, toast,
    pickProject, addProject, delProject, editProject,
    editWs, delWs, addWs,
    setStatus, editTask, addNote, editNote, delNote, addTask, delTask, reorderTask,
    addSub, delSub, editSub, addTrade, delTrade, editTrade, addItem, delItem, editItem, setItemStatus,
    addCorr, editCorr, delCorr,
    addComment, editComment, delComment,
    ingestFiles, removeFile, openFilePicker, onFilesPicked,
    toggleGroup, toggleNode, setFilter, openStatusMenu, closeStatusMenu, setGanttNameW, setPickerOpen,
    exportPdf,
  };
}

function fmtShort(iso) {
  const d = new Date(iso + 'T00:00:00');
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return d.getDate() + ' ' + MONTHS[d.getMonth()];
}
