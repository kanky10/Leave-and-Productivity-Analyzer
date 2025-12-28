"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpload() {
    if (!file) {
      toast.error("Please select an Excel file");
      return;
    }

    setLoading(true);

    // 🧹 RESET PREVIOUS SESSION
    localStorage.removeItem("excelUploaded");
    localStorage.removeItem("uploadedEmployees");
    localStorage.removeItem("uploadedMonths");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // ✅ STORE UPLOAD CONTEXT
      localStorage.setItem("excelUploaded", "true");
      localStorage.setItem(
        "uploadedEmployees",
        JSON.stringify(data.employees)
      );
      localStorage.setItem(
        "uploadedMonths",
        JSON.stringify(data.months)
      );

      toast.success("Excel uploaded successfully!");
      setTimeout(() => router.push("/dashboard"), 600);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="bg-gray-700 text-gray-200 border border-gray-600 rounded px-3 py-2"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded transition"
      >
        {loading ? "Uploading..." : "Upload Excel"}
      </button>
    </div>
  );
}