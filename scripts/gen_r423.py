#!/usr/bin/env python3
"""Generate BOTH R423a carbon-fibre and R423b lithium-hydroxide in one script."""

import re

def gen_module(outfile, icon, hex_color, cssclass, iface, funcname, varname, title, desc, gradefield, unitprop, unitprop_label, records, insights, landscape):
    lines = []
    lines.append('"use client";')
    lines.append('')
    lines.append("import React, { useState, useMemo } from 'react';")
    lines.append("import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';")
    lines.append("import { Badge } from '@/components/ui/badge';")
    lines.append("import { PageHeader } from '@/components/shared';")
    lines.append("import { " + icon + " } from 'lucide-react';")
    lines.append('')
    lines.append("interface " + iface + " {")
    lines.append("  id: string; batchNo: string; city: string; manufacturer: string; " + gradefield + ": string;")
    lines.append("  application: string; purityPercent: number; " + unitprop + ": number; investmentCr: number;")
    lines.append("  status: string; priority: string; origin: string; destination: string;")
    lines.append("  shipDate: string; transitDays: number; zone: string; remarks: string;")
    lines.append("};")
    lines.append('')
    lines.append("const " + varname + ": " + iface + "[] = [")
    for i, r in enumerate(records):
        sd = "2026-07-" + str(15 + i)
        td = str((i % 5) + 1)
        lines.append("  { id: '" + r[0] + "', batchNo: '" + r[1] + "', city: '" + r[2] + "', manufacturer: '" + r[3] + "', " + gradefield + ": '" + r[4] + "', application: '" + r[5] + "', purityPercent: " + str(r[6]) + ", " + unitprop + ": " + str(r[7]) + ", investmentCr: " + str(r[8]) + ", status: '" + r[9] + "', priority: '" + r[10] + "', origin: '" + r[11] + "', destination: '" + r[12] + "', shipDate: '" + sd + "', transitDays: " + td + ", zone: '" + r[13] + "', remarks: '" + r[14] + "' },")
    lines.append("];")
    lines.append('')
    lines.append("export default function " + funcname + "() {")
    lines.append("  const [activeTab, setActiveTab] = useState<string>('dashboard');")
    lines.append("  const [searchTerm, setSearchTerm] = useState<string>('');")
    lines.append("  const [filterZone, setFilterZone] = useState<string>('all');")
    lines.append("  const [filterStatus, setFilterStatus] = useState<string>('all');")
    lines.append('')
    lines.append("  const tabs = [")
    for tab_id in ['dashboard','registry','analytics','insights']:
        lines.append("    { id: '" + tab_id + "', label: '" + tab_id.capitalize() + "', icon: " + icon + " },")
    lines.append("  ];")
    lines.append('')
    # filteredRecords
    lines.append("  const filteredRecords = useMemo(() => {")
    lines.append("    return " + varname + ".filter((r) => {")
    lines.append("      const matchSearch = searchTerm === '' ||")
    lines.append("        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||")
    lines.append("        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||")
    lines.append("        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||")
    lines.append("        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||")
    lines.append("        r." + gradefield + ".toLowerCase().includes(searchTerm.toLowerCase()) ||")
    lines.append("        r.application.toLowerCase().includes(searchTerm.toLowerCase());")
    lines.append("      const matchZone = filterZone === 'all' || r.zone === filterZone;")
    lines.append("      const matchStatus = filterStatus === 'all' || r.status === filterStatus;")
    lines.append("      return matchSearch && matchZone && matchStatus;")
    lines.append("    });")
    lines.append("  }, [searchTerm, filterZone, filterStatus]);")
    lines.append('')
    # zones
    lines.append("  const zones = useMemo(() => {")
    lines.append("    const zMap: Record<string, number> = {};")
    lines.append("    " + varname + ".forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });")
    lines.append("    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);")
    lines.append("  }, []);")
    lines.append('')
    # kpiData
    lines.append("  const kpiData = useMemo(() => {")
    lines.append("    const total = " + varname + ".reduce((s: number, r) => s + r.investmentCr, 0);")
    lines.append("    const avgPurity = " + varname + ".reduce((s: number, r) => s + r.purityPercent, 0) / " + varname + ".length;")
    lines.append("    const delayed = " + varname + ".filter((r) => r.status === 'Delayed').length;")
    lines.append("    const critical = " + varname + ".filter((r) => r.priority === 'Critical').length;")
    lines.append("    return { total, avgPurity: avgPurity.toFixed(2), delayed, critical };")
    lines.append("  }, []);")
    lines.append('')
    # statusColor
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
    # priorityColor
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
    lines.append("  const themeColor = '" + hex_color + "';")
    lines.append("  return (")
    lines.append("    <div className=\"space-y-6 p-6\">")
    lines.append("      <PageHeader title=\"" + title + "\" description=\"" + desc + "\" />")
    # KPI
    lines.append("      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">")
    for label in ["Total Investment", "Avg Purity", "Delayed Batches", "Critical Records"]:
        val_expr = None
        if label == "Total Investment": val_expr = "{kpiData.total.toLocaleString()} Cr"
        elif label == "Avg Purity": val_expr = "{kpiData.avgPurity}%"
        elif label == "Delayed Batches": val_expr = "{kpiData.delayed}"
        elif label == "Critical Records": val_expr = "{kpiData.critical}"
        lines.append("        <Card className=\"border-l-4 border-l-" + cssclass + "-500\"><CardContent className=\"pt-6\"><div className=\"text-2xl font-bold text-" + cssclass + "-600\">" + val_expr + "</div><div className=\"text-xs text-muted-foreground mt-1\">" + label + "</div></CardContent></Card>")
    lines.append("      </div>")
    # Tabs
    lines.append("      <div className=\"flex flex-wrap gap-2 border-b pb-2\">")
    lines.append("        {tabs.map((tab) => (")
    lines.append("          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-" + cssclass + "-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>")
    lines.append("            {tab.label}")
    lines.append("          </button>")
    lines.append("        ))}")
    lines.append("      </div>")
    # Dashboard
    lines.append("      {activeTab === 'dashboard' && (")
    lines.append("        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-4\">")
    lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Zone Distribution</CardTitle></CardHeader><CardContent>")
    lines.append("            <div className=\"space-y-2\">{zones.map(([zone, count]) => { const pct = (count as number / " + varname + ".length) * 100; return <div key={zone} className=\"flex items-center gap-2\"><span className=\"text-xs w-16 text-muted-foreground\">{zone as string}</span><div className=\"flex-1 h-2 bg-muted rounded-full\"><div className=\"h-2 rounded-full\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\"text-xs font-medium w-8\">{count as number}</span></div>; })}</div>")
    lines.append("          </CardContent></Card>")
    lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Status Overview</CardTitle></CardHeader><CardContent>")
    lines.append("            <div className=\"grid grid-cols-2 gap-3\">")
    lines.append("              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = " + varname + ".filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className=\"text-lg font-bold\">{c}</div><div className=\"text-xs\">{s}</div></div>; })}")
    lines.append("            </div>")
    lines.append("          </CardContent></Card>")
    lines.append("          <Card className=\"lg:col-span-2\"><CardHeader><CardTitle className=\"text-base\">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>")
    lines.append("            <div className=\"grid grid-cols-2 md:grid-cols-4 gap-3\">")
    lines.append("              {" + varname + ".slice(0, 8).map((r) => <div key={r.id} className=\"text-center p-3 rounded-lg border bg-muted/30\"><div className=\"text-sm font-medium truncate\">{r." + gradefield + "}</div><div className=\"text-lg font-bold\" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className=\"text-xs text-muted-foreground\">{r.application}</div></div>)}")
    lines.append("            </div>")
    lines.append("          </CardContent></Card>")
    lines.append("        </div>")
    lines.append("      )}")
    # Registry
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
    lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Grade:</span><span className=\"font-medium\">{record." + gradefield + "}</span></div>")
    lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Application:</span><span className=\"font-medium\">{record.application}</span></div>")
    lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Purity:</span><span className=\"font-medium\">{record.purityPercent}%</span></div>")
    lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">" + unitprop_label + ":</span><span className=\"font-medium\">{record." + unitprop + "} " + unitprop_label.split(":")[0].strip() + "</span></div>")
    lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Investment:</span><span className=\"font-medium\" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>")
    lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">City:</span><span className=\"font-medium\">{record.city}</span></div>")
    lines.append("                    <div className=\"flex justify-between\"><span className=\"text-muted-foreground\">Route:</span><span className=\"font-medium text-xs\">{record.origin} &#8594; {record.destination}</span></div>")
    lines.append("                  </div>")
    lines.append("                </CardContent>")
    lines.append("              </Card>")
    lines.append("            ))}")
    lines.append("          </div>")
    lines.append("          <div className=\"text-sm text-muted-foreground\">Showing {filteredRecords.length} of {" + varname + ".length} records</div>")
    lines.append("        </div>")
    lines.append("      )}")
    # Analytics
    lines.append("      {activeTab === 'analytics' && (")
    lines.append("        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-4\">")
    lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Manufacturer Performance</CardTitle></CardHeader><CardContent>")
    lines.append("            <div className=\"space-y-2\">")
    lines.append("              {(() => { const mfrMap: Record<string, number> = {}; " + varname + ".forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className=\"flex items-center gap-2\"><span className=\"text-xs w-40 truncate\">{mfr as string}</span><div className=\"flex-1 h-2 bg-muted rounded-full\"><div className=\"h-2 rounded-full\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\"text-xs font-medium\">&#8377;{inv as number}Cr</span></div>; }); })()}")
    lines.append("            </div>")
    lines.append("          </CardContent></Card>")
    lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Priority Distribution</CardTitle></CardHeader><CardContent>")
    lines.append("            <div className=\"grid grid-cols-2 gap-3\">")
    lines.append("              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = " + varname + ".filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className=\"text-lg font-bold\">{c}</div><div className=\"text-xs\">{p}</div></div>; })}")
    lines.append("            </div>")
    lines.append("          </CardContent></Card>")
    lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Investment by Zone</CardTitle></CardHeader><CardContent>")
    lines.append("            <div className=\"space-y-2\">{(() => { const zInv: Record<string, number> = {}; " + varname + ".forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className=\"flex items-center gap-2\"><span className=\"text-xs w-16\">{zone as string}</span><div className=\"flex-1 h-2 bg-muted rounded-full\"><div className=\"h-2 rounded-full\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\"text-xs font-medium\">&#8377;{inv as number}Cr</span></div>; }); })()}</div>")
    lines.append("          </CardContent></Card>")
    lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Purity Distribution</CardTitle></CardHeader><CardContent>")
    lines.append("            <div className=\"space-y-2\">")
    lines.append("              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; " + varname + ".forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / " + varname + ".length) * 100; return <div key={range} className=\"flex items-center gap-2\"><span className=\"text-xs w-24\">{range}</span><div className=\"flex-1 h-2 bg-muted rounded-full\"><div className=\"h-2 rounded-full\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\"text-xs font-medium\">{count}</span></div>; }); })()}")
    lines.append("            </div>")
    lines.append("          </CardContent></Card>")
    lines.append("        </div>")
    lines.append("      )}")
    # Insights
    lines.append("      {activeTab === 'insights' && (")
    lines.append("        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">")
    lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className=\"space-y-3 text-sm\">")
    for ins in insights:
        lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + cssclass + "-500 bg-" + cssclass + "-50/50\"><div className=\"font-medium\">" + ins[0] + "</div><div className=\"text-xs text-muted-foreground mt-1\">" + ins[1] + "</div></div>")
    lines.append("          </div></CardContent></Card>")
    lines.append("          <Card><CardHeader><CardTitle className=\"text-base\">Investment Landscape</CardTitle></CardHeader><CardContent><div className=\"space-y-3 text-sm\">")
    for land in landscape:
        lines.append("            <div className=\"p-3 rounded-lg border-l-4 border-l-" + cssclass + "-500 bg-" + cssclass + "-50/50\"><div className=\"font-medium\">" + land[0] + "</div><div className=\"text-xs text-muted-foreground mt-1\">" + land[1] + "</div></div>")
    lines.append("          </div></CardContent></Card>")
    lines.append("        </div>")
    lines.append("      )}")
    lines.append("    </div>")
    lines.append("  );")
    lines.append("}")
    lines.append("")

    content = "\n".join(lines)
    entities = re.findall(r"&#(\d+);", content)
    malformed = [e for e in entities if int(e) > 9999]
    print(outfile + ": " + str(len(lines)) + " lines, " + str(len(entities)) + " entities, " + str(len(malformed)) + " malformed")
    with open(outfile, "w") as f:
        f.write(content)

