import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowUpRight, ArrowRight, Menu, X, Check, Cpu, Database,
  ScanLine, ShieldCheck, Eye, Layers3, Workflow, Container,
  ScanFace, Network, FileText, Activity, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InquirySection } from '@/components/inquiry';
import infrastructureImage from '@/assets/ai-infrastructure.jpg';
import founderImage from '@/assets/founder.jpeg';

export const Route = createFileRoute('/')(({
  head: () => ({
    meta: [
      { title: 'IQSAN — AI Engineer & Startup Founder' },
      { name: 'description', content: 'Production-grade AI systems for real-world operations. Explore computer vision, multimodal AI, edge infrastructure, and enterprise integration.' },
      { property: 'og:title', content: 'IQSAN — Production-grade AI. Real-world impact.' },
      { property: 'og:description', content: 'AI engineer, systems builder, and startup founder. Explore production systems and start a client, founder, or investor conversation.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Index,
}));

const systems = [
  {
    name: 'Sanad Stay',
    subtitle: 'Trust at the speed of check-in.',
    category: 'HOSPITALITY · IDENTITY · COMPLIANCE',
    icon: ScanFace,
    description: 'A complete guest verification pipeline. From multilingual identity documents to biometric checks and compliance-ready records.',
    tags: ['Multimodal OCR', 'Facial biometrics', 'Fraud detection', 'Shomoos'],
    stages: ['Document intake', 'Multilingual OCR', 'Biometric check', 'Fraud validation', 'Compliance record'],
    stageDetails: [
      'Accepts passports, national IDs, and visas from 120+ countries. Normalizes document images and extracts structured metadata for downstream processing.',
      'Multilingual OCR engine reads Arabic, English, Hindi, and 40+ scripts. Extracts name, DOB, document number, and expiry with >99% accuracy in hospitality environments.',
      'Facial liveness detection and biometric match against document photo. Prevents spoofing attacks and identity fraud at the point of check-in.',
      'Real-time cross-reference against fraud databases and watchlists. Flags anomalies and generates risk scores without blocking legitimate guests.',
      'Generates tamper-evident compliance records for UAE Shomoos and other regulatory frameworks. Audit trail is stored with full chain of custody.',
    ],
  },
  {
    name: 'Industrial Edge AI',
    subtitle: 'Intelligence on the factory floor.',
    category: 'COMPUTER VISION · EDGE INFERENCE',
    icon: ScanLine,
    description: 'Low-latency visual inspection and defect detection, built to operate at the edge and connect to industrial control systems.',
    tags: ['Computer vision', 'Edge inference', 'PLC / SCADA'],
    stages: ['Camera stream', 'Edge inference', 'Defect classification', 'PLC / SCADA', 'Event telemetry'],
    stageDetails: [
      'Industrial-grade cameras feed high-resolution streams at 30–120fps. Preprocessing handles variable lighting, occlusion, and motion blur common in factory environments.',
      'Vision models run locally on edge hardware — NVIDIA Jetson or similar. Sub-50ms inference latency without cloud round-trips. Continues operating during network outages.',
      'Hierarchical classification identifies defect type, severity, and location. Outputs structured annotations and bounding boxes for downstream systems.',
      'Validated defect signals connect directly to PLCs and SCADA systems. Triggers automated line stops, alerts, or rework routing without human intervention.',
      'All events stream to cloud analytics for trend analysis, model retraining triggers, and executive dashboards. Complete observability from edge to enterprise.',
    ],
  },
  {
    name: 'Enterprise Integration & RAG',
    subtitle: 'Enterprise knowledge. Connected.',
    category: 'RETRIEVAL · ORCHESTRATION · DATA',
    icon: Network,
    description: 'Multi-tenant document processing and semantic retrieval, connected to enterprise workflows with grounded answers and guardrails.',
    tags: ['RAG pipelines', 'Tenant isolation', 'ERP integration'],
    stages: ['Enterprise sources', 'Parse & index', 'Semantic retrieval', 'Grounded generation', 'Audit & integration'],
    stageDetails: [
      'Ingests from SharePoint, SAP, Oracle, Confluence, email, and custom APIs. Handles PDF, DOCX, XLSX, and structured data with tenant-isolated processing queues.',
      'Intelligent chunking and metadata extraction preserves document context. Hybrid embedding (dense + sparse) ensures retrieval works for both semantic and keyword queries.',
      'Multi-step retrieval with re-ranking and cross-encoder scoring. Context window management ensures relevant passages reach the generation model without truncation.',
      'LLM generation is grounded to retrieved sources with citation tracking. Guardrails prevent hallucination and enforce policy constraints on sensitive topics.',
      'Every query and response is logged with source attribution for compliance. Output connects to ERP workflows, email, and Slack — closing the loop from question to action.',
    ],
  },
];

const capabilities = [
  {
    icon: Eye,
    title: 'Computer Vision',
    text: 'From pixels to operational decisions.',
    skills: ['Multilingual OCR & document AI', 'Object detection & visual inspection', 'Facial biometrics & identity verification'],
    tools: 'PyTorch / OpenCV / Transformers',
  },
  {
    icon: Layers3,
    title: 'Multimodal & LLM Systems',
    text: 'Models orchestrated into useful systems.',
    skills: ['Retrieval-augmented generation', 'Multimodal reasoning & orchestration', 'Grounding, evaluations & guardrails'],
    tools: 'LLMs / Vector search / RAG',
  },
  {
    icon: Workflow,
    title: 'Distributed Real-time Systems',
    text: 'Reliable under real-world pressure.',
    skills: ['Event-driven data pipelines', 'Edge-to-cloud architecture', 'ERP, PLC & SCADA integration'],
    tools: 'Kafka / FastAPI / PostgreSQL',
  },
  {
    icon: Container,
    title: 'Production MLOps',
    text: 'The last mile is part of the product.',
    skills: ['Model serving & deployment', 'Observability & performance tracing', 'Versioning, rollback & monitoring'],
    tools: 'Docker / CI/CD / Edge deployment',
  },
];

const nodes = [
  { label: 'INGEST', icon: ScanLine, detail: 'Documents, camera streams, and enterprise events enter the pipeline.' },
  { label: 'INFER', icon: Cpu, detail: 'Vision models and multimodal orchestration turn raw inputs into signals.' },
  { label: 'VALIDATE', icon: ShieldCheck, detail: 'Deterministic checks, grounding, and policy controls validate decisions.' },
  { label: 'DEPLOY', icon: Database, detail: 'Validated outcomes connect to enterprise systems with auditable records.' },
];

const navLinks = ['Systems', 'Capabilities', 'Philosophy', 'About'];

function useActiveSection() {
  const [active, setActive] = useState('');
  useEffect(() => {
    const sections = navLinks.map((n) => document.getElementById(n.toLowerCase())).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  return active;
}

function Index() {
  const [menu, setMenu] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);
  const [stage, setStage] = useState(0);
  const [node, setNode] = useState(1);
  const activeSection = useActiveSection();
  const selected = preview === null ? undefined : systems[preview];

  function closeMenu() {
    setMenu(false);
  }

  return (
    <div>
      <a className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-primary focus:p-4 focus:text-primary-foreground" href="#main">
        Skip to content
      </a>

      {/* ─── Header ─── */}
      <header className="site-header">
        <div className="page-width flex h-full items-center justify-between gap-4">
          <a href="#main" className="brand" aria-label="IQSAN home">
            <span className="brand-mark">[i]</span>IQSAN<span className="text-primary">.</span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {navLinks.map((n) => (
              <a
                className={`text-xs transition-colors hover:text-foreground ${activeSection === n.toLowerCase() ? 'text-foreground' : 'text-muted-foreground'}`}
                href={`#${n.toLowerCase()}`}
                key={n}
              >
                {n}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 font-mono text-[9px] text-muted-foreground xl:flex">
              <span className="status-dot" /> AVAILABLE FOR SELECT WORK
            </span>
            <Button asChild className="h-9 px-4 text-xs">
              <a href="#inquiry">
                Let's talk <ArrowUpRight />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={menu ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {menu && (
          <nav aria-label="Mobile navigation" className="absolute left-0 right-0 flex flex-col border-b border-border bg-background p-5 md:hidden">
            {navLinks.map((n) => (
              <Button asChild variant="ghost" className="justify-start" key={n}>
                <a href={`#${n.toLowerCase()}`} onClick={closeMenu}>
                  {n}
                </a>
              </Button>
            ))}
            <Button asChild className="mt-3 justify-start" onClick={closeMenu}>
              <a href="#inquiry">
                Let's talk <ArrowUpRight />
              </a>
            </Button>
          </nav>
        )}
      </header>

      <main id="main">
        {/* ─── Hero ─── */}
        <section className="hero">
          <img
            src={infrastructureImage}
            alt="AI processor connected to high-performance circuit infrastructure"
            width={1920}
            height={1024}
            fetchPriority="high"
            className="hero-image"
          />

          <div className="page-width hero-content">
            <a href="#inquiry" className="availability transition-all hover:border-primary/80 hover:text-foreground">
              <span className="status-dot" /> AVAILABLE FOR Q2 CONSULTING & SELECT VENTURES <ArrowUpRight className="size-3" />
            </a>

            <p className="mt-7 font-mono text-[10px] text-muted-foreground">
              AI ENGINEER <span className="px-2 text-primary">/</span> SYSTEMS BUILDER <span className="px-2 text-primary">/</span> STARTUP FOUNDER
            </p>

            <h1 className="hero-title">
              Production-grade AI.<br />
              <span className="text-primary">Real-world impact.</span>
            </h1>

            <p className="hero-copy">
              I build production-grade AI systems that turn complex real-world operations into intelligent, measurable infrastructure.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="h-11 px-5 text-xs">
                <a href="#inquiry">Work with me <ArrowUpRight /></a>
              </Button>
              <Button asChild variant="outline" className="h-11 bg-background/50 px-5 text-xs">
                <a href="#systems">Explore production systems <ArrowRight /></a>
              </Button>
            </div>

            {/* Architecture flow diagram */}
            <div className="architecture-flow">
              <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>SYSTEM ARCHITECTURE</span>
                <span>v.01</span>
              </div>
              <div className="my-5 flex items-center gap-2">
                {nodes.map((n, i) => (
                  <div className="contents" key={n.label}>
                    {i > 0 && (
                      <div className="flow-link">
                        <span />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      className={`flow-node ${node === i ? 'selected' : ''}`}
                      aria-label={`Inspect ${n.label.toLowerCase()} stage`}
                      aria-pressed={node === i}
                      onClick={() => setNode(i)}
                    >
                      <n.icon />
                      <span>{n.label}</span>
                    </Button>
                  </div>
                ))}
              </div>
              <p className="min-h-10 text-xs leading-5 text-muted-foreground" aria-live="polite">
                {nodes[node]?.detail}
              </p>
            </div>
          </div>

          <div className="hero-annotation">
            <p className="flex items-center gap-2 text-success">
              <span className="status-dot" />PRODUCTION BY DESIGN
            </p>
            <p className="mt-2 text-muted-foreground">VISION → INTELLIGENCE → ACTION</p>
          </div>
        </section>

        {/* ─── Metrics band ─── */}
        <div className="metrics-band">
          <div className="page-width grid grid-cols-2 md:grid-cols-4">
            {[
              { value: '< 5s', label: 'MULTIMODAL LATENCY', icon: Activity },
              { value: 'Real-time', label: 'VISION THROUGHPUT', icon: Cpu },
              { value: 'Multilingual', label: 'OCR CAPABILITY', icon: FileText },
              { value: 'Edge + cloud', label: 'DEPLOYMENT ARCHITECTURE', icon: Network },
            ].map((m) => (
              <div className="metric" key={m.label}>
                <div className="flex items-center gap-3">
                  <m.icon className="size-4 text-primary" />
                  <span className="metric-value">{m.value}</span>
                </div>
                <p className="metric-label">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Systems ─── */}
        <section id="systems" className="section-band">
          <div className="page-width">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="eyebrow">01 / SELECTED PRODUCTION SYSTEMS</p>
                <h2 className="section-title mt-3">
                  Built for the world.<br />
                  <span className="text-muted-foreground">Not just the demo.</span>
                </h2>
              </div>
              <p className="section-description">
                Real constraints. Complex environments.<br />
                Systems engineered from ingestion to impact.
              </p>
            </div>

            <div className="system-grid">
              {systems.map((s, i) => (
                <article
                  className="system-card cursor-pointer group"
                  key={s.name}
                  onClick={() => { setPreview(i); setStage(0); }}
                >
                  <div className="system-visual">
                    <p className="absolute left-4 top-3 flex items-center gap-2 font-mono text-[8px] text-muted-foreground">
                      <span className="status-dot" />
                      {i === 0 ? 'FLAGSHIP VENTURE' : 'PRODUCTION SYSTEM'}
                    </p>
                    <div className="flex h-full items-center justify-center gap-5">
                      <div className="flex size-20 items-center justify-center rounded border border-primary/40 bg-background/80">
                        <s.icon className="size-9 text-primary" />
                      </div>
                      <div className="font-mono text-[9px] leading-6 text-muted-foreground">
                        <p className="text-success">
                          ● {i === 0 ? 'IDENTITY PIPELINE' : i === 1 ? 'EDGE INFERENCE' : 'GROUNDED RETRIEVAL'}
                        </p>
                        <p>→ VALIDATE</p>
                        <p>→ INTEGRATE</p>
                      </div>
                    </div>
                  </div>

                  <div className="system-body">
                    <p className="system-category">{s.category}</p>
                    <h3>{s.name}</h3>
                    <p className="mt-2">{s.subtitle}</p>
                    <p className="mt-4">{s.description}</p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {s.tags.map((t) => (
                        <span className="technical-tag" key={t}>{t}</span>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      className="mt-auto justify-between px-0 pt-8 text-xs"
                      onClick={() => { setPreview(i); setStage(0); }}
                    >
                      Explore architecture <ArrowUpRight />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Capabilities ─── */}
        <section id="capabilities" className="section-band">
          <div className="page-width">
            <p className="eyebrow">02 / THE TECHNICAL MOAT</p>
            <h2 className="section-title mt-3">Depth across the entire stack.</h2>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map((c) => (
                <article className="capability" key={c.title}>
                  <c.icon className="mb-6 size-6 text-primary" />
                  <h3>{c.title}</h3>
                  <p className="mt-3 min-h-10 text-xs leading-5 text-muted-foreground">{c.text}</p>
                  <ul className="mt-5">
                    {c.skills.map((s) => (
                      <li key={s}>
                        <span className="size-1 shrink-0 rounded-full bg-primary" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-t border-border pt-4 font-mono text-[8px] leading-5 text-muted-foreground">
                    {c.tools}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Philosophy ─── */}
        <section id="philosophy" className="section-band">
          <div className="page-width">
            <p className="eyebrow">03 / ENGINEERING PHILOSOPHY</p>
            <h2 className="section-title mt-3">
              Intelligence is only useful<br />
              <span className="text-muted-foreground">when the system works.</span>
            </h2>
            <div className="mt-9 grid gap-9 md:grid-cols-3">
              {[
                ['01', 'Deterministic where it matters.', 'Use AI for perception and reasoning. Use explicit rules for critical decisions. Reliability is an architectural choice, not a prompt.'],
                ['02', 'Close to the problem. Fast by design.', 'Run intelligence at the edge when latency, connectivity, and privacy demand it. Design for the constraints of the actual environment.'],
                ['03', 'Measure outcomes. Not model hype.', 'A system should improve an operation, not just a benchmark. Define success in business terms and instrument the path to it.'],
              ].map(([n, t, d]) => (
                <article className="principle" key={n}>
                  <span className="font-mono text-xs text-primary">/{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── About ─── */}
        <section id="about" className="section-band">
          <div className="page-width grid items-center gap-12 md:grid-cols-[.7fr_1.3fr]">
            <div className="founder-monogram">
              <img
                src={founderImage}
                alt="IQSAN — AI Engineer & Startup Founder"
                width={400}
                height={348}
                loading="lazy"
              />
              <div className="founder-overlay" />
              <p className="absolute bottom-5 left-5 z-10 font-mono text-[9px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded backdrop-blur-sm border border-border/60">
                ENGINEER. BUILDER. FOUNDER.
              </p>
            </div>
            <div>
              <p className="eyebrow">04 / THE FOUNDER</p>
              <h2 className="section-title mt-3">
                I'm IQSAN.<br />
                <span className="text-muted-foreground">I connect AI to the real world.</span>
              </h2>
              <p className="mt-6 text-sm leading-7 text-muted-foreground">
                My work sits at the intersection of AI engineering, distributed systems, and product execution. I build across hospitality, industrial environments, and enterprise operations — where the last mile matters as much as the model.
              </p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                From a camera on a factory floor to a compliance-aware identity pipeline, the goal is the same: make complex operations more intelligent, reliable, and measurable.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {['AI Engineering', 'Systems Architecture', 'Venture Building'].map((t) => (
                  <span className="technical-tag" key={t}>{t}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button asChild className="h-9 px-4 text-xs">
                  <a href="#inquiry">
                    Start a conversation <ArrowUpRight />
                  </a>
                </Button>
                <a
                  href="mailto:mohamediqsan23@gmail.com"
                  className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  mohamediqsan23@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>

        <InquirySection />
      </main>

      {/* ─── Footer ─── */}
      <footer className="page-width flex flex-wrap items-center justify-between gap-5 py-8">
        <a href="#main" className="brand text-base">
          <span className="brand-mark text-xl">[i]</span>IQSAN.
        </a>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <a
            href="mailto:mohamediqsan23@gmail.com"
            className="font-mono text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            mohamediqsan23@gmail.com
          </a>
          <span className="hidden text-border sm:inline">•</span>
          <p className="font-mono text-[9px] text-muted-foreground">© 2026 IQSAN. BUILT WITH INTENT.</p>
        </div>
        <a href="#inquiry" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          Let's build something that matters <ArrowUpRight className="size-3" />
        </a>
      </footer>

      {/* ─── System architecture dialog ─── */}
      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setPreview(null); }}>
        <DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto bg-card p-7 sm:p-10">
          {selected && (
            <>
              <p className="eyebrow">SYSTEM ARCHITECTURE</p>
              <DialogTitle className="text-3xl">{selected.name}</DialogTitle>
              <DialogDescription className="leading-7">{selected.description}</DialogDescription>

              <div className="my-5 flex flex-wrap items-center gap-3">
                {selected.stages.map((s, i) => (
                  <Button
                    key={s}
                    variant={stage === i ? 'default' : 'outline'}
                    className="h-auto min-h-14 whitespace-normal text-left"
                    onClick={() => setStage(i)}
                  >
                    <span className="font-mono text-xs opacity-60">0{i + 1}</span>
                    {s}
                  </Button>
                ))}
              </div>

              <div className="border-t border-border pt-5">
                <p className="eyebrow">ACTIVE STAGE / 0{stage + 1}</p>
                <h3 className="mt-2 text-lg">{selected.stages[stage]}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {selected.stageDetails[stage]}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setPreview(null)}
                  className="justify-self-start"
                >
                  <X />Close preview
                </Button>
                <Button asChild>
                  <a href="#inquiry" onClick={() => setPreview(null)}>
                    Start a conversation <ExternalLink className="size-4" />
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
