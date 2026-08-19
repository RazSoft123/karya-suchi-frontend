import { useMutation } from "@tanstack/react-query";
import { login } from "../services/authServices";
import { useAuthStore } from "../store/authStore";
import type { User } from "../utils/types";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLoginMutation = () => {
  const authStore = useAuthStore();

  return useMutation<User, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await login(credentials.email, credentials.password);

      if (!response) {
        throw new Error("Invalid response from server");
      }

      const id = response.data.id ?? response.data._id;
      if (!id) {
        throw new Error("The server response did not include a user id");
      }

      return {
        id,
        name: response.data.name,
        email: response.data.email,
      };
    },

    onSuccess: (user) => {
      // Store user data in auth store
      authStore.setUser(user);

      // Store auth token if available (if your API returns one)
      // localStorage.setItem("authToken", data.token);
    },

    onError: (error: Error) => {
      console.error("Login failed:", error.message);
      // Error handling is delegated to the component
    },
  });
};
