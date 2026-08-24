import { Crown, Mail, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import {
  useAddWorkspaceMemberMutation,
  useRemoveWorkspaceMemberMutation,
  useUpdateWorkspaceMemberMutation,
  useWorkspaceMembersQuery,
} from "../../queries/workspaceMemberQueries";
import type {
  Workspace,
  WorkspaceMember,
  WorkspaceMemberAccess,
} from "../../utils/types";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";
}

function MemberRow({
  member,
  workspaceId,
}: {
  member: WorkspaceMember;
  workspaceId: string;
}) {
  const updateMutation = useUpdateWorkspaceMemberMutation(workspaceId);
  const removeMutation = useRemoveWorkspaceMemberMutation(workspaceId);

  function handleAccessChange(access: WorkspaceMemberAccess) {
    updateMutation.mutate(
      { membershipId: member.id, access },
      {
        onSuccess: () => toast.success(`${member.name}'s access was updated`),
        onError: (error) => toast.error(error.message),
      },
    );
  }

  function handleRemove() {
    if (!window.confirm(`Remove ${member.name} from this workspace?`)) return;

    removeMutation.mutate(
      { membershipId: member.id },
      {
        onSuccess: () => toast.success(`${member.name} was removed`),
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <li className="flex flex-wrap items-center gap-3 border-t border-slate-100 px-5 py-4 first:border-t-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
        {initials(member.name)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-900">
            {member.name}
          </p>
          {member.isOwner && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
              <Crown size={12} /> Owner
            </span>
          )}
        </div>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
          <Mail size={12} /> {member.email}
        </p>
      </div>

      {member.isOwner ? (
        <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">
          Full access
        </span>
      ) : (
        <div className="flex items-center gap-2">
          <select
            value={member.access}
            onChange={(event) =>
              handleAccessChange(event.target.value as WorkspaceMemberAccess)
            }
            disabled={updateMutation.isPending || removeMutation.isPending}
            aria-label={`Access for ${member.name}`}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-slate-400 disabled:opacity-50"
          >
            <option value="view">Viewer</option>
            <option value="edit">Editor</option>
          </select>
          <button
            type="button"
            onClick={handleRemove}
            disabled={removeMutation.isPending || updateMutation.isPending}
            aria-label={`Remove ${member.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={17} />
          </button>
        </div>
      )}
    </li>
  );
}

export default function WorkspaceMembers({ workspace }: { workspace: Workspace }) {
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState<WorkspaceMemberAccess>("view");
  const isOwner = workspace.isOwner === true;
  const membersQuery = useWorkspaceMembersQuery(workspace.id, isOwner);
  const addMutation = useAddWorkspaceMemberMutation(workspace.id);

  function handleAddMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Enter the member's email address");
      return;
    }

    addMutation.mutate(
      { email: email.trim().toLowerCase(), access },
      {
        onSuccess: () => {
          toast.success("Workspace member added");
          setEmail("");
          setAccess("view");
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  if (!isOwner) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Users size={19} /> Members
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Only the workspace owner can add or manage members.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-app-border bg-white">
      <div className="p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Users size={19} /> Workspace members
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Add an existing user as a viewer or editor. Editors can change tasks
          and notes; viewers have read-only access.
        </p>

        <form
          onSubmit={handleAddMember}
          className="mt-5 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_150px_auto]"
        >
          <div>
            <label htmlFor="member-email" className="sr-only">
              Member email
            </label>
            <input
              id="member-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="member@example.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              required
            />
          </div>
          <div>
            <label htmlFor="member-access" className="sr-only">
              Member access
            </label>
            <select
              id="member-access"
              value={access}
              onChange={(event) =>
                setAccess(event.target.value as WorkspaceMemberAccess)
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-slate-400"
            >
              <option value="view">Viewer</option>
              <option value="edit">Editor</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserPlus size={16} />
            {addMutation.isPending ? "Adding..." : "Add member"}
          </button>
        </form>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <ShieldCheck size={14} /> Access list
        </p>
      </div>

      {membersQuery.isLoading && (
        <p className="px-5 py-6 text-sm text-slate-500">Loading members...</p>
      )}
      {membersQuery.isError && (
        <p className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {membersQuery.error.message}
        </p>
      )}
      {membersQuery.data && (
        <ul>
          {membersQuery.data.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              workspaceId={workspace.id}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
