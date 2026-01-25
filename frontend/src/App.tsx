import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AccountDashboard from './pages/AccountDashboard';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => (
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<AccountDashboard />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;