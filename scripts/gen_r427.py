#!/usr/bin/env python3
"""R427 Generator — Nickel Chromium Logistics + Molybdenum Disulphide Logistics"""

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
      <PageHeader title="'''+title+'''" description="Indian '''+title.lower()+''' supply chain tracking across 14 grades spanning aerospace, defense, power, automotive, nuclear and industrial sectors" />
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

# === Nickel Chromium ===
nc = [
    {"id":"NCR-0001","batchNo":"NCR-B2401","city":"Mumbai","manufacturer":"MIDHANI","grade":"NiCr 80/20 Heating","application":"SAIL Bilai Annealing Furnace","purity":99.5,"prop":1080,"invest":860,"status":"Delivered","priority":"Critical","origin":"MIDHANI Hyderabad (TG)","dest":"SAIL Bhilai (CG)","shipDate":"2026-07-15","transit":1,"zone":"West","remarks":"NiCr 80/20 heating element for SAIL Bhilai annealing furnace &#8594; 1080 degC max &#8594; &#8377;860Cr for 80 tonnes &#8594; India &#8377;6,200Cr NiCr heating &#8594; SAIL 8 furnaces &#8594; 99.5% purity &#8594; &#8594; Wire &#8594; &#8594; NiCr8020 &#8594; &#8594; Steel"},
    {"id":"NCR-0002","batchNo":"NCR-B2402","city":"Bengaluru","manufacturer":"DRDO DMRL","grade":"NiCr 60/15 Superalloy","application":"BEL Tejas Mk2 Afterburner","purity":99.2,"prop":1350,"invest":820,"status":"In Transit","priority":"Critical","origin":"DRDO Hyderabad (TG)","dest":"BEL Bengaluru (KA)","shipDate":"2026-07-16","transit":2,"zone":"South","remarks":"NiCr 60/15 superalloy for BEL Tejas Mk2 afterburner liner &#8594; 1350 degC max &#8594; &#8377;820Cr for 60 tonnes &#8594; India &#8377;5,800Cr NiCr aero &#8594; BEL 40 aircraft &#8594; 99.2% purity &#8594; &#8594; Sheet &#8594; &#8594; NiCrSup &#8594; &#8594; Aerospace"},
    {"id":"NCR-0003","batchNo":"NCR-B2403","city":"Chennai","manufacturer":"Tata Steel","grade":"NiCr 70/30 Thermocouple","application":"JSW Steel Continuous Caster","purity":99.8,"prop":1300,"invest":940,"status":"Delivered","priority":"Critical","origin":"Tata Steel Jamshedpur (JH)","dest":"JSW Vijayanagar (KA)","shipDate":"2026-07-17","transit":3,"zone":"South","remarks":"NiCr 70/30 Type K thermocouple for JSW continuous caster molten steel temperature &#8594; 1300 degC max &#8594; &#8377;940Cr for 30 tonnes &#8594; India &#8377;7,600Cr NiCr TC &#8594; JSW 12 casters &#8594; 99.8% purity &#8594; &#8594; Wire &#8594; &#8594; NiCrTC &#8594; &#8594; Steel"},
    {"id":"NCR-0004","batchNo":"NCR-B2404","city":"Hyderabad","manufacturer":"Bharat Forge","grade":"NiCr 50/50 Resistance","application":"Bharat Forge Forge Heater","purity":98.5,"prop":1200,"invest":520,"status":"Delivered","priority":"High","origin":"Bharat Forge Pune (MH)","dest":"Bharat Forge Baramati (MH)","shipDate":"2026-07-18","transit":4,"zone":"West","remarks":"NiCr 50/50 resistance wire for Bharat Forge forging induction heater element &#8594; 1200 degC max &#8594; &#8377;520Cr for 100 tonnes &#8594; India &#8377;3,600Cr NiCr forge &#8594; Bharat Forge 5M forgings &#8594; 98.5% purity &#8594; &#8594; Ribbon &#8594; &#8594; NiCr5050 &#8594; &#8594; Automotive"},
    {"id":"NCR-0005","batchNo":"NCR-B2405","city":"Kolkata","manufacturer":"Shyam Alloys","grade":"NiCr 80/20 Oven","application":"L&amp;T Warship Galley Oven","purity":99.0,"prop":1100,"invest":640,"status":"In Transit","priority":"High","origin":"Shyam Alloys Kolkata (WB)","dest":"L&amp;T Kattupalli (TN)","shipDate":"2026-07-19","transit":5,"zone":"East","remarks":"NiCr 80/20 oven element for L&amp;T warship galley oven heating coil &#8594; 1100 degC max &#8594; &#8377;640Cr for 50 tonnes &#8594; India &#8377;4,400Cr NiCr naval &#8594; L&amp;T 30 warships &#8594; 99.0% purity &#8594; &#8594; Coil &#8594; &#8594; NiCrNav &#8594; &#8594; Naval"},
    {"id":"NCR-0006","batchNo":"NCR-B2406","city":"Coimbatore","manufacturer":"BHEL R&amp;D","grade":"NiCr 60/20 Turbine","application":"BHEL 800MW GT Combustor","purity":99.4,"prop":1400,"invest":780,"status":"Delivered","priority":"Critical","origin":"BHEL Bhopal (MP)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-20","transit":1,"zone":"South","remarks":"NiCr 60/20 gas turbine for BHEL 800MW GT combustor liner &#8594; 1400 degC max &#8594; &#8377;780Cr for 55 tonnes &#8594; India &#8377;5,200Cr NiCr GT &#8594; BHEL 20 GTs &#8594; 99.4% purity &#8594; &#8594; Bar &#8594; &#8594; NiCrGT &#8594; &#8594; Power"},
    {"id":"NCR-0007","batchNo":"NCR-B2407","city":"Pune","manufacturer":"Mahindra Steel","grade":"NiCr 80/20 EV Heater","application":"Mahindra XUV400 PTC Heater","purity":99.0,"prop":1080,"invest":440,"status":"Delivered","priority":"Medium","origin":"Mahindra Nashik (MH)","dest":"Mahindra Pune (MH)","shipDate":"2026-07-21","transit":2,"zone":"West","remarks":"NiCr 80/20 heating wire for Mahindra XUV400 EV PTC cabin heater element &#8594; 1080 degC &#8594; &#8377;440Cr for 40 tonnes &#8594; India &#8377;3,000Cr NiCr EV &#8594; Mahindra 50K vehicles &#8594; 99.0% purity &#8594; &#8594; Wire &#8594; &#8594; NiCrEV &#8594; &#8594; Automotive"},
    {"id":"NCR-0008","batchNo":"NCR-B2408","city":"Jaipur","manufacturer":"Rajasthan Alloys","grade":"NiCr 90/10 Spark Plug","application":"Bajaj Auto Ignition Electrode","purity":98.8,"prop":1050,"invest":380,"status":"Delivered","priority":"Medium","origin":"Rajasthan Alloys Jodhpur (RJ)","dest":"Bajaj Auto Pune (MH)","shipDate":"2026-07-22","transit":3,"zone":"West","remarks":"NiCr 90/10 spark plug electrode for Bajaj Auto motorcycle ignition &#8594; 1050 degC &#8594; &#8377;380Cr for 30 tonnes &#8594; India &#8377;2,600Cr NiCr ignition &#8594; Bajaj 5M bikes &#8594; 98.8% purity &#8594; &#8594; Wire &#8594; &#8594; NiCrSpark &#8594; &#8594; Automotive"},
    {"id":"NCR-0009","batchNo":"NCR-B2409","city":"Guwahati","manufacturer":"Assam Alloys","grade":"NiCr 70/30 Rail Weld","application":"Indian Railways Thermit Weld","purity":98.0,"prop":1250,"invest":480,"status":"In Transit","priority":"High","origin":"Assam Alloys Tezpur (AS)","dest":"Indian Railways Delhi (DL)","shipDate":"2026-07-23","transit":4,"zone":"East","remarks":"NiCr 70/30 rail thermocouple for Indian Railways thermite weld temperature monitoring &#8594; 1250 degC &#8594; &#8377;480Cr for 50 tonnes &#8594; India &#8377;3,200Cr NiCr rail &#8594; IR 50K welds &#8594; 98.0% purity &#8594; &#8594; Wire &#8594; &#8594; NiCrRail &#8594; &#8594; Rail"},
    {"id":"NCR-0010","batchNo":"NCR-B2410","city":"Ahmedabad","manufacturer":"Gujarat Alloys","grade":"NiCr 80/20 Nuclear","application":"IGCAR PFBR Heater","purity":99.9,"prop":1150,"invest":900,"status":"Delivered","priority":"Critical","origin":"Gujarat Alloys Ahmedabad (GJ)","dest":"IGCAR Kalpakkam (TN)","shipDate":"2026-07-24","transit":5,"zone":"West","remarks":"NiCr 80/20 nuclear-grade for IGCAR PFBR secondary sodium heater &#8594; 1150 degC &#8594; &#8377;900Cr for 35 tonnes &#8594; India &#8377;7,400Cr NiCr nuclear &#8594; IGCAR 2 reactors &#8594; 99.9% purity &#8594; &#8594; Tube &#8594; &#8594; NiCrNuc &#8594; &#8594; Nuclear"},
    {"id":"NCR-0011","batchNo":"NCR-B2411","city":"Lucknow","manufacturer":"UP Alloys","grade":"NiCr 60/15 Glazing","application":"RAK Ceramics Glass Kiln","purity":97.5,"prop":1300,"invest":360,"status":"Delivered","priority":"Medium","origin":"UP Alloys Kanpur (UP)","dest":"RAK Ceramics Delhi (DL)","shipDate":"2026-07-25","transit":1,"zone":"North","remarks":"NiCr 60/15 glazing kiln for RAK Ceramics glass firing kiln element &#8594; 1300 degC &#8594; &#8377;360Cr for 60 tonnes &#8594; India &#8377;2,400Cr NiCr ceramic &#8594; RAK 10M sqm &#8594; 97.5% purity &#8594; &#8594; Rod &#8594; &#8594; NiCrGlaz &#8594; &#8594; Ceramics"},
    {"id":"NCR-0012","batchNo":"NCR-B2412","city":"Visakhapatnam","manufacturer":"Vizag Alloys","grade":"NiCr 60/20 Submarine","application":"GRSE Project 75I Periscope","purity":99.6,"prop":1350,"invest":960,"status":"Delayed","priority":"Critical","origin":"Vizag Alloys Visakhapatnam (AP)","dest":"GRSE Kolkata (WB)","shipDate":"2026-07-26","transit":2,"zone":"East","remarks":"NiCr 60/20 submarine-grade for GRSE Project 75I periscope mast heating de-icing &#8597; 1350 degC &#8597; &#8377;960Cr for 25 tonnes &#8597; India &#8377;7,800Cr NiCr submarine &#8597; GRSE 6 submarines &#8597; 99.6% purity &#8597; &#8594; Strip &#8597; &#8594; NiCrSub &#8597; &#8594; Naval"},
    {"id":"NCR-0013","batchNo":"NCR-B2413","city":"Bhopal","manufacturer":"DRDO TBRL","grade":"NiCr 70/30 Missile","application":"DRDO BrahMos Seeker Thermal","purity":99.3,"prop":1300,"invest":880,"status":"In Transit","priority":"Critical","origin":"DRDO Chandipur (OD)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-27","transit":3,"zone":"Central","remarks":"NiCr 70/30 missile-grade for DRDO BrahMos Mk2 IR seeker thermal shield &#8594; 1300 degC &#8594; &#8377;880Cr for 40 tonnes &#8594; India &#8377;6,400Cr NiCr missile &#8594; DRDO 200 missiles &#8594; 99.3% purity &#8594; &#8594; Foil &#8594; &#8594; NiCrMsl &#8594; &#8594; Defense"},
    {"id":"NCR-0014","batchNo":"NCR-B2414","city":"Rourkela","manufacturer":"SAIL Alloys","grade":"NiCr 50/50 General","application":"SAIL Rourkela Boiler Tube","purity":97.0,"prop":1100,"invest":320,"status":"Delivered","priority":"Low","origin":"SAIL Rourkela (OD)","dest":"SAIL Bhilai (CG)","shipDate":"2026-07-28","transit":4,"zone":"East","remarks":"NiCr 50/50 boiler tube for SAIL Rourkela power plant superheater tube &#8594; 1100 degC &#8594; &#8377;320Cr for 120 tonnes &#8594; India &#8377;2,200Cr NiCr boiler &#8594; SAIL 4 boilers &#8594; 97.0% purity &#8594; &#8594; Tube &#8594; &#8594; NiCrGen &#8594; &#8594; Power"},
]
nc_il = [{"title":"Heating Element Dominance","body":"SAIL furnace &#8594; BHEL GT &#8594; IGCAR nuclear &#8594; &#8377;2,540Cr combined &#8594; highest volume segment"},{"title":"Defense &amp; Aerospace","body":"BEL Tejas afterburner &#8594; DRDO BrahMos seeker &#8594; GRSE submarine periscope &#8594; &#8377;2,660Cr combined &#8594; strategic assets"},{"title":"Precision Thermocouple","body":"JSW caster &#8594; Indian Railways weld &#8594; &#8377;1,420Cr combined &#8594; temperature measurement critical"},{"title":"Monsoon Alert","body":"NCR-B2412 GRSE submarine periscope de-icing delayed &#8594; monsoon Visakhapatnam &#8594; naval programme at risk"}]
nc_ir = [{"title":"Total Portfolio: &#8377;8,760 Cr","body":"Across 14 NiCr grades spanning heating, aerospace, thermocouple, forge, naval, GT, EV, ignition, rail, nuclear, ceramic, missile &#8594; avg purity 99.02%"},{"title":"Critical Priority: 7 Records","body":"SAIL &#8594; BEL &#8594; JSW &#8594; BHEL &#8594; IGCAR &#8594; GRSE &#8594; DRDO &#8594; Mahindra"},{"title":"Top Manufacturers","body":"MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Bharat Forge &#8594; Shyam &#8594; Gujarat Alloys"},{"title":"Temp Spectrum","body":"1050-1400 degC range &#8594; NiCr 60/20 turbine at 1400 &#8594; NiCr 90/10 spark plug at 1050 &#8594; grade critical to temperature"}]

