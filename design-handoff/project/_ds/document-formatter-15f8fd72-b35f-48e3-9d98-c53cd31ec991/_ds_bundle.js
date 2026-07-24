/* @ds-bundle: {"format":4,"namespace":"VisibuildDocumentPresentationFormatter_15f8fd","components":[],"sourceHashes":{"covers/design-canvas.jsx":"3b0e985041dd","studio/app.jsx":"3e764b051807","studio/blocks.jsx":"defbf6b71652","studio/editor.jsx":"0b047405e609","studio/parser.js":"2df7372aa472","studio/sample.js":"aa02b2cbe6d8"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.VisibuildDocumentPresentationFormatter_15f8fd = window.VisibuildDocumentPresentationFormatter_15f8fd || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// covers/design-canvas.jsx
try { (() => {
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
  // isolation:isolate contains artboard content's z-indexes so a
  // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
  // the .dc-menu popover that drops into the top of the card.
  '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}',
  // Per-artboard header: grip + label on the left, delete/expand on the
  // right. Single flex row; when the artboard's on-screen width is too
  // narrow for both the label yields (ellipsis, then hidden entirely below
  // ~4ch via the container query) and the buttons stay on the row.
  '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;', '  display:flex;align-items:center;container-type:inline-size}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}', '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;', '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
  // Below ~4ch of label room: hide the label entirely, and drop the grip to
  // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
  // until the card is moused.
  '@container (max-width: 110px){', '  .dc-labeltext{display:none}', '  .dc-grip{opacity:0}', '  [data-dc-slot]:hover .dc-grip{opacity:1}', '}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}', '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}', '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}', '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}', '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;', '  font:inherit;transition:background .12s,color .12s}', '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
  // Slot hosting an open menu floats above later siblings (which otherwise
  // paint on top — same z-index:auto, later DOM order) so the popup isn't
  // clipped by the next card.
  '[data-dc-slot]:has(.dc-menu){z-index:10}', '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;', '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}', '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;', '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;', '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}', '.dc-menu button:hover{background:rgba(0,0,0,.05)}', '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}', '.dc-menu .dc-danger{color:#c96442}', '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
  // Chrome (titles / labels / buttons) counter-scales against the viewport
  // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
  // DCViewport on every transform update and inherits to all descendants —
  // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
  // it the same way.
  //
  // The header uses transform:scale (out-of-flow, so layout impact doesn't
  // matter) with its world-space width set to card-width / inv-zoom so that
  // after counter-scaling its on-screen width exactly matches the card's —
  // that's what lets the container query + text-overflow behave against the
  // card's visible edge at every zoom level.
  //
  // The section head uses CSS zoom instead of transform so its layout box
  // grows with the counter-scale, pushing the card row down — otherwise the
  // constant-screen-size title would overflow into the (shrinking) world-
  // space gap and overlap the artboard headers at low zoom.
  '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));', '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}', '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// Recursively unwrap React.Fragment so <>…</> grouping doesn't hide
// DCSection/DCArtboard children from the type-based walks below.
function dcFlatten(children) {
  const out = [];
  React.Children.forEach(children, c => {
    if (c && c.type === React.Fragment) out.push(...dcFlatten(c.props.children));else out.push(c);
  });
  return out;
}

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Fragments are flattened; wrapping in other
  // elements still opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  dcFlatten(children).forEach(sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    dcFlatten(sec.props.children).forEach(ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? persisted.hidden || [] : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  // Persist viewport across reloads so the user lands back where they were
  // after an agent edit or browser refresh. The sandbox origin is already
  // per-project; pathname keeps multiple canvas files in one project apart.
  const tfKey = 'dc-viewport:' + location.pathname;
  const saveT = React.useRef(0);
  const lastPostedScale = React.useRef();
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Exposed for zoom-invariant chrome (labels, buttons, TweaksPanel).
    el.style.setProperty('--dc-inv-zoom', String(1 / scale));
    // Keep the host toolbar's % readout in sync with the canvas scale. Pan
    // ticks leave scale unchanged — skip the cross-frame post for those.
    if (lastPostedScale.current !== scale) {
      lastPostedScale.current = scale;
      window.parent.postMessage({
        type: '__dc_zoom',
        scale
      }, '*');
    }
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    }, 200);
  }, [tfKey]);
  React.useLayoutEffect(() => {
    const flush = () => {
      clearTimeout(saveT.current);
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    };
    try {
      const s = JSON.parse(localStorage.getItem(tfKey) || 'null');
      if (s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.scale)) {
        tf.current = {
          x: s.x,
          y: s.y,
          scale: Math.min(maxScale, Math.max(minScale, s.scale))
        };
        apply();
      }
    } catch {}
    // Flush on pagehide and unmount so a reload within the 200ms debounce
    // window doesn't drop the last pan/zoom.
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // --dc-inv-zoom consumers (.dc-sectionhead's CSS zoom, each section's
      // marginBottom) reflow on every scale change, vertically shifting the
      // world layout — so a world point mathematically pinned under the cursor
      // drifts as you zoom (content creeps up on zoom-in, down on zoom-out).
      // Anchor the DOM element under the cursor instead: record its screen Y,
      // apply the transform + --dc-inv-zoom, then cancel whatever vertical
      // drift the reflow introduced so it stays put on screen.
      let marker = null,
        markerY0 = 0;
      if (k !== 1) {
        const hit = document.elementFromPoint(cx, cy);
        marker = hit && hit.closest ? hit.closest('[data-dc-slot],[data-dc-section]') : null;
        if (marker) markerY0 = marker.getBoundingClientRect().top;
      }
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
      if (marker) {
        // A pure zoom around (cx, cy) maps screen Y → cy + (Y - cy) * k. Any
        // departure after the --dc-inv-zoom reflow is the layout drift.
        const drift = marker.getBoundingClientRect().top - (cy + (markerY0 - cy) * k);
        if (Math.abs(drift) > 0.1) {
          t.y -= drift;
          apply();
        }
      }
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if ((e.ctrlKey || e.metaKey) && !isMouseWheel(e)) {
        // trackpad pinch, or ctrl/cmd + smooth-scroll mouse. Notched
        // wheels fall through to the fixed-step branch below.
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    // Host-driven zoom (toolbar % menu). Zooms around viewport centre so the
    // visible midpoint stays fixed — matching the host's iframe-zoom feel.
    const onHostMsg = e => {
      const d = e.data;
      if (d && d.type === '__dc_set_zoom' && typeof d.scale === 'number') {
        const r = vp.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, d.scale / tf.current.scale);
      } else if (d && d.type === '__dc_probe') {
        // Host's [readyGen] reset asks whether a canvas is present; it
        // fires on the iframe's native 'load', which for canvases with
        // images/fonts is after our mount-time announce, so re-announce.
        // Clear the pan-tick guard so apply() re-posts the current scale
        // even if it's unchanged — the host just reset dcScale to 1.
        window.parent.postMessage({
          type: '__dc_present'
        }, '*');
        lastPostedScale.current = undefined;
        apply();
      }
    };
    window.addEventListener('message', onHostMsg);
    // Announce canvas mode so the host toolbar proxies its % control here
    // instead of scaling the iframe element (which would just shrink the
    // viewport window of an infinite canvas). The apply() that follows emits
    // the initial __dc_zoom so the toolbar % is correct before first pinch.
    // lastPostedScale reset mirrors the __dc_probe handler: the layout
    // effect's restore-path apply() may already have posted the restored
    // scale (before __dc_present), so clear the guard to re-post it in order.
    window.parent.postMessage({
      type: '__dc_present'
    }, '*');
    lastPostedScale.current = undefined;
    apply();
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('message', onHostMsg);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(dcFlatten(children));
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const sec = ctx && sid && ctx.section(sid) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map(a => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? sec.hidden || [] : [];
  const srcOrder = allIds.filter(k => !hidden.includes(k));
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-sectionhead",
    style: {
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onDelete: () => ctx && ctx.patchSection(sid, x => ({
      hidden: [...(x.srcKey === srcKey ? x.hidden || [] : []), k],
      srcKey
    })),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}

// Per-artboard export (kind: 'png' | 'html'). Both paths share the same
// self-contained clone: computed styles baked in, @font-face / <img> /
// inline-style background-image urls inlined as data URIs. PNG wraps the
// clone in foreignObject→canvas at 3× the artboard's natural width×height
// (same pipeline the host uses for page captures); HTML wraps it in a
// minimal standalone document. Both are independent of viewport zoom.
async function dcExport(node, w, h, name, kind) {
  try {
    await document.fonts.ready;
  } catch {}
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);

  // Collect @font-face rules. ss.cssRules throws SecurityError on
  // cross-origin sheets (e.g. fonts.googleapis.com) — in that case fetch
  // the CSS text directly (those endpoints send ACAO:*) and regex-extract
  // the blocks. @import and @media/@supports are walked so nested
  // @font-face rules aren't missed.
  const fontRules = [],
    pending = [],
    seen = new Set();
  const scrapeCss = href => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(fetch(href).then(r => r.text()).then(css => {
      for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
        css: m,
        base: href
      });
      for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
    }).catch(() => {}));
  };
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
        css: r.cssText,
        base
      });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
        const ibase = r.styleSheet.href || base;
        try {
          walk(r.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (r.cssRules) walk(r.cssRules, base);
    }
  };
  for (const ss of document.styleSheets) {
    const base = ss.href || location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();
  const fontCss = (await Promise.all(fontRules.map(async rule => {
    let out = rule.css,
      m;
    const re = /url\((['"]?)([^'")]+)\1\)/g;
    while (m = re.exec(rule.css)) {
      if (m[2].indexOf('data:') === 0) continue;
      let abs;
      try {
        abs = new URL(m[2], rule.base).href;
      } catch {
        continue;
      }
      out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
    }
    return out;
  }))).join('\n');
  const cloneStyled = src => {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
      if (src.tagName === 'CANVAS') try {
        const im = document.createElement('img');
        im.src = src.toDataURL();
        im.setAttribute('style', txt);
        return im;
      } catch {}
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };
  const clone = cloneStyled(node);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  // Drop the card's own shadow/radius so the export is a flush w×h rect;
  // the artboard's own background (if any) is already in the computed style.
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  const jobs = [];
  clone.querySelectorAll('img').forEach(el => {
    const s = el.getAttribute('src');
    if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(el.src).then(d => el.setAttribute('src', d)));
  });
  [clone, ...clone.querySelectorAll('*')].forEach(el => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while (m = re.exec(bg)) {
      const tok = m[0],
        url = m[1];
      if (url.indexOf('data:') === 0) continue;
      jobs.push(toDataURL(url).then(d => {
        el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
      }));
    }
  });
  await Promise.all(jobs);
  const xml = new XMLSerializer().serializeToString(clone);
  const save = (blob, ext) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  if (kind === 'html') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title>' + (fontCss ? '<style>' + fontCss + '</style>' : '') + '</head><body style="margin:0">' + xml + '</body></html>';
    return save(new Blob([html], {
      type: 'text/html'
    }), 'html');
  }

  // PNG: the SVG's own width/height must be the output resolution — an
  // <img>-loaded SVG rasterizes at its intrinsic size, so sizing it at 1×
  // and ctx.scale()-ing up would just upscale a 1× bitmap. viewBox maps the
  // w×h foreignObject onto the px·w × px·h SVG canvas so the browser renders
  // the HTML at full resolution.
  const px = 3;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const cv = document.createElement('canvas');
  cv.width = w * px;
  cv.height = h * px;
  cv.getContext('2d').drawImage(img, 0, 0);
  cv.toBlob(blob => save(blob, 'png'), 'image/png');
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus,
  onDelete
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // ⋯ menu: close on any outside pointerdown. Two-click delete lives inside
  // the menu — first click arms the row, second commits; closing disarms.
  React.useEffect(() => {
    if (!menuOpen) {
      setConfirming(false);
      return;
    }
    const off = e => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);
  const doExport = kind => {
    setMenuOpen(false);
    if (!cardRef.current) return;
    const name = String(label || id || 'artboard').replace(/[^\w\s.-]+/g, '_');
    dcExport(cardRef.current, width, height, name, kind).catch(e => console.error('[design-canvas] export failed:', e));
  };

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-header",
    "data-omelette-chrome": "",
    style: {
      color: DC.label
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-btns"
  }, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dc-kebab",
    title: "More",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2.5",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "6",
    r: "1.1"
  }))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "dc-menu",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('png')
  }, "Download PNG"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('html')
  }, "Download HTML"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "dc-danger",
    onClick: () => {
      if (confirming) {
        setMenuOpen(false);
        onDelete();
      } else setConfirming(true);
    }
  }, confirming ? 'Click again to delete' : 'Delete'))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    // Sections whose artboards are all deleted have slotIds:[] — step past
    // them to the next non-empty section so ↑/↓ doesn't dead-end.
    const n = sectionOrder.length;
    for (let i = 1; i < n; i++) {
      const ns = sectionOrder[((secIdx + d * i) % n + n) % n];
      const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
      if (first) {
        ctx.setFocus(`${ns}/${first}`);
        return;
      }
    }
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.filter(sid => sectionMeta[sid].slotIds.length).map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "covers/design-canvas.jsx", error: String((e && e.message) || e) }); }

// studio/app.jsx
try { (() => {
// App shell — top bar, editor sidebar, document preview.
// Glues together blocks.jsx, editor.jsx, parser.js, sample.js.

const {
  useState,
  useMemo,
  useRef,
  useEffect
} = React;
const _Frag = React.Fragment;
const BLOCK_TYPES = [{
  type: "hero",
  label: "Hero"
}, {
  type: "section-title",
  label: "Section title"
}, {
  type: "pullquote",
  label: "Pull quote"
}, {
  type: "comparison",
  label: "Comparison table"
}, {
  type: "stat-callout",
  label: "Stat callout"
}, {
  type: "problem-list",
  label: "Problem list"
}, {
  type: "capabilities",
  label: "Capabilities"
}, {
  type: "logo-strip",
  label: "Logo / proof strip"
}, {
  type: "how-it-works",
  label: "How it works (steps)"
}, {
  type: "callout",
  label: "Highlight callout"
}, {
  type: "contacts",
  label: "Contacts grid"
}, {
  type: "card-grid",
  label: "Card grid"
}, {
  type: "cta-strip",
  label: "CTA strip"
}, {
  type: "paragraph",
  label: "Paragraph"
}];
let _id = 1;
const newId = () => `b${Date.now()}-${_id++}`;
const blank = type => {
  const b = window.blankBlock ? window.blankBlock(type) : {
    id: newId(),
    type
  };
  return {
    ...b,
    id: b.id || newId()
  };
};

// ---- Page chrome (matches the PDFs: VISIBUILD wordmark left, eyebrow right; page number bottom-right) ----
function PageChrome({
  page,
  idx,
  total,
  surface,
  docTitle
}) {
  const dark = surface === "dark";
  return /*#__PURE__*/React.createElement(_Frag, null, /*#__PURE__*/React.createElement("header", {
    className: `page-chrome page-chrome--top ${dark ? "on-dark" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-chrome__left"
  }, /*#__PURE__*/React.createElement("span", {
    className: "page-chrome__wordmark"
  }, "VISIBUILD")), /*#__PURE__*/React.createElement("div", {
    className: "page-chrome__right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "page-chrome__eyebrow"
  }, page.chrome && page.chrome.eyebrowText || docTitle))), /*#__PURE__*/React.createElement("footer", {
    className: `page-chrome page-chrome--bot ${dark ? "on-dark" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-chrome__left"
  }, /*#__PURE__*/React.createElement("span", {
    className: "page-chrome__num"
  }, String(idx + 1).padStart(2, "0"), " / ", String(total).padStart(2, "0"))), /*#__PURE__*/React.createElement("div", {
    className: "page-chrome__right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "page-chrome__mark"
  }, "visibuild.com"))));
}

