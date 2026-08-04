#!/usr/bin/env python3
"""Generate nimonic-alloy-logistics-view.tsx — R419b
Tuple: (id, batchNo, city, mfr, grade, app, purity, maxTempC, investCr, status, priority, origin, dest, zone, remarks)
"""

ICON = "Flame"
HEX = "#ea580c"
CSSCLASS = "orange"
INTERFACE = "NimonicAlloyRecord"
FUNCNAME = "NimonicAlloyLogisticsView"
VARNAME = "nimonicAlloyRecords"
TITLE = "Nimonic Alloy Logistics"
DESC = "Indian nimonic nickel-chromium superalloy gas turbine, aerospace, nuclear and industrial high-temperature supply chain tracking across 14 grades"
GRADEFIELD = "nimonicGrade"
UNITPROP = "maxTempC"

records = [
    ("NMA-0001", "NMA-B2401", "Bengaluru", "MIDHANI", "Nimonic 80A", "HAL Tejas Mk2 Turbine Blade", 99.4, 815, 920, "Delivered", "Critical",
     "MIDHANI Hyderabad (TG)", "HAL Bengaluru (KA)", "South",
     "Nimonic 80A wrought superalloy for HAL Tejas Mk2 GE F414 turbofan HP turbine blade forging &#8594; 20Cr-2Ti-Al &#8594; &#8377;920Cr for 60 tonnes &#8594; India &#8377;6,400Cr nimonic &#8594; HAL 120 engines &#8594; 815&#176;C &#8594; &#8594; Blade &#8594; &#8594; N080A &#8594; &#8594; Aerospace"),
    ("NMA-0002", "NMA-B2402", "Hyderabad", "DRDO DMRL", "Nimonic 90", "ISRO GSLV Mk3 Turbo Pump", 99.6, 920, 860, "In Transit", "Critical",
     "DRDO Hyderabad (TG)", "ISRO Sriharikota (AP)", "South",
     "Nimonic 90 superalloy for ISRO GSLV Mk3 CE-20 cryogenic turbopump impeller and casing &#8594; 20Cr-18Co-Ti &#8594; &#8377;860Cr for 45 tonnes &#8594; India &#8377;7,200Cr nimonic &#8594; ISRO 8 engines &#8594; 920&#176;C &#8594; &#8594; Impeller &#8594; &#8594; N090 &#8594; &#8594; Space"),
    ("NMA-0003", "NMA-B2403", "Mumbai", "Bharat Forge", "Nimonic 105", "BHEL 800MW Gas Turbine Blade", 99.2, 950, 980, "Delivered", "Critical",
     "Bharat Forge Pune (MH)", "BHEL Hyderabad (TG)", "West",
     "Nimonic 105 cast superalloy for BHEL 800MW advanced class gas turbine HP stage blade &#8594; 15Co-5Mo-Ti-Al &#8594; &#8377;980Cr for 80 tonnes &#8594; India &#8377;8,600Cr nimonic &#8594; BHEL 20 turbines &#8594; 950&#176;C &#8594; &#8594; Blade &#8594; &#8594; N105 &#8594; &#8594; Power"),
    ("NMA-0004", "NMA-B2404", "Chennai", "Sterlite Technologies", "Nimonic 263", "BHAVINI PFBR Steam Generator", 99.3, 870, 940, "Delivered", "Critical",
     "MIDHANI Hyderabad (TG)", "BHAVINI Kalpakkam (TN)", "South",
     "Nimonic 263 superalloy tube for BHAVINI PFBR sodium-heated steam generator superheater &#8594; 20Cr-20Ni-6Mo &#8594; &#8377;940Cr for 70 tonnes &#8594; India &#8377;7,800Cr nimonic &#8594; BHAVINI 2 reactors &#8594; 870&#176;C &#8594; &#8594; Tube &#8594; &#8594; N263 &#8594; &#8594; Nuclear"),
    ("NMA-0005", "NMA-B2405", "Pune", "Tata Advanced Materials", "Nimonic 75", "JSW Steel Hot Strip Mill Roll", 99.1, 750, 560, "In Transit", "High",
     "Tata Advanced Pune (MH)", "JSW Steel Vijaynagar (KA)", "West",
     "Nimonic 75 superalloy for JSW Steel hot strip mill work roll shell and backup roll &#8594; 20Cr-0.4Ti &#8594; &#8377;560Cr for 120 tonnes &#8594; India &#8377;3,200Cr nimonic &#8594; JSW 4 mills &#8594; 750&#176;C &#8594; &#8594; Roll &#8594; &#8594; N075 &#8594; &#8594; Steel"),
    ("NMA-0006", "NMA-B2406", "Kolkata", "Hindustan Steel", "Nimonic PE16", "DRDO Hypersonic Missile Nose Cone", 99.5, 880, 820, "Delivered", "Critical",
     "DRDO Hyderabad (TG)", "DRDO Balasore (OD)", "East",
     "Nimonic PE16 superalloy for DRDO HSTDV hypersonic scramjet engine combustion chamber liner &#8594; 16Cr-3Mo-Ni &#8594; &#8377;820Cr for 35 tonnes &#8594; India &#8377;6,200Cr nimonic &#8594; DRDO 6 missiles &#8594; 880&#176;C &#8594; &#8594; Liner &#8594; &#8594; PE16 &#8594; &#8594; Defense"),
    ("NMA-0007", "NMA-B2407", "Jaipur", "Rajasthan Alloys", "Nimonic 115", "L&T Naval Gas Turbine Disc", 99.3, 980, 740, "Delivered", "High",
     "MIDHANI Hyderabad (TG)", "L&T Vadodara (GJ)", "West",
     "Nimonic 115 superalloy for L&T LM2500 naval gas turbine HP compressor disc &#8594; 15Cr-15Co-5Mo &#8594; &#8377;740Cr for 55 tonnes &#8594; India &#8377;5,400Cr nimonic &#8594; L&T 8 ships &#8594; 980&#176;C &#8594; &#8594; Disc &#8594; &#8594; N115 &#8594; &#8594; Naval"),
    ("NMA-0008", "NMA-B2408", "Guwahati", "Assam Alloys", "Nimonic 80", "SAIL Blast Furnace Hot Blast Valve", 98.8, 720, 380, "Delivered", "Medium",
     "Assam Alloys Guwahati (AS)", "SAIL Bhilai (CG)", "East",
     "Nimonic 80 superalloy for SAIL blast furnace hot blast stove valve seat and disc &#8594; 20Cr-1Ti &#8594; &#8377;380Cr for 180 tonnes &#8594; India &#8377;2,200Cr nimonic &#8594; SAIL 6 furnaces &#8594; 720&#176;C &#8594; &#8594; Valve &#8594; &#8594; N080 &#8594; &#8594; Steel"),
    ("NMA-0009", "NMA-B2409", "Coimbatore", "TN Alloys", "Nimonic C-263", "Wipro Aerospace Thrust Reverser", 99.1, 850, 480, "In Transit", "High",
     "TN Alloys Coimbatore (TN)", "Wipro Bengaluru (KA)", "South",
     "Nimonic C-263 superalloy for Wipro aerospace Boeing 737 thrust reverser cascade vane &#8594; 20Cr-6Mo &#8594; &#8377;480Cr for 40 tonnes &#8594; India &#8377;3,000Cr nimonic &#8594; Wipro 200 assemblies &#8594; 850&#176;C &#8594; &#8594; Vane &#8594; &#8594; C263 &#8594; &#8594; Aerospace"),
    ("NMA-0010", "NMA-B2410", "Ahmedabad", "Gujarat Superalloys", "Nimonic 81", "Tata Steel Reheating Furnace", 98.6, 700, 340, "Delivered", "Medium",
     "Gujarat Superalloys Ahmedabad (GJ)", "Tata Steel Jamshedpur (JH)", "West",
     "Nimonic 81 superalloy for Tata Steel slab reheating furnace radiant tube and burner nozzle &#8594; 30Cr-0.4Ti &#8594; &#8377;340Cr for 200 tonnes &#8594; India &#8377;1,800Cr nimonic &#8594; Tata 10 furnaces &#8594; 700&#176;C &#8594; &#8594; Tube &#8594; &#8594; N081 &#8594; &#8594; Steel"),
    ("NMA-0011", "NMA-B2411", "Lucknow", "UP Superalloys", "Nimonic PK33", "IGCAR Fast Reactor Fuel Clad", 99.7, 900, 860, "Delivered", "Critical",
     "MIDHANI Hyderabad (TG)", "IGCAR Kalpakkam (TN)", "North",
     "Nimonic PK33 superalloy for IGCAR fast breeder test reactor advanced fuel cladding &#8594; 18Cr-3Mo-Ti &#8594; &#8377;860Cr for 30 tonnes &#8594; India &#8377;6,800Cr nimonic &#8594; IGCAR 3 reactors &#8594; 900&#176;C &#8594; &#8594; Clad &#8594; &#8594; PK33 &#8594; &#8594; Nuclear"),
    ("NMA-0012", "NMA-B2412", "Visakhapatnam", "Vizag Superalloys", "Nimonic 718", "GRSE Submarine Reactor Shield", 99.5, 860, 940, "Delayed", "Critical",
     "Vizag Superalloys Visakhapatnam (AP)", "GRSE Kolkata (WB)", "East",
     "Nimonic 718 superalloy for GRSE Project 75I nuclear submarine reactor pressure vessel shield bracket &#8594; 19Cr-5Nb-3Mo &#8594; &#8377;940Cr for 50 tonnes &#8597; India &#8377;7,400Cr nimonic &#8594; GRSE 6 submarines &#8594; 860&#176;C &#8594; &#8594; Bracket &#8594; &#8594; N718 &#8594; &#8594; Naval"),
    ("NMA-0013", "NMA-B2413", "Bhopal", "BHEL Superalloy Div", "Nimonic 901", "BHEL Steam Turbine Bolt", 99.0, 800, 520, "In Transit", "High",
     "BHEL Bhopal (MP)", "BHEL Haridwar (UK)", "Central",
     "Nimonic 901 superalloy for BHEL 660MW supercritical steam turbine HP-LP coupling bolt &#8594; 13Cr-6Mo-Ti &#8594; &#8377;520Cr for 90 tonnes &#8594; India &#8377;3,600Cr nimonic &#8594; BHEL 30 turbines &#8594; 800&#176;C &#8594; &#8594; Bolt &#8594; &#8594; N901 &#8594; &#8594; Power"),
    ("NMA-0014", "NMA-B2414", "Rourkela", "SAIL Superalloy", "Nimonic AP1", "Reliance Refinery Cracking Tube", 98.9, 1050, 620, "Delivered", "High",
     "SAIL Rourkela (OD)", "Reliance Jamnagar (GJ)", "East",
     "Nimonic AP1 superalloy for Reliance Jamnagar FCC unit catalytic cracking tube and return bend &#8594; 50Cr-50Ni &#8594; &#8377;620Cr for 100 tonnes &#8594; India &#8377;4,200Cr nimonic &#8594; Reliance 4 FCC units &#8594; 1050&#176;C &#8594; &#8594; Tube &#8594; &#8594; AP1 &#8594; &#8594; Oil &amp; Gas"),
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
L.append('      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">')
L.append('        <Card className="border-l-4 border-l-orange-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>')
L.append('        <Card className="border-l-4 border-l-orange-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>')
L.append('        <Card className="border-l-4 border-l-orange-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>')
L.append('        <Card className="border-l-4 border-l-orange-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>')
L.append('      </div>')
L.append('      <div className="flex flex-wrap gap-2 border-b pb-2">')
L.append('        {tabs.map((tab) => (')
L.append("          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-orange-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>")
L.append('            {tab.label}')
L.append('          </button>')
L.append('        ))}')
L.append('      </div>')
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
L.append("      {activeTab === 'insights' && (")
L.append('        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">')
L.append('          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Gas Turbine Superalloy Chain</div><div className="text-xs text-muted-foreground mt-1">BHEL 800MW blade &#8594; HAL Tejas Mk2 F414 &#8594; L&T naval LM2500 &#8594; &#8377;2,640Cr combined &#8594; highest value segment</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Nuclear Fast Reactor Programme</div><div className="text-xs text-muted-foreground mt-1">BHAVINI PFBR steam generator &#8594; IGCAR fuel cladding &#8594; GRSE submarine shield &#8594; &#8377;2,740Cr combined &#8594; critical strategic</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Space &amp; Hypersonic</div><div className="text-xs text-muted-foreground mt-1">ISRO GSLV turbopump &#8594; DRDO HSTDV scramjet liner &#8594; &#8377;1,680Cr combined &#8594; cutting-edge programmes</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">NMA-B2412 GRSE submarine reactor shield delayed &#8594; monsoon Visakhapatnam port congestion &#8594; Project 75I schedule risk</div></div>')
L.append('          </div></CardContent></Card>')
L.append('          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 nimonic grades spanning aerospace, nuclear, power, steel, defense, oil and gas &#8594; avg purity {kpiData.avgPurity}%</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">HAL turbine &#8594; ISRO turbopump &#8594; BHEL gas turbine &#8594; BHAVINI SG &#8594; DRDO missile &#8594; IGCAR clad &#8594; GRSE submarine</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL dominate &#8594; Bharat Forge &#8594; Tata Advanced &#8594; Sterlite emerging</div></div>')
L.append('            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Temperature Range</div><div className="text-xs text-muted-foreground mt-1">Grades span 700&#176;C (Nimonic 81) to 1050&#176;C (Nimonic AP1) &#8594; covering every Indian high-temp application</div></div>')
L.append('          </div></CardContent></Card>')
L.append('        </div>')
L.append('      )}')
L.append('    </div>')
L.append('  );')
L.append('}')
L.append('')

with open('/home/z/my-project/src/components/modules/nimonic-alloy-logistics-view.tsx', 'w') as f:
    f.write('\n'.join(L))

print("Generated nimonic-alloy-logistics-view.tsx — " + str(len(L)) + " lines")
