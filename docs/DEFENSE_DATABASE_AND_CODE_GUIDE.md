# School Database Management System Defense Guide

This guide explains the project from the beginning, as if you are setting it up and writing it in front of a supervisor. The project is a school records management system for Pilot Secondary School. It stores student records, staff records, academic sessions, classes, roles, permissions, reports, assets, and audit logs.

The system has three main parts:

1. PostgreSQL database: stores the school data.
2. Backend server: receives requests, validates them, talks to the database, and sends responses.
3. Frontend dashboard: the web interface used by administrators.

## 1. Project Structure

```text
pilot/
  backend/
    sql/
      schema.sql
      seed.sql
    src/
      config/
      database/
      routes/
      controllers/
      services/
      repositories/
      validators/
      middlewares/
      utils/
  frontend/
    app/
    components/
    services/
    lib/
    hooks/
  docs/
```

Simple explanation:

- `backend/sql/schema.sql` creates all database tables.
- `backend/sql/seed.sql` adds demo data.
- `backend/src/server.ts` starts the backend server.
- `backend/src/database/pool.ts` connects the server to PostgreSQL.
- `backend/src/routes` defines API links like `/api/students`.
- `backend/src/controllers` receives the request.
- `backend/src/services` handles business logic.
- `backend/src/repositories` writes SQL queries.
- `frontend/app` contains dashboard pages.
- `frontend/services` calls the backend APIs.
- `frontend/lib/api.ts` configures Axios for API requests.

## 2. Tools To Install

Install these before running the project:

- Node.js: runs the backend and frontend.
- PostgreSQL: database engine.
- pgAdmin or psql: used to create and inspect the database.
- VS Code: code editor.

Check installation:

```bash
node -v
npm -v
psql --version
```

## 3. Creating The Database From Scratch

Open PostgreSQL and create a database:

```sql
CREATE DATABASE pilot_records;
```

Meaning:

- `CREATE DATABASE` tells PostgreSQL to create a new database.
- `pilot_records` is the database name.

Connect to the database:

```bash
psql -U postgres -d pilot_records
```

## 4. Understanding Basic SQL Syntax

SQL means Structured Query Language. It is used to create, read, update, and delete data.

### Create A Table

Example:

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  admission_number VARCHAR(40) UNIQUE NOT NULL
);
```

Explanation:

- `CREATE TABLE students` creates a table named `students`.
- `id UUID PRIMARY KEY` gives every student a unique ID.
- `VARCHAR(100)` means text with a maximum length of 100 characters.
- `NOT NULL` means the field must have a value.
- `UNIQUE` means no two students can have the same admission number.

### Insert Data

```sql
INSERT INTO students (firstname, lastname, gender, admission_number)
VALUES ('John', 'Ade', 'Male', 'PSS/2026/0001');
```

This adds one student record.

### Read Data

```sql
SELECT * FROM students;
```

This fetches all students.

```sql
SELECT firstname, lastname FROM students WHERE gender = 'Male';
```

This fetches only male students and shows only firstname and lastname.

### Update Data

```sql
UPDATE students
SET lastname = 'Adewale'
WHERE admission_number = 'PSS/2026/0001';
```

This changes a student's surname.

### Delete Data

```sql
DELETE FROM students
WHERE admission_number = 'PSS/2026/0001';
```

This removes the student from the table.

In this project, students are usually archived instead of permanently deleted:

```sql
UPDATE students
SET deleted_at = NOW(), current_status = 'Archived'
WHERE id = $1;
```

## 5. The Actual Database Schema In This Project

The main database file is:

```text
backend/sql/schema.sql
```

Important tables:

- `roles`: stores roles like Administrator and Principal.
- `users`: stores login accounts.
- `academic_sessions`: stores sessions like `2026/2027`.
- `terms`: stores First Term, Second Term, and Third Term.
- `classes`: stores JSS1 to SS3.
- `class_arms`: stores A, B, C, Science, Arts, Commercial.
- `students`: stores student biodata.
- `student_guardians`: stores parent or guardian details.
- `student_medical_records`: stores medical information.
- `student_academic_records`: stores class placement and promotion history.
- `staff`: stores staff records.
- `school_assets`: stores school property records.
- `audit_logs`: records important actions done in the system.

Example from the real project:

```sql
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admission_number VARCHAR(40) NOT NULL UNIQUE,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male','Female')),
  date_of_birth DATE NOT NULL,
  admission_date DATE NOT NULL,
  admission_year INT NOT NULL,
  current_status VARCHAR(30) NOT NULL DEFAULT 'Active',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

