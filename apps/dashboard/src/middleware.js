/**
 * @fileoverview Next.js Middleware
 * 
 * This middleware handles request interception and modification for authentication
 * and protected routes. It runs before any page or API route is executed.
 * 
 * Features:
 * - Intercepts requests to authentication and dashboard routes
 * - Can modify request/response headers
 * - Handles authentication strategy-specific logic
 * - Provides a layer of security for protected routes
 * 
 * @example
 * // The middleware will automatically run for these paths:
 * // - /auth/*
 * // - /dashboard/*
 */

import { NextResponse } from 'next/server';

/**
 * Next.js Middleware Function
 * 
 * This function is called for every request that matches the configured paths.
 * It can modify the request/response and implement authentication logic.
 * 
 * @param {Object} req - The incoming request object
 * @param {string} req.url - The URL of the request
 * @param {Object} req.headers - The request headers
 * @returns {Promise<NextResponse>} The modified response
 */
export async function middleware(req) {
  let res;

  // Currently passes through the request with original headers
  // TODO: Implement authentication strategy-specific logic
  res = NextResponse.next({ headers: req.headers });

  return res;
}

/**
 * Middleware Configuration
 * 
 * Specifies which paths the middleware should run on.
 * Currently configured to run on:
 * - /auth/* - Authentication related routes
 * - /dashboard/* - Protected dashboard routes
 */
export const config = { matcher: ['/auth/:path*', '/dashboard/:path*'] };
