# TaskFlow by ETHARA AI

TaskFlow is a modern team task management application built with React, Tailwind CSS, Vite, and FastAPI. It offers role-based access, project tracking, task workflows, comments, analytics, and a polished dark dashboard experience.

## Features

- Authentication: registration, login, JWT auth, password hashing, protected routes
- Role-based access: admin and member
- Project management: create, edit, delete, assign members, track status
- Task management: create, assign, due dates, priority levels, status updates, comments
- Admin dashboard: totals for users, projects, completed tasks, pending tasks, overdue tasks
- Member dashboard: personal assigned tasks, completion progress, upcoming deadlines
- Responsive dark UI with glassmorphism and animation
- Search, filtering, toast notifications, loading states, empty states
- PostgreSQL database with SQLAlchemy relationships

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router DOM, Axios
- Backend: FastAPI, SQLAlchemy, PostgreSQL, JWT Authentication
- Deployment: Railway

## Folder Structure

- `backend/` - FastAPI backend
- `frontend/` - React + Vite frontend
- `railway.json` - Railway deployment metadata

## Installation

### Backend

1. Create and activate a Python virtual environment.
2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and set your PostgreSQL connection and JWT secret.

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Copy `.env.example` to `.env` and set `VITE_API_URL`.

## Environment Variables

### Backend `.env`

```env
DATABASE_URL=postgresql://username:password@host:5432/taskflow_db
JWT_SECRET_KEY=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=TaskFlow
```

## Running Locally

### Backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm run dev
```

## API Endpoints

### Auth

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and receive a JWT token

### Users

- `GET /api/users/me` - Get current user profile
- `GET /api/users` - List users (admin only)
- `PATCH /api/users/{user_id}` - Update user role (admin only)

### Projects

- `GET /api/projects` - List projects
- `GET /api/projects/{project_id}` - Get project details
- `POST /api/projects` - Create a project (admin only)
- `PATCH /api/projects/{project_id}` - Update a project (admin only)
- `DELETE /api/projects/{project_id}` - Delete a project (admin only)

### Tasks

- `GET /api/tasks` - List tasks
- `GET /api/tasks/{task_id}` - Get task details
- `POST /api/tasks` - Create a task (admin only)
- `PATCH /api/tasks/{task_id}` - Update a task
- `DELETE /api/tasks/{task_id}` - Delete a task (admin only)
- `POST /api/tasks/{task_id}/comments` - Add comment to task

### Dashboard

- `GET /api/dashboard` - Retrieve dashboard analytics

## Railway Deployment

### Backend Deployment

1. Create a new Railway project and add a PostgreSQL plugin.
2. Set environment variables in Railway:
   - `DATABASE_URL`
   - `JWT_SECRET_KEY`
   - `FRONTEND_URL`
3. Deploy the `backend` service.
4. Use `uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}` as the start command if needed.

### Frontend Deployment

1. Create a new Railway project for frontend or add it to the same project.
2. Set `VITE_API_URL` to the deployed backend API URL.
3. Deploy the `frontend` service.
4. Build command: `npm run build`
5. Start command: `npm run preview`

### Connecting PostgreSQL

- Add Railway PostgreSQL plugin.
- Copy the generated connection string into backend `DATABASE_URL`.
- Confirm the backend can connect and create tables on startup.

## Sample Data

- Admin user: `admin@ethara.ai` / `Admin1234`
- Member user: `member@ethara.ai` / `Member1234`

## Notes

- The current architecture is production-ready with JWT authentication, role-based access control, and a responsive SaaS-style dashboard.
- Use Railway environment variables to secure secrets and database credentials.
- The frontend is styled with a modern dark green and black theme aligned with ETHARA AI branding.
