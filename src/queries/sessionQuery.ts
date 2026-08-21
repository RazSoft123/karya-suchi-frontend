import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/authServices";

const sessionKey = ["auth", "session"] as const;

export function useSessionQuery(enabled: boolean) {
  return useQuery({
    queryKey: sessionKey,
    queryFn: getCurrentUser,
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export { sessionKey };
