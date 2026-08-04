#!/usr/bin/env python3
"""Generate tungsten-copper-logistics-view.tsx — R421a
Tuple: (id, batchNo, city, mfr, grade, app, purity, conductivityIACS, investCr, status, priority, origin, dest, zone, remarks)
"""

ICON = "CircuitBoard"
HEX = "#4f46e5"
CSSCLASS = "indigo"
INTERFACE = "TungstenCopperRecord"
FUNCNAME = "TungstenCopperLogisticsView"
VARNAME = "tungstenCopperRecords"
TITLE = "Tungsten Copper Logistics"
DESC = "Indian tungsten copper (W-Cu) EDM electrode, thermal management, high-voltage contact, defense and nuclear supply chain tracking across 14 grades"
GRADEFIELD = "wcGrade"
UNITPROP = "conductivityIACS"

records = [
    ("TGC-0001", "TGC-B2401", "Mumbai", "MIDHANI", "WCu-80/20 EDM-A", "HAL Tejas Mk2 Turbine Blade Cooling Hole", 99.2, 45, 820, "Delivered", "Critical",
     "MIDHANI Hyderabad (TG)", "HAL Bengaluru (KA)", "South",
     "W-Cu 80/20 EDM electrode for HAL Tejas Mk2 F414 turbine blade film cooling hole micro-EDM drilling &#8594; 80% W &#8594; &#8377;820Cr for 120 tonnes &#8594; India &#8377;5,400Cr W-Cu EDM &#8594; HAL 40 aircraft &#8594; 45% IACS &#8594; &#8594; Rod &#8594; &#8594; WCu80 &#8594; &#8594; Aerospace"),
    ("TGC-0002", "TGC-B2402", "Bengaluru", "DRDO DMRL", "WCu-70/30 Contact", "BEL AESA Radar T/R Module Base", 98.8, 52, 740, "In Transit", "Critical",
     "DRDO Hyderabad (TG)", "BEL Bengaluru (KA)", "South",
     "W-Cu 70/30 high-voltage contact for BEL AESA radar transmit-receive module heat spreader base plate &#8594; 70% W &#8594; &#8377;740Cr for 85 tonnes &#8594; India &#8377;5,200Cr W-Cu radar &#8594; BEL 12 radars &#8594; 52% IACS &#8594; &#8594; Plate &#8594; &#8594; WCu70 &#8594; &#8594; Defense"),
    ("TGC-0003", "TGC-B2403", "Chennai", "Sterlite Technologies", "WCu-90/10 Heat Sink", "ISRO GSLV Mk3 Nozzle Throat Insert", 99.5, 38, 960, "Delivered", "Critical",
     "Sterlite Pune (MH)", "ISRO Sriharikota (AP)", "South",
     "W-Cu 90/10 ultra-high thermal conductivity for ISRO GSLV Mk3 cryogenic engine nozzle throat insert &#8594; 90% W &#8594; &#8377;960Cr for 60 tonnes &#8594; India &#8377;7,800Cr W-Cu space &#8594; ISRO 8 launches &#8594; 38% IACS &#8594; &#8594; Insert &#8594; &#8594; WCu90 &#8594; &#8594; Space"),
    ("TGC-0004", "TGC-B2404", "Hyderabad", "Bharat Forge", "WCu-75/25 Resistance Weld", "SAIL Blast Furnace Electrode", 98.5, 48, 480, "Delivered", "High",
     "Bharat Forge Pune (MH)", "SAIL Bhilai (CG)", "West",
     "W-Cu 75/25 resistance welding electrode for SAIL Bhilai blast furnace electrode holder and spot welding &#8594; 75% W &#8594; &#8377;480Cr for 200 tonnes &#8594; India &#8377;3,200Cr W-Cu electrode &#8594; SAIL 6 furnaces &#8594; 48% IACS &#8594; &#8594; Tip &#8594; &#8594; WCu75 &#8594; &#8594; Steel"),
    ("TGC-0005", "TGC-B2405", "Kolkata", "Hindustan Copper", "WCu-60/40 Arc", "Tata Power 765kV GIS Contact", 98.2, 58, 420, "In Transit", "High",
     "HCL Ghatsila (JH)", "Tata Power Mumbai (MH)", "East",
     "W-Cu 60/40 arc contact for Tata Power 765kV gas-insulated switchgear make-break arcing contact &#8594; 60% W &#8594; &#8377;420Cr for 150 tonnes &#8594; India &#8377;2,800Cr W-Cu GIS &#8594; Tata 40 bays &#8594; 58% IACS &#8594; &#8594; Contact &#8594; &#8594; WCu60 &#8594; &#8594; Power"),
    ("TGC-0006", "TGC-B2406", "Coimbatore", "BHEL R&D", "WCu-85/15 Plasma", "BHEL 800MW Plasma Torch Electrode", 99.1, 42, 680, "Delivered", "Critical",
     "BHEL Bhopal (MP)", "BHEL Hyderabad (TG)", "South",
     "W-Cu 85/15 plasma electrode for BHEL 800MW gasifier plasma torch cathode and anode &#8594; 85% W &#8594; &#8377;680Cr for 95 tonnes &#8594; India &#8377;4,600Cr W-Cu plasma &#8594; BHEL 20 torches &#8594; 42% IACS &#8594; &#8594; Electrode &#8594; &#8594; WCu85 &#8594; &#8594; Power"),
    ("TGC-0007", "TGC-B2407", "Pune", "Tata Advanced Materials", "WCu-80/20 Chip Sub", "L&T Naval GT Heat Spreader", 99.0, 45, 720, "Delivered", "High",
     "Tata Adv Materials Pune (MH)", "L&T Mumbai (MH)", "West",
     "W-Cu 80/20 chip-level heat spreader substrate for L&amp;T naval gas turbine ECU power module &#8594; 80% W &#8594; &#8377;720Cr for 80 tonnes &#8594; India &#8377;5,000Cr W-Cu thermal &#8594; L&amp;T 30 GTs &#8594; 45% IACS &#8594; &#8594; Substrate &#8594; &#8594; WCu80 &#8594; &#8594; Naval"),
    ("TGC-0008", "TGC-B2408", "Jaipur", "Rajasthan Minerals", "WCu-50/50 Solder", "Wipro Solder Ball Array", 97.8, 62, 340, "Delivered", "Medium",
     "Rajasthan Minerals Jodhpur (RJ)", "Wipro Bengaluru (KA)", "West",
     "W-Cu 50/50 heavy solder for Wipro semiconductor packaging ball grid array and flip-chip interconnect &#8594; 50% W &#8594; &#8377;340Cr for 40 tonnes &#8594; India &#8377;2,200Cr W-Cu solder &#8594; Wipro 100M chips &#8594; 62% IACS &#8594; &#8594; Preform &#8594; &#8594; WCu50 &#8594; &#8594; Electronics"),
    ("TGC-0009", "TGC-B2409", "Guwahati", "Assam Tungsten", "WCu-70/30 Mold", "Jio 5G Base Station Heat Sink", 98.6, 52, 520, "In Transit", "High",
     "Assam Tungsten Tezpur (AS)", "Jio Mumbai (MH)", "East",
     "W-Cu 70/30 injection mold insert for Reliance Jio 5G massive MIMO base station RF power amplifier heat sink &#8594; 70% W &#8594; &#8377;520Cr for 110 tonnes &#8594; India &#8377;3,600Cr W-Cu 5G &#8594; Jio 100K stations &#8594; 52% IACS &#8594; &#8594; Insert &#8594; &#8594; WCu70 &#8594; &#8594; Telecom"),
    ("TGC-0010", "TGC-B2410", "Ahmedabad", "Gujarat Tungsten Corp", "WCu-90/10 Nuclear", "IGCAR PFBR Control Rod Drive", 99.6, 36, 880, "Delivered", "Critical",
     "Gujarat Tungsten Ahmedabad (GJ)", "IGCAR Kalpakkam (TN)", "West",
     "W-Cu 90/10 nuclear-grade for IGCAR Prototype Fast Breeder Reactor control rod drive mechanism bearing &#8594; 90% W &#8594; &#8377;880Cr for 45 tonnes &#8594; India &#8377;7,200Cr W-Cu nuclear &#8594; IGCAR 2 reactors &#8594; 36% IACS &#8594; &#8594; Bearing &#8594; &#8594; WCu90 &#8594; &#8594; Nuclear"),
    ("TGC-0011", "TGC-B2411", "Lucknow", "UP Tungsten Works", "WCu-65/35 HV", "Adani High Voltage Breaker", 98.4, 55, 460, "Delivered", "Medium",
     "UP Tungsten Kanpur (UP)", "Adani Mundra (GJ)", "North",
     "W-Cu 65/35 high-voltage contact for Adani Power 400kV SF6 circuit breaker arcing contact assembly &#8594; 65% W &#8594; &#8377;460Cr for 130 tonnes &#8594; India &#8377;3,000Cr W-Cu breaker &#8594; Adani 60 breakers &#8594; 55% IACS &#8594; &#8594; Contact &#8594; &#8594; WCu65 &#8594; &#8594; Power"),
    ("TGC-0012", "TGC-B2412", "Visakhapatnam", "Vizag Tungsten Works", "WCu-85/15 Submarine", "GRSE Project 75I Torpedo Guide", 99.3, 40, 940, "Delayed", "Critical",
     "Vizag Tungsten Visakhapatnam (AP)", "GRSE Kolkata (WB)", "East",
     "W-Cu 85/15 submarine-grade for GRSE Project 75I torpedo tube guide rail and EMI shield bracket &#8594; 85% W &#8594; &#8377;940Cr for 55 tonnes &#8597; India &#8377;7,600Cr W-Cu submarine &#8594; GRSE 6 submarines &#8594; 40% IACS &#8597; &#8594; Rail &#8594; &#8594; WCu85 &#8594; &#8594; Naval"),
    ("TGC-0013", "TGC-B2413", "Bhopal", "DRDO TBRL", "WCu-80/20 Missile", "DRDO BrahMos Seeker Housing", 99.2, 44, 860, "In Transit", "Critical",
     "DRDO Chandipur (OD)", "BHEL Hyderabad (TG)", "Central",
     "W-Cu 80/20 missile-grade for DRDO BrahMos Mk2 seeker housing RF window and thermal management &#8594; 80% W &#8594; &#8377;860Cr for 70 tonnes &#8594; India &#8377;6,400Cr W-Cu missile &#8594; DRDO 200 missiles &#8594; 44% IACS &#8594; &#8594; Housing &#8594; &#8594; WCu80 &#8594; &#8594; Defense"),
    ("TGC-0014", "TGC-B2414", "Rourkela", "SAIL Tungsten Div", "WCu-60/40 Auto", "Mahindra EV Motor Brush", 98.0, 58, 380, "Delivered", "Medium",
     "SAIL Rourkela (OD)", "Mahindra Pune (MH)", "East",
     "W-Cu 60/40 brush-grade for Mahindra XUV400 electric motor commutator brush and spring holder &#8594; 60% W &#8594; &#8377;380Cr for 100 tonnes &#8594; India &#8377;2,400Cr W-Cu EV &#8594; Mahindra 50K motors &#8594; 58% IACS &#8594; &#8594; Brush &#8594; &#8594; WCu60 &#8594; &#8594; Auto"),
]

