import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center">Spare Part Claim Tracker</h1>
      <div className="flex flex-col gap-8">
        <div className="bg-white dark:bg-[#222] rounded-xl shadow-lg p-8 w-72 h-48 flex items-center justify-center text-xl font-semibold border border-gray-200 dark:border-gray-700">
          <div>
            เพิ่มรายการใหม่
          </div>
        </div>
        <div className="bg-white dark:bg-[#222] rounded-xl shadow-lg p-8 w-72 h-48 flex flex-col items-center justify-center text-xl font-semibold border border-gray-200 dark:border-gray-700">
          <div className="mb-4">ข้อมูล</div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-base font-normal hover:bg-blue-700 transition">เพิ่มรายการ</button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-base font-normal hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">ตั้งค่า</button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-base font-normal hover:bg-green-700 transition">ซิงค์ข้อมูล</button>
          </div>
        </div>
        <div className="flex flex-row gap-8 bg-white dark:bg-[#222] rounded-xl shadow-lg p-8 w-72 h-48 flex items-center justify-center text-xl font-semibold border border-gray-200 dark:border-gray-700">
          <span>บริษัท/ลูกค้า</span>
          <span>รุ่นเครื่อง</span>
          <span>หมายเลขเครื่อง</span>
          <span>สถานะ</span>
          <span>การดำเนินการ</span>
          <span>เวลา</span>
          <span>อัปเดตสถานะ</span>
          <span>วันที่</span>
          <span>จัดการ</span>

        </div>
      </div>
    </div>
  );
}
