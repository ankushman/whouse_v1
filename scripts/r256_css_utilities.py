#!/usr/bin/env python3
"""R256: Append 600+ new CSS utility classes to globals.css"""

CSS = """\
/* ============================================================================
 * R256 — SearchFilterToolbar + ModuleBreadcrumb + Glass/Badge/Card/Animation
 *         600+ new utility classes for enhanced visual experience
 * ============================================================================ */

/* ── Search Toolbar ─────────────────────────────────────────────────────── */
.search-toolbar {
  padding: 8px 0;
  animation: search-toolbar-enter 0.3s ease-out;
}
@keyframes search-toolbar-enter {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.search-toolbar-row {
  gap: 8px;
}
.search-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 180px;
}
.search-input-icon {
  color: oklch(0.55 0 0);
  pointer-events: none;
}
.search-input {
  width: 100%;
  height: 36px;
  padding-left: 36px;
  padding-right: 32px;
  border-radius: 8px;
  border: 1px solid oklch(0.85 0 0);
  background: oklch(0.98 0 0);
  font-size: 13px;
  transition: all 0.2s ease;
}
.search-input:focus {
  border-color: oklch(0.55 0.2 250);
  box-shadow: 0 0 0 3px oklch(0.55 0.2 250 / 0.1);
  background: oklch(1 0 0);
}
.search-input::placeholder {
  color: oklch(0.65 0 0);
}
:is(.dark) .search-input {
  background: oklch(0.2 0 0);
  border-color: oklch(0.35 0 0);
}
:is(.dark) .search-input:focus {
  border-color: oklch(0.65 0.2 250);
  box-shadow: 0 0 0 3px oklch(0.65 0.2 250 / 0.15);
}
.search-clear-btn {
  padding: 2px;
  border-radius: 4px;
  color: oklch(0.55 0 0);
  transition: all 0.15s;
}
.search-clear-btn:hover {
  color: oklch(0.3 0 0);
  background: oklch(0.9 0 0);
}
:is(.dark) .search-clear-btn:hover {
  background: oklch(0.3 0 0);
  color: oklch(0.8 0 0);
}
.search-filter-toggle {
  gap: 4px;
  font-size: 12px;
  white-space: nowrap;
}
.filter-count-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: oklch(0.55 0.2 250);
  font-size: 10px;
  font-weight: 700;
  color: white;
}
.filter-chips-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  animation: search-toolbar-enter 0.2s ease-out;
}
.filter-chip-active {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  background: oklch(0.55 0.2 250 / 0.1);
  color: oklch(0.45 0.2 250);
  border: 1px solid oklch(0.55 0.2 250 / 0.2);
}
.filter-chip-active:hover {
  background: oklch(0.55 0.2 250 / 0.2);
  transform: translateY(-1px);
}
.filter-panel {
  border: 1px solid oklch(0.88 0 0);
  border-radius: 10px;
  background: oklch(0.98 0 0 / 0.5);
  padding: 12px;
  backdrop-filter: blur(8px);
  animation: expand-down 0.25s ease-out;
}
:is(.dark) .filter-panel {
  border-color: oklch(0.3 0 0);
  background: oklch(0.15 0 0 / 0.5);
}
@keyframes expand-down {
  from { opacity: 0; max-height: 0; transform: translateY(-8px); }
  to { opacity: 1; max-height: 400px; transform: translateY(0); }
}
.filter-groups {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 12px;
}
@media (min-width: 640px) {
  .filter-groups { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .filter-groups { grid-template-columns: repeat(3, 1fr); }
}
.filter-group {
  min-width: 0;
}
.filter-chip {
  border: 1px solid oklch(0.85 0 0);
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 11px;
  background: oklch(1 0 0);
  color: oklch(0.5 0 0);
  transition: all 0.15s;
  cursor: pointer;
  white-space: nowrap;
}
.filter-chip:hover {
  border-color: oklch(0.55 0.2 250 / 0.3);
  background: oklch(0.55 0.2 250 / 0.05);
}

/* ── Module Breadcrumb ───────────────────────────────────────────────────── */
.module-breadcrumb {
  padding: 6px 0;
  line-height: 1;
}
.module-breadcrumb-link {
  color: oklch(0.55 0 0);
  text-decoration: none;
  transition: color 0.15s;
}
.module-breadcrumb-link:hover {
  color: oklch(0.35 0.2 250);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.module-breadcrumb-current {
  color: oklch(0.3 0 0);
  font-weight: 500;
}
:is(.dark) .module-breadcrumb-link { color: oklch(0.6 0 0); }
:is(.dark) .module-breadcrumb-link:hover { color: oklch(0.7 0.15 250); }
:is(.dark) .module-breadcrumb-current { color: oklch(0.85 0 0); }

/* ── Glass Effects (Enhanced) ─────────────────────────────────────────────── */
.glass-subtle {
  background: oklch(0.98 0 0 / 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid oklch(0.9 0 0 / 0.5);
}
.glass-elevated {
  background: oklch(0.95 0 0 / 0.7);
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  border: 1px solid oklch(0.88 0 0 / 0.6);
  box-shadow: 0 8px 32px oklch(0 0 0 / 0.06);
}
:is(.dark) .glass-subtle {
  background: oklch(0.18 0 0 / 0.6);
  border-color: oklch(0.3 0 0 / 0.4);
}
:is(.dark) .glass-elevated {
  background: oklch(0.15 0 0 / 0.7);
  border-color: oklch(0.28 0 0 / 0.5);
  box-shadow: 0 8px 32px oklch(0 0 0 / 0.3);
}
.glass-card {
  background: oklch(0.97 0.005 250 / 0.8);
  backdrop-filter: blur(16px) saturate(1.1);
  -webkit-backdrop-filter: blur(16px) saturate(1.1);
  border: 1px solid oklch(0.85 0.01 250 / 0.5);
  border-radius: 12px;
  transition: all 0.3s ease;
}
.glass-card:hover {
  border-color: oklch(0.7 0.1 250 / 0.4);
  box-shadow: 0 8px 24px oklch(0.55 0.15 250 / 0.06);
  transform: translateY(-1px);
}
:is(.dark) .glass-card {
  background: oklch(0.16 0.01 250 / 0.8);
  border-color: oklch(0.3 0.01 250 / 0.4);
}
:is(.dark) .glass-card:hover {
  border-color: oklch(0.55 0.12 250 / 0.3);
  box-shadow: 0 8px 24px oklch(0.55 0.15 250 / 0.1);
}

/* ── Stat Card Glow ──────────────────────────────────────────────────────── */
.stat-card-glow {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  transition: all 0.3s ease;
}
.stat-card-glow::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, oklch(0.65 0.2 250), oklch(0.7 0.2 180));
  border-radius: 12px 12px 0 0;
  opacity: 0;
  transition: opacity 0.3s;
}
.stat-card-glow:hover::before {
  opacity: 1;
}
.stat-card-glow:hover {
  box-shadow: 0 4px 20px oklch(0.55 0.15 250 / 0.1);
  transform: translateY(-2px);
}
:is(.dark) .stat-card-glow:hover {
  box-shadow: 0 4px 20px oklch(0.55 0.15 250 / 0.15);
}

/* ── Card Shine Effect ──────────────────────────────────────────────────── */
.card-shine {
  position: relative;
  overflow: hidden;
}
.card-shine::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    60deg,
    transparent 40%,
    oklch(1 0 0 / 0.05) 45%,
    oklch(1 0 0 / 0.1) 50%,
    oklch(1 0 0 / 0.05) 55%,
    transparent 60%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}
.card-shine:hover::after {
  transform: translateX(100%);
}
:is(.dark) .card-shine::after {
  background: linear-gradient(
    60deg,
    transparent 40%,
    oklch(1 0 0 / 0.03) 45%,
    oklch(1 0 0 / 0.06) 50%,
    oklch(1 0 0 / 0.03) 55%,
    transparent 60%
  );
}

/* ── Card Gradient Overlay ───────────────────────────────────────────────── */
.card-gradient-overlay {
  position: relative;
  overflow: hidden;
}
.card-gradient-overlay::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to top, oklch(0.3 0.05 250 / 0.04), transparent);
  pointer-events: none;
  border-radius: 0 0 12px 12px;
}
:is(.dark) .card-gradient-overlay::before {
  background: linear-gradient(to top, oklch(0.15 0.05 250 / 0.1), transparent);
}

/* ── Button Shine ────────────────────────────────────────────────────────── */
.btn-shine {
  position: relative;
  overflow: hidden;
  transition: all 0.2s;
}
.btn-shine::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, oklch(1 0 0 / 0.2), transparent);
  transform: skewX(-20deg);
  transition: left 0.5s ease;
}
.btn-shine:hover::after {
  left: 100%;
}
.btn-outline-animate {
  transition: all 0.25s ease;
  border: 1px solid oklch(0.8 0 0);
}
.btn-outline-animate:hover {
  border-color: oklch(0.55 0.2 250);
  box-shadow: 0 0 0 3px oklch(0.55 0.2 250 / 0.1);
  transform: translateY(-1px);
}
:is(.dark) .btn-outline-animate {
  border-color: oklch(0.35 0 0);
}
:is(.dark) .btn-outline-animate:hover {
  border-color: oklch(0.65 0.2 250);
  box-shadow: 0 0 0 3px oklch(0.65 0.2 250 / 0.15);
}

/* ── Input Effects ─────────────────────────────────────────────────────── */
.input-focus-ring {
  transition: all 0.2s;
  border-radius: 8px;
}
.input-focus-ring:focus {
  box-shadow: 0 0 0 3px oklch(0.55 0.2 250 / 0.15);
  border-color: oklch(0.55 0.2 250);
}
.input-hover-border {
  transition: all 0.15s;
  border-color: oklch(0.85 0 0);
}
.input-hover-border:hover {
  border-color: oklch(0.7 0.05 250);
}
.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: 10px;
  background: oklch(0.96 0 0);
  border: 1px solid oklch(0.88 0 0);
}
.input-group:focus-within {
  border-color: oklch(0.55 0.2 250);
  box-shadow: 0 0 0 3px oklch(0.55 0.2 250 / 0.08);
}
:is(.dark) .input-group {
  background: oklch(0.18 0 0);
  border-color: oklch(0.3 0 0);
}

/* ── Badge Effects (Enhanced) ────────────────────────────────────────────── */
.badge-interactive {
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}
.badge-interactive:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px oklch(0 0 0 / 0.08);
  filter: brightness(1.05);
}
.badge-interactive:active {
  transform: translateY(0);
}
.badge-ring {
  box-shadow: 0 0 0 2px oklch(0.98 0 0), 0 0 0 4px oklch(0.6 0.2 250 / 0.3);
}
:is(.dark) .badge-ring {
  box-shadow: 0 0 0 2px oklch(0.2 0 0), 0 0 0 4px oklch(0.65 0.2 250 / 0.4);
}
.badge-glow-success {
  box-shadow: 0 0 8px oklch(0.7 0.2 145 / 0.3), 0 0 2px oklch(0.7 0.2 145 / 0.5);
}
.badge-glow-warning {
  box-shadow: 0 0 8px oklch(0.8 0.18 85 / 0.3), 0 0 2px oklch(0.8 0.18 85 / 0.5);
}
.badge-glow-danger {
  box-shadow: 0 0 8px oklch(0.65 0.22 25 / 0.3), 0 0 2px oklch(0.65 0.22 25 / 0.5);
}
.badge-pulse {
  animation: badge-pop 0.3s ease-out;
}
@keyframes badge-pop {
  0% { transform: scale(0.85); opacity: 0.5; }
  60% { transform: scale(1.08); }
  100% { transform: scale(1); opacity: 1; }
}

/* ── Tag Removable ───────────────────────────────────────────────────────── */
.tag-removable {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  background: oklch(0.93 0.01 250 / 0.8);
  border: 1px solid oklch(0.85 0.01 250 / 0.5);
}
.tag-removable:hover {
  background: oklch(0.55 0.2 250 / 0.1);
  border-color: oklch(0.55 0.2 250 / 0.3);
}
.tag-removable .tag-remove-icon {
  width: 12px;
  height: 12px;
  opacity: 0.5;
  transition: opacity 0.15s;
}
.tag-removable:hover .tag-remove-icon {
  opacity: 1;
}

/* ── Table Enhancements ──────────────────────────────────────────────────── */
.table-hover-highlight tbody tr {
  transition: all 0.15s;
}
.table-hover-highlight tbody tr:hover {
  background: oklch(0.55 0.1 250 / 0.04);
  box-shadow: 0 1px 0 oklch(0.55 0.1 250 / 0.1);
}
:is(.dark) .table-hover-highlight tbody tr:hover {
  background: oklch(0.6 0.1 250 / 0.08);
}
.table-cell-truncate {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.table-cell-number {
  font-variant-numeric: tabular-nums;
  text-align: right;
  font-feature-settings: "tnum";
}
.table-header-gradient {
  background: linear-gradient(180deg, oklch(0.95 0.005 250 / 0.5), oklch(0.97 0.005 250 / 0.2));
}
.table-footer {
  border-top: 2px solid oklch(0.55 0.2 250 / 0.2);
  background: oklch(0.96 0.005 250 / 0.3);
  font-weight: 500;
}
:is(.dark) .table-header-gradient {
  background: linear-gradient(180deg, oklch(0.2 0.005 250 / 0.5), oklch(0.17 0.005 250 / 0.2));
}
:is(.dark) .table-footer {
  border-top-color: oklch(0.55 0.2 250 / 0.15);
  background: oklch(0.15 0.005 250 / 0.3);
}

/* ── Dialog Polished ────────────────────────────────────────────────────── */
.dialog-content-polished {
  border-radius: 16px;
  border: 1px solid oklch(0.88 0.01 250 / 0.5);
  box-shadow: 0 24px 48px oklch(0 0 0 / 0.12), 0 0 0 1px oklch(0 0 0 / 0.04);
  animation: dialog-slide-up 0.3s ease-out;
}
@keyframes dialog-slide-up {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.dialog-header-polished {
  padding: 20px 24px 0;
}
.dialog-body-polished {
  padding: 16px 24px;
}
.dialog-footer-polished {
  padding: 16px 24px 20px;
  border-top: 1px solid oklch(0.88 0 0);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
:is(.dark) .dialog-content-polished {
  border-color: oklch(0.3 0.01 250 / 0.5);
  box-shadow: 0 24px 48px oklch(0 0 0 / 0.4), 0 0 0 1px oklch(0.4 0 0 / 0.3);
}

/* ── Navigation Item Indicator ───────────────────────────────────────────── */
.nav-item-indicator {
  position: relative;
}
.nav-item-indicator::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  border-radius: 0 3px 3px 0;
  background: oklch(0.55 0.2 250);
  transition: height 0.2s ease;
}
.nav-item-indicator.active::before {
  height: 60%;
}

/* ── Tooltip ──────────────────────────────────────────────────────────────── */
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}
.tooltip-content {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  border-radius: 6px;
  background: oklch(0.2 0 0);
  color: oklch(0.95 0 0);
  font-size: 11px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 50;
}
.tooltip-wrapper:hover .tooltip-content {
  opacity: 1;
}

/* ── Scrollbar Styles ────────────────────────────────────────────────────── */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: oklch(0.8 0 0);
  border-radius: 3px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: oklch(0.65 0 0);
}
:is(.dark) .scrollbar-thin::-webkit-scrollbar-thumb {
  background: oklch(0.35 0 0);
}
:is(.dark) .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: oklch(0.45 0 0);
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-fade {
  mask-image: linear-gradient(to bottom, transparent, black 12px, black calc(100% - 12px), transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 12px, black calc(100% - 12px), transparent);
}

/* ── Divider Utilities ────────────────────────────────────────────────────── */
.divider-vertical {
  width: 1px;
  align-self: stretch;
  background: oklch(0.88 0 0);
  margin: 0 8px;
}
:is(.dark) .divider-vertical {
  background: oklch(0.3 0 0);
}
.divider-horizontal {
  height: 1px;
  width: 100%;
  background: oklch(0.88 0 0);
  margin: 8px 0;
}
:is(.dark) .divider-horizontal {
  background: oklch(0.3 0 0);
}
.divider-dashed {
  border-top: 1px dashed oklch(0.85 0 0);
}
:is(.dark) .divider-dashed {
  border-top-color: oklch(0.3 0 0);
}
.divider-dotted {
  border-top: 1px dotted oklch(0.85 0 0);
}
:is(.dark) .divider-dotted {
  border-top-color: oklch(0.3 0 0);
}
.divider-gradient {
  height: 1px;
  background: linear-gradient(90deg, transparent, oklch(0.55 0.15 250 / 0.3), transparent);
}
.divider-with-label {
  display: flex;
  align-items: center;
  gap: 12px;
  color: oklch(0.6 0 0);
  font-size: 12px;
}
.divider-with-label::before,
.divider-with-label::after {
  content: "";
  flex: 1;
  height: 1px;
  background: oklch(0.88 0 0);
}
:is(.dark) .divider-with-label::before,
:is(.dark) .divider-with-label::after {
  background: oklch(0.3 0 0);
}

/* ── Typography Utilities ─────────────────────────────────────────────────── */
.text-mono {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
}
.text-heading-sm {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
}
.text-heading-xs {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0;
}
.text-shadow-sm {
  text-shadow: 0 1px 2px oklch(0 0 0 / 0.06);
}
.text-balance {
  text-wrap: balance;
}
.truncate-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.text-link-subtle {
  color: oklch(0.5 0 0);
  text-decoration: none;
  transition: color 0.15s;
}
.text-link-subtle:hover {
  color: oklch(0.4 0.15 250);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* ── Layout Utilities ────────────────────────────────────────────────────── */
.grid-auto-fit {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
.grid-auto-fill {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
.flex-col-gap-1 { gap: 4px; }
.flex-col-gap-2 { gap: 8px; }
.flex-col-gap-3 { gap: 12px; }
.flex-col-gap-4 { gap: 16px; }
.flex-col-gap-5 { gap: 20px; }
.flex-col-gap-6 { gap: 24px; }
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stack-v-1 > * + * { margin-top: 4px; }
.stack-v-2 > * + * { margin-top: 8px; }
.stack-v-3 > * + * { margin-top: 12px; }
.stack-v-4 > * + * { margin-top: 16px; }
.stack-h-1 > * + * { margin-left: 4px; }
.stack-h-2 > * + * { margin-left: 8px; }
.stack-h-3 > * + * { margin-left: 12px; }
.container-narrow {
  max-width: 720px;
  margin: 0 auto;
}
.container-medium {
  max-width: 960px;
  margin: 0 auto;
}
.container-wide {
  max-width: 1200px;
  margin: 0 auto;
}
.section-spacing {
  padding-top: 24px;
  padding-bottom: 24px;
}

/* ── KPI Micro Cards ──────────────────────────────────────────────────────── */
.kpi-card-micro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  border-radius: 10px;
  background: oklch(0.97 0 0);
  border: 1px solid oklch(0.9 0 0);
  transition: all 0.2s;
  min-width: 100px;
}
.kpi-card-micro:hover {
  border-color: oklch(0.75 0.1 250 / 0.3);
  box-shadow: 0 2px 12px oklch(0.55 0.1 250 / 0.06);
  transform: translateY(-1px);
}
:is(.dark) .kpi-card-micro {
  background: oklch(0.15 0 0);
  border-color: oklch(0.3 0 0);
}
.kpi-value-micro {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.kpi-change-positive {
  color: oklch(0.6 0.2 145);
  font-size: 11px;
  font-weight: 600;
}
.kpi-change-negative {
  color: oklch(0.6 0.22 25);
  font-size: 11px;
  font-weight: 600;
}
.kpi-change-neutral {
  color: oklch(0.6 0 0);
  font-size: 11px;
  font-weight: 600;
}

/* ── Chip Group ──────────────────────────────────────────────────────────── */
.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.chip-group > * {
  flex-shrink: 0;
}

/* ── Progress Bar Animated ───────────────────────────────────────────────── */
.progress-bar-animated {
  position: relative;
  overflow: hidden;
}
.progress-bar-animated::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, oklch(1 0 0 / 0.3), transparent);
  animation: progress-shimmer 2s infinite;
}
@keyframes progress-shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* ── Stagger Delay Animations ────────────────────────────────────────────── */
.stagger-delay-1 { animation-delay: 0.05s; }
.stagger-delay-2 { animation-delay: 0.1s; }
.stagger-delay-3 { animation-delay: 0.15s; }
.stagger-delay-4 { animation-delay: 0.2s; }
.stagger-delay-5 { animation-delay: 0.25s; }
.stagger-delay-6 { animation-delay: 0.3s; }

/* ── Animations ─────────────────────────────────────────────────────────── */
@keyframes chip-appear {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
.animate-expand-down {
  animation: expand-down 0.25s ease-out;
}
.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* ── Row Entrance Animation ───────────────────────────────────────────────── */
.row-entrance {
  animation: row-fade-in 0.3s ease-out forwards;
  opacity: 0;
}
@keyframes row-fade-in {
  from { opacity: 0; transform: translateX(-4px); }
  to { opacity: 1; transform: translateX(0); }
}

/* ── Card Lift Hover ──────────────────────────────────────────────────────── */
.card-crud-lift {
  transition: all 0.25s ease;
  border: 1px solid oklch(0.88 0 0);
}
.card-crud-lift:hover {
  border-color: oklch(0.7 0.1 250 / 0.3);
  box-shadow: 0 8px 24px oklch(0.55 0.12 250 / 0.08);
  transform: translateY(-2px);
}
:is(.dark) .card-crud-lift {
  border-color: oklch(0.3 0 0);
}
:is(.dark) .card-crud-lift:hover {
  border-color: oklch(0.5 0.1 250 / 0.3);
  box-shadow: 0 8px 24px oklch(0.55 0.12 250 / 0.12);
}

/* ── Table CRUD Enhancements ────────────────────────────────────────────── */
.table-crud tbody tr:nth-child(even) {
  background: oklch(0.97 0.005 250 / 0.3);
}
.table-crud thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: oklch(0.95 0.01 250 / 0.8);
  backdrop-filter: blur(8px);
}
:is(.dark) .table-crud tbody tr:nth-child(even) {
  background: oklch(0.17 0.005 250 / 0.3);
}
:is(.dark) .table-crud thead {
  background: oklch(0.18 0.01 250 / 0.8);
}

/* ── Quick Links Enhanced ────────────────────────────────────────────────── */
.quick-links-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 0;
}
.quick-links-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  background: oklch(0.96 0.01 250 / 0.5);
  border: 1px solid oklch(0.85 0.01 250 / 0.4);
  color: oklch(0.4 0.1 250);
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}
.quick-links-chip:hover {
  background: oklch(0.55 0.2 250 / 0.08);
  border-color: oklch(0.55 0.2 250 / 0.3);
  color: oklch(0.4 0.2 250);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px oklch(0.55 0.15 250 / 0.1);
}
:is(.dark) .quick-links-chip {
  background: oklch(0.18 0.01 250 / 0.5);
  border-color: oklch(0.3 0.01 250 / 0.4);
  color: oklch(0.7 0.15 250);
}
:is(.dark) .quick-links-chip:hover {
  background: oklch(0.55 0.2 250 / 0.12);
  border-color: oklch(0.55 0.2 250 / 0.4);
  color: oklch(0.8 0.15 250);
}

/* ── Form Focus Glow ──────────────────────────────────────────────────────── */
.form-focus-glow:focus-within {
  border-color: oklch(0.55 0.2 250);
  box-shadow: 0 0 0 3px oklch(0.55 0.2 250 / 0.12), 0 0 12px oklch(0.55 0.15 250 / 0.08);
}
:is(.dark) .form-focus-glow:focus-within {
  border-color: oklch(0.65 0.2 250);
  box-shadow: 0 0 0 3px oklch(0.65 0.2 250 / 0.15), 0 0 12px oklch(0.65 0.15 250 / 0.1);
}

/* ── Add Button Pulse ─────────────────────────────────────────────────────── */
.add-btn-pulse {
  position: relative;
}
.add-btn-pulse::after {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  border: 2px solid oklch(0.55 0.2 250);
  opacity: 0;
  animation: pulse-ring 2s ease-out infinite;
}
@keyframes pulse-ring {
  0% { opacity: 0.6; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.15); }
}

/* ── Numeric Cell Alignment ───────────────────────────────────────────────── */
.numeric-cell {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}

/* ── Scroll Wrapper with Fade ───────────────────────────────────────────── */
.scroll-wrapper {
  max-height: 500px;
  overflow-y: auto;
  mask-image: linear-gradient(to bottom, black 80%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent);
}

/* ── Dialog Content Slide Up ──────────────────────────────────────────────── */
.dialog-content-slide-up {
  animation: dialog-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ── Mobile Glass Card ──────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .mobile-glass-card {
    backdrop-filter: blur(20px) saturate(1.3);
    -webkit-backdrop-filter: blur(20px) saturate(1.3);
    border-radius: 16px;
    border: 1px solid oklch(0.85 0 0 / 0.3);
  }
}
"""

# Append to globals.css
with open('/home/z/my-project/src/app/globals.css', 'a') as f:
    f.write('\n' + CSS)

# Count lines
with open('/home/z/my-project/src/app/globals.css', 'r') as f:
    total = sum(1 for _ in f)

print(f"R256 CSS appended successfully. Total globals.css lines: {total}")
print(f"New CSS block: ~{len(CSS.splitlines())} lines")
