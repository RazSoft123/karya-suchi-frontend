import { useMemo, useState } from "react";
import { NavLink } from "react-router";
import TaskCard from "../../components/task/TaskCard";
import { useTasksQuery } from "../../queries/taskQueries";
import { useWorkspacesQuery } from "../../queries/workspaceQueries";
import type { TaskStatus } from "../../utils/types";

type StatusFilter = "all" | TaskStatus;

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All tasks" },
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export default function Tasks() {
  const [workspaceId, setWorkspaceId] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const tasksQuery = useTasksQuery(workspaceId || undefined);
  const workspacesQuery = useWorkspacesQuery();

  const visibleTasks = useMemo(() => {
    const tasks = tasksQuery.data ?? [];
    if (status === "all") return tasks;
    return tasks.filter(
      (task) =>
        (task.status ?? (task.completed ? "completed" : "todo")) === status,
    );
  }, [status, tasksQuery.data]);

  return (
    <main className="font-inter max-h-dvh overflow-auto px-4 py-4">
      <div className="flex flex-col gap-6">
        <section className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Tasks</h1>
            <p className="text-sm text-slate-600">
              Tasks from the workspaces you can access
            </p>
          </div>
          <NavLink
            to="/tasks/new"
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            New task
          </NavLink>
        </section>

        <section className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="task-workspace-filter" className="text-sm font-semibold">
              Workspace
            </label>
            <select
              id="task-workspace-filter"
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
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  status === option.value
                    ? "border-black bg-black text-white"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          {tasksQuery.isLoading && (
            <p className="text-sm text-slate-600">Loading tasks...</p>
          )}

          {tasksQuery.isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {tasksQuery.error.message}
            </div>
          )}

          {tasksQuery.isSuccess && visibleTasks.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center">
              <h2 className="text-lg font-semibold">No tasks found</h2>
              <p className="mt-1 text-sm text-slate-600">
                Create a task in a workspace to get started.
              </p>
            </div>
          )}

          {visibleTasks.length > 0 && (
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {visibleTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
