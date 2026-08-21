import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useParams } from "react-router";
import {
  useDeleteTaskMutation,
  useTaskQuery,
  useUpdateTaskMutation,
} from "../../queries/taskQueries";
import { useWorkspacesQuery } from "../../queries/workspaceQueries";
import type { Task, TaskStatus } from "../../utils/types";

function dateInputValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function TaskEditor({ task }: { task: Task }) {
  const initialWorkspaceId =
    typeof task.workspace === "string" ? "" : task.workspace?.id || "";
  const initialStatus = task.status ?? (task.completed ? "completed" : "todo");
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    task.priority ?? "medium",
  );
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [dueDate, setDueDate] = useState(dateInputValue(task.dueDate));
  const [workspaceId, setWorkspaceId] = useState(initialWorkspaceId);
  const navigate = useNavigate();
  const workspacesQuery = useWorkspacesQuery();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !workspaceId) {
      toast.error("Title and workspace are required");
      return;
    }

    updateMutation.mutate(
      {
        id: task.id,
        title: title.trim(),
        description,
        priority,
        status,
        dueDate: dueDate || null,
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Task saved");
          navigate(`/tasks/${task.id}`, { replace: true });
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  function handleDelete() {
    if (!window.confirm("Delete this task? This action cannot be undone from the app.")) {
      return;
    }

    deleteMutation.mutate(task.id, {
      onSuccess: () => {
        toast.success("Task deleted");
        navigate("/tasks", { replace: true });
      },
      onError: (error) => toast.error(error.message),
    });
  }

  return (
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
          required
        >
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
          rows={10}
          maxLength={10000}
          className="resize-y rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
          <label htmlFor="task-status" className="text-sm font-semibold">
            Status
          </label>
          <select
            id="task-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskStatus)}
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
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

      <div className="flex flex-wrap justify-between gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete task"}
        </button>

        <div className="flex gap-3">
          <NavLink
            to={`/tasks/${task.id}`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
          >
            Back
          </NavLink>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function TaskDetails() {
  const { taskId } = useParams();
  const taskQuery = useTaskQuery(taskId);

  return (
    <main className="font-inter max-h-dvh overflow-auto px-4 py-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
          <h1 className="text-2xl font-semibold">Edit task</h1>
          <p className="text-sm text-slate-600">
            Edit, complete, move, archive, or delete this task.
          </p>
          </div>
          <NavLink
            to={`/tasks/${taskId}`}
            className="text-sm font-semibold underline"
          >
            Back to task
          </NavLink>
        </div>

        {taskQuery.isLoading && <p>Loading task...</p>}

        {taskQuery.isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {taskQuery.error.message}
          </div>
        )}

        {taskQuery.data && (
          <TaskEditor
            key={`${taskQuery.data.id}-${taskQuery.data.updatedAt}`}
            task={taskQuery.data}
          />
        )}
      </div>
    </main>
  );
}
