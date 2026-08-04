#!/usr/bin/env python3
"""Generate ferro-alloy-logistics-view.tsx — R422a
Tuple: (id, batchNo, city, mfr, grade, app, purity, carbonContent, investCr, status, priority, origin, dest, zone, remarks)
"""

ICON = "Hammer"
HEX = "#e11d48"
CSSCLASS = "rose"
INTERFACE = "FerroAlloyRecord"
FUNCNAME = "FerroAlloyLogisticsView"
VARNAME = "ferroAlloyRecords"
TITLE = "Ferro Alloy Logistics"
DESC = "Indian ferro alloy (Fe-Cr, Fe-Mn, Fe-Si, Fe-Mo) steelmaking, foundry, welding and superalloy supply chain tracking across 14 grades"
GRADEFIELD = "faGrade"
UNITPROP = "carbonContent"

records = [
    ("FA-0001", "FA-B2401", "Mumbai", "MIDHANI", "FeCr HC 65/6", "SAIL Bhilai Blast Furnace Charge", 98.5, 6.2, 780, "Delivered", "Critical",
     "MIDHANI Hyderabad (TG)", "SAIL Bhilai (CG)", "South",
     "High-carbon ferro chrome 65/6 for SAIL Bhilai basic oxygen furnace stainless steel melting charge &#8594; 65% Cr &#8594; &#8377;780Cr for 8,000 tonnes &#8594; India &#8377;4,800Cr FeCr HC &#8594; SAIL 6 BOF &#8594; 6.2% C &#8594; &#8594; Lump &#8594; &#8594; HC65/6 &#8594; &#8594; Steel"),
    ("FA-0002", "FA-B2402", "Bengaluru", "DRDO DMRL", "FeMo 70 Grade", "BEL LCA Mk1A Undercarriage", 99.2, 0.12, 860, "In Transit", "Critical",
     "IMFA Bhubaneswar (OD)", "BEL Bengaluru (KA)", "South",
     "Ferro molybdenum 70% for HAL Tejas LCA Mk1A landing gear and undercarriage forging alloy &#8594; 70% Mo &#8594; &#8377;860Cr for 600 tonnes &#8594; India &#8377;6,200Cr FeMo &#8594; BEL 40 aircraft &#8594; 0.12% C &#8594; &#8594; Lump &#8594; &#8594; FeMo70 &#8594; &#8594; Aerospace"),
    ("FA-0003", "FA-B2403", "Chennai", "Tata Steel", "FeMn HC 75/7", "JSW Steel Vijayanagar BOF", 97.8, 7.1, 620, "Delivered", "High",
     "Tata Steel Ferro Alloys Jharkhand (JH)", "JSW Steel Vijayanagar (KA)", "South",
     "High-carbon ferro manganese 75/7 for JSW Steel Vijayanagar blast furnace deoxidizer and alloying &#8594; 75% Mn &#8594; &#8377;620Cr for 12,000 tonnes &#8594; India &#8377;3,800Cr FeMn HC &#8594; JSW 4 BOF &#8594; 7.1% C &#8594; &#8594; Lump &#8594; &#8594; HC75/7 &#8594; &#8594; Steel"),
    ("FA-0004", "FA-B2404", "Hyderabad", "Bharat Forge", "FeSi 75 Grade", "Bharat Forge Crankshaft Ingot", 98.4, 0.15, 440, "Delivered", "High",
     "Ferro Alloys Corp Bangalore (KA)", "Bharat Forge Pune (MH)", "South",
     "Ferro silicon 75% for Bharat Forge crankshaft and axle forging deoxidizer and inoculant &#8594; 75% Si &#8594; &#8377;440Cr for 4,000 tonnes &#8594; India &#8377;2,600Cr FeSi75 &#8594; Bharat Forge 5M shafts &#8594; 0.15% C &#8594; &#8594; Lump &#8594; &#8594; FeSi75 &#8594; &#8594; Auto"),
    ("FA-0005", "FA-B2405", "Kolkata", "Shyam Ferro Alloys", "FeCr LC 70/0.05", "Tata Power Transformer Core", 99.6, 0.04, 520, "In Transit", "High",
     "Shyam Ferro Raipur (CG)", "Tata Power Mumbai (MH)", "East",
     "Low-carbon ferro chrome 70/0.05 for Tata Power 765kV grain-oriented silicon steel core lamination &#8594; 70% Cr &#8594; &#8377;520Cr for 2,000 tonnes &#8594; India &#8377;3,200Cr FeCr LC &#8594; Tata 40 transformers &#8594; 0.04% C &#8594; &#8594; Chip &#8594; &#8594; LC70/0.05 &#8594; &#8594; Power"),
    ("FA-0006", "FA-B2406", "Coimbatore", "L&T Foundry", "FeW 80 Tungsten", "L&T Warship Propeller Hub", 99.1, 0.08, 680, "Delivered", "Critical",
     "Tungsten Alloys Hyderabad (TG)", "L&T Kattupalli (TN)", "South",
     "Ferro tungsten 80% for L&amp;T naval warship propeller hub high-speed steel and martensitic forging &#8594; 80% W &#8594; &#8377;680Cr for 500 tonnes &#8594; India &#8377;4,600Cr FeW &#8594; L&amp;T 12 warships &#8594; 0.08% C &#8594; &#8594; Lump &#8594; &#8594; FeW80 &#8594; &#8594; Naval"),
    ("FA-0007", "FA-B2407", "Pune", "Mahindra Steel", "FeV 50 Vanadium", "Mahindra XUV400 EV Frame", 99.4, 0.1, 560, "Delivered", "High",
     "Vanzar Alloys Vapi (GJ)", "Mahindra Nashik (MH)", "West",
     "Ferro vanadium 50% for Mahindra XUV400 EV chassis frame high-strength low-alloy microalloyed steel &#8594; 50% V &#8594; &#8377;560Cr for 400 tonnes &#8594; India &#8377;3,400Cr FeV50 &#8594; Mahindra 80K frames &#8594; 0.1% C &#8594; &#8594; Lump &#8594; &#8594; FeV50 &#8594; &#8594; Auto"),
    ("FA-0008", "FA-B2408", "Jaipur", "Rajasthan Ferro Alloys", "FeNi 20 Nickel", "Godrej Appliance Motor", 98.8, 0.2, 340, "Delivered", "Medium",
     "Rajasthan Ferro Alloys Udaipur (RJ)", "Godrej Mumbai (MH)", "West",
     "Ferro nickel 20% for Godrej washing machine motor lamination stainless steel rotor core &#8594; 20% Ni &#8594; &#8377;340Cr for 1,500 tonnes &#8594; India &#8377;2,000Cr FeNi20 &#8594; Godrej 5M motors &#8594; 0.2% C &#8594; &#8594; Lump &#8594; &#8594; FeNi20 &#8594; &#8594; Appliance"),
    ("FA-0009", "FA-B2409", "Guwahati", "Assam Ferro Alloys", "FeNb 65 Niobium", "Jio 5G Tower Girder", 99.3, 0.06, 480, "In Transit", "High",
     "Assam Ferro Alloys Silchar (AS)", "Jio Mumbai (MH)", "East",
     "Ferro niobium 65% for Reliance Jio 5G tower structural steel HSLA girder microalloying &#8594; 65% Nb &#8594; &#8377;480Cr for 300 tonnes &#8594; India &#8377;3,000Cr FeNb65 &#8594; Jio 100K towers &#8594; 0.06% C &#8594; &#8594; Lump &#8594; &#8594; FeNb65 &#8594; &#8594; Telecom"),
    ("FA-0010", "FA-B2410", "Ahmedabad", "Gujarat Alloys", "FeSiMn 65/15", "Bajaj Auto Chassis Rail", 98.6, 1.2, 420, "Delivered", "Medium",
     "Gujarat Alloys Kutch (GJ)", "Bajaj Auto Pune (MH)", "West",
     "Ferro silico manganese 65/15 for Bajaj Pulsar motorcycle chassis rail structural steel complex deoxidizer &#8594; 65% Mn &#8594; &#8377;420Cr for 6,000 tonnes &#8594; India &#8377;2,400Cr FeSiMn &#8594; Bajaj 8M rails &#8594; 1.2% C &#8594; &#8594; Lump &#8594; &#8594; SiMn65/15 &#8594; &#8594; Auto"),
    ("FA-0011", "FA-B2411", "Lucknow", "UP Ferro Alloys", "FeTi 70 Titanium", "Adani Pipeline Desulf", 99.0, 0.08, 540, "Delivered", "Medium",
     "UP Ferro Alloys Kanpur (UP)", "Adani Mundra (GJ)", "North",
     "Ferro titanium 70% for Adani natural gas pipeline inner wall desulfurizer and inclusion modifier &#8594; 70% Ti &#8594; &#8377;540Cr for 800 tonnes &#8594; India &#8377;3,200Cr FeTi70 &#8594; Adani 200 km &#8594; 0.08% C &#8594; &#8594; Lump &#8594; &#8594; FeTi70 &#8594; &#8594; Oil &amp; Gas"),
    ("FA-0012", "FA-B2412", "Visakhapatnam", "Vizag Ferro Alloys", "FeCr LC 70/0.03 Nuclear", "GRSE Project 75I Hull Plate", 99.7, 0.02, 920, "Delayed", "Critical",
     "Vizag Ferro Alloys Visakhapatnam (AP)", "GRSE Kolkata (WB)", "East",
     "Ultra-low carbon ferro chrome 70/0.03 for GRSE Project 75I submarine hull special steel nuclear-grade forging &#8594; 70% Cr &#8594; &#8377;920Cr for 450 tonnes &#8597; India &#8377;7,600Cr FeCr nuclear &#8594; GRSE 6 submarines &#8597; 0.02% C &#8597; &#8594; Lump &#8594; &#8594; LC70/0.03 &#8594; &#8594; Naval"),
    ("FA-0013", "FA-B2413", "Bhopal", "BHEL Ferro Div", "FeMo 60 BHEL", "BHEL 800MW GT Blade", 99.2, 0.1, 720, "In Transit", "Critical",
     "IMFA Rayagada (OD)", "BHEL Hyderabad (TG)", "Central",
     "Ferro molybdenum 60% for BHEL 800MW gas turbine nickel superalloy single-crystal blade forging &#8594; 60% Mo &#8594; &#8377;720Cr for 400 tonnes &#8594; India &#8377;5,200Cr FeMo GT &#8594; BHEL 30 GTs &#8594; 0.1% C &#8594; &#8594; Lump &#8594; &#8594; FeMo60 &#8594; &#8594; Power"),
    ("FA-0014", "FA-B2414", "Rourkela", "SAIL Ferro Alloys", "FeSi 45 Low Cost", "Welspun Galvanized Pipe", 97.2, 0.2, 320, "Delivered", "Medium",
     "SAIL Rourkela (OD)", "Welspun Vapi (GJ)", "East",
     "Ferro silicon 45% low-cost grade for Welspun galvanized steel pipe batch galvanizing silicon alloying &#8594; 45% Si &#8594; &#8377;320Cr for 5,000 tonnes &#8594; India &#8377;1,800Cr FeSi45 &#8594; Welspun 4K pipes &#8594; 0.2% C &#8594; &#8594; Lump &#8594; &#8594; FeSi45 &#8594; &#8594; Steel"),
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
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Carbon:</span><span className=\"font-medium\">{record." + UNITPROP + "}%</span></div>")
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
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Steelmaking &amp; Infrastructure</div><div className=\"text-xs text-muted-foreground mt-1\">SAIL BOF FeCr &#8594; JSW FeMn &#8594; Tata Steel FeSi driving &#8594; &#8377;2,020Cr combined &#8594; backbone of Indian steel</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Naval &amp; Defense Superalloys</div><div className=\"text-xs text-muted-foreground mt-1\">GRSE submarine hull FeCr LC &#8594; L&amp;T warship propeller FeW &#8594; BHEL GT blade FeMo &#8594; &#8377;2,320Cr combined &#8594; strategic alloys</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Automotive &amp; EV Microalloying</div><div className=\"text-xs text-muted-foreground mt-1\">Mahindra EV FeV &#8594; Bajaj FeSiMn &#8594; Bharat Forge FeSi &#8594; &#8594; &#8377;1,420Cr combined &#8594; lightweight vehicle push</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Monsoon Disruption Alert</div><div className=\"text-xs text-muted-foreground mt-1\">FA-B2412 GRSE Project 75I hull plate delayed &#8594; monsoon Visakhapatnam port congestion &#8594; submarine steel forging at risk</div></div>")
lines.append("          </div></CardContent></Card>")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Investment Landscape</CardTitle></CardHeader><CardContent><div className=\"space-y-3 text-sm\">")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className=\"text-xs text-muted-foreground mt-1\">Across 14 ferro alloy grades spanning steel, power, naval, aerospace, EV, telecom, appliance and pipeline &#8594; avg purity {kpiData.avgPurity}%</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Critical Priority: 6 Records</div><div className=\"text-xs text-muted-foreground mt-1\">SAIL BOF &#8594; BEL aircraft &#8594; L&amp;T warship &#8594; GRSE submarine &#8594; BHEL GT &#8594; DRDO missile-grade</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Top Manufacturers</div><div className=\"text-xs text-muted-foreground mt-1\">Tata Steel &#8594; MIDHANI &#8594; SAIL lead volume &#8594; IMFA &#8594; Shyam Ferro &#8594; Bharat Forge drive application-specific</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Import Dependency Alert</div><div className=\"text-xs text-muted-foreground mt-1\">FeMo, FeV, FeNb, FeW heavily import-dependent &#8594; China/South Africa supply risk &#8594; Atmanirbhar ferro alloy push critical</div></div>")
lines.append("          </div></CardContent></Card>")
lines.append("        </div>")
lines.append("      )}")
lines.append("    </div>")
lines.append("  );")
lines.append("}")
lines.append("")

content = "\n".join(lines)

import re
entities = re.findall(r"&#(\d+);", content)
malformed = [e for e in entities if int(e) > 9999]
print("HTML entities:", len(entities))
print("Malformed:", len(malformed))
if malformed:
    print("MALFORMED entities:", malformed)

with open("/home/z/my-project/src/components/modules/ferro-alloy-logistics-view.tsx", "w") as f:
    f.write(content)
print("Written: ferro-alloy-logistics-view.tsx")
print("Lines:", len(lines))
