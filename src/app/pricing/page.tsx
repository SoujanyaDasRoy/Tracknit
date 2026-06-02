"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";

// ... existing types and data arrays ...
type BillingCycle = "monthly" | "yearly";
type RegionCode = "IN" | "US";
type CompareValue = "check" | "dash" | string;

type PlanPrice = {
  inCurrency: string;
  usCurrency: string;
  inMonthly: string;
  inYearly: string;
  usMonthly: string;
  usYearly: string;
};

type PricingPlan = {
  key: string;
  eyebrow: string;
  name: string;
  description: string;
  ctaPrompt: string;
  features: string[];
  channelNote: string;
  href: string;
  buttonLabel: string;
  popular?: boolean;
  custom?: boolean;
  price?: PlanPrice;
  displayPrice?: { currency: string; amount: string } | null;
};

type CompareSection = {
  title: string;
  rows: {
    label: string;
    values: [CompareValue, CompareValue, CompareValue, CompareValue];
    subtle?: boolean;
  }[];
};

const pricingPlans: PricingPlan[] = [
  {
    key: "basic",
    eyebrow: "Solo Creators",
    name: "Basic",
    description: "Perfect for individual content creators and YouTubers starting their journey.",
    ctaPrompt: "Start clearing claims from your very first upload.",
    features: ["Unlimited Music & SFX", "Personal Social Media", "1 Channel per platform"],
    channelNote: "1 channel = 1 platform (e.g. YouTube channel OR TikTok account)",
    href: "/register",
    buttonLabel: "Get Started",
    price: {
      inCurrency: "₹",
      usCurrency: "$",
      inMonthly: "300",
      inYearly: "2520",
      usMonthly: "14.99",
      usYearly: "89.88",
    },
  },
  {
    key: "intermediate",
    eyebrow: "Freelancers & Teams",
    name: "Intermediate",
    description: "Ideal for professional freelancers, small teams and digital marketing.",
    ctaPrompt: "Unlock client work and commercial use in one move.",
    features: ["Everything in Basic", "Freelance / Client Work", "Digital Ads & Commercials"],
    channelNote: "Link up to 3 channels across any platform mix",
    href: "/register",
    buttonLabel: "Get Started",
    popular: true,
    price: {
      inCurrency: "₹",
      usCurrency: "$",
      inMonthly: "599",
      inYearly: "3599",
      usMonthly: "34.99",
      usYearly: "203.88",
    },
  },
  {
    key: "advanced",
    eyebrow: "Agencies & Brands",
    name: "Advanced",
    description: "Complete solution for agencies, brands and large-scale commercial use.",
    ctaPrompt: "Step into full commercial coverage with room to scale.",
    features: ["Everything in Intermediate", "Full Commercial Licensing", "Agency Client Work"],
    channelNote: "Unlimited channels across all platforms",
    href: "/register",
    buttonLabel: "Get Started",
    price: {
      inCurrency: "₹",
      usCurrency: "$",
      inMonthly: "1099",
      inYearly: "6599",
      usMonthly: "59.99",
      usYearly: "359.88",
    },
  },
  {
    key: "enterprise",
    eyebrow: "Broadcast & Custom",
    name: "Enterprise",
    description: "Custom licensing for broadcast and large teams.",
    ctaPrompt: "Custom rights for broadcast and teams.",
    features: ["Custom Everything", "Unlimited Users", "TV / Broadcast Rights"],
    channelNote: "Unlimited + custom channel strategy support",
    href: "/contact",
    buttonLabel: "Talk to Us",
    custom: true,
  },
];

const socialStats = [
  { value: "50K+", label: "Creators" },
  { value: "2M+", label: "Claims Cleared" },
  { value: "180+", label: "Countries" },
];

const comparisonPlans = [
  { name: "Basic", eyebrow: "Solo Creators", popular: false },
  { name: "Intermediate", eyebrow: "Freelancers & Teams", popular: true },
  { name: "Advanced", eyebrow: "Agencies & Brands", popular: false },
  { name: "Enterprise", eyebrow: "Broadcast & Custom", popular: false },
];

