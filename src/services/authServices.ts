import apiClient from "./apiClient";
import type { User } from "../utils/types";

interface AuthResponse {
  status: string;
  data: {
    id?: string;
    _id?: string;
    name: string;
    email: string;
  };
  message?: string;
  messages?: string | string[];
}

interface MessageResponse {
  status: string;
  data: unknown;
  message?: string;
  messages?: string | string[];
}

async function login(email: string, password: string) {
  return await apiClient<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    skipAuthRefresh: true,
  });
}

async function register(name: string, email: string, password: string) {
  return await apiClient<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
    skipAuthRefresh: true,
  });
}

async function logout() {
  await apiClient<void>("/logout", {
    method: "POST",
    skipAuthRefresh: true,
  });
}

async function getCurrentUser(): Promise<User> {
  const response = await apiClient<AuthResponse>("/user");
  const id = response.data.id ?? response.data._id;

  if (!id) throw new Error("The server response did not include a user id");

  return {
    id,
    name: response.data.name,
    email: response.data.email,
  };
}

async function forgetPassword(email: string) {
  return await apiClient<MessageResponse>("/forget-password", {
    method: "POST",
    body: JSON.stringify({ email }),
    skipAuthRefresh: true,
  });
}

async function resetPassword(
  email: string,
  token: string,
  newPass: string,
  confPass: string,
) {
  return await apiClient<MessageResponse>("/reset-password", {
    method: "PUT",
    body: JSON.stringify({
      email,
      newPass,
      confPass,
    }),
    headers: {
      "password-reset-token": token,
    },
    skipAuthRefresh: true,
  });
}

export {
  login,
  register,
  logout,
  getCurrentUser,
  forgetPassword,
  resetPassword,
};
export type { AuthResponse };
