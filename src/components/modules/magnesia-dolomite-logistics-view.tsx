"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Thermometer } from 'lucide-react';

interface MagnesiaDolomiteRecord {
  id: string; batchNo: string; city: string; manufacturer: string; oxideGrade: string;
  application: string; purityPercent: number; hardnessGPa: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
}

const magnesiaDolomiteRecords: MagnesiaDolomiteRecord[] = [
  { id: 'MGO-0001', batchNo: 'MGO-B2401', city: 'Mumbai', manufacturer: 'Dalmia Cement', oxideGrade: 'DB-Caustic 70%', application: 'Tata Steel BOF Lining', purityPercent: 96.5, hardnessGPa: 3.5, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'Dalmia Cement Mumbai (MH)', destination: 'Tata Steel Jamshedpur (JH)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: 'Caustic magnesia 70% for Tata Steel basic oxygen furnace refractory lining &#8594; 90% CaO &#8594; &#8377;720Cr for 8,000 tonnes &#8594; India &#8377;5,800Cr magnesia &#8594; Tata 5 converters &#8594; 3.5 Mohs &#8594; &#8594; Dead burned &#8594; &#8594; 1800&#176;C &#8594; &#8594; Steel' },
  { id: 'MGO-0002', batchNo: 'MGO-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', oxideGrade: 'DB-Fused Cast 98%', application: 'ISRO SRM Nozzle', purityPercent: 98.5, hardnessGPa: 8.2, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Fused cast magnesia for ISRO PSLV solid rocket motor convergent-divergent nozzle throat insert &#8594; 98% MgO &#8594; &#8377;860Cr for 1,200 tonnes &#8594; India &#8377;6,200Cr fused &#8594; ISRO 40 motors &#8594; 8.2 GPa &#8594; &#8594; Fused cast &#8594; &#8594; 2800&#176;C &#8594; &#8594; Space' },
  { id: 'MGO-0003', batchNo: 'MGO-B2403', city: 'Chennai', manufacturer: 'Ramco Magnesite', oxideGrade: 'DB-Dead Burned 92%', application: 'SAIL Ladle Lining', purityPercent: 92.8, hardnessGPa: 5.5, investmentCr: 640, status: 'Delivered', priority: 'High', origin: 'Ramco Salem (TN)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: 'Dead burned magnesia brick for SAIL Bhilai steel ladle slag line and metal line &#8594; 92% MgO &#8594; &#8377;640Cr for 10,000 tonnes &#8594; India &#8377;4,800Cr brick &#8594; SAIL 8 ladles &#8594; 5.5 GPa &#8594; &#8594; Brick &#8594; &#8594; 1600&#176;C &#8594; &#8594; Steel' },
  { id: 'MGO-0004', batchNo: 'MGO-B2404', city: 'Hyderabad', manufacturer: 'Premier Magnesite', oxideGrade: 'DB-Dolomite 58%', application: 'Jindal Steel Sinter', purityPercent: 58.2, hardnessGPa: 3.8, investmentCr: 520, status: 'Delivered', priority: 'Medium', origin: 'Premier Hyderabad (TG)', destination: 'Jindal Steel Raigarh (CG)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Dolomite sinter feed for Jindal Steel sinter plant flux in blast furnace ironmaking &#8594; 58% MgCO3 &#8594; &#8377;520Cr for 15,000 tonnes &#8594; India &#8377;1,800Cr dolomite &#8594; Jindal 3 furnaces &#8594; 3.8 Mohs &#8594; &#8594; Sinter &#8594; &#8594; 1300&#176;C &#8594; &#8594; Steel' },
  { id: 'MGO-0005', batchNo: 'MGO-B2405', city: 'Kolkata', manufacturer: 'Tata Refractories', oxideGrade: 'DB-Magnesia Carbon 80%', application: 'JSW Steel RH Degasser', purityPercent: 80.5, hardnessGPa: 6.8, investmentCr: 780, status: 'In Transit', priority: 'High', origin: 'Tata Refractories Kolkata (WB)', destination: 'JSW Steel Vijaynagar (KA)', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'Magnesia-carbon brick for JSW Steel Ruhrstahl Heraeus degasser snorkel and vessel &#8594; 80% MgO &#8594; &#8377;780Cr for 4,000 tonnes &#8594; India &#8377;6,400Cr MgC &#8594; JSW 6 degassers &#8594; 6.8 GPa &#8594; &#8594; MgO-C &#8594; &#8594; 1650&#176;C &#8594; &#8594; Steel' },
  { id: 'MGO-0006', batchNo: 'MGO-B2406', city: 'Ahmedabad', manufacturer: 'Gujarat Magnesite', oxideGrade: 'DB-Pharm Grade 99%', application: 'Sun Pharma Antacid', purityPercent: 99.2, hardnessGPa: 4.2, investmentCr: 480, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Magnesite Rajkot (GJ)', destination: 'Sun Pharma Vadodara (GJ)', shipDate: '2026-07-26', transitDays: 1, zone: 'West', remarks: 'Pharmaceutical-grade light magnesia for Sun Pharma antacid tablet and laxative formulation &#8594; USP grade &#8594; &#8377;480Cr for 2,000 tonnes &#8594; India &#8377;3,200Cr pharma &#8594; Sun Pharma 600M tabs &#8594; 4.2 Mohs &#8594; &#8594; Light MgO &#8594; &#8594; 350&#176;C &#8594; &#8594; Pharma' },
  { id: 'MGO-0007', batchNo: 'MGO-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Minerals', oxideGrade: 'DB-EPS Wallboard 85%', application: 'Everest Industries Panel', purityPercent: 85.4, hardnessGPa: 2.8, investmentCr: 380, status: 'In Transit', priority: 'Medium', origin: 'Rajasthan Minerals Jodhpur (RJ)', destination: 'Everest Industries Kolkata (WB)', shipDate: '2026-07-28', transitDays: 3, zone: 'West', remarks: 'Calcined magnesia for Everest Industries EPS wallboard fire retardant additive &#8594; 85% MgO &#8594; &#8377;380Cr for 3,000 tonnes &#8594; India &#8377;1,400Cr wallboard &#8594; Everest 200K panels &#8594; 2.8 Mohs &#8594; &#8594; Calcined &#8594; &#8594; 600&#176;C &#8594; &#8594; Construction' },
  { id: 'MGO-0008', batchNo: 'MGO-B2408', city: 'Coimbatore', manufacturer: 'TN Minerals Corp', oxideGrade: 'DB-Animal Feed 96%', application: 'Venkateshwara Hatchery', purityPercent: 96.1, hardnessGPa: 3.1, investmentCr: 340, status: 'Delivered', priority: 'Low', origin: 'TN Minerals Salem (TN)', destination: 'Venkateshwara Mumbai (MH)', shipDate: '2026-07-30', transitDays: 1, zone: 'South', remarks: 'Feed-grade magnesite for Venkateshwara Hatchery poultry feed magnesium supplement &#8594; 96% MgCO3 &#8594; &#8377;340Cr for 5,000 tonnes &#8594; India &#8377;900Cr feed &#8594; Venky 100K tonnes &#8594; 3.1 Mohs &#8594; &#8594; Feed grade &#8594; &#8594; 400&#176;C &#8594; &#8594; Agriculture' },
  { id: 'MGO-0009', batchNo: 'MGO-B2409', city: 'Guwahati', manufacturer: 'Assam Dolomite Mine', oxideGrade: 'DB-Flux Dolomite 42%', application: 'NMDC Iron Ore Sinter', purityPercent: 42.5, hardnessGPa: 3.5, investmentCr: 280, status: 'Delivered', priority: 'Low', origin: 'Assam Dolomite Dima Hasao (AS)', destination: 'NMDC Donimalai (KA)', shipDate: '2026-08-01', transitDays: 5, zone: 'East', remarks: 'Dolomite flux for NMDC Donimalai iron ore sinter plant basicity adjustment &#8594; 42% MgCO3 &#8594; &#8377;280Cr for 20,000 tonnes &#8594; India &#8377;800Cr flux &#8594; NMDC 4 sinter plants &#8594; 3.5 Mohs &#8594; &#8594; Flux &#8594; &#8594; 1200&#176;C &#8594; &#8594; Mining' },
  { id: 'MGO-0010', batchNo: 'MGO-B2410', city: 'Lucknow', manufacturer: 'UP Magnesite Ltd', oxideGrade: 'DB-Chemical 98%', application: 'PI Industries Fertilizer', purityPercent: 98.3, hardnessGPa: 4.5, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'UP Magnesite Lucknow (UP)', destination: 'PI Industries Hyderabad (TG)', shipDate: '2026-08-03', transitDays: 2, zone: 'North', remarks: 'Chemical-grade magnesia for PI Industries magnesium sulphate fertilizer production &#8594; 98% MgO &#8594; &#8377;420Cr for 3,000 tonnes &#8594; India &#8377;2,400Cr chemical &#8594; PI 50K tonnes &#8594; 4.5 Mohs &#8594; &#8594; MgSO4 &#8594; &#8594; 1100&#176;C &#8594; &#8594; Chemical' },
  { id: 'MGO-0011', batchNo: 'MGO-B2411', city: 'Nagpur', manufacturer: 'BHEl Refractory Div', oxideGrade: 'DB-High Temp 97%', application: 'BHEL Boiler Harp', purityPercent: 97.2, hardnessGPa: 7.5, investmentCr: 680, status: 'In Transit', priority: 'High', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-08-05', transitDays: 2, zone: 'West', remarks: 'High-temperature magnesia-chrome brick for BHEL 660MW supercritical boiler harp tube seal &#8594; 97% MgO &#8594; &#8377;680Cr for 2,500 tonnes &#8594; India &#8377;4,800Cr boiler &#8594; BHEL 20 boilers &#8594; 7.5 GPa &#8594; &#8594; Mag-Chrome &#8594; &#8594; 1400&#176;C &#8594; &#8594; Power' },
  { id: 'MGO-0012', batchNo: 'MGO-B2412', city: 'Visakhapatnam', manufacturer: 'NALCO Refractory', oxideGrade: 'DB-Naval Insulator 95%', application: 'GRSE Frigate Bulkhead', purityPercent: 95.8, hardnessGPa: 6.2, investmentCr: 540, status: 'Delayed', priority: 'High', origin: 'NALCO Vishakapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-08-07', transitDays: 2, zone: 'East', remarks: 'Magnesia insulating firebrick for GRSE Nilgiri-class frigate engine room bulkhead thermal shield &#8594; 95% MgO &#8594; &#8377;540Cr for 1,500 tonnes &#8597; India &#8377;3,600Cr naval &#8594; GRSE 7 vessels &#8594; 6.2 GPa &#8594; &#8594; IFB &#8594; &#8594; 1000&#176;C &#8594; &#8594; Naval' },
  { id: 'MGO-0013', batchNo: 'MGO-B2413', city: 'Bhopal', manufacturer: 'IGCAR Ceramics', oxideGrade: 'DB-Nuclear 99.5%', application: 'BHAVINI Breeder Vessel', purityPercent: 99.5, hardnessGPa: 8.8, investmentCr: 940, status: 'In Transit', priority: 'Critical', origin: 'IGCAR Kalpakkam (TN)', destination: 'BHAVINI Kalpakkam (TN)', shipDate: '2026-08-09', transitDays: 1, zone: 'Central', remarks: 'Ultra-high purity magnesia for BHAVINI PFBR primary sodium circuit ceramic insulation &#8594; 99.5% MgO &#8594; &#8377;940Cr for 800 tonnes &#8594; India &#8377;8,200Cr nuclear &#8594; BHAVINI 2 reactors &#8594; 8.8 GPa &#8594; &#8594; Nuclear grade &#8594; &#8594; 1100&#176;C &#8594; &#8594; Nuclear' },
  { id: 'MGO-0014', batchNo: 'MGO-B2414', city: 'Rourkela', manufacturer: 'SAIL Refractory', oxideGrade: 'DB-Ladle Repair 90%', application: 'Tata Steel Tundish', purityPercent: 90.5, hardnessGPa: 5.8, investmentCr: 480, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'Tata Steel Kalinganagar (OD)', shipDate: '2026-08-11', transitDays: 1, zone: 'East', remarks: 'Magnesia repair mix for Tata Steel Kalinganagar continuous casting tundish working lining &#8594; 90% MgO &#8594; &#8377;480Cr for 4,000 tonnes &#8594; India &#8377;2,800Cr repair &#8594; Tata 6 tundishes &#8594; 5.8 GPa &#8594; &#8594; Repair mix &#8594; &#8594; 1550&#176;C &#8594; &#8594; Steel' },
];

export default function MagnesiaDolomiteLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Thermometer },
    { id: 'registry', label: 'Registry', icon: Thermometer },
    { id: 'analytics', label: 'Analytics', icon: Thermometer },
    { id: 'insights', label: 'Insights', icon: Thermometer },
  ];

  const filteredRecords = useMemo(() => {
    return magnesiaDolomiteRecords.filter((r) => {
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
    magnesiaDolomiteRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = magnesiaDolomiteRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = magnesiaDolomiteRecords.reduce((s: number, r) => s + r.purityPercent, 0) / magnesiaDolomiteRecords.length;
    const delayed = magnesiaDolomiteRecords.filter((r) => r.status === 'Delayed').length;
    const critical = magnesiaDolomiteRecords.filter((r) => r.priority === 'Critical').length;
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
      <PageHeader title="Magnesia Dolomite Logistics" description="Indian magnesia and dolomite refractory, steel flux, pharmaceutical, nuclear and construction supply chain tracking across 14 grades" />
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
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / magnesiaDolomiteRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = magnesiaDolomiteRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {magnesiaDolomiteRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.oxideGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {magnesiaDolomiteRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; magnesiaDolomiteRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = magnesiaDolomiteRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; magnesiaDolomiteRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; magnesiaDolomiteRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / magnesiaDolomiteRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Nuclear Ceramics Demand</div><div className="text-xs text-muted-foreground mt-1">BHAVINI PFBR and IGCAR dual programme driving 99.5%+ nuclear magnesia &#8594; &#8377;940Cr for 800 tonnes &#8594; highest purity segment</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Steel Refractory Cycle</div><div className="text-xs text-muted-foreground mt-1">Tata Steel BOF + SAIL ladle + JSW degasser + Tata tundish form &#8594; &#8377;2,620Cr combined &#8594; cyclical lining replacement demand</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Space Programme Growth</div><div className="text-xs text-muted-foreground mt-1">ISRO PSLV and GSLV expanded launch cadence driving fused cast magnesia nozzle demand &#8594; &#8377;860Cr for DRDO/ISRO</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">MGO-B2412 GRSE frigate bulkhead delayed &#8594; monsoon Visakhapatnam port congestion &#8594; Nilgiri-class delivery schedule at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 magnesia and dolomite grades spanning steel, space, nuclear, pharma, construction and naval &#8594; avg purity {kpiData.avgPurity}%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Critical Priority: 4 Records</div><div className="text-xs text-muted-foreground mt-1">Tata Steel BOF &#8594; ISRO nozzle &#8594; BHEL boiler &#8594; BHAVINI breeder &#8594; national infrastructure dependent</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">IGCAR &#8594; DRDO &#8594; BHEL lead R&amp;D demand &#8594; Dalmia &#8594; Ramco &#8594; Tata Refractories drive commercial</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50/50"><div className="font-medium">Regional Concentration</div><div className="text-xs text-muted-foreground mt-1">South zone dominates with Chennai &#8594; Salem &#8594; Hyderabad &#8594; Kalpakkam supply &#8594; West zone Gujarat emerging</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
