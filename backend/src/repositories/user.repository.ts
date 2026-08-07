import { query } from "../database/pool";
import { BaseRepository } from "./base.repository";

export type UserRecord = {
  id: string;
  fullname: string;
  email: string;
  password?: string;
  role: string;
  role_name?: string;
  status: string;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
};

const publicFields = "u.id,u.fullname,u.email,u.role,u.status,u.last_login,u.created_at,u.updated_at,r.name AS role_name";

export class UserRepository extends BaseRepository<UserRecord> {
  constructor() {
    super("users", ["fullname", "email"], ["fullname", "email", "password", "role", "status"], "*");
  }

  async list(options: { page: number; limit: number; search?: string }) {
    const offset = (options.page - 1) * options.limit;
    const values: unknown[] = [];
    let where = "WHERE u.deleted_at IS NULL";
    if (options.search) {
      values.push(`%${options.search}%`);
      where += " AND (u.fullname ILIKE $1 OR u.email ILIKE $1)";
    }
    values.push(options.limit, offset);
    const rows = await query<UserRecord>(`SELECT ${publicFields} FROM users u JOIN roles r ON r.id = u.role ${where} ORDER BY u.created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values);
    const count = await query<{ count: string }>(`SELECT COUNT(*) FROM users u ${where}`, options.search ? [values[0]] : []);
    return { items: rows.rows, meta: { page: options.page, limit: options.limit, total: Number(count.rows[0].count) } };
  }

  async findByEmail(email: string) {
    const result = await query<UserRecord>(`SELECT ${publicFields},u.password FROM users u JOIN roles r ON r.id = u.role WHERE u.email = $1 AND u.deleted_at IS NULL`, [email]);
    return result.rows[0] || null;
  }

  async findPublicById(id: string) {
    const result = await query<UserRecord>(`SELECT ${publicFields} FROM users u JOIN roles r ON r.id = u.role WHERE u.id = $1 AND u.deleted_at IS NULL`, [id]);
    return result.rows[0] || null;
  }

  async touchLogin(id: string) {
    await query("UPDATE users SET last_login = NOW() WHERE id = $1", [id]);
  }

  async setStatus(id: string, status: string) {
    await query("UPDATE users SET status = $1 WHERE id = $2 AND deleted_at IS NULL", [status, id]);
    return this.findPublicById(id);
  }

  async softDelete(id: string) {
    const result = await query<UserRecord>("UPDATE users SET deleted_at = NOW(), status = 'inactive' WHERE id = $1 AND deleted_at IS NULL RETURNING *", [id]);
    return result.rows[0] || null;
  }
}