# ── Code generation (string concat only, NO f-string for JSX) ──
lines = []
lines.append('"use client";')
lines.append('')
lines.append("import React, { useState, useMemo } from 'react';")
lines.append("import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';")
lines.append("import { Badge } from '@/components/ui/badge';")
lines.append("import { PageHeader } from '@/components/shared';")
lines.append("import { " + ICON + " } from 'lucide-react';")
lines.append('')
lines.append("interface " + INTERFACE + " {")
lines.append("  id: string; batchNo: string; city: string; manufacturer: string; " + GRADEFIELD + ": string;")
lines.append("  application: string; purityPercent: number; " + UNITPROP + ": number; investmentCr: number;")
lines.append("  status: string; priority: string; origin: string; destination: string;")
lines.append("  shipDate: string; transitDays: number; zone: string; remarks: string;")
lines.append("};")
lines.append('')
lines.append("const " + VARNAME + ": " + INTERFACE + "[] = [")
for i, r in enumerate(records):
    sd = "2026-07-" + str(15 + i)
    td = str((i % 5) + 1)
    lines.append("  { id: '" + r[0] + "', batchNo: '" + r[1] + "', city: '" + r[2] + "', manufacturer: '" + r[3] + "', " + GRADEFIELD + ": '" + r[4] + "', application: '" + r[5] + "', purityPercent: " + str(r[6]) + ", " + UNITPROP + ": " + str(r[7]) + ", investmentCr: " + str(r[8]) + ", status: '" + r[9] + "', priority: '" + r[10] + "', origin: '" + r[11] + "', destination: '" + r[12] + "', shipDate: '" + sd + "', transitDays: " + td + ", zone: '" + r[13] + "', remarks: '" + r[14] + "' },")
