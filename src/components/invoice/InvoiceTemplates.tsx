// The Modern Corporate invoice template — renders a full, self-contained
// invoice document from an Invoice object. This is what gets captured to
// PDF/PNG, so every style is inline (no Tailwind) to keep html2canvas
// snapshots faithful regardless of the surrounding page's CSS.

import type { CSSProperties } from "react";
import { calcItem, calcTotals, fmt, STATUS_COLORS, type Invoice, type InvoiceItem } from "@/lib/invoice";

interface TemplateProps {
  inv: Invoice;
  sym: string;
}

function StatusBadge({ status }: { status: Invoice["status"] }) {
  const color = STATUS_COLORS[status] || "#6366f1";
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}44`, padding: "3px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px" }}>
      {status}
    </span>
  );
}

function BaseTable({ items, sym, accent, mutedColor, even = "transparent", border = "rgba(0,0,0,0.06)" }: {
  items: InvoiceItem[]; sym: string; accent: string; mutedColor: string; even?: string; border?: string;
}) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 10 }}>
      <thead>
        <tr style={{ background: accent + "18", borderBottom: `1.5px solid ${accent}44` }}>
          {["Item", "Qty", "Price", "Disc", "Tax", "Total"].map((h) => (
            <th key={h} style={{ padding: "9px 10px", textAlign: h === "Item" ? "left" : "right", color: accent, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.6px" }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={item.id} style={{ borderBottom: `1px solid ${border}`, background: i % 2 === 0 ? even : accent + "07" }}>
            <td style={{ padding: "9px 10px" }}>
              <div style={{ fontWeight: 600 }}>{item.name || "—"}</div>
              {item.desc && <div style={{ fontSize: 11, color: mutedColor, marginTop: 2 }}>{item.desc}</div>}
            </td>
            <td style={{ padding: "9px 10px", textAlign: "right", color: mutedColor }}>{item.qty}</td>
            <td style={{ padding: "9px 10px", textAlign: "right", color: mutedColor, fontFamily: "monospace" }}>{fmt(item.price, sym)}</td>
            <td style={{ padding: "9px 10px", textAlign: "right", color: mutedColor }}>{item.discount}%</td>
            <td style={{ padding: "9px 10px", textAlign: "right", color: mutedColor }}>{item.tax}%</td>
            <td style={{ padding: "9px 10px", textAlign: "right", fontWeight: 700, color: accent, fontFamily: "monospace" }}>{fmt(calcItem(item), sym)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CompanyTaxNo({ taxNo, style }: { taxNo: string; style?: CSSProperties }) {
  return taxNo ? <div style={{ fontSize: 11, marginTop: 3, ...style }}>Tax No: {taxNo}</div> : null;
}

function NotesBlock({ notes, style, label }: { notes: string; style?: CSSProperties; label?: React.ReactNode }) {
  if (!notes) return null;
  return (
    <div style={style}>
      {label ? <div style={{ marginBottom: 6, fontWeight: 700 }}>{label}</div> : null}
      <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "anywhere" }}>{notes}</div>
    </div>
  );
}

function Totals({ totals, sym, accent, mutedColor, borderColor }: {
  totals: ReturnType<typeof calcTotals>; sym: string; accent: string; mutedColor: string; borderColor?: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{ minWidth: 240, borderTop: `1.5px solid ${borderColor || accent + "44"}`, paddingTop: 12 }}>
        {([["Subtotal", totals.subtotal], ["Discount", -totals.discountTotal], ["Tax", totals.taxTotal]] as const).map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: mutedColor, marginBottom: 6 }}>
            <span>{l}</span><span style={{ fontFamily: "monospace" }}>{fmt(v, sym)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, color: accent, borderTop: `2px solid ${accent}`, paddingTop: 10, marginTop: 4 }}>
          <span>Total Due</span><span style={{ fontFamily: "monospace" }}>{fmt(totals.grand, sym)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── 1. MODERN CORPORATE ────────────────────────────────────────────────
export function TemplateCorporate({ inv, sym }: TemplateProps) {
  const totals = calcTotals(inv.items);
  const accent = "#6366f1";
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#ffffff", color: "#1e1b4b", padding: "40px 44px", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, paddingBottom: 10, borderBottom: `3px solid ${accent}` }}>
        <div>
          {inv.company.logo && <img src={inv.company.logo} alt="logo" style={{ height: 44, objectFit: "contain", marginBottom: 10 }} />}
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 26, fontWeight: 800, color: accent }}>{inv.company.name || "Your Company"}</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, lineHeight: 1.7 }}>
            {inv.company.address && <div>{inv.company.address}</div>}
            {inv.company.email && <div>{inv.company.email}</div>}
            {inv.company.phone && <div>{inv.company.phone}</div>}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 36, fontWeight: 900, color: accent, letterSpacing: "-2px" }}>INVOICE</div>
          <div style={{ fontFamily: "monospace", fontSize: 14, color: "#6b7280", marginTop: 4 }}>{inv.number}</div>
          <CompanyTaxNo taxNo={inv.company.taxNo} style={{ color: "#6b7280" }} />
          <div style={{ marginTop: 10 }}><StatusBadge status={inv.status} /></div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 30 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: accent, marginBottom: 8 }}>Bill To</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{inv.customer.name || "Customer Name"}</div>
          {inv.customer.company && <div style={{ color: "#6b7280", fontSize: 13 }}>{inv.customer.company}</div>}
          {inv.customer.address && <div style={{ color: "#6b7280", fontSize: 13 }}>{inv.customer.address}</div>}
          {inv.customer.email && <div style={{ color: "#6b7280", fontSize: 13 }}>{inv.customer.email}</div>}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: accent, marginBottom: 8 }}>Invoice Info</div>
          <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}><span style={{ color: "#9ca3af" }}>Date: </span>{inv.date || "—"}</div>
          <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}><span style={{ color: "#9ca3af" }}>Due: </span>{inv.due || "—"}</div>
          <div style={{ fontSize: 13, color: "#374151" }}><span style={{ color: "#9ca3af" }}>Currency: </span>{inv.currency}</div>
        </div>
      </div>
      <BaseTable items={inv.items} sym={sym} accent={accent} mutedColor="#9ca3af" even="transparent" border="#e5e7eb" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ position: "relative", width: 180 }}>
          {inv.company.signature && (
            <img src={inv.company.signature} alt="signature" style={{ position: "absolute", bottom: 12, left: 20, height: 70, opacity: 0.9, zIndex: 1, pointerEvents: "none", marginBottom: 30, marginLeft: 10 }} />
          )}
          <div style={{ width: 180, borderTop: "1px solid #ccc", paddingTop: 6, fontSize: 12, marginTop: 50 }}>Authorized Signature</div>
        </div>
        <Totals totals={totals} sym={sym} accent={accent} mutedColor="#9ca3af" />
      </div>
      <NotesBlock
        notes={inv.notes}
        label={<strong>Notes:</strong>}
        style={{ marginTop: 24, padding: "14px 16px", background: "#f9f9ff", border: `1px solid ${accent}22`, borderRadius: 10, fontSize: 12, color: "#6b7280", lineHeight: 1.7 }}
      />
    </div>
  );
}
