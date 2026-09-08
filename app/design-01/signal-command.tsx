"use client";

/*
THESIS: Signal Command makes every new lead legible as an urgent, evidence-backed sales decision rather than another dashboard row.
OWN-WORLD: A calm sales operations room: dark persistent navigation, light analytical work surfaces, precise status language, and restrained indigo/cyan signals.
STORY: Enter through the signal queue, understand qualification performance, open a lead, inspect why it scored, then record the next action and verify delivery.
FIRST VIEWPORT: The signal queue leads; KPI evidence and qualification trend support it; recent leads begin the operational handoff without promotional or infrastructure noise.
FORM: Fixed command shell, wide operational canvas, grouped signal strip, analytical field, dense lead ledger, and right-side evidence drawer. Concept-roll seed: 19130d3d. User-pinned Signal Command overrides the roll assignment.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
*/

import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ArrowsLeftRight, ArrowClockwise, ArrowSquareOut, Bell, BookOpenText, Brain, Buildings, CalendarCheck, CaretDown, ChartLineUp,
  CaretRight, Check, CheckCircle, Circle, CirclesThreePlus, Clock, Command, Copy, CreditCard, DotsThree, DownloadSimple,
  EnvelopeSimple, Export, Eye, FileText, Fire, Funnel, GearSix, Globe, House,
  Lifebuoy, Lightning, Lock, MagnifyingGlass, NotePencil, PaintBrush, Paperclip, PaperPlaneRight, PaperPlaneTilt,
  Plus, Robot, Rows, SignOut, SlidersHorizontal, Smiley, Sparkle, SpinnerGap, Target,
  SidebarSimple, TestTube, UserCircle, Users, Warning,
  WebhooksLogo, X, XCircle
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";

type Lead = {
  id: number; name: string; company: string; initials: string; color: string;
  classification: "Hot" | "Warm" | "Cold"; score: number; interest: string;
  site: string; owner: string; status: string; received: string; followup: string;
  summary: string; email: string; phone: string;
};

