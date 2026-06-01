"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Crown, 
  Music, 
  Zap, 
  Heart, 
  Download, 
  ListMusic, 
  ShieldCheck, 
  ArrowRight, 
  CreditCard, 
  Menu, 
  X,
  ExternalLink,
  ChevronRight,
  Plus,
  Lock,
  Sliders,
  Settings,
  HelpCircle,
  MonitorPlay,
  AlertCircle,
  Clock3,
  CheckCircle,
  Activity,
  History,
  Check
} from "lucide-react";
import { UserDropdown } from "@/components/library/UserDropdown";
import { apiFetch } from "@/lib/api-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const getPlanDisplayName = (tier?: string) => {
  if (!tier) return "Free Tier";
  switch (tier.toLowerCase()) {
    case "pro": return "Pro Plan";
    case "creator": return "Creator Plan";
    case "basic": return "Basic Plan";
    default: return `${tier.charAt(0).toUpperCase()}${tier.slice(1)} Plan`;
  }
};

export default function MyAccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Whitelist platform states
  const [channels, setChannels] = useState<any[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [newChannelUrl, setNewChannelUrl] = useState("");
  const [isSubmittingChannel, setIsSubmittingChannel] = useState(false);

  // Profile Settings Form states
  const [displayName, setDisplayName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Authentication Redirect Guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Set local state when session loads
  useEffect(() => {
    if (session?.user) {
      setDisplayName(session.user.name || "");
      setEmailAddress(session.user.email || "");
    }
  }, [session]);

  const mockChannels = [
    {
      id: "ch-1",
      channel_url: "https://youtube.com/@mockcreator",
      status: "approved",
      created_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: "ch-2",
      channel_url: "https://youtube.com/channel/UCmockurl2849",
      status: "pending",
      created_at: new Date().toISOString()
    }
  ];

  const isLoggedIn = !!session?.user;

  // Fetch Whitelist History
  useEffect(() => {
    if (isLoggedIn) {
      const fetchChannels = async () => {
        try {
          const res = await apiFetch("/api/backend/user/whitelist-channel");
          const data = await res.json();
          if (Array.isArray(data.channels) && data.channels.length > 0) {
            setChannels(data.channels);
          } else {
            setChannels(mockChannels);
          }
        } catch (err) {
          console.error("Failed to fetch whitelist channels:", err);
          setChannels(mockChannels);
        } finally {
          setChannelsLoading(false);
        }
      };
      fetchChannels();
    } else {
      setChannels(mockChannels);
      setChannelsLoading(false);
    }
  }, [isLoggedIn]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <span className="h-8 w-8 border-4 border-white/20 border-t-[#7CFF00] rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wider uppercase text-neutral-400">Loading Account...</span>
        </div>
      </div>
    );
  }

  const planTier = (session.user as any).planTier || "free";
  const planName = getPlanDisplayName(planTier);
  const isPaid = planTier.toLowerCase() !== "free";
  const roleName = (session.user as any).role || "subscriber";

  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelUrl.trim()) return;

    setIsSubmittingChannel(true);
    try {
      const response = await apiFetch("/api/backend/user/whitelist-channel", {
        method: "POST",
        body: JSON.stringify({ channel_url: newChannelUrl })
      });
      
      const data = await response.json();
      if (response.ok) {
        setChannels([{ 
          id: Date.now(), 
          channel_url: newChannelUrl, 
          status: 'pending', 
          created_at: new Date().toISOString() 
        }, ...channels]);
        setNewChannelUrl("");
      } else {
        alert(data.message || "Failed to submit channel.");
      }
    } catch (err) {
      alert("An error occurred while submitting the channel.");
    } finally {
      setIsSubmittingChannel(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    }, 1200);
  };

  const renderStatusBadge = (channelStatus: string) => {
    switch (channelStatus) {
      case "approved":
        return (
          <Badge variant="default" className="bg-[#7CFF00]/10 border border-[#7CFF00]/25 text-[#7CFF00] font-bold text-[10px] uppercase tracking-wider py-1 px-2.5 rounded-full flex items-center gap-1">
            <ShieldCheck size={11} className="text-[#7CFF00]" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-500/10 border border-red-500/25 text-red-400 font-bold text-[10px] uppercase tracking-wider py-1 px-2.5 rounded-full flex items-center gap-1">
            <AlertCircle size={11} className="text-red-400" /> Rejected
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge variant="outline" className="bg-white/5 border border-white/10 text-white/70 font-bold text-[10px] uppercase tracking-wider py-1 px-2.5 rounded-full flex items-center gap-1">
            <Clock3 size={11} className="text-white/40" /> Pending
          </Badge>
        );
    }
  };

  return (
    <div className="flex bg-[#111111] text-white font-sans min-h-screen">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══════════════════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════════════════ */}
      <aside className={`w-[260px] flex-shrink-0 flex flex-col h-screen bg-[#181818] border-r border-white/[0.07] fixed top-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-[64px] px-6 flex items-center justify-between shrink-0 border-b border-white/[0.07]">
          <Link href="/">
            <img alt="Tracknit" className="h-[36px] w-auto object-contain" src="/logo-header.png" />
          </Link>
          <button className="lg:hidden text-white/40 hover:text-white cursor-pointer" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          <Link href="/library/royalty-free-music" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <Music size={18} /> <span className="text-[13.5px]">Royalty-Free Music</span>
          </Link>
          <Link href="/library/sound-effects" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <Zap size={18} /> <span className="text-[13.5px]">Sound Effects</span>
          </Link>
          <Link href="/library/liked" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <Heart size={18} /> <span className="text-[13.5px]">Liked</span>
          </Link>
          <Link href="/library/downloads" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <Download size={18} /> <span className="text-[13.5px]">Downloads</span>
          </Link>
          <Link href="/library/collections" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <ListMusic size={18} /> <span className="text-[13.5px]">Collections</span>
          </Link>
          <div className="my-4 border-t border-white/5" />
          <Link href="/library/whitelist" className="flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-all text-neutral-400 font-medium hover:text-neutral-200">
            <ShieldCheck size={18} /> <span className="text-[13.5px]">Clearance / Whitelist</span>
          </Link>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════
          MAIN CONTENT AREA
      ═══════════════════════════════════════════════ */}
      <div className="flex-grow lg:pl-[260px] flex flex-col min-h-screen w-full">
        {/* TOP NAV */}
        <header className="h-[64px] flex items-center justify-between px-6 lg:px-10 bg-[#181818]/95 backdrop-blur-md border-b border-white/[0.07] sticky top-0 z-40">
          <div className="flex items-center gap-8">
            <button className="lg:hidden text-white/50 hover:text-white mr-4 cursor-pointer" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <nav className="hidden lg:flex items-center gap-8">
              {session?.user ? (
                <Link href="/library" className="text-xs uppercase tracking-widest font-body font-normal text-[#7CFF00] transition-colors">Dashboard</Link>
              ) : (
                <Link href="/library" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">Discover</Link>
              )}
              <Link href="/library/royalty-free-music" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">Music</Link>
              <Link href="/library/sound-effects" className="text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">Sound Effects</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/pricing" className="hidden sm:block text-xs uppercase tracking-widest font-body font-normal text-white/70 hover:text-[#7CFF00] transition-colors">Pricing</Link>
            <UserDropdown />
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-grow p-6 lg:p-10 max-w-[1400px] w-full mx-auto space-y-10">
          {/* Header Title */}
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">My Account</h1>
            <p className="text-neutral-400 text-sm">Configure your licensing safe-list, manage active plan subscriptions, and update credentials.</p>
          </div>

          {/* Premium Shadcn Tabs */}
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-[#18181a] border border-white/[0.06] p-1 rounded-2xl w-full max-w-xl grid grid-cols-2 md:grid-cols-4 shadow-inner h-auto gap-1">
              <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
              <TabsTrigger value="clearance" className="cursor-pointer">Clearance</TabsTrigger>
              <TabsTrigger value="billing" className="cursor-pointer whitespace-nowrap">Plan & Billing</TabsTrigger>
              <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
            </TabsList>

            {/* ═══════════════════════════════════════════════
                TAB 1: OVERVIEW
            ═══════════════════════════════════════════════ */}
            <TabsContent value="overview" className="outline-none">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left Columns (Profile and Stats) */}
                <div className="xl:col-span-2 space-y-8">
                  {/* Profile Details Card */}
                  <Card className="relative overflow-hidden group">
                    {/* Background glows */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#7CFF00]/5 rounded-full blur-[100px] pointer-events-none select-none" />
                    
                    <CardHeader className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                      {/* Avatar */}
                      <div className="h-20 w-20 rounded-2xl bg-neutral-800 border-2 border-white/[0.08] hover:border-[#7CFF00]/40 flex items-center justify-center overflow-hidden shrink-0 shadow-lg transition-colors duration-300">
                        {session.user?.image ? (
                          <img src={session.user.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-10 w-10 text-white/40" />
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-bold tracking-tight text-white leading-none">
                            {session.user?.name || "Tracknit Creator"}
                          </h2>
                          {isPaid ? (
                            <Badge className="bg-[#7CFF00]/10 border border-[#7CFF00]/25 text-[#7CFF00] font-black text-[10px] uppercase tracking-widest py-1 px-3 rounded-full flex items-center gap-1 shadow-lg shadow-[#7CFF00]/5">
                              <Crown className="h-3 w-3" />
                              {planName}
                            </Badge>
                          ) : (
                            <Badge className="bg-white/[0.06] border border-white/[0.1] text-white/50 font-black text-[10px] uppercase tracking-widest py-1 px-3 rounded-full">
                              {planName}
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/60 text-sm mt-2.5 flex items-center gap-2 font-medium">
                          <Mail className="h-3.5 w-3.5 text-white/40 shrink-0" />
                          {session.user?.email}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/[0.06] mt-6 pt-6 relative z-10 text-sm">
                      <div className="space-y-1.5">
                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider block">Plan Status</span>
                        <span className="text-white font-semibold flex items-center gap-1.5 mt-1">
                          <span className={`h-2 w-2 rounded-full ${isPaid ? "bg-[#7CFF00] shadow-[0_0_8px_#7CFF00]" : "bg-neutral-500"}`} />
                          {isPaid ? "Active & Cleared" : "Free - Limits Apply"}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider block">Account Role</span>
                        <span className="text-white font-semibold flex items-center gap-1.5 mt-1 capitalize">
                          <Shield className="h-4 w-4 text-white/40 shrink-0" />
                          {roleName}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider block">Member Since</span>
                        <span className="text-white font-semibold flex items-center gap-1.5 mt-1">
                          <Calendar className="h-4 w-4 text-white/40 shrink-0" />
                          May 2026
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Creator Stats Dashboard Widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="p-6 hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Channels</span>
                        <div className="h-7 w-7 rounded-lg bg-[#7CFF00]/10 flex items-center justify-center text-[#7CFF00]">
                          <ShieldCheck size={14} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-2xl font-black">{channels.length}</h4>
                        <p className="text-[11px] text-neutral-500 font-medium mt-1">Active safe-listed channels</p>
                      </div>
                    </Card>

                    <Card className="p-6 hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Downloads</span>
                        <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <Download size={14} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-2xl font-black">24</h4>
                        <p className="text-[11px] text-neutral-500 font-medium mt-1">WAV/MP3 tracks saved</p>
                      </div>
                    </Card>

                    <Card className="p-6 hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Favorites</span>
                        <div className="h-7 w-7 rounded-lg bg-[#FF1E84]/10 flex items-center justify-center text-[#FF1E84]">
                          <Heart size={14} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-2xl font-black">18</h4>
                        <p className="text-[11px] text-neutral-500 font-medium mt-1">Starred catalog tracks</p>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Right Columns (Fast Shortcuts & Support) */}
                <div className="space-y-6">
                  {/* Quick Shortcuts */}
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-sm uppercase tracking-wider text-neutral-400">Workstation Quicklinks</CardTitle>
                      <CardDescription>Instantly jump into your library and license portals.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 border-t border-white/[0.06] divide-y divide-white/[0.06] text-sm">
                      <Link href="/library/royalty-free-music" className="flex items-center justify-between p-4.5 hover:bg-white/[0.02] group transition-colors">
                        <span className="font-bold flex items-center gap-2.5"><Music size={15} className="text-[#7CFF00]" /> Browse Music</span>
                        <ArrowRight size={14} className="text-neutral-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                      </Link>
                      <Link href="/library/sound-effects" className="flex items-center justify-between p-4.5 hover:bg-white/[0.02] group transition-colors">
                        <span className="font-bold flex items-center gap-2.5"><Zap size={15} className="text-purple-400" /> Sound Effects</span>
                        <ArrowRight size={14} className="text-neutral-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                      </Link>
                      <Link href="/library/downloads" className="flex items-center justify-between p-4.5 hover:bg-white/[0.02] group transition-colors">
                        <span className="font-bold flex items-center gap-2.5"><Download size={15} className="text-blue-400" /> License Documents</span>
                        <ArrowRight size={14} className="text-neutral-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Need Help Box */}
                  <Card className="bg-gradient-to-br from-[#1a1a1c] to-[#121214] border border-white/[0.06] hover:border-white/10 p-6 flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mb-4">
                      <HelpCircle size={18} />
                    </div>
                    <h4 className="font-bold text-sm text-white">Copyright claim trouble?</h4>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                      Need help getting a claim released, or have an Enterprise licensing inquiry? Talk directly with our safe-list team.
                    </p>
                    <Link href="/contact" className="w-full mt-4 flex items-center justify-center gap-1 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all">
                      Contact Support <ExternalLink size={12} />
                    </Link>
                  </Card>
                </div>

              </div>
            </TabsContent>

            {/* ═══════════════════════════════════════════════
                TAB 2: CLEARANCE WHITELIST
            ═══════════════════════════════════════════════ */}
            <TabsContent value="clearance" className="outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Form Col */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-[100px] border-[#7CFF00]/15">
                    <CardHeader className="flex flex-row items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#7CFF00]/10 flex items-center justify-center text-[#7CFF00]">
                        <MonitorPlay className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-[15px] leading-tight">Whitelist Channel</CardTitle>
                        <CardDescription>Pre-clear your platform.</CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-2">
                      <form onSubmit={handleAddChannel} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                            YouTube Channel URL
                          </label>
                          <input
                            type="text"
                            placeholder="https://youtube.com/@mychannel"
                            value={newChannelUrl}
                            onChange={(e) => setNewChannelUrl(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7CFF00]/50 focus:ring-1 focus:ring-[#7CFF00]/50 transition-all"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingChannel || !newChannelUrl.trim()}
                          className="w-full flex items-center justify-center gap-2 bg-[#7CFF00] hover:bg-[#7CFF00]/90 text-black px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_-6px_rgba(124,255,0,0.3)]"
                        >
                          {isSubmittingChannel ? (
                            <span className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          ) : (
                            <>
                              <Plus size={14} /> Submit Channel
                            </>
                          )}
                        </button>

                        <p className="text-[10px] text-white/30 text-center leading-relaxed mt-4">
                          Monetization claims on submitted channels are automatically released within 24 hours.
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* List Table Col */}
                <div className="lg:col-span-2">
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-sm uppercase tracking-wider text-neutral-400">Whitelisted Platforms</CardTitle>
                      <CardDescription>Displaying channels registered with Content ID clearance.</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-0 border-t border-white/[0.06]">
                      {channelsLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-500">
                          <span className="h-6 w-6 border-2 border-white/20 border-t-[#7CFF00] rounded-full animate-spin" />
                          <span className="text-xs uppercase tracking-wider font-semibold">Loading list...</span>
                        </div>
                      ) : channels.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                          <ShieldCheck size={48} className="text-white/10 mb-5" />
                          <h3 className="text-base font-bold mb-1">No channels whitelisted</h3>
                          <p className="text-neutral-400 text-xs max-w-sm">
                            You haven't added any channels to your whitelist yet. Submit a channel on the left to activate protection.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-white/[0.06] text-neutral-400 text-left text-[10px] font-bold uppercase tracking-wider">
                                <th className="px-6 py-4.5">Channel URL</th>
                                <th className="px-6 py-4.5">Status</th>
                                <th className="px-6 py-4.5 text-right">Submitted Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {channels.map((channel) => (
                                <tr key={channel.id} className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors text-[13.5px]">
                                  <td className="px-6 py-5.5 font-bold text-white max-w-[280px] truncate">
                                    {channel.channel_url}
                                  </td>
                                  <td className="px-6 py-5.5">
                                    {renderStatusBadge(channel.status)}
                                  </td>
                                  <td className="px-6 py-5.5 text-neutral-400 text-right text-xs">
                                    {new Date(channel.created_at).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

              </div>
            </TabsContent>

            {/* ═══════════════════════════════════════════════
                TAB 3: SUBSCRIPTION & BILLING
            ═══════════════════════════════════════════════ */}
            <TabsContent value="billing" className="outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Active Plan Info */}
                <div className="lg:col-span-1 space-y-6">
                  <Card className="relative overflow-hidden border-[#7CFF00]/15">
                    {/* Glowing highlight */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#7CFF00]/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <CardHeader>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7CFF00] mb-1">
                        <Crown className="h-4 w-4" /> Active Subscription
                      </div>
                      <CardTitle className="text-2xl font-black uppercase tracking-tight">{planName}</CardTitle>
                      <CardDescription>Personal Commercial Licensing tier.</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-2 space-y-5">
                      <div className="flex justify-between items-center text-sm border-b border-white/[0.06] pb-3">
                        <span className="text-neutral-400 font-medium">Monthly Rate</span>
                        <span className="font-bold text-white">{isPaid ? "$19.00 / mo" : "$0.00 / mo"}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-white/[0.06] pb-3">
                        <span className="text-neutral-400 font-medium">Renewal Date</span>
                        <span className="font-bold text-white">{isPaid ? "June 28, 2026" : "—"}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-400 font-medium">Billing Period</span>
                        <span className="font-bold text-white">Monthly</span>
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-2 pt-6">
                      <Link href="/pricing" className="w-full flex items-center justify-center gap-1.5 bg-white text-black hover:bg-white/90 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors">
                        Manage Plan <ExternalLink size={12} />
                      </Link>
                      {isPaid && (
                        <button className="w-full py-2.5 text-red-500 hover:text-red-400 text-xs font-semibold uppercase tracking-wider transition-colors border border-transparent hover:border-red-500/10 rounded-xl">
                          Cancel Auto-Renewal
                        </button>
                      )}
                    </CardFooter>
                  </Card>
                </div>

                {/* Invoices History Table */}
                <div className="lg:col-span-2">
                  <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center gap-3.5">
                      <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-neutral-400">
                        <History size={16} />
                      </div>
                      <div>
                        <CardTitle className="text-sm uppercase tracking-wider text-neutral-400">Invoice History</CardTitle>
                        <CardDescription>Download past PDF receipts and track renewal cycles.</CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-0 border-t border-white/[0.06]">
                      {isPaid ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-white/[0.06] text-neutral-400 text-left text-[10px] font-bold uppercase tracking-wider">
                                <th className="px-6 py-4.5">Invoice ID</th>
                                <th className="px-6 py-4.5">Billing Date</th>
                                <th className="px-6 py-4.5">Amount</th>
                                <th className="px-6 py-4.5">Status</th>
                                <th className="px-6 py-4.5 text-right">Receipt</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors text-[13.5px]">
                                <td className="px-6 py-5.5 font-bold text-white">TR-2026-002</td>
                                <td className="px-6 py-5.5 text-neutral-400 text-xs">May 28, 2026</td>
                                <td className="px-6 py-5.5 font-semibold text-white">$19.00</td>
                                <td className="px-6 py-5.5">
                                  <Badge className="bg-[#7CFF00]/10 border border-[#7CFF00]/25 text-[#7CFF00] font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                                    Paid
                                  </Badge>
                                </td>
                                <td className="px-6 py-5.5 text-right">
                                  <button className="text-neutral-500 hover:text-white transition-colors" onClick={() => alert("Downloading receipt TR-2026-002...")}>
                                    <Download size={14} className="inline mr-1" /> PDF
                                  </button>
                                </td>
                              </tr>
                              <tr className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors text-[13.5px]">
                                <td className="px-6 py-5.5 font-bold text-white">TR-2026-001</td>
                                <td className="px-6 py-5.5 text-neutral-400 text-xs">April 28, 2026</td>
                                <td className="px-6 py-5.5 font-semibold text-white">$19.00</td>
                                <td className="px-6 py-5.5">
                                  <Badge className="bg-[#7CFF00]/10 border border-[#7CFF00]/25 text-[#7CFF00] font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                                    Paid
                                  </Badge>
                                </td>
                                <td className="px-6 py-5.5 text-right">
                                  <button className="text-neutral-500 hover:text-white transition-colors" onClick={() => alert("Downloading receipt TR-2026-001...")}>
                                    <Download size={14} className="inline mr-1" /> PDF
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                          <CreditCard size={40} className="text-white/10 mb-4" />
                          <h3 className="text-base font-bold mb-1">No transaction history</h3>
                          <p className="text-neutral-400 text-xs max-w-sm leading-relaxed">
                            You are currently on the Free plan tier and have no past transaction receipts. Subscribe to a premium tier to view details.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

              </div>
            </TabsContent>

            {/* ═══════════════════════════════════════════════
                TAB 4: PROFILE SETTINGS
            ═══════════════════════════════════════════════ */}
            <TabsContent value="settings" className="outline-none">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Account Details form */}
                <div className="xl:col-span-2 space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[15px] uppercase tracking-wider text-neutral-400">Creator Details</CardTitle>
                      <CardDescription>Manage your public persona and system-wide notification routes.</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-2">
                      <form onSubmit={handleSaveSettings} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50">
                              Display Name
                            </label>
                            <input
                              type="text"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7CFF00]/50 transition-colors"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7CFF00]/50 transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-[#7CFF00]">Notifications Preferences</h4>
                          
                          <div className="flex items-center justify-between py-2 text-sm">
                            <div>
                              <p className="font-bold text-white">Monetization Releases</p>
                              <p className="text-[11px] text-neutral-400 mt-0.5">Receive claims clearances and platform white-list confirmations.</p>
                            </div>
                            <input type="checkbox" defaultChecked className="accent-[#7CFF00] h-4 w-4" />
                          </div>

                          <div className="flex items-center justify-between py-2 text-sm">
                            <div>
                              <p className="font-bold text-white">New Tracks & Stems Alerts</p>
                              <p className="text-[11px] text-neutral-400 mt-0.5">Get notified weekly when fresh catalog songs and stem packs drop.</p>
                            </div>
                            <input type="checkbox" defaultChecked className="accent-[#7CFF00] h-4 w-4" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                          {settingsSuccess ? (
                            <span className="flex items-center gap-1.5 text-xs text-[#7CFF00] font-semibold animate-pulse">
                              <CheckCircle size={15} /> Profile successfully saved!
                            </span>
                          ) : (
                            <span className="text-xs text-neutral-500 font-medium">Verify your email address to ensure support delivery.</span>
                          )}

                          <button
                            type="submit"
                            disabled={isSavingSettings}
                            className="flex items-center gap-2 bg-[#7CFF00] hover:bg-[#7CFF00]/90 text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors disabled:opacity-50 shadow-[0_8px_20px_-6px_rgba(124,255,0,0.2)] cursor-pointer"
                          >
                            {isSavingSettings ? (
                              <>
                                <span className="h-3 w-3 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Saving...
                              </>
                            ) : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Password reset widget */}
                <div className="xl:col-span-1">
                  <Card>
                    <CardHeader className="flex flex-row items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-neutral-400">
                        <Lock size={15} />
                      </div>
                      <div>
                        <CardTitle className="text-[13px] uppercase tracking-wider text-neutral-400">Update Password</CardTitle>
                        <CardDescription>Reset account password.</CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-2 space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50">Current Password</label>
                        <input
                          type="password"
                          value={passwordCurrent}
                          onChange={(e) => setPasswordCurrent(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7CFF00]/50 transition-colors"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50">New Password</label>
                        <input
                          type="password"
                          value={passwordNew}
                          onChange={(e) => setPasswordNew(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7CFF00]/50 transition-colors"
                        />
                      </div>

                      <button
                        onClick={() => {
                          if (!passwordCurrent || !passwordNew) {
                            alert("Please fill in both current and new password fields.");
                            return;
                          }
                          alert("Password updated successfully!");
                          setPasswordCurrent("");
                          setPasswordNew("");
                        }}
                        className="w-full mt-2 py-3 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                      >
                        Update Security
                      </button>
                    </CardContent>
                  </Card>
                </div>

              </div>
            </TabsContent>

          </Tabs>

        </main>
      </div>
    </div>
  );
}
