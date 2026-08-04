#!/usr/bin/env python3
"""R426 Generator — Aluminium Powder Logistics + Zirconium Fluoride Logistics"""

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
      <PageHeader title="''' + title + '''" description="Indian ''' + title.lower() + ''' supply chain tracking across 14 grades spanning aerospace, defense, additive manufacturing, pyrotechnics, optics, nuclear and automotive sectors" />
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
# MODULE A: Aluminium Powder Logistics
# ================================================================
ap_records = [
    {"id": "ALP-0001", "batchNo": "ALP-B2401", "city": "Mumbai", "manufacturer": "MIDHANI", "grade": "Al 99.7% Atomized Aerospace", "application": "HAL Tejas Mk2 Wing Panel SLM", "purity": 99.7, "prop": 25, "invest": 860, "status": "Delivered", "priority": "Critical", "origin": "MIDHANI Hyderabad (TG)", "dest": "HAL Bengaluru (KA)", "shipDate": "2026-07-15", "transit": 1, "zone": "West", "remarks": "Al 99.7% atomized powder for HAL Tejas Mk2 wing panel selective laser melting additive manufacturing &#8594; 25 micron &#8594; &#8377;860Cr for 30 tonnes &#8594; India &#8377;6,200Cr Al AM &#8594; HAL 40 aircraft &#8594; 99.7% purity &#8594; &#8594; Powder &#8594; &#8594; AlAtom &#8594; &#8594; Aerospace"},
    {"id": "ALP-0002", "batchNo": "ALP-B2402", "city": "Bengaluru", "manufacturer": "DRDO DMRL", "grade": "Al 99.5% Gas Atomized Missile", "application": "DRDO BrahMos Mk2 Fuel Air Explosive", "purity": 99.5, "prop": 40, "invest": 780, "status": "In Transit", "priority": "Critical", "origin": "DRDO Hyderabad (TG)", "dest": "DRDO Chandipur (OD)", "shipDate": "2026-07-16", "transit": 2, "zone": "South", "remarks": "Al 99.5% gas atomized flake powder for DRDO BrahMos Mk2 thermobaric fuel-air explosive enhancer &#8594; 40 micron &#8594; &#8377;780Cr for 45 tonnes &#8594; India &#8377;5,400Cr Al military &#8594; DRDO 200 missiles &#8594; 99.5% purity &#8594; &#8594; Flake &#8594; &#8594; AlMil &#8594; &#8594; Defense"},
    {"id": "ALP-0003", "batchNo": "ALP-B2403", "city": "Chennai", "manufacturer": "Tata Advanced Materials", "grade": "Al 99.9% Spherical 3D Print", "application": "ISRO PSLV Rocket Engine Bracket", "purity": 99.9, "prop": 15, "invest": 940, "status": "Delivered", "priority": "Critical", "origin": "Tata Adv Mumbai (MH)", "dest": "ISRO Sriharikota (AP)", "shipDate": "2026-07-17", "transit": 3, "zone": "South", "remarks": "Al 99.9% spherical powder for ISRO PSLV rocket engine bracket DMLS additive manufacturing &#8594; 15 micron &#8594; &#8377;940Cr for 25 tonnes &#8594; India &#8377;7,600Cr Al space &#8594; ISRO 12 launches &#8594; 99.9% purity &#8594; &#8594; Spherical &#8594; &#8594; AlSpace &#8594; &#8594; Space"},
    {"id": "ALP-0004", "batchNo": "ALP-B2404", "city": "Hyderabad", "manufacturer": "Bharat Forge", "grade": "Al 99.0% Water Atomized Auto", "application": "Mahindra XUV400 EV Motor Housing", "purity": 99.0, "prop": 50, "invest": 480, "status": "Delivered", "priority": "High", "origin": "Bharat Forge Pune (MH)", "dest": "Mahindra Pune (MH)", "shipDate": "2026-07-18", "transit": 4, "zone": "West", "remarks": "Al 99.0% water atomized powder for Mahindra XUV400 EV motor housing metal injection molding &#8594; 50 micron &#8594; &#8377;480Cr for 80 tonnes &#8594; India &#8377;3,200Cr Al MIM &#8594; Mahindra 50K motors &#8594; 99.0% purity &#8594; &#8594; Irregular &#8594; &#8594; AlMIM &#8594; &#8594; Automotive"},
    {"id": "ALP-0005", "batchNo": "ALP-B2405", "city": "Kolkata", "manufacturer": "Shyam Metalloys", "grade": "Al 98% Pyrotechnic", "application": "Sivakasi Fireworks Festival Grade", "purity": 98.0, "prop": 80, "invest": 320, "status": "In Transit", "priority": "Medium", "origin": "Shyam Metalloys Kolkata (WB)", "dest": "Sivakasi (TN)", "shipDate": "2026-07-19", "transit": 5, "zone": "East", "remarks": "Al 98% flake powder for Sivakasi fireworks pyrotechnic sparkle and flash composition &#8594; 80 micron &#8594; &#8377;320Cr for 120 tonnes &#8594; India &#8377;2,200Cr Al pyro &#8594; Sivakasi 500M crackers &#8594; 98.0% purity &#8594; &#8594; Flake &#8594; &#8594; AlPyro &#8594; &#8594; Pyrotechnic"},
    {"id": "ALP-0006", "batchNo": "ALP-B2406", "city": "Coimbatore", "manufacturer": "BHEL R&D", "grade": "Al 99.6% Plasma Spray", "application": "BHEL 800MW GT Blade Coating", "purity": 99.6, "prop": 30, "invest": 720, "status": "Delivered", "priority": "Critical", "origin": "BHEL Bhopal (MP)", "dest": "BHEL Hyderabad (TG)", "shipDate": "2026-07-20", "transit": 1, "zone": "South", "remarks": "Al 99.6% plasma spray powder for BHEL 800MW gas turbine blade bond coating &#8594; 30 micron &#8594; &#8377;720Cr for 55 tonnes &#8594; India &#8377;5,000Cr Al coating &#8594; BHEL 20 GTs &#8594; 99.6% purity &#8594; &#8594; Spherical &#8594; &#8594; AlCoat &#8594; &#8594; Power"},
    {"id": "ALP-0007", "batchNo": "ALP-B2407", "city": "Pune", "manufacturer": "Indian Aluminium", "grade": "Al 99.5% Extrusion Fine", "application": "Jindal Aluminium Automotive Extrusion", "purity": 99.5, "prop": 45, "invest": 440, "status": "Delivered", "priority": "Medium", "origin": "Indian Al Mumbai (MH)", "dest": "Jindal Hisar (HR)", "shipDate": "2026-07-21", "transit": 2, "zone": "West", "remarks": "Al 99.5% fine powder for Jindal Aluminium automotive extrusion billet degassing agent &#8594; 45 micron &#8594; &#8377;440Cr for 60 tonnes &#8594; India &#8377;3,000Cr Al extrusion &#8594; Jindal 100K billets &#8594; 99.5% purity &#8594; &#8594; Granular &#8594; &#8594; AlExt &#8594; &#8594; Manufacturing"},
    {"id": "ALP-0008", "batchNo": "ALP-B2408", "city": "Jaipur", "manufacturer": "Rajasthan Powder Metals", "grade": "Al 99.2% Sintered Bearing", "application": "Indian Railways RCF Sintered Bush", "purity": 99.2, "prop": 35, "invest": 520, "status": "Delivered", "priority": "High", "origin": "Rajasthan PM Udaipur (RJ)", "dest": "RCF Kapurthala (PB)", "shipDate": "2026-07-22", "transit": 3, "zone": "West", "remarks": "Al 99.2% sintered powder for Indian Railways wheel factory self-lubricating sintered bronze-aluminium bush &#8594; 35 micron &#8594; &#8377;520Cr for 70 tonnes &#8594; India &#8377;3,600Cr Al PM &#8594; IR 200K wheels &#8594; 99.2% purity &#8594; &#8594; Atomized &#8594; &#8594; AlSint &#8594; &#8594; Rail"},
    {"id": "ALP-0009", "batchNo": "ALP-B2409", "city": "Guwahati", "manufacturer": "Assam Aluminium", "grade": "Al 97% Thermite Welding", "application": "Indian Railways Track Thermite Weld", "purity": 97.0, "prop": 100, "invest": 380, "status": "In Transit", "priority": "High", "origin": "Assam Al Tezpur (AS)", "dest": "Indian Railways Delhi (DL)", "shipDate": "2026-07-23", "transit": 4, "zone": "East", "remarks": "Al 97% coarse powder for Indian Railways track joint thermite welding exothermic mixture &#8594; 100 micron &#8594; &#8377;380Cr for 150 tonnes &#8594; India &#8377;2,600Cr Al thermite &#8594; IR 50K welds &#8594; 97.0% purity &#8594; &#8594; Coarse &#8594; &#8594; AlTherm &#8594; &#8594; Rail"},
    {"id": "ALP-0010", "batchNo": "ALP-B2410", "city": "Ahmedabad", "manufacturer": "Gujarat Aluminium", "grade": "Al 99.8% Nuclear Grade", "application": "IGCAR PFBR Moderator Suspension", "purity": 99.8, "prop": 20, "invest": 900, "status": "Delivered", "priority": "Critical", "origin": "Gujarat Al Ahmedabad (GJ)", "dest": "IGCAR Kalpakkam (TN)", "shipDate": "2026-07-24", "transit": 5, "zone": "West", "remarks": "Al 99.8% nuclear-grade powder for IGCAR PFBR reactor moderator grid aluminium suspension &#8594; 20 micron &#8594; &#8377;900Cr for 20 tonnes &#8594; India &#8377;7,400Cr Al nuclear &#8594; IGCAR 2 reactors &#8594; 99.8% purity &#8594; &#8594; Spherical &#8594; &#8594; AlNuc &#8594; &#8594; Nuclear"},
    {"id": "ALP-0011", "batchNo": "ALP-B2411", "city": "Lucknow", "manufacturer": "UP Aluminium", "grade": "Al 98.5% Chemical", "application": "NTPC FGD Alumina Precipitation", "purity": 98.5, "prop": 60, "invest": 420, "status": "Delivered", "priority": "Medium", "origin": "UP Al Kanpur (UP)", "dest": "NTPC Singrauli (MP)", "shipDate": "2026-07-25", "transit": 1, "zone": "North", "remarks": "Al 98.5% medium powder for NTPC FGD fly ash alumina precipitation reagent &#8594; 60 micron &#8594; &#8377;420Cr for 90 tonnes &#8594; India &#8377;2,800Cr Al chemical &#8594; NTPC 20 plants &#8594; 98.5% purity &#8594; &#8594; Granular &#8594; &#8594; AlChem &#8594; &#8594; Power"},
    {"id": "ALP-0012", "batchNo": "ALP-B2412", "city": "Visakhapatnam", "manufacturer": "Vizag Aluminium", "grade": "Al 99.7% Submarine AM", "application": "GRSE Project 75I Sonar Array", "purity": 99.7, "prop": 22, "invest": 960, "status": "Delayed", "priority": "Critical", "origin": "Vizag Al Visakhapatnam (AP)", "dest": "GRSE Kolkata (WB)", "shipDate": "2026-07-26", "transit": 2, "zone": "East", "remarks": "Al 99.7% submarine-grade powder for GRSE Project 75I sonar array housing SLM additive &#8594; 22 micron &#8597; &#8377;960Cr for 25 tonnes &#8597; India &#8377;7,800Cr Al submarine &#8597; GRSE 6 submarines &#8597; 99.7% purity &#8597; &#8594; Spherical &#8597; &#8594; AlSub &#8597; &#8594; Naval"},
    {"id": "ALP-0013", "batchNo": "ALP-B2413", "city": "Bhopal", "manufacturer": "DRDO TBRL", "grade": "Al 99.5% Solid Rocket Fuel", "application": "DRDO Akash Missile Propellant", "purity": 99.5, "prop": 30, "invest": 840, "status": "In Transit", "priority": "Critical", "origin": "DRDO Hyderabad (TG)", "dest": "BHEL Hyderabad (TG)", "shipDate": "2026-07-27", "transit": 3, "zone": "Central", "remarks": "Al 99.5% fine powder for DRDO Akash SAM solid rocket propellant metal fuel additive &#8594; 30 micron &#8594; &#8377;840Cr for 50 tonnes &#8594; India &#8377;5,800Cr Al propellant &#8594; DRDO 300 missiles &#8594; 99.5% purity &#8594; &#8594; Fine &#8594; &#8594; AlProp &#8594; &#8594; Defense"},
    {"id": "ALP-0014", "batchNo": "ALP-B2414", "city": "Rourkela", "manufacturer": "SAIL Aluminium", "grade": "Al 96% Deoxidizer", "application": "SAIL EAF Steel Deoxidation", "purity": 96.0, "prop": 120, "invest": 280, "status": "Delivered", "priority": "Low", "origin": "SAIL Rourkela (OD)", "dest": "SAIL Bhilai (CG)", "shipDate": "2026-07-28", "transit": 4, "zone": "East", "remarks": "Al 96% coarse powder for SAIL electric arc furnace aluminium deoxidation shot &#8594; 120 micron &#8594; &#8377;280Cr for 200 tonnes &#8594; India &#8377;1,800Cr Al deox &#8594; SAIL 6 furnaces &#8594; 96.0% purity &#8594; &#8594; Granule &#8594; &#8594; AlDeox &#8594; &#8594; Steel"},
]

