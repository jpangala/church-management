import { Navigate } from "react-router-dom";
import { useAuth } from "./auth.context";
import type { Role } from "@church/shared";

interface Props {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export default function PrivateRoute({ children, allowedRoles }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Memuat...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