# ── R423a: Carbon Fibre ──
# Tuple: (id, batchNo, city, mfr, grade, app, purity, tensileGpa, investCr, status, priority, origin, dest, zone, remarks)
cf_records = [
    ("CF-0001", "CF-B2401", "Mumbai", "MIDHANI", "T300 3K Aerospace", "HAL Tejas Mk2 Wing Skin", 99.2, 3.53, 920, "Delivered", "Critical", "MIDHANI Hyderabad (TG)", "HAL Bengaluru (KA)", "South", "T300 3K carbon fibre woven fabric for HAL Tejas Mk2 wing skin upper panel and flap &#8594; 3K tow &#8594; &#8377;920Cr for 120 tonnes &#8594; India &#8377;6,800Cr CF aerospace &#8594; HAL 40 aircraft &#8594; 3,530 MPa &#8594; &#8594; Fabric &#8594; &#8594; T300 &#8594; &#8594; Aerospace"),
    ("CF-0002", "CF-B2402", "Bengaluru", "DRDO DMRL", "T700 12K Missile", "BEL Nirbhay Cruise Fuselage", 99.5, 4.90, 860, "In Transit", "Critical", "DRDO Hyderabad (TG)", "BEL Bengaluru (KA)", "South", "T700 12K carbon fibre prepreg for BEL Nirbhay cruise missile fuselage cylindrical section &#8594; 12K tow &#8594; &#8377;860Cr for 85 tonnes &#8594; India &#8377;6,400Cr CF missile &#8594; BEL 200 missiles &#8594; 4,900 MPa &#8594; &#8594; Prepreg &#8594; &#8594; T700 &#8594; &#8594; Defense"),
    ("CF-0003", "CF-B2403", "Chennai", "Grasim Industries", "T700S Wind Blade", "Suzlon 4.0MW Blade Spar", 98.8, 4.80, 640, "Delivered", "High", "Grasim Nagda (MP)", "Suzlon Pune (MH)", "South", "T700S 24K carbon fibre unidirectional for Suzlon 4.0MW wind turbine blade main spar cap &#8594; 24K tow &#8594; &#8377;640Cr for 500 tonnes &#8594; India &#8377;4,200Cr CF wind &#8594; Suzlon 800 blades &#8594; 4,800 MPa &#8594; &#8594; UD Tape &#8594; &#8594; T700S &#8594; &#8594; Wind"),
    ("CF-0004", "CF-B2404", "Hyderabad", "Bharat Forge", "T800 12K Auto", "Mahindra XUV400 EV Roof", 99.1, 5.88, 580, "Delivered", "High", "Bharat Forge Pune (MH)", "Mahindra Nashik (MH)", "South", "T800 12K carbon fibre for Mahindra XUV400 EV roof panel and tailgate structural reinforcement &#8594; 12K tow &#8594; &#8377;580Cr for 60 tonnes &#8594; India &#8377;3,800Cr CF auto &#8594; Mahindra 80K vehicles &#8594; 5,880 MPa &#8594; &#8594; Prepreg &#8594; &#8594; T800 &#8594; &#8594; Auto"),
    ("CF-0005", "CF-B2405", "Kolkata", "Tata Advanced", "M40J 6K Space", "ISRO PSLV Payload Fairing", 99.6, 4.41, 960, "Delivered", "Critical", "Tata Adv Materials Pune (MH)", "ISRO Sriharikota (AP)", "East", "M40J 6K intermediate modulus carbon fibre for ISRO PSLV payload fairing and satellite deployer &#8594; 6K tow &#8594; &#8377;960Cr for 40 tonnes &#8594; India &#8377;7,800Cr CF space &#8594; ISRO 12 launches &#8594; 4,410 MPa &#8594; &#8594; Fabric &#8594; &#8594; M40J &#8594; &#8594; Space"),
    ("CF-0006", "CF-B2406", "Coimbatore", "L&T Composites", "T300 6K Pressure", "L&T LPG Cylinder Wrap", 98.6, 3.53, 480, "Delivered", "High", "L&T Composites Mumbai (MH)", "L&T Hazira (GJ)", "South", "T300 6K carbon fibre for L&amp;T Type-IV CNG/LPG pressure vessel hoop and helical filament wound &#8594; 6K tow &#8594; &#8377;480Cr for 300 tonnes &#8594; India &#8377;3,200Cr CF pressure &#8594; L&amp;T 40K vessels &#8594; 3,530 MPa &#8594; &#8594; Tow &#8594; &#8594; T300 &#8594; &#8594; Industrial"),
    ("CF-0007", "CF-B2407", "Pune", "Bajaj Auto", "T700 3K Moto", "Bajaj Dominar 400 Frame", 98.9, 4.90, 420, "Delivered", "Medium", "Bajaj Composites Chakan (MH)", "Bajaj Auto Pune (MH)", "West", "T700 3K carbon fibre for Bajaj Dominar 400 motorcycle trellis frame and swingarm &#8594; 3K tow &#8594; &#8377;420Cr for 80 tonnes &#8594; India &#8377;2,600Cr CF moto &#8594; Bajaj 2M frames &#8594; 4,900 MPa &#8594; &#8594; Prepreg &#8594; &#8594; T700 &#8594; &#8594; Auto"),
    ("CF-0008", "CF-B2408", "Jaipur", "Rajasthan Composites", "T300 12K General", "Godrej Furniture Frame", 97.8, 3.53, 280, "Delivered", "Medium", "Rajasthan Composites Jodhpur (RJ)", "Godrej Mumbai (MH)", "West", "T300 12K carbon fibre sheet for Godrej premium office furniture desk and partition frame &#8594; 12K tow &#8594; &#8377;280Cr for 50 tonnes &#8594; India &#8377;1,600Cr CF consumer &#8594; Godrej 500K units &#8594; 3,530 MPa &#8594; &#8594; Sheet &#8594; &#8594; T300 &#8594; &#8594; Consumer"),
    ("CF-0009", "CF-B2409", "Guwahati", "Assam Composites", "T700 6K Sports", "Jio Sports Stadium Roof", 99.0, 4.90, 520, "In Transit", "High", "Assam Composites Tezpur (AS)", "Jio Mumbai (MH)", "East", "T700 6K carbon fibre for Reliance Jio cricket stadium retractable roof tension membrane &#8594; 6K tow &#8594; &#8377;520Cr for 100 tonnes &#8594; India &#8377;3,400Cr CF infra &#8594; Jio 10 stadiums &#8594; 4,900 MPa &#8594; &#8594; Fabric &#8594; &#8594; T700 &#8594; &#8594; Infrastructure"),
    ("CF-0010", "CF-B2410", "Ahmedabad", "Gujarat Composites", "T800 6K Oil &amp; Gas", "Adani Deepwater Riser", 99.3, 5.88, 680, "Delivered", "High", "Gujarat Composites Ahmedabad (GJ)", "Adani Hazira (GJ)", "West", "T800 6K carbon fibre for Adani deepwater oil production riser reinforcement and drill pipe &#8594; 6K tow &#8594; &#8377;680Cr for 70 tonnes &#8594; India &#8377;4,600Cr CF O&amp;G &#8594; Adani 200 risers &#8594; 5,880 MPa &#8594; &#8594; Tow &#8594; &#8594; T800 &#8594; &#8594; Oil &amp; Gas"),
    ("CF-0011", "CF-B2411", "Lucknow", "UP Composites", "T300 3K Medical", "Trivitron MRI Coil", 99.2, 3.53, 460, "Delivered", "Medium", "UP Composites Lucknow (UP)", "Trivitron Chennai (TN)", "North", "T300 3K carbon fibre for Trivitron 3T MRI gradient coil former and RF shield &#8594; 3K tow &#8594; &#8377;460Cr for 30 tonnes &#8594; India &#8377;2,800Cr CF medical &#8594; Trivitron 200 scanners &#8594; 3,530 MPa &#8594; &#8594; Fabric &#8594; &#8594; T300 &#8594; &#8594; Medical"),
    ("CF-0012", "CF-B2412", "Visakhapatnam", "Vizag Composites", "M40J 6K Submarine", "GRSE Project 75I Sail", 99.4, 4.41, 940, "Delayed", "Critical", "Vizag Composites Visakhapatnam (AP)", "GRSE Kolkata (WB)", "East", "M40J 6K intermediate modulus carbon fibre for GRSE Project 75I submarine sail and fairwater passive sonar dome &#8594; 6K tow &#8597; India &#8377;7,600Cr CF naval &#8594; GRSE 6 submarines &#8597; 4,410 MPa &#8597; &#8594; Prepreg &#8594; &#8594; M40J &#8594; &#8594; Naval"),
    ("CF-0013", "CF-B2413", "Bhopal", "BHEL R&amp;D", "T700 12K Power", "BHEL Wind Turbine Blade", 98.7, 4.90, 720, "In Transit", "High", "BHEL R&amp;D Bhopal (MP)", "BHEL Hyderabad (TG)", "Central", "T700 12K carbon fibre for BHEL 3.6MW wind turbine blade spar cap and shear web &#8594; 12K tow &#8594; &#8377;720Cr for 400 tonnes &#8594; India &#8377;5,000Cr CF wind &#8594; BHEL 600 blades &#8594; 4,900 MPa &#8594; &#8594; UD Tape &#8594; &#8594; T700 &#8594; &#8594; Power"),
    ("CF-0014", "CF-B2414", "Rourkela", "SAIL Composites", "T300 12K Steel Rebar", "SAIL Concrete Bridge Deck", 97.6, 3.53, 360, "Delivered", "Medium", "SAIL Rourkela (OD)", "NHAI Delhi (DL)", "East", "T300 12K carbon fibre reinforced polymer rebar for NHAI highway bridge deck seismic retrofit &#8594; 12K tow &#8594; &#8377;360Cr for 200 tonnes &#8594; India &#8377;2,200Cr CF infra &#8594; NHAI 50 bridges &#8594; 3,530 MPa &#8594; &#8594; Rebar &#8594; &#8594; T300 &#8594; &#8594; Infrastructure"),
]