ap_insights_left = [
    {"title": "Additive Manufacturing Revolution", "body": "HAL Tejas SLM &#8594; ISRO PSLV DMLS &#8594; GRSE sonar array &#8594; &#8377;2,760Cr combined &#8594; highest growth segment"},
    {"title": "Defense &amp; Strategic", "body": "DRDO BrahMos thermobaric &#8594; DRDO Akash propellant &#8594; &#8377;1,620Cr combined &#8594; national security critical"},
    {"title": "Power &amp; Nuclear", "body": "BHEL GT coating &#8594; IGCAR nuclear &#8594; NTPC FGD &#8594; &#8377;2,040Cr combined &#8594; infrastructure backbone"},
    {"title": "Monsoon Disruption Alert", "body": "ALP-B2412 GRSE Project 75I sonar array AM powder delayed &#8594; monsoon Visakhapatnam &#8594; submarine programme at risk"},
]
ap_insights_right = [
    {"title": "Total Portfolio: &#8377;8,760 Cr", "body": "Across 14 Al powder grades spanning aerospace, defense, space, pyrotechnic, coating, PM, rail, nuclear, automotive &#8594; avg purity 99.11%"},
    {"title": "Critical Priority: 7 Records", "body": "HAL Tejas &#8594; DRDO BrahMos &#8594; ISRO PSLV &#8594; BHEL GT &#8594; IGCAR nuclear &#8594; GRSE submarine &#8594; DRDO Akash"},
    {"title": "Top Manufacturers", "body": "MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Advanced &#8594; HAL lead strategic &#8594; Shyam Metalloys &#8594; Indian Aluminium drive commercial"},
    {"title": "Powder Size Spectrum", "body": "Range 15-120 micron &#8594; aerospace finest 15-25 micron &#8594; thermite coarsest 100-120 &#8594; particle size critical to application"},
]

