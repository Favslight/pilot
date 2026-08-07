import { query } from "../database/pool";
import { AppError } from "../utils/errors";

export const listRoles = async () => {
  const result = await query(
    `SELECT r.*,
      COUNT(DISTINCT u.id) FILTER (WHERE u.deleted_at IS NULL) AS users_count,
      COUNT(DISTINCT rp.permission_id) AS permissions_count
     FROM roles r
     LEFT JOIN users u ON u.role = r.id
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     GROUP BY r.id
     ORDER BY r.created_at ASC`,
  );
  return result.rows;
};

export const assignRolePermissions = async (roleId: string, permissionIds: string[]) => {
  await query("BEGIN");
  try {
    await query("DELETE FROM role_permissions WHERE role_id = $1", [roleId]);
    for (const permissionId of permissionIds) {
      await query("INSERT INTO role_permissions (role_id, permission_id) VALUES ($1,$2) ON CONFLICT DO NOTHING", [roleId, permissionId]);
    }
    await query("COMMIT");
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
};

export const getRolePermissions = async (roleId: string) => {
  const result = await query("SELECT p.* FROM permissions p JOIN role_permissions rp ON rp.permission_id = p.id WHERE rp.role_id = $1 ORDER BY p.module, p.name", [roleId]);
  return result.rows;
};

export const duplicateRole = async (roleId: string) => {
  const original = await query("SELECT * FROM roles WHERE id = $1", [roleId]);
  if (!original.rows[0]) throw new AppError("Role not found", 404);
  const copy = await query("INSERT INTO roles (name, description) VALUES ($1,$2) RETURNING *", [`${original.rows[0].name} Copy`, original.rows[0].description]);
  await query("INSERT INTO role_permissions (role_id, permission_id) SELECT $1, permission_id FROM role_permissions WHERE role_id = $2", [copy.rows[0].id, roleId]);
  return copy.rows[0];
};

export const ensureRoleCanDelete = async (roleId: string) => {
  const role = await query<{ is_system: boolean }>("SELECT is_system FROM roles WHERE id = $1", [roleId]);
  if (!role.rows[0]) throw new AppError("Role not found", 404);
  if (role.rows[0].is_system) throw new AppError("System roles cannot be deleted", 409);
  const users = await query<{ count: string }>("SELECT COUNT(*) FROM users WHERE role = $1 AND deleted_at IS NULL", [roleId]);
  if (Number(users.rows[0].count) > 0) throw new AppError("Cannot delete a role assigned to users", 409);
};
