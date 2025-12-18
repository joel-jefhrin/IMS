import { NextResponse } from 'next/server';

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_CANDIDATE_URL || 'http://localhost:3001';
const ALLOWED_HEADERS = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
const ALLOWED_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';

export function middleware(request: Request) {
  const origin = request.headers.get('origin') || '';

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    const preflight = new NextResponse(null, { status: 200 });
    preflight.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    preflight.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS);
    preflight.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS);
    preflight.headers.set('Access-Control-Allow-Credentials', 'true');
    return preflight;
  }

  const response = NextResponse.next();

  // Apply CORS headers for API responses
  if (origin === ALLOWED_ORIGIN) {
    response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    response.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS);
    response.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};

