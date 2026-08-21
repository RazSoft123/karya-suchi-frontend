import { FilePlus2, ListPlus, Settings2 } from "lucide-react";
import { NavLink, useParams } from "react-router";
import EmptySection from "../../components/dashboard/EmptySection";
import NoteCard from "../../components/notes/NoteCard";
import TaskCard from "../../components/task/TaskCard";
import { useNotesQuery } from "../../queries/noteQueries";
import { useTasksQuery } from "../../queries/taskQueries";
import { useWorkspaceQuery } from "../../queries/workspaceQueries";

export default function WorkspaceOverview() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const workspaceQuery = useWorkspaceQuery(workspaceId);
  const tasksQuery = useTasksQuery(workspaceId);
  const notesQuery = useNotesQuery(workspaceId);

  if (workspaceQuery.isLoading) {
    return <main className="p-6 text-sm text-slate-600">Loading workspace...</main>;
  }

  if (workspaceQuery.isError || !workspaceQuery.data) {
    return (
      <main className="p-6">
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {workspaceQuery.error?.message ?? "Workspace not found"}
        </p>
        <NavLink
          to="/workspace"
          className="mt-4 inline-block text-sm font-semibold underline"
        >
          Back to workspaces
        </NavLink>
      </main>
    );
  }

  const workspace = workspaceQuery.data;
  const canCreateContent = workspace.canEdit !== false;

  return (
    <main className="font-inter max-h-dvh overflow-auto px-4 py-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-xl border border-app-border bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold">{workspace.name}</h1>
                {workspace.isDefault && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Default
                  </span>
                )}
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {workspace.isOwner ? "Owned" : "Shared"}
                </span>
              </div>
              <p className="max-w-3xl text-sm text-slate-600">
                {workspace.description?.trim() || "No workspace description."}
              </p>
            </div>

            <NavLink to="/workspace" className="text-sm font-semibold underline">
              Back to workspaces
            </NavLink>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-200 pt-5">
            {canCreateContent && (
              <>
                <NavLink
                  to={`/tasks/new?workspace=${workspace.id}`}
                  className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <ListPlus size={17} /> New task
                </NavLink>
                <NavLink
                  to={`/notes/new?workspace=${workspace.id}`}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
                >
                  <FilePlus2 size={17} /> New note
                </NavLink>
              </>
            )}
            {workspace.canManage && (
              <NavLink
                to={`/workspace/${workspace.id}/settings`}
                className="ml-auto flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
              >
                <Settings2 size={17} /> Workspace settings
              </NavLink>
            )}
          </div>

          {!canCreateContent && (
            <p className="mt-4 text-sm text-slate-500">
              This workspace is read-only.
            </p>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Tasks</h2>
            {tasksQuery.isSuccess && (
              <span className="text-sm text-slate-500">
                {tasksQuery.data.length} {tasksQuery.data.length === 1 ? "task" : "tasks"}
              </span>
            )}
          </div>

          {tasksQuery.isLoading && (
            <p className="text-sm text-slate-600">Loading tasks...</p>
          )}
          {tasksQuery.isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {tasksQuery.error.message}
            </div>
          )}
          {tasksQuery.isSuccess && tasksQuery.data.length === 0 && (
            <EmptySection
              title="No tasks in this workspace"
              message={
                canCreateContent
                  ? "Create a task to start working in this workspace."
                  : "There are no tasks to display."
              }
              actionLabel={canCreateContent ? "Create task" : undefined}
              to={
                canCreateContent
                  ? `/tasks/new?workspace=${workspace.id}`
                  : undefined
              }
            />
          )}
          {tasksQuery.isSuccess && tasksQuery.data.length > 0 && (
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {tasksQuery.data.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Notes</h2>
            {notesQuery.isSuccess && (
              <span className="text-sm text-slate-500">
                {notesQuery.data.length} {notesQuery.data.length === 1 ? "note" : "notes"}
              </span>
            )}
          </div>

          {notesQuery.isLoading && (
            <p className="text-sm text-slate-600">Loading notes...</p>
          )}
          {notesQuery.isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {notesQuery.error.message}
            </div>
          )}
          {notesQuery.isSuccess && notesQuery.data.length === 0 && (
            <EmptySection
              title="No notes in this workspace"
              message={
                canCreateContent
                  ? "Create a note to capture information in this workspace."
                  : "There are no notes to display."
              }
              actionLabel={canCreateContent ? "Create note" : undefined}
              to={
                canCreateContent
                  ? `/notes/new?workspace=${workspace.id}`
                  : undefined
              }
            />
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
