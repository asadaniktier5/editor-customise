import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'draft-js-emoji-plugin/lib/plugin.css'; // Import the plugin's CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);