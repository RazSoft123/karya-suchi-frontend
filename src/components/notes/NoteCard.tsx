import { NavLink } from "react-router";
import type { Note } from "../../utils/types";
import { ArrowUpRight, Layers } from "lucide-react";

export default function NoteCard({ note }: { note: Note }) {
  const workspaceName =
    typeof note.workspace === "string"
      ? note.workspace
      : note.workspace?.name || "Workspace";
  const updatedDate = new Date(
    note.updatedAt ?? note.createdAt,
  ).toLocaleDateString();

  return (
    <NavLink to={`/notes/${note.id}`} className="h-full">
      <article className="font-inter flex h-full flex-col gap-6 rounded-xl border border-app-border px-6 py-6 transition hover:-translate-y-0.5 hover:shadow-md">
        <span className="hidden">{note.id}</span>
        <div className="flex w-full items-center justify-between">
          <div className="rounded-sm bg-gray-200 px-2 py-2">
            <Layers />
          </div>
          <div className="rounded-sm px-2 py-2">
            <ArrowUpRight size={20} />
          </div>
        </div>

        <div className="font-inter flex flex-col gap-3">
          <h3 className="font-inter text-lg font-semibold">{note.title}</h3>
          <p className="font-inter text-body whitespace-pre-wrap break-words text-slate-600">
            {note.content?.trim() || "This note does not have any content yet."}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <div className="text-sm font-semibold text-slate-600">
            {updatedDate}
          </div>
          <div className="truncate text-sm font-semibold text-slate-600">
            {workspaceName}
          </div>
        </div>
      </article>
    </NavLink>
  );
}
