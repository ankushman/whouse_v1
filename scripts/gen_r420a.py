#!/usr/bin/env python3
"""Generate zinc-alloy-logistics-view.tsx — R420a
Tuple: (id, batchNo, city, mfr, grade, app, purity, hardnessHH, investCr, status, priority, origin, dest, zone, remarks)
"""

ICON = "Shield"
HEX = "#16a34a"
CSSCLASS = "green"
INTERFACE = "ZincAlloyRecord"
FUNCNAME = "ZincAlloyLogisticsView"
VARNAME = "zincAlloyRecords"
TITLE = "Zinc Alloy Logistics"
DESC = "Indian zinc alloy (Zn-Al-Cu) die-casting, galvanizing, battery and automotive supply chain tracking across 14 grades"
GRADEFIELD = "znGrade"
UNITPROP = "hardnessHH"

records = [
    ("ZNA-0001", "ZNA-B2401", "Mumbai", "Hindustan Zinc", "ZA-27 Al27Cu2", "Tata Motors Nexon Die Cast Block", 99.1, 105, 720, "Delivered", "Critical",
     "Hindustan Zinc Udaipur (RJ)", "Tata Motors Pune (MH)", "West",
     "ZA-27 zinc-aluminium die-casting alloy for Tata Motors Nexon engine block and transmission case &#8594; 27% Al &#8594; &#8377;720Cr for 8,000 tonnes &#8594; India &#8377;4,800Cr ZA die-cast &#8594; Tata 400K units &#8594; 105 HB &#8594; &#8594; Ingot &#8594; &#8594; ZA27 &#8594; &#8594; Auto"),
    ("ZNA-0002", "ZNA-B2402", "Bengaluru", "DRDO DMRL", "ZA-12 Naval Grade", "BEL Submarine Sonar Housing", 99.4, 92, 860, "In Transit", "Critical",
     "Hindustan Zinc Chittorgarh (RJ)", "BEL Bengaluru (KA)", "South",
     "ZA-12 naval-grade zinc alloy for BEL Project 75I submarine sonar transducer pressure housing &#8594; 12% Al &#8594; &#8377;860Cr for 600 tonnes &#8594; India &#8377;6,200Cr ZA naval &#8594; BEL 6 submarines &#8594; 92 HB &#8594; &#8594; Casting &#8594; &#8594; ZA12 &#8594; &#8594; Naval"),
    ("ZNA-0003", "ZNA-B2403", "Chennai", "Sterlite Zinc", "Zn-99.99 SHG", "JSW Steel Galvanized Coil", 99.99, 45, 580, "Delivered", "High",
     "Sterlite Zinc Hyderabad (TG)", "JSW Steel Salem (TN)", "South",
     "Special high-grade zinc for JSW Steel continuous galvanizing line hot-dip GI coil &#8594; 99.99% Zn &#8594; &#8377;580Cr for 25,000 tonnes &#8594; India &#8377;3,600Cr SHG &#8594; JSW 6 CGLs &#8594; 45 HB &#8594; &#8594; Ingot &#8594; &#8594; SHG &#8594; &#8594; Steel"),
    ("ZNA-0004", "ZNA-B2404", "Hyderabad", "Hyderabad Zinc", "ZA-8 Al8Cu1", "Mahindra XUV700 Die Cast Seat", 98.8, 88, 420, "Delivered", "High",
     "Hyderabad Zinc Hyderabad (TG)", "Mahindra Nagpur (MH)", "South",
     "ZA-8 zinc-aluminium alloy for Mahindra XUV700 seat frame and instrument panel structural casting &#8594; 8% Al &#8594; &#8377;420Cr for 4,000 tonnes &#8594; India &#8377;2,800Cr ZA seat &#8594; Mahindra 200K units &#8594; 88 HB &#8594; &#8594; Ingot &#8594; &#8594; ZA8 &#8594; &#8594; Auto"),
    ("ZNA-0005", "ZNA-B2405", "Kolkata", "Bharat Zinc", "Zn-5 Al-MM", "Godrej Lock Die Cast Body", 99.0, 80, 280, "In Transit", "Medium",
     "Bharat Zinc Kolkata (WB)", "Godrej Mumbai (MH)", "East",
     "Zinc-alloy die-casting for Godrej ultra-lock precision lock body and cylinder housing &#8594; 5% Al &#8594; &#8377;280Cr for 1,200 tonnes &#8594; India &#8377;1,600Cr ZA lock &#8594; Godrej 20M locks &#8594; 80 HB &#8594; &#8594; Casting &#8594; &#8594; Zamak5 &#8594; &#8594; Hardware"),
    ("ZNA-0006", "ZNA-B2406", "Coimbatore", "TN Zinc Works", "Zn-Ag Battery", "Exide Industries Zn-Ag Cell", 99.6, 42, 540, "Delivered", "High",
     "TN Zinc Works Hosur (TN)", "Exide Kolkata (WB)", "South",
     "Zinc-silver alloy for Exide Industries zinc-silver oxide button cell and military reserve battery &#8594; 99.6% Zn &#8594; &#8377;540Cr for 400 tonnes &#8594; India &#8377;3,400Cr Zn battery &#8594; Exide 50M cells &#8594; 42 HB &#8594; &#8594; Powder &#8594; &#8594; ZnAg &#8594; &#8594; Battery"),
    ("ZNA-0007", "ZNA-B2407", "Pune", "Bajaj Zinc Div", "Zn-Cu Brass Ingot", "Bajaj Auto Wheel Rim", 98.5, 75, 340, "Delivered", "Medium",
     "Bajaj Zinc Chakan (MH)", "Bajaj Auto Pune (MH)", "West",
     "Zinc-copper brass alloy ingot for Bajaj Pulsar and Dominar motorcycle spoked wheel rim pressing &#8594; 5% Cu &#8594; &#8377;340Cr for 3,000 tonnes &#8594; India &#8377;1,800Cr Zn brass &#8594; Bajaj 8M wheels &#8594; 75 HB &#8594; &#8594; Ingot &#8594; &#8594; ZnCu &#8594; &#8594; Auto"),
    ("ZNA-0008", "ZNA-B2408", "Jaipur", "Rajasthan Zinc", "ZnO-Pharma Grade", "Sun Pharma Zinc Tablet", 99.8, 38, 380, "Delivered", "Medium",
     "Rajasthan Zinc Jaipur (RJ)", "Sun Pharma Vadodara (GJ)", "West",
     "Pharmaceutical-grade zinc oxide for Sun Pharma zinc supplement and pediatric syrup &#8594; USP grade &#8594; &#8377;380Cr for 2,500 tonnes &#8594; India &#8377;2,000Cr ZnO pharma &#8594; Sun Pharma 800M tabs &#8594; 38 HB &#8594; &#8594; Powder &#8594; &#8594; ZnO &#8594; &#8594; Pharma"),
    ("ZNA-0009", "ZNA-B2409", "Guwahati", "Assam Zinc", "Zn-97% Galv", "Tata Steel Galvanizing Bath", 97.5, 40, 460, "In Transit", "High",
     "Assam Zinc Silchar (AS)", "Tata Steel Jamshedpur (JH)", "East",
     "97% zinc for Tata Steel batch galvanizing bath structural steel and pipe coating &#8594; 97% Zn &#8594; &#8377;460Cr for 18,000 tonnes &#8594; India &#8377;2,600Cr Zn galv &#8594; Tata 4 baths &#8594; 40 HB &#8594; &#8594; Ingot &#8594; &#8594; CGG &#8594; &#8594; Steel"),
    ("ZNA-0010", "ZNA-B2410", "Ahmedabad", "Gujarat Zinc Corp", "Zn-Ni Plating", "Bharat Forge Crankshaft", 99.3, 48, 620, "Delivered", "Critical",
     "Gujarat Zinc Ahmedabad (GJ)", "Bharat Forge Pune (MH)", "West",
     "Zinc-nickel alloy for Bharat Forge crankshaft electroplating anode and barrel plating &#8594; 12% Ni &#8594; &#8377;620Cr for 800 tonnes &#8594; India &#8377;4,400Cr Zn-Ni &#8594; Bharat Forge 5M shafts &#8594; 48 HB &#8594; &#8594; Anode &#8594; &#8594; ZnNi &#8594; &#8594; Auto"),
    ("ZNA-0011", "ZNA-B2411", "Lucknow", "UP Zinc Industries", "Zn-Ti Corrosion", "Reliance Pipeline Internal", 99.2, 55, 480, "Delivered", "Medium",
     "UP Zinc Lucknow (UP)", "Reliance Jamnagar (GJ)", "North",
     "Zinc-titanium alloy for Reliance Jamnagar refinery pipeline internal corrosion inhibitor anode &#8594; 0.1% Ti &#8594; &#8377;480Cr for 600 tonnes &#8594; India &#8377;2,800Cr Zn sacrificial &#8594; Reliance 200 km &#8594; 55 HB &#8594; &#8594; Anode &#8594; &#8594; ZnTi &#8594; &#8594; Oil &amp; Gas"),
    ("ZNA-0012", "ZNA-B2412", "Visakhapatnam", "Vizag Zinc Works", "ZA-43 Al43", "GRSE Corvette Deck Fitting", 99.0, 110, 740, "Delayed", "Critical",
     "Vizag Zinc Visakhapatnam (AP)", "GRSE Kolkata (WB)", "East",
     "ZA-43 high-strength zinc alloy for GRSE ASW corvette deck fitting and mast bracket casting &#8594; 43% Al &#8594; &#8377;740Cr for 900 tonnes &#8597; India &#8377;5,200Cr ZA naval &#8594; GRSE 7 vessels &#8594; 110 HB &#8594; &#8594; Casting &#8594; &#8594; ZA43 &#8594; &#8594; Naval"),
    ("ZNA-0013", "ZNA-B2413", "Bhopal", "BHEL Zinc Div", "Zn-Dust Rotor", "BHEL Wind Turbine Generator", 99.5, 35, 520, "In Transit", "High",
     "BHEL Bhopal (MP)", "BHEL Hyderabad (TG)", "Central",
     "Zinc dust for BHEL wind turbine generator rotor field coil zinc oxide varistor surge protection &#8594; 99.5% Zn &#8594; &#8377;520Cr for 1,000 tonnes &#8594; India &#8377;3,200Cr Zn varistor &#8594; BHEL 2K turbines &#8594; 35 HB &#8594; &#8594; Dust &#8594; &#8594; ZnD &#8594; &#8594; Power"),
    ("ZNA-0014", "ZNA-B2414", "Rourkela", "SAIL Zinc", "Zn-95% Thermal", "Hindalco Aluminium Smelter", 95.8, 42, 360, "Delivered", "Medium",
     "SAIL Rourkela (OD)", "Hindalco Hirakud (OD)", "East",
     "95% zinc for Hindalco aluminium smelter cell anode zinc-aluminium sacrificial cathode lining &#8594; 95% Zn &#8594; &#8377;360Cr for 12,000 tonnes &#8594; India &#8377;1,400Cr Zn smelter &#8594; Hindalco 400 pots &#8594; 42 HB &#8594; &#8594; Ingot &#8594; &#8594; ZA95 &#8594; &#8594; Metals"),
]

for i, r in enumerate(records):
    assert len(r) == 15, "Record " + r[0] + " has " + str(len(r)) + " elements, expected 15"

L = []
L.append('"use client";')
L.append('')
L.append("import React, { useState, useMemo } from 'react';")
L.append("import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';")
L.append("import { Badge } from '@/components/ui/badge';")
L.append("import { PageHeader } from '@/components/shared';")
L.append("import { " + ICON + " } from 'lucide-react';")
L.append('')
L.append('interface ' + INTERFACE + ' {')
L.append("  id: string; batchNo: string; city: string; manufacturer: string; " + GRADEFIELD + ": string;")
L.append("  application: string; purityPercent: number; " + UNITPROP + ": number; investmentCr: number;")
L.append("  status: string; priority: string; origin: string; destination: string;")
L.append("  shipDate: string; transitDays: number; zone: string; remarks: string;")
L.append('};')
L.append('')
L.append('const ' + VARNAME + ': ' + INTERFACE + '[] = [')
for i, r in enumerate(records):
    sd = "2026-07-" + str(15 + i)
    td = str((i % 5) + 1)
    L.append("  { id: '" + r[0] + "', batchNo: '" + r[1] + "', city: '" + r[2] + "', manufacturer: '" + r[3] + "', " + GRADEFIELD + ": '" + r[4] + "', application: '" + r[5] + "', purityPercent: " + str(r[6]) + ", " + UNITPROP + ": " + str(r[7]) + ", investmentCr: " + str(r[8]) + ", status: '" + r[9] + "', priority: '" + r[10] + "', origin: '" + r[11] + "', destination: '" + r[12] + "', shipDate: '" + sd + "', transitDays: " + td + ", zone: '" + r[13] + "', remarks: '" + r[14] + "' },")
L.append('];')
L.append('')
L.append('export default function ' + FUNCNAME + '() {')
L.append("  const [activeTab, setActiveTab] = useState<string>('dashboard');")
L.append("  const [searchTerm, setSearchTerm] = useState<string>('');")
L.append("  const [filterZone, setFilterZone] = useState<string>('all');")
L.append("  const [filterStatus, setFilterStatus] = useState<string>('all');")
L.append('')
L.append('  const tabs = [')
L.append("    { id: 'dashboard', label: 'Dashboard', icon: " + ICON + " },")
L.append("    { id: 'registry', label: 'Registry', icon: " + ICON + " },")
L.append("    { id: 'analytics', label: 'Analytics', icon: " + ICON + " },")
L.append("    { id: 'insights', label: 'Insights', icon: " + ICON + " },")
L.append('  ];')
L.append('')
L.append('  const filteredRecords = useMemo(() => {')
L.append('    return ' + VARNAME + '.filter((r) => {')
L.append("      const matchSearch = searchTerm === '' ||")
L.append("        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||")
L.append("        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||")
L.append("        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||")
L.append("        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||")
L.append("        r." + GRADEFIELD + ".toLowerCase().includes(searchTerm.toLowerCase()) ||")
L.append("        r.application.toLowerCase().includes(searchTerm.toLowerCase());")
L.append("      const matchZone = filterZone === 'all' || r.zone === filterZone;")
L.append("      const matchStatus = filterStatus === 'all' || r.status === filterStatus;")
L.append('      return matchSearch && matchZone && matchStatus;')
L.append('    });')
L.append('  }, [searchTerm, filterZone, filterStatus]);')
L.append('')
L.append('  const zones = useMemo(() => {')
L.append('    const zMap: Record<string, number> = {};')
L.append('    ' + VARNAME + '.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });')
L.append('    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);')
L.append('  }, []);')
L.append('')
L.append('  const kpiData = useMemo(() => {')
L.append('    const total = ' + VARNAME + '.reduce((s: number, r) => s + r.investmentCr, 0);')
L.append('    const avgPurity = ' + VARNAME + '.reduce((s: number, r) => s + r.purityPercent, 0) / ' + VARNAME + '.length;')
L.append("    const delayed = " + VARNAME + ".filter((r) => r.status === 'Delayed').length;")
L.append("    const critical = " + VARNAME + ".filter((r) => r.priority === 'Critical').length;")
L.append("    return { total, avgPurity: avgPurity.toFixed(2), delayed, critical };")
L.append('  }, []);')
L.append('')
L.append('  const statusColor = (status: string) => {')
L.append('    switch (status) {')
L.append("      case 'Delivered': return 'bg-green-500/20 text-green-700 border-green-500/30';")
L.append("      case 'In Transit': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';")
L.append("      case 'Delayed': return 'bg-red-500/20 text-red-700 border-red-500/30';")
L.append("      case 'Processing': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';")
L.append("      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';")
L.append('    }')
L.append('  };')
L.append('')
L.append('  const priorityColor = (priority: string) => {')
L.append('    switch (priority) {')
L.append("      case 'Critical': return 'bg-red-500/20 text-red-700 border-red-500/30';")
L.append("      case 'High': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';")
L.append("      case 'Medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';")
L.append("      case 'Low': return 'bg-green-500/20 text-green-700 border-green-500/30';")
L.append("      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';")
L.append('    }')
L.append('  };')
L.append('')
L.append("  const themeColor = '" + HEX + "';")
L.append('  return (')
L.append('    <div className="space-y-6 p-6">')
L.append('      <PageHeader title="' + TITLE + '" description="' + DESC + '" />')
# KPI cards - green theme
L.append('      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">')
L.append('        <Card className="border-l-4 border-l-green-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>')
L.append('        <Card className="border-l-4 border-l-green-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>')
L.append('        <Card className="border-l-4 border-l-green-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>')
L.append('        <Card className="border-l-4 border-l-green-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>')
L.append('      </div>')
# Tabs
L.append('      <div className="flex flex-wrap gap-2 border-b pb-2">')
L.append('        {tabs.map((tab) => (')
L.append("          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-green-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>")
L.append('            {tab.label}')
L.append('          </button>')
L.append('        ))}')
L.append('      </div>')
# Dashboard
L.append("      {activeTab === 'dashboard' && (")
L.append('        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">')
L.append('          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>')
L.append('            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / ' + VARNAME + '.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>')
L.append('          </CardContent></Card>')
L.append('          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>')
L.append('            <div className="grid grid-cols-2 gap-3">')
L.append("              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = " + VARNAME + ".filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className=\"text-lg font-bold\">{c}</div><div className=\"text-xs\">{s}</div></div>; })}")
L.append('            </div>')
L.append('          </CardContent></Card>')
L.append('          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>')
L.append('            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">')
L.append('              {' + VARNAME + '.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.' + GRADEFIELD + '}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}')
L.append('            </div>')
L.append('          </CardContent></Card>')
L.append('        </div>')
L.append('      )}')
# Registry
L.append("      {activeTab === 'registry' && (")
L.append('        <div className="space-y-4">')
L.append('          <div className="flex flex-wrap gap-3">')
L.append('            <input type="text" placeholder="Search ID, batch, city, grade..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-3 py-2 border rounded-md text-sm flex-1 min-w-[200px]" />')
L.append('            <select value={filterZone} onChange={(e) => setFilterZone(e.target.value)} className="px-3 py-2 border rounded-md text-sm"><option value="all">All Zones</option>{zones.map(([z]) => <option key={z} value={z}>{z as string}</option>)}</select>')
L.append("            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className=\"px-3 py-2 border rounded-md text-sm\"><option value=\"all\">All Status</option>{['Delivered','In Transit','Delayed','Processing'].map((s) => <option key={s} value={s}>{s}</option>)}</select>")
L.append('          </div>')
L.append('          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">')
L.append('            {filteredRecords.map((record) => (')
L.append("              <Card key={record.id} className={record.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}>")
L.append('                <CardContent className="pt-4 pb-4">')
L.append('                  <div className="flex justify-between items-start mb-2">')
L.append('                    <div><span className="font-semibold text-sm">{record.id}</span><span className="text-xs text-muted-foreground ml-2">{record.batchNo}</span></div>')
L.append('                    <div className="flex gap-1"><Badge variant="outline" className={statusColor(record.status)}>{record.status}</Badge><Badge variant="outline" className={priorityColor(record.priority)}>{record.priority}</Badge></div>')
L.append('                  </div>')
L.append('                  <div className="text-xs space-y-1">')
L.append('                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.' + GRADEFIELD + '}</span></div>')
L.append('                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>')
L.append('                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>')
L.append('                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>')
L.append('                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>')
L.append('                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>')
L.append('                  </div>')
L.append('                </CardContent>')
L.append('              </Card>')
L.append('            ))}')
L.append('          </div>')
L.append('          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {' + VARNAME + '.length} records</div>')
L.append('        </div>')
L.append('      )}')
# Analytics
L.append("      {activeTab === 'analytics' && (")
L.append('        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">')
L.append('          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>')
L.append('            <div className="space-y-2">')
L.append('              {(() => { const mfrMap: Record<string, number> = {}; ' + VARNAME + '.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}')
L.append('            </div>')
L.append('          </CardContent></Card>')
L.append('          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>')
L.append('            <div className="grid grid-cols-2 gap-3">')
L.append("              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = " + VARNAME + ".filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className=\"text-lg font-bold\">{c}</div><div className=\"text-xs\">{p}</div></div>; })}")
L.append('            </div>')
L.append('          </CardContent></Card>')
L.append('          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>')
L.append('            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; ' + VARNAME + '.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>')
L.append('          </CardContent></Card>')
L.append('          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>')
L.append('            <div className="space-y-2">')
L.append("              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; " + VARNAME + ".forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / " + VARNAME + ".length) * 100; return <div key={range} className=\"flex items-center gap-2\"><span className=\"text-xs w-24\">{range}</span><div className=\"flex-1 h-2 bg-muted rounded-full\"><div className=\"h-2 rounded-full\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\"text-xs font-medium\">{count}</span></div>; }); })()}")
L.append('            </div>')
L.append('          </CardContent></Card>')
L.append('        </div>')
L.append('      )}')
# Insights
L.append("      {activeTab === 'insights' && (")
L.append('        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">')
L.append('          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Automotive Die-Casting Boom</div><div className="text-xs text-muted-foreground mt-1">Tata Nexon + Mahindra XUV700 + Bajaj wheel driving &#8594; &#8377;1,480Cr combined &#8594; India EV transition accelerates ZA demand</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Naval Defence Programme</div><div className="text-xs text-muted-foreground mt-1">BEL submarine sonar + GRSE corvette deck fitting &#8594; &#8377;1,600Cr combined &#8594; Aatmanirbhar naval build</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Galvanizing &amp; Steel</div><div className="text-xs text-muted-foreground mt-1">JSW CGL + Tata galvanizing bath &#8594; &#8377;1,040Cr combined &#8594; infra build drives GI demand</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">ZNA-B2412 GRSE corvette deck fitting delayed &#8594; monsoon Visakhapatnam port congestion &#8594; ASW corvette delivery at risk</div></div>')
L.append('          </div></CardContent></Card>')
L.append('          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 zinc alloy grades spanning auto, naval, steel, pharma, battery, power and oil &amp; gas &#8594; avg purity {kpiData.avgPurity}%</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Critical Priority: 4 Records</div><div className="text-xs text-muted-foreground mt-1">Tata Motors die-cast &#8594; BEL submarine &#8594; Bharat Forge plating &#8594; GRSE corvette &#8594; high-value chain</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">Hindustan Zinc dominates &#8594; Sterlite Zinc &#8594; BHEL Zinc &#8594; SAIL Zinc &#8594; regional smelters emerging</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50/50"><div className="font-medium">Hindustan Zinc Monopoly</div><div className="text-xs text-muted-foreground mt-1">Vedanta Hindustan Zinc controls 95% Indian primary zinc production &#8594; Udaipur + Chittorgarh mines &#8594; strategic supply chain risk</div></div>')
L.append('          </div></CardContent></Card>')
L.append('        </div>')
L.append('      )}')
L.append('    </div>')
L.append('  );')
L.append('}')
L.append('')

with open('/home/z/my-project/src/components/modules/zinc-alloy-logistics-view.tsx', 'w') as f:
    f.write('\n'.join(L))
print("Generated zinc-alloy-logistics-view.tsx — " + str(len(L)) + " lines")