ap_code = gen_module(
    name="aluminium-powder", title="Aluminium Powder Logistics",
    icon="Construction", hex_color="#475569", tailwind_prefix="slate",
    interface_field="grade", unit_prop_label="Particle Size (um)", unit_prop_key="specProp",
    records_data=ap_records, insights_left=ap_insights_left, insights_right=ap_insights_right,
)


# ================================================================
# MODULE B: Zirconium Fluoride Logistics (ZrF4)
# ================================================================
zf_records = [
    {"id": "ZRF-0001", "batchNo": "ZRF-B2401", "city": "Mumbai", "manufacturer": "MIDHANI", "grade": "ZrF4 99.99% Optical Crystal", "application": "ISRO Chandrayaan-4 IR Lens", "purity": 99.99, "prop": 1.52, "invest": 920, "status": "Delivered", "priority": "Critical", "origin": "MIDHANI Hyderabad (TG)", "dest": "ISRO Bengaluru (KA)", "shipDate": "2026-07-15", "transit": 1, "zone": "West", "remarks": "ZrF4 99.99% fluoride glass precursor for ISRO Chandrayaan-4 lunar IR camera zirconium fluoride optical lens &#8594; nD 1.52 &#8594; &#8377;920Cr for 20 tonnes &#8594; India &#8377;6,800Cr ZrF4 optical &#8594; ISRO 4 missions &#8594; 99.99% purity &#8594; &#8594; Crystal &#8594; &#8594; ZrF4Opt &#8594; &#8594; Space"},
    {"id": "ZRF-0002", "batchNo": "ZRF-B2402", "city": "Bengaluru", "manufacturer": "DRDO DMRL", "grade": "ZrF4 99.95% Laser Host", "application": "DRDO DIRCM IR Laser Window", "purity": 99.95, "prop": 1.51, "invest": 840, "status": "In Transit", "priority": "Critical", "origin": "DRDO Hyderabad (TG)", "dest": "BEL Bengaluru (KA)", "shipDate": "2026-07-16", "transit": 2, "zone": "South", "remarks": "ZrF4 99.95% laser-grade for DRDO DIRCM infrared countermeasure laser window &#8594; nD 1.51 &#8594; &#8377;840Cr for 25 tonnes &#8594; India &#8377;5,800Cr ZrF4 laser &#8594; DRDO 100 systems &#8594; 99.95% purity &#8594; &#8594; Crystal &#8594; &#8594; ZrF4Laser &#8594; &#8594; Defense"},
    {"id": "ZRF-0003", "batchNo": "ZRF-B2403", "city": "Chennai", "manufacturer": "Indian Rare Earths", "grade": "ZrF4 99.9% Fluorozirconate Glass", "application": "BEL AESA Radar IR Dome", "purity": 99.9, "prop": 1.50, "invest": 780, "status": "Delivered", "priority": "High", "origin": "IRE Alwaye (KL)", "dest": "BEL Bengaluru (KA)", "shipDate": "2026-07-17", "transit": 3, "zone": "South", "remarks": "ZrF4 99.9% fluorozirconate glass for BEL AESA radar IR-transparent radome dome &#8594; nD 1.50 &#8594; &#8377;780Cr for 30 tonnes &#8594; India &#8377;5,400Cr ZrF4 radar &#8594; BEL 12 radars &#8594; 99.9% purity &#8594; &#8594; Glass &#8594; &#8594; ZrF4Radar &#8594; &#8594; Defense"},
    {"id": "ZRF-0004", "batchNo": "ZRF-B2404", "city": "Hyderabad", "manufacturer": "Bharat Forge", "grade": "ZrF4 99.5% Weld Flux", "application": "L&amp;T Naval Hull Zirconia Weld", "purity": 99.5, "prop": 3.8, "invest": 520, "status": "Delivered", "priority": "High", "origin": "Bharat Forge Pune (MH)", "dest": "L&amp;T Mumbai (MH)", "shipDate": "2026-07-18", "transit": 4, "zone": "West", "remarks": "ZrF4 99.5% welding flux for L&amp;T naval hull zirconia weld flux electrode coating &#8594; 3.8 g/cm3 &#8594; &#8377;520Cr for 80 tonnes &#8594; India &#8377;3,600Cr ZrF4 weld &#8594; L&amp;T 30 warships &#8594; 99.5% purity &#8594; &#8594; Powder &#8594; &#8594; ZrF4Weld &#8594; &#8594; Naval"},
    {"id": "ZRF-0005", "batchNo": "ZRF-B2405", "city": "Kolkata", "manufacturer": "Tata Steel", "grade": "ZrF4 99% Steel Inclusion", "application": "JSW Steel Bearing Steel Pinning", "purity": 99.0, "prop": 4.6, "invest": 480, "status": "In Transit", "priority": "High", "origin": "Tata Steel Jamshedpur (JH)", "dest": "JSW Vijayanagar (KA)", "shipDate": "2026-07-19", "transit": 5, "zone": "East", "remarks": "ZrF4 99% steel inclusion modifier for JSW bearing steel zirconium inclusion shape control &#8594; 4.6 g/cm3 &#8594; &#8377;480Cr for 60 tonnes &#8594; India &#8377;3,200Cr ZrF4 steel &#8594; JSW 200K tonnes &#8594; 99.0% purity &#8594; &#8594; Powder &#8594; &#8594; ZrF4Inc &#8594; &#8594; Steel"},
    {"id": "ZRF-0006", "batchNo": "ZRF-B2406", "city": "Coimbatore", "manufacturer": "BHEL R&amp;D", "grade": "ZrF4 99.9% Nuclear Coolant", "application": "IGCAR PFBR Molten Salt", "purity": 99.9, "prop": 4.6, "invest": 740, "status": "Delivered", "priority": "Critical", "origin": "BHEL Bhopal (MP)", "dest": "IGCAR Kalpakkam (TN)", "shipDate": "2026-07-20", "transit": 1, "zone": "South", "remarks": "ZrF4 99.9% nuclear-grade for IGCAR PFBR advanced molten salt reactor coolant &#8594; 4.6 g/cm3 &#8594; &#8377;740Cr for 40 tonnes &#8594; India &#8377;5,200Cr ZrF4 nuclear &#8594; IGCAR 2 reactors &#8594; 99.9% purity &#8594; &#8594; Crystal &#8594; &#8594; ZrF4Cool &#8594; &#8594; Nuclear"},
    {"id": "ZRF-0007", "batchNo": "ZRF-B2407", "city": "Pune", "manufacturer": "Mahindra Steel", "grade": "ZrF4 98% Ceramic Glaze", "application": "RAK Ceramics Opalescent Glaze", "purity": 98.0, "prop": 4.4, "invest": 320, "status": "Delivered", "priority": "Medium", "origin": "Mahindra Nashik (MH)", "dest": "RAK Delhi (DL)", "shipDate": "2026-07-21", "transit": 2, "zone": "West", "remarks": "ZrF4 98% ceramic opacifier for RAK Ceramics zirconium opalescent glaze &#8594; 4.4 g/cm3 &#8594; &#8377;320Cr for 50 tonnes &#8594; India &#8377;2,200Cr ZrF4 ceramic &#8594; RAK 10M sqm &#8594; 98.0% purity &#8594; &#8594; Powder &#8594; &#8594; ZrF4Glaze &#8594; &#8594; Ceramics"},
    {"id": "ZRF-0008", "batchNo": "ZRF-B2408", "city": "Jaipur", "manufacturer": "Rajasthan Rare Earths", "grade": "ZrF4 99.7% Dental Ceramic", "application": "Dentsply Y-TZP Dental Crown", "purity": 99.7, "prop": 4.5, "invest": 440, "status": "Delivered", "priority": "Medium", "origin": "Rajasthan RE Udaipur (RJ)", "dest": "Dentsply Mumbai (MH)", "shipDate": "2026-07-22", "transit": 3, "zone": "West", "remarks": "ZrF4 99.7% dental precursor for Dentsply yttria-stabilized zirconia dental crown &#8594; 4.5 g/cm3 &#8594; &#8377;440Cr for 30 tonnes &#8594; India &#8377;3,000Cr ZrF4 dental &#8594; Dentsply 5M crowns &#8594; 99.7% purity &#8594; &#8594; Powder &#8594; &#8594; ZrF4Dent &#8594; &#8594; Medical"},
    {"id": "ZRF-0009", "batchNo": "ZRF-B2409", "city": "Guwahati", "manufacturer": "Assam Rare Earths", "grade": "ZrF4 97% Catalyst", "application": "IOCL Alkylation Catalyst", "purity": 97.0, "prop": 4.2, "invest": 380, "status": "In Transit", "priority": "Medium", "origin": "Assam RE Tezpur (AS)", "dest": "IOCL Paradip (OD)", "shipDate": "2026-07-23", "transit": 4, "zone": "East", "remarks": "ZrF4 97% catalyst support for IOCL Paradip refinery alkylation ZrF4 solid acid catalyst &#8594; 4.2 g/cm3 &#8594; &#8377;380Cr for 40 tonnes &#8594; India &#8377;2,600Cr ZrF4 catalyst &#8594; IOCL 3 refineries &#8594; 97.0% purity &#8594; &#8594; Pellet &#8594; &#8594; ZrF4Cat &#8594; &#8594; Refining"},
    {"id": "ZRF-0010", "batchNo": "ZRF-B2410", "city": "Ahmedabad", "manufacturer": "Gujarat Fluoride", "grade": "ZrF4 99.95% Fiber Optic", "application": "Jio Fluorozirconate Fiber", "purity": 99.95, "prop": 4.6, "invest": 880, "status": "Delivered", "priority": "Critical", "origin": "Gujarat Fluoride Ahmedabad (GJ)", "dest": "Jio Mumbai (MH)", "shipDate": "2026-07-24", "transit": 5, "zone": "West", "remarks": "ZrF4 99.95% fluoride glass for Reliance Jio fluorozirconate IR fiber optic mid-IR transmission &#8594; 4.6 g/cm3 &#8594; &#8377;880Cr for 15 tonnes &#8594; India &#8377;7,200Cr ZrF4 fiber &#8594; Jio 100K km &#8594; 99.95% purity &#8594; &#8594; Glass &#8594; &#8594; ZrF4Fiber &#8594; &#8594; Telecom"},
    {"id": "ZRF-0011", "batchNo": "ZRF-B2411", "city": "Lucknow", "manufacturer": "UP Fluorochemicals", "grade": "ZrF4 99% Anticorrosion", "application": "Tata Steel Pipeline ZrO2 Coat", "purity": 99.0, "prop": 4.6, "invest": 420, "status": "Delivered", "priority": "Medium", "origin": "UP Fluoro Kanpur (UP)", "dest": "Tata Steel Jamshedpur (JH)", "shipDate": "2026-07-25", "transit": 1, "zone": "North", "remarks": "ZrF4 99% precursor for Tata Steel pipeline zirconium dioxide anticorrosion ceramic coating &#8594; 4.6 g/cm3 &#8594; &#8377;420Cr for 50 tonnes &#8594; India &#8377;2,800Cr ZrF4 coat &#8594; Tata 2,000 km &#8594; 99.0% purity &#8594; &#8594; Powder &#8594; &#8594; ZrF4Pipe &#8594; &#8594; Steel"},
    {"id": "ZRF-0012", "batchNo": "ZRF-B2412", "city": "Visakhapatnam", "manufacturer": "Vizag Fluorochemicals", "grade": "ZrF4 99.9% Submarine Periscope", "application": "GRSE Project 75I Optronics Mast", "purity": 99.9, "prop": 1.52, "invest": 960, "status": "Delayed", "priority": "Critical", "origin": "Vizag Fluoro Visakhapatnam (AP)", "dest": "GRSE Kolkata (WB)", "shipDate": "2026-07-26", "transit": 2, "zone": "East", "remarks": "ZrF4 99.9% submarine-grade for GRSE Project 75I optronics mast IR window &#8597; nD 1.52 &#8597; &#8377;960Cr for 15 tonnes &#8597; India &#8377;7,800Cr ZrF4 submarine &#8597; GRSE 6 submarines &#8597; 99.9% purity &#8597; &#8594; Crystal &#8597; &#8594; ZrF4Sub &#8597; &#8594; Naval"},
    {"id": "ZRF-0013", "batchNo": "ZRF-B2413", "city": "Bhopal", "manufacturer": "DRDO TBRL", "grade": "ZrF4 99.8% Thermal Imaging", "application": "DRDO Nag IR Seeker Window", "purity": 99.8, "prop": 1.51, "invest": 860, "status": "In Transit", "priority": "Critical", "origin": "DRDO Hyderabad (TG)", "dest": "BHEL Hyderabad (TG)", "shipDate": "2026-07-27", "transit": 3, "zone": "Central", "remarks": "ZrF4 99.8% thermal-imaging grade for DRDO Nag anti-tank guided missile IR seeker window &#8594; nD 1.51 &#8594; &#8377;860Cr for 20 tonnes &#8594; India &#8377;6,200Cr ZrF4 missile &#8594; DRDO 500 missiles &#8594; 99.8% purity &#8594; &#8594; Crystal &#8594; &#8594; ZrF4IR &#8594; &#8594; Defense"},
    {"id": "ZRF-0014", "batchNo": "ZRF-B2414", "city": "Rourkela", "manufacturer": "SAIL Fluoride", "grade": "ZrF4 96% Foundry", "application": "SAIL Rourkela Casting Mold", "purity": 96.0, "prop": 4.0, "invest": 280, "status": "Delivered", "priority": "Low", "origin": "SAIL Rourkela (OD)", "dest": "SAIL Bhilai (CG)", "shipDate": "2026-07-28", "transit": 4, "zone": "East", "remarks": "ZrF4 96% foundry-grade for SAIL steel casting mold zirconium-based wash coating &#8594; 4.0 g/cm3 &#8594; &#8377;280Cr for 80 tonnes &#8594; India &#8377;2,000Cr ZrF4 foundry &#8594; SAIL 20 molds &#8594; 96.0% purity &#8594; &#8594; Powder &#8594; &#8594; ZrF4Found &#8594; &#8594; Steel"},
]

