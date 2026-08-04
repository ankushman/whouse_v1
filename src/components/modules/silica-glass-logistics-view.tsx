"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Cog } from 'lucide-react';

interface SilicaGlassRecord {
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

const silicaGlassRecords: SilicaGlassRecord[] = [
  { id: 'SLG-0001', batchNo: 'SLG-B2401', city: 'Mumbai', manufacturer: 'Asahi India Glass', oxideGrade: 'SG-Optical Clear', application: 'BEL HUD Display', purityPercent: 99.99, hardnessGPa: 6.5, investmentCr: 760, status: 'Delivered', priority: 'Critical', origin: 'Asahi India Mumbai (MH)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Ultra-clear optical float glass for BEL head-up display fighter aircraft canopy &#8594; 1.2mm thick SG &#8594; &#8377;760Cr for 4,000 tonnes &#8594; India &#8377;4,200Cr optical &#8594; BEL 300 canopies &#8594; 6.5 GPa &#8594; &#8594; Float &#8594; &#8594; 560&#176;C &#8594; &#8594; Display' },
  { id: 'SLG-0002', batchNo: 'SLG-B2402', city: 'Bengaluru', manufacturer: 'Saint-Gobain India', oxideGrade: 'SG-Low Iron Solar', application: 'Adani Solar Panel', purityPercent: 99.98, hardnessGPa: 5.8, investmentCr: 820, status: 'In Transit', priority: 'Critical', origin: 'Saint-Gobain Chennai (TN)', destination: 'Adani Mundra (GJ)', shipDate: '2026-07-18', transitDays: 3, zone: 'South', remarks: 'Low-iron patterned solar glass for Adani Solar bifacial PERC module cover &#8594; 3.2mm AR coated &#8594; &#8377;820Cr for 8,000 tonnes &#8594; India &#8377;6,800Cr solar &#8594; Adani 5GW &#8594; 5.8 GPa &#8594; &#8594; Tempered &#8594; &#8594; 650&#176;C &#8594; &#8594; Solar' },
  { id: 'SLG-0003', batchNo: 'SLG-B2403', city: 'Chennai', manufacturer: 'Tata AutoComp Glass', oxideGrade: 'SG-Laminated Auto', application: 'Hyundai i25 Body', purityPercent: 99.95, hardnessGPa: 5.2, investmentCr: 690, status: 'Delivered', priority: 'High', origin: 'Tata AutoComp Pune (MH)', destination: 'Hyundai Chennai (TN)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'Laminated safety glass windshield for Hyundai i25 sedan front and rear &#8594; PVB interlayer &#8594; &#8377;690Cr for 6,000 tonnes &#8594; India &#8377;4,800Cr auto &#8594; Hyundai 200K units &#8594; 5.2 GPa &#8594; &#8594; Laminated &#8594; &#8594; 350&#176;C &#8594; &#8594; Auto' },
  { id: 'SLG-0004', batchNo: 'SLG-B2404', city: 'Hyderabad', manufacturer: 'Pharmaceutical Glass', oxideGrade: 'SG-Type I Borosil', application: 'Dr Reddys Vial', purityPercent: 99.97, hardnessGPa: 7.2, investmentCr: 580, status: 'Delivered', priority: 'High', origin: 'Pharma Glass Hyderabad (TG)', destination: 'Dr Reddys Hyderabad (TG)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Type I borosilicate tubing for Dr Reddys injectable glass vial 2R and 5R &#8594; 5.5mm OD &#8594; &#8377;580Cr for 2,000 tonnes &#8594; India &#8377;3,200Cr pharma &#8594; Dr Reddys 400M vials &#8594; 7.2 GPa &#8594; &#8594; Borosilicate &#8594; &#8594; 560&#176;C &#8594; &#8594; Pharma' },
  { id: 'SLG-0005', batchNo: 'SLG-B2405', city: 'Kolkata', manufacturer: 'GRP Industries', oxideGrade: 'SG-Fiber Optic Preform', application: 'Sterlite Fiber', purityPercent: 99.999, hardnessGPa: 7.8, investmentCr: 940, status: 'In Transit', priority: 'Critical', origin: 'OFS Fitel Hyderabad (TG)', destination: 'Sterlite Aurangabad (MH)', shipDate: '2026-07-24', transitDays: 2, zone: 'South', remarks: 'High-purity SiO2 preform rod for Sterlite optical fiber SMF-28e+ drawing &#8594; 150mm dia &#8594; &#8377;940Cr for 500 tonnes &#8594; India &#8377;12,400Cr fiber &#8594; Sterlite 60M fkm &#8594; 7.8 GPa &#8594; &#8594; MCVD &#8594; &#8594; 2000&#176;C &#8594; &#8594; Telecom' },
  { id: 'SLG-0006', batchNo: 'SLG-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat Borosil', oxideGrade: 'SG-Corning 7740', application: 'ISRO Telescope Mirror', purityPercent: 99.995, hardnessGPa: 6.8, investmentCr: 720, status: 'Delivered', priority: 'High', origin: 'Gujarat Borosil Baroda (GJ)', destination: 'ISRO Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: 'Low expansion borosilicate glass blank for ISRO Astrosat UV telescope primary mirror substrate &#8594; CTEmatch &#8594; &#8377;720Cr for 800 tonnes &#8594; India &#8377;6,800Cr optic &#8594; ISRO 4 mirrors &#8594; 6.8 GPa &#8594; &#8594; Fused &#8594; &#8594; 1020&#176;C &#8594; &#8594; Space' },
  { id: 'SLG-0007', batchNo: 'SLG-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Silica', oxideGrade: 'SG-Fused Quartz Tube', application: 'Wipro Semi Fab', purityPercent: 99.99, hardnessGPa: 6.2, investmentCr: 540, status: 'In Transit', priority: 'Medium', origin: 'Rajasthan Silica Jodhpur (RJ)', destination: 'Wipro Bengaluru (KA)', shipDate: '2026-07-28', transitDays: 2, zone: 'West', remarks: 'Fused quartz tube for Wipro semiconductor furnace diffusion and LPCVD process &#8594; 200mm ID &#8594; &#8377;540Cr for 1,200 tonnes &#8594; India &#8377;5,400Cr semi &#8594; Wipro 8 fabs &#8594; 6.2 GPa &#8594; &#8594; Fused quartz &#8594; &#8594; 1200&#176;C &#8594; &#8594; Semi' },
  { id: 'SLG-0008', batchNo: 'SLG-B2408', city: 'Coimbatore', manufacturer: 'TN Glass Works', oxideGrade: 'SG-Epoxy FRP', application: 'L&T Wind Turbine', purityPercent: 99.6, hardnessGPa: 4.8, investmentCr: 480, status: 'Delivered', priority: 'Medium', origin: 'TN Glass Coimbatore (TN)', destination: 'L&T Hazira (GJ)', shipDate: '2026-07-30', transitDays: 3, zone: 'South', remarks: 'E-glass fiber fabric roll for L&T wind turbine blade spar cap FRP lamination &#8594; 600gsm UD &#8594; &#8377;480Cr for 6,000 tonnes &#8594; India &#8377;2,800Cr FRP &#8594; L&T 3,000 blades &#8594; 4.8 GPa &#8594; &#8594; E-glass &#8594; &#8594; 650&#176;C &#8594; &#8594; Wind' },
  { id: 'SLG-0009', batchNo: 'SLG-B2409', city: 'Guwahati', manufacturer: 'Assam Silica Mine', oxideGrade: 'SG-High Silica Sand', application: 'Kajaria Floor Tile', purityPercent: 99.5, hardnessGPa: 3.2, investmentCr: 320, status: 'Delivered', priority: 'Low', origin: 'Assam Silica Tinsukia (AS)', destination: 'Kajaria Morbi (GJ)', shipDate: '2026-08-01', transitDays: 5, zone: 'East', remarks: 'High-purity silica sand for Kajaria vitrified floor tile body and glaze formulation &#8594; 99.5% SiO2 &#8594; &#8377;320Cr for 20,000 tonnes &#8594; India &#8377;1,200Cr tile &#8594; Kajaria 50M sqm &#8594; 3.2 Mohs &#8594; &#8594; Silica sand &#8594; &#8594; 1200&#176;C &#8594; &#8594; Ceramic' },
  { id: 'SLG-0010', batchNo: 'SLG-B2410', city: 'Lucknow', manufacturer: 'UP Silica Corp', oxideGrade: 'SG-Chemical Grade', application: 'PI Industries API', purityPercent: 99.8, hardnessGPa: 4.5, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'UP Silica Allahabad (UP)', destination: 'PI Industries Hyderabad (TG)', shipDate: '2026-08-03', transitDays: 2, zone: 'North', remarks: 'Chemical-grade silica gel desiccant for PI Industries agrochemical formulation drying &#8594; 3-5mm beads &#8594; &#8377;420Cr for 5,000 tonnes &#8594; India &#8377;1,600Cr gel &#8594; PI 200K tonnes &#8594; 4.5 Mohs &#8594; &#8594; Silica gel &#8594; &#8594; 280&#176;C &#8594; &#8594; Chemical' },
  { id: 'SLG-0011', batchNo: 'SLG-B2411', city: 'Nagpur', manufacturer: 'Borosil Glass Works', oxideGrade: 'SG-Lab Borosilicate', application: 'CSIR-NPL Metrology', purityPercent: 99.96, hardnessGPa: 6.1, investmentCr: 520, status: 'In Transit', priority: 'Medium', origin: 'Borosil Mumbai (MH)', destination: 'CSIR-NPL New Delhi (DL)', shipDate: '2026-08-05', transitDays: 1, zone: 'West', remarks: 'Laboratory-grade borosilicate beaker and flask for CSIR-NPL national metrology calibration &#8594; 3.3 expansion &#8594; &#8377;520Cr for 1,000 tonnes &#8594; India &#8377;3,400Cr lab &#8594; NPL 500K units &#8594; 6.1 GPa &#8594; &#8594; Lab ware &#8594; &#8594; 560&#176;C &#8594; &#8594; Metrology' },
  { id: 'SLG-0012', batchNo: 'SLG-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Glass Factory', oxideGrade: 'SG-Marine Porthole', application: 'GRSE Naval Vessel', purityPercent: 99.88, hardnessGPa: 5.5, investmentCr: 440, status: 'Delayed', priority: 'High', origin: 'Vizag Glass Visakha (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-08-07', transitDays: 2, zone: 'East', remarks: 'Toughened marine-grade porthole glass for GRSE ASW corvette wheelhouse window &#8594; 20mm thick &#8594; &#8377;440Cr for 800 tonnes &#8594; India &#8377;3,800Cr marine &#8594; GRSE 12 vessels &#8594; 5.5 GPa &#8594; &#8594; Tempered &#8594; &#8594; 600&#176;C &#8594; &#8594; Naval' },
  { id: 'SLG-0013', batchNo: 'SLG-B2413', city: 'Bhopal', manufacturer: 'BHEL Ceramic Div', oxideGrade: 'SG-SiC Composite', application: 'BHEL Insulator', purityPercent: 99.7, hardnessGPa: 8.2, investmentCr: 680, status: 'In Transit', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Bengaluru (KA)', shipDate: '2026-08-09', transitDays: 2, zone: 'Central', remarks: 'SiO2-SiC composite insulator housing for BHEL 765kV transmission line post insulator &#8594; 110kN M&amp;E &#8594; &#8377;680Cr for 3,000 tonnes &#8594; India &#8377;5,200Cr T&amp;D &#8594; BHEL 40 lines &#8594; 8.2 GPa &#8594; &#8594; Composite &#8594; &#8594; 1200&#176;C &#8594; &#8594; Power' },
  { id: 'SLG-0014', batchNo: 'SLG-B2414', city: 'Rourkela', manufacturer: 'SAIL Refractory Div', oxideGrade: 'SG-Refractory Silica', application: 'Tata Steel BOF', purityPercent: 99.4, hardnessGPa: 3.8, investmentCr: 380, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-08-11', transitDays: 1, zone: 'East', remarks: 'Refractory silica brick for Tata Steel BOF converter lining and slag splash protection &#8594; 96% SiO2 &#8594; &#8377;380Cr for 8,000 tonnes &#8594; India &#8377;1,400Cr refractory &#8594; Tata 6 converters &#8594; 3.8 Mohs &#8594; &#8594; Silica brick &#8594; &#8594; 1650&#176;C &#8594; &#8594; Steel' },
];

export default function SilicaGlassLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Cog },
    { id: 'registry', label: 'Registry', icon: Cog },
    { id: 'analytics', label: 'Analytics', icon: Cog },
    { id: 'insights', label: 'Insights', icon: Cog },
  ];

  const filteredRecords = useMemo(() => {
    return silicaGlassRecords.filter((r) => {
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
    silicaGlassRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = silicaGlassRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = silicaGlassRecords.reduce((s: number, r) => s + r.purityPercent, 0) / silicaGlassRecords.length;
    const delayed = silicaGlassRecords.filter((r) => r.status === 'Delayed').length;
    const critical = silicaGlassRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#0ea5e9';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Silica Glass Logistics" description="Indian optical, solar, pharma, telecom and automotive silica glass supply chain tracking across 14 grades" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-sky-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-sky-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-sky-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-sky-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-sky-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-sky-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-sky-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-sky-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-sky-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / silicaGlassRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = silicaGlassRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {silicaGlassRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.oxideGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {silicaGlassRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; silicaGlassRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = silicaGlassRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; silicaGlassRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99.99%+': 0, '99.95-99.98%': 0, '99.6-99.94%': 0, '&lt;99.6%': 0 }; silicaGlassRecords.forEach((r) => { if (r.purityPercent >= 99.99) ranges['99.99%+']++; else if (r.purityPercent >= 99.95) ranges['99.95-99.98%']++; else if (r.purityPercent >= 99.6) ranges['99.6-99.94%']++; else ranges['&lt;99.6%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / silicaGlassRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Solar Glass Demand Surge</div><div className="text-xs text-muted-foreground mt-1">Adani 5GW and Tata Power solar driving low-iron patterned glass &#8594; Saint-Gobain Chennai ramping &#8594; &#8377;820Cr for 8,000 tonnes</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Fiber Optic Preform Expansion</div><div className="text-xs text-muted-foreground mt-1">Sterlite 60M fkm programme requires high-purity SiO2 preform &#8594; &#8377;940Cr for OFS Fitel &#8594; MCVD process at 2000&#176;C</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Pharma Vial Bottleneck</div><div className="text-xs text-muted-foreground mt-1">Dr Reddys and Sun Pharma Type I borosilicate vial demand &#8594; Gujarat Borosil and Pharma Glass Hyderabad &#8594; &#8377;1,100Cr combined</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">SLG-B2412 GRSE naval porthole delayed &#8594; monsoon Visakhapatnam port congestion &#8594; ASW corvette delivery risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 silica glass grades spanning optical, solar, pharma, telecom, auto, naval and semiconductor &#8594; avg purity {kpiData.avgPurity}%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Critical Priority: 4 Records</div><div className="text-xs text-muted-foreground mt-1">BEL HUD &#8594; Adani solar &#8594; Sterlite fiber &#8594; all flagged critical &#8594; national infrastructure dependent</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Top 3 Manufacturers by Investment</div><div className="text-xs text-muted-foreground mt-1">OFS Fitel &#8594; Saint-Gobain &#8594; Asahi India lead &#8594; Gujarat Borosil emerging for specialty borosilicate</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50"><div className="font-medium">Semiconductor and Space</div><div className="text-xs text-muted-foreground mt-1">Wipro semi and ISRO telescope mirror drive high-purity demand &#8594; &#8377;1,260Cr combined for fused quartz and borosilicate</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
