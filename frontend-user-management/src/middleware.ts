import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log('🔍 Middleware triggered for:', pathname);

  // Apply middleware only to /store-management routes
  if (!pathname.startsWith('/store-management')) {
    return NextResponse.next();
  }

  const jwtToken = request.cookies.get('better-auth.jwt')?.value;

  // 1. Authentication Check
  if (!jwtToken) {
    console.log('❌ No JWT token found, redirecting to login');
    if (pathname !== '/store-management/login' && pathname !== '/store-management/signup') {
      return NextResponse.redirect(new URL('/store-management/login', request.url));
    }
    return NextResponse.next();
  }

  console.log('✅ JWT token found');

  // 2. Store Existence Check (if authenticated)
  try {
    // ✅ FIX: Route through the Ingress using the request's host header
    // This uses the same path the browser uses, ensuring consistency
    const host = request.headers.get('host') || 'localhost';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const apiUrl = `${protocol}://${host}/api/stores/has-store`;
    
    console.log('🔗 Calling API:', apiUrl);

    const hasStoreRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('📡 API Response status:', hasStoreRes.status);

    let hasStore = false;
    if (hasStoreRes.ok) {
      const data = await hasStoreRes.json();
      hasStore = data.hasStore as boolean;
      console.log('🏪 Has store:', hasStore);
    } else {
      const errorText = await hasStoreRes.text();
      console.error('❌ Failed to fetch has-store status:', hasStoreRes.status, errorText);
      hasStore = false;
    }

    if (!hasStore) {
      console.log('⚠️ User has no store');
      const allowedPathsWithoutStore = [
        '/store-management/login',
        '/store-management/dashboard',
        '/store-management/settings/profile',
        '/store-management/settings/change-password',
        '/store-management/signup',
        '/store-management/create-store',
      ];

      if (!allowedPathsWithoutStore.includes(pathname)) {
        console.log('📄 Redirecting to dashboard (no store access)');
        return NextResponse.redirect(new URL('/store-management/dashboard', request.url));
      }
      console.log('✅ Path allowed without store');
    } else {
      console.log('✅ User has store, allowing access');
    }
  } catch (error) {
    console.error('💥 Error in middleware:', error);
    const fallbackAllowedPaths = [
      '/store-management/login',
      '/store-management/dashboard',
      '/store-management/settings/profile',
      '/store-management/settings/change-password',
      '/store-management/signup',
      '/store-management/create-store',
    ];

    if (!fallbackAllowedPaths.includes(pathname)) {
      console.log('📄 Redirecting to dashboard (error fallback)');
      return NextResponse.redirect(new URL('/store-management/dashboard', request.url));
    }
  }

  console.log('✅ Middleware passed, continuing to page');
  return NextResponse.next();
}

export const config = {
  matcher: '/store-management/:path*',
};