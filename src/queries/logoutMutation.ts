import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../services/authServices";
import { useAuthStore } from "../store/authStore";

export function useLogoutMutation() {
  const clearAuth = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      clearAuth();
    },
  });
}
