import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db";

/** Identifiers are always internal constants; this guards against misuse. */
const IDENT = /^[a-z_][a-z0-9_]*$/;

function ident(name: string): string {
  if (!IDENT.test(name)) throw new Error(`Invalid SQL identifier: ${name}`);
  return `\`${name}\``;
}

type Scope = { column: string; value: string | number };

/**
 * Race-safe append: computes next sort_order inside the INSERT statement itself
 * (no separate COUNT/MAX round trip). If sortOrder is given it is used as-is.
 */
export async function insertOrdered(
  table: string,
  data: Record<string, unknown>,
  sortOrder: number | undefined,
  scope?: Scope
): Promise<number> {
  const cols = Object.keys(data);
  const t = ident(table);
  const colList = [...cols.map(ident), "`sort_order`"].join(", ");
  const valueList = cols.map((c) => `:${c}`).join(", ");
  const where = scope ? `WHERE ${ident(scope.column)} = :__scope` : "";

  const sql = `INSERT INTO ${t} (${colList})
    SELECT ${valueList}, COALESCE(:__sort, COALESCE(MAX(\`sort_order\`), -1) + 1)
    FROM ${t} ${where}`;

  const [result] = await getPool().query<ResultSetHeader>(sql, {
    ...data,
    __sort: sortOrder ?? null,
    ...(scope ? { __scope: scope.value } : {}),
  });
  return result.insertId;
}

/**
 * UPDATE only the provided (non-undefined) columns, so omitted fields
 * (including sort_order) keep their stored value.
 * Returns matched row count (mysql2 uses CLIENT_FOUND_ROWS by default).
 */
export async function updateById(
  table: string,
  id: number,
  data: Record<string, unknown>
): Promise<number> {
  const entries = Object.entries(data).filter(([, v]) => v !== undefined);
  if (entries.length === 0) {
    const [rows] = await getPool().query<RowDataPacket[]>(
      `SELECT id FROM ${ident(table)} WHERE id = :id`,
      { id }
    );
    return rows.length;
  }
  const set = entries.map(([c]) => `${ident(c)} = :${c}`).join(", ");
  const [result] = await getPool().query<ResultSetHeader>(
    `UPDATE ${ident(table)} SET ${set} WHERE id = :__id`,
    { ...Object.fromEntries(entries), __id: id }
  );
  return result.affectedRows;
}

export async function deleteById(table: string, id: number): Promise<number> {
  const [result] = await getPool().query<ResultSetHeader>(
    `DELETE FROM ${ident(table)} WHERE id = :id`,
    { id }
  );
  return result.affectedRows;
}

export async function readSettings(keys: string[]): Promise<Record<string, string>> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN (:keys)",
    { keys }
  );
  const map: Record<string, string> = {};
  for (const row of rows) map[row.setting_key as string] = row.setting_value as string;
  return map;
}

/** Atomic multi-row upsert (single statement). */
export async function upsertSettings(
  values: Record<string, string | undefined>
): Promise<void> {
  const entries = Object.entries(values).filter(
    (e): e is [string, string] => e[1] !== undefined
  );
  if (entries.length === 0) return;

  const params: Record<string, string> = {};
  const tuples = entries.map(([key, value], i) => {
    params[`k${i}`] = key;
    params[`v${i}`] = value;
    return `(:k${i}, :v${i})`;
  });

  await getPool().query(
    `INSERT INTO site_settings (setting_key, setting_value) VALUES ${tuples.join(", ")}
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    params
  );
}