cf_insights = [
    ("Aerospace &amp; Defense Dominance", "HAL Tejas wing &#8594; DRDO Nirbhay fuselage &#8594; ISRO PSLV fairing &#8594; GRSE submarine sail driving &#8594; &#8377;3,680Cr combined &#8594; highest priority segment"),
    ("Wind Energy Boom", "Suzlon 4MW blade &#8594; BHEL 3.6MW blade &#8594; &#8594; &#8377;1,360Cr combined &#8594; India 60GW wind target &#8594; 40% CF content per blade"),
    ("Automotive Lightweighting", "Mahindra EV roof &#8594; Bajaj moto frame &#8594; &#8594; &#8377;1,000Cr combined &#8594; 30% weight reduction push &#8594; EV range improvement"),
    ("Monsoon Disruption Alert", "CF-B2412 GRSE Project 75I submarine sail delayed &#8594; monsoon Visakhapatnam port congestion &#8594; stealth submarine build at risk"),
]

cf_landscape = [
    ("Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr", "Across 14 carbon fibre grades spanning aerospace, defense, wind, EV, oil &amp; gas, medical, infrastructure &#8594; avg purity {kpiData.avgPurity}%"),
    ("Critical Priority: 5 Records", "HAL Tejas &#8594; DRDO missile &#8594; ISRO PSLV &#8594; GRSE submarine &#8594; &#8594; national security composite supply chain"),
    ("Top Manufacturers", "MIDHANI &#8594; DRDO &#8594; Grasim lead &#8594; Tata Advanced &#8594; L&amp;T &#8594; BHEL drive application-specific"),
    ("Import Dependency Alert", "T800, M40J grades heavily import-dependent from Japan/Toray &#8594; Atmanirbhar CF push via Grasim &#8594; MIDHANI PANIPAT capacity ramp"),
]

