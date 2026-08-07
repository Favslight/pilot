import bcrypt from "bcrypt";
import { FastifyReply, FastifyRequest } from "fastify";
import { query } from "../database/pool";
import { listAuditLogs, writeAuditLog } from "../repositories/audit.repository";
import { setActiveTerm, setCurrentSession, assertNoTermOverlap, getSchoolInformation, updateSchoolInformation } from "../repositories/master.repository";
import { assignRolePermissions, duplicateRole, ensureRoleCanDelete, getRolePermissions, listRoles } from "../repositories/role.repository";
import { UserRepository } from "../repositories/user.repository";
import { listPermissions } from "../repositories/permission.repository";
import { AppError } from "../utils/errors";
import { sendSuccess } from "../utils/response";

export class MasterController {
  private users = new UserRepository();

  permissions = async (_request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Permissions retrieved", await listPermissions());
  roles = async (_request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Roles retrieved", await listRoles());
  rolePermissions = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Role permissions retrieved", await getRolePermissions((request.params as { id: string }).id));
  assignPermissions = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const { permissionIds } = request.body as { permissionIds: string[] };
    await assignRolePermissions(id, permissionIds);
    await writeAuditLog({ userId: request.authUser?.id, action: "Permission Changes", tableName: "role_permissions", recordId: id, ipAddress: request.ip });
    return sendSuccess(reply, "Permissions assigned");
  };
  duplicateRole = async (request: FastifyRequest, reply: FastifyReply) => {
    const role = await duplicateRole((request.params as { id: string }).id);
    await writeAuditLog({ userId: request.authUser?.id, action: "Create", tableName: "roles", recordId: role.id, ipAddress: request.ip });
    return sendSuccess(reply, "Role duplicated", role, 201);
  };
  deleteRoleGuard = async (request: FastifyRequest) => ensureRoleCanDelete((request.params as { id: string }).id);

  userStatus = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await this.users.setStatus((request.params as { id: string }).id, (request.body as { status: string }).status);
    if (!user) throw new AppError("User not found", 404);
    await writeAuditLog({ userId: request.authUser?.id, action: "Update", tableName: "users", recordId: user.id, ipAddress: request.ip });
    return sendSuccess(reply, "User status updated", user);
  };
  resetPassword = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const { password } = request.body as { password: string };
    const user = await this.users.update(id, { password: await bcrypt.hash(password, 12) });
    if (!user) throw new AppError("User not found", 404);
    await writeAuditLog({ userId: request.authUser?.id, action: "Password Change", tableName: "users", recordId: id, ipAddress: request.ip });
    return sendSuccess(reply, "Password reset successfully");
  };

  setCurrentSession = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Current session updated", await setCurrentSession((request.params as { id: string }).id));
  createTermGuard = async (request: FastifyRequest) => {
    const body = request.body as { session_id: string; start_date: string; end_date: string; status: string };
    await assertNoTermOverlap(body.session_id, body.start_date, body.end_date);
    if (body.status === "active") await setActiveTerm("00000000-0000-0000-0000-000000000000").catch(() => undefined);
  };
  updateTermGuard = async (request: FastifyRequest) => {
    const body = request.body as { session_id?: string; start_date?: string; end_date?: string };
    if (body.session_id && body.start_date && body.end_date) await assertNoTermOverlap(body.session_id, body.start_date, body.end_date, (request.params as { id: string }).id);
  };
  setActiveTerm = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "Active term updated", await setActiveTerm((request.params as { id: string }).id));

  schoolInfo = async (_request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "School information retrieved", await getSchoolInformation());
  updateSchoolInfo = async (request: FastifyRequest, reply: FastifyReply) => sendSuccess(reply, "School information updated", await updateSchoolInformation(request.body as Record<string, unknown>));

  dashboard = async (_request: FastifyRequest, reply: FastifyReply) => {
    const [users, departments, classes, roles, session, logs, totalStudents, activeStudents, maleStudents, femaleStudents, recentStudents, classStats, graduatedStudents, repeatingStudents, recentlyPromoted, totalStaff, teachingStaff, nonTeachingStaff, activeStaff, retiredStaff, onLeaveStaff, recentStaff, staffByDepartment] = await Promise.all([
      query<{ count: string }>("SELECT COUNT(*) FROM users WHERE deleted_at IS NULL"),
      query<{ count: string }>("SELECT COUNT(*) FROM departments"),
      query<{ count: string }>("SELECT COUNT(*) FROM classes"),
      query<{ count: string }>("SELECT COUNT(*) FROM roles"),
      query("SELECT * FROM academic_sessions WHERE is_current = TRUE LIMIT 1"),
      listAuditLogs(8),
      query<{ count: string }>("SELECT COUNT(*) FROM students WHERE deleted_at IS NULL"),
      query<{ count: string }>("SELECT COUNT(*) FROM students s LEFT JOIN current_student_academic_status cs ON cs.student_id = s.id WHERE s.deleted_at IS NULL AND COALESCE(cs.academic_status, 'Active') = 'Active'"),
      query<{ count: string }>("SELECT COUNT(*) FROM students WHERE deleted_at IS NULL AND gender = 'Male'"),
      query<{ count: string }>("SELECT COUNT(*) FROM students WHERE deleted_at IS NULL AND gender = 'Female'"),
      query("SELECT id, admission_number, firstname, lastname, created_at FROM students WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 5"),
      query(
        `SELECT c.name AS class_name, COUNT(DISTINCT cs.student_id)::int AS count
         FROM classes c
         LEFT JOIN current_student_academic_status cs ON cs.class_id = c.id
         LEFT JOIN students s ON s.id = cs.student_id AND s.deleted_at IS NULL
         GROUP BY c.id, c.name, c.display_order
         ORDER BY c.display_order ASC`,
      ),
      query<{ count: string }>("SELECT COUNT(*) FROM current_student_academic_status WHERE academic_status = 'Graduated'"),
      query<{ count: string }>("SELECT COUNT(*) FROM current_student_academic_status WHERE academic_status = 'Repeated'"),
      query(
        `SELECT ar.*, s.admission_number, s.firstname, s.lastname, ac.session_name, c.name AS class_name, ca.name AS arm_name
         FROM student_academic_records ar
         JOIN students s ON s.id = ar.student_id
         JOIN academic_sessions ac ON ac.id = ar.academic_session_id
         JOIN classes c ON c.id = ar.class_id
         JOIN class_arms ca ON ca.id = ar.arm_id
         WHERE s.deleted_at IS NULL
         ORDER BY ar.created_at DESC LIMIT 5`,
      ),
      query<{ count: string }>("SELECT COUNT(*) FROM staff WHERE deleted_at IS NULL"),
      query<{ count: string }>("SELECT COUNT(*) FROM staff WHERE deleted_at IS NULL AND employment_type = 'Teaching'"),
      query<{ count: string }>("SELECT COUNT(*) FROM staff WHERE deleted_at IS NULL AND employment_type = 'Non-Teaching'"),
      query<{ count: string }>("SELECT COUNT(*) FROM staff WHERE deleted_at IS NULL AND status = 'Active'"),
      query<{ count: string }>("SELECT COUNT(*) FROM staff WHERE deleted_at IS NULL AND status = 'Retired'"),
      query<{ count: string }>("SELECT COUNT(*) FROM staff WHERE deleted_at IS NULL AND status = 'On Leave'"),
      query("SELECT s.id, s.staff_number, s.firstname, s.lastname, s.designation, d.name AS department_name, s.created_at FROM staff s JOIN departments d ON d.id = s.department_id WHERE s.deleted_at IS NULL ORDER BY s.created_at DESC LIMIT 5"),
      query("SELECT d.name AS department_name, COUNT(s.id)::int AS count FROM departments d LEFT JOIN staff s ON s.department_id = d.id AND s.deleted_at IS NULL GROUP BY d.id, d.name ORDER BY d.name ASC"),
    ]);
    return sendSuccess(reply, "Dashboard summary retrieved", {
      totalUsers: Number(users.rows[0].count),
      departments: Number(departments.rows[0].count),
      classes: Number(classes.rows[0].count),
      roles: Number(roles.rows[0].count),
      currentSession: session.rows[0] || null,
      latestActivities: logs,
      totalStudents: Number(totalStudents.rows[0].count),
      activeStudents: Number(activeStudents.rows[0].count),
      maleStudents: Number(maleStudents.rows[0].count),
      femaleStudents: Number(femaleStudents.rows[0].count),
      recentStudents: recentStudents.rows,
      classStats: classStats.rows,
      graduatedStudents: Number(graduatedStudents.rows[0].count),
      repeatingStudents: Number(repeatingStudents.rows[0].count),
      recentlyPromoted: recentlyPromoted.rows,
      totalStaff: Number(totalStaff.rows[0].count),
      teachingStaff: Number(teachingStaff.rows[0].count),
      nonTeachingStaff: Number(nonTeachingStaff.rows[0].count),
      activeStaff: Number(activeStaff.rows[0].count),
      retiredStaff: Number(retiredStaff.rows[0].count),
      onLeaveStaff: Number(onLeaveStaff.rows[0].count),
      recentStaff: recentStaff.rows,
      staffByDepartment: staffByDepartment.rows,
    });
  };

  search = async (request: FastifyRequest, reply: FastifyReply) => {
    const raw = (request.query as { search?: string; q?: string }).q || (request.query as { search?: string }).search || "";
    const term = `%${raw.trim()}%`;
    const [users, students, staff, departments, classes, sessions, terms, roles] = await Promise.all([
      query("SELECT id, fullname AS label, 'Users' AS module FROM users WHERE deleted_at IS NULL AND (fullname ILIKE $1 OR email ILIKE $1) LIMIT 10", [term]),
      query("SELECT id, admission_number || ' - ' || firstname || ' ' || lastname AS label, 'Students' AS module FROM students WHERE deleted_at IS NULL AND (admission_number ILIKE $1 OR firstname ILIKE $1 OR lastname ILIKE $1) LIMIT 10", [term]),
      query("SELECT id, staff_number || ' - ' || firstname || ' ' || lastname AS label, 'Staff' AS module FROM staff WHERE deleted_at IS NULL AND (staff_number ILIKE $1 OR firstname ILIKE $1 OR lastname ILIKE $1) LIMIT 10", [term]),
      query("SELECT id, name AS label, 'Departments' AS module FROM departments WHERE name ILIKE $1 LIMIT 10", [term]),
      query("SELECT id, name AS label, 'Classes' AS module FROM classes WHERE name ILIKE $1 LIMIT 10", [term]),
      query("SELECT id, session_name AS label, 'Sessions' AS module FROM academic_sessions WHERE session_name ILIKE $1 LIMIT 10", [term]),
      query("SELECT id, term_name AS label, 'Terms' AS module FROM terms WHERE term_name ILIKE $1 LIMIT 10", [term]),
      query("SELECT id, name AS label, 'Roles' AS module FROM roles WHERE name ILIKE $1 LIMIT 10", [term]),
    ]);
    return sendSuccess(reply, "Search results retrieved", [...users.rows, ...students.rows, ...staff.rows, ...departments.rows, ...classes.rows, ...sessions.rows, ...terms.rows, ...roles.rows]);
  };
}
