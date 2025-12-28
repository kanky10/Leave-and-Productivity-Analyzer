# 📊 Leave & Productivity Analyzer

A full-stack web application that analyzes employee attendance, leave usage, and productivity using an uploaded Excel attendance sheet.

---

## 🚀 Features
- Upload attendance data via Excel (.xlsx)
- Automatically detects employees and months
- Monthly productivity & attendance analytics
- Interactive charts and daily attendance table
- CSV export of attendance data
- Dark-mode UI with clean UX

---

## 🧠 Business Rules

### Working Hours
- Monday–Friday: 8.5 hours (10:00 AM – 6:30 PM)
- Saturday: 4 hours (10:00 AM – 2:00 PM)
- Sunday: Off

### Leave Policy
- 2 leaves allowed per employee per month
- Missing attendance on working day = Leave

### Productivity Formula
Productivity (%) = (Actual Worked Hours / Expected Working Hours) × 100

---

## 📂 Excel File Format

| Column Name | Description |
|------------|-------------|
| Employee ID | Unique employee identifier |
| Date | Attendance date |
| In-Time | Login time (HH:MM) |
| Out-Time | Logout time (HH:MM) |

A single Excel file can contain multiple employees and multiple months.

---

## 🛠 Tech Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: Next.js API Routes, Prisma ORM
- Database: MongoDB Atlas
- Charts: Recharts
- Utilities: xlsx

---

## 🖥 Application Flow

1. Upload Excel file on home page
2. Data is parsed and stored in MongoDB
3. User is redirected to dashboard
4. Select employee and month to view analytics
5. Export attendance data as CSV

---
