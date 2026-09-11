"use client";

/*
THESIS: A lead is a case awaiting a verdict, not another dashboard row — the interface reads like an editorial docket, not a software console.
OWN-WORLD: Pure black-and-white print system: a black ink sidebar holds the section register, a masthead above the canvas carries search/notifications/account, a live signal ticker replaces a notification rail, a bento verdict board replaces KPI tiles, and docket rows unfold in place into an evidentiary exhibit. Status reads through icon weight, fill, and bracket notation — never color.
STORY: Arrive at today's docket, scan the verdict board, open a case to inspect its evidence, record a verdict, then check delivery health and the inbox without leaving the page.
FIRST VIEWPORT: Sidebar (section register) — masthead (search, notifications, account) — signal ticker — bento verdict board — the docket ledger begins the fold.
FORM: A black ink sidebar for primary section navigation, paired with a masthead for global/utility controls — revised from the original no-sidebar build per direct client request, no right-side drawer, no in-place-unfold competitor. Direction fully pinned by the brief (monochrome, standard sans, mature icon set); concept-seed roll intentionally skipped per "brief-pinned direction beats the roll."
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
*/

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import "./the-docket.css";
import {
  ArrowClockwise, ArrowLeft, ArrowRight, ArrowSquareOut, ArrowsDownUp, ArrowsLeftRight,
  Bell, BellRinging, BookOpenText, Buildings, CaretDown, CaretRight, CaretUp, ChartLineUp, ChatCircle, Check,
  CheckCircle, CheckSquare, Circle, CirclesThreePlus, Clock, ClockCounterClockwise, Command, CreditCard,
  DotsSixVertical, DotsThree, DownloadSimple, EnvelopeSimple, FileText, Fire, FlowArrow, Funnel,
  Gauge, GearSix, Globe, IdentificationBadge, Info, Lifebuoy, Lightning, ListChecks,
  MagnifyingGlass, Megaphone, MinusCircle, NotePencil, PaperPlaneTilt, PlayCircle, Plus, PlusCircle, PuzzlePiece, Repeat, Robot,
  ShieldCheck, SignOut, SlidersHorizontal, Sparkle, SpinnerGap, Square, Target, Timer, Translate, Trash, TrendUp, UserCircle, Users, Warning,
  WebhooksLogo, X,
} from "@phosphor-icons/react";

type Classification = "Hot" | "Warm" | "Cold";
type LeadStatus = "New" | "Contacted" | "Qualified";
type Msg = { from: "visitor" | "ai" | "agent"; author: string; time: string; text: string };
type ScoreLine = { label: string; points: number; max: number; note: string };

type Lead = {
  id: number; docket: string; name: string; company: string; initials: string;
  classification: Classification; score: number; interest: string; site: string;
  owner: string; status: LeadStatus; received: string; followup: string; overdue?: boolean;
  brief: string; transcript: Msg[]; scoring: ScoreLine[]; nextAction: string;
  email: string; phone: string; role: string; location: string; linkedin: string;
  companyMeta: string; companySize: string; techStack: string[];
};

const initialLeads: Lead[] = [
  {
    id: 1, docket: "0146", name: "Priya Sharma", company: "Northstar Labs", initials: "PS",
    classification: "Hot", score: 92, interest: "Enterprise onboarding", site: "ailqs.com",
    owner: "Maya", status: "New", received: "4m ago", followup: "Today, 2:30 PM",
    brief: "Evaluating AI qualification across three product sites. Budget approved; wants to launch within two weeks.",
    transcript: [
      { from: "visitor", author: "Priya Sharma", time: "10:14 AM", text: "We're evaluating AI qualification for three product sites. How fast can this go live?" },
      { from: "ai", author: "AILQS AI", time: "10:15 AM", text: "Most workspaces launch across multiple sites in under a week — one qualification script, mapped to each site's own widget." },
      { from: "visitor", author: "Priya Sharma", time: "10:17 AM", text: "Good — budget's approved. We'd want to launch within two weeks. Can we see a demo this week?" },
    ],
    scoring: [
      { label: "Budget confirmed", points: 25, max: 25, note: "Confirmed directly in conversation — no ceiling stated." },
      { label: "Timeline within quarter", points: 22, max: 25, note: "Wants to launch within two weeks." },
      { label: "Decision-maker identified", points: 24, max: 25, note: "VP-level, sole approver on this initiative." },
      { label: "Multi-site fit", points: 21, max: 25, note: "Needs coverage across three product sites." },
    ],
    nextAction: "Send enterprise demo invite before end of day — timeline is tight.",
    email: "priya@northstarlabs.co", phone: "+91 98765 44210",
    role: "VP of Product", location: "Bengaluru, India", linkedin: "linkedin.com/in/priyasharma",
    companyMeta: "B2B SaaS · Developer Tools", companySize: "120–250 FTE", techStack: ["HubSpot CRM", "Segment", "Stripe"],
  },
  {
    id: 2, docket: "0145", name: "Liam Chen", company: "Frame & Field", initials: "LC",
    classification: "Warm", score: 74, interest: "Agency lead routing", site: "studio.ailqs.com",
    owner: "You", status: "Contacted", received: "18m ago", followup: "Tomorrow",
    brief: "Runs a growing design agency and needs leads separated by service line. Timeline this quarter; budget unconfirmed.",
    transcript: [
      { from: "visitor", author: "Liam Chen", time: "9:02 AM", text: "Can leads get routed by which service they asked about?" },
      { from: "ai", author: "AILQS AI", time: "9:03 AM", text: "Yes — qualification questions can branch by service line and route to different owners automatically." },
      { from: "agent", author: "You", time: "9:41 AM", text: "Following up on the routing question with a short Loom this afternoon." },
    ],
    scoring: [
      { label: "Budget confirmed", points: 12, max: 25, note: "Range not yet confirmed." },
      { label: "Timeline within quarter", points: 20, max: 25, note: "Targeting a rollout this quarter." },
      { label: "Decision-maker identified", points: 22, max: 25, note: "Founder — final say on tooling." },
      { label: "Service-line fit", points: 20, max: 25, note: "Needs routing split by service line." },
    ],
    nextAction: "Confirm budget range before proposing a routing setup.",
    email: "liam@framefield.design", phone: "+1 415 555 0192",
    role: "Founder", location: "Austin, TX, USA", linkedin: "linkedin.com/in/liamchen",
    companyMeta: "Design Agency · Creative Services", companySize: "10–25 FTE", techStack: ["Webflow", "Notion"],
  },
  {
    id: 3, docket: "0144", name: "Amelia Brooks", company: "Reform Health", initials: "AB",
    classification: "Hot", score: 86, interest: "Patient enquiries", site: "ailqs.com",
    owner: "Jon", status: "New", received: "41m ago", followup: "Overdue", overdue: true,
    brief: "High-intent enquiry for a compliant website assistant. Asked detailed implementation questions and requested a demonstration.",
    transcript: [
      { from: "visitor", author: "Amelia Brooks", time: "8:20 AM", text: "Does the assistant handle HIPAA-relevant conversations safely?" },
      { from: "ai", author: "AILQS AI", time: "8:21 AM", text: "The assistant can be configured to avoid capturing protected health information and hand off sensitive queries to a human." },
      { from: "visitor", author: "Amelia Brooks", time: "8:26 AM", text: "Understood. Can we get a walkthrough this week?" },
    ],
    scoring: [
      { label: "Budget confirmed", points: 23, max: 25, note: "Approved for a compliant assistant rollout." },
      { label: "Timeline within quarter", points: 23, max: 25, note: "Wants a walkthrough this week." },
      { label: "Decision-maker identified", points: 20, max: 25, note: "Reports directly to the CMO." },
      { label: "Compliance fit", points: 20, max: 25, note: "Requires HIPAA-safe conversation handling." },
    ],
    nextAction: "Overdue — call within the hour before she talks to another vendor.",
    email: "amelia@reformhealth.io", phone: "+44 7700 900247",
    role: "Director of Digital", location: "London, UK", linkedin: "linkedin.com/in/ameliabrooks",
    companyMeta: "Healthcare · Patient Services", companySize: "250–500 FTE", techStack: ["Salesforce Health Cloud", "Twilio"],
  },
  {
    id: 4, docket: "0143", name: "Noah Williams", company: "Arcwell Homes", initials: "NW",
    classification: "Warm", score: 61, interest: "Property enquiries", site: "property.ailqs.com",
    owner: "Unassigned", status: "New", received: "1h ago", followup: "Not set",
    brief: "Interested in routing buyer enquiries by location. Decision timeline and budget have not been provided.",
    transcript: [
      { from: "visitor", author: "Noah Williams", time: "7:50 AM", text: "Can enquiries be split by which listing they came from?" },
      { from: "ai", author: "AILQS AI", time: "7:51 AM", text: "Yes — each listing page can carry its own qualification flow and route to the right agent." },
    ],
    scoring: [
      { label: "Budget confirmed", points: 8, max: 25, note: "Not yet provided." },
      { label: "Timeline within quarter", points: 14, max: 25, note: "No confirmed decision timeline." },
      { label: "Decision-maker identified", points: 18, max: 25, note: "No owner assigned on their side yet." },
      { label: "Listing-volume fit", points: 21, max: 25, note: "High enquiry volume across listings." },
    ],
    nextAction: "Assign an owner and ask for budget range on first contact.",
    email: "noah@arcwellhomes.com", phone: "+61 412 555 018",
    role: "Marketing Manager", location: "Melbourne, Australia", linkedin: "linkedin.com/in/noahwilliams",
    companyMeta: "Real Estate · Residential", companySize: "25–50 FTE", techStack: ["Zillow API", "Mailchimp"],
  },
  {
    id: 5, docket: "0142", name: "Sofia Martinez", company: "Mesa Commerce", initials: "SM",
    classification: "Cold", score: 38, interest: "Product support", site: "studio.ailqs.com",
    owner: "You", status: "Qualified", received: "2h ago", followup: "Sep 6",
    brief: "Researching options for a future support project. No active budget or confirmed purchase window.",
    transcript: [
      { from: "visitor", author: "Sofia Martinez", time: "6:40 AM", text: "Just comparing options right now, not ready to buy yet." },
      { from: "ai", author: "AILQS AI", time: "6:41 AM", text: "Noted — happy to send a comparison sheet for whenever the timing is right." },
    ],
    scoring: [
      { label: "Budget confirmed", points: 4, max: 25, note: "No active budget." },
      { label: "Timeline within quarter", points: 6, max: 25, note: "Researching only, no window stated." },
      { label: "Decision-maker identified", points: 12, max: 25, note: "Not confirmed as the final buyer." },
      { label: "Stated intent", points: 16, max: 25, note: "Comparing options for a future project." },
    ],
    nextAction: "Add to a nurture sequence; revisit in Q_next.",
    email: "sofia@mesacommerce.mx", phone: "+52 55 5555 0134",
    role: "Support Lead", location: "Mexico City, Mexico", linkedin: "linkedin.com/in/sofiamartinez",
    companyMeta: "E-commerce · Retail", companySize: "50–100 FTE", techStack: ["Zendesk", "Shopify"],
  },
  {
    id: 6, docket: "0141", name: "Ethan Okafor", company: "Parcel Grid", initials: "EO",
    classification: "Hot", score: 81, interest: "Logistics qualification", site: "ailqs.com",
    owner: "Maya", status: "Contacted", received: "3h ago", followup: "Friday",
    brief: "Needs qualification across regional sales teams. Strong fit and buying intent; technical validation still required.",
    transcript: [
      { from: "visitor", author: "Ethan Okafor", time: "5:12 AM", text: "We'd need this working across four regional teams — is that realistic?" },
      { from: "agent", author: "Maya Patel", time: "5:40 AM", text: "Scheduled a technical validation call for Friday to confirm the regional setup." },
    ],
    scoring: [
      { label: "Budget confirmed", points: 21, max: 25, note: "Confirmed at the regional level." },
      { label: "Timeline within quarter", points: 19, max: 25, note: "Technical validation call set for Friday." },
      { label: "Decision-maker identified", points: 20, max: 25, note: "Reports to VP Sales, strong buying signal." },
      { label: "Multi-region fit", points: 21, max: 25, note: "Needs qualification across four regions." },
    ],
    nextAction: "Confirm regional setup on Friday's technical call.",
    email: "ethan@parcelgrid.africa", phone: "+234 803 555 0188",
    role: "Head of Sales Ops", location: "Lagos, Nigeria", linkedin: "linkedin.com/in/ethanokafor",
    companyMeta: "Logistics · Last-mile Delivery", companySize: "500+ FTE", techStack: ["NetSuite", "Twilio"],
  },
  {
    id: 7, docket: "0140", name: "Grace Kim", company: "Ledger & Co", initials: "GK",
    classification: "Cold", score: 29, interest: "General enquiry", site: "ailqs.com",
    owner: "Unassigned", status: "New", received: "5h ago", followup: "Not set",
    brief: "Left a general enquiry with no stated timeline, budget, or decision authority signals.",
    transcript: [
      { from: "visitor", author: "Grace Kim", time: "3:05 AM", text: "Just looking around, will reach out if we need anything." },
    ],
    scoring: [
      { label: "Budget confirmed", points: 2, max: 25, note: "No budget signal." },
      { label: "Timeline within quarter", points: 3, max: 25, note: "No stated timeline." },
      { label: "Decision-maker identified", points: 9, max: 25, note: "Not identified yet." },
      { label: "Stated intent", points: 15, max: 25, note: "Early-stage browsing only." },
    ],
    nextAction: "No action required — monitor for a return visit.",
    email: "grace@ledgerandco.com", phone: "+1 212 555 0110",
    role: "Operations Assistant", location: "Toronto, Canada", linkedin: "linkedin.com/in/gracekim",
    companyMeta: "Professional Services · Accounting", companySize: "10–25 FTE", techStack: ["QuickBooks"],
  },
];

const notifications = [
  { id: 1, title: "No. 0146 docketed Hot", body: "Priya Sharma — 92, enterprise onboarding.", time: "4m", unread: true },
  { id: 2, title: "Webhook delivery failed", body: "CRM sync endpoint returned a timeout twice.", time: "9m", unread: true },
  { id: 3, title: "No. 0144 follow-up overdue", body: "Amelia Brooks — 38 minutes past target.", time: "22m", unread: true },
  { id: 4, title: "No. 0140 qualified", body: "Sofia Martinez moved to Qualified by you.", time: "1h", unread: false },
  { id: 5, title: "Weekly digest ready", body: "37 cases docketed, 61% qualification rate.", time: "3h", unread: false },
];

const tickerItems = [
  { icon: Fire, text: "No. 0146 docketed Hot — Priya Sharma, score 92" },
  { icon: WebhooksLogo, text: "Webhook delivery failed — CRM sync retry needed" },
  { icon: Clock, text: "No. 0144 follow-up overdue by 38 minutes" },
  { icon: CheckCircle, text: "No. 0140 marked Qualified by you" },
  { icon: Robot, text: "AI qualified 12 conversations in the last hour" },
  { icon: ArrowsLeftRight, text: "No. 0145 moved to Contacted" },
];

const agents = [
  {
    id: 1, name: "Frontline Qualifier", role: "Handles first response on ailqs.com and studio.ailqs.com", status: "Active" as const, conversations: 214, accuracy: 96,
    archetype: "Warm & Advisory", tones: ["Data-driven", "Crisp & Concise"], length: "Concise (1–2 sentences)",
    prompt: "You are Frontline Qualifier, the senior inbound lead qualifier for AILQS. Welcome website visitors, discover their project scope, verify timeline and budget feasibility, and book high-intent prospects onto the sales calendar. Maintain an advisory, clear demeanor.",
  },
  {
    id: 2, name: "Enterprise Concierge", role: "Escalates enterprise-scale enquiries with a guided demo offer", status: "Active" as const, conversations: 58, accuracy: 91,
    archetype: "Consultative Expert", tones: ["Authoritative", "Empathetic"], length: "Balanced (2–3 paragraphs)",
    prompt: "You are Enterprise Concierge. Identify enterprise-scale prospects, qualify on seat count and procurement timeline, and route confirmed opportunities to a guided demo with the enterprise sales lead.",
  },
  {
    id: 3, name: "Support Triage", role: "Separates support requests from sales enquiries", status: "Paused" as const, conversations: 132, accuracy: 88,
    archetype: "Professional & Direct", tones: ["Crisp & Concise"], length: "Concise (1–2 sentences)",
    prompt: "You are Support Triage. Distinguish support requests from sales enquiries, resolve common questions from the knowledge base, and hand off unresolved issues to the human support queue.",
  },
];

