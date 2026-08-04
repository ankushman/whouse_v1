#!/usr/bin/env python3
"""R430 Generator — Titanium Diboride Logistics + Silicon Carbide Whisker Logistics"""

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
      <PageHeader title="'''+title+'''" description="Indian '''+title.lower()+''' supply chain tracking across 14 grades spanning armor, aerospace, defense, semiconductor, nuclear and industrial sectors" />
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

# === Titanium Diboride (TiB2) ===
# Ultra-hard ceramic, armor, cutting tools, aerospace, defense, neutron absorber
tb = [
    {"id":"TDB-0001","batchNo":"TDB-B2401","city":"Mumbai","manufacturer":"MIDHANI","grade":"TiB2 99.5% Body Armor","application":"DRDO BIS Level IV Plate","purity":99.5,"prop":34.0,"invest":920,"status":"Delivered","priority":"Critical","origin":"MIDHANI Hyderabad (TG)","dest":"DRDO Pune (MH)","shipDate":"2026-07-15","transit":1,"zone":"West","remarks":"TiB2 99.5% armor-grade for DRDO BIS Level IV body armor ceramic strike face &#8594; 34 GPa &#8594; &#8377;920Cr for 80 tonnes &#8594; India &#8377;7,200Cr TiB2 armor &#8594; DRDO 500K plates &#8594; 99.5% purity &#8594; &#8594; Plate &#8594; &#8594; TiB2Armor &#8594; &#8594; Defense"},
    {"id":"TDB-0002","batchNo":"TDB-B2402","city":"Bengaluru","manufacturer":"DRDO DMRL","grade":"TiB2 99.8% Aerospace Composite","application":"HAL Tejas Mk2 Brake Disc","purity":99.8,"prop":35.0,"invest":860,"status":"In Transit","priority":"Critical","origin":"DRDO Hyderabad (TG)","dest":"HAL Bengaluru (KA)","shipDate":"2026-07-16","transit":2,"zone":"South","remarks":"TiB2 99.8% aero-grade for HAL Tejas Mk2 carbon-carbon brake disc TiB2 reinforced &#8594; 35 GPa &#8594; &#8377;860Cr for 25 tonnes &#8594; India &#8377;6,400Cr TiB2 aero &#8594; HAL 40 aircraft &#8594; 99.8% purity &#8594; &#8594; Powder &#8594; &#8594; TiB2Aero &#8594; &#8594; Aerospace"},
    {"id":"TDB-0003","batchNo":"TDB-B2403","city":"Chennai","manufacturer":"Tata Steel","grade":"TiB2 99% Evaporation Boat","application":"JSW Steel Al Coating","purity":99.0,"prop":33.0,"invest":680,"status":"Delivered","priority":"High","origin":"Tata Steel Jamshedpur (JH)","dest":"JSW Vijayanagar (KA)","shipDate":"2026-07-17","transit":3,"zone":"South","remarks":"TiB2 99% coating-grade for JSW steel aluminum PVD evaporation boat &#8594; 33 GPa &#8594; &#8377;680Cr for 60 tonnes &#8594; India &#8377;4,600Cr TiB2 coat &#8594; JSW 12 lines &#8594; 99.0% purity &#8594; &#8594; Boat &#8594; &#8594; TiB2Coat &#8594; &#8594; Steel"},
    {"id":"TDB-0004","batchNo":"TDB-B2404","city":"Hyderabad","manufacturer":"Bharat Forge","grade":"TiB2 99.2% Cutting Tool","application":"Bharat Forge CNC Insert","purity":99.2,"prop":33.5,"invest":580,"status":"Delivered","priority":"High","origin":"Bharat Forge Pune (MH)","dest":"Bharat Forge Baramati (MH)","shipDate":"2026-07-18","transit":4,"zone":"South","remarks":"TiB2 99.2% tool-grade for Bharat Forge CNC turning insert TiB2 coated carbide &#8594; 33.5 GPa &#8594; &#8377;580Cr for 40 tonnes &#8594; India &#8377;3,800Cr TiB2 tool &#8594; Bharat Forge 5M inserts &#8594; 99.2% purity &#8594; &#8594; Insert &#8594; &#8594; TiB2Tool &#8594; &#8594; Manufacturing"},
    {"id":"TDB-0005","batchNo":"TDB-B2405","city":"Kolkata","manufacturer":"Shyam Ceramics","grade":"TiB2 98.5% Wear Resistant","application":"L&amp;T Naval Pump Seal","purity":98.5,"prop":32.0,"invest":560,"status":"In Transit","priority":"High","origin":"Shyam Cer Kolkata (WB)","dest":"L&amp;T Kattupalli (TN)","shipDate":"2026-07-19","transit":5,"zone":"East","remarks":"TiB2 98.5% wear-grade for L&amp;T warship pump mechanical seal TiB2 face &#8594; 32 GPa &#8594; &#8377;560Cr for 35 tonnes &#8594; India &#8377;3,800Cr TiB2 naval &#8594; L&amp;T 30 warships &#8594; 98.5% purity &#8594; &#8594; Seal &#8594; &#8594; TiB2Nav &#8594; &#8594; Naval"},
    {"id":"TDB-0006","batchNo":"TDB-B2406","city":"Coimbatore","manufacturer":"BHEL R&amp;D","grade":"TiB2 99.6% Nuclear Absorber","application":"IGCAR PFBR Control Rod","purity":99.6,"prop":34.5,"invest":780,"status":"Delivered","priority":"Critical","origin":"BHEL Bhopal (MP)","dest":"IGCAR Kalpakkam (TN)","shipDate":"2026-07-20","transit":1,"zone":"South","remarks":"TiB2 99.6% nuclear-grade for IGCAR PFBR fast breeder neutron absorber control rod &#8594; 34.5 GPa &#8594; &#8377;780Cr for 20 tonnes &#8594; India &#8377;5,400Cr TiB2 nuclear &#8594; IGCAR 2 reactors &#8594; 99.6% purity &#8594; &#8594; Pellet &#8594; &#8594; TiB2Nuc &#8594; &#8594; Nuclear"},
    {"id":"TDB-0007","batchNo":"TDB-B2407","city":"Pune","manufacturer":"Godrej Ceramics","grade":"TiB2 99.3% Rocket Nozzle","application":"DRDO Akash Mk2 Nozzle","purity":99.3,"prop":34.0,"invest":740,"status":"Delivered","priority":"Critical","origin":"Godrej Mumbai (MH)","dest":"DRDO Hyderabad (TG)","shipDate":"2026-07-21","transit":2,"zone":"West","remarks":"TiB2 99.3% rocket-grade for DRDO Akash Mk2 solid rocket nozzle throat insert &#8594; 34 GPa &#8594; &#8377;740Cr for 15 tonnes &#8594; India &#8377;5,200Cr TiB2 rocket &#8594; DRDO 500 missiles &#8594; 99.3% purity &#8594; &#8594; Insert &#8594; &#8594; TiB2Rocket &#8594; &#8594; Defense"},
    {"id":"TDB-0008","batchNo":"TDB-B2408","city":"Jaipur","manufacturer":"Rajasthan Ceramics","grade":"TiB2 98% Metallurgical","application":"Indian Railways Brake Block","purity":98.0,"prop":31.0,"invest":420,"status":"Delivered","priority":"Medium","origin":"Rajasthan Cer Jodhpur (RJ)","dest":"BWEL Jhansi (UP)","shipDate":"2026-07-22","transit":3,"zone":"West","remarks":"TiB2 98% rail-grade for Indian Railways locomotive composite brake block TiB2 friction &#8594; 31 GPa &#8594; &#8377;420Cr for 80 tonnes &#8594; India &#8377;2,800Cr TiB2 rail &#8594; IR 200K blocks &#8594; 98.0% purity &#8594; &#8594; Block &#8594; &#8594; TiB2Rail &#8594; &#8594; Rail"},
    {"id":"TDB-0009","batchNo":"TDB-B2409","city":"Guwahati","manufacturer":"Assam Ceramics","grade":"TiB2 97% Welding Electrode","application":"Coal India Weld Hardfacing","purity":97.0,"prop":30.0,"invest":400,"status":"In Transit","priority":"Medium","origin":"Assam Cer Tezpur (AS)","dest":"Coal India Ranchi (JH)","shipDate":"2026-07-23","transit":4,"zone":"East","remarks":"TiB2 97% weld-grade for Coal India mining excavator bucket hardfacing electrode &#8594; 30 GPa &#8594; &#8377;400Cr for 60 tonnes &#8594; India &#8377;2,600Cr TiB2 mining &#8594; Coal India 40 mines &#8594; 97.0% purity &#8594; &#8594; Rod &#8594; &#8594; TiB2Mine &#8594; &#8594; Mining"},
    {"id":"TDB-0010","batchNo":"TDB-B2410","city":"Ahmedabad","manufacturer":"Gujarat Ceramics","grade":"TiB2 99.7% Hypersonic Leading","application":"DRDO HSTDV Nose Tip","purity":99.7,"prop":35.0,"invest":900,"status":"Delivered","priority":"Critical","origin":"Gujarat Cer Ahmedabad (GJ)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-24","transit":5,"zone":"West","remarks":"TiB2 99.7% hypersonic-grade for DRDO HSTDV scramjet nose tip ultra-high temp &#8594; 35 GPa &#8594; &#8377;900Cr for 10 tonnes &#8594; India &#8377;7,200Cr TiB2 hypersonic &#8594; DRDO 10 vehicles &#8594; 99.7% purity &#8594; &#8594; Cone &#8594; &#8594; TiB2Hyp &#8594; &#8594; Defense"},
    {"id":"TDB-0011","batchNo":"TDB-B2411","city":"Lucknow","manufacturer":"UP Ceramics","grade":"TiB2 99% Thermocouple","application":"BHEL 800MW GT TC Sheath","purity":99.0,"prop":33.0,"invest":500,"status":"Delivered","priority":"Medium","origin":"UP Cer Kanpur (UP)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-25","transit":1,"zone":"North","remarks":"TiB2 99% thermocouple-grade for BHEL 800MW GT Type K thermocouple sheath &#8594; 33 GPa &#8594; &#8377;500Cr for 40 tonnes &#8594; India &#8377;3,200Cr TiB2 TC &#8594; BHEL 20 GTs &#8594; 99.0% purity &#8594; &#8594; Tube &#8594; &#8594; TiB2TC &#8594; &#8594; Power"},
    {"id":"TDB-0012","batchNo":"TDB-B2412","city":"Visakhapatnam","manufacturer":"Vizag Ceramics","grade":"TiB2 99.6% Submarine Torpedo","application":"GRSE Project 75I Torpedo Tube","purity":99.6,"prop":34.5,"invest":940,"status":"Delayed","priority":"Critical","origin":"Vizag Cer Visakhapatnam (AP)","dest":"GRSE Kolkata (WB)","shipDate":"2026-07-26","transit":2,"zone":"East","remarks":"TiB2 99.6% submarine-grade for GRSE Project 75I torpedo tube launcher wear liner &#8597; 34.5 GPa &#8597; &#8377;940Cr for 18 tonnes &#8597; India &#8377;7,600Cr TiB2 submarine &#8597; GRSE 6 submarines &#8597; 99.6% purity &#8597; &#8594; Liner &#8597; &#8594; TiB2Sub &#8597; &#8594; Naval"},
    {"id":"TDB-0013","batchNo":"TDB-B2413","city":"Bhopal","manufacturer":"DRDO TBRL","grade":"TiB2 99.5% Missile Radome","application":"DRDO BrahMos Mk2 Radome","purity":99.5,"prop":34.0,"invest":880,"status":"In Transit","priority":"Critical","origin":"DRDO Hyderabad (TG)","dest":"BEL Bengaluru (KA)","shipDate":"2026-07-27","transit":3,"zone":"Central","remarks":"TiB2 99.5% missile-grade for DRDO BrahMos Mk2 radome TiB2-SiC composite &#8594; 34 GPa &#8594; &#8377;880Cr for 20 tonnes &#8594; India &#8377;6,200Cr TiB2 missile &#8594; DRDO 200 missiles &#8594; 99.5% purity &#8594; &#8594; Cone &#8594; &#8594; TiB2Msl &#8594; &#8594; Defense"},
    {"id":"TDB-0014","batchNo":"TDB-B2414","city":"Rourkela","manufacturer":"SAIL Ceramics","grade":"TiB2 96% Blast Furnace","application":"SAIL Rourkela BF Tap Hole","purity":96.0,"prop":29.0,"invest":300,"status":"Delivered","priority":"Low","origin":"SAIL Rourkela (OD)","dest":"SAIL Bhilai (CG)","shipDate":"2026-07-28","transit":4,"zone":"East","remarks":"TiB2 96% furnace-grade for SAIL Rourkela blast furnace tap hole mud TiB2 additive &#8594; 29 GPa &#8594; &#8377;300Cr for 100 tonnes &#8594; India &#8377;2,000Cr TiB2 furnace &#8594; SAIL 4 blast furnaces &#8594; 96.0% purity &#8594; &#8594; Mix &#8594; &#8594; TiB2BF &#8594; &#8594; Steel"},
]
tb_il = [{"title":"Defense Armor Dominance","body":"DRDO BIS Level IV &#8594; DRDO Akash nozzle &#8594; DRDO BrahMos radome &#8594; &#8377;2,540Cr combined &#8594; critical ballistic protection"},{"title":"Aerospace &amp; Hypersonic","body":"HAL Tejas brake &#8594; DRDO HSTDV nose tip &#8594; &#8377;1,760Cr combined &#8594; ultra-high temp ceramics"},{"title":"Naval &amp; Nuclear","body":"GRSE torpedo tube &#8594; L&amp;T pump seal &#8594; IGCAR control rod &#8594; &#8377;2,280Cr combined &#8594; strategic assets"},{"title":"Monsoon Alert","body":"TDB-B2412 GRSE Project 75I torpedo tube wear liner delayed &#8594; monsoon Visakhapatnam &#8594; naval programme at risk"}]
tb_ir = [{"title":"Total Portfolio: &#8377;8,760 Cr","body":"Across 14 TiB2 grades spanning armor, aerospace, cutting tool, naval, nuclear, rocket, hypersonic, rail, mining, furnace &#8594; avg purity 99.07%"},{"title":"Critical Priority: 8 Records","body":"DRDO &#8594; HAL &#8594; IGCAR &#8594; GRSE &#8594; DRDO HSTDV &#8594; DRDO BrahMos &#8594; DRDO Akash &#8594; BHEL"},{"title":"Top Manufacturers","body":"MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Godrej &#8594; Gujarat Ceramics &#8594; Shyam Ceramics"},{"title":"Hardness Spectrum","body":"29-35 GPa Vickers &#8594; hypersonic 35 GPa highest &#8594; blast furnace 29 GPa lowest &#8594; hardness defines grade"}]

