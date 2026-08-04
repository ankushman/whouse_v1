#!/usr/bin/env python3
"""R429 Generator — Germanium Ingot Logistics + Vanadium Pentoxide Logistics"""

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
      <PageHeader title="'''+title+'''" description="Indian '''+title.lower()+''' supply chain tracking across 14 grades spanning infrared optics, fiber optics, semiconductor, defense, energy storage and industrial sectors" />
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

# === Germanium Ingot (Ge) ===
# Infrared optics, fiber optics, semiconductor, defense, night vision, space
gi = [
    {"id":"GIN-0001","batchNo":"GIN-B2401","city":"Bengaluru","manufacturer":"MIDHANI","grade":"Ge 99.999% IR Optics","application":"DRDO AGNI-7 IR Seeker Lens","purity":99.999,"prop":4.0,"invest":920,"status":"Delivered","priority":"Critical","origin":"MIDHANI Hyderabad (TG)","dest":"DRDO Hyderabad (TG)","shipDate":"2026-07-15","transit":1,"zone":"South","remarks":"Ge 99.999% 5N optical-grade for DRDO AGNI-7 IR seeker germanium lens &#8594; nD 4.0 &#8594; &#8377;920Cr for 15 tonnes &#8594; India &#8377;6,800Cr Ge optics &#8594; DRDO 100 missiles &#8594; 99.999% 5N &#8594; &#8594; Ingot &#8594; &#8594; GeIROpt &#8594; &#8594; Defense"},
    {"id":"GIN-0002","batchNo":"GIN-B2402","city":"Mumbai","manufacturer":"DRDO DMRL","grade":"Ge 99.99% Night Vision","application":"BEL LCA Tejas HUD Element","purity":99.99,"prop":4.0,"invest":860,"status":"In Transit","priority":"Critical","origin":"DRDO Hyderabad (TG)","dest":"BEL Bengaluru (KA)","shipDate":"2026-07-16","transit":2,"zone":"West","remarks":"Ge 99.99% 4N night-vision for BEL Tejas HUD germanium thermal element &#8594; nD 4.0 &#8594; &#8377;860Cr for 20 tonnes &#8594; India &#8377;6,200Cr Ge NV &#8594; BEL 40 aircraft &#8594; 99.99% 4N &#8594; &#8594; Ingot &#8594; &#8594; GeNV &#8594; &#8594; Aerospace"},
    {"id":"GIN-0003","batchNo":"GIN-B2403","city":"Chennai","manufacturer":"Tata Steel","grade":"Ge 99.95% Fiber Optic","application":"Jio 5G Fiber Ge Photodetector","purity":99.95,"prop":4.0,"invest":780,"status":"Delivered","priority":"High","origin":"Tata Steel Jamshedpur (JH)","dest":"Jio Mumbai (MH)","shipDate":"2026-07-17","transit":3,"zone":"South","remarks":"Ge 99.95% 3N5 fiber-grade for Jio 5G fiber optic germanium photodetector &#8594; nD 4.0 &#8594; &#8377;780Cr for 30 tonnes &#8594; India &#8377;5,400Cr Ge fiber &#8594; Jio 500K km &#8594; 99.95% 3N5 &#8594; &#8594; Ingot &#8594; &#8594; GeFiber &#8594; &#8594; Telecom"},
    {"id":"GIN-0004","batchNo":"GIN-B2404","city":"Hyderabad","manufacturer":"Bharat Forge","grade":"Ge 99.9% Semiconductor","application":"CDAC Ge-On-Si Substrate","purity":99.9,"prop":4.0,"invest":700,"status":"Delivered","priority":"High","origin":"Bharat Forge Pune (MH)","dest":"CDAC Pune (MH)","shipDate":"2026-07-18","transit":4,"zone":"South","remarks":"Ge 99.9% 3N semi-grade for CDAC Ge-on-Si substrate high-mobility transistor &#8594; nD 4.0 &#8594; &#8377;700Cr for 25 tonnes &#8594; India &#8377;4,800Cr Ge semi &#8594; CDAC 10 chips &#8594; 99.9% 3N &#8594; &#8594; Wafer &#8594; &#8594; GeSemi &#8594; &#8594; Semiconductor"},
    {"id":"GIN-0005","batchNo":"GIN-B2405","city":"Kolkata","manufacturer":"Shyam Optics","grade":"Ge 99.5% Thermal Imager","application":"L&amp;T Naval FLIR Camera","purity":99.5,"prop":4.0,"invest":640,"status":"In Transit","priority":"High","origin":"Shyam Optics Kolkata (WB)","dest":"L&amp;T Kattupalli (TN)","shipDate":"2026-07-19","transit":5,"zone":"East","remarks":"Ge 99.5% thermal-grade for L&amp;T warship FLIR germanium lens element &#8594; nD 4.0 &#8594; &#8377;640Cr for 35 tonnes &#8594; India &#8377;4,400Cr Ge thermal &#8594; L&amp;T 30 warships &#8594; 99.5% &#8594; &#8594; Lens &#8594; &#8594; GeFLIR &#8594; &#8594; Naval"},
    {"id":"GIN-0006","batchNo":"GIN-B2406","city":"Coimbatore","manufacturer":"BHEL R&amp;D","grade":"Ge 99.999% Solar Cell","application":"ISRO GSAT-5 GaAs/Ge Cell","purity":99.999,"prop":4.0,"invest":880,"status":"Delivered","priority":"Critical","origin":"BHEL Bengaluru (KA)","dest":"ISRO Bengaluru (KA)","shipDate":"2026-07-20","transit":1,"zone":"South","remarks":"Ge 99.999% 5N solar-grade for ISRO GSAT-5 multi-junction GaAs/Ge solar cell &#8594; nD 4.0 &#8594; &#8377;880Cr for 10 tonnes &#8594; India &#8377;6,000Cr Ge solar &#8594; ISRO 8 satellites &#8594; 99.999% 5N &#8594; &#8594; Wafer &#8594; &#8594; GeSolar &#8594; &#8594; Space"},
    {"id":"GIN-0007","batchNo":"GIN-B2407","city":"Pune","manufacturer":"Godrej Optics","grade":"Ge 99.9% PET Detector","application":"Nuclear Power Corp PET Scanner","purity":99.9,"prop":4.0,"invest":580,"status":"Delivered","priority":"Medium","origin":"Godrej Mumbai (MH)","dest":"NPCIL Mumbai (MH)","shipDate":"2026-07-21","transit":2,"zone":"West","remarks":"Ge 99.9% detector-grade for NPCIL nuclear medicine PET scanner Ge detector &#8594; nD 4.0 &#8594; &#8377;580Cr for 20 tonnes &#8594; India &#8377;3,800Cr Ge medical &#8594; NPCIL 10 scanners &#8594; 99.9% 3N &#8594; &#8594; Crystal &#8594; &#8594; GePET &#8594; &#8594; Medical"},
    {"id":"GIN-0008","batchNo":"GIN-B2408","city":"Jaipur","manufacturer":"Rajasthan Optics","grade":"Ge 99.95% Spectroscopy","application":"DRDO CBW Spectrometer","purity":99.95,"prop":4.0,"invest":520,"status":"Delivered","priority":"Medium","origin":"Rajasthan Opt Jodhpur (RJ)","dest":"DRDO Gwalior (MP)","shipDate":"2026-07-22","transit":3,"zone":"West","remarks":"Ge 99.95% spectrometer-grade for DRDO CBW reconnaissance FTIR spectrometer &#8594; nD 4.0 &#8594; &#8377;520Cr for 15 tonnes &#8594; India &#8377;3,400Cr Ge spectro &#8594; DRDO 50 units &#8594; 99.95% 3N5 &#8594; &#8594; Prism &#8594; &#8594; GeSpec &#8594; &#8594; Defense"},
    {"id":"GIN-0009","batchNo":"GIN-B2409","city":"Guwahati","manufacturer":"Assam Optics","grade":"Ge 99% LED Substrate","application":"Dixon LED Ge Substrate","purity":99.0,"prop":4.0,"invest":400,"status":"In Transit","priority":"Medium","origin":"Assam Opt Tezpur (AS)","dest":"Dixon Noida (UP)","shipDate":"2026-07-23","transit":4,"zone":"East","remarks":"Ge 99% LED substrate-grade for Dixon high-power LED germanium substrate &#8594; nD 4.0 &#8594; &#8377;400Cr for 40 tonnes &#8594; India &#8377;2,600Cr Ge LED &#8594; Dixon 5M panels &#8594; 99.0% &#8594; &#8594; Wafer &#8594; &#8594; GeLED &#8594; &#8594; Consumer"},
    {"id":"GIN-0010","batchNo":"GIN-B2410","city":"Ahmedabad","manufacturer":"Gujarat Optics","grade":"Ge 99.999% Space Telescope","application":"ISRO SPADEX Ge Imager","purity":99.999,"prop":4.0,"invest":900,"status":"Delivered","priority":"Critical","origin":"Gujarat Opt Ahmedabad (GJ)","dest":"ISRO Ahmedabad (GJ)","shipDate":"2026-07-24","transit":5,"zone":"West","remarks":"Ge 99.999% 5N space-grade for ISRO SPADEX docking germanium IR imager &#8594; nD 4.0 &#8594; &#8377;900Cr for 8 tonnes &#8594; India &#8377;6,600Cr Ge space &#8594; ISRO 4 missions &#8594; 99.999% 5N &#8594; &#8594; Lens &#8594; &#8594; GeSpace &#8594; &#8594; Space"},
    {"id":"GIN-0011","batchNo":"GIN-B2411","city":"Lucknow","manufacturer":"UP Optics","grade":"Ge 99.5% Industrial Lens","application":"Bharat Forge CMM Probe","purity":99.5,"prop":4.0,"invest":380,"status":"Delivered","priority":"Medium","origin":"UP Opt Kanpur (UP)","dest":"Bharat Forge Pune (MH)","shipDate":"2026-07-25","transit":1,"zone":"North","remarks":"Ge 99.5% industrial-grade for Bharat Forge CMM laser probe germanium window &#8594; nD 4.0 &#8594; &#8377;380Cr for 30 tonnes &#8594; India &#8377;2,400Cr Ge industrial &#8594; Bharat Forge 5M probes &#8594; 99.5% &#8594; &#8594; Window &#8594; &#8594; GeInd &#8594; &#8594; Manufacturing"},
    {"id":"GIN-0012","batchNo":"GIN-B2412","city":"Visakhapatnam","manufacturer":"Vizag Optics","grade":"Ge 99.99% Submarine Periscope","application":"GRSE Project 75I Optronics","purity":99.99,"prop":4.0,"invest":940,"status":"Delayed","priority":"Critical","origin":"Vizag Opt Visakhapatnam (AP)","dest":"GRSE Kolkata (WB)","shipDate":"2026-07-26","transit":2,"zone":"East","remarks":"Ge 99.99% 4N submarine-grade for GRSE Project 75I periscope optronics Ge IR lens &#8597; nD 4.0 &#8597; &#8377;940Cr for 12 tonnes &#8597; India &#8377;7,600Cr Ge submarine &#8597; GRSE 6 submarines &#8597; 99.99% 4N &#8597; &#8594; Lens &#8597; &#8594; GeSub &#8597; &#8594; Naval"},
    {"id":"GIN-0013","batchNo":"GIN-B2413","city":"Bhopal","manufacturer":"DRDO TBRL","grade":"Ge 99.95% Hypersonic Window","application":"DRDO HSTDV IR Window","purity":99.95,"prop":4.0,"invest":880,"status":"In Transit","priority":"Critical","origin":"DRDO Hyderabad (TG)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-27","transit":3,"zone":"Central","remarks":"Ge 99.95% hypersonic-grade for DRDO HSTDV IR seeker dome germanium window &#8594; nD 4.0 &#8594; &#8377;880Cr for 10 tonnes &#8594; India &#8377;6,200Cr Ge hypersonic &#8594; DRDO 10 vehicles &#8594; 99.95% 3N5 &#8594; &#8594; Dome &#8594; &#8594; GeHyp &#8594; &#8594; Defense"},
    {"id":"GIN-0014","batchNo":"GIN-B2414","city":"Rourkela","manufacturer":"SAIL Germanium","grade":"Ge 99% Alloying Agent","application":"SAIL Rourkela SiGe Alloy","purity":99.0,"prop":4.0,"invest":300,"status":"Delivered","priority":"Low","origin":"SAIL Rourkela (OD)","dest":"Tata Steel Jamshedpur (JH)","shipDate":"2026-07-28","transit":4,"zone":"East","remarks":"Ge 99% alloying-grade for SAIL Rourkela silicon-germanium alloy electrical steel &#8594; nD 4.0 &#8594; &#8377;300Cr for 100 tonnes &#8594; India &#8377;2,000Cr Ge alloy &#8594; SAIL 20K tonnes &#8594; 99.0% &#8594; &#8594; Ingot &#8594; &#8594; GeAlloy &#8594; &#8594; Steel"},
]
gi_il = [{"title":"Strategic IR Optics Dominance","body":"DRDO AGNI-7 seeker &#8594; BEL Tejas HUD &#8594; L&amp;T naval FLIR &#8594; &#8377;2,420Cr combined &#8594; critical defense thermal imaging"},{"title":"Space &amp; Semiconductor","body":"ISRO GSAT-5 solar cell &#8594; ISRO SPADEX imager &#8594; CDAC Ge-on-Si &#8594; &#8377;2,480Cr combined &#8594; high-value strategic"},{"title":"Telecom &amp; Industrial","body":"Jio 5G fiber &#8594; Dixon LED &#8594; Bharat Forge CMM &#8594; &#8377;1,560Cr combined &#8594; volume production"},{"title":"Monsoon Alert","body":"GIN-B2412 GRSE Project 75I periscope optronics IR lens delayed &#8594; monsoon Visakhapatnam &#8594; submarine programme at risk"}]
gi_ir = [{"title":"Total Portfolio: &#8377;8,760 Cr","body":"Across 14 Ge grades spanning IR optics, night vision, fiber, semiconductor, thermal, solar, PET, spectroscopy, space &#8594; avg purity 99.93% (3N-5N)"},{"title":"Critical Priority: 7 Records","body":"DRDO AGNI-7 &#8594; BEL Tejas &#8594; ISRO GSAT-5 &#8594; ISRO SPADEX &#8594; GRSE submarine &#8594; DRDO HSTDV &#8594; CDAC"},{"title":"Top Manufacturers","body":"MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Godrej &#8594; Gujarat Optics &#8594; Shyam Optics"},{"title":"Refractive Index Signature","body":"nD 4.0 across all grades &#8594; highest of any semiconductor &#8594; enables compact IR optics &#8594; 2-14 um transmission window"}]

