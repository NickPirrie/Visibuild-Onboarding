import { useState, useEffect, useRef } from 'react';

/**
 * LocalInput / LocalTextarea — commit-on-blur pattern.
 *
 * The key insight: we track `lastCommitted` (what we last sent to the store).
 * We only sync inward from the store when the store value differs from what we
 * committed — i.e., an *external* change arrived.  Bounces of our own commits
 * (store → value prop → effect) are silently ignored, so typing in-progress
 * is never interrupted.
 */

export function LocalInput({ value, onCommit, ...rest }) {
  const [local, setLocal] = useState(value ?? '');
  const lastCommitted = useRef(value ?? '');
  const localRef = useRef(local);
  const onCommitRef = useRef(onCommit);

  // Keep latest local value and onCommit in refs so cleanup can use them.
  useEffect(() => { localRef.current = local; }, [local]);
  useEffect(() => { onCommitRef.current = onCommit; }, [onCommit]);

  // Only pull in external changes when they're genuinely external
  // (not a reflection of something we just committed).
  useEffect(() => {
    const incoming = value ?? '';
    if (incoming !== lastCommitted.current) {
      setLocal(incoming);
      lastCommitted.current = incoming;
    }
  }, [value]);

  // If the component unmounts while the user is mid-edit (e.g. navigation),
  // commit whatever they typed so it isn't silently lost.
  useEffect(() => {
    return () => {
      if (localRef.current !== lastCommitted.current) {
        onCommitRef.current(localRef.current);
      }
    };
  }, []);

  return (
    <input
      {...rest}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={(e) => {
        const v = e.target.value;
        lastCommitted.current = v;
        onCommit(v);
      }}
    />
  );
}

export function LocalTextarea({ value, onCommit, autoGrow, ...rest }) {
  const [local, setLocal] = useState(value ?? '');
  const lastCommitted = useRef(value ?? '');
  const localRef = useRef(local);
  const onCommitRef = useRef(onCommit);
  const ref = useRef(null);

  useEffect(() => { localRef.current = local; }, [local]);
  useEffect(() => { onCommitRef.current = onCommit; }, [onCommit]);

  useEffect(() => {
    const incoming = value ?? '';
    if (incoming !== lastCommitted.current) {
      setLocal(incoming);
      lastCommitted.current = incoming;
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (localRef.current !== lastCommitted.current) {
        onCommitRef.current(localRef.current);
      }
    };
  }, []);

  function resize(el) {
    if (!el || !autoGrow) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  useEffect(() => { resize(ref.current); }, [local, autoGrow]);

  return (
    <textarea
      ref={ref}
      {...rest}
      value={local}
      onChange={(e) => { setLocal(e.target.value); resize(e.target); }}
      onBlur={(e) => {
        const v = e.target.value;
        lastCommitted.current = v;
        onCommit(v);
      }}
    />
  );
}
