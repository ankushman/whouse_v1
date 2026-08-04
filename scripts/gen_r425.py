#!/usr/bin/env python3
"""R425 Generator — Refractory Ceramic Logistics + Cobalt Sulphate Logistics"""

import re

MODULES_DIR = "/home/z/my-project/src/components/modules"


def esc(text):
    return text.replace("\\", "\\\\").replace("'", "\\'")


def esc_html(text):
    t = text.replace("&", "&amp;")
    t = t.replace(">", " &#8594; ")
    return t


def gen_records(data):
    lines = []
    for r in data:
        lines.append(
            "  { id: '" + r["id"] + "', batchNo: '" + r["batchNo"]
            + "', city: '" + r["city"] + "', manufacturer: '" + r["manufacturer"]
            + "', grade: '" + esc(r["grade"]) + "', application: '" + esc(r["application"])
            + "', purityPercent: " + str(r["purity"])
            + ", specProp: " + str(r["prop"])
            + ", investmentCr: " + str(r["invest"])
            + ", status: '" + r["status"]
            + "', priority: '" + r["priority"]
            + "', origin: '" + esc(r["origin"])
            + "', destination: '" + esc(r["dest"])
            + "', shipDate: '" + r["shipDate"]
            + "', transitDays: " + str(r["transit"])
            + ", zone: '" + r["zone"]
            + "', remarks: '" + esc_html(r["remarks"]) + "' },"
        )
    return "\n".join(lines)


def gen_module(name, title, icon, hex_color, tailwind_prefix, interface_field, unit_prop_label, unit_prop_key, records_data, insights_left, insights_right):
    records_js = gen_records(records_data)

    insight_left_cards = []
    for ins in insights_left:
        insight_left_cards.append(
            '            <div className="p-3 rounded-lg border-l-4 border-l-'
            + tailwind_prefix + '-500 bg-' + tailwind_prefix
            + '-50/50"><div className="font-medium">' + ins["title"]
            + '</div><div className="text-xs text-muted-foreground mt-1">' + ins["body"] + '</div></div>'
        )
    insights_left_html = "\n".join(insight_left_cards)

    insight_right_cards = []
    for ins in insights_right:
        insight_right_cards.append(
            '            <div className="p-3 rounded-lg border-l-4 border-l-'
            + tailwind_prefix + '-500 bg-' + tailwind_prefix
            + '-50/50"><div className="font-medium">' + ins["title"]
            + '</div><div className="text-xs text-muted-foreground mt-1">' + ins["body"] + '</div></div>'
        )
    insights_right_html = "\n".join(insight_right_cards)

    component_name = "".join(w.capitalize() for w in name.split("-")) + "LogisticsView"
    rec_name = name.replace("-", "")

    code = '''"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { ''' + icon + ''' } from 'lucide-react';

interface ''' + component_name.replace("LogisticsView", "Record") + ''' {
  id: string; batchNo: string; city: string; manufacturer: string; ''' + interface_field + ''': string;
  application: string; purityPercent: number; ''' + unit_prop_key + ''': number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const ''' + rec_name + '''Records: ''' + component_name.replace("LogisticsView", "Record") + '''[] = [
''' + records_js + '''
];

export default function ''' + component_name + '''() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: ''' + icon + ''' },
    { id: 'registry', label: 'Registry', icon: ''' + icon + ''' },
    { id: 'analytics', label: 'Analytics', icon: ''' + icon + ''' },
    { id: 'insights', label: 'Insights', icon: ''' + icon + ''' },
  ];

  const filteredRecords = useMemo(() => {
    return ''' + rec_name + '''Records.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.''' + interface_field + '''.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    ''' + rec_name + '''Records.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = ''' + rec_name + '''Records.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = ''' + rec_name + '''Records.reduce((s: number, r) => s + r.purityPercent, 0) / ''' + rec_name + '''Records.length;
    const delayed = ''' + rec_name + '''Records.filter((r) => r.status === 'Delayed').length;
    const critical = ''' + rec_name + '''Records.filter((r) => r.priority === 'Critical').length;
    return { total, avgPurity: avgPurity.toFixed(2), delayed, critical };
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'In Transit': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'Delayed': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'Processing': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const themeColor = \'''' + hex_color + '''\';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="''' + title + '''" description="Indian ''' + title.lower() + ''' supply chain tracking across 14 grades spanning steelmaking, foundry, defense, aerospace, power, automotive and infrastructure sectors" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-''' + tailwind_prefix + '''-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-''' + tailwind_prefix + '''-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-''' + tailwind_prefix + '''-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-''' + tailwind_prefix + '''-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-''' + tailwind_prefix + '''-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-''' + tailwind_prefix + '''-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-''' + tailwind_prefix + '''-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-''' + tailwind_prefix + '''-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-''' + tailwind_prefix + '''-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / ''' + rec_name + '''Records.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = ''' + rec_name + '''Records.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {''' + rec_name + '''Records.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.''' + interface_field + '''}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <input type="text" placeholder="Search ID, batch, city, grade..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-3 py-2 border rounded-md text-sm flex-1 min-w-[200px]" />
            <select value={filterZone} onChange={(e) => setFilterZone(e.target.value)} className="px-3 py-2 border rounded-md text-sm"><option value="all">All Zones</option>{zones.map(([z]) => <option key={z} value={z}>{z as string}</option>)}</select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-md text-sm"><option value="all">All Status</option>{['Delivered','In Transit','Delayed','Processing'].map((s) => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredRecords.map((record) => (
              <Card key={record.id} className={record.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div><span className="font-semibold text-sm">{record.id}</span><span className="text-xs text-muted-foreground ml-2">{record.batchNo}</span></div>
                    <div className="flex gap-1"><Badge variant="outline" className={statusColor(record.status)}>{record.status}</Badge><Badge variant="outline" className={priorityColor(record.priority)}>{record.priority}</Badge></div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.''' + interface_field + '''}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">''' + unit_prop_label + '''</span><span className="font-medium">{record.''' + unit_prop_key + '''}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {''' + rec_name + '''Records.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; ''' + rec_name + '''Records.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = ''' + rec_name + '''Records.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; ''' + rec_name + '''Records.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; ''' + rec_name + '''Records.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / ''' + rec_name + '''Records.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
''' + insights_left_html + '''
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
''' + insights_right_html + '''
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
'''
    return code


