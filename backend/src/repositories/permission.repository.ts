import { query } from "../database/pool";

export const userHasPermission = async (userId: string, permission: string) => {
  const result = await query<{ exists: boolean }>(
    `SELECT EXISTS (
      SELECT 1 FROM users u
      JOIN role_permissions rp ON rp.role_id = u.role
      JOIN permissions p ON p.id = rp.permission_id
      WHERE u.id = $1 AND p.name = $2 AND u.deleted_at IS NULL
    )`,
    [userId, permission],
  );
  return result.rows[0]?.exists || false;
};

export const listPermissions = async () => {
  const result = await query("SELECT * FROM permissions ORDER BY module ASC, name ASC");
  return result.rows;
};
