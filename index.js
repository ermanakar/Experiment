import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');

if (root._reactRootContainer) {
  // root has been initialised, just update it
  root._reactRootContainer.render(<App />);
} else {
  // root hasn't been initialised, create a new root
  root._reactRootContainer = createRoot(root);
  root._reactRootContainer.render(<App />);
}
