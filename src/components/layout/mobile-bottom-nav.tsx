"use client"

import * as React from "react"
import {
  LayoutDashboard,
  PackageSearch,
  Truck,
  Package,
  Bell,
  Ellipsis,
  Warehouse,
  Route,
  Navigation,
  Cog,
  Users,
  TrendingUp,
  DollarSign,
  FileBarChart,
  Settings,
  LayoutGrid,
  MapPin,
} from "lucide-react"
import { useAppStore, navItems } from "@/store/app-store"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// ──────────────────────────────────────────────────────
// Icon map matching sidebar icons for "More" menu
// ──────────────────────────────────────────────────────

const moreIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Warehouse,
  PackageSearch,
  Truck,
  Package,
  Route,
  Navigation,
  Cog,
  Users,
  TrendingUp,
  DollarSign,
  Bell,
  FileBarChart,
  Settings,
  LayoutGrid,
  MapPin,
}

// ──────────────────────────────────────────────────────
// Core mobile nav items (first 4 + Alerts + More)
// ──────────────────────────────────────────────────────

interface MobileNavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  /** navItem ids used to pull role permissions */
  sourceIds: string[]
  badge?: number
}

const coreMobileItems: MobileNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    sourceIds: ["dashboard"],
  },
  {
    id: "inbound",
    label: "Inbound",
    icon: PackageSearch,
    sourceIds: ["inbound"],
  },
  {
    id: "outbound",
    label: "Outbound",
    icon: Truck,
    sourceIds: ["outbound"],
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    sourceIds: ["inventory"],
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: Bell,
    sourceIds: ["alerts"],
    badge: 5,
  },
]

// ──────────────────────────────────────────────────────
// Mobile Bottom Navigation Bar
// ──────────────────────────────────────────────────────

export function MobileBottomNav() {
  const { activeView, setActiveView, currentRole } = useAppStore()
  const [moreOpen, setMoreOpen] = React.useState(false)

  // Keep only items the current role has permission for
  const permittedCoreItems = React.useMemo(
    () =>
      coreMobileItems.filter((item) => {
        const matchingNavItems = navItems.filter((n) =>
          item.sourceIds.includes(n.id)
        )
        return matchingNavItems.some((n) => n.roles.includes(currentRole))
      }),
    [currentRole]
  )

  // All nav items the current role has permission for (for the More sheet)
  const permittedAllItems = React.useMemo(
    () =>
      navItems.filter((n) => n.roles.includes(currentRole)),
    [currentRole]
  )

  // Items already shown in the core nav (to exclude from "More")
  const coreIds = new Set(permittedCoreItems.map((i) => i.id))
  const moreItems = permittedAllItems.filter((n) => !coreIds.has(n.id))

  const handleMoreSelect = React.useCallback(
    (id: string) => {
      setActiveView(id)
      setMoreOpen(false)
    },
    [setActiveView]
  )

  return (
    <>
      <nav
        className={cn(
          "no-print fixed bottom-0 left-0 right-0 z-40 md:hidden",
          "border-t border-border",
          "shadow-[0_-1px_3px_rgba(0,0,0,0.05)]",
          "dark:shadow-[0_-1px_3px_rgba(0,0,0,0.2)]",
          "bg-background/80 backdrop-blur-lg"
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around px-1 pt-1">
          {permittedCoreItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "ripple-effect nav-tap-feedback relative flex min-w-0 flex-1 flex-col items-center gap-0.5",
                  "rounded-lg py-2 transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-150",
                      isActive && "scale-110"
                    )}
                  />
                  {/* Badge count */}
                  {item.badge != null && item.badge > 0 && !isActive && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-background">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10px] leading-tight font-medium transition-colors duration-150",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
                {/* Active bottom bar indicator */}
                {isActive && (
                  <span className="nav-active-bar" />
                )}
              </button>
            )
          })}

          {/* "More" button */}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "ripple-effect nav-tap-feedback relative flex min-w-0 flex-1 flex-col items-center gap-0.5",
              "rounded-lg py-2 transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              moreOpen ? "text-primary" : "text-muted-foreground"
            )}
            aria-label="More navigation options"
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <Ellipsis className="h-5 w-5" />
            </span>
            <span className="text-[10px] leading-tight font-medium text-muted-foreground">
              More
            </span>
            {moreOpen && <span className="nav-active-bar" />}
          </button>
        </div>
      </nav>

      {/* "More" Sheet / Drawer */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl px-0 pb-0 pt-4 md:hidden"
          style={{
            maxHeight: "60vh",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          <SheetHeader className="px-4 pb-3">
            <SheetTitle className="text-sm font-semibold">All Modules</SheetTitle>
          </SheetHeader>
          <Separator />
          <ScrollArea className="h-full max-h-[calc(60vh-4rem)] px-4 pt-2">
            <div className="space-y-1 pb-4">
              {moreItems.map((navItem) => {
                const MoreIcon = moreIconMap[navItem.icon]
                const isActive = activeView === navItem.id

                return (
                  <button
                    key={navItem.id}
                    type="button"
                    onClick={() => handleMoreSelect(navItem.id)}
                    className={cn(
                      "ripple-effect nav-tap-feedback flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {MoreIcon ? (
                      <MoreIcon className="h-4 w-4 shrink-0" />
                    ) : (
                      <div className="h-4 w-4 shrink-0 rounded border border-muted-foreground/30" />
                    )}
                    <span className="text-sm">{navItem.label}</span>
                    {navItem.badge != null && navItem.badge > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                        {navItem.badge > 9 ? "9+" : navItem.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
