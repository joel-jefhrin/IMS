import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_CANDIDATE_URL || "http://localhost:3001",
  "http://localhost:3000", // admin app
];

const ALLOWED_HEADERS =
  "Origin, X-Requested-With, Content-Type, Accept, Authorization";
const ALLOWED_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS";

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");

  // 🔹 Preflight request
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 200 });

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
    }

    res.headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
    res.headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);
    res.headers.set("Access-Control-Allow-Credentials", "true");

    return res;
  }

  const res = NextResponse.next();

  // 🔹 Actual request
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
