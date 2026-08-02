"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ShieldCheck, Shield, FileText, AlertTriangle,
  Clock, MapPin, Timer,
  TrendingUp, ClipboardList, Globe, Ship, Plane,
  TrainFront, Truck
} from "lucide-react"

const raw = [
  { id: "CIG-01", policy: "IC-2024-MUM-0891", shipment: "SHP-45210", route: "Shanghai \u2192 Nhava Sheva", mode: "Sea", carrier: "MSC Isabella", dc: "Nhava Sheva DC", status: "Active", coverage: "All Risk", insured: 8500000, premium: 42500, declared: 7200000, claim: 0, expiry: "15 Aug", issued: "01 Jul", goods: "Electronics", insurer: "Bajaj Allianz", transit: 18, endorsed: true },
  { id: "CIG-02", policy: "IC-2024-DEL-0734", shipment: "SHP-45211", route: "Dubai \u2192 Delhi IGI", mode: "Air", carrier: "Emirates SkyCargo", dc: "Delhi DC", status: "Claim Filed", coverage: "Warehouse to Warehouse", insured: 3200000, premium: 19200, declared: 2800000, claim: 185000, expiry: "20 Aug", issued: "05 Jul", goods: "Pharmaceuticals", insurer: "HDFC ERGO", transit: 2, endorsed: true },
  { id: "CIG-03", policy: "IC-2024-BLR-0456", shipment: "SHP-45212", route: "Hamburg \u2192 Mundra", mode: "Sea", carrier: "Maersk Elba", dc: "Mundra DC", status: "Active", coverage: "ICC-A", insured: 5200000, premium: 26000, declared: 4800000, claim: 0, expiry: "10 Sep", issued: "10 Jul", goods: "Auto Parts", insurer: "ICICI Lombard", transit: 22, endorsed: true },
  { id: "CIG-04", policy: "IC-2024-HYD-0923", shipment: "SHP-45213", route: "Mumbai \u2192 Hyderabad", mode: "Road", carrier: "TCI Express", dc: "Hyderabad DC", status: "Expired", coverage: "Transit Only", insured: 1800000, premium: 9000, declared: 1500000, claim: 0, expiry: "25 Jul", issued: "25 Jun", goods: "FMCG", insurer: "New India Assurance", transit: 1, endorsed: false },
  { id: "CIG-05", policy: "IC-2024-CHE-0567", shipment: "SHP-45214", route: "Singapore \u2192 Chennai", mode: "Sea", carrier: "Ever Given", dc: "Chennai DC", status: "Active", coverage: "All Risk", insured: 6800000, premium: 34000, declared: 6000000, claim: 0, expiry: "18 Aug", issued: "03 Jul", goods: "Apparel", insurer: "Bajaj Allianz", transit: 8, endorsed: true },
  { id: "CIG-06", policy: "IC-2024-KOL-0389", shipment: "SHP-45215", route: "Kolkata \u2192 Delhi", mode: "Rail", carrier: "Indian Railways CC", dc: "Kolkata DC", status: "Claim Approved", coverage: "Rail Cargo", insured: 4100000, premium: 20500, declared: 3800000, claim: 92000, expiry: "22 Aug", issued: "08 Jul", goods: "Machinery", insurer: "United India Insurance", transit: 4, endorsed: true },
  { id: "CIG-07", policy: "IC-2024-TUT-0214", shipment: "SHP-45216", route: "Colombo \u2192 Tuticorin", mode: "Sea", carrier: "CMA CGM Tigris", dc: "Tuticorin DC", status: "Active", coverage: "ICC-B", insured: 2500000, premium: 15000, declared: 2200000, claim: 0, expiry: "05 Aug", issued: "15 Jul", goods: "Tea & Spices", insurer: "Oriental Insurance", transit: 3, endorsed: true },
  { id: "CIG-08", policy: "IC-2024-VIZ-0778", shipment: "SHP-45217", route: "Busan \u2192 Vizag", mode: "Sea", carrier: "Cosco Pride", dc: "Visakhapatnam DC", status: "Pending Renewal", coverage: "All Risk", insured: 9200000, premium: 46000, declared: 8500000, claim: 0, expiry: "30 Jul", issued: "01 Jul", goods: "Steel Sheets", insurer: "HDFC ERGO", transit: 12, endorsed: false },
  { id: "CIG-09", policy: "IC-2024-KAN-0641", shipment: "SHP-45218", route: "Jebel Ali \u2192 Kandla", mode: "Sea", carrier: "Maersk Elba", dc: "Kandla DC", status: "Under Review", coverage: "Warehouse to Warehouse", insured: 3800000, premium: 19000, declared: 3400000, claim: 45000, expiry: "12 Sep", issued: "12 Jul", goods: "Chemicals", insurer: "ICICI Lombard", transit: 10, endorsed: true },
  { id: "CIG-10", policy: "IC-2024-MUM-1002", shipment: "SHP-45219", route: "Tokyo \u2192 Mumbai", mode: "Air", carrier: "ANA Cargo", dc: "Mumbai DC", status: "Claim Filed", coverage: "ICC-A", insured: 15000000, premium: 75000, declared: 12800000, claim: 340000, expiry: "25 Aug", issued: "06 Jul", goods: "Semiconductors", insurer: "New India Assurance", transit: 1, endorsed: true },
]