const archetypeOptions = ["Professional & Direct", "Warm & Advisory", "Playful & Casual", "Consultative Expert"];
const toneOptions = ["Empathetic", "Data-driven", "Crisp & Concise", "Authoritative"];
const lengthOptions = ["Concise (1–2 sentences)", "Balanced (2–3 paragraphs)", "Detailed & Thorough"];

const setupChecklist = [
  { id: 1, label: "Install the website widget", done: true },
  { id: 2, label: "Connect CRM destination", done: true },
  { id: 3, label: "Define qualification questions", done: true },
  { id: 4, label: "Configure lead scoring rules", done: true },
  { id: 5, label: "Verify webhook endpoint", done: false },
  { id: 6, label: "Invite the rest of the team", done: false },
];

const knowledgeSources = [
  { icon: Globe, label: "Website URL crawling", detail: "ailqs.com, studio.ailqs.com, property.ailqs.com" },
  { icon: FileText, label: "PDF upload", detail: "3 documents indexed, last updated 2 days ago" },
  { icon: NotePencil, label: "Manual FAQ entries", detail: "18 entries covering pricing, setup, and support" },
];

function classMeta(c: Classification) {
  if (c === "Hot") return { icon: Fire, weight: "fill" as const, label: "Hot" };
  if (c === "Warm") return { icon: Lightning, weight: "regular" as const, label: "Warm" };
  return { icon: Circle, weight: "regular" as const, label: "Cold" };
}

function ClassBadge({ c }: { c: Classification }) {
  const m = classMeta(c);
  const Icon = m.icon;
  if (c === "Hot") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0a0a0a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
        <Icon size={11} weight="fill" /> {m.label}
      </span>
    );
  }
  if (c === "Warm") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0a0a0a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0a0a0a]">
        <Icon size={11} /> {m.label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#666666]">
      <Icon size={9} /> {m.label}
    </span>
  );
}

