#!/usr/bin/env python3
"""R424 Generator — Manganese Silicon Logistics + Manganese Sulphide Logistics"""

import re

MODULES_DIR = "/home/z/my-project/src/components/modules"


def esc(text):
    """Escape for safe embedding in JS single-quoted string."""
    return text.replace("\\", "\\\\").replace("'", "\\'")


def esc_html(text):
    """Escape HTML entities for JSX: & -> &amp;, > -> &#8594;, etc."""
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
            + ", siMnContent: " + str(r["prop"])
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


def gen_module(name, title, icon, hex_color, tailwind_prefix, interface_field, unit_prop_label, unit_prop_key, records_data, insights_left, insights_right, total_invest, mfr_summary, top_app_summary, avg_purity, prop_range_summary, sector_summary):
    records_js = gen_records(records_data)

    # Build insights cards (left column)
    insight_left_cards = []
    for ins in insights_left:
        insight_left_cards.append(
            '            <div className="p-3 rounded-lg border-l-4 border-l-'
            + tailwind_prefix
            + '-500 bg-'
            + tailwind_prefix
            + '-50/50"><div className="font-medium">'
            + ins["title"]
            + '</div><div className="text-xs text-muted-foreground mt-1">'
            + ins["body"] + '</div></div>'
        )
    insights_left_html = "\n".join(insight_left_cards)

    # Build insights cards (right column)
    insight_right_cards = []
    for ins in insights_right:
        insight_right_cards.append(
            '            <div className="p-3 rounded-lg border-l-4 border-l-'
            + tailwind_prefix
            + '-500 bg-'
            + tailwind_prefix
            + '-50/50"><div className="font-medium">'
            + ins["title"]
            + '</div><div className="text-xs text-muted-foreground mt-1">'
            + ins["body"] + '</div></div>'
        )
    insights_right_html = "\n".join(insight_right_cards)

    component_name = "".join(w.capitalize() for w in name.split("-")) + "LogisticsView"

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

