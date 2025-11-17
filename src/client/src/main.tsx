import React from 'react';
import ReactDOM from 'react-dom/client';
import AppModern from './AppModern';
import { ThemeProvider } from './components/theme-provider';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="task-manager-theme">
      <AppModern />
    </ThemeProvider>
  </React.StrictMode>
);
