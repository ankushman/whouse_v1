"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Mountain } from 'lucide-react';

interface GraphitePowderRecord {
  id: string;
  batchNo: string;
  city: string;
  manufacturer: string;
  oxideGrade: string;
  application: string;
  purityPercent: number;
  hardnessGPa: number;
  investmentCr: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const graphitePowderRecords: GraphitePowderRecord[] = [
  { id: 'GTP-0001', batchNo: 'GTP-B2401', city: 'Mumbai', manufacturer: 'Hindustan Electrodes', oxideGrade: 'GP-HP Electrode', application: 'SAIL Blast Furnace', purityPercent: 99.8, hardnessGPa: 4.2, investmentCr: 780, status: 'Delivered', priority: 'Critical', origin: 'Hindustan Electrodes Nagpur (MH)', destination: 'SAIL Rourkela (OD)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'High-power electrode for SAIL Rourkela blast furnace &#8594; 300mm dia GP &#8594; &#8377;780Cr for 12,000 tonnes &#8594; India &#8377;6,200Cr electrode &#8594; SAIL 5 furnaces &#8594; 4.2 Shore &#8594; &#8594; EAF &#8594; &#8594; 3500&#176;C &#8594; &#8594; Electrode' },
  { id: 'GTP-0002', batchNo: 'GTP-B2402', city: 'Bengaluru', manufacturer: 'Graphite India Ltd', oxideGrade: 'GP-Isostatic Fine', application: 'ISRO Nozzle', purityPercent: 99.9, hardnessGPa: 5.8, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'Graphite India Bengaluru (KA)', destination: 'ISRO Thiruvananthapuram (KL)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Isostatically pressed fine graphite for ISRO PSLV Vikas engine C-D nozzle throat insert &#8594; 99.9% C &#8594; &#8377;860Cr for 800 tonnes &#8594; India &#8377;5,400Cr aerospace &#8594; ISRO 60 nozzles &#8594; 5.8 GPa &#8594; &#8594; C/SiC throat &#8594; &#8594; 2800&#176;C &#8594; &#8594; Nozzle' },
  { id: 'GTP-0003', batchNo: 'GTP-B2403', city: 'Hyderabad', manufacturer: 'HEG Ltd', oxideGrade: 'GP-Flake Natural', application: 'BEL Lithium Cell', purityPercent: 99.7, hardnessGPa: 3.1, investmentCr: 720, status: 'Delivered', priority: 'High', origin: 'HEG Ltd Bhopal (MP)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-20', transitDays: 1, zone: 'Central', remarks: 'Natural flake graphite anode material for BEL Li-ion battery cell manufacturing &#8594; +100 mesh flake &#8594; &#8377;720Cr for 5,000 tonnes &#8594; India &#8377;3,600Cr anode &#8594; BEL 200M cells &#8594; 3.1 Mohs &#8594; &#8594; Spheroidized &#8594; &#8594; 350mAh/g &#8594; &#8594; Battery' },
  { id: 'GTP-0004', batchNo: 'GTP-B2404', city: 'Chennai', manufacturer: 'Tata Steel Special', oxideGrade: 'GP-Nuclear Grade', application: 'IGCAR Moderator', purityPercent: 99.99, hardnessGPa: 5.5, investmentCr: 940, status: 'Delivered', priority: 'Critical', origin: 'Tata Steel Jamshedpur (JH)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-22', transitDays: 1, zone: 'East', remarks: 'Nuclear-grade graphite reflector for IGCAR AHWR pressure tube moderator &#8594; IG-110 equivalent &#8594; &#8377;940Cr for 2,400 tonnes &#8594; India &#8377;8,200Cr nuclear C &#8594; IGCAR 12 cores &#8594; 5.5 GPa &#8594; &#8594; PGA &#8594; &#8594; 600&#176;C &#8594; &#8594; Nuclear' },
  { id: 'GTP-0005', batchNo: 'GTP-B2405', city: 'Pune', manufacturer: 'DRDO DMRL', oxideGrade: 'GP-Carbon Fiber', application: 'DRDO Light Combat', purityPercent: 99.6, hardnessGPa: 6.2, investmentCr: 680, status: 'In Transit', priority: 'High', origin: 'DRDO Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: 'PAN-based carbon fiber precursor graphite for DRDO LCA Mk2 airframe CFRP wing skin &#8594; T800 grade &#8594; &#8377;680Cr for 600 tonnes &#8594; India &#8377;9,400Cr CF &#8594; DRDO 200 aircraft &#8594; 6.2 GPa &#8594; &#8594; CFRP &#8594; &#8594; 1800&#176;C &#8594; &#8594; Defence' },
  { id: 'GTP-0006', batchNo: 'GTP-B2406', city: 'Kolkata', manufacturer: 'Graphite India Ltd', oxideGrade: 'GP-Vibrator Mold', application: 'Reliance Foundry', purityPercent: 99.5, hardnessGPa: 3.8, investmentCr: 520, status: 'Delivered', priority: 'Medium', origin: 'Graphite India Kolkata (WB)', destination: 'Reliance Jamnagar (GJ)', shipDate: '2026-07-26', transitDays: 3, zone: 'East', remarks: 'Vibrocast graphite mold stock for Reliance Jamnagar refinery continuous caster &#8594; 600mm round &#8594; &#8377;520Cr for 3,000 tonnes &#8594; India &#8377;2,800Cr mold &#8594; Reliance 8 lines &#8594; 3.8 Shore &#8594; &#8594; Vibrocast &#8594; &#8594; 1400&#176;C &#8594; &#8594; Mold' },
  { id: 'GTP-0007', batchNo: 'GTP-B2407', city: 'Ahmedabad', manufacturer: 'Gujarat Graphite Corp', oxideGrade: 'GP-Expanded Worm', application: 'Carl Zeiss Seal', purityPercent: 99.4, hardnessGPa: 2.5, investmentCr: 480, status: 'In Transit', priority: 'Medium', origin: 'Gujarat Graphite Morbi (GJ)', destination: 'Godrej Mumbai (MH)', shipDate: '2026-07-28', transitDays: 1, zone: 'West', remarks: 'Expandable graphite worm for Carl Zeiss precision optic lens cell sealing &#8594; 50x expansion &#8594; &#8377;480Cr for 1,200 tonnes &#8594; India &#8377;1,800Cr seal &#8594; Zeiss 4M units &#8594; 2.5 Mohs &#8594; &#8594; Intumescent &#8594; &#8594; 280&#176;C &#8594; &#8594; Seal' },
  { id: 'GTP-0008', batchNo: 'GTP-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Graphite', oxideGrade: 'GP-Synthetic High', application: 'BHEL Turbine Seal', purityPercent: 99.95, hardnessGPa: 7.1, investmentCr: 620, status: 'Delivered', priority: 'High', origin: 'Rajasthan Graphite Udaipur (RJ)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-30', transitDays: 2, zone: 'West', remarks: 'High-density synthetic graphite for BHEL steam turbine gland seal rings &#8594; 1.82 g/cc &#8594; &#8377;620Cr for 1,800 tonnes &#8594; India &#8377;4,200Cr seal &#8594; BHEL 40 turbines &#8594; 7.1 GPa &#8594; &#8594; Mech seal &#8594; &#8594; 500&#176;C &#8594; &#8594; Turbine' },
  { id: 'GTP-0009', batchNo: 'GTP-B2409', city: 'Guwahati', manufacturer: 'Assam Graphite Mine', oxideGrade: 'GP-Amorphous Chip', application: 'Adani Solar Panel', purityPercent: 99.3, hardnessGPa: 2.8, investmentCr: 540, status: 'In Transit', priority: 'Medium', origin: 'Assam Graphite Karbi Anglong (AS)', destination: 'Adani Mundra (GJ)', shipDate: '2026-08-01', transitDays: 4, zone: 'East', remarks: 'Amorphous chip graphite conductive additive for Adani Solar PERC cell paste &#8594; 30um D50 &#8594; &#8377;540Cr for 4,000 tonnes &#8594; India &#8377;2,100Cr paste &#8594; Adani 5GW &#8594; 2.8 Mohs &#8594; &#8594; Conductive &#8594; &#8594; 850&#176;C &#8594; &#8594; Solar' },
  { id: 'GTP-0010', batchNo: 'GTP-B2410', city: 'Lucknow', manufacturer: 'UP Graphite Industries', oxideGrade: 'GP-EDM Block', application: 'Wipro 3D Print', purityPercent: 99.85, hardnessGPa: 6.5, investmentCr: 580, status: 'Delivered', priority: 'High', origin: 'UP Graphite Lucknow (UP)', destination: 'Wipro Bengaluru (KA)', shipDate: '2026-08-03', transitDays: 1, zone: 'North', remarks: 'CNC-grade EDM block graphite for Wipro 3D printed metal mold EDM finishing &#8594; 250x125x50mm &#8594; &#8377;580Cr for 2,000 tonnes &#8594; India &#8377;3,800Cr EDM &#8594; Wipro 100K molds &#8594; 6.5 GPa &#8594; &#8594; Wire EDM &#8594; &#8594; &#8594; EDM' },
  { id: 'GTP-0011', batchNo: 'GTP-B2411', city: 'Coimbatore', manufacturer: 'TN Graphite Corp', oxideGrade: 'GP-Lubricant Fine', application: 'L&T Heavy Gear', purityPercent: 99.2, hardnessGPa: 1.5, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'TN Graphite Coimbatore (TN)', destination: 'L&T Mumbai (MH)', shipDate: '2026-08-05', transitDays: 1, zone: 'South', remarks: 'Colloidal graphite lubricant powder for L&T heavy gearbox wind turbine main bearing &#8594; 5um D50 &#8594; &#8377;420Cr for 3,500 tonnes &#8594; India &#8377;1,400Cr lubricant &#8594; L&T 500 gearboxes &#8594; 1.5 Mohs &#8594; &#8594; Dry film &#8594; &#8594; 450&#176;C &#8594; &#8594; Lubricant' },
  { id: 'GTP-0012', batchNo: 'GTP-B2412', city: 'Visakhapatnam', manufacturer: 'NALCO Graphite', oxideGrade: 'GP-Extruded Rod', application: 'HAL Landing Gear', purityPercent: 99.88, hardnessGPa: 5.2, investmentCr: 640, status: 'Delayed', priority: 'Critical', origin: 'NALCO Vishakapatnam (AP)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-08-07', transitDays: 1, zone: 'East', remarks: 'Extruded graphite rod stock for HAL Tejas Mk2 landing gear brake carbon disc &#8594; 200mm dia &#8594; &#8377;640Cr for 1,500 tonnes &#8594; India &#8377;5,200Cr brake &#8594; HAL 120 sets &#8594; 5.2 GPa &#8594; &#8594; C/C composite &#8594; &#8594; 1200&#176;C &#8594; &#8594; Aero' },
  { id: 'GTP-0013', batchNo: 'GTP-B2413', city: 'Bhopal', manufacturer: 'BHEL Graphite Div', oxideGrade: 'GP-High Density', application: 'NPCIL Reactor', purityPercent: 99.97, hardnessGPa: 6.8, investmentCr: 890, status: 'In Transit', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'NPCIL Kakrapar (GJ)', shipDate: '2026-08-09', transitDays: 2, zone: 'Central', remarks: 'Ultra-high density graphite for NPCIL PHWR 700 core shielding and reflector blocks &#8594; 1.85 g/cc &#8594; &#8377;890Cr for 3,200 tonnes &#8594; India &#8377;9,800Cr nuclear &#8594; NPCIL 6 reactors &#8594; 6.8 GPa &#8594; &#8594; Shielding &#8594; &#8594; 650&#176;C &#8594; &#8594; Nuclear' },
  { id: 'GTP-0014', batchNo: 'GTP-B2414', city: 'Rourkela', manufacturer: 'SAIL Graphite Works', oxideGrade: 'GP-Recycled Reclaim', application: 'Tata Steel EAF', purityPercent: 99.1, hardnessGPa: 3.2, investmentCr: 380, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-08-11', transitDays: 1, zone: 'East', remarks: 'Recycled reclaimed graphite for Tata Steel EAF secondary steelmaking recarburizer &#8594; 90% fixed C &#8594; &#8377;380Cr for 8,000 tonnes &#8594; India &#8377;1,200Cr reclaim &#8594; Tata 6 furnaces &#8594; 3.2 Mohs &#8594; &#8594; Recarburizer &#8594; &#8594; 1600&#176;C &#8594; &#8594; Steel' },
];

export default function GraphitePowderLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Mountain },
    { id: 'registry', label: 'Registry', icon: Mountain },
    { id: 'analytics', label: 'Analytics', icon: Mountain },
    { id: 'insights', label: 'Insights', icon: Mountain },
  ];

  const filteredRecords = useMemo(() => {
    return graphitePowderRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.oxideGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    graphitePowderRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = graphitePowderRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = graphitePowderRecords.reduce((s: number, r) => s + r.purityPercent, 0) / graphitePowderRecords.length;
    const delayed = graphitePowderRecords.filter((r) => r.status === 'Delayed').length;
    const critical = graphitePowderRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#64748b';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Graphite Powder Logistics" description="Indian graphite electrode, anode, nuclear and EDM supply chain tracking across 14 grades" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-slate-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-slate-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-slate-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-slate-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-slate-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-slate-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-slate-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-slate-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-slate-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / graphitePowderRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = graphitePowderRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {graphitePowderRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.oxideGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.oxideGrade}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {graphitePowderRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; graphitePowderRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = graphitePowderRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; graphitePowderRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99.95%+': 0, '99.8-99.94%': 0, '99.5-99.79%': 0, '&lt;99.5%': 0 }; graphitePowderRecords.forEach((r) => { if (r.purityPercent >= 99.95) ranges['99.95%+']++; else if (r.purityPercent >= 99.8) ranges['99.8-99.94%']++; else if (r.purityPercent >= 99.5) ranges['99.5-99.79%']++; else ranges['&lt;99.5%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / graphitePowderRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Nuclear Grade Demand Surge</div><div className="text-xs text-muted-foreground mt-1">IGCAR AHWR and NPCIL PHWR 700 programmes driving 1,700 tonnes nuclear-grade graphite demand with 99.99%+ purity requirement &#8594; &#8377;1,830Cr combined</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Li-ion Anode Material Shift</div><div className="text-xs text-muted-foreground mt-1">BEL and Adani driving flake graphite demand &#8594; spheroidized natural flake transitioning from imported to domestic Gujarat source &#8594; &#8377;1,260Cr</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">EDM Sector Growth</div><div className="text-xs text-muted-foreground mt-1">Wipro 3D printing mould finishing and HAL brake disc manufacturing drive CNC-grade EDM graphite &#8594; &#8377;1,220Cr for isostatic + extruded grades</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">GTP-B2412 HAL landing gear brake disc delayed 28 days &#8594; monsoon flooding Visakhapatnam NALCO port &#8594; HAL Mk2 assembly line risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 graphite grades spanning electrode, nuclear, battery, EDM, seal and lubricant sectors &#8594; avg purity {kpiData.avgPurity}% &#8594; 7 manufacturers active</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Critical Priority: 6 Records</div><div className="text-xs text-muted-foreground mt-1">Nuclear-grade IGCAR &#8594; NPCIL &#8594; ISRO nozzle &#8594; DRDO airframe &#8594; BHEL turbine &#8594; HAL brake disc all flagged critical delivery</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Top 3 Manufacturers by Investment</div><div className="text-xs text-muted-foreground mt-1">IGCAR &#8594; NPCIL &#8594; ISRO lead demand &#8594; domestic HEG &#8594; Graphite India &#8594; NALCO ramping nuclear-grade capacity</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Zone Concentration</div><div className="text-xs text-muted-foreground mt-1">East zone dominates with SAIL &#8594; NALCO &#8594; Assam supply &#8594; West zone Gujarat emerging as flake graphite hub &#8594; South zone aerospace demand</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
