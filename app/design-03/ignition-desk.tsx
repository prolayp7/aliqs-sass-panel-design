"use client";

/*
THESIS: Every lead is a deal to close today, not a record to file — the desk should feel like a dealership GM's command center, not a CRM report.
OWN-WORLD: Inherited catalog world — Dealer AI OS ("dealeraios"), a dark-navy dealership operations console: near-black slate canvas, one glowing orange action color, translucent semantic tints (blue/emerald/amber/red at 10-25% opacity) for status, pill badges, and photo-forward priority cards with colored-glow CTAs.
STORY: Enter through the mission banner and today's targets, scan priority-coded lead cards exactly like inventory units, open one to see AI scoring and the next best action, then act with a single glowing button.
FIRST VIEWPORT: Fixed navy sidebar + navy top bar frame a dark canvas; a gradient mission banner with a circular score ring anchors the top, KPI and stat rows follow, then a dense bento of intelligence panels and the priority lead board.
FORM: Catalog-world inheritance, not an original direction — palette, shell, card and badge grammar carried verbatim from dealeraios per explicit brief; product domain (AILQS lead qualification) unchanged.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
*/

import { useEffect, useRef, useState } from "react";
import {
  ArrowClockwise, ArrowCounterClockwise, ArrowRight, ArrowSquareOut, ArrowsDownUp, ArrowsLeftRight, ArrowsOut, Bell, BellRinging, BookOpenText, BookmarkSimple, Brain, CalendarBlank, CalendarCheck,
  CaretDown, CaretRight, CaretUp, ChartBar, ChartLineUp, ChatCircle, Check, CheckCircle, Circle, CircleDashed, CirclesThreePlus, Clock, ClockCounterClockwise, Code, Command, CreditCard, CurrencyDollar, Database, DotsSixVertical, DotsThree,
  DownloadSimple, EnvelopeSimple, Envelope, Eye, FileText, Fire, Flag, FlowArrow, FloppyDisk, Funnel, GearSix, Gauge, Globe, House, IdentificationBadge, Info, Lightning, LinkSimple, ListBullets, ListChecks, Lock, MagnifyingGlass, Megaphone,
  Microphone, Minus, MinusCircle, NotePencil, Package, Paperclip, PaperPlaneRight, Phone, PlayCircle, Plus, PlusCircle, Question, Repeat, Robot, Scales, ShieldCheck, SignOut, SlidersHorizontal, Smiley, Sparkle, Table, Target, TestTube, TextAa, TextAlignLeft, Timer, Trash, Translate, TrendDown, TrendUp, UploadSimple, UserCircle,
  Users, VideoCamera, Warning, WhatsappLogo, X,
} from "@phosphor-icons/react";

/* ---------------------------------- data ---------------------------------- */

type Temp = "Hot" | "Warm" | "Cold";

type Lead = {
  id: number; name: string; company: string; initials: string; tint: string;
  temp: Temp; score: number; interest: string; site: string; owner: string;
  status: string; received: string; followup: string; summary: string; email: string; phone: string;
};

const leads: Lead[] = [
  { id: 1, name: "Jonas Whitfield", company: "Meridian Robotics", initials: "JW", tint: "blue", temp: "Hot", score: 94, interest: "Enterprise onboarding", site: "ailqs.com", owner: "Maya Chen", status: "New", received: "3m ago", followup: "Today, 3:00 PM", summary: "Evaluating AI qualification across three regional sites. Budget signed off, wants to launch this sprint.", email: "jonas@meridianrobotics.io", phone: "+1 415 555 0142" },
  { id: 2, name: "Priya Anand", company: "Vantage Legal", initials: "PA", tint: "violet", temp: "Warm", score: 71, interest: "Consultation booking", site: "studio.ailqs.com", owner: "You", status: "Contacted", received: "22m ago", followup: "Tomorrow", summary: "Wants intake calls auto-scheduled for qualified consultations. Comparing two vendors this week.", email: "priya@vantagelegal.com", phone: "+1 312 555 0177" },
  { id: 3, name: "Marcus Webb", company: "Coastal Fitness Co.", initials: "MW", tint: "rose", temp: "Hot", score: 88, interest: "Membership signup", site: "ailqs.com", owner: "Jon Reyes", status: "New", received: "38m ago", followup: "Overdue", summary: "High-intent membership enquiry, asked about founding-member pricing twice. Ready to close today.", email: "marcus@coastalfitness.co", phone: "+1 619 555 0119" },
  { id: 4, name: "Elena Kade", company: "BrightPath Realty", initials: "EK", tint: "amber", temp: "Warm", score: 65, interest: "Property enquiry", site: "property.ailqs.com", owner: "Unassigned", status: "New", received: "1h ago", followup: "Not set", summary: "Browsing listings by school district. Timeline and budget not yet confirmed.", email: "elena@brightpathrealty.com", phone: "+1 480 555 0163" },
  { id: 5, name: "Tomas Reyes", company: "Harbor & Co. Bakery", initials: "TR", tint: "cyan", temp: "Cold", score: 34, interest: "Catering quote", site: "studio.ailqs.com", owner: "You", status: "Qualified", received: "2h ago", followup: "Sep 6", summary: "Requested a catering estimate for a future event with no confirmed date or budget.", email: "tomas@harborbakery.com", phone: "+1 206 555 0108" },
  { id: 6, name: "Aisha Bello", company: "Pulse Dental Group", initials: "AB", tint: "emerald", temp: "Hot", score: 90, interest: "New patient booking", site: "ailqs.com", owner: "Maya Chen", status: "Contacted", received: "3h ago", followup: "Friday", summary: "New-patient enquiry with insurance pre-verified. Wants the earliest available slot.", email: "aisha@pulsedental.com", phone: "+1 713 555 0184" },
  { id: 7, name: "Diego Fuentes", company: "Ridgeline Outfitters", initials: "DF", tint: "sky", temp: "Warm", score: 58, interest: "Bulk order enquiry", site: "studio.ailqs.com", owner: "Jon Reyes", status: "New", received: "5h ago", followup: "Not set", summary: "Corporate gifting order for 40+ units. Needs a volume-pricing sheet before committing.", email: "diego@ridgelineoutfitters.com", phone: "+1 303 555 0195" },
  { id: 8, name: "Sofia Marchetti", company: "Willow Creek Spa", initials: "SM", tint: "fuchsia", temp: "Cold", score: 41, interest: "Gift card enquiry", site: "property.ailqs.com", owner: "You", status: "Qualified", received: "6h ago", followup: "Not set", summary: "Asked about corporate gift-card bundles. No active budget confirmed yet.", email: "sofia@willowcreekspa.com", phone: "+1 512 555 0171" },
];

const tintMap: Record<string, string> = {
  blue: "from-blue-500/25", violet: "from-violet-500/25", rose: "from-rose-500/25", amber: "from-amber-500/25",
  cyan: "from-cyan-500/25", emerald: "from-emerald-500/25", sky: "from-sky-500/25", fuchsia: "from-fuchsia-500/25",
};
const tintTextMap: Record<string, string> = {
  blue: "bg-blue-500/15 text-blue-300", violet: "bg-violet-500/15 text-violet-300", rose: "bg-rose-500/15 text-rose-300",
  amber: "bg-amber-500/15 text-amber-300", cyan: "bg-cyan-500/15 text-cyan-300", emerald: "bg-emerald-500/15 text-emerald-300",
  sky: "bg-sky-500/15 text-sky-300", fuchsia: "bg-fuchsia-500/15 text-fuchsia-300",
};

type InboxMessage = { id: number; from: "visitor" | "ai" | "agent" | "note"; author: string; time: string; text: string; sources?: string };
type CapturedDetail = { label: string; value: string; danger?: boolean; span2?: boolean };
type ScoringItem = { label: string; points: number; done: boolean };
type AiSignal = { kind: "info" | "warning"; text: string };
type InboxConversation = {
  leadId: number; status: string; liveOn: string | null; ip: string; browser: string; previewTime: string; needsHandoff: boolean;
  messages: InboxMessage[]; aiSummary: string; capturedDetails: CapturedDetail[]; scoringBreakdown: ScoringItem[]; aiSignals: AiSignal[]; nextBestAction: string;
};

let inboxMsgId = 100;

const initialInboxConversations: InboxConversation[] = [
  {
    leadId: 1, status: "AI active", liveOn: "ailqs.com/pricing", ip: "San Francisco, CA", browser: "Chrome/macOS", previewTime: "3m ago", needsHandoff: true,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Jonas Whitfield", time: "9:40 AM", text: "We're evaluating AI qualification across three regional sites. How fast can this go live?" },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "9:41 AM", text: "Hi Jonas — most workspaces launch across multiple sites within a week, one script per site sharing a qualification model.", sources: "2 sources used: Multi-site setup guide, Launch checklist · 96% confidence" },
      { id: inboxMsgId++, from: "visitor", author: "Jonas Whitfield", time: "9:44 AM", text: "Good — budget's signed off. We want to launch this sprint." },
    ],
    aiSummary: "Jonas has budget approval for AI qualification across three regional sites and wants to launch this sprint.",
    capturedDetails: [
      { label: "Company", value: "Meridian Robotics" }, { label: "Timeline", value: "This sprint (Urgent)", danger: true },
      { label: "Email", value: "jonas@meridianrobotics.io", span2: true }, { label: "Phone", value: "+1 415 555 0142" },
      { label: "Location", value: "San Francisco, CA" }, { label: "Declared budget", value: "Approved, not disclosed", span2: true },
    ],
    scoringBreakdown: [
      { label: "Budget approved", points: 25, done: true }, { label: "Timeline within sprint", points: 20, done: true },
      { label: "Multi-site rollout confirmed", points: 20, done: true }, { label: "CRM synced", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: High (95%)" }, { kind: "warning", text: "Wants to launch this sprint" }],
    nextBestAction: "Offer a same-day onboarding walkthrough across all three sites.",
  },
  {
    leadId: 2, status: "Queued", liveOn: null, ip: "Chicago, IL", browser: "Safari/iOS", previewTime: "22m ago", needsHandoff: false,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Priya Anand", time: "8:58 AM", text: "Can intake calls be auto-scheduled once a consultation qualifies?" },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "8:59 AM", text: "Yes — qualified consultations can book straight onto your calendar with buffer time built in.", sources: "1 source used: Scheduling rules guide" },
      { id: inboxMsgId++, from: "visitor", author: "Priya Anand", time: "9:03 AM", text: "Good to know. We're comparing two vendors this week before deciding." },
    ],
    aiSummary: "Priya wants intake calls auto-scheduled for qualified consultations and is comparing two vendors this week.",
    capturedDetails: [
      { label: "Company", value: "Vantage Legal" }, { label: "Timeline", value: "This week" },
      { label: "Email", value: "priya@vantagelegal.com", span2: true }, { label: "Phone", value: "+1 312 555 0177" },
      { label: "Location", value: "Chicago, IL" }, { label: "Declared budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "Consultation workflow identified", points: 20, done: true }, { label: "Vendor comparison in progress", points: 15, done: true },
      { label: "Budget confirmed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: Medium (68%)" }],
    nextBestAction: "Send a side-by-side comparison sheet before she decides this week.",
  },
  {
    leadId: 3, status: "Needs handoff", liveOn: null, ip: "San Diego, CA", browser: "Chrome/Android", previewTime: "38m ago", needsHandoff: true,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Marcus Webb", time: "8:10 AM", text: "Is the founding-member rate still available? Asked before but want to confirm." },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "8:11 AM", text: "Yes, founding-member pricing is active through this week — I can hold your spot while you finish sign-up.", sources: "1 source used: Membership pricing sheet" },
      { id: inboxMsgId++, from: "visitor", author: "Marcus Webb", time: "8:15 AM", text: "Perfect, I'm ready to close today." },
      { id: inboxMsgId++, from: "note", author: "Jon Reyes", time: "8:48 AM", text: "Confirmed ready to close, rate expires soon. Callback is now overdue — call before he looks elsewhere." },
    ],
    aiSummary: "Marcus confirmed founding-member pricing twice and is ready to close today; his callback is now overdue.",
    capturedDetails: [
      { label: "Company", value: "Coastal Fitness Co." }, { label: "Timeline", value: "Today (Urgent)", danger: true },
      { label: "Email", value: "marcus@coastalfitness.co", span2: true }, { label: "Phone", value: "+1 619 555 0119" },
      { label: "Location", value: "San Diego, CA" }, { label: "Declared budget", value: "Ready to pay today", span2: true },
    ],
    scoringBreakdown: [
      { label: "Founding-member pricing confirmed", points: 20, done: true }, { label: "Ready to close today", points: 25, done: true },
      { label: "Contract signed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: High (96%)" }, { kind: "warning", text: "Follow-up overdue by 38 minutes" }],
    nextBestAction: "Call within 10 minutes and close the founding-member rate before it expires.",
  },
  {
    leadId: 4, status: "Unassigned", liveOn: null, ip: "Phoenix, AZ", browser: "Edge/Windows", previewTime: "1h ago", needsHandoff: false,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Elena Kade", time: "7:30 AM", text: "Can listings be filtered by school district?" },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "7:31 AM", text: "Yes — I can pull a shortlist filtered by school district once you share a target area.", sources: "1 source used: Listing search guide" },
    ],
    aiSummary: "Elena is browsing listings by school district; timeline and budget are not yet confirmed.",
    capturedDetails: [
      { label: "Company", value: "BrightPath Realty" }, { label: "Timeline", value: "Not confirmed" },
      { label: "Email", value: "elena@brightpathrealty.com", span2: true }, { label: "Phone", value: "+1 480 555 0163" },
      { label: "Location", value: "Phoenix, AZ" }, { label: "Declared budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "School-district requirement identified", points: 15, done: true }, { label: "Budget confirmed", points: 0, done: false },
      { label: "Timeline confirmed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: Low (42%)" }],
    nextBestAction: "Route to an owner and send a curated listing shortlist.",
  },
  {
    leadId: 5, status: "Nurture", liveOn: null, ip: "Seattle, WA", browser: "Firefox/Windows", previewTime: "2h ago", needsHandoff: false,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Tomas Reyes", time: "6:50 AM", text: "Looking for a catering estimate for a future event." },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "6:51 AM", text: "Happy to help — our catering packages start around $18/head. Let me know your date once it's set." },
    ],
    aiSummary: "Tomas requested a catering estimate with no confirmed date or budget yet.",
    capturedDetails: [
      { label: "Company", value: "Harbor & Co. Bakery" }, { label: "Timeline", value: "Exploratory" },
      { label: "Email", value: "tomas@harborbakery.com", span2: true }, { label: "Phone", value: "+1 206 555 0108" },
      { label: "Location", value: "Seattle, WA" }, { label: "Declared budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "Catering use case identified", points: 10, done: true }, { label: "Event date confirmed", points: 0, done: false },
      { label: "Budget confirmed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: Low (29%)" }],
    nextBestAction: "Check back closer to Sep 6 once the event date firms up.",
  },
  {
    leadId: 6, status: "AI active", liveOn: "ailqs.com/booking", ip: "Houston, TX", browser: "Chrome/iOS", previewTime: "3h ago", needsHandoff: true,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Aisha Bello", time: "5:20 AM", text: "Do you take my insurance for a new-patient booking?" },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "5:21 AM", text: "Yes, your plan is pre-verified in our system. I can get you the earliest available slot.", sources: "1 source used: Insurance network list" },
      { id: inboxMsgId++, from: "visitor", author: "Aisha Bello", time: "5:24 AM", text: "Great, please book the earliest one you have." },
    ],
    aiSummary: "Aisha's insurance is pre-verified for a new-patient booking; she wants the earliest available slot.",
    capturedDetails: [
      { label: "Company", value: "Pulse Dental Group" }, { label: "Timeline", value: "This week (Urgent)", danger: true },
      { label: "Email", value: "aisha@pulsedental.com", span2: true }, { label: "Phone", value: "+1 713 555 0184" },
      { label: "Location", value: "Houston, TX" }, { label: "Declared budget", value: "Insurance pre-verified", span2: true },
    ],
    scoringBreakdown: [
      { label: "Insurance pre-verified", points: 20, done: true }, { label: "Earliest-slot request", points: 20, done: true },
      { label: "Appointment confirmed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: High (89%)" }],
    nextBestAction: "Offer the earliest available slot before she looks elsewhere.",
  },
  {
    leadId: 7, status: "Queued", liveOn: null, ip: "Denver, CO", browser: "Chrome/Windows", previewTime: "5h ago", needsHandoff: false,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Diego Fuentes", time: "3:05 AM", text: "We need a corporate gifting order for 40+ units. What's the volume pricing?" },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "3:06 AM", text: "For 40+ units you'd qualify for tiered volume pricing — I can send the full sheet.", sources: "1 source used: Volume pricing tiers" },
      { id: inboxMsgId++, from: "visitor", author: "Diego Fuentes", time: "3:09 AM", text: "Please send it over before we commit." },
    ],
    aiSummary: "Diego needs a 40+ unit corporate gifting order and wants a volume-pricing sheet before committing.",
    capturedDetails: [
      { label: "Company", value: "Ridgeline Outfitters" }, { label: "Timeline", value: "This month" },
      { label: "Email", value: "diego@ridgelineoutfitters.com", span2: true }, { label: "Phone", value: "+1 303 555 0195" },
      { label: "Location", value: "Denver, CO" }, { label: "Declared budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "Bulk order volume confirmed", points: 20, done: true }, { label: "Pricing sheet requested", points: 15, done: true },
      { label: "Budget confirmed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: Medium (61%)" }],
    nextBestAction: "Send the volume-pricing sheet today to keep momentum.",
  },
  {
    leadId: 8, status: "Nurture", liveOn: null, ip: "Austin, TX", browser: "Safari/macOS", previewTime: "6h ago", needsHandoff: false,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Sofia Marchetti", time: "2:15 AM", text: "Do you offer corporate gift-card bundles?" },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "2:16 AM", text: "Yes — bundles start at 10 cards with a discount tier at 25+. Happy to send options." },
    ],
    aiSummary: "Sofia asked about corporate gift-card bundles with no active budget confirmed yet.",
    capturedDetails: [
      { label: "Company", value: "Willow Creek Spa" }, { label: "Timeline", value: "Exploratory" },
      { label: "Email", value: "sofia@willowcreekspa.com", span2: true }, { label: "Phone", value: "+1 512 555 0171" },
      { label: "Location", value: "Austin, TX" }, { label: "Declared budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "Gift-card use case identified", points: 10, done: true }, { label: "Budget confirmed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: Low (31%)" }],
    nextBestAction: "Follow up once budget is confirmed, no rush.",
  },
];

const inboxQuickReplies = [
  "Thanks for the detail — I'm pulling together the right resources now.",
  "Great question — looping in a specialist and following up within the hour.",
  "Happy to set up a quick call this week if that's easier than chat.",
];

/* --------------------------------- follow-ups data --------------------------------- */

type FollowUpType = "call" | "email" | "whatsapp" | "meeting";
type FollowUpPriority = "High" | "Medium" | "Normal";
type FollowUpGroupKey = "Today" | "Tomorrow" | "Later";
type FollowUpTask = {
  id: number; type: FollowUpType; title: string; company: string; temp?: Temp; score?: number; description: string;
  group: FollowUpGroupKey; day: number; time: string; overdueLabel?: string;
  ownerName: string; ownerInitials: string; priority: FollowUpPriority; completed: boolean;
};

let followUpIdCounter = 100;
const TODAY_DAY = 8;

const followUpTypeMeta: Record<FollowUpType, { icon: typeof Phone; label: string; actionLabel: string; actionIcon: typeof Phone; tile: string }> = {
  call: { icon: Phone, label: "Call", actionLabel: "Call now", actionIcon: Phone, tile: "bg-orange-500/15 text-orange-400" },
  email: { icon: EnvelopeSimple, label: "Email", actionLabel: "Draft email", actionIcon: NotePencil, tile: "bg-slate-800 text-slate-300" },
  whatsapp: { icon: WhatsappLogo, label: "WhatsApp", actionLabel: "Send message", actionIcon: PaperPlaneRight, tile: "bg-emerald-500/15 text-emerald-400" },
  meeting: { icon: VideoCamera, label: "Meeting", actionLabel: "Join meeting", actionIcon: VideoCamera, tile: "bg-blue-500/15 text-blue-400" },
};
const followUpOwners = ["Maya Chen", "You", "Jon Reyes"];

const initialFollowUps: FollowUpTask[] = [
  { id: 1, type: "call", title: "Call with Jonas Whitfield", company: "Meridian Robotics", temp: "Hot", score: 94, description: "Confirm launch timeline and finalize the three-site rollout plan.", group: "Today", day: TODAY_DAY, time: "3:00 PM", ownerName: "Maya Chen", ownerInitials: "MC", priority: "High", completed: false },
  { id: 2, type: "call", title: "Call with Marcus Webb", company: "Coastal Fitness Co.", temp: "Hot", score: 88, description: "Close the founding-member rate before it expires.", group: "Today", day: TODAY_DAY, time: "8:48 AM", overdueLabel: "38m Overdue", ownerName: "Jon Reyes", ownerInitials: "JR", priority: "High", completed: false },
  { id: 3, type: "email", title: "Email follow-up with Priya Anand", company: "Vantage Legal", temp: "Warm", score: 71, description: "Send the vendor comparison sheet before she decides this week.", group: "Tomorrow", day: TODAY_DAY + 1, time: "11:00 AM", ownerName: "You", ownerInitials: "AK", priority: "Medium", completed: false },
  { id: 4, type: "email", title: "Email follow-up with Elena Kade", company: "BrightPath Realty", temp: "Warm", score: 65, description: "Send a curated listing shortlist by school district.", group: "Later", day: TODAY_DAY + 3, time: "2:00 PM", ownerName: "You", ownerInitials: "AK", priority: "Normal", completed: false },
  { id: 5, type: "email", title: "Email follow-up with Diego Fuentes", company: "Ridgeline Outfitters", temp: "Warm", score: 58, description: "Send the volume-pricing sheet for the bulk gifting order.", group: "Later", day: TODAY_DAY + 3, time: "1:00 PM", ownerName: "Jon Reyes", ownerInitials: "JR", priority: "Normal", completed: false },
  { id: 6, type: "call", title: "Call with Aisha Bello", company: "Pulse Dental Group", temp: "Hot", score: 90, description: "Confirm the earliest available new-patient slot.", group: "Later", day: TODAY_DAY + 4, time: "9:00 AM", ownerName: "Maya Chen", ownerInitials: "MC", priority: "High", completed: false },
  { id: 7, type: "whatsapp", title: "WhatsApp follow-up with Sofia Marchetti", company: "Willow Creek Spa", temp: "Cold", score: 41, description: "Share gift-card bundle options once budget firms up.", group: "Later", day: TODAY_DAY + 7, time: "10:00 AM", ownerName: "You", ownerInitials: "AK", priority: "Normal", completed: false },
  { id: 8, type: "email", title: "Email follow-up with Tomas Reyes", company: "Harbor & Co. Bakery", temp: "Cold", score: 34, description: "Check in once the catering event date is confirmed.", group: "Later", day: TODAY_DAY + 12, time: "10:00 AM", ownerName: "You", ownerInitials: "AK", priority: "Normal", completed: false },
];

function buildMonthGrid(year: number, month: number): (number | null)[][] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/* --------------------------------- AI agent data --------------------------------- */

type AgentSetupTab = "Identity" | "Behavior" | "Conversation Flow" | "Guardrails" | "Languages" | "Test & Publish";
const agentSetupNav: [AgentSetupTab, typeof IdentificationBadge][] = [
  ["Identity", IdentificationBadge], ["Behavior", Brain], ["Conversation Flow", FlowArrow],
  ["Guardrails", ShieldCheck], ["Languages", Translate], ["Test & Publish", TestTube],
];
const personalityOptions = ["Professional & Direct", "Warm & Advisory", "Playful & Casual", "Consultative Expert"] as const;
const toneOptions = ["Empathetic", "Data-driven", "Crisp & Concise", "Authoritative"] as const;
const responseLengthOptions = ["Concise (1-2 sentences)", "Balanced (2-3 paragraphs)", "Detailed & Thorough"] as const;
const avatarMarks = [
  { key: "ember", label: "Ember Spark", desc: "Brand geometric glyph", icon: Sparkle },
  { key: "orbital", label: "Orbital Glyph", desc: "Layered ring motif", icon: CircleDashed },
  { key: "pulse", label: "Pulse Mark", desc: "Signal pulse icon", icon: Lightning },
] as const;
const defaultSystemPrompt =
  "You are Ignition, the senior inbound lead qualifier for AILQS. Your goal is to welcome website visitors, discover their service interest, verify timeline and budget feasibility (threshold: $1,200+), and smoothly book high-intent prospects onto the sales calendar. Maintain an advisory, clear demeanor. If prospects ask for technical detail beyond scope, summarize succinctly and offer a scoping call.";

function AgentKpi({ label, value, icon: Icon, note, pill }: { label: string; value: string; icon: typeof Fire; note?: string; pill?: string }) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between"><span className="text-[11px] font-medium text-slate-500">{label}</span><div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-800 text-slate-400"><Icon className="text-[15px]" /></div></div>
      <div>
        <div className="text-2xl font-bold leading-none text-white">{value}</div>
        {pill ? <span className="mt-2 inline-block rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold text-orange-300">{pill}</span>
          : <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500"><TrendUp className="text-[12px] text-emerald-400" />{note}</div>}
      </div>
    </div>
  );
}

interface ChatTurn { id: number; role: "agent" | "visitor"; text: string }
interface TestHistoryItem { id: number; label: string; confidence: number; note: string; current: boolean; query?: string }

