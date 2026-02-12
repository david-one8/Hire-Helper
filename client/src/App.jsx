import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@context/ThemeContext';
import { NotificationProvider } from '@context/NotificationContext';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
            }}
          />
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
