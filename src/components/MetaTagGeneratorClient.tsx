"use client";

import { useState } from "react";
import { Copy, Check, Download, RotateCcw, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressSimulation, ProcessingPanel } from "@/components/ProgressIndicator";

interface FormState {
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonical: string;
  noindex: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  keywords: "",
  author: "",
  canonical: "",
  noindex: false,
};

// Google's displayed title/description lengths are pixel-width based, not a
// hard character count — these are the character ranges that map to "fits
// without truncating on a typical desktop SERP" in practice, which is the
// number people actually need while typing.
const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 158;

type LengthState = "empty" | "short" | "good" | "long";

function lengthState(len: number, min: number, max: number): LengthState {
  if (len === 0) return "empty";
  if (len > max) return "long";
  if (len < min) return "short";
  return "good";
}

const LENGTH_COPY: Record<LengthState, { label: string; className: string; barClassName: string }> = {
  empty: { label: "Not set", className: "text-gray-400", barClassName: "bg-gray-200" },
  short: { label: "Could be longer", className: "text-amber-600", barClassName: "bg-amber-400" },
  good: { label: "Good length", className: "text-emerald-600", barClassName: "bg-emerald-500" },
  long: { label: "May get truncated in search results", className: "text-red-600", barClassName: "bg-red-500" },
};

function LengthMeter({ length, min, max }: { length: number; min: number; max: number }) {
  const state = lengthState(length, min, max);
  const copy = LENGTH_COPY[state];
  const pct = Math.min(100, (length / max) * 100);
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="h-1 flex-1 max-w-[120px] bg-gray-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", copy.barClassName)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn("text-[11px] font-medium tabular-nums", copy.className)}>
        {length}/{max}
      </span>
      <span className={cn("text-[11px]", copy.className)}>{copy.label}</span>
    </div>
  );
}

function Field({
  label,
  helpText,
  required,
  children,
}: {
  label: string;
  helpText?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1.5">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helpText && (
        <p className="flex items-start gap-1 text-xs text-gray-400 mt-1.5">
          <Info className="w-3 h-3 mt-0.5 shrink-0" /> {helpText}
        </p>
      )}
    </div>
  );
}

const INPUT_CLASS =
  "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow";

// Each generated line is tagged by which field produced it, purely so the
// output list can color-code and label rows without re-parsing the HTML.
type TagLine = { key: string; html: string; tone: "primary" | "neutral" | "warning" };

function buildPreviewLines(form: FormState): TagLine[] {
  const lines: TagLine[] = [];
  if (form.title) lines.push({ key: "title", html: `<title>${form.title}</title>`, tone: "primary" });
  if (form.description)
    lines.push({ key: "description", html: `<meta name="description" content="${form.description}">`, tone: "primary" });
  if (form.keywords)
    lines.push({ key: "keywords", html: `<meta name="keywords" content="${form.keywords}">`, tone: "neutral" });
  if (form.author)
    lines.push({ key: "author", html: `<meta name="author" content="${form.author}">`, tone: "neutral" });
  if (form.canonical)
    lines.push({ key: "canonical", html: `<link rel="canonical" href="${form.canonical}">`, tone: "primary" });
  if (form.noindex)
    lines.push({ key: "noindex", html: `<meta name="robots" content="noindex,nofollow">`, tone: "warning" });
  lines.push({ key: "viewport", html: `<meta name="viewport" content="width=device-width, initial-scale=1">`, tone: "neutral" });
  lines.push({ key: "charset", html: `<meta charset="UTF-8">`, tone: "neutral" });
  return lines;
}

const TONE_DOT: Record<TagLine["tone"], string> = {
  primary: "bg-violet-500",
  neutral: "bg-gray-300",
  warning: "bg-amber-500",
};

