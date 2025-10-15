// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import "quill/dist/quill.snow.css";


import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx'; 
import "@fortawesome/fontawesome-free/css/all.min.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);