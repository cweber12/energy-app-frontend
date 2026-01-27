import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AccountDashboard from "./pages/AccountDashboard";
import { ThemeProvider } from "./context/ThemeContext";

const App: React.FC = () => (
  <ThemeProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/account" element={<AccountDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </ThemeProvider>
);

export default App;