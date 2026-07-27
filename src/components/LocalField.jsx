import { useState, useEffect, useRef } from 'react';

export function LocalInput({ value, onCommit, ...rest }) {
  const [local, setLocal] = useState(value ?? '');
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setLocal(value ?? '');
  }, [value]);
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

  useEffect(() => {
    if (!focused.current) setLocal(value ?? '');
  }, [value]);

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
