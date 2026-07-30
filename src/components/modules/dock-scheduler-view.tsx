"use client"

import { useState, useMemo, useRef, useCallback, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Clock,
  Truck,
  PackageCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Timer,
  MapPin,
  User,
  Wrench,
  X,
  RotateCcw,
  Play,
  Pause,
  Building2,
  FastForward,
  GripVertical,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ExportButton, exportToCSV } from "@/components/shared/export-button"
import { useToast } from "@/hooks/use-toast-helper"
import { DockDetailDrawer, type DockDetail, type DockAssignmentDetail } from "@/components/shared/dock-detail-drawer"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// ── Types ──────────────────────────────────────────────────────────────────

type DockStatus = "available" | "occupied" | "maintenance" | "reserved"
type ShipmentType = "inbound" | "outbound"

interface QueuedVehicle {
  id: string
  reg: string
  driver: string
  type: ShipmentType
  supplier: string
  waitTime: number
}

interface DockAssignment {
  id: string
  dockId: string
  vehicleReg: string
  driverName: string
  type: ShipmentType
  supplier: string
  status: "unloading" | "loading" | "inspection" | "waiting" | "completed"
  startTime: string
  estimatedDuration: number
  progress: number
  warehouse: string
  priority: "normal" | "high" | "urgent"
}

interface Dock {
  id: string
  name: string
  type: "inbound" | "outbound" | "flex"
  status: DockStatus
  zone: string
  capacity: number
}

// ── Initial Mock Data ─────────────────────────────────────────────────────

const INITIAL_DOCKS: Dock[] = [
  { id: "D1", name: "Dock 1", type: "inbound", status: "occupied", zone: "A", capacity: 20 },
  { id: "D2", name: "Dock 2", type: "inbound", status: "occupied", zone: "A", capacity: 20 },
  { id: "D3", name: "Dock 3", type: "inbound", status: "available", zone: "A", capacity: 15 },
  { id: "D4", name: "Dock 4", type: "outbound", status: "occupied", zone: "B", capacity: 20 },
  { id: "D5", name: "Dock 5", type: "outbound", status: "occupied", zone: "B", capacity: 20 },
  { id: "D6", name: "Dock 6", type: "outbound", status: "maintenance", zone: "B", capacity: 15 },
  { id: "D7", name: "Dock 7", type: "flex", status: "reserved", zone: "C", capacity: 25 },
  { id: "D8", name: "Dock 8", type: "flex", status: "available", zone: "C", capacity: 25 },
  { id: "D9", name: "Dock 9", type: "inbound", status: "available", zone: "A", capacity: 15 },
  { id: "D10", name: "Dock 10", type: "outbound", status: "occupied", zone: "B", capacity: 20 },
]

const INITIAL_ASSIGNMENTS: DockAssignment[] = [
  { id: "ASN-001", dockId: "D1", vehicleReg: "TN-09-AB-1234", driverName: "Ramesh Kumar", type: "inbound", supplier: "Bharat Forge Ltd", status: "unloading", startTime: "09:15 AM", estimatedDuration: 120, progress: 65, warehouse: "Chennai Distribution Hub", priority: "high" },
  { id: "ASN-002", dockId: "D2", vehicleReg: "MH-12-CD-5678", driverName: "Suresh Patil", type: "inbound", supplier: "Tata Steel Components", status: "inspection", startTime: "10:30 AM", estimatedDuration: 90, progress: 80, warehouse: "Chennai Distribution Hub", priority: "normal" },
  { id: "ASN-003", dockId: "D4", vehicleReg: "TN-04-EF-9012", driverName: "Arun Murugan", type: "outbound", supplier: "Maruti Suzuki Dealer", status: "loading", startTime: "08:45 AM", estimatedDuration: 60, progress: 45, warehouse: "Chennai Distribution Hub", priority: "urgent" },
  { id: "ASN-004", dockId: "D5", vehicleReg: "KA-01-GH-3456", driverName: "Venkat Rao", type: "outbound", supplier: "Hyundai Motors Ltd", status: "loading", startTime: "11:00 AM", estimatedDuration: 75, progress: 30, warehouse: "Chennai Distribution Hub", priority: "high" },
  { id: "ASN-005", dockId: "D7", vehicleReg: "GJ-05-IJ-7890", driverName: "Rajesh Patel", type: "inbound", supplier: "Motherson Sumi Systems", status: "waiting", startTime: "12:00 PM", estimatedDuration: 100, progress: 0, warehouse: "Chennai Distribution Hub", priority: "normal" },
  { id: "ASN-006", dockId: "D10", vehicleReg: "TN-09-KL-2345", driverName: "Karthik Devan", type: "outbound", supplier: "TVS Group", status: "loading", startTime: "07:30 AM", estimatedDuration: 45, progress: 90, warehouse: "Chennai Distribution Hub", priority: "normal" },
]

