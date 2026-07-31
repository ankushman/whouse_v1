"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  Warehouse,
  PackageSearch,
  Truck,
  Package,
  Boxes,
  RotateCcw,
  Route,
  Cog,
  Users,
  TrendingUp,
  DollarSign,
  Bell,
  FileBarChart,
  Settings,
  LayoutGrid,
  Search,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Building2,
  Bot,
  GitFork,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  MapPin,
  Navigation,
  Timer,
  Zap,
  Activity,
  Award,
  Brain,
  Sparkles,
  ScanLine,
  Waypoints,
  Palette,
  BrainCircuit,
  Leaf,
  Target,
  Sprout,
  Rocket,
  ShieldCheck,
  ArrowRightLeft,
  ParkingCircle,
  Factory,
  Trophy,
  ClipboardCheck,
  ClipboardList,
  ShoppingCart,
  Layers,
  Microscope,
  FileWarning,
  Mail,
  CalendarRange,
  Calculator,
  Landmark,
  FileSearch,
  Globe,
  Building,
  Gauge,
  Medal,
  GitCompareArrows,
  FileText,
  ShieldAlert,
  Wrench,
  PackageX,
  ArrowLeftRight,
  ThermometerSnowflake,
  Container,
  Flame,
  ScanBarcode,
  HardHat,
  Box,
  LayoutList,
  Waves,
  QrCode,
  Undo2,
  PackagePlus,
  Send,
  FileCheck,
  RefreshCw,
  Puzzle,
  Handshake,
  ScrollText,
  Bus,
  Headset,
  BarChart3,
  TrendingDown,
  PackageCheck,
  Anchor,
  DoorOpen,
  Banknote,
  ShieldQuestion,
  ShieldPlus,
  MapPinCheck,
  LockKeyhole,
  Thermometer,
  ChartSpline,
  ChartNetwork,
  Recycle,
  Weight,
  Network,
  Scale,
  Ship,
  TrainFront,
  Radar,
  TestTubes,
  Gavel,
  FileCheck2,
  Receipt,
  Hourglass,
  Satellite,
  Bike,
  Archive,
  MonitorSmartphone,
  Crosshair,
  HeartPulse,
  Grid3x3,
  Workflow,
  Link,
  Wifi,
  Rss,
  KeyRound,
  Refrigerator,
  Grid2x2Plus,
  FlaskConical,
  Store,
  Fuel,
  Gem,
  Car,
  Stethoscope,
  Atom,
  Drill,
  Pickaxe,
  Sword,
  Wheat,
  MilkOff,
  Crown,
  TowerControl,
  Syringe,
  PlaneTakeoff,
  Scissors,
  MonitorX,
  Battery,
  Snowflake,
  Siren,
  Droplets,
  CircuitBoard,
  Hammer,
  Server,
  Construction,
  RadioTower,
  Paintbrush,
  Nut,
  Guitar,
  LeafyGreen,
  Carrot,
  TreePine,
  Lamp,
  FlameKindling,
  CookingPot,
  Shirt,
  BedDouble,
  Beaker,
  Axe,
} from "lucide-react"
import { useAppStore, navItems, type Role, type NavItem } from "@/store/app-store"
import { warehouses } from "@/data/mock-data"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import { type ReactNode } from "react"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { NotificationsSheet } from "@/components/shared/notifications-sheet"
import { QuickSettingsPopover } from "@/components/shared/quick-settings-popover"
import { KeyboardShortcutsDialog } from "@/components/shared/keyboard-shortcuts-dialog"


