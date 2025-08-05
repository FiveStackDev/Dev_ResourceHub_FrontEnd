import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    // This is handled by the PWAUpdatePrompt component
    console.log('New content available, refresh to update.');
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
