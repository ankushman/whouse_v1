"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { CircuitBoard } from 'lucide-react';

interface TungstenCopperRecord {
  id: string; batchNo: string; city: string; manufacturer: string; wcGrade: string;
  application: string; purityPercent: number; conductivityIACS: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const tungstenCopperRecords: TungstenCopperRecord[] = [
  { id: 'TGC-0001', batchNo: 'TGC-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', wcGrade: 'WCu-80/20 EDM-A', application: 'HAL Tejas Mk2 Turbine Blade Cooling Hole', purityPercent: 99.2, conductivityIACS: 45, investmentCr: 820, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'W-Cu 80/20 EDM electrode for HAL Tejas Mk2 F414 turbine blade film cooling hole micro-EDM drilling &#8594; 80% W &#8594; &#8377;820Cr for 120 tonnes &#8594; India &#8377;5,400Cr W-Cu EDM &#8594; HAL 40 aircraft &#8594; 45% IACS &#8594; &#8594; Rod &#8594; &#8594; WCu80 &#8594; &#8594; Aerospace' },
  { id: 'TGC-0002', batchNo: 'TGC-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', wcGrade: 'WCu-70/30 Contact', application: 'BEL AESA Radar T/R Module Base', purityPercent: 98.8, conductivityIACS: 52, investmentCr: 740, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'W-Cu 70/30 high-voltage contact for BEL AESA radar transmit-receive module heat spreader base plate &#8594; 70% W &#8594; &#8377;740Cr for 85 tonnes &#8594; India &#8377;5,200Cr W-Cu radar &#8594; BEL 12 radars &#8594; 52% IACS &#8594; &#8594; Plate &#8594; &#8594; WCu70 &#8594; &#8594; Defense' },
  { id: 'TGC-0003', batchNo: 'TGC-B2403', city: 'Chennai', manufacturer: 'Sterlite Technologies', wcGrade: 'WCu-90/10 Heat Sink', application: 'ISRO GSLV Mk3 Nozzle Throat Insert', purityPercent: 99.5, conductivityIACS: 38, investmentCr: 960, status: 'Delivered', priority: 'Critical', origin: 'Sterlite Pune (MH)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'W-Cu 90/10 ultra-high thermal conductivity for ISRO GSLV Mk3 cryogenic engine nozzle throat insert &#8594; 90% W &#8594; &#8377;960Cr for 60 tonnes &#8594; India &#8377;7,800Cr W-Cu space &#8594; ISRO 8 launches &#8594; 38% IACS &#8594; &#8594; Insert &#8594; &#8594; WCu90 &#8594; &#8594; Space' },
  { id: 'TGC-0004', batchNo: 'TGC-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', wcGrade: 'WCu-75/25 Resistance Weld', application: 'SAIL Blast Furnace Electrode', purityPercent: 98.5, conductivityIACS: 48, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-18', transitDays: 4, zone: 'West', remarks: 'W-Cu 75/25 resistance welding electrode for SAIL Bhilai blast furnace electrode holder and spot welding &#8594; 75% W &#8594; &#8377;480Cr for 200 tonnes &#8594; India &#8377;3,200Cr W-Cu electrode &#8594; SAIL 6 furnaces &#8594; 48% IACS &#8594; &#8594; Tip &#8594; &#8594; WCu75 &#8594; &#8594; Steel' },
  { id: 'TGC-0005', batchNo: 'TGC-B2405', city: 'Kolkata', manufacturer: 'Hindustan Copper', wcGrade: 'WCu-60/40 Arc', application: 'Tata Power 765kV GIS Contact', purityPercent: 98.2, conductivityIACS: 58, investmentCr: 420, status: 'In Transit', priority: 'High', origin: 'HCL Ghatsila (JH)', destination: 'Tata Power Mumbai (MH)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'W-Cu 60/40 arc contact for Tata Power 765kV gas-insulated switchgear make-break arcing contact &#8594; 60% W &#8594; &#8377;420Cr for 150 tonnes &#8594; India &#8377;2,800Cr W-Cu GIS &#8594; Tata 40 bays &#8594; 58% IACS &#8594; &#8594; Contact &#8594; &#8594; WCu60 &#8594; &#8594; Power' },
  { id: 'TGC-0006', batchNo: 'TGC-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&D', wcGrade: 'WCu-85/15 Plasma', application: 'BHEL 800MW Plasma Torch Electrode', purityPercent: 99.1, conductivityIACS: 42, investmentCr: 680, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'W-Cu 85/15 plasma electrode for BHEL 800MW gasifier plasma torch cathode and anode &#8594; 85% W &#8594; &#8377;680Cr for 95 tonnes &#8594; India &#8377;4,600Cr W-Cu plasma &#8594; BHEL 20 torches &#8594; 42% IACS &#8594; &#8594; Electrode &#8594; &#8594; WCu85 &#8594; &#8594; Power' },
  { id: 'TGC-0007', batchNo: 'TGC-B2407', city: 'Pune', manufacturer: 'Tata Advanced Materials', wcGrade: 'WCu-80/20 Chip Sub', application: 'L&T Naval GT Heat Spreader', purityPercent: 99.0, conductivityIACS: 45, investmentCr: 720, status: 'Delivered', priority: 'High', origin: 'Tata Adv Materials Pune (MH)', destination: 'L&T Mumbai (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'W-Cu 80/20 chip-level heat spreader substrate for L&amp;T naval gas turbine ECU power module &#8594; 80% W &#8594; &#8377;720Cr for 80 tonnes &#8594; India &#8377;5,000Cr W-Cu thermal &#8594; L&amp;T 30 GTs &#8594; 45% IACS &#8594; &#8594; Substrate &#8594; &#8594; WCu80 &#8594; &#8594; Naval' },
  { id: 'TGC-0008', batchNo: 'TGC-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Minerals', wcGrade: 'WCu-50/50 Solder', application: 'Wipro Solder Ball Array', purityPercent: 97.8, conductivityIACS: 62, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Minerals Jodhpur (RJ)', destination: 'Wipro Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'W-Cu 50/50 heavy solder for Wipro semiconductor packaging ball grid array and flip-chip interconnect &#8594; 50% W &#8594; &#8377;340Cr for 40 tonnes &#8594; India &#8377;2,200Cr W-Cu solder &#8594; Wipro 100M chips &#8594; 62% IACS &#8594; &#8594; Preform &#8594; &#8594; WCu50 &#8594; &#8594; Electronics' },
  { id: 'TGC-0009', batchNo: 'TGC-B2409', city: 'Guwahati', manufacturer: 'Assam Tungsten', wcGrade: 'WCu-70/30 Mold', application: 'Jio 5G Base Station Heat Sink', purityPercent: 98.6, conductivityIACS: 52, investmentCr: 520, status: 'In Transit', priority: 'High', origin: 'Assam Tungsten Tezpur (AS)', destination: 'Jio Mumbai (MH)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'W-Cu 70/30 injection mold insert for Reliance Jio 5G massive MIMO base station RF power amplifier heat sink &#8594; 70% W &#8594; &#8377;520Cr for 110 tonnes &#8594; India &#8377;3,600Cr W-Cu 5G &#8594; Jio 100K stations &#8594; 52% IACS &#8594; &#8594; Insert &#8594; &#8594; WCu70 &#8594; &#8594; Telecom' },
  { id: 'TGC-0010', batchNo: 'TGC-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Tungsten Corp', wcGrade: 'WCu-90/10 Nuclear', application: 'IGCAR PFBR Control Rod Drive', purityPercent: 99.6, conductivityIACS: 36, investmentCr: 880, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Tungsten Ahmedabad (GJ)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'W-Cu 90/10 nuclear-grade for IGCAR Prototype Fast Breeder Reactor control rod drive mechanism bearing &#8594; 90% W &#8594; &#8377;880Cr for 45 tonnes &#8594; India &#8377;7,200Cr W-Cu nuclear &#8594; IGCAR 2 reactors &#8594; 36% IACS &#8594; &#8594; Bearing &#8594; &#8594; WCu90 &#8594; &#8594; Nuclear' },
  { id: 'TGC-0011', batchNo: 'TGC-B2411', city: 'Lucknow', manufacturer: 'UP Tungsten Works', wcGrade: 'WCu-65/35 HV', application: 'Adani High Voltage Breaker', purityPercent: 98.4, conductivityIACS: 55, investmentCr: 460, status: 'Delivered', priority: 'Medium', origin: 'UP Tungsten Kanpur (UP)', destination: 'Adani Mundra (GJ)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'W-Cu 65/35 high-voltage contact for Adani Power 400kV SF6 circuit breaker arcing contact assembly &#8594; 65% W &#8594; &#8377;460Cr for 130 tonnes &#8594; India &#8377;3,000Cr W-Cu breaker &#8594; Adani 60 breakers &#8594; 55% IACS &#8594; &#8594; Contact &#8594; &#8594; WCu65 &#8594; &#8594; Power' },
  { id: 'TGC-0012', batchNo: 'TGC-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Tungsten Works', wcGrade: 'WCu-85/15 Submarine', application: 'GRSE Project 75I Torpedo Guide', purityPercent: 99.3, conductivityIACS: 40, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Tungsten Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'W-Cu 85/15 submarine-grade for GRSE Project 75I torpedo tube guide rail and EMI shield bracket &#8594; 85% W &#8594; &#8377;940Cr for 55 tonnes &#8597; India &#8377;7,600Cr W-Cu submarine &#8594; GRSE 6 submarines &#8594; 40% IACS &#8597; &#8594; Rail &#8594; &#8594; WCu85 &#8594; &#8594; Naval' },
  { id: 'TGC-0013', batchNo: 'TGC-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', wcGrade: 'WCu-80/20 Missile', application: 'DRDO BrahMos Seeker Housing', purityPercent: 99.2, conductivityIACS: 44, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'DRDO Chandipur (OD)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'W-Cu 80/20 missile-grade for DRDO BrahMos Mk2 seeker housing RF window and thermal management &#8594; 80% W &#8594; &#8377;860Cr for 70 tonnes &#8594; India &#8377;6,400Cr W-Cu missile &#8594; DRDO 200 missiles &#8594; 44% IACS &#8594; &#8594; Housing &#8594; &#8594; WCu80 &#8594; &#8594; Defense' },
  { id: 'TGC-0014', batchNo: 'TGC-B2414', city: 'Rourkela', manufacturer: 'SAIL Tungsten Div', wcGrade: 'WCu-60/40 Auto', application: 'Mahindra EV Motor Brush', purityPercent: 98.0, conductivityIACS: 58, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Mahindra Pune (MH)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'W-Cu 60/40 brush-grade for Mahindra XUV400 electric motor commutator brush and spring holder &#8594; 60% W &#8594; &#8377;380Cr for 100 tonnes &#8594; India &#8377;2,400Cr W-Cu EV &#8594; Mahindra 50K motors &#8594; 58% IACS &#8594; &#8594; Brush &#8594; &#8594; WCu60 &#8594; &#8594; Auto' },
];

export default function TungstenCopperLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: CircuitBoard },
    { id: 'registry', label: 'Registry', icon: CircuitBoard },
    { id: 'analytics', label: 'Analytics', icon: CircuitBoard },
    { id: 'insights', label: 'Insights', icon: CircuitBoard },
  ];

  const filteredRecords = useMemo(() => {
    return tungstenCopperRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.wcGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    tungstenCopperRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = tungstenCopperRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = tungstenCopperRecords.reduce((s: number, r) => s + r.purityPercent, 0) / tungstenCopperRecords.length;
    const delayed = tungstenCopperRecords.filter((r) => r.status === 'Delayed').length;
    const critical = tungstenCopperRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#4f46e5';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Tungsten Copper Logistics" description="Indian tungsten copper (W-Cu) EDM electrode, thermal management, high-voltage contact, defense and nuclear supply chain tracking across 14 grades" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-indigo-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-indigo-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-indigo-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-indigo-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-indigo-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-indigo-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-indigo-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-indigo-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-indigo-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / tungstenCopperRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = tungstenCopperRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tungstenCopperRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.wcGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.wcGrade}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Conductivity:</span><span className="font-medium">{record.conductivityIACS}% IACS</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {tungstenCopperRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; tungstenCopperRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = tungstenCopperRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; tungstenCopperRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; tungstenCopperRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / tungstenCopperRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-indigo-500 bg-indigo-50/50"><div className="font-medium">Aerospace &amp; Defense Dominance</div><div className="text-xs text-muted-foreground mt-1">HAL Tejas Mk2 turbine blade &#8594; DRDO BrahMos seeker &#8594; BEL AESA radar T/R module driving &#8594; &#8377;2,420Cr combined &#8594; highest priority segment</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-indigo-500 bg-indigo-50/50"><div className="font-medium">Space &amp; Nuclear Programme</div><div className="text-xs text-muted-foreground mt-1">ISRO GSLV Mk3 nozzle throat &#8594; IGCAR PFBR control rod &#8594; DRDO plasma torch driving &#8594; &#8377;2,520Cr combined &#8594; strategic national assets</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-indigo-500 bg-indigo-50/50"><div className="font-medium">Power &amp; Heavy Electrical</div><div className="text-xs text-muted-foreground mt-1">BHEL 800MW plasma torch &#8594; Tata Power GIS contact &#8594; Adani HV breaker &#8594; SAIL furnace electrode &#8594; &#8377;2,040Cr combined &#8594; grid infrastructure</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-indigo-500 bg-indigo-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">TGC-B2412 GRSE Project 75I torpedo guide delayed &#8594; monsoon Visakhapatnam port congestion &#8594; submarine programme timeline at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-indigo-500 bg-indigo-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 W-Cu grades spanning aerospace, defense, nuclear, space, power, telecom, EV and semiconductor &#8594; avg purity {kpiData.avgPurity}%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-indigo-500 bg-indigo-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">HAL turbine &#8594; BEL radar &#8594; ISRO nozzle &#8594; BHEL plasma &#8594; L&amp;T naval GT &#8594; IGCAR nuclear &#8594; GRSE submarine &#8594; DRDO missile</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-indigo-500 bg-indigo-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL lead strategic demand &#8594; Sterlite &#8594; Bharat Forge &#8594; Tata Advanced drive commercial</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-indigo-500 bg-indigo-50/50"><div className="font-medium">Regional Concentration</div><div className="text-xs text-muted-foreground mt-1">South zone leads with Hyderabad &#8594; Bengaluru &#8594; Chennai &#8594; Coimbatore &#8594; West zone Pune &#8594; Ahmedabad &#8594; East zone emerging</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
