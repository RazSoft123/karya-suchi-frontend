import { ArrowLeft, Layers3, NotebookPen } from "lucide-react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import { useCreateNoteMutation } from "../../../queries/noteQueries";
import { useWorkspacesQuery } from "../../../queries/workspaceQueries";

export default function NewNote() {
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [workspaceId, setWorkspaceId] = useState(
    searchParams.get("workspace") ?? "",
  );
  const navigate = useNavigate();
  const workspacesQuery = useWorkspacesQuery();
  const createMutation = useCreateNoteMutation();
  const requestedWorkspaceExists = workspacesQuery.data?.some(
    (workspace) => workspace.id === workspaceId,
  );
  const defaultWorkspaceId =
    workspacesQuery.data?.find((workspace) => workspace.isDefault)?.id ??
    workspacesQuery.data?.[0]?.id ??
    "";
  const selectedWorkspaceId = requestedWorkspaceExists
    ? workspaceId
    : defaultWorkspaceId;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

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
    <main className="font-inter max-h-dvh overflow-auto bg-slate-50 px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <NavLink
              to="/notes"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-black"
            >
              <ArrowLeft size={16} /> Back to notes
            </NavLink>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Create a new note
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Capture your ideas and keep them organized in a workspace.
            </p>
          </div>
          <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-black text-white sm:flex">
            <NotebookPen size={25} />
          </div>
        </header>

        {workspacesQuery.isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {workspacesQuery.error.message}
          </div>
        )}

        {workspacesQuery.isSuccess && workspacesQuery.data.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h2 className="text-lg font-semibold">You need a workspace first</h2>
            <p className="mt-1 text-sm text-slate-600">
              Every note must belong to one of your workspaces.
            </p>
            <NavLink
              to="/workspace/new"
              className="mt-5 inline-block rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Create workspace
            </NavLink>
          </div>
        )}

        {!workspacesQuery.isError &&
          !(workspacesQuery.isSuccess && workspacesQuery.data.length === 0) && (
            <form
              onSubmit={handleSubmit}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <section className="px-6 py-7 sm:px-8 sm:py-8">
                <label
                  htmlFor="note-title"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Note title
                </label>
                <input
                  id="note-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={200}
                  className="mt-3 w-full border-0 bg-transparent text-2xl font-semibold text-slate-950 outline-none placeholder:text-slate-300 sm:text-3xl"
                  placeholder="Give your note a clear title"
                  autoFocus
                  required
                />
              </section>

              <div className="border-t border-slate-100" />

              <section className="px-6 py-7 sm:px-8">
                <label
                  htmlFor="note-content"
                  className="text-sm font-semibold text-slate-700"
                >
                  Content
                </label>
                <textarea
                  id="note-content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={16}
                  maxLength={100000}
                  className="mt-3 min-h-[420px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 px-5 py-4 text-base leading-8 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  placeholder="Start writing your note..."
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span>
                    {wordCount} {wordCount === 1 ? "word" : "words"}
                  </span>
                  <span>{content.length.toLocaleString()} / 100,000</span>
                </div>
              </section>

              <section className="border-t border-slate-100 bg-slate-50/50 px-6 py-6 sm:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
                  <div>
                    <label
                      htmlFor="note-workspace"
                      className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                    >
                      <Layers3 size={17} className="text-slate-400" /> Workspace
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      Choose where this note should be stored.
                    </p>
                  </div>
                  <select
                    id="note-workspace"
                    value={selectedWorkspaceId}
                    onChange={(event) => setWorkspaceId(event.target.value)}
                    disabled={workspacesQuery.isLoading}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 sm:w-64"
                    required
                  >
                    {workspacesQuery.isLoading && (
                      <option value="">Loading workspaces...</option>
                    )}
                    {workspacesQuery.data?.map((workspace) => (
                      <option key={workspace.id} value={workspace.id}>
                        {workspace.name}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 px-6 py-5 sm:px-8">
                <NavLink
                  to="/notes"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-black"
                >
                  Cancel
                </NavLink>
                <button
                  type="submit"
                  disabled={createMutation.isPending || !selectedWorkspaceId}
                  className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {createMutation.isPending ? "Creating note..." : "Create note"}
                </button>
              </footer>
            </form>
          )}
      </div>
    </main>
  );
}
