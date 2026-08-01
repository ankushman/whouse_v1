#!/usr/bin/env python3
"""R257: Append Omnichannel Returns Hub CSS to globals.css"""

CSS = """\
/* ── Omnichannel Returns Hub (ocr-*) ─────────────────────────────────────── */
.ocr-root { min-height: 100vh; }
.ocr-tabs-list { background: transparent; }
.ocr-tab[data-state="active"] {
  background: linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.55 0.2 250));
  color: white;
  box-shadow: 0 2px 8px oklch(0.55 0.24 15 / 0.3);
}
.ocr-kpi-card {
  border: 1px solid oklch(0.9 0.02 15 / 0.5);
  border-radius: 12px;
  transition: all 0.25s ease;
}
.ocr-kpi-card:hover {
  border-color: oklch(0.75 0.12 15 / 0.4);
  box-shadow: 0 4px 16px oklch(0.55 0.2 15 / 0.08);
  transform: translateY(-2px);
}
.ocr-kpi-icon { border-radius: 10px; }
.ocr-chart-card {
  border: 1px solid oklch(0.9 0 0);
  border-radius: 12px;
  transition: all 0.25s ease;
}
.ocr-chart-card:hover {
  border-color: oklch(0.7 0.1 250 / 0.3);
  box-shadow: 0 4px 12px oklch(0.55 0.12 250 / 0.06);
}
.ocr-table-header { background: oklch(0.96 0.005 15 / 0.3); }
.ocr-table-row:nth-child(even) { background: oklch(0.97 0.005 15 / 0.2); }
.ocr-table-row:hover { background: oklch(0.55 0.1 15 / 0.04); }
.ocr-rs-badge, .ocr-rm-badge, .ocr-disp-badge, .ocr-prio-badge,
.ocr-ch-badge, .ocr-it-badge, .ocr-rfs-badge, .ocr-es-badge,
.ocr-et-badge, .ocr-carrier, .ocr-city, .ocr-grade, .ocr-rr-badge {
  transition: all 0.15s;
  cursor: default;
}
.ocr-rs-badge:hover, .ocr-ch-badge:hover, .ocr-rm-badge:hover,
.ocr-it-badge:hover, .ocr-disp-badge:hover, .ocr-et-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px oklch(0 0 0 / 0.06);
}
.ocr-grade { transition: transform 0.2s, box-shadow 0.2s; }
.ocr-grade:hover { transform: scale(1.15); box-shadow: 0 0 8px oklch(0.5 0.15 145 / 0.2); }
.ocr-value-tile { min-width: 80px; }
.ocr-stars .star-filled { animation: star-pop 0.3s ease-out; }
@keyframes star-pop { 0% { transform: scale(0.5); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
.ocr-sla-bar { transition: all 0.2s; }
.ocr-sla-bar:hover { transform: scaleX(1.02); transform-origin: left; }
:is(.dark) .ocr-kpi-card { border-color: oklch(0.3 0.02 15 / 0.5); }
:is(.dark) .ocr-kpi-card:hover { border-color: oklch(0.5 0.12 15 / 0.4); box-shadow: 0 4px 16px oklch(0.55 0.2 15 / 0.12); }
:is(.dark) .ocr-chart-card { border-color: oklch(0.3 0 0); }
:is(.dark) .ocr-chart-card:hover { border-color: oklch(0.5 0.1 250 / 0.3); box-shadow: 0 4px 12px oklch(0.55 0.12 250 / 0.1); }
:is(.dark) .ocr-table-header { background: oklch(0.18 0.005 15 / 0.3); }
:is(.dark) .ocr-table-row:nth-child(even) { background: oklch(0.17 0.005 15 / 0.2); }
:is(.dark) .ocr-table-row:hover { background: oklch(0.55 0.1 15 / 0.08); }
"""

with open('/home/z/my-project/src/app/globals.css', 'a') as f:
    f.write('\n' + CSS)

with open('/home/z/my-project/src/app/globals.css', 'r') as f:
    total = sum(1 for _ in f)

print(f"OCR CSS appended. Total globals.css lines: {total}")