# ================================================================
# MODULE A: Refractory Ceramic Logistics (Al2O3/MgO/ZrO2/SiC)
# ================================================================
rc_records = [
    {
        "id": "RC-0001", "batchNo": "RC-B2401", "city": "Mumbai",
        "manufacturer": "MIDHANI",
        "grade": "Al2O3 99.8% Dense", "application": "SAIL Bhilai Blast Furnace Lining",
        "purity": 99.8, "prop": 2100, "invest": 920,
        "status": "Delivered", "priority": "Critical",
        "origin": "MIDHANI Hyderabad (TG)", "dest": "SAIL Bhilai (CG)",
        "shipDate": "2026-07-15", "transit": 1, "zone": "West",
        "remarks": "Al2O3 99.8% dense alumina for SAIL Bhilai blast furnace hearth lining &#8594; 2100 kg/m3 &#8594; &#8377;920Cr for 150 tonnes &#8594; India &#8377;6,800Cr refractory &#8594; SAIL 8 furnaces &#8594; 99.8% purity &#8594; &#8594; Brick &#8594; &#8594; Al2O3Dense &#8594; &#8594; Steel"
    },
    {
        "id": "RC-0002", "batchNo": "RC-B2402", "city": "Bengaluru",
        "manufacturer": "DRDO DMRL",
        "grade": "ZrO2 97% YSZ Thermal", "application": "BEL LCA Tejas Mk2 TBC Coating",
        "purity": 97.0, "prop": 5680, "invest": 860,
        "status": "In Transit", "priority": "Critical",
        "origin": "DRDO Hyderabad (TG)", "dest": "BEL Bengaluru (KA)",
        "shipDate": "2026-07-16", "transit": 2, "zone": "South",
        "remarks": "ZrO2 97% yttria-stabilized zirconia for BEL Tejas Mk2 turbine blade thermal barrier coating &#8594; 5680 kg/m3 &#8594; &#8377;860Cr for 45 tonnes &#8594; India &#8377;6,200Cr TBC &#8594; BEL 40 aircraft &#8594; 97.0% purity &#8594; &#8594; Powder &#8594; &#8594; ZrO2YSZ &#8594; &#8594; Aerospace"
    },
    {
        "id": "RC-0003", "batchNo": "RC-B2403", "city": "Chennai",
        "manufacturer": "Tata Steel",
        "grade": "MgO 98% Basic", "application": "JSW Steel BOF Refractory",
        "purity": 98.0, "prop": 3580, "invest": 780,
        "status": "Delivered", "priority": "High",
        "origin": "Tata Steel Jamshedpur (JH)", "dest": "JSW Vijayanagar (KA)",
        "shipDate": "2026-07-17", "transit": 3, "zone": "South",
        "remarks": "MgO 98% dead-burnt magnesia for JSW Vijayanagar basic oxygen furnace refractory lining &#8594; 3580 kg/m3 &#8594; &#8377;780Cr for 200 tonnes &#8594; India &#8377;5,400Cr MgO &#8594; JSW 12 furnaces &#8594; 98.0% purity &#8594; &#8594; Brick &#8594; &#8594; MgOBasic &#8594; &#8594; Steel"
    },
    {
        "id": "RC-0004", "batchNo": "RC-B2404", "city": "Hyderabad",
        "manufacturer": "Bharat Forge",
        "grade": "SiC 99% Crucible", "application": "Bharat Forge Die Casting Crucible",
        "purity": 99.0, "prop": 3100, "invest": 520,
        "status": "Delivered", "priority": "High",
        "origin": "Bharat Forge Pune (MH)", "dest": "Bharat Forge Baramati (MH)",
        "shipDate": "2026-07-18", "transit": 4, "zone": "West",
        "remarks": "SiC 99% silicon carbide crucible for Bharat Forge die casting molten steel containment &#8594; 3100 kg/m3 &#8594; &#8377;520Cr for 80 tonnes &#8594; India &#8377;3,600Cr SiC &#8594; Bharat Forge 5M forgings &#8594; 99.0% purity &#8594; &#8594; Crucible &#8594; &#8594; SiCCruc &#8594; &#8594; Automotive"
    },
    {
        "id": "RC-0005", "batchNo": "RC-B2405", "city": "Kolkata",
        "manufacturer": "Carborundum Universal",
        "grade": "Al2O3 95% Insulating", "application": "L&amp;T Warship Engine Exhaust",
        "purity": 95.0, "prop": 1800, "invest": 640,
        "status": "In Transit", "priority": "High",
        "origin": "Carborundum Chennai (TN)", "dest": "L&amp;T Kattupalli (TN)",
        "shipDate": "2026-07-19", "transit": 5, "zone": "East",
        "remarks": "Al2O3 95% insulating firebrick for L&amp;T warship gas turbine exhaust thermal insulation &#8594; 1800 kg/m3 &#8594; &#8377;640Cr for 120 tonnes &#8594; India &#8377;4,400Cr IFB &#8594; L&amp;T 30 warships &#8594; 95.0% purity &#8594; &#8594; Brick &#8594; &#8594; Al2O3IFB &#8594; &#8594; Naval"
    },
    {
        "id": "RC-0006", "batchNo": "RC-B2406", "city": "Coimbatore",
        "manufacturer": "BHEL R&amp;D",
        "grade": "ZrO2 99% Nuclear", "application": "BHEL 800MW GT Combustor",
        "purity": 99.0, "prop": 5680, "invest": 740,
        "status": "Delivered", "priority": "Critical",
        "origin": "BHEL Bhopal (MP)", "dest": "BHEL Hyderabad (TG)",
        "shipDate": "2026-07-20", "transit": 1, "zone": "South",
        "remarks": "ZrO2 99% nuclear-grade zirconia for BHEL 800MW gas turbine combustor thermal liner &#8594; 5680 kg/m3 &#8594; &#8377;740Cr for 60 tonnes &#8594; India &#8377;5,200Cr ZrO2 GT &#8594; BHEL 20 GTs &#8594; 99.0% purity &#8594; &#8594; Tile &#8594; &#8594; ZrO2Nuc &#8594; &#8594; Power"
    },
    {
        "id": "RC-0007", "batchNo": "RC-B2407", "city": "Pune",
        "manufacturer": "Mahindra Steel",
        "grade": "SiC 97% Kiln Furniture", "application": "Mahindra XUV400 EV Battery Kiln",
        "purity": 97.0, "prop": 2700, "invest": 380,
        "status": "Delivered", "priority": "Medium",
        "origin": "Mahindra Nashik (MH)", "dest": "Mahindra Pune (MH)",
        "shipDate": "2026-07-21", "transit": 2, "zone": "West",
        "remarks": "SiC 97% kiln furniture for Mahindra XUV400 EV battery cathode sintering support &#8594; 2700 kg/m3 &#8594; &#8377;380Cr for 40 tonnes &#8594; India &#8377;2,600Cr SiC kiln &#8594; Mahindra 50K batteries &#8594; 97.0% purity &#8594; &#8594; Setter &#8594; &#8594; SiCKiln &#8594; &#8594; Automotive"
    },
    {
        "id": "RC-0008", "batchNo": "RC-B2408", "city": "Jaipur",
        "manufacturer": "Rajasthan Ceramics",
        "grade": "Al2O3 92% Castable", "application": "Indian Railways RCF Kiln Lining",
        "purity": 92.0, "prop": 2850, "invest": 460,
        "status": "Delivered", "priority": "Medium",
        "origin": "Rajasthan Ceramics Jodhpur (RJ)", "dest": "RCF Kapurthala (PB)",
        "shipDate": "2026-07-22", "transit": 3, "zone": "West",
        "remarks": "Al2O3 92% castable refractory for Indian Railways wheel factory kiln car lining &#8594; 2850 kg/m3 &#8594; &#8377;460Cr for 100 tonnes &#8594; India &#8377;3,200Cr castable &#8594; IR 200K wheels &#8594; 92.0% purity &#8594; &#8594; Castable &#8594; &#8594; Al2O3Cast &#8594; &#8594; Rail"
    },
    {
        "id": "RC-0009", "batchNo": "RC-B2409", "city": "Guwahati",
        "manufacturer": "Assam Refractories",
        "grade": "MgO 96% Ladle", "application": "Tata Steel Ladle Refractory",
        "purity": 96.0, "prop": 3400, "invest": 560,
        "status": "In Transit", "priority": "High",
        "origin": "Assam Refractories Tezpur (AS)", "dest": "Tata Steel Jamshedpur (JH)",
        "shipDate": "2026-07-23", "transit": 4, "zone": "East",
        "remarks": "MgO 96% ladle refractory for Tata Steel 300-tonne ladle slag line magnesia-carbon brick &#8594; 3400 kg/m3 &#8594; &#8377;560Cr for 130 tonnes &#8594; India &#8377;3,800Cr MgC &#8594; Tata 20 ladles &#8594; 96.0% purity &#8594; &#8594; Brick &#8594; &#8594; MgOLadle &#8594; &#8594; Steel"
    },
    {
        "id": "RC-0010", "batchNo": "RC-B2410", "city": "Ahmedabad",
        "manufacturer": "Gujarat Refractories",
        "grade": "ZrO2 95% Missile", "application": "IGCAR PFBR Core Shroud",
        "purity": 95.0, "prop": 5500, "invest": 900,
        "status": "Delivered", "priority": "Critical",
        "origin": "Gujarat Refractories Ahmedabad (GJ)", "dest": "IGCAR Kalpakkam (TN)",
        "shipDate": "2026-07-24", "transit": 5, "zone": "West",
        "remarks": "ZrO2 95% zirconia for IGCAR Prototype Fast Breeder Reactor core shroud thermal shielding &#8594; 5500 kg/m3 &#8594; &#8377;900Cr for 50 tonnes &#8594; India &#8377;7,400Cr ZrO2 nuclear &#8594; IGCAR 2 reactors &#8594; 95.0% purity &#8594; &#8594; Block &#8594; &#8594; ZrO2Core &#8594; &#8594; Nuclear"
    },
    {
        "id": "RC-0011", "batchNo": "RC-B2411", "city": "Lucknow",
        "manufacturer": "UP Refractories",
        "grade": "SiC 95%窑 Nozzle", "application": "Adani Steel Tundish Nozzle",
        "purity": 95.0, "prop": 2900, "invest": 420,
        "status": "Delivered", "priority": "Medium",
        "origin": "UP Refractories Kanpur (UP)", "dest": "Adani Mundra (GJ)",
        "shipDate": "2026-07-25", "transit": 1, "zone": "North",
        "remarks": "SiC 95% silicon carbide tundish nozzle for Adani Steel continuous casting steel flow &#8594; 2900 kg/m3 &#8594; &#8377;420Cr for 40 tonnes &#8594; India &#8377;2,800Cr SiC nozzle &#8594; Adani 5 casters &#8594; 95.0% purity &#8594; &#8594; Nozzle &#8594; &#8594; SiCNozzle &#8594; &#8594; Steel"
    },
    {
        "id": "RC-0012", "batchNo": "RC-B2412", "city": "Visakhapatnam",
        "manufacturer": "Vizag Refractories",
        "grade": "Al2O3 99.5% Submarine", "application": "GRSE Project 75I Sonar Dome",
        "purity": 99.5, "prop": 2200, "invest": 960,
        "status": "Delayed", "priority": "Critical",
        "origin": "Vizag Refractories Visakhapatnam (AP)", "dest": "GRSE Kolkata (WB)",
        "shipDate": "2026-07-26", "transit": 2, "zone": "East",
        "remarks": "Al2O3 99.5% submarine-grade for GRSE Project 75I sonar dome high-purity alumina window &#8594; 2200 kg/m3 &#8597; &#8377;960Cr for 30 tonnes &#8597; India &#8377;7,800Cr Al2O3 submarine &#8597; GRSE 6 submarines &#8597; 99.5% purity &#8597; &#8594; Dome &#8597; &#8594; Al2O3Sub &#8597; &#8594; Naval"
    },
    {
        "id": "RC-0013", "batchNo": "RC-B2413", "city": "Bhopal",
        "manufacturer": "DRDO TBRL",
        "grade": "ZrO2 98% Warhead", "application": "DRDO BrahMos Mk2 Radome",
        "purity": 98.0, "prop": 5600, "invest": 880,
        "status": "In Transit", "priority": "Critical",
        "origin": "DRDO Chandipur (OD)", "dest": "BHEL Hyderabad (TG)",
        "shipDate": "2026-07-27", "transit": 3, "zone": "Central",
        "remarks": "ZrO2 98% zirconia for DRDO BrahMos Mk2 seeker radome RF-transparent ceramic &#8594; 5600 kg/m3 &#8594; &#8377;880Cr for 40 tonnes &#8594; India &#8377;6,400Cr ZrO2 missile &#8594; DRDO 200 missiles &#8594; 98.0% purity &#8594; &#8594; Cone &#8594; &#8594; ZrO2Radome &#8594; &#8594; Defense"
    },
    {
        "id": "RC-0014", "batchNo": "RC-B2414", "city": "Rourkela",
        "manufacturer": "SAIL Refractories",
        "grade": "MgO 93% General", "application": "SAIL Rourkela Coke Oven",
        "purity": 93.0, "prop": 3200, "invest": 340,
        "status": "Delivered", "priority": "Low",
        "origin": "SAIL Rourkela (OD)", "dest": "SAIL Bhilai (CG)",
        "shipDate": "2026-07-28", "transit": 4, "zone": "East",
        "remarks": "MgO 93% general magnesia for SAIL Rourkela coke oven wall silica brick replacement &#8594; 3200 kg/m3 &#8594; &#8377;340Cr for 180 tonnes &#8594; India &#8377;2,200Cr MgO coke &#8594; SAIL 4 ovens &#8594; 93.0% purity &#8594; &#8594; Brick &#8594; &#8594; MgOGen &#8594; &#8594; Steel"
    },
]

