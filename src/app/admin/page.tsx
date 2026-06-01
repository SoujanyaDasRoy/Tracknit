"use client";

import React, { useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Upload, Music2, Volume2, Settings, LogOut,
  TrendingUp, Download, Users, Eye, FileSpreadsheet, CheckCircle2,
  AlertCircle, X, ChevronDown, Search, MoreHorizontal, Pencil,
  Trash2, ExternalLink, ArrowUpRight, Plus, Filter, RefreshCw,
  AudioLines, Clock, Gauge, FolderOpen, Bell, HardDrive, Activity,
  CalendarDays, ArrowDown, Copy, Shield, BarChart3, Zap, Database,
  ChevronRight, Globe, Hash
} from "lucide-react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */
import { useTrackStore } from "@/store/useTrackStore";

const OVERVIEW_STATS = [
  { label: "Total Tracks", value: "1,247", change: "+24", trend: "up", icon: Music2, color: "#7CFF00", sparkline: [30,35,28,40,38,50,55,52,60,58,66,72] },
  { label: "Total SFX", value: "3,891", change: "+156", trend: "up", icon: Volume2, color: "#00BFFF", sparkline: [20,25,22,30,28,35,38,40,42,46,50,55] },
  { label: "Downloads (30d)", value: "18.4K", change: "+12%", trend: "up", icon: Download, color: "#C084FC", sparkline: [50,48,55,60,52,65,70,68,75,80,78,85] },
  { label: "Active Subs", value: "342", change: "+8", trend: "up", icon: Users, color: "#F97316", sparkline: [15,18,16,20,22,24,26,28,25,30,32,35] },
];

const IMPORT_HISTORY = [
  { id: 1, filename: "batch_april_tracks.csv", rows: 48, created: 48, errors: 0, date: "Apr 18, 2026", type: "tracks", size: "12.4 KB" },
  { id: 2, filename: "sfx_pack_vol12.csv", rows: 156, created: 154, errors: 2, date: "Apr 15, 2026", type: "sfx", size: "38.1 KB" },
  { id: 3, filename: "cinematic_collection.csv", rows: 32, created: 32, errors: 0, date: "Apr 10, 2026", type: "tracks", size: "8.2 KB" },
  { id: 4, filename: "urban_beats_q1.csv", rows: 87, created: 85, errors: 2, date: "Mar 28, 2026", type: "tracks", size: "22.7 KB" },
];

const ACTIVITY_LOG = [
  { action: "Published", item: "Ethereal Drift", by: "Admin", time: "2h ago", type: "publish" },
  { action: "Imported", item: "batch_april_tracks.csv", by: "Admin", time: "4h ago", type: "import" },
  { action: "Edited", item: "Subzero Signal", by: "Admin", time: "6h ago", type: "edit" },
  { action: "Deleted", item: "test_track_01", by: "Admin", time: "1d ago", type: "delete" },
  { action: "Published", item: "Big Steppa", by: "Admin", time: "2d ago", type: "publish" },
  { action: "Imported", item: "sfx_pack_vol12.csv", by: "Admin", time: "5d ago", type: "import" },
];

const TOP_TRACKS = [
  { title: "Subzero Signal", downloads: 312, pct: 100 },
  { title: "Big Steppa", downloads: 256, pct: 82 },
  { title: "Night Runner", downloads: 201, pct: 64 },
  { title: "Ethereal Drift", downloads: 184, pct: 59 },
  { title: "Unconventional", downloads: 143, pct: 46 },
];

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

type AdminTab = "overview" | "tracks" | "import" | "settings";

type IconComponent = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

