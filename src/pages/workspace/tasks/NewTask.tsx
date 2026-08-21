import {
  ArrowLeft,
  CalendarDays,
  Flag,
  Layers3,
  ListTodo,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import { useCreateTaskMutation } from "../../../queries/taskQueries";
import { useWorkspacesQuery } from "../../../queries/workspaceQueries";

export default function NewTask() {
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    "medium",
  );
  const [dueDate, setDueDate] = useState("");
  const [workspaceId, setWorkspaceId] = useState(
    searchParams.get("workspace") ?? "",
  );
  const navigate = useNavigate();
  const workspacesQuery = useWorkspacesQuery();
  const createMutation = useCreateTaskMutation();
  const requestedWorkspaceExists = workspacesQuery.data?.some(
    (workspace) => workspace.id === workspaceId,
  );
  const defaultWorkspaceId =
    workspacesQuery.data?.find((workspace) => workspace.isDefault)?.id ??
    workspacesQuery.data?.[0]?.id ??
    "";
  const selectedWorkspaceId = requestedWorkspaceExists
    ? workspaceId
    : defaultWorkspaceId;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("A task title is required");
      return;
    }

    if (!selectedWorkspaceId) {
      toast.error("Create or select a workspace first");
      return;
    }

    createMutation.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        priority,
        workspaceId: selectedWorkspaceId,
        ...(dueDate ? { dueDate } : {}),
      },
      {
        onSuccess: () => {
          toast.success("Task created");
          navigate("/tasks");
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <main className="font-inter max-h-dvh overflow-auto bg-slate-50 px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <NavLink
              to="/tasks"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-black"
            >
              <ArrowLeft size={16} /> Back to tasks
            </NavLink>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Create a new task
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Add the details, choose its workspace, and set a deadline.
            </p>
          </div>
          <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-black text-white sm:flex">
            <ListTodo size={25} />
          </div>
        </header>

        {workspacesQuery.isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {workspacesQuery.error.message}
          </div>
        )}

        {workspacesQuery.isSuccess && workspacesQuery.data.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h2 className="text-lg font-semibold">You need a workspace first</h2>
            <p className="mt-1 text-sm text-slate-600">
              Every task must belong to one of your workspaces.
            </p>
            <NavLink
              to="/workspace/new"
              className="mt-5 inline-block rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Create workspace
            </NavLink>
          </div>
        )}

        {!workspacesQuery.isError &&
          !(workspacesQuery.isSuccess && workspacesQuery.data.length === 0) && (
            <form
              onSubmit={handleSubmit}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <section className="px-6 py-7 sm:px-8 sm:py-8">
                <label
                  htmlFor="task-title"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Task title
                </label>
                <input
                  id="task-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={200}
                  className="mt-3 w-full border-0 bg-transparent text-2xl font-semibold text-slate-950 outline-none placeholder:text-slate-300 sm:text-3xl"
                  placeholder="What needs to be done?"
                  autoFocus
                  required
                />
              </section>

              <div className="border-t border-slate-100" />

              <section className="px-6 py-7 sm:px-8">
                <label
                  htmlFor="task-description"
                  className="text-sm font-semibold text-slate-700"
                >
                  Description
                </label>
                <textarea
                  id="task-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={8}
                  maxLength={10000}
                  className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  placeholder="Add context, requirements, or anything useful for completing this task..."
                />
                <p className="mt-2 text-right text-xs text-slate-400">
                  {description.length.toLocaleString()} / 10,000
                </p>
              </section>

              <section className="grid gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-6 sm:px-8 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label
                    htmlFor="task-workspace"
                    className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                  >
                    <Layers3 size={17} className="text-slate-400" /> Workspace
                  </label>
                  <select
                    id="task-workspace"
                    value={selectedWorkspaceId}
                    onChange={(event) => setWorkspaceId(event.target.value)}
                    className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                    disabled={workspacesQuery.isLoading}
                    required
                  >
                    {workspacesQuery.isLoading && (
                      <option value="">Loading workspaces...</option>
                    )}
                    {workspacesQuery.data?.map((workspace) => (
                      <option key={workspace.id} value={workspace.id}>
                        {workspace.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label
                    htmlFor="task-priority"
                    className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                  >
                    <Flag size={17} className="text-slate-400" /> Priority
                  </label>
                  <select
                    id="task-priority"
                    value={priority}
                    onChange={(event) =>
                      setPriority(
                        event.target.value as "low" | "medium" | "high",
                      )
                    }
                    className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <label
                    htmlFor="task-due-date"
                    className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                  >
                    <CalendarDays size={17} className="text-slate-400" /> Due date
                  </label>
                  <input
                    id="task-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                </div>
              </section>

              <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 px-6 py-5 sm:px-8">
                <NavLink
                  to="/tasks"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-black"
                >
                  Cancel
                </NavLink>
                <button
                  type="submit"
                  disabled={createMutation.isPending || !selectedWorkspaceId}
                  className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {createMutation.isPending ? "Creating task..." : "Create task"}
                </button>
              </footer>
            </form>
          )}
      </div>
    </main>
  );
}
