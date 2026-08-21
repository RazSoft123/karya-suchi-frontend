import {
  ArrowLeft,
  Check,
  Clock3,
  Layers3,
  LockKeyhole,
  Save,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useParams } from "react-router";
import {
  useDeleteNoteMutation,
  useNoteQuery,
  useUpdateNoteMutation,
} from "../../queries/noteQueries";
import { useWorkspaceQuery } from "../../queries/workspaceQueries";
import type { Note } from "../../utils/types";

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function resizeContentEditor(editor: HTMLTextAreaElement | null) {
  if (!editor) return;
  editor.style.height = "auto";
  editor.style.height = `${Math.max(editor.scrollHeight, 440)}px`;
}

function NoteEditor({ note }: { note: Note }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content ?? "");
  const contentEditorRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const updateMutation = useUpdateNoteMutation();
  const deleteMutation = useDeleteNoteMutation();
  const workspaceId =
    typeof note.workspace === "string"
      ? note.workspace
      : note.workspace?.id;
  const workspaceQuery = useWorkspaceQuery(workspaceId);
  const workspaceName =
    workspaceQuery.data?.name ??
    (typeof note.workspace === "string"
      ? "Workspace"
      : note.workspace?.name || "Workspace");
  const canEdit = workspaceQuery.data?.canEdit !== false;
  const isDirty = title !== note.title || content !== (note.content ?? "");
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  useEffect(() => {
    resizeContentEditor(contentEditorRef.current);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canEdit) {
      toast.error("This note is read-only");
      return;
    }

    if (!title.trim()) {
      toast.error("A note title is required");
      return;
    }

    if (!isDirty) return;

    updateMutation.mutate(
      {
        id: note.id,
        title: title.trim(),
        content,
      },
      {
        onSuccess: () => toast.success("Note saved"),
        onError: (error) => toast.error(error.message),
      },
    );
  }

  function handleKeyboardShortcut(event: KeyboardEvent<HTMLFormElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      event.currentTarget.requestSubmit();
    }
  }

  function handleDelete() {
    if (
      !window.confirm(
        "Delete this note? This action cannot be undone from the app.",
      )
    ) {
      return;
    }

    deleteMutation.mutate(note.id, {
      onSuccess: () => {
        toast.success("Note deleted");
        navigate(
          workspaceId ? `/workspace/${workspaceId}` : "/notes",
          { replace: true },
        );
      },
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="sticky top-0 z-10 mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:px-4">
        <NavLink
          to="/notes"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-black"
        >
          <ArrowLeft size={17} /> All notes
        </NavLink>

        <div className="hidden h-6 border-l border-slate-200 sm:block" />

        {workspaceId ? (
          <NavLink
            to={`/workspace/${workspaceId}`}
            className="flex min-w-0 items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-black"
          >
            <Layers3 size={15} />
            <span className="max-w-48 truncate">{workspaceName}</span>
          </NavLink>
        ) : (
          <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
            <Layers3 size={15} /> {workspaceName}
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-1.5 text-xs font-medium text-slate-500 md:flex">
            {!canEdit ? (
              <>
                <LockKeyhole size={14} /> Read only
              </>
            ) : updateMutation.isPending ? (
              "Saving..."
            ) : isDirty ? (
              "Unsaved changes"
            ) : (
              <>
                <Check size={14} className="text-emerald-600" /> All changes saved
              </>
            )}
          </span>

          {canEdit && (
            <>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                aria-label="Delete note"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={18} />
              </button>
              <button
                type="submit"
                form="note-editor"
                disabled={!isDirty || updateMutation.isPending}
                className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Save size={16} />
                {updateMutation.isPending ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </header>

      <form
        id="note-editor"
        onSubmit={handleSubmit}
        onKeyDown={handleKeyboardShortcut}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="px-6 pb-5 pt-8 sm:px-10 sm:pt-10">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
            readOnly={!canEdit}
            aria-label="Note title"
            placeholder="Untitled note"
            className="w-full border-0 bg-transparent text-3xl font-bold leading-tight tracking-tight text-slate-950 outline-none placeholder:text-slate-300 sm:text-4xl"
            required
          />

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock3 size={14} /> Updated {formatDate(note.updatedAt ?? note.createdAt)}
            </span>
            <span>Created {formatDate(note.createdAt)}</span>
          </div>
        </div>

        <div className="mx-6 border-t border-slate-100 sm:mx-10" />

        <div className="px-6 py-7 sm:px-10">
          <textarea
            ref={contentEditorRef}
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              resizeContentEditor(event.currentTarget);
            }}
            readOnly={!canEdit}
            maxLength={100000}
            aria-label="Note content"
            placeholder="Start writing..."
            className="block min-h-[440px] w-full resize-none overflow-hidden border-0 bg-transparent text-base leading-8 text-slate-700 outline-none placeholder:text-slate-300 sm:text-lg"
          />
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-3 text-xs text-slate-400 sm:px-10">
          <span>
            {wordCount} {wordCount === 1 ? "word" : "words"} · {content.length} characters
          </span>
          {canEdit && <span>Ctrl/⌘ + S to save</span>}
        </footer>
      </form>
    </div>
  );
}

export default function NoteView() {
  const { noteId } = useParams();
  const noteQuery = useNoteQuery(noteId);

  if (noteQuery.isLoading) {
    return (
      <main className="max-h-dvh overflow-auto bg-slate-50 px-4 py-6">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="mb-5 h-16 rounded-xl bg-slate-200" />
          <div className="h-[70vh] rounded-2xl bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  if (noteQuery.isError || !noteQuery.data) {
    return (
      <main className="max-h-dvh overflow-auto bg-slate-50 px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {noteQuery.error?.message ?? "Note not found"}
          </div>
          <NavLink
            to="/notes"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline"
          >
            <ArrowLeft size={16} /> Back to notes
          </NavLink>
        </div>
      </main>
    );
  }

  return (
    <main className="font-inter max-h-dvh overflow-auto bg-slate-50 px-4 py-5 sm:px-6">
      <NoteEditor
        key={`${noteQuery.data.id}-${noteQuery.data.updatedAt ?? ""}`}
        note={noteQuery.data}
      />
    </main>
  );
}
