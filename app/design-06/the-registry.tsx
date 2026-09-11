"use client";

/*
THESIS: A lead is a record in a shared database, not a ticket in an inbox — the panel is a workspace of objects (Leads, Companies, Inbox, Agents) you browse, filter and open, not a queue you triage.
OWN-WORLD: A Twenty-CRM-shaped object workspace: a light, minimal left sidebar of favorites and workspace objects; a dense spreadsheet-style table with per-column field-type icons and a custom checkbox system; a centered ⌘K command palette grouped into Create/Navigate/Recent/Results; and records opened by navigating to a dedicated record page (breadcrumb + two-column field list and activity feed), never a drawer or an in-place unfold. Chrome stays black, white and gray; color is reserved for what the data itself means — classification, links, brand tiles, destructive actions.
STORY: Land on the Leads table, scan or filter it, search or jump anywhere with ⌘K, open a lead as its own record page, read its fields and evidence, advance its stage, then move to Companies, Inbox or Agents as sibling objects in the same workspace.
FIRST VIEWPORT: Sidebar (workspace switcher, favorites, objects) — top bar (object icon, title, count, avatars) — view tabs and table toolbar — the Leads table begins the fold.
FORM: Sidebar + object table + breadcrumb record navigation — structurally distinct from Designs 01-05 (no dark command rail, no floating panels, no signal ticker, no right-side drawer, no in-place exhibit unfold). Direction fully pinned by the brief (monochrome chrome with purposeful accent color, standard sans, mature icon set, explicitly modeled on twenty.com's product UI); concept-seed roll intentionally skipped per "brief-pinned direction beats the roll," as documented for Design 05.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
*/

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import "./the-registry.css";
import {
  ArrowClockwise, ArrowLeft, ArrowSquareOut, ArrowsDownUp, ArrowsLeftRight, At, Bell, BellRinging, BookOpenText, Buildings,
  CalendarBlank, CaretDown, CaretRight, CaretUp, CaretUpDown, ChartLineUp, ChatCircle,
  Check, CheckCircle, CheckSquare, CirclesThreePlus, Circle, Clock, ClockCounterClockwise, Command,
  CreditCard, DotsSixVertical, DotsThree, EnvelopeSimple, FileText, Fire, FlowArrow, FunnelSimple, Gauge, GearSix,
  GridFour, Hash, IdentificationBadge, Info, Lifebuoy, Lightning, LinkSimple, ListChecks,
  MagnifyingGlass, Megaphone, MinusCircle, NotePencil, PaperPlaneTilt, Phone, PlayCircle, Plus, PlusCircle, PuzzlePiece, Repeat, Robot, ShieldCheck, SignOut,
  SlidersHorizontal, SortAscending, Sparkle, SpinnerGap, Square, Star, Table as TableIcon, Target,
  TextAlignLeft, Timer, Translate, Trash, TrendUp, UserCircle, Users, Warning, X, XCircle,
} from "@phosphor-icons/react";

type Classification = "Hot" | "Warm" | "Cold";
type LeadStatus = "New" | "Contacted" | "Qualified";
type Msg = { from: "visitor" | "ai" | "agent"; author: string; time: string; text: string };
type ScoreLine = { label: string; points: number; max: number; note: string };

type Lead = {
  id: number; name: string; initials: string; company: string; companyColor: string;
  site: string; classification: Classification; score: number; owner: string; ownerInitials: string;
  status: LeadStatus; received: string; consented: boolean; interest: string; favorite?: boolean;
  followup: string; overdue?: boolean;
  email: string; phone: string; transcript: Msg[]; scoring: ScoreLine[]; nextAction: string;
  role: string; location: string; linkedin: string; companyMeta: string; companySize: string; techStack: string[];
};

const classColor: Record<Classification, string> = { Hot: "#E5484D", Warm: "#F5A623", Cold: "#8A8F98" };
const ACCENT = "#3E63DD";

const initialLeads: Lead[] = [
  {
    id: 1, name: "Priya Sharma", initials: "PS", company: "Northstar Labs", companyColor: "#6366F1",
    site: "northstarlabs.co", classification: "Hot", score: 92, owner: "Maya", ownerInitials: "M",
    status: "New", received: "4m ago", consented: true, interest: "Enterprise onboarding", favorite: true,
    followup: "Today, 2:30 PM",
    email: "priya@northstarlabs.co", phone: "+91 98765 44210",
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
    role: "VP of Product", location: "Bengaluru, India", linkedin: "linkedin.com/in/priyasharma",
    companyMeta: "B2B SaaS · Developer Tools", companySize: "120–250 FTE", techStack: ["HubSpot CRM", "Segment", "Stripe"],
  },
  {
    id: 2, name: "Liam Chen", initials: "LC", company: "Frame & Field", companyColor: "#F59E0B",
    site: "framefield.design", classification: "Warm", score: 74, owner: "You", ownerInitials: "Y",
    status: "Contacted", received: "18m ago", consented: true, interest: "Agency lead routing",
    followup: "Tomorrow",
    email: "liam@framefield.design", phone: "+1 415 555 0192",
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
    role: "Founder", location: "Austin, TX, USA", linkedin: "linkedin.com/in/liamchen",
    companyMeta: "Design Agency · Creative Services", companySize: "10–25 FTE", techStack: ["Webflow", "Notion"],
  },
  {
    id: 3, name: "Amelia Brooks", initials: "AB", company: "Reform Health", companyColor: "#10B981",
    site: "reformhealth.io", classification: "Hot", score: 86, owner: "Jon", ownerInitials: "J",
    status: "New", received: "41m ago", consented: true, interest: "Patient enquiries", favorite: true,
    followup: "Overdue", overdue: true,
    email: "amelia@reformhealth.io", phone: "+44 7700 900247",
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
    role: "Director of Digital", location: "London, UK", linkedin: "linkedin.com/in/ameliabrooks",
    companyMeta: "Healthcare · Patient Services", companySize: "250–500 FTE", techStack: ["Salesforce Health Cloud", "Twilio"],
  },
  {
    id: 4, name: "Noah Williams", initials: "NW", company: "Arcwell Homes", companyColor: "#F97316",
    site: "arcwellhomes.com", classification: "Warm", score: 61, owner: "Unassigned", ownerInitials: "?",
    status: "New", received: "1h ago", consented: false, interest: "Property enquiries",
    followup: "Not set",
    email: "noah@arcwellhomes.com", phone: "+61 412 555 018",
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
    role: "Marketing Manager", location: "Melbourne, Australia", linkedin: "linkedin.com/in/noahwilliams",
    companyMeta: "Real Estate · Residential", companySize: "25–50 FTE", techStack: ["Zillow API", "Mailchimp"],
  },
  {
    id: 5, name: "Sofia Martinez", initials: "SM", company: "Mesa Commerce", companyColor: "#EC4899",
    site: "mesacommerce.mx", classification: "Cold", score: 38, owner: "You", ownerInitials: "Y",
    status: "Qualified", received: "2h ago", consented: true, interest: "Product support",
    followup: "Sep 6",
    email: "sofia@mesacommerce.mx", phone: "+52 55 5555 0134",
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
    nextAction: "Add to a nurture sequence; revisit next quarter.",
    role: "Support Lead", location: "Mexico City, Mexico", linkedin: "linkedin.com/in/sofiamartinez",
    companyMeta: "E-commerce · Retail", companySize: "50–100 FTE", techStack: ["Zendesk", "Shopify"],
  },
  {
    id: 6, name: "Ethan Okafor", initials: "EO", company: "Parcel Grid", companyColor: "#06B6D4",
    site: "parcelgrid.africa", classification: "Hot", score: 81, owner: "Maya", ownerInitials: "M",
    status: "Contacted", received: "3h ago", consented: true, interest: "Logistics qualification",
    followup: "Friday",
    email: "ethan@parcelgrid.africa", phone: "+234 803 555 0188",
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
    role: "Head of Sales Ops", location: "Lagos, Nigeria", linkedin: "linkedin.com/in/ethanokafor",
    companyMeta: "Logistics · Last-mile Delivery", companySize: "500+ FTE", techStack: ["NetSuite", "Twilio"],
  },
  {
    id: 7, name: "Grace Kim", initials: "GK", company: "Ledger & Co", companyColor: "#64748B",
    site: "ledgerandco.com", classification: "Cold", score: 29, owner: "Unassigned", ownerInitials: "?",
    status: "New", received: "5h ago", consented: false, interest: "General enquiry",
    followup: "Not set",
    email: "grace@ledgerandco.com", phone: "+1 212 555 0110",
    transcript: [{ from: "visitor", author: "Grace Kim", time: "3:05 AM", text: "Just looking around, will reach out if we need anything." }],
    scoring: [
      { label: "Budget confirmed", points: 2, max: 25, note: "No budget signal." },
      { label: "Timeline within quarter", points: 3, max: 25, note: "No stated timeline." },
      { label: "Decision-maker identified", points: 9, max: 25, note: "Not identified yet." },
      { label: "Stated intent", points: 15, max: 25, note: "Early-stage browsing only." },
    ],
    nextAction: "No action required — monitor for a return visit.",
    role: "Operations Assistant", location: "Toronto, Canada", linkedin: "linkedin.com/in/gracekim",
    companyMeta: "Professional Services · Accounting", companySize: "10–25 FTE", techStack: ["QuickBooks"],
  },
];

const archetypeOptions = ["Professional & Direct", "Warm & Advisory", "Playful & Casual", "Consultative Expert"];
const toneOptions = ["Empathetic", "Data-driven", "Crisp & Concise", "Authoritative"];
const lengthOptions = ["Concise (1–2 sentences)", "Balanced (2–3 paragraphs)", "Detailed & Thorough"];

const agents = [
  {
    id: 1, name: "Frontline Qualifier", role: "First response on ailqs.com and studio.ailqs.com", status: "Active" as const, conversations: 214, accuracy: 96,
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

const notifications = [
  { id: 1, title: "New Hot lead", body: "Priya Sharma — Northstar Labs, score 92.", time: "4m", unread: true },
  { id: 2, title: "Company sync failed", body: "Parcel Grid's CRM sync returned a timeout.", time: "9m", unread: true },
  { id: 3, title: "Follow-up overdue", body: "Amelia Brooks — 38 minutes past target.", time: "22m", unread: true },
  { id: 4, title: "Lead qualified", body: "Sofia Martinez moved to Qualified.", time: "1h", unread: false },
];

const nextStage: Record<LeadStatus, LeadStatus> = { New: "Contacted", Contacted: "Qualified", Qualified: "Qualified" };

const workspaceNav = [
  ["dashboard", "Dashboard", Target] as const,
  ["inbox", "Inbox", ChatCircle] as const,
  ["leads", "Leads", Users] as const,
  ["companies", "Companies", Buildings] as const,
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
const allObjectNav = [...workspaceNav, ...adminNav, ["help", "Help & Support", Lifebuoy] as const];
type ObjectKey = (typeof allObjectNav)[number][0];
const objectLabel: Record<ObjectKey, string> = Object.fromEntries(allObjectNav.map(([key, label]) => [key, label])) as Record<ObjectKey, string>;
const objectIcon: Record<ObjectKey, (typeof allObjectNav)[number][2]> = Object.fromEntries(allObjectNav.map(([key, , icon]) => [key, icon])) as Record<ObjectKey, (typeof allObjectNav)[number][2]>;

// ---------- Qualification & Scoring ----------

type QualificationQuestion = {
  id: number;
  label: string;
  crmField: string;
  fieldType: string;
  points: string;
  askCondition: string;
  required: boolean;
};

const crmFieldOptions = ["lead.budget_range", "lead.timeline", "lead.service_interest", "lead.company_size", "lead.intent_score", "lead.decision_role", "lead.geo_location", "lead.custom_field"];
const fieldTypeOptions = ["Segmented Pill Choices (Single Select)", "Free Text Response", "Multi Select Pills", "Number Input", "Date Picker", "AI Detected (No Prompt)"];

const initialQuestions: QualificationQuestion[] = [
  { id: 1, label: "Budget & Investment Range", crmField: "lead.budget_range", fieldType: "Currency Range", points: "Up to +25 pts (High Impact)", askCondition: "Always ask (Turn 1)", required: true },
  { id: 2, label: "Project Timeline & Kickoff", crmField: "lead.timeline", fieldType: "Segmented Choices", points: "Up to +20 pts", askCondition: "Ask after budget confirmed", required: true },
  { id: 3, label: "Service / Product Interest", crmField: "lead.service_interest", fieldType: "Single Select Pills", points: "Up to +20 pts", askCondition: "Always ask (Turn 1)", required: true },
  { id: 4, label: "Company / Business Fit", crmField: "lead.company_size", fieldType: "Select Range", points: "Up to +15 pts", askCondition: "Ask if Enterprise mode", required: false },
  { id: 5, label: "Buying Intent Signal", crmField: "lead.intent_score", fieldType: "AI Detected (No Prompt)", points: "Up to +20 pts", askCondition: "Derived from conversation language", required: false },
];

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className="relative h-6 w-11 shrink-0 rounded-full transition-colors" style={{ background: checked ? ACCENT : "#e2e2e6" }}>
      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(20,20,25,0.25)] transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default" />
      <aside className="reg-pop relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-[#e2e2e6] bg-white shadow-[0_16px_40px_rgba(20,20,25,0.14)]">
        <div className="flex items-start justify-between border-b border-[#ececef] p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f2f2f4]" style={{ color: ACCENT }}><NotePencil size={17} /></span>
            <div>
              <h2 className="text-[15px] font-extrabold text-[#1c1c1f]">Create Qualification Question</h2>
              <p className="mt-0.5 text-[11px] text-[#6b6d76]">Define field mapping, phrasing, and AI extraction rules</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="shrink-0 rounded-full p-1 text-[#6b6d76] hover:bg-[#f2f2f4] hover:text-[#1c1c1f]"><X size={18} /></button>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[#1c1c1f]">Question Label / Internal Name</span>
            <input name="questionLabel" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Timeline Urgency" className="h-10 rounded-[7px] border border-[#e2e2e6] px-3 text-[13px] outline-none focus:border-[#3E63DD]" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[#1c1c1f]">Mapped CRM Field</span>
            <div className="relative">
              <select name="crmField" value={crmField} onChange={(e) => setCrmField(e.target.value)} className="h-10 w-full appearance-none rounded-[7px] border border-[#e2e2e6] px-3 pr-9 font-mono text-[12px] outline-none focus:border-[#3E63DD]">
                {crmFieldOptions.map((f) => <option key={f}>{f}</option>)}
              </select>
              <CaretDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" size={14} style={{ color: "#6b6d76" }} />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[#1c1c1f]">Input &amp; Field Type</span>
            <div className="relative">
              <select name="fieldType" value={fieldType} onChange={(e) => setFieldType(e.target.value)} className="h-10 w-full appearance-none rounded-[7px] border border-[#e2e2e6] px-3 pr-9 text-[13px] outline-none focus:border-[#3E63DD]">
                {fieldTypeOptions.map((f) => <option key={f}>{f}</option>)}
              </select>
              <CaretDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" size={14} style={{ color: "#6b6d76" }} />
            </div>
          </label>

          <div className="flex items-center justify-between gap-3 rounded-[10px] border border-[#ececef] p-3">
            <div>
              <span className="block text-[12px] font-semibold text-[#1c1c1f]">Required Question</span>
              <span className="text-[11px] text-[#6b6d76]">Conversation won&rsquo;t yield qualified tag until filled</span>
            </div>
            <ToggleSwitch checked={required} onChange={() => setRequired((v) => !v)} label="Required question" />
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[#1c1c1f]">Default Visitor Prompt</span>
            <input name="defaultPrompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. When is your target kickoff date for this deployment?" className="h-10 rounded-[7px] border border-[#e2e2e6] px-3 text-[13px] outline-none focus:border-[#3E63DD]" />
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 rounded-[10px] border border-[#ececef] p-3">
            <input type="checkbox" name="aiAdaptivePhrasing" checked={aiAdaptive} onChange={(e) => setAiAdaptive(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0" style={{ accentColor: ACCENT }} />
            <span>
              <span className="block text-[12px] font-semibold text-[#1c1c1f]">AI Adaptive Phrasing</span>
              <span className="text-[11px] text-[#6b6d76]">Allow the agent to dynamically rephrase based on conversation tone &amp; previous context</span>
            </span>
          </label>

          <div className="flex flex-col gap-2 rounded-[10px] border border-[#ececef] p-3">
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1c1c1f]"><FlowArrow size={14} style={{ color: "#6b6d76" }} />Ask Condition / Branching</span>
            <div className="flex flex-wrap items-center gap-1.5 rounded-[7px] border border-[#ececef] bg-white px-2.5 py-2 text-[12px] font-mono">
              <span className="font-semibold" style={{ color: ACCENT }}>IF</span>
              <input name="conditionField" aria-label="Ask condition field" value={conditionField} onChange={(e) => setConditionField(e.target.value)} className="w-28 rounded border border-[#ececef] px-1.5 py-0.5 outline-none focus:border-[#3E63DD]" />
              <span className="text-[#6b6d76]">!=</span>
              <input name="conditionValue" aria-label="Ask condition value" value={conditionValue} onChange={(e) => setConditionValue(e.target.value)} className="w-24 rounded border border-[#ececef] px-1.5 py-0.5 outline-none focus:border-[#3E63DD]" />
              <span className="ml-auto shrink-0 rounded bg-[#f2f2f4] px-2 py-0.5 text-[10px] font-semibold text-[#3d3e44]">THEN Ask</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1c1c1f]"><ChartLineUp size={14} style={{ color: "#6b6d76" }} />Scoring Impact</span>
            <div className="flex flex-col gap-1.5">
              {scoringEffects.map((effect, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 rounded-[7px] px-3 py-2 text-[12px] font-medium" style={{ background: "#e5f6f3", color: "#12A594" }}>
                  <span className="flex items-center gap-1.5"><Target size={13} />{effect}</span>
                  <button type="button" onClick={() => removeScoringEffect(idx)} aria-label="Remove scoring effect" className="opacity-60 hover:opacity-100"><X size={13} /></button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <input name="scoringEffect" aria-label="New scoring effect" value={newEffect} onChange={(e) => setNewEffect(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addScoringEffect(); } }} placeholder="e.g. +10 pts if budget confirmed" className="h-8 flex-1 rounded-[7px] border border-[#e2e2e6] px-2.5 text-[11px] outline-none focus:border-[#3E63DD]" />
              <button type="button" onClick={addScoringEffect} className="flex items-center gap-1 rounded-[7px] border border-[#e2e2e6] px-2.5 py-1.5 text-[11px] font-semibold hover:bg-[#f2f2f4]" style={{ color: ACCENT }}><Plus size={13} />Add</button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1c1c1f]"><Translate size={14} style={{ color: "#6b6d76" }} />Multilingual Phrasing Support</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {languages.map((lang) => (
                <span key={lang} className="rounded-full bg-[#f2f2f4] px-2.5 py-1 text-[11px] font-semibold text-[#3d3e44]">{lang}</span>
              ))}
              {addingLanguage ? (
                <span className="flex items-center gap-1">
                  <input name="newLanguage" aria-label="New language" autoFocus value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLanguage(); } if (e.key === "Escape") setAddingLanguage(false); }} placeholder="Language" className="h-7 w-24 rounded-full border border-[#e2e2e6] px-2.5 text-[11px] outline-none focus:border-[#3E63DD]" />
                  <button type="button" onClick={addLanguage} aria-label="Confirm language" style={{ color: ACCENT }}><Check weight="bold" size={14} /></button>
                </span>
              ) : (
                <button type="button" onClick={() => setAddingLanguage(true)} aria-label="Add language" className="grid h-7 w-7 place-items-center rounded-full bg-[#f2f2f4] text-[#3d3e44] hover:bg-[#e2e2e6]"><Plus size={13} /></button>
              )}
            </div>
          </div>

          <p className="flex items-start gap-2 text-[11px] text-[#6b6d76]"><Info size={13} className="mt-0.5 shrink-0" />Graceful extraction with 2 retry attempts before human handoff.</p>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-[#ececef] bg-[#fafafb] p-4">
          <button type="button" onClick={onClose} className="rounded-[7px] border border-[#e2e2e6] px-4 py-2 text-[12px] font-semibold text-[#3d3e44] hover:bg-[#f2f2f4]">Cancel</button>
          <button type="button" onClick={save} className="rounded-[7px] px-5 py-2 text-[12px] font-bold text-white hover:opacity-90" style={{ background: ACCENT }}>Save Question</button>
        </div>
      </aside>
    </div>
  );
}

