import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "../services/taskServices";

const taskKeys = {
  all: ["tasks"] as const,
  list: (workspaceId?: string) =>
    [...taskKeys.all, "list", workspaceId ?? "all"] as const,
  detail: (id: string) => [...taskKeys.all, "detail", id] as const,
};

function useTasksQuery(workspaceId?: string) {
  return useQuery({
    queryKey: taskKeys.list(workspaceId),
    queryFn: () => getTasks(workspaceId),
  });
}

function useTaskQuery(id?: string) {
  return useQuery({
    queryKey: taskKeys.detail(id ?? ""),
    queryFn: () => getTask(id!),
    enabled: Boolean(id),
  });
}

function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTaskInput) => updateTask(input),
    onSuccess: (task) => {
      queryClient.setQueryData(taskKeys.detail(task.id), task);
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export {
  taskKeys,
  useTasksQuery,
  useTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
};
