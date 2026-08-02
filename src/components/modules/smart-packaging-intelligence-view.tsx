"use client"
import { useState } from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb"

const COLORS = ["#059669","#10b981","#34d399","#6ee7b7","#047857","#065f46","#064e3b","#d1fae5"]
const PACKAGING_TYPES = ["Corrugated Box","Shrink Wrap","Bubble Wrap","Foam Insert","Air Column","Wooden Crate","Thermoform","Molded Pulp"]
const CATEGORIES = ["Electronics","FMCG","Pharma","Apparel","Auto Parts","E-Commerce","Fragile Items","Industrial"]
const SUSTAINABILITY = ["Platinum","Gold","Silver","Bronze","Certified","Pending"]
const SUPPLIERS = ["PackPro India","EcoWrap Chennai","FoamTech NCR","WrapTech Pune","KraftPack BLR","AirCush HYD","PolyPack CCU","GreenBox MUM"]
const STATUS = ["Optimized","Under Review","Cost Excessive","Over-Packaged","Eco Non-Compliant","Active"]

function ri(min: number, max: number, value: number) { return Math.max(min, Math.min(max, value)) }

const jobs = [
  { id:"SPI-0001", sku:"SKU-ELEC-4401", product:"LED TV 55\" Samsung", category:"Electronics", packagingType:"Corrugated Box", sustainability:"Platinum", status:"Optimized", originalCost:185, optimizedCost:142, savings:43, materialWeight:2.8, protectionScore:95, damageRate:0.4, supplier:"PackPro India", warehouse:"Mumbai DC", volumeCbm:0.12 },
  { id:"SPI-0002", sku:"SKU-FMCG-2201", product:"Parle-G Biscuit 1kg", category:"FMCG", packagingType:"Shrink Wrap", sustainability:"Gold", status:"Optimized", originalCost:12, optimizedCost:9, savings:3, materialWeight:0.05, protectionScore:78, damageRate:0.2, supplier:"EcoWrap Chennai", warehouse:"Chennai DC", volumeCbm:0.003 },
  { id:"SPI-0003", sku:"SKU-PHAR-1101", product:"Insulin Pen 3-Pack", category:"Pharma", packagingType:"Thermoform", sustainability:"Platinum", status:"Active", originalCost:145, optimizedCost:118, savings:27, materialWeight:0.8, protectionScore:99, damageRate:0.1, supplier:"FoamTech NCR", warehouse:"Delhi Hub", volumeCbm:0.025 },
  { id:"SPI-0004", sku:"SKU-APP-3301", product:"Banarasi Silk Saree Set", category:"Apparel", packagingType:"Bubble Wrap", sustainability:"Silver", status:"Optimized", originalCost:42, optimizedCost:35, savings:7, materialWeight:0.3, protectionScore:88, damageRate:0.5, supplier:"WrapTech Pune", warehouse:"Pune WH", volumeCbm:0.015 },
  { id:"SPI-0005", sku:"SKU-AUTO-5501", product:"Engine Gasket Kit Maruti", category:"Auto Parts", packagingType:"Foam Insert", sustainability:"Gold", status:"Under Review", originalCost:128, optimizedCost:105, savings:23, materialWeight:1.2, protectionScore:92, damageRate:0.3, supplier:"FoamTech NCR", warehouse:"Delhi Hub", volumeCbm:0.04 },
  { id:"SPI-0006", sku:"SKU-ECOM-6601", product:"Mobile Phone Case Combo", category:"E-Commerce", packagingType:"Air Column", sustainability:"Silver", status:"Cost Excessive", originalCost:28, optimizedCost:24, savings:4, materialWeight:0.15, protectionScore:82, damageRate:1.8, supplier:"AirCush HYD", warehouse:"Hyderabad DC", volumeCbm:0.008 },
  { id:"SPI-0007", sku:"SKU-FRAG-7701", product:"Ceramic Puja Set Rajasthani", category:"Fragile Items", packagingType:"Wooden Crate", sustainability:"Bronze", status:"Eco Non-Compliant", originalCost:165, optimizedCost:148, savings:17, materialWeight:5.2, protectionScore:97, damageRate:0.2, supplier:"KraftPack BLR", warehouse:"Bangalore FC", volumeCbm:0.35 },
  { id:"SPI-0008", sku:"SKU-INDS-8801", product:"Steel Bearings 20kg Lot", category:"Industrial", packagingType:"Molded Pulp", sustainability:"Gold", status:"Optimized", originalCost:85, optimizedCost:62, savings:23, materialWeight:3.8, protectionScore:91, damageRate:0.6, supplier:"GreenBox MUM", warehouse:"Mumbai DC", volumeCbm:0.08 },
  { id:"SPI-0009", sku:"SKU-ELEC-4402", product:"Wireless Earbuds Bose", category:"Electronics", packagingType:"Foam Insert", sustainability:"Silver", status:"Over-Packaged", originalCost:55, optimizedCost:38, savings:17, materialWeight:0.45, protectionScore:94, damageRate:0.3, supplier:"FoamTech NCR", warehouse:"Delhi Hub", volumeCbm:0.02 },
  { id:"SPI-0010", sku:"SKU-FMCG-2202", product:"Aashirvaad Atta 10kg", category:"FMCG", packagingType:"Corrugated Box", sustainability:"Gold", status:"Optimized", originalCost:18, optimizedCost:14, savings:4, materialWeight:0.6, protectionScore:85, damageRate:0.4, supplier:"PackPro India", warehouse:"Mumbai DC", volumeCbm:0.06 },
  { id:"SPI-0011", sku:"SKU-ELEC-4403", product:"Fire-Boltt Smart Watch", category:"Electronics", packagingType:"Bubble Wrap", sustainability:"Certified", status:"Optimized", originalCost:45, optimizedCost:32, savings:13, materialWeight:0.22, protectionScore:87, damageRate:0.7, supplier:"WrapTech Pune", warehouse:"Pune WH", volumeCbm:0.012 },
  { id:"SPI-0012", sku:"SKU-ECOM-6602", product:"Polaroid Sunglasses Pack", category:"E-Commerce", packagingType:"Shrink Wrap", sustainability:"Pending", status:"Cost Excessive", originalCost:22, optimizedCost:19, savings:3, materialWeight:0.1, protectionScore:76, damageRate:2.1, supplier:"PolyPack CCU", warehouse:"Kolkata WH", volumeCbm:0.005 },
  { id:"SPI-0013", sku:"SKU-PHAR-1102", product:"COVID Rapid Test Kit 50", category:"Pharma", packagingType:"Thermoform", sustainability:"Platinum", status:"Active", originalCost:95, optimizedCost:72, savings:23, materialWeight:0.55, protectionScore:98, damageRate:0.15, supplier:"EcoWrap Chennai", warehouse:"Chennai DC", volumeCbm:0.018 },
  { id:"SPI-0014", sku:"SKU-APP-3302", product:"Levi's Denim Jeans", category:"Apparel", packagingType:"Corrugated Box", sustainability:"Certified", status:"Under Review", originalCost:15, optimizedCost:12, savings:3, materialWeight:0.35, protectionScore:80, damageRate:0.9, supplier:"KraftPack BLR", warehouse:"Bangalore FC", volumeCbm:0.022 },
]

