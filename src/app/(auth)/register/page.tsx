"use client";

import React from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

/* ─── Brand Icons ────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] flex-shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] flex-shrink-0" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] flex-shrink-0" fill="#5865F2">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

/* ─── Social Sign-in Button ──────────────────────────────────── */
function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3.5 px-5 py-4 bg-white text-black font-semibold text-[14.5px] rounded-[3px] hover:bg-[#f3f3f5] active:scale-[0.99] transition-all cursor-pointer shadow-sm select-none border border-neutral-100"
    >
      {icon}
      <span>Continue with {label}</span>
    </button>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-[#08080a] font-body">
      {/* ── LEFT PANEL — 35% Width Dark Auth Sidebar ────────── */}
      <div className="w-full md:w-[35%] flex-shrink-0 min-h-screen bg-[#08080a] px-8 sm:px-12 md:px-14 py-12 flex flex-col justify-between relative z-10 border-r border-neutral-900">
        
        {/* Top: Official Large Green Logo */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 mb-14">
            <img 
              src="/logo-header.png" 
              alt="Tracknit" 
              className="h-[52px] w-auto object-contain" 
            />
          </Link>
        </div>

        {/* Center: Form / Register Header & Actions */}
        <div className="my-auto py-8">
          <h1 className="font-display font-black tracking-tight text-white mb-2 leading-[1.0] text-[44px]">
            REGISTER
          </h1>
          
          <p className="text-[14px] text-neutral-400 mb-8 font-normal">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="text-[#7CFF00] underline underline-offset-4 hover:text-[#9cff33] transition-colors font-semibold"
            >
              Log in
            </Link>
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 max-w-[360px]">
            <SocialButton 
              icon={<GoogleIcon />} 
              label="Google" 
              onClick={() => signIn("google", { callbackUrl: "/pricing" })} 
            />
            <SocialButton 
              icon={<AppleIcon />} 
              label="Apple" 
              onClick={() => signIn("apple", { callbackUrl: "/pricing" })} 
            />
            <SocialButton 
              icon={<DiscordIcon />} 
              label="Discord" 
              onClick={() => signIn("discord", { callbackUrl: "/pricing" })} 
            />
          </div>
        </div>

        {/* Bottom: Minimal Footer & Terms */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col gap-6">
          <div className="text-[11.5px] text-neutral-500 leading-relaxed font-normal">
            By continuing you agree to our{" "}
            <Link 
              href="/terms" 
              className="text-neutral-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link 
              href="/privacy" 
              className="text-neutral-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              Privacy Policy
            </Link>.
          </div>
          
          <div className="flex items-center justify-between text-[13px]">
            <Link 
              href="/" 
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>←</span> Back to home
            </Link>
          </div>
        </div>

      </div>

      {/* ── RIGHT PANEL — 65% Width High Contrast Bright Art ────────── */}
      <div className="hidden md:block w-[65%] relative bg-neutral-950 overflow-hidden select-none">
        <img
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1800&q=90"
          alt="Bright aesthetic sunlit music studio room with green tropical plants and audio equipment"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
        {/* Subtle, clean left shadow gradient to prevent visual harshness */}
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-black/20 to-transparent w-32" />
      </div>
    </div>
  );
}
