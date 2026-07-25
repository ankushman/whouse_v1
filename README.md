# AutoFlow Logistics - Enterprise Warehouse Operations & Transportation Dashboard

> A comprehensive, production-grade warehouse management dashboard built for Indian automobile logistics operations across 6 warehouses. Powered by Next.js 16, shadcn/ui, Zustand, and Recharts.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Modules](#modules)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Configuration](#configuration)
- [Role-Based Access Control](#role-based-access-control)
- [Shared Components](#shared-components)
- [API Routes](#api-routes)
- [Data Model](#data-model)
- [Styling System](#styling-system)
- [Animation System](#animation-system)
- [Warehouse Network](#warehouse-network)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

**AutoFlow Logistics** is an enterprise-grade warehouse operations and transportation management dashboard designed for the Indian automobile logistics sector. It provides real-time visibility into warehouse performance, inbound/outbound logistics, inventory levels, transportation fleets, equipment status, workforce productivity, cost analytics, and alert management across a network of 6 warehouses spanning India's major industrial cities.

The dashboard is built as a single-page application (SPA) using client-side routing via Zustand state management — all 13 modules render within a single route (`/`) with a collapsible sidebar for navigation. It features role-based access control across 6 permission levels, a command palette (⌘K), real-time live operations feed, animated KPI counters, sortable/paginated data tables, CSV export, and a fully responsive mobile layout with a bottom navigation bar.

### Key Highlights

- **13 Functional Modules** covering every aspect of warehouse operations
- **6 Role-Based Permission Levels** from Super Admin to Operator
- **6 Indian Warehouses** with health scores, capacity tracking, and detail modals
- **11 Executive KPIs** with animated counters, trend indicators, and sparkline data
- **8 Interactive Charts** on the executive dashboard (Recharts)
- **Command Palette** — Press `⌘K` / `Ctrl+K` for instant navigation
- **Live Operations Feed** — Simulated real-time warehouse events with pause/resume
- **Light/Dark Mode** — Full theme support via `next-themes`
- **Responsive Design** — Desktop sidebar + mobile bottom nav + tablet adaptive
- **Toast Notifications** — User action feedback via Sonner
- **CSV Export** — Download table data as CSV from Reports and Executive Summary
- **Loading Skeletons** — Smooth initial load experience with skeleton placeholders
- **Animation System** — 8+ keyframe animations, staggered grid entry, shimmer effects

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js 16 App Router                     │
│                        (Single Route: /)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐   ┌───────────────┐   ┌───────────────────┐  │
│  │   Sidebar     │   │   Top Nav     │   │  Command Palette   │  │
│  │  (shadcn/ui)  │   │  (Header)     │   │  (⌘K overlay)     │  │
│  └──────┬───────┘   └───────┬───────┘   └─────────┬─────────┘  │
│         │                   │                      │            │
│  ┌──────┴───────────────────┴──────────────────────┴─────────┐  │
│  │                    Zustand Store                          │  │
│  │  (activeView, currentRole, selectedWarehouse, sidebar)     │  │
│  └──────┬────────────────────────────────────────────────────┘  │
│         │                                                         │
│  ┌──────┴──────────────────────────────────────────────────────┐│
│  │                    View Renderer                            ││
│  │   Maps activeView → Component (13 modules)                   ││
│  └──────┬──────────────────────────────────────────────────────┘│
│         │                                                         │
│  ┌──────┴──────────────────────────────────────────────────────┐│
│  │              13 Module Views                                ││
│  │  Dashboard | Warehouses | Inbound | Outbound | Inventory    ││
│  │  Transportation | Equipment | Employees | Productivity       ││
│  │  Cost Analytics | Alerts | Reports | Settings               ││
│  └──────────────────────────────────────────────────────────────┘│
│         │                                                         │
│  ┌──────┴──────────────────────────────────────────────────────┐│
│  │              Shared Components (13)                        ││
│  │  KPICard | DataTable | StatusBadge | AnimatedCounter       ││
│  │  LiveUpdatesFeed | HealthScoreRing | ExportButton           ││
│  │  DashboardSkeleton | PageSkeleton | TableSkeleton           ││
│  │  PageHeader | EmptyState                                    ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │              API Routes (Next.js Route Handlers)            ││
│  │  GET/POST /api/warehouses    | GET/PUT /api/warehouses/[id]  ││
│  │  GET /api/inventory          | GET/POST /api/shipments       ││
│  │  GET/PUT /api/shipments/[id]                                ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │              Data Layer                                     ││
│  │  Mock Data (src/data/mock-data.ts) — 2739 lines              ││
│  │  Supabase (optional, configured for warehouses)             ││
│  │  Prisma + SQLite (configured, available for use)             ││
│  └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Routing Strategy

Unlike traditional Next.js apps with file-based routing, AutoFlow uses **Zustand client-side routing**. All views are rendered within a single `/` route. The `activeView` state in the Zustand store determines which module component is displayed via a `viewMap` lookup. This approach enables:

- Instant navigation between modules (no page reloads)
- Persistent layout state (sidebar collapse, warehouse selection)
- Smooth transitions between views
- Single route with no URL changes

---

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 16.x | React framework with App Router |
| **Language** | TypeScript | 5.x | Type-safe development |
| **Runtime** | Bun | — | Fast JavaScript runtime and package manager |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **UI Components** | shadcn/ui | — | 60+ Radix-based accessible components |
| **State Management** | Zustand | 5.x | Lightweight client-side state |
| **Charts** | Recharts | 2.x | Interactive data visualization |
| **Icons** | Lucide React | — | 500+ SVG icons |
| **Theme** | next-themes | — | Light/dark mode support |
| **Toasts** | Sonner | 2.x | Toast notification system |
| **Forms** | React Hook Form + Zod | — | Form validation |
| **Database ORM** | Prisma | 6.x | Type-safe database access |
| **Database** | SQLite | — | Local development database |
| **Animations** | Framer Motion | 12.x | UI animation library |
| **Backend SDK** | z-ai-web-dev-sdk | — | AI capabilities (optional) |

---

## Features

### Executive Dashboard
- **11 KPI Cards** with animated counters (Indian number formatting), trend indicators, and icon badges
- **8 Interactive Charts**: Inbound Volume (Area), Outbound Dispatch (Bar), Warehouse Performance (Bar), Daily Dispatch (Bar), Cost Trend (Area), Throughput (Area), SLA Breakdown (Pie), Inventory Accuracy (Line)
- **Live Operations Feed** — Auto-generating simulated warehouse events with severity badges and animated entry
- **Quick Action Bar** — One-click navigation to New Inbound, Pending Dispatch, Critical Alerts, Reports Due
- **Date Range Picker** — Today / 7D / 30D / 90D / 12M toggle buttons

### Navigation & UX
- **Collapsible Sidebar** (shadcn/ui) — Icon-only mode with tooltips, grouped into Operations / Analytics / System sections
- **Top Navigation** — Breadcrumb, search trigger, role switcher, notification bell, theme toggle, profile menu
- **Command Palette** (`⌘K` / `Ctrl+K`) — Search pages, ESC to close, active page indicator, keyboard hints
- **Notification Center** — Dropdown with 5 recent alerts, severity-colored icons, timestamps
- **Live Clock** — Real-time IST clock in top nav
- **Mobile Bottom Navigation** — Fixed bottom bar (md:hidden) with 5 core items, active dot indicator, safe area padding
- **Sticky Footer** — Copyright, version info, hidden on mobile

### Data Management
- **Reusable DataTable** — Generic typed component with 3-state sorting (asc/desc/null), pagination, sticky headers, empty state, result count, row click, custom cell renderers
- **CSV Export** — Download table data as CSV files
- **Search & Filter** — Inbound search by invoice/supplier name, result count display
- **Warehouse Detail Modal** — Dialog with 4 stat cards, capacity bar, 7-day throughput chart, equipment list, recent shipments

### Visual Design
- **Light/Dark Mode** — Full theme support with oklch color system
- **Card Depth** — Consistent shadow system for cards
- **Chart Card Accents** — Colored top-border per theme (blue/green/amber/purple/red)
- **Health Score Rings** — Animated SVG progress arcs with glow effects
- **Status Badges** — Color-coded with glow effects for critical/warning alerts
- **Loading Skeletons** — DashboardSkeleton, PageSkeleton, TableSkeleton with shimmer effect

### Animation System
- **8 Keyframe Animations**: fade-in-up, fade-in, scale-in, slide-in-right, shimmer, pulse-subtle, counter-up, pulse-dot
- **Stagger Children** — 12-level stagger delay for grid child animations
- **Skeleton Shimmer** — Light/dark mode aware loading shimmer
- **Card Glass** — Backdrop-filter frosted glass effect
- **Table Row Hover** — Highlighted hover state for data rows
- **Button Press** — Scale-down feedback on button click
- **Live Indicator** — Pulsing dot for real-time elements

---

## Modules

### 1. Dashboard (Executive Overview)
The primary landing view displaying all key metrics and charts at a glance.

| Section | Description |
|---------|-------------|
| KPI Cards | 11 metrics: Total Warehouses, Active Shipments, Pending GRN, Inventory Accuracy, Today's Dispatches, Dock-to-Stock Time, SLA Achievement, Equipment Utilization, Cost per Shipment, Warehouse Occupancy, Productivity |
| Charts | 8 interactive charts covering inbound, outbound, warehouse performance, dispatch, costs, throughput, SLA, and inventory |
| Quick Actions | New Inbound, Pending Dispatch, Critical Alerts, Reports Due |
| Live Feed | Real-time simulated operations events |
| Date Range | Today / 7D / 30D / 90D / 12M toggle |

### 2. Warehouses
Overview of all 6 warehouses with health scores, capacity bars, and performance metrics. Click any warehouse card to open a **detail modal** showing:
- 4 stat cards (Inventory, Throughput, SLA, Equipment)
- Capacity utilization bar
- 7-day throughput chart
- Equipment summary
- Recent shipments list

### 3. Inbound
Manage incoming shipments and Goods Receipt Notes (GRN).
- Search by invoice number or supplier name
- GRN status tracking
- Supplier performance metrics
- Inbound trend charts

### 4. Outbound
Track outbound dispatches and deliveries.
- Shipment status tracking (Dispatched / In Transit / Delivered / Returned)
- Color-coded status badges with proper text color mapping
- Delivery performance metrics
- Outbound trend charts

### 5. Inventory
Real-time inventory management across all warehouses.
- Stock levels and SKU tracking
- Inventory accuracy percentages
- Variance alerts
- ABC classification metrics

### 6. Transportation
Fleet and route management for inter-warehouse logistics.
- **DataTable** with sortable columns and pagination
- Vehicle status tracking
- Route optimization metrics
- Fuel consumption and cost tracking

### 7. Equipment
Track forklifts, conveyors, and other warehouse equipment.
- Equipment health status
- Utilization rates
- Maintenance schedules
- Battery status alerts

### 8. Employees
Workforce management across all warehouses.
- Employee directory and roles
- Shift tracking
- Performance metrics
- Attendance records

### 9. Productivity
Operational efficiency analytics.
- Throughput metrics (units/hour)
- Pick accuracy rates
- Order cycle times
- Labor productivity trends

### 10. Cost Analytics
Financial performance and cost breakdowns.
- Cost trends by category (labor, transport, equipment, storage)
- Cost per shipment analysis
- Budget vs actual comparison
- Cost optimization recommendations

### 11. Alert Center
Real-time alerts and notifications management.
- **Toast notifications** on acknowledge actions
- Severity-based filtering (Critical / Warning / Info)
- Badge glow effects for critical/warning alerts
- Alert acknowledgment workflow

### 12. Reports
Generate and download operational reports.
- **Toast notifications** on report generation with loading state
- **CSV Export** for Executive Summary and Warehouse Performance
- Pre-built report templates
- Scheduled report capability

### 13. Settings
Application configuration and master data management.
- **CRUD Tables** for Warehouses, Customers, Transporters
- KPI target configuration
- **Toast notifications** on save actions
- User preference management

---

## Project Structure

```
my-project/
├── public/                          # Static assets
│   ├── logo.svg
│   └── robots.txt
├── prisma/
│   └── schema.prisma                # Prisma database schema (SQLite)
├── src/
│   ├── app/
│   │   ├── globals.css              # Global styles + animation system
│   │   ├── layout.tsx               # Root layout (fonts, ThemeProvider, Toaster)
│   │   ├── page.tsx                 # Single route entry (SidebarProvider + ViewRenderer)
│   │   └── api/
│   │       ├── route.ts             # Health check endpoint
│   │       ├── warehouses/
│   │       │   ├── route.ts         # GET (list) / POST (create) warehouses
│   │       │   └── [id]/route.ts    # GET / PUT single warehouse
│   │       ├── inventory/
│   │       │   └── route.ts         # Inventory data endpoint
│   │       └── shipments/
│   │           ├── route.ts         # GET (list) / POST (create) shipments
│   │           └── [id]/route.ts    # GET / PUT single shipment
│   ├── components/
│   │   ├── ui/                      # 60+ shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── chart.tsx
│   │   │   └── ... (57 more)
│   │   ├── layout/
│   │   │   ├── app-layout.tsx       # AppSidebar + TopNav + CommandPalette + AppLayout
│   │   │   └── mobile-bottom-nav.tsx # Fixed bottom nav (mobile)
│   │   ├── dashboard/
│   │   │   └── dashboard-view.tsx   # Executive dashboard (KPIs + charts + feed)
│   │   ├── modules/
│   │   │   ├── warehouses-view.tsx          # Warehouse overview cards
│   │   │   ├── warehouse-detail-modal.tsx   # Warehouse detail dialog
│   │   │   ├── inbound-view.tsx             # Inbound GRN management
│   │   │   ├── outbound-view.tsx             # Outbound dispatch tracking
│   │   │   ├── inventory-view.tsx            # Inventory management
│   │   │   ├── transportation-view.tsx       # Fleet/route management
│   │   │   ├── equipment-view.tsx            # Equipment tracking
│   │   │   ├── employees-view.tsx           # Employee management
│   │   │   ├── productivity-view.tsx         # Productivity analytics
│   │   │   ├── cost-analytics-view.tsx       # Cost breakdown
│   │   │   ├── alerts-view.tsx              # Alert center
│   │   │   ├── reports-view.tsx             # Report generation
│   │   │   └── settings-view.tsx            # Settings & config
│   │   └── shared/
│   │       ├── kpi-card.tsx           # Animated KPI metric card
│   │       ├── data-table.tsx         # Generic sortable/paginated table
│   │       ├── status-badge.tsx       # Color-coded status indicator
│   │       ├── animated-counter.tsx   # Number animation with Indian formatting
│   │       ├── live-updates-feed.tsx # Real-time operations feed
│   │       ├── health-score-ring.tsx # SVG progress arc component
│   │       ├── export-button.tsx      # CSV/PDF export dropdown
│   │       ├── page-header.tsx       # Module page header with breadcrumb
│   │       ├── empty-state.tsx        # Empty data placeholder
│   │       ├── dashboard-skeleton.tsx # Loading skeleton for dashboard
│   │       ├── page-skeleton.tsx     # Loading skeleton for pages
│   │       └── table-skeleton.tsx    # Loading skeleton for tables
│   ├── data/
│   │   └── mock-data.ts             # Comprehensive mock data (~2739 lines)
│   ├── hooks/
│   │   ├── use-toast.ts              # Toast notification hook
│   │   └── use-mobile.ts             # Mobile breakpoint detection hook
│   ├── lib/
│   │   ├── utils.ts                  # Utility functions (cn, etc.)
│   │   ├── db.ts                     # Prisma client instance
│   │   ├── supabase.ts               # Supabase admin client
│   │   └── supabase-types.ts         # Supabase type definitions
│   └── store/
│       └── app-store.ts             # Zustand store (navigation, role, warehouse)
├── supabase/
│   └── schema.sql                   # Supabase database schema
├── .env                             # Environment variables
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── components.json                  # shadcn/ui configuration
├── Caddyfile                        # Reverse proxy / gateway config
└── worklog.md                       # Development progress log
```

---

## Getting Started

### Prerequisites

- **Bun** (recommended) or Node.js 18+
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ankushman/whouse_v1.git
cd whouse_v1

# 2. Install dependencies
bun install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration (see Configuration section)

# 4. Set up the database (if using Prisma)
bun run db:push

# 5. Start the development server
bun run dev
```

The application will be available at **http://localhost:3000**.

### Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server on port 3000 (logs to dev.log) |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint to check code quality |
| `bun run db:push` | Push Prisma schema to database |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:migrate` | Run Prisma migrations |
| `bun run db:reset` | Reset database |

---

## Development

### Adding a New Module

To add a new module to the dashboard:

1. **Create the module view** at `src/components/modules/your-module-view.tsx`
2. **Add navigation item** to `navItems` array in `src/store/app-store.ts`:
   ```typescript
   { id: 'your-module', label: 'Your Module', icon: 'YourIcon', roles: ['super_admin', 'executive'] }
   ```
3. **Add the icon** to `iconMap` in `src/components/layout/app-layout.tsx`
4. **Register the view** in `viewMap` in `src/app/page.tsx`:
   ```typescript
   your-module: YourModuleView,
   ```
5. The sidebar will automatically pick it up and route to it via Zustand's `activeView`

### Using the DataTable Component

```typescript
import { DataTable, Column } from '@/components/shared/data-table'

interface YourData {
  id: string
  name: string
  status: string
}

const columns: Column<YourData>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'status', header: 'Status', sortable: true,
    render: (value) => <StatusBadge status={value} />
  },
]

<DataTable
  data={yourData}
  columns={columns}
  pageSize={10}
  onRowClick={(row) => console.log(row)}
  showCount
/>
```

### Using the KPICard Component

```typescript
import { KPICard } from '@/components/shared/kpi-card'

<KPICard
  title="Total Shipments"
  value="1,247"
  change={+12.5}
  trend="up"
  icon={Truck}
  iconBg="bg-blue-100 dark:bg-blue-900/30"
  iconColor="text-blue-600 dark:text-blue-400"
/>
```

### Using Toast Notifications

```typescript
import { toast } from 'sonner'

// Success toast
toast.success('Settings saved successfully')

// Error toast
toast.error('Failed to save settings')

// Loading + success
const promise = toast.promise(
  fetch('/api/data'),
  { loading: 'Generating report...', success: 'Report generated', error: 'Failed' }
)
```

### Using CSV Export

```typescript
import { ExportButton } from '@/components/shared/export-button'

<ExportButton
  data={tableData}
  filename="report"
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status' },
  ]}
/>
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database (Prisma + SQLite)
DATABASE_URL="file:./db/custom.db"

# Supabase (optional, for persistent data)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth (optional, for authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### Theme Configuration

The app uses `next-themes` for light/dark mode. Default theme is system-preferred.

### shadcn/ui Configuration

The project uses shadcn/ui with **New York** style. Components are in `src/components/ui/`. To add new components:

```bash
bunx shadcn@latest add [component-name]
```

---

## Role-Based Access Control

The dashboard supports 6 role levels. Navigation items are filtered based on the user's assigned role:

| Role | Access Level | Available Modules |
|------|-------------|-------------------|
| **Super Admin** | Full access | All 13 modules |
| **Executive** | Full access | All 13 modules |
| **Regional Manager** | Regional oversight | Dashboard, Warehouses, Inbound, Outbound, Inventory, Transportation, Equipment, Employees, Productivity, Cost Analytics, Alerts, Reports |
| **Warehouse Manager** | Warehouse operations | Dashboard, Warehouses, Inbound, Outbound, Inventory, Transportation, Equipment, Employees, Productivity, Alerts, Reports |
| **Supervisor** | Floor operations | Dashboard, Inbound, Outbound, Inventory, Equipment, Productivity, Alerts |
| **Operator** | Basic operations | Dashboard, Inbound, Outbound, Inventory, Alerts |

**To switch roles**: Click the role badge in the top navigation bar (e.g., "Executive") and select a different role from the dropdown. The sidebar will immediately update to show only modules accessible to the selected role.

---

## Shared Components

| Component | Location | Description |
|-----------|----------|-------------|
| **KPICard** | `shared/kpi-card.tsx` | Animated metric card with trend indicator, sparkline support, and Indian number formatting |
| **DataTable** | `shared/data-table.tsx` | Generic typed table with sorting (3-state), pagination, sticky headers, empty state, row click |
| **StatusBadge** | `shared/status-badge.tsx` | Color-coded status indicator (green/amber/red/blue) |
| **AnimatedCounter** | `shared/animated-counter.tsx` | Number animation with easeOutCubic easing and Indian locale formatting |
| **LiveUpdatesFeed** | `shared/live-updates-feed.tsx` | Auto-generating simulated events with pause/resume, severity badges |
| **HealthScoreRing** | `shared/health-score-ring.tsx` | Animated SVG progress arc with glow effect |
| **ExportButton** | `shared/export-button.tsx` | CSV/PDF export dropdown with column selection |
| **PageHeader** | `shared/page-header.tsx` | Module header with title, description, and action buttons |
| **EmptyState** | `shared/empty-state.tsx` | Empty data placeholder with icon and message |
| **DashboardSkeleton** | `shared/dashboard-skeleton.tsx` | Full-page loading skeleton for the dashboard |
| **PageSkeleton** | `shared/page-skeleton.tsx` | Generic page loading skeleton |
| **TableSkeleton** | `shared/table-skeleton.tsx` | Table loading skeleton with shimmer rows |
| **MobileBottomNav** | `layout/mobile-bottom-nav.tsx` | Fixed bottom navigation for mobile (5 core items, role-filtered) |

---

## API Routes

### Warehouses

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/warehouses` | List all warehouses. Query params: `city`, `status`, `search` |
| `POST` | `/api/warehouses` | Create a new warehouse |
| `GET` | `/api/warehouses/[id]` | Get single warehouse by ID |
| `PUT` | `/api/warehouses/[id]` | Update warehouse by ID |

### Shipments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/shipments` | List all shipments |
| `POST` | `/api/shipments` | Create a new shipment |
| `GET` | `/api/shipments/[id]` | Get single shipment by ID |
| `PUT` | `/api/shipments/[id]` | Update shipment by ID |

### Inventory

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/inventory` | List inventory items |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api` | Health check — returns `{ message: "Hello, world!" }` |

---

## Data Model

The application currently uses **mock data** (`src/data/mock-data.ts`, ~2739 lines) for all views. This data covers:

- **6 Warehouses**: Mumbai, Delhi NCR (Gurugram), Chennai, Bengaluru, Pune, Kolkata
- **11 KPI Metrics**: With trend data and change percentages
- **18 Data Exports**: Including inbound trends, outbound trends, warehouse performance, dispatch data, cost breakdowns, SLA data, throughput data, inventory accuracy, manpower productivity, shipment lists, equipment lists, employee lists, alert lists, report templates

### TypeScript Interfaces

Key data interfaces defined in `src/data/mock-data.ts`:

```typescript
interface Warehouse { id, name, city, state, managerName, capacity, capacityUsed, inventoryAccuracy, forkliftCount, todayOrders, pendingTasks, healthScore, status, alerts }

interface KPIData { totalWarehouses, activeShipments, pendingGRN, inventoryAccuracy, todaysDispatches, dockToStockTime, slaAchievement, equipmentUtilization, costPerShipment, warehouseOccupancy, productivity }

interface Shipment { id, invoice, supplier, items, status, priority, expectedDate, warehouse }

interface Employee { id, name, role, warehouse, shift, performance, attendance }

interface Alert { id, type, severity, message, warehouse, timestamp, acknowledged }
```

---

## Styling System

### CSS Architecture

The project uses **Tailwind CSS 4** with a comprehensive custom utility system in `globals.css`:

#### Card Accents
```
card-accent-blue    → border-t-blue-500 (2px top border)
card-accent-green   → border-t-emerald-500
card-accent-amber   → border-t-amber-500
card-accent-purple  → border-t-purple-500
card-accent-red     → border-t-red-500
```

#### Interactive Effects
```
card-depth          → Enhanced card shadow with transition
card-glass          → Backdrop-filter frosted glass (bg-background/60 blur)
table-row-hover     → Highlighted row on hover
btn-press           → Scale-down on active/click
kpi-shimmer         → Gradient shimmer on KPI card hover
badge-glow-critical → Red glow ring for critical badges
badge-glow-warning  → Amber glow ring for warning badges
```

#### Animation Utilities
```
stagger-children    → Up to 12 levels of stagger delay (stagger-1 to stagger-12)
data-row-enter      → Slide-up + fade-in for table rows
scroll-reveal       → Opacity + translate animation on scroll
live-indicator      → Pulsing green dot for real-time elements
pulse-dot           → Keyframe pulse animation
skeleton-shimmer    → Loading shimmer (light/dark aware)
sidebar-active-bar  → Active state bar for sidebar items
```

#### Typography & Color
```
text-gradient       → Gradient text effect
texture-bg          → Subtle background texture
```

### Color System

The app uses **oklch colors** via Tailwind CSS 4's built-in color system with `next-themes` for automatic light/dark switching. The primary accent color is **blue-600** / **blue-700**.

### Dark Mode

Toggle dark mode via:
- **Top nav** theme toggle button (sun/moon icon)
- **System preference** (auto-detected)

All components, charts, and utilities have full dark mode support.

---

## Animation System

### Keyframe Animations (defined in globals.css)

| Animation | Usage | Description |
|-----------|-------|-------------|
| `fade-in-up` | Cards, sections | Fade in + slide up from below |
| `fade-in` | General elements | Simple opacity fade |
| `scale-in` | Modals, popovers | Scale from 0.95 + fade |
| `slide-in-right` | Sidebar items | Slide from left + fade |
| `shimmer` | Skeletons | Horizontal gradient sweep |
| `pulse-subtle` | Live indicators | Subtle opacity pulse |
| `counter-up` | KPI numbers | Number count-up animation |
| `pulse-dot` | Status dots | Scale pulse for dots |

### Stagger System

Apply staggered animation to grid children:
```html
<div className="stagger-children">
  <div>Card 1</div>  <!-- animates first -->
  <div>Card 2</div>  <!-- animates 50ms later -->
  <div>Card 3</div>  <!-- animates 100ms later -->
</div>
```

For individual control: `stagger-1` through `stagger-12` (50ms increments).

---

## Warehouse Network

The dashboard manages a network of 6 warehouses across India's major industrial corridors:

| # | Warehouse | City | State | Specialization |
|---|-----------|------|-------|----------------|
| 1 | Mumbai Central Hub | Mumbai | Maharashtra | West India primary distribution |
| 2 | Delhi NCR Hub | Gurugram | Haryana | North India primary distribution |
| 3 | Chennai Depot | Chennai | Tamil Nadu | South India distribution |
| 4 | Bengaluru Center | Bengaluru | Karnataka | Electronics & precision parts |
| 5 | Pune Facility | Pune | Maharashtra | Automotive components |
| 6 | Kolkata Warehouse | Kolkata | West Bengal | East India distribution |

Each warehouse has:
- **Health Score** (0-100) — Overall operational health with animated SVG ring
- **Capacity Utilization** (%) — Current vs maximum storage capacity
- **Inventory Accuracy** (%) — Stock count correctness
- **Equipment Fleet** — Forklifts and active count
- **Daily Orders** — Current day order volume
- **Pending Tasks** — Outstanding operations
- **Status** — Green (healthy) / Amber (warning) / Red (critical)

---

## Deployment

### Production Build

```bash
# Build for production
bun run build

# Start production server
bun run start
```

### Docker (Recommended)

```dockerfile
FROM oven/bun:latest AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN bun run build

# Expose port
EXPOSE 3000

# Start
CMD ["bun", "run", "start"]
```

### Environment Checklist

Before deploying, ensure:
- [ ] `.env` configured with production database URL
- [ ] Supabase credentials set (if using persistent data)
- [ ] `DATABASE_URL` points to production SQLite or PostgreSQL
- [ ] Theme and role defaults configured in `app-store.ts`

---

## Roadmap

### Completed
- [x] 13 module views with full functionality
- [x] 6 role-based permission levels
- [x] Reusable DataTable component
- [x] Animated KPI counters with Indian formatting
- [x] Live operations feed
- [x] Toast notifications (Alerts, Reports, Export, Settings)
- [x] CSV export functionality
- [x] Warehouse detail modal with charts
- [x] Loading skeletons
- [x] Health score rings
- [x] Command palette (⌘K)
- [x] Mobile bottom navigation
- [x] Light/dark theme support
- [x] Comprehensive CSS animation system
- [x] GitHub repository and version control

### In Progress
- [ ] DataTable integration in Inbound and Outbound modules
- [ ] API route integration with Supabase for persistent data

### Planned
- [ ] WebSocket real-time data updates
- [ ] Geographic map visualization (India warehouse network)
- [ ] Employee shift scheduling module
- [ ] Barcode/QR code scanning for inventory
- [ ] Export button wired to all table views
- [ ] Print-friendly CSS for reports
- [ ] NextAuth.js authentication integration
- [ ] Multi-language support (i18n)
- [ ] Performance monitoring and analytics dashboard
- [ ] Automated report scheduling
- [ ] Mobile app (React Native) companion

---

## License

This project is proprietary software developed for AutoFlow Logistics. All rights reserved.

---

**Built with Next.js 16 | TypeScript | Tailwind CSS 4 | shadcn/ui | Zustand | Recharts**

*AutoFlow Logistics - Enterprise Warehouse Management v1.0.0*
