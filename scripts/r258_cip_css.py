#!/usr/bin/env python3
"""R258: Append Consignment Inventory Pro CSS to globals.css"""

CSS = """\
/* ── Consignment Inventory Pro (cip-*) ────────────────────────────────── */
.cip-root { min-height: 100vh; }
.cip-tabs-list { background: transparent; }
.cip-tab[data-state="active"] {
  background: linear-gradient(135deg, oklch(0.6 0.2 290), oklch(0.55 0.2 250));
  color: white;
  box-shadow: 0 2px 8px oklch(0.6 0.2 290 / 0.3);
}
.cip-kpi-card {
  border: 1px solid oklch(0.9 0.02 290 / 0.5);
  border-radius: 12px;
  transition: all 0.25s ease;
}
.cip-kpi-card:hover {
  border-color: oklch(0.7 0.12 290 / 0.4);
  box-shadow: 0 4px 16px oklch(0.6 0.15 290 / 0.08);
  transform: translateY(-2px);
}
.cip-chart-card {
  border: 1px solid oklch(0.9 0 0);
  border-radius: 12px;
  transition: all 0.25s ease;
}
.cip-chart-card:hover {
  border-color: oklch(0.7 0.1 250 / 0.3);
  box-shadow: 0 4px 12px oklch(0.55 0.12 250 / 0.06);
}
.cip-table-header { background: oklch(0.96 0.005 290 / 0.3); }
.cip-table-row:nth-child(even) { background: oklch(0.97 0.005 290 / 0.2); }
.cip-table-row:hover { background: oklch(0.6 0.1 290 / 0.04); }
.cip-os-badge, .cip-ss-badge, .cip-ct-badge, .cip-pt-badge,
.cip-supplier, .cip-city, .cip-qty, .cip-link, .cip-aging {
  transition: all 0.15s; cursor: default;
}
.cip-os-badge:hover, .cip-ct-badge:hover, .cip-pt-badge:hover,
.cip-supplier:hover, .cip-ss-badge:hover, .cip-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px oklch(0 0 0 / 0.06);
}
.cip-util, .cip-turnover, .cip-expiry { transition: all 0.2s; }
.cip-util:hover, .cip-turnover:hover, .cip-expiry:hover { transform: scaleX(1.02); transform-origin: left; }
:is(.dark) .cip-kpi-card { border-color: oklch(0.3 0.02 290 / 0.5); }
:is(.dark) .cip-kpi-card:hover { border-color: oklch(0.5 0.12 290 / 0.4); box-shadow: 0 4px 16px oklch(0.6 0.15 290 / 0.12); }
:is(.dark) .cip-chart-card { border-color: oklch(0.3 0 0); }
:is(.dark) .cip-chart-card:hover { border-color: oklch(0.5 0.1 250 / 0.3); }
:is(.dark) .cip-table-header { background: oklch(0.18 0.005 290 / 0.3); }
:is(.dark) .cip-table-row:nth-child(even) { background: oklch(0.17 0.005 290 / 0.2); }
:is(.dark) .cip-table-row:hover { background: oklch(0.6 0.1 290 / 0.08); }
"""

with open('/home/z/my-project/src/app/globals.css', 'a') as f:
    f.write('\n' + CSS)

with open('/home/z/my-project/src/app/globals.css', 'r') as f:
    total = sum(1 for _ in f)
print(f"CIP CSS appended. Total: {total} lines")
