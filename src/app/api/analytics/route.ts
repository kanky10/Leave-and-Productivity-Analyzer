import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    const month = searchParams.get("month"); // YYYY-MM

    if (!employeeId || !month) {
      return NextResponse.json(
        { error: "Missing employeeId or month" },
        { status: 400 }
      );
    }

    // ✅ Correct month parsing
    const [year, monthIndex] = month.split("-").map(Number);

    const startDate = new Date(year, monthIndex - 1, 1);
    const endDate = new Date(year, monthIndex, 0, 23, 59, 59);

    // Fetch attendance records
    const attendance = await prisma.attendance.findMany({
      where: {
        employeeId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    });

    // ---------- BUSINESS RULES ----------
    let expectedHours = 0;
    let actualHours = 0;
    let leavesUsed = 0;
    const dailyBreakdown = [];

    const daysInMonth = new Date(year, monthIndex, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, monthIndex - 1, day);
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday

      if (dayOfWeek === 0) continue; // Sunday off

      // Expected hours
      expectedHours += dayOfWeek === 6 ? 4 : 8.5;

      const record = attendance.find(
        (a) =>
          new Date(a.date).toDateString() ===
          currentDate.toDateString()
      );

      if (!record) {
        leavesUsed++;
        dailyBreakdown.push({
          date: currentDate,
          status: "Leave",
          workedHours: 0,
        });
      } else {
        actualHours += record.workedHours;
        dailyBreakdown.push({
          date: record.date,
          status: "Present",
          workedHours: record.workedHours,
        });
      }
    }

    const productivity =
      expectedHours === 0
        ? 0
        : Math.round((actualHours / expectedHours) * 100);

    return NextResponse.json({
      expectedHours: Math.round(expectedHours),
      actualHours: Math.round(actualHours),
      leavesUsed,
      allowedLeaves: 2,
      productivity,
      dailyBreakdown,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}