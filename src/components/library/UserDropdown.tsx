"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ArrowDownToLine,
  Bookmark,
  Disc,
  Wallet,
  Activity,
  Sliders,
  Zap,
  LogOut,
  ShieldCheck,
  ChevronsUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Highest plan tier configuration
const HIGHEST_PLAN = "advanced";

// Resolves plan initials for premium cinematic styling
const getInitials = (name: string) => {
  if (!name || name.toLowerCase() === "user") return "TR"; // default initials fallback
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "TR";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Resolves subscription status text dynamically with correct grammar
const getSubscriptionText = (tier: string) => {
  const t = tier.toLowerCase();
  if (t === "free") return "Free Plan";
  
  const planNames: Record<string, string> = {
    "basic": "Basic Plan",
    "intermediate": "Intermediate Plan",
    "advanced": "Advanced Plan",
    "enterprise": "Enterprise Plan"
  };
  
  return planNames[t] || `${tier} Plan`;
};

// ─── Apple/Linear Style Premium Plan Badges ──────────────────────────────────
const renderPlanBadge = (tier: string) => {
  const isFree = tier.toLowerCase() === "free";
  const label = isFree ? "FREE" : tier.toUpperCase();
  
  return (
    <span className="inline-flex items-center justify-center px-2 py-[2.5px] rounded bg-white/[0.08] border border-white/15 text-white/80 text-[8px] font-bold tracking-widest leading-none select-none font-[Inter,sans-serif]">
      {label}
    </span>
  );
};

// ─── Avatar Component ─────────────────────────────────────────────────────────
function Avatar({ src, size = 32 }: { src?: string | null; size?: number }) {
  const isFallback = !src;
  const iconUrl = src || "";

  return (
    <div className="relative shrink-0 select-none font-[Inter,sans-serif]" style={{ width: size, height: size }}>
      {/* Subtle ambient white/grey halo lighting */}
      <div 
        className="absolute inset-0 rounded-full bg-white/[0.03] blur-[6px] opacity-80 pointer-events-none" 
        style={{ transform: "scale(1.1)" }}
      />
      <div
        style={{ width: size, height: size }}
        className={[
          "relative rounded-full flex items-center justify-center overflow-hidden transition-all duration-300",
          "bg-[#2B2D33] border border-white/[0.12]",
          "shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.08),0_2px_12px_rgba(0,0,0,0.5)]"
        ].join(" ")}
      >
        {isFallback ? (
          <span className="text-white/60 text-xs font-semibold">{getInitials("")}</span>
        ) : (
          <img 
            src={iconUrl} 
            alt="avatar" 
            className="w-full h-full object-cover transition-all duration-300"
          />
        )}
        {/* Soft metallic sheen reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Menu Row Component (Phosphor Thin style, Inter typography) ──────────────
function Row({
  href,
  icon: Icon,
  label,
  onClick,
  danger = false,
  isUpgrade = false,
}: {
  href?: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  danger?: boolean;
  isUpgrade?: boolean;
}) {
  // Soft atmospheric transitions and clean white/red styling
  const textCls = danger
    ? "text-red-400 group-hover:text-red-300 font-semibold"
    : isUpgrade
    ? "text-white group-hover:text-white font-semibold"
    : "text-[#F0F5ED]/70 group-hover:text-[#F0F5ED]";

  const iconCls = danger
    ? "text-red-400/80 group-hover:text-red-300"
    : isUpgrade
    ? "text-white/80 group-hover:text-white animate-pulse"
    : "text-[#F0F5ED]/35 group-hover:text-[#F0F5ED]/80";

  // Danger has an elegant red text + reddish background, rest is white/grey
  const bgCls = danger
    ? "bg-red-500/[0.06] border border-red-500/15 hover:bg-red-500/[0.12] hover:border-red-500/25"
    : "hover:bg-white/[0.04] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.01)] border border-transparent";

  const inner = (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-3.5 py-[8.5px] rounded-xl group transition-all duration-300 cursor-pointer focus:outline-none text-left ${bgCls}`}
    >
      <Icon strokeWidth={1.3} className={`h-[15.5px] w-[15.5px] shrink-0 transition-colors duration-300 ${iconCls}`} />
      <span className={`text-[13px] font-medium leading-none font-[Inter,sans-serif] tracking-[-0.015em] transition-colors duration-300 ${textCls} flex-1`}>
        {label}
      </span>
    </button>
  );

  return href ? <Link href={href} className="block">{inner}</Link> : inner;
}

// ─── Invisible / Minimal Separators (6% opacity) ─────────────────────────────
function Divider() {
  return <div className="h-px bg-white/[0.06] mx-2 my-1.5" />;
}

// ─── Main Component ──────────────────────────────────────────────────────────
interface UserDropdownProps {
  planTier?: string;
  variant?: "default" | "sidebar";
}

export function UserDropdown({ planTier, variant = "default" }: UserDropdownProps) {
  const { data: session } = useSession();

  // Name and plan mappings optimized for cinematic demonstration
  const name      = session?.user?.name  || "Tarun Rao";
  const email     = session?.user?.email || "tarun.rao@gmail.com";
  const avatar    = session?.user?.image;
  const tier      = planTier || (session?.user as any)?.planTier || "pro";
  const isHighest = tier.toLowerCase() === HIGHEST_PLAN;

  const isSidebar = variant === "sidebar";


  // Extracts the first name from the user name
  const firstName = name.trim().split(/\s+/)[0];

  return (
    <DropdownMenu>
      {/* ── Dropdown Trigger ── */}
      <DropdownMenuTrigger className="focus:outline-none block cursor-pointer group shrink-0 w-full">
        {isSidebar ? (
          /* Sidebar Variant: Spacious trigger displaying Avatar, First Name, and Email with optimal composition */
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#222428]/75 border border-white/[0.06] hover:bg-[#222428] hover:border-white/[0.1] transition-all duration-300 w-full text-left font-[Inter,sans-serif] shadow-lg">
            <Avatar src={avatar} size={38} />
            
            <div className="min-w-0 flex-1 flex flex-col gap-0.5">
              <h3 className="text-[13.5px] font-semibold text-[#F0F5ED] tracking-[-0.015em] leading-tight truncate">
                {firstName}
              </h3>
              <p className="text-[11px] text-[#F0F5ED]/45 tracking-[-0.01em] font-medium leading-tight truncate">
                {email}
              </p>
            </div>

            <ChevronsUpDown className="h-3.5 w-3.5 text-[#F0F5ED]/35 shrink-0 select-none ml-1 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
          </div>
        ) : (
          /* Default Header Variant: Simple circular trigger */
          <Avatar src={avatar} size={32} />
        )}
      </DropdownMenuTrigger>

      {/* ── Dropdown Content Panel ── */}
      <DropdownMenuContent
        align={isSidebar ? "start" : "end"}
        side={isSidebar ? "top" : "bottom"}
        sideOffset={isSidebar ? 12 : 10}
        className={[
          "w-[268px] p-[6px] relative overflow-hidden",
          "bg-[#222428]/98 backdrop-blur-2xl", // Lighter premium greyish dark surface
          "border border-white/[0.08]", // Thin border
          "rounded-[20px]", // Clean rounded corners
          "shadow-[0_32px_64px_rgba(4,5,6,0.85),0_8px_24px_rgba(255,255,255,0.01)]", // Soft pure-grey tinted shadow
          "select-none z-[9999]",
          "font-sans [font-family:Inter,sans-serif]", // Guaranteed Inter font throughout
        ].join(" ")}
      >
        {/* Subtle radial ambient atmosphere glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/[0.02] blur-[48px] pointer-events-none select-none" />

        {/* ── Profile Header Section ── */}
        {isSidebar ? (
          /* Sidebar Mode Header: Displays dynamic Subscription status block (NO duplicate name/email) */
          <div className="relative z-10 flex flex-col px-3.5 pt-3.5 pb-3 border-b border-white/[0.05] mb-1 font-[Inter,sans-serif]">
            <p className="text-[11px] text-[#F0F5ED]/60 tracking-[-0.01em] font-medium leading-normal select-none">
              {getSubscriptionText(tier)}
            </p>
          </div>
        ) : (
          /* Default Mode Header: Standard initials/name layout with Email */
          <div className="relative z-10 flex items-center gap-3.5 px-3.5 py-3 border-b border-white/[0.05] mb-1 font-[Inter,sans-serif]">
            <Avatar src={avatar} size={38} />
            
            <div className="flex flex-col min-w-0 flex-1 gap-[3px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <h3 className="text-[13.5px] font-semibold text-[#F0F5ED] tracking-[-0.015em] leading-tight truncate">
                  {name}
                </h3>
                {renderPlanBadge(tier)}
              </div>
              <p className="text-[11px] text-[#F0F5ED]/45 tracking-[-0.01em] font-medium leading-none truncate">
                {email}
              </p>
            </div>

            <ChevronsUpDown className="h-3.5 w-3.5 text-[#F0F5ED]/35 shrink-0 select-none ml-1" strokeWidth={1.5} />
          </div>
        )}

        {/* ── Group 1: Workspace & Settings ── */}
        <div className="relative z-10 flex flex-col gap-[1px] font-[Inter,sans-serif]">
          <Row href="/my-account" icon={Sliders} label="Settings" />
          <Row href="/my-account" icon={Activity} label="Subscription" />
          <Row href="/my-account" icon={Wallet} label="Billing" />
        </div>

        <Divider />

        {/* ── Group 2: Library Assets ── */}
        <div className="relative z-10 flex flex-col gap-[1px] font-[Inter,sans-serif]">
          <Row href="/library/downloads" icon={ArrowDownToLine} label="Downloads" />
          <Row href="/library/liked" icon={Bookmark} label="Favorites" />
          <Row href="/library/collections" icon={Disc} label="Playlists" />
          <Row href="/library/whitelist" icon={ShieldCheck} label="Clearance Whitelist" />
        </div>

        {/* ── Group 3: Upgrades & Session ── */}
        {!isHighest && (
          <>
            <Divider />
            <Row href="/pricing" icon={Zap} label="Upgrade Plan" isUpgrade />
          </>
        )}

        <Divider />

        <div className="font-[Inter,sans-serif]">
          <Row
            icon={LogOut}
            label="Log out"
            danger
            onClick={() => signOut({ callbackUrl: "/" })}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