const INITIAL_QUEUED_VEHICLES: QueuedVehicle[] = [
  { id: "Q-001", reg: "HR-26-MN-6789", driver: "Vikram Singh", type: "inbound" as ShipmentType, supplier: "Hero MotoCorp", waitTime: 25 },
  { id: "Q-002", reg: "PB-11-OP-1234", driver: "Harpreet Kaur", type: "outbound" as ShipmentType, supplier: "Mahindra Dealers", waitTime: 15 },
  { id: "Q-003", reg: "TN-09-QR-5678", driver: "Dinesh Babu", type: "inbound" as ShipmentType, supplier: "Ashok Leyland", waitTime: 40 },
]

// ── Helpers ──────────────────────────────────────────────────────────────

const dockStatusColors: Record<DockStatus, string> = {
  available: "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20",
  occupied: "border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20",
  maintenance: "border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20",
  reserved: "border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20",
}

const dockStatusBadge: Record<DockStatus, { label: string; variant: "green" | "blue" | "red" | "amber" }> = {
  available: { label: "Available", variant: "green" },
  occupied: { label: "Occupied", variant: "blue" },
  maintenance: { label: "Maintenance", variant: "red" },
  reserved: { label: "Reserved", variant: "amber" },
}

const shipmentStatusIcons: Record<string, typeof Clock> = {
  unloading: ArrowDownToLine,
  loading: ArrowUpFromLine,
  inspection: PackageCheck,
  waiting: Timer,
  completed: CheckCircle2,
}

