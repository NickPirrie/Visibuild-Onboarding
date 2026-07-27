import { useState, useEffect, useRef } from 'react';

export function LocalInput({ value, onCommit, ...rest }) {
  const [local, setLocal] = useState(value ?? '');
  const focused = useRef(false);
  const localRef = useRef(local);
  const onCommitRef = useRef(onCommit);

  useEffect(() => { localRef.current = local; }, [local]);
  useEffect(() => { onCommitRef.current = onCommit; }, [onCommit]);

  // Sync from outside only when not focused
  useEffect(() => {
    if (!focused.current) setLocal(value ?? '');
  }, [value]);

  // Save on unmount if the field was still active (e.g. user navigated away)
  useEffect(() => {
    return () => {
      if (focused.current) onCommitRef.current(localRef.current);
    };
  }, []);

  return (
    <input
      {...rest}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onFocus={() => { focused.current = true; }}
      onBlur={(e) => { focused.current = false; onCommit(e.target.value); }}
    />
  );
}

export function LocalTextarea({ value, onCommit, autoGrow, ...rest }) {
  const [local, setLocal] = useState(value ?? '');
  const focused = useRef(false);
  const ref = useRef(null);
  const localRef = useRef(local);
  const onCommitRef = useRef(onCommit);

  useEffect(() => { localRef.current = local; }, [local]);
  useEffect(() => { onCommitRef.current = onCommit; }, [onCommit]);

  // Sync from outside only when not focused
  useEffect(() => {
    if (!focused.current) setLocal(value ?? '');
  }, [value]);

  // Save on unmount if the field was still active (e.g. user navigated away)
  useEffect(() => {
    return () => {
      if (focused.current) onCommitRef.current(localRef.current);
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
      onFocus={() => { focused.current = true; }}
      onBlur={(e) => { focused.current = false; onCommit(e.target.value); }}
    />
  );
}
