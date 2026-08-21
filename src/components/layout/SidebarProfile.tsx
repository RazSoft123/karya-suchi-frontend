import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { LogOut, MoreVertical, Settings, UserRound } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useLogoutMutation } from "../../queries/logoutMutation";
import { useAuthStore } from "../../store/authStore";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";
}

export default function SidebarProfile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!menuOpen) return;

    function closeOnOutsideClick(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  if (!user) return null;

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate("/auth/login", { replace: true });
      },
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <div ref={menuRef} className="absolute bottom-0 left-0 w-full">
      {menuOpen && (
        <div
          role="menu"
          aria-label="User menu"
          className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
        >
          <NavLink
            to="/profile"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-100"
          >
            <UserRound size={17} /> Profile
          </NavLink>
          <NavLink
            to="/settings"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-100"
          >
            <Settings size={17} /> Settings
          </NavLink>
          <div className="my-1 border-t border-slate-200" />
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={17} />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}

      <div className="flex h-20 items-center gap-2 border-t border-slate-300 bg-white px-3 py-3">
        <NavLink
          to="/profile"
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg p-1 hover:bg-slate-100"
        >
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white"
          >
            {getInitials(user.name)}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">{user.name}</span>
            <span className="truncate text-xs text-slate-500">{user.email}</span>
          </span>
        </NavLink>

        <button
          type="button"
          aria-label="Open user menu"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100"
        >
          <MoreVertical size={19} />
        </button>
      </div>
    </div>
  );
}
