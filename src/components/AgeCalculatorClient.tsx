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

// Extra detail shown in the astrological sign card below — keyed by name
// rather than folded into ZODIAC_SIGNS since Capricorn appears twice there
// (wraps across the year boundary) and would otherwise duplicate this data.
interface ZodiacDetail {
  element: string;
  planet: string;
  dateRange: string;
  symbolName: string;
  modality: string;
  traits: string[];
  luckyColor: string;
  luckyNumber: number;
  compatibleWith: string[];
  description: string;
}

const ZODIAC_DETAILS: Record<string, ZodiacDetail> = {
  Aries: {
    element: "Fire", planet: "Mars", dateRange: "Mar 21 – Apr 19", symbolName: "The Ram", modality: "Cardinal",
    traits: ["Bold", "Ambitious", "Energetic", "Competitive"], luckyColor: "Red", luckyNumber: 9, compatibleWith: ["Leo", "Sagittarius"],
    description: "As the first sign of the zodiac, Aries natives are natural trailblazers who lead with courage and instinct.",
  },
  Taurus: {
    element: "Earth", planet: "Venus", dateRange: "Apr 20 – May 20", symbolName: "The Bull", modality: "Fixed",
    traits: ["Reliable", "Patient", "Practical", "Devoted"], luckyColor: "Green", luckyNumber: 6, compatibleWith: ["Virgo", "Capricorn"],
    description: "Grounded and steady, Taurus values comfort, loyalty, and the finer things in life.",
  },
  Gemini: {
    element: "Air", planet: "Mercury", dateRange: "May 21 – Jun 20", symbolName: "The Twins", modality: "Mutable",
    traits: ["Curious", "Adaptable", "Witty", "Communicative"], luckyColor: "Yellow", luckyNumber: 5, compatibleWith: ["Libra", "Aquarius"],
    description: "Quick-witted and endlessly curious, Gemini thrives on variety, conversation, and new ideas.",
  },
  Cancer: {
    element: "Water", planet: "Moon", dateRange: "Jun 21 – Jul 22", symbolName: "The Crab", modality: "Cardinal",
    traits: ["Nurturing", "Intuitive", "Protective", "Emotional"], luckyColor: "Silver", luckyNumber: 2, compatibleWith: ["Scorpio", "Pisces"],
    description: "Deeply intuitive and caring, Cancer builds a warm, protective world around the people it loves.",
  },
  Leo: {
    element: "Fire", planet: "Sun", dateRange: "Jul 23 – Aug 22", symbolName: "The Lion", modality: "Fixed",
    traits: ["Confident", "Generous", "Charismatic", "Creative"], luckyColor: "Gold", luckyNumber: 1, compatibleWith: ["Aries", "Sagittarius"],
    description: "Warm, dramatic, and generous, Leo shines brightest when creating and leading with heart.",
  },
  Virgo: {
    element: "Earth", planet: "Mercury", dateRange: "Aug 23 – Sep 22", symbolName: "The Maiden", modality: "Mutable",
    traits: ["Analytical", "Meticulous", "Practical", "Modest"], luckyColor: "Brown", luckyNumber: 5, compatibleWith: ["Taurus", "Capricorn"],
    description: "Detail-oriented and dependable, Virgo finds purpose in improving the world one careful step at a time.",
  },
  Libra: {
    element: "Air", planet: "Venus", dateRange: "Sep 23 – Oct 22", symbolName: "The Scales", modality: "Cardinal",
    traits: ["Diplomatic", "Fair-minded", "Social", "Gracious"], luckyColor: "Blue", luckyNumber: 6, compatibleWith: ["Gemini", "Aquarius"],
    description: "Charming and fair-minded, Libra seeks harmony, balance, and beauty in relationships and surroundings.",
  },
  Scorpio: {
    element: "Water", planet: "Pluto", dateRange: "Oct 23 – Nov 21", symbolName: "The Scorpion", modality: "Fixed",
    traits: ["Passionate", "Resourceful", "Determined", "Intense"], luckyColor: "Deep Red", luckyNumber: 8, compatibleWith: ["Cancer", "Pisces"],
    description: "Intense and perceptive, Scorpio dives beneath the surface, drawn to truth, transformation, and depth.",
  },
  Sagittarius: {
    element: "Fire", planet: "Jupiter", dateRange: "Nov 22 – Dec 21", symbolName: "The Archer", modality: "Mutable",
    traits: ["Adventurous", "Optimistic", "Independent", "Honest"], luckyColor: "Purple", luckyNumber: 3, compatibleWith: ["Aries", "Leo"],
    description: "Free-spirited and philosophical, Sagittarius is always chasing the next horizon and a bigger truth.",
  },
  Capricorn: {
    element: "Earth", planet: "Saturn", dateRange: "Dec 22 – Jan 19", symbolName: "The Sea-Goat", modality: "Cardinal",
    traits: ["Disciplined", "Ambitious", "Patient", "Responsible"], luckyColor: "Black", luckyNumber: 8, compatibleWith: ["Taurus", "Virgo"],
    description: "Disciplined and patient, Capricorn climbs steadily toward long-term goals with quiet determination.",
  },
  Aquarius: {
    element: "Air", planet: "Uranus", dateRange: "Jan 20 – Feb 18", symbolName: "The Water-Bearer", modality: "Fixed",
    traits: ["Original", "Independent", "Humanitarian", "Inventive"], luckyColor: "Blue", luckyNumber: 4, compatibleWith: ["Gemini", "Libra"],
    description: "Independent and inventive, Aquarius marches to its own beat while championing big-picture ideas.",
  },
  Pisces: {
    element: "Water", planet: "Neptune", dateRange: "Feb 19 – Mar 20", symbolName: "The Fish", modality: "Mutable",
    traits: ["Compassionate", "Artistic", "Intuitive", "Gentle"], luckyColor: "Sea Green", luckyNumber: 7, compatibleWith: ["Cancer", "Scorpio"],
    description: "Compassionate and dreamy, Pisces feels the world deeply and often expresses it through art or empathy.",
  },
};

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
      {/* ── Left column: form, then the astrological detail card fills the
          space left over next to the taller Result column ── */}
      <div className="min-w-0 space-y-4">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
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

        {/* ── Astrological sign detail ── */}
        {!loading && result && facts && (() => {
          const detail = ZODIAC_DETAILS[facts.zodiac.name];
          if (!detail) return null;
          return (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <span className="text-sm font-medium text-gray-600">Astrological Sign</span>
                <span className="text-xs font-medium text-gray-400">{detail.dateRange}</span>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl text-white">
                    {facts.zodiac.symbol}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{facts.zodiac.name}</h3>
                    <p className="text-xs text-gray-400">{detail.symbolName} · {detail.element} · {detail.modality}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{detail.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {detail.traits.map((t) => (
                    <span key={t} className="text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <StatTile label="Ruling planet" value={detail.planet} />
                  <StatTile label="Modality" value={detail.modality} />
                  <StatTile label="Lucky color" value={detail.luckyColor} />
                  <StatTile label="Lucky number" value={String(detail.luckyNumber)} />
                  <StatTile label="Compatible with" value={detail.compatibleWith.join(", ")} />
                  <StatTile label="Symbol" value={detail.symbolName} />
                </div>
              </div>
              <p className="px-5 pb-4 text-xs text-gray-400">★ Just for fun — astrology isn&apos;t scientific fact.</p>
            </div>
          );
        })()}
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
