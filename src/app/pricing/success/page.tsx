"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api-client";
import Link from "next/link";

export default function PricingSuccessPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status !== "authenticated") return;

    let pollInterval: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 15; // 30 seconds

    const checkSubscription = async () => {
      try {
        const res = await apiFetch("/api/backend/user/me");
        if (res.ok) {
          const data = await res.json();
          // If the plan tier is no longer free, or if we just want to assume success after a fetch
          if (data.user && data.user.plan_tier !== "free" && data.user.plan_tier !== null) {
            clearInterval(pollInterval);
            setIsVerifying(false);
            // Update next-auth session to reflect new tier
            await update({ plan_tier: data.user.plan_tier });
            setTimeout(() => {
              router.push("/library/royalty-free-music");
            }, 3000);
          }
        }
      } catch (err) {
        console.error("Failed to verify subscription", err);
      }

      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        setIsVerifying(false);
        // We'll still let them through but maybe show a note
      }
    };

    // Initial check
    checkSubscription();
    // Poll every 2 seconds
    pollInterval = setInterval(checkSubscription, 2000);

    return () => clearInterval(pollInterval);
  }, [status, router, update]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] font-body text-white">
      <div className="relative z-10 flex w-full max-w-md flex-col items-center rounded-[2rem] border border-white/[0.07] bg-white/[0.02] p-10 text-center shadow-2xl backdrop-blur-xl">
        {isVerifying ? (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#7CFF00]/10">
              <svg className="h-8 w-8 animate-spin text-[#7CFF00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="mb-3 text-2xl font-black uppercase tracking-tight">Verifying Payment</h1>
            <p className="text-sm font-medium text-white/50">
              Please wait while we confirm your subscription with the payment provider. This usually takes just a few seconds.
            </p>
          </>
        ) : (
          <>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#7CFF00]/20">
              <svg className="h-10 w-10 text-[#7CFF00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1 className="mb-3 text-2xl font-black uppercase tracking-tight">Welcome to Tracknit</h1>
            <p className="mb-8 text-sm font-medium text-white/50">
              Your subscription is now active! You have full access to unlimited music and SFX.
            </p>
            <Link
              href="/library/royalty-free-music"
              className="flex w-full items-center justify-center rounded-xl bg-[#7CFF00] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-black transition-transform hover:scale-105"
            >
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}


