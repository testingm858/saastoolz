// ─── First-party analytics + invoice capture ──────────────────────────────────
// All writes here are best-effort: a tracking failure should never break the
// page/tool it's attached to, so every function swallows its own errors.

import prisma from "./prisma";

export interface RecordInvoiceInput {
  invoiceNumber: string;
  companyName: string;
  companyEmail?: string;
  companyVat?: string;
  customerName?: string;
  customerCompany?: string;
  customerEmail?: string;
  currency?: string;
  total?: number;
  userId?: string;
}

// Companies aren't accounts — they're deduplicated from whatever the issuer
// typed into the editor, keyed on name+email. A blank name falls back to a
// placeholder so every invoice still rolls up under *some* company row.
export async function recordInvoice(input: RecordInvoiceInput): Promise<void> {
  try {
    const name = input.companyName?.trim() || "Unknown Company";
    // Prisma's compound-unique `where` can't take `null` for a field that's
    // part of a `@@unique` (Postgres treats every NULL as distinct, so a
    // unique lookup on it is meaningless anyway) — normalize the dedupe key
    // to "" instead of null, and store that same "" so the upsert's `where`
    // keeps matching the row it just created.
    const email = input.companyEmail?.trim() || "";
    const vatNumber = input.companyVat?.trim() || null;

    const company = await prisma.company.upsert({
      where: { name_email: { name, email } },
      create: { name, email, vatNumber },
      update: vatNumber ? { vatNumber } : {},
    });

    await prisma.invoice.create({
      data: {
        invoiceNumber: input.invoiceNumber,
        companyId: company.id,
        customerName: input.customerName?.trim() || null,
        customerCompany: input.customerCompany?.trim() || null,
        customerEmail: input.customerEmail?.trim() || null,
        currency: input.currency || "USD",
        total: input.total,
        userId: input.userId,
      },
    });
  } catch {
    /* non-blocking */
  }
}

export async function recordPageView(input: { path: string; visitorId?: string | null; userId?: string | null; referrer?: string | null }): Promise<void> {
  try {
    await prisma.pageView.create({
      data: {
        path: input.path,
        visitorId: input.visitorId || null,
        userId: input.userId || null,
        referrer: input.referrer || null,
      },
    });
  } catch {
    /* non-blocking */
  }
}

export async function recordToolVisit(input: { toolId: string; visitorId?: string | null; userId?: string | null; durationMs?: number }): Promise<void> {
  try {
    await prisma.toolVisit.create({
      data: {
        toolId: input.toolId,
        visitorId: input.visitorId || null,
        userId: input.userId || null,
        durationMs: input.durationMs != null ? Math.max(0, Math.round(input.durationMs)) : null,
      },
    });
  } catch {
    /* non-blocking */
  }
}
