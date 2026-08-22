"use client";

import { useRef, useState } from "react";
import { Plus, Copy, X, Upload, ChevronDown } from "lucide-react";
import {
  CURRENCIES, STATUSES, calcItem, fmt, defaultItem, genId,
  type Invoice, type InvoiceItem,
} from "@/lib/invoice";
import { cn } from "@/lib/utils";

const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400 bg-white";
const labelClass = "block text-xs font-medium text-gray-500 mb-1";

function Field({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
    </div>
  );
}

function ImageField({ label, value, onChange, urlPlaceholder }: {
  label: string; value: string; onChange: (v: string) => void; urlPlaceholder: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isLocal = value.startsWith("data:");

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="text"
        value={isLocal ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isLocal ? "Local file in use — paste a URL to replace it" : urlPlaceholder}
        className={inputClass}
      />
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:border-gray-300">
          <Upload className="w-3 h-3" /> Choose file
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-red-600 bg-red-50 border border-red-100 px-2.5 py-1.5 rounded-lg hover:bg-red-100">
            Clear
          </button>
        )}
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt={`${label} preview`} className="h-10 mt-2 rounded border border-gray-200 bg-gray-50 object-contain p-1" />
      )}
    </div>
  );
}

function ItemRow({ item, sym, onChange, onDelete, onDuplicate }: {
  item: InvoiceItem; sym: string; onChange: (i: InvoiceItem) => void; onDelete: () => void; onDuplicate: () => void;
}) {
  const total = calcItem(item);
  const ch = <K extends keyof InvoiceItem>(field: K, val: InvoiceItem[K]) => onChange({ ...item, [field]: val });

  return (
    <tr className="border-b border-gray-100">
      <td className="p-1.5">
        <input value={item.name} onChange={(e) => ch("name", e.target.value)} placeholder="Item name" className={cn(inputClass, "min-w-[90px]")} />
      </td>
      <td className="p-1.5">
        <input value={item.desc} onChange={(e) => ch("desc", e.target.value)} placeholder="Description" className={cn(inputClass, "min-w-[90px]")} />
      </td>
      <td className="p-1.5 w-16">
        <input type="number" min={0} value={item.qty} onChange={(e) => ch("qty", +e.target.value)} className={cn(inputClass, "text-center")} />
      </td>
      <td className="p-1.5 w-20">
        <input type="number" min={0} step="0.01" value={item.price} onChange={(e) => ch("price", +e.target.value)} className={cn(inputClass, "font-mono")} />
      </td>
      <td className="p-1.5 w-16">
        <input type="number" min={0} max={100} value={item.discount} onChange={(e) => ch("discount", +e.target.value)} className={cn(inputClass, "text-center")} />
      </td>
      <td className="p-1.5 w-16">
        <input type="number" min={0} max={100} value={item.tax} onChange={(e) => ch("tax", +e.target.value)} className={cn(inputClass, "text-center")} />
      </td>
      <td className="p-1.5 w-24 font-mono text-sm font-semibold text-violet-700 whitespace-nowrap">{fmt(total, sym)}</td>
      <td className="p-1.5 w-16">
        <div className="flex gap-1">
          <button type="button" onClick={onDuplicate} title="Duplicate" className="w-7 h-7 flex items-center justify-center bg-gray-50 text-gray-500 border border-gray-200 rounded-lg hover:border-gray-300">
            <Copy className="w-3 h-3" />
          </button>
          <button type="button" onClick={onDelete} title="Delete" className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 border border-red-100 rounded-lg hover:bg-red-100">
            <X className="w-3 h-3" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function Section({ title, icon, children, open, onToggle }: {
  title: string; icon: string; children: React.ReactNode;
  open?: boolean; onToggle?: () => void;
}) {
  const collapsible = onToggle !== undefined;
  const isOpen = collapsible ? open : true;
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">{title}</span>
        </div>
        {collapsible && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-label={isOpen ? `Collapse ${title}` : `Expand ${title}`}
            className="w-7 h-7 flex items-center justify-center bg-gray-50 text-gray-500 border border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-700 transition-colors"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform", !isOpen && "-rotate-90")} />
          </button>
        )}
      </div>
      {isOpen && children}
    </div>
  );
}

