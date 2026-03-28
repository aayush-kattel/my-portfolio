import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";
import LoadingIntro from "./components/LoadingIntro";

import Portfolio from "./pages/portfolio";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserDemandPage from "./pages/UserDemandPage";  // ← add this

function ProtectedRoute({ children }) {
  const isAuthed = sessionStorage.getItem("ak_admin") === "true";
  return isAuthed ? children : <Navigate to="/admin-login" replace />;
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <ThemeProvider>
      {!loaded && <LoadingIntro onDone={() => setLoaded(true)} />}

      <BrowserRouter>
        <Routes>
          <Route path="/"             element={<Portfolio />} />
          <Route path="/admin-login"  element={<AdminLogin />} />
          <Route path="/user-demand"  element={<UserDemandPage />} />  {/* ← add this */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}