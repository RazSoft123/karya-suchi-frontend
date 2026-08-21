import { Mail, UserRound } from "lucide-react";
import { NavLink } from "react-router";
import { useAuthStore } from "../../store/authStore";

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

  return (
    <main className="font-inter max-h-dvh overflow-auto px-4 py-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-slate-600">Review your current account settings.</p>
        </div>

        <section className="rounded-xl border border-app-border bg-white p-6">
          <h2 className="text-lg font-semibold">Account</h2>
          <p className="mt-1 text-sm text-slate-600">
            These details belong to the account currently signed in.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <UserRound size={16} /> Display name
              </p>
              <p className="mt-1 break-words">{user.name}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Mail size={16} /> Email address
              </p>
              <p className="mt-1 break-words">{user.email}</p>
            </div>
          </div>

          <NavLink
            to="/profile"
            className="mt-6 inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
          >
            View profile
          </NavLink>
        </section>
      </div>
    </main>
  );
}