rc_insights_left = [
    {"title": "Steel &amp; Foundry Dominance", "body": "SAIL blast furnace &#8594; JSW BOF &#8594; Tata ladle &#8594; &#8377;2,260Cr combined &#8594; highest volume segment"},
    {"title": "Defense &amp; Naval Programme", "body": "BEL Tejas TBC &#8594; GRSE sonar dome &#8594; DRDO BrahMos radome &#8594; &#8377;2,700Cr combined &#8594; strategic national assets"},
    {"title": "Nuclear &amp; Power", "body": "IGCAR core shroud &#8594; BHEL GT combustor &#8594; &#8377;1,640Cr combined &#8594; critical infrastructure backbone"},
    {"title": "Monsoon Disruption Alert", "body": "RC-B2412 GRSE Project 75I sonar dome delayed &#8594; monsoon Visakhapatnam port congestion &#8594; submarine programme at risk"},
]
rc_insights_right = [
    {"title": "Total Portfolio: &#8377;8,760 Cr", "body": "Across 14 refractory grades spanning Al2O3, ZrO2, MgO, SiC for steel, defense, nuclear, naval, rail, EV, power and missile sectors &#8594; avg purity 96.83%"},
    {"title": "Critical Priority: 7 Records", "body": "SAIL furnace &#8594; BEL Tejas TBC &#8594; BHEL GT &#8594; IGCAR nuclear &#8594; GRSE sonar &#8594; DRDO radome &#8594; JSW BOF"},
    {"title": "Top Manufacturers", "body": "MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Carborundum Universal lead strategic &#8594; Bharat Forge &#8594; Gujarat Refractories drive commercial"},
    {"title": "Material Spectrum", "body": "Al2O3 (92-99.8%) &#8594; ZrO2 (95-99%) &#8594; MgO (93-98%) &#8594; SiC (95-99%) &#8594; four major refractory families covered"},
]


