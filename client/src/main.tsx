import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { suppressResizeObserverWarning } from './lib/resize-observer-polyfill';

// Suppress ResizeObserver warnings
suppressResizeObserverWarning();

createRoot(document.getElementById("root")!).render(<App />);