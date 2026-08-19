import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router";
import { useCreateNoteMutation } from "../../../queries/noteQueries";
import { useWorkspacesQuery } from "../../../queries/workspaceQueries";

export default function NewNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const navigate = useNavigate();
  const workspacesQuery = useWorkspacesQuery();
  const createMutation = useCreateNoteMutation();
  const selectedWorkspaceId = workspaceId || workspacesQuery.data?.[0]?.id || "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("A note title is required");
      return;
    }

    if (!selectedWorkspaceId) {
      toast.error("Create or select a workspace first");
      return;
    }

    createMutation.mutate(
      {
        title: title.trim(),
        content,
        workspaceId: selectedWorkspaceId,
      },
      {
        onSuccess: (note) => {
          toast.success("Note created");
          navigate(`/notes/${note.id}`);
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <main className="font-inter max-h-dvh overflow-auto px-4 py-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Create note</h1>
            <p className="text-sm text-slate-600">
              Every note is stored inside a workspace.
            </p>
          </div>
          <NavLink to="/notes" className="text-sm font-semibold underline">
            Back to notes
          </NavLink>
        </div>

        {workspacesQuery.isError && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {workspacesQuery.error.message}
          </p>
        )}

        {workspacesQuery.isSuccess && workspacesQuery.data.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-semibold">You need a workspace first.</p>
            <NavLink
              to="/workspace/new"
              className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm text-white"
            >
              Create workspace
            </NavLink>
          </div>
        ) : (
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
                value={selectedWorkspaceId}
                onChange={(event) => setWorkspaceId(event.target.value)}
                disabled={workspacesQuery.isLoading}
                className="rounded-md border border-slate-300 px-3 py-2"
                required
              >
                {workspacesQuery.isLoading && <option value="">Loading...</option>}
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
                placeholder="Note title"
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
                rows={14}
                className="resize-y rounded-md border border-slate-300 px-3 py-2"
                placeholder="Write your note..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <NavLink
                to="/notes"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </NavLink>
              <button
                type="submit"
                disabled={createMutation.isPending || !selectedWorkspaceId}
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createMutation.isPending ? "Creating..." : "Create note"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