const SidebarLink = ({ icon: Icon, label, active, onClick, badge }: { icon: IconComponent; label: string; active: boolean; onClick: () => void; badge?: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-[9px] rounded-xl transition-all duration-150 text-[13px] tracking-[-0.01em] group relative
      ${active
        ? "bg-white/[0.07] text-white font-semibold"
        : "text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.03] font-medium"
      }`}
  >
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-full" />}
    <Icon size={17} strokeWidth={active ? 2 : 1.5} className={active ? "text-primary" : "text-neutral-600 group-hover:text-neutral-400"} />
    {label}
    {badge && (
      <span className="ml-auto text-[10px] font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full">{badge}</span>
    )}
  </button>
);

/* ─── Mini Sparkline ─── */
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  return (
    <svg width={w} height={h} className="shrink-0 opacity-60">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
};

/* ─── Storage bar ─── */
const StorageBar = ({ label, used, total, color }: { label: string; used: number; total: number; color: string }) => {
  const pct = (used / total) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-neutral-400">{label}</span>
        <span className="text-[11px] font-semibold text-neutral-500">{used} GB / {total} GB</span>
      </div>
      <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

/* ─── CSV Dropzone ─── */
function CSVDropzone({ onFileAccepted }: { onFileAccepted: (file: File) => void }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragOver(false), []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) onFileAccepted(file);
  }, [onFileAccepted]);
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) onFileAccepted(file);
  }, [onFileAccepted]);

  return (
    <div
      onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
        ${isDragOver ? "border-primary bg-primary/[0.03]" : "border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.02]"}`}
    >
      <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
      <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragOver ? "bg-primary/15 border-primary/25" : "bg-white/[0.04] border-white/[0.06]"} border`}>
        <Upload size={24} className={isDragOver ? "text-primary" : "text-neutral-500"} />
      </div>
      <p className="text-[14px] font-semibold text-neutral-200 mb-1.5">{isDragOver ? "Drop your CSV here" : "Drag & drop your CSV file"}</p>
      <p className="text-[12px] text-neutral-600 font-medium">or <span className="text-primary font-semibold cursor-pointer">browse files</span> · CSV format only</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function AdminDashboard() {
  const { tracks: RECENT_TRACKS, addTrack } = useTrackStore();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<"tracks" | "sfx">("tracks");
  const [importStatus, setImportStatus] = useState<"idle" | "importing" | "success" | "error">("idle");
  const [importResults, setImportResults] = useState<{ created: number; errors: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [trackFilter, setTrackFilter] = useState<"all" | "published" | "draft">("all");
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());

  // Manual Audio Uploader States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPhase, setUploadPhase] = useState<"form" | "signing" | "uploading" | "syncing" | "success">("form");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [trackTitle, setTrackTitle] = useState("");
  const [trackArtist, setTrackArtist] = useState("");
  const [trackGenre, setTrackGenre] = useState("Electronic");
  const [trackBpm, setTrackBpm] = useState("120");
  const [trackKey, setTrackKey] = useState("C Maj");
  const [trackDuration, setTrackDuration] = useState("03:30");
  const [trackFile, setTrackFile] = useState<File | null>(null);

  // Dynamic Browser-Side Automatic Waveform Decoder States & Helper
  const [generatedWaveform, setGeneratedWaveform] = useState<number[]>([]);
  const [isDecodingWaveform, setIsDecodingWaveform] = useState(false);

  const handleFileSelection = async (file: File) => {
    setTrackFile(file);
    if (!trackTitle) {
      setTrackTitle(file.name.replace(/\.[^/.]+$/, ""));
    }

    setIsDecodingWaveform(true);
    setGeneratedWaveform([]);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const tempCtx = new AudioContextClass();
        tempCtx.decodeAudioData(
          arrayBuffer,
          (audioBuffer) => {
            const channelData = audioBuffer.getChannelData(0); // Left channel
            const sampleCount = channelData.length;
            const barCount = 80;
            const blockSize = Math.floor(sampleCount / barCount);
            const decodedPeaks: number[] = [];

            for (let i = 0; i < barCount; i++) {
              let max = 0;
              const start = i * blockSize;
              const end = Math.min(start + blockSize, sampleCount);
              for (let j = start; j < end; j++) {
                const val = Math.abs(channelData[j]);
                if (val > max) max = val;
              }
              // Compress and scale peaks between 10 and 95
              const normalized = Math.max(0.1, Math.min(0.95, Math.pow(max, 0.7) * 1.25));
              decodedPeaks.push(Math.round(10 + normalized * 85));
            }
            setGeneratedWaveform(decodedPeaks);
            setIsDecodingWaveform(false);
          },
          (err) => {
            console.error("Web Audio decoding failed, falling back to deterministic peak generator:", err);
            setIsDecodingWaveform(false);
          }
        );
      } else {
        setIsDecodingWaveform(false);
      }
    } catch (err) {
      console.error("Error reading audio file for waveform generation:", err);
      setIsDecodingWaveform(false);
    }
  };

  const handleManualUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle || !trackArtist || !trackFile) return;

    setUploadPhase("signing");
    setTimeout(() => {
      setUploadPhase("uploading");
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadPhase("syncing");
            setTimeout(() => {
              // Finish uploader sync
              setUploadPhase("success");
              addTrack({
                id: "m_manual_" + Date.now(),
                title: trackTitle,
                artist: trackArtist,
                genre: [trackGenre],
                bpm: Number(trackBpm) || 120,
                keySig: trackKey,
                duration: trackDuration,
                image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&q=80",
                status: "published",
                downloads: 0,
                waveform: generatedWaveform.length > 0 ? generatedWaveform : undefined,
                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              });
            }, 1200);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }, 1000);
  };

  const handleImportSubmit = () => {
    if (!importFile) return;
    setImportStatus("importing");
    setTimeout(() => { 
      setImportStatus("success"); 
      setImportResults({ created: 1, errors: 0 }); 
      
      // Simulating picking up the first record in the imported CSV
      addTrack({
        id: "m_new_" + Date.now(),
        title: "Imported Track " + Date.now().toString().slice(-4),
        artist: "Admin Importer",
        genre: ["Electronic"],
        bpm: 120,
        keySig: "C Maj",
        duration: "03:30",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80",
        status: "published",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        downloads: 0
      });
    }, 2500);
  };

  const filteredTracks = useMemo(() => RECENT_TRACKS.filter((t: any) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = trackFilter === "all" || t.status === trackFilter;
    return matchesSearch && matchesFilter;
  }), [searchQuery, trackFilter, RECENT_TRACKS]);

  const toggleTrackSelection = (id: string) => {
    const next = new Set(selectedTracks);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedTracks(next);
  };

  const toggleAllTracks = () => {
    if (selectedTracks.size === filteredTracks.length) {
      setSelectedTracks(new Set());
    } else {
      setSelectedTracks(new Set(filteredTracks.map(t => t.id)));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#070709] text-white font-body antialiased">
      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a1a1e; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #2a2a2e; }
      `}</style>

      {/* ═════════════════════════════════════════════════
           SIDEBAR — Differentiated admin design
         ═════════════════════════════════════════════════ */}
      <aside className="w-[240px] h-full bg-[#0c0c0f] flex flex-col shrink-0 border-r border-white/[0.04]">

        {/* Logo + Admin Badge */}
        <div className="px-5 flex items-center gap-3 h-[64px] shrink-0 border-b border-white/[0.04]">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="TracKnit" className="h-7 w-auto object-contain" />
          </Link>
          <span className="text-[9px] font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-md uppercase tracking-wider">Admin</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-2.5 pt-4 pb-4 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold text-neutral-700 uppercase tracking-[0.15em]">Dashboard</p>
          <nav className="space-y-0.5 mb-6">
            <SidebarLink icon={LayoutDashboard} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
            <SidebarLink icon={AudioLines} label="Track Manager" active={activeTab === "tracks"} onClick={() => setActiveTab("tracks")} badge="1,247" />
            <SidebarLink icon={Upload} label="Bulk Import" active={activeTab === "import"} onClick={() => setActiveTab("import")} />
            <SidebarLink icon={Settings} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
          </nav>

          <p className="px-3 pb-2 text-[10px] font-semibold text-neutral-700 uppercase tracking-[0.15em]">Quick Links</p>
          <nav className="space-y-0.5 mb-6">
            <Link href="/music" className="flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] font-medium text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.03] transition-all group">
              <Music2 size={17} strokeWidth={1.5} className="text-neutral-600 group-hover:text-neutral-400" />
              Music Library
              <ExternalLink size={11} className="ml-auto text-neutral-700" />
            </Link>
            <Link href="/sfx" className="flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] font-medium text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.03] transition-all group">
              <Volume2 size={17} strokeWidth={1.5} className="text-neutral-600 group-hover:text-neutral-400" />
              SFX Library
              <ExternalLink size={11} className="ml-auto text-neutral-700" />
            </Link>
          </nav>

          {/* Storage Widget */}
          <div className="mx-1 p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <HardDrive size={14} className="text-neutral-600" />
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Storage</span>
            </div>
            <div className="space-y-3.5">
              <StorageBar label="WAV Files" used={18.4} total={50} color="#7CFF00" />
              <StorageBar label="MP3 Previews" used={3.2} total={10} color="#00BFFF" />
              <StorageBar label="Cover Art" used={1.1} total={5} color="#C084FC" />
            </div>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="shrink-0 p-2.5 border-t border-white/[0.04]">
          <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold text-black shrink-0 bg-primary">A</div>
            <div className="overflow-hidden flex-1">
              <div className="text-[12px] font-semibold truncate text-neutral-300">Admin</div>
              <div className="text-[10px] text-neutral-600 font-medium">Owner</div>
            </div>
            <LogOut size={14} className="text-neutral-700 hover:text-red-400 transition-colors" />
          </div>
        </div>
      </aside>

      {/* ═════════════════════════════════════════════════
           MAIN AREA
         ═════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── TOP BAR ── */}
        <header className="h-[64px] shrink-0 border-b border-white/[0.04] bg-[#070709] flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-semibold text-white">
              {activeTab === "overview" && "Overview"}
              {activeTab === "tracks" && "Track Manager"}
              {activeTab === "import" && "Bulk Import"}
              {activeTab === "settings" && "Settings"}
            </h2>
            <span className="text-[11px] text-neutral-600 font-medium">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 w-3.5 h-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-white/[0.03] border border-white/[0.05] rounded-lg py-2 pl-9 pr-4 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/30 text-white placeholder:text-neutral-600 font-medium w-48 transition-all focus:w-64"
              />
            </div>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-white/[0.05] text-neutral-500 hover:text-white hover:bg-white/[0.04] transition-all">
              <Bell size={15} />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1320px] mx-auto px-8 py-8">

            {/* ══════════════════════════════════════════
               TAB: OVERVIEW
               ══════════════════════════════════════════ */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {OVERVIEW_STATS.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 hover:border-white/[0.08] transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-[11px] font-medium text-neutral-500 mb-1 uppercase tracking-wider">{stat.label}</p>
                          <p className="text-[28px] font-bold text-white tracking-tight leading-none">{stat.value}</p>
                        </div>
                        <Sparkline data={stat.sparkline} color={stat.color} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ArrowUpRight size={12} style={{ color: stat.color }} />
                        <span className="text-[11px] font-semibold" style={{ color: stat.color }}>{stat.change}</span>
                        <span className="text-[10px] text-neutral-600 font-medium">vs last month</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Two-column layout: Activity + Top Tracks */}
                <div className="grid grid-cols-5 gap-6 mb-8">

                  {/* Activity Feed — 3 cols */}
                  <div className="col-span-3 bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-neutral-500" />
                        <h3 className="text-[13px] font-semibold text-white">Recent Activity</h3>
                      </div>
                      <span className="text-[10px] text-neutral-600 font-medium uppercase tracking-wider">Last 7 days</span>
                    </div>
                    <div className="divide-y divide-white/[0.03]">
                      {ACTIVITY_LOG.map((log, i) => (
                        <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            log.type === "publish" ? "bg-primary/10 text-primary" :
                            log.type === "import" ? "bg-blue-500/10 text-blue-400" :
                            log.type === "edit" ? "bg-amber-500/10 text-amber-400" :
                            "bg-red-500/10 text-red-400"
                          }`}>
                            {log.type === "publish" && <CheckCircle2 size={14} />}
                            {log.type === "import" && <Upload size={14} />}
                            {log.type === "edit" && <Pencil size={14} />}
                            {log.type === "delete" && <Trash2 size={14} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-neutral-300">
                              <span className="font-semibold text-white">{log.action}</span> {log.item}
                            </p>
                          </div>
                          <span className="text-[11px] text-neutral-600 font-medium shrink-0">{log.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Tracks — 2 cols */}
                  <div className="col-span-2 bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <BarChart3 size={14} className="text-neutral-500" />
                        <h3 className="text-[13px] font-semibold text-white">Top Tracks</h3>
                      </div>
                      <span className="text-[10px] text-neutral-600 font-medium uppercase tracking-wider">By downloads</span>
                    </div>
                    <div className="px-5 py-3 space-y-3">
                      {TOP_TRACKS.map((t, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2.5">
                              <span className="text-[11px] font-bold text-neutral-600 w-4 text-right">{i + 1}</span>
                              <span className="text-[12px] font-medium text-neutral-300">{t.title}</span>
                            </div>
                            <span className="text-[11px] font-semibold text-neutral-500 tabular-nums">{t.downloads}</span>
                          </div>
                          <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden ml-6">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${t.pct}%` }}
                              transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                              className="h-full rounded-full bg-primary/40"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Imports */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden mb-8">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet size={14} className="text-neutral-500" />
                      <h3 className="text-[13px] font-semibold text-white">Recent Imports</h3>
                    </div>
                    <button onClick={() => setActiveTab("import")} className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                      Import New <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className="divide-y divide-white/[0.03]">
                    {IMPORT_HISTORY.map((imp) => (
                      <div key={imp.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${imp.type === "tracks" ? "bg-primary/10" : "bg-blue-500/10"}`}>
                            {imp.type === "tracks" ? <Music2 size={14} className="text-primary" /> : <Volume2 size={14} className="text-blue-400" />}
                          </div>
                          <div>
                            <p className="text-[12px] font-semibold text-neutral-200">{imp.filename}</p>
                            <p className="text-[10px] text-neutral-600 font-medium mt-0.5">{imp.date} · {imp.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5">
                          <div className="text-right">
                            <p className="text-[12px] font-semibold text-neutral-300 tabular-nums">{imp.created}<span className="text-neutral-600">/{imp.rows}</span></p>
                            <p className="text-[9px] text-neutral-600 font-medium uppercase tracking-wider">imported</p>
                          </div>
                          {imp.errors === 0
                            ? <CheckCircle2 size={16} className="text-primary/70" />
                            : <div className="flex items-center gap-1 text-amber-400"><AlertCircle size={14} /><span className="text-[10px] font-semibold">{imp.errors}</span></div>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Import CSV", desc: "Bulk add tracks", icon: Upload, color: "primary", onClick: () => setActiveTab("import") },
                    { label: "Manage Tracks", desc: "Edit metadata", icon: Pencil, color: "blue", onClick: () => setActiveTab("tracks") },
                    { label: "Preview Site", desc: "View as visitor", icon: Eye, color: "purple", href: "/music" },
                    { label: "Documentation", desc: "CSV format guide", icon: FileSpreadsheet, color: "amber", onClick: () => setActiveTab("import") },
                  ].map((action, i) => {
                    const colorMap: Record<string, string> = { primary: "#7CFF00", blue: "#00BFFF", purple: "#C084FC", amber: "#F59E0B" };
                    const c = colorMap[action.color];
                    const inner = (
                      <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer group">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${c}10`, borderColor: `${c}20` }}>
                          <action.icon size={16} style={{ color: c }} />
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold text-neutral-200 group-hover:text-white">{action.label}</p>
                          <p className="text-[10px] text-neutral-600 font-medium">{action.desc}</p>
                        </div>
                      </div>
                    );
                    if (action.href) return <Link key={i} href={action.href}>{inner}</Link>;
                    return <button key={i} onClick={action.onClick} className="text-left">{inner}</button>;
                  })}
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
               TAB: TRACK MANAGER
               ══════════════════════════════════════════ */}
            {activeTab === "tracks" && (
              <motion.div key="tracks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3 flex-1 mr-4">
                    <div className="flex-1 relative max-w-sm">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 w-3.5 h-3.5 pointer-events-none" />
                      <input
                        type="text" placeholder="Search tracks or artists..."
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-lg py-2.5 pl-10 pr-4 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/30 text-white placeholder:text-neutral-600 font-medium transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-0.5 bg-white/[0.02] border border-white/[0.05] rounded-lg p-0.5">
                      {(["all", "published", "draft"] as const).map(f => (
                        <button key={f} onClick={() => setTrackFilter(f)}
                          className={`px-3.5 py-1.5 rounded-md text-[11px] font-semibold transition-all capitalize ${trackFilter === f ? "bg-white/[0.08] text-white" : "text-neutral-600 hover:text-neutral-300"}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedTracks.size > 0 && (
                      <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-[11px] font-semibold hover:bg-red-500/15 transition-all">
                        <Trash2 size={13} /> Delete ({selectedTracks.size})
                      </motion.button>
                    )}
                    <button 
                      onClick={() => {
                        setUploadPhase("form");
                        setTrackTitle("");
                        setTrackArtist("");
                        setTrackFile(null);
                        setGeneratedWaveform([]);
                        setIsDecodingWaveform(false);
                        setShowUploadModal(true);
                      }}
                      className="flex items-center gap-1.5 bg-primary text-black px-4 py-2.5 rounded-lg font-semibold text-[12px] hover:bg-primary/90 transition-all"
                    >
                      <Plus size={14} /> Add Track
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-2 items-center px-5 py-3 border-b border-white/[0.04]">
                    <div className="col-span-1 flex items-center">
                      <input type="checkbox" checked={selectedTracks.size === filteredTracks.length && filteredTracks.length > 0} onChange={toggleAllTracks}
                        className="w-3.5 h-3.5 rounded border-neutral-600 bg-transparent accent-primary cursor-pointer" />
                    </div>
                    <div className="col-span-3 text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">Track</div>
                    <div className="col-span-2 text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">Genre</div>
                    <div className="col-span-1 text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">BPM</div>
                    <div className="col-span-1 text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">Duration</div>
                    <div className="col-span-1 text-[10px] font-semibold text-neutral-600 uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:text-neutral-400"><ArrowDown size={10} />DLs</div>
                    <div className="col-span-1 text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">Status</div>
                    <div className="col-span-2 text-[10px] font-semibold text-neutral-600 uppercase tracking-wider text-right">Actions</div>
                  </div>

                  {/* Rows */}
                  {filteredTracks.map((track, i) => {
                    const isSelected = selectedTracks.has(track.id);
                    return (
                      <motion.div key={track.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.025 }}
                        className={`grid grid-cols-12 gap-2 items-center px-5 py-3 border-b border-white/[0.025] hover:bg-white/[0.02] transition-colors group ${isSelected ? "bg-primary/[0.03]" : ""}`}>
                        <div className="col-span-1 flex items-center">
                          <input type="checkbox" checked={isSelected} onChange={() => toggleTrackSelection(track.id)}
                            className="w-3.5 h-3.5 rounded border-neutral-600 bg-transparent accent-primary cursor-pointer" />
                        </div>
                        <div className="col-span-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-white/[0.05]">
                            <img src={track.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-neutral-200 truncate group-hover:text-white">{track.title}</p>
                            <p className="text-[10px] text-neutral-600 truncate font-medium">{track.artist}</p>
                          </div>
                        </div>
                        <div className="col-span-2"><span className="text-[11px] font-medium text-neutral-400">{track.genre}</span></div>
                        <div className="col-span-1"><span className="text-[11px] font-medium text-neutral-500 tabular-nums">{track.bpm}</span></div>
                        <div className="col-span-1"><span className="text-[11px] font-medium text-neutral-500 tabular-nums">{track.duration}</span></div>
                        <div className="col-span-1"><span className="text-[11px] font-medium text-neutral-500 tabular-nums">{track.downloads}</span></div>
                        <div className="col-span-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            track.status === "published" ? "bg-primary/10 text-primary" : "bg-white/[0.04] text-neutral-500"}`}>
                            <div className={`w-1 h-1 rounded-full ${track.status === "published" ? "bg-primary" : "bg-neutral-600"}`} />
                            {track.status === "published" ? "Live" : "Draft"}
                          </span>
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded-md hover:bg-white/[0.05] text-neutral-600 hover:text-white transition-all" title="Edit"><Pencil size={13} /></button>
                          <button className="p-1.5 rounded-md hover:bg-white/[0.05] text-neutral-600 hover:text-white transition-all" title="Duplicate"><Copy size={13} /></button>
                          <Link href={`/music/${track.id}`} className="p-1.5 rounded-md hover:bg-white/[0.05] text-neutral-600 hover:text-white transition-all" title="View"><ExternalLink size={13} /></Link>
                          <button className="p-1.5 rounded-md hover:bg-red-500/10 text-neutral-600 hover:text-red-400 transition-all" title="Delete"><Trash2 size={13} /></button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Table Footer */}
                <div className="flex items-center justify-between mt-3 px-1">
                  <p className="text-[11px] text-neutral-600 font-medium">
                    {selectedTracks.size > 0 ? `${selectedTracks.size} selected · ` : ""}Showing {filteredTracks.length} of {RECENT_TRACKS.length} tracks
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="text-[11px] font-medium text-neutral-600 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-white/[0.03]">
                      <RefreshCw size={11} /> Refresh
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
               TAB: BULK IMPORT
               ══════════════════════════════════════════ */}
            {activeTab === "import" && (
              <motion.div key="import" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

                {/* Two-column layout: Import + Reference */}
                <div className="grid grid-cols-5 gap-6">

                  {/* Left: Upload (3 cols) */}
                  <div className="col-span-3">
                    {/* Import Type Toggle */}
                    <div className="flex items-center gap-2 mb-6">
                      {(["tracks", "sfx"] as const).map(t => (
                        <button key={t} onClick={() => setImportType(t)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                            importType === t ? "bg-primary/15 text-primary border border-primary/25" : "bg-white/[0.03] text-neutral-500 border border-white/[0.05] hover:bg-white/[0.06]"}`}>
                          {t === "tracks" ? <Music2 size={14} /> : <Volume2 size={14} />}
                          {t === "tracks" ? "Music Tracks" : "Sound Effects"}
                        </button>
                      ))}
                    </div>

                    {/* Upload Zone */}
                    <AnimatePresence mode="wait">
                      {importStatus === "idle" && (
                        <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <CSVDropzone onFileAccepted={(file) => setImportFile(file)} />
                          {importFile && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                              className="mt-4 flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><FileSpreadsheet size={16} className="text-primary" /></div>
                                <div>
                                  <p className="text-[12px] font-semibold text-neutral-200">{importFile.name}</p>
                                  <p className="text-[10px] text-neutral-600 font-medium">{(importFile.size / 1024).toFixed(1)} KB · {importType === "tracks" ? "Music" : "SFX"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => setImportFile(null)} className="p-1.5 rounded-md hover:bg-white/[0.05] text-neutral-600 hover:text-white transition-all"><X size={14} /></button>
                                <button onClick={handleImportSubmit}
                                  className="flex items-center gap-1.5 bg-primary text-black px-4 py-2 rounded-lg font-semibold text-[12px] hover:bg-primary/90 transition-all">
                                  <Upload size={13} /> Import
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                      {importStatus === "importing" && (
                        <motion.div key="importing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                          <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-5"><RefreshCw size={24} className="text-primary animate-spin" /></div>
                          <p className="text-[15px] font-semibold text-white mb-1">Importing tracks...</p>
                          <p className="text-[12px] text-neutral-500 font-medium">Processing {importFile?.name}</p>
                        </motion.div>
                      )}
                      {importStatus === "success" && (
                        <motion.div key="success" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-14">
                          <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-5"><CheckCircle2 size={24} className="text-primary" /></div>
                          <p className="text-[16px] font-semibold text-white mb-1">Import Successful</p>
                          <p className="text-[12px] text-neutral-500 font-medium mb-6">{importResults?.created} tracks created · {importResults?.errors} errors</p>
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => { setImportStatus("idle"); setImportFile(null); setImportResults(null); }}
                              className="px-4 py-2 bg-white/[0.05] border border-white/[0.06] rounded-lg text-[12px] font-semibold text-neutral-300 hover:bg-white/[0.08] transition-all">Import Another</button>
                            <button onClick={() => setActiveTab("tracks")}
                              className="px-4 py-2 bg-primary text-black rounded-lg text-[12px] font-semibold hover:bg-primary/90 transition-all">View Tracks</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Import History */}
                    <div className="mt-8 bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-white/[0.04] flex items-center gap-2">
                        <Clock size={13} className="text-neutral-600" />
                        <h3 className="text-[12px] font-semibold text-neutral-400">Import History</h3>
                      </div>
                      <div className="divide-y divide-white/[0.03]">
                        {IMPORT_HISTORY.map((imp) => (
                          <div key={imp.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-7 h-7 rounded-md flex items-center justify-center ${imp.type === "tracks" ? "bg-primary/10" : "bg-blue-500/10"}`}>
                                {imp.type === "tracks" ? <Music2 size={12} className="text-primary" /> : <Volume2 size={12} className="text-blue-400" />}
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-neutral-300">{imp.filename}</p>
                                <p className="text-[10px] text-neutral-600 font-medium">{imp.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[11px] font-semibold text-neutral-400 tabular-nums">{imp.created}/{imp.rows}</span>
                              {imp.errors === 0 ? <CheckCircle2 size={14} className="text-primary/60" /> : <AlertCircle size={14} className="text-amber-400" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: CSV Reference (2 cols) */}
                  <div className="col-span-2">
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 sticky top-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Hash size={14} className="text-primary" />
                        <h3 className="text-[12px] font-semibold text-white">CSV Format — {importType === "tracks" ? "Music" : "SFX"}</h3>
                      </div>

                      <div className="space-y-2.5 mb-5">
                        {(importType === "tracks" ? [
                          { name: "title", req: true, desc: "Track name" },
                          { name: "artist", req: true, desc: "Artist name" },
                          { name: "preview_url", req: true, desc: "MP3 path in Spaces" },
                          { name: "full_url", req: true, desc: "WAV path in Spaces" },
                          { name: "cover_url", req: false, desc: "Cover art path" },
                          { name: "bpm", req: false, desc: "Beats per minute" },
                          { name: "duration", req: false, desc: "Format: 3:24" },
                          { name: "key", req: false, desc: "Musical key" },
                          { name: "vocals", req: false, desc: "yes/no" },
                          { name: "energy", req: false, desc: "low/medium/high" },
                          { name: "genre", req: false, desc: "Pipe-separated" },
                          { name: "mood", req: false, desc: "Pipe-separated" },
                          { name: "instrument", req: false, desc: "Pipe-separated" },
                        ] : [
                          { name: "title", req: true, desc: "SFX name" },
                          { name: "preview_url", req: true, desc: "MP3 path" },
                          { name: "full_url", req: true, desc: "WAV path" },
                          { name: "duration", req: false, desc: "Format: 0:04" },
                          { name: "category", req: false, desc: "SFX category" },
                        ]).map((col) => (
                          <div key={col.name} className="flex items-start gap-2">
                            <code className="text-[10px] font-mono bg-white/[0.04] px-1.5 py-0.5 rounded text-primary shrink-0 mt-0.5">{col.name}</code>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] text-neutral-500 font-medium">{col.desc}</span>
                              {col.req && <span className="text-[9px] text-red-400 font-bold ml-1">*</span>}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-[#0a0a0c] rounded-lg p-3 border border-white/[0.04] mb-4">
                        <p className="text-[9px] font-semibold text-neutral-600 uppercase tracking-wider mb-2">Example row</p>
                        <pre className="text-[10px] font-mono text-neutral-400 leading-relaxed whitespace-pre-wrap break-all">
                          {importType === "tracks"
                            ? "Sunset Drive,Luna Waves,music/mp3/sunset.mp3,music/wav/sunset.wav,covers/sunset.jpg,120,3:24,C Minor,no,medium,cinematic|electronic,dreamy|chill,piano|synth"
                            : "Heavy Whoosh,sfx/mp3/whoosh.mp3,sfx/wav/whoosh.wav,0:04,whooshes"}
                        </pre>
                      </div>

                      <div className="flex items-start gap-2 p-3 bg-primary/[0.04] border border-primary/[0.08] rounded-lg">
                        <Zap size={13} className="text-primary shrink-0 mt-0.5" />
                        <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
                          Multi-value fields use <code className="text-primary font-semibold">|</code> as separator. Paths are relative to your DO Spaces bucket root.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
               TAB: SETTINGS
               ══════════════════════════════════════════ */}
            {activeTab === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="max-w-2xl">
                  <div className="space-y-6">

                    {/* Storage Connection */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Database size={15} className="text-primary" />
                        <h3 className="text-[14px] font-semibold text-white">Storage Connection</h3>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: "Endpoint", value: "sgp1.digitaloceanspaces.com" },
                          { label: "Bucket", value: "tracknit-storage" },
                          { label: "CDN URL", value: "tracknit-storage.sgp1.cdn.digitaloceanspaces.com" },
                          { label: "Region", value: "sgp1 (Singapore)" },
                        ].map(item => (
                          <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                            <span className="text-[12px] font-medium text-neutral-500">{item.label}</span>
                            <div className="flex items-center gap-2">
                              <code className="text-[11px] font-mono text-neutral-300 bg-white/[0.03] px-2 py-0.5 rounded">{item.value}</code>
                              <button className="p-1 rounded hover:bg-white/[0.05] text-neutral-600 hover:text-white transition-all"><Copy size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-4 p-2.5 bg-primary/[0.04] border border-primary/[0.08] rounded-lg">
                        <CheckCircle2 size={14} className="text-primary" />
                        <span className="text-[11px] font-medium text-primary">Connection healthy · Last verified 2m ago</span>
                      </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Shield size={15} className="text-primary" />
                        <h3 className="text-[14px] font-semibold text-white">Security</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[12px] font-semibold text-neutral-300">Signed URLs</p>
                            <p className="text-[10px] text-neutral-600 font-medium">Time-limited download links for subscribers</p>
                          </div>
                          <div className="w-10 h-6 rounded-full bg-primary/20 relative cursor-pointer">
                            <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-primary shadow-md" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[12px] font-semibold text-neutral-300">URL Expiry</p>
                            <p className="text-[10px] text-neutral-600 font-medium">How long download links remain valid</p>
                          </div>
                          <span className="text-[11px] font-mono text-neutral-400 bg-white/[0.03] px-2.5 py-1 rounded-md">3600s (1hr)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[12px] font-semibold text-neutral-300">CORS Origins</p>
                            <p className="text-[10px] text-neutral-600 font-medium">Allowed domains for audio playback</p>
                          </div>
                          <span className="text-[11px] font-mono text-neutral-400 bg-white/[0.03] px-2.5 py-1 rounded-md">tracknit.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </main>
      </div>

      {/* Manual Audio Uploader Glassmorphic Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (uploadPhase === "form" || uploadPhase === "success") setShowUploadModal(false); }}
              className="fixed inset-0 bg-black z-[180] pointer-events-auto"
            />
            
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0c0c0f] border border-white/[0.08] rounded-2xl p-6 z-[190] pointer-events-auto text-left shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-5 shrink-0 pb-3 border-b border-white/[0.04]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Upload size={16} /> Audio Workstation Uploader
                </h3>
                {uploadPhase === "form" && (
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.04] text-neutral-400 hover:text-white transition-all"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {uploadPhase === "form" && (
                <form onSubmit={handleManualUploadSubmit} className="space-y-4">
                  {/* WAV Dropzone */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Audio WAV Source File</label>
                    <div 
                      onClick={() => document.getElementById("manual-file-input")?.click()}
                      className="border border-dashed border-white/[0.06] bg-white/[0.01] hover:border-primary/40 hover:bg-primary/[0.01] rounded-xl p-6 text-center cursor-pointer transition-all"
                    >
                      <input 
                        id="manual-file-input" 
                        type="file" 
                        accept=".wav,.mp3" 
                        required
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileSelection(file);
                          }
                        }}
                      />
                      <Upload size={20} className="mx-auto text-neutral-600 mb-2" />
                      <p className="text-[12px] font-semibold text-neutral-300">
                        {isDecodingWaveform ? (
                          <span className="text-primary animate-pulse flex items-center justify-center gap-1.5">
                            <span className="inline-block w-2.5 h-2.5 rounded-full border border-t-transparent border-primary animate-spin" />
                            Analyzing audio frequencies & generating physical waveform peaks...
                          </span>
                        ) : generatedWaveform.length > 0 ? (
                          <span className="text-[#7CFF00] flex items-center justify-center gap-1">
                            Waveform generated: 80 physical peaks analyzed! ✓
                          </span>
                        ) : trackFile ? (
                          trackFile.name
                        ) : (
                          "Drag & Drop WAV file or click to browse"
                        )}
                      </p>
                      <p className="text-[10px] text-neutral-600 mt-1">Direct Cloudflare R2 Upload · WAV / MP3 only</p>
                    </div>
                  </div>

                  {/* Title & Artist */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Track Title</label>
                      <input
                        type="text"
                        required
                        value={trackTitle}
                        onChange={(e) => setTrackTitle(e.target.value)}
                        placeholder="E.g. Lunar Drift"
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg py-2 px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/30 text-white placeholder:text-neutral-600 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Artist Creator</label>
                      <input
                        type="text"
                        required
                        value={trackArtist}
                        onChange={(e) => setTrackArtist(e.target.value)}
                        placeholder="E.g. chrome pulse"
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg py-2 px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/30 text-white placeholder:text-neutral-600 font-medium"
                      />
                    </div>
                  </div>

                  {/* Genre, Key, BPM */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Genre</label>
                      <select
                        value={trackGenre}
                        onChange={(e) => setTrackGenre(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg py-2 px-3 text-[12px] focus:outline-none text-white font-medium"
                      >
                        <option value="Electronic" className="bg-[#121316]">Electronic</option>
                        <option value="Chill" className="bg-[#121316]">Chill</option>
                        <option value="Classical" className="bg-[#121316]">Classical</option>
                        <option value="Garage" className="bg-[#121316]">Garage</option>
                        <option value="Techno" className="bg-[#121316]">Techno</option>
                        <option value="Synthwave" className="bg-[#121316]">Synthwave</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Key Signature</label>
                      <input
                        type="text"
                        value={trackKey}
                        onChange={(e) => setTrackKey(e.target.value)}
                        placeholder="E.g. C Maj"
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg py-2 px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/30 text-white font-medium placeholder:text-neutral-600"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Tempo BPM</label>
                      <input
                        type="text"
                        value={trackBpm}
                        onChange={(e) => setTrackBpm(e.target.value)}
                        placeholder="E.g. 120"
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg py-2 px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/30 text-white font-medium placeholder:text-neutral-600 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Duration</label>
                      <input
                        type="text"
                        value={trackDuration}
                        onChange={(e) => setTrackDuration(e.target.value)}
                        placeholder="03:30"
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg py-2 px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/30 text-white font-medium placeholder:text-neutral-600 font-mono"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/95 text-black font-bold h-9 rounded-lg text-[12px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Upload size={13} /> Publish to Catalog
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {uploadPhase === "signing" && (
                <div className="py-12 text-center space-y-4">
                  <RefreshCw size={24} className="mx-auto text-primary animate-spin" />
                  <div>
                    <h4 className="font-semibold text-white text-sm">Securing R2 Presigned Authorization...</h4>
                    <p className="text-[11px] text-neutral-500 mt-1">Generating direct S3 upload policies on the Cloudflare Edge.</p>
                  </div>
                </div>
              )}

              {uploadPhase === "uploading" && (
                <div className="py-12 text-center space-y-5">
                  <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                  <div>
                    <h4 className="font-semibold text-white text-sm">Direct Uploading WAV to Cloudflare R2...</h4>
                    <p className="text-[11px] text-neutral-500 mt-1">Audio never touches WordPress · {uploadProgress}%</p>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden max-w-xs mx-auto">
                    <div className="h-full bg-primary transition-all duration-100" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {uploadPhase === "syncing" && (
                <div className="py-12 text-center space-y-4">
                  <Database size={24} className="mx-auto text-blue-400 animate-pulse" />
                  <div>
                    <h4 className="font-semibold text-white text-sm">Synchronizing Metadata to Headless WordPress...</h4>
                    <p className="text-[11px] text-neutral-500 mt-1">Registering track CPT record and taxonomy fields.</p>
                  </div>
                </div>
              )}

              {uploadPhase === "success" && (
                <div className="py-12 text-center space-y-6">
                  <div className="w-14 h-14 bg-primary/10 border border-primary/25 rounded-2xl flex items-center justify-center text-primary mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[16px]">Track Successfully Published!</h4>
                    <p className="text-[11px] text-neutral-500 mt-1 max-w-xs mx-auto">
                      "{trackTitle}" is now live in the licensing workstation catalog and fully whitelisted on Cloudflare Pages.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="bg-white hover:bg-neutral-100 text-black font-bold py-2 px-6 rounded-lg text-[11px] uppercase tracking-wider transition-all"
                  >
                    Done & Return
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