// ---- Document preview ----
function DocPreview({
  doc,
  density
}) {
  const total = doc.pages.length;
  return /*#__PURE__*/React.createElement("div", {
    className: `doc doc--${density}`
  }, doc.pages.map((page, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `page surface-${page.surface || "light"}`
  }, /*#__PURE__*/React.createElement(PageChrome, {
    page: page,
    idx: i,
    total: total,
    surface: page.surface,
    docTitle: doc.title
  }), /*#__PURE__*/React.createElement("div", {
    className: "page__inner"
  }, page.blocks.map(b => /*#__PURE__*/React.createElement(window.RenderBlock, {
    key: b.id,
    block: b,
    surface: page.surface
  }))))));
}

// ---- Editor sidebar ----
function PageHeader({
  page,
  idx,
  total,
  onChange,
  onDelete,
  onMove
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ed-page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ed-page-head__title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ed-page-head__num"
  }, "PAGE ", String(idx + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("div", {
    className: "ed-page-head__actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ed-mini",
    onClick: () => onMove(-1),
    disabled: idx === 0
  }, "\u2191"), /*#__PURE__*/React.createElement("button", {
    className: "ed-mini",
    onClick: () => onMove(1),
    disabled: idx === total - 1
  }, "\u2193"), /*#__PURE__*/React.createElement("button", {
    className: "ed-mini ed-mini--danger",
    onClick: onDelete
  }, "\xD7"))), /*#__PURE__*/React.createElement("div", {
    className: "ed-page-head__surface"
  }, /*#__PURE__*/React.createElement("button", {
    className: `ed-pill ${page.surface === "light" ? "active" : ""}`,
    onClick: () => onChange({
      ...page,
      surface: "light"
    })
  }, "Paper"), /*#__PURE__*/React.createElement("button", {
    className: `ed-pill ${page.surface === "dark" ? "active" : ""}`,
    onClick: () => onChange({
      ...page,
      surface: "dark"
    })
  }, "Charcoal")));
}
function BlockCard({
  block,
  idx,
  total,
  onChange,
  onDelete,
  onMove
}) {
  const [open, setOpen] = useState(true);
  const label = (BLOCK_TYPES.find(t => t.type === block.type) || {}).label || block.type;
  const summary = block.headline || block.eyebrow || block.heading || block.text || block.stat || "(empty)";
  return /*#__PURE__*/React.createElement("div", {
    className: `ed-block ${open ? "is-open" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ed-block__head",
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("div", {
    className: "ed-block__head-left"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ed-block__chev"
  }, open ? "▾" : "▸"), /*#__PURE__*/React.createElement("span", {
    className: "ed-block__type"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "ed-block__summary"
  }, summary && summary.slice(0, 60))), /*#__PURE__*/React.createElement("div", {
    className: "ed-block__head-right",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "ed-mini",
    onClick: () => onMove(-1),
    disabled: idx === 0
  }, "\u2191"), /*#__PURE__*/React.createElement("button", {
    className: "ed-mini",
    onClick: () => onMove(1),
    disabled: idx === total - 1
  }, "\u2193"), /*#__PURE__*/React.createElement("button", {
    className: "ed-mini ed-mini--danger",
    onClick: onDelete
  }, "\xD7"))), open && /*#__PURE__*/React.createElement("div", {
    className: "ed-block__body"
  }, window.BlockEditor(block, onChange)));
}
function AddBlockMenu({
  onAdd
}) {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "ed-add-block"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ed-add",
    onClick: () => setOpen(o => !o)
  }, "\uFF0B Add block"), open && /*#__PURE__*/React.createElement("div", {
    className: "ed-add-block__menu"
  }, BLOCK_TYPES.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.type,
    className: "ed-add-block__item",
    onClick: () => {
      onAdd(t.type);
      setOpen(false);
    }
  }, t.label))));
}
function PasteModal({
  open,
  onClose,
  onApply
}) {
  const [val, setVal] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-backdrop",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal__title"
  }, "Paste & auto-fill"), /*#__PURE__*/React.createElement("button", {
    className: "ed-mini",
    onClick: onClose
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "modal__body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "modal__lede"
  }, "Paste structured notes below. Use ", /*#__PURE__*/React.createElement("code", null, "PAGE 2"), " for page breaks, ", /*#__PURE__*/React.createElement("code", null, "# HERO"), " / ", /*#__PURE__*/React.createElement("code", null, "# SECTION"), " / ", /*#__PURE__*/React.createElement("code", null, "# COMPARISON"), " / ", /*#__PURE__*/React.createElement("code", null, "# CAPABILITIES"), " / ", /*#__PURE__*/React.createElement("code", null, "# PROBLEMS"), " / ", /*#__PURE__*/React.createElement("code", null, "# STEPS"), " / ", /*#__PURE__*/React.createElement("code", null, "# CALLOUT"), " / ", /*#__PURE__*/React.createElement("code", null, "# CONTACTS"), " / ", /*#__PURE__*/React.createElement("code", null, "# CTA"), " / ", /*#__PURE__*/React.createElement("code", null, "# LOGOS"), " / ", /*#__PURE__*/React.createElement("code", null, "# STAT"), " / ", /*#__PURE__*/React.createElement("code", null, "# QUOTE"), " for blocks. ", /*#__PURE__*/React.createElement("button", {
    className: "modal__help-toggle",
    onClick: () => setShowHelp(s => !s)
  }, showHelp ? "Hide example" : "Show example")), showHelp && /*#__PURE__*/React.createElement("pre", {
    className: "modal__example"
  }, window.SAMPLE_PASTE), /*#__PURE__*/React.createElement("textarea", {
    className: "modal__textarea",
    value: val,
    placeholder: "Paste raw notes here…",
    onChange: e => setVal(e.target.value),
    rows: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal__foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    onClick: () => setVal(window.SAMPLE_PASTE)
  }, "Insert example"), /*#__PURE__*/React.createElement("div", {
    className: "modal__foot-spacer"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary",
    disabled: !val.trim(),
    onClick: () => {
      onApply(val);
      onClose();
    }
  }, "Apply \u2192"))));
}

// ---- App ----
function App() {
  const [doc, setDoc] = useState(window.SAMPLE_DOC);
  const [density, setDensity] = useState("standard");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(true);
  const updatePage = (i, next) => {
    const pages = doc.pages.slice();
    pages[i] = next;
    setDoc({
      ...doc,
      pages
    });
  };
  const addPage = () => {
    setDoc({
      ...doc,
      pages: [...doc.pages, {
        surface: "light",
        chrome: {
          eyebrow: true,
          footer: true,
          page: true
        },
        blocks: []
      }]
    });
  };
  const deletePage = i => {
    if (!confirm("Delete this page?")) return;
    setDoc({
      ...doc,
      pages: doc.pages.filter((_, j) => j !== i)
    });
  };
  const movePage = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= doc.pages.length) return;
    const pages = doc.pages.slice();
    [pages[i], pages[j]] = [pages[j], pages[i]];
    setDoc({
      ...doc,
      pages
    });
  };
  const onAddBlock = (pageIdx, type) => {
    const b = blank(type);
    const pages = doc.pages.slice();
    pages[pageIdx] = {
      ...pages[pageIdx],
      blocks: [...pages[pageIdx].blocks, b]
    };
    setDoc({
      ...doc,
      pages
    });
  };
  const onChangeBlock = (pageIdx, blockIdx, next) => {
    const pages = doc.pages.slice();
    const blocks = pages[pageIdx].blocks.slice();
    blocks[blockIdx] = next;
    pages[pageIdx] = {
      ...pages[pageIdx],
      blocks
    };
    setDoc({
      ...doc,
      pages
    });
  };
  const onDeleteBlock = (pageIdx, blockIdx) => {
    const pages = doc.pages.slice();
    pages[pageIdx] = {
      ...pages[pageIdx],
      blocks: pages[pageIdx].blocks.filter((_, j) => j !== blockIdx)
    };
    setDoc({
      ...doc,
      pages
    });
  };
  const onMoveBlock = (pageIdx, blockIdx, dir) => {
    const j = blockIdx + dir;
    const blocks = doc.pages[pageIdx].blocks;
    if (j < 0 || j >= blocks.length) return;
    const next = blocks.slice();
    [next[blockIdx], next[j]] = [next[j], next[blockIdx]];
    const pages = doc.pages.slice();
    pages[pageIdx] = {
      ...pages[pageIdx],
      blocks: next
    };
    setDoc({
      ...doc,
      pages
    });
  };
  const applyPaste = raw => {
    const parsed = window.parsePastedDoc(raw);
    if (parsed.pages.length === 0) return;
    setDoc({
      ...doc,
      pages: parsed.pages
    });
  };
  const clearAll = () => {
    if (!confirm("Start a fresh empty document?")) return;
    setDoc({
      title: "Untitled document",
      meta: {
        eyebrow: ""
      },
      pages: [{
        surface: "dark",
        chrome: {
          eyebrow: true,
          footer: true,
          page: true
        },
        blocks: [blank("hero")]
      }]
    });
  };
  return /*#__PURE__*/React.createElement(_Frag, null, /*#__PURE__*/React.createElement("header", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar__brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/icon-green.png",
    className: "topbar__mark",
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "topbar__title-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar__app"
  }, "Document Studio"), /*#__PURE__*/React.createElement("input", {
    className: "topbar__doc-title",
    value: doc.title,
    onChange: e => setDoc({
      ...doc,
      title: e.target.value
    }),
    placeholder: "Document title"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "topbar__actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar__group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "topbar__label"
  }, "Density"), /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, ["compact", "standard", "spacious"].map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    className: `seg__btn ${density === d ? "active" : ""}`,
    onClick: () => setDensity(d)
  }, d[0].toUpperCase() + d.slice(1))))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    onClick: () => setEditorOpen(o => !o)
  }, editorOpen ? "Hide editor" : "Show editor"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    onClick: clearAll
  }, "New"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    onClick: () => setPasteOpen(true)
  }, "Paste & auto-fill"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary",
    onClick: () => window.print()
  }, "Print / PDF"))), /*#__PURE__*/React.createElement("div", {
    className: `workspace ${editorOpen ? "" : "workspace--solo"}`
  }, editorOpen && /*#__PURE__*/React.createElement("aside", {
    className: "editor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "editor__inner"
  }, doc.pages.map((page, i) => /*#__PURE__*/React.createElement("section", {
    className: "ed-page",
    key: i
  }, /*#__PURE__*/React.createElement(PageHeader, {
    page: page,
    idx: i,
    total: doc.pages.length,
    onChange: next => updatePage(i, next),
    onDelete: () => deletePage(i),
    onMove: dir => movePage(i, dir)
  }), /*#__PURE__*/React.createElement("div", {
    className: "ed-blocks"
  }, page.blocks.map((b, j) => /*#__PURE__*/React.createElement(BlockCard, {
    key: b.id,
    block: b,
    idx: j,
    total: page.blocks.length,
    onChange: next => onChangeBlock(i, j, next),
    onDelete: () => onDeleteBlock(i, j),
    onMove: dir => onMoveBlock(i, j, dir)
  })), /*#__PURE__*/React.createElement(AddBlockMenu, {
    onAdd: type => onAddBlock(i, type)
  })))), /*#__PURE__*/React.createElement("button", {
    className: "ed-add ed-add--big",
    onClick: addPage
  }, "\uFF0B Add page"))), /*#__PURE__*/React.createElement("main", {
    className: "preview"
  }, /*#__PURE__*/React.createElement(DocPreview, {
    doc: doc,
    density: density
  }))), /*#__PURE__*/React.createElement(PasteModal, {
    open: pasteOpen,
    onClose: () => setPasteOpen(false),
    onApply: applyPaste
  }));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "studio/app.jsx", error: String((e && e.message) || e) }); }

// studio/blocks.jsx
try { (() => {
// Block renderers — these draw the actual document on the right pane.
// Every block is a pure function of its data (no internal state).

const {
  Fragment
} = React;

// ---------- Generic atoms ----------

function Eyebrow({
  children,
  tone
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `vb-eyebrow vb-doc-eyebrow ${tone || ""}`
  }, children);
}
function Tag({
  children,
  tone
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `vb-doc-tag ${tone || ""}`
  }, children);
}

// ---------- Block: Hero ----------
function HeroBlock({
  block,
  surface
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `blk blk-hero ${surface === "dark" ? "on-dark" : "on-light"}`
  }, block.eyebrow && /*#__PURE__*/React.createElement(Eyebrow, null, block.eyebrow), block.kicker && /*#__PURE__*/React.createElement("div", {
    className: "blk-hero__kicker"
  }, block.kicker), block.headline && /*#__PURE__*/React.createElement("h1", {
    className: "blk-hero__headline"
  }, block.headline), block.body && /*#__PURE__*/React.createElement("p", {
    className: "blk-hero__body"
  }, block.body));
}

// ---------- Block: Section title (eyebrow + headline + intro paragraph) ----------
function SectionTitleBlock({
  block
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "blk blk-section-title"
  }, block.eyebrow && /*#__PURE__*/React.createElement(Eyebrow, null, block.eyebrow), block.headline && /*#__PURE__*/React.createElement("h2", {
    className: "blk-section-title__h"
  }, block.headline), block.body && /*#__PURE__*/React.createElement("p", {
    className: "blk-section-title__body"
  }, block.body));
}

// ---------- Block: Pull quote ----------
function PullQuoteBlock({
  block
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "blk blk-pullquote"
  }, /*#__PURE__*/React.createElement("div", {
    className: "blk-pullquote__text"
  }, block.text), block.attribution && /*#__PURE__*/React.createElement("div", {
    className: "blk-pullquote__attribution"
  }, "\u2014 ", block.attribution));
}

// ---------- Block: Two-column comparison ----------
function ComparisonBlock({
  block
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "blk blk-comparison"
  }, block.subhead && /*#__PURE__*/React.createElement("h3", {
    className: "blk-comparison__subhead"
  }, block.subhead), /*#__PURE__*/React.createElement("div", {
    className: "blk-comparison__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "blk-comparison__col-head"
  }, block.leftTag && /*#__PURE__*/React.createElement(Tag, null, block.leftTag), /*#__PURE__*/React.createElement("div", {
    className: "blk-comparison__label"
  }, block.leftLabel)), /*#__PURE__*/React.createElement("div", {
    className: "blk-comparison__col-head right"
  }, block.rightTag && /*#__PURE__*/React.createElement(Tag, {
    tone: "accent"
  }, block.rightTag), /*#__PURE__*/React.createElement("div", {
    className: "blk-comparison__label"
  }, block.rightLabel))), /*#__PURE__*/React.createElement("div", {
    className: "blk-comparison__rows"
  }, (block.rows || []).map((row, i) => /*#__PURE__*/React.createElement("div", {
    className: "blk-comparison__row",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "blk-comparison__topic"
  }, row.topic), /*#__PURE__*/React.createElement("div", {
    className: "blk-comparison__cells"
  }, /*#__PURE__*/React.createElement("div", {
    className: "blk-comparison__cell"
  }, row.left), /*#__PURE__*/React.createElement("div", {
    className: "blk-comparison__cell highlight"
  }, row.right))))));
}

// ---------- Block: Stat callout ----------
function StatCalloutBlock({
  block
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "blk blk-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "blk-stat__num"
  }, block.stat), /*#__PURE__*/React.createElement("p", {
    className: "blk-stat__body"
  }, block.body));
}

// ---------- Block: Problem list (numbered, with stats) ----------
function ProblemListBlock({
  block
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "blk blk-problems"
  }, block.heading && /*#__PURE__*/React.createElement("h3", {
    className: "blk-problems__h"
  }, block.heading), /*#__PURE__*/React.createElement("ol", {
    className: "blk-problems__list"
  }, (block.items || []).map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "blk-problems__item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "blk-problems__num"
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("div", {
    className: "blk-problems__body"
  }, it.stat && /*#__PURE__*/React.createElement("div", {
    className: "blk-problems__stat"
  }, it.stat), it.title && /*#__PURE__*/React.createElement("div", {
    className: "blk-problems__title"
  }, it.title), it.body && /*#__PURE__*/React.createElement("p", {
    className: "blk-problems__copy"
  }, it.body))))));
}

// ---------- Block: Capability list ----------
function CapabilitiesBlock({
  block
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "blk blk-caps"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "blk-caps__list"
  }, (block.items || []).map((it, i) => /*#__PURE__*/React.createElement("li", {
    className: "blk-caps__item",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "blk-caps__title"
  }, it.title), it.body && /*#__PURE__*/React.createElement("p", {
    className: "blk-caps__body"
  }, it.body)))));
}

// ---------- Block: Logo strip / proof ----------
function LogoStripBlock({
  block
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "blk blk-logos"
  }, block.eyebrow && /*#__PURE__*/React.createElement(Eyebrow, null, block.eyebrow), block.heading && /*#__PURE__*/React.createElement("h3", {
    className: "blk-logos__h"
  }, block.heading), block.body && /*#__PURE__*/React.createElement("p", {
    className: "blk-logos__body"
  }, block.body), /*#__PURE__*/React.createElement("div", {
    className: "blk-logos__row"
  }, (block.names || []).map((n, i) => /*#__PURE__*/React.createElement("div", {
    className: "blk-logos__name",
    key: i
  }, n))));
}

// ---------- Block: How it works (steps) ----------
function HowItWorksBlock({
  block
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "blk blk-steps"
  }, block.eyebrow && /*#__PURE__*/React.createElement(Eyebrow, null, block.eyebrow), block.heading && /*#__PURE__*/React.createElement("h3", {
    className: "blk-steps__h"
  }, block.heading), block.body && /*#__PURE__*/React.createElement("p", {
    className: "blk-steps__body"
  }, block.body), /*#__PURE__*/React.createElement("ol", {
    className: "blk-steps__list"
  }, (block.steps || []).map((s, i) => /*#__PURE__*/React.createElement("li", {
    className: "blk-steps__item",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "blk-steps__num"
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("div", {
    className: "blk-steps__body-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "blk-steps__title"
  }, s.title), s.body && /*#__PURE__*/React.createElement("p", {
    className: "blk-steps__copy"
  }, s.body))))));
}

// ---------- Block: Highlight callout ----------
function CalloutBlock({
  block
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `blk blk-callout ${block.tone === "dark" ? "on-dark" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "blk-callout__main"
  }, block.eyebrow && /*#__PURE__*/React.createElement(Eyebrow, {
    tone: block.tone === "dark" ? "on-dark" : ""
  }, block.eyebrow), block.headline && /*#__PURE__*/React.createElement("div", {
    className: "blk-callout__h"
  }, block.headline), block.body && /*#__PURE__*/React.createElement("p", {
    className: "blk-callout__body"
  }, block.body)), block.tags && block.tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "blk-callout__tags"
  }, block.tags.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "blk-callout__tag"
  }, t))));
}

