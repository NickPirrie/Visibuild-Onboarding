import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/tokens.css';
import './styles/app.css';

// Note: intentionally not wrapped in <StrictMode> — it double-invokes state
// updater functions in dev, and our mutate() helper both clones state and
// triggers a debounced network save as a side effect of that updater.
createRoot(document.getElementById('root')).render(<App />);
