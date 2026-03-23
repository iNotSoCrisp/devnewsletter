"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Loader2,
  MessagesSquare,
  Newspaper,
  Radar,
  Sparkles,
} from "lucide-react";

const BackgroundScene = dynamic(
  () => import("@/components/hero-scene").then((mod) => mod.BackgroundScene),
  { ssr: false, loading: () => null }
);

/* ─── animation variants ──────────────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.10 } },
};

/* ─── data ─────────────────────────────────────────────────────────────────── */
const stats = [
  { value: "88%", label: "struggle to find the right tools", detail: "Discovery is noisy, repetitive, and increasingly untrustworthy." },
  { value: "77%", label: "feel overwhelmed by launch velocity", detail: "New AI products appear faster than people can properly test them." },
  { value: "82%", label: "carry privacy and trust concerns", detail: "Virality rarely tells you if a tool is safe or workflow-ready." },
];

const insights = [
  { line: "Discovery ≠ Validation", body: "Finding a tool is not the same as knowing it survives real work.", accent: "from-cyan-300/14 via-cyan-300/6 to-transparent text-cyan-100" },
  { line: "Virality ≠ Value", body: "Viral demos rarely translate to workflow impact once the hype fades.", accent: "from-orange-300/14 via-orange-300/6 to-transparent text-orange-100" },
  { line: "Features ≠ Impact", body: "A feature list is not a workflow fit report. You need context.", accent: "from-lime-300/14 via-lime-300/6 to-transparent text-lime-100" },
];

const channels = [
  { icon: Newspaper, eyebrow: "Signal Layer", title: "Weekly Curated Newsletter", body: "A concise roundup that separates meaningful launches from disposable noise.", accent: "bg-cyan-300/12 text-cyan-100" },
  { icon: Bot, eyebrow: "Decision Layer", title: "Custom GPT", body: "An always-on guide trained on LastScroll content for fast tool comparisons.", accent: "bg-orange-300/12 text-orange-100" },
  { icon: MessagesSquare, eyebrow: "Trust Layer", title: "Private Backroom", body: "Closed-door community for honest tool feedback, edge cases, and operator insight.", accent: "bg-lime-300/12 text-lime-100" },
  { icon: Radar, eyebrow: "Discovery Layer", title: "Social Presence", body: "X, Reddit, and LinkedIn clips that build top-of-funnel pull without sacrificing credibility.", accent: "bg-white/10 text-white" },
];

/* ─── email form ───────────────────────────────────────────────────────────── */
function EmailForm({ size = "default" }: { size?: "default" | "large" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || state === "loading" || state === "done") return;
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      setState("done");
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setState("error");
    }
  };


  const inputCls = size === "large" ? "h-14 rounded-2xl px-5 text-base" : "h-11 rounded-xl px-4 text-sm";
  const btnCls = size === "large" ? "h-14 rounded-2xl px-7 text-base font-semibold" : "h-11 rounded-xl px-5 text-sm font-semibold";

  if (state === "done") {
    return (
      <motion.div
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-300" />
        <p className="text-sm leading-relaxed text-white/80">
          You&apos;re on the list. We&apos;ll reach out before launch.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
          className={`${inputCls} flex-1 border ${state === "error" ? "border-red-400/50" : "border-white/10"} bg-white/[0.05] text-white placeholder:text-white/30 outline-none transition focus:border-cyan-300/50 focus:bg-white/[0.08] backdrop-blur`}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className={`${btnCls} inline-flex shrink-0 items-center justify-center gap-2 bg-[linear-gradient(135deg,#76f2ff,#5ce0f0)] text-[#03090f] transition hover:brightness-110 disabled:opacity-60`}
        >
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>Get early access <ArrowRight className="h-4 w-4" /></>
          )}
        </button>
      </form>
      {state === "error" && errorMsg && (
        <p className="text-xs text-red-400/90 px-1">{errorMsg}</p>
      )}
    </div>
  );
}


