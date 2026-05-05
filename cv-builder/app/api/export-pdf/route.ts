import { NextResponse } from "next/server";

export async function POST() {
  // PDF export route — implemented in Phase 11
  return NextResponse.json({ message: "PDF export coming in Phase 11" }, { status: 501 });
}
