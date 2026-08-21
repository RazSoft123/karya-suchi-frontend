import { ArrowRight, ListTodo, NotebookText } from "lucide-react";
import { NavLink } from "react-router";
import type { Workspace } from "../../utils/types";

export default function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-app-border bg-white">
      <NavLink
        to={`/workspace/${workspace.id}`}
        aria-label={`View ${workspace.name} workspace`}
        className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
      />
      <div className="pointer-events-none relative z-[1] flex flex-1 flex-col gap-5 px-6 py-6 transition group-hover:bg-slate-50">
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

      <div className="pointer-events-none relative z-10 flex flex-wrap gap-2 bg-gray-100 px-4 py-4">
        <span className="flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-sm font-semibold text-slate-600">
          <ListTodo size={15} /> {workspace.openTaskCount ?? 0}{" "}
          {(workspace.openTaskCount ?? 0) === 1 ? "task due" : "tasks due"}
        </span>
        <span className="flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-sm font-semibold text-slate-600">
          <NotebookText size={15} /> {workspace.noteCount ?? 0}{" "}
          {(workspace.noteCount ?? 0) === 1 ? "note" : "notes"}
        </span>
        <NavLink
          to={`/workspace/${workspace.id}`}
          className="pointer-events-auto ml-auto flex items-center gap-1 rounded-md bg-black px-2 py-1 text-sm font-semibold text-white"
        >
          View workspace <ArrowRight size={15} />
        </NavLink>
      </div>
    </article>
  );
}