zf_insights_left = [
    {"title": "Optics &amp; Photonics Leadership", "body": "ISRO Chandrayaan-4 IR lens &#8594; DRDO DIRCM laser &#8594; BEL AESA radar dome &#8597; Jio fluoride fiber &#8594; &#8377;3,420Cr combined &#8594; frontier tech"},
    {"title": "Defense &amp; Naval Programme", "body": "GRSE optronics mast &#8594; DRDO Nag IR seeker &#8594; &#8377;1,820Cr combined &#8594; strategic national assets"},
    {"title": "Nuclear &amp; Energy", "body": "IGCAR PFBR molten salt &#8594; IOCL catalyst &#8594; &#8377;1,120Cr combined &#8594; critical infrastructure"},
    {"title": "Monsoon Disruption Alert", "body": "ZRF-B2412 GRSE Project 75I optronics mast delayed &#8594; monsoon Visakhapatnam &#8594; submarine programme at risk"},
]
zf_insights_right = [
    {"title": "Total Portfolio: &#8377;8,760 Cr", "body": "Across 14 ZrF4 grades spanning optical, laser, radar, nuclear, fiber, dental, welding, catalyst, missile, naval &#8594; avg purity 99.27%"},
    {"title": "Critical Priority: 7 Records", "body": "ISRO optical &#8594; DRDO DIRCM &#8594; IGCAR nuclear &#8594; Jio fiber &#8594; GRSE submarine &#8594; DRDO Nag &#8594; BEL radar"},
    {"title": "Top Manufacturers", "body": "MIDHANI &#8594; DRDO &#8594; IRE &#8594; BHEL &#8594; Gujarat Fluoride lead strategic &#8594; Tata Steel &#8594; Rajasthan RE drive commercial"},
    {"title": "Material Uniqueness", "body": "ZrF4 spans 96-99.99% purity &#8594; dual use: optical (nD 1.50-1.52) and industrial (density 3.8-4.6 g/cm3) &#8594; extremely niche mineral"},
]

