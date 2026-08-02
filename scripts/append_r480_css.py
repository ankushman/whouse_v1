#!/usr/bin/env python3
"""Append CSS for dsa-* (Demand Sensing) and wsm-* (Warehouse Simulation) to globals.css"""

CSS = """
/* ===== Demand Sensing Analytics (dsa-*) ===== */
.dsa-root{padding:0}
.dsa-header{display:flex;align-items:flex-start;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #f1f5f9;gap:12px}
.dsa-header-left{display:flex;align-items:flex-start;gap:10px}
.dsa-icon-wrap{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#eef2ff,#e0e7ff);border:1px solid #c7d2fe}
.dsa-title{font-size:15px;font-weight:700;color:#0f172a;margin:0;line-height:1.2}
.dsa-subtitle{font-size:11px;color:#64748b;margin:2px 0 0;line-height:1.3}
.dsa-live-count{font-size:11px;font-weight:600;color:#4f46e5;font-family:ui-monospace,monospace;background:#eef2ff;padding:2px 8px;border-radius:4px;border:1px solid #c7d2fe}
.dsa-stats-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:10px 16px;border-bottom:1px solid #f1f5f9}
.dsa-stat-card{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:#fff;border:1px solid #f1f5f9}
.dsa-stat-icon{width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.dsa-stat-info{display:flex;flex-direction:column;min-width:0}
.dsa-stat-value{font-size:14px;font-weight:700;color:#0f172a;line-height:1.2}
.dsa-stat-label{font-size:10px;color:#64748b;line-height:1.2}
.dsa-controls{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #f1f5f9}
.dsa-filter-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:6px;font-size:11px;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;transition:all .15s}
.dsa-filter-chip:hover{background:#f1f5f9;border-color:#cbd5e1}
.dsa-filter-active{background:#eef2ff;color:#4f46e5;border-color:#c7d2fe;box-shadow:0 0 0 2px rgba(79,70,229,.1)}
.dsa-chip-count{font-size:10px;font-weight:600;background:#e2e8f0;padding:1px 5px;border-radius:3px;color:#475569;font-family:ui-monospace,monospace}
.dsa-filter-active .dsa-chip-count{background:#c7d2fe;color:#3730a3}
.dsa-secondary-filters{display:flex;align-items:center;gap:8px;padding:8px 16px 10px;border-bottom:1px solid #f1f5f9}
.dsa-type-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:11px;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;transition:all .15s}
.dsa-type-chip:hover{background:#f1f5f9}
.dsa-type-active{background:#eef2ff;color:#4f46e5;border-color:#c7d2fe}
.dsa-type-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.dsa-view-tabs{display:flex;gap:4px;padding:8px 16px;border-bottom:1px solid #f1f5f9;overflow-x:auto}
.dsa-view-tab{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:500;color:#64748b;cursor:pointer;transition:all .15s;white-space:nowrap;background:transparent;border:1px solid transparent}
.dsa-view-tab:hover{background:#f1f5f9}
.dsa-view-tab-active{background:#fff;color:#0f172a;border-color:#e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.dsa-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px 16px}
.dsa-card{border-radius:8px;background:#fff;border:1px solid #f1f5f9;padding:12px;transition:all .15s;position:relative}
.dsa-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.06);border-color:#e2e8f0}
.dsa-card-divergent{animation:dsa-pulse-red 2s infinite}
.dsa-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;flex-wrap:wrap;gap:4px}
.dsa-card-id{font-size:12px;font-weight:700;color:#0f172a;font-family:ui-monospace,monospace}
.dsa-status-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.dsa-trend-badge{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700}
.dsa-season-badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.dsa-name-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.dsa-name{font-size:13px;font-weight:600;color:#0f172a;display:flex;align-items:center;gap:4px}
.dsa-dc{font-size:10px;color:#64748b}
.dsa-sku-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.dsa-sku{font-size:10px;color:#94a3b8;font-family:ui-monospace,monospace}
.dsa-category{font-size:10px;color:#64748b}
.dsa-forecast-row{display:flex;gap:12px;margin-bottom:6px}
.dsa-fc-block{display:flex;flex-direction:column;align-items:flex-start}
.dsa-fc-label{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px}
.dsa-fc-val{font-size:14px;font-weight:700;color:#0f172a;font-family:ui-monospace,monospace}
.dsa-acc-bar-row{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.dsa-acc-label{font-size:10px;color:#64748b;white-space:nowrap;min-width:55px}
.dsa-acc-bar-track{flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden;max-width:140px}
.dsa-acc-bar-fill{height:100%;border-radius:3px;transition:width .3s ease}
.dsa-acc-pct{font-size:11px;font-weight:700;font-family:ui-monospace,monospace}
.dsa-mape{font-size:10px;font-weight:600;color:#64748b}
.dsa-conf-row{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.dsa-conf-label{font-size:10px;color:#64748b;white-space:nowrap;min-width:65px}
.dsa-conf-bar-track{flex:1;height:4px;background:#f1f5f9;border-radius:2px;overflow:hidden;max-width:120px}
.dsa-conf-bar-fill{height:100%;border-radius:2px;transition:width .3s ease}
.dsa-conf-pct{font-size:10px;font-weight:700;font-family:ui-monospace,monospace}
.dsa-metrics-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}
.dsa-metric{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:#64748b}
.dsa-div-alert{display:flex;align-items:center;gap:3px;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:600;background:#fef2f2;color:#dc2626;margin-bottom:4px}
.dsa-expand-btn{display:flex;align-items:center;gap:4px;width:100%;padding:6px 0 2px;border:none;background:none;cursor:pointer;color:#64748b;font-size:11px;transition:color .15s}
.dsa-expand-btn:hover{color:#0f172a}
.dsa-expanded{margin-top:6px;padding:8px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0}
.dsa-detail-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:4px 12px}
.dsa-detail-item{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #f1f5f9}
.dsa-detail-label{font-size:10px;color:#94a3b8}
.dsa-detail-value{font-size:10px;font-weight:600;color:#334155;font-family:ui-monospace,monospace}
.dsa-empty{text-align:center;padding:24px;color:#94a3b8;font-size:12px;grid-column:1/-1}
.dsa-anal-view{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px 16px}
.dsa-anal-col{display:flex;flex-direction:column;gap:6px}
.dsa-anal-title{font-size:12px;font-weight:700;color:#0f172a;margin:0;padding:4px 0;border-bottom:1px solid #e2e8f0}
.dsa-band-card{padding:10px;background:#fff;border-radius:8px;border:1px solid #f1f5f9}
.dsa-band-name{font-size:12px;font-weight:600;color:#0f172a}
.dsa-band-sub{font-size:10px;color:#94a3b8}
.dsa-band-stats{display:flex;gap:16px}
.dsa-band-stat{display:flex;flex-direction:column;align-items:flex-start}
.dsa-band-val{font-size:14px;font-weight:700;line-height:1.2}
.dsa-band-lbl{font-size:10px;color:#94a3b8;line-height:1.2}
.dsa-alert-row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;background:#fff;border:1px solid #f1f5f9;margin-bottom:4px;font-size:11px}
.dsa-alert-name{font-weight:600;color:#334155;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsa-alert-stat{font-size:10px;font-weight:600;color:#1e293b;font-family:ui-monospace,monospace}
.dsa-alert-rooms{font-size:10px;color:#94a3b8;font-family:ui-monospace,monospace}
@keyframes dsa-pulse-red{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.2)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}
@media(max-width:640px){.dsa-stats-grid{grid-template-columns:repeat(3,1fr)}.dsa-grid{grid-template-columns:1fr}.dsa-anal-view{grid-template-columns:1fr}.dsa-detail-grid{grid-template-columns:repeat(2,1fr)}}

/* ===== Warehouse Simulation (wsm-*) ===== */
.wsm-root{padding:0}
.wsm-header{display:flex;align-items:flex-start;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #f1f5f9;gap:12px}
.wsm-header-left{display:flex;align-items:flex-start;gap:10px}
.wsm-icon-wrap{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#fdf4ff,#fae8ff);border:1px solid #e9d5ff}
.wsm-title{font-size:15px;font-weight:700;color:#0f172a;margin:0;line-height:1.2}
.wsm-subtitle{font-size:11px;color:#64748b;margin:2px 0 0;line-height:1.3}
.wsm-live-count{font-size:11px;font-weight:600;color:#7c3aed;font-family:ui-monospace,monospace;background:#fdf4ff;padding:2px 8px;border-radius:4px;border:1px solid #e9d5ff}
.wsm-stats-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:10px 16px;border-bottom:1px solid #f1f5f9}
.wsm-stat-card{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:#fff;border:1px solid #f1f5f9}
.wsm-stat-icon{width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.wsm-stat-info{display:flex;flex-direction:column;min-width:0}
.wsm-stat-value{font-size:14px;font-weight:700;color:#0f172a;line-height:1.2}
.wsm-stat-label{font-size:10px;color:#64748b;line-height:1.2}
.wsm-controls{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #f1f5f9}
.wsm-filter-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:6px;font-size:11px;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;transition:all .15s}
.wsm-filter-chip:hover{background:#f1f5f9;border-color:#cbd5e1}
.wsm-filter-active{background:#fdf4ff;color:#a21caf;border-color:#e9d5ff;box-shadow:0 0 0 2px rgba(162,28,175,.1)}
.wsm-chip-count{font-size:10px;font-weight:600;background:#e2e8f0;padding:1px 5px;border-radius:3px;color:#475569;font-family:ui-monospace,monospace}
.wsm-filter-active .wsm-chip-count{background:#e9d5ff;color:#701a75}
.wsm-secondary-filters{display:flex;align-items:center;gap:8px;padding:8px 16px 10px;border-bottom:1px solid #f1f5f9}
.wsm-type-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:11px;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;transition:all .15s}
.wsm-type-chip:hover{background:#f1f5f9}
.wsm-type-active{background:#fdf4ff;color:#a21caf;border-color:#e9d5ff}
.wsm-type-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.wsm-view-tabs{display:flex;gap:4px;padding:8px 16px;border-bottom:1px solid #f1f5f9;overflow-x:auto}
.wsm-view-tab{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:500;color:#64748b;cursor:pointer;transition:all .15s;white-space:nowrap;background:transparent;border:1px solid transparent}
.wsm-view-tab:hover{background:#f1f5f9}
.wsm-view-tab-active{background:#fff;color:#0f172a;border-color:#e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.wsm-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px 16px}
.wsm-card{border-radius:8px;background:#fff;border:1px solid #f1f5f9;padding:12px;transition:all .15s;position:relative}
.wsm-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.06);border-color:#e2e8f0}
.wsm-card-failed{animation:wsm-pulse-red 2s infinite}
.wsm-card-running{border-color:#3b82f6}
.wsm-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;flex-wrap:wrap;gap:4px}
.wsm-card-id{font-size:12px;font-weight:700;color:#0f172a;font-family:ui-monospace,monospace}
.wsm-status-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.wsm-type-badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.wsm-cost{font-size:12px;font-weight:700;color:#0f172a}
.wsm-name-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.wsm-name{font-size:13px;font-weight:600;color:#0f172a;display:flex;align-items:center;gap:4px}
.wsm-dc{font-size:10px;color:#64748b}
.wsm-throughput-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.wsm-tp-block{display:flex;flex-direction:column;align-items:flex-start}
.wsm-tp-label{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px}
.wsm-tp-val{font-size:13px;font-weight:700;color:#0f172a;font-family:ui-monospace,monospace}
.wsm-imp-badge{font-size:12px;font-weight:800;font-family:ui-monospace,monospace}
.wsm-util-bar-row{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.wsm-util-label{font-size:10px;color:#64748b;white-space:nowrap;min-width:65px}
.wsm-util-bar-track{flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden}
.wsm-util-bar-fill{height:100%;border-radius:3px;transition:width .3s ease}
.wsm-util-pct{font-size:11px;font-weight:700;min-width:32px;text-align:right;font-family:ui-monospace,monospace}
.wsm-conf-row{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.wsm-conf-label{font-size:10px;color:#64748b;white-space:nowrap;min-width:95px}
.wsm-conf-bar-track{flex:1;height:4px;background:#f1f5f9;border-radius:2px;overflow:hidden;max-width:100px}
.wsm-conf-bar-fill{height:100%;border-radius:2px;transition:width .3s ease}
.wsm-conf-pct{font-size:10px;font-weight:700;font-family:ui-monospace,monospace}
.wsm-metrics-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}
.wsm-metric{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:#64748b}
.wsm-fail-alert{display:flex;align-items:center;gap:3px;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:600;background:#fef2f2;color:#dc2626;margin-bottom:4px}
.wsm-run-indicator{display:flex;align-items:center;gap:3px;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:600;background:#eff6ff;color:#2563eb;margin-bottom:4px;animation:wsm-blink 1.5s infinite}
.wsm-expand-btn{display:flex;align-items:center;gap:4px;width:100%;padding:6px 0 2px;border:none;background:none;cursor:pointer;color:#64748b;font-size:11px;transition:color .15s}
.wsm-expand-btn:hover{color:#0f172a}
.wsm-expanded{margin-top:6px;padding:8px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0}
.wsm-detail-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:4px 12px}
.wsm-detail-item{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #f1f5f9}
.wsm-detail-label{font-size:10px;color:#94a3b8}
.wsm-detail-value{font-size:10px;font-weight:600;color:#334155;font-family:ui-monospace,monospace}
.wsm-empty{text-align:center;padding:24px;color:#94a3b8;font-size:12px;grid-column:1/-1}
.wsm-anal-view{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px 16px}
.wsm-anal-col{display:flex;flex-direction:column;gap:6px}
.wsm-anal-title{font-size:12px;font-weight:700;color:#0f172a;margin:0;padding:4px 0;border-bottom:1px solid #e2e8f0}
.wsm-band-card{padding:10px;background:#fff;border-radius:8px;border:1px solid #f1f5f9}
.wsm-band-name{font-size:12px;font-weight:600;color:#0f172a}
.wsm-band-sub{font-size:10px;color:#94a3b8}
.wsm-band-stats{display:flex;gap:16px}
.wsm-band-stat{display:flex;flex-direction:column;align-items:flex-start}
.wsm-band-val{font-size:14px;font-weight:700;line-height:1.2}
.wsm-band-lbl{font-size:10px;color:#94a3b8;line-height:1.2}
.wsm-alert-row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;background:#fff;border:1px solid #f1f5f9;margin-bottom:4px;font-size:11px}
.wsm-alert-name{font-weight:600;color:#334155;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wsm-alert-stat{font-size:10px;font-weight:600;color:#1e293b;font-family:ui-monospace,monospace}
.wsm-alert-rooms{font-size:10px;color:#94a3b8;font-family:ui-monospace,monospace}
@keyframes wsm-pulse-red{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.2)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}
@keyframes wsm-blink{0%,100%{opacity:1}50%{opacity:.6}}
@media(max-width:640px){.wsm-stats-grid{grid-template-columns:repeat(3,1fr)}.wsm-grid{grid-template-columns:1fr}.wsm-anal-view{grid-template-columns:1fr}.wsm-detail-grid{grid-template-columns:repeat(2,1fr)}}
"""

globals_path = '/home/z/my-project/src/app/globals.css'
with open(globals_path, 'a') as f:
    f.write(CSS)

lines = CSS.count('\n')
print(f"Appended {lines} lines of CSS for dsa-* and wsm-* prefixes")
