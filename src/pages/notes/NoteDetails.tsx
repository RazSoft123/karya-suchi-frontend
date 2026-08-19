import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useParams } from "react-router";
import {
  useDeleteNoteMutation,
  useNoteQuery,
  useUpdateNoteMutation,
} from "../../queries/noteQueries";
import { useWorkspacesQuery } from "../../queries/workspaceQueries";
import type { Note } from "../../utils/types";

function NoteEditor({ note }: { note: Note }) {
  const initialWorkspaceId =
    typeof note.workspace === "string" ? "" : note.workspace?.id || "";
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content ?? "");
  const [workspaceId, setWorkspaceId] = useState(initialWorkspaceId);
  const navigate = useNavigate();
  const workspacesQuery = useWorkspacesQuery();
  const updateMutation = useUpdateNoteMutation();
  const deleteMutation = useDeleteNoteMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !workspaceId) {
      toast.error("Title and workspace are required");
      return;
    }

    updateMutation.mutate(
      {
        id: note.id,
        title: title.trim(),
        content,
        workspaceId,
      },
      {
        onSuccess: () => toast.success("Note saved"),
        onError: (error) => toast.error(error.message),
      },
    );
  }

  function handleDelete() {
    if (!window.confirm("Delete this note? This action cannot be undone from the app.")) {
      return;
    }

    deleteMutation.mutate(note.id, {
      onSuccess: () => {
        toast.success("Note deleted");
        navigate("/notes", { replace: true });
      },
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-xl border border-app-border bg-white p-6"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="note-workspace" className="text-sm font-semibold">
          Workspace
        </label>
        <select
          id="note-workspace"
          value={workspaceId}
          onChange={(event) => setWorkspaceId(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2"
          disabled={workspacesQuery.isLoading}
          required
        >
          {workspacesQuery.data?.map((workspace) => (
            <option key={workspace.id} value={workspace.id}>
              {workspace.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="note-title" className="text-sm font-semibold">
          Title
        </label>
        <input
          id="note-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          className="rounded-md border border-slate-300 px-3 py-2"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="note-content" className="text-sm font-semibold">
          Content
        </label>
        <textarea
          id="note-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={16}
          className="resize-y rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="flex flex-wrap justify-between gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete note"}
        </button>
        <div className="flex gap-3">
          <NavLink
            to="/notes"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
          >
            Back
          </NavLink>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function NoteDetails() {
  const { noteId } = useParams();
  const noteQuery = useNoteQuery(noteId);

  return (
    <main className="font-inter max-h-dvh overflow-auto px-4 py-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Edit note</h1>
          <p className="text-sm text-slate-600">
            Update the note or move it to another workspace.
          </p>
        </div>

        {noteQuery.isLoading && <p>Loading note...</p>}

        {noteQuery.isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {noteQuery.error.message}
          </div>
        )}

        {noteQuery.data && (
          <NoteEditor
            key={`${noteQuery.data.id}-${noteQuery.data.updatedAt}`}
            note={noteQuery.data}
          />
        )}
      </div>
    </main>
  );
}
