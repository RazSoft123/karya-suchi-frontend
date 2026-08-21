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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("A task title is required");
      return;
    }

    createMutation.mutate(
      {
        title: title.trim(),
        description,
        priority,
        ...(dueDate ? { dueDate } : {}),
        ...(workspaceId ? { workspaceId } : {}),
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
    <main className="font-inter max-h-dvh overflow-auto px-4 py-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Create task</h1>
            <p className="text-sm text-slate-600">
              Leave workspace as default to use your personal workspace.
            </p>
          </div>
          <NavLink to="/tasks" className="text-sm font-semibold underline">
            Back to tasks
          </NavLink>
        </div>

        {workspacesQuery.isError && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Workspaces could not be loaded. You can still create this task in
            your default workspace.
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-xl border border-app-border bg-white p-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="task-workspace" className="text-sm font-semibold">
              Workspace
            </label>
            <select
              id="task-workspace"
              value={workspaceId}
              onChange={(event) => setWorkspaceId(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2"
              disabled={workspacesQuery.isLoading}
            >
              <option value="">Default workspace</option>
              {workspacesQuery.data?.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="task-title" className="text-sm font-semibold">
              Title
            </label>
            <input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
              className="rounded-md border border-slate-300 px-3 py-2"
              placeholder="Task title"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="task-description" className="text-sm font-semibold">
              Description
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={8}
              maxLength={10000}
              className="resize-y rounded-md border border-slate-300 px-3 py-2"
              placeholder="Describe the task..."
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="task-priority" className="text-sm font-semibold">
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as "low" | "medium" | "high")
                }
                className="rounded-md border border-slate-300 px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="task-due-date" className="text-sm font-semibold">
                Due date
              </label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <NavLink
              to="/tasks"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </NavLink>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? "Creating..." : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
