
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove the BrowserRouter since we're using a single-page approach
createRoot(document.getElementById("root")!).render(<App />);