const initialChatTurns: ChatTurn[] = [
  { id: 1, role: "agent", text: "Hi there! 👋 Welcome to ailqs.com. Are you looking to book a service or get a quick quote?" },
  { id: 2, role: "visitor", text: "Hi, we're looking to automate new-patient intake for our dental clinic. We have budget under $50,000 and need to start next month. Can you handle insurance pre-verification?" },
  { id: 3, role: "agent", text: "Yes, absolutely! AILQS can pre-verify insurance and route qualified patients straight to the earliest open slot. With a budget under $50,000 and a 30-day kickoff timeline, your clinic qualifies for our Dedicated Onboarding sprint.\n\nWould you like me to book a 30-minute scoping session for this Thursday?" },
];
const quickScenarioPrompts = ['"What is your SLA?"', '"What about HIPAA compliance?"', '"Can we pay via wire transfer?"', '"Are you an offshore agency?"'];
const initialTestHistory: TestHistoryItem[] = [
  { id: 1, label: "Turn 1 • Fallback Triggered", confidence: 38, query: "Do you offer veterinary hardware installs?", note: "Off-scope domain caught cleanly; offered general consultation handoff.", current: false },
  { id: 2, label: "Turn 2 • Current Turn", confidence: 92, note: "Dental intake under $50K with insurance pre-verification → Direct qualification & booking invite.", current: true },
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
  if (lower.includes("wire")) return "Yes — wire transfer is available for annual contracts above $10,000; I'll loop in billing once scope is confirmed.";
  if (lower.includes("offshore")) return "We're a distributed team with a US-based delivery lead assigned to every account, so you always have a single point of contact.";
  return "Thanks for the detail — I've logged that against your qualification profile and flagged it for the sales team.";
}

/* --------------------------------- qualification data --------------------------------- */

type QualificationQuestion = { id: number; label: string; crmField: string; fieldType: string; points: string; askCondition: string; required: boolean };

const crmFieldOptions = ["lead.timeline_urgency", "lead.budget_range", "lead.service_interest", "lead.company_size", "lead.decision_role", "lead.contact_details", "lead.geo_location", "lead.custom_field"];
const fieldTypeOptions = ["Segmented Pill Choices (Single Select)", "Free Text Response", "Multi Select Pills", "Number Input", "Date Picker", "AI Detected (No Prompt)"];

const initialQuestions: QualificationQuestion[] = [
  { id: 1, label: "Budget & Investment Range", crmField: "lead.budget_range", fieldType: "Currency Range", points: "Up to +25 pts (High Impact)", askCondition: "Ask if Service != 'Advisory Only'", required: true },
  { id: 2, label: "Timeline & Kickoff", crmField: "lead.timeline", fieldType: "Segmented Choices", points: "+20 pts (< 30 days)", askCondition: "Ask after budget confirmed", required: true },
  { id: 3, label: "Service Interest", crmField: "lead.service_interest", fieldType: "Single Select Pills", points: "Up to +18 pts", askCondition: "Always ask (Turn 1)", required: true },
  { id: 4, label: "Decision Maker Role", crmField: "lead.decision_role", fieldType: "Select Range", points: "+15 pts (Owner / Decision Maker)", askCondition: "Ask if service confirmed", required: false },
  { id: 5, label: "Buying Intent Signal", crmField: "lead.intent_score", fieldType: "AI Detected", points: "Up to +22 pts", askCondition: "Derived from conversation language", required: false },
];

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-orange-500" : "bg-slate-700"}`}>
      <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

type ScoringRuleKind = "positive" | "highlight" | "alert" | "penalty";
type ScoringRuleIcon = "lightning" | "sparkle" | "bellRinging" | "minusCircle" | "shieldCheck" | "chartLineUp";

type ScoringRule = {
  id: number; name: string; category: string; kind: ScoringRuleKind; icon: ScoringRuleIcon; points: number;
  conditionIf: string; conditionAnd?: string; note?: { prefix: string; highlight: string; suffix: string };
  matched: number; capturePercent?: string; evaluatedAgo: string; precision: string; active: boolean;
};

const ruleKindStyle: Record<ScoringRuleKind, string> = {
  positive: "bg-emerald-500/15 text-emerald-400", highlight: "bg-orange-500/15 text-orange-300",
  alert: "bg-red-500/15 text-red-400", penalty: "bg-red-500/15 text-red-400",
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
  { id: 1, name: "High Velocity", category: "Financial & Urgency", kind: "positive", icon: "lightning", points: 25, conditionIf: "Budget ≥ $50,000", conditionAnd: "Timeline is within 30 days", matched: 318, capturePercent: "74.2% capture", evaluatedAgo: "4m ago", precision: "99.2%", active: true },
  { id: 2, name: "Core Offering Match", category: "Service Fit", kind: "highlight", icon: "sparkle", points: 18, conditionIf: 'Service Interest is "Booking & Scheduling"', matched: 482, evaluatedAgo: "12m ago", precision: "98.9%", active: true },
  { id: 3, name: "Direct Hot Handover", category: "Intent & Routing", kind: "alert", icon: "bellRinging", points: 22, conditionIf: 'Buying Intent is "High (Immediate Need)"', note: { prefix: "Trigger Slack alert to ", highlight: "#hot-leads", suffix: " & assign round-robin" }, matched: 142, evaluatedAgo: "1m ago", precision: "99.7%", active: true },
  { id: 4, name: "Penalty", category: "Demographics", kind: "penalty", icon: "minusCircle", points: 20, conditionIf: 'Location is "Outside Service Area"', matched: 64, evaluatedAgo: "42m ago", precision: "96.5%", active: true },
  { id: 5, name: "Authority Boost", category: "Authority", kind: "positive", icon: "shieldCheck", points: 15, conditionIf: 'Decision Maker Role is "Owner / Decision Maker"', matched: 215, evaluatedAgo: "18m ago", precision: "99.1%", active: true },
  { id: 6, name: "Scale Fit", category: "Scale & Volume", kind: "positive", icon: "chartLineUp", points: 10, conditionIf: "Monthly Website Traffic > 5,000 visits", matched: 98, evaluatedAgo: "2h ago", precision: "97.8%", active: true },
];

const sampleLeadScores = Array.from({ length: 60 }, (_, i) => Math.floor((((Math.sin(i * 12.9898) * 43758.5453) % 1) + 1) % 1 * 100));

const ruleCategories = ["Financial & Urgency", "Service Fit", "Intent & Routing", "Demographics", "Authority", "Scale & Volume"];
const ruleKindOptions: { value: ScoringRuleKind; label: string }[] = [
  { value: "positive", label: "Positive Boost" }, { value: "highlight", label: "Highlighted Fit" },
  { value: "alert", label: "Alert & Instant Notify" }, { value: "penalty", label: "Penalty" },
];
const ruleKindDefaultIcon: Record<ScoringRuleKind, ScoringRuleIcon> = { positive: "lightning", highlight: "sparkle", alert: "bellRinging", penalty: "minusCircle" };

const simulatorPresets = [
  { name: "Jonas Whitfield", budget: 75000, timelineDays: 10, service: "Booking & Scheduling", intent: "High (Immediate Need)", authority: "Owner / Decision Maker", location: "Primary Service Area" },
  { name: "Priya Anand", budget: 30000, timelineDays: 45, service: "Consultation", intent: "Medium (Exploring)", authority: "Manager / Director", location: "Primary Service Area" },
  { name: "Tomas Reyes", budget: 8000, timelineDays: 90, service: "Advisory Only", intent: "Low (Research Only)", authority: "Individual Contributor", location: "Outside Service Area" },
];
const serviceOptions = ["Booking & Scheduling", "Patient / Client Intake", "Consultation", "Advisory Only", "General Inquiry"];
const intentOptions = ["High (Immediate Need)", "Medium (Exploring)", "Low (Research Only)"];
const authorityOptions = ["Owner / Decision Maker", "Manager / Director", "Front Desk / Staff", "Individual Contributor"];
const locationOptions = ["Primary Service Area", "Secondary Service Area", "Outside Service Area"];

const nav = [
  ["Dashboard", House], ["Inbox", EnvelopeSimple], ["Leads", Target], ["Follow-ups", CalendarCheck],
  ["AI Agent", Robot], ["Qualification", SlidersHorizontal], ["Knowledge Base", BookOpenText],
  ["Websites & Widget", Globe], ["Analytics", ChartLineUp], ["Integrations", CirclesThreePlus],
] as const;
const navAdmin = [
  ["Team", Users], ["Notifications", Bell], ["Billing & Usage", CreditCard], ["Settings", GearSix],
] as const;

const genericContent: Record<string, { intro: string; icon: typeof Globe; rows: { title: string; text: string; state: string; tone: "ok" | "warn" | "info" }[] }> = {
  "Websites & Widget": { intro: "Installation and health across every connected site.", icon: Globe, rows: [
    { title: "ailqs.com", text: "Widget live 2 minutes ago · 1,140 conversations", state: "Live", tone: "ok" },
    { title: "studio.ailqs.com", text: "Widget live 11 minutes ago · 402 conversations", state: "Live", tone: "ok" },
    { title: "property.ailqs.com", text: "Knowledge refresh needs attention", state: "Warning", tone: "warn" },
  ] },
  Analytics: { intro: "Performance across leads, conversations, and sources.", icon: ChartLineUp, rows: [
    { title: "New leads", text: "This period, up from last 30 days", state: "+12.4%", tone: "ok" },
    { title: "Qualification rate", text: "Visitors converting to scored leads", state: "38.2%", tone: "ok" },
    { title: "Median response", text: "Time from inbound to first reply", state: "9m", tone: "info" },
  ] },
  Integrations: { intro: "Where qualified leads get delivered.", icon: CirclesThreePlus, rows: [
    { title: "HubSpot", text: "Connected · last delivery 6m ago", state: "Connected", tone: "ok" },
    { title: "Sales webhook", text: "2 of 40 recent deliveries failed", state: "Needs attention", tone: "warn" },
    { title: "SMTP email", text: "Google Workspace · last email 6m ago", state: "Connected", tone: "ok" },
  ] },
  Team: { intro: "Ownership across the desk, without turning this into a routing engine.", icon: Users, rows: [
    { title: "Maya Chen", text: "Admin · 2 assigned leads", state: "Active", tone: "ok" },
    { title: "You", text: "Admin · 3 assigned leads", state: "Active", tone: "ok" },
    { title: "Jon Reyes", text: "Sales rep · 2 assigned leads", state: "Active", tone: "ok" },
  ] },
  Notifications: { intro: "Who hears about new leads, overdue follow-ups, and failures.", icon: Bell, rows: [
    { title: "New hot lead", text: "Notify all admins immediately", state: "Active", tone: "ok" },
    { title: "Follow-up overdue", text: "Email the assigned owner after 1 hour", state: "Active", tone: "ok" },
    { title: "Delivery failure", text: "Email workspace admins after first retry", state: "Active", tone: "ok" },
  ] },
  "Billing & Usage": { intro: "Plan consumption for this workspace.", icon: CreditCard, rows: [
    { title: "Monthly conversations", text: "742 of 1,000 used this cycle", state: "74%", tone: "info" },
    { title: "Connected sites", text: "3 of 3 on the current plan", state: "Full", tone: "warn" },
    { title: "Team seats", text: "3 of 3 seats filled", state: "Full", tone: "warn" },
  ] },
  Settings: { intro: "Workspace identity, timezone, and security.", icon: GearSix, rows: [
    { title: "Workspace profile", text: "AILQS Demo · America/Chicago · USD", state: "Complete", tone: "ok" },
    { title: "Privacy & consent", text: "Policy URL and widget consent copy", state: "Complete", tone: "ok" },
    { title: "Security", text: "Two active sessions · last sign-in today", state: "Review", tone: "warn" },
  ] },
};

/* -------------------------------- helpers ---------------------------------- */

function timeAgoScore(temp: Temp) { return temp === "Hot" ? "text-red-400" : temp === "Warm" ? "text-amber-400" : "text-blue-300"; }

function TempBadge({ value }: { value: Temp }) {
  const map: Record<Temp, string> = {
    Hot: "bg-red-500/15 text-red-400 border-red-500/30",
    Warm: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Cold: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${map[value]}`}>{value === "Hot" && <Fire weight="fill" className="text-[11px]" />}{value}</span>;
}

function ScoreRing({ value, size = 88, stroke = 7, color = "#22c55e", label }: { value: number; size?: number; stroke?: number; color?: string; label?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, value / 100);
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct)} style={{ filter: `drop-shadow(0 0 6px ${color}90)`, transition: "stroke-dashoffset 600ms ease-out" }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-white">{value}</span>
        {label && <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>}
      </div>
    </div>
  );
}

function MiniArea({ points, color = "#3b82f6", height = 52 }: { points: number[]; color?: string; height?: number }) {
  const w = 168, max = Math.max(...points), min = Math.min(...points), range = max - min || 1, step = w / (points.length - 1);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(height - ((p - min) / range) * (height - 10) - 5).toFixed(1)}`).join(" ");
  const gid = `g${color.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.35" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={`${path} L ${w} ${height} L 0 ${height} Z`} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

const statChipMap: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400", emerald: "bg-emerald-500/10 text-emerald-400", orange: "bg-orange-500/10 text-orange-400",
  violet: "bg-violet-500/10 text-violet-400", cyan: "bg-cyan-500/10 text-cyan-400", amber: "bg-amber-500/10 text-amber-400",
};

function StatCard({ label, value, icon: Icon, color, trend, trendValue }: { label: string; value: string; icon: typeof Fire; color: string; trend: "up" | "down"; trendValue: string }) {
  const TrendIcon = trend === "up" ? TrendUp : TrendDown;
  const trendColor = trend === "up" ? "text-emerald-400" : "text-red-400";
  const [chipBg, chipText] = statChipMap[color].split(" ");
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        <div className={`grid h-8 w-8 place-items-center rounded-lg ${chipBg}`}><Icon weight="bold" className={`text-[16px] ${chipText}`} /></div>
      </div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
      <div className={`mt-1.5 flex items-center gap-1 text-[11px] font-semibold ${trendColor}`}><TrendIcon weight="bold" className="text-[12px]" />{trendValue}<span className="font-normal text-slate-500"> vs last period</span></div>
    </div>
  );
}

function priorityAction(lead: Lead): { label: string; glow: string; classes: string } {
  if (lead.temp === "Hot" && lead.followup === "Overdue") return { label: "Call now", glow: "shadow-[0_0_20px_rgba(239,68,68,0.35)]", classes: "bg-red-600 hover:bg-red-500 text-white" };
  if (lead.temp === "Hot") return { label: "Call now", glow: "shadow-[0_0_20px_rgba(249,115,22,0.3)]", classes: "bg-orange-500 hover:bg-orange-600 text-white" };
  if (lead.temp === "Warm") return { label: "Follow up", glow: "shadow-[0_0_16px_rgba(245,158,11,0.25)]", classes: "bg-amber-500 hover:bg-amber-400 text-slate-950" };
  return { label: "Nurture", glow: "", classes: "bg-slate-800 hover:bg-slate-700 text-slate-200" };
}

/* --------------------------------- pieces ---------------------------------- */

function LeadCard({ lead, onOpen }: { lead: Lead; onOpen: (l: Lead) => void }) {
  const action = priorityAction(lead);
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <div className={`relative h-24 bg-gradient-to-br ${tintMap[lead.tint]} via-slate-900 to-slate-900`}>
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <TempBadge value={lead.temp} />
          {lead.followup === "Overdue" && <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300 ring-1 ring-inset ring-red-400/30"><Warning weight="fill" className="text-[10px]" />Overdue</span>}
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[10px] font-bold text-white ring-1 ring-white/15 backdrop-blur-md"><Sparkle weight="fill" className="text-[11px] text-sky-300" />{lead.score}</div>
        <button onClick={() => onOpen(lead)} className="absolute inset-x-3 bottom-3 flex items-center gap-2.5 text-left">
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold ${tintTextMap[lead.tint]}`}>{lead.initials}</span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-bold text-white drop-shadow-sm">{lead.name}</span>
            <span className="block truncate text-[10px] text-slate-300 drop-shadow-sm">{lead.company}</span>
          </span>
        </button>
      </div>
      <div className="space-y-2.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-slate-300">{lead.interest}</span>
          <span className="shrink-0 text-[10px] text-slate-500">{lead.received}</span>
        </div>
        <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-400"><Sparkle weight="fill" className="mt-0.5 shrink-0 text-[11px] text-sky-400" />{lead.summary}</p>
        <div className="flex items-center justify-between border-t border-slate-800 pt-2.5 text-[10px] text-slate-500">
          <span>{lead.owner === "Unassigned" ? <span className="text-amber-400">Unassigned</span> : lead.owner}</span>
          <span className={lead.followup === "Overdue" ? "font-semibold text-red-400" : ""}>{lead.followup}</span>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={() => onOpen(lead)} className={`flex-[1_1_70%] rounded-full py-2 text-[12px] font-bold transition-colors ${action.classes} ${action.glow}`}>{action.label}</button>
          <button onClick={() => onOpen(lead)} className="flex-1 rounded-full border border-white/10 bg-white/[0.04] py-2 text-[12px] font-semibold text-slate-300 hover:bg-white/[0.08]">Details</button>
        </div>
      </div>
    </div>
  );
}

function MissionBanner({ onOpenLead }: { onOpenLead: (l: Lead) => void }) {
  const hotCount = leads.filter(l => l.temp === "Hot").length;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/50 via-slate-950 to-slate-950 p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-400">Good morning, Arjun</span>
          <h1 className="mt-1.5 max-w-xl text-2xl font-bold leading-snug text-white sm:text-3xl">You're <span className="text-orange-400">{hotCount} hot leads</span> away from this week's qualification target.</h1>
          <p className="mt-2 max-w-lg text-[12px] text-slate-400">Auto-triage is live across three sites. Clear the overdue call first — it's the highest-value action on the desk right now.</p>
        </div>
        <div className="flex items-center gap-5 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <ScoreRing value={78} color="#22c55e" label="Mission" />
          <div className="text-[11px] text-slate-400">
            <div className="font-semibold text-white">78% to target</div>
            <div className="mt-0.5">22 leads qualified this week</div>
            <div className="mt-0.5">Goal: 30 by Friday</div>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { n: 1, label: "Call Marcus Webb back", detail: "Overdue by 21 minutes", lead: leads[2] },
          { n: 2, label: "Confirm Priya's consult slot", detail: "Reply pending 22 minutes", lead: leads[1] },
          { n: 3, label: "Route Elena to an owner", detail: "Unassigned for 1 hour", lead: leads[3] },
          { n: 4, label: "Send Diego a pricing sheet", detail: "Bulk order, ready to move", lead: leads[6] },
        ].map(t => (
          <button key={t.n} onClick={() => onOpenLead(t.lead)} className="flex items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-950/40 p-4 text-left transition-colors hover:border-slate-700 hover:bg-slate-900/60">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-500/15 text-[11px] font-bold text-blue-300">{t.n}</span>
            <span className="min-w-0"><span className="block text-[12px] font-semibold text-white">{t.label}</span><span className="mt-0.5 block text-[10px] text-slate-500">{t.detail}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PriorityRow() {
  const groups: { emoji: string; label: string; count: number; color: string }[] = [
    { emoji: "🔥", label: "Call now", count: leads.filter(l => l.temp === "Hot" && l.followup === "Overdue").length, color: "text-red-400" },
    { emoji: "🟠", label: "Hot", count: leads.filter(l => l.temp === "Hot").length, color: "text-orange-400" },
    { emoji: "🟡", label: "Warm", count: leads.filter(l => l.temp === "Warm").length, color: "text-amber-400" },
    { emoji: "🔵", label: "Cold", count: leads.filter(l => l.temp === "Cold").length, color: "text-blue-300" },
    { emoji: "🟣", label: "Unassigned", count: leads.filter(l => l.owner === "Unassigned").length, color: "text-violet-300" },
    { emoji: "🟢", label: "Qualified", count: leads.filter(l => l.status === "Qualified").length, color: "text-emerald-400" },
    { emoji: "⚪", label: "New today", count: leads.filter(l => l.status === "New").length, color: "text-slate-300" },
    { emoji: "🔴", label: "Overdue", count: leads.filter(l => l.followup === "Overdue").length, color: "text-red-400" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {groups.map(g => (
        <div key={g.label} className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 text-center">
          <div className="text-lg">{g.emoji}</div>
          <div className={`mt-1 text-xl font-bold ${g.color}`}>{g.count}</div>
          <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">{g.label}</div>
        </div>
      ))}
    </div>
  );
}

function PanelCard({ title, tone, children }: { title: string; tone?: "warn" | "info"; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-white">{title}</h3>
        {tone === "warn" && <span className="h-1.5 w-1.5 rounded-full bg-red-400" />}
        {tone === "info" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />}
      </div>
      {children}
    </div>
  );
}

function Dashboard({ onOpenLead, notify }: { onOpenLead: (l: Lead) => void; notify: (v: string) => void }) {
  const board = leads.slice(0, 4);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-white">Command Desk</h1><p className="mt-0.5 text-[12px] text-slate-500">Everything that needs your attention across three websites.</p></div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-[12px] font-medium text-slate-200 hover:bg-slate-800"><CalendarBlank className="text-[14px] text-slate-400" />Last 30 days</button>
          <button onClick={() => notify("Report exported")} className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-[12px] font-medium text-slate-200 hover:bg-slate-800"><DownloadSimple className="text-[14px] text-slate-400" />Export</button>
        </div>
      </div>

      <MissionBanner onOpenLead={onOpenLead} />
      <PriorityRow />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="New leads" value="428" icon={Target} color="blue" trend="up" trendValue="+12.4%" />
        <StatCard label="Qualified" value="267" icon={CheckCircle} color="emerald" trend="up" trendValue="+8.7%" />
        <StatCard label="Hot leads" value="74" icon={Fire} color="orange" trend="up" trendValue="+16.2%" />
        <StatCard label="Conversion" value="11.1%" icon={ChartLineUp} color="violet" trend="up" trendValue="+2.3%" />
        <StatCard label="Median response" value="9m" icon={Clock} color="cyan" trend="down" trendValue="-3m" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PanelCard title="Response-time pulse" tone="info"><MiniArea points={[14, 13, 12, 11, 10, 9, 9]} color="#3b82f6" /><p className="mt-2 text-[10px] text-slate-500">Median first-reply time, trending down all week.</p></PanelCard>
        <PanelCard title="Top opportunities"><div className="space-y-2">{leads.filter(l => l.temp === "Hot").slice(0, 3).map(l => <button key={l.id} onClick={() => onOpenLead(l)} className="flex w-full items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2 text-left hover:bg-slate-800/60"><span className="text-[11px] font-medium text-slate-200">{l.name}</span><span className="text-[11px] font-bold text-orange-400">{l.score}</span></button>)}</div></PanelCard>
        <PanelCard title="Critical alerts" tone="warn"><div className="space-y-2">
          <div className="flex items-start gap-2 rounded-lg bg-red-500/10 px-3 py-2"><Warning weight="fill" className="mt-0.5 text-[13px] text-red-400" /><span className="text-[11px] text-red-200">Marcus Webb's callback is 21 minutes overdue</span></div>
          <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2"><Warning weight="fill" className="mt-0.5 text-[13px] text-amber-400" /><span className="text-[11px] text-amber-200">2 webhook deliveries failed on the sales integration</span></div>
        </div></PanelCard>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-white">Daily action board</h3>
          <span className="text-[11px] text-slate-500">{board.length} leads need a move today</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{board.map(l => <LeadCard key={l.id} lead={l} onOpen={onOpenLead} />)}</div>
      </div>
    </div>
  );
}

function LeadsPage({ onOpenLead, notify }: { onOpenLead: (l: Lead) => void; notify: (v: string) => void }) {
  const [filter, setFilter] = useState<"All" | Temp>("All");
  const [query, setQuery] = useState("");
  const filtered = leads.filter(l => (filter === "All" || l.temp === filter) && `${l.name} ${l.company} ${l.interest}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-2.5"><h1 className="text-2xl font-bold text-white">Lead Pipeline</h1><span className="text-[12px] text-slate-500">1,860 total leads</span></div>
        <div className="flex items-center gap-2">
          <button onClick={() => notify("CSV export is preparing")} className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3.5 py-2 text-[12px] font-medium text-slate-200 hover:bg-slate-800"><DownloadSimple className="text-[14px]" />Export CSV</button>
          <button onClick={() => notify("Add lead form opened")} className="flex items-center gap-1.5 rounded-md bg-orange-500 px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600"><Plus className="text-[14px]" />Add lead</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New inbound" value="14" icon={EnvelopeSimple} color="blue" trend="up" trendValue="+8 today" />
        <div className="relative overflow-hidden rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-950/40 via-slate-950 to-slate-950 p-5">
          <div className="flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-wider text-orange-300/80">High intent · Hot</span><div className="grid h-8 w-8 place-items-center rounded-lg bg-orange-500/20"><Fire weight="fill" className="text-[16px] text-orange-400" /></div></div>
          <div className="mt-2 flex items-center gap-2"><span className="text-2xl font-bold text-white">{leads.filter(l => l.temp === "Hot").length}</span><span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">Action req.</span></div>
          <p className="mt-1.5 text-[10px] text-orange-200/60">Ready for fast handoff</p>
        </div>
        <StatCard label="Unassigned" value="1" icon={Users} color="violet" trend="down" trendValue="Routing pending" />
        <StatCard label="Follow-ups due" value="3" icon={Clock} color="amber" trend="down" trendValue="1 overdue" />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1"><MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-slate-500" /><input name="leadSearch" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by lead, company, or interest" className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 pl-9 pr-3 text-[12px] text-slate-100 placeholder:text-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
          <div className="flex items-center gap-1 rounded-full bg-slate-800 p-1">
            {(["All", "Hot", "Warm", "Cold"] as const).map(t => (
              <button key={t} aria-pressed={filter === t} onClick={() => setFilter(t)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${filter === t ? "bg-orange-500 text-white shadow-[0_2px_8px_rgba(249,115,22,0.35)]" : "text-slate-400 hover:text-slate-200"}`}>{t}<span className={`rounded-full px-1.5 text-[9px] ${filter === t ? "bg-white/20" : "bg-slate-950"}`}>{t === "All" ? leads.length : leads.filter(l => l.temp === t).length}</span></button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500"><span><b className="text-slate-200">{filtered.length}</b> leads in this view</span><span>Showing 1 to {filtered.length} of 1,860 leads</span></div>
        {filtered.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map(l => <LeadCard key={l.id} lead={l} onOpen={onOpenLead} />)}</div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center"><MagnifyingGlass className="rounded-xl bg-slate-800 p-3 text-[40px] text-orange-400" /><h2 className="text-[14px] font-semibold text-white">No leads found</h2><p className="text-[11px] text-slate-500">Try a different search or clear the active filter.</p></div>
        )}
      </div>
    </div>
  );
}