// ---------- Block: Card grid (dot points as cards) ----------
function CardGridBlock({
  block,
  surface
}) {
  const cards = block.cards || [];
  return /*#__PURE__*/React.createElement("div", {
    className: "blk blk-card-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "blk-card-grid__header"
  }, block.eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "blk-subhead"
  }, block.eyebrow), block.headline && /*#__PURE__*/React.createElement("h2", {
    className: "blk-card-grid__h"
  }, block.headline), block.body && /*#__PURE__*/React.createElement("p", {
    className: "blk-card-grid__body"
  }, block.body)), cards.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "blk-card-grid__grid"
  }, cards.map((c, i) => /*#__PURE__*/React.createElement("div", {
    className: "blk-card",
    key: i
  }, /*#__PURE__*/React.createElement("p", {
    className: "blk-card__text"
  }, c.text), /*#__PURE__*/React.createElement("img", {
    className: "blk-card__icon",
    src: "../assets/icons/icon-arrow-on-green.png",
    alt: ""
  })))));
}

// ---------- Block: Contacts grid ----------
function ContactsBlock({
  block
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "blk blk-contacts"
  }, block.heading && /*#__PURE__*/React.createElement("h3", {
    className: "blk-contacts__h"
  }, block.heading), /*#__PURE__*/React.createElement("div", {
    className: "blk-contacts__grid"
  }, (block.items || []).map((c, i) => /*#__PURE__*/React.createElement("div", {
    className: "blk-contacts__card",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "blk-contacts__name"
  }, c.name), /*#__PURE__*/React.createElement("div", {
    className: "blk-contacts__role"
  }, c.role), c.phone && /*#__PURE__*/React.createElement("div", {
    className: "blk-contacts__line"
  }, c.phone), c.email && /*#__PURE__*/React.createElement("div", {
    className: "blk-contacts__line"
  }, c.email)))));
}

