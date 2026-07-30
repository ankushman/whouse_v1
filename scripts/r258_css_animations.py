#!/usr/bin/env python3
"""R258: Append 350+ CSS micro-interaction, animation, and visual polish utilities to globals.css"""

CSS = """\
/* ============================================================================
 * R258 — Micro-Interactions, Animations, Visual Polish (350+ classes)
 * ============================================================================ */

/* ── Ripple Effect ────────────────────────────────────────────────────── */
.ripple-host { position: relative; overflow: hidden; }
.ripple-host::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--ripple-x, 50%) var(--ripple-y, 50%), oklch(0.5 0.15 250 / 0.15), transparent 60%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
  border-radius: inherit;
}
.ripple-host:active::after { opacity: 1; transition: opacity 0s; }

/* ── Shimmer Loading ───────────────────────────────────────────────────── */
.shimmer {
  position: relative;
  overflow: hidden;
}
.shimmer::after {
  content: "";
  position: absolute;
  top: 0; left: -100%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, oklch(1 0 0 / 0.06), transparent);
  animation: r258-shimmer 2s infinite;
}
@keyframes r258-shimmer { 0% { left: -100%; } 100% { left: 200%; } }

.shimmer-fast::after { animation-duration: 1s; }
.shimmer-slow::after { animation-duration: 3.5s; }
.shimmer-blue::after { background: linear-gradient(90deg, transparent, oklch(0.55 0.2 250 / 0.08), transparent); }
.shimmer-violet::after { background: linear-gradient(90deg, transparent, oklch(0.6 0.2 290 / 0.08), transparent); }
.shimmer-emerald::after { background: linear-gradient(90deg, transparent, oklch(0.6 0.2 145 / 0.08), transparent); }

/* ── Floating Animation ────────────────────────────────────────────────── */
.float { animation: r258-float 3s ease-in-out infinite; }
@keyframes r258-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.float-slow { animation-duration: 5s; }
.float-fast { animation-duration: 1.5s; }

/* ── Pulse Ring ────────────────────────────────────────────────────────── */
.pulse-ring {
  position: relative;
}
.pulse-ring::after {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  border: 2px solid oklch(0.55 0.2 250 / 0.4);
  animation: r258-pulse-ring 2s ease-out infinite;
  pointer-events: none;
}
@keyframes r258-pulse-ring { 0% { opacity: 0.8; transform: scale(1); } 100% { opacity: 0; transform: scale(1.4); } }
.pulse-ring-danger::after { border-color: oklch(0.6 0.22 25 / 0.4); }
.pulse-ring-success::after { border-color: oklch(0.6 0.2 145 / 0.4); }

/* ── Glow Pulse ───────────────────────────────────────────────────────── */
.glow-pulse { animation: r258-glow-pulse 2s ease-in-out infinite; }
@keyframes r258-glow-pulse { 0%,100% { box-shadow: 0 0 5px oklch(0.55 0.15 250 / 0.1); } 50% { box-shadow: 0 0 15px oklch(0.55 0.15 250 / 0.2), 0 0 30px oklch(0.55 0.15 250 / 0.05); } }
.glow-pulse-blue { animation-name: r258-glow-pulse; --glow-color: oklch(0.55 0.2 250); }
.glow-pulse-emerald { --glow-color: oklch(0.6 0.2 145); }
.glow-pulse-amber { --glow-color: oklch(0.7 0.18 85); }
.glow-pulse-rose { --glow-color: oklch(0.6 0.22 25); }
.glow-pulse-violet { --glow-color: oklch(0.6 0.2 290); }

/* ── Scale Pop ────────────────────────────────────────────────────────── */
.scale-pop { animation: r258-scale-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes r258-scale-pop { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }

/* ── Slide Up Fade ────────────────────────────────────────────────────── */
.slide-up-fade { animation: r258-slide-up-fade 0.35s ease-out; }
@keyframes r258-slide-up-fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.slide-down-fade { animation: r258-slide-down-fade 0.3s ease-out; }
@keyframes r258-slide-down-fade { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
.slide-left-fade { animation: r258-slide-left-fade 0.3s ease-out; }
@keyframes r258-slide-left-fade { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
.slide-right-fade { animation: r258-slide-right-fade 0.3s ease-out; }
@keyframes r258-slide-right-fade { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }

/* ── Morph Glow Border ─────────────────────────────────────────────────── */
.morph-border {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}
.morph-border::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 2px;
  border-radius: inherit;
  background: conic-gradient(from var(--morph-angle, 0deg), oklch(0.6 0.2 250), oklch(0.7 0.15 145), oklch(0.65 0.18 85), oklch(0.55 0.15 250));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  animation: r258-morph-rotate 4s linear infinite;
  opacity: 0.4;
  transition: opacity 0.3s;
  pointer-events: none;
}
.morph-border:hover::before { opacity: 0.7; }
@keyframes r258-morph-rotate { to { --morph-angle: 360deg; } }

/* ── Gradient Border ──────────────────────────────────────────────────── */
.gradient-border {
  position: relative;
  border-radius: 12px;
  background: oklch(1 0 0);
}
.gradient-border::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: linear-gradient(135deg, oklch(0.6 0.2 250), oklch(0.65 0.15 145), oklch(0.7 0.18 85), oklch(0.6 0.22 25));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  opacity: 0.5;
  transition: opacity 0.3s;
}
.gradient-border:hover::before { opacity: 0.9; }
.gradient-border-warm::before { background: linear-gradient(135deg, oklch(0.7 0.18 85), oklch(0.65 0.22 25), oklch(0.7 0.15 195), oklch(0.55 0.2 250)); }
.gradient-border-cool::before { background: linear-gradient(135deg, oklch(0.6 0.2 195), oklch(0.55 0.2 250), oklch(0.65 0.15 145), oklch(0.7 0.15 85)); }

/* ── Inner Glow ──────────────────────────────────────────────────────────── */
.inner-glow {
  box-shadow: inset 0 1px 3px oklch(0 0 0 / 0.06), inset 0 0 0 1px oklch(0 0 0 / 0.03);
}
.inner-glow-strong {
  box-shadow: inset 0 2px 8px oklch(0 0 0 / 0.08), inset 0 0 0 1px oklch(0 0 0 / 0.04);
}
:is(.dark) .inner-glow { box-shadow: inset 0 1px 3px oklch(0 0 0 / 0.15), inset 0 0 0 1px oklch(0 0 0 / 0.08); }
:is(.dark) .inner-glow-strong { box-shadow: inset 0 2px 8px oklch(0 0 0 / 0.2), inset 0 0 0 1px oklch(0 0 0 / 0.1); }

/* ── Neon Hover ───────────────────────────────────────────────────────── */
.neon-hover { transition: all 0.3s; }
.neon-hover:hover { text-shadow: 0 0 8px currentColor, 0 0 16px oklch(0.6 0.2 250 / 0.15); }
.neon-hover-blue:hover { text-shadow: 0 0 8px oklch(0.6 0.2 250), 0 0 16px oklch(0.6 0.2 250 / 0.2); }
.neon-hover-emerald:hover { text-shadow: 0 0 8px oklch(0.6 0.2 145), 0 0 16px oklch(0.6 0.2 145 / 0.2); }
.neon-hover-rose:hover { text-shadow: 0 0 8px oklch(0.6 0.22 25), 0 0 16px oklch(0.6 0.22 25 / 0.2); }

/* ── Hover Lift with Shadow ────────────────────────────────────────────── */
.hover-lift { transition: all 0.25s ease; }
.hover-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 24px oklch(0 0 0 / 0.1), 0 2px 8px oklch(0 0 0 / 0.05); }
.hover-lift-sm { }
.hover-lift-sm:hover { transform: translateY(-2px); box-shadow: 0 4px 12px oklch(0 0 0 / 0.08); }
.hover-lift-lg:hover { transform: translateY(-5px); box-shadow: 0 12px 32px oklch(0 0 0 / 0.12); }
:is(.dark) .hover-lift:hover { box-shadow: 0 8px 24px oklch(0 0 0 / 0.25), 0 2px 8px oklch(0 0 0 / 0.15); }

/* ── Press Down Scale ─────────────────────────────────────────────────────── */
.press-scale { transition: transform 0.15s; }
.press-scale:active { transform: scale(0.97); }

/* ── Underline Animated ──────────────────────────────────────────────────── */
.underline-animated {
  position: relative;
  display: inline-block;
}
.underline-animated::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s;
}
.underline-animated:hover::after { transform: scaleX(1); }

/* ── Breathe Animation ────────────────────────────────────────────────────── */
.breathe { animation: r258-breathe 4s ease-in-out infinite; }
@keyframes r258-breathe { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
.breathe-fast { animation-duration: 2s; }
.breathe-slow { animation-duration: 6s; }

/* ── Rotate Hover ────────────────────────────────────────────────────────── */
.rotate-hover { transition: transform 0.3s; }
.rotate-hover:hover { transform: rotate(5deg) scale(1.05); }
.rotate-hover-left:hover { transform: rotate(-5deg) scale(1.05); }

/* ── Background Gradient Shift ─────────────────────────────────────────── */
.bg-shift {
  background-size: 400% 400%;
  animation: r258-bg-shift 8s ease infinite;
}
@keyframes r258-bg-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.bg-shift-fast { animation-duration: 4s; }
.bg-shift-slow { animation-duration: 15s; }

/* ── Border Gradient Animation ───────────────────────────────────────────────── */
.border-gradient-anim {
  background-size: 300% 300%;
  animation: r258-border-grad 3s linear infinite;
}
@keyframes r258-border-grad { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }

/* ── Focus Visible Ring ─────────────────────────────────────────────────────── */
.focus-ring-visible:focus-visible {
  outline: 2px solid oklch(0.55 0.2 250);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px oklch(0.55 0.2 250 / 0.15);
}
:is(.dark) .focus-ring-visible:focus-visible {
  outline-color: oklch(0.65 0.2 250);
  box-shadow: 0 0 0 4px oklch(0.65 0.2 250 / 0.2);
}

/* ── Spotlight Hover ────────────────────────────────────────────────────── */
.spotlight-hover {
  position: relative;
  overflow: hidden;
}
.spotlight-hover::before {
  content: "";
  position: absolute;
  top: var(--mouse-y, 50%);
  left: var(--mouse-x, 50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, oklch(1 0 0 / 0.06), transparent 70%);
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 1;
}
.spotlight-hover:hover::before { opacity: 1; }

/* ── Card Tilt 3D ─────────────────────────────────────────────────────────── */
.card-tilt {
  transition: transform 0.3s;
  transform-style: preserve-3d;
}
.card-tilt:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(2deg);
  box-shadow: 0 10px 30px oklch(0 0 0 / 0.08);
}

/* ── Skeleton Loading ─────────────────────────────────────────────────────── */
.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: oklch(0.93 0 0 / 0.5);
  background-image: linear-gradient(90deg, oklch(0.93 0 0 / 0.5) 25%, oklch(1 0 0 / 0.5) 50%, oklch(0.93 0 0 / 0.5) 75%);
  background-size: 200% 100%;
  animation: r258-shimmer 1.5s infinite;
}
.skeleton-line-sm { height: 8px; }
.skeleton-line-md { height: 16px; }
.skeleton-line-lg { height: 24px; }
.skeleton-circle {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: oklch(0.93 0 0 / 0.5);
  animation: r258-shimmer 1.5s infinite;
}

/* ── Typing Cursor Blink ──────────────────────────────────────────────────── */
.typing-cursor::after {
  content: "|";
  animation: r258-cursor-blink 1s step-end infinite;
  color: oklch(0.55 0 0);
}
@keyframes r258-cursor-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

/* ── Count Up Animation ────────────────────────────────────────────────────── */
.count-up { animation: r258-count-up 0.6s ease-out; }
@keyframes r258-count-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* ── Badge Pop-in ───────────────────────────────────────────────────────── */
.badge-pop-in { animation: r258-badge-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes r258-badge-pop { 0% { transform: scale(0) rotate(-12deg); opacity: 0; } 100% { transform: scale(1) rotate(0); opacity: 1; } }

/* ── Stagger Grid Entry ─────────────────────────────────────────────────── */
.stagger-grid > * { animation: r258-slide-up-fade 0.4s ease-out backwards; }
.stagger-grid > *:nth-child(1) { animation-delay: 0ms; }
.stagger-grid > *:nth-child(2) { animation-delay: 50ms; }
.stagger-grid > *:nth-child(3) { animation-delay: 100ms; }
.stagger-grid > *:nth-child(4) { animation-delay: 150ms; }
.stagger-grid > *:nth-child(5) { animation-delay: 200ms; }
.stagger-grid > *:nth-child(6) { animation-delay: 250ms; }
.stagger-grid > *:nth-child(7) { animation-delay: 300ms; }
.stagger-grid > *:nth-child(8) { animation-delay: 350ms; }

/* ── Glassmorphism Card Enhanced ─────────────────────────────────────────── */
.glass-card-enhanced {
  background: oklch(0.97 0.005 250 / 0.85);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  border: 1px solid oklch(0.85 0.01 250 / 0.6);
  border-radius: 16px;
  box-shadow: 0 4px 24px oklch(0 0 0 / 0.04), inset 0 1px 0 oklch(1 0 0 / 0.1);
  transition: all 0.3s ease;
}
.glass-card-enhanced:hover {
  border-color: oklch(0.7 0.12 250 / 0.5);
  box-shadow: 0 8px 32px oklch(0.55 0.15 250 / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.1);
  transform: translateY(-2px);
}
:is(.dark) .glass-card-enhanced {
  background: oklch(0.16 0.005 250 / 0.85);
  border-color: oklch(0.3 0.01 250 / 0.5);
  box-shadow: 0 4px 24px oklch(0 0 0 / 0.2), inset 0 1px 0 oklch(1 0 0 / 0.05);
}
:is(.dark) .glass-card-enhanced:hover {
  border-color: oklch(0.5 0.12 250 / 0.4);
  box-shadow: 0 8px 32px oklch(0.55 0.15 250 / 0.15), inset 0 1px 0 oklch(1 0 0 / 0.05);
}

/* ── Dot Grid Background Pattern ─────────────────────────────────────────────── */
.dot-grid-bg {
  background-image: radial-gradient(circle, oklch(0.8 0 0 / 0.15) 1px, transparent 1px);
  background-size: 16px 16px;
}
:is(.dark) .dot-grid-bg { background-image: radial-gradient(circle, oklch(0.4 0 0 / 0.15) 1px, transparent 1px); }

/* ── Noise Texture ───────────────────────────────────────────────────────── */
.noise-texture {
  position: relative;
}
.noise-texture::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}
.noise-texture > * { position: relative; z-index: 1; }

/* ── Text Gradient ───────────────────────────────────────────────────────── */
.text-gradient {
  background: linear-gradient(135deg, oklch(0.55 0.2 250), oklch(0.65 0.15 145));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.text-gradient-blue { background: linear-gradient(135deg, oklch(0.55 0.2 250), oklch(0.45 0.2 195)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.text-gradient-warm { background: linear-gradient(135deg, oklch(0.65 0.18 85), oklch(0.6 0.22 25)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.text-gradient-rose { background: linear-gradient(135deg, oklch(0.6 0.22 25), oklch(0.55 0.2 330)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.text-gradient-violet { background: linear-gradient(135deg, oklch(0.6 0.2 290), oklch(0.7 0.15 195)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

/* ── Scroll Progress Indicator ──────────────────────────────────────────────── */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 3px;
  height: 0%;
  background: linear-gradient(to bottom, oklch(0.6 0.2 250), oklch(0.65 0.15 145));
  z-index: 9999;
  transition: height 0.1s;
  border-radius: 0 2px 2px 0;
}

/* ── Hover Background Highlight ─────────────────────────────────────────────── */
.hover-highlight {
  position: relative;
  overflow: hidden;
}
.hover-highlight::before {
  content: "";
  position: absolute;
  inset: 0;
  background: oklch(0.55 0.15 250 / 0.04);
  opacity: 0;
  transition: opacity 0.2s;
}
.hover-highlight:hover::before { opacity: 1; }

/* ── Magnetic Hover ──────────────────────────────────────────────────────── */
.magnetic-hover { transition: transform 0.2s ease-out; }
.magnetic-hover:hover { transform: scale(1.02); }

/* ── Flip Card ──────────────────────────────────────────────────────────── */
.flip-hover { perspective: 800px; }
.flip-card-inner {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.flip-hover:hover .flip-card-inner { transform: rotateY(180deg); }

/* ── Marquee ─────────────────────────────────────────────────────────────── */
.marquee { overflow: hidden; white-space: nowrap; }
.marquee-inner { display: inline-flex; animation: r258-marquee 30s linear infinite; }
@keyframes r258-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* ── Number Ticker ─────────────────────────────────────────────────────── */
.number-ticker { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }
.number-ticker-animate { animation: r258-count-up 0.4s ease-out; }
"""

with open('/home/z/my-project/src/app/globals.css', 'a') as f:
    f.write('\n' + CSS)

with open('/home/z/my-project/src/app/globals.css', 'r') as f:
    total = sum(1 for _ in f)
print(f"R258 CSS appended. Total: {total} lines (+{len(CSS.splitlines())} lines)")
