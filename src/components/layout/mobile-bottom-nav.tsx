"use client"

import * as React from "react"
import {
  LayoutDashboard,
  PackageSearch,
  Truck,
  Package,
  Bell,
} from "lucide-react"
import { useAppStore, navItems } from "@/store/app-store"
import { cn } from "@/lib/utils"

// ──────────────────────────────────────────────────────
// Core mobile nav item definitions (max 5 most important)
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

  // Keep only items the current role has permission for
  const permittedItems = coreMobileItems.filter((item) => {
    const matchingNavItems = navItems.filter((n) =>
      item.sourceIds.includes(n.id)
    )
    return matchingNavItems.some((n) => n.roles.includes(currentRole))
  })

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 md:hidden",
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
        {permittedItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={cn(
                "bottom-nav-item relative flex min-w-0 flex-1 flex-col items-center gap-0.5",
                "rounded-lg py-2 transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <Icon className={cn("h-5 w-5", isActive && "transition-transform duration-150")} />
                {/* Active dot indicator */}
                {isActive && (
                  <span className="absolute -bottom-2.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary transition-all duration-150" />
                )}
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
              {/* Active bottom border line */}
              <span
                className={cn(
                  "absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-primary transition-all duration-200",
                  isActive
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0"
                )}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
