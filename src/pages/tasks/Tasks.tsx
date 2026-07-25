import TaskCard from "../../components/task/TaskCard";

export default function Tasks() {
  return (
    <main className="font-inter px-4 py-4 max-h-dvh overflow-scroll">
      <div className="flex flex-col gap-6">
        <section>
          <h1 className="font-inter text-2xl font-semibold">Good Morning,</h1>
          <p className="font-inter text-sm text-slate-600">
            You have 6 tasks due today, 2 overdue tasks, 3 upcoming deadlines
          </p>
        </section>
        <section>
          <TaskCard />
        </section>
      </div>
    </main>
  );
}
