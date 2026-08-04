#!/usr/bin/env python3
"""Generate R417a: Graphite Powder Logistics View"""
import os

COMPONENT_NAME = "GraphitePowder"
THEME = "graphite-powder"
PREFIX = "GTP"
ICON_IMPORT = "Mountain"
ICON_JSX = "Mountain"
COLOR_ACCENT = "#64748b"  # slate-500
COLOR_ACCENT_TW = "slate"
INTERFACE_NAME = "GraphitePowderRecord"
VARIABLE_NAME = "graphitePowderRecords"

RECORDS = [
    ("GTP-0001", "GTP-B2401", "Mumbai", "Hindustan Electrodes", "GP-HP Electrode", "SAIL Blast Furnace", 99.8, 4.2, 780, "Delivered", "Critical", "Hindustan Electrodes Nagpur (MH)", "SAIL Rourkela (OD)", "2026-07-15", 2, "West", "High-power electrode for SAIL Rourkela blast furnace &#8594; 300mm dia GP &#8594; &#8377;780Cr for 12,000 tonnes &#8594; India &#8377;6,200Cr electrode &#8594; SAIL 5 furnaces &#8594; 4.2 Shore &#8594; &#8594; EAF &#8594; &#8594; 3500&#176;C &#8594; &#8594; Electrode"),
    ("GTP-0002", "GTP-B2402", "Bengaluru", "Graphite India Ltd", "GP-Isostatic Fine", "ISRO Nozzle", 99.9, 5.8, 860, "In Transit", "Critical", "Graphite India Bengaluru (KA)", "ISRO Thiruvananthapuram (KL)", "2026-07-18", 1, "South", "Isostatically pressed fine graphite for ISRO PSLV Vikas engine C-D nozzle throat insert &#8594; 99.9% C &#8594; &#8377;860Cr for 800 tonnes &#8594; India &#8377;5,400Cr aerospace &#8594; ISRO 60 nozzles &#8594; 5.8 GPa &#8594; &#8594; C/SiC throat &#8594; &#8594; 2800&#176;C &#8594; &#8594; Nozzle"),
    ("GTP-0003", "GTP-B2403", "Hyderabad", "HEG Ltd", "GP-Flake Natural", "BEL Lithium Cell", 99.7, 3.1, 720, "Delivered", "High", "HEG Ltd Bhopal (MP)", "BEL Bengaluru (KA)", "2026-07-20", 1, "Central", "Natural flake graphite anode material for BEL Li-ion battery cell manufacturing &#8594; +100 mesh flake &#8594; &#8377;720Cr for 5,000 tonnes &#8594; India &#8377;3,600Cr anode &#8594; BEL 200M cells &#8594; 3.1 Mohs &#8594; &#8594; Spheroidized &#8594; &#8594; 350mAh/g &#8594; &#8594; Battery"),
    ("GTP-0004", "GTP-B2404", "Chennai", "Tata Steel Special", "GP-Nuclear Grade", "IGCAR Moderator", 99.99, 5.5, 940, "Delivered", "Critical", "Tata Steel Jamshedpur (JH)", "IGCAR Kalpakkam (TN)", "2026-07-22", 1, "East", "Nuclear-grade graphite reflector for IGCAR AHWR pressure tube moderator &#8594; IG-110 equivalent &#8594; &#8377;940Cr for 2,400 tonnes &#8594; India &#8377;8,200Cr nuclear C &#8594; IGCAR 12 cores &#8594; 5.5 GPa &#8594; &#8594; PGA &#8594; &#8594; 600&#176;C &#8594; &#8594; Nuclear"),
    ("GTP-0005", "GTP-B2405", "Pune", "DRDO DMRL", "GP-Carbon Fiber", "DRDO Light Combat", 99.6, 6.2, 680, "In Transit", "High", "DRDO Hyderabad (TG)", "HAL Bengaluru (KA)", "2026-07-24", 1, "South", "PAN-based carbon fiber precursor graphite for DRDO LCA Mk2 airframe CFRP wing skin &#8594; T800 grade &#8594; &#8377;680Cr for 600 tonnes &#8594; India &#8377;9,400Cr CF &#8594; DRDO 200 aircraft &#8594; 6.2 GPa &#8594; &#8594; CFRP &#8594; &#8594; 1800&#176;C &#8594; &#8594; Defence"),
    ("GTP-0006", "GTP-B2406", "Kolkata", "Graphite India Ltd", "GP-Vibrator Mold", "Reliance Foundry", 99.5, 3.8, 520, "Delivered", "Medium", "Graphite India Kolkata (WB)", "Reliance Jamnagar (GJ)", "2026-07-26", 3, "East", "Vibrocast graphite mold stock for Reliance Jamnagar refinery continuous caster &#8594; 600mm round &#8594; &#8377;520Cr for 3,000 tonnes &#8594; India &#8377;2,800Cr mold &#8594; Reliance 8 lines &#8594; 3.8 Shore &#8594; &#8594; Vibrocast &#8594; &#8594; 1400&#176;C &#8594; &#8594; Mold"),
    ("GTP-0007", "GTP-B2407", "Ahmedabad", "Gujarat Graphite Corp", "GP-Expanded Worm", "Carl Zeiss Seal", 99.4, 2.5, 480, "In Transit", "Medium", "Gujarat Graphite Morbi (GJ)", "Godrej Mumbai (MH)", "2026-07-28", 1, "West", "Expandable graphite worm for Carl Zeiss precision optic lens cell sealing &#8594; 50x expansion &#8594; &#8377;480Cr for 1,200 tonnes &#8594; India &#8377;1,800Cr seal &#8594; Zeiss 4M units &#8594; 2.5 Mohs &#8594; &#8594; Intumescent &#8594; &#8594; 280&#176;C &#8594; &#8594; Seal"),
    ("GTP-0008", "GTP-B2408", "Jaipur", "Rajasthan Graphite", "GP-Synthetic High", "BHEL Turbine Seal", 99.95, 7.1, 620, "Delivered", "High", "Rajasthan Graphite Udaipur (RJ)", "BHEL Hyderabad (TG)", "2026-07-30", 2, "West", "High-density synthetic graphite for BHEL steam turbine gland seal rings &#8594; 1.82 g/cc &#8594; &#8377;620Cr for 1,800 tonnes &#8594; India &#8377;4,200Cr seal &#8594; BHEL 40 turbines &#8594; 7.1 GPa &#8594; &#8594; Mech seal &#8594; &#8594; 500&#176;C &#8594; &#8594; Turbine"),
    ("GTP-0009", "GTP-B2409", "Guwahati", "Assam Graphite Mine", "GP-Amorphous Chip", "Adani Solar Panel", 99.3, 2.8, 540, "In Transit", "Medium", "Assam Graphite Karbi Anglong (AS)", "Adani Mundra (GJ)", "2026-08-01", 4, "East", "Amorphous chip graphite conductive additive for Adani Solar PERC cell paste &#8594; 30um D50 &#8594; &#8377;540Cr for 4,000 tonnes &#8594; India &#8377;2,100Cr paste &#8594; Adani 5GW &#8594; 2.8 Mohs &#8594; &#8594; Conductive &#8594; &#8594; 850&#176;C &#8594; &#8594; Solar"),
    ("GTP-0010", "GTP-B2410", "Lucknow", "UP Graphite Industries", "GP-EDM Block", "Wipro 3D Print", 99.85, 6.5, 580, "Delivered", "High", "UP Graphite Lucknow (UP)", "Wipro Bengaluru (KA)", "2026-08-03", 1, "North", "CNC-grade EDM block graphite for Wipro 3D printed metal mold EDM finishing &#8594; 250x125x50mm &#8594; &#8377;580Cr for 2,000 tonnes &#8594; India &#8377;3,800Cr EDM &#8594; Wipro 100K molds &#8594; 6.5 GPa &#8594; &#8594; Wire EDM &#8594; &#8594; &#8594; EDM"),
    ("GTP-0011", "GTP-B2411", "Coimbatore", "TN Graphite Corp", "GP-Lubricant Fine", "L&T Heavy Gear", 99.2, 1.5, 420, "Delivered", "Medium", "TN Graphite Coimbatore (TN)", "L&T Mumbai (MH)", "2026-08-05", 1, "South", "Colloidal graphite lubricant powder for L&T heavy gearbox wind turbine main bearing &#8594; 5um D50 &#8594; &#8377;420Cr for 3,500 tonnes &#8594; India &#8377;1,400Cr lubricant &#8594; L&T 500 gearboxes &#8594; 1.5 Mohs &#8594; &#8594; Dry film &#8594; &#8594; 450&#176;C &#8594; &#8594; Lubricant"),
    ("GTP-0012", "GTP-B2412", "Visakhapatnam", "NALCO Graphite", "GP-Extruded Rod", "HAL Landing Gear", 99.88, 5.2, 640, "Delayed", "Critical", "NALCO Vishakapatnam (AP)", "HAL Bengaluru (KA)", "2026-08-07", 1, "East", "Extruded graphite rod stock for HAL Tejas Mk2 landing gear brake carbon disc &#8594; 200mm dia &#8594; &#8377;640Cr for 1,500 tonnes &#8594; India &#8377;5,200Cr brake &#8594; HAL 120 sets &#8594; 5.2 GPa &#8594; &#8594; C/C composite &#8594; &#8594; 1200&#176;C &#8594; &#8594; Aero"),
    ("GTP-0013", "GTP-B2413", "Bhopal", "BHEL Graphite Div", "GP-High Density", "NPCIL Reactor", 99.97, 6.8, 890, "In Transit", "Critical", "BHEL Bhopal (MP)", "NPCIL Kakrapar (GJ)", "2026-08-09", 2, "Central", "Ultra-high density graphite for NPCIL PHWR 700 core shielding and reflector blocks &#8594; 1.85 g/cc &#8594; &#8377;890Cr for 3,200 tonnes &#8594; India &#8377;9,800Cr nuclear &#8594; NPCIL 6 reactors &#8594; 6.8 GPa &#8594; &#8594; Shielding &#8594; &#8594; 650&#176;C &#8594; &#8594; Nuclear"),
    ("GTP-0014", "GTP-B2414", "Rourkela", "SAIL Graphite Works", "GP-Recycled Reclaim", "Tata Steel EAF", 99.1, 3.2, 380, "Delivered", "Low", "SAIL Rourkela (OD)", "Tata Steel Jamshedpur (JH)", "2026-08-11", 1, "East", "Recycled reclaimed graphite for Tata Steel EAF secondary steelmaking recarburizer &#8594; 90% fixed C &#8594; &#8377;380Cr for 8,000 tonnes &#8594; India &#8377;1,200Cr reclaim &#8594; Tata 6 furnaces &#8594; 3.2 Mohs &#8594; &#8594; Recarburizer &#8594; &#8594; 1600&#176;C &#8594; &#8594; Steel"),
]

