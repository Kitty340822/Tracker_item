"use client";

import React from "react";
import Link from "next/link";

export default function Spare() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-sky-500 text-white p-6 rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-center">Spare Component</h1>
          <p className="text-center mt-2 text-blue-100">ระบบจัดการอะไหล่</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-gray-700 dark:text-gray-300">
            ยินดีต้อนรับสู่ Spare Component! คุณสามารถจัดการข้อมูลอะไหล่ได้ที่นี่
          </p>
          <div className="mt-4">
            <Link href="/claim-tracker">
              <a className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                ไปยัง Claim Tracker
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}