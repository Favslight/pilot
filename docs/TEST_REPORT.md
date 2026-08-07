# Test Report

Date: 2026-08-07

## Automated Checks

| Area | Command | Result |
|---|---|---|
| Backend TypeScript | `npm run typecheck` | Passed |
| Backend Build | `npm run build` | Passed |
| Backend Audit | `npm audit --omit=dev` | Passed |
| Frontend TypeScript | `npm run typecheck` | Passed |
| Frontend Build | `npm run build` | Passed |

## Functional Test Matrix

| Module | Test Case | Expected Result | Status |
|---|---|---|---|
| Authentication | Login with valid user | Token returned and dashboard accessible | Passed |
| Users | View user list | Users are listed with roles/status | Passed |
| Roles | Assign permissions | Role permissions update | Passed |
| Students | Register student | Student record created with generated admission number | Passed |
| Students | View profile | Overview, guardians, medical, documents, academic history load | Passed |
| Academic Progression | Promote student | New academic record created without overwriting old record | Passed |
| Academic Progression | Bulk promote | Transaction creates all selected records or none | Passed |
| Staff | Register staff | Staff record created with generated staff number | Passed |
| Staff | Archive staff | Staff is soft archived | Passed |
| Reports | Generate student report | Report preview renders and exports CSV | Passed |
| Search | Search student/staff | Dropdown returns matching results | Passed |
| Settings | Update school info | School information saves | Passed |
| Backup | Download SQL export | SQL-style export downloads | Passed |
| Uploads | Upload image/document | Cloudinary URL/public ID returned | Passed |
| Dashboard | Load analytics | Cards and charts display live data | Passed |

## Known Notes

- Frontend audit reports transitive Next.js 15 advisories in `postcss`/`sharp`; npm's fix upgrades to Next 16, which conflicts with the requested stack.
- Guest preview mode is temporary and should be removed before production deployment.
