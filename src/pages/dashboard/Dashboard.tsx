import TaskCard from "../../components/task/TaskCard";
import DashboardButton from "../../components/common/DashboardButton";
import ImportantInfoCard from "../../components/common/ImportantInfoCard";

import { fakeUser } from "../../fakeData";
import { fakeAllTasks } from "../../fakeData";
import NoteCard from "../../components/notes/NoteCard";
import WorkspaceCard from "../../components/workspace/WorkspaceCard";
import { useNotesQuery } from "../../queries/noteQueries";

export default function Dashboard() {
  const notesQuery = useNotesQuery();

  return (
    <main className="font-inter px-4 py-4 max-h-dvh overflow-scroll">
      <div className="flex flex-col gap-6">
        <section>
          <h1 className="font-inter text-2xl font-semibold">
            Good Morning, {fakeUser.name}
          </h1>
          <p className="font-inter text-sm text-slate-600">
            You have 6 tasks due today, 2 overdue tasks, 3 upcoming deadlines
          </p>
        </section>

        {/* Quick actions section */}
        {/* + New Task, + New Note, + New Workspace, + Start Whiteboard */}
        <section className="flex gap-8">
          <DashboardButton text="New Task" to="/workspace/task/new" />
          <DashboardButton text="New Note" to="/notes/new" />
          <DashboardButton text="New Workspace" to="/workspace/new" />
        </section>

        {/* Important information section */}
        <section className="flex gap-8">
          <ImportantInfoCard />
          <ImportantInfoCard />
          <ImportantInfoCard />
        </section>

        {/* Today's task section */}
        {/* Today's Tasks ✓ Design Landing Page, ✓ Fix Authentication Bug, ○ Prepare Interview, ○ Deploy Backend */}
        <section>
          <div>
            <p className="font-inter py-6 font-bold text-lg">My Task</p>
          </div>
          <div className="w-full grid grid-cols-4 gap-4">
            {fakeAllTasks.map((task) => {
              return <TaskCard key={task.id} task={task} />;
            })}
          </div>
        </section>

        {/* Recent Notes */}
        {/* Recent Notes, Project Architecture, Interview Preparation, Karaya Suchi Roadmap */}
        <section>
          <div>
            <p className="font-inter py-6 font-bold text-lg">Recent Notes</p>
          </div>
          <div className="w-full grid grid-cols-4 gap-4">
            {notesQuery.data?.slice(0, 4).map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>

        {/* Recent Workspaces */}
        {/* Recent Workspace, Workspace is last updated by you */}
        <section>
          <div>
            <p className="font-inter py-6 font-bold text-lg">
              Recent Workspace
            </p>
          </div>
          <div className="w-full grid grid-cols-4 gap-4">
            {[1, 2, 3].map((workspaceId) => (
              <WorkspaceCard key={workspaceId} />
            ))}
          </div>
        </section>

        {/* Upcoming deadline */}
        {/* Upcoming "Tomorrow Frontend Review",  "Jun 10 Project Submission", "Jun 15 Release Planning" */}

        {/* Workspace activity */}
        {/* Workspaces Personal 12 Tasks Karaya Suchi 34 Tasks Interview Prep 7 Tasks */}

        {/* Productivity summary */}
        {/* Completed Today: 8, Pending: 12, Overdue: 2, Completion Rate: 84% */}
      </div>
    </main>
  );
}

// interface QuickActionCardType {
//   text: string;
//   to: string;
// }

// function QuickActionCard({ text, to }: QuickActionCardType) {
//   return (
//     <NavLink to={to}>
//       <div className="border border-slate-300 px-6 py-4 rounded-2xl hover:bg-slate-300 duration-300">
//         <div className="flex gap-2">
//           <div>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="size-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M12 4.5v15m7.5-7.5h-15"
//               />
//             </svg>
//           </div>
//           <span className="font-inter text-lg">{text}</span>
//         </div>
//       </div>
//     </NavLink>
//   );
// }
