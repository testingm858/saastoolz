// Loads a backup made by export-neon-backup.mjs into the MySQL database that
// DATABASE_URL points at (Hostinger).
//
// Usage:  npm run db:import-mysql [-- --dir backups/<folder>] [--append | --replace]
//
// Prerequisite: the tables already exist (run `npx prisma db push` first).
// Safety: refuses to run if any target table already has rows, unless --append
// is passed (then existing ids are skipped, never overwritten). --replace empties
// every table first, for a final sync right before cutover: it makes MySQL an
// exact copy of the backup, so take a fresh `npm run db:backup` immediately
// before it. Row counts are verified against the manifest at the end.

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Parents before children so foreign keys are satisfied.
const IMPORT_ORDER = [
  ["users", "user"],
  ["accounts", "account"],
  ["sessions", "session"],
  ["verification_tokens", "verificationToken"],
  ["subscriptions", "subscription"],
  ["blog_posts", "blogPost"],
  ["announcements", "announcement"],
  ["ad_slots", "adSlot"],
  ["tool_stats", "toolStats"],
  ["tools", "tool"],
  ["companies", "company"],
  ["invoices", "invoice"],
  ["likes", "like"],
  ["jobs", "job"],
  ["page_views", "pageView"],
  ["tool_visits", "toolVisit"],
  ["tool_usages", "toolUsage"],
];

const BATCH_DEFAULT = 500;
const BATCH_OVERRIDES = { blog_posts: 5, ad_slots: 20 };

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

function parseArgs(argv) {
  const out = { append: false, replace: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dir") out.dir = argv[++i];
    else if (argv[i] === "--append") out.append = true;
    else if (argv[i] === "--replace") out.replace = true;
  }
  return out;
}

function latestBackupDir() {
  const base = path.join(ROOT, "backups");
  if (!fs.existsSync(base)) return null;
  const dirs = fs
    .readdirSync(base)
    .filter((d) => fs.existsSync(path.join(base, d, "manifest.json")))
    .sort();
  return dirs.length ? path.join(base, dirs[dirs.length - 1]) : null;
}

async function* readNdjson(file) {
  const rl = readline.createInterface({ input: fs.createReadStream(file, { encoding: "utf8" }), crlfDelay: Infinity });
  for await (const line of rl) if (line.trim()) yield JSON.parse(line);
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const url = process.env.DATABASE_URL ?? "";
  if (!url.startsWith("mysql://")) {
    console.error("DATABASE_URL must be a mysql:// URL (Hostinger). Current value is not MySQL — refusing to run.");
    process.exit(1);
  }

  const args = parseArgs(process.argv.slice(2));
  const dir = path.resolve(ROOT, args.dir ?? latestBackupDir() ?? "");
  const manifestPath = path.join(dir, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.error(`No manifest.json in ${dir}. Pass --dir backups/<folder>.`);
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const byTable = new Map(manifest.tables.map((t) => [t.table, t]));

  const host = new URL(url).hostname;
  console.log(`Target: ${host}${new URL(url).pathname}\nSource: ${dir} (exported ${manifest.exportedAt})\n`);

  if (args.append && args.replace) {
    console.error("Use either --append or --replace, not both.");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    if (args.replace) {
      console.log("--replace: emptying every table before loading (children first)...");
      for (const [, model] of [...IMPORT_ORDER].reverse()) await prisma[model].deleteMany();
    }

    // 1. Safety check: target must be empty unless --append.
    if (!args.append) {
      const nonEmpty = [];
      for (const [table, model] of IMPORT_ORDER) {
        const n = await prisma[model].count();
        if (n > 0) nonEmpty.push(`${table} (${n})`);
      }
      if (nonEmpty.length) {
        console.error(`Target is not empty: ${nonEmpty.join(", ")}.\nRe-run with --append to add missing rows without overwriting.`);
        process.exit(1);
      }
    }

    // 2. Load each table.
    for (const [table, model] of IMPORT_ORDER) {
      const info = byTable.get(table);
      const file = path.join(dir, `${table}.ndjson`);
      if (!info || !fs.existsSync(file)) {
        console.log(`  ${table.padEnd(22)} (not in backup, skipped)`);
        continue;
      }
      const dateCols = info.columns.filter((c) => c.type.startsWith("timestamp") || c.type === "date").map((c) => c.name);
      const batchSize = BATCH_OVERRIDES[table] ?? BATCH_DEFAULT;

      let batch = [];
      let loaded = 0;
      const flush = async () => {
        if (!batch.length) return;
        const res = await prisma[model].createMany({ data: batch, skipDuplicates: true });
        loaded += res.count;
        batch = [];
      };
      for await (const row of readNdjson(file)) {
        for (const col of dateCols) if (row[col] != null) row[col] = new Date(row[col]);
        batch.push(row);
        if (batch.length >= batchSize) await flush();
      }
      await flush();
      console.log(`  ${table.padEnd(22)} ${String(loaded).padStart(9)} / ${info.rows} rows loaded`);
    }

    // 3. Verify.
    console.log("\nVerifying row counts...");
    let ok = true;
    for (const [table, model] of IMPORT_ORDER) {
      const info = byTable.get(table);
      if (!info) continue;
      const n = await prisma[model].count();
      const match = n >= info.rows;
      if (!match) ok = false;
      console.log(`  ${table.padEnd(22)} backup ${String(info.rows).padStart(7)}  mysql ${String(n).padStart(7)}  ${match ? "OK" : "MISMATCH"}`);
    }
    console.log(ok ? "\nImport verified: all tables match the backup." : "\nImport finished WITH MISMATCHES — see above.");
    process.exitCode = ok ? 0 : 1;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("\nImport failed:", err?.message ?? err);
  process.exit(1);
});