# === Silicon Carbide Whisker (SiCw) ===
# Reinforcement ceramic, cutting tools, aerospace, defense, armor, semiconductor
sc = [
    {"id":"SCW-0001","batchNo":"SCW-B2401","city":"Mumbai","manufacturer":"MIDHANI","grade":"SiCw 99.5% Armor Reinforcement","application":"DRDO BIS Level IV+ Composite","purity":99.5,"prop":0.5,"invest":920,"status":"Delivered","priority":"Critical","origin":"MIDHANI Hyderabad (TG)","dest":"DRDO Pune (MH)","shipDate":"2026-07-15","transit":1,"zone":"West","remarks":"SiCw 99.5% armor-grade for DRDO BIS Level IV+ SiCw reinforced alumina composite &#8594; 0.5 um &#8594; &#8377;920Cr for 40 tonnes &#8594; India &#8377;7,200Cr SiCw armor &#8594; DRDO 200K plates &#8594; 99.5% purity &#8594; &#8594; Whisker &#8594; &#8594; SiCwArmor &#8594; &#8594; Defense"},
    {"id":"SCW-0002","batchNo":"SCW-B2402","city":"Bengaluru","manufacturer":"DRDO DMRL","grade":"SiCw 99.8% MMC Aerospace","application":"HAL Tejas Mk2 SiCw/Al Fan","purity":99.8,"prop":0.3,"invest":860,"status":"In Transit","priority":"Critical","origin":"DRDO Hyderabad (TG)","dest":"HAL Bengaluru (KA)","shipDate":"2026-07-16","transit":2,"zone":"South","remarks":"SiCw 99.8% MMC-grade for HAL Tejas Mk2 SiCw/Al metal matrix composite fan blade &#8594; 0.3 um &#8594; &#8377;860Cr for 15 tonnes &#8594; India &#8377;6,400Cr SiCw MMC &#8594; HAL 40 aircraft &#8594; 99.8% purity &#8594; &#8594; Whisker &#8594; &#8594; SiCwMMC &#8594; &#8594; Aerospace"},
    {"id":"SCW-0003","batchNo":"SCW-B2403","city":"Chennai","manufacturer":"Tata Steel","grade":"SiCw 99% Steel Reinforcement","application":"JSW Steel SiCw/Steel Roll","purity":99.0,"prop":0.8,"invest":680,"status":"Delivered","priority":"High","origin":"Tata Steel Jamshedpur (JH)","dest":"JSW Vijayanagar (KA)","shipDate":"2026-07-17","transit":3,"zone":"South","remarks":"SiCw 99% steel-grade for JSW steel rolling mill SiCw reinforced work roll &#8594; 0.8 um &#8594; &#8377;680Cr for 50 tonnes &#8594; India &#8377;4,600Cr SiCw steel &#8594; JSW 12 mills &#8594; 99.0% purity &#8594; &#8594; Whisker &#8594; &#8594; SiCwRoll &#8594; &#8594; Steel"},
    {"id":"SCW-0004","batchNo":"SCW-B2404","city":"Hyderabad","manufacturer":"Bharat Forge","grade":"SiCw 99.2% Cutting Tool","application":"Bharat Forge Ceramic Insert","purity":99.2,"prop":0.6,"invest":580,"status":"Delivered","priority":"High","origin":"Bharat Forge Pune (MH)","dest":"Bharat Forge Baramati (MH)","shipDate":"2026-07-18","transit":4,"zone":"South","remarks":"SiCw 99.2% tool-grade for Bharat Forge SiCw reinforced alumina cutting insert &#8594; 0.6 um &#8594; &#8377;580Cr for 30 tonnes &#8594; India &#8377;3,800Cr SiCw tool &#8594; Bharat Forge 5M inserts &#8594; 99.2% purity &#8594; &#8594; Whisker &#8594; &#8594; SiCwTool &#8594; &#8594; Manufacturing"},
    {"id":"SCW-0005","batchNo":"SCW-B2405","city":"Kolkata","manufacturer":"Shyam Composites","grade":"SiCw 98.5% Marine Propeller","application":"L&amp;T Naval Composite Prop","purity":98.5,"prop":1.0,"invest":560,"status":"In Transit","priority":"High","origin":"Shyam Comp Kolkata (WB)","dest":"L&amp;T Kattupalli (TN)","shipDate":"2026-07-19","transit":5,"zone":"East","remarks":"SiCw 98.5% marine-grade for L&amp;T warship composite propeller SiCw reinforced &#8594; 1.0 um &#8594; &#8377;560Cr for 25 tonnes &#8594; India &#8377;3,800Cr SiCw naval &#8594; L&amp;T 30 warships &#8594; 98.5% purity &#8594; &#8594; Whisker &#8594; &#8594; SiCwProp &#8594; &#8594; Naval"},
    {"id":"SCW-0006","batchNo":"SCW-B2406","city":"Coimbatore","manufacturer":"BHEL R&amp;D","grade":"SiCw 99.6% Turbine Blade","application":"BHEL 800MW GT SiCw/SiC Blade","purity":99.6,"prop":0.4,"invest":780,"status":"Delivered","priority":"Critical","origin":"BHEL Bhopal (MP)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-20","transit":1,"zone":"South","remarks":"SiCw 99.6% GT-grade for BHEL 800MW GT SiCw/SiC ceramic matrix turbine blade &#8594; 0.4 um &#8594; &#8377;780Cr for 10 tonnes &#8594; India &#8377;5,400Cr SiCw GT &#8594; BHEL 20 GTs &#8594; 99.6% purity &#8594; &#8594; Whisker &#8594; &#8594; SiCwGT &#8594; &#8594; Power"},
    {"id":"SCW-0007","batchNo":"SCW-B2407","city":"Pune","manufacturer":"Godrej Composites","grade":"SiCw 99.3% EV Battery Separator","application":"Tata Motors SiCw/Li Separator","purity":99.3,"prop":0.5,"invest":640,"status":"Delivered","priority":"High","origin":"Godrej Mumbai (MH)","dest":"Tata Motors Pune (MH)","shipDate":"2026-07-21","transit":2,"zone":"West","remarks":"SiCw 99.3% EV-grade for Tata Motors Nexon EV SiCw reinforced ceramic separator &#8594; 0.5 um &#8594; &#8377;640Cr for 25 tonnes &#8594; India &#8377;4,400Cr SiCw EV &#8594; Tata 50K vehicles &#8594; 99.3% purity &#8594; &#8594; Whisker &#8594; &#8594; SiCwEV &#8594; &#8594; Automotive"},
    {"id":"SCW-0008","batchNo":"SCW-B2408","city":"Jaipur","manufacturer":"Rajasthan Composites","grade":"SiCw 98% Rail Brake Disc","application":"Indian Railways Composite Disc","purity":98.0,"prop":1.2,"invest":440,"status":"Delivered","priority":"Medium","origin":"Rajasthan Comp Jodhpur (RJ)","dest":"RCF Kapurthala (PB)","shipDate":"2026-07-22","transit":3,"zone":"West","remarks":"SiCw 98% rail-grade for Indian Railways locomotive SiCw/Al composite brake disc &#8594; 1.2 um &#8594; &#8377;440Cr for 50 tonnes &#8594; India &#8377;2,800Cr SiCw rail &#8594; IR 100K discs &#8594; 98.0% purity &#8594; &#8594; Whisker &#8594; &#8594; SiCwRail &#8594; &#8594; Rail"},
    {"id":"SCW-0009","batchNo":"SCW-B2409","city":"Guwahati","manufacturer":"Assam Composites","grade":"SiCw 97% Mining Drill Bit","application":"Coal India PDC Drill Reinforce","purity":97.0,"prop":1.5,"invest":400,"status":"In Transit","priority":"Medium","origin":"Assam Comp Tezpur (AS)","dest":"Coal India Ranchi (JH)","shipDate":"2026-07-23","transit":4,"zone":"East","remarks":"SiCw 97% mining-grade for Coal India PDC drill bit SiCw reinforced matrix &#8594; 1.5 um &#8594; &#8377;400Cr for 40 tonnes &#8594; India &#8377;2,600Cr SiCw mining &#8594; Coal India 40 mines &#8594; 97.0% purity &#8594; &#8594; Whisker &#8594; &#8594; SiCwMine &#8594; &#8594; Mining"},
    {"id":"SCW-0010","batchNo":"SCW-B2410","city":"Ahmedabad","manufacturer":"Gujarat Composites","grade":"SiCw 99.7% Space Telescope","application":"ISRO SPADEX SiCw Mirror","purity":99.7,"prop":0.3,"invest":900,"status":"Delivered","priority":"Critical","origin":"Gujarat Comp Ahmedabad (GJ)","dest":"ISRO Bengaluru (KA)","shipDate":"2026-07-24","transit":5,"zone":"West","remarks":"SiCw 99.7% space-grade for ISRO SPADEX SiCw reinforced C/SiC telescope mirror &#8594; 0.3 um &#8594; &#8377;900Cr for 5 tonnes &#8594; India &#8377;7,200Cr SiCw space &#8594; ISRO 4 missions &#8594; 99.7% purity &#8594; &#8594; Whisker &#8594; &#8594; SiCwSpace &#8594; &#8594; Space"},
    {"id":"SCW-0011","batchNo":"SCW-B2411","city":"Lucknow","manufacturer":"UP Composites","grade":"SiCw 99% Wind Turbine","application":"Adani Wind SiCw/Blade Root","purity":99.0,"prop":0.8,"invest":520,"status":"Delivered","priority":"Medium","origin":"UP Comp Kanpur (UP)","dest":"Adani Mumbai (MH)","shipDate":"2026-07-25","transit":1,"zone":"North","remarks":"SiCw 99% wind-grade for Adani 5MW wind turbine SiCw reinforced blade root joint &#8594; 0.8 um &#8594; &#8377;520Cr for 35 tonnes &#8594; India &#8377;3,400Cr SiCw wind &#8594; Adani 2K turbines &#8594; 99.0% purity &#8594; &#8594; Whisker &#8594; &#8594; SiCwWind &#8594; &#8594; Power"},
    {"id":"SCW-0012","batchNo":"SCW-B2412","city":"Visakhapatnam","manufacturer":"Vizag Composites","grade":"SiCw 99.5% Submarine Sonar Dome","application":"GRSE Project 75I Bow Dome","purity":99.5,"prop":0.4,"invest":940,"status":"Delayed","priority":"Critical","origin":"Vizag Comp Visakhapatnam (AP)","dest":"GRSE Kolkata (WB)","shipDate":"2026-07-26","transit":2,"zone":"East","remarks":"SiCw 99.5% submarine-grade for GRSE Project 75I bow sonar dome rubber composite &#8597; 0.4 um &#8597; &#8377;940Cr for 15 tonnes &#8597; India &#8377;7,600Cr SiCw submarine &#8597; GRSE 6 submarines &#8597; 99.5% purity &#8597; &#8594; Whisker &#8597; &#8594; SiCwSub &#8597; &#8594; Naval"},
    {"id":"SCW-0013","batchNo":"SCW-B2413","city":"Bhopal","manufacturer":"DRDO TBRL","grade":"SiCw 99.6% Hypersonic TPS","application":"DRDO HSTDV TPS Panel","purity":99.6,"prop":0.3,"invest":880,"status":"In Transit","priority":"Critical","origin":"DRDO Hyderabad (TG)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-27","transit":3,"zone":"Central","remarks":"SiCw 99.6% hypersonic-grade for DRDO HSTDV scramjet thermal panel SiCw/SiC CMC &#8594; 0.3 um &#8594; &#8377;880Cr for 8 tonnes &#8594; India &#8377;6,200Cr SiCw hypersonic &#8594; DRDO 10 vehicles &#8594; 99.6% purity &#8594; &#8594; Whisker &#8594; &#8594; SiCwHyp &#8594; &#8594; Defense"},
    {"id":"SCW-0014","batchNo":"SCW-B2414","city":"Rourkela","manufacturer":"SAIL Composites","grade":"SiCw 96% Foundry Crucible","application":"SAIL Rourkela Casting Crucible","purity":96.0,"prop":2.0,"invest":300,"status":"Delivered","priority":"Low","origin":"SAIL Rourkela (OD)","dest":"SAIL Bhilai (CG)","shipDate":"2026-07-28","transit":4,"zone":"East","remarks":"SiCw 96% foundry-grade for SAIL Rourkela steel casting SiCw reinforced crucible &#8594; 2.0 um &#8594; &#8377;300Cr for 80 tonnes &#8594; India &#8377;2,000Cr SiCw foundry &#8594; SAIL 20 crucibles &#8594; 96.0% purity &#8594; &#8594; Whisker &#8594; &#8594; SiCwFound &#8594; &#8594; Steel"},
]
sc_il = [{"title":"Aerospace &amp; Hypersonic CMC","body":"HAL Tejas fan &#8594; BHEL GT blade &#8594; DRDO HSTDV TPS &#8594; &#8377;2,520Cr combined &#8594; ceramic matrix composites critical"},{"title":"Armor &amp; Naval","body":"DRDO BIS IV+ &#8594; GRSE sonar dome &#8594; L&amp;T propeller &#8594; &#8377;2,420Cr combined &#8594; strategic defense"},{"title":"EV &amp; Energy","body":"Tata EV separator &#8594; Adani wind blade root &#8594; &#8377;1,160Cr combined &#8594; green transition"},{"title":"Monsoon Alert","body":"SCW-B2412 GRSE Project 75I bow sonar dome delayed &#8594; monsoon Visakhapatnam &#8594; submarine programme at risk"}]
sc_ir = [{"title":"Total Portfolio: &#8377;8,760 Cr","body":"Across 14 SiCw grades spanning armor, MMC aerospace, steel, cutting tool, naval, GT, EV, rail, mining, space, wind, hypersonic, foundry &#8594; avg purity 98.96%"},{"title":"Critical Priority: 7 Records","body":"DRDO &#8594; HAL &#8594; BHEL GT &#8594; ISRO &#8594; GRSE &#8594; DRDO HSTDV &#8594; DRDO TBRL"},{"title":"Top Manufacturers","body":"MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Godrej &#8594; Gujarat Composites &#8594; Shyam Composites"},{"title":"Whisker Diameter Spectrum","body":"0.3-2.0 micron &#8594; aerospace 0.3 um finest &#8594; foundry 2.0 um coarsest &#8594; diameter defines reinforcement"}]

# Generate and write
tb_code = gen_module("titanium-diboride","Titanium Diboride Logistics","Sword","#16a34a","green","grade","Hardness (GPa)","specProp",tb,tb_il,tb_ir)
sc_code = gen_module("silicon-carbide-whisker","Silicon Carbide Whisker Logistics","Sparkles","#0d9488","teal","grade","Whisker Dia (um)","specProp",sc,sc_il,sc_ir)

for mod, code in [("titanium-diboride", tb_code), ("silicon-carbide-whisker", sc_code)]:
    path = MODULES_DIR + "/" + mod + "-logistics-view.tsx"
    with open(path, "w") as f:
        f.write(code)
    print(f"Written {mod}: {len(code.splitlines())} lines")
    ents = re.findall(r"&#(\d+);", code)
    bad = [e for e in ents if int(e) > 9999]
    print(f"  {len(ents)} HTML entities, {len(bad)} malformed")
