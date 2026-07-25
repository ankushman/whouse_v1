import { Server } from "socket.io"

const io = new Server(3004, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

const WAREHOUSES = [
  "Chennai Distribution Hub",
  "Pune Regional Warehouse",
  "Gurugram North Hub",
  "Kolkata East Depot",
  "Sanand Gujarat Facility",
  "Hosur Manufacturing Support",
]

const SHIPMENT_EVENTS = [
  { title: "Shipment Dispatched", message: "Outbound shipment dispatched to customer", severity: "info" as const },
  { title: "GRN Completed", message: "Goods Receipt Note completed for incoming shipment", severity: "info" as const },
  { title: "Shipment Delayed", message: "Shipment delayed due to logistics issue", severity: "warning" as const },
  { title: "Vehicle Arrived", message: "Transport vehicle arrived at dock", severity: "info" as const },
  { title: "High Priority Shipment", message: "Urgent shipment flagged for priority processing", severity: "warning" as const },
]

const INVENTORY_EVENTS = [
  { title: "Stock Below Minimum", message: "Item quantity has fallen below minimum stock level", severity: "warning" as const },
  { title: "Cycle Count Variance", message: "Physical count variance detected during cycle count", severity: "warning" as const },
  { title: "Stock-Out Alert", message: "Critical item is now out of stock", severity: "critical" as const },
  { title: "Stock Replenished", message: "Replenishment shipment received and put away", severity: "info" as const },
]

const EQUIPMENT_EVENTS = [
  { title: "Forklift Maintenance Due", message: "Scheduled maintenance overdue for forklift", severity: "warning" as const },
  { title: "Equipment Offline", message: "Equipment has gone offline unexpectedly", severity: "critical" as const },
  { title: "Battery Low", message: "Forklift battery level below 20%", severity: "warning" as const },
  { title: "Equipment Back Online", message: "Equipment has been repaired and is back online", severity: "info" as const },
]

const SLA_EVENTS = [
  { title: "SLA Breach Imminent", message: "Delivery SLA deadline approaching within 2 hours", severity: "warning" as const },
  { title: "SLA Breached", message: "Delivery SLA has been breached", severity: "critical" as const },
  { title: "SLA Met", message: "Delivery completed within SLA target", severity: "info" as const },
  { title: "Dock-to-Stock SLA Warning", message: "Dock-to-stock time exceeding target threshold", severity: "warning" as const },
]

const DOCK_EVENTS = [
  { title: "Dock Assigned", message: "Dock bay assigned for incoming vehicle", severity: "info" as const },
  { title: "Dock Congestion", message: "All dock bays occupied, vehicle queued", severity: "warning" as const },
  { title: "Dock Freed", message: "Dock bay released after completion", severity: "info" as const },
]

const ALERT_EVENTS = [
  { title: "Temperature Alert", message: "Cold storage temperature deviation detected", severity: "critical" as const },
  { title: "Security Alert", message: "Unauthorized access attempt detected at gate", severity: "critical" as const },
  { title: "Fire Alarm", message: "Fire alarm triggered in warehouse zone", severity: "critical" as const },
  { title: "Power Backup Active", message: "Warehouse running on backup power", severity: "warning" as const },
]

type EventType = "shipment" | "inventory" | "equipment" | "sla" | "dock" | "alert"

const EVENT_POOLS: Record<EventType, typeof SHIPMENT_EVENTS> = {
  shipment: SHIPMENT_EVENTS,
  inventory: INVENTORY_EVENTS,
  equipment: EQUIPMENT_EVENTS,
  sla: SLA_EVENTS,
  dock: DOCK_EVENTS,
  alert: ALERT_EVENTS,
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateEvent() {
  const type = randomItem(Object.keys(EVENT_POOLS)) as EventType
  const pool = EVENT_POOLS[type]
  const eventTemplate = randomItem(pool)
  const warehouse = randomItem(WAREHOUSES)

  const event = {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    severity: eventTemplate.severity,
    warehouse,
    title: eventTemplate.title,
    message: eventTemplate.message,
    timestamp: new Date().toISOString(),
  }

  // Add type-specific metadata
  if (type === "shipment") {
    ;(event as any).data = {
      invoice: `INV-${Math.floor(Math.random() * 90000 + 10000)}`,
      vehicle: `TN-${Math.floor(Math.random() * 90 + 10)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 9000 + 1000)}`,
    }
  } else if (type === "inventory") {
    ;(event as any).data = {
      sku: `SKU-${Math.floor(Math.random() * 9000 + 1000)}`,
      currentQty: Math.floor(Math.random() * 50),
      minStock: Math.floor(Math.random() * 100 + 50),
    }
  } else if (type === "equipment") {
    ;(event as any).data = {
      equipmentId: `FL-${Math.floor(Math.random() * 20 + 1).toString().padStart(3, "0")}`,
      batteryLevel: Math.floor(Math.random() * 20),
    }
  }

  return event
}

function getRandomDelay() {
  return Math.floor(Math.random() * 5000 + 3000) // 3-8 seconds
}

console.log("[AutoFlow Realtime] WebSocket server starting on port 3004...")

io.on("connection", (socket) => {
  console.log(`[AutoFlow Realtime] Client connected: ${socket.id}`)
  
  // Send initial connection confirmation
  socket.emit("connected", { 
    message: "AutoFlow Realtime Service",
    timestamp: new Date().toISOString(),
  })

  socket.on("disconnect", (reason) => {
    console.log(`[AutoFlow Realtime] Client disconnected: ${socket.id} (${reason})`)
  })

  socket.on("ping", () => {
    socket.emit("pong", { timestamp: new Date().toISOString() })
  })
})

// Broadcast events at random intervals
function scheduleNextEvent() {
  const delay = getRandomDelay()
  setTimeout(() => {
    const event = generateEvent()
    const clientCount = io.engine.clientsCount
    console.log(`[AutoFlow Realtime] Broadcasting: ${event.title} @ ${event.warehouse} (${clientCount} clients)`)
    io.emit("warehouse-event", event)
    scheduleNextEvent()
  }, delay)
}

scheduleNextEvent()

console.log("[AutoFlow Realtime] Event broadcasting started (3-8 second intervals)")
