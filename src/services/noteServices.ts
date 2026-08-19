import apiClient from "./apiClient";
import type { Note } from "../utils/types";

interface ApiResponse<T> {
  status: string;
  data: T;
  messages: string[];
}

interface CreateNoteInput {
  title: string;
  content: string;
  workspaceId: string;
}

interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  workspaceId?: string;
}

async function getNotes(workspaceId?: string): Promise<Note[]> {
  const query = workspaceId
    ? `?workspace=${encodeURIComponent(workspaceId)}`
    : "";
  const response = await apiClient<ApiResponse<Note[]>>(`/notes${query}`);
  return response.data;
}

async function getNote(id: string): Promise<Note> {
  const response = await apiClient<ApiResponse<Note>>(`/notes/${id}`);
  return response.data;
}

async function createNote(input: CreateNoteInput): Promise<Note> {
  const response = await apiClient<ApiResponse<Note>>(
    `/workspaces/${input.workspaceId}/notes`,
    {
      method: "POST",
      body: JSON.stringify({
        title: input.title,
        content: input.content,
      }),
    },
  );

  return response.data;
}

async function updateNote(input: UpdateNoteInput): Promise<Note> {
  const { id, ...updates } = input;
  const response = await apiClient<ApiResponse<Note>>(`/notes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

  return response.data;
}

async function deleteNote(id: string): Promise<void> {
  await apiClient<void>(`/notes/${id}`, { method: "DELETE" });
}

export { getNotes, getNote, createNote, updateNote, deleteNote };
export type { CreateNoteInput, UpdateNoteInput };