const leads: Lead[] = [
  { id: 1, name: "Priya Sharma", company: "Northstar Labs", initials: "PS", color: "#E0E7FF", classification: "Hot", score: 92, interest: "Enterprise onboarding", site: "ailqs.com", owner: "Maya", status: "New", received: "4m ago", followup: "Today, 2:30 PM", summary: "Evaluating AI qualification for three product sites. Has budget approval and wants to launch within two weeks.", email: "priya@northstarlabs.co", phone: "+91 98765 44210" },
  { id: 2, name: "Liam Chen", company: "Frame & Field", initials: "LC", color: "#CFFAFE", classification: "Warm", score: 74, interest: "Agency lead routing", site: "studio.ailqs.com", owner: "You", status: "Contacted", received: "18m ago", followup: "Tomorrow", summary: "Runs a growing design agency and needs leads separated by service line. Timeline is this quarter; budget needs confirmation.", email: "liam@framefield.design", phone: "+1 415 555 0192" },
  { id: 3, name: "Amelia Brooks", company: "Reform Health", initials: "AB", color: "#FCE7F3", classification: "Hot", score: 86, interest: "Patient enquiries", site: "ailqs.com", owner: "Jon", status: "New", received: "41m ago", followup: "Overdue", summary: "High-intent enquiry for a compliant website assistant. Asked detailed implementation questions and requested a demonstration.", email: "amelia@reformhealth.io", phone: "+44 7700 900247" },
  { id: 4, name: "Noah Williams", company: "Arcwell Homes", initials: "NW", color: "#FEF3C7", classification: "Warm", score: 61, interest: "Property enquiries", site: "property.ailqs.com", owner: "Unassigned", status: "New", received: "1h ago", followup: "Not set", summary: "Interested in routing buyer enquiries by location. Decision timeline and budget have not been provided.", email: "noah@arcwellhomes.com", phone: "+61 412 555 018" },
  { id: 5, name: "Sofia Martinez", company: "Mesa Commerce", initials: "SM", color: "#DCFCE7", classification: "Cold", score: 38, interest: "Product support", site: "studio.ailqs.com", owner: "You", status: "Qualified", received: "2h ago", followup: "Sep 6", summary: "Researching options for a future support project. No active budget or confirmed purchase window.", email: "sofia@mesacommerce.mx", phone: "+52 55 5555 0134" },
  { id: 6, name: "Ethan Okafor", company: "Parcel Grid", initials: "EO", color: "#EDE9FE", classification: "Hot", score: 81, interest: "Logistics qualification", site: "ailqs.com", owner: "Maya", status: "Contacted", received: "3h ago", followup: "Friday", summary: "Needs qualification across regional sales teams. Strong fit and buying intent, but technical validation is still required.", email: "ethan@parcelgrid.africa", phone: "+234 803 555 0188" },
];

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
    leadId: 1, status: "AI active", liveOn: "ailqs.com/pricing", ip: "Mumbai, IN", browser: "Chrome/macOS", previewTime: "4m ago", needsHandoff: true,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Priya Sharma", time: "10:14 AM", text: "Hi! We're evaluating AI qualification for three product sites. How fast can this go live?" },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "10:15 AM", text: "Hi Priya! Most workspaces launch across multiple sites in under a week — one qualification script, mapped to each site's own widget.", sources: "2 sources used: Multi-site setup guide, Widget install steps · 97% confidence" },
      { id: inboxMsgId++, from: "visitor", author: "Priya Sharma", time: "10:17 AM", text: "Good — budget's approved. We'd want to launch within two weeks. Can we see a demo this week?" },
      { id: inboxMsgId++, from: "note", author: "Maya Patel", time: "10:19 AM", text: "Budget approved, timeline tight. Fast-tracking a demo before she talks to other vendors." },
    ],
    aiSummary: "Priya has budget approval for AI qualification across three product sites and wants to launch within two weeks.",
    capturedDetails: [
      { label: "Company", value: "Northstar Labs" },
      { label: "Timeline", value: "2 weeks (Urgent)", danger: true },
      { label: "Email", value: "priya@northstarlabs.co", span2: true },
      { label: "Phone", value: "+91 98765 44210" },
      { label: "Location", value: "Mumbai, IN" },
      { label: "Declared budget", value: "Approved, not disclosed", span2: true },
    ],
    scoringBreakdown: [
      { label: "Budget approved", points: 25, done: true },
      { label: "Timeline within 30 days", points: 20, done: true },
      { label: "Multi-site rollout confirmed", points: 20, done: true },
      { label: "CRM synced", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: High (93%)" }, { kind: "warning", text: "Wants a demo before signing" }],
    nextBestAction: "Offer a 20-minute walkthrough across all three sites today.",
  },
  {
    leadId: 2, status: "Queued", liveOn: null, ip: "San Francisco, CA", browser: "Safari/iOS", previewTime: "18m ago", needsHandoff: false,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Liam Chen", time: "9:52 AM", text: "Can leads be routed to different teammates depending on which service line they ask about?" },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "9:53 AM", text: "Yes — routing rules can match on the visitor's declared service line and assign an owner automatically, with a fallback for anything unmatched.", sources: "1 source used: Routing rules guide" },
      { id: inboxMsgId++, from: "visitor", author: "Liam Chen", time: "9:56 AM", text: "That covers it. We'll confirm budget once the team has seen it." },
    ],
    aiSummary: "Liam runs a growing design agency and needs leads separated by service line before he'll confirm budget.",
    capturedDetails: [
      { label: "Company", value: "Frame & Field" },
      { label: "Timeline", value: "This quarter" },
      { label: "Email", value: "liam@framefield.design", span2: true },
      { label: "Phone", value: "+1 415 555 0192" },
      { label: "Location", value: "San Francisco, CA" },
      { label: "Declared budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "Multi-service routing need identified", points: 20, done: true },
      { label: "Requested walkthrough", points: 15, done: true },
      { label: "Budget confirmed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: Medium (78%)" }],
    nextBestAction: "Send the routing-rules guide and confirm budget on the next call.",
  },
  {
    leadId: 3, status: "Needs handoff", liveOn: null, ip: "London, UK", browser: "Chrome/Windows", previewTime: "41m ago", needsHandoff: true,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Amelia Brooks", time: "9:12 AM", text: "We need a compliant assistant for patient enquiries. What implementation is involved, and can we see it in action?" },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "9:13 AM", text: "AILQS keeps patient conversations on your own domain with no data shared to third parties, and setup is a single script tag. I can get a specialist to walk you through a live demo.", sources: "1 source used: Compliance & data handling overview" },
      { id: inboxMsgId++, from: "visitor", author: "Amelia Brooks", time: "9:16 AM", text: "Please do — we'd like to move quickly on this." },
      { id: inboxMsgId++, from: "note", author: "Jon Bell", time: "9:50 AM", text: "High-intent, compliance-sensitive buyer. Demo request is now 2h overdue — call before she looks elsewhere." },
    ],
    aiSummary: "Amelia has a high-intent, compliance-sensitive enquiry and requested a demonstration that is now overdue.",
    capturedDetails: [
      { label: "Company", value: "Reform Health" },
      { label: "Timeline", value: "< 30 days (Urgent)", danger: true },
      { label: "Email", value: "amelia@reformhealth.io", span2: true },
      { label: "Phone", value: "+44 7700 900247" },
      { label: "Location", value: "London, UK" },
      { label: "Declared budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "Compliance requirement confirmed", points: 20, done: true },
      { label: "Demo requested", points: 20, done: true },
      { label: "Decision maker confirmed", points: 15, done: true },
      { label: "Budget confirmed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: High (91%)" }, { kind: "warning", text: "Follow-up overdue by 2h" }],
    nextBestAction: "Call within 15 minutes and offer a tailored product walkthrough.",
  },
  {
    leadId: 4, status: "Unassigned", liveOn: null, ip: "Sydney, AU", browser: "Chrome/Android", previewTime: "1h ago", needsHandoff: false,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Noah Williams", time: "8:40 AM", text: "Can buyer enquiries be routed by suburb instead of just by agent?" },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "8:41 AM", text: "Yes — location-based routing can match on suburb or postcode and assign the nearest available agent automatically.", sources: "1 source used: Routing rules guide" },
    ],
    aiSummary: "Noah wants buyer enquiries routed by location; decision timeline and budget are still unconfirmed.",
    capturedDetails: [
      { label: "Company", value: "Arcwell Homes" },
      { label: "Timeline", value: "Not confirmed" },
      { label: "Email", value: "noah@arcwellhomes.com", span2: true },
      { label: "Phone", value: "+61 412 555 018" },
      { label: "Location", value: "Sydney, AU" },
      { label: "Declared budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "Multi-region routing need identified", points: 15, done: true },
      { label: "Demo scheduled", points: 15, done: true },
      { label: "Budget confirmed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: Medium (58%)" }],
    nextBestAction: "Confirm the demo time and prep a regional routing walkthrough.",
  },
  {
    leadId: 5, status: "Nurture", liveOn: null, ip: "Mexico City, MX", browser: "Edge/Windows", previewTime: "2h ago", needsHandoff: false,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Sofia Martinez", time: "7:58 AM", text: "Just researching support options for a future project — no budget yet." },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "7:59 AM", text: "No rush at all — happy to send a short overview so you have it on hand when the project starts." },
    ],
    aiSummary: "Sofia is researching a future support project with no active budget or confirmed purchase window.",
    capturedDetails: [
      { label: "Company", value: "Mesa Commerce" },
      { label: "Timeline", value: "Exploratory" },
      { label: "Email", value: "sofia@mesacommerce.mx", span2: true },
      { label: "Phone", value: "+52 55 5555 0134" },
      { label: "Location", value: "Mexico City, MX" },
      { label: "Declared budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "Support use case identified", points: 10, done: true },
      { label: "Budget confirmed", points: 0, done: false },
      { label: "Decision timeline confirmed", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: Low (34%)" }],
    nextBestAction: "Check back after her Sep 6 budget review.",
  },
  {
    leadId: 6, status: "AI active", liveOn: "ailqs.com/integrations", ip: "Lagos, NG", browser: "Chrome/Windows", previewTime: "3h ago", needsHandoff: true,
    messages: [
      { id: inboxMsgId++, from: "visitor", author: "Ethan Okafor", time: "6:30 AM", text: "We need qualification consistent across several regional sales teams. Can scoring rules vary by region?" },
      { id: inboxMsgId++, from: "ai", author: "AILQS AI", time: "6:31 AM", text: "Yes — scoring weights can be tuned per region while keeping one shared qualification script, so reporting still rolls up cleanly.", sources: "1 source used: Scoring rules reference" },
      { id: inboxMsgId++, from: "visitor", author: "Ethan Okafor", time: "6:35 AM", text: "That works. Our technical team still needs to validate the webhook payloads before we commit." },
    ],
    aiSummary: "Ethan needs qualification consistent across regional sales teams; technical validation of webhooks is still pending.",
    capturedDetails: [
      { label: "Company", value: "Parcel Grid" },
      { label: "Timeline", value: "This quarter" },
      { label: "Email", value: "ethan@parcelgrid.africa", span2: true },
      { label: "Phone", value: "+234 803 555 0188" },
      { label: "Location", value: "Lagos, NG" },
      { label: "Declared budget", value: "Not yet shared", span2: true },
    ],
    scoringBreakdown: [
      { label: "Regional rollout confirmed", points: 20, done: true },
      { label: "Buying intent detected", points: 20, done: true },
      { label: "Technical validation complete", points: 0, done: false },
    ],
    aiSignals: [{ kind: "info", text: "Intent: High (85%)" }],
    nextBestAction: "Loop in a solutions engineer to validate webhook payloads before Friday.",
  },
];

const inboxQuickReplies = [
  "Thanks for the detail — I'm pulling together the right resources now.",
  "Great question — looping in a specialist and following up within the hour.",
  "Happy to set up a quick call this week if that's easier than chat.",
];

const nav = [
  ["Dashboard", House], ["Inbox", EnvelopeSimple], ["Leads", Target], ["Follow-ups", CalendarCheck],
  ["AI Agent", Robot], ["Qualification", SlidersHorizontal], ["Knowledge Base", BookOpenText],
  ["Websites & Widget", Globe], ["Analytics", ChartLineUp], ["Integrations", CirclesThreePlus],
  ["Team", Users], ["Notifications", Bell], ["Billing & Usage", CreditCard], ["Settings", GearSix],
] as const;

const childNavigation: Record<string, string[]> = {
  Inbox: ["All conversations", "Qualified", "Archived"],
  Leads: ["All leads", "Hot leads", "Warm leads", "Cold leads"],
  "Follow-ups": ["Upcoming", "Overdue", "Completed"],
  "AI Agent": ["Persona", "Guardrails", "Test & publish"],
  Qualification: ["Questions", "Scoring rules"],
  "Knowledge Base": ["Sources", "Sync history"],
  "Websites & Widget": ["ailqs.com", "studio.ailqs.com", "property.ailqs.com"],
  Analytics: ["Leads", "Conversations", "Sources"],
  Integrations: ["HubSpot", "Webhooks", "Email delivery"],
  Team: ["Members", "Roles"],
  Notifications: ["Lead alerts", "System alerts"],
  "Billing & Usage": ["Usage", "Invoices", "Plans"],
  Settings: ["Workspace", "Security"],
};

const workspaces = [
  { name: "AILQS Demo", initials: "AD", websites: 3 },
  { name: "Northstar Labs", initials: "NL", websites: 2 },
  { name: "Reform Health", initials: "RH", websites: 1 },
];

function ClassBadge({ value }: { value: Lead["classification"] }) {
  return <span className={`class-badge ${value.toLowerCase()}`}>{value === "Hot" ? <Fire weight="fill" /> : <span className="badge-shape" />}{value}</span>;
}

function MiniLine() {
  return <svg className="mini-line" viewBox="0 0 96 32" aria-hidden="true"><path d="M2 26C10 27 13 15 22 18s12 6 19-2 12-9 18-4 8 7 14-1 10-6 21-8" /></svg>;
}

export default function SignalCommand() {
  const [section, setSection] = useState("Dashboard");
  const [selected, setSelected] = useState<Lead>(leads[0]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [drawer, setDrawer] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [status, setStatus] = useState(selected.status);
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [workspaceMenu, setWorkspaceMenu] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces[0]);
  const [accountMenu, setAccountMenu] = useState(false);
  const [stateDialog, setStateDialog] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const stateReturnFocus = useRef<HTMLElement | null>(null);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const workspaceMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!workspaceMenu) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!workspaceMenuRef.current?.contains(event.target as Node)) setWorkspaceMenu(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setWorkspaceMenu(false);
        workspaceMenuRef.current?.querySelector<HTMLButtonElement>(".workspace-switch")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [workspaceMenu]);

  useEffect(() => {
    if (!accountMenu) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) setAccountMenu(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountMenu(false);
        accountMenuRef.current?.querySelector<HTMLButtonElement>(".user-card")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountMenu]);

  const filtered = useMemo(() => leads.filter((lead) => {
    const matches = `${lead.name} ${lead.company} ${lead.interest}`.toLowerCase().includes(query.toLowerCase());
    return matches && (filter === "All" || lead.classification === filter);
  }), [query, filter]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function chooseLead(lead: Lead) {
    returnFocus.current = document.activeElement as HTMLElement;
    setSelected(lead); setStatus(lead.status); setDrawer(true);
  }

  function closeDrawer() {
    setDrawer(false);
    window.setTimeout(() => returnFocus.current?.focus(), 0);
  }

  function openStateDialog() {
    stateReturnFocus.current = document.activeElement as HTMLElement;
    setStateDialog(true);
  }

  function closeStateDialog() {
    setStateDialog(false);
    window.setTimeout(() => stateReturnFocus.current?.focus(), 0);
  }

  function renderNavItem([name, Icon]: typeof nav[number]) {
    const children = childNavigation[name];
    return <div className={`nav-item ${children ? "has-children" : ""}`} key={name}>
      <button
        aria-current={section === name ? "page" : undefined}
        aria-haspopup={children ? "menu" : undefined}
        className={section === name ? "active" : ""}
        data-tooltip={!children ? name : undefined}
        onClick={() => { setSection(name); setMobileNav(false); }}
      >
        <Icon weight={section === name ? "fill" : "regular"} />
        <span>{name}</span>
        {name === "Leads" && <em>14</em>}
        {name === "Notifications" && <i />}
      </button>
      {children && <div className="nav-flyout" role="menu" aria-label={`${name} navigation`}>
        <strong>{name}</strong>
        {children.map(child => <button key={child} role="menuitem" onClick={() => { setSection(name); notify(`${child} opened`); }}>{child}<CaretRight /></button>)}
      </div>}
    </div>;
  }

  const genericSections: Record<string, { title: string; intro: string; icon: typeof Globe; items: { title: string; text: string; state: string }[] }> = {
    "Follow-ups": { title: "Follow-ups", intro: "Keep every promised call, email, and demo on schedule.", icon: CalendarCheck, items: [
      { title: "Amelia Brooks", text: "Hot follow-up call overdue · Reform Health", state: "Overdue" },
      { title: "Priya Sharma", text: "Send onboarding proposal · Northstar Labs", state: "Today, 2:30 PM" },
      { title: "Liam Chen", text: "Confirm routing requirements · Frame & Field", state: "Tomorrow" },
      { title: "Sofia Martinez", text: "Check back after budget review", state: "Sep 6" },
    ] },
    "AI Agent": { title: "AI Agent", intro: "Shape how the assistant greets visitors, asks questions, and hands off to your team.", icon: Robot, items: [
      { title: "Persona and tone", text: "Warm, consultative voice tuned for B2B service sites", state: "Live" },
      { title: "Qualification script", text: "Five guided questions before a lead is scored", state: "Live" },
      { title: "Guardrails", text: "Escalates pricing negotiation and legal questions to a human", state: "Active" },
      { title: "Test and publish", text: "Last published build verified 2 hours ago", state: "Ready" },
    ] },
    Qualification: { title: "Qualification", intro: "Define what the AI asks and make every point in the lead score explainable.", icon: SlidersHorizontal, items: [
      { title: "Budget", text: "Four ranges · Maximum contribution 25 points", state: "25 pts" },
      { title: "Timeline", text: "Immediate to exploratory · Maximum 20 points", state: "20 pts" },
      { title: "Service interest", text: "Mapped across three websites", state: "20 pts" },
      { title: "Company fit", text: "Employee range and industry match", state: "15 pts" },
      { title: "Buying intent", text: "AI-detected from questions and language", state: "20 pts" },
    ] },
    "Knowledge Base": { title: "Knowledge Base", intro: "Keep AI answers grounded in approved website pages, PDFs, and FAQs.", icon: BookOpenText, items: [
      { title: "Product website", text: "128 pages · Refreshed 34 minutes ago", state: "Ready" },
      { title: "Enterprise sales guide.pdf", text: "42 pages · 318 knowledge chunks", state: "Ready" },
      { title: "Pricing FAQ", text: "18 manual questions and answers", state: "Ready" },
      { title: "Property services", text: "3 pages could not be indexed", state: "Warning" },
    ] },
    "Websites & Widget": { title: "Websites & Widget", intro: "Manage installation, widget behavior, and knowledge health across your three sites.", icon: Globe, items: [
      { title: "ailqs.com", text: "Widget detected 2 minutes ago · 1,284 conversations", state: "Live" },
      { title: "studio.ailqs.com", text: "Widget detected 12 minutes ago · 486 conversations", state: "Live" },
      { title: "property.ailqs.com", text: "Knowledge refresh requires attention", state: "Warning" },
    ] },
    Integrations: { title: "Integrations", intro: "Test every destination and recover failed lead deliveries before they cost a sale.", icon: CirclesThreePlus, items: [
      { title: "HubSpot", text: "Connected to AILQS Demo · Last delivery 4m ago", state: "Connected" },
      { title: "Sales webhook", text: "2 of 38 recent deliveries failed", state: "Needs attention" },
      { title: "SMTP email", text: "Google Workspace · Last email 4m ago", state: "Connected" },
    ] },
    Notifications: { title: "Notifications", intro: "Control who hears about new leads, urgent follow-ups, and system failures.", icon: Bell, items: [
      { title: "New Hot lead", text: "Email Maya and notify all admins immediately", state: "Active" },
      { title: "New Warm lead", text: "In-app notification for assigned owner", state: "Active" },
      { title: "Delivery failure", text: "Email workspace admins after first retry", state: "Active" },
    ] },
    Team: { title: "Team", intro: "Keep ownership clear without turning V1 into a complex routing system.", icon: Users, items: [
      { title: "Maya Patel", text: "Admin · 24 assigned leads", state: "Active" },
      { title: "You", text: "Admin · 17 assigned leads", state: "Active" },
      { title: "Jon Bell", text: "Sales representative · 11 assigned leads", state: "Active" },
    ] },
    Settings: { title: "Workspace settings", intro: "Manage workspace identity, timezone, privacy, data, and security.", icon: GearSix, items: [
      { title: "Workspace profile", text: "AILQS Demo · Asia/Kolkata · USD", state: "Complete" },
      { title: "Privacy and consent", text: "Policy URL and widget consent copy", state: "Complete" },
      { title: "Security", text: "Three active sessions · Last sign-in today", state: "Review" },
    ] },
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "mobile-open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`} aria-hidden={drawer || stateDialog || undefined}>
        <div className="sidebar-head">
          <div className="product-mark"><Command weight="bold" /></div>
          <div className="product-name"><strong>AILQS</strong><span>Signal command</span></div>
          <button type="button" className="sidebar-toggle" onClick={() => { setSidebarCollapsed(value => !value); setWorkspaceMenu(false); setAccountMenu(false); }} aria-pressed={sidebarCollapsed} aria-label={sidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"} title={sidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"}><SidebarSimple weight="bold" /></button>
          <button className="icon-button sidebar-close" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X /></button>
        </div>
        <div className="workspace-menu-wrap" ref={workspaceMenuRef}>
          <button
            className="workspace-switch"
            aria-haspopup="menu"
            aria-expanded={workspaceMenu}
            onClick={() => sidebarCollapsed ? setSidebarCollapsed(false) : setWorkspaceMenu(value => !value)}
            aria-label={sidebarCollapsed ? `Expand sidebar — ${currentWorkspace.name}` : undefined}
          >
            <span>{currentWorkspace.initials}</span>
            <span><b>{currentWorkspace.name}</b><small>{currentWorkspace.websites} {currentWorkspace.websites === 1 ? "website" : "websites"}</small></span>
            <CaretDown className={workspaceMenu ? "open" : ""} />
          </button>
          {workspaceMenu && <div className="workspace-menu" role="menu" aria-label="Select workspace">
            <div className="workspace-menu-label">Switch workspace</div>
            {workspaces.map(workspace => {
              const active = workspace.name === currentWorkspace.name;
              return <button
                key={workspace.name}
                role="menuitemradio"
                aria-checked={active}
                className={active ? "active" : ""}
                onClick={() => {
                  setCurrentWorkspace(workspace);
                  setWorkspaceMenu(false);
                  notify(`Switched to ${workspace.name}`);
                }}
              >
                <span>{workspace.initials}</span>
                <span><b>{workspace.name}</b><small>{workspace.websites} {workspace.websites === 1 ? "website" : "websites"}</small></span>
                {active && <Check weight="bold" />}
              </button>;
            })}
            <div className="workspace-menu-divider" />
            <button role="menuitem" onClick={() => { setWorkspaceMenu(false); notify("Create workspace flow opened"); }}>
              <span className="workspace-add"><Plus weight="bold" /></span><span><b>Create workspace</b><small>Set up another team</small></span>
            </button>
          </div>}
        </div>
        <nav aria-label="Primary navigation">
          <p className="nav-label">Workspace</p>
          {nav.slice(0, 10).map(renderNavItem)}
          <p className="nav-label">Administration</p>
          {nav.slice(10).map(renderNavItem)}
        </nav>
        <div className="sidebar-health">
          <div><span className="live-pulse" /><b>Qualification is live</b></div>
          <p>3 websites connected</p>
          <div className="health-bar"><span /></div>
          <small>All core systems operational</small>
        </div>
        <div className="account-menu-wrap" ref={accountMenuRef}>
          {accountMenu && <AccountMenu
            close={() => setAccountMenu(false)}
            openUpgrade={() => { setSection("Billing & Usage"); setAccountMenu(false); setMobileNav(false); }}
            openPersonalization={() => { setSection("Personalization"); setAccountMenu(false); setMobileNav(false); }}
            openProfile={() => { setSection("Profile"); setAccountMenu(false); setMobileNav(false); }}
            openSettings={() => { setSection("Settings"); setAccountMenu(false); setMobileNav(false); }}
            openHelp={() => { setSection("Help"); setAccountMenu(false); setMobileNav(false); }}
            notify={notify}
          />}
          <button className="user-card" aria-haspopup="menu" aria-expanded={accountMenu} aria-label={sidebarCollapsed ? "Expand sidebar — Arjun Kumar account" : undefined} onClick={() => sidebarCollapsed ? setSidebarCollapsed(false) : setAccountMenu(value => !value)}>
            <span>AK</span><div><b>Arjun Kumar</b><small>Workspace admin</small></div><DotsThree weight="bold" />
          </button>
        </div>
      </aside>

      <main className={`app-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`} aria-hidden={drawer || stateDialog || undefined}>
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Rows /></button>
          <div className="global-search"><MagnifyingGlass /><input aria-label="Global search" placeholder="Search leads, companies, conversations..." value={query} onChange={e => setQuery(e.target.value)} /><kbd>⌘ K</kbd></div>
          <div className="top-actions">
            <button className="site-select"><Globe /><span>All websites</span><CaretDown /></button>
            <button className="test-widget" onClick={() => notify("Widget test opened in preview mode")}><TestTube /><span>Test widget</span></button>
            <div className="notification-wrap"><button className="icon-button" aria-expanded={notifications} aria-haspopup="dialog" onClick={() => setNotifications(!notifications)} aria-label="Open notifications"><Bell /><i /></button>{notifications && <NotificationPanel close={() => setNotifications(false)} openLead={() => { setNotifications(false); chooseLead(leads[0]); }} />}</div>
            <div className="top-avatar">AK</div>
          </div>
        </header>

        {section === "Dashboard" && <Overview openLead={chooseLead} setSection={setSection} notify={notify} openStates={openStateDialog} />}
        {section === "Inbox" && <InboxPage openLead={chooseLead} setSection={setSection} notify={notify} />}
        {section === "Leads" && <LeadsView filtered={filtered} filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} chooseLead={chooseLead} notify={notify} />}
        {section === "Analytics" && <AnalyticsPage notify={notify} />}
        {section === "Billing & Usage" && <BillingUsagePage notify={notify} />}
        {(["Personalization", "Profile", "Help"] as const).includes(section as "Personalization" | "Profile" | "Help") && <AccountPage page={section as "Personalization" | "Profile" | "Help"} notify={notify} />}
        {genericSections[section] && <ModuleView key={section} {...genericSections[section]} notify={notify} />}
      </main>

      {drawer && <LeadDrawer lead={selected} status={status} setStatus={setStatus} close={closeDrawer} notify={notify} />}
      {drawer && <button className="drawer-scrim" tabIndex={-1} aria-label="Close lead detail" onClick={closeDrawer} />}
      {stateDialog && <StateDialog close={closeStateDialog} />}
      {toast && <div className="toast" role="status"><CheckCircle weight="fill" />{toast}</div>}
    </div>
  );
}

