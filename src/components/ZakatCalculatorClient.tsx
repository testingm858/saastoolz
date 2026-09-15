"use client";

import { useId, useState } from "react";
import { Loader2, RotateCcw, Wallet, Gem, TrendingUp, Building2, HandCoins, MinusCircle, Landmark, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressSimulation, ProcessingPanel } from "@/components/ProgressIndicator";

interface ZakatResult {
  totalAssets: number;
  netWealth: number;
  nisabThreshold: number;
  eligible: boolean;
  ratePct: number;
  zakatDue: number;
}

const ASSET_FIELDS: { key: keyof typeof EMPTY_FORM; label: string; icon: LucideIcon; help?: string }[] = [
  { key: "cash", label: "Cash & bank balances", icon: Wallet },
  { key: "goldSilverValue", label: "Gold & silver value", icon: Gem },
  { key: "investments", label: "Investments", icon: TrendingUp },
  { key: "businessAssets", label: "Business assets", icon: Building2 },
  { key: "receivables", label: "Money owed to you", icon: HandCoins },
];

const EMPTY_FORM = { cash: "", goldSilverValue: "", investments: "", businessAssets: "", receivables: "", debts: "", nisabThreshold: "" };

// A gradient progress ring (matching the site's other calculators) showing
// net wealth relative to 2x the Nisab threshold — capped visually at 100%
// so a very large net wealth still just reads as "well above the line"
// rather than needing an arbitrary bigger scale.
function WealthRing({ progressPct, zakatDue, eligible, hasResult }: { progressPct: number; zakatDue: number; eligible: boolean; hasResult: boolean }) {
  const gradId = useId();
  const size = 168;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clamped = Math.min(100, Math.max(0, progressPct));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" className="text-gray-100" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.34, 1.2, 0.64, 1)" }}
        />
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={eligible ? "#059669" : "#7c3aed"} />
            <stop offset="100%" stopColor={eligible ? "#10b981" : "#d946ef"} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
        <span className="text-2xl font-bold text-gray-900 font-mono tabular-nums leading-none text-center">
          {hasResult ? zakatDue.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
        </span>
        <span className="text-[9px] uppercase tracking-widest text-gray-400 mt-1.5 text-center">
          {hasResult ? (eligible ? "zakat due" : "below nisab") : "awaiting input"}
        </span>
      </div>
    </div>
  );
}

