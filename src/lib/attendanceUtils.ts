import { WORK_HOURS } from "./constants";

/**
 * Returns expected working hours for a given date
 */
export function getExpectedHours(date: Date): number {
  const day = date.getDay();

  if (day === 0) return WORK_HOURS.SUNDAY;    // Sunday
  if (day === 6) return WORK_HOURS.SATURDAY;  // Saturday

  return WORK_HOURS.WEEKDAY;                  // Mon–Fri
}

/**
 * Calculates worked hours from inTime & outTime
 */
export function calculateWorkedHours(
  inTime?: string,
  outTime?: string
): number {
  if (!inTime || !outTime) return 0;

  const start = new Date(`1970-01-01T${inTime}`);
  const end = new Date(`1970-01-01T${outTime}`);

  const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return Math.max(0, parseFloat(diff.toFixed(2)));
}