"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Thermometer, Droplets, Radio, Wifi, WifiOff,
  Battery, Activity, AlertTriangle,
  MapPin, Signal, Eye, Users
} from "lucide-react"

const raw = [
  { id: "IOT-01", dc: "Mumbai DC-1", zone: "A-Receiving", sensorType: "Temperature", sensorId: "TMP-M1-A01", value: 28.5, unit: "\u00b0C", min: 18, max: 35, thresholdHigh: 32, thresholdLow: 15, status: "Online", battery: 85, signal: "Strong", lastReading: "2 min ago", firmware: "v3.2", location: "Bay 12", alerts: 0 },
  { id: "IOT-02", dc: "Mumbai DC-1", zone: "E-Cold Chain", sensorType: "Temperature", sensorId: "TMP-M1-E01", value: -21.3, unit: "\u00b0C", min: -25, max: -18, thresholdHigh: -18, thresholdLow: -25, status: "Alert", battery: 92, signal: "Strong", lastReading: "1 min ago", firmware: "v3.2", location: "Cold Room 3", alerts: 2 },
  { id: "IOT-03", dc: "Delhi DC-2", zone: "B-Pick Pack", sensorType: "Humidity", sensorId: "HUM-D2-B01", value: 72, unit: "%", min: 30, max: 80, thresholdHigh: 75, thresholdLow: 35, status: "Online", battery: 64, signal: "Medium", lastReading: "3 min ago", firmware: "v3.1", location: "Pack Station 5", alerts: 0 },
  { id: "IOT-04", dc: "Delhi DC-2", zone: "A-Receiving", sensorType: "Motion", sensorId: "MOV-D2-A01", value: 847, unit: "events/hr", min: 0, max: 2000, thresholdHigh: 1500, thresholdLow: 0, status: "Online", battery: 100, signal: "Strong", lastReading: "30 sec ago", firmware: "v3.3", location: "Gate Entry", alerts: 0 },
  { id: "IOT-05", dc: "Bengaluru DC-3", zone: "C-Storage", sensorType: "Humidity", sensorId: "HUM-B3-C01", value: 82, unit: "%", min: 30, max: 80, thresholdHigh: 75, thresholdLow: 35, status: "Alert", battery: 38, signal: "Weak", lastReading: "5 min ago", firmware: "v3.0", location: "Rack Zone C4", alerts: 3 },
  { id: "IOT-06", dc: "Bengaluru DC-3", zone: "D-Shipping", sensorType: "Occupancy", sensorId: "OCC-B3-D01", value: 94, unit: "%", min: 0, max: 100, thresholdHigh: 90, thresholdLow: 0, status: "Alert", battery: 55, signal: "Strong", lastReading: "1 min ago", firmware: "v3.2", location: "Dock 7-8", alerts: 1 },
  { id: "IOT-07", dc: "Chennai DC-6", zone: "E-Cold Chain", sensorType: "Temperature", sensorId: "TMP-C6-E01", value: 2.1, unit: "\u00b0C", min: 0, max: 8, thresholdHigh: 5, thresholdLow: 0, status: "Online", battery: 78, signal: "Medium", lastReading: "2 min ago", firmware: "v3.2", location: "Pharma Vault", alerts: 0 },
  { id: "IOT-08", dc: "Kolkata DC-5", zone: "A-Receiving", sensorType: "Temperature", sensorId: "TMP-K5-A01", value: 36.2, unit: "\u00b0C", min: 18, max: 35, thresholdHigh: 32, thresholdLow: 15, status: "Critical", battery: 22, signal: "Weak", lastReading: "8 min ago", firmware: "v3.0", location: "Yard Area", alerts: 4 },
  { id: "IOT-09", dc: "Hyderabad DC-4", zone: "B-Pick Pack", sensorType: "Occupancy", sensorId: "OCC-H4-B01", value: 45, unit: "%", min: 0, max: 100, thresholdHigh: 90, thresholdLow: 0, status: "Online", battery: 95, signal: "Strong", lastReading: "1 min ago", firmware: "v3.3", location: "Pick Zone B2", alerts: 0 },
  { id: "IOT-10", dc: "Hyderabad DC-4", zone: "E-Cold Chain", sensorType: "Humidity", sensorId: "HUM-H4-E01", value: 45, unit: "%", min: 20, max: 60, thresholdHigh: 55, thresholdLow: 25, status: "Offline", battery: 5, signal: "None", lastReading: "45 min ago", firmware: "v2.9", location: "Freezer Unit 2", alerts: 5 },
]

