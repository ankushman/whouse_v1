#!/usr/bin/env python3
"""Append Round 47 CSS micro-interactions for BOM Management module."""
from pathlib import Path

CSS = """
/* ════════════════════════════════════════════════════════════════════════════
   ROUND 47 — Bill of Materials (BOM) Module — CSS Micro-interactions
   30+ classes covering: KPI entrance, chart hover lifts, row entrance with
   accent bars, status-aware row variants (critical/warning), revision step
   entrance, drawer sheen, tab transitions, stat staggered entrance, body
   fade-up, card hover lifts, search focus, and reduced-motion support.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── KPI staggered entrance + hover lift ─────────────────────────────────── */

@keyframes bom-kpi-enter {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.bom-kpi-enter {
  opacity: 0;
  animation: bom-kpi-enter 450ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ── Chart card hover lift + subtle shadow growth ────────────────────────── */

@keyframes bom-chart-enter {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.bom-chart-enter {
  opacity: 0;
  animation: bom-chart-enter 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: box-shadow 250ms ease, transform 250ms ease, border-color 250ms ease;
}
.bom-chart-enter:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px -8px rgba(124, 58, 237, 0.18);
  border-color: hsl(var(--border) / 0.8);
}

/* ── Hover overlay on chart cards (subtle violet tint) ───────────────────── */

.bom-chart-enter::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.04), transparent 50%);
  opacity: 0;
  transition: opacity 200ms ease;
}
.bom-chart-enter:hover::after {
  opacity: 1;
}

/* ── Master table card ───────────────────────────────────────────────────── */

.bom-table-card {
  transition: box-shadow 250ms ease;
}
.bom-table-card:hover {
  box-shadow: 0 4px 16px -6px rgba(0, 0, 0, 0.08);
}

/* ── Row entrance with gradient accent bar ───────────────────────────────── */

@keyframes bom-row-in {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.bom-row-in {
  opacity: 0;
  animation: bom-row-in 350ms cubic-bezier(0.22, 1, 0.36, 1) both;
  position: relative;
}
.bom-row-in::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #7c3aed, #3b82f6);
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center;
  transition: opacity 200ms ease, transform 250ms cubic-bezier(0.22, 1, 0.36, 1);
}
.bom-row-in:hover::before {
  opacity: 1;
  transform: scaleY(1);
}

/* ── Critical row variant (red gradient + pulse) ─────────────────────────── */

@keyframes bom-row-critical-pulse {
  0%, 100% {
    background-color: rgba(244, 63, 94, 0.06);
  }
  50% {
    background-color: rgba(244, 63, 94, 0.12);
  }
}
.bom-row-critical {
  animation: bom-row-critical-pulse 2.4s ease-in-out infinite;
  background: linear-gradient(90deg, rgba(244, 63, 94, 0.08), transparent 60%);
}
.bom-row-critical::before {
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

.bom-row-warning {
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.07), transparent 60%);
}
.bom-row-warning::before {
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

.bom-tab-btn {
  transition: background-color 200ms ease, color 200ms ease, transform 200ms ease, box-shadow 200ms ease;
}
.bom-tab-btn:hover {
  transform: translateY(-1px);
}
.bom-tab-btn:active {
  transform: translateY(0);
}

/* ── Search input focus ring expand ──────────────────────────────────────── */

@keyframes bom-search-ring {
  from {
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.5);
  }
  to {
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0);
  }
}
.bom-search-focus:focus {
  animation: bom-search-ring 600ms ease-out;
}

/* ── Drawer sheen sweep on open ──────────────────────────────────────────── */

@keyframes bom-drawer-sheen {
  0% {
    background-position: -200% 0;
  }
  60%, 100% {
    background-position: 200% 0;
  }
}
.bom-drawer-sheen::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(124, 58, 237, 0.05) 45%,
    rgba(59, 130, 246, 0.05) 55%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: bom-drawer-sheen 1200ms ease-out;
  z-index: 1;
}

/* ── Drawer header gradient underline ────────────────────────────────────── */

.bom-drawer-header {
  position: relative;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.bom-drawer-header::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, #7c3aed, #3b82f6, #06b6d4);
  opacity: 0.6;
}

/* ── Stat card staggered entrance (4 items) ──────────────────────────────── */

@keyframes bom-stat-enter {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.bom-stat-enter {
  opacity: 0;
  animation: bom-stat-enter 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ── Body entrance fade-up ───────────────────────────────────────────────── */

@keyframes bom-body-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.bom-body-enter {
  opacity: 0;
  animation: bom-body-enter 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 100ms;
}

/* ── Card hover lift (drawer sub-cards) ──────────────────────────────────── */

.bom-card-enter {
  opacity: 0;
  animation: bom-body-enter 450ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
}
.bom-card-enter:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px -4px rgba(0, 0, 0, 0.08);
  border-color: hsl(var(--border) / 0.9);
}

/* ── Tab indicator slide transition ──────────────────────────────────────── */

.bom-tab-switch {
  position: relative;
  transition: color 200ms ease;
}
.bom-tab-switch::after {
  transition: inset 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* ── Revision step entrance (staggered) ──────────────────────────────────── */

@keyframes bom-revision-step {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.bom-revision-step {
  opacity: 0;
  animation: bom-revision-step 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: border-color 200ms ease, background-color 200ms ease;
}

/* ── Hover lift on KPI icons ─────────────────────────────────────────────── */

.bom-kpi-enter:hover .h-9 {
  transform: scale(1.05);
  transition: transform 200ms ease;
}

/* ── Pulse glow for "L2+" multi-level badge ─────────────────────────────── */

@keyframes bom-level-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0);
  }
}
.bom-row-critical .bg-violet-100,
.bom-row-warning .bg-violet-100 {
  animation: bom-level-pulse 1.8s ease-in-out infinite;
}

/* ── Smooth color transition for status badges ───────────────────────────── */

.bom-row-in span,
.bom-row-in .avatar,
.bom-row-in .bg-amber-100,
.bom-row-in .bg-blue-100,
.bom-row-in .bg-emerald-100,
.bom-row-in .bg-violet-100,
.bom-row-in .bg-rose-100 {
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}

/* ── Drawer scroll area custom scrollbar ─────────────────────────────────── */

.bom-drawer-sheen::-webkit-scrollbar {
  width: 6px;
}
.bom-drawer-sheen::-webkit-scrollbar-thumb {
  background: rgba(124, 58, 237, 0.2);
  border-radius: 3px;
}
.bom-drawer-sheen::-webkit-scrollbar-thumb:hover {
  background: rgba(124, 58, 237, 0.35);
}
.bom-drawer-sheen::-webkit-scrollbar-track {
  background: transparent;
}

/* ── Drawer content z-index above sheen ──────────────────────────────────── */

.bom-drawer-sheen > * {
  position: relative;
  z-index: 2;
}

/* ── Tab badge pop on count change ───────────────────────────────────────── */

@keyframes bom-badge-pop {
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
.bom-tab-btn.active span {
  animation: bom-badge-pop 400ms ease-out;
}

/* ── Smooth row collapse animation when filters change ───────────────────── */

.bom-row-in {
  transition: opacity 200ms ease, transform 200ms ease, background-color 200ms ease;
}

/* ── Cost variance color shift on hover (animated underline) ─────────────── */

.bom-row-in .text-red-600,
.bom-row-in .text-amber-600,
.bom-row-in .text-emerald-600 {
  position: relative;
  transition: color 200ms ease;
}
.bom-row-in:hover .text-red-600::after,
.bom-row-in:hover .text-amber-600::after,
.bom-row-in:hover .text-emerald-600::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 1px;
  background: currentColor;
  opacity: 0.4;
}

/* ── Reduced motion respect ──────────────────────────────────────────────── */

@media (prefers-reduced-motion: reduce) {
  .bom-kpi-enter,
  .bom-chart-enter,
  .bom-row-in,
  .bom-row-critical,
  .bom-row-warning,
  .bom-stat-enter,
  .bom-body-enter,
  .bom-card-enter,
  .bom-revision-step,
  .bom-drawer-sheen::before {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}

/* ── BOM-specific: Tree node connector lines (visual hierarchy) ──────────── */

.bom-row-in .text-violet-500 {
  transition: transform 200ms ease;
}
.bom-row-in:hover .text-violet-500 {
  transform: scale(1.2) rotate(5deg);
}

/* ── Subtle shimmer on cost rollup total row ─────────────────────────────── */

@keyframes bom-total-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.bom-row-in:last-child td.font-bold {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(124, 58, 237, 0.05),
    transparent
  );
  background-size: 200% 100%;
  animation: bom-total-shimmer 3s ease-in-out infinite;
}
"""

path = Path("/home/z/my-project/src/app/globals.css")
with path.open("a") as f:
    f.write(CSS)

print(f"Appended {len(CSS)} chars to {path}")
print(f"New file size: {path.stat().st_size} bytes")
