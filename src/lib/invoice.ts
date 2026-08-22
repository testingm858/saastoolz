// Shared types, defaults, and math for the Invoice Generator tool. Kept
// separate from the UI components so the templates and editor can both
// import the same invoice shape and calculations.

export interface InvoiceItem {
  id: string;
  name: string;
  desc: string;
  qty: number;
  price: number;
  discount: number; // percent
  tax: number; // percent
}

export interface InvoiceCompany {
  name: string;
  logo: string; // data URL or remote URL
  address: string;
  email: string;
  phone: string;
  website: string;
  taxNo: string;
  signature: string; // data URL or remote URL
}

export interface InvoiceCustomer {
  name: string;
  company: string;
  address: string;
  email: string;
  phone: string;
}

export type InvoiceStatus = "Draft" | "Pending" | "Paid" | "Overdue";

export interface Invoice {
  id: string;
  number: string;
  date: string;
  due: string;
  status: InvoiceStatus;
  currency: string;
  company: InvoiceCompany;
  customer: InvoiceCustomer;
  items: InvoiceItem[];
  notes: string;
}

export const CURRENCIES: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  CHF: "CHF",
  CAD: "$",
  AUD: "$",
  NZD: "$",
  HKD: "$",
  SGD: "$",
  INR: "₹",
  PKR: "₨",
  BDT: "৳",
  LKR: "₨",
  NPR: "₨",
  AED: "د.إ",
  SAR: "﷼",
  QAR: "﷼",
  KWD: "د.ك",
  BHD: ".د.ب",
  OMR: "﷼",
  JOD: "د.ا",
  ILS: "₪",
  TRY: "₺",
  EGP: "£",
  ZAR: "R",
  NGN: "₦",
  KES: "KSh",
  GHS: "₵",
  BRL: "R$",
  MXN: "$",
  ARS: "$",
  CLP: "$",
  COP: "$",
  RUB: "₽",
  UAH: "₴",
  PLN: "zł",
  CZK: "Kč",
  HUF: "Ft",
  RON: "lei",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  KRW: "₩",
  THB: "฿",
  MYR: "RM",
  IDR: "Rp",
  PHP: "₱",
  VND: "₫",
};

export const STATUSES: InvoiceStatus[] = ["Draft", "Pending", "Paid", "Overdue"];
export const STATUS_COLORS: Record<InvoiceStatus, string> = {
  Draft: "#6366f1",
  Pending: "#f59e0b",
  Paid: "#10b981",
  Overdue: "#ef4444",
};

export const genId = (): string => Math.random().toString(36).slice(2, 11);
export const genInvoiceNumber = (): string => "INV-" + Date.now().toString(36).toUpperCase().slice(-6);

export const defaultItem = (): InvoiceItem => ({
  id: genId(),
  name: "",
  desc: "",
  qty: 1,
  price: 0,
  discount: 0,
  tax: 0,
});

export const defaultInvoice = (): Invoice => ({
  id: genId(),
  number: genInvoiceNumber(),
  date: new Date().toISOString().split("T")[0],
  due: "",
  status: "Draft",
  currency: "USD",
  company: { name: "", logo: "", address: "", email: "", phone: "", website: "", taxNo: "", signature: "" },
  customer: { name: "", company: "", address: "", email: "", phone: "" },
  items: [defaultItem()],
  notes: "",
});

export const calcItem = (item: InvoiceItem): number => {
  const sub = item.qty * item.price;
  const disc = sub * (item.discount / 100);
  const tax = (sub - disc) * (item.tax / 100);
  return sub - disc + tax;
};

export interface InvoiceTotals {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grand: number;
}

export const calcTotals = (items: InvoiceItem[]): InvoiceTotals => {
  let subtotal = 0, discountTotal = 0, taxTotal = 0;
  for (const i of items) {
    const sub = i.qty * i.price;
    const disc = sub * (i.discount / 100);
    const tax = (sub - disc) * (i.tax / 100);
    subtotal += sub;
    discountTotal += disc;
    taxTotal += tax;
  }
  return { subtotal, discountTotal, taxTotal, grand: subtotal - discountTotal + taxTotal };
};

export const fmt = (v: number, sym = "$"): string =>
  (v < 0 ? "-" : "") + sym + Math.abs(v).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
