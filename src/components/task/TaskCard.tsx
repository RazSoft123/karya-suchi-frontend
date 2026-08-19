import toast from "react-hot-toast";
import { NavLink } from "react-router";
import type { Task } from "../../utils/types";
import { Calendar, Database } from "lucide-react";
import { useUpdateTaskMutation } from "../../queries/taskQueries";

export default function TaskCard({ task }: { task: Task }) {
  const updateMutation = useUpdateTaskMutation();
  const status = task.status ?? (task.completed ? "completed" : "todo");
  const workspaceName =
    typeof task.workspace === "string"
      ? task.workspace
      : task.workspace?.name || "Workspace";
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";
  const toggleLabel =
    status === "completed"
      ? "Reopen"
      : status === "archived"
        ? "Restore"
        : "Complete";

  function handleStatusToggle() {
    const nextStatus =
      status === "completed" || status === "archived" ? "todo" : "completed";

    updateMutation.mutate(
      { id: task.id, status: nextStatus },
      {
        onSuccess: () =>
          toast.success(nextStatus === "completed" ? "Task completed" : "Task reopened"),
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <article className="font-inter flex h-full flex-col gap-6 rounded-xl border border-app-border px-4 py-4">
      <div className="flex items-center justify-between gap-3 capitalize">
        <div className="rounded-sm bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-600">
          {task.priority ?? "medium"}
        </div>
        <div className="rounded-sm bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-600">
          {status.replace("_", " ")}
        </div>
      </div>

      <div className="pt-2">
        <Database size={36} strokeWidth={1.5} />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <p className="text-body whitespace-pre-wrap break-words text-slate-600">
          {task.description?.trim() || "This task does not have a description."}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span className="text-sm">{dueDate}</span>
        </div>
        <span className="max-w-32 truncate text-sm font-semibold text-slate-600">
          {workspaceName}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2">
        <NavLink
          to={`/tasks/${task.id}`}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold"
        >
          Edit
        </NavLink>
        <button
          type="button"
          onClick={handleStatusToggle}
          disabled={updateMutation.isPending}
          className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateMutation.isPending ? "Saving..." : toggleLabel}
        </button>
      </div>
    </article>
  );
}
