import { Mail, UserRound } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";
}

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

  return (
    <main className="font-inter max-h-dvh overflow-auto px-4 py-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-slate-600">Your signed-in account information.</p>
        </div>

        <section className="rounded-xl border border-app-border bg-white p-6">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-xl font-bold text-white">
              {getInitials(user.name)}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold">{user.name}</h2>
              <p className="truncate text-sm text-slate-500">{user.email}</p>
            </div>
          </div>

          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <UserRound size={16} /> Full name
              </dt>
              <dd className="mt-1 break-words">{user.name}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Mail size={16} /> Email address
              </dt>
              <dd className="mt-1 break-words">{user.email}</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
