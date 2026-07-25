"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  AlertTriangle,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  RefreshCw,
  History,
  Boxes,
  Warehouse,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types — kept loose so the drawer can render any inventory-like row
// ---------------------------------------------------------------------------

export interface InventoryDetailRow {
  id?: string | number
  sku: string
  partName: string
  category: string
  warehouse: string
  location?: string
  quantity: number
  minStock: number
  maxStock: number
  variance?: number
  abcClass?: string
  lastCount?: string
  daysSinceLastCount?: number
  unitPrice?: number
  supplier?: string
  leadTimeDays?: number
  reorderPoint?: number
}

interface InventoryDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryDetailRow | null
  onReorder?: (item: InventoryDetailRow) => void
  onRefresh?: (item: InventoryDetailRow) => void
}

// ---------------------------------------------------------------------------
// Mock movement history — in real app would come from API
// ---------------------------------------------------------------------------

function generateMovementHistory(sku: string): Array<{
  date: string
  type: "IN" | "OUT" | "ADJ" | "COUNT"
  qty: number
  user: string
  note: string
}> {
  // Deterministic pseudo-random based on SKU so each item has stable history
  const seed = sku.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  const types: Array<"IN" | "OUT" | "ADJ" | "COUNT"> = ["IN", "OUT", "ADJ", "COUNT"]
  const users = ["Rajesh K.", "Priya S.", "Amit M.", "Sneha R.", "Vikram T."]
  const notes: Record<string, string[]> = {
    IN: ["Supplier delivery received", "Stock transfer from WH-02", "Return from customer"],
    OUT: ["Order #ORD-4521 fulfilled", "Stock transfer to WH-03", "Customer pickup"],
    ADJ: ["Cycle count adjustment", "Damaged stock write-off", "QA rejection"],
    COUNT: ["Weekly cycle count", "Monthly audit", "Quarterly inventory check"],
  }
  const out: Array<{ date: string; type: "IN" | "OUT" | "ADJ" | "COUNT"; qty: number; user: string; note: string }> = []
  const today = new Date()
  for (let i = 0; i < 8; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i * 3 - ((seed + i) % 4))
    const typeIdx = (seed + i * 7) % 4
    const type = types[typeIdx]
    const baseQty = 5 + ((seed + i * 11) % 45)
    const qty = type === "OUT" ? -baseQty : type === "ADJ" ? ((seed + i) % 3 === 0 ? -1 : 1) * (baseQty / 5 | 0) : baseQty
    out.push({
      date: d.toISOString().slice(0, 10),
      type,
      qty,
      user: users[(seed + i) % users.length],
      note: notes[type][(seed + i) % notes[type].length],
    })
  }
  return out
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function InventoryDetailDrawer({
  open,
  onOpenChange,
  item,
  onReorder,
  onRefresh,
}: InventoryDetailDrawerProps) {
  // Hooks MUST be called before any early return. The movement history is
  // derived from item?.sku (empty string fallback keeps useMemo stable when item is null).
  const skuForHistory = item?.sku ?? ""
  const movementHistory = React.useMemo(
    () => (skuForHistory ? generateMovementHistory(skuForHistory) : []),
    [skuForHistory]
  )

  if (!item) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0" />
      </Sheet>
    )
  }

  const stockPercent = Math.min(100, Math.round((item.quantity / Math.max(1, item.maxStock)) * 100))
  const isLow = item.quantity < item.minStock
  const isOverstock = item.quantity > item.maxStock * 0.9
  const healthScore = isLow ? 25 : isOverstock ? 65 : item.variance && item.variance !== 0 ? 75 : 95
  const healthLabel = healthScore >= 90 ? "Healthy" : healthScore >= 70 ? "Monitor" : healthScore >= 40 ? "At Risk" : "Critical"
  const healthColor =
    healthScore >= 90 ? "text-emerald-600 dark:text-emerald-400"
    : healthScore >= 70 ? "text-blue-600 dark:text-blue-400"
    : healthScore >= 40 ? "text-amber-600 dark:text-amber-400"
    : "text-red-600 dark:text-red-400"
  const inventoryValue = (item.unitPrice ?? 0) * item.quantity
  const reorderNeeded = isLow

  // Stock velocity (units/day based on last 8 movements)
  const totalOut = movementHistory.filter((m) => m.type === "OUT").reduce((s, m) => s + Math.abs(m.qty), 0)
  const daysCovered = 24 // 8 movements * ~3 days each
  const velocity = totalOut / daysCovered
  const daysOfStock = velocity > 0 ? Math.round(item.quantity / velocity) : 999

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:max-w-lg p-0 flex flex-col overflow-y-auto",
          "drawer-slide-in"
        )}
      >
        {/* Header with gradient accent */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                isLow
                  ? "bg-red-50 dark:bg-red-950"
                  : "bg-primary/10"
              )}>
                {isLow ? (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                ) : (
                  <Package className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-base leading-tight truncate">
                  {item.partName}
                </SheetTitle>
                <SheetDescription className="text-xs font-mono mt-0.5">
                  {item.sku}
                </SheetDescription>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="outline" className="text-[10px] font-normal">{item.category}</Badge>
                  {item.abcClass && (
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      Class {item.abcClass}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-[10px] font-normal gap-1">
                    <MapPin className="h-2.5 w-2.5" />
                    {item.warehouse}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Stock Health Banner */}
        <div className={cn(
          "px-5 py-3 flex items-center justify-between gap-3 border-b",
          healthScore < 40 && "bg-red-50 dark:bg-red-950/30",
          healthScore >= 40 && healthScore < 70 && "bg-amber-50 dark:bg-amber-950/30",
          healthScore >= 70 && "bg-emerald-50 dark:bg-emerald-950/30"
        )}>
          <div className="flex items-center gap-2">
            <Activity className={cn("h-4 w-4", healthColor)} />
            <span className="text-xs font-medium">Stock Health</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-bold", healthColor)}>{healthLabel}</span>
            <span className={cn("text-xs text-number", healthColor)}>{healthScore}/100</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 px-5 py-5 space-y-5">
          {/* Stock Level Card */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Boxes className="h-3.5 w-3.5" />
              Stock Level
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border p-3">
                <p className="text-[10px] text-muted-foreground">Current</p>
                <p className={cn(
                  "text-lg font-bold text-number mt-0.5",
                  isLow && "text-red-600 dark:text-red-400"
                )}>
                  {item.quantity.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-[10px] text-muted-foreground">Min</p>
                <p className="text-lg font-semibold text-number mt-0.5 text-muted-foreground">
                  {item.minStock.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-[10px] text-muted-foreground">Max</p>
                <p className="text-lg font-semibold text-number mt-0.5 text-muted-foreground">
                  {item.maxStock.toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>Capacity</span>
                <span className="text-number">{stockPercent}%</span>
              </div>
              <Progress
                value={stockPercent}
                className={cn(
                  "h-2",
                  isLow && "[&>div]:bg-red-500",
                  isOverstock && !isLow && "[&>div]:bg-amber-500"
                )}
              />
            </div>
            {reorderNeeded && (
              <div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-3 py-2 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <p className="text-[11px] text-red-700 dark:text-red-300">
                  Below minimum stock. Reorder recommended ({item.minStock - item.quantity} units short).
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Last Count
              </p>
              <p className="text-sm font-medium text-number">{item.lastCount ?? "—"}</p>
              {item.daysSinceLastCount != null && (
                <p className={cn(
                  "text-[10px]",
                  item.daysSinceLastCount > 7 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                )}>
                  {item.daysSinceLastCount} days ago
                </p>
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Variance
              </p>
              <p className={cn(
                "text-sm font-semibold text-number",
                (item.variance ?? 0) > 0 && "text-red-600 dark:text-red-400",
                (item.variance ?? 0) < 0 && "text-amber-600 dark:text-amber-400",
                (item.variance ?? 0) === 0 && "text-emerald-600 dark:text-emerald-400"
              )}>
                {(item.variance ?? 0) > 0 ? "+" : ""}{item.variance ?? 0}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {(item.variance ?? 0) === 0 ? "Accurate" : "Discrepancy"}
              </p>
            </div>
            {item.unitPrice != null && (
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Unit Price</p>
                <p className="text-sm font-semibold text-number">₹{item.unitPrice.toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-muted-foreground">per unit</p>
              </div>
            )}
            {item.unitPrice != null && (
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Inventory Value</p>
                <p className="text-sm font-bold text-number">₹{inventoryValue.toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-muted-foreground">current holding</p>
              </div>
            )}
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                Daily Velocity
              </p>
              <p className="text-sm font-semibold text-number">{velocity.toFixed(1)}/day</p>
              <p className="text-[10px] text-muted-foreground">avg outflow</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Days of Stock</p>
              <p className={cn(
                "text-sm font-semibold text-number",
                daysOfStock < 7 && "text-red-600 dark:text-red-400",
                daysOfStock >= 7 && daysOfStock < 14 && "text-amber-600 dark:text-amber-400"
              )}>
                {daysOfStock >= 999 ? "∞" : `${daysOfStock}d`}
              </p>
              <p className="text-[10px] text-muted-foreground">until stockout</p>
            </div>
          </div>

          <Separator />

          {/* Supplier Info */}
          {(item.supplier || item.leadTimeDays != null) && (
            <>
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <Warehouse className="h-3.5 w-3.5" />
                  Supplier & Replenishment
                </h3>
                <div className="rounded-lg border p-3 space-y-2">
                  {item.supplier && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Supplier</span>
                      <span className="font-medium">{item.supplier}</span>
                    </div>
                  )}
                  {item.leadTimeDays != null && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Lead Time</span>
                      <span className="font-medium text-number">{item.leadTimeDays} days</span>
                    </div>
                  )}
                  {item.reorderPoint != null && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Reorder Point</span>
                      <span className="font-medium text-number">{item.reorderPoint}</span>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Movement History */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <History className="h-3.5 w-3.5" />
              Recent Movements
            </h3>
            <div className="rounded-lg border divide-y">
              {movementHistory.map((m, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 hover:bg-accent/40 transition-colors movement-row-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold",
                    m.type === "IN" && "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
                    m.type === "OUT" && "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
                    m.type === "ADJ" && "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
                    m.type === "COUNT" && "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                  )}>
                    {m.type}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{m.note}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {m.date} · {m.user}
                    </p>
                  </div>
                  <span className={cn(
                    "text-xs font-semibold text-number shrink-0",
                    m.qty > 0 && "text-emerald-600 dark:text-emerald-400",
                    m.qty < 0 && "text-red-600 dark:text-red-400"
                  )}>
                    {m.qty > 0 ? "+" : ""}{m.qty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5 py-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onRefresh?.(item)}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button
            size="sm"
            className={cn(
              "flex-1 gap-1.5",
              reorderNeeded && "bg-red-600 hover:bg-red-700 text-white reorder-urgent"
            )}
            onClick={() => onReorder?.(item)}
            disabled={!reorderNeeded}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {reorderNeeded ? "Reorder Now" : "Stock OK"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
