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
  PanelLeft,
  Search,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Building2,
} from "lucide-react"
import { useAppStore, navItems, type Role } from "@/store/app-store"
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
import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

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

function AppLogo() {
  return (
    <div className="flex items-center gap-2.5 px-2 py-1.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
        <Building2 className="h-4.5 w-4.5" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold tracking-tight text-foreground">AutoFlow</span>
        <span className="text-[10px] font-medium text-muted-foreground">Logistics</span>
      </div>
    </div>
  )
}

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
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const Icon = iconMap[item.icon]
                const isActive = activeView === item.id
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() => setActiveView(item.id)}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>
                        <Badge variant="destructive" className="h-4 min-w-4 px-1 text-[10px]">{item.badge}</Badge>
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
            <SelectTrigger className="h-8 border-none bg-muted/50 text-xs shadow-none">
              <SelectValue placeholder="Select Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              {warehouses.map((wh) => (
                <SelectItem key={wh.id} value={wh.id}>
                  {wh.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Separator />
          <div className="flex items-center gap-2 px-2 py-1">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-blue-600 text-[10px] text-white">RK</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col">
              <span className="text-xs font-medium text-foreground">Rajesh Kumar</span>
              <span className="text-[10px] text-muted-foreground capitalize">{currentRole.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export function TopNav() {
  const { activeView, currentRole, setCurrentRole, alerts, commandPaletteOpen, setCommandPaletteOpen } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentNavItem = navItems.find((item) => item.id === activeView)
  const alertCount = 5

  const roles: { value: Role; label: string }[] = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'executive', label: 'Executive' },
    { value: 'regional_manager', label: 'Regional Manager' },
    { value: 'warehouse_manager', label: 'Warehouse Manager' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'operator', label: 'Operator' },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <h1 className="text-sm font-semibold text-foreground">{currentNavItem?.label || 'Dashboard'}</h1>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <Button
          variant="outline"
          size="sm"
          className="hidden w-64 justify-start gap-2 text-muted-foreground md:flex"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">Search...</span>
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden gap-1.5 text-xs lg:flex">
              <Shield className="h-3.5 w-3.5" />
              <span className="capitalize">{currentRole.replace('_', ' ')}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roles.map((role) => (
              <DropdownMenuItem
                key={role.value}
                className={cn("text-xs", currentRole === role.value && "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300")}
                onClick={() => setCurrentRole(role.value)}
              >
                {role.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {alertCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </Button>

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-blue-600 text-[10px] text-white">RK</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Rajesh Kumar</p>
                <p className="text-xs text-muted-foreground capitalize">{currentRole.replace('_', ' ')}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs">
              <User className="mr-2 h-3.5 w-3.5" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              <Settings className="mr-2 h-3.5 w-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-red-600">
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveView } = useAppStore()
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  const filtered = navItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity",
          commandPaletteOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setCommandPaletteOpen(false)}
      />
      <div
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-0 shadow-2xl transition-all duration-200",
          commandPaletteOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search pages, actions..."
            className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.map((item) => (
            <button
              key={item.id}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left hover:bg-muted transition-colors"
              onClick={() => {
                setActiveView(item.id)
                setCommandPaletteOpen(false)
                setSearch("")
              }}
            >
              {(() => {
                const Icon = iconMap[item.icon]
                return Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null
              })()}
              <span>{item.label}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className="flex min-h-svh flex-col">
        <TopNav />
        <main className="flex-1">
          {children}
        </main>
      </SidebarInset>
      <CommandPalette />
    </>
  )
}