const catBar = CATEGORIES.map(c => ({ name: c.slice(0, 8), jobs: jobs.filter(j => j.category === c).length }))
const monthlyTrend = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => ({ month: m, savings: +(8 + i * 2.5 + Math.sin(i) * 3).toFixed(1) }))
const typePie = PACKAGING_TYPES.map(t => ({ name: t, value: jobs.filter(j => j.packagingType === t).length + Math.floor(Math.random() * 4) }))
const matCost = PACKAGING_TYPES.map(t => ({ name: t.slice(0, 8), cost: +(20 + Math.random() * 120).toFixed(0) }))
const sustPie = SUSTAINABILITY.map(s => ({ name: s, value: jobs.filter(j => j.sustainability === s).length + Math.floor(Math.random() * 5) }))
const dmgTrend = ["Jan","Feb","Mar","Apr","May","Jun"].map(m => ({ month: m, Electronics: +(0.3 + Math.random()).toFixed(1), FMCG: +(0.1 + Math.random() * 0.5).toFixed(1), Pharma: +(0.05 + Math.random() * 0.3).toFixed(1) }))

const catColors: Record<string, string> = { Electronics:"bg-blue-100 text-blue-800", FMCG:"bg-orange-100 text-orange-800", Pharma:"bg-violet-100 text-violet-800", Apparel:"bg-pink-100 text-pink-800", "Auto Parts":"bg-amber-100 text-amber-800", "E-Commerce":"bg-cyan-100 text-cyan-800", "Fragile Items":"bg-red-100 text-red-800", Industrial:"bg-slate-200 text-slate-800" }
const sustColors: Record<string, string> = { Platinum:"bg-emerald-100 text-emerald-800", Gold:"bg-yellow-100 text-yellow-800", Silver:"bg-gray-200 text-gray-700", Bronze:"bg-amber-200 text-amber-900", Certified:"bg-teal-100 text-teal-800", Pending:"bg-gray-100 text-gray-600" }
const statColors: Record<string, string> = { Optimized:"bg-emerald-100 text-emerald-800", "Under Review":"bg-blue-100 text-blue-800", "Cost Excessive":"bg-orange-100 text-orange-800", "Over-Packaged":"bg-yellow-100 text-yellow-800", "Eco Non-Compliant":"bg-red-100 text-red-800", Active:"bg-cyan-100 text-cyan-800" }

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="spi-kpi"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="spi-kpi-val mt-1 text-2xl font-bold" style={{color:"#059669"}}>{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}
function CostBar({ cost }: { cost: number }) {
  const pct = ri(0, 100, (cost / 185) * 100)
  return <div className="spi-cost-bar flex items-center gap-1"><div className="h-1.5 w-16 rounded-full bg-gray-200"><div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">\u20b9{cost}</span></div>
}
function ProtectionBar({ score }: { score: number }) {
  const pct = ri(0, 100, score)
  const col = pct >= 90 ? "#059669" : pct >= 75 ? "#d97706" : "#dc2626";
  return <div className="spi-prot-bar flex items-center gap-1"><div className="h-1.5 w-14 rounded-full bg-gray-200"><div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: col }} /></div><span className="text-xs text-gray-500">{score}%</span></div>
}

