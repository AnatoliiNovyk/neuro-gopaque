import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Перевірка підключення до Supabase у development режимі
if (import.meta.env.DEV) {
  import('./lib/supabase-check').then(module => {
    module.checkSupabaseConnection();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