How to explain it:

- `IF NOT EXISTS` prevents an error if the table already exists.
- `uuid_generate_v4()` automatically creates a unique ID.
- `CHECK (gender IN ('Male','Female'))` allows only Male or Female.
- `created_at` stores when the record was created.
- `updated_at` stores when the record was last updated.
- `deleted_at` is used for soft delete or archiving.

## 6. Relationships Between Tables

The project uses foreign keys to connect tables.

Example:

```sql
student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE
```

Meaning:

- `student_id` links a record to a student.
- `REFERENCES students(id)` means the value must exist in the `students` table.
- `ON DELETE CASCADE` means if the student is deleted, related guardian records are also deleted.

Example relationship:

- One student can have many guardians.
- One student can have one medical record.
- One student can have many academic records over different sessions.
- One staff belongs to one department.
- One user belongs to one role.

## 7. Useful SQL Features Used

### Index

```sql
CREATE INDEX IF NOT EXISTS idx_students_name ON students(lastname, firstname);
```

An index makes searching faster.

### View

```sql
CREATE OR REPLACE VIEW current_student_academic_status AS
SELECT DISTINCT ON (ar.student_id)
  ar.student_id,
  ac.session_name,
  c.name AS class_name,
  ca.name AS arm_name,
  ar.academic_status
FROM student_academic_records ar
JOIN academic_sessions ac ON ac.id = ar.academic_session_id
JOIN classes c ON c.id = ar.class_id
JOIN class_arms ca ON ca.id = ar.arm_id
ORDER BY ar.student_id, ac.session_name DESC, ar.created_at DESC;
```

Simple explanation:

This view helps the system quickly know each student's current class, arm, session, and academic status.

### Trigger

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Simple explanation:

This automatically updates the `updated_at` column whenever a record changes.

## 8. Running Schema And Seed Files

Create a backend `.env` file:

```text
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pilot_records
JWT_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Install backend dependencies:

```bash
cd backend
npm install
```

Run the schema:

```bash
npm run db:schema
```

Run demo data:

```bash
npm run db:seed
```

The seed file creates roles, permissions, demo users, students, guardians, staff, classes, terms, and assets.

Demo password:

```text
Password@123
```

## 9. Connecting The Backend To The Database

The database connection is in:

```text
backend/src/database/pool.ts
```

Code:

```ts
import pg, { QueryResultRow } from "pg";
import { env } from "../config/env";

export const pool = new pg.Pool({ connectionString: env.databaseUrl });

export const query = <T extends QueryResultRow>(text: string, params: unknown[] = []) =>
  pool.query<T>(text, params);
```

Explanation:

- `pg` is the PostgreSQL package for Node.js.
- `env.databaseUrl` reads the database URL from `.env`.
- `Pool` manages database connections.
- `query()` is a helper used throughout the backend to run SQL.
- `params` protects the database from SQL injection by using placeholders like `$1`, `$2`.

Example:

```ts
query("SELECT * FROM students WHERE id = $1", [id]);
```

Here, `$1` is replaced safely with the value of `id`.

## 10. How The Backend Server Works

The server starts from:

```text
backend/src/server.ts
```

```ts
import { buildApp } from "./app";
import { env } from "./config/env";

const start = async () => {
  const app = await buildApp();
  await app.listen({ port: env.port, host: "0.0.0.0" });
};
```

Explanation:

- `buildApp()` prepares the Fastify app.
- `app.listen()` starts the server on port `5000`.
- The frontend sends requests to this server.

The app is built in:

```text
backend/src/app.ts
```

It registers security, logging, error handling, health check, and routes.

```ts
app.get("/health", async () => ({
  success: true,
  message: "Pilot records API is healthy"
}));
```

This route is used to confirm that the backend is running.

## 11. Backend Request Flow

When the frontend requests students, the flow is:

```text
Frontend page
  -> frontend service
  -> backend route
  -> controller
  -> service
  -> repository
  -> PostgreSQL database
```

Example route:

```ts
app.get(
  "/api/students",
  { preHandler: [authenticate, requirePermission("students.view")] },
  controller.list
);
```

Explanation:

- `/api/students` is the endpoint.
- `authenticate` checks if the user is logged in.
- `requirePermission("students.view")` checks if the user has permission.
- `controller.list` handles the request.

Controller:

```ts
list = async (request, reply) =>
  sendSuccess(reply, "Students retrieved", await this.service.list(request.query));
