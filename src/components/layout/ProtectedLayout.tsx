import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useSessionQuery } from "../../queries/sessionQuery";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedLayouts() {
  const location = useLocation();
  const auth = useAuthStore((state) => state.auth);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const hasPersistedSession = auth && user !== null;
  const sessionQuery = useSessionQuery(hasPersistedSession);

  useEffect(() => {
    if (sessionQuery.data) setUser(sessionQuery.data);
  }, [sessionQuery.data, setUser]);

  if (!hasPersistedSession) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (sessionQuery.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-slate-600">
        Checking your session...
      </main>
    );
  }

  if (sessionQuery.isError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-red-700">
          {sessionQuery.error.message || "Unable to verify your session."}
        </p>
        <button
          type="button"
          onClick={() => void sessionQuery.refetch()}
          className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </main>
    );
  }

  return <Outlet />;
}