# === Vanadium Pentoxide (V2O5) ===
# VRFB energy storage, catalyst, ceramics, aerospace alloy, defense
vp = [
    {"id":"VPN-0001","batchNo":"VPN-B2401","city":"Mumbai","manufacturer":"MIDHANI","grade":"V2O5 99.9% VRFB Grade","application":"NTPC 50MWh Vanadium Flow Battery","purity":99.9,"prop":98.0,"invest":900,"status":"Delivered","priority":"Critical","origin":"MIDHANI Hyderabad (TG)","dest":"NTPC Delhi (DL)","shipDate":"2026-07-15","transit":1,"zone":"West","remarks":"V2O5 99.9% VRFB electrolyte for NTPC 50MWh grid-scale vanadium redox flow battery &#8594; 98% V2O5 &#8594; &#8377;900Cr for 200 tonnes &#8594; India &#8377;6,800Cr V2O5 energy &#8594; NTPC 10 stations &#8594; 99.9% purity &#8594; &#8594; Powder &#8594; &#8594; V2O5VRFB &#8594; &#8594; Energy Storage"},
    {"id":"VPN-0002","batchNo":"VPN-B2402","city":"Bengaluru","manufacturer":"DRDO DMRL","grade":"V2O5 99.7% Superalloy","application":"HAL Tejas Mk2 Ti-6Al-4V Stabilizer","purity":99.7,"prop":97.0,"invest":820,"status":"In Transit","priority":"Critical","origin":"DRDO Hyderabad (TG)","dest":"HAL Bengaluru (KA)","shipDate":"2026-07-16","transit":2,"zone":"South","remarks":"V2O5 99.7% alloy-grade for HAL Tejas Mk2 Ti-6Al-4V vanadium stabilizer additive &#8594; 97% V2O5 &#8594; &#8377;820Cr for 80 tonnes &#8594; India &#8377;5,800Cr V2O5 aero &#8594; HAL 40 aircraft &#8594; 99.7% purity &#8594; &#8594; Powder &#8594; &#8594; V2O5Aero &#8594; &#8594; Aerospace"},
    {"id":"VPN-0003","batchNo":"VPN-B2403","city":"Chennai","manufacturer":"Tata Steel","grade":"V2O5 99.5% HSLA Steel","application":"JSW Steel HSLA Plate","purity":99.5,"prop":96.0,"invest":680,"status":"Delivered","priority":"High","origin":"Tata Steel Jamshedpur (JH)","dest":"JSW Vijayanagar (KA)","shipDate":"2026-07-17","transit":3,"zone":"South","remarks":"V2O5 99.5% steel-grade for JSW HSLA vanadium microalloyed steel plate rolling &#8594; 96% V2O5 &#8594; &#8377;680Cr for 150 tonnes &#8594; India &#8377;4,600Cr V2O5 steel &#8594; JSW 12 mills &#8594; 99.5% purity &#8594; &#8594; Powder &#8594; &#8594; V2O5Steel &#8594; &#8594; Steel"},
    {"id":"VPN-0004","batchNo":"VPN-B2404","city":"Hyderabad","manufacturer":"Bharat Forge","grade":"V2O5 99.6% Tool Steel","application":"Bharat Forge H13 Die Steel","purity":99.6,"prop":96.5,"invest":580,"status":"Delivered","priority":"High","origin":"Bharat Forge Pune (MH)","dest":"Bharat Forge Baramati (MH)","shipDate":"2026-07-18","transit":4,"zone":"South","remarks":"V2O5 99.6% tool-grade for Bharat Forge H13 hot work tool steel grain refiner &#8594; 96.5% V2O5 &#8594; &#8377;580Cr for 100 tonnes &#8594; India &#8377;3,800Cr V2O5 tool &#8594; Bharat Forge 5M dies &#8594; 99.6% purity &#8594; &#8594; Powder &#8594; &#8594; V2O5Tool &#8594; &#8594; Manufacturing"},
    {"id":"VPN-0005","batchNo":"VPN-B2405","city":"Kolkata","manufacturer":"Shyam Chemicals","grade":"V2O5 98% Sulfuric Acid","application":"L&amp;T Chemical Plant Catalyst","purity":98.0,"prop":94.0,"invest":560,"status":"In Transit","priority":"High","origin":"Shyam Chem Kolkata (WB)","dest":"L&amp;T Mumbai (MH)","shipDate":"2026-07-19","transit":5,"zone":"East","remarks":"V2O5 98% catalyst-grade for L&amp;T chemical plant SO2-to-SO3 sulfuric acid contact catalyst &#8594; 94% V2O5 &#8594; &#8377;560Cr for 120 tonnes &#8594; India &#8377;3,800Cr V2O5 catalyst &#8594; L&amp;T 5 plants &#8594; 98.0% purity &#8594; &#8594; Pellet &#8594; &#8594; V2O5Sulf &#8594; &#8594; Chemical"},
    {"id":"VPN-0006","batchNo":"VPN-B2406","city":"Coimbatore","manufacturer":"BHEL R&amp;D","grade":"V2O5 99.8% SCR Catalyst","application":"BHEL 800MW GT SCR DeNOx","purity":99.8,"prop":97.5,"invest":720,"status":"Delivered","priority":"Critical","origin":"BHEL Bhopal (MP)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-20","transit":1,"zone":"South","remarks":"V2O5 99.8% emission-grade for BHEL 800MW GT selective catalytic reduction DeNOx &#8594; 97.5% V2O5 &#8594; &#8377;720Cr for 60 tonnes &#8594; India &#8377;5,000Cr V2O5 emission &#8594; BHEL 20 GTs &#8594; 99.8% purity &#8594; &#8594; Honeycomb &#8594; &#8594; V2O5SCR &#8594; &#8594; Power"},
    {"id":"VPN-0007","batchNo":"VPN-B2407","city":"Pune","manufacturer":"Godrej Chemicals","grade":"V2O5 99% Ceramic Glaze","application":"RAK Ceramics V-Glaze Tile","purity":99.0,"prop":95.0,"invest":440,"status":"Delivered","priority":"Medium","origin":"Godrej Mumbai (MH)","dest":"RAK Ceramics Delhi (DL)","shipDate":"2026-07-21","transit":2,"zone":"West","remarks":"V2O5 99% ceramic-grade for RAK Ceramics vanadium glaze yellow tile pigment &#8594; 95% V2O5 &#8594; &#8377;440Cr for 80 tonnes &#8594; India &#8377;2,800Cr V2O5 ceramic &#8594; RAK 10M sqm &#8594; 99.0% purity &#8594; &#8594; Powder &#8594; &#8594; V2O5Cer &#8594; &#8594; Ceramics"},
    {"id":"VPN-0008","batchNo":"VPN-B2408","city":"Jaipur","manufacturer":"Rajasthan Metals","grade":"V2O5 97% Railway Axle","application":"Indian Railways Vanadium Axle","purity":97.0,"prop":93.0,"invest":520,"status":"Delivered","priority":"High","origin":"Rajasthan Met Jodhpur (RJ)","dest":"BWEL Jhansi (UP)","shipDate":"2026-07-22","transit":3,"zone":"West","remarks":"V2O5 97% rail-grade for Indian Railways forged vanadium axle microalloyed steel &#8594; 93% V2O5 &#8594; &#8377;520Cr for 100 tonnes &#8594; India &#8377;3,400Cr V2O5 rail &#8594; IR 50K axles &#8594; 97.0% purity &#8594; &#8594; Powder &#8594; &#8594; V2O5Rail &#8594; &#8594; Rail"},
    {"id":"VPN-0009","batchNo":"VPN-B2409","city":"Guwahati","manufacturer":"Assam Metals","grade":"V2O5 96% Petro Catalyst","application":"IOC Guwahaty FCC Catalyst","purity":96.0,"prop":92.0,"invest":480,"status":"In Transit","priority":"Medium","origin":"Assam Met Tezpur (AS)","dest":"IOC Guwahati (AS)","shipDate":"2026-07-23","transit":4,"zone":"East","remarks":"V2O5 96% petro-grade for IOC Guwahati FCC fluid catalytic cracking additive &#8594; 92% V2O5 &#8594; &#8377;480Cr for 90 tonnes &#8594; India &#8377;3,200Cr V2O5 petro &#8594; IOC 3 refineries &#8594; 96.0% purity &#8594; &#8594; Powder &#8594; &#8594; V2O5Petro &#8594; &#8594; Oil &amp; Gas"},
    {"id":"VPN-0010","batchNo":"VPN-B2410","city":"Ahmedabad","manufacturer":"Gujarat Vanadium","grade":"V2O5 99.99% Nuclear Shielding","application":"IGCAR PFBR Control Rod","purity":99.99,"prop":98.5,"invest":920,"status":"Delivered","priority":"Critical","origin":"Gujarat Van Ahmedabad (GJ)","dest":"IGCAR Kalpakkam (TN)","shipDate":"2026-07-24","transit":5,"zone":"West","remarks":"V2O5 99.99% nuclear-grade for IGCAR PFBR fast breeder control rod vanadium alloy &#8594; 98.5% V2O5 &#8594; &#8377;920Cr for 40 tonnes &#8594; India &#8377;7,200Cr V2O5 nuclear &#8594; IGCAR 2 reactors &#8594; 99.99% purity &#8594; &#8594; Powder &#8594; &#8594; V2O5Nuc &#8594; &#8594; Nuclear"},
    {"id":"VPN-0011","batchNo":"VPN-B2411","city":"Lucknow","manufacturer":"UP Metals","grade":"V2O5 98.5% Solar Coating","application":"Adani Solar Anti-Reflective","purity":98.5,"prop":94.5,"invest":400,"status":"Delivered","priority":"Medium","origin":"UP Met Kanpur (UP)","dest":"Adani Mundra (GJ)","shipDate":"2026-07-25","transit":1,"zone":"North","remarks":"V2O5 98.5% solar-grade for Adani 5MW solar panel vanadium oxide anti-reflective coating &#8594; 94.5% V2O5 &#8594; &#8377;400Cr for 60 tonnes &#8594; India &#8377;2,600Cr V2O5 solar &#8594; Adani 10 GW &#8594; 98.5% purity &#8594; &#8594; Solution &#8594; &#8594; V2O5Sol &#8594; &#8594; Solar"},
    {"id":"VPN-0012","batchNo":"VPN-B2412","city":"Visakhapatnam","manufacturer":"Vizag Metals","grade":"V2O5 99.7% Submarine Alloy","application":"GRSE Project 75I Hull Steel","purity":99.7,"prop":97.0,"invest":940,"status":"Delayed","priority":"Critical","origin":"Vizag Met Visakhapatnam (AP)","dest":"GRSE Kolkata (WB)","shipDate":"2026-07-26","transit":2,"zone":"East","remarks":"V2O5 99.7% submarine-grade for GRSE Project 75I hull HSLA vanadium alloy steel &#8597; 97% V2O5 &#8597; &#8377;940Cr for 70 tonnes &#8597; India &#8377;7,600Cr V2O5 submarine &#8597; GRSE 6 submarines &#8597; 99.7% purity &#8597; &#8594; Powder &#8597; &#8594; V2O5Sub &#8597; &#8594; Naval"},
    {"id":"VPN-0013","batchNo":"VPN-B2413","city":"Bhopal","manufacturer":"DRDO TBRL","grade":"V2O5 99.8% Missile Airframe","application":"DRDO BrahMos Vk2 Airframe","purity":99.8,"prop":97.5,"invest":860,"status":"In Transit","priority":"Critical","origin":"DRDO Hyderabad (TG)","dest":"BHEL Hyderabad (TG)","shipDate":"2026-07-27","transit":3,"zone":"Central","remarks":"V2O5 99.8% missile-grade for DRDO BrahMos Mk2 airframe titanium-vanadium alloy &#8594; 97.5% V2O5 &#8594; &#8377;860Cr for 45 tonnes &#8594; India &#8377;6,200Cr V2O5 missile &#8594; DRDO 200 missiles &#8594; 99.8% purity &#8594; &#8594; Powder &#8594; &#8594; V2O5Msl &#8594; &#8594; Defense"},
    {"id":"VPN-0014","batchNo":"VPN-B2414","city":"Rourkela","manufacturer":"SAIL Vanadium","grade":"V2O5 95% Rebar Strength","application":"SAIL Rourkela TMT Rebar","purity":95.0,"prop":91.0,"invest":320,"status":"Delivered","priority":"Low","origin":"SAIL Rourkela (OD)","dest":"SAIL Bhilai (CG)","shipDate":"2026-07-28","transit":4,"zone":"East","remarks":"V2O5 95% rebar-grade for SAIL Rourkela TMT rebar vanadium microalloy strengthening &#8594; 91% V2O5 &#8594; &#8377;320Cr for 200 tonnes &#8594; India &#8377;2,000Cr V2O5 rebar &#8594; SAIL 500K tonnes &#8594; 95.0% purity &#8594; &#8594; Powder &#8594; &#8594; V2O5Rebar &#8594; &#8594; Construction"},
]
vp_il = [{"title":"Energy Storage Revolution","body":"NTPC 50MWh VRFB &#8594; Adani solar coating &#8594; &#8377;1,300Cr combined &#8594; vanadium redox flow battery critical"},{"title":"Strategic Defense &amp; Nuclear","body":"DRDO BrahMos airframe &#8594; GRSE submarine hull &#8594; IGCAR control rod &#8594; &#8377;2,720Cr combined &#8594; national security"},{"title":"Industrial Backbone","body":"JSW HSLA &#8594; BHEL SCR &#8594; L&amp;T sulfuric &#8594; Indian Railways axle &#8594; &#8377;2,480Cr combined &#8594; heavy industry"},{"title":"Monsoon Alert","body":"VPN-B2412 GRSE Project 75I submarine hull steel delayed &#8594; monsoon Visakhapatnam &#8594; naval programme at risk"}]
vp_ir = [{"title":"Total Portfolio: &#8377;8,760 Cr","body":"Across 14 V2O5 grades spanning VRFB, superalloy, HSLA, tool steel, catalyst, emission, ceramic, rail, petro, nuclear, solar, missile, rebar &#8594; avg purity 98.72%"},{"title":"Critical Priority: 7 Records","body":"NTPC &#8594; HAL Tejas &#8594; BHEL SCR &#8594; IGCAR &#8594; GRSE submarine &#8594; DRDO BrahMos &#8594; DRDO TBRL"},{"title":"Top Manufacturers","body":"MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Godrej &#8594; Gujarat Vanadium &#8594; SAIL"},{"title":"V2O5 Content Spectrum","body":"91-98.5% V2O5 content range &#8594; nuclear 98.5% highest &#8594; rebar 91% lowest &#8594; content defines application grade"}]

# Generate and write
gi_code = gen_module("germanium-ingot","Germanium Ingot Logistics","Eyelucide","#b45309","amber","grade","Refractive Index (nD)","specProp",gi,gi_il,gi_ir)
vp_code = gen_module("vanadium-pentoxide","Vanadium Pentoxide Logistics","Zap","#dc2626","red","grade","V2O5 Content (%)","specProp",vp,vp_il,vp_ir)

for mod, code in [("germanium-ingot", gi_code), ("vanadium-pentoxide", vp_code)]:
    path = MODULES_DIR + "/" + mod + "-logistics-view.tsx"
    with open(path, "w") as f:
        f.write(code)
    print(f"Written {mod}: {len(code.splitlines())} lines")
    ents = re.findall(r"&#(\d+);", code)
    bad = [e for e in ents if int(e) > 9999]
    print(f"  {len(ents)} HTML entities, {len(bad)} malformed")
