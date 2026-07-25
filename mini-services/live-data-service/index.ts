import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()
const io = new Server(httpServer, {
  path: "/",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

const WAREHOUSES = [
  "Mumbai Hub",
  "Delhi NCR",
  "Pune Warehouse",
  "Chennai Hub",
  "Bangalore South",
  "Gurugram Hub",
]

const SEVERITIES: ("info" | "warning" | "critical" | "success")[] = [
  "info",
  "warning",
  "critical",
  "success",
]

interface WarehouseEvent {
  type: string
  title: string
  message: string
  warehouse: string
  severity: "info" | "warning" | "critical" | "success"
  timestamp: string
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomId(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

const eventGenerators: (() => WarehouseEvent)[] = [
  () => ({
    type: "inbound",
    title: "Shipment Received",
    message: `Inbound shipment INV-2024-${randomId()} received and unloading started at dock B3`,
    warehouse: randomPick(WAREHOUSES),
    severity: "success",
    timestamp: new Date().toISOString(),
  }),
  () => ({
    type: "outbound",
    title: "Shipment Dispatched",
    message: `Outbound dispatch SH-${randomId()} departed for ${randomPick(WAREHOUSES)} region`,
    warehouse: randomPick(WAREHOUSES),
    severity: "info",
    timestamp: new Date().toISOString(),
  }),
  () => ({
    type: "equipment",
    title: "Equipment Status Change",
    message: `Forklift FL-${randomId()} reported ${randomPick(["battery low", "maintenance due", "back online", "overheating warning"])}`,
    warehouse: randomPick(WAREHOUSES),
    severity: randomPick(["warning", "info", "success"]) as WarehouseEvent["severity"],
    timestamp: new Date().toISOString(),
  }),
  () => ({
    type: "inventory",
    title: "Inventory Variance Alert",
    message: `SKU-${randomId()} shows ${randomPick(["-12", "+8", "-5", "+15"])} unit variance during cycle count`,
    warehouse: randomPick(WAREHOUSES),
    severity: randomPick(["warning", "critical"]) as WarehouseEvent["severity"],
    timestamp: new Date().toISOString(),
  }),
  () => ({
    type: "sla",
    title: "SLA Breach Warning",
    message: `Dock-to-stock time exceeded 4hr threshold for order OD-${randomId()}`,
    warehouse: randomPick(WAREHOUSES),
    severity: "critical",
    timestamp: new Date().toISOString(),
  }),
  () => ({
    type: "dock",
    title: "Dock Allocation Update",
    message: `Dock ${randomPick(["A1", "B2", "C3", "D4"])} allocated to ${randomPick(["inbound", "outbound", "cross-dock"])} operations`,
    warehouse: randomPick(WAREHOUSES),
    severity: "info",
    timestamp: new Date().toISOString(),
  }),
  () => ({
    type: "shift",
    title: "Shift Change Notification",
    message: `${randomPick(["Morning", "Afternoon", "Night"])} shift handover completed — ${randomPick(["all stations staffed", "2 positions pending", "overtime approved"])}`,
    warehouse: randomPick(WAREHOUSES),
    severity: "info",
    timestamp: new Date().toISOString(),
  }),
  () => ({
    type: "delivery",
    title: "Delivery Confirmation",
    message: `Last-mile delivery confirmed for order OD-${randomId()} — POD received`,
    warehouse: randomPick(WAREHOUSES),
    severity: "success",
    timestamp: new Date().toISOString(),
  }),
  () => ({
    type: "temperature",
    title: "Temperature Alert",
    message: `Cold storage zone ${randomPick(["CS-1", "CS-2", "CS-3"])} temperature at ${randomPick(["-16.2", "-14.8", "-18.5"])}°C — ${randomPick(["within range", "approaching threshold", "below minimum"])}`,
    warehouse: randomPick(WAREHOUSES),
    severity: randomPick(["warning", "critical", "info"]) as WarehouseEvent["severity"],
    timestamp: new Date().toISOString(),
  }),
  () => ({
    type: "vehicle",
    title: "Vehicle Departure",
    message: `Vehicle VH-${randomId()} departed from dock ${randomPick(["D1", "D2", "D3"])} carrying ${randomPick([24, 32, 18, 40])} pallets`,
    warehouse: randomPick(WAREHOUSES),
    severity: "info",
    timestamp: new Date().toISOString(),
  }),
]

const clientIntervals = new Map<string, ReturnType<typeof setInterval>>()

io.on("connection", (socket) => {
  console.log(`[LiveData] Client connected: ${socket.id}`)

  // Emit an event immediately on connect
  const firstEvent = randomPick(eventGenerators)()
  socket.emit("live-event", firstEvent)
  console.log(`[LiveData] Emitted event: ${firstEvent.title} → ${firstEvent.warehouse}`)

  // Start periodic emissions every 8 seconds
  const interval = setInterval(() => {
    const event = randomPick(eventGenerators)()
    socket.emit("live-event", event)
    console.log(`[LiveData] Emitted event: ${event.title} → ${event.warehouse} (${event.severity})`)
  }, 8000)

  clientIntervals.set(socket.id, interval)

  socket.on("disconnect", (reason) => {
    console.log(`[LiveData] Client disconnected: ${socket.id} (${reason})`)
    const existingInterval = clientIntervals.get(socket.id)
    if (existingInterval) {
      clearInterval(existingInterval)
      clientIntervals.delete(socket.id)
    }
  })

  socket.on("error", (error) => {
    console.error(`[LiveData] Socket error (${socket.id}):`, error)
  })
})

const PORT = 3005
httpServer.listen(PORT, () => {
  console.log(`[LiveData] Warehouse live data service running on port ${PORT}`)
})

process.on("SIGTERM", () => {
  console.log("[LiveData] Received SIGTERM, shutting down...")
  for (const interval of clientIntervals.values()) clearInterval(interval)
  clientIntervals.clear()
  httpServer.close(() => {
    console.log("[LiveData] Server closed")
    process.exit(0)
  })
})

process.on("SIGINT", () => {
  console.log("[LiveData] Received SIGINT, shutting down...")
  for (const interval of clientIntervals.values()) clearInterval(interval)
  clientIntervals.clear()
  httpServer.close(() => {
    console.log("[LiveData] Server closed")
    process.exit(0)
  })
})
