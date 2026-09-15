"use client";

import { useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressSimulation, ProcessingPanel } from "@/components/ProgressIndicator";

type Unit = "metric" | "imperial";

interface BmiResult {
  bmi: number;
  category: string;
  color: string;
  healthyWeightRange: { min: number; max: number };
  unit: Unit;
}

// Same thresholds/colors as src/tools/calc/bmi-calculator.ts — kept in sync
// by hand since the gauge needs them client-side before the API responds.
const BANDS = [
  { label: "Underweight", to: 18.5, color: "#3b82f6" },
  { label: "Normal", to: 25, color: "#22c55e" },
  { label: "Overweight", to: 30, color: "#f59e0b" },
  { label: "Obese", to: 40, color: "#ef4444" },
] as const;

const CATEGORY_BADGE: Record<string, string> = {
  "Underweight": "bg-blue-50 text-blue-700 border-blue-100",
  "Normal weight": "bg-green-50 text-green-700 border-green-100",
  "Overweight": "bg-amber-50 text-amber-700 border-amber-100",
  "Obese": "bg-red-50 text-red-700 border-red-100",
};

const GAUGE_MIN = 15;
const GAUGE_MAX = 40;

function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarPoint(cx, cy, r, startAngle);
  const end = polarPoint(cx, cy, r, endAngle);
  const largeArcFlag = startAngle - endAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

// Gauge sweeps left (GAUGE_MIN, 180°) to right (GAUGE_MAX, 0°) across the top.
function valueToAngle(value: number) {
  const clamped = Math.min(GAUGE_MAX, Math.max(GAUGE_MIN, value));
  const frac = (clamped - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN);
  return 180 - frac * 180;
}

const BAND_SEGMENTS = BANDS.map((b, i) => {
  const from = i === 0 ? GAUGE_MIN : Math.min(BANDS[i - 1].to, GAUGE_MAX);
  return { ...b, from, to: Math.min(b.to, GAUGE_MAX) };
}).filter((b) => b.to > b.from);

const GAUGE_CX = 130;
const GAUGE_CY = 118;
const GAUGE_R = 96;
const GAUGE_STROKE = 22;

// Needle-only concern: `needleBmi` drives rotation and nothing else, so the
// parent can reset it to null (start position) and then to the real value
// on every Calculate press — two renders, two transitions, so the needle
// genuinely sweeps 0→result every time rather than just the first time.
function BmiGauge({ needleBmi }: { needleBmi: number | null }) {
  const needleLen = GAUGE_R - GAUGE_STROKE / 2 - 4;
  const angle = valueToAngle(needleBmi ?? GAUGE_MIN);
  const needleRotation = 90 - angle; // CSS rotate() from the needle's "straight up" base pose

  return (
    <svg viewBox="0 0 260 150" className="w-full max-w-[280px] mx-auto block">
      {BAND_SEGMENTS.map((b) => (
        <path
          key={b.label}
          d={arcPath(GAUGE_CX, GAUGE_CY, GAUGE_R, valueToAngle(b.from), valueToAngle(b.to))}
          fill="none"
          stroke={b.color}
          strokeWidth={GAUGE_STROKE}
        />
      ))}
      {/* boundary ticks */}
      {[18.5, 25, 30].map((v) => {
        const inner = polarPoint(GAUGE_CX, GAUGE_CY, GAUGE_R - GAUGE_STROKE / 2 - 3, valueToAngle(v));
        const outer = polarPoint(GAUGE_CX, GAUGE_CY, GAUGE_R + GAUGE_STROKE / 2 + 3, valueToAngle(v));
        return <line key={v} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#ffffff" strokeWidth={2} />;
      })}
      {/* needle — rotates around the pivot; transition animates every value change */}
      <g
        style={{
          transformOrigin: `${GAUGE_CX}px ${GAUGE_CY}px`,
          transform: `rotate(${needleRotation}deg)`,
          transition: "transform 1.1s cubic-bezier(0.34, 1.2, 0.64, 1)",
        }}
      >
        <line x1={GAUGE_CX} y1={GAUGE_CY} x2={GAUGE_CX} y2={GAUGE_CY - needleLen} stroke="#1f2937" strokeWidth={3} strokeLinecap="round" />
      </g>
      <circle cx={GAUGE_CX} cy={GAUGE_CY} r={6} fill="#1f2937" />
    </svg>
  );
}

// Digital, dashboard-style readout overlaid in the gauge's empty bowl —
// dark LCD-like panel with a monospace, glowing digit, separate from the
// needle so the number can reflect the actual result immediately while the
// needle is still sweeping toward it.
function DigitalReadout({ bmi, category, color }: { bmi: number | null; category: string | null; color: string }) {
  const lit = bmi !== null;
  return (
    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ top: "60%" }}>
      <div className="bg-gray-900 rounded-lg px-4 py-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
        <span
          className="font-mono text-2xl font-bold tabular-nums tracking-wider leading-none"
          style={{
            color: lit ? color : "#374151",
            textShadow: lit ? `0 0 10px ${color}99` : "none",
          }}
        >
          {lit ? bmi!.toFixed(1) : "--.-"}
        </span>
      </div>
      <span
        className="mt-1.5 text-[10px] font-bold tracking-[0.25em] transition-colors"
        style={{ color: lit ? color : "#9ca3af" }}
      >
        {lit && category ? category.toUpperCase() : "AWAITING INPUT"}
      </span>
    </div>
  );
}

// A labeled legend under the gauge — the colored bands alone don't tell a
// visitor which color means what, so spell it out plainly.
function BmiLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-2">
      {BANDS.map((b) => (
        <span key={b.label} className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
          {b.label}
        </span>
      ))}
    </div>
  );
}