// ---------- Block: CTA strip ----------
function CtaStripBlock({
  block
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "blk blk-cta"
  }, block.eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "blk-cta__eyebrow"
  }, block.eyebrow), block.headline && /*#__PURE__*/React.createElement("div", {
    className: "blk-cta__h"
  }, block.headline), block.button && /*#__PURE__*/React.createElement("div", {
    className: "blk-cta__button"
  }, block.button));
}

// ---------- Block: Paragraph ----------
function ParagraphBlock({
  block
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "blk blk-para"
  }, block.text && block.text.split(/\n\n+/).map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i
  }, p)));
}

// ---------- Dispatcher ----------
const BLOCK_RENDERERS = {
  hero: HeroBlock,
  "section-title": SectionTitleBlock,
  pullquote: PullQuoteBlock,
  comparison: ComparisonBlock,
  "stat-callout": StatCalloutBlock,
  "problem-list": ProblemListBlock,
  capabilities: CapabilitiesBlock,
  "logo-strip": LogoStripBlock,
  "how-it-works": HowItWorksBlock,
  callout: CalloutBlock,
  contacts: ContactsBlock,
  "card-grid": CardGridBlock,
  "cta-strip": CtaStripBlock,
  paragraph: ParagraphBlock
};
function RenderBlock({
  block,
  surface
}) {
  const C = BLOCK_RENDERERS[block.type];
  if (!C) return /*#__PURE__*/React.createElement("div", {
    className: "blk blk-unknown"
  }, "Unknown block: ", block.type);
  return /*#__PURE__*/React.createElement(C, {
    block: block,
    surface: surface
  });
}
Object.assign(window, {
  RenderBlock,
  BLOCK_RENDERERS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "studio/blocks.jsx", error: String((e && e.message) || e) }); }

