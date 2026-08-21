import apiClient from "./apiClient";
import type { Workspace } from "../utils/types";

interface ApiResponse<T> {
  status: string;
  data: T;
  messages?: string[];
  message?: string;
}

interface BackendWorkspace extends Omit<Workspace, "id"> {
  id?: string;
  _id?: string;
}

interface CreateWorkspaceInput {
  name: string;
  description: string;
}

interface UpdateWorkspaceInput {
  id: string;
  name?: string;
  description?: string;
}

function normalizeWorkspace(workspace: BackendWorkspace): Workspace {
  const id = workspace.id ?? workspace._id;
  if (!id) throw new Error("Workspace response did not include an id");

  return { ...workspace, id };
}

async function getWorkspaces(): Promise<Workspace[]> {
  const response = await apiClient<ApiResponse<BackendWorkspace[]>>("/workspaces");
  return response.data.map(normalizeWorkspace);
}

async function getWorkspace(id: string): Promise<Workspace> {
  const response = await apiClient<ApiResponse<BackendWorkspace>>(
    `/workspaces/${id}`,
  );
  return normalizeWorkspace(response.data);
}

async function createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
  const response = await apiClient<ApiResponse<BackendWorkspace>>("/workspaces", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return normalizeWorkspace(response.data);
}

async function updateWorkspace(input: UpdateWorkspaceInput): Promise<Workspace> {
  const { id, ...updates } = input;
  const response = await apiClient<ApiResponse<BackendWorkspace>>(
    `/workspaces/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    },
  );
  return normalizeWorkspace(response.data);
}

async function deleteWorkspace(id: string): Promise<void> {
  await apiClient<void>(`/workspaces/${id}`, { method: "DELETE" });
}

export {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
export type { CreateWorkspaceInput, UpdateWorkspaceInput };
