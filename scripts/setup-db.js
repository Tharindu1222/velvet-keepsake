#!/usr/bin/env node
/**
 * Applies scripts/schema.sql using MYSQL_* from .env.local / process.env
 * Usage: npm run db:setup
 */
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  loadEnvFile(path.join(process.cwd(), ".env.local"));
  loadEnvFile(path.join(process.cwd(), ".env"));

  const sqlPath = path.join(process.cwd(), "scripts", "schema.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    multipleStatements: true,
  });

  await connection.query(sql);
  await connection.end();
  console.log("✓ MySQL schema applied (velvet_keepsake)");
}

main().catch((err) => {
  console.error("MySQL setup failed:", err.message);
  process.exit(1);
});
