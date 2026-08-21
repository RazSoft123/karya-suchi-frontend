import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Flag,
  Layers3,
  Pencil,
} from "lucide-react";
import { NavLink, useParams } from "react-router";
import TaskStatusButton from "../../components/task/TaskStatusButton";
import { useTaskQuery } from "../../queries/taskQueries";

function formatDate(value?: string, fallback = "Not set") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    ...(fallback === "Not set" ? {} : { timeStyle: "short" as const }),
  }).format(date);
}

export default function TaskView() {
  const { taskId } = useParams<{ taskId: string }>();
  const taskQuery = useTaskQuery(taskId);

  if (taskQuery.isLoading) {
    return (
      <main className="max-h-dvh overflow-auto bg-slate-50 px-4 py-6">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="mb-5 h-14 rounded-xl bg-slate-200" />
          <div className="h-96 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (taskQuery.isError || !taskQuery.data) {
    return (
      <main className="max-h-dvh overflow-auto bg-slate-50 px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {taskQuery.error?.message ?? "Task not found"}
          </div>
          <NavLink
            to="/tasks"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline"
          >
            <ArrowLeft size={16} /> Back to tasks
          </NavLink>
        </div>
      </main>
    );
  }

  const task = taskQuery.data;
  const status = task.status ?? (task.completed ? "completed" : "todo");
  const workspaceId =
    typeof task.workspace === "string" ? task.workspace : task.workspace?.id;
  const workspaceName =
    typeof task.workspace === "string"
      ? "Workspace"
      : task.workspace?.name || "Workspace";

  return (
    <main className="font-inter max-h-dvh overflow-auto bg-slate-50 px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <NavLink
            to="/tasks"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-black"
          >
            <ArrowLeft size={17} /> All tasks
          </NavLink>
          <div className="hidden h-6 border-l border-slate-200 sm:block" />
          {workspaceId ? (
            <NavLink
              to={`/workspace/${workspaceId}`}
              className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-black"
            >
              <Layers3 size={15} /> {workspaceName}
            </NavLink>
          ) : (
            <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
              <Layers3 size={15} /> {workspaceName}
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <NavLink
              to={`/tasks/${task.id}/edit`}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
            >
              <Pencil size={15} /> Edit task
            </NavLink>
            <TaskStatusButton task={task} />
          </div>
        </header>

        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-wrap items-center gap-2 capitalize">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {status.replace("_", " ")}
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                {task.priority ?? "medium"} priority
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {task.title}
            </h1>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <CalendarDays size={15} /> Due date
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {formatDate(task.dueDate)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <Flag size={15} /> Priority
                </p>
                <p className="mt-2 text-sm font-semibold capitalize text-slate-700">
                  {task.priority ?? "medium"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <Clock3 size={15} /> Created
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {formatDate(task.createdAt, "Unknown")}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <Clock3 size={15} /> Updated
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {formatDate(task.updatedAt, "Unknown")}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 px-6 py-8 sm:px-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Description
            </h2>
            <p className="mt-4 whitespace-pre-wrap break-words text-base leading-8 text-slate-700 sm:text-lg">
              {task.description?.trim() || "This task does not have a description."}
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
