import { NavLink } from "react-router";
import type { Task } from "../../utils/types";
import { ArrowRight, Calendar, Database } from "lucide-react";
import TaskStatusButton from "./TaskStatusButton";

const MAX_PREVIEW_LENGTH = 100;

function taskPreview(description?: string) {
  const normalizedDescription = description?.trim().replace(/\s+/g, " ") ?? "";

  if (!normalizedDescription) return "This task does not have a description.";
  if (normalizedDescription.length <= MAX_PREVIEW_LENGTH) {
    return normalizedDescription;
  }

  return `${normalizedDescription
    .slice(0, MAX_PREVIEW_LENGTH - 1)
    .trimEnd()}…`;
}

export default function TaskCard({ task }: { task: Task }) {
  const status = task.status ?? (task.completed ? "completed" : "todo");
  const workspaceName =
    typeof task.workspace === "string"
      ? task.workspace
      : task.workspace?.name || "Workspace";
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";
  return (
    <article className="font-inter group relative flex h-full flex-col gap-6 rounded-xl border border-app-border px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-md">
      <NavLink
        to={`/tasks/${task.id}`}
        aria-label={`View ${task.title}`}
        className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
      />

      <div className="pointer-events-none relative z-[1] flex items-center justify-between gap-3 capitalize">
        <div className="rounded-sm bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-600">
          {task.priority ?? "medium"}
        </div>
        <div className="rounded-sm bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-600">
          {status.replace("_", " ")}
        </div>
      </div>

      <div className="pointer-events-none relative z-[1] pt-2">
        <Database size={36} strokeWidth={1.5} />
      </div>

      <div className="pointer-events-none relative z-[1] flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <p className="text-body break-words text-slate-600">
          {taskPreview(task.description)}
        </p>
      </div>

      <div className="pointer-events-none relative z-[1] mt-auto flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span className="text-sm">{dueDate}</span>
        </div>
        <span className="max-w-32 truncate text-sm font-semibold text-slate-600">
          {workspaceName}
        </span>
      </div>

      <div className="pointer-events-none relative z-10 flex items-center justify-end gap-2">
        <NavLink
          to={`/tasks/${task.id}`}
          className="pointer-events-auto flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold transition hover:bg-slate-50"
        >
          View task <ArrowRight size={15} />
        </NavLink>
        <TaskStatusButton task={task} className="pointer-events-auto" />
      </div>
    </article>
  );
}
