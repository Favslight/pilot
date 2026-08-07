import { FastifyReply, FastifyRequest } from "fastify";
import { query } from "../database/pool";
import { listAuditLogs } from "../repositories/audit.repository";
import { sendSuccess } from "../utils/response";
import { toCsv } from "../utils/csv";

const filtered = (baseWhere: string[], params: unknown[], q: Record<string, unknown>, alias: string) => {
  if (q.search) {
    params.push(`%${q.search}%`);
    baseWhere.push(`(${alias}.firstname ILIKE $${params.length} OR ${alias}.lastname ILIKE $${params.length})`);
  }
  if (q.gender) {
    params.push(q.gender);
    baseWhere.push(`${alias}.gender = $${params.length}`);
  }
  return `WHERE ${baseWhere.join(" AND ")}`;
};

export class ReportController {
  dashboard = async (_request: FastifyRequest, reply: FastifyReply) => {
    const [studentGender, admissionYears, staffTypes, graduationTrend] = await Promise.all([
      query("SELECT gender, COUNT(*)::int AS count FROM students WHERE deleted_at IS NULL GROUP BY gender"),
      query("SELECT admission_year, COUNT(*)::int AS count FROM students WHERE deleted_at IS NULL GROUP BY admission_year ORDER BY admission_year"),
      query("SELECT employment_type, COUNT(*)::int AS count FROM staff WHERE deleted_at IS NULL GROUP BY employment_type"),
      query("SELECT ac.session_name, COUNT(*)::int AS count FROM student_academic_records ar JOIN academic_sessions ac ON ac.id = ar.academic_session_id WHERE ar.academic_status = 'Graduated' GROUP BY ac.session_name ORDER BY ac.session_name"),
    ]);
    return sendSuccess(reply, "Dashboard analytics retrieved", {
      studentsByGender: studentGender.rows,
      studentsByAdmissionYear: admissionYears.rows,
      staffByEmploymentType: staffTypes.rows,
      graduationTrend: graduationTrend.rows,
    });
  };

  students = async (request: FastifyRequest, reply: FastifyReply) => {
    const params: unknown[] = [];
    const q = request.query as Record<string, unknown>;
    const where = filtered(["s.deleted_at IS NULL"], params, q, "s");
    const result = await query(
      `SELECT s.admission_number, s.firstname, s.lastname, s.gender, s.admission_year,
        cs.session_name, cs.class_name, cs.arm_name, COALESCE(cs.academic_status, s.current_status) AS status
       FROM students s LEFT JOIN current_student_academic_status cs ON cs.student_id = s.id ${where}
       ORDER BY s.lastname, s.firstname`,
      params,
    );
    return sendSuccess(reply, "Student report generated", result.rows);
  };

  staff = async (request: FastifyRequest, reply: FastifyReply) => {
    const params: unknown[] = [];
    const q = request.query as Record<string, unknown>;
    const where = filtered(["s.deleted_at IS NULL"], params, q, "s");
    const result = await query(
      `SELECT s.staff_number, s.firstname, s.lastname, s.gender, d.name AS department,
        s.designation, s.employment_type, s.status, s.employment_date
       FROM staff s JOIN departments d ON d.id = s.department_id ${where}
       ORDER BY s.lastname, s.firstname`,
      params,
    );
    return sendSuccess(reply, "Staff report generated", result.rows);
  };

  academic = async (request: FastifyRequest, reply: FastifyReply) => {
    const params: unknown[] = [];
    const q = request.query as Record<string, unknown>;
    const where = ["s.deleted_at IS NULL"];
    if (q.search) {
      params.push(`%${q.search}%`);
      where.push(`(s.admission_number ILIKE $${params.length} OR s.firstname ILIKE $${params.length} OR s.lastname ILIKE $${params.length})`);
    }
    const result = await query(
      `SELECT s.admission_number, s.firstname, s.lastname, ac.session_name, c.name AS class_name,
        ca.name AS arm_name, ar.academic_status, ar.remarks, ar.created_at
       FROM student_academic_records ar
       JOIN students s ON s.id = ar.student_id
       JOIN academic_sessions ac ON ac.id = ar.academic_session_id
       JOIN classes c ON c.id = ar.class_id
       JOIN class_arms ca ON ca.id = ar.arm_id
       WHERE ${where.join(" AND ")}
       ORDER BY ac.session_name, c.display_order, ca.name, s.lastname`,
      params,
    );
    return sendSuccess(reply, "Academic report generated", result.rows);
  };

  exportCsv = (kind: "students" | "staff" | "academic") => async (request: FastifyRequest, reply: FastifyReply) => {
    const fakeReply = { status: () => fakeReply, send: (body: { data?: Record<string, unknown>[] }) => body } as never as FastifyReply;
    const body = kind === "students" ? await this.students(request, fakeReply) : kind === "staff" ? await this.staff(request, fakeReply) : await this.academic(request, fakeReply);
    const rows = (body as unknown as { data: Record<string, unknown>[] }).data || [];
    reply.header("Content-Type", "text/csv");
    reply.header("Content-Disposition", `attachment; filename="${kind}.csv"`);
    return reply.send(toCsv(rows));
  };

  auditLogs = async (request: FastifyRequest, reply: FastifyReply) => {
    const limit = Number((request.query as { limit?: string }).limit || 50);
    return sendSuccess(reply, "Audit logs retrieved", await listAuditLogs(limit));
  };

  backup = async (_request: FastifyRequest, reply: FastifyReply) => {
    const tables = ["roles", "permissions", "departments", "classes", "class_arms", "academic_sessions", "students", "staff", "student_academic_records", "school_assets"];
    const chunks: string[] = ["-- Pilot Records data export", `-- Generated ${new Date().toISOString()}`];
    for (const table of tables) {
      const result = await query(`SELECT row_to_json(t) AS row FROM (SELECT * FROM ${table}) t`);
      chunks.push(`-- ${table}`);
      chunks.push(...result.rows.map((row) => `-- DATA ${table}: ${JSON.stringify(row.row)}`));
    }
    reply.header("Content-Type", "application/sql");
    reply.header("Content-Disposition", 'attachment; filename="pilot-records-backup.sql"');
    return reply.send(chunks.join("\n"));
  };
}