function Overview({ openLead, setSection, notify, openStates }: { openLead: (lead: Lead) => void; setSection: (v: string) => void; notify: (v: string) => void; openStates:()=>void }) {
  const channels = [
    { name: "Organic search", leads: 184, pct: 43, dot: "c1" },
    { name: "Paid campaigns", leads: 142, pct: 33, dot: "c2" },
    { name: "Referral", leads: 68, pct: 16, dot: "c3" },
    { name: "Direct & widget", leads: 34, pct: 8, dot: "c4" },
  ];
  return <div className="page overview-page">
    <div className="page-heading">
      <div><Link href="/" className="back-gallery"><ArrowLeft /> Design gallery</Link><h1>Good morning, Arjun.</h1><p>Here’s what needs your attention across three websites.</p></div>
      <div className="heading-actions"><button className="date-button"><Clock /> Last 30 days <CaretDown /></button><button className="secondary-button" onClick={openStates}><Eye /> States</button><button className="secondary-button" onClick={() => notify("Dashboard report exported")}><Export /> Export</button></div>
    </div>

    <section className="attention-strip">
      <div className="attention-title"><span><Lightning weight="fill" /></span><div><h2>Signal queue</h2><p>Three items need action now.</p></div></div>
      <button onClick={() => openLead(leads[0])}><span className="signal-icon hot"><Fire weight="fill" /></span><span><b>Priya Sharma is ready to buy</b><small>92 score · Waiting 4 minutes</small></span><ArrowRight /></button>
      <button onClick={() => openLead(leads[2])}><span className="signal-icon late"><Clock weight="fill" /></span><span><b>Hot follow-up is overdue</b><small>Reform Health · 21 minutes late</small></span><ArrowRight /></button>
      <button onClick={() => setSection("Integrations")}><span className="signal-icon fail"><WebhooksLogo weight="fill" /></span><span><b>2 webhook deliveries failed</b><small>Automatic retry paused</small></span><ArrowRight /></button>
    </section>

    <section className="metric-grid">
      <article><div><span>New leads</span><Target /></div><strong>428</strong><p><b>+12.4%</b> from previous period</p><MiniLine /></article>
      <article><div><span>Qualified leads</span><CheckCircle /></div><strong>267</strong><p><b>+8.7%</b> from previous period</p><MiniLine /></article>
      <article><div><span>Hot leads</span><Fire /></div><strong>74</strong><p><b>+16.2%</b> high intent</p><MiniLine /></article>
      <article><div><span>Conversion rate</span><ChartLineUp /></div><strong>11.1%</strong><p><b>+2.3%</b> vs 6.8% benchmark</p><MiniLine /></article>
    </section>

    <section className="analytics-grid">
      <article className="trend-card">
        <div className="card-heading"><div><h2>Qualification trend</h2><p>Visitors progressing into scored leads</p></div><button aria-label="More qualification trend options"><DotsThree /></button></div>
        <div className="chart-legend"><span><i className="indigo" /> Qualified leads</span><span><i className="cyan" /> Conversations</span></div>
        <div className="trend-chart" role="img" aria-label="Qualified leads and conversations increased throughout August">
          <div className="axis"><span>300</span><span>200</span><span>100</span><span>0</span></div>
          <svg viewBox="0 0 720 220" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4F46E5" stopOpacity=".22"/><stop offset="1" stopColor="#4F46E5" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0 185 C70 180 85 150 150 156 S240 110 300 128 S400 70 470 90 S560 42 620 55 S680 28 720 20 L720 220 L0 220Z"/><path className="qualified" d="M0 185 C70 180 85 150 150 156 S240 110 300 128 S400 70 470 90 S560 42 620 55 S680 28 720 20"/><path className="convos" d="M0 205 C70 197 95 183 150 188 S230 158 300 168 S395 135 470 146 S550 106 620 118 S680 88 720 94"/></svg>
          <div className="x-axis"><span>Aug 4</span><span>Aug 11</span><span>Aug 18</span><span>Aug 25</span><span>Sep 1</span></div>
        </div>
      </article>
      <div style={{ display: "grid", gap: "12px" }}>
        <article className="distribution-card">
          <div className="card-heading"><div><h2>Lead quality</h2><p>428 leads this period</p></div><button aria-label="More lead quality options"><DotsThree /></button></div>
          <div className="donut-wrap"><div className="donut"><div><strong>74</strong><span>Hot leads</span></div></div></div>
          <div className="quality-list"><div><span><i className="hot-dot" />Hot</span><b>74 <small>17.3%</small></b></div><div><span><i className="warm-dot" />Warm</span><b>198 <small>46.3%</small></b></div><div><span><i className="cold-dot" />Cold</span><b>156 <small>36.4%</small></b></div></div>
        </article>
        <div className="metric-grid" style={{ gridTemplateColumns: "1fr", marginBottom: 0 }}>
          <article><div><span>Avg triage speed</span><Lightning /></div><strong>8m 24s</strong><p><b>−41%</b> vs 14m 10s 30 days ago</p><MiniLine /></article>
        </div>
      </div>
    </section>

    <section className="recent-card">
      <div className="card-heading" style={{ padding: "16px 17px", borderBottom: "1px solid #edf0f4" }}><div><h2>Lead acquisition channels</h2><p>Attribution mapped across {channels.reduce((sum, c) => sum + c.leads, 0)} inbound leads</p></div><button className="text-button" onClick={() => notify("Source diagnostics opened")}>View source diagnostics <ArrowRight /></button></div>
      <div className="quality-list" style={{ padding: "4px 17px 6px" }}>{channels.map(channel => <div key={channel.name}><span><i className={`channel-dot ${channel.dot}`} />{channel.name}</span><b>{channel.leads} <small>{channel.pct}%</small></b></div>)}</div>
    </section>

    <section className="analytics-grid">
      <div className="recent-card">
        <div className="card-heading"><div><h2>Recent hot leads</h2><p>Newest qualification activity across your websites</p></div><button className="text-button" onClick={() => setSection("Leads")}>View all leads <ArrowRight /></button></div>
        <LeadTable rows={leads.slice(0, 4)} chooseLead={openLead} />
      </div>
      <div style={{ display: "grid", gap: "12px" }}>
        <div className="module-list">
          <div className="module-list-head"><h2>Leads needing action</h2><button onClick={() => setSection("Leads")}>View all <ArrowRight /></button></div>
          <button className="module-row" onClick={() => openLead(leads[2])}><span className="module-row-icon"><Fire /></span><span><b>Amelia Brooks</b><small>Reform Health · Follow-up overdue by 2h</small></span><em className="attention">Call now</em><ArrowRight /></button>
          <button className="module-row" onClick={() => openLead(leads[3])}><span className="module-row-icon"><Clock /></span><span><b>Noah Williams</b><small>Arcwell Homes · Demo scheduled in 45m</small></span><em>Join</em><ArrowRight /></button>
        </div>
        <div className="recent-card" style={{ padding: "18px", display: "grid", gap: "12px" }}>
          <div className="ai-brief"><div><Robot weight="fill" /> AI insights <span>Live signals</span></div><p>High visitor intent detected around AI automation integrations — 48% of all qualification queries reference it.</p><p>Pricing transparency remains the #1 objection raised before handoff.</p></div>
          <div className="next-action"><span><Sparkle weight="fill" /></span><div><small>Recommended optimization</small><b>Enable instant calendar booking for leads scoring above 85 to lift conversion by ~14%.</b></div></div>
          <button className="primary-button" style={{ width: "100%" }} onClick={() => notify("Automation rule applied")}><Sparkle /> Apply automation rule</button>
        </div>
      </div>
    </section>
  </div>;
}

