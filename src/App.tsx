import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AppErrorBoundary } from './components/modals/Overlays';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </AppErrorBoundary>
  );
}

export default App;
