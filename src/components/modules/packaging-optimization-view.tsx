"use client"
import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

const WAREHOUSES = ["Mumbai DC", "Delhi Hub", "Chennai DC", "Bangalore FC", "Pune WH", "Hyderabad DC", "Kolkata WH", "Ahmedabad FC"] as const
const MATERIAL_TYPES = ["Corrugated Box", "Bubble Wrap", "Stretch Film", "Foam Insert", "Air Pillow", "Paper Fill", "Wooden Crate", "Poly Mailer", "Padded Envelope", "Insulated Box", "Custom Insert", "Biodegradable Pack"] as const
const SUPPLIERS = ["PackPro India", "EcoPack Solutions", "BoxCraft Mfg", "Shree Packaging", "GreenWrap Co", "PrimePack Industries", "Patel Box Works", "NovaPack Ltd"] as const
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Custom"] as const
const GRADES = ["Economy", "Standard", "Premium", "Heavy Duty", "Eco-Friendly", "Industrial"] as const
const ORDER_STATUSES = ["Pending", "Confirmed", "In Production", "Dispatched", "Delivered", "Cancelled"] as const
const PRIORITIES = ["Critical", "High", "Medium", "Low", "Routine", "Scheduled"] as const
const PRODUCT_CATS = ["Electronics", "Apparel", "Food & Beverage", "Pharmaceuticals", "Home & Garden", "Auto Parts", "Beauty", "Books", "Sports", "Toys"] as const
const EFFICIENCY_GRADES = ["A+", "A", "B", "C", "D", "F"] as const
const CERTIFICATIONS = ["FSC", "ISO 14001", "None", "In Progress"] as const

const C = { teal: "#0d9488", indigo: "#6366f1", rose: "#e11d48", amber: "#d97706", emerald: "#059669", sky: "#0284c7", purple: "#7c3aed", slate: "#475569", orange: "#ea580c" }
const CC = [C.teal, C.indigo, C.rose, C.amber, C.emerald, C.sky, C.purple, C.orange, "#65a30d", C.slate]

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}

function formatINR(v: number) {
  if (v >= 10000000) return `\u20b9${(v / 10000000).toFixed(2)} Cr`
  if (v >= 100000) return `\u20b9${(v / 100000).toFixed(2)} L`
  return `\u20b9${v.toLocaleString("en-IN")}`
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function generateData() {
  const rng = seededRandom(185)
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)]
  const rInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min
  const rFloat = (min: number, max: number) => +(rng() * (max - min) + min).toFixed(1)

  const materials = Array.from({ length: 100 }, (_, i) => {
    const unitCost = rFloat(2, 850)
    return {
      id: `MAT-${String(i + 1).padStart(4, "0")}`,
      materialType: pick(MATERIAL_TYPES),
      supplier: pick(SUPPLIERS),
      size: pick(SIZES),
      grade: pick(GRADES),
      unitCost,
      stockQty: rInt(50, 5000),
      minOrder: rInt(100, 2000),
      leadTime: rInt(2, 21),
      sustainabilityScore: rInt(1, 100),
      recycledContent: rFloat(0, 95),
    }
  })

  const orders = Array.from({ length: 80 }, (_, i) => {
    const qty = rInt(100, 5000)
    const uc = rFloat(5, 600)
    const od = new Date(2025, rInt(0, 5), rInt(1, 28))
    const urg = rInt(1, 30)
    const dd = new Date(od.getTime() + urg * 86400000)
    return {
      id: `ORD-${String(i + 1).padStart(4, "0")}`,
      supplier: pick(SUPPLIERS),
      warehouse: pick(WAREHOUSES),
      materialType: pick(MATERIAL_TYPES),
      quantity: qty,
      unitCost: uc,
      totalCost: +(qty * uc).toFixed(2),
      priority: pick(PRIORITIES),
      status: pick(ORDER_STATUSES),
      orderDate: od.toISOString().split("T")[0],
      deliveryDate: dd.toISOString().split("T")[0],
      urgencyDays: urg,
    }
  })

  const costAnalysis = Array.from({ length: 60 }, (_, i) => {
    const mc = rFloat(50000, 500000)
    const lc = rFloat(20000, 150000)
    const sc = rFloat(10000, 80000)
    return {
      id: `CA-${String(i + 1).padStart(3, "0")}`,
      month: MONTHS[i % 12],
      materialCost: mc,
      laborCost: lc,
      shippingCost: sc,
      wastePct: rFloat(2, 18),
      savingsPct: rFloat(3, 25),
      totalCost: +(mc + lc + sc).toFixed(2),
      targetCost: +(mc * (0.85 + rng() * 0.15)).toFixed(2),
      packagesHandled: rInt(2000, 25000),
    }
  })

  const boxOptimization = Array.from({ length: 50 }, (_, i) => {
    const l = rFloat(5, 120), w = rFloat(5, 80), h = rFloat(3, 60)
    const wc = rFloat(0.5, 50)
    const vw = +((l * w * h) / 5000).toFixed(1)
    const aw = rFloat(0.3, wc * 0.9)
    const util = rFloat(35, 99)
    const space = rFloat(1, 40)
    return {
      id: `BOX-${String(i + 1).padStart(3, "0")}`,
      productCategory: pick(PRODUCT_CATS),
      boxName: `${pick(PRODUCT_CATS).split(" ")[0]}-${pick(SIZES)}-${pick(GRADES).slice(0, 3)}`,
      length: l, width: w, height: h,
      weightCapacity: wc,
      volumetricWeight: vw,
      actualWeight: aw,
      utilizationPct: util,
      spaceSavedPct: space,
      suggestedAlt: rng() > 0.5 ? `Alt-${pick(SIZES)}-V${rInt(2, 5)}` : "\u2014",
      efficiencyGrade: pick(EFFICIENCY_GRADES),
    }
  })

  const sustainability = Array.from({ length: 40 }, (_, i) => {
    return {
      id: `SUS-${String(i + 1).padStart(3, "0")}`,
      warehouse: pick(WAREHOUSES),
      month: MONTHS[i % 12],
      co2Savings: rFloat(50, 800),
      plasticReduction: rFloat(5, 60),
      recycledUsage: rFloat(10, 85),
      wasteDiversion: rFloat(20, 95),
      pkgToProductRatio: rFloat(1.1, 3.5),
      sustainabilityScore: rInt(20, 100),
      certification: pick(CERTIFICATIONS),
    }
  })

  return {
    materials, orders, costAnalysis, boxOptimization, sustainability,
    MATERIAL_TYPES, GRADES, SUPPLIERS, SIZES, WAREHOUSES, ORDER_STATUSES, PRIORITIES, PRODUCT_CATS, EFFICIENCY_GRADES, CERTIFICATIONS,
  }
}

