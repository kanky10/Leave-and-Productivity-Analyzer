"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"]; // green, red

export default function AttendancePieChart({
  present,
  leaves,
}: {
  present: number;
  leaves: number;
}) {
  const data = [
    { name: "Present", value: present },
    { name: "Leaves", value: leaves },
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 h-[320px]">
      <h3 className="text-lg font-semibold mb-2 text-white">
        Attendance Distribution
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          {/* ✅ FIXED TOOLTIP */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "6px",
              color: "#ffffff",
            }}
            itemStyle={{
              color: "#ffffff",
            }}
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}