interface InsItem {
  id: string; policy: string; shipment: string; route: string; mode: string
  carrier: string; dc: string; status: string; coverage: string
  insured: number; premium: number; declared: number; claim: number
  expiry: string; issued: string; goods: string; insurer: string
  transit: number; endorsed: boolean
}

const items: InsItem[] = raw.map((r: any) => ({
  id: r.id, policy: r.policy, shipment: r.shipment, route: r.route,
  mode: r.mode, carrier: r.carrier, dc: r.dc, status: r.status,
  coverage: r.coverage, insured: r.insured, premium: r.premium,
  declared: r.declared, claim: r.claim, expiry: r.expiry, issued: r.issued,
  goods: r.goods, insurer: r.insurer, transit: r.transit, endorsed: r.endorsed,
}))

const statusColors: Record<string, string> = {
  "Active": "text-emerald-600", "Claim Filed": "text-orange-600 font-semibold",
  "Expired": "text-muted-foreground", "Pending Renewal": "text-amber-600 font-semibold",
  "Claim Approved": "text-blue-600", "Under Review": "text-violet-600",
}

const modeIcons: Record<string, React.ElementType> = { Sea: Ship, Air: Plane, Rail: TrainFront, Road: Truck }
const modes = [...new Set(items.map(i => i.mode))]
const insurers = [...new Set(items.map(i => i.insurer))]

type Rec = any
type FV = Record<string, string>
type VT = "policies" | "insurers" | "claims"

function statCard(label: string, val: string, icon: React.ElementType, accent: string) {
  const SIcon = icon
  return <div className={`cig-stat-card rounded-lg p-3 ${accent}`}><div className="flex items-center gap-2 mb-1"><SIcon className="h-4 w-4 opacity-70" /><span className="text-xs font-medium opacity-70">{label}</span></div><div className="text-lg font-bold">{val}</div></div>
}

