import { Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./features/identity/auth.context";
import PrivateRoute from "./features/identity/PrivateRoute";
import ScrollToTop from "./lib/ScrollToTop";
import LandingPage from "./features/landing/LandingPage";
import LoginPage from "./features/identity/LoginPage";
import { MODULE_ROUTES } from "./app/routes";

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {MODULE_ROUTES.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={
              <PrivateRoute allowedRoles={r.roles}>{r.element}</PrivateRoute>
            }
          />
        ))}

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

function Unauthorized() {
  return (
    <div className="flex h-screen items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-primary">Akses Ditolak</h1>
        <p className="mt-2 text-muted-foreground">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
      </div>
    </div>
  );
}
