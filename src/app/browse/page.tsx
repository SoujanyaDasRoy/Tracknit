import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ChevronRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA FOR BROWSE
   ═══════════════════════════════════════════════════════════════════════════ */
const FEATURED_COLLECTIONS = [
  { id: "c1", title: "Cinematic Epic", items: "24 tracks", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80" },
  { id: "c2", title: "Lofi Study", items: "18 tracks", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80" },
  { id: "c3", title: "UI Essentials", items: "150 sounds", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80" },
  { id: "c4", title: "Action Trailer", items: "32 tracks", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80" },
];

const RECENT_TRACKS = [
  { id: "m1", title: "Ethereal Drift", artist: "Lunar Architect", genre: "Chill", duration: "04:32", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80" },
  { id: "m2", title: "Subzero Signal", artist: "Vector Field", genre: "Techno", duration: "05:14", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80" },
  { id: "m3", title: "Neon Monolith", artist: "Chrome Pulse", genre: "Synthwave", duration: "03:45", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&q=80" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */
const SidebarLink = ({ icon: Icon, label, active, href }: any) => {
  const content = (
    <>
      <Icon size={18} strokeWidth={active ? 2.5 : 1.5} className={`${active ? "text-primary filter drop-shadow-[0_0_8px_rgba(124,255,0,0.5)]" : "text-neutral-500"}`} />
      <span className={`text-[13.5px] tracking-tight ${active ? "text-white font-bold" : "text-neutral-400 font-medium group-hover:text-neutral-200"}`}>{label}</span>
    </>
  );

  return (
    <Link href={href} className={`flex items-center gap-3.5 px-4 py-2.5 rounded-full transition-all duration-300 group ${active ? "bg-white/[0.06] shadow-md shadow-black/20" : "hover:bg-white/[0.03]"}`}>
      {content}
    </Link>
  );
};

const PopoverItem = ({ icon: Icon, label, external, chevron, danger }: any) => (
  <button className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors group">
    <div className="flex items-center gap-3">
      <Icon size={16} strokeWidth={1.5} className={danger ? "text-red-400" : "text-neutral-500"} />
      <span className={`text-[13px] ${danger ? "text-red-400" : "text-neutral-300 group-hover:text-white"} font-medium`}>{label}</span>
    </div>
    <div className="flex items-center text-neutral-600">
      {external && <ExternalLink size={14} />}
      {chevron && <ChevronRight size={14} />}
    </div>
  </button>
);

export default function BrowsePage() {
  redirect("/library/royalty-free-music");
}