zf_code = gen_module(
    name="zirconium-fluoride", title="Zirconium Fluoride Logistics",
    icon="Snowflake", hex_color="#a21caf", tailwind_prefix="fuchsia",
    interface_field="grade", unit_prop_label="Density/RI", unit_prop_key="specProp",
    records_data=zf_records, insights_left=zf_insights_left, insights_right=zf_insights_right,
)


# Write both files
with open(MODULES_DIR + "/aluminium-powder-logistics-view.tsx", "w") as f:
    f.write(ap_code)
print(f"Written aluminium-powder: {len(ap_code.splitlines())} lines")

with open(MODULES_DIR + "/zirconium-fluoride-logistics-view.tsx", "w") as f:
    f.write(zf_code)
print(f"Written zirconium-fluoride: {len(zf_code.splitlines())} lines")

# Scan for malformed HTML entities
for mod in ["aluminium-powder", "zirconium-fluoride"]:
    path = MODULES_DIR + "/" + mod + "-logistics-view.tsx"
    with open(path) as f:
        content = f.read()
    entities = re.findall(r"&#(\d+);", content)
    malformed = [e for e in entities if int(e) > 9999]
    print(f"{mod}: {len(entities)} HTML entities, {len(malformed)} malformed")
    if malformed:
        print(f"  MALFORMED: {malformed}")
