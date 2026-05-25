import { NextResponse } from "next/server";
import { getControlCenterData } from "@/lib/controlCenterData";

export async function GET() {
  const data = await getControlCenterData();
  return NextResponse.json(data);
}