const filterGroups = [
  { key: "packagingType", label: "Type", options: PACKAGING_TYPES.map(t => ({ label: t, value: t, count: jobs.filter(j => j.packagingType === t).length })) },
  { key: "category", label: "Category", options: CATEGORIES.map(c => ({ label: c, value: c, count: jobs.filter(j => j.category === c).length })) },
  { key: "status", label: "Status", options: STATUS.map(s => ({ label: s, value: s, count: jobs.filter(j => j.status === s).length })) },
  { key: "sustainability", label: "Sustainability", options: SUSTAINABILITY.map(s => ({ label: s, value: s, count: jobs.filter(j => j.sustainability === s).length })) },
]

export default function SmartPackagingIntelligenceView() {
  const [tab, setTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (p[k] || []).includes(v)
    ? (function(){ const n = {...p}; n[k] = (n[k]||[]).filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })()
    : { ...p, [k]: [...(p[k] || []), v] })
  const filtered = jobs.filter(j => {
    const q = searchQuery.toLowerCase()
    if (q && !["id","sku","product","category","packagingType","supplier","warehouse"].some(k => (j as any)[k].toLowerCase().includes(q))) return false
    return Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(j[k as keyof typeof j] as string))
  })
  const avgSavings = ((jobs.reduce((s, j) => s + (j.savings / j.originalCost) * 100, 0) / jobs.length)).toFixed(1)
  const avgCostSave = (jobs.reduce((s, j) => s + j.savings, 0) / jobs.length).toFixed(1)
  const avgSustScore = ((jobs.filter(j => ["Platinum","Gold"].includes(j.sustainability)).length / jobs.length * 100)).toFixed(0)

  return (
    <div className="spi-container space-y-4">
      <PageHeader title="Smart Packaging Intelligence" description="AI-powered packaging optimization for Indian logistics - right-sizing, material selection, cost reduction, sustainability scoring, and damage prevention across 8 product categories and 8 packaging types" />
      <ModuleBreadcrumb items={[{ label: "Logistics" }, { label: "Packaging" }, { label: "Intelligence" }]} />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="spi-tabs-list">{["Dashboard","Packaging Jobs","Materials","Insights"].map((l, i) => <TabsTrigger key={i} value={l.toLowerCase().replace(/ /g,"")}>{l}</TabsTrigger>)}</TabsList>

        <TabsContent value="dashboard" className="space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Packaging Jobs" value={jobs.length.toString()} sub="Across all categories" />
            <KpiTile title="Optimization Rate" value={`${avgSavings}%`} sub="Avg cost reduction per unit" />
            <KpiTile title="Avg Cost Savings" value={`\u20b9${avgCostSave}/unit`} sub="Per packaging job" />
            <KpiTile title="Sustainability Score" value={`${avgSustScore}%`} sub="Platinum + Gold rated" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Jobs by Category</CardTitle></CardHeader><CardContent><BarChart data={catBar} width={300} height={200}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" fontSize={10}/><YAxis fontSize={11}/><Tooltip/><Bar dataKey="jobs" fill="#059669" radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Cost Savings Trend (\u20b9/unit)</CardTitle></CardHeader><CardContent><AreaChart data={monthlyTrend} width={300} height={200}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={11}/><YAxis fontSize={11}/><Tooltip/><Area type="monotone" dataKey="savings" stroke="#059669" fill="#d1fae5"/></AreaChart></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Packaging Type Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={typePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>{typePie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="packagingjobs" className="space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={jobs.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, SKU, product, category, supplier..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="spi-table w-full text-sm">
              <thead><tr className="bg-gray-50"><th className="px-2 py-2 text-left font-medium text-xs">ID</th><th className="px-2 py-2 text-left font-medium text-xs">SKU</th><th className="px-2 py-2 text-left font-medium text-xs">Product</th><th className="px-2 py-2 text-left font-medium text-xs">Category</th><th className="px-2 py-2 text-left font-medium text-xs">Type</th><th className="px-2 py-2 text-left font-medium text-xs">Sustainability</th><th className="px-2 py-2 text-left font-medium text-xs">Status</th><th className="px-2 py-2 text-left font-medium text-xs">Orig Cost</th><th className="px-2 py-2 text-left font-medium text-xs">Opt Cost</th><th className="px-2 py-2 text-left font-medium text-xs">Savings</th><th className="px-2 py-2 text-left font-medium text-xs">Protection</th><th className="px-2 py-2 text-left font-medium text-xs">Damage</th><th className="px-2 py-2 text-left font-medium text-xs">Supplier</th></tr></thead>
              <tbody>{filtered.map(j => {
                const rowCls = j.status === "Eco Non-Compliant" ? "spi-row-critical" : (j.status === "Cost Excessive" || j.status === "Over-Packaged") ? "spi-row-warning" : ""
                return (
                <tr key={j.id} className={`${rowCls} border-t hover:bg-gray-50 transition-colors`}>
                  <td className="px-2 py-1.5 font-mono text-xs">{j.id}</td>
                  <td className="px-2 py-1.5 text-xs">{j.sku}</td>
                  <td className="px-2 py-1.5 text-xs font-medium">{j.product}</td>
                  <td className="px-2 py-1.5"><span className={`spi-cat-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${catColors[j.category] || ""}`}>{j.category}</span></td>
                  <td className="px-2 py-1.5"><span className="spi-type-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-800">{j.packagingType}</span></td>
                  <td className="px-2 py-1.5"><span className={`spi-sust-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${sustColors[j.sustainability] || ""}`} style={j.sustainability === "Platinum" ? { boxShadow: "0 0 6px #059669" } : {}}>{j.sustainability}</span></td>
                  <td className="px-2 py-1.5"><span className={`spi-stat-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statColors[j.status] || ""}`}>{j.status}</span></td>
                  <td className="px-2 py-1.5"><CostBar cost={j.originalCost}/></td>
                  <td className="px-2 py-1.5 text-xs">\u20b9{j.optimizedCost}</td>
                  <td className="px-2 py-1.5"><span className="spi-savings-badge text-xs font-semibold text-emerald-700">\u20b9{j.savings} ({((j.savings/j.originalCost)*100).toFixed(1)}%)</span></td>
                  <td className="px-2 py-1.5"><ProtectionBar score={j.protectionScore}/></td>
                  <td className="px-2 py-1.5 text-xs">{j.damageRate}%</td>
                  <td className="px-2 py-1.5 text-xs">{j.supplier}</td>
                </tr>)
              })}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Cost by Packaging Type (\u20b9)</CardTitle></CardHeader><CardContent><BarChart data={matCost} width={300} height={220}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={45}/><YAxis fontSize={11}/><Tooltip/><Bar dataKey="cost" fill="#047857" radius={[4,4,0,0]}/></BarChart></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Material Sustainability Distribution</CardTitle></CardHeader><CardContent><PieChart width={300} height={220}><Pie data={sustPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>{sustPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}</Pie><Tooltip/></PieChart></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Damage Rate Trend by Category (%)</CardTitle></CardHeader><CardContent><LineChart data={dmgTrend} width={300} height={220}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month" fontSize={11}/><YAxis fontSize={11}/><Tooltip/><Line type="monotone" dataKey="Electronics" stroke="#059669" strokeWidth={2}/><Line type="monotone" dataKey="FMCG" stroke="#10b981" strokeWidth={2}/><Line type="monotone" dataKey="Pharma" stroke="#34d399" strokeWidth={2}/></LineChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Plastic Ban India: Impact on Logistics Packaging</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>India's single-use plastic ban effective July 2022 under the Plastic Waste Management Amendment Rules has fundamentally transformed logistics packaging across the country. The ban on plastic carry bags below 75 microns thickness, single-use straws, cutlery, and PVC shrink films below 50 microns has forced logistics operators to rapidly transition to alternative packaging materials. Major e-commerce players including Amazon India, Flipkart, and Meesho have replaced 78% of their plastic packaging with corrugated boxes, paper-based cushioning, and compostable mailers. The Central Pollution Control Board (CPCB) reports that packaging waste from logistics has reduced by 34% in Tier-1 cities since enforcement began. However, challenges persist in Tier-2 and Tier-3 cities where alternative material supply chains are underdeveloped and cost differentials of 15-25% over conventional plastic packaging impact SMB logistics operators. Extended Producer Responsibility (EPR) registration under PWM Rules 2016 now mandates packaging producers to collect and recycle 100% of their packaging waste, creating new reverse logistics requirements for packaging material recovery. States like Maharashtra, Tamil Nadu, and Karnataka have implemented additional restrictions beyond national mandates, requiring logistics companies to maintain dual packaging compliance matrices for interstate shipments.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-red-800">Regulatory</span><span className="text-gray-400">Active Policy</span></div></CardContent></Card>
            <Card className="hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">AI-Driven Packaging Optimization: Right-Sizing &amp; Material Selection</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Machine learning models for packaging optimization are delivering 18-32% cost savings for Indian logistics companies by analyzing 3D product dimensions, fragility scores, transit stress profiles, and destination pincode-level damage probability data. Computer vision systems at fulfillment centers scan incoming SKUs and recommend optimal box sizes from a catalog of 47 standard packaging dimensions, reducing void fill by up to 45% and lowering dimensional weight charges charged by courier partners. Deep learning models trained on 2.4 million historical shipment records predict the exact cushioning material quantity needed for each SKU-destination-lane combination with 91% accuracy, preventing both under-packaging (causing damage) and over-packaging (wasting material). Companies like Delhivery and Xpressbees have deployed real-time packaging optimization engines that dynamically select between corrugated boxes, bubble mailers, poly mailers, and paper tubes based on product category, order value, and delivery SLA. Reinforcement learning agents continuously improve packaging decisions by incorporating damage claim data, customer NPS feedback on packaging quality, and freight cost variations. The average ROI on AI packaging optimization systems deployed across 15 Indian 3PL companies shows payback within 8-11 months with sustained annual savings of \u20b94.2 crore per fulfillment center processing 50,000+ daily shipments.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">Innovation</span><span className="text-gray-400">Production</span></div></CardContent></Card>
            <Card className="hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Reverse Logistics Packaging: Reusable Solutions for Indian E-Commerce Returns</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>India's e-commerce return rate of 25-40% across fashion and electronics categories generates massive packaging waste, with an estimated 180 crore individual packaging units discarded annually from returns alone. Innovative reusable packaging systems are emerging as a sustainable solution, with companies like Ecoplast and Replast developing durable polypropylene shipping pouches rated for 50+ reuse cycles that withstand India's diverse climate conditions from Ladakh's sub-zero temperatures to Chennai's tropical humidity. Flipkart's pilot program with reusable packaging boxes in Bengaluru and Hyderabad showed 62% adoption rate among customers and 71% reduction in single-use packaging material for return shipments. The economics of reusable packaging become favorable at 7-9 reuse cycles when accounting for material procurement savings, EPR compliance cost reduction, and brand sustainability perception improvement. IoT-enabled smart packaging with RFID tags and QR codes enables real-time tracking of reusable packaging assets through the return-repack-redispatch cycle, reducing packaging loss rates from 18% to under 4%. Deposit-return models where customers receive \u20b910-30 refundable deposit on reusable packaging are being tested by Nykaa and Myntra for their premium product categories, with early data showing 89% return rate for reusable packaging assets and positive customer sentiment scores of 4.2 out of 5.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">Circular</span><span className="text-gray-400">Pilot Phase</span></div></CardContent></Card>
            <Card className="hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Molded Pulp Revolution: Agricultural Waste-Based Packaging from Bagasse &amp; Rice Husk</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Molded pulp packaging manufactured from sugarcane bagasse and rice husk is rapidly gaining adoption in Indian logistics as a cost-effective, fully biodegradable alternative to EPS foam and plastic inserts. India generates 120 million tonnes of sugarcane bagasse annually from 500+ sugar mills concentrated in Uttar Pradesh, Maharashtra, and Karnataka, providing abundant raw material at near-zero cost for packaging manufacturers. Companies like Yash Papers (Faizabad), Green Pack Industries (Kolkata), and Pakka Limited (Ayodhya) have developed proprietary pulp molding formulations achieving compression strengths of 250-400 kPa suitable for protecting electronics, glassware, and pharmaceutical products during transit. The molded pulp production process consumes 78% less energy and 85% less water compared to virgin corrugated board manufacturing, making it the most environmentally favorable rigid packaging option available at scale in India. Cost per unit has declined 38% over the past three years to \u20b98-22 per insert depending on complexity, making it competitive with EPS foam at \u20b912-28 per unit. Major adoption is driven by Samsung India, Xiaomi, and OnePlus for smartphone packaging, Dabur and ITC for FMCG inner packaging, and Dr. Reddy's and Sun Pharma for pharmaceutical secondary packaging. The Indian molded pulp packaging market is projected to reach \u20b92,800 crore by 2027 growing at 24% CAGR, supported by FSSAI approval for food-contact applications and BIS certification for industrial packaging standards compliance.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Sustainability</span><span className="text-gray-400">Scaling</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}