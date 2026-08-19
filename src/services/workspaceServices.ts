import apiClient from "./apiClient";
import type { Workspace } from "../utils/types";

interface BackendWorkspace {
  _id: string;
  name: string;
  description?: string;
}

interface WorkspaceListResponse {
  status: string;
  data: BackendWorkspace[];
  message?: string;
}

async function getWorkspaces(): Promise<Workspace[]> {
  const response = await apiClient<WorkspaceListResponse>("/workspaces");

  return response.data.map((workspace) => ({
    id: workspace._id,
    name: workspace.name,
    description: workspace.description,
  }));
}

export { getWorkspaces };
