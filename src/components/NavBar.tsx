"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();

  return (
    <nav className="bg-gray-950 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">
          Leave Analyzer
        </h1>

        <div className="flex gap-6 text-sm">
          <Link
            href="/"
            className={path === "/" ? "text-blue-400" : "text-gray-400 hover:text-white"}
          >
            Upload
          </Link>
          <Link
            href="/dashboard"
            className={path === "/dashboard" ? "text-blue-400" : "text-gray-400 hover:text-white"}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}