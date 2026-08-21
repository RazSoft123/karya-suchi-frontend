import { NavLink } from "react-router";

interface EmptySectionProps {
  title: string;
  message: string;
  actionLabel?: string;
  to?: string;
}

export default function EmptySection({
  title,
  message,
  actionLabel,
  to,
}: EmptySectionProps) {
  return (
    <div className="flex min-h-40 w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{message}</p>
      {actionLabel && to && (
        <NavLink
          to={to}
          className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {actionLabel}
        </NavLink>
      )}
    </div>
  );
}
