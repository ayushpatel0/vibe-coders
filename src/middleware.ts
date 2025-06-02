import { NextResponse, NextRequest } from 'next/server'

const protectedRoutes = ['/code-gen', '/pic-site', '/profile', '/welcome'];
 
export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    
    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
      path === route || path.startsWith(`${route}/`)
    );
    
    // Only apply token check for protected routes
    if (isProtectedRoute) {
      const token = request.cookies.get("token")?.value || 
                   request.headers.get("Authorization")?.split(" ")[1] || 
                   null;
      
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
    
    // Either not a protected route or token exists
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Configure the matcher to only run on protected routes
export const config = {
  matcher: [
    '/code-gen/:path*',
    '/pic-site/:path*',
    '/profile/:path*',
    '/dashboard/:path*',
    '/welcome/:path*',
  ]
}