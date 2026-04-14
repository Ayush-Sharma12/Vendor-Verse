import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { VendorProvider } from './context/VendorContext';

const el = document.getElementById('app');
if (el) {
  createRoot(el).render(
    <StrictMode>
      <LanguageProvider>
        <VendorProvider>
          <App />
        </VendorProvider>
      </LanguageProvider>
    </StrictMode>
  );
}
