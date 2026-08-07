import { query } from "../database/pool";
import { AppError } from "../utils/errors";

export const setCurrentSession = async (id: string) => {
  await query("BEGIN");
  try {
    await query("UPDATE academic_sessions SET is_current = FALSE WHERE is_current = TRUE");
    const result = await query("UPDATE academic_sessions SET is_current = TRUE, status = 'active' WHERE id = $1 RETURNING *", [id]);
    if (!result.rows[0]) throw new AppError("Academic session not found", 404);
    await query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
};

export const assertNoTermOverlap = async (sessionId: string, startDate: string, endDate: string, ignoreId?: string) => {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*) FROM terms
     WHERE session_id = $1
     AND ($4::uuid IS NULL OR id <> $4::uuid)
     AND daterange(start_date, end_date, '[]') && daterange($2::date, $3::date, '[]')`,
    [sessionId, startDate, endDate, ignoreId || null],
  );
  if (Number(result.rows[0].count) > 0) throw new AppError("Term dates overlap an existing term", 409);
};

export const setActiveTerm = async (id: string) => {
  await query("BEGIN");
  try {
    await query("UPDATE terms SET status = 'inactive' WHERE status = 'active'");
    const result = await query("UPDATE terms SET status = 'active' WHERE id = $1 RETURNING *", [id]);
    if (!result.rows[0]) throw new AppError("Term not found", 404);
    await query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
};

export const getSchoolInformation = async () => {
  const result = await query("SELECT * FROM school_information LIMIT 1");
  return result.rows[0] || null;
};

export const updateSchoolInformation = async (data: Record<string, unknown>) => {
  const keys = Object.keys(data);
  const sets = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
  const result = await query(`UPDATE school_information SET ${sets} WHERE id = '00000000-0000-0000-0000-000000000001' RETURNING *`, keys.map((key) => data[key]));
  return result.rows[0];
};
