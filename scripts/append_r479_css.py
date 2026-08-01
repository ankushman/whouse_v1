#!/usr/bin/env python3
"""Append CSS for tps-* (3PL Vendor Scorecard) and sto-* (Slotting Optimizer) to globals.css"""

CSS = """
/* ===== 3PL Vendor Scorecard (tps-*) ===== */
.tps-root{padding:0}
.tps-header{display:flex;align-items:flex-start;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #f1f5f9;gap:12px}
.tps-header-left{display:flex;align-items:flex-start;gap:10px}
.tps-icon-wrap{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:1px solid #ddd6fe}
.tps-title{font-size:15px;font-weight:700;color:#0f172a;margin:0;line-height:1.2}
.tps-subtitle{font-size:11px;color:#64748b;margin:2px 0 0;line-height:1.3}
.tps-live-count{font-size:11px;font-weight:600;color:#7c3aed;font-family:ui-monospace,monospace;background:#f5f3ff;padding:2px 8px;border-radius:4px;border:1px solid #ddd6fe}
.tps-stats-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:10px 16px;border-bottom:1px solid #f1f5f9}
.tps-stat-card{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:#fff;border:1px solid #f1f5f9}
.tps-stat-icon{width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.tps-stat-info{display:flex;flex-direction:column;min-width:0}
.tps-stat-value{font-size:14px;font-weight:700;color:#0f172a;line-height:1.2}
.tps-stat-label{font-size:10px;color:#64748b;line-height:1.2}
.tps-controls{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #f1f5f9}
.tps-filter-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:6px;font-size:11px;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;transition:all .15s}
.tps-filter-chip:hover{background:#f1f5f9;border-color:#cbd5e1}
.tps-filter-active{background:#f5f3ff;color:#7c3aed;border-color:#ddd6fe;box-shadow:0 0 0 2px rgba(124,58,237,.1)}
.tps-chip-count{font-size:10px;font-weight:600;background:#e2e8f0;padding:1px 5px;border-radius:3px;color:#475569;font-family:ui-monospace,monospace}
.tps-filter-active .tps-chip-count{background:#ddd6fe;color:#5b21b6}
.tps-secondary-filters{display:flex;align-items:center;gap:8px;padding:8px 16px 10px;border-bottom:1px solid #f1f5f9}
.tps-type-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:11px;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;transition:all .15s}
.tps-type-chip:hover{background:#f1f5f9}
.tps-type-active{background:#f5f3ff;color:#7c3aed;border-color:#ddd6fe}
.tps-type-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.tps-view-tabs{display:flex;gap:4px;padding:8px 16px;border-bottom:1px solid #f1f5f9;overflow-x:auto}
.tps-view-tab{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:500;color:#64748b;cursor:pointer;transition:all .15s;white-space:nowrap;background:transparent;border:1px solid transparent}
.tps-view-tab:hover{background:#f1f5f9}
.tps-view-tab-active{background:#fff;color:#0f172a;border-color:#e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.tps-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px 16px}
.tps-card{border-radius:8px;background:#fff;border:1px solid #f1f5f9;padding:12px;transition:all .15s;position:relative}
.tps-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.06);border-color:#e2e8f0}
.tps-card-probation{animation:tps-pulse-red 2s infinite}
.tps-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.tps-card-id{font-size:12px;font-weight:700;color:#0f172a;font-family:ui-monospace,monospace}
.tps-status-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.tps-svc-badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.tps-contract{font-size:11px;font-weight:700;color:#0f172a;display:flex;align-items:center;gap:3px}
.tps-name-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.tps-name{font-size:13px;font-weight:600;color:#0f172a;display:flex;align-items:center;gap:4px}
.tps-dc{font-size:10px;color:#64748b}
.tps-score-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.tps-stars{display:flex;align-items:center;gap:1px}
.tps-stars-val{font-size:11px;font-weight:700;color:#0f172a;margin-left:4px}
.tps-vcode{font-size:10px;color:#94a3b8;font-family:ui-monospace,monospace}
.tps-sla-bar-row{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.tps-sla-label{font-size:10px;color:#64748b;white-space:nowrap;min-width:85px}
.tps-sla-bar-track{flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden}
.tps-sla-bar-fill{height:100%;border-radius:3px;transition:width .3s ease}
.tps-sla-pct{font-size:11px;font-weight:700;min-width:35px;text-align:right;font-family:ui-monospace,monospace}
.tps-metrics-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}
.tps-metric{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:#64748b}
.tps-onboard-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.tps-onboard{font-size:10px;color:#94a3b8;display:flex;align-items:center;gap:3px}
.tps-dmg-alert{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:600;background:#fef2f2;color:#dc2626}
.tps-expand-btn{display:flex;align-items:center;gap:4px;width:100%;padding:6px 0 2px;border:none;background:none;cursor:pointer;color:#64748b;font-size:11px;transition:color .15s}
.tps-expand-btn:hover{color:#0f172a}
.tps-expanded{margin-top:6px;padding:8px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0}
.tps-detail-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:4px 12px}
.tps-detail-item{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #f1f5f9}
.tps-detail-label{font-size:10px;color:#94a3b8}
.tps-detail-value{font-size:10px;font-weight:600;color:#334155;font-family:ui-monospace,monospace}
.tps-empty{text-align:center;padding:24px;color:#94a3b8;font-size:12px;grid-column:1/-1}
.tps-anal-view{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px 16px}
.tps-anal-col{display:flex;flex-direction:column;gap:6px}
.tps-anal-title{font-size:12px;font-weight:700;color:#0f172a;margin:0;padding:4px 0;border-bottom:1px solid #e2e8f0}
.tps-band-card{padding:10px;background:#fff;border-radius:8px;border:1px solid #f1f5f9}
.tps-band-name{font-size:12px;font-weight:600;color:#0f172a}
.tps-band-sub{font-size:10px;color:#94a3b8}
.tps-band-stats{display:flex;gap:16px}
.tps-band-stat{display:flex;flex-direction:column;align-items:flex-start}
.tps-band-val{font-size:14px;font-weight:700;line-height:1.2}
.tps-band-lbl{font-size:10px;color:#94a3b8;line-height:1.2}
.tps-alert-row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;background:#fff;border:1px solid #f1f5f9;margin-bottom:4px;font-size:11px}
.tps-alert-name{font-weight:600;color:#334155;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tps-alert-stat{font-size:10px;font-weight:600;color:#1e293b;font-family:ui-monospace,monospace}
.tps-alert-rooms{font-size:10px;color:#94a3b8;font-family:ui-monospace,monospace}
@keyframes tps-pulse-red{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.2)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}
@media(max-width:640px){.tps-stats-grid{grid-template-columns:repeat(3,1fr)}.tps-grid{grid-template-columns:1fr}.tps-anal-view{grid-template-columns:1fr}.tps-detail-grid{grid-template-columns:repeat(2,1fr)}}

/* ===== Warehouse Slotting Optimizer (sto-*) ===== */
.sto-root{padding:0}
.sto-header{display:flex;align-items:flex-start;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #f1f5f9;gap:12px}
.sto-header-left{display:flex;align-items:flex-start;gap:10px}
.sto-icon-wrap{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f0fdfa,#ccfbf1);border:1px solid #99f6e4}
.sto-title{font-size:15px;font-weight:700;color:#0f172a;margin:0;line-height:1.2}
.sto-subtitle{font-size:11px;color:#64748b;margin:2px 0 0;line-height:1.3}
.sto-live-count{font-size:11px;font-weight:600;color:#d97706;font-family:ui-monospace,monospace;background:#fffbeb;padding:2px 8px;border-radius:4px;border:1px solid #fde68a}
.sto-stats-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:10px 16px;border-bottom:1px solid #f1f5f9}
.sto-stat-card{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:#fff;border:1px solid #f1f5f9}
.sto-stat-icon{width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sto-stat-info{display:flex;flex-direction:column;min-width:0}
.sto-stat-value{font-size:14px;font-weight:700;color:#0f172a;line-height:1.2}
.sto-stat-label{font-size:10px;color:#64748b;line-height:1.2}
.sto-controls{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #f1f5f9}
.sto-filter-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:6px;font-size:11px;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;transition:all .15s}
.sto-filter-chip:hover{background:#f1f5f9;border-color:#cbd5e1}
.sto-filter-active{background:#f0fdfa;color:#0d9488;border-color:#99f6e4;box-shadow:0 0 0 2px rgba(13,148,136,.1)}
.sto-chip-count{font-size:10px;font-weight:600;background:#e2e8f0;padding:1px 5px;border-radius:3px;color:#475569;font-family:ui-monospace,monospace}
.sto-filter-active .sto-chip-count{background:#99f6e4;color:#115e59}
.sto-secondary-filters{display:flex;align-items:center;gap:8px;padding:8px 16px 10px;border-bottom:1px solid #f1f5f9}
.sto-type-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:11px;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;transition:all .15s}
.sto-type-chip:hover{background:#f1f5f9}
.sto-type-active{background:#f0fdfa;color:#0d9488;border-color:#99f6e4}
.sto-type-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.sto-view-tabs{display:flex;gap:4px;padding:8px 16px;border-bottom:1px solid #f1f5f9;overflow-x:auto}
.sto-view-tab{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:500;color:#64748b;cursor:pointer;transition:all .15s;white-space:nowrap;background:transparent;border:1px solid transparent}
.sto-view-tab:hover{background:#f1f5f9}
.sto-view-tab-active{background:#fff;color:#0f172a;border-color:#e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.sto-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px 16px}
.sto-card{border-radius:8px;background:#fff;border:1px solid #f1f5f9;padding:12px;transition:all .15s;position:relative}
.sto-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.06);border-color:#e2e8f0}
.sto-card-overstocked{animation:sto-pulse-amber 2s infinite}
.sto-card-empty{opacity:.6}
.sto-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.sto-card-id{font-size:12px;font-weight:700;color:#0f172a;font-family:ui-monospace,monospace}
.sto-status-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.sto-abc-badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.sto-st-badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.sto-zone-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.sto-zone{font-size:13px;font-weight:600;color:#0f172a;display:flex;align-items:center;gap:4px}
.sto-dc{font-size:10px;color:#64748b}
.sto-cat-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.sto-cat{font-size:11px;font-weight:500;color:#475569}
.sto-aisle{font-size:10px;color:#94a3b8;display:flex;align-items:center;gap:3px}
.sto-util-bar-row{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.sto-util-label{font-size:10px;color:#64748b;white-space:nowrap;min-width:65px}
.sto-util-bar-track{flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden}
.sto-util-bar-fill{height:100%;border-radius:3px;transition:width .3s ease}
.sto-util-pct{font-size:11px;font-weight:700;min-width:32px;text-align:right;font-family:ui-monospace,monospace}
.sto-cap-info{font-size:10px;color:#94a3b8;font-family:ui-monospace,monospace}
.sto-turnover-row{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.sto-turn-label{font-size:10px;color:#64748b;white-space:nowrap}
.sto-turn-val{font-size:12px;font-weight:700;font-family:ui-monospace,monospace}
.sto-turn-bar-wrap{flex:1}
.sto-turn-bar-track{height:4px;background:#f1f5f9;border-radius:2px;overflow:hidden;max-width:120px}
.sto-turn-bar-fill{height:100%;border-radius:2px;transition:width .3s ease}
.sto-metrics-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}
.sto-metric{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:#64748b}
.sto-time-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.sto-time-metric{font-size:10px;color:#94a3b8;display:flex;align-items:center;gap:3px}
.sto-over-tag{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:600;background:#fef2f2;color:#dc2626}
.sto-expand-btn{display:flex;align-items:center;gap:4px;width:100%;padding:6px 0 2px;border:none;background:none;cursor:pointer;color:#64748b;font-size:11px;transition:color .15s}
.sto-expand-btn:hover{color:#0f172a}
.sto-expanded{margin-top:6px;padding:8px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0}
.sto-detail-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:4px 12px}
.sto-detail-item{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #f1f5f9}
.sto-detail-label{font-size:10px;color:#94a3b8}
.sto-detail-value{font-size:10px;font-weight:600;color:#334155;font-family:ui-monospace,monospace}
.sto-empty{text-align:center;padding:24px;color:#94a3b8;font-size:12px;grid-column:1/-1}
.sto-anal-view{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px 16px}
.sto-anal-col{display:flex;flex-direction:column;gap:6px}
.sto-anal-title{font-size:12px;font-weight:700;color:#0f172a;margin:0;padding:4px 0;border-bottom:1px solid #e2e8f0}
.sto-band-card{padding:10px;background:#fff;border-radius:8px;border:1px solid #f1f5f9}
.sto-band-name{font-size:12px;font-weight:600;color:#0f172a}
.sto-band-sub{font-size:10px;color:#94a3b8}
.sto-band-stats{display:flex;gap:16px}
.sto-band-stat{display:flex;flex-direction:column;align-items:flex-start}
.sto-band-val{font-size:14px;font-weight:700;line-height:1.2}
.sto-band-lbl{font-size:10px;color:#94a3b8;line-height:1.2}
.sto-alert-row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;background:#fff;border:1px solid #f1f5f9;margin-bottom:4px;font-size:11px}
.sto-alert-name{font-weight:600;color:#334155;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sto-alert-stat{font-size:10px;font-weight:600;color:#1e293b;font-family:ui-monospace,monospace}
.sto-alert-rooms{font-size:10px;color:#94a3b8;font-family:ui-monospace,monospace}
@keyframes sto-pulse-amber{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,.15)}50%{box-shadow:0 0 0 6px rgba(245,158,11,0)}}
@keyframes sto-pulse-red{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.2)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}
@media(max-width:640px){.sto-stats-grid{grid-template-columns:repeat(3,1fr)}.sto-grid{grid-template-columns:1fr}.sto-anal-view{grid-template-columns:1fr}.sto-detail-grid{grid-template-columns:repeat(2,1fr)}}
"""

globals_path = '/home/z/my-project/src/app/globals.css'
with open(globals_path, 'a') as f:
    f.write(CSS)

lines = CSS.count('\n')
print(f"Appended {lines} lines of CSS for tps-* and sto-* prefixes")
