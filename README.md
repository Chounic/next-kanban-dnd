# Kanban Task Manager – Next.js, Kysely & Postgres

Welcome to this Kanban task manager built with Next.js, Kysely, and Postgres.

## 🚀 Project Overview

- **Type**: Kanban application (task management by columns)
- **Stack**: Next.js 14, TypeScript, Kysely (query builder), PostgreSQL, TailwindCSS, shadcn/ui, Auth.js (NextAuth.js), @hello-pangea/dnd
- **Main features**:
  - Secure authentication (Auth.js)
  - Create, edit, delete tasks and subtasks
  - Smooth drag & drop between columns (@hello-pangea/dnd)
  - Accessible modals and menus (focus, keyboard, ARIA)
  - Responsive design

## 🛠️ Technologies Used

- **Next.js**: Modern React framework for SSR/SSG
- **TypeScript**: Static typing for reliability
- **Kysely**: Type-safe ORM for Postgres
- **Postgres**: Relational database
- **TailwindCSS**: Fast and responsive design
- **shadcn/ui**: Accessible and stylish components
- **NextAuth.js**: Secure authentication
- **@hello-pangea/dnd**: High-performance drag & drop (fork of react-beautiful-dnd)

## 🖥️ Detailed Features

- **Kanban Board**:
  - Drag and drop tasks between columns
  - Update task status after drag and drop

- **Task Management**:
  - Create/edit via accessible modal
  - Add subtasks
  - Auto-fill fields using OpenAI API
  - Delete and archive

- **Accessibility**:
  - Full keyboard navigation
  - Focus management, ARIA, contrast

- **Security**:
  - Auth.js authentication (Google, Credentials)

## 🚦 Run the Project Locally

1. **Clone the repo**

```bash
git clone <repo-url>
cd next-tasks-manager
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure the environment**

Copy `.env.example` to `.env.local` and fill in your variables (Postgres, NextAuth, etc.)

4. **Start the database (optional, via Docker)**

```bash
docker-compose up -d
```

5. **Run migrations**

In the project folder, run the migration commands to create the necessary tables in the database:

```bash
pnpm db:migrate:up
```

6. **Start the application**

```bash
pnpm dev
```

7. **Access the application**

Open [http://localhost:3000](http://localhost:3000)

---
