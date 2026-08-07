import { query } from "../database/pool";

export const writeAuditLog = async (input: {
  userId?: string;
  action: string;
  tableName: string;
  recordId?: string;
  ipAddress?: string;
}) => {
  await query(
    "INSERT INTO audit_logs (user_id, action, table_name, record_id, ip_address) VALUES ($1,$2,$3,$4,$5)",
    [input.userId || null, input.action, input.tableName, input.recordId || null, input.ipAddress || null],
  );
};

export const listAuditLogs = async (limit = 10) => {
  const result = await query(
    `SELECT a.*, u.fullname, u.email
     FROM audit_logs a
     LEFT JOIN users u ON u.id = a.user_id
     ORDER BY a.created_at DESC
     LIMIT $1`,
    [limit],
  );
  return result.rows;
};