export default function BmiCalculatorClient() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [heightCm, setHeightCm] = useState("170");
  const [weightKg, setWeightKg] = useState("65");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("7");
  const [weightLb, setWeightLb] = useState("143");

  const [result, setResult] = useState<BmiResult | null>(null);
  // Drives only the needle — reset to null then set to the real value on
  // every Calculate press, so the needle always sweeps from the start.
  const [needleBmi, setNeedleBmi] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { progress, start, finish, reset: resetProgress } = useProgressSimulation();

  async function handleCalculate() {
    const heightValue = unit === "metric" ? Number(heightCm) : Number(heightFt) * 12 + Number(heightIn || 0);
    const weightValue = unit === "metric" ? Number(weightKg) : Number(weightLb);

    if (!Number.isFinite(heightValue) || heightValue <= 0) { setError("Enter a valid height"); return; }
    if (!Number.isFinite(weightValue) || weightValue <= 0) { setError("Enter a valid weight"); return; }

    setLoading(true);
    setSuccess(false);
    setError(null);
    setNeedleBmi(null); // snap the needle back to the start before this run's sweep
    start(10, 90);

    try {
      const res = await fetch("/api/tools/bmi-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: JSON.stringify({ weight: weightValue, height: heightValue, unit }) }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "premium_required") setError(`🔒 ${data.message}`);
        else if (data.error === "rate_limited") setError(`⏱️ ${data.message}`);
        else setError(data.error || data.result?.error || "Something went wrong");
        return;
      }

      const bmiResult = data.result as BmiResult;
      setResult(bmiResult);
      setNeedleBmi(bmiResult.bmi); // needle sweeps from start to the result
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
    setHeightCm("170");
    setWeightKg("65");
    setHeightFt("5");
    setHeightIn("7");
    setWeightLb("143");
    setResult(null);
    setNeedleBmi(null);
    setError(null);
  }

  const weightUnitLabel = unit === "metric" ? "kg" : "lb";
  const bmiPrime = result ? Math.round((result.bmi / 25) * 100) / 100 : null;
  const ponderalIndex = (() => {
    if (!result) return null;
    const heightM = unit === "metric" ? Number(heightCm) / 100 : (Number(heightFt) * 12 + Number(heightIn || 0)) * 0.0254;
    const weightKgValue = unit === "metric" ? Number(weightKg) : Number(weightLb) / 2.205;
    if (!heightM) return null;
    return Math.round((weightKgValue / heightM ** 3) * 10) / 10;
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
          <div className="flex gap-2 bg-gray-50 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setUnit("imperial")}
              className={cn(
                "flex-1 text-sm font-semibold py-2.5 rounded-lg transition-colors",
                unit === "imperial" ? "bg-violet-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              US Units
            </button>
            <button
              type="button"
              onClick={() => setUnit("metric")}
              className={cn(
                "flex-1 text-sm font-semibold py-2.5 rounded-lg transition-colors",
                unit === "metric" ? "bg-violet-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              Metric Units
            </button>
          </div>

          {unit === "metric" ? (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Height (cm)</label>
                <input
                  type="number" min={1} value={heightCm} onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Weight (kg)</label>
                <input
                  type="number" min={1} value={weightKg} onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Height</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} value={heightFt} onChange={(e) => setHeightFt(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow"
                  />
                  <span className="text-xs text-gray-400 shrink-0">ft</span>
                  <input
                    type="number" min={0} max={11} value={heightIn} onChange={(e) => setHeightIn(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow"
                  />
                  <span className="text-xs text-gray-400 shrink-0">in</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Weight (lb)</label>
                <input
                  type="number" min={1} value={weightLb} onChange={(e) => setWeightLb(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow"
                />
              </div>
            </>
          )}

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
            {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Calculating...</>) : "Calculate BMI"}
          </button>

          {error && <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">{error}</div>}
        </div>
      </div>

      {/* ── Result — gauge is visible from the start, needle animates in ── */}
      <div className="min-w-0 bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-sm font-medium text-gray-600">Result</span>
          {result && (
            <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", CATEGORY_BADGE[result.category] ?? "bg-gray-50 text-gray-600 border-gray-100")}>
              {result.category}
            </span>
          )}
        </div>
        <div className="p-5">
          <div className="relative w-full max-w-[280px] mx-auto">
            <BmiGauge needleBmi={needleBmi} />
            <DigitalReadout bmi={result?.bmi ?? null} category={result?.category ?? null} color={result?.color ?? "#9ca3af"} />
          </div>
          <BmiLegend />

          {loading && <div className="mt-4"><ProcessingPanel progress={progress} phaseLabel="Calculating..." success={success} /></div>}

          {!loading && result && (
            <ul className="mt-4 space-y-1.5 text-sm text-gray-600">
              <li>
                Healthy BMI range: <span className="font-medium text-gray-900">18.5 – 24.9 kg/m²</span>
              </li>
              <li>
                Healthy weight for your height:{" "}
                <span className="font-medium text-gray-900">
                  {result.healthyWeightRange.min} – {result.healthyWeightRange.max} {weightUnitLabel}
                </span>
              </li>
              {bmiPrime !== null && (
                <li>BMI Prime: <span className="font-medium text-gray-900">{bmiPrime}</span></li>
              )}
              {ponderalIndex !== null && (
                <li>Ponderal Index: <span className="font-medium text-gray-900">{ponderalIndex} kg/m³</span></li>
              )}
            </ul>
          )}

          {!loading && !result && (
            <p className="mt-4 text-xs text-gray-400 text-center">Enter your height and weight, then calculate to see the full breakdown.</p>
          )}
        </div>
      </div>
    </div>
  );
}