type ScoringRuleKind = "positive" | "highlight" | "alert" | "penalty";
type ScoringRuleIcon = "lightning" | "sparkle" | "bellRinging" | "minusCircle" | "shieldCheck" | "chartLineUp";

type ScoringRule = {
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
};

const ruleKindStyle: Record<ScoringRuleKind, { bg: string; text: string }> = {
  positive: { bg: "#e5f6f3", text: "#12A594" },
  highlight: { bg: "#eef1fd", text: ACCENT },
  alert: { bg: "#fdeced", text: classColor.Hot },
  penalty: { bg: "#fdeced", text: classColor.Hot },
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
  { id: 1, name: "High Velocity", category: "Financial & Urgency", kind: "positive", icon: "lightning", points: 25, conditionIf: "Budget ≥ $200,000", conditionAnd: "Timeline is within 30 days", matched: 318, capturePercent: "74.2% capture", evaluatedAgo: "4m ago", precision: "99.2%", active: true },
  { id: 2, name: "Core Offering Match", category: "Service Fit", kind: "highlight", icon: "sparkle", points: 18, conditionIf: 'Service Interest is "AI Automation & CRM"', matched: 482, evaluatedAgo: "12m ago", precision: "98.9%", active: true },
  { id: 3, name: "Direct Hot Handover", category: "Intent & Routing", kind: "alert", icon: "bellRinging", points: 22, conditionIf: 'Buying Intent is "High (Immediate Need)"', note: { prefix: "Trigger Slack alert to ", highlight: "#enterprise-sales", suffix: " & assign round-robin" }, matched: 142, evaluatedAgo: "1m ago", precision: "99.7%", active: true },
  { id: 4, name: "Penalty", category: "Demographics", kind: "penalty", icon: "minusCircle", points: 20, conditionIf: 'Location is "Outside Tier-1 / Unserviced Geography"', matched: 64, evaluatedAgo: "42m ago", precision: "96.5%", active: true },
  { id: 5, name: "Authority Boost", category: "Authority", kind: "positive", icon: "shieldCheck", points: 15, conditionIf: 'Decision Maker Role is "C-Level / VP / Founder"', matched: 215, evaluatedAgo: "18m ago", precision: "99.1%", active: true },
  { id: 6, name: "Scale Fit", category: "Scale & Volume", kind: "positive", icon: "chartLineUp", points: 10, conditionIf: "Monthly Website Traffic > 50,000 visits", matched: 98, evaluatedAgo: "2h ago", precision: "97.8%", active: true },
];