# === Molybdenum Disulphide ===
md = [
    {"id":"MDP-0001","batchNo":"MDP-B2401","city":"Mumbai","manufacturer":"MIDHANI","grade":"MoS2 99.9% Aerospace","application":"HAL Tejas Mk2 Landing Gear","purity":99.9,"prop":0.06,"invest":840,"status":"Delivered","priority":"Critical","origin":"MIDHANI Hyderabad (TG)","dest":"HAL Bengaluru (KA)","shipDate":"2026-07-15","transit":1,"zone":"West","remarks":"MoS2 99.9% aerospace-grade for HAL Tejas Mk2 landing gear solid lubricant coating &#8594; 0.06 um &#8594; &#8377;840Cr for 25 tonnes &#8594; India &#8377;6,200Cr MoS2 aero &#8594; HAL 40 aircraft &#8594; 99.9% purity &#8594; &#8594; Powder &#8594; &#8594; MoS2Aero &#8594; &#8594; Aerospace"},
    {"id":"MDP-0002","batchNo":"MDP-B2402","city":"Bengaluru","manufacturer":"DRDO DMRL","grade":"MoS2 99.5% Missile Bearing","application":"DRDO BrahMos Mk2 Gyro Bearing","purity":99.5,"prop":0.08,"invest":780,"status":"In Transit","priority":"Critical","origin":"DRDO Hyderabad (TG)","dest":"BEL Bengaluru (KA)","shipDate":"2026-07-16","transit":2,"zone":"South","remarks":"MoS2 99.5% missile-grade for DRDO BrahMos Mk2 gyro bearing dry film lubricant &#8594; 0.08 um &#8594; &#8377;780Cr for 30 tonnes &#8594; India &#8377;5,400Cr MoS2 missile &#8594; DRDO 200 missiles &#8594; 99.5% purity &#8594; &#8594; Film &#8594; &#8594; MoS2Msl &#8594; &#8594; Defense"},
    {"id":"MDP-0003","batchNo":"MDP-B2403","city":"Chennai","manufacturer":"Tata Steel","grade":"MoS2 98% Metal Forming","application":"JSW Steel Cold Rolling","purity":98.0,"prop":0.15,"invest":680,"status":"Delivered","priority":"High","origin":"Tata Steel Jamshedpur (JH)","dest":"JSW Vijayanagar (KA)","shipDate":"2026-07-17","transit":3,"zone":"South","remarks":"MoS2 98% forming-grade for JSW steel cold rolling mill sheet metal forming lubricant &#8594; 0.15 um &#8594; &#8377;680Cr for 60 tonnes &#8594; India &#8377;4,600Cr MoS2 steel &#8594; JSW 12 mills &#8594; 98.0% purity &#8594; &#8594; Paste &#8594; &#8594; MoS2Form &#8594; &#8594; Steel"},
    {"id":"MDP-0004","batchNo":"MDP-B2404","city":"Hyderabad","manufacturer":"Bharat Forge","grade":"MoS2 97% Auto Engine","application":"Mahindra XUV400 Engine Piston","purity":97.0,"prop":0.10,"invest":480,"status":"Delivered","priority":"High","origin":"Bharat Forge Pune (MH)","dest":"Mahindra Pune (MH)","shipDate":"2026-07-18","transit":4,"zone":"West","remarks":"MoS2 97% engine-grade for Mahindra XUV400 piston ring MoS2 anti-seize coating &#8594; 0.10 um &#8594; &#8377;480Cr for 40 tonnes &#8594; India &#8377;3,200Cr MoS2 auto &#8594; Mahindra 50K engines &#8594; 97.0% purity &#8594; &#8594; Spray &#8594; &#8594; MoS2Auto &#8594; &#8594; Automotive"},
    {"id":"MDP-0005","batchNo":"MDP-B2405","city":"Kolkata","manufacturer":"Shyam Chemicals","grade":"MoS2 96% Gearbox","application":"L&amp;T Naval Gearbox MoS2","purity":96.0,"prop":0.12,"invest":560,"status":"In Transit","priority":"High","origin":"Shyam Chem Kolkata (WB)","dest":"L&amp;T Mumbai (MH)","shipDate":"2026-07-19","transit":5,"zone":"East","remarks":"MoS2 96% gearbox-grade for L&amp;T naval gearbox MoS2 EP grease additive &#8594; 0.12 um &#8594; &#8377;560Cr for 50 tonnes &#8594; India &#8377;3,800Cr MoS2 naval &#8594; L&amp;T 30 gearboxes &#8594; 96.0% purity &#8594; &#8594; Grease &#8594; &#8594; MoS2Nav &#8594; &#8594; Naval"},
    {"id":"MDP-0006","batchNo":"MDP-B2406","city":"Coimbatore","manufacturer":"BHEL R&amp;D","grade":"MoS2 99% Turbine Bearing","application":"BHEL 800MW GT Journal Bearing","purity":99.0,"prop":0.08,"invest":720,"status":"Delivered","priority":"Critical","origin":"BHEL Bhopal (MP)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-20","transit":1,"zone":"South","remarks":"MoS2 99% turbine-grade for BHEL 800MW GT journal bearing MoS2 sputtered coating &#8594; 0.08 um &#8594; &#8377;720Cr for 35 tonnes &#8594; India &#8377;5,000Cr MoS2 GT &#8594; BHEL 20 GTs &#8594; 99.0% purity &#8594; &#8594; Sputter &#8594; &#8594; MoS2GT &#8594; &#8594; Power"},
    {"id":"MDP-0007","batchNo":"MDP-B2407","city":"Pune","manufacturer":"Godrej Lubricants","grade":"MoS2 98% Industrial Grease","application":"Tata Power Wind Turbine","purity":98.0,"prop":0.15,"invest":400,"status":"Delivered","priority":"Medium","origin":"Godrej Mumbai (MH)","dest":"Tata Power Mumbai (MH)","shipDate":"2026-07-21","transit":2,"zone":"West","remarks":"MoS2 98% industrial grease for Tata Power wind turbine yaw bearing MoS2 grease &#8594; 0.15 um &#8594; &#8377;400Cr for 60 tonnes &#8594; India &#8377;2,800Cr MoS2 wind &#8594; Tata 2K turbines &#8594; 98.0% purity &#8594; &#8594; Grease &#8594; &#8594; MoS2Wind &#8594; &#8594; Power"},
    {"id":"MDP-0008","batchNo":"MDP-B2408","city":"Jaipur","manufacturer":"Rajasthan Lubricants","grade":"MoS2 95% Chain Lubricant","application":"Indian Railways RCF Chain","purity":95.0,"prop":0.20,"invest":320,"status":"Delivered","priority":"Medium","origin":"Rajasthan Lub Jodhpur (RJ)","dest":"RCF Kapurthala (PB)","shipDate":"2026-07-22","transit":3,"zone":"West","remarks":"MoS2 95% chain lubricant for Indian Railways wheel factory conveyor chain &#8594; 0.20 um &#8594; &#8377;320Cr for 80 tonnes &#8594; India &#8377;2,200Cr MoS2 rail &#8594; IR 200K chains &#8594; 95.0% purity &#8594; &#8594; Oil &#8594; &#8594; MoS2Chain &#8594; &#8594; Rail"},
    {"id":"MDP-0009","batchNo":"MDP-B2409","city":"Guwahati","manufacturer":"Assam Lubricants","grade":"MoS2 94% Wire Rope","application":"Coal India Mine Hoist Cable","purity":94.0,"prop":0.25,"invest":360,"status":"In Transit","priority":"Medium","origin":"Assam Lub Tezpur (AS)","dest":"Coal India Ranchi (JH)","shipDate":"2026-07-23","transit":4,"zone":"East","remarks":"MoS2 94% wire rope dressing for Coal India mine hoist cable anti-wear &#8594; 0.25 um &#8594; &#8377;360Cr for 70 tonnes &#8594; India &#8377;2,400Cr MoS2 mining &#8594; Coal India 40 mines &#8594; 94.0% purity &#8594; &#8594; Paste &#8594; &#8594; MoS2Mine &#8594; &#8594; Mining"},
    {"id":"MDP-0010","batchNo":"MDP-B2410","city":"Ahmedabad","manufacturer":"Gujarat Lubricants","grade":"MoS2 99.8% Space Grade","application":"ISRO Gaganyaan EVA Suit","purity":99.8,"prop":0.04,"invest":920,"status":"Delivered","priority":"Critical","origin":"Gujarat Lub Ahmedabad (GJ)","dest":"ISRO Bengaluru (KA)","shipDate":"2026-07-24","transit":5,"zone":"West","remarks":"MoS2 99.8% space-grade for ISRO Gaganyaan EVA suit joint lubricant vacuum compatible &#8594; 0.04 um &#8594; &#8377;920Cr for 10 tonnes &#8594; India &#8377;7,600Cr MoS2 space &#8594; ISRO 4 missions &#8594; 99.8% purity &#8594; &#8594; Dispersion &#8594; &#8594; MoS2Space &#8594; &#8594; Space"},
    {"id":"MDP-0011","batchNo":"MDP-B2411","city":"Lucknow","manufacturer":"UP Lubricants","grade":"MoS2 97% Bolt Lubricant","application":"Adani Pipeline Flange Bolt","purity":97.0,"prop":0.10,"invest":380,"status":"Delivered","priority":"Medium","origin":"UP Lub Kanpur (UP)","dest":"Adani Mundra (GJ)","shipDate":"2026-07-25","transit":1,"zone":"North","remarks":"MoS2 97% anti-seize for Adani pipeline flange bolt MoS2 thread lubricant &#8594; 0.10 um &#8594; &#8377;380Cr for 50 tonnes &#8594; India &#8377;2,600Cr MoS2 pipeline &#8594; Adani 2,000 km &#8594; 97.0% purity &#8594; &#8594; Paste &#8594; &#8594; MoS2Pipe &#8594; &#8594; Oil &amp; Gas"},
    {"id":"MDP-0012","batchNo":"MDP-B2412","city":"Visakhapatnam","manufacturer":"Vizag Lubricants","grade":"MoS2 99% Submarine Propeller","application":"GRSE Project 75I Prop Shaft","purity":99.0,"prop":0.06,"invest":940,"status":"Delayed","priority":"Critical","origin":"Vizag Lub Visakhapatnam (AP)","dest":"GRSE Kolkata (WB)","shipDate":"2026-07-26","transit":2,"zone":"East","remarks":"MoS2 99% submarine-grade for GRSE Project 75I propeller shaft bearing MoS2 &#8597; 0.06 um &#8597; &#8377;940Cr for 20 tonnes &#8597; India &#8377;7,800Cr MoS2 submarine &#8597; GRSE 6 submarines &#8597; 99.0% purity &#8597; &#8594; Bond &#8597; &#8594; MoS2Sub &#8597; &#8594; Naval"},
    {"id":"MDP-0013","batchNo":"MDP-B2413","city":"Bhopal","manufacturer":"DRDO TBRL","grade":"MoS2 99.5% Hypersonic","application":"DRDO HSTDV Scramjet Coating","purity":99.5,"prop":0.05,"invest":880,"status":"In Transit","priority":"Critical","origin":"DRDO Hyderabad (TG)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-27","transit":3,"zone":"Central","remarks":"MoS2 99.5% hypersonic-grade for DRDO HSTDV scramjet thermal protection MoS2 coating &#8594; 0.05 um &#8594; &#8377;880Cr for 15 tonnes &#8594; India &#8377;6,200Cr MoS2 hypersonic &#8594; DRDO 10 vehicles &#8594; 99.5% purity &#8594; &#8594; Plasma &#8594; &#8594; MoS2Hyp &#8594; &#8594; Defense"},
    {"id":"MDP-0014","batchNo":"MDP-B2414","city":"Rourkela","manufacturer":"SAIL Lubricants","grade":"MoS2 93% General","application":"SAIL Rourkela Die Wear","purity":93.0,"prop":0.30,"invest":280,"status":"Delivered","priority":"Low","origin":"SAIL Rourkela (OD)","dest":"SAIL Bhilai (CG)","shipDate":"2026-07-28","transit":4,"zone":"East","remarks":"MoS2 93% general die lubricant for SAIL Rourkela steel die forging wear reduction &#8594; 0.30 um &#8594; &#8377;280Cr for 100 tonnes &#8594; India &#8377;2,000Cr MoS2 die &#8594; SAIL 20 dies &#8594; 93.0% purity &#8594; &#8594; Spray &#8594; &#8594; MoS2Gen &#8594; &#8594; Steel"},
]
md_il = [{"title":"Aerospace &amp; Defense Lubrication","body":"HAL Tejas gear &#8594; DRDO BrahMos gyro &#8594; DRDO HSTDV scramjet &#8594; &#8377;2,500Cr combined &#8594; critical solid lubricant"},{"title":"Naval &amp; Power","body":"GRSE submarine prop shaft &#8594; L&amp;T gearbox &#8594; BHEL GT bearing &#8594; &#8377;2,220Cr combined &#8594; strategic assets"},{"title":"Industrial &amp; Mining","body":"JSW cold rolling &#8594; Coal India hoist &#8594; Tata wind &#8594; &#8377;1,440Cr combined &#8594; heavy industry"},{"title":"Monsoon Alert","body":"MDP-B2412 GRSE submarine prop shaft bearing delayed &#8594; monsoon Visakhapatnam &#8594; naval programme at risk"}]
md_ir = [{"title":"Total Portfolio: &#8377;8,760 Cr","body":"Across 14 MoS2 grades spanning aerospace, defense, hypersonic, naval, GT, auto, wind, rail, mining, space, pipeline &#8594; avg purity 97.86%"},{"title":"Critical Priority: 7 Records","body":"HAL &#8594; DRDO BrahMos &#8594; BHEL GT &#8594; ISRO EVA &#8594; GRSE submarine &#8594; DRDO HSTDV &#8594; L&amp;T naval"},{"title":"Top Manufacturers","body":"MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Godrej &#8594; Gujarat Lubricants &#8594; Tata Steel &#8594; Shyam Chemicals"},{"title":"Particle Size Spectrum","body":"0.04-0.30 micron &#8594; space grade finest 0.04 um &#8594; general coarsest 0.30 &#8594; size critical to lubricity"}]

# Generate and write
nc_code = gen_module("nickel-chromium","Nickel Chromium Logistics","Gem","#e11d48","rose","grade","Max Temp (degC)","specProp",nc,nc_il,nc_ir)
md_code = gen_module("molybdenum-disulphide","Molybdenum Disulphide Logistics","Wrench","#65a30d","lime","grade","Particle Size (um)","specProp",md,md_il,md_ir)

for mod, code in [("nickel-chromium", nc_code), ("molybdenum-disulphide", md_code)]:
    path = MODULES_DIR + "/" + mod + "-logistics-view.tsx"
    with open(path, "w") as f:
        f.write(code)
    print(f"Written {mod}: {len(code.splitlines())} lines")
    ents = re.findall(r"&#(\d+);", code)
    bad = [e for e in ents if int(e) > 9999]
    print(f"  {len(ents)} HTML entities, {len(bad)} malformed")
