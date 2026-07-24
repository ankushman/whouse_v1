"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  Warehouse,
  PackageSearch,
  Truck,
  Package,
  Route,
  Cog,
  Users,
  TrendingUp,
  DollarSign,
  Bell,
  FileBarChart,
  Settings,
  Grid3X3,
  Search,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
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

// ──────────────────────────────────────────────────────
// Icon Map
// ──────────────────────────────────────────────────────
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Warehouse,
  PackageSearch,
  Truck,
  Package,
  Route,
  Cog,
  Users,
  TrendingUp,
  DollarSign,
  Bell,
  FileBarChart,
  Settings,
}

// ──────────────────────────────────────────────────────
// Recent notifications for the bell dropdown
// ──────────────────────────────────────────────────────
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
    <div className="flex items-center gap-2.5 px-2 py-1.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm shadow-blue-500/25">
        <Building2 className="h-4 w-4" />
      </div>
      <div className="flex flex-col group-data-[collapsible=icon]:hidden">
        <span className="text-sm font-bold tracking-tight text-foreground leading-tight">AutoFlow</span>
        <span className="text-[10px] font-medium text-muted-foreground leading-tight">Warehouse Management</span>
      </div>
    </div>
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
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.slice(0, 7).map((item) => {
                const Icon = iconMap[item.icon]
                const isActive = activeView === item.id
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() => setActiveView(item.id)}
                      className={cn(
                        "transition-all duration-150",
                        isActive && "bg-blue-600 text-white shadow-sm shadow-blue-500/25 hover:bg-blue-700 hover:text-white"
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
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.slice(7, 10).map((item) => {
                const Icon = iconMap[item.icon]
                const isActive = activeView === item.id
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() => setActiveView(item.id)}
                      className={cn(
                        "transition-all duration-150",
                        isActive && "bg-blue-600 text-white shadow-sm shadow-blue-500/25 hover:bg-blue-700 hover:text-white"
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.slice(10).map((item) => {
                const Icon = iconMap[item.icon]
                const isActive = activeView === item.id
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() => setActiveView(item.id)}
                      className={cn(
                        "transition-all duration-150",
                        isActive && "bg-blue-600 text-white shadow-sm shadow-blue-500/25 hover:bg-blue-700 hover:text-white"
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
              })}
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
  const alertCount = recentNotifications.length

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {alertCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-background">
              {alertCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">Notifications</DropdownMenuLabel>
          <Badge variant="secondary" className="text-[10px]">{alertCount} new</Badge>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {recentNotifications.map((n) => {
            const SevIcon = severityIcon[n.severity as keyof typeof severityIcon] || Info
            const colorClass = severityColor[n.severity as keyof typeof severityColor] || "text-muted-foreground"
            return (
              <DropdownMenuItem key={n.id} className="flex items-start gap-3 px-4 py-3 cursor-pointer">
                <SevIcon className={cn("mt-0.5 h-4 w-4 shrink-0", colorClass)} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{n.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">{n.desc}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/60">{n.time}</p>
                </div>
              </DropdownMenuItem>
            )
          })}
        </div>
        <div className="border-t px-4 py-2">
          <DropdownMenuItem className="justify-center text-xs text-blue-600 dark:text-blue-400 cursor-pointer">
            View All Notifications
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
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
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
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
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}

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
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveView } = useAppStore()
  const [search, setSearch] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

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
            className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded border bg-muted/80 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {search ? "Results" : "Quick Navigation"}
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
      </SidebarInset>
      <MobileBottomNav />
      <CommandPalette />
    </>
  )
}
