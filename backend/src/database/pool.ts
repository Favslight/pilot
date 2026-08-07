import pg, { QueryResultRow } from "pg";
import { env } from "../config/env";

export const pool = new pg.Pool({ connectionString: env.databaseUrl });

export const query = <T extends QueryResultRow>(text: string, params: unknown[] = []) => pool.query<T>(text, params);
