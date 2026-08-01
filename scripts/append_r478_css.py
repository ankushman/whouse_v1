#!/usr/bin/env python3
"""Append CSS for lpt-* (Labor Productivity) and ccm-* (Cold Chain Monitoring) to globals.css"""

CSS_LPT = """
/* ===== Labor Productivity Tracker (lpt-*) ===== */
.lpt-root{padding:0}
.lpt-header{display:flex;align-items:flex-start;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #f1f5f9;gap:12px}
.lpt-header-left{display:flex;align-items:flex-start;gap:10px}
.lpt-icon-wrap{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#fff7ed,#ffedd5);border:1px solid #fed7aa}
.lpt-title{font-size:15px;font-weight:700;color:#0f172a;margin:0;line-height:1.2}
.lpt-subtitle{font-size:11px;color:#64748b;margin:2px 0 0;line-height:1.3}
.lpt-live-count{font-size:11px;font-weight:600;color:#16a34a;font-family:ui-monospace,monospace;background:#f0fdf4;padding:2px 8px;border-radius:4px;border:1px solid #bbf7d0}
.lpt-stats-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:10px 16px;border-bottom:1px solid #f1f5f9}
.lpt-stat-card{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:#fff;border:1px solid #f1f5f9}
.lpt-stat-icon{width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.lpt-stat-info{display:flex;flex-direction:column;min-width:0}
.lpt-stat-value{font-size:14px;font-weight:700;color:#0f172a;line-height:1.2}
.lpt-stat-label{font-size:10px;color:#64748b;line-height:1.2}
.lpt-controls{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #f1f5f9}
.lpt-filter-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:6px;font-size:11px;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;transition:all .15s}
.lpt-filter-chip:hover{background:#f1f5f9;border-color:#cbd5e1}
.lpt-filter-active{background:#eff6ff;color:#2563eb;border-color:#93c5fd;box-shadow:0 0 0 2px rgba(37,99,235,.1)}
.lpt-chip-count{font-size:10px;font-weight:600;background:#e2e8f0;padding:1px 5px;border-radius:3px;color:#475569;font-family:ui-monospace,monospace}
.lpt-filter-active .lpt-chip-count{background:#bfdbfe;color:#1e40af}
.lpt-secondary-filters{display:flex;align-items:center;gap:8px;padding:8px 16px 10px;border-bottom:1px solid #f1f5f9}
.lpt-type-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:11px;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;transition:all .15s}
.lpt-type-chip:hover{background:#f1f5f9}
.lpt-type-active{background:#f0fdf4;color:#16a34a;border-color:#86efac}
.lpt-type-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.lpt-view-tabs{display:flex;gap:4px;padding:8px 16px;border-bottom:1px solid #f1f5f9;overflow-x:auto}
.lpt-view-tab{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:500;color:#64748b;cursor:pointer;transition:all .15s;white-space:nowrap;background:transparent;border:1px solid transparent}
.lpt-view-tab:hover{background:#f1f5f9}
.lpt-view-tab-active{background:#fff;color:#0f172a;border-color:#e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.lpt-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px 16px}
.lpt-card{border-radius:8px;background:#fff;border:1px solid #f1f5f9;padding:12px;transition:all .15s;position:relative}
.lpt-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.06);border-color:#e2e8f0}
.lpt-card-absent{opacity:.65}
.lpt-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.lpt-card-id{font-size:12px;font-weight:700;color:#0f172a;font-family:ui-monospace,monospace}
.lpt-emp-id{font-size:10px;color:#64748b;font-family:ui-monospace,monospace;display:flex;align-items:center;gap:3px}
.lpt-status-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.lpt-ot-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;background:#fef3c7;color:#92400e}
.lpt-name-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.lpt-name{font-size:13px;font-weight:600;color:#0f172a}
.lpt-dc{font-size:10px;color:#64748b}
.lpt-dept-row{display:flex;align-items:center;gap:6px;margin-bottom:8px;flex-wrap:wrap}
.lpt-dept-badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.lpt-shift-badge{font-size:10px;color:#64748b;display:flex;align-items:center;gap:3px}
.lpt-skill-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.lpt-prod-bar-row{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.lpt-prod-label{font-size:10px;color:#64748b;white-space:nowrap;min-width:70px}
.lpt-prod-bar-track{flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden}
.lpt-prod-bar-fill{height:100%;border-radius:3px;transition:width .3s ease}
.lpt-prod-pct{font-size:11px;font-weight:700;min-width:32px;text-align:right;font-family:ui-monospace,monospace}
.lpt-task-bar-row{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.lpt-task-label{font-size:10px;color:#64748b;white-space:nowrap}
.lpt-task-count{font-size:10px;font-weight:600;color:#0f172a;font-family:ui-monospace,monospace}
.lpt-task-bar-track{flex:1;height:4px;background:#f1f5f9;border-radius:2px;overflow:hidden;max-width:80px}
.lpt-task-bar-fill{height:100%;border-radius:2px;background:#3b82f6;transition:width .3s ease}
.lpt-task-pct{font-size:10px;font-weight:600;color:#3b82f6;font-family:ui-monospace,monospace}
.lpt-metrics-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}
.lpt-metric{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:#64748b}
.lpt-expand-btn{display:flex;align-items:center;gap:4px;width:100%;padding:6px 0 2px;border:none;background:none;cursor:pointer;color:#64748b;font-size:11px;transition:color .15s}
.lpt-expand-btn:hover{color:#0f172a}
.lpt-expanded{margin-top:6px;padding:8px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0}
.lpt-detail-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:4px 12px}
.lpt-detail-item{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #f1f5f9}
.lpt-detail-label{font-size:10px;color:#94a3b8}
.lpt-detail-value{font-size:10px;font-weight:600;color:#334155;font-family:ui-monospace,monospace}
.lpt-empty{text-align:center;padding:24px;color:#94a3b8;font-size:12px;grid-column:1/-1}
.lpt-anal-view{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px 16px}
.lpt-anal-col{display:flex;flex-direction:column;gap:6px}
.lpt-anal-title{font-size:12px;font-weight:700;color:#0f172a;margin:0;padding:4px 0;border-bottom:1px solid #e2e8f0}
.lpt-band-card{padding:10px;background:#fff;border-radius:8px;border:1px solid #f1f5f9}
.lpt-band-name{font-size:12px;font-weight:600;color:#0f172a}
.lpt-band-sub{font-size:10px;color:#94a3b8}
.lpt-band-stats{display:flex;gap:16px}
.lpt-band-stat{display:flex;flex-direction:column;align-items:flex-start}
.lpt-band-val{font-size:14px;font-weight:700;line-height:1.2}
.lpt-band-lbl{font-size:10px;color:#94a3b8;line-height:1.2}
.lpt-alert-row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;background:#fff;border:1px solid #f1f5f9;margin-bottom:4px;font-size:11px}
.lpt-alert-name{font-weight:600;color:#334155;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lpt-alert-stat{font-size:10px;font-weight:600;color:#1e293b;font-family:ui-monospace,monospace}
.lpt-alert-rooms{font-size:10px;color:#94a3b8;font-family:ui-monospace,monospace}
@keyframes lpt-pulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.2)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}
@media(max-width:640px){.lpt-stats-grid{grid-template-columns:repeat(3,1fr)}.lpt-grid{grid-template-columns:1fr}.lpt-anal-view{grid-template-columns:1fr}.lpt-detail-grid{grid-template-columns:repeat(2,1fr)}}

/* ===== Cold Chain Monitoring (ccm-*) ===== */
.ccm-root{padding:0}
.ccm-header{display:flex;align-items:flex-start;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #f1f5f9;gap:12px}
.ccm-header-left{display:flex;align-items:flex-start;gap:10px}
.ccm-icon-wrap{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#ecfeff,#cffafe);border:1px solid #a5f3fc}
.ccm-title{font-size:15px;font-weight:700;color:#0f172a;margin:0;line-height:1.2}
.ccm-subtitle{font-size:11px;color:#64748b;margin:2px 0 0;line-height:1.3}
.ccm-live-count{font-size:11px;font-weight:600;color:#dc2626;font-family:ui-monospace,monospace;background:#fef2f2;padding:2px 8px;border-radius:4px;border:1px solid #fecaca}
.ccm-stats-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:10px 16px;border-bottom:1px solid #f1f5f9}
.ccm-stat-card{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:#fff;border:1px solid #f1f5f9}
.ccm-stat-icon{width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ccm-stat-info{display:flex;flex-direction:column;min-width:0}
.ccm-stat-value{font-size:14px;font-weight:700;color:#0f172a;line-height:1.2}
.ccm-stat-label{font-size:10px;color:#64748b;line-height:1.2}
.ccm-controls{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #f1f5f9}
.ccm-filter-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:6px;font-size:11px;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;transition:all .15s}
.ccm-filter-chip:hover{background:#f1f5f9;border-color:#cbd5e1}
.ccm-filter-active{background:#ecfeff;color:#0891b2;border-color:#67e8f9;box-shadow:0 0 0 2px rgba(8,145,178,.1)}
.ccm-chip-count{font-size:10px;font-weight:600;background:#e2e8f0;padding:1px 5px;border-radius:3px;color:#475569;font-family:ui-monospace,monospace}
.ccm-filter-active .ccm-chip-count{background:#a5f3fc;color:#155e75}
.ccm-secondary-filters{display:flex;align-items:center;gap:8px;padding:8px 16px 10px;border-bottom:1px solid #f1f5f9}
.ccm-type-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:11px;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;transition:all .15s}
.ccm-type-chip:hover{background:#f1f5f9}
.ccm-type-active{background:#ecfeff;color:#0891b2;border-color:#67e8f9}
.ccm-type-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.ccm-view-tabs{display:flex;gap:4px;padding:8px 16px;border-bottom:1px solid #f1f5f9;overflow-x:auto}
.ccm-view-tab{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:500;color:#64748b;cursor:pointer;transition:all .15s;white-space:nowrap;background:transparent;border:1px solid transparent}
.ccm-view-tab:hover{background:#f1f5f9}
.ccm-view-tab-active{background:#fff;color:#0f172a;border-color:#e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.ccm-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px 16px}
.ccm-card{border-radius:8px;background:#fff;border:1px solid #f1f5f9;padding:12px;transition:all .15s;position:relative}
.ccm-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.06);border-color:#e2e8f0}
.ccm-card-critical{animation:ccm-pulse-red 2s infinite}
.ccm-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.ccm-card-id{font-size:12px;font-weight:700;color:#0f172a;font-family:ui-monospace,monospace}
.ccm-status-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.ccm-alert-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;background:#fef2f2;color:#dc2626;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ccm-comp-dot{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px}
.ccm-name-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.ccm-name{font-size:13px;font-weight:600;color:#0f172a;display:flex;align-items:center;gap:4px}
.ccm-dc{font-size:10px;color:#64748b}
.ccm-zone-row{display:flex;align-items:center;gap:6px;margin-bottom:8px;flex-wrap:wrap}
.ccm-zone-badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600}
.ccm-temp-range{font-size:10px;color:#94a3b8}
.ccm-zone{font-size:10px;color:#64748b;font-weight:500}
.ccm-temp-row{display:flex;align-items:center;justify-content:space-between;padding:8px;background:#f8fafc;border-radius:6px;margin-bottom:6px}
.ccm-temp-display{display:flex;align-items:center;gap:6px}
.ccm-temp-val{font-size:18px;font-weight:800;font-family:ui-monospace,monospace}
.ccm-target-temp{display:flex;align-items:center;gap:8px}
.ccm-temp-label{font-size:11px;color:#64748b}
.ccm-deviation{font-size:11px;font-weight:700;font-family:ui-monospace,monospace}
.ccm-humidity-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}
.ccm-humid{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:#64748b}
.ccm-doors{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:#64748b}
.ccm-power{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:#64748b}
.ccm-cap-bar-row{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.ccm-cap-label{font-size:10px;color:#64748b;white-space:nowrap;min-width:55px}
.ccm-cap-bar-track{flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden}
.ccm-cap-bar-fill{height:100%;border-radius:3px;transition:width .3s ease}
.ccm-cap-pct{font-size:11px;font-weight:700;min-width:32px;text-align:right;font-family:ui-monospace,monospace}
.ccm-metrics-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}
.ccm-metric{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:#64748b}
.ccm-expand-btn{display:flex;align-items:center;gap:4px;width:100%;padding:6px 0 2px;border:none;background:none;cursor:pointer;color:#64748b;font-size:11px;transition:color .15s}
.ccm-expand-btn:hover{color:#0f172a}
.ccm-expanded{margin-top:6px;padding:8px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0}
.ccm-detail-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:4px 12px}
.ccm-detail-item{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #f1f5f9}
.ccm-detail-label{font-size:10px;color:#94a3b8}
.ccm-detail-value{font-size:10px;font-weight:600;color:#334155;font-family:ui-monospace,monospace}
.ccm-empty{text-align:center;padding:24px;color:#94a3b8;font-size:12px;grid-column:1/-1}
.ccm-anal-view{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px 16px}
.ccm-anal-col{display:flex;flex-direction:column;gap:6px}
.ccm-anal-title{font-size:12px;font-weight:700;color:#0f172a;margin:0;padding:4px 0;border-bottom:1px solid #e2e8f0}
.ccm-band-card{padding:10px;background:#fff;border-radius:8px;border:1px solid #f1f5f9}
.ccm-band-name{font-size:12px;font-weight:600;color:#0f172a}
.ccm-band-sub{font-size:10px;color:#94a3b8}
.ccm-band-stats{display:flex;gap:16px}
.ccm-band-stat{display:flex;flex-direction:column;align-items:flex-start}
.ccm-band-val{font-size:14px;font-weight:700;line-height:1.2}
.ccm-band-lbl{font-size:10px;color:#94a3b8;line-height:1.2}
.ccm-critical-tag{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;background:#fef2f2;color:#dc2626;margin-top:4px}
.ccm-alert-row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;background:#fff;border:1px solid #f1f5f9;margin-bottom:4px;font-size:11px}
.ccm-alert-name{font-weight:600;color:#334155;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ccm-alert-stat{font-size:10px;font-weight:600;color:#1e293b;font-family:ui-monospace,monospace}
.ccm-alert-rooms{font-size:10px;color:#94a3b8;font-family:ui-monospace,monospace}
@keyframes ccm-pulse-red{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.2)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}
@keyframes ccm-pulse-amber{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,.15)}50%{box-shadow:0 0 0 5px rgba(245,158,11,0)}}
@media(max-width:640px){.ccm-stats-grid{grid-template-columns:repeat(3,1fr)}.ccm-grid{grid-template-columns:1fr}.ccm-anal-view{grid-template-columns:1fr}.ccm-detail-grid{grid-template-columns:repeat(2,1fr)}}
"""

globals_path = '/home/z/my-project/src/app/globals.css'
with open(globals_path, 'a') as f:
    f.write(CSS_LPT)

lines = CSS_LPT.count('\n')
print(f"Appended {lines} lines of CSS for lpt-* and ccm-* prefixes")
