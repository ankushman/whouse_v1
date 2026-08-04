"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Hexagon } from 'lucide-react';

interface CarbonFibreRecord {
  id: string; batchNo: string; city: string; manufacturer: string; cfGrade: string;
  application: string; purityPercent: number; tensileGpa: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const carbonFibreRecords: CarbonFibreRecord[] = [
  { id: 'CF-0001', batchNo: 'CF-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', cfGrade: 'T300 3K Aerospace', application: 'HAL Tejas Mk2 Wing Skin', purityPercent: 99.2, tensileGpa: 3.53, investmentCr: 920, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: 'T300 3K carbon fibre woven fabric for HAL Tejas Mk2 wing skin upper panel and flap &#8594; 3K tow &#8594; &#8377;920Cr for 120 tonnes &#8594; India &#8377;6,800Cr CF aerospace &#8594; HAL 40 aircraft &#8594; 3,530 MPa &#8594; &#8594; Fabric &#8594; &#8594; T300 &#8594; &#8594; Aerospace' },
  { id: 'CF-0002', batchNo: 'CF-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', cfGrade: 'T700 12K Missile', application: 'BEL Nirbhay Cruise Fuselage', purityPercent: 99.5, tensileGpa: 4.9, investmentCr: 860, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'T700 12K carbon fibre prepreg for BEL Nirbhay cruise missile fuselage cylindrical section &#8594; 12K tow &#8594; &#8377;860Cr for 85 tonnes &#8594; India &#8377;6,400Cr CF missile &#8594; BEL 200 missiles &#8594; 4,900 MPa &#8594; &#8594; Prepreg &#8594; &#8594; T700 &#8594; &#8594; Defense' },
  { id: 'CF-0003', batchNo: 'CF-B2403', city: 'Chennai', manufacturer: 'Grasim Industries', cfGrade: 'T700S Wind Blade', application: 'Suzlon 4.0MW Blade Spar', purityPercent: 98.8, tensileGpa: 4.8, investmentCr: 640, status: 'Delivered', priority: 'High', origin: 'Grasim Nagda (MP)', destination: 'Suzlon Pune (MH)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'T700S 24K carbon fibre unidirectional for Suzlon 4.0MW wind turbine blade main spar cap &#8594; 24K tow &#8594; &#8377;640Cr for 500 tonnes &#8594; India &#8377;4,200Cr CF wind &#8594; Suzlon 800 blades &#8594; 4,800 MPa &#8594; &#8594; UD Tape &#8594; &#8594; T700S &#8594; &#8594; Wind' },
  { id: 'CF-0004', batchNo: 'CF-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', cfGrade: 'T800 12K Auto', application: 'Mahindra XUV400 EV Roof', purityPercent: 99.1, tensileGpa: 5.88, investmentCr: 580, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Mahindra Nashik (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'T800 12K carbon fibre for Mahindra XUV400 EV roof panel and tailgate structural reinforcement &#8594; 12K tow &#8594; &#8377;580Cr for 60 tonnes &#8594; India &#8377;3,800Cr CF auto &#8594; Mahindra 80K vehicles &#8594; 5,880 MPa &#8594; &#8594; Prepreg &#8594; &#8594; T800 &#8594; &#8594; Auto' },
  { id: 'CF-0005', batchNo: 'CF-B2405', city: 'Kolkata', manufacturer: 'Tata Advanced', cfGrade: 'M40J 6K Space', application: 'ISRO PSLV Payload Fairing', purityPercent: 99.6, tensileGpa: 4.41, investmentCr: 960, status: 'Delivered', priority: 'Critical', origin: 'Tata Adv Materials Pune (MH)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'M40J 6K intermediate modulus carbon fibre for ISRO PSLV payload fairing and satellite deployer &#8594; 6K tow &#8594; &#8377;960Cr for 40 tonnes &#8594; India &#8377;7,800Cr CF space &#8594; ISRO 12 launches &#8594; 4,410 MPa &#8594; &#8594; Fabric &#8594; &#8594; M40J &#8594; &#8594; Space' },
  { id: 'CF-0006', batchNo: 'CF-B2406', city: 'Coimbatore', manufacturer: 'L&T Composites', cfGrade: 'T300 6K Pressure', application: 'L&T LPG Cylinder Wrap', purityPercent: 98.6, tensileGpa: 3.53, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'L&T Composites Mumbai (MH)', destination: 'L&T Hazira (GJ)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'T300 6K carbon fibre for L&amp;T Type-IV CNG/LPG pressure vessel hoop and helical filament wound &#8594; 6K tow &#8594; &#8377;480Cr for 300 tonnes &#8594; India &#8377;3,200Cr CF pressure &#8594; L&amp;T 40K vessels &#8594; 3,530 MPa &#8594; &#8594; Tow &#8594; &#8594; T300 &#8594; &#8594; Industrial' },
  { id: 'CF-0007', batchNo: 'CF-B2407', city: 'Pune', manufacturer: 'Bajaj Auto', cfGrade: 'T700 3K Moto', application: 'Bajaj Dominar 400 Frame', purityPercent: 98.9, tensileGpa: 4.9, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'Bajaj Composites Chakan (MH)', destination: 'Bajaj Auto Pune (MH)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'T700 3K carbon fibre for Bajaj Dominar 400 motorcycle trellis frame and swingarm &#8594; 3K tow &#8594; &#8377;420Cr for 80 tonnes &#8594; India &#8377;2,600Cr CF moto &#8594; Bajaj 2M frames &#8594; 4,900 MPa &#8594; &#8594; Prepreg &#8594; &#8594; T700 &#8594; &#8594; Auto' },
  { id: 'CF-0008', batchNo: 'CF-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Composites', cfGrade: 'T300 12K General', application: 'Godrej Furniture Frame', purityPercent: 97.8, tensileGpa: 3.53, investmentCr: 280, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan Composites Jodhpur (RJ)', destination: 'Godrej Mumbai (MH)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'T300 12K carbon fibre sheet for Godrej premium office furniture desk and partition frame &#8594; 12K tow &#8594; &#8377;280Cr for 50 tonnes &#8594; India &#8377;1,600Cr CF consumer &#8594; Godrej 500K units &#8594; 3,530 MPa &#8594; &#8594; Sheet &#8594; &#8594; T300 &#8594; &#8594; Consumer' },
  { id: 'CF-0009', batchNo: 'CF-B2409', city: 'Guwahati', manufacturer: 'Assam Composites', cfGrade: 'T700 6K Sports', application: 'Jio Sports Stadium Roof', purityPercent: 99.0, tensileGpa: 4.9, investmentCr: 520, status: 'In Transit', priority: 'High', origin: 'Assam Composites Tezpur (AS)', destination: 'Jio Mumbai (MH)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'T700 6K carbon fibre for Reliance Jio cricket stadium retractable roof tension membrane &#8594; 6K tow &#8594; &#8377;520Cr for 100 tonnes &#8594; India &#8377;3,400Cr CF infra &#8594; Jio 10 stadiums &#8594; 4,900 MPa &#8594; &#8594; Fabric &#8594; &#8594; T700 &#8594; &#8594; Infrastructure' },
  { id: 'CF-0010', batchNo: 'CF-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Composites', cfGrade: 'T800 6K Oil &amp; Gas', application: 'Adani Deepwater Riser', purityPercent: 99.3, tensileGpa: 5.88, investmentCr: 680, status: 'Delivered', priority: 'High', origin: 'Gujarat Composites Ahmedabad (GJ)', destination: 'Adani Hazira (GJ)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'T800 6K carbon fibre for Adani deepwater oil production riser reinforcement and drill pipe &#8594; 6K tow &#8594; &#8377;680Cr for 70 tonnes &#8594; India &#8377;4,600Cr CF O&amp;G &#8594; Adani 200 risers &#8594; 5,880 MPa &#8594; &#8594; Tow &#8594; &#8594; T800 &#8594; &#8594; Oil &amp; Gas' },
  { id: 'CF-0011', batchNo: 'CF-B2411', city: 'Lucknow', manufacturer: 'UP Composites', cfGrade: 'T300 3K Medical', application: 'Trivitron MRI Coil', purityPercent: 99.2, tensileGpa: 3.53, investmentCr: 460, status: 'Delivered', priority: 'Medium', origin: 'UP Composites Lucknow (UP)', destination: 'Trivitron Chennai (TN)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'T300 3K carbon fibre for Trivitron 3T MRI gradient coil former and RF shield &#8594; 3K tow &#8594; &#8377;460Cr for 30 tonnes &#8594; India &#8377;2,800Cr CF medical &#8594; Trivitron 200 scanners &#8594; 3,530 MPa &#8594; &#8594; Fabric &#8594; &#8594; T300 &#8594; &#8594; Medical' },
  { id: 'CF-0012', batchNo: 'CF-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Composites', cfGrade: 'M40J 6K Submarine', application: 'GRSE Project 75I Sail', purityPercent: 99.4, tensileGpa: 4.41, investmentCr: 940, status: 'Delayed', priority: 'Critical', origin: 'Vizag Composites Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'M40J 6K intermediate modulus carbon fibre for GRSE Project 75I submarine sail and fairwater passive sonar dome &#8594; 6K tow &#8597; India &#8377;7,600Cr CF naval &#8594; GRSE 6 submarines &#8597; 4,410 MPa &#8597; &#8594; Prepreg &#8594; &#8594; M40J &#8594; &#8594; Naval' },
  { id: 'CF-0013', batchNo: 'CF-B2413', city: 'Bhopal', manufacturer: 'BHEL R&amp;D', cfGrade: 'T700 12K Power', application: 'BHEL Wind Turbine Blade', purityPercent: 98.7, tensileGpa: 4.9, investmentCr: 720, status: 'In Transit', priority: 'High', origin: 'BHEL R&amp;D Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'T700 12K carbon fibre for BHEL 3.6MW wind turbine blade spar cap and shear web &#8594; 12K tow &#8594; &#8377;720Cr for 400 tonnes &#8594; India &#8377;5,000Cr CF wind &#8594; BHEL 600 blades &#8594; 4,900 MPa &#8594; &#8594; UD Tape &#8594; &#8594; T700 &#8594; &#8594; Power' },
  { id: 'CF-0014', batchNo: 'CF-B2414', city: 'Rourkela', manufacturer: 'SAIL Composites', cfGrade: 'T300 12K Steel Rebar', application: 'SAIL Concrete Bridge Deck', purityPercent: 97.6, tensileGpa: 3.53, investmentCr: 360, status: 'Delivered', priority: 'Medium', origin: 'SAIL Rourkela (OD)', destination: 'NHAI Delhi (DL)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'T300 12K carbon fibre reinforced polymer rebar for NHAI highway bridge deck seismic retrofit &#8594; 12K tow &#8594; &#8377;360Cr for 200 tonnes &#8594; India &#8377;2,200Cr CF infra &#8594; NHAI 50 bridges &#8594; 3,530 MPa &#8594; &#8594; Rebar &#8594; &#8594; T300 &#8594; &#8594; Infrastructure' },
];

export default function CarbonFibreLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Hexagon },
    { id: 'registry', label: 'Registry', icon: Hexagon },
    { id: 'analytics', label: 'Analytics', icon: Hexagon },
    { id: 'insights', label: 'Insights', icon: Hexagon },
  ];

  const filteredRecords = useMemo(() => {
    return carbonFibreRecords.filter((r) => {
      const matchSearch = searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cfGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.application.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = filterZone === 'all' || r.zone === filterZone;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [searchTerm, filterZone, filterStatus]);

  const zones = useMemo(() => {
    const zMap: Record<string, number> = {};
    carbonFibreRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = carbonFibreRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = carbonFibreRecords.reduce((s: number, r) => s + r.purityPercent, 0) / carbonFibreRecords.length;
    const delayed = carbonFibreRecords.filter((r) => r.status === 'Delayed').length;
    const critical = carbonFibreRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#0891b2';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Carbon Fibre Logistics" description="Indian carbon fibre (T300/T700/T800/M40J) aerospace, wind energy, automotive, defense, oil &amp; gas and infrastructure supply chain tracking across 14 grades" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Total Investment</div></CardContent></Card>
        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.avgPurity}%</div><div className="text-xs text-muted-foreground mt-1">Avg Purity</div></CardContent></Card>
        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.delayed}</div><div className="text-xs text-muted-foreground mt-1">Delayed Batches</div></CardContent></Card>
        <Card className="border-l-4 border-l-cyan-500"><CardContent className="pt-6"><div className="text-2xl font-bold text-cyan-600">{kpiData.critical}</div><div className="text-xs text-muted-foreground mt-1">Critical Records</div></CardContent></Card>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-cyan-500 text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / carbonFibreRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = carbonFibreRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {carbonFibreRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.cfGrade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Grade:</span><span className="font-medium">{record.cfGrade}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Application:</span><span className="font-medium">{record.application}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Purity:</span><span className="font-medium">{record.purityPercent}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Tensile Strength:</span><span className="font-medium">{record.tensileGpa} Tensile Strength</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {carbonFibreRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; carbonFibreRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = carbonFibreRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; carbonFibreRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; carbonFibreRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / carbonFibreRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Aerospace &amp; Defense Dominance</div><div className="text-xs text-muted-foreground mt-1">HAL Tejas wing &#8594; DRDO Nirbhay fuselage &#8594; ISRO PSLV fairing &#8594; GRSE submarine sail driving &#8594; &#8377;3,680Cr combined &#8594; highest priority segment</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Wind Energy Boom</div><div className="text-xs text-muted-foreground mt-1">Suzlon 4MW blade &#8594; BHEL 3.6MW blade &#8594; &#8594; &#8377;1,360Cr combined &#8594; India 60GW wind target &#8594; 40% CF content per blade</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Automotive Lightweighting</div><div className="text-xs text-muted-foreground mt-1">Mahindra EV roof &#8594; Bajaj moto frame &#8594; &#8594; &#8377;1,000Cr combined &#8594; 30% weight reduction push &#8594; EV range improvement</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">CF-B2412 GRSE Project 75I submarine sail delayed &#8594; monsoon Visakhapatnam port congestion &#8594; stealth submarine build at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 carbon fibre grades spanning aerospace, defense, wind, EV, oil &amp; gas, medical, infrastructure &#8594; avg purity {kpiData.avgPurity}%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Critical Priority: 5 Records</div><div className="text-xs text-muted-foreground mt-1">HAL Tejas &#8594; DRDO missile &#8594; ISRO PSLV &#8594; GRSE submarine &#8594; &#8594; national security composite supply chain</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; Grasim lead &#8594; Tata Advanced &#8594; L&amp;T &#8594; BHEL drive application-specific</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-cyan-500 bg-cyan-50/50"><div className="font-medium">Import Dependency Alert</div><div className="text-xs text-muted-foreground mt-1">T800, M40J grades heavily import-dependent from Japan/Toray &#8594; Atmanirbhar CF push via Grasim &#8594; MIDHANI PANIPAT capacity ramp</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
