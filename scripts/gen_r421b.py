#!/usr/bin/env python3
"""Generate lead-free-solder-logistics-view.tsx — R421b
Tuple: (id, batchNo, city, mfr, grade, app, purity, meltTempC, investCr, status, priority, origin, dest, zone, remarks)
"""

ICON = "Plug"
HEX = "#059669"
CSSCLASS = "emerald"
INTERFACE = "LeadFreeSolderRecord"
FUNCNAME = "LeadFreeSolderLogisticsView"
VARNAME = "leadFreeSolderRecords"
TITLE = "Lead-Free Solder Logistics"
DESC = "Indian lead-free solder (Sn-Ag-Cu, Sn-Bi, Sn-Zn) electronics, automotive, aerospace and medical supply chain tracking across 14 grades"
GRADEFIELD = "lfGrade"
UNITPROP = "meltTempC"

records = [
    ("LFS-0001", "LFS-B2401", "Mumbai", "Hindustan Solder", "SAC305 Sn96.5Ag3Cu0.5", "ISRO GSAT-7B BGA Package", 99.7, 217, 820, "Delivered", "Critical",
     "Hindustan Solder Mumbai (MH)", "ISRO Bengaluru (KA)", "West",
     "SAC305 lead-free solder paste for ISRO GSAT-7B military communication satellite BGA and CSP reflow &#8594; 3% Ag &#8594; &#8377;820Cr for 800 tonnes &#8594; India &#8377;5,400Cr LF solder &#8594; ISRO 12 satellites &#8594; 217&#176;C &#8594; &#8594; Paste &#8594; &#8594; SAC305 &#8594; &#8594; Space"),
    ("LFS-0002", "LFS-B2402", "Bengaluru", "DRDO DMRL", "SAC387 Sn95.5Ag3.8Cu0.7", "BEL Nirbhay Cruise PCB", 99.8, 217, 740, "In Transit", "Critical",
     "DRDO Hyderabad (TG)", "BEL Bengaluru (KA)", "South",
     "SAC387 no-clean solder for BEL Nirbhay cruise missile navigation computer multilayer PCB assembly &#8594; 3.8% Ag &#8594; &#8377;740Cr for 600 tonnes &#8594; India &#8377;5,200Cr LF defense &#8594; BEL 80 missiles &#8594; 217&#176;C &#8594; &#8594; Paste &#8594; &#8594; SAC387 &#8594; &#8594; Defense"),
    ("LFS-0003", "LFS-B2403", "Chennai", "Sterlite Solder", "SAC405 Sn95.5Ag4Cu0.5", "Wipro Server Motherboard", 99.5, 217, 520, "Delivered", "High",
     "Sterlite Solder Chennai (TN)", "Wipro Bengaluru (KA)", "South",
     "SAC405 lead-free solder bar for Wipro enterprise server motherboard wave soldering and SMT reflow &#8594; 4% Ag &#8594; &#8377;520Cr for 1,200 tonnes &#8594; India &#8377;3,200Cr LF IT &#8594; Wipro 500K boards &#8594; 217&#176;C &#8594; &#8594; Bar &#8594; &#8594; SAC405 &#8594; &#8594; IT"),
    ("LFS-0004", "LFS-B2404", "Hyderabad", "Bharat Electronics", "Sn-Bi58 Low Melt 138C", "Dixon LED TV Driver Board", 99.2, 138, 340, "Delivered", "Medium",
     "Bharat Electronics Hyderabad (TG)", "Dixon Noida (UP)", "South",
     "Sn-Bi58 low-melt lead-free solder for Dixon LED TV backlight driver board temperature-sensitive component &#8594; 58% Bi &#8594; &#8377;340Cr for 400 tonnes &#8594; India &#8377;2,200Cr LF consumer &#8594; Dixon 20M boards &#8594; 138&#176;C &#8594; &#8594; Wire &#8594; &#8594; SnBi58 &#8594; &#8594; Consumer"),
    ("LFS-0005", "LFS-B2405", "Kolkata", "Tata Solder Div", "Sn-Zn9 Bi3 Low Cost", "Tata Steel Automation PLC", 98.6, 197, 420, "In Transit", "High",
     "Tata Solder Kolkata (WB)", "Tata Steel Jamshedpur (JH)", "East",
     "Sn-Zn9-Bi3 lead-free solder for Tata Steel blast furnace automation PLC controller soldering &#8594; 9% Zn &#8594; &#8377;420Cr for 700 tonnes &#8594; India &#8377;2,800Cr LF industrial &#8594; Tata 120 PLCs &#8594; 197&#176;C &#8594; &#8594; Bar &#8594; &#8594; SnZn9 &#8594; &#8594; Industrial"),
    ("LFS-0006", "LFS-B2406", "Coimbatore", "Larsen &amp; Toubro", "SAC307 Sn96.5Ag0.3Cu3", "L&amp;T Switchgear Contact", 99.4, 217, 560, "Delivered", "High",
     "L&amp;T Coimbatore (TN)", "L&amp;T Mumbai (MH)", "South",
     "SAC307 lead-free solder for L&amp;T low-voltage switchgear MCCB contact assembly silver plating solder &#8594; 3% Cu &#8594; &#8377;560Cr for 900 tonnes &#8594; India &#8377;3,800Cr LF electrical &#8594; L&amp;T 2M units &#8594; 217&#176;C &#8594; &#8594; Wire &#8594; &#8594; SAC307 &#8594; &#8594; Electrical"),
    ("LFS-0007", "LFS-B2407", "Pune", "Mahindra Solder", "SAC305 Auto Grade", "Mahindra XUV400 EV Inverter", 99.6, 217, 680, "Delivered", "Critical",
     "Mahindra Solder Pune (MH)", "Mahindra Chakan (MH)", "West",
     "SAC305 automotive-grade for Mahindra XUV400 EV inverter power module IGBT solder die attach &#8594; 3% Ag &#8594; &#8377;680Cr for 500 tonnes &#8594; India &#8377;4,400Cr LF auto &#8594; Mahindra 80K EVs &#8594; 217&#176;C &#8594; &#8594; Paste &#8594; &#8594; SAC305 &#8594; &#8594; Auto"),
    ("LFS-0008", "LFS-B2408", "Jaipur", "Rajasthan Solder", "Sn-Cu0.7 Low Cost Ni", "Godrej AC PCB SMD", 98.2, 227, 280, "Delivered", "Medium",
     "Rajasthan Solder Jaipur (RJ)", "Godrej Mumbai (MH)", "West",
     "Sn-Cu0.7-Ni lead-free solder for Godrej split air conditioner PCB SMD placement and wave soldering &#8594; 0.7% Cu &#8594; &#8377;280Cr for 1,500 tonnes &#8594; India &#8377;1,800Cr LF appliance &#8594; Godrej 5M PCBs &#8594; 227&#176;C &#8594; &#8594; Bar &#8594; &#8594; SnCu &#8594; &#8594; Appliance"),
    ("LFS-0009", "LFS-B2409", "Guwahati", "Assam Solder Works", "SAC305 Pharma Grade", "Trivitron MRI Coil PCB", 99.8, 217, 520, "In Transit", "High",
     "Assam Solder Silchar (AS)", "Trivitron Chennai (TN)", "East",
     "Medical-grade SAC305 for Trivitron 3T MRI gradient coil driver PCB with class-III medical trace &#8594; 3% Ag &#8594; &#8377;520Cr for 300 tonnes &#8594; India &#8377;3,400Cr LF medical &#8594; Trivitron 200 scanners &#8594; 217&#176;C &#8594; &#8594; Paste &#8594; &#8594; SAC305 &#8594; &#8594; Medical"),
    ("LFS-0010", "LFS-B2410", "Ahmedabad", "Gujarat Solder Corp", "Sn-99.99 Ultra Pure", "Bajaj Auto ECU Module", 99.99, 232, 460, "Delivered", "High",
     "Gujarat Solder Ahmedabad (GJ)", "Bajaj Auto Pune (MH)", "West",
     "Ultra-pure Sn-99.99 lead-free solder for Bajaj Pulsar NS200 motorcycle ECU module fine-pitch QFP solder &#8594; 99.99% Sn &#8594; &#8377;460Cr for 800 tonnes &#8594; India &#8377;2,800Cr LF moto &#8594; Bajaj 3M ECUs &#8594; 232&#176;C &#8594; &#8594; Wire &#8594; &#8594; Sn99 &#8594; &#8594; Auto"),
    ("LFS-0011", "LFS-B2411", "Lucknow", "UP Solder Industries", "SAC405 Telecom", "Jio 5G Antenna PCB", 99.5, 217, 580, "Delivered", "High",
     "UP Solder Lucknow (UP)", "Jio Mumbai (MH)", "North",
     "SAC405 lead-free solder for Reliance Jio 5G massive MIMO antenna unit RF PCB and power amplifier &#8594; 4% Ag &#8594; &#8377;580Cr for 700 tonnes &#8594; India &#8377;3,800Cr LF telecom &#8594; Jio 100K antennas &#8594; 217&#176;C &#8594; &#8594; Paste &#8594; &#8594; SAC405 &#8594; &#8594; Telecom"),
    ("LFS-0012", "LFS-B2412", "Visakhapatnam", "Vizag Solder Works", "SAC305 Submarine", "GRSE Project 75I Sonar PCB", 99.6, 217, 940, "Delayed", "Critical",
     "Vizag Solder Visakhapatnam (AP)", "GRSE Kolkata (WB)", "East",
     "Naval-grade SAC305 for GRSE Project 75I submarine towed array sonar processing unit multilayer PCB &#8594; 3% Ag &#8594; &#8377;940Cr for 350 tonnes &#8597; India &#8377;7,600Cr LF naval &#8594; GRSE 6 submarines &#8594; 217&#176;C &#8597; &#8594; Paste &#8594; &#8594; SAC305 &#8594; &#8594; Naval"),
    ("LFS-0013", "LFS-B2413", "Bhopal", "BHEL Solder Div", "Sn-Ag4 High Temp", "BHEL Steam Turbine Sensor", 99.3, 221, 620, "In Transit", "High",
     "BHEL Bhopal (MP)", "BHEL Hyderabad (TG)", "Central",
     "Sn-Ag4 high-temperature lead-free solder for BHEL 660MW steam turbine vibration sensor and RTD &#8594; 4% Ag &#8594; &#8377;620Cr for 450 tonnes &#8594; India &#8377;4,200Cr LF power &#8594; BHEL 30 turbines &#8594; 221&#176;C &#8594; &#8594; Wire &#8594; &#8594; SnAg4 &#8594; &#8594; Power"),
    ("LFS-0014", "LFS-B2414", "Rourkela", "SAIL Solder Div", "Sn-Cu3 High Strength", "Adani Solar Panel String", 98.4, 225, 360, "Delivered", "Medium",
     "SAIL Rourkela (OD)", "Adani Mundra (GJ)", "East",
     "Sn-Cu3 high-strength lead-free solder for Adani solar panel PV string soldering and junction box connection &#8594; 3% Cu &#8594; &#8377;360Cr for 1,000 tonnes &#8594; India &#8377;2,200Cr LF solar &#8594; Adani 10GW panels &#8594; 225&#176;C &#8594; &#8594; Ribbon &#8594; &#8594; SnCu3 &#8594; &#8594; Solar"),
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
lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Melt Temp:</span><span className=\"font-medium\">{record." + UNITPROP + "}&#176;C</span></div>")
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
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Aerospace &amp; Defense Electronics</div><div className=\"text-xs text-muted-foreground mt-1\">ISRO satellite BGA &#8594; DRDO Nirbhay missile PCB &#8594; BEL sonar processing unit driving &#8594; &#8377;2,500Cr combined &#8594; RoHS compliance critical</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">EV &amp; Automotive Transition</div><div className=\"text-xs text-muted-foreground mt-1\">Mahindra XUV400 EV inverter &#8594; Bajaj ECU module &#8594; Tata PLC automation driving &#8594; &#8377;1,560Cr combined &#8594; lead-free mandate push</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Telecom &amp; IT Infrastructure</div><div className=\"text-xs text-muted-foreground mt-1\">Jio 5G antenna PCB &#8594; Wipro server motherboard &#8594; Godrej AC PCB &#8594; &#8377;1,380Cr combined &#8594; digital India backbone</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Monsoon Disruption Alert</div><div className=\"text-xs text-muted-foreground mt-1\">LFS-B2412 GRSE Project 75I sonar PCB delayed &#8594; monsoon Visakhapatnam port congestion &#8594; submarine electronics timeline at risk</div></div>")
lines.append("          </div></CardContent></Card>")
lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Investment Landscape</CardTitle></CardHeader><CardContent><div className=\"space-y-3 text-sm\">")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className=\"text-xs text-muted-foreground mt-1\">Across 14 lead-free solder grades spanning aerospace, defense, auto EV, telecom, IT, medical, industrial and solar &#8594; avg purity {kpiData.avgPurity}%</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Critical Priority: 5 Records</div><div className=\"text-xs text-muted-foreground mt-1\">ISRO satellite &#8594; DRDO missile &#8594; Mahindra EV &#8594; GRSE submarine &#8594; BEL cruise missile &#8594; national security supply chain</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">Top Manufacturers</div><div className=\"text-xs text-muted-foreground mt-1\">Hindustan Solder &#8594; DRDO &#8594; Sterlite lead volume &#8594; Bharat Electronics &#8594; L&amp;T &#8594; Mahindra drive application-specific</div></div>")
lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + CSSCLASS + "-500 bg-" + CSSCLASS + "-50/50\"><div className=\"font-medium\">RoHS &amp; EU Compliance Push</div><div className=\"text-xs text-muted-foreground mt-1\">India RoHS 2026 enforcement driving SAC305 adoption &#8594; Sn-Bi58 low-temp niche &#8594; Sn-Zn cost-effective &#8594; export market access</div></div>")
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

with open("/home/z/my-project/src/components/modules/lead-free-solder-logistics-view.tsx", "w") as f:
    f.write(content)
print("Written: lead-free-solder-logistics-view.tsx")
print("Lines:", len(lines))
