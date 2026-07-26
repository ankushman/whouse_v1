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
  Truck,
  Package,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Boxes,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  User,
  Building2,
  Weight,
  FileText,
  RefreshCw,
  Download,
  ArrowRight,
  LocateFixed,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ShipmentStatus = "In Transit" | "Delivered" | "Out for Delivery" | "Processing" | "Delayed"

export interface ShipmentDetailRow {
  id: string | number
  trackingId: string
  origin: string
  destination: string
  carrier: string
  status: ShipmentStatus
  eta: string
  items: number
  value: string
}

interface ShipmentDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ShipmentDetailRow | null
  onTrack?: (item: ShipmentDetailRow) => void
  onExport?: (item: ShipmentDetailRow) => void
}

// ---------------------------------------------------------------------------
// Mock tracking events — deterministic per trackingId
// ---------------------------------------------------------------------------

interface TrackingEvent {
  timestamp: string
  location: string
  status: string
  description: string
  completed: boolean
}

interface TrackingDetails {
  events: TrackingEvent[]
  progressPct: number
  distanceKm: number
  // distanceCoveredKm removed from interface — computed at the call site from progressPct * distanceKm
  transitHoursElapsed: number
  transitHoursTotal: number
  weight: string
  dimensions: string
  serviceType: string
  sender: { name: string; phone: string; email: string }
  receiver: { name: string; phone: string; email: string; address: string }
  driver: { name: string; phone: string; vehicle: string; license: string }
  codAmount?: number
  insuranceValue: number
  specialInstructions?: string
}

function generateTrackingDetails(trackingId: string): TrackingDetails {
  const seed = trackingId.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  const today = new Date()

  const cities = [
    { name: "Mumbai Sort Facility", state: "Maharashtra" },
    { name: "Pune Hub", state: "Maharashtra" },
    { name: "Nagpur Cross-Dock", state: "Maharashtra" },
    { name: "Hyderabad Hub", state: "Telangana" },
    { name: "Bangalore Sort Facility", state: "Karnataka" },
    { name: "Chennai Distribution Center", state: "Tamil Nadu" },
    { name: "Delhi NCR Hub", state: "Delhi" },
    { name: "Jaipur Cross-Dock", state: "Rajasthan" },
  ]

  const events: TrackingEvent[] = []
  const numEvents = 5 + (seed % 3)
  for (let i = 0; i < numEvents; i++) {
    const d = new Date(today)
    d.setHours(d.getHours() - (numEvents - i - 1) * 8 - (seed % 6))
    const city = cities[(seed + i) % cities.length]
    const statuses = [
      { status: "Picked Up", desc: "Shipment picked up from origin facility" },
      { status: "In Transit", desc: `Departed ${city.name} sort facility` },
      { status: "Arrived at Hub", desc: `Arrived at ${city.name}` },
      { status: "Out for Delivery", desc: `Out for delivery from ${city.name}` },
      { status: "Delivered", desc: "Delivered to recipient" },
    ]
    const ev = statuses[Math.min(i, statuses.length - 1)]
    events.push({
      timestamp: d.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      location: `${city.name}, ${city.state}`,
      status: ev.status,
      description: ev.desc,
      completed: i < numEvents - 1,
    })
  }

  return {
    events,
    progressPct: Math.min(100, Math.max(15, Math.round((events.filter((e) => e.completed).length / events.length) * 100))),
    distanceKm: 850 + (seed % 1200),
    // Bug ID1 fix: removed dead `distanceCoveredKm: 0` field — actual value is computed
    // separately at the call site from progressPct * distanceKm, never read from `details`.
    transitHoursElapsed: 8 + (seed % 36),
    transitHoursTotal: 24 + (seed % 48),
    weight: `${(2 + (seed % 18)).toFixed(1)} kg`,
    dimensions: `${30 + (seed % 20)}×${20 + (seed % 15)}×${15 + (seed % 10)} cm`,
    serviceType: seed % 3 === 0 ? "Express" : seed % 3 === 1 ? "Standard" : "Priority",
    sender: {
      name: "AutoFlow Logistics",
      phone: "+91 98765 43210",
      email: "dispatch@autoflow.in",
    },
    receiver: {
      name: ["Rajesh Distributors", "Priya Retail Pvt Ltd", "Amit Wholesale", "Sneha Traders"][seed % 4],
      phone: "+91 98XXX " + (10000 + (seed % 89999)).toString(),
      email: "receiver@example.com",
      address: `${123 + (seed % 999)}, MG Road, ${["Bangalore", "Chennai", "Pune", "Jaipur"][seed % 4]}`,
    },
    driver: {
      name: ["Ramesh K.", "Suresh M.", "Mahesh T.", "Dinesh R."][seed % 4],
      phone: "+91 98XXX " + (20000 + (seed % 79999)).toString(),
      vehicle: "MH 0" + (1 + (seed % 9)) + " AB " + (1000 + (seed % 8999)),
      license: "MH0" + (10 + (seed % 89)) + "201" + (1000 + (seed % 8999)),
    },
    codAmount: seed % 4 === 0 ? 25000 + (seed % 75000) : undefined,
    insuranceValue: 50000 + (seed % 450000),
    specialInstructions: seed % 5 === 0 ? "Handle with care — fragile items. Signature required on delivery." : undefined,
  }
}

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

