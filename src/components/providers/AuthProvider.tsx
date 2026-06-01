"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // Proactively refresh the session every 55 minutes so the NextAuth cookie is 
  // updated before the 1-hour WordPress JWT access token expires.
  return <SessionProvider refetchInterval={55 * 60}>{children}</SessionProvider>;
}
