# Pilot Secondary School Record Management System

A production-style internal records management system for Pilot Secondary School. The system centralizes institutional records for administrators: students, academic progression, staff, users, roles, reports, settings, assets, audit logs, and exports.

This is not an e-learning platform, student portal, or teacher portal.

## Objectives

- Preserve student and staff records permanently.
- Track student academic movement by session without overwriting history.
- Provide fast search, reporting, printing, and exports.
- Support role-based administration with audit trails.
- Present a polished SaaS-style interface suitable for thesis defense and demonstration.

## Features

- JWT authentication with bcrypt password hashing
- Users, roles, permissions, and RBAC
- School information and Cloudinary logo upload
- Academic sessions, terms, classes, departments, and arms
- Student registration, guardians, medical records, documents, and profiles
- Student academic progression, single and bulk promotion
- Staff registration, staff profiles, and staff directory
- Lightweight school assets register
- Dashboard analytics and charts
- Global search
- Reports, print-ready views, CSV exports, and SQL-style backup export
- Audit log viewer
- Temporary guest preview mode for demonstration before seeding users

## Technology Stack

- Frontend: Next.js 15, TypeScript, TailwindCSS, App Router, React Hook Form, TanStack Query, Axios, Zod, Lucide Icons
- Backend: Fastify, TypeScript, PostgreSQL, `pg`, JWT, bcrypt, Cloudinary, dotenv
- Data access: manual SQL only. No Prisma, Drizzle, Sequelize, or ORM.

## Folder Structure

```text
backend/
  src/config database controllers services repositories routes middlewares plugins utils types validators
  sql/schema.sql
  sql/seed.sql
frontend/
  app/
  components/ui layout tables forms charts modals
  hooks services lib utils types constants contexts styles
docs/
  USER_MANUAL.md
  TECHNICAL_DOCUMENTATION.md
  TEST_REPORT.md
```

## Environment Variables

Backend `.env`:

```text
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pilot_records
JWT_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Frontend `.env.local`:

```text
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Installation

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Database Setup

Create a PostgreSQL database, then run:

```bash
cd backend
npm run db:schema
npm run db:seed
```

The seed includes demo users, roles, permissions, sessions, 72 students, guardians, medical records, academic placements, 18 staff members, and 24 assets.

Demo login users use:

```text
Password@123
```

## Running Locally

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000/login`.

## Production Build

```bash
cd backend
npm run build

cd ../frontend
npm run build
```

## API Overview

- Auth: `/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`, `/api/auth/me`, `/api/auth/change-password`
- Users: `/api/users`
- Roles and permissions: `/api/roles`, `/api/permissions`
- Master data: `/api/sessions`, `/api/terms`, `/api/classes`, `/api/departments`, `/api/arms`
- Students: `/api/students`, `/api/students/:id`, guardians, medical, documents
- Academic progression: `/api/academic-records`, `/api/students/:id/promote`, `/api/academic-records/bulk-promote`
- Staff: `/api/staff`
- Assets: `/api/assets`
- Reports: `/api/reports/students`, `/api/reports/staff`, `/api/reports/academic`
- Exports: `/api/export/students`, `/api/export/staff`, `/api/export/academic`
- Search: `/api/search?q=john`
- Dashboard: `/api/dashboard`, `/api/dashboard/summary`
- Audit logs: `/api/audit-logs`
- Backup: `/api/backup/sql`

All JSON APIs use:

```json
{ "success": true, "message": "Message", "data": {} }
```

## Screenshots

Add final screenshots here before submission:

- Login page
- Dashboard
- Student registration wizard
- Student profile
- Academic promotion
- Staff directory
- Reports page
- Settings page

## Future Improvements

- Replace temporary guest preview with seeded/demo-only credentials in production builds.
- Add real PDF generation service for reports.
- Add restore flow for backups.
- Add automated end-to-end tests.
- Add email notifications for administrative actions.

## Documentation

- [User Manual](docs/USER_MANUAL.md)
- [Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md)
- [Test Report](docs/TEST_REPORT.md)
