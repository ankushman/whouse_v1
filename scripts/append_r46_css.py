#!/usr/bin/env python3
"""Append Round 46 CSS micro-interactions for Procurement/PO module."""
from pathlib import Path

CSS = """
/* ════════════════════════════════════════════════════════════════════════════
   ROUND 46 — Procurement & Purchase Orders Module — CSS Micro-interactions
   30+ classes covering: KPI entrance, chart hover lifts, row entrance with
   accent bars, status-aware row variants (critical/warning), rank glow,
   drawer sheen, tab transitions, stat staggered entrance, body fade-up,
   card hover lifts, progress fill animations, search focus, approval step
   entrance, and tab indicator slide.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── KPI staggered entrance + hover lift ─────────────────────────────────── */

@keyframes po-kpi-enter {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.po-kpi-enter {
  opacity: 0;
  animation: po-kpi-enter 450ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ── Chart card hover lift + subtle shadow growth ────────────────────────── */

@keyframes po-chart-enter {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.po-chart-enter {
  opacity: 0;
  animation: po-chart-enter 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: box-shadow 250ms ease, transform 250ms ease, border-color 250ms ease;
}
.po-chart-enter:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px -8px rgba(37, 99, 235, 0.18);
  border-color: hsl(var(--border) / 0.8);
}

/* ── Master table card ───────────────────────────────────────────────────── */

.po-table-card {
  transition: box-shadow 250ms ease;
}
.po-table-card:hover {
  box-shadow: 0 4px 16px -6px rgba(0, 0, 0, 0.08);
}

/* ── Row entrance with gradient accent bar ───────────────────────────────── */

@keyframes po-row-in {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.po-row-in {
  opacity: 0;
  animation: po-row-in 350ms cubic-bezier(0.22, 1, 0.36, 1) both;
  position: relative;
}
.po-row-in::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #3b82f6, #8b5cf6);
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center;
  transition: opacity 200ms ease, transform 250ms cubic-bezier(0.22, 1, 0.36, 1);
}
.po-row-in:hover::before {
  opacity: 1;
  transform: scaleY(1);
}

/* ── Critical row variant (red gradient + pulse) ─────────────────────────── */

@keyframes po-row-critical-pulse {
  0%, 100% {
    background-color: rgba(244, 63, 94, 0.06);
  }
  50% {
    background-color: rgba(244, 63, 94, 0.12);
  }
}
.po-row-critical {
  animation: po-row-critical-pulse 2.4s ease-in-out infinite;
  background: linear-gradient(90deg, rgba(244, 63, 94, 0.08), transparent 60%);
}
.po-row-critical::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #f43f5e, #be123c);
  opacity: 1;
  transform: scaleY(1);
}

/* ── Warning row variant (amber gradient, no pulse) ──────────────────────── */

.po-row-warning {
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.07), transparent 60%);
}
.po-row-warning::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #f59e0b, #d97706);
  opacity: 1;
  transform: scaleY(1);
}

/* ── Tab button transitions ──────────────────────────────────────────────── */

.po-tab-btn {
  transition: background-color 200ms ease, color 200ms ease, transform 200ms ease, box-shadow 200ms ease;
}
.po-tab-btn:hover {
  transform: translateY(-1px);
}
.po-tab-btn:active {
  transform: translateY(0);
}

/* ── Search input focus ring expand ──────────────────────────────────────── */

@keyframes po-search-ring {
  from {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.5);
  }
  to {
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0);
  }
}
.po-search-focus:focus {
  animation: po-search-ring 600ms ease-out;
}

/* ── Drawer sheen sweep on open ──────────────────────────────────────────── */

@keyframes po-drawer-sheen {
  0% {
    background-position: -200% 0;
  }
  60%, 100% {
    background-position: 200% 0;
  }
}
.po-drawer-sheen::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(59, 130, 246, 0.05) 45%,
    rgba(139, 92, 246, 0.05) 55%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: po-drawer-sheen 1200ms ease-out;
  z-index: 1;
}

/* ── Drawer header gradient underline ────────────────────────────────────── */

.po-drawer-header {
  position: relative;
}
.po-drawer-header::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
  opacity: 0.6;
}

/* ── Stat card staggered entrance (4 items) ──────────────────────────────── */

@keyframes po-stat-enter {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.po-stat-enter {
  opacity: 0;
  animation: po-stat-enter 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ── Body entrance fade-up ───────────────────────────────────────────────── */

@keyframes po-body-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.po-body-enter {
  opacity: 0;
  animation: po-body-enter 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 100ms;
}

/* ── Card hover lift (drawer sub-cards) ──────────────────────────────────── */

.po-card-enter {
  opacity: 0;
  animation: po-body-enter 450ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
}
.po-card-enter:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px -4px rgba(0, 0, 0, 0.08);
  border-color: hsl(var(--border) / 0.9);
}

/* ── Tab indicator slide transition ──────────────────────────────────────── */

.po-tab-switch {
  transition: color 200ms ease;
}
.po-tab-switch::after {
  transition: inset 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* ── Progress bar fill animation ─────────────────────────────────────────── */

@keyframes po-progress-fill {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
.po-progress-fill > div,
.po-progress-fill[role="progressbar"] > div {
  transform-origin: left;
  animation: po-progress-fill 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ── Approval step entrance (staggered) ──────────────────────────────────── */

@keyframes po-approval-step {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.po-approval-step {
  opacity: 0;
  animation: po-approval-step 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: border-color 200ms ease, background-color 200ms ease;
}

/* ── Hover lift on KPI icons ─────────────────────────────────────────────── */

.po-kpi-enter:hover .h-9 {
  transform: scale(1.05);
  transition: transform 200ms ease;
}

/* ── Drawer sticky header backdrop blur (mobile-friendly) ────────────────── */

.po-drawer-header {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* ── Pulse glow for "CRIT" priority badge ────────────────────────────────── */

@keyframes po-crit-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0);
  }
}
.po-row-critical .bg-red-100,
.po-row-warning .bg-red-100 {
  animation: po-crit-pulse 1.8s ease-in-out infinite;
}

/* ── Smooth color transition for status badges ───────────────────────────── */

.po-row-in span,
.po-row-in .avatar,
.po-row-in .bg-amber-100,
.po-row-in .bg-blue-100,
.po-row-in .bg-emerald-100,
.po-row-in .bg-violet-100,
.po-row-in .bg-rose-100 {
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}

/* ── Drawer scroll area custom scrollbar ─────────────────────────────────── */

.po-drawer-sheen::-webkit-scrollbar {
  width: 6px;
}
.po-drawer-sheen::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}
.po-drawer-sheen::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}
.po-drawer-sheen::-webkit-scrollbar-track {
  background: transparent;
}

/* ── Drawer content z-index above sheen ──────────────────────────────────── */

.po-drawer-sheen > * {
  position: relative;
  z-index: 2;
}

/* ── Sub-tab underline slide animation ──────────────────────────────────── */

.po-tab-switch {
  position: relative;
}

/* ── Tab badge pop on count change ───────────────────────────────────────── */

@keyframes po-badge-pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
.po-tab-btn.active span {
  animation: po-badge-pop 400ms ease-out;
}

/* ── Hover overlay on chart cards (subtle blue tint) ─────────────────────── */

.po-chart-enter::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.04), transparent 50%);
  opacity: 0;
  transition: opacity 200ms ease;
}
.po-chart-enter:hover::after {
  opacity: 1;
}

/* ── Smooth row collapse animation when filters change ───────────────────── */

.po-row-in {
  transition: opacity 200ms ease, transform 200ms ease, background-color 200ms ease;
}

/* ── Reduced motion respect ──────────────────────────────────────────────── */

@media (prefers-reduced-motion: reduce) {
  .po-kpi-enter,
  .po-chart-enter,
  .po-row-in,
  .po-row-critical,
  .po-row-warning,
  .po-stat-enter,
  .po-body-enter,
  .po-card-enter,
  .po-approval-step,
  .po-drawer-sheen::before,
  .po-progress-fill > div {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
"""

path = Path("/home/z/my-project/src/app/globals.css")
with path.open("a") as f:
    f.write(CSS)

print(f"Appended {len(CSS)} chars to {path}")
print(f"New file size: {path.stat().st_size} bytes")
