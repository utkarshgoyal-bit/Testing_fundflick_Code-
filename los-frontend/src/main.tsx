import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './translations/i18n.ts';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/shared/themeProvider.tsx';
import store from './redux/store';
import { Provider } from 'react-redux';
import ErrorBoundary from './routes/errorElement.tsx';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then(function (registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function (error) {
      console.log('Service Worker registration failed:', error);
    });
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ErrorBoundary>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>
  // </StrictMode>
);
