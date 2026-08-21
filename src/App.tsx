import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import HomePage from "./pages/HomePage";
import "./App.css";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Login from "./pages/auth/Login";
import AuthLayout from "./pages/auth/AuthLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedLayouts from "./components/layout/ProtectedLayout";
import Workspace from "./pages/workspace/Workspace";
import NewWorkspace from "./pages/workspace/NewWorkspace";
import WorkspaceDetails from "./pages/workspace/WorkspaceDetails";
import FeauresPage from "./pages/FeaturesPage";
import HelpPage from "./pages/HelpPage";
import NotFoundPage from "./pages/NotFoundPage";
import Notes from "./pages/notes/Notes";
import NoteDetails from "./pages/notes/NoteDetails";
import NewNote from "./pages/workspace/notes/NewNote";
import Tasks from "./pages/tasks/Tasks";
import NewTask from "./pages/workspace/tasks/NewTask";
import TaskDetails from "./pages/tasks/TaskDetails";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";
const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/features",
    Component: FeauresPage,
  },
  {
    path: "/help",
    Component: HelpPage,
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password", Component: ResetPassword },
    ],
  },
  {
    Component: ProtectedLayouts,
    children: [
      {
        Component: DashboardLayout,
        children: [
          { path: "dashboard", Component: Dashboard },
          { path: "tasks", Component: Tasks },
          { path: "tasks/new", Component: NewTask },
          { path: "tasks/:taskId", Component: TaskDetails },
          { path: "notes", Component: Notes },
          { path: "notes/new", Component: NewNote },
          { path: "notes/:noteId", Component: NoteDetails },
          { path: "workspace", Component: Workspace },
          { path: "workspace/new", Component: NewWorkspace },
          { path: "workspace/:workspaceId", Component: WorkspaceDetails },
          { path: "profile", Component: Profile },
          { path: "settings", Component: Settings },
        ],
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
