import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/globals.css';
import { App } from './app/App';
import { SupabaseProvider } from './app/providers/SupabaseProvider';
import { AuthProvider } from './app/providers/AuthProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SupabaseProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SupabaseProvider>
    </BrowserRouter>
  </StrictMode>,
);
