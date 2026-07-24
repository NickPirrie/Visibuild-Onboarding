import { todayIso } from '../../lib/utils.js';
import ItemCard from '../ItemCard.jsx';

export default function SubcontractorsView({ active, state, store }) {
  const today = todayIso();
  const subs = active.subcontractors || [];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div style={{ maxWidth: 660 }}>
          <div className="vb-eyebrow" style={{ marginBottom: 9 }}>Subcontractor onboarding</div>
          <h1 style={{ fontFamily: 'var(--vb-font-serif)', fontWeight: 400, fontSize: 32, letterSpacing: '-.01em', margin: 0 }}>Subcontractors</h1>
          <p style={{ fontSize: 14, color: 'var(--vb-ink-3)', margin: '8px 0 0', lineHeight: 1.5 }}>Expand a subcontractor to see its trades. Expand a trade for its ITPs (submission &amp; digitisation) and training.</p>
        </div>
        <button type="button" className="vb-btn-primary" onClick={store.addSub}>+ Add subcontractor</button>
      </div>

      {!subs.length && (
        <div className="vb-empty-state">
          <div className="title">No subcontractors yet.</div>
          <div className="detail">Add one to start tracking their trades, ITPs and training.</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {subs.map((s) => {
          const items = [];
          s.trades.forEach((t) => { (t.itps || []).forEach((i) => items.push(i)); (t.training || []).forEach((i) => items.push(i)); });
          const dn = items.filter((i) => i.status === 'done').length;
          const open = !!state.expanded['sub:' + s.id];
          return (
            <div key={s.id} className="vb-sub-card">
              <div className="vb-sub-head">
                <button type="button" className="vb-chevron-btn" onClick={() => store.toggleNode('sub:' + s.id)}>{open ? '▾' : '▸'}</button>
                <span style={{ width: 9, height: 9, borderRadius: '50%', flex: 'none', background: 'var(--vb-blue)' }} />
                <input className="vb-sub-name-input" value={s.name} onChange={(e) => store.editSub(s.id, e.target.value)} />
                <span style={{ fontSize: 12.5, color: 'var(--vb-ink-4)', whiteSpace: 'nowrap' }}>{s.trades.length} trade{s.trades.length !== 1 ? 's' : ''} · {dn}/{items.length} items</span>
                <button type="button" className="vb-btn-danger-outline" style={{ padding: '6px 11px', fontSize: 12 }} onClick={() => store.addTrade(s.id)}>+ Trade</button>
                <button type="button" className="vb-task-delete" onClick={() => store.delSub(s.id)}>×</button>
              </div>
              {open && (
                <div className="vb-sub-body">
                  {s.trades.map((t) => {
                    const ti = (t.itps || []).concat(t.training || []);
                    const tdn = ti.filter((i) => i.status === 'done').length;
                    const topen = !!state.expanded['trade:' + t.id];
                    return (
                      <div key={t.id} className="vb-trade-card">
                        <div className="vb-trade-head">
                          <button type="button" className="vb-chevron-btn sm" onClick={() => store.toggleNode('trade:' + t.id)}>{topen ? '▾' : '▸'}</button>
                          <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--vb-ink-4)' }}>Trade</span>
                          <input className="vb-trade-name-input" value={t.name} onChange={(e) => store.editTrade(s.id, t.id, e.target.value)} />
                          <span style={{ fontSize: 12, color: 'var(--vb-ink-4)', fontVariantNumeric: 'tabular-nums' }}>{tdn}/{ti.length}</span>
                          <button type="button" className="vb-task-delete" style={{ fontSize: 15 }} onClick={() => store.delTrade(s.id, t.id)}>×</button>
                        </div>
                        {topen && (
                          <div className="vb-trade-body">
                            <div className="vb-trade-section-title">
                              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--vb-ink-2)' }}>ITPs</span>
                              <span style={{ fontSize: 11.5, color: 'var(--vb-ink-4)' }}>ITP submission &amp; digitisation</span>
                            </div>
                            {(t.itps || []).map((i) => (
                              <ItemCard key={i.id} item={i} today={today} sid={s.id} tid={t.id} cat="itps" menuOpen={state.statusMenuFor === i.id} store={store} />
                            ))}
                            <button type="button" className="vb-add-note-btn" style={{ margin: '2px 0 4px' }} onClick={() => store.addItem(s.id, t.id, 'itps')}>+ Add ITP</button>

                            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--vb-ink-2)', margin: '14px 0 8px' }}>Training</div>
                            {(t.training || []).map((i) => (
                              <ItemCard key={i.id} item={i} today={today} sid={s.id} tid={t.id} cat="training" menuOpen={state.statusMenuFor === i.id} store={store} />
                            ))}
                            <button type="button" className="vb-add-note-btn" style={{ margin: '2px 0 0' }} onClick={() => store.addItem(s.id, t.id, 'training')}>+ Add training</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {!s.trades.length && <div style={{ padding: '12px 4px', fontSize: 13, color: 'var(--vb-ink-4)' }}>No trades yet — use <b style={{ fontWeight: 600 }}>+ Trade</b> above to add one.</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
