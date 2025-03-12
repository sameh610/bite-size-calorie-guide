
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create and render the root element
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found!");
}