// studio/editor.jsx
try { (() => {
// Editor controls for each block type. Mirrors blocks.jsx 1:1.

const {
  useState: useStateE
} = React;

// ---------- Atoms ----------
function Field({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "ed-field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ed-field__label"
  }, label), children);
}
function TextInput({
  value,
  onChange,
  placeholder
}) {
  return /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "ed-input",
    value: value || "",
    placeholder: placeholder || "",
    onChange: e => onChange(e.target.value)
  });
}
function TextArea({
  value,
  onChange,
  placeholder,
  rows
}) {
  return /*#__PURE__*/React.createElement("textarea", {
    className: "ed-textarea",
    value: value || "",
    placeholder: placeholder || "",
    rows: rows || 3,
    onChange: e => onChange(e.target.value)
  });
}
function ListEditor({
  items,
  onChange,
  render,
  blank,
  addLabel
}) {
  const list = items || [];
  const update = (i, next) => {
    const c = list.slice();
    c[i] = next;
    onChange(c);
  };
  const remove = i => onChange(list.filter((_, j) => j !== i));
  const add = () => onChange([...list, {
    ...blank
  }]);
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const c = list.slice();
    [c[i], c[j]] = [c[j], c[i]];
    onChange(c);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ed-list"
  }, list.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "ed-list__row",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "ed-list__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ed-list__num"
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("div", {
    className: "ed-list__actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ed-mini",
    onClick: () => move(i, -1),
    title: "Move up"
  }, "\u2191"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ed-mini",
    onClick: () => move(i, 1),
    title: "Move down"
  }, "\u2193"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ed-mini ed-mini--danger",
    onClick: () => remove(i),
    title: "Remove"
  }, "\xD7"))), /*#__PURE__*/React.createElement("div", {
    className: "ed-list__body"
  }, render(it, next => update(i, next))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ed-add ed-add--small",
    onClick: add
  }, "\uFF0B ", addLabel || "Add item"));
}

