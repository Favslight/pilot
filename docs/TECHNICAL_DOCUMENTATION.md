# Technical Documentation

## Architecture

The system uses a Next.js frontend and Fastify backend. PostgreSQL is accessed through the `pg` package using handwritten SQL. The backend follows controllers, services, repositories, routes, validators, middleware, and plugins.

## Database Summary

Core tables:

- `users`, `roles`, `permissions`, `role_permissions`
- `school_information`
- `academic_sessions`, `terms`, `classes`, `class_arms`, `departments`
- `students`, `student_guardians`, `student_medical_records`, `student_documents`, `student_contacts`
- `student_academic_records`
- `staff`
- `school_assets`
- `audit_logs`

Important view:

- `current_student_academic_status`: derives each student's latest class, arm, session, and academic status from academic records.

## Entity Relationships

- User belongs to a role.
- Role has many permissions through `role_permissions`.
- Student has many guardians, documents, contacts, and academic records.
- Student has one medical record.
- Academic record belongs to one student, session, class, and arm.
- Staff belongs to one department.
- Asset can optionally be assigned to staff.

## Authentication Flow

1. User submits email and password.
2. Backend validates credentials with bcrypt.
3. Backend returns JWT access token and refresh token.
4. Frontend stores tokens in local storage.
5. Protected requests send `Authorization: Bearer <token>`.

## Upload Flow

1. Frontend sends multipart file upload.
2. Fastify multipart validates size.
3. Utility validates MIME type.
4. Cloudinary stores image/document.
5. Backend returns `url` and `public_id`.

## Business Rules

- Students and staff are archived, not permanently deleted.
- Admission numbers and staff numbers are unique.
- One student academic record per academic session.
- Current student class/arm/status is derived from latest academic record.
- One primary guardian per student.
- One medical record per student.
- Only one current academic session.
- Only one active term.
- System roles cannot be deleted.

## Security

- Helmet headers
- CORS configuration
- Rate limiting
- Response compression
- JWT authentication
- bcrypt password hashing
- Zod validation
- Parameterized SQL queries
- Environment variable validation
- No ORM

## API Groups

See `README.md` for endpoint summary. All JSON responses use the standardized `{ success, message, data, errors }` format.