function ScoreRing({ score }: { score: number }) {
  return <div className="score-ring"><svg viewBox="0 0 36 36"><path className="score-ring-track" d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831" /><path className="score-ring-value" d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831" strokeDasharray={`${score}, 100`} /></svg><strong>{score}</strong></div>;
}

function InboxPage({ openLead, setSection, notify }: { openLead: (lead: Lead) => void; setSection: (v: string) => void; notify: (v: string) => void }) {
  const [conversations, setConversations] = useState<InboxConversation[]>(initialInboxConversations);
  const [selectedLeadId, setSelectedLeadId] = useState(1);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"All" | "Mine" | "Unassigned" | "Handoff">("All");
  const [filterClasses, setFilterClasses] = useState<Set<Lead["classification"]>>(new Set(["Hot", "Warm", "Cold"]));
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
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setFilterOpen(false); setQuickRepliesOpen(false); }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [filterOpen, quickRepliesOpen]);

  const conversationLeads = useMemo(
    () => conversations.map(c => ({ conversation: c, lead: leads.find(l => l.id === c.leadId)! })),
    [conversations]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return conversationLeads.filter(({ conversation, lead }) => {
      if (filterTab === "Mine" && lead.owner !== "You") return false;
      if (filterTab === "Unassigned" && lead.owner !== "Unassigned") return false;
      if (filterTab === "Handoff" && !conversation.needsHandoff) return false;
      if (!filterClasses.has(lead.classification)) return false;
      if (!q) return true;
      const lastMessage = conversation.messages[conversation.messages.length - 1]?.text ?? "";
      return [lead.name, lead.company, lastMessage].join(" ").toLowerCase().includes(q);
    });
  }, [conversationLeads, search, filterTab, filterClasses]);

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
    if (replyTab === "visitor") {
      updateSelected(c => ({ ...c, messages: [...c.messages, { id: nextMsgId.current++, from: "agent", author: "Arjun Kumar", time, text }] }));
      notify("Reply sent");
    } else {
      updateSelected(c => ({ ...c, messages: [...c.messages, { id: nextMsgId.current++, from: "note", author: "Arjun Kumar", time, text }] }));
      notify("Internal note added");
    }
    setDraft("");
  }

  function toggleClassFilter(cls: Lead["classification"]) {
    setFilterClasses(current => {
      const next = new Set(current);
      if (next.has(cls)) next.delete(cls); else next.add(cls);
      return next;
    });
  }

  const filterTabs: { key: "All" | "Mine" | "Unassigned" | "Handoff"; label: string }[] = [
    { key: "All", label: "All" },
    { key: "Mine", label: `Mine (${mineCount})` },
    { key: "Unassigned", label: `Unassigned (${unassignedCount})` },
    { key: "Handoff", label: `Handoff (${handoffCount})` },
  ];

  return <div className="page inbox-page">
    <div className="page-heading">
      <div><h1>Team inbox</h1><p>{conversations.length} active sessions · <i className="live-pulse" style={{ display: "inline-block", verticalAlign: "middle", margin: "0 6px 2px 10px" }} />AI auto-triage online</p></div>
      <div className="heading-actions">
        <button className="secondary-button" onClick={() => setSection("Qualification")}><Funnel /> View rules</button>
        <div className="lead-filter-wrap" ref={filterRef}>
          <button className={`secondary-button ${filterOpen ? "active" : ""}`} aria-haspopup="dialog" aria-expanded={filterOpen} onClick={() => setFilterOpen(value => !value)}><SlidersHorizontal /> Filter queue</button>
          {filterOpen && <div className="lead-filter-popover" role="dialog" aria-label="Filter queue">
            <header><div><strong>Filter queue</strong><small>Show conversations by classification</small></div><button onClick={() => setFilterOpen(false)} aria-label="Close filters"><X /></button></header>
            <div className="lead-filter-fields">
              {(["Hot", "Warm", "Cold"] as const).map(cls => <label key={cls} className="inbox-filter-check"><input type="checkbox" checked={filterClasses.has(cls)} onChange={() => toggleClassFilter(cls)} /> {cls}</label>)}
            </div>
            <footer><button className="primary-button" onClick={() => setFilterOpen(false)}>Apply</button></footer>
          </div>}
        </div>
      </div>
    </div>

    <div className="inbox-shell">
      <div className="inbox-list-card">
        <div className="inbox-list-head">
          <div><span>Conversations</span><em>{conversations.length}</em></div>
          <button aria-label="Refresh conversations" onClick={() => notify("Conversations refreshed")}><ArrowClockwise /></button>
        </div>
        <div className="inbox-search"><MagnifyingGlass /><input name="conversationSearch" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..." aria-label="Search conversations" /></div>
        <div className="filter-tabs inbox-filter-tabs">
          {filterTabs.map(t => <button key={t.key} className={filterTab === t.key ? "active" : ""} onClick={() => setFilterTab(t.key)}>{t.label}</button>)}
        </div>
        <div className="inbox-conv-list">
          {filtered.length === 0 && <p className="inbox-empty">No conversations match these filters.</p>}
          {filtered.map(({ conversation, lead }) => {
            const active = lead.id === selectedLeadId;
            const visible = conversation.messages.filter(m => m.from !== "note");
            const last = visible[visible.length - 1];
            return <button key={lead.id} className={`inbox-conv-row ${active ? "active" : ""}`} onClick={() => setSelectedLeadId(lead.id)}>
              <div className="inbox-conv-top">
                <span className="inbox-conv-name">{conversation.liveOn && <i className="inbox-live-dot" />}<b>{lead.name}</b><small>{lead.company}</small></span>
                <span className="inbox-conv-time">{conversation.previewTime}</span>
              </div>
              <p className="inbox-conv-preview">{last?.text}</p>
              <div className="inbox-conv-foot">
                <span className="inbox-conv-tags"><ClassBadge value={lead.classification} /><b className="inbox-score-chip">{lead.score}</b></span>
                <span className="inbox-conv-owner">{lead.owner === "Unassigned" ? "Unassigned" : conversation.status}</span>
              </div>
            </button>;
          })}
        </div>
      </div>

      <div className="inbox-chat-card">
        <div className="inbox-chat-head">
          <div className="inbox-chat-identity">
            <span className="inbox-avatar" style={{ background: selectedLead.color }}>{selectedLead.initials}</span>
            <div>
              <div className="inbox-chat-name"><b>{selectedLead.name}</b><small>· {selectedLead.company}</small></div>
              <div className="inbox-chat-meta">
                {selectedConversation.liveOn ? <span className="inbox-live-chip"><i className="live-pulse" />Live on {selectedConversation.liveOn}</span> : <span className="status-chip">{selectedConversation.status}</span>}
                <small>{selectedConversation.ip} · {selectedConversation.browser}</small>
              </div>
            </div>
          </div>
          <div className="inbox-chat-actions">
            <span className="inbox-agent-chip"><b>AK</b>Arjun Kumar</span>
            <button className="secondary-button" onClick={takeOverChat}><ArrowsLeftRight /> Take over chat</button>
          </div>
        </div>

        <div className="inbox-messages" ref={messagesRef}>
          <div className="inbox-session-start"><span>Session started today via widget</span></div>
          {selectedConversation.messages.map(m => {
            if (m.from === "note") return <div key={m.id} className="inbox-note"><Lock /><div><div className="inbox-note-head"><span>Internal note</span><small>{m.author} · {m.time}</small></div><p>{m.text}</p></div></div>;
            if (m.from === "visitor") return <div key={m.id} className="inbox-bubble-row visitor">
              <span className="inbox-avatar small" style={{ background: selectedLead.color }}>{selectedLead.initials}</span>
              <div><div className="inbox-bubble-meta"><b>{m.author}</b><small>{m.time}</small></div><div className="inbox-bubble visitor">{m.text}</div></div>
            </div>;
            return <div key={m.id} className="inbox-bubble-row agent">
              <span className="inbox-avatar small dark">{m.from === "ai" ? <Sparkle weight="fill" /> : "AK"}</span>
              <div><div className="inbox-bubble-meta"><small>{m.time}</small><b>{m.author}</b></div><div className="inbox-bubble agent"><p>{m.text}</p>{m.sources && <small className="inbox-bubble-sources"><Sparkle />{m.sources}</small>}</div></div>
            </div>;
          })}
        </div>

        <div className="inbox-composer">
          <div className="inbox-composer-top">
            <div className="filter-tabs">
              <button className={replyTab === "visitor" ? "active" : ""} onClick={() => setReplyTab("visitor")}>Reply to visitor</button>
              <button className={replyTab === "note" ? "active" : ""} onClick={() => setReplyTab("note")}>Internal note</button>
            </div>
            <small className="inbox-composer-hint">Enter to send, Shift + Enter for new line</small>
          </div>
          <textarea className="inbox-composer-textarea" name="inboxReplyDraft" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder={replyTab === "visitor" ? `Reply to ${selectedLead.name}...` : "Add an internal note visible only to your team..."} rows={3} />
          <div className="inbox-composer-bottom">
            <div className="inbox-composer-tools">
              <div className="lead-filter-wrap" ref={quickRepliesRef}>
                <button className="icon-button" onClick={() => setQuickRepliesOpen(v => !v)} aria-label="Quick replies" aria-haspopup="menu" aria-expanded={quickRepliesOpen}><Lightning /></button>
                {quickRepliesOpen && <div className="inbox-quick-replies" role="menu">{inboxQuickReplies.map(r => <button key={r} role="menuitem" onClick={() => { setDraft(r); setQuickRepliesOpen(false); }}>{r}</button>)}</div>}
              </div>
              <button className="icon-button" onClick={() => notify("Attachment picker opened")} aria-label="Attach file"><Paperclip /></button>
              <button className="icon-button" onClick={() => setDraft(cur => `${cur}🙂`)} aria-label="Add emoji"><Smiley /></button>
            </div>
            <button className="primary-button" onClick={sendMessage}>{replyTab === "visitor" ? "Send reply" : "Add note"} <PaperPlaneRight /></button>
          </div>
        </div>
      </div>

      <div className="inbox-intel-card">
        <div className="inbox-intel-head"><span>Lead intelligence</span><span className="status-chip">ID #LD-{8000 + selectedLead.id}</span></div>

        <div className="inbox-score-block">
          <ScoreRing score={selectedLead.score} />
          <div>
            <span className="inbox-score-label">Lead qualification</span>
            <span className={`inbox-score-class ${selectedLead.classification.toLowerCase()}`}><i className={`${selectedLead.classification.toLowerCase()}-dot`} />{selectedLead.classification} lead · {selectedLead.classification === "Hot" ? "Immediate priority" : selectedLead.classification === "Warm" ? "Active nurture" : "Long-term nurture"}</span>
            <small>Autonomous score updated 2m ago</small>
          </div>
        </div>

        <div className="ai-brief"><div><Brain weight="fill" /> AI executive summary</div><p>{selectedConversation.aiSummary}</p></div>

        <div className="inbox-intel-section">
          <span>Captured details</span>
          <div className="inbox-detail-grid">
            {selectedConversation.capturedDetails.map(d => <div key={d.label} className={`inbox-detail-tile ${d.span2 ? "span2" : ""}`}><span>{d.label}</span><b className={d.danger ? "danger" : ""}>{d.value}</b></div>)}
          </div>
        </div>

        <div className="inbox-intel-section">
          <span>Scoring breakdown</span>
          <div className="inbox-score-list">
            {selectedConversation.scoringBreakdown.map(s => <div key={s.label} className={s.done ? "done" : ""}><span>{s.done ? <CheckCircle weight="fill" /> : <Circle />}{s.label}</span><b>+{s.points} pts</b></div>)}
          </div>
        </div>

        <div className="inbox-intel-section">
          <span>AI signals</span>
          <div className="inbox-signal-chips">
            {selectedConversation.aiSignals.map(s => <span key={s.text} className={`inbox-signal-chip ${s.kind}`}>{s.kind === "warning" ? <Warning /> : <i className="live-pulse" />}{s.text}</span>)}
          </div>
        </div>

        <div className="next-action"><span><Lightning weight="fill" /></span><div><small>Next best action</small><b>{selectedConversation.nextBestAction}</b></div></div>

        <div className="inbox-intel-actions">
          <button className="primary-button" onClick={() => notify(`Follow-up scheduled for ${selectedLead.name}`)}><CalendarCheck /> Schedule follow-up</button>
          <button className="secondary-button" onClick={() => openLead(selectedLead)}>Open lead profile <ArrowSquareOut /></button>
        </div>
      </div>
    </div>
  </div>;
}

