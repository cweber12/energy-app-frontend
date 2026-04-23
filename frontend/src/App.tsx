import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";

// Lazy-load the dashboard so Recharts and all dashboard code are excluded
// from the initial bundle served to unauthenticated users.
const AccountDashboard = lazy(() => import("./pages/AccountDashboard"));

const App: React.FC = () => (
  <ThemeProvider>
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<AccountDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </ThemeProvider>
);

export default App;