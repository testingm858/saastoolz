// ─── Prisma client singleton ──────────────────────────────────────────────────
// Standard Next.js pattern: reuse one client across hot-reloads in dev so each
// edit doesn't open a fresh pool of database connections.
//
// Write guard: the app's DATABASE_URL points at the live Hostinger database,
// including on a developer machine. Anything running on localhost (any dev
// server, or a production build run locally against http://localhost) must be
// able to read the real data but must never change it, otherwise test traffic
// pollutes live analytics, counters and accounts. Only a deployment whose
// NEXT_PUBLIC_URL is the real site is allowed to write.

import { PrismaClient } from "@prisma/client";

function isLocalEnvironment(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  try {
    const host = new URL(process.env.NEXT_PUBLIC_URL ?? "").hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host.endsWith(".localhost");
  } catch {
    return false;
  }
}

const BLOCKED_OPERATIONS = new Set([
  "create", "createMany", "createManyAndReturn",
  "update", "updateMany", "updateManyAndReturn",
  "upsert", "delete", "deleteMany",
]);

function createClient(): PrismaClient {
  const base = new PrismaClient();
  if (!isLocalEnvironment()) return base;

  console.warn("[db-guard] Running on localhost: database writes are disabled, reads still use the live database.");

  // A blocked write resolves to an empty result instead of throwing, so pages
  // that bump a counter on view keep working locally.
  const guarded = base.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }) {
          if (!BLOCKED_OPERATIONS.has(operation)) return query(args);
          if (operation.endsWith("ManyAndReturn")) return [];
          if (operation.endsWith("Many")) return { count: 0 };
          return null;
        },
      },
      async $executeRaw() {
        return 0;
      },
      async $executeRawUnsafe() {
        return 0;
      },
    },
  });
  return guarded as unknown as PrismaClient;
}

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

const prisma = globalForPrisma.__prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.__prisma = prisma;

export default prisma;
