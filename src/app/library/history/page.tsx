import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ChevronRight } from "lucide-react";

const SidebarLink = ({ icon: Icon, label, active, href }: any) => {
  const content = (
    <>
      <Icon size={18} strokeWidth={active ? 2.5 : 1.5} className={`${active ? "text-primary filter drop-shadow-[0_0_8px_rgba(124,255,0,0.5)]" : "text-neutral-500"}`} />
      <span className={`text-[13.5px] tracking-tight ${active ? "text-white font-bold" : "text-neutral-400 font-medium group-hover:text-neutral-200"}`}>{label}</span>
    </>
  );

  if (href && href !== "#") {
    return (
      <Link href={href} className={`flex items-center gap-3.5 px-4 py-2.5 rounded-full transition-all duration-300 group ${active ? "bg-white/[0.06] shadow-md shadow-black/20" : "hover:bg-white/[0.03]"}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`flex items-center gap-3.5 px-4 py-2.5 rounded-full transition-all duration-300 group cursor-pointer ${active ? "bg-white/[0.06] shadow-md shadow-black/20" : "hover:bg-white/[0.03]"}`}>
      {content}
    </div>
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

export default function HistoryPage() {
  redirect("/library/royalty-free-music");
}
