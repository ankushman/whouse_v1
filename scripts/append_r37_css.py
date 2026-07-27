#!/usr/bin/env python3
"""Append Round 37 CSS micro-interaction classes to globals.css."""

CSS = """
/* ============================================================================
   Round 37 — AlertsDetailDrawer + DockDetailDrawer + RouteOptimizationDetailDrawer
   Micro-interaction classes (~35 new utilities)
   ============================================================================ */

/* ── AlertsDetailDrawer ─────────────────────────────────────────────────── */

@keyframes alert-drawer-header-sheen {
  0%   { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
}
.alert-drawer-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.18) 50%,
    transparent 100%
  );
  animation: alert-drawer-header-sheen 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes alert-icon-pulse-anim {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5); }
  50%      { transform: scale(1.05); box-shadow: 0 0 0 6px rgba(255, 255, 255, 0); }
}
.alert-icon-pulse {
  animation: alert-icon-pulse-anim 2.4s ease-in-out infinite;
}

@keyframes alert-stat-enter-anim {
  0%   { opacity: 0; transform: translateY(8px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.alert-stat-enter {
  animation: alert-stat-enter-anim 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.alert-stat-enter:nth-child(2) { animation-delay: 0.06s; }
.alert-stat-enter:nth-child(3) { animation-delay: 0.12s; }

@keyframes alert-drawer-body-enter-anim {
  0%   { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
.alert-drawer-body-enter {
  animation: alert-drawer-body-enter-anim 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes alert-card-enter-anim {
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.alert-card-enter {
  animation: alert-card-enter-anim 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.alert-card-enter:nth-child(2) { animation-delay: 0.05s; }
.alert-card-enter:nth-child(3) { animation-delay: 0.10s; }
.alert-card-enter:nth-child(4) { animation-delay: 0.15s; }
.alert-card-enter:nth-child(5) { animation-delay: 0.20s; }
.alert-card-enter:nth-child(6) { animation-delay: 0.25s; }
.alert-card-enter:nth-child(7) { animation-delay: 0.30s; }

@keyframes alert-metric-enter-anim {
  0%   { opacity: 0; transform: translateX(-6px); }
  100% { opacity: 1; transform: translateX(0); }
}
.alert-metric-enter {
  animation: alert-metric-enter-anim 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.alert-entity-row {
  transition: background-color 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
}
.alert-entity-row:hover {
  transform: translateX(2px);
}

@keyframes alert-timeline-enter-anim {
  0%   { opacity: 0; transform: translateX(-8px); }
  100% { opacity: 1; transform: translateX(0); }
}
.alert-timeline-enter {
  animation: alert-timeline-enter-anim 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes alert-timeline-active-anim {
  0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.6); }
  50%      { box-shadow: 0 0 0 5px rgba(249, 115, 22, 0); }
}
.alert-timeline-active {
  animation: alert-timeline-active-anim 1.8s ease-in-out infinite;
}

.alert-runbook-row {
  transition: background-color 0.15s ease, border-color 0.15s ease;
}
.alert-runbook-row:hover {
  transform: translateX(2px);
}

.alert-similar-row {
  transition: background-color 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
}
.alert-similar-row:hover {
  transform: translateX(2px);
}

/* ── DockDetailDrawer ──────────────────────────────────────────────────── */

@keyframes dock-drawer-header-sheen {
  0%   { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
}
.dock-drawer-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.18) 50%,
    transparent 100%
  );
  animation: dock-drawer-header-sheen 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes dock-icon-pulse-anim {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5); }
  50%      { transform: scale(1.05); box-shadow: 0 0 0 6px rgba(255, 255, 255, 0); }
}
.dock-icon-pulse {
  animation: dock-icon-pulse-anim 2.4s ease-in-out infinite;
}

@keyframes dock-stat-enter-anim {
  0%   { opacity: 0; transform: translateY(8px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.dock-stat-enter {
  animation: dock-stat-enter-anim 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.dock-stat-enter:nth-child(2) { animation-delay: 0.06s; }
.dock-stat-enter:nth-child(3) { animation-delay: 0.12s; }

@keyframes dock-drawer-body-enter-anim {
  0%   { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
.dock-drawer-body-enter {
  animation: dock-drawer-body-enter-anim 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes dock-card-enter-anim {
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.dock-card-enter {
  animation: dock-card-enter-anim 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.dock-card-enter:nth-child(2) { animation-delay: 0.05s; }
.dock-card-enter:nth-child(3) { animation-delay: 0.10s; }
.dock-card-enter:nth-child(4) { animation-delay: 0.15s; }
.dock-card-enter:nth-child(5) { animation-delay: 0.20s; }
.dock-card-enter:nth-child(6) { animation-delay: 0.25s; }
.dock-card-enter:nth-child(7) { animation-delay: 0.30s; }

@keyframes dock-metric-enter-anim {
  0%   { opacity: 0; transform: translateX(-6px); }
  100% { opacity: 1; transform: translateX(0); }
}
.dock-metric-enter {
  animation: dock-metric-enter-anim 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes dock-event-enter-anim {
  0%   { opacity: 0; transform: translateX(-8px); }
  100% { opacity: 1; transform: translateX(0); }
}
.dock-event-enter {
  animation: dock-event-enter-anim 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.dock-maint-row {
  transition: background-color 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
}
.dock-maint-row:hover {
  transform: translateX(2px);
}

/* ── RouteOptimizationDetailDrawer ─────────────────────────────────────── */

@keyframes route-drawer-header-sheen {
  0%   { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
}
.route-drawer-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.18) 50%,
    transparent 100%
  );
  animation: route-drawer-header-sheen 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes route-icon-pulse-anim {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5); }
  50%      { transform: scale(1.05); box-shadow: 0 0 0 6px rgba(255, 255, 255, 0); }
}
.route-icon-pulse {
  animation: route-icon-pulse-anim 2.4s ease-in-out infinite;
}

@keyframes route-pulse-ring-anim {
  0%   { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
  100% { box-shadow: 0 0 0 8px rgba(255, 255, 255, 0); }
}
.route-pulse-ring {
  animation: route-pulse-ring-anim 1.5s ease-out infinite;
}

@keyframes route-stat-enter-anim {
  0%   { opacity: 0; transform: translateY(8px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.route-stat-enter {
  animation: route-stat-enter-anim 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.route-stat-enter:nth-child(2) { animation-delay: 0.06s; }
.route-stat-enter:nth-child(3) { animation-delay: 0.12s; }

@keyframes route-drawer-body-enter-anim {
  0%   { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
.route-drawer-body-enter {
  animation: route-drawer-body-enter-anim 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes route-card-enter-anim {
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.route-card-enter {
  animation: route-card-enter-anim 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.route-card-enter:nth-child(2) { animation-delay: 0.05s; }
.route-card-enter:nth-child(3) { animation-delay: 0.10s; }
.route-card-enter:nth-child(4) { animation-delay: 0.15s; }
.route-card-enter:nth-child(5) { animation-delay: 0.20s; }
.route-card-enter:nth-child(6) { animation-delay: 0.25s; }
.route-card-enter:nth-child(7) { animation-delay: 0.30s; }
.route-card-enter:nth-child(8) { animation-delay: 0.35s; }

@keyframes route-metric-enter-anim {
  0%   { opacity: 0; transform: translateX(-6px); }
  100% { opacity: 1; transform: translateX(0); }
}
.route-metric-enter {
  animation: route-metric-enter-anim 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes route-stop-enter-anim {
  0%   { opacity: 0; transform: translateX(-8px); }
  100% { opacity: 1; transform: translateX(0); }
}
.route-stop-enter {
  animation: route-stop-enter-anim 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes route-event-enter-anim {
  0%   { opacity: 0; transform: translateX(-8px); }
  100% { opacity: 1; transform: translateX(0); }
}
.route-event-enter {
  animation: route-event-enter-anim 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes route-event-active-anim {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
  50%      { box-shadow: 0 0 0 5px rgba(239, 68, 68, 0); }
}
.route-event-active {
  animation: route-event-active-anim 1.8s ease-in-out infinite;
}

.route-cargo-row {
  transition: background-color 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
}
.route-cargo-row:hover {
  transform: translateX(2px);
}
"""

CSS_PATH = "/home/z/my-project/src/app/globals.css"

with open(CSS_PATH, "a", encoding="utf-8") as f:
    f.write(CSS)

# Verify
with open(CSS_PATH, "r", encoding="utf-8") as f:
    lines = f.readlines()
print(f"Appended {len(CSS.splitlines())} CSS lines.")
print(f"globals.css now has {len(lines)} lines total.")
