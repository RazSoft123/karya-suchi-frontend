import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedLayouts() {
  const location = useLocation();
  const isAuthenticated = useAuthStore(
    (state) => state.auth && state.user !== null,
  );

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
