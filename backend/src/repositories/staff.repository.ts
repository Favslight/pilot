import { query } from "../database/pool";

const selectSql = "s.*, d.name AS department_name";
const joins = "FROM staff s JOIN departments d ON d.id = s.department_id";

export class StaffRepository {
  async generateStaffNumber() {
    const result = await query<{ staff_number: string }>("SELECT staff_number FROM staff ORDER BY created_at DESC LIMIT 1");
    const last = result.rows[0]?.staff_number?.split("/").pop();
    return `PSS/STF/${String((last ? Number(last) : 0) + 1).padStart(4, "0")}`;
  }

  async list(options: Record<string, string | number | undefined>) {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const offset = (page - 1) * limit;
    const values: unknown[] = [];
    const where = ["s.deleted_at IS NULL"];
    if (options.search) {
      values.push(`%${options.search}%`);
      where.push(`(s.staff_number ILIKE $${values.length} OR s.firstname ILIKE $${values.length} OR s.lastname ILIKE $${values.length} OR s.designation ILIKE $${values.length})`);
    }
    for (const [key, column] of Object.entries({ department_id: "s.department_id", employment_type: "s.employment_type", status: "s.status", gender: "s.gender" })) {
      if (options[key]) {
        values.push(options[key]);
        where.push(`${column} = $${values.length}`);
      }
    }
    const sqlWhere = `WHERE ${where.join(" AND ")}`;
    values.push(limit, offset);
    const rows = await query(`SELECT ${selectSql} ${joins} ${sqlWhere} ORDER BY s.created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values);
    const count = await query<{ count: string }>(`SELECT COUNT(*) ${joins} ${sqlWhere}`, values.slice(0, -2));
    return { items: rows.rows, meta: { page, limit, total: Number(count.rows[0].count) } };
  }

  async findById(id: string) {
    const result = await query(`SELECT ${selectSql} ${joins} WHERE s.id = $1 AND s.deleted_at IS NULL`, [id]);
    return result.rows[0] || null;
  }

  async create(data: Record<string, unknown>) {
    const keys = Object.keys(data);
    const result = await query(`INSERT INTO staff (${keys.join(",")}) VALUES (${keys.map((_, index) => `$${index + 1}`).join(",")}) RETURNING *`, keys.map((key) => data[key]));
    return this.findById(result.rows[0].id);
  }

  async update(id: string, data: Record<string, unknown>) {
    const keys = Object.keys(data);
    const result = await query(`UPDATE staff SET ${keys.map((key, index) => `${key} = $${index + 1}`).join(",")} WHERE id = $${keys.length + 1} AND deleted_at IS NULL RETURNING *`, [...keys.map((key) => data[key]), id]);
    if (!result.rows[0]) return null;
    return this.findById(id);
  }

  async archive(id: string) {
    const result = await query("UPDATE staff SET deleted_at = NOW(), status = 'Archived' WHERE id = $1 AND deleted_at IS NULL RETURNING *", [id]);
    return result.rows[0] || null;
  }
}
