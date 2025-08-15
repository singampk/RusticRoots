export { default } from 'next-auth/middleware';

export const config = { 
  matcher: [
    /*
     * Only protect specific admin routes and authenticated user routes
     * Let public pages like home, products, about etc be accessible without auth
     */
    '/admin/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/checkout/:path*'
  ],
};