export default function MetaTagGeneratorClient() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [generated, setGenerated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { progress, start, finish, reset: resetProgress } = useProgressSimulation();
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedLine, setCopiedLine] = useState<string | null>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setGenerated(null);
  }

  const previewLines = buildPreviewLines(form);

  async function handleGenerate() {
    if (!form.title.trim()) {
      setError('"Page title" is required');
      return;
    }
    setLoading(true);
    setSuccess(false);
    setError(null);
    setGenerated(null);
    start(8, 90);

    try {
      const res = await fetch("/api/tools/meta-tag-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: JSON.stringify(form) }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "premium_required") setError(`🔒 ${data.message}`);
        else if (data.error === "rate_limited") setError(`⏱️ ${data.message}`);
        else setError(data.error || data.result?.error || "Something went wrong");
        return;
      }

      setGenerated(data.result.html as string);
      finish();
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 550));
    } catch {
      setError("Network error — please try again");
    } finally {
      resetProgress();
      setLoading(false);
    }
  }

  function handleReset() {
    setForm(EMPTY_FORM);
    setGenerated(null);
    setError(null);
  }

  async function copyAll() {
    if (!generated) return;
    await navigator.clipboard.writeText(generated);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1800);
  }

  async function copyLine(key: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedLine(key);
    setTimeout(() => setCopiedLine((k) => (k === key ? null : k)), 1400);
  }

  function downloadAll() {
    if (!generated) return;
    const blob = new Blob([generated], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meta-tags.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  const generatedLines = generated ? generated.split("\n") : null;

  return (
    <div className="space-y-4">
      {/* ── Form ─────────────────────────────────────────────────────── */}
      <div className="min-w-0 bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-sm font-medium text-gray-600">Page details</span>
          <button onClick={handleReset} className="text-gray-400 hover:text-gray-600 transition-colors" title="Clear all">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <Field label="Page title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="Free Invoice Generator — Create Invoices Online"
              className={INPUT_CLASS}
            />
            <LengthMeter length={form.title.length} min={TITLE_MIN} max={TITLE_MAX} />
          </Field>

          <Field label="Meta description">
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Create a professional invoice online in seconds. No signup, no watermark — just fill in your details and download a client-ready PDF."
              rows={3}
              className={cn(INPUT_CLASS, "resize-none")}
            />
            <LengthMeter length={form.description.length} min={DESC_MIN} max={DESC_MAX} />
          </Field>

          <Field label="Keywords" helpText="Ignored by Google's own ranking today, but still read by some smaller search engines and internal site search — harmless to fill in, never essential.">
            <input
              type="text"
              value={form.keywords}
              onChange={(e) => setField("keywords", e.target.value)}
              placeholder="invoice generator, free invoice, invoice template"
              className={INPUT_CLASS}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Author">
              <input
                type="text"
                value={form.author}
                onChange={(e) => setField("author", e.target.value)}
                placeholder="Your name or company"
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Canonical URL" helpText="The one true address for this page — set it whenever the same content is reachable at more than one URL, so search engines don't split ranking signals between them.">
              <input
                type="text"
                value={form.canonical}
                onChange={(e) => setField("canonical", e.target.value)}
                placeholder="https://example.com/page"
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 cursor-pointer">
            <span className="relative inline-flex items-center shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={form.noindex}
                onChange={(e) => setField("noindex", e.target.checked)}
                className="peer sr-only"
              />
              <span className="w-9 h-5 rounded-full bg-gray-300 peer-checked:bg-amber-500 transition-colors" />
              <span className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </span>
            <span className="text-xs text-gray-600">
              <span className="font-medium text-gray-800">Hide from search engines (noindex)</span>
              <br />
              Only turn this on for pages you don&apos;t want showing up in search — admin screens, thank-you pages, drafts.
            </span>
          </label>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={cn(
              "w-full py-3 px-6 rounded-xl font-semibold text-white transition-all",
              "bg-violet-600 hover:bg-violet-700 active:scale-[.99]",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              "Generate meta tags"
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">{error}</div>
          )}
        </div>
      </div>

      {/* ── Progress (while generating) ──────────────────────────────── */}
      {loading && <ProcessingPanel progress={progress} phaseLabel="Generating tags..." success={success} />}

      {/* ── Result (appears below, only once generated) ─────────────── */}
      {generatedLines && (
        <div className="min-w-0 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-medium text-gray-600">Generated tags</span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyAll}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                {copiedAll ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedAll ? "Copied!" : "Copy all"}
              </button>
              <button
                onClick={downloadAll}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Download className="w-3 h-3" />
                Download
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {generatedLines.map((line, i) => {
              const meta = previewLines[i];
              return (
                <div key={i} className="group flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", meta ? TONE_DOT[meta.tone] : "bg-gray-300")} />
                  <code className="min-w-0 flex-1 text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre">{line}</code>
                  <button
                    onClick={() => copyLine(String(i), line)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 transition-opacity shrink-0"
                    title="Copy this line"
                  >
                    {copiedLine === String(i) ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
