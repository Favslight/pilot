import { query } from "../database/pool";

const selectSql = `
  ar.*,
  s.admission_number,
  s.firstname,
  s.lastname,
  s.gender,
  s.admission_year,
  s.expected_graduation_year,
  s.passport_url,
  ac.session_name,
  c.name AS class_name,
  ca.name AS arm_name
`;

const joins = `
  FROM student_academic_records ar
  JOIN students s ON s.id = ar.student_id
  JOIN academic_sessions ac ON ac.id = ar.academic_session_id
  JOIN classes c ON c.id = ar.class_id
  JOIN class_arms ca ON ca.id = ar.arm_id
`;

export class AcademicRecordRepository {
  async list(options: Record<string, string | number | undefined>) {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const offset = (page - 1) * limit;
    const values: unknown[] = [];
    const where = ["s.deleted_at IS NULL"];
    if (options.search) {
      values.push(`%${options.search}%`);
      where.push(`(s.admission_number ILIKE $${values.length} OR s.firstname ILIKE $${values.length} OR s.lastname ILIKE $${values.length})`);
    }
    for (const [key, column] of Object.entries({
      academic_session_id: "ar.academic_session_id",
      class_id: "ar.class_id",
      arm_id: "ar.arm_id",
      academic_status: "ar.academic_status",
      admission_year: "s.admission_year",
      expected_graduation_year: "s.expected_graduation_year",
      gender: "s.gender",
    })) {
      if (options[key]) {
        values.push(options[key]);
        where.push(`${column} = $${values.length}`);
      }
    }
    const sqlWhere = `WHERE ${where.join(" AND ")}`;
    values.push(limit, offset);
    const rows = await query(`SELECT ${selectSql} ${joins} ${sqlWhere} ORDER BY ar.created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values);
    const count = await query<{ count: string }>(`SELECT COUNT(*) ${joins} ${sqlWhere}`, values.slice(0, -2));
    return { items: rows.rows, meta: { page, limit, total: Number(count.rows[0].count) } };
  }

  async findById(id: string) {
    const result = await query(`SELECT ${selectSql} ${joins} WHERE ar.id = $1`, [id]);
    return result.rows[0] || null;
  }

  async latestForStudent(studentId: string) {
    const result = await query(`SELECT ${selectSql} ${joins} WHERE ar.student_id = $1 ORDER BY ac.session_name DESC, ar.created_at DESC LIMIT 1`, [studentId]);
    return result.rows[0] || null;
  }

  async history(studentId: string) {
    const result = await query(`SELECT ${selectSql} ${joins} WHERE ar.student_id = $1 ORDER BY ac.session_name ASC, ar.created_at ASC`, [studentId]);
    return result.rows;
  }

  async create(data: Record<string, unknown>) {
    const keys = Object.keys(data);
    const result = await query(`INSERT INTO student_academic_records (${keys.join(",")}) VALUES (${keys.map((_, index) => `$${index + 1}`).join(",")}) RETURNING *`, keys.map((key) => data[key]));
    return this.findById(result.rows[0].id);
  }

  async update(id: string, data: Record<string, unknown>) {
    const keys = Object.keys(data);
    const result = await query(`UPDATE student_academic_records SET ${keys.map((key, index) => `${key} = $${index + 1}`).join(",")} WHERE id = $${keys.length + 1} RETURNING *`, [...keys.map((key) => data[key]), id]);
    if (!result.rows[0]) return null;
    return this.findById(id);
  }

  async delete(id: string) {
    const result = await query("DELETE FROM student_academic_records WHERE id = $1 RETURNING *", [id]);
    return result.rows[0] || null;
  }

  async classStudents(sessionId: string, classId: string, armId: string) {
    const result = await query(
      `SELECT s.* FROM student_academic_records ar
       JOIN students s ON s.id = ar.student_id
       WHERE ar.academic_session_id = $1 AND ar.class_id = $2 AND ar.arm_id = $3 AND s.deleted_at IS NULL`,
      [sessionId, classId, armId],
    );
    return result.rows;
  }
}
