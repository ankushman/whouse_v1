#!/usr/bin/env python3
"""Generate phosphor-bronze-logistics-view.tsx — R419a
Tuple: (id, batchNo, city, mfr, grade, app, purity, tensileMpa, investCr, status, priority, origin, dest, zone, remarks)
"""

ICON = "Zap"
HEX = "#d97706"
CSSCLASS = "amber"
INTERFACE = "PhosphorBronzeRecord"
FUNCNAME = "PhosphorBronzeLogisticsView"
VARNAME = "phosphorBronzeRecords"
TITLE = "Phosphor Bronze Logistics"
DESC = "Indian phosphor bronze (Cu-Sn-P) spring, bearing, connector, marine and defense supply chain tracking across 14 grades"
GRADEFIELD = "pbGrade"
UNITPROP = "tensileStrengthMpa"

records = [
    ("PBR-0001", "PBR-B2401", "Mumbai", "MIDHANI", "PB-5 Sn5 P0.3", "HAL Tejas Mk2 Landing Gear Spring", 99.2, 680, 680, "Delivered", "Critical",
     "MIDHANI Hyderabad (TG)", "HAL Bengaluru (KA)", "South",
     "C5191 phosphor bronze strip for HAL Tejas Mk2 main landing gear oleo-pneumatic suspension spring &#8594; 5% Sn &#8594; &#8377;680Cr for 120 tonnes &#8594; India &#8377;4,200Cr PB spring &#8594; HAL 40 aircraft &#8594; 680 MPa &#8594; &#8594; Strip &#8594; &#8594; C5191 &#8594; &#8594; Aerospace"),
    ("PBR-0002", "PBR-B2402", "Bengaluru", "DRDO DMRL", "PB-8 Sn8 P0.1", "BEL Phased Array Radar Connector", 99.5, 580, 740, "In Transit", "Critical",
     "DRDO Hyderabad (TG)", "BEL Bengaluru (KA)", "South",
     "High-conductivity PB-8 phosphor bronze for BEL AESA radar RF coaxial connector shell &#8594; 8% Sn &#8594; &#8377;740Cr for 85 tonnes &#8594; India &#8377;5,600Cr PB RF &#8594; BEL 12 radars &#8594; 580 MPa &#8594; &#8594; Wire &#8594; &#8594; C5210 &#8594; &#8594; Defense"),
    ("PBR-0003", "PBR-B2403", "Chennai", "Sterlite Copper", "PB-C5441 Spring", "L&T Metro Bogie Bearing", 98.8, 520, 560, "Delivered", "High",
     "Sterlite Tuticorin (TN)", "L&T Hyderabad (TG)", "South",
     "C5441 phosphor bronze bearing bush for L&T Hyderabad metro bogie primary suspension &#8594; 4.5% Sn &#8594; &#8377;560Cr for 200 tonnes &#8594; India &#8377;3,200Cr PB bearing &#8594; L&T 72 bogies &#8594; 520 MPa &#8594; &#8594; Sleeve &#8594; &#8594; C5441 &#8594; &#8594; Rail"),
    ("PBR-0004", "PBR-B2404", "Hyderabad", "Hindustan Copper", "PB-10 Sn10 P0.5", "SAIL Continuous Caster Bearing", 98.5, 600, 480, "Delivered", "High",
     "HCL Khetri (RJ)", "SAIL Bhilai (CG)", "West",
     "PB-10 phosphor bronze sleeve bearing for SAIL Bhilai continuous casting machine mold oscillation &#8594; 10% Sn &#8594; &#8377;480Cr for 180 tonnes &#8594; India &#8377;3,800Cr PB sleeve &#8594; SAIL 6 casters &#8594; 600 MPa &#8594; &#8594; Bush &#8594; &#8594; C5240 &#8594; &#8594; Steel"),
    ("PBR-0005", "PBR-B2405", "Kolkata", "Bharat Cable", "PB-5 Low P", "Tata Power Transformer Tap Changer", 99.1, 450, 420, "In Transit", "Medium",
     "Bharat Cable Kolkata (WB)", "Tata Power Mumbai (MH)", "East",
     "Low-phosphorus PB-5 for Tata Power 765kV OLTC transition contact assembly &#8594; 5% Sn &#8594; &#8377;420Cr for 95 tonnes &#8594; India &#8377;2,800Cr PB contact &#8594; Tata 40 transformers &#8594; 450 MPa &#8594; &#8594; Contact &#8594; &#8594; C5100 &#8594; &#8594; Power"),
    ("PBR-0006", "PBR-B2406", "Coimbatore", "VGP Marine", "PB-Navy ABRC3", "GRSE Frigate Propeller Shaft Bearing", 98.2, 640, 620, "Delivered", "Critical",
     "VGP Marine Chennai (TN)", "GRSE Kolkata (WB)", "South",
     "Naval-grade ABRC3 phosphor bronze for GRSE Nilgiri-class frigate propeller shaft tail shaft bearing &#8594; Navy spec &#8594; &#8377;620Cr for 150 tonnes &#8594; India &#8377;4,600Cr PB naval &#8594; GRSE 7 frigates &#8594; 640 MPa &#8594; &#8594; Bush &#8594; &#8594; ABRC3 &#8594; &#8594; Naval"),
    ("PBR-0007", "PBR-B2407", "Pune", "Bharat Forge", "PB-Auto C89836", "Bajaj Auto Engine Valve Guide", 98.6, 380, 340, "Delivered", "Medium",
     "Bharat Forge Pune (MH)", "Bajaj Auto Pune (MH)", "West",
     "Automotive PB valve guide bronze for Bajaj Pulsar 400cc engine intake and exhaust valve guide &#8594; 3% Sn &#8594; &#8377;340Cr for 60 tonnes &#8594; India &#8377;1,800Cr PB guide &#8594; Bajaj 5M engines &#8594; 380 MPa &#8594; &#8594; Guide &#8594; &#8594; C89836 &#8594; &#8594; Auto"),
    ("PBR-0008", "PBR-B2408", "Jaipur", "Rajasthan Copper", "PB-Textile C5100", "Welspun Textile Loom Heddle", 97.8, 420, 280, "Delivered", "Low",
     "Rajasthan Copper Jodhpur (RJ)", "Welspun Vapi (GJ)", "West",
     "PB-5 textile-grade phosphor bronze wire for Welspun loom heddle spring and eyelet &#8594; 5% Sn &#8594; &#8377;280Cr for 40 tonnes &#8594; India &#8377;1,200Cr PB textile &#8594; Welspun 2K looms &#8594; 420 MPa &#8594; &#8594; Wire &#8594; &#8594; C5100 &#8594; &#8594; Textile"),
    ("PBR-0009", "PBR-B2409", "Guwahati", "Assam Copper", "PB-Telecom C5210", "Jio Fiber Optic Connector Shell", 99.0, 560, 520, "In Transit", "High",
     "Assam Copper Silchar (AS)", "Jio Mumbai (MH)", "East",
     "C5210 phosphor bronze shell for Reliance Jio FTTH LC fiber optic connector &#8594; 8% Sn &#8594; &#8377;520Cr for 110 tonnes &#8594; India &#8377;3,600Cr PB telecom &#8594; Jio 50M connectors &#8594; 560 MPa &#8594; &#8594; Shell &#8594; &#8594; C5210 &#8594; &#8594; Telecom"),
    ("PBR-0010", "PBR-B2410", "Ahmedabad", "Gujarat Metal", "PB-Aerospace C5210", "ISRO Satellite Solar Panel Hinge", 99.6, 680, 860, "Delivered", "Critical",
     "Gujarat Metal Ahmedabad (GJ)", "ISRO Bengaluru (KA)", "West",
     "Ultra-high reliability PB-8 for ISRO GSAT series solar array deployment hinge pin and torsion spring &#8594; 8% Sn &#8594; &#8377;860Cr for 35 tonnes &#8594; India &#8377;6,800Cr PB space &#8594; ISRO 18 satellites &#8594; 680 MPa &#8594; &#8594; Pin &#8594; &#8594; C5210 &#8594; &#8594; Space"),
    ("PBR-0011", "PBR-B2411", "Lucknow", "UP Copper Corp", "PB-Medical C5191", "Trivitron MRI Gradient Coil", 99.3, 500, 480, "Delivered", "Medium",
     "UP Copper Lucknow (UP)", "Trivitron Chennai (TN)", "North",
     "Medical-grade phosphor bronze for Trivitron 3T MRI gradient coil formers and RF shielding &#8594; 6% Sn &#8594; &#8377;480Cr for 25 tonnes &#8594; India &#8377;2,400Cr PB medical &#8594; Trivitron 200 scanners &#8594; 500 MPa &#8594; &#8594; Foil &#8594; &#8594; C5191 &#8594; &#8594; Medical"),
    ("PBR-0012", "PBR-B2412", "Visakhapatnam", "Vizag Copper Works", "PB-Submarine C5210", "GRSE Submarine Sonar Dome", 99.4, 640, 940, "Delayed", "Critical",
     "Vizag Copper Visakhapatnam (AP)", "GRSE Kolkata (WB)", "East",
     "Submarine-grade phosphor bronze for GRSE Project 75I submarine sonar dome acoustic window frame &#8594; 8% Sn &#8594; &#8377;940Cr for 90 tonnes &#8597; India &#8377;7,200Cr PB submarine &#8594; GRSE 6 submarines &#8594; 640 MPa &#8594; &#8594; Plate &#8594; &#8594; C5210 &#8594; &#8594; Naval"),
    ("PBR-0013", "PBR-B2413", "Bhopal", "BHEL R&D", "PB-Turbine C5240", "BHEL Steam Turbine Blade Root", 99.1, 620, 720, "In Transit", "High",
     "BHEL Bhopal (MP)", "BHEL Hyderabad (TG)", "Central",
     "High-strength PB-10 for BHEL 660MW steam turbine blade root tenon and shroud &#8594; 10% Sn &#8594; &#8377;720Cr for 140 tonnes &#8594; India &#8377;5,200Cr PB turbine &#8594; BHEL 30 turbines &#8594; 620 MPa &#8594; &#8594; Block &#8594; &#8594; C5240 &#8594; &#8594; Power"),
    ("PBR-0014", "PBR-B2414", "Rourkela", "SAIL Copper Div", "PB-Welding C5100", "Adani Gas Pipeline Valve", 98.4, 440, 360, "Delivered", "Medium",
     "SAIL Rourkela (OD)", "Adani Hazira (GJ)", "East",
     "Welding-grade phosphor bronze for Adani natural gas pipeline ball valve seat and seal ring &#8594; 5% Sn &#8594; &#8377;360Cr for 75 tonnes &#8594; India &#8377;2,200Cr PB pipeline &#8594; Adani 4K valves &#8594; 440 MPa &#8594; &#8594; Ring &#8594; &#8594; C5100 &#8594; &#8594; Oil &amp; Gas"),
]

# Validate
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
# KPI
L.append('      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">')
L.append('        <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>')
L.append('        <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>')
L.append('        <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>')
L.append('        <Card className="border-l-4 border-l-amber-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>')
L.append('      </div>')
# Tabs
L.append('      <div className="flex flex-wrap gap-2 border-b pb-2">')
L.append('        {tabs.map((tab) => (')
L.append("          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-amber-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>")
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
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Aerospace &amp; Defense Demand</div><div className="text-xs text-muted-foreground mt-1">HAL Tejas Mk2 landing gear + ISRO satellite hinge + DRDO radar connector driving &#8594; &#8377;2,280Cr combined &#8594; highest priority segment</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Naval Submarine Programme</div><div className="text-xs text-muted-foreground mt-1">GRSE Project 75I sonar dome + Nilgiri-class propeller shaft bearing &#8594; &#8377;1,560Cr combined &#8594; critical naval build</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Steel &amp; Power Infrastructure</div><div className="text-xs text-muted-foreground mt-1">SAIL caster bearing + BHEL turbine root + Tata Power OLTC &#8594; &#8377;1,620Cr combined &#8594; heavy industrial cycle</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">PBR-B2412 GRSE submarine sonar dome delayed &#8594; monsoon Visakhapatnam port congestion &#8594; Project 75I timeline at risk</div></div>')
L.append('          </div></CardContent></Card>')
L.append('          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 phosphor bronze grades spanning aerospace, naval, steel, power, telecom, medical and automotive &#8594; avg purity {kpiData.avgPurity}%</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Critical Priority: 5 Records</div><div className="text-xs text-muted-foreground mt-1">HAL landing gear &#8594; BEL radar &#8594; GRSE frigate &#8594; ISRO satellite &#8594; GRSE submarine &#8594; national security chain</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL lead defense demand &#8594; Sterlite &#8594; Hindustan Copper &#8594; Bharat Cable drive commercial</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50"><div className="font-medium">Regional Concentration</div><div className="text-xs text-muted-foreground mt-1">South zone dominates with Chennai &#8594; Bengaluru &#8594; Coimbatore &#8594; Hyderabad supply &#8594; West zone Pune emerging</div></div>')
L.append('          </div></CardContent></Card>')
L.append('        </div>')
L.append('      )}')
L.append('    </div>')
L.append('  );')
L.append('}')
L.append('')

with open('/home/z/my-project/src/components/modules/phosphor-bronze-logistics-view.tsx', 'w') as f:
    f.write('\n'.join(L))

print("Generated phosphor-bronze-logistics-view.tsx — " + str(len(L)) + " lines")
