"use client";

import { useId, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressSimulation, ProcessingPanel } from "@/components/ProgressIndicator";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

// Standard Western zodiac date ranges, ordered chronologically so the loop
// below can just keep overwriting `result` with the latest matching start
// date — the Dec 22 entry correctly overrides the Jan 1 one for late-year
// birthdays.
const ZODIAC_SIGNS = [
  { name: "Capricorn", symbol: "♑", start: [1, 1] },
  { name: "Aquarius", symbol: "♒", start: [1, 20] },
  { name: "Pisces", symbol: "♓", start: [2, 19] },
  { name: "Aries", symbol: "♈", start: [3, 21] },
  { name: "Taurus", symbol: "♉", start: [4, 20] },
  { name: "Gemini", symbol: "♊", start: [5, 21] },
  { name: "Cancer", symbol: "♋", start: [6, 21] },
  { name: "Leo", symbol: "♌", start: [7, 23] },
  { name: "Virgo", symbol: "♍", start: [8, 23] },
  { name: "Libra", symbol: "♎", start: [9, 23] },
  { name: "Scorpio", symbol: "♏", start: [10, 23] },
  { name: "Sagittarius", symbol: "♐", start: [11, 22] },
  { name: "Capricorn", symbol: "♑", start: [12, 22] },
] as const;

function getZodiac(month: number, day: number) {
  let result: (typeof ZODIAC_SIGNS)[number] = ZODIAC_SIGNS[0];
  for (const z of ZODIAC_SIGNS) {
    const [sm, sd] = z.start;
    if (month > sm || (month === sm && day >= sd)) result = z;
  }
  return result;
}

// Days lived since the last birthday, out of the days in that birthday
// year — drives the progress ring. Always relative to the real current
// date (not the optional "as of" override below), since "next birthday"
// is about the visitor's actual life, not a hypothetical reference date.
function nextBirthdayInfo(birthDate: Date, today: Date) {
  const bm = birthDate.getMonth();
  const bd = birthDate.getDate();
  let next = new Date(today.getFullYear(), bm, bd);
  if (next < today) next = new Date(today.getFullYear() + 1, bm, bd);
  const last = new Date(next.getFullYear() - 1, bm, bd);
  const daysInYear = Math.round((next.getTime() - last.getTime()) / 86400000);
  const daysSinceLast = Math.round((today.getTime() - last.getTime()) / 86400000);
  const daysUntilNext = Math.round((next.getTime() - today.getTime()) / 86400000);
  const progressPct = Math.min(100, Math.max(0, (daysSinceLast / daysInYear) * 100));
  return { daysUntilNext, progressPct };
}

// A gradient progress ring matching ProgressIndicator's ProgressRing, but
// with a custom center (years lived, not a percentage) — the "next
// birthday" progress fills the ring itself, animated via a CSS transition
// on stroke-dashoffset the same way the site's loading rings already work.
function AgeRing({ years, progressPct }: { years: number | null; progressPct: number }) {
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
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gray-900 font-mono tabular-nums leading-none">{years !== null ? years : "—"}</span>
        <span className="text-[10px] uppercase tracking-widest text-gray-400 mt-1.5">{years !== null ? "years old" : "awaiting input"}</span>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function AgeCalculatorClient() {
  const [birthDate, setBirthDate] = useState("");
  const [asOf, setAsOf] = useState("");

  const [result, setResult] = useState<AgeResult | null>(null);
  const [ringYears, setRingYears] = useState<number | null>(null);
  const [ringProgress, setRingProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { progress, start, finish, reset: resetProgress } = useProgressSimulation();

  async function handleCalculate() {
    if (!birthDate) { setError("Enter your date of birth"); return; }

    setLoading(true);
    setSuccess(false);
    setError(null);
    setRingProgress(0); // ring re-fills from empty on every press, like the BMI gauge's needle
    start(10, 90);

    try {
      const res = await fetch("/api/tools/age-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: JSON.stringify({ birthDate, asOf: asOf || undefined }) }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "premium_required") setError(`🔒 ${data.message}`);
        else if (data.error === "rate_limited") setError(`⏱️ ${data.message}`);
        else setError(data.error || data.result?.error || "Something went wrong");
        return;
      }

      const ageResult = data.result as AgeResult;
      setResult(ageResult);
      const { progressPct } = nextBirthdayInfo(new Date(birthDate), new Date());
      setRingYears(ageResult.years);
      setRingProgress(progressPct);
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
    setBirthDate("");
    setAsOf("");
    setResult(null);
    setRingYears(null);
    setRingProgress(0);
    setError(null);
  }

  const facts = (() => {
    if (!result || !birthDate) return null;
    const bd = new Date(birthDate);
    const today = new Date();
    const { daysUntilNext } = nextBirthdayInfo(bd, today);
    const zodiac = getZodiac(bd.getMonth() + 1, bd.getDate());
    const weekday = bd.toLocaleDateString("en-US", { weekday: "long" });
    const totalWeeks = Math.floor(result.totalDays / 7);
    const totalHours = result.totalDays * 24;
    const nextBirthdayLabel = daysUntilNext === 0 ? "Today! 🎉" : `In ${daysUntilNext} day${daysUntilNext === 1 ? "" : "s"}`;
    return { weekday, zodiac, totalWeeks, totalHours, nextBirthdayLabel };
  })();

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

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Date of birth</label>
            <input
              type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Calculate age as of (optional)</label>
            <input
              type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow"
            />
            <p className="text-xs text-gray-400 mt-1.5">Leave blank to calculate as of today.</p>
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
            {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Calculating...</>) : "Calculate Age"}
          </button>

          {error && <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">{error}</div>}
        </div>
      </div>

      {/* ── Result — ring is visible from the start, fills on every press ── */}
      <div className="min-w-0 bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-sm font-medium text-gray-600">Result</span>
          {result && <span className="text-xs font-medium text-gray-400">{ringProgress.toFixed(0)}% to next birthday</span>}
        </div>
        <div className="p-5">
          <div className="flex justify-center">
            <AgeRing years={ringYears} progressPct={ringProgress} />
          </div>

          {loading && <div className="mt-4"><ProcessingPanel progress={progress} phaseLabel="Calculating..." success={success} /></div>}

          {!loading && result && facts && (
            <>
              <p className="mt-4 text-center text-sm text-gray-600">
                You are <span className="font-semibold text-gray-900">{result.years} years, {result.months} months, {result.days} days</span> old.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <StatTile label="Total days lived" value={result.totalDays.toLocaleString()} />
                <StatTile label="Total weeks" value={facts.totalWeeks.toLocaleString()} />
                <StatTile label="Total hours (~)" value={facts.totalHours.toLocaleString()} />
                <StatTile label="Next birthday" value={facts.nextBirthdayLabel} />
                <StatTile label="Born on a" value={facts.weekday} />
                <StatTile label="Zodiac sign" value={`${facts.zodiac.symbol} ${facts.zodiac.name}`} />
              </div>
            </>
          )}

          {!loading && !result && (
            <p className="mt-4 text-xs text-gray-400 text-center">Enter your date of birth, then calculate to see the full breakdown.</p>
          )}
        </div>
      </div>
    </div>
  );
}
