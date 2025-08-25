// app/api/employees/route.ts
import { NextResponse } from "next/server";
import { getEmployeeList } from "@/lib/actions/api-employee.action";

export async function GET() {
  const result = await getEmployeeList();
  return NextResponse.json(result);
}
