
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const globalWithRoot = globalThis as typeof globalThis & {
  _reactRoot?: ReactDOM.Root;
};

if (!globalWithRoot._reactRoot) {
  globalWithRoot._reactRoot = ReactDOM.createRoot(rootElement);
}

globalWithRoot._reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