interface IOTItem {
  id: string; dc: string; zone: string; sensorType: string; sensorId: string
  value: number; unit: string; min: number; max: number
  thresholdHigh: number; thresholdLow: number; status: string
  battery: number; signal: string; lastReading: string
  firmware: string; location: string; alerts: number
}

const items: IOTItem[] = raw.map((r: any) => ({
  id: r.id, dc: r.dc, zone: r.zone, sensorType: r.sensorType,
  sensorId: r.sensorId, value: r.value, unit: r.unit,
  min: r.min, max: r.max, thresholdHigh: r.thresholdHigh,
  thresholdLow: r.thresholdLow, status: r.status, battery: r.battery,
  signal: r.signal, lastReading: r.lastReading, firmware: r.firmware,
  location: r.location, alerts: r.alerts,
}))

const statusColors: Record<string, string> = {
  "Online": "text-emerald-600", "Alert": "text-amber-600 font-semibold",
  "Critical": "text-red-600 font-semibold", "Offline": "text-slate-500 font-semibold",
}
const signalIcons: Record<string, React.ElementType> = { Strong: Signal, Medium: Signal, Weak: Signal, None: WifiOff }
const typeIcons: Record<string, React.ElementType> = { Temperature: Thermometer, Humidity: Droplets, Motion: Activity, Occupancy: Users }
const dcNames = [...new Set(items.map(i => i.dc))]
const online = items.filter(i => i.status === "Online").length
const alertCount = items.filter(i => i.status === "Alert" || i.status === "Critical").length
const offline = items.filter(i => i.status === "Offline").length
const lowBattery = items.filter(i => i.battery < 30).length