// ---------- Per-block editors ----------
const E = (block, set) => {
  const merge = patch => set({
    ...block,
    ...patch
  });
  switch (block.type) {
    case "hero":
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
        label: "Eyebrow"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.eyebrow,
        onChange: v => merge({
          eyebrow: v
        }),
        placeholder: "MISSION CRITICAL CAPABILITY PACK"
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Kicker (large lead line)"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.kicker,
        onChange: v => merge({
          kicker: v
        }),
        rows: 2
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Headline"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.headline,
        onChange: v => merge({
          headline: v
        }),
        rows: 3
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Supporting body"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.body,
        onChange: v => merge({
          body: v
        }),
        rows: 2
      })));
    case "section-title":
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
        label: "Eyebrow"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.eyebrow,
        onChange: v => merge({
          eyebrow: v
        })
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Headline"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.headline,
        onChange: v => merge({
          headline: v
        }),
        rows: 2
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Body"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.body,
        onChange: v => merge({
          body: v
        }),
        rows: 4
      })));
    case "pullquote":
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
        label: "Quote"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.text,
        onChange: v => merge({
          text: v
        }),
        rows: 3
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Attribution"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.attribution,
        onChange: v => merge({
          attribution: v
        })
      })));
    case "comparison":
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
        label: "Subhead (sits above the table)"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.subhead,
        onChange: v => merge({
          subhead: v
        }),
        rows: 2
      })), /*#__PURE__*/React.createElement("div", {
        className: "ed-grid-2"
      }, /*#__PURE__*/React.createElement(Field, {
        label: "Left tag"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.leftTag,
        onChange: v => merge({
          leftTag: v
        })
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Right tag"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.rightTag,
        onChange: v => merge({
          rightTag: v
        })
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Left label"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.leftLabel,
        onChange: v => merge({
          leftLabel: v
        })
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Right label"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.rightLabel,
        onChange: v => merge({
          rightLabel: v
        })
      }))), /*#__PURE__*/React.createElement(Field, {
        label: "Rows"
      }, /*#__PURE__*/React.createElement(ListEditor, {
        items: block.rows,
        onChange: rows => merge({
          rows
        }),
        blank: {
          topic: "",
          left: "",
          right: ""
        },
        addLabel: "Add row",
        render: (row, setRow) => /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
          label: "Topic"
        }, /*#__PURE__*/React.createElement(TextInput, {
          value: row.topic,
          onChange: v => setRow({
            ...row,
            topic: v
          })
        })), /*#__PURE__*/React.createElement(Field, {
          label: "Left cell"
        }, /*#__PURE__*/React.createElement(TextArea, {
          value: row.left,
          onChange: v => setRow({
            ...row,
            left: v
          }),
          rows: 3
        })), /*#__PURE__*/React.createElement(Field, {
          label: "Right cell"
        }, /*#__PURE__*/React.createElement(TextArea, {
          value: row.right,
          onChange: v => setRow({
            ...row,
            right: v
          }),
          rows: 3
        })))
      })));
    case "stat-callout":
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
        label: "Stat (big number)"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.stat,
        onChange: v => merge({
          stat: v
        }),
        placeholder: "92%"
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Body"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.body,
        onChange: v => merge({
          body: v
        }),
        rows: 4
      })));
    case "problem-list":
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
        label: "Heading"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.heading,
        onChange: v => merge({
          heading: v
        })
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Items"
      }, /*#__PURE__*/React.createElement(ListEditor, {
        items: block.items,
        onChange: items => merge({
          items
        }),
        blank: {
          stat: "",
          title: "",
          body: ""
        },
        addLabel: "Add problem",
        render: (it, setIt) => /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
          label: "Stat (optional)"
        }, /*#__PURE__*/React.createElement(TextInput, {
          value: it.stat,
          onChange: v => setIt({
            ...it,
            stat: v
          })
        })), /*#__PURE__*/React.createElement(Field, {
          label: "Title"
        }, /*#__PURE__*/React.createElement(TextInput, {
          value: it.title,
          onChange: v => setIt({
            ...it,
            title: v
          })
        })), /*#__PURE__*/React.createElement(Field, {
          label: "Body"
        }, /*#__PURE__*/React.createElement(TextArea, {
          value: it.body,
          onChange: v => setIt({
            ...it,
            body: v
          }),
          rows: 2
        })))
      })));
    case "capabilities":
      return /*#__PURE__*/React.createElement(Field, {
        label: "Capabilities"
      }, /*#__PURE__*/React.createElement(ListEditor, {
        items: block.items,
        onChange: items => merge({
          items
        }),
        blank: {
          title: "",
          body: ""
        },
        addLabel: "Add capability",
        render: (it, setIt) => /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
          label: "Title"
        }, /*#__PURE__*/React.createElement(TextInput, {
          value: it.title,
          onChange: v => setIt({
            ...it,
            title: v
          })
        })), /*#__PURE__*/React.createElement(Field, {
          label: "Body"
        }, /*#__PURE__*/React.createElement(TextArea, {
          value: it.body,
          onChange: v => setIt({
            ...it,
            body: v
          }),
          rows: 3
        })))
      }));
    case "logo-strip":
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
        label: "Eyebrow"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.eyebrow,
        onChange: v => merge({
          eyebrow: v
        })
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Heading"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.heading,
        onChange: v => merge({
          heading: v
        })
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Body"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.body,
        onChange: v => merge({
          body: v
        }),
        rows: 3
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Names (one per line)"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: (block.names || []).join("\n"),
        onChange: v => merge({
          names: v.split(/\n+/).map(s => s.trim()).filter(Boolean)
        }),
        rows: 4,
        placeholder: "AirTrunk\nNextDC\nMicrosoft"
      })));
    case "how-it-works":
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
        label: "Eyebrow"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.eyebrow,
        onChange: v => merge({
          eyebrow: v
        })
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Heading"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.heading,
        onChange: v => merge({
          heading: v
        })
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Body"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.body,
        onChange: v => merge({
          body: v
        }),
        rows: 2
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Steps"
      }, /*#__PURE__*/React.createElement(ListEditor, {
        items: block.steps,
        onChange: steps => merge({
          steps
        }),
        blank: {
          title: "",
          body: ""
        },
        addLabel: "Add step",
        render: (it, setIt) => /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
          label: "Title"
        }, /*#__PURE__*/React.createElement(TextInput, {
          value: it.title,
          onChange: v => setIt({
            ...it,
            title: v
          })
        })), /*#__PURE__*/React.createElement(Field, {
          label: "Body"
        }, /*#__PURE__*/React.createElement(TextArea, {
          value: it.body,
          onChange: v => setIt({
            ...it,
            body: v
          }),
          rows: 2
        })))
      })));
    case "callout":
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
        label: "Eyebrow / label"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.eyebrow,
        onChange: v => merge({
          eyebrow: v
        })
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Headline"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.headline,
        onChange: v => merge({
          headline: v
        }),
        rows: 2
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Body"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.body,
        onChange: v => merge({
          body: v
        }),
        rows: 3
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Tags (one per line)"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: (block.tags || []).join("\n"),
        onChange: v => merge({
          tags: v.split(/\n+/).map(s => s.trim()).filter(Boolean)
        }),
        rows: 3,
        placeholder: "Completely free\nNo trial period\nNo subscription"
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Tone"
      }, /*#__PURE__*/React.createElement("select", {
        className: "ed-input",
        value: block.tone || "light",
        onChange: e => merge({
          tone: e.target.value
        })
      }, /*#__PURE__*/React.createElement("option", {
        value: "light"
      }, "Light"), /*#__PURE__*/React.createElement("option", {
        value: "dark"
      }, "Dark"))));
    case "contacts":
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
        label: "Heading"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.heading,
        onChange: v => merge({
          heading: v
        })
      })), /*#__PURE__*/React.createElement(Field, {
        label: "People"
      }, /*#__PURE__*/React.createElement(ListEditor, {
        items: block.items,
        onChange: items => merge({
          items
        }),
        blank: {
          name: "",
          role: "",
          phone: "",
          email: ""
        },
        addLabel: "Add contact",
        render: (it, setIt) => /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
          label: "Name"
        }, /*#__PURE__*/React.createElement(TextInput, {
          value: it.name,
          onChange: v => setIt({
            ...it,
            name: v
          })
        })), /*#__PURE__*/React.createElement(Field, {
          label: "Role"
        }, /*#__PURE__*/React.createElement(TextInput, {
          value: it.role,
          onChange: v => setIt({
            ...it,
            role: v
          })
        })), /*#__PURE__*/React.createElement(Field, {
          label: "Phone"
        }, /*#__PURE__*/React.createElement(TextInput, {
          value: it.phone,
          onChange: v => setIt({
            ...it,
            phone: v
          })
        })), /*#__PURE__*/React.createElement(Field, {
          label: "Email"
        }, /*#__PURE__*/React.createElement(TextInput, {
          value: it.email,
          onChange: v => setIt({
            ...it,
            email: v
          })
        })))
      })));
    case "card-grid":
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
        label: "Subheading (green-square eyebrow)"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.eyebrow,
        onChange: v => merge({
          eyebrow: v
        }),
        placeholder: "WHO WE SERVE"
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Main title"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.headline,
        onChange: v => merge({
          headline: v
        }),
        rows: 2,
        placeholder: "Built to keep up with Data Centres"
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Body"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.body,
        onChange: v => merge({
          body: v
        }),
        rows: 3
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Cards"
      }, /*#__PURE__*/React.createElement(ListEditor, {
        items: block.cards,
        onChange: cards => merge({
          cards
        }),
        blank: {
          text: ""
        },
        addLabel: "Add card",
        render: (it, setIt) => /*#__PURE__*/React.createElement(Field, {
          label: "Card text"
        }, /*#__PURE__*/React.createElement(TextArea, {
          value: it.text,
          onChange: v => setIt({
            ...it,
            text: v
          }),
          rows: 2
        }))
      })));
    case "cta-strip":
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Field, {
        label: "Eyebrow"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.eyebrow,
        onChange: v => merge({
          eyebrow: v
        })
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Headline"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.headline,
        onChange: v => merge({
          headline: v
        }),
        rows: 3
      })), /*#__PURE__*/React.createElement(Field, {
        label: "Button label"
      }, /*#__PURE__*/React.createElement(TextInput, {
        value: block.button,
        onChange: v => merge({
          button: v
        })
      })));
    case "paragraph":
      return /*#__PURE__*/React.createElement(Field, {
        label: "Body (separate paragraphs with blank lines)"
      }, /*#__PURE__*/React.createElement(TextArea, {
        value: block.text,
        onChange: v => merge({
          text: v
        }),
        rows: 6
      }));
    default:
      return /*#__PURE__*/React.createElement("div", {
        className: "ed-empty"
      }, "No editor for ", block.type);
  }
};
window.BlockEditor = E;
})(); } catch (e) { __ds_ns.__errors.push({ path: "studio/editor.jsx", error: String((e && e.message) || e) }); }

