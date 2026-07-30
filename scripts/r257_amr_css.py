#!/usr/bin/env python3
"""R257: Append AMR Fleet CSS to globals.css"""

CSS = """\
/* ── Autonomous Mobile Robots Fleet (amr-*) ─────────────────────────────── */
.amr-root { min-height: 100vh; }
.amr-tabs-list { background: transparent; }
.amr-tab[data-state="active"] {
  background: linear-gradient(135deg, oklch(0.7 0.15 195), oklch(0.6 0.2 250));
  color: white;
  box-shadow: 0 2px 8px oklch(0.7 0.15 195 / 0.3);
}
.amr-kpi-card {
  border: 1px solid oklch(0.9 0.02 195 / 0.5);
  border-radius: 12px;
  transition: all 0.25s ease;
}
.amr-kpi-card:hover {
  border-color: oklch(0.7 0.12 195 / 0.4);
  box-shadow: 0 4px 16px oklch(0.65 0.15 195 / 0.08);
  transform: translateY(-2px);
}
.amr-chart-card {
  border: 1px solid oklch(0.9 0 0);
  border-radius: 12px;
  transition: all 0.25s ease;
}
.amr-chart-card:hover {
  border-color: oklch(0.7 0.1 250 / 0.3);
  box-shadow: 0 4px 12px oklch(0.6 0.12 250 / 0.06);
}
.amr-table-header { background: oklch(0.96 0.005 195 / 0.3); }
.amr-table-row:nth-child(even) { background: oklch(0.97 0.005 195 / 0.2); }
.amr-table-row:hover { background: oklch(0.65 0.1 195 / 0.04); }
.amr-rt-badge, .amr-rs-badge, .amr-tt-badge, .amr-ts-badge,
.amr-at-badge, .amr-as-badge, .amr-mt-badge, .amr-zone, .amr-city {
  transition: all 0.15s; cursor: default;
}
.amr-rt-badge:hover, .amr-tt-badge:hover, .amr-mt-badge:hover, .amr-zone:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px oklch(0 0 0 / 0.06);
}
.amr-batt-bar, .amr-load-bar, .amr-speed, .amr-uptime { transition: all 0.2s; }
.amr-batt-bar:hover { transform: scaleX(1.02); transform-origin: left; }
.amr-signal { transition: all 0.15s; }
.amr-eff { transition: all 0.15s; }
.amr-eff:hover { transform: scale(1.1); }
:is(.dark) .amr-kpi-card { border-color: oklch(0.3 0.02 195 / 0.5); }
:is(.dark) .amr-kpi-card:hover { border-color: oklch(0.5 0.12 195 / 0.4); box-shadow: 0 4px 16px oklch(0.65 0.15 195 / 0.12); }
:is(.dark) .amr-chart-card { border-color: oklch(0.3 0 0); }
:is(.dark) .amr-chart-card:hover { border-color: oklch(0.5 0.1 250 / 0.3); }
:is(.dark) .amr-table-header { background: oklch(0.18 0.005 195 / 0.3); }
:is(.dark) .amr-table-row:nth-child(even) { background: oklch(0.17 0.005 195 / 0.2); }
:is(.dark) .amr-table-row:hover { background: oklch(0.65 0.1 195 / 0.08); }
"""

with open('/home/z/my-project/src/app/globals.css', 'a') as f:
    f.write('\n' + CSS)

with open('/home/z/my-project/src/app/globals.css', 'r') as f:
    total = sum(1 for _ in f)
print(f"AMR CSS appended. Total globals.css: {total} lines")