const comparisonSections: CompareSection[] = [
  {
    title: "Core Content",
    rows: [
      { label: "Unlimited Music & SFX", values: ["check", "check", "check", "check"] },
      { label: "High-Fidelity Downloads", values: ["check", "check", "check", "check"] },
    ],
  },
  {
    title: "Licensing & Usage",
    rows: [
      { label: "Personal Social Media", values: ["check", "check", "check", "check"] },
      { label: "Podcast & Vlogs", values: ["check", "check", "check", "check"] },
      { label: "Client / Freelance Work", values: ["dash", "check", "check", "check"] },
      { label: "Paid Ads & Promotion", values: ["dash", "check", "check", "check"] },
      { label: "National TV & Broadcast", values: ["dash", "dash", "dash", "check"] },
    ],
  },
  {
    title: "Account & Assets",
    rows: [
      { label: "Channel Whitelisting", values: ["1", "3", "Unlimited", "Unlimited"] },
      {
        label: "= 1 platform account per channel",
        values: ["check", "check", "check", "check"],
        subtle: true,
      },
      { label: "User Seats", values: ["1", "3", "5", "Custom"] },
      { label: "Standard Support", values: ["check", "check", "check", "check"] },
      { label: "VIP / Dedicated Support", values: ["dash", "dash", "check", "check"] },
    ],
  },
];

const faqs = [
  {
    question: "Can I monetize YouTube videos with Tracknit music?",
    answer:
      "Absolutely. All Tracknit music is white-listed for monetization. As long as your channel is linked in your dashboard, you can monetize your videos without receiving copyright claims.",
  },
  {
    question: "What happens if I cancel my subscription?",
    answer:
      "Every video published while your subscription is active remains cleared forever. You only lose rights for new projects published after your subscription ends.",
  },
  {
    question: "Can I use Tracknit music for client work?",
    answer:
      "Yes, client work and broader commercial usage are supported from Intermediate and Advanced tiers depending on the campaign scope.",
  },
  {
    question: "Are sound effects included in the subscription?",
    answer:
      "Yes. All plans include unlimited access to our high-fidelity SFX library alongside music downloads.",
  },
];

function getPlanDisplayPrice(plan: PricingPlan, billingCycle: BillingCycle, region: RegionCode) {
  if (!plan.price) return null;

  const currency = region === "IN" ? plan.price.inCurrency : plan.price.usCurrency;
  const amount =
    region === "IN"
      ? billingCycle === "yearly"
        ? plan.price.inYearly
        : plan.price.inMonthly
      : billingCycle === "yearly"
        ? plan.price.usYearly
        : plan.price.usMonthly;

  return { currency, amount };
}

