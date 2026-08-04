"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface BarSpec {
  key: string;
  color: string;
  label: string;
}

interface Props {
  data: Record<string, string | number>[];
  bars: BarSpec[];
  xKey: string;
  height?: number;
}

export default function AnalyticsBarChart({ data, bars, xKey, height = 280 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          interval={0}
          angle={-30}
          textAnchor="end"
          height={70}
        />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} width={36} />
        <Tooltip
          cursor={{ fill: "#f9fafb" }}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        {bars.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {bars.map((b) => (
          <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
