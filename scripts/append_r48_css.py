#!/usr/bin/env python3
"""Append QIP (Quality Inspection Plan) CSS micro-interaction classes to globals.css."""
from pathlib import Path

CSS_PATH = Path("/home/z/my-project/src/app/globals.css")

QIP_CSS = """
/* =================================================================== */
/* QIP (Quality Inspection Plan) — Round 48 micro-interactions         */
/* =================================================================== */

/* KPI entrance — staggered fade + lift, hover lift */
@keyframes qip-kpi-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.qip-kpi-enter {
  opacity: 0;
  animation: qip-kpi-enter 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.qip-kpi-enter:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px rgba(59, 130, 246, 0.25);
}

/* Chart entrance — hover lift + tint overlay */
@keyframes qip-chart-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.qip-chart-enter {
  opacity: 0;
  animation: qip-chart-enter 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 200ms;
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
  position: relative;
}
.qip-chart-enter:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px -10px rgba(59, 130, 246, 0.22);
  border-color: rgba(59, 130, 246, 0.35);
}

/* Table card wrapper */
.qip-table-card {
  transition: box-shadow 220ms ease;
}
.qip-table-card:hover {
  box-shadow: 0 8px 24px -12px rgba(15, 23, 42, 0.12);
}

/* Row entrance — fade-in + accent bar */
@keyframes qip-row-in {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.qip-row-in {
  opacity: 0;
  animation: qip-row-in 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
  position: relative;
}
.qip-row-in::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(180deg, #3b82f6, #1e40af);
  opacity: 0;
  transition: opacity 200ms ease;
}
.qip-row-in:hover::before {
  opacity: 1;
}

/* Critical row — red gradient + pulse */
@keyframes qip-row-critical-pulse {
  0%, 100% {
    background-color: rgba(254, 226, 226, 0.4);
  }
  50% {
    background-color: rgba(254, 226, 226, 0.7);
  }
}
.qip-row-critical {
  animation: qip-row-critical-pulse 3s ease-in-out infinite;
  border-left: 3px solid #ef4444;
}

/* Warning row — amber gradient + accent */
.qip-row-warning {
  border-left: 3px solid #f59e0b;
  background-image: linear-gradient(90deg, rgba(254, 243, 199, 0.4) 0%, transparent 30%);
}

/* Tab button — transition + active scale */
.qip-tab-btn {
  transition: all 180ms cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
}
.qip-tab-btn:active {
  transform: scale(0.96);
}
.qip-tab-btn:hover:not(.bg-blue-600) {
  background-color: rgba(59, 130, 246, 0.08);
}

/* Search input — focus ring expand */
.qip-search-focus {
  transition: box-shadow 220ms ease, border-color 220ms ease, width 250ms ease;
}
.qip-search-focus:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
  outline: none;
}

/* Drawer sheen sweep */
@keyframes qip-drawer-sheen {
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
.qip-drawer-sheen::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(59, 130, 246, 0.06) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: qip-drawer-sheen 1.2s ease-out;
  z-index: 5;
}

/* Drawer header — gradient underline + backdrop blur */
.qip-drawer-header {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.97), rgba(248, 250, 252, 0.95));
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 0 rgba(59, 130, 246, 0.15), 0 6px 14px -8px rgba(15, 23, 42, 0.12);
}
.qip-drawer-header::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, transparent);
  opacity: 0.6;
}

/* Stat enter — staggered */
@keyframes qip-stat-enter {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.qip-stat-enter {
  opacity: 0;
  animation: qip-stat-enter 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.qip-stat-enter:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -4px rgba(15, 23, 42, 0.12);
}

/* Body enter — fade-up */
@keyframes qip-body-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.qip-body-enter {
  animation: qip-body-enter 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Card enter — hover lift */
@keyframes qip-card-enter {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.qip-card-enter {
  opacity: 0;
  animation: qip-card-enter 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
}
.qip-card-enter:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px -6px rgba(15, 23, 42, 0.12);
  border-color: rgba(59, 130, 246, 0.3);
}

/* Tab switch animation */
@keyframes qip-tab-switch {
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
@keyframes qip-badge-pop {
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
.qip-badge-pop {
  animation: qip-badge-pop 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Custom scrollbar for QIP drawer */
.qip-drawer-sheen::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.qip-drawer-sheen::-webkit-scrollbar-track {
  background: rgba(248, 250, 252, 0.8);
}
.qip-drawer-sheen::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #93c5fd, #3b82f6);
  border-radius: 4px;
}
.qip-drawer-sheen::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #60a5fa, #2563eb);
}

/* Characteristic row severity tint on hover */
.qip-card-enter tr:hover {
  background-color: rgba(59, 130, 246, 0.04) !important;
}

/* Cost variance / pass rate animated underline on hover */
.qip-row-in .tabular-nums {
  position: relative;
  transition: color 200ms ease;
}
.qip-row-in:hover .tabular-nums {
  text-shadow: 0 0 8px currentColor;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .qip-kpi-enter,
  .qip-chart-enter,
  .qip-row-in,
  .qip-row-critical,
  .qip-stat-enter,
  .qip-body-enter,
  .qip-card-enter,
  .qip-badge-pop,
  .qip-drawer-sheen::before {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
"""

with CSS_PATH.open("a") as f:
    f.write(QIP_CSS)

print(f"Appended {len(QIP_CSS)} bytes of QIP CSS to globals.css")
print(f"New file size: {CSS_PATH.stat().st_size} bytes")
