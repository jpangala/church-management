import { Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./features/auth/auth.context";
import PrivateRoute from "./features/auth/PrivateRoute";
import ScrollToTop from "./lib/ScrollToTop";
import LandingPage from "./features/landing/LandingPage";
import LoginPage from "./features/auth/LoginPage";
import AdminDashboard from "./features/dashboard/admin/AdminDashboard";
import UsersListPage from "./features/dashboard/admin/UsersListPage";
import UserFormPage from "./features/dashboard/admin/UserFormPage";
import FinanceDashboard from "./features/dashboard/finance/FinanceDashboard";
import DivisionDashboard from "./features/dashboard/division/DivisionDashboard";

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <UsersListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users/new"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <UserFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <UserFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/finance/*"
          element={
            <PrivateRoute allowedRoles={["FINANCE"]}>
              <FinanceDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/division/*"
          element={
            <PrivateRoute allowedRoles={["DIVISION_LEADER"]}>
              <DivisionDashboard />
            </PrivateRoute>
          }
        />

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
