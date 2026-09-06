import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { recordInvoice } from "@/lib/analytics";

// Fired client-side by the Invoice Generator whenever a document is actually
// produced (print/PNG/PDF export) — captures who it was for and which
// company issued it, for the admin dashboard. The tool itself stays fully
// client-side (no invoice content ever touches the server).
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const invoiceNumber = typeof body.invoiceNumber === "string" ? body.invoiceNumber.trim() : "";
  const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";
  if (!invoiceNumber || !companyName) {
    return NextResponse.json({ error: "invoiceNumber and companyName are required" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  await recordInvoice({
    invoiceNumber,
    companyName,
    companyEmail: typeof body.companyEmail === "string" ? body.companyEmail : undefined,
    companyVat: typeof body.companyVat === "string" ? body.companyVat : undefined,
    customerName: typeof body.customerName === "string" ? body.customerName : undefined,
    customerCompany: typeof body.customerCompany === "string" ? body.customerCompany : undefined,
    customerEmail: typeof body.customerEmail === "string" ? body.customerEmail : undefined,
    currency: typeof body.currency === "string" ? body.currency : undefined,
    total: typeof body.total === "number" ? body.total : undefined,
    userId,
  });

  return NextResponse.json({ ok: true });
}