// ──────────────────────────────────────────────────────
// Icon Map
// ──────────────────────────────────────────────────────
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Hourglass,
  Activity,
  Award,
  Warehouse,
  PackageSearch,
  Truck,
  Package,
  Boxes,
  RotateCcw,
  Route,
  Cog,
  Users,
  TrendingUp,
  DollarSign,
  Bell,
  FileBarChart,
  Settings,
  LayoutGrid,
  MapPin,
  Navigation,
  Timer,
  Brain,
  Sparkles,
  ScanLine,
  Waypoints,
  Palette,
  Leaf,
  BrainCircuit,
  Sprout,
  Rocket,
  ShieldCheck,
  ArrowRightLeft,
  ParkingCircle,
  Factory,
  Trophy,
  ClipboardCheck,
  ShoppingCart,
  Layers,
  Microscope,
  FileWarning,
  ClipboardList,
  Mail,
  CalendarRange,
  Calculator,
  Landmark,
  FileSearch,
  Globe,
  Building,
  Gauge,
  Medal,
  GitCompareArrows,
  FileText,
  ShieldAlert,
  Wrench,
  PackageX,
  ArrowLeftRight,
  ThermometerSnowflake,
  Container,
  Flame,
  ScanBarcode,
  HardHat,
  Box,
  LayoutList,
  Waves,
  QrCode,
  Undo2,
  PackagePlus,
  Send,
  FileCheck,
  RefreshCw,
  Puzzle,
  Handshake,
  ScrollText,
  Bus,
  Headset,
  BarChart3,
  TrendingDown,
  PackageCheck,
  Anchor,
  DoorOpen,
  Banknote,
  ShieldQuestion,
  ShieldPlus,
  MapPinCheck,
  LockKeyhole,
  Thermometer,
  ChartSpline,
  ChartNetwork,
  Recycle,
  Weight,
  Network,
  Scale,
  Building2,
  Bot,
  GitFork,
  Zap,
  Ship,
  TrainFront,
  Radar,
  TestTubes,
  Gavel,
  FileCheck2,
  Receipt,
  Satellite,
  Bike,
  Archive,
  MonitorSmartphone,
  Crosshair,
  HeartPulse,
  Grid3x3,
  Target,
  Workflow,
  Link,
  Wifi,
  Rss,
  KeyRound,
  Refrigerator,
  Grid2x2Plus,
  FlaskConical,
  Store,
  Fuel,
  Gem,
  Car,
  Stethoscope,
  Atom,
  Drill,
  Pickaxe,
  Sword,
  Wheat,
  MilkOff,
  Crown,
  TowerControl,
  Syringe,
  PlaneTakeoff,
  Scissors,
  MonitorX,
  Sun,
  Battery,
  Snowflake,
  Siren,
  Droplets,
  CircuitBoard,
  Hammer,
  Server,
  Construction,
  RadioTower,
  Paintbrush,
  Nut,
  Guitar,
  LeafyGreen,
  Carrot,
  TreePine,
  Lamp,
  FlameKindling,
  CookingPot,
  Shirt,
  BedDouble,
  Beaker,
  Axe,
} as const
const recentNotifications = [
  { id: "1", title: "SLA Breach", desc: "Gurugram Hub dock-to-stock exceeded 4hrs", severity: "critical", time: "5m ago" },
  { id: "2", title: "Equipment Alert", desc: "Forklift FL-003 battery below 15%", severity: "warning", time: "12m ago" },
  { id: "3", title: "Inventory Variance", desc: "SKU ENG-4521 count mismatch at Chennai", severity: "warning", time: "28m ago" },
  { id: "4", title: "Dispatch Complete", desc: "Shipment SH-2024-0891 delivered on time", severity: "success", time: "45m ago" },
  { id: "5", title: "Capacity Warning", desc: "Pune warehouse at 85% capacity", severity: "info", time: "1h ago" },
]

const severityIcon = { critical: AlertTriangle, warning: AlertTriangle, success: CheckCircle2, info: Info }
const severityColor = {
  critical: "text-red-600 dark:text-red-400",
  warning: "text-amber-600 dark:text-amber-400",
  success: "text-emerald-600 dark:text-emerald-400",
  info: "text-blue-600 dark:text-blue-400",
}

