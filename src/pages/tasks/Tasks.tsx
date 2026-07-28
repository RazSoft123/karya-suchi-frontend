import TaskCard from "../../components/task/TaskCard";
import { fakeAllTasks } from "../../fakeData";

export default function Tasks() {
  return (
    <main className="font-inter px-4 py-4 max-h-dvh overflow-scroll">
      <div className="flex flex-col gap-6">
        <section>
          <h1 className="font-inter text-2xl font-semibold">Tasks</h1>
          <p className="font-inter text-sm text-slate-600">
            All your tasks at one place
          </p>
        </section>
        <section>
          <div className="font-inter flex gap-8">
            <span>All Tasks</span>
            <span>To Do</span>
            <span>In Progress</span>
            <span>Completed</span>
            <span>Archived</span>
          </div>
        </section>
        <section>
          <div className="w-full grid grid-cols-4 gap-4">
            {fakeAllTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
        {/* TODO: For every workspace there will be a new section and every forth card will be a add new task card */}
      </div>
    </main>
  );
}
