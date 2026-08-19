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

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority?: "high" | "medium" | "low";
  workspace?: string;
}

interface Workspace {
  id: string;
  name: string;
  description?: string;
}

interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  updatedAt?: string;
  workspace?: Workspace | string;
}

export type { User, AuthState, Task, Workspace, Note };
