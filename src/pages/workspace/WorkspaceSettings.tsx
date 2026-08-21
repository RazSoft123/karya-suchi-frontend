import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useParams } from "react-router";
import {
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useWorkspaceQuery,
} from "../../queries/workspaceQueries";
import type { Workspace } from "../../utils/types";

function WorkspaceSettingsForm({ workspace }: { workspace: Workspace }) {
  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description ?? "");
  const navigate = useNavigate();
  const updateMutation = useUpdateWorkspaceMutation();
  const deleteMutation = useDeleteWorkspaceMutation();
  const canDelete = workspace.isOwner === true && !workspace.isDefault;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 3) {
      toast.error("Workspace name must contain at least 3 characters");
      return;
    }

    updateMutation.mutate(
      {
        id: workspace.id,
        name: name.trim(),
        description: description.trim(),
      },
      {
        onSuccess: () => toast.success("Workspace updated"),
        onError: (error) => toast.error(error.message),
      },
    );
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${workspace.name}"? Its notes and tasks will no longer be accessible.`,
    );
    if (!confirmed) return;

    deleteMutation.mutate(workspace.id, {
      onSuccess: () => {
        toast.success("Workspace deleted");
        navigate("/workspace", { replace: true });
      },
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-xl border border-app-border bg-white p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">General settings</h2>
            <p className="text-sm text-slate-600">
              Update the workspace name and description.
            </p>
          </div>
          {workspace.isDefault && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Default
            </span>
          )}
        </div>

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
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      {workspace.isOwner && (
        <section className="rounded-xl border border-red-200 bg-white p-6">
          <h2 className="font-semibold text-red-700">Delete workspace</h2>
          <p className="mt-1 text-sm text-slate-600">
            {workspace.isDefault
              ? "Your default workspace cannot be deleted."
              : "Deleting a workspace hides it and the content stored inside it."}
          </p>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!canDelete || deleteMutation.isPending}
            className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete workspace"}
          </button>
        </section>
      )}
    </div>
  );
}

export default function WorkspaceSettings() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const workspaceQuery = useWorkspaceQuery(workspaceId);

  if (workspaceQuery.isLoading) {
    return <main className="p-6 text-sm text-slate-600">Loading settings...</main>;
  }

  if (workspaceQuery.isError || !workspaceQuery.data) {
    return (
      <main className="p-6">
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {workspaceQuery.error?.message ?? "Workspace not found"}
        </p>
        <NavLink
          to="/workspace"
          className="mt-4 inline-block text-sm font-semibold underline"
        >
          Back to workspaces
        </NavLink>
      </main>
    );
  }

  const workspace = workspaceQuery.data;

  if (!workspace.canManage) {
    return (
      <main className="p-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          You do not have permission to change this workspace's settings.
        </div>
        <NavLink
          to={`/workspace/${workspace.id}`}
          className="mt-4 inline-block text-sm font-semibold underline"
        >
          Back to workspace
        </NavLink>
      </main>
    );
  }

  return (
    <main className="font-inter max-h-dvh overflow-auto px-4 py-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Workspace settings</h1>
            <p className="text-sm text-slate-600">Manage {workspace.name}.</p>
          </div>
          <NavLink
            to={`/workspace/${workspace.id}`}
            className="text-sm font-semibold underline"
          >
            Back to workspace
          </NavLink>
        </div>

        <WorkspaceSettingsForm
          key={`${workspace.id}-${workspace.updatedAt ?? ""}`}
          workspace={workspace}
        />
      </div>
    </main>
  );
}
