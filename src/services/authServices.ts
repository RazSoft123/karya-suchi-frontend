import apiClient from "./apiClient";

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
  });
}

async function register(name: string, email: string, password: string) {
  return await apiClient<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

async function logout() {
  await apiClient<void>("/logout", {
    method: "POST",
  });
}

async function forgetPassword(email: string) {
  return await apiClient<MessageResponse>("/forget-password", {
    method: "POST",
    body: JSON.stringify({ email }),
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
  });
}

export { login, register, logout, forgetPassword, resetPassword };
export type { AuthResponse };
