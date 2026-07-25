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
  ScanBarcode,
  PlusCircle,
  ClipboardList,
} from "lucide-react"
import { useAppStore, navItems } from "@/store/app-store"
import { cn } from "@/lib/utils"
import { useSwipe } from "@/hooks/use-swipe"
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
// Core mobile nav items (first 4 + Alerts)
// ──────────────────────────────────────────────────────

interface MobileNavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  /** navItem ids used to pull role permissions */
  sourceIds: string[]
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
  },
]

// ──────────────────────────────────────────────────────
// Quick actions for swipe-up gesture sheet
// ──────────────────────────────────────────────────────

const quickActions = [
  { id: "scan", label: "Scan", icon: ScanBarcode, view: "inventory" },
  { id: "receive", label: "Receive", icon: PackageSearch, view: "inbound" },
  { id: "dispatch", label: "Dispatch", icon: Truck, view: "outbound" },
  { id: "check", label: "Stock Check", icon: ClipboardList, view: "inventory" },
  { id: "new-order", label: "New Order", icon: PlusCircle, view: "outbound" },
]

// ──────────────────────────────────────────────────────
// Mobile Bottom Navigation Bar
// ──────────────────────────────────────────────────────

export function MobileBottomNav() {
  const { activeView, setActiveView, currentRole, unreadCount } = useAppStore()
  const [moreOpen, setMoreOpen] = React.useState(false)
  const [quickActionsOpen, setQuickActionsOpen] = React.useState(false)

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

  // ── Sliding pill indicator ──────────────────────────
  const navRef = React.useRef<HTMLElement>(null)
  const itemRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const moreBtnRef = React.useRef<HTMLButtonElement>(null)

  const [pillStyle, setPillStyle] = React.useState<React.CSSProperties>({
    opacity: 0,
  })

  const activeIndex = React.useMemo(
    () => permittedCoreItems.findIndex((i) => i.id === activeView),
    [permittedCoreItems, activeView]
  )

  const updatePillPosition = React.useCallback(() => {
    const navEl = navRef.current
    if (!navEl) return

    let targetBtn: HTMLButtonElement | null = null

    if (activeIndex >= 0) {
      targetBtn =
        itemRefs.current[permittedCoreItems[activeIndex]?.id] ?? null
    } else if (moreOpen) {
      targetBtn = moreBtnRef.current
    }

    if (!targetBtn) {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }))
      return
    }

    const navRect = navEl.getBoundingClientRect()
    const btnRect = targetBtn.getBoundingClientRect()
    const inset = 10

    setPillStyle({
      transform: `translateX(${btnRect.left - navRect.left + inset}px)`,
      width: Math.max(0, btnRect.width - inset * 2),
      opacity: 1,
    })
  }, [activeIndex, moreOpen, permittedCoreItems])

  React.useLayoutEffect(() => {
    updatePillPosition()
  }, [updatePillPosition])

  // Recalculate pill on window resize
  React.useEffect(() => {
    window.addEventListener("resize", updatePillPosition)
    return () => window.removeEventListener("resize", updatePillPosition)
  }, [updatePillPosition])

  // ── Swipe gesture navigation ────────────────────────
  const { swipeHandlers } = useSwipe({
    onSwipeLeft: () => {
      if (activeIndex >= 0 && activeIndex < permittedCoreItems.length - 1) {
        setActiveView(permittedCoreItems[activeIndex + 1].id)
      }
    },
    onSwipeRight: () => {
      if (activeIndex > 0) {
        setActiveView(permittedCoreItems[activeIndex - 1].id)
      }
    },
    onSwipeUp: () => {
      setMoreOpen(false)
      setQuickActionsOpen(true)
    },
    threshold: 40,
  })

  // ── Handlers ────────────────────────────────────────
  const handleMoreSelect = React.useCallback(
    (id: string) => {
      setActiveView(id)
      setMoreOpen(false)
    },
    [setActiveView]
  )

  const handleQuickAction = React.useCallback(
    (view: string) => {
      setActiveView(view)
      setQuickActionsOpen(false)
    },
    [setActiveView]
  )

  const openMore = React.useCallback(() => {
    setQuickActionsOpen(false)
    setMoreOpen(true)
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        {...swipeHandlers}
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
        <div className="relative flex items-center justify-around px-1 pt-1">
          {permittedCoreItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id

            return (
              <button
                key={item.id}
                ref={(el) => {
                  itemRefs.current[item.id] = el
                }}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "nav-tap-feedback relative flex min-w-0 flex-1 flex-col items-center gap-0.5",
                  "rounded-lg py-2 transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "text-primary active:bg-primary/10"
                    : "text-muted-foreground"
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
                  {/* Unread badge driven by store unreadCount */}
                  {item.id === "alerts" && unreadCount > 0 && !isActive && (
                    <span className="badge-bounce absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-background">
                      {unreadCount > 9 ? "9+" : unreadCount}
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
              </button>
            )
          })}

          {/* "More" button */}
          <button
            ref={moreBtnRef}
            type="button"
            onClick={openMore}
            className={cn(
              "nav-tap-feedback relative flex min-w-0 flex-1 flex-col items-center gap-0.5",
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
          </button>

          {/* Sliding pill indicator */}
          <span
            className="pointer-events-none absolute bottom-0 left-0 h-1 rounded-full bg-primary transition-[transform,width,opacity] duration-300 ease-out"
            style={pillStyle}
          />
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
            <SheetTitle className="text-sm font-semibold">
              All Modules
            </SheetTitle>
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

      {/* Quick Actions Sheet (swipe-up) */}
      <Sheet open={quickActionsOpen} onOpenChange={setQuickActionsOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl px-0 pb-0 pt-4 md:hidden"
          style={{
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          <SheetHeader className="px-4 pb-3">
            <SheetTitle className="text-sm font-semibold">
              Quick Actions
            </SheetTitle>
          </SheetHeader>
          <Separator />
          <div className="grid grid-cols-3 gap-2 px-4 pt-4 pb-4">
            {quickActions.map((action) => {
              const ActionIcon = action.icon
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleQuickAction(action.view)}
                  className={cn(
                    "nav-tap-feedback flex flex-col items-center gap-2 rounded-xl p-4",
                    "bg-muted/50 text-foreground transition-all duration-150",
                    "active:bg-primary/10 active:scale-95 active:text-primary",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  <ActionIcon className="h-5 w-5" />
                  <span className="text-[11px] font-medium leading-tight text-center">
                    {action.label}
                  </span>
                </button>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
