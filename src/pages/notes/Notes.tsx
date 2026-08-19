import NoteCard from "../../components/notes/NoteCard";
import { fakeNotes } from "../../fakeData";

export default function Notes() {
  return (
    <main className="font-inter px-4 py-4 max-h-dvh overflow-scroll">
      <div className="flex flex-col gap-6">
        <section>
          <h1 className="font-inter text-2xl font-semibold">Notes</h1>
          <p className="font-inter text-sm text-slate-600">
            All your notes at one place
          </p>
        </section>
        <section></section>
        <section>
          <div className="w-full grid grid-cols-4 gap-4">
            {fakeNotes.map((note) => {
              return <NoteCard key={note.id} note={note} />;
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