const priorityColors: Record<string, string> = {
  normal: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

function formatTime(start: string, duration: number, progress: number): string {
  const elapsed = Math.round(duration * (progress / 100))
  const remaining = duration - elapsed
  if (remaining <= 0) return "Completing..."
  if (remaining < 15) return `${remaining} min left`
  return `${Math.floor(remaining / 60)}h ${remaining % 60}m left`
}

// ── Components ─────────────────────────────────────────────────────────────

function DockCard({
  dock,
  assignment,
  onComplete,
  onAdvanceProgress,
  onAssignVehicleClick,
  onOpenDrawer,
}: {
  dock: Dock
  assignment?: DockAssignment
  onComplete: (id: string) => void
  onAdvanceProgress: (id: string, amount: number) => void
  onAssignVehicleClick: (dock: Dock) => void
  onOpenDrawer: (dock: Dock, assignment?: DockAssignment) => void
}) {
  const progress = assignment?.progress ?? 0

  const handleComplete = () => {
    if (!assignment) return
    // Toast is shown by parent's handleComplete — no toast here to avoid double-toast
    // (and `toastRef` is not in scope for this sibling component).
    onComplete(assignment.id)
  }

  return (
    <Card className={cn(
      "card-shine relative rounded-xl border-2 transition-all duration-200 overflow-hidden",
      dockStatusColors[dock.status],
      dock.status === "available" && "hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-600"
    )}>
      <CardHeader className="pb-2 pt-3 px-3">
        <button
          type="button"
          onClick={() => onOpenDrawer(dock, assignment)}
          className="flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          aria-label={`Open details for ${dock.name}`}
        >
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm",
              dock.type === "inbound" && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
              dock.type === "outbound" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
              dock.type === "flex" && "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
            )}>
              {dock.id}
            </div>
            <div>
              <p className="text-xs font-semibold">{dock.name}</p>
              <p className="text-[10px] text-muted-foreground">Zone {dock.zone} · <span className="text-number">{dock.capacity}</span> tons</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <StatusBadge status={dockStatusBadge[dock.status].label} variant={dockStatusBadge[dock.status].variant} />
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-foreground transition-colors" />
          </div>
        </button>
      </CardHeader>

      <CardContent className="inner-glow glass-subtle px-3 pb-3">
        {assignment && dock.status === "occupied" ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5">
              {assignment.type === "inbound" ? (
                <ArrowDownToLine className="h-3 w-3 text-blue-500" />
              ) : (
                <ArrowUpFromLine className="h-3 w-3 text-emerald-500" />
              )}
              <Badge variant="outline" className="badge-interactive text-[9px] px-1.5">
                {assignment.type === "inbound" ? "IN" : "OUT"}
              </Badge>
              <Badge className={cn("text-[9px] px-1.5", priorityColors[assignment.priority])}>
                {assignment.priority}
              </Badge>
            </div>

            {/* Vehicle Info */}
            <div className="rounded-lg bg-background/80 p-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono font-medium">{assignment.vehicleReg}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <User className="h-2.5 w-2.5" />
                  {assignment.driverName.split(" ")[0]}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{assignment.supplier}</p>
            </div>

            {/* Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1">
                  {(() => {
                    const Icon = shipmentStatusIcons[assignment.status] || Clock
                    return <Icon className="h-2.5 w-2.5 text-muted-foreground" />
                  })()}
                  <span className="capitalize text-muted-foreground">{assignment.status}</span>
                </div>
                <span className="font-medium text-number">{formatTime(assignment.startTime, assignment.estimatedDuration, progress)}</span>
              </div>
              <Progress value={progress} className={cn(
                "h-1.5 progress-bar-animated",
                progress < 30 && "progress-gradient",
                progress >= 30 && progress < 70 && "[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-emerald-500",
                progress >= 70 && progress < 90 && "progress-gradient-amber",
                progress >= 90 && "progress-gradient-red"
              )} />
              <p className="text-right text-[9px] text-number text-muted-foreground"><span className="text-number">{progress}</span>%</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 pt-1">
              {progress < 100 && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 flex-1 text-[9px] gap-1"
                    onClick={() => onAdvanceProgress(assignment.id, 15)}
                  >
                    <Play className="h-2.5 w-2.5" /> Advance
                  </Button>
                  <Button
                    size="sm"
                    className="h-6 flex-1 text-[9px] gap-1"
                    onClick={handleComplete}
                  >
                    <CheckCircle2 className="h-2.5 w-2.5" /> Complete
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : assignment && dock.status === "reserved" ? (
          <div className="space-y-2">
            <div className="rounded-lg bg-background/80 p-2">
              <div className="flex items-center gap-1.5">
                <Timer className="h-3 w-3 text-amber-500" />
                <p className="text-[10px] font-mono font-medium">{assignment.vehicleReg}</p>
              </div>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">{assignment.supplier}</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-2.5 w-2.5" />
              Arriving at {assignment.startTime}
            </div>
            <Button size="sm" variant="outline" className="press-scale btn-outline-animate w-full h-6 text-[9px] gap-1">
              <X className="h-2.5 w-2.5" /> Cancel Reservation
            </Button>
          </div>
        ) : dock.status === "maintenance" ? (
          <div className="flex flex-col items-center gap-1.5 py-3 text-center">
            <Wrench className="h-5 w-5 text-red-400" />
            <p className="text-[10px] font-medium text-red-600 dark:text-red-400">Under Maintenance</p>
            <p className="text-[9px] text-muted-foreground">Estimated repair: 2h</p>
            <Button size="sm" variant="outline" className="press-scale btn-outline-animate h-6 text-[9px] gap-1 mt-1">
              <RotateCcw className="h-2.5 w-2.5" /> Mark Available
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-3 text-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Ready</p>
            <p className="text-[9px] text-muted-foreground">Available for assignment</p>
            <Button
              size="sm"
              className="h-6 text-[9px] gap-1 mt-1"
              onClick={() => onAssignVehicleClick(dock)}
            >
              <Truck className="h-2.5 w-2.5" /> Assign Vehicle
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Sortable Queued Vehicle (dnd-kit) ─────────────────────────────────────

interface SortableQueuedVehicleProps {
  vehicle: QueuedVehicle
  availableDocks: Dock[]
  vehicleDockDropdown: Record<string, string>
  onDockSelect: (vehicleId: string, dockId: string) => void
  isOverlay?: boolean
}

function SortableQueuedVehicle({
  vehicle,
  availableDocks,
  vehicleDockDropdown,
  onDockSelect,
  isOverlay,
}: SortableQueuedVehicleProps) {
  const sortable = useSortable({
    id: vehicle.id,
    disabled: isOverlay,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  }

  return (
    <div
      // eslint-disable-next-line react-hooks/refs -- dnd-kit's setNodeRef is a stable callback ref, not a value ref; safe to spread during render.
      ref={sortable.setNodeRef}
      style={style}
      className={cn(
        "ripple-effect flex items-center justify-between rounded-lg border border-amber-200 dark:border-amber-800 bg-background/80 p-3",
        isOverlay ? "shadow-xl rotate-1 ring-2 ring-amber-400/40 dock-queue-drag-overlay" : "",
        // eslint-disable-next-line react-hooks/refs -- dnd-kit's isDragging is a render-time derived boolean, not a ref value.
        !isOverlay && sortable.isDragging && "opacity-50 dock-queue-row-dragging",
        !isOverlay && "dock-queue-row-enter"
      )}
      // eslint-disable-next-line react-hooks/refs -- dnd-kit's attributes/listeners are stable objects, not ref values.
      {...sortable.attributes}
      // eslint-disable-next-line react-hooks/refs -- dnd-kit's listeners object is stable across renders.
      {...sortable.listeners}
    >
      <div className="flex items-center gap-3">
        <GripVertical className={cn(
          "h-4 w-4 shrink-0",
          isOverlay ? "text-amber-500" : "text-muted-foreground/40 cursor-grab active:cursor-grabbing"
        )} />
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          vehicle.type === "inbound"
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
        )}>
          {vehicle.type === "inbound" ? (
            <ArrowDownToLine className="h-4 w-4" />
          ) : (
            <ArrowUpFromLine className="h-4 w-4" />
          )}
        </div>
        <div>
          <p className="text-xs font-medium">{vehicle.reg}</p>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5"><User className="h-2.5 w-2.5" />{vehicle.driver}</span>
            <span>·</span>
            <span>{vehicle.supplier}</span>
          </div>
        </div>
      </div>
      {!isOverlay && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="badge-interactive text-[9px] gap-1">
            <Clock className="h-2.5 w-2.5" />
            <span className="text-number">{vehicle.waitTime}</span>m
          </Badge>
          {availableDocks.length > 0 ? (
            <Select
              value={vehicleDockDropdown[vehicle.id] ?? ""}
              onValueChange={(dockId) => {
                if (dockId === "__assign__") return
                onDockSelect(vehicle.id, dockId)
              }}
            >
              <SelectTrigger
                className="w-auto h-6 text-[9px] gap-1 px-2"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Zap className="h-2.5 w-2.5" />
                <SelectValue placeholder="Assign" />
              </SelectTrigger>
              <SelectContent>
                {availableDocks.map((dock) => (
                  <SelectItem key={dock.id} value={dock.id} className="text-xs">
                    {dock.name} (Zone {dock.zone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Button size="sm" variant="outline" className="press-scale btn-outline-animate h-6 text-[9px] gap-1" disabled>
              No docks
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Droppable Dock Card wrapper ────────────────────────────────────────────
// Wraps an available DockCard with a drop zone that highlights when a queued
// vehicle is dragged over it.

interface DroppableDockWrapperProps {
  dock: Dock
  isDropTarget: boolean
  children: React.ReactNode
}

function DroppableDockWrapper({ dock, isDropTarget, children }: DroppableDockWrapperProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `dock-drop-${dock.id}`,
    data: { type: "dock", dockId: dock.id },
    disabled: dock.status !== "available",
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative transition-all duration-150",
        isOver && dock.status === "available" && "dock-drop-active scale-[1.02] -translate-y-0.5",
        isDropTarget && "dock-drop-pulse"
      )}
    >
      {children}
      {isOver && dock.status === "available" && (
        <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-dashed border-emerald-500 bg-emerald-500/10 flex items-center justify-center dock-drop-overlay">
          <div className="rounded-full bg-emerald-600 text-white text-xs px-3 py-1.5 font-semibold shadow-lg flex items-center gap-1.5">
            <ArrowDownToLine className="size-3.5" />
            Drop to assign
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

export function DockSchedulerView() {
  const toastResult = useToast()
  const toastRef = useRef(toastResult)
  useEffect(() => { toastRef.current = toastResult })
  const [docks, setDocks] = useState<Dock[]>(INITIAL_DOCKS)
  const [assignments, setAssignments] = useState<DockAssignment[]>(INITIAL_ASSIGNMENTS)
  // Ref mirror of assignments so callbacks (handleComplete etc.) can read latest
  // without being in their dependency arrays (avoids recreating callbacks on every change).
  const assignmentsRef = useRef(assignments)
  useEffect(() => { assignmentsRef.current = assignments })
  const [queuedVehicles, setQueuedVehicles] = useState<QueuedVehicle[]>(INITIAL_QUEUED_VEHICLES)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const completedIdsRef = useRef(completedIds)
  useEffect(() => { completedIdsRef.current = completedIds })
  const docksRef = useRef(docks)
  useEffect(() => { docksRef.current = docks })
  const [zoneFilter, setZoneFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Dialog state for assigning vehicle to a dock
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [assigningDock, setAssigningDock] = useState<Dock | null>(null)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("")

  // Dropdown state for assigning a queued vehicle to a dock
  const [vehicleDockDropdown, setVehicleDockDropdown] = useState<Record<string, string>>({})

  // Simulate progress state
  const [simulating, setSimulating] = useState(false)
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // DnD state for drag-and-drop queue → dock assignment
  const [activeDragVehicle, setActiveDragVehicle] = useState<QueuedVehicle | null>(null)

  // Detail drawer state
  const [drawerDock, setDrawerDock] = useState<DockDetail | null>(null)
  const [drawerAssignment, setDrawerAssignment] = useState<DockAssignmentDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openDockDrawer = useCallback((dock: Dock, assignment?: DockAssignment) => {
    setDrawerDock({
      id: dock.id,
      name: dock.name,
      type: dock.type,
      status: dock.status,
      zone: dock.zone,
      capacity: dock.capacity,
    })
    if (assignment) {
      setDrawerAssignment({
        id: assignment.id,
        dockId: assignment.dockId,
        vehicleReg: assignment.vehicleReg,
        driverName: assignment.driverName,
        type: assignment.type,
        supplier: assignment.supplier,
        status: assignment.status,
        startTime: assignment.startTime,
        estimatedDuration: assignment.estimatedDuration,
        progress: assignment.progress,
        warehouse: assignment.warehouse,
        priority: assignment.priority,
      })
    } else {
      setDrawerAssignment(null)
    }
    setDrawerOpen(true)
  }, [])

  const dndSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // handleDragStart + handleDragEnd are declared AFTER handleAssignVehicleFromQueue
  // because they reference it (cannot reference before declaration — see react-hooks/immutability).

  const filteredDocks = useMemo(() => {
    return docks.filter((d) => {
      if (zoneFilter !== "all" && d.zone !== zoneFilter) return false
      if (typeFilter !== "all" && d.type !== typeFilter) return false
      return true
    })
  }, [docks, zoneFilter, typeFilter])

  const availableDocks = useMemo(
    () => docks.filter((d) => d.status === "available"),
    [docks]
  )

  const summary = useMemo(() => ({
    total: docks.length,
    available: docks.filter((d) => d.status === "available").length,
    occupied: docks.filter((d) => d.status === "occupied").length,
    maintenance: docks.filter((d) => d.status === "maintenance").length,
    reserved: docks.filter((d) => d.status === "reserved").length,
    utilization: Math.round(
      (docks.filter((d) => d.status === "occupied").length / docks.length) * 100
    ),
  }), [docks])

  const handleComplete = useCallback((assignmentId: string) => {
    setCompletedIds((prev) => new Set(prev).add(assignmentId))
    // Also free up the dock (mirror auto-complete path)
    const assignment = assignmentsRef.current.find((a) => a.id === assignmentId)
    if (assignment) {
      setDocks((prev) =>
        prev.map((d) =>
          d.id === assignment.dockId ? { ...d, status: "available" as const } : d
        )
      )
      toastRef.current.success(
        "Dock assignment completed",
        `${assignment.vehicleReg} — dock freed for next assignment`
      )
    } else {
      toastRef.current.success("Dock assignment completed")
    }
  }, [])

  const handleAdvanceProgress = useCallback((assignmentId: string, amount: number) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, progress: Math.min(100, a.progress + amount) } : a))
    )
  }, [])

  // Assign vehicle to dock (from dock card button)
  const handleAssignVehicleToDock = useCallback(() => {
    if (!assigningDock || !selectedVehicleId) return

    const vehicle = queuedVehicles.find((v) => v.id === selectedVehicleId)
    if (!vehicle) return

    const now = new Date()
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

    const newAssignment: DockAssignment = {
      id: `ASN-${Date.now()}`,
      dockId: assigningDock.id,
      vehicleReg: vehicle.reg,
      driverName: vehicle.driver,
      type: vehicle.type,
      supplier: vehicle.supplier,
      status: vehicle.type === "inbound" ? "unloading" : "loading",
      startTime: timeStr,
      estimatedDuration: 60 + Math.floor(Math.random() * 60),
      progress: 0,
      warehouse: "Chennai Distribution Hub",
      priority: vehicle.waitTime > 30 ? "high" : "normal",
    }

    // Update dock status
    setDocks((prev) =>
      prev.map((d) => (d.id === assigningDock.id ? { ...d, status: "occupied" as DockStatus } : d))
    )
    // Add assignment
    setAssignments((prev) => [...prev, newAssignment])
    // Remove from queue
    setQueuedVehicles((prev) => prev.filter((v) => v.id !== selectedVehicleId))

    toastRef.current.success("Vehicle Assigned", `${vehicle.reg} → ${assigningDock.name} (${vehicle.supplier})`)

    setAssignDialogOpen(false)
    setAssigningDock(null)
    setSelectedVehicleId("")
  }, [assigningDock, selectedVehicleId, queuedVehicles])

  // Assign queued vehicle to available dock (from queue row)
  const handleAssignVehicleFromQueue = useCallback(
    (vehicleId: string, dockId: string) => {
      const vehicle = queuedVehicles.find((v) => v.id === vehicleId)
      const dock = docks.find((d) => d.id === dockId)
      if (!vehicle || !dock) return

      const now = new Date()
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

      const newAssignment: DockAssignment = {
        id: `ASN-${Date.now()}`,
        dockId: dock.id,
        vehicleReg: vehicle.reg,
        driverName: vehicle.driver,
        type: vehicle.type,
        supplier: vehicle.supplier,
        status: vehicle.type === "inbound" ? "unloading" : "loading",
        startTime: timeStr,
        estimatedDuration: 60 + Math.floor(Math.random() * 60),
        progress: 0,
        warehouse: "Chennai Distribution Hub",
        priority: vehicle.waitTime > 30 ? "high" : "normal",
      }

      setDocks((prev) =>
        prev.map((d) => (d.id === dockId ? { ...d, status: "occupied" as DockStatus } : d))
      )
      setAssignments((prev) => [...prev, newAssignment])
      setQueuedVehicles((prev) => prev.filter((v) => v.id !== vehicleId))
      setVehicleDockDropdown((prev) => {
        const next = { ...prev }
        delete next[vehicleId]
        return next
      })

      toastRef.current.success("Vehicle Assigned", `${vehicle.reg} → ${dock.name} (${vehicle.supplier})`)
    },
    [queuedVehicles, docks]
  )

  // DnD handlers — declared after handleAssignVehicleFromQueue to satisfy TDZ.
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const vehicle = queuedVehicles.find((v) => v.id === event.active.id)
    setActiveDragVehicle(vehicle ?? null)
  }, [queuedVehicles])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveDragVehicle(null)

    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    // Drop onto a dock?
    if (overId.startsWith("dock-drop-")) {
      const dockId = overId.replace("dock-drop-", "")
      const dock = docks.find((d) => d.id === dockId)
      if (dock && dock.status === "available") {
        handleAssignVehicleFromQueue(activeId, dockId)
        return
      }
    }

    // Otherwise: re-order within queue
    if (active.id !== over.id) {
      setQueuedVehicles((prev) => {
        const oldIdx = prev.findIndex((v) => v.id === activeId)
        const newIdx = prev.findIndex((v) => v.id === overId)
        if (oldIdx === -1 || newIdx === -1) return prev
        return arrayMove(prev, oldIdx, newIdx)
      })
      toastRef.current.info("Queue Reordered", "Vehicle priority updated in waiting queue")
    }
  }, [docks, handleAssignVehicleFromQueue])

  // Open dialog for dock assignment
  const openAssignDialog = useCallback((dock: Dock) => {
    setAssigningDock(dock)
    setSelectedVehicleId("")
    setAssignDialogOpen(true)
  }, [])

  // Simulate progress — auto-advance active assignments by 5% every 3 seconds.
  // Uses refs for completedIds/docks so the interval doesn't tear down on every state change.
  // Side-effects (toast, setCompletedIds, setDocks) are fired via setTimeout(0) OUTSIDE
  // the setAssignments updater — updaters must be pure (StrictMode double-invokes them).
  useEffect(() => {
    if (!simulating) {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current)
        simIntervalRef.current = null
      }
      return
    }
    simIntervalRef.current = setInterval(() => {
      const justCompleted: DockAssignment[] = []
      setAssignments((prev) => {
        const updated = prev.map((a) => {
          if (completedIdsRef.current.has(a.id)) return a
          if (a.progress >= 100) return a
          const newProgress = Math.min(100, a.progress + 5)
          if (newProgress >= 100) {
            justCompleted.push(a)
          }
          return { ...a, progress: newProgress }
        })
        return updated
      })
      // Fire side-effects outside the updater
      if (justCompleted.length > 0) {
        setTimeout(() => {
          justCompleted.forEach((a) => {
            const dockName = docksRef.current.find((d) => d.id === a.dockId)?.name ?? a.dockId
            toastRef.current.success("Assignment Auto-Completed", `${a.vehicleReg} at ${dockName}`)
            setCompletedIds((c) => new Set(c).add(a.id))
            setDocks((dd) =>
              dd.map((d) => (d.id === a.dockId ? { ...d, status: "available" as DockStatus } : d))
            )
          })
        }, 0)
      }
    }, 3000)
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current)
    }
  }, [simulating])

  const toggleSimulation = useCallback(() => {
    setSimulating((prev) => !prev)
    if (!simulating) {
      toastRef.current.info("Simulation Started", "Progress will advance 5% every 3 seconds", { duration: 3000 })
    } else {
      toastRef.current.info("Simulation Stopped", "Simulation has been stopped", { duration: 2000 })
    }
  }, [simulating])

  const activeAssignments = assignments.filter((a) => !completedIds.has(a.id))
  const docksWithAssignments = filteredDocks.map((dock) => ({
    dock,
    assignment: activeAssignments.find((a) => a.dockId === dock.id),
  }))

  const handleExportCSV = useCallback(() => {
    const data = docksWithAssignments.map(({ dock: d, assignment: a }) => ({
      Dock: d.name,
      Zone: d.zone,
      Status: d.status.charAt(0).toUpperCase() + d.status.slice(1),
      "Loading Type": d.type.charAt(0).toUpperCase() + d.type.slice(1),
      "Current Vehicle": a?.vehicleReg || "—",
      Driver: a?.driverName || "—",
      "Shipment Type": a?.type || "—",
      Supplier: a?.supplier || "—",
      Progress: a ? `${a.progress}%` : "—",
    }))
    exportToCSV(data, "dock-scheduler", ["Dock", "Zone", "Status", "Loading Type", "Current Vehicle", "Driver", "Shipment Type", "Supplier", "Progress"])
  }, [docksWithAssignments])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dock Scheduling"
        description="Manage dock bay assignments and vehicle scheduling"
        actions={
          <div className="flex items-center gap-2">
            <ExportButton onExportCSV={handleExportCSV} />
            <Button
              size="sm"
              variant={simulating ? "default" : "outline"}
              className={cn("gap-1.5", simulating && "bg-amber-600 hover:bg-amber-700 text-white")}
              onClick={toggleSimulation}
            >
              {simulating ? (
                <>
                  <Pause className="h-3.5 w-3.5" /> Stop Simulate
                </>
              ) : (
                <>
                  <FastForward className="h-3.5 w-3.5" /> Simulate Progress
                </>
              )}
            </Button>
            <Button size="sm" className="press-scale gap-1.5" onClick={() => toastRef.current.info("Refreshing dock status...", "Fetching latest dock information", { duration: 2000 })}>
              <Zap className="h-3.5 w-3.5" /> Refresh Status
            </Button>
          </div>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6 stagger-children">
        {[
          { label: "Total Docks", value: summary.total, icon: Building2, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
          { label: "Available", value: summary.available, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
          { label: "Occupied", value: summary.occupied, icon: Truck, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
          { label: "Maintenance", value: summary.maintenance, icon: Wrench, color: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400" },
          { label: "Reserved", value: summary.reserved, icon: Timer, color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
          { label: "Utilization", value: `${summary.utilization}%`, icon: Zap, color: summary.utilization > 80 ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400" : summary.utilization > 60 ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
        ].map((item) => (
          <Card key={item.label} className="hover-lift-sm card-depth rounded-xl border-border/60 shadow-sm">
            <CardContent className="inner-glow glass-subtle p-3 text-center">
              <div className={cn("mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg", item.color)}>
                <item.icon className="h-3.5 w-3.5" />
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
              <p className="mt-0.5 text-lg font-bold text-number">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Utilization Bar */}
      <Card className="hover-lift-sm card-depth rounded-xl border-border/60 shadow-sm">
        <CardContent className="inner-glow glass-subtle p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold">Dock Utilization Overview</p>
            <p className={cn("text-xs font-bold text-number",
              summary.utilization > 80 ? "text-red-600 dark:text-red-400" :
              summary.utilization > 60 ? "text-amber-600 dark:text-amber-400" :
              "text-emerald-600 dark:text-emerald-400"
            )}>
              <span className="text-number">{summary.utilization}</span>%
            </p>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full">
            <div className="bg-emerald-500 transition-all" style={{ width: `${((docks.filter(d => d.status === "available").length) / docks.length) * 100}%` }} />
            <div className="bg-blue-500 transition-all" style={{ width: `${((docks.filter(d => d.status === "occupied").length) / docks.length) * 100}%` }} />
            <div className="bg-amber-500 transition-all" style={{ width: `${((docks.filter(d => d.status === "reserved").length) / docks.length) * 100}%` }} />
            <div className="bg-red-500 transition-all" style={{ width: `${((docks.filter(d => d.status === "maintenance").length) / docks.length) * 100}%` }} />
          </div>
          <div className="flex items-center gap-4 mt-2">
            {[
              { label: "Available", color: "bg-emerald-500", count: summary.available },
              { label: "Occupied", color: "bg-blue-500", count: summary.occupied },
              { label: "Reserved", color: "bg-amber-500", count: summary.reserved },
              { label: "Maintenance", color: "bg-red-500", count: summary.maintenance },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className={cn("h-2 w-2 rounded-full", item.color)} />
                <span>{item.label}</span>
                <span className="font-medium text-foreground text-number">(<span className="text-number">{item.count}</span>)</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="filter-bar flex flex-wrap items-center gap-3">
        <Select value={zoneFilter} onValueChange={setZoneFilter}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <SelectValue placeholder="Zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            <SelectItem value="A">Zone A (Inbound)</SelectItem>
            <SelectItem value="B">Zone B (Outbound)</SelectItem>
            <SelectItem value="C">Zone C (Flex)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="inbound">Inbound</SelectItem>
            <SelectItem value="outbound">Outbound</SelectItem>
            <SelectItem value="flex">Flex</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto text-xs text-muted-foreground">
          Showing <span className="text-number">{filteredDocks.length}</span> of <span className="text-number">{docks.length}</span> docks
        </div>
      </div>

      {/* Dock Board + Vehicle Queue — wrapped in DndContext for drag-and-drop */}
      <DndContext
        sensors={dndSensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Dock Board</h3>
          {simulating && (
            <Badge variant="outline" className="badge-interactive text-[10px] gap-1 border-amber-300 text-amber-600 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-950/40">
              <FastForward className="h-2.5 w-2.5 animate-pulse" />
              Simulating
            </Badge>
          )}
          {availableDocks.length > 0 && queuedVehicles.length > 0 && (
            <Badge variant="outline" className="badge-interactive ml-auto text-[10px] gap-1 border-emerald-300 text-emerald-600 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/40 dock-dnd-hint">
              <GripVertical className="h-2.5 w-2.5" />
              Drag a queue vehicle onto any <span className="font-semibold">available</span> dock
            </Badge>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 stagger-children">
          {docksWithAssignments.map(({ dock, assignment }) => (
            <DroppableDockWrapper key={dock.id} dock={dock} isDropTarget={!!activeDragVehicle}>
              <DockCard
                dock={dock}
                assignment={assignment}
                onComplete={handleComplete}
                onAdvanceProgress={handleAdvanceProgress}
                onAssignVehicleClick={openAssignDialog}
                onOpenDrawer={openDockDrawer}
              />
            </DroppableDockWrapper>
          ))}
        </div>
      </div>

      {/* Vehicle Queue — sortable */}
      {queuedVehicles.length > 0 && (
        <Card className="hover-lift-sm card-depth rounded-xl border-amber-200 bg-amber-50/30 dark:border-amber-800 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-sm font-semibold">Waiting Queue</CardTitle>
              <Badge variant="secondary" className="badge-interactive text-[10px]"><span className="text-number">{queuedVehicles.length}</span> vehicles</Badge>
              <span className="ml-auto text-[10px] text-muted-foreground hidden sm:flex items-center gap-1">
                <GripVertical className="size-3" />
                Drag to reorder or assign
              </span>
            </div>
            <CardDescription className="text-xs">Vehicles waiting for dock assignment · drag onto an available dock to assign instantly</CardDescription>
          </CardHeader>
          <CardContent>
            <SortableContext items={queuedVehicles.map(v => v.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {queuedVehicles.map((vehicle) => (
                  <SortableQueuedVehicle
                    key={vehicle.id}
                    vehicle={vehicle}
                    availableDocks={availableDocks}
                    vehicleDockDropdown={vehicleDockDropdown}
                    onDockSelect={(vehicleId, dockId) => {
                      setVehicleDockDropdown((prev) => ({ ...prev, [vehicleId]: dockId }))
                      handleAssignVehicleFromQueue(vehicleId, dockId)
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </CardContent>
        </Card>
      )}

      {/* Drag overlay — shows the vehicle card being dragged */}
      <DragOverlay>
        {activeDragVehicle ? (
          <SortableQueuedVehicle
            vehicle={activeDragVehicle}
            availableDocks={availableDocks}
            vehicleDockDropdown={vehicleDockDropdown}
            onDockSelect={() => {}}
            isOverlay
          />
        ) : null}
      </DragOverlay>
      </DndContext>

      {/* Assign Vehicle Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Assign Vehicle to {assigningDock?.name}
            </DialogTitle>
            <DialogDescription>
              Select a queued vehicle to assign to this dock. The vehicle will be removed from the waiting queue.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-thin">
            {queuedVehicles.map((vehicle) => (
              <label
                key={vehicle.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all",
                  selectedVehicleId === vehicle.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border hover:border-border/80 hover:bg-muted/50"
                )}
              >
                <input
                  type="radio"
                  name="vehicle-select"
                  value={vehicle.id}
                  checked={selectedVehicleId === vehicle.id}
                  onChange={() => setSelectedVehicleId(vehicle.id)}
                  className="sr-only"
                />
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  vehicle.type === "inbound"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                )}>
                  {vehicle.type === "inbound" ? (
                    <ArrowDownToLine className="h-4 w-4" />
                  ) : (
                    <ArrowUpFromLine className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{vehicle.reg}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{vehicle.driver}</span>
                    <span>·</span>
                    <span>{vehicle.supplier}</span>
                  </div>
                </div>
                <Badge variant="outline" className="badge-interactive text-[10px] gap-1 shrink-0">
                  <Clock className="h-2.5 w-2.5" />
                  <span className="text-number">{vehicle.waitTime}</span>m
                </Badge>
              </label>
            ))}
            {queuedVehicles.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No vehicles in queue</p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignVehicleToDock} disabled={!selectedVehicleId || queuedVehicles.length === 0}>
              <Truck className="h-3.5 w-3.5 mr-1" /> Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Drawer */}
      <DockDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        dock={drawerDock}
        assignment={drawerAssignment}
        onComplete={(assignmentId) => {
          handleComplete(assignmentId)
          setDrawerOpen(false)
        }}
        onAdvanceProgress={(assignmentId, amount) => {
          handleAdvanceProgress(assignmentId, amount)
        }}
        onMarkAvailable={(dockId) => {
          setDocks((prev) =>
            prev.map((d) => (d.id === dockId ? { ...d, status: "available" as DockStatus } : d))
          )
          setDrawerOpen(false)
        }}
      />
    </div>
  )
}
