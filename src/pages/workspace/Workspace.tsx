import { NavLink } from "react-router";
import WorkspaceCard from "../../components/workspace/WorkspaceCard";
import { useWorkspacesQuery } from "../../queries/workspaceQueries";

export default function Workspace() {
  const workspacesQuery = useWorkspacesQuery();

  return (
    <main className="font-inter max-h-dvh overflow-auto px-4 py-4">
      <div className="flex flex-col gap-6">
        <section className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Workspaces</h1>
            <p className="text-sm text-slate-600">
              Organize related notes and tasks in one place.
            </p>
          </div>
          <NavLink
            to="/workspace/new"
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            New workspace
          </NavLink>
        </section>

        {workspacesQuery.isLoading && (
          <p className="text-sm text-slate-600">Loading workspaces...</p>
        )}

        {workspacesQuery.isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {workspacesQuery.error.message}
          </div>
        )}

        {workspacesQuery.isSuccess && workspacesQuery.data.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center">
            <h2 className="text-lg font-semibold">No workspaces found</h2>
            <p className="mt-1 text-sm text-slate-600">
              Create a workspace to organize your notes and tasks.
            </p>
          </div>
        )}

        {workspacesQuery.isSuccess && workspacesQuery.data.length > 0 && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workspacesQuery.data.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