function InboxPage({ onOpenLead, notify }: { onOpenLead: (l: Lead) => void; notify: (v: string) => void }) {
  const [conversations, setConversations] = useState<InboxConversation[]>(initialInboxConversations);
  const [selectedLeadId, setSelectedLeadId] = useState(1);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"All" | "Mine" | "Unassigned" | "Handoff">("All");
  const [filterTemps, setFilterTemps] = useState<Set<Temp>>(new Set(["Hot", "Warm", "Cold"]));
  const [filterOpen, setFilterOpen] = useState(false);
  const [replyTab, setReplyTab] = useState<"visitor" | "note">("visitor");
  const [draft, setDraft] = useState("");
  const [quickRepliesOpen, setQuickRepliesOpen] = useState(false);
  const nextMsgId = useRef(300);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const quickRepliesRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const selectedConversationForScroll = conversations.find(c => c.leadId === selectedLeadId) ?? conversations[0];
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [selectedLeadId, selectedConversationForScroll.messages.length]);

  useEffect(() => {
    if (!filterOpen && !quickRepliesOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (filterOpen && !filterRef.current?.contains(event.target as Node)) setFilterOpen(false);
      if (quickRepliesOpen && !quickRepliesRef.current?.contains(event.target as Node)) setQuickRepliesOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setFilterOpen(false); setQuickRepliesOpen(false); } };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", closeOnOutsideClick); document.removeEventListener("keydown", closeOnEscape); };
  }, [filterOpen, quickRepliesOpen]);

  const conversationLeads = conversations.map(c => ({ conversation: c, lead: leads.find(l => l.id === c.leadId)! }));
  const filtered = conversationLeads.filter(({ conversation, lead }) => {
    if (filterTab === "Mine" && lead.owner !== "You") return false;
    if (filterTab === "Unassigned" && lead.owner !== "Unassigned") return false;
    if (filterTab === "Handoff" && !conversation.needsHandoff) return false;
    if (!filterTemps.has(lead.temp)) return false;
    if (!search.trim()) return true;
    const lastMessage = conversation.messages[conversation.messages.length - 1]?.text ?? "";
    return [lead.name, lead.company, lastMessage].join(" ").toLowerCase().includes(search.trim().toLowerCase());
  });

  const selectedConversation = conversations.find(c => c.leadId === selectedLeadId) ?? conversations[0];
  const selectedLead = leads.find(l => l.id === selectedConversation.leadId)!;

  const mineCount = conversationLeads.filter(c => c.lead.owner === "You").length;
  const unassignedCount = conversationLeads.filter(c => c.lead.owner === "Unassigned").length;
  const handoffCount = conversationLeads.filter(c => c.conversation.needsHandoff).length;

  function updateSelected(mutate: (c: InboxConversation) => InboxConversation) {
    setConversations(current => current.map(c => (c.leadId === selectedLeadId ? mutate(c) : c)));
  }
  function takeOverChat() {
    updateSelected(c => ({ ...c, status: "You're handling this chat", liveOn: null }));
    notify(`You took over the chat with ${selectedLead.name}`);
  }
  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    if (replyTab === "visitor") { updateSelected(c => ({ ...c, messages: [...c.messages, { id: nextMsgId.current++, from: "agent", author: "Arjun Kumar", time, text }] })); notify("Reply sent"); }
    else { updateSelected(c => ({ ...c, messages: [...c.messages, { id: nextMsgId.current++, from: "note", author: "Arjun Kumar", time, text }] })); notify("Internal note added"); }
    setDraft("");
  }
  function toggleTempFilter(temp: Temp) {
    setFilterTemps(current => { const next = new Set(current); if (next.has(temp)) next.delete(temp); else next.add(temp); return next; });
  }

  const filterTabs: { key: "All" | "Mine" | "Unassigned" | "Handoff"; label: string }[] = [
    { key: "All", label: "All" }, { key: "Mine", label: `Mine (${mineCount})` },
    { key: "Unassigned", label: `Unassigned (${unassignedCount})` }, { key: "Handoff", label: `Handoff (${handoffCount})` },
  ];
  const action = priorityAction(selectedLead);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold text-white">Team Inbox</h1>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-400">{conversations.length} active sessions</span>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /><span className="text-[11px] font-semibold text-emerald-300">AI auto-triage online</span></span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-[12px] font-medium text-slate-200 hover:bg-slate-800"><Funnel className="text-[14px] text-slate-400" />View rules</button>
          <div className="relative" ref={filterRef}>
            <button onClick={() => setFilterOpen(v => !v)} aria-haspopup="dialog" aria-expanded={filterOpen} className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-medium ${filterOpen ? "bg-orange-500 text-white" : "border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"}`}><SlidersHorizontal className="text-[14px]" />Filter queue</button>
            {filterOpen && <div className="absolute right-0 top-11 z-20 w-56 rounded-xl border border-slate-800 bg-slate-900 p-3.5 shadow-2xl">
              <div className="mb-2 flex items-center justify-between"><span className="text-[11px] font-semibold text-white">Filter by temperature</span><button onClick={() => setFilterOpen(false)} aria-label="Close filters"><X className="text-[13px] text-slate-500" /></button></div>
              <div className="flex flex-col gap-2">{(["Hot", "Warm", "Cold"] as const).map(t => <label key={t} className="flex items-center gap-2 text-[12px] font-medium text-slate-300"><input type="checkbox" checked={filterTemps.has(t)} onChange={() => toggleTempFilter(t)} className="accent-orange-500" />{t}</label>)}</div>
            </div>}
          </div>
        </div>
      </div>

      <div className="grid h-[calc(100vh-230px)] min-h-[560px] grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 lg:col-span-3">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-3.5 py-3">
            <div className="flex items-center gap-2"><span className="text-[13px] font-bold text-white">Conversations</span><em className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-bold not-italic text-orange-300">{conversations.length}</em></div>
            <button onClick={() => notify("Conversations refreshed")} aria-label="Refresh conversations" className="grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-slate-800 hover:text-white"><ArrowClockwise className="text-[14px]" /></button>
          </div>
          <div className="shrink-0 px-3 pt-3">
            <label className="relative block"><MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-500" /><input name="conversationSearch" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..." className="h-9 w-full rounded-md border border-slate-800 bg-slate-950 pl-8 pr-3 text-[11px] text-slate-200 placeholder:text-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
            <div className="mt-2.5 flex items-center gap-1 rounded-full bg-slate-800 p-1">{filterTabs.map(t => <button key={t.key} onClick={() => setFilterTab(t.key)} className={`flex-1 rounded-full px-1.5 py-1.5 text-center text-[10px] font-semibold transition-colors ${filterTab === t.key ? "bg-orange-500 text-white" : "text-slate-400 hover:text-slate-200"}`}>{t.label}</button>)}</div>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto p-2.5">
            {filtered.length === 0 && <p className="py-8 text-center text-[11px] text-slate-500">No conversations match these filters.</p>}
            {filtered.map(({ conversation, lead }) => {
              const active = lead.id === selectedLeadId;
              const visible = conversation.messages.filter(m => m.from !== "note");
              const last = visible[visible.length - 1];
              return <button key={lead.id} onClick={() => setSelectedLeadId(lead.id)} className={`w-full rounded-lg p-2.5 text-left transition-colors ${active ? "bg-orange-500/10 ring-1 ring-inset ring-orange-500/40" : "hover:bg-slate-800/60"}`}>
                <div className="mb-1 flex items-start justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5">{conversation.liveOn && <i className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />}<b className="truncate text-[11px] font-bold text-white">{lead.name}</b><small className="truncate text-[10px] text-slate-500">{lead.company}</small></span>
                  <span className="shrink-0 text-[9px] text-slate-500">{conversation.previewTime}</span>
                </div>
                <p className="mb-2 truncate text-[10px] text-slate-500">{last?.text}</p>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><TempBadge value={lead.temp} /><b className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-slate-300">{lead.score}</b></span><span className="text-[9px] font-medium text-slate-500">{lead.owner === "Unassigned" ? <span className="text-amber-400">Unassigned</span> : conversation.status}</span></div>
              </button>;
            })}
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 lg:col-span-6">
          <div className="flex min-h-[64px] shrink-0 items-center justify-between border-b border-slate-800 px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold ${tintTextMap[selectedLead.tint]}`}>{selectedLead.initials}</span>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5 truncate"><b className="truncate text-[13px] text-white">{selectedLead.name}</b><small className="truncate text-[10px] text-slate-500">· {selectedLead.company}</small></div>
                <div className="mt-0.5 flex items-center gap-2">{selectedConversation.liveOn ? <span className="flex items-center gap-1.5 rounded-full bg-orange-500/15 px-2 py-0.5 text-[9px] font-bold text-orange-300"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />Live on {selectedConversation.liveOn}</span> : <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-semibold text-slate-400">{selectedConversation.status}</span>}<small className="text-[9px] text-slate-500">{selectedConversation.ip} · {selectedConversation.browser}</small></div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1.5 text-[10px] font-semibold text-slate-300 sm:flex"><span className="grid h-5 w-5 place-items-center rounded-full bg-orange-500/20 text-[8px] font-bold text-orange-300">AK</span>Arjun Kumar</span>
              <button onClick={takeOverChat} className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-slate-800"><ArrowsLeftRight className="text-[13px]" />Take over chat</button>
            </div>
          </div>

          <div ref={messagesRef} className="flex-1 space-y-3.5 overflow-y-auto bg-slate-950/60 p-4">
            <div className="flex justify-center"><span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[9px] text-slate-500">Session started today via widget</span></div>
            {selectedConversation.messages.map(m => {
              if (m.from === "note") return <div key={m.id} className="mx-auto flex max-w-[90%] items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900 p-3"><Lock className="mt-0.5 shrink-0 text-[13px] text-slate-500" /><div><div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-slate-400">Internal note<span className="font-normal normal-case text-slate-600">· {m.author} · {m.time}</span></div><p className="mt-1 text-[11px] leading-relaxed text-slate-400">{m.text}</p></div></div>;
              if (m.from === "visitor") return <div key={m.id} className="flex max-w-[78%] items-start gap-2.5">
                <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[9px] font-bold ${tintTextMap[selectedLead.tint]}`}>{selectedLead.initials}</span>
                <div><div className="mb-1 flex items-center gap-1.5 text-[9px] text-slate-500"><b className="text-[10px] font-semibold text-slate-300">{m.author}</b>{m.time}</div><div className="rounded-2xl rounded-tl-sm bg-slate-800 px-3.5 py-2.5 text-[11px] leading-relaxed text-slate-200">{m.text}</div></div>
              </div>;
              return <div key={m.id} className="ml-auto flex max-w-[78%] flex-row-reverse items-start gap-2.5">
                <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-white ${m.from === "ai" ? "bg-orange-500/70" : "bg-slate-700"}`}>{m.from === "ai" ? <Sparkle weight="fill" className="text-[12px]" /> : <span className="text-[9px] font-bold">AK</span>}</span>
                <div><div className="mb-1 flex flex-row-reverse items-center gap-1.5 text-[9px] text-slate-500">{m.time}<b className="text-[10px] font-semibold text-orange-300">{m.author}</b></div>
                  <div className={`rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[11px] leading-relaxed ${m.from === "ai" ? "border border-orange-500/25 bg-orange-500/10 text-orange-50" : "bg-orange-500 text-white"}`}>
                    <p>{m.text}</p>
                    {m.sources && <p className="mt-1.5 flex items-center gap-1.5 border-t border-white/10 pt-1.5 text-[9px] opacity-80"><Sparkle className="text-[11px]" />{m.sources}</p>}
                  </div>
                </div>
              </div>;
            })}
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 border-t border-slate-800 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 rounded-full bg-slate-800 p-1">
                <button onClick={() => setReplyTab("visitor")} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${replyTab === "visitor" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-slate-200"}`}>Reply to visitor</button>
                <button onClick={() => setReplyTab("note")} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${replyTab === "note" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-slate-200"}`}>Internal note</button>
              </div>
              <small className="hidden text-[9px] text-slate-500 sm:block">Enter to send, Shift + Enter for new line</small>
            </div>
            <textarea name="inboxReplyDraft" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder={replyTab === "visitor" ? `Reply to ${selectedLead.name}...` : "Add an internal note visible only to your team..."} rows={2} className="w-full resize-none rounded-md border border-slate-800 bg-slate-950 p-2.5 text-[11px] text-slate-200 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-orange-500" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="relative" ref={quickRepliesRef}>
                  <button onClick={() => setQuickRepliesOpen(v => !v)} aria-haspopup="menu" aria-expanded={quickRepliesOpen} className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-orange-400"><Lightning className="text-[15px]" /></button>
                  {quickRepliesOpen && <div role="menu" className="absolute bottom-10 left-0 z-20 w-72 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl">{inboxQuickReplies.map(r => <button key={r} role="menuitem" onClick={() => { setDraft(r); setQuickRepliesOpen(false); }} className="block w-full rounded-lg px-2.5 py-2 text-left text-[11px] leading-snug text-slate-300 hover:bg-slate-800">{r}</button>)}</div>}
                </div>
                <button onClick={() => notify("Attachment picker opened")} aria-label="Attach file" className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white"><Paperclip className="text-[15px]" /></button>
                <button onClick={() => setDraft(cur => `${cur}🙂`)} aria-label="Add emoji" className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white"><Smiley className="text-[15px]" /></button>
              </div>
              <button onClick={sendMessage} className="flex items-center gap-1.5 rounded-md bg-orange-500 px-3.5 py-2 text-[11px] font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600">{replyTab === "visitor" ? "Send reply" : "Add note"}<PaperPlaneRight className="text-[13px]" /></button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-4 lg:col-span-3">
          <div className="flex items-center justify-between"><span className="text-[13px] font-bold text-white">Lead intelligence</span><span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-semibold text-slate-400">ID #LD-{8000 + selectedLead.id}</span></div>

          <div className="flex items-center gap-3.5 rounded-xl bg-slate-950/60 p-3.5">
            <ScoreRing value={selectedLead.score} size={64} color="#f97316" />
            <div className="min-w-0"><span className="block text-[9px] font-bold uppercase tracking-wide text-slate-500">Lead qualification</span><span className={`mt-0.5 flex items-center gap-1.5 text-[12px] font-bold ${selectedLead.temp === "Hot" ? "text-red-400" : selectedLead.temp === "Warm" ? "text-amber-400" : "text-blue-300"}`}>{selectedLead.temp === "Hot" && <Fire weight="fill" className="text-[12px]" />}{selectedLead.temp} lead · {selectedLead.temp === "Hot" ? "Immediate priority" : selectedLead.temp === "Warm" ? "Active nurture" : "Long-term nurture"}</span><small className="mt-1 block text-[9px] text-slate-500">Autonomous score updated 2m ago</small></div>
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-950/30 p-3.5">
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-blue-300"><Brain weight="fill" className="text-[13px]" />AI executive summary</div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-300">{selectedConversation.aiSummary}</p>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Captured details</span>
            <div className="grid grid-cols-2 gap-2">{selectedConversation.capturedDetails.map(d => <div key={d.label} className={`rounded-lg bg-slate-950/60 p-2 ${d.span2 ? "col-span-2" : ""}`}><span className="block text-[9px] text-slate-500">{d.label}</span><span className={`block truncate text-[11px] font-semibold ${d.danger ? "text-red-400" : "text-white"}`}>{d.value}</span></div>)}</div>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Scoring breakdown</span>
            <div className="space-y-1.5">{selectedConversation.scoringBreakdown.map(s => <div key={s.label} className={`flex items-center justify-between rounded-lg bg-slate-950/60 p-2 text-[10px] ${s.done ? "" : "opacity-50"}`}><span className={`flex items-center gap-1.5 ${s.done ? "text-emerald-400" : "text-slate-500"}`}>{s.done ? <CheckCircle weight="fill" className="text-[13px]" /> : <Circle className="text-[13px]" />}<span className="text-slate-200">{s.label}</span></span><b className={`font-bold ${s.done ? "text-emerald-400" : "text-slate-500"}`}>+{s.points} pts</b></div>)}</div>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">AI signals</span>
            <div className="flex flex-wrap gap-1.5">{selectedConversation.aiSignals.map(s => <span key={s.text} className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${s.kind === "warning" ? "bg-amber-500/15 text-amber-300" : "bg-slate-800 text-slate-300"}`}>{s.kind === "warning" ? <Warning className="text-[12px]" /> : <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}{s.text}</span>)}</div>
          </div>

          <div className={`rounded-xl p-3.5 ${action.classes.includes("red") ? "bg-red-500/10" : "bg-orange-500/10"}`}>
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-orange-300"><Lightning weight="fill" className="text-[13px]" />Next best action</div>
            <p className="mt-1.5 text-[11px] font-semibold text-white">{selectedConversation.nextBestAction}</p>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button onClick={() => notify(`Follow-up scheduled for ${selectedLead.name}`)} className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-[11px] font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600"><CalendarCheck className="text-[14px]" />Schedule follow-up</button>
            <button onClick={() => onOpenLead(selectedLead)} className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] font-semibold text-slate-200 hover:bg-slate-800">Open lead profile<ArrowSquareOut className="text-[13px]" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FollowUpCard({ task, compact, expanded, onToggleExpand, menuOpen, onToggleMenu, onMarkComplete, onPrimaryAction, onSnooze, onDelete }: {
  task: FollowUpTask; compact: boolean; expanded: boolean; onToggleExpand: () => void;
  menuOpen: boolean; onToggleMenu: () => void; onMarkComplete: () => void; onPrimaryAction: () => void; onSnooze: () => void; onDelete: () => void;
}) {
  const meta = followUpTypeMeta[task.type];
  const overdue = Boolean(task.overdueLabel);
  const tempTone = task.temp === "Hot" ? "bg-red-500/15 text-red-400" : task.temp === "Warm" ? "bg-amber-500/15 text-amber-400" : "";
  const priorityTone = task.priority === "High" ? "bg-red-500/15 text-red-400" : task.priority === "Medium" ? "bg-orange-500/15 text-orange-400" : "bg-slate-800 text-slate-400";

  if (compact && !expanded) {
    return (
      <button onClick={onToggleExpand} className={`flex items-center justify-between gap-4 rounded-xl border bg-slate-900 p-3.5 text-left transition-colors hover:bg-slate-800/60 ${overdue ? "border-red-500/30" : "border-slate-800"}`}>
        <div className="flex min-w-0 items-center gap-3">
          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${meta.tile}`}><meta.icon className="text-[16px]" /></div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-[13px] font-semibold text-white">{task.title}</span>
              <span className="truncate text-[10px] text-slate-500">{task.company}</span>
              {tempTone && <span className={`hidden shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold sm:inline-flex ${tempTone}`}>{task.temp} · {task.score}</span>}
            </div>
            <p className="truncate text-[10px] text-slate-500">{task.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden flex-col text-right sm:flex"><span className="text-[11px] font-semibold text-white">{task.time}</span><span className="text-[9px] text-slate-500">{task.ownerName}</span></div>
          <CaretRight className="text-[14px] text-slate-600" />
        </div>
      </button>
    );
  }

  return (
    <div className={`flex flex-col gap-3 rounded-xl border p-3.5 ${overdue ? "border-red-500/25 bg-gradient-to-r from-red-500/10 via-slate-900 to-slate-900" : "border-slate-800 bg-slate-900"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${overdue ? "bg-red-500/15 text-red-400" : meta.tile}`}><meta.icon className="text-[16px]" /></div>
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-semibold text-white">{task.title}</span>
              <span className="text-[11px] text-slate-500">{task.company}</span>
              {tempTone && <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${tempTone}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{task.temp} · {task.score}</span>}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">{task.description}</p>
          </div>
        </div>
        <div className="relative flex shrink-0 items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${overdue ? "bg-red-500 text-white" : "bg-slate-800 text-slate-200"}`}><Clock className="text-[12px]" />{task.time}{overdue ? ` (${task.overdueLabel})` : ""}</span>
          <button onClick={onToggleMenu} aria-label="More options" className="rounded-md p-1 text-slate-500 hover:bg-slate-800 hover:text-white"><DotsThree weight="bold" className="text-[16px]" /></button>
          {menuOpen && <div className="absolute right-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-2xl">
            <button onClick={onSnooze} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[11px] text-slate-200 hover:bg-slate-800"><Clock className="text-[13px]" />Snooze to tomorrow</button>
            <button onClick={onDelete} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[11px] text-red-400 hover:bg-red-500/10"><Trash className="text-[13px]" />Delete</button>
          </div>}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5"><span className="grid h-6 w-6 place-items-center rounded-full bg-orange-500/15 text-[9px] font-bold text-orange-300">{task.ownerInitials}</span><span className="text-[10px] font-medium text-slate-300">{task.ownerName}</span></div>
          <span className="text-slate-700">·</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityTone}`}>{task.priority} priority</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onMarkComplete} className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-200 hover:bg-slate-700"><CheckCircle className="text-[13px] text-emerald-400" />Mark complete</button>
          <button onClick={onPrimaryAction} className="inline-flex items-center gap-1.5 rounded-md bg-orange-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-[0_2px_10px_rgba(249,115,22,0.3)] hover:bg-orange-600"><meta.actionIcon className="text-[13px]" />{meta.actionLabel}</button>
          {compact && <button onClick={onToggleExpand} className="rounded-md px-2 py-1 text-[10px] font-semibold text-slate-500 hover:text-white">Collapse</button>}
        </div>
      </div>
    </div>
  );
}

function FollowUpsPage({ notify }: { notify: (v: string) => void }) {
  const [tasks, setTasks] = useState<FollowUpTask[]>(initialFollowUps);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filterTab, setFilterTab] = useState<"today" | "upcoming" | "overdue" | "completed">("today");
  const [repFilter, setRepFilter] = useState("All reps");
  const [typeFilter, setTypeFilter] = useState<"All types" | FollowUpType>("All types");
  const [priorityFilter, setPriorityFilter] = useState<"All priorities" | FollowUpPriority>("All priorities");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const [formLeadName, setFormLeadName] = useState("Jonas Whitfield");
  const [formLeadCompany, setFormLeadCompany] = useState("Meridian Robotics");
  const [formType, setFormType] = useState<FollowUpType>("call");
  const [formTime, setFormTime] = useState("10:30 AM");
  const [formOwner, setFormOwner] = useState("Maya Chen");
  const [formPriority, setFormPriority] = useState<FollowUpPriority>("High");
  const [formReminders, setFormReminders] = useState({ slack: true, email: true, whatsapp: false });
  const [formNotes, setFormNotes] = useState("");

  const activeTasks = tasks.filter(t => !t.completed);
  const counts = {
    today: activeTasks.filter(t => t.group === "Today").length,
    upcoming: activeTasks.filter(t => t.group !== "Today").length,
    overdue: activeTasks.filter(t => t.overdueLabel).length,
    completed: tasks.filter(t => t.completed).length,
  };

  let filtered: FollowUpTask[];
  if (view === "calendar" && selectedDay !== null) {
    filtered = (filterTab === "completed" ? tasks.filter(t => t.completed) : activeTasks).filter(t => t.day === selectedDay);
  } else {
    filtered = filterTab === "completed" ? tasks.filter(t => t.completed)
      : filterTab === "overdue" ? activeTasks.filter(t => t.overdueLabel)
      : filterTab === "today" ? activeTasks.filter(t => t.group === "Today")
      : activeTasks.filter(t => t.group !== "Today");
  }
  if (repFilter !== "All reps") filtered = filtered.filter(t => t.ownerName === repFilter);
  if (typeFilter !== "All types") filtered = filtered.filter(t => t.type === typeFilter);
  if (priorityFilter !== "All priorities") filtered = filtered.filter(t => t.priority === priorityFilter);
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(t => `${t.title} ${t.company} ${t.description}`.toLowerCase().includes(q));
  }

  const groups: Record<FollowUpGroupKey, FollowUpTask[]> = { Today: [], Tomorrow: [], Later: [] };
  filtered.forEach(t => groups[t.group].push(t));

  const tasksByDay = new Map<number, number>();
  activeTasks.forEach(t => tasksByDay.set(t.day, (tasksByDay.get(t.day) ?? 0) + 1));

  function markComplete(id: number) { setTasks(cur => cur.map(t => t.id === id ? { ...t, completed: true } : t)); notify("Marked as complete"); setMenuOpenId(null); }
  function snooze(id: number) { setTasks(cur => cur.map(t => t.id === id ? { ...t, overdueLabel: undefined, time: "Tomorrow, 9:00 AM", group: "Tomorrow" as FollowUpGroupKey, day: t.day + 1 } : t)); notify("Follow-up snoozed to tomorrow"); setMenuOpenId(null); }
  function removeTask(id: number) { setTasks(cur => cur.filter(t => t.id !== id)); notify("Follow-up deleted"); setMenuOpenId(null); }
  function runPrimaryAction(task: FollowUpTask) { notify(`${followUpTypeMeta[task.type].actionLabel}: ${task.title}`); }

  function createTask() {
    if (!formLeadName.trim()) { notify("Add a lead name before creating a task"); return; }
    const newTask: FollowUpTask = {
      id: followUpIdCounter++, type: formType, title: `${followUpTypeMeta[formType].label} with ${formLeadName.trim()}`, company: formLeadCompany.trim() || "—",
      description: formNotes.trim() || "New scheduled touchpoint",
      group: "Today", day: TODAY_DAY, time: formTime,
      ownerName: formOwner, ownerInitials: formOwner.split(" ").map(p => p[0]).join("").toUpperCase(),
      priority: formPriority, completed: false,
    };
    setTasks(cur => [newTask, ...cur]);
    notify("Follow-up created");
    setFormNotes("");
    setFilterTab("today");
    setView("list");
  }

  const completionRate = Math.min(78 + counts.completed * 3, 100);
  const monthGrid = buildMonthGrid(2026, 8);
  const groupOrder: { key: FollowUpGroupKey; label: string }[] = [
    { key: "Today", label: "Today" }, { key: "Tomorrow", label: "Tomorrow" }, { key: "Later", label: "Later this month" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2.5"><h1 className="text-2xl font-bold text-white">Follow-ups</h1><span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-orange-400" />Autonomous SLA triage</span></div>
          <p className="mt-0.5 text-[12px] text-slate-500">Manage scheduled touchpoints, inbound outreach, and commitments for the desk.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-full bg-slate-800 p-1">
            <button onClick={() => setView("list")} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors ${view === "list" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-slate-200"}`}><ListBullets className="text-[14px]" />List view</button>
            <button onClick={() => setView("calendar")} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors ${view === "calendar" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-slate-200"}`}><CalendarBlank className="text-[14px]" />Calendar</button>
          </div>
          <label className="relative hidden sm:block"><MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-500" /><input name="followUpSearch" value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter touchpoints..." className="h-9 w-48 rounded-md border border-slate-800 bg-slate-900 pl-8 pr-3 text-[11px] text-slate-200 placeholder:text-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-orange-500 lg:w-56" /></label>
          <button onClick={() => setDrawerOpen(true)} className="inline-flex items-center gap-1.5 rounded-md bg-orange-500 px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600"><Plus className="text-[15px]" />Create follow-up</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-500/15 text-orange-400"><CalendarCheck className="text-[17px]" /></div><span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold text-orange-300">Active today</span></div>
          <div>
            <div className="flex items-baseline gap-2"><span className="text-2xl font-extrabold text-white">{counts.today}</span><span className="text-[12px] font-medium text-slate-500">scheduled tasks</span></div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-2"><span className="text-[10px] text-slate-500">{counts.completed} completed so far</span><div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-orange-500" style={{ width: `${Math.min((counts.completed / 8) * 100, 100)}%` }} /></div></div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-lg bg-red-500/15 text-red-400"><Warning weight="fill" className="text-[17px]" /></div><span className="inline-flex animate-pulse items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-red-400"><Fire weight="fill" className="text-[12px]" />SLA breach</span></div>
          <div>
            <div className="flex items-baseline gap-2"><span className="text-2xl font-extrabold text-red-400">{counts.overdue}</span><span className="text-[12px] font-medium text-red-400">overdue items</span></div>
            <div className="mt-2 flex items-center justify-between border-t border-red-500/15 pt-2"><span className="text-[10px] text-slate-500">Immediate action required</span><span className="flex items-center gap-1 text-[10px] font-semibold text-red-400"><Clock className="text-[12px]" />&gt;2h delay</span></div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400"><CheckCircle weight="fill" className="text-[17px]" /></div><span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400"><TrendUp className="text-[12px]" />+4.1% vs last week</span></div>
          <div className="flex items-center justify-between">
            <div><span className="text-2xl font-extrabold text-white">{completionRate}%</span><p className="text-[10px] text-slate-500">SLA completion target met</p></div>
            <ScoreRing value={completionRate} size={48} stroke={5} color="#34d399" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {([["today", "Today", counts.today], ["upcoming", "Upcoming", counts.upcoming], ["overdue", "Overdue", counts.overdue], ["completed", "Completed", counts.completed]] as const).map(([key, label, count]) => (
            <button key={key} onClick={() => setFilterTab(key)} className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors ${filterTab === key ? (key === "overdue" ? "bg-red-500 text-white" : "bg-orange-500 text-white") : (key === "overdue" ? "bg-red-500/10 text-red-400 hover:bg-red-500/15" : "bg-slate-800 text-slate-400 hover:text-slate-200")}`}>
              <span>{label}</span><span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${filterTab === key ? "bg-white/25" : "bg-slate-950 text-slate-400"}`}>{count}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200"><UserCircle className="text-[14px] text-slate-500" /><select name="followUpRepFilter" value={repFilter} onChange={e => setRepFilter(e.target.value)} className="bg-transparent outline-none">
            <option>All reps</option>{followUpOwners.map(o => <option key={o}>{o}</option>)}
          </select></label>
          <label className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200"><Funnel className="text-[14px] text-slate-500" /><select name="followUpTypeFilter" value={typeFilter} onChange={e => setTypeFilter(e.target.value as typeof typeFilter)} className="bg-transparent outline-none">
            <option>All types</option>{(Object.keys(followUpTypeMeta) as FollowUpType[]).map(t => <option key={t} value={t}>{followUpTypeMeta[t].label}</option>)}
          </select></label>
          <label className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200"><Flag className="text-[14px] text-slate-500" /><select name="followUpPriorityFilter" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as typeof priorityFilter)} className="bg-transparent outline-none">
            <option>All priorities</option><option>High</option><option>Medium</option><option>Normal</option>
          </select></label>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-7">
          {view === "calendar" && (
            <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center justify-between"><h2 className="text-[13px] font-semibold text-white">September 2026</h2>{selectedDay !== null && <button onClick={() => setSelectedDay(null)} className="text-[11px] font-semibold text-orange-400 hover:underline">Clear selection</button>}</div>
              <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-semibold text-slate-500">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <span key={d}>{d}</span>)}</div>
              <div className="flex flex-col gap-1">
                {monthGrid.map((week, wi) => <div key={wi} className="grid grid-cols-7 gap-1">
                  {week.map((day, di) => {
                    const count = day ? tasksByDay.get(day) ?? 0 : 0;
                    const isToday = day === TODAY_DAY;
                    const isSelected = day !== null && selectedDay === day;
                    return <button key={di} disabled={!day} onClick={() => day && setSelectedDay(cur => cur === day ? null : day)} className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] transition-colors ${!day ? "invisible" : isSelected ? "bg-orange-500 text-white" : isToday ? "bg-orange-500/15 font-bold text-orange-300 ring-1 ring-orange-500/40" : "text-slate-300 hover:bg-slate-800"}`}>
                      <span>{day}</span>{count > 0 && <span className={`h-1 w-1 rounded-full ${isSelected ? "bg-white" : "bg-orange-400"}`} />}
                    </button>;
                  })}
                </div>)}
              </div>
              <p className="text-[10px] text-slate-500">{selectedDay ? `Showing touchpoints for Sep ${selectedDay}` : "Select a day to filter touchpoints below"}</p>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
              <CheckCircle weight="duotone" className="text-[36px] text-orange-400" />
              <h2 className="text-[13px] font-semibold text-white">No touchpoints match these filters</h2>
              <p className="text-[11px] text-slate-500">Try a different tab, clear filters, or create a new follow-up.</p>
            </div>
          ) : filterTab === "overdue" || filterTab === "completed" ? (
            <div className="flex flex-col gap-3">{filtered.map(task => <FollowUpCard key={task.id} task={task} compact={false} expanded onToggleExpand={() => {}} menuOpen={menuOpenId === task.id} onToggleMenu={() => setMenuOpenId(cur => cur === task.id ? null : task.id)} onMarkComplete={() => markComplete(task.id)} onPrimaryAction={() => runPrimaryAction(task)} onSnooze={() => snooze(task.id)} onDelete={() => removeTask(task.id)} />)}</div>
          ) : (
            groupOrder.map(({ key, label }) => {
              const groupTasks = groups[key];
              if (groupTasks.length === 0) return null;
              return <div key={key} className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1"><div className="flex items-center gap-2"><span className="text-[15px] font-bold text-white">{label}</span>{key === "Today" && <span className="h-2 w-2 rounded-full bg-orange-400" />}</div><span className="text-[10px] text-slate-500">{groupTasks.length} task{groupTasks.length === 1 ? "" : "s"} scheduled</span></div>
                {groupTasks.map(task => <FollowUpCard key={task.id} task={task} compact={key !== "Today"} expanded={expandedId === task.id} onToggleExpand={() => setExpandedId(cur => cur === task.id ? null : task.id)} menuOpen={menuOpenId === task.id} onToggleMenu={() => setMenuOpenId(cur => cur === task.id ? null : task.id)} onMarkComplete={() => markComplete(task.id)} onPrimaryAction={() => runPrimaryAction(task)} onSnooze={() => snooze(task.id)} onDelete={() => removeTask(task.id)} />)}
              </div>;
            })
          )}
        </div>

        {drawerOpen && (
          <div className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl lg:sticky lg:top-4 lg:col-span-5">
            <div className="flex items-start justify-between border-b border-slate-800 bg-slate-950/60 p-4">
              <div><div className="flex items-center gap-2"><h2 className="text-[15px] font-bold text-white">Create follow-up</h2><span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[9px] font-semibold text-orange-300">New</span></div><p className="mt-0.5 text-[11px] text-slate-500">Schedule a new touchpoint with SLA commitment</p></div>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close" className="rounded-full p-1 text-slate-500 hover:bg-slate-800 hover:text-white"><X className="text-[16px]" /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); createTask(); }} className="flex max-h-[calc(100vh-16rem)] flex-col gap-3.5 overflow-y-auto p-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Target lead / account</label>
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-950/60 p-2">
                  <input name="followUpLeadName" aria-label="Lead name" value={formLeadName} onChange={e => setFormLeadName(e.target.value)} placeholder="Lead name" className="h-9 rounded-md border border-slate-800 bg-slate-900 px-2.5 text-[11px] text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" />
                  <input name="followUpLeadCompany" aria-label="Company" value={formLeadCompany} onChange={e => setFormLeadCompany(e.target.value)} placeholder="Company" className="h-9 rounded-md border border-slate-800 bg-slate-900 px-2.5 text-[11px] text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Task type</label>
                <div className="grid grid-cols-4 gap-2">{(Object.keys(followUpTypeMeta) as FollowUpType[]).map(t => { const meta = followUpTypeMeta[t]; const active = formType === t; return <button key={t} type="button" onClick={() => setFormType(t)} className={`flex flex-col items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-semibold transition-colors ${active ? "bg-orange-500 text-white shadow-[0_2px_10px_rgba(249,115,22,0.3)]" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`}><meta.icon className="text-[16px]" />{meta.label}</button>; })}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5"><span className="text-[11px] font-semibold text-slate-300">Due date</span><input name="followUpDueDate" defaultValue="Today, Sep 8, 2026" className="h-9 rounded-md border border-slate-800 bg-slate-900 px-2.5 text-[11px] font-medium text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
                <label className="flex flex-col gap-1.5"><span className="text-[11px] font-semibold text-slate-300">Time</span><input name="followUpTime" value={formTime} onChange={e => setFormTime(e.target.value)} className="h-9 rounded-md border border-slate-800 bg-slate-900 px-2.5 text-[11px] font-medium text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
              </div>
              <label className="flex flex-col gap-1.5"><span className="text-[11px] font-semibold text-slate-300">Assigned owner</span><select name="followUpOwner" value={formOwner} onChange={e => setFormOwner(e.target.value)} className="h-9 rounded-md border border-slate-800 bg-slate-900 px-2.5 text-[11px] font-medium text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500">{followUpOwners.map(o => <option key={o}>{o}</option>)}</select></label>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Priority level</label>
                <div className="grid grid-cols-3 gap-2">{(["High", "Medium", "Normal"] as FollowUpPriority[]).map(p => { const active = formPriority === p; return <button key={p} type="button" onClick={() => setFormPriority(p)} className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold transition-colors ${active ? (p === "High" ? "bg-red-500 text-white" : "bg-orange-500 text-white") : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}><span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-slate-600"}`} />{p}</button>; })}</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Reminder delivery</label>
                <div className="flex flex-col gap-2 rounded-lg bg-slate-950/60 p-3">
                  <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" name="reminderSlack" checked={formReminders.slack} onChange={e => setFormReminders(r => ({ ...r, slack: e.target.checked }))} className="h-3.5 w-3.5 accent-orange-500" /><span className="text-[11px] font-medium text-slate-300">Slack instant notification (#revenue-alerts)</span></label>
                  <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" name="reminderEmail" checked={formReminders.email} onChange={e => setFormReminders(r => ({ ...r, email: e.target.checked }))} className="h-3.5 w-3.5 accent-orange-500" /><span className="text-[11px] font-medium text-slate-300">Email digest reminder (15 min prior)</span></label>
                  <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" name="reminderWhatsapp" checked={formReminders.whatsapp} onChange={e => setFormReminders(r => ({ ...r, whatsapp: e.target.checked }))} className="h-3.5 w-3.5 accent-orange-500" /><span className="text-[11px] font-medium text-slate-300">WhatsApp direct alert to rep</span></label>
                </div>
              </div>
              <label className="flex flex-col gap-1.5"><span className="text-[11px] font-semibold text-slate-300">Touchpoint objective &amp; notes</span><textarea name="followUpNotes" value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={3} placeholder="e.g. Confirm discovery call attendees and review security questions..." className="resize-none rounded-md border border-slate-800 bg-slate-900 p-2.5 text-[11px] text-slate-200 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
            </form>
            <div className="flex items-center justify-end gap-2.5 border-t border-slate-800 bg-slate-950/60 p-3.5">
              <button onClick={() => setDrawerOpen(false)} className="rounded-md px-3.5 py-2 text-[11px] font-semibold text-slate-300 hover:bg-slate-800">Cancel</button>
              <button onClick={createTask} className="rounded-md bg-orange-500 px-4 py-2 text-[11px] font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600">Create task</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
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
    setChatTurns(cur => [...cur, { id: nextId.current++, role: "visitor", text: trimmed }, { id: nextId.current++, role: "agent", text: reply }]);
    setLeadScore(cur => Math.min(cur + 6, 100));
    setConfidence(cur => Math.min(cur + 1, 99));
    setTestHistory(cur => {
      const turnNumber = cur.length + 1;
      const relabeled = cur.map(item => item.current ? { ...item, current: false, label: `Turn ${turnNumber - 1} • Evaluated` } : item);
      return [...relabeled, { id: nextHistoryId.current++, label: `Turn ${turnNumber} • Current Turn`, confidence: Math.min(confidence + 4, 99), note: reply, current: true }];
    });
    setTestInput("");
    inputRef.current?.focus();
  }

  function resetTest() { setChatTurns(initialChatTurns); setTestInput(""); setLeadScore(68); setConfidence(92); setTestHistory(initialTestHistory); notify("Test scenario reset"); }
  function clearHistory() { setChatTurns([]); setTestHistory([]); notify("Chat history cleared"); }

  const checklist = [
    { icon: CurrencyDollar, label: "Budget: $50,000+", note: "Tier: High Fit (>= $1,200 threshold)", state: "Passed", tone: "pass" },
    { icon: Clock, label: "Timeline: Next Month (< 30d)", note: "Urgency Factor: Accelerated Kickoff", state: "Passed", tone: "pass" },
    { icon: CirclesThreePlus, label: "Service: Patient Intake & Insurance", note: "Core Offering Match • 98% confidence", state: "Core Fit", tone: "fit" },
    { icon: Envelope, label: "Next Needed: Verified Contact Email", note: "Prompt logic will request slot confirmation", state: "Queued", tone: "queued" },
  ] as const;
  const rules = [
    { text: "IF budget >= $1,200 THEN +25 pts", pts: "+25 pts" },
    { text: "IF timeline <= 30 days THEN +20 pts", pts: "+20 pts" },
    { text: 'IF service == "Patient Intake" THEN +15 pts', pts: "+15 pts" },
  ];

  return (
    <>
      <div className="flex flex-col gap-4 lg:col-span-9 xl:col-span-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /><span className="text-[11px] font-bold text-emerald-400">Sandbox Mode • Real-time Rule Execution</span></div>
          <button onClick={resetTest} className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-slate-800"><ArrowCounterClockwise className="text-[14px]" />Reset Test</button>
          <button onClick={() => notify("Test case saved")} className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-slate-800"><BookmarkSimple className="text-[14px]" />Save Test Case</button>
          <div className="ml-auto flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5">
            <SlidersHorizontal className="text-[13px] text-slate-500" /><span className="text-[10px] text-slate-500">Scenario:</span>
            <select name="testScenario" onChange={() => notify("Scenario switched")} defaultValue="High-Budget Lead Inbound" className="bg-transparent text-[11px] font-semibold text-slate-200 outline-none">
              <option>High-Budget Lead Inbound ($20K–$50K)</option><option>Enterprise Inbound (&gt; $100K)</option><option>Pricing Objection &amp; Retargeting</option><option>Off-scope Technical Inquiry</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-700" /><span className="h-2.5 w-2.5 rounded-full bg-slate-700" /><span className="h-2.5 w-2.5 rounded-full bg-slate-700" /></div>
              <div className="ml-2 flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] text-slate-300"><Lock className="text-[11px] text-emerald-400" />ailqs.com/booking</div>
            </div>
            <div className="flex items-center gap-2"><span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] text-slate-500">Referral: Google Ads (Search)</span><span className="h-2 w-2 rounded-full bg-emerald-400" /></div>
          </div>
          <div className="flex items-center justify-between bg-slate-950/30 px-4 py-2">
            <div className="flex items-center gap-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-slate-800 text-slate-400"><UserCircle className="text-[15px]" /></div>
              <div><div className="flex items-center gap-2"><span className="text-[11px] font-bold text-white">Simulated Visitor: Pulse Dental Candidate</span><span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">In-Session</span></div><span className="text-[10px] text-slate-500">Location: Houston, TX • Intent Flag: High Intent • IP Score: 0.96</span></div>
            </div>
            <button onClick={() => notify("Full-screen simulator opened")} aria-label="Toggle full-screen simulator" className="text-slate-500 hover:text-white"><ArrowsOut className="text-[15px]" /></button>
          </div>

          <div className="flex max-h-[480px] min-h-[380px] flex-col gap-3.5 overflow-y-auto bg-slate-950/40 p-4">
            <div className="flex justify-center"><span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[10px] text-slate-500">Today • Conversation Initiated via Landing Trigger (5s scroll)</span></div>
            {chatTurns.length === 0 && <p className="text-center text-[11px] text-slate-500">Chat history cleared. Send a message below to start a new turn.</p>}
            {chatTurns.map((turn, idx) => turn.role === "agent" ? (
              <div key={turn.id} className="flex max-w-[92%] items-start gap-2.5">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-500/70 text-white"><Robot weight="fill" className="text-[14px]" /></div>
                <div className="flex w-full flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-white">{agentName || "Ignition"} AI</span>
                      {idx === chatTurns.length - 1 && <><span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400"><ShieldCheck weight="fill" className="text-[10px]" />{confidence}% Confidence</span><span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] text-slate-500">v2.4 Draft</span></>}
                    </div>
                    <span className="text-[9px] text-slate-500">{turnTime(idx)}{idx === 2 ? " (Latency: 480ms)" : ""}</span>
                  </div>
                  <div className="flex flex-col gap-2.5 whitespace-pre-line rounded-2xl rounded-tl-sm border border-slate-800 bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-200">
                    {turn.text}
                    {idx === 0 && <div className="flex flex-wrap gap-1.5"><span className="flex items-center gap-1.5 rounded-full bg-orange-500/15 px-2.5 py-1 text-[10px] font-semibold text-orange-300">Selected: Book a slot ⚡<CheckCircle weight="bold" className="text-[11px]" /></span></div>}
                    {idx === 2 && <>
                      <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
                        <button onClick={() => setCitationOpen(v => !v)} className="flex items-center justify-between text-left">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-orange-300"><Sparkle weight="fill" className="text-[13px]" />Grounded via 2 Knowledge Sources</span>
                          <CaretDown className={`text-[13px] text-slate-500 transition-transform ${citationOpen ? "rotate-180" : ""}`} />
                        </button>
                        {citationOpen && <div className="flex flex-col gap-1.5 border-t border-slate-800 pt-2">
                          <div className="flex items-start gap-1.5 text-[10px] text-slate-400"><CheckCircle weight="bold" className="mt-0.5 shrink-0 text-[11px] text-emerald-400" /><span><b className="text-slate-200">Onboarding & Pricing Matrix (p. 4):</b> &ldquo;Dedicated onboarding sprints range from $20,000 to $50,000 covering insurance pre-verification with enterprise SLA.&rdquo;</span></div>
                          <div className="flex items-start gap-1.5 text-[10px] text-slate-400"><CheckCircle weight="bold" className="mt-0.5 shrink-0 text-[11px] text-emerald-400" /><span><b className="text-slate-200">Integration Spec (p. 11):</b> &ldquo;Certified API webhooks for HubSpot, Salesforce, and custom PMS triggers.&rdquo;</span></div>
                        </div>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => notify("Scoping session booked for Thursday 11:30 AM")} className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-orange-600"><CalendarBlank className="text-[12px]" />Book Thursday 11:30 AM</button>
                        <button onClick={() => notify("Other slots opened")} className="rounded-lg bg-slate-800 px-3 py-1.5 text-[10px] font-semibold text-slate-200 hover:bg-slate-700">View Other Slots</button>
                      </div>
                    </>}
                  </div>
                </div>
              </div>
            ) : (
              <div key={turn.id} className="flex max-w-[88%] flex-row-reverse items-start gap-2.5 self-end">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-700 text-white"><UserCircle weight="fill" className="text-[14px]" /></div>
                <div className="flex flex-col items-end gap-1"><span className="text-[11px] font-bold text-white">Visitor</span><div className="rounded-2xl rounded-tr-sm bg-orange-500 p-3 text-[11px] leading-relaxed text-white">{turn.text}</div></div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 border-t border-slate-800 p-3.5">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="shrink-0 text-[10px] text-slate-500">Inject scenario prompt:</span>
              {quickScenarioPrompts.map(prompt => <button key={prompt} onClick={() => { setTestInput(prompt.replace(/"/g, "")); inputRef.current?.focus(); }} className="shrink-0 rounded-full bg-slate-800 px-2.5 py-1 text-[10px] text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200">{prompt}</button>)}
            </div>
            <form onSubmit={e => { e.preventDefault(); sendTestMessage(testInput); }} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input ref={inputRef} name="visitorTestInput" value={testInput} onChange={e => setTestInput(e.target.value)} placeholder="Type a test visitor response or choose a quick prompt above..." className="h-10 w-full rounded-md border border-slate-800 bg-slate-950 pl-3.5 pr-9 text-[12px] text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" />
                <button type="button" onClick={() => notify("Voice capture is not available in this preview")} aria-label="Voice input" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><Microphone className="text-[15px]" /></button>
              </div>
              <button type="submit" className="flex h-10 shrink-0 items-center gap-1.5 rounded-md bg-orange-500 px-3.5 text-[12px] font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600">Send<PaperPlaneRight className="text-[14px]" /></button>
            </form>
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-3">
                <button onClick={() => notify("Replaying last turn")} className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-white"><ArrowClockwise className="text-[12px]" />Replay Turn</button>
                <button onClick={clearHistory} className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-red-400"><Trash className="text-[12px]" />Clear Chat History</button>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Model: Claude Sonnet + RAG Index v9</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:col-span-12 xl:col-span-4">
        <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5"><div className="flex items-center gap-1.5"><Gauge className="text-[16px] text-orange-400" /><h2 className="text-[13px] font-semibold text-white">Turn Telemetry</h2></div><span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400"><ShieldCheck weight="fill" className="text-[11px]" />Grounded {confidence}%</span></div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1 rounded-lg bg-slate-950/60 p-3">
              <div className="flex items-center justify-between"><span className="text-[9px] text-slate-500">Lead Score Shift</span><span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white">+{leadScore - 42} pts</span></div>
              <div className="mt-1 flex items-baseline gap-1.5"><span className="text-[19px] font-bold text-slate-300">42</span><ArrowRight weight="bold" className="text-[12px] text-emerald-400" /><span className="text-[23px] font-black text-orange-400">{leadScore}</span></div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400"><Fire weight="fill" className="text-[12px]" />Elevated to Hot Lead</span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-slate-950/60 p-3">
              <div className="flex items-center justify-between"><span className="text-[9px] text-slate-500">Buying Intent</span><span className="h-2 w-2 rounded-full bg-emerald-400" /></div>
              <div className="mt-1.5"><span className="block text-[13px] font-bold text-white">High (Ready)</span><span className="text-[9px] text-slate-500">&lt; 30 Days Target</span></div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-emerald-400" style={{ width: "88%" }} /></div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 rounded-lg bg-slate-950/60 p-3">
            <div className="flex items-center justify-between"><span className="text-[11px] font-semibold text-slate-200">Qualification Checklist</span><span className="text-[10px] font-bold text-orange-400">4 of 5 Verified (80%)</span></div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-orange-500" style={{ width: "80%" }} /></div>
            <div className="flex items-center justify-between text-[9px] text-slate-500"><span>Budget, timeline, and service detected</span><span className="font-medium text-red-400">Pending: Direct Email</span></div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><Database className="text-[16px] text-orange-400" /><h3 className="text-[13px] font-semibold text-white">Extracted Lead Attributes</h3></div><span className="text-[9px] text-slate-500">Parser: NER-v3</span></div>
          <div className="flex flex-col gap-1.5">{checklist.map(item => (
            <div key={item.label} className={`flex items-center justify-between rounded-lg p-2.5 ${item.tone === "queued" ? "bg-red-500/10" : "bg-slate-950/60"}`}>
              <div className="flex items-center gap-2"><item.icon weight={item.tone === "queued" ? "bold" : "regular"} className={`text-[15px] ${item.tone === "queued" ? "text-red-400" : item.tone === "fit" ? "text-orange-400" : "text-emerald-400"}`} /><div><p className={`text-[11px] font-semibold ${item.tone === "queued" ? "text-red-400" : "text-slate-200"}`}>{item.label}</p><p className="text-[9px] text-slate-500">{item.note}</p></div></div>
              <span className={`shrink-0 rounded px-2 py-0.5 text-[9px] font-bold ${item.tone === "queued" ? "bg-red-500/20 text-red-300" : item.tone === "fit" ? "bg-orange-500/15 text-orange-300" : "bg-emerald-500/15 text-emerald-400"}`}>{item.state}</span>
            </div>
          ))}</div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><ListChecks className="text-[16px] text-emerald-400" /><h3 className="text-[13px] font-semibold text-white">Rules Triggered This Turn</h3></div><span className="rounded bg-slate-800 px-2 py-0.5 text-[9px] text-slate-500">{rules.length} Rules Active</span></div>
          <div className="flex flex-col gap-1.5 font-mono text-[10px]">{rules.map(rule => <div key={rule.text} className="flex items-center justify-between rounded-lg bg-slate-950/60 p-2.5"><span className="flex items-center gap-1.5 text-slate-200"><CheckCircle weight="fill" className="text-[13px] text-emerald-400" />{rule.text}</span><span className="font-bold text-emerald-400">{rule.pts}</span></div>)}</div>
          <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[11px]"><span className="text-slate-500">Turn Velocity Applied</span><span className="text-[14px] font-bold text-orange-400">+{leadScore - 42} points adjusted</span></div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><BookOpenText className="text-[16px] text-orange-400" /><h3 className="text-[13px] font-semibold text-white">RAG Diagnostics &amp; Guardrails</h3></div><span className="font-mono text-[9px] font-bold text-emerald-400">Vector Sim: 0.94</span></div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between rounded-lg bg-slate-950/60 p-2.5"><span className="flex items-center gap-1.5 text-[11px] text-slate-200"><FileText className="text-[13px] text-orange-400" />Onboarding & Pricing Matrix.pdf</span><span className="font-mono text-[9px] text-slate-500">Chunk #12 (0.94)</span></div>
            <div className="flex items-center justify-between rounded-lg bg-slate-950/60 p-2.5"><span className="flex items-center gap-1.5 text-[11px] text-slate-200"><Code className="text-[13px] text-orange-400" />Integration & Webhook Arch.md</span><span className="font-mono text-[9px] text-slate-500">Chunk #4 (0.89)</span></div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-800 pt-2">
            <span className="flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1 text-[9px] font-semibold text-emerald-400"><ShieldCheck weight="fill" className="text-[11px]" />PII Check: Safe</span>
            <span className="flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1 text-[9px] font-semibold text-emerald-400"><Scales className="text-[11px]" />Hallucination: 0.02 (Optimal)</span>
            <span className="flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-[9px] text-slate-400"><SlidersHorizontal className="text-[11px]" />Prompt Temp: 0.2</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><ClockCounterClockwise className="text-[16px] text-slate-500" /><h3 className="text-[13px] font-semibold text-white">Test History &amp; Edge Cases</h3></div><span className="text-[10px] text-slate-500">{testHistory.length} Turns Evaluated</span></div>
          <div className="flex flex-col gap-1.5">
            {testHistory.length === 0 && <p className="text-[10px] text-slate-500">No turns evaluated yet — send a test message to begin.</p>}
            {testHistory.map(item => (
              <div key={item.id} className={`flex flex-col gap-1.5 rounded-lg p-2.5 ${item.current ? "border border-orange-500/30 bg-orange-500/10" : "bg-slate-950/60 opacity-80 transition-opacity hover:opacity-100"}`}>
                <div className="flex items-center justify-between"><span className={`text-[10px] font-bold ${item.current ? "text-orange-300" : "text-slate-200"}`}>{item.label}</span><span className={`rounded px-2 py-0.5 font-mono text-[9px] ${item.current ? "bg-emerald-500 font-bold text-white" : "bg-slate-800 text-slate-400"}`}>Conf: {item.confidence}%</span></div>
                {item.query && <p className="text-[10px] text-slate-500">Query: <em>&ldquo;{item.query}&rdquo;</em></p>}
                <p className="flex items-start gap-1.5 text-[10px] text-slate-400"><Info className="mt-0.5 shrink-0 text-[12px] text-orange-400" />{item.note}</p>
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
  const [agentName, setAgentName] = useState("Ignition");
  const [publicRole, setPublicRole] = useState("Autonomous Lead & Booking Assistant");
  const [industry, setIndustry] = useState("Service Businesses & Local SMBs");
  const [avatarMark, setAvatarMark] = useState<(typeof avatarMarks)[number]["key"]>("ember");
  const [personality, setPersonality] = useState<(typeof personalityOptions)[number]>("Warm & Advisory");
  const [toneAttributes, setToneAttributes] = useState<string[]>(["Data-driven", "Crisp & Concise"]);
  const [responseLength, setResponseLength] = useState<(typeof responseLengthOptions)[number]>("Concise (1-2 sentences)");
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [dirty, setDirty] = useState(false);

  const wordCount = systemPrompt.trim().split(/\s+/).filter(Boolean).length;
  const markDirty = () => setDirty(true);

  function toggleTone(tone: string) {
    setToneAttributes(cur => {
      if (cur.includes(tone)) return cur.filter(t => t !== tone);
      if (cur.length >= 3) { notify("You can select up to 3 tone attributes"); return cur; }
      return [...cur, tone];
    });
    markDirty();
  }
  function saveDraft() { setDirty(false); notify("Identity draft saved"); }
  function discardChanges() {
    setAgentName("Ignition"); setPublicRole("Autonomous Lead & Booking Assistant"); setIndustry("Service Businesses & Local SMBs");
    setPersonality("Warm & Advisory"); setToneAttributes(["Data-driven", "Crisp & Concise"]); setResponseLength("Concise (1-2 sentences)");
    setSystemPrompt(defaultSystemPrompt); setDirty(false); notify("Changes discarded");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3.5">
          <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)]">
            <Robot weight="fill" className="text-[21px]" />
            <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-slate-950"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" /></span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-bold text-white">{agentName}</h1><span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Live</span><span className="text-[11px] text-slate-500">ailqs.com</span></div>
            <div className="mt-1 flex flex-wrap items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${dirty ? "bg-amber-400" : "bg-emerald-400"}`} /><span className={`text-[11px] font-semibold ${dirty ? "text-amber-400" : "text-emerald-400"}`}>{dirty ? "Unsaved draft changes (v2.4)" : "Draft in sync (v2.4)"}</span><span className="text-slate-700">•</span><span className="text-[11px] text-slate-500">Last deployed 3h ago by Maya C.</span></div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button onClick={saveDraft} className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3.5 py-2 text-[12px] font-semibold text-slate-200 hover:bg-slate-800"><FloppyDisk className="text-[14px] text-slate-500" />Save Draft</button>
          <button onClick={() => notify(`${agentName} changes published to production`)} className="flex items-center gap-1.5 rounded-md bg-orange-500 px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600"><UploadSimple className="text-[14px]" />Publish Changes</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AgentKpi label="Conversations" value="3,842" icon={ChatCircle} note="+14% this month" />
        <AgentKpi label="AI Resolution Rate" value="68%" icon={CheckCircle} pill="Autonomous deflection" />
        <AgentKpi label="Lead Capture Rate" value="11.1%" icon={Target} note="Industry benchmark met" />
        <AgentKpi label="Fallback Rate" value="4.2%" icon={SlidersHorizontal} note="Low human intervention req." />
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-3 xl:col-span-2">
          <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-900 p-2.5">
            <span className="px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">Agent Setup</span>
            {agentSetupNav.map(([tab, Icon]) => (
              <button key={tab} onClick={() => setSetupTab(tab)} className={`flex items-center justify-between rounded-lg px-2.5 py-2.5 text-left text-[12px] font-semibold transition-colors ${setupTab === tab ? "bg-orange-500 text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)]" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                <span className="flex items-center gap-2"><Icon weight={setupTab === tab ? "fill" : "regular"} className="text-[16px]" />{tab}</span>
                {setupTab === tab && <span className="h-2 w-2 rounded-full bg-white" />}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-slate-900/60 p-3.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Release State</span>
            <span className="text-[11px] text-slate-400">Live: <b className="font-bold text-white">v2.3</b></span>
            <span className="text-[11px] font-semibold text-orange-400">Editing Draft: v2.4</span>
          </div>
        </div>

        {setupTab === "Test & Publish" ? <AgentTestPlayground agentName={agentName} notify={notify} /> : (
          <>
            <div className="flex flex-col gap-4 lg:col-span-9 xl:col-span-6">
              {setupTab === "Identity" ? (
                <>
                  <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <div className="flex items-center justify-between">
                      <div><h2 className="text-[15px] font-semibold text-white">Core Agent Profile</h2><p className="mt-0.5 text-[11px] text-slate-500">Define your agent&rsquo;s public appearance and identity on ailqs.com</p></div>
                      <span className="shrink-0 rounded bg-slate-800 px-2 py-1 text-[9px] font-semibold text-slate-400">Step 1 of 6</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <label className="flex flex-col gap-1.5"><span className="text-[11px] font-semibold text-slate-300">Agent Name</span><input name="agentName" value={agentName} onChange={e => { setAgentName(e.target.value); markDirty(); }} className="h-10 rounded-md border border-slate-800 bg-slate-950 px-3 text-[12px] text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /><span className="text-[10px] text-slate-500">The name displayed in customer conversations.</span></label>
                      <label className="flex flex-col gap-1.5"><span className="text-[11px] font-semibold text-slate-300">Public Role &amp; Subtitle</span><input name="publicRole" value={publicRole} onChange={e => { setPublicRole(e.target.value); markDirty(); }} className="h-10 rounded-md border border-slate-800 bg-slate-950 px-3 text-[12px] text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /><span className="text-[10px] text-slate-500">Clarifies {agentName || "the agent"}&rsquo;s function to website visitors.</span></label>
                    </div>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-300">Primary Industry &amp; Domain</span>
                      <div className="relative"><select name="industry" value={industry} onChange={e => { setIndustry(e.target.value); markDirty(); }} className="h-10 w-full appearance-none rounded-md border border-slate-800 bg-slate-950 px-3 pr-9 text-[12px] text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                        <option>Service Businesses &amp; Local SMBs</option><option>E-commerce &amp; DTC Brands</option><option>Consulting &amp; Professional Services</option><option>Real Estate &amp; PropTech</option>
                      </select><CaretDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-500" /></div>
                      <span className="text-[10px] text-slate-500">Calibrates standard qualification terminology and conversion patterns.</span>
                    </label>
                    <div className="flex flex-col gap-2 pt-1">
                      <span className="text-[11px] font-semibold text-slate-300">Agent Avatar Mark</span>
                      <div className="flex flex-wrap items-center gap-2.5">
                        {avatarMarks.map(mark => mark.key === avatarMark ? (
                          <div key={mark.key} className="flex items-center gap-2.5 rounded-lg bg-slate-800 p-2 pr-3.5"><div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-tr from-orange-500 to-orange-600 text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)]"><mark.icon weight="fill" className="text-[16px]" /></div><div className="flex flex-col"><span className="text-[11px] font-semibold text-white">{mark.label} (Active)</span><span className="text-[10px] text-slate-500">{mark.desc}</span></div></div>
                        ) : (
                          <button key={mark.key} type="button" title={mark.label} onClick={() => { setAvatarMark(mark.key); markDirty(); }} className="grid h-9 w-9 place-items-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700"><mark.icon className="text-[16px]" /></button>
                        ))}
                        <button type="button" onClick={() => notify("Upload flow opened")} className="ml-1 flex items-center gap-1.5 text-[11px] font-semibold text-orange-400 hover:underline"><UploadSimple className="text-[13px]" />Upload Custom Mark</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <div><h2 className="text-[15px] font-semibold text-white">Voice &amp; Demeanor</h2><p className="mt-0.5 text-[11px] text-slate-500">Control how {agentName || "your agent"} engages prospects during qualification</p></div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold text-slate-300">Personality Archetype</span>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{personalityOptions.map(option => <button key={option} type="button" onClick={() => { setPersonality(option); markDirty(); }} className={`rounded-lg px-3 py-2.5 text-center text-[11px] font-semibold transition-colors ${personality === option ? "bg-orange-500 text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)]" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>{option}</button>)}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold text-slate-300">Tone Attributes (Select up to 3)</span>
                      <div className="flex flex-wrap items-center gap-2">{toneOptions.map(tone => { const selected = toneAttributes.includes(tone); return <button key={tone} type="button" onClick={() => toggleTone(tone)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${selected ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>{selected ? <CheckCircle weight="fill" className="text-[12px]" /> : <Plus className="text-[12px]" />}{tone}</button>; })}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-semibold text-slate-300">Response Length Preference</span>
                      <div className="grid grid-cols-1 gap-1.5 rounded-lg bg-slate-950/60 p-1 sm:grid-cols-3">{responseLengthOptions.map(option => <button key={option} type="button" onClick={() => { setResponseLength(option); markDirty(); }} className={`rounded-md px-3 py-2 text-center text-[11px] font-semibold transition-colors ${responseLength === option ? "bg-slate-800 text-orange-400" : "text-slate-500 hover:text-slate-200"}`}>{option}</button>)}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5 rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <div className="flex items-center justify-between">
                      <div><h2 className="text-[15px] font-semibold text-white">Business Core &amp; Master Instructions</h2><p className="mt-0.5 text-[11px] text-slate-500">Foundational system instruction prompt executing qualification thresholds</p></div>
                      <span className="shrink-0 rounded bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">Prompt v2.4</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between"><span className="text-[11px] font-semibold text-slate-300">System Prompt</span><span className="text-[10px] text-slate-500">{wordCount} / 2,000 words</span></div>
                      <textarea name="systemPrompt" value={systemPrompt} onChange={e => { setSystemPrompt(e.target.value); markDirty(); }} rows={6} className="w-full resize-y rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-[12px] leading-relaxed text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" />
                      <div className="mt-0.5 flex items-start gap-1.5"><Info className="mt-0.5 shrink-0 text-[13px] text-slate-500" /><span className="text-[10px] text-slate-500">System prompt guides tone and qualification logic. Avoid vague filler or conversational padding.</span></div>
                    </div>
                    <div className="mt-1 flex items-center justify-between border-t border-slate-800 pt-3.5">
                      <button type="button" onClick={discardChanges} className="rounded-md px-3.5 py-2 text-[11px] font-semibold text-slate-400 hover:bg-slate-800">Discard Changes</button>
                      <div className="flex items-center gap-2.5"><span className="hidden text-[10px] text-slate-500 sm:inline">{dirty ? "Unsaved changes" : "Draft auto-saved 2m ago"}</span><button type="button" onClick={saveDraft} className="rounded-md bg-orange-500 px-4 py-2 text-[12px] font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600">Save Identity Draft</button></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-orange-500/15 text-orange-400"><GearSix weight="duotone" className="text-[20px]" /></div>
                  <h2 className="text-[14px] font-semibold text-white">{setupTab}</h2>
                  <p className="max-w-sm text-[11px] text-slate-500">This configuration area is not part of the current design preview. Switch back to Identity to see the full experience.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 lg:col-span-12 xl:col-span-4 xl:sticky xl:top-4">
              <div className="flex flex-col gap-3.5 rounded-xl border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center justify-between"><h2 className="text-[14px] font-semibold text-white">Configuration Health</h2><span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">Optimal</span></div>
                <div className="flex items-center gap-3.5 rounded-lg bg-slate-950/60 p-3">
                  <ScoreRing value={86} size={56} stroke={5} color="#f97316" />
                  <div><span className="block text-[12px] font-semibold text-white">Readiness Score</span><span className="text-[10px] text-slate-500">2 recommendations to reach 100% efficiency.</span></div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2.5 rounded-lg p-2 transition-colors hover:bg-slate-800/60"><div className="flex items-start gap-2"><PlusCircle className="mt-0.5 shrink-0 text-[15px] text-amber-400" /><div className="flex flex-col"><span className="text-[11px] font-semibold text-slate-200">Add FAQ on Enterprise SLA</span><span className="text-[10px] font-medium text-emerald-400">+8% score boost</span></div></div><button onClick={() => notify("FAQ builder opened")} className="shrink-0 text-[10px] font-semibold text-orange-400 hover:underline">+ Add now</button></div>
                  <div className="flex items-start justify-between gap-2.5 rounded-lg p-2 transition-colors hover:bg-slate-800/60"><div className="flex items-start gap-2"><Clock className="mt-0.5 shrink-0 text-[15px] text-orange-400" /><div className="flex flex-col"><span className="text-[11px] font-semibold text-slate-200">Define fallback rep for non-working hours</span><span className="text-[10px] font-medium text-emerald-400">+6% score boost</span></div></div><button onClick={() => notify("Fallback routing opened")} className="shrink-0 text-[10px] font-semibold text-orange-400 hover:underline">Configure</button></div>
                </div>
              </div>

              <div className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                <div className="flex items-center justify-between bg-slate-950/60 p-3.5">
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /><span className="text-[11px] font-semibold text-white">Live Widget Preview</span></div>
                  <div className="flex items-center gap-2"><span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-semibold text-slate-400">Draft Mode (v2.4)</span><button onClick={() => notify("Widget preview reloaded")} aria-label="Reload widget state" className="text-slate-500 hover:text-white"><ArrowClockwise className="text-[14px]" /></button></div>
                </div>
                <div className="flex flex-col p-3.5">
                  <div className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                    <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600 p-3 text-white">
                      <div className="flex items-center gap-2"><div className="grid h-6 w-6 place-items-center rounded-md bg-white/20"><Robot weight="fill" className="text-[13px]" /></div><div className="flex flex-col"><span className="text-[11px] font-bold leading-tight">{agentName || "Agent"} • Lead Assistant</span><span className="text-[8px] leading-none text-white/70">Online • Instant qualification</span></div></div>
                      <div className="flex items-center gap-1.5 text-white/80"><Minus className="text-[13px]" /><X className="text-[13px]" /></div>
                    </div>
                    <div className="flex min-h-[200px] flex-col gap-2.5 p-3.5">
                      <div className="my-1 text-center"><span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[8px] text-slate-500">Today • 10:14 AM</span></div>
                      <div className="flex items-start gap-2"><div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-orange-500 text-white"><Robot weight="fill" className="text-[11px]" /></div><div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-800 p-2.5 text-[11px] leading-relaxed text-slate-200">Hi there! 👋 Welcome to ailqs.com. Are you looking to book a service or get a quick quote?</div></div>
                      <div className="flex flex-col gap-1.5 pl-8">{["Book a service ⚡", "Get a quote 💬", "Pricing & plans 📊"].map(reply => <button key={reply} onClick={() => notify(`Simulated reply: ${reply}`)} className="w-fit rounded-full bg-slate-800 px-3 py-1.5 text-left text-[10px] font-semibold text-orange-300 transition-colors hover:bg-slate-700">{reply}</button>)}</div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5"><input name="widgetTestMessage" placeholder={`Type a response to test ${agentName || "Ignition"}...`} className="h-9 flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 text-[11px] text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /><button onClick={() => notify("Test message sent to preview")} className="grid h-8 w-8 place-items-center rounded-lg bg-orange-500 text-white hover:bg-orange-600"><PaperPlaneRight className="text-[13px]" /></button></div>
                  </div>
                  <span className="mt-2.5 text-center text-[10px] text-slate-500">Updates to Identity &amp; Behavior reflect in this preview immediately.</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RuleLogicRow({ rule }: { rule: ScoringRule }) {
  const toneClass = rule.kind === "penalty" ? "bg-red-500/15 text-red-400" : "bg-emerald-500/15 text-emerald-400";
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-950/60 p-2.5 text-[11px] text-slate-200">
      <span className="rounded bg-orange-500 px-2 py-0.5 text-[9px] font-bold text-white">IF</span>
      <span className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 font-mono text-[10px] font-semibold text-slate-200">{rule.conditionIf}</span>
      {rule.conditionAnd && <><span className="rounded bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-400">AND</span><span className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 font-mono text-[10px] font-semibold text-slate-200">{rule.conditionAnd}</span></>}
      <span className="rounded bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-white">THEN</span>
      <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${toneClass}`}>{thenLabel(rule)}</span>
      {rule.note && <><span className="rounded bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-400">AND</span><span className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-300"><Megaphone className="text-[13px] text-red-400" />{rule.note.prefix}<b className="font-bold text-orange-300">{rule.note.highlight}</b>{rule.note.suffix}</span></>}
    </div>
  );
}

function ScoringRuleCard({ rule, priority, reorderMode, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onToggleActive, onEdit, onDuplicate, onDelete, menuOpen, onToggleMenu }: {
  rule: ScoringRule; priority: number; reorderMode: boolean; canMoveUp: boolean; canMoveDown: boolean;
  onMoveUp: () => void; onMoveDown: () => void; onToggleActive: () => void; onEdit: () => void; onDuplicate: () => void; onDelete: () => void;
  menuOpen: boolean; onToggleMenu: () => void;
}) {
  const Icon = ruleIconMap[rule.icon];
  const style = ruleKindStyle[rule.kind];
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-slate-800 bg-slate-900 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {reorderMode ? <div className="flex flex-col"><button type="button" disabled={!canMoveUp} onClick={onMoveUp} aria-label={`Move ${rule.name} up in priority`} className="text-slate-500 hover:text-white disabled:opacity-30"><CaretUp className="text-[13px]" /></button><button type="button" disabled={!canMoveDown} onClick={onMoveDown} aria-label={`Move ${rule.name} down in priority`} className="text-slate-500 hover:text-white disabled:opacity-30"><CaretDown className="text-[13px]" /></button></div> : <DotsSixVertical className="text-[16px] text-slate-700" />}
          <span className="rounded bg-slate-800 px-2 py-0.5 text-[9px] font-bold uppercase text-slate-400">Priority #{priority}</span>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-medium text-slate-400">{rule.category}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold ${style}`}><Icon className="text-[11px]" />{tagLabel(rule)}</span>
          <ToggleSwitch checked={rule.active} onChange={onToggleActive} label={`Toggle ${rule.name}`} />
          <div className="relative">
            <button type="button" onClick={onToggleMenu} aria-label={`More actions for ${rule.name}`} className="rounded-md p-1 text-slate-500 hover:bg-slate-800 hover:text-white"><DotsThree weight="bold" className="text-[16px]" /></button>
            {menuOpen && <div className="absolute right-0 top-7 z-10 w-32 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 py-1 shadow-2xl"><button type="button" onClick={onDelete} className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-[10px] font-semibold text-red-400 hover:bg-red-500/10"><Trash className="text-[12px]" />Delete Rule</button></div>}
          </div>
        </div>
      </div>
      <RuleLogicRow rule={rule} />
      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[10px] text-slate-500">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1"><CheckCircle weight="fill" className="text-[12px] text-emerald-400" /><span className="font-semibold text-slate-200">{rule.matched} leads matched</span></span>
          {rule.capturePercent && <span>({rule.capturePercent})</span>}
          <span>•</span><span>Evaluated {rule.evaluatedAgo}</span><span>•</span><span className="font-semibold text-emerald-400">{rule.precision} precision</span>
        </div>
        <div className="flex items-center gap-2"><button type="button" onClick={onEdit} className="font-semibold text-slate-500 hover:text-orange-400">Edit</button><span>•</span><button type="button" onClick={onDuplicate} className="font-semibold text-slate-500 hover:text-white">Duplicate</button></div>
      </div>
    </div>
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

  function addScoringEffect() { if (!newEffect.trim()) return; setScoringEffects(cur => [...cur, newEffect.trim()]); setNewEffect(""); }
  function removeScoringEffect(idx: number) { setScoringEffects(cur => cur.filter((_, i) => i !== idx)); }
  function addLanguage() { if (!newLanguage.trim()) return; setLanguages(cur => [...cur, newLanguage.trim()]); setNewLanguage(""); setAddingLanguage(false); }
  function save() {
    if (!label.trim()) return;
    onSave({ id: Date.now(), label: label.trim(), crmField, fieldType, points: scoringEffects[0] ?? "No scoring effect", askCondition: conditionField.trim() && conditionValue.trim() ? `Ask if ${conditionField.trim()} != '${conditionValue.trim()}'` : "Always ask", required });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <aside className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-slate-800 bg-slate-950 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 p-5">
          <div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange-500/15 text-orange-400"><NotePencil className="text-[16px]" /></div><div><h2 className="text-[15px] font-bold text-white">Create Qualification Question</h2><p className="mt-0.5 text-[11px] text-slate-500">Define field mapping, phrasing, and AI extraction rules</p></div></div>
          <button type="button" onClick={onClose} aria-label="Close" className="shrink-0 rounded-full p-1 text-slate-500 hover:bg-slate-800 hover:text-white"><X className="text-[16px]" /></button>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <label className="flex flex-col gap-1.5"><span className="text-[11px] font-semibold text-slate-300">Question Label / Internal Name</span><input name="questionLabel" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Timeline Urgency" className="h-10 rounded-md border border-slate-800 bg-slate-900 px-3 text-[12px] text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-[11px] font-semibold text-slate-300">Mapped CRM Field</span><div className="relative"><select name="crmField" value={crmField} onChange={e => setCrmField(e.target.value)} className="h-10 w-full appearance-none rounded-md border border-slate-800 bg-slate-900 px-3 pr-9 font-mono text-[11px] text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500">{crmFieldOptions.map(f => <option key={f}>{f}</option>)}</select><CaretDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-500" /></div></label>
          <label className="flex flex-col gap-1.5"><span className="text-[11px] font-semibold text-slate-300">Input &amp; Field Type</span><div className="relative"><select name="fieldType" value={fieldType} onChange={e => setFieldType(e.target.value)} className="h-10 w-full appearance-none rounded-md border border-slate-800 bg-slate-900 px-3 pr-9 text-[12px] text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500">{fieldTypeOptions.map(f => <option key={f}>{f}</option>)}</select><CaretDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-500" /></div></label>

          <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-900 p-3"><div><span className="block text-[11px] font-semibold text-slate-200">Required Question</span><span className="text-[10px] text-slate-500">Conversation won&rsquo;t yield qualified tag until filled</span></div><ToggleSwitch checked={required} onChange={() => setRequired(v => !v)} label="Required question" /></div>

          <label className="flex flex-col gap-1.5"><span className="text-[11px] font-semibold text-slate-300">Default Visitor Prompt</span><input name="defaultPrompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g. When is your target kickoff date for this booking?" className="h-10 rounded-md border border-slate-800 bg-slate-900 px-3 text-[12px] text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>

          <label className="flex cursor-pointer items-start gap-2.5 rounded-lg bg-slate-900 p-3"><input type="checkbox" name="aiAdaptivePhrasing" checked={aiAdaptive} onChange={e => setAiAdaptive(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-orange-500" /><span><span className="block text-[11px] font-semibold text-slate-200">AI Adaptive Phrasing</span><span className="text-[10px] text-slate-500">Allow the agent to dynamically rephrase based on conversation tone &amp; previous context</span></span></label>

          <div className="flex flex-col gap-2 rounded-lg bg-slate-900 p-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300"><FlowArrow className="text-[13px] text-slate-500" />Ask Condition / Branching</span>
            <div className="flex flex-wrap items-center gap-1.5 rounded-md bg-slate-950 px-2.5 py-2 text-[11px] font-mono"><span className="font-semibold text-orange-400">IF</span><input name="conditionField" aria-label="Ask condition field" value={conditionField} onChange={e => setConditionField(e.target.value)} className="w-28 rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-slate-200 outline-none focus-visible:ring-1 focus-visible:ring-orange-500" /><span className="text-slate-500">!=</span><input name="conditionValue" aria-label="Ask condition value" value={conditionValue} onChange={e => setConditionValue(e.target.value)} className="w-24 rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-slate-200 outline-none focus-visible:ring-1 focus-visible:ring-orange-500" /><span className="ml-auto shrink-0 rounded bg-slate-800 px-2 py-0.5 text-[9px] font-semibold text-slate-400">THEN Ask</span></div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300"><ChartLineUp className="text-[13px] text-slate-500" />Scoring Impact</span>
            <div className="flex flex-col gap-1.5">{scoringEffects.map((effect, idx) => <div key={idx} className="flex items-center justify-between gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-[11px] font-medium text-emerald-400"><span className="flex items-center gap-1.5"><Target className="text-[12px]" />{effect}</span><button type="button" onClick={() => removeScoringEffect(idx)} aria-label="Remove scoring effect" className="text-emerald-400/60 hover:text-emerald-400"><X className="text-[12px]" /></button></div>)}</div>
            <div className="flex items-center gap-1.5"><input name="scoringEffect" aria-label="New scoring effect" value={newEffect} onChange={e => setNewEffect(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addScoringEffect(); } }} placeholder="e.g. +10 pts if budget confirmed" className="h-8 flex-1 rounded-md border border-slate-800 bg-slate-900 px-2.5 text-[10px] text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /><button type="button" onClick={addScoringEffect} className="flex items-center gap-1 rounded-md bg-orange-500/15 px-2.5 py-1.5 text-[10px] font-semibold text-orange-300 hover:bg-orange-500/25"><Plus className="text-[12px]" />Add</button></div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300"><Translate className="text-[13px] text-slate-500" />Multilingual Phrasing Support</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {languages.map(lang => <span key={lang} className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-400">{lang}</span>)}
              {addingLanguage ? <span className="flex items-center gap-1"><input name="newLanguage" aria-label="New language" autoFocus value={newLanguage} onChange={e => setNewLanguage(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addLanguage(); } if (e.key === "Escape") setAddingLanguage(false); }} placeholder="Language" className="h-7 w-24 rounded-full border border-slate-800 bg-slate-900 px-2.5 text-[10px] text-slate-200 outline-none focus-visible:ring-1 focus-visible:ring-orange-500" /><button type="button" onClick={addLanguage} aria-label="Confirm language" className="text-orange-400"><Check weight="bold" className="text-[13px]" /></button></span> : <button type="button" onClick={() => setAddingLanguage(true)} aria-label="Add language" className="grid h-7 w-7 place-items-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700"><Plus className="text-[12px]" /></button>}
            </div>
          </div>
          <p className="flex items-start gap-2 text-[10px] text-slate-500"><Info className="mt-0.5 shrink-0 text-[12px]" />Graceful extraction with 2 retry attempts before human handoff.</p>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-slate-800 bg-slate-950/60 p-4">
          <button type="button" onClick={onClose} className="rounded-md px-4 py-2 text-[11px] font-semibold text-slate-300 hover:bg-slate-800">Cancel</button>
          <button type="button" onClick={save} className="rounded-md bg-orange-500 px-5 py-2 text-[11px] font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600">Save Question</button>
        </div>
      </aside>
    </div>
  );
}

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
  function save() { if (!name.trim() || !conditionIf.trim()) return; onSave({ ...previewRule, name: name.trim(), conditionIf: conditionIf.trim(), conditionAnd: conditionAnd.trim() || undefined }); }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <aside className="relative flex h-full w-full max-w-md flex-col gap-4 overflow-y-auto border-l border-slate-800 bg-slate-950 p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-500/15 text-orange-400"><Gauge className="text-[16px]" /></span><div><h2 className="text-[14px] font-bold text-white">{initial ? "Edit Scoring Rule" : "Add Scoring Rule"}</h2><p className="text-[10px] text-slate-500">Define the condition, category, and point impact</p></div></div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1 text-slate-500 hover:bg-slate-800"><X className="text-[15px]" /></button>
        </div>
        <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-slate-300">Rule Name<input name="ruleName" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. High Velocity" className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-[12px] font-medium text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
        <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-slate-300">Category<select name="ruleCategory" value={category} onChange={e => setCategory(e.target.value)} className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-[12px] font-medium text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500">{ruleCategories.map(c => <option key={c}>{c}</option>)}</select></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-slate-300">Rule Type<select name="ruleKind" value={kind} onChange={e => setKind(e.target.value as ScoringRuleKind)} className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-[12px] font-medium text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500">{ruleKindOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
          <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-slate-300">Points<input name="rulePoints" type="number" min={1} value={points} onChange={e => setPoints(Number(e.target.value))} className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-[12px] font-medium text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
        </div>
        <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-slate-300">Condition (IF)<input name="ruleConditionIf" value={conditionIf} onChange={e => setConditionIf(e.target.value)} placeholder="e.g. Budget ≥ $50,000" className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-[12px] font-medium text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
        <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-slate-300">Additional Condition (AND) — optional<input name="ruleConditionAnd" value={conditionAnd} onChange={e => setConditionAnd(e.target.value)} placeholder="e.g. Timeline is within 30 days" className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-[12px] font-medium text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-900 p-3"><div><span className="block text-[11px] font-semibold text-slate-200">Rule Active</span><span className="text-[10px] text-slate-500">Live in the scoring engine immediately</span></div><ToggleSwitch checked={active} onChange={() => setActive(v => !v)} label="Rule active" /></div>
        <div className="flex flex-col gap-1.5"><span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Preview</span><RuleLogicRow rule={previewRule} /></div>
        <div className="mt-auto flex items-center justify-end gap-2 border-t border-slate-800 pt-4"><button type="button" onClick={onClose} className="rounded-md px-4 py-2 text-[11px] font-semibold text-slate-300 hover:bg-slate-800">Cancel</button><button type="button" onClick={save} className="rounded-md bg-orange-500 px-5 py-2 text-[11px] font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600">{initial ? "Save Changes" : "Add Rule"}</button></div>
      </aside>
    </div>
  );
}

function ClassificationThresholdsCard({ warmStart, hotStart, onChangeWarm, onChangeHot, coldPct, warmPct, hotPct }: {
  warmStart: number; hotStart: number; onChangeWarm: (v: number) => void; onChangeHot: (v: number) => void; coldPct: number; warmPct: number; hotPct: number;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[13px] font-bold text-white"><SlidersHorizontal className="text-[16px] text-orange-400" />Lead Temperature Thresholds</span><button type="button" onClick={() => setEditing(v => !v)} aria-label="Edit temperature thresholds" aria-pressed={editing} className={`rounded-md p-1 ${editing ? "bg-orange-500/15 text-orange-400" : "text-slate-500 hover:bg-slate-800 hover:text-orange-400"}`}><NotePencil className="text-[15px]" /></button></div>
      <div className="flex items-center justify-between gap-3"><p className="text-[10px] text-slate-500">Determines automatic routing and tag assignment based on final cumulative score.</p><span className="shrink-0 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-semibold text-white">Auto-recalculate</span></div>

      {editing && <div className="flex flex-col gap-2 rounded-lg bg-slate-950/60 p-3">
        <label className="flex items-center justify-between gap-2 text-[10px] font-semibold text-slate-400">Warm starts at<input name="warmThreshold" type="number" min={1} max={hotStart - 1} value={warmStart} onChange={e => onChangeWarm(Math.min(hotStart - 1, Math.max(1, Number(e.target.value))))} className="w-16 rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-right text-[11px] font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
        <label className="flex items-center justify-between gap-2 text-[10px] font-semibold text-slate-400">Hot starts at<input name="hotThreshold" type="number" min={warmStart + 1} max={99} value={hotStart} onChange={e => onChangeHot(Math.min(99, Math.max(warmStart + 1, Number(e.target.value))))} className="w-16 rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-right text-[11px] font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
      </div>}

      <div className="flex flex-col gap-2">
        <div className="flex h-6 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="flex items-center justify-center whitespace-nowrap bg-blue-600 text-[9px] font-semibold text-white" style={{ width: `${warmStart}%` }}>Cold (0-{warmStart - 1})</div>
          <div className="flex items-center justify-center whitespace-nowrap bg-amber-500 text-[9px] font-semibold text-slate-950" style={{ width: `${hotStart - warmStart}%` }}>Warm ({warmStart}-{hotStart - 1})</div>
          <div className="flex items-center justify-center whitespace-nowrap bg-red-500 text-[9px] font-bold text-white" style={{ width: `${100 - hotStart}%` }}>Hot ({hotStart}+)</div>
        </div>
        <div className="flex items-center justify-between px-1 text-[9px] text-slate-500"><span>0</span><span className="font-bold text-white">{warmStart}</span><span className="font-bold text-red-400">{hotStart}</span><span>100</span></div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-lg bg-slate-950/60 p-2.5"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /><div><span className="block text-[11px] font-semibold text-slate-200">Cold / Nurture Queue</span><span className="text-[9px] text-slate-500">Score 0 – {warmStart - 1}</span></div></div><div className="text-right"><span className="block text-[11px] font-bold text-white">{coldPct}%</span><span className="text-[9px] text-slate-500">of volume</span></div></div>
        <div className="flex items-center justify-between rounded-lg bg-slate-950/60 p-2.5"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><div><span className="block text-[11px] font-semibold text-slate-200">Warm / SDR Sequence</span><span className="text-[9px] text-slate-500">Score {warmStart} – {hotStart - 1}</span></div></div><div className="text-right"><span className="block text-[11px] font-bold text-white">{warmPct}%</span><span className="text-[9px] text-slate-500">of volume</span></div></div>
        <div className="flex items-center justify-between rounded-lg bg-red-500/10 p-2.5"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /><div><span className="block text-[11px] font-semibold text-slate-200">Hot / Direct Booking</span><span className="text-[9px] text-slate-500">Score {hotStart} – 100</span></div></div><div className="text-right"><span className="block text-[11px] font-bold text-red-400">{hotPct}%</span><span className="text-[9px] text-slate-500">of volume</span></div></div>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg bg-slate-950/60 p-3 text-[10px] text-slate-500"><Timer className="mt-0.5 shrink-0 text-[15px] text-orange-400" /><span><b className="font-semibold text-slate-200">SLA Commitment:</b> Hot leads trigger automatic distribution requiring agent outreach within <span className="font-bold text-red-400">15 minutes</span>.</span></div>
    </div>
  );
}

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
    setPresetIndex(idx); setBudget(p.budget); setTimelineDays(p.timelineDays); setService(p.service); setIntent(p.intent); setAuthority(p.authority); setLocation(p.location);
  }
  const isActive = (id: number) => scoringRules.find(r => r.id === id)?.active ?? false;
  const breakdown: { label: string; points: number }[] = [{ label: "Base Initial Score", points: 0 }];
  if (isActive(1) && budget >= 50000 && timelineDays <= 30) breakdown.push({ label: "Budget (≥ $50K) & Timeline (≤ 30d)", points: 25 });
  if (isActive(3) && intent === "High (Immediate Need)") breakdown.push({ label: "Buying Intent Signal (High)", points: 22 });
  if (isActive(2) && service === "Booking & Scheduling") breakdown.push({ label: "Service Fit (Booking & Scheduling)", points: 18 });
  if (isActive(5) && (authority === "Owner / Decision Maker" || authority === "Manager / Director")) breakdown.push({ label: `Decision Maker (${authority.split(" /")[0]})`, points: 15 });
  if (location !== "Outside Service Area") breakdown.push({ label: `Geographic Fit (${location})`, points: 6 });
  else if (isActive(4)) breakdown.push({ label: "Location Outside Service Area (Penalty)", points: -20 });

  const rawTotal = breakdown.reduce((sum, l) => sum + l.points, 0);
  const total = Math.max(0, Math.min(100, rawTotal));
  const tier: "Hot" | "Warm" | "Cold" = total >= hotStart ? "Hot" : total >= warmStart ? "Warm" : "Cold";
  const tierStyle = tier === "Hot" ? "bg-red-500/15 text-red-400" : tier === "Warm" ? "bg-amber-500/15 text-amber-400" : "bg-slate-800 text-slate-400";

  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[13px] font-bold text-white"><PlayCircle weight="fill" className="text-[16px] text-orange-400" />Test Score Simulator</span><span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[9px] font-semibold text-slate-400">Sample {preset.name}</span></div>

      <div className="flex flex-col gap-2 rounded-lg bg-slate-950/60 p-3">
        <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Candidate Inputs</span>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-[9px] font-medium text-slate-500">Budget ($)<input name="simBudget" type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} className="rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
          <label className="flex flex-col gap-1 text-[9px] font-medium text-slate-500">Timeline (days)<input name="simTimeline" type="number" value={timelineDays} onChange={e => setTimelineDays(Number(e.target.value))} className="rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
          <label className="flex flex-col gap-1 text-[9px] font-medium text-slate-500">Service<select name="simService" value={service} onChange={e => setService(e.target.value)} className="rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-orange-500">{serviceOptions.map(o => <option key={o}>{o}</option>)}</select></label>
          <label className="flex flex-col gap-1 text-[9px] font-medium text-slate-500">Intent<select name="simIntent" value={intent} onChange={e => setIntent(e.target.value)} className="rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-orange-500">{intentOptions.map(o => <option key={o}>{o}</option>)}</select></label>
          <label className="flex flex-col gap-1 text-[9px] font-medium text-slate-500">Authority<select name="simAuthority" value={authority} onChange={e => setAuthority(e.target.value)} className="rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-orange-500">{authorityOptions.map(o => <option key={o}>{o}</option>)}</select></label>
          <label className="flex flex-col gap-1 text-[9px] font-medium text-slate-500">Location<select name="simLocation" value={location} onChange={e => setLocation(e.target.value)} className="rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-orange-500">{locationOptions.map(o => <option key={o}>{o}</option>)}</select></label>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-slate-950/60 p-4">
        <div><span className="block text-[9px] font-bold uppercase tracking-wide text-slate-500">Simulated Score</span><div className="flex items-baseline gap-1"><span className="text-[28px] font-black text-white">{total}</span><span className="text-[12px] text-slate-500">/ 100</span></div></div>
        <div className="flex flex-col items-end gap-1.5"><span className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${tierStyle}`}><Fire weight="fill" className="text-[13px]" />{tier.toUpperCase()} LEAD</span><span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400"><Check weight="bold" className="text-[11px]" />Auto-Route Qualified</span></div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Scoring Waterfall Breakdown</span>
        <div className="flex flex-col divide-y divide-slate-800 text-[11px]">
          {breakdown.map((line, idx) => <div key={idx} className="flex items-center justify-between py-1.5"><span className={idx === 0 ? "text-slate-500" : "text-slate-200"}>{line.label}</span><span className={`font-mono font-bold ${line.points < 0 ? "text-red-400" : line.points === 0 ? "text-slate-500" : "text-emerald-400"}`}>{line.points > 0 ? "+" : ""}{line.points} pts</span></div>)}
          <div className="flex items-center justify-between py-2 font-bold text-white"><span>Total Calculated Score</span><span className="font-mono text-[13px] text-orange-400">{total} pts ({tier} Tier)</span></div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-0.5">
        <button type="button" onClick={() => applyPreset((presetIndex + 1) % simulatorPresets.length)} className="flex w-full items-center justify-center gap-1.5 rounded-md bg-slate-800 py-2 text-[11px] font-semibold text-slate-200 hover:bg-slate-700"><Repeat className="text-[14px]" />Test Another Lead Record</button>
        <button type="button" onClick={() => notify(`${preset.name} saved as golden benchmark test`)} className="text-center text-[10px] font-semibold text-orange-400 hover:underline">Save {preset.name} as Golden Benchmark Test</button>
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
    { id: -2, text: "Penalty rule threshold reviewed by Maya Chen", time: "42m ago" },
    { id: -3, text: "Qualification engine synced with Widget v2.1", time: "1h ago" },
  ]);
  const [auditOpen, setAuditOpen] = useState(false);
  const auditIdRef = useRef(-4);
  function logAudit(text: string) { setAuditLog(cur => [{ id: auditIdRef.current--, text, time: "Just now" }, ...cur]); }

  const [warmStart, setWarmStart] = useState(40);
  const [hotStart, setHotStart] = useState(70);
  const tierPct = (() => {
    const cold = sampleLeadScores.filter(s => s < warmStart).length;
    const hot = sampleLeadScores.filter(s => s >= hotStart).length;
    const total = sampleLeadScores.length;
    const warm = total - cold - hot;
    return { cold: Math.round((cold / total) * 100), warm: Math.round((warm / total) * 100), hot: Math.round((hot / total) * 100) };
  })();
  const avgLeadScore = sampleLeadScores.reduce((a, b) => a + b, 0) / sampleLeadScores.length;

  function handleSaveQuestion(question: QualificationQuestion) { setQuestions(cur => [...cur, question]); notify(`${question.label} added to qualification flow`); logAudit(`Added question "${question.label}"`); setQuestionDialogOpen(false); }
  function toggleRuleActive(id: number) { setScoringRules(cur => cur.map(r => { if (r.id !== id) return r; logAudit(`${r.active ? "Paused" : "Activated"} rule "${r.name}"`); return { ...r, active: !r.active }; })); }
  function openCreateRule() { setTab("Scoring Rules"); setRuleDialog({ open: true, editing: null }); }
  function openEditRule(rule: ScoringRule) { setRuleDialog({ open: true, editing: rule }); }
  function saveRule(rule: ScoringRule) {
    if (ruleDialog.editing) { setScoringRules(cur => cur.map(r => r.id === rule.id ? rule : r)); notify(`${rule.name} updated`); logAudit(`Edited rule "${rule.name}"`); }
    else { const newRule: ScoringRule = { ...rule, id: nextRuleId.current++ }; setScoringRules(cur => [...cur, newRule]); notify(`${rule.name} added to scoring engine`); logAudit(`Added new rule "${rule.name}"`); }
    setRuleDialog({ open: false, editing: null });
  }
  function duplicateRule(rule: ScoringRule) {
    const copy: ScoringRule = { ...rule, id: nextRuleId.current++, name: `${rule.name} (Copy)`, matched: 0, evaluatedAgo: "Just now" };
    setScoringRules(cur => { const idx = cur.findIndex(r => r.id === rule.id); const next = [...cur]; next.splice(idx + 1, 0, copy); return next; });
    notify(`${rule.name} duplicated`); logAudit(`Duplicated rule "${rule.name}"`); setMenuOpenId(null);
  }
  function deleteRule(rule: ScoringRule) { setScoringRules(cur => cur.filter(r => r.id !== rule.id)); notify(`${rule.name} deleted`); logAudit(`Deleted rule "${rule.name}"`); setMenuOpenId(null); }
  function moveRule(id: number, direction: -1 | 1) {
    setScoringRules(cur => { const idx = cur.findIndex(r => r.id === id); const swapIdx = idx + direction; if (swapIdx < 0 || swapIdx >= cur.length) return cur; const next = [...cur]; [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]; return next; });
  }

  const categories = Array.from(new Set(scoringRules.map(r => r.category)));
  const filteredRules = scoringRules.filter(r => {
    if (categoryFilter !== "All Categories" && r.category !== categoryFilter) return false;
    if (statusFilter === "active" && !r.active) return false;
    if (statusFilter === "paused" && r.active) return false;
    if (!search.trim()) return true;
    const haystack = [r.name, r.category, r.conditionIf, r.conditionAnd ?? "", r.note?.highlight ?? ""].join(" ").toLowerCase();
    return haystack.includes(search.trim().toLowerCase());
  });

  const activeCount = scoringRules.filter(r => r.active).length;
  const positiveCount = scoringRules.filter(r => r.kind === "positive" || r.kind === "highlight").length;
  const penaltyCount = scoringRules.filter(r => r.kind === "penalty").length;
  const alertCount = scoringRules.filter(r => r.kind === "alert").length;

  const tabs: { key: "Questions" | "Scoring Rules" | "Classification Thresholds" | "Test Score Sandbox"; label: string; count?: number }[] = [
    { key: "Questions", label: "Questions", count: questions.length }, { key: "Scoring Rules", label: "Scoring Rules", count: scoringRules.length },
    { key: "Classification Thresholds", label: "Classification Thresholds" }, { key: "Test Score Sandbox", label: "Test Score Sandbox" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-wide text-orange-400">AI Evaluation Engine</span><span className="h-1 w-1 rounded-full bg-slate-700" /><span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-semibold text-slate-400">v3.4 Production</span><span className="h-1 w-1 rounded-full bg-slate-700" /><span className="text-[10px] text-slate-500">ailqs.com</span></div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Qualification &amp; Scoring</h1>
          <p className="max-w-2xl text-[12px] text-slate-500">Configure automated lead scoring models, intent weightings, temperature thresholds, and real-time sales alert triggers.</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button type="button" onClick={() => setAuditOpen(true)} className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] font-semibold text-slate-200 hover:bg-slate-800"><ClockCounterClockwise className="text-[15px]" />Audit Log</button>
          <button type="button" onClick={() => setReorderMode(v => !v)} aria-pressed={reorderMode} className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-[11px] font-semibold ${reorderMode ? "bg-orange-500 text-white" : "border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"}`}><ArrowsDownUp className="text-[15px]" />Reorder Priority</button>
          <button type="button" onClick={openCreateRule} className="flex items-center gap-1.5 rounded-md bg-orange-500 px-3.5 py-2 text-[11px] font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600"><Plus className="text-[15px]" />Add Scoring Rule</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4"><div className="flex flex-col gap-1"><span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Active Scoring Rules</span><div className="flex items-baseline gap-2"><span className="text-xl font-bold text-white">{activeCount} Live</span><span className="text-[9px] font-semibold text-emerald-400">{Math.round((activeCount / (scoringRules.length || 1)) * 100)}% operational</span></div><span className="text-[10px] text-slate-500">{positiveCount} positive • {penaltyCount} penalty • {alertCount} routing trigger{alertCount === 1 ? "" : "s"}</span></div><div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange-500/15 text-orange-400"><ListChecks className="text-[18px]" /></div></div>
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4"><div className="flex flex-col gap-1"><span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Average Lead Score</span><div className="flex items-baseline gap-2"><span className="text-xl font-bold text-white">{avgLeadScore.toFixed(1)} <span className="text-[12px] font-normal text-slate-500">/ 100</span></span><span className="flex items-center gap-0.5 text-[9px] font-semibold text-emerald-400"><TrendUp className="text-[11px]" />{avgLeadScore >= 57.6 ? "+" : ""}{(avgLeadScore - 57.6).toFixed(1)} pts</span></div><span className="text-[10px] text-slate-500">Benchmark baseline 57.6 across {sampleLeadScores.length} records</span></div><div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-orange-500/15 text-orange-400"><ChartLineUp className="text-[18px]" /></div></div>
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4"><div className="flex flex-col gap-1"><span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">High Intent (Hot) Ratio</span><div className="flex items-baseline gap-2"><span className="text-xl font-bold text-red-400">{tierPct.hot}%</span><span className="text-[9px] font-medium text-slate-500">Threshold ≥ {hotStart}</span></div><span className="text-[10px] text-slate-500">Auto-routed directly to SDR calendar sync</span></div><div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-500/15 text-red-400"><Fire weight="fill" className="text-[18px]" /></div></div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-slate-800 p-1">{tabs.map(t => <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors ${tab === t.key ? "bg-orange-500 text-white" : "text-slate-400 hover:text-slate-200"}`}><span>{t.label}</span>{t.count !== undefined && <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${tab === t.key ? "bg-white/20 text-white" : "bg-slate-950 text-slate-400"}`}>{t.count}</span>}</button>)}</div>
        <div className="hidden items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[10px] text-slate-500 xl:flex"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Rules engine syncing live with Widget v2.1</div>
      </div>

      {tab === "Questions" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4"><h2 className="text-[14px] font-bold text-white">Qualification Questions</h2><button type="button" onClick={() => setQuestionDialogOpen(true)} className="flex shrink-0 items-center gap-1.5 rounded-md bg-orange-500 px-3.5 py-2 text-[11px] font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600"><Plus className="text-[14px]" />Create Question</button></div>
          <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-orange-500/15 text-orange-400"><ListChecks weight="duotone" className="text-[20px]" /></div><div className="flex-1"><h3 className="text-[13px] font-semibold text-white">Qualification at a glance</h3><p className="text-[10px] text-slate-500">{questions.length} question{questions.length === 1 ? "" : "s"} configured · {questions.filter(q => q.required).length} required</p></div><div className="text-right"><span className="block text-[9px] text-slate-500">Max score</span><strong className="text-[14px] text-white">100 pts</strong></div></div>
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><h2 className="text-[13px] font-semibold text-white">Questions &amp; scoring rules</h2></div>
            {questions.map((q, idx) => <div key={q.id} className="flex items-start gap-3 border-b border-slate-800 px-4 py-3.5 last:border-0">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-800 text-[9px] font-bold text-slate-400">{idx + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><span className="text-[12px] font-semibold text-white">{q.label}</span><span className="rounded bg-orange-500/15 px-1.5 py-0.5 font-mono text-[9px] text-orange-300">{q.crmField}</span><span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-medium text-slate-400">{q.fieldType}</span>{q.required && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-semibold text-amber-400">Required</span>}</div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500"><span className="flex items-center gap-1 font-medium text-emerald-400"><Target className="text-[11px]" />{q.points}</span><span className="flex items-center gap-1"><FlowArrow className="text-[11px]" />{q.askCondition}</span></div>
              </div>
              <button type="button" onClick={() => notify(`${q.label} configuration opened`)} aria-label={`Edit ${q.label}`} className="shrink-0 rounded-md p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white"><NotePencil className="text-[14px]" /></button>
            </div>)}
          </div>
        </div>
      )}

      {tab === "Scoring Rules" && (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          <div className="flex flex-col gap-3.5 lg:col-span-8">
            <div className="flex flex-col items-stretch gap-2.5 rounded-xl border border-slate-800 bg-slate-900 p-3 md:flex-row md:items-center md:justify-between">
              <div className="relative min-w-[200px] flex-1"><MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-slate-500" /><input name="ruleSearch" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search rules by attribute, condition, or tag..." className="h-9 w-full rounded-md border border-slate-800 bg-slate-950 pl-9 pr-3 text-[11px] text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></div>
              <div className="flex items-center gap-2 overflow-x-auto">
                <select name="ruleCategoryFilter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="h-9 rounded-md border border-slate-800 bg-slate-950 px-3 text-[10px] font-semibold text-slate-200 outline-none"><option value="All Categories">All Categories ({scoringRules.length})</option>{categories.map(c => <option key={c} value={c}>{c} ({scoringRules.filter(r => r.category === c).length})</option>)}</select>
                <select name="ruleStatusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value as "all" | "active" | "paused")} className="h-9 rounded-md border border-slate-800 bg-slate-950 px-3 text-[10px] font-semibold text-slate-200 outline-none"><option value="all">All Statuses</option><option value="active">Status: Active ({activeCount})</option><option value="paused">Status: Paused ({scoringRules.length - activeCount})</option></select>
                <button type="button" onClick={() => notify("Rules sorted by priority")} className="flex h-9 items-center gap-1 rounded-md border border-slate-800 bg-slate-950 px-3 text-[10px] font-semibold text-slate-400 hover:text-white"><Funnel className="text-[13px]" />Priority</button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {filteredRules.length === 0 && <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-[11px] text-slate-500">No scoring rules match these filters.</div>}
              {filteredRules.map(rule => { const trueIdx = scoringRules.findIndex(r => r.id === rule.id); return <ScoringRuleCard key={rule.id} rule={rule} priority={trueIdx + 1} reorderMode={reorderMode} canMoveUp={trueIdx > 0} canMoveDown={trueIdx < scoringRules.length - 1} onMoveUp={() => moveRule(rule.id, -1)} onMoveDown={() => moveRule(rule.id, 1)} onToggleActive={() => toggleRuleActive(rule.id)} onEdit={() => openEditRule(rule)} onDuplicate={() => duplicateRule(rule)} onDelete={() => deleteRule(rule)} menuOpen={menuOpenId === rule.id} onToggleMenu={() => setMenuOpenId(cur => cur === rule.id ? null : rule.id)} />; })}
            </div>
            <button type="button" onClick={openCreateRule} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900 py-3.5 text-[11px] font-semibold text-slate-400 hover:border-orange-500 hover:text-orange-400"><PlusCircle className="text-[16px]" />Define another automated qualification rule</button>
          </div>
          <div className="flex flex-col gap-4 lg:col-span-4">
            <ClassificationThresholdsCard warmStart={warmStart} hotStart={hotStart} onChangeWarm={setWarmStart} onChangeHot={setHotStart} coldPct={tierPct.cold} warmPct={tierPct.warm} hotPct={tierPct.hot} />
            <TestScoreSimulatorCard scoringRules={scoringRules} warmStart={warmStart} hotStart={hotStart} notify={notify} />
          </div>
        </div>
      )}

      {tab === "Classification Thresholds" && <div className="mx-auto w-full max-w-xl"><ClassificationThresholdsCard warmStart={warmStart} hotStart={hotStart} onChangeWarm={setWarmStart} onChangeHot={setHotStart} coldPct={tierPct.cold} warmPct={tierPct.warm} hotPct={tierPct.hot} /></div>}
      {tab === "Test Score Sandbox" && <div className="mx-auto w-full max-w-xl"><TestScoreSimulatorCard scoringRules={scoringRules} warmStart={warmStart} hotStart={hotStart} notify={notify} /></div>}

      {questionDialogOpen && <QualificationQuestionDialog onClose={() => setQuestionDialogOpen(false)} onSave={handleSaveQuestion} />}
      {ruleDialog.open && <ScoringRuleDialog initial={ruleDialog.editing} onClose={() => setRuleDialog({ open: false, editing: null })} onSave={saveRule} />}

      {auditOpen && <div className="fixed inset-0 z-50 flex justify-end">
        <button type="button" aria-label="Close audit log" onClick={() => setAuditOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <aside className="relative flex h-full w-full max-w-sm flex-col gap-4 overflow-y-auto border-l border-slate-800 bg-slate-950 p-5 shadow-2xl">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-500/15 text-orange-400"><ClockCounterClockwise className="text-[16px]" /></span><h2 className="text-[14px] font-bold text-white">Audit Log</h2></div><button type="button" onClick={() => setAuditOpen(false)} aria-label="Close" className="rounded-md p-1 text-slate-500 hover:bg-slate-800"><X className="text-[15px]" /></button></div>
          <div className="flex flex-col gap-2">{auditLog.map(entry => <div key={entry.id} className="flex flex-col gap-0.5 rounded-lg bg-slate-900 p-3"><span className="text-[11px] font-medium text-slate-200">{entry.text}</span><span className="text-[9px] text-slate-500">{entry.time}</span></div>)}</div>
        </aside>
      </div>}
    </div>
  );
}

/* --------------------------------- knowledge base data --------------------------------- */

type SourceTypeKey = "crawl" | "webpage" | "upload" | "faq" | "product" | "text";

const knowledgeSourceTypes: { key: SourceTypeKey; label: string; desc: string; icon: typeof Globe }[] = [
  { key: "crawl", label: "Crawl Website", desc: "Deep crawl domain or sub-paths", icon: Globe },
  { key: "webpage", label: "Add Webpage", desc: "Single URL snapshot or article", icon: LinkSimple },
  { key: "upload", label: "Upload Document", desc: "PDF, DOCX, CSV, Markdown", icon: UploadSimple },
  { key: "faq", label: "Create FAQ", desc: "Q&A question-answer pairs", icon: Question },
  { key: "product", label: "Product / Service", desc: "Service specs & tier limits", icon: Package },
  { key: "text", label: "Paste Text", desc: "Raw markdown or plain copy", icon: TextAlignLeft },
];

interface DiscoveredPage { id: number; title: string; meta: string; path: string; words: number; specIcon: typeof FileText; thin: boolean; selected: boolean; }

const initialDiscoveredPages: DiscoveredPage[] = [
  { id: 1, title: "Booking & Scheduling — How It Works", meta: "Core service overview with setup steps", path: "/services/booking", words: 1840, specIcon: FileText, thin: false, selected: true },
  { id: 2, title: "Service Catalog & Add-Ons", meta: "Full price list with tier breakdown", path: "/services/catalog", words: 2410, specIcon: FileText, thin: false, selected: true },
  { id: 3, title: "Pricing & Response-Time Guarantee", meta: "Plan tiers, deposits, cancellation terms", path: "/pricing", words: 940, specIcon: Table, thin: false, selected: true },
  { id: 4, title: "Customer Stories & Reviews", meta: "Testimonials and before/after outcomes", path: "/reviews", words: 1420, specIcon: ChartBar, thin: false, selected: true },
  { id: 5, title: "Booking Confirmation Screen", meta: "Thank-you redirect after form submission", path: "/services/confirmation", words: 118, specIcon: TextAa, thin: true, selected: false },
];

const maxDepthOptions = ["Depth 1 (Homepage + direct links only)", "Depth 3 (Standard site structure)", "Depth 5 (Comprehensive directory scan)"];
const depthPageBase: Record<string, number> = { [maxDepthOptions[0]]: 9, [maxDepthOptions[1]]: 28, [maxDepthOptions[2]]: 52 };
const pageLimitOptions = ["25 pages", "50 pages (Recommended)", "100 pages (Max on current plan)"];

interface KnowledgeSourceRow { id: number; title: string; text: string; state: "Ready" | "Needs attention"; icon: typeof Globe; }

const initialKnowledgeSources: KnowledgeSourceRow[] = [
  { id: 1, title: "Service catalog", text: "84 pages · refreshed 20 minutes ago", state: "Ready", icon: Globe },
  { id: 2, title: "Onboarding guide.pdf", text: "31 pages · 260 knowledge chunks", state: "Ready", icon: FileText },
  { id: 3, title: "Pricing FAQ", text: "22 manual question/answer pairs", state: "Ready", icon: Question },
  { id: 4, title: "Seasonal promos", text: "2 pages could not be indexed", state: "Needs attention", icon: Warning },
];

function TagChipInput({ tags, onAdd, onRemove, placeholder, tone = "neutral", name }: { tags: string[]; onAdd: (v: string) => void; onRemove: (idx: number) => void; placeholder: string; tone?: "neutral" | "muted"; name: string }) {
  const [draft, setDraft] = useState("");
  function commit() { const v = draft.trim(); if (!v) return; onAdd(v); setDraft(""); }
  return (
    <div className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-2">
      {tags.map((tag, idx) => (
        <span key={`${tag}-${idx}`} className={`inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 font-mono text-[11px] font-semibold ${tone === "muted" ? "text-slate-400" : "text-slate-200"}`}>
          {tag}
          <button type="button" onClick={() => onRemove(idx)} aria-label={`Remove ${tag}`} className="text-slate-500 hover:text-red-400"><X className="text-[12px]" /></button>
        </span>
      ))}
      <input name={name} aria-label={placeholder} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); commit(); } }} onBlur={commit} placeholder={placeholder} className="w-20 flex-1 bg-transparent px-1 text-[11px] text-slate-200 outline-none placeholder:text-slate-500" />
    </div>
  );
}

type SimpleSourceFormProps = { onCancel: () => void; onImport: (entries: { title: string; text: string }[]) => void; notify: (v: string) => void };

function AddWebpageForm({ onCancel, onImport, notify }: SimpleSourceFormProps) {
  const [url, setUrl] = useState("");
  const [fetched, setFetched] = useState<string | null>(null);

  function fetchPreview() { if (!url.trim()) { notify("Enter a URL to fetch"); return; } setFetched(`Snapshot captured: ${url.trim()}`); notify("Webpage snapshot fetched"); }
  function addSource() { if (!fetched) { notify("Fetch a preview before adding"); return; } onImport([{ title: url.trim(), text: "Single webpage snapshot · Ready" }]); notify("Webpage added to knowledge base"); }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-2.5"><div className="rounded-lg bg-orange-500 p-1.5 text-white"><LinkSimple className="text-[16px]" /></div><h2 className="text-[15px] font-bold text-white">Add Webpage</h2></div>
      <label className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold text-slate-200">Page URL</span>
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 focus-within:ring-2 focus-within:ring-orange-500">
          <input name="webpageUrl" value={url} onChange={e => { setUrl(e.target.value); setFetched(null); }} placeholder="https://yourdomain.com/article" className="flex-1 bg-transparent py-1.5 text-[13px] text-slate-200 outline-none placeholder:text-slate-500" />
          <button type="button" onClick={fetchPreview} className="rounded-lg bg-orange-500 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-orange-600">Fetch Preview</button>
        </div>
      </label>
      {fetched && <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2.5 text-[12px] font-medium text-emerald-400"><CheckCircle weight="fill" className="text-[16px]" />{fetched}</div>}
      <div className="mt-1 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-slate-300 hover:bg-slate-800">Cancel</button>
        <button type="button" onClick={addSource} className="rounded-xl bg-orange-500 px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600">Add Source</button>
      </div>
    </div>
  );
}

function UploadDocumentForm({ onCancel, onImport, notify }: SimpleSourceFormProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function addSource() { if (!fileName) { notify("Choose a file before adding"); return; } onImport([{ title: fileName, text: "Uploaded document · Ready" }]); notify(`${fileName} added to knowledge base`); }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-2.5"><div className="rounded-lg bg-orange-500 p-1.5 text-white"><UploadSimple className="text-[16px]" /></div><h2 className="text-[15px] font-bold text-white">Upload Document</h2></div>
      <button type="button" onClick={() => inputRef.current?.click()} className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 py-10 text-center hover:border-orange-500 hover:bg-orange-500/5">
        <UploadSimple className="text-[28px] text-orange-400" />
        <span className="text-[13px] font-semibold text-slate-200">{fileName ?? "Click to choose a file"}</span>
        <span className="text-[11px] text-slate-500">PDF, DOCX, CSV, or Markdown</span>
      </button>
      <input ref={inputRef} type="file" name="knowledgeDocumentUpload" aria-label="Upload document" accept=".pdf,.doc,.docx,.csv,.md" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name ?? null)} />
      <div className="mt-1 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-slate-300 hover:bg-slate-800">Cancel</button>
        <button type="button" onClick={addSource} className="rounded-xl bg-orange-500 px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600">Add Source</button>
      </div>
    </div>
  );
}

function CreateFaqForm({ onCancel, onImport, notify }: SimpleSourceFormProps) {
  const [pairs, setPairs] = useState<{ q: string; a: string }[]>([{ q: "", a: "" }]);

  function updatePair(idx: number, field: "q" | "a", value: string) { setPairs(cur => cur.map((p, i) => (i === idx ? { ...p, [field]: value } : p))); }
  function addPair() { setPairs(cur => [...cur, { q: "", a: "" }]); }
  function removePair(idx: number) { setPairs(cur => cur.filter((_, i) => i !== idx)); }
  function addSource() {
    const filled = pairs.filter(p => p.q.trim() && p.a.trim());
    if (filled.length === 0) { notify("Add at least one complete Q&A pair"); return; }
    onImport([{ title: `FAQ set (${filled.length} pairs)`, text: "Manually curated question-answer pairs" }]);
    notify("FAQ set added to knowledge base");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-2.5"><div className="rounded-lg bg-orange-500 p-1.5 text-white"><Question className="text-[16px]" /></div><h2 className="text-[15px] font-bold text-white">Create FAQ</h2></div>
      <div className="flex flex-col gap-3">
        {pairs.map((pair, idx) => (
          <div key={idx} className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Pair {idx + 1}</span>{pairs.length > 1 && <button type="button" onClick={() => removePair(idx)} aria-label={`Remove pair ${idx + 1}`} className="text-slate-500 hover:text-red-400"><Trash className="text-[13px]" /></button>}</div>
            <input name={`faqQuestion-${idx}`} value={pair.q} onChange={e => updatePair(idx, "q", e.target.value)} placeholder="Question" className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-2 text-[12px] text-slate-200 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-orange-500" />
            <textarea name={`faqAnswer-${idx}`} value={pair.a} onChange={e => updatePair(idx, "a", e.target.value)} placeholder="Answer" rows={2} className="resize-none rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-2 text-[12px] text-slate-200 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-orange-500" />
          </div>
        ))}
        <button type="button" onClick={addPair} className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-700 py-2.5 text-[12px] font-semibold text-slate-400 hover:border-orange-500 hover:text-orange-400"><PlusCircle className="text-[15px]" />Add another pair</button>
      </div>
      <div className="mt-1 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-slate-300 hover:bg-slate-800">Cancel</button>
        <button type="button" onClick={addSource} className="rounded-xl bg-orange-500 px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600">Add Source</button>
      </div>
    </div>
  );
}

function ProductServiceForm({ onCancel, onImport, notify }: SimpleSourceFormProps) {
  const [name, setName] = useState("");
  const [tier, setTier] = useState("");
  const [description, setDescription] = useState("");

  function addSource() { if (!name.trim()) { notify("Add a product or service name"); return; } onImport([{ title: name.trim(), text: tier.trim() ? `${tier.trim()} · Product/Service spec` : "Product/Service spec" }]); notify(`${name.trim()} added to knowledge base`); }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-2.5"><div className="rounded-lg bg-orange-500 p-1.5 text-white"><Package className="text-[16px]" /></div><h2 className="text-[15px] font-bold text-white">Product / Service</h2></div>
      <label className="flex flex-col gap-2"><span className="text-[13px] font-semibold text-slate-200">Name</span><input name="productName" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Premium Membership" className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-[13px] text-slate-200 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
      <label className="flex flex-col gap-2"><span className="text-[13px] font-semibold text-slate-200">Tier / Pricing summary</span><input name="productTier" value={tier} onChange={e => setTier(e.target.value)} placeholder="e.g. $189/mo · unlimited visits" className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-[13px] text-slate-200 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
      <label className="flex flex-col gap-2"><span className="text-[13px] font-semibold text-slate-200">Description</span><textarea name="productDescription" value={description} onChange={e => setDescription(e.target.value)} placeholder="What this product/service includes..." rows={4} className="resize-none rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-[13px] text-slate-200 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
      <div className="mt-1 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-slate-300 hover:bg-slate-800">Cancel</button>
        <button type="button" onClick={addSource} className="rounded-xl bg-orange-500 px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600">Add Source</button>
      </div>
    </div>
  );
}

function PasteTextForm({ onCancel, onImport, notify }: SimpleSourceFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const wordCount = body.trim() ? body.trim().split(/\s+/).filter(Boolean).length : 0;

  function addSource() { if (!title.trim() || !body.trim()) { notify("Add a title and some text before saving"); return; } onImport([{ title: title.trim(), text: `Pasted text · ${wordCount} words` }]); notify(`${title.trim()} added to knowledge base`); }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-2.5"><div className="rounded-lg bg-orange-500 p-1.5 text-white"><TextAlignLeft className="text-[16px]" /></div><h2 className="text-[15px] font-bold text-white">Paste Text</h2></div>
      <label className="flex flex-col gap-2"><span className="text-[13px] font-semibold text-slate-200">Title</span><input name="pasteTextTitle" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Refund Policy" className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-[13px] text-slate-200 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
      <label className="flex flex-col gap-2">
        <div className="flex items-center justify-between"><span className="text-[13px] font-semibold text-slate-200">Raw markdown or plain copy</span><span className="text-[11px] text-slate-500">{wordCount} words</span></div>
        <textarea name="pasteTextBody" value={body} onChange={e => setBody(e.target.value)} placeholder="Paste or type your content here..." rows={8} className="resize-none rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-[13px] text-slate-200 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-orange-500" />
      </label>
      <div className="mt-1 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-slate-300 hover:bg-slate-800">Cancel</button>
        <button type="button" onClick={addSource} className="rounded-xl bg-orange-500 px-5 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600">Add Source</button>
      </div>
    </div>
  );
}

function AddKnowledgeSourcePage({ onCancel, onImport, notify }: { onCancel: () => void; onImport: (entries: { title: string; text: string }[]) => void; notify: (v: string) => void }) {
  const [activeType, setActiveType] = useState<SourceTypeKey>("crawl");

  const [targetUrl, setTargetUrl] = useState("https://ailqs.com/services");
  const [includePatterns, setIncludePatterns] = useState(["services/*", "reviews/*", "pricing/*"]);
  const [excludePatterns, setExcludePatterns] = useState(["blog/tag/*", "login*", "privacy*"]);
  const [maxDepth, setMaxDepth] = useState(maxDepthOptions[1]);
  const [pageLimit, setPageLimit] = useState(pageLimitOptions[1]);
  const [manualReview, setManualReview] = useState(true);
  const [followSubdomains, setFollowSubdomains] = useState(false);
  const [scanNonce, setScanNonce] = useState(0);
  const [lastScanned, setLastScanned] = useState("2 minutes ago");
  const [discoveredPages, setDiscoveredPages] = useState<DiscoveredPage[]>(initialDiscoveredPages);
  const [pageSearch, setPageSearch] = useState("");

  const allowedDomain = (() => { try { return new URL(targetUrl).hostname || "ailqs.com"; } catch { return "ailqs.com"; } })();
  const pageLimitCap = Number(pageLimit.match(/\d+/)?.[0] ?? 50);
  const pagesDetected = Math.min(pageLimitCap, depthPageBase[maxDepth] + (scanNonce % 3));
  const purity = Math.min(99, 80 + includePatterns.length * 2);
  const tokenVolume = Math.round(pagesDetected * (46200 / 28));
  const vectorChunks = Math.round(pagesDetected * (124 / 28));
  const estimatedSeconds = Math.max(5, Math.round(pagesDetected * (75 / 28)));
  const estimatedTimeLabel = `${Math.floor(estimatedSeconds / 60)}m ${estimatedSeconds % 60}s`;
  const readinessCurrent = 92;
  const readinessImpact = Number(((pagesDetected / 28) * 4).toFixed(1));
  const readinessProjected = Math.min(100, readinessCurrent + readinessImpact);

  const q = pageSearch.trim().toLowerCase();
  const filteredPages = q ? discoveredPages.filter(p => [p.title, p.path, p.meta].join(" ").toLowerCase().includes(q)) : discoveredPages;

  const selectedCount = discoveredPages.filter(p => p.selected).length;
  const thinExcluded = discoveredPages.filter(p => p.thin && !p.selected).length;
  const allChecked = discoveredPages.length > 0 && discoveredPages.every(p => p.selected);

  function toggleAll() { setDiscoveredPages(cur => cur.map(p => ({ ...p, selected: !allChecked }))); }
  function togglePage(id: number) { setDiscoveredPages(cur => cur.map(p => (p.id === id ? { ...p, selected: !p.selected } : p))); }
  function removePage(id: number) { setDiscoveredPages(cur => cur.filter(p => p.id !== id)); notify("Page removed from crawl scope"); }
  function excludeSelected() { setDiscoveredPages(cur => cur.map(p => (p.selected ? { ...p, selected: false } : p))); notify("Selected pages excluded from import"); }
  function resetToDefault() { setDiscoveredPages(initialDiscoveredPages); setPageSearch(""); notify("Discovered pages reset to default"); }
  function rescanSitemap() { setScanNonce(n => n + 1); setLastScanned("Just now"); notify("Sitemap re-scanned"); }
  function importCrawl() {
    if (selectedCount === 0) { notify("Select at least one page to import"); return; }
    onImport([{ title: `Crawl: ${allowedDomain}`, text: `${selectedCount} pages imported · ~${tokenVolume.toLocaleString()} tokens indexed` }]);
    notify(`${selectedCount} pages imported from ${allowedDomain}`);
  }

  const activeMeta = knowledgeSourceTypes.find(t => t.key === activeType)!;

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
            <button type="button" onClick={onCancel} className="hover:text-white">Knowledge Base</button>
            <CaretRight className="text-[11px]" />
            <span>Add Source</span>
            <CaretRight className="text-[11px]" />
            <span className="font-semibold text-orange-400">{activeMeta.label}</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Add Knowledge Source</h1>
          <p className="max-w-2xl text-[12px] text-slate-500">Expand the agent&rsquo;s training context by crawling websites, uploading documents, or curating structured knowledge.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-slate-300 hover:bg-slate-800">Cancel</button>
          <button type="button" onClick={() => notify("Draft saved")} className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-[12px] font-semibold text-slate-200 hover:bg-slate-800">Save Draft</button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Select Source Type</span>
          <span className="text-[11px] text-slate-500">6 integration vectors available</span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {knowledgeSourceTypes.map(t => {
            const Icon = t.icon;
            const active = t.key === activeType;
            return (
              <button key={t.key} type="button" onClick={() => setActiveType(t.key)} className={`group relative flex flex-col rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${active ? "border-orange-500/40 bg-orange-500/10" : "border-slate-800 bg-slate-900 hover:bg-slate-800/60"}`}>
                <div className="mb-3 flex items-center justify-between">
                  <div className={`grid h-9 w-9 place-items-center rounded-xl ${active ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-300 group-hover:bg-orange-500/20 group-hover:text-orange-300"}`}><Icon className="text-[18px]" /></div>
                  {active ? <span className="grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-white"><Check weight="bold" className="text-[11px]" /></span> : <span className="h-2 w-2 rounded-full bg-slate-700" />}
                </div>
                <span className={`text-[14px] font-semibold ${active ? "text-orange-300" : "text-white group-hover:text-orange-300"}`}>{t.label}</span>
                <span className="mt-1 text-[11px] text-slate-500">{t.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeType === "crawl" && (
        <>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-orange-500 p-1.5 text-white"><GearSix className="text-[16px]" /></div>
                  <h2 className="text-[15px] font-bold text-white">Crawl Parameters &amp; Scope</h2>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Production Engine</span>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold text-slate-200">Target Root or Sub-directory URL</span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 focus-within:ring-2 focus-within:ring-orange-500">
                  <span className="mr-1 rounded-lg bg-slate-800 px-2 py-1 font-mono text-[10px] font-bold text-orange-300">HTTPS</span>
                  <input name="crawlTargetUrl" value={targetUrl} onChange={e => setTargetUrl(e.target.value)} placeholder="e.g. https://yourdomain.com/docs" className="flex-1 bg-transparent py-1.5 text-[13px] text-slate-200 outline-none placeholder:text-slate-500" />
                  <CheckCircle weight="fill" className="shrink-0 text-[18px] text-emerald-400" />
                </div>
              </label>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between"><span className="text-[13px] font-semibold text-slate-200">Allowed Domain / Host</span><span className="text-[11px] text-slate-500">Lock crawler boundaries</span></div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-[13px] text-slate-200"><Lock className="text-[16px] text-slate-500" /><span className="font-semibold">{allowedDomain}</span><span className="text-[11px] text-slate-500">(and sub-paths)</span></div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-slate-200">Include URL Patterns</span><span className="text-[10px] text-slate-500">Glob syntax</span></div>
                  <TagChipInput name="includeUrlPattern" tags={includePatterns} onAdd={v => setIncludePatterns(cur => [...cur, v])} onRemove={idx => setIncludePatterns(cur => cur.filter((_, i) => i !== idx))} placeholder="+ Add path" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-slate-200">Exclude URL Patterns</span><span className="text-[10px] text-slate-500">Omit noise</span></div>
                  <TagChipInput name="excludeUrlPattern" tags={excludePatterns} onAdd={v => setExcludePatterns(cur => [...cur, v])} onRemove={idx => setExcludePatterns(cur => cur.filter((_, i) => i !== idx))} placeholder="+ Exclude" tone="muted" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-[12px] font-semibold text-slate-200">Max Crawl Depth</span>
                  <select name="crawlMaxDepth" value={maxDepth} onChange={e => setMaxDepth(e.target.value)} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-[13px] text-slate-200 outline-none focus:ring-2 focus:ring-orange-500">
                    {maxDepthOptions.map(o => <option key={o}>{o}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-slate-200">Page Crawl Limit</span><span className="text-[10px] font-semibold text-orange-400">Starter Cap: 100</span></div>
                  <select name="crawlPageLimit" value={pageLimit} onChange={e => setPageLimit(e.target.value)} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-[13px] text-slate-200 outline-none focus:ring-2 focus:ring-orange-500">
                    {pageLimitOptions.map(o => <option key={o}>{o}</option>)}
                  </select>
                </label>
              </div>

              <div className="flex flex-col gap-3 pt-1">
                <div className="flex items-start justify-between gap-4 rounded-xl bg-slate-950 p-3.5">
                  <div className="flex flex-col"><span className="text-[13px] font-semibold text-slate-200">Manual review before indexing &amp; publishing</span><span className="mt-0.5 text-[11px] text-slate-500">Discovered pages will require confirmation before vector embeddings are generated.</span></div>
                  <ToggleSwitch checked={manualReview} onChange={() => setManualReview(v => !v)} label="Manual review before indexing" />
                </div>
                <div className="flex items-start justify-between gap-4 rounded-xl bg-slate-950 p-3.5">
                  <div className="flex flex-col"><span className="text-[13px] font-semibold text-slate-200">Follow subdomains</span><span className="mt-0.5 text-[11px] text-slate-500">Includes host prefixes like <span className="font-mono">booking.{allowedDomain}</span> or <span className="font-mono">app.*</span></span></div>
                  <ToggleSwitch checked={followSubdomains} onChange={() => setFollowSubdomains(v => !v)} label="Follow subdomains" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="flex flex-col gap-5 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400"><Gauge className="text-[16px] text-emerald-400" />Crawl Scope &amp; Estimation</span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">Pre-Flight</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-4xl font-extrabold leading-none tracking-tight text-white">{pagesDetected}</span>
                    <p className="mt-1.5 text-[11px] text-slate-500">Pages detected from sitemap.xml &amp; link hierarchy</p>
                  </div>
                  <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-slate-800/50">
                    <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#34d399" strokeWidth="3.5" strokeDasharray={`${purity}, 100`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-[11px] font-bold text-white">{purity}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-800/50 p-3"><span className="text-[10px] text-slate-500">Token Volume</span><div className="mt-0.5 text-[16px] font-bold text-white">~{tokenVolume.toLocaleString()}</div><span className="text-[10px] text-slate-500">{vectorChunks} vector chunks</span></div>
                  <div className="rounded-xl bg-slate-800/50 p-3"><span className="text-[10px] text-slate-500">Estimated Time</span><div className="mt-0.5 text-[16px] font-bold text-white">{estimatedTimeLabel}</div><span className="text-[10px] text-emerald-400">Instant background execution</span></div>
                </div>
                <div className="flex flex-col gap-2 rounded-xl bg-slate-800/50 p-3.5">
                  <div className="flex items-center justify-between"><span className="text-[12px] font-semibold text-white">Knowledge Readiness Impact</span><span className="text-[12px] font-bold text-emerald-400">+{readinessImpact.toFixed(1)}%</span></div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-700/60">
                    <div className="h-full bg-slate-500/60" style={{ width: `${readinessCurrent}%` }} />
                    <div className="h-full bg-emerald-400" style={{ width: `${readinessImpact}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500"><span>Current: {readinessCurrent}%</span><span className="text-white">Projected: {readinessProjected.toFixed(1)}%</span></div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-400" />Scanned {lastScanned}</span>
                  <button type="button" onClick={rescanSitemap} className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-slate-700"><ArrowClockwise className="text-[13px]" />Re-scan Sitemap</button>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <Brain className="mt-0.5 shrink-0 text-[20px] text-orange-400" />
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-semibold text-white">High-Intent Triage Optimization</span>
                  <p className="text-[11px] leading-relaxed text-slate-500">The agent prioritizes high-intent service specs, pricing pages, and reviews to answer inbound visitor questions with maximum confidence and precision.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-[15px] font-bold text-white">Discovered Pages Review</h3>
                <span className="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-[11px] font-bold text-orange-300">{selectedCount} of {discoveredPages.length} Selected</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative min-w-[220px]">
                  <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-slate-500" />
                  <input name="discoveredPageSearch" value={pageSearch} onChange={e => setPageSearch(e.target.value)} placeholder="Filter discovered URLs..." className="h-8 w-full rounded-lg border border-slate-800 bg-slate-950 pl-8 pr-3 text-[11px] text-slate-200 outline-none placeholder:text-slate-500 focus:ring-1 focus:ring-orange-500" />
                </div>
                <button type="button" onClick={excludeSelected} className="flex h-8 items-center gap-1.5 rounded-lg bg-slate-800 px-3 text-[11px] font-semibold text-slate-200 hover:bg-slate-700"><Funnel className="text-[13px] text-slate-400" />Exclude Selected</button>
                <button type="button" onClick={resetToDefault} className="flex h-8 items-center rounded-lg px-3 text-[11px] font-semibold text-slate-500 hover:bg-slate-800 hover:text-slate-200">Reset to Default</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-y border-slate-800 bg-slate-950/60 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    <th className="w-10 px-4 py-3"><input type="checkbox" name="selectAllDiscoveredPages" checked={allChecked} onChange={toggleAll} aria-label="Select all discovered pages" className="h-4 w-4 accent-orange-500" /></th>
                    <th className="px-4 py-3">Page Title &amp; Document Meta</th>
                    <th className="px-4 py-3">Route / Path</th>
                    <th className="px-4 py-3">Content Spec</th>
                    <th className="px-4 py-3">Vector Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[13px] text-slate-200">
                  {filteredPages.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-[12px] text-slate-500">No discovered pages match this filter.</td></tr>
                  )}
                  {filteredPages.map(page => {
                    const SpecIcon = page.specIcon;
                    return (
                      <tr key={page.id} className={`group transition-colors hover:bg-slate-800/40 ${page.thin ? "bg-slate-950/40" : ""}`}>
                        <td className="px-4 py-3.5"><input type="checkbox" name={`selectPage-${page.id}`} checked={page.selected} onChange={() => togglePage(page.id)} aria-label={`Select ${page.title}`} className="h-4 w-4 accent-orange-500" /></td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col">
                            <span className={`text-[13px] font-semibold group-hover:text-orange-300 ${page.thin ? "text-slate-500" : "text-white"}`}>{page.title}</span>
                            <span className="text-[11px] text-slate-500">{page.meta}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5"><span className="rounded bg-slate-800 px-2 py-1 font-mono text-[10px] text-slate-400">{page.path}</span></td>
                        <td className="px-4 py-3.5"><span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400"><SpecIcon className="text-[14px] text-slate-500" />{page.words.toLocaleString()} words</span></td>
                        <td className="px-4 py-3.5">
                          {page.thin ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-semibold text-amber-300"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" />Warning: Thin Content (&lt;200 words)</span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Ready for Ingestion</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button type="button" onClick={() => notify(`Preview opened for "${page.title}"`)} aria-label={`Preview ${page.title}`} className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-orange-300"><Eye className="text-[16px]" /></button>
                            <button type="button" onClick={() => removePage(page.id)} aria-label={`Remove ${page.title}`} className="rounded-lg p-1 text-slate-500 hover:bg-red-500/10 hover:text-red-400"><Trash className="text-[16px]" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 bg-slate-950/40 p-4 px-6 sm:flex-row">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>Showing <b className="text-slate-200">{filteredPages.length}</b> of <b className="text-slate-200">{pagesDetected}</b> discovered pages</span>
                <span className="text-slate-700">•</span>
                <span className="rounded bg-slate-800 px-2 py-0.5 font-medium text-slate-400">{thinExcluded} excluded (thin content)</span>
              </div>
              <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
                <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2 text-[12px] font-semibold text-slate-200 hover:bg-slate-800">Back to Knowledge Base</button>
                <button type="button" onClick={importCrawl} className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-[12px] font-bold text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:-translate-y-0.5 hover:bg-orange-600"><Sparkle className="text-[16px]" />Import {selectedCount} Pages</button>
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

function KnowledgeBasePage({ notify }: { notify: (v: string) => void }) {
  const [sources, setSources] = useState<KnowledgeSourceRow[]>(initialKnowledgeSources);
  const [view, setView] = useState<"list" | "add">("list");
  const nextSourceId = useRef(5);

  function handleImport(entries: { title: string; text: string }[]) {
    setSources(cur => [...entries.map(e => ({ id: nextSourceId.current++, title: e.title, text: e.text, state: "Ready" as const, icon: CheckCircle })), ...cur]);
    setView("list");
  }
  function removeSource(id: number) { setSources(cur => cur.filter(s => s.id !== id)); notify("Source removed from knowledge base"); }

  if (view === "add") return <AddKnowledgeSourcePage onCancel={() => setView("list")} onImport={handleImport} notify={notify} />;

  const healthy = sources.filter(s => s.state === "Ready").length;

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Knowledge Base</h1>
          <p className="mt-1 text-[12px] text-slate-500">Keep AI answers grounded in approved pages, PDFs, and FAQs.</p>
        </div>
        <button type="button" onClick={() => setView("add")} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600"><Plus className="text-[15px]" />Add Source</button>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-orange-500/15 text-orange-400"><BookOpenText weight="duotone" className="text-[22px]" /></div>
        <div className="flex-1"><h2 className="text-[14px] font-semibold text-white">Knowledge Base at a glance</h2><p className="text-[11px] text-slate-500">{sources.length} source{sources.length === 1 ? "" : "s"} connected</p></div>
        <div className="text-right"><span className="block text-[10px] text-slate-500">Healthy</span><strong className="text-[16px] text-white">{healthy}/{sources.length}</strong></div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4"><h2 className="text-[14px] font-semibold text-white">Configuration and health</h2></div>
        {sources.length === 0 && <p className="px-5 py-8 text-center text-[12px] text-slate-500">No knowledge sources yet — add your first source above.</p>}
        {sources.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-center gap-3 border-b border-slate-800 px-5 py-4 last:border-0 hover:bg-slate-800/30">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-500/15 text-orange-400"><Icon /></span>
              <span className="flex-1"><b className="block text-[12px] text-white">{item.title}</b><small className="text-[10px] text-slate-500">{item.text}</small></span>
              <em className={`rounded-full px-2.5 py-1 text-[10px] font-semibold not-italic ${item.state === "Needs attention" ? "bg-red-500/15 text-red-400" : "bg-slate-800 text-slate-300"}`}>{item.state}</em>
              <button type="button" onClick={() => removeSource(item.id)} aria-label={`Remove ${item.title}`} className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400"><Trash className="text-[15px]" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModulePage({ title, content, notify }: { title: string; content: { intro: string; icon: typeof Globe; rows: { title: string; text: string; state: string; tone: "ok" | "warn" | "info" }[] }; notify: (v: string) => void }) {
  const Icon = content.icon;
  const healthy = content.rows.filter(r => r.tone !== "warn").length;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-white">{title}</h1><p className="mt-0.5 text-[12px] text-slate-500">{content.intro}</p></div>
        <button onClick={() => notify(`${title} configuration opened`)} className="flex items-center gap-1.5 rounded-md bg-orange-500 px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600"><Plus className="text-[14px]" />Add configuration</button>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-orange-500/10 text-orange-400"><Icon weight="duotone" className="text-[24px]" /></div>
          <div className="min-w-0 flex-1"><h2 className="text-[14px] font-semibold text-white">{title} at a glance</h2><p className="mt-0.5 text-[11px] text-slate-500">Static design data demonstrates the default populated state. Production actions connect to the AILQS API.</p></div>
          <div className="shrink-0 text-right"><span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Healthy</span><strong className="text-xl font-bold text-white">{healthy}/{content.rows.length}</strong></div>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="flex h-12 items-center justify-between border-b border-slate-800 px-4"><h3 className="text-[13px] font-semibold text-white">Configuration and health</h3><button className="flex items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-800"><Funnel className="text-[12px]" />Filter</button></div>
        {content.rows.map((row, i) => (
          <button key={row.title} onClick={() => notify(`${row.title} opened`)} className={`flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-800/50 ${i !== content.rows.length - 1 ? "border-b border-slate-800" : ""}`}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange-500/10 text-orange-400">{row.tone === "warn" ? <Warning weight="bold" className="text-[16px]" /> : <CheckCircle weight="bold" className="text-[16px]" />}</span>
            <span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold text-white">{row.title}</span><span className="mt-0.5 block truncate text-[11px] text-slate-500">{row.text}</span></span>
            <em className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold not-italic ${row.tone === "warn" ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"}`}>{row.state}</em>
            <ArrowRight className="shrink-0 text-[14px] text-slate-600" />
          </button>
        ))}
      </div>
    </div>
  );
}

function LeadDrawer({ lead, close, notify }: { lead: Lead; close: () => void; notify: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [close]);
  const action = priorityAction(lead);
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button aria-label="Close lead detail" onClick={close} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div ref={ref} role="dialog" aria-modal="true" className="relative flex h-full w-full max-w-[440px] flex-col overflow-y-auto border-l border-slate-800 bg-slate-950 shadow-[-24px_0_60px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4"><TempBadge value={lead.temp} /><button onClick={close} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white"><X className="text-[16px]" /></button></div>
        <div className="flex items-center gap-4 px-5 pt-5">
          <ScoreRing value={lead.score} color="#f97316" label="Score" />
          <div className="min-w-0"><h2 className="truncate text-lg font-bold text-white">{lead.name}</h2><p className="truncate text-[12px] text-slate-500">{lead.company} · {lead.interest}</p></div>
        </div>
        <div className="flex gap-2 px-5 pt-5">
          <button onClick={() => { notify(`${lead.name} marked contacted`); close(); }} className="flex-1 rounded-md bg-orange-500 py-2.5 text-[12px] font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-orange-600">Mark contacted</button>
          <button onClick={() => notify(`Follow-up scheduled for ${lead.name}`)} className="flex-1 rounded-md border border-slate-700 bg-slate-900 py-2.5 text-[12px] font-semibold text-slate-200 hover:bg-slate-800">Follow-up</button>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="rounded-xl border border-blue-500/20 bg-blue-950/30 p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-blue-300"><Sparkle weight="fill" className="text-[13px]" />AI brief</div>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-300">{lead.summary}</p>
          </div>
          <div className={`rounded-xl p-4 ${action.classes.includes("red") ? "bg-red-500/10" : action.classes.includes("orange") ? "bg-orange-500/10" : "bg-slate-900"}`}>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400"><Lightning weight="fill" className="text-[13px] text-orange-400" />Next best action</div>
            <p className="mt-2 text-[12px] font-semibold text-white">{action.label} — {lead.followup === "Overdue" ? "this is already overdue." : `due ${lead.followup.toLowerCase()}.`}</p>
          </div>
          <div className="space-y-2 border-t border-slate-800 pt-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Contact</h3>
            <div className="flex items-center justify-between text-[12px] text-slate-300"><span className="flex items-center gap-2"><EnvelopeSimple className="text-[14px] text-slate-500" />{lead.email}</span></div>
            <div className="flex items-center justify-between text-[12px] text-slate-300"><span className="flex items-center gap-2"><Phone className="text-[14px] text-slate-500" />{lead.phone}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-4 text-[12px]">
            <div><span className="block text-[10px] uppercase tracking-wide text-slate-500">Owner</span><span className="mt-1 block font-semibold text-white">{lead.owner}</span></div>
            <div><span className="block text-[10px] uppercase tracking-wide text-slate-500">Status</span><span className="mt-1 block font-semibold text-white">{lead.status}</span></div>
            <div><span className="block text-[10px] uppercase tracking-wide text-slate-500">Site</span><span className="mt-1 block font-semibold text-white">{lead.site}</span></div>
            <div><span className="block text-[10px] uppercase tracking-wide text-slate-500">Received</span><span className="mt-1 block font-semibold text-white">{lead.received}</span></div>
          </div>
        </div>
        <div className="mt-auto flex justify-end gap-2 border-t border-slate-800 px-5 py-4"><button onClick={() => notify("Full record opened")} className="flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-2 text-[12px] font-semibold text-slate-200 hover:bg-slate-800">Open full record<ArrowSquareOut className="text-[13px]" /></button></div>
        <div className="border-t border-slate-800 px-5 pb-5 pt-4">
          <button onClick={() => { notify(`${lead.name} archived`); close(); }} className="w-full rounded-md py-2 text-[11px] font-medium text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-400">Archive lead</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- shell ----------------------------------- */

function NavGroup({ label, items, active, onSelect }: { label: string; items: readonly (readonly [string, typeof House])[]; active: string; onSelect: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 mt-5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">{label}</div>
      {items.map(([name, Icon]) => (
        <button key={name} onClick={() => onSelect(name)} className={`mb-0.5 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[12px] font-medium transition-colors ${active === name ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:bg-slate-800/60 hover:text-white"}`}>
          <Icon weight={active === name ? "fill" : "regular"} className="shrink-0 text-[16px]" /><span className="flex-1 truncate">{name}</span>
          {name === "Leads" && <em className="rounded-full bg-orange-500/20 px-1.5 py-0.5 text-[9px] font-bold not-italic text-orange-300">8</em>}
        </button>
      ))}
    </div>
  );
}

export default function IgnitionDesk() {
  const [section, setSection] = useState("Dashboard");
  const [openLead, setOpenLead] = useState<Lead | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function notify(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  const content = genericContent[section];

  return (
    <div className="ignition-desk min-h-dvh bg-slate-950 font-sans text-slate-200">
      <style>{`.ignition-desk ::selection{background:#f97316;color:#fff}.ignition-desk ::-webkit-scrollbar{width:10px;height:10px}.ignition-desk ::-webkit-scrollbar-thumb{background:#334155;border:3px solid transparent;background-clip:padding-box;border-radius:999px}`}</style>

      {mobileNav && <button aria-label="Close navigation" onClick={() => setMobileNav(false)} className="fixed inset-0 z-40 bg-black/60 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800/60 bg-slate-950 transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-14 items-center gap-2.5 border-b border-slate-800/60 px-4 lg:h-20">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]"><Command weight="bold" className="text-[18px]" /></div>
          <div className="min-w-0"><div className="truncate text-[14px] font-bold text-white">AILQS</div><div className="truncate text-[9px] uppercase tracking-widest text-slate-500">Ignition Desk</div></div>
        </div>
        <nav className="h-[calc(100%-56px)] overflow-y-auto px-3 pb-6 lg:h-[calc(100%-80px)]">
          <NavGroup label="Workspace" items={nav} active={section} onSelect={v => { setSection(v); setMobileNav(false); }} />
          <NavGroup label="Administration" items={navAdmin} active={section} onSelect={v => { setSection(v); setMobileNav(false); }} />
          <div className="mx-1 mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Auto-triage online</div>
            <p className="mt-1.5 text-[10px] text-slate-500">3 websites connected · all systems operational</p>
          </div>
        </nav>
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-800/60 bg-slate-950/95 px-4 backdrop-blur lg:left-64 lg:h-20 lg:px-8">
        <button aria-label="Open navigation" onClick={() => setMobileNav(true)} className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-slate-800 text-slate-400 lg:hidden"><SlidersHorizontal className="text-[16px]" /></button>
        <label className="relative hidden max-w-md flex-1 sm:block"><MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-slate-500" /><input name="globalSearch" placeholder="Search leads, companies..." className="h-9 w-full rounded-md border border-slate-800 bg-slate-900 pl-9 pr-3 text-[12px] text-slate-200 placeholder:text-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-orange-500" /></label>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button onClick={() => { setNotifOpen(v => !v); setAccountOpen(false); }} aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-md border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"><Bell className="text-[16px]" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-950" /></button>
            {notifOpen && <div className="absolute right-0 top-11 w-80 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><h4 className="text-[12px] font-semibold text-white">Notifications</h4><button onClick={() => setNotifOpen(false)} aria-label="Close"><X className="text-[14px] text-slate-500" /></button></div>
              <button onClick={() => { setOpenLead(leads[2]); setNotifOpen(false); }} className="flex w-full items-start gap-2.5 border-b border-slate-800 px-4 py-3 text-left hover:bg-slate-800/50"><Fire weight="fill" className="mt-0.5 text-[14px] text-red-400" /><span className="text-[11px] text-slate-300"><b className="text-white">Marcus Webb</b> callback is overdue by 21 minutes</span></button>
              <button className="flex w-full items-start gap-2.5 px-4 py-3 text-left hover:bg-slate-800/50"><Warning weight="fill" className="mt-0.5 text-[14px] text-amber-400" /><span className="text-[11px] text-slate-300">2 webhook deliveries failed on the sales integration</span></button>
            </div>}
          </div>
          <div className="relative">
            <button onClick={() => { setAccountOpen(v => !v); setNotifOpen(false); }} className="grid h-9 w-9 place-items-center rounded-md bg-slate-800 text-[11px] font-bold text-white hover:bg-slate-700">AK</button>
            {accountOpen && <div className="absolute right-0 top-11 w-56 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 py-1.5 shadow-2xl">
              <div className="border-b border-slate-800 px-3.5 py-2.5"><div className="text-[12px] font-semibold text-white">Arjun Kumar</div><div className="text-[10px] text-slate-500">Workspace admin</div></div>
              <button onClick={() => { setSection("Settings"); setAccountOpen(false); }} className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-[12px] text-slate-300 hover:bg-slate-800"><GearSix className="text-[14px] text-slate-500" />Settings</button>
              <button onClick={() => notify("Signed out")} className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-[12px] text-red-400 hover:bg-slate-800"><SignOut className="text-[14px]" />Sign out</button>
            </div>}
          </div>
        </div>
      </header>

      <main className="pt-14 lg:pl-64 lg:pt-20">
        <div className="px-4 pb-10 pt-5 lg:px-8 lg:pt-8">
          {section === "Dashboard" && <Dashboard onOpenLead={setOpenLead} notify={notify} />}
          {section === "Inbox" && <InboxPage onOpenLead={setOpenLead} notify={notify} />}
          {section === "Leads" && <LeadsPage onOpenLead={setOpenLead} notify={notify} />}
          {section === "Follow-ups" && <FollowUpsPage notify={notify} />}
          {section === "AI Agent" && <AiAgentPage notify={notify} />}
          {section === "Qualification" && <QualificationPage notify={notify} />}
          {section === "Knowledge Base" && <KnowledgeBasePage notify={notify} />}
          {content && <ModulePage title={section} content={content} notify={notify} />}
        </div>
      </main>

      {openLead && <LeadDrawer lead={openLead} close={() => setOpenLead(null)} notify={notify} />}

      {toast && <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2.5 text-[12px] font-medium text-white shadow-2xl">{toast}</div>}
    </div>
  );
}