type Rec = any
type FV = Record<string, string>
type VT = "sensors" | "zones" | "health"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`iot-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

export function IoTSensorDashboardPanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("sensors")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: Wifi, title: "Online", desc: `${online}/${items.length} sensors connected`, accent: "text-emerald-500" },
    { icon: AlertTriangle, title: "Alerts", desc: `${alertCount} sensors in alert/critical`, accent: "text-red-500" },
    { icon: Battery, title: "Battery", desc: `${lowBattery} sensors below 30%`, accent: "text-amber-500" },
  ]

  const alerts = [
    ...items.filter(i => i.status === "Critical").map(i => ({ id: i.id, msg: `${i.sensorId}: ${i.sensorType} ${i.value}${i.unit} critical \u2014 ${i.location}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Alert").map(i => ({ id: i.id, msg: `${i.sensorId}: ${i.sensorType} ${i.value}${i.unit} exceeds threshold \u2014 ${i.location}`, severity: "warning" as const })),
    ...items.filter(i => i.status === "Offline").map(i => ({ id: i.id, msg: `${i.sensorId}: Offline ${i.lastReading} \u2014 battery ${i.battery}%`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center"><Radio className="h-4 w-4 text-cyan-600" /></div>
            <div><h3 className="text-sm font-bold">IoT Sensor Dashboard</h3><p className="text-xs opacity-60">{items.length} sensors | {dcNames.length} DCs</p></div>
          </div>
          <div className="flex gap-1">
            {(["sensors", "zones", "health"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "sensors" ? "Sensors" : v === "zones" ? "Zones" : "Health"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Online", String(online), Wifi, "bg-emerald-50/50")}
          {statCard("Alerts", String(alertCount), AlertTriangle, "bg-red-50/50")}
          {statCard("Offline", String(offline), WifiOff, "bg-slate-50/50")}
          {statCard("Low Batt", String(lowBattery), Battery, "bg-amber-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {dcNames.map(d => {
            const active = activeFilters.dc === d
            return <span key={d} onClick={() => toggle("dc", active ? undefined : d)} className={`iot-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>{d.split(" ")[0]}</span>
          })}
          {activeFilters.dc && <span onClick={() => toggle("dc", undefined)} className="iot-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="iot-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="iot-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Sensor Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`iot-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-slate-400"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "sensors" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const isCritical = item.status === "Critical"
              const isAlert = item.status === "Alert"
              const isOffline = item.status === "Offline"
              const TIcon = typeIcons[item.sensorType] || Thermometer
              const SIcon = signalIcons[item.signal] || Signal
              const isHighAlert = item.value > item.thresholdHigh
              const isLowAlert = item.value < item.thresholdLow
              const pctInRange = Math.min(Math.max(((item.value - item.min) / (item.max - item.min)) * 100, 0), 100)
              return (
                <div key={item.id} className={`iot-sensor-card rounded-lg border p-2.5 bg-card ${isCritical ? "iot-critical-pulse" : isAlert ? "iot-alert-border" : isOffline ? "iot-offline-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="iot-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-700">{item.id}</span>
                      <TIcon className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-xs font-semibold">{item.sensorId}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.sensorType === "Temperature" ? "bg-red-100 text-red-700" : item.sensorType === "Humidity" ? "bg-blue-100 text-blue-700" : item.sensorType === "Motion" ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"}`}>{item.sensorType}</span>
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="text-[11px] opacity-70 mb-1">{item.dc} \u2014 {item.zone} | {item.location}</div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="text-lg font-bold iot-value-display">{item.value}{item.unit}</div>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`iot-range-bar h-full rounded-full ${isHighAlert || isLowAlert ? "bg-red-500" : "bg-cyan-500"}`} style={{ width: `${pctInRange}%` }} />
                      </div>
                      <div className="text-[9px] text-muted-foreground mt-0.5">Range: {item.min}{item.unit} \u2014 {item.max}{item.unit}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1"><SIcon className={`h-3 w-3 ${item.signal === "Strong" ? "text-emerald-500" : item.signal === "Medium" ? "text-amber-500" : item.signal === "Weak" ? "text-red-400" : "text-slate-400"}`} />{item.signal}</div>
                    <div className="flex items-center gap-1"><Battery className={`h-3 w-3 ${item.battery < 30 ? "text-red-500" : item.battery < 60 ? "text-amber-500" : "text-emerald-500"}`} />{item.battery}%</div>
                    <div className="flex items-center gap-1"><Eye className="h-3 w-3 opacity-40" />{item.lastReading}</div>
                    <div>FW: <span className="font-medium">{item.firmware}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "zones" && (
          <div className="space-y-2">
            {[...new Set(items.map(i => i.dc))].map(dc => {
              const dcItems = items.filter(i => i.dc === dc)
              const dcOnline = dcItems.filter(i => i.status === "Online").length
              const dcAlerts = dcItems.reduce((s, i) => s + i.alerts, 0)
              return (
                <div key={dc} className="iot-zone-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-500" /><span className="text-xs font-semibold">{dc}</span></div>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-emerald-600">{dcOnline}/{dcItems.length} online</span>
                      {dcAlerts > 0 && <span className="text-red-600">{dcAlerts} alerts</span>}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    {dcItems.map(si => (
                      <div key={si.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="font-mono opacity-50">{si.id}</span>{si.sensorType} <span className="opacity-40">{si.zone}</span></span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono">{si.value}{si.unit}</span>
                          <span className={statusColors[si.status] || ""}>{si.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "health" && (
          <div className="space-y-2">
            <div className="iot-health-header rounded-lg border p-2 bg-cyan-50/50">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div><div className="text-lg font-bold text-emerald-600">{Math.round((online / items.length) * 100)}%</div><div className="text-[10px] opacity-50">Uptime</div></div>
                <div><div className="text-lg font-bold text-amber-600">{Math.round(items.reduce((s, i) => s + i.battery, 0) / items.length)}%</div><div className="text-[10px] opacity-50">Avg Battery</div></div>
                <div><div className="text-lg font-bold text-red-600">{items.reduce((s, i) => s + i.alerts, 0)}</div><div className="text-[10px] opacity-50">Total Alerts</div></div>
                <div><div className="text-lg font-bold text-blue-600">{new Set(items.map(i => i.firmware)).size}</div><div className="text-[10px] opacity-50">FW Versions</div></div>
              </div>
            </div>
            {items.sort((a, b) => a.battery - b.battery).map(item => (
              <div key={item.id} className="iot-health-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.sensorId}</span>
                    <span className="text-[10px] opacity-50">{item.dc.split(" ")[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-12 rounded-full bg-muted overflow-hidden">
                      <div className={`iot-batt-bar h-full rounded-full ${item.battery < 30 ? "bg-red-500" : item.battery < 60 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${item.battery}%` }} />
                    </div>
                    <span className={`text-[10px] font-bold ${item.battery < 30 ? "text-red-600" : item.battery < 60 ? "text-amber-600" : "text-emerald-600"}`}>{item.battery}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-muted-foreground">
                  <div>Signal: <span className="font-medium">{item.signal}</span></div>
                  <div>Last: <span className="font-medium">{item.lastReading}</span></div>
                  <div>FW: <span className="font-medium">{item.firmware}</span></div>
                  <div>Alerts: <span className={`font-medium ${item.alerts > 0 ? "text-red-600" : ""}`}>{item.alerts}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