# ================================================================
# MODULE B: Cobalt Sulphate Logistics (CoSO4)
# ================================================================
cs_records = [
    {
        "id": "COS-0001", "batchNo": "COS-B2401", "city": "Mumbai",
        "manufacturer": "MIDHANI",
        "grade": "CoSO4 99.9% Battery", "application": "Exide Industries Li-Ion Cathode",
        "purity": 99.9, "prop": 20.5, "invest": 880,
        "status": "Delivered", "priority": "Critical",
        "origin": "MIDHANI Hyderabad (TG)", "dest": "Exide Kolkata (WB)",
        "shipDate": "2026-07-15", "transit": 1, "zone": "West",
        "remarks": "CoSO4 99.9% battery-grade for Exide NMC cathode cobalt precursor &#8594; 20.5% Co &#8594; &#8377;880Cr for 50 tonnes &#8594; India &#8377;6,200Cr CoSO4 battery &#8594; Exide 100M cells &#8594; 99.9% purity &#8594; &#8594; Crystal &#8594; &#8594; CoSO4Batt &#8594; &#8594; Battery"
    },
    {
        "id": "COS-0002", "batchNo": "COS-B2402", "city": "Bengaluru",
        "manufacturer": "DRDO DMRL",
        "grade": "CoSO4 99.5% Superalloy", "application": "BEL LCA Tejas Mk2 Turbine Disc",
        "purity": 99.5, "prop": 20.8, "invest": 820,
        "status": "In Transit", "priority": "Critical",
        "origin": "DRDO Hyderabad (TG)", "dest": "BEL Bengaluru (KA)",
        "shipDate": "2026-07-16", "transit": 2, "zone": "South",
        "remarks": "CoSO4 99.5% superalloy precursor for BEL Tejas Mk2 F414 turbine disc Ni-Co superalloy &#8594; 20.8% Co &#8594; &#8377;820Cr for 40 tonnes &#8594; India &#8377;5,800Cr CoSO4 aerospace &#8594; BEL 40 aircraft &#8594; 99.5% purity &#8594; &#8594; Solution &#8594; &#8594; CoSO4Super &#8594; &#8594; Aerospace"
    },
    {
        "id": "COS-0003", "batchNo": "COS-B2403", "city": "Chennai",
        "manufacturer": "Tata Steel",
        "grade": "CoSO4 98% Pigment", "application": "Asian Paints Cobalt Blue Pigment",
        "purity": 98.0, "prop": 20.0, "invest": 540,
        "status": "Delivered", "priority": "High",
        "origin": "Tata Steel Jamshedpur (JH)", "dest": "Asian Paints Mumbai (MH)",
        "shipDate": "2026-07-17", "transit": 3, "zone": "South",
        "remarks": "CoSO4 98% pigment-grade for Asian Paints cobalt blue ceramic pigment &#8594; 20% Co &#8594; &#8377;540Cr for 70 tonnes &#8594; India &#8377;3,800Cr CoSO4 pigment &#8594; Asian 50M litres &#8594; 98.0% purity &#8594; &#8594; Powder &#8594; &#8594; CoSO4Pig &#8594; &#8594; Paint"
    },
    {
        "id": "COS-0004", "batchNo": "COS-B2404", "city": "Hyderabad",
        "manufacturer": "Bharat Forge",
        "grade": "CoSO4 97% Hardmetal", "application": "Bharat Forge WC-Co Tool Insert",
        "purity": 97.0, "prop": 21.0, "invest": 480,
        "status": "Delivered", "priority": "High",
        "origin": "Bharat Forge Pune (MH)", "dest": "Sandvik Hyderabad (TG)",
        "shipDate": "2026-07-18", "transit": 4, "zone": "West",
        "remarks": "CoSO4 97% hardmetal binder for Bharat Forge WC-Co tungsten carbide tool insert &#8594; 21% Co &#8594; &#8377;480Cr for 60 tonnes &#8594; India &#8377;3,400Cr CoSO4 tool &#8594; Bharat Forge 2M inserts &#8594; 97.0% purity &#8594; &#8594; Powder &#8594; &#8594; CoSO4WC &#8594; &#8594; Manufacturing"
    },
    {
        "id": "COS-0005", "batchNo": "COS-B2405", "city": "Kolkata",
        "manufacturer": "Indian Rare Earths",
        "grade": "CoSO4 99.7% Catalyst", "application": "IOCL refinery Hydrocracking",
        "purity": 99.7, "prop": 20.6, "invest": 620,
        "status": "In Transit", "priority": "High",
        "origin": "IRE Alwaye (KL)", "dest": "IOCL Paradip (OD)",
        "shipDate": "2026-07-19", "transit": 5, "zone": "East",
        "remarks": "CoSO4 99.7% catalyst precursor for IOCL Paradip refinery hydrocracking Co-Mo catalyst &#8594; 20.6% Co &#8594; &#8377;620Cr for 45 tonnes &#8594; India &#8377;4,200Cr CoSO4 catalyst &#8594; IOCL 3 refineries &#8594; 99.7% purity &#8594; &#8594; Solution &#8594; &#8594; CoSO4Cat &#8594; &#8594; Refining"
    },
    {
        "id": "COS-0006", "batchNo": "COS-B2406", "city": "Coimbatore",
        "manufacturer": "BHEL R&amp;D",
        "grade": "CoSO4 99% Magnetic", "application": "BHEL 800MW GT Magnetic Sensor",
        "purity": 99.0, "prop": 20.3, "invest": 700,
        "status": "Delivered", "priority": "Critical",
        "origin": "BHEL Bhopal (MP)", "dest": "BHEL Hyderabad (TG)",
        "shipDate": "2026-07-20", "transit": 1, "zone": "South",
        "remarks": "CoSO4 99% magnetic-grade for BHEL 800MW gas turbine magnetic speed sensor coil &#8594; 20.3% Co &#8594; &#8377;700Cr for 55 tonnes &#8594; India &#8377;5,000Cr CoSO4 power &#8594; BHEL 20 GTs &#8594; 99.0% purity &#8594; &#8594; Crystal &#8594; &#8594; CoSO4Mag &#8594; &#8594; Power"
    },
    {
        "id": "COS-0007", "batchNo": "COS-B2407", "city": "Pune",
        "manufacturer": "Mahindra Steel",
        "grade": "CoSO4 98% EV Battery", "application": "Mahindra XUV400 NCM Cell",
        "purity": 98.0, "prop": 20.1, "invest": 440,
        "status": "Delivered", "priority": "Medium",
        "origin": "Mahindra Nashik (MH)", "dest": "Mahindra Pune (MH)",
        "shipDate": "2026-07-21", "transit": 2, "zone": "West",
        "remarks": "CoSO4 98% EV-grade for Mahindra XUV400 NCM lithium-ion cathode cobalt source &#8594; 20.1% Co &#8594; &#8377;440Cr for 60 tonnes &#8594; India &#8377;3,000Cr CoSO4 EV &#8594; Mahindra 50K batteries &#8594; 98.0% purity &#8594; &#8594; Solution &#8594; &#8594; CoSO4EV &#8594; &#8594; Automotive"
    },
    {
        "id": "COS-0008", "batchNo": "COS-B2408", "city": "Jaipur",
        "manufacturer": "Rajasthan Chemicals",
        "grade": "CoSO4 96% Electroplating", "application": "Jindal Stainless Steel Plating",
        "purity": 96.0, "prop": 19.5, "invest": 320,
        "status": "Delivered", "priority": "Low",
        "origin": "Rajasthan Chemicals Jodhpur (RJ)", "dest": "Jindal Hisar (HR)",
        "shipDate": "2026-07-22", "transit": 3, "zone": "West",
        "remarks": "CoSO4 96% electroplating-grade for Jindal stainless steel decorative cobalt plating &#8594; 19.5% Co &#8594; &#8377;320Cr for 80 tonnes &#8594; India &#8377;2,200Cr CoSO4 plating &#8594; Jindal 500K sheets &#8594; 96.0% purity &#8594; &#8594; Solution &#8594; &#8594; CoSO4Plate &#8594; &#8594; Steel"
    },
    {
        "id": "COS-0009", "batchNo": "COS-B2409", "city": "Guwahati",
        "manufacturer": "Assam Chemicals",
        "grade": "CoSO4 95% Agriculture", "application": "IFFCO Cobalt Micronutrient",
        "purity": 95.0, "prop": 19.0, "invest": 260,
        "status": "In Transit", "priority": "Low",
        "origin": "Assam Chemicals Tezpur (AS)", "dest": "IFFCO Paradeep (OD)",
        "shipDate": "2026-07-23", "transit": 4, "zone": "East",
        "remarks": "CoSO4 95% agricultural-grade for IFFCO cobalt micronutrient fertilizer for legume crops &#8594; 19% Co &#8594; &#8377;260Cr for 100 tonnes &#8594; India &#8377;1,800Cr CoSO4 agri &#8594; IFFCO 5M farmers &#8594; 95.0% purity &#8594; &#8594; Granule &#8594; &#8594; CoSO4Agri &#8594; &#8594; Agriculture"
    },
    {
        "id": "COS-0010", "batchNo": "COS-B2410", "city": "Ahmedabad",
        "manufacturer": "Gujarat Chemicals",
        "grade": "CoSO4 99.8% Nuclear", "application": "IGCAR PFBR Control Rod",
        "purity": 99.8, "prop": 20.7, "invest": 920,
        "status": "Delivered", "priority": "Critical",
        "origin": "Gujarat Chemicals Ahmedabad (GJ)", "dest": "IGCAR Kalpakkam (TN)",
        "shipDate": "2026-07-24", "transit": 5, "zone": "West",
        "remarks": "CoSO4 99.8% nuclear-grade for IGCAR Prototype Fast Breeder Reactor Co-based alloy control rod precursor &#8594; 20.7% Co &#8594; &#8377;920Cr for 35 tonnes &#8594; India &#8377;7,600Cr CoSO4 nuclear &#8594; IGCAR 2 reactors &#8594; 99.8% purity &#8594; &#8594; Crystal &#8594; &#8594; CoSO4Nuc &#8594; &#8594; Nuclear"
    },
    {
        "id": "COS-0011", "batchNo": "COS-B2411", "city": "Lucknow",
        "manufacturer": "UP Chemicals",
        "grade": "CoSO4 97% Dyes", "application": "Arvind Textile Cobalt Dye",
        "purity": 97.0, "prop": 20.0, "invest": 380,
        "status": "Delivered", "priority": "Medium",
        "origin": "UP Chemicals Kanpur (UP)", "dest": "Arvind Ahmedabad (GJ)",
        "shipDate": "2026-07-25", "transit": 1, "zone": "North",
        "remarks": "CoSO4 97% dye-grade for Arvind textile cobalt alumina blue dye precursor &#8594; 20% Co &#8594; &#8377;380Cr for 60 tonnes &#8594; India &#8377;2,600Cr CoSO4 dye &#8594; Arvind 10M metres &#8594; 97.0% purity &#8594; &#8594; Powder &#8594; &#8594; CoSO4Dye &#8594; &#8594; Textile"
    },
    {
        "id": "COS-0012", "batchNo": "COS-B2412", "city": "Visakhapatnam",
        "manufacturer": "Vizag Chemicals",
        "grade": "CoSO4 99% Submarine", "application": "GRSE Project 75I Battery Cooling",
        "purity": 99.0, "prop": 20.3, "invest": 940,
        "status": "Delayed", "priority": "Critical",
        "origin": "Vizag Chemicals Visakhapatnam (AP)", "dest": "GRSE Kolkata (WB)",
        "shipDate": "2026-07-26", "transit": 2, "zone": "East",
        "remarks": "CoSO4 99% submarine-grade for GRSE Project 75I submarine battery cooling Co-based magnetic fluid &#8597; 20.3% Co &#8597; &#8377;940Cr for 30 tonnes &#8597; India &#8377;7,800Cr CoSO4 submarine &#8597; GRSE 6 submarines &#8597; 99.0% purity &#8597; &#8594; Fluid &#8597; &#8594; CoSO4Sub &#8597; &#8594; Naval"
    },
    {
        "id": "COS-0013", "batchNo": "COS-B2413", "city": "Bhopal",
        "manufacturer": "DRDO TBRL",
        "grade": "CoSO4 99.5% Missile", "application": "DRDO Nirbhay Cruise Engine",
        "purity": 99.5, "prop": 20.6, "invest": 860,
        "status": "In Transit", "priority": "Critical",
        "origin": "DRDO Chandipur (OD)", "dest": "BHEL Hyderabad (TG)",
        "shipDate": "2026-07-27", "transit": 3, "zone": "Central",
        "remarks": "CoSO4 99.5% missile-grade for DRDO Nirbhay cruise missile turbofan engine Co superalloy &#8594; 20.6% Co &#8594; &#8377;860Cr for 40 tonnes &#8594; India &#8377;6,200Cr CoSO4 missile &#8594; DRDO 100 missiles &#8594; 99.5% purity &#8594; &#8594; Salt &#8594; &#8594; CoSO4Msl &#8594; &#8594; Defense"
    },
    {
        "id": "COS-0014", "batchNo": "COS-B2414", "city": "Rourkela",
        "manufacturer": "SAIL Chemicals",
        "grade": "CoSO4 94% General", "application": "SAIL Corrosion Inhibitor",
        "purity": 94.0, "prop": 18.5, "invest": 280,
        "status": "Delivered", "priority": "Low",
        "origin": "SAIL Rourkela (OD)", "dest": "SAIL Bhilai (CG)",
        "shipDate": "2026-07-28", "transit": 4, "zone": "East",
        "remarks": "CoSO4 94% general-grade for SAIL steel pipe internal cobalt corrosion inhibitor coating &#8594; 18.5% Co &#8594; &#8377;280Cr for 120 tonnes &#8594; India &#8377;2,000Cr CoSO4 corrosion &#8594; SAIL 1M pipes &#8594; 94.0% purity &#8594; &#8594; Solution &#8594; &#8594; CoSO4Gen &#8594; &#8594; Steel"
    },
]

