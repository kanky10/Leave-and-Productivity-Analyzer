import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

function parseExcelDate(value: any): Date | null {
  if (typeof value === "number") {
    const utc = Math.floor(value - 25569) * 86400;
    return new Date(utc * 1000);
  }
  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (value instanceof Date) return value;
  return null;
}

function calculateWorkedHours(inTime?: string, outTime?: string): number {
  if (!inTime || !outTime) return 0;

  const [h1, m1] = inTime.split(":").map(Number);
  const [h2, m2] = outTime.split(":").map(Number);

  const start = h1 * 60 + m1;
  const end = h2 * 60 + m2;

  if (end <= start) return 0;
  return Number(((end - start) / 60).toFixed(2));
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 🔥 CLEAR OLD DATA FIRST
    await prisma.$transaction([
      prisma.attendance.deleteMany(),
      prisma.employee.deleteMany(),
    ]);

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return NextResponse.json(
        { error: "Uploaded Excel is empty" },
        { status: 400 }
      );
    }

    const employeeIds = new Set<string>();
    const attendanceRows: any[] = [];
    const monthSet = new Set<string>();

    for (const row of rows) {
      const employeeId = row["Employee ID"];
      const date = parseExcelDate(row["Date"]);
      if (!employeeId || !date) continue;

      const workedHours = calculateWorkedHours(
        row["In-Time"],
        row["Out-Time"]
      );

      employeeIds.add(employeeId);

      attendanceRows.push({
        employeeId,
        date,
        workedHours,
      });

      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      monthSet.add(monthKey);
    }

    // 🚀 BULK INSERT EMPLOYEES (MongoDB-safe)
    await prisma.employee.createMany({
      data: Array.from(employeeIds).map((id) => ({
        employeeId: id,
      })),
    });

    // 🚀 BULK INSERT ATTENDANCE
    await prisma.attendance.createMany({
      data: attendanceRows,
    });

    return NextResponse.json({
      success: true,
      employees: Array.from(employeeIds).sort(),
      months: Array.from(monthSet).sort(),
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Failed to process Excel file" },
      { status: 500 }
    );
  }
}