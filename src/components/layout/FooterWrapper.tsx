"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  const isAppRoute = 
    pathname?.startsWith("/music") || 
    pathname?.startsWith("/sfx") || 
    pathname?.startsWith("/browse") || 
    pathname?.startsWith("/library") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/my-account");

  const isAuthRoute =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register");

  if (isAppRoute || isAuthRoute) {
    return null;
  }

  return <Footer />;
}
