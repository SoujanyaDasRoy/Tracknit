import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { cache } from "react";

export const getCachedServerSession = cache(async () => {
  return await getServerSession(authOptions);
});

const API_BASE_URL = "/api/backend";

interface FetchOptions extends RequestInit {
  token?: string;
  skipAuth?: boolean;
}

// Client-side in-memory token cache to prevent redundant session network calls
let cachedToken: string | null = null;
let tokenExpiry = 0;

/**
 * Standardized API client for Tracknit frontend.
 * - Automatically injects the correct JWT Bearer token.
 * - Uses client-side token memoization to avoid redundant session fetches.
 * - Routes browser queries through a same-origin proxy (/api/backend) to eliminate CORS errors.
 * - Server components query the backend directly using microsecond-revalidated fetch layers.
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
        const session = await getCachedServerSession();
        // @ts-ignore
        if (session?.accessToken) {
          // @ts-ignore
          authHeader = `Bearer ${session.accessToken}`;
        }
      } catch (err) {
        console.error("Failed to retrieve server-side session:", err);
      }
    } else {
      // Client-side (Browser) with in-memory memoization
      const now = Math.floor(Date.now() / 1000);
      if (cachedToken && tokenExpiry > now) {
        authHeader = `Bearer ${cachedToken}`;
      } else {
        try {
          const session = await getSession();
          // @ts-ignore
          if (session?.accessToken) {
            // @ts-ignore
            cachedToken = session.accessToken as string;
            const parsed = parseJwt(cachedToken);
            tokenExpiry = parsed?.exp ? parsed.exp - 30 : now + 60; // safe 30s buffer before expiry
            authHeader = `Bearer ${cachedToken}`;
          }
        } catch (err) {
          console.error("Failed to retrieve client-side session:", err);
        }
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

  // 3. Build absolute/proxied URL
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let targetUrl = `${API_BASE_URL}${cleanEndpoint}`;
  
  if (isServer) {
    // Server Components fetch directly from the absolute WordPress API domain
    const wpBase = process.env.NEXT_PUBLIC_WP_URL || "https://api.tracknit.com";
    targetUrl = `${wpBase}/wp-json/tracknit/v1${cleanEndpoint}`;
  }

  // 4. Smart caching configurations
  // Non-GET requests (mutations) bypass cache completely. GET requests revalidate every 60s.
  const defaultCacheOptions = init.method && init.method !== "GET"
    ? { cache: "no-store" as RequestCache }
    : { next: { revalidate: 60 } };

  const fetchOptions = {
    ...defaultCacheOptions,
    ...init,
    headers,
  };

  const response = await fetch(targetUrl, fetchOptions);

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
