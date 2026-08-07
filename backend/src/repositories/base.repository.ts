import { query } from "../database/pool";

export type ListOptions = { page: number; limit: number; search?: string };

export class BaseRepository<T extends { id: string }> {
  constructor(
    protected table: string,
    protected searchable: string[],
    protected writable: string[],
    protected selectFields = "*",
  ) {}

  async list({ page, limit, search }: ListOptions) {
    const offset = (page - 1) * limit;
    const values: unknown[] = [];
    let where = "";
    if (search && this.searchable.length) {
      values.push(`%${search}%`);
      where = `WHERE ${this.searchable.map((field) => `${field} ILIKE $1`).join(" OR ")}`;
    }
    values.push(limit, offset);
    const rows = await query<T>(`SELECT ${this.selectFields} FROM ${this.table} ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values);
    const count = await query<{ count: string }>(`SELECT COUNT(*) FROM ${this.table} ${where}`, search ? [values[0]] : []);
    return { items: rows.rows, meta: { page, limit, total: Number(count.rows[0].count) } };
  }

  async findById(id: string) {
    const result = await query<T>(`SELECT ${this.selectFields} FROM ${this.table} WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  async create(data: Record<string, unknown>) {
    const keys = this.writable.filter((key) => key in data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");
    const result = await query<T>(`INSERT INTO ${this.table} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING ${this.selectFields}`, keys.map((key) => data[key]));
    return result.rows[0];
  }

  async update(id: string, data: Record<string, unknown>) {
    const keys = this.writable.filter((key) => key in data);
    const sets = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
    const result = await query<T>(`UPDATE ${this.table} SET ${sets} WHERE id = $${keys.length + 1} RETURNING ${this.selectFields}`, [...keys.map((key) => data[key]), id]);
    return result.rows[0] || null;
  }

  async delete(id: string) {
    const result = await query<T>(`DELETE FROM ${this.table} WHERE id = $1 RETURNING ${this.selectFields}`, [id]);
    return result.rows[0] || null;
  }
}
