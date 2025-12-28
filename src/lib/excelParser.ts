import * as XLSX from "xlsx";

export interface ExcelAttendanceRow {
  employeeId: string;
  date: string;
  inTime?: string;
  outTime?: string;
}

function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/_/g, "");
}

export function parseExcel(buffer: Buffer): ExcelAttendanceRow[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

  return rawRows.map((row) => {
    const normalized: Record<string, any> = {};

    for (const key in row) {
      normalized[normalizeKey(key)] = row[key];
    }

    return {
      employeeId:
        normalized.employeeid ||
        normalized.empid ||
        normalized.employee ||
        "",
      date: normalized.date,
      inTime: normalized.intime,
      outTime: normalized.outtime,
    };
  });
}