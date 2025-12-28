"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DailyLineChart({
  data,
}: {
  data: { date: string; workedHours: number }[];
}) {
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }),
    hours: d.workedHours,
  }));

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow border border-gray-700 h-72">
      <h3 className="font-semibold mb-2 text-white">
        Daily Worked Hours Trend
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: "#E5E7EB" }} />
          <YAxis tick={{ fill: "#E5E7EB" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              borderColor: "#374151",
              color: "#F9FAFB",
            }}
          />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: "#3B82F6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}