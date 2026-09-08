"use client";

/*
THESIS: Calm Intelligence makes a chaotic lead pipeline feel autonomously triaged — an executive, high-trust
surface where every score is explainable and nothing urgent gets lost.
OWN-WORLD: A luminous white workspace floating on a soft gray canvas, punctuated by deep-charcoal hero tiles,
cobalt primary actions, and pill-shaped semantic badges for lead temperature.
STORY: Land on the lead overview, see qualification trend and temperature at a glance, drop into the leads
table, open a lead to read its AI-explained score, then act — contact, schedule, or hand off.
FORM: Nested floating enclosure shell, 12-col analytics grid, dense lead ledger, right-side evidence drawer.
Source system: "Calm Intelligence Lead Platform" (designs/template-01-designs/*).
*/

import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import "./calm-intelligence.css";
import {
  AddressBook, ArrowClockwise, ArrowCounterClockwise, ArrowLeft, ArrowRight, ArrowSquareOut, ArrowsDownUp, ArrowsLeftRight, ArrowsOut, Bell, BellRinging, BookOpenText, BookmarkSimple, Brain, Buildings, CalendarBlank, CalendarCheck, CaretDoubleLeft, CaretDoubleRight, CaretDown, CaretLeft, CaretRight, CaretUp,
  ChartBar, ChartLineUp, ChatCircle, Check, CheckCircle, Circle, CircleDashed, CirclesThreePlus, Clock, ClockCounterClockwise, Cloud, Code, Coins, Compass, CursorClick,
  Command, Copy, CreditCard, CurrencyEur, Database, DeviceMobile, Devices, DotsSixVertical, DotsThree, DotsThreeVertical, DownloadSimple, Envelope, Export, Eye, FileText, Fingerprint, Fire, Flag, FloppyDisk, FlowArrow, Funnel, FunnelSimple, Gauge, GearSix, GitFork, Globe, GoogleLogo,
  Handshake, Headset, IdentificationBadge, Info, Kanban, Key, Laptop, Lifebuoy, Lightbulb, Lightning, Link as LinkIcon, LinkSimple, LinkedinLogo, ListBullets, ListChecks, Lock, LockOpen, MagnifyingGlass, MapPin, Megaphone, Microphone, MicrosoftOutlookLogo, Minus, MinusCircle, Monitor, Moon, NotePencil, Package, Paperclip, Password,
  PaintBrush, PaperPlaneRight, PaperPlaneTilt, Percent, Phone, PlayCircle, Plugs, Plus, PlusCircle, PuzzlePiece, QrCode, Question, Receipt, Repeat, Robot, Scales, SealCheck, ShareNetwork, ShieldCheck, ShieldCheckered, ShieldWarning, SignIn, SignOut, SlackLogo, Smiley, SortAscending, SortDescending, SpeakerHigh, Star, SunDim, ThumbsDown, Trophy,
  SlidersHorizontal, Snowflake, Sparkle, SpinnerGap, Plant, Table, Tag, Target, TestTube, TextAa, TextAlignLeft, Timer, Translate, Trash, Tray, TreeStructure, TrendDown, TrendUp, UploadSimple, UserCircle, UserPlus, Users, VideoCamera, Warning, WebhooksLogo, WhatsappLogo,
  X, XCircle,
} from "@phosphor-icons/react";

type Temp = "Hot" | "Warm" | "Cold";
type Lead = {
  id: number; name: string; company: string; initials: string; color: string;
  email: string; phone: string; score: number; temp: Temp; interest: string;
  stage: "New" | "Contacted" | "Qualified" | "Proposal Sent" | "Meeting Scheduled" | "Nurture";
  owner: string; received: string; followup: string; summary: string;
};

const leads: Lead[] = [
  { id: 1, name: "Olivia Martin", company: "Acme Corp", initials: "OM", color: "#DDE3FF", email: "olivia.martin@acmecorp.com", phone: "+91 98201 44821", score: 94, temp: "Hot", interest: "AI Automation", stage: "Meeting Scheduled", owner: "Maya Singh", received: "4m ago", followup: "Overdue by 2h", summary: "Evaluating AI qualification across three product sites. Budget is approved and she wants to launch within two weeks.", },
  { id: 2, name: "Ethan Brooks", company: "Zenith Cloud", initials: "EB", color: "#DFF4EC", email: "ethan.brooks@zenithcloud.io", phone: "+1 415 555 0132", score: 91, temp: "Hot", interest: "Web Development", stage: "Qualified", owner: "Arjun Mehta", received: "12m ago", followup: "Today, 3:00 PM", summary: "High-intent enquiry with detailed implementation questions. Requested a tailored product walkthrough.", },
  { id: 3, name: "Sophia Chen", company: "FinScale AI", initials: "SC", color: "#FBE7EE", email: "sophia.c@finscale.ai", phone: "+65 8123 4477", score: 88, temp: "Hot", interest: "E-commerce", stage: "Proposal Sent", owner: "Riya Sen", received: "31m ago", followup: "Tomorrow", summary: "Runs a growing commerce platform and needs leads separated by service line. Timeline is this quarter.", },
  { id: 4, name: "Liam Wilson", company: "HyperGrowth", initials: "LW", color: "#FDEFD8", email: "liam@hypergrowth.co", phone: "+1 212 555 0110", score: 86, temp: "Hot", interest: "AI Automation", stage: "Qualified", owner: "Maya Singh", received: "48m ago", followup: "Friday", summary: "Strong fit and buying intent. Technical validation with the platform team is still in progress.", },
  { id: 5, name: "David Vance", company: "Vance Logistics", initials: "DV", color: "#E7E9F5", email: "david@vancelogistics.com", phone: "+61 412 555 018", score: 72, temp: "Warm", interest: "Custom Integration", stage: "New", owner: "Unassigned", received: "1h ago", followup: "Demo in 45m", summary: "Interested in routing buyer enquiries by region. Decision timeline has not been confirmed yet.", },
  { id: 6, name: "Priya Sharma", company: "Apex Retail", initials: "PS", color: "#FDEFD8", email: "priya@apexretail.in", phone: "+91 98765 44210", score: 68, temp: "Warm", interest: "E-commerce", stage: "Contacted", owner: "You", received: "2h ago", followup: "Not set", summary: "Researching qualification tooling ahead of a holiday traffic spike. No confirmed budget yet.", },
  { id: 7, name: "Marcus Brody", company: "KiteWorks", initials: "MB", color: "#E7EAF0", email: "mbrody@kiteworks.net", phone: "+44 7700 900247", score: 48, temp: "Cold", interest: "SEO & Growth", stage: "Nurture", owner: "Jon Bell", received: "3h ago", followup: "Sep 12", summary: "Early-stage research. No active budget or confirmed purchase window at this time.", },
];

const workspaceNav = [
  ["Dashboard", Target] as const,
  ["Inbox", ChatCircle] as const,
  ["Leads", Users] as const,
  ["Follow-ups", PaperPlaneTilt] as const,
  ["AI Agent", Robot] as const,
  ["Qualification", ListChecks] as const,
  ["Knowledge Base", BookOpenText] as const,
  ["Websites & Widget", PuzzlePiece] as const,
  ["Analytics", ChartLineUp] as const,
  ["Integrations", CirclesThreePlus] as const,
];
const adminNav = [
  ["Team", IdentificationBadge] as const,
  ["Notifications", Bell] as const,
  ["Billing & Usage", CreditCard] as const,
  ["Settings", GearSix] as const,
];

const navActive = "text-white bg-[linear-gradient(135deg,#3157ff_0%,#405cff_55%,#2947ee_100%)] shadow-[0_6px_18px_rgba(49,87,255,0.32),inset_0_1px_0_rgba(255,255,255,0.4)]";
const navInactive = "border border-transparent text-[#57628A] hover:border-white/70 hover:bg-white/65 hover:text-[#1E2A4A] hover:shadow-[0_1px_3px_rgba(55,72,180,0.08)]";
function NavShine() {
  return <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-xl bg-gradient-to-b from-white/25 to-transparent" />;
}

const tempStyle: Record<Temp, { icon: typeof Fire; dot: string; text: string; bg: string }> = {
  Hot: { icon: Fire, dot: "bg-[#F04452]", text: "text-[#F04452]", bg: "bg-[#FDF2F3]" },
  Warm: { icon: Lightning, dot: "bg-[#F5A524]", text: "text-[#F5A524]", bg: "bg-[#FEF8EC]" },
  Cold: { icon: Snowflake, dot: "bg-[#7190A8]", text: "text-[#7190A8]", bg: "bg-[#F1F5F8]" },
};

const stageStyle: Record<Lead["stage"], { icon: typeof SealCheck; text: string; bg: string }> = {
  New: { icon: Tray, text: "text-[#444656]", bg: "bg-[#EEF0F7]" },
  Contacted: { icon: Envelope, text: "text-[#0034DC]", bg: "bg-[#E7EBFF]" },
  Qualified: { icon: SealCheck, text: "text-[#0B7A57]", bg: "bg-[#E8F8F3]" },
  "Proposal Sent": { icon: PaperPlaneTilt, text: "text-[#5B3FD1]", bg: "bg-[#EFEBFC]" },
  "Meeting Scheduled": { icon: CalendarBlank, text: "text-white", bg: "bg-[#0B7A57]" },
  Nurture: { icon: Plant, text: "text-[#444656]", bg: "bg-[#EEF0F7]" },
};

function TempPill({ temp }: { temp: Temp }) {
  const s = tempStyle[temp];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {temp}
      <Icon weight="fill" className="text-[12px]" />
    </span>
  );
}

function StageChip({ stage }: { stage: Lead["stage"] }) {
  const s = stageStyle[stage];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.bg} ${s.text}`}>
      <Icon weight="fill" className="text-[12px]" />
      {stage}
    </span>
  );
}

function Sparkline({ up = true }: { up?: boolean }) {
  return (
    <svg viewBox="0 0 96 32" className="h-8 w-24" aria-hidden="true">
      <path
        d={up ? "M2 27C12 27 16 12 26 15S40 22 50 13S66 4 78 8S90 4 94 3" : "M2 6C12 6 16 20 26 18S40 12 50 20S66 27 78 24S90 27 94 27"}
        fill="none" stroke="#0034DC" strokeWidth="2.4" strokeLinecap="round"
      />
    </svg>
  );
}

type KpiVariant = "new-leads" | "qualified" | "hot" | "conversion";

/* Decorative only: absolutely positioned, aria-hidden, capped well under the
   card's fixed height so it can never affect layout — see calm-intelligence.css
   for why that guarantee lives here (on the SVG) and not on a parent selector. */
function KpiPattern({ variant }: { variant: KpiVariant }) {
  const common = { "aria-hidden": "true" as const, focusable: "false" as const, className: "card-pattern pointer-events-none absolute" };
  switch (variant) {
    case "new-leads":
      return (
        <svg {...common} viewBox="0 0 104 64" className={`${common.className} right-3 top-1/2 h-[52px] w-[92px] -translate-y-1/2`}>
          <g fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1">
            <path d="M4 56 C24 46 30 34 46 30 S72 14 100 6" />
          </g>
          <g fill="rgba(255,255,255,0.16)">
            <circle cx="4" cy="56" r="2" /><circle cx="46" cy="30" r="2" /><circle cx="100" cy="6" r="2" />
          </g>
        </svg>
      );
    case "qualified":
      return (
        <svg {...common} viewBox="0 0 74 74" className={`${common.className} right-3 top-3 h-[68px] w-[68px]`}>
          <g fill="none" stroke="rgba(59,91,255,0.11)" strokeWidth="1.1">
            <circle cx="37" cy="37" r="34" />
            <circle cx="37" cy="37" r="22" />
            <circle cx="37" cy="37" r="10" />
          </g>
        </svg>
      );
    case "hot":
      return (
        <svg {...common} viewBox="0 0 92 64" className={`${common.className} right-3 top-1/2 h-[56px] w-[84px] -translate-y-1/2`}>
          <g fill="none" stroke="rgba(255,110,90,0.15)" strokeWidth="1.1" strokeLinecap="round">
            <path d="M10 60 C20 46 16 36 26 26 S30 8 40 3" />
            <path d="M32 60 C42 48 36 38 46 28 S50 12 58 5" />
            <path d="M54 60 C64 50 58 40 66 32 S70 16 76 9" />
          </g>
        </svg>
      );
    case "conversion":
      return (
        <svg {...common} viewBox="0 0 104 56" className={`${common.className} right-3 top-1/2 h-[48px] w-[96px] -translate-y-1/2`}>
          <path d="M4 48 C30 48 34 20 62 20 S82 8 100 3" fill="none" stroke="rgba(64,92,255,0.15)" strokeWidth="1.25" />
          <g fill="rgba(64,92,255,0.22)">
            <circle cx="4" cy="48" r="1.8" /><circle cx="48" cy="34" r="1.5" /><circle cx="76" cy="14" r="1.6" /><circle cx="100" cy="3" r="1.8" />
          </g>
        </svg>
      );
  }
}

const kpiIconWrap: Record<KpiVariant, string> = {
  "new-leads": "border border-white/16 bg-[rgba(255,255,255,0.07)] text-[#EDEDEF] backdrop-blur-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_6px_14px_rgba(0,0,0,0.22)]",
  qualified: "border border-white/70 bg-white/35 text-[#3157FF] backdrop-blur-[8px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_5px_12px_rgba(49,82,255,0.12)]",
  hot: "border border-white/70 bg-white/35 text-[#F04452] backdrop-blur-[8px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_5px_12px_rgba(255,80,80,0.14)]",
  conversion: "border border-white/70 bg-white/35 text-[#4B5EFF] backdrop-blur-[8px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_5px_12px_rgba(64,92,255,0.12)]",
};

function KpiCard({ variant, label, value, icon: Icon, delta, note }: { variant: KpiVariant; label: string; value: string; icon: typeof Fire; delta: string; note: string }) {
  const dark = variant === "new-leads";
  const badgeClass = dark
    ? "border border-[rgba(79,220,177,0.28)] bg-[rgba(35,190,145,0.16)] text-[#75E8C4] backdrop-blur-[8px] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
    : "border border-[rgba(53,190,151,0.20)] bg-gradient-to-b from-[rgba(224,255,246,0.92)] to-[rgba(205,246,235,0.78)] text-[#0B7A57] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]";
  return (
    <div className={`kpi-card kpi-card--${variant} ${dark ? "" : "kpi-card--light"} flex h-[172px] min-h-[164px] flex-col justify-between p-5`}>
      <KpiPattern variant={variant} />
      <div className="relative z-10 flex items-center justify-between">
        <span className={`text-[12px] font-medium ${dark ? "text-white/70" : "text-[#5E626D]"}`}>{label}</span>
        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${kpiIconWrap[variant]}`}><Icon className="text-[15px]" /></div>
      </div>
      <div className={`relative z-10 text-[38px] font-bold leading-none tracking-tight ${dark ? "text-white" : "text-[#151515]"}`}>{value}</div>
      <div className="relative z-10 flex items-center justify-between">
        <span className={`inline-flex h-[22px] items-center gap-1 rounded-full px-[9px] text-[11px] font-semibold ${badgeClass}`}><TrendUp className="text-[12px]" />{delta}</span>
        <span className={`text-[10px] ${dark ? "text-white/50" : "text-[#8E929C]"}`}>{note}</span>
      </div>
    </div>
  );
}

export default function CalmIntelligence() {
  const [section, setSection] = useState("Dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const collapsed = sidebarCollapsed && !mobileNav;
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [statesOpen, setStatesOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: PointerEvent) {
      if (notifOpen && !notifRef.current?.contains(e.target as Node)) setNotifOpen(false);
      if (accountOpen && !accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
    }
    document.addEventListener("pointerdown", onClick);
    return () => document.removeEventListener("pointerdown", onClick);
  }, [notifOpen, accountOpen]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  const goTo = (name: string) => { setSection(name); setMobileNav(false); setAccountOpen(false); };

  return (
    <div className="relative flex h-dvh w-full overflow-hidden bg-white">
      {mobileNav && <button aria-label="Close navigation" onClick={() => setMobileNav(false)} className="fixed inset-0 z-30 bg-black/30 md:hidden" />}

      <aside className={`ci-sidebar isolate fixed z-40 flex h-dvh w-72 shrink-0 -translate-x-full flex-col overflow-hidden border-r border-[rgba(148,163,209,0.16)] bg-[linear-gradient(180deg,#ffffff_0%,#f7f8ff_35%,#f1f4ff_70%,#f8f9ff_100%)] shadow-[inset_-1px_0_0_rgba(255,255,255,0.75),8px_0_30px_rgba(55,72,180,0.06)] transition-[transform,width] duration-200 md:relative md:translate-x-0 ${mobileNav ? "translate-x-0" : ""} ${collapsed ? "md:w-20" : "md:w-60"}`}>
          <div className={`flex h-16 shrink-0 items-center gap-3 px-4 ${collapsed ? "md:justify-center md:px-3" : ""}`}>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#151515] text-white shadow-[0_4px_10px_rgba(20,20,20,0.25)]"><Command weight="bold" /></div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-bold text-[#151515]">AILQS</span>
                <span className="block truncate text-[10px] font-bold uppercase tracking-wider text-[#8E929C]">Calm Intelligence</span>
              </div>
            )}
            <button aria-label="Close navigation" onClick={() => setMobileNav(false)} className="ml-auto text-[#8E929C] md:hidden"><X /></button>
          </div>

          <div className={`min-h-0 flex-1 overflow-y-auto px-4 ${collapsed ? "md:px-3" : ""}`}>
            <div className="flex flex-col gap-1">
              {!collapsed && <span className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-[#8E929C]">Workspace</span>}
              <nav className="flex flex-col gap-1">
                {workspaceNav.map(([name, Icon]) => (
                  <button key={name} aria-current={section === name ? "page" : undefined} title={collapsed ? name : undefined} onClick={() => goTo(name)}
                    className={`relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition-colors duration-200 ${collapsed ? "justify-center px-0" : ""} ${section === name ? navActive : navInactive}`}>
                    {section === name && <NavShine />}
                    <Icon weight={section === name ? "fill" : "regular"} className="relative z-10 shrink-0 text-[18px]" />
                    {!collapsed && <span className="relative z-10 flex-1">{name}</span>}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-6 flex flex-col gap-1">
              {!collapsed && <span className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-[#8E929C]">Administration</span>}
              <nav className="flex flex-col gap-1">
                {adminNav.map(([name, Icon]) => (
                  <button key={name} aria-current={section === name ? "page" : undefined} title={collapsed ? name : undefined} onClick={() => goTo(name)}
                    className={`relative flex items-center overflow-hidden rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition-colors duration-200 ${collapsed ? "justify-center px-0" : "justify-between"} ${section === name ? navActive : navInactive}`}>
                    {section === name && <NavShine />}
                    <span className="relative z-10 flex items-center gap-3"><Icon weight={section === name ? "fill" : "regular"} className="shrink-0 text-[18px]" />{!collapsed && <span>{name}</span>}</span>
                    {!collapsed && name === "Notifications" && <span className={`relative z-10 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${section === name ? "bg-white/25 text-white" : "bg-[#3152F4] text-white"}`}>3</span>}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className={`shrink-0 p-4 ${collapsed ? "md:p-3" : ""}`}>
            <div className="flex flex-col gap-3 border-t border-[rgba(148,163,209,0.18)] pt-4">
              <Link href="/" title={collapsed ? "Design gallery" : undefined} className={`flex items-center gap-2 rounded-lg px-3 py-1 text-[11px] font-semibold text-[#57628A] transition-colors duration-200 hover:bg-white/65 hover:text-[#1E2A4A] ${collapsed ? "justify-center px-0" : ""}`}><ArrowLeft className="shrink-0 text-[13px]" /> {!collapsed && "Design gallery"}</Link>
              <button onClick={() => goTo("Help")} title={collapsed ? "Help & Support" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left text-[13px] font-semibold text-[#57628A] transition-colors duration-200 hover:bg-white/65 hover:text-[#1E2A4A] ${collapsed ? "justify-center px-0" : ""}`}><Lifebuoy className="shrink-0 text-[18px]" /> {!collapsed && "Help & Support"}</button>
              {!collapsed && (
                <div className="flex flex-col gap-2.5 rounded-xl border border-white/80 bg-white/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_20px_rgba(55,72,180,0.08)] backdrop-blur-sm">
                  <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-[#151515]">Starter Plan</span><span className="text-[10px] font-bold text-[#0B7A57]">Active</span></div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[#5E626D]"><span className="text-[11px]">742 / 1,000</span><span className="text-[10px] font-bold">74%</span></div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E8F5]"><div className="h-full rounded-full bg-[#3152F4]" style={{ width: "74%" }} /></div>
                    <span className="text-[10px] text-[#8E929C]">Monthly AI conversations</span>
                  </div>
                  <button onClick={() => goTo("Billing & Usage")} className="mt-1 rounded-lg bg-[#E5E8F5] py-1.5 text-center text-[11px] font-semibold text-[#151515] transition-colors hover:bg-[#3152F4] hover:text-white">Upgrade Plan</button>
                </div>
              )}
            </div>
          </div>
        </aside>

        <button
          type="button"
          aria-pressed={sidebarCollapsed}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setSidebarCollapsed((v) => !v)}
          style={{ top: 18 }}
          className={`absolute z-30 hidden h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-[#EDEDF2] bg-white text-[#8E929C] shadow-[0_2px_8px_rgba(20,25,40,0.14)] transition-[left] duration-200 hover:text-[#151515] hover:shadow-[0_4px_12px_rgba(20,25,40,0.2)] md:flex ${collapsed ? "left-20" : "left-60"}`}
        >
          {collapsed ? <CaretDoubleRight weight="bold" className="text-[12px]" /> : <CaretDoubleLeft weight="bold" className="text-[12px]" />}
        </button>

        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <header className="z-10 flex h-16 shrink-0 items-center justify-between gap-4 px-4 shadow-[0_1px_8px_rgba(0,0,0,0.03)] lg:px-8">
            <div className="flex flex-1 items-center gap-3">
              <button aria-label="Open navigation" onClick={() => setMobileNav(true)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F1F3FF] text-[#444656] md:hidden"><ListChecks /></button>
              <div className="hidden shrink-0 items-center gap-2 rounded-full bg-[#F1F3FF] px-3 py-1.5 sm:flex">
                <span className="h-2 w-2 rounded-full bg-[#0B7A57] ring-2 ring-[#0B7A57]/20" />
                <span className="text-[12px] font-semibold text-[#151515]">ailqs.com</span>
                <CaretDown className="text-[13px] text-[#8E929C]" />
              </div>
              <label className="relative hidden w-full max-w-sm md:block">
                <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#8E929C]" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search leads, chats, workflows..." aria-label="Global search"
                  className="h-9 w-full rounded-full bg-[#F1F3FF] pl-9 pr-12 text-[12px] text-[#151515] outline-none placeholder:text-[#8E929C] focus:bg-white focus:ring-2 focus:ring-[#3152F4]/25" />
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded bg-[#E5E8F5] px-1.5 py-0.5 text-[9px] font-bold text-[#8E929C]">⌘K</kbd>
              </label>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-4">
              <button onClick={() => setStatesOpen(true)} className="hidden items-center gap-1.5 rounded-xl border border-[#EDEDF2] px-3 py-1.5 text-[12px] font-semibold text-[#5E626D] hover:bg-[#F8F8FA] sm:flex"><Eye />States</button>
              <button onClick={() => notify("Quick create opened")} className="flex items-center gap-1.5 rounded-xl bg-[#3152F4] px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(49,82,244,0.28)] transition-opacity hover:opacity-95">
                <Plus className="text-[16px]" /><span className="hidden sm:inline">Quick Create</span>
              </button>
              <div className="relative" ref={notifRef}>
                <button aria-label="Open notifications" aria-expanded={notifOpen} onClick={() => setNotifOpen((v) => !v)} className="relative grid h-9 w-9 place-items-center rounded-full text-[#5E626D] transition-colors hover:bg-[#F1F3FF]">
                  <Bell className="text-[18px]" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#F04452]" />
                </button>
                {notifOpen && <NotificationPanel close={() => setNotifOpen(false)} openLead={() => { setNotifOpen(false); setSelected(leads[0]); }} />}
              </div>
              <div className="relative" ref={accountRef}>
                <button aria-haspopup="menu" aria-expanded={accountOpen} onClick={() => setAccountOpen((v) => !v)} className="flex items-center gap-2 pl-1">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#DDE3FF] text-[11px] font-bold text-[#0034DC]">MS</span>
                  <span className="hidden flex-col text-left xl:flex"><span className="text-[12px] font-semibold text-[#151515]">Maya Singh</span><span className="text-[10px] text-[#8E929C]">Product Lead</span></span>
                </button>
                {accountOpen && <AccountMenu close={() => setAccountOpen(false)} goTo={goTo} notify={notify} />}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-[#FBFBFD] p-4 lg:p-6">
            {section === "Dashboard" && <Overview openLead={setSelected} setSection={setSection} notify={notify} />}
            {section === "Inbox" && <InboxPage openLead={setSelected} setSection={setSection} notify={notify} />}
            {section === "Knowledge Base" && <KnowledgeBasePage notify={notify} />}
            {section === "Analytics" && <AnalyticsPage notify={notify} />}
            {section === "Integrations" && <IntegrationsPage notify={notify} setSection={setSection} />}
            {section === "Leads" && <LeadsPage openLead={setSelected} notify={notify} query={query} setQuery={setQuery} />}
            {section === "AI Agent" && <AiAgentPage notify={notify} />}
            {section === "Follow-ups" && <FollowUpsPage notify={notify} />}
            {section === "Qualification" && <QualificationPage notify={notify} />}
            {section === "Billing & Usage" && <BillingUsagePage notify={notify} />}
            {section === "Notifications" && <NotificationsPage notify={notify} setSection={setSection} />}
            {section === "Team" && <TeamPage notify={notify} setSection={setSection} />}
            {section === "Settings" && <SettingsPage notify={notify} setSection={setSection} />}
            {(["Profile", "Personalization", "Help"] as const).includes(section as never) && <AccountPage page={section as "Profile" | "Personalization" | "Help"} notify={notify} collapsed={collapsed} />}
            {moduleData[section] && <ModuleView data={moduleData[section]} notify={notify} />}
          </main>
        </div>

      {selected && <LeadDrawer lead={selected} close={() => setSelected(null)} notify={notify} />}
      {statesOpen && <StateDialog close={() => setStatesOpen(false)} />}
      {toast && <div role="status" className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#151515] px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_16px_36px_rgba(0,0,0,0.3)]"><CheckCircle weight="fill" className="text-[#58DDAC]" />{toast}</div>}
    </div>
  );
}

type ChartPeriod = "weekly" | "monthly";
interface ChartDatum {
  label: string;
  newLeads: number;
  qualified: number;
}

// Fallback demonstration data — this prototype has no backend, so there is no
// real API series to preserve (see README: "all data is hardcoded mock data").
const weeklyChartData: ChartDatum[] = [
  { label: "Mon", newLeads: 28, qualified: 18 },
  { label: "Tue", newLeads: 34, qualified: 22 },
  { label: "Wed", newLeads: 31, qualified: 24 },
  { label: "Thu", newLeads: 42, qualified: 31 },
  { label: "Fri", newLeads: 48, qualified: 37 },
  { label: "Sat", newLeads: 35, qualified: 25 },
  { label: "Sun", newLeads: 29, qualified: 21 },
];
const monthlyChartData: ChartDatum[] = [
  { label: "Jan", newLeads: 174, qualified: 102 },
  { label: "Feb", newLeads: 142, qualified: 76 },
  { label: "Mar", newLeads: 218, qualified: 158 },
  { label: "Apr", newLeads: 246, qualified: 181 },
  { label: "May", newLeads: 267, qualified: 236 },
  { label: "Jun", newLeads: 229, qualified: 169 },
];

function QualificationChart() {
  const [period, setPeriod] = useState<ChartPeriod>("monthly");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  const data = useMemo(() => (period === "weekly" ? weeklyChartData : monthlyChartData), [period]);

  const yAxisMax = useMemo(() => {
    const maximumValue = Math.max(...data.flatMap((item) => [item.newLeads, item.qualified]));
    return Math.ceil((maximumValue * 1.15) / 10) * 10;
  }, [data]);

  const totalQualified = useMemo(() => data.reduce((sum, item) => sum + item.qualified, 0), [data]);

  const peakIndex = useMemo(
    () => data.reduce((best, item, idx, arr) => (item.qualified > arr[best].qualified ? idx : best), 0),
    [data],
  );

  const peakGrowthPct = useMemo(() => {
    const previous = data[peakIndex - 1];
    if (!previous || previous.qualified === 0) return 0;
    return ((data[peakIndex].qualified - previous.qualified) / previous.qualified) * 100;
  }, [data, peakIndex]);

  useEffect(() => {
    setActiveIndex(null);
    setAnimateIn(false);
    const frame = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(frame);
  }, [period]);

  return (
    <div className="flex flex-col justify-between rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.05)] lg:col-span-8">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-[17px] font-semibold text-[#151515]">Lead Qualification Overview</h2>
          <p className="mt-0.5 text-[12px] text-[#8E929C]">Visitor qualification funnel performance</p>
        </div>
        <div className="relative grid w-[168px] grid-cols-2 self-start rounded-full bg-[#F1F2F5] p-1 sm:self-auto">
          <span
            aria-hidden="true"
            className="motion-reduce:transition-none pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-[260ms] ease-out"
            style={{
              transform: period === "weekly" ? "translateX(0%)" : "translateX(100%)",
              background: "linear-gradient(180deg, #4968ff 0%, #3153f5 58%, #2846e8 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 5px 12px rgba(49,83,245,0.24)",
            }}
          />
          <button
            type="button"
            aria-pressed={period === "weekly"}
            onClick={() => setPeriod("weekly")}
            className={`relative z-10 rounded-full px-3.5 py-1 text-[11px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3152F4]/50 focus-visible:ring-offset-1 ${period === "weekly" ? "text-white" : "text-[#5E626D]"}`}
          >
            Weekly
          </button>
          <button
            type="button"
            aria-pressed={period === "monthly"}
            onClick={() => setPeriod("monthly")}
            className={`relative z-10 rounded-full px-3.5 py-1 text-[11px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3152F4]/50 focus-visible:ring-offset-1 ${period === "monthly" ? "text-white" : "text-[#5E626D]"}`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div key={period} className="ci-value-fade mb-4 flex flex-wrap items-center gap-6 rounded-2xl bg-[#F8F8FA] p-4">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8E929C]">Total Qualified</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[20px] font-bold text-[#151515]">{totalQualified} Qualified</span>
            <span className="text-[12px] font-semibold text-[#0B7A57]">{peakGrowthPct >= 0 ? "+" : ""}{peakGrowthPct.toFixed(1)}% peak</span>
          </div>
        </div>
        <div className="hidden h-8 w-px bg-[#E5E8F5] sm:block" />
        <div className="flex items-center gap-2 text-[11px] text-[#5E626D]"><span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-b from-[#eef1fa] to-[#cfd6e9]" />New Leads</div>
        <div className="flex items-center gap-2 text-[11px] text-[#5E626D]"><span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-b from-[#5572ff] to-[#2746df]" />Qualified</div>
      </div>

      <div className="flex h-44 items-end justify-between gap-4 px-1 sm:gap-6">
        {data.map((item, idx) => {
          const isPeak = idx === peakIndex;
          const newLeadsPct = animateIn ? (item.newLeads / yAxisMax) * 100 : 0;
          const qualifiedPct = animateIn ? (item.qualified / yAxisMax) * 100 : 0;
          const rate = item.newLeads > 0 ? (item.qualified / item.newLeads) * 100 : 0;
          return (
            <div
              key={`${period}-${item.label}`}
              className="relative flex flex-1 flex-col items-center gap-2"
              tabIndex={0}
              role="img"
              aria-label={`${item.label}: ${item.newLeads} new leads, ${item.qualified} qualified, ${rate.toFixed(0)}% qualification rate`}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex((cur) => (cur === idx ? null : cur))}
              onFocus={() => setActiveIndex(idx)}
              onBlur={() => setActiveIndex((cur) => (cur === idx ? null : cur))}
            >
              {activeIndex === idx && (
                <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max -translate-x-1/2 rounded-xl border border-white/70 bg-white/90 p-2.5 text-left shadow-[0_12px_28px_rgba(20,25,40,0.16)] backdrop-blur-md">
                  <p className="text-[11px] font-semibold text-[#151515]">{item.label}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[10px] text-[#5E626D]"><span className="h-1.5 w-1.5 rounded-full bg-[#CFD6E9]" />New Leads <b className="text-[#151515]">{item.newLeads}</b></p>
                  <p className="flex items-center gap-1.5 text-[10px] text-[#5E626D]"><span className="h-1.5 w-1.5 rounded-full bg-[#3152F4]" />Qualified <b className="text-[#151515]">{item.qualified}</b></p>
                  <p className="mt-1 text-[10px] font-semibold text-[#0B7A57]">{rate.toFixed(0)}% qualification rate</p>
                </div>
              )}
              <span className={`text-[10px] font-semibold ${isPeak ? "text-[#3152F4]" : "text-[#8E929C]"}`}>
                {isPeak ? `${peakGrowthPct >= 0 ? "+" : ""}${peakGrowthPct.toFixed(1)}%` : item.qualified}
              </span>
              <div className="flex h-32 items-end gap-1">
                <div className="relative h-full w-5 overflow-hidden rounded-t-lg bg-[#F1F2F5] sm:w-6 lg:w-[30px]">
                  <div
                    className="motion-reduce:transition-none absolute bottom-0 w-full rounded-t-lg bg-gradient-to-b from-[#eef1fa] via-[#dfe4f3] to-[#cfd6e9] transition-[height] duration-[650ms] ease-out"
                    style={{ height: `${newLeadsPct}%` }}
                  >
                    <span className="absolute inset-x-0 top-0 h-1/3 rounded-t-lg bg-gradient-to-b from-white/60 to-transparent" />
                  </div>
                </div>
                <div className="relative h-full w-5 overflow-hidden rounded-t-lg bg-[#F1F2F5] sm:w-6 lg:w-[30px]">
                  <div
                    className={`motion-reduce:transition-none absolute bottom-0 w-full rounded-t-lg transition-[height] duration-[750ms] ease-out ${isPeak ? "bg-gradient-to-b from-[#5572ff] via-[#3657f5] to-[#2746df] shadow-[0_-2px_10px_rgba(49,82,244,0.35)]" : "bg-gradient-to-b from-[#aab4e8] via-[#8b98da] to-[#6d7cc9]"}`}
                    style={{ height: `${qualifiedPct}%`, transitionDelay: "80ms" }}
                  >
                    <span className="absolute inset-x-0 top-0 h-1/3 rounded-t-lg bg-gradient-to-b from-white/45 to-transparent" />
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-[#8E929C]">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type TemperatureKey = "hot" | "warm" | "cold";
interface TemperatureDatum {
  key: TemperatureKey;
  label: string;
  value: number;
}

// Fallback demonstration data — this static prototype has no backend/API to
// preserve (see README: "all data is hardcoded mock data").
const temperatureData: TemperatureDatum[] = [
  { key: "hot", label: "Hot", value: 74 },
  { key: "warm", label: "Warm", value: 198 },
  { key: "cold", label: "Cold", value: 156 },
];

const temperatureStyles: Record<TemperatureKey, { stops: [string, string, string]; glow: string; card: string; cardBorder: string; text: string }> = {
  hot: { stops: ["#ff6673", "#f43f4f", "#c81732"], glow: "#f43f4f", card: "rgba(244,63,79,0.14)", cardBorder: "rgba(244,63,79,0.20)", text: "#C81732" },
  warm: { stops: ["#ffc64a", "#f59e0b", "#d87505"], glow: "#f59e0b", card: "rgba(245,158,11,0.15)", cardBorder: "rgba(245,158,11,0.21)", text: "#A8590A" },
  cold: { stops: ["#68b8e8", "#397fae", "#245574"], glow: "#397baf", card: "rgba(57,127,174,0.16)", cardBorder: "rgba(57,127,174,0.21)", text: "#245574" },
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function LeadTemperatureCard() {
  const [activeKey, setActiveKey] = useState<TemperatureKey | null>(null);
  const [previewKey, setPreviewKey] = useState<TemperatureKey | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const reducedMotion = useReducedMotion();
  const uid = "ci-lead-temp";

  useEffect(() => {
    if (reducedMotion) {
      setAnimateIn(true);
      return;
    }
    const frame = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  const total = useMemo(() => temperatureData.reduce((sum, item) => sum + item.value, 0), []);
  const dataWithPercentages = useMemo(
    () => temperatureData.map((item) => ({ ...item, percentage: total > 0 ? (item.value / total) * 100 : 0 })),
    [total],
  );

  const displayKey = previewKey ?? activeKey;
  const toggle = (key: TemperatureKey) => setActiveKey((cur) => (cur === key ? null : key));
  const preview = (key: TemperatureKey | null) => setPreviewKey(key);

  const size = 176;
  const center = size / 2;
  const baseRadius = 58;
  const circumference = 2 * Math.PI * baseRadius;
  const gapPx = 2.5;

  let cumulative = 0;
  const arcs = dataWithPercentages.map((item) => {
    const rawDash = (item.percentage / 100) * circumference;
    const dash = Math.max(rawDash - gapPx, 0);
    const offset = -((cumulative / 100) * circumference) - gapPx / 2;
    cumulative += item.percentage;
    return { ...item, dash, offset };
  });

  const centerDatum = displayKey ? dataWithPercentages.find((d) => d.key === displayKey) ?? null : null;
  const transitionMs = reducedMotion ? 0 : 800;

  return (
    <div className="ci-glass-card rounded-[24px] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-[#151515]">Lead Temperature</h2>
        <button aria-label="More options" className="text-[#8E929C]"><DotsThree weight="bold" /></button>
      </div>

      <div className="grid grid-cols-1 items-center gap-4 min-[480px]:grid-cols-[minmax(0,1fr)_minmax(140px,0.8fr)] min-[480px]:gap-5">
      <div className="relative flex min-w-0 items-center justify-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="h-[152px] w-[152px] overflow-visible"
          role="group"
          aria-label={`Lead temperature breakdown: ${dataWithPercentages.map((d) => `${d.label} ${d.value}`).join(", ")}, total ${total}`}
        >
          <defs>
            {(Object.keys(temperatureStyles) as TemperatureKey[]).map((key) => (
              <linearGradient key={key} id={`${uid}-${key}-gradient`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={temperatureStyles[key].stops[0]} />
                <stop offset="40%" stopColor={temperatureStyles[key].stops[1]} />
                <stop offset="100%" stopColor={temperatureStyles[key].stops[2]} />
              </linearGradient>
            ))}
            <linearGradient id={`${uid}-glass-highlight`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.34} />
              <stop offset="30%" stopColor="#ffffff" stopOpacity={0.1} />
              <stop offset="65%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
            {(Object.keys(temperatureStyles) as TemperatureKey[]).map((key) => (
              <filter key={key} id={`${uid}-${key}-glow`} x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={temperatureStyles[key].glow} floodOpacity="0.38" />
              </filter>
            ))}
          </defs>
          <g transform={`rotate(-90 ${center} ${center})`}>
            {arcs.map((arc) => {
              const isActive = displayKey === arc.key;
              const isDimmed = displayKey !== null && !isActive;
              return (
                <g
                  key={arc.key}
                  tabIndex={0}
                  role="button"
                  aria-pressed={activeKey === arc.key}
                  aria-label={`${arc.label} leads: ${arc.value}, ${arc.percentage.toFixed(1)} percent`}
                  className="cursor-pointer outline-none transition-[opacity,filter] duration-200 motion-reduce:transition-none"
                  style={{ opacity: isDimmed ? 0.55 : 1, filter: isActive ? `url(#${uid}-${arc.key}-glow) brightness(1.08)` : undefined }}
                  onMouseEnter={() => preview(arc.key)}
                  onMouseLeave={() => setPreviewKey((cur) => (cur === arc.key ? null : cur))}
                  onFocus={() => preview(arc.key)}
                  onBlur={() => setPreviewKey((cur) => (cur === arc.key ? null : cur))}
                  onClick={() => toggle(arc.key)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(arc.key);
                    }
                  }}
                >
                  <circle
                    cx={center}
                    cy={center}
                    r={baseRadius}
                    fill="none"
                    stroke={`url(#${uid}-${arc.key}-gradient)`}
                    strokeWidth={isActive ? 26 : 20}
                    strokeDasharray={`${animateIn ? arc.dash : 0} ${circumference}`}
                    strokeDashoffset={arc.offset}
                    style={{ transition: `stroke-dasharray ${transitionMs}ms ease-out, stroke-width 200ms ease-out`, transitionDelay: reducedMotion ? "0ms" : "60ms" }}
                  />
                  <circle
                    cx={center}
                    cy={center}
                    r={baseRadius}
                    fill="none"
                    stroke={`url(#${uid}-glass-highlight)`}
                    strokeWidth={isActive ? 26 : 20}
                    strokeDasharray={`${animateIn ? arc.dash : 0} ${circumference}`}
                    strokeDashoffset={arc.offset}
                    style={{ transition: `stroke-dasharray ${transitionMs}ms ease-out, stroke-width 200ms ease-out`, transitionDelay: reducedMotion ? "0ms" : "60ms" }}
                  />
                </g>
              );
            })}
          </g>
        </svg>

        <div key={displayKey ?? "total"} className="ci-value-fade pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <strong className="block text-[22px] font-bold tracking-tight text-[#151515]">{centerDatum ? centerDatum.value : total}</strong>
            <span className="block text-[9px] font-bold uppercase tracking-wider text-[#8E929C]">{centerDatum ? `${centerDatum.label} Leads` : "Total"}</span>
            {centerDatum && <span className="mt-0.5 block text-[10px] font-semibold" style={{ color: temperatureStyles[centerDatum.key].text }}>{centerDatum.percentage.toFixed(1)}%</span>}
          </div>
        </div>

        {previewKey && (
          <div
            role="status"
            className="ci-glass-tooltip pointer-events-none absolute -top-2 left-1/2 z-20 w-max -translate-x-1/2 -translate-y-full rounded-xl p-2.5 text-left"
          >
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-white">
              <span className="h-2 w-2 rounded-full" style={{ background: temperatureStyles[previewKey].stops[1] }} />
              {dataWithPercentages.find((d) => d.key === previewKey)?.label}
            </p>
            <p className="mt-1 text-[10px] text-white/70">
              {dataWithPercentages.find((d) => d.key === previewKey)?.value} leads · {dataWithPercentages.find((d) => d.key === previewKey)?.percentage.toFixed(1)}%
            </p>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-2.5">
        {dataWithPercentages.map((item) => {
          const isActive = displayKey === item.key;
          const style = temperatureStyles[item.key];
          return (
            <button
              key={item.key}
              type="button"
              aria-pressed={activeKey === item.key}
              aria-label={`${item.label}: ${item.value} leads, ${item.percentage.toFixed(1)} percent. Select to highlight.`}
              onClick={() => toggle(item.key)}
              onMouseEnter={() => preview(item.key)}
              onMouseLeave={() => setPreviewKey((cur) => (cur === item.key ? null : cur))}
              onFocus={() => preview(item.key)}
              onBlur={() => setPreviewKey((cur) => (cur === item.key ? null : cur))}
              className="ci-temp-card flex min-h-[52px] w-full items-center justify-between gap-3 rounded-[13px] px-3 py-2 transition-transform duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{
                background: `linear-gradient(145deg, rgba(255,255,255,0.72), ${style.card})`,
                border: `1px solid ${isActive ? style.cardBorder.replace(/[\d.]+\)$/, "0.55)") : style.cardBorder}`,
                boxShadow: isActive
                  ? `inset 0 1px 0 rgba(255,255,255,0.82), 0 6px 16px rgba(40,50,90,0.06), 0 0 0 3px ${style.card}`
                  : "inset 0 1px 0 rgba(255,255,255,0.82), 0 6px 16px rgba(40,50,90,0.06)",
                transform: isActive ? "translateY(-1px)" : "none",
              }}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: style.stops[1] }} />
                <div className="min-w-0 text-left">
                  <div className="truncate text-[11px] font-semibold" style={{ color: style.text }}>{item.label}</div>
                  <div className="text-[10px] text-[#8E929C]">{item.percentage.toFixed(1)}%</div>
                </div>
              </div>
              <strong className="shrink-0 text-[15px] font-bold text-[#151515]">{item.value}</strong>
            </button>
          );
        })}
      </div>
      </div>
    </div>
  );
}

function Overview({ openLead, setSection, notify }: { openLead: (l: Lead) => void; setSection: (v: string) => void; notify: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <div className="mb-0.5 flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#5E626D]">Good morning, Maya</span>
            <span className="h-1 w-1 rounded-full bg-[#C4C5D9]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B7A57]">Autonomous triage active</span>
          </div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#151515]">Lead overview</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-xl bg-[#F1F3FF] px-3 py-1.5 shadow-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-[#0B7A57]" /><span className="text-[12px] font-semibold text-[#151515]">ailqs.com</span></div>
          <button className="flex items-center gap-2 rounded-xl bg-[#F1F3FF] px-3.5 py-1.5 text-[12px] font-medium text-[#151515] shadow-sm hover:bg-[#E5E8F5]"><CalendarBlank className="text-[16px] text-[#8E929C]" />Last 30 days<CaretDown className="text-[13px] text-[#8E929C]" /></button>
          <button onClick={() => notify("Report exported")} className="flex items-center gap-2 rounded-xl border border-[#EDEDF2] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#F8F8FA]"><DownloadSimple className="text-[16px] text-[#8E929C]" />Download Report</button>
          <button onClick={() => setSection("Inbox")} className="flex items-center gap-2 rounded-xl bg-[#3152F4] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(49,82,244,0.28)] transition-transform active:scale-[0.98]"><Sparkle className="text-[16px]" />View Live Conversations</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard variant="new-leads" label="New Leads" value="428" icon={Tray} delta="+12.4%" note="vs last period" />
        <KpiCard variant="qualified" label="Qualified Leads" value="267" icon={SealCheck} delta="+8.7%" note="vs last period" />
        <KpiCard variant="hot" label="Hot Leads" value="74" icon={Fire} delta="+16.2%" note="high intent" />
        <KpiCard variant="conversion" label="Conversion Rate" value="11.1%" icon={Percent} delta="+2.3%" note="avg benchmark 6.8%" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <QualificationChart />

        <div className="flex flex-col gap-5 lg:col-span-4">
          <LeadTemperatureCard />
          <div className="rounded-[24px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
            <div className="mb-2 flex items-center justify-between"><h2 className="text-[15px] font-semibold text-[#151515]">Avg Triage Speed</h2><div className="grid h-7 w-7 place-items-center rounded-lg bg-[#F1F3FF]"><Lightning className="text-[14px] text-[#3152F4]" /></div></div>
            <div className="flex items-end justify-between">
              <div><strong className="text-[26px] font-bold text-[#151515]">8m 24s</strong><p className="mt-1 text-[10px] text-[#8E929C]">30 days ago: 14m 10s</p></div>
              <Sparkline />
            </div>
            <span className="mt-2 inline-block rounded-full bg-[#E8F8F3] px-2 py-0.5 text-[10px] font-semibold text-[#0B7A57]">41% faster response</span>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-[17px] font-semibold text-[#151515]">Lead Acquisition Channels</h2><p className="mt-0.5 text-[12px] text-[#8E929C]">Attribution mapped across 428 monthly inbound triggers</p></div><button onClick={() => notify("Source diagnostics opened")} className="text-[12px] font-semibold text-[#3152F4]">View Source Diagnostics →</button></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Organic Search", 43, "184 leads", "+14.2%"],
            ["Paid Campaign", 33, "142 leads", "+6.1%"],
            ["Referral", 16, "68 leads", "+1.8%"],
            ["Direct & Widget", 8, "34 leads", "+22.4%"],
          ].map(([name, pct, count, delta]) => (
            <div key={String(name)}>
              <div className="mb-2 flex items-center justify-between text-[12px]"><span className="font-semibold text-[#151515]">{name}</span><span className="font-semibold text-[#5E626D]">{pct}%</span></div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F2F5]"><div className="h-full rounded-full bg-[#3152F4]" style={{ width: `${pct}%` }} /></div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-[#8E929C]"><span>{count}</span><span className="font-semibold text-[#0B7A57]">{delta}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_10px_30px_rgba(20,25,40,0.05)] lg:col-span-8">
          <div className="flex items-center justify-between border-b border-[#EDEDF2] p-5"><div><h2 className="text-[15px] font-semibold text-[#151515]">Recent Hot Leads</h2><p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#8E929C]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />Live stream</p></div><button onClick={() => setSection("Leads")} className="text-[12px] font-semibold text-[#3152F4]">View all leads →</button></div>
          <LeadTable rows={leads.slice(0, 4)} onSelect={openLead} />
        </div>
        <div className="flex flex-col gap-5 lg:col-span-4">
          <div className="rounded-[24px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-[15px] font-semibold text-[#151515]">Leads Needing Action</h2><span className="grid h-5 w-5 place-items-center rounded-full bg-[#F04452] text-[10px] font-bold text-white">2</span></div>
            <div className="flex flex-col gap-2">
              <button onClick={() => openLead(leads[0])} className="w-full rounded-xl border border-[#F3D6D9] bg-[#FDF2F3] p-3 text-left"><div className="flex items-center justify-between"><b className="text-[12px] text-[#151515]">Olivia Martin</b><span className="rounded-full bg-[#F04452] px-2 py-0.5 text-[10px] font-semibold text-white">Call now</span></div><p className="mt-0.5 text-[10px] text-[#5E626D]">Acme Corp</p><p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#F04452]"><Warning weight="fill" className="text-[11px]" />Follow-up overdue by 2h</p></button>
              <button onClick={() => openLead(leads[4])} className="w-full rounded-xl border border-[#EDEDF2] bg-[#F8F8FA] p-3 text-left"><div className="flex items-center justify-between"><b className="text-[12px] text-[#151515]">David Vance</b><span className="rounded-full bg-[#151515] px-2 py-0.5 text-[10px] font-semibold text-white">Join</span></div><p className="mt-0.5 text-[10px] text-[#5E626D]">Vance Logistics</p><p className="mt-1 flex items-center gap-1 text-[10px] text-[#8E929C]"><Clock className="text-[11px]" />Demo scheduled in 45m</p></button>
            </div>
          </div>
          <div className="rounded-[24px] bg-gradient-to-br from-[#EEF1FF] to-[#E4E9FF] p-5">
            <div className="mb-3 flex items-center gap-2"><div className="grid h-7 w-7 place-items-center rounded-lg bg-[#3152F4] text-white"><Robot weight="fill" className="text-[14px]" /></div><h2 className="text-[13px] font-semibold text-[#151515]">AI Insights</h2></div>
            <ul className="flex flex-col gap-2.5 text-[11px] leading-relaxed text-[#444656]">
              <li>🔥 High visitor intent detected around AI Automation integrations (48% of all queries).</li>
              <li>⚡ Pricing transparency remains the #1 objection raised prior to qualification handoff.</li>
            </ul>
            <div className="mt-3 rounded-xl bg-white/70 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-[#3152F4]">Recommended optimization</p><p className="mt-1 text-[11px] text-[#444656]">Enable instant calendar booking for leads scoring above 85 to lift conversion by ~14%.</p></div>
            <button onClick={() => notify("Automation rule applied")} className="mt-3 w-full rounded-xl bg-[#3152F4] py-2 text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(49,82,244,0.28)]">Apply Automation Rule</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadTable({ rows, onSelect, selectable, selectedIds, toggle }: { rows: Lead[]; onSelect: (l: Lead) => void; selectable?: boolean; selectedIds?: number[]; toggle?: (id: number) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#EDEDF2] text-[10px] font-bold uppercase tracking-wider text-[#8E929C]">
            {selectable && <th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all" className="accent-[#3152F4]" /></th>}
            <th className="px-4 py-3">Lead &amp; Company</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Temperature</th>
            <th className="px-4 py-3">Service Interest</th>
            <th className="px-4 py-3">Pipeline Stage</th>
            <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((lead) => (
            <tr key={lead.id} onClick={() => onSelect(lead)} className="cursor-pointer border-b border-[#F1F2F5] text-[12px] text-[#444656] transition-colors last:border-0 hover:bg-[#F8F9FF]">
              {selectable && <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedIds?.includes(lead.id)} onChange={() => toggle?.(lead.id)} aria-label={`Select ${lead.name}`} className="accent-[#3152F4]" /></td>}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold text-[#151515]" style={{ background: lead.color }}>{lead.initials}</span>
                  <div><b className="block text-[#151515]">{lead.name}</b><small className="mt-0.5 block text-[10px] text-[#8E929C]">{lead.company}</small></div>
                </div>
              </td>
              <td className="px-4 py-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#E8F8F3] text-[11px] font-bold text-[#0B7A57]">{lead.score}</span></td>
              <td className="px-4 py-3"><TempPill temp={lead.temp} /></td>
              <td className="px-4 py-3"><span className="rounded-full bg-[#F1F2F5] px-2.5 py-1 text-[11px] font-medium text-[#444656]">{lead.interest}</span></td>
              <td className="px-4 py-3"><StageChip stage={lead.stage} /></td>
              <td className="px-4 py-3"><button onClick={(e) => e.stopPropagation()} aria-label={`Actions for ${lead.name}`} className="grid h-8 w-8 place-items-center rounded-lg text-[#8E929C] hover:bg-[#F1F2F5]"><DotsThree weight="bold" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeadsPage({ openLead, notify, query, setQuery }: { openLead: (l: Lead) => void; notify: (v: string) => void; query: string; setQuery: (v: string) => void }) {
  const [filter, setFilter] = useState<"All" | Temp>("All");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const filtered = useMemo(() => leads.filter((l) => (filter === "All" || l.temp === filter) && `${l.name} ${l.company} ${l.interest}`.toLowerCase().includes(query.toLowerCase())), [filter, query]);
  const toggle = (id: number) => setSelectedIds((cur) => (cur.includes(id) ? cur.filter((v) => v !== id) : [...cur, id]));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-baseline gap-2.5"><h1 className="text-[26px] font-bold tracking-tight text-[#151515]">Leads</h1><span className="text-[12px] text-[#8E929C]">1,248 total leads</span></div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 rounded-xl border border-[#EDEDF2] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#151515] shadow-sm">All Active Leads<CaretDown className="text-[13px] text-[#8E929C]" /></button>
          <button onClick={() => notify("CSV export is preparing")} className="flex items-center gap-2 rounded-xl border border-[#EDEDF2] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#151515] shadow-sm"><DownloadSimple className="text-[15px] text-[#8E929C]" />Export CSV</button>
          <button onClick={() => notify("Add lead form opened")} className="flex items-center gap-2 rounded-xl bg-[#3152F4] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(49,82,244,0.28)]"><Plus className="text-[15px]" />Add Lead</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="New Inbound" value="42" icon={Tray} note="Assigned to auto-triage" chip="+8 today" />
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#242428] via-[#1a1a1f] to-[#121215] p-5 text-white shadow-[0_16px_36px_rgba(15,15,20,0.22)]">
          <div className="flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">High Intent / Hot</span><div className="grid h-8 w-8 place-items-center rounded-xl bg-[#F04452]/20"><Fire className="text-[16px] text-[#F04452]" /></div></div>
          <div className="my-2 flex items-center gap-3"><strong className="text-[30px] font-bold">18</strong><span className="rounded-full bg-[#F04452] px-2 py-0.5 text-[10px] font-semibold">Action req.</span></div>
          <p className="text-[10px] text-white/60">Ready for fast sales handoff</p>
        </div>
        <StatTile label="Unassigned" value="9" icon={Users} note="Requires owner distribution" chip="Routing pending" chipTone="bg-[#F1F2F5] text-[#5E626D]" />
        <StatTile label="Follow-ups Due" value="14" icon={Clock} note="SLA commitment window" chip="4 Overdue" chipTone="bg-[#FDF2F3] text-[#F04452]" />
      </div>

      <div className="flex flex-col gap-3 rounded-[20px] bg-white p-4 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1"><MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[#8E929C]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by lead, company, email or phone" className="h-10 w-full rounded-xl bg-[#F8F8FA] pl-9 pr-3 text-[12px] outline-none placeholder:text-[#8E929C] focus:bg-white focus:ring-2 focus:ring-[#3152F4]/25" /></label>
          <div className="flex items-center gap-1 rounded-full bg-[#F1F2F5] p-1">
            {(["All", "Hot", "Warm", "Cold"] as const).map((t) => (
              <button key={t} aria-pressed={filter === t} onClick={() => setFilter(t)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${filter === t ? "bg-[#3152F4] text-white shadow-[0_2px_8px_rgba(49,82,244,0.3)]" : "text-[#5E626D]"}`}>
                {t}<span className={`rounded-full px-1.5 text-[9px] ${filter === t ? "bg-white/25" : "bg-white"}`}>{t === "All" ? leads.length : leads.filter((l) => l.temp === t).length}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#8E929C]"><span><b className="text-[#151515]">{filtered.length}</b> leads in this view</span><span>Showing 1 to {filtered.length} of 1,248 leads</span></div>
        {filtered.length ? <LeadTable rows={filtered} onSelect={openLead} selectable selectedIds={selectedIds} toggle={toggle} /> : (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center"><MagnifyingGlass className="rounded-xl bg-[#F1F3FF] p-3 text-[40px] text-[#3152F4]" /><h2 className="text-[14px] font-semibold text-[#151515]">No leads found</h2><p className="text-[11px] text-[#8E929C]">Try a different search or clear the active filters.</p></div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full bg-[#151515] px-5 py-3 text-white shadow-[0_20px_44px_rgba(0,0,0,0.35)]">
          <span className="rounded-full bg-[#3152F4] px-2.5 py-1 text-[11px] font-semibold">{selectedIds.length} Lead{selectedIds.length > 1 ? "s" : ""} Selected</span>
          <button onClick={() => notify("Leads assigned to rep")} className="text-[12px] font-semibold">Assign to Rep</button>
          <button onClick={() => notify("Status updated")} className="text-[12px] font-semibold">Change Status</button>
          <button onClick={() => notify("Leads exported")} className="text-[12px] font-semibold">Export</button>
          <button aria-label="Clear selection" onClick={() => setSelectedIds([])} className="text-white/60"><X className="text-[14px]" /></button>
        </div>
      )}
    </div>
  );
}

type FollowUpType = "call" | "email" | "whatsapp" | "meeting";
type FollowUpPriority = "High" | "Medium" | "Normal";
type FollowUpGroup = "Today" | "Tomorrow" | "Later";

interface FollowUpTask {
  id: number;
  type: FollowUpType;
  title: string;
  company: string;
  temp?: "Hot" | "Warm";
  score?: number;
  description: string;
  group: FollowUpGroup;
  day: number;
  time: string;
  overdueLabel?: string;
  ownerName: string;
  ownerInitials: string;
  priority: FollowUpPriority;
  completed: boolean;
}

let followUpIdCounter = 100;

const followUpTypeMeta: Record<FollowUpType, { icon: typeof Phone; label: string; actionLabel: string; actionIcon: typeof Phone; tileClass: string }> = {
  call: { icon: Phone, label: "Call", actionLabel: "Call Now", actionIcon: Phone, tileClass: "bg-[#F1F3FF] text-[#3152F4]" },
  email: { icon: Envelope, label: "Email", actionLabel: "Draft Email", actionIcon: NotePencil, tileClass: "bg-[#F1F2F5] text-[#5E626D]" },
  whatsapp: { icon: WhatsappLogo, label: "WhatsApp", actionLabel: "Send Message", actionIcon: PaperPlaneRight, tileClass: "bg-[#E8F8F3] text-[#0B7A57]" },
  meeting: { icon: VideoCamera, label: "Meeting", actionLabel: "Join Meeting", actionIcon: VideoCamera, tileClass: "bg-[#F1F3FF] text-[#3152F4]" },
};

const followUpOwners = ["Maya Singh", "Arjun Mehta", "Riya Sen"];

const initialFollowUps: FollowUpTask[] = [
  { id: 1, type: "call", title: "Call with Olivia Martin", company: "Acme Corp", temp: "Hot", score: 86, description: "Discuss AI automation intake volume & deployment roadmap", group: "Today", day: 24, time: "10:30 AM IST", overdueLabel: "2h Overdue", ownerName: "Maya Singh", ownerInitials: "MS", priority: "High", completed: false },
  { id: 2, type: "meeting", title: "Meeting with Ethan Brooks", company: "Zenith Cloud", temp: "Hot", score: 92, description: "Platform demo & security architecture review", group: "Today", day: 24, time: "2:00 PM IST", ownerName: "Arjun Mehta", ownerInitials: "AM", priority: "High", completed: false },
  { id: 3, type: "whatsapp", title: "WhatsApp follow-up with Liam Wilson", company: "HyperGrowth", temp: "Hot", score: 79, description: "Send revised proposal for AI bot custom integration", group: "Today", day: 24, time: "4:15 PM IST", ownerName: "Maya Singh", ownerInitials: "MS", priority: "Medium", completed: false },
  { id: 4, type: "email", title: "Email follow-up with David Vance", company: "Vance Logistics", temp: "Warm", score: 64, description: "Share custom ERP integration case studies", group: "Today", day: 24, time: "5:30 PM IST", ownerName: "Riya Sen", ownerInitials: "RS", priority: "Normal", completed: false },
  { id: 5, type: "call", title: "Call with Sophia Chen", company: "FinScale AI", temp: "Hot", score: 88, description: "Follow up on enterprise procurement approval status", group: "Tomorrow", day: 25, time: "11:00 AM IST", ownerName: "Arjun Mehta", ownerInitials: "AM", priority: "Medium", completed: false },
  { id: 6, type: "email", title: "Email follow-up with Priya Sharma", company: "Apex Retail", temp: "Warm", score: 59, description: "Send e-commerce lead capture benchmark report", group: "Tomorrow", day: 25, time: "3:00 PM IST", ownerName: "Maya Singh", ownerInitials: "MS", priority: "Normal", completed: false },
  { id: 7, type: "meeting", title: "Meeting with Aarav Patel", company: "Pulse Media", description: "Contract negotiation & SLA sign-off", group: "Later", day: 28, time: "Oct 28, 2:30 PM", ownerName: "Maya Singh", ownerInitials: "MS", priority: "Normal", completed: false },
];

function buildOctoberGrid(): (number | null)[][] {
  const firstWeekday = new Date(2024, 9, 1).getDay();
  const cells: (number | null)[] = Array(firstWeekday).fill(null);
  for (let d = 1; d <= 31; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function FollowUpCard({
  task, compact, expanded, onToggleExpand, menuOpen, onToggleMenu, onMarkComplete, onPrimaryAction, onSnooze, onDelete,
}: {
  task: FollowUpTask;
  compact: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onMarkComplete: () => void;
  onPrimaryAction: () => void;
  onSnooze: () => void;
  onDelete: () => void;
}) {
  const meta = followUpTypeMeta[task.type];
  const overdue = Boolean(task.overdueLabel);
  const tempTone = task.temp === "Hot" ? "bg-[#FDF2F3] text-[#F04452]" : task.temp === "Warm" ? "bg-[#FEF8EC] text-[#A8590A]" : "";
  const priorityTone =
    task.priority === "High" ? "bg-[#FDF2F3] text-[#F04452]" :
    task.priority === "Medium" ? "bg-[#F1F3FF] text-[#3152F4]" :
    "bg-[#F1F2F5] text-[#5E626D]";

  if (compact && !expanded) {
    return (
      <button
        type="button"
        onClick={onToggleExpand}
        className={`flex items-center justify-between gap-4 rounded-[20px] bg-white p-4 text-left shadow-[0_4px_16px_rgba(20,25,40,0.03)] transition-all hover:shadow-[0_8px_24px_rgba(20,25,40,0.05)] ${overdue ? "ring-1 ring-[#F04452]/30" : ""}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${meta.tileClass}`}><meta.icon className="text-[18px]" /></div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-[14px] font-semibold text-[#151515]">{task.title}</span>
              <span className="truncate text-[11px] text-[#8E929C]">{task.company}</span>
              {task.temp && <span className={`hidden shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline-flex ${tempTone}`}>{task.temp} • {task.score}</span>}
            </div>
            <p className="truncate text-[11px] text-[#8E929C]">{task.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden flex-col text-right sm:flex"><span className="text-[12px] font-semibold text-[#151515]">{task.time}</span><span className="text-[11px] text-[#8E929C]">{task.ownerName}</span></div>
          <CaretRight className="text-[16px] text-[#8E929C]" />
        </div>
      </button>
    );
  }

  return (
    <div className={`flex flex-col gap-3.5 rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(20,25,40,0.04)] transition-all hover:shadow-[0_8px_24px_rgba(20,25,40,0.06)] ${overdue ? "bg-gradient-to-r from-[#FDF2F3] via-white to-white" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${overdue ? "bg-[#FDF2F3] text-[#F04452]" : meta.tileClass}`}><meta.icon className="text-[18px]" /></div>
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[15px] font-semibold text-[#151515]">{task.title}</span>
              <span className="text-[12px] text-[#8E929C]">{task.company}</span>
              {task.temp && <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${tempTone}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{task.temp} • {task.score}</span>}
            </div>
            <p className="mt-1 text-[12px] text-[#8E929C]">{task.description}</p>
          </div>
        </div>
        <div className="relative flex shrink-0 items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${overdue ? "bg-[#F04452] text-white shadow-sm" : "bg-[#F1F2F5] text-[#151515]"}`}>
            <Clock className="text-[13px]" />{task.time}{overdue ? ` (${task.overdueLabel})` : ""}
          </span>
          <button type="button" onClick={onToggleMenu} aria-label="More options" className="rounded-lg p-1 text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515]"><DotsThree weight="bold" className="text-[18px]" /></button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 w-40 overflow-hidden rounded-xl bg-white p-1 shadow-[0_12px_28px_rgba(20,25,40,0.16)]">
              <button type="button" onClick={onSnooze} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] text-[#151515] hover:bg-[#F1F2F5]"><Clock className="text-[14px]" />Snooze to tomorrow</button>
              <button type="button" onClick={onDelete} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] text-[#F04452] hover:bg-[#FDF2F3]"><Trash className="text-[14px]" />Delete</button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F1F2F5] pt-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#DEE0FF] text-[10px] font-bold text-[#151B6B]">{task.ownerInitials}</span><span className="text-[11px] font-medium text-[#151515]">{task.ownerName}</span></div>
          <span className="text-[#C4C5D9]">•</span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${priorityTone}`}>{task.priority} Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onMarkComplete} className="inline-flex items-center gap-1 rounded-lg bg-[#F1F2F5] px-3 py-1 text-[11px] font-semibold text-[#151515] hover:bg-[#E5E8F5]"><CheckCircle className="text-[14px] text-[#0B7A57]" />Mark Complete</button>
          <button type="button" onClick={onPrimaryAction} className="inline-flex items-center gap-1.5 rounded-lg bg-[#3152F4] px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:opacity-90"><meta.actionIcon className="text-[14px]" />{meta.actionLabel}</button>
          {compact && <button type="button" onClick={onToggleExpand} className="rounded-lg px-2 py-1 text-[11px] font-semibold text-[#8E929C] hover:text-[#151515]">Collapse</button>}
        </div>
      </div>
    </div>
  );
}

function FollowUpsPage({ notify }: { notify: (v: string) => void }) {
  const [tasks, setTasks] = useState<FollowUpTask[]>(initialFollowUps);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filterTab, setFilterTab] = useState<"today" | "upcoming" | "overdue" | "completed">("today");
  const [repFilter, setRepFilter] = useState("All Reps");
  const [typeFilter, setTypeFilter] = useState<"All Types" | FollowUpType>("All Types");
  const [priorityFilter, setPriorityFilter] = useState<"All Priorities" | FollowUpPriority>("All Priorities");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const [formLeadName, setFormLeadName] = useState("Olivia Martin");
  const [formLeadCompany, setFormLeadCompany] = useState("Acme Corp");
  const [formType, setFormType] = useState<FollowUpType>("call");
  const [formDueDate, setFormDueDate] = useState("Today, Oct 24, 2024");
  const [formTime, setFormTime] = useState("10:30 AM IST");
  const [formOwner, setFormOwner] = useState("Maya Singh");
  const [formPriority, setFormPriority] = useState<FollowUpPriority>("High");
  const [formReminders, setFormReminders] = useState({ slack: true, email: true, whatsapp: false });
  const [formNotes, setFormNotes] = useState("Discuss AI automation intake volume & deployment roadmap");

  const activeTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const counts = useMemo(
    () => ({
      today: activeTasks.filter((t) => t.group === "Today").length,
      upcoming: activeTasks.filter((t) => t.group !== "Today").length,
      overdue: activeTasks.filter((t) => t.overdueLabel).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [activeTasks, tasks],
  );

  const filtered = useMemo(() => {
    let list: FollowUpTask[];
    if (view === "calendar" && selectedDay !== null) {
      // A picked calendar day searches across every task for that date, not just
      // the active tab's group — otherwise picking a day outside the current
      // tab's date range (e.g. "Today" tab + a future day) silently shows nothing.
      list = (filterTab === "completed" ? tasks.filter((t) => t.completed) : activeTasks).filter((t) => t.day === selectedDay);
    } else {
      list =
        filterTab === "completed" ? tasks.filter((t) => t.completed) :
        filterTab === "overdue" ? activeTasks.filter((t) => t.overdueLabel) :
        filterTab === "today" ? activeTasks.filter((t) => t.group === "Today") :
        activeTasks.filter((t) => t.group !== "Today");
    }
    if (repFilter !== "All Reps") list = list.filter((t) => t.ownerName === repFilter);
    if (typeFilter !== "All Types") list = list.filter((t) => t.type === typeFilter);
    if (priorityFilter !== "All Priorities") list = list.filter((t) => t.priority === priorityFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((t) => `${t.title} ${t.company} ${t.description}`.toLowerCase().includes(q));
    }
    return list;
  }, [tasks, activeTasks, filterTab, repFilter, typeFilter, priorityFilter, search, view, selectedDay]);

  const grouped = useMemo(() => {
    const groups: Record<FollowUpGroup, FollowUpTask[]> = { Today: [], Tomorrow: [], Later: [] };
    filtered.forEach((t) => groups[t.group].push(t));
    return groups;
  }, [filtered]);

  const tasksByDay = useMemo(() => {
    const map = new Map<number, number>();
    activeTasks.forEach((t) => map.set(t.day, (map.get(t.day) ?? 0) + 1));
    return map;
  }, [activeTasks]);

  function markComplete(id: number) {
    setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, completed: true } : t)));
    notify("Marked as complete");
    setMenuOpenId(null);
  }

  function snooze(id: number) {
    setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, overdueLabel: undefined, time: "Tomorrow, 9:00 AM IST", group: "Tomorrow" as FollowUpGroup, day: t.day + 1 } : t)));
    notify("Follow-up snoozed to tomorrow");
    setMenuOpenId(null);
  }

  function removeTask(id: number) {
    setTasks((cur) => cur.filter((t) => t.id !== id));
    notify("Follow-up deleted");
    setMenuOpenId(null);
  }

  function runPrimaryAction(task: FollowUpTask) {
    notify(`${followUpTypeMeta[task.type].actionLabel}: ${task.title}`);
  }

  function createTask() {
    if (!formLeadName.trim()) {
      notify("Add a lead name before creating a task");
      return;
    }
    const newTask: FollowUpTask = {
      id: followUpIdCounter++,
      type: formType,
      title: `${followUpTypeMeta[formType].label} with ${formLeadName.trim()}`,
      company: formLeadCompany.trim() || "—",
      description: formNotes.trim() || "New scheduled touchpoint",
      group: "Today",
      day: 24,
      time: formTime,
      ownerName: formOwner,
      ownerInitials: formOwner.split(" ").map((p) => p[0]).join("").toUpperCase(),
      priority: formPriority,
      completed: false,
    };
    setTasks((cur) => [newTask, ...cur]);
    notify("Follow-up created");
    setFormNotes("");
    setFilterTab("today");
    setView("list");
  }

  function resetForm() {
    setFormLeadName("");
    setFormLeadCompany("");
    setFormType("call");
    setFormPriority("Medium");
    setFormNotes("");
  }

  const completionRate = Math.min(82 + counts.completed, 100);
  const monthGrid = useMemo(() => buildOctoberGrid(), []);
  const groupOrder: { key: FollowUpGroup; label: string; date: string }[] = [
    { key: "Today", label: "Today", date: "Oct 24, 2024" },
    { key: "Tomorrow", label: "Tomorrow", date: "Oct 25, 2024" },
    { key: "Later", label: "Later This Week", date: "Oct 28 & beyond" },
  ];

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[24px] font-bold tracking-tight text-[#151515]">Follow-ups</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F2F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#5E626D]"><span className="h-1.5 w-1.5 rounded-full bg-[#3152F4]" />Autonomous SLA Triage</span>
          </div>
          <p className="text-[13px] text-[#8E929C]">Manage scheduled touchpoints, inbound outreach, and commitments for <b className="text-[#151515]">AILQS</b>.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full bg-[#F1F2F5] p-1">
            <button type="button" onClick={() => setView("list")} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all ${view === "list" ? "bg-[#3152F4] text-white shadow-[0_2px_8px_rgba(49,82,244,0.28)]" : "text-[#5E626D] hover:text-[#151515]"}`}><ListBullets className="text-[15px]" />List View</button>
            <button type="button" onClick={() => setView("calendar")} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all ${view === "calendar" ? "bg-[#3152F4] text-white shadow-[0_2px_8px_rgba(49,82,244,0.28)]" : "text-[#5E626D] hover:text-[#151515]"}`}><CalendarBlank className="text-[15px]" />Calendar</button>
          </div>
          <label className="relative hidden sm:block">
            <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[#8E929C]" />
            <input name="followUpSearch" aria-label="Filter touchpoints" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter touchpoints..." className="h-9 w-48 rounded-xl bg-[#F1F2F5] pl-9 pr-3 text-[12px] outline-none placeholder:text-[#8E929C] focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20 lg:w-56" />
          </label>
          <button type="button" onClick={() => setDrawerOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3152F4] to-[#2846E8] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(49,82,244,0.28)] transition-all hover:opacity-95 active:scale-[0.98]"><Plus className="text-[18px]" />Create Follow-up</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col justify-between gap-3 rounded-[20px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><CalendarCheck className="text-[20px]" /></div>
            <span className="rounded-full bg-[#DEE0FF] px-2 py-0.5 text-[11px] font-semibold text-[#151B6B]">Active Today</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2"><span className="text-[30px] font-extrabold tracking-tight text-[#151515]">{counts.today}</span><span className="text-[13px] font-medium text-[#8E929C]">scheduled tasks</span></div>
            <div className="mt-2 flex items-center justify-between border-t border-[#F1F2F5] pt-2">
              <span className="text-[11px] text-[#8E929C]">{counts.completed} completed so far</span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#E5E8F5]"><div className="h-full rounded-full bg-[#3152F4]" style={{ width: `${Math.min((counts.completed / 12) * 100, 100)}%` }} /></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 rounded-[20px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FDF2F3] text-[#F04452]"><Warning weight="fill" className="text-[20px]" /></div>
            <span className="inline-flex animate-pulse items-center gap-1 rounded-full bg-[#FDF2F3] px-2.5 py-0.5 text-[11px] font-semibold text-[#F04452]"><Fire weight="fill" className="text-[13px]" />SLA Breach</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2"><span className="text-[30px] font-extrabold tracking-tight text-[#F04452]">{counts.overdue}</span><span className="text-[13px] font-medium text-[#F04452]">overdue items</span></div>
            <div className="mt-2 flex items-center justify-between border-t border-[#FDF2F3] pt-2">
              <span className="text-[11px] text-[#8E929C]">Immediate action required</span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#F04452]"><Clock className="text-[13px]" />&gt;2h delay</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 rounded-[20px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#E8F8F3] text-[#0B7A57]"><CheckCircle weight="fill" className="text-[20px]" /></div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F8F3] px-2.5 py-0.5 text-[11px] font-bold text-[#0B7A57]"><TrendUp className="text-[13px]" />+4.1% vs last week</span>
          </div>
          <div className="flex items-center justify-between">
            <div><span className="text-[30px] font-extrabold tracking-tight text-[#151515]">{completionRate}%</span><p className="text-[11px] text-[#8E929C]">SLA completion target met</p></div>
            <div className="relative h-12 w-12 shrink-0">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E8F5" strokeWidth="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0B7A57" strokeWidth="3.5" strokeDasharray={`${completionRate}, 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 grid place-items-center text-[11px] font-bold text-[#151515]">{completionRate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {([
            ["today", "Today", counts.today],
            ["upcoming", "Upcoming", counts.upcoming],
            ["overdue", "Overdue", counts.overdue],
            ["completed", "Completed", counts.completed],
          ] as const).map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilterTab(key)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                filterTab === key
                  ? key === "overdue" ? "bg-[#F04452] text-white shadow-[0_2px_8px_rgba(240,68,82,0.3)]" : "bg-[#3152F4] text-white shadow-[0_2px_8px_rgba(49,82,244,0.25)]"
                  : key === "overdue" ? "bg-[#FDF2F3] text-[#F04452] hover:bg-[#FBE2E4]" : "bg-[#F1F2F5] text-[#5E626D] hover:text-[#151515]"
              }`}
            >
              <span>{label}</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filterTab === key ? "bg-white/25" : "bg-white text-[#5E626D]"}`}>{count}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-1.5 rounded-xl bg-[#F1F2F5] px-3 py-1.5 text-[12px] font-semibold text-[#151515]">
            <UserCircle className="text-[15px] text-[#8E929C]" />
            <select name="followUpRepFilter" aria-label="Filter by rep" value={repFilter} onChange={(e) => setRepFilter(e.target.value)} className="bg-transparent outline-none">
              <option>All Reps</option>
              {followUpOwners.map((owner) => <option key={owner}>{owner}</option>)}
            </select>
          </label>
          <label className="inline-flex items-center gap-1.5 rounded-xl bg-[#F1F2F5] px-3 py-1.5 text-[12px] font-semibold text-[#151515]">
            <Funnel className="text-[15px] text-[#8E929C]" />
            <select name="followUpTypeFilter" aria-label="Filter by task type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)} className="bg-transparent outline-none">
              <option>All Types</option>
              {(Object.keys(followUpTypeMeta) as FollowUpType[]).map((t) => <option key={t} value={t}>{followUpTypeMeta[t].label}</option>)}
            </select>
          </label>
          <label className="inline-flex items-center gap-1.5 rounded-xl bg-[#F1F2F5] px-3 py-1.5 text-[12px] font-semibold text-[#151515]">
            <Flag className="text-[15px] text-[#8E929C]" />
            <select name="followUpPriorityFilter" aria-label="Filter by priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)} className="bg-transparent outline-none">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Normal</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          {view === "calendar" && (
            <div className="flex flex-col gap-3 rounded-[20px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[#151515]">October 2024</h2>
                {selectedDay !== null && <button type="button" onClick={() => setSelectedDay(null)} className="text-[11px] font-semibold text-[#3152F4] hover:underline">Clear selection</button>}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[#8E929C]">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <span key={d}>{d}</span>)}
              </div>
              <div className="flex flex-col gap-1">
                {monthGrid.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 gap-1">
                    {week.map((day, di) => {
                      const count = day ? tasksByDay.get(day) ?? 0 : 0;
                      const isToday = day === 24;
                      const isSelected = day !== null && selectedDay === day;
                      return (
                        <button
                          key={di}
                          type="button"
                          disabled={!day}
                          onClick={() => day && setSelectedDay((cur) => (cur === day ? null : day))}
                          className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] transition-colors ${
                            !day ? "invisible" :
                            isSelected ? "bg-[#3152F4] text-white" :
                            isToday ? "bg-[#F1F3FF] font-bold text-[#3152F4] ring-1 ring-[#3152F4]/40" :
                            "text-[#151515] hover:bg-[#F1F2F5]"
                          }`}
                        >
                          <span>{day}</span>
                          {count > 0 && <span className={`h-1 w-1 rounded-full ${isSelected ? "bg-white" : "bg-[#3152F4]"}`} />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#8E929C]">{selectedDay ? `Showing touchpoints for Oct ${selectedDay}` : "Select a day to filter touchpoints below"}</p>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-[20px] bg-white p-12 text-center shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
              <CheckCircle weight="duotone" className="text-[40px] text-[#3152F4]" />
              <h2 className="text-[14px] font-semibold text-[#151515]">No touchpoints match these filters</h2>
              <p className="text-[12px] text-[#8E929C]">Try a different tab, clear filters, or create a new follow-up.</p>
            </div>
          ) : filterTab === "overdue" || filterTab === "completed" ? (
            <div className="flex flex-col gap-3">
              {filtered.map((task) => (
                <FollowUpCard
                  key={task.id}
                  task={task}
                  compact={false}
                  expanded
                  onToggleExpand={() => {}}
                  menuOpen={menuOpenId === task.id}
                  onToggleMenu={() => setMenuOpenId((cur) => (cur === task.id ? null : task.id))}
                  onMarkComplete={() => markComplete(task.id)}
                  onPrimaryAction={() => runPrimaryAction(task)}
                  onSnooze={() => snooze(task.id)}
                  onDelete={() => removeTask(task.id)}
                />
              ))}
            </div>
          ) : (
            groupOrder.map(({ key, label, date }) => {
              const groupTasks = grouped[key];
              if (groupTasks.length === 0) return null;
              return (
                <div key={key} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-bold text-[#151515]">{label}</span>
                      <span className="text-[12px] text-[#8E929C]">— {date}</span>
                      {key === "Today" && <span className="h-2 w-2 rounded-full bg-[#3152F4]" />}
                    </div>
                    <span className="text-[11px] text-[#8E929C]">{groupTasks.length} task{groupTasks.length === 1 ? "" : "s"} scheduled</span>
                  </div>
                  {groupTasks.map((task) => (
                    <FollowUpCard
                      key={task.id}
                      task={task}
                      compact={key !== "Today"}
                      expanded={expandedId === task.id}
                      onToggleExpand={() => setExpandedId((cur) => (cur === task.id ? null : task.id))}
                      menuOpen={menuOpenId === task.id}
                      onToggleMenu={() => setMenuOpenId((cur) => (cur === task.id ? null : task.id))}
                      onMarkComplete={() => markComplete(task.id)}
                      onPrimaryAction={() => runPrimaryAction(task)}
                      onSnooze={() => snooze(task.id)}
                      onDelete={() => removeTask(task.id)}
                    />
                  ))}
                </div>
              );
            })
          )}
        </div>

        {drawerOpen && (
          <div className="flex flex-col overflow-hidden rounded-[20px] border border-[#EDEDF2] bg-white shadow-[0_20px_48px_rgba(18,24,40,0.12)] lg:sticky lg:top-4 lg:col-span-5">
            <div className="flex items-start justify-between border-b border-[#F1F2F5] bg-[#F8F8FA] p-5">
              <div>
                <div className="flex items-center gap-2"><h2 className="text-[17px] font-bold text-[#151515]">Create Follow-up</h2><span className="rounded-full bg-[#DEE0FF] px-2 py-0.5 text-[10px] font-semibold text-[#151B6B]">New</span></div>
                <p className="mt-0.5 text-[12px] text-[#8E929C]">Schedule a new touchpoint with SLA commitment</p>
              </div>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close" className="rounded-full p-1 text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515]"><X className="text-[18px]" /></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); createTask(); }} className="flex max-h-[calc(100vh-16rem)] flex-col gap-4 overflow-y-auto p-5">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between"><label className="text-[12px] font-semibold text-[#151515]">Target Lead / Account</label></div>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F1F2F5] p-2.5">
                  <input name="followUpLeadName" aria-label="Lead name" value={formLeadName} onChange={(e) => setFormLeadName(e.target.value)} placeholder="Lead name" className="h-9 rounded-lg bg-white px-2.5 text-[12px] outline-none focus:ring-2 focus:ring-[#3152F4]/20" />
                  <input name="followUpLeadCompany" aria-label="Company" value={formLeadCompany} onChange={(e) => setFormLeadCompany(e.target.value)} placeholder="Company" className="h-9 rounded-lg bg-white px-2.5 text-[12px] outline-none focus:ring-2 focus:ring-[#3152F4]/20" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#151515]">Task Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(followUpTypeMeta) as FollowUpType[]).map((t) => {
                    const meta = followUpTypeMeta[t];
                    const active = formType === t;
                    return (
                      <button key={t} type="button" onClick={() => setFormType(t)} className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-2 text-[11px] font-semibold transition-all ${active ? "bg-[#3152F4] text-white shadow-[0_4px_12px_rgba(49,82,244,0.25)]" : "bg-[#F1F2F5] text-[#5E626D] hover:text-[#151515]"}`}>
                        <meta.icon className="text-[17px]" />{meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5"><span className="text-[12px] font-semibold text-[#151515]">Due Date</span><input name="followUpDueDate" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} className="h-10 rounded-xl bg-[#F1F2F5] px-3 text-[12px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" /></label>
                <label className="flex flex-col gap-1.5"><span className="text-[12px] font-semibold text-[#151515]">Time (IST)</span><input name="followUpTime" value={formTime} onChange={(e) => setFormTime(e.target.value)} className="h-10 rounded-xl bg-[#F1F2F5] px-3 text-[12px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" /></label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold text-[#151515]">Assigned Owner</span>
                <select name="followUpOwner" value={formOwner} onChange={(e) => setFormOwner(e.target.value)} className="h-10 rounded-xl bg-[#F1F2F5] px-3 text-[12px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">
                  {followUpOwners.map((owner) => <option key={owner}>{owner}</option>)}
                </select>
              </label>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#151515]">Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["High", "Medium", "Normal"] as FollowUpPriority[]).map((p) => {
                    const active = formPriority === p;
                    const tone = p === "High" ? "bg-[#F04452] text-white" : active ? "bg-[#3152F4] text-white" : "bg-[#F1F2F5] text-[#5E626D]";
                    return (
                      <button key={p} type="button" onClick={() => setFormPriority(p)} className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold transition-colors ${active ? tone : "bg-[#F1F2F5] text-[#5E626D] hover:bg-[#E5E8F5]"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-[#8E929C]"}`} />{p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#151515]">Reminder Delivery</label>
                <div className="flex flex-col gap-2 rounded-xl bg-[#F1F2F5] p-3">
                  <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" name="reminderSlack" checked={formReminders.slack} onChange={(e) => setFormReminders((r) => ({ ...r, slack: e.target.checked }))} className="h-4 w-4 accent-[#3152F4]" /><span className="text-[12px] font-medium text-[#151515]">Slack instant notification (#revenue-alerts)</span></label>
                  <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" name="reminderEmail" checked={formReminders.email} onChange={(e) => setFormReminders((r) => ({ ...r, email: e.target.checked }))} className="h-4 w-4 accent-[#3152F4]" /><span className="text-[12px] font-medium text-[#151515]">Email digest reminder (15 min prior)</span></label>
                  <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" name="reminderWhatsapp" checked={formReminders.whatsapp} onChange={(e) => setFormReminders((r) => ({ ...r, whatsapp: e.target.checked }))} className="h-4 w-4 accent-[#3152F4]" /><span className="text-[12px] font-medium text-[#151515]">WhatsApp direct alert to rep</span></label>
                </div>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold text-[#151515]">Touchpoint Objective &amp; Notes</span>
                <textarea name="followUpNotes" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={3} placeholder="e.g. Confirm discovery call attendees and review security questions..." className="resize-none rounded-xl bg-[#F1F2F5] p-3 text-[12px] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
              </label>
            </form>

            <div className="flex items-center justify-end gap-2.5 border-t border-[#F1F2F5] bg-[#F8F8FA] p-4">
              <button type="button" onClick={() => { resetForm(); setDrawerOpen(false); }} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-[#151515] hover:bg-[#F1F2F5]">Cancel</button>
              <button type="button" onClick={createTask} className="rounded-xl bg-gradient-to-r from-[#3152F4] to-[#2846E8] px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(49,82,244,0.3)] transition-all hover:opacity-95 active:scale-[0.98]">Create Task</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface QualificationQuestion {
  id: number;
  label: string;
  crmField: string;
  fieldType: string;
  points: string;
  askCondition: string;
  required: boolean;
}

const crmFieldOptions = ["lead.timeline_urgency", "lead.budget_range", "lead.service_interest", "lead.company_size", "lead.decision_role", "lead.contact_details", "lead.geo_location", "lead.custom_field"];
const fieldTypeOptions = ["Segmented Pill Choices (Single Select)", "Free Text Response", "Multi Select Pills", "Number Input", "Date Picker", "AI Detected (No Prompt)"];

const initialQuestions: QualificationQuestion[] = [
  { id: 1, label: "Budget & Investment Range", crmField: "lead.budget_range", fieldType: "Currency Range", points: "Up to +25 pts (High Impact)", askCondition: "Ask if Service != 'General Consulting'", required: true },
  { id: 2, label: "Project Timeline & Kickoff", crmField: "lead.timeline", fieldType: "Segmented Choices", points: "+20 pts (< 30 days)", askCondition: "Ask after budget confirmed", required: true },
  { id: 3, label: "Service Interest", crmField: "lead.service_interest", fieldType: "Single Select Pills", points: "Up to +15 pts", askCondition: "Always ask (Turn 1)", required: true },
  { id: 4, label: "Company Size & Headcount", crmField: "lead.company_size", fieldType: "Select Range", points: "+10 pts (>50 FTE)", askCondition: "Ask if Enterprise mode", required: false },
  { id: 5, label: "Buying Intent Signal", crmField: "lead.intent_score", fieldType: "AI Detected", points: "Up to +20 pts", askCondition: "Derived from conversation language", required: false },
];

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-[#3152F4]" : "bg-[#E5E8F5]"}`}>
      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(20,25,40,0.25)] transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function QualificationQuestionDialog({ onClose, onSave }: { onClose: () => void; onSave: (q: QualificationQuestion) => void }) {
  const [label, setLabel] = useState("");
  const [crmField, setCrmField] = useState(crmFieldOptions[0]);
  const [fieldType, setFieldType] = useState(fieldTypeOptions[0]);
  const [required, setRequired] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [aiAdaptive, setAiAdaptive] = useState(true);
  const [conditionField, setConditionField] = useState("service_interest");
  const [conditionValue, setConditionValue] = useState("Advisory Only");
  const [scoringEffects, setScoringEffects] = useState<string[]>(["+20 pts if timeline < 30 days"]);
  const [newEffect, setNewEffect] = useState("");
  const [languages, setLanguages] = useState<string[]>(["English (Default)"]);
  const [newLanguage, setNewLanguage] = useState("");
  const [addingLanguage, setAddingLanguage] = useState(false);

  function addScoringEffect() {
    if (!newEffect.trim()) return;
    setScoringEffects((cur) => [...cur, newEffect.trim()]);
    setNewEffect("");
  }

  function removeScoringEffect(idx: number) {
    setScoringEffects((cur) => cur.filter((_, i) => i !== idx));
  }

  function addLanguage() {
    if (!newLanguage.trim()) return;
    setLanguages((cur) => [...cur, newLanguage.trim()]);
    setNewLanguage("");
    setAddingLanguage(false);
  }

  function save() {
    if (!label.trim()) return;
    onSave({
      id: Date.now(),
      label: label.trim(),
      crmField,
      fieldType,
      points: scoringEffects[0] ?? "No scoring effect",
      askCondition: conditionField.trim() && conditionValue.trim() ? `Ask if ${conditionField.trim()} != '${conditionValue.trim()}'` : "Always ask",
      required,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/30" />
      <aside className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-[0_24px_48px_rgba(18,24,40,0.2)]">
        <div className="flex items-start justify-between border-b border-[#F1F2F5] p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><NotePencil className="text-[17px]" /></div>
            <div>
              <h2 className="text-[16px] font-bold text-[#151515]">Create Qualification Question</h2>
              <p className="mt-0.5 text-[11px] text-[#8E929C]">Define field mapping, phrasing, and AI extraction rules</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="shrink-0 rounded-full p-1 text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515]"><X className="text-[18px]" /></button>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[#151515]">Question Label / Internal Name</span>
            <input name="questionLabel" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Timeline Urgency" className="h-10 rounded-xl bg-[#F1F2F5] px-3 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[#151515]">Mapped CRM Field</span>
            <div className="relative">
              <select name="crmField" value={crmField} onChange={(e) => setCrmField(e.target.value)} className="h-10 w-full appearance-none rounded-xl bg-[#F1F2F5] px-3 pr-9 font-mono text-[12px] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">
                {crmFieldOptions.map((f) => <option key={f}>{f}</option>)}
              </select>
              <CaretDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#8E929C]" />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[#151515]">Input &amp; Field Type</span>
            <div className="relative">
              <select name="fieldType" value={fieldType} onChange={(e) => setFieldType(e.target.value)} className="h-10 w-full appearance-none rounded-xl bg-[#F1F2F5] px-3 pr-9 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">
                {fieldTypeOptions.map((f) => <option key={f}>{f}</option>)}
              </select>
              <CaretDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#8E929C]" />
            </div>
          </label>

          <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F8F8FA] p-3">
            <div>
              <span className="block text-[12px] font-semibold text-[#151515]">Required Question</span>
              <span className="text-[11px] text-[#8E929C]">Conversation won&rsquo;t yield qualified tag until filled</span>
            </div>
            <ToggleSwitch checked={required} onChange={() => setRequired((v) => !v)} label="Required question" />
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[#151515]">Default Visitor Prompt</span>
            <input name="defaultPrompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. When is your target kickoff date for this deployment?" className="h-10 rounded-xl bg-[#F1F2F5] px-3 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-[#F8F8FA] p-3">
            <input type="checkbox" name="aiAdaptivePhrasing" checked={aiAdaptive} onChange={(e) => setAiAdaptive(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#3152F4]" />
            <span>
              <span className="block text-[12px] font-semibold text-[#151515]">AI Adaptive Phrasing</span>
              <span className="text-[11px] text-[#8E929C]">Allow the agent to dynamically rephrase based on conversation tone &amp; previous context</span>
            </span>
          </label>

          <div className="flex flex-col gap-2 rounded-xl bg-[#F8F8FA] p-3">
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#151515]"><FlowArrow className="text-[14px] text-[#8E929C]" />Ask Condition / Branching</span>
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-white px-2.5 py-2 text-[12px] font-mono">
              <span className="font-semibold text-[#3152F4]">IF</span>
              <input name="conditionField" aria-label="Ask condition field" value={conditionField} onChange={(e) => setConditionField(e.target.value)} className="w-28 rounded bg-[#F1F2F5] px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-[#3152F4]/30" />
              <span className="text-[#8E929C]">!=</span>
              <input name="conditionValue" aria-label="Ask condition value" value={conditionValue} onChange={(e) => setConditionValue(e.target.value)} className="w-24 rounded bg-[#F1F2F5] px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-[#3152F4]/30" />
              <span className="ml-auto shrink-0 rounded bg-[#F1F2F5] px-2 py-0.5 text-[10px] font-semibold text-[#5E626D]">THEN Ask</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#151515]"><ChartLineUp className="text-[14px] text-[#8E929C]" />Scoring Impact</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {scoringEffects.map((effect, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 rounded-xl bg-[#E8F8F3] px-3 py-2 text-[12px] font-medium text-[#0B7A57]">
                  <span className="flex items-center gap-1.5"><Target className="text-[13px]" />{effect}</span>
                  <button type="button" onClick={() => removeScoringEffect(idx)} aria-label="Remove scoring effect" className="text-[#0B7A57]/60 hover:text-[#0B7A57]"><X className="text-[13px]" /></button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <input name="scoringEffect" aria-label="New scoring effect" value={newEffect} onChange={(e) => setNewEffect(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addScoringEffect(); } }} placeholder="e.g. +10 pts if budget confirmed" className="h-8 flex-1 rounded-lg bg-[#F1F2F5] px-2.5 text-[11px] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
              <button type="button" onClick={addScoringEffect} className="flex items-center gap-1 rounded-lg bg-[#F1F3FF] px-2.5 py-1.5 text-[11px] font-semibold text-[#3152F4] hover:bg-[#E5E8F5]"><Plus className="text-[13px]" />Add</button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#151515]"><Translate className="text-[14px] text-[#8E929C]" />Multilingual Phrasing Support</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {languages.map((lang) => (
                <span key={lang} className="rounded-full bg-[#F1F2F5] px-2.5 py-1 text-[11px] font-semibold text-[#5E626D]">{lang}</span>
              ))}
              {addingLanguage ? (
                <span className="flex items-center gap-1">
                  <input name="newLanguage" aria-label="New language" autoFocus value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLanguage(); } if (e.key === "Escape") setAddingLanguage(false); }} placeholder="Language" className="h-7 w-24 rounded-full bg-white px-2.5 text-[11px] outline-none ring-1 ring-[#3152F4]/30" />
                  <button type="button" onClick={addLanguage} aria-label="Confirm language" className="text-[#3152F4]"><Check weight="bold" className="text-[14px]" /></button>
                </span>
              ) : (
                <button type="button" onClick={() => setAddingLanguage(true)} aria-label="Add language" className="grid h-7 w-7 place-items-center rounded-full bg-[#F1F2F5] text-[#5E626D] hover:bg-[#E5E8F5]"><Plus className="text-[13px]" /></button>
              )}
            </div>
          </div>

          <p className="flex items-start gap-2 text-[11px] text-[#8E929C]"><Info className="mt-0.5 shrink-0 text-[13px]" />Graceful extraction with 2 retry attempts before human handoff.</p>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-[#F1F2F5] bg-[#F8F8FA] p-4">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-[#151515] hover:bg-[#F1F2F5]">Cancel</button>
          <button type="button" onClick={save} className="rounded-xl bg-[#3152F4] px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(49,82,244,0.3)] transition-all hover:opacity-95 active:scale-[0.98]">Save Question</button>
        </div>
      </aside>
    </div>
  );
}

type ScoringRuleKind = "positive" | "highlight" | "alert" | "penalty";
type ScoringRuleIcon = "lightning" | "sparkle" | "bellRinging" | "minusCircle" | "shieldCheck" | "chartLineUp";

interface ScoringRule {
  id: number;
  name: string;
  category: string;
  kind: ScoringRuleKind;
  icon: ScoringRuleIcon;
  points: number;
  conditionIf: string;
  conditionAnd?: string;
  note?: { prefix: string; highlight: string; suffix: string };
  matched: number;
  capturePercent?: string;
  evaluatedAgo: string;
  precision: string;
  active: boolean;
}

const ruleKindStyle: Record<ScoringRuleKind, { bg: string; text: string }> = {
  positive: { bg: "bg-[#E8F8F3]", text: "text-[#0B7A57]" },
  highlight: { bg: "bg-[#F1F3FF]", text: "text-[#3152F4]" },
  alert: { bg: "bg-[#FDF2F3]", text: "text-[#F04452]" },
  penalty: { bg: "bg-[#FDF2F3]", text: "text-[#F04452]" },
};
const ruleIconMap: Record<ScoringRuleIcon, typeof Lightning> = {
  lightning: Lightning, sparkle: Sparkle, bellRinging: BellRinging, minusCircle: MinusCircle, shieldCheck: ShieldCheck, chartLineUp: ChartLineUp,
};
function tagLabel(rule: ScoringRule) {
  const sign = rule.kind === "penalty" ? "-" : "+";
  const suffix = rule.kind === "alert" ? " + Instant Alert" : "";
  return `${rule.name} (${sign}${Math.abs(rule.points)} pts${suffix})`;
}
function thenLabel(rule: ScoringRule) {
  return rule.kind === "penalty" ? `Subtract -${Math.abs(rule.points)} points` : `Add +${Math.abs(rule.points)} points`;
}

const initialScoringRules: ScoringRule[] = [
  { id: 1, name: "High Velocity", category: "Financial & Urgency", kind: "positive", icon: "lightning", points: 25, conditionIf: "Budget ≥ €200,000", conditionAnd: "Timeline is within 30 days", matched: 318, capturePercent: "74.2% capture", evaluatedAgo: "4m ago", precision: "99.2%", active: true },
  { id: 2, name: "Core Offering Match", category: "Service Fit", kind: "highlight", icon: "sparkle", points: 18, conditionIf: 'Service Interest is "AI Automation & CRM"', matched: 482, evaluatedAgo: "12m ago", precision: "98.9%", active: true },
  { id: 3, name: "Direct Hot Handover", category: "Intent & Routing", kind: "alert", icon: "bellRinging", points: 22, conditionIf: 'Buying Intent is "High (Immediate Need)"', note: { prefix: "Trigger Slack alert to ", highlight: "#enterprise-sales", suffix: " & assign round-robin" }, matched: 142, evaluatedAgo: "1m ago", precision: "99.7%", active: true },
  { id: 4, name: "Penalty", category: "Demographics", kind: "penalty", icon: "minusCircle", points: 20, conditionIf: 'Location is "Outside Tier-1 / Unserviced Geography"', matched: 64, evaluatedAgo: "42m ago", precision: "96.5%", active: true },
  { id: 5, name: "Authority Boost", category: "Authority", kind: "positive", icon: "shieldCheck", points: 15, conditionIf: 'Decision Maker Role is "C-Level / VP / Founder"', matched: 215, evaluatedAgo: "18m ago", precision: "99.1%", active: true },
  { id: 6, name: "Scale Fit", category: "Scale & Volume", kind: "positive", icon: "chartLineUp", points: 10, conditionIf: "Monthly Website Traffic > 50,000 visits", matched: 98, evaluatedAgo: "2h ago", precision: "97.8%", active: true },
];

const sampleLeadScores = Array.from({ length: 60 }, (_, i) => Math.floor((((Math.sin(i * 12.9898) * 43758.5453) % 1) + 1) % 1 * 100));

function RuleLogicRow({ rule }: { rule: ScoringRule }) {
  const toneClass = rule.kind === "penalty" ? "bg-[#FDF2F3] text-[#F04452]" : "bg-[#E8F8F3] text-[#0B7A57]";
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#F8F9FC] p-3 text-[12px] text-[#151515]">
      <span className="rounded bg-[#3152F4] px-2 py-0.5 text-[10px] font-bold text-white">IF</span>
      <span className="rounded-lg bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-[#151515] shadow-sm">{rule.conditionIf}</span>
      {rule.conditionAnd && (
        <>
          <span className="rounded bg-[#E5E2E1] px-2 py-0.5 text-[10px] font-bold text-[#5E626D]">AND</span>
          <span className="rounded-lg bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-[#151515] shadow-sm">{rule.conditionAnd}</span>
        </>
      )}
      <span className="rounded bg-[#0B7A57] px-2 py-0.5 text-[10px] font-bold text-white">THEN</span>
      <span className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${toneClass}`}>{thenLabel(rule)}</span>
      {rule.note && (
        <>
          <span className="rounded bg-[#E5E2E1] px-2 py-0.5 text-[10px] font-bold text-[#5E626D]">AND</span>
          <span className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-[#151515] shadow-sm">
            <Megaphone className="text-[14px] text-[#F04452]" />
            {rule.note.prefix}<b className="font-bold text-[#3152F4]">{rule.note.highlight}</b>{rule.note.suffix}
          </span>
        </>
      )}
    </div>
  );
}

function ScoringRuleCard({
  rule, priority, reorderMode, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onToggleActive, onEdit, onDuplicate, onDelete, menuOpen, onToggleMenu,
}: {
  rule: ScoringRule; priority: number; reorderMode: boolean; canMoveUp: boolean; canMoveDown: boolean;
  onMoveUp: () => void; onMoveDown: () => void; onToggleActive: () => void; onEdit: () => void; onDuplicate: () => void; onDelete: () => void;
  menuOpen: boolean; onToggleMenu: () => void;
}) {
  const Icon = ruleIconMap[rule.icon];
  const style = ruleKindStyle[rule.kind];
  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-white p-4 shadow-[0_10px_26px_rgba(20,25,40,0.04)] transition-shadow hover:shadow-[0_14px_32px_rgba(20,25,40,0.07)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {reorderMode ? (
            <div className="flex flex-col">
              <button type="button" disabled={!canMoveUp} onClick={onMoveUp} aria-label={`Move ${rule.name} up in priority`} className="text-[#8E929C] hover:text-[#151515] disabled:opacity-30"><CaretUp className="text-[14px]" /></button>
              <button type="button" disabled={!canMoveDown} onClick={onMoveDown} aria-label={`Move ${rule.name} down in priority`} className="text-[#8E929C] hover:text-[#151515] disabled:opacity-30"><CaretDown className="text-[14px]" /></button>
            </div>
          ) : (
            <DotsSixVertical className="text-[18px] text-[#C4C5D9]" />
          )}
          <span className="rounded-md bg-[#F1F2F5] px-2 py-0.5 text-[10px] font-bold uppercase text-[#5E626D]">Priority #{priority}</span>
          <span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[10px] font-medium text-[#5E626D]">{rule.category}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${style.bg} ${style.text}`}><Icon className="text-[12px]" />{tagLabel(rule)}</span>
          <ToggleSwitch checked={rule.active} onChange={onToggleActive} label={`Toggle ${rule.name}`} />
          <div className="relative">
            <button type="button" onClick={onToggleMenu} aria-label={`More actions for ${rule.name}`} className="rounded-lg p-1 text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515]"><DotsThree weight="bold" className="text-[18px]" /></button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-10 w-32 overflow-hidden rounded-xl bg-white py-1 shadow-[0_10px_30px_rgba(20,25,40,0.15)]">
                <button type="button" onClick={onDelete} className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-[11px] font-semibold text-[#F04452] hover:bg-[#FDF2F3]"><Trash className="text-[13px]" />Delete Rule</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <RuleLogicRow rule={rule} />

      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11px] text-[#8E929C]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1"><CheckCircle weight="fill" className="text-[13px] text-[#0B7A57]" /><span className="font-semibold text-[#151515]">{rule.matched} leads matched</span></span>
          {rule.capturePercent && <span>({rule.capturePercent})</span>}
          <span>•</span><span>Evaluated {rule.evaluatedAgo}</span><span>•</span><span className="font-semibold text-[#0B7A57]">{rule.precision} precision</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onEdit} className="font-semibold text-[#8E929C] hover:text-[#3152F4]">Edit</button>
          <span>•</span>
          <button type="button" onClick={onDuplicate} className="font-semibold text-[#8E929C] hover:text-[#151515]">Duplicate</button>
        </div>
      </div>
    </div>
  );
}

const ruleCategories = ["Financial & Urgency", "Service Fit", "Intent & Routing", "Demographics", "Authority", "Scale & Volume"];
const ruleKindOptions: { value: ScoringRuleKind; label: string }[] = [
  { value: "positive", label: "Positive Boost" },
  { value: "highlight", label: "Highlighted Fit" },
  { value: "alert", label: "Alert & Instant Notify" },
  { value: "penalty", label: "Penalty" },
];
const ruleKindDefaultIcon: Record<ScoringRuleKind, ScoringRuleIcon> = { positive: "lightning", highlight: "sparkle", alert: "bellRinging", penalty: "minusCircle" };

function ScoringRuleDialog({ initial, onClose, onSave }: { initial: ScoringRule | null; onClose: () => void; onSave: (rule: ScoringRule) => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? ruleCategories[0]);
  const [kind, setKind] = useState<ScoringRuleKind>(initial?.kind ?? "positive");
  const [points, setPoints] = useState(initial ? Math.abs(initial.points) : 10);
  const [conditionIf, setConditionIf] = useState(initial?.conditionIf ?? "");
  const [conditionAnd, setConditionAnd] = useState(initial?.conditionAnd ?? "");
  const [active, setActive] = useState(initial?.active ?? true);

  const previewRule: ScoringRule = {
    id: initial?.id ?? -1, name: name || "New Rule", category, kind, icon: initial?.icon ?? ruleKindDefaultIcon[kind],
    points: kind === "penalty" ? -Math.abs(points) : Math.abs(points),
    conditionIf: conditionIf || "Condition not set", conditionAnd: conditionAnd || undefined, note: initial?.note,
    matched: initial?.matched ?? 0, capturePercent: initial?.capturePercent, evaluatedAgo: initial?.evaluatedAgo ?? "Just now", precision: initial?.precision ?? "—", active,
  };

  function save() {
    if (!name.trim() || !conditionIf.trim()) return;
    onSave({ ...previewRule, name: name.trim(), conditionIf: conditionIf.trim(), conditionAnd: conditionAnd.trim() || undefined });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#151515]/40" />
      <aside className="relative flex h-full w-full max-w-md flex-col gap-5 overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><Gauge className="text-[18px]" /></span>
            <div><h2 className="text-[15px] font-bold text-[#151515]">{initial ? "Edit Scoring Rule" : "Add Scoring Rule"}</h2><p className="text-[11px] text-[#8E929C]">Define the condition, category, and point impact</p></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-[#8E929C] hover:bg-[#F1F2F5]"><X className="text-[16px]" /></button>
        </div>

        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#151515]">Rule Name
          <input name="ruleName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. High Velocity" className="rounded-xl bg-[#F1F2F5] px-3 py-2 text-[13px] font-medium text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
        </label>

        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#151515]">Category
          <select name="ruleCategory" value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl bg-[#F1F2F5] px-3 py-2 text-[13px] font-medium text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">
            {ruleCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#151515]">Rule Type
            <select name="ruleKind" value={kind} onChange={(e) => setKind(e.target.value as ScoringRuleKind)} className="rounded-xl bg-[#F1F2F5] px-3 py-2 text-[13px] font-medium text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">
              {ruleKindOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#151515]">Points
            <input name="rulePoints" type="number" min={1} value={points} onChange={(e) => setPoints(Number(e.target.value))} className="rounded-xl bg-[#F1F2F5] px-3 py-2 text-[13px] font-medium text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#151515]">Condition (IF)
          <input name="ruleConditionIf" value={conditionIf} onChange={(e) => setConditionIf(e.target.value)} placeholder="e.g. Budget ≥ €200,000" className="rounded-xl bg-[#F1F2F5] px-3 py-2 text-[13px] font-medium text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
        </label>
        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#151515]">Additional Condition (AND) — optional
          <input name="ruleConditionAnd" value={conditionAnd} onChange={(e) => setConditionAnd(e.target.value)} placeholder="e.g. Timeline is within 30 days" className="rounded-xl bg-[#F1F2F5] px-3 py-2 text-[13px] font-medium text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
        </label>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F8F9FC] p-3">
          <div><span className="block text-[12px] font-semibold text-[#151515]">Rule Active</span><span className="text-[10px] text-[#8E929C]">Live in the scoring engine immediately</span></div>
          <ToggleSwitch checked={active} onChange={() => setActive((v) => !v)} label="Rule active" />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8E929C]">Preview</span>
          <RuleLogicRow rule={previewRule} />
        </div>

        <div className="mt-auto flex items-center justify-end gap-2 border-t border-[#F1F2F5] pt-4">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-[#5E626D] hover:bg-[#F1F2F5]">Cancel</button>
          <button type="button" onClick={save} className="rounded-xl bg-[#3152F4] px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(49,82,244,0.3)] hover:opacity-95 active:scale-[0.98]">{initial ? "Save Changes" : "Add Rule"}</button>
        </div>
      </aside>
    </div>
  );
}

function ClassificationThresholdsCard({
  warmStart, hotStart, onChangeWarm, onChangeHot, coldPct, warmPct, hotPct,
}: {
  warmStart: number; hotStart: number; onChangeWarm: (v: number) => void; onChangeHot: (v: number) => void; coldPct: number; warmPct: number; hotPct: number;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="flex flex-col gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[14px] font-bold text-[#151515]"><SlidersHorizontal className="text-[18px] text-[#3152F4]" />Lead Temperature Thresholds</span>
        <button type="button" onClick={() => setEditing((v) => !v)} aria-label="Edit temperature thresholds" aria-pressed={editing} className={`rounded-lg p-1 ${editing ? "bg-[#F1F3FF] text-[#3152F4]" : "text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#3152F4]"}`}><NotePencil className="text-[16px]" /></button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-[#8E929C]">Determines automatic routing and tag assignment based on final cumulative score.</p>
        <span className="shrink-0 rounded-full bg-[#0B7A57] px-2 py-0.5 text-[10px] font-semibold text-white">Auto-recalculate</span>
      </div>

      {editing && (
        <div className="flex flex-col gap-2 rounded-xl bg-[#F8F9FC] p-3">
          <label className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#5E626D]">Warm starts at
            <input name="warmThreshold" type="number" min={1} max={hotStart - 1} value={warmStart} onChange={(e) => onChangeWarm(Math.min(hotStart - 1, Math.max(1, Number(e.target.value))))} className="w-16 rounded-lg bg-white px-2 py-1 text-right text-[12px] font-bold text-[#151515] shadow-sm outline-none focus:ring-2 focus:ring-[#3152F4]/20" />
          </label>
          <label className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#5E626D]">Hot starts at
            <input name="hotThreshold" type="number" min={warmStart + 1} max={99} value={hotStart} onChange={(e) => onChangeHot(Math.min(99, Math.max(warmStart + 1, Number(e.target.value))))} className="w-16 rounded-lg bg-white px-2 py-1 text-right text-[12px] font-bold text-[#151515] shadow-sm outline-none focus:ring-2 focus:ring-[#3152F4]/20" />
          </label>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex h-7 w-full overflow-hidden rounded-full bg-[#F1F2F5]">
          <div className="flex items-center justify-center whitespace-nowrap text-[10px] font-semibold text-white" style={{ width: `${warmStart}%`, background: "#5E626D" }}>Cold (0-{warmStart - 1})</div>
          <div className="flex items-center justify-center whitespace-nowrap text-[10px] font-semibold text-[#151515]" style={{ width: `${hotStart - warmStart}%`, background: "#E5E2E1" }}>Warm ({warmStart}-{hotStart - 1})</div>
          <div className="flex items-center justify-center whitespace-nowrap text-[10px] font-bold text-white" style={{ width: `${100 - hotStart}%`, background: "#F04452" }}>Hot ({hotStart}+)</div>
        </div>
        <div className="flex items-center justify-between px-1 text-[10px] text-[#8E929C]">
          <span>0</span><span className="font-bold text-[#151515]">{warmStart}</span><span className="font-bold text-[#F04452]">{hotStart}</span><span>100</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between rounded-xl bg-[#F8F9FC] p-2.5">
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#5E626D]" /><div><span className="block text-[12px] font-semibold text-[#151515]">Cold / Nurture Queue</span><span className="text-[10px] text-[#8E929C]">Score 0 – {warmStart - 1}</span></div></div>
          <div className="text-right"><span className="block text-[12px] font-bold text-[#151515]">{coldPct}%</span><span className="text-[10px] text-[#8E929C]">of volume</span></div>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-[#F8F9FC] p-2.5">
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#C8C6C5]" /><div><span className="block text-[12px] font-semibold text-[#151515]">Warm / SDR Sequence</span><span className="text-[10px] text-[#8E929C]">Score {warmStart} – {hotStart - 1}</span></div></div>
          <div className="text-right"><span className="block text-[12px] font-bold text-[#151515]">{warmPct}%</span><span className="text-[10px] text-[#8E929C]">of volume</span></div>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-[#FDF2F3] p-2.5">
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#F04452]" /><div><span className="block text-[12px] font-semibold text-[#151515]">Hot / Direct Booking</span><span className="text-[10px] text-[#8E929C]">Score {hotStart} – 100</span></div></div>
          <div className="text-right"><span className="block text-[12px] font-bold text-[#F04452]">{hotPct}%</span><span className="text-[10px] text-[#8E929C]">of volume</span></div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl bg-[#F8F9FC] p-3 text-[11px] text-[#8E929C]">
        <Timer className="mt-0.5 shrink-0 text-[16px] text-[#3152F4]" />
        <span><b className="font-semibold text-[#151515]">SLA Commitment:</b> Hot leads trigger automatic distribution requiring agent outreach within <span className="font-bold text-[#F04452]">15 minutes</span>.</span>
      </div>
    </div>
  );
}

const simulatorPresets = [
  { name: "Acme Corp", budget: 500000, timelineDays: 15, service: "AI Automation & CRM", intent: "High (Immediate Need)", authority: "Founder / CEO (Tier 1)", location: "Bengaluru (Tier-1)" },
  { name: "Nimbus Retail", budget: 90000, timelineDays: 50, service: "AI Automation & CRM", intent: "High (Immediate Need)", authority: "VP / Director", location: "Mumbai (Tier-1)" },
  { name: "Vantage Logistics", budget: 40000, timelineDays: 90, service: "Advisory Only", intent: "Low (Research Only)", authority: "Individual Contributor", location: "Outside Tier-1 / Unserviced" },
];
const serviceOptions = ["AI Automation & CRM", "Web Development", "E-commerce", "Advisory Only", "General Consulting"];
const intentOptions = ["High (Immediate Need)", "Medium (Exploring)", "Low (Research Only)"];
const authorityOptions = ["Founder / CEO (Tier 1)", "VP / Director", "Manager", "Individual Contributor"];
const locationOptions = ["Bengaluru (Tier-1)", "Mumbai (Tier-1)", "Outside Tier-1 / Unserviced"];

function TestScoreSimulatorCard({ scoringRules, warmStart, hotStart, notify }: { scoringRules: ScoringRule[]; warmStart: number; hotStart: number; notify: (v: string) => void }) {
  const [presetIndex, setPresetIndex] = useState(0);
  const preset = simulatorPresets[presetIndex];
  const [budget, setBudget] = useState(preset.budget);
  const [timelineDays, setTimelineDays] = useState(preset.timelineDays);
  const [service, setService] = useState(preset.service);
  const [intent, setIntent] = useState(preset.intent);
  const [authority, setAuthority] = useState(preset.authority);
  const [location, setLocation] = useState(preset.location);

  function applyPreset(idx: number) {
    const p = simulatorPresets[idx];
    setPresetIndex(idx);
    setBudget(p.budget); setTimelineDays(p.timelineDays); setService(p.service); setIntent(p.intent); setAuthority(p.authority); setLocation(p.location);
  }

  const isActive = (id: number) => scoringRules.find((r) => r.id === id)?.active ?? false;

  const breakdown = useMemo(() => {
    const lines: { label: string; points: number }[] = [{ label: "Base Initial Score", points: 0 }];
    if (isActive(1) && budget >= 200000 && timelineDays <= 30) lines.push({ label: "Budget (≥ €200K) & Timeline (≤ 30d)", points: 25 });
    if (isActive(3) && intent === "High (Immediate Need)") lines.push({ label: "Buying Intent Signal (High)", points: 22 });
    if (isActive(2) && service === "AI Automation & CRM") lines.push({ label: "Service Fit (AI Automation & CRM)", points: 18 });
    if (isActive(5) && (authority === "Founder / CEO (Tier 1)" || authority === "VP / Director")) lines.push({ label: `Decision Maker (${authority.split(" (")[0]})`, points: 15 });
    if (location !== "Outside Tier-1 / Unserviced") lines.push({ label: `Geographic Fit (Tier-1 ${location.split(" (")[0]})`, points: 6 });
    else if (isActive(4)) lines.push({ label: "Location Outside Tier-1 (Penalty)", points: -20 });
    return lines;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoringRules, budget, timelineDays, service, intent, authority, location]);

  const rawTotal = breakdown.reduce((sum, l) => sum + l.points, 0);
  const total = Math.max(0, Math.min(100, rawTotal));
  const tier: "Hot" | "Warm" | "Cold" = total >= hotStart ? "Hot" : total >= warmStart ? "Warm" : "Cold";
  const tierStyle = tier === "Hot" ? { bg: "bg-[#FDF2F3]", text: "text-[#F04452]" } : tier === "Warm" ? { bg: "bg-[#FEF8EC]", text: "text-[#A8590A]" } : { bg: "bg-[#F1F2F5]", text: "text-[#5E626D]" };

  return (
    <div className="flex flex-col gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[14px] font-bold text-[#151515]"><PlayCircle weight="fill" className="text-[18px] text-[#3152F4]" />Test Score Simulator</span>
        <span className="rounded-full bg-[#F1F2F5] px-2.5 py-0.5 text-[10px] font-semibold text-[#5E626D]">Sample {preset.name}</span>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-[#F8F9FC] p-3">
        <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Candidate Inputs</span>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-[10px] font-medium text-[#8E929C]">Budget (€)
            <input name="simBudget" type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="rounded-lg bg-white px-2 py-1 text-[12px] font-semibold text-[#151515] shadow-sm outline-none focus:ring-2 focus:ring-[#3152F4]/20" />
          </label>
          <label className="flex flex-col gap-1 text-[10px] font-medium text-[#8E929C]">Timeline (days)
            <input name="simTimeline" type="number" value={timelineDays} onChange={(e) => setTimelineDays(Number(e.target.value))} className="rounded-lg bg-white px-2 py-1 text-[12px] font-semibold text-[#151515] shadow-sm outline-none focus:ring-2 focus:ring-[#3152F4]/20" />
          </label>
          <label className="flex flex-col gap-1 text-[10px] font-medium text-[#8E929C]">Service
            <select name="simService" value={service} onChange={(e) => setService(e.target.value)} className="rounded-lg bg-white px-2 py-1 text-[12px] font-semibold text-[#151515] shadow-sm outline-none focus:ring-2 focus:ring-[#3152F4]/20">
              {serviceOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[10px] font-medium text-[#8E929C]">Intent
            <select name="simIntent" value={intent} onChange={(e) => setIntent(e.target.value)} className="rounded-lg bg-white px-2 py-1 text-[12px] font-semibold text-[#151515] shadow-sm outline-none focus:ring-2 focus:ring-[#3152F4]/20">
              {intentOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[10px] font-medium text-[#8E929C]">Authority
            <select name="simAuthority" value={authority} onChange={(e) => setAuthority(e.target.value)} className="rounded-lg bg-white px-2 py-1 text-[12px] font-semibold text-[#151515] shadow-sm outline-none focus:ring-2 focus:ring-[#3152F4]/20">
              {authorityOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[10px] font-medium text-[#8E929C]">Location
            <select name="simLocation" value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-lg bg-white px-2 py-1 text-[12px] font-semibold text-[#151515] shadow-sm outline-none focus:ring-2 focus:ring-[#3152F4]/20">
              {locationOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-gradient-to-br from-[#F8F9FC] to-[#F1F2F5] p-4">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Simulated Score</span>
          <div className="flex items-baseline gap-1"><span className="text-[32px] font-black text-[#151515]">{total}</span><span className="text-[14px] text-[#8E929C]">/ 100</span></div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-bold ${tierStyle.bg} ${tierStyle.text}`}><Fire weight="fill" className="text-[14px]" />{tier.toUpperCase()} LEAD</span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#0B7A57]"><Check weight="bold" className="text-[12px]" />Auto-Route Qualified</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Scoring Waterfall Breakdown</span>
        <div className="flex flex-col divide-y divide-[#F1F2F5] text-[12px]">
          {breakdown.map((line, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5">
              <span className={idx === 0 ? "text-[#8E929C]" : "text-[#151515]"}>{line.label}</span>
              <span className={`font-mono font-bold ${line.points < 0 ? "text-[#F04452]" : line.points === 0 ? "text-[#8E929C]" : "text-[#0B7A57]"}`}>{line.points > 0 ? "+" : ""}{line.points} pts</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2 font-bold text-[#151515]">
            <span>Total Calculated Score</span>
            <span className="font-mono text-[14px] text-[#3152F4]">{total} pts ({tier} Tier)</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <button type="button" onClick={() => applyPreset((presetIndex + 1) % simulatorPresets.length)} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#F1F2F5] py-2 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5]"><Repeat className="text-[15px]" />Test Another Lead Record</button>
        <button type="button" onClick={() => notify(`${preset.name} saved as golden benchmark test`)} className="text-center text-[11px] font-semibold text-[#3152F4] hover:underline">Save {preset.name} as Golden Benchmark Test</button>
      </div>
    </div>
  );
}

function QualificationPage({ notify }: { notify: (v: string) => void }) {
  const [questions, setQuestions] = useState<QualificationQuestion[]>(initialQuestions);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);

  const [tab, setTab] = useState<"Questions" | "Scoring Rules" | "Classification Thresholds" | "Test Score Sandbox">("Scoring Rules");

  const [scoringRules, setScoringRules] = useState<ScoringRule[]>(initialScoringRules);
  const nextRuleId = useRef(7);
  const [ruleDialog, setRuleDialog] = useState<{ open: boolean; editing: ScoringRule | null }>({ open: false, editing: null });
  const [reorderMode, setReorderMode] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused">("all");

  const [auditLog, setAuditLog] = useState<{ id: number; text: string; time: string }[]>([
    { id: -1, text: "Authority Boost rule precision recalculated", time: "18m ago" },
    { id: -2, text: "Penalty rule threshold reviewed by Maya Singh", time: "42m ago" },
    { id: -3, text: "Qualification engine synced with Widget v2.1", time: "1h ago" },
  ]);
  const [auditOpen, setAuditOpen] = useState(false);
  const auditIdRef = useRef(-4);
  function logAudit(text: string) {
    setAuditLog((cur) => [{ id: auditIdRef.current--, text, time: "Just now" }, ...cur]);
  }

  const [warmStart, setWarmStart] = useState(40);
  const [hotStart, setHotStart] = useState(70);

  const tierPct = useMemo(() => {
    const cold = sampleLeadScores.filter((s) => s < warmStart).length;
    const hot = sampleLeadScores.filter((s) => s >= hotStart).length;
    const total = sampleLeadScores.length;
    const warm = total - cold - hot;
    return { cold: Math.round((cold / total) * 100), warm: Math.round((warm / total) * 100), hot: Math.round((hot / total) * 100) };
  }, [warmStart, hotStart]);

  const avgLeadScore = useMemo(() => sampleLeadScores.reduce((a, b) => a + b, 0) / sampleLeadScores.length, []);

  function handleSaveQuestion(question: QualificationQuestion) {
    setQuestions((cur) => [...cur, question]);
    notify(`${question.label} added to qualification flow`);
    logAudit(`Added question "${question.label}"`);
    setQuestionDialogOpen(false);
  }

  function toggleRuleActive(id: number) {
    setScoringRules((cur) => cur.map((r) => {
      if (r.id !== id) return r;
      logAudit(`${r.active ? "Paused" : "Activated"} rule "${r.name}"`);
      return { ...r, active: !r.active };
    }));
  }
  function openCreateRule() {
    setTab("Scoring Rules");
    setRuleDialog({ open: true, editing: null });
  }
  function openEditRule(rule: ScoringRule) {
    setRuleDialog({ open: true, editing: rule });
  }
  function saveRule(rule: ScoringRule) {
    if (ruleDialog.editing) {
      setScoringRules((cur) => cur.map((r) => (r.id === rule.id ? rule : r)));
      notify(`${rule.name} updated`);
      logAudit(`Edited rule "${rule.name}"`);
    } else {
      const newRule: ScoringRule = { ...rule, id: nextRuleId.current++ };
      setScoringRules((cur) => [...cur, newRule]);
      notify(`${rule.name} added to scoring engine`);
      logAudit(`Added new rule "${rule.name}"`);
    }
    setRuleDialog({ open: false, editing: null });
  }
  function duplicateRule(rule: ScoringRule) {
    const copy: ScoringRule = { ...rule, id: nextRuleId.current++, name: `${rule.name} (Copy)`, matched: 0, evaluatedAgo: "Just now" };
    setScoringRules((cur) => {
      const idx = cur.findIndex((r) => r.id === rule.id);
      const next = [...cur];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    notify(`${rule.name} duplicated`);
    logAudit(`Duplicated rule "${rule.name}"`);
    setMenuOpenId(null);
  }
  function deleteRule(rule: ScoringRule) {
    setScoringRules((cur) => cur.filter((r) => r.id !== rule.id));
    notify(`${rule.name} deleted`);
    logAudit(`Deleted rule "${rule.name}"`);
    setMenuOpenId(null);
  }
  function moveRule(id: number, direction: -1 | 1) {
    setScoringRules((cur) => {
      const idx = cur.findIndex((r) => r.id === id);
      const swapIdx = idx + direction;
      if (swapIdx < 0 || swapIdx >= cur.length) return cur;
      const next = [...cur];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  }

  const categories = useMemo(() => Array.from(new Set(scoringRules.map((r) => r.category))), [scoringRules]);

  const filteredRules = useMemo(() => {
    const q = search.trim().toLowerCase();
    return scoringRules.filter((r) => {
      if (categoryFilter !== "All Categories" && r.category !== categoryFilter) return false;
      if (statusFilter === "active" && !r.active) return false;
      if (statusFilter === "paused" && r.active) return false;
      if (!q) return true;
      const haystack = [r.name, r.category, r.conditionIf, r.conditionAnd ?? "", r.note?.highlight ?? ""].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [scoringRules, search, categoryFilter, statusFilter]);

  const activeCount = scoringRules.filter((r) => r.active).length;
  const positiveCount = scoringRules.filter((r) => r.kind === "positive" || r.kind === "highlight").length;
  const penaltyCount = scoringRules.filter((r) => r.kind === "penalty").length;
  const alertCount = scoringRules.filter((r) => r.kind === "alert").length;

  const tabs: { key: "Questions" | "Scoring Rules" | "Classification Thresholds" | "Test Score Sandbox"; label: string; count?: number }[] = [
    { key: "Questions", label: "Questions", count: questions.length },
    { key: "Scoring Rules", label: "Scoring Rules", count: scoringRules.length },
    { key: "Classification Thresholds", label: "Classification Thresholds" },
    { key: "Test Score Sandbox", label: "Test Score Sandbox" },
  ];

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#3152F4]">AI Evaluation Engine</span>
              <span className="h-1 w-1 rounded-full bg-[#C4C5D9]" />
              <span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[10px] font-semibold text-[#5E626D]">v3.4 Production</span>
              <span className="h-1 w-1 rounded-full bg-[#C4C5D9]" />
              <span className="text-[11px] text-[#8E929C]">ailqs.com</span>
            </div>
            <h1 className="text-[24px] font-extrabold tracking-tight text-[#151515]">Qualification &amp; Scoring</h1>
            <p className="max-w-2xl text-[12px] text-[#8E929C]">Configure automated lead scoring models, intent weightings, temperature thresholds, and real-time sales alert triggers.</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <button type="button" onClick={() => setAuditOpen(true)} className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#F1F2F5]"><ClockCounterClockwise className="text-[16px]" />Audit Log</button>
            <button type="button" onClick={() => setReorderMode((v) => !v)} aria-pressed={reorderMode} className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold shadow-sm ${reorderMode ? "bg-[#3152F4] text-white" : "bg-white text-[#151515] hover:bg-[#F1F2F5]"}`}><ArrowsDownUp className="text-[16px]" />Reorder Priority</button>
            <button type="button" onClick={openCreateRule} className="flex items-center gap-1.5 rounded-xl bg-[#3152F4] px-4 py-2 text-[12px] font-bold text-white shadow-[0_8px_20px_rgba(49,82,244,0.28)] hover:opacity-95"><Plus className="text-[16px]" />Add Scoring Rule</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(20,25,40,0.03)]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Active Scoring Rules</span>
              <div className="flex items-baseline gap-2"><span className="text-[22px] font-bold text-[#151515]">{activeCount} Live</span><span className="text-[10px] font-semibold text-[#0B7A57]">{Math.round((activeCount / (scoringRules.length || 1)) * 100)}% operational</span></div>
              <span className="text-[11px] text-[#8E929C]">{positiveCount} positive • {penaltyCount} penalty • {alertCount} routing trigger{alertCount === 1 ? "" : "s"}</span>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><ListChecks className="text-[20px]" /></div>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(20,25,40,0.03)]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Average Lead Score</span>
              <div className="flex items-baseline gap-2"><span className="text-[22px] font-bold text-[#151515]">{avgLeadScore.toFixed(1)} <span className="text-[14px] font-normal text-[#8E929C]">/ 100</span></span><span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#0B7A57]"><TrendUp className="text-[12px]" />{avgLeadScore >= 57.6 ? "+" : ""}{(avgLeadScore - 57.6).toFixed(1)} pts</span></div>
              <span className="text-[11px] text-[#8E929C]">Benchmark baseline 57.6 across {sampleLeadScores.length} records</span>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><ChartLineUp className="text-[20px]" /></div>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(20,25,40,0.03)]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">High Intent (Hot) Ratio</span>
              <div className="flex items-baseline gap-2"><span className="text-[22px] font-bold text-[#F04452]">{tierPct.hot}%</span><span className="text-[10px] font-medium text-[#8E929C]">Threshold ≥ {hotStart}</span></div>
              <span className="text-[11px] text-[#8E929C]">Auto-routed directly to SDR calendar sync</span>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FDF2F3] text-[#F04452]"><Fire weight="fill" className="text-[20px]" /></div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-[#F1F2F5] p-1">
            {tabs.map((t) => (
              <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${tab === t.key ? "bg-[#3152F4] text-white shadow-[0_4px_12px_rgba(49,82,244,0.3)]" : "text-[#5E626D] hover:text-[#151515]"}`}>
                <span>{t.label}</span>
                {t.count !== undefined && <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tab === t.key ? "bg-white/20 text-white" : "bg-white text-[#5E626D]"}`}>{t.count}</span>}
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-[#F8F9FC] px-3 py-1 text-[11px] text-[#8E929C] xl:flex"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0B7A57]" />Rules engine syncing live with Widget v2.1</div>
        </div>
      </div>

      {tab === "Questions" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[15px] font-bold text-[#151515]">Qualification Questions</h2>
            <button type="button" onClick={() => setQuestionDialogOpen(true)} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#3152F4] px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(49,82,244,0.28)] hover:opacity-95"><Plus className="text-[15px]" />Create Question</button>
          </div>
          <div className="flex items-center gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><ListChecks weight="duotone" className="text-[22px]" /></div>
            <div className="flex-1"><h3 className="text-[14px] font-semibold text-[#151515]">Qualification at a glance</h3><p className="text-[11px] text-[#8E929C]">{questions.length} question{questions.length === 1 ? "" : "s"} configured · {questions.filter((q) => q.required).length} required</p></div>
            <div className="text-right"><span className="block text-[10px] text-[#8E929C]">Max score</span><strong className="text-[16px] text-[#151515]">100 pts</strong></div>
          </div>
          <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
            <div className="flex items-center justify-between border-b border-[#F1F2F5] px-5 py-4"><h2 className="text-[14px] font-semibold text-[#151515]">Questions &amp; scoring rules</h2></div>
            {questions.map((q, idx) => (
              <div key={q.id} className="flex items-start gap-3 border-b border-[#F1F2F5] px-5 py-4 last:border-0">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#F1F2F5] text-[10px] font-bold text-[#5E626D]">{idx + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-semibold text-[#151515]">{q.label}</span>
                    <span className="rounded-md bg-[#F1F3FF] px-1.5 py-0.5 font-mono text-[10px] text-[#3152F4]">{q.crmField}</span>
                    <span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[10px] font-medium text-[#5E626D]">{q.fieldType}</span>
                    {q.required && <span className="rounded-full bg-[#FEF8EC] px-2 py-0.5 text-[10px] font-semibold text-[#A8590A]">Required</span>}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8E929C]">
                    <span className="flex items-center gap-1 font-medium text-[#0B7A57]"><Target className="text-[12px]" />{q.points}</span>
                    <span className="flex items-center gap-1"><FlowArrow className="text-[12px]" />{q.askCondition}</span>
                  </div>
                </div>
                <button type="button" onClick={() => notify(`${q.label} configuration opened`)} aria-label={`Edit ${q.label}`} className="shrink-0 rounded-lg p-1.5 text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515]"><NotePencil className="text-[15px]" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Scoring Rules" && (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-8">
            <div className="flex flex-col items-stretch gap-3 rounded-2xl bg-white p-3 shadow-[0_2px_8px_rgba(20,25,40,0.02)] md:flex-row md:items-center md:justify-between">
              <div className="relative min-w-[200px] flex-1">
                <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#8E929C]" />
                <input name="ruleSearch" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rules by attribute, condition, or tag..." className="h-9 w-full rounded-xl bg-[#F1F2F5] pl-9 pr-3 text-[12px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                <select name="ruleCategoryFilter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-9 rounded-xl bg-[#F1F2F5] px-3 text-[11px] font-semibold text-[#151515] outline-none">
                  <option value="All Categories">All Categories ({scoringRules.length})</option>
                  {categories.map((c) => <option key={c} value={c}>{c} ({scoringRules.filter((r) => r.category === c).length})</option>)}
                </select>
                <select name="ruleStatusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "paused")} className="h-9 rounded-xl bg-[#F1F2F5] px-3 text-[11px] font-semibold text-[#151515] outline-none">
                  <option value="all">All Statuses</option>
                  <option value="active">Status: Active ({activeCount})</option>
                  <option value="paused">Status: Paused ({scoringRules.length - activeCount})</option>
                </select>
                <button type="button" onClick={() => notify("Rules sorted by priority")} className="flex h-9 items-center gap-1 rounded-xl bg-[#F1F2F5] px-3 text-[11px] font-semibold text-[#5E626D] hover:text-[#151515]"><Funnel className="text-[14px]" />Priority</button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {filteredRules.length === 0 && <div className="rounded-[20px] bg-white p-8 text-center text-[12px] text-[#8E929C] shadow-[0_10px_26px_rgba(20,25,40,0.04)]">No scoring rules match these filters.</div>}
              {filteredRules.map((rule) => {
                const trueIdx = scoringRules.findIndex((r) => r.id === rule.id);
                return (
                  <ScoringRuleCard
                    key={rule.id}
                    rule={rule}
                    priority={trueIdx + 1}
                    reorderMode={reorderMode}
                    canMoveUp={trueIdx > 0}
                    canMoveDown={trueIdx < scoringRules.length - 1}
                    onMoveUp={() => moveRule(rule.id, -1)}
                    onMoveDown={() => moveRule(rule.id, 1)}
                    onToggleActive={() => toggleRuleActive(rule.id)}
                    onEdit={() => openEditRule(rule)}
                    onDuplicate={() => duplicateRule(rule)}
                    onDelete={() => deleteRule(rule)}
                    menuOpen={menuOpenId === rule.id}
                    onToggleMenu={() => setMenuOpenId((cur) => (cur === rule.id ? null : rule.id))}
                  />
                );
              })}
            </div>

            <button type="button" onClick={openCreateRule} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#C4C5D9] bg-white py-3.5 text-[12px] font-semibold text-[#5E626D] hover:border-[#3152F4] hover:text-[#3152F4]"><PlusCircle className="text-[18px]" />Define another automated qualification rule</button>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-4">
            <ClassificationThresholdsCard warmStart={warmStart} hotStart={hotStart} onChangeWarm={setWarmStart} onChangeHot={setHotStart} coldPct={tierPct.cold} warmPct={tierPct.warm} hotPct={tierPct.hot} />
            <TestScoreSimulatorCard scoringRules={scoringRules} warmStart={warmStart} hotStart={hotStart} notify={notify} />
          </div>
        </div>
      )}

      {tab === "Classification Thresholds" && (
        <div className="mx-auto w-full max-w-xl">
          <ClassificationThresholdsCard warmStart={warmStart} hotStart={hotStart} onChangeWarm={setWarmStart} onChangeHot={setHotStart} coldPct={tierPct.cold} warmPct={tierPct.warm} hotPct={tierPct.hot} />
        </div>
      )}

      {tab === "Test Score Sandbox" && (
        <div className="mx-auto w-full max-w-xl">
          <TestScoreSimulatorCard scoringRules={scoringRules} warmStart={warmStart} hotStart={hotStart} notify={notify} />
        </div>
      )}

      {questionDialogOpen && <QualificationQuestionDialog onClose={() => setQuestionDialogOpen(false)} onSave={handleSaveQuestion} />}
      {ruleDialog.open && <ScoringRuleDialog initial={ruleDialog.editing} onClose={() => setRuleDialog({ open: false, editing: null })} onSave={saveRule} />}

      {auditOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button type="button" aria-label="Close audit log" onClick={() => setAuditOpen(false)} className="absolute inset-0 bg-[#151515]/40" />
          <aside className="relative flex h-full w-full max-w-sm flex-col gap-4 overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><ClockCounterClockwise className="text-[18px]" /></span><h2 className="text-[15px] font-bold text-[#151515]">Audit Log</h2></div>
              <button type="button" onClick={() => setAuditOpen(false)} aria-label="Close" className="rounded-lg p-1 text-[#8E929C] hover:bg-[#F1F2F5]"><X className="text-[16px]" /></button>
            </div>
            <div className="flex flex-col gap-2">
              {auditLog.map((entry) => (
                <div key={entry.id} className="flex flex-col gap-0.5 rounded-xl bg-[#F8F9FC] p-3">
                  <span className="text-[12px] font-medium text-[#151515]">{entry.text}</span>
                  <span className="text-[10px] text-[#8E929C]">{entry.time}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

interface InboxMessage {
  id: number;
  from: "visitor" | "ai" | "agent" | "note";
  author: string;
  time: string;
  text: string;
  sources?: string;
}
interface CapturedDetail { label: string; value: string; danger?: boolean; span2?: boolean; }
interface ScoringItem { label: string; points: number; done: boolean; }
interface AiSignal { kind: "info" | "warning"; text: string; }
interface InboxConversation {
  leadId: number;
  status: string;
  liveOn: string | null;
  ip: string;
  browser: string;
  previewTime: string;
  needsHandoff: boolean;
  messages: InboxMessage[];
  aiSummary: string;
  capturedDetails: CapturedDetail[];
  scoringBreakdown: ScoringItem[];
  aiSignals: AiSignal[];
  nextBestAction: string;
}

let inboxMsgIdCounter = 100;

const initialInboxConversations: InboxConversation[] = [
  {
    leadId: 1, status: "AI Active", liveOn: "/ai-automation", ip: "Mumbai", browser: "Chrome/macOS", previewTime: "2m ago", needsHandoff: true,
    messages: [
      { id: inboxMsgIdCounter++, from: "visitor", author: "Olivia Martin", time: "10:14 AM", text: "Hi! We're exploring AI automation for our client intake workflows. How quickly can this be integrated?" },
      { id: inboxMsgIdCounter++, from: "ai", author: "Nova AI", time: "10:15 AM", text: "Hello Olivia! Nova can be integrated into your existing web stack in less than 10 minutes with a single JavaScript tag or via Google Tag Manager. We also support native webhooks and Zapier for intake routing.", sources: "2 sources used: Quickstart Guide (p. 2), Integrations Overview · 99% confidence" },
      { id: inboxMsgIdCounter++, from: "visitor", author: "Olivia Martin", time: "10:17 AM", text: "That's great. What about custom qualification rules based on intake volume and timeline?" },
      { id: inboxMsgIdCounter++, from: "ai", author: "Nova AI", time: "10:18 AM", text: "You can set custom qualification thresholds! For instance, Acme Corp can assign higher scores (+25 pts) to leads with budgets over €200,000 and urgent delivery requirements under 30 days.", sources: "1 source used: Qualification & Scoring Matrix" },
      { id: inboxMsgIdCounter++, from: "visitor", author: "Olivia Martin", time: "10:21 AM", text: "Yes, we need deployment within the next 3 weeks if possible. Our team needs to see a demo." },
      { id: inboxMsgIdCounter++, from: "note", author: "Maya Singh", time: "10:23 AM", text: "High intent enterprise buyer. Fast-tracking demo scheduling. Implementation objection can be addressed with our 48h express onboarding." },
    ],
    aiSummary: "Olivia is seeking autonomous AI workflow automation for Acme Corp's client intake. Strong budget fit (€200K–500K) with an urgent 3-week timeline.",
    capturedDetails: [
      { label: "Company", value: "Acme Corp" },
      { label: "Timeline", value: "< 30 Days (Urgent)", danger: true },
      { label: "Email", value: "olivia.martin@acmecorp.com", span2: true },
      { label: "Phone", value: "+91 98201 44821" },
      { label: "Location", value: "Mumbai, MH (IST)" },
      { label: "Declared Budget", value: "€200,000 – €500,000", span2: true },
    ],
    scoringBreakdown: [
      { label: "Budget verified (> €100,000)", points: 30, done: true },
      { label: "Timeline within 30 days", points: 25, done: true },
      { label: "Decision Maker (VP Ops)", points: 20, done: true },
      { label: "CRM synced (Pending handoff)", points: 0, done: false },
    ],
    aiSignals: [
      { kind: "info", text: "Intent: High (94%)" },
      { kind: "warning", text: "Objection: Implementation Speed" },
    ],
    nextBestAction: "Offer a 30-minute discovery & live intake demo today.",
  },
  {
    leadId: 2, status: "AI Active", liveOn: "/pricing", ip: "San Francisco", browser: "Safari/iOS", previewTime: "14m ago", needsHandoff: true,
    messages: [
      { id: inboxMsgIdCounter++, from: "visitor", author: "Ethan Brooks", time: "9:52 AM", text: "Can Nova sync with HubSpot automatically?" },
      { id: inboxMsgIdCounter++, from: "ai", author: "Nova AI", time: "9:53 AM", text: "Yes — Nova has a native two-way HubSpot integration. Qualified leads and their explainable scores sync to HubSpot contacts in real time, no Zapier required.", sources: "1 source used: Integrations Overview" },
      { id: inboxMsgIdCounter++, from: "visitor", author: "Ethan Brooks", time: "9:55 AM", text: "Does that include custom field mapping for our deal stages?" },
    ],
    aiSummary: "Ethan is validating CRM fit before a technical rollout at Zenith Cloud. Wants confirmation on HubSpot field-level mapping.",
    capturedDetails: [
      { label: "Company", value: "Zenith Cloud" },
      { label: "Timeline", value: "This quarter" },
      { label: "Email", value: "ethan.brooks@zenithcloud.io", span2: true },
      { label: "Phone", value: "+1 415 555 0132" },
      { label: "Location", value: "San Francisco, CA" },
      { label: "Declared Budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "High-intent implementation questions", points: 25, done: true },
      { label: "Requested product walkthrough", points: 20, done: true },
      { label: "Budget confirmed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: High (88%)" }],
    nextBestAction: "Send HubSpot field-mapping guide and offer a technical call.",
  },
  {
    leadId: 3, status: "Queued", liveOn: null, ip: "Singapore", browser: "Chrome/Windows", previewTime: "42m ago", needsHandoff: false,
    messages: [
      { id: inboxMsgIdCounter++, from: "visitor", author: "Sophia Chen", time: "9:31 AM", text: "What are your enterprise security SLAs?" },
      { id: inboxMsgIdCounter++, from: "ai", author: "Nova AI", time: "9:32 AM", text: "Enterprise plans include a 99.9% uptime SLA, SOC 2 Type II compliance, and dedicated data residency options for regulated industries.", sources: "1 source used: Security & Compliance FAQ" },
    ],
    aiSummary: "Sophia runs a growing commerce platform and needs leads separated by service line. Evaluating enterprise security posture before committing.",
    capturedDetails: [
      { label: "Company", value: "FinScale AI" },
      { label: "Timeline", value: "This quarter" },
      { label: "Email", value: "sophia.c@finscale.ai", span2: true },
      { label: "Phone", value: "+65 8123 4477" },
      { label: "Location", value: "Singapore" },
      { label: "Declared Budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "Enterprise account signals", points: 20, done: true },
      { label: "Security review requested", points: 15, done: true },
      { label: "Budget confirmed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: Medium (71%)" }],
    nextBestAction: "Share SOC 2 report and loop in a solutions engineer.",
  },
  {
    leadId: 4, status: "Nurture", liveOn: null, ip: "New York", browser: "Edge/Windows", previewTime: "1h ago", needsHandoff: false,
    messages: [
      { id: inboxMsgIdCounter++, from: "visitor", author: "Liam Wilson", time: "8:58 AM", text: "Just browsing your pricing plans." },
      { id: inboxMsgIdCounter++, from: "ai", author: "Nova AI", time: "8:59 AM", text: "No rush at all! Our Growth plan covers unlimited qualification questions and up to 5,000 conversations a month — happy to send a side-by-side comparison if useful.", sources: "1 source used: Pricing Overview" },
    ],
    aiSummary: "Liam is comparing plans for HyperGrowth. Strong prior fit and buying intent, but technical validation with his platform team is still in progress.",
    capturedDetails: [
      { label: "Company", value: "HyperGrowth" },
      { label: "Timeline", value: "Friday follow-up" },
      { label: "Email", value: "liam@hypergrowth.co", span2: true },
      { label: "Phone", value: "+1 212 555 0110" },
      { label: "Location", value: "New York, NY" },
      { label: "Declared Budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "Repeat visitor (3+ sessions)", points: 15, done: true },
      { label: "Pricing page engagement", points: 10, done: true },
      { label: "Technical validation complete", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: Medium (64%)" }],
    nextBestAction: "Send plan comparison and check in Friday as promised.",
  },
  {
    leadId: 5, status: "Assigned", liveOn: null, ip: "Sydney", browser: "Chrome/Android", previewTime: "3h ago", needsHandoff: false,
    messages: [
      { id: inboxMsgIdCounter++, from: "visitor", author: "David Vance", time: "7:40 AM", text: "Looking for customer onboarding bot." },
      { id: inboxMsgIdCounter++, from: "ai", author: "Nova AI", time: "7:41 AM", text: "Nova can route onboarding conversations by region and hand off automatically once a lead is qualified — want a quick walkthrough of the routing rules?", sources: "1 source used: Routing & Handoff Guide" },
    ],
    aiSummary: "David wants to route buyer enquiries by region for Vance Logistics. Decision timeline is not yet confirmed.",
    capturedDetails: [
      { label: "Company", value: "Vance Logistics" },
      { label: "Timeline", value: "Not confirmed" },
      { label: "Email", value: "david@vancelogistics.com", span2: true },
      { label: "Phone", value: "+61 412 555 018" },
      { label: "Location", value: "Sydney, AU" },
      { label: "Declared Budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "Multi-region requirement", points: 15, done: true },
      { label: "Demo scheduled", points: 15, done: true },
      { label: "Budget confirmed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: Medium (58%)" }],
    nextBestAction: "Confirm demo time and prep a regional routing walkthrough.",
  },
];

const inboxQuickReplies = [
  "Thanks for sharing those details — let me pull together the right resources for you.",
  "Great question — I'll loop in our specialist and follow up within the hour.",
  "Happy to set up a quick call this week if that's easier than chat.",
];

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="relative grid h-16 w-16 shrink-0 place-items-center">
      <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#EDEDF2" strokeWidth="3.5" />
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3152F4" strokeWidth="3.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[17px] font-bold text-[#151515]">{score}</span>
    </div>
  );
}

function InboxPage({ openLead, setSection, notify }: { openLead: (l: Lead) => void; setSection: (v: string) => void; notify: (v: string) => void }) {
  const [conversations, setConversations] = useState<InboxConversation[]>(initialInboxConversations);
  const [selectedLeadId, setSelectedLeadId] = useState(1);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"All" | "Mine" | "Unassigned" | "Handoff">("All");
  const [filterTemps, setFilterTemps] = useState<Set<Temp>>(new Set(["Hot", "Warm", "Cold"]));
  const [filterOpen, setFilterOpen] = useState(false);
  const [replyTab, setReplyTab] = useState<"visitor" | "note">("visitor");
  const [draft, setDraft] = useState("");
  const [quickRepliesOpen, setQuickRepliesOpen] = useState(false);
  const nextMsgId = useRef(200);

  const conversationLeads = useMemo(
    () => conversations.map((c) => ({ conversation: c, lead: leads.find((l) => l.id === c.leadId)! })),
    [conversations],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return conversationLeads.filter(({ conversation, lead }) => {
      if (filterTab === "Mine" && lead.owner !== "Maya Singh") return false;
      if (filterTab === "Unassigned" && lead.owner !== "Unassigned") return false;
      if (filterTab === "Handoff" && !conversation.needsHandoff) return false;
      if (!filterTemps.has(lead.temp)) return false;
      if (!q) return true;
      const lastMessage = conversation.messages[conversation.messages.length - 1]?.text ?? "";
      return [lead.name, lead.company, lastMessage].join(" ").toLowerCase().includes(q);
    });
  }, [conversationLeads, search, filterTab, filterTemps]);

  const selectedConversation = conversations.find((c) => c.leadId === selectedLeadId) ?? conversations[0];
  const selectedLead = leads.find((l) => l.id === selectedConversation.leadId)!;
  const TempIcon = tempStyle[selectedLead.temp].icon;

  const mineCount = conversationLeads.filter((c) => c.lead.owner === "Maya Singh").length;
  const unassignedCount = conversationLeads.filter((c) => c.lead.owner === "Unassigned").length;
  const handoffCount = conversationLeads.filter((c) => c.conversation.needsHandoff).length;

  function updateSelected(mutate: (c: InboxConversation) => InboxConversation) {
    setConversations((cur) => cur.map((c) => (c.leadId === selectedLeadId ? mutate(c) : c)));
  }

  function takeOverChat() {
    updateSelected((c) => ({ ...c, status: "You're handling this chat", liveOn: null }));
    notify(`You took over the chat with ${selectedLead.name}`);
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    if (replyTab === "visitor") {
      updateSelected((c) => ({ ...c, messages: [...c.messages, { id: nextMsgId.current++, from: "agent", author: "Maya Singh", time, text }] }));
      notify("Reply sent");
    } else {
      updateSelected((c) => ({ ...c, messages: [...c.messages, { id: nextMsgId.current++, from: "note", author: "Maya Singh", time, text }] }));
      notify("Internal note added");
    }
    setDraft("");
  }

  function toggleTempFilter(temp: Temp) {
    setFilterTemps((cur) => {
      const next = new Set(cur);
      if (next.has(temp)) next.delete(temp); else next.add(temp);
      return next;
    });
  }

  const filterTabs: { key: "All" | "Mine" | "Unassigned" | "Handoff"; label: string }[] = [
    { key: "All", label: "All" },
    { key: "Mine", label: `Mine (${mineCount})` },
    { key: "Unassigned", label: `Unassigned (${unassignedCount})` },
    { key: "Handoff", label: `Handoff (${handoffCount})` },
  ];

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-bold tracking-tight text-[#151515]">Team Inbox</h1>
            <span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[11px] font-semibold text-[#5E626D]">{conversations.length} Active Sessions</span>
          </div>
          <span className="text-[#C4C5D9]">•</span>
          <div className="flex items-center gap-1.5 rounded-full bg-[#EAEDFB] px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />
            <span className="text-[11px] font-semibold text-[#5E626D]">AI Auto-Triage Online</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setSection("Qualification")} className="flex items-center gap-1.5 rounded-xl bg-[#F1F2F5] px-3 py-1.5 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5]"><Funnel className="text-[16px]" />View Rules</button>
          <div className="relative">
            <button type="button" onClick={() => setFilterOpen((v) => !v)} aria-pressed={filterOpen} className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-semibold ${filterOpen ? "bg-[#3152F4] text-white" : "bg-[#F1F2F5] text-[#151515] hover:bg-[#E5E8F5]"}`}><SlidersHorizontal className="text-[16px]" />Filter Queue</button>
            {filterOpen && (
              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl bg-white p-3 shadow-[0_10px_30px_rgba(20,25,40,0.15)]">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Temperature</span>
                <div className="flex flex-col gap-1.5">
                  {(["Hot", "Warm", "Cold"] as Temp[]).map((temp) => (
                    <label key={temp} className="flex items-center gap-2 text-[12px] font-medium text-[#151515]">
                      <input type="checkbox" name={`tempFilter${temp}`} checked={filterTemps.has(temp)} onChange={() => toggleTempFilter(temp)} className="h-3.5 w-3.5 accent-[#3152F4]" />
                      {temp}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid h-[calc(100vh-14rem)] min-h-[640px] grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:col-span-3">
          <div className="flex shrink-0 flex-col gap-3 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-[#151515]">Conversations</span>
                <span className="rounded-full bg-[#DEE0FF] px-2 py-0.5 text-[11px] font-bold text-[#00105B]">{conversations.length}</span>
              </div>
              <button type="button" onClick={() => notify("Conversations refreshed")} aria-label="Refresh conversations" className="rounded-lg p-1 text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515]"><ArrowClockwise className="text-[16px]" /></button>
            </div>
            <div className="relative">
              <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#8E929C]" />
              <input name="conversationSearch" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations..." className="h-9 w-full rounded-xl bg-[#F1F2F5] pl-9 pr-3 text-[12px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-[#F1F2F5] p-1">
              {filterTabs.map((t) => (
                <button key={t.key} type="button" onClick={() => setFilterTab(t.key)} className={`flex-1 rounded-lg px-1.5 py-1 text-center text-[11px] font-semibold transition-colors ${filterTab === t.key ? "bg-white text-[#151515] shadow-sm" : "text-[#8E929C] hover:text-[#151515]"}`}>{t.label}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-1.5 overflow-y-auto px-2 pb-2">
            {filtered.length === 0 && <p className="px-3 py-6 text-center text-[12px] text-[#8E929C]">No conversations match these filters.</p>}
            {filtered.map(({ conversation, lead }) => {
              const active = lead.id === selectedLeadId;
              const visibleMessages = conversation.messages.filter((m) => m.from !== "note");
              const lastMessage = visibleMessages[visibleMessages.length - 1];
              return (
                <button key={lead.id} type="button" onClick={() => setSelectedLeadId(lead.id)} className={`w-full rounded-xl p-3 text-left transition-all ${active ? "bg-[#F1F3FF] shadow-[inset_0_0_0_1.5px_#3152F4]" : "hover:bg-[#F8F9FC]"}`}>
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      {conversation.liveOn && <span className="h-2 w-2 shrink-0 rounded-full bg-[#3152F4]" />}
                      <span className="truncate text-[13px] font-semibold text-[#151515]">{lead.name}</span>
                      <span className="truncate text-[11px] text-[#8E929C]">{lead.company}</span>
                    </div>
                    <span className="shrink-0 text-[10px] text-[#8E929C]">{conversation.previewTime}</span>
                  </div>
                  <p className="mb-2.5 line-clamp-1 text-[11px] text-[#5E626D]">{lastMessage?.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <TempPill temp={lead.temp} />
                      <span className="rounded bg-[#F1F2F5] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#151515]">Score {lead.score}</span>
                    </div>
                    {lead.owner !== "Unassigned" && lead.owner !== "You" ? (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-[#8E929C]"><span className="grid h-4 w-4 place-items-center rounded-full bg-[#DDE3FF] text-[8px] font-bold text-[#151515]">{lead.owner.split(" ").map((w) => w[0]).join("")}</span>{lead.owner.split(" ")[0]}</span>
                    ) : (
                      <span className="text-[10px] font-medium text-[#8E929C]">{conversation.status}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:col-span-6">
          <div className="flex h-16 shrink-0 items-center justify-between px-5 shadow-[0_2px_10px_rgba(20,25,40,0.02)]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                <span className="grid h-9 w-9 place-items-center rounded-full text-[13px] font-bold text-[#151515]" style={{ background: selectedLead.color }}>{selectedLead.initials}</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#0B7A57] ring-2 ring-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[15px] font-bold text-[#151515]">{selectedLead.name}</span>
                  <span className="truncate text-[11px] text-[#8E929C]">• {selectedLead.company}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  {selectedConversation.liveOn ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-[#E8F8F3] px-2 py-0.5 text-[10px] font-semibold text-[#0B7A57]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0B7A57]" />Live on {selectedConversation.liveOn}</span>
                  ) : (
                    <span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[10px] font-semibold text-[#5E626D]">{selectedConversation.status}</span>
                  )}
                  <span className="text-[10px] text-[#8E929C]">IP: {selectedConversation.ip} • {selectedConversation.browser}</span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl bg-[#F1F2F5] px-2.5 py-1">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#DDE3FF] text-[9px] font-bold text-[#151515]">MS</span>
                <span className="text-[11px] font-semibold text-[#151515]">Maya Singh</span>
              </div>
              <button type="button" onClick={takeOverChat} className="flex items-center gap-1 rounded-xl bg-[#F1F2F5] px-3 py-1.5 text-[12px] font-semibold text-[#151515] hover:bg-[#3152F4] hover:text-white"><ArrowsLeftRight className="text-[15px]" />Take Over Chat</button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[#FAFAFC] p-5">
            <div className="flex justify-center"><span className="rounded-full bg-[#F1F2F5] px-3 py-1 text-[11px] text-[#8E929C]">Session started Today via Widget</span></div>
            {selectedConversation.messages.map((m) => {
              if (m.from === "note") {
                return (
                  <div key={m.id} className="flex items-start gap-3 rounded-xl bg-[#FFFDF0] p-3.5 shadow-sm">
                    <Lock className="mt-0.5 shrink-0 text-[16px] text-[#92400E]" />
                    <div className="flex flex-col gap-0.5 text-[#92400E]">
                      <div className="flex items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-wide">Internal Note</span><span className="text-[10px] opacity-80">• {m.author} ({m.time})</span></div>
                      <p className="text-[12px]">{m.text}</p>
                    </div>
                  </div>
                );
              }
              if (m.from === "visitor") {
                return (
                  <div key={m.id} className="flex max-w-[84%] items-start gap-3">
                    <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-[#151515]" style={{ background: selectedLead.color }}>{selectedLead.initials}</span>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2"><span className="text-[12px] font-semibold text-[#151515]">{m.author}</span><span className="text-[10px] text-[#8E929C]">{m.time}</span></div>
                      <div className="rounded-2xl rounded-tl-sm bg-white p-3.5 text-[13px] text-[#151515] shadow-sm">{m.text}</div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={m.id} className="ml-auto flex max-w-[88%] flex-row-reverse items-start gap-3">
                  <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#151515] shadow-sm">
                    {m.from === "ai" ? <Sparkle className="text-[15px] text-white" /> : <span className="text-[10px] font-bold text-white">MS</span>}
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2"><span className="text-[10px] text-[#8E929C]">{m.time}</span><span className="text-[12px] font-semibold text-[#3152F4]">{m.author}</span></div>
                    <div className="rounded-2xl rounded-tr-sm bg-[#3152F4] p-3.5 text-[13px] text-white shadow-md">
                      <p>{m.text}</p>
                      {m.sources && <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-white/75"><Sparkle className="text-[12px]" />{m.sources}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 p-4 shadow-[0_-4px_16px_rgba(20,25,40,0.03)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 rounded-lg bg-[#F1F2F5] p-1">
                <button type="button" onClick={() => setReplyTab("visitor")} className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${replyTab === "visitor" ? "bg-[#3152F4] text-white shadow-sm" : "text-[#8E929C] hover:text-[#151515]"}`}>Reply to Visitor</button>
                <button type="button" onClick={() => setReplyTab("note")} className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${replyTab === "note" ? "bg-[#3152F4] text-white shadow-sm" : "text-[#8E929C] hover:text-[#151515]"}`}>Internal Note</button>
              </div>
              <span className="text-[11px] text-[#8E929C]">Enter to send, Shift + Enter for new line</span>
            </div>
            <textarea
              name="inboxReplyDraft"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={replyTab === "visitor" ? `Type your reply to ${selectedLead.name}... (Shift + Enter for new line)` : "Add an internal note visible only to your team..."}
              rows={3}
              className="w-full resize-none rounded-xl bg-[#F1F2F5] p-3 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="relative">
                  <button type="button" onClick={() => setQuickRepliesOpen((v) => !v)} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#151515] hover:bg-[#F1F2F5]"><Lightning className="text-[15px] text-[#3152F4]" />Quick Replies</button>
                  {quickRepliesOpen && (
                    <div className="absolute bottom-9 left-0 z-20 w-72 rounded-xl bg-white p-2 shadow-[0_10px_30px_rgba(20,25,40,0.15)]">
                      {inboxQuickReplies.map((reply) => (
                        <button key={reply} type="button" onClick={() => { setDraft(reply); setQuickRepliesOpen(false); }} className="block w-full rounded-lg px-2.5 py-2 text-left text-[11px] text-[#151515] hover:bg-[#F1F2F5]">{reply}</button>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => notify("Attachment picker opened")} aria-label="Attach file" className="rounded-lg p-1.5 text-[#8E929C] hover:bg-[#F1F2F5]"><Paperclip className="text-[16px]" /></button>
                <button type="button" onClick={() => setDraft((cur) => `${cur}🙂`)} aria-label="Add emoji" className="rounded-lg p-1.5 text-[#8E929C] hover:bg-[#F1F2F5]"><Smiley className="text-[16px]" /></button>
              </div>
              <button type="button" onClick={sendMessage} className="flex items-center gap-2 rounded-xl bg-[#3152F4] px-4 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(49,82,244,0.3)] hover:opacity-95"><span>{replyTab === "visitor" ? "Send Reply" : "Add Note"}</span><PaperPlaneRight className="text-[16px]" /></button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:col-span-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold text-[#151515]">Lead Intelligence</span>
            <span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[10px] font-semibold text-[#5E626D]">ID: #LD-{8000 + selectedLead.id}</span>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl bg-[#F8F9FC] p-3.5">
            <ScoreRing score={selectedLead.score} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Lead Qualification</span>
              <span className={`mt-0.5 flex items-center gap-1 text-[13px] font-bold ${tempStyle[selectedLead.temp].text}`}>
                <TempIcon weight="fill" className="text-[14px]" />
                {selectedLead.temp} Lead • {selectedLead.temp === "Hot" ? "Immediate Priority" : selectedLead.temp === "Warm" ? "Active Nurture" : "Long-Term Nurture"}
              </span>
              <span className="mt-1 text-[10px] text-[#8E929C]">Autonomous score updated 2m ago</span>
            </div>
          </div>

          <div className="space-y-1 rounded-xl bg-[#F1F2F5] p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#3152F4]"><Brain className="text-[14px]" />AI Executive Summary</div>
            <p className="text-[12px] text-[#151515]">{selectedConversation.aiSummary}</p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Captured Details</span>
            <div className="grid grid-cols-2 gap-2">
              {selectedConversation.capturedDetails.map((d) => (
                <div key={d.label} className={`rounded-lg bg-[#F8F9FC] p-2 ${d.span2 ? "col-span-2" : ""}`}>
                  <span className="block text-[10px] text-[#8E929C]">{d.label}</span>
                  <span className={`block truncate text-[12px] font-semibold ${d.danger ? "text-[#F04452]" : "text-[#151515]"}`}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Scoring Breakdown</span>
            <div className="space-y-1.5">
              {selectedConversation.scoringBreakdown.map((s) => (
                <div key={s.label} className={`flex items-center justify-between rounded-lg bg-[#F8F9FC] p-2 text-[12px] ${s.done ? "" : "opacity-60"}`}>
                  <div className={`flex items-center gap-2 ${s.done ? "text-[#0B7A57]" : "text-[#8E929C]"}`}>
                    {s.done ? <CheckCircle weight="fill" className="text-[15px]" /> : <Circle className="text-[15px]" />}
                    <span className="text-[#151515]">{s.label}</span>
                  </div>
                  <span className={`text-[11px] font-bold ${s.done ? "text-[#0B7A57]" : "text-[#8E929C]"}`}>+{s.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">AI Signals</span>
            <div className="flex flex-wrap gap-2">
              {selectedConversation.aiSignals.map((s) => (
                <span key={s.text} className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${s.kind === "warning" ? "bg-[#FEF8EC] text-[#A8590A]" : "bg-[#F1F2F5] text-[#151515]"}`}>
                  {s.kind === "warning" ? <Warning className="text-[13px]" /> : <span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />}
                  {s.text}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1 rounded-xl bg-[#DEE0FF] p-3 text-[#00105B]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase"><Lightning className="text-[14px]" />Next Best Action</div>
            <p className="text-[12px]">{selectedConversation.nextBestAction}</p>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button type="button" onClick={() => notify(`Follow-up scheduled for ${selectedLead.name}`)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3152F4] px-3 py-2 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(49,82,244,0.25)] hover:opacity-95"><CalendarCheck className="text-[16px]" />Schedule Follow-up</button>
            <button type="button" onClick={() => openLead(selectedLead)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F1F2F5] px-3 py-2 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5]"><span>Open Lead Profile</span><ArrowSquareOut className="text-[14px]" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

type SourceTypeKey = "crawl" | "webpage" | "upload" | "faq" | "product" | "text";

const knowledgeSourceTypes: { key: SourceTypeKey; label: string; desc: string; icon: typeof Globe }[] = [
  { key: "crawl", label: "Crawl Website", desc: "Deep crawl domain or sub-paths", icon: Globe },
  { key: "webpage", label: "Add Webpage", desc: "Single URL snapshot or article", icon: LinkSimple },
  { key: "upload", label: "Upload Document", desc: "PDF, DOCX, CSV, Markdown", icon: UploadSimple },
  { key: "faq", label: "Create FAQ", desc: "Q&A question-answer pairs", icon: Question },
  { key: "product", label: "Product / Service", desc: "Service specs & tier limits", icon: Package },
  { key: "text", label: "Paste Text", desc: "Raw markdown or plain copy", icon: TextAlignLeft },
];

interface DiscoveredPage {
  id: number;
  title: string;
  meta: string;
  path: string;
  words: number;
  specIcon: typeof FileText;
  thin: boolean;
  selected: boolean;
}

const initialDiscoveredPages: DiscoveredPage[] = [
  { id: 1, title: "AI Automation & Custom Workflow Sprints", meta: "Core service overview with integration deliverables", path: "/services/ai-automation", words: 1840, specIcon: FileText, thin: false, selected: true },
  { id: 2, title: "Enterprise CRM Integration Solutions", meta: "Salesforce, HubSpot, and custom webhook architecture", path: "/services/crm-sync", words: 2410, specIcon: FileText, thin: false, selected: true },
  { id: 3, title: "Pricing Sprints & SLA Guarantee", meta: "Tier breakdown, implementation retainers, milestone terms", path: "/services/pricing", words: 940, specIcon: Table, thin: false, selected: true },
  { id: 4, title: "Client Case Studies & ROI Benchmarks", meta: "Fintech conversion lifts & case study metrics", path: "/case-studies/fintech-scale", words: 1420, specIcon: ChartBar, thin: false, selected: true },
  { id: 5, title: "Consultation Request Confirmation", meta: "Thank-you redirect form submission screen", path: "/services/confirmation", words: 118, specIcon: TextAa, thin: true, selected: false },
];

const maxDepthOptions = ["Depth 1 (Homepage + direct links only)", "Depth 3 (Standard site structure)", "Depth 5 (Comprehensive directory scan)"];
const depthPageBase: Record<string, number> = { [maxDepthOptions[0]]: 9, [maxDepthOptions[1]]: 28, [maxDepthOptions[2]]: 52 };
const pageLimitOptions = ["25 pages", "50 pages (Recommended)", "100 pages (Max on current plan)"];

function TagChipInput({ tags, onAdd, onRemove, placeholder, tone = "neutral", name }: { tags: string[]; onAdd: (v: string) => void; onRemove: (idx: number) => void; placeholder: string; tone?: "neutral" | "muted"; name: string }) {
  const [draft, setDraft] = useState("");
  function commit() {
    const v = draft.trim();
    if (!v) return;
    onAdd(v);
    setDraft("");
  }
  return (
    <div className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-xl bg-[#F1F2F5] p-2">
      {tags.map((tag, idx) => (
        <span key={`${tag}-${idx}`} className={`inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 font-mono text-[11px] font-semibold shadow-sm ${tone === "muted" ? "text-[#8E929C]" : "text-[#151515]"}`}>
          {tag}
          <button type="button" onClick={() => onRemove(idx)} aria-label={`Remove ${tag}`} className="text-[#8E929C] hover:text-[#F04452]"><X className="text-[12px]" /></button>
        </span>
      ))}
      <input
        name={name}
        aria-label={placeholder}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
        onBlur={commit}
        placeholder={placeholder}
        className="w-20 flex-1 bg-transparent px-1 text-[11px] text-[#151515] outline-none"
      />
    </div>
  );
}

function AddKnowledgeSourcePage({ onCancel, onImport, notify }: { onCancel: () => void; onImport: (entries: { title: string; text: string }[]) => void; notify: (v: string) => void }) {
  const [activeType, setActiveType] = useState<SourceTypeKey>("crawl");

  const [targetUrl, setTargetUrl] = useState("https://ailqs.com/services");
  const [includePatterns, setIncludePatterns] = useState(["services/*", "case-studies/*", "pricing/*"]);
  const [excludePatterns, setExcludePatterns] = useState(["blog/tag/*", "login*", "privacy*"]);
  const [maxDepth, setMaxDepth] = useState(maxDepthOptions[1]);
  const [pageLimit, setPageLimit] = useState(pageLimitOptions[1]);
  const [manualReview, setManualReview] = useState(true);
  const [followSubdomains, setFollowSubdomains] = useState(false);
  const [scanNonce, setScanNonce] = useState(0);
  const [lastScanned, setLastScanned] = useState("2 minutes ago");
  const [discoveredPages, setDiscoveredPages] = useState<DiscoveredPage[]>(initialDiscoveredPages);
  const [pageSearch, setPageSearch] = useState("");

  const allowedDomain = useMemo(() => {
    try { return new URL(targetUrl).hostname || "ailqs.com"; } catch { return "ailqs.com"; }
  }, [targetUrl]);

  const pageLimitCap = useMemo(() => Number(pageLimit.match(/\d+/)?.[0] ?? 50), [pageLimit]);
  const pagesDetected = useMemo(() => Math.min(pageLimitCap, depthPageBase[maxDepth] + (scanNonce % 3)), [maxDepth, pageLimitCap, scanNonce]);
  const purity = Math.min(99, 80 + includePatterns.length * 2);
  const tokenVolume = Math.round(pagesDetected * (46200 / 28));
  const vectorChunks = Math.round(pagesDetected * (124 / 28));
  const estimatedSeconds = Math.max(5, Math.round(pagesDetected * (75 / 28)));
  const estimatedTimeLabel = `${Math.floor(estimatedSeconds / 60)}m ${estimatedSeconds % 60}s`;
  const readinessCurrent = 92;
  const readinessImpact = Number(((pagesDetected / 28) * 4).toFixed(1));
  const readinessProjected = Math.min(100, readinessCurrent + readinessImpact);

  const filteredPages = useMemo(() => {
    const q = pageSearch.trim().toLowerCase();
    if (!q) return discoveredPages;
    return discoveredPages.filter((p) => [p.title, p.path, p.meta].join(" ").toLowerCase().includes(q));
  }, [discoveredPages, pageSearch]);

  const selectedCount = discoveredPages.filter((p) => p.selected).length;
  const thinExcluded = discoveredPages.filter((p) => p.thin && !p.selected).length;
  const allChecked = discoveredPages.length > 0 && discoveredPages.every((p) => p.selected);

  function toggleAll() {
    setDiscoveredPages((cur) => cur.map((p) => ({ ...p, selected: !allChecked })));
  }
  function togglePage(id: number) {
    setDiscoveredPages((cur) => cur.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)));
  }
  function removePage(id: number) {
    setDiscoveredPages((cur) => cur.filter((p) => p.id !== id));
    notify("Page removed from crawl scope");
  }
  function excludeSelected() {
    setDiscoveredPages((cur) => cur.map((p) => (p.selected ? { ...p, selected: false } : p)));
    notify("Selected pages excluded from import");
  }
  function resetToDefault() {
    setDiscoveredPages(initialDiscoveredPages);
    setPageSearch("");
    notify("Discovered pages reset to default");
  }
  function rescanSitemap() {
    setScanNonce((n) => n + 1);
    setLastScanned("Just now");
    notify("Sitemap re-scanned");
  }
  function importCrawl() {
    if (selectedCount === 0) { notify("Select at least one page to import"); return; }
    onImport([{ title: `Crawl: ${allowedDomain}`, text: `${selectedCount} pages imported · ~${tokenVolume.toLocaleString()} tokens indexed` }]);
    notify(`${selectedCount} pages imported from ${allowedDomain}`);
  }

  const activeMeta = knowledgeSourceTypes.find((t) => t.key === activeType)!;

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#8E929C]">
            <button type="button" onClick={onCancel} className="hover:text-[#151515]">Knowledge Base</button>
            <CaretRight className="text-[11px]" />
            <span>Add Source</span>
            <CaretRight className="text-[11px]" />
            <span className="font-semibold text-[#3152F4]">{activeMeta.label}</span>
          </div>
          <h1 className="text-[24px] font-bold tracking-tight text-[#151515]">Add Knowledge Source</h1>
          <p className="max-w-2xl text-[12px] text-[#8E929C]">Expand Nova's training context by crawling websites, uploading documents, or curating structured knowledge.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-[#5E626D] hover:bg-[#F1F2F5]">Cancel</button>
          <button type="button" onClick={() => notify("Draft saved")} className="rounded-xl bg-[#F1F2F5] px-4 py-2 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#E5E8F5]">Save Draft</button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wide text-[#8E929C]">Select Source Type</span>
          <span className="text-[11px] text-[#8E929C]">6 integration vectors available</span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {knowledgeSourceTypes.map((t) => {
            const Icon = t.icon;
            const active = t.key === activeType;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveType(t.key)}
                className={`group relative flex flex-col rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 ${active ? "bg-[#F1F3FF] shadow-[0_8px_24px_rgba(49,82,244,0.12)]" : "bg-white shadow-[0_4px_16px_rgba(20,25,40,0.03)] hover:bg-[#F8F9FC]"}`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className={`grid h-9 w-9 place-items-center rounded-xl shadow-sm ${active ? "bg-[#3152F4] text-white" : "bg-[#F1F2F5] text-[#151515] group-hover:bg-[#3152F4] group-hover:text-white"}`}><Icon className="text-[18px]" /></div>
                  {active ? <span className="grid h-5 w-5 place-items-center rounded-full bg-[#3152F4] text-white shadow-sm"><Check weight="bold" className="text-[11px]" /></span> : <span className="h-2 w-2 rounded-full bg-[#EDEDF2]" />}
                </div>
                <span className={`text-[14px] font-semibold ${active ? "text-[#3152F4]" : "text-[#151515] group-hover:text-[#3152F4]"}`}>{t.label}</span>
                <span className="mt-1 text-[11px] text-[#8E929C]">{t.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeType === "crawl" && (
        <>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:col-span-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-[#3152F4] p-1.5 text-white"><GearSix className="text-[16px]" /></div>
                  <h2 className="text-[15px] font-semibold text-[#151515]">Crawl Parameters &amp; Scope</h2>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-[#E8F8F3] px-2.5 py-1 text-[11px] font-bold text-[#0B7A57]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />Production Engine</span>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold text-[#151515]">Target Root or Sub-directory URL</span>
                <div className="flex items-center gap-2 rounded-xl bg-[#F1F2F5] px-3 py-1.5 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3152F4]/25">
                  <span className="mr-1 rounded-lg bg-[#E5E8F5] px-2 py-1 font-mono text-[10px] font-bold text-[#3152F4]">HTTPS</span>
                  <input name="crawlTargetUrl" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="e.g. https://yourdomain.com/docs" className="flex-1 bg-transparent py-1.5 text-[13px] text-[#151515] outline-none" />
                  <CheckCircle weight="fill" className="shrink-0 text-[18px] text-[#0B7A57]" />
                </div>
              </label>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between"><span className="text-[13px] font-semibold text-[#151515]">Allowed Domain / Host</span><span className="text-[11px] text-[#8E929C]">Lock crawler boundaries</span></div>
                <div className="flex items-center gap-2 rounded-xl bg-[#F1F2F5] px-3 py-2.5 text-[13px] text-[#151515]"><Lock className="text-[16px] text-[#8E929C]" /><span className="font-semibold">{allowedDomain}</span><span className="text-[11px] text-[#8E929C]">(and sub-paths)</span></div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-[#151515]">Include URL Patterns</span><span className="text-[10px] text-[#8E929C]">Glob syntax</span></div>
                  <TagChipInput name="includeUrlPattern" tags={includePatterns} onAdd={(v) => setIncludePatterns((cur) => [...cur, v])} onRemove={(idx) => setIncludePatterns((cur) => cur.filter((_, i) => i !== idx))} placeholder="+ Add path" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-[#151515]">Exclude URL Patterns</span><span className="text-[10px] text-[#8E929C]">Omit noise</span></div>
                  <TagChipInput name="excludeUrlPattern" tags={excludePatterns} onAdd={(v) => setExcludePatterns((cur) => [...cur, v])} onRemove={(idx) => setExcludePatterns((cur) => cur.filter((_, i) => i !== idx))} placeholder="+ Exclude" tone="muted" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-[12px] font-semibold text-[#151515]">Max Crawl Depth</span>
                  <select name="crawlMaxDepth" value={maxDepth} onChange={(e) => setMaxDepth(e.target.value)} className="rounded-xl bg-[#F1F2F5] px-3 py-2.5 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/25">
                    {maxDepthOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-[#151515]">Page Crawl Limit</span><span className="text-[10px] font-semibold text-[#3152F4]">Starter Cap: 100</span></div>
                  <select name="crawlPageLimit" value={pageLimit} onChange={(e) => setPageLimit(e.target.value)} className="rounded-xl bg-[#F1F2F5] px-3 py-2.5 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/25">
                    {pageLimitOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </label>
              </div>

              <div className="flex flex-col gap-3 pt-1">
                <div className="flex items-start justify-between gap-4 rounded-xl bg-[#F1F2F5] p-3.5">
                  <div className="flex flex-col"><span className="text-[13px] font-semibold text-[#151515]">Manual review before indexing &amp; publishing</span><span className="mt-0.5 text-[11px] text-[#8E929C]">Discovered pages will require confirmation before vector embeddings are generated.</span></div>
                  <ToggleSwitch checked={manualReview} onChange={() => setManualReview((v) => !v)} label="Manual review before indexing" />
                </div>
                <div className="flex items-start justify-between gap-4 rounded-xl bg-[#F1F2F5] p-3.5">
                  <div className="flex flex-col"><span className="text-[13px] font-semibold text-[#151515]">Follow subdomains</span><span className="mt-0.5 text-[11px] text-[#8E929C]">Includes host prefixes like <span className="font-mono">docs.{allowedDomain}</span> or <span className="font-mono">app.*</span></span></div>
                  <ToggleSwitch checked={followSubdomains} onChange={() => setFollowSubdomains((v) => !v)} label="Follow subdomains" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="flex flex-col gap-5 rounded-2xl bg-[linear-gradient(155deg,#242424_0%,#121212_100%)] p-6 text-white shadow-[0_16px_36px_rgba(15,15,20,0.22)]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#A0A4AE]"><Gauge className="text-[16px] text-[#58DDAC]" />Crawl Scope &amp; Estimation</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white">Pre-Flight</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[36px] font-extrabold leading-none tracking-tight">{pagesDetected}</span>
                    <p className="mt-1.5 text-[11px] text-[#A0A4AE]">Pages detected from sitemap.xml &amp; link hierarchy</p>
                  </div>
                  <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/5">
                    <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3.5" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#58DDAC" strokeWidth="3.5" strokeDasharray={`${purity}, 100`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-[11px] font-bold text-white">{purity}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 p-3"><span className="text-[10px] text-[#A0A4AE]">Token Volume</span><div className="mt-0.5 text-[16px] font-bold text-white">~{tokenVolume.toLocaleString()}</div><span className="text-[10px] text-white/60">{vectorChunks} vector chunks</span></div>
                  <div className="rounded-xl bg-white/5 p-3"><span className="text-[10px] text-[#A0A4AE]">Estimated Time</span><div className="mt-0.5 text-[16px] font-bold text-white">{estimatedTimeLabel}</div><span className="text-[10px] text-[#58DDAC]">Instant background execution</span></div>
                </div>
                <div className="flex flex-col gap-2 rounded-xl bg-white/5 p-3.5">
                  <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-white">Knowledge Readiness Impact</span><span className="text-[12px] font-bold text-[#58DDAC]">+{readinessImpact.toFixed(1)}%</span></div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-white/40" style={{ width: `${readinessCurrent}%` }} />
                    <div className="h-full bg-[#58DDAC]" style={{ width: `${readinessImpact}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#A0A4AE]"><span>Current: {readinessCurrent}%</span><span className="text-white">Projected: {readinessProjected.toFixed(1)}%</span></div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1.5 text-[11px] text-[#A0A4AE]"><span className="h-2 w-2 rounded-full bg-[#58DDAC]" />Scanned {lastScanned}</span>
                  <button type="button" onClick={rescanSitemap} className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-white/20"><ArrowClockwise className="text-[13px]" />Re-scan Sitemap</button>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-[#F1F2F5] p-4">
                <Brain className="mt-0.5 shrink-0 text-[20px] text-[#3152F4]" />
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-semibold text-[#151515]">High-Intent Triage Optimization</span>
                  <p className="text-[11px] leading-relaxed text-[#8E929C]">Nova prioritizes high-intent product specifications, pricing matrices, and case studies to answer inbound visitor queries with maximum confidence and precision.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
            <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-[15px] font-semibold text-[#151515]">Discovered Pages Review</h3>
                <span className="rounded-full bg-[#F1F3FF] px-2.5 py-0.5 text-[11px] font-bold text-[#3152F4]">{selectedCount} of {discoveredPages.length} Selected</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative min-w-[220px]">
                  <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[#8E929C]" />
                  <input name="discoveredPageSearch" value={pageSearch} onChange={(e) => setPageSearch(e.target.value)} placeholder="Filter discovered URLs..." className="h-8 w-full rounded-lg bg-[#F1F2F5] pl-8 pr-3 text-[11px] text-[#151515] outline-none focus:bg-white focus:ring-1 focus:ring-[#3152F4]/30" />
                </div>
                <button type="button" onClick={excludeSelected} className="flex h-8 items-center gap-1.5 rounded-lg bg-[#F1F2F5] px-3 text-[11px] font-semibold text-[#151515] hover:bg-[#E5E8F5]"><Funnel className="text-[13px] text-[#8E929C]" />Exclude Selected</button>
                <button type="button" onClick={resetToDefault} className="flex h-8 items-center rounded-lg px-3 text-[11px] font-semibold text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515]">Reset to Default</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8F9FC] text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">
                    <th className="w-10 px-4 py-3"><input type="checkbox" name="selectAllDiscoveredPages" checked={allChecked} onChange={toggleAll} aria-label="Select all discovered pages" className="h-4 w-4 accent-[#3152F4]" /></th>
                    <th className="px-4 py-3">Page Title &amp; Document Meta</th>
                    <th className="px-4 py-3">Route / Path</th>
                    <th className="px-4 py-3">Content Spec</th>
                    <th className="px-4 py-3">Vector Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F2F5] text-[13px] text-[#151515]">
                  {filteredPages.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-[12px] text-[#8E929C]">No discovered pages match this filter.</td></tr>
                  )}
                  {filteredPages.map((page) => {
                    const SpecIcon = page.specIcon;
                    return (
                      <tr key={page.id} className={`group transition-colors hover:bg-[#F8F9FC] ${page.thin ? "bg-[#FAFAFC]" : ""}`}>
                        <td className="px-4 py-3.5"><input type="checkbox" name={`selectPage-${page.id}`} checked={page.selected} onChange={() => togglePage(page.id)} aria-label={`Select ${page.title}`} className="h-4 w-4 accent-[#3152F4]" /></td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col">
                            <span className={`text-[13px] font-semibold group-hover:text-[#3152F4] ${page.thin ? "text-[#8E929C]" : "text-[#151515]"}`}>{page.title}</span>
                            <span className="text-[11px] text-[#8E929C]">{page.meta}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5"><span className="rounded bg-[#F1F2F5] px-2 py-1 font-mono text-[10px] text-[#8E929C]">{page.path}</span></td>
                        <td className="px-4 py-3.5"><span className="flex items-center gap-1.5 text-[11px] font-medium text-[#5E626D]"><SpecIcon className="text-[14px] text-[#8E929C]" />{page.words.toLocaleString()} words</span></td>
                        <td className="px-4 py-3.5">
                          {page.thin ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF8EC] px-2.5 py-1 text-[10px] font-semibold text-[#A8590A]"><span className="h-1.5 w-1.5 rounded-full bg-[#F5A524]" />Warning: Thin Content (&lt;200 words)</span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F8F3] px-2.5 py-1 text-[10px] font-semibold text-[#0B7A57]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />Ready for Ingestion</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button type="button" onClick={() => notify(`Preview opened for "${page.title}"`)} aria-label={`Preview ${page.title}`} className="rounded-lg p-1 text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#3152F4]"><Eye className="text-[16px]" /></button>
                            <button type="button" onClick={() => removePage(page.id)} aria-label={`Remove ${page.title}`} className="rounded-lg p-1 text-[#8E929C] hover:bg-[#FDF2F3] hover:text-[#F04452]"><Trash className="text-[16px]" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 bg-[#F8F9FC] p-4 px-6 sm:flex-row">
              <div className="flex items-center gap-2 text-[11px] text-[#8E929C]">
                <span>Showing <b className="text-[#151515]">{filteredPages.length}</b> of <b className="text-[#151515]">{pagesDetected}</b> discovered pages</span>
                <span className="text-[#C4C5D9]">•</span>
                <span className="rounded bg-[#F1F2F5] px-2 py-0.5 font-medium text-[#8E929C]">{thinExcluded} excluded (thin content)</span>
              </div>
              <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
                <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-[#151515] hover:bg-[#F1F2F5]">Back to Knowledge Base</button>
                <button type="button" onClick={importCrawl} className="flex items-center gap-2 rounded-xl bg-[#3152F4] px-5 py-2.5 text-[12px] font-bold text-white shadow-[0_8px_20px_rgba(49,82,244,0.28)] hover:-translate-y-0.5 hover:opacity-95"><Sparkle className="text-[16px]" />Import {selectedCount} Pages</button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeType === "webpage" && <AddWebpageForm onCancel={onCancel} onImport={onImport} notify={notify} />}
      {activeType === "upload" && <UploadDocumentForm onCancel={onCancel} onImport={onImport} notify={notify} />}
      {activeType === "faq" && <CreateFaqForm onCancel={onCancel} onImport={onImport} notify={notify} />}
      {activeType === "product" && <ProductServiceForm onCancel={onCancel} onImport={onImport} notify={notify} />}
      {activeType === "text" && <PasteTextForm onCancel={onCancel} onImport={onImport} notify={notify} />}
    </div>
  );
}

type SimpleSourceFormProps = { onCancel: () => void; onImport: (entries: { title: string; text: string }[]) => void; notify: (v: string) => void };

function AddWebpageForm({ onCancel, onImport, notify }: SimpleSourceFormProps) {
  const [url, setUrl] = useState("");
  const [fetched, setFetched] = useState<string | null>(null);

  function fetchPreview() {
    if (!url.trim()) { notify("Enter a URL to fetch"); return; }
    setFetched(`Snapshot captured: ${url.trim()}`);
    notify("Webpage snapshot fetched");
  }
  function addSource() {
    if (!fetched) { notify("Fetch a preview before adding"); return; }
    onImport([{ title: url.trim(), text: "Single webpage snapshot · Ready for Ingestion" }]);
    notify("Webpage added to knowledge base");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
      <div className="flex items-center gap-2.5"><div className="rounded-lg bg-[#3152F4] p-1.5 text-white"><LinkSimple className="text-[16px]" /></div><h2 className="text-[15px] font-semibold text-[#151515]">Add Webpage</h2></div>
      <label className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold text-[#151515]">Page URL</span>
        <div className="flex items-center gap-2 rounded-xl bg-[#F1F2F5] px-3 py-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3152F4]/25">
          <input name="webpageUrl" value={url} onChange={(e) => { setUrl(e.target.value); setFetched(null); }} placeholder="https://yourdomain.com/article" className="flex-1 bg-transparent py-1.5 text-[13px] text-[#151515] outline-none" />
          <button type="button" onClick={fetchPreview} className="rounded-lg bg-[#3152F4] px-3 py-1.5 text-[11px] font-semibold text-white hover:opacity-95">Fetch Preview</button>
        </div>
      </label>
      {fetched && <div className="flex items-center gap-2 rounded-xl bg-[#E8F8F3] px-3 py-2.5 text-[12px] font-medium text-[#0B7A57]"><CheckCircle weight="fill" className="text-[16px]" />{fetched}</div>}
      <div className="mt-1 flex items-center justify-end gap-2 border-t border-[#F1F2F5] pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-[#5E626D] hover:bg-[#F1F2F5]">Cancel</button>
        <button type="button" onClick={addSource} className="rounded-xl bg-[#3152F4] px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(49,82,244,0.3)] hover:opacity-95">Add Source</button>
      </div>
    </div>
  );
}

function UploadDocumentForm({ onCancel, onImport, notify }: SimpleSourceFormProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function addSource() {
    if (!fileName) { notify("Choose a file before adding"); return; }
    onImport([{ title: fileName, text: "Uploaded document · Ready for Ingestion" }]);
    notify(`${fileName} added to knowledge base`);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
      <div className="flex items-center gap-2.5"><div className="rounded-lg bg-[#3152F4] p-1.5 text-white"><UploadSimple className="text-[16px]" /></div><h2 className="text-[15px] font-semibold text-[#151515]">Upload Document</h2></div>
      <button type="button" onClick={() => inputRef.current?.click()} className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#C4C5D9] bg-[#F8F9FC] py-10 text-center hover:border-[#3152F4] hover:bg-[#F1F3FF]">
        <UploadSimple className="text-[28px] text-[#3152F4]" />
        <span className="text-[13px] font-semibold text-[#151515]">{fileName ?? "Click to choose a file"}</span>
        <span className="text-[11px] text-[#8E929C]">PDF, DOCX, CSV, or Markdown</span>
      </button>
      <input ref={inputRef} type="file" name="knowledgeDocumentUpload" aria-label="Upload document" accept=".pdf,.doc,.docx,.csv,.md" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
      <div className="mt-1 flex items-center justify-end gap-2 border-t border-[#F1F2F5] pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-[#5E626D] hover:bg-[#F1F2F5]">Cancel</button>
        <button type="button" onClick={addSource} className="rounded-xl bg-[#3152F4] px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(49,82,244,0.3)] hover:opacity-95">Add Source</button>
      </div>
    </div>
  );
}

function CreateFaqForm({ onCancel, onImport, notify }: SimpleSourceFormProps) {
  const [pairs, setPairs] = useState<{ q: string; a: string }[]>([{ q: "", a: "" }]);

  function updatePair(idx: number, field: "q" | "a", value: string) {
    setPairs((cur) => cur.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  }
  function addPair() { setPairs((cur) => [...cur, { q: "", a: "" }]); }
  function removePair(idx: number) { setPairs((cur) => cur.filter((_, i) => i !== idx)); }
  function addSource() {
    const filled = pairs.filter((p) => p.q.trim() && p.a.trim());
    if (filled.length === 0) { notify("Add at least one complete Q&A pair"); return; }
    onImport([{ title: `FAQ set (${filled.length} pairs)`, text: "Manually curated question-answer pairs" }]);
    notify("FAQ set added to knowledge base");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
      <div className="flex items-center gap-2.5"><div className="rounded-lg bg-[#3152F4] p-1.5 text-white"><Question className="text-[16px]" /></div><h2 className="text-[15px] font-semibold text-[#151515]">Create FAQ</h2></div>
      <div className="flex flex-col gap-3">
        {pairs.map((pair, idx) => (
          <div key={idx} className="flex flex-col gap-2 rounded-xl bg-[#F8F9FC] p-3">
            <div className="flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-wide text-[#8E929C]">Pair {idx + 1}</span>{pairs.length > 1 && <button type="button" onClick={() => removePair(idx)} aria-label={`Remove pair ${idx + 1}`} className="text-[#8E929C] hover:text-[#F04452]"><Trash className="text-[13px]" /></button>}</div>
            <input name={`faqQuestion-${idx}`} value={pair.q} onChange={(e) => updatePair(idx, "q", e.target.value)} placeholder="Question" className="rounded-lg bg-white px-2.5 py-2 text-[12px] text-[#151515] shadow-sm outline-none focus:ring-2 focus:ring-[#3152F4]/20" />
            <textarea name={`faqAnswer-${idx}`} value={pair.a} onChange={(e) => updatePair(idx, "a", e.target.value)} placeholder="Answer" rows={2} className="resize-none rounded-lg bg-white px-2.5 py-2 text-[12px] text-[#151515] shadow-sm outline-none focus:ring-2 focus:ring-[#3152F4]/20" />
          </div>
        ))}
        <button type="button" onClick={addPair} className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#C4C5D9] py-2.5 text-[12px] font-semibold text-[#5E626D] hover:border-[#3152F4] hover:text-[#3152F4]"><PlusCircle className="text-[15px]" />Add another pair</button>
      </div>
      <div className="mt-1 flex items-center justify-end gap-2 border-t border-[#F1F2F5] pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-[#5E626D] hover:bg-[#F1F2F5]">Cancel</button>
        <button type="button" onClick={addSource} className="rounded-xl bg-[#3152F4] px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(49,82,244,0.3)] hover:opacity-95">Add Source</button>
      </div>
    </div>
  );
}

function ProductServiceForm({ onCancel, onImport, notify }: SimpleSourceFormProps) {
  const [name, setName] = useState("");
  const [tier, setTier] = useState("");
  const [description, setDescription] = useState("");

  function addSource() {
    if (!name.trim()) { notify("Add a product or service name"); return; }
    onImport([{ title: name.trim(), text: tier.trim() ? `${tier.trim()} · Product/Service spec` : "Product/Service spec" }]);
    notify(`${name.trim()} added to knowledge base`);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
      <div className="flex items-center gap-2.5"><div className="rounded-lg bg-[#3152F4] p-1.5 text-white"><Package className="text-[16px]" /></div><h2 className="text-[15px] font-semibold text-[#151515]">Product / Service</h2></div>
      <label className="flex flex-col gap-2"><span className="text-[13px] font-semibold text-[#151515]">Name</span><input name="productName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Growth Plan" className="rounded-xl bg-[#F1F2F5] px-3 py-2.5 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/25" /></label>
      <label className="flex flex-col gap-2"><span className="text-[13px] font-semibold text-[#151515]">Tier / Pricing summary</span><input name="productTier" value={tier} onChange={(e) => setTier(e.target.value)} placeholder="e.g. €25,000/mo · up to 5,000 conversations" className="rounded-xl bg-[#F1F2F5] px-3 py-2.5 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/25" /></label>
      <label className="flex flex-col gap-2"><span className="text-[13px] font-semibold text-[#151515]">Description</span><textarea name="productDescription" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this product/service includes..." rows={4} className="resize-none rounded-xl bg-[#F1F2F5] px-3 py-2.5 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/25" /></label>
      <div className="mt-1 flex items-center justify-end gap-2 border-t border-[#F1F2F5] pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-[#5E626D] hover:bg-[#F1F2F5]">Cancel</button>
        <button type="button" onClick={addSource} className="rounded-xl bg-[#3152F4] px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(49,82,244,0.3)] hover:opacity-95">Add Source</button>
      </div>
    </div>
  );
}

function PasteTextForm({ onCancel, onImport, notify }: SimpleSourceFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const wordCount = useMemo(() => body.trim().split(/\s+/).filter(Boolean).length, [body]);

  function addSource() {
    if (!title.trim() || !body.trim()) { notify("Add a title and some text before saving"); return; }
    onImport([{ title: title.trim(), text: `Pasted text · ${wordCount} words` }]);
    notify(`${title.trim()} added to knowledge base`);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
      <div className="flex items-center gap-2.5"><div className="rounded-lg bg-[#3152F4] p-1.5 text-white"><TextAlignLeft className="text-[16px]" /></div><h2 className="text-[15px] font-semibold text-[#151515]">Paste Text</h2></div>
      <label className="flex flex-col gap-2"><span className="text-[13px] font-semibold text-[#151515]">Title</span><input name="pasteTextTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Refund Policy" className="rounded-xl bg-[#F1F2F5] px-3 py-2.5 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/25" /></label>
      <label className="flex flex-col gap-2">
        <div className="flex items-center justify-between"><span className="text-[13px] font-semibold text-[#151515]">Raw markdown or plain copy</span><span className="text-[11px] text-[#8E929C]">{wordCount} words</span></div>
        <textarea name="pasteTextBody" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Paste or type your content here..." rows={8} className="resize-none rounded-xl bg-[#F1F2F5] px-3 py-2.5 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/25" />
      </label>
      <div className="mt-1 flex items-center justify-end gap-2 border-t border-[#F1F2F5] pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-[#5E626D] hover:bg-[#F1F2F5]">Cancel</button>
        <button type="button" onClick={addSource} className="rounded-xl bg-[#3152F4] px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(49,82,244,0.3)] hover:opacity-95">Add Source</button>
      </div>
    </div>
  );
}

interface KnowledgeSourceRow { id: number; title: string; text: string; state: "Ready" | "Needs attention"; icon: typeof Globe; }

const initialKnowledgeSources: KnowledgeSourceRow[] = [
  { id: 1, title: "Product website", text: "128 pages · Refreshed 34 minutes ago", state: "Ready", icon: Globe },
  { id: 2, title: "Enterprise sales guide.pdf", text: "42 pages · 318 knowledge chunks", state: "Ready", icon: FileText },
  { id: 3, title: "Pricing FAQ", text: "18 manual questions and answers", state: "Ready", icon: Question },
  { id: 4, title: "Property services", text: "3 pages could not be indexed", state: "Needs attention", icon: Warning },
];

function KnowledgeBasePage({ notify }: { notify: (v: string) => void }) {
  const [sources, setSources] = useState<KnowledgeSourceRow[]>(initialKnowledgeSources);
  const [view, setView] = useState<"list" | "add">("list");
  const nextSourceId = useRef(5);

  function handleImport(entries: { title: string; text: string }[]) {
    setSources((cur) => [...entries.map((e) => ({ id: nextSourceId.current++, title: e.title, text: e.text, state: "Ready" as const, icon: CheckCircle })), ...cur]);
    setView("list");
  }
  function removeSource(id: number) {
    setSources((cur) => cur.filter((s) => s.id !== id));
    notify("Source removed from knowledge base");
  }

  if (view === "add") return <AddKnowledgeSourcePage onCancel={() => setView("list")} onImport={handleImport} notify={notify} />;

  const healthy = sources.filter((s) => s.state === "Ready").length;

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[#151515]">Knowledge Base</h1>
          <p className="mt-1 text-[12px] text-[#8E929C]">Keep AI answers grounded in approved pages, PDFs, and FAQs.</p>
        </div>
        <button type="button" onClick={() => setView("add")} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#3152F4] px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(49,82,244,0.28)] hover:opacity-95"><Plus className="text-[15px]" />Add Source</button>
      </div>

      <div className="flex items-center gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><BookOpenText weight="duotone" className="text-[22px]" /></div>
        <div className="flex-1"><h2 className="text-[14px] font-semibold text-[#151515]">Knowledge Base at a glance</h2><p className="text-[11px] text-[#8E929C]">{sources.length} source{sources.length === 1 ? "" : "s"} connected</p></div>
        <div className="text-right"><span className="block text-[10px] text-[#8E929C]">Healthy</span><strong className="text-[16px] text-[#151515]">{healthy}/{sources.length}</strong></div>
      </div>

      <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
        <div className="flex items-center justify-between border-b border-[#EDEDF2] px-5 py-4"><h2 className="text-[14px] font-semibold text-[#151515]">Configuration and health</h2></div>
        {sources.length === 0 && <p className="px-5 py-8 text-center text-[12px] text-[#8E929C]">No knowledge sources yet — add your first source above.</p>}
        {sources.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-center gap-3 border-b border-[#F1F2F5] px-5 py-4 last:border-0 hover:bg-[#F8F9FF]">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F1F3FF] text-[#3152F4]"><Icon /></span>
              <span className="flex-1"><b className="block text-[12px] text-[#151515]">{item.title}</b><small className="text-[10px] text-[#8E929C]">{item.text}</small></span>
              <em className={`rounded-full px-2.5 py-1 text-[10px] font-semibold not-italic ${item.state === "Needs attention" ? "bg-[#FDF2F3] text-[#F04452]" : "bg-[#F1F2F5] text-[#5E626D]"}`}>{item.state}</em>
              <button type="button" onClick={() => removeSource(item.id)} aria-label={`Remove ${item.title}`} className="rounded-lg p-1.5 text-[#8E929C] hover:bg-[#FDF2F3] hover:text-[#F04452]"><Trash className="text-[15px]" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type AnalyticsTab = "Overview" | "Leads" | "Conversations" | "Sources" | "Team";
type DateRangeKey = "7d" | "30d" | "90d";
const dateRangeDays: Record<DateRangeKey, number> = { "7d": 7, "30d": 30, "90d": 90 };
const analyticsAnchorDate = new Date(2024, 10, 22);

function analyticsFormatShort(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}
function analyticsFormatLong(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function analyticsDateRangeLabel(key: DateRangeKey) {
  const days = dateRangeDays[key];
  const start = new Date(analyticsAnchorDate);
  start.setDate(start.getDate() - (days - 1));
  const daysWord = key === "7d" ? "Last 7 days" : key === "30d" ? "Last 30 days" : "Last 90 days";
  return `${daysWord} (${analyticsFormatShort(start)} – ${analyticsFormatShort(analyticsAnchorDate)}, ${analyticsAnchorDate.getFullYear()})`;
}

const analyticsBaseTotals = { visitors: 12480, visitorsPrev: 11512, engaged: 3842, aiConversations: 742, captured: 428, qualified: 267 };
const analyticsBaseTemp = { hot: 74, warm: 193, cold: 161, avgScore: 78.4 };
const analyticsBaseResolution = { autonomous: 628, escalated: 114, aiLatencySeconds: 1.2, humanLatencyMinutes: 4.8 };
const analyticsBaseIntents = [
  { label: "AI Automation & Workflow Sprints", count: 282 },
  { label: "Enterprise CRM Integration (HubSpot)", count: 215 },
  { label: "Retainer Pricing & SLA Terms", count: 156 },
  { label: "Custom Engineering & Jamstack", count: 89 },
];

interface AnalyticsSourceRow {
  id: string; name: string; meta: string; icon: typeof Globe; iconBg: string; iconColor: string;
  visitors: number; aiChats: number; captured: number; qualified: number; convRate: number; avgScore: number; pipeline: number;
}
const analyticsBaseSourceRows: AnalyticsSourceRow[] = [
  { id: "organic", name: "Organic Search", meta: "google.com / organic keywords", icon: GoogleLogo, iconBg: "bg-[#F1F2F5]", iconColor: "text-[#3152F4]", visitors: 5420, aiChats: 312, captured: 176, qualified: 118, convRate: 12.8, avgScore: 82, pipeline: 142000 },
  { id: "paid", name: "Paid Search (Google Ads)", meta: "Q4 AI Automation PPC Campaign", icon: CursorClick, iconBg: "bg-[#F1F3FF]", iconColor: "text-[#3152F4]", visitors: 3810, aiChats: 248, captured: 142, qualified: 84, convRate: 10.6, avgScore: 79, pipeline: 98000 },
  { id: "linkedin", name: "LinkedIn Inbound", meta: "Founder thought leadership & sponsored posts", icon: LinkedinLogo, iconBg: "bg-[#3152F4]", iconColor: "text-white", visitors: 1640, aiChats: 118, captured: 68, qualified: 46, convRate: 14.1, avgScore: 86, pipeline: 64000 },
  { id: "direct", name: "Direct / Returning", meta: "Direct bookmarks and repeat sessions", icon: SignIn, iconBg: "bg-[#F1F2F5]", iconColor: "text-[#5E626D]", visitors: 1120, aiChats: 48, captured: 31, qualified: 14, convRate: 8.2, avgScore: 71, pipeline: 22000 },
  { id: "partner", name: "Partner / Referrals", meta: "HubSpot Solutions Directory & Agency Co-marketing", icon: Handshake, iconBg: "bg-[#F1F2F5]", iconColor: "text-[#0B7A57]", visitors: 490, aiChats: 16, captured: 11, qualified: 5, convRate: 16.3, avgScore: 88, pipeline: 18000 },
];

function analyticsBuildDailyWeights(dayCount: number, peakIndex: number) {
  return Array.from({ length: dayCount }, (_, d) => {
    const growth = 1 + d * (1.4 / dayCount);
    const spread = Math.max(2.2, dayCount / 7);
    const bump = 1 + 0.55 * Math.exp(-((d - peakIndex) ** 2) / (2 * spread * spread));
    return growth * bump;
  });
}
function analyticsBuildSeries(weights: number[], total: number) {
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1;
  let allocated = 0;
  return weights.map((w, i) => {
    const isLast = i === weights.length - 1;
    const value = isLast ? Math.max(0, total - allocated) : Math.round((w / weightSum) * total);
    allocated += value;
    return value;
  });
}
function analyticsSampleIndices(dayCount: number, pointCount: number) {
  const n = Math.min(pointCount, dayCount);
  return Array.from({ length: n }, (_, i) => Math.round((i * (dayCount - 1)) / Math.max(1, n - 1)));
}

function ConversionVelocityChart({
  visitors, engaged, captured, qualified, dates, peakIndex, notify,
}: {
  visitors: number[]; engaged: number[]; captured: number[]; qualified: number[]; dates: Date[]; peakIndex: number; notify: (v: string) => void;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const n = visitors.length;
  // Visitors sets the shared scale; the smaller funnel stages are boosted by a fixed
  // visual multiplier so their shape stays legible without distorting relative order
  // (Visitors > Engaged > Captured > Qualified always holds after boosting).
  const maxVisitors = Math.max(...visitors, 1);
  const engagedBoost = 1;
  const capturedBoost = 6;
  const qualifiedBoost = 6;

  const xFor = (i: number) => (n <= 1 ? 0 : (i / (n - 1)) * 1000);
  const yFor = (v: number) => 230 - (v / maxVisitors) * 205;
  const pathFor = (values: number[], boost = 1) => values.map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i).toFixed(1)},${yFor(v * boost).toFixed(1)}`).join(" ");
  const areaFor = (values: number[], boost = 1) => {
    const line = values.map((v, i) => `${xFor(i).toFixed(1)},${yFor(v * boost).toFixed(1)}`).join(" L ");
    return `M ${xFor(0)},230 L ${line} L ${xFor(n - 1)},230 Z`;
  };

  const tickCount = Math.min(8, n);
  const tickIndices = Array.from({ length: tickCount }, (_, i) => Math.round((i * (n - 1)) / Math.max(1, tickCount - 1)));

  const activeIndex = hoverIndex ?? peakIndex;
  const activeDate = dates[activeIndex];
  const isPeak = hoverIndex === null;
  const avgEngaged = engaged.reduce((a, b) => a + b, 0) / (engaged.length || 1);
  const deltaPct = avgEngaged > 0 ? Math.round(((engaged[activeIndex] - avgEngaged) / avgEngaged) * 100) : 0;
  const matchPct = captured[activeIndex] > 0 ? Math.round((qualified[activeIndex] / captured[activeIndex]) * 100) : 0;

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHoverIndex(Math.round(fraction * (n - 1)));
  }

  const maxLabel = (frac: number) => `${((maxVisitors * frac) / 1000).toFixed(1)}k`;
  const calloutLeftPct = Math.min(88, Math.max(12, (xFor(activeIndex) / 1000) * 100));

  return (
    <div className="relative flex h-72 w-full flex-col justify-end pt-4 lg:h-80">
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-8 font-mono text-[11px] text-[#8E929C]">
        {[1, 0.75, 0.5, 0.25, 0].map((frac) => (
          <div key={frac} className="flex items-center justify-between"><div className="h-px w-full bg-[#F1F2F5]" /><span className="w-10 shrink-0 pl-2 text-right">{frac === 0 ? "0" : maxLabel(frac)}</span></div>
        ))}
      </div>
      <div className="relative h-64 w-full pr-12">
        <svg viewBox="0 0 1000 240" preserveAspectRatio="none" className="h-full w-full cursor-crosshair overflow-visible" onMouseMove={handleMove} onMouseLeave={() => setHoverIndex(null)} onClick={() => notify(`${analyticsFormatLong(activeDate)}: ${engaged[activeIndex]} engaged, ${captured[activeIndex]} leads, ${qualified[activeIndex]} qualified`)}>
          <path d={areaFor(visitors)} fill="#C4C5D9" opacity={0.18} />
          <path d={pathFor(visitors)} fill="none" stroke="#C4C5D9" strokeWidth={2.5} strokeLinecap="round" />
          <path d={areaFor(engaged, engagedBoost)} fill="#BAC3FF" opacity={0.28} />
          <path d={pathFor(engaged, engagedBoost)} fill="none" stroke="#BAC3FF" strokeWidth={2.5} strokeLinecap="round" />
          <path d={areaFor(captured, capturedBoost)} fill="#3152F4" opacity={0.16} />
          <path d={pathFor(captured, capturedBoost)} fill="none" stroke="#3152F4" strokeWidth={3} strokeLinecap="round" />
          <path d={pathFor(qualified, qualifiedBoost)} fill="none" stroke="#0B7A57" strokeWidth={3.5} strokeLinecap="round" />
          <line x1={xFor(activeIndex)} x2={xFor(activeIndex)} y1={10} y2={230} stroke="#3152F4" strokeOpacity={0.5} strokeDasharray="4 4" strokeWidth={1.5} />
          <circle cx={xFor(activeIndex)} cy={yFor(visitors[activeIndex])} r={4.5} fill="#fff" stroke="#8E929C" strokeWidth={2} />
          <circle cx={xFor(activeIndex)} cy={yFor(engaged[activeIndex] * engagedBoost)} r={4.5} fill="#fff" stroke="#3152F4" strokeWidth={2} />
          <circle cx={xFor(activeIndex)} cy={yFor(captured[activeIndex] * capturedBoost)} r={4.5} fill="#3152F4" stroke="#fff" strokeWidth={2} />
          <circle cx={xFor(activeIndex)} cy={yFor(qualified[activeIndex] * qualifiedBoost)} r={5} fill="#0B7A57" stroke="#fff" strokeWidth={2} />
        </svg>
        <div className="pointer-events-none absolute top-2 w-60 -translate-x-1/2 rounded-xl bg-white p-3 shadow-[0_12px_28px_rgba(23,28,37,0.14)]" style={{ left: `${calloutLeftPct}%` }}>
          <div className="flex items-center justify-between border-b border-[#F1F2F5] pb-1">
            <span className="text-[12px] font-bold text-[#151515]">{analyticsFormatShort(activeDate)}{isPeak ? " (PPC Launch)" : ""}</span>
            {isPeak && <span className="rounded bg-[#DDF9EE] px-1.5 py-0.5 text-[10px] font-bold text-[#0B7A57]">+{Math.abs(deltaPct)}% Peak</span>}
          </div>
          <div className="grid grid-cols-2 gap-1 pt-1 text-[11px] text-[#5E626D]">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#BAC3FF]" />Engaged: <b className="font-mono text-[#151515]">{engaged[activeIndex]}</b></span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3152F4]" />Leads: <b className="font-mono text-[#151515]">{captured[activeIndex]}</b></span>
            <span className="col-span-2 flex items-center gap-1.5 font-medium text-[#0B7A57]"><span className="h-2 w-2 rounded-full bg-[#0B7A57]" />Qualified: <b className="font-mono">{qualified[activeIndex]} ({matchPct}.0% match)</b></span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pr-12 pt-2 text-[11px] font-semibold text-[#8E929C]">
        {tickIndices.map((idx) => (
          <span key={idx} className={idx === peakIndex ? "font-bold text-[#3152F4]" : ""}>{analyticsFormatShort(dates[idx])}</span>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTempDonut({ hot, warm, cold, avgScore }: { hot: number; warm: number; cold: number; avgScore: number }) {
  const total = hot + warm + cold || 1;
  const circumference = 2 * Math.PI * 48;
  const hotLen = (hot / total) * circumference;
  const warmLen = (warm / total) * circumference;
  const coldLen = (cold / total) * circumference;
  return (
    <div className="relative flex items-center justify-center py-2">
      <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
        <circle cx="60" cy="60" r="48" fill="none" stroke="#EAEDFB" strokeWidth="12" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="#F04452" strokeWidth="12" strokeDasharray={`${hotLen} ${circumference}`} strokeDashoffset={0} />
        <circle cx="60" cy="60" r="48" fill="none" stroke="#E2DFDE" strokeWidth="12" strokeDasharray={`${warmLen} ${circumference}`} strokeDashoffset={-hotLen} />
        <circle cx="60" cy="60" r="48" fill="none" stroke="#747687" strokeWidth="12" strokeDasharray={`${coldLen} ${circumference}`} strokeDashoffset={-(hotLen + warmLen)} />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[26px] font-bold leading-none text-[#151515]">{avgScore.toFixed(1)}</span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#8E929C]">Avg Score</span>
      </div>
    </div>
  );
}

function AnalyticsKpiCard({ icon: Icon, iconTone, value, label, sub, trend, tint }: { icon: typeof Globe; iconTone: string; value: string; label: string; sub: string; trend?: string; tint?: boolean }) {
  return (
    <div className={`flex flex-col justify-between gap-4 rounded-[22px] p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)] transition-transform hover:-translate-y-0.5 ${tint ? "bg-[linear-gradient(155deg,#F1F3FF_0%,#FFFFFF_60%)] shadow-[0_12px_32px_rgba(49,82,244,0.1)]" : "bg-white"}`}>
      <div className="flex items-center justify-between">
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${iconTone}`}><Icon className="text-[18px]" /></div>
        {trend && <span className="flex items-center gap-0.5 rounded-full bg-[#E8F8F3] px-2 py-0.5 text-[10px] font-bold text-[#0B7A57]"><TrendUp className="text-[12px]" />{trend}</span>}
      </div>
      <div>
        <div className={`text-[26px] font-bold leading-none ${tint ? "text-[#3152F4]" : "text-[#151515]"}`}>{value}</div>
        <div className="mt-2 flex items-center justify-between gap-2"><span className="text-[11px] font-semibold text-[#5E626D]">{label}</span><span className="truncate text-[10px] text-[#8E929C]">{sub}</span></div>
      </div>
    </div>
  );
}

function AnalyticsFunnelCard({ steps, conversion }: { steps: { label: string; value: number; pct: number }[]; conversion: string }) {
  const barColors = ["bg-[#C4C5D9]", "bg-[#BAC3FF]", "bg-[#3152F4]", "bg-[#3152F4]", "bg-[#0B7A57]"];
  return (
    <div className="flex flex-col justify-between gap-5 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[15px] font-bold text-[#151515]"><Funnel className="text-[18px] text-[#3152F4]" />Qualification Funnel</span>
        <span className="text-[11px] font-medium text-[#8E929C]">30d Cohort</span>
      </div>
      <div className="flex flex-col gap-3.5">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className={i === steps.length - 1 ? "font-bold text-[#0B7A57]" : "text-[#8E929C]"}>{i + 1}. {step.label}</span>
              <span className={`font-mono font-bold ${i === steps.length - 1 ? "text-[#0B7A57]" : "text-[#151515]"}`}>{step.value.toLocaleString()} ({step.pct}%)</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F1F2F5]"><div className={`h-full rounded-full ${barColors[i]}`} style={{ width: `${Math.max(2, step.pct)}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-[#F1F2F5] pt-2"><span className="text-[11px] text-[#8E929C]">Full Funnel Conversion</span><span className="font-mono font-bold text-[#3152F4]">{conversion}% overall</span></div>
    </div>
  );
}

function AnalyticsResolutionCard({ autonomous, escalated, aiLatencySeconds, humanLatencyMinutes }: { autonomous: number; escalated: number; aiLatencySeconds: number; humanLatencyMinutes: number }) {
  const total = autonomous + escalated || 1;
  const autoPct = (autonomous / total) * 100;
  return (
    <div className="flex flex-col justify-between gap-5 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[15px] font-bold text-[#151515]"><Robot className="text-[18px] text-[#0B7A57]" />Resolution Velocity</span>
        <span className="rounded-full bg-[#E8F8F3] px-2 py-0.5 text-[11px] font-bold text-[#0B7A57]">{autoPct.toFixed(1)}% Auto</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[18px] font-bold text-[#151515]">{autonomous} <span className="text-[11px] font-normal text-[#8E929C]">Autonomous</span></span>
          <span className="text-[15px] font-semibold text-[#5E626D]">{escalated} <span className="text-[11px] font-normal text-[#8E929C]">Escalated</span></span>
        </div>
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-[#F1F2F5] p-0.5">
          <div className="h-full rounded-full bg-[#0B7A57]" style={{ width: `${autoPct}%` }} />
          <div className="ml-1 h-full rounded-full bg-[#5E626D]" style={{ width: `${100 - autoPct}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-[#8E929C]"><span>Nova AI Qualified &amp; Routed</span><span>Handoff to Sales</span></div>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-[#F8F9FC] p-3.5">
        <div className="flex flex-col"><span className="text-[10px] font-semibold uppercase text-[#8E929C]">AI Avg Latency</span><span className="flex items-center gap-1 font-mono font-bold text-[#0B7A57]"><Lightning className="text-[13px]" />{aiLatencySeconds.toFixed(1)} seconds</span></div>
        <div className="h-8 w-px bg-[#EDEDF2]" />
        <div className="flex flex-col text-right"><span className="text-[10px] font-semibold uppercase text-[#8E929C]">Human Response</span><span className="flex items-center justify-end gap-1 font-mono font-bold text-[#151515]"><Clock className="text-[13px]" />{humanLatencyMinutes.toFixed(1)} minutes</span></div>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-[#8E929C]"><CheckCircle className="text-[15px] text-[#0B7A57]" />Zero unanswered visitors during off-hours.</div>
    </div>
  );
}

function AnalyticsIntentsCard({ intents, onViewClusters }: { intents: { label: string; count: number; pct: number }[]; onViewClusters: () => void }) {
  const barColors = ["bg-[#3152F4]", "bg-[#BAC3FF]", "bg-[#C4C5D9]", "bg-[#8E929C]"];
  return (
    <div className="flex flex-col justify-between gap-4 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[15px] font-bold text-[#151515]"><Compass className="text-[18px] text-[#3152F4]" />Visitor Inbound Intents</span>
        <span className="text-[11px] font-medium text-[#8E929C]">Ranked</span>
      </div>
      <div className="flex flex-col gap-3">
        {intents.map((intent, i) => (
          <div key={intent.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="truncate font-semibold text-[#151515]">{intent.label}</span>
              <span className={`shrink-0 font-mono font-bold ${i === 0 ? "text-[#3152F4]" : "text-[#151515]"}`}>{intent.pct}% ({intent.count})</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F2F5]"><div className={`h-full rounded-full ${barColors[i]}`} style={{ width: `${Math.max(2, intent.pct)}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-[#F1F2F5] pt-2 text-[11px] text-[#8E929C]">
        <span>Mapped via Nova Classifier v2.4</span>
        <button type="button" onClick={onViewClusters} className="font-bold text-[#3152F4] hover:underline">View clusters →</button>
      </div>
    </div>
  );
}

function AnalyticsPage({ notify }: { notify: (v: string) => void }) {
  const [tab, setTab] = useState<AnalyticsTab>("Overview");
  const [dateRange, setDateRange] = useState<DateRangeKey>("30d");
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [comparePrev, setComparePrev] = useState(true);
  const [chartView, setChartView] = useState<"Daily" | "Weekly">("Weekly");
  const [sourceSearch, setSourceSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof AnalyticsSourceRow>("visitors");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const days = dateRangeDays[dateRange];
  const rangeScale = days / 30;
  const scale = (n: number) => Math.max(0, Math.round(n * rangeScale));
  const rangeLabel = analyticsDateRangeLabel(dateRange);

  const totals = {
    visitors: scale(analyticsBaseTotals.visitors),
    visitorsPrev: scale(analyticsBaseTotals.visitorsPrev),
    engaged: scale(analyticsBaseTotals.engaged),
    aiConversations: scale(analyticsBaseTotals.aiConversations),
    captured: scale(analyticsBaseTotals.captured),
    qualified: scale(analyticsBaseTotals.qualified),
  };

  const peakIndex = Math.min(days - 1, Math.round((days - 1) * 0.724));
  const chartData = useMemo(() => {
    const weights = analyticsBuildDailyWeights(days, peakIndex);
    const visitors = analyticsBuildSeries(weights, totals.visitors);
    const engaged = analyticsBuildSeries(weights, totals.engaged);
    const captured = analyticsBuildSeries(weights, totals.captured);
    const qualified = analyticsBuildSeries(weights, totals.qualified);
    const dates = Array.from({ length: days }, (_, i) => { const d = new Date(analyticsAnchorDate); d.setDate(d.getDate() - (days - 1) + i); return d; });
    const sampleIdx = analyticsSampleIndices(days, 8);
    const closestSampleToPeak = sampleIdx.reduce((best, idx) => (Math.abs(idx - peakIndex) < Math.abs(best - peakIndex) ? idx : best), sampleIdx[0]);
    return {
      daily: { visitors, engaged, captured, qualified, dates, peakIndex },
      weekly: {
        visitors: sampleIdx.map((i) => visitors[i]),
        engaged: sampleIdx.map((i) => engaged[i]),
        captured: sampleIdx.map((i) => captured[i]),
        qualified: sampleIdx.map((i) => qualified[i]),
        dates: sampleIdx.map((i) => dates[i]),
        peakIndex: sampleIdx.indexOf(closestSampleToPeak),
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, peakIndex, totals.visitors, totals.engaged, totals.captured, totals.qualified]);

  const activeSeries = chartView === "Daily" ? chartData.daily : chartData.weekly;

  const funnelSteps = [
    { label: "Total Visitors", value: totals.visitors, pct: 100 },
    { label: "Engaged Traffic", value: totals.engaged, pct: 30.8 },
    { label: "AI Conversations", value: totals.aiConversations, pct: 19.3 },
    { label: "Captured Leads", value: totals.captured, pct: 57.7 },
    { label: "Qualified Leads", value: totals.qualified, pct: 62.4 },
  ];
  const fullFunnelConversion = totals.visitors > 0 ? ((totals.qualified / totals.visitors) * 100).toFixed(2) : "0.00";

  const tempHot = scale(analyticsBaseTemp.hot);
  const tempWarm = scale(analyticsBaseTemp.warm);
  const tempCold = scale(analyticsBaseTemp.cold);

  const autonomous = scale(analyticsBaseResolution.autonomous);
  const escalated = scale(analyticsBaseResolution.escalated);

  const intents = analyticsBaseIntents.map((it) => {
    const count = scale(it.count);
    return { label: it.label, count, pct: totals.aiConversations > 0 ? Math.round((count / totals.aiConversations) * 100) : 0 };
  });

  const sourceRows = useMemo(() => analyticsBaseSourceRows.map((r) => ({
    ...r,
    visitors: Math.max(0, Math.round(r.visitors * rangeScale)),
    aiChats: Math.max(0, Math.round(r.aiChats * rangeScale)),
    captured: Math.max(0, Math.round(r.captured * rangeScale)),
    qualified: Math.max(0, Math.round(r.qualified * rangeScale)),
    pipeline: Math.max(0, Math.round(r.pipeline * rangeScale)),
  })), [rangeScale]);

  const filteredSourceRows = useMemo(() => {
    const q = sourceSearch.trim().toLowerCase();
    const rows = sourceRows.filter((r) => !q || r.name.toLowerCase().includes(q) || r.meta.toLowerCase().includes(q));
    return [...rows].sort((a, b) => {
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [sourceRows, sourceSearch, sortKey, sortDir]);

  function toggleSort(key: keyof AnalyticsSourceRow) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const footerTotals = sourceRows.reduce((acc, r) => ({
    visitors: acc.visitors + r.visitors, aiChats: acc.aiChats + r.aiChats, captured: acc.captured + r.captured, qualified: acc.qualified + r.qualified, pipeline: acc.pipeline + r.pipeline,
  }), { visitors: 0, aiChats: 0, captured: 0, qualified: 0, pipeline: 0 });
  const footerConvRate = totals.engaged > 0 ? ((totals.captured / totals.engaged) * 100).toFixed(1) : "0.0";
  const footerAvgScore = analyticsBaseTemp.avgScore.toFixed(1);

  const repStats = ["Maya Singh", "Arjun Mehta", "Riya Sen"].map((name) => {
    const owned = leads.filter((l) => l.owner === name);
    const avgScore = owned.length ? Math.round(owned.reduce((s, l) => s + l.score, 0) / owned.length) : 0;
    const qualifiedCount = owned.filter((l) => ["Qualified", "Proposal Sent", "Meeting Scheduled"].includes(l.stage)).length;
    return { name, assigned: owned.length, avgScore, qualifiedCount };
  });

  const tabs: AnalyticsTab[] = ["Overview", "Leads", "Conversations", "Sources", "Team"];

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] font-bold tracking-tight text-[#151515]">Analytics</h1>
            <span className="flex items-center gap-1.5 rounded-full bg-[#F1F2F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#5E626D]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />Live Stream</span>
          </div>
          <p className="max-w-2xl text-[12px] text-[#8E929C]">Inspect conversion funnels, AI resolution telemetry, and lead acquisition efficiency across touchpoints.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-xl bg-[#F1F2F5] px-3.5 py-2 hover:bg-[#E5E8F5]">
            <span className="h-2 w-2 rounded-full bg-[#0B7A57]" />
            <span className="text-[13px] font-semibold text-[#151515]">ailqs.com</span>
            <CaretDown className="text-[15px] text-[#8E929C]" />
          </div>
          <div className="relative">
            <button type="button" onClick={() => setDateRangeOpen((v) => !v)} aria-pressed={dateRangeOpen} className="flex items-center gap-2 rounded-xl bg-[#F1F2F5] px-3.5 py-2 text-[13px] font-medium text-[#151515] hover:bg-[#E5E8F5]"><CalendarBlank className="text-[16px] text-[#8E929C]" />{rangeLabel}<CaretDown className="text-[15px] text-[#8E929C]" /></button>
            {dateRangeOpen && (
              <div className="absolute right-0 top-11 z-20 w-56 rounded-xl bg-white p-1.5 shadow-[0_10px_30px_rgba(20,25,40,0.15)]">
                {(["7d", "30d", "90d"] as DateRangeKey[]).map((key) => (
                  <button key={key} type="button" onClick={() => { setDateRange(key); setDateRangeOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-left text-[12px] font-medium ${dateRange === key ? "bg-[#F1F3FF] font-semibold text-[#3152F4]" : "text-[#151515] hover:bg-[#F1F2F5]"}`}>{analyticsDateRangeLabel(key)}</button>
                ))}
              </div>
            )}
          </div>
          <button type="button" onClick={() => setComparePrev((v) => !v)} aria-pressed={comparePrev} className="flex items-center gap-2 rounded-xl bg-[#F1F2F5] px-3.5 py-2 text-[13px] font-medium text-[#151515] hover:bg-[#E5E8F5]">
            <span className={`grid h-4 w-4 place-items-center rounded ${comparePrev ? "bg-[#3152F4] text-white" : "bg-white text-transparent shadow-[inset_0_0_0_1px_#C4C5D9]"}`}><Check weight="bold" className="text-[10px]" /></span>
            Compare Previous Period
          </button>
          <button type="button" onClick={() => notify("Report exported")} className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#F1F2F5]"><DownloadSimple className="text-[16px] text-[#8E929C]" />Report</button>
          <span className="hidden items-center gap-1 text-[11px] text-[#8E929C] 2xl:flex"><ArrowClockwise className="text-[13px]" />Updated 5m ago</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-[#F1F2F5] p-1 shadow-sm">
          {tabs.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-full px-5 py-1.5 text-[13px] font-semibold transition-colors ${tab === t ? "bg-[#3152F4] text-white shadow-[0_4px_12px_rgba(49,82,244,0.3)]" : "text-[#5E626D] hover:text-[#151515]"}`}>{t}</button>
          ))}
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-[#F1F2F5] px-3 py-1 md:flex">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#58DDAC] opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#0B7A57]" /></span>
          <span className="text-[11px] text-[#8E929C]">Live On Site:</span>
          <span className="font-mono text-[12px] font-bold text-[#151515]">42 active</span>
        </div>
      </div>

      {tab === "Overview" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <AnalyticsKpiCard icon={Globe} iconTone="bg-[#F1F2F5] text-[#5E626D]" value={totals.visitors.toLocaleString()} label="Total Visitors" sub={`vs ${totals.visitorsPrev.toLocaleString()} prev`} trend={comparePrev ? "+8.4%" : undefined} />
            <AnalyticsKpiCard icon={CursorClick} iconTone="bg-[#F1F2F5] text-[#5E626D]" value={totals.engaged.toLocaleString()} label="Engaged Visitors" sub={`${totals.visitors > 0 ? ((totals.engaged / totals.visitors) * 100).toFixed(1) : "0.0"}% of traffic`} trend={comparePrev ? "+14.2%" : undefined} />
            <AnalyticsKpiCard icon={Users} iconTone="bg-[#3152F4] text-white shadow-md" value={totals.captured.toLocaleString()} label="Captured Leads" sub={`${totals.aiConversations > 0 ? ((totals.captured / totals.aiConversations) * 100).toFixed(1) : "0.0"}% of chats`} trend={comparePrev ? "+12.4%" : undefined} tint />
            <AnalyticsKpiCard icon={SealCheck} iconTone="bg-[#E8F8F3] text-[#0B7A57]" value={totals.qualified.toLocaleString()} label="Qualified Leads" sub={`${totals.captured > 0 ? ((totals.qualified / totals.captured) * 100).toFixed(1) : "0.0"}% match`} trend={comparePrev ? "+18.6%" : undefined} />
            <div className="flex flex-col justify-between gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)] transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#F1F2F5] text-[#5E626D]"><Lightning className="text-[18px]" /></div>
                <span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[10px] font-bold text-[#151515]">Top 10% SaaS</span>
              </div>
              <div>
                <div className="text-[26px] font-bold leading-none text-[#151515]">{totals.engaged > 0 ? ((totals.captured / totals.engaged) * 100).toFixed(1) : "0.0"}%</div>
                <div className="mt-2 flex items-center justify-between gap-2"><span className="text-[11px] font-semibold text-[#5E626D]">Chat-to-Lead Conv.</span><span className="text-[10px] font-medium text-[#0B7A57]">+1.8% pts</span></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-[26px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2"><h2 className="text-[17px] font-bold text-[#151515]">Visitor → Engaged → Lead → Qualified Conversion Velocity</h2><Info className="text-[16px] text-[#8E929C]" /></div>
                <p className="text-[11px] text-[#8E929C]">Timeline telemetry tracking full pipeline stages over the {days}-day window</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 text-[11px] text-[#8E929C]">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#C4C5D9]" />Total Visitors</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#BAC3FF]" />Engaged</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#3152F4]" />Captured Leads</span>
                  <span className="flex items-center gap-1.5 font-semibold text-[#151515]"><span className="h-2.5 w-2.5 rounded-full bg-[#0B7A57]" />Qualified Leads</span>
                </div>
                <div className="flex rounded-lg bg-[#F1F2F5] p-0.5">
                  <button type="button" onClick={() => setChartView("Daily")} className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${chartView === "Daily" ? "bg-white text-[#151515] shadow-sm" : "text-[#8E929C] hover:text-[#151515]"}`}>Daily</button>
                  <button type="button" onClick={() => setChartView("Weekly")} className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${chartView === "Weekly" ? "bg-white text-[#151515] shadow-sm" : "text-[#8E929C] hover:text-[#151515]"}`}>Weekly</button>
                </div>
              </div>
            </div>
            <ConversionVelocityChart visitors={activeSeries.visitors} engaged={activeSeries.engaged} captured={activeSeries.captured} qualified={activeSeries.qualified} dates={activeSeries.dates} peakIndex={activeSeries.peakIndex} notify={notify} />
            <div className="flex items-start gap-3.5 rounded-2xl bg-[#F8F9FC] p-4 lg:p-5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#3152F4] text-white shadow-sm"><Sparkle className="text-[16px]" /></div>
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-center gap-2"><span className="text-[13px] font-bold text-[#3152F4]">Nova AI Executive Insight</span><span className="text-[11px] text-[#8E929C]">• Automated Analysis</span></div>
                <p className="text-[13px] leading-relaxed text-[#151515]">Inbound traffic landing on <span className="rounded bg-[#F1F3FF] px-1.5 py-0.5 font-mono font-semibold text-[#3152F4]">/services/ai-automation</span> achieved a <b>24.8% chat-to-lead qualification rate</b>—more than 2.2x higher than standard organic homepage traffic.</p>
                <div className="mt-1 flex items-center gap-2 text-[12px] font-semibold text-[#0B7A57]"><Lightbulb className="text-[15px]" />Recommendation: Direct Q4 PPC campaigns to dedicated service sub-paths rather than the top-level domain.</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AnalyticsFunnelCard steps={funnelSteps} conversion={fullFunnelConversion} />
            <div className="flex flex-col justify-between gap-4 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[15px] font-bold text-[#151515]"><Fire className="text-[18px] text-[#F04452]" />Lead Temperature</span>
                <span className="text-[11px] font-medium text-[#8E929C]">{totals.captured.toLocaleString()} Leads</span>
              </div>
              <AnalyticsTempDonut hot={tempHot} warm={tempWarm} cold={tempCold} avgScore={analyticsBaseTemp.avgScore} />
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[12px]"><span className="flex items-center gap-2 font-medium text-[#151515]"><span className="h-2.5 w-2.5 rounded-full bg-[#F04452]" />Hot Leads</span><span className="font-mono font-bold text-[#151515]">{tempHot} ({((tempHot / (tempHot + tempWarm + tempCold || 1)) * 100).toFixed(1)}%)</span></div>
                <div className="flex items-center justify-between text-[12px]"><span className="flex items-center gap-2 font-medium text-[#151515]"><span className="h-2.5 w-2.5 rounded-full bg-[#E2DFDE]" />Warm Leads</span><span className="font-mono font-bold text-[#151515]">{tempWarm} ({((tempWarm / (tempHot + tempWarm + tempCold || 1)) * 100).toFixed(1)}%)</span></div>
                <div className="flex items-center justify-between text-[12px]"><span className="flex items-center gap-2 font-medium text-[#151515]"><span className="h-2.5 w-2.5 rounded-full bg-[#747687]" />Cold Leads</span><span className="font-mono font-bold text-[#151515]">{tempCold} ({((tempCold / (tempHot + tempWarm + tempCold || 1)) * 100).toFixed(1)}%)</span></div>
              </div>
            </div>
            <AnalyticsResolutionCard autonomous={autonomous} escalated={escalated} aiLatencySeconds={analyticsBaseResolution.aiLatencySeconds} humanLatencyMinutes={analyticsBaseResolution.humanLatencyMinutes} />
            <AnalyticsIntentsCard intents={intents} onViewClusters={() => notify("Opening intent clusters (Nova Classifier v2.4)")} />
          </div>

          <AnalyticsSourceTable rows={filteredSourceRows} search={sourceSearch} setSearch={setSourceSearch} sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort} footerTotals={footerTotals} footerConvRate={footerConvRate} footerAvgScore={footerAvgScore} notify={notify} />
        </>
      )}

      {tab === "Leads" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AnalyticsFunnelCard steps={funnelSteps} conversion={fullFunnelConversion} />
          <div className="flex flex-col justify-between gap-4 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[15px] font-bold text-[#151515]"><Fire className="text-[18px] text-[#F04452]" />Lead Temperature</span>
              <span className="text-[11px] font-medium text-[#8E929C]">{totals.captured.toLocaleString()} Leads</span>
            </div>
            <AnalyticsTempDonut hot={tempHot} warm={tempWarm} cold={tempCold} avgScore={analyticsBaseTemp.avgScore} />
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[12px]"><span className="flex items-center gap-2 font-medium text-[#151515]"><span className="h-2.5 w-2.5 rounded-full bg-[#F04452]" />Hot Leads</span><span className="font-mono font-bold text-[#151515]">{tempHot}</span></div>
              <div className="flex items-center justify-between text-[12px]"><span className="flex items-center gap-2 font-medium text-[#151515]"><span className="h-2.5 w-2.5 rounded-full bg-[#E2DFDE]" />Warm Leads</span><span className="font-mono font-bold text-[#151515]">{tempWarm}</span></div>
              <div className="flex items-center justify-between text-[12px]"><span className="flex items-center gap-2 font-medium text-[#151515]"><span className="h-2.5 w-2.5 rounded-full bg-[#747687]" />Cold Leads</span><span className="font-mono font-bold text-[#151515]">{tempCold}</span></div>
            </div>
          </div>
        </div>
      )}

      {tab === "Conversations" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AnalyticsResolutionCard autonomous={autonomous} escalated={escalated} aiLatencySeconds={analyticsBaseResolution.aiLatencySeconds} humanLatencyMinutes={analyticsBaseResolution.humanLatencyMinutes} />
            <AnalyticsIntentsCard intents={intents} onViewClusters={() => notify("Opening intent clusters (Nova Classifier v2.4)")} />
          </div>
          <div className="flex items-start gap-3.5 rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#3152F4] text-white shadow-sm"><Sparkle className="text-[16px]" /></div>
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-2"><span className="text-[13px] font-bold text-[#3152F4]">Nova AI Executive Insight</span><span className="text-[11px] text-[#8E929C]">• Automated Analysis</span></div>
              <p className="text-[13px] leading-relaxed text-[#151515]">Inbound traffic landing on <span className="rounded bg-[#F1F3FF] px-1.5 py-0.5 font-mono font-semibold text-[#3152F4]">/services/ai-automation</span> achieved a <b>24.8% chat-to-lead qualification rate</b>—more than 2.2x higher than standard organic homepage traffic.</p>
            </div>
          </div>
        </div>
      )}

      {tab === "Sources" && (
        <AnalyticsSourceTable rows={filteredSourceRows} search={sourceSearch} setSearch={setSourceSearch} sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort} footerTotals={footerTotals} footerConvRate={footerConvRate} footerAvgScore={footerAvgScore} notify={notify} />
      )}

      {tab === "Team" && (
        <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
          <div className="flex items-center justify-between border-b border-[#F1F2F5] px-6 py-4"><h2 className="text-[15px] font-bold text-[#151515]">Rep Performance</h2><span className="text-[11px] text-[#8E929C]">Live from shared lead assignments</span></div>
          {repStats.map((rep) => (
            <div key={rep.name} className="flex items-center gap-4 border-b border-[#F1F2F5] px-6 py-4 last:border-0">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#DDE3FF] text-[12px] font-bold text-[#151515]">{rep.name.split(" ").map((w) => w[0]).join("")}</span>
              <span className="flex-1"><b className="block text-[13px] text-[#151515]">{rep.name}</b><small className="text-[11px] text-[#8E929C]">{rep.assigned} assigned leads · {rep.qualifiedCount} qualified+</small></span>
              <span className="rounded-full bg-[#F1F2F5] px-2.5 py-1 text-[11px] font-bold text-[#151515]">Avg Score {rep.avgScore || "—"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsSourceTable({
  rows, search, setSearch, sortKey, sortDir, toggleSort, footerTotals, footerConvRate, footerAvgScore, notify,
}: {
  rows: AnalyticsSourceRow[]; search: string; setSearch: (v: string) => void; sortKey: keyof AnalyticsSourceRow; sortDir: "asc" | "desc"; toggleSort: (k: keyof AnalyticsSourceRow) => void;
  footerTotals: { visitors: number; aiChats: number; captured: number; qualified: number; pipeline: number }; footerConvRate: string; footerAvgScore: string; notify: (v: string) => void;
}) {
  const SortIcon = sortDir === "asc" ? SortAscending : SortDescending;
  function SortableHeader({ label, k, align = "right" }: { label: string; k: keyof AnalyticsSourceRow; align?: "right" | "center" }) {
    return (
      <th className={`px-4 py-3.5 font-semibold ${align === "right" ? "text-right" : "text-center"}`}>
        <button type="button" onClick={() => toggleSort(k)} className={`inline-flex items-center gap-1 hover:text-[#151515] ${sortKey === k ? "text-[#3152F4]" : ""}`}>{label}{sortKey === k && <SortIcon className="text-[12px]" />}</button>
      </th>
    );
  }
  return (
    <div className="flex flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
      <div className="flex flex-col gap-4 border-b border-[#F1F2F5] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5"><h2 className="text-[17px] font-bold text-[#151515]">Lead-Source Performance Breakdown</h2><span className="rounded-full bg-[#F1F2F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#5E626D]">{rows.length} Active Channels</span></div>
          <p className="text-[11px] text-[#8E929C]">Telemetry tracking acquisition channels from landing through pipeline conversion.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[#8E929C]" />
            <input name="sourceFilter" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter sources..." className="h-8 w-44 rounded-lg bg-[#F1F2F5] pl-8 pr-3 text-[11px] text-[#151515] outline-none focus:bg-white focus:ring-1 focus:ring-[#3152F4]/40" />
          </div>
          <button type="button" onClick={() => notify("Table exported")} className="flex items-center gap-1.5 rounded-xl bg-[#F1F2F5] px-3 py-1.5 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5]"><DownloadSimple className="text-[15px] text-[#8E929C]" />Export Table</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#F1F2F5] bg-[#F8F9FC] text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">
              <th className="px-6 py-3.5 font-semibold">Channel / Inbound Source</th>
              <SortableHeader label="Visitors" k="visitors" />
              <SortableHeader label="AI Chats" k="aiChats" />
              <SortableHeader label="Captured Leads" k="captured" />
              <SortableHeader label="Qualified Leads" k="qualified" />
              <SortableHeader label="Conv. Rate" k="convRate" />
              <SortableHeader label="Avg Lead Score" k="avgScore" align="center" />
              <th className="px-6 py-3.5 text-right font-semibold">Pipeline Est.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F2F5] text-[13px] text-[#151515]">
            {rows.length === 0 && <tr><td colSpan={8} className="px-6 py-8 text-center text-[12px] text-[#8E929C]">No sources match this filter.</td></tr>}
            {rows.map((r) => {
              const Icon = r.icon;
              return (
                <tr key={r.id} className="transition-colors hover:bg-[#F8F9FC]">
                  <td className="flex items-center gap-3 px-6 py-4">
                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${r.iconBg} ${r.iconColor}`}><Icon weight="bold" className="text-[16px]" /></div>
                    <div className="flex flex-col"><span className="text-[13px] font-bold text-[#151515]">{r.name}</span><span className="text-[11px] text-[#8E929C]">{r.meta}</span></div>
                  </td>
                  <td className="px-4 py-4 text-right font-mono font-semibold">{r.visitors.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-mono text-[#8E929C]">{r.aiChats.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-mono font-semibold">{r.captured.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right"><span className="inline-flex items-center gap-1 font-mono font-bold text-[#0B7A57]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />{r.qualified.toLocaleString()}</span></td>
                  <td className="px-4 py-4 text-right font-mono font-bold">{r.convRate}%</td>
                  <td className="px-4 py-4 text-center"><span className="rounded-full bg-[#E8F8F3] px-2.5 py-1 font-mono text-[11px] font-bold text-[#0B7A57]">{r.avgScore} / 100</span></td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-[#3152F4]">€{r.pipeline.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#F1F2F5] bg-[#F8F9FC] font-bold text-[#151515]">
              <td className="px-6 py-4 text-[13px]">Total / Blended Portfolio</td>
              <td className="px-4 py-4 text-right font-mono">{footerTotals.visitors.toLocaleString()}</td>
              <td className="px-4 py-4 text-right font-mono">{footerTotals.aiChats.toLocaleString()}</td>
              <td className="px-4 py-4 text-right font-mono">{footerTotals.captured.toLocaleString()}</td>
              <td className="px-4 py-4 text-right font-mono text-[#0B7A57]">{footerTotals.qualified.toLocaleString()}</td>
              <td className="px-4 py-4 text-right font-mono">{footerConvRate}% avg</td>
              <td className="px-4 py-4 text-center font-mono">{footerAvgScore} pts</td>
              <td className="px-6 py-4 text-right font-mono text-[16px] text-[#3152F4]">€{footerTotals.pipeline.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

type IntegrationCategory = "CRM" | "Automation" | "Communication" | "Calendar" | "Developer";
interface IntegrationApp {
  id: string; name: string; category: IntegrationCategory; description: string;
  icon: typeof SlackLogo; iconColor: string; premium?: boolean;
  availableMeta: string; connectedMeta: string; connectedLabel?: string;
}
const initialIntegrationApps: IntegrationApp[] = [
  { id: "slack", name: "Slack", category: "Communication", description: "Push real-time Hot lead alerts, conversation takeovers, and qualification summaries to designated team channels.", icon: SlackLogo, iconColor: "#E01E5A", availableMeta: "1-click OAuth integration", connectedMeta: "#inbound-hot-leads • 42 alerts today" },
  { id: "webhooks", name: "Webhooks", category: "Developer", description: "Stream JSON payloads of qualified leads, scoring milestones, and chat transcripts directly to your custom internal API.", icon: WebhooksLogo, iconColor: "#3152F4", availableMeta: "Custom REST payloads", connectedMeta: "1 endpoint live • 742 payloads (99.8% OK)", connectedLabel: "Manage Endpoints" },
  { id: "salesforce", name: "Salesforce", category: "CRM", description: "Bi-directional sync of enterprise leads, opportunity mapping, and automated SDR task creation directly in Salesforce.", icon: Cloud, iconColor: "#00A1E0", premium: true, availableMeta: "Requires Growth or Pro Plan", connectedMeta: "Synced 4m ago" },
  { id: "hubspot", name: "HubSpot", category: "CRM", description: "Automatically create deals, update contact lifecycles, and log conversation transcripts in HubSpot CRM.", icon: PuzzlePiece, iconColor: "#FF7A59", availableMeta: "1-click OAuth integration", connectedMeta: "Synced 4m ago" },
  { id: "zoho", name: "Zoho CRM", category: "CRM", description: "Sync visitor contact data, qualification scores, and assign leads directly into Zoho sales pipelines.", icon: AddressBook, iconColor: "#E42528", availableMeta: "Supports custom field mappings", connectedMeta: "Synced 4m ago" },
  { id: "pipedrive", name: "Pipedrive", category: "CRM", description: "Instant deal creation in relevant pipeline stages based on Nova lead temperature and budget values.", icon: Kanban, iconColor: "#048058", availableMeta: "Auto-create stage activities", connectedMeta: "Synced 4m ago" },
  { id: "sheets", name: "Google Sheets", category: "Automation", description: "Append every new conversation and qualified lead into live spreadsheet rows for custom reporting and lookups.", icon: Table, iconColor: "#0F9D58", availableMeta: "Real-time row appending", connectedMeta: "Synced 4m ago" },
  { id: "zapier", name: "Zapier", category: "Automation", description: "Trigger 5,000+ app automations on lead qualification, high temperature alert, or human handoff initiation.", icon: Lightning, iconColor: "#FF4A00", availableMeta: "Pre-made trigger templates", connectedMeta: "Synced 4m ago" },
  { id: "make", name: "Make (Integromat)", category: "Automation", description: "Build visual multi-step lead enrichment workflows, data transformations, and complex routing scenarios.", icon: TreeStructure, iconColor: "#6D28D9", availableMeta: "Visual webhook blueprint ready", connectedMeta: "Synced 4m ago" },
  { id: "email", name: "Email (SMTP / Resend)", category: "Communication", description: "Send instant branded email alerts to SDR reps and autonomous follow-up email sequences to qualified prospects.", icon: Envelope, iconColor: "#2563EB", availableMeta: "DKIM & Custom domain ready", connectedMeta: "Synced 4m ago" },
  { id: "gcal", name: "Google Calendar", category: "Calendar", description: "Allow high-intent visitors to book 15-minute qualification meetings directly inside the conversation widget.", icon: CalendarBlank, iconColor: "#4285F4", availableMeta: "Round-robin scheduling", connectedMeta: "Synced 4m ago" },
  { id: "outlook", name: "Microsoft Outlook", category: "Calendar", description: "Sync sales rep Office 365 availability and automatically book discovery calls without leave-behind friction.", icon: MicrosoftOutlookLogo, iconColor: "#0078D4", availableMeta: "365 Team calendar sync", connectedMeta: "Synced 4m ago" },
];

function IntegrationDiagnosticLogModal({ onClose }: { onClose: () => void }) {
  const logs = [
    { time: "2m ago", text: "Retry drop on #inbound-hot-leads delivery (HTTP 429 — rate limited)" },
    { time: "38m ago", text: "Retry drop on #inbound-hot-leads delivery (HTTP 429 — rate limited)" },
    { time: "1h ago", text: "Auto-reconnection established — channel handshake OK" },
    { time: "3h ago", text: "Webhook signature verified — payload accepted" },
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-[0_24px_48px_rgba(18,24,40,0.2)]">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-[15px] font-bold text-[#151515]">Slack Diagnostic Log</h2><button type="button" onClick={onClose} aria-label="Close" className="text-[#8E929C]"><X className="text-[16px]" /></button></div>
        <div className="flex flex-col gap-2">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-xl bg-[#F8F9FC] p-3">
              <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${idx < 2 ? "bg-[#F5A524]" : "bg-[#0B7A57]"}`} />
              <div className="flex flex-col gap-0.5"><span className="text-[12px] text-[#151515]">{log.text}</span><span className="text-[10px] text-[#8E929C]">{log.time}</span></div>
            </div>
          ))}
        </div>
        <button type="button" onClick={onClose} className="mt-4 w-full rounded-xl bg-[#3152F4] py-2 text-[12px] font-semibold text-white hover:opacity-95">Close</button>
      </div>
    </div>
  );
}

function IntegrationSettingsDrawer({ app, onClose, onDisconnect }: { app: IntegrationApp; onClose: () => void; onDisconnect: () => void }) {
  const Icon = app.icon;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#151515]/40" />
      <aside className="relative flex h-full w-full max-w-sm flex-col gap-5 overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F1F2F5] p-2.5 shadow-inner"><Icon weight="fill" style={{ color: app.iconColor }} className="text-[26px]" /></span>
            <div><h2 className="text-[15px] font-bold text-[#151515]">{app.name}</h2><p className="text-[11px] text-[#8E929C]">{app.category}</p></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-[#8E929C] hover:bg-[#F1F2F5]"><X className="text-[16px]" /></button>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[#E8F8F3] px-3 py-2.5 text-[12px] font-semibold text-[#0B7A57]"><CheckCircle weight="fill" className="text-[16px]" />Connected</div>

        <div className="flex flex-col gap-1.5 rounded-xl bg-[#F8F9FC] p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Live Status</span>
          <span className="text-[12px] text-[#151515]">{app.connectedMeta}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Configuration</span>
          <div className="flex items-center justify-between rounded-xl bg-[#F8F9FC] p-3"><span className="text-[12px] text-[#151515]">Sync frequency</span><span className="text-[11px] font-semibold text-[#5E626D]">Real-time</span></div>
          <div className="flex items-center justify-between rounded-xl bg-[#F8F9FC] p-3"><span className="text-[12px] text-[#151515]">Data direction</span><span className="text-[11px] font-semibold text-[#5E626D]">Bi-directional</span></div>
          <div className="flex items-center justify-between rounded-xl bg-[#F8F9FC] p-3"><span className="text-[12px] text-[#151515]">Connected by</span><span className="text-[11px] font-semibold text-[#5E626D]">Maya Singh</span></div>
        </div>

        <button type="button" onClick={onDisconnect} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#FDF2F3] py-2.5 text-[12px] font-semibold text-[#F04452] hover:bg-[#F04452] hover:text-white"><Plugs className="text-[16px]" />Disconnect {app.name}</button>
      </aside>
    </div>
  );
}

function IntegrationsPage({ notify, setSection }: { notify: (v: string) => void; setSection: (v: string) => void }) {
  const [connections, setConnections] = useState<Record<string, boolean>>({ slack: true, webhooks: true });
  const [maxSlots] = useState(3);
  const [warningActive, setWarningActive] = useState(true);
  const [retesting, setRetesting] = useState(false);
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [settingsAppId, setSettingsAppId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"All" | IntegrationCategory>("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "connected" | "available" | "locked">("all");
  const [sortBy, setSortBy] = useState<"recommended" | "name" | "status">("recommended");

  const connectedCount = initialIntegrationApps.filter((a) => connections[a.id]).length;
  const availableSlots = Math.max(0, maxSlots - connectedCount);

  function connect(app: IntegrationApp) {
    if (app.premium) {
      notify(`${app.name} requires the Growth or Pro plan — opening Billing & Usage`);
      setSection("Billing & Usage");
      return;
    }
    if (availableSlots <= 0) {
      notify("No integration slots available — upgrade your plan for more slots");
      return;
    }
    setConnections((cur) => ({ ...cur, [app.id]: true }));
    notify(`${app.name} connected`);
  }
  function disconnect(app: IntegrationApp) {
    setConnections((cur) => ({ ...cur, [app.id]: false }));
    notify(`${app.name} disconnected`);
    setSettingsAppId(null);
  }
  function retestSync() {
    setRetesting(true);
    setTimeout(() => {
      setRetesting(false);
      setWarningActive(false);
      notify("Slack webhook re-tested — sync stable, warning cleared");
    }, 900);
  }

  const categories: IntegrationCategory[] = ["CRM", "Automation", "Communication", "Calendar", "Developer"];
  const categoryCounts = categories.map((c) => ({ key: c, count: initialIntegrationApps.filter((a) => a.category === c).length }));

  const statusOf = (app: IntegrationApp): "connected" | "available" | "locked" => (connections[app.id] ? "connected" : app.premium ? "locked" : "available");
  const connectedTotal = initialIntegrationApps.filter((a) => statusOf(a) === "connected").length;
  const availableTotal = initialIntegrationApps.filter((a) => statusOf(a) === "available").length;
  const lockedTotal = initialIntegrationApps.filter((a) => statusOf(a) === "locked").length;

  const filteredApps = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = initialIntegrationApps.filter((a) => {
      if (categoryFilter !== "All" && a.category !== categoryFilter) return false;
      if (statusFilter !== "all" && statusOf(a) !== statusFilter) return false;
      if (q && !`${a.name} ${a.description} ${a.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sortBy === "name") rows = [...rows].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "status") rows = [...rows].sort((a, b) => (statusOf(a) === statusOf(b) ? 0 : statusOf(a) === "connected" ? -1 : statusOf(b) === "connected" ? 1 : statusOf(a) === "available" ? -1 : 1));
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter, statusFilter, sortBy, connections]);

  const settingsApp = initialIntegrationApps.find((a) => a.id === settingsAppId) ?? null;

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#8E929C]"><span>Integrations</span><span className="text-[#C4C5D9]">/</span><span className="text-[#3152F4]">Marketplace</span></div>
          <h1 className="text-[24px] font-bold tracking-tight text-[#151515]">Integrations &amp; Ecosystem</h1>
          <p className="max-w-2xl text-[12px] text-[#8E929C]">Connect Nova AI with your CRM, communication channels, workflow automations, and custom webhooks to orchestrate autonomous lead intake.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <button type="button" onClick={() => notify("Custom webhook builder opened")} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[13px] font-semibold text-[#151515] shadow-sm hover:bg-[#F1F2F5]"><WebhooksLogo className="text-[16px] text-[#8E929C]" />Custom Webhook</button>
          <button type="button" onClick={() => notify("Integration request submitted to the AILQS team")} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[13px] font-semibold text-[#151515] shadow-sm hover:bg-[#F1F2F5]"><PlusCircle className="text-[16px] text-[#3152F4]" />Request Integration</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm lg:col-span-5">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F1F2F5] text-[#3152F4]"><CirclesThreePlus className="text-[24px]" /></div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Plan Allocation</span>
              <div className="flex flex-wrap items-baseline gap-1.5"><span className="text-[24px] font-bold leading-none tracking-tight text-[#151515]">{connectedCount}</span><span className="text-[12px] font-medium leading-none text-[#8E929C]">of {maxSlots}</span><span className="ml-1 truncate text-[11px] leading-none text-[#8E929C]">Active slots</span></div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5 pl-2">
            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-[#E8F8F3] px-2.5 py-0.5 text-[11px] font-bold text-[#0B7A57]">{availableSlots} Available</span>
            <button type="button" onClick={() => { notify("Opening Billing & Usage to upgrade"); setSection("Billing & Usage"); }} className="whitespace-nowrap text-[11px] font-semibold text-[#3152F4] hover:underline">Upgrade</button>
          </div>
        </div>

        {warningActive ? (
          <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm md:flex-row md:items-center lg:col-span-7">
            <div className="flex min-w-0 flex-1 items-start gap-3.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FDF2F3] text-[#F04452]"><Warning className="text-[20px]" /></div>
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-center gap-2"><span className="truncate text-[15px] font-semibold text-[#151515]">Slack Webhook Rate Warning</span><span className="relative flex h-2 w-2 shrink-0"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F04452] opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#F04452]" /></span></div>
                <p className="text-[12px] leading-relaxed text-[#8E929C]">Webhook endpoint experienced 2 retry drops in the last hour due to channel rate limits. Auto-reconnection is currently stable.</p>
              </div>
            </div>
            <div className="flex w-full shrink-0 gap-2 self-start sm:flex-row md:w-auto md:flex-col md:self-center">
              <button type="button" onClick={() => setDiagnosticOpen(true)} className="whitespace-nowrap rounded-lg bg-[#F1F2F5] px-3.5 py-2 text-center text-[11px] font-semibold text-[#151515] hover:bg-[#E5E8F5]">Diagnostic Log</button>
              <button type="button" onClick={retestSync} disabled={retesting} className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[#3152F4] px-3.5 py-2 text-center text-[11px] font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-70">
                {retesting && <SpinnerGap className="animate-spin text-[13px]" />}
                {retesting ? "Testing…" : "Re-test Sync"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3.5 rounded-2xl bg-white p-5 shadow-sm lg:col-span-7">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E8F8F3] text-[#0B7A57]"><CheckCircle weight="fill" className="text-[20px]" /></div>
            <div className="flex flex-col gap-0.5"><span className="text-[13px] font-semibold text-[#151515]">All integrations healthy</span><p className="text-[11px] text-[#8E929C]">Slack sync re-tested and stable — no active warnings.</p></div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-stretch gap-4 rounded-2xl bg-white p-3.5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <MagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[16px] text-[#8E929C]" />
          <input name="integrationSearch" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search 12+ integrations by name, service or use case..." className="h-10 w-full rounded-xl bg-[#F1F2F5] pl-10 pr-4 text-[12px] text-[#151515] outline-none focus:bg-white focus:shadow-[inset_0_0_0_1px_#E5E8F5]" />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button type="button" onClick={() => setCategoryFilter("All")} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all ${categoryFilter === "All" ? "bg-[#3152F4] text-white shadow-[0_4px_12px_rgba(49,82,244,0.25)]" : "text-[#5E626D] hover:bg-[#F1F2F5]"}`}>All ({initialIntegrationApps.length})</button>
          {categoryCounts.map((c) => (
            <button key={c.key} type="button" onClick={() => setCategoryFilter(c.key)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all ${categoryFilter === c.key ? "bg-[#3152F4] text-white shadow-[0_4px_12px_rgba(49,82,244,0.25)]" : "text-[#5E626D] hover:bg-[#F1F2F5]"}`}>{c.key} ({c.count})</button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <select name="integrationStatusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="rounded-xl bg-[#F1F2F5] px-3 py-1.5 text-[11px] font-semibold text-[#151515] outline-none">
            <option value="all">Status: All</option>
            <option value="connected">Connected ({connectedTotal})</option>
            <option value="available">Available ({availableTotal})</option>
            <option value="locked">Locked ({lockedTotal})</option>
          </select>
          <select name="integrationSort" value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="rounded-xl bg-[#F1F2F5] px-3 py-1.5 text-[11px] font-semibold text-[#151515] outline-none">
            <option value="recommended">Sort: Recommended</option>
            <option value="name">Sort: Name (A–Z)</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredApps.length === 0 && <div className="col-span-full rounded-2xl bg-white p-10 text-center text-[12px] text-[#8E929C] shadow-sm">No integrations match these filters.</div>}
        {filteredApps.map((app) => {
          const Icon = app.icon;
          const status = statusOf(app);
          return (
            <div key={app.id} className="flex flex-col justify-between rounded-[20px] bg-white p-6 shadow-[0_4px_20px_rgba(20,25,40,0.03)] transition-all hover:shadow-[0_12px_32px_rgba(20,25,40,0.07)]">
              <div>
                <div className="mb-4 flex items-start justify-between gap-2">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F1F2F5] p-2.5 shadow-inner"><Icon weight="fill" style={{ color: app.iconColor }} className="text-[26px]" /></span>
                  {status === "connected" ? (
                    <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#E8F8F3] px-2.5 py-1 text-[11px] font-bold tracking-wide text-[#0B7A57]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />Connected</span>
                  ) : app.premium ? (
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <span className="flex items-center gap-1 rounded-full bg-[#3152F4] px-2 py-0.5 text-[10px] font-extrabold uppercase text-white"><Star weight="fill" className="text-[11px]" />Premium</span>
                      <span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[11px] font-medium text-[#5E626D]">Available</span>
                    </div>
                  ) : (
                    <span className="whitespace-nowrap rounded-full bg-[#F1F2F5] px-2.5 py-1 text-[11px] font-medium text-[#5E626D]">Available</span>
                  )}
                </div>
                <div className="mb-1 flex flex-wrap items-center gap-2"><h3 className="text-[15px] font-semibold text-[#151515]">{app.name}</h3><span className="rounded bg-[#F1F2F5] px-2 py-0.5 text-[11px] text-[#5E626D]">{app.category}</span></div>
                <p className="mb-6 line-clamp-2 text-[12px] text-[#8E929C]">{app.description}</p>
              </div>
              <div>
                <div className={`mb-3 flex items-center gap-1.5 text-[11px] ${status === "connected" ? "text-[#0B7A57]" : app.premium ? "text-[#8E929C]" : "text-[#8E929C]"}`}>
                  {status === "connected" ? <CheckCircle className="text-[15px]" /> : app.premium ? <Lock className="text-[15px]" /> : <Info className="text-[15px]" />}
                  <span className="truncate">{status === "connected" ? app.connectedMeta : app.availableMeta}</span>
                </div>
                {status === "connected" ? (
                  <button type="button" onClick={() => setSettingsAppId(app.id)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F1F2F5] px-3 py-2 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5]">
                    {app.connectedLabel === "Manage Endpoints" ? <Plugs className="text-[16px]" /> : <SlidersHorizontal className="text-[16px]" />}
                    {app.connectedLabel ?? "Settings"}
                  </button>
                ) : app.premium ? (
                  <button type="button" onClick={() => connect(app)} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#F1F2F5] px-3 py-2 text-[12px] font-semibold text-[#151515] hover:bg-[#3152F4] hover:text-white"><LockOpen className="text-[16px]" />Upgrade to Connect</button>
                ) : (
                  <button type="button" onClick={() => connect(app)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F1F2F5] px-3 py-2 text-[12px] font-semibold text-[#151515] hover:bg-[#3152F4] hover:text-white"><LinkIcon className="text-[16px]" />Connect</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-start justify-between gap-6 rounded-[24px] bg-[#F8F9FC] p-6 lg:flex-row lg:items-center lg:p-8">
        <div className="flex max-w-2xl items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[#3152F4] shadow-sm"><Code className="text-[26px]" /></div>
          <div className="flex flex-col gap-1"><h4 className="text-[15px] font-semibold text-[#151515]">Need a custom or enterprise integration?</h4><p className="text-[12px] text-[#8E929C]">Connect your bespoke internal ERP, warehouse telemetry, or on-prem databases via our high-throughput REST API and streaming WebSocket feeds.</p></div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <button type="button" onClick={() => notify("API keys panel opened")} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#F1F2F5]"><Key className="text-[16px] text-[#8E929C]" />Manage API Keys</button>
          <button type="button" onClick={() => notify("Opening developer documentation")} className="flex items-center gap-2 rounded-xl bg-[#3152F4] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_4px_14px_rgba(49,82,244,0.3)] hover:opacity-95"><BookOpenText className="text-[16px]" />Developer Docs</button>
        </div>
      </div>

      {diagnosticOpen && <IntegrationDiagnosticLogModal onClose={() => setDiagnosticOpen(false)} />}
      {settingsApp && <IntegrationSettingsDrawer app={settingsApp} onClose={() => setSettingsAppId(null)} onDisconnect={() => disconnect(settingsApp)} />}
    </div>
  );
}

type SettingsCategory = "Workspace" | "Lead Pipeline" | "Custom Fields & Tags" | "Branding" | "Business Hours" | "Privacy & Data" | "Security" | "API Keys" | "Audit Logs";
const settingsCategories: { key: SettingsCategory; icon: typeof Buildings; badge?: string }[] = [
  { key: "Workspace", icon: Buildings },
  { key: "Lead Pipeline", icon: Funnel, badge: "9 Stages" },
  { key: "Custom Fields & Tags", icon: Tag },
  { key: "Branding", icon: PaintBrush },
  { key: "Business Hours", icon: Clock },
  { key: "Privacy & Data", icon: ShieldCheck, badge: "GDPR" },
  { key: "Security", icon: Lock },
  { key: "API Keys", icon: Key, badge: "3 Active" },
  { key: "Audit Logs", icon: Receipt },
];

function SettingsBreadcrumb({ current }: { current: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#8E929C]">
      <span>Workspace</span><CaretRight className="text-[10px]" /><span>Administration</span><CaretRight className="text-[10px]" /><span>Settings</span><CaretRight className="text-[10px]" /><span className="font-semibold text-[#151515]">{current}</span>
    </div>
  );
}

function SettingsConfirmDialog({ title, description, confirmLabel, danger, onConfirm, onClose }: { title: string; description: string; confirmLabel: string; danger: boolean; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-[0_24px_48px_rgba(18,24,40,0.2)]">
        <div className="mb-2 flex items-center gap-2.5"><span className={`grid h-9 w-9 place-items-center rounded-xl ${danger ? "bg-[#FDF2F3] text-[#F04452]" : "bg-[#F1F3FF] text-[#3152F4]"}`}><Warning className="text-[18px]" /></span><h2 className="text-[15px] font-bold text-[#151515]">{title}</h2></div>
        <p className="mb-4 text-[12px] text-[#8E929C]">{description}</p>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-3.5 py-2 text-[12px] font-semibold text-[#5E626D] hover:bg-[#F1F2F5]">Cancel</button>
          <button type="button" onClick={onConfirm} className={`rounded-xl px-4 py-2 text-[12px] font-bold text-white hover:opacity-90 ${danger ? "bg-[#F04452]" : "bg-[#3152F4]"}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

interface WorkspaceSettingsState {
  workspaceName: string; industry: string; urlSlug: string; country: string; timezone: string; language: string; currency: string; dateFormat: string; fallbackChannel: string;
}
const defaultWorkspaceSettings: WorkspaceSettingsState = {
  workspaceName: "AILQS Demo", industry: "Digital Agency", urlSlug: "ailqs-demo", country: "India",
  timezone: "(GMT+05:30) Mumbai, New Delhi, Bangalore — IST", language: "English (UK / US)", currency: "EUR (€) — Euro",
  dateFormat: "DD/MM/YYYY, 24-hour (e.g. 28/09/2026 14:30)", fallbackChannel: "#leads-slack",
};

function SettingsWorkspaceTab({ notify }: { notify: (v: string) => void }) {
  const [saved, setSaved] = useState(defaultWorkspaceSettings);
  const [draft, setDraft] = useState(defaultWorkspaceSettings);
  const [transferOpen, setTransferOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);

  function update<K extends keyof WorkspaceSettingsState>(key: K, value: WorkspaceSettingsState[K]) {
    setDraft((cur) => ({ ...cur, [key]: value }));
  }
  function save() { setSaved(draft); notify("Workspace settings saved"); }
  function reset() { setDraft(saved); }

  return (
    <div className="flex flex-col gap-6 pb-16">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-1">
          <SettingsBreadcrumb current="Workspace" />
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-[22px] font-bold tracking-tight text-[#151515]">Workspace Settings</h1><span className="rounded-full bg-[#F1F2F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#5E626D]">v2.4 Production</span></div>
          <p className="max-w-2xl text-[12px] text-[#8E929C]">Manage your organization details, regional preferences, localization standards, and operational fallbacks.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <button type="button" onClick={reset} disabled={!dirty} className="rounded-xl bg-[#F1F2F5] px-4 py-2 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5] disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
          <button type="button" onClick={save} disabled={!dirty} className="flex items-center gap-1.5 rounded-xl bg-[#3152F4] px-4 py-2 text-[12px] font-bold text-white shadow-[0_6px_18px_rgba(49,82,244,0.28)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"><Check weight="bold" className="text-[15px]" />Save Changes</button>
        </div>
      </div>

      <section className="flex flex-col gap-6 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
          <div className="flex flex-col gap-0.5"><h2 className="flex items-center gap-2 text-[16px] font-bold text-[#151515]"><Buildings className="text-[20px] text-[#3152F4]" />General Workspace Profile</h2><p className="text-[12px] text-[#8E929C]">Identify your workspace across automated invitations, widget headers, and audit records.</p></div>
          <span className="flex items-center gap-1.5 rounded-full bg-[#F1F2F5] px-2.5 py-1 text-[11px] font-semibold text-[#0B7A57]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />Verified Domain</span>
        </div>

        <div className="flex flex-col items-center gap-6 rounded-2xl bg-[#F8F9FC] p-4 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white p-2 shadow-md"><div className="grid h-full w-full place-items-center rounded-xl bg-[#151515] text-white"><Command weight="bold" className="text-[24px]" /></div></div>
            <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-[#3152F4] text-white shadow-md"><SealCheck weight="fill" className="text-[14px]" /></span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-col"><span className="text-[13px] font-semibold text-[#151515]">Workspace Logo</span><span className="text-[11px] text-[#8E929C]">SVG, PNG, or high-res JPG. Maximum recommended size 2MB (recommended 400x400px).</span></div>
            <div className="flex items-center gap-2.5 pt-1">
              <button type="button" onClick={() => notify("Logo upload dialog opened")} className="flex items-center gap-1.5 rounded-xl bg-[#E5E8F5] px-3.5 py-1.5 text-[12px] font-semibold text-[#151515] hover:bg-[#DDE3FF]"><UploadSimple className="text-[15px]" />Upload New Logo</button>
              <button type="button" onClick={() => notify("Logo removed")} className="rounded-xl px-3.5 py-1.5 text-[12px] font-semibold text-[#8E929C] hover:bg-[#FDF2F3] hover:text-[#F04452]">Remove</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="flex items-center justify-between text-[12px] font-semibold text-[#151515]">Workspace Name<span className="text-[10px] font-medium text-[#8E929C]">Required</span></span>
            <div className="relative flex items-center"><IdentificationBadge className="pointer-events-none absolute left-3.5 text-[16px] text-[#8E929C]" /><input name="workspaceName" value={draft.workspaceName} onChange={(e) => update("workspaceName", e.target.value)} className="h-11 w-full rounded-xl bg-[#F1F2F5] pl-10 pr-4 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" /></div>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-semibold text-[#151515]">Primary Industry</span>
            <div className="relative flex items-center">
              <Tag className="pointer-events-none absolute left-3.5 text-[16px] text-[#8E929C]" />
              <select name="industry" value={draft.industry} onChange={(e) => update("industry", e.target.value)} className="h-11 w-full appearance-none rounded-xl bg-[#F1F2F5] pl-10 pr-9 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">
                {["Digital Agency", "SaaS & Software", "E-commerce", "Real Estate", "Financial Services", "Consulting & Advisory"].map((o) => <option key={o}>{o}</option>)}
              </select>
              <CaretDown className="pointer-events-none absolute right-3 text-[16px] text-[#8E929C]" />
            </div>
          </label>
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="flex items-center justify-between text-[12px] font-semibold text-[#151515]">Workspace URL &amp; Webhook Slug<span className="text-[10px] font-medium text-[#8E929C]">Permanent DNS Routing</span></span>
            <div className="flex items-center gap-2">
              <div className="flex h-11 flex-1 items-center rounded-xl bg-[#F1F2F5] px-3.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3152F4]/20">
                <span className="select-none text-[13px] text-[#8E929C]">app.ailqs.com/</span>
                <input name="urlSlug" value={draft.urlSlug} onChange={(e) => update("urlSlug", e.target.value)} className="flex-1 bg-transparent pl-0.5 font-mono text-[13px] text-[#151515] outline-none" />
              </div>
              <button type="button" onClick={() => notify("Workspace link copied")} className="flex h-11 items-center gap-1.5 rounded-xl bg-[#F1F2F5] px-3.5 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5]"><Copy className="text-[15px]" />Copy Link</button>
            </div>
            <span className="text-[11px] text-[#8E929C]">Leads qualifying via direct modal links or webhook payloads address this route.</span>
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-6 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
          <div className="flex flex-col gap-0.5"><h2 className="flex items-center gap-2 text-[16px] font-bold text-[#151515]"><Globe className="text-[20px] text-[#3152F4]" />Regional &amp; Localization Preferences</h2><p className="text-[12px] text-[#8E929C]">Controls automated meeting booking offsets, currency conversion in lead scores, and locale stamps.</p></div>
          <span className="rounded-full bg-[#F1F2F5] px-2.5 py-1 text-[11px] font-semibold text-[#5E626D]">UTC Offset Active</span>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2"><span className="text-[12px] font-semibold text-[#151515]">Headquarters Country</span>
            <div className="relative flex items-center"><Flag className="pointer-events-none absolute left-3.5 text-[16px] text-[#8E929C]" />
              <select name="country" value={draft.country} onChange={(e) => update("country", e.target.value)} className="h-11 w-full appearance-none rounded-xl bg-[#F1F2F5] pl-10 pr-9 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">
                {["India", "United Kingdom", "United States", "Germany", "Singapore", "Australia", "United Arab Emirates"].map((o) => <option key={o}>{o}</option>)}
              </select><CaretDown className="pointer-events-none absolute right-3 text-[16px] text-[#8E929C]" />
            </div>
          </label>
          <label className="flex flex-col gap-2"><span className="text-[12px] font-semibold text-[#151515]">Primary Workspace Timezone</span>
            <div className="relative flex items-center"><Clock className="pointer-events-none absolute left-3.5 text-[16px] text-[#8E929C]" />
              <select name="timezone" value={draft.timezone} onChange={(e) => update("timezone", e.target.value)} className="h-11 w-full appearance-none rounded-xl bg-[#F1F2F5] pl-10 pr-9 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">
                {["(GMT+00:00) London, Edinburgh, Dublin — UK Time", "(GMT+05:30) Mumbai, New Delhi, Bangalore — IST", "(GMT-05:00) Eastern Time (US & Canada)", "(GMT+01:00) Berlin, Paris, Amsterdam — CET", "(GMT+08:00) Singapore, Perth"].map((o) => <option key={o}>{o}</option>)}
              </select><CaretDown className="pointer-events-none absolute right-3 text-[16px] text-[#8E929C]" />
            </div>
          </label>
          <label className="flex flex-col gap-2"><span className="text-[12px] font-semibold text-[#151515]">Default Agent &amp; System Language</span>
            <div className="relative flex items-center"><Translate className="pointer-events-none absolute left-3.5 text-[16px] text-[#8E929C]" />
              <select name="language" value={draft.language} onChange={(e) => update("language", e.target.value)} className="h-11 w-full appearance-none rounded-xl bg-[#F1F2F5] pl-10 pr-9 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">
                {["English (UK / US)", "German (Deutsch)", "French (Français)", "Spanish (Español)", "Hindi (हिन्दी)"].map((o) => <option key={o}>{o}</option>)}
              </select><CaretDown className="pointer-events-none absolute right-3 text-[16px] text-[#8E929C]" />
            </div>
          </label>
          <label className="flex flex-col gap-2"><span className="text-[12px] font-semibold text-[#151515]">Primary Currency Valuation</span>
            <div className="relative flex items-center"><Coins className="pointer-events-none absolute left-3.5 text-[16px] text-[#8E929C]" />
              <select name="currency" value={draft.currency} onChange={(e) => update("currency", e.target.value)} className="h-11 w-full appearance-none rounded-xl bg-[#F1F2F5] pl-10 pr-9 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">
                {["EUR (€) — Euro", "GBP (£) — British Pound", "USD ($) — US Dollar", "INR (₹) — Indian Rupee", "SGD (S$) — Singapore Dollar"].map((o) => <option key={o}>{o}</option>)}
              </select><CaretDown className="pointer-events-none absolute right-3 text-[16px] text-[#8E929C]" />
            </div>
          </label>
          <label className="flex flex-col gap-2 md:col-span-2"><span className="text-[12px] font-semibold text-[#151515]">Standard Date &amp; Time Format</span>
            <div className="relative flex items-center"><CalendarBlank className="pointer-events-none absolute left-3.5 text-[16px] text-[#8E929C]" />
              <select name="dateFormat" value={draft.dateFormat} onChange={(e) => update("dateFormat", e.target.value)} className="h-11 w-full appearance-none rounded-xl bg-[#F1F2F5] pl-10 pr-9 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">
                {["DD/MM/YYYY, 24-hour (e.g. 28/09/2026 14:30)", "MM/DD/YYYY, 12-hour (e.g. 09/28/2026 02:30 PM)", "YYYY-MM-DD, 24-hour ISO 8601 (e.g. 2026-09-28 14:30)"].map((o) => <option key={o}>{o}</option>)}
              </select><CaretDown className="pointer-events-none absolute right-3 text-[16px] text-[#8E929C]" />
            </div>
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-6 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
          <div className="flex flex-col gap-0.5"><h2 className="flex items-center gap-2 text-[16px] font-bold text-[#151515]"><CirclesThreePlus className="text-[20px] text-[#3152F4]" />Default Lead Assignment &amp; Routing</h2><p className="text-[12px] text-[#8E929C]">Designate fallback owners and notification dispatchers when automated scoring rules are indeterminate.</p></div>
          <span className="rounded-full bg-[#F1F2F5] px-2.5 py-1 text-[11px] font-semibold text-[#151515]">Active Ruleset #01</span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-semibold text-[#151515]">Default Lead Owner</span>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#F8F9FC] p-3">
              <div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#DDE3FF] text-[12px] font-bold text-[#151515]">MS</span><div className="flex min-w-0 flex-col"><span className="truncate text-[13px] font-semibold text-[#151515]">Maya Singh</span><span className="truncate text-[11px] text-[#8E929C]">Product Lead • Workspace Admin</span></div></div>
              <button type="button" onClick={() => notify("Default lead owner picker opened")} className="shrink-0 rounded-xl bg-white px-3 py-1.5 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#E5E8F5]">Change</button>
            </div>
            <p className="flex items-start gap-1.5 text-[11px] text-[#8E929C]"><Info className="mt-0.5 shrink-0 text-[14px] text-[#3152F4]" />Unassigned incoming leads will default to this owner if pipeline routing rules do not trigger a specific rep match.</p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-semibold text-[#151515]">Fallback Notification Dispatch</span>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#F8F9FC] p-3">
              <div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#DDE3FF] text-[#3152F4]"><Tag className="text-[18px]" /></span><div className="flex min-w-0 flex-col"><span className="truncate text-[13px] font-semibold text-[#151515]">{draft.fallbackChannel}</span><span className="truncate text-[11px] text-[#8E929C]">Slack Connect • 8 Subscribers</span></div></div>
              <button type="button" onClick={() => notify("Fallback channel editor opened")} className="shrink-0 rounded-xl bg-white px-3 py-1.5 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#E5E8F5]">Edit Channel</button>
            </div>
            <p className="flex items-start gap-1.5 text-[11px] text-[#8E929C]"><BellRinging className="mt-0.5 shrink-0 text-[14px] text-[#3152F4]" />Urgent Hot leads (&gt;85 qualification score) automatically push instant rich alerts to this integration channel.</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 rounded-[24px] bg-[#FDF2F3] p-6 lg:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
          <div className="flex flex-col gap-0.5"><h2 className="flex items-center gap-2 text-[16px] font-bold text-[#F04452]"><Warning className="text-[20px]" />Danger Zone</h2><p className="text-[12px] text-[#8E929C]">Irreversible administrative actions that affect team ownership, domain binds, and stored pipeline telemetry.</p></div>
          <span className="rounded-full bg-[#F04452] px-2.5 py-0.5 text-[11px] font-semibold text-white">Admin Access Required</span>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-4 sm:flex-row sm:items-center">
            <div className="flex max-w-xl flex-col gap-0.5"><span className="text-[13px] font-semibold text-[#151515]">Transfer Workspace Ownership</span><p className="text-[11px] text-[#8E929C]">Transfer this workspace and all associated billing subscriptions, qualification pipelines, and AI configurations to another verified team member.</p></div>
            <button type="button" onClick={() => setTransferOpen(true)} className="shrink-0 rounded-xl bg-[#F1F2F5] px-4 py-2 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5]">Transfer Ownership</button>
          </div>
          <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-4 sm:flex-row sm:items-center">
            <div className="flex max-w-xl flex-col gap-0.5"><span className="text-[13px] font-semibold text-[#F04452]">Delete AILQS Demo Workspace</span><p className="text-[11px] text-[#8E929C]">Permanently delete AILQS Demo workspace, 2 active websites, and all 1,248 captured leads. This action is instantaneous and cannot be undone.</p></div>
            <button type="button" onClick={() => setDeleteOpen(true)} className="shrink-0 rounded-xl bg-[#F04452] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(240,68,82,0.25)] hover:opacity-90">Delete Workspace</button>
          </div>
        </div>
      </section>

      {dirty && (
        <div className="fixed bottom-8 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 items-center justify-between gap-5 rounded-2xl bg-[#151515] px-5 py-3.5 text-white shadow-[0_20px_45px_rgba(0,0,0,0.24)] md:w-auto">
          <div className="flex min-w-0 items-center gap-3"><span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[#58DDAC]" /><span className="truncate text-[12px]">Careful — you have unsaved changes in <strong className="font-semibold">Workspace Settings</strong>.</span></div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={reset} className="rounded-xl px-3 py-1.5 text-[12px] font-semibold text-white/80 hover:bg-white/10">Reset Changes</button>
            <button type="button" onClick={save} className="rounded-xl bg-[#3152F4] px-3.5 py-1.5 text-[12px] font-bold text-white shadow-[0_4px_12px_rgba(49,82,244,0.35)] hover:opacity-95">Save Changes</button>
          </div>
        </div>
      )}

      {transferOpen && <SettingsConfirmDialog title="Transfer Workspace Ownership" description="This will transfer billing, qualification pipelines, and AI configurations to another verified team member. This cannot be undone by you alone." confirmLabel="Transfer Ownership" danger={false} onClose={() => setTransferOpen(false)} onConfirm={() => { setTransferOpen(false); notify("Ownership transfer request sent for approval"); }} />}
      {deleteOpen && <SettingsConfirmDialog title="Delete AILQS Demo Workspace" description="This permanently deletes the workspace, 2 active websites, and all 1,248 captured leads. This action is instantaneous and cannot be undone." confirmLabel="Delete Workspace" danger onClose={() => setDeleteOpen(false)} onConfirm={() => { setDeleteOpen(false); notify("Workspace deletion initiated"); }} />}
    </div>
  );
}

function SettingsScoreRing({ score }: { score: number }) {
  return (
    <div className="relative h-9 w-9 shrink-0">
      <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F1F2F5" strokeWidth="3.5" />
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0B7A57" strokeWidth="3.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-[#151515]">{score}%</span>
    </div>
  );
}

interface DeviceSession { id: string; device: string; icon: typeof Laptop; location: string; ip: string; lastActive: string; current: boolean; }
const initialSessions: DeviceSession[] = [
  { id: "chrome-mac", device: "Chrome 128 on macOS Sonoma", icon: Laptop, location: "London, United Kingdom", ip: "185.220.101.5", lastActive: "Active now", current: true },
  { id: "safari-iphone", device: "Safari 17 on iPhone 15 Pro", icon: DeviceMobile, location: "London, United Kingdom", ip: "185.220.101.5", lastActive: "Last active 22 mins ago", current: false },
  { id: "firefox-win", device: "Firefox 129 on Windows 11", icon: Monitor, location: "Manchester, United Kingdom", ip: "82.165.197.12", lastActive: "Last active 2 days ago", current: false },
];
interface AuthEvent { id: number; time: string; event: string; icon: typeof SealCheck; iconColor: string; device: string; location: string; ip: string; status: "Success" | "Blocked"; flagged?: boolean; }
const authHistory: AuthEvent[] = [
  { id: 1, time: "28 Feb 2026, 08:31", event: "2FA TOTP Verified", icon: SealCheck, iconColor: "#0B7A57", device: "Chrome 128 • macOS Sonoma", location: "London, UK", ip: "185.220.101.5", status: "Success" },
  { id: 2, time: "28 Feb 2026, 08:30", event: "Google SSO Login", icon: Key, iconColor: "#3152F4", device: "Chrome 128 • macOS Sonoma", location: "London, UK", ip: "185.220.101.5", status: "Success" },
  { id: 3, time: "26 Feb 2026, 14:18", event: "Failed Password Attempt", icon: ShieldWarning, iconColor: "#F04452", device: "Firefox 126 • Linux x86_64", location: "Frankfurt, DE", ip: "194.26.29.112", status: "Blocked", flagged: true },
  { id: 4, time: "26 Feb 2026, 11:05", event: "OAuth Session Refreshed", icon: ArrowClockwise, iconColor: "#5E626D", device: "Safari 17 • iPhone 15 Pro", location: "London, UK", ip: "185.220.101.5", status: "Success" },
];
const settingsBackupCodes = ["7F92-K491", "9104-M82Z", "P882-198A", "L332-901K", "6640-VA72", "WQ81-8821", "0012-ZZ49", "K551-912T"];

function SettingsSecurityTab({ notify, setCategory }: { notify: (v: string) => void; setCategory: (c: SettingsCategory) => void }) {
  const [totpVerified] = useState(true);
  const [backupRemaining, setBackupRemaining] = useState(8);
  const [codesRevealed, setCodesRevealed] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [googleSsoConnected, setGoogleSsoConnected] = useState(true);
  const [sessions, setSessions] = useState<DeviceSession[]>(initialSessions);

  function endSession(id: string) {
    const target = sessions.find((s) => s.id === id);
    setSessions((cur) => cur.filter((s) => s.id !== id));
    if (target) notify(`${target.device} signed out`);
  }
  function endAllOtherSessions() {
    const count = sessions.filter((s) => !s.current).length;
    setSessions((cur) => cur.filter((s) => s.current));
    notify(`${count} other session${count === 1 ? "" : "s"} terminated — tokens revoked`);
  }
  function regenerateCodes() {
    setBackupRemaining(10);
    notify("New backup recovery codes generated");
  }

  const safeguards = [totpVerified, googleSsoConnected, backupRemaining > 0, sessions.length <= 3];
  const activeSafeguards = safeguards.filter(Boolean).length;
  const securityScore = Math.round((activeSafeguards / safeguards.length) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-1.5">
          <SettingsBreadcrumb current="Security" />
          <div className="flex flex-wrap items-baseline gap-3"><h1 className="text-[22px] font-bold tracking-tight text-[#151515]">Security Settings</h1><span className="flex items-center gap-1.5 rounded-full bg-[#E8F8F3] px-2.5 py-0.5 text-[11px] font-semibold text-[#0B7A57]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />Workspace Enforced</span></div>
          <p className="max-w-2xl text-[12px] text-[#8E929C]">Manage account authentication protocols, multi-factor backup procedures, active cross-device sessions, and enterprise federated access.</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-sm">
            <SettingsScoreRing score={securityScore} />
            <div className="flex flex-col"><span className="text-[12px] font-bold text-[#151515]">Security Score</span><span className="text-[11px] text-[#8E929C]">{activeSafeguards} of {safeguards.length} Safeguards Active</span></div>
          </div>
          <button type="button" onClick={() => setCategory("Audit Logs")} className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#F1F2F5]"><Receipt className="text-[16px] text-[#8E929C]" />Audit Logs</button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(155deg,#242424_0%,#121212_100%)] p-6 text-white shadow-[0_16px_36px_rgba(15,15,20,0.2)] lg:p-7">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex max-w-xl items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 shadow-inner backdrop-blur-md"><SealCheck weight="fill" className="text-[26px]" /></div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2"><span className="text-[16px] font-bold tracking-tight">Organization Guardrails Active</span><span className="rounded-full bg-[#58DDAC] px-2.5 py-0.5 text-[11px] font-bold text-[#00251A]">Compliance A+</span></div>
              <p className="text-[12px] text-[#A0A4AE]">Maya Singh&apos;s credential profile satisfies SOC2 Type II and GDPR operational guidelines. Two-factor enforcement is globally locked for all AILQS teammates.</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden text-right sm:block"><div className="text-[10px] text-[#A0A4AE]">Last Security Check</div><div className="font-mono text-[13px] font-bold text-white">Today, 08:42 GMT</div></div>
            <button type="button" onClick={() => notify("Running full security diagnostic…")} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-[12px] font-semibold text-white backdrop-blur-sm hover:bg-white/20"><ArrowClockwise className="text-[15px]" />Run Diagnostic</button>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#3152F4]/20 blur-3xl" />
      </div>

      <section className="flex flex-col gap-6 rounded-[22px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        <div className="flex flex-col justify-between gap-4 pb-1 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#DDE3FF] text-[#3152F4]"><Fingerprint className="text-[20px]" /></div>
            <div className="flex flex-col"><div className="flex items-center gap-2"><h2 className="text-[15px] font-bold text-[#151515]">Two-Factor Authentication (2FA)</h2><span className="flex items-center gap-1.5 rounded-full bg-[#E8F8F3] px-2.5 py-0.5 text-[11px] font-bold text-[#0B7A57]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />Active &amp; Enforced</span></div><span className="text-[12px] text-[#8E929C]">Requires a secondary proof of identity on each new device login.</span></div>
          </div>
          <span className="flex items-center gap-1.5 self-start rounded-lg bg-[#F1F2F5] px-3 py-1 text-[11px] font-semibold text-[#5E626D] sm:self-auto"><Scales className="text-[14px]" />Admin Policy: Enforced</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-between gap-4 rounded-2xl bg-[#F8F9FC] p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#3152F4] shadow-sm"><QrCode className="text-[18px]" /></div><div><h3 className="text-[13px] font-bold text-[#151515]">Authenticator App (TOTP)</h3><p className="text-[11px] text-[#8E929C]">1Password / Google Authenticator</p></div></div>
              <span className="flex items-center gap-1 rounded-full bg-[#E8F8F3] px-2 py-0.5 text-[11px] font-semibold text-[#0B7A57]"><Check weight="bold" className="text-[11px]" />Verified</span>
            </div>
            <div className="flex items-center justify-between pt-2 text-[11px] text-[#8E929C]"><span>Configured on 14 Jan 2026</span><button type="button" onClick={() => notify("Authenticator reconfiguration flow started")} className="text-[12px] font-semibold text-[#3152F4] hover:underline">Reconfigure</button></div>
          </div>
          <div className="flex flex-col justify-between gap-4 rounded-2xl bg-[#F8F9FC] p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#3152F4] shadow-sm"><Password className="text-[18px]" /></div><div><h3 className="text-[13px] font-bold text-[#151515]">Backup Recovery Codes</h3><p className="text-[11px] text-[#8E929C]">Emergency single-use bypass keys</p></div></div>
              <span className="rounded-lg bg-[#F1F2F5] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#151515]">{backupRemaining} of 10 remaining</span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-2">
              <button type="button" onClick={() => setCodesRevealed((v) => !v)} className="rounded-xl bg-white px-3 py-1.5 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#E5E8F5]">{codesRevealed ? "Hide Backup Codes" : "View Backup Codes"}</button>
              <button type="button" onClick={regenerateCodes} className="text-[12px] font-semibold text-[#8E929C] hover:text-[#151515]">Regenerate Codes</button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-xl bg-[#F1F2F5] p-4">
          <div className="flex min-w-0 items-center gap-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-[#5E626D]"><DeviceMobile className="text-[16px]" /></div><div className="flex min-w-0 flex-col"><span className="truncate text-[13px] font-semibold text-[#151515]">SMS Fallback Channel</span><span className="truncate text-[11px] text-[#8E929C]">Configured to UK mobile number: +44 •••• •••892</span></div></div>
          <ToggleSwitch checked={smsEnabled} onChange={() => { setSmsEnabled((v) => !v); notify(smsEnabled ? "SMS fallback disabled" : "SMS fallback enabled"); }} label="SMS fallback channel" />
        </div>
        {codesRevealed && (
          <div className="flex flex-col gap-3 rounded-2xl bg-[#151515] p-5 text-white">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[13px] font-bold"><Lock className="text-[16px] text-[#58DDAC]" />Unused Recovery Keys</span><button type="button" onClick={() => setCodesRevealed(false)} aria-label="Close" className="text-white/70 hover:text-white"><X className="text-[16px]" /></button></div>
            <p className="text-[11px] text-white/60">Store these keys securely offline. Each key can be used once when TOTP is unreachable.</p>
            <div className="grid grid-cols-2 gap-2 font-mono text-[12px] sm:grid-cols-4">{settingsBackupCodes.map((code) => <div key={code} className="rounded-lg bg-white/10 py-2 text-center tracking-wider">{code}</div>)}</div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => notify("All backup codes copied")} className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-semibold hover:bg-white/20"><Copy className="text-[14px]" />Copy All</button>
              <button type="button" onClick={() => notify("Backup codes downloaded as .txt")} className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-semibold hover:bg-white/20"><DownloadSimple className="text-[14px]" />Download .txt</button>
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-6 rounded-[22px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F1F2F5] text-[#5E626D]"><ShareNetwork className="text-[20px]" /></div><div><h2 className="text-[15px] font-bold text-[#151515]">Single Sign-On (SSO) &amp; Identities</h2><p className="text-[12px] text-[#8E929C]">Federated identity providers linked to your AILQS operator seat.</p></div></div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col justify-between gap-4 rounded-2xl bg-[#F8F9FC] p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm"><svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" /></svg></div>
              <div className="flex flex-col"><div className="flex flex-wrap items-center gap-2"><span className="text-[13px] font-bold text-[#151515]">Google Workspace SSO</span>{googleSsoConnected && <span className="flex items-center gap-1 rounded-full bg-[#E8F8F3] px-2 py-0.5 text-[11px] font-semibold text-[#0B7A57]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />Connected</span>}</div><span className="text-[11px] text-[#8E929C]">maya@ailqs.com • Connected Oct 2025</span></div>
            </div>
            {googleSsoConnected ? (
              <button type="button" onClick={() => { setGoogleSsoConnected(false); notify("Google Workspace SSO disconnected"); }} className="shrink-0 self-end rounded-xl bg-white px-3 py-1.5 text-[12px] font-semibold text-[#5E626D] shadow-sm hover:bg-[#FDF2F3] hover:text-[#F04452] sm:self-center">Disconnect</button>
            ) : (
              <button type="button" onClick={() => { setGoogleSsoConnected(true); notify("Google Workspace SSO connected"); }} className="shrink-0 self-end rounded-xl bg-[#3152F4] px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:opacity-95 sm:self-center">Connect</button>
            )}
          </div>
          <div className="flex flex-col justify-between gap-4 rounded-2xl bg-[#F8F9FC] p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#151515] shadow-sm"><Buildings className="text-[18px]" /></div><div className="flex flex-col"><div className="flex flex-wrap items-center gap-2"><span className="text-[13px] font-bold text-[#151515]">SAML 2.0 / Okta Enterprise</span><span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[11px] text-[#5E626D]">Enterprise Tier</span></div><span className="text-[11px] text-[#8E929C]">Centralize authentication with Azure AD, Okta, or PingIdentity</span></div></div>
            <button type="button" onClick={() => notify("Opening SAML configuration wizard")} className="flex shrink-0 items-center gap-1 self-end text-[12px] font-semibold text-[#3152F4] hover:underline sm:self-center">Configure SAML<ArrowRight className="text-[14px]" /></button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 rounded-[22px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        <div className="flex flex-col justify-between gap-4 pb-1 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F1F2F5] text-[#5E626D]"><Devices className="text-[20px]" /></div><div><h2 className="text-[15px] font-bold text-[#151515]">Active Browser &amp; Device Sessions</h2><p className="text-[12px] text-[#8E929C]">Locations and platforms currently authenticated to Maya Singh&apos;s account.</p></div></div>
          <button type="button" onClick={endAllOtherSessions} disabled={sessions.length <= 1} className="flex items-center gap-1.5 self-start rounded-xl bg-[#FDF2F3] px-3.5 py-2 text-[12px] font-semibold text-[#F04452] shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"><SignOut className="text-[15px]" />Sign out all other sessions</button>
        </div>
        <div className="flex flex-col gap-3">
          {sessions.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className={`flex flex-col justify-between gap-4 rounded-2xl p-4 shadow-sm transition-colors sm:flex-row sm:items-center ${s.current ? "bg-[#F1F3FF]" : "bg-[#F8F9FC] hover:bg-[#F1F2F5]"}`}>
                <div className="flex items-start gap-3.5 sm:items-center">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl shadow-sm ${s.current ? "bg-[#3152F4] text-white" : "bg-white text-[#5E626D]"}`}><Icon className="text-[18px]" /></div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-bold text-[#151515]">{s.device}</span>
                      {s.current ? (<><span className="rounded-full bg-[#3152F4] px-2 py-0.5 text-[10px] font-bold text-white">This Device</span><span className="flex items-center gap-1 text-[11px] font-semibold text-[#0B7A57]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0B7A57]" />Active Now</span></>) : (<span className="text-[11px] text-[#8E929C]">{s.lastActive}</span>)}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#8E929C]"><span className="flex items-center gap-1"><MapPin className="text-[12px]" />{s.location}</span><span>•</span><span className="font-mono text-[11px]">IP {s.ip}</span></div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                  {s.current ? <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#5E626D]">Primary Session</span> : <button type="button" onClick={() => endSession(s.id)} className="rounded-xl px-3 py-1.5 text-[12px] font-semibold text-[#F04452] hover:bg-[#FDF2F3]">End Session</button>}
                </div>
              </div>
            );
          })}
          {sessions.length === 1 && <p className="rounded-2xl bg-[#F8F9FC] p-4 text-center text-[12px] text-[#8E929C]">No other active sessions.</p>}
        </div>
      </section>

      <section className="flex flex-col gap-5 rounded-[22px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        <div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F1F2F5] text-[#5E626D]"><ClockCounterClockwise className="text-[20px]" /></div><div><h2 className="text-[15px] font-bold text-[#151515]">Recent Authentication History</h2><p className="text-[12px] text-[#8E929C]">Real-time log of credentials, token refreshes, and access verification events.</p></div></div><button type="button" onClick={() => setCategory("Audit Logs")} className="hidden items-center gap-1 text-[12px] font-semibold text-[#3152F4] hover:underline sm:flex">View in Audit Logs<ArrowRight className="text-[14px]" /></button></div>
        <div className="overflow-x-auto rounded-2xl bg-[#F8F9FC]">
          <table className="w-full border-collapse text-left">
            <thead><tr className="bg-[#F1F2F5]/60 text-[10px] font-bold uppercase tracking-wide text-[#8E929C]"><th className="px-4 py-3">Timestamp (UTC)</th><th className="px-4 py-3">Authentication Event</th><th className="px-4 py-3">Device &amp; User Agent</th><th className="px-4 py-3">Location &amp; Network</th><th className="px-4 py-3 text-right">Status</th></tr></thead>
            <tbody className="text-[12px] text-[#151515]">
              {authHistory.map((row) => {
                const Icon = row.icon;
                return (
                  <tr key={row.id} className={`transition-colors hover:bg-[#F1F2F5]/60 ${row.flagged ? "bg-[#FDF2F3]/40" : ""}`}>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[#8E929C]">{row.time}</td>
                    <td className="whitespace-nowrap px-4 py-3"><span className="flex items-center gap-2"><Icon className="text-[15px]" style={{ color: row.iconColor }} />{row.event}</span></td>
                    <td className="whitespace-nowrap px-4 py-3">{row.device}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#8E929C]">{row.location} • <span className="font-mono text-[11px]">{row.ip}</span></td>
                    <td className="whitespace-nowrap px-4 py-3 text-right"><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${row.status === "Success" ? "bg-[#E8F8F3] text-[#0B7A57]" : "bg-[#FEF8EC] text-[#F5A524]"}`}>{row.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

type PipelineCategory = "Demonstration & Discovery" | "Prospecting & Inbound" | "Sales Qualified" | "Proposal & Closing";
const pipelineCategoryOptions: PipelineCategory[] = ["Demonstration & Discovery", "Prospecting & Inbound", "Sales Qualified", "Proposal & Closing"];
const pipelineStageColors = ["#64748B", "#0284C7", "#0D9488", "#4F46E5", "#9333EA", "#0891B2", "#047857", "#A21CAF"];
interface PipelineStageAutomations { autoAdvance: boolean; followUpTask: boolean; requireDealValue: boolean; slackAlert: boolean }
interface PipelineStageDef {
  id: number; name: string; tag: string; color: string; closed: boolean; staleDays: number | null; winRate: number;
  active: boolean; category: PipelineCategory; description: string; automations: PipelineStageAutomations;
}
const defaultAutomations: PipelineStageAutomations = { autoAdvance: false, followUpTask: false, requireDealValue: false, slackAlert: false };
const initialPipelineStages: PipelineStageDef[] = [
  { id: 1, name: "New", tag: "Initial Inbound", color: "#64748B", closed: false, staleDays: 3, winRate: 10, active: true, category: "Prospecting & Inbound", description: "Visitor has submitted contact details via the AI chat widget but has not been engaged yet.", automations: defaultAutomations },
  { id: 2, name: "Qualified", tag: "AI Verified", color: "#0284C7", closed: false, staleDays: 5, winRate: 25, active: true, category: "Prospecting & Inbound", description: "Nova AI has verified budget, timeline, and authority signals meet the qualification threshold.", automations: defaultAutomations },
  { id: 3, name: "Contacted", tag: "Sales Outreach", color: "#0D9488", closed: false, staleDays: 4, winRate: 40, active: true, category: "Prospecting & Inbound", description: "A sales rep has made first outbound contact following AI qualification.", automations: defaultAutomations },
  { id: 4, name: "Meeting Scheduled", tag: "Calendar Booked", color: "#4F46E5", closed: false, staleDays: 7, winRate: 60, active: true, category: "Demonstration & Discovery", description: "Lead has booked an introductory or discovery call via Nova calendar widget or Calendly integration.", automations: { autoAdvance: true, followUpTask: true, requireDealValue: false, slackAlert: true } },
  { id: 5, name: "Proposal Sent", tag: "Commercial Quote", color: "#9333EA", closed: false, staleDays: 10, winRate: 75, active: true, category: "Proposal & Closing", description: "A commercial proposal or quote has been sent for review.", automations: defaultAutomations },
  { id: 6, name: "Negotiation", tag: "Legal / Security", color: "#D97706", closed: false, staleDays: 7, winRate: 85, active: true, category: "Proposal & Closing", description: "Deal is in legal, security, or procurement review ahead of signature.", automations: defaultAutomations },
  { id: 7, name: "Won", tag: "Closed Won", color: "#047857", closed: true, staleDays: null, winRate: 100, active: true, category: "Proposal & Closing", description: "Deal has closed and the contract is signed.", automations: defaultAutomations },
  { id: 8, name: "Lost", tag: "Closed Lost", color: "#94A3B8", closed: true, staleDays: null, winRate: 0, active: true, category: "Proposal & Closing", description: "Deal was not won; a Loss Reason is required to close out this stage.", automations: defaultAutomations },
  { id: 9, name: "Disqualified", tag: "Closed Disqualified", color: "#71717A", closed: true, staleDays: null, winRate: 0, active: true, category: "Prospecting & Inbound", description: "Lead did not meet minimum qualification criteria and was filtered out.", automations: defaultAutomations },
];

function LossReasonChips({ reasons, onAdd, onRemove }: { reasons: { label: string; count: number }[]; onAdd: (label: string) => void; onRemove: (idx: number) => void }) {
  const [draft, setDraft] = useState("");
  function commit() { const v = draft.trim(); if (!v) return; onAdd(v); setDraft(""); }
  return (
    <div className="flex flex-wrap items-center gap-2">
      {reasons.map((r, idx) => (
        <span key={`${r.label}-${idx}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F2F5] px-3 py-1 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5]">
          <span>{r.label}</span><span className="font-mono text-[11px] text-[#8E929C]">({r.count})</span>
          <button type="button" onClick={() => onRemove(idx)} aria-label={`Remove ${r.label}`} className="text-[#8E929C] hover:text-[#F04452]"><X className="text-[11px]" /></button>
        </span>
      ))}
      <input name="lossReasonDraft" aria-label="Add loss reason" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } }} onBlur={commit} placeholder="+ Add Reason" className="w-28 rounded-full bg-[#F1F2F5] px-3 py-1.5 text-[12px] font-semibold text-[#3152F4] outline-none placeholder:text-[#3152F4] focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
    </div>
  );
}

function SettingsLeadPipelineTab({ notify, setSection }: { notify: (v: string) => void; setSection: (v: string) => void }) {
  const [savedStages, setSavedStages] = useState<PipelineStageDef[]>(initialPipelineStages);
  const [draftStages, setDraftStages] = useState<PipelineStageDef[]>(initialPipelineStages);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(4);
  const [editingStage, setEditingStage] = useState<PipelineStageDef | null>(initialPipelineStages[3]);
  const dragId = useRef<number | null>(null);
  const nextId = useRef(10);

  const dirty = JSON.stringify(savedStages) !== JSON.stringify(draftStages);

  function openStage(stage: PipelineStageDef) { setSelectedStageId(stage.id); setEditingStage(stage); }
  function closeDrawer() { setSelectedStageId(null); setEditingStage(null); }
  function updateEditing<K extends keyof PipelineStageDef>(key: K, value: PipelineStageDef[K]) { setEditingStage((cur) => (cur ? { ...cur, [key]: value } : cur)); }
  function updateAutomation(key: keyof PipelineStageAutomations) { setEditingStage((cur) => (cur ? { ...cur, automations: { ...cur.automations, [key]: !cur.automations[key] } } : cur)); }
  function cancelEdit() { const orig = draftStages.find((s) => s.id === selectedStageId); setEditingStage(orig ?? null); }
  function commitEdit() {
    if (!editingStage) return;
    setDraftStages((cur) => cur.map((s) => (s.id === editingStage.id ? editingStage : s)));
    notify(`${editingStage.name} stage updated`);
  }
  function toggleActive(id: number) { setDraftStages((cur) => cur.map((s) => (s.id === id ? { ...s, active: !s.active } : s))); }
  function addStage() {
    const id = nextId.current++;
    const stage: PipelineStageDef = { id, name: "New Stage", tag: "Custom", color: pipelineStageColors[id % pipelineStageColors.length], closed: false, staleDays: 7, winRate: 20, active: true, category: "Prospecting & Inbound", description: "", automations: defaultAutomations };
    setDraftStages((cur) => [...cur, stage]);
    openStage(stage);
    notify("Pipeline stage added");
  }
  function handleDrop(targetId: number) {
    if (dragId.current === null || dragId.current === targetId) return;
    setDraftStages((cur) => {
      const from = cur.findIndex((s) => s.id === dragId.current);
      const to = cur.findIndex((s) => s.id === targetId);
      if (from === -1 || to === -1) return cur;
      const next = [...cur];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    dragId.current = null;
  }
  function discardAll() { setDraftStages(savedStages); closeDrawer(); notify("Pipeline changes discarded"); }
  function saveAll() { setSavedStages(draftStages); notify("Pipeline changes saved"); }

  const [lossReasons, setLossReasons] = useState([
    { label: "Price / Budget Constraint", count: 42 }, { label: "Competitor Chosen", count: 28 }, { label: "Ghosted / Unresponsive", count: 19 }, { label: "Timing / Postponed", count: 15 }, { label: "Missing Feature / Integration", count: 11 },
  ]);
  const [requireLossNote, setRequireLossNote] = useState(true);
  const [disqualificationReasons, setDisqualificationReasons] = useState(["Student / Academic Inquiry", "Job Seeker / Vendor Pitch", "Outside Service Area / Geography", "Budget under threshold (<€2,500)", "Spam / Invalid Contact Info"]);
  const [excludeDisqualified, setExcludeDisqualified] = useState(true);
  const [duplicateRules, setDuplicateRules] = useState({ email: "Merge logs & keep highest score", phone: "Link to existing lead profile", domain: "Associate as secondary contact" });
  const [notifyDuplicateOwner, setNotifyDuplicateOwner] = useState(true);
  const [routingMethod, setRoutingMethod] = useState<"Round Robin" | "Weighted Capacity" | "Territory Rules">("Round Robin");

  return (
    <div className="flex flex-col gap-6 pb-16">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-1">
          <SettingsBreadcrumb current="Lead Pipeline" />
          <div className="flex flex-wrap items-center gap-2.5"><h1 className="text-[22px] font-bold tracking-tight text-[#151515]">Lead Pipeline</h1><span className="flex items-center gap-1.5 rounded-full bg-[#F1F2F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#5E626D]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />Standard B2B Pipeline (Active)</span></div>
          <p className="max-w-2xl text-[12px] text-[#8E929C]">Configure stage milestones, win probabilities, automated conversion triggers, and operational hygiene rules for inbound sales.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <button type="button" onClick={discardAll} disabled={!dirty} className="rounded-xl bg-[#F1F2F5] px-4 py-2 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5] disabled:cursor-not-allowed disabled:opacity-50">Discard</button>
          <button type="button" onClick={saveAll} disabled={!dirty} className="flex items-center gap-1.5 rounded-xl bg-[#3152F4] px-4 py-2 text-[12px] font-bold text-white shadow-[0_6px_18px_rgba(49,82,244,0.28)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"><FloppyDisk className="text-[15px]" />Save Pipeline Changes</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <section className="flex flex-col gap-3 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
            <div className="flex flex-col"><h2 className="text-[16px] font-bold text-[#151515]">Pipeline Stages &amp; Progression</h2><p className="text-[11px] text-[#8E929C]">Drag to reorder stages. Configure deal probability and automated progression triggers.</p></div>
            <button type="button" onClick={addStage} className="flex shrink-0 items-center gap-1 rounded-xl bg-[#F1F2F5] px-3 py-1.5 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5]"><Plus className="text-[15px]" />Add Stage</button>
          </div>
          <div className="flex flex-col gap-2">
            {draftStages.map((stage) => {
              const selected = stage.id === selectedStageId;
              return (
                <div key={stage.id} draggable onDragStart={() => { dragId.current = stage.id; }} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(stage.id)}
                  className={`flex cursor-grab items-center justify-between rounded-xl p-3 transition-colors ${selected ? "bg-[#EAEDFB] shadow-sm" : "bg-[#F8F9FC] hover:bg-[#F1F2F5]"}`}>
                  <div className="flex min-w-0 items-center gap-3">
                    <DotsSixVertical className={`shrink-0 text-[18px] ${selected ? "text-[#3152F4]" : "text-[#8E929C]"}`} />
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: stage.color, boxShadow: selected ? `0 0 8px ${stage.color}80` : undefined }} />
                    <div className="flex min-w-0 flex-col">
                      <div className="flex items-center gap-2"><span className={`truncate text-[13px] font-bold ${selected ? "text-[#3152F4]" : "text-[#151515]"}`}>{stage.name}</span><span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${selected ? "bg-[#3152F4]/10 text-[#3152F4]" : "bg-[#F1F2F5] text-[#8E929C]"}`}>{stage.tag}</span></div>
                      <span className="text-[11px] text-[#8E929C]">{stage.closed ? "Closed milestone" : `Stale after ${stage.staleDays} days`} • {stage.winRate}% Win Rate</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`font-mono text-[12px] ${selected ? "font-bold text-[#3152F4]" : stage.winRate === 100 ? "font-bold text-[#0B7A57]" : "text-[#151515]"}`}>{stage.winRate}%</span>
                    <ToggleSwitch checked={stage.active} onChange={() => toggleActive(stage.id)} label={`${stage.name} active`} />
                    <button type="button" onClick={() => openStage(stage)} aria-label={`Edit ${stage.name}`} className={`rounded-lg p-1.5 ${selected ? "bg-white text-[#3152F4] shadow-sm" : "text-[#8E929C] hover:bg-white hover:text-[#151515]"}`}><NotePencil className="text-[16px]" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:col-span-5">
          {editingStage ? (
            <>
              <div className="flex items-center justify-between border-b border-[#F1F2F5] pb-3">
                <div className="flex flex-col"><div className="flex items-center gap-2"><h3 className="text-[15px] font-bold text-[#151515]">Edit Stage</h3><span className="rounded-full bg-[#3152F4]/10 px-2 py-0.5 text-[11px] font-semibold text-[#3152F4]">Stage #{draftStages.findIndex((s) => s.id === editingStage.id) + 1} • {editingStage.closed ? "Closed" : "Open"}</span></div><span className="text-[11px] text-[#8E929C]">{editingStage.name}</span></div>
                <button type="button" onClick={closeDrawer} aria-label="Close edit stage panel" className="rounded-lg p-1 text-[#8E929C] hover:bg-[#F1F2F5]"><X className="text-[18px]" /></button>
              </div>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5"><span className="text-[12px] font-semibold text-[#151515]">Stage Name</span><input name="stageName" value={editingStage.name} onChange={(e) => updateEditing("name", e.target.value)} className="h-10 rounded-xl bg-[#F1F2F5] px-3 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" /></label>
                <label className="flex flex-col gap-1.5"><span className="text-[12px] font-semibold text-[#151515]">Pipeline Category</span>
                  <div className="relative"><select name="stageCategory" value={editingStage.category} onChange={(e) => updateEditing("category", e.target.value as PipelineCategory)} className="h-10 w-full appearance-none rounded-xl bg-[#F1F2F5] px-3 pr-8 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">{pipelineCategoryOptions.map((c) => <option key={c}>{c}</option>)}</select><CaretDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#8E929C]" /></div>
                </label>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-[#151515]">Win Probability (%)</span><span className="font-mono text-[13px] font-bold text-[#3152F4]">{editingStage.winRate}%</span></div>
                  <input name="winProbability" type="range" min={0} max={100} value={editingStage.winRate} onChange={(e) => updateEditing("winRate", Number(e.target.value))} className="w-full accent-[#3152F4]" aria-label="Win probability" />
                  <span className="text-[11px] text-[#8E929C]">Used for weighted pipeline forecasting (<strong className="font-semibold text-[#151515]">$344k</strong> current pipeline).</span>
                </div>
                <label className="flex flex-col gap-1.5"><span className="text-[12px] font-semibold text-[#151515]">Stage Description</span><textarea name="stageDescription" rows={2} value={editingStage.description} onChange={(e) => updateEditing("description", e.target.value)} className="resize-none rounded-xl bg-[#F1F2F5] p-3 text-[12px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" /></label>
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-semibold text-[#151515]">Stage Color Milestone</span>
                  <div className="flex flex-wrap items-center gap-2.5">{pipelineStageColors.map((c) => (
                    <button key={c} type="button" onClick={() => updateEditing("color", c)} aria-label={`Use color ${c}`} className={`h-6 w-6 rounded-full transition-transform hover:scale-110 ${editingStage.color === c ? "scale-110 shadow-sm ring-2 ring-[#3152F4] ring-offset-2 ring-offset-white" : ""}`} style={{ background: c }} />
                  ))}</div>
                  <p className="text-[11px] text-[#8E929C]">Stage colors indicate sales process state and do not conflict with Hot / Warm / Cold qualification temperatures.</p>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <span className="text-[12px] font-semibold text-[#151515]">Automation Behaviors &amp; Triggers</span>
                  <label className="flex cursor-pointer items-start gap-2.5"><input name="autoAdvance" type="checkbox" checked={editingStage.automations.autoAdvance} onChange={() => updateAutomation("autoAdvance")} className="mt-0.5 h-4 w-4 rounded accent-[#3152F4]" /><span className="text-[12px] text-[#151515]">Auto-advance stage when visitor books a calendar slot in AI chat</span></label>
                  <label className="flex cursor-pointer items-start gap-2.5"><input name="followUpTask" type="checkbox" checked={editingStage.automations.followUpTask} onChange={() => updateAutomation("followUpTask")} className="mt-0.5 h-4 w-4 rounded accent-[#3152F4]" /><span className="text-[12px] text-[#151515]">Create high-priority Follow-up task 2 hours before scheduled meeting</span></label>
                  <label className="flex cursor-pointer items-start gap-2.5"><input name="requireDealValue" type="checkbox" checked={editingStage.automations.requireDealValue} onChange={() => updateAutomation("requireDealValue")} className="mt-0.5 h-4 w-4 rounded accent-[#3152F4]" /><span className="text-[12px] text-[#8E929C]">Require deal value before moving past this stage</span></label>
                  <label className="flex cursor-pointer items-start gap-2.5"><input name="slackAlert" type="checkbox" checked={editingStage.automations.slackAlert} onChange={() => updateAutomation("slackAlert")} className="mt-0.5 h-4 w-4 rounded accent-[#3152F4]" /><span className="text-[12px] text-[#151515]">Send Slack alert to <span className="font-mono text-[#3152F4]">#leads-slack</span> when deal reaches this stage</span></label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2.5 border-t border-[#F1F2F5] pt-3">
                <button type="button" onClick={cancelEdit} className="rounded-xl bg-[#F1F2F5] px-3.5 py-1.5 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5]">Cancel</button>
                <button type="button" onClick={commitEdit} className="rounded-xl bg-[#3152F4] px-4 py-1.5 text-[12px] font-bold text-white shadow-sm hover:opacity-95">Update Stage</button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
              <NotePencil className="text-[28px] text-[#C4C5D9]" />
              <p className="text-[12px] text-[#8E929C]">Select a stage&apos;s edit icon to configure its name, probability, and automations.</p>
            </div>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="flex flex-col justify-between gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[15px] font-bold text-[#151515]"><ThumbsDown className="text-[18px] text-[#8E929C]" />Loss Reasons</span><span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[11px] font-semibold text-[#5E626D]">{lossReasons.length} Active</span></div>
            <p className="text-[11px] text-[#8E929C]">Predefined reasons required when marking a deal as Closed Lost.</p>
            <LossReasonChips reasons={lossReasons} onAdd={(label) => { setLossReasons((cur) => [...cur, { label, count: 0 }]); notify(`Loss reason "${label}" added`); }} onRemove={(idx) => setLossReasons((cur) => cur.filter((_, i) => i !== idx))} />
          </div>
          <div className="flex items-center justify-between border-t border-[#F1F2F5] pt-3"><span className="text-[12px] text-[#151515]">Require mandatory Loss Reason note</span><ToggleSwitch checked={requireLossNote} onChange={() => { setRequireLossNote((v) => !v); notify(requireLossNote ? "Loss Reason note no longer required" : "Loss Reason note required"); }} label="Require mandatory Loss Reason note" /></div>
        </section>

        <section className="flex flex-col justify-between gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[15px] font-bold text-[#151515]"><FunnelSimple className="text-[18px] text-[#8E929C]" />Disqualification Reasons</span><span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[11px] font-semibold text-[#5E626D]">{disqualificationReasons.length} Criteria</span></div>
            <p className="text-[11px] text-[#8E929C]">Criteria for filtering out spam, job seekers, or mismatched inbound queries.</p>
            <TagChipInput name="disqualificationReasons" tags={disqualificationReasons} onAdd={(v) => { setDisqualificationReasons((cur) => [...cur, v]); notify(`Disqualification reason "${v}" added`); }} onRemove={(idx) => setDisqualificationReasons((cur) => cur.filter((_, i) => i !== idx))} placeholder="+ Add Disqualification Reason" />
          </div>
          <div className="flex items-center justify-between border-t border-[#F1F2F5] pt-3"><span className="text-[12px] text-[#151515]">Exclude disqualified leads from conversion analytics</span><ToggleSwitch checked={excludeDisqualified} onChange={() => { setExcludeDisqualified((v) => !v); notify(excludeDisqualified ? "Disqualified leads included in analytics" : "Disqualified leads excluded from analytics"); }} label="Exclude disqualified leads from conversion analytics" /></div>
        </section>

        <section className="flex flex-col justify-between gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[15px] font-bold text-[#151515]"><Copy className="text-[18px] text-[#8E929C]" />Duplicate Matching &amp; Merging Rules</span><span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[11px] font-semibold text-[#5E626D]">Automated</span></div>
            <p className="text-[11px] text-[#8E929C]">Define how Nova AI handles returning visitors and duplicate CRM contacts.</p>
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-2 rounded-xl bg-[#F8F9FC] p-2.5 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-2 text-[12px] font-semibold text-[#151515]"><Envelope className="text-[16px] text-[#3152F4]" />Match by Normalized Email Address</span>
                <div className="relative min-w-[190px]"><select name="matchByEmail" value={duplicateRules.email} onChange={(e) => setDuplicateRules((cur) => ({ ...cur, email: e.target.value }))} className="w-full appearance-none rounded-lg bg-white px-2.5 py-1 pr-7 text-[11px] text-[#151515] outline-none focus:ring-2 focus:ring-[#3152F4]/20">{["Merge logs & keep highest score", "Always create secondary lead"].map((o) => <option key={o}>{o}</option>)}</select><CaretDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[13px] text-[#8E929C]" /></div>
              </div>
              <div className="flex flex-col gap-2 rounded-xl bg-[#F8F9FC] p-2.5 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-2 text-[12px] font-semibold text-[#151515]"><Phone className="text-[16px] text-[#3152F4]" />Match by Phone / WhatsApp number</span>
                <div className="relative min-w-[190px]"><select name="matchByPhone" value={duplicateRules.phone} onChange={(e) => setDuplicateRules((cur) => ({ ...cur, phone: e.target.value }))} className="w-full appearance-none rounded-lg bg-white px-2.5 py-1 pr-7 text-[11px] text-[#151515] outline-none focus:ring-2 focus:ring-[#3152F4]/20">{["Link to existing lead profile", "Prompt human sales rep"].map((o) => <option key={o}>{o}</option>)}</select><CaretDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[13px] text-[#8E929C]" /></div>
              </div>
              <div className="flex flex-col gap-2 rounded-xl bg-[#F8F9FC] p-2.5 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-2 text-[12px] font-semibold text-[#151515]"><Buildings className="text-[16px] text-[#3152F4]" />Match by Company Domain</span>
                <div className="relative min-w-[190px]"><select name="matchByDomain" value={duplicateRules.domain} onChange={(e) => setDuplicateRules((cur) => ({ ...cur, domain: e.target.value }))} className="w-full appearance-none rounded-lg bg-white px-2.5 py-1 pr-7 text-[11px] text-[#151515] outline-none focus:ring-2 focus:ring-[#3152F4]/20">{["Associate as secondary contact", "Do not auto-link"].map((o) => <option key={o}>{o}</option>)}</select><CaretDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[13px] text-[#8E929C]" /></div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[#F1F2F5] pt-3"><span className="text-[12px] text-[#151515]">Notify lead owner when a duplicate interaction is detected</span><ToggleSwitch checked={notifyDuplicateOwner} onChange={() => { setNotifyDuplicateOwner((v) => !v); notify(notifyDuplicateOwner ? "Duplicate interaction notifications disabled" : "Duplicate interaction notifications enabled"); }} label="Notify lead owner when a duplicate interaction is detected" /></div>
        </section>

        <section className="flex flex-col justify-between gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[15px] font-bold text-[#151515]"><GitFork className="text-[18px] text-[#8E929C]" />Default Lead Assignment &amp; Routing</span><span className="rounded-full bg-[#3152F4]/10 px-2 py-0.5 text-[11px] font-semibold text-[#3152F4]">Active Pool</span></div>
            <p className="text-[11px] text-[#8E929C]">Assign unrouted or freshly qualified pipeline leads.</p>
            <div className="flex items-center gap-1 rounded-xl bg-[#F1F2F5] p-1">
              {(["Round Robin", "Weighted Capacity", "Territory Rules"] as const).map((m) => (
                <button key={m} type="button" onClick={() => { setRoutingMethod(m); notify(`Routing method set to ${m}`); }} className={`flex-1 rounded-lg py-1.5 text-center text-[11px] font-semibold transition-colors ${routingMethod === m ? "bg-[#3152F4] text-white shadow-sm" : "text-[#5E626D] hover:text-[#151515]"}`}>{m}</button>
              ))}
            </div>
            <div className="flex flex-col gap-2 rounded-xl bg-[#F8F9FC] p-3">
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Active Distribution Pool</span><button type="button" onClick={() => setSection("Team")} className="flex items-center gap-0.5 text-[11px] font-semibold text-[#3152F4] hover:underline">Manage in Team Settings<ArrowRight className="text-[12px]" /></button></div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-[#151515] shadow-sm">Maya Singh (40%)</span>
                <span className="rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-[#151515] shadow-sm">Arjun Mehta (30%)</span>
                <span className="rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-[#151515] shadow-sm">Riya Sen (30%)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[#F1F2F5] pt-3"><span className="text-[12px] text-[#8E929C]">Fallback Lead Owner</span><div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#DDE3FF] text-[10px] font-bold text-[#151515]">MS</span><span className="text-[12px] font-semibold text-[#151515]">Maya Singh (Product Lead)</span></div></div>
        </section>
      </div>

      {dirty && (
        <div className="fixed bottom-8 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 items-center justify-between gap-5 rounded-2xl bg-[#151515] px-5 py-3.5 text-white shadow-[0_20px_45px_rgba(0,0,0,0.24)] md:w-auto">
          <div className="flex min-w-0 items-center gap-3"><span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[#58DDAC]" /><span className="truncate text-[12px]">Careful — you have unsaved changes in <strong className="font-semibold">Lead Pipeline</strong>.</span></div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={discardAll} className="rounded-xl px-3 py-1.5 text-[12px] font-semibold text-white/80 hover:bg-white/10">Discard</button>
            <button type="button" onClick={saveAll} className="rounded-xl bg-[#3152F4] px-3.5 py-1.5 text-[12px] font-bold text-white shadow-[0_4px_12px_rgba(49,82,244,0.35)] hover:opacity-95">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsCustomFieldsTab({ notify }: { notify: (v: string) => void }) {
  const [leadTags, setLeadTags] = useState(["High Intent", "Enterprise", "Trial", "Champion"]);
  const [customFields, setCustomFields] = useState(["Company Size", "Annual Revenue", "Preferred Contact Time"]);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5"><SettingsBreadcrumb current="Custom Fields & Tags" /><h1 className="text-[22px] font-bold tracking-tight text-[#151515]">Custom Fields &amp; Tags</h1><p className="max-w-2xl text-[12px] text-[#8E929C]">Add lead tags and custom CRM fields captured during qualification.</p></div>
      <section className="flex flex-col gap-3 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        <span className="text-[13px] font-bold text-[#151515]">Lead Tags</span>
        <TagChipInput name="leadTags" tags={leadTags} onAdd={(v) => { setLeadTags((cur) => [...cur, v]); notify(`Tag "${v}" added`); }} onRemove={(idx) => setLeadTags((cur) => cur.filter((_, i) => i !== idx))} placeholder="+ Add tag" />
      </section>
      <section className="flex flex-col gap-3 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        <span className="text-[13px] font-bold text-[#151515]">Custom CRM Fields</span>
        <TagChipInput name="customFields" tags={customFields} onAdd={(v) => { setCustomFields((cur) => [...cur, v]); notify(`Field "${v}" added`); }} onRemove={(idx) => setCustomFields((cur) => cur.filter((_, i) => i !== idx))} placeholder="+ Add field" />
      </section>
    </div>
  );
}

const settingsBrandColors = ["#3152F4", "#0B7A57", "#F04452", "#F5A524", "#6D28D9", "#151515"];
function SettingsBrandingTab({ notify }: { notify: (v: string) => void }) {
  const [color, setColor] = useState("#3152F4");
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5"><SettingsBreadcrumb current="Branding" /><h1 className="text-[22px] font-bold tracking-tight text-[#151515]">Branding</h1><p className="max-w-2xl text-[12px] text-[#8E929C]">Set the accent color used across your chat widget, email alerts, and shared reports.</p></div>
      <section className="flex flex-col gap-5 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        <span className="text-[13px] font-bold text-[#151515]">Accent Color</span>
        <div className="flex flex-wrap items-center gap-2.5">
          {settingsBrandColors.map((c) => (
            <button key={c} type="button" onClick={() => { setColor(c); notify("Accent color updated"); }} aria-label={`Use ${c}`} className={`h-9 w-9 rounded-full shadow-sm transition-transform hover:scale-110 ${color === c ? "ring-2 ring-offset-2 ring-[#151515]" : ""}`} style={{ background: c }} />
          ))}
          <label className="flex items-center gap-2 rounded-xl bg-[#F1F2F5] px-3 py-2 text-[12px] font-semibold text-[#151515]">Custom<input name="customColor" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0" /></label>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#F8F9FC] p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white" style={{ background: color }}><Sparkle weight="fill" className="text-[18px]" /></span>
          <div className="flex flex-col"><span className="text-[13px] font-semibold text-[#151515]">Widget Header Preview</span><span className="text-[11px] text-[#8E929C]">This is how your accent color appears to visitors</span></div>
        </div>
      </section>
    </div>
  );
}

interface BusinessHourRow { day: string; open: boolean; start: string; end: string; }
function SettingsBusinessHoursTab({ notify }: { notify: (v: string) => void }) {
  const [hours, setHours] = useState<BusinessHourRow[]>([
    { day: "Monday", open: true, start: "09:00", end: "18:00" },
    { day: "Tuesday", open: true, start: "09:00", end: "18:00" },
    { day: "Wednesday", open: true, start: "09:00", end: "18:00" },
    { day: "Thursday", open: true, start: "09:00", end: "18:00" },
    { day: "Friday", open: true, start: "09:00", end: "17:00" },
    { day: "Saturday", open: false, start: "10:00", end: "14:00" },
    { day: "Sunday", open: false, start: "10:00", end: "14:00" },
  ]);
  function toggleDay(day: string) { setHours((cur) => cur.map((h) => (h.day === day ? { ...h, open: !h.open } : h))); }
  function updateTime(day: string, field: "start" | "end", value: string) { setHours((cur) => cur.map((h) => (h.day === day ? { ...h, [field]: value } : h))); }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5"><SettingsBreadcrumb current="Business Hours" /><h1 className="text-[22px] font-bold tracking-tight text-[#151515]">Business Hours</h1><p className="max-w-2xl text-[12px] text-[#8E929C]">Nova hands off to a human queue outside these hours instead of over-promising a callback.</p></div>
      <section className="flex flex-col gap-2.5 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        {hours.map((h) => (
          <div key={h.day} className="grid grid-cols-[44px_100px_1fr] items-center gap-4 rounded-2xl bg-[#F8F9FC] p-3.5">
            <ToggleSwitch checked={h.open} onChange={() => { toggleDay(h.day); notify(`${h.day} marked ${h.open ? "closed" : "open"}`); }} label={`${h.day} open`} />
            <span className="text-[13px] font-semibold text-[#151515]">{h.day}</span>
            {h.open ? (
              <div className="flex items-center gap-2 text-[12px] text-[#5E626D]">
                <input name={`${h.day}-start`} type="time" value={h.start} onChange={(e) => updateTime(h.day, "start", e.target.value)} className="rounded-lg bg-white px-2 py-1.5 shadow-sm outline-none focus:ring-2 focus:ring-[#3152F4]/20" />
                <span>to</span>
                <input name={`${h.day}-end`} type="time" value={h.end} onChange={(e) => updateTime(h.day, "end", e.target.value)} className="rounded-lg bg-white px-2 py-1.5 shadow-sm outline-none focus:ring-2 focus:ring-[#3152F4]/20" />
              </div>
            ) : <span className="text-[12px] text-[#8E929C]">Closed — AI handles overnight intake</span>}
          </div>
        ))}
      </section>
    </div>
  );
}

function SettingsPrivacyTab({ notify }: { notify: (v: string) => void }) {
  const [cookieBanner, setCookieBanner] = useState(true);
  const [honorDnt, setHonorDnt] = useState(false);
  const [retention, setRetention] = useState("24 months");
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5"><SettingsBreadcrumb current="Privacy & Data" /><div className="flex flex-wrap items-center gap-2"><h1 className="text-[22px] font-bold tracking-tight text-[#151515]">Privacy &amp; Data</h1><span className="rounded-full bg-[#F1F2F5] px-2.5 py-0.5 text-[11px] font-bold text-[#0B7A57]">GDPR</span></div><p className="max-w-2xl text-[12px] text-[#8E929C]">Control consent capture and how long visitor conversation data is retained.</p></div>
      <section className="flex flex-col gap-4 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#F8F9FC] p-4"><div className="flex flex-col"><span className="text-[13px] font-semibold text-[#151515]">Cookie consent banner</span><span className="text-[11px] text-[#8E929C]">Shown before the widget starts a conversation</span></div><ToggleSwitch checked={cookieBanner} onChange={() => { setCookieBanner((v) => !v); notify(cookieBanner ? "Cookie banner disabled" : "Cookie banner enabled"); }} label="Cookie consent banner" /></div>
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#F8F9FC] p-4"><div className="flex flex-col"><span className="text-[13px] font-semibold text-[#151515]">Honor Do Not Track</span><span className="text-[11px] text-[#8E929C]">Skip analytics capture for DNT visitors</span></div><ToggleSwitch checked={honorDnt} onChange={() => { setHonorDnt((v) => !v); notify(honorDnt ? "Do Not Track ignored" : "Do Not Track honored"); }} label="Honor Do Not Track" /></div>
        <label className="flex flex-col gap-2 rounded-2xl bg-[#F8F9FC] p-4"><span className="text-[13px] font-semibold text-[#151515]">Conversation data retention</span>
          <select name="dataRetention" value={retention} onChange={(e) => setRetention(e.target.value)} className="w-full max-w-xs rounded-xl bg-white px-3 py-2 text-[12px] text-[#151515] shadow-sm outline-none focus:ring-2 focus:ring-[#3152F4]/20">
            {["6 months", "12 months", "24 months", "Indefinite"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <button type="button" onClick={() => notify("Compliance report downloaded")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F1F2F5] py-2.5 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5]"><DownloadSimple className="text-[16px]" />Download Compliance Report</button>
      </section>
    </div>
  );
}

type ApiKeyEnvironment = "Production" | "Staging";
type ApiScopeKey = "leads:read" | "leads:write" | "conversations:read" | "workspace:admin";
const apiScopeCatalog: { key: ApiScopeKey; description: string }[] = [
  { key: "leads:read", description: "Read lead attributes, conversation states, and qualification scores" },
  { key: "leads:write", description: "Create or update inbound contacts and push status updates via API" },
  { key: "conversations:read", description: "Access full customer-facing AI agent chat transcripts & audits" },
  { key: "workspace:admin", description: "Modify workspace configurations, routing logic, and webhook listeners" },
];
const apiRecommendedScopes: ApiScopeKey[] = ["leads:read", "leads:write"];
const apiExpirationOptions = ["90 Days (Recommended)", "30 Days", "180 Days", "1 Year", "Never (Not recommended for production)"];
interface ApiKeyRow { id: string; label: string; key: string; created: string; lastUsed: string; environment: ApiKeyEnvironment; scopes: ApiScopeKey[]; }

function CreateApiKeyModal({ onClose, onCreate }: { onClose: () => void; onCreate: (row: Omit<ApiKeyRow, "id" | "created" | "lastUsed">) => void }) {
  const [step, setStep] = useState<"form" | "generating" | "reveal">("form");
  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState<ApiKeyEnvironment>("Production");
  const [expiration, setExpiration] = useState(apiExpirationOptions[0]);
  const [scopes, setScopes] = useState<Record<ApiScopeKey, boolean>>({ "leads:read": true, "leads:write": true, "conversations:read": false, "workspace:admin": false });
  const [generatedKey, setGeneratedKey] = useState("");
  const selectedScopes = apiScopeCatalog.map((s) => s.key).filter((k) => scopes[k]);

  function toggleScope(key: ApiScopeKey) { setScopes((cur) => ({ ...cur, [key]: !cur[key] })); }
  function selectRecommended() { setScopes({ "leads:read": true, "leads:write": true, "conversations:read": false, "workspace:admin": false }); }
  function generate() {
    if (!name.trim() || selectedScopes.length === 0) return;
    setStep("generating");
    setTimeout(() => {
      const prefix = environment === "Production" ? "nova_live" : "nova_test";
      setGeneratedKey(`${prefix}_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`);
      setStep("reveal");
    }, 700);
  }
  function done() {
    onCreate({ label: name.trim(), key: generatedKey, environment, scopes: selectedScopes });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_48px_-8px_rgba(18,24,40,0.18)]">
        {step !== "reveal" ? (
          <>
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><Key className="text-[22px]" /></div>
                <div className="flex flex-col"><h2 className="text-[17px] font-bold text-[#151515]">Create New Secret API Key</h2><span className="text-[12px] text-[#8E929C]">Issue a secret access token for external integrations</span></div>
              </div>
              <button type="button" onClick={onClose} aria-label="Close" disabled={step === "generating"} className="rounded-lg p-1.5 text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515] disabled:opacity-40"><X className="text-[18px]" /></button>
            </div>
            <div className="mx-6 flex items-start gap-3 rounded-xl bg-[#FEF8EC] p-3.5">
              <Warning className="mt-0.5 shrink-0 text-[18px] text-[#B7791F]" />
              <div className="flex flex-col gap-0.5"><span className="text-[12px] font-bold text-[#151515]">Secret Key Visibility Warning</span><p className="text-[11px] text-[#5E626D]">Your secret API key will only be shown <strong className="font-semibold text-[#151515]">ONCE</strong> upon generation. Store it securely in a password manager or server environment file immediately.</p></div>
            </div>
            <div className="flex flex-col gap-5 overflow-y-auto p-6">
              <label className="flex flex-col gap-1.5">
                <span className="flex items-center justify-between text-[12px] font-semibold text-[#151515]"><span>Key Description / Name</span><span className="text-[11px] font-normal text-[#8E929C]">e.g. Service or workflow identifier</span></span>
                <input name="apiKeyName" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} placeholder="Website Lead Router (Production)" className="h-11 rounded-xl bg-[#F1F2F5] px-3.5 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
              </label>
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold text-[#151515]">Target Environment</span>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F1F2F5] p-1">
                  {(["Production", "Staging"] as const).map((env) => (
                    <button key={env} type="button" onClick={() => setEnvironment(env)} className={`flex items-center justify-center gap-2 rounded-lg py-2 text-[13px] font-semibold transition-colors ${environment === env ? "bg-white text-[#151515] shadow-sm" : "text-[#8E929C] hover:text-[#151515]"}`}>
                      <span className={`h-2 w-2 rounded-full ${env === "Production" ? "bg-[#0B7A57]" : "bg-[#5E626D]"}`} />
                      {env === "Production" ? "Production (Live)" : "Staging (Test)"}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold text-[#151515]">Expiration Duration</span>
                <div className="relative"><select name="apiKeyExpiration" value={expiration} onChange={(e) => setExpiration(e.target.value)} className="h-11 w-full appearance-none rounded-xl bg-[#F1F2F5] px-3.5 pr-9 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">{apiExpirationOptions.map((o) => <option key={o}>{o}</option>)}</select><CaretDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-[#8E929C]" /></div>
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-[#151515]">Scopes &amp; API Permissions</span><button type="button" onClick={selectRecommended} className="text-[11px] font-semibold text-[#3152F4] hover:underline">Select Recommended</button></div>
                <div className="flex flex-col gap-1 rounded-xl bg-[#F1F2F5] p-3">
                  {apiScopeCatalog.map((s) => (
                    <label key={s.key} className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-white/70">
                      <input type="checkbox" checked={scopes[s.key]} onChange={() => toggleScope(s.key)} className="mt-0.5 h-4 w-4 rounded accent-[#3152F4]" />
                      <div className="flex flex-col"><span className="font-mono text-[12px] font-semibold text-[#151515]">{s.key}</span><span className="text-[11px] text-[#8E929C]">{s.description}</span></div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 pt-2">
              <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#5E626D] hover:bg-[#F1F2F5]">Cancel</button>
              <button type="button" onClick={generate} disabled={!name.trim() || selectedScopes.length === 0 || step === "generating"} className="flex items-center gap-2 rounded-xl bg-[#3152F4] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(49,82,244,0.28)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50">
                {step === "generating" ? <><SpinnerGap className="animate-spin text-[18px]" />Generating...</> : <><Key className="text-[18px]" />Generate Key</>}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E8F8F3] text-[#0B7A57]"><Check weight="bold" className="text-[22px]" /></div>
                <div className="flex flex-col"><h2 className="text-[17px] font-bold text-[#151515]">Secret Key Created</h2><span className="text-[12px] text-[#8E929C]">Copy it now — you won&apos;t be able to view it again</span></div>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-6 pt-0">
              <div className="flex items-start gap-3 rounded-xl bg-[#FDF2F3] p-3.5"><Warning className="mt-0.5 shrink-0 text-[18px] text-[#F04452]" /><p className="text-[11px] text-[#5E626D]">This is the <strong className="font-semibold text-[#151515]">only time</strong> this secret key will be displayed. Store it in a password manager or server environment file now.</p></div>
              <div className="flex items-center gap-2 rounded-xl bg-[#151515] p-3.5"><span className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-[#DDE3FF]">{generatedKey}</span><button type="button" onClick={() => navigator.clipboard?.writeText(generatedKey)} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-white/20"><Copy className="text-[14px]" />Copy</button></div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#8E929C]"><span className="font-semibold text-[#151515]">{name.trim()}</span><span>•</span><span>{environment}</span><span>•</span><span>{selectedScopes.join(", ")}</span></div>
            </div>
            <div className="flex items-center justify-end p-6 pt-2"><button type="button" onClick={done} className="flex items-center gap-2 rounded-xl bg-[#3152F4] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(49,82,244,0.28)] hover:opacity-95"><Check weight="bold" className="text-[16px]" />Done</button></div>
          </>
        )}
      </div>
    </div>
  );
}

function SettingsApiKeysTab({ notify }: { notify: (v: string) => void }) {
  const [keys, setKeys] = useState<ApiKeyRow[]>([
    { id: "live", label: "Production Live Key", key: "sk_live_9f7c2ab84f2a", created: "12 Jan 2026", lastUsed: "2m ago", environment: "Production", scopes: ["leads:read", "leads:write"] },
    { id: "test", label: "Sandbox Test Key", key: "sk_test_3ad91be79b3c", created: "12 Jan 2026", lastUsed: "3d ago", environment: "Staging", scopes: ["conversations:read"] },
    { id: "webhook", label: "Webhook Signing Secret", key: "whsec_88214ad07e11", created: "20 Feb 2026", lastUsed: "14m ago", environment: "Production", scopes: ["workspace:admin"] },
  ]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const nextId = useRef(1);
  function mask(key: string) { return `${key.slice(0, 8)}${"•".repeat(8)}${key.slice(-4)}`; }
  function toggleReveal(id: string) { setRevealed((cur) => { const next = new Set(cur); if (next.has(id)) next.delete(id); else next.add(id); return next; }); }
  function revoke(id: string) { const k = keys.find((x) => x.id === id); setKeys((cur) => cur.filter((x) => x.id !== id)); if (k) notify(`${k.label} revoked`); }
  function addKey(row: Omit<ApiKeyRow, "id" | "created" | "lastUsed">) {
    const id = `key-${nextId.current++}`;
    setKeys((cur) => [...cur, { id, created: "Just now", lastUsed: "Never", ...row }]);
    notify(`${row.label} created`);
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-1.5"><SettingsBreadcrumb current="API Keys" /><h1 className="text-[22px] font-bold tracking-tight text-[#151515]">API Keys</h1><p className="max-w-2xl text-[12px] text-[#8E929C]">Keys authenticate REST and webhook requests to your AILQS workspace.</p></div>
        <button type="button" onClick={() => setModalOpen(true)} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#3152F4] px-4 py-2 text-[12px] font-bold text-white shadow-[0_6px_18px_rgba(49,82,244,0.28)] hover:opacity-95"><PlusCircle className="text-[16px]" />Create New Key</button>
      </div>
      <section className="flex flex-col gap-3 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        {keys.map((k) => (
          <div key={k.id} className="flex flex-col justify-between gap-3 rounded-2xl bg-[#F8F9FC] p-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2"><span className="text-[13px] font-semibold text-[#151515]">{k.label}</span><span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${k.environment === "Production" ? "bg-[#E8F8F3] text-[#0B7A57]" : "bg-[#F1F2F5] text-[#5E626D]"}`}><span className={`h-1.5 w-1.5 rounded-full ${k.environment === "Production" ? "bg-[#0B7A57]" : "bg-[#5E626D]"}`} />{k.environment === "Production" ? "Live" : "Staging"}</span></div>
              <div className="flex flex-wrap items-center gap-1.5">{k.scopes.map((s) => <span key={s} className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#5E626D]">{s}</span>)}</div>
              <span className="font-mono text-[12px] text-[#5E626D]">{revealed.has(k.id) ? k.key : mask(k.key)}</span>
              <span className="text-[10px] text-[#8E929C]">Created {k.created} • Last used {k.lastUsed}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={() => toggleReveal(k.id)} aria-label={revealed.has(k.id) ? `Hide ${k.label}` : `Reveal ${k.label}`} className="rounded-lg p-2 text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515]">{revealed.has(k.id) ? <EyeSlashLike /> : <Eye className="text-[16px]" />}</button>
              <button type="button" onClick={() => notify("API key copied")} aria-label={`Copy ${k.label}`} className="rounded-lg p-2 text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515]"><Copy className="text-[16px]" /></button>
              <button type="button" onClick={() => revoke(k.id)} className="rounded-xl px-3 py-1.5 text-[12px] font-semibold text-[#F04452] hover:bg-[#FDF2F3]">Revoke</button>
            </div>
          </div>
        ))}
        {keys.length === 0 && <p className="rounded-2xl bg-[#F8F9FC] p-6 text-center text-[12px] text-[#8E929C]">No API keys yet — generate one to authenticate requests.</p>}
      </section>
      {modalOpen && <CreateApiKeyModal onClose={() => setModalOpen(false)} onCreate={addKey} />}
    </div>
  );
}
function EyeSlashLike() { return <Eye weight="fill" className="text-[16px]" />; }

type AuditActorKind = "human" | "ai" | "system";
type AuditBadgeTone = "success" | "neutral" | "enforce" | "alert";
interface AuditLogRow {
  id: number;
  actor: string;
  role: string;
  actorKind: AuditActorKind;
  actionKey: string;
  actionLabel: string;
  badgeTone: AuditBadgeTone;
  resourceId: string;
  resourceLabel: string;
  resourceCategory: "Leads" | "API Keys" | "Workspace" | "Team" | "Security";
  time: string;
  dateLabel: string;
  daysAgo: number;
  ip: string;
  device: string;
  location: string;
  flagged?: boolean;
  status: string;
  payload: Record<string, unknown>;
}
const auditActionOptions = ["api_key.create", "pipeline.stage_update", "lead.qualified_hot", "security.2fa_enforce", "auth.failed_login", "team.member_invite", "integration.connect", "workspace.settings_update"];
const auditResourceCategories = ["Leads", "API Keys", "Workspace", "Team", "Security"] as const;
const workspaceAuditLog: AuditLogRow[] = [
  { id: 1, actor: "Maya Singh", role: "Product Lead", actorKind: "human", actionKey: "api_key.create", actionLabel: "Created API Key", badgeTone: "success", resourceId: "key_zapier_live_09", resourceLabel: "Production Zapier Sync", resourceCategory: "API Keys", time: "14:28:10 UTC", dateLabel: "Today", daysAgo: 0, ip: "185.220.101.5", device: "Chrome 128 (macOS)", location: "London, UK", status: "201 Created", payload: { event: "api_key.create", actor: { id: "usr_maya_01", email: "maya@ailqs.com", role: "product_lead", mfa_verified: true }, key_name: "Production Zapier Sync", scopes: ["leads:read", "leads:write"], expires_at: "2026-12-31T23:59:59Z", ip_address: "185.220.101.5", geo: { country: "GB", city: "London", asn: "AS13335 Cloudflare" } } },
  { id: 2, actor: "Arjun Mehta", role: "Sales Rep", actorKind: "human", actionKey: "pipeline.stage_update", actionLabel: "Moved lead 'Sophia Chen' to Meeting Scheduled", badgeTone: "neutral", resourceId: "lead_sc_8831", resourceLabel: "Sophia Chen · FinScale AI", resourceCategory: "Leads", time: "11:15:02 UTC", dateLabel: "Today", daysAgo: 0, ip: "194.33.45.12", device: "Safari 17 (macOS)", location: "London, UK", status: "200 OK", payload: { event: "pipeline.stage_update", actor: { id: "usr_arjun_02", email: "arjun@ailqs.com", role: "sales_rep" }, lead_id: "lead_sc_8831", from_stage: "Qualified", to_stage: "Meeting Scheduled", ip_address: "194.33.45.12" } },
  { id: 3, actor: "Nova AI", role: "Autonomous Qualifier", actorKind: "ai", actionKey: "lead.qualified_hot", actionLabel: "Scored lead 'Olivia Martin' 86 points (Hot)", badgeTone: "success", resourceId: "lead_om_4412", resourceLabel: "Olivia Martin · Acme Corp", resourceCategory: "Leads", time: "19:42:19 UTC", dateLabel: "Yesterday", daysAgo: 1, ip: "System Internal Cluster", device: "PROD-NW-882 (VPC)", location: "", status: "200 OK", payload: { event: "lead.qualified_hot", actor: { id: "svc_nova_qualifier", type: "ai_agent" }, lead_id: "lead_om_4412", score: 86, temperature: "Hot", model: "nova-qualify-v3", cluster: "PROD-NW-882" } },
  { id: 4, actor: "Maya Singh", role: "Product Lead", actorKind: "human", actionKey: "security.2fa_enforce", actionLabel: "Enforced 2FA requirement for all workspace members", badgeTone: "enforce", resourceId: "workspace_ailqs_01", resourceLabel: "AILQS Demo Workspace", resourceCategory: "Security", time: "09:12:44 UTC", dateLabel: "26 Feb 2026", daysAgo: 2, ip: "185.220.101.5", device: "Chrome 128 (macOS)", location: "London, UK", status: "200 OK", payload: { event: "security.2fa_enforce", actor: { id: "usr_maya_01", email: "maya@ailqs.com", role: "product_lead" }, policy: "require_2fa_all_members", affected_members: 8, ip_address: "185.220.101.5" } },
  { id: 5, actor: "System Auth Guard", role: "Security Trigger", actorKind: "system", actionKey: "auth.failed_login", actionLabel: "Failed password attempt (1/5)", badgeTone: "alert", resourceId: "account_maya", resourceLabel: "Maya Singh's account", resourceCategory: "Security", time: "03:14:22 UTC", dateLabel: "24 Feb 2026", daysAgo: 4, ip: "198.51.100.44", device: "Unknown Client", location: "Frankfurt, DE", flagged: true, status: "401 Unauthorized", payload: { event: "auth.failed_login", target_account: "account_maya", attempt: 1, max_attempts: 5, ip_address: "198.51.100.44", geo: { country: "DE", city: "Frankfurt" }, reason: "invalid_password" } },
  { id: 6, actor: "Riya Sen", role: "Operations Lead", actorKind: "human", actionKey: "team.member_invite", actionLabel: "Invited David K. as Sales Rep", badgeTone: "neutral", resourceId: "inv_dk_991", resourceLabel: "David K. invitation", resourceCategory: "Team", time: "16:05:30 UTC", dateLabel: "22 Feb 2026", daysAgo: 6, ip: "82.165.197.12", device: "Firefox 129 (Windows)", location: "Manchester, UK", status: "201 Created", payload: { event: "team.member_invite", actor: { id: "usr_riya_03", email: "riya@ailqs.com", role: "operations_lead" }, invite_id: "inv_dk_991", invitee_email: "david.k@ailqs.com", assigned_role: "sales_rep" } },
  { id: 7, actor: "Maya Singh", role: "Product Lead", actorKind: "human", actionKey: "integration.connect", actionLabel: "Connected HubSpot CRM via OAuth", badgeTone: "success", resourceId: "int_hubspot_04", resourceLabel: "HubSpot CRM", resourceCategory: "Workspace", time: "17:40:08 UTC", dateLabel: "21 Feb 2026", daysAgo: 7, ip: "185.220.101.5", device: "Chrome 128 (macOS)", location: "London, UK", status: "200 OK", payload: { event: "integration.connect", actor: { id: "usr_maya_01", email: "maya@ailqs.com" }, integration: "hubspot", scopes: ["contacts:sync", "deals:write"] } },
  { id: 8, actor: "Nova AI", role: "Autonomous Qualifier", actorKind: "ai", actionKey: "lead.qualified_hot", actionLabel: "Scored lead 'Ethan Brooks' 91 points (Hot)", badgeTone: "success", resourceId: "lead_eb_2210", resourceLabel: "Ethan Brooks · Zenith Cloud", resourceCategory: "Leads", time: "08:03:51 UTC", dateLabel: "20 Feb 2026", daysAgo: 8, ip: "System Internal Cluster", device: "PROD-NW-882 (VPC)", location: "", status: "200 OK", payload: { event: "lead.qualified_hot", actor: { id: "svc_nova_qualifier", type: "ai_agent" }, lead_id: "lead_eb_2210", score: 91, temperature: "Hot", model: "nova-qualify-v3" } },
  { id: 9, actor: "Arjun Mehta", role: "Sales Rep", actorKind: "human", actionKey: "pipeline.stage_update", actionLabel: "Moved lead 'Liam Wilson' to Proposal Sent", badgeTone: "neutral", resourceId: "lead_lw_7743", resourceLabel: "Liam Wilson · HyperGrowth", resourceCategory: "Leads", time: "13:22:40 UTC", dateLabel: "19 Feb 2026", daysAgo: 9, ip: "194.33.45.12", device: "Safari 17 (macOS)", location: "London, UK", status: "200 OK", payload: { event: "pipeline.stage_update", actor: { id: "usr_arjun_02", email: "arjun@ailqs.com" }, lead_id: "lead_lw_7743", from_stage: "Meeting Scheduled", to_stage: "Proposal Sent" } },
  { id: 10, actor: "Maya Singh", role: "Product Lead", actorKind: "human", actionKey: "workspace.settings_update", actionLabel: "Changed Primary Currency to EUR (€)", badgeTone: "neutral", resourceId: "workspace_ailqs_01", resourceLabel: "AILQS Demo Workspace", resourceCategory: "Workspace", time: "09:12:00 UTC", dateLabel: "18 Feb 2026", daysAgo: 10, ip: "185.220.101.5", device: "Chrome 128 (macOS)", location: "London, UK", status: "200 OK", payload: { event: "workspace.settings_update", actor: { id: "usr_maya_01", email: "maya@ailqs.com" }, field: "primary_currency", from: "USD", to: "EUR" } },
  { id: 11, actor: "System Auth Guard", role: "Security Trigger", actorKind: "system", actionKey: "auth.failed_login", actionLabel: "Failed password attempt (2/5)", badgeTone: "alert", resourceId: "account_maya", resourceLabel: "Maya Singh's account", resourceCategory: "Security", time: "03:15:07 UTC", dateLabel: "24 Feb 2026", daysAgo: 4, ip: "198.51.100.44", device: "Unknown Client", location: "Frankfurt, DE", flagged: true, status: "401 Unauthorized", payload: { event: "auth.failed_login", target_account: "account_maya", attempt: 2, max_attempts: 5, ip_address: "198.51.100.44", geo: { country: "DE", city: "Frankfurt" } } },
  { id: 12, actor: "Riya Sen", role: "Operations Lead", actorKind: "human", actionKey: "api_key.create", actionLabel: "Created API Key", badgeTone: "success", resourceId: "key_sandbox_test_02", resourceLabel: "Sandbox Test Key", resourceCategory: "API Keys", time: "12:41:19 UTC", dateLabel: "12 Jan 2026", daysAgo: 45, ip: "82.165.197.12", device: "Firefox 129 (Windows)", location: "Manchester, UK", status: "201 Created", payload: { event: "api_key.create", actor: { id: "usr_riya_03", email: "riya@ailqs.com" }, key_name: "Sandbox Test Key", scopes: ["leads:read"], expires_at: "2027-01-12T00:00:00Z" } },
  { id: 13, actor: "Nova AI", role: "Autonomous Qualifier", actorKind: "ai", actionKey: "lead.qualified_hot", actionLabel: "Scored lead 'Sophia Chen' 88 points (Hot)", badgeTone: "success", resourceId: "lead_sc_8831", resourceLabel: "Sophia Chen · FinScale AI", resourceCategory: "Leads", time: "10:58:03 UTC", dateLabel: "11 Jan 2026", daysAgo: 46, ip: "System Internal Cluster", device: "PROD-NW-882 (VPC)", location: "", status: "200 OK", payload: { event: "lead.qualified_hot", actor: { id: "svc_nova_qualifier", type: "ai_agent" }, lead_id: "lead_sc_8831", score: 88, temperature: "Hot" } },
  { id: 14, actor: "Maya Singh", role: "Product Lead", actorKind: "human", actionKey: "team.member_invite", actionLabel: "Invited Priya Nair as Operations Lead", badgeTone: "neutral", resourceId: "inv_pn_552", resourceLabel: "Priya Nair invitation", resourceCategory: "Team", time: "15:30:12 UTC", dateLabel: "05 Jan 2026", daysAgo: 52, ip: "185.220.101.5", device: "Chrome 128 (macOS)", location: "London, UK", status: "201 Created", payload: { event: "team.member_invite", actor: { id: "usr_maya_01", email: "maya@ailqs.com" }, invite_id: "inv_pn_552", invitee_email: "priya.nair@ailqs.com", assigned_role: "operations_lead" } },
];
function AuditJsonPayload({ payload, status, onCopy }: { payload: Record<string, unknown>; status: string; onCopy: () => void }) {
  const json = JSON.stringify(payload, null, 2);
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-[#151515] p-4 text-white shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Code className="text-[16px] text-[#58DDAC]" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-[#BAC3FF]">Event Payload Metadata (JSON Diff)</span>
          <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] text-white/80">Status: {status}</span>
        </div>
        <button type="button" onClick={onCopy} className="flex items-center gap-1.5 rounded bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/90 hover:bg-white/20"><Copy className="text-[13px]" />Copy JSON</button>
      </div>
      <pre className="overflow-x-auto whitespace-pre rounded-lg bg-white/5 p-3 font-mono text-[11px] leading-relaxed text-[#DDE3FF]">{json}</pre>
    </div>
  );
}
function auditBadgeClasses(tone: AuditBadgeTone) {
  switch (tone) {
    case "success": return "bg-[#E8F8F3] text-[#0B7A57]";
    case "enforce": return "bg-[#DDE3FF] text-[#2540C9]";
    case "alert": return "bg-[#FDF2F3] text-[#F04452]";
    default: return "bg-[#F1F2F5] text-[#151515]";
  }
}
function SettingsAuditLogsTab({ notify, setSection }: { notify: (v: string) => void; setSection: (v: string) => void }) {
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("All Users");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [resourceFilter, setResourceFilter] = useState<"All Resources" | typeof auditResourceCategories[number]>("All Resources");
  const [dateFilter, setDateFilter] = useState<"Last 7 Days" | "Last 30 Days" | "Last 90 Days" | "All Time">("Last 30 Days");
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const actorOptions = useMemo(() => ["All Users", ...Array.from(new Set(workspaceAuditLog.map((r) => r.actor)))], []);
  const dateFilterDays: Record<typeof dateFilter, number> = { "Last 7 Days": 7, "Last 30 Days": 30, "Last 90 Days": 90, "All Time": Infinity };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return workspaceAuditLog.filter((r) => {
      if (userFilter !== "All Users" && r.actor !== userFilter) return false;
      if (actionFilter !== "All Actions" && r.actionKey !== actionFilter) return false;
      if (resourceFilter !== "All Resources" && r.resourceCategory !== resourceFilter) return false;
      if (r.daysAgo > dateFilterDays[dateFilter]) return false;
      if (q && !`${r.actor} ${r.actionKey} ${r.actionLabel} ${r.resourceId} ${r.ip}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, userFilter, actionFilter, resourceFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const alertCount = workspaceAuditLog.filter((r) => r.badgeTone === "alert").length;

  function updateFilter<T>(setter: (v: T) => void, value: T) { setter(value); setPage(1); }
  function clearAll() {
    setSearch(""); setUserFilter("All Users"); setActionFilter("All Actions"); setResourceFilter("All Resources"); setDateFilter("Last 30 Days"); setPage(1);
    notify("Filters cleared");
  }
  function copyPayload(row: AuditLogRow) { notify(`JSON payload for ${row.resourceId} copied`); }

  const filterButtonClass = "flex items-center gap-1.5 rounded-xl bg-[#F1F2F5] px-3 py-1.5 text-[12px] font-semibold text-[#151515] outline-none hover:bg-[#E5E8F5] focus:ring-2 focus:ring-[#3152F4]/20";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-4 rounded-[22px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] md:flex-row md:items-center lg:p-7">
        <div className="flex max-w-2xl flex-col gap-1">
          <SettingsBreadcrumb current="Audit Logs" />
          <div className="flex flex-wrap items-center gap-2.5"><h1 className="text-[22px] font-bold tracking-tight text-[#151515]">Audit Logs &amp; Governance</h1><span className="rounded-full bg-[#F1F2F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#5E626D]">Live Stream</span></div>
          <p className="text-[12px] leading-relaxed text-[#8E929C]">Comprehensive, tamper-evident record of all workspace activities, credential changes, security events, and AI pipeline modifications.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-xl bg-[#F8F9FC] px-3 py-1.5"><Timer className="text-[18px] text-[#0B7A57]" /><div className="flex flex-col"><span className="text-[10px] text-[#8E929C]">Retention</span><span className="text-[12px] font-bold text-[#151515]">12 Months</span></div></div>
          <button type="button" onClick={() => notify("Audit log exported as CSV / JSON")} className="flex items-center gap-2 rounded-xl bg-[#F1F2F5] px-4 py-2 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#E5E8F5]"><DownloadSimple className="text-[16px]" />Export CSV / JSON</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
          <div className="flex flex-col gap-0.5"><span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Logged Events (30d)</span><span className="text-[26px] font-bold leading-8 text-[#151515]">{workspaceAuditLog.length}</span><span className="flex items-center gap-1 text-[11px] text-[#0B7A57]"><TrendUp className="text-[13px]" />+14.2% activity</span></div>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><Receipt className="text-[22px]" /></div>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
          <div className="flex flex-col gap-0.5"><span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Security Alerts</span><span className="text-[26px] font-bold leading-8 text-[#151515]">{alertCount}</span><span className="flex items-center gap-1 text-[11px] text-[#8E929C]"><Check weight="bold" className="text-[12px] text-[#0B7A57]" />{alertCount} under review</span></div>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#FDF2F3] text-[#F04452]"><ShieldWarning className="text-[22px]" /></div>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
          <div className="flex flex-col gap-0.5"><span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Active Credentials</span><span className="text-[26px] font-bold leading-8 text-[#151515]">3 Keys</span><span className="text-[11px] text-[#8E929C]">Zero expired keys</span></div>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F1F2F5] text-[#151515]"><Key className="text-[22px]" /></div>
        </div>
      </div>

      <section className="flex flex-col gap-3 rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
        <div className="relative w-full"><MagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#8E929C]" /><input name="auditLogSearch" autoComplete="off" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search events, actors, IPs or resource IDs (e.g. lead_982, usr_maya, api_key)..." className="h-11 w-full rounded-xl bg-[#F1F2F5] pl-11 pr-4 text-[12px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/25" /></div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative"><span className="sr-only">Filter by user</span><UserCircle className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-[#8E929C]" /><select name="auditUserFilter" value={userFilter} onChange={(e) => updateFilter(setUserFilter, e.target.value)} className={`${filterButtonClass} appearance-none pl-7 pr-7`}>{actorOptions.map((a) => <option key={a}>{a}</option>)}</select><CaretDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] text-[#8E929C]" /></label>
            <label className="relative"><span className="sr-only">Filter by action</span><Lightning className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-[#8E929C]" /><select name="auditActionFilter" value={actionFilter} onChange={(e) => updateFilter(setActionFilter, e.target.value)} className={`${filterButtonClass} appearance-none pl-7 pr-7`}><option>All Actions</option>{auditActionOptions.map((a) => <option key={a}>{a}</option>)}</select><CaretDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] text-[#8E929C]" /></label>
            <label className="relative"><span className="sr-only">Filter by resource</span><Database className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-[#8E929C]" /><select name="auditResourceFilter" value={resourceFilter} onChange={(e) => updateFilter(setResourceFilter, e.target.value as typeof resourceFilter)} className={`${filterButtonClass} appearance-none pl-7 pr-7`}><option>All Resources</option>{auditResourceCategories.map((c) => <option key={c}>{c}</option>)}</select><CaretDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] text-[#8E929C]" /></label>
            <label className="relative"><span className="sr-only">Filter by date range</span><CalendarBlank className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-[#8E929C]" /><select name="auditDateFilter" value={dateFilter} onChange={(e) => updateFilter(setDateFilter, e.target.value as typeof dateFilter)} className={`${filterButtonClass} appearance-none pl-7 pr-7`}>{(["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time"] as const).map((d) => <option key={d}>{d}</option>)}</select><CaretDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] text-[#8E929C]" /></label>
            <button type="button" onClick={clearAll} className="rounded-xl px-2.5 py-1.5 text-[12px] font-semibold text-[#8E929C] hover:text-[#F04452]">Clear all</button>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#8E929C]"><span className="h-2 w-2 rounded-full bg-[#3152F4]" />Showing <span className="font-bold text-[#151515]">{filtered.length}</span> event{filtered.length === 1 ? "" : "s"}</div>
        </div>
      </section>

      <section className="flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead><tr className="bg-[#F8F9FC] text-[10px] font-bold uppercase tracking-wide text-[#8E929C]"><th className="px-4 py-3.5">Actor</th><th className="px-4 py-3.5">Action &amp; Event</th><th className="px-4 py-3.5">Target Resource</th><th className="px-4 py-3.5">Timestamp</th><th className="px-4 py-3.5">IP &amp; Client Device</th><th className="px-4 py-3.5 text-right">Details</th></tr></thead>
            <tbody className="text-[12px] text-[#151515]">
              {pageRows.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-[12px] text-[#8E929C]">No audit events match these filters.</td></tr>}
              {pageRows.map((row) => {
                const expanded = expandedId === row.id;
                return (
                  <Fragment key={row.id}>
                    <tr className={`transition-colors hover:bg-[#F8F9FC] ${row.flagged ? "bg-[#FDF2F3]/40" : expanded ? "bg-[#F8F9FC]/70" : ""}`}>
                      <td className="px-4 py-3.5 align-top">
                        <div className="flex items-center gap-2.5">
                          {row.actorKind === "ai" ? (
                            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#3152F4] text-white"><Robot className="text-[14px]" /></div>
                          ) : row.actorKind === "system" ? (
                            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F04452] text-white"><ShieldWarning className="text-[14px]" /></div>
                          ) : (
                            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#DDE3FF] text-[11px] font-bold text-[#151515]">{row.actor.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
                          )}
                          <div className="flex min-w-0 flex-col">
                            <span className="flex items-center gap-1 truncate text-[12px] font-bold text-[#151515]">{row.actor}{row.actorKind === "ai" && <SealCheck weight="fill" className="text-[12px] text-[#3152F4]" />}</span>
                            <span className={`truncate text-[11px] ${row.actorKind === "system" ? "font-medium text-[#F04452]" : "text-[#8E929C]"}`}>{row.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-top">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${auditBadgeClasses(row.badgeTone)}`}>{(row.badgeTone === "success" || row.badgeTone === "alert") && <span className={`h-1.5 w-1.5 rounded-full ${row.badgeTone === "success" ? "bg-[#0B7A57]" : "bg-[#F04452]"}`} />}{row.actionKey}</span>
                          <span className="text-[12px] text-[#151515]">{row.actionLabel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-top">
                        <div className="flex flex-col"><span className="font-mono text-[12px] font-semibold text-[#3152F4]">{row.resourceId}</span><span className="text-[11px] text-[#8E929C]">{row.resourceLabel}</span></div>
                      </td>
                      <td className="px-4 py-3.5 align-top"><div className="flex flex-col"><span className="font-mono text-[12px] font-semibold text-[#151515]">{row.time}</span><span className="text-[11px] text-[#8E929C]">{row.dateLabel}</span></div></td>
                      <td className="px-4 py-3.5 align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className={`font-mono text-[12px] ${row.flagged ? "font-semibold text-[#F04452]" : "text-[#151515]"}`}>{row.ip}{row.flagged && " [Flagged]"}</span>
                          {row.location && <div className="flex items-center gap-1 text-[11px] text-[#8E929C]"><span>{row.device}</span><span>•</span><span>{row.location}</span></div>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right align-top">
                        <button type="button" onClick={() => setExpandedId(expanded ? null : row.id)} className={`ml-auto flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold shadow-sm ${expanded ? "bg-[#3152F4] text-white" : "bg-[#F1F2F5] text-[#151515] hover:bg-[#E5E8F5]"}`}>Inspect{expanded ? <CaretUp className="text-[12px]" /> : <CaretDown className="text-[12px]" />}</button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="bg-[#F8F9FC]/60"><td colSpan={6} className="p-4 pt-0"><AuditJsonPayload payload={row.payload} status={row.status} onCopy={() => copyPayload(row)} /></td></tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#F8F9FC]/60 p-4">
          <span className="text-[11px] text-[#8E929C]">Showing <span className="font-semibold text-[#151515]">{filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}</span> of <span className="font-semibold text-[#151515]">{filtered.length}</span> events</span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} aria-label="Previous page" className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#8E929C] shadow-sm hover:text-[#151515] disabled:cursor-not-allowed disabled:opacity-40"><CaretLeft className="text-[14px]" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              (p === 1 || p === totalPages || Math.abs(p - safePage) <= 1) ? (
                <button key={p} type="button" onClick={() => setPage(p)} className={`grid h-8 w-8 place-items-center rounded-lg text-[12px] font-bold shadow-sm ${p === safePage ? "bg-[#3152F4] text-white" : "bg-white text-[#151515] hover:bg-[#F1F2F5]"}`}>{p}</button>
              ) : (p === 2 && safePage > 3) || (p === totalPages - 1 && safePage < totalPages - 2) ? (
                <span key={p} className="px-1 text-[12px] text-[#8E929C]">…</span>
              ) : null
            ))}
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} aria-label="Next page" className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#8E929C] shadow-sm hover:text-[#151515] disabled:cursor-not-allowed disabled:opacity-40"><CaretRight className="text-[14px]" /></button>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-[linear-gradient(120deg,#2c303a_0%,#242424_55%,#121212_100%)] p-5 text-white shadow-md md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-[#58DDAC]"><ShieldCheck className="text-[24px]" /></div>
          <div className="flex flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-2"><span className="text-[15px] font-bold">12-Month Plan Retention Active</span><span className="rounded-full bg-[#58DDAC]/20 px-2 py-0.5 text-[11px] font-semibold text-[#58DDAC]">SOC 2 Type I Ready</span></div>
            <p className="max-w-2xl text-[11px] text-[#C4C5D9]">Starter plan includes 12 months of tamper-proof audit log retention. Need immutable 7-year SOC 2 / HIPAA compliance storage with automated SIEM syslog export?</p>
          </div>
        </div>
        <button type="button" onClick={() => setSection("Billing & Usage")} className="shrink-0 rounded-xl bg-[#3152F4] px-4 py-2 text-[12px] font-bold text-white shadow-[0_4px_12px_rgba(49,82,244,0.35)] hover:opacity-95">Upgrade to Enterprise</button>
      </div>
    </div>
  );
}

function SettingsPage({ notify, setSection }: { notify: (v: string) => void; setSection: (v: string) => void }) {
  const [category, setCategory] = useState<SettingsCategory>("Workspace");
  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 lg:grid-cols-12">
      <aside className="flex flex-col gap-4 lg:col-span-3">
        <nav className="flex flex-col gap-1 rounded-2xl bg-white p-3 shadow-sm">
          <span className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Settings Categories</span>
          {settingsCategories.map((c) => {
            const Icon = c.icon;
            const active = c.key === category;
            return (
              <button key={c.key} type="button" onClick={() => setCategory(c.key)} className={`flex items-center justify-between rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors ${active ? "bg-[#3152F4] text-white shadow-[0_4px_12px_rgba(49,82,244,0.25)]" : "text-[#5E626D] hover:bg-[#F1F2F5] hover:text-[#151515]"}`}>
                <span className="flex items-center gap-2.5"><Icon weight={active ? "fill" : "regular"} className="text-[18px]" />{c.key}</span>
                {c.badge && <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${active ? "bg-white/20 text-white" : "bg-[#F1F2F5] text-[#5E626D]"}`}>{c.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="flex flex-col gap-2 rounded-2xl bg-[#F8F9FC] p-4">
          <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Cluster Instance</span><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#58DDAC] opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#0B7A57]" /></span></div>
          <div className="flex flex-col"><span className="font-mono text-[13px] font-bold text-[#151515]">PROD-NW-882</span><span className="text-[11px] text-[#8E929C]">London-01 (AWS eu-west-2)</span></div>
          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#8E929C]"><ShieldCheckered className="text-[14px]" />TLS 1.3 Strict • HSTS Active</div>
        </div>
      </aside>
      <div className="lg:col-span-9">
        {category === "Workspace" && <SettingsWorkspaceTab notify={notify} />}
        {category === "Security" && <SettingsSecurityTab notify={notify} setCategory={setCategory} />}
        {category === "Lead Pipeline" && <SettingsLeadPipelineTab notify={notify} setSection={setSection} />}
        {category === "Custom Fields & Tags" && <SettingsCustomFieldsTab notify={notify} />}
        {category === "Branding" && <SettingsBrandingTab notify={notify} />}
        {category === "Business Hours" && <SettingsBusinessHoursTab notify={notify} />}
        {category === "Privacy & Data" && <SettingsPrivacyTab notify={notify} />}
        {category === "API Keys" && <SettingsApiKeysTab notify={notify} />}
        {category === "Audit Logs" && <SettingsAuditLogsTab notify={notify} setSection={setSection} />}
      </div>
    </div>
  );
}

function NotifSwitch({ checked, onChange, label, disabled }: { checked: boolean; onChange: () => void; label: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} disabled={disabled} className={`relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${checked ? "bg-[#3152F4]" : "bg-[#E5E8F5]"}`}>
      <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

type NotifCategory = "Leads" | "System";
type NotifEmailMode = "Instant" | "Daily Digest" | "Off";
interface NotifBadge { text: string; tone: "danger" | "neutral" }
interface NotifRow {
  id: number; groupLabel: string; category: NotifCategory; dot: string; name: string; badge?: NotifBadge; description: string;
  inApp: boolean; email: NotifEmailMode; emailLocked?: NotifBadge; browserPush: boolean; chime?: boolean; slackChannel: string | null; slackMention?: boolean; slackEnabled: boolean;
}
const initialNotifRows: NotifRow[] = [
  { id: 1, groupLabel: "Group 1: Autonomous Lead Scoring & Inbound Signals", category: "Leads", dot: "#F04452", name: "Hot Lead Qualified (Score ≥ 80)", badge: { text: "Priority", tone: "danger" }, description: "Real-time autonomous AI scoring match & buy intent verified.", inApp: true, email: "Instant", browserPush: true, slackChannel: "inbound-hot-leads", slackEnabled: true },
  { id: 2, groupLabel: "Group 1: Autonomous Lead Scoring & Inbound Signals", category: "Leads", dot: "#F5A524", name: "Warm Lead Identified (Score 50–79)", description: "Prospect reached nurturing engagement threshold.", inApp: true, email: "Daily Digest", browserPush: false, slackChannel: null, slackEnabled: false },
  { id: 3, groupLabel: "Group 1: Autonomous Lead Scoring & Inbound Signals", category: "Leads", dot: "#0B7A57", name: "New Inbound Lead Created", description: "First contact captured via website conversation widget.", inApp: true, email: "Daily Digest", browserPush: false, slackChannel: "leads-all", slackEnabled: true },
  { id: 4, groupLabel: "Group 2: Live Interactions & Escalations", category: "Leads", dot: "#F04452", name: "Live Human Handoff Requested", badge: { text: "Immediate Action", tone: "danger" }, description: "Visitor expressly requested sales human agent or VIP SLA threshold.", inApp: true, email: "Instant", browserPush: true, chime: true, slackChannel: "sales-duty", slackMention: true, slackEnabled: true },
  { id: 5, groupLabel: "Group 2: Live Interactions & Escalations", category: "Leads", dot: "#8E929C", name: "Unassigned Conversation Idle (>5m)", description: "Handoff waiting in triage without representative pickup.", inApp: true, email: "Instant", browserPush: true, slackChannel: "inbound-hot-leads", slackEnabled: true },
  { id: 6, groupLabel: "Group 3: Follow-ups, Tasks & Cadences", category: "Leads", dot: "#8E929C", name: "Task Overdue", description: "Scheduled outbound call or CRM sync passed deadline.", inApp: true, email: "Instant", browserPush: false, slackChannel: null, slackEnabled: false },
  { id: 7, groupLabel: "Group 3: Follow-ups, Tasks & Cadences", category: "Leads", dot: "#8E929C", name: "Daily Task Agenda", description: "Morning compilation of assigned lead follow-ups & meeting links.", inApp: true, email: "Daily Digest", browserPush: false, slackChannel: null, slackEnabled: false },
  { id: 8, groupLabel: "Group 4: Integrations & Webhook Telemetry", category: "System", dot: "#F04452", name: "Webhook Delivery Failure", description: "HTTP 5xx endpoint response or payload retry exhaustion.", inApp: true, email: "Instant", browserPush: false, slackChannel: "eng-alerts", slackEnabled: true },
  { id: 9, groupLabel: "Group 4: Integrations & Webhook Telemetry", category: "System", dot: "#F04452", name: "Integration Token Disconnected / Expired", description: "OAuth re-authentication required for HubSpot, Salesforce or Slack.", inApp: true, email: "Instant", browserPush: false, slackChannel: "eng-alerts", slackEnabled: true },
  { id: 10, groupLabel: "Group 5: Workspace Usage, Limits & Invoicing", category: "System", dot: "#F5A524", name: "Monthly AI Conversation Quota Warning (75%, 90%)", description: "Workspace approaching 1,000 conversation starter limit.", inApp: true, email: "Instant", browserPush: false, slackChannel: "general", slackEnabled: true },
  { id: 11, groupLabel: "Group 5: Workspace Usage, Limits & Invoicing", category: "System", dot: "#0B7A57", name: "Invoice & Payment Receipts", badge: { text: "Mandatory", tone: "neutral" }, description: "Subscription renewals and charge confirmations.", inApp: true, email: "Off", emailLocked: { text: "Required by System", tone: "neutral" }, browserPush: false, slackChannel: null, slackEnabled: false },
  { id: 12, groupLabel: "Group 6: Security & Workspace Administration", category: "System", dot: "#F04452", name: "Unrecognized Login or IP Challenge", badge: { text: "Security 2FA", tone: "danger" }, description: "New session detected outside standard geofence or device signature.", inApp: true, email: "Off", emailLocked: { text: "Required for Security", tone: "danger" }, browserPush: true, slackChannel: "security-alerts", slackEnabled: true },
  { id: 13, groupLabel: "Group 6: Security & Workspace Administration", category: "System", dot: "#8E929C", name: "API Key Created or Revoked", description: "Admin workspace credentials generated or rotated.", inApp: true, email: "Off", emailLocked: { text: "Required", tone: "neutral" }, browserPush: false, slackChannel: "security-alerts", slackEnabled: true },
];
interface NotifConfig { cadence: "Real-time" | "Daily (8 AM)" | "Weekly"; timezone: string; quietHours: boolean; quietStart: string; quietEnd: string; allowCriticalOverride: boolean; domainScope: string; rows: NotifRow[] }
const initialNotifConfig: NotifConfig = { cadence: "Real-time", timezone: "Asia/Kolkata (IST, UTC+5:30)", quietHours: true, quietStart: "10:00 PM", quietEnd: "08:00 AM", allowCriticalOverride: true, domainScope: "All Websites (ailqs.com)", rows: initialNotifRows };

type CenterCategory = "leads" | "conversations" | "followups" | "system" | "billing";
const centerCategoryLabels: { key: CenterCategory; label: string }[] = [
  { key: "leads", label: "Leads" }, { key: "conversations", label: "Conversations" }, { key: "followups", label: "Follow-ups" }, { key: "system", label: "System" }, { key: "billing", label: "Billing" },
];
interface CenterBadge { text: string; tone: "danger" | "neutral" | "success" | "primary" }
interface CenterAction { label: string; primary: boolean }
interface CenterNotification {
  id: number; category: CenterCategory; group: "Today" | "Earlier This Week"; icon: typeof Fire; iconTone: string;
  title: string; badge?: CenterBadge; description: string; descriptionMono?: boolean; metaTime: string; metaRest: string[];
  read: boolean; priority: boolean; actions: CenterAction[];
}
const initialCenterNotifications: CenterNotification[] = [
  { id: 1, category: "leads", group: "Today", icon: Fire, iconTone: "bg-[#FDF2F3] text-[#F04452]", title: "Hot Lead: Olivia Martin scored 86", badge: { text: "Score 86 (Hot)", tone: "danger" }, description: "Autonomous AI qualification completed for Olivia Martin (VP of Inbound Growth at Acme Global Corp). Primary interest: AI Automation & CRM Integration (€45k est. deal).", metaTime: "12m ago", metaRest: ["ailqs.com", "Acme Global Corp"], read: false, priority: true, actions: [{ label: "View Lead", primary: true }, { label: "Assign Rep", primary: false }] },
  { id: 2, category: "conversations", group: "Today", icon: Headset, iconTone: "bg-[#F1F2F5] text-[#5E626D]", title: "Human handoff requested in live conversation", badge: { text: "Urgent Response", tone: "neutral" }, description: "Visitor requested a live sales specialist regarding custom SLA & enterprise migration after scoring 78 on pricing questions.", metaTime: "34m ago", metaRest: ["Team Inbox #conv-8921", "Wait time: 1m 20s"], read: false, priority: true, actions: [{ label: "Take Over Chat", primary: true }, { label: "View Transcript", primary: false }] },
  { id: 3, category: "followups", group: "Today", icon: Timer, iconTone: "bg-[#FDF2F3] text-[#F04452]", title: "Follow-up overdue for Ethan Brooks", badge: { text: "Overdue", tone: "danger" }, description: "Scheduled discovery call prep & proposal review was due today at 10:00 AM EST. Assigned to Arjun Mehta.", metaTime: "1h ago", metaRest: ["Lead: Ethan Brooks (CloudScale Inc)"], read: false, priority: false, actions: [{ label: "Reschedule", primary: false }, { label: "Complete Task", primary: true }] },
  { id: 4, category: "system", group: "Today", icon: ArrowClockwise, iconTone: "bg-[#FDF2F3] text-[#F04452]", title: "Webhook delivery failed: Production Lead Stream", badge: { text: "HTTP 502", tone: "danger" }, description: "HTTP 502 Bad Gateway response from endpoint https://api.ailqs.com/v1/webhooks/leads for event evt_5b38d10f.", descriptionMono: true, metaTime: "2h ago", metaRest: ["Webhooks", "5 of 5 retries exhausted"], read: false, priority: true, actions: [{ label: "Inspect Payload", primary: false }, { label: "Retry Delivery", primary: true }] },
  { id: 5, category: "billing", group: "Today", icon: Gauge, iconTone: "bg-[#F1F2F5] text-[#5E626D]", title: "Monthly conversation quota reached 74%", badge: { text: "742 / 1,000", tone: "neutral" }, description: "Your workspace has consumed 742 of 1,000 monthly AI conversations. With 11 days left in the billing cycle, you are on track to reach the limit.", metaTime: "3h ago", metaRest: ["Starter Plan", "Billing & Usage"], read: false, priority: false, actions: [{ label: "Upgrade Plan", primary: true }, { label: "Usage Details", primary: false }] },
  { id: 6, category: "system", group: "Earlier This Week", icon: Globe, iconTone: "bg-[#E8F8F3] text-[#0B7A57]", title: "Website crawl completed: ailqs.com", badge: { text: "24 Pages Indexed", tone: "success" }, description: "Successfully indexed 24 new pages and updated vector embeddings in the Knowledge Base. 0 crawl errors detected.", metaTime: "Yesterday, 4:15 PM", metaRest: ["Knowledge Base"], read: false, priority: false, actions: [{ label: "Review Indexed Pages", primary: false }, { label: "Test AI Answers", primary: true }] },
  { id: 7, category: "system", group: "Earlier This Week", icon: IdentificationBadge, iconTone: "bg-[#E8F8F3] text-[#0B7A57]", title: "New team invitation accepted by Riya Sen", badge: { text: "Seat 3 of 3", tone: "neutral" }, description: "Riya Sen joined AILQS Demo as Sales Representative. Allocated to Inbound Sales team.", metaTime: "Yesterday, 11:30 AM", metaRest: ["Team Management"], read: false, priority: false, actions: [{ label: "Manage Permissions", primary: false }, { label: "View Profile", primary: false }] },
  { id: 8, category: "leads", group: "Earlier This Week", icon: Eye, iconTone: "bg-[#F1F3FF] text-[#3152F4]", title: "High-intent visitor returned to Pricing page", badge: { text: "Enterprise Prospect", tone: "primary" }, description: "Repeat visitor from Chicago (IP: Enterprise block) spent >4 minutes comparing Starter vs Premium before initiating Nova AI conversation.", metaTime: "Yesterday, 9:20 AM", metaRest: ["Live Telemetry"], read: false, priority: false, actions: [{ label: "Start Outreach", primary: true }, { label: "View Visitor", primary: false }] },
  { id: 9, category: "system", group: "Earlier This Week", icon: ShieldCheck, iconTone: "bg-[#F1F2F5] text-[#8E929C]", title: "Widget SSL certificate auto-renewed", badge: { text: "Secured", tone: "neutral" }, description: "Edge CDN TLS certificate for widget.ailqs.com successfully renewed.", metaTime: "2 days ago", metaRest: ["Websites & Widget"], read: true, priority: false, actions: [{ label: "View Security Settings", primary: false }] },
  { id: 10, category: "leads", group: "Earlier This Week", icon: DownloadSimple, iconTone: "bg-[#F1F2F5] text-[#8E929C]", title: "Monthly Lead Export Ready", badge: { text: "CSV Generated", tone: "neutral" }, description: "CSV export for October qualified leads (267 leads) has been generated and encrypted.", metaTime: "3 days ago", metaRest: ["Analytics"], read: true, priority: false, actions: [{ label: "Download CSV (420 KB)", primary: false }] },
];
function centerBadgeClasses(tone: CenterBadge["tone"]) {
  switch (tone) {
    case "danger": return "bg-[#FDF2F3] text-[#F04452]";
    case "success": return "bg-[#E8F8F3] text-[#0B7A57]";
    case "primary": return "bg-[#F1F3FF] text-[#3152F4]";
    default: return "bg-[#F1F2F5] text-[#5E626D]";
  }
}
function notifBadgeClasses(tone: "danger" | "neutral") { return tone === "danger" ? "bg-[#FDF2F3] text-[#F04452]" : "bg-[#F1F2F5] text-[#5E626D]"; }

function CenterNotificationCard({ item, onAction }: { item: CenterNotification; onAction: (item: CenterNotification, action: CenterAction) => void }) {
  const Icon = item.icon;
  return (
    <article className={`flex flex-col justify-between gap-4 rounded-2xl p-5 shadow-[0_2px_12px_rgba(23,28,37,0.03)] transition-colors sm:flex-row sm:items-start ${item.read ? "bg-white hover:bg-[#F8F9FC]" : "bg-[#F8F9FC] hover:bg-[#F1F2F5]"}`}>
      <div className="flex items-start gap-4 min-w-0">
        {!item.read ? <span className="mt-3 h-2.5 w-2.5 shrink-0 rounded-full bg-[#3152F4] shadow-[0_0_8px_rgba(49,82,244,0.6)]" /> : <span className="mt-3 h-2.5 w-2.5 shrink-0" />}
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl shadow-sm ${item.iconTone}`}><Icon weight={item.read ? "regular" : "fill"} className="text-[22px]" /></div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className={`text-[14px] text-[#151515] ${item.read ? "font-semibold" : "font-bold"}`}>{item.title}</h3>
            {item.badge && <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${centerBadgeClasses(item.badge.tone)}`}>{(item.badge.tone === "danger" || item.badge.tone === "success" || item.badge.tone === "primary") && <span className="h-1.5 w-1.5 rounded-full bg-current" />}{item.badge.text}</span>}
          </div>
          <p className={`text-[13px] text-[#5E626D] ${item.descriptionMono ? "break-all rounded-xl bg-[#F1F2F5] p-2 font-mono text-[12px] text-[#151515]" : ""}`}>{item.description}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#8E929C]">
            <span className={!item.read ? "font-bold text-[#3152F4]" : "font-semibold text-[#151515]"}>{item.metaTime}</span>
            {item.metaRest.map((m) => <span key={m} className="flex items-center gap-2"><span>•</span><span>{m}</span></span>)}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 pl-6 sm:pl-0 sm:self-center">
        {item.actions.map((action) => (
          <button key={action.label} type="button" onClick={() => onAction(item, action)} className={action.primary ? "rounded-xl bg-[#3152F4] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(49,82,244,0.25)] hover:opacity-95" : "rounded-xl bg-[#F1F2F5] px-3.5 py-1.5 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5]"}>{action.label}</button>
        ))}
      </div>
    </article>
  );
}

function NotificationsPage({ notify, setSection }: { notify: (v: string) => void; setSection: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState<"Center" | "Preferences">("Preferences");
  const [saved, setSaved] = useState<NotifConfig>(initialNotifConfig);
  const [draft, setDraft] = useState<NotifConfig>(initialNotifConfig);
  const [fastFilter, setFastFilter] = useState<"All" | "Leads" | "System">("All");
  const [sendingTest, setSendingTest] = useState(false);
  const [centerNotifications, setCenterNotifications] = useState(initialCenterNotifications);
  const [centerCategory, setCenterCategory] = useState<"all" | CenterCategory>("all");
  const [centerSearch, setCenterSearch] = useState("");
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  const unreadCount = centerNotifications.filter((i) => !i.read).length;
  const priorityCount = centerNotifications.filter((i) => !i.read && i.priority).length;

  function updateRow(id: number, patch: Partial<NotifRow>) { setDraft((cur) => ({ ...cur, rows: cur.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) })); }
  function toggleRowBool(id: number, key: "inApp" | "browserPush" | "slackEnabled") { setDraft((cur) => ({ ...cur, rows: cur.rows.map((r) => (r.id === id ? { ...r, [key]: !r[key] } : r)) })); }
  function discard() { setDraft(saved); notify("Changes discarded"); }
  function save() { setSaved(draft); notify("Notification preferences updated successfully across all workspace channels"); }
  function resetDefaults() { setDraft(initialNotifConfig); notify("Notification preferences reset to defaults"); }
  function sendTest() {
    if (sendingTest) return;
    setSendingTest(true);
    setTimeout(() => { setSendingTest(false); notify("Test alert sent to Maya Singh"); }, 900);
  }
  function markCenterRead(id: number) { setCenterNotifications((cur) => cur.map((i) => (i.id === id ? { ...i, read: true } : i))); }
  function markAllRead() { setCenterNotifications((cur) => cur.map((i) => ({ ...i, read: true }))); notify("All notifications marked as read"); }
  function handleCenterAction(item: CenterNotification, action: CenterAction) {
    markCenterRead(item.id);
    notify(`${action.label}: "${item.title}"`);
    if (action.label === "View Lead" || action.label === "Start Outreach" || action.label === "View Visitor") setSection("Leads");
    else if (action.label === "Upgrade Plan" || action.label === "Usage Details") setSection("Billing & Usage");
    else if (action.label === "Manage Permissions" || action.label === "View Profile" || action.label === "Assign Rep") setSection("Team");
    else if (action.label === "View Security Settings") setSection("Settings");
  }

  const counts = { All: draft.rows.length, Leads: draft.rows.filter((r) => r.category === "Leads").length, System: draft.rows.filter((r) => r.category === "System").length };
  const visibleRows = draft.rows.filter((r) => fastFilter === "All" || r.category === fastFilter);
  let lastGroup = "";

  const centerCategoryCounts: Record<"all" | CenterCategory, number> = {
    all: centerNotifications.length,
    leads: centerNotifications.filter((n) => n.category === "leads").length,
    conversations: centerNotifications.filter((n) => n.category === "conversations").length,
    followups: centerNotifications.filter((n) => n.category === "followups").length,
    system: centerNotifications.filter((n) => n.category === "system").length,
    billing: centerNotifications.filter((n) => n.category === "billing").length,
  };
  const centerQuery = centerSearch.trim().toLowerCase();
  const visibleCenterNotifications = centerNotifications.filter((n) => {
    const matchesCategory = centerCategory === "all" || n.category === centerCategory;
    const matchesSearch = !centerQuery || n.title.toLowerCase().includes(centerQuery) || n.description.toLowerCase().includes(centerQuery);
    return matchesCategory && matchesSearch;
  });
  const centerToday = visibleCenterNotifications.filter((n) => n.group === "Today");
  const centerEarlier = visibleCenterNotifications.filter((n) => n.group === "Earlier This Week");
  const centerEarlierUnread = centerEarlier.filter((n) => !n.read).length;
  const centerEarlierRead = centerEarlier.length - centerEarlierUnread;

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6 pb-24">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          {activeTab === "Center" ? (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8E929C]"><span>Workspace</span><CaretRight className="text-[10px]" /><span className="font-semibold text-[#151515]">Administration</span><CaretRight className="text-[10px]" /><span className="font-semibold text-[#3152F4]">Notifications</span></div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8E929C]"><span>Workspace</span><CaretRight className="text-[10px]" /><span>Administration</span><CaretRight className="text-[10px]" /><span>Notifications</span><CaretRight className="text-[10px]" /><span className="font-semibold text-[#3152F4]">Preferences</span></div>
          )}
          {activeTab === "Center" ? (
            <div className="flex flex-wrap items-center gap-3.5"><h1 className="text-[22px] font-bold tracking-tight text-[#151515]">Notifications</h1><span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 ${unreadCount > 0 ? "bg-[#3152F4]/10" : "bg-[#F1F2F5]"}`}>{unreadCount > 0 && <span className="h-2 w-2 animate-pulse rounded-full bg-[#3152F4]" />}<span className={`text-[12px] font-bold ${unreadCount > 0 ? "text-[#3152F4]" : "text-[#8E929C]"}`}>{unreadCount} Unread</span></span></div>
          ) : (
            <div className="flex flex-wrap items-center gap-2.5"><h1 className="text-[22px] font-bold tracking-tight text-[#151515]">Notification Preferences</h1><span className="rounded-full bg-[#F1F2F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#5E626D]">Workspace Settings</span></div>
          )}
          <p className="max-w-2xl text-[12px] text-[#8E929C]">{activeTab === "Center" ? "Real-time alerts across leads, conversations, follow-ups, and system health." : "Configure delivery channels, notification frequency, and routing rules across team alert streams."}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-full bg-[#F1F2F5] p-1">
            <button type="button" onClick={() => setActiveTab("Center")} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${activeTab === "Center" ? "bg-[#3152F4] text-white shadow-[0_4px_12px_rgba(49,82,244,0.28)]" : "text-[#5E626D] hover:text-[#151515]"}`}><Tray className="text-[15px]" />Center ({unreadCount})</button>
            <button type="button" onClick={() => setActiveTab("Preferences")} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${activeTab === "Preferences" ? "bg-[#3152F4] text-white shadow-[0_4px_12px_rgba(49,82,244,0.28)]" : "text-[#5E626D] hover:text-[#151515]"}`}><SlidersHorizontal className="text-[15px]" />Preferences</button>
          </div>
          {activeTab === "Preferences" ? (
            <div className="flex flex-wrap items-center gap-2.5">
              <button type="button" onClick={sendTest} disabled={sendingTest} className="flex items-center gap-1.5 rounded-xl bg-[#F1F2F5] px-3.5 py-2 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#E5E8F5] disabled:cursor-not-allowed disabled:opacity-70">
                {sendingTest ? <><SpinnerGap className="animate-spin text-[16px]" />Sending...</> : <><PaperPlaneTilt className="text-[15px] text-[#3152F4]" />Send Test</>}
              </button>
              <button type="button" onClick={resetDefaults} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515]"><ArrowCounterClockwise className="text-[15px]" />Reset</button>
              <button type="button" onClick={save} disabled={!dirty} className="flex items-center gap-1.5 rounded-xl bg-[#3152F4] px-4 py-2 text-[12px] font-bold text-white shadow-[0_8px_20px_rgba(49,82,244,0.28)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"><Check weight="bold" className="text-[15px]" />Save Changes</button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2.5">
              <button type="button" onClick={markAllRead} disabled={unreadCount === 0} className="flex items-center gap-1.5 rounded-xl bg-[#F1F2F5] px-3.5 py-2 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#E5E8F5] disabled:cursor-not-allowed disabled:opacity-50"><Check weight="bold" className="text-[15px] text-[#8E929C]" />Mark All as Read</button>
              <button type="button" onClick={() => setActiveTab("Preferences")} className="flex items-center gap-1.5 rounded-xl bg-[#F1F2F5] px-3.5 py-2 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#E5E8F5]"><SlidersHorizontal className="text-[15px] text-[#8E929C]" />Preferences</button>
            </div>
          )}
        </div>
      </div>

      {activeTab === "Center" ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(23,28,37,0.03)]">
              <div className="flex items-center gap-3.5"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><BellRinging className="text-[20px]" /></div><div><div className="text-[15px] font-bold text-[#151515]">{unreadCount} Pending</div><div className="text-[11px] text-[#8E929C]">Requiring triage or follow-up</div></div></div>
              <span className="rounded-lg bg-[#F1F2F5] px-2 py-1 text-[11px] font-bold text-[#151515]">Real-time</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(23,28,37,0.03)]">
              <div className="flex items-center gap-3.5"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FDF2F3] text-[#F04452]"><Warning className="text-[20px]" /></div><div><div className="text-[15px] font-bold text-[#151515]">{priorityCount} Priority Actions</div><div className="text-[11px] text-[#8E929C]">Hot lead, handoff, failed webhook</div></div></div>
              <span className="rounded-lg bg-[#FDF2F3] px-2 py-1 text-[11px] font-bold text-[#F04452]">Action Needed</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(23,28,37,0.03)]">
              <div className="flex items-center gap-3.5"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E8F8F3] text-[#0B7A57]"><SealCheck className="text-[20px]" /></div><div><div className="text-[15px] font-bold text-[#151515]">Delivery Channels</div><div className="text-[11px] text-[#8E929C]">In-app, Email &amp; Slack active</div></div></div>
              <span className="rounded-lg bg-[#E8F8F3] px-2 py-1 text-[11px] font-bold text-[#0B7A57]">Healthy</span>
            </div>
          </div>

          <div className="flex flex-col items-stretch justify-between gap-3 rounded-2xl bg-[#F1F2F5] p-1.5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1 overflow-x-auto px-0.5 py-0.5">
              <button type="button" onClick={() => setCenterCategory("all")} className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all ${centerCategory === "all" ? "bg-[#3152F4] text-white shadow-[0_4px_12px_rgba(49,82,244,0.28)]" : "text-[#5E626D] hover:bg-[#E5E8F5] hover:text-[#151515]"}`}>All ({centerCategoryCounts.all})</button>
              {centerCategoryLabels.map((c) => (
                <button key={c.key} type="button" onClick={() => setCenterCategory(c.key)} className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all ${centerCategory === c.key ? "bg-[#3152F4] text-white shadow-[0_4px_12px_rgba(49,82,244,0.28)]" : "text-[#5E626D] hover:bg-[#E5E8F5] hover:text-[#151515]"}`}>{c.label} ({centerCategoryCounts[c.key]})</button>
              ))}
            </div>
            <div className="relative min-w-[220px]"><SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[#8E929C]" /><input name="notificationSearch" autoComplete="off" value={centerSearch} onChange={(e) => setCenterSearch(e.target.value)} placeholder="Filter alerts..." className="h-8 w-full rounded-full bg-white pl-9 pr-3 text-[12px] text-[#151515] outline-none focus:ring-2 focus:ring-[#3152F4]/20" /></div>
          </div>

          <div className="flex flex-col gap-8">
            {centerToday.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1"><div className="flex items-center gap-2"><span className="text-[15px] font-bold text-[#151515]">Today</span><span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[11px] font-semibold text-[#5E626D]">{centerToday.filter((n) => !n.read).length} new</span></div><span className="text-[11px] text-[#8E929C]">Sorted by real-time arrival</span></div>
                <div className="flex flex-col gap-3">{centerToday.map((item) => <CenterNotificationCard key={item.id} item={item} onAction={handleCenterAction} />)}</div>
              </div>
            )}
            {centerEarlier.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-1"><span className="text-[15px] font-bold text-[#151515]">Earlier This Week</span><span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[11px] font-semibold text-[#5E626D]">{centerEarlierUnread} unread, {centerEarlierRead} read</span></div>
                <div className="flex flex-col gap-3">{centerEarlier.map((item) => <CenterNotificationCard key={item.id} item={item} onAction={handleCenterAction} />)}</div>
              </div>
            )}
            {visibleCenterNotifications.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-[12px] text-[#8E929C] shadow-[0_4px_20px_rgba(23,28,37,0.03)]">No notifications match this filter.</p>}
          </div>

          <div className="mt-2 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#F1F2F5] p-6 md:flex-row">
            <div className="flex items-center gap-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[#3152F4] shadow-sm"><SealCheck className="text-[16px]" /></div><p className="text-[12px] text-[#8E929C]">Notifications are filtered autonomously by <strong className="font-semibold text-[#151515]">Nova AI Priority Engine v4.2</strong> for <strong className="font-semibold text-[#151515]">ailqs.com</strong>.</p></div>
            <div className="flex shrink-0 items-center gap-3 text-[12px] font-semibold text-[#5E626D]">
              <button type="button" onClick={() => notify("Delivery logs opened")} className="hover:text-[#3152F4]">Delivery Logs</button><span className="text-[#C4C5D9]">•</span>
              <button type="button" onClick={() => notify("Webhook latency dashboard opened")} className="hover:text-[#3152F4]">Webhook Latency</button><span className="text-[#C4C5D9]">•</span>
              <button type="button" onClick={() => notify("Mute rules opened")} className="hover:text-[#3152F4]">Mute Rules</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <section className="flex flex-col justify-between gap-4 rounded-[20px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><Clock className="text-[18px]" /></div><div><h3 className="text-[13px] font-bold text-[#151515]">Default Delivery Cadence</h3><p className="text-[11px] text-[#8E929C]">Global fallback dispatch</p></div></div>
                <Info className="text-[16px] text-[#C4C5D9]" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1 rounded-xl bg-[#F1F2F5] p-1">
                  {(["Real-time", "Daily (8 AM)", "Weekly"] as const).map((c) => (
                    <button key={c} type="button" onClick={() => setDraft((cur) => ({ ...cur, cadence: c }))} className={`flex-1 rounded-lg py-1.5 text-center text-[11px] font-semibold transition-colors ${draft.cadence === c ? "bg-[#3152F4] text-white shadow-sm" : "text-[#5E626D] hover:text-[#151515]"}`}>{c}</button>
                  ))}
                </div>
                <label className="flex flex-col gap-1"><span className="text-[11px] font-semibold text-[#8E929C]">Active Delivery Timezone</span>
                  <div className="relative"><Globe className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[#8E929C]" /><select name="notifTimezone" value={draft.timezone} onChange={(e) => setDraft((cur) => ({ ...cur, timezone: e.target.value }))} className="h-9 w-full appearance-none rounded-xl bg-[#F1F2F5] pl-9 pr-8 text-[12px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">{["Asia/Kolkata (IST, UTC+5:30)", "America/New_York (EST, UTC-5)", "Europe/London (GMT, UTC+0)", "Asia/Singapore (SGT, UTC+8)"].map((o) => <option key={o}>{o}</option>)}</select><CaretDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[15px] text-[#8E929C]" /></div>
                </label>
              </div>
            </section>

            <section className="flex flex-col justify-between gap-4 rounded-[20px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#E8F8F3] text-[#0B7A57]"><Moon className="text-[18px]" /></div><div><h3 className="text-[13px] font-bold text-[#151515]">Quiet Hours &amp; DND</h3><p className="text-[11px] text-[#8E929C]">Suppress push &amp; sound pings</p></div></div>
                <ToggleSwitch checked={draft.quietHours} onChange={() => setDraft((cur) => ({ ...cur, quietHours: !cur.quietHours }))} label="Quiet Hours & DND" />
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between rounded-xl bg-[#F8F9FC] p-2.5 text-[12px] text-[#151515]">
                  <span className="flex items-center gap-1.5"><Moon className="text-[14px] text-[#8E929C]" />{draft.quietStart}</span>
                  <span className="text-[10px] font-bold uppercase text-[#8E929C]">to</span>
                  <span className="flex items-center gap-1.5"><SunDim className="text-[14px] text-[#8E929C]" />{draft.quietEnd}</span>
                </div>
                <label className="flex cursor-pointer items-start gap-2.5 pt-1"><input type="checkbox" name="allowCriticalOverride" checked={draft.allowCriticalOverride} onChange={() => setDraft((cur) => ({ ...cur, allowCriticalOverride: !cur.allowCriticalOverride }))} className="mt-0.5 h-4 w-4 rounded accent-[#3152F4]" /><span className="text-[11px] text-[#8E929C]">Allow <strong className="font-semibold text-[#151515]">Critical Lead Alerts</strong> &amp; security overrides during quiet hours.</span></label>
              </div>
            </section>

            <section className="flex flex-col justify-between gap-4 rounded-[20px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#F1F2F5] text-[#151515]"><Buildings className="text-[18px]" /></div><div><h3 className="text-[13px] font-bold text-[#151515]">Delivery Domain Scope</h3><p className="text-[11px] text-[#8E929C]">Active routing channels</p></div></div>
                <span className="h-2.5 w-2.5 rounded-full bg-[#0B7A57] ring-4 ring-[#0B7A57]/10" title="All primary channels healthy" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="relative"><select name="domainScope" value={draft.domainScope} onChange={(e) => setDraft((cur) => ({ ...cur, domainScope: e.target.value }))} className="h-9 w-full appearance-none rounded-xl bg-[#F1F2F5] px-3 pr-8 text-[12px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">{["All Websites (ailqs.com)", "ailqs.com only", "sandbox-demo.ailqs.com"].map((o) => <option key={o}>{o}</option>)}</select><CaretDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[15px] text-[#8E929C]" /></div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["In-app", "Email", "Browser", "Slack"].map((c) => <span key={c} className="inline-flex items-center gap-1 rounded-md bg-[#F1F2F5] px-2 py-0.5 text-[11px] text-[#151515]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />{c}</span>)}
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#F1F2F5] px-2 py-0.5 text-[11px] text-[#8E929C]"><Lock className="text-[11px]" />WhatsApp</span>
                </div>
              </div>
            </section>
          </div>

          <section className="flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
            <div className="flex flex-col justify-between gap-3 px-6 py-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#3152F4] text-white shadow-[0_4px_10px_rgba(49,82,244,0.25)]"><ListChecks className="text-[16px]" /></span><div><h2 className="text-[15px] font-bold text-[#151515]">Event Notification Routing Matrix</h2><p className="text-[11px] text-[#8E929C]">Customize discrete trigger behaviors across every endpoint</p></div></div>
              <div className="flex items-center gap-2"><span className="text-[11px] text-[#8E929C]">Fast Filter:</span>{(["All", "Leads", "System"] as const).map((f) => <button key={f} type="button" onClick={() => setFastFilter(f)} className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${fastFilter === f ? "bg-[#F1F2F5] text-[#151515]" : "text-[#8E929C] hover:bg-[#F1F2F5]"}`}>{f} ({counts[f]})</button>)}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead><tr className="bg-[#F8F9FC] text-[11px] font-semibold text-[#151515]">
                  <th className="min-w-[300px] px-6 py-3.5">Event Type &amp; Trigger Details</th>
                  <th className="min-w-[80px] px-4 py-3.5 text-center"><span className="flex items-center justify-center gap-1.5"><BellRinging className="text-[14px] text-[#3152F4]" />In-app</span></th>
                  <th className="min-w-[140px] px-4 py-3.5 text-center"><span className="flex items-center justify-center gap-1.5"><Envelope className="text-[14px] text-[#3152F4]" />Email</span></th>
                  <th className="min-w-[90px] px-4 py-3.5 text-center"><span className="flex items-center justify-center gap-1.5"><Monitor className="text-[14px] text-[#3152F4]" />Browser Push</span></th>
                  <th className="min-w-[150px] px-4 py-3.5 text-center"><span className="flex items-center justify-center gap-1.5"><Tag className="text-[14px] text-[#3152F4]" />Slack</span></th>
                  <th className="min-w-[110px] px-4 py-3.5 text-center"><span className="flex items-center justify-center gap-1.5 text-[#8E929C]"><ChatCircle className="text-[14px]" />WhatsApp<span className="rounded bg-[#F1F2F5] px-1 py-0.5 text-[9px] font-bold text-[#8E929C]">Add-on</span></span></th>
                </tr></thead>
                <tbody className="divide-y divide-[#F1F2F5] text-[12px] text-[#151515]">
                  {visibleRows.map((row) => {
                    const showGroup = row.groupLabel !== lastGroup;
                    lastGroup = row.groupLabel;
                    return (
                      <Fragment key={row.id}>
                        {showGroup && <tr className="bg-[#F8F9FC]"><td colSpan={6} className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-wide text-[#3152F4]">{row.groupLabel}</td></tr>}
                        <tr className="transition-colors hover:bg-[#F8F9FC]/60">
                          <td className="px-6 py-4 align-top">
                            <div className="flex items-start gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: row.dot }} />
                              <div className="flex flex-col"><div className="flex flex-wrap items-center gap-2"><span className="text-[13px] font-bold text-[#151515]">{row.name}</span>{row.badge && <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${notifBadgeClasses(row.badge.tone)}`}>{row.badge.text}</span>}</div><p className="mt-0.5 text-[11px] text-[#8E929C]">{row.description}</p></div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center align-top"><div className="flex justify-center"><NotifSwitch checked={row.inApp} onChange={() => toggleRowBool(row.id, "inApp")} label={`${row.name} in-app`} /></div></td>
                          <td className="px-4 py-4 text-center align-top">
                            {row.emailLocked ? (
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${notifBadgeClasses(row.emailLocked.tone)}`}><Lock className="text-[11px]" />{row.emailLocked.text}</span>
                            ) : (
                              <select name={`emailMode-${row.id}`} aria-label={`${row.name} email frequency`} value={row.email} onChange={(e) => updateRow(row.id, { email: e.target.value as NotifEmailMode })} className="rounded-full bg-[#F1F3FF] px-2.5 py-1 text-[11px] font-semibold text-[#3152F4] outline-none focus:ring-2 focus:ring-[#3152F4]/20">
                                {(["Instant", "Daily Digest", "Off"] as const).map((o) => <option key={o}>{o}</option>)}
                              </select>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center align-top"><div className="flex items-center justify-center gap-1.5"><NotifSwitch checked={row.browserPush} onChange={() => toggleRowBool(row.id, "browserPush")} label={`${row.name} browser push`} />{row.chime && <span title="Audible chime enabled"><SpeakerHigh className="text-[13px] text-[#8E929C]" /></span>}</div></td>
                          <td className="px-4 py-4 text-center align-top">
                            {row.slackChannel ? (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F1F2F5] px-2 py-1 text-[11px] font-semibold text-[#151515]"><span className={row.slackMention ? "font-bold text-[#F04452]" : "text-[#8E929C]"}>{row.slackMention ? "@" : "#"}</span>{row.slackChannel}</span>
                            ) : (
                              <div className="flex justify-center"><NotifSwitch checked={row.slackEnabled} onChange={() => toggleRowBool(row.id, "slackEnabled")} label={`${row.name} slack routing`} /></div>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center align-top"><span className="inline-flex items-center gap-1 text-[#C4C5D9]"><Lock className="text-[13px]" /><span className="text-[11px]">Locked</span></span></td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="relative flex flex-col items-start justify-between gap-5 overflow-hidden rounded-[22px] bg-[linear-gradient(120deg,#171C25_0%,#2C303A_100%)] p-6 text-white shadow-[0_16px_36px_rgba(15,15,20,0.18)] md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#25D366]/30 bg-[#25D366]/20 text-[#25D366]"><ChatCircle weight="fill" className="text-[24px]" /></div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2"><h3 className="text-[15px] font-bold">WhatsApp Business Instant Notifications Add-on</h3><span className="rounded-full bg-[#25D366]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#25D366]">Meta Cloud API</span></div>
                <p className="max-w-2xl text-[12px] leading-relaxed text-[#C4C5D9]">Deliver real-time Hot Lead signals and live handoff escalations directly to your sales team&apos;s WhatsApp mobile devices with interactive accept/decline action chips. Available as a <strong className="font-semibold text-white">€19/mo</strong> workspace add-on or bundled free in the Enterprise Plan.</p>
              </div>
            </div>
            <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">
              <button type="button" onClick={() => notify("WhatsApp add-on details opened")} className="flex-1 rounded-xl bg-white/10 px-4 py-2.5 text-center text-[12px] font-semibold text-white hover:bg-white/20 sm:flex-none">Explore Add-on</button>
              <button type="button" onClick={() => setSection("Billing & Usage")} className="flex-1 rounded-xl bg-[#25D366] px-5 py-2.5 text-center text-[12px] font-bold text-[#002115] shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:opacity-90 sm:flex-none">Upgrade to Premium</button>
            </div>
          </div>
        </>
      )}

      {activeTab === "Preferences" && dirty && (
        <div className="fixed bottom-8 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 items-center justify-between gap-5 rounded-2xl bg-[#151515] px-5 py-3.5 text-white shadow-[0_20px_45px_rgba(0,0,0,0.24)] md:w-auto">
          <div className="flex min-w-0 items-center gap-3"><span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[#3152F4]" /><span className="truncate text-[12px]">Unsaved configuration changes.</span></div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={discard} className="rounded-xl px-3 py-1.5 text-[12px] font-semibold text-white/80 hover:bg-white/10">Discard</button>
            <button type="button" onClick={save} className="flex items-center gap-1.5 rounded-xl bg-[#3152F4] px-3.5 py-1.5 text-[12px] font-bold text-white shadow-[0_4px_12px_rgba(49,82,244,0.35)] hover:opacity-95"><FloppyDisk className="text-[14px]" />Save Preferences</button>
          </div>
        </div>
      )}
    </div>
  );
}

type TeamRole = "Sales Representative" | "Sales Manager" | "Admin" | "Viewer";
type TeamAssignment = "Inbound Sales" | "Enterprise SDR" | "Enterprise Lead Gen";
type TeamAvailability = "Available" | "Busy" | "Offline";
interface TeamMember {
  id: number; name: string; email: string; initials: string; avatarColor: string; owner?: boolean;
  role: TeamRole; team: TeamAssignment; websiteAccess: string; websiteAll?: boolean;
  availability: TeamAvailability; availabilityNote?: string;
  workloadLeads: number; workloadPct: number; workloadLabel: "High" | "Optimal" | "Light";
  status: "Active" | "Invited"; lastActive: string;
}
const initialTeamMembers: TeamMember[] = [
  { id: 1, name: "Maya Singh", email: "maya@ailqs.com", initials: "MS", avatarColor: "#DDE3FF", owner: true, role: "Sales Manager", team: "Inbound Sales", websiteAccess: "ailqs.com", websiteAll: true, availability: "Available", workloadLeads: 18, workloadPct: 90, workloadLabel: "High", status: "Active", lastActive: "Active now" },
  { id: 2, name: "Arjun Mehta", email: "arjun@ailqs.com", initials: "AM", avatarColor: "#DDE3FF", role: "Sales Representative", team: "Inbound Sales", websiteAccess: "ailqs.com", availability: "Busy", availabilityNote: "In Discovery Call", workloadLeads: 12, workloadPct: 60, workloadLabel: "Optimal", status: "Active", lastActive: "14m ago" },
  { id: 3, name: "Riya Sen", email: "riya@ailqs.com", initials: "RS", avatarColor: "#DDE3FF", role: "Sales Representative", team: "Enterprise Lead Gen", websiteAccess: "ailqs.com", availability: "Offline", workloadLeads: 9, workloadPct: 45, workloadLabel: "Light", status: "Active", lastActive: "2h ago" },
];
const teamRoleOptions: { value: TeamRole; description: string }[] = [
  { value: "Sales Representative", description: "Can claim leads, reply in Team Inbox, and log qualifications." },
  { value: "Sales Manager", description: "Full pipeline visibility, can reassign leads and manage routing rules." },
  { value: "Admin", description: "Complete workspace access including billing, integrations, and security settings." },
  { value: "Viewer", description: "Read-only access to leads, analytics, and reports." },
];
function teamAvailabilityClasses(a: TeamAvailability) {
  switch (a) {
    case "Available": return { pill: "bg-[#E8F8F3] text-[#0B7A57]", dot: "bg-[#0B7A57]" };
    case "Busy": return { pill: "bg-[#FEF8EC] text-[#B7791F]", dot: "bg-[#F5A524]" };
    default: return { pill: "bg-[#F1F2F5] text-[#5E626D]", dot: "bg-[#8E929C]" };
  }
}
function teamWorkloadClasses(label: TeamMember["workloadLabel"]) {
  switch (label) {
    case "High": return { bar: "bg-[#F04452]", text: "text-[#F04452]" };
    case "Optimal": return { bar: "bg-[#3152F4]", text: "text-[#8E929C]" };
    default: return { bar: "bg-[#58DDAC]", text: "text-[#0B7A57]" };
  }
}

function TeamPage({ notify, setSection }: { notify: (v: string) => void; setSection: (v: string) => void }) {
  const [teamTab, setTeamTab] = useState<"Members" | "Teams" | "Routing Rules" | "Performance & Workload">("Members");
  const [members, setMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [maxSeats, setMaxSeats] = useState(3);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("Sales Representative");
  const [inviteTeam, setInviteTeam] = useState<"Inbound Sales" | "Enterprise SDR">("Inbound Sales");
  const [inviteWebsiteMain, setInviteWebsiteMain] = useState(true);
  const [inviteWebsiteDemo, setInviteWebsiteDemo] = useState(false);
  const [inviteCap, setInviteCap] = useState(15);
  const [openActionsId, setOpenActionsId] = useState<number | null>(null);
  const nextMemberId = useRef(4);

  const seatsUsed = members.length;
  const capHit = seatsUsed >= maxSeats;
  const totalPipeline = members.reduce((sum, m) => sum + m.workloadLeads, 0);
  const onlineCount = members.filter((m) => m.availability !== "Offline").length;

  function closeInvite() {
    setInviteOpen(false); setInviteEmail(""); setInviteRole("Sales Representative"); setInviteTeam("Inbound Sales"); setInviteWebsiteMain(true); setInviteWebsiteDemo(false); setInviteCap(15);
  }
  function sendInvite() {
    const email = inviteEmail.trim();
    if (!email) { notify("Enter a work email address"); return; }
    const namePart = email.split("@")[0].split(/[._]/).map((w) => (w ? w[0].toUpperCase() + w.slice(1) : "")).join(" ");
    const initials = namePart.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "NA";
    const id = nextMemberId.current++;
    const newMember: TeamMember = {
      id, name: namePart || email, email, initials, avatarColor: "#DDE3FF", role: inviteRole, team: inviteTeam,
      websiteAccess: "ailqs.com", websiteAll: inviteWebsiteMain && inviteWebsiteDemo, availability: "Offline",
      workloadLeads: 0, workloadPct: 0, workloadLabel: "Light", status: "Invited", lastActive: "Just invited",
    };
    setMembers((cur) => [...cur, newMember]);
    if (capHit) { setMaxSeats((cur) => cur + 1); notify(`Seat added ($24/mo) and invite sent to ${email}`); }
    else notify(`Invite sent to ${email}`);
    closeInvite();
  }
  function cycleRole(id: number) {
    setMembers((cur) => cur.map((m) => {
      if (m.id !== id) return m;
      const idx = teamRoleOptions.findIndex((r) => r.value === m.role);
      const next = teamRoleOptions[(idx + 1) % teamRoleOptions.length].value;
      return { ...m, role: next };
    }));
    setOpenActionsId(null);
    notify("Role updated");
  }
  function removeMember(id: number) {
    const m = members.find((x) => x.id === id);
    setMembers((cur) => cur.filter((x) => x.id !== id));
    setOpenActionsId(null);
    if (m) notify(`${m.name} removed from team`);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3"><h1 className="text-[22px] font-bold tracking-tight text-[#151515]">Team</h1><span className="flex items-center gap-1.5 rounded-full bg-[#F1F2F5] px-2.5 py-0.5 text-[12px] font-semibold text-[#5E626D]"><span className={`h-1.5 w-1.5 rounded-full ${capHit ? "bg-[#F5A524]" : "bg-[#0B7A57]"}`} />{seatsUsed} of {maxSeats} Seats Used</span></div>
            <p className="max-w-2xl text-[12px] text-[#8E929C]">Manage team members, roles, lead routing permissions, and seat allocations.</p>
          </div>
          <button type="button" onClick={() => setInviteOpen(true)} className="flex shrink-0 items-center gap-2 rounded-xl bg-[#3152F4] px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(49,82,244,0.32)] ring-4 ring-[#3152F4]/20 hover:opacity-95"><UserPlus className="text-[18px]" />+ Invite Member</button>
        </div>

        <div className="flex w-fit items-center gap-1 rounded-full bg-[#F1F2F5] p-1">
          {(["Members", "Teams", "Routing Rules", "Performance & Workload"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTeamTab(t)} className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${teamTab === t ? "bg-[#3152F4] text-white shadow-[0_4px_12px_rgba(49,82,244,0.3)]" : "text-[#5E626D] hover:bg-[#E5E8F5] hover:text-[#151515]"}`}>
              <span>{t}</span>
              {t === "Members" && <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${teamTab === t ? "bg-white/20 text-white" : "bg-[#E5E8F5] text-[#5E626D]"}`}>{members.length}</span>}
              {t === "Teams" && <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${teamTab === t ? "bg-white/20 text-white" : "bg-[#E5E8F5] text-[#5E626D]"}`}>2</span>}
            </button>
          ))}
        </div>

        {teamTab === "Members" && (
          <>
            {capHit && (
              <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(20,25,40,0.03)] md:flex-row md:items-center">
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><Trophy className="text-[20px]" /></div>
                  <div className="flex max-w-2xl flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2"><span className="text-[14px] font-bold text-[#151515]">Starter Plan Seat Limit Reached ({seatsUsed}/{maxSeats} Allocated)</span><span className="rounded-md bg-[#F1F2F5] px-2 py-0.5 text-[11px] font-semibold text-[#5E626D]">Cap Hit</span></div>
                    <p className="text-[12px] text-[#8E929C]">You have used all {maxSeats} member seats included with your Starter Plan. To collaborate with additional SDRs, sales engineers, or managers with custom role permissions, upgrade to Premium.</p>
                    <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-[#8E929C]"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3152F4]" />{seatsUsed} seats active</span><span>•</span><span className="text-[11px] font-semibold text-[#151515]">{Math.max(0, maxSeats - seatsUsed)} seats remaining</span></div>
                  </div>
                </div>
                <div className="flex w-full shrink-0 items-center justify-end gap-3 md:w-auto">
                  <button type="button" onClick={() => notify("Plan comparison opened")} className="px-3 py-2 text-[12px] font-semibold text-[#8E929C] hover:text-[#151515]">Compare Plans</button>
                  <button type="button" onClick={() => setSection("Billing & Usage")} className="flex items-center gap-2 rounded-xl bg-[#3152F4] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(49,82,244,0.28)] hover:opacity-95"><Lightning className="text-[15px]" />Upgrade to Premium</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
                <div className="flex flex-col"><span className="text-[12px] text-[#8E929C]">Total Pipeline Managed</span><span className="mt-1 text-[22px] font-bold text-[#151515]">{totalPipeline} Leads</span><span className="mt-0.5 flex items-center gap-1 text-[11px] text-[#0B7A57]"><TrendUp className="text-[13px]" />+14% this week</span></div>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F1F2F5] text-[#151515]"><Database className="text-[22px]" /></div>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
                <div className="flex flex-col"><span className="text-[12px] text-[#8E929C]">Live Rep Availability</span><span className="mt-1 text-[22px] font-bold text-[#151515]">{onlineCount} / {members.length} Online</span><span className="mt-0.5 text-[11px] text-[#8E929C]">{members.filter((m) => m.availability === "Busy").length} in discovery call</span></div>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#E8F8F3] text-[#0B7A57]"><Headset className="text-[22px]" /></div>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
                <div className="flex flex-col"><span className="text-[12px] text-[#8E929C]">Avg AI Routing Time</span><span className="mt-1 text-[22px] font-bold text-[#151515]">1.8s</span><span className="mt-0.5 text-[11px] text-[#0B7A57]">SLA: &lt; 5.0s</span></div>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F1F2F5] text-[#151515]"><Gauge className="text-[22px]" /></div>
              </div>
            </div>

            <section className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
              <div className="flex items-center justify-between gap-4 bg-[#F8F9FC] p-4">
                <div className="flex items-center gap-2"><span className="text-[15px] font-bold text-[#151515]">All Members</span><span className="text-[12px] text-[#8E929C]">• AILQS Workspace</span></div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => notify("Filter options opened")} aria-label="Filter members" className="rounded-lg bg-white p-2 text-[#8E929C] shadow-sm hover:text-[#151515]"><Funnel className="text-[16px]" /></button>
                  <button type="button" onClick={() => notify("Members exported as CSV")} aria-label="Export members" className="rounded-lg bg-white p-2 text-[#8E929C] shadow-sm hover:text-[#151515]"><DownloadSimple className="text-[16px]" /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] border-collapse text-left">
                  <thead><tr className="bg-[#F8F9FC]/60 text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">
                    <th className="px-4 py-3.5">Team Member</th><th className="px-4 py-3.5">Role</th><th className="px-4 py-3.5">Team</th><th className="px-4 py-3.5">Website Access</th><th className="px-4 py-3.5">Availability</th><th className="px-4 py-3.5">Workload &amp; Leads</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5">Last Active</th><th className="px-4 py-3.5 text-right">Actions</th>
                  </tr></thead>
                  <tbody className="text-[12px] text-[#151515]">
                    {members.map((m) => {
                      const av = teamAvailabilityClasses(m.availability);
                      const wl = teamWorkloadClasses(m.workloadLabel);
                      return (
                        <tr key={m.id} className="border-t border-[#F1F2F5] hover:bg-[#F8F9FC]/60">
                          <td className="px-4 py-4 align-middle">
                            <div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[12px] font-bold text-[#151515]" style={{ background: m.avatarColor }}>{m.initials}</span>
                              <div className="flex min-w-0 flex-col"><span className="flex items-center gap-1.5 truncate text-[13px] font-semibold text-[#151515]">{m.name}{m.owner && <span className="rounded bg-[#3152F4]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#3152F4]">Owner</span>}</span><span className="truncate text-[11px] text-[#8E929C]">{m.email}</span></div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 align-middle"><span className="rounded-full bg-[#F1F2F5] px-2.5 py-1 text-[12px] font-semibold text-[#151515]">{m.role}</span></td>
                          <td className="whitespace-nowrap px-4 py-4 align-middle"><span className="rounded-lg bg-[#F8F9FC] px-2 py-0.5 text-[11px] text-[#151515]">{m.team}</span></td>
                          <td className="whitespace-nowrap px-4 py-4 align-middle"><span className="flex items-center gap-1 text-[11px] text-[#8E929C]"><Globe className="text-[13px]" />{m.websiteAccess}{m.websiteAll && <span className="font-semibold text-[#151515]"> (All)</span>}</span></td>
                          <td className="whitespace-nowrap px-4 py-4 align-middle"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${av.pill}`}><span className={`h-1.5 w-1.5 rounded-full ${av.dot}`} />{m.availabilityNote ? `${m.availability} (${m.availabilityNote})` : m.availability}</span></td>
                          <td className="px-4 py-4 align-middle">
                            <div className="flex w-36 flex-col gap-1"><div className="flex items-center justify-between"><span className="font-mono text-[12px] font-semibold text-[#151515]">{m.workloadLeads} leads</span><span className={`text-[10px] font-bold uppercase ${wl.text}`}>{m.workloadLabel}</span></div><div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F2F5]"><div className={`h-full rounded-full ${wl.bar}`} style={{ width: `${m.workloadPct}%` }} /></div></div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 align-middle"><span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${m.status === "Active" ? "bg-[#F1F2F5] text-[#5E626D]" : "bg-[#FEF8EC] text-[#B7791F]"}`}>{m.status}</span></td>
                          <td className={`whitespace-nowrap px-4 py-4 align-middle text-[12px] ${m.lastActive === "Active now" ? "font-medium text-[#0B7A57]" : "text-[#8E929C]"}`}>{m.lastActive}</td>
                          <td className="relative whitespace-nowrap px-4 py-4 text-right align-middle">
                            <button type="button" onClick={() => setOpenActionsId(openActionsId === m.id ? null : m.id)} aria-label={`Actions for ${m.name}`} className="rounded-lg p-1.5 text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515]"><DotsThreeVertical weight="bold" className="text-[18px]" /></button>
                            {openActionsId === m.id && (
                              <div className="absolute right-4 top-12 z-10 w-44 rounded-xl bg-white p-1.5 text-left shadow-[0_16px_36px_rgba(20,25,40,0.16)]">
                                <button type="button" onClick={() => cycleRole(m.id)} className="w-full rounded-lg px-3 py-2 text-left text-[12px] font-semibold text-[#151515] hover:bg-[#F1F2F5]">Change Role</button>
                                {!m.owner && <button type="button" onClick={() => removeMember(m.id)} className="w-full rounded-lg px-3 py-2 text-left text-[12px] font-semibold text-[#F04452] hover:bg-[#FDF2F3]">Remove from Team</button>}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col items-center justify-between gap-3 bg-[#F8F9FC]/50 p-4 text-[12px] text-[#8E929C] sm:flex-row">
                <span>Showing {members.length} of {members.length} members in AILQS Demo</span>
                <div className="flex items-center gap-2"><button type="button" disabled className="cursor-not-allowed rounded-lg bg-[#F1F2F5] px-3 py-1 text-[#C4C5D9]">Previous</button><span className="rounded-lg px-2 py-1 text-[12px] font-bold text-[#151515]">1</span><button type="button" disabled className="cursor-not-allowed rounded-lg bg-[#F1F2F5] px-3 py-1 text-[#C4C5D9]">Next</button></div>
              </div>
            </section>
          </>
        )}

        {teamTab === "Teams" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(["Inbound Sales", "Enterprise SDR"] as const).map((teamName) => {
              const teamMembers = members.filter((m) => m.team === teamName || (teamName === "Enterprise SDR" && m.team === "Enterprise Lead Gen"));
              return (
                <div key={teamName} className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
                  <div className="flex items-center justify-between"><span className="text-[14px] font-bold text-[#151515]">{teamName}</span><span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[11px] font-semibold text-[#5E626D]">{teamMembers.length} members</span></div>
                  <div className="flex flex-wrap items-center gap-2">
                    {teamMembers.length === 0 && <span className="text-[12px] text-[#8E929C]">No members assigned yet.</span>}
                    {teamMembers.map((m) => <span key={m.id} className="flex items-center gap-1.5 rounded-full bg-[#F8F9FC] px-2.5 py-1 text-[11px] font-semibold text-[#151515]"><span className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold" style={{ background: m.avatarColor }}>{m.initials}</span>{m.name}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {teamTab === "Routing Rules" && <TeamRoutingRulesTab notify={notify} />}
        {teamTab === "Performance & Workload" && <TeamPerformanceTab members={members} />}
      </div>

      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button type="button" aria-label="Close" onClick={closeInvite} className="absolute inset-0 bg-black/30" />
          <aside className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-[0_24px_48px_rgba(18,24,40,0.2)]">
          <div className="flex items-center justify-between gap-3 bg-[#F8F9FC] p-5">
            <div className="flex items-center gap-2.5"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#3152F4]/10 text-[#3152F4]"><UserPlus className="text-[18px]" /></div><div><h2 className="text-[16px] font-bold leading-snug text-[#151515]">Invite New Member</h2><span className="text-[11px] text-[#8E929C]">Configure lead routing &amp; seat</span></div></div>
            <button type="button" onClick={closeInvite} aria-label="Close invite drawer" className="rounded-lg p-1.5 text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515]"><X className="text-[18px]" /></button>
          </div>
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
            {capHit && (
              <div className="flex flex-col gap-2 rounded-xl bg-[#FEF8EC] p-4 text-[#151515]">
                <div className="flex items-center gap-2 font-semibold text-[#B7791F]"><Warning className="text-[16px]" /><span className="text-[12px]">Seat Quota Reached</span></div>
                <p className="text-[11px] leading-relaxed text-[#8E929C]">Your Starter Plan includes {maxSeats} team seats. Inviting this member will add <strong className="font-semibold text-[#151515]">+1 seat (€24/mo)</strong> or upgrade your workspace to Premium for unlimited team collaboration.</p>
              </div>
            )}
            <label className="flex flex-col gap-1.5"><span className="text-[12px] font-semibold text-[#151515]">Work Email Address</span>
              <div className="relative"><Envelope className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[16px] text-[#8E929C]" /><input name="inviteEmail" type="email" autoComplete="off" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@ailqs.com" className="h-11 w-full rounded-xl bg-[#F1F2F5] pl-10 pr-4 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" /></div>
            </label>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-[#151515]">Role &amp; Permissions</span><button type="button" onClick={() => notify("Permissions matrix opened")} className="text-[11px] font-semibold text-[#3152F4] hover:underline">View Matrix</button></div>
              <div className="relative"><select name="inviteRole" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as TeamRole)} className="h-11 w-full appearance-none rounded-xl bg-[#F1F2F5] px-3.5 pr-9 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">{teamRoleOptions.map((r) => <option key={r.value}>{r.value}</option>)}</select><CaretDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-[#8E929C]" /></div>
              <p className="text-[11px] text-[#8E929C]">{teamRoleOptions.find((r) => r.value === inviteRole)?.description}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold text-[#151515]">Team Assignment</span>
              <div className="grid grid-cols-2 gap-2">
                {(["Inbound Sales", "Enterprise SDR"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setInviteTeam(t)} className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-[12px] font-semibold transition-colors ${inviteTeam === t ? "bg-[#3152F4] text-white shadow-sm" : "bg-[#F1F2F5] text-[#5E626D] hover:bg-[#E5E8F5] hover:text-[#151515]"}`}>{inviteTeam === t && <CheckCircle weight="fill" className="text-[15px]" />}{t}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold text-[#151515]">Website &amp; Lead Source Access</span>
              <div className="flex flex-col gap-2 rounded-xl bg-[#F1F2F5] p-3">
                <label className="flex cursor-pointer items-center gap-3"><input type="checkbox" checked={inviteWebsiteMain} onChange={() => setInviteWebsiteMain((v) => !v)} className="h-4 w-4 rounded accent-[#3152F4]" /><div className="flex min-w-0 flex-col"><span className="text-[13px] font-semibold text-[#151515]">ailqs.com</span><span className="text-[11px] text-[#8E929C]">Primary marketing site and inbound AI widget</span></div></label>
                <label className="flex cursor-pointer items-center gap-3 opacity-80"><input type="checkbox" checked={inviteWebsiteDemo} onChange={() => setInviteWebsiteDemo((v) => !v)} className="h-4 w-4 rounded accent-[#3152F4]" /><div className="flex min-w-0 flex-col"><span className="text-[13px] text-[#151515]">demo.ailqs.com</span><span className="text-[11px] text-[#8E929C]">Product sandbox widget</span></div></label>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-[#151515]">Max Active Leads Cap</span><span className="font-mono text-[13px] font-bold text-[#3152F4]">{inviteCap} leads</span></div>
              <input name="inviteCap" type="range" min={5} max={30} value={inviteCap} onChange={(e) => setInviteCap(Number(e.target.value))} className="w-full accent-[#3152F4]" aria-label="Max active leads cap" />
              <div className="flex justify-between text-[10px] text-[#8E929C]"><span>5 (Light)</span><span>15 (Standard)</span><span>30 (Heavy)</span></div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 bg-[#F8F9FC] p-4">
            <button type="button" onClick={closeInvite} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-[#8E929C] hover:bg-[#F1F2F5] hover:text-[#151515]">Cancel</button>
            <button type="button" onClick={sendInvite} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3152F4] px-4 py-2.5 text-[12px] font-bold text-white shadow-[0_8px_20px_rgba(49,82,244,0.3)] hover:opacity-95">
              {capHit ? <><CreditCard className="text-[16px]" />Upgrade to Add Seat (€24/mo)</> : <><UserPlus className="text-[16px]" />Send Invite</>}
            </button>
          </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function TeamRoutingRulesTab({ notify }: { notify: (v: string) => void }) {
  const [roundRobin, setRoundRobin] = useState(true);
  const [autoReassign, setAutoReassign] = useState(true);
  const [managerApproval, setManagerApproval] = useState(false);
  const [capacityAware, setCapacityAware] = useState(true);
  const rows: [string, string, boolean, (v: boolean) => void][] = [
    ["Round-robin assignment within team", "New leads rotate evenly across available reps on the same team.", roundRobin, setRoundRobin],
    ["Auto-reassign after 10 minutes idle", "Unclaimed leads route to the next available rep if not picked up in time.", autoReassign, setAutoReassign],
    ["Require manager approval for enterprise leads", "Deals routed to Enterprise SDR need Sales Manager sign-off before contact.", managerApproval, setManagerApproval],
    ["Capacity-aware routing", "Skip reps who are at or above their Max Active Leads Cap.", capacityAware, setCapacityAware],
  ];
  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
      <div className="flex flex-col gap-1"><h2 className="text-[15px] font-bold text-[#151515]">Lead Routing Rules</h2><p className="text-[12px] text-[#8E929C]">Control how inbound leads are distributed across your team.</p></div>
      <div className="flex flex-col divide-y divide-[#F1F2F5]">
        {rows.map(([title, desc, checked, setChecked]) => (
          <div key={title} className="flex items-center justify-between gap-4 py-3.5">
            <div className="flex flex-col"><span className="text-[13px] font-semibold text-[#151515]">{title}</span><span className="text-[11px] text-[#8E929C]">{desc}</span></div>
            <ToggleSwitch checked={checked} onChange={() => { setChecked(!checked); notify(`${title} ${!checked ? "enabled" : "disabled"}`); }} label={title} />
          </div>
        ))}
      </div>
    </section>
  );
}

function TeamPerformanceTab({ members }: { members: TeamMember[] }) {
  const maxLeads = Math.max(1, ...members.map((m) => m.workloadLeads));
  const sorted = [...members].sort((a, b) => b.workloadLeads - a.workloadLeads);
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
      <div className="flex flex-col gap-1"><h2 className="text-[15px] font-bold text-[#151515]">Performance &amp; Workload</h2><p className="text-[12px] text-[#8E929C]">Active lead load per teammate, ranked highest to lowest.</p></div>
      <div className="flex flex-col gap-3">
        {sorted.map((m) => {
          const wl = teamWorkloadClasses(m.workloadLabel);
          return (
            <div key={m.id} className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold text-[#151515]" style={{ background: m.avatarColor }}>{m.initials}</span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center justify-between"><span className="truncate text-[12px] font-semibold text-[#151515]">{m.name}</span><span className="font-mono text-[12px] font-semibold text-[#151515]">{m.workloadLeads} leads</span></div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F2F5]"><div className={`h-full rounded-full ${wl.bar}`} style={{ width: `${(m.workloadLeads / maxLeads) * 100}%` }} /></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

type AgentSetupTab = "Identity" | "Behavior" | "Conversation Flow" | "Guardrails" | "Languages" | "Test & Publish";
const agentSetupNav: [AgentSetupTab, typeof IdentificationBadge][] = [
  ["Identity", IdentificationBadge],
  ["Behavior", Brain],
  ["Conversation Flow", FlowArrow],
  ["Guardrails", ShieldCheck],
  ["Languages", Translate],
  ["Test & Publish", TestTube],
];
const personalityOptions = ["Professional & Direct", "Warm & Advisory", "Playful & Casual", "Consultative Expert"] as const;
const toneOptions = ["Empathetic", "Data-driven", "Crisp & Concise", "Authoritative"] as const;
const responseLengthOptions = ["Concise (1-2 sentences)", "Balanced (2-3 paragraphs)", "Detailed & Thorough"] as const;
const avatarMarks = [
  { key: "cobalt", label: "Cobalt Spark", desc: "Brand geometric glyph", icon: Sparkle },
  { key: "orbital", label: "Orbital Glyph", desc: "Layered ring motif", icon: CircleDashed },
  { key: "pulse", label: "Pulse Mark", desc: "Signal pulse icon", icon: Lightning },
] as const;
const defaultSystemPrompt =
  "You are Nova, the senior inbound lead qualifier for AILQS. Your goal is to welcome website visitors, discover their project scope (Web Dev, AI Automation, E-commerce), verify timeline and budget feasibility (threshold: €1,200+), and smoothly book high-intent prospects with the sales calendar. Maintain an advisory, clear demeanor. If prospects ask for technical architecture, summarize succinctly and offer the technical scoping call.";

function AgentKpi({ label, value, icon: Icon, note, pill }: { label: string; value: string; icon: typeof Fire; note?: string; pill?: string }) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-[#5E626D]">{label}</span>
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#F1F3FF] text-[#5E626D]"><Icon className="text-[16px]" /></div>
      </div>
      <div>
        <div className="text-[30px] font-bold leading-none tracking-tight text-[#151515]">{value}</div>
        {pill ? (
          <span className="mt-2 inline-block rounded-full bg-[#DEE0FF] px-2 py-0.5 text-[10px] font-semibold text-[#151B6B]">{pill}</span>
        ) : (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-[#8E929C]"><TrendUp className="text-[12px] text-[#0B7A57]" />{note}</div>
        )}
      </div>
    </div>
  );
}

interface ChatTurn {
  id: number;
  role: "agent" | "visitor";
  text: string;
}
interface TestHistoryItem {
  id: number;
  label: string;
  confidence: number;
  note: string;
  current: boolean;
  query?: string;
}

const initialChatTurns: ChatTurn[] = [
  { id: 1, role: "agent", text: "Hi there! 👋 Welcome to ailqs.com. Are you looking to scale your pipeline or integrate autonomous AI workflows?" },
  { id: 2, role: "visitor", text: "Hi Nova, we're looking to automate our client intake and CRM synchronization workflows. We have a budget under €50,000 and need to start next month. Can you handle custom API webhooks?" },
  { id: 3, role: "agent", text: "Yes, absolutely! AILQS builds enterprise workflow automations with custom bi-directional webhooks for HubSpot, Salesforce, and Zapier. With a budget under €50,000 and a 30-day kickoff timeline, your project qualifies for our Dedicated Sprint delivery model.\n\nWould you like me to book a 30-minute scoping session for this Thursday?" },
];
const quickScenarioPrompts = ['"What is your SLA?"', '"What about HIPAA compliance?"', '"Can we pay via wire transfer?"', '"Are you an offshore agency?"'];
const initialTestHistory: TestHistoryItem[] = [
  { id: 1, label: "Turn 1 • Fallback Triggered", confidence: 38, query: "Do you offer dental clinic physical hardware?", note: "Off-scope domain caught cleanly; offered general consultation handoff.", current: false },
  { id: 2, label: "Turn 2 • Current Turn", confidence: 92, note: "AI Automation under €50K with custom webhooks → Direct qualification & demo calendar invite.", current: true },
];

function turnTime(idx: number) {
  if (idx === 0) return "10:14 AM";
  if (idx <= 2) return "10:15 AM";
  const minute = 16 + Math.floor((idx - 3) / 2);
  return `10:${String(minute).padStart(2, "0")} AM`;
}

function craftPlaygroundReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("sla")) return "Our standard SLA guarantees a first response within 2 hours and 99.9% uptime on the qualification widget.";
  if (lower.includes("hipaa")) return "We support HIPAA-aligned data handling on Enterprise plans, including signed BAAs and regional data residency.";
  if (lower.includes("wire")) return "Yes — wire transfer is available for annual contracts above €10,000; I'll loop in billing once scope is confirmed.";
  if (lower.includes("offshore")) return "We're a distributed team with a US-based delivery lead assigned to every account, so you always have a single point of contact.";
  return "Thanks for the detail — I've logged that against your qualification profile and flagged it for the sales team.";
}

function AgentTestPlayground({ agentName, notify }: { agentName: string; notify: (v: string) => void }) {
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>(initialChatTurns);
  const [testInput, setTestInput] = useState("");
  const [citationOpen, setCitationOpen] = useState(true);
  const [leadScore, setLeadScore] = useState(68);
  const [confidence, setConfidence] = useState(92);
  const [testHistory, setTestHistory] = useState<TestHistoryItem[]>(initialTestHistory);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(4);
  const nextHistoryId = useRef(3);

  function sendTestMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = craftPlaygroundReply(trimmed);
    setChatTurns((cur) => [...cur, { id: nextId.current++, role: "visitor", text: trimmed }, { id: nextId.current++, role: "agent", text: reply }]);
    setLeadScore((cur) => Math.min(cur + 6, 100));
    setConfidence((cur) => Math.min(cur + 1, 99));
    setTestHistory((cur) => {
      const turnNumber = cur.length + 1;
      const relabeled = cur.map((item) => (item.current ? { ...item, current: false, label: `Turn ${turnNumber - 1} • Evaluated` } : item));
      return [...relabeled, { id: nextHistoryId.current++, label: `Turn ${turnNumber} • Current Turn`, confidence: Math.min(confidence + 4, 99), note: reply, current: true }];
    });
    setTestInput("");
    inputRef.current?.focus();
  }

  function resetTest() {
    setChatTurns(initialChatTurns);
    setTestInput("");
    setLeadScore(68);
    setConfidence(92);
    setTestHistory(initialTestHistory);
    notify("Test scenario reset");
  }

  function clearHistory() {
    setChatTurns([]);
    setTestHistory([]);
    notify("Chat history cleared");
  }

  const checklist = [
    { icon: CurrencyEur, label: "Budget: €50,000+", note: "Tier: High Fit (>= €1,200 threshold)", state: "Passed", tone: "pass" },
    { icon: Clock, label: "Timeline: Next Month (< 30d)", note: "Urgency Factor: Accelerated Kickoff", state: "Passed", tone: "pass" },
    { icon: CirclesThreePlus, label: "Service: AI Automation & CRM Sync", note: "Core Offering Match • 98% confidence", state: "Core Fit", tone: "fit" },
    { icon: Envelope, label: "Next Needed: Verified Contact Email", note: "Prompt logic will request slot confirmation", state: "Queued", tone: "queued" },
  ] as const;

  const rules = [
    { text: "IF budget >= €1,200 THEN +25 pts", pts: "+25 pts" },
    { text: "IF timeline <= 30 days THEN +20 pts", pts: "+20 pts" },
    { text: 'IF service == "AI Automation" THEN +15 pts', pts: "+15 pts" },
  ];

  return (
    <>
      <div className="flex flex-col gap-4 lg:col-span-9 xl:col-span-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-full bg-[#EFF7F3] px-3 py-1 text-[#0B7A57]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#0B7A57]" />
            <span className="text-[11px] font-bold">Sandbox Mode • Real-time Rule Execution</span>
          </div>
          <button type="button" onClick={resetTest} className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-[12px] font-semibold text-[#5E626D] shadow-sm hover:bg-[#F8F8FA]"><ArrowCounterClockwise className="text-[15px]" />Reset Test</button>
          <button type="button" onClick={() => notify("Test case saved")} className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#151515] shadow-sm hover:bg-[#F8F8FA]"><BookmarkSimple className="text-[15px]" />Save Test Case</button>
          <div className="ml-auto flex items-center gap-2 rounded-xl bg-[#F1F3FF] px-3 py-1.5 text-[#151515]">
            <SlidersHorizontal className="text-[14px] text-[#8E929C]" />
            <span className="text-[11px] text-[#8E929C]">Scenario:</span>
            <select name="testScenario" onChange={() => notify("Scenario switched")} defaultValue="High-Budget Lead Inbound" className="bg-transparent text-[12px] font-semibold text-[#151515] outline-none">
              <option>High-Budget Lead Inbound (€20K&ndash;€50K)</option>
              <option>Enterprise Inbound (&gt; €100K)</option>
              <option>Pricing Objection &amp; Retargeting</option>
              <option>Off-scope Technical Inquiry</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_12px_32px_rgba(23,28,37,0.08)]">
          <div className="flex items-center justify-between border-b border-[#F1F2F5] bg-[#F8F8FA] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#E5E8F5]" /><span className="h-2.5 w-2.5 rounded-full bg-[#E5E8F5]" /><span className="h-2.5 w-2.5 rounded-full bg-[#E5E8F5]" /></div>
              <div className="ml-2 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[11px] text-[#151515]"><Lock className="text-[12px] text-[#0B7A57]" />ailqs.com/ai-automation</div>
            </div>
            <div className="flex items-center gap-2"><span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[10px] text-[#8E929C]">Referral: Google Ads (Search)</span><span className="h-2 w-2 rounded-full bg-[#0B7A57]" /></div>
          </div>
          <div className="flex items-center justify-between bg-[#F8F8FA]/70 px-5 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-[#E5E2E1] text-[#5E626D]"><UserCircle className="text-[16px]" /></div>
              <div>
                <div className="flex items-center gap-2"><span className="text-[12px] font-bold text-[#151515]">Simulated Visitor: Acme Corp Candidate</span><span className="rounded bg-[#E8F8F3] px-1.5 py-0.5 text-[9px] font-bold text-[#0B7A57]">In-Session</span></div>
                <span className="text-[11px] text-[#8E929C]">Location: Austin, TX • Intent Flag: High Intent • IP Score: 0.96</span>
              </div>
            </div>
            <button type="button" onClick={() => notify("Full-screen simulator opened")} aria-label="Toggle full-screen simulator" className="text-[#8E929C] hover:text-[#151515]"><ArrowsOut className="text-[16px]" /></button>
          </div>

          <div className="flex max-h-[520px] min-h-[420px] flex-col gap-4 overflow-y-auto bg-gradient-to-b from-white to-[#F8F8FA]/30 p-5">
            <div className="flex justify-center"><span className="rounded-full bg-[#F1F2F5] px-3 py-1 text-[11px] text-[#8E929C]">Today • Conversation Initiated via Landing Trigger (5s scroll)</span></div>

            {chatTurns.length === 0 && <p className="text-center text-[11px] text-[#8E929C]">Chat history cleared. Send a message below to start a new turn.</p>}

            {chatTurns.map((turn, idx) =>
              turn.role === "agent" ? (
                <div key={turn.id} className="flex max-w-[92%] items-start gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#3152F4] text-white shadow-sm"><Robot weight="fill" className="text-[16px]" /></div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[12px] font-bold text-[#151515]">{agentName || "Nova"} AI</span>
                        {idx === chatTurns.length - 1 && (
                          <>
                            <span className="flex items-center gap-1 rounded-full bg-[#E8F8F3] px-2 py-0.5 text-[10px] font-bold text-[#0B7A57]"><ShieldCheck weight="fill" className="text-[11px]" />{confidence}% Confidence</span>
                            <span className="rounded-full bg-[#F1F2F5] px-2 py-0.5 text-[10px] text-[#8E929C]">v2.4 Draft</span>
                          </>
                        )}
                      </div>
                      <span className="text-[10px] text-[#8E929C]">{turnTime(idx)}{idx === 2 ? " (Latency: 480ms)" : ""}</span>
                    </div>
                    <div className="flex flex-col gap-3 whitespace-pre-line rounded-2xl rounded-tl-sm bg-[#F1F2F5] p-3.5 text-[12px] leading-relaxed text-[#151515] shadow-sm">
                      {turn.text}
                      {idx === 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          <span className="flex items-center gap-1.5 rounded-full bg-[#E7EBFF] px-2.5 py-1 text-[11px] font-semibold text-[#3152F4]">Selected: Scale AI Automation ⚡<Check weight="bold" className="text-[12px]" /></span>
                        </div>
                      )}
                      {idx === 2 && (
                        <>
                          <div className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm">
                            <button type="button" onClick={() => setCitationOpen((v) => !v)} className="flex items-center justify-between text-left">
                              <span className="flex items-center gap-2 text-[11px] font-bold text-[#3152F4]"><Sparkle weight="fill" className="text-[14px]" />Grounded via 2 Knowledge Sources</span>
                              <CaretDown className={`text-[14px] text-[#8E929C] transition-transform ${citationOpen ? "rotate-180" : ""}`} />
                            </button>
                            {citationOpen && (
                              <div className="flex flex-col gap-2 border-t border-[#F1F2F5] pt-2">
                                <div className="flex items-start gap-2 text-[11px] text-[#5E626D]"><Check weight="bold" className="mt-0.5 shrink-0 text-[12px] text-[#0B7A57]" /><span><b>Pricing &amp; Sprints Matrix (p. 4):</b> &ldquo;Dedicated Sprints range from €20,000 to €50,000 covering up to 4 custom bidirectional webhooks with enterprise SLA.&rdquo;</span></div>
                                <div className="flex items-start gap-2 text-[11px] text-[#5E626D]"><Check weight="bold" className="mt-0.5 shrink-0 text-[12px] text-[#0B7A57]" /><span><b>Custom Integrations Spec (p. 11):</b> &ldquo;Certified API webhooks for Salesforce, HubSpot, Retool, and custom PostgreSQL triggers.&rdquo;</span></div>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => notify("Scoping session booked for Thursday 11:30 AM")} className="flex items-center gap-1.5 rounded-lg bg-[#3152F4] px-3 py-1.5 text-[11px] font-semibold text-white hover:opacity-95"><CalendarBlank className="text-[13px]" />Book Thursday 11:30 AM</button>
                            <button type="button" onClick={() => notify("Other slots opened")} className="rounded-lg bg-[#E5E8F5] px-3 py-1.5 text-[11px] font-semibold text-[#151515] hover:bg-[#DCE0F0]">View Other Slots</button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={turn.id} className="flex max-w-[88%] flex-row-reverse items-start gap-3 self-end">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#5E626D] text-white shadow-sm"><UserCircle weight="fill" className="text-[16px]" /></div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[12px] font-bold text-[#151515]">Visitor (Acme)</span>
                    <div className="rounded-2xl rounded-tr-sm bg-[#3152F4] p-3.5 text-[12px] leading-relaxed text-white shadow-md">{turn.text}</div>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-[#F1F2F5] p-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="shrink-0 text-[11px] text-[#8E929C]">Inject scenario prompt:</span>
              {quickScenarioPrompts.map((prompt) => (
                <button key={prompt} type="button" onClick={() => { setTestInput(prompt.replace(/"/g, "")); inputRef.current?.focus(); }} className="shrink-0 rounded-full bg-[#F1F2F5] px-2.5 py-1 text-[11px] text-[#5E626D] transition-colors hover:bg-[#E5E8F5] hover:text-[#151515]">{prompt}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); sendTestMessage(testInput); }} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input ref={inputRef} name="visitorTestInput" value={testInput} onChange={(e) => setTestInput(e.target.value)} placeholder="Type a test visitor response or choose a quick prompt above..." className="h-11 w-full rounded-xl bg-[#F1F3FF] pl-4 pr-10 text-[13px] text-[#151515] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
                <button type="button" onClick={() => notify("Voice capture is not available in this preview")} aria-label="Voice input" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8E929C] hover:text-[#151515]"><Microphone className="text-[16px]" /></button>
              </div>
              <button type="submit" className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-[#3152F4] px-4 text-[13px] font-semibold text-white shadow-md transition-transform hover:opacity-95 active:scale-95">Send<PaperPlaneRight className="text-[15px]" /></button>
            </form>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => notify("Replaying last turn")} className="flex items-center gap-1 text-[11px] font-semibold text-[#5E626D] hover:text-[#151515]"><ArrowClockwise className="text-[13px]" />Replay Turn</button>
                <button type="button" onClick={clearHistory} className="flex items-center gap-1 text-[11px] font-semibold text-[#5E626D] hover:text-[#F04452]"><Trash className="text-[13px]" />Clear Chat History</button>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#8E929C]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />Model: Claude 3.5 Sonnet + RAG Index v9</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:col-span-12 xl:col-span-4">
        <div className="flex flex-col gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
          <div className="flex items-center justify-between border-b border-[#F1F2F5] pb-3">
            <div className="flex items-center gap-2"><Gauge className="text-[18px] text-[#3152F4]" /><h2 className="text-[15px] font-semibold text-[#151515]">Turn Telemetry</h2></div>
            <span className="flex items-center gap-1 rounded-full bg-[#E8F8F3] px-2.5 py-0.5 text-[11px] font-bold text-[#0B7A57]"><ShieldCheck weight="fill" className="text-[12px]" />Grounded {confidence}%</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-xl bg-[#F1F3FF] p-3.5">
              <div className="flex items-center justify-between"><span className="text-[10px] text-[#8E929C]">Lead Score Shift</span><span className="rounded bg-[#0B7A57] px-1.5 py-0.5 text-[9px] font-bold text-white">+{leadScore - 42} pts</span></div>
              <div className="mt-1 flex items-baseline gap-1.5"><span className="text-[22px] font-bold text-[#151515]">42</span><ArrowRight weight="bold" className="text-[14px] text-[#0B7A57]" /><span className="text-[26px] font-black text-[#3152F4]">{leadScore}</span></div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#0B7A57]"><Fire weight="fill" className="text-[13px]" />Elevated to Hot Lead</span>
            </div>
            <div className="flex flex-col justify-between rounded-xl bg-[#F1F3FF] p-3.5">
              <div className="flex items-center justify-between"><span className="text-[10px] text-[#8E929C]">Buying Intent</span><span className="h-2 w-2 rounded-full bg-[#0B7A57]" /></div>
              <div className="mt-2"><span className="block text-[15px] font-bold text-[#151515]">High (Ready)</span><span className="text-[10px] text-[#8E929C]">&lt; 30 Days Target</span></div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E8F5]"><div className="h-full rounded-full bg-[#0B7A57]" style={{ width: "88%" }} /></div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 rounded-xl bg-[#F1F3FF] p-3">
            <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-[#151515]">Qualification Checklist</span><span className="text-[11px] font-bold text-[#3152F4]">4 of 5 Verified (80%)</span></div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E8F5]"><div className="h-full rounded-full bg-[#3152F4]" style={{ width: "80%" }} /></div>
            <div className="flex items-center justify-between text-[10px] text-[#8E929C]"><span>Budget, Timeline, Scope &amp; Tech stack detected</span><span className="font-medium text-[#F04452]">Pending: Direct Email</span></div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Database className="text-[18px] text-[#3152F4]" /><h3 className="text-[15px] font-semibold text-[#151515]">Extracted Lead Attributes</h3></div>
            <span className="text-[10px] text-[#8E929C]">Parser: NER-v3</span>
          </div>
          <div className="flex flex-col gap-2">
            {checklist.map((item) => (
              <div key={item.label} className={`flex items-center justify-between rounded-xl p-2.5 ${item.tone === "queued" ? "bg-[#FDF2F3]" : "bg-[#F8F8FA]"}`}>
                <div className="flex items-center gap-2.5">
                  <item.icon weight={item.tone === "queued" ? "bold" : "regular"} className={`text-[16px] ${item.tone === "queued" ? "text-[#F04452]" : item.tone === "fit" ? "text-[#3152F4]" : "text-[#0B7A57]"}`} />
                  <div><p className={`text-[12px] font-semibold ${item.tone === "queued" ? "text-[#F04452]" : "text-[#151515]"}`}>{item.label}</p><p className="text-[10px] text-[#8E929C]">{item.note}</p></div>
                </div>
                <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${item.tone === "queued" ? "bg-[#FDD9DC] text-[#9A1F2B]" : item.tone === "fit" ? "bg-[#E7EBFF] text-[#151B6B]" : "bg-[#E8F8F3] text-[#0B7A57]"}`}>{item.state}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><ListChecks className="text-[18px] text-[#0B7A57]" /><h3 className="text-[15px] font-semibold text-[#151515]">Rules Triggered This Turn</h3></div>
            <span className="rounded bg-[#F1F2F5] px-2 py-0.5 text-[10px] text-[#8E929C]">{rules.length} Rules Active</span>
          </div>
          <div className="flex flex-col gap-2 font-mono text-[11px]">
            {rules.map((rule) => (
              <div key={rule.text} className="flex items-center justify-between rounded-xl bg-[#F8F8FA] p-2.5">
                <span className="flex items-center gap-2 text-[#151515]"><CheckCircle weight="fill" className="text-[14px] text-[#0B7A57]" />{rule.text}</span>
                <span className="font-bold text-[#0B7A57]">{rule.pts}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-[#F1F2F5] pt-2 text-[12px]">
            <span className="text-[#8E929C]">Turn Velocity Applied</span>
            <span className="text-[15px] font-bold text-[#3152F4]">+{leadScore - 42} points adjusted</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><BookOpenText className="text-[18px] text-[#3152F4]" /><h3 className="text-[15px] font-semibold text-[#151515]">RAG Diagnostics &amp; Guardrails</h3></div>
            <span className="font-mono text-[10px] font-bold text-[#0B7A57]">Vector Sim: 0.94</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between rounded-xl bg-[#F8F8FA] p-2.5"><span className="flex items-center gap-2 text-[12px] text-[#151515]"><FileText className="text-[14px] text-[#3152F4]" />Pricing &amp; Sprints Matrix 2024.pdf</span><span className="font-mono text-[10px] text-[#8E929C]">Chunk #12 (0.94)</span></div>
            <div className="flex items-center justify-between rounded-xl bg-[#F8F8FA] p-2.5"><span className="flex items-center gap-2 text-[12px] text-[#151515]"><Code className="text-[14px] text-[#3152F4]" />Integration &amp; Webhook Arch.md</span><span className="font-mono text-[10px] text-[#8E929C]">Chunk #4 (0.89)</span></div>
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-[#F1F2F5] pt-2">
            <span className="flex items-center gap-1 rounded-md bg-[#E8F8F3] px-2 py-1 text-[10px] font-semibold text-[#0B7A57]"><ShieldCheck weight="fill" className="text-[12px]" />PII Check: Safe</span>
            <span className="flex items-center gap-1 rounded-md bg-[#E8F8F3] px-2 py-1 text-[10px] font-semibold text-[#0B7A57]"><Scales className="text-[12px]" />Hallucination: 0.02 (Optimal)</span>
            <span className="flex items-center gap-1 rounded-md bg-[#F1F2F5] px-2 py-1 text-[10px] text-[#5E626D]"><SlidersHorizontal className="text-[12px]" />Prompt Temp: 0.2</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><ClockCounterClockwise className="text-[18px] text-[#8E929C]" /><h3 className="text-[15px] font-semibold text-[#151515]">Test History &amp; Edge Cases</h3></div>
            <span className="text-[11px] text-[#8E929C]">{testHistory.length} Turns Evaluated</span>
          </div>
          <div className="flex flex-col gap-2">
            {testHistory.length === 0 && <p className="text-[11px] text-[#8E929C]">No turns evaluated yet — send a test message to begin.</p>}
            {testHistory.map((item) => (
              <div key={item.id} className={`flex flex-col gap-1.5 rounded-xl p-3 ${item.current ? "border border-[#DCE3FF] bg-[#F1F3FF]" : "bg-[#F8F8FA] opacity-80 transition-opacity hover:opacity-100"}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${item.current ? "text-[#3152F4]" : "text-[#151515]"}`}>{item.label}</span>
                  <span className={`rounded px-2 py-0.5 font-mono text-[10px] ${item.current ? "bg-[#0B7A57] font-bold text-white" : "bg-[#E5E8F5] text-[#5E626D]"}`}>Conf: {item.confidence}%</span>
                </div>
                {item.query && <p className="text-[11px] text-[#8E929C]">Query: <em>&ldquo;{item.query}&rdquo;</em></p>}
                <p className="flex items-start gap-1.5 text-[11px] text-[#5E626D]"><Info className="mt-0.5 shrink-0 text-[13px] text-[#3152F4]" />{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function AiAgentPage({ notify }: { notify: (v: string) => void }) {
  const [setupTab, setSetupTab] = useState<AgentSetupTab>("Identity");
  const [agentName, setAgentName] = useState("Nova");
  const [publicRole, setPublicRole] = useState("Autonomous Lead & Sales Assistant");
  const [industry, setIndustry] = useState("B2B SaaS & Digital Agencies");
  const [avatarMark, setAvatarMark] = useState<(typeof avatarMarks)[number]["key"]>("cobalt");
  const [personality, setPersonality] = useState<(typeof personalityOptions)[number]>("Warm & Advisory");
  const [toneAttributes, setToneAttributes] = useState<string[]>(["Data-driven", "Crisp & Concise"]);
  const [responseLength, setResponseLength] = useState<(typeof responseLengthOptions)[number]>("Concise (1-2 sentences)");
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [dirty, setDirty] = useState(false);

  const wordCount = useMemo(() => systemPrompt.trim().split(/\s+/).filter(Boolean).length, [systemPrompt]);
  const markDirty = () => setDirty(true);

  function toggleTone(tone: string) {
    setToneAttributes((cur) => {
      if (cur.includes(tone)) return cur.filter((t) => t !== tone);
      if (cur.length >= 3) {
        notify("You can select up to 3 tone attributes");
        return cur;
      }
      return [...cur, tone];
    });
    markDirty();
  }

  function saveDraft() {
    setDirty(false);
    notify("Identity draft saved");
  }

  function discardChanges() {
    setAgentName("Nova");
    setPublicRole("Autonomous Lead & Sales Assistant");
    setIndustry("B2B SaaS & Digital Agencies");
    setPersonality("Warm & Advisory");
    setToneAttributes(["Data-driven", "Crisp & Concise"]);
    setResponseLength("Concise (1-2 sentences)");
    setSystemPrompt(defaultSystemPrompt);
    setDirty(false);
    notify("Changes discarded");
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#3152F4] to-[#2846E8] text-white shadow-[0_8px_20px_rgba(49,82,244,0.22)]">
            <Robot weight="fill" className="text-[24px]" />
            <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-white">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0B7A57] ring-2 ring-[#E8F8F3]" />
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[24px] font-bold text-[#151515]">{agentName}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F8F3] px-2.5 py-0.5 text-[11px] font-semibold text-[#0B7A57]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />Live</span>
              <span className="text-[12px] text-[#8E929C]">ailqs.com</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${dirty ? "bg-[#F5A524]" : "bg-[#0B7A57]"}`} />
              <span className={`text-[12px] font-semibold ${dirty ? "text-[#A8590A]" : "text-[#0B7A57]"}`}>{dirty ? "Unsaved draft changes (v2.4)" : "Draft in sync (v2.4)"}</span>
              <span className="text-[#C4C5D9]">•</span>
              <span className="text-[12px] text-[#8E929C]">Last deployed 3h ago by Maya S.</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end lg:self-auto">
          <button onClick={saveDraft} className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-[13px] font-semibold text-[#151515] shadow-[0_2px_8px_rgba(20,25,40,0.06)] hover:bg-[#F8F8FA]"><FloppyDisk className="text-[16px] text-[#8E929C]" />Save Draft</button>
          <button onClick={() => notify(`${agentName} changes published to production`)} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#3152F4] to-[#2846E8] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(49,82,244,0.28)] hover:opacity-95"><UploadSimple className="text-[16px]" />Publish Changes</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AgentKpi label="Conversations" value="3,842" icon={ChatCircle} note="+14% this month" />
        <AgentKpi label="AI Resolution Rate" value="68%" icon={CheckCircle} pill="Autonomous deflection" />
        <AgentKpi label="Lead Capture Rate" value="11.1%" icon={Target} note="Industry benchmark met" />
        <AgentKpi label="Fallback Rate" value="4.2%" icon={Lifebuoy} note="Low human intervention req." />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-3 xl:col-span-2">
          <div className="flex flex-col gap-1 rounded-[22px] bg-white p-3 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
            <span className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8E929C]">Agent Setup</span>
            {agentSetupNav.map(([tab, Icon]) => (
              <button
                key={tab}
                onClick={() => setSetupTab(tab)}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-colors ${setupTab === tab ? "bg-[#3152F4] text-white shadow-[0_4px_12px_rgba(49,82,244,0.3)]" : "text-[#5E626D] hover:bg-[#F1F3FF] hover:text-[#151515]"}`}
              >
                <span className="flex items-center gap-2.5"><Icon weight={setupTab === tab ? "fill" : "regular"} className="text-[18px]" />{tab}</span>
                {setupTab === tab && <span className="h-2 w-2 rounded-full bg-white" />}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1 rounded-[22px] bg-[#F8F8FA] p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E929C]">Release State</span>
            <span className="text-[12px] text-[#5E626D]">Live: <b className="font-bold text-[#151515]">v2.3</b></span>
            <span className="text-[12px] font-semibold text-[#3152F4]">Editing Draft: v2.4</span>
          </div>
        </div>

        {setupTab === "Test & Publish" ? (
          <AgentTestPlayground agentName={agentName} notify={notify} />
        ) : (
        <>
        <div className="flex flex-col gap-5 lg:col-span-9 xl:col-span-6">
          {setupTab === "Identity" ? (
            <>
              <div className="flex flex-col gap-5 rounded-[22px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[17px] font-semibold text-[#151515]">Core Agent Profile</h2>
                    <p className="mt-0.5 text-[12px] text-[#8E929C]">Define your agent&rsquo;s public appearance and identity on ailqs.com</p>
                  </div>
                  <span className="shrink-0 rounded bg-[#F1F3FF] px-2 py-1 text-[10px] font-semibold text-[#5E626D]">Step 1 of 6</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-[#151515]">Agent Name</span>
                    <input name="agentName" value={agentName} onChange={(e) => { setAgentName(e.target.value); markDirty(); }} className="h-11 rounded-xl bg-[#F1F3FF] px-3.5 text-[13px] text-[#151515] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
                    <span className="text-[11px] text-[#8E929C]">The name displayed in customer conversations.</span>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-[#151515]">Public Role &amp; Subtitle</span>
                    <input name="publicRole" value={publicRole} onChange={(e) => { setPublicRole(e.target.value); markDirty(); }} className="h-11 rounded-xl bg-[#F1F3FF] px-3.5 text-[13px] text-[#151515] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
                    <span className="text-[11px] text-[#8E929C]">Clarifies {agentName || "the agent"}&rsquo;s function to website visitors.</span>
                  </label>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-semibold text-[#151515]">Primary Industry &amp; Domain</span>
                  <div className="relative">
                    <select name="industry" value={industry} onChange={(e) => { setIndustry(e.target.value); markDirty(); }} className="h-11 w-full appearance-none rounded-xl bg-[#F1F3FF] px-3.5 pr-10 text-[13px] text-[#151515] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">
                      <option>B2B SaaS &amp; Digital Agencies</option>
                      <option>E-commerce &amp; DTC Brands</option>
                      <option>Consulting &amp; Professional Services</option>
                      <option>Real Estate &amp; PropTech</option>
                    </select>
                    <CaretDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[14px] text-[#8E929C]" />
                  </div>
                  <span className="text-[11px] text-[#8E929C]">Calibrates standard enterprise sales terminology and conversion patterns.</span>
                </label>
                <div className="flex flex-col gap-2 pt-2">
                  <span className="text-[12px] font-semibold text-[#151515]">Agent Avatar Mark</span>
                  <div className="flex flex-wrap items-center gap-3">
                    {avatarMarks.map((mark) =>
                      mark.key === avatarMark ? (
                        <div key={mark.key} className="flex items-center gap-3 rounded-xl bg-[#F1F3FF] p-2 pr-4">
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-[#3152F4] to-[#2846E8] text-white shadow-[0_4px_12px_rgba(49,82,244,0.3)]"><mark.icon weight="fill" className="text-[18px]" /></div>
                          <div className="flex flex-col"><span className="text-[12px] font-semibold text-[#151515]">{mark.label} (Active)</span><span className="text-[11px] text-[#8E929C]">{mark.desc}</span></div>
                        </div>
                      ) : (
                        <button key={mark.key} type="button" title={mark.label} onClick={() => { setAvatarMark(mark.key); markDirty(); }} className="grid h-10 w-10 place-items-center rounded-xl bg-[#F1F2F5] text-[#5E626D] transition-colors hover:bg-[#E5E8F5]">
                          <mark.icon className="text-[18px]" />
                        </button>
                      ),
                    )}
                    <button type="button" onClick={() => notify("Upload flow opened")} className="ml-1 flex items-center gap-1.5 text-[12px] font-semibold text-[#3152F4] hover:underline"><UploadSimple className="text-[14px]" />Upload Custom Mark</button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5 rounded-[22px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
                <div>
                  <h2 className="text-[17px] font-semibold text-[#151515]">Voice &amp; Demeanor</h2>
                  <p className="mt-0.5 text-[12px] text-[#8E929C]">Control how {agentName || "your agent"} engages prospects during qualification</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-semibold text-[#151515]">Personality Archetype</span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {personalityOptions.map((option) => (
                      <button key={option} type="button" onClick={() => { setPersonality(option); markDirty(); }} className={`rounded-xl px-3 py-2.5 text-center text-[12px] font-semibold transition-all ${personality === option ? "bg-[#3152F4] text-white shadow-[0_4px_12px_rgba(49,82,244,0.25)]" : "bg-[#F1F3FF] text-[#5E626D] hover:bg-[#E5E8F5]"}`}>{option}</button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-semibold text-[#151515]">Tone Attributes (Select up to 3)</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {toneOptions.map((tone) => {
                      const selected = toneAttributes.includes(tone);
                      return (
                        <button key={tone} type="button" onClick={() => toggleTone(tone)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${selected ? "bg-[#3152F4] text-white shadow-sm" : "bg-[#F1F3FF] text-[#5E626D] hover:bg-[#E5E8F5]"}`}>
                          {selected ? <Check weight="bold" className="text-[12px]" /> : <Plus className="text-[12px]" />}{tone}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-semibold text-[#151515]">Response Length Preference</span>
                  <div className="grid grid-cols-1 gap-2 rounded-xl bg-[#F1F3FF] p-1 sm:grid-cols-3">
                    {responseLengthOptions.map((option) => (
                      <button key={option} type="button" onClick={() => { setResponseLength(option); markDirty(); }} className={`rounded-lg px-3 py-2 text-center text-[12px] font-semibold transition-colors ${responseLength === option ? "bg-white text-[#3152F4] shadow-[0_2px_8px_rgba(20,25,40,0.06)]" : "text-[#5E626D] hover:text-[#151515]"}`}>{option}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-[22px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[17px] font-semibold text-[#151515]">Business Core &amp; Master Instructions</h2>
                    <p className="mt-0.5 text-[12px] text-[#8E929C]">Foundational system instruction prompt executing qualification thresholds</p>
                  </div>
                  <span className="shrink-0 rounded bg-[#E8F8F3] px-2 py-0.5 text-[10px] font-bold text-[#0B7A57]">Prompt v2.4</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#151515]">System Prompt</span>
                    <span className="text-[11px] text-[#8E929C]">{wordCount} / 2,000 words</span>
                  </div>
                  <textarea
                    name="systemPrompt"
                    value={systemPrompt}
                    onChange={(e) => { setSystemPrompt(e.target.value); markDirty(); }}
                    rows={6}
                    className="w-full resize-y rounded-xl bg-[#F1F3FF] p-4 text-[13px] leading-relaxed text-[#151515] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20"
                  />
                  <div className="mt-1 flex items-start gap-2"><Info className="mt-0.5 shrink-0 text-[14px] text-[#8E929C]" /><span className="text-[11px] text-[#8E929C]">System prompt guides tone and qualification logic. Avoid purple gradient metaphors or conversational fluff.</span></div>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-[#F1F2F5] pt-4">
                  <button type="button" onClick={discardChanges} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-[#5E626D] hover:bg-[#F8F8FA]">Discard Changes</button>
                  <div className="flex items-center gap-3">
                    <span className="hidden text-[11px] text-[#8E929C] sm:inline">{dirty ? "Unsaved changes" : "Draft auto-saved 2m ago"}</span>
                    <button type="button" onClick={saveDraft} className="rounded-xl bg-[#3152F4] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(49,82,244,0.25)] hover:opacity-95">Save Identity Draft</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-[22px] bg-white p-10 text-center shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><GearSix weight="duotone" className="text-[22px]" /></div>
              <h2 className="text-[15px] font-semibold text-[#151515]">{setupTab}</h2>
              <p className="max-w-sm text-[12px] text-[#8E929C]">This configuration area is not part of the current design preview. Switch back to Identity to see the full experience.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 lg:col-span-12 xl:col-span-4 xl:sticky xl:top-6">
          <div className="flex flex-col gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
            <div className="flex items-center justify-between"><h2 className="text-[15px] font-semibold text-[#151515]">Configuration Health</h2><span className="rounded-full bg-[#E8F8F3] px-2 py-0.5 text-[10px] font-bold text-[#0B7A57]">Optimal</span></div>
            <div className="flex items-center gap-4 rounded-xl bg-[#F8F8FA] p-3">
              <div className="relative grid h-16 w-16 shrink-0 place-items-center">
                <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E8F5" strokeWidth="3.5" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3152F4" strokeWidth="3.5" strokeDasharray="86,100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 grid place-items-center"><span className="text-[15px] font-bold text-[#151515]">86%</span></div>
              </div>
              <div><span className="block text-[13px] font-semibold text-[#151515]">Readiness Score</span><span className="text-[11px] text-[#8E929C]">2 recommendations to reach 100% efficiency.</span></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#F8F8FA]">
                <div className="flex items-start gap-2"><PlusCircle className="mt-0.5 shrink-0 text-[16px] text-[#F5A524]" /><div className="flex flex-col"><span className="text-[12px] font-semibold text-[#151515]">Add FAQ on Enterprise SLA</span><span className="text-[11px] font-medium text-[#0B7A57]">+8% score boost</span></div></div>
                <button type="button" onClick={() => notify("FAQ builder opened")} className="shrink-0 text-[11px] font-semibold text-[#3152F4] hover:underline">+ Add now</button>
              </div>
              <div className="flex items-start justify-between gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#F8F8FA]">
                <div className="flex items-start gap-2"><Clock className="mt-0.5 shrink-0 text-[16px] text-[#3152F4]" /><div className="flex flex-col"><span className="text-[12px] font-semibold text-[#151515]">Define fallback rep for non-working hours</span><span className="text-[11px] font-medium text-[#0B7A57]">+6% score boost</span></div></div>
                <button type="button" onClick={() => notify("Fallback routing opened")} className="shrink-0 text-[11px] font-semibold text-[#3152F4] hover:underline">Configure</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_16px_36px_rgba(20,25,40,0.08)]">
            <div className="flex items-center justify-between bg-[#F8F8FA] p-4">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0B7A57]" /><span className="text-[12px] font-semibold text-[#151515]">Live Widget Preview</span></div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#E5E8F5] px-2 py-0.5 text-[10px] font-semibold text-[#5E626D]">Draft Mode (v2.4)</span>
                <button type="button" onClick={() => notify("Widget preview reloaded")} aria-label="Reload widget state" className="text-[#8E929C] hover:text-[#151515]"><ArrowClockwise className="text-[16px]" /></button>
              </div>
            </div>
            <div className="flex flex-col bg-gradient-to-b from-white to-[#F8F8FA] p-4">
              <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(20,25,40,0.1)]">
                <div className="flex items-center justify-between bg-gradient-to-r from-[#3152F4] to-[#2846E8] p-3.5 text-white">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-white/20"><Robot weight="fill" className="text-[14px]" /></div>
                    <div className="flex flex-col"><span className="text-[12px] font-bold leading-tight">{agentName || "Agent"} • Lead Assistant</span><span className="text-[9px] leading-none text-white/70">Online • Instant qualification</span></div>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/80"><Minus className="text-[14px]" /><X className="text-[14px]" /></div>
                </div>
                <div className="flex min-h-[220px] flex-col gap-3 p-4">
                  <div className="my-1 text-center"><span className="rounded-full bg-[#F1F2F5] px-2.5 py-0.5 text-[9px] text-[#8E929C]">Today • 10:14 AM</span></div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#3152F4] text-white"><Robot weight="fill" className="text-[12px]" /></div>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#F1F2F5] p-3 text-[12px] leading-relaxed text-[#151515]">Hi there! 👋 Welcome to ailqs.com. Are you looking to scale your pipeline or integrate autonomous AI workflows?</div>
                  </div>
                  <div className="flex flex-col gap-1.5 pl-8">
                    {["Scale AI Automation ⚡", "Web Development 💻", "Pricing & Retainers 📊"].map((reply) => (
                      <button key={reply} type="button" onClick={() => notify(`Simulated reply: ${reply}`)} className="w-fit rounded-full bg-[#F1F2F5] px-3 py-1.5 text-left text-[11px] font-semibold text-[#3152F4] transition-colors hover:bg-[#E5E8F5]">{reply}</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5">
                  <input name="widgetTestMessage" placeholder={`Type a response to test ${agentName || "Nova"}...`} className="h-9 flex-1 rounded-xl bg-[#F1F2F5] px-3 text-[12px] text-[#151515] outline-none focus:bg-white focus:ring-1 focus:ring-[#3152F4]/30" />
                  <button type="button" onClick={() => notify("Test message sent to preview")} className="grid h-8 w-8 place-items-center rounded-xl bg-[#3152F4] text-white shadow-sm hover:opacity-95"><PaperPlaneRight className="text-[14px]" /></button>
                </div>
              </div>
              <span className="mt-3 text-center text-[11px] text-[#8E929C]">Updates to Identity &amp; Behavior reflect in this preview immediately.</span>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}

function StatTile({ label, value, icon: Icon, note, chip, chipTone }: { label: string; value: string; icon: typeof Tray; note: string; chip: string; chipTone?: string }) {
  return (
    <div className="rounded-[20px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
      <div className="flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-wide text-[#8E929C]">{label}</span><div className="grid h-8 w-8 place-items-center rounded-xl bg-[#F1F3FF]"><Icon className="text-[16px] text-[#3152F4]" /></div></div>
      <div className="my-2 flex items-center gap-2"><strong className="text-[30px] font-bold text-[#151515]">{value}</strong><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${chipTone ?? "bg-[#E8F8F3] text-[#0B7A57]"}`}>{chip}</span></div>
      <p className="text-[10px] text-[#8E929C]">{note}</p>
    </div>
  );
}

function LeadDrawer({ lead, close, notify }: { lead: Lead; close: () => void; notify: (v: string) => void }) {
  const [tab, setTab] = useState<"Overview" | "Score" | "Conversation" | "Activity">("Overview");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [close]);
  const parts: [string, number, number][] = [["Budget", 23, 25], ["Timeline", 18, 20], ["Service interest", 18, 20], ["Company fit", 14, 15], ["Buying intent", 19, 20]];
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button aria-label="Close lead detail" onClick={close} className="absolute inset-0 bg-black/30" />
      <aside ref={ref} role="dialog" aria-modal="true" className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-[0_24px_48px_rgba(18,24,40,0.2)]">
        <header className="flex items-center justify-between border-b border-[#EDEDF2] p-5"><div className="flex items-center gap-2"><TempPill temp={lead.temp} /><span className="text-[11px] font-semibold text-[#8E929C]">{lead.score}/100</span></div><button aria-label="Close" onClick={close} className="grid h-8 w-8 place-items-center rounded-full text-[#8E929C] hover:bg-[#F1F2F5]"><X /></button></header>
        <div className="flex items-center gap-3 border-b border-[#EDEDF2] p-5"><span className="grid h-12 w-12 place-items-center rounded-full text-[13px] font-bold text-[#151515]" style={{ background: lead.color }}>{lead.initials}</span><div><h2 className="text-[16px] font-bold text-[#151515]">{lead.name}</h2><p className="text-[11px] text-[#8E929C]">{lead.company} · {lead.interest}</p></div></div>
        <div className="flex gap-2 border-b border-[#EDEDF2] p-4"><button onClick={() => notify(`${lead.name} marked as contacted`)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#3152F4] py-2 text-[12px] font-semibold text-white"><Check weight="bold" />Mark contacted</button><button onClick={() => notify(`Follow-up scheduled for ${lead.name}`)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#EDEDF2] py-2 text-[12px] font-semibold text-[#151515]"><Clock />Follow-up</button></div>
        <div role="tablist" className="flex gap-1 border-b border-[#EDEDF2] px-4 pt-3">{(["Overview", "Score", "Conversation", "Activity"] as const).map((t) => <button role="tab" aria-selected={tab === t} key={t} onClick={() => setTab(t)} className={`rounded-t-lg px-3 py-2 text-[12px] font-semibold ${tab === t ? "border-b-2 border-[#3152F4] text-[#3152F4]" : "text-[#8E929C]"}`}>{t}</button>)}</div>
        <div className="flex-1 p-5">
          {tab === "Overview" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl bg-[#F1F3FF] p-4"><div className="flex items-center gap-2 text-[11px] font-semibold text-[#3152F4]"><Sparkle weight="fill" />AI brief <span className="ml-auto font-normal text-[#8E929C]">Generated 4m ago</span></div><p className="mt-2 text-[12px] leading-relaxed text-[#444656]">{lead.summary}</p><button onClick={() => setTab("Score")} className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#3152F4]">Explain this score <ArrowRight className="text-[12px]" /></button></div>
              <div className="flex items-center gap-3 rounded-xl bg-[#FEF8EC] p-4"><Lightning weight="fill" className="text-[#F5A524]" /><div><small className="block text-[10px] font-semibold uppercase text-[#8E929C]">Recommended next action</small><b className="text-[12px] text-[#151515]">Call within 15 minutes and offer a tailored walkthrough.</b></div></div>
              <div><h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#8E929C]">Contact</h3>
                <div className="mb-2 flex items-center justify-between rounded-lg border border-[#EDEDF2] px-3 py-2 text-[12px]"><span className="flex items-center gap-2 text-[#444656]"><Envelope className="text-[14px]" />{lead.email}</span><button onClick={() => notify("Email copied")} aria-label="Copy email" className="text-[#8E929C]"><Copy /></button></div>
                <div className="flex items-center justify-between rounded-lg border border-[#EDEDF2] px-3 py-2 text-[12px]"><span className="flex items-center gap-2 text-[#444656]"><PaperPlaneTilt className="text-[14px]" />{lead.phone}</span><button onClick={() => notify("Phone copied")} aria-label="Copy phone" className="text-[#8E929C]"><Copy /></button></div>
              </div>
              <div className="flex items-center justify-between"><span className="text-[11px] text-[#8E929C]">Owner</span><span className="text-[12px] font-semibold text-[#151515]">{lead.owner}</span></div>
              <div className="flex items-center justify-between"><span className="text-[11px] text-[#8E929C]">Pipeline stage</span><StageChip stage={lead.stage} /></div>
            </div>
          )}
          {tab === "Score" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between"><div><strong className="text-[32px] font-bold text-[#151515]">{lead.score}</strong><span className="text-[13px] text-[#8E929C]">/100</span></div><TempPill temp={lead.temp} /></div>
              <p className="text-[11px] text-[#8E929C]">Scored with Default qualification model · Version 3</p>
              <div className="flex flex-col gap-3">{parts.map(([name, value, m]) => (
                <div key={name}><div className="mb-1 flex items-center justify-between text-[12px]"><span className="text-[#444656]">{name}</span><b className="text-[#151515]">{value}<small className="text-[#8E929C]">/{m}</small></b></div><div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F2F5]"><div className="h-full rounded-full bg-[#3152F4]" style={{ width: `${(value / m) * 100}%` }} /></div></div>
              ))}</div>
              <div className="flex items-start gap-2 rounded-xl bg-[#E8F8F3] p-3 text-[11px] text-[#0B7A57]"><Sparkle className="mt-0.5 shrink-0" /><p><b>Strongest signal:</b> &ldquo;We have budget approved and want to implement within two weeks.&rdquo;</p></div>
            </div>
          )}
          {tab === "Conversation" && (
            <div className="flex flex-col gap-3 text-[12px]">
              <p className="text-center text-[10px] text-[#8E929C]">Today · Started on pricing page</p>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#3152F4] px-3 py-2 text-white">We&rsquo;re evaluating a lead qualification tool for three product websites.</div>
              <div className="mr-auto flex max-w-[85%] items-start gap-2 rounded-2xl rounded-tl-sm bg-[#F1F2F5] px-3 py-2 text-[#444656]"><Robot weight="fill" className="mt-0.5 shrink-0 text-[#3152F4]" />I can help with that. What timeline are you working toward?</div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#3152F4] px-3 py-2 text-white">We have budget approved and want to implement within two weeks.</div>
              <div className="mx-auto flex items-center gap-1.5 rounded-full bg-[#E8F8F3] px-3 py-1 text-[10px] font-semibold text-[#0B7A57]"><Target className="text-[12px]" />Qualification updated · Timeline +18 · Intent +19</div>
              <div className="mr-auto flex max-w-[85%] items-start gap-2 rounded-2xl rounded-tl-sm bg-[#F1F2F5] px-3 py-2 text-[#444656]"><Robot weight="fill" className="mt-0.5 shrink-0 text-[#3152F4]" />That&rsquo;s a strong fit. Could I get your work email for a focused walkthrough?</div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#3152F4] px-3 py-2 text-white">Sure — {lead.email}</div>
            </div>
          )}
          {tab === "Activity" && (
            <div className="flex flex-col gap-3">
              {[["Lead qualified", `${lead.score}/100 · ${lead.temp}`, CheckCircle, false], ["Email notification delivered", `${lead.owner} · 4m ago`, Envelope, false], ["HubSpot contact created", "Record #48391 · 4m ago", IdentificationBadge, false], ["Webhook delivery failed", "HTTP 503 · Retry in 6 minutes", XCircle, true], ["Conversation completed", "11 messages · 5m ago", ChatCircle, false]].map(([title, text, Icon, fail]) => {
                const IconC = Icon as typeof CheckCircle;
                return <div key={String(title)} className="flex items-start gap-3"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${fail ? "bg-[#FDF2F3] text-[#F04452]" : "bg-[#F1F3FF] text-[#3152F4]"}`}><IconC className="text-[15px]" /></span><p className="text-[12px]"><b className="block text-[#151515]">{String(title)}</b><small className="text-[10px] text-[#8E929C]">{String(text)}</small></p></div>;
              })}
            </div>
          )}
        </div>
        <footer className="flex gap-2 border-t border-[#EDEDF2] p-4"><button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#EDEDF2] py-2 text-[12px] font-semibold text-[#151515]"><CircleDashed />Open full record</button><button onClick={() => notify(`Note added for ${lead.name}`)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#3152F4] py-2 text-[12px] font-semibold text-white"><NotePencil />Add note</button></footer>
      </aside>
    </div>
  );
}

type ModuleItem = { title: string; text: string; state: string };
type ModuleData = { title: string; intro: string; icon: typeof BookOpenText; items: ModuleItem[]; itemKind: string };

const moduleData: Record<string, ModuleData> = {
  "Websites & Widget": { title: "Websites & Widget", intro: "Manage installation, widget appearance, and diagnostics.", icon: PuzzlePiece, itemKind: "website", items: [{ title: "ailqs.com", text: "Widget detected 2 minutes ago · 1,284 conversations", state: "Live" }, { title: "studio.ailqs.com", text: "Widget detected 12 minutes ago · 486 conversations", state: "Live" }, { title: "property.ailqs.com", text: "Knowledge refresh requires attention", state: "Needs attention" }] },
};

function ModuleView({ data, notify }: { data: ModuleData; notify: (v: string) => void }) {
  const [rows, setRows] = useState(data.items);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const healthy = rows.filter((r) => !/attention|overdue/i.test(r.state)).length;

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setRows((cur) => [...cur, { title: name.trim(), text: `New ${data.title.toLowerCase()} ${data.itemKind}`, state: "Ready" }]);
    setName("");
    setOpen(false);
    notify(`${name.trim()} added successfully`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4"><div><h1 className="text-[26px] font-bold tracking-tight text-[#151515]">{data.title}</h1><p className="mt-1 text-[12px] text-[#8E929C]">{data.intro}</p></div><button onClick={() => setOpen(true)} className="flex items-center gap-1.5 rounded-xl bg-[#3152F4] px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(49,82,244,0.28)]"><Plus />Add {data.itemKind}</button></div>
      <div className="flex items-center gap-4 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><data.icon weight="duotone" className="text-[22px]" /></div>
        <div className="flex-1"><h2 className="text-[14px] font-semibold text-[#151515]">{data.title} at a glance</h2><p className="text-[11px] text-[#8E929C]">Static design data demonstrates the default populated state.</p></div>
        <div className="text-right"><span className="block text-[10px] text-[#8E929C]">Healthy</span><strong className="text-[16px] text-[#151515]">{healthy}/{rows.length}</strong></div>
      </div>
      <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
        <div className="flex items-center justify-between border-b border-[#EDEDF2] px-5 py-4"><h2 className="text-[14px] font-semibold text-[#151515]">Configuration and health</h2></div>
        {rows.map((item) => (
          <button key={item.title} onClick={() => notify(`${item.title} opened`)} className="flex w-full items-center gap-3 border-b border-[#F1F2F5] px-5 py-4 text-left last:border-0 hover:bg-[#F8F9FF]">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F1F3FF] text-[#3152F4]"><CheckCircle /></span>
            <span className="flex-1"><b className="block text-[12px] text-[#151515]">{item.title}</b><small className="text-[10px] text-[#8E929C]">{item.text}</small></span>
            <em className={`rounded-full px-2.5 py-1 text-[10px] font-semibold not-italic ${/attention|overdue/i.test(item.state) ? "bg-[#FDF2F3] text-[#F04452]" : "bg-[#F1F2F5] text-[#5E626D]"}`}>{item.state}</em>
            <ArrowRight className="text-[#C4C5D9]" />
          </button>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-[0_24px_48px_rgba(18,24,40,0.2)]">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-[15px] font-bold text-[#151515]">Add {data.itemKind}</h2><button onClick={() => setOpen(false)} aria-label="Close" className="text-[#8E929C]"><X /></button></div>
            <form onSubmit={add} className="flex flex-col gap-3">
              <label className="text-[11px] font-semibold text-[#5E626D]">Name<input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-[#EDEDF2] px-3 text-[12px] outline-none focus:ring-2 focus:ring-[#3152F4]/25" placeholder={`Enter ${data.itemKind} name`} /></label>
              <div className="mt-1 flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-[#EDEDF2] px-3.5 py-2 text-[12px] font-semibold text-[#151515]">Cancel</button><button type="submit" className="rounded-xl bg-[#3152F4] px-3.5 py-2 text-[12px] font-semibold text-white">Add {data.itemKind}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationPanel({ close, openLead }: { close: () => void; openLead: () => void }) {
  return (
    <aside role="dialog" aria-label="Notifications" className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-2xl bg-white shadow-[0_24px_48px_rgba(18,24,40,0.16)]">
      <header className="flex items-center justify-between border-b border-[#EDEDF2] px-4 py-3"><h2 className="text-[13px] font-bold text-[#151515]">Notifications</h2><button onClick={close} aria-label="Close" className="text-[#8E929C]"><X className="text-[14px]" /></button></header>
      <button onClick={openLead} className="flex w-full items-start gap-3 border-b border-[#F1F2F5] bg-[#F8F9FF] px-4 py-3 text-left"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FDF2F3] text-[#F04452]"><Fire weight="fill" className="text-[14px]" /></span><span><b className="block text-[12px] text-[#151515]">New Hot lead</b><small className="text-[10px] text-[#8E929C]">Olivia Martin scored 94 on ailqs.com</small></span></button>
      <button className="flex w-full items-start gap-3 border-b border-[#F1F2F5] px-4 py-3 text-left"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FEF8EC] text-[#F5A524]"><CirclesThreePlus className="text-[14px]" /></span><span><b className="block text-[12px] text-[#151515]">Webhook needs attention</b><small className="text-[10px] text-[#8E929C]">Two deliveries failed after retry</small></span></button>
      <button className="flex w-full items-start gap-3 px-4 py-3 text-left"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F1F5F8] text-[#7190A8]"><Warning className="text-[14px]" /></span><span><b className="block text-[12px] text-[#151515]">Knowledge partially updated</b><small className="text-[10px] text-[#8E929C]">Three property pages were skipped</small></span></button>
      <footer className="border-t border-[#EDEDF2] px-4 py-2.5 text-center"><button className="text-[11px] font-semibold text-[#3152F4]">View notification center</button></footer>
    </aside>
  );
}

function AccountMenu({ close, goTo, notify }: { close: () => void; goTo: (v: string) => void; notify: (v: string) => void }) {
  const run = (message: string) => { close(); notify(message); };
  return (
    <div role="menu" className="absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_24px_48px_rgba(18,24,40,0.16)]">
      <button role="menuitem" onClick={() => { close(); goTo("Profile"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#F1F3FF]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#DDE3FF] text-[11px] font-bold text-[#0034DC]">MS</span><span><b className="block text-[12px] text-[#151515]">Maya Singh</b><small className="text-[10px] text-[#8E929C]">Product Lead</small></span><CaretRight className="ml-auto text-[13px] text-[#8E929C]" /></button>
      <div className="my-1 h-px bg-[#F1F2F5]" />
      <button role="menuitem" onClick={() => { close(); goTo("Billing & Usage"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold text-[#444656] hover:bg-[#F1F3FF]"><Sparkle className="text-[16px]" />Upgrade plan</button>
      <button role="menuitem" onClick={() => { close(); goTo("Personalization"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold text-[#444656] hover:bg-[#F1F3FF]"><PaintBrush className="text-[16px]" />Personalization</button>
      <button role="menuitem" onClick={() => { close(); goTo("Settings"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold text-[#444656] hover:bg-[#F1F3FF]"><GearSix className="text-[16px]" />Settings</button>
      <div className="my-1 h-px bg-[#F1F2F5]" />
      <button role="menuitem" onClick={() => { close(); goTo("Help"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold text-[#444656] hover:bg-[#F1F3FF]"><Lifebuoy className="text-[16px]" />Help</button>
      <button role="menuitem" onClick={() => run("This static prototype does not end your session")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold text-[#F04452] hover:bg-[#FDF2F3]"><SignOut className="text-[16px]" />Log out</button>
    </div>
  );
}

function AccountPage({ page, notify, collapsed }: { page: "Profile" | "Personalization" | "Help"; notify: (v: string) => void; collapsed: boolean }) {
  const data = {
    Profile: { intro: "Manage your personal information and account access.", icon: UserCircle, rows: [["Personal details", "Maya Singh"], ["Role & workspace", "Product Lead · AILQS Demo"], ["Account security", "Password and sessions"]] },
    Personalization: { intro: "Choose how your workspace looks and communicates with you.", icon: PaintBrush, rows: [["Appearance", "System theme"], ["Density", "Comfortable"], ["Notifications", "Priority signals first"]] },
    Help: { intro: "Find guidance or contact support when you need a hand.", icon: Lifebuoy, rows: [["Getting started", "Launch your first widget"], ["Lead qualification", "How scoring works"], ["Integrations", "Troubleshoot deliveries"]] },
  }[page];
  return (
    <div className={`mx-auto flex flex-col gap-5 transition-[max-width] duration-200 ${collapsed ? "max-w-[1020px]" : "max-w-[860px]"}`}>
      <div><h1 className="text-[24px] font-bold text-[#151515]">{page}</h1><p className="mt-1 text-[12px] text-[#8E929C]">{data.intro}</p></div>
      <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_10px_30px_rgba(20,25,40,0.05)]">
        <div className="flex items-center gap-3 border-b border-[#EDEDF2] p-5"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#F1F3FF] text-[#3152F4]"><data.icon weight="duotone" className="text-[20px]" /></div><h2 className="text-[14px] font-semibold text-[#151515]">{page} settings</h2></div>
        {data.rows.map(([title, value]) => (
          <button key={title} onClick={() => notify(`${title} opened`)} className="flex w-full items-center justify-between border-b border-[#F1F2F5] px-5 py-4 text-left last:border-0 hover:bg-[#F8F9FF]"><b className="text-[12px] text-[#151515]">{title}</b><span className="flex items-center gap-1 text-[11px] text-[#8E929C]">{value}<CaretRight className="text-[12px]" /></span></button>
        ))}
      </div>
    </div>
  );
}

type BillingPlanId = "starter" | "pro" | "premium";
interface BillingPlanTier {
  id: BillingPlanId; name: string; price: number;
  aiChatLimit: number; websiteLimit: number; teamSeatLimit: number; vectorLimit: number; apiLimit: number;
  features: string[];
}
const billingPlanTiers: BillingPlanTier[] = [
  { id: "starter", name: "Starter", price: 4999, aiChatLimit: 1000, websiteLimit: 2, teamSeatLimit: 3, vectorLimit: 500, apiLimit: 10000, features: ["1,000 AI chats / month", "2 active websites", "3 team seats", "500 vector knowledge pages", "Standard webhooks"] },
  { id: "pro", name: "Pro", price: 9999, aiChatLimit: 3000, websiteLimit: 5, teamSeatLimit: 6, vectorLimit: 1500, apiLimit: 30000, features: ["3,000 AI chats / month", "5 active websites", "6 team seats", "1,500 vector knowledge pages", "Priority webhooks"] },
  { id: "premium", name: "Premium", price: 19999, aiChatLimit: 8000, websiteLimit: 10, teamSeatLimit: 10, vectorLimit: 5000, apiLimit: 100000, features: ["8,000 AI chats / month", "10 active websites", "10 team seats", "5,000 vector knowledge pages", "Dedicated success manager"] },
];
const billingUsage = { aiChats: 742, websites: 2, teamSeats: 3, vectors: 486, apiCalls: 3240 };
const billingHistory = [
  { month: "Apr", value: 410 }, { month: "May", value: 520 }, { month: "Jun", value: 610 },
  { month: "Jul", value: 690 }, { month: "Aug", value: 715 }, { month: "Sep", value: 742 },
];
const billingCycleStart = new Date(2026, 8, 1);
const billingCycleEnd = new Date(2026, 8, 28);

interface BillingInvoice { id: string; date: Date; periodEnd: Date; amount: number; status: "Paid" | "Due"; }
const billingInvoices: BillingInvoice[] = Array.from({ length: 10 }, (_, i) => {
  const date = new Date(2026, 7, 28);
  date.setMonth(date.getMonth() - i);
  const periodEnd = new Date(date);
  periodEnd.setMonth(periodEnd.getMonth() + 1);
  periodEnd.setDate(periodEnd.getDate() - 1);
  return { id: `INV-${date.getFullYear()}-${String(9 - i).padStart(3, "0")}`, date, periodEnd, amount: 4999, status: "Paid" as const };
});

function billingFormatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function billingFormatPeriod(start: Date, end: Date) {
  return `${start.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} – ${billingFormatDate(end)}`;
}

function BillingChangePlanModal({ currentPlanId, onSelect, onClose }: { currentPlanId: BillingPlanId; onSelect: (id: BillingPlanId) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div role="dialog" aria-modal="true" className="flex w-full max-w-3xl flex-col gap-5 rounded-[24px] bg-white p-6 shadow-[0_24px_48px_rgba(18,24,40,0.2)]">
        <div className="flex items-center justify-between">
          <div><h2 className="text-[18px] font-bold text-[#151515]">Change Plan</h2><p className="text-[12px] text-[#8E929C]">Usage carries over immediately — limits update the moment you switch.</p></div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-[#8E929C] hover:bg-[#F1F2F5]"><X className="text-[18px]" /></button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {billingPlanTiers.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const featured = plan.id === "pro";
            return (
              <article key={plan.id} className={`relative flex flex-col gap-4 rounded-[20px] p-5 ${featured ? "bg-[#151515] text-white shadow-[0_16px_36px_rgba(15,15,20,0.22)]" : "bg-[#F8F9FC] text-[#151515]"}`}>
                {featured && <span className="absolute -top-3 left-5 rounded-full bg-[#3152F4] px-2.5 py-1 text-[10px] font-bold text-white">Recommended</span>}
                <h3 className="text-[15px] font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-1"><strong className="text-[26px] font-bold">€{plan.price.toLocaleString()}</strong><span className={featured ? "text-white/60" : "text-[#8E929C]"}>/mo</span></div>
                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => onSelect(plan.id)}
                  className={`rounded-xl py-2 text-[12px] font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${featured ? "bg-[#3152F4] text-white hover:opacity-95" : "border border-[#EDEDF2] bg-white text-[#151515] hover:bg-[#F1F2F5]"}`}
                >
                  {isCurrent ? "Current Plan" : `Switch to ${plan.name}`}
                </button>
                <ul className="flex flex-col gap-2 text-[11px]">
                  {plan.features.map((f) => <li key={f} className="flex items-center gap-2"><Check weight="bold" className={featured ? "text-[#58DDAC]" : "text-[#0B7A57]"} />{f}</li>)}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BillingPaymentModal({ payment, onSave, onClose }: { payment: { brand: string; last4: string; expiry: string; name: string }; onSave: (p: { brand: string; last4: string; expiry: string; name: string }) => void; onClose: () => void }) {
  const [brand, setBrand] = useState(payment.brand);
  const [last4, setLast4] = useState(payment.last4);
  const [expiry, setExpiry] = useState(payment.expiry);
  const [name, setName] = useState(payment.name);

  function save() {
    if (!/^\d{4}$/.test(last4) || !name.trim()) return;
    onSave({ brand, last4, expiry, name: name.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div role="dialog" aria-modal="true" className="flex w-full max-w-sm flex-col gap-4 rounded-[22px] bg-white p-5 shadow-[0_24px_48px_rgba(18,24,40,0.2)]">
        <div className="flex items-center justify-between"><h2 className="text-[15px] font-bold text-[#151515]">Manage Payment Method</h2><button type="button" onClick={onClose} aria-label="Close" className="text-[#8E929C]"><X className="text-[16px]" /></button></div>
        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#151515]">Card Brand
          <select name="paymentBrand" value={brand} onChange={(e) => setBrand(e.target.value)} className="rounded-xl bg-[#F1F2F5] px-3 py-2 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20">
            <option value="MC">Mastercard</option>
            <option value="VISA">Visa</option>
            <option value="AMEX">Amex</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#151515]">Card Number (last 4 digits)
          <input name="paymentLast4" value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="4242" className="rounded-xl bg-[#F1F2F5] px-3 py-2 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
        </label>
        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#151515]">Expiry (MM/YY)
          <input name="paymentExpiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="08/28" className="rounded-xl bg-[#F1F2F5] px-3 py-2 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
        </label>
        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#151515]">Cardholder Name
          <input name="paymentName" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl bg-[#F1F2F5] px-3 py-2 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#3152F4]/20" />
        </label>
        <div className="mt-1 flex items-center justify-end gap-2 border-t border-[#F1F2F5] pt-4">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-[#5E626D] hover:bg-[#F1F2F5]">Cancel</button>
          <button type="button" onClick={save} className="rounded-xl bg-[#3152F4] px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(49,82,244,0.3)] hover:opacity-95">Save Card</button>
        </div>
      </div>
    </div>
  );
}

function BillingUsagePage({ notify }: { notify: (v: string) => void }) {
  const [planId, setPlanId] = useState<BillingPlanId>("starter");
  const [autoRenew, setAutoRenew] = useState(true);
  const [payment, setPayment] = useState({ brand: "MC", last4: "4242", expiry: "08/28", name: "Maya Singh" });
  const [billingProfile] = useState({ company: "AILQS Demo Inc.", gstin: "27AADCN1234F1Z5", email: "billing@ailqs.com" });
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoicePage, setInvoicePage] = useState(0);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const plan = billingPlanTiers.find((p) => p.id === planId)!;

  function selectPlan(id: BillingPlanId) {
    setPlanId(id);
    setPlanModalOpen(false);
    notify(`Switched to the ${billingPlanTiers.find((p) => p.id === id)!.name} plan`);
  }
  function savePayment(next: { brand: string; last4: string; expiry: string; name: string }) {
    setPayment(next);
    setPaymentModalOpen(false);
    notify("Payment method updated");
  }

  const toneStyle = {
    brand: { icon: "bg-[#F1F3FF] text-[#3152F4]", bar: "bg-[#3152F4]", text: "text-[#3152F4]" },
    warn: { icon: "bg-[#FEF8EC] text-[#F5A524]", bar: "bg-[#F5A524]", text: "text-[#F5A524]" },
    danger: { icon: "bg-[#FDF2F3] text-[#F04452]", bar: "bg-[#F04452]", text: "text-[#F04452]" },
    neutral: { icon: "bg-[#F1F2F5] text-[#5E626D]", bar: "bg-[#3152F4]", text: "text-[#0B7A57]" },
  } as const;
  const quotas = [
    { key: "aiChats", label: "AI Chats", icon: Robot, used: billingUsage.aiChats, limit: plan.aiChatLimit, suffix: "", detail: "Healthy velocity (~24/day)", tone: "brand" as const },
    { key: "websites", label: "Websites", icon: Globe, used: billingUsage.websites, limit: plan.websiteLimit, suffix: " domains", detail: "ailqs.com", detail2: "studio.ailqs.com", tone: "warn" as const },
    { key: "teamSeats", label: "Team Seats", icon: Users, used: billingUsage.teamSeats, limit: plan.teamSeatLimit, suffix: " seats", detail: "Maya S, Arjun M, Riya S", detail2: billingUsage.teamSeats >= plan.teamSeatLimit ? "Tier limit reached" : undefined, tone: "warn" as const },
    { key: "vectors", label: "Vectors", icon: BookOpenText, used: billingUsage.vectors, limit: plan.vectorLimit, suffix: " pages", detail: "Next crawl may pause", tone: "danger" as const },
    { key: "apiCalls", label: "API Calls", icon: Database, used: billingUsage.apiCalls, limit: plan.apiLimit, suffix: "", detail: "Webhooks & REST sync", tone: "neutral" as const },
  ].map((q) => {
    const pct = Math.min(100, (q.used / q.limit) * 100);
    const atLimit = pct >= 99.95;
    const saturated = pct >= 85;
    const style = toneStyle[q.tone];
    return { ...q, pct, atLimit, saturated, iconStyle: style.icon, barColor: style.bar, pctColor: style.text };
  });

  const saturated = quotas.filter((q) => q.saturated);
  const atLimit = quotas.filter((q) => q.atLimit);
  const daysRemaining = Math.max(0, Math.round((billingCycleEnd.getTime() - new Date(2026, 8, 20).getTime()) / 86400000));
  const dailyRate = billingUsage.aiChats / 22;
  const projectedTotal = Math.min(plan.aiChatLimit * 1.15, Math.round(dailyRate * 30));

  const chartMax = Math.max(plan.aiChatLimit, ...billingHistory.map((h) => h.value), projectedTotal);
  const barFor = (v: number) => Math.round((v / chartMax) * 140);

  const invoicesPerPage = 4;
  const totalPages = Math.ceil(billingInvoices.length / invoicesPerPage);
  const pagedInvoices = billingInvoices.slice(invoicePage * invoicesPerPage, invoicePage * invoicesPerPage + invoicesPerPage);

  return (
    <div className="mx-auto flex max-w-[1300px] flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex max-w-2xl flex-col gap-1">
          <h1 className="text-[24px] font-bold tracking-tight text-[#151515]">Billing &amp; Usage</h1>
          <p className="text-[12px] text-[#8E929C]">Manage your subscription, track workspace consumption across AI quotas, and download tax invoices.</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button type="button" onClick={() => setPlanModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#F1F2F5] px-4 py-2.5 text-[13px] font-semibold text-[#151515] hover:bg-[#E5E8F5]"><SlidersHorizontal className="text-[16px] text-[#8E929C]" />Change Plan</button>
          <button type="button" onClick={() => selectPlan("premium")} className="flex items-center gap-2 rounded-xl bg-[#3152F4] px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(49,82,244,0.28)] hover:opacity-95"><Sparkle className="text-[16px]" />Upgrade to Premium</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="relative flex flex-col justify-between gap-5 overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:col-span-7 lg:p-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex items-center gap-1.5 rounded-full bg-[#E8F8F3] px-3 py-1 text-[12px] font-semibold text-[#0B7A57]"><span className="h-2 w-2 rounded-full bg-[#0B7A57]" />Active Subscription</span>
                <span className="rounded-full bg-[#F1F2F5] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#5E626D]">{plan.name} Tier</span>
              </div>
              <button type="button" onClick={() => setAutoRenew((v) => !v)} aria-pressed={autoRenew} className="rounded-lg bg-[#F1F2F5] px-2.5 py-1 text-[11px] font-semibold text-[#5E626D] hover:bg-[#E5E8F5]">Auto-Renew {autoRenew ? "On" : "Off"}</button>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2"><span className="text-[34px] font-bold tracking-tight text-[#151515]">€{plan.price.toLocaleString()}</span><span className="text-[13px] text-[#8E929C]">/ month (billed monthly)</span></div>
              <p className="flex items-center gap-1.5 text-[12px] text-[#8E929C]"><SealCheck weight="fill" className="text-[15px] text-[#0B7A57]" />Next renewal scheduled on <strong className="font-semibold text-[#151515]">{billingFormatDate(billingCycleEnd)}</strong> via primary card ending in •••• {payment.last4}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl bg-[#F8F9FC] p-4">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Included in {plan.name}</span>
              <p className="text-[12px] text-[#151515]">Includes <strong className="font-semibold text-[#3152F4]">{plan.features[0]}</strong>, {plan.features.slice(1).join(", ").toLowerCase()}.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button type="button" onClick={() => setPlanModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#3152F4] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_6px_16px_rgba(49,82,244,0.25)] hover:opacity-95"><Lightning className="text-[16px]" />Upgrade Plan</button>
            <button type="button" onClick={() => setPaymentModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#F1F2F5] px-4 py-2.5 text-[13px] font-semibold text-[#151515] shadow-sm hover:bg-[#E5E8F5]"><CreditCard className="text-[16px] text-[#8E929C]" />Manage Payment</button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:col-span-5 lg:p-7">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between"><span className="text-[15px] font-bold text-[#151515]">Payment Details</span><button type="button" onClick={() => setPaymentModalOpen(true)} className="text-[12px] font-semibold text-[#3152F4] hover:underline">Edit</button></div>
            <div className="flex items-center justify-between rounded-xl bg-[linear-gradient(135deg,#EAEDFB_0%,#DFE2EF_100%)] p-4">
              <div className="flex items-center gap-3.5">
                <div className="grid h-8 w-11 place-items-center rounded-lg bg-[#151515] text-[11px] font-bold tracking-wide text-white">{payment.brand}</div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2"><span className="text-[15px] font-bold tracking-wide text-[#151515]">•••• {payment.last4}</span><span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#5E626D]">Default</span></div>
                  <span className="text-[11px] text-[#8E929C]">Expires {payment.expiry} • {payment.name}</span>
                </div>
              </div>
              <CheckCircle weight="fill" className="text-[18px] text-[#0B7A57]" />
            </div>
            <div className="flex flex-col gap-1 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">Billing Profile</span>
              <p className="text-[12px] font-semibold text-[#151515]">{billingProfile.company}</p>
              <p className="text-[11px] text-[#8E929C]">GSTIN: <span className="font-mono font-semibold text-[#151515]">{billingProfile.gstin}</span></p>
              <p className="text-[11px] text-[#8E929C]">{billingProfile.email}</p>
            </div>
          </div>
          <button type="button" onClick={() => notify(`Tax receipt for ${billingInvoices[0].date.toLocaleDateString("en-US", { month: "short", year: "numeric" })} downloaded`)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F1F2F5] py-2.5 text-[12px] font-semibold text-[#3152F4] hover:bg-[#E5E8F5]"><Receipt className="text-[16px]" />Download Latest Tax Receipt ({billingInvoices[0].date.toLocaleDateString("en-US", { month: "short", year: "numeric" })})</button>
        </div>
      </div>

      {saturated.length > 0 && (
        <div className="flex flex-col items-start gap-4 rounded-[22px] bg-[#FEF8EC] p-5 shadow-[0_4px_16px_rgba(245,165,36,0.08)] md:flex-row md:items-center md:justify-between lg:p-6">
          <div className="flex items-start gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F5A524]/20 text-[#B45309]"><Warning className="text-[20px]" /></div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2"><h3 className="text-[15px] font-bold text-[#92400E]">Approaching Plan Limits — {saturated.length} Quota{saturated.length === 1 ? "" : "s"} Saturated</h3><span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-bold text-[#B45309]">Action Suggested</span></div>
              <p className="max-w-4xl text-[12px] text-[#78350F]">
                {atLimit.length > 0 && <>You have fully utilized your {atLimit.map((q) => `${q.label.toLowerCase()} quota (${q.used}/${q.limit})`).join(" and ")}. </>}
                {saturated.some((q) => !q.atLimit) && <>{atLimit.length > 0 ? "In addition, " : ""}{saturated.filter((q) => !q.atLimit).map((q) => `${q.label.toLowerCase()} (${q.pct.toFixed(1)}%)`).join(" and ")} {saturated.filter((q) => !q.atLimit).length === 1 ? "is" : "are"} nearing tier ceilings. </>}
                Upgrading to Premium will prevent live qualification disruptions and unlock unlimited knowledge pages and up to 10 team seats.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 self-start md:self-center">
            <button type="button" onClick={() => setPlanModalOpen(true)} className="whitespace-nowrap rounded-xl bg-[#F5A524] px-3.5 py-2 text-[12px] font-semibold text-white hover:opacity-95">Compare Premium Features →</button>
            <button type="button" onClick={() => notify("Add-on seat request sent to your account manager")} className="whitespace-nowrap rounded-xl bg-white/80 px-3.5 py-2 text-[12px] font-semibold text-[#92400E] hover:bg-white">Explore Add-on Seats</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
          <div><h2 className="text-[17px] font-bold text-[#151515]">Current Billing Cycle Quota</h2><p className="text-[11px] text-[#8E929C]">{billingFormatDate(billingCycleStart)} – {billingFormatDate(billingCycleEnd)} • {daysRemaining} days remaining in billing window</p></div>
          <button type="button" onClick={() => notify("Opening detailed consumption logs")} className="flex items-center gap-1 self-start text-[12px] font-semibold text-[#3152F4] hover:underline sm:self-auto">View detailed consumption logs<ArrowRight className="text-[14px]" /></button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {quotas.map((q) => {
            const Icon = q.icon;
            return (
              <div key={q.key} className="flex flex-col justify-between gap-3 rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(20,25,40,0.03)]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[#151515]"><span className={`grid h-7 w-7 place-items-center rounded-lg ${q.iconStyle}`}><Icon className="text-[15px]" /></span>{q.label}</span>
                  {q.atLimit ? <span className="rounded-full bg-[#FEF8EC] px-2 py-0.5 text-[10px] font-bold text-[#F5A524]">Limit Reached</span> : <span className={`text-[11px] font-bold ${q.pctColor}`}>{q.pct.toFixed(1)}%</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between"><span className="text-[24px] font-bold text-[#151515]">{q.used.toLocaleString()}</span><span className="text-[11px] text-[#8E929C]">/ {q.limit.toLocaleString()}{q.suffix}</span></div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F2F5]"><div className={`h-full rounded-full ${q.barColor}`} style={{ width: `${Math.max(2, q.pct)}%` }} /></div>
                </div>
                <div className="flex flex-col gap-0.5 pt-0.5">
                  <span className={`truncate text-[11px] ${q.tone === "danger" ? "font-semibold text-[#F04452]" : "text-[#8E929C]"}`}>{q.tone === "danger" ? `${q.limit - q.used} pages remaining` : q.detail}</span>
                  {q.detail2 && <span className="truncate text-[10px] text-[#8E929C]">{q.detail2}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="flex flex-col justify-between rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:col-span-8">
          <div className="flex flex-col justify-between gap-2 pb-4 sm:flex-row sm:items-center">
            <div><h3 className="text-[15px] font-bold text-[#151515]">Historical Consumption (Past 6 Months)</h3><p className="text-[11px] text-[#8E929C]">AI conversation volume against tier baseline ({plan.aiChatLimit.toLocaleString()} quota limit)</p></div>
            <div className="flex items-center gap-3 text-[11px] text-[#8E929C]"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#3152F4]" />Utilized</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#E5E8F5]" />Quota Ceiling</span></div>
          </div>
          <div className="relative flex h-56 w-full items-end">
            <svg viewBox="0 0 600 180" preserveAspectRatio="none" className="h-full w-full overflow-visible">
              <line x1="0" x2="600" y1="20" y2="20" stroke="#DFE2EF" strokeDasharray="4 4" strokeWidth="1.5" />
              <text x="595" y="16" textAnchor="end" className="fill-[#8E929C]" style={{ font: "10px monospace" }}>{plan.aiChatLimit.toLocaleString()} Quota</text>
              <line x1="0" x2="600" y1="70" y2="70" stroke="#F1F2F5" strokeWidth="1" />
              <line x1="0" x2="600" y1="120" y2="120" stroke="#F1F2F5" strokeWidth="1" />
              {billingHistory.map((h, i) => {
                const isActive = i === billingHistory.length - 1;
                const height = barFor(h.value);
                const x = 25 + i * 100;
                const y = 160 - height;
                return (
                  <g key={h.month} onMouseEnter={() => setHoveredMonth(h.month)} onMouseLeave={() => setHoveredMonth(null)} onClick={() => notify(`${h.month}: ${h.value.toLocaleString()} AI chats used`)} className="cursor-pointer">
                    <rect x={x} y={y} width={46} height={height} rx={8} className={isActive ? "fill-[#3152F4]" : hoveredMonth === h.month ? "fill-[#BAC3FF]" : "fill-[#E5E8F5]"} />
                    {isActive && (() => { const extra = barFor(projectedTotal) - height; return extra > 0 ? <rect x={x} y={y - extra} width={46} height={extra} rx={4} fill="rgba(49,82,244,0.18)" stroke="#3152F4" strokeDasharray="2 2" strokeWidth={1} /> : null; })()}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="grid grid-cols-6 pt-3 text-center text-[12px] font-semibold text-[#8E929C]">
            {billingHistory.map((h, i) => (
              <div key={h.month} className={i === billingHistory.length - 1 ? "font-bold text-[#3152F4]" : ""}>{i === billingHistory.length - 1 ? "Sep (Active)" : h.month}<span className="block font-mono font-normal text-[#151515]">{h.value.toLocaleString()}</span></div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4">
          <div className="flex flex-col justify-between gap-3 rounded-[24px] bg-[linear-gradient(155deg,#242424_0%,#121212_100%)] p-6 text-white shadow-[0_16px_36px_rgba(15,15,20,0.22)]">
            <div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-wide text-[#A0A4AE]">Efficiency KPI</span><ShieldCheck className="text-[18px] text-[#58DDAC]" /></div>
            <div>
              <div className="text-[32px] font-bold leading-none tracking-tight text-white">91%</div>
              <p className="mt-1 text-[12px] font-medium text-[#DFE2EF]">Autonomous Lead Resolution</p>
              <p className="mt-1 text-[11px] text-[#A0A4AE]">91 of every 100 conversations qualified without human intervention.</p>
            </div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-[#58DDAC]" /><span className="text-[11px] font-semibold text-[#58DDAC]">Live AI pipeline active</span></div>
          </div>
          <div className="flex flex-col gap-4 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col"><span className="text-[10px] font-semibold uppercase tracking-wide text-[#8E929C]">Growth Velocity</span><span className="text-[17px] font-bold text-[#151515]">+14.8% / mo</span></div>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#E8F8F3] text-[#0B7A57]"><TrendUp className="text-[18px]" /></div>
            </div>
            <div className="h-px bg-[#F1F2F5]" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col"><span className="text-[10px] font-semibold uppercase tracking-wide text-[#8E929C]">Peak Traffic Spike</span><span className="text-[14px] font-bold text-[#151515]">Sep 12 • 48 chats</span></div>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#F1F2F5] text-[#5E626D]"><ChartLineUp className="text-[18px]" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(20,25,40,0.04)] lg:p-7">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div><h3 className="text-[17px] font-bold text-[#151515]">Invoice History</h3><p className="text-[11px] text-[#8E929C]">Download GST-compliant tax invoices and monitor billing history</p></div>
          <button type="button" onClick={() => notify("Invoice history exported as CSV")} className="flex items-center gap-1.5 rounded-xl bg-[#F1F2F5] px-3.5 py-2 text-[12px] font-semibold text-[#151515] hover:bg-[#E5E8F5]"><Export className="text-[16px] text-[#8E929C]" />Export All (.CSV)</button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="rounded-xl bg-[#F8F9FC] text-[10px] font-bold uppercase tracking-wide text-[#8E929C]">
                <th className="rounded-l-xl px-4 py-3">Invoice ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Billing Period</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="rounded-r-xl px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {pagedInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[#F1F2F5] transition-colors last:border-0 hover:bg-[#F8F9FC]">
                  <td className="px-4 py-4 font-mono font-semibold text-[#3152F4]">{inv.id}</td>
                  <td className="px-4 py-4 text-[#151515]">{billingFormatDate(inv.date)}</td>
                  <td className="px-4 py-4 text-[#8E929C]">{billingFormatPeriod(inv.date, inv.periodEnd)}</td>
                  <td className="px-4 py-4 font-mono font-semibold text-[#151515]">€{inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-4"><span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F8F3] px-2.5 py-1 text-[11px] font-semibold text-[#0B7A57]"><span className="h-1.5 w-1.5 rounded-full bg-[#0B7A57]" />{inv.status}</span></td>
                  <td className="px-4 py-4 text-right"><button type="button" onClick={() => notify(`${inv.id} downloaded`)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#F1F2F5] px-3 py-1.5 text-[11px] font-semibold text-[#151515] hover:bg-[#3152F4] hover:text-white"><DownloadSimple className="text-[14px]" />Download PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-[#8E929C]">Showing {pagedInvoices.length} of {billingInvoices.length} invoices</span>
          <div className="flex items-center gap-2">
            <button type="button" disabled={invoicePage === 0} onClick={() => setInvoicePage((p) => Math.max(0, p - 1))} aria-label="Previous page" className="rounded-lg bg-[#F1F2F5] p-2 text-[#8E929C] disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-[#E5E8F5] enabled:hover:text-[#151515]"><CaretLeft className="text-[16px]" /></button>
            <span className="rounded-lg bg-[#3152F4] px-3 py-1 text-[11px] font-semibold text-white">{invoicePage + 1}</span>
            <button type="button" disabled={invoicePage >= totalPages - 1} onClick={() => setInvoicePage((p) => Math.min(totalPages - 1, p + 1))} aria-label="Next page" className="rounded-lg bg-[#F1F2F5] p-2 text-[#8E929C] disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-[#E5E8F5] enabled:hover:text-[#151515]"><CaretRight className="text-[16px]" /></button>
          </div>
        </div>
      </div>

      {planModalOpen && <BillingChangePlanModal currentPlanId={planId} onSelect={selectPlan} onClose={() => setPlanModalOpen(false)} />}
      {paymentModalOpen && <BillingPaymentModal payment={payment} onSave={savePayment} onClose={() => setPaymentModalOpen(false)} />}
    </div>
  );
}

function StateDialog({ close }: { close: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/30 p-4">
      <div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-[0_24px_48px_rgba(18,24,40,0.2)]">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-[15px] font-bold text-[#151515]">Representative interface states</h2><p className="text-[11px] text-[#8E929C]">Loading, recovery, and unavailable actions remain explicit.</p></div><button onClick={close} aria-label="Close" className="text-[#8E929C]"><X /></button></div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-xl bg-[#F8F8FA] p-3"><SpinnerGap className="animate-spin text-[18px] text-[#3152F4]" /><div><b className="text-[12px] text-[#151515]">Refreshing qualification</b><p className="text-[10px] text-[#8E929C]">Current lead data stays visible while updates load.</p></div></div>
          <div className="flex items-center gap-3 rounded-xl bg-[#FDF2F3] p-3"><XCircle className="text-[18px] text-[#F04452]" /><div><b className="text-[12px] text-[#151515]">Webhook delivery failed</b><p className="text-[10px] text-[#8E929C]">HTTP 503 from sales endpoint. Retry after checking configuration.</p></div></div>
          <div className="flex items-center gap-3 rounded-xl bg-[#F1F2F5] p-3 opacity-70"><Lock className="text-[18px] text-[#8E929C]" /><div><b className="text-[12px] text-[#151515]">HubSpot test unavailable</b><p className="text-[10px] text-[#8E929C]">Connect a HubSpot account before sending a test lead.</p></div></div>
        </div>
        <button onClick={close} className="mt-4 w-full rounded-xl bg-[#3152F4] py-2 text-[12px] font-semibold text-white">Done</button>
      </div>
    </div>
  );
}