const ''' + name.replace("-", "") + '''Records: ''' + component_name.replace("LogisticsView", "Record") + '''[] = [
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
    return ''' + name.replace("-", "") + '''Records.filter((r) => {
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
    ''' + name.replace("-", "") + '''Records.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = ''' + name.replace("-", "") + '''Records.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = ''' + name.replace("-", "") + '''Records.reduce((s: number, r) => s + r.purityPercent, 0) / ''' + name.replace("-", "") + '''Records.length;
    const delayed = ''' + name.replace("-", "") + '''Records.filter((r) => r.status === 'Delayed').length;
    const critical = ''' + name.replace("-", "") + '''Records.filter((r) => r.priority === 'Critical').length;
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
      <PageHeader title="''' + title + '''" description="Indian ''' + title.lower() + ''' supply chain tracking across 14 grades spanning steelmaking, foundry, defense, automotive, aerospace and infrastructure sectors" />
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
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / ''' + name.replace("-", "") + '''Records.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = ''' + name.replace("-", "") + '''Records.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {''' + name.replace("-", "") + '''Records.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.''' + interface_field + '''}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {''' + name.replace("-", "") + '''Records.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; ''' + name.replace("-", "") + '''Records.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = ''' + name.replace("-", "") + '''Records.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; ''' + name.replace("-", "") + '''Records.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; ''' + name.replace("-", "") + '''Records.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / ''' + name.replace("-", "") + '''Records.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
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
# MODULE A: Manganese Silicon Logistics (MnSi)
# ================================================================
ms_records = [
    {
        "id": "MSI-0001", "batchNo": "MSI-B2401", "city": "Mumbai",
        "manufacturer": "MIDHANI",
        "grade": "FeMnSi 65/15 HC", "application": "SAIL Bhilai BOF Deoxidizer",
        "purity": 99.1, "prop": 15.2, "invest": 820,
        "status": "Delivered", "priority": "Critical",
        "origin": "MIDHANI Hyderabad (TG)", "dest": "SAIL Bhilai (CG)",
        "shipDate": "2026-07-15", "transit": 1, "zone": "West",
        "remarks": "High-carbon FeMnSi 65/15 for SAIL Bhilai basic oxygen furnace deoxidation &#8594; 15.2% Si &#8594; &#8377;820Cr for 180 tonnes &#8594; India &#8377;5,400Cr MnSi deoxidizer &#8594; SAIL 8 furnaces &#8594; 99.1% purity &#8594; &#8594; Lumps &#8594; &#8594; FeMnSiHC &#8594; &#8594; Steel"
    },
    {
        "id": "MSI-0002", "batchNo": "MSI-B2402", "city": "Bengaluru",
        "manufacturer": "DRDO DMRL",
        "grade": "FeMnSi 68/18 LC", "application": "BEL LCA Tejas Mk2 Undercarriage Forging",
        "purity": 98.8, "prop": 18.0, "invest": 740,
        "status": "In Transit", "priority": "Critical",
        "origin": "DRDO Hyderabad (TG)", "dest": "BEL Bengaluru (KA)",
        "shipDate": "2026-07-16", "transit": 2, "zone": "South",
        "remarks": "Low-carbon FeMnSi 68/18 for BEL Tejas Mk2 main landing gear forging alloy &#8594; 18% Si &#8594; &#8377;740Cr for 120 tonnes &#8594; India &#8377;5,200Cr MnSi aerospace &#8594; BEL 40 aircraft &#8594; 98.8% purity &#8594; &#8594; Billet &#8594; &#8594; FeMnSiLC &#8594; &#8594; Defense"
    },
    {
        "id": "MSI-0003", "batchNo": "MSI-B2403", "city": "Chennai",
        "manufacturer": "Tata Steel",
        "grade": "MnSi 75/65 Standard", "application": "JSW Steel Vijayanagar EAF Desulphur",
        "purity": 99.3, "prop": 65.0, "invest": 960,
        "status": "Delivered", "priority": "Critical",
        "origin": "Tata Steel Jamshedpur (JH)", "dest": "JSW Vijayanagar (KA)",
        "shipDate": "2026-07-17", "transit": 3, "zone": "South",
        "remarks": "Standard MnSi 75/65 for JSW Vijayanagar electric arc furnace desulphurization alloy &#8594; 65% Mn &#8594; &#8377;960Cr for 220 tonnes &#8594; India &#8377;7,800Cr MnSi EAF &#8594; JSW 12 furnaces &#8594; 99.3% purity &#8594; &#8594; Briquette &#8594; &#8594; MnSi75 &#8594; &#8594; Steel"
    },
    {
        "id": "MSI-0004", "batchNo": "MSI-B2404", "city": "Hyderabad",
        "manufacturer": "Bharat Forge",
        "grade": "FeMnSi 60/14 Auto", "application": "Bharat Forge Crankshaft Steel",
        "purity": 98.5, "prop": 14.0, "invest": 480,
        "status": "Delivered", "priority": "High",
        "origin": "Bharat Forge Pune (MH)", "dest": "Bharat Forge Baramati (MH)",
        "shipDate": "2026-07-18", "transit": 4, "zone": "West",
        "remarks": "FeMnSi 60/14 automotive-grade for Bharat Forge crankshaft silicon-manganese steel &#8594; 14% Si &#8594; &#8377;480Cr for 200 tonnes &#8594; India &#8377;3,200Cr MnSi auto &#8594; Bharat Forge 2M crankshafts &#8594; 98.5% purity &#8594; &#8594; Ingot &#8594; &#8594; FeMnSiAuto &#8594; &#8594; Automotive"
    },
    {
        "id": "MSI-0005", "batchNo": "MSI-B2405", "city": "Kolkata",
        "manufacturer": "Shyam Ferro Alloys",
        "grade": "MnSi 65/17 Foundry", "application": "L&amp;T Warship Propeller Casting",
        "purity": 98.2, "prop": 17.0, "invest": 680,
        "status": "In Transit", "priority": "High",
        "origin": "Shyam Ferro Raipur (CG)", "dest": "L&amp;T Kattupalli (TN)",
        "shipDate": "2026-07-19", "transit": 5, "zone": "East",
        "remarks": "MnSi 65/17 foundry-grade for L&amp;T warship propeller manganese-silicon steel casting &#8594; 17% Si &#8594; &#8377;680Cr for 160 tonnes &#8594; India &#8377;4,600Cr MnSi naval &#8594; L&amp;T 30 propellers &#8594; 98.2% purity &#8594; &#8594; Casting &#8594; &#8594; MnSi65 &#8594; &#8594; Naval"
    },
    {
        "id": "MSI-0006", "batchNo": "MSI-B2406", "city": "Coimbatore",
        "manufacturer": "BHEL R&amp;D",
        "grade": "FeMnSi 70/16 BHEL", "application": "BHEL 800MW GT Blade Steel",
        "purity": 99.0, "prop": 16.0, "invest": 720,
        "status": "Delivered", "priority": "Critical",
        "origin": "BHEL Bhopal (MP)", "dest": "BHEL Hyderabad (TG)",
        "shipDate": "2026-07-20", "transit": 1, "zone": "South",
        "remarks": "FeMnSi 70/16 power-grade for BHEL 800MW gas turbine blade Mn-Si steel &#8594; 16% Si &#8594; &#8377;720Cr for 95 tonnes &#8594; India &#8377;5,000Cr MnSi power &#8594; BHEL 20 GTs &#8594; 99.0% purity &#8594; &#8594; Bar &#8594; &#8594; FeMnSiBHEL &#8594; &#8594; Power"
    },
    {
        "id": "MSI-0007", "batchNo": "MSI-B2407", "city": "Pune",
        "manufacturer": "Mahindra Steel",
        "grade": "FeMnSi 62/13 EV", "application": "Mahindra XUV400 EV Frame",
        "purity": 98.7, "prop": 13.0, "invest": 420,
        "status": "Delivered", "priority": "Medium",
        "origin": "Mahindra Nashik (MH)", "dest": "Mahindra Pune (MH)",
        "shipDate": "2026-07-21", "transit": 2, "zone": "West",
        "remarks": "FeMnSi 62/13 EV-grade for Mahindra XUV400 electric vehicle chassis frame steel &#8594; 13% Si &#8594; &#8377;420Cr for 140 tonnes &#8594; India &#8377;2,800Cr MnSi EV &#8594; Mahindra 50K vehicles &#8594; 98.7% purity &#8594; &#8594; Coil &#8594; &#8594; FeMnSiEV &#8594; &#8594; Automotive"
    },
    {
        "id": "MSI-0008", "batchNo": "MSI-B2408", "city": "Jaipur",
        "manufacturer": "Rajasthan Ferro Alloys",
        "grade": "MnSi 70/20 Rail", "application": "Indian Railways RCF Rail Wheel",
        "purity": 97.8, "prop": 20.0, "invest": 560,
        "status": "Delivered", "priority": "High",
        "origin": "Rajasthan Ferro Alloys Udaipur (RJ)", "dest": "RCF Kapurthala (PB)",
        "shipDate": "2026-07-22", "transit": 3, "zone": "West",
        "remarks": "MnSi 70/20 rail-grade for Indian Railways wheel factory rail wheel Mn-Si steel &#8594; 20% Si &#8594; &#8377;560Cr for 180 tonnes &#8594; India &#8377;3,800Cr MnSi rail &#8594; IR 200K wheels &#8594; 97.8% purity &#8594; &#8594; Bloom &#8594; &#8594; MnSi70 &#8594; &#8594; Rail"
    },
    {
        "id": "MSI-0009", "batchNo": "MSI-B2409", "city": "Guwahati",
        "manufacturer": "Assam Ferro Alloys",
        "grade": "FeMnSi 65/15 General", "application": "Jio 5G Tower Girder",
        "purity": 98.4, "prop": 15.0, "invest": 380,
        "status": "In Transit", "priority": "Medium",
        "origin": "Assam Ferro Tezpur (AS)", "dest": "Jio Mumbai (MH)",
        "shipDate": "2026-07-23", "transit": 4, "zone": "East",
        "remarks": "FeMnSi 65/15 structural-grade for Reliance Jio 5G tower girder Mn-Si structural steel &#8594; 15% Si &#8594; &#8377;380Cr for 120 tonnes &#8594; India &#8377;2,400Cr MnSi telecom &#8594; Jio 100K towers &#8594; 98.4% purity &#8594; &#8594; Section &#8594; &#8594; FeMnSiGen &#8594; &#8594; Telecom"
    },
    {
        "id": "MSI-0010", "batchNo": "MSI-B2410", "city": "Ahmedabad",
        "manufacturer": "Gujarat Ferro Alloys",
        "grade": "FeMnSi 72/22 Nuclear", "application": "IGCAR PFBR Pressure Vessel",
        "purity": 99.6, "prop": 22.0, "invest": 880,
        "status": "Delivered", "priority": "Critical",
        "origin": "Gujarat Ferro Ahmedabad (GJ)", "dest": "IGCAR Kalpakkam (TN)",
        "shipDate": "2026-07-24", "transit": 5, "zone": "West",
        "remarks": "FeMnSi 72/22 nuclear-grade for IGCAR Prototype Fast Breeder Reactor pressure vessel Mn-Si steel &#8594; 22% Si &#8594; &#8377;880Cr for 55 tonnes &#8594; India &#8377;7,200Cr MnSi nuclear &#8594; IGCAR 2 reactors &#8594; 99.6% purity &#8594; &#8594; Plate &#8594; &#8594; FeMnSiNuc &#8594; &#8594; Nuclear"
    },
    {
        "id": "MSI-0011", "batchNo": "MSI-B2411", "city": "Lucknow",
        "manufacturer": "UP Ferro Alloys",
        "grade": "FeMnSi 60/12 Pipeline", "application": "Adani Gas Pipeline Weld",
        "purity": 98.0, "prop": 12.0, "invest": 460,
        "status": "Delivered", "priority": "Medium",
        "origin": "UP Ferro Kanpur (UP)", "dest": "Adani Mundra (GJ)",
        "shipDate": "2026-07-25", "transit": 1, "zone": "North",
        "remarks": "FeMnSi 60/12 pipeline-grade for Adani natural gas pipeline welding Mn-Si steel &#8594; 12% Si &#8594; &#8377;460Cr for 130 tonnes &#8594; India &#8377;3,000Cr MnSi pipeline &#8594; Adani 2,000 km &#8594; 98.0% purity &#8594; &#8594; Wire &#8594; &#8594; FeMnSiPipe &#8594; &#8594; Oil &amp; Gas"
    },
    {
        "id": "MSI-0012", "batchNo": "MSI-B2412", "city": "Visakhapatnam",
        "manufacturer": "Vizag Ferro Alloys",
        "grade": "FeMnSi 68/16 Submarine", "application": "GRSE Project 75I Submarine Hull",
        "purity": 99.4, "prop": 16.0, "invest": 940,
        "status": "Delayed", "priority": "Critical",
        "origin": "Vizag Ferro Visakhapatnam (AP)", "dest": "GRSE Kolkata (WB)",
        "shipDate": "2026-07-26", "transit": 2, "zone": "East",
        "remarks": "FeMnSi 68/16 submarine-grade for GRSE Project 75I submarine hull special Mn-Si steel &#8594; 16% Si &#8594; &#8377;940Cr for 70 tonnes &#8597; India &#8377;7,600Cr MnSi submarine &#8594; GRSE 6 submarines &#8594; 99.4% purity &#8597; &#8594; Slab &#8594; &#8594; FeMnSiSub &#8594; &#8594; Naval"
    },
    {
        "id": "MSI-0013", "batchNo": "MSI-B2413", "city": "Bhopal",
        "manufacturer": "DRDO TBRL",
        "grade": "FeMnSi 65/15 Missile", "application": "DRDO BrahMos Missile Airframe",
        "purity": 99.2, "prop": 15.0, "invest": 860,
        "status": "In Transit", "priority": "Critical",
        "origin": "DRDO Chandipur (OD)", "dest": "BHEL Hyderabad (TG)",
        "shipDate": "2026-07-27", "transit": 3, "zone": "Central",
        "remarks": "FeMnSi 65/15 missile-grade for DRDO BrahMos Mk2 missile airframe Mn-Si steel &#8594; 15% Si &#8594; &#8377;860Cr for 80 tonnes &#8594; India &#8377;6,400Cr MnSi missile &#8594; DRDO 200 missiles &#8594; 99.2% purity &#8594; &#8594; Sheet &#8594; &#8594; FeMnSiMsl &#8594; &#8594; Defense"
    },
    {
        "id": "MSI-0014", "batchNo": "MSI-B2414", "city": "Rourkela",
        "manufacturer": "SAIL Ferro Alloys",
        "grade": "FeMnSi 58/11 Rebar", "application": "Tata Steel Tiscon Rebar",
        "purity": 97.5, "prop": 11.0, "invest": 340,
        "status": "Delivered", "priority": "Low",
        "origin": "SAIL Rourkela (OD)", "dest": "Tata Steel Jamshedpur (JH)",
        "shipDate": "2026-07-28", "transit": 4, "zone": "East",
        "remarks": "FeMnSi 58/11 rebar-grade for Tata Tiscon TMT rebar Mn-Si reinforcement steel &#8594; 11% Si &#8594; &#8377;340Cr for 250 tonnes &#8594; India &#8377;2,200Cr MnSi rebar &#8594; Tata 1M tonnes &#8594; 97.5% purity &#8594; &#8594; Rod &#8594; &#8594; FeMnSiRebar &#8594; &#8594; Construction"
    },
]

ms_insights_left = [
    {"title": "Steelmaking Dominance", "body": "SAIL BOF deoxidizer &#8594; JSW EAF desulphurization &#8594; Tata Tiscon rebar &#8594; &#8377;2,120Cr combined &#8594; highest volume segment"},
    {"title": "Defense &amp; Naval Programme", "body": "BEL Tejas undercarriage &#8594; GRSE submarine hull &#8594; DRDO BrahMos airframe &#8594; &#8377;2,540Cr combined &#8594; strategic national assets"},
    {"title": "Power &amp; Nuclear", "body": "BHEL 800MW GT blade &#8594; IGCAR PFBR pressure vessel &#8594; &#8377;1,600Cr combined &#8594; critical infrastructure backbone"},
    {"title": "Monsoon Disruption Alert", "body": "MSI-B2412 GRSE Project 75I submarine hull delayed &#8594; monsoon Visakhapatnam port congestion &#8594; naval programme timeline at risk"},
]
ms_insights_right = [
    {"title": "Total Portfolio: &#8377;9,200 Cr", "body": "Across 14 Mn-Si grades spanning steel, defense, nuclear, naval, rail, telecom, EV, pipeline and construction &#8594; avg purity 98.83%"},
    {"title": "Critical Priority: 7 Records", "body": "SAIL BOF &#8594; BEL Tejas &#8594; JSW EAF &#8594; BHEL GT &#8594; IGCAR nuclear &#8594; GRSE submarine &#8594; DRDO missile"},
    {"title": "Top Manufacturers", "body": "MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Bharat Forge lead strategic demand &#8594; Shyam Ferro &#8594; Gujarat Ferro drive commercial"},
    {"title": "Regional Concentration", "body": "South zone leads with Bengaluru &#8594; Chennai &#8594; Coimbatore &#8594; West zone Pune &#8594; Ahmedabad &#8594; East zone emerging Visakhapatnam"},
]

ms_code = gen_module(
    name="manganese-silicon",
    title="Manganese Silicon Logistics",
    icon="MountainSnow",
    hex_color="#d97706",
    tailwind_prefix="amber",
    interface_field="grade",
    unit_prop_label="Si Content",
    unit_prop_key="siMnContent",
    records_data=ms_records,
    insights_left=ms_insights_left,
    insights_right=ms_insights_right,
    total_invest=9200,
    mfr_summary="MIDHANI, DRDO, BHEL, Tata Steel, Bharat Forge",
    top_app_summary="SAIL BOF, BEL Tejas, JSW EAF, GRSE submarine",
    avg_purity=98.83,
    prop_range_summary="11-22% Si",
    sector_summary="steel, defense, nuclear, power, automotive, rail, telecom, EV, pipeline, construction",
)


# ================================================================
# MODULE B: Manganese Sulphide Logistics (MnS)
# ================================================================
mns_records = [
    {
        "id": "MNS-0001", "batchNo": "MNS-B2401", "city": "Mumbai",
        "manufacturer": "MIDHANI",
        "grade": "MnS 99.5% Pharmaceutical", "application": "Sun Pharma Vitamin Supplement",
        "purity": 99.5, "prop": 56.0, "invest": 840,
        "status": "Delivered", "priority": "Critical",
        "origin": "MIDHANI Hyderabad (TG)", "dest": "Sun Pharma Mumbai (MH)",
        "shipDate": "2026-07-15", "transit": 1, "zone": "West",
        "remarks": "MnS 99.5% pharmaceutical-grade for Sun Pharma manganese dietary supplement &#8594; 56% Mn &#8594; &#8377;840Cr for 40 tonnes &#8594; India &#8377;5,600Cr MnS pharma &#8594; Sun Pharma 500M doses &#8594; 99.5% purity &#8594; &#8594; Powder &#8594; &#8594; MnSPharma &#8594; &#8594; Pharma"
    },
    {
        "id": "MNS-0002", "batchNo": "MNS-B2402", "city": "Bengaluru",
        "manufacturer": "DRDO DMRL",
        "grade": "MnS 98% Bearing Steel", "application": "BEL LCA Tejas Mk2 Engine Bearing",
        "purity": 98.0, "prop": 52.0, "invest": 760,
        "status": "In Transit", "priority": "Critical",
        "origin": "DRDO Hyderabad (TG)", "dest": "BEL Bengaluru (KA)",
        "shipDate": "2026-07-16", "transit": 2, "zone": "South",
        "remarks": "MnS 98% bearing-grade for BEL Tejas Mk2 F414 engine main bearing inclusion modification &#8594; 52% Mn &#8594; &#8377;760Cr for 85 tonnes &#8594; India &#8377;5,100Cr MnS aerospace &#8594; BEL 40 aircraft &#8594; 98.0% purity &#8594; &#8594; Granule &#8594; &#8594; MnSBearing &#8594; &#8594; Defense"
    },
    {
        "id": "MNS-0003", "batchNo": "MNS-B2403", "city": "Chennai",
        "manufacturer": "Tata Steel",
        "grade": "MnS 97% Machinability", "application": "Bharat Forge Free-Machining Steel",
        "purity": 97.0, "prop": 50.0, "invest": 680,
        "status": "Delivered", "priority": "High",
        "origin": "Tata Steel Jamshedpur (JH)", "dest": "Bharat Forge Pune (MH)",
        "shipDate": "2026-07-17", "transit": 3, "zone": "South",
        "remarks": "MnS 97% machinability-grade for Bharat Forge free-machining steel chip breaker &#8594; 50% Mn &#8594; &#8377;680Cr for 200 tonnes &#8594; India &#8377;4,600Cr MnS machinability &#8594; Bharat Forge 5M forgings &#8594; 97.0% purity &#8594; &#8594; Chip &#8594; &#8594; MnSMach &#8594; &#8594; Automotive"
    },
    {
        "id": "MNS-0004", "batchNo": "MNS-B2404", "city": "Hyderabad",
        "manufacturer": "Godrej Lubricants",
        "grade": "MnS 96% EP Additive", "application": "L&amp;T Naval Gearbox EP Grease",
        "purity": 96.0, "prop": 48.0, "invest": 520,
        "status": "Delivered", "priority": "High",
        "origin": "Godrej Mumbai (MH)", "dest": "L&amp;T Mumbai (MH)",
        "shipDate": "2026-07-18", "transit": 4, "zone": "West",
        "remarks": "MnS 96% extreme-pressure additive for L&amp;T naval gearbox EP solid lubricant &#8594; 48% Mn &#8594; &#8377;520Cr for 60 tonnes &#8594; India &#8377;3,400Cr MnS lubricant &#8594; L&amp;T 30 gearboxes &#8594; 96.0% purity &#8594; &#8594; Powder &#8594; &#8594; MnSEP &#8594; &#8594; Naval"
    },
    {
        "id": "MNS-0005", "batchNo": "MNS-B2405", "city": "Kolkata",
        "manufacturer": "Shyam Chemicals",
        "grade": "MnS 95% Fertilizer", "application": "IFFCO Kharif Season Mn Fertilizer",
        "purity": 95.0, "prop": 46.0, "invest": 360,
        "status": "In Transit", "priority": "Medium",
        "origin": "Shyam Chemicals Kolkata (WB)", "dest": "IFFCO Paradeep (OD)",
        "shipDate": "2026-07-19", "transit": 5, "zone": "East",
        "remarks": "MnS 95% fertilizer-grade for IFFCO kharif season manganese micronutrient fertilizer &#8594; 46% Mn &#8594; &#8377;360Cr for 300 tonnes &#8594; India &#8377;2,400Cr MnS fertilizer &#8594; IFFCO 5M farmers &#8594; 95.0% purity &#8594; &#8594; Granule &#8594; &#8594; MnSFert &#8594; &#8594; Agriculture"
    },
    {
        "id": "MNS-0006", "batchNo": "MNS-B2406", "city": "Coimbatore",
        "manufacturer": "BHEL R&amp;D",
        "grade": "MnS 98% Welding Wire", "application": "BHEL Submerged Arc Welding",
        "purity": 98.0, "prop": 52.0, "invest": 640,
        "status": "Delivered", "priority": "High",
        "origin": "BHEL Bhopal (MP)", "dest": "BHEL Haridwar (UK)",
        "shipDate": "2026-07-20", "transit": 1, "zone": "South",
        "remarks": "MnS 98% welding-grade for BHEL submerged arc welding flux manganese supplement &#8594; 52% Mn &#8594; &#8377;640Cr for 110 tonnes &#8594; India &#8377;4,200Cr MnS welding &#8594; BHEL 40 welders &#8594; 98.0% purity &#8594; &#8594; Wire &#8594; &#8594; MnSWeld &#8594; &#8594; Power"
    },
    {
        "id": "MNS-0007", "batchNo": "MNS-B2407", "city": "Pune",
        "manufacturer": "Mahindra Steel",
        "grade": "MnS 97% Resulphurized", "application": "Mahindra XUV400 EV Gearbox",
        "purity": 97.0, "prop": 50.0, "invest": 440,
        "status": "Delivered", "priority": "Medium",
        "origin": "Mahindra Nashik (MH)", "dest": "Mahindra Pune (MH)",
        "shipDate": "2026-07-21", "transit": 2, "zone": "West",
        "remarks": "MnS 97% resulphurized-grade for Mahindra XUV400 EV gearbox free-machining steel &#8594; 50% Mn &#8594; &#8377;440Cr for 100 tonnes &#8594; India &#8377;2,800Cr MnS EV &#8594; Mahindra 50K gearboxes &#8594; 97.0% purity &#8594; &#8594; Inclusion &#8594; &#8594; MnSResul &#8594; &#8594; Automotive"
    },
    {
        "id": "MNS-0008", "batchNo": "MNS-B2408", "city": "Jaipur",
        "manufacturer": "Rajasthan Chemicals",
        "grade": "MnS 96% Ceramic Glaze", "application": "RAK Ceramics Purple Pigment",
        "purity": 96.0, "prop": 48.0, "invest": 320,
        "status": "Delivered", "priority": "Low",
        "origin": "Rajasthan Chemicals Udaipur (RJ)", "dest": "RAK Ceramics Delhi (DL)",
        "shipDate": "2026-07-22", "transit": 3, "zone": "West",
        "remarks": "MnS 96% ceramic-grade for RAK Ceramics purple manganese sulphide glaze pigment &#8594; 48% Mn &#8594; &#8377;320Cr for 50 tonnes &#8594; India &#8377;2,000Cr MnS ceramic &#8594; RAK 10M sqm &#8594; 96.0% purity &#8594; &#8594; Pigment &#8594; &#8594; MnSCeram &#8594; &#8594; Ceramics"
    },
    {
        "id": "MNS-0009", "batchNo": "MNS-B2409", "city": "Guwahati",
        "manufacturer": "Assam Chemicals",
        "grade": "MnS 94% Batteries", "application": "Exide Industries MnO2 Cell",
        "purity": 94.0, "prop": 44.0, "invest": 480,
        "status": "In Transit", "priority": "Medium",
        "origin": "Assam Chemicals Tezpur (AS)", "dest": "Exide Kolkata (WB)",
        "shipDate": "2026-07-23", "transit": 4, "zone": "East",
        "remarks": "MnS 94% battery-grade for Exide Leclanche dry cell manganese dioxide precursor &#8594; 44% Mn &#8594; &#8377;480Cr for 80 tonnes &#8594; India &#8377;3,200Cr MnS battery &#8594; Exide 100M cells &#8594; 94.0% purity &#8594; &#8594; Powder &#8594; &#8594; MnSBatt &#8594; &#8594; Battery"
    },
    {
        "id": "MNS-0010", "batchNo": "MNS-B2410", "city": "Ahmedabad",
        "manufacturer": "Gujarat Chemicals",
        "grade": "MnS 99% Nuclear Grade", "application": "IGCAR PFBR Control Rod",
        "purity": 99.0, "prop": 54.0, "invest": 900,
        "status": "Delivered", "priority": "Critical",
        "origin": "Gujarat Chemicals Ahmedabad (GJ)", "dest": "IGCAR Kalpakkam (TN)",
        "shipDate": "2026-07-24", "transit": 5, "zone": "West",
        "remarks": "MnS 99% nuclear-grade for IGCAR Prototype Fast Breeder Reactor control rod absorber precursor &#8594; 54% Mn &#8594; &#8377;900Cr for 35 tonnes &#8594; India &#8377;7,400Cr MnS nuclear &#8594; IGCAR 2 reactors &#8594; 99.0% purity &#8594; &#8594; Crystal &#8594; &#8594; MnSNuc &#8594; &#8594; Nuclear"
    },
    {
        "id": "MNS-0011", "batchNo": "MNS-B2411", "city": "Lucknow",
        "manufacturer": "UP Chemicals",
        "grade": "MnS 95% Water Treatment", "application": "NTPC FGD Water Treatment",
        "purity": 95.0, "prop": 46.0, "invest": 380,
        "status": "Delivered", "priority": "Medium",
        "origin": "UP Chemicals Kanpur (UP)", "dest": "NTPC Singrauli (MP)",
        "shipDate": "2026-07-25", "transit": 1, "zone": "North",
        "remarks": "MnS 95% water-treatment grade for NTPC flue gas desulphurization manganese catalyst &#8594; 46% Mn &#8594; &#8377;380Cr for 70 tonnes &#8594; India &#8377;2,600Cr MnS water &#8594; NTPC 20 plants &#8594; 95.0% purity &#8594; &#8594; Pellet &#8594; &#8594; MnSFGD &#8594; &#8594; Power"
    },
    {
        "id": "MNS-0012", "batchNo": "MNS-B2412", "city": "Visakhapatnam",
        "manufacturer": "Vizag Chemicals",
        "grade": "MnS 98% Submarine Steel", "application": "GRSE Project 75I Pressure Hull",
        "purity": 98.0, "prop": 52.0, "invest": 920,
        "status": "Delayed", "priority": "Critical",
        "origin": "Vizag Chemicals Visakhapatnam (AP)", "dest": "GRSE Kolkata (WB)",
        "shipDate": "2026-07-26", "transit": 2, "zone": "East",
        "remarks": "MnS 98% submarine-grade for GRSE Project 75I pressure hull HY-80 steel inclusion control &#8594; 52% Mn &#8597; &#8377;920Cr for 60 tonnes &#8597; India &#8377;7,600Cr MnS submarine &#8597; GRSE 6 submarines &#8597; 98.0% purity &#8597; &#8594; Master &#8594; &#8594; MnSSub &#8597; &#8594; Naval"
    },
    {
        "id": "MNS-0013", "batchNo": "MNS-B2413", "city": "Bhopal",
        "manufacturer": "DRDO TBRL",
        "grade": "MnS 97% Missile Steel", "application": "DRDO Pralay Warhead Casing",
        "purity": 97.0, "prop": 50.0, "invest": 820,
        "status": "In Transit", "priority": "Critical",
        "origin": "DRDO Chandipur (OD)", "dest": "BHEL Hyderabad (TG)",
        "shipDate": "2026-07-27", "transit": 3, "zone": "Central",
        "remarks": "MnS 97% missile-grade for DRDO Pralay tactical ballistic missile warhead casing steel &#8594; 50% Mn &#8594; &#8377;820Cr for 55 tonnes &#8594; India &#8377;5,800Cr MnS missile &#8594; DRDO 150 missiles &#8594; 97.0% purity &#8594; &#8594; Ingot &#8594; &#8594; MnSMsl &#8594; &#8594; Defense"
    },
    {
        "id": "MNS-0014", "batchNo": "MNS-B2414", "city": "Rourkela",
        "manufacturer": "SAIL Chemicals",
        "grade": "MnS 93% General Steel", "application": "SAIL Rail Steel Inclusion Control",
        "purity": 93.0, "prop": 42.0, "invest": 340,
        "status": "Delivered", "priority": "Low",
        "origin": "SAIL Rourkela (OD)", "dest": "SAIL Bhilai (CG)",
        "shipDate": "2026-07-28", "transit": 4, "zone": "East",
        "remarks": "MnS 93% general steel-grade for SAIL rail steel manganese sulphide inclusion modification &#8594; 42% Mn &#8594; &#8377;340Cr for 180 tonnes &#8594; India &#8377;2,200Cr MnS rail &#8594; SAIL 2M tonnes &#8594; 93.0% purity &#8594; &#8594; Powder &#8594; &#8594; MnSGen &#8594; &#8594; Steel"
    },
]

mns_insights_left = [
    {"title": "Pharma &amp; Nuclear Leadership", "body": "Sun Pharma vitamin supplement &#8594; IGCAR PFBR control rod &#8594; &#8377;1,740Cr combined &#8594; highest purity segment"},
    {"title": "Defense &amp; Naval Programme", "body": "BEL Tejas engine bearing &#8594; GRSE submarine hull &#8594; DRDO Pralay warhead &#8594; &#8377;2,500Cr combined &#8594; strategic assets"},
    {"title": "Steel &amp; Manufacturing", "body": "Bharat Forge machinability &#8594; SAIL rail inclusion &#8594; Mahindra EV gearbox &#8594; &#8377;1,460Cr combined &#8594; industrial backbone"},
    {"title": "Monsoon Disruption Alert", "body": "MNS-B2412 GRSE Project 75I pressure hull delayed &#8594; monsoon Visakhapatnam port congestion &#8594; submarine programme at risk"},
]
mns_insights_right = [
    {"title": "Total Portfolio: &#8377;8,780 Cr", "body": "Across 14 MnS grades spanning pharma, defense, nuclear, steel, battery, ceramic, water treatment and lubricant sectors &#8594; avg purity 97.04%"},
    {"title": "Critical Priority: 6 Records", "body": "Sun Pharma &#8594; BEL Tejas &#8594; IGCAR nuclear &#8594; GRSE submarine &#8594; DRDO Pralay &#8594; BHEL welding"},
    {"title": "Top Manufacturers", "body": "MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Sun Pharma lead strategic demand &#8594; Godrej &#8594; Exide drive commercial"},
    {"title": "Purity Spectrum", "body": "Range 93-99.5% purity &#8594; pharma grade highest at 99.5% &#8594; nuclear grade 99% &#8594; general steel 93% &#8594; sector-specific QC critical"},
]

mns_code = gen_module(
    name="manganese-sulphide",
    title="Manganese Sulphide Logistics",
    icon="Pickaxe",
    hex_color="#0d9488",
    tailwind_prefix="teal",
    interface_field="grade",
    unit_prop_label="Mn Content",
    unit_prop_key="siMnContent",
    records_data=mns_records,
    insights_left=mns_insights_left,
    insights_right=mns_insights_right,
    total_invest=8780,
    mfr_summary="MIDHANI, DRDO, BHEL, Tata Steel, Sun Pharma, Godrej",
    top_app_summary="Sun Pharma, BEL Tejas, GRSE submarine, IGCAR nuclear",
    avg_purity=97.04,
    prop_range_summary="42-56% Mn",
    sector_summary="pharma, defense, nuclear, steel, battery, ceramic, water treatment, lubricant, agriculture",
)

# Write both files
with open(MODULES_DIR + "/manganese-silicon-logistics-view.tsx", "w") as f:
    f.write(ms_code)
print(f"Written manganese-silicon: {len(ms_code.splitlines())} lines")

with open(MODULES_DIR + "/manganese-sulphide-logistics-view.tsx", "w") as f:
    f.write(mns_code)
print(f"Written manganese-sulphide: {len(mns_code.splitlines())} lines")

# Scan for malformed HTML entities
for mod in ["manganese-silicon", "manganese-sulphide"]:
    path = MODULES_DIR + "/" + mod + "-logistics-view.tsx"
    with open(path) as f:
        content = f.read()
    entities = re.findall(r"&#(\d+);", content)
    malformed = [e for e in entities if int(e) > 9999]
    print(f"{mod}: {len(entities)} HTML entities, {len(malformed)} malformed")
    if malformed:
        print(f"  MALFORMED: {malformed}")