function fmtAmt(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`
  return `\u20b9${(n / 1000).toFixed(1)}K`
}

export function CargoInsurancePanel() {
  const [activeFilters, setActiveFilters] = useState<FV>({})
  const [view, setView] = useState<VT>("policies")

  const filtered = items.filter((r) => {
    type Rec = any
    const p: FV = Object.assign({}, activeFilters)
    return Object.entries(p).every(([k, v]) => r[k as keyof Rec] === v)
  })

  const totalInsured = items.reduce((s, i) => s + i.insured, 0)
  const totalPremium = items.reduce((s, i) => s + i.premium, 0)
  const totalClaim = items.filter(i => i.claim > 0).reduce((s, i) => s + i.claim, 0)
  const activePolicies = items.filter(i => i.status === "Active").length
  const claimCount = items.filter(i => i.status === "Claim Filed" || i.status === "Claim Approved").length
  const expiringSoon = items.filter(i => i.status === "Pending Renewal" || i.status === "Expired").length

  const toggle = (k: string, nv: string | undefined) => {
    const n = Object.assign({}, activeFilters)
    if (nv === undefined) { delete n[k] } else { n[k] = nv }
    setActiveFilters(n)
  }

  const insights = [
    { icon: ShieldCheck, title: "Covered", desc: `${fmtAmt(totalInsured)} total coverage`, accent: "text-emerald-500" },
    { icon: AlertTriangle, title: "Claims", desc: `${claimCount} active claims (${fmtAmt(totalClaim)})`, accent: "text-red-500" },
    { icon: Clock, title: "Expiring", desc: `${expiringSoon} policies need attention`, accent: "text-amber-500" },
  ]

  const alerts = [
    ...items.filter(i => i.status === "Claim Filed").map(i => ({ id: i.id, msg: `${i.policy}: ${fmtAmt(i.claim)} claim — ${i.goods}`, severity: "critical" as const })),
    ...items.filter(i => i.status === "Pending Renewal").map(i => ({ id: i.id, msg: `${i.policy}: Expires ${i.expiry} — renewal pending`, severity: "warning" as const })),
    ...items.filter(i => !i.endorsed && i.status === "Active").map(i => ({ id: i.id, msg: `${i.policy}: Not yet endorsed`, severity: "info" as const })),
  ].slice(0, 5)

  return (
    <Card className="card-depth overflow-hidden border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center"><Shield className="h-4 w-4 text-rose-600" /></div>
            <div><h3 className="text-sm font-bold">Cargo Insurance</h3><p className="text-xs opacity-60">{items.length} policies across {modes.length} modes</p></div>
          </div>
          <div className="flex gap-1">
            {(["policies", "insurers", "claims"] as VT[]).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} className="h-7 text-xs px-2" onClick={() => setView(v)}>
                {v === "policies" ? "Policies" : v === "insurers" ? "Insurers" : "Claims"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {statCard("Policies", String(items.length), ClipboardList, "bg-rose-50/50")}
          {statCard("Active", String(activePolicies), ShieldCheck, "bg-emerald-50/50")}
          {statCard("Premium", fmtAmt(totalPremium), TrendingUp, "bg-blue-50/50")}
          {statCard("Claims", String(claimCount), AlertTriangle, "bg-red-50/50")}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {modes.map(m => {
            const active = activeFilters.mode === m
            const MIcon = modeIcons[m] || Truck
            return <span key={m} onClick={() => toggle("mode", active ? undefined : m)} className={`cig-filter-pill text-xs px-2 py-0.5 rounded-full cursor-pointer select-none flex items-center gap-1 ${active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}><MIcon className="h-3 w-3" />{m}</span>
          })}
          {activeFilters.mode && <span onClick={() => toggle("mode", undefined)} className="cig-filter-clear text-xs px-1.5 py-0.5 rounded cursor-pointer text-red-500 hover:bg-red-50">\u2715</span>}
        </div>

        <div className="cig-insights-row flex gap-2 mb-3">
          {insights.map((sc, idx) => { const Ic = sc.icon; return (
            <div key={idx} className="flex-1 rounded-md border p-2 bg-muted/20">
              <div className="flex items-center gap-1.5 mb-0.5"><Ic className={`h-3.5 w-3.5 ${sc.accent}`} /><span className="text-[10px] font-semibold">{sc.title}</span></div>
              <p className="text-[11px] opacity-70">{sc.desc}</p>
            </div>
          )})}
        </div>

        {alerts.length > 0 && (
          <div className="cig-alerts-list rounded-lg border border-red-200/50 bg-red-50/30 p-2 mb-3 space-y-1">
            <div className="text-[10px] font-semibold text-red-600 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Insurance Alerts ({alerts.length})</div>
            {alerts.map((a, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px]">
                <span className={`cig-alert-dot h-1.5 w-1.5 rounded-full mt-0.5 shrink-0 ${a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-foreground/80"><span className="font-mono opacity-60">{a.id}</span> {a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {view === "policies" && (
          <div className="space-y-1.5">
            {filtered.map(item => {
              const MIcon = modeIcons[item.mode] || Truck
              const isClaim = item.status === "Claim Filed"
              const isExpired = item.status === "Expired" || item.status === "Pending Renewal"
              const coveragePct = item.insured > 0 ? Math.min(100, (item.declared / item.insured) * 100) : 0
              return (
                <div key={item.id} className={`cig-policy-card rounded-lg border p-2.5 bg-card ${isClaim ? "cig-claim-pulse" : isExpired ? "cig-expired-border" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="cig-id-badge text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">{item.id}</span>
                      <div className="flex items-center gap-1.5">
                        <MIcon className={`h-3.5 w-3.5 ${item.mode === "Sea" ? "text-blue-500" : item.mode === "Air" ? "text-sky-500" : item.mode === "Rail" ? "text-orange-500" : "text-green-600"}`} />
                        <span className="text-xs font-semibold">{item.goods}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {!item.endorsed && <span className="text-[10px] px-1 py-0.5 rounded bg-amber-100 text-amber-700">No Endorse</span>}
                      <span className={`text-[10px] ${statusColors[item.status] || "text-muted-foreground"}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] mb-1.5">
                    <div className="flex items-center gap-1"><Globe className="h-3 w-3 opacity-40" />{item.route}</div>
                    <div className="flex items-center gap-1"><FileText className="h-3 w-3 opacity-40" />{item.insurer}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-40" />{item.dc}</div>
                    <div className="flex items-center gap-1"><Timer className="h-3 w-3 opacity-40" />{item.coverage} ({item.transit}d)</div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] w-14">Coverage</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full transition-all ${coveragePct > 85 ? "bg-emerald-500" : coveragePct > 70 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${coveragePct}%` }} /></div>
                    <span className="text-[10px] font-mono w-20 text-right">{fmtAmt(item.declared)}/{fmtAmt(item.insured)}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-muted-foreground">
                    <div>Premium: <span className="font-medium text-foreground">{fmtAmt(item.premium)}</span></div>
                    <div>Claim: <span className={`font-medium ${item.claim > 0 ? "text-red-500" : "text-foreground"}`}>{item.claim > 0 ? fmtAmt(item.claim) : "\u2014"}</span></div>
                    <div>Issued: <span className="font-medium text-foreground">{item.issued}</span></div>
                    <div>Expiry: <span className={`font-medium ${item.status === "Expired" || item.status === "Pending Renewal" ? "text-red-500" : "text-foreground"}`}>{item.expiry}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "insurers" && (
          <div className="space-y-2">
            {insurers.map(ins => {
              const insItems = items.filter(i => i.insurer === ins)
              const insTotal = insItems.reduce((s, i) => s + i.insured, 0)
              const insPremium = insItems.reduce((s, i) => s + i.premium, 0)
              const insClaims = insItems.filter(i => i.claim > 0).reduce((s, i) => s + i.claim, 0)
              return (
                <div key={ins} className="cig-insurer-card rounded-lg border p-2.5 bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /><span className="text-xs font-semibold">{ins}</span></div>
                    <span className="text-[10px] opacity-50">{insItems.length} policies</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="cig-insurer-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{fmtAmt(insTotal)}</div><div className="opacity-50">Coverage</div></div>
                    <div className="cig-insurer-metric rounded-md bg-muted/30 p-1.5 text-center"><div className="font-bold text-sm">{fmtAmt(insPremium)}</div><div className="opacity-50">Premium</div></div>
                    <div className="cig-insurer-metric rounded-md bg-muted/30 p-1.5 text-center"><div className={`font-bold text-sm ${insClaims > 0 ? "text-red-500" : "text-foreground"}`}>{fmtAmt(insClaims)}</div><div className="opacity-50">Claims</div></div>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {insItems.map(ii => (
                      <div key={ii.id} className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5"><span className="font-mono opacity-50">{ii.id}</span>{ii.goods} <span className="opacity-40">({ii.mode})</span></span>
                        <span className={statusColors[ii.status] || ""}>{ii.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === "claims" && (
          <div className="space-y-2">
            <div className="cig-claim-header rounded-lg border p-2 bg-red-50/30">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div><div className="text-lg font-bold text-red-600">{fmtAmt(totalClaim)}</div><div className="text-[10px] opacity-50">Total Claims</div></div>
                <div><div className="text-lg font-bold text-orange-600">{claimCount}</div><div className="text-[10px] opacity-50">Active Claims</div></div>
              </div>
            </div>
            {items.filter(i => i.claim > 0).sort((a, b) => b.claim - a.claim).map(item => (
              <div key={item.id} className="cig-claim-row rounded-lg border p-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                    <span className="text-xs font-semibold">{item.goods}</span>
                    <span className="text-[10px] opacity-50">{item.insurer}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${item.status === "Claim Filed" ? "text-orange-600" : "text-blue-600"}`}>{fmtAmt(item.claim)}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-muted-foreground">
                  <div>Policy: <span className="font-medium text-foreground">{item.policy.slice(-8)}</span></div>
                  <div>Route: <span className="font-medium text-foreground">{item.route.split(" \u2192 ")[0]}</span></div>
                  <div>Coverage: <span className="font-medium text-foreground">{item.coverage}</span></div>
                  <div>Status: <span className={`font-medium ${statusColors[item.status] || ""}`}>{item.status}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
