import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
  type CreateNoteInput,
  type UpdateNoteInput,
} from "../services/noteServices";

const noteKeys = {
  all: ["notes"] as const,
  list: (workspaceId?: string) =>
    [...noteKeys.all, "list", workspaceId ?? "all"] as const,
  detail: (id: string) => [...noteKeys.all, "detail", id] as const,
};

function useNotesQuery(workspaceId?: string) {
  return useQuery({
    queryKey: noteKeys.list(workspaceId),
    queryFn: () => getNotes(workspaceId),
  });
}

function useNoteQuery(id?: string) {
  return useQuery({
    queryKey: noteKeys.detail(id ?? ""),
    queryFn: () => getNote(id!),
    enabled: Boolean(id),
  });
}

function useCreateNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateNoteInput) => createNote(input),
    onSuccess: (note) => {
      queryClient.setQueryData(noteKeys.detail(note.id), note);
      void queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },
  });
}

function useUpdateNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateNoteInput) => updateNote(input),
    onSuccess: (note) => {
      queryClient.setQueryData(noteKeys.detail(note.id), note);
      void queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },
  });
}

function useDeleteNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: noteKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },
  });
}

export {
  noteKeys,
  useNotesQuery,
  useNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
};