// ──────────────────────────────────────────────────────
// App Logo
// ──────────────────────────────────────────────────────
function AppLogo() {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-2 py-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white shadow-sm">
        <Building2 className="h-4 w-4" />
      </div>
      <div className="flex flex-col group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold tracking-tight text-white leading-tight">AutoFlow</span>
          <span className="rounded bg-white/20 px-1 py-px text-[9px] font-semibold leading-none text-white">v1.0</span>
        </div>
        <span className="text-[10px] font-medium text-blue-100 leading-tight">Warehouse Management</span>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────
// Sidebar helper: render a single nav menu item
// ──────────────────────────────────────────────────────
function SidebarNavItem({ item, activeView, setActiveView }: { item: NavItem; activeView: string; setActiveView: (v: string) => void }) {
  const Icon = iconMap[item.icon]
  const isActive = activeView === item.id
  return (
    <SidebarMenuItem key={item.id}>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={item.label}
        onClick={() => setActiveView(item.id)}
        className={cn(
          "transition-all duration-150 nav-icon-animated hover:bg-primary/5 hover:translate-x-0.5 active:scale-[0.98]",
          isActive && "relative sidebar-active-bar bg-blue-600 text-white shadow-sm shadow-blue-500/25 hover:bg-blue-700 hover:text-white"
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
        <span>{item.label}</span>
      </SidebarMenuButton>
      {item.badge && item.badge > 0 && (
        <SidebarMenuBadge className={isActive ? "bg-white/20 text-white" : "bg-blue-600 text-white"}>
          {item.badge}
        </SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  )
}

// ──────────────────────────────────────────────────────
// Sidebar
// ──────────────────────────────────────────────────────
export function AppSidebar() {
  const { activeView, setActiveView, currentRole, selectedWarehouse, setSelectedWarehouse } = useAppStore()
  const filteredItems = navItems.filter((item) => item.roles.includes(currentRole))

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="p-2">
        <AppLogo />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup className="border-b pb-3">
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.filter((item) => item.group === "operations").map((item) => (
                <SidebarNavItem key={item.id} item={item} activeView={activeView} setActiveView={setActiveView} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="border-b pb-3">
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.filter((item) => item.group === "analytics").map((item) => (
                <SidebarNavItem key={item.id} item={item} activeView={activeView} setActiveView={setActiveView} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.filter((item) => item.group === "system").map((item) => (
                <SidebarNavItem key={item.id} item={item} activeView={activeView} setActiveView={setActiveView} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div className="space-y-2">
          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger className="h-8 border-none bg-muted/50 text-xs shadow-none group-data-[collapsible=icon]:hidden">
              <Warehouse className="h-3 w-3 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Select Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              {warehouses.map((wh) => (
                <SelectItem key={wh.id} value={wh.id}>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: wh.status === "green" ? "#10B981" : wh.status === "amber" ? "#F59E0B" : "#EF4444" }} />
                    {wh.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Separator />
          <div className="flex items-center gap-2.5 px-2 py-1">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-[10px] font-semibold text-white shadow-sm">RK</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="truncate text-xs font-medium text-foreground">Rajesh Kumar</span>
              <span className="truncate text-[10px] text-muted-foreground capitalize">{currentRole.replace(/_/g, " ")}</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

// ──────────────────────────────────────────────────────
// Live Clock
// ──────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = React.useState("")

  React.useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) return null
  return (
    <span className="hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
      <Clock className="h-3 w-3" />
      {time}
    </span>
  )
}

// ──────────────────────────────────────────────────────
// Notification Panel
// ──────────────────────────────────────────────────────
function NotificationPanel() {
  const [open, setOpen] = React.useState(false)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const storeNotifications = useAppStore((s) => s.notifications)
  const unreadCount = useAppStore((s) => s.unreadCount)
  const markRead = useAppStore((s) => s.markRead)

  // Use store notifications, fall back to static data before store is seeded
  const displayNotifications = storeNotifications.length > 0
    ? storeNotifications.slice(0, 5)
    : recentNotifications.slice(0, 5)
  const alertCount = storeNotifications.length > 0 ? unreadCount : recentNotifications.length

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-8 w-8 icon-badge">
            <Bell className="h-4 w-4" />
            {alertCount > 0 && (
              <span className={cn(
                "badge-bounce absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white ring-2 ring-background",
                unreadCount > 0 ? "bg-red-500" : "bg-blue-500"
              )}>
                {alertCount > 99 ? "99+" : alertCount}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={8}>
          <div className="flex items-center justify-between border-b px-4 py-3">
            <DropdownMenuLabel className="p-0 text-sm font-semibold">Notifications</DropdownMenuLabel>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] tabular-nums">{unreadCount} new</Badge>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {displayNotifications.map((n) => {
              const sev = n.severity ?? "info"
              const SevIcon = severityIcon[sev as keyof typeof severityIcon] || Info
              const colorClass = severityColor[sev as keyof typeof severityColor] || "text-muted-foreground"
              const isUnread = "read" in n ? !n.read : true
              return (
                <DropdownMenuItem
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 cursor-pointer",
                    isUnread && "bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                  onClick={() => "read" in n && markRead(n.id)}
                >
                  <SevIcon className={cn("mt-0.5 h-4 w-4 shrink-0", colorClass)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium">{n.title}</p>
                      {isUnread && <span className="size-1.5 rounded-full bg-blue-500 shrink-0" />}
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                      {"message" in n ? n.message : "desc" in n ? n.desc : ""}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <p className="text-[10px] text-muted-foreground/60">
                        {"timestamp" in n
                          ? formatRelativeTime(n.timestamp as number)
                          : "time" in n ? n.time : ""}
                      </p>
                      {"warehouse" in n && n.warehouse && (
                        <>
                          <span className="text-muted-foreground/30">·</span>
                          <p className="text-[10px] text-muted-foreground/60">{n.warehouse as string}</p>
                        </>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })}
          </div>
          <div className="border-t px-4 py-2">
            <DropdownMenuItem
              className="justify-center text-xs text-blue-600 dark:text-blue-400 cursor-pointer"
              onSelect={(e) => {
                e.preventDefault()
                setOpen(false)
                setSheetOpen(true)
              }}
            >
              View All Notifications
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <NotificationsSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  )
}

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

// ──────────────────────────────────────────────────────
// Top Navigation
// ──────────────────────────────────────────────────────
export function TopNav() {
  const { activeView, currentRole, setCurrentRole, commandPaletteOpen, setCommandPaletteOpen } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  const currentNavItem = navItems.find((item) => item.id === activeView)

  const roles: { value: Role; label: string }[] = [
    { value: "super_admin", label: "Super Admin" },
    { value: "executive", label: "Executive" },
    { value: "regional_manager", label: "Regional Manager" },
    { value: "warehouse_manager", label: "Warehouse Manager" },
    { value: "supervisor", label: "Supervisor" },
    { value: "operator", label: "Operator" },
  ]

  return (
    <header className="glass-morphism sticky top-0 z-30 flex h-14 items-center gap-2 px-4">
      {/* Left: Sidebar trigger + Breadcrumb */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-semibold text-foreground">
                {currentNavItem?.label || "Dashboard"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Center: Search */}
      <div className="flex flex-1 items-center justify-center">
        <Button
          variant="outline"
          size="sm"
          className="hidden h-8 w-64 justify-start gap-2 rounded-lg border-dashed text-muted-foreground transition-colors hover:border-solid hover:bg-muted/50 md:flex"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">Search pages...</span>
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted/80 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-[9px]">⌘</span>K
          </kbd>
        </Button>
      </div>

      {/* Mobile search button */}
      <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => setCommandPaletteOpen(true)}>
        <Search className="h-4 w-4" />
      </Button>

      {/* Right: Controls */}
      <div className="flex items-center gap-1.5">
        <LiveClock />

        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden gap-1.5 h-8 text-xs rounded-lg lg:flex">
              <Shield className="h-3 w-3" />
              <span className="max-w-[100px] truncate capitalize">{currentRole.replace(/_/g, " ")}</span>
              <ChevronDown className="h-2.5 w-2.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs">Switch Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roles.map((role) => (
              <DropdownMenuItem
                key={role.value}
                className={cn(
                  "text-xs cursor-pointer",
                  currentRole === role.value && "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                )}
                onClick={() => setCurrentRole(role.value)}
              >
                {role.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <NotificationPanel />

        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 theme-toggle-btn relative overflow-hidden"
            onClick={() => {
              document.documentElement.classList.add('theme-transitioning')
              setTheme(theme === "dark" ? "light" : "dark")
              setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 350)
            }}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}

        {/* Quick Settings */}
        <QuickSettingsPopover />

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 gap-2 rounded-full pl-1.5 pr-2.5 hover:bg-muted">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-[10px] font-semibold text-white shadow-sm">RK</AvatarFallback>
              </Avatar>
              <span className="hidden text-xs font-medium lg:inline-block">Rajesh Kumar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-[10px] font-semibold text-white">RK</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">Rajesh Kumar</p>
                    <p className="mt-1 text-[11px] text-muted-foreground capitalize">{currentRole.replace(/_/g, " ")}</p>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-xs cursor-pointer">
                <User className="mr-2 h-3.5 w-3.5" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => useAppStore.getState().setActiveView("settings")}>
                <Settings className="mr-2 h-3.5 w-3.5" /> Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" className="text-xs cursor-pointer">
              <LogOut className="mr-2 h-3.5 w-3.5" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

// ──────────────────────────────────────────────────────
// Command Palette
// ──────────────────────────────────────────────────────
export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveView, activeView } = useAppStore()
  const [search, setSearch] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [recentViews, setRecentViews] = React.useState<string[]>([])

  // Track recent views (max 3)
  const trackRecentView = React.useCallback((viewId: string) => {
    setRecentViews((prev) => {
      const filtered = prev.filter((v) => v !== viewId)
      return [viewId, ...filtered].slice(0, 3)
    })
  }, [])

  React.useEffect(() => {
    if (activeView) trackRecentView(activeView)
  }, [activeView, trackRecentView])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
      if (e.key === "Escape" && commandPaletteOpen) {
        setCommandPaletteOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  React.useEffect(() => {
    if (commandPaletteOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [commandPaletteOpen])

  const filtered = navItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  )

  const recentItems = recentViews
    .map((id) => navItems.find((n) => n.id === id))
    .filter(Boolean) as typeof navItems

  // Quick action shortcuts
  const quickActions = [
    { id: "quick-scan", label: "Scan Barcode", icon: "scan", view: "inventory" },
    { id: "quick-alerts", label: "View Alerts", icon: "alert", view: "alerts" },
    { id: "quick-sla", label: "SLA Countdown", icon: "timer", view: "sla-countdown" },
    { id: "quick-dock", label: "Dock Schedule", icon: "dock", view: "dock-scheduler" },
  ]

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200",
          commandPaletteOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => { setCommandPaletteOpen(false); setSearch("") }}
      />
      <div
        className={cn(
          "fixed left-1/2 top-[15%] z-50 w-full max-w-lg -translate-x-1/2 rounded-2xl border border-border/60 bg-background shadow-2xl shadow-black/20 transition-all duration-200",
          commandPaletteOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-2 border-b px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            placeholder="Search pages, warehouses, actions..."
            className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground input-underline"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded border bg-muted/80 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {/* Recent Views (only when not searching) */}
          {!search && recentItems.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recent
              </div>
              {recentItems.map((item) => {
                const Icon = iconMap[item.icon]
                return (
                  <button
                    key={`recent-${item.id}`}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-left transition-colors hover:bg-muted"
                    onClick={() => {
                      setActiveView(item.id)
                      setCommandPaletteOpen(false)
                      setSearch("")
                    }}
                  >
                    {Icon ? <Icon className="h-4 w-4 shrink-0 text-muted-foreground" /> : <div className="h-4 w-4" />}
                    <span className="flex-1">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground">recent</span>
                  </button>
                )
              })}
            </>
          )}
          {/* Quick Actions (only when not searching) */}
          {!search && (
            <>
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Actions
              </div>
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-left transition-colors hover:bg-muted"
                  onClick={() => {
                    setActiveView(action.view)
                    setCommandPaletteOpen(false)
                    setSearch("")
                  }}
                >
                  <Zap className="h-4 w-4 shrink-0 text-primary" />
                  <span className="flex-1">{action.label}</span>
                  <kbd className="rounded border bg-muted/80 px-1 py-0.5 font-mono text-[9px] text-muted-foreground">action</kbd>
                </button>
              ))}
            </>
          )}
          <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {search ? "Results" : "All Pages"}
          </div>
          {filtered.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive = useAppStore.getState().activeView === item.id
            return (
              <button
                key={item.id}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-colors",
                  isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "hover:bg-muted"
                )}
                onClick={() => {
                  setActiveView(item.id)
                  setCommandPaletteOpen(false)
                  setSearch("")
                }}
              >
                {Icon ? <Icon className="h-4 w-4 shrink-0" /> : <div className="h-4 w-4" />}
                <span className="flex-1">{item.label}</span>
                {isActive && <span className="text-[10px] text-muted-foreground">Current</span>}
              </button>
            )
          })}
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{search}&rdquo;
            </div>
          )}
        </div>
        <div className="border-t px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Type to search</span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[9px]">↑↓</kbd> navigate
            <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[9px] ml-2">↵</kbd> select
            <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[9px] ml-2">?</kbd> shortcuts
          </span>
        </div>
      </div>
    </>
  )
}

// ──────────────────────────────────────────────────────
// App Layout (Root)
// ──────────────────────────────────────────────────────
export function AppLayout({ children }: { children: ReactNode }) {

  return (
    <>
      <AppSidebar />
      <SidebarInset className="flex min-h-svh flex-col">
        <TopNav />
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
        <footer className="no-print mt-auto hidden border-t px-4 py-2 md:flex md:items-center md:justify-between">
          <span className="text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} AutoFlow Logistics | Enterprise Warehouse Management
          </span>
          <span className="text-[10px] text-muted-foreground">
            v1.0.0 · Built with Next.js
          </span>
        </footer>
      </SidebarInset>
      <MobileBottomNav />
      <CommandPalette />
      <KeyboardShortcutsDialog />
    </>
  )
}
