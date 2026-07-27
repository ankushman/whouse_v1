#!/usr/bin/env python3
"""Append NCR (Non-Conformance Report) CSS micro-interaction classes to globals.css."""
from pathlib import Path

CSS_PATH = Path("/home/z/my-project/src/app/globals.css")

NCR_CSS = """
/* =================================================================== */
/* NCR (Non-Conformance Report) — Round 49 micro-interactions          */
/* =================================================================== */

/* KPI entrance — staggered fade + lift, hover lift */
@keyframes ncr-kpi-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.ncr-kpi-enter {
  opacity: 0;
  animation: ncr-kpi-enter 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.ncr-kpi-enter:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px rgba(244, 63, 94, 0.25);
}

/* Chart entrance — hover lift + tint overlay */
@keyframes ncr-chart-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.ncr-chart-enter {
  opacity: 0;
  animation: ncr-chart-enter 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 200ms;
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
  position: relative;
}
.ncr-chart-enter:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px -10px rgba(244, 63, 94, 0.22);
  border-color: rgba(244, 63, 94, 0.35);
}

/* Table card wrapper */
.ncr-table-card {
  transition: box-shadow 220ms ease;
}
.ncr-table-card:hover {
  box-shadow: 0 8px 24px -12px rgba(15, 23, 42, 0.12);
}

/* Row entrance — fade-in + accent bar */
@keyframes ncr-row-in {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.ncr-row-in {
  opacity: 0;
  animation: ncr-row-in 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
  position: relative;
}
.ncr-row-in::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(180deg, #f43f5e, #be123c);
  opacity: 0;
  transition: opacity 200ms ease;
}
.ncr-row-in:hover::before {
  opacity: 1;
}

/* Critical row — red gradient + pulse */
@keyframes ncr-row-critical-pulse {
  0%, 100% {
    background-color: rgba(254, 226, 226, 0.4);
  }
  50% {
    background-color: rgba(254, 226, 226, 0.7);
  }
}
.ncr-row-critical {
  animation: ncr-row-critical-pulse 3s ease-in-out infinite;
  border-left: 3px solid #f43f5e;
}

/* Warning row — amber gradient + accent */
.ncr-row-warning {
  border-left: 3px solid #f59e0b;
  background-image: linear-gradient(90deg, rgba(254, 243, 199, 0.4) 0%, transparent 30%);
}

/* Tab button — transition + active scale */
.ncr-tab-btn {
  transition: all 180ms cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
}
.ncr-tab-btn:active {
  transform: scale(0.96);
}
.ncr-tab-btn:hover:not(.bg-rose-600) {
  background-color: rgba(244, 63, 94, 0.08);
}

/* Search input — focus ring expand */
.ncr-search-focus {
  transition: box-shadow 220ms ease, border-color 220ms ease, width 250ms ease;
}
.ncr-search-focus:focus {
  border-color: #f43f5e;
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.18);
  outline: none;
}

/* Drawer sheen sweep */
@keyframes ncr-drawer-sheen {
  0% {
    background-position: -200% 0;
  }
  60% {
    background-position: 200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.ncr-drawer-sheen::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(244, 63, 94, 0.06) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: ncr-drawer-sheen 1.2s ease-out;
  z-index: 5;
}

/* Drawer header — gradient underline + backdrop blur */
.ncr-drawer-header {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.97), rgba(248, 250, 252, 0.95));
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 0 rgba(244, 63, 94, 0.15), 0 6px 14px -8px rgba(15, 23, 42, 0.12);
}
.ncr-drawer-header::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, #f43f5e, #8b5cf6, transparent);
  opacity: 0.6;
}

/* Stat enter — staggered */
@keyframes ncr-stat-enter {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.ncr-stat-enter {
  opacity: 0;
  animation: ncr-stat-enter 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.ncr-stat-enter:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -4px rgba(15, 23, 42, 0.12);
}

/* Body enter — fade-up */
@keyframes ncr-body-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.ncr-body-enter {
  animation: ncr-body-enter 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Card enter — hover lift */
@keyframes ncr-card-enter {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.ncr-card-enter {
  opacity: 0;
  animation: ncr-card-enter 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
}
.ncr-card-enter:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px -6px rgba(15, 23, 42, 0.12);
  border-color: rgba(244, 63, 94, 0.3);
}

/* Tab switch animation */
@keyframes ncr-tab-switch {
  from {
    opacity: 0;
    transform: translateX(8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Badge pop animation */
@keyframes ncr-badge-pop {
  0% {
    transform: scale(0.85);
    opacity: 0;
  }
  60% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.ncr-badge-pop {
  animation: ncr-badge-pop 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Custom scrollbar for NCR drawer */
.ncr-drawer-sheen::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.ncr-drawer-sheen::-webkit-scrollbar-track {
  background: rgba(248, 250, 252, 0.8);
}
.ncr-drawer-sheen::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #fda4af, #f43f5e);
  border-radius: 4px;
}
.ncr-drawer-sheen::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #fb7185, #e11d48);
}

/* Row hover tint */
.ncr-card-enter tr:hover {
  background-color: rgba(244, 63, 94, 0.04) !important;
}

/* Tabular nums emphasis on row hover */
.ncr-row-in .tabular-nums {
  position: relative;
  transition: color 200ms ease;
}
.ncr-row-in:hover .tabular-nums {
  text-shadow: 0 0 8px currentColor;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .ncr-kpi-enter,
  .ncr-chart-enter,
  .ncr-row-in,
  .ncr-row-critical,
  .ncr-stat-enter,
  .ncr-body-enter,
  .ncr-card-enter,
  .ncr-badge-pop,
  .ncr-drawer-sheen::before {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
"""

with CSS_PATH.open("a") as f:
    f.write(NCR_CSS)

print(f"Appended {len(NCR_CSS)} bytes of NCR CSS to globals.css")
print(f"New file size: {CSS_PATH.stat().st_size} bytes")
