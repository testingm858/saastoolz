"use client";

import { useMemo, useState } from "react";
import { Copy, Check, Download, RotateCcw, Loader2, Info, Ban, Map, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressSimulation, ProcessingPanel } from "@/components/ProgressIndicator";

const PLACEHOLDER = `Block /admin and /login from search engines
Keep /cart and /checkout out of search results
Don't let anyone crawl /staging`;

// Phrases that mean "keep every crawler off the whole site" rather than a
// specific path — checked before path extraction so they don't also get
// read as literal paths.
const BLOCK_ALL_PATTERNS = [
  /block (the )?(whole|entire) site/i,
  /disallow (everything|all)/i,
  /don'?t (allow|let) (any\w* )?(crawl|index)/i,
  /no crawl(ing)? at all/i,
  /block everything/i,
];

interface ParsedIntent {
  blockEverything: boolean;
  paths: string[];
  sitemapFromText?: string;
}

// The one bit of "understand plain English" logic: read each line as either
// a site-wide block, a sitemap mention, or a list of /paths to keep out —
// exactly the shape generateRobotsTxt() on the server already expects
// (allowAll / disallowPaths / sitemapUrl), just built from prose instead of
// requiring the visitor to already know that shape.
function parseIntent(text: string): ParsedIntent {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  let blockEverything = false;
  let sitemapFromText: string | undefined;
  const paths = new Set<string>();

  for (const line of lines) {
    if (BLOCK_ALL_PATTERNS.some((re) => re.test(line))) {
      blockEverything = true;
      continue;
    }
    const sitemapMatch = line.match(/sitemap[^h]*?(https?:\/\/\S+)/i);
    if (sitemapMatch) {
      sitemapFromText = sitemapMatch[1].replace(/[.,;]+$/, "");
      continue;
    }
    const pathMatches = line.match(/\/[a-zA-Z0-9_\-/]*/g) ?? [];
    for (const raw of pathMatches) {
      const cleaned = raw.replace(/\/+$/, "") || "/";
      if (cleaned.length > 1) paths.add(cleaned);
    }
  }

  return { blockEverything, paths: Array.from(paths), sitemapFromText };
}

export default function RobotsTxtGeneratorClient() {
  const [instructions, setInstructions] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [generated, setGenerated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { progress, start, finish, reset: resetProgress } = useProgressSimulation();
  const [copied, setCopied] = useState(false);

  const intent = useMemo(() => parseIntent(instructions), [instructions]);
  const effectiveSitemap = sitemapUrl.trim() || intent.sitemapFromText;

  async function handleGenerate() {
    setLoading(true);
    setSuccess(false);
    setError(null);
    setGenerated(null);
    start(8, 90);

    const body = {
      allowAll: !intent.blockEverything,
      disallowPaths: intent.blockEverything ? ["/"] : intent.paths,
      sitemapUrl: effectiveSitemap || undefined,
    };

    try {
      const res = await fetch("/api/tools/robots-txt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: JSON.stringify(body) }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "premium_required") setError(`🔒 ${data.message}`);
        else if (data.error === "rate_limited") setError(`⏱️ ${data.message}`);
        else setError(data.error || data.result?.error || "Something went wrong");
        return;
      }

      setGenerated(data.result.text as string);
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
    setInstructions("");
    setSitemapUrl("");
    setGenerated(null);
    setError(null);
  }

  async function copyResult() {
    if (!generated) return;
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function downloadResult() {
    if (!generated) return;
    const blob = new Blob([generated], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasAnyIntent = intent.blockEverything || intent.paths.length > 0 || Boolean(effectiveSitemap);

  return (
    <div className="space-y-4">
      {/* ── Form ─────────────────────────────────────────────────────── */}
      <div className="min-w-0 bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-sm font-medium text-gray-600">Tell us what to keep out of search</span>
          <button onClick={handleReset} className="text-gray-400 hover:text-gray-600 transition-colors" title="Clear all">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1.5">
              What should search engines skip?
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={PLACEHOLDER}
              rows={5}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow resize-none"
            />
            <p className="flex items-start gap-1 text-xs text-gray-400 mt-1.5">
              <Info className="w-3 h-3 mt-0.5 shrink-0" />
              Write it like you&apos;re telling a person — one instruction per line, plain English. Leave it blank if you want the whole site crawlable.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1.5">Sitemap URL</label>
            <input
              type="text"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="https://example.com/sitemap.xml"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow"
            />
            <p className="flex items-start gap-1 text-xs text-gray-400 mt-1.5">
              <Info className="w-3 h-3 mt-0.5 shrink-0" />
              Optional, but it helps crawlers find every page faster. You can also just mention it above (&quot;Sitemap: https://...&quot;).
            </p>
          </div>

          {/* What we understood — a transparent, live translation of the prose above into the rules that will actually ship, so nothing is a surprise after generating. */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3.5">
            <p className="text-xs font-medium text-gray-500 mb-2">What we understood</p>
            {!hasAnyIntent ? (
              <div className="flex items-center gap-2 text-xs text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                Nothing blocked — the whole site stays crawlable.
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {intent.blockEverything ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-full">
                    <Ban className="w-3 h-3" /> Blocking the entire site from search engines
                  </span>
                ) : (
                  intent.paths.map((p) => (
                    <span key={p} className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full">
                      <Ban className="w-3 h-3" /> {p}
                    </span>
                  ))
                )}
                {effectiveSitemap && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-1 rounded-full max-w-full">
                    <Map className="w-3 h-3 shrink-0" /> <span className="truncate">{effectiveSitemap}</span>
                  </span>
                )}
              </div>
            )}
          </div>

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
              "Generate robots.txt"
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">{error}</div>
          )}
        </div>
      </div>

      {/* ── Progress (while generating) ──────────────────────────────── */}
      {loading && <ProcessingPanel progress={progress} phaseLabel="Generating robots.txt..." success={success} />}

      {/* ── Result (appears below, only once generated) ─────────────── */}
      {generated !== null && (
        <div className="min-w-0 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-medium text-gray-600">robots.txt</span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyResult}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={downloadResult}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Download className="w-3 h-3" />
                Download
              </button>
            </div>
          </div>
          <pre className="p-4 text-sm font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap">{generated}</pre>
          <p className="px-4 pb-4 text-xs text-gray-400">
            Upload this as <code className="font-mono">robots.txt</code> at the root of your domain (e.g. <code className="font-mono">example.com/robots.txt</code>).
          </p>
        </div>
      )}
    </div>
  );
}
