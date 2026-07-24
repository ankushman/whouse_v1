# Task 5-a: India Warehouse Network Map

## Agent: Main
## Status: ✅ Completed

## Summary
Created a geographic SVG-based warehouse network map visualization and wired it into the Warehouses view via a toggle button.

## Files Created
1. **`src/components/modules/warehouse-map-view.tsx`** (~500 lines)
   - SVG-based India map with simplified polygon outline
   - 6 warehouse markers at approximate geographic positions (Gurugram, Sanand, Pune, Chennai, Hosur, Kolkata)
   - Pulsing colored dots (green/amber/red) by health status
   - City name labels positioned to avoid overlaps
   - Dotted connection lines showing logistics routes between warehouses
   - Hover info card (bottom-right of map) showing name, health, capacity, orders
   - Click markers to navigate to warehouse detail modal
   - Stats summary: Total Warehouses (6), Active (green count), Warning (amber), Critical (red)
   - Legend with green/amber/red status colors + route line indicator
   - StatusBadge showing overall network health
   - Responsive mini-card sidebar (lg: 1 col sidebar, md: 2 cols, sm: 1 col)
   - Mini cards show: name, city, manager, health score ring, capacity bar, orders, alerts
   - Dark mode support via CSS currentColor technique on SVG
   - All 6 warehouse data sourced from `@/data/mock-data`

## Files Modified
2. **`src/components/modules/warehouses-view.tsx`**
   - Added `showMap` state to WarehousesView
   - Added "Map View" toggle button (MapPin icon) in PageHeader actions
   - Button toggles between "Card View" and "Map View" label text
   - Button uses `variant="default"` when map is active, `variant="outline"` when cards shown
   - When `showMap=true`, renders WarehouseMapView component
   - Clicking a map marker switches back to card view AND opens warehouse detail modal
   - Description text changes based on active view

## Technical Details
- SVG viewBox `0 0 100 120` with coordinate mapping: x=(lon-67)/31*100, y=(38-lat)/31*120
- India outline: 37-point simplified polygon
- Network connections: 6 route lines forming hexagonal logistics network
- Responsive layout: `lg:grid-cols-[2fr_1fr]` (map 2/3 + sidebar 1/3), stacked below lg
- Uses existing shadcn/ui: Card, CardContent, Separator, StatusBadge
- Uses existing shared: PageHeader, HealthScoreRing
- No new packages installed

## Verification
- `bun run lint` → 0 errors, 0 warnings
- Dev server: GET / 200 in 5.9s (compiled successfully)
