import * as React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

import 'mapbox-gl/dist/mapbox-gl.css';
import "normalize.css";


export function renderToDom(container: HTMLElement) {
  createRoot(container).render(<React.StrictMode>
      <App />
  </React.StrictMode>);
}
