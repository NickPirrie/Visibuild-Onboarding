import { useState } from 'react';

export default function NameGate({ onSubmit }) {
  const [name, setName] = useState('');

  function submit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <div className="vb-namegate">
      <form className="vb-namegate-card" onSubmit={submit}>
        <img src="/assets/icon-green.png" alt="" style={{ height: 34, width: 34 }} />
        <h1>Welcome to the Onboarding Portal</h1>
        <p>What's your name? It'll show next to comments and edits you make so the team knows who did what.</p>
        <input
          autoFocus
          className="vb-namegate-input"
          placeholder="e.g. Nick Pirrie"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="vb-btn-primary" style={{ width: '100%' }}>Continue</button>
      </form>
    </div>
  );
}
