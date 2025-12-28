"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function HoursBarChart({
  expected,
  worked,
}: {
  expected: number;
  worked: number;
}) {
  const data = [
    { name: "Expected", hours: expected },
    { name: "Worked", hours: worked },
  ];

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow border border-gray-700 h-64">
      <h3 className="font-semibold mb-2 text-white">
        Expected vs Worked Hours
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: "#E5E7EB" }} />
          <YAxis tick={{ fill: "#E5E7EB" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              borderColor: "#374151",
              color: "#F9FAFB",
            }}
          />
          <Bar dataKey="hours" fill="#3B82F6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}