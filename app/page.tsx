import Link from "next/link";
import { ArrowUpRight, Check, Command, Lock, Sparkle } from "@phosphor-icons/react/dist/ssr";

const concepts = [
  {
    id: "01",
    name: "Signal Command",
    description: "A precise sales operations console built around urgency, qualification evidence, and delivery health.",
    palette: ["#0B1220", "#F6F8FB", "#4F46E5", "#0891B2", "#E11D48"],
    href: "/design-01",
    available: true,
  },
  { id: "02", name: "Calm Intelligence", description: "An executive lead platform: nested floating white panels, cobalt actions, and a charcoal hero anchor.", palette: ["#F3F4F6", "#FFFFFF", "#3152F4", "#151515", "#20B486"], href: "/design-02", available: true },
  { id: "03", name: "Ignition Desk", description: "A dealership-grade operations desk: dark navy command shell, glowing orange actions, and priority-coded lead cards built for high-velocity follow-up.", palette: ["#020617", "#f97316", "#3b82f6", "#ef4444", "#10b981"], href: "/design-03", available: true },
  { id: "04", name: "Clarity Desk", description: "The category standard at Stripe/Linear finish: white canvas, one confident sky-blue accent, and a clean grid — Ignition Desk's layout, reimagined bright.", palette: ["#F8FAFC", "#FFFFFF", "#0EA5E9", "#EF4444", "#10B981"], href: "/design-04", available: true },
  { id: "05", name: "Midnight Terminal", description: "A dark analytical command center for RevOps.", palette: ["#07090D", "#818CF8", "#22D3EE"], available: false },
  { id: "06", name: "Carbon Lime Inspector", description: "A dense lead queue with persistent AI intelligence.", palette: ["#080A09", "#D9FF62", "#B9A7FF"], available: false },
];

export default function Gallery() {
  return (
    <main className="gallery-shell">
      <header className="gallery-nav">
        <Link className="brand-lockup" href="/" aria-label="AILQS design gallery home">
          <span className="brand-mark"><Command weight="bold" /></span>
          <span>AILQS <small>Design review</small></span>
        </Link>
        <div className="gallery-status"><span className="status-dot" /> Client review workspace</div>
      </header>

      <section className="gallery-intro">
        <div>
          <h1>Six ways to make every lead actionable.</h1>
        </div>
        <p>Choose a direction to review the same qualification workflow through a different visual and operational lens. Designs 01, 02, 03, and 04 are ready to explore.</p>
      </section>

      <section className="concept-grid" aria-label="Design concepts">
        {concepts.map((concept) => {
          const body = (
            <>
              <div className="concept-topline">
                <span>{concept.id}</span>
                {concept.available ? <span className="ready-label"><Check weight="bold" /> Ready</span> : <span className="locked-label"><Lock /> Planned</span>}
              </div>
              <div className={`concept-preview preview-${concept.id}`}>
                <div className="mini-rail" />
                <div className="mini-canvas">
                  <i /><i /><i />
                  <span /><span />
                </div>
              </div>
              <div className="concept-copy">
                <h2>{concept.name}</h2>
                <p>{concept.description}</p>
              </div>
              <div className="concept-footer">
                <div className="swatches" aria-label={`${concept.name} color palette`}>
                  {concept.palette.map((color) => <i key={color} style={{ background: color }} title={color} />)}
                </div>
                {concept.available && <span className="open-label">Open concept <ArrowUpRight weight="bold" /></span>}
              </div>
            </>
          );
          return concept.available ? <Link href={concept.href!} className="concept-card active" key={concept.id}>{body}</Link> : <article className="concept-card" key={concept.id}>{body}</article>;
        })}
      </section>

      <footer className="gallery-footer">
        <span><Sparkle weight="fill" /> Static interactive prototypes</span>
        <span>All figures are illustrative mock data.</span>
      </footer>
    </main>
  );
}