const gradeColor: Record<string, string> = {
  Economy: "bg-slate-500", Standard: "bg-blue-500", Premium: "bg-purple-500",
  "Heavy Duty": "bg-orange-500", "Eco-Friendly": "bg-emerald-500", Industrial: "bg-gray-500",
}
const priorityColor: Record<string, string> = {
  Critical: "bg-slate-900 text-white", High: "bg-rose-500 text-white", Medium: "bg-amber-500 text-white",
  Low: "bg-emerald-500 text-white", Routine: "bg-slate-500 text-white", Scheduled: "bg-sky-500 text-white",
}
const statusColor: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800", Confirmed: "bg-blue-100 text-blue-800",
  "In Production": "bg-purple-100 text-purple-800", Dispatched: "bg-sky-100 text-sky-800",
  Delivered: "bg-emerald-100 text-emerald-800", Cancelled: "bg-red-100 text-red-800",
}
const utilColor = (v: number) => v < 60 ? C.rose : v < 80 ? C.amber : v <= 95 ? C.emerald : C.teal
const effGradeColor: Record<string, string> = { "A+": C.teal, A: C.emerald, B: C.sky, C: C.amber, D: C.orange, F: C.rose }

function SustainabilityBar({ value }: { value: number }) {
  const color = value < 40 ? C.rose : value < 70 ? C.amber : C.emerald
  return (
    <div className="pkg-sus-bar w-20 h-2 rounded-full bg-muted overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  )
}

function MaterialDrawer({ item, onClose }: { item: any; onClose: () => void }) {
  if (!item) return null
  return (
    <Sheet open={!!item} onOpenChange={(o: boolean) => { if (!o) onClose() }}>
      <SheetContent className="pkg-drawer w-full sm:max-w-md overflow-y-auto">
        <div className="pkg-drawer-header rounded-xl p-5 mb-4 text-white" style={{ background: `linear-gradient(135deg, ${C.teal}, ${C.indigo})` }}>
          <p className="text-xs opacity-80">Material Details</p>
          <h3 className="text-lg font-bold mt-1">{item.id}</h3>
          <div className="flex gap-2 mt-2">
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium text-white", gradeColor[item.grade] || "bg-gray-500")}>{item.grade}</span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/20">{item.size}</span>
          </div>
        </div>
        <div className="pkg-drawer-metrics grid grid-cols-3 gap-3 mb-4">
          {[{ label: "Unit Cost", val: formatINR(item.unitCost) }, { label: "Sustainability", val: `${item.sustainabilityScore}/100` }, { label: "Recycled %", val: `${item.recycledContent}%` }].map((m) => (
            <div key={m.label} className="pkg-metric-card p-3 rounded-lg border bg-card text-center">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-sm font-semibold mt-1">{m.val}</p>
            </div>
          ))}
        </div>
        <div className="pkg-drawer-fields grid grid-cols-2 gap-2 mb-4">
          {[{ l: "Type", v: item.materialType }, { l: "Supplier", v: item.supplier }, { l: "Stock Qty", v: item.stockQty.toLocaleString() }, { l: "Min Order", v: item.minOrder.toLocaleString() }, { l: "Lead Time", v: `${item.leadTime} days` }, { l: "Sustainability", v: item.sustainabilityScore }].map((f) => (
            <div key={f.l} className="pkg-field-row flex justify-between p-2 rounded bg-muted/50">
              <span className="text-xs text-muted-foreground">{f.l}</span>
              <span className="text-xs font-medium">{f.v}</span>
            </div>
          ))}
        </div>
        <div className="pkg-drawer-actions flex gap-2">
          {["Reorder", "Edit", "Archive"].map((a) => (
            <button key={a} onClick={onClose} className={cn("pkg-action-btn flex-1 py-2 rounded-lg text-sm font-medium transition-colors", a === "Reorder" ? "bg-teal-600 text-white hover:bg-teal-700" : a === "Edit" ? "border border-slate-300 hover:bg-muted" : "text-rose-600 border border-rose-200 hover:bg-rose-50")}>{a}</button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function OrderDrawer({ item, onClose }: { item: any; onClose: () => void }) {
  if (!item) return null
  return (
    <Sheet open={!!item} onOpenChange={(o: boolean) => { if (!o) onClose() }}>
      <SheetContent className="pkg-drawer w-full sm:max-w-md overflow-y-auto">
        <div className="pkg-drawer-header rounded-xl p-5 mb-4 text-white" style={{ background: `linear-gradient(135deg, ${C.indigo}, ${C.rose})` }}>
          <p className="text-xs opacity-80">Order Details</p>
          <h3 className="text-lg font-bold mt-1">{item.id}</h3>
          <div className="flex gap-2 mt-2">
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium", priorityColor[item.priority] || "bg-gray-500")}>{item.priority}</span>
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium", statusColor[item.status] || "bg-gray-100")}>{item.status}</span>
          </div>
        </div>
        <div className="pkg-drawer-metrics grid grid-cols-3 gap-3 mb-4">
          {[{ label: "Total Cost", val: formatINR(item.totalCost) }, { label: "Quantity", val: item.quantity.toLocaleString() }, { label: "Urgency", val: `${item.urgencyDays}d` }].map((m) => (
            <div key={m.label} className="pkg-metric-card p-3 rounded-lg border bg-card text-center">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-sm font-semibold mt-1">{m.val}</p>
            </div>
          ))}
        </div>
        <div className="pkg-drawer-fields grid grid-cols-2 gap-2 mb-4">
          {[{ l: "Supplier", v: item.supplier }, { l: "Warehouse", v: item.warehouse }, { l: "Material", v: item.materialType }, { l: "Unit Cost", v: formatINR(item.unitCost) }, { l: "Order Date", v: item.orderDate }, { l: "Delivery", v: item.deliveryDate }].map((f) => (
            <div key={f.l} className="pkg-field-row flex justify-between p-2 rounded bg-muted/50">
              <span className="text-xs text-muted-foreground">{f.l}</span>
              <span className="text-xs font-medium">{f.v}</span>
            </div>
          ))}
        </div>
        <div className="pkg-drawer-actions flex gap-2">
          {["Track", "Modify", "Cancel"].map((a) => (
            <button key={a} onClick={onClose} className={cn("pkg-action-btn flex-1 py-2 rounded-lg text-sm font-medium transition-colors", a === "Track" ? "bg-indigo-600 text-white hover:bg-indigo-700" : a === "Modify" ? "border border-slate-300 hover:bg-muted" : "text-rose-600 border border-rose-200 hover:bg-rose-50")}>{a}</button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function BoxDrawer({ item, onClose }: { item: any; onClose: () => void }) {
  if (!item) return null
  const uc = utilColor(item.utilizationPct)
  return (
    <Sheet open={!!item} onOpenChange={(o: boolean) => { if (!o) onClose() }}>
      <SheetContent className="pkg-drawer w-full sm:max-w-md overflow-y-auto">
        <div className="pkg-drawer-header rounded-xl p-5 mb-4 text-white" style={{ background: `linear-gradient(135deg, ${C.emerald}, ${C.teal})` }}>
          <p className="text-xs opacity-80">Box Optimization</p>
          <h3 className="text-lg font-bold mt-1">{item.id}</h3>
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: effGradeColor[item.efficiencyGrade] || C.slate }}>{item.efficiencyGrade}</span>
            <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: uc }}>{item.utilizationPct}%</span>
          </div>
        </div>
        <div className="pkg-drawer-metrics grid grid-cols-3 gap-3 mb-4">
          {[{ label: "Space Saved", val: `${item.spaceSavedPct}%` }, { label: "Vol. Weight", val: `${item.volumetricWeight}kg` }, { label: "Actual Wt", val: `${item.actualWeight}kg` }].map((m) => (
            <div key={m.label} className="pkg-metric-card p-3 rounded-lg border bg-card text-center">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-sm font-semibold mt-1">{m.val}</p>
            </div>
          ))}
        </div>
        <div className="pkg-drawer-fields grid grid-cols-2 gap-2 mb-4">
          {[{ l: "Category", v: item.productCategory }, { l: "Box Name", v: item.boxName }, { l: "Dimensions", v: `${item.length}x${item.width}x${item.height}` }, { l: "Wt Capacity", v: `${item.weightCapacity}kg` }, { l: "Alt Box", v: item.suggestedAlt }, { l: "Grade", v: item.efficiencyGrade }].map((f) => (
            <div key={f.l} className="pkg-field-row flex justify-between p-2 rounded bg-muted/50">
              <span className="text-xs text-muted-foreground">{f.l}</span>
              <span className="text-xs font-medium">{f.v}</span>
            </div>
          ))}
        </div>
        <div className="pkg-drawer-actions flex gap-2">
          {["Apply", "Simulate", "Export"].map((a) => (
            <button key={a} onClick={onClose} className={cn("pkg-action-btn flex-1 py-2 rounded-lg text-sm font-medium transition-colors", a === "Apply" ? "bg-emerald-600 text-white hover:bg-emerald-700" : a === "Simulate" ? "border border-slate-300 hover:bg-muted" : "text-rose-600 border border-rose-200 hover:bg-rose-50")}>{a}</button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function PackagingOptimizationView() {
  const [tab, setTab] = useState(0)
  const [drawerData, setDrawerData] = useState<any>(null)
  const data = useMemo(() => generateData(), [])
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState<any>("id")
  const [sortDir, setSortDir] = useState("asc")

  const tabs = ["Dashboard", "Materials", "Orders", "Cost Analysis", "Box Optimization", "Sustainability"]

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortDir((d: string) => (d === "asc" ? "desc" : "asc"))
    else { setSortBy(col); setSortDir("asc") }
  }
  const sortFn = (a: any, b: any) => {
    const av = a[sortBy], bv = b[sortBy]
    if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av
    return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
  }

  const totalMaterials = data.materials.length
  const avgUnitCost = data.materials.reduce((s: number, m: any) => s + m.unitCost, 0) / data.materials.length
  const avgSustainability = data.materials.reduce((s: number, m: any) => s + m.sustainabilityScore, 0) / data.materials.length
  const pendingOrders = data.orders.filter((o: any) => o.status === "Pending").length
  const monthlySpend = data.costAnalysis.reduce((s: number, c: any) => s + c.totalCost, 0) / 12
  const wasteReduction = data.costAnalysis.reduce((s: number, c: any) => s + c.savingsPct, 0) / data.costAnalysis.length

  const monthlySpendData = useMemo(() => {
    const agg: Record<string, { actual: number; target: number }> = {}
    data.costAnalysis.forEach((c: any) => {
      if (!agg[c.month]) agg[c.month] = { actual: 0, target: 0 }
      agg[c.month].actual += c.totalCost
      agg[c.month].target += c.targetCost
    })
    return MONTHS.map((m) => ({ month: m, actual: Math.round((agg[m]?.actual || 0) / 1000), target: Math.round((agg[m]?.target || 0) / 1000) }))
  }, [data])

  const matTypePie = useMemo(() => {
    const agg: Record<string, number> = {}
    data.materials.forEach((m: any) => { agg[m.materialType] = (agg[m.materialType] || 0) + 1 })
    return Object.entries(agg).map(([name, value]) => ({ name, value }))
  }, [data])

  const costBreakdown = useMemo(() => {
    const agg: Record<string, number> = {}
    data.costAnalysis.forEach((c: any) => {
      agg["Material"] = (agg["Material"] || 0) + c.materialCost
      agg["Labor"] = (agg["Labor"] || 0) + c.laborCost
      agg["Shipping"] = (agg["Shipping"] || 0) + c.shippingCost
    })
    return Object.entries(agg).map(([name, cost]) => ({ name, cost: Math.round(cost / 1000) }))
  }, [data])

  const susTrend = useMemo(() => {
    const agg: Record<string, { total: number; count: number }> = {}
    data.sustainability.forEach((s: any) => {
      if (!agg[s.month]) agg[s.month] = { total: 0, count: 0 }
      agg[s.month].total += s.sustainabilityScore
      agg[s.month].count++
    })
    return MONTHS.map((m) => ({ month: m, score: agg[m] ? Math.round(agg[m].total / agg[m].count) : 0 }))
  }, [data])

  const supplierRadar = useMemo(() => {
    return data.SUPPLIERS.slice(0, 8).map((s: string) => {
      const sm = data.materials.filter((m: any) => m.supplier === s)
      const cost = sm.length ? Math.round(100 - (sm.reduce((a: number, m: any) => a + m.unitCost, 0) / sm.length) / 850 * 100) : 50
      const quality = sm.length ? Math.round(sm.reduce((a: number, m: any) => a + m.sustainabilityScore, 0) / sm.length) : 50
      const delivery = 50 + Math.round(Math.random() * 40)
      const sus = sm.length ? Math.round(sm.reduce((a: number, m: any) => a + m.sustainabilityScore, 0) / sm.length) : 50
      return { supplier: s, cost, quality, delivery, sustainability: sus }
    })
  }, [data])

  const filteredMaterials = useMemo(() => {
    let list = [...data.materials]
    if (search) list = list.filter((m: any) => m.id.toLowerCase().includes(search.toLowerCase()) || m.materialType.toLowerCase().includes(search.toLowerCase()) || m.supplier.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== "all") list = list.filter((m: any) => m.materialType === filterType)
    return list.sort(sortFn)
  }, [data, search, filterType, sortBy, sortDir])

  const filteredOrders = useMemo(() => {
    let list = [...data.orders]
    if (search) list = list.filter((o: any) => o.id.toLowerCase().includes(search.toLowerCase()) || o.supplier.toLowerCase().includes(search.toLowerCase()) || o.warehouse.toLowerCase().includes(search.toLowerCase()))
    if (filterStatus !== "all") list = list.filter((o: any) => o.status === filterStatus)
    return list.sort(sortFn)
  }, [data, search, filterStatus, sortBy, sortDir])

  const filteredBoxes = useMemo(() => {
    let list = [...data.boxOptimization]
    if (search) list = list.filter((b: any) => b.id.toLowerCase().includes(search.toLowerCase()) || b.productCategory.toLowerCase().includes(search.toLowerCase()) || b.boxName.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== "all") list = list.filter((b: any) => b.productCategory === filterType)
    return list.sort(sortFn)
  }, [data, search, filterType, sortBy, sortDir])

  const costPerPkg = useMemo(() => {
    const agg: Record<string, { total: number; count: number }> = {}
    data.costAnalysis.forEach((c: any) => {
      const mt = data.materials[c.id.replace(/\D/g, "") % 100]?.materialType || "Other"
      if (!agg[mt]) agg[mt] = { total: 0, count: 0 }
      agg[mt].total += c.totalCost / Math.max(c.packagesHandled, 1)
      agg[mt].count++
    })
    return Object.entries(agg).map(([name, v]) => ({ name, cost: +(v.total / v.count).toFixed(1) })).sort((a, b) => b.cost - a.cost).slice(0, 8)
  }, [data])

  const wasteTrend = useMemo(() => {
    const agg: Record<string, { total: number; count: number }> = {}
    data.costAnalysis.forEach((c: any) => {
      if (!agg[c.month]) agg[c.month] = { total: 0, count: 0 }
      agg[c.month].total += c.wastePct
      agg[c.month].count++
    })
    return MONTHS.map((m) => ({ month: m, waste: agg[m] ? +(agg[m].total / agg[m].count).toFixed(1) : 0 }))
  }, [data])

  const laborVsMaterial = useMemo(() => {
    return MONTHS.map((m) => {
      const items = data.costAnalysis.filter((c: any) => c.month === m)
      return { month: m, material: Math.round(items.reduce((s: number, c: any) => s + c.materialCost, 0) / 1000), labor: Math.round(items.reduce((s: number, c: any) => s + c.laborCost, 0) / 1000) }
    })
  }, [data])

  const co2ByWh = useMemo(() => {
    const agg: Record<string, number> = {}
    data.sustainability.forEach((s: any) => { agg[s.warehouse] = (agg[s.warehouse] || 0) + s.co2Savings })
    return Object.entries(agg).map(([warehouse, co2]) => ({ warehouse, co2: +co2.toFixed(0) })).sort((a, b) => b.co2 - a.co2)
  }, [data])

  const plasticReductionTrend = useMemo(() => {
    const agg: Record<string, { total: number; count: number }> = {}
    data.sustainability.forEach((s: any) => {
      if (!agg[s.month]) agg[s.month] = { total: 0, count: 0 }
      agg[s.month].total += s.plasticReduction
      agg[s.month].count++
    })
    return MONTHS.map((m) => ({ month: m, reduction: agg[m] ? +(agg[m].total / agg[m].count).toFixed(1) : 0 }))
  }, [data])

  const recycledPie = useMemo(() => {
    const agg: Record<string, number> = {}
    data.sustainability.forEach((s: any) => { agg[s.certification] = (agg[s.certification] || 0) + s.recycledUsage })
    return Object.entries(agg).map(([name, value]) => ({ name, value: +value.toFixed(1) }))
  }, [data])

  const susByWh = useMemo(() => {
    const agg: Record<string, { total: number; count: number }> = {}
    data.sustainability.forEach((s: any) => {
      if (!agg[s.warehouse]) agg[s.warehouse] = { total: 0, count: 0 }
      agg[s.warehouse].total += s.sustainabilityScore
      agg[s.warehouse].count++
    })
    return Object.entries(agg).map(([warehouse, v]) => ({ warehouse, score: Math.round(v.total / v.count) })).sort((a, b) => b.score - a.score)
  }, [data])

  const topMaterials = useMemo(() => {
    const agg: Record<string, { qty: number; cost: number }> = {}
    data.materials.forEach((m: any) => {
      if (!agg[m.materialType]) agg[m.materialType] = { qty: 0, cost: 0 }
      agg[m.materialType].qty += m.stockQty
      agg[m.materialType].cost += m.unitCost * m.stockQty
    })
    return Object.entries(agg).map(([name, v]) => ({ name, qty: v.qty, value: Math.round(v.cost) })).sort((a, b) => b.value - a.value).slice(0, 5)
  }, [data])

  const orderWarehouseBreakdown = useMemo(() => {
    const agg: Record<string, { count: number; value: number }> = {}
    data.orders.forEach((o: any) => {
      if (!agg[o.warehouse]) agg[o.warehouse] = { count: 0, value: 0 }
      agg[o.warehouse].count++
      agg[o.warehouse].value += o.totalCost
    })
    return Object.entries(agg).map(([warehouse, v]) => ({ warehouse, orders: v.count, value: Math.round(v.value) })).sort((a, b) => b.value - a.value)
  }, [data])

  const boxGradeDistribution = useMemo(() => {
    const agg: Record<string, number> = {}
    data.boxOptimization.forEach((b: any) => { agg[b.efficiencyGrade] = (agg[b.efficiencyGrade] || 0) + 1 })
    return Object.entries(agg).sort((a, b) => b[1] - a[1]).map(([grade, count]) => ({ grade, count }))
  }, [data])

  const kpis = [
    { label: "Total Materials", value: totalMaterials, suffix: "", color: C.teal },
    { label: "Avg Unit Cost", value: formatINR(avgUnitCost), suffix: "", color: C.indigo },
    { label: "Avg Sustainability", value: avgSustainability.toFixed(1), suffix: "/100", color: C.emerald },
    { label: "Pending Orders", value: pendingOrders, suffix: "", color: C.rose },
    { label: "Monthly Spend", value: formatINR(monthlySpend), suffix: "", color: C.amber },
    { label: "Waste Reduction", value: wasteReduction.toFixed(1), suffix: "%", color: C.sky },
  ]

  const thClass = "pkg-th px-3 py-2 text-left text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
  const tdClass = "pkg-td px-3 py-2 text-sm"

  return (
    <div className="pkg-root space-y-6">
      <PageHeader title="Packaging Optimization" description="Indian logistics warehouse packaging management & cost optimization" />

      <div className="pkg-tabs flex gap-1 overflow-x-auto pb-1">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => { setTab(i); setSearch(""); setFilterType("all"); setFilterStatus("all") }}
            className={cn("pkg-tab px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors", tab === i ? "pkg-tab-active bg-teal-600 text-white" : "pkg-tab-inactive text-muted-foreground hover:bg-muted")}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="pkg-dashboard space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {kpis.map((k) => (
              <div key={k.label} className="pkg-kpi-card p-4 rounded-xl border bg-card">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="pkg-kpi-value text-xl font-bold mt-1" style={{ color: k.color }}>{k.value}<span className="text-sm font-normal text-muted-foreground">{k.suffix}</span></p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Monthly Spend (\u20b9K)</h4>
              <ResponsiveContainer width="100%" height={220}><AreaChart data={monthlySpendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
                <Tooltip /><Legend /><Area type="monotone" dataKey="actual" name="Actual" fill={C.teal} stroke={C.teal} fillOpacity={0.3} />
                <Line type="monotone" dataKey="target" name="Target" stroke={C.rose} strokeDasharray="5 5" dot={false} />
              </AreaChart></ResponsiveContainer>
            </div>
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Material Types</h4>
              <ResponsiveContainer width="100%" height={220}><PieChart>
                <Pie data={matTypePie} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" paddingAngle={2} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {matTypePie.map((_: any, i: number) => <Cell key={i} fill={CC[i % CC.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart></ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Cost Breakdown (\u20b9K)</h4>
              <ResponsiveContainer width="100%" height={200}><BarChart data={costBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={70} />
                <Tooltip /><Bar dataKey="cost" name="Cost" radius={[0, 4, 4, 0]}>{costBreakdown.map((_: any, i: number) => <Cell key={i} fill={CC[i]} />)}</Bar>
              </BarChart></ResponsiveContainer>
            </div>
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Sustainability Trend</h4>
              <ResponsiveContainer width="100%" height={200}><LineChart data={susTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip /><Line type="monotone" dataKey="score" name="Score" stroke={C.emerald} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart></ResponsiveContainer>
            </div>
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Supplier Comparison</h4>
              <ResponsiveContainer width="100%" height={200}><RadarChart data={supplierRadar}>
                <PolarGrid stroke="#e2e8f0" /><PolarAngleAxis dataKey="supplier" tick={{ fontSize: 9 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Cost" dataKey="cost" stroke={C.teal} fill={C.teal} fillOpacity={0.15} />
                <Radar name="Quality" dataKey="quality" stroke={C.indigo} fill={C.indigo} fillOpacity={0.15} />
                <Radar name="Delivery" dataKey="delivery" stroke={C.amber} fill={C.amber} fillOpacity={0.15} />
                <Radar name="Sustainability" dataKey="sustainability" stroke={C.emerald} fill={C.emerald} fillOpacity={0.15} />
                <Legend wrapperStyle={{ fontSize: 10 }} /><Tooltip />
              </RadarChart></ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Top Materials by Stock Value</h4>
              <div className="space-y-2">
                {topMaterials.map((m, i) => (
                  <div key={m.name} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</span>
                      <span className="text-sm font-medium">{m.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold" style={{ color: CC[i] }}>{formatINR(m.value)}</p>
                      <p className="text-xs text-muted-foreground">{m.qty.toLocaleString()} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Order Value by Warehouse</h4>
              <div className="space-y-2">
                {orderWarehouseBreakdown.slice(0, 5).map((w, i) => (
                  <div key={w.warehouse} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CC[i] }} />
                      <span className="text-sm font-medium">{w.warehouse}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatINR(w.value)}</p>
                      <p className="text-xs text-muted-foreground">{w.orders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Box Efficiency Distribution</h4>
              <div className="space-y-2">
                {boxGradeDistribution.map((g) => (
                  <div key={g.grade} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: effGradeColor[g.grade] || C.slate }}>{g.grade}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(g.count / data.boxOptimization.length) * 100}%`, backgroundColor: effGradeColor[g.grade] || C.slate }} />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{g.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="pkg-materials space-y-4">
          <div className="pkg-filters flex flex-wrap gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search materials..." className="pkg-search px-3 py-2 rounded-lg border bg-background text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="pkg-select px-3 py-2 rounded-lg border bg-background text-sm">
              <option value="all">All Types</option>
              {data.MATERIAL_TYPES.map((t: string) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="pkg-select px-3 py-2 rounded-lg border bg-background text-sm">
              <option value="all">All Grades</option>
              {data.GRADES.map((g: string) => <option key={g} value={g}>{g}</option>)}
            </select>
            <select className="pkg-select px-3 py-2 rounded-lg border bg-background text-sm">
              <option value="all">All Suppliers</option>
              {data.SUPPLIERS.map((s: string) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="pkg-table-wrap rounded-xl border overflow-hidden">
            <div className="max-h-96 overflow-y-auto pkg-table-scroll">
              <table className="w-full">
                <thead className="pkg-thead bg-muted/50 sticky top-0 z-10">
                  <tr>{["id", "materialType", "supplier", "size", "grade", "unitCost", "stockQty", "minOrder", "leadTime", "sustainabilityScore"].map((col) => (
                    <th key={col} className={thClass} onClick={() => toggleSort(col)}>{col.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())} {sortBy === col ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((m: any) => (
                    <tr key={m.id} className="pkg-row border-t hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => setDrawerData(m)}>
                      <td className={tdClass + " font-mono text-xs"}>{m.id}</td>
                      <td className={tdClass}>{m.materialType}</td>
                      <td className={tdClass}>{m.supplier}</td>
                      <td className={tdClass + " text-center"}>{m.size}</td>
                      <td className={tdClass}><span className={cn("px-2 py-0.5 rounded text-xs font-medium text-white", gradeColor[m.grade] || "bg-gray-500")}>{m.grade}</span></td>
                      <td className={tdClass}>{formatINR(m.unitCost)}</td>
                      <td className={tdClass}>{m.stockQty.toLocaleString()}</td>
                      <td className={tdClass}>{m.minOrder.toLocaleString()}</td>
                      <td className={tdClass}>{m.leadTime}d</td>
                      <td className={tdClass}><div className="flex items-center gap-2"><SustainabilityBar value={m.sustainabilityScore} /><span className="text-xs">{m.sustainabilityScore}</span></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[
              { label: "Total Stock Value", val: formatINR(data.materials.reduce((s: number, m: any) => s + m.unitCost * m.stockQty, 0)) },
              { label: "Low Stock Items", val: data.materials.filter((m: any) => m.stockQty < 200).length.toString() },
              { label: "Avg Lead Time", val: `${(data.materials.reduce((s: number, m: any) => s + m.leadTime, 0) / data.materials.length).toFixed(1)} days` },
              { label: "Eco-Friendly Count", val: data.materials.filter((m: any) => m.grade === "Eco-Friendly").length.toString() },
            ].map((m) => (
              <div key={m.label} className="pkg-sus-kpi p-4 rounded-xl border bg-card">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-lg font-bold mt-1 text-foreground">{m.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="pkg-orders space-y-4">
          <div className="pkg-filters flex flex-wrap gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="pkg-search px-3 py-2 rounded-lg border bg-background text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="pkg-select px-3 py-2 rounded-lg border bg-background text-sm">
              <option value="all">All Statuses</option>
              {data.ORDER_STATUSES.map((s: string) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="pkg-select px-3 py-2 rounded-lg border bg-background text-sm">
              <option value="all">All Priorities</option>
              {data.PRIORITIES.map((p: string) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="pkg-table-wrap rounded-xl border overflow-hidden">
            <div className="max-h-96 overflow-y-auto pkg-table-scroll">
              <table className="w-full">
                <thead className="pkg-thead bg-muted/50 sticky top-0 z-10">
                  <tr>{["id", "supplier", "warehouse", "materialType", "quantity", "totalCost", "priority", "status", "orderDate", "deliveryDate"].map((col) => (
                    <th key={col} className={thClass} onClick={() => toggleSort(col)}>{col.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())} {sortBy === col ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o: any) => (
                    <tr key={o.id} className="pkg-row border-t hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => setDrawerData({ ...o, _type: "order" })}>
                      <td className={tdClass + " font-mono text-xs"}>{o.id}</td>
                      <td className={tdClass}>{o.supplier}</td>
                      <td className={tdClass}>{o.warehouse}</td>
                      <td className={tdClass}>{o.materialType}</td>
                      <td className={tdClass}>{o.quantity.toLocaleString()}</td>
                      <td className={tdClass}>{formatINR(o.totalCost)}</td>
                      <td className={tdClass}><span className={cn("px-2 py-0.5 rounded text-xs font-medium", priorityColor[o.priority] || "bg-gray-500")}>{o.priority}</span></td>
                      <td className={tdClass}><span className={cn("px-2 py-0.5 rounded text-xs font-medium", statusColor[o.status] || "bg-gray-100")}>{o.status}</span></td>
                      <td className={tdClass + " text-xs"}>{o.orderDate}</td>
                      <td className={tdClass + " text-xs"}>{o.deliveryDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[
              { label: "Total Order Value", val: formatINR(data.orders.reduce((s: number, o: any) => s + o.totalCost, 0)) },
              { label: "Critical Orders", val: data.orders.filter((o: any) => o.priority === "Critical").length.toString() },
              { label: "Avg Urgency", val: `${(data.orders.reduce((s: number, o: any) => s + o.urgencyDays, 0) / data.orders.length).toFixed(1)} days` },
              { label: "Delivered %", val: `${((data.orders.filter((o: any) => o.status === "Delivered").length / data.orders.length) * 100).toFixed(1)}%` },
              { label: "Cancelled", val: data.orders.filter((o: any) => o.status === "Cancelled").length.toString() },
              { label: "Avg Qty/Order", val: `${(data.orders.reduce((s: number, o: any) => s + o.quantity, 0) / data.orders.length).toFixed(0)}` },
              { label: "In Production", val: data.orders.filter((o: any) => o.status === "In Production").length.toString() },
              { label: "Top Supplier Orders", val: (() => { const c: Record<string, number> = {}; data.orders.forEach((o: any) => { c[o.supplier] = (c[o.supplier] || 0) + 1 }); return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || "—" })() },
            ].map((m) => (
              <div key={m.label} className="pkg-sus-kpi p-4 rounded-xl border bg-card">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-sm font-bold mt-1 text-foreground truncate">{m.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="pkg-cost space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Monthly Spend vs Target (\u20b9K)</h4>
              <ResponsiveContainer width="100%" height={240}><AreaChart data={monthlySpendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
                <Tooltip /><Legend /><Area type="monotone" dataKey="actual" name="Actual" stroke={C.teal} fill={C.teal} fillOpacity={0.2} />
                <Area type="monotone" dataKey="target" name="Target" stroke={C.rose} fill={C.rose} fillOpacity={0.1} />
              </AreaChart></ResponsiveContainer>
            </div>
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Cost Per Package by Material (\u20b9)</h4>
              <ResponsiveContainer width="100%" height={240}><BarChart data={costPerPkg}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} /><YAxis tick={{ fontSize: 11 }} />
                <Tooltip /><Bar dataKey="cost" name="Cost/Pkg" radius={[4, 4, 0, 0]}>{costPerPkg.map((_: any, i: number) => <Cell key={i} fill={CC[i % CC.length]} />)}</Bar>
              </BarChart></ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Waste % Trend</h4>
              <ResponsiveContainer width="100%" height={220}><LineChart data={wasteTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip /><Line type="monotone" dataKey="waste" name="Waste %" stroke={C.rose} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart></ResponsiveContainer>
            </div>
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Labor vs Material Cost (\u20b9K)</h4>
              <ResponsiveContainer width="100%" height={220}><BarChart data={laborVsMaterial}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
                <Tooltip /><Legend /><Bar dataKey="material" name="Material" fill={C.teal} radius={[4, 4, 0, 0]} />
                <Bar dataKey="labor" name="Labor" fill={C.amber} radius={[4, 4, 0, 0]} />
              </BarChart></ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Annual Spend", val: formatINR(data.costAnalysis.reduce((s: number, c: any) => s + c.totalCost, 0)) },
              { label: "Avg Savings %", val: `${(data.costAnalysis.reduce((s: number, c: any) => s + c.savingsPct, 0) / data.costAnalysis.length).toFixed(1)}%` },
              { label: "Total Packages", val: data.costAnalysis.reduce((s: number, c: any) => s + c.packagesHandled, 0).toLocaleString() },
              { label: "Avg Cost/Pkg", val: formatINR(data.costAnalysis.reduce((s: number, c: any) => s + c.totalCost, 0) / Math.max(data.costAnalysis.reduce((s: number, c: any) => s + c.packagesHandled, 0), 1)) },
              { label: "Peak Month Spend", val: formatINR(Math.max(...data.costAnalysis.map((c: any) => c.totalCost))) },
              { label: "Min Month Spend", val: formatINR(Math.min(...data.costAnalysis.map((c: any) => c.totalCost))) },
              { label: "Avg Material %", val: `${(data.costAnalysis.reduce((s: number, c: any) => s + c.materialCost / c.totalCost * 100, 0) / data.costAnalysis.length).toFixed(1)}%` },
              { label: "Avg Waste %", val: `${(data.costAnalysis.reduce((s: number, c: any) => s + c.wastePct, 0) / data.costAnalysis.length).toFixed(1)}%` },
              { label: "Best Savings %", val: `${Math.max(...data.costAnalysis.map((c: any) => c.savingsPct)).toFixed(1)}%` },
            ].map((m) => (
              <div key={m.label} className="pkg-cost-kpi p-4 rounded-xl border bg-card">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-lg font-bold mt-1 text-foreground">{m.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 4 && (
        <div className="pkg-boxopt space-y-4">
          <div className="pkg-filters flex flex-wrap gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search boxes..." className="pkg-search px-3 py-2 rounded-lg border bg-background text-sm w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="pkg-select px-3 py-2 rounded-lg border bg-background text-sm">
              <option value="all">All Categories</option>
              {data.PRODUCT_CATS.map((c: string) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="pkg-table-wrap rounded-xl border overflow-hidden">
            <div className="max-h-96 overflow-y-auto pkg-table-scroll">
              <table className="w-full">
                <thead className="pkg-thead bg-muted/50 sticky top-0 z-10">
                  <tr>{["id", "productCategory", "boxName", "dimensions", "weightCapacity", "utilizationPct", "spaceSavedPct", "efficiencyGrade", "suggestedAlt"].map((col) => (
                    <th key={col} className={thClass} onClick={() => toggleSort(col)}>{col.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())} {sortBy === col ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filteredBoxes.map((b: any) => {
                    const uc = utilColor(b.utilizationPct)
                    const ec = effGradeColor[b.efficiencyGrade] || C.slate
                    return (
                      <tr key={b.id} className="pkg-row border-t hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => setDrawerData({ ...b, _type: "box" })}>
                        <td className={tdClass + " font-mono text-xs"}>{b.id}</td>
                        <td className={tdClass}>{b.productCategory}</td>
                        <td className={tdClass}>{b.boxName}</td>
                        <td className={tdClass + " text-xs"}>{b.length}x{b.width}x{b.height}</td>
                        <td className={tdClass}>{b.weightCapacity}kg</td>
                        <td className={tdClass}><span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: uc }}>{b.utilizationPct}%</span></td>
                        <td className={tdClass}>{b.spaceSavedPct}%</td>
                        <td className={tdClass}><span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: ec }}>{b.efficiencyGrade}</span></td>
                        <td className={tdClass + " text-xs"}>{b.suggestedAlt}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[
              { label: "Avg Utilization", val: `${(data.boxOptimization.reduce((s: number, b: any) => s + b.utilizationPct, 0) / data.boxOptimization.length).toFixed(1)}%` },
              { label: "A+/A Grade Boxes", val: data.boxOptimization.filter((b: any) => b.efficiencyGrade === "A+" || b.efficiencyGrade === "A").length.toString() },
              { label: "Avg Space Saved", val: `${(data.boxOptimization.reduce((s: number, b: any) => s + b.spaceSavedPct, 0) / data.boxOptimization.length).toFixed(1)}%` },
              { label: "Has Alternative", val: data.boxOptimization.filter((b: any) => b.suggestedAlt !== "\u2014").length.toString() },
            ].map((m) => (
              <div key={m.label} className="pkg-sus-kpi p-4 rounded-xl border bg-card">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-lg font-bold mt-1 text-foreground">{m.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 5 && (
        <div className="pkg-sus space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">CO\u2082 Savings by Warehouse (kg)</h4>
              <ResponsiveContainer width="100%" height={240}><BarChart data={co2ByWh}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="warehouse" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={55} /><YAxis tick={{ fontSize: 11 }} />
                <Tooltip /><Bar dataKey="co2" name="CO\u2082" radius={[4, 4, 0, 0]}>{co2ByWh.map((_: any, i: number) => <Cell key={i} fill={CC[i % CC.length]} />)}</Bar>
              </BarChart></ResponsiveContainer>
            </div>
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Monthly Plastic Reduction (%)</h4>
              <ResponsiveContainer width="100%" height={240}><AreaChart data={plasticReductionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip /><Area type="monotone" dataKey="reduction" name="Reduction" stroke={C.emerald} fill={C.emerald} fillOpacity={0.25} />
              </AreaChart></ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Recycled Usage by Certification</h4>
              <ResponsiveContainer width="100%" height={220}><PieChart>
                <Pie data={recycledPie} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" paddingAngle={2} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {recycledPie.map((_: any, i: number) => <Cell key={i} fill={CC[i % CC.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart></ResponsiveContainer>
            </div>
            <div className="pkg-chart-card p-4 rounded-xl border bg-card">
              <h4 className="pkg-chart-title text-sm font-semibold mb-3">Sustainability by Warehouse</h4>
              <ResponsiveContainer width="100%" height={220}><BarChart data={susByWh}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="warehouse" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={55} /><YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip /><Bar dataKey="score" name="Score" radius={[4, 4, 0, 0]}>{susByWh.map((entry: any) => <Cell key={entry.warehouse} fill={entry.score >= 70 ? C.emerald : entry.score >= 50 ? C.amber : C.rose} />)}</Bar>
              </BarChart></ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total CO\u2082 Saved", val: `${data.sustainability.reduce((s: number, x: any) => s + x.co2Savings, 0).toFixed(0)} kg` },
              { label: "Avg Plastic Reduction", val: `${(data.sustainability.reduce((s: number, x: any) => s + x.plasticReduction, 0) / data.sustainability.length).toFixed(1)}%` },
              { label: "Avg Recycled Usage", val: `${(data.sustainability.reduce((s: number, x: any) => s + x.recycledUsage, 0) / data.sustainability.length).toFixed(1)}%` },
              { label: "Avg Waste Diversion", val: `${(data.sustainability.reduce((s: number, x: any) => s + x.wasteDiversion, 0) / data.sustainability.length).toFixed(1)}%` },
              { label: "Total CO\u2082 (Mumbai DC)", val: `${data.sustainability.filter((s: any) => s.warehouse === "Mumbai DC").reduce((a: number, s: any) => a + s.co2Savings, 0).toFixed(0)} kg` },
              { label: "Best Single Score", val: `${Math.max(...data.sustainability.map((s: any) => s.sustainabilityScore))}/100` },
              { label: "FSC Certified", val: data.sustainability.filter((s: any) => s.certification === "FSC").length.toString() },
              { label: "ISO 14001", val: data.sustainability.filter((s: any) => s.certification === "ISO 14001").length.toString() },
              { label: "Avg Pkg:Product", val: `${(data.sustainability.reduce((s: number, x: any) => s + x.pkgToProductRatio, 0) / data.sustainability.length).toFixed(2)}` },
              { label: "In Progress", val: data.sustainability.filter((s: any) => s.certification === "In Progress").length.toString() },
              { label: "No Certification", val: data.sustainability.filter((s: any) => s.certification === "None").length.toString() },
              { label: "Warehouses Active", val: [...new Set(data.sustainability.map((s: any) => s.warehouse))].length.toString() },
            ].map((m) => (
              <div key={m.label} className="pkg-sus-kpi p-4 rounded-xl border bg-card">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-lg font-bold mt-1 text-foreground">{m.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {drawerData && !drawerData._type && <MaterialDrawer item={drawerData} onClose={() => setDrawerData(null)} />}
      {drawerData?._type === "order" && <OrderDrawer item={drawerData} onClose={() => setDrawerData(null)} />}
      {drawerData?._type === "box" && <BoxDrawer item={drawerData} onClose={() => setDrawerData(null)} />}

      <footer className="pkg-footer mt-8 pt-4 border-t text-center text-xs text-muted-foreground pb-6">
        Packaging Optimization Module #115 (R185) &mdash; Indian Logistics Warehouse Management
      </footer>
    </div>
  )
}