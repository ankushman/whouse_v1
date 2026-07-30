#!/usr/bin/env python3
"""Helper to generate CSS for R192 Port Community System Integration"""
import sys

css = """
/* ═══════════════════════════════════════════════════════════
   R192 — Port Community System Integration (pcs-*)
   Theme: Deep Navy + Teal + Coral (#0f172a, #0d9488, #f97316)
   ═══════════════════════════════════════════════════════════ */

/* Tab active indicator */
.pcs-tab-active {
  position: relative;
  color: #0d9488 !important;
  font-weight: 600;
}
.pcs-tab-active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 10%;
  width: 80%;
  height: 2.5px;
  background: linear-gradient(90deg, #0d9488, #06b6d4);
  border-radius: 2px;
}

/* KPI cards staggered animation */
@keyframes pcs-fade-slide-up {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
.pcs-kpi-card {
  animation: pcs-fade-slide-up 0.45s ease-out forwards;
  opacity: 0;
}
.pcs-kpi-card:nth-child(1) { animation-delay: 0ms; }
.pcs-kpi-card:nth-child(2) { animation-delay: 50ms; }
.pcs-kpi-card:nth-child(3) { animation-delay: 100ms; }
.pcs-kpi-card:nth-child(4) { animation-delay: 150ms; }
.pcs-kpi-card:nth-child(5) { animation-delay: 200ms; }
.pcs-kpi-card:nth-child(6) { animation-delay: 250ms; }
.pcs-kpi-card:nth-child(7) { animation-delay: 300ms; }
.pcs-kpi-card:nth-child(8) { animation-delay: 350ms; }

/* Berth occupancy bar */
.pcs-berth-bar-track {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e2e8f0;
  overflow: hidden;
  position: relative;
}
.dark .pcs-berth-bar-track {
  background: #334155;
}
.pcs-berth-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
  position: relative;
  overflow: hidden;
}
.pcs-berth-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  animation: pcs-shimmer 2s infinite;
}
@keyframes pcs-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Vessel status ring */
.pcs-vessel-ring {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  position: relative;
}
.pcs-vessel-ring::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid currentColor;
  opacity: 0.3;
}

/* Document status pill */
.pcs-doc-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Berth timeline */
.pcs-berth-timeline {
  position: relative;
  padding-left: 20px;
}
.pcs-berth-timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #0d9488, #0ea5e9, #f97316);
}
.pcs-berth-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  left: 1px;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #0d9488;
}

/* Customs clearance stepper */
.pcs-clearance-step {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
}
.pcs-clearance-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}
.pcs-clearance-line {
  width: 24px;
  height: 2px;
  border-radius: 1px;
}
.pcs-clearance-line.done {
  background: #0d9488;
}
.pcs-clearance-line.pending {
  background: #cbd5e1;
}

/* Stat card hover */
.pcs-stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.pcs-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* Table sort header */
.pcs-sort-header {
  cursor: pointer;
  user-select: none;
  transition: color 0.15s;
}
.pcs-sort-header:hover {
  color: #0d9488;
}

/* Action button */
.pcs-action-btn {
  transition: all 0.15s ease;
}
.pcs-action-btn:hover {
  background: rgba(13, 148, 136, 0.1);
  color: #0d9488;
  transform: scale(1.05);
}

/* Container size badge */
.pcs-container-size {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 22px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
}

/* Port throughput counter */
@keyframes pcs-count-up {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
.pcs-counter-value {
  animation: pcs-count-up 0.6s ease-out forwards;
}

/* Shipping line logo placeholder */
.pcs-line-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

/* Table row hover */
.pcs-table-row {
  transition: background 0.15s ease;
}
.pcs-table-row:hover {
  background: rgba(13, 148, 136, 0.04);
}
.dark .pcs-table-row:hover {
  background: rgba(13, 148, 136, 0.08);
}

/* Responsive */
@media (max-width: 1024px) {
  .pcs-kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (max-width: 768px) {
  .pcs-kpi-grid { grid-template-columns: 1fr !important; }
}
"""

output_path = "/home/z/my-project/scripts/r192_css.txt"
with open(output_path, "w") as f:
    f.write(css)
print(f"CSS written to {output_path} ({len(css)} chars)")
