// The file will contain information about all the types

interface User {
  id: string;
  email: string;
  name: string;
}

// Auth related types
interface AuthState {
  user: User | null;
  loading: boolean;
  error: boolean;
  auth: boolean;
}

type TaskStatus = "todo" | "in_progress" | "completed" | "archived";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  status?: TaskStatus;
  dueDate?: string;
  priority?: "high" | "medium" | "low";
  workspace?: Workspace | string;
  createdAt?: string;
  updatedAt?: string;
}

interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId?: string;
  isOwner?: boolean;
  canManage?: boolean;
  canEdit?: boolean;
  isDefault?: boolean;
  openTaskCount?: number;
  noteCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

type WorkspaceMemberAccess = "view" | "edit";

interface WorkspaceMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  access: WorkspaceMemberAccess;
  isOwner: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  updatedAt?: string;
  workspace?: Workspace | string;
}

export type {
  User,
  AuthState,
  TaskStatus,
  Task,
  Workspace,
  WorkspaceMemberAccess,
  WorkspaceMember,
  Note,
};
