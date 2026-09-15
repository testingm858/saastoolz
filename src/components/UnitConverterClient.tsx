"use client";

import { useMemo, useState } from "react";
import { Ruler, Weight, Thermometer, Droplets, ArrowLeftRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryId = "length" | "weight" | "temperature" | "volume";

interface UnitDef {
  id: string;
  label: string;
  short: string;
}

// Multiplicative categories store a factor to their base unit (meters,
// grams, liters); temperature isn't multiplicative (0°C ≠ 0°F) so it's
// handled separately by convertTemperature() below.
const LENGTH_UNITS: (UnitDef & { toBase: number })[] = [
  { id: "mm", label: "Millimeters", short: "mm", toBase: 0.001 },
  { id: "cm", label: "Centimeters", short: "cm", toBase: 0.01 },
  { id: "m", label: "Meters", short: "m", toBase: 1 },
  { id: "km", label: "Kilometers", short: "km", toBase: 1000 },
  { id: "in", label: "Inches", short: "in", toBase: 0.0254 },
  { id: "ft", label: "Feet", short: "ft", toBase: 0.3048 },
  { id: "yd", label: "Yards", short: "yd", toBase: 0.9144 },
  { id: "mi", label: "Miles", short: "mi", toBase: 1609.344 },
];

const WEIGHT_UNITS: (UnitDef & { toBase: number })[] = [
  { id: "mg", label: "Milligrams", short: "mg", toBase: 0.001 },
  { id: "g", label: "Grams", short: "g", toBase: 1 },
  { id: "kg", label: "Kilograms", short: "kg", toBase: 1000 },
  { id: "oz", label: "Ounces", short: "oz", toBase: 28.349523125 },
  { id: "lb", label: "Pounds", short: "lb", toBase: 453.59237 },
  { id: "st", label: "Stone", short: "st", toBase: 6350.29318 },
  { id: "t", label: "Metric tons", short: "t", toBase: 1000000 },
];

const VOLUME_UNITS: (UnitDef & { toBase: number })[] = [
  { id: "ml", label: "Milliliters", short: "ml", toBase: 0.001 },
  { id: "l", label: "Liters", short: "L", toBase: 1 },
  { id: "gal", label: "Gallons (US)", short: "gal", toBase: 3.785411784 },
  { id: "qt", label: "Quarts (US)", short: "qt", toBase: 0.946352946 },
  { id: "pt", label: "Pints (US)", short: "pt", toBase: 0.473176473 },
  { id: "cup", label: "Cups (US)", short: "cup", toBase: 0.24 },
  { id: "flOz", label: "Fluid ounces (US)", short: "fl oz", toBase: 0.0295735296 },
];

const TEMPERATURE_UNITS: UnitDef[] = [
  { id: "c", label: "Celsius", short: "°C" },
  { id: "f", label: "Fahrenheit", short: "°F" },
  { id: "k", label: "Kelvin", short: "K" },
];

function toCelsius(value: number, from: string): number {
  if (from === "c") return value;
  if (from === "f") return ((value - 32) * 5) / 9;
  return value - 273.15; // kelvin
}
function fromCelsius(celsius: number, to: string): number {
  if (to === "c") return celsius;
  if (to === "f") return (celsius * 9) / 5 + 32;
  return celsius + 273.15; // kelvin
}
function convertTemperature(value: number, from: string, to: string): number {
  return fromCelsius(toCelsius(value, from), to);
}

const CATEGORIES: Record<CategoryId, { label: string; icon: LucideIcon; units: UnitDef[]; defaultFrom: string; defaultTo: string }> = {
  length: { label: "Length", icon: Ruler, units: LENGTH_UNITS, defaultFrom: "m", defaultTo: "ft" },
  weight: { label: "Weight", icon: Weight, units: WEIGHT_UNITS, defaultFrom: "kg", defaultTo: "lb" },
  temperature: { label: "Temperature", icon: Thermometer, units: TEMPERATURE_UNITS, defaultFrom: "c", defaultTo: "f" },
  volume: { label: "Volume", icon: Droplets, units: VOLUME_UNITS, defaultFrom: "l", defaultTo: "gal" },
};

function convert(category: CategoryId, value: number, fromId: string, toId: string): number {
  if (category === "temperature") return convertTemperature(value, fromId, toId);
  const units = CATEGORIES[category].units as (UnitDef & { toBase: number })[];
  const from = units.find((u) => u.id === fromId);
  const to = units.find((u) => u.id === toId);
  if (!from || !to) return NaN;
  return (value * from.toBase) / to.toBase;
}

function formatResult(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  const decimals = abs !== 0 && abs < 1 ? 6 : abs < 100 ? 4 : 2;
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

export default function UnitConverterClient() {
  const [category, setCategory] = useState<CategoryId>("length");
  const [fromUnit, setFromUnit] = useState(CATEGORIES.length.defaultFrom);
  const [toUnit, setToUnit] = useState(CATEGORIES.length.defaultTo);
  const [inputValue, setInputValue] = useState("1");

  const cat = CATEGORIES[category];
  const numericInput = Number(inputValue);
  const result = Number.isFinite(numericInput) ? convert(category, numericInput, fromUnit, toUnit) : NaN;

  const fromLabel = cat.units.find((u) => u.id === fromUnit)?.short ?? "";
  const toLabel = cat.units.find((u) => u.id === toUnit)?.short ?? "";

  // Quick-reference: what does 1 of the current "from" unit equal in every
  // other unit in this category — genuinely useful at-a-glance context, not
  // just filler.
  const reference = useMemo(() => {
    return cat.units
      .filter((u) => u.id !== fromUnit)
      .map((u) => ({ short: u.short, label: u.label, value: convert(category, 1, fromUnit, u.id) }));
  }, [cat, fromUnit, category]);

  function switchCategory(id: CategoryId) {
    setCategory(id);
    setFromUnit(CATEGORIES[id].defaultFrom);
    setToUnit(CATEGORIES[id].defaultTo);
  }

  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <span className="text-sm font-medium text-gray-600">Unit Converter</span>
        <span className="text-xs font-medium text-gray-400">Live, no signup</span>
      </div>

      <div className="p-5">
        {/* Category tabs */}
        <div className="grid grid-cols-4 gap-2 bg-gray-50 rounded-xl p-1">
          {(Object.entries(CATEGORIES) as [CategoryId, typeof CATEGORIES[CategoryId]][]).map(([id, c]) => (
            <button
              key={id}
              type="button"
              onClick={() => switchCategory(id)}
              className={cn(
                "flex flex-col items-center gap-1 text-xs font-semibold py-2.5 rounded-lg transition-colors",
                category === id ? "bg-violet-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              <c.icon className="w-4 h-4" />
              {c.label}
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="mt-5 grid md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">From</label>
            <input
              type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              className="w-full text-lg font-semibold border border-gray-200 rounded-lg px-3 py-2.5 mb-2 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-shadow"
            />
            <select
              value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400 bg-white"
            >
              {cat.units.map((u) => <option key={u.id} value={u.id}>{u.label} ({u.short})</option>)}
            </select>
          </div>

          <button
            type="button"
            onClick={swapUnits}
            title="Swap units"
            className="justify-self-center mb-2 md:mb-0 w-10 h-10 rounded-full bg-violet-50 border border-violet-100 text-violet-600 hover:bg-violet-100 transition-colors flex items-center justify-center shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">To</label>
            <div className="bg-gray-900 rounded-lg px-3 py-2.5 mb-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] overflow-hidden">
              <span className="block text-lg font-bold font-mono tabular-nums text-violet-300 truncate" style={{ textShadow: "0 0 10px rgba(167,139,250,0.6)" }}>
                {formatResult(result)}
              </span>
            </div>
            <select
              value={toUnit} onChange={(e) => setToUnit(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400 bg-white"
            >
              {cat.units.map((u) => <option key={u.id} value={u.id}>{u.label} ({u.short})</option>)}
            </select>
          </div>
        </div>

        <p className="mt-3 text-center text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{Number.isFinite(numericInput) ? inputValue : "—"} {fromLabel}</span>
          {" = "}
          <span className="font-semibold text-gray-900">{formatResult(result)} {toLabel}</span>
        </p>

        {/* Quick reference */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2.5">1 {fromLabel} equals</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {reference.map((r) => (
              <div key={r.short} className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">
                <p className="text-[10px] text-gray-400 truncate">{r.label}</p>
                <p className="text-sm font-semibold text-gray-900 tabular-nums">{formatResult(r.value)} <span className="text-gray-400 font-normal">{r.short}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
