#!/usr/bin/env python3
"""R428 Generator — Tungsten Disulphide Logistics + Silicon Wafer Logistics"""

import re
MODULES_DIR = "/home/z/my-project/src/components/modules"

def esc(t): return t.replace("\\","\\\\").replace("'","\\'")
def esc_html(t):
    t = t.replace("&","&amp;")
    t = t.replace(">"," &#8594; ")
    return t

def gen_records(data):
    lines = []
    for r in data:
        lines.append("  { id: '"+r["id"]+"', batchNo: '"+r["batchNo"]+"', city: '"+r["city"]+"', manufacturer: '"+r["manufacturer"]+"', grade: '"+esc(r["grade"])+"', application: '"+esc(r["application"])+"', purityPercent: "+str(r["purity"])+", specProp: "+str(r["prop"])+", investmentCr: "+str(r["invest"])+", status: '"+r["status"]+"', priority: '"+r["priority"]+"', origin: '"+esc(r["origin"])+"', destination: '"+esc(r["dest"])+"', shipDate: '"+r["shipDate"]+"', transitDays: "+str(r["transit"])+", zone: '"+r["zone"]+"', remarks: '"+esc_html(r["remarks"])+"' },")
    return "\n".join(lines)

def gen_module(name, title, icon, hex_color, tw, iface, plabel, pkey, data, ins_l, ins_r):
    rj = gen_records(data)
    lc = []
    for i in ins_l:
        lc.append('            <div className="p-3 rounded-lg border-l-4 border-l-'+tw+'-500 bg-'+tw+'-50/50"><div className="font-medium">'+i["title"]+'</div><div className="text-xs text-muted-foreground mt-1">'+i["body"]+'</div></div>')
    rc = []
    for i in ins_r:
        rc.append('            <div className="p-3 rounded-lg border-l-4 border-l-'+tw+'-500 bg-'+tw+'-50/50"><div className="font-medium">'+i["title"]+'</div><div className="text-xs text-muted-foreground mt-1">'+i["body"]+'</div></div>')
    cn = "".join(w.capitalize() for w in name.split("-")) + "LogisticsView"
    rn = name.replace("-","")
    return '''"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { '''+icon+''' } from 'lucide-react';

interface '''+cn.replace("LogisticsView","Record")+''' {
  id: string; batchNo: string; city: string; manufacturer: string; '''+iface+''': string;
  application: string; purityPercent: number; '''+pkey+''': number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const '''+rn+'''Records: '''+cn.replace("LogisticsView","Record")+'''[] = [
'''+rj+'''
];

export default function '''+cn+'''() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '''+icon+''' },
    { id: 'registry', label: 'Registry', icon: '''+icon+''' },
    { id: 'analytics', label: 'Analytics', icon: '''+icon+''' },
    { id: 'insights', label: 'Insights', icon: '''+icon+''' },
  ];

  const filteredRecords = useMemo(() => {
    return '''+rn+'''Records.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.'''+iface+'''.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    '''+rn+'''Records.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = '''+rn+'''Records.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = '''+rn+'''Records.reduce((s: number, r) => s + r.purityPercent, 0) / '''+rn+'''Records.length;
    const delayed = '''+rn+'''Records.filter((r) => r.status === 'Delayed').length;
    const critical = '''+rn+'''Records.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = \''''+hex_color+'''\';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="'''+title+'''" description="Indian '''+title.lower()+''' supply chain tracking across 14 grades spanning aerospace, defense, semiconductor, nuclear and industrial sectors" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-'''+tw+'''-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-'''+tw+'''-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-'''+tw+'''-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-'''+tw+'''-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-'''+tw+'''-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-'''+tw+'''-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-'''+tw+'''-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-'''+tw+'''-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-'''+tw+'''-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / '''+rn+'''Records.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = '''+rn+'''Records.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {'''+rn+'''Records.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.'''+iface+'''}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.'''+iface+'''}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">'''+plabel+'''</span><span className="font-medium">{record.'''+pkey+'''}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {'''+rn+'''Records.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; '''+rn+'''Records.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = '''+rn+'''Records.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; '''+rn+'''Records.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; '''+rn+'''Records.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / '''+rn+'''Records.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
'''+("\n".join(lc))+'''
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
'''+("\n".join(rc))+'''
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
'''