```

Service:

```ts
list(queryParams) {
  return this.students.list(queryParams);
}
```

Repository:

```ts
SELECT s.*, cs.session_name, cs.class_name, cs.arm_name
FROM students s
LEFT JOIN current_student_academic_status cs ON cs.student_id = s.id
WHERE s.deleted_at IS NULL
ORDER BY s.created_at DESC
```

Simple explanation:

- The controller receives the request.
- The service applies business rules.
- The repository writes SQL.
- PostgreSQL returns the data.
- The server sends JSON back to the frontend.

## 12. Authentication And Permissions

The project uses:

- JWT for login sessions.
- bcrypt for password hashing.
- roles and permissions for access control.

Example:

```text
Administrator -> full access
Principal -> records oversight
Data Entry Officer -> data entry access
```

When a user logs in, the backend gives an access token. The frontend stores the token and sends it with later requests.

## 13. Frontend Setup

Create frontend `.env.local`:

```text
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Run frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/login
```

## 14. How The Frontend Connects To Backend

The API setup is in:

```text
frontend/lib/api.ts
```

```ts
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});
```

Explanation:

- Axios sends HTTP requests from frontend to backend.
- `baseURL` means every request starts with `http://localhost:5000/api`.

Token attachment:

```ts
const token = localStorage.getItem("accessToken");
if (token) config.headers.Authorization = `Bearer ${token}`;
```

This means logged-in users send their token with every request.

## 15. Example Frontend Student Flow

Student service file:

```text
frontend/services/student.service.ts
```

```ts
export const fetchStudents = async (search = "") =>
  api.get(`/students?search=${encodeURIComponent(search)}`)
    .then((res) => res.data.data);
```

Explanation:

- The frontend calls `/students`.
- The backend receives it as `/api/students`.
- The backend returns student data.

Student page:

```text
frontend/app/dashboard/students/page.tsx
```

The page uses TanStack Query:

```ts
const students = useQuery({
  queryKey: ["students", search],
  queryFn: () => fetchStudents(search)
});
```

Explanation:

- `useQuery` fetches and caches data.
- `queryKey` identifies the data.
- `queryFn` tells it what function to run.

The page then displays:

- total students
- active students
- male students
- female students
- student table
- search box
- export button
- action buttons

## 16. Dashboard Explanation

The dashboard page is:

```text
frontend/app/dashboard/page.tsx
```

It shows:

- total students
- active students
- total staff
- graduated students
- students by class
- students by gender
- staff by employment type
- latest activities

The dashboard does not store data itself. It requests summary data from the backend, and the backend calculates the figures from PostgreSQL.

## 17. How To Explain CRUD

CRUD means:

- Create: add new record.
- Read: view records.
- Update: edit record.
- Delete: remove or archive record.

Student CRUD example:

```text
Create student -> POST /api/students
View students -> GET /api/students
View one student -> GET /api/students/:id
Update student -> PUT /api/students/:id
Archive student -> DELETE /api/students/:id
```

In this project, deleting a student archives the record by setting `deleted_at`, so historical data is preserved.

## 18. How To Present The System During Defense

Use this order:

1. Explain that the system solves record management for a secondary school.
2. Show the database design and important tables.
3. Explain table relationships using students, guardians, and academic records.
4. Run the backend and show the `/health` endpoint.
5. Login to the frontend dashboard.
6. Demonstrate student registration.
7. Demonstrate student list, profile, search, and academic promotion.
8. Show staff records and reports.
9. Explain security: login, roles, permissions, and audit logs.
10. Explain that the project uses manual SQL, not an ORM.

## 19. Commands Summary

Backend:

```bash
cd backend
npm install
npm run db:schema
npm run db:seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000/login
```

## 20. Short Defense Explanation

You can say:

This project is a school database management system built with PostgreSQL, Fastify, TypeScript, and Next.js. PostgreSQL stores records such as students, staff, academic sessions, classes, guardians, medical records, roles, permissions, and audit logs. The backend server exposes secure API endpoints, validates user input, checks authentication and permissions, runs SQL queries, and returns JSON responses. The frontend dashboard consumes those APIs and provides pages for login, dashboard analytics, student management, staff management, academic records, reports, settings, and activity logs. The system uses manual SQL so the database structure and queries are clear and easy to defend.