export default function InvoiceEditor({ inv, onChange }: { inv: Invoice; onChange: (inv: Invoice) => void }) {
  const [companyOpen, setCompanyOpen] = useState(true);
  const [customerOpen, setCustomerOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const sym = CURRENCIES[inv.currency] || "$";

  const set = <K extends keyof Invoice>(key: K, val: Invoice[K]) => onChange({ ...inv, [key]: val });
  const setCompany = <K extends keyof Invoice["company"]>(key: K, val: Invoice["company"][K]) =>
    onChange({ ...inv, company: { ...inv.company, [key]: val } });
  const setCustomer = <K extends keyof Invoice["customer"]>(key: K, val: Invoice["customer"][K]) =>
    onChange({ ...inv, customer: { ...inv.customer, [key]: val } });

  const setItem = (id: string, item: InvoiceItem) => onChange({ ...inv, items: inv.items.map((i) => (i.id === id ? item : i)) });
  const addItem = () => onChange({ ...inv, items: [...inv.items, defaultItem()] });
  const delItem = (id: string) => onChange({ ...inv, items: inv.items.filter((i) => i.id !== id) });
  const dupItem = (id: string) => {
    const idx = inv.items.findIndex((i) => i.id === id);
    const copy = { ...inv.items[idx], id: genId() };
    const next = [...inv.items];
    next.splice(idx + 1, 0, copy);
    onChange({ ...inv, items: next });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
      <Section title="Company" icon="🏢" open={companyOpen} onToggle={() => setCompanyOpen((o) => !o)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Company Name" value={inv.company.name} onChange={(v) => setCompany("name", v)} placeholder="Company Name" />
          <Field label="Tax / VAT Number" value={inv.company.taxNo} onChange={(v) => setCompany("taxNo", v)} placeholder="TAX-123" />
          <Field label="Email" value={inv.company.email} onChange={(v) => setCompany("email", v)} type="email" placeholder="billing@company.com" />
          <Field label="Phone" value={inv.company.phone} onChange={(v) => setCompany("phone", v)} type="tel" placeholder="+1 555 000 0000" />
          <Field label="Website" value={inv.company.website} onChange={(v) => setCompany("website", v)} type="url" placeholder="https://company.com" />
          <Field label="Address" value={inv.company.address} onChange={(v) => setCompany("address", v)} placeholder="123 Main St, City, Country" />
          <ImageField label="Company Logo" value={inv.company.logo} onChange={(v) => setCompany("logo", v)} urlPlaceholder="https://yourlogo.com/logo.png" />
          <ImageField label="Authorized Signature" value={inv.company.signature} onChange={(v) => setCompany("signature", v)} urlPlaceholder="https://example.com/signature.png" />
        </div>
      </Section>

      <Section title="Customer" icon="👤" open={customerOpen} onToggle={() => setCustomerOpen((o) => !o)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Customer Name" value={inv.customer.name} onChange={(v) => setCustomer("name", v)} placeholder="Jane Smith" />
          <Field label="Company" value={inv.customer.company} onChange={(v) => setCustomer("company", v)} placeholder="Customer Corp" />
          <Field label="Email" value={inv.customer.email} onChange={(v) => setCustomer("email", v)} type="email" placeholder="jane@customer.com" />
          <Field label="Phone" value={inv.customer.phone} onChange={(v) => setCustomer("phone", v)} type="tel" placeholder="+1 555 000 0001" />
          <div className="sm:col-span-2">
            <Field label="Address" value={inv.customer.address} onChange={(v) => setCustomer("address", v)} placeholder="456 Client Ave, City, Country" />
          </div>
        </div>
      </Section>

      <Section title="Invoice Details" icon="📋" open={detailsOpen} onToggle={() => setDetailsOpen((o) => !o)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Invoice Number</label>
            <input value={inv.number} onChange={(e) => set("number", e.target.value)} className={cn(inputClass, "font-mono font-semibold text-violet-700")} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={inv.status} onChange={(e) => set("status", e.target.value as Invoice["status"])} className={inputClass}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Invoice Date</label>
            <input type="date" value={inv.date} onChange={(e) => set("date", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Due Date</label>
            <input type="date" value={inv.due} onChange={(e) => set("due", e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Currency</label>
            <select value={inv.currency} onChange={(e) => set("currency", e.target.value)} className={cn(inputClass, "sm:w-1/2")}>
              {Object.keys(CURRENCIES).map((c) => <option key={c} value={c}>{c} ({CURRENCIES[c]})</option>)}
            </select>
          </div>
        </div>
      </Section>

      <Section title="Invoice Items" icon="📦">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full border-collapse text-xs min-w-[640px]">
            <thead>
              <tr className="border-b-2 border-gray-200">
                {["Item", "Description", "Qty", "Price", "Disc%", "Tax%", "Total", ""].map((h) => (
                  <th key={h} className="px-1.5 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inv.items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  sym={sym}
                  onChange={(it) => setItem(item.id, it)}
                  onDelete={() => delItem(item.id)}
                  onDuplicate={() => dupItem(item.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 w-full py-2.5 flex items-center justify-center gap-1.5 text-sm text-violet-600 border-2 border-dashed border-violet-300 rounded-xl hover:bg-violet-50"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </Section>

      <Section title="Notes" icon="📝">
        <textarea
          value={inv.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Payment terms, additional notes, bank details..."
          rows={4}
          className={cn(inputClass, "resize-none")}
        />
      </Section>
    </div>
  );
}