function LeadsView({ filtered, filter, setFilter, query, setQuery, chooseLead, notify }: { filtered: Lead[]; filter: string; setFilter: (v:string)=>void; query:string; setQuery:(v:string)=>void; chooseLead:(l:Lead)=>void; notify:(v:string)=>void }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [owner, setOwner] = useState("All owners");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [site, setSite] = useState("All websites");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const visibleLeads = filtered.filter(lead =>
    (owner === "All owners" || lead.owner === owner) &&
    (statusFilter === "All statuses" || lead.status === statusFilter) &&
    (site === "All websites" || lead.site === site)
  );
  const advancedFilterCount = [owner !== "All owners", statusFilter !== "All statuses", site !== "All websites"].filter(Boolean).length;
  const toggleSelected = (id: number) => setSelectedIds(current => current.includes(id) ? current.filter(v => v !== id) : [...current, id]);

  useEffect(() => {
    if (!filterOpen) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!filterRef.current?.contains(event.target as Node)) setFilterOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterOpen(false);
        filterRef.current?.querySelector<HTMLButtonElement>(".filter-trigger")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [filterOpen]);

  const clearAdvancedFilters = () => { setOwner("All owners"); setStatusFilter("All statuses"); setSite("All websites"); };

  return <div className="page">
    <div className="page-heading"><div><h1>Leads</h1><p>1,860 total leads · review qualification evidence and move every opportunity forward.</p></div><div className="heading-actions"><button className="secondary-button" onClick={() => notify("CSV export is being prepared")}><DownloadSimple /> Export CSV</button><button className="primary-button" onClick={() => setAddLeadOpen(true)}><Plus /> Add lead</button></div></div>

    <section className="metric-grid">
      <article><div><span>New inbound</span><EnvelopeSimple /></div><strong>14</strong><p><b>+8</b> assigned to auto-triage today</p><MiniLine /></article>
      <article className="accent-dark"><div><span>High intent · Hot</span><Fire /></div><strong>74</strong><p><b>Action required</b> · ready for fast handoff</p><MiniLine /></article>
      <article><div><span>Unassigned</span><Users /></div><strong>9</strong><p><b className="warn">Routing pending</b> · needs an owner</p><MiniLine /></article>
      <article><div><span>Follow-ups due</span><Clock /></div><strong>4</strong><p><b className="danger">1 overdue</b> · SLA commitment window</p><MiniLine /></article>
    </section>

    <div className="lead-toolbar">
      <div className="filter-tabs">{["All", "Hot", "Warm", "Cold"].map(item => <button aria-pressed={filter === item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}{item !== "All" && <span>{leads.filter(l => l.classification === item).length}</span>}</button>)}</div>
      <div className="toolbar-actions"><label><MagnifyingGlass /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search leads" /></label><div className="lead-filter-wrap" ref={filterRef}><button className="filter-trigger" aria-haspopup="dialog" aria-expanded={filterOpen} onClick={() => setFilterOpen(value => !value)}><Funnel /> Filters {advancedFilterCount > 0 && <span>{advancedFilterCount}</span>}</button>{filterOpen && <div className="lead-filter-popover" role="dialog" aria-label="Filter leads"><header><div><strong>Filter leads</strong><small>Narrow this lead view</small></div><button onClick={() => setFilterOpen(false)} aria-label="Close filters"><X /></button></header><div className="lead-filter-fields"><label>Owner<select value={owner} onChange={event => setOwner(event.target.value)}><option>All owners</option><option>Maya</option><option>You</option><option>Jon</option><option>Unassigned</option></select></label><label>Status<select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option>All statuses</option><option>New</option><option>Contacted</option><option>Qualified</option></select></label><label>Website<select value={site} onChange={event => setSite(event.target.value)}><option>All websites</option><option>ailqs.com</option><option>studio.ailqs.com</option><option>property.ailqs.com</option></select></label></div><footer><button onClick={clearAdvancedFilters} disabled={advancedFilterCount === 0}>Clear</button><button className="primary-button" onClick={() => { setFilterOpen(false); notify(`${visibleLeads.length} leads match these filters`); }}>Apply filters</button></footer></div>}</div><button aria-label="Select columns"><Rows /></button></div>
    </div>
    <section className="recent-card lead-list-card">
      <div className="table-summary"><span><b>{visibleLeads.length}</b> leads in this view</span><span>Showing 1 to {visibleLeads.length} of 1,860 leads</span></div>
      {visibleLeads.length ? <LeadTable rows={visibleLeads} chooseLead={chooseLead} selectedIds={selectedIds} toggleSelected={toggleSelected} /> : <div className="empty-state"><MagnifyingGlass /><h2>No leads found</h2><p>Try a different search or clear the active filters.</p><button onClick={() => { setQuery(""); setFilter("All"); clearAdvancedFilters(); }}>Clear filters</button></div>}
    </section>

    {selectedIds.length > 0 && <div className="bulk-bar">
      <span className="bulk-bar-count">{selectedIds.length} lead{selectedIds.length > 1 ? "s" : ""} selected</span>
      <button onClick={() => notify("Leads assigned to rep")}>Assign to rep</button>
      <button onClick={() => notify("Status updated")}>Change status</button>
      <button onClick={() => notify("Leads exported")}>Export</button>
      <button className="bulk-close" aria-label="Clear selection" onClick={() => setSelectedIds([])}><X /></button>
    </div>}

    {addLeadOpen && <AddLeadDialog close={() => setAddLeadOpen(false)} notify={notify} />}
  </div>;
}

function AddLeadDialog({ close, notify }: { close: () => void; notify: (v: string) => void }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [classification, setClassification] = useState("Warm");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = dialogRef.current;
    root?.querySelector<HTMLInputElement>("input")?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !root) return;
      const nodes = Array.from(root.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled])'));
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [close]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !company.trim()) { setError("Enter a name and company for this lead."); return; }
    notify(`${name.trim()} added as a new ${classification.toLowerCase()} lead`);
    close();
  }

  return <div className="config-dialog-wrap"><button className="config-dialog-scrim" tabIndex={-1} aria-label="Close add lead" onClick={close} /><div ref={dialogRef} className="config-dialog" role="dialog" aria-modal="true" aria-labelledby="add-lead-title"><header><div><h2 id="add-lead-title">Add lead</h2><p>Create a new lead and route it into qualification.</p></div><button className="icon-button" onClick={close} aria-label="Close add lead"><X /></button></header><form onSubmit={submit}><div className="config-fields">
    <label>Full name<input value={name} onChange={event => { setName(event.target.value); setError(""); }} placeholder="Jordan Reyes" aria-invalid={Boolean(error)} aria-describedby={error ? "add-lead-error" : undefined} /></label>
    <label>Company<input value={company} onChange={event => { setCompany(event.target.value); setError(""); }} placeholder="Acme Corp" />{error && <small id="add-lead-error" role="alert">{error}</small>}</label>
    <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="jordan@acmecorp.com" /></label>
    <label>Interest<input value={interest} onChange={event => setInterest(event.target.value)} placeholder="Enterprise onboarding" /></label>
    <label>Classification<select value={classification} onChange={event => setClassification(event.target.value)}><option>Hot</option><option>Warm</option><option>Cold</option></select></label>
  </div><footer><button type="button" className="secondary-button" onClick={close}>Cancel</button><button type="submit" className="primary-button"><Plus /> Add lead</button></footer></form></div></div>;
}

function LeadTable({ rows, chooseLead, selectedIds, toggleSelected }: { rows: Lead[]; chooseLead: (lead: Lead) => void; selectedIds?: number[]; toggleSelected?: (id: number) => void }) {
  return <><div className="table-scroll"><table className="lead-table"><thead><tr><th><input type="checkbox" aria-label="Select all leads" /></th><th>Lead</th><th>Quality</th><th>Interest</th><th>Owner</th><th>Status</th><th>Received</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{rows.map(lead => <tr key={lead.id} onClick={() => chooseLead(lead)}><td onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedIds?.includes(lead.id) ?? false} onChange={() => toggleSelected?.(lead.id)} aria-label={`Select ${lead.name}`} /></td><td><div className="lead-person"><span style={{ background: lead.color }}>{lead.initials}</span><div><b>{lead.name}</b><small>{lead.company}</small></div></div></td><td><div className="quality-cell"><ClassBadge value={lead.classification} /><b>{lead.score}</b></div></td><td><span className="interest-text">{lead.interest}</span><small className="site-text">{lead.site}</small></td><td>{lead.owner}</td><td><span className={`status-chip ${lead.status.toLowerCase()}`}>{lead.status}</span></td><td><span>{lead.received}</span><small className={lead.followup === "Overdue" ? "overdue" : ""}>{lead.followup}</small></td><td><button className="row-action" aria-label={`Actions for ${lead.name}`} onClick={e => e.stopPropagation()}><DotsThree /></button></td></tr>)}</tbody></table></div><div className="mobile-lead-list">{rows.map(lead => <button key={lead.id} className="mobile-lead-card" onClick={() => chooseLead(lead)}><div className="mobile-lead-top"><span className="mobile-avatar" style={{background:lead.color}}>{lead.initials}</span><span><b>{lead.name}</b><small>{lead.company}</small></span><span className="mobile-score"><ClassBadge value={lead.classification}/><strong>{lead.score}</strong></span></div><p>{lead.interest}</p><div className="mobile-lead-meta"><span className={lead.followup === "Overdue" ? "overdue" : ""}><Clock />{lead.followup}</span><span>{lead.owner}</span><span>View lead <ArrowRight /></span></div></button>)}</div></>;
}

function ModuleView({ title, intro, icon: Icon, items, notify }: { title:string; intro:string; icon:typeof Globe; items:{title:string;text:string;state:string}[]; notify:(v:string)=>void }) {
  const [rows, setRows] = useState(items);
  const [configOpen, setConfigOpen] = useState(false);
  const itemKind = title === "Team" ? "member" : title === "Knowledge Base" ? "source" : title === "Websites & Widget" ? "website" : "configuration";

  function addConfiguration(name:string, description:string) {
    setRows(current => [...current, { title:name, text:description, state:"Ready" }]);
    setConfigOpen(false);
    notify(`${name} added successfully`);
  }

  return <div className="page module-page">
    <div className="page-heading"><div><h1>{title}</h1><p>{intro}</p></div><button className="primary-button" onClick={() => setConfigOpen(true)}><Plus /> Add {itemKind}</button></div>
    <section className="module-hero"><div className="module-icon"><Icon weight="duotone" /></div><div><h2>{title} at a glance</h2><p>Static design data demonstrates the default populated state. Production actions will connect to the AILQS API.</p></div><div className="module-stat"><span>Healthy</span><strong>{rows.filter(i => !i.state.toLowerCase().includes("warning") && !i.state.toLowerCase().includes("attention")).length}/{rows.length}</strong></div></section>
    <section className="module-list"><div className="module-list-head"><h2>Configuration and health</h2><button><SlidersHorizontal /> Filter</button></div>{rows.map((item, index) => <button className="module-row" key={item.title} onClick={() => notify(`${item.title} opened`)}><span className="module-row-icon">{index % 3 === 0 ? <CheckCircle /> : index % 3 === 1 ? <FileText /> : <GearSix />}</span><span><b>{item.title}</b><small>{item.text}</small></span><em className={item.state.toLowerCase().includes("warning") || item.state.toLowerCase().includes("attention") ? "attention" : ""}>{item.state}</em><ArrowRight /></button>)}</section>
    {configOpen && <ConfigurationDialog section={title} itemKind={itemKind} close={() => setConfigOpen(false)} save={addConfiguration} />}
  </div>;
}

function ConfigurationDialog({ section, itemKind, close, save }: { section:string; itemKind:string; close:()=>void; save:(name:string, description:string)=>void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = dialogRef.current;
    root?.querySelector<HTMLInputElement>("input")?.focus();
    const handle = (event:KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !root) return;
      const nodes = Array.from(root.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled])'));
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [close]);

  function submit(event:React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) { setError(`Enter a name for this ${itemKind}.`); return; }
    save(name.trim(), description.trim() || `New ${section.toLowerCase()} ${itemKind}`);
  }

  return <div className="config-dialog-wrap"><button className="config-dialog-scrim" tabIndex={-1} aria-label="Close configuration" onClick={close}/><div ref={dialogRef} className="config-dialog" role="dialog" aria-modal="true" aria-labelledby="config-dialog-title"><header><div><h2 id="config-dialog-title">Add {itemKind}</h2><p>Create a new {section.toLowerCase()} {itemKind}.</p></div><button className="icon-button" onClick={close} aria-label="Close configuration"><X /></button></header><form onSubmit={submit}><div className="config-fields"><label>{itemKind.charAt(0).toUpperCase() + itemKind.slice(1)} name<input value={name} onChange={event => { setName(event.target.value); setError(""); }} placeholder={`Enter ${itemKind} name`} aria-invalid={Boolean(error)} aria-describedby={error ? "config-name-error" : undefined}/>{error && <small id="config-name-error" role="alert">{error}</small>}</label><label>Description<textarea value={description} onChange={event => setDescription(event.target.value)} placeholder="Describe what this configuration does" rows={3}/></label><label>Initial state<select defaultValue="Ready"><option>Ready</option><option>Draft</option></select></label></div><footer><button type="button" className="secondary-button" onClick={close}>Cancel</button><button type="submit" className="primary-button"><Plus /> Add {itemKind}</button></footer></form></div></div>;
}

