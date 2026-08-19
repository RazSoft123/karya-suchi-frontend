import apiClient from "./apiClient";
import type { Task, TaskStatus } from "../utils/types";

interface ApiResponse<T> {
  status: string;
  data: T;
  messages: string[];
}

interface CreateTaskInput {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  workspaceId?: string;
}

interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: TaskStatus;
  dueDate?: string | null;
  workspaceId?: string;
}

async function getTasks(workspaceId?: string): Promise<Task[]> {
  const query = workspaceId
    ? `?workspace=${encodeURIComponent(workspaceId)}`
    : "";
  const response = await apiClient<ApiResponse<Task[]>>(`/tasks${query}`);
  return response.data;
}

async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await apiClient<ApiResponse<Task>>("/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.data;
}

async function getTask(id: string): Promise<Task> {
  const response = await apiClient<ApiResponse<Task>>(`/tasks/${id}`);
  return response.data;
}

async function updateTask(input: UpdateTaskInput): Promise<Task> {
  const { id, ...updates } = input;
  const response = await apiClient<ApiResponse<Task>>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

  return response.data;
}

async function deleteTask(id: string): Promise<void> {
  await apiClient<void>(`/tasks/${id}`, { method: "DELETE" });
}

export { getTasks, getTask, createTask, updateTask, deleteTask };
export type { CreateTaskInput, UpdateTaskInput };
