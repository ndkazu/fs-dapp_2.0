import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/shared/Layout';

function App() {
  return (
    <div className="app">
      <AppProvider>
        <Layout />
      </AppProvider>
    </div>
  );
}

export default App;
