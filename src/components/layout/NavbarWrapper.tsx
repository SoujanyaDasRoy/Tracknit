"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Hide global navbar on explicit app routes (these have their own sidebar)
  const isAppRoute = 
    pathname?.startsWith("/music") || 
    pathname?.startsWith("/sfx") || 
    pathname?.startsWith("/browse") || 
    pathname?.startsWith("/library") ||
    pathname?.startsWith("/admin");

  const isAuthRoute =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register");

  if (isAppRoute || isAuthRoute) {
    return null;
  }

  return <Navbar />;
}