# ── R423b: Lithium Hydroxide ──
lh_records = [
    ("LH-0001", "LH-B2401", "Mumbai", "Tata Chemicals", "LiOH Battery Grade 56.5%", "Mahindra XUV400 EV Cell", 99.4, 56.5, 860, "Delivered", "Critical", "Tata Chemicals Mumbai (MH)", "Mahindra Pune (MH)", "West", "Battery-grade lithium hydroxide monohydrate for Mahindra XUV400 NMC 811 cathode precursor synthesis &#8594; 56.5% LiOH &#8594; &#8377;860Cr for 4,000 tonnes &#8594; India &#8377;6,400Cr LiOH &#8594; Mahindra 80K vehicles &#8594; 56.5% &#8594; &#8594; Powder &#8594; &#8594; LiOH&#183;H2O &#8594; &#8594; EV"),
    ("LH-0002", "LH-B2402", "Bengaluru", "DRDO DMRL", "LiOH Ultra Pure 57%", "ISRO Gaganyaan Li-Ion Pack", 99.8, 57.0, 940, "In Transit", "Critical", "DRDO Hyderabad (TG)", "ISRO Bengaluru (KA)", "South", "Ultra-pure lithium hydroxide for ISRO Gaganyaan crew module lithium-ion battery electrolyte preparation &#8594; 57% LiOH &#8594; &#8377;940Cr for 2,000 tonnes &#8594; India &#8377;7,800Cr LiOH space &#8594; ISRO 6 missions &#8594; 57.0% &#8594; &#8594; Crystal &#8594; &#8594; LiOH UP &#8594; &#8594; Space"),
    ("LH-0003", "LH-B2403", "Chennai", "Exide Industries", "LiOH Industrial Grade 55%", "Exide XUV400 Battery Pack", 98.6, 55.0, 640, "Delivered", "High", "Exide Kolkata (WB)", "Exide Chennai (TN)", "South", "Industrial-grade lithium hydroxide for Exide Industries EV battery module assembly and electrolyte &#8594; 55% LiOH &#8594; &#8377;640Cr for 6,000 tonnes &#8594; India &#8377;4,200Cr LiOH battery &#8594; Exide 100K packs &#8594; 55.0% &#8594; &#8594; Powder &#8594; &#8594; LiOH IND &#8594; &#8594; EV"),
    ("LH-0004", "LH-B2404", "Hyderabad", "Bharat Lithium", "LiOH Grease Grade 56%", "Bharat Forge EV Bearing", 99.0, 56.0, 420, "Delivered", "High", "Bharat Lithium Hyderabad (TG)", "Bharat Forge Pune (MH)", "South", "Grease-grade lithium hydroxide for Bharat Forge EV motor bearing lithium grease saponification &#8594; 56% LiOH &#8594; &#8377;420Cr for 3,000 tonnes &#8594; India &#8377;2,800Cr LiOH grease &#8594; Bharat Forge 5M bearings &#8594; 56.0% &#8594; &#8594; Powder &#8594; &#8594; LiOH GR &#8594; &#8594; Auto"),
    ("LH-0005", "LH-B2405", "Kolkata", "Hindustan Copper", "LiOH Pharma Grade 56.5%", "Sun Pharma Mood Stabilizer", 99.6, 56.5, 560, "In Transit", "High", "HCL Kolkata (WB)", "Sun Pharma Vadodara (GJ)", "East", "Pharma-grade lithium hydroxide for Sun Pharma lithium carbonate and bipolar mood stabilizer API &#8594; 56.5% LiOH &#8594; &#8377;560Cr for 1,500 tonnes &#8594; India &#8377;3,800Cr LiOH pharma &#8594; Sun Pharma 200M doses &#8594; 56.5% &#8594; &#8594; Powder &#8594; &#8594; LiOH PH &#8594; &#8594; Pharma"),
    ("LH-0006", "LH-B2406", "Coimbatore", "L&amp;T Battery", "LiOH Cathode Grade 56.5%", "L&amp;T 5G Battery Energy Storage", 99.2, 56.5, 720, "Delivered", "Critical", "L&amp;T Mumbai (MH)", "L&amp;T Chennai (TN)", "South", "Cathode-grade lithium hydroxide for L&amp;T 5G tower LiFePO4 battery energy storage system &#8594; 56.5% LiOH &#8594; &#8377;720Cr for 3,500 tonnes &#8594; India &#8377;5,200Cr LiOH BESS &#8594; L&amp;T 10K towers &#8594; 56.5% &#8594; &#8594; Powder &#8594; &#8594; LiOH CATH &#8594; &#8594; Telecom"),
    ("LH-0007", "LH-B2407", "Pune", "Godrej Lubricants", "LiOH Lubricant Grade 55%", "Godrej Li Grease", 98.4, 55.0, 320, "Delivered", "Medium", "Godrej Mumbai (MH)", "Godrej Pune (MH)", "West", "Lubricant-grade lithium hydroxide for Godrej multi-purpose lithium 12-hydroxy stearate grease &#8594; 55% LiOH &#8594; &#8377;320Cr for 4,000 tonnes &#8594; India &#8377;2,000Cr LiOH lubricant &#8594; Godrej 20M kg grease &#8594; 55.0% &#8594; &#8594; Powder &#8594; &#8594; LiOH LUB &#8594; &#8594; Industrial"),
    ("LH-0008", "LH-B2408", "Jaipur", "Rajasthan Lithium", "LiOH Solar Grade 56%", "Adani Solar Cell Electrolyte", 99.3, 56.0, 480, "Delivered", "Medium", "Rajasthan Lithium Jodhpur (RJ)", "Adani Mundra (GJ)", "West", "Solar-grade lithium hydroxide for Adani solar cell manufacturing lithium silicate and glass etchant &#8594; 56% LiOH &#8594; &#8377;480Cr for 2,000 tonnes &#8594; India &#8377;3,200Cr LiOH solar &#8594; Adani 10GW cells &#8594; 56.0% &#8594; &#8594; Crystal &#8594; &#8594; LiOH SOL &#8594; &#8594; Solar"),
    ("LH-0009", "LH-B2409", "Guwahati", "Assam Lithium", "LiOH Ceramics Grade 56.5%", "BEL Glass-Ceramic Substrate", 99.1, 56.5, 520, "In Transit", "High", "Assam Lithium Tezpur (AS)", "BEL Bengaluru (KA)", "East", "Ceramics-grade lithium hydroxide for BEL radar glass-ceramic substrate lithium aluminosilicate &#8594; 56.5% LiOH &#8594; &#8377;520Cr for 1,200 tonnes &#8594; India &#8377;3,400Cr LiOH ceramic &#8594; BEL 50 radars &#8594; 56.5% &#8594; &#8594; Powder &#8594; &#8594; LiOH CER &#8594; &#8594; Defense"),
    ("LH-0010", "LH-B2410", "Ahmedabad", "Gujarat Lithium", "LiOH Nuclear Grade 57%", "IGCAR PFBR Coolant Additive", 99.7, 57.0, 880, "Delivered", "Critical", "Gujarat Lithium Ahmedabad (GJ)", "IGCAR Kalpakkam (TN)", "West", "Nuclear-grade lithium hydroxide for IGCAR Prototype Fast Breeder Reactor coolant pH control &#8594; 57% LiOH &#8594; &#8377;880Cr for 800 tonnes &#8594; India &#8377;7,200Cr LiOH nuclear &#8594; IGCAR 2 reactors &#8594; 57.0% &#8594; &#8594; Crystal &#8594; &#8594; LiOH NUC &#8594; &#8594; Nuclear"),
    ("LH-0011", "LH-B2411", "Lucknow", "UP Lithium", "LiOH Carbonation Grade 56%", "Tata Steel CO2 Capture", 98.8, 56.0, 440, "Delivered", "Medium", "UP Lithium Kanpur (UP)", "Tata Steel Jamshedpur (JH)", "North", "Carbonation-grade lithium hydroxide for Tata Steel blast furnace CO2 capture lithium carbonate &#8594; 56% LiOH &#8594; &#8377;440Cr for 3,000 tonnes &#8594; India &#8377;2,800Cr LiOH carbon &#8594; Tata 4 furnaces &#8594; 56.0% &#8594; &#8594; Solution &#8594; &#8594; LiOH CAR &#8594; &#8594; Steel"),
    ("LH-0012", "LH-B2412", "Visakhapatnam", "Vizag Lithium", "LiOH Submarine Grade 57%", "GRSE Project 75I Battery", 99.5, 57.0, 940, "Delayed", "Critical", "Vizag Lithium Visakhapatnam (AP)", "GRSE Kolkata (WB)", "East", "Submarine-grade ultra-pure lithium hydroxide for GRSE Project 75I submarine lead-acid battery electrolyte additive &#8594; 57% LiOH &#8597; India &#8377;7,600Cr LiOH naval &#8594; GRSE 6 submarines &#8597; 57.0% &#8597; &#8594; Crystal &#8594; &#8594; LiOH SUB &#8594; &#8594; Naval"),
    ("LH-0013", "LH-B2413", "Bhopal", "BHEL Battery Div", "LiOH Grid Grade 56.5%", "BHEL Inverter Battery", 99.0, 56.5, 620, "In Transit", "High", "BHEL Bhopal (MP)", "BHEL Hyderabad (TG)", "Central", "Grid-grade lithium hydroxide for BHEL solar inverter and grid-scale LiFePO4 battery module &#8594; 56.5% LiOH &#8594; &#8377;620Cr for 2,500 tonnes &#8594; India &#8377;4,200Cr LiOH grid &#8594; BHEL 20 MWh &#8594; 56.5% &#8594; &#8594; Powder &#8594; &#8594; LiOH GRID &#8594; &#8594; Power"),
    ("LH-0014", "LH-B2414", "Rourkela", "SAIL Lithium", "LiOH Mining Grade 55%", "Coal India Dust Suppress", 97.6, 55.0, 340, "Delivered", "Medium", "SAIL Rourkela (OD)", "Coal India Ranchi (JH)", "East", "Mining-grade lithium hydroxide for Coal India underground mine dust suppressant and coal desulfurization &#8594; 55% LiOH &#8594; &#8377;340Cr for 5,000 tonnes &#8594; India &#8377;2,200Cr LiOH mining &#8594; CIL 40 mines &#8594; 55.0% &#8594; &#8594; Solution &#8594; &#8594; LiOH MIN &#8594; &#8594; Mining"),
]

