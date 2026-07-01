import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lightweight JWT decode (no crypto verify — just read the payload).
// This is safe enough for middleware redirect decisions; Supabase still
// validates the token on every API call inside the page/component.
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Base64url → Base64 → JSON
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(b64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenValid(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  // Check expiry (exp is in seconds)
  const exp = payload['exp'] as number | undefined;
  if (!exp) return false;
  return Date.now() / 1000 < exp;
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // Check if host is admin subdomain (e.g. admin.localhost:3000, admin.tassofly.com)
  const isAdminSubdomain = hostname.startsWith('admin.');

  // If accessing via the subdomain, map path '/' to '/admin' and other paths like '/login' to '/admin/login'
  let targetPath = pathname;
  if (isAdminSubdomain) {
    if (!pathname.startsWith('/admin')) {
      targetPath = `/admin${pathname === '/' ? '' : pathname}`;
    }
  }

  // Auth protection for target paths starting with /admin
  if (targetPath.startsWith('/admin')) {
    // Exclude /admin/login from auth check to prevent infinite redirect loops
    if (targetPath === '/admin/login') {
      if (isAdminSubdomain) {
        url.pathname = '/admin/login';
        return NextResponse.rewrite(url);
      }
      return NextResponse.next();
    }

    // Read Supabase access token from cookie
    // Supabase stores session as "sb-<ref>-auth-token" but we also check legacy "sb-access-token"
    const token =
      request.cookies.get('sb-access-token')?.value ||
      // Supabase v2 stores as JSON array in "sb-<project>-auth-token"
      (() => {
        for (const [key, cookie] of request.cookies) {
          if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
            try {
              const parsed = JSON.parse(cookie.value);
              return Array.isArray(parsed) ? parsed[0] : parsed?.access_token;
            } catch {
              return cookie.value;
            }
          }
        }
        return undefined;
      })();

    const authenticated = token ? isTokenValid(token) : false;

    if (!authenticated) {
      const loginPath = '/admin/login';
      const redirectUrl = new URL(loginPath, request.url);
      if (isAdminSubdomain) {
        redirectUrl.hostname = hostname.split(':')[0];
        redirectUrl.pathname = '/login';
      }
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Logged-in on admin subdomain — rewrite to internal /admin/* path
    if (isAdminSubdomain) {
      url.pathname = targetPath;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|_static|[\\w-]+\\.\\w+).*)',
  ],
};
