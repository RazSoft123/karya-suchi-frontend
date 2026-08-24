import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addWorkspaceMember,
  getWorkspaceMembers,
  removeWorkspaceMember,
  updateWorkspaceMember,
  type AddWorkspaceMemberInput,
  type RemoveWorkspaceMemberInput,
  type UpdateWorkspaceMemberInput,
} from "../services/workspaceMemberServices";

const workspaceMemberKeys = {
  all: (workspaceId: string) => ["workspaces", workspaceId, "members"] as const,
};

function useWorkspaceMembersQuery(workspaceId: string, enabled = true) {
  return useQuery({
    queryKey: workspaceMemberKeys.all(workspaceId),
    queryFn: () => getWorkspaceMembers(workspaceId),
    enabled: enabled && Boolean(workspaceId),
  });
}

function useAddWorkspaceMemberMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<AddWorkspaceMemberInput, "workspaceId">) =>
      addWorkspaceMember({ ...input, workspaceId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: workspaceMemberKeys.all(workspaceId),
      });
    },
  });
}

function useUpdateWorkspaceMemberMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<UpdateWorkspaceMemberInput, "workspaceId">) =>
      updateWorkspaceMember({ ...input, workspaceId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: workspaceMemberKeys.all(workspaceId),
      });
    },
  });
}

function useRemoveWorkspaceMemberMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<RemoveWorkspaceMemberInput, "workspaceId">) =>
      removeWorkspaceMember({ ...input, workspaceId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: workspaceMemberKeys.all(workspaceId),
      });
    },
  });
}

export {
  workspaceMemberKeys,
  useWorkspaceMembersQuery,
  useAddWorkspaceMemberMutation,
  useUpdateWorkspaceMemberMutation,
  useRemoveWorkspaceMemberMutation,
};