# KPI labels for this module
KPI_TOTAL = "Rs 8,930 Cr"
KPI_AVG_PURITY = "99.78%"
KPI_DELAYED = "1 Batch"
KPI_CRITICAL = "6 Records"

# Custom property names
PROP1 = "carbonType"
PROP1_LABEL = "Carbon Type"
PROP2 = "densityGcc"
PROP2_LABEL = "Density (g/cc)"

OUTPUT = os.path.join("/home/z/my-project/src/components/modules", f"{THEME}-logistics-view.tsx")

lines = []
lines.append(r'''"use client";''')
lines.append("")
lines.append("import React, { useState, useMemo } from 'react';")
lines.append("import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';")
lines.append("import { Badge } from '@/components/ui/badge';")
lines.append("import { PageHeader } from '@/components/shared';")
lines.append(f"import {{ {ICON_IMPORT} }} from 'lucide-react';")
lines.append("")
lines.append(f"interface {INTERFACE_NAME} {{")
lines.append("  id: string;")
lines.append("  batchNo: string;")
lines.append("  city: string;")
lines.append("  manufacturer: string;")
lines.append("  oxideGrade: string;")
lines.append("  application: string;")
lines.append("  purityPercent: number;")
lines.append("  hardnessGPa: number;")
lines.append("  investmentCr: number;")
lines.append("  status: string;")
lines.append("  priority: string;")
lines.append("  origin: string;")
lines.append("  destination: string;")
lines.append("  shipDate: string;")
lines.append("  transitDays: number;")
lines.append("  zone: string;")
lines.append("  remarks: string;")
lines.append("}")
lines.append("")
lines.append(f"const {VARIABLE_NAME}: {INTERFACE_NAME}[] = [")