function LeadDrawer({ lead, status, setStatus, close, notify }: { lead:Lead; status:string; setStatus:(v:string)=>void; close:()=>void; notify:(v:string)=>void }) {
  const [tab, setTab] = useState("Overview");
  const drawerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = drawerRef.current;
    if (!root) return;
    (root.querySelector("button") as HTMLButtonElement | null)?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const nodes = Array.from(root.querySelectorAll<HTMLElement>('button,input,select,[tabindex]:not([tabindex="-1"])')).filter(node => !node.hasAttribute("disabled"));
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [close]);
  return <aside ref={drawerRef} role="dialog" aria-modal="true" className="lead-drawer" aria-labelledby="lead-drawer-title">
    <header><div><ClassBadge value={lead.classification} /><span className="score-label">{lead.score}/100</span></div><button className="icon-button" onClick={close} aria-label="Close lead detail"><X /></button></header>
    <div className="drawer-person"><span style={{ background: lead.color }}>{lead.initials}</span><div><h2 id="lead-drawer-title">{lead.name}</h2><p>{lead.company} · {lead.interest}</p></div></div>
    <div className="drawer-actions"><button className="primary-button" onClick={() => { setStatus("Contacted"); notify(`${lead.name} marked as contacted`); }}><Check /> Mark contacted</button><button className="secondary-button" onClick={() => notify(`Follow-up scheduled for ${lead.name}`)}><Clock /> Follow-up</button><button className="icon-button" aria-label="More lead actions"><DotsThree /></button></div>
    <div className="drawer-tabs" role="tablist">{["Overview","Score","Conversation","Activity"].map(item => <button role="tab" aria-selected={tab === item} key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}</div>
    <div className="drawer-body">
      {tab === "Overview" && <><section className="ai-brief"><div><Sparkle weight="fill" /> AI brief <span>Generated 4m ago</span></div><p>{lead.summary}</p><button onClick={() => setTab("Score")}>Explain this score <ArrowRight /></button></section><section className="next-action"><span><Lightning weight="fill" /></span><div><small>Recommended next action</small><b>Call within 15 minutes and offer a tailored product walkthrough.</b></div></section><section className="detail-section"><h3>Contact</h3><div className="contact-row"><span><EnvelopeSimple />{lead.email}</span><button onClick={() => notify("Email copied")} aria-label="Copy email"><Copy /></button></div><div className="contact-row"><span><PaperPlaneTilt />{lead.phone}</span><button onClick={() => notify("Phone copied")} aria-label="Copy phone"><Copy /></button></div></section><section className="detail-section"><h3>Ownership</h3><div className="two-fields"><label>Owner<button>Maya Patel <CaretDown /></button></label><label>Status<select value={status} onChange={e => setStatus(e.target.value)}><option>New</option><option>Contacted</option><option>Qualified</option><option>Won</option><option>Lost</option></select></label></div></section></>}
      {tab === "Score" && <ScoreBreakdown score={lead.score} classification={lead.classification} />}
      {tab === "Conversation" && <Conversation lead={lead} />}
      {tab === "Activity" && <Activity lead={lead} />}
    </div>
    <footer><button className="secondary-button"><Eye /> Open full record</button><button className="primary-button" onClick={() => notify(`Note added for ${lead.name}`)}><NotePencil /> Add note</button></footer>
  </aside>;
}

function ScoreBreakdown({ score, classification }: { score:number; classification:Lead["classification"] }) {
  const parts = [["Budget",23,25],["Timeline",18,20],["Service interest",18,20],["Company fit",14,15],["Buying intent",19,20]];
  return <div className="score-panel"><div className="score-total"><div><strong>{score}</strong><span>/100</span></div><ClassBadge value={classification} /></div><p>Scored with Default qualification model · Version 3</p><div className="score-list">{parts.map(([name,value,max]) => <div key={name}><div><span>{name}</span><b>{value}<small>/{max}</small></b></div><div className="score-track"><span style={{ width: `${Number(value)/Number(max)*100}%` }} /></div></div>)}</div><div className="evidence-note"><Sparkle /><p><b>Strongest signal</b>“We have budget approved and want to implement within two weeks.”</p></div></div>;
}

function Conversation({ lead }: { lead:Lead }) {
  return <div className="conversation"><div className="chat-date">Today · Started on pricing page</div><div className="message visitor">We’re evaluating a lead qualification tool for three product websites.<span>10:42 AM</span></div><div className="message ai"><Robot weight="fill" />I can help with that. What timeline are you working toward?<span>10:42 AM</span></div><div className="message visitor">We have budget approved and want to implement within two weeks.<span>10:43 AM</span></div><div className="qualification-event"><Target /> Qualification updated · Timeline +18 · Intent +19</div><div className="message ai"><Robot weight="fill" />That’s a strong fit. Could I get your work email so our team can arrange a focused walkthrough?<span>10:43 AM</span></div><div className="message visitor">Sure — {lead.email}<span>10:44 AM</span></div></div>;
}

function Activity({ lead }: { lead:Lead }) {
  return <div className="activity-list">{[
    ["Lead qualified", `${lead.score}/100 · ${lead.classification}`, CheckCircle],
    ["Email notification delivered", "Maya Patel · 4m ago", EnvelopeSimple],
    ["HubSpot contact created", "Record #48391 · 4m ago", Buildings],
    ["Webhook delivery failed", "HTTP 503 · Retry in 6 minutes", XCircle],
    ["Conversation completed", "11 messages · 5m ago", EnvelopeSimple],
  ].map(([title,text,Icon]) => <div key={String(title)}><span className={String(title).includes("failed") ? "failure" : ""}><Icon /></span><p><b>{String(title)}</b><small>{String(text)}</small></p></div>)}</div>;
}

function NotificationPanel({ close, openLead }: { close:()=>void; openLead:()=>void }) {
  return <aside role="dialog" aria-label="Notifications" className="notification-panel"><header><h2>Notifications</h2><button onClick={close} aria-label="Close notifications"><X /></button></header><button className="notification-item unread" onClick={openLead}><span className="signal-icon hot"><Fire weight="fill" /></span><span><b>New Hot lead</b><small>Priya Sharma scored 92 on ailqs.com</small><time>4m</time></span></button><button className="notification-item"><span className="signal-icon fail"><WebhooksLogo /></span><span><b>Webhook needs attention</b><small>Two deliveries failed after retry</small><time>18m</time></span></button><button className="notification-item"><span className="signal-icon late"><Warning /></span><span><b>Knowledge partially updated</b><small>Three property pages were skipped</small><time>1h</time></span></button><footer><button>Mark all as read</button><button>View notification center</button></footer></aside>;
}

function AccountMenu({ close, openUpgrade, openPersonalization, openProfile, openSettings, openHelp, notify }: { close:()=>void; openUpgrade:()=>void; openPersonalization:()=>void; openProfile:()=>void; openSettings:()=>void; openHelp:()=>void; notify:(message:string)=>void }) {
  const run = (message:string) => { close(); notify(message); };
  return <div className="account-menu" role="menu" aria-label="Account menu">
    <button className="account-summary" role="menuitem" onClick={openProfile}>
      <span>AK</span><span><b>Arjun Kumar</b><small>Workspace admin</small></span><CaretRight />
    </button>
    <div className="account-menu-group">
      <button role="menuitem" onClick={openUpgrade}><Sparkle /><span>Upgrade plan</span></button>
      <button role="menuitem" onClick={openPersonalization}><PaintBrush /><span>Personalization</span></button>
      <button role="menuitem" onClick={openSettings}><GearSix /><span>Settings</span></button>
    </div>
    <div className="account-menu-group account-menu-last">
      <button role="menuitem" onClick={openHelp}><Lifebuoy /><span>Help</span><CaretRight /></button>
      <button role="menuitem" onClick={() => run("This static prototype does not end your session")}><SignOut /><span>Log out</span></button>
    </div>
  </div>;
}

function AccountPage({ page, notify }: { page:"Personalization" | "Profile" | "Help"; notify:(message:string)=>void }) {
  const [compact, setCompact] = useState(false);
  const pageData = {
    Personalization: { intro:"Choose how your workspace looks, feels, and communicates with you.", icon:PaintBrush, groups:[
      ["Appearance", "System theme", "Match this dashboard to your device appearance."],
      ["Density", compact ? "Compact" : "Comfortable", "Control how much information appears in tables and lists."],
      ["Notifications", "Priority signals", "Highlight Hot leads and delivery failures first."],
    ]},
    Profile: { intro:"Manage your personal information and account access.", icon:UserCircle, groups:[
      ["Personal details", "Arjun Kumar", "arjun@ailqs.com"],
      ["Role and workspace", "Workspace admin", "AILQS Demo"],
      ["Account security", "Password and sessions", "Last sign-in today from Chrome."],
    ]},
    Help: { intro:"Find guidance or contact support when you need a hand.", icon:Lifebuoy, groups:[
      ["Getting started", "Launch your first widget", "Installation, knowledge, qualification, and testing."],
      ["Lead qualification", "Understand AI scoring", "How evidence becomes a Hot, Warm, or Cold classification."],
      ["Integrations", "Troubleshoot deliveries", "Recover email, CRM, and webhook failures."],
    ]},
  }[page];
  const PageIcon = pageData.icon;
  return <div className="page account-page"><div className="page-heading"><div><h1>{page}</h1><p>{pageData.intro}</p></div>{page === "Profile" && <button className="primary-button" onClick={() => notify("Profile editor opened")}><NotePencil/> Edit profile</button>}</div>{page === "Help" && <label className="help-search"><MagnifyingGlass/><input placeholder="Search help articles" aria-label="Search help articles"/></label>}<section className="account-page-list"><div className="account-page-intro"><span><PageIcon weight="duotone"/></span><div><h2>{page === "Help" ? "How can we help?" : `${page} settings`}</h2><p>{page === "Help" ? "Browse common topics or reach the support team." : "Changes apply to your account across this workspace."}</p></div></div>{pageData.groups.map(([title,value,description], index) => <button key={title} onClick={() => { if (page === "Personalization" && index === 1) setCompact(current => !current); else notify(`${title} opened`); }}><span><b>{title}</b><small>{description}</small></span><span className="account-page-value">{value}<CaretRight/></span></button>)}</section>{page === "Help" && <section className="support-strip"><div><Lifebuoy/><span><b>Still need help?</b><small>Our support team can review your workspace configuration.</small></span></div><button className="secondary-button" onClick={() => notify("Support request started")}>Contact support</button></section>}</div>;
}