lines.append("];")
lines.append('')
lines.append("export default function " + FUNCNAME + "() {")
lines.append("  const [activeTab, setActiveTab] = useState<string>('dashboard');")
lines.append("  const [searchTerm, setSearchTerm] = useState<string>('');")
lines.append("  const [filterZone, setFilterZone] = useState<string>('all');")
lines.append("  const [filterStatus, setFilterStatus] = useState<string>('all');")
lines.append('')
lines.append("  const tabs = [")
lines.append("    { id: 'dashboard', label: 'Dashboard', icon: " + ICON + " },")
lines.append("    { id: 'registry', label: 'Registry', icon: " + ICON + " },")
lines.append("    { id: 'analytics', label: 'Analytics', icon: " + ICON + " },")
lines.append("    { id: 'insights', label: 'Insights', icon: " + ICON + " },")
lines.append("  ];")
lines.append('')
lines.append("  const filteredRecords = useMemo(() => {")
lines.append("    return " + VARNAME + ".filter((r) => {")
lines.append("      const matchSearch = searchTerm === '' ||")
lines.append("        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||")
lines.append("        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||")
lines.append("        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||")
lines.append("        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||")
lines.append("        r." + GRADEFIELD + ".toLowerCase().includes(searchTerm.toLowerCase()) ||")
lines.append("        r.application.toLowerCase().includes(searchTerm.toLowerCase());")
lines.append("      const matchZone = filterZone === 'all' || r.zone === filterZone;")
lines.append("      const matchStatus = filterStatus === 'all' || r.status === filterStatus;")
lines.append("      return matchSearch && matchZone && matchStatus;")
lines.append("    });")
lines.append("  }, [searchTerm, filterZone, filterStatus]);")
lines.append('')
lines.append("  const zones = useMemo(() => {")
lines.append("    const zMap: Record<string, number> = {};")
lines.append("    " + VARNAME + ".forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });")
lines.append("    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);")
lines.append("  }, []);")
lines.append('')
lines.append("  const kpiData = useMemo(() => {")
lines.append("    const total = " + VARNAME + ".reduce((s: number, r) => s + r.investmentCr, 0);")
lines.append("    const avgPurity = " + VARNAME + ".reduce((s: number, r) => s + r.purityPercent, 0) / " + VARNAME + ".length;")
lines.append("    const delayed = " + VARNAME + ".filter((r) => r.status === 'Delayed').length;")
lines.append("    const critical = " + VARNAME + ".filter((r) => r.priority === 'Critical').length;")
lines.append("    return { total, avgPurity: avgPurity.toFixed(2), delayed, critical };")
lines.append("  }, []);")
lines.append('')
lines.append("  const statusColor = (status: string) => {")
lines.append("    switch (status) {")
lines.append("      case 'Delivered': return 'bg-green-500/20 text-green-700 border-green-500/30';")
lines.append("      case 'In Transit': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';")
lines.append("      case 'Delayed': return 'bg-red-500/20 text-red-700 border-red-500/30';")
lines.append("      case 'Processing': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';")
lines.append("      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';")
lines.append("    }")
lines.append("  };")
lines.append('')
lines.append("  const priorityColor = (priority: string) => {")
lines.append("    switch (priority) {")
lines.append("      case 'Critical': return 'bg-red-500/20 text-red-700 border-red-500/30';")
lines.append("      case 'High': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';")
lines.append("      case 'Medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';")
lines.append("      case 'Low': return 'bg-green-500/20 text-green-700 border-green-500/30';")
lines.append("      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';")
lines.append("    }")
lines.append("  };")
lines.append('')
lines.append("  const themeColor = '" + HEX + "';")
lines.append("  return (")
lines.append("    <div className=\"space-y-6 p-6\">")
lines.append("      <PageHeader title=\"" + TITLE + "\" description=\"" + DESC + "\" />")
# KPI cards
lines.append("      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">")
lines.append("        <Card className=\"border-l-4 border-l-" + CSSCLASS + "-500\"><CardContent className=\"pt-6\"><div className=\"text-2xl font-bold text-" + CSSCLASS + "-600\">{kpiData.total.toLocaleString()} Cr</div><div className=\"text-xs text-muted-foreground mt-1\">Total Investment</div></CardContent></Card>")
lines.append("        <Card className=\"border-l-4 border-l-" + CSSCLASS + "-500\"><CardContent className=\"pt-6\"><div className=\"text-2xl font-bold text-" + CSSCLASS + "-600\">{kpiData.avgPurity}%</div><div className=\"text-xs text-muted-foreground mt-1\">Avg Purity</div></CardContent></Card>")
lines.append("        <Card className=\"border-l-4 border-l-" + CSSCLASS + "-500\"><CardContent className=\"pt-6\"><div className=\"text-2xl font-bold text-" + CSSCLASS + "-600\">{kpiData.delayed}</div><div className=\"text-xs text-muted-foreground mt-1\">Delayed Batches</div></CardContent></Card>")
lines.append("        <Card className=\"border-l-4 border-l-" + CSSCLASS + "-500\"><CardContent className=\"pt-6\"><div className=\"text-2xl font-bold text-" + CSSCLASS + "-600\">{kpiData.critical}</div><div className=\"text-xs text-muted-foreground mt-1\">Critical Records</div></CardContent></Card>")
lines.append("      </div>")
# Tabs
lines.append("      <div className=\"flex flex-wrap gap-2 border-b pb-2\">")
lines.append("        {tabs.map((tab) => (")
lines.append("          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-" + CSSCLASS + "-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>")
lines.append("            {tab.label}")
lines.append("          </button>")
lines.append("        ))}")
lines.append("      </div>")
# Dashboard tab
lines.append("      {activeTab === 'dashboard' && (")
lines.append("        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-4\">")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Zone Distribution</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"space-y-2\">{zones.map(([zone, count]) => { const pct = (count as number / " + VARNAME + ".length) * 100; return <div key={zone} className=\"flex items-center gap-2\"><span className=\"text-xs w-16 text-muted-foreground\">{zone as string}</span><div className=\"flex-1 h-2 bg-muted rounded-full\"><div className=\"h-2 rounded-full\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\"text-xs font-medium w-8\">{count as number}</span></div>; })}</div>")
lines.append("          </CardContent></Card>")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Status Overview</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"grid grid-cols-2 gap-3\">")
lines.append("              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = " + VARNAME + ".filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className=\"text-lg font-bold\">{c}</div><div className=\"text-xs\">{s}</div></div>; })}")
lines.append("            </div>")
lines.append("          </CardContent></Card>")
lines.append("          <Card className=\"lg:col-span-2\"><CardHeader><CardTitle className=\"text-base\">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"grid grid-cols-2 md:grid-cols-4 gap-3\">")
lines.append("              {" + VARNAME + ".slice(0, 8).map((r) => <div key={r.id} className=\"text-center p-3 rounded-lg border bg-muted/30\"><div className=\"text-sm font-medium truncate\">{r." + GRADEFIELD + "}</div><div className=\"text-lg font-bold\" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className=\"text-xs text-muted-foreground\">{r.application}</div></div>)}")
lines.append("            </div>")
lines.append("          </CardContent></Card>")
lines.append("        </div>")
lines.append("      )}")
# Registry tab
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
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Grade:</span><span className=\"font-medium\">{record." + GRADEFIELD + "}</span></div>")
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Application:</span><span className=\"font-medium\">{record.application}</span></div>")
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Purity:</span><span className=\"font-medium\">{record.purityPercent}%</span></div>")
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Conductivity:</span><span className=\"font-medium\">{record." + UNITPROP + "}% IACS</span></div>")
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Investment:</span><span className=\"font-medium\" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>")
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">City:</span><span className=\"font-medium\">{record.city}</span></div>")
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Route:</span><span className=\"font-medium text-xs\">{record.origin} &#8594; {record.destination}</span></div>")
lines.append("                  </div>")
lines.append("                </CardContent>")
lines.append("              </Card>")
lines.append("            ))}")
lines.append("          </div>")
lines.append("          <div className=\"text-sm text-muted-foreground\">Showing {filteredRecords.length} of {" + VARNAME + ".length} records</div>")
lines.append("        </div>")
lines.append("      )}")
# Analytics tab
lines.append("      {activeTab === 'analytics' && (")
lines.append("        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-4\">")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Manufacturer Performance</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"space-y-2\">")
lines.append("              {(() => { const mfrMap: Record<string, number> = {}; " + VARNAME + ".forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className=\"flex items-center gap-2\"><span className=\"text-xs w-40 truncate\">{mfr as string}</span><div className=\"flex-1 h-2 bg-muted rounded-full\"><div className=\"h-2 rounded-full\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\"text-xs font-medium\">&#8377;{inv as number}Cr</span></div>; }); })()}")
lines.append("            </div>")
lines.append("          </CardContent></Card>")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Priority Distribution</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"grid grid-cols-2 gap-3\">")
lines.append("              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = " + VARNAME + ".filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className=\"text-lg font-bold\">{c}</div><div className=\"text-xs\">{p}</div></div>; })}")
lines.append("            </div>")
lines.append("          </CardContent></Card>")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Investment by Zone</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"space-y-2\">{(() => { const zInv: Record<string, number> = {}; " + VARNAME + ".forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className=\"flex items-center gap-2\"><span className=\"text-xs w-16\">{zone as string}</span><div className=\"flex-1 h-2 bg-muted rounded-full\"><div className=\"h-2 rounded-full\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\"text-xs font-medium\">&#8377;{inv as number}Cr</span></div>; }); })()}</div>")
lines.append("          </CardContent></Card>")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Purity Distribution</CardTitle></CardHeader><CardContent>")
lines.append("            <div className=\"space-y-2\">")
lines.append("              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; " + VARNAME + ".forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / " + VARNAME + ".length) * 100; return <div key={range} className=\"flex items-center gap-2\"><span className=\"text-xs w-24\">{range}</span><div className=\"flex-1 h-2 bg-muted rounded-full\"><div className=\"h-2 rounded-full\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\"text-xs font-medium\">{count}</span></div>; }); })()}")
lines.append("            </div>")
lines.append("          </CardContent></Card>")
lines.append("        </div>")
lines.append("      )}")
# Insights tab
lines.append("      {activeTab === 'insights' && (")
lines.append("        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className=\"space-y-3 text-sm\">")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Aerospace &amp; Defense Dominance</div><div className=\"text-xs text-muted-foreground mt-1\">HAL Tejas Mk2 turbine blade &#8594; DRDO BrahMos seeker &#8594; BEL AESA radar T/R module driving &#8594; &#8377;2,420Cr combined &#8594; highest priority segment</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Space &amp; Nuclear Programme</div><div className=\"text-xs text-muted-foreground mt-1\">ISRO GSLV Mk3 nozzle throat &#8594; IGCAR PFBR control rod &#8594; DRDO plasma torch driving &#8594; &#8377;2,520Cr combined &#8594; strategic national assets</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Power &amp; Heavy Electrical</div><div className=\"text-xs text-muted-foreground mt-1\">BHEL 800MW plasma torch &#8594; Tata Power GIS contact &#8594; Adani HV breaker &#8594; SAIL furnace electrode &#8594; &#8377;2,040Cr combined &#8594; grid infrastructure</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Monsoon Disruption Alert</div><div className=\"text-xs text-muted-foreground mt-1\">TGC-B2412 GRSE Project 75I torpedo guide delayed &#8594; monsoon Visakhapatnam port congestion &#8594; submarine programme timeline at risk</div></div>")
lines.append("          </div></CardContent></Card>")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Investment Landscape</CardTitle></CardHeader><CardContent><div className=\"space-y-3 text-sm\">")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className=\"text-xs text-muted-foreground mt-1\">Across 14 W-Cu grades spanning aerospace, defense, nuclear, space, power, telecom, EV and semiconductor &#8594; avg purity {kpiData.avgPurity}%</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Critical Priority: 7 Records</div><div className=\"text-xs text-muted-foreground mt-1\">HAL turbine &#8594; BEL radar &#8594; ISRO nozzle &#8594; BHEL plasma &#8594; L&amp;T naval GT &#8594; IGCAR nuclear &#8594; GRSE submarine &#8594; DRDO missile</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Top Manufacturers</div><div className=\"text-xs text-muted-foreground mt-1\">MIDHANI &#8594; DRDO &#8594; BHEL lead strategic demand &#8594; Sterlite &#8594; Bharat Forge &#8594; Tata Advanced drive commercial</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Regional Concentration</div><div className=\"text-xs text-muted-foreground mt-1\">South zone leads with Hyderabad &#8594; Bengaluru &#8594; Chennai &#8594; Coimbatore &#8594; West zone Pune &#8594; Ahmedabad &#8594; East zone emerging</div></div>")
lines.append("          </div></CardContent></Card>")
lines.append("        </div>")
lines.append("      )}")
lines.append("    </div>")
lines.append("  );")
lines.append("}")
lines.append("")

content = "\n".join(lines)

# HTML entity scan
import re
entities = re.findall(r"&#(\d+);", content)
malformed = [e for e in entities if int(e) > 9999]
print("HTML entities:", len(entities))
print("Malformed:", len(malformed))
if malformed:
    print("MALFORMED entities:", malformed)

with open("/home/z/my-project/src/components/modules/tungsten-copper-logistics-view.tsx", "w") as f:
    f.write(content)
print("Written: tungsten-copper-logistics-view.tsx")
print("Lines:", len(lines))
