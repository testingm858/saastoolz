import { Info } from "lucide-react";

type DisclaimerType = "medical" | "financial" | "legal";

const COPY: Record<DisclaimerType, string> = {
  medical:
    "This tool gives general estimates for informational purposes only and isn't medical advice. Talk to a qualified healthcare provider about your individual health.",
  financial:
    "This tool gives general estimates for informational purposes only and isn't financial advice. Consult a qualified financial advisor or your lender before making financial decisions.",
  legal:
    "This template is a general starting point for informational purposes only and isn't legal advice. Have a qualified lawyer review any contract before you sign or send it.",
};

// Rendered on YMYL ("Your Money or Your Life") tool pages — calculators and
// templates covering health, finance, or legal topics — where a bare result
// could otherwise read as professional advice.
export default function Disclaimer({ type }: { type: DisclaimerType }) {
  return (
    <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mt-4">
      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
      <p>{COPY[type]}</p>
    </div>
  );
}