cs_insights_left = [
    {"title": "Battery &amp; Energy Storage", "body": "Exide Li-Ion cathode &#8594; Mahindra NCM cell &#8594; &#8377;1,320Cr combined &#8594; EV battery critical mineral"},
    {"title": "Defense &amp; Naval Programme", "body": "BEL Tejas turbine &#8594; DRDO Nirbhay engine &#8594; GRSE submarine battery &#8594; &#8377;2,620Cr combined &#8594; strategic assets"},
    {"title": "Nuclear &amp; Power", "body": "IGCAR PFBR control rod &#8594; BHEL GT sensor &#8594; &#8377;1,620Cr combined &#8594; critical infrastructure"},
    {"title": "Monsoon Disruption Alert", "body": "COS-B2412 GRSE Project 75I submarine battery cooling delayed &#8594; monsoon Visakhapatnam &#8594; naval programme at risk"},
]
cs_insights_right = [
    {"title": "Total Portfolio: &#8377;8,760 Cr", "body": "Across 14 CoSO4 grades spanning battery, aerospace, pigment, hardmetal, catalyst, plating, agriculture, dye, nuclear, naval, missile sectors &#8594; avg purity 98.16%"},
    {"title": "Critical Priority: 7 Records", "body": "Exide battery &#8594; BEL Tejas &#8594; BHEL GT &#8594; IGCAR nuclear &#8594; GRSE submarine &#8594; DRDO Nirbhay &#8594; IOCL catalyst"},
    {"title": "Top Manufacturers", "body": "MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; IRE lead strategic &#8594; Indian Rare Earths &#8594; Gujarat Chemicals drive commercial"},
    {"title": "Import Dependency Risk", "body": "Cobalt 90% imported from DRC/Congo &#8594; China controls 80% refining &#8594; Atmanirbhar cobalt critical &#8594; recycling key to supply security"},
]