/* ─── main component ───────────────────────────────────────────────────────── */
export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* ── fixed full-page 3D background (z-0, pointer-events none) ─────── */}
      <BackgroundScene />

      {/* ── scroll progress bar ──────────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-white/6">
        <div className="h-full w-0 bg-[linear-gradient(90deg,#76f2ff,#f7a262,#d4ff64)]" />
      </div>

      {/* ── navbar ───────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-4 z-40 px-4 md:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[#081020]/75 px-4 py-3 shadow-[0_16px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div>
            <p className="text-sm font-semibold tracking-[0.12em] text-white">LastScroll</p>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-white/55 md:flex">
            <a className="transition hover:text-white" href="#problem">Problem</a>
            <a className="transition hover:text-white" href="#channels">Channels</a>
          </nav>

          <a
            href="#early-access"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/14 bg-white/8 px-4 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/14"
          >
            Get early access
          </a>
        </div>
      </header>

      <main className="relative z-10">

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-20 text-center md:pt-36">
          <motion.div
            className="relative mx-auto max-w-4xl space-y-8"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.32em] text-white/60 backdrop-blur">
                <Sparkles className="h-3 w-3 text-cyan-300" />
                Multi-channel developer media brand
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl xl:text-8xl"
              variants={fadeUp}
            >
              Cut through AI tool hype.{" "}
              <span className="text-gradient">Keep only what works.</span>
            </motion.h1>

            <motion.p
              className="mx-auto max-w-2xl text-base leading-8 text-white/60 md:text-lg"
              variants={fadeUp}
            >
              LastScroll is a trusted validation layer for developers and tech
              enthusiasts — a weekly newsletter, a custom GPT, and a private
              community built to tell you which AI tools are genuinely worth adopting.
            </motion.p>

            <motion.div className="mx-auto max-w-lg space-y-3" variants={fadeUp}>
              <EmailForm size="large" />
              <p className="text-center font-mono text-[0.65rem] uppercase tracking-[0.3em] text-white/30">
                No spam. Early access only.
              </p>
            </motion.div>

            <motion.div className="flex flex-wrap justify-center gap-3" variants={fadeUp}>
              {["Weekly newsletter", "Custom GPT", "Private Backroom"].map((t) => (
                <span key={t} className="glass-card rounded-full px-4 py-2 text-sm text-white/55">
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ══ PROBLEM ═══════════════════════════════════════════════════════ */}
        <section id="problem" className="relative px-6 py-24 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <motion.div
              className="mb-14 max-w-2xl space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={stagger}
            >
              <motion.p className="eyebrow" variants={fadeUp}>The problem</motion.p>
              <motion.h2 className="text-4xl font-semibold leading-tight tracking-[-0.05em] text-white md:text-5xl" variants={fadeUp}>
                Developers are drowning in options, not lacking them.
              </motion.h2>
              <motion.p className="text-base leading-8 text-white/58 md:text-lg" variants={fadeUp}>
                New AI tools launch daily. The real pain is not finding them — it is
                knowing whether they survive contact with real work.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid gap-5 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={stagger}
            >
              {stats.map((s) => (
                <motion.div key={s.value} className="glass-card flex flex-col justify-between rounded-[1.8rem] p-7" variants={fadeUp}>
                  <div className="space-y-3">
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/36">User research</p>
                    <p className="text-6xl font-semibold tracking-[-0.08em] text-white">{s.value}</p>
                  </div>
                  <div className="mt-8 space-y-2">
                    <p className="text-xl font-medium leading-snug text-white/90">{s.label}</p>
                    <p className="text-sm leading-7 text-white/50">{s.detail}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ CORE INSIGHT ══════════════════════════════════════════════════ */}
        <section className="relative px-6 py-24 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <motion.div
              className="mb-14 max-w-2xl space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={stagger}
            >
              <motion.p className="eyebrow" variants={fadeUp}>Core insight</motion.p>
              <motion.h2 className="text-4xl font-semibold leading-tight tracking-[-0.05em] text-white md:text-5xl" variants={fadeUp}>
                The market keeps confusing visibility with usefulness.
              </motion.h2>
            </motion.div>

            <motion.div
              className="grid gap-5 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              {insights.map((ins) => (
                <motion.div
                  key={ins.line}
                  className={`glass-card rounded-[2rem] bg-gradient-to-b p-8 ${ins.accent}`}
                  variants={fadeUp}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/38">LastScroll lens</p>
                  <div className="story-divider my-6" />
                  <p className="text-3xl font-semibold tracking-[-0.05em] md:text-4xl">{ins.line}</p>
                  <p className="mt-5 text-sm leading-7 text-white/58">{ins.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ CHANNELS ══════════════════════════════════════════════════════ */}
        <section id="channels" className="relative px-6 py-24 md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <motion.div
              className="mb-14 max-w-2xl space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={stagger}
            >
              <motion.p className="eyebrow" variants={fadeUp}>Four-channel system</motion.p>
              <motion.h2 className="text-4xl font-semibold leading-tight tracking-[-0.05em] text-white md:text-5xl" variants={fadeUp}>
                One brand, four surfaces, one promise: trust before adoption.
              </motion.h2>
              <motion.p className="text-base leading-8 text-white/58 md:text-lg" variants={fadeUp}>
                LastScroll is not just a newsletter. It is a validation engine that
                meets you wherever discovery, research, and conviction happen.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid gap-5 md:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              {channels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <motion.div key={ch.title} className="glass-card rounded-[1.9rem] p-7 space-y-5" variants={fadeUp}>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${ch.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.26em] text-white/38">{ch.eyebrow}</p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{ch.title}</h3>
                    </div>
                    <p className="text-sm leading-7 text-white/55">{ch.body}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ══ EARLY ACCESS CTA ══════════════════════════════════════════════ */}
        <section id="early-access" className="relative px-6 py-24 md:px-10 lg:px-16">
          <motion.div
            className="relative mx-auto max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(160deg,rgba(10,17,34,0.92),rgba(6,11,22,0.75))] p-10 text-center shadow-[0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(118,242,255,0.7),transparent)]" />

            <div className="mx-auto max-w-xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.32em] text-white/60">
                <Sparkles className="h-3 w-3 text-cyan-300" />
                Early access
              </span>

              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.06em] text-white md:text-5xl">
                Be first when LastScroll{" "}
                <span className="text-gradient">goes live.</span>
              </h2>

              <p className="text-base leading-8 text-white/58">
                Join the waitlist and get early access to the newsletter, the
                private Backroom community, and the custom GPT before anyone else.
              </p>

              <div className="space-y-3">
                <EmailForm size="large" />
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-white/30">
                  No spam. Unsubscribe anytime.
                </p>
              </div>

              <div className="story-divider" />

              <div className="flex flex-wrap justify-center gap-6 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-white/36">
                <span>Newsletter market → $16.1B by 2026</span>
                <span>Tech newsletters → 34%+ open rates</span>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ── footer ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 px-6 pb-8 pt-2 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-[1.5rem] border border-white/8 bg-white/[0.02] px-5 py-5 text-sm text-white/38 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} LastScroll — The trusted filter for AI and developer tools.</p>
          <p className="font-mono uppercase tracking-[0.26em]">Built for clarity</p>
        </div>
      </footer>
    </div>
  );
}
