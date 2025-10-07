import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Apply middleware only to /store-management routes
  if (!pathname.startsWith('/store-management')) {
    return NextResponse.next();
  }

  const jwtToken = request.cookies.get('better-auth.jwt')?.value;

  // 1. Authentication Check
  if (!jwtToken) {
    if (pathname !== '/store-management/login' && pathname !== '/store-management/signup') {
      return NextResponse.redirect(new URL('/store-management/login', request.url));
    }
    return NextResponse.next(); // Allow access to login page if not authenticated
  }

  // 2. Store Existence Check (if authenticated)
  try {
    const hasStoreRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores/has-store`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Accept': 'application/json',
      },
      // credentials: 'include', // Not needed for server-side fetch in middleware
      cache: 'no-store',
    });

    let hasStore = false;
    if (hasStoreRes.ok) {
      const data = await hasStoreRes.json();
      hasStore = data.hasStore as boolean;
    } else {
      console.error('Failed to fetch has-store status:', hasStoreRes.status, await hasStoreRes.text());
      // Treat as no store if API call fails for security
      hasStore = false; 
    }

    if (!hasStore) {
      const allowedPathsWithoutStore = [
        '/store-management/login',
        '/store-management/dashboard',
        '/store-management/settings/profile',
        '/store-management/settings/change-password',
        '/store-management/signup',
      ];

      if (!allowedPathsWithoutStore.includes(pathname)) {
        return NextResponse.redirect(new URL('/store-management/dashboard', request.url));
      }
    }
  } catch (error) {
    console.error('Error checking store status in middleware:', error);
    // If there's an error, redirect to dashboard as a fallback
    if (pathname !== '/store-management/login' && pathname !== '/store-management/dashboard' && pathname !== '/store-management/settings/profile' && pathname !== '/store-management/settings/change-password' && pathname !== '/store-management/signup') {
      return NextResponse.redirect(new URL('/store-management/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/store-management/:path*',
};