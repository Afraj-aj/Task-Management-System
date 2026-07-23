# Task Management System

A full-stack task management application built as a technical assessment for Koncepthive Full Stack Web Developer Intern position. Users can authenticate, manage tasks with CRUD operations, search, filter, sort, and track due dates with a modern glassmorphism UI.

**Live URLs:**
- Frontend: https://afraj-taskflow.vercel.app
- Backend API: https://afraj-taskflow-api.onrender.com

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, TypeScript, Tailwind CSS v4, Vite |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (Neon) |
| Auth | JWT (JSON Web Tokens) |
| Validation | Zod |
| Deployment | Vercel (Frontend), Render (Backend) |

## Project Structure

```
task-management-system/
├── frontend/           # React frontend (Vite + TypeScript)
├── backend/            # Express API server (TypeScript)
├── database/           # SQL schema and seed files
├── README.md
└── .gitignore
```

## Installation Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (local or cloud like Neon)

### 1. Clone the repository

```bash
git clone <repository-url>
cd task-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

## Environment Variables

### Backend (backend/.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5501` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `JWT_SECRET` | Secret key for JWT signing | Random 64-char hex string |
| `JWT_EXPIRES_IN` | Token expiry duration | `24h` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5500` |

Generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (frontend/.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `/api` (dev) or `https://your-backend.onrender.com/api` (prod) |

## Database Setup

Tables are created automatically on server startup via `init.ts`. To manually set up:

```bash
# Run schema
psql -U your_user -d your_database -f database/schema.sql

# Seed data (optional, also runs on startup)
psql -U your_user -d your_database -f database/seed.sql
```

### Default Credentials

| Field | Value |
|-------|-------|
| Email | `admin@test.com` |
| Password | `123456` |

### Database Schema

**Users Table**
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR, bcrypt hashed)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Tasks Table**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER, FK → users)
- `title` (VARCHAR)
- `description` (TEXT, nullable)
- `priority` (Low / Medium / High)
- `status` (Pending / In Progress / Completed)
- `due_date` (DATE)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Running the Backend

```bash
cd backend

# Development (with auto-reload)
npm run dev

# Production
npm run build
npm start
```

Server runs on `http://localhost:5501`.

## Running the Frontend

```bash
cd frontend

# Development
npm run dev

# Production
npm run build
npm run preview
```

Frontend runs on `http://localhost:5500`. API requests are proxied to the backend via Vite's dev server.

## API Documentation

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login user | No |

**POST /api/auth/login**
```json
// Request
{ "email": "admin@test.com", "password": "123456" }

// Response 200
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": 1, "name": "Admin", "email": "admin@test.com" }
  }
}
```

### Tasks

All task endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (with search, filter, sort, pagination) |
| GET | `/api/tasks/stats` | Get task statistics |
| GET | `/api/tasks/due-soon` | Get tasks due within 1 day |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

**GET /api/tasks** — Query Parameters
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search by title (ILIKE) |
| `status` | string | Filter by status |
| `priority` | string | Filter by priority |
| `sort` | string | `newest`, `oldest`, `due_date` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

**POST /api/tasks**
```json
// Request
{
  "title": "My Task",
  "description": "Task description",
  "priority": "High",
  "status": "Pending",
  "due_date": "2026-07-25"
}

// Response 201
{
  "success": true,
  "message": "Task created successfully",
  "data": { "id": 1, "title": "My Task", ... }
}
```

**PUT /api/tasks/:id**
```json
// Request
{ "title": "Updated Task", "status": "In Progress" }

// Response 200
{
  "success": true,
  "message": "Task updated successfully",
  "data": { "id": 1, "title": "Updated Task", ... }
}
```

### Validation Rules

- **Title**: Required, cannot be empty
- **Priority**: Must be Low, Medium, or High
- **Status**: Must be Pending, In Progress, or Completed
- **Due Date**: Required on create, cannot be in the past
- **Completed Tasks**: Only title/description can be updated

### Error Response Format

```json
{
  "success": false,
  "message": "Validation error message"
}
```

## Assumptions

1. **Single user system** — Only one user (admin) is seeded; no registration is required per the assessment spec
2. **JWT-based authentication** — Tokens expire after 24 hours; no refresh token mechanism
3. **Completed task restrictions** — When a task is marked Completed, only title and description can be modified (due_date and status are locked)
4. **Overdue logic** — A task is overdue if `due_date < today` AND `status != 'Completed'`
5. **Due-soon alerts** — Shows non-completed tasks due within 1 day
6. **Database auto-setup** — Tables are created on server startup; no separate migration tool is used
7. **Password hashing** — Passwords are pre-hashed with bcrypt (10 salt rounds) in the seed script, not hashed at runtime

## Known Limitations

1. **No registration** — Only the seeded admin account exists; no user signup flow
2. **No refresh tokens** — JWT tokens expire after 24h with no renewal mechanism
3. **No file attachments** — Tasks support text only, no file uploads
4. **No real-time updates** — Changes are fetched on demand, no WebSocket/polling for multi-device sync
5. **No unit tests** — Testing is not implemented in this version
6. **No Docker support** — No containerization setup
7. **Single-user design** — All tasks belong to one user; no multi-user collaboration

## Bonus Features Implemented

- [x] Pagination
- [x] Dark Mode
- [x] Toast Notifications
- [x] Loading Indicators
- [x] Responsive Design (mobile, tablet, desktop)
- [x] Search, Filter, Sort
- [x] Due Date Alerts
- [x] Quick Status Toggle (dropdown on task cards)
- [x] Glassmorphism UI Design