# === Tungsten Disulphide (WS2) ===
# Solid lubricant, high-temp dry film, aerospace/defense/nuclear/semiconductor
ws = [
    {"id":"TDS-0001","batchNo":"TDS-B2401","city":"Mumbai","manufacturer":"MIDHANI","grade":"WS2 99.9% Aerospace","application":"HAL Tejas Mk2 Wing Flap Bearing","purity":99.9,"prop":0.08,"invest":860,"status":"Delivered","priority":"Critical","origin":"MIDHANI Hyderabad (TG)","dest":"HAL Bengaluru (KA)","shipDate":"2026-07-15","transit":1,"zone":"West","remarks":"WS2 99.9% aerospace-grade for HAL Tejas Mk2 wing flap bearing dry film lubricant &#8594; 0.08 um &#8594; &#8377;860Cr for 20 tonnes &#8594; India &#8377;6,400Cr WS2 aero &#8594; HAL 40 aircraft &#8594; 99.9% purity &#8594; &#8594; Powder &#8594; &#8594; WS2Aero &#8594; &#8594; Aerospace"},
    {"id":"TDS-0002","batchNo":"TDS-B2402","city":"Bengaluru","manufacturer":"DRDO DMRL","grade":"WS2 99.5% Missile Seeker","application":"DRDO BrahMos Mk2 Canard Pivot","purity":99.5,"prop":0.10,"invest":800,"status":"In Transit","priority":"Critical","origin":"DRDO Hyderabad (TG)","dest":"BEL Bengaluru (KA)","shipDate":"2026-07-16","transit":2,"zone":"South","remarks":"WS2 99.5% missile-grade for DRDO BrahMos Mk2 canard pivot bearing dry film &#8594; 0.10 um &#8594; &#8377;800Cr for 25 tonnes &#8594; India &#8377;5,600Cr WS2 missile &#8594; DRDO 200 missiles &#8594; 99.5% purity &#8594; &#8594; Film &#8594; &#8594; WS2Msl &#8594; &#8594; Defense"},
    {"id":"TDS-0003","batchNo":"TDS-B2403","city":"Chennai","manufacturer":"Tata Steel","grade":"WS2 98% Metal Forming","application":"JSW Steel Hot Rolling Mill","purity":98.0,"prop":0.18,"invest":660,"status":"Delivered","priority":"High","origin":"Tata Steel Jamshedpur (JH)","dest":"JSW Vijayanagar (KA)","shipDate":"2026-07-17","transit":3,"zone":"South","remarks":"WS2 98% forming-grade for JSW steel hot rolling mill work roll lubricant coating &#8594; 0.18 um &#8594; &#8377;660Cr for 55 tonnes &#8594; India &#8377;4,400Cr WS2 steel &#8594; JSW 12 mills &#8594; 98.0% purity &#8594; &#8594; Spray &#8594; &#8594; WS2Form &#8594; &#8594; Steel"},
    {"id":"TDS-0004","batchNo":"TDS-B2404","city":"Hyderabad","manufacturer":"Bharat Forge","grade":"WS2 97% Auto Transmission","application":"Mahindra XUV400 Gearbox Syncro","purity":97.0,"prop":0.12,"invest":480,"status":"Delivered","priority":"High","origin":"Bharat Forge Pune (MH)","dest":"Mahindra Pune (MH)","shipDate":"2026-07-18","transit":4,"zone":"West","remarks":"WS2 97% auto-grade for Mahindra XUV400 gearbox synchronizer ring WS2 coating &#8594; 0.12 um &#8594; &#8377;480Cr for 35 tonnes &#8594; India &#8377;3,200Cr WS2 auto &#8594; Mahindra 50K gearboxes &#8594; 97.0% purity &#8594; &#8594; Bond &#8594; &#8594; WS2Auto &#8594; &#8594; Automotive"},
    {"id":"TDS-0005","batchNo":"TDS-B2405","city":"Kolkata","manufacturer":"Shyam Lubricants","grade":"WS2 96% Naval Coating","application":"L&amp;T Warship Deck Winch","purity":96.0,"prop":0.15,"invest":560,"status":"In Transit","priority":"High","origin":"Shyam Lub Kolkata (WB)","dest":"L&amp;T Kattupalli (TN)","shipDate":"2026-07-19","transit":5,"zone":"East","remarks":"WS2 96% naval-grade for L&amp;T warship deck winch gear marine lubricant &#8594; 0.15 um &#8594; &#8377;560Cr for 45 tonnes &#8594; India &#8377;3,800Cr WS2 naval &#8594; L&amp;T 30 warships &#8594; 96.0% purity &#8594; &#8594; Grease &#8594; &#8594; WS2Nav &#8594; &#8594; Naval"},
    {"id":"TDS-0006","batchNo":"TDS-B2406","city":"Coimbatore","manufacturer":"BHEL R&amp;D","grade":"WS2 99% Turbine Blade Root","application":"BHEL 800MW GT Blade Root","purity":99.0,"prop":0.08,"invest":740,"status":"Delivered","priority":"Critical","origin":"BHEL Bhopal (MP)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-20","transit":1,"zone":"South","remarks":"WS2 99% turbine-grade for BHEL 800MW GT blade root dovetail anti-fretting &#8594; 0.08 um &#8594; &#8377;740Cr for 30 tonnes &#8594; India &#8377;5,200Cr WS2 GT &#8594; BHEL 20 GTs &#8594; 99.0% purity &#8594; &#8594; Sputter &#8594; &#8594; WS2GT &#8594; &#8594; Power"},
    {"id":"TDS-0007","batchNo":"TDS-B2407","city":"Pune","manufacturer":"Godrej Specialty","grade":"WS2 98% Vacuum Pump","application":"ISRO LPSC Cryo Turbo Pump","purity":98.0,"prop":0.12,"invest":720,"status":"Delivered","priority":"Critical","origin":"Godrej Mumbai (MH)","dest":"ISRO Thiruvananthapuram (KL)","shipDate":"2026-07-21","transit":2,"zone":"West","remarks":"WS2 98% vacuum-grade for ISRO LPSC cryogenic turbo pump bearing WS2 coating &#8594; 0.12 um &#8594; &#8377;720Cr for 15 tonnes &#8594; India &#8377;5,000Cr WS2 space &#8594; ISRO 6 engines &#8594; 98.0% purity &#8594; &#8594; Dispersion &#8594; &#8594; WS2Space &#8594; &#8594; Space"},
    {"id":"TDS-0008","batchNo":"TDS-B2408","city":"Jaipur","manufacturer":"Rajasthan Lubricants","grade":"WS2 95% Rail Curve","application":"Indian Railways Slew Ring","purity":95.0,"prop":0.22,"invest":340,"status":"Delivered","priority":"Medium","origin":"Rajasthan Lub Jodhpur (RJ)","dest":"BWEL Jhansi (UP)","shipDate":"2026-07-22","transit":3,"zone":"West","remarks":"WS2 95% rail-grade for Indian Railways crane slew ring anti-seize compound &#8594; 0.22 um &#8594; &#8377;340Cr for 70 tonnes &#8594; India &#8377;2,200Cr WS2 rail &#8594; IR 5K slew rings &#8594; 95.0% purity &#8594; &#8594; Paste &#8594; &#8594; WS2Rail &#8594; &#8594; Rail"},
    {"id":"TDS-0009","batchNo":"TDS-B2409","city":"Guwahati","manufacturer":"Assam Specialty","grade":"WS2 94% Mining Drill","application":"Coal India TBM Cutter Bearing","purity":94.0,"prop":0.28,"invest":380,"status":"In Transit","priority":"Medium","origin":"Assam Specialty Tezpur (AS)","dest":"Coal India Ranchi (JH)","shipDate":"2026-07-23","transit":4,"zone":"East","remarks":"WS2 94% mining-grade for Coal India TBM cutter bearing anti-wear paste &#8594; 0.28 um &#8594; &#8377;380Cr for 60 tonnes &#8594; India &#8377;2,600Cr WS2 mining &#8594; Coal India 40 mines &#8594; 94.0% purity &#8594; &#8594; Paste &#8594; &#8594; WS2Mine &#8594; &#8594; Mining"},
    {"id":"TDS-0010","batchNo":"TDS-B2410","city":"Ahmedabad","manufacturer":"Gujarat Specialty","grade":"WS2 99.8% Semiconductor","application":"SCL Silicon CMP Process","purity":99.8,"prop":0.05,"invest":900,"status":"Delivered","priority":"Critical","origin":"Gujarat Specialty Ahmedabad (GJ)","dest":"SCL Mohali (PB)","shipDate":"2026-07-24","transit":5,"zone":"West","remarks":"WS2 99.8% semi-grade for SCL silicon wafer CMP process WS2 slurry additive &#8594; 0.05 um &#8594; &#8377;900Cr for 8 tonnes &#8594; India &#8377;7,200Cr WS2 semi &#8594; SCL 100K wafers &#8594; 99.8% purity &#8594; &#8594; Slurry &#8594; &#8594; WS2Semi &#8594; &#8594; Semiconductor"},
    {"id":"TDS-0011","batchNo":"TDS-B2411","city":"Lucknow","manufacturer":"UP Specialty","grade":"WS2 97% Tool Bit","application":"Bharat Forge Hot Die Tool","purity":97.0,"prop":0.15,"invest":400,"status":"Delivered","priority":"Medium","origin":"UP Specialty Kanpur (UP)","dest":"Bharat Forge Pune (MH)","shipDate":"2026-07-25","transit":1,"zone":"North","remarks":"WS2 97% tool-grade for Bharat Forge hot die forging tool anti-galling coating &#8594; 0.15 um &#8594; &#8377;400Cr for 40 tonnes &#8594; India &#8377;2,800Cr WS2 tool &#8594; Bharat Forge 5M forgings &#8594; 97.0% purity &#8594; &#8594; Spray &#8594; &#8594; WS2Tool &#8594; &#8594; Manufacturing"},
    {"id":"TDS-0012","batchNo":"TDS-B2412","city":"Visakhapatnam","manufacturer":"Vizag Specialty","grade":"WS2 99% Submarine Prop Shaft","application":"GRSE Project 75I Shaft Seal","purity":99.0,"prop":0.07,"invest":940,"status":"Delayed","priority":"Critical","origin":"Vizag Specialty Visakhapatnam (AP)","dest":"GRSE Kolkata (WB)","shipDate":"2026-07-26","transit":2,"zone":"East","remarks":"WS2 99% submarine-grade for GRSE Project 75I propeller shaft seal dry film &#8597; 0.07 um &#8597; &#8377;940Cr for 18 tonnes &#8597; India &#8377;7,600Cr WS2 submarine &#8597; GRSE 6 submarines &#8597; 99.0% purity &#8597; &#8594; Film &#8597; &#8594; WS2Sub &#8597; &#8594; Naval"},
    {"id":"TDS-0013","batchNo":"TDS-B2413","city":"Bhopal","manufacturer":"DRDO TBRL","grade":"WS2 99.5% Hypersonic TPS","application":"DRDO HSTDV Nose Cone","purity":99.5,"prop":0.06,"invest":880,"status":"In Transit","priority":"Critical","origin":"DRDO Hyderabad (TG)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-27","transit":3,"zone":"Central","remarks":"WS2 99.5% hypersonic-grade for DRDO HSTDV nose cone thermal protection coating &#8594; 0.06 um &#8594; &#8377;880Cr for 12 tonnes &#8594; India &#8377;6,200Cr WS2 hypersonic &#8594; DRDO 10 vehicles &#8594; 99.5% purity &#8594; &#8594; Plasma &#8594; &#8594; WS2Hyp &#8594; &#8594; Defense"},
    {"id":"TDS-0014","batchNo":"TDS-B2414","city":"Rourkela","manufacturer":"SAIL Specialty","grade":"WS2 93% General Forge","application":"SAIL Rourkela Press Die","purity":93.0,"prop":0.35,"invest":300,"status":"Delivered","priority":"Low","origin":"SAIL Rourkela (OD)","dest":"SAIL Bhilai (CG)","shipDate":"2026-07-28","transit":4,"zone":"East","remarks":"WS2 93% general forge die lubricant for SAIL Rourkela press die anti-stick &#8594; 0.35 um &#8594; &#8377;300Cr for 90 tonnes &#8594; India &#8377;2,000Cr WS2 die &#8594; SAIL 20 presses &#8594; 93.0% purity &#8594; &#8594; Spray &#8594; &#8594; WS2Gen &#8594; &#8594; Steel"},
]
ws_il = [{"title":"Aerospace &amp; Hypersonic Lubrication","body":"HAL Tejas flap bearing &#8594; DRDO BrahMos canard &#8594; DRDO HSTDV nose cone &#8594; &#8377;2,540Cr combined &#8594; WS2 superior to MoS2 at 450+ degC"},{"title":"Space &amp; Semiconductor","body":"ISRO cryo turbo pump &#8594; SCL CMP slurry &#8594; &#8377;1,620Cr combined &#8594; ultra-high purity critical"},{"title":"Naval &amp; Power","body":"GRSE submarine shaft seal &#8594; L&amp;T deck winch &#8594; BHEL GT blade root &#8594; &#8377;2,240Cr combined &#8594; extreme environment assets"},{"title":"Monsoon Alert","body":"TDS-B2412 GRSE Project 75I shaft seal delayed &#8594; monsoon Visakhapatnam &#8594; submarine programme at risk"}]
ws_ir = [{"title":"Total Portfolio: &#8377;8,760 Cr","body":"Across 14 WS2 grades spanning aerospace, hypersonic, naval, GT, cryo, semiconductor, auto, rail, mining, forging &#8594; avg purity 97.86%"},{"title":"Critical Priority: 7 Records","body":"HAL &#8594; DRDO BrahMos &#8594; BHEL GT &#8594; ISRO &#8594; SCL &#8594; GRSE &#8594; DRDO HSTDV"},{"title":"Top Manufacturers","body":"MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Godrej &#8594; Gujarat Specialty &#8594; Tata Steel &#8594; Shyam Lubricants"},{"title":"Particle Size Spectrum","body":"0.05-0.35 micron &#8594; semiconductor finest 0.05 um &#8594; general coarsest 0.35 &#8594; WS2 2x thermal stability vs MoS2"}]

