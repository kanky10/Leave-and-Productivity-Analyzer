"use client";

import FileUpload from "../components/FileUpload";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />

      <div className="flex items-center justify-center mt-24">
        <div className="bg-gray-800 p-8 rounded-xl shadow w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Upload Attendance Excel
          </h2>

          <FileUpload />

          <p className="text-xs text-gray-500 mt-4 text-center">
            You’ll be redirected to the dashboard after upload
          </p>
        </div>
      </div>
    </div>
  );
}