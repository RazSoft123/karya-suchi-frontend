import { CheckCircle2, Play, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateTaskMutation } from "../../queries/taskQueries";
import type { Task, TaskStatus } from "../../utils/types";

function statusAction(status: TaskStatus) {
  if (status === "todo") {
    return {
      nextStatus: "in_progress" as const,
      label: "Start task",
      successMessage: "Task started",
      Icon: Play,
    };
  }

  if (status === "in_progress") {
    return {
      nextStatus: "completed" as const,
      label: "Complete task",
      successMessage: "Task completed",
      Icon: CheckCircle2,
    };
  }

  return {
    nextStatus: "todo" as const,
    label: status === "archived" ? "Restore task" : "Reopen task",
    successMessage: status === "archived" ? "Task restored" : "Task reopened",
    Icon: RotateCcw,
  };
}

export default function TaskStatusButton({
  task,
  className = "",
}: {
  task: Task;
  className?: string;
}) {
  const updateMutation = useUpdateTaskMutation();
  const status = task.status ?? (task.completed ? "completed" : "todo");
  const action = statusAction(status);

  function handleStatusChange() {
    updateMutation.mutate(
      { id: task.id, status: action.nextStatus },
      {
        onSuccess: () => toast.success(action.successMessage),
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <button
      type="button"
      onClick={handleStatusChange}
      disabled={updateMutation.isPending}
      className={`flex items-center justify-center gap-1.5 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {!updateMutation.isPending && <action.Icon size={15} />}
      {updateMutation.isPending ? "Saving..." : action.label}
    </button>
  );
}
