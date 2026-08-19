import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "../services/workspaceServices";

const workspaceKeys = {
  all: ["workspaces"] as const,
};

function useWorkspacesQuery() {
  return useQuery({
    queryKey: workspaceKeys.all,
    queryFn: getWorkspaces,
  });
}

export { workspaceKeys, useWorkspacesQuery };