function getStatusColor(status: ShipmentStatus): string {
  switch (status) {
    case "Delivered": return "text-emerald-600 dark:text-emerald-400"
    case "In Transit": return "text-blue-600 dark:text-blue-400"
    case "Out for Delivery": return "text-sky-600 dark:text-sky-400"
    case "Processing": return "text-amber-600 dark:text-amber-400"
    case "Delayed": return "text-red-600 dark:text-red-400"
  }
}

function getStatusBg(status: ShipmentStatus): string {
  switch (status) {
    case "Delivered": return "bg-emerald-50 dark:bg-emerald-950/30"
    case "In Transit": return "bg-blue-50 dark:bg-blue-950/30"
    case "Out for Delivery": return "bg-sky-50 dark:bg-sky-950/30"
    case "Processing": return "bg-amber-50 dark:bg-amber-950/30"
    case "Delayed": return "bg-red-50 dark:bg-red-950/30"
  }
}

function getStatusIcon(status: ShipmentStatus) {
  switch (status) {
    case "Delivered": return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
    case "Delayed": return <AlertTriangle className="h-5 w-5 text-red-500" />
    default: return <Truck className="h-5 w-5 text-primary" />
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ShipmentDetailDrawer({
  open,
  onOpenChange,
  item,
  onTrack,
  onExport,
}: ShipmentDetailDrawerProps) {
  // Hook MUST be called before any early return
  const trackingIdForDetails = item?.trackingId ?? ""
  const details = React.useMemo(
    () => (trackingIdForDetails ? generateTrackingDetails(trackingIdForDetails) : null),
    [trackingIdForDetails]
  )

  if (!item || !details) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0" />
      </Sheet>
    )
  }

  const distanceCoveredKm = Math.round((details.progressPct / 100) * details.distanceKm)
  const etaHours = Math.max(0, details.transitHoursTotal - details.transitHoursElapsed)
  const isDelayed = item.status === "Delayed"
  const isDelivered = item.status === "Delivered"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:max-w-lg p-0 flex flex-col overflow-y-auto",
          "drawer-slide-in"
        )}
      >
        {/* Header */}
        <SheetHeader className={cn("px-5 pt-5 pb-4 border-b", getStatusBg(item.status))}>
          <div className="flex items-start gap-3 min-w-0">
            <div className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              isDelayed ? "bg-red-100 dark:bg-red-950" : isDelivered ? "bg-emerald-100 dark:bg-emerald-950" : "bg-primary/10"
            )}>
              {getStatusIcon(item.status)}
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base leading-tight truncate">
                {item.trackingId}
              </SheetTitle>
              <SheetDescription className="text-xs mt-0.5 flex items-center gap-1.5 flex-wrap">
                <MapPin className="h-3 w-3" /> {item.origin}
                <ArrowRight className="h-3 w-3" />
                <MapPin className="h-3 w-3" /> {item.destination}
              </SheetDescription>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge variant="outline" className={cn("text-[10px] font-normal", getStatusColor(item.status))}>
                  {item.status}
                </Badge>
                <Badge variant="outline" className="text-[10px] font-normal">
                  {item.carrier}
                </Badge>
                <Badge variant="outline" className="text-[10px] font-normal">
                  {details.serviceType}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Progress Banner */}
        <div className="px-5 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">Shipment Progress</span>
            <span className={cn("text-xs font-bold text-number", getStatusColor(item.status))}>
              {details.progressPct}%
            </span>
          </div>
          <Progress value={details.progressPct} className="h-2" />
          <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
            <span className="text-number">{distanceCoveredKm} km covered</span>
            <span className="text-number">{details.distanceKm - distanceCoveredKm} km remaining</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 px-5 py-5 space-y-5">
          {/* ETA / Transit Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ETA
              </p>
              <p className="text-xs font-semibold mt-1">{item.eta}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Navigation className="h-3 w-3" />
                Hours Left
              </p>
              <p className="text-sm font-semibold text-number mt-1">
                {isDelivered ? "—" : `${etaHours}h`}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Weight className="h-3 w-3" />
                Weight
              </p>
              <p className="text-sm font-semibold text-number mt-1">{details.weight}</p>
            </div>
          </div>

          {isDelayed && (
            <div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-3 py-2 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
              <p className="text-[11px] text-red-700 dark:text-red-300">
                Shipment delayed. Estimated delay: 4-8 hours. Carrier has been notified.
              </p>
            </div>
          )}

          <Separator />

          {/* Shipment Details */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              Shipment Details
            </h3>
            <div className="rounded-lg border p-3 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Boxes className="h-3 w-3" /> Items
                  </p>
                  <p className="text-sm font-semibold text-number">{item.items}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> Declared Value
                  </p>
                  <p className="text-sm font-semibold text-number">{item.value}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Dimensions</p>
                  <p className="text-sm font-medium text-number">{details.dimensions}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Insurance</p>
                  <p className="text-sm font-medium text-number">₹{details.insuranceValue.toLocaleString("en-IN")}</p>
                </div>
                {details.codAmount && (
                  <div>
                    <p className="text-[10px] text-muted-foreground">COD Amount</p>
                    <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 text-number">
                      ₹{details.codAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-muted-foreground">Service Type</p>
                  <p className="text-sm font-medium">{details.serviceType}</p>
                </div>
              </div>
              {details.specialInstructions && (
                <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-3 py-2 mt-2">
                  <p className="text-[10px] text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Special Instructions
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                    {details.specialInstructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Sender / Receiver */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border p-3 space-y-1.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                Sender
              </p>
              <p className="text-xs font-medium">{details.sender.name}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Phone className="h-2.5 w-2.5" /> {details.sender.phone}
              </p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Mail className="h-2.5 w-2.5" /> {details.sender.email}
              </p>
            </div>
            <div className="rounded-lg border p-3 space-y-1.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                Receiver
              </p>
              <p className="text-xs font-medium">{details.receiver.name}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Phone className="h-2.5 w-2.5" /> {details.receiver.phone}
              </p>
              <p className="text-[10px] text-muted-foreground">{details.receiver.address}</p>
            </div>
          </div>

          {/* Driver / Vehicle */}
          {!isDelivered && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" />
                  Driver & Vehicle
                </h3>
                <div className="rounded-lg border p-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Driver</p>
                    <p className="text-sm font-medium">{details.driver.name}</p>
                    <p className="text-[10px] text-muted-foreground">{details.driver.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Vehicle</p>
                    <p className="text-sm font-mono font-medium text-number">{details.driver.vehicle}</p>
                    <p className="text-[10px] text-muted-foreground">Lic: {details.driver.license}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Tracking Timeline */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <LocateFixed className="h-3.5 w-3.5" />
              Tracking Timeline
            </h3>
            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-[10px] top-2 bottom-2 w-px bg-border" />
              {details.events.map((ev, i) => (
                <div
                  key={i}
                  className="relative pb-3 movement-row-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className={cn(
                    "absolute -left-[18px] top-1 h-3 w-3 rounded-full border-2",
                    ev.completed
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-background border-muted-foreground/40"
                  )} />
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium">{ev.status}</p>
                      <p className="text-[10px] text-muted-foreground">{ev.description}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">{ev.location}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground text-number shrink-0">
                      {ev.timestamp}
                    </span>
                  </div>
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
            onClick={() => onExport?.(item)}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button
            size="sm"
            className={cn(
              "flex-1 gap-1.5",
              isDelayed && "bg-red-600 hover:bg-red-700 text-white reorder-urgent"
            )}
            onClick={() => onTrack?.(item)}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {isDelayed ? "Escalate" : "Track Live"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
