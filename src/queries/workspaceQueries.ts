import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  getWorkspaces,
  updateWorkspace,
  type CreateWorkspaceInput,
  type UpdateWorkspaceInput,
} from "../services/workspaceServices";

const workspaceKeys = {
  all: ["workspaces"] as const,
  detail: (id: string) => [...workspaceKeys.all, "detail", id] as const,
};

function useWorkspacesQuery() {
  return useQuery({
    queryKey: workspaceKeys.all,
    queryFn: getWorkspaces,
  });
}

function useWorkspaceQuery(id?: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(id ?? ""),
    queryFn: () => getWorkspace(id!),
    enabled: Boolean(id),
  });
}

function useCreateWorkspaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWorkspaceInput) => createWorkspace(input),
    onSuccess: (workspace) => {
      queryClient.setQueryData(workspaceKeys.detail(workspace.id), workspace);
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

function useUpdateWorkspaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateWorkspaceInput) => updateWorkspace(input),
    onSuccess: (workspace) => {
      queryClient.setQueryData(workspaceKeys.detail(workspace.id), workspace);
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

function useDeleteWorkspaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWorkspace(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: workspaceKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

export {
  workspaceKeys,
  useWorkspacesQuery,
  useWorkspaceQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
};