// studio/parser.js
try { (() => {
// Paste-and-autofill: parses freeform text into our document model.
// Heuristics, not AI. Designed for the format the user is most likely to
// paste from a Google Doc / notes / a quick markdown dump.
//
// Conventions the parser understands:
//   PAGE 1                 -> new page
//   ---                    -> new page (alt)
//   == DARK ==             -> mark current page as dark surface
//   # HERO: ...            -> hero block headline
//   # SECTION: ...         -> section title
//   # COMPARISON           -> comparison block
//   # CAPABILITIES         -> capabilities list
//   # PROBLEMS             -> problem list
//   # STEPS                -> how-it-works steps
//   # CALLOUT              -> callout box
//   # CONTACTS             -> contacts grid
//   # CTA                  -> cta strip
//   # LOGOS                -> logo strip
//   # STAT 92%             -> stat callout
//   # QUOTE                -> pull quote
//   eyebrow: ...           -> sets eyebrow
//   headline: ...          -> sets headline / title
//   body: ...              -> body
//   - item title :: body   -> list item with body
//   - item                 -> list item, title only
//   1. ... :: ...          -> numbered step
//
// Anything that doesn't match falls into the previous block as body.

(function () {
  const HEADER_MAP = {
    HERO: "hero",
    SECTION: "section-title",
    COMPARISON: "comparison",
    CAPABILITIES: "capabilities",
    PROBLEMS: "problem-list",
    STEPS: "how-it-works",
    CALLOUT: "callout",
    CONTACTS: "contacts",
    CARDS: "card-grid",
    CTA: "cta-strip",
    LOGOS: "logo-strip",
    STAT: "stat-callout",
    QUOTE: "pullquote",
    PARAGRAPH: "paragraph"
  };
  let nextId = 1;
  const newId = () => `b${Date.now()}-${nextId++}`;
  function blank(type) {
    const base = {
      id: newId(),
      type
    };
    if (type === "comparison") base.rows = [];
    if (["capabilities", "problem-list", "contacts"].includes(type)) base.items = [];
    if (type === "card-grid") base.cards = [];
    if (type === "how-it-works") base.steps = [];
    if (type === "logo-strip") base.names = [];
    if (type === "callout") base.tags = [];
    return base;
  }
  function parsePastedDoc(raw) {
    const lines = raw.split(/\r?\n/);
    const pages = [{
      surface: "dark",
      chrome: {
        eyebrow: true,
        footer: true,
        page: true
      },
      blocks: []
    }];
    let curPage = pages[0];
    let curBlock = null;
    let pendingField = null;
    function pushBlock(b) {
      curBlock = b;
      curPage.blocks.push(b);
      pendingField = null;
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const t = line.trim();
      if (!t) {
        pendingField = null;
        continue;
      }

      // Page break
      if (/^(PAGE\s+\d+|---+)$/i.test(t)) {
        curPage = {
          surface: "light",
          chrome: {
            eyebrow: true,
            footer: true,
            page: true
          },
          blocks: []
        };
        pages.push(curPage);
        curBlock = null;
        continue;
      }

      // Surface marker
      const surfM = t.match(/^==\s*(DARK|LIGHT)\s*==$/i);
      if (surfM) {
        curPage.surface = surfM[1].toLowerCase();
        continue;
      }

      // Block header
      const headM = t.match(/^#\s*([A-Z][A-Z\-]*)\s*:?\s*(.*)$/);
      if (headM) {
        const tag = headM[1].toUpperCase();
        const rest = headM[2].trim();
        const type = HEADER_MAP[tag];
        if (type) {
          const b = blank(type);
          if (rest) {
            if (type === "stat-callout") b.stat = rest;else if (type === "pullquote") b.text = rest;else if (type === "paragraph") b.text = rest;else b.headline = rest;
          }
          pushBlock(b);
          continue;
        }
      }

      // key: value field
      const kvM = t.match(/^([a-z][a-zA-Z]*)\s*:\s*(.*)$/);
      if (kvM && curBlock) {
        const key = kvM[1].toLowerCase();
        const val = kvM[2];
        const aliases = {
          eyebrow: "eyebrow",
          kicker: "kicker",
          headline: "headline",
          title: "headline",
          subhead: "subhead",
          heading: "heading",
          body: "body",
          text: "text",
          stat: "stat",
          attribution: "attribution",
          button: "button",
          left: "leftLabel",
          right: "rightLabel",
          lefttag: "leftTag",
          righttag: "rightTag",
          leftlabel: "leftLabel",
          rightlabel: "rightLabel",
          tone: "tone"
        };
        const mapped = aliases[key];
        if (mapped) {
          curBlock[mapped] = val;
          pendingField = mapped;
          continue;
        }
      }

      // List item — comparison row syntax: - topic | left || right
      if (curBlock && curBlock.type === "comparison" && /^[-*]\s+/.test(t)) {
        const body = t.replace(/^[-*]\s+/, "");
        const parts = body.split(/\s*\|\|\s*/);
        if (parts.length === 2) {
          const [head, right] = parts;
          const [topic, left] = head.split(/\s*\|\s*/);
          curBlock.rows.push({
            topic: (topic || "").trim(),
            left: (left || "").trim(),
            right: right.trim()
          });
          continue;
        }
      }

      // List item with title :: body
      if (curBlock && /^[-*]\s+/.test(t)) {
        const body = t.replace(/^[-*]\s+/, "");
        const sep = body.split(/\s*::\s*/);
        const [title, copy] = [sep[0], sep.slice(1).join(" :: ")];
        if (curBlock.type === "capabilities" || curBlock.type === "problem-list") {
          curBlock.items.push({
            title,
            body: copy || ""
          });
          continue;
        }
        if (curBlock.type === "card-grid") {
          curBlock.cards.push({
            text: body
          });
          continue;
        }
        if (curBlock.type === "logo-strip") {
          curBlock.names.push(title);
          continue;
        }
        if (curBlock.type === "callout") {
          curBlock.tags.push(title);
          continue;
        }
        if (curBlock.type === "contacts") {
          // - Name | Role | Phone | Email
          const fields = body.split(/\s*\|\s*/);
          curBlock.items.push({
            name: fields[0] || "",
            role: fields[1] || "",
            phone: fields[2] || "",
            email: fields[3] || ""
          });
          continue;
        }
      }

      // Numbered step
      const numM = t.match(/^(\d+)\.\s+(.*)$/);
      if (numM && curBlock && curBlock.type === "how-it-works") {
        const body = numM[2];
        const sep = body.split(/\s*::\s*/);
        curBlock.steps.push({
          title: sep[0],
          body: sep.slice(1).join(" :: ")
        });
        continue;
      }

      // Continuation — append to last field of current block
      if (curBlock && pendingField && typeof curBlock[pendingField] === "string") {
        curBlock[pendingField] = (curBlock[pendingField] + " " + t).trim();
        continue;
      }

      // Loose paragraph — drop into a paragraph block
      if (!curBlock || curBlock.type !== "paragraph") {
        const b = blank("paragraph");
        b.text = t;
        pushBlock(b);
      } else {
        curBlock.text = (curBlock.text ? curBlock.text + "\n\n" : "") + t;
      }
    }

    // Drop empty page
    return {
      pages: pages.filter(p => p.blocks.length > 0)
    };
  }

  // Sample to show in the placeholder
  const SAMPLE_PASTE = `== DARK ==
# HERO
eyebrow: Mission Critical Capability Pack
kicker: Data centre clients don't accept delays. Your quality process shouldn't cause them.
headline: The construction quality platform that runs ITPs, hold points, NCRs, and post-completion warranty across every stakeholder.
body: From groundbreak to handover. No chaos. Just clarity.

PAGE 2

# SECTION
eyebrow: Where Visibuild fits
headline: Visibuild sits alongside Procore and ACC. Not against them.
body: Procore stays as your project management system of record. ACC stays as your common data environment.

# COMPARISON
subhead: 4 problems mission critical builds break general-purpose tools on.
lefttag: Document centric
righttag: Event centric
leftlabel: Procore & ACC
rightlabel: With Visibuild
- Commissioning sequence | Built for PM at the GC's office. || Native witness and hold point workflows.
- Workflow flexibility | Fixed product workflow. || Configurable templates and approval chains.

# STAT 92%
body: of QA events on a typical hyperscale data centre project are completed by subcontractors.

PAGE 3

# SECTION
eyebrow: Core capabilities
headline: The platform, by what it gives your team in the field.

# CAPABILITIES
- Configurable ITPs :: Version-controlled templates with mandatory hold points and reviewer chains.
- NCR and defect management :: Raise non-conformances in the field, route them, track close-out.

# CONTACTS
- Damien Quinn | Founder & Director | 0419 377 757 | damien@visibuild.com
- Ryan Treweek | Founder & Director | 0421 962 702 | ryan@visibuild.com
`;
  Object.assign(window, {
    parsePastedDoc,
    SAMPLE_PASTE,
    blankBlock: blank
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "studio/parser.js", error: String((e && e.message) || e) }); }

// studio/sample.js
try { (() => {
// Seed document — derived from the Mission Critical Capability Pack PDF
// so the user lands on something recognisable on first load.

window.SAMPLE_DOC = {
  title: "Mission Critical Capability Pack",
  meta: {
    eyebrow: "Mission Critical Capability Pack",
    density: "standard"
  },
  pages: [{
    surface: "dark",
    chrome: {
      eyebrow: true,
      footer: true,
      page: true
    },
    blocks: [{
      id: "p1-hero",
      type: "hero",
      eyebrow: "Mission Critical Capability Pack",
      kicker: "Data centre clients don't accept delays. Your quality process shouldn't cause them.",
      headline: "The construction quality platform that runs ITPs, hold points, NCRs, and post-completion warranty across every stakeholder on the project.",
      body: "From groundbreak to handover. No chaos. Just clarity.",
      align: "left"
    }]
  }, {
    surface: "light",
    chrome: {
      eyebrow: true,
      footer: true,
      page: true
    },
    blocks: [{
      id: "p2-section",
      type: "section-title",
      eyebrow: "Where Visibuild fits in your tech stack",
      headline: "Visibuild sits alongside Procore and ACC. Not against them.",
      body: "Procore stays as your project management system of record. ACC stays as your common data environment. Visibuild is the specialist quality and commissioning layer for projects where the depth matters. The reason it has to be a separate platform isn't a feature gap, it's an architectural one."
    }, {
      id: "p2-comparison",
      type: "comparison",
      subhead: "4 problems mission critical builds break general-purpose tools on.",
      leftLabel: "Procore & ACC",
      leftTag: "Document centric",
      rightLabel: "With Visibuild",
      rightTag: "Event centric",
      rows: [{
        topic: "Commissioning sequence and evidence",
        left: "Built for project management at the GC's office. Quality is a module bolted onto a drawing, RFI, and submittal core.",
        right: "Cx witness points, level 1-5 sign-offs, integrated systems testing, and the audit trail your client will demand at handover. Native witness and hold point workflows."
      }, {
        topic: "Workflows you actually configure",
        left: "A fixed product workflow you have to bend your team around.",
        right: "Flexible templates, custom approval chains, and reporting cadences that match your client's expectations."
      }, {
        topic: "Subcontractor accountability at scale",
        left: "Subs pay for seats and often skip the platform entirely. Real QA work happens off platform.",
        right: "Subs are active users on the platform. They don't pay. Adoption follows."
      }, {
        topic: "Visibility from field to executive",
        left: "The GC's record becomes a summary, not the source of truth.",
        right: "Inspection completion linked to the schedule. Skipped hold points flagged automatically. Real-time, not retrospective."
      }]
    }, {
      id: "p2-stat",
      type: "stat-callout",
      stat: "92%",
      body: "of QA events on a typical hyperscale data centre project are completed by subcontractors. When the commercial model paywalls those users, the work happens in spreadsheets and gets re-keyed."
    }]
  }, {
    surface: "light",
    chrome: {
      eyebrow: true,
      footer: true,
      page: true
    },
    blocks: [{
      id: "p3-cardgrid",
      type: "card-grid",
      eyebrow: "Built for mission critical",
      headline: "Built to keep up with Data Centres",
      body: "Whether you're tracking commissioning stages or managing shell and fitout side-by-side, Visibuild flexes to your structure, while keeping every inspection, issue, and signoff in sync.",
      cards: [{
        text: "Automated inspection tracking & live dashboards."
      }, {
        text: "Custom Location Trees mapped to services, not just floors."
      }, {
        text: "Mandated Hold & Witness points for critical path items."
      }, {
        text: "Integrated workflows for GCs, Subs, and Clients (CX1–CX5)."
      }, {
        text: "Real-time compliance tracking vs. \"post-facto\" paperwork."
      }]
    }]
  }, {
    surface: "light",
    chrome: {
      eyebrow: true,
      footer: true,
      page: true
    },
    blocks: [{
      id: "p3-cap-title",
      type: "section-title",
      eyebrow: "Core capabilities",
      headline: "The platform, by what it gives your team in the field."
    }, {
      id: "p3-caps",
      type: "capabilities",
      items: [{
        title: "Configurable ITPs and inspection templates",
        body: "Version-controlled templates with mandatory hold points, witness points, and reviewer chains. Build once at the company level, deploy across every project."
      }, {
        title: "Hold point and witness point enforcement",
        body: "Subcontractors can't proceed past a hold point until it's signed off. Skipped hold points are tracked, reported, and visible in real time. Every bypass needs a logged reason."
      }, {
        title: "NCR and defect management",
        body: "Raise non-conformances in the field, route them to the responsible sub, track close-out with evidence. Bulk actions when you need to move 500 items at once."
      }, {
        title: "Field-first mobile, online and offline",
        body: "Native iOS and Android. 3 to 4 click inspections. Offline capability for plant rooms and basements without coverage. Sub and trade adoption rates other platforms can't match."
      }, {
        title: "Post-completion warranty management",
        body: "The Tickets module extends quality control through DLP and statutory warranty. Tenants and operators submit issues via QR code, your team triages and assigns."
      }]
    }, {
      id: "p3-proof",
      type: "logo-strip",
      eyebrow: "Mission critical proof",
      heading: "A pattern across experienced data centre builders",
      body: "Across the Asia Pacific region, the projects being delivered on Visibuild include hyperscale campuses for AirTrunk, NextDC, Microsoft, and Stack Infrastructure — selected specifically because of the depth required around commissioning evidence, sub coordination, and customisable workflows.",
      names: ["AirTrunk", "NextDC", "Microsoft", "Stack Infrastructure"]
    }, {
      id: "p3-cta",
      type: "cta-strip",
      eyebrow: "Want to see it in the field?",
      headline: "The fastest way to understand the platform is to see it on a live mission critical job. 30 minutes is usually enough."
    }, {
      id: "p3-contacts",
      type: "contacts",
      items: [{
        name: "Damien Quinn",
        role: "Founder & Director",
        phone: "0419 377 757",
        email: "damien@visibuild.com"
      }, {
        name: "Ryan Treweek",
        role: "Founder & Director",
        phone: "0421 962 702",
        email: "ryan@visibuild.com"
      }]
    }]
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "studio/sample.js", error: String((e && e.message) || e) }); }

})();
