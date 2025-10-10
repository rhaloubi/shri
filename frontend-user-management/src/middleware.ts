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
    // ✅ Use Kubernetes DNS to reach API Gateway service directly
    const apiUrl = `http://api-gateway-service/api/stores/has-store`;
    
    console.log('🔗 Calling API Gateway:', apiUrl);

    const hasStoreRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
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
    console.error('💥 Error message:', (error as any)?.message);
    console.error('💥 Error code:', (error as any)?.code);
    
    // If it's a timeout or network error, still allow access to dashboard
    // This prevents users from being locked out due to temporary API issues
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
    
    console.log('✅ Path allowed in fallback mode (API error)');
  }

  console.log('✅ Middleware passed, continuing to page');
  return NextResponse.next();
}

export const config = {
  matcher: '/store-management/:path*',
};