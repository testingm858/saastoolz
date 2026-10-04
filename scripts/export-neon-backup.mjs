// Full read-only backup of the Neon Postgres database.
//
// Usage:  npm run db:backup [-- --out backups/my-folder]
//
// Writes one NDJSON file per table (one JSON object per line), a manifest with
// row counts + SHA-256 checksums, and a copy of prisma/schema.prisma. Everything
// is read inside a single REPEATABLE READ / READ ONLY transaction, so the files
// form one consistent snapshot and nothing in the database is modified.
//
// The output contains emails and OAuth tokens — keep it private (backups/ is
// gitignored).

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import pg from "pg";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Tables holding large rows (base64 cover images, ad embed code) use small batches.
const BATCH_DEFAULT = 500;
const BATCH_OVERRIDES = { blog_posts: 20, ad_slots: 50, announcements: 100 };

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m || process.env[m[1]] !== undefined) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    process.env[m[1]] = v;
  }
}

const quoteIdent = (s) => `"${String(s).replace(/"/g, '""')}"`;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out") out.out = argv[++i];
  }
  return out;
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
}

async function writeTable(client, table, outDir) {
  const colsRes = await client.query(
    `SELECT column_name, data_type FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1 ORDER BY ordinal_position`,
    [table],
  );
  const pkRes = await client.query(
    `SELECT a.attname AS name
     FROM pg_index i
     JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
     WHERE i.indrelid = $1::regclass AND i.indisprimary
     ORDER BY array_position(i.indkey::int2[], a.attnum)`,
    [`public.${quoteIdent(table)}`],
  );
  const orderBy = pkRes.rows.length ? pkRes.rows.map((r) => quoteIdent(r.name)).join(", ") : "ctid";
  const batch = BATCH_OVERRIDES[table] ?? BATCH_DEFAULT;

  const file = path.join(outDir, `${table}.ndjson`);
  const stream = fs.createWriteStream(file, { encoding: "utf8" });
  const hash = crypto.createHash("sha256");
  let rows = 0;

  const write = async (chunk) => {
    hash.update(chunk);
    if (!stream.write(chunk)) await new Promise((r) => stream.once("drain", r));
  };

  for (let offset = 0; ; offset += batch) {
    const res = await client.query(
      `SELECT * FROM public.${quoteIdent(table)} ORDER BY ${orderBy} LIMIT ${batch} OFFSET ${offset}`,
    );
    if (res.rows.length === 0) break;
    await write(res.rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
    rows += res.rows.length;
    if (res.rows.length < batch) break;
  }

  await new Promise((resolve, reject) => {
    stream.on("error", reject);
    stream.end(resolve);
  });

  const countRes = await client.query(`SELECT count(*)::text AS n FROM public.${quoteIdent(table)}`);
  const expected = Number(countRes.rows[0].n);
  if (expected !== rows) {
    throw new Error(`Row count mismatch for ${table}: exported ${rows}, database reports ${expected}`);
  }

  return {
    table,
    rows,
    bytes: fs.statSync(file).size,
    sha256: hash.digest("hex"),
    primaryKey: pkRes.rows.map((r) => r.name),
    columns: colsRes.rows.map((c) => ({ name: c.column_name, type: c.data_type })),
  };
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const connectionString = [process.env.NEON_DATABASE_URL, process.env.DATABASE_URL_UNPOOLED, process.env.DATABASE_URL].find((u) =>
    u?.startsWith("postgres"),
  );
  if (!connectionString) {
    console.error("No Postgres URL found: set NEON_DATABASE_URL (or DATABASE_URL_UNPOOLED) in .env.local.");
    process.exit(1);
  }

  const args = parseArgs(process.argv.slice(2));
  const outDir = path.resolve(ROOT, args.out ?? path.join("backups", `neon-${timestamp()}`));
  fs.mkdirSync(outDir, { recursive: true });

  const host = new URL(connectionString).hostname;
  console.log(`Connecting to ${host} ...`);
  const client = new pg.Client({ connectionString, connectionTimeoutMillis: 30000 });
  await client.connect();

  const tableSummaries = [];
  try {
    await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");

    const tablesRes = await client.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name`,
    );
    const tables = tablesRes.rows.map((r) => r.table_name);
    console.log(`Found ${tables.length} tables. Exporting to ${outDir}\n`);

    for (const table of tables) {
      const summary = await writeTable(client, table, outDir);
      tableSummaries.push(summary);
      console.log(`  ${table.padEnd(22)} ${String(summary.rows).padStart(9)} rows  ${(summary.bytes / 1024).toFixed(1).padStart(10)} KB`);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    await client.end().catch(() => {});
  }

  const schemaSrc = path.join(ROOT, "prisma", "schema.prisma");
  if (fs.existsSync(schemaSrc)) fs.copyFileSync(schemaSrc, path.join(outDir, "schema.prisma"));

  const manifest = {
    exportedAt: new Date().toISOString(),
    sourceHost: host,
    format: "ndjson (one JSON object per line; timestamps as ISO-8601, bigint as string)",
    totalRows: tableSummaries.reduce((n, t) => n + t.rows, 0),
    tables: tableSummaries,
  };
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));

  console.log(`\nBackup complete: ${manifest.totalRows} rows across ${tableSummaries.length} tables.`);
  console.log(`Location: ${outDir}`);
}

main().catch((err) => {
  if (err?.code === "53000") {
    console.error("\nNeon refused the connection: the project/account has exceeded its plan quota (code 53000).");
    console.error("Raise the plan limit (or wait for the quota to reset), then re-run this script.");
  } else {
    console.error("\nBackup failed:", err?.message ?? err);
  }
  process.exit(1);
});
