"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { FlameKindling } from 'lucide-react';

interface RefractoryCeramicRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; specProp: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const refractoryceramicRecords: RefractoryCeramicRecord[] = [
  { id: 'RC-0001', batchNo: 'RC-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', grade: 'Al2O3 99.8% Dense', application: 'SAIL Bhilai Blast Furnace Lining', purityPercent: 99.8, specProp: 2100, investmentCr: 920, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Al2O3 99.8% dense alumina for SAIL Bhilai blast furnace hearth lining &amp;#8594; 2100 kg/m3 &amp;#8594; &amp;#8377;920Cr for 150 tonnes &amp;#8594; India &amp;#8377;6,800Cr refractory &amp;#8594; SAIL 8 furnaces &amp;#8594; 99.8% purity &amp;#8594; &amp;#8594; Brick &amp;#8594; &amp;#8594; Al2O3Dense &amp;#8594; &amp;#8594; Steel' },
  { id: 'RC-0002', batchNo: 'RC-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', grade: 'ZrO2 97% YSZ Thermal', application: 'BEL LCA Tejas Mk2 TBC Coating', purityPercent: 97.0, specProp: 5680, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'ZrO2 97% yttria-stabilized zirconia for BEL Tejas Mk2 turbine blade thermal barrier coating &amp;#8594; 5680 kg/m3 &amp;#8594; &amp;#8377;860Cr for 45 tonnes &amp;#8594; India &amp;#8377;6,200Cr TBC &amp;#8594; BEL 40 aircraft &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; ZrO2YSZ &amp;#8594; &amp;#8594; Aerospace' },
  { id: 'RC-0003', batchNo: 'RC-B2403', city: 'Chennai', manufacturer: 'Tata Steel', grade: 'MgO 98% Basic', application: 'JSW Steel BOF Refractory', purityPercent: 98.0, specProp: 3580, investmentCr: 780, status: 'Delivered', priority: 'High', origin: 'Tata Steel Jamshedpur (JH)', destination: 'JSW Vijayanagar (KA)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'MgO 98% dead-burnt magnesia for JSW Vijayanagar basic oxygen furnace refractory lining &amp;#8594; 3580 kg/m3 &amp;#8594; &amp;#8377;780Cr for 200 tonnes &amp;#8594; India &amp;#8377;5,400Cr MgO &amp;#8594; JSW 12 furnaces &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Brick &amp;#8594; &amp;#8594; MgOBasic &amp;#8594; &amp;#8594; Steel' },
  { id: 'RC-0004', batchNo: 'RC-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', grade: 'SiC 99% Crucible', application: 'Bharat Forge Die Casting Crucible', purityPercent: 99.0, specProp: 3100, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Bharat Forge Baramati (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'West', remarks: 'SiC 99% silicon carbide crucible for Bharat Forge die casting molten steel containment &amp;#8594; 3100 kg/m3 &amp;#8594; &amp;#8377;520Cr for 80 tonnes &amp;#8594; India &amp;#8377;3,600Cr SiC &amp;#8594; Bharat Forge 5M forgings &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Crucible &amp;#8594; &amp;#8594; SiCCruc &amp;#8594; &amp;#8594; Automotive' },
  { id: 'RC-0005', batchNo: 'RC-B2405', city: 'Kolkata', manufacturer: 'Carborundum Universal', grade: 'Al2O3 95% Insulating', application: 'L&amp;T Warship Engine Exhaust', purityPercent: 95.0, specProp: 1800, investmentCr: 640, status: 'In Transit', priority: 'High', origin: 'Carborundum Chennai (TN)', destination: 'L&amp;T Kattupalli (TN)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'Al2O3 95% insulating firebrick for L&amp;amp;T warship gas turbine exhaust thermal insulation &amp;#8594; 1800 kg/m3 &amp;#8594; &amp;#8377;640Cr for 120 tonnes &amp;#8594; India &amp;#8377;4,400Cr IFB &amp;#8594; L&amp;amp;T 30 warships &amp;#8594; 95.0% purity &amp;#8594; &amp;#8594; Brick &amp;#8594; &amp;#8594; Al2O3IFB &amp;#8594; &amp;#8594; Naval' },
  { id: 'RC-0006', batchNo: 'RC-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&amp;D', grade: 'ZrO2 99% Nuclear', application: 'BHEL 800MW GT Combustor', purityPercent: 99.0, specProp: 5680, investmentCr: 740, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'ZrO2 99% nuclear-grade zirconia for BHEL 800MW gas turbine combustor thermal liner &amp;#8594; 5680 kg/m3 &amp;#8594; &amp;#8377;740Cr for 60 tonnes &amp;#8594; India &amp;#8377;5,200Cr ZrO2 GT &amp;#8594; BHEL 20 GTs &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Tile &amp;#8594; &amp;#8594; ZrO2Nuc &amp;#8594; &amp;#8594; Power' },
  { id: 'RC-0007', batchNo: 'RC-B2407', city: 'Pune', manufacturer: 'Mahindra Steel', grade: 'SiC 97% Kiln Furniture', application: 'Mahindra XUV400 EV Battery Kiln', purityPercent: 97.0, specProp: 2700, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'Mahindra Nashik (MH)', destination: 'Mahindra Pune (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'SiC 97% kiln furniture for Mahindra XUV400 EV battery cathode sintering support &amp;#8594; 2700 kg/m3 &amp;#8594; &amp;#8377;380Cr for 40 tonnes &amp;#8594; India &amp;#8377;2,600Cr SiC kiln &amp;#8594; Mahindra 50K batteries &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Setter &amp;#8594; &amp;#8594; SiCKiln &amp;#8594; &amp;#8594; Automotive' },
  { id: 'RC-0008', batchNo: 'RC-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Ceramics', grade: 'Al2O3 92% Castable', application: 'Indian Railways RCF Kiln Lining', purityPercent: 92.0, specProp: 2850, investmentCr: 460, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Ceramics Jodhpur (RJ)', destination: 'RCF Kapurthala (PB)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'Al2O3 92% castable refractory for Indian Railways wheel factory kiln car lining &amp;#8594; 2850 kg/m3 &amp;#8594; &amp;#8377;460Cr for 100 tonnes &amp;#8594; India &amp;#8377;3,200Cr castable &amp;#8594; IR 200K wheels &amp;#8594; 92.0% purity &amp;#8594; &amp;#8594; Castable &amp;#8594; &amp;#8594; Al2O3Cast &amp;#8594; &amp;#8594; Rail' },
  { id: 'RC-0009', batchNo: 'RC-B2409', city: 'Guwahati', manufacturer: 'Assam Refractories', grade: 'MgO 96% Ladle', application: 'Tata Steel Ladle Refractory', purityPercent: 96.0, specProp: 3400, investmentCr: 560, status: 'In Transit', priority: 'High', origin: 'Assam Refractories Tezpur (AS)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'MgO 96% ladle refractory for Tata Steel 300-tonne ladle slag line magnesia-carbon brick &amp;#8594; 3400 kg/m3 &amp;#8594; &amp;#8377;560Cr for 130 tonnes &amp;#8594; India &amp;#8377;3,800Cr MgC &amp;#8594; Tata 20 ladles &amp;#8594; 96.0% purity &amp;#8594; &amp;#8594; Brick &amp;#8594; &amp;#8594; MgOLadle &amp;#8594; &amp;#8594; Steel' },
  { id: 'RC-0010', batchNo: 'RC-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Refractories', grade: 'ZrO2 95% Missile', application: 'IGCAR PFBR Core Shroud', purityPercent: 95.0, specProp: 5500, investmentCr: 900, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Refractories Ahmedabad (GJ)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'ZrO2 95% zirconia for IGCAR Prototype Fast Breeder Reactor core shroud thermal shielding &amp;#8594; 5500 kg/m3 &amp;#8594; &amp;#8377;900Cr for 50 tonnes &amp;#8594; India &amp;#8377;7,400Cr ZrO2 nuclear &amp;#8594; IGCAR 2 reactors &amp;#8594; 95.0% purity &amp;#8594; &amp;#8594; Block &amp;#8594; &amp;#8594; ZrO2Core &amp;#8594; &amp;#8594; Nuclear' },
  { id: 'RC-0011', batchNo: 'RC-B2411', city: 'Lucknow', manufacturer: 'UP Refractories', grade: 'SiC 95%窑 Nozzle', application: 'Adani Steel Tundish Nozzle', purityPercent: 95.0, specProp: 2900, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'UP Refractories Kanpur (UP)', destination: 'Adani Mundra (GJ)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'SiC 95% silicon carbide tundish nozzle for Adani Steel continuous casting steel flow &amp;#8594; 2900 kg/m3 &amp;#8594; &amp;#8377;420Cr for 40 tonnes &amp;#8594; India &amp;#8377;2,800Cr SiC nozzle &amp;#8594; Adani 5 casters &amp;#8594; 95.0% purity &amp;#8594; &amp;#8594; Nozzle &amp;#8594; &amp;#8594; SiCNozzle &amp;#8594; &amp;#8594; Steel' },
  { id: 'RC-0012', batchNo: 'RC-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Refractories', grade: 'Al2O3 99.5% Submarine', application: 'GRSE Project 75I Sonar Dome', purityPercent: 99.5, specProp: 2200, investmentCr: 960, status: 'Delayed', priority: 'Critical', origin: 'Vizag Refractories Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Al2O3 99.5% submarine-grade for GRSE Project 75I sonar dome high-purity alumina window &amp;#8594; 2200 kg/m3 &amp;#8597; &amp;#8377;960Cr for 30 tonnes &amp;#8597; India &amp;#8377;7,800Cr Al2O3 submarine &amp;#8597; GRSE 6 submarines &amp;#8597; 99.5% purity &amp;#8597; &amp;#8594; Dome &amp;#8597; &amp;#8594; Al2O3Sub &amp;#8597; &amp;#8594; Naval' },
  { id: 'RC-0013', batchNo: 'RC-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', grade: 'ZrO2 98% Warhead', application: 'DRDO BrahMos Mk2 Radome', purityPercent: 98.0, specProp: 5600, investmentCr: 880, status: 'In Transit', priority: 'Critical', origin: 'DRDO Chandipur (OD)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'ZrO2 98% zirconia for DRDO BrahMos Mk2 seeker radome RF-transparent ceramic &amp;#8594; 5600 kg/m3 &amp;#8594; &amp;#8377;880Cr for 40 tonnes &amp;#8594; India &amp;#8377;6,400Cr ZrO2 missile &amp;#8594; DRDO 200 missiles &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Cone &amp;#8594; &amp;#8594; ZrO2Radome &amp;#8594; &amp;#8594; Defense' },
  { id: 'RC-0014', batchNo: 'RC-B2414', city: 'Rourkela', manufacturer: 'SAIL Refractories', grade: 'MgO 93% General', application: 'SAIL Rourkela Coke Oven', purityPercent: 93.0, specProp: 3200, investmentCr: 340, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'MgO 93% general magnesia for SAIL Rourkela coke oven wall silica brick replacement &amp;#8594; 3200 kg/m3 &amp;#8594; &amp;#8377;340Cr for 180 tonnes &amp;#8594; India &amp;#8377;2,200Cr MgO coke &amp;#8594; SAIL 4 ovens &amp;#8594; 93.0% purity &amp;#8594; &amp;#8594; Brick &amp;#8594; &amp;#8594; MgOGen &amp;#8594; &amp;#8594; Steel' },
];

export default function RefractoryCeramicLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FlameKindling },
    { id: 'registry', label: 'Registry', icon: FlameKindling },
    { id: 'analytics', label: 'Analytics', icon: FlameKindling },
    { id: 'insights', label: 'Insights', icon: FlameKindling },
  ];

  const filteredRecords = useMemo(() => {
    return refractoryceramicRecords.filter((r) => {
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
    refractoryceramicRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = refractoryceramicRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = refractoryceramicRecords.reduce((s: number, r) => s + r.purityPercent, 0) / refractoryceramicRecords.length;
    const delayed = refractoryceramicRecords.filter((r) => r.status === 'Delayed').length;
    const critical = refractoryceramicRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#ea580c';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Refractory Ceramic Logistics" description="Indian refractory ceramic logistics supply chain tracking across 14 grades spanning steelmaking, foundry, defense, aerospace, power, automotive and infrastructure sectors" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-orange-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-orange-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / refractoryceramicRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = refractoryceramicRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {refractoryceramicRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Density (kg/m3)</span><span className="font-medium">{record.specProp}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {refractoryceramicRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; refractoryceramicRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = refractoryceramicRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; refractoryceramicRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; refractoryceramicRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / refractoryceramicRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Steel &amp; Foundry Dominance</div><div className="text-xs text-muted-foreground mt-1">SAIL blast furnace &#8594; JSW BOF &#8594; Tata ladle &#8594; &#8377;2,260Cr combined &#8594; highest volume segment</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Defense &amp; Naval Programme</div><div className="text-xs text-muted-foreground mt-1">BEL Tejas TBC &#8594; GRSE sonar dome &#8594; DRDO BrahMos radome &#8594; &#8377;2,700Cr combined &#8594; strategic national assets</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Nuclear &amp; Power</div><div className="text-xs text-muted-foreground mt-1">IGCAR core shroud &#8594; BHEL GT combustor &#8594; &#8377;1,640Cr combined &#8594; critical infrastructure backbone</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">RC-B2412 GRSE Project 75I sonar dome delayed &#8594; monsoon Visakhapatnam port congestion &#8594; submarine programme at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Total Portfolio: &#8377;8,760 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 refractory grades spanning Al2O3, ZrO2, MgO, SiC for steel, defense, nuclear, naval, rail, EV, power and missile sectors &#8594; avg purity 96.83%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">SAIL furnace &#8594; BEL Tejas TBC &#8594; BHEL GT &#8594; IGCAR nuclear &#8594; GRSE sonar &#8594; DRDO radome &#8594; JSW BOF</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Steel &#8594; Carborundum Universal lead strategic &#8594; Bharat Forge &#8594; Gujarat Refractories drive commercial</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-orange-500 bg-orange-50/50"><div className="font-medium">Material Spectrum</div><div className="text-xs text-muted-foreground mt-1">Al2O3 (92-99.8%) &#8594; ZrO2 (95-99%) &#8594; MgO (93-98%) &#8594; SiC (95-99%) &#8594; four major refractory families covered</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
