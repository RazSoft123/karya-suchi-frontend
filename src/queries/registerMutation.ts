import { useMutation } from "@tanstack/react-query";
import { register } from "../services/authServices";
import { useAuthStore } from "../store/authStore";
import { ApiError } from "../services/apiClient";
import type { User } from "../utils/types";

interface RegisterCredential {
  name: string;
  email: string;
  password: string;
}

export function useRegisterMutation() {
  const authStore = useAuthStore();

  return useMutation<User, Error, RegisterCredential>({
    mutationFn: async (credentials: RegisterCredential) => {
      const response = await register(
        credentials.name,
        credentials.email,
        credentials.password,
      );
      if (!response) {
        throw new ApiError("Inviled response from server", 500);
      }

      const id = response.data.id ?? response.data._id;
      if (!id) {
        throw new ApiError("The server response did not include a user id", 500);
      }

      return {
        id,
        name: response.data.name,
        email: response.data.email,
      };
    },

    onSuccess: (user) => {
      authStore.setUser(user);
    },
  });
}
