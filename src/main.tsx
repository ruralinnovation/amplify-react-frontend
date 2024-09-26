import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { ApiContextProvider } from "@cori-risi/cori.data.api";

import App from './App';

import "normalize.css";
import './index.css';


const DATA_API_URL = "https://cori-risi-apps.s3.amazonaws.com";

export function renderToDom(container) {
  createRoot(container).render(<React.StrictMode>
      <ApiContextProvider baseURL={DATA_API_URL}>
          <App />
      </ApiContextProvider>
  </React.StrictMode>);
}