function AnalyticsPage({ notify }: { notify: (message: string) => void }) {
  const channels = [
    { name: "Organic search", leads: 184, pct: 43, dot: "c1" },
    { name: "Paid campaigns", leads: 142, pct: 33, dot: "c2" },
    { name: "Referral", leads: 68, pct: 16, dot: "c3" },
    { name: "Direct & widget", leads: 34, pct: 8, dot: "c4" },
  ];
  return <div className="page">
    <div className="page-heading"><div><h1>Analytics</h1><p>Full performance breakdown across leads, conversations, and sources.</p></div><div className="heading-actions"><button className="date-button"><Clock /> Last 30 days <CaretDown /></button><button className="secondary-button" onClick={() => notify("Analytics report exported")}><Export /> Export</button></div></div>
    <section className="metric-grid">
      <article><div><span>New leads</span><Target /></div><strong>428</strong><p><b>+12.4%</b> from previous period</p><MiniLine /></article>
      <article><div><span>Qualified leads</span><CheckCircle /></div><strong>267</strong><p><b>+8.7%</b> from previous period</p><MiniLine /></article>
      <article><div><span>Hot leads</span><Fire /></div><strong>74</strong><p><b>+16.2%</b> high intent</p><MiniLine /></article>
      <article><div><span>Conversion rate</span><ChartLineUp /></div><strong>11.1%</strong><p><b>+2.3%</b> vs 6.8% benchmark</p><MiniLine /></article>
    </section>
    <section className="analytics-grid">
      <article className="trend-card">
        <div className="card-heading"><div><h2>Qualification trend</h2><p>Visitors progressing into scored leads</p></div><button aria-label="More qualification trend options"><DotsThree /></button></div>
        <div className="chart-legend"><span><i className="indigo" /> Qualified leads</span><span><i className="cyan" /> Conversations</span></div>
        <div className="trend-chart" role="img" aria-label="Qualified leads and conversations increased throughout the period">
          <div className="axis"><span>300</span><span>200</span><span>100</span><span>0</span></div>
          <svg viewBox="0 0 720 220" preserveAspectRatio="none"><defs><linearGradient id="analytics-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4F46E5" stopOpacity=".22"/><stop offset="1" stopColor="#4F46E5" stopOpacity="0"/></linearGradient></defs><path className="area" fill="url(#analytics-area)" d="M0 185 C70 180 85 150 150 156 S240 110 300 128 S400 70 470 90 S560 42 620 55 S680 28 720 20 L720 220 L0 220Z"/><path className="qualified" d="M0 185 C70 180 85 150 150 156 S240 110 300 128 S400 70 470 90 S560 42 620 55 S680 28 720 20"/><path className="convos" d="M0 205 C70 197 95 183 150 188 S230 158 300 168 S395 135 470 146 S550 106 620 118 S680 88 720 94"/></svg>
          <div className="x-axis"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span><span>Now</span></div>
        </div>
      </article>
      <article className="distribution-card">
        <div className="card-heading"><div><h2>Lead quality</h2><p>428 leads this period</p></div><button aria-label="More lead quality options"><DotsThree /></button></div>
        <div className="donut-wrap"><div className="donut"><div><strong>74</strong><span>Hot leads</span></div></div></div>
        <div className="quality-list"><div><span><i className="hot-dot" />Hot</span><b>74 <small>17.3%</small></b></div><div><span><i className="warm-dot" />Warm</span><b>198 <small>46.3%</small></b></div><div><span><i className="cold-dot" />Cold</span><b>156 <small>36.4%</small></b></div></div>
      </article>
    </section>
    <section className="recent-card">
      <div className="card-heading" style={{ padding: "16px 17px", borderBottom: "1px solid #edf0f4" }}><div><h2>Lead acquisition channels</h2><p>Attribution mapped across {channels.reduce((sum, c) => sum + c.leads, 0)} inbound leads</p></div></div>
      <div className="quality-list" style={{ padding: "4px 17px 6px" }}>{channels.map(channel => <div key={channel.name}><span><i className={`channel-dot ${channel.dot}`} />{channel.name}</span><b>{channel.leads} <small>{channel.pct}%</small></b></div>)}</div>
    </section>
  </div>;
}

function BillingUsagePage({ notify }: { notify: (message: string) => void }) {
  const [annual, setAnnual] = useState(true);
  const plans = [
    { name: "Starter", monthly: 0, description: "For testing AI qualification on one website.", features: ["1 website", "100 qualified leads/month", "Email notifications", "Basic lead scoring"], current: true },
    { name: "Pro", monthly: 49, description: "For growing teams converting leads across multiple websites.", features: ["5 websites", "2,500 qualified leads/month", "CRM and webhook delivery", "Custom scoring rules", "Priority support"], featured: true },
    { name: "Scale", monthly: 129, description: "For larger sales operations that need control and capacity.", features: ["Unlimited websites", "10,000 qualified leads/month", "Advanced routing", "Team roles and permissions", "Dedicated onboarding"] },
  ];
  const invoices = [
    { date: "August 1, 2026", detail: "Starter Plan · Paid by default card", state: "Paid" },
    { date: "July 1, 2026", detail: "Starter Plan · Paid by default card", state: "Paid" },
    { date: "June 1, 2026", detail: "Starter Plan · Paid by default card", state: "Paid" },
  ];
  return <div className="page upgrade-page">
    <div className="page-heading"><div><h1>Billing &amp; Usage</h1><p>Monitor plan consumption and manage how this workspace is billed.</p></div><div className="heading-actions"><button className="secondary-button" onClick={() => notify("Usage report downloaded")}><DownloadSimple /> Download usage</button></div></div>
    <section className="metric-grid">
      <article><div><span>Monthly AI conversations</span><ChartLineUp /></div><strong>742</strong><p>of 1,000 · <b>74%</b> used</p><MiniLine /></article>
      <article><div><span>Websites connected</span><Globe /></div><strong>3</strong><p>of 3 included on Starter</p></article>
      <article><div><span>Team seats</span><Users /></div><strong>3</strong><p>of 3 seats used</p></article>
    </section>
    <div className="upgrade-heading"><div><h1>Choose the plan that fits your pipeline</h1><p>Upgrade when you need more websites, qualified leads, and delivery automation.</p></div><div className="billing-toggle" role="group" aria-label="Billing period"><button className={!annual ? "active" : ""} aria-pressed={!annual} onClick={() => setAnnual(false)}>Monthly</button><button className={annual ? "active" : ""} aria-pressed={annual} onClick={() => setAnnual(true)}>Annual <span>Save 20%</span></button></div></div>
    <div className="current-plan-note"><CheckCircle weight="fill" /><div><b>You&rsquo;re currently on Starter</b><span>Upgrade without interrupting your existing leads or configurations.</span></div></div>
    <section className="plan-grid" aria-label="Available plans">{plans.map(plan => { const price = annual ? Math.round(plan.monthly * .8) : plan.monthly; return <article className={plan.featured ? "featured" : ""} key={plan.name}>{plan.featured && <div className="recommended-plan">Recommended</div>}<header><h2>{plan.name}</h2><p>{plan.description}</p></header><div className="plan-price"><strong>${price}</strong><span>/month</span></div>{annual && plan.monthly > 0 ? <p className="billing-note">Billed annually at ${price * 12}</p> : <p className="billing-note">No payment required</p>}<button className={plan.featured ? "primary-button" : "secondary-button"} disabled={plan.current} onClick={() => notify(`${plan.name} checkout opened`)}>{plan.current ? "Current plan" : `Upgrade to ${plan.name}`}</button><ul>{plan.features.map(feature => <li key={feature}><Check weight="bold" />{feature}</li>)}</ul></article>; })}</section>
    <p className="plan-footnote">All prices are illustrative for this design prototype. Taxes may apply in production.</p>
    <section className="module-list" style={{ marginTop: 12 }}>
      <div className="module-list-head"><h2>Recent invoices</h2><button onClick={() => notify("Invoice history opened")}><FileText /> View all</button></div>
      {invoices.map(invoice => <button className="module-row" key={invoice.date} onClick={() => notify(`Invoice for ${invoice.date} downloaded`)}>
        <span className="module-row-icon"><FileText /></span>
        <span><b>{invoice.date}</b><small>{invoice.detail}</small></span>
        <em>{invoice.state}</em>
        <ArrowRight />
      </button>)}
    </section>
  </div>;
}

function StateDialog({ close }: { close:()=>void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelector<HTMLButtonElement>("button")?.focus();
    const handler = (event:KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const nodes = Array.from(root.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'));
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handler); return () => document.removeEventListener("keydown", handler);
  }, [close]);
  return <div className="state-dialog-wrap"><button className="state-dialog-scrim" tabIndex={-1} aria-label="Close state preview" onClick={close}/><div ref={ref} className="state-dialog" role="dialog" aria-modal="true" aria-labelledby="state-dialog-title"><header><div><h2 id="state-dialog-title">Representative interface states</h2><p>Loading, recovery, and unavailable actions remain explicit.</p></div><button className="icon-button" onClick={close} aria-label="Close state preview"><X/></button></header><div className="state-grid"><section><SpinnerGap className="state-spinner"/><div><b>Refreshing qualification</b><small>Current lead data remains visible while updates load.</small></div></section><section className="error-state"><XCircle/><div><b>Webhook delivery failed</b><small>HTTP 503 from sales endpoint. Check configuration, then retry.</small><button>Review delivery</button></div></section><section className="disabled-state"><Lock/><div><b>HubSpot test unavailable</b><small>Connect a HubSpot account before sending a test lead.</small><button disabled>Send test lead</button></div></section></div><footer><button className="primary-button" onClick={close}>Done</button></footer></div></div>;
}
