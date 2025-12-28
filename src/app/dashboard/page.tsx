"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import HoursBarChart from "@/components/charts/HoursBarChart";
import AttendancePieChart from "@/components/charts/AttendancePieChart";
import DailyLineChart from "@/components/charts/DailyLineChart";

type DailyRow = {
  date: string;
  status: "Present" | "Leave";
  workedHours: number;
};

type AnalyticsResponse = {
  expectedHours: number;
  actualHours: number;
  leavesUsed: number;
  allowedLeaves: number;
  productivity: number;
  dailyBreakdown: DailyRow[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [employees, setEmployees] = useState<string[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔒 Block dashboard without upload
  useEffect(() => {
    if (!localStorage.getItem("excelUploaded")) {
      router.replace("/");
    }
  }, [router]);

  // Load upload context
  useEffect(() => {
    const emp = localStorage.getItem("uploadedEmployees");
    const mon = localStorage.getItem("uploadedMonths");

    if (emp) setEmployees(JSON.parse(emp));
    if (mon) setMonths(JSON.parse(mon));
  }, []);

  async function loadDashboard() {
    if (!employeeId || !month) return;

    setLoading(true);
    setData(null);

    try {
      const res = await fetch(
        `/api/analytics?employeeId=${employeeId}&month=${month}`
      );
      const json = await res.json();

      if (json?.dailyBreakdown?.length) {
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* 🧾 CSV EXPORT FUNCTION */
  function exportCSV() {
    if (!data) return;

    const header = ["Date", "Status", "Worked Hours"];
    const rows = data.dailyBreakdown.map((d) => [
      new Date(d.date).toISOString().split("T")[0],
      d.status,
      d.status === "Present" ? d.workedHours : 0,
    ]);

    const csv =
      [header, ...rows]
        .map((r) => r.join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${employeeId}_${month}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="bg-gray-800 border border-gray-700 px-3 py-2 rounded"
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-gray-800 border border-gray-700 px-3 py-2 rounded"
          >
            <option value="">Select Month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <button
            onClick={loadDashboard}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Show Dashboard
          </button>
        </div>

        {loading && <p className="text-gray-400">Loading...</p>}

        {data && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card title="Expected Hours" value={data.expectedHours} />
              <Card title="Worked Hours" value={data.actualHours} />
              <Card title="Leaves Used" value={data.leavesUsed} />
              <Card title="Productivity" value={`${data.productivity}%`} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <HoursBarChart
                expected={data.expectedHours}
                worked={data.actualHours}
              />
              <AttendancePieChart
                present={
                  data.dailyBreakdown.filter(
                    (d) => d.status === "Present"
                  ).length
                }
                leaves={data.leavesUsed}
              />
            </div>

            <DailyLineChart
              data={data.dailyBreakdown.filter(
                (d) => d.status === "Present"
              )}
            />

            {/* Attendance Table + Export */}
            <div className="mt-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Daily Attendance Details
                </h2>

                <button
                  onClick={exportCSV}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-700 rounded">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">
                        Worked Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.dailyBreakdown.map((row) => (
                      <tr
                        key={row.date}
                        className="border-t border-gray-700"
                      >
                        <td className="px-4 py-2">
                          {new Date(row.date).toDateString()}
                        </td>
                        <td
                          className={`px-4 py-2 ${
                            row.status === "Present"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {row.status}
                        </td>
                        <td className="px-4 py-2">
                          {row.status === "Present"
                            ? `${row.workedHours} hrs`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded p-4">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}