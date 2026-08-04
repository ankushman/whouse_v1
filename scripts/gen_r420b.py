#!/usr/bin/env python3
"""Generate tin-alloy-logistics-view.tsx — R420b
Tuple: (id, batchNo, city, mfr, grade, app, purity, meltingPointC, investCr, status, priority, origin, dest, zone, remarks)
"""

ICON = "Wrench"
HEX = "#0891b2"
CSSCLASS = "cyan"
INTERFACE = "TinAlloyRecord"
FUNCNAME = "TinAlloyLogisticsView"
VARNAME = "tinAlloyRecords"
TITLE = "Tin Alloy Logistics"
DESC = "Indian tin alloy (Sn-Sb-Cu) solder, bearing, bronze, electronics and packaging supply chain tracking across 14 grades"
GRADEFIELD = "snGrade"
UNITPROP = "meltingPointC"

records = [
    ("TNA-0001", "TNA-B2401", "Mumbai", "Hindustan Tin", "Sn-99.99 High Purity", "ISRO Satellite Solder BGA", 99.99, 232, 820, "Delivered", "Critical",
     "Hindustan Tin Mumbai (MH)", "ISRO Bengaluru (KA)", "West",
     "99.99% high-purity tin for ISRO GSAT satellite PCB BGA solder ball and SMT reflow &#8594; &#8377;820Cr for 200 tonnes &#8594; India &#8377;5,600Cr Sn solder &#8594; ISRO 18 satellites &#8594; 232&#176;C &#8594; &#8594; Solder ball &#8594; &#8594; Sn99 &#8594; &#8594; Space"),
    ("TNA-0002", "TNA-B2402", "Bengaluru", "DRDO DMRL", "Sn-63Pb37 Eutectic", "BEL Radar RF Module", 99.95, 183, 680, "In Transit", "Critical",
     "DRDO Hyderabad (TG)", "BEL Bengaluru (KA)", "South",
     "Sn63Pb37 eutectic solder for BEL AESA radar RF module wave solder and manual touch-up &#8594; 63% Sn &#8594; &#8377;680Cr for 120 tonnes &#8594; India &#8377;4,200Cr Sn eutectic &#8594; BEL 12 radars &#8594; 183&#176;C &#8594; &#8594; Solder paste &#8594; &#8594; Sn63 &#8594; &#8594; Defense"),
    ("TNA-0003", "TNA-B2403", "Chennai", "Sterlite Tin", "Sn-96.5Ag3Cu0.5 SAC", "Wipro PCB Assembly", 99.9, 217, 520, "Delivered", "High",
     "Sterlite Tin Tuticorin (TN)", "Wipro Bengaluru (KA)", "South",
     "SAC305 lead-free solder for Wipro PCB SMT assembly ROHS-compliant server board &#8594; 96.5% Sn &#8594; &#8377;520Cr for 150 tonnes &#8594; India &#8377;3,200Cr Sn SAC &#8594; Wipro 50K boards &#8594; 217&#176;C &#8594; &#8594; Paste &#8594; &#8594; SAC305 &#8594; &#8594; Electronics"),
    ("TNA-0004", "TNA-B2404", "Hyderabad", "Hyderabad Tin Corp", "Sn-Sb8 Babbitt", "SAIL Heavy Bearing", 99.2, 240, 460, "Delivered", "High",
     "Hyderabad Tin Hyderabad (TG)", "SAIL Bhilai (CG)", "South",
     "Tin-antimony Babbitt alloy for SAIL Bhilai blast furnace main shaft white metal bearing &#8594; 8% Sb &#8594; &#8377;460Cr for 800 tonnes &#8594; India &#8377;2,800Cr Sn Babbitt &#8594; SAIL 6 furnaces &#8594; 240&#176;C &#8594; &#8594; Ingot &#8594; &#8594; B8 &#8594; &#8594; Steel"),
    ("TNA-0005", "TNA-B2405", "Kolkata", "Bharat Tin Works", "Sn-Pb40 Soft Solder", "Tata Steel Tinplate", 99.5, 200, 340, "In Transit", "Medium",
     "Bharat Tin Kolkata (WB)", "Tata Steel Jamshedpur (JH)", "East",
     "Tin-lead soft solder for Tata Steel tinplate continuous tinning line for food can stock &#8594; 40% Pb &#8594; &#8377;340Cr for 300 tonnes &#8594; India &#8377;1,800Cr Sn tinplate &#8594; Tata 4 CTLs &#8594; 200&#176;C &#8594; &#8594; Bar &#8594; &#8594; Sn60 &#8594; &#8594; Steel"),
    ("TNA-0006", "TNA-B2406", "Coimbatore", "TN Tin Works", "Sn-99.95 Pharma", "Dr Reddys Tin Capsule", 99.95, 232, 420, "Delivered", "Medium",
     "TN Tin Works Hosur (TN)", "Dr Reddys Hyderabad (TG)", "South",
     "Pharma-grade tin for Dr Reddys tin capsule shell and tablet blister packaging foil &#8594; USP grade &#8594; &#8377;420Cr for 250 tonnes &#8594; India &#8377;2,400Cr Sn pharma &#8594; Dr Reddys 400M caps &#8594; 232&#176;C &#8594; &#8594; Foil &#8594; &#8594; SnPh &#8594; &#8594; Pharma"),
    ("TNA-0007", "TNA-B2407", "Pune", "Bajaj Tin Div", "Sn-Cu0.7 Low Cost", "Bajaj Auto Fuse", 99.8, 227, 280, "Delivered", "Medium",
     "Bajaj Tin Chakan (MH)", "Bajaj Auto Pune (MH)", "West",
     "Sn-Cu0.7 low-cost lead-free solder for Bajaj Pulsar wiring harness fuse connector &#8594; 0.7% Cu &#8594; &#8377;280Cr for 100 tonnes &#8594; India &#8377;1,400Cr Sn fuse &#8594; Bajaj 5M units &#8594; 227&#176;C &#8594; &#8594; Wire &#8594; &#8594; SnCu &#8594; &#8594; Auto"),
    ("TNA-0008", "TNA-B2408", "Jaipur", "Rajasthan Tin", "Sn-Ag4 Wave Solder", "L&T Switchgear PCB", 99.7, 221, 380, "Delivered", "High",
     "Rajasthan Tin Jaipur (RJ)", "L&T Vadodara (GJ)", "West",
     "Sn-Ag4 lead-free solder alloy for L&T switchgear controller PCB wave soldering &#8594; 96% Sn &#8594; &#8377;380Cr for 80 tonnes &#8594; India &#8377;2,600Cr Sn wave &#8594; L&T 20K panels &#8594; 221&#176;C &#8594; &#8594; Bar &#8594; &#8594; SnAg &#8594; &#8594; Power"),
    ("TNA-0009", "TNA-B2409", "Guwahati", "Assam Tin Mine", "Sn-50Pb50", "Godrej Aerosol Can", 99.3, 190, 260, "In Transit", "Low",
     "Assam Tin Silchar (AS)", "Godrej Mumbai (MH)", "East",
     "Sn-50Pb50 alloy for Godrej aerosol can crimp seal and valve body soldering &#8594; 50% Sn &#8594; &#8377;260Cr for 200 tonnes &#8594; India &#8377;1,200Cr Sn aerosol &#8594; Godrej 100M cans &#8594; 190&#176;C &#8594; &#8594; Bar &#8594; &#8594; Sn50 &#8594; &#8594; Consumer"),
    ("TNA-0010", "TNA-B2410", "Ahmedabad", "Gujarat Tin Corp", "Sn-Bi58 Low Melt", " Dixon LED Thermal", 99.6, 138, 540, "Delivered", "High",
     "Gujarat Tin Ahmedabad (GJ)", "Dixon Noida (UP)", "West",
     "Sn-Bi58 low-melting alloy for Dixon LED TV thermal interface pad and heat sink attach &#8594; 58% Bi &#8594; &#8377;540Cr for 60 tonnes &#8594; India &#8377;3,600Cr Sn low-melt &#8594; Dixon 8M TVs &#8594; 138&#176;C &#8594; &#8594; Foil &#8594; &#8594; SnBi &#8594; &#8594; Electronics"),
    ("TNA-0011", "TNA-B2411", "Lucknow", "UP Tin Industries", "Sn-In52 Low Melt", "BHEL Transformer Foil", 99.8, 118, 480, "Delivered", "Medium",
     "UP Tin Lucknow (UP)", "BHEL Bhopal (MP)", "North",
     "Sn-In52 ultra-low-melting alloy for BHEL power transformer foil winding soldering &#8594; 52% In &#8594; &#8377;480Cr for 40 tonnes &#8594; India &#8377;3,000Cr Sn-In &#8594; BHEL 30 transformers &#8594; 118&#176;C &#8594; &#8594; Foil &#8594; &#8594; SnIn &#8594; &#8594; Power"),
    ("TNA-0012", "TNA-B2412", "Visakhapatnam", "Vizag Tin Works", "Sn-Ni0.5 Corrosion", "GRSE Submarine Hull Anode", 99.4, 232, 860, "Delayed", "Critical",
     "Vizag Tin Visakhapatnam (AP)", "GRSE Kolkata (WB)", "East",
     "Tin-nickel alloy for GRSE Project 75I submarine hull cathodic protection anode soldering &#8594; 0.5% Ni &#8594; &#8377;860Cr for 100 tonnes &#8597; India &#8377;6,400Cr Sn naval &#8594; GRSE 6 submarines &#8594; 232&#176;C &#8594; &#8594; Anode &#8594; &#8594; SnNi &#8594; &#8594; Naval"),
    ("TNA-0013", "TNA-B2413", "Bhopal", "BHEL Tin Div", "Sn-Zn9 LF Solder", "BEL Missile Guidance", 99.7, 199, 620, "In Transit", "High",
     "BHEL Bhopal (MP)", "BEL Bengaluru (KA)", "Central",
     "Sn-Zn9 lead-free solder for BEL DRDO BrahMos missile guidance PCB assembly &#8594; 91% Sn &#8594; &#8377;620Cr for 70 tonnes &#8594; India &#8377;4,200Cr Sn missile &#8594; BEL 40 boards &#8594; 199&#176;C &#8594; &#8594; Paste &#8594; &#8594; SnZn &#8594; &#8594; Defense"),
    ("TNA-0014", "TNA-B2414", "Rourkela", "SAIL Tin", "Sn-Cu5 Bronze", "HAL Aircraft Hydraulic", 99.1, 260, 440, "Delivered", "High",
     "SAIL Rourkela (OD)", "HAL Bengaluru (KA)", "East",
     "Tin-bronze Sn-Cu5 alloy for HAL Tejas Mk2 hydraulic actuator cylinder bushing &#8594; 5% Cu &#8594; &#8377;440Cr for 600 tonnes &#8594; India &#8377;2,800Cr Sn bronze &#8594; HAL 40 actuators &#8594; 260&#176;C &#8594; &#8594; Sleeve &#8594; &#8594; SnCu5 &#8594; &#8594; Aerospace"),
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
# KPI - cyan
L.append('      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">')
L.append('        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>')
L.append('        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>')
L.append('        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>')
L.append('        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>')
L.append('      </div>')
# Tabs
L.append('      <div className="flex flex-wrap gap-2 border-b pb-2">')
L.append('        {tabs.map((tab) => (')
L.append("          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-cyan-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>")
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
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Electronics Solder Transition</div><div className="text-xs text-muted-foreground mt-1">ISRO BGA + BEL radar + Wipro SAC + Dixon LED driving &#8594; &#8377;2,560Cr combined &#8594; ROHS lead-free shift accelerating</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Naval Submarine Programme</div><div className="text-xs text-muted-foreground mt-1">GRSE submarine hull anode + BEL missile guidance &#8594; &#8377;1,480Cr combined &#8594; strategic naval demand</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Low-Melting Alloy Innovation</div><div className="text-xs text-muted-foreground mt-1">Dixon Sn-Bi58 138&#176;C + BHEL Sn-In52 118&#176;C &#8594; &#8377;1,020Cr combined &#8594; thermal management frontier</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">TNA-B2412 GRSE submarine hull anode delayed &#8594; monsoon Visakhapatnam port congestion &#8594; Project 75I at risk</div></div>')
L.append('          </div></CardContent></Card>')
L.append('          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 tin alloy grades spanning space, defense, electronics, steel, pharma, auto, power and aerospace &#8594; avg purity {kpiData.avgPurity}%</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Critical Priority: 4 Records</div><div className="text-xs text-muted-foreground mt-1">ISRO satellite &#8594; BEL radar &#8594; GRSE submarine &#8594; BEL missile &#8594; national security chain</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Melting Point Range</div><div className="text-xs text-muted-foreground mt-1">Grades span 118&#176;C (Sn-In52) to 260&#176;C (Sn-Cu5 bronze) &#8594; covering ultra-low-melt to high-temp applications</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">India Tin Import Dependency</div><div className="text-xs text-muted-foreground mt-1">India imports 70%+ of tin concentrate &#8594; Assam and Rajasthan mines expanding &#8594; Aatmanirbhar tin critical for electronics</div></div>')
L.append('          </div></CardContent></Card>')
L.append('        </div>')
L.append('      )}')
L.append('    </div>')
L.append('  );')
L.append('}')
L.append('')

with open('/home/z/my-project/src/components/modules/tin-alloy-logistics-view.tsx', 'w') as f:
    f.write('\n'.join(L))
print("Generated tin-alloy-logistics-view.tsx — " + str(len(L)) + " lines")
