"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Printer, Image as ImageIcon, FileDown, Loader2 } from "lucide-react";
import { CURRENCIES, calcTotals, defaultInvoice, type Invoice } from "@/lib/invoice";
import { TemplateCorporate } from "./InvoiceTemplates";
import InvoiceEditor from "./InvoiceEditor";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "saastoolz_invoice_draft";

export default function InvoiceGeneratorClient() {
  // Lazy-initialized on the client only (defaultInvoice() uses Date.now() /
  // Math.random()) — starting from null avoids an SSR/client hydration
  // mismatch on the invoice number and date shown in the preview.
  const [inv, setInv] = useState<Invoice | null>(null);
  const [exporting, setExporting] = useState<"png" | "pdf" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        setInv(JSON.parse(saved));
        return;
      }
    } catch {
      // ignore corrupt/unavailable storage, fall through to a fresh invoice
    }
    setInv(defaultInvoice());
  }, []);

  const update = useCallback((next: Invoice) => {
    setInv(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      } catch {
        // storage full/unavailable — draft simply won't persist
      }
    }, 800);
  }, []);

  // Fire-and-forget capture of who this invoice was for, for the admin
  // dashboard — the invoice content itself (line items, etc.) never leaves
  // the browser, only this metadata. Best-effort: never blocks the export.
  const reportGenerated = useCallback((invoice: Invoice) => {
    if (!invoice.company.name.trim()) return; // nothing meaningful to attribute this to
    const total = calcTotals(invoice.items).grand;
    fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceNumber: invoice.number,
        companyName: invoice.company.name,
        companyEmail: invoice.company.email,
        companyVat: invoice.company.taxNo,
        customerName: invoice.customer.name,
        customerCompany: invoice.customer.company,
        customerEmail: invoice.customer.email,
        currency: invoice.currency,
        total,
      }),
    }).catch(() => {
      /* non-blocking */
    });
  }, []);

  const handleExport = useCallback(async (type: "print" | "png" | "pdf") => {
    if (!inv) return;
    if (type === "print") {
      reportGenerated(inv);
      window.print();
      return;
    }
    const el = previewRef.current;
    if (!el) return;
    setError(null);
    setExporting(type);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });

      if (type === "png") {
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `${inv.number || "invoice"}.png`;
        a.click();
      } else {
        const { jsPDF } = await import("jspdf");
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 5;
        const printableWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * printableWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, printableWidth, imgHeight);
        pdf.save(`${inv.number || "invoice"}.pdf`);
      }
      reportGenerated(inv);
    } catch (err) {
      console.error(err);
      setError("Export failed. Please try again.");
    } finally {
      setExporting(null);
    }
  }, [inv, reportGenerated]);

  if (!inv) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 flex items-center justify-center text-gray-400 text-sm">
        Loading invoice editor…
      </div>
    );
  }

  const sym = CURRENCIES[inv.currency] || "$";

  return (
    <div>
      {/* Toolbar — same row above both columns (so the editor card and the
          preview card still start at the same top edge below it), but laid
          out on the content grid so the Live Preview indicator + export
          buttons sit horizontally over the preview column only */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <div />
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live Preview
          </div>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => handleExport("print")}
            className="flex items-center gap-1.5 text-sm text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-300"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            type="button"
            onClick={() => handleExport("png")}
            disabled={exporting !== null}
            className="flex items-center gap-1.5 text-sm text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-300 disabled:opacity-50"
          >
            {exporting === "png" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />} PNG
          </button>
          <button
            type="button"
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
            className={cn(
              "flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60",
              "bg-violet-600 hover:bg-violet-700"
            )}
          >
            {exporting === "pdf" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />} Export PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700 mb-4">{error}</div>
      )}

      {/* Editor + live preview — both columns start at the same top edge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <InvoiceEditor inv={inv} onChange={update} />

        <div className="lg:sticky lg:top-6">
          <div id="invoice-preview" ref={previewRef} className="rounded-2xl overflow-hidden shadow-xl shadow-gray-200/60 border border-gray-200">
            <TemplateCorporate inv={inv} sym={sym} />
          </div>
        </div>
      </div>
    </div>
  );
}
