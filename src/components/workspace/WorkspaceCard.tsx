import { FilePlus2, ListPlus, Settings2 } from "lucide-react";
import { NavLink } from "react-router";
import type { Workspace } from "../../utils/types";

export default function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-app-border bg-white">
      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black">
            <span className="font-inter text-2xl font-semibold text-white">
              {workspace.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-wrap justify-end gap-2 text-xs font-semibold">
            {workspace.isDefault && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">
                Default
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
              {workspace.isOwner ? "Owned" : "Shared"}
            </span>
          </div>
        </div>

        <div className="font-inter flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{workspace.name}</h3>
          <p className="text-body text-slate-600">
            {workspace.description?.trim() || "No workspace description."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 bg-gray-100 px-4 py-4">
        {workspace.canEdit !== false && (
          <>
            <NavLink
              to={`/notes/new?workspace=${workspace.id}`}
              className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm font-semibold"
            >
              <FilePlus2 size={15} /> Note
            </NavLink>
            <NavLink
              to={`/tasks/new?workspace=${workspace.id}`}
              className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm font-semibold"
            >
              <ListPlus size={15} /> Task
            </NavLink>
          </>
        )}
        <NavLink
          to={`/workspace/${workspace.id}`}
          className="ml-auto flex items-center gap-1 rounded-md bg-black px-2 py-1 text-sm font-semibold text-white"
        >
          <Settings2 size={15} /> {workspace.canManage ? "Manage" : "Open"}
        </NavLink>
      </div>
    </article>
  );
}
