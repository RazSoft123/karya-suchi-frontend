# Karay Suchi — Frontend

Karay Suchi is a full-stack productivity application for organizing tasks and notes within personal or collaborative workspaces. This frontend showcases a clean, responsive interface backed by protected APIs, role-based workspace access, and persistent authentication.

## Live demo

The hosted application is available at [karaysuchi.razsoft.in](https://karaysuchi.razsoft.in/).

Use the shared demo account to explore the interface and working features without creating an account:

- **User ID:** `test@example.com`
- **Password:** `Test@1234`

The account is intentionally provided for recruiters, evaluators, and anyone interested in reviewing the project. Because it is shared, its data may be changed by other visitors.

## Key features

- Secure registration, login, logout, and automatic access-token renewal
- Personal default workspace created during registration
- Workspace creation, viewing, editing, and deletion
- Workspace member management with Owner, Editor, and Viewer access levels
- Workspace-scoped task creation, editing, status tracking, and deletion
- Task workflow from To Do to In Progress and Completed
- Workspace-scoped notes with full create, read, update, and delete support
- Dashboard summaries, recent content, filters, and empty states
- Responsive layouts and clear feedback for loading and error states

## Frontend stack

- React 19 and TypeScript
- Vite
- React Router
- TanStack Query for server-state management and caching
- Zustand for client-side state
- Tailwind CSS
- Zod for validation
- Lucide React and React Hot Toast

## Getting started

### Prerequisites

- Node.js 20 or later
- npm
- The Karay Suchi backend running locally

### Installation

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the frontend root:

   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

### Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## Project structure

```text
src/
├── components/   Reusable interface components
├── pages/        Route-level application screens
├── queries/      TanStack Query hooks and cache logic
├── services/     Backend API integrations
├── store/        Client-side state
└── utils/        Shared types, validation, and helpers
```

## Author

Built by **Rohit Kumar** as a full-stack portfolio project.

- [GitHub](https://github.com/RazSoft123)
- [LinkedIn](https://www.linkedin.com/in/rohit-raz-webdev)
