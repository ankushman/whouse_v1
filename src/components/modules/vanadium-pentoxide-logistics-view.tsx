"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Zap } from 'lucide-react';

interface VanadiumPentoxideRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; specProp: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const vanadiumpentoxideRecords: VanadiumPentoxideRecord[] = [
  { id: 'VPN-0001', batchNo: 'VPN-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', grade: 'V2O5 99.9% VRFB Grade', application: 'NTPC 50MWh Vanadium Flow Battery', purityPercent: 99.9, specProp: 98.0, investmentCr: 900, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'NTPC Delhi (DL)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'V2O5 99.9% VRFB electrolyte for NTPC 50MWh grid-scale vanadium redox flow battery &amp;#8594; 98% V2O5 &amp;#8594; &amp;#8377;900Cr for 200 tonnes &amp;#8594; India &amp;#8377;6,800Cr V2O5 energy &amp;#8594; NTPC 10 stations &amp;#8594; 99.9% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; V2O5VRFB &amp;#8594; &amp;#8594; Energy Storage' },
  { id: 'VPN-0002', batchNo: 'VPN-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', grade: 'V2O5 99.7% Superalloy', application: 'HAL Tejas Mk2 Ti-6Al-4V Stabilizer', purityPercent: 99.7, specProp: 97.0, investmentCr: 820, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'V2O5 99.7% alloy-grade for HAL Tejas Mk2 Ti-6Al-4V vanadium stabilizer additive &amp;#8594; 97% V2O5 &amp;#8594; &amp;#8377;820Cr for 80 tonnes &amp;#8594; India &amp;#8377;5,800Cr V2O5 aero &amp;#8594; HAL 40 aircraft &amp;#8594; 99.7% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; V2O5Aero &amp;#8594; &amp;#8594; Aerospace' },
  { id: 'VPN-0003', batchNo: 'VPN-B2403', city: 'Chennai', manufacturer: 'Tata Steel', grade: 'V2O5 99.5% HSLA Steel', application: 'JSW Steel HSLA Plate', purityPercent: 99.5, specProp: 96.0, investmentCr: 680, status: 'Delivered', priority: 'High', origin: 'Tata Steel Jamshedpur (JH)', destination: 'JSW Vijayanagar (KA)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'V2O5 99.5% steel-grade for JSW HSLA vanadium microalloyed steel plate rolling &amp;#8594; 96% V2O5 &amp;#8594; &amp;#8377;680Cr for 150 tonnes &amp;#8594; India &amp;#8377;4,600Cr V2O5 steel &amp;#8594; JSW 12 mills &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; V2O5Steel &amp;#8594; &amp;#8594; Steel' },
  { id: 'VPN-0004', batchNo: 'VPN-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', grade: 'V2O5 99.6% Tool Steel', application: 'Bharat Forge H13 Die Steel', purityPercent: 99.6, specProp: 96.5, investmentCr: 580, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Bharat Forge Baramati (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'V2O5 99.6% tool-grade for Bharat Forge H13 hot work tool steel grain refiner &amp;#8594; 96.5% V2O5 &amp;#8594; &amp;#8377;580Cr for 100 tonnes &amp;#8594; India &amp;#8377;3,800Cr V2O5 tool &amp;#8594; Bharat Forge 5M dies &amp;#8594; 99.6% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; V2O5Tool &amp;#8594; &amp;#8594; Manufacturing' },
  { id: 'VPN-0005', batchNo: 'VPN-B2405', city: 'Kolkata', manufacturer: 'Shyam Chemicals', grade: 'V2O5 98% Sulfuric Acid', application: 'L&amp;T Chemical Plant Catalyst', purityPercent: 98.0, specProp: 94.0, investmentCr: 560, status: 'In Transit', priority: 'High', origin: 'Shyam Chem Kolkata (WB)', destination: 'L&amp;T Mumbai (MH)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'V2O5 98% catalyst-grade for L&amp;amp;T chemical plant SO2-to-SO3 sulfuric acid contact catalyst &amp;#8594; 94% V2O5 &amp;#8594; &amp;#8377;560Cr for 120 tonnes &amp;#8594; India &amp;#8377;3,800Cr V2O5 catalyst &amp;#8594; L&amp;amp;T 5 plants &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Pellet &amp;#8594; &amp;#8594; V2O5Sulf &amp;#8594; &amp;#8594; Chemical' },
  { id: 'VPN-0006', batchNo: 'VPN-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&amp;D', grade: 'V2O5 99.8% SCR Catalyst', application: 'BHEL 800MW GT SCR DeNOx', purityPercent: 99.8, specProp: 97.5, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'V2O5 99.8% emission-grade for BHEL 800MW GT selective catalytic reduction DeNOx &amp;#8594; 97.5% V2O5 &amp;#8594; &amp;#8377;720Cr for 60 tonnes &amp;#8594; India &amp;#8377;5,000Cr V2O5 emission &amp;#8594; BHEL 20 GTs &amp;#8594; 99.8% purity &amp;#8594; &amp;#8594; Honeycomb &amp;#8594; &amp;#8594; V2O5SCR &amp;#8594; &amp;#8594; Power' },
  { id: 'VPN-0007', batchNo: 'VPN-B2407', city: 'Pune', manufacturer: 'Godrej Chemicals', grade: 'V2O5 99% Ceramic Glaze', application: 'RAK Ceramics V-Glaze Tile', purityPercent: 99.0, specProp: 95.0, investmentCr: 440, status: 'Delivered', priority: 'Medium', origin: 'Godrej Mumbai (MH)', destination: 'RAK Ceramics Delhi (DL)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'V2O5 99% ceramic-grade for RAK Ceramics vanadium glaze yellow tile pigment &amp;#8594; 95% V2O5 &amp;#8594; &amp;#8377;440Cr for 80 tonnes &amp;#8594; India &amp;#8377;2,800Cr V2O5 ceramic &amp;#8594; RAK 10M sqm &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; V2O5Cer &amp;#8594; &amp;#8594; Ceramics' },
  { id: 'VPN-0008', batchNo: 'VPN-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Metals', grade: 'V2O5 97% Railway Axle', application: 'Indian Railways Vanadium Axle', purityPercent: 97.0, specProp: 93.0, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'Rajasthan Met Jodhpur (RJ)', destination: 'BWEL Jhansi (UP)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'V2O5 97% rail-grade for Indian Railways forged vanadium axle microalloyed steel &amp;#8594; 93% V2O5 &amp;#8594; &amp;#8377;520Cr for 100 tonnes &amp;#8594; India &amp;#8377;3,400Cr V2O5 rail &amp;#8594; IR 50K axles &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; V2O5Rail &amp;#8594; &amp;#8594; Rail' },
  { id: 'VPN-0009', batchNo: 'VPN-B2409', city: 'Guwahati', manufacturer: 'Assam Metals', grade: 'V2O5 96% Petro Catalyst', application: 'IOC Guwahaty FCC Catalyst', purityPercent: 96.0, specProp: 92.0, investmentCr: 480, status: 'In Transit', priority: 'Medium', origin: 'Assam Met Tezpur (AS)', destination: 'IOC Guwahati (AS)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'V2O5 96% petro-grade for IOC Guwahati FCC fluid catalytic cracking additive &amp;#8594; 92% V2O5 &amp;#8594; &amp;#8377;480Cr for 90 tonnes &amp;#8594; India &amp;#8377;3,200Cr V2O5 petro &amp;#8594; IOC 3 refineries &amp;#8594; 96.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; V2O5Petro &amp;#8594; &amp;#8594; Oil &amp;amp; Gas' },
  { id: 'VPN-0010', batchNo: 'VPN-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Vanadium', grade: 'V2O5 99.99% Nuclear Shielding', application: 'IGCAR PFBR Control Rod', purityPercent: 99.99, specProp: 98.5, investmentCr: 920, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Van Ahmedabad (GJ)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'V2O5 99.99% nuclear-grade for IGCAR PFBR fast breeder control rod vanadium alloy &amp;#8594; 98.5% V2O5 &amp;#8594; &amp;#8377;920Cr for 40 tonnes &amp;#8594; India &amp;#8377;7,200Cr V2O5 nuclear &amp;#8594; IGCAR 2 reactors &amp;#8594; 99.99% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; V2O5Nuc &amp;#8594; &amp;#8594; Nuclear' },
  { id: 'VPN-0011', batchNo: 'VPN-B2411', city: 'Lucknow', manufacturer: 'UP Metals', grade: 'V2O5 98.5% Solar Coating', application: 'Adani Solar Anti-Reflective', purityPercent: 98.5, specProp: 94.5, investmentCr: 400, status: 'Delivered', priority: 'Medium', origin: 'UP Met Kanpur (UP)', destination: 'Adani Mundra (GJ)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'V2O5 98.5% solar-grade for Adani 5MW solar panel vanadium oxide anti-reflective coating &amp;#8594; 94.5% V2O5 &amp;#8594; &amp;#8377;400Cr for 60 tonnes &amp;#8594; India &amp;#8377;2,600Cr V2O5 solar &amp;#8594; Adani 10 GW &amp;#8594; 98.5% purity &amp;#8594; &amp;#8594; Solution &amp;#8594; &amp;#8594; V2O5Sol &amp;#8594; &amp;#8594; Solar' },
  { id: 'VPN-0012', batchNo: 'VPN-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Metals', grade: 'V2O5 99.7% Submarine Alloy', application: 'GRSE Project 75I Hull Steel', purityPercent: 99.7, specProp: 97.0, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Met Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'V2O5 99.7% submarine-grade for GRSE Project 75I hull HSLA vanadium alloy steel &amp;#8597; 97% V2O5 &amp;#8597; &amp;#8377;940Cr for 70 tonnes &amp;#8597; India &amp;#8377;7,600Cr V2O5 submarine &amp;#8597; GRSE 6 submarines &amp;#8597; 99.7% purity &amp;#8597; &amp;#8594; Powder &amp;#8597; &amp;#8594; V2O5Sub &amp;#8597; &amp;#8594; Naval' },
  { id: 'VPN-0013', batchNo: 'VPN-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', grade: 'V2O5 99.8% Missile Airframe', application: 'DRDO BrahMos Vk2 Airframe', purityPercent: 99.8, specProp: 97.5, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'V2O5 99.8% missile-grade for DRDO BrahMos Mk2 airframe titanium-vanadium alloy &amp;#8594; 97.5% V2O5 &amp;#8594; &amp;#8377;860Cr for 45 tonnes &amp;#8594; India &amp;#8377;6,200Cr V2O5 missile &amp;#8594; DRDO 200 missiles &amp;#8594; 99.8% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; V2O5Msl &amp;#8594; &amp;#8594; Defense' },
  { id: 'VPN-0014', batchNo: 'VPN-B2414', city: 'Rourkela', manufacturer: 'SAIL Vanadium', grade: 'V2O5 95% Rebar Strength', application: 'SAIL Rourkela TMT Rebar', purityPercent: 95.0, specProp: 91.0, investmentCr: 320, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'V2O5 95% rebar-grade for SAIL Rourkela TMT rebar vanadium microalloy strengthening &amp;#8594; 91% V2O5 &amp;#8594; &amp;#8377;320Cr for 200 tonnes &amp;#8594; India &amp;#8377;2,000Cr V2O5 rebar &amp;#8594; SAIL 500K tonnes &amp;#8594; 95.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; V2O5Rebar &amp;#8594; &amp;#8594; Construction' },
];

export default function VanadiumPentoxideLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Zap },
    { id: 'registry', label: 'Registry', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: Zap },
    { id: 'insights', label: 'Insights', icon: Zap },
  ];

  const filteredRecords = useMemo(() => {
    return vanadiumpentoxideRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    vanadiumpentoxideRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = vanadiumpentoxideRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = vanadiumpentoxideRecords.reduce((s: number, r) => s + r.purityPercent, 0) / vanadiumpentoxideRecords.length;
    const delayed = vanadiumpentoxideRecords.filter((r) => r.status === 'Delayed').length;
    const critical = vanadiumpentoxideRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#dc2626';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Vanadium Pentoxide Logistics" description="Indian vanadium pentoxide logistics supply chain tracking across 14 grades spanning infrared optics, fiber optics, semiconductor, defense, energy storage and industrial sectors" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-red-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-red-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-red-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-red-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / vanadiumpentoxideRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = vanadiumpentoxideRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {vanadiumpentoxideRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.grade}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">V2O5 Content (%)</span><span className="font-medium">{record.specProp}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {vanadiumpentoxideRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; vanadiumpentoxideRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = vanadiumpentoxideRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; vanadiumpentoxideRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; vanadiumpentoxideRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / vanadiumpentoxideRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Energy Storage Revolution</div><div className="text-xs text-muted-foreground mt-1">NTPC 50MWh VRFB &#8594; Adani solar coating &#8594; &#8377;1,300Cr combined &#8594; vanadium redox flow battery critical</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Strategic Defense &amp; Nuclear</div><div className="text-xs text-muted-foreground mt-1">DRDO BrahMos airframe &#8594; GRSE submarine hull &#8594; IGCAR control rod &#8594; &#8377;2,720Cr combined &#8594; national security</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Industrial Backbone</div><div className="text-xs text-muted-foreground mt-1">JSW HSLA &#8594; BHEL SCR &#8594; L&amp;T sulfuric &#8594; Indian Railways axle &#8594; &#8377;2,480Cr combined &#8594; heavy industry</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Monsoon Alert</div><div className="text-xs text-muted-foreground mt-1">VPN-B2412 GRSE Project 75I submarine hull steel delayed &#8594; monsoon Visakhapatnam &#8594; naval programme at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Total Portfolio: &#8377;8,760 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 V2O5 grades spanning VRFB, superalloy, HSLA, tool steel, catalyst, emission, ceramic, rail, petro, nuclear, solar, missile, rebar &#8594; avg purity 98.72%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">NTPC &#8594; HAL Tejas &#8594; BHEL SCR &#8594; IGCAR &#8594; GRSE submarine &#8594; DRDO BrahMos &#8594; DRDO TBRL</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Godrej &#8594; Gujarat Vanadium &#8594; SAIL</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">V2O5 Content Spectrum</div><div className="text-xs text-muted-foreground mt-1">91-98.5% V2O5 content range &#8594; nuclear 98.5% highest &#8594; rebar 91% lowest &#8594; content defines application grade</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
