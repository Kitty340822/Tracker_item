import { IInventoryItem } from "@/types/model";

type TStockLevel = "SAFE" | "WARNING" | "DANGER" | "CRITICAL" | "NONE";

const INVENTORY_COLORS = {
  SAFE: "bg-green-500 text-white",
  WARNING: "bg-green-500 text-white",
  DANGER: "bg-red-300 text-red-700",
  CRITICAL: "bg-red-600 text-white",
  NONE: "text-white bg-green-500",
} as const;

export const getStockLevel = (inv: IInventoryItem): TStockLevel => {
  const minLv = inv.stackerMin || 0;
  const current = inv.inStacker;

  // กรณี stackerMin = 0 และ inStacker > 0 → NONE
  if (minLv === 0 && current >= 0) {
    return "NONE";
  }

  // กรณี stackerMin > 0 (กรณี ตั้ง stackerMin ให้ render ทั้งหมด)
  if (minLv > 0) {
    if (current > minLv + 20) {
      return "SAFE";
    }
    if (current > minLv + 10) {
      return "WARNING";
    }
    if (current > minLv) {
      return "DANGER";
    }
    return "CRITICAL";
  }

  // กรณี current <= 0
  return "CRITICAL";
};

export const getStockLevelStyles = (inv: IInventoryItem): string => {
  const level = getStockLevel(inv);
  return INVENTORY_COLORS[level];
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