lh_insights = [
    ("EV Battery Cathode Dominance", "Mahindra XUV400 &#8594; Exide XUV400 &#8594; L&amp;T 5G BESS driving &#8594; &#8377;2,220Cr combined &#8594; NMC 811 high-nickel cathode push"),
    ("Space &amp; Nuclear Strategic", "ISRO Gaganyaan &#8594; IGCAR PFBR &#8594; &#8594; &#8377;1,820Cr combined &#8594; ultra-pure grade critical &#8594; indigenous supply"),
    ("Pharma &amp; Defense Grease", "Sun Pharma bipolar &#8594; BEL glass-ceramic &#8594; Bharat Forge bearing &#8594; &#8594; &#8377;1,400Cr combined &#8594; specialty niche"),
    ("Monsoon Disruption Alert", "LH-B2412 GRSE Project 75I submarine battery delayed &#8594; monsoon Visakhapatnam port congestion &#8594; sub fleet readiness at risk"),
]

lh_landscape = [
    ("Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr", "Across 14 lithium hydroxide grades spanning EV, space, nuclear, defense, pharma, solar, telecom, mining &#8594; avg purity {kpiData.avgPurity}%"),
    ("Critical Priority: 6 Records", "Mahindra EV &#8594; ISRO Gaganyaan &#8594; L&amp;T BESS &#8594; IGCAR nuclear &#8594; GRSE submarine &#8594; &#8594; energy security chain"),
    ("Top Manufacturers", "Tata Chemicals &#8594; DRDO &#8594; Exide lead &#8594; Bharat Lithium &#8594; Gujarat Lithium &#8594; &#8594; emerging Indian LiOH capacity"),
    ("Import Dependency Alert", "90% LiOH imported from China/Chile &#8594; Atmanirbhar critical &#8594; RKAB auction for Manali-Leh lithium block &#8594; Jharkhand reserve"),
]

# Generate both modules
gen_module(
    "/home/z/my-project/src/components/modules/carbon-fibre-logistics-view.tsx",
    "Hexagon", "#0891b2", "cyan", "CarbonFibreRecord", "CarbonFibreLogisticsView", "carbonFibreRecords",
    "Carbon Fibre Logistics", "Indian carbon fibre (T300/T700/T800/M40J) aerospace, wind energy, automotive, defense, oil &amp; gas and infrastructure supply chain tracking across 14 grades",
    "cfGrade", "tensileGpa", "Tensile Strength", cf_records, cf_insights, cf_landscape
)

gen_module(
    "/home/z/my-project/src/components/modules/lithium-hydroxide-logistics-view.tsx",
    "Atom", "#dc2626", "red", "LithiumHydroxideRecord", "LithiumHydroxideLogisticsView", "lithiumHydroxideRecords",
    "Lithium Hydroxide Logistics", "Indian lithium hydroxide (LiOH&#183;H2O) EV battery cathode, space, nuclear, pharma, grease and solar supply chain tracking across 14 grades",
    "lhGrade", "purityAssay", "Assay", lh_records, lh_insights, lh_landscape
)