function RuleLogicRow({ rule }: { rule: ScoringRule }) {
  const toneBg = rule.kind === "penalty" ? "#fdeced" : "#e5f6f3";
  const toneText = rule.kind === "penalty" ? classColor.Hot : "#12A594";
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[7px] border border-[#ececef] p-3 text-[12px] text-[#1c1c1f]">
      <span className="rounded px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: ACCENT }}>IF</span>
      <span className="rounded-[6px] border border-[#ececef] bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-[#1c1c1f]">{rule.conditionIf}</span>
      {rule.conditionAnd && (
        <>
          <span className="rounded bg-[#f2f2f4] px-2 py-0.5 text-[10px] font-bold text-[#3d3e44]">AND</span>
          <span className="rounded-[6px] border border-[#ececef] bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-[#1c1c1f]">{rule.conditionAnd}</span>
        </>
      )}
      <span className="rounded px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: "#12A594" }}>THEN</span>
      <span className="rounded-[6px] px-2.5 py-1 text-[11px] font-bold" style={{ background: toneBg, color: toneText }}>{thenLabel(rule)}</span>
      {rule.note && (
        <>
          <span className="rounded bg-[#f2f2f4] px-2 py-0.5 text-[10px] font-bold text-[#3d3e44]">AND</span>
          <span className="flex items-center gap-1.5 rounded-[6px] border border-[#ececef] bg-white px-2.5 py-1 text-[11px] font-medium text-[#1c1c1f]">
            <Megaphone size={14} style={{ color: classColor.Hot }} />
            {rule.note.prefix}<b className="font-bold" style={{ color: ACCENT }}>{rule.note.highlight}</b>{rule.note.suffix}
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
    <div className="flex flex-col gap-3 rounded-[10px] border border-[#ececef] bg-white p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {reorderMode ? (
            <div className="flex flex-col">
              <button type="button" disabled={!canMoveUp} onClick={onMoveUp} aria-label={`Move ${rule.name} up in priority`} className="text-[#6b6d76] hover:text-[#1c1c1f] disabled:opacity-30"><CaretUp size={14} /></button>
              <button type="button" disabled={!canMoveDown} onClick={onMoveDown} aria-label={`Move ${rule.name} down in priority`} className="text-[#6b6d76] hover:text-[#1c1c1f] disabled:opacity-30"><CaretDown size={14} /></button>
            </div>
          ) : (
            <DotsSixVertical size={18} className="text-[#c7c8d1]" />
          )}
          <span className="rounded-[6px] bg-[#f2f2f4] px-2 py-0.5 text-[10px] font-bold uppercase text-[#3d3e44]">Priority #{priority}</span>
          <span className="rounded-full bg-[#f2f2f4] px-2 py-0.5 text-[10px] font-medium text-[#3d3e44]">{rule.category}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ background: style.bg, color: style.text }}><Icon size={12} />{tagLabel(rule)}</span>
          <ToggleSwitch checked={rule.active} onChange={onToggleActive} label={`Toggle ${rule.name}`} />
          <div className="relative">
            <button type="button" onClick={onToggleMenu} aria-label={`More actions for ${rule.name}`} className="rounded-[6px] p-1 text-[#6b6d76] hover:bg-[#f2f2f4] hover:text-[#1c1c1f]"><DotsThree weight="bold" size={18} /></button>
            {menuOpen && (
              <div className="reg-pop-fast absolute right-0 top-8 z-10 w-36 overflow-hidden rounded-[10px] border border-[#e2e2e6] bg-white py-1 shadow-[0_16px_40px_rgba(20,20,25,0.14)]">
                <button type="button" onClick={onDelete} className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-[11px] font-semibold hover:bg-[#fdeced]" style={{ color: classColor.Hot }}><Trash size={13} />Delete Rule</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <RuleLogicRow rule={rule} />

      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11px] text-[#6b6d76]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1"><CheckCircle weight="fill" size={13} style={{ color: "#12A594" }} /><span className="font-semibold text-[#1c1c1f]">{rule.matched} leads matched</span></span>
          {rule.capturePercent && <span>({rule.capturePercent})</span>}
          <span>•</span><span>Evaluated {rule.evaluatedAgo}</span><span>•</span><span className="font-semibold" style={{ color: "#12A594" }}>{rule.precision} precision</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onEdit} className="font-semibold text-[#6b6d76] hover:text-[#1c1c1f]">Edit</button>
          <span>•</span>
          <button type="button" onClick={onDuplicate} className="font-semibold text-[#6b6d76] hover:text-[#1c1c1f]">Duplicate</button>
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default" />
      <aside className="reg-pop relative flex h-full w-full max-w-md flex-col gap-5 overflow-y-auto border-l border-[#e2e2e6] bg-white p-6 shadow-[0_16px_40px_rgba(20,20,25,0.14)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#f2f2f4]" style={{ color: ACCENT }}><Gauge size={18} /></span>
            <div><h2 className="text-[15px] font-extrabold text-[#1c1c1f]">{initial ? "Edit Scoring Rule" : "Add Scoring Rule"}</h2><p className="text-[11px] text-[#6b6d76]">Define the condition, category, and point impact</p></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-[6px] p-1 text-[#6b6d76] hover:bg-[#f2f2f4]"><X size={16} /></button>
        </div>

        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#1c1c1f]">Rule Name
          <input name="ruleName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. High Velocity" className="rounded-[7px] border border-[#e2e2e6] px-3 py-2 text-[13px] font-medium text-[#1c1c1f] outline-none focus:border-[#3E63DD]" />
        </label>

        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#1c1c1f]">Category
          <select name="ruleCategory" value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-[7px] border border-[#e2e2e6] px-3 py-2 text-[13px] font-medium text-[#1c1c1f] outline-none focus:border-[#3E63DD]">
            {ruleCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#1c1c1f]">Rule Type
            <select name="ruleKind" value={kind} onChange={(e) => setKind(e.target.value as ScoringRuleKind)} className="rounded-[7px] border border-[#e2e2e6] px-3 py-2 text-[13px] font-medium text-[#1c1c1f] outline-none focus:border-[#3E63DD]">
              {ruleKindOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#1c1c1f]">Points
            <input name="rulePoints" type="number" min={1} value={points} onChange={(e) => setPoints(Number(e.target.value))} className="rounded-[7px] border border-[#e2e2e6] px-3 py-2 text-[13px] font-medium text-[#1c1c1f] outline-none focus:border-[#3E63DD]" />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#1c1c1f]">Condition (IF)
          <input name="ruleConditionIf" value={conditionIf} onChange={(e) => setConditionIf(e.target.value)} placeholder="e.g. Budget ≥ $200,000" className="rounded-[7px] border border-[#e2e2e6] px-3 py-2 text-[13px] font-medium text-[#1c1c1f] outline-none focus:border-[#3E63DD]" />
        </label>
        <label className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#1c1c1f]">Additional Condition (AND) — optional
          <input name="ruleConditionAnd" value={conditionAnd} onChange={(e) => setConditionAnd(e.target.value)} placeholder="e.g. Timeline is within 30 days" className="rounded-[7px] border border-[#e2e2e6] px-3 py-2 text-[13px] font-medium text-[#1c1c1f] outline-none focus:border-[#3E63DD]" />
        </label>

        <div className="flex items-center justify-between gap-3 rounded-[10px] border border-[#ececef] p-3">
          <div><span className="block text-[12px] font-semibold text-[#1c1c1f]">Rule Active</span><span className="text-[10px] text-[#6b6d76]">Live in the scoring engine immediately</span></div>
          <ToggleSwitch checked={active} onChange={() => setActive((v) => !v)} label="Rule active" />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#6b6d76]">Preview</span>
          <RuleLogicRow rule={previewRule} />
        </div>

        <div className="mt-auto flex items-center justify-end gap-2 border-t border-[#ececef] pt-4">
          <button type="button" onClick={onClose} className="rounded-[7px] border border-[#e2e2e6] px-4 py-2 text-[12px] font-semibold text-[#3d3e44] hover:bg-[#f2f2f4]">Cancel</button>
          <button type="button" onClick={save} className="rounded-[7px] px-5 py-2 text-[12px] font-bold text-white hover:opacity-90" style={{ background: ACCENT }}>{initial ? "Save Changes" : "Add Rule"}</button>
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
    <div className="flex flex-col gap-4 rounded-[10px] border border-[#ececef] bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13.5px] font-extrabold text-[#1c1c1f]"><SlidersHorizontal size={17} style={{ color: ACCENT }} />Lead Temperature Thresholds</span>
        <button type="button" onClick={() => setEditing((v) => !v)} aria-label="Edit temperature thresholds" aria-pressed={editing} className="rounded-[6px] p-1" style={editing ? { background: "#eef1fd", color: ACCENT } : { color: "#6b6d76" }}><NotePencil size={16} /></button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-[#6b6d76]">Determines automatic routing and tag assignment based on final cumulative score.</p>
        <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ background: "#12A594" }}>Auto-recalculate</span>
      </div>

      {editing && (
        <div className="flex flex-col gap-2 rounded-[10px] border border-[#ececef] p-3">
          <label className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#3d3e44]">Warm starts at
            <input name="warmThreshold" type="number" min={1} max={hotStart - 1} value={warmStart} onChange={(e) => onChangeWarm(Math.min(hotStart - 1, Math.max(1, Number(e.target.value))))} className="w-16 rounded-[6px] border border-[#e2e2e6] px-2 py-1 text-right text-[12px] font-bold text-[#1c1c1f] outline-none focus:border-[#3E63DD]" />
          </label>
          <label className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#3d3e44]">Hot starts at
            <input name="hotThreshold" type="number" min={warmStart + 1} max={99} value={hotStart} onChange={(e) => onChangeHot(Math.min(99, Math.max(warmStart + 1, Number(e.target.value))))} className="w-16 rounded-[6px] border border-[#e2e2e6] px-2 py-1 text-right text-[12px] font-bold text-[#1c1c1f] outline-none focus:border-[#3E63DD]" />
          </label>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex h-7 w-full overflow-hidden rounded-full bg-[#f2f2f4]">
          <div className="flex items-center justify-center whitespace-nowrap text-[10px] font-semibold text-white" style={{ width: `${warmStart}%`, background: classColor.Cold }}>Cold (0-{warmStart - 1})</div>
          <div className="flex items-center justify-center whitespace-nowrap text-[10px] font-semibold text-white" style={{ width: `${hotStart - warmStart}%`, background: classColor.Warm }}>Warm ({warmStart}-{hotStart - 1})</div>
          <div className="flex items-center justify-center whitespace-nowrap text-[10px] font-bold text-white" style={{ width: `${100 - hotStart}%`, background: classColor.Hot }}>Hot ({hotStart}+)</div>
        </div>
        <div className="flex items-center justify-between px-1 text-[10px] text-[#6b6d76]">
          <span>0</span><span className="font-bold text-[#1c1c1f]">{warmStart}</span><span className="font-bold" style={{ color: classColor.Hot }}>{hotStart}</span><span>100</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between rounded-[10px] border border-[#ececef] p-2.5">
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: classColor.Cold }} /><div><span className="block text-[12px] font-semibold text-[#1c1c1f]">Cold / Nurture Queue</span><span className="text-[10px] text-[#6b6d76]">Score 0 – {warmStart - 1}</span></div></div>
          <div className="text-right"><span className="block text-[12px] font-bold text-[#1c1c1f]">{coldPct}%</span><span className="text-[10px] text-[#6b6d76]">of volume</span></div>
        </div>
        <div className="flex items-center justify-between rounded-[10px] border border-[#ececef] p-2.5">
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: classColor.Warm }} /><div><span className="block text-[12px] font-semibold text-[#1c1c1f]">Warm / SDR Sequence</span><span className="text-[10px] text-[#6b6d76]">Score {warmStart} – {hotStart - 1}</span></div></div>
          <div className="text-right"><span className="block text-[12px] font-bold text-[#1c1c1f]">{warmPct}%</span><span className="text-[10px] text-[#6b6d76]">of volume</span></div>
        </div>
        <div className="flex items-center justify-between rounded-[10px] p-2.5" style={{ background: "#fdeced" }}>
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: classColor.Hot }} /><div><span className="block text-[12px] font-semibold text-[#1c1c1f]">Hot / Direct Booking</span><span className="text-[10px] text-[#6b6d76]">Score {hotStart} – 100</span></div></div>
          <div className="text-right"><span className="block text-[12px] font-bold" style={{ color: classColor.Hot }}>{hotPct}%</span><span className="text-[10px] text-[#6b6d76]">of volume</span></div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-[10px] border border-[#ececef] p-3 text-[11px] text-[#6b6d76]">
        <Timer size={16} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
        <span><b className="font-semibold text-[#1c1c1f]">SLA Commitment:</b> Hot leads trigger automatic distribution requiring agent outreach within <span className="font-bold" style={{ color: classColor.Hot }}>15 minutes</span>.</span>
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
    if (isActive(1) && budget >= 200000 && timelineDays <= 30) lines.push({ label: "Budget (≥ $200K) & Timeline (≤ 30d)", points: 25 });
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
  const tierStyle = tier === "Hot" ? { bg: "#fdeced", text: classColor.Hot } : tier === "Warm" ? { bg: "#fef3e2", text: classColor.Warm } : { bg: "#f2f2f4", text: "#3d3e44" };

  return (
    <div className="flex flex-col gap-4 rounded-[10px] border border-[#ececef] bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13.5px] font-extrabold text-[#1c1c1f]"><PlayCircle weight="fill" size={18} style={{ color: ACCENT }} />Test Score Simulator</span>
        <span className="rounded-full bg-[#f2f2f4] px-2.5 py-0.5 text-[10px] font-semibold text-[#3d3e44]">Sample {preset.name}</span>
      </div>

      <div className="flex flex-col gap-2 rounded-[10px] border border-[#ececef] p-3">
        <span className="text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">Candidate Inputs</span>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-[10px] font-medium text-[#6b6d76]">Budget ($)
            <input name="simBudget" type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="rounded-[6px] border border-[#e2e2e6] px-2 py-1 text-[12px] font-semibold text-[#1c1c1f] outline-none focus:border-[#3E63DD]" />
          </label>
          <label className="flex flex-col gap-1 text-[10px] font-medium text-[#6b6d76]">Timeline (days)
            <input name="simTimeline" type="number" value={timelineDays} onChange={(e) => setTimelineDays(Number(e.target.value))} className="rounded-[6px] border border-[#e2e2e6] px-2 py-1 text-[12px] font-semibold text-[#1c1c1f] outline-none focus:border-[#3E63DD]" />
          </label>
          <label className="flex flex-col gap-1 text-[10px] font-medium text-[#6b6d76]">Service
            <select name="simService" value={service} onChange={(e) => setService(e.target.value)} className="rounded-[6px] border border-[#e2e2e6] px-2 py-1 text-[12px] font-semibold text-[#1c1c1f] outline-none focus:border-[#3E63DD]">
              {serviceOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[10px] font-medium text-[#6b6d76]">Intent
            <select name="simIntent" value={intent} onChange={(e) => setIntent(e.target.value)} className="rounded-[6px] border border-[#e2e2e6] px-2 py-1 text-[12px] font-semibold text-[#1c1c1f] outline-none focus:border-[#3E63DD]">
              {intentOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[10px] font-medium text-[#6b6d76]">Authority
            <select name="simAuthority" value={authority} onChange={(e) => setAuthority(e.target.value)} className="rounded-[6px] border border-[#e2e2e6] px-2 py-1 text-[12px] font-semibold text-[#1c1c1f] outline-none focus:border-[#3E63DD]">
              {authorityOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[10px] font-medium text-[#6b6d76]">Location
            <select name="simLocation" value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-[6px] border border-[#e2e2e6] px-2 py-1 text-[12px] font-semibold text-[#1c1c1f] outline-none focus:border-[#3E63DD]">
              {locationOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-[10px] bg-[#fafafb] p-4">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">Simulated Score</span>
          <div className="flex items-baseline gap-1"><span className="text-[28px] font-extrabold text-[#1c1c1f]">{total}</span><span className="text-[13px] text-[#6b6d76]">/ 100</span></div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-bold" style={{ background: tierStyle.bg, color: tierStyle.text }}><Fire weight="fill" size={14} />{tier.toUpperCase()} LEAD</span>
          <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "#12A594" }}><Check weight="bold" size={12} />Auto-Route Qualified</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">Scoring Waterfall Breakdown</span>
        <div className="flex flex-col divide-y divide-[#f2f2f4] text-[12px]">
          {breakdown.map((line, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5">
              <span className={idx === 0 ? "text-[#6b6d76]" : "text-[#1c1c1f]"}>{line.label}</span>
              <span className="font-mono font-bold" style={{ color: line.points < 0 ? classColor.Hot : line.points === 0 ? "#6b6d76" : "#12A594" }}>{line.points > 0 ? "+" : ""}{line.points} pts</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2 font-bold text-[#1c1c1f]">
            <span>Total Calculated Score</span>
            <span className="font-mono text-[13px]" style={{ color: ACCENT }}>{total} pts ({tier} Tier)</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <button type="button" onClick={() => applyPreset((presetIndex + 1) % simulatorPresets.length)} className="flex w-full items-center justify-center gap-1.5 rounded-[7px] border border-[#e2e2e6] py-2 text-[12px] font-semibold text-[#1c1c1f] hover:bg-[#f2f2f4]"><Repeat size={15} />Test Another Lead Record</button>
        <button type="button" onClick={() => notify(`${preset.name} saved as golden benchmark test`)} className="text-center text-[11px] font-semibold hover:underline" style={{ color: ACCENT }}>Save {preset.name} as Golden Benchmark Test</button>
      </div>
    </div>
  );
}

type QualTabKey = "Questions" | "Scoring Rules" | "Classification Thresholds" | "Test Score Sandbox";
const QUAL_BENCHMARK_SCORE = 58;

const knowledgeSources = [
  { icon: LinkSimple, label: "Website URL crawling", detail: "ailqs.com, studio.ailqs.com, property.ailqs.com" },
  { icon: FileText, label: "PDF upload", detail: "3 documents indexed, last updated 2 days ago" },
  { icon: TextAlignLeft, label: "Manual FAQ entries", detail: "18 entries covering pricing, setup, and support" },
];

const setupChecklist = [
  { id: 1, label: "Install the website widget", done: true },
  { id: 2, label: "Connect CRM destination", done: true },
  { id: 3, label: "Define qualification questions", done: true },
  { id: 4, label: "Configure lead scoring rules", done: true },
  { id: 5, label: "Verify webhook endpoint", done: false },
  { id: 6, label: "Invite the rest of the team", done: false },
];

function ClassDot({ c }: { c: Classification }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1c1c1f]">
      <Circle size={9} weight="fill" style={{ color: classColor[c] }} /> {c}
    </span>
  );
}

function Avatar({ initials, size = 22, tint }: { initials: string; size?: number; tint?: string }) {
  return (
    <span
      className="inline-flex flex-none items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.4, background: tint || "#3E4048" }}
    >
      {initials}
    </span>
  );
}

function fieldIcon(kind: string) {
  const props = { size: 13, className: "text-[#6b6d76]" };
  switch (kind) {
    case "text": return <TextAlignLeft {...props} />;
    case "person": return <UserCircle {...props} />;
    case "company": return <Buildings {...props} />;
    case "link": return <LinkSimple {...props} />;
    case "class": return <Circle {...props} />;
    case "hash": return <Hash {...props} />;
    case "status": return <CheckCircle {...props} />;
    case "date": return <CalendarBlank {...props} />;
    case "bool": return <CheckSquare {...props} />;
    case "email": return <At {...props} />;
    case "phone": return <Phone {...props} />;
    default: return null;
  }
}

function inboxTag(lead: Lead) {
  const last = lead.transcript[lead.transcript.length - 1];
  if (lead.classification === "Hot" && lead.status === "New") return { label: "Handoff needed", icon: Warning };
  if (last?.from === "ai") return { label: "AI active", icon: Robot };
  return { label: "Reviewed", icon: CheckCircle };
}

export default function TheRegistry() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeObject, setActiveObject] = useState<ObjectKey>("dashboard");
  const [loading, setLoading] = useState(true);
  const [viewTab, setViewTab] = useState<"all" | "hot" | "warm" | "cold">("all");
  const [followupTab, setFollowupTab] = useState<"Today" | "Upcoming" | "Overdue" | "Completed">("Today");
  const [agentDialogId, setAgentDialogId] = useState<number | null>(null);
  const [agentDraft, setAgentDraft] = useState<{ archetype: string; tones: string[]; length: string; prompt: string } | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [openRecordId, setOpenRecordId] = useState<number | null>(null);
  const [recordTab, setRecordTab] = useState<"overview" | "transcript" | "scoring" | "activity">("overview");
  const [openConversationId, setOpenConversationId] = useState<number | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [replyMode, setReplyMode] = useState<"visitor" | "note">("visitor");
  const [commandOpen, setCommandOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ name: "", company: "", email: "" });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [parcelSyncFailed, setParcelSyncFailed] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const commandInputRef = useRef<HTMLInputElement>(null);

  const [qualQuestions, setQualQuestions] = useState<QualificationQuestion[]>(initialQuestions);
  const [qualQuestionDialogOpen, setQualQuestionDialogOpen] = useState(false);
  const [qualTab, setQualTab] = useState<QualTabKey>("Scoring Rules");
  const [qualScoringRules, setQualScoringRules] = useState<ScoringRule[]>(initialScoringRules);
  const qualNextRuleId = useRef(100);
  const [qualRuleDialog, setQualRuleDialog] = useState<{ open: boolean; editing: ScoringRule | null }>({ open: false, editing: null });
  const [qualReorderMode, setQualReorderMode] = useState(false);
  const [qualMenuOpenId, setQualMenuOpenId] = useState<number | null>(null);
  const [qualSearch, setQualSearch] = useState("");
  const [qualCategoryFilter, setQualCategoryFilter] = useState("All Categories");
  const [qualStatusFilter, setQualStatusFilter] = useState<"all" | "active" | "paused">("all");
  const [qualAuditLog, setQualAuditLog] = useState<{ id: number; text: string; time: string }[]>([
    { id: -1, text: "Authority Boost rule precision recalculated", time: "18m ago" },
    { id: -2, text: "Penalty rule threshold reviewed by Maya", time: "42m ago" },
    { id: -3, text: "Qualification engine synced with Widget v2.1", time: "1h ago" },
  ]);
  const [qualAuditOpen, setQualAuditOpen] = useState(false);
  const qualAuditIdRef = useRef(-4);
  const [qualWarmStart, setQualWarmStart] = useState(40);
  const [qualHotStart, setQualHotStart] = useState(70);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCommandOpen(true); }
      if (e.key === "Escape") { setCommandOpen(false); setNotifOpen(false); setUserMenuOpen(false); setNewLeadOpen(false); setDeleteConfirmOpen(false); setAgentDialogId(null); setAgentDraft(null); setQualQuestionDialogOpen(false); setQualRuleDialog({ open: false, editing: null }); setQualAuditOpen(false); setQualMenuOpenId(null); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { if (commandOpen) setTimeout(() => commandInputRef.current?.focus(), 20); }, [commandOpen]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3200); return () => clearTimeout(t); }, [toast]);

  const companies = useMemo(
    () => leads.map((l) => ({ name: l.company, color: l.companyColor, site: l.site, contact: l.name, leadScore: l.score })),
    [leads]
  );

  const filteredLeads = useMemo(() => {
    if (viewTab === "hot") return leads.filter((l) => l.classification === "Hot");
    if (viewTab === "warm") return leads.filter((l) => l.classification === "Warm");
    if (viewTab === "cold") return leads.filter((l) => l.classification === "Cold");
    return leads;
  }, [leads, viewTab]);

  const commandResults = useMemo(() => {
    if (!query.trim()) return leads.slice(0, 5);
    const q = query.toLowerCase();
    return leads.filter((l) => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q)).slice(0, 6);
  }, [leads, query]);

  const followUps = useMemo(() => leads.filter((l) => l.status !== "Qualified"), [leads]);

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

  const avgScore = Math.round(leads.reduce((a, l) => a + l.score, 0) / leads.length);
  const hotCount = leads.filter((l) => l.classification === "Hot").length;
  const warmCount = leads.filter((l) => l.classification === "Warm").length;
  const coldCount = leads.filter((l) => l.classification === "Cold").length;
  const unassignedCount = leads.filter((l) => l.owner === "Unassigned").length;
  const followUpDueCount = leads.filter((l) => l.status === "Contacted").length;

  const nextPriority = useMemo(
    () => leads.find((l) => l.classification === "Hot" && l.status !== "Qualified") ?? leads[0],
    [leads]
  );

  const hotShortlist = useMemo(
    () => leads.filter((l) => l.classification === "Hot").sort((a, b) => b.score - a.score).slice(0, 5),
    [leads]
  );

  const classificationMix = useMemo(() => {
    const buckets: Classification[] = ["Hot", "Warm", "Cold"];
    return buckets
      .map((c) => ({ c, count: leads.filter((l) => l.classification === c).length }))
      .map((b) => ({ ...b, pct: Math.round((b.count / leads.length) * 100) }));
  }, [leads]);

  const statusCounts = useMemo(() => ({
    n: leads.filter((l) => l.status === "New").length,
    c: leads.filter((l) => l.status === "Contacted").length,
    q: leads.filter((l) => l.status === "Qualified").length,
  }), [leads]);

  const openRecord = openRecordId !== null ? leads.find((l) => l.id === openRecordId) ?? null : null;
  const unreadCount = notifications.filter((n) => n.unread).length;

  function toggleSelect(id: number) {
    setSelected((cur) => { const next = new Set(cur); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }
  function toggleSelectAll() {
    setSelected((cur) => (cur.size === filteredLeads.length ? new Set() : new Set(filteredLeads.map((l) => l.id))));
  }
  function openLeadRecord(id: number) { setOpenRecordId(id); setRecordTab("overview"); setActiveObject("leads"); }
  function closeRecord() { setOpenRecordId(null); }
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
    setToast(`${lead.name} marked complete`);
  }
  function advanceStage(lead: Lead) {
    const next = nextStage[lead.status];
    setLeads((cur) => cur.map((l) => (l.id === lead.id ? { ...l, status: next } : l)));
    setToast(next === lead.status ? `${lead.name} is already Qualified` : `${lead.name} advanced to ${next}`);
  }
  function toggleFavorite(id: number) {
    setLeads((cur) => cur.map((l) => (l.id === id ? { ...l, favorite: !l.favorite } : l)));
  }
  function bulkAssignToMe() {
    const n = selected.size;
    setLeads((cur) => cur.map((l) => (selected.has(l.id) ? { ...l, owner: "You", ownerInitials: "Y" } : l)));
    setToast(`${n} lead${n === 1 ? "" : "s"} assigned to you`);
    setSelected(new Set());
  }
  function bulkAdvanceStage() {
    const n = selected.size;
    setLeads((cur) => cur.map((l) => (selected.has(l.id) ? { ...l, status: nextStage[l.status] } : l)));
    setToast(`${n} lead${n === 1 ? "" : "s"} advanced a stage`);
    setSelected(new Set());
  }
  function submitNewLead(e: React.FormEvent) {
    e.preventDefault();
    if (!newLeadForm.name.trim() || !newLeadForm.company.trim()) return;
    const id = Math.max(...leads.map((l) => l.id)) + 1;
    setLeads((cur) => [
      {
        id, name: newLeadForm.name, initials: newLeadForm.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
        company: newLeadForm.company, companyColor: "#3E63DD", site: "—", classification: "Cold", score: 20,
        owner: "Unassigned", ownerInitials: "?", status: "New", received: "just now", consented: true,
        followup: "Not set",
        interest: "General enquiry", email: newLeadForm.email || "—", phone: "—", transcript: [], scoring: [], nextAction: "No qualification data yet.",
        role: "—", location: "—", linkedin: "—", companyMeta: "Not yet enriched", companySize: "—", techStack: [],
      },
      ...cur,
    ]);
    setNewLeadOpen(false);
    setNewLeadForm({ name: "", company: "", email: "" });
    setToast(`${newLeadForm.name} added to the registry`);
  }
  function confirmDelete() {
    setLeads((cur) => cur.filter((l) => !selected.has(l.id)));
    setToast(`${selected.size} lead${selected.size === 1 ? "" : "s"} deleted`);
    setSelected(new Set());
    setDeleteConfirmOpen(false);
  }
  function retrySync() {
    setSyncing(true);
    setTimeout(() => { setSyncing(false); setParcelSyncFailed(false); setToast("Parcel Grid synced successfully"); }, 1000);
  }
  function openFromCommand(lead: Lead) {
    setCommandOpen(false); setQuery("");
    openLeadRecord(lead.id);
    setOpenConversationId(null);
  }
  function navigateFromCommand(obj: typeof activeObject) {
    setCommandOpen(false); setQuery(""); setActiveObject(obj); setOpenRecordId(null); setOpenConversationId(null);
  }

  function qualLogAudit(text: string) {
    setQualAuditLog((cur) => [{ id: qualAuditIdRef.current--, text, time: "Just now" }, ...cur]);
  }
  function handleSaveQualQuestion(question: QualificationQuestion) {
    setQualQuestions((cur) => [...cur, question]);
    setToast(`${question.label} added to qualification flow`);
    qualLogAudit(`Added question "${question.label}"`);
    setQualQuestionDialogOpen(false);
  }
  function toggleQualRuleActive(rule: ScoringRule) {
    setQualScoringRules((cur) => cur.map((r) => (r.id === rule.id ? { ...r, active: !r.active } : r)));
    qualLogAudit(`${rule.active ? "Paused" : "Activated"} rule "${rule.name}"`);
  }
  function openCreateQualRule() {
    setQualTab("Scoring Rules");
    setQualRuleDialog({ open: true, editing: null });
  }
  function openEditQualRule(rule: ScoringRule) {
    setQualRuleDialog({ open: true, editing: rule });
  }
  function saveQualRule(rule: ScoringRule) {
    if (qualRuleDialog.editing) {
      setQualScoringRules((cur) => cur.map((r) => (r.id === rule.id ? rule : r)));
      setToast(`${rule.name} updated`);
      qualLogAudit(`Edited rule "${rule.name}"`);
    } else {
      const newRule: ScoringRule = { ...rule, id: qualNextRuleId.current++ };
      setQualScoringRules((cur) => [...cur, newRule]);
      setToast(`${rule.name} added to scoring engine`);
      qualLogAudit(`Added new rule "${rule.name}"`);
    }
    setQualRuleDialog({ open: false, editing: null });
  }
  function duplicateQualRule(rule: ScoringRule) {
    const copy: ScoringRule = { ...rule, id: qualNextRuleId.current++, name: `${rule.name} (Copy)`, matched: 0, evaluatedAgo: "Just now" };
    setQualScoringRules((cur) => {
      const idx = cur.findIndex((r) => r.id === rule.id);
      const next = [...cur];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    setToast(`${rule.name} duplicated`);
    qualLogAudit(`Duplicated rule "${rule.name}"`);
    setQualMenuOpenId(null);
  }
  function deleteQualRule(rule: ScoringRule) {
    setQualScoringRules((cur) => cur.filter((r) => r.id !== rule.id));
    setToast(`${rule.name} deleted`);
    qualLogAudit(`Deleted rule "${rule.name}"`);
    setQualMenuOpenId(null);
  }
  function moveQualRule(rule: ScoringRule, direction: -1 | 1) {
    setQualScoringRules((cur) => {
      const idx = cur.findIndex((r) => r.id === rule.id);
      const swapIdx = idx + direction;
      if (swapIdx < 0 || swapIdx >= cur.length) return cur;
      const next = [...cur];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
    qualLogAudit(`Reordered "${rule.name}" priority`);
    setToast(`${rule.name} priority updated`);
  }

  const qualCategories = useMemo(() => Array.from(new Set(qualScoringRules.map((r) => r.category))), [qualScoringRules]);
  const qualFilteredRules = useMemo(() => {
    const q = qualSearch.trim().toLowerCase();
    return qualScoringRules.filter((r) => {
      if (qualCategoryFilter !== "All Categories" && r.category !== qualCategoryFilter) return false;
      if (qualStatusFilter === "active" && !r.active) return false;
      if (qualStatusFilter === "paused" && r.active) return false;
      if (!q) return true;
      const haystack = [r.name, r.category, r.conditionIf, r.conditionAnd ?? "", r.note?.highlight ?? ""].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [qualScoringRules, qualSearch, qualCategoryFilter, qualStatusFilter]);
  const qualActiveCount = qualScoringRules.filter((r) => r.active).length;
  const qualPositiveCount = qualScoringRules.filter((r) => r.kind === "positive" || r.kind === "highlight").length;
  const qualPenaltyCount = qualScoringRules.filter((r) => r.kind === "penalty").length;
  const qualAlertCount = qualScoringRules.filter((r) => r.kind === "alert").length;
  const qualTierPct = useMemo(() => {
    const scores = leads.map((l) => l.score);
    const total = scores.length || 1;
    const cold = scores.filter((s) => s < qualWarmStart).length;
    const hot = scores.filter((s) => s >= qualHotStart).length;
    const warm = total - cold - hot;
    return { cold: Math.round((cold / total) * 100), warm: Math.round((warm / total) * 100), hot: Math.round((hot / total) * 100) };
  }, [leads, qualWarmStart, qualHotStart]);
  const qualAvgScore = useMemo(() => leads.reduce((sum, l) => sum + l.score, 0) / (leads.length || 1), [leads]);
  const qualTabs: { key: QualTabKey; label: string; count?: number }[] = [
    { key: "Questions", label: "Questions", count: qualQuestions.length },
    { key: "Scoring Rules", label: "Scoring Rules", count: qualScoringRules.length },
    { key: "Classification Thresholds", label: "Classification Thresholds" },
    { key: "Test Score Sandbox", label: "Test Score Sandbox" },
  ];

  return (
    <div className="reg-shell flex min-h-dvh bg-white text-[#1c1c1f]">
      {/* Sidebar */}
      <aside
        inert={!isDesktop && !mobileNavOpen}
        className={`fixed inset-y-0 left-0 z-30 w-[232px] flex-none border-r border-[#ececef] bg-[#fbfbfc] transition-transform md:static md:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 px-3 py-3.5">
            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-[7px] bg-[#1c1c1f] text-white"><Command size={14} weight="bold" /></span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-bold">AILQS</div>
              <div className="truncate text-[10px] text-[#6b6d76]">The Registry</div>
            </div>
            <CaretDown size={13} className="flex-none text-[#6b6d76]" />
            <button onClick={() => setMobileNavOpen(false)} className="ml-1 flex h-6 w-6 flex-none items-center justify-center rounded-[6px] text-[#6b6d76] hover:bg-[#efeff1] md:hidden"><X size={14} /></button>
          </div>

          <div className="px-2">
            <button onClick={() => setCommandOpen(true)} className="flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-left text-[12.5px] text-[#62636c] hover:bg-[#efeff1]">
              <MagnifyingGlass size={14} /> Search <kbd className="ml-auto rounded border border-[#e2e2e6] bg-white px-1.5 py-0.5 text-[9px] text-[#6b6d76]">⌘K</kbd>
            </button>
          </div>

          <div className="mt-4 px-2">
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">Favorites</div>
            {leads.filter((l) => l.favorite).map((l) => (
              <button key={l.id} onClick={() => { openLeadRecord(l.id); setMobileNavOpen(false); }} className="flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-left text-[12.5px] text-[#62636c] hover:bg-[#efeff1]">
                <span className="h-3.5 w-3.5 flex-none rounded-[4px]" style={{ background: l.companyColor }} />
                <span className="truncate">{l.name}</span>
              </button>
            ))}
            <button onClick={() => { setActiveObject("companies"); setOpenRecordId(null); setMobileNavOpen(false); }} className="flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-left text-[12.5px] text-[#62636c] hover:bg-[#efeff1]">
              <span className="h-3.5 w-3.5 flex-none rounded-[4px]" style={{ background: companies[0]?.color }} />
              <span className="truncate">{companies[0]?.name}</span>
            </button>
          </div>

          <div className="mt-4 flex-1 overflow-auto px-2">
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">Workspace</div>
            {workspaceNav.map(([key, label, Icon]) => {
              const active = activeObject === key;
              return (
                <button key={key} onClick={() => { setActiveObject(key); setOpenRecordId(null); setOpenConversationId(null); setMobileNavOpen(false); }} className={`flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-left text-[12.5px] hover:bg-[#efeff1] ${active ? "bg-[#efeff1] font-semibold text-[#1c1c1f]" : "text-[#62636c]"}`}>
                  <Icon size={14} weight={active ? "fill" : "regular"} /> {label}
                  <span className="ml-auto text-[10px] text-[#6b6d76]">{key === "leads" ? leads.length : key === "companies" ? companies.length : key === "agent" ? agents.length : ""}</span>
                </button>
              );
            })}
            <button className="mt-0.5 flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-left text-[12.5px] text-[#6b6d76] hover:bg-[#efeff1]"><Plus size={14} /> Add object</button>

            <div className="mb-1 mt-5 px-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">Administration</div>
            {adminNav.map(([key, label, Icon]) => {
              const active = activeObject === key;
              return (
                <button key={key} onClick={() => { setActiveObject(key); setOpenRecordId(null); setOpenConversationId(null); setMobileNavOpen(false); }} className={`flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-left text-[12.5px] hover:bg-[#efeff1] ${active ? "bg-[#efeff1] font-semibold text-[#1c1c1f]" : "text-[#62636c]"}`}>
                  <Icon size={14} weight={active ? "fill" : "regular"} />
                  <span className="flex-1">{label}</span>
                  {key === "notifications" && unreadCount > 0 && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#E5484D] text-[9px] font-bold text-white">{unreadCount}</span>}
                </button>
              );
            })}
          </div>

          <div className="border-t border-[#ececef] px-2 py-2">
            <button onClick={() => { setActiveObject("help"); setOpenRecordId(null); setMobileNavOpen(false); }} className={`flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-left text-[12.5px] hover:bg-[#efeff1] ${activeObject === "help" ? "bg-[#efeff1] font-semibold text-[#1c1c1f]" : "text-[#62636c]"}`}>
              <Lifebuoy size={14} weight={activeObject === "help" ? "fill" : "regular"} /> Help &amp; Support
            </button>
          </div>

          <div className="relative border-t border-[#ececef] px-2 py-2">
            <button onClick={() => { setUserMenuOpen((v) => !v); setNotifOpen(false); }} className="flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-left hover:bg-[#efeff1]">
              <Avatar initials="Y" tint="#3E63DD" size={24} />
              <span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-semibold">You</span><span className="block truncate text-[10px] text-[#6b6d76]">Workspace admin</span></span>
              <CaretDown size={12} className="flex-none text-[#6b6d76]" />
            </button>
            {userMenuOpen && (
              <div className="reg-pop-fast absolute bottom-full left-2 z-40 mb-1 w-48 rounded-[10px] border border-[#e2e2e6] bg-white p-1 shadow-[0_16px_40px_rgba(20,20,25,0.14)]">
                <button className="flex w-full items-center gap-2 rounded-[7px] px-2.5 py-2 text-left text-[12px] hover:bg-[#efeff1]"><UserCircle size={14} /> Account</button>
                <button className="flex w-full items-center gap-2 rounded-[7px] px-2.5 py-2 text-left text-[12px] hover:bg-[#efeff1]"><SignOut size={14} /> Sign out</button>
              </div>
            )}
          </div>
        </div>
      </aside>
      {mobileNavOpen && <button aria-label="Close menu" onClick={() => setMobileNavOpen(false)} className="fixed inset-0 z-20 bg-black/30 md:hidden" />}

      {/* Main */}
      <div className="min-w-0 flex-1 md:ml-[232px]">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b border-[#ececef] bg-white/95 px-4 backdrop-blur">
          <button onClick={() => setMobileNavOpen(true)} className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#62636c] hover:bg-[#efeff1] md:hidden"><GridFour size={15} /></button>
          {openRecord ? (
            <button onClick={closeRecord} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#62636c] hover:text-[#1c1c1f]"><ArrowLeft size={14} /> Leads</button>
          ) : (
            <>
              {(() => { const Icon = objectIcon[activeObject]; return <Icon size={16} weight="fill" />; })()}
              <h1 className="text-[13.5px] font-bold">{objectLabel[activeObject]}</h1>
              <span className="rounded-full bg-[#efeff1] px-1.5 py-0.5 text-[10px] font-semibold text-[#62636c]">
                {activeObject === "leads" ? leads.length : activeObject === "companies" ? companies.length : activeObject === "agent" ? agents.length : ""}
              </span>
            </>
          )}
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center sm:flex">
              {leads.slice(0, 3).map((l, i) => <span key={l.id} style={{ marginLeft: i === 0 ? 0 : -6 }}><Avatar initials={l.ownerInitials} tint={l.companyColor} size={22} /></span>)}
            </div>
            <div className="relative">
              <button onClick={() => { setNotifOpen((v) => !v); setUserMenuOpen(false); }} className="relative flex h-7 w-7 items-center justify-center rounded-[6px] text-[#62636c] hover:bg-[#efeff1]">
                <Bell size={15} />
                {unreadCount > 0 && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#E5484D]" />}
              </button>
              {notifOpen && (
                <div className="reg-pop-fast absolute right-0 top-9 z-40 w-72 rounded-[10px] border border-[#e2e2e6] bg-white shadow-[0_16px_40px_rgba(20,20,25,0.14)]">
                  <div className="flex items-center justify-between border-b border-[#ececef] px-3 py-2.5"><span className="text-[11px] font-bold uppercase tracking-wide text-[#62636c]">Notifications</span></div>
                  <div className="max-h-72 overflow-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`border-b border-[#f2f2f4] px-3 py-2.5 text-left last:border-0 ${n.unread ? "bg-[#f7f8fd]" : ""}`}>
                        <div className="flex items-baseline justify-between gap-2"><b className="text-[11.5px]">{n.title}</b><span className="flex-none text-[9px] text-[#6b6d76]">{n.time}</span></div>
                        <p className="mt-1 text-[11px] leading-snug text-[#62636c]">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {activeObject === "leads" && !openRecord && (
              <button onClick={() => setNewLeadOpen(true)} className="flex h-7 w-7 items-center justify-center rounded-full text-white hover:opacity-90" style={{ background: ACCENT }}><Plus size={15} weight="bold" /></button>
            )}
            <button onClick={() => setCommandOpen(true)} className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#62636c] hover:bg-[#efeff1]"><DotsThree size={16} weight="bold" /></button>
          </div>
        </div>

        {/* Lead record view */}
        {openRecord && (
          <div className="reg-pop px-4 py-5 md:px-8">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar initials={openRecord.initials} size={44} tint={openRecord.companyColor} />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[19px] font-extrabold tracking-tight">{openRecord.name}</h2>
                    <button onClick={() => toggleFavorite(openRecord.id)}><Star size={16} weight={openRecord.favorite ? "fill" : "regular"} style={{ color: openRecord.favorite ? "#F5A623" : "#c7c8d1" }} /></button>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[12px] text-[#62636c]">
                    <span className="h-3 w-3 rounded-[3px]" style={{ background: openRecord.companyColor }} /> {openRecord.company} <span className="text-[#c7c8d1]">·</span> <ClassDot c={openRecord.classification} />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#6b6d76]">
                    <span><b className="text-[#1c1c1f]">{openRecord.role}</b> · {openRecord.location}</span>
                    <span className="text-[#c7c8d1]">·</span>
                    <a href={`https://${openRecord.linkedin}`} onClick={(e) => e.preventDefault()} className="hover:text-[#1c1c1f] hover:underline" style={{ color: ACCENT }}>{openRecord.linkedin}</a>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#e2e2e6] px-2.5 py-1 font-mono text-[13px] font-bold">[{openRecord.score}]</span>
                <button onClick={() => advanceStage(openRecord)} className="flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[11.5px] font-bold text-white hover:opacity-90" style={{ background: ACCENT }}>
                  Advance stage <CaretRight size={12} />
                </button>
              </div>
            </div>

            <div className="mb-5 flex gap-1 border-b border-[#ececef]">
              {([["overview", "Overview", FileText], ["transcript", "Transcript", EnvelopeSimple], ["scoring", "Scoring", Hash], ["activity", "Activity", Clock]] as const).map(([key, label, Icon]) => (
                <button key={key} onClick={() => setRecordTab(key)} className={`relative flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold ${recordTab === key ? "text-[#1c1c1f]" : "text-[#6b6d76] hover:text-[#1c1c1f]"}`}>
                  <Icon size={13} /> {label}
                  {recordTab === key && <span className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full" style={{ background: ACCENT }} />}
                </button>
              ))}
            </div>

            {recordTab === "overview" && (
              <div className="space-y-5">
                <div className="rounded-[10px] border border-[#ececef] p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-[#6b6d76]"><Sparkle size={12} /> Executive summary</div>
                  <p className="max-w-[70ch] text-[13px] leading-relaxed">{openRecord.name} at {openRecord.company} is exploring {openRecord.interest.toLowerCase()}, currently {openRecord.status.toLowerCase()}{openRecord.consented ? " with consent on file" : ""}.</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {openRecord.scoring.map((s) => (
                      <span key={s.label} className="rounded-full border border-[#e2e2e6] px-2.5 py-1 text-[10px] font-bold text-[#3d3e44]">{s.label} · {s.points}/{s.max}</span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                  <div className="space-y-5">
                    <div className="divide-y divide-[#f2f2f4] rounded-[10px] border border-[#ececef]">
                      {[
                        { icon: "email", label: "Email", value: openRecord.email },
                        { icon: "phone", label: "Phone", value: openRecord.phone },
                        { icon: "company", label: "Company", value: openRecord.company },
                        { icon: "link", label: "Site", value: openRecord.site },
                        { icon: "person", label: "Owner", value: openRecord.owner },
                        { icon: "status", label: "Status", value: openRecord.status },
                        { icon: "class", label: "Classification", value: openRecord.classification },
                        { icon: "hash", label: "Score", value: String(openRecord.score) },
                        { icon: "date", label: "Received", value: openRecord.received },
                        { icon: "bool", label: "Consented", value: openRecord.consented ? "Yes" : "No" },
                      ].map((f) => (
                        <div key={f.label} className="group flex items-center gap-3 px-3.5 py-2.5">
                          <span className="flex w-32 flex-none items-center gap-2 text-[11.5px] text-[#6b6d76]">{fieldIcon(f.icon)} {f.label}</span>
                          <span className="flex-1 truncate text-[12.5px] font-medium">{f.value}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">Qualification framework</span>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">{openRecord.scoring.filter((s) => s.points / s.max >= 0.7).length} of {openRecord.scoring.length} verified</span>
                      </div>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {openRecord.scoring.map((s) => (
                          <div key={s.label} className="rounded-[10px] border border-[#ececef] p-3">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">{s.label}</span>
                              {s.points / s.max >= 0.7 ? <CheckCircle size={14} weight="fill" style={{ color: "#12A594" }} /> : <Circle size={14} className="text-[#c7c8d1]" />}
                            </div>
                            <p className="text-[11.5px] leading-snug text-[#3d3e44]">{s.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                <div className="space-y-3">
                  <div className="rounded-[10px] border border-[#ececef] p-3.5">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]"><Sparkle size={12} /> Next action</div>
                    <p className="text-[12.5px] leading-relaxed">{openRecord.nextAction}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ececef] p-3.5">
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]"><Buildings size={12} /> Company profile</div>
                    <b className="text-[12.5px]">{openRecord.company}</b>
                    <p className="mt-0.5 text-[11px] text-[#6b6d76]">{openRecord.companyMeta}</p>
                    <div className="mt-2.5 flex items-center justify-between border-t border-[#f2f2f4] pt-2.5 text-[11px]">
                      <span className="text-[#6b6d76]">Company size</span>
                      <span className="font-bold">{openRecord.companySize}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {openRecord.techStack.map((t) => (
                        <span key={t} className="rounded-[6px] border border-[#ececef] px-2 py-0.5 text-[10px] font-bold text-[#3d3e44]">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[10px] border border-[#ececef] p-3.5">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">Recent activity</div>
                    <div className="space-y-2.5">
                      {openRecord.transcript.slice(-2).map((m, i) => (
                        <div key={i} className="text-[11.5px]"><b>{m.author}</b> <span className="text-[#6b6d76]">{m.time}</span><p className="mt-0.5 text-[#62636c]">{m.text}</p></div>
                      ))}
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}

            {recordTab === "transcript" && (
              <div className="max-w-[70ch] space-y-3">
                {openRecord.transcript.map((m, i) => (
                  <div key={i} className="flex gap-3 text-[12px]">
                    <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: m.from === "ai" ? "#1c1c1f" : openRecord.companyColor }}>
                      {m.from === "ai" ? <Robot size={12} /> : m.author.slice(0, 1)}
                    </div>
                    <div><div className="flex items-baseline gap-2"><b>{m.author}</b><span className="text-[10px] text-[#6b6d76]">{m.time}</span></div><p className="mt-0.5 leading-relaxed text-[#3d3e44]">{m.text}</p></div>
                  </div>
                ))}
              </div>
            )}

            {recordTab === "scoring" && (
              <div className="max-w-[54ch] space-y-3">
                {openRecord.scoring.map((s) => (
                  <div key={s.label}>
                    <div className="mb-1 flex justify-between text-[11.5px]"><span>{s.label}</span><span className="font-bold">{s.points}/{s.max}</span></div>
                    <div className="h-1.5 w-full rounded-full bg-[#efeff1]"><div className="h-full rounded-full" style={{ width: `${(s.points / s.max) * 100}%`, background: ACCENT }} /></div>
                  </div>
                ))}
              </div>
            )}

            {recordTab === "activity" && (
              <div className="max-w-[70ch] space-y-3">
                {[...openRecord.transcript, { from: "agent" as const, author: openRecord.owner, time: "now", text: `Note: lead classified ${openRecord.classification} at ${openRecord.score}.` }].map((m, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[11.5px]">
                    <Clock size={13} className="mt-0.5 flex-none text-[#6b6d76]" />
                    <p><b>{m.author}</b> <span className="text-[#6b6d76]">{m.time}</span> — {m.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dashboard */}
        {!openRecord && activeObject === "dashboard" && (
          <div className="px-4 py-4 md:px-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <p className="max-w-[46ch] text-[12px] text-[#62636c]">Understand and convert your website visitors with AI.</p>
              <div className="flex gap-2">
                <button onClick={() => { setActiveObject("leads"); setViewTab("hot"); }} className="flex items-center gap-1.5 rounded-[7px] px-3 py-2 text-[11.5px] font-bold text-white hover:opacity-90" style={{ background: ACCENT }}>
                  <Circle size={10} weight="fill" style={{ color: classColor.Hot }} /> View Hot Leads
                </button>
                <button onClick={() => setToast("Report exported")} className="flex items-center gap-1.5 rounded-[7px] border border-[#e2e2e6] px-3 py-2 text-[11.5px] font-bold text-[#3d3e44] hover:bg-[#f2f2f4]">
                  <ArrowSquareOut size={13} /> Export Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
              <div className="rounded-[10px] border border-[#ececef] p-4"><div className="text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">Total leads</div><div className="mt-2 text-[28px] font-extrabold leading-none">{leads.length}</div></div>
              <div className="rounded-[10px] border border-[#ececef] p-4"><div className="text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">Hot leads</div><div className="mt-2 text-[28px] font-extrabold leading-none">{hotCount}</div></div>
              <div className="rounded-[10px] border border-[#ececef] p-4"><div className="text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">Companies</div><div className="mt-2 text-[28px] font-extrabold leading-none">{companies.length}</div></div>
              <div className="rounded-[10px] border border-[#ececef] p-4"><div className="text-[10px] font-bold uppercase tracking-wide text-[#6b6d76]">Avg. score</div><div className="mt-2 text-[28px] font-extrabold leading-none">{avgScore}</div></div>
            </div>

            {/* Analytics row */}
            <div className="mt-2.5 grid gap-2.5 lg:grid-cols-[1.1fr_.8fr_1fr]">
              <div className="rounded-[10px] border border-[#ececef] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[12.5px] font-bold">Lead Analytics</span>
                  <span className="text-[10px] text-[#6b6d76]">score per lead</span>
                </div>
                <div className="flex h-[140px] items-end gap-2.5">
                  {leads.map((l) => (
                    <div key={l.id} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="flex w-full items-end justify-center" style={{ height: 100 }}>
                        <div className="w-full rounded-t-[3px]" style={{ height: `${l.score}%`, background: l.classification === "Hot" ? ACCENT : "#e2e2e6" }} title={`${l.name} — ${l.score}`} />
                      </div>
                      <span className="truncate text-[9px] text-[#6b6d76]">{l.initials}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-[10px] border border-[#ececef] p-4">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wide text-[#6b6d76]">Next Priority</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Avatar initials={nextPriority.initials} tint={nextPriority.companyColor} size={26} />
                    <div className="min-w-0">
                      <div className="truncate text-[13.5px] font-extrabold leading-tight">{nextPriority.name}</div>
                      <div className="truncate text-[11px] text-[#6b6d76]">{nextPriority.company}</div>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-[#3d3e44]">{nextPriority.nextAction}</p>
                </div>
                <button onClick={() => openLeadRecord(nextPriority.id)} className="mt-4 flex items-center justify-center gap-1.5 rounded-[7px] px-3 py-2 text-[11.5px] font-bold text-white hover:opacity-90" style={{ background: ACCENT }}>
                  Open Record <CaretRight size={12} />
                </button>
              </div>

              <div className="rounded-[10px] border border-[#ececef] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12.5px] font-bold">Hot Leads</span>
                  <button onClick={() => { setActiveObject("leads"); setViewTab("hot"); }} className="text-[10px] font-bold" style={{ color: ACCENT }}>View all</button>
                </div>
                <div className="space-y-3">
                  {hotShortlist.map((l) => (
                    <button key={l.id} onClick={() => openLeadRecord(l.id)} className="flex w-full items-center gap-2.5 text-left hover:opacity-75">
                      <Avatar initials={l.initials} tint={l.companyColor} size={24} />
                      <span className="min-w-0 flex-1">
                        <b className="block truncate text-[11.5px]">{l.name}</b>
                        <span className="block truncate text-[10px] text-[#6b6d76]">{l.company}</span>
                      </span>
                      <span className="font-mono text-[11px] font-bold">{l.score}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Team / Qualification / Origin row */}
            <div className="mt-2.5 grid gap-2.5 lg:grid-cols-[1fr_.8fr_1fr]">
              <div className="rounded-[10px] border border-[#ececef] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12.5px] font-bold">Team</span>
                  <Users size={14} className="text-[#6b6d76]" />
                </div>
                <div className="space-y-2.5">
                  {teamMembers.map((m) => (
                    <div key={m.name}>
                      <div className="mb-1 flex items-center justify-between text-[11px]">
                        <span className="font-semibold">{m.name}</span>
                        <span className="text-[#6b6d76]">{m.count} lead{m.count === 1 ? "" : "s"}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#f2f2f4]"><div className="h-full rounded-full" style={{ width: `${(m.count / leads.length) * 100}%`, background: ACCENT }} /></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center rounded-[10px] border border-[#ececef] p-4">
                <div className="mb-2 flex w-full items-center justify-between">
                  <span className="text-[12.5px] font-bold">Qualification Rate</span>
                  <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "#12A594" }}>Live</span>
                </div>
                <div
                  className="relative mt-2 flex h-[120px] w-[120px] items-center justify-center rounded-full"
                  style={{ background: `conic-gradient(${ACCENT} 0 ${(statusCounts.q / leads.length) * 360}deg, #c7c8d1 ${(statusCounts.q / leads.length) * 360}deg ${((statusCounts.q + statusCounts.c) / leads.length) * 360}deg, #f2f2f4 ${((statusCounts.q + statusCounts.c) / leads.length) * 360}deg 360deg)` }}
                >
                  <div className="flex h-[86px] w-[86px] flex-col items-center justify-center rounded-full bg-white text-center">
                    <span className="text-[22px] font-extrabold leading-none">{Math.round((statusCounts.q / leads.length) * 100)}%</span>
                    <span className="text-[8px] font-bold uppercase tracking-wide text-[#6b6d76]">Qualified</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[9px] text-[#6b6d76]">
                  <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} /> Qualified</span>
                  <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-[#c7c8d1]" /> Contacted</span>
                  <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-[#f2f2f4]" /> New</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="rounded-[10px] border border-[#ececef] p-4">
                  <div className="mb-3 text-[12.5px] font-bold">Lead Temperature</div>
                  <div className="space-y-2.5">
                    {classificationMix.map((b) => (
                      <div key={b.c}>
                        <div className="mb-1 flex items-center justify-between text-[10.5px]"><span className="flex items-center gap-1.5 text-[#3d3e44]"><Circle size={8} weight="fill" style={{ color: classColor[b.c] }} /> {b.c}</span><span className="font-bold">{b.pct}%</span></div>
                        <div className="h-1.5 w-full rounded-full bg-[#f2f2f4]"><div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: classColor[b.c] }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-[10px] p-4 text-white" style={{ background: "#1c1c1f" }}>
                  <div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-white/60"><Sparkle size={12} /> AI Agent Dispatch</div>
                    <p className="mt-2 text-[11.5px] leading-relaxed text-white/85">{hotCount} hot lead{hotCount === 1 ? "" : "s"} scored above 80. Trigger an automated follow-up sequence?</p>
                  </div>
                  <button onClick={() => setToast("Follow-up sequence automated")} className="mt-3 rounded-[7px] px-3 py-2 text-[11.5px] font-bold text-white hover:opacity-90" style={{ background: ACCENT }}>
                    Automate Follow-up
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Follow-ups */}
        {!openRecord && activeObject === "followups" && (
          <div className="px-4 py-4 md:px-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white" style={{ background: "#1c1c1f" }}><Sparkle size={10} className="mr-1 inline align-[-1px]" /> Autonomous SLA triage</span>
                </div>
                <p className="mt-1.5 text-[12px] text-[#62636c]">Every open lead that still needs a next touch, overdue first.</p>
              </div>
              <button onClick={() => setToast("Follow-up scheduled")} className="flex items-center gap-1.5 rounded-[7px] px-3 py-2 text-[11.5px] font-bold text-white hover:opacity-90" style={{ background: ACCENT }}>
                <PaperPlaneTilt size={13} /> Create Follow-up
              </button>
            </div>

            {/* SLA summary */}
            <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="rounded-[10px] border border-[#ececef] p-3.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]"><span>Active today</span><ArrowsLeftRight size={13} /></div>
                <div className="mt-1.5 text-[22px] font-extrabold leading-none">{followUpBuckets.Today.length}</div>
                <div className="mt-1 text-[10px] text-[#6b6d76]">of {followUps.length} open touches</div>
              </div>
              <div className="rounded-[10px] border border-[#ececef] p-3.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]"><span>SLA breach</span><Warning size={13} weight="fill" className="text-[#E5484D]" /></div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-[22px] font-extrabold leading-none">{followUpBuckets.Overdue.length}</span>
                  {followUpBuckets.Overdue.length > 0 && <span className="rounded-full px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-white" style={{ background: "#E5484D" }}>Immediate action</span>}
                </div>
              </div>
              <div className="rounded-[10px] border border-[#ececef] p-3.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]"><span>SLA completion</span><Target size={13} /></div>
                <div className="mt-1.5 text-[22px] font-extrabold leading-none">{Math.round((statusCounts.q / leads.length) * 100)}%</div>
                <div className="mt-1 text-[10px] text-[#6b6d76]">of leads carried to Qualified</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-3 flex flex-wrap items-center gap-4 border-b border-[#ececef]">
              {(["Today", "Upcoming", "Overdue", "Completed"] as const).map((t) => (
                <button key={t} onClick={() => setFollowupTab(t)} className={`relative flex items-center gap-1.5 pb-2.5 text-[12.5px] font-semibold ${followupTab === t ? "text-[#1c1c1f]" : "text-[#6b6d76] hover:text-[#1c1c1f]"}`}>
                  {t} <span className="text-[10.5px] text-[#9a9ba3]">{followUpBuckets[t].length}</span>
                  {followupTab === t && <span className="absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-[#1c1c1f]" />}
                </button>
              ))}
            </div>

            <div className="divide-y divide-[#f2f2f4] rounded-[10px] border border-[#ececef]">
              {followUpBuckets[followupTab].length === 0 ? (
                <div className="px-4 py-14 text-center text-[12px] text-[#6b6d76]">No leads in this view.</div>
              ) : (
                followUpBuckets[followupTab].map((l) => (
                  <div key={l.id} role="button" tabIndex={0} onClick={() => openLeadRecord(l.id)} onKeyDown={(e) => { if (e.key === "Enter") openLeadRecord(l.id); }} className="flex w-full cursor-pointer flex-col gap-2 px-3.5 py-3 hover:bg-[#fafafb] sm:flex-row sm:items-center">
                    <Avatar initials={l.initials} tint={l.companyColor} />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <b className="truncate text-[12.5px]">{l.name}</b>
                        <span className="text-[11px] text-[#6b6d76]">· {l.company}</span>
                        <ClassDot c={l.classification} />
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-[#62636c]">{l.nextAction}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-[#6b6d76]">
                        <span>{l.owner}</span>
                        <span>·</span>
                        <span>{l.classification === "Hot" ? "High priority" : l.classification === "Warm" ? "Medium priority" : "Normal priority"}</span>
                      </span>
                    </span>
                    <span className="flex flex-none items-center gap-3">
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: l.overdue ? "#E5484D" : "#6b6d76" }}>
                        <Clock size={12} /> {l.overdue ? "Overdue" : l.followup}
                      </span>
                      {l.status !== "Qualified" && (
                        <button onClick={(e) => { e.stopPropagation(); completeFollowUp(l); }} className="rounded-[6px] border border-[#ececef] px-2 py-1 text-[10px] font-bold text-[#3d3e44] hover:bg-[#f2f2f4]">
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

        {/* Qualification */}
        {!openRecord && activeObject === "qualification" && (
          <div className="max-w-[1400px] px-4 py-4 md:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>AI Evaluation Engine</span>
                  <span className="h-1 w-1 rounded-full bg-[#c7c8d1]" />
                  <span className="rounded-full bg-[#f2f2f4] px-2 py-0.5 text-[10px] font-semibold text-[#3d3e44]">v3.4 Production</span>
                </div>
                <h1 className="text-[20px] font-extrabold tracking-tight text-[#1c1c1f]">Qualification &amp; Scoring</h1>
                <p className="max-w-2xl text-[12px] text-[#62636c]">Configure automated lead scoring models, intent weightings, temperature thresholds, and real-time sales alert triggers.</p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button onClick={() => setQualAuditOpen(true)} className="flex items-center gap-1.5 rounded-[7px] border border-[#e2e2e6] px-3 py-2 text-[11.5px] font-bold text-[#3d3e44] hover:bg-[#f2f2f4]"><ClockCounterClockwise size={15} />Audit Log</button>
                <button onClick={() => setQualReorderMode((v) => !v)} aria-pressed={qualReorderMode} className="flex items-center gap-1.5 rounded-[7px] px-3 py-2 text-[11.5px] font-bold" style={qualReorderMode ? { background: ACCENT, color: "white" } : { border: "1px solid #e2e2e6", color: "#3d3e44" }}><ArrowsDownUp size={15} />Reorder Priority</button>
                <button onClick={openCreateQualRule} className="flex items-center gap-1.5 rounded-[7px] px-3 py-2 text-[11.5px] font-bold text-white hover:opacity-90" style={{ background: ACCENT }}><Plus size={15} />Add Scoring Rule</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex items-center justify-between rounded-[10px] border border-[#ececef] p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]">Active Scoring Rules</span>
                  <div className="flex items-baseline gap-2"><span className="text-[20px] font-extrabold text-[#1c1c1f]">{qualActiveCount} Live</span><span className="text-[10px] font-bold" style={{ color: "#12A594" }}>{Math.round((qualActiveCount / (qualScoringRules.length || 1)) * 100)}% operational</span></div>
                  <span className="text-[11px] text-[#6b6d76]">{qualPositiveCount} positive • {qualPenaltyCount} penalty • {qualAlertCount} routing trigger{qualAlertCount === 1 ? "" : "s"}</span>
                </div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-[#f2f2f4]" style={{ color: ACCENT }}><ListChecks size={20} /></div>
              </div>
              <div className="flex items-center justify-between rounded-[10px] border border-[#ececef] p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]">Average Lead Score</span>
                  <div className="flex items-baseline gap-2"><span className="text-[20px] font-extrabold text-[#1c1c1f]">{qualAvgScore.toFixed(1)} <span className="text-[13px] font-normal text-[#6b6d76]">/ 100</span></span><span className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: "#12A594" }}><TrendUp size={12} />{qualAvgScore >= QUAL_BENCHMARK_SCORE ? "+" : ""}{(qualAvgScore - QUAL_BENCHMARK_SCORE).toFixed(1)} pts</span></div>
                  <span className="text-[11px] text-[#6b6d76]">Benchmark baseline {QUAL_BENCHMARK_SCORE} across {leads.length} records</span>
                </div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-[#f2f2f4]" style={{ color: ACCENT }}><ChartLineUp size={20} /></div>
              </div>
              <div className="flex items-center justify-between rounded-[10px] border border-[#ececef] p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]">High Intent (Hot) Ratio</span>
                  <div className="flex items-baseline gap-2"><span className="text-[20px] font-extrabold" style={{ color: classColor.Hot }}>{qualTierPct.hot}%</span><span className="text-[10px] font-semibold text-[#6b6d76]">Threshold ≥ {qualHotStart}</span></div>
                  <span className="text-[11px] text-[#6b6d76]">Auto-routed directly to SDR calendar sync</span>
                </div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px]" style={{ background: "#fdeced", color: classColor.Hot }}><Fire weight="fill" size={20} /></div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-[#ececef]">
              {qualTabs.map((t) => (
                <button key={t.key} onClick={() => setQualTab(t.key)} className={`relative flex items-center gap-1.5 pb-2.5 text-[12.5px] font-bold ${qualTab === t.key ? "text-[#1c1c1f]" : "text-[#6b6d76] hover:text-[#1c1c1f]"}`}>
                  {t.label}
                  {t.count !== undefined && <span className="rounded-full bg-[#f2f2f4] px-1.5 py-0.5 text-[10px] font-bold text-[#3d3e44]">{t.count}</span>}
                  {qualTab === t.key && <span className="absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full" style={{ background: ACCENT }} />}
                </button>
              ))}
            </div>

            {qualTab === "Questions" && (
              <div className="flex flex-col gap-5 py-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-[14px] font-extrabold text-[#1c1c1f]">Qualification Questions</h2>
                  <button onClick={() => setQualQuestionDialogOpen(true)} className="flex shrink-0 items-center gap-1.5 rounded-[7px] px-3.5 py-2 text-[12px] font-bold text-white hover:opacity-90" style={{ background: ACCENT }}><Plus size={15} />Create Question</button>
                </div>
                <div className="flex items-center gap-4 rounded-[10px] border border-[#ececef] p-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-[#f2f2f4]" style={{ color: ACCENT }}><ListChecks weight="duotone" size={20} /></div>
                  <div className="flex-1"><h3 className="text-[13px] font-bold text-[#1c1c1f]">Qualification at a glance</h3><p className="text-[11px] text-[#6b6d76]">{qualQuestions.length} question{qualQuestions.length === 1 ? "" : "s"} configured · {qualQuestions.filter((q) => q.required).length} required</p></div>
                  <div className="text-right"><span className="block text-[10px] text-[#6b6d76]">Max score</span><strong className="text-[15px] text-[#1c1c1f]">100 pts</strong></div>
                </div>
                <div className="overflow-hidden rounded-[10px] border border-[#ececef]">
                  <div className="flex items-center justify-between border-b border-[#ececef] px-4 py-3"><h2 className="text-[13px] font-bold text-[#1c1c1f]">Questions &amp; scoring rules</h2></div>
                  {qualQuestions.map((q, idx) => (
                    <div key={q.id} className="flex items-start gap-3 border-b border-[#f2f2f4] px-4 py-3.5 last:border-0">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#f2f2f4] text-[10px] font-bold text-[#3d3e44]">{idx + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[12.5px] font-semibold text-[#1c1c1f]">{q.label}</span>
                          <span className="rounded-[6px] bg-[#eef1fd] px-1.5 py-0.5 font-mono text-[10px]" style={{ color: ACCENT }}>{q.crmField}</span>
                          <span className="rounded-full bg-[#f2f2f4] px-2 py-0.5 text-[10px] font-medium text-[#3d3e44]">{q.fieldType}</span>
                          {q.required && <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "#fef3e2", color: classColor.Warm }}>Required</span>}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#6b6d76]">
                          <span className="flex items-center gap-1 font-medium" style={{ color: "#12A594" }}><Target size={12} />{q.points}</span>
                          <span className="flex items-center gap-1"><FlowArrow size={12} />{q.askCondition}</span>
                        </div>
                      </div>
                      <button onClick={() => setToast(`${q.label} configuration opened`)} aria-label={`Edit ${q.label}`} className="shrink-0 rounded-[6px] p-1.5 text-[#6b6d76] hover:bg-[#f2f2f4] hover:text-[#1c1c1f]"><NotePencil size={15} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {qualTab === "Scoring Rules" && (
              <div className="grid grid-cols-1 items-start gap-5 py-5 lg:grid-cols-12">
                <div className="flex flex-col gap-3 lg:col-span-8">
                  <div className="flex flex-col items-stretch gap-3 rounded-[10px] border border-[#ececef] p-3 md:flex-row md:items-center md:justify-between">
                    <div className="relative min-w-[200px] flex-1">
                      <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: "#6b6d76" }} />
                      <input name="ruleSearch" value={qualSearch} onChange={(e) => setQualSearch(e.target.value)} placeholder="Search rules by attribute, condition, or tag..." className="h-9 w-full rounded-[7px] border border-[#e2e2e6] pl-9 pr-3 text-[12px] text-[#1c1c1f] outline-none focus:border-[#3E63DD]" />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto">
                      <div className="relative">
                        <select name="ruleCategoryFilter" value={qualCategoryFilter} onChange={(e) => setQualCategoryFilter(e.target.value)} className="h-9 appearance-none rounded-[7px] border border-[#e2e2e6] px-3 pr-7 text-[11px] font-semibold text-[#1c1c1f] outline-none">
                          <option value="All Categories">All Categories ({qualScoringRules.length})</option>
                          {qualCategories.map((c) => <option key={c} value={c}>{c} ({qualScoringRules.filter((r) => r.category === c).length})</option>)}
                        </select>
                        <CaretDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" size={12} style={{ color: "#6b6d76" }} />
                      </div>
                      <div className="relative">
                        <select name="ruleStatusFilter" value={qualStatusFilter} onChange={(e) => setQualStatusFilter(e.target.value as "all" | "active" | "paused")} className="h-9 appearance-none rounded-[7px] border border-[#e2e2e6] px-3 pr-7 text-[11px] font-semibold text-[#1c1c1f] outline-none">
                          <option value="all">All Statuses</option>
                          <option value="active">Status: Active ({qualActiveCount})</option>
                          <option value="paused">Status: Paused ({qualScoringRules.length - qualActiveCount})</option>
                        </select>
                        <CaretDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" size={12} style={{ color: "#6b6d76" }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {qualFilteredRules.length === 0 && <div className="rounded-[10px] border border-[#ececef] p-8 text-center text-[12px] text-[#6b6d76]">No scoring rules match these filters.</div>}
                    {qualFilteredRules.map((rule) => {
                      const trueIdx = qualScoringRules.findIndex((r) => r.id === rule.id);
                      return (
                        <ScoringRuleCard
                          key={rule.id}
                          rule={rule}
                          priority={trueIdx + 1}
                          reorderMode={qualReorderMode}
                          canMoveUp={trueIdx > 0}
                          canMoveDown={trueIdx < qualScoringRules.length - 1}
                          onMoveUp={() => moveQualRule(rule, -1)}
                          onMoveDown={() => moveQualRule(rule, 1)}
                          onToggleActive={() => toggleQualRuleActive(rule)}
                          onEdit={() => openEditQualRule(rule)}
                          onDuplicate={() => duplicateQualRule(rule)}
                          onDelete={() => deleteQualRule(rule)}
                          menuOpen={qualMenuOpenId === rule.id}
                          onToggleMenu={() => setQualMenuOpenId((cur) => (cur === rule.id ? null : rule.id))}
                        />
                      );
                    })}
                  </div>

                  <button type="button" onClick={openCreateQualRule} className="flex w-full items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-[#e2e2e6] bg-white py-3.5 text-[12px] font-semibold text-[#3d3e44] hover:border-[#3E63DD] hover:text-[#3E63DD]"><PlusCircle size={18} />Define another automated qualification rule</button>
                </div>

                <div className="flex flex-col gap-5 lg:col-span-4">
                  <ClassificationThresholdsCard warmStart={qualWarmStart} hotStart={qualHotStart} onChangeWarm={setQualWarmStart} onChangeHot={setQualHotStart} coldPct={qualTierPct.cold} warmPct={qualTierPct.warm} hotPct={qualTierPct.hot} />
                  <TestScoreSimulatorCard scoringRules={qualScoringRules} warmStart={qualWarmStart} hotStart={qualHotStart} notify={setToast} />
                </div>
              </div>
            )}

            {qualTab === "Classification Thresholds" && (
              <div className="mx-auto w-full max-w-xl py-5">
                <ClassificationThresholdsCard warmStart={qualWarmStart} hotStart={qualHotStart} onChangeWarm={setQualWarmStart} onChangeHot={setQualHotStart} coldPct={qualTierPct.cold} warmPct={qualTierPct.warm} hotPct={qualTierPct.hot} />
              </div>
            )}

            {qualTab === "Test Score Sandbox" && (
              <div className="mx-auto w-full max-w-xl py-5">
                <TestScoreSimulatorCard scoringRules={qualScoringRules} warmStart={qualWarmStart} hotStart={qualHotStart} notify={setToast} />
              </div>
            )}

            {qualQuestionDialogOpen && <QualificationQuestionDialog onClose={() => setQualQuestionDialogOpen(false)} onSave={handleSaveQualQuestion} />}
            {qualRuleDialog.open && <ScoringRuleDialog initial={qualRuleDialog.editing} onClose={() => setQualRuleDialog({ open: false, editing: null })} onSave={saveQualRule} />}

            {qualAuditOpen && (
              <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
                <button type="button" aria-label="Close audit log" onClick={() => setQualAuditOpen(false)} className="absolute inset-0 cursor-default" />
                <aside className="reg-pop relative flex h-full w-full max-w-sm flex-col gap-4 overflow-y-auto border-l border-[#e2e2e6] bg-white p-6 shadow-[0_16px_40px_rgba(20,20,25,0.14)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#f2f2f4]" style={{ color: ACCENT }}><ClockCounterClockwise size={18} /></span><h2 className="text-[15px] font-extrabold text-[#1c1c1f]">Audit Log</h2></div>
                    <button type="button" onClick={() => setQualAuditOpen(false)} aria-label="Close" className="rounded-[6px] p-1 text-[#6b6d76] hover:bg-[#f2f2f4]"><X size={16} /></button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {qualAuditLog.map((entry) => (
                      <div key={entry.id} className="flex flex-col gap-0.5 rounded-[10px] border border-[#ececef] p-3">
                        <span className="text-[12px] font-medium text-[#1c1c1f]">{entry.text}</span>
                        <span className="text-[10px] text-[#6b6d76]">{entry.time}</span>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            )}
          </div>
        )}

        {/* Knowledge Base */}
        {!openRecord && activeObject === "knowledgebase" && (
          <div className="max-w-[560px] px-4 py-4 md:px-8">
            <p className="mb-4 text-[12px] text-[#62636c]">What the AI draws on to answer visitor questions.</p>
            <div className="divide-y divide-[#f2f2f4] rounded-[10px] border border-[#ececef]">
              {knowledgeSources.map((k) => (
                <div key={k.label} className="flex items-start gap-3 px-3.5 py-3">
                  <k.icon size={15} className="mt-0.5 flex-none text-[#6b6d76]" />
                  <div><div className="text-[12.5px] font-semibold">{k.label}</div><div className="mt-0.5 text-[11px] text-[#6b6d76]">{k.detail}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Websites & Widget */}
        {!openRecord && activeObject === "websites" && (
          <div className="max-w-[560px] px-4 py-4 md:px-8">
            <div className="h-1.5 w-full rounded-full bg-[#efeff1]"><div className="h-full rounded-full" style={{ width: `${(setupChecklist.filter((s) => s.done).length / setupChecklist.length) * 100}%`, background: ACCENT }} /></div>
            <div className="mt-4 divide-y divide-[#f2f2f4] rounded-[10px] border border-[#ececef]">
              {setupChecklist.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-3.5 py-3">
                  {s.done ? <CheckCircle size={16} weight="fill" style={{ color: "#12A594" }} /> : <Circle size={16} className="text-[#c7c8d1]" />}
                  <span className={`text-[12.5px] ${s.done ? "text-[#6b6d76] line-through" : "font-semibold"}`}>{s.label}</span>
                  {!s.done && <button className="ml-auto text-[11px] font-bold" style={{ color: ACCENT }}>Resolve</button>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics */}
        {!openRecord && activeObject === "analytics" && (
          <div className="px-4 py-4 md:px-8">
            <p className="mb-4 text-[12px] text-[#62636c]">Classification breakdown across all leads.</p>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-[10px] border border-[#ececef] p-4"><ClassDot c="Hot" /><div className="mt-2 text-[28px] font-extrabold leading-none">{hotCount}</div></div>
              <div className="rounded-[10px] border border-[#ececef] p-4"><ClassDot c="Warm" /><div className="mt-2 text-[28px] font-extrabold leading-none">{warmCount}</div></div>
              <div className="rounded-[10px] border border-[#ececef] p-4"><ClassDot c="Cold" /><div className="mt-2 text-[28px] font-extrabold leading-none">{coldCount}</div></div>
            </div>
            <p className="mt-4 max-w-[54ch] text-[11.5px] text-[#6b6d76]">Trend charts and cohort breakdowns are not built in this prototype — this view demonstrates the destination, not the full module.</p>
          </div>
        )}

        {/* Integrations */}
        {!openRecord && activeObject === "integrations" && (
          <div className="max-w-[560px] px-4 py-4 md:px-8">
            <div className="divide-y divide-[#f2f2f4] rounded-[10px] border border-[#ececef]">
              <div className="flex items-center justify-between px-3.5 py-3">
                <span className="flex items-center gap-2.5 text-[12.5px] font-semibold"><EnvelopeSimple size={16} className="text-[#6b6d76]" /> Email notifications</span>
                <CheckCircle size={16} weight="fill" style={{ color: "#12A594" }} />
              </div>
              <div className="flex items-center justify-between px-3.5 py-3">
                <span className="flex items-center gap-2.5 text-[12.5px] font-semibold"><Buildings size={16} className="text-[#6b6d76]" /> CRM sync (Parcel Grid)</span>
                {parcelSyncFailed ? (
                  <button onClick={retrySync} disabled={syncing} className="flex items-center gap-1.5 rounded-[6px] border border-[#ececef] px-2 py-1 text-[10px] font-bold text-[#3d3e44] hover:bg-[#f2f2f4] disabled:opacity-50">
                    <ArrowClockwise size={11} className={syncing ? "reg-spin" : ""} /> Retry
                  </button>
                ) : (
                  <CheckCircle size={16} weight="fill" style={{ color: "#12A594" }} />
                )}
              </div>
              <div className="flex items-center justify-between px-3.5 py-3">
                <span className="flex items-center gap-2.5 text-[12.5px] font-semibold"><CirclesThreePlus size={16} className="text-[#6b6d76]" /> Outbound webhook</span>
                <CheckCircle size={16} weight="fill" style={{ color: "#12A594" }} />
              </div>
            </div>
          </div>
        )}

        {/* Team */}
        {!openRecord && activeObject === "team" && (
          <div className="max-w-[560px] px-4 py-4 md:px-8">
            <div className="divide-y divide-[#f2f2f4] rounded-[10px] border border-[#ececef]">
              {teamMembers.map((m) => (
                <div key={m.name} className="flex items-center gap-3 px-3.5 py-3">
                  <Avatar initials={m.name === "Unassigned" ? "—" : m.name.slice(0, 2).toUpperCase()} size={28} />
                  <span className="flex-1 text-[12.5px] font-semibold">{m.name}</span>
                  <span className="text-[11px] text-[#6b6d76]">{m.count} lead{m.count === 1 ? "" : "s"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {!openRecord && activeObject === "notifications" && (
          <div className="max-w-[560px] px-4 py-4 md:px-8">
            <div className="divide-y divide-[#f2f2f4] rounded-[10px] border border-[#ececef]">
              {notifications.map((n) => (
                <div key={n.id} className={`px-3.5 py-3 ${n.unread ? "bg-[#f7f8fd]" : ""}`}>
                  <div className="flex items-baseline justify-between gap-2"><b className="text-[12.5px]">{n.title}</b><span className="flex-none text-[10px] text-[#6b6d76]">{n.time}</span></div>
                  <p className="mt-1 text-[11px] leading-snug text-[#62636c]">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Billing & Usage */}
        {!openRecord && activeObject === "billing" && (
          <div className="max-w-[420px] px-4 py-4 md:px-8">
            <div className="rounded-[10px] border border-[#ececef] p-4">
              <div className="flex items-center justify-between text-[12.5px] font-semibold"><span>Conversations this month</span><span>742 / 1,000</span></div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-[#efeff1]"><div className="h-full rounded-full" style={{ width: "74%", background: ACCENT }} /></div>
              <button className="mt-4 w-full rounded-[7px] py-2 text-[11.5px] font-bold text-white" style={{ background: ACCENT }}>Upgrade plan</button>
            </div>
          </div>
        )}

        {/* Help & Support */}
        {!openRecord && activeObject === "help" && (
          <div className="max-w-[420px] px-4 py-4 md:px-8">
            <div className="divide-y divide-[#f2f2f4] rounded-[10px] border border-[#ececef]">
              <div className="flex items-center gap-3 px-3.5 py-3"><EnvelopeSimple size={16} className="text-[#6b6d76]" /> <span className="text-[12.5px]">support@ailqs.com</span></div>
              <div className="flex items-center gap-3 px-3.5 py-3"><ChatCircle size={16} className="text-[#6b6d76]" /> <span className="text-[12.5px]">Live chat — weekdays, 9am–6pm</span></div>
              <div className="flex items-center gap-3 px-3.5 py-3"><BookOpenText size={16} className="text-[#6b6d76]" /> <span className="text-[12.5px]">Setup and integration guides</span></div>
            </div>
          </div>
        )}

        {/* Leads table */}
        {!openRecord && activeObject === "leads" && (
          <div className="px-4 py-3 md:px-8">
            {/* Summary cards */}
            <div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              <div className="rounded-[10px] border border-[#ececef] p-3.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]"><span>New leads</span><Sparkle size={13} /></div>
                <div className="mt-1 text-[22px] font-extrabold leading-none">{statusCounts.n}</div>
              </div>
              <div className="rounded-[10px] border border-[#ececef] p-3.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]"><span>Hot leads</span><Fire size={13} weight="fill" style={{ color: classColor.Hot }} /></div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[22px] font-extrabold leading-none">{hotCount}</span>
                  {hotCount > 0 && <span className="rounded-full px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-white" style={{ background: classColor.Hot }}>Action now</span>}
                </div>
              </div>
              <div className="rounded-[10px] border border-[#ececef] p-3.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]"><span>Unassigned</span><UserCircle size={13} /></div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[22px] font-extrabold leading-none">{unassignedCount}</span>
                  {unassignedCount > 0 && <span className="text-[9px] font-semibold" style={{ color: ACCENT }}>needs routing</span>}
                </div>
              </div>
              <div className="rounded-[10px] border border-[#ececef] p-3.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]"><span>Follow-up due</span><Clock size={13} /></div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[22px] font-extrabold leading-none">{followUpDueCount}</span>
                  {followUpDueCount > 0 && <span className="rounded-full bg-[#f2f2f4] px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-[#3d3e44]">This week</span>}
                </div>
              </div>
            </div>

            <div className="mb-1 flex flex-wrap items-center gap-4 border-b border-[#ececef]">
              {([["all", `All Leads · ${leads.length}`], ["hot", `Hot · ${hotCount}`], ["warm", `Warm · ${warmCount}`], ["cold", `Cold · ${coldCount}`]] as const).map(([key, label]) => (
                <button key={key} onClick={() => setViewTab(key)} className={`relative pb-2.5 text-[12.5px] font-semibold ${viewTab === key ? "text-[#1c1c1f]" : "text-[#6b6d76] hover:text-[#1c1c1f]"}`}>
                  {label}
                  {viewTab === key && <span className="absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-[#1c1c1f]" />}
                </button>
              ))}
              <button className="pb-2.5 text-[#6b6d76] hover:text-[#62636c]"><Plus size={13} /></button>
              <div className="ml-auto flex items-center gap-1 pb-1.5">
                <button className="flex items-center gap-1.5 rounded-[6px] px-2 py-1 text-[11.5px] font-semibold text-[#62636c] hover:bg-[#f2f2f4]"><FunnelSimple size={13} /> Filter</button>
                <button className="flex items-center gap-1.5 rounded-[6px] px-2 py-1 text-[11.5px] font-semibold text-[#62636c] hover:bg-[#f2f2f4]"><SortAscending size={13} /> Sort</button>
                <span className="mx-1 h-4 w-px bg-[#ececef]" />
                <button className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#f2f2f4]"><TableIcon size={13} /></button>
                <button className="flex h-6 w-6 items-center justify-center rounded-[6px] text-[#c7c8d1]" title="Board view — coming soon"><GridFour size={13} /></button>
              </div>
            </div>

            {loading ? (
              <div className="divide-y divide-[#f2f2f4]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 px-2 py-3.5">
                    <div className="reg-skel h-4 w-4 rounded" /><div className="reg-skel h-4 flex-1 rounded" /><div className="reg-skel h-4 w-20 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <FileText size={28} className="text-[#c7c8d1]" />
                <p className="text-[13px] font-bold">No leads match this view</p>
                <button onClick={() => setViewTab("all")} className="mt-1 rounded-[7px] px-3 py-1.5 text-[11.5px] font-bold text-white" style={{ background: ACCENT }}>Show all leads</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#ececef] text-[10.5px] font-bold uppercase tracking-wide text-[#6b6d76]">
                      <th className="w-8 px-2 py-2"><button onClick={toggleSelectAll}>{selected.size === filteredLeads.length ? <CheckSquare size={15} style={{ color: ACCENT }} /> : <Square size={15} className="text-[#c7c8d1]" />}</button></th>
                      <th className="px-2 py-2"><span className="flex items-center gap-1.5">{fieldIcon("person")} Lead <CaretUpDown size={11} className="text-[#c7c8d1]" /></span></th>
                      <th className="px-2 py-2"><span className="flex items-center gap-1.5">{fieldIcon("company")} Company</span></th>
                      <th className="px-2 py-2"><span className="flex items-center gap-1.5">{fieldIcon("link")} Site</span></th>
                      <th className="px-2 py-2"><span className="flex items-center gap-1.5">{fieldIcon("class")} Class</span></th>
                      <th className="px-2 py-2"><span className="flex items-center gap-1.5">{fieldIcon("hash")} Score <CaretUpDown size={11} className="text-[#c7c8d1]" /></span></th>
                      <th className="px-2 py-2"><span className="flex items-center gap-1.5">{fieldIcon("status")} Status</span></th>
                      <th className="px-2 py-2"><span className="flex items-center gap-1.5">{fieldIcon("person")} Owner</span></th>
                      <th className="px-2 py-2"><span className="flex items-center gap-1.5">{fieldIcon("date")} Received</span></th>
                      <th className="px-2 py-2"><span className="flex items-center gap-1.5">{fieldIcon("bool")} Consent</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((l) => (
                      <tr key={l.id} className="group border-b border-[#f2f2f4] text-[12.5px] hover:bg-[#fafafb]">
                        <td className="px-2 py-2.5"><button onClick={() => toggleSelect(l.id)}>{selected.has(l.id) ? <CheckSquare size={15} style={{ color: ACCENT }} /> : <Square size={15} className="text-[#d5d6db] group-hover:text-[#6b6d76]" />}</button></td>
                        <td className="px-2 py-2.5">
                          <button onClick={() => openLeadRecord(l.id)} className="flex items-center gap-2 text-left hover:underline" style={{ textDecorationColor: ACCENT }}>
                            <Avatar initials={l.initials} tint={l.companyColor} /> <span className="font-semibold">{l.name}</span>
                            {l.favorite && <Star size={11} weight="fill" style={{ color: "#F5A623" }} />}
                          </button>
                        </td>
                        <td className="px-2 py-2.5"><span className="flex items-center gap-2"><span className="h-3 w-3 flex-none rounded-[3px]" style={{ background: l.companyColor }} /> {l.company}</span></td>
                        <td className="px-2 py-2.5"><span className="inline-flex items-center gap-1 hover:underline" style={{ color: ACCENT }}>{l.site} <ArrowSquareOut size={10} /></span></td>
                        <td className="px-2 py-2.5"><ClassDot c={l.classification} /></td>
                        <td className="px-2 py-2.5 font-mono font-semibold">{l.score}</td>
                        <td className="px-2 py-2.5"><span className="rounded-full bg-[#f2f2f4] px-2 py-0.5 text-[11px] font-semibold text-[#3d3e44]">{l.status}</span></td>
                        <td className="px-2 py-2.5"><span className="flex items-center gap-1.5">{l.owner === "Unassigned" ? <span className="text-[#c7c8d1]">—</span> : <Avatar initials={l.ownerInitials} size={20} />} {l.owner}</span></td>
                        <td className="px-2 py-2.5 text-[#62636c]">{l.received}</td>
                        <td className="px-2 py-2.5">{l.consented ? <CheckCircle size={15} weight="fill" className="text-[#12A594]" /> : <XCircle size={15} weight="fill" className="text-[#c7c8d1]" />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Companies table */}
        {!openRecord && activeObject === "companies" && (
          <div className="px-4 py-4 md:px-8">
            <div className="overflow-x-auto rounded-[10px] border border-[#ececef]">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#ececef] bg-[#fafafb] text-[10.5px] font-bold uppercase tracking-wide text-[#6b6d76]">
                    <th className="px-3 py-2.5">{fieldIcon("company")} Company</th>
                    <th className="px-3 py-2.5">{fieldIcon("link")} Site</th>
                    <th className="px-3 py-2.5">{fieldIcon("person")} Primary contact</th>
                    <th className="px-3 py-2.5">{fieldIcon("hash")} Lead score</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => (
                    <tr key={c.name} className="border-b border-[#f2f2f4] text-[12.5px] last:border-0 hover:bg-[#fafafb]">
                      <td className="px-3 py-2.5"><span className="flex items-center gap-2"><span className="h-3.5 w-3.5 flex-none rounded-[4px]" style={{ background: c.color }} /> <span className="font-semibold">{c.name}</span></span></td>
                      <td className="px-3 py-2.5"><span style={{ color: ACCENT }}>{c.site}</span></td>
                      <td className="px-3 py-2.5">{c.contact}</td>
                      <td className="px-3 py-2.5 font-mono">{c.leadScore}</td>
                      <td className="px-3 py-2.5">
                        {c.name === "Parcel Grid" && parcelSyncFailed && (
                          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#E5484D]">
                            <Warning size={12} weight="fill" /> Sync failed
                            <button onClick={retrySync} disabled={syncing} className="ml-1 flex items-center gap-1 rounded-[6px] border border-[#ececef] px-1.5 py-0.5 text-[10px] font-bold text-[#3d3e44] hover:bg-[#f2f2f4] disabled:opacity-50">
                              <ArrowClockwise size={10} className={syncing ? "reg-spin" : ""} /> Retry
                            </button>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inbox list */}
        {!openRecord && activeObject === "inbox" && (() => {
          const selected = leads.find((l) => l.id === openConversationId) ?? leads[0];
          return (
            <div className="px-4 py-4 md:px-8">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="max-w-[46ch] text-[12px] text-[#62636c]">Every live conversation, AI-handled or handed off, in one workspace.</p>
                <span className="hidden flex-none items-center gap-1.5 rounded-full border border-[#ececef] px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wide text-[#62636c] sm:flex"><i className="h-1.5 w-1.5 rounded-full bg-[#12A594]" /> Live stream</span>
              </div>

              <div className="grid min-w-0 gap-3 lg:grid-cols-[260px_1fr_290px]">
                {/* Left: qualification + conversation list */}
                <div className="min-w-0 space-y-3 lg:order-1">
                  <div className="rounded-[10px] border border-[#ececef] p-4 text-center">
                    <div className="text-[9px] font-bold uppercase tracking-wide text-[#6b6d76]">Lead Qualification</div>
                    <div
                      className="relative mx-auto mt-3 flex h-[96px] w-[96px] items-center justify-center rounded-full"
                      style={{ background: `conic-gradient(${ACCENT} 0 ${(selected.score / 100) * 360}deg, #f2f2f4 ${(selected.score / 100) * 360}deg 360deg)` }}
                    >
                      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white">
                        <span className="text-[22px] font-extrabold leading-none">{selected.score}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-center"><ClassDot c={selected.classification} /></div>
                    <p className="mt-2 text-[10.5px] leading-relaxed text-[#62636c]">{selected.interest}</p>
                  </div>
                  <div className="max-h-[520px] divide-y divide-[#f2f2f4] overflow-y-auto rounded-[10px] border border-[#ececef]">
                    {leads.map((lead) => {
                      const last = lead.transcript[lead.transcript.length - 1];
                      const tag = inboxTag(lead);
                      const active = selected.id === lead.id;
                      return (
                        <button key={lead.id} onClick={() => setOpenConversationId(lead.id)} className={`block w-full min-w-0 px-3 py-3 text-left ${active ? "bg-[#f2f2f4]" : "hover:bg-[#fafafb]"}`}>
                          <div className="flex min-w-0 items-center justify-between gap-2">
                            <b className="min-w-0 flex-1 truncate text-[11.5px]">{lead.name}</b>
                            <span className="flex-none text-[9px] text-[#6b6d76]">{lead.received}</span>
                          </div>
                          <div className="mt-0.5 flex min-w-0 items-center justify-between gap-2 text-[10px] text-[#6b6d76]">
                            <span className="min-w-0 flex-1 truncate">{lead.company}</span>
                            <span className="flex-none font-mono font-bold text-[#1c1c1f]">{lead.score}</span>
                          </div>
                          {last && <p className="mt-1 truncate text-[10.5px] text-[#3d3e44]">{last.text}</p>}
                          <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-[#6b6d76]">
                            <tag.icon size={10} weight={tag.label === "Handoff needed" ? "fill" : "regular"} style={tag.label === "Handoff needed" ? { color: "#E5484D" } : undefined} /> {tag.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Middle: chat */}
                <div className="flex min-w-0 flex-col rounded-[10px] border border-[#ececef] lg:order-2">
                  <div className="border-b border-[#ececef] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar initials={selected.initials} tint={selected.companyColor} size={38} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2"><b className="truncate text-[14px]">{selected.name}</b><ClassDot c={selected.classification} /></div>
                          <div className="truncate text-[11px] text-[#62636c]">{selected.company} · Owner {selected.owner}</div>
                        </div>
                      </div>
                      <button onClick={() => setToast(`Conversation with ${selected.name} resolved`)} className="flex flex-none items-center gap-1.5 rounded-[7px] border border-[#ececef] px-2.5 py-1.5 text-[10px] font-bold text-[#3d3e44] hover:bg-[#f2f2f4]">
                        <CheckCircle size={12} /> Resolve
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-[#f2f2f4] pt-3 text-[10.5px] text-[#62636c]">
                      <span><b className="text-[#1c1c1f]">Source —</b> {selected.site}</span>
                      <span><b className="text-[#1c1c1f]">Interest —</b> {selected.interest}</span>
                      <span><b className="text-[#1c1c1f]">Consent —</b> {selected.consented ? "Given" : "Not given"}</span>
                    </div>
                  </div>
                  <div className="max-h-[420px] flex-1 space-y-3 overflow-y-auto p-4">
                    {selected.transcript.map((m, i) => (
                      <div key={i} className="flex gap-3 text-[12px]">
                        <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: m.from === "ai" ? "#1c1c1f" : selected.companyColor }}>
                          {m.from === "ai" ? <Robot size={12} /> : m.author.slice(0, 1)}
                        </div>
                        <div className="min-w-0"><div className="flex items-baseline gap-2"><b>{m.author}</b><span className="text-[10px] text-[#6b6d76]">{m.time}</span></div><p className="mt-0.5 leading-relaxed text-[#3d3e44]">{m.text}</p></div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#ececef] p-3">
                    <div className="mb-2 flex gap-1">
                      <button onClick={() => setReplyMode("visitor")} className={`rounded-[6px] px-2.5 py-1 text-[10px] font-bold ${replyMode === "visitor" ? "bg-[#1c1c1f] text-white" : "text-[#62636c] hover:bg-[#f2f2f4]"}`}>Reply to visitor</button>
                      <button onClick={() => setReplyMode("note")} className={`rounded-[6px] px-2.5 py-1 text-[10px] font-bold ${replyMode === "note" ? "bg-[#1c1c1f] text-white" : "text-[#62636c] hover:bg-[#f2f2f4]"}`}>Private note</button>
                    </div>
                    <textarea
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      rows={2}
                      placeholder={replyMode === "visitor" ? `Reply to ${selected.name}…` : "Add a note only the team can see…"}
                      className="w-full resize-none rounded-[7px] border border-[#e2e2e6] p-2.5 text-[12px] outline-none focus:border-[#3E63DD]"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => { setToast(replyMode === "visitor" ? `Reply sent to ${selected.name}` : "Note saved"); setReplyDraft(""); }}
                        className="flex items-center gap-1.5 rounded-[7px] px-3 py-2 text-[11px] font-bold text-white hover:opacity-90"
                        style={{ background: ACCENT }}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: AI brief / scoring / next action / details */}
                <div className="min-w-0 space-y-3 lg:order-3">
                  <div className="rounded-[10px] border border-[#ececef] p-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-[#6b6d76]"><Sparkle size={12} /> AI Brief</div>
                    <p className="mt-2 text-[11.5px] leading-relaxed">{selected.name} at {selected.company} is exploring {selected.interest.toLowerCase()}, currently {selected.status.toLowerCase()}{selected.consented ? " with consent on file" : ""}.</p>
                  </div>
                  <div className="rounded-[10px] border border-[#ececef] p-4">
                    <div className="mb-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-[#6b6d76]">
                      <span>Scoring</span><span>{selected.score}/100</span>
                    </div>
                    <div className="space-y-2">
                      {selected.scoring.map((s) => (
                        <div key={s.label} className="flex min-w-0 items-center gap-2 text-[11px]">
                          <CheckCircle size={13} weight={s.points / s.max >= 0.7 ? "fill" : "regular"} className="flex-none" style={s.points / s.max >= 0.7 ? { color: "#12A594" } : undefined} />
                          <span className="min-w-0 flex-1 truncate">{s.label}</span>
                          <span className="flex-none font-bold">{s.points}/{s.max}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[10px] p-4 text-white" style={{ background: "#1c1c1f" }}>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-white/60"><Target size={12} /> Next Action</div>
                    <p className="mt-2 text-[11.5px] leading-relaxed text-white/85">{selected.nextAction}</p>
                    <button onClick={() => { openLeadRecord(selected.id); setRecordTab("overview"); }} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[7px] px-3 py-2 text-[11px] font-bold text-white hover:opacity-90" style={{ background: ACCENT }}>
                      Open Record <CaretRight size={12} />
                    </button>
                  </div>
                  <div className="rounded-[10px] border border-[#ececef] p-4">
                    <div className="mb-2 text-[9px] font-bold uppercase tracking-wide text-[#6b6d76]">Contact &amp; CRM</div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex min-w-0 items-center gap-2 truncate"><At size={12} className="flex-none" /> <span className="truncate">{selected.email}</span></div>
                      <div className="flex items-center gap-2"><Phone size={12} className="flex-none" /> {selected.phone}</div>
                      <div className="flex items-center justify-between"><span className="text-[#6b6d76]">Status</span><span className="rounded-full bg-[#f2f2f4] px-2 py-0.5 text-[10px] font-semibold">{selected.status}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Agents table */}
        {!openRecord && activeObject === "agent" && (
          <div className="px-4 py-4 md:px-8">
            {/* Fleet summary */}
            <div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              <div className="rounded-[10px] border border-[#ececef] p-3.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]"><span>Conversations</span><ChatCircle size={13} /></div>
                <div className="mt-1 text-[22px] font-extrabold leading-none">{agents.reduce((a, x) => a + x.conversations, 0).toLocaleString()}</div>
              </div>
              <div className="rounded-[10px] border border-[#ececef] p-3.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]"><span>Avg. resolution</span><CheckCircle size={13} /></div>
                <div className="mt-1 text-[22px] font-extrabold leading-none">{Math.round(agents.reduce((a, x) => a + x.accuracy, 0) / agents.length)}%</div>
              </div>
              <div className="rounded-[10px] border border-[#ececef] p-3.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]"><span>Active agents</span><Robot size={13} /></div>
                <div className="mt-1 text-[22px] font-extrabold leading-none">{agents.filter((a) => a.status === "Active").length}<span className="text-[13px] text-[#6b6d76]">/{agents.length}</span></div>
              </div>
              <div className="rounded-[10px] border border-[#ececef] p-3.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]"><span>Avg. fallback</span><ArrowsLeftRight size={13} /></div>
                <div className="mt-1 text-[22px] font-extrabold leading-none">{100 - Math.round(agents.reduce((a, x) => a + x.accuracy, 0) / agents.length)}%</div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-[10px] border border-[#ececef]">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#ececef] bg-[#fafafb] text-[10.5px] font-bold uppercase tracking-wide text-[#6b6d76]">
                    <th className="px-3 py-2.5">{fieldIcon("person")} Agent</th>
                    <th className="px-3 py-2.5">Archetype</th>
                    <th className="px-3 py-2.5">{fieldIcon("status")} Status</th>
                    <th className="px-3 py-2.5">{fieldIcon("hash")} Conversations</th>
                    <th className="px-3 py-2.5">{fieldIcon("hash")} Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((a) => (
                    <tr key={a.id} onClick={() => openAgentDialog(a)} className="cursor-pointer border-b border-[#f2f2f4] text-[12.5px] last:border-0 hover:bg-[#fafafb]">
                      <td className="px-3 py-2.5"><span className="flex items-center gap-2"><Robot size={14} className="text-[#6b6d76]" /> <div><span className="block font-semibold">{a.name}</span><span className="block text-[11px] text-[#6b6d76]">{a.role}</span></div></span></td>
                      <td className="px-3 py-2.5"><span className="rounded-full bg-[#f2f2f4] px-2 py-0.5 text-[10.5px] font-semibold text-[#3d3e44]">{a.archetype}</span></td>
                      <td className="px-3 py-2.5"><span className="flex items-center gap-1.5 text-[11.5px] font-semibold"><Circle size={8} weight={a.status === "Active" ? "fill" : "regular"} style={{ color: a.status === "Active" ? "#12A594" : "#c7c8d1" }} /> {a.status}</span></td>
                      <td className="px-3 py-2.5">{a.conversations}</td>
                      <td className="px-3 py-2.5">{a.accuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings */}
        {!openRecord && activeObject === "settings" && (
          <div className="max-w-[560px] px-4 py-4 md:px-8">
            <div className="divide-y divide-[#f2f2f4] rounded-[10px] border border-[#ececef]">
              {[
                { label: "Workspace name", value: "AILQS" },
                { label: "Plan", value: "Pro — 3 websites" },
                { label: "Members", value: "4 seats" },
                { label: "Primary domain", value: "ailqs.com" },
                { label: "Webhook status", value: "Active" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-3.5 py-3 text-[12.5px]"><span className="text-[#62636c]">{row.label}</span><span className="font-semibold">{row.value}</span></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Agent configuration dialog */}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8">
            <button aria-label="Close" onClick={closeAgentDialog} className="absolute inset-0 cursor-default" />
            <div className="reg-pop relative flex max-h-[85vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[12px] border border-[#e2e2e6] bg-white shadow-[0_30px_80px_rgba(20,20,25,0.24)]">
              <div className="flex items-start justify-between border-b border-[#ececef] p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#f2f2f4]"><Robot size={20} className="text-[#3d3e44]" /></span>
                  <div>
                    <h2 className="text-[15px] font-extrabold">{agent.name}</h2>
                    <p className="mt-0.5 text-[11px] text-[#6b6d76]">{agent.role}</p>
                  </div>
                </div>
                <button onClick={closeAgentDialog}><X size={16} /></button>
              </div>
              <div className="grid grid-cols-3 divide-x divide-[#ececef] border-b border-[#ececef] text-center">
                <div className="p-3"><div className="text-[18px] font-extrabold">{agent.conversations}</div><div className="text-[10px] text-[#6b6d76]">Conversations</div></div>
                <div className="p-3"><div className="text-[18px] font-extrabold">{agent.accuracy}%</div><div className="text-[10px] text-[#6b6d76]">Accuracy</div></div>
                <div className="p-3"><div className="text-[18px] font-extrabold">{agent.status}</div><div className="text-[10px] text-[#6b6d76]">Status</div></div>
              </div>

              <div className="overflow-y-auto p-5">
                {/* Configuration health */}
                <div className="mb-5 flex items-center gap-4 rounded-[10px] border border-[#ececef] p-3.5">
                  <div
                    className="relative flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full"
                    style={{ background: `conic-gradient(${ACCENT} 0 ${(agent.accuracy / 100) * 360}deg, #f2f2f4 ${(agent.accuracy / 100) * 360}deg 360deg)` }}
                  >
                    <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white text-[11px] font-extrabold">{agent.accuracy}%</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold uppercase tracking-wide text-[#6b6d76]">Configuration health</div>
                    <p className="mt-0.5 text-[11px] leading-snug text-[#3d3e44]">{recommendation}</p>
                  </div>
                </div>

                {/* Voice & Demeanor */}
                <div className="mb-5">
                  <h3 className="text-[13px] font-extrabold">Voice &amp; Demeanor</h3>
                  <p className="mt-0.5 text-[11px] text-[#6b6d76]">Control how {agent.name} engages prospects during qualification.</p>

                  <div className="mt-3 text-[9px] font-bold uppercase tracking-wide text-[#6b6d76]">Personality archetype</div>
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                    {archetypeOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAgentDraft((cur) => (cur ? { ...cur, archetype: opt } : cur))}
                        className="rounded-[7px] border px-2.5 py-1.5 text-[10.5px] font-bold"
                        style={draft.archetype === opt ? { borderColor: ACCENT, background: ACCENT, color: "white" } : { borderColor: "#ececef", color: "#3d3e44" }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 text-[9px] font-bold uppercase tracking-wide text-[#6b6d76]">Tone attributes (select up to 3)</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {toneOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleAgentTone(opt)}
                        className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10.5px] font-bold"
                        style={draft.tones.includes(opt) ? { borderColor: ACCENT, background: ACCENT, color: "white" } : { borderColor: "#ececef", color: "#3d3e44" }}
                      >
                        {draft.tones.includes(opt) && <Check size={10} />} {opt}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 text-[9px] font-bold uppercase tracking-wide text-[#6b6d76]">Response length preference</div>
                  <div className="mt-1.5 flex rounded-[7px] border border-[#ececef]">
                    {lengthOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAgentDraft((cur) => (cur ? { ...cur, length: opt } : cur))}
                        className="flex-1 px-2 py-1.5 text-[10px] font-bold first:rounded-l-[6px] last:rounded-r-[6px]"
                        style={draft.length === opt ? { background: ACCENT, color: "white" } : { color: "#3d3e44" }}
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
                    <span className="text-[10px] text-[#6b6d76]">{wordCount} / 2,000 words</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#6b6d76]">Foundational system instruction prompt executing qualification thresholds.</p>
                  <textarea
                    value={draft.prompt}
                    onChange={(e) => setAgentDraft((cur) => (cur ? { ...cur, prompt: e.target.value } : cur))}
                    rows={5}
                    className="mt-2 w-full resize-none rounded-[8px] border border-[#ececef] p-3 text-[11.5px] leading-relaxed outline-none"
                    style={{ borderColor: "#ececef" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = ACCENT)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#ececef")}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#ececef] p-4">
                <button onClick={closeAgentDialog} className="rounded-[7px] border border-[#e2e2e6] px-3 py-2 text-[11.5px] font-bold text-[#3d3e44] hover:bg-[#f2f2f4]">Discard changes</button>
                <button onClick={() => { setToast(`${agent.name} draft saved`); closeAgentDialog(); }} className="rounded-[7px] px-3 py-2 text-[11.5px] font-bold text-white hover:opacity-90" style={{ background: ACCENT }}>Save Identity Draft</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Bulk action bar */}
      {selected.size > 0 && !openRecord && (
        <div className="reg-pop fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-[10px] bg-[#1c1c1f] px-3 py-2 text-white shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
          <span className="text-[11.5px] font-semibold">{selected.size} selected</span>
          <span className="h-4 w-px bg-white/20" />
          <button onClick={bulkAssignToMe} className="text-[11.5px] font-semibold text-white/85 hover:text-white">Assign to me</button>
          <button onClick={bulkAdvanceStage} className="text-[11.5px] font-semibold text-white/85 hover:text-white">Advance stage</button>
          <button onClick={() => setToast(`${selected.size} leads exported`)} className="text-[11.5px] font-semibold text-white/85 hover:text-white">Export</button>
          <button onClick={() => setDeleteConfirmOpen(true)} className="text-[11.5px] font-semibold text-[#ff8589] hover:text-[#ffb1b4]">Delete</button>
          <button onClick={() => setSelected(new Set())} className="ml-1 text-white/60 hover:text-white"><X size={13} /></button>
        </div>
      )}

      {/* Command palette */}
      {commandOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-24">
          <button aria-label="Close" onClick={() => setCommandOpen(false)} className="absolute inset-0 cursor-default" />
          <div className="reg-pop relative w-full max-w-[560px] overflow-hidden rounded-[12px] border border-[#e2e2e6] bg-white shadow-[0_30px_80px_rgba(20,20,25,0.24)]">
            <div className="flex items-center gap-2.5 border-b border-[#ececef] px-4 py-3">
              <MagnifyingGlass size={15} className="text-[#6b6d76]" />
              <input ref={commandInputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search or type a command…" className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#6b6d76]" />
              <button onClick={() => setCommandOpen(false)}><X size={15} /></button>
            </div>
            <div className="max-h-[380px] overflow-auto py-1.5">
              <div className="px-3 pt-1.5 text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]">Create</div>
              <button onClick={() => { setCommandOpen(false); setNewLeadOpen(true); }} className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left hover:bg-[#f2f2f4]"><Target size={14} className="text-[#6b6d76]" /> <span className="text-[12.5px]">Create lead</span></button>
              <button onClick={() => { setCommandOpen(false); setToast("Call logged"); }} className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left hover:bg-[#f2f2f4]"><Phone size={14} className="text-[#6b6d76]" /> <span className="text-[12.5px]">Log a call</span></button>

              <div className="mt-1 border-t border-[#f2f2f4] px-3 pt-2 text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]">Navigate</div>
              {allObjectNav.map(([key, label, Icon], i) => (
                <button key={key} onClick={() => navigateFromCommand(key)} className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left hover:bg-[#f2f2f4]">
                  <Icon size={14} className="text-[#6b6d76]" /> <span className="flex-1 text-[12.5px]">Go to {label}</span>
                  {i < 4 && <kbd className="rounded border border-[#ececef] px-1.5 py-0.5 text-[9px] text-[#6b6d76]">⌘{i + 1}</kbd>}
                </button>
              ))}

              <div className="mt-1 border-t border-[#f2f2f4] px-3 pt-2 text-[9.5px] font-bold uppercase tracking-wide text-[#6b6d76]">Leads</div>
              {commandResults.map((l) => (
                <button key={l.id} onClick={() => openFromCommand(l)} className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left hover:bg-[#f2f2f4]">
                  <Avatar initials={l.initials} tint={l.companyColor} size={20} />
                  <span className="min-w-0 flex-1"><b className="block truncate text-[12px]">{l.name}</b><span className="block truncate text-[10px] text-[#6b6d76]">{l.company}</span></span>
                  <ClassDot c={l.classification} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New lead dialog */}
      {newLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <button aria-label="Close" onClick={() => setNewLeadOpen(false)} className="absolute inset-0 cursor-default" />
          <form onSubmit={submitNewLead} className="reg-pop relative w-full max-w-[420px] rounded-[12px] border border-[#e2e2e6] bg-white p-5 shadow-[0_30px_80px_rgba(20,20,25,0.24)]">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-[15px] font-extrabold">Create lead</h2>
              <button type="button" onClick={() => setNewLeadOpen(false)}><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <label className="block text-[11px] font-semibold text-[#62636c]">Name
                <input required value={newLeadForm.name} onChange={(e) => setNewLeadForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full rounded-[7px] border border-[#e2e2e6] px-2.5 py-1.5 text-[12.5px] outline-none focus:border-[#3E63DD]" placeholder="Jordan Lee" />
              </label>
              <label className="block text-[11px] font-semibold text-[#62636c]">Company
                <input required value={newLeadForm.company} onChange={(e) => setNewLeadForm((f) => ({ ...f, company: e.target.value }))} className="mt-1 w-full rounded-[7px] border border-[#e2e2e6] px-2.5 py-1.5 text-[12.5px] outline-none focus:border-[#3E63DD]" placeholder="Acme Inc." />
              </label>
              <label className="block text-[11px] font-semibold text-[#62636c]">Email
                <input type="email" value={newLeadForm.email} onChange={(e) => setNewLeadForm((f) => ({ ...f, email: e.target.value }))} className="mt-1 w-full rounded-[7px] border border-[#e2e2e6] px-2.5 py-1.5 text-[12.5px] outline-none focus:border-[#3E63DD]" placeholder="jordan@acme.com" />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setNewLeadOpen(false)} className="rounded-[7px] border border-[#e2e2e6] px-3 py-1.5 text-[11.5px] font-bold text-[#3d3e44]">Cancel</button>
              <button type="submit" className="rounded-[7px] px-3 py-1.5 text-[11.5px] font-bold text-white" style={{ background: ACCENT }}>Create lead</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirm dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <button aria-label="Close" onClick={() => setDeleteConfirmOpen(false)} className="absolute inset-0 cursor-default" />
          <div className="reg-pop relative w-full max-w-[380px] rounded-[12px] border border-[#e2e2e6] bg-white p-5 shadow-[0_30px_80px_rgba(20,20,25,0.24)]">
            <div className="mb-3 flex items-start gap-2.5"><Warning size={20} weight="fill" className="text-[#E5484D]" /><h2 className="text-[14.5px] font-extrabold">Delete {selected.size} lead{selected.size === 1 ? "" : "s"}?</h2></div>
            <p className="mb-4 text-[12px] leading-relaxed text-[#62636c]">This removes the selected records from the registry. This can't be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirmOpen(false)} className="rounded-[7px] border border-[#e2e2e6] px-3 py-1.5 text-[11.5px] font-bold text-[#3d3e44]">Cancel</button>
              <button onClick={confirmDelete} className="rounded-[7px] bg-[#E5484D] px-3 py-1.5 text-[11.5px] font-bold text-white hover:opacity-90">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="reg-pop fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-[10px] bg-[#1c1c1f] px-3.5 py-2.5 text-[12px] font-semibold text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <CheckCircle size={15} weight="fill" style={{ color: "#12A594" }} /> {toast}
          <button onClick={() => setToast(null)} className="ml-1 text-white/60 hover:text-white"><X size={13} /></button>
        </div>
      )}

      <Link href="/" className="fixed bottom-4 left-4 z-20 hidden items-center gap-1.5 rounded-full border border-[#ececef] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#62636c] shadow-sm hover:text-[#1c1c1f] md:flex">
        <ArrowLeft size={12} /> Gallery
      </Link>
    </div>
  );
}