# Generate both modules
rc_code = gen_module(
    name="refractory-ceramic",
    title="Refractory Ceramic Logistics",
    icon="FlameKindling",
    hex_color="#ea580c",
    tailwind_prefix="orange",
    interface_field="grade",
    unit_prop_label="Density (kg/m3)",
    unit_prop_key="specProp",
    records_data=rc_records,
    insights_left=rc_insights_left,
    insights_right=rc_insights_right,
)

cs_code = gen_module(
    name="cobalt-sulphate",
    title="Cobalt Sulphate Logistics",
    icon="Droplets",
    hex_color="#0284c7",
    tailwind_prefix="sky",
    interface_field="grade",
    unit_prop_label="Co Content (%)",
    unit_prop_key="specProp",
    records_data=cs_records,
    insights_left=cs_insights_left,
    insights_right=cs_insights_right,
)

# Write both files
with open(MODULES_DIR + "/refractory-ceramic-logistics-view.tsx", "w") as f:
    f.write(rc_code)
print(f"Written refractory-ceramic: {len(rc_code.splitlines())} lines")

with open(MODULES_DIR + "/cobalt-sulphate-logistics-view.tsx", "w") as f:
    f.write(cs_code)
print(f"Written cobalt-sulphate: {len(cs_code.splitlines())} lines")

# Scan for malformed HTML entities
import re as re_mod
for mod in ["refractory-ceramic", "cobalt-sulphate"]:
    path = MODULES_DIR + "/" + mod + "-logistics-view.tsx"
    with open(path) as f:
        content = f.read()
    entities = re_mod.findall(r"&#(\d+);", content)
    malformed = [e for e in entities if int(e) > 9999]
    print(f"{mod}: {len(entities)} HTML entities, {len(malformed)} malformed")
    if malformed:
        print(f"  MALFORMED: {malformed}")
