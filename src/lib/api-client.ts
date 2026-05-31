import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

interface FetchOptions extends RequestInit {
  token?: string;
  skipAuth?: boolean;
}

/**
 * Standardized API client for Tracknit frontend.
 * Automatically injects the correct JWT Bearer token and targets the Cloudflare Edge Proxy.
 */
export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const { skipAuth = false, token, ...init } = options;
  const isServer = typeof window === "undefined";
  let authHeader = "";

  // 1. Resolve Auth Token if authentication isn't skipped
  if (!skipAuth) {
    if (token) {
      authHeader = `Bearer ${token}`;
    } else if (isServer) {
      // Server-side (Server Components, API routes)
      try {
        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (session?.accessToken) {
          // @ts-ignore
          authHeader = `Bearer ${session.accessToken}`;
        }
      } catch (err) {
        console.error("Failed to retrieve server-side session:", err);
      }
    } else {
      // Client-side (Browser)
      const session = await getSession();
      // @ts-ignore
      if (session?.accessToken) {
        // @ts-ignore
        authHeader = `Bearer ${session.accessToken}`;
      }
    }
  }

  // 2. Build headers
  const headers = new Headers(init.headers || {});
  if (authHeader && !headers.has("Authorization")) {
    headers.set("Authorization", authHeader);
  }
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // 3. Build absolute URL
  // If endpoint starts with http/https, use it directly. Otherwise, prefix with base API URL.
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  // Note: On the server, we need absolute URLs. 
  // Cloudflare Page edge rewrites works beautifully for browser calls, but for server-to-server calls, 
  // we must hit the actual WordPress backend directly if no local host url exists.
  let targetUrl = `${API_BASE_URL}${cleanEndpoint}`;
  if (isServer) {
    const wpBase = process.env.NEXT_PUBLIC_WP_URL || "https://your-backend-domain.com";
    targetUrl = `${wpBase}/wp-json/tracknit/v1${cleanEndpoint}`;
  }

  const response = await fetch(targetUrl, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred during the API call";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  return response;
}

/**
 * Parses JWT token payload from base64 string.
 */
export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Checks if a JWT token is structurally valid and not expired.
 */
export function isTokenValid(token: string): boolean {
  const parsed = parseJwt(token);
  if (!parsed) return false;
  const now = Math.floor(Date.now() / 1000);
  return parsed.exp ? parsed.exp > now : true;
}