# === Silicon Wafer ===
# Semiconductor-grade silicon, 150mm/200mm/300mm, fabs, DRDO, ISRO, electronics
sw = [
    {"id":"SIW-0001","batchNo":"SIW-B2401","city":"Bengaluru","manufacturer":"SCL Mohali","grade":"Si 300mm SOI Wafer","application":"DRDO AGNI-7 Avionics MCU","purity":99.9999,"prop":300,"invest":940,"status":"Delivered","priority":"Critical","origin":"SCL Mohali (PB)","dest":"DRDO Hyderabad (TG)","shipDate":"2026-07-15","transit":1,"zone":"South","remarks":"Si 300mm SOI wafer for DRDO AGNI-7 navigation avionics MCU fab &#8594; 300mm &#8594; &#8377;940Cr for 50K wafers &#8594; India &#8377;8,200Cr Si semi &#8594; DRDO 100 missiles &#8594; 99.9999% 6N &#8594; &#8594; Wafer &#8594; &#8594; SiSOI &#8594; &#8594; Defense"},
    {"id":"SIW-0002","batchNo":"SIW-B2402","city":"Hyderabad","manufacturer":"Tata Electronics","grade":"Si 200mm CMOS Wafer","application":"BEL AESA Radar TR Module","purity":99.9999,"prop":200,"invest":860,"status":"In Transit","priority":"Critical","origin":"Tata Elec Hosur (TN)","dest":"BEL Bengaluru (KA)","shipDate":"2026-07-16","transit":2,"zone":"South","remarks":"Si 200mm CMOS wafer for BEL AESA radar T/R module GaN-on-Si fab &#8594; 200mm &#8594; &#8377;860Cr for 80K wafers &#8594; India &#8377;7,400Cr Si radar &#8594; BEL 20 radars &#8594; 99.9999% 6N &#8594; &#8594; Wafer &#8594; &#8594; SiCMOS &#8594; &#8594; Aerospace"},
    {"id":"SIW-0003","batchNo":"SIW-B2403","city":"Pune","manufacturer":"ISRO Semiconductor","grade":"Si 200mm Rad-Hard Wafer","application":"ISRO Gaganyaan Flight Computer","purity":99.9999,"prop":200,"invest":920,"status":"Delivered","priority":"Critical","origin":"ISRO Bengaluru (KA)","dest":"ISRO Thiruvananthapuram (KL)","shipDate":"2026-07-17","transit":3,"zone":"West","remarks":"Si 200mm rad-hard wafer for ISRO Gaganyaan flight computer radiation-hard fab &#8594; 200mm &#8594; &#8377;920Cr for 30K wafers &#8594; India &#8377;7,800Cr Si space &#8594; ISRO 4 missions &#8594; 99.9999% 6N &#8594; &#8594; Wafer &#8594; &#8594; SiRad &#8594; &#8594; Space"},
    {"id":"SIW-0004","batchNo":"SIW-B2404","city":"Gandhinagar","manufacturer":"IITB Nanofab","grade":"Si 150mm MEMS Wafer","application":"DRDO Lavly Nav MEMS Gyro","purity":99.999,"prop":150,"invest":680,"status":"Delivered","priority":"High","origin":"IITB Mumbai (MH)","dest":"DRDO Bangalore (KA)","shipDate":"2026-07-18","transit":4,"zone":"West","remarks":"Si 150mm MEMS wafer for DRDO Lavly navigation MEMS gyroscope sensor fab &#8594; 150mm &#8594; &#8377;680Cr for 100K wafers &#8594; India &#8377;5,200Cr Si MEMS &#8594; DRDO 500 units &#8594; 99.999% 5N &#8594; &#8594; Wafer &#8594; &#8594; SiMEMS &#8594; &#8594; Defense"},
    {"id":"SIW-0005","batchNo":"SIW-B2405","city":"Chennai","manufacturer":"ITES Chennai","grade":"Si 300mm Power MOSFET","application":"BHEL 800MW GT Inverter","purity":99.9999,"prop":300,"invest":780,"status":"In Transit","priority":"High","origin":"ITES Chennai (TN)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-19","transit":5,"zone":"South","remarks":"Si 300mm power MOSFET wafer for BHEL 800MW GT grid inverter module &#8594; 300mm &#8594; &#8377;780Cr for 40K wafers &#8594; India &#8377;5,800Cr Si power &#8594; BHEL 20 GTs &#8594; 99.9999% 6N &#8594; &#8594; Wafer &#8594; &#8594; SiMOS &#8594; &#8594; Power"},
    {"id":"SIW-0006","batchNo":"SIW-B2406","city":"Mumbai","manufacturer":"L&amp;T Semiconductor","grade":"Si 200mm IGBT Wafer","application":"Adani Solar Inverter","purity":99.9999,"prop":200,"invest":640,"status":"Delivered","priority":"High","origin":"L&amp;T Mumbai (MH)","dest":"Adani Mumbai (MH)","shipDate":"2026-07-20","transit":1,"zone":"West","remarks":"Si 200mm IGBT wafer for Adani 5MW solar farm string inverter module &#8594; 200mm &#8594; &#8377;640Cr for 60K wafers &#8594; India &#8377;4,600Cr Si solar &#8594; Adani 10 GW &#8594; 99.9999% 6N &#8594; &#8594; Wafer &#8594; &#8594; SiIGBT &#8594; &#8594; Solar"},
    {"id":"SIW-0007","batchNo":"SIW-B2407","city":"Noida","manufacturer":"Dixon Technologies","grade":"Si 200mm LED Driver Wafer","application":"Dixon LED Display Panel Driver","purity":99.999,"prop":200,"invest":420,"status":"Delivered","priority":"Medium","origin":"Dixon Noida (UP)","dest":"Samsung Noida (UP)","shipDate":"2026-07-21","transit":2,"zone":"North","remarks":"Si 200mm LED driver wafer for Dixon smart TV LED display panel driver IC &#8594; 200mm &#8594; &#8377;420Cr for 100K wafers &#8594; India &#8377;3,000Cr Si consumer &#8594; Dixon 5M panels &#8594; 99.999% 5N &#8594; &#8594; Wafer &#8594; &#8594; SiLED &#8594; &#8594; Consumer"},
    {"id":"SIW-0008","batchNo":"SIW-B2408","city":"Kolkata","manufacturer":"Webel Electronics","grade":"Si 150mm Sensor Wafer","application":"Indian Railways IoT Track Sensor","purity":99.99,"prop":150,"invest":380,"status":"Delivered","priority":"Medium","origin":"Webel Kolkata (WB)","dest":"IRISET Secunderabad (TG)","shipDate":"2026-07-22","transit":3,"zone":"East","remarks":"Si 150mm sensor wafer for Indian Railways IoT track vibration sensor node &#8594; 150mm &#8594; &#8377;380Cr for 120K wafers &#8594; India &#8377;2,600Cr Si rail &#8594; IR 100K sensors &#8594; 99.99% 4N &#8594; &#8594; Wafer &#8594; &#8594; SiSensor &#8594; &#8594; Rail"},
    {"id":"SIW-0009","batchNo":"SIW-B2409","city":"Ahmedabad","manufacturer":"eInfochips","grade":"Si 300mm AI Accelerator","application":"CDAC AI Supercomputer Chip","purity":99.9999,"prop":300,"invest":840,"status":"In Transit","priority":"Critical","origin":"eInfochips Ahmedabad (GJ)","dest":"CDAC Pune (MH)","shipDate":"2026-07-23","transit":4,"zone":"West","remarks":"Si 300mm AI accelerator wafer for CDAC PARAM Siddhi AI supercomputer chip &#8594; 300mm &#8594; &#8377;840Cr for 20K wafers &#8594; India &#8377;6,200Cr Si AI &#8594; CDAC 10 systems &#8594; 99.9999% 6N &#8594; &#8594; Wafer &#8594; &#8594; SiAI &#8594; &#8594; HPC"},
    {"id":"SIW-0010","batchNo":"SIW-B2410","city":"Thiruvananthapuram","manufacturer":"VSSC ISRO","grade":"Si 200mm Solar Cell Wafer","application":"ISRO NexStar Solar Array","purity":99.9999,"prop":200,"invest":760,"status":"Delivered","priority":"High","origin":"VSSC Thiruvananthapuram (KL)","dest":"ISRO Bengaluru (KA)","shipDate":"2026-07-24","transit":5,"zone":"South","remarks":"Si 200mm multi-junction solar cell wafer for ISRO NexStar satellite solar array &#8594; 200mm &#8594; &#8377;760Cr for 40K wafers &#8594; India &#8377;5,400Cr Si solar cell &#8594; ISRO 12 satellites &#8594; 99.9999% 6N &#8594; &#8594; Wafer &#8594; &#8594; SiSolar &#8594; &#8594; Space"},
    {"id":"SIW-0011","batchNo":"SIW-B2411","city":"Guwahati","manufacturer":"Assam Electronics","grade":"Si 150mm Telecom RF Wafer","application":"Jio 5G Small Cell Module","purity":99.99,"prop":150,"invest":360,"status":"Delivered","priority":"Medium","origin":"Assam Elec Guwahati (AS)","dest":"Jio Mumbai (MH)","shipDate":"2026-07-25","transit":1,"zone":"East","remarks":"Si 150mm RF wafer for Jio 5G small cell baseband module RF front end &#8594; 150mm &#8594; &#8377;360Cr for 80K wafers &#8594; India &#8377;2,400Cr Si telecom &#8594; Jio 500K cells &#8594; 99.99% 4N &#8594; &#8594; Wafer &#8594; &#8594; SiRF &#8594; &#8594; Telecom"},
    {"id":"SIW-0012","batchNo":"SIW-B2412","city":"Visakhapatnam","manufacturer":"Naval Physics Lab","grade":"Si 200mm Sonar DSP Wafer","application":"GRSE Project 75I Sonar Processor","purity":99.9999,"prop":200,"invest":900,"status":"Delayed","priority":"Critical","origin":"NPL Visakhapatnam (AP)","dest":"GRSE Kolkata (WB)","shipDate":"2026-07-26","transit":2,"zone":"East","remarks":"Si 200mm DSP wafer for GRSE Project 75I submarine bow sonar processor &#8597; 200mm &#8597; &#8377;900Cr for 25K wafers &#8597; India &#8377;7,400Cr Si sonar &#8597; GRSE 6 submarines &#8597; 99.9999% 6N &#8597; &#8594; Wafer &#8597; &#8594; SiSonar &#8597; &#8594; Naval"},
    {"id":"SIW-0013","batchNo":"SIW-B2413","city":"Bengaluru","manufacturer":"DRDO CEERI","grade":"Si 300mm Crypto Engine","application":"DRDO Nation Crypto Module","purity":99.9999,"prop":300,"invest":880,"status":"In Transit","priority":"Critical","origin":"DRDO Pilani (RJ)","dest":"DRDO Delhi (DL)","shipDate":"2026-07-27","transit":3,"zone":"North","remarks":"Si 300mm crypto engine wafer for DRDO national secure communication crypto module &#8594; 300mm &#8594; &#8377;880Cr for 15K wafers &#8594; India &#8377;6,400Cr Si crypto &#8594; DRDO 2000 modules &#8594; 99.9999% 6N &#8594; &#8594; Wafer &#8594; &#8594; SiCrypto &#8594; &#8594; Defense"},
    {"id":"SIW-0014","batchNo":"SIW-B2414","city":"Rourkela","manufacturer":"SAIL Silicon","grade":"Si 150mm Metallurgical","application":"SAIL Rourkela Si Metal Production","purity":98.5,"prop":150,"invest":320,"status":"Delivered","priority":"Low","origin":"SAIL Rourkela (OD)","dest":"Tata Steel Jamshedpur (JH)","shipDate":"2026-07-28","transit":4,"zone":"East","remarks":"Si 150mm metallurgical-grade for SAIL silicon metal smelting silicon alloy production &#8594; 150mm &#8594; &#8377;320Cr for 200K wafers &#8594; India &#8377;2,200Cr Si metallurgical &#8594; SAIL 100K tonnes &#8594; 98.5% &#8594; &#8594; Ingot &#8594; &#8594; SiMetal &#8594; &#8594; Steel"},
]
sw_il = [{"title":"Strategic Semiconductor Sovereignty","body":"DRDO AGNI-7 MCU &#8594; BEL AESA radar &#8594; DRDO crypto engine &#8594; &#8377;2,680Cr combined &#8594; national security fabs"},{"title":"Space &amp; AI Computing","body":"ISRO Gaganyaan flight computer &#8594; ISRO solar array &#8594; CDAC AI supercomputer &#8594; &#8377;2,440Cr combined &#8594; critical infrastructure"},{"title":"Industrial &amp; Consumer Scale","body":"BHEL GT inverter &#8594; Adani solar &#8594; Dixon LED &#8594; Jio 5G &#8594; &#8377;2,200Cr combined &#8594; volume production"},{"title":"Monsoon Alert","body":"SIW-B2412 GRSE submarine sonar DSP delayed &#8594; monsoon Visakhapatnam &#8594; submarine programme at risk"}]
sw_ir = [{"title":"Total Portfolio: &#8377;8,760 Cr","body":"Across 14 Si wafer grades spanning defense, aerospace, space, power, solar, AI, telecom, naval &#8594; avg purity 99.997% (4N-6N)"},{"title":"Critical Priority: 7 Records","body":"DRDO AGNI-7 &#8594; BEL AESA &#8594; ISRO Gaganyaan &#8594; CDAC AI &#8594; GRSE sonar &#8594; DRDO crypto &#8594; ISRO solar"},{"title":"Top Manufacturers","body":"SCL &#8594; Tata Electronics &#8594; ISRO &#8594; IITB &#8594; L&amp;T &#8594; eInfochips &#8594; BHEL"},{"title":"Wafer Size Distribution","body":"300mm (SOI, AI, Crypto, Power MOSFET) &#8594; 200mm (CMOS, Rad-Hard, IGBT, Solar, RF) &#8594; 150mm (MEMS, Sensor, Telecom, Metallurgical)"}]

# Generate and write
ws_code = gen_module("tungsten-disulphide","Tungsten Disulphide Logistics","Shield","#7c3aed","violet","grade","Particle Size (um)","specProp",ws,ws_il,ws_ir)
sw_code = gen_module("silicon-wafer","Silicon Wafer Logistics","Cpu","#0891b2","cyan","grade","Wafer Diameter (mm)","specProp",sw,sw_il,sw_ir)

for mod, code in [("tungsten-disulphide", ws_code), ("silicon-wafer", sw_code)]:
    path = MODULES_DIR + "/" + mod + "-logistics-view.tsx"
    with open(path, "w") as f:
        f.write(code)
    print(f"Written {mod}: {len(code.splitlines())} lines")
    ents = re.findall(r"&#(\d+);", code)
    bad = [e for e in ents if int(e) > 9999]
    print(f"  {len(ents)} HTML entities, {len(bad)} malformed")
