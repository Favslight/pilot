import { query } from "../database/pool";

export class StudentRepository {
  async generateAdmissionNumber(year: number) {
    const result = await query<{ admission_number: string }>(
      "SELECT admission_number FROM students WHERE admission_year = $1 ORDER BY admission_number DESC LIMIT 1",
      [year],
    );
    const last = result.rows[0]?.admission_number?.split("/").pop();
    const next = String((last ? Number(last) : 0) + 1).padStart(4, "0");
    return `PSS/${year}/${next}`;
  }

  async list(options: Record<string, string | number | undefined>) {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const offset = (page - 1) * limit;
    const values: unknown[] = [];
    const where = ["deleted_at IS NULL"];
    const filters = ["gender", "current_status", "state_of_origin", "religion", "admission_year", "expected_graduation_year"];
    if (options.search) {
      values.push(`%${options.search}%`);
      where.push(`(admission_number ILIKE $${values.length} OR firstname ILIKE $${values.length} OR lastname ILIKE $${values.length})`);
    }
    for (const filter of filters) {
      if (options[filter]) {
        values.push(options[filter]);
        where.push(`${filter} = $${values.length}`);
      }
    }
    values.push(limit, offset);
    const sqlWhere = `WHERE ${where.join(" AND ")}`;
    const rows = await query(
      `SELECT s.*, cs.session_name AS current_session_name, cs.class_name AS current_class_name,
        cs.arm_name AS current_arm_name, cs.academic_status AS current_academic_status
       FROM students s
       LEFT JOIN current_student_academic_status cs ON cs.student_id = s.id
       ${sqlWhere.replaceAll("deleted_at", "s.deleted_at").replaceAll("admission_number", "s.admission_number").replaceAll("firstname", "s.firstname").replaceAll("lastname", "s.lastname").replaceAll("gender", "s.gender").replaceAll("current_status", "s.current_status").replaceAll("state_of_origin", "s.state_of_origin").replaceAll("religion", "s.religion").replaceAll("admission_year", "s.admission_year").replaceAll("expected_graduation_year", "s.expected_graduation_year")}
       ORDER BY s.created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await query<{ count: string }>(`SELECT COUNT(*) FROM students ${sqlWhere}`, values.slice(0, -2));
    return { items: rows.rows, meta: { page, limit, total: Number(count.rows[0].count) } };
  }

  async create(data: Record<string, unknown>) {
    const keys = Object.keys(data);
    const result = await query(`INSERT INTO students (${keys.join(",")}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(",")}) RETURNING *`, keys.map((key) => data[key]));
    return result.rows[0];
  }

  async update(id: string, data: Record<string, unknown>) {
    const keys = Object.keys(data);
    const result = await query(`UPDATE students SET ${keys.map((key, i) => `${key} = $${i + 1}`).join(",")} WHERE id = $${keys.length + 1} AND deleted_at IS NULL RETURNING *`, [...keys.map((key) => data[key]), id]);
    return result.rows[0] || null;
  }

  async archive(id: string) {
    const result = await query("UPDATE students SET deleted_at = NOW(), current_status = 'Archived' WHERE id = $1 AND deleted_at IS NULL RETURNING *", [id]);
    return result.rows[0] || null;
  }

  async profile(id: string) {
    const student = await query(
      `SELECT s.*, cs.session_name AS current_session_name, cs.class_name AS current_class_name,
        cs.arm_name AS current_arm_name, cs.academic_status AS current_academic_status
       FROM students s
       LEFT JOIN current_student_academic_status cs ON cs.student_id = s.id
       WHERE s.id = $1 AND s.deleted_at IS NULL`,
      [id],
    );
    if (!student.rows[0]) return null;
    const [guardians, medical, documents, contacts, academicHistory, logs] = await Promise.all([
      query("SELECT * FROM student_guardians WHERE student_id = $1 ORDER BY is_primary DESC, created_at ASC", [id]),
      query("SELECT * FROM student_medical_records WHERE student_id = $1", [id]),
      query("SELECT * FROM student_documents WHERE student_id = $1 ORDER BY created_at DESC", [id]),
      query("SELECT * FROM student_contacts WHERE student_id = $1 ORDER BY created_at ASC", [id]),
      query(
        `SELECT ar.*, ac.session_name, c.name AS class_name, ca.name AS arm_name
         FROM student_academic_records ar
         JOIN academic_sessions ac ON ac.id = ar.academic_session_id
         JOIN classes c ON c.id = ar.class_id
         JOIN class_arms ca ON ca.id = ar.arm_id
         WHERE ar.student_id = $1
         ORDER BY ac.session_name ASC, ar.created_at ASC`,
        [id],
      ),
      query("SELECT * FROM audit_logs WHERE table_name LIKE 'student%' AND record_id = $1 ORDER BY created_at DESC LIMIT 20", [id]),
    ]);
    return { ...student.rows[0], guardians: guardians.rows, medical: medical.rows[0] || null, documents: documents.rows, contacts: contacts.rows, academicHistory: academicHistory.rows, activity: logs.rows };
  }
}