function StatTile({ label, value, icon: Icon }: { label: string; value: string; icon?: LucideIcon }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
      <p className="flex items-center gap-1 text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">
        {Icon && <Icon className="w-3 h-3 shrink-0" />}
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function ZakatCalculatorClient() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [result, setResult] = useState<ZakatResult | null>(null);
  const [ringProgress, setRingProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { progress, start, finish, reset: resetProgress } = useProgressSimulation();

  function setField(key: keyof typeof EMPTY_FORM, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleCalculate() {
    const nisab = Number(form.nisabThreshold);
    if (!form.nisabThreshold || !Number.isFinite(nisab) || nisab <= 0) {
      setError("Enter your local Nisab threshold to check eligibility");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);
    setRingProgress(0); // ring re-fills from empty on every press
    start(10, 90);

    try {
      const body = {
        cash: Number(form.cash) || 0,
        goldSilverValue: Number(form.goldSilverValue) || 0,
        investments: Number(form.investments) || 0,
        businessAssets: Number(form.businessAssets) || 0,
        receivables: Number(form.receivables) || 0,
        debts: Number(form.debts) || 0,
        nisabThreshold: nisab,
      };
      const res = await fetch("/api/tools/zakat-calculator", {
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

      const zakatResult = data.result as ZakatResult;
      setResult(zakatResult);
      const target = zakatResult.nisabThreshold > 0 ? (zakatResult.netWealth / (zakatResult.nisabThreshold * 2)) * 100 : 0;
      setRingProgress(target);
      finish();
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 450));
    } catch {
      setError("Network error — please try again");
    } finally {
      resetProgress();
      setLoading(false);
    }
  }

  function handleClear() {
    setForm(EMPTY_FORM);
    setResult(null);
    setRingProgress(0);
    setError(null);
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 items-start">
      {/* ── Form ─────────────────────────────────────────────────────── */}
      <div className="min-w-0 bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-sm font-medium text-gray-600">Enter your details</span>
          <button onClick={handleClear} className="text-gray-400 hover:text-gray-600 transition-colors" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {ASSET_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                <f.icon className="w-3.5 h-3.5 text-violet-400" /> {f.label}
              </label>
              <input
                type="number" min={0} value={form[f.key]} onChange={(e) => setField(f.key, e.target.value)}
                placeholder="0"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow"
              />
            </div>
          ))}

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
              <MinusCircle className="w-3.5 h-3.5 text-violet-400" /> Debts & liabilities due now
            </label>
            <input
              type="number" min={0} value={form.debts} onChange={(e) => setField("debts", e.target.value)}
              placeholder="0"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
              <Landmark className="w-3.5 h-3.5 text-violet-400" /> Nisab threshold (your currency)
            </label>
            <input
              type="number" min={0} value={form.nisabThreshold} onChange={(e) => setField("nisabThreshold", e.target.value)}
              placeholder="e.g. based on today's gold/silver price"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Nisab is traditionally 87.48g of gold or 612.36g of silver — convert using today&apos;s local price, or check with your local Islamic center.
            </p>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className={cn(
              "w-full py-3 px-6 rounded-xl font-semibold text-white transition-all",
              "bg-violet-600 hover:bg-violet-700 active:scale-[.99]",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Calculating...</>) : "Calculate Zakat"}
          </button>

          {error && <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">{error}</div>}
        </div>
      </div>

      {/* ── Result — ring is visible from the start, fills on every press ── */}
      <div className="min-w-0 bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-sm font-medium text-gray-600">Result</span>
          {result && (
            <span className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full border",
              result.eligible ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-gray-50 text-gray-500 border-gray-200"
            )}>
              {result.eligible ? "Zakat due" : "Below Nisab"}
            </span>
          )}
        </div>
        <div className="p-5">
          <div className="flex justify-center">
            <WealthRing progressPct={ringProgress} zakatDue={result?.zakatDue ?? 0} eligible={result?.eligible ?? false} hasResult={!!result} />
          </div>

          {loading && <div className="mt-4"><ProcessingPanel progress={progress} phaseLabel="Calculating..." success={success} /></div>}

          {!loading && result && (
            <>
              <p className="mt-4 text-center text-sm text-gray-600">
                {result.eligible ? (
                  <>Zakat due: <span className="font-semibold text-gray-900">{result.zakatDue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span> ({result.ratePct}% of net wealth).</>
                ) : (
                  <>Your net wealth is below the Nisab threshold — Zakat isn&apos;t obligatory this year.</>
                )}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <StatTile label="Total assets" value={result.totalAssets.toLocaleString(undefined, { maximumFractionDigits: 2 })} icon={Wallet} />
                <StatTile label="Net zakatable wealth" value={result.netWealth.toLocaleString(undefined, { maximumFractionDigits: 2 })} icon={TrendingUp} />
                <StatTile label="Nisab threshold" value={result.nisabThreshold.toLocaleString(undefined, { maximumFractionDigits: 2 })} icon={Landmark} />
                <StatTile label="Zakat rate" value={`${result.ratePct}%`} icon={HandCoins} />
              </div>
            </>
          )}

          {!loading && !result && (
            <p className="mt-4 text-xs text-gray-400 text-center">Enter your assets and Nisab threshold, then calculate to see your Zakat.</p>
          )}

          <p className="mt-4 text-xs text-gray-400 text-center">
            ★ For informational purposes only — for rulings specific to your madhhab or assets, consult a qualified scholar.
          </p>
        </div>
      </div>
    </div>
  );
}