function renderCompareValue(value: CompareValue, highlighted: boolean) {
  if (value === "check") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`h-[15px] w-[15px] fill-none stroke-2 ${highlighted ? "text-[#7CFF00]" : "text-white/80"}`}
      >
        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (value === "dash") {
    return <span className="text-white/20">-</span>;
  }

  return (
    <span className={`text-sm font-semibold ${highlighted ? "text-[#7CFF00]" : "text-white/72"}`}>
      {value}
    </span>
  );
}

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [region, setRegion] = useState<RegionCode>("US");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
  console.log("=================================");
  console.log("NEXTAUTH DEBUG");
  console.log("STATUS:", status);
  console.log("SESSION:", session);
  console.log("ACCESS TOKEN:", (session as any)?.accessToken);
  console.log("USER:", session?.user);
  console.log("=================================");
}, [session, status]);

  useEffect(() => {
    let active = true;

    fetch(`https://get.geojs.io/v1/ip/country?_=${Date.now()}`, { cache: "no-store" })
      .then((response) => response.text())
      .then((code) => {
        if (!active) return;
        const normalized = code.trim().toUpperCase();
        setRegion(normalized === "IN" ? "IN" : "US");
      })
      .catch(() => {
        if (!active) return;
        setRegion("US");
      });

    return () => {
      active = false;
    };
  }, []);

  const handleCheckout = async (plan: PricingPlan) => {
    // Debug logging for checkout flow
    console.log('[Checkout] Starting checkout for plan:', plan.key);
    console.log('[Checkout] Session status:', status);
    console.log('[Checkout] Has accessToken:', !!(session as any)?.accessToken);

    if (plan.custom) {
      router.push(plan.href);
      return;
    }

    if (!session) {
      router.push(`/register?redirect=/pricing`);
      return;
    }

    if (!(session as any)?.accessToken) {
      router.push(`/login?redirect=/pricing`);
      return;
    }

    try {
      setLoadingPlan(plan.key);

      console.log('[Checkout] Calling API with:', {
        plan_tier: plan.key,
        billing_period: billingCycle,
        country_code: region,
      });

      const res = await apiFetch('/checkout/create', {
        method: 'POST',
        body: JSON.stringify({
          plan_tier: plan.key,
          billing_period: billingCycle,
          country_code: region,
        }),
      });

      console.log('[Checkout] API Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[Checkout] API Error:', res.status, errorText);
        throw new Error(`Failed to create checkout session (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      console.log('[Checkout] API Response data:', data);

      if (data.checkout_url) {
        console.log('[Checkout] Redirecting to:', data.checkout_url);
        window.location.href = data.checkout_url;
      } else {
        console.error('[Checkout] No checkout_url in response:', data);
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('[Checkout] Full error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert("Checkout error: " + errorMessage);
    } finally {
      setLoadingPlan(null);
    }
  };

  const isYearly = billingCycle === "yearly";
  const locationLabel = region === "IN" ? "India Pricing" : "Global Pricing";

  const cards = useMemo(
    () =>
      pricingPlans.map((plan) => ({
        ...plan,
        displayPrice: getPlanDisplayPrice(plan, billingCycle, region),
      })),
    [billingCycle, region],
  );

  return (
    <div className="bg-[#050505] font-body text-white">
      <section className="relative overflow-hidden px-6 pb-12 pt-32 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7CFF00]/5 blur-[140px]" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center">
          <h1 className="mx-auto max-w-4xl text-center text-[clamp(40px,5vw,64px)] font-black leading-[1] tracking-[-0.04em] text-white">
            License music without
            <br />
            copyright <span className="text-[#7CFF00]">stress</span>
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-[18px] font-medium leading-relaxed text-white/60">
            Unlimited downloads. Safe for monetization. Clear usage rights.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-[16px] font-medium leading-relaxed text-white/40">
            Stop worrying about copyright. Start creating.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] p-1.5">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-8 py-3 text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  !isYearly ? "bg-white text-black" : "bg-transparent text-white/50 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`rounded-full px-8 py-3 text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  isYearly ? "bg-[#7CFF00] text-black" : "bg-transparent text-white/50 hover:text-white"
                }`}
              >
                Yearly
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              <span className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>{locationLabel}</span>
              </span>
              <span className="text-[#7CFF00]/80">Save around 17% yearly</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="mx-auto grid max-w-[1480px] gap-4 px-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((plan) => (
            <div key={plan.key} className="relative flex h-full flex-col">
              <div
                className={`relative flex h-full flex-col rounded-[2rem] border px-7 pb-7 pt-10 transition-transform duration-300 ${
                  plan.popular
                    ? "border-[#7CFF00]/40 bg-white/[0.02] shadow-[0_26px_80px_-52px_rgba(124,255,0,0.26),0_0_0_1px_rgba(124,255,0,0.06)]"
                    : "border-white/[0.07] bg-white/[0.02] shadow-[0_20px_60px_-50px_rgba(124,255,0,0.08),0_0_0_1px_rgba(124,255,0,0.03)]"
                } hover:-translate-y-1`}
              >
                <span
                  className={`mb-3 text-[10px] font-black uppercase tracking-[0.24em] ${
                    plan.popular ? "text-white/60" : "text-white/35"
                  }`}
                >
                  {plan.eyebrow}
                </span>

                <h2 className="text-[30px] font-black leading-[1.2] tracking-[-0.05em] text-white">{plan.name}</h2>
                <p
                  className={`mt-3 min-h-[72px] text-[15px] font-medium leading-[1.6] ${
                    plan.popular ? "text-white/70" : "text-white/45"
                  }`}
                >
                  {plan.description}
                </p>

                <div className="my-6 flex items-baseline gap-1">
                  {plan.custom ? (
                    <span className="text-[48px] font-black leading-none tracking-[-0.05em] text-white">Custom</span>
                  ) : (
                    <>
                      <span className="text-[48px] font-black leading-none tracking-[-0.05em] text-white">
                        {plan.displayPrice?.currency}
                      </span>
                      <span className="text-[48px] font-black leading-none tracking-[-0.05em] text-white">
                        {plan.displayPrice?.amount}
                      </span>
                      <span className={`text-sm ${plan.popular ? "text-white/68" : "text-white/40"}`}>
                        {isYearly ? "/yr" : "/mo"}
                      </span>
                    </>
                  )}
                </div>

                <p
                  className={`mb-6 text-[11px] font-black uppercase tracking-[0.2em] ${
                    plan.popular ? "text-white/52" : "text-white/30"
                  }`}
                >
                  {plan.custom ? "Custom Licensing" : isYearly ? "Billed Yearly" : "Billed Monthly"}
                </p>

                <p
                  className={`mb-6 min-h-[72px] text-[15px] font-medium leading-[1.6] ${
                    plan.popular ? "text-white/82" : "text-white/80"
                  }`}
                >
                  {plan.ctaPrompt}
                </p>

                <button
                  onClick={() => handleCheckout(plan)}
                  disabled={loadingPlan === plan.key}
                  className="mb-6 flex w-full items-center justify-center rounded-2xl border border-white bg-white py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-black transition-colors hover:bg-white/90 disabled:opacity-70"
                >
                  {loadingPlan === plan.key ? (
                    <svg className="h-4 w-4 animate-spin text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                  ) : (
                    plan.buttonLabel
                  )}
                </button>

                <div className="mb-3 border-t border-white/[0.06] pt-5">
                  <ul className="flex flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-center gap-3 text-sm font-medium ${plan.popular ? "text-white/82" : "text-white/65"}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-auto text-[10px] font-medium leading-[1.625] text-white/25">{plan.channelNote}</p>
              </div>
            </div>
          ))}
        </div>
      </section>



      <section className="mx-auto mt-10 max-w-[1480px] px-6 pb-16">
        <div className="overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#0b0d11]">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-6 py-5 lg:px-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Compare</p>
              <h2 className="mt-2 text-2xl font-black leading-none tracking-[-0.04em] text-white">Plan details</h2>
            </div>
            <p className="hidden text-sm font-medium text-white/40 lg:block">
              A quick side-by-side view of the essentials.
            </p>
          </div>

          <div className="hidden lg:grid lg:grid-cols-[280px_repeat(4,minmax(0,1fr))]">
            <div className="flex items-center border-r border-white/[0.07] bg-[#090b0e] px-8 py-5 text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
              Features
            </div>
            {comparisonPlans.map((plan, colIndex) => (
              <div
                key={`desktop-header-${plan.name}`}
                className={`flex items-center justify-center bg-[#090b0e] px-5 py-5 text-sm font-semibold ${colIndex === 1 ? "text-[#7CFF00]" : "text-white/70"} ${
                  colIndex !== comparisonPlans.length - 1 ? "border-r border-white/[0.07]" : ""
                }`}
              >
                {plan.name}
              </div>
            ))}

            {comparisonSections.map((section) => (
              <Fragment key={`section-${section.title}`}>
                <div className="border-r border-t border-white/[0.07] bg-[#090b0e] px-8 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-[#7CFF00]/80">
                  {section.title}
                </div>
                {comparisonPlans.map((_, colIndex) => (
                  <div
                    key={`${section.title}-blank-${colIndex}`}
                    className={`border-t border-white/[0.07] px-5 py-4 ${
                      colIndex === 1 ? "bg-[#7CFF00]/[0.03]" : "bg-white/[0.01]"
                    } ${colIndex !== comparisonPlans.length - 1 ? "border-r border-white/[0.07]" : ""}`}
                  />
                ))}

                {section.rows.map((row, rowIndex) => {
                  const isAlt = rowIndex % 2 === 1;
                  return (
                    <Fragment key={`${section.title}-${row.label}`}>
                      <div
                        className={`border-r border-t border-white/[0.07] px-8 py-4 ${
                          row.subtle
                            ? "text-[11px] font-normal italic text-white/38"
                            : `text-sm font-medium ${isAlt ? "bg-white/[0.02] text-white/72" : "text-white/58"}`
                        }`}
                      >
                        {row.label}
                      </div>
                      {row.values.map((value, colIndex) => {
                        const cellTone =
                          colIndex === 1
                            ? isAlt
                              ? "bg-[#7CFF00]/[0.025]"
                              : "bg-[#7CFF00]/[0.03]"
                            : isAlt
                              ? "bg-white/[0.02]"
                              : "";

                        return (
                          <div
                            key={`${section.title}-${row.label}-${colIndex}`}
                            className={`flex items-center justify-center border-t border-white/[0.07] px-5 py-4 ${cellTone} ${
                              colIndex !== comparisonPlans.length - 1 ? "border-r border-white/[0.07]" : ""
                            }`}
                          >
                            {renderCompareValue(value, colIndex === 1)}
                          </div>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </Fragment>
            ))}
          </div>

          <div className="lg:hidden">
            {comparisonPlans.map((plan, planIndex) => (
              <div key={`mobile-${plan.name}`} className="border-t border-white/[0.07] first:border-t-0">
                <div className="flex items-center justify-between px-6 py-5">
                  <div>
                    <p
                      className={`text-[10px] font-black uppercase tracking-[0.24em] ${
                        plan.popular ? "text-[#7CFF00]/90" : "text-white/35"
                      }`}
                    >
                      {plan.eyebrow}
                    </p>
                    <h3 className="mt-2 text-2xl font-black leading-none tracking-[-0.04em] text-white">{plan.name}</h3>
                  </div>
                  {plan.popular && (
                    <span className="rounded-full bg-[#7CFF00] px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-black">
                      Popular
                    </span>
                  )}
                </div>

                <div className="border-t border-white/[0.06]">
                  {comparisonSections.map((section) => (
                    <Fragment key={`mobile-section-${plan.name}-${section.title}`}>
                      <div className="px-6 pb-2 pt-6 text-[10px] font-black uppercase tracking-[0.24em] text-[#7CFF00]/80">
                        {section.title}
                      </div>
                      {section.rows.map((row) => (
                        <div
                          key={`mobile-row-${plan.name}-${row.label}`}
                          className={`flex items-center justify-between gap-4 border-t border-white/[0.05] px-6 ${
                            row.subtle ? "py-2" : "py-4"
                          }`}
                        >
                          <span
                            className={`max-w-[72%] leading-relaxed ${
                              row.subtle
                                ? "text-[11px] font-normal italic text-white/38"
                                : "text-sm font-medium text-white/62"
                            }`}
                          >
                            {row.label}
                          </span>
                          {renderCompareValue(row.values[planIndex], plan.popular)}
                        </div>
                      ))}
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="relative overflow-hidden bg-[#E5E5E5] px-6 pb-28 pt-20 text-black">
        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-16 lg:flex-row lg:items-start xl:gap-24">
            <div className="lg:w-1/2">
              <div className="group relative aspect-[16/18] overflow-hidden rounded-[2.5rem] shadow-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1470&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 text-white">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.4em] opacity-50">Support &amp; License</p>
                  <h3 className="max-w-[280px] text-xl font-bold leading-tight tracking-tight md:text-2xl">
                    We&apos;re here to help you clear every claim.
                  </h3>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="mb-12">
                <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.4em] text-black/30">
                  Help Center
                </span>
                <h2 className="mb-6 text-4xl font-black uppercase leading-none tracking-tight text-black lg:text-5xl">
                  Frequently Asked
                  <br />
                  Questions
                </h2>
                <p className="max-w-sm text-base font-medium leading-relaxed text-black/50">
                  Everything you need to know about monetization, licensing, and access.
                </p>
              </div>

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-black/[0.04] bg-white transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/[0.03]"
                  >
                    <summary className="flex list-none items-center justify-between p-6 outline-none">
                      <span className="pr-4 text-base font-bold tracking-tight text-black md:text-lg">{faq.question}</span>
                      <div className="opacity-40 transition-transform duration-500 group-open:rotate-180">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M6 9L12 15L18 9"
                            stroke="black"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </summary>
                    <div className="max-w-xl px-6 pb-6 text-sm leading-relaxed text-black/60">{faq.answer}</div>
                  </details>
                ))}

                <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
                  <button
                    type="button"
                    className="group flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-black/90"
                  >
                    Load More
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="transition-transform group-hover:translate-y-0.5"
                    >
                      <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <p className="text-[11px] font-bold tracking-tight text-black/30">
                    Need specialized help?{" "}
                    <Link
                      href="/contact"
                      className="text-black underline decoration-black/30 underline-offset-4 transition-all hover:decoration-black"
                    >
                      Support Desk
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="relative overflow-hidden border-t border-white/5 bg-[#111111] px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7CFF00]/5 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[1440px] text-center">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-5xl font-bold uppercase leading-[0.82] tracking-[-0.06em] text-white drop-shadow-2xl md:text-7xl">
              Ready to Elevate
              <br />
              Your <span className="italic tracking-tight text-[#7CFF00]">Content?</span>
            </h2>
            <p className="mx-auto mb-14 max-w-2xl text-lg font-medium leading-relaxed text-white/50 md:text-xl">
              Join thousands of world-class creators using Tracknit for royalty-free music and high-fidelity sound
              effects for YouTube, podcasts, and global ads.
            </p>

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                href="/register"
                className="block rounded-full bg-[#7CFF00] px-12 py-5 text-center text-sm font-medium uppercase tracking-widest text-black shadow-lg shadow-[#7CFF00]/20 transition-all hover:scale-105"
              >
                Start Your Plan
              </Link>
              <Link
                href="/music"
                className="block rounded-full bg-white px-12 py-5 text-center text-sm font-medium uppercase tracking-widest text-black shadow-lg transition-all hover:scale-105"
              >
                Browse Music
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
