"use client";

import React from "react";
import { STATUS_CONFIG } from "@/contants";
import { ClaimItem } from "@/types/claim"; // คุณอาจต้องสร้างไฟล์ type แยก

interface EditClaimModalProps {
  claim: ClaimItem;
  isSubmitting: boolean;
  onClose: () => void;
  onChange: (updated: ClaimItem) => void;
  onSubmit: () => void;
}

export function EditClaimModal({
  claim,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}: EditClaimModalProps) {
  if (!claim) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">แก้ไขรายการ</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="บริษัท/ลูกค้า"
            value={claim.company}
            onChange={(e) => onChange({ ...claim, company: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="รุ่นเครื่อง"
            value={claim.model}
            onChange={(e) => onChange({ ...claim, model: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="หมายเลขเครื่อง"
            value={claim.serialNumber}
            onChange={(e) => onChange({ ...claim, serialNumber: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <select
            value={claim.statusId}
            onChange={(e) => onChange({ ...claim, statusId: parseInt(e.target.value) })}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          >
            {Object.values(STATUS_CONFIG).map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
          <textarea
            placeholder="การดำเนินการ"
            value={claim.action}
            onChange={(e) => onChange({ ...claim, action: e.target.value })}
            rows={3}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="timestamp"
            value={claim.time}
            onChange={(e) => onChange({ ...claim, time: e.target.value || "" })}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="date"
            value={claim.date}
            onChange={(e) => onChange({ ...claim, date: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            {isSubmitting ? "กำลังอัปเดต..." : "อัปเดต"}
          </button>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}
