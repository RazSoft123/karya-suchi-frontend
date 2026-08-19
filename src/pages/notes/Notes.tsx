import { useState } from "react";
import { NavLink } from "react-router";
import NoteCard from "../../components/notes/NoteCard";
import { useNotesQuery } from "../../queries/noteQueries";
import { useWorkspacesQuery } from "../../queries/workspaceQueries";

export default function Notes() {
  const [workspaceId, setWorkspaceId] = useState("");
  const notesQuery = useNotesQuery(workspaceId || undefined);
  const workspacesQuery = useWorkspacesQuery();

  return (
    <main className="font-inter max-h-dvh overflow-auto px-4 py-4">
      <div className="flex flex-col gap-6">
        <section className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-inter text-2xl font-semibold">Notes</h1>
            <p className="font-inter text-sm text-slate-600">
              Notes from the workspaces you can access
            </p>
          </div>
          <NavLink
            to="/notes/new"
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            New note
          </NavLink>
        </section>

        <section className="flex items-center gap-3">
          <label htmlFor="workspace-filter" className="text-sm font-semibold">
            Workspace
          </label>
          <select
            id="workspace-filter"
            value={workspaceId}
            onChange={(event) => setWorkspaceId(event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            disabled={workspacesQuery.isLoading}
          >
            <option value="">All workspaces</option>
            {workspacesQuery.data?.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
        </section>

        <section>
          {notesQuery.isLoading && (
            <p className="text-sm text-slate-600">Loading notes...</p>
          )}

          {notesQuery.isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {notesQuery.error.message}
            </div>
          )}

          {notesQuery.isSuccess && notesQuery.data.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center">
              <h2 className="text-lg font-semibold">No notes yet</h2>
              <p className="mt-1 text-sm text-slate-600">
                Create a note and attach it to one of your workspaces.
              </p>
            </div>
          )}

          {notesQuery.isSuccess && notesQuery.data.length > 0 && (
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {notesQuery.data.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
