#!/usr/bin/env python3
"""Generate calcium-carbide-logistics-view.tsx — R422b
Tuple: (id, batchNo, city, mfr, grade, app, purity, gasYieldLKG, investCr, status, priority, origin, dest, zone, remarks)
"""

ICON = "FlaskConical"
HEX = "#7c3aed"
CSSCLASS = "violet"
INTERFACE = "CalciumCarbideRecord"
FUNCNAME = "CalciumCarbideLogisticsView"
VARNAME = "calciumCarbideRecords"
TITLE = "Calcium Carbide Logistics"
DESC = "Indian calcium carbide (CaC2) acetylene gas, steel desulfurization, chemical synthesis and mining supply chain tracking across 14 grades"
GRADEFIELD = "ccGrade"
UNITPROP = "gasYieldLKG"

records = [
    ("CC-0001", "CC-B2401", "Mumbai", "Gujurat Carbide", "CaC2 295 L/KG Acetylene", "Larsen &amp; Toubro Shipyard Welding", 98.8, 295, 720, "Delivered", "Critical",
     "Gujarat Carbide Rajkot (GJ)", "L&amp;T Kattupalli (TN)", "West",
     "Calcium carbide 295 L/KG for L&amp;T Kattupalli shipyard oxy-acetylene plate cutting and structural welding &#8594; 85% CaC2 &#8594; &#8377;720Cr for 12,000 tonnes &#8594; India &#8377;5,200Cr CaC2 gas &#8594; L&amp;T 8 warships &#8594; 295 L/KG &#8594; &#8594; Lump &#8594; &#8594; Acetylene &#8594; &#8594; Naval"),
    ("CC-0002", "CC-B2402", "Bengaluru", "DRDO DMRL", "CaC2 290 Military Grade", "BEL BrahMos Launcher Frame", 99.2, 290, 840, "In Transit", "Critical",
     "Kerala Carbide Kochi (KL)", "BEL Bengaluru (KA)", "South",
     "Military-grade calcium carbide for BEL BrahMos missile launcher frame field welding and cutting &#8594; 88% CaC2 &#8594; &#8377;840Cr for 6,000 tonnes &#8594; India &#8377;6,400Cr CaC2 military &#8594; BEL 200 launchers &#8594; 290 L/KG &#8594; &#8594; Lump &#8594; &#8594; Welding &#8594; &#8594; Defense"),
    ("CC-0003", "CC-B2403", "Chennai", "Tata Steel", "CaC2 280 Steel Desulf", "JSW Steel Desulfurization", 97.6, 280, 520, "Delivered", "High",
     "Tata Carbide Jamshedpur (JH)", "JSW Steel Salem (TN)", "East",
     "Calcium carbide 280 L/KG for JSW Steel LD converter secondary steel desulfurization injection &#8594; 82% CaC2 &#8594; &#8377;520Cr for 18,000 tonnes &#8594; India &#8377;3,600Cr CaC2 desulf &#8594; JSW 6 converters &#8594; 280 L/KG &#8594; &#8594; Granule &#8594; &#8594; Desulf &#8594; &#8594; Steel"),
    ("CC-0004", "CC-B2404", "Hyderabad", "Bharat Forge", "CaC2 295 Auto Grade", "Bharat Forge Die Welding", 98.5, 295, 480, "Delivered", "High",
     "AP Carbide Visakhapatnam (AP)", "Bharat Forge Pune (MH)", "South",
     "Auto-grade calcium carbide for Bharat Forge die repair and crankshaft forging torch brazing &#8594; 85% CaC2 &#8594; &#8377;480Cr for 5,000 tonnes &#8594; India &#8377;3,200Cr CaC2 auto &#8594; Bharat Forge 200 dies &#8594; 295 L/KG &#8594; &#8594; Lump &#8594; &#8594; Auto"),
    ("CC-0005", "CC-B2405", "Kolkata", "Shyam Carbide", "CaC2 270 Low Cost", "SAIL Rail Welding", 97.2, 270, 340, "In Transit", "Medium",
     "Shyam Carbide Asansol (WB)", "SAIL Durgapur (WB)", "East",
     "Low-cost calcium carbide for SAIL Durgapur rail track flash-butt welding and thermite welding &#8594; 78% CaC2 &#8594; &#8377;340Cr for 15,000 tonnes &#8594; India &#8377;2,200Cr CaC2 rail &#8594; SAIL 500 km track &#8594; 270 L/KG &#8594; &#8594; Lump &#8594; &#8594; Rail"),
    ("CC-0006", "CC-B2406", "Coimbatore", "BHEL R&amp;D", "CaC2 290 Pharma Grade", "Sun Pharma Vitamin D Synthesis", 99.4, 290, 560, "Delivered", "High",
     "TN Carbide Hosur (TN)", "Sun Pharma Vadodara (GJ)", "South",
     "Pharma-grade calcium carbide for Sun Pharma vitamin D3 synthesis via isoprenyl intermediates &#8594; 90% CaC2 &#8594; &#8377;560Cr for 2,000 tonnes &#8594; India &#8377;4,200Cr CaC2 pharma &#8594; Sun Pharma 800M doses &#8594; 290 L/KG &#8594; &#8594; Powder &#8594; &#8594; Pharma"),
    ("CC-0007", "CC-B2407", "Pune", "Mahindra Carbide", "CaC2 295 Mining", "Coal India Mine Cutting", 98.2, 295, 440, "Delivered", "Medium",
     "Mahindra Carbide Nagpur (MH)", "Coal India Ranchi (JH)", "West",
     "Mining-grade calcium carbide for Coal India underground coal mine rock cutting and roof bolting gas lamp &#8594; 85% CaC2 &#8594; &#8377;440Cr for 8,000 tonnes &#8594; India &#8377;2,800Cr CaC2 mining &#8594; CIL 40 mines &#8594; 295 L/KG &#8594; &#8594; Lump &#8594; &#8594; Mining"),
    ("CC-0008", "CC-B2408", "Jaipur", "Rajasthan Carbide", "CaC2 275 Lab Grade", "CSIR Lab Reagent", 99.6, 275, 280, "Delivered", "Medium",
     "Rajasthan Carbide Udaipur (RJ)", "CSIR New Delhi (DL)", "West",
     "Ultra-pure lab-grade calcium carbide for CSIR-NPL acetylene generation standard reference and analytical chemistry &#8594; 95% CaC2 &#8594; &#8377;280Cr for 200 tonnes &#8594; India &#8377;1,600Cr CaC2 lab &#8594; CSIR 50 labs &#8594; 275 L/KG &#8594; &#8594; Powder &#8594; &#8594; Lab"),
    ("CC-0009", "CC-B2409", "Guwahati", "Assam Carbide", "CaC2 280 Tea Estate", "Tata Tea Estate Processing", 97.8, 280, 320, "In Transit", "Medium",
     "Assam Carbide Tezpur (AS)", "Tata Tea Munnar (KL)", "East",
     "Calcium carbide for Tata Tea Munnar tea estate artificial fruit ripening of processing building &#8594; 82% CaC2 &#8594; &#8377;320Cr for 3,000 tonnes &#8594; India &#8377;2,000Cr CaC2 agriculture &#8594; Tata 20 estates &#8594; 280 L/KG &#8594; &#8594; Lump &#8594; &#8594; Agriculture"),
    ("CC-0010", "CC-B2410", "Ahmedabad", "Gujarat Carbide Corp", "CaC2 295 Pipeline", "Adani Gas Pipeline Welding", 98.4, 295, 620, "Delivered", "High",
     "Gujarat Carbide Ahmedabad (GJ)", "Adani Hazira (GJ)", "West",
     "High-yield calcium carbide for Adani natural gas pipeline cross-country route field welding &#8594; 85% CaC2 &#8594; &#8377;620Cr for 10,000 tonnes &#8594; India &#8377;4,400Cr CaC2 pipeline &#8594; Adani 400 km &#8594; 295 L/KG &#8594; &#8594; Lump &#8594; &#8594; Oil &amp; Gas"),
    ("CC-0011", "CC-B2411", "Lucknow", "UP Carbide Works", "CaC2 290 FGD", "NTPC Flue Gas Desulf", 98.0, 290, 540, "Delivered", "Medium",
     "UP Carbide Kanpur (UP)", "NTPC Unchahar (UP)", "North",
     "Calcium carbide for NTPC Unchahar thermal power plant flue gas desulfurization reagent &#8594; 88% CaC2 &#8594; &#8377;540Cr for 6,000 tonnes &#8594; India &#8377;3,600Cr CaC2 FGD &#8594; NTPC 10 units &#8594; 290 L/KG &#8594; &#8594; Granule &#8594; &#8594; Power"),
    ("CC-0012", "CC-B2412", "Visakhapatnam", "Vizag Carbide Works", "CaC2 290 Submarine", "GRSE Project 75I Hull Weld", 99.3, 290, 920, "Delayed", "Critical",
     "Vizag Carbide Visakhapatnam (AP)", "GRSE Kolkata (WB)", "East",
     "Naval-grade calcium carbide for GRSE Project 75I submarine pressure hull special welding and oxy-acetylene seam &#8594; 90% CaC2 &#8594; &#8377;920Cr for 4,000 tonnes &#8597; India &#8377;7,600Cr CaC2 submarine &#8594; GRSE 6 submarines &#8597; 290 L/KG &#8597; &#8594; Lump &#8594; &#8594; Naval"),
    ("CC-0013", "CC-B2413", "Bhopal", "BHEL Carbide Div", "CaC2 285 Power Plant", "BHEL Boiler Tube Weld", 98.6, 285, 680, "In Transit", "High",
     "BHEL Carbide Bhopal (MP)", "BHEL Hyderabad (TG)", "Central",
     "Calcium carbide for BHEL 660MW boiler superheater tube panel welding and header fabrication &#8594; 86% CaC2 &#8594; &#8377;680Cr for 7,000 tonnes &#8594; India &#8377;4,800Cr CaC2 boiler &#8594; BHEL 30 boilers &#8594; 285 L/KG &#8594; &#8594; Lump &#8594; &#8594; Power"),
    ("CC-0014", "CC-B2414", "Rourkela", "SAIL Carbide Div", "CaC2 270 General", "Reliance Steel Foundry", 97.4, 270, 380, "Delivered", "Medium",
     "SAIL Rourkela (OD)", "Reliance Jamnagar (GJ)", "East",
     "General-purpose calcium carbide for Reliance Jamnagar refinery steel foundry casting cleanup and acetylene generation &#8594; 78% CaC2 &#8594; &#8377;380Cr for 12,000 tonnes &#8594; India &#8377;2,400Cr CaC2 foundry &#8594; Reliance 20 furnaces &#8594; 270 L/KG &#8594; &#8594; Lump &#8594; &#8594; Oil &amp; Gas"),
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
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Gas Yield:</span><span className=\"font-medium\">{record." + UNITPROP + "} L/KG</span></div>")
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
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Naval &amp; Defense Welding</div><div className=\"text-xs text-muted-foreground mt-1\">L&amp;T shipyard &#8594; BEL BrahMos launcher &#8594; GRSE submarine hull driving &#8594; &#8377;2,480Cr combined &#8594; strategic oxy-acetylene</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Steelmaking Desulfurization</div><div className=\"text-xs text-muted-foreground mt-1\">JSW converter &#8594; SAIL rail &#8594; Reliance foundry &#8594; &#8594; &#8377;1,240Cr combined &#8594; secondary metallurgy critical</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Power &amp; Pipeline Welding</div><div className=\"text-xs text-muted-foreground mt-1\">BHEL boiler &#8594; NTPC FGD &#8594; Adani pipeline &#8594; &#8377;1,840Cr combined &#8594; infrastructure backbone</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Monsoon Disruption Alert</div><div className=\"text-xs text-muted-foreground mt-1\">CC-B2412 GRSE Project 75I hull welding delayed &#8594; monsoon Visakhapatnam port congestion &#8594; submarine welding schedule at risk</div></div>")
lines.append("          </div></CardContent></Card>")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Investment Landscape</CardTitle></CardHeader><CardContent><div className=\"space-y-3 text-sm\">")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className=\"text-xs text-muted-foreground mt-1\">Across 14 calcium carbide grades spanning naval, defense, steel, power, pipeline, pharma, mining and agriculture &#8594; avg purity {kpiData.avgPurity}%</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Critical Priority: 4 Records</div><div className=\"text-xs text-muted-foreground mt-1\">L&amp;T shipyard &#8594; BEL missile launcher &#8594; GRSE submarine hull &#8594; &#8594; national security welding chain</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Top Manufacturers</div><div className=\"text-xs text-muted-foreground mt-1\">Gujarat Carbide &#8594; Kerala Carbide &#8594; AP Carbide lead &#8594; BHEL &#8594; SAIL &#8594; Shyam Carbide drive regional</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Acetylene vs Desulfurization Split</div><div className=\"text-xs text-muted-foreground mt-1\">60% volume for welding/cutting &#8594; 30% for steel desulfurization &#8594; 10% for pharma and specialty &#8594; dual-market dynamics</div></div>")
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

with open("/home/z/my-project/src/components/modules/calcium-carbide-logistics-view.tsx", "w") as f:
    f.write(content)
print("Written: calcium-carbide-logistics-view.tsx")
print("Lines:", len(lines))
