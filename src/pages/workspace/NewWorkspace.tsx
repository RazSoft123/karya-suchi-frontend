import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router";
import { useCreateWorkspaceMutation } from "../../queries/workspaceQueries";

export default function NewWorkspace() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const createMutation = useCreateWorkspaceMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 3) {
      toast.error("Workspace name must contain at least 3 characters");
      return;
    }

    createMutation.mutate(
      { name: name.trim(), description: description.trim() },
      {
        onSuccess: (workspace) => {
          toast.success("Workspace created");
          navigate(`/workspace/${workspace.id}`);
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <main className="font-inter max-h-dvh overflow-auto px-4 py-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Create workspace</h1>
            <p className="text-sm text-slate-600">
              You can add notes and tasks immediately after creation.
            </p>
          </div>
          <NavLink to="/workspace" className="text-sm font-semibold underline">
            Back to workspaces
          </NavLink>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-xl border border-app-border bg-white p-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="workspace-name" className="text-sm font-semibold">
              Name
            </label>
            <input
              id="workspace-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={3}
              maxLength={100}
              className="rounded-md border border-slate-300 px-3 py-2"
              placeholder="Workspace name"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="workspace-description"
              className="text-sm font-semibold"
            >
              Description
            </label>
            <textarea
              id="workspace-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={6}
              maxLength={2000}
              className="resize-y rounded-md border border-slate-300 px-3 py-2"
              placeholder="What will you organize here?"
            />
          </div>

          <div className="flex justify-end gap-3">
            <NavLink
              to="/workspace"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </NavLink>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? "Creating..." : "Create workspace"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