function StatusTag({ status, overdue }: { status: LeadStatus; overdue?: boolean }) {
  const Icon = status === "New" ? Circle : status === "Contacted" ? ArrowsLeftRight : CheckCircle;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${overdue ? "text-[#0a0a0a]" : "text-[#525252]"}`}>
      <Icon size={12} weight={status === "Qualified" ? "fill" : "regular"} />
      {overdue ? "Overdue" : status}
    </span>
  );
}

function timeAgoRank(s: string) {
  return s;
}

function inboxTag(lead: Lead) {
  const last = lead.transcript[lead.transcript.length - 1];
  if (lead.overdue || (lead.classification === "Hot" && lead.status === "New")) return { label: "Handoff needed", icon: Warning };
  if (last?.from === "ai") return { label: "AI active", icon: Robot };
  return { label: "Reviewed", icon: CheckCircle };
}

const workspaceNav = [
  ["dashboard", "Dashboard", Target] as const,
  ["inbox", "Inbox", ChatCircle] as const,
  ["leads", "Leads", Users] as const,
  ["followups", "Follow-ups", PaperPlaneTilt] as const,
  ["agent", "AI Agent", Robot] as const,
  ["qualification", "Qualification", ListChecks] as const,
  ["knowledgebase", "Knowledge Base", BookOpenText] as const,
  ["websites", "Websites & Widget", PuzzlePiece] as const,
  ["analytics", "Analytics", ChartLineUp] as const,
  ["integrations", "Integrations", CirclesThreePlus] as const,
];
const adminNav = [
  ["team", "Team", IdentificationBadge] as const,
  ["notifications", "Notifications", Bell] as const,
  ["billing", "Billing & Usage", CreditCard] as const,
  ["settings", "Settings", GearSix] as const,
];
const allNav = [...workspaceNav, ...adminNav, ["help", "Help & Support", Lifebuoy] as const];
type SectionKey = (typeof allNav)[number][0];
const sectionLabel: Record<SectionKey, string> = Object.fromEntries(allNav.map(([key, label]) => [key, label])) as Record<SectionKey, string>;

/* ---------------------------------------------------------------------- */
/* Qualification & Scoring                                                 */
/* ---------------------------------------------------------------------- */

type QualificationQuestion = {
  id: number; label: string; crmField: string; fieldType: string; points: string; askCondition: string; required: boolean;
};

const crmFieldOptions = [
  "lead.budget_range", "lead.timeline", "lead.service_interest", "lead.company_size",
  "lead.intent_score", "lead.decision_role", "lead.geo_location", "lead.custom_field",
];
const fieldTypeOptions = [
  "Currency Range", "Segmented Choices", "Single Select Pills", "Select Range",
  "AI Detected (No Prompt)", "Free Text Response", "Number Input", "Date Picker",
];

const initialQuestions: QualificationQuestion[] = [
  { id: 1, label: "Budget & Investment Range", crmField: "lead.budget_range", fieldType: "Currency Range", points: "Up to +25 pts", askCondition: "Ask if interest != General Enquiry", required: true },
  { id: 2, label: "Project Timeline & Kickoff", crmField: "lead.timeline", fieldType: "Segmented Choices", points: "+20 pts (< 30 days)", askCondition: "Ask after budget confirmed", required: true },
  { id: 3, label: "Service / Product Interest", crmField: "lead.service_interest", fieldType: "Single Select Pills", points: "Up to +20 pts", askCondition: "Always ask (Turn 1)", required: true },
  { id: 4, label: "Company / Business Fit", crmField: "lead.company_size", fieldType: "Select Range", points: "Up to +15 pts", askCondition: "Ask if enterprise mode", required: false },
  { id: 5, label: "Buying Intent Signal", crmField: "lead.intent_score", fieldType: "AI Detected (No Prompt)", points: "Up to +20 pts", askCondition: "Derived from conversation language", required: false },
];

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange}
      className={`relative h-5 w-9 shrink-0 border border-[#0a0a0a] transition-colors ${checked ? "bg-[#0a0a0a]" : "bg-white"}`}
    >
      <span className={`absolute top-0.5 h-3 w-3 border border-[#0a0a0a] transition-transform ${checked ? "translate-x-[19px] bg-white" : "translate-x-0.5 bg-[#0a0a0a]"}`} />
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
  const [conditionValue, setConditionValue] = useState("General Enquiry");
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
      id: Date.now(), label: label.trim(), crmField, fieldType,
      points: scoringEffects[0] ?? "No scoring effect",
      askCondition: conditionField.trim() && conditionValue.trim() ? `Ask if ${conditionField.trim()} != '${conditionValue.trim()}'` : "Always ask",
      required,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <aside className="td-pop relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-[#0a0a0a] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
        <div className="flex items-start justify-between border-b border-[#e5e5e5] p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center border border-[#0a0a0a]"><NotePencil size={17} /></span>
            <div>
              <h2 className="text-[15px] font-extrabold">Create Qualification Question</h2>
              <p className="mt-0.5 text-[11px] text-[#666666]">Define field mapping, phrasing, and AI extraction rules</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="shrink-0 p-1 text-[#666666] hover:text-[#0a0a0a]"><X size={18} /></button>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide">Question Label / Internal Name</span>
            <input name="questionLabel" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Timeline Urgency" className="border border-[#e5e5e5] px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[#0a0a0a]" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide">Mapped CRM Field</span>
            <div className="relative">
              <select name="crmField" value={crmField} onChange={(e) => setCrmField(e.target.value)} className="h-10 w-full appearance-none border border-[#e5e5e5] px-3 pr-9 font-mono text-[11.5px] outline-none focus:border-[#0a0a0a]">
                {crmFieldOptions.map((f) => <option key={f}>{f}</option>)}
              </select>
              <CaretDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]" />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide">Input &amp; Field Type</span>
            <div className="relative">
              <select name="fieldType" value={fieldType} onChange={(e) => setFieldType(e.target.value)} className="h-10 w-full appearance-none border border-[#e5e5e5] px-3 pr-9 text-[12.5px] outline-none focus:border-[#0a0a0a]">
                {fieldTypeOptions.map((f) => <option key={f}>{f}</option>)}
              </select>
              <CaretDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]" />
            </div>
          </label>

          <div className="flex items-center justify-between gap-3 border border-[#e5e5e5] bg-[#fafafa] p-3">
            <div>
              <span className="block text-[11.5px] font-bold">Required Question</span>
              <span className="text-[10.5px] text-[#666666]">Conversation won&rsquo;t yield qualified tag until filled</span>
            </div>
            <ToggleSwitch checked={required} onChange={() => setRequired((v) => !v)} label="Required question" />
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide">Default Visitor Prompt</span>
            <input name="defaultPrompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. When is your target kickoff date?" className="border border-[#e5e5e5] px-3 py-2 text-[12.5px] outline-none focus:border-[#0a0a0a]" />
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 border border-[#e5e5e5] bg-[#fafafa] p-3">
            <input type="checkbox" name="aiAdaptivePhrasing" checked={aiAdaptive} onChange={(e) => setAiAdaptive(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#0a0a0a]" />
            <span>
              <span className="block text-[11.5px] font-bold">AI Adaptive Phrasing</span>
              <span className="text-[10.5px] text-[#666666]">Allow the agent to dynamically rephrase based on conversation tone &amp; previous context</span>
            </span>
          </label>

          <div className="flex flex-col gap-2 border border-[#e5e5e5] bg-[#fafafa] p-3">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide"><FlowArrow size={14} className="text-[#666666]" />Ask Condition / Branching</span>
            <div className="flex flex-wrap items-center gap-1.5 border border-[#e5e5e5] bg-white px-2.5 py-2 text-[11.5px] font-mono">
              <span className="font-bold">IF</span>
              <input name="conditionField" aria-label="Ask condition field" value={conditionField} onChange={(e) => setConditionField(e.target.value)} className="w-28 border border-[#e5e5e5] px-1.5 py-0.5 outline-none focus:border-[#0a0a0a]" />
              <span className="text-[#666666]">!=</span>
              <input name="conditionValue" aria-label="Ask condition value" value={conditionValue} onChange={(e) => setConditionValue(e.target.value)} className="w-24 border border-[#e5e5e5] px-1.5 py-0.5 outline-none focus:border-[#0a0a0a]" />
              <span className="ml-auto shrink-0 border border-[#0a0a0a] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">THEN Ask</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide"><ChartLineUp size={14} className="text-[#666666]" />Scoring Impact</span>
            <div className="flex flex-col gap-1.5">
              {scoringEffects.map((effect, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 border border-[#0a0a0a] px-3 py-2 text-[11.5px] font-bold">
                  <span className="flex items-center gap-1.5"><Target size={13} />{effect}</span>
                  <button type="button" onClick={() => removeScoringEffect(idx)} aria-label="Remove scoring effect" className="text-[#666666] hover:text-[#0a0a0a]"><X size={13} /></button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <input name="scoringEffect" aria-label="New scoring effect" value={newEffect} onChange={(e) => setNewEffect(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addScoringEffect(); } }} placeholder="e.g. +10 pts if budget confirmed" className="h-8 flex-1 border border-[#e5e5e5] px-2.5 text-[10.5px] outline-none focus:border-[#0a0a0a]" />
              <button type="button" onClick={addScoringEffect} className="flex items-center gap-1 border border-[#0a0a0a] px-2.5 py-1.5 text-[10.5px] font-bold hover:bg-[#0a0a0a] hover:text-white"><Plus size={13} />Add</button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide"><Translate size={14} className="text-[#666666]" />Multilingual Phrasing Support</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {languages.map((lang) => (
                <span key={lang} className="border border-[#e5e5e5] px-2.5 py-1 text-[10.5px] font-bold text-[#525252]">{lang}</span>
              ))}
              {addingLanguage ? (
                <span className="flex items-center gap-1">
                  <input name="newLanguage" aria-label="New language" autoFocus value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLanguage(); } if (e.key === "Escape") setAddingLanguage(false); }} placeholder="Language" className="h-7 w-24 border border-[#0a0a0a] px-2.5 text-[10.5px] outline-none" />
                  <button type="button" onClick={addLanguage} aria-label="Confirm language"><Check size={14} weight="bold" /></button>
                </span>
              ) : (
                <button type="button" onClick={() => setAddingLanguage(true)} aria-label="Add language" className="grid h-7 w-7 place-items-center border border-[#e5e5e5] text-[#525252] hover:border-[#0a0a0a] hover:text-[#0a0a0a]"><Plus size={13} /></button>
              )}
            </div>
          </div>

          <p className="flex items-start gap-2 text-[10.5px] text-[#666666]"><Info size={13} className="mt-0.5 shrink-0" />Graceful extraction with 2 retry attempts before human handoff.</p>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-[#e5e5e5] bg-[#fafafa] p-4">
          <button type="button" onClick={onClose} className="border border-[#e5e5e5] px-4 py-2 text-[11px] font-bold text-[#525252] hover:border-[#0a0a0a] hover:text-[#0a0a0a]">Cancel</button>
          <button type="button" onClick={save} className="bg-[#0a0a0a] px-5 py-2 text-[11px] font-bold text-white hover:bg-[#262626]">Save Question</button>
        </div>
      </aside>
    </div>
  );
}

type ScoringRuleKind = "positive" | "highlight" | "alert" | "penalty";
type ScoringRuleIcon = "lightning" | "sparkle" | "bellRinging" | "minusCircle" | "shieldCheck" | "chartLineUp";

type ScoringRule = {
  id: number; name: string; category: string; kind: ScoringRuleKind; icon: ScoringRuleIcon; points: number;
  conditionIf: string; conditionAnd?: string; note?: { prefix: string; highlight: string; suffix: string };
  matched: number; capturePercent?: string; evaluatedAgo: string; precision: string; active: boolean;
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
  { id: 2, name: "Core Offering Match", category: "Service Fit", kind: "highlight", icon: "sparkle", points: 18, conditionIf: 'Interest is "Enterprise Onboarding"', matched: 482, evaluatedAgo: "12m ago", precision: "98.9%", active: true },
  { id: 3, name: "Direct Hot Handover", category: "Intent & Routing", kind: "alert", icon: "bellRinging", points: 22, conditionIf: 'Buying Intent is "High (Immediate Need)"', note: { prefix: "Trigger Slack alert to ", highlight: "#enterprise-sales", suffix: " & assign round-robin" }, matched: 142, evaluatedAgo: "1m ago", precision: "99.7%", active: true },
  { id: 4, name: "Penalty", category: "Demographics", kind: "penalty", icon: "minusCircle", points: 20, conditionIf: 'Location is "Outside Service Area"', matched: 64, evaluatedAgo: "42m ago", precision: "96.5%", active: true },
  { id: 5, name: "Authority Boost", category: "Authority", kind: "positive", icon: "shieldCheck", points: 15, conditionIf: 'Decision Maker Role is "C-Level / VP / Founder"', matched: 215, evaluatedAgo: "18m ago", precision: "99.1%", active: true },
  { id: 6, name: "Scale Fit", category: "Scale & Volume", kind: "positive", icon: "chartLineUp", points: 10, conditionIf: "Monthly Enquiry Volume > 50 leads", matched: 98, evaluatedAgo: "2h ago", precision: "97.8%", active: true },
];

function RuleLogicRow({ rule }: { rule: ScoringRule }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border border-[#e5e5e5] bg-[#fafafa] p-3 text-[11px]">
      <span className="bg-[#0a0a0a] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">IF</span>
      <span className="border border-[#e5e5e5] bg-white px-2.5 py-1 font-mono text-[10.5px] font-bold">{rule.conditionIf}</span>
      {rule.conditionAnd && (
        <>
          <span className="border border-[#0a0a0a] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">AND</span>
          <span className="border border-[#e5e5e5] bg-white px-2.5 py-1 font-mono text-[10.5px] font-bold">{rule.conditionAnd}</span>
        </>
      )}
      <span className="border border-[#0a0a0a] bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">THEN</span>
      <span className="bg-[#0a0a0a] px-2.5 py-1 text-[10.5px] font-bold text-white">{thenLabel(rule)}</span>
      {rule.note && (
        <>
          <span className="border border-[#0a0a0a] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">AND</span>
          <span className="flex items-center gap-1.5 border border-[#e5e5e5] bg-white px-2.5 py-1 text-[10.5px] font-semibold">
            <Megaphone size={13} />{rule.note.prefix}<b className="font-bold">{rule.note.highlight}</b>{rule.note.suffix}
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
  return (
    <div className="flex flex-col gap-3 border border-[#0a0a0a] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {reorderMode ? (
            <div className="flex flex-col">
              <button type="button" disabled={!canMoveUp} onClick={onMoveUp} aria-label={`Move ${rule.name} up in priority`} className="text-[#666666] hover:text-[#0a0a0a] disabled:opacity-30"><CaretUp size={13} /></button>
              <button type="button" disabled={!canMoveDown} onClick={onMoveDown} aria-label={`Move ${rule.name} down in priority`} className="text-[#666666] hover:text-[#0a0a0a] disabled:opacity-30"><CaretDown size={13} /></button>
            </div>
          ) : (
            <DotsSixVertical size={16} className="text-[#999999]" />
          )}
          <span className="border border-[#0a0a0a] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">Priority #{priority}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#666666]">{rule.category}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wide"><Icon size={13} weight="bold" />{tagLabel(rule)}</span>
          <ToggleSwitch checked={rule.active} onChange={onToggleActive} label={`Toggle ${rule.name}`} />
          <div className="relative">
            <button type="button" onClick={onToggleMenu} aria-label={`More actions for ${rule.name}`} className="p-1 text-[#666666] hover:text-[#0a0a0a]"><DotsThree size={18} weight="bold" /></button>
            {menuOpen && (
              <div className="absolute right-0 top-7 z-10 w-32 border border-[#0a0a0a] bg-white py-1 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                <button type="button" onClick={onDelete} className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-[11px] font-bold hover:bg-[#0a0a0a] hover:text-white"><Trash size={13} />Delete Rule</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <RuleLogicRow rule={rule} />

      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[10.5px] text-[#666666]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-[#0a0a0a]"><CheckCircle size={13} weight="fill" />{rule.matched} leads matched</span>
          {rule.capturePercent && <span>({rule.capturePercent})</span>}
          <span>•</span><span>Evaluated {rule.evaluatedAgo}</span><span>•</span><span className="font-bold text-[#0a0a0a]">{rule.precision} precision</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onEdit} className="font-bold uppercase tracking-wide text-[#666666] hover:text-[#0a0a0a]">Edit</button>
          <span>•</span>
          <button type="button" onClick={onDuplicate} className="font-bold uppercase tracking-wide text-[#666666] hover:text-[#0a0a0a]">Duplicate</button>
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
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <aside className="td-pop relative flex h-full w-full max-w-md flex-col gap-5 overflow-y-auto border-l border-[#0a0a0a] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center border border-[#0a0a0a]"><Gauge size={18} /></span>
            <div><h2 className="text-[15px] font-extrabold">{initial ? "Edit Scoring Rule" : "Add Scoring Rule"}</h2><p className="text-[11px] text-[#666666]">Define the condition, category, and point impact</p></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>

        <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase tracking-wide">Rule Name
          <input name="ruleName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. High Velocity" className="border border-[#e5e5e5] px-3 py-2 text-[12.5px] font-semibold normal-case outline-none focus:border-[#0a0a0a]" />
        </label>

        <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase tracking-wide">Category
          <select name="ruleCategory" value={category} onChange={(e) => setCategory(e.target.value)} className="border border-[#e5e5e5] px-3 py-2 text-[12.5px] font-semibold normal-case outline-none focus:border-[#0a0a0a]">
            {ruleCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase tracking-wide">Rule Type
            <select name="ruleKind" value={kind} onChange={(e) => setKind(e.target.value as ScoringRuleKind)} className="border border-[#e5e5e5] px-3 py-2 text-[12.5px] font-semibold normal-case outline-none focus:border-[#0a0a0a]">
              {ruleKindOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase tracking-wide">Points
            <input type="number" name="rulePoints" min={1} value={points} onChange={(e) => setPoints(Number(e.target.value))} className="border border-[#e5e5e5] px-3 py-2 text-[12.5px] font-semibold normal-case outline-none focus:border-[#0a0a0a]" />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase tracking-wide">Condition (IF)
          <input name="ruleConditionIf" value={conditionIf} onChange={(e) => setConditionIf(e.target.value)} placeholder="e.g. Budget ≥ €200,000" className="border border-[#e5e5e5] px-3 py-2 text-[12.5px] font-semibold normal-case outline-none focus:border-[#0a0a0a]" />
        </label>
        <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase tracking-wide">Additional Condition (AND) — optional
          <input name="ruleConditionAnd" value={conditionAnd} onChange={(e) => setConditionAnd(e.target.value)} placeholder="e.g. Timeline is within 30 days" className="border border-[#e5e5e5] px-3 py-2 text-[12.5px] font-semibold normal-case outline-none focus:border-[#0a0a0a]" />
        </label>

        <div className="flex items-center justify-between gap-3 border border-[#e5e5e5] bg-[#fafafa] p-3">
          <div><span className="block text-[11.5px] font-bold">Rule Active</span><span className="text-[10px] text-[#666666]">Live in the scoring engine immediately</span></div>
          <ToggleSwitch checked={active} onChange={() => setActive((v) => !v)} label="Rule active" />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#666666]">Preview</span>
          <RuleLogicRow rule={previewRule} />
        </div>

        <div className="mt-auto flex items-center justify-end gap-2 border-t border-[#e5e5e5] pt-4">
          <button type="button" onClick={onClose} className="border border-[#e5e5e5] px-4 py-2 text-[11px] font-bold text-[#525252] hover:border-[#0a0a0a] hover:text-[#0a0a0a]">Cancel</button>
          <button type="button" onClick={save} className="bg-[#0a0a0a] px-5 py-2 text-[11px] font-bold text-white hover:bg-[#262626]">{initial ? "Save Changes" : "Add Rule"}</button>
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
    <div className="flex flex-col gap-4 border border-[#0a0a0a] p-5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13px] font-extrabold"><SlidersHorizontal size={16} />Lead Temperature Thresholds</span>
        <button type="button" onClick={() => setEditing((v) => !v)} aria-label="Edit temperature thresholds" aria-pressed={editing} className={`border p-1 ${editing ? "border-[#0a0a0a] bg-[#0a0a0a] text-white" : "border-[#e5e5e5] text-[#666666] hover:border-[#0a0a0a] hover:text-[#0a0a0a]"}`}><NotePencil size={14} /></button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-[#666666]">Determines automatic routing and tag assignment based on final cumulative score.</p>
        <span className="shrink-0 border border-[#0a0a0a] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">Auto-recalc</span>
      </div>

      {editing && (
        <div className="flex flex-col gap-2 border border-[#e5e5e5] bg-[#fafafa] p-3">
          <label className="flex items-center justify-between gap-2 text-[10.5px] font-bold uppercase tracking-wide text-[#525252]">Warm starts at
            <input type="number" name="warmThreshold" min={1} max={hotStart - 1} value={warmStart} onChange={(e) => onChangeWarm(Math.min(hotStart - 1, Math.max(1, Number(e.target.value))))} className="w-16 border border-[#0a0a0a] bg-white px-2 py-1 text-right text-[12px] font-extrabold outline-none" />
          </label>
          <label className="flex items-center justify-between gap-2 text-[10.5px] font-bold uppercase tracking-wide text-[#525252]">Hot starts at
            <input type="number" name="hotThreshold" min={warmStart + 1} max={99} value={hotStart} onChange={(e) => onChangeHot(Math.min(99, Math.max(warmStart + 1, Number(e.target.value))))} className="w-16 border border-[#0a0a0a] bg-white px-2 py-1 text-right text-[12px] font-extrabold outline-none" />
          </label>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex h-7 w-full border border-[#0a0a0a]">
          <div className="flex items-center justify-center whitespace-nowrap border-r border-[#0a0a0a] bg-white text-[9px] font-bold text-[#666666]" style={{ width: `${warmStart}%` }}>Cold (0-{warmStart - 1})</div>
          <div className="flex items-center justify-center whitespace-nowrap border-r border-[#0a0a0a] bg-[#e5e5e5] text-[9px] font-bold" style={{ width: `${hotStart - warmStart}%` }}>Warm ({warmStart}-{hotStart - 1})</div>
          <div className="flex items-center justify-center whitespace-nowrap bg-[#0a0a0a] text-[9px] font-bold text-white" style={{ width: `${100 - hotStart}%` }}>Hot ({hotStart}+)</div>
        </div>
        <div className="flex items-center justify-between px-1 text-[9.5px] text-[#666666]">
          <span>0</span><span className="font-bold text-[#0a0a0a]">{warmStart}</span><span className="font-bold text-[#0a0a0a]">{hotStart}</span><span>100</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between border border-[#e5e5e5] p-2.5">
          <div className="flex items-center gap-2"><Circle size={10} className="text-[#666666]" /><div><span className="block text-[11.5px] font-bold">Cold / Nurture Queue</span><span className="text-[10px] text-[#666666]">Score 0 – {warmStart - 1}</span></div></div>
          <div className="text-right"><span className="block text-[12px] font-extrabold">{coldPct}%</span><span className="text-[9px] text-[#666666]">of volume</span></div>
        </div>
        <div className="flex items-center justify-between border border-[#e5e5e5] p-2.5">
          <div className="flex items-center gap-2"><Lightning size={11} className="text-[#525252]" /><div><span className="block text-[11.5px] font-bold">Warm / SDR Sequence</span><span className="text-[10px] text-[#666666]">Score {warmStart} – {hotStart - 1}</span></div></div>
          <div className="text-right"><span className="block text-[12px] font-extrabold">{warmPct}%</span><span className="text-[9px] text-[#666666]">of volume</span></div>
        </div>
        <div className="flex items-center justify-between border border-[#0a0a0a] p-2.5">
          <div className="flex items-center gap-2"><Fire size={11} weight="fill" /><div><span className="block text-[11.5px] font-bold">Hot / Direct Booking</span><span className="text-[10px] text-[#666666]">Score {hotStart} – 100</span></div></div>
          <div className="text-right"><span className="block text-[12px] font-extrabold">{hotPct}%</span><span className="text-[9px] text-[#666666]">of volume</span></div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 border border-[#e5e5e5] bg-[#fafafa] p-3 text-[11px] text-[#666666]">
        <Timer size={16} className="mt-0.5 shrink-0" />
        <span><b className="font-bold text-[#0a0a0a]">SLA Commitment:</b> Hot leads trigger automatic distribution requiring agent outreach within <span className="font-bold text-[#0a0a0a]">15 minutes</span>.</span>
      </div>
    </div>
  );
}

const simulatorPresets = [
  { name: "Solstice Robotics", budget: 320000, timelineDays: 18, interest: "Enterprise onboarding", intent: "High (Immediate Need)", authority: "Founder / C-Level", location: "Tier-1 Market" },
  { name: "Harbor Analytics", budget: 90000, timelineDays: 50, interest: "Enterprise onboarding", intent: "High (Immediate Need)", authority: "VP / Director", location: "Tier-1 Market" },
  { name: "Vantage Freight", budget: 40000, timelineDays: 90, interest: "General enquiry", intent: "Low (Research Only)", authority: "Individual Contributor", location: "Outside Service Area" },
];
const interestOptions = ["Enterprise onboarding", "Agency lead routing", "Patient enquiries", "Property enquiries", "Product support", "Logistics qualification", "General enquiry"];
const intentOptions = ["High (Immediate Need)", "Medium (Exploring)", "Low (Research Only)"];
const authorityOptions = ["Founder / C-Level", "VP / Director", "Manager", "Individual Contributor"];
const locationOptions = ["Tier-1 Market", "Tier-2 Market", "Outside Service Area"];

function TestScoreSimulatorCard({ scoringRules, warmStart, hotStart, notify }: { scoringRules: ScoringRule[]; warmStart: number; hotStart: number; notify: (v: string) => void }) {
  const [presetIndex, setPresetIndex] = useState(0);
  const preset = simulatorPresets[presetIndex];
  const [budget, setBudget] = useState(preset.budget);
  const [timelineDays, setTimelineDays] = useState(preset.timelineDays);
  const [interest, setInterest] = useState(preset.interest);
  const [intent, setIntent] = useState(preset.intent);
  const [authority, setAuthority] = useState(preset.authority);
  const [location, setLocation] = useState(preset.location);

  function applyPreset(idx: number) {
    const p = simulatorPresets[idx];
    setPresetIndex(idx);
    setBudget(p.budget); setTimelineDays(p.timelineDays); setInterest(p.interest); setIntent(p.intent); setAuthority(p.authority); setLocation(p.location);
  }

  const isActive = (id: number) => scoringRules.find((r) => r.id === id)?.active ?? false;

  const breakdown = useMemo(() => {
    const lines: { label: string; points: number }[] = [{ label: "Base Initial Score", points: 0 }];
    if (isActive(1) && budget >= 200000 && timelineDays <= 30) lines.push({ label: "Budget (≥ €200K) & Timeline (≤ 30d)", points: 25 });
    if (isActive(3) && intent === "High (Immediate Need)") lines.push({ label: "Buying Intent Signal (High)", points: 22 });
    if (isActive(2) && interest === "Enterprise onboarding") lines.push({ label: "Service Fit (Enterprise Onboarding)", points: 18 });
    if (isActive(5) && (authority === "Founder / C-Level" || authority === "VP / Director")) lines.push({ label: `Decision Maker (${authority.split(" / ")[0]})`, points: 15 });
    if (location !== "Outside Service Area") lines.push({ label: `Geographic Fit (${location})`, points: 6 });
    else if (isActive(4)) lines.push({ label: "Location Outside Service Area (Penalty)", points: -20 });
    return lines;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoringRules, budget, timelineDays, interest, intent, authority, location]);

  const rawTotal = breakdown.reduce((sum, l) => sum + l.points, 0);
  const total = Math.max(0, Math.min(100, rawTotal));
  const tier: "Hot" | "Warm" | "Cold" = total >= hotStart ? "Hot" : total >= warmStart ? "Warm" : "Cold";

  return (
    <div className="flex flex-col gap-4 border border-[#0a0a0a] p-5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13px] font-extrabold"><PlayCircle size={17} weight="fill" />Test Score Simulator</span>
        <span className="border border-[#e5e5e5] px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-[#525252]">Sample {preset.name}</span>
      </div>

      <div className="flex flex-col gap-2 border border-[#e5e5e5] bg-[#fafafa] p-3">
        <span className="text-[9px] font-bold uppercase tracking-wide text-[#666666]">Candidate Inputs</span>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-[9.5px] font-bold uppercase tracking-wide text-[#666666]">Budget (€)
            <input type="number" name="simBudget" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="border border-[#e5e5e5] bg-white px-2 py-1 text-[12px] font-semibold normal-case outline-none focus:border-[#0a0a0a]" />
          </label>
          <label className="flex flex-col gap-1 text-[9.5px] font-bold uppercase tracking-wide text-[#666666]">Timeline (days)
            <input type="number" name="simTimeline" value={timelineDays} onChange={(e) => setTimelineDays(Number(e.target.value))} className="border border-[#e5e5e5] bg-white px-2 py-1 text-[12px] font-semibold normal-case outline-none focus:border-[#0a0a0a]" />
          </label>
          <label className="flex flex-col gap-1 text-[9.5px] font-bold uppercase tracking-wide text-[#666666]">Interest
            <select name="simInterest" value={interest} onChange={(e) => setInterest(e.target.value)} className="border border-[#e5e5e5] bg-white px-2 py-1 text-[12px] font-semibold normal-case outline-none focus:border-[#0a0a0a]">
              {interestOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[9.5px] font-bold uppercase tracking-wide text-[#666666]">Intent
            <select name="simIntent" value={intent} onChange={(e) => setIntent(e.target.value)} className="border border-[#e5e5e5] bg-white px-2 py-1 text-[12px] font-semibold normal-case outline-none focus:border-[#0a0a0a]">
              {intentOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[9.5px] font-bold uppercase tracking-wide text-[#666666]">Authority
            <select name="simAuthority" value={authority} onChange={(e) => setAuthority(e.target.value)} className="border border-[#e5e5e5] bg-white px-2 py-1 text-[12px] font-semibold normal-case outline-none focus:border-[#0a0a0a]">
              {authorityOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[9.5px] font-bold uppercase tracking-wide text-[#666666]">Location
            <select name="simLocation" value={location} onChange={(e) => setLocation(e.target.value)} className="border border-[#e5e5e5] bg-white px-2 py-1 text-[12px] font-semibold normal-case outline-none focus:border-[#0a0a0a]">
              {locationOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className={`flex items-center justify-between border p-4 ${tier === "Hot" ? "border-[#0a0a0a] bg-[#0a0a0a] text-white" : "border-[#e5e5e5]"}`}>
        <div>
          <span className={`block text-[9px] font-bold uppercase tracking-wide ${tier === "Hot" ? "text-white/60" : "text-[#666666]"}`}>Simulated Score</span>
          <div className="flex items-baseline gap-1"><span className="text-[28px] font-extrabold leading-none">{total}</span><span className={`text-[13px] ${tier === "Hot" ? "text-white/70" : "text-[#666666]"}`}>/ 100</span></div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`flex items-center gap-1 border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${tier === "Hot" ? "border-white bg-white text-[#0a0a0a]" : "border-[#0a0a0a]"}`}><Fire size={13} weight="fill" />{tier} Lead</span>
          <span className={`flex items-center gap-1 text-[9.5px] font-bold ${tier === "Hot" ? "text-white/80" : "text-[#525252]"}`}><Check size={11} weight="bold" />Auto-Route Qualified</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-bold uppercase tracking-wide text-[#666666]">Scoring Waterfall Breakdown</span>
        <div className="flex flex-col divide-y divide-[#e5e5e5] text-[12px]">
          {breakdown.map((line, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5">
              <span className={idx === 0 ? "text-[#666666]" : ""}>{line.label}</span>
              <span className="font-mono font-bold">{line.points > 0 ? "+" : ""}{line.points} pts</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2 font-bold">
            <span>Total Calculated Score</span>
            <span className="font-mono text-[13px]">{total} pts ({tier} Tier)</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <button type="button" onClick={() => applyPreset((presetIndex + 1) % simulatorPresets.length)} className="flex w-full items-center justify-center gap-1.5 border border-[#e5e5e5] py-2 text-[11px] font-bold uppercase tracking-wide text-[#525252] hover:border-[#0a0a0a] hover:text-[#0a0a0a]"><Repeat size={15} />Test Another Lead Record</button>
        <button type="button" onClick={() => notify(`${preset.name} saved as golden benchmark test`)} className="text-center text-[10.5px] font-bold uppercase tracking-wide text-[#525252] hover:text-[#0a0a0a] hover:underline">Save {preset.name} as Golden Benchmark</button>
      </div>
    </div>
  );
}

function QualificationSection({ leads, notify }: { leads: Lead[]; notify: (v: string) => void }) {
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
    { id: -2, text: "Penalty rule threshold reviewed by Maya", time: "42m ago" },
    { id: -3, text: "Qualification engine synced with Widget v2.1", time: "1h ago" },
  ]);
  const [auditOpen, setAuditOpen] = useState(false);
  const auditIdRef = useRef(-4);
  function logAudit(text: string) {
    setAuditLog((cur) => [{ id: auditIdRef.current--, text, time: "Just now" }, ...cur]);
  }

  const [warmStart, setWarmStart] = useState(40);
  const [hotStart, setHotStart] = useState(75);

  const leadScores = useMemo(() => leads.map((l) => l.score), [leads]);

  const tierPct = useMemo(() => {
    const total = leadScores.length || 1;
    const cold = leadScores.filter((s) => s < warmStart).length;
    const hot = leadScores.filter((s) => s >= hotStart).length;
    const warm = total - cold - hot;
    return { cold: Math.round((cold / total) * 100), warm: Math.round((warm / total) * 100), hot: Math.round((hot / total) * 100) };
  }, [leadScores, warmStart, hotStart]);

  const avgLeadScore = useMemo(() => leadScores.reduce((a, b) => a + b, 0) / (leadScores.length || 1), [leadScores]);
  const benchmark = 60;

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
    const rule = scoringRules.find((r) => r.id === id);
    setScoringRules((cur) => {
      const idx = cur.findIndex((r) => r.id === id);
      const swapIdx = idx + direction;
      if (swapIdx < 0 || swapIdx >= cur.length) return cur;
      const next = [...cur];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
    if (rule) logAudit(`Reordered "${rule.name}" priority`);
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

  const tabs: { key: typeof tab; label: string; count?: number }[] = [
    { key: "Questions", label: "Questions", count: questions.length },
    { key: "Scoring Rules", label: "Scoring Rules", count: scoringRules.length },
    { key: "Classification Thresholds", label: "Classification Thresholds" },
    { key: "Test Score Sandbox", label: "Test Score Sandbox" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-[#666666]">
              <span>AI Evaluation Engine</span>
              <span className="h-1 w-1 rounded-full bg-[#999999]" />
              <span className="border border-[#e5e5e5] px-2 py-0.5">v3.4 Production</span>
              <span className="h-1 w-1 rounded-full bg-[#999999]" />
              <span className="normal-case text-[#666666]">ailqs.com</span>
            </div>
            <h1 className="text-[20px] font-extrabold tracking-tight">Qualification &amp; Scoring</h1>
            <p className="mt-0.5 max-w-2xl text-[12px] text-[#666666]">Configure automated lead scoring models, intent weightings, temperature thresholds, and real-time sales alert triggers.</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button onClick={() => setAuditOpen(true)} className="flex items-center gap-1.5 border border-[#e5e5e5] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#525252] hover:border-[#0a0a0a] hover:text-[#0a0a0a]"><ClockCounterClockwise size={15} />Audit Log</button>
            <button onClick={() => setReorderMode((v) => !v)} aria-pressed={reorderMode} className={`flex items-center gap-1.5 border px-3 py-2 text-[11px] font-bold uppercase tracking-wide ${reorderMode ? "border-[#0a0a0a] bg-[#0a0a0a] text-white" : "border-[#e5e5e5] text-[#525252] hover:border-[#0a0a0a] hover:text-[#0a0a0a]"}`}><ArrowsDownUp size={15} />Reorder Priority</button>
            <button onClick={openCreateRule} className="flex items-center gap-1.5 bg-[#0a0a0a] px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[#262626]"><Plus size={15} />Add Scoring Rule</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
          <div className="border border-[#e5e5e5] p-4">
            <div className="text-[9px] font-bold uppercase tracking-wide text-[#666666]">Active Scoring Rules</div>
            <div className="mt-1.5 flex items-baseline gap-2"><span className="text-[26px] font-extrabold leading-none">{activeCount}</span><span className="text-[10px] font-bold text-[#666666]">{Math.round((activeCount / (scoringRules.length || 1)) * 100)}% operational</span></div>
            <div className="mt-1.5 text-[10.5px] text-[#666666]">{positiveCount} positive · {penaltyCount} penalty · {alertCount} alert trigger{alertCount === 1 ? "" : "s"}</div>
          </div>
          <div className="border border-[#e5e5e5] p-4">
            <div className="text-[9px] font-bold uppercase tracking-wide text-[#666666]">Average Lead Score</div>
            <div className="mt-1.5 flex items-baseline gap-2"><span className="text-[26px] font-extrabold leading-none">{avgLeadScore.toFixed(1)}</span><span className="text-[11px] text-[#666666]">/ 100</span></div>
            <div className="mt-1.5 flex items-center gap-1 text-[10.5px] font-bold text-[#0a0a0a]"><TrendUp size={12} />{avgLeadScore >= benchmark ? "+" : ""}{(avgLeadScore - benchmark).toFixed(1)} pts vs benchmark ({benchmark.toFixed(1)})</div>
          </div>
          <div className="border border-[#0a0a0a] bg-[#0a0a0a] p-4 text-white">
            <div className="text-[9px] font-bold uppercase tracking-wide text-white/60">High Intent (Hot) Ratio</div>
            <div className="mt-1.5 flex items-baseline gap-2"><span className="text-[26px] font-extrabold leading-none">{tierPct.hot}%</span><span className="text-[10px] font-bold text-white/60">Threshold ≥ {hotStart}</span></div>
            <div className="mt-1.5 text-[10.5px] text-white/70">Auto-routed directly to SDR calendar sync</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex border border-[#0a0a0a]">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold ${tab === t.key ? "bg-[#0a0a0a] text-white" : "text-[#525252] hover:bg-[#f5f5f5]"}`}>
                {t.label}
                {t.count !== undefined && <span className={`text-[9.5px] ${tab === t.key ? "text-white/60" : "text-[#999999]"}`}>{t.count}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === "Questions" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[14px] font-extrabold">Qualification Questions</h2>
            <button onClick={() => setQuestionDialogOpen(true)} className="flex shrink-0 items-center gap-1.5 bg-[#0a0a0a] px-3.5 py-2 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[#262626]"><Plus size={14} />Create Question</button>
          </div>
          <div className="flex items-center gap-4 border border-[#0a0a0a] p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center border border-[#0a0a0a]"><ListChecks size={20} /></span>
            <div className="flex-1"><h3 className="text-[13px] font-bold">Qualification at a glance</h3><p className="text-[11px] text-[#666666]">{questions.length} question{questions.length === 1 ? "" : "s"} configured · {questions.filter((q) => q.required).length} required</p></div>
            <div className="text-right"><span className="block text-[9px] font-bold uppercase tracking-wide text-[#666666]">Max score</span><strong className="text-[15px]">100 pts</strong></div>
          </div>
          <div className="border border-[#0a0a0a] divide-y divide-[#e5e5e5]">
            {questions.map((q, idx) => (
              <div key={q.id} className="flex items-start gap-3 px-4 py-3.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#0a0a0a] text-[10px] font-bold">{idx + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12.5px] font-bold">{q.label}</span>
                    <span className="border border-[#e5e5e5] px-1.5 py-0.5 font-mono text-[10px]">{q.crmField}</span>
                    <span className="border border-[#e5e5e5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#666666]">{q.fieldType}</span>
                    {q.required && <span className="border border-[#0a0a0a] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">Required</span>}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-[#666666]">
                    <span className="flex items-center gap-1 font-bold text-[#0a0a0a]"><Target size={12} />{q.points}</span>
                    <span className="flex items-center gap-1"><FlowArrow size={12} />{q.askCondition}</span>
                  </div>
                </div>
                <button onClick={() => notify(`${q.label} configuration opened`)} aria-label={`Edit ${q.label}`} className="shrink-0 p-1.5 text-[#666666] hover:text-[#0a0a0a]"><NotePencil size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Scoring Rules" && (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-8">
            <div className="flex flex-col items-stretch gap-2.5 border border-[#e5e5e5] p-3 md:flex-row md:items-center md:justify-between">
              <div className="relative min-w-[200px] flex-1">
                <MagnifyingGlass size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                <input name="ruleSearch" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rules by attribute, condition, or tag..." className="h-9 w-full border border-[#e5e5e5] pl-9 pr-3 text-[12px] outline-none focus:border-[#0a0a0a]" />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                <select name="ruleCategoryFilter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-9 border border-[#e5e5e5] px-3 text-[10.5px] font-bold outline-none">
                  <option value="All Categories">All Categories ({scoringRules.length})</option>
                  {categories.map((c) => <option key={c} value={c}>{c} ({scoringRules.filter((r) => r.category === c).length})</option>)}
                </select>
                <select name="ruleStatusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "paused")} className="h-9 border border-[#e5e5e5] px-3 text-[10.5px] font-bold outline-none">
                  <option value="all">All Statuses</option>
                  <option value="active">Status: Active ({activeCount})</option>
                  <option value="paused">Status: Paused ({scoringRules.length - activeCount})</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {filteredRules.length === 0 && <div className="border border-[#e5e5e5] p-8 text-center text-[12px] text-[#666666]">No scoring rules match these filters.</div>}
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

            <button onClick={openCreateRule} className="flex w-full items-center justify-center gap-2 border border-dashed border-[#999999] py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#525252] hover:border-[#0a0a0a] hover:text-[#0a0a0a]"><PlusCircle size={17} />Define another automated qualification rule</button>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-4">
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
          <button type="button" aria-label="Close audit log" onClick={() => setAuditOpen(false)} className="absolute inset-0 bg-black/40" />
          <aside className="td-pop relative flex h-full w-full max-w-sm flex-col gap-4 overflow-y-auto border-l border-[#0a0a0a] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center border border-[#0a0a0a]"><ClockCounterClockwise size={18} /></span><h2 className="text-[15px] font-extrabold">Audit Log</h2></div>
              <button type="button" onClick={() => setAuditOpen(false)} aria-label="Close"><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-2">
              {auditLog.map((entry) => (
                <div key={entry.id} className="flex flex-col gap-0.5 border border-[#e5e5e5] p-3">
                  <span className="text-[11.5px] font-semibold">{entry.text}</span>
                  <span className="text-[10px] text-[#666666]">{entry.time}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default function TheDocket() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeTab, setActiveTab] = useState<SectionKey>("dashboard");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<"All" | Classification>("All");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [followupTab, setFollowupTab] = useState<"Today" | "Upcoming" | "Overdue" | "Completed">("Today");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedTab, setExpandedTab] = useState<Record<number, "brief" | "transcript" | "scoring" | "action">>({});
  const [inboxSelectedId, setInboxSelectedId] = useState<number | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [replyMode, setReplyMode] = useState<"visitor" | "note">("visitor");
  const [commandOpen, setCommandOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [verdictFor, setVerdictFor] = useState<Lead | null>(null);
  const [agentDialogId, setAgentDialogId] = useState<number | null>(null);
  const [agentDraft, setAgentDraft] = useState<{ archetype: string; tones: string[]; length: string; prompt: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [webhookState, setWebhookState] = useState<"failed" | "retrying" | "ok">("failed");
  const commandInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
        setNotifOpen(false);
        setUserMenuOpen(false);
        setVerdictFor(null);
        setAgentDialogId(null);
        setAgentDraft(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (commandOpen) setTimeout(() => commandInputRef.current?.focus(), 20);
  }, [commandOpen]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (classFilter !== "All" && l.classification !== classFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.docket.includes(q) || l.interest.toLowerCase().includes(q);
    });
  }, [leads, classFilter, query]);

  const commandResults = useMemo(() => {
    if (!query.trim()) return leads.slice(0, 5);
    const q = query.toLowerCase();
    return leads.filter((l) => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.docket.includes(q)).slice(0, 6);
  }, [leads, query]);

  const followUps = useMemo(
    () => leads.filter((l) => l.status !== "Qualified").sort((a, b) => (a.overdue === b.overdue ? 0 : a.overdue ? -1 : 1)),
    [leads]
  );

  const followUpBuckets = useMemo(() => {
    const Today = followUps.filter((l) => l.followup.startsWith("Today"));
    const Overdue = followUps.filter((l) => l.overdue);
    const Upcoming = followUps.filter((l) => !l.overdue && !l.followup.startsWith("Today"));
    const Completed = leads.filter((l) => l.status === "Qualified");
    return { Today, Upcoming, Overdue, Completed };
  }, [followUps, leads]);

  const teamMembers = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of leads) map.set(l.owner, (map.get(l.owner) ?? 0) + 1);
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [leads]);

  const nextPriority = useMemo(
    () => leads.find((l) => l.overdue) ?? leads.find((l) => l.classification === "Hot" && l.status !== "Qualified") ?? leads[0],
    [leads]
  );

  const hotShortlist = useMemo(
    () => leads.filter((l) => l.classification === "Hot").sort((a, b) => b.score - a.score).slice(0, 5),
    [leads]
  );

  const caseOrigin = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of leads) map.set(l.site, (map.get(l.site) ?? 0) + 1);
    return Array.from(map.entries())
      .map(([site, count]) => ({ site, count, pct: Math.round((count / leads.length) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  const statusCounts = useMemo(() => {
    const n = leads.filter((l) => l.status === "New").length;
    const c = leads.filter((l) => l.status === "Contacted").length;
    const q = leads.filter((l) => l.status === "Qualified").length;
    return { n, c, q };
  }, [leads]);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const hotCount = leads.filter((l) => l.classification === "Hot").length;
  const qualifiedThisWeek = leads.filter((l) => l.status === "Qualified").length;
  const avgScore = Math.round(leads.reduce((a, l) => a + l.score, 0) / leads.length);
  const unassignedCount = leads.filter((l) => l.owner === "Unassigned").length;
  const overdueCount = leads.filter((l) => l.overdue).length;

  const classCounts = useMemo(() => {
    const counts: Record<"All" | Classification, number> = { All: leads.length, Hot: 0, Warm: 0, Cold: 0 };
    for (const l of leads) counts[l.classification]++;
    return counts;
  }, [leads]);

  function toggleExpand(id: number) {
    setExpandedId((cur) => (cur === id ? null : id));
    setExpandedTab((cur) => ({ ...cur, [id]: cur[id] ?? "brief" }));
  }

  function toggleLeadSelect(id: number) {
    setSelectedIds((cur) => {
      const next = new Set(cur);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function toggleSelectAllLeads() {
    setSelectedIds((cur) => (cur.size === filteredLeads.length && filteredLeads.length > 0 ? new Set() : new Set(filteredLeads.map((l) => l.id))));
  }
  function bulkAssignToMe() {
    const n = selectedIds.size;
    setLeads((cur) => cur.map((l) => (selectedIds.has(l.id) ? { ...l, owner: "You" } : l)));
    setToast(`${n} case${n === 1 ? "" : "s"} assigned to you`);
    setSelectedIds(new Set());
  }
  function bulkAdvanceStage() {
    const n = selectedIds.size;
    setLeads((cur) => cur.map((l) => (selectedIds.has(l.id) ? { ...l, status: l.status === "New" ? "Contacted" : "Qualified" } : l)));
    setToast(`${n} case${n === 1 ? "" : "s"} advanced a stage`);
    setSelectedIds(new Set());
  }

  function openAgentDialog(agent: (typeof agents)[number]) {
    setAgentDialogId(agent.id);
    setAgentDraft({ archetype: agent.archetype, tones: [...agent.tones], length: agent.length, prompt: agent.prompt });
  }
  function closeAgentDialog() {
    setAgentDialogId(null);
    setAgentDraft(null);
  }
  function toggleAgentTone(tone: string) {
    setAgentDraft((cur) => {
      if (!cur) return cur;
      if (cur.tones.includes(tone)) return { ...cur, tones: cur.tones.filter((t) => t !== tone) };
      if (cur.tones.length >= 3) return cur;
      return { ...cur, tones: [...cur.tones, tone] };
    });
  }

  function completeFollowUp(lead: Lead) {
    setLeads((cur) => cur.map((l) => (l.id === lead.id ? { ...l, status: "Qualified", overdue: false, followup: "Completed" } : l)));
    setToast(`No. ${lead.docket} marked complete`);
  }

  function recordVerdict(lead: Lead) {
    setLeads((cur) => cur.map((l) => (l.id === lead.id ? { ...l, status: l.status === "New" ? "Contacted" : "Qualified" } : l)));
    setVerdictFor(null);
    setToast(`Verdict recorded for No. ${lead.docket} — ${lead.name}`);
  }

  function retryWebhook() {
    setWebhookState("retrying");
    setTimeout(() => {
      setWebhookState("ok");
      setToast("Webhook redelivered successfully");
    }, 1000);
  }

  function openFromCommand(lead: Lead) {
    setCommandOpen(false);
    setActiveTab("leads");
    setClassFilter("All");
    setQuery("");
    setExpandedId(lead.id);
    setExpandedTab((cur) => ({ ...cur, [lead.id]: "brief" }));
    setTimeout(() => document.getElementById(`docket-row-${lead.id}`)?.scrollIntoView({ block: "center", behavior: "smooth" }), 60);
  }

  function renderExhibit(lead: Lead) {
    const tab = expandedTab[lead.id] ?? "brief";
    return (
      <div className="border-t border-[#e5e5e5] bg-[#fafafa] px-4 py-5 md:px-6">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-[#e5e5e5] pb-3">
          <div className="text-[11px] text-[#666666]">
            <b className="text-[#0a0a0a]">{lead.role}</b> at {lead.company} <span className="text-[#c9c9c9]">·</span> {lead.location}
          </div>
          <a href={`https://${lead.linkedin}`} onClick={(e) => e.preventDefault()} className="text-[10.5px] text-[#666666] hover:text-[#0a0a0a] hover:underline">{lead.linkedin}</a>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-1">
          {([
            ["brief", "Overview", Sparkle],
            ["transcript", "Transcript", BookOpenText],
            ["scoring", "Scoring", Target],
            ["action", "Next action", ArrowRight],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setExpandedTab((cur) => ({ ...cur, [lead.id]: key }))}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors ${
                tab === key ? "bg-[#0a0a0a] text-white" : "text-[#525252] hover:bg-[#eee]"
              }`}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        {tab === "brief" && (
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="min-w-0 space-y-4">
              <div className="border border-[#0a0a0a] bg-white p-4">
                <div className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-[#666666]"><Sparkle size={12} /> Executive summary</div>
                <p className="max-w-[64ch] text-[13px] leading-relaxed text-[#2b2b2b]">{lead.brief}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {lead.scoring.map((s) => (
                    <span key={s.label} className="rounded-full border border-[#e5e5e5] px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wide text-[#525252]">{s.label} · {s.points}/{s.max}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-[#666666]">Qualification framework</span>
                  <span className="text-[9px] font-bold uppercase tracking-wide text-[#666666]">{lead.scoring.filter((s) => s.points / s.max >= 0.7).length} of {lead.scoring.length} verified</span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {lead.scoring.map((s) => (
                    <div key={s.label} className="border border-[#e5e5e5] bg-white p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wide text-[#666666]">{s.label}</span>
                        {s.points / s.max >= 0.7 ? <CheckCircle size={13} weight="fill" /> : <Circle size={13} className="text-[#c9c9c9]" />}
                      </div>
                      <p className="text-[11px] leading-snug text-[#2b2b2b]">{s.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="min-w-0 space-y-3">
              <div className="border border-[#e5e5e5] bg-white p-4">
                <div className="mb-2 text-[9px] font-bold uppercase tracking-wide text-[#666666]">Contact</div>
                <div className="space-y-1.5 text-[12px] text-[#2b2b2b]">
                  <div className="flex items-center gap-2 truncate"><EnvelopeSimple size={13} className="flex-none" /> <span className="truncate">{lead.email}</span></div>
                  <div className="flex items-center gap-2"><PaperPlaneTilt size={13} className="flex-none" /> {lead.phone}</div>
                </div>
                <button
                  onClick={() => setVerdictFor(lead)}
                  className="mt-4 flex w-full items-center justify-center gap-2 bg-[#0a0a0a] px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[#262626]"
                >
                  Record verdict <ArrowRight size={13} />
                </button>
              </div>
              <div className="border border-[#e5e5e5] bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wide text-[#666666]"><Buildings size={13} /> Company profile</div>
                <b className="text-[12.5px]">{lead.company}</b>
                <p className="mt-0.5 text-[10.5px] text-[#666666]">{lead.companyMeta}</p>
                <div className="mt-2.5 flex items-center justify-between border-t border-[#f0f0f0] pt-2.5 text-[10.5px]">
                  <span className="text-[#666666]">Company size</span>
                  <span className="font-bold">{lead.companySize}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {lead.techStack.map((t) => (
                    <span key={t} className="border border-[#e5e5e5] px-2 py-0.5 text-[9.5px] font-bold text-[#525252]">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "transcript" && (
          <div className="max-w-[70ch] space-y-3">
            {lead.transcript.map((m, i) => (
              <div key={i} className="flex gap-3 text-[12px]">
                <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center border border-[#0a0a0a] text-[10px] font-bold">
                  {m.from === "ai" ? <Robot size={13} /> : m.from === "agent" ? <UserCircle size={13} /> : m.author.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <b className="text-[#0a0a0a]">{m.author}</b>
                    <span className="text-[10px] text-[#737373]">{m.time}</span>
                  </div>
                  <p className="mt-0.5 leading-relaxed text-[#2b2b2b]">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "scoring" && (
          <div className="max-w-[54ch]">
            <div className="mb-4 flex items-end justify-between border-b border-[#e5e5e5] pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#666666]">Composite score</span>
              <span className="text-[32px] font-extrabold leading-none tracking-tight">[ {lead.score} ]</span>
            </div>
            <div className="space-y-3">
              {lead.scoring.map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="text-[#2b2b2b]">{s.label}</span>
                    <span className="font-bold text-[#0a0a0a]">{s.points}/{s.max}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#e5e5e5]">
                    <div className="h-full bg-[#0a0a0a]" style={{ width: `${(s.points / s.max) * 100}%` }} />
                  </div>
                  <p className="mt-1 text-[10.5px] text-[#666666]">{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "action" && (
          <div className="flex max-w-[54ch] items-start gap-3 border border-[#0a0a0a] bg-white p-4">
            <Target size={18} className="mt-0.5 flex-none" />
            <div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#666666]">Recommended next action</div>
              <p className="text-[13px] leading-relaxed text-[#0a0a0a]">{lead.nextAction}</p>
              <button
                onClick={() => setVerdictFor(lead)}
                className="mt-3 flex items-center gap-2 bg-[#0a0a0a] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[#262626]"
              >
                Record verdict <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="td-shell flex min-h-dvh bg-white text-[#0a0a0a]">
      {/* Sidebar — section register */}
      <aside
        inert={!isDesktop && !sidebarOpen}
        className={`fixed inset-y-0 left-0 z-30 w-[196px] flex-none bg-[#0a0a0a] text-white transition-transform md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/15 px-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center border border-white/30 text-[13px]"><Command size={14} weight="bold" /></span>
            <div className="leading-tight">
              <div className="text-[13px] font-extrabold tracking-tight">AILQS</div>
              <div className="-mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">The Docket</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="flex h-6 w-6 items-center justify-center text-white/60 hover:text-white md:hidden"><X size={14} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white/40">Workspace</div>
          <nav className="flex flex-col gap-0.5">
            {workspaceNav.map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
                className={`flex items-center gap-2.5 px-2.5 py-2 text-left text-[12px] font-bold ${activeTab === key ? "bg-white text-[#0a0a0a]" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon size={14} weight={activeTab === key ? "fill" : "regular"} /> {label}
              </button>
            ))}
          </nav>

          <div className="mb-2 mt-5 px-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white/40">Administration</div>
          <nav className="flex flex-col gap-0.5">
            {adminNav.map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
                className={`flex items-center gap-2.5 px-2.5 py-2 text-left text-[12px] font-bold ${activeTab === key ? "bg-white text-[#0a0a0a]" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon size={14} weight={activeTab === key ? "fill" : "regular"} />
                <span className="flex-1">{label}</span>
                {key === "notifications" && unreadCount > 0 && (
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${activeTab === key ? "bg-[#0a0a0a] text-white" : "bg-white text-[#0a0a0a]"}`}>{unreadCount}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="border-t border-white/15 px-3 py-3">
          <button
            onClick={() => { setActiveTab("help"); setSidebarOpen(false); }}
            className={`flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-[12px] font-bold ${activeTab === "help" ? "bg-white text-[#0a0a0a]" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
          >
            <Lifebuoy size={14} weight={activeTab === "help" ? "fill" : "regular"} /> Help &amp; Support
          </button>
        </div>
      </aside>
      {sidebarOpen && <button aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-20 bg-black/30 md:hidden" />}

      <div className="min-w-0 flex-1">
        {/* Masthead */}
        <header className="sticky top-0 z-10 border-b border-[#0a0a0a] bg-white">
          <div className="flex h-14 items-center gap-4 px-4 md:px-8">
            <button onClick={() => setSidebarOpen(true)} className="flex h-8 w-8 items-center justify-center border border-[#e5e5e5] md:hidden">
              <DotsThree size={16} weight="bold" />
            </button>
            <Link href="/" className="hidden items-center gap-1 text-[11px] font-semibold text-[#525252] hover:text-[#0a0a0a] md:flex">
              <ArrowLeft size={13} /> Gallery
            </Link>
            <div className="hidden h-5 w-px bg-[#e5e5e5] md:block" />
            <span className="text-[12.5px] font-bold">{sectionLabel[activeTab]}</span>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setCommandOpen(true)}
                className="hidden h-8 items-center gap-2 border border-[#e5e5e5] px-3 text-[11px] text-[#666666] hover:border-[#0a0a0a] hover:text-[#0a0a0a] md:flex"
              >
                <MagnifyingGlass size={13} /> Search cases
                <kbd className="ml-3 rounded border border-[#e5e5e5] px-1.5 py-0.5 text-[9px] text-[#666666]">⌘K</kbd>
              </button>
              <button onClick={() => setCommandOpen(true)} className="flex h-8 w-8 items-center justify-center border border-[#e5e5e5] hover:border-[#0a0a0a] md:hidden">
                <MagnifyingGlass size={15} />
              </button>
              <div className="relative">
                <button onClick={() => { setNotifOpen((v) => !v); setUserMenuOpen(false); }} className="relative flex h-8 w-8 items-center justify-center border border-[#e5e5e5] hover:border-[#0a0a0a]">
                  <Bell size={15} />
                  {unreadCount > 0 && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#0a0a0a]" />}
                </button>
                {notifOpen && (
                  <div className="td-pop-fast absolute right-0 top-10 w-80 border border-[#0a0a0a] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                    <div className="flex items-center justify-between border-b border-[#e5e5e5] px-3 py-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wide">Notifications</span>
                      <button onClick={() => setNotifOpen(false)}><X size={14} /></button>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className={`border-b border-[#f0f0f0] px-3 py-2.5 last:border-0 ${n.unread ? "bg-[#fafafa]" : ""}`}>
                          <div className="flex items-baseline justify-between gap-2">
                            <b className="text-[11px]">{n.title}</b>
                            <span className="flex-none text-[9px] text-[#737373]">{n.time}</span>
                          </div>
                          <p className="mt-1 text-[11px] leading-snug text-[#666]">{n.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button onClick={() => { setUserMenuOpen((v) => !v); setNotifOpen(false); }} className="flex h-8 w-8 items-center justify-center border border-[#e5e5e5] hover:border-[#0a0a0a]">
                  <UserCircle size={16} />
                </button>
                {userMenuOpen && (
                  <div className="td-pop-fast absolute right-0 top-10 w-44 border border-[#0a0a0a] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                    <button className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[12px] hover:bg-[#f5f5f5]"><UserCircle size={14} /> Account</button>
                    <button className="flex w-full items-center gap-2 border-t border-[#f0f0f0] px-3 py-2.5 text-left text-[12px] hover:bg-[#f5f5f5]"><SignOut size={14} /> Sign out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Signal ticker */}
        <div className="td-marquee-wrap border-b border-[#e5e5e5] bg-[#0a0a0a] py-2">
          <div className="td-marquee-track">
            {[...tickerItems, ...tickerItems].map((t, i) => {
              const Icon = t.icon;
              return (
                <span key={i} className="flex flex-none items-center gap-2 px-6 text-[11px] font-medium text-white/85">
                  <Icon size={13} /> {t.text}
                </span>
              );
            })}
          </div>
        </div>

        <main className="mx-auto max-w-[1300px] px-4 pb-24 pt-6 md:px-8">
        {activeTab === "dashboard" && (
          <>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-[20px] font-extrabold tracking-tight">Dashboard</h1>
                <p className="mt-1 text-[12px] text-[#666666]">Understand and convert your website visitors with AI.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab("leads")} className="flex items-center gap-1.5 bg-[#0a0a0a] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[#262626]">
                  <Fire size={13} weight="fill" /> View Hot Cases
                </button>
                <button onClick={() => setToast("Report exported")} className="flex items-center gap-1.5 border border-[#e5e5e5] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#525252] hover:border-[#0a0a0a] hover:text-[#0a0a0a]">
                  <DownloadSimple size={13} /> Export Report
                </button>
              </div>
            </div>
            {/* Bento verdict board */}
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
              <div className="col-span-2 row-span-2 flex flex-col justify-between border border-[#0a0a0a] bg-[#0a0a0a] p-5 text-white md:p-6">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-white/60">
                  <span>This week's docket</span>
                  <ChartLineUp size={16} />
                </div>
                <div>
                  <div className="text-[52px] font-extrabold leading-none tracking-tight md:text-[64px]">{leads.length}</div>
                  <p className="mt-2 max-w-[32ch] text-[12px] leading-snug text-white/70">cases opened, {qualifiedThisWeek} already carried to Qualified, avg. composite score {avgScore}.</p>
                </div>
              </div>
              <div className="flex flex-col justify-between border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-[#666666]"><span>Hot cases</span><Fire size={14} weight="fill" /></div>
                <div className="text-[30px] font-extrabold leading-none tracking-tight">{hotCount}</div>
              </div>
              <div className="flex flex-col justify-between border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-[#666666]"><span>Avg. response</span><Clock size={14} /></div>
                <div className="text-[30px] font-extrabold leading-none tracking-tight">11<span className="text-[15px]">m</span></div>
              </div>
              <div className="flex flex-col justify-between border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-[#666666]"><span>Qualification</span><Target size={14} /></div>
                <div className="text-[30px] font-extrabold leading-none tracking-tight">{Math.round((statusCounts.q / leads.length) * 100)}<span className="text-[15px]">%</span></div>
              </div>
              <div className="flex flex-col justify-between border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-[#666666]"><span>Open cases</span><BookOpenText size={14} /></div>
                <div className="text-[30px] font-extrabold leading-none tracking-tight">{leads.filter((l) => l.status !== "Qualified").length}</div>
              </div>
              <div className="col-span-2 flex items-center justify-between gap-4 border border-[#e5e5e5] p-4 md:col-span-4">
                <div>
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#666666]">Delivery health</div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11px]">
                    <span className="flex items-center gap-1.5"><EnvelopeSimple size={13} /> Email <CheckCircle size={12} weight="fill" /></span>
                    <span className="flex items-center gap-1.5"><Buildings size={13} /> CRM <CheckCircle size={12} weight="fill" /></span>
                    <span className={`flex items-center gap-1.5 ${webhookState === "failed" ? "font-bold" : ""}`}>
                      <WebhooksLogo size={13} /> Webhook{" "}
                      {webhookState === "ok" && <CheckCircle size={12} weight="fill" />}
                      {webhookState === "retrying" && <SpinnerGap size={12} className="td-spin" />}
                      {webhookState === "failed" && <Warning size={12} weight="fill" />}
                    </span>
                  </div>
                </div>
                {webhookState !== "ok" && (
                  <button
                    onClick={retryWebhook}
                    disabled={webhookState === "retrying"}
                    className="flex flex-none items-center gap-1.5 border border-[#0a0a0a] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide hover:bg-[#0a0a0a] hover:text-white disabled:opacity-50"
                  >
                    <ArrowClockwise size={12} className={webhookState === "retrying" ? "td-spin" : ""} /> Retry
                  </button>
                )}
              </div>
            </div>

            {/* Analytics row */}
            <div className="mt-2.5 grid gap-2.5 lg:grid-cols-[1.1fr_.8fr_1fr]">
              <div className="border border-[#e5e5e5] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[12px] font-bold">Score Distribution</span>
                  <span className="text-[10px] text-[#666666]">across the docket</span>
                </div>
                <div className="flex h-[140px] items-end gap-2.5">
                  {leads.map((l) => (
                    <div key={l.id} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="flex w-full items-end justify-center" style={{ height: 100 }}>
                        <div className={`w-full ${l.classification === "Hot" ? "bg-[#0a0a0a]" : "bg-[#d9d9d9]"}`} style={{ height: `${l.score}%` }} title={`No. ${l.docket} — ${l.score}`} />
                      </div>
                      <span className="font-mono text-[9px] text-[#666666]">{l.docket}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between border border-[#0a0a0a] p-4">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wide text-[#666666]">Next Priority</div>
                  <div className="mt-1.5 text-[15px] font-extrabold leading-snug">{nextPriority.name}</div>
                  <div className="text-[11px] text-[#666666]">{nextPriority.company}</div>
                  <p className="mt-2 text-[11px] leading-relaxed text-[#2b2b2b]">{nextPriority.nextAction}</p>
                </div>
                <button onClick={() => openFromCommand(nextPriority)} className="mt-4 flex items-center justify-center gap-2 bg-[#0a0a0a] px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[#262626]">
                  Open Case <ArrowRight size={13} />
                </button>
              </div>

              <div className="border border-[#e5e5e5] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12px] font-bold">Hot Cases</span>
                  <button onClick={() => setActiveTab("leads")} className="text-[10px] font-bold text-[#666666] hover:text-[#0a0a0a]">View all</button>
                </div>
                <div className="space-y-3">
                  {hotShortlist.map((l) => (
                    <button key={l.id} onClick={() => openFromCommand(l)} className="flex w-full items-center gap-2.5 text-left hover:opacity-70">
                      <Fire size={14} weight="fill" className="flex-none" />
                      <span className="min-w-0 flex-1">
                        <b className="block truncate text-[11.5px]">{l.name}</b>
                        <span className="block truncate text-[10px] text-[#666666]">{l.company}</span>
                      </span>
                      <span className="font-mono text-[11px] font-bold">{l.score}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Team / Qualification / Origin row */}
            <div className="mt-2.5 grid gap-2.5 lg:grid-cols-[1fr_.8fr_1fr]">
              <div className="border border-[#e5e5e5] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12px] font-bold">Team</span>
                  <Users size={14} className="text-[#666666]" />
                </div>
                <div className="space-y-2.5">
                  {teamMembers.map((m) => (
                    <div key={m.name}>
                      <div className="mb-1 flex items-center justify-between text-[11px]">
                        <span className="font-semibold">{m.name}</span>
                        <span className="text-[#666666]">{m.count} case{m.count === 1 ? "" : "s"}</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#f0f0f0]"><div className="h-full bg-[#0a0a0a]" style={{ width: `${(m.count / leads.length) * 100}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center border border-[#e5e5e5] p-4">
                <div className="mb-2 flex w-full items-center justify-between">
                  <span className="text-[12px] font-bold">Qualification Rate</span>
                  <span className="text-[9px] font-bold uppercase tracking-wide text-[#666666]">Live</span>
                </div>
                <div
                  className="relative mt-2 flex h-[120px] w-[120px] items-center justify-center rounded-full"
                  style={{ background: `conic-gradient(#0a0a0a 0 ${(statusCounts.q / leads.length) * 360}deg, #8a8a8a ${(statusCounts.q / leads.length) * 360}deg ${((statusCounts.q + statusCounts.c) / leads.length) * 360}deg, #e5e5e5 ${((statusCounts.q + statusCounts.c) / leads.length) * 360}deg 360deg)` }}
                >
                  <div className="flex h-[86px] w-[86px] flex-col items-center justify-center rounded-full bg-white text-center">
                    <span className="text-[22px] font-extrabold leading-none">{Math.round((statusCounts.q / leads.length) * 100)}%</span>
                    <span className="text-[8px] font-bold uppercase tracking-wide text-[#666666]">Qualified</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[9px] text-[#666666]">
                  <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-[#0a0a0a]" /> Qualified</span>
                  <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-[#8a8a8a]" /> Contacted</span>
                  <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-[#e5e5e5]" /> New</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="border border-[#e5e5e5] p-4">
                  <div className="mb-3 text-[12px] font-bold">Case Origin</div>
                  <div className="space-y-2.5">
                    {caseOrigin.map((o) => (
                      <div key={o.site}>
                        <div className="mb-1 flex items-center justify-between text-[10.5px]"><span className="truncate text-[#2b2b2b]">{o.site}</span><span className="font-bold">{o.pct}%</span></div>
                        <div className="h-1.5 w-full bg-[#f0f0f0]"><div className="h-full bg-[#0a0a0a]" style={{ width: `${o.pct}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-between border border-[#0a0a0a] bg-[#0a0a0a] p-4 text-white">
                  <div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-white/60"><Sparkle size={12} /> AI Agent Dispatch</div>
                    <p className="mt-2 text-[11.5px] leading-relaxed text-white/85">{hotCount} hot case{hotCount === 1 ? "" : "s"} scored above 80. Trigger an automated follow-up sequence?</p>
                  </div>
                  <button onClick={() => setToast("Follow-up sequence automated")} className="mt-3 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#0a0a0a] hover:bg-white/90">
                    Automate Follow-up
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "leads" && (
          <>
            <div className="mb-5 flex items-center gap-2.5">
              <h1 className="text-[20px] font-extrabold tracking-tight">Leads</h1>
              <span className="border border-[#0a0a0a] px-1.5 py-0.5 text-[10px] font-bold">{leads.length} total</span>
            </div>
            <p className="-mt-4 mb-5 text-[12px] text-[#666666]">Every case in the docket, filterable and exportable.</p>

            {/* Ledger summary */}
            <div className="mb-3 grid grid-cols-2 gap-2.5 md:grid-cols-4">
              <div className="border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-[#666666]"><span>New cases</span><Sparkle size={13} /></div>
                <div className="mt-1.5 text-[26px] font-extrabold leading-none tracking-tight">{statusCounts.n}</div>
              </div>
              <div className="border border-[#0a0a0a] p-4">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-[#666666]"><span>Hot cases</span><Fire size={13} weight="fill" /></div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-[26px] font-extrabold leading-none tracking-tight">{hotCount}</span>
                  {hotCount > 0 && <span className="bg-[#0a0a0a] px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-white">Action now</span>}
                </div>
              </div>
              <div className="border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-[#666666]"><span>Unassigned</span><UserCircle size={13} /></div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-[26px] font-extrabold leading-none tracking-tight">{unassignedCount}</span>
                  {unassignedCount > 0 && <span className="text-[9px] font-bold text-[#666666]">needs routing</span>}
                </div>
              </div>
              <div className="border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-[#666666]"><span>Follow-up due</span><Clock size={13} /></div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-[26px] font-extrabold leading-none tracking-tight">{overdueCount}</span>
                  {overdueCount > 0 && <span className="bg-[#0a0a0a] px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-white">Overdue</span>}
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <div className="flex border border-[#e5e5e5]">
                {(["All", "Hot", "Warm", "Cold"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setClassFilter(f)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold ${classFilter === f ? "bg-[#0a0a0a] text-white" : "text-[#525252] hover:bg-[#f5f5f5]"}`}
                  >
                    {f}
                    <span className={`text-[9.5px] ${classFilter === f ? "text-white/60" : "text-[#999999]"}`}>{classCounts[f]}</span>
                  </button>
                ))}
              </div>
              <div className="flex h-8 flex-1 min-w-[160px] items-center gap-2 border border-[#e5e5e5] px-2.5 md:max-w-[280px]">
                <Funnel size={13} className="text-[#666666]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by name, company, docket no."
                  className="w-full bg-transparent text-[11px] outline-none placeholder:text-[#737373]"
                />
              </div>
              <button className="ml-auto flex h-8 items-center gap-1.5 border border-[#e5e5e5] px-3 text-[11px] font-bold text-[#525252] hover:border-[#0a0a0a] hover:text-[#0a0a0a]">
                <DownloadSimple size={13} /> Export
              </button>
            </div>

            {/* Docket ledger */}
            <div className="border border-[#0a0a0a]">
              <div className="hidden grid-cols-[22px_60px_1.3fr_.7fr_55px_.75fr_75px_75px_18px] items-center gap-3 border-b border-[#0a0a0a] bg-[#0a0a0a] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-white md:grid">
                <button onClick={toggleSelectAllLeads} className="flex items-center justify-center" aria-label="Select all">
                  {selectedIds.size > 0 && selectedIds.size === filteredLeads.length ? <CheckSquare size={13} weight="fill" /> : <Square size={13} className="text-white/50" />}
                </button>
                <span>No.</span><span>Case</span><span>Class</span><span>Score</span><span>Status</span><span>Owner</span><span>Received</span><span />
              </div>

              {loading ? (
                <div className="divide-y divide-[#f0f0f0]">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-4">
                      <div className="td-skel h-4 w-10" />
                      <div className="td-skel h-4 flex-1" />
                      <div className="td-skel h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center">
                  <FileText size={30} className="text-[#c9c9c9]" />
                  <p className="text-[13px] font-bold">No cases match this filter</p>
                  <p className="max-w-[36ch] text-[11px] text-[#666666]">Try clearing the search or selecting a different classification.</p>
                  <button onClick={() => { setQuery(""); setClassFilter("All"); }} className="mt-2 border border-[#0a0a0a] px-3 py-1.5 text-[11px] font-bold hover:bg-[#0a0a0a] hover:text-white">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#e5e5e5]">
                  {filteredLeads.map((lead) => {
                    const open = expandedId === lead.id;
                    return (
                      <div key={lead.id} id={`docket-row-${lead.id}`}>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleExpand(lead.id)}
                          onKeyDown={(e) => { if (e.key === "Enter") toggleExpand(lead.id); }}
                          className="grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3.5 text-left hover:bg-[#fafafa] md:grid-cols-[22px_60px_1.3fr_.7fr_55px_.75fr_75px_75px_18px]"
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleLeadSelect(lead.id); }}
                            className="hidden items-center justify-center md:flex"
                            aria-label={`Select ${lead.name}`}
                          >
                            {selectedIds.has(lead.id) ? <CheckSquare size={14} weight="fill" /> : <Square size={14} className="text-[#c9c9c9]" />}
                          </button>
                          <span className="hidden font-mono text-[11px] text-[#666666] md:block">{lead.docket}</span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-[#737373] md:hidden">{lead.docket}</span>
                              <b className="truncate text-[12.5px]">{lead.name}</b>
                            </span>
                            <span className="mt-0.5 block truncate text-[11px] text-[#666666]">{lead.company} · {lead.interest}</span>
                          </span>
                          <span className="hidden md:block"><ClassBadge c={lead.classification} /></span>
                          <span className="hidden font-mono text-[13px] font-bold md:block">[{lead.score}]</span>
                          <span className="hidden md:block"><StatusTag status={lead.status} overdue={lead.overdue} /></span>
                          <span className="hidden truncate text-[11px] text-[#666666] md:block">{lead.owner}</span>
                          <span className="hidden text-[11px] text-[#666666] md:block">{timeAgoRank(lead.received)}</span>
                          <CaretRight size={14} className={`justify-self-end text-[#666666] transition-transform ${open ? "rotate-90" : ""}`} />
                        </div>
                        <div className="px-4 pb-2 md:hidden">
                          <div className="flex items-center gap-2">
                            <ClassBadge c={lead.classification} />
                            <StatusTag status={lead.status} overdue={lead.overdue} />
                            <span className="ml-auto font-mono text-[13px] font-bold">[{lead.score}]</span>
                          </div>
                        </div>
                        <div className={`td-exhibit ${open ? "td-open" : ""}`}>
                          <div inert={!open}>{renderExhibit(lead)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "inbox" && (() => {
          const selected = leads.find((l) => l.id === inboxSelectedId) ?? leads[0];
          return (
            <div>
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <h1 className="text-[20px] font-extrabold tracking-tight">Inbox</h1>
                  <p className="mt-1 text-[12px] text-[#666666]">Every live conversation, AI-handled or handed off, in one workspace.</p>
                </div>
                <span className="hidden items-center gap-1.5 border border-[#0a0a0a] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide md:flex"><i className="h-1.5 w-1.5 rounded-full bg-[#0a0a0a]" /> Live stream</span>
              </div>

              <div className="grid gap-3 lg:grid-cols-[260px_1fr_290px]">
                {/* Left: qualification + conversation list */}
                <div className="min-w-0 space-y-3 lg:order-1">
                  <div className="border border-[#0a0a0a] p-4 text-center">
                    <div className="text-[9px] font-bold uppercase tracking-wide text-[#666666]">Lead Qualification</div>
                    <div
                      className="relative mx-auto mt-3 flex h-[96px] w-[96px] items-center justify-center rounded-full"
                      style={{ background: `conic-gradient(#0a0a0a 0 ${(selected.score / 100) * 360}deg, #e5e5e5 ${(selected.score / 100) * 360}deg 360deg)` }}
                    >
                      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white">
                        <span className="text-[22px] font-extrabold leading-none">{selected.score}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-[9px] font-bold uppercase tracking-wide">{selected.classification} intent</div>
                    <p className="mt-2 text-[10.5px] leading-relaxed text-[#666666]">{selected.brief}</p>
                  </div>
                  <div className="max-h-[520px] divide-y divide-[#e5e5e5] overflow-y-auto border border-[#0a0a0a]">
                    {leads.map((lead) => {
                      const last = lead.transcript[lead.transcript.length - 1];
                      const tag = inboxTag(lead);
                      const active = selected.id === lead.id;
                      return (
                        <button key={lead.id} onClick={() => setInboxSelectedId(lead.id)} className={`block w-full min-w-0 px-3 py-3 text-left ${active ? "bg-[#0a0a0a] text-white" : "hover:bg-[#fafafa]"}`}>
                          <div className="flex min-w-0 items-center justify-between gap-2">
                            <b className="min-w-0 flex-1 truncate text-[11.5px]">{lead.name}</b>
                            <span className={`flex-none text-[9px] ${active ? "text-white/60" : "text-[#666666]"}`}>{lead.received}</span>
                          </div>
                          <div className={`mt-0.5 flex min-w-0 items-center justify-between gap-2 text-[10px] ${active ? "text-white/70" : "text-[#666666]"}`}>
                            <span className="min-w-0 flex-1 truncate">{lead.company}</span>
                            <span className="flex-none font-mono font-bold">{lead.score}</span>
                          </div>
                          {last && <p className={`mt-1 truncate text-[10.5px] ${active ? "text-white/80" : "text-[#525252]"}`}>{last.text}</p>}
                          <span className={`mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide ${active ? "text-white" : "text-[#666666]"}`}>
                            <tag.icon size={10} weight={tag.label === "Handoff needed" ? "fill" : "regular"} /> {tag.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Middle: chat */}
                <div className="flex min-w-0 flex-col border border-[#0a0a0a] lg:order-2">
                  <div className="border-b border-[#e5e5e5] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 flex-none items-center justify-center border border-[#0a0a0a] text-[12px] font-bold">{selected.initials}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <b className="text-[14px]">{selected.name}</b>
                            <ClassBadge c={selected.classification} />
                          </div>
                          <div className="text-[11px] text-[#666666]">{selected.company} · Owner {selected.owner}</div>
                        </div>
                      </div>
                      <button onClick={() => setToast(`Conversation with ${selected.name} resolved`)} className="flex flex-none items-center gap-1.5 border border-[#0a0a0a] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide hover:bg-[#0a0a0a] hover:text-white">
                        <CheckCircle size={12} /> Resolve
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-[#f0f0f0] pt-3 text-[10.5px] text-[#666666]">
                      <span><b className="text-[#0a0a0a]">Source —</b> {selected.site}</span>
                      <span><b className="text-[#0a0a0a]">Interest —</b> {selected.interest}</span>
                      <span><b className="text-[#0a0a0a]">No. —</b> {selected.docket}</span>
                    </div>
                  </div>
                  <div className="max-h-[420px] flex-1 space-y-3 overflow-y-auto p-4">
                    {selected.transcript.map((m, i) => (
                      <div key={i} className="flex gap-3 text-[12px]">
                        <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center border border-[#0a0a0a] text-[10px] font-bold">
                          {m.from === "ai" ? <Robot size={13} /> : m.from === "agent" ? <UserCircle size={13} /> : m.author.slice(0, 1)}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2"><b>{m.author}</b><span className="text-[10px] text-[#737373]">{m.time}</span></div>
                          <p className="mt-0.5 leading-relaxed text-[#2b2b2b]">{m.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#0a0a0a] p-3">
                    <div className="mb-2 flex gap-1">
                      <button onClick={() => setReplyMode("visitor")} className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${replyMode === "visitor" ? "bg-[#0a0a0a] text-white" : "text-[#666666] hover:bg-[#f5f5f5]"}`}>Reply to visitor</button>
                      <button onClick={() => setReplyMode("note")} className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${replyMode === "note" ? "bg-[#0a0a0a] text-white" : "text-[#666666] hover:bg-[#f5f5f5]"}`}>Private note</button>
                    </div>
                    <textarea
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      rows={2}
                      placeholder={replyMode === "visitor" ? `Reply to ${selected.name}…` : "Add a note only the team can see…"}
                      className="w-full resize-none border border-[#e5e5e5] p-2.5 text-[12px] outline-none focus:border-[#0a0a0a]"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => { setToast(replyMode === "visitor" ? `Reply sent to ${selected.name}` : "Note saved"); setReplyDraft(""); }}
                        className="flex items-center gap-1.5 bg-[#0a0a0a] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[#262626]"
                      >
                        <PaperPlaneTilt size={13} /> Send
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: AI brief / scoring / next action / details */}
                <div className="min-w-0 space-y-3 lg:order-3">
                  <div className="border border-[#0a0a0a] p-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-[#666666]"><Sparkle size={12} /> AI Brief</div>
                    <p className="mt-2 text-[11.5px] leading-relaxed">{selected.brief}</p>
                  </div>
                  <div className="border border-[#e5e5e5] p-4">
                    <div className="mb-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-[#666666]">
                      <span>Scoring</span><span>{selected.score}/100</span>
                    </div>
                    <div className="space-y-2">
                      {selected.scoring.map((s) => (
                        <div key={s.label} className="flex items-center gap-2 text-[11px]">
                          <CheckCircle size={13} weight={s.points / s.max >= 0.7 ? "fill" : "regular"} className="flex-none" />
                          <span className="flex-1 truncate">{s.label}</span>
                          <span className="flex-none font-bold">{s.points}/{s.max}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border border-[#0a0a0a] bg-[#0a0a0a] p-4 text-white">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-white/60"><Target size={12} /> Next Action</div>
                    <p className="mt-2 text-[11.5px] leading-relaxed text-white/85">{selected.nextAction}</p>
                    <button onClick={() => setVerdictFor(selected)} className="mt-3 w-full bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#0a0a0a] hover:bg-white/90">Record Verdict</button>
                  </div>
                  <div className="border border-[#e5e5e5] p-4">
                    <div className="mb-2 text-[9px] font-bold uppercase tracking-wide text-[#666666]">Contact &amp; Docket</div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center gap-2"><EnvelopeSimple size={12} /> {selected.email}</div>
                      <div className="flex items-center gap-2"><PaperPlaneTilt size={12} /> {selected.phone}</div>
                      <div className="flex items-center justify-between"><span className="text-[#666666]">Docket no.</span><span className="font-mono font-bold">{selected.docket}</span></div>
                      <div className="flex items-center justify-between"><span className="text-[#666666]">Status</span><StatusTag status={selected.status} overdue={selected.overdue} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {activeTab === "agent" && (
          <div>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h1 className="text-[20px] font-extrabold tracking-tight">AI Agents</h1>
                <p className="mt-1 text-[12px] text-[#666666]">Configured qualification assistants and their coverage.</p>
              </div>
              <button className="flex items-center gap-1.5 border border-[#0a0a0a] px-3 py-2 text-[11px] font-bold uppercase tracking-wide hover:bg-[#0a0a0a] hover:text-white">
                <Sparkle size={13} /> New agent
              </button>
            </div>

            {/* Fleet summary */}
            <div className="mb-4 grid grid-cols-2 gap-2.5 md:grid-cols-4">
              <div className="border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-[#666666]"><span>Conversations</span><ChatCircle size={13} /></div>
                <div className="mt-1.5 text-[26px] font-extrabold leading-none">{agents.reduce((a, x) => a + x.conversations, 0).toLocaleString()}</div>
              </div>
              <div className="border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-[#666666]"><span>Avg. resolution</span><CheckCircle size={13} /></div>
                <div className="mt-1.5 text-[26px] font-extrabold leading-none">{Math.round(agents.reduce((a, x) => a + x.accuracy, 0) / agents.length)}%</div>
              </div>
              <div className="border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-[#666666]"><span>Active agents</span><Robot size={13} /></div>
                <div className="mt-1.5 text-[26px] font-extrabold leading-none">{agents.filter((a) => a.status === "Active").length}<span className="text-[14px] text-[#666666]">/{agents.length}</span></div>
              </div>
              <div className="border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-[#666666]"><span>Avg. fallback</span><ArrowsLeftRight size={13} /></div>
                <div className="mt-1.5 text-[26px] font-extrabold leading-none">{100 - Math.round(agents.reduce((a, x) => a + x.accuracy, 0) / agents.length)}%</div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {agents.map((a) => (
                <button key={a.id} onClick={() => openAgentDialog(a)} className="flex flex-col items-start border border-[#e5e5e5] p-4 text-left hover:border-[#0a0a0a]">
                  <div className="mb-3 flex w-full items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center border border-[#0a0a0a]"><Robot size={16} /></span>
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide ${a.status === "Active" ? "text-[#0a0a0a]" : "text-[#666666]"}`}>
                      <Circle size={8} weight={a.status === "Active" ? "fill" : "regular"} /> {a.status}
                    </span>
                  </div>
                  <b className="text-[13px]">{a.name}</b>
                  <p className="mt-1.5 text-[11px] leading-snug text-[#666666]">{a.role}</p>
                  <span className="mt-2.5 border border-[#e5e5e5] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-[#525252]">{a.archetype}</span>
                  <div className="mt-4 flex w-full gap-5 border-t border-[#f0f0f0] pt-3 text-[11px]">
                    <span><b>{a.conversations}</b> <span className="text-[#666666]">convos</span></span>
                    <span><b>{a.accuracy}%</b> <span className="text-[#666666]">accuracy</span></span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "websites" && (
          <div className="max-w-[640px]">
            <h1 className="text-[20px] font-extrabold tracking-tight">Websites &amp; Widget</h1>
            <p className="mt-1 text-[12px] text-[#666666]">Four of six steps complete — the docket is live, delivery still needs attention.</p>
            <div className="mt-5 h-1.5 w-full bg-[#e5e5e5]">
              <div className="h-full bg-[#0a0a0a]" style={{ width: `${(setupChecklist.filter((s) => s.done).length / setupChecklist.length) * 100}%` }} />
            </div>
            <div className="mt-5 divide-y divide-[#e5e5e5] border border-[#e5e5e5]">
              {setupChecklist.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-4 py-3.5">
                  {s.done ? <CheckCircle size={17} weight="fill" /> : <Circle size={17} className="text-[#c9c9c9]" />}
                  <span className={`text-[12.5px] ${s.done ? "text-[#666666] line-through decoration-[#c9c9c9]" : "font-semibold"}`}>{s.label}</span>
                  {!s.done && (
                    <button className="ml-auto flex items-center gap-1 text-[11px] font-bold text-[#0a0a0a] hover:underline">
                      Resolve <ArrowSquareOut size={11} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "followups" && (
          <div>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-[20px] font-extrabold tracking-tight">Follow-ups</h1>
                  <span className="flex items-center gap-1 border border-[#0a0a0a] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"><Sparkle size={10} /> Autonomous SLA triage</span>
                </div>
                <p className="mt-1 text-[12px] text-[#666666]">Every open case that still needs a next touch, overdue first.</p>
              </div>
              <button onClick={() => setToast("Follow-up scheduled")} className="flex items-center gap-1.5 bg-[#0a0a0a] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[#262626]">
                <PaperPlaneTilt size={13} /> Create Follow-up
              </button>
            </div>

            {/* SLA summary */}
            <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-[#666666]"><span>Active today</span><ArrowsLeftRight size={13} /></div>
                <div className="mt-1.5 text-[26px] font-extrabold leading-none">{followUpBuckets.Today.length}</div>
                <div className="mt-1 text-[10px] text-[#666666]">of {followUps.length} open touches</div>
              </div>
              <div className="border border-[#0a0a0a] p-4">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-[#666666]"><span>SLA breach</span><Warning size={13} weight="fill" /></div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-[26px] font-extrabold leading-none">{followUpBuckets.Overdue.length}</span>
                  {followUpBuckets.Overdue.length > 0 && <span className="bg-[#0a0a0a] px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-white">Immediate action</span>}
                </div>
              </div>
              <div className="border border-[#e5e5e5] p-4">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-[#666666]"><span>SLA completion</span><Target size={13} /></div>
                <div className="mt-1.5 text-[26px] font-extrabold leading-none">{Math.round((statusCounts.q / leads.length) * 100)}%</div>
                <div className="mt-1 text-[10px] text-[#666666]">of cases carried to Qualified</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-3 flex border border-[#e5e5e5]">
              {(["Today", "Upcoming", "Overdue", "Completed"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFollowupTab(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold ${followupTab === t ? "bg-[#0a0a0a] text-white" : "text-[#525252] hover:bg-[#f5f5f5]"}`}
                >
                  {t}
                  <span className={`text-[9.5px] ${followupTab === t ? "text-white/60" : "text-[#999999]"}`}>{followUpBuckets[t].length}</span>
                </button>
              ))}
            </div>

            <div className="border border-[#0a0a0a] divide-y divide-[#e5e5e5]">
              {followUpBuckets[followupTab].length === 0 ? (
                <div className="px-4 py-14 text-center text-[12px] text-[#666666]">No cases in this view.</div>
              ) : (
                followUpBuckets[followupTab].map((lead) => (
                  <div
                    key={lead.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openFromCommand(lead)}
                    onKeyDown={(e) => { if (e.key === "Enter") openFromCommand(lead); }}
                    className="flex w-full cursor-pointer flex-col gap-2 px-4 py-3.5 hover:bg-[#fafafa] sm:flex-row sm:items-center"
                  >
                    <span className="font-mono text-[11px] text-[#666666] sm:w-12 sm:flex-none">{lead.docket}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <b className="truncate text-[12.5px]">{lead.name}</b>
                        <span className="text-[11px] text-[#666666]">· {lead.company}</span>
                        <ClassBadge c={lead.classification} />
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-[#666666]">{lead.nextAction}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-[#666666]">
                        <span>{lead.owner}</span>
                        <span>·</span>
                        <span>{lead.classification === "Hot" ? "High priority" : lead.classification === "Warm" ? "Medium priority" : "Normal priority"}</span>
                      </span>
                    </span>
                    <span className="flex flex-none items-center gap-3">
                      <span className={`flex items-center gap-1.5 text-[11px] font-bold ${lead.overdue ? "text-[#0a0a0a]" : "text-[#666666]"}`}>
                        <Clock size={12} /> {lead.overdue ? "Overdue" : lead.followup}
                      </span>
                      {lead.status !== "Qualified" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); completeFollowUp(lead); }}
                          className="border border-[#0a0a0a] px-2 py-1 text-[10px] font-bold hover:bg-[#0a0a0a] hover:text-white"
                        >
                          Mark Complete
                        </button>
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "qualification" && (
          <QualificationSection leads={leads} notify={setToast} />
        )}

        {activeTab === "knowledgebase" && (
          <div className="max-w-[640px]">
            <h1 className="text-[20px] font-extrabold tracking-tight">Knowledge Base</h1>
            <p className="mt-1 text-[12px] text-[#666666]">What the AI draws on to answer visitor questions.</p>
            <div className="mt-5 divide-y divide-[#e5e5e5] border border-[#0a0a0a]">
              {knowledgeSources.map((k) => (
                <div key={k.label} className="flex items-start gap-3 px-4 py-3.5">
                  <k.icon size={16} className="mt-0.5 flex-none" />
                  <div>
                    <div className="text-[12.5px] font-semibold">{k.label}</div>
                    <div className="mt-0.5 text-[11px] text-[#666666]">{k.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <div className="mb-5">
              <h1 className="text-[20px] font-extrabold tracking-tight">Analytics</h1>
              <p className="mt-1 text-[12px] text-[#666666]">Qualification performance across the docket.</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
              <div className="border border-[#e5e5e5] p-4"><div className="text-[10px] font-bold uppercase tracking-wide text-[#666666]">Total cases</div><div className="mt-2 text-[30px] font-extrabold leading-none">{leads.length}</div></div>
              <div className="border border-[#e5e5e5] p-4"><div className="text-[10px] font-bold uppercase tracking-wide text-[#666666]">Hot rate</div><div className="mt-2 text-[30px] font-extrabold leading-none">{Math.round((hotCount / leads.length) * 100)}%</div></div>
              <div className="border border-[#e5e5e5] p-4"><div className="text-[10px] font-bold uppercase tracking-wide text-[#666666]">Avg. score</div><div className="mt-2 text-[30px] font-extrabold leading-none">{avgScore}</div></div>
              <div className="border border-[#e5e5e5] p-4"><div className="text-[10px] font-bold uppercase tracking-wide text-[#666666]">Qualified</div><div className="mt-2 text-[30px] font-extrabold leading-none">{qualifiedThisWeek}</div></div>
            </div>
            <p className="mt-4 max-w-[54ch] text-[11px] text-[#666666]">Trend charts and cohort breakdowns are not built in this prototype — this view demonstrates the destination, not the full module.</p>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="max-w-[640px]">
            <h1 className="text-[20px] font-extrabold tracking-tight">Integrations</h1>
            <p className="mt-1 text-[12px] text-[#666666]">Where docketed cases get delivered.</p>
            <div className="mt-5 divide-y divide-[#e5e5e5] border border-[#0a0a0a]">
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="flex items-center gap-2.5 text-[12.5px] font-semibold"><EnvelopeSimple size={16} /> Email notifications</span>
                <CheckCircle size={16} weight="fill" />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="flex items-center gap-2.5 text-[12.5px] font-semibold"><Buildings size={16} /> CRM sync</span>
                <CheckCircle size={16} weight="fill" />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="flex items-center gap-2.5 text-[12.5px] font-semibold"><WebhooksLogo size={16} /> Outbound webhook</span>
                <span className="flex items-center gap-2">
                  {webhookState === "ok" && <CheckCircle size={16} weight="fill" />}
                  {webhookState === "retrying" && <SpinnerGap size={16} className="td-spin" />}
                  {webhookState === "failed" && (
                    <button onClick={retryWebhook} className="flex items-center gap-1.5 border border-[#0a0a0a] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide hover:bg-[#0a0a0a] hover:text-white">
                      <ArrowClockwise size={12} /> Retry
                    </button>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="max-w-[640px]">
            <h1 className="text-[20px] font-extrabold tracking-tight">Team</h1>
            <p className="mt-1 text-[12px] text-[#666666]">Who's carrying which cases right now.</p>
            <div className="mt-5 divide-y divide-[#e5e5e5] border border-[#0a0a0a]">
              {teamMembers.map((m) => (
                <div key={m.name} className="flex items-center gap-3 px-4 py-3.5">
                  <span className="flex h-8 w-8 items-center justify-center border border-[#0a0a0a] text-[10px] font-bold">{m.name === "Unassigned" ? "—" : m.name.slice(0, 2).toUpperCase()}</span>
                  <span className="flex-1 text-[12.5px] font-semibold">{m.name}</span>
                  <span className="text-[11px] text-[#666666]">{m.count} case{m.count === 1 ? "" : "s"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="max-w-[640px]">
            <h1 className="text-[20px] font-extrabold tracking-tight">Notifications</h1>
            <p className="mt-1 text-[12px] text-[#666666]">Every alert the docket has raised.</p>
            <div className="mt-5 divide-y divide-[#e5e5e5] border border-[#0a0a0a]">
              {notifications.map((n) => (
                <div key={n.id} className={`px-4 py-3.5 ${n.unread ? "bg-[#fafafa]" : ""}`}>
                  <div className="flex items-baseline justify-between gap-2"><b className="text-[12.5px]">{n.title}</b><span className="flex-none text-[10px] text-[#666666]">{n.time}</span></div>
                  <p className="mt-1 text-[11px] leading-snug text-[#666666]">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="max-w-[480px]">
            <h1 className="text-[20px] font-extrabold tracking-tight">Billing &amp; Usage</h1>
            <p className="mt-1 text-[12px] text-[#666666]">Starter plan, billed monthly.</p>
            <div className="mt-5 border border-[#0a0a0a] p-4">
              <div className="flex items-center justify-between text-[12.5px] font-semibold"><span>Conversations this month</span><span>742 / 1,000</span></div>
              <div className="mt-2 h-1.5 w-full bg-[#e5e5e5]"><div className="h-full bg-[#0a0a0a]" style={{ width: "74%" }} /></div>
              <button className="mt-4 w-full border border-[#0a0a0a] py-2 text-[11px] font-bold uppercase tracking-wide hover:bg-[#0a0a0a] hover:text-white">Upgrade plan</button>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-[480px]">
            <h1 className="text-[20px] font-extrabold tracking-tight">Settings</h1>
            <p className="mt-1 text-[12px] text-[#666666]">Workspace configuration.</p>
            <div className="mt-5 divide-y divide-[#e5e5e5] border border-[#0a0a0a]">
              {[
                { label: "Workspace name", value: "AILQS" },
                { label: "Plan", value: "Starter — 3 websites" },
                { label: "Primary domain", value: "ailqs.com" },
                { label: "Webhook status", value: webhookState === "ok" ? "Active" : "Needs attention" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-3.5 text-[12.5px]"><span className="text-[#666666]">{row.label}</span><span className="font-semibold">{row.value}</span></div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "help" && (
          <div className="max-w-[480px]">
            <h1 className="text-[20px] font-extrabold tracking-tight">Help &amp; Support</h1>
            <p className="mt-1 text-[12px] text-[#666666]">Reach the team behind the docket.</p>
            <div className="mt-5 divide-y divide-[#e5e5e5] border border-[#0a0a0a]">
              <div className="flex items-center gap-3 px-4 py-3.5"><EnvelopeSimple size={16} /> <span className="text-[12.5px]">support@ailqs.com</span></div>
              <div className="flex items-center gap-3 px-4 py-3.5"><ChatCircle size={16} /> <span className="text-[12.5px]">Live chat — weekdays, 9am–6pm</span></div>
              <div className="flex items-center gap-3 px-4 py-3.5"><BookOpenText size={16} /> <span className="text-[12.5px]">Setup and integration guides</span></div>
            </div>
          </div>
        )}
        </main>
      </div>

      {/* Command palette */}
      {commandOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 px-4 pt-24">
          <button aria-label="Close" onClick={() => setCommandOpen(false)} className="absolute inset-0 cursor-default" />
          <div className="td-pop relative w-full max-w-[560px] border border-[#0a0a0a] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
            <div className="flex items-center gap-2.5 border-b border-[#e5e5e5] px-4 py-3">
              <MagnifyingGlass size={15} className="text-[#666666]" />
              <input
                ref={commandInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cases, or jump to a section…"
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#737373]"
              />
              <button onClick={() => setCommandOpen(false)}><X size={15} /></button>
            </div>
            <div className="max-h-[360px] overflow-auto py-1">
              <div className="px-4 pt-2 text-[9px] font-bold uppercase tracking-wide text-[#737373]">Cases</div>
              {commandResults.map((lead) => (
                <button key={lead.id} onClick={() => openFromCommand(lead)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[#f5f5f5]">
                  <span className="font-mono text-[10px] text-[#737373]">{lead.docket}</span>
                  <span className="min-w-0 flex-1">
                    <b className="block truncate text-[12px]">{lead.name}</b>
                    <span className="block truncate text-[10px] text-[#737373]">{lead.company}</span>
                  </span>
                  <ClassBadge c={lead.classification} />
                </button>
              ))}
              <div className="mt-1 border-t border-[#f0f0f0] px-4 pt-2 text-[9px] font-bold uppercase tracking-wide text-[#737373]">Go to</div>
              {allNav.map(([key, label, Icon]) => (
                <button key={key} onClick={() => { setActiveTab(key); setCommandOpen(false); setQuery(""); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[#f5f5f5]">
                  <Icon size={14} /> <span className="text-[12px]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Verdict confirmation dialog */}
      {verdictFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <button aria-label="Close" onClick={() => setVerdictFor(null)} className="absolute inset-0 cursor-default" />
          <div className="td-pop relative w-full max-w-[440px] border border-[#0a0a0a] bg-white p-5 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-[#666666]">No. {verdictFor.docket}</div>
                <h2 className="text-[16px] font-extrabold">Record verdict for {verdictFor.name}</h2>
              </div>
              <button onClick={() => setVerdictFor(null)}><X size={16} /></button>
            </div>
            <p className="mb-4 text-[12.5px] leading-relaxed text-[#525252]">{verdictFor.nextAction}</p>
            <div className="mb-4 flex items-center gap-2 border border-[#e5e5e5] bg-[#fafafa] p-3 text-[11px]">
              <NotePencil size={14} className="flex-none" />
              Moves this case from <b>{verdictFor.status}</b> to the next stage.
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setVerdictFor(null)} className="border border-[#e5e5e5] px-3 py-2 text-[11px] font-bold text-[#525252]">Cancel</button>
              <button onClick={() => recordVerdict(verdictFor)} className="flex items-center gap-1.5 bg-[#0a0a0a] px-3 py-2 text-[11px] font-bold text-white hover:bg-[#262626]">
                <Check size={13} /> Confirm verdict
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agent detail dialog */}
      {agentDialogId !== null && agentDraft && (() => {
        const agent = agents.find((a) => a.id === agentDialogId)!;
        const draft = agentDraft;
        const wordCount = draft.prompt.trim().split(/\s+/).filter(Boolean).length;
        const recommendation = agent.status === "Paused"
          ? "Reactivate this agent to resume coverage."
          : agent.accuracy < 92
          ? "Add FAQ coverage to raise resolution accuracy."
          : "No action needed — configuration is healthy.";
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
            <button aria-label="Close" onClick={closeAgentDialog} className="absolute inset-0 cursor-default" />
            <div className="td-pop relative flex max-h-[85vh] w-full max-w-[560px] flex-col border border-[#0a0a0a] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
              <div className="flex items-start justify-between border-b border-[#e5e5e5] p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center border border-[#0a0a0a]"><Robot size={20} /></span>
                  <div>
                    <h2 className="text-[15px] font-extrabold">{agent.name}</h2>
                    <p className="mt-0.5 text-[11px] text-[#666666]">{agent.role}</p>
                  </div>
                </div>
                <button onClick={closeAgentDialog}><X size={16} /></button>
              </div>
              <div className="grid grid-cols-3 divide-x divide-[#e5e5e5] border-b border-[#e5e5e5] text-center">
                <div className="p-3"><div className="text-[18px] font-extrabold">{agent.conversations}</div><div className="text-[10px] text-[#666666]">Conversations</div></div>
                <div className="p-3"><div className="text-[18px] font-extrabold">{agent.accuracy}%</div><div className="text-[10px] text-[#666666]">Accuracy</div></div>
                <div className="p-3"><div className="text-[18px] font-extrabold">{agent.status}</div><div className="text-[10px] text-[#666666]">Status</div></div>
              </div>

              <div className="overflow-y-auto p-5">
                {/* Configuration health */}
                <div className="mb-5 flex items-center gap-4 border border-[#e5e5e5] p-3.5">
                  <div
                    className="relative flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full"
                    style={{ background: `conic-gradient(#0a0a0a 0 ${(agent.accuracy / 100) * 360}deg, #e5e5e5 ${(agent.accuracy / 100) * 360}deg 360deg)` }}
                  >
                    <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white text-[11px] font-extrabold">{agent.accuracy}%</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold uppercase tracking-wide text-[#666666]">Configuration health</div>
                    <p className="mt-0.5 text-[11px] leading-snug text-[#525252]">{recommendation}</p>
                  </div>
                </div>

                {/* Voice & Demeanor */}
                <div className="mb-5">
                  <h3 className="text-[13px] font-extrabold">Voice &amp; Demeanor</h3>
                  <p className="mt-0.5 text-[11px] text-[#666666]">Control how {agent.name} engages prospects during qualification.</p>

                  <div className="mt-3 text-[9px] font-bold uppercase tracking-wide text-[#666666]">Personality archetype</div>
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                    {archetypeOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAgentDraft((cur) => (cur ? { ...cur, archetype: opt } : cur))}
                        className={`border px-2.5 py-1.5 text-[10.5px] font-bold ${draft.archetype === opt ? "border-[#0a0a0a] bg-[#0a0a0a] text-white" : "border-[#e5e5e5] text-[#525252] hover:border-[#0a0a0a]"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 text-[9px] font-bold uppercase tracking-wide text-[#666666]">Tone attributes (select up to 3)</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {toneOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleAgentTone(opt)}
                        className={`flex items-center gap-1 border px-2.5 py-1 text-[10.5px] font-bold ${draft.tones.includes(opt) ? "border-[#0a0a0a] bg-[#0a0a0a] text-white" : "border-[#e5e5e5] text-[#525252] hover:border-[#0a0a0a]"}`}
                      >
                        {draft.tones.includes(opt) && <Check size={10} />} {opt}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 text-[9px] font-bold uppercase tracking-wide text-[#666666]">Response length preference</div>
                  <div className="mt-1.5 flex border border-[#e5e5e5]">
                    {lengthOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAgentDraft((cur) => (cur ? { ...cur, length: opt } : cur))}
                        className={`flex-1 px-2 py-1.5 text-[10px] font-bold ${draft.length === opt ? "bg-[#0a0a0a] text-white" : "text-[#525252] hover:bg-[#f5f5f5]"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* System prompt */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13px] font-extrabold">Business Core &amp; Master Instructions</h3>
                    <span className="text-[10px] text-[#666666]">{wordCount} / 2,000 words</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#666666]">Foundational system instruction prompt executing qualification thresholds.</p>
                  <textarea
                    value={draft.prompt}
                    onChange={(e) => setAgentDraft((cur) => (cur ? { ...cur, prompt: e.target.value } : cur))}
                    rows={5}
                    className="mt-2 w-full resize-none border border-[#e5e5e5] p-3 text-[11.5px] leading-relaxed outline-none focus:border-[#0a0a0a]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#e5e5e5] p-4">
                <button onClick={closeAgentDialog} className="border border-[#e5e5e5] px-3 py-2 text-[11px] font-bold text-[#525252]">Discard changes</button>
                <button onClick={() => { setToast(`${agent.name} draft saved`); closeAgentDialog(); }} className="bg-[#0a0a0a] px-3 py-2 text-[11px] font-bold text-white hover:bg-[#262626]">Save Identity Draft</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="td-pop fixed bottom-5 left-1/2 z-[55] flex -translate-x-1/2 items-center gap-3 bg-[#0a0a0a] px-3 py-2 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <span className="text-[11px] font-bold">{selectedIds.size} selected</span>
          <span className="h-4 w-px bg-white/20" />
          <button onClick={bulkAssignToMe} className="text-[11px] font-bold text-white/85 hover:text-white">Assign to me</button>
          <button onClick={bulkAdvanceStage} className="text-[11px] font-bold text-white/85 hover:text-white">Advance stage</button>
          <button onClick={() => setToast(`${selectedIds.size} case${selectedIds.size === 1 ? "" : "s"} exported`)} className="text-[11px] font-bold text-white/85 hover:text-white">Export</button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-1 text-white/60 hover:text-white"><X size={13} /></button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="td-pop fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 bg-[#0a0a0a] px-4 py-3 text-[12px] font-semibold text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <CheckCircle size={15} weight="fill" /> {toast}
          <button onClick={() => setToast(null)} className="ml-1 text-white/60 hover:text-white"><X size={13} /></button>
        </div>
      )}
    </div>
  );
}
