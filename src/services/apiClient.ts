import { queryClient } from "../lib/queryClient";
import { useAuthStore } from "../store/authStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
  skipAuthRefresh?: boolean;
  hasRetriedAuth?: boolean;
}

interface ApiErrorPayload {
  message?: string;
  messages?: string | string[];
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

let refreshRequest: Promise<void> | null = null;

async function responseError(response: Response) {
  const errorData = (await response
    .json()
    .catch(() => ({}))) as ApiErrorPayload;
  const serverMessage = errorData.messages ?? errorData.message;
  const message = Array.isArray(serverMessage)
    ? serverMessage.join(" ")
    : serverMessage || `HTTP error! Status: ${response.status}`;

  return new ApiError(message, response.status);
}

async function requestNewAccessToken() {
  const response = await fetch(`${BASE_URL}/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw await responseError(response);
}

function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = requestNewAccessToken().finally(() => {
      refreshRequest = null;
    });
  }

  return refreshRequest;
}

function clearExpiredSession() {
  queryClient.clear();
  useAuthStore.getState().logout();
}

async function apiClient<T = unknown>(
  apiEndpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const {
    skipAuthRefresh = false,
    hasRetriedAuth = false,
    headers: optionHeaders,
    ...requestOptions
  } = options;
  const url = `${BASE_URL}${apiEndpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...optionHeaders,
  };
  const config: RequestInit = {
    credentials: "include",
    ...requestOptions,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401 && !skipAuthRefresh) {
      if (hasRetriedAuth) {
        clearExpiredSession();
        throw new ApiError(
          "Your session has expired. Please log in again.",
          401,
        );
      }

      try {
        await refreshAccessToken();
      } catch {
        clearExpiredSession();
        throw new ApiError(
          "Your session has expired. Please log in again.",
          401,
        );
      }

      return apiClient<T>(apiEndpoint, {
        ...options,
        hasRetriedAuth: true,
      });
    }

    if (!response.ok) throw await responseError(response);

    if (response.status === 204) return undefined as T;

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("ERROR: API request failed", error);
    throw error;
  }
}

export default apiClient;
