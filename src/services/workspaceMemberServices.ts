import apiClient from "./apiClient";
import type {
  WorkspaceMember,
  WorkspaceMemberAccess,
} from "../utils/types";

interface ApiResponse<T> {
  status: string;
  data: T;
  messages?: string[];
}

interface AddWorkspaceMemberInput {
  workspaceId: string;
  email: string;
  access: WorkspaceMemberAccess;
}

interface UpdateWorkspaceMemberInput {
  workspaceId: string;
  membershipId: string;
  access: WorkspaceMemberAccess;
}

interface RemoveWorkspaceMemberInput {
  workspaceId: string;
  membershipId: string;
}

async function getWorkspaceMembers(
  workspaceId: string,
): Promise<WorkspaceMember[]> {
  const response = await apiClient<ApiResponse<WorkspaceMember[]>>(
    `/workspaces/${workspaceId}/members`,
  );
  return response.data;
}

async function addWorkspaceMember(
  input: AddWorkspaceMemberInput,
): Promise<WorkspaceMember> {
  const response = await apiClient<ApiResponse<WorkspaceMember>>(
    `/workspaces/${input.workspaceId}/members`,
    {
      method: "POST",
      body: JSON.stringify({ email: input.email, access: input.access }),
    },
  );
  return response.data;
}

async function updateWorkspaceMember(
  input: UpdateWorkspaceMemberInput,
): Promise<WorkspaceMember> {
  const response = await apiClient<ApiResponse<WorkspaceMember>>(
    `/workspaces/${input.workspaceId}/members/${input.membershipId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ access: input.access }),
    },
  );
  return response.data;
}

async function removeWorkspaceMember(
  input: RemoveWorkspaceMemberInput,
): Promise<void> {
  await apiClient<void>(
    `/workspaces/${input.workspaceId}/members/${input.membershipId}`,
    { method: "DELETE" },
  );
}

export {
  getWorkspaceMembers,
  addWorkspaceMember,
  updateWorkspaceMember,
  removeWorkspaceMember,
};
export type {
  AddWorkspaceMemberInput,
  UpdateWorkspaceMemberInput,
  RemoveWorkspaceMemberInput,
};