for i, rec in enumerate(RECORDS):
    rid, batch, city, mfr, grade, app, pur, hard, inv, stat, pri, orig, dest, ship, trans, zone, rem = rec
    comma = "," if i < len(RECORDS) - 1 else ","
    lines.append(f"  {{ id: '{rid}', batchNo: '{batch}', city: '{city}', manufacturer: '{mfr}', oxideGrade: '{grade}', application: '{app}', purityPercent: {pur}, hardnessGPa: {hard}, investmentCr: {inv}, status: '{stat}', priority: '{pri}', origin: '{orig}', destination: '{dest}', shipDate: '{ship}', transitDays: {trans}, zone: '{zone}', remarks: '{rem}' }}{comma}")

lines.append("];")
lines.append("")
lines.append(f"export default function {COMPONENT_NAME}LogisticsView() {{")
lines.append("  const [activeTab, setActiveTab] = useState<string>('dashboard');")
lines.append("  const [searchTerm, setSearchTerm] = useState<string>('');")
lines.append("  const [filterZone, setFilterZone] = useState<string>('all');")
lines.append("  const [filterStatus, setFilterStatus] = useState<string>('all');")
lines.append("")
lines.append("  const tabs = [")
lines.append("    { id: 'dashboard', label: 'Dashboard', icon: {ICON_JSX} },")
lines.append("    { id: 'registry', label: 'Registry', icon: {ICON_JSX} },")
lines.append("    { id: 'analytics', label: 'Analytics', icon: {ICON_JSX} },")
lines.append("    { id: 'insights', label: 'Insights', icon: {ICON_JSX} },")
lines.append("  ];")
lines.append("")
lines.append(f"  const filteredRecords = useMemo(() => {{")
lines.append(f"    return {VARIABLE_NAME}.filter((r) => {{")
lines.append("      const matchSearch = searchTerm === '' ||")
lines.append("        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||")
lines.append("        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||")
lines.append("        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||")
lines.append("        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||")
lines.append("        r.oxideGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||")
lines.append("        r.application.toLowerCase().includes(searchTerm.toLowerCase());")
lines.append("      const matchZone = filterZone === 'all' || r.zone === filterZone;")
lines.append("      const matchStatus = filterStatus === 'all' || r.status === filterStatus;")
lines.append("      return matchSearch && matchZone && matchStatus;")
lines.append("    });")
lines.append("  }, [searchTerm, filterZone, filterStatus]);")
lines.append("")
lines.append("  const zones = useMemo(() => {")
lines.append("    const zMap: Record<string, number> = {};")
lines.append(f"    {VARIABLE_NAME}.forEach((r) => {{ zMap[r.zone] = (zMap[r.zone] || 0) + 1; }});")
lines.append("    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);")
lines.append("  }, []);")
lines.append("")
lines.append("  const kpiData = useMemo(() => {")
lines.append(f"    const total = {VARIABLE_NAME}.reduce((s: number, r) => s + r.investmentCr, 0);")
lines.append(f"    const avgPurity = {VARIABLE_NAME}.reduce((s: number, r) => s + r.purityPercent, 0) / {VARIABLE_NAME}.length;")
lines.append(f"    const delayed = {VARIABLE_NAME}.filter((r) => r.status === 'Delayed').length;")
lines.append(f"    const critical = {VARIABLE_NAME}.filter((r) => r.priority === 'Critical').length;")
lines.append(f"    return {{ total, avgPurity: avgPurity.toFixed(2), delayed, critical }};")
lines.append("  }, []);")
lines.append("")
lines.append("  const statusColor = (status: string) => {")
lines.append("    switch (status) {")
lines.append("      case 'Delivered': return 'bg-green-500/20 text-green-700 border-green-500/30';")
lines.append("      case 'In Transit': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';")
lines.append("      case 'Delayed': return 'bg-red-500/20 text-red-700 border-red-500/30';")
lines.append("      case 'Processing': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';")
lines.append("      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';")
lines.append("    }")
lines.append("  };")
lines.append("")
lines.append("  const priorityColor = (priority: string) => {")
lines.append("    switch (priority) {")
lines.append("      case 'Critical': return 'bg-red-500/20 text-red-700 border-red-500/30';")
lines.append("      case 'High': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';")
lines.append("      case 'Medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';")
lines.append("      case 'Low': return 'bg-green-500/20 text-green-700 border-green-500/30';")
lines.append("      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';")
lines.append("    }")
lines.append("  };")
lines.append("")
lines.append(f"  const themeColor = '{COLOR_ACCENT}';")
lines.append("  return (")
lines.append("    <div className=\"space-y-6 p-6\">")
lines.append("      <PageHeader title=\"Graphite Powder Logistics\" description=\"Indian graphite electrode, anode, nuclear and EDM supply chain tracking across 14 grades\" icon={ICON_JSX} />")
lines.append("      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">")
lines.append("        <Card className=\"border-l-4 border-l-slate-500\"><CardContent className=\"pt-6\"><div className=\"text-2xl font-bold text-slate-600\">{kpiData.total.toLocaleString()} Cr</div><div className=\"text-xs text-muted-foreground mt-1\">Total Investment</div></CardContent></Card>")
lines.append("        <Card className=\"border-l-4 border-l-slate-500\"><CardContent className=\"pt-6\"><div className=\"text-2xl font-bold text-slate-600\">{kpiData.avgPurity}%</div><div className=\"text-xs text-muted-foreground mt-1\">Avg Purity</div></CardContent></Card>")
lines.append("        <Card className=\"border-l-4 border-l-slate-500\"><CardContent className=\"pt-6\"><div className=\"text-2xl font-bold text-slate-600\">{kpiData.delayed}</div><div className=\"text-xs text-muted-foreground mt-1\">Delayed Batches</div></CardContent></Card>")
lines.append("        <Card className=\"border-l-4 border-l-slate-500\"><CardContent className=\"pt-6\"><div className=\"text-2xl font-bold text-slate-600\">{kpiData.critical}</div><div className=\"text-xs text-muted-foreground mt-1\">Critical Records</div></CardContent></Card>")
lines.append("      </div>")
lines.append("      <div className=\"flex flex-wrap gap-2 border-b pb-2\">")
lines.append("        {tabs.map((tab) => (")
lines.append("          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-slate-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>")
lines.append("            {tab.label}")
lines.append("          </button>")
lines.append("        ))}")
lines.append("      </div>")
lines.append("      {activeTab === 'dashboard' && (")
lines.append("        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-4\">")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Zone Distribution</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"space-y-2\">{zones.map(([zone, count]) => { const pct = (count as number / " + VARIABLE_NAME + ".length) * 100; return <div key={zone} className=\"flex items-center gap-2\"><span className=\"text-xs w-16 text-muted-foreground\">{zone as string}</span><div className=\"flex-1 h-2 bg-muted rounded-full\"><div className=\"h-2 rounded-full\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\"text-xs font-medium w-8\">{count as number}</span></div>; })}</div>")
lines.append("          </CardContent></Card>")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Status Overview</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"grid grid-cols-2 gap-3\">")
lines.append("              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = " + VARIABLE_NAME + ".filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className=\"text-lg font-bold\">{c}</div><div className=\"text-xs\">{s}</div></div>; })}")
lines.append("            </div>")
lines.append("          </CardContent></Card>")
lines.append("          <Card className=\"lg:col-span-2\"><CardHeader><CardTitle className=\"text-base\">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"grid grid-cols-2 md:grid-cols-4 gap-3\">")
lines.append("              " + VARIABLE_NAME + ".slice(0, 8).map((r) => <div key={r.id} className=\"text-center p-3 rounded-lg border bg-muted/30\"><div className=\"text-sm font-medium truncate\">{r.oxideGrade}</div><div className=\"text-lg font-bold\" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className=\"text-xs text-muted-foreground\">{r.application}</div></div>)")
lines.append("            </div>")
lines.append("          </CardContent></Card>")
lines.append("        </div>")
lines.append("      )}")
lines.append("      {activeTab === 'registry' && (")
lines.append("        <div className=\"space-y-4\">")
lines.append("          <div className=\"flex flex-wrap gap-3\">")
lines.append("            <input type=\"text\" placeholder=\"Search ID, batch, city, grade...\" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className=\"px-3 py-2 border rounded-md text-sm flex-1 min-w-[200px]\" />")
lines.append("            <select value={filterZone} onChange={(e) => setFilterZone(e.target.value)} className=\"px-3 py-2 border rounded-md text-sm\"><option value=\"all\">All Zones</option>{zones.map(([z]) => <option key={z} value={z}>{z as string}</option>)}</select>")
lines.append("            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className=\"px-3 py-2 border rounded-md text-sm\"><option value=\"all\">All Status</option>{['Delivered','In Transit','Delayed','Processing'].map((s) => <option key={s} value={s}>{s}</option>)}</select>")
lines.append("          </div>")
lines.append("          <div className=\"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3\">")
lines.append("            {filteredRecords.map((record) => (")
lines.append("              <Card key={record.id} className={record.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}>")
lines.append("                <CardContent className=\"pt-4 pb-4\">")
lines.append("                  <div className=\"flex justify-between items-start mb-2\">")
lines.append("                    <div><span className=\"font-semibold text-sm\">{record.id}</span><span className=\"text-xs text-muted-foreground ml-2\">{record.batchNo}</span></div>")
lines.append("                    <div className=\"flex gap-1\"><Badge variant=\"outline\" className={statusColor(record.status)}>{record.status}</Badge><Badge variant=\"outline\" className={priorityColor(record.priority)}>{record.priority}</Badge></div>")
lines.append("                  </div>")
lines.append("                  <div className=\"text-xs space-y-1\">")
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Grade:</span><span className=\"font-medium\">{record.oxideGrade}</span></div>")
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Application:</span><span className=\"font-medium\">{record.application}</span></div>")
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Purity:</span><span className=\"font-medium\">{record.purityPercent}%</span></div>")
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Investment:</span><span className=\"font-medium\" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>")
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">City:</span><span className=\"font-medium\">{record.city}</span></div>")
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Route:</span><span className=\"font-medium text-xs\">{record.origin} &#8594; {record.destination}</span></div>")
lines.append("                  </div>")
lines.append("                </CardContent>")
lines.append("              </Card>")
lines.append("            ))}")
lines.append("          </div>")
lines.append("          <div className=\"text-sm text-muted-foreground\">Showing {filteredRecords.length} of {" + VARIABLE_NAME + ".length} records</div>")
lines.append("        </div>")
lines.append("      )}")
lines.append("      {activeTab === 'analytics' && (")
lines.append("        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-4\">")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Manufacturer Performance</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"space-y-2\">")
lines.append("              {(() => { const mfrMap: Record<string, number> = {}; " + VARIABLE_NAME + ".forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className=\"flex items-center gap-2\"><span className=\"text-xs w-40 truncate\">{mfr as string}</span><div className=\"flex-1 h-2 bg-muted rounded-full\"><div className=\"h-2 rounded-full\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\"text-xs font-medium\">&#8377;{inv as number}Cr</span></div>; }); })()}")
lines.append("            </div>")
lines.append("          </CardContent></Card>")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Priority Distribution</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"grid grid-cols-2 gap-3\">")
lines.append("              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = " + VARIABLE_NAME + ".filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className=\"text-lg font-bold\">{c}</div><div className=\"text-xs\">{p}</div></div>; })}")
lines.append("            </div>")
lines.append("          </CardContent></Card>")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Investment by Zone</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"space-y-2\">{(() => { const zInv: Record<string, number> = {}; " + VARIABLE_NAME + ".forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className=\"flex items-center gap-2\"><span className=\"text-xs w-16\">{zone as string}</span><div className=\"flex-1 h-2 bg-muted rounded-full\"><div className=\"h-2 rounded-full\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\"text-xs font-medium\">&#8377;{inv as number}Cr</span></div>; }); })()}")
lines.append("          </CardContent></Card>")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Purity Distribution</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"space-y-2\">")
lines.append("              {(() => { const ranges = { '99.95%+': 0, '99.8-99.94%': 0, '99.5-99.79%': 0, '&lt;99.5%': 0 }; " + VARIABLE_NAME + ".forEach((r) => { if (r.purityPercent >= 99.95) ranges['99.95%+']++; else if (r.purityPercent >= 99.8) ranges['99.8-99.94%']++; else if (r.purityPercent >= 99.5) ranges['99.5-99.79%']++; else ranges['&lt;99.5%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / " + VARIABLE_NAME + ".length) * 100; return <div key={range} className=\"flex items-center gap-2\"><span className=\"text-xs w-24\">{range}</span><div className=\"flex-1 h-2 bg-muted rounded-full\"><div className=\"h-2 rounded-full\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\"text-xs font-medium\">{count}</span></div>; }); })()}")
lines.append("            </div>")
lines.append("          </CardContent></Card>")
lines.append("        </div>")
lines.append("      )}")
lines.append("      {activeTab === 'insights' && (")
lines.append("        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className=\"space-y-3 text-sm\">")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50\"><div className=\"font-medium\">Nuclear Grade Demand Surge</div><div className=\"text-xs text-muted-foreground mt-1\">IGCAR AHWR and NPCIL PHWR 700 programmes driving 1,700 tonnes nuclear-grade graphite demand with 99.99%+ purity requirement &#8594; &#8377;1,830Cr combined</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50\"><div className=\"font-medium\">Li-ion Anode Material Shift</div><div className=\"text-xs text-muted-foreground mt-1\">BEL and Adani driving flake graphite demand &#8594; spheroidized natural flake transitioning from imported to domestic Gujarat source &#8594; &#8377;1,260Cr</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50\"><div className=\"font-medium\">EDM Sector Growth</div><div className=\"text-xs text-muted-foreground mt-1\">Wipro 3D printing mould finishing and HAL brake disc manufacturing drive CNC-grade EDM graphite &#8594; &#8377;1,220Cr for isostatic + extruded grades</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50\"><div className=\"font-medium\">Monsoon Disruption Alert</div><div className=\"text-xs text-muted-foreground mt-1\">GTP-B2412 HAL landing gear brake disc delayed 28 days &#8594; monsoon flooding Visakhapatnam NALCO port &#8594; HAL Mk2 assembly line risk</div></div>")
lines.append("          </div></CardContent></Card>")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Investment Landscape</CardTitle></CardHeader><CardContent><div className=\"space-y-3 text-sm\">")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50\"><div className=\"font-medium\">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className=\"text-xs text-muted-foreground mt-1\">Across 14 graphite grades spanning electrode, nuclear, battery, EDM, seal and lubricant sectors &#8594; avg purity {kpiData.avgPurity}% &#8594; 7 manufacturers active</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50\"><div className=\"font-medium\">Critical Priority: 6 Records</div><div className=\"text-xs text-muted-foreground mt-1\">Nuclear-grade IGCAR &#8594; NPCIL &#8594; ISRO nozzle &#8594; DRDO airframe &#8594; BHEL turbine &#8594; HAL brake disc all flagged critical delivery</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50\"><div className=\"font-medium\">Top 3 Manufacturers by Investment</div><div className=\"text-xs text-muted-foreground mt-1\">IGCAR &#8594; NPCIL &#8594; ISRO lead demand &#8594; domestic HEG &#8594; Graphite India &#8594; NALCO ramping nuclear-grade capacity</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50\"><div className=\"font-medium\">Zone Concentration</div><div className=\"text-xs text-muted-foreground mt-1\">East zone dominates with SAIL &#8594; NALCO &#8594; Assam supply &#8594; West zone Gujarat emerging as flake graphite hub &#8594; South zone aerospace demand</div></div>")
lines.append("          </div></CardContent></Card>")
lines.append("        </div>")
lines.append("      )}")
lines.append("    </div>")
lines.append("  );")
lines.append("}")
lines.append("")

content = "\n".join(lines)

# Validate no malformed entities
import re
bad = re.findall(r'&#(\d+);', content)
for b in bad:
    if int(b) > 99999:
        print(f"WARNING: potentially malformed entity &#x{b};")
    if int(b) > 9999:
        print(f"INFO: entity &#x{b} -> check validity")

with open(OUTPUT, "w") as f:
    f.write(content)

print(f"Generated {OUTPUT} ({len(lines)} lines)")
print(f"Records: {len(RECORDS)}")
print(f"Total investment: {sum(r[8] for r in RECORDS)} Cr")
print(f"Avg purity: {sum(r[6] for r in RECORDS)/len(RECORDS):.2f}%")
