import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { SnackbarProvider } from 'notistack'; 

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
