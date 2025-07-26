import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

  return NextResponse.json({ ip });
}
