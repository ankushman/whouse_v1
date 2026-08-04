"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { Construction } from 'lucide-react';

interface AluminiumPowderRecord {
  id: string; batchNo: string; city: string; manufacturer: string; grade: string;
  application: string; purityPercent: number; specProp: number; investmentCr: number;
  status: string; priority: string; origin: string; destination: string;
  shipDate: string; transitDays: number; zone: string; remarks: string;
};

const aluminiumpowderRecords: AluminiumPowderRecord[] = [
  { id: 'ALP-0001', batchNo: 'ALP-B2401', city: 'Mumbai', manufacturer: 'MIDHANI', grade: 'Al 99.7% Atomized Aerospace', application: 'HAL Tejas Mk2 Wing Panel SLM', purityPercent: 99.7, specProp: 25, investmentCr: 860, status: 'Delivered', priority: 'Critical', origin: 'MIDHANI Hyderabad (TG)', destination: 'HAL Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Al 99.7% atomized powder for HAL Tejas Mk2 wing panel selective laser melting additive manufacturing &amp;#8594; 25 micron &amp;#8594; &amp;#8377;860Cr for 30 tonnes &amp;#8594; India &amp;#8377;6,200Cr Al AM &amp;#8594; HAL 40 aircraft &amp;#8594; 99.7% purity &amp;#8594; &amp;#8594; Powder &amp;#8594; &amp;#8594; AlAtom &amp;#8594; &amp;#8594; Aerospace' },
  { id: 'ALP-0002', batchNo: 'ALP-B2402', city: 'Bengaluru', manufacturer: 'DRDO DMRL', grade: 'Al 99.5% Gas Atomized Missile', application: 'DRDO BrahMos Mk2 Fuel Air Explosive', purityPercent: 99.5, specProp: 40, investmentCr: 780, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'DRDO Chandipur (OD)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Al 99.5% gas atomized flake powder for DRDO BrahMos Mk2 thermobaric fuel-air explosive enhancer &amp;#8594; 40 micron &amp;#8594; &amp;#8377;780Cr for 45 tonnes &amp;#8594; India &amp;#8377;5,400Cr Al military &amp;#8594; DRDO 200 missiles &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Flake &amp;#8594; &amp;#8594; AlMil &amp;#8594; &amp;#8594; Defense' },
  { id: 'ALP-0003', batchNo: 'ALP-B2403', city: 'Chennai', manufacturer: 'Tata Advanced Materials', grade: 'Al 99.9% Spherical 3D Print', application: 'ISRO PSLV Rocket Engine Bracket', purityPercent: 99.9, specProp: 15, investmentCr: 940, status: 'Delivered', priority: 'Critical', origin: 'Tata Adv Mumbai (MH)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'Al 99.9% spherical powder for ISRO PSLV rocket engine bracket DMLS additive manufacturing &amp;#8594; 15 micron &amp;#8594; &amp;#8377;940Cr for 25 tonnes &amp;#8594; India &amp;#8377;7,600Cr Al space &amp;#8594; ISRO 12 launches &amp;#8594; 99.9% purity &amp;#8594; &amp;#8594; Spherical &amp;#8594; &amp;#8594; AlSpace &amp;#8594; &amp;#8594; Space' },
  { id: 'ALP-0004', batchNo: 'ALP-B2404', city: 'Hyderabad', manufacturer: 'Bharat Forge', grade: 'Al 99.0% Water Atomized Auto', application: 'Mahindra XUV400 EV Motor Housing', purityPercent: 99.0, specProp: 50, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'Bharat Forge Pune (MH)', destination: 'Mahindra Pune (MH)', shipDate: '2026-07-18', transitDays: 4, zone: 'West', remarks: 'Al 99.0% water atomized powder for Mahindra XUV400 EV motor housing metal injection molding &amp;#8594; 50 micron &amp;#8594; &amp;#8377;480Cr for 80 tonnes &amp;#8594; India &amp;#8377;3,200Cr Al MIM &amp;#8594; Mahindra 50K motors &amp;#8594; 99.0% purity &amp;#8594; &amp;#8594; Irregular &amp;#8594; &amp;#8594; AlMIM &amp;#8594; &amp;#8594; Automotive' },
  { id: 'ALP-0005', batchNo: 'ALP-B2405', city: 'Kolkata', manufacturer: 'Shyam Metalloys', grade: 'Al 98% Pyrotechnic', application: 'Sivakasi Fireworks Festival Grade', purityPercent: 98.0, specProp: 80, investmentCr: 320, status: 'In Transit', priority: 'Medium', origin: 'Shyam Metalloys Kolkata (WB)', destination: 'Sivakasi (TN)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: 'Al 98% flake powder for Sivakasi fireworks pyrotechnic sparkle and flash composition &amp;#8594; 80 micron &amp;#8594; &amp;#8377;320Cr for 120 tonnes &amp;#8594; India &amp;#8377;2,200Cr Al pyro &amp;#8594; Sivakasi 500M crackers &amp;#8594; 98.0% purity &amp;#8594; &amp;#8594; Flake &amp;#8594; &amp;#8594; AlPyro &amp;#8594; &amp;#8594; Pyrotechnic' },
  { id: 'ALP-0006', batchNo: 'ALP-B2406', city: 'Coimbatore', manufacturer: 'BHEL R&D', grade: 'Al 99.6% Plasma Spray', application: 'BHEL 800MW GT Blade Coating', purityPercent: 99.6, specProp: 30, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'BHEL Bhopal (MP)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Al 99.6% plasma spray powder for BHEL 800MW gas turbine blade bond coating &amp;#8594; 30 micron &amp;#8594; &amp;#8377;720Cr for 55 tonnes &amp;#8594; India &amp;#8377;5,000Cr Al coating &amp;#8594; BHEL 20 GTs &amp;#8594; 99.6% purity &amp;#8594; &amp;#8594; Spherical &amp;#8594; &amp;#8594; AlCoat &amp;#8594; &amp;#8594; Power' },
  { id: 'ALP-0007', batchNo: 'ALP-B2407', city: 'Pune', manufacturer: 'Indian Aluminium', grade: 'Al 99.5% Extrusion Fine', application: 'Jindal Aluminium Automotive Extrusion', purityPercent: 99.5, specProp: 45, investmentCr: 440, status: 'Delivered', priority: 'Medium', origin: 'Indian Al Mumbai (MH)', destination: 'Jindal Hisar (HR)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Al 99.5% fine powder for Jindal Aluminium automotive extrusion billet degassing agent &amp;#8594; 45 micron &amp;#8594; &amp;#8377;440Cr for 60 tonnes &amp;#8594; India &amp;#8377;3,000Cr Al extrusion &amp;#8594; Jindal 100K billets &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Granular &amp;#8594; &amp;#8594; AlExt &amp;#8594; &amp;#8594; Manufacturing' },
  { id: 'ALP-0008', batchNo: 'ALP-B2408', city: 'Jaipur', manufacturer: 'Rajasthan Powder Metals', grade: 'Al 99.2% Sintered Bearing', application: 'Indian Railways RCF Sintered Bush', purityPercent: 99.2, specProp: 35, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'Rajasthan PM Udaipur (RJ)', destination: 'RCF Kapurthala (PB)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'Al 99.2% sintered powder for Indian Railways wheel factory self-lubricating sintered bronze-aluminium bush &amp;#8594; 35 micron &amp;#8594; &amp;#8377;520Cr for 70 tonnes &amp;#8594; India &amp;#8377;3,600Cr Al PM &amp;#8594; IR 200K wheels &amp;#8594; 99.2% purity &amp;#8594; &amp;#8594; Atomized &amp;#8594; &amp;#8594; AlSint &amp;#8594; &amp;#8594; Rail' },
  { id: 'ALP-0009', batchNo: 'ALP-B2409', city: 'Guwahati', manufacturer: 'Assam Aluminium', grade: 'Al 97% Thermite Welding', application: 'Indian Railways Track Thermite Weld', purityPercent: 97.0, specProp: 100, investmentCr: 380, status: 'In Transit', priority: 'High', origin: 'Assam Al Tezpur (AS)', destination: 'Indian Railways Delhi (DL)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'Al 97% coarse powder for Indian Railways track joint thermite welding exothermic mixture &amp;#8594; 100 micron &amp;#8594; &amp;#8377;380Cr for 150 tonnes &amp;#8594; India &amp;#8377;2,600Cr Al thermite &amp;#8594; IR 50K welds &amp;#8594; 97.0% purity &amp;#8594; &amp;#8594; Coarse &amp;#8594; &amp;#8594; AlTherm &amp;#8594; &amp;#8594; Rail' },
  { id: 'ALP-0010', batchNo: 'ALP-B2410', city: 'Ahmedabad', manufacturer: 'Gujarat Aluminium', grade: 'Al 99.8% Nuclear Grade', application: 'IGCAR PFBR Moderator Suspension', purityPercent: 99.8, specProp: 20, investmentCr: 900, status: 'Delivered', priority: 'Critical', origin: 'Gujarat Al Ahmedabad (GJ)', destination: 'IGCAR Kalpakkam (TN)', shipDate: '2026-07-24', transitDays: 5, zone: 'West', remarks: 'Al 99.8% nuclear-grade powder for IGCAR PFBR reactor moderator grid aluminium suspension &amp;#8594; 20 micron &amp;#8594; &amp;#8377;900Cr for 20 tonnes &amp;#8594; India &amp;#8377;7,400Cr Al nuclear &amp;#8594; IGCAR 2 reactors &amp;#8594; 99.8% purity &amp;#8594; &amp;#8594; Spherical &amp;#8594; &amp;#8594; AlNuc &amp;#8594; &amp;#8594; Nuclear' },
  { id: 'ALP-0011', batchNo: 'ALP-B2411', city: 'Lucknow', manufacturer: 'UP Aluminium', grade: 'Al 98.5% Chemical', application: 'NTPC FGD Alumina Precipitation', purityPercent: 98.5, specProp: 60, investmentCr: 420, status: 'Delivered', priority: 'Medium', origin: 'UP Al Kanpur (UP)', destination: 'NTPC Singrauli (MP)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'Al 98.5% medium powder for NTPC FGD fly ash alumina precipitation reagent &amp;#8594; 60 micron &amp;#8594; &amp;#8377;420Cr for 90 tonnes &amp;#8594; India &amp;#8377;2,800Cr Al chemical &amp;#8594; NTPC 20 plants &amp;#8594; 98.5% purity &amp;#8594; &amp;#8594; Granular &amp;#8594; &amp;#8594; AlChem &amp;#8594; &amp;#8594; Power' },
  { id: 'ALP-0012', batchNo: 'ALP-B2412', city: 'Visakhapatnam', manufacturer: 'Vizag Aluminium', grade: 'Al 99.7% Submarine AM', application: 'GRSE Project 75I Sonar Array', purityPercent: 99.7, specProp: 22, investmentCr: 960, status: 'Delayed', priority: 'Critical', origin: 'Vizag Al Visakhapatnam (AP)', destination: 'GRSE Kolkata (WB)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Al 99.7% submarine-grade powder for GRSE Project 75I sonar array housing SLM additive &amp;#8594; 22 micron &amp;#8597; &amp;#8377;960Cr for 25 tonnes &amp;#8597; India &amp;#8377;7,800Cr Al submarine &amp;#8597; GRSE 6 submarines &amp;#8597; 99.7% purity &amp;#8597; &amp;#8594; Spherical &amp;#8597; &amp;#8594; AlSub &amp;#8597; &amp;#8594; Naval' },
  { id: 'ALP-0013', batchNo: 'ALP-B2413', city: 'Bhopal', manufacturer: 'DRDO TBRL', grade: 'Al 99.5% Solid Rocket Fuel', application: 'DRDO Akash Missile Propellant', purityPercent: 99.5, specProp: 30, investmentCr: 840, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TG)', destination: 'BHEL Hyderabad (TG)', shipDate: '2026-07-27', transitDays: 3, zone: 'Central', remarks: 'Al 99.5% fine powder for DRDO Akash SAM solid rocket propellant metal fuel additive &amp;#8594; 30 micron &amp;#8594; &amp;#8377;840Cr for 50 tonnes &amp;#8594; India &amp;#8377;5,800Cr Al propellant &amp;#8594; DRDO 300 missiles &amp;#8594; 99.5% purity &amp;#8594; &amp;#8594; Fine &amp;#8594; &amp;#8594; AlProp &amp;#8594; &amp;#8594; Defense' },
  { id: 'ALP-0014', batchNo: 'ALP-B2414', city: 'Rourkela', manufacturer: 'SAIL Aluminium', grade: 'Al 96% Deoxidizer', application: 'SAIL EAF Steel Deoxidation', purityPercent: 96.0, specProp: 120, investmentCr: 280, status: 'Delivered', priority: 'Low', origin: 'SAIL Rourkela (OD)', destination: 'SAIL Bhilai (CG)', shipDate: '2026-07-28', transitDays: 4, zone: 'East', remarks: 'Al 96% coarse powder for SAIL electric arc furnace aluminium deoxidation shot &amp;#8594; 120 micron &amp;#8594; &amp;#8377;280Cr for 200 tonnes &amp;#8594; India &amp;#8377;1,800Cr Al deox &amp;#8594; SAIL 6 furnaces &amp;#8594; 96.0% purity &amp;#8594; &amp;#8594; Granule &amp;#8594; &amp;#8594; AlDeox &amp;#8594; &amp;#8594; Steel' },
];

export default function AluminiumPowderLogisticsView() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Construction },
    { id: 'registry', label: 'Registry', icon: Construction },
    { id: 'analytics', label: 'Analytics', icon: Construction },
    { id: 'insights', label: 'Insights', icon: Construction },
  ];

  const filteredRecords = useMemo(() => {
    return aluminiumpowderRecords.filter((r) => {
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
    aluminiumpowderRecords.forEach((r) => { zMap[r.zone] = (zMap[r.zone] || 0) + 1; });
    return Object.entries(zMap).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpiData = useMemo(() => {
    const total = aluminiumpowderRecords.reduce((s: number, r) => s + r.investmentCr, 0);
    const avgPurity = aluminiumpowderRecords.reduce((s: number, r) => s + r.purityPercent, 0) / aluminiumpowderRecords.length;
    const delayed = aluminiumpowderRecords.filter((r) => r.status === 'Delayed').length;
    const critical = aluminiumpowderRecords.filter((r) => r.priority === 'Critical').length;
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

  const themeColor = '#475569';
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Aluminium Powder Logistics" description="Indian aluminium powder logistics supply chain tracking across 14 grades spanning aerospace, defense, additive manufacturing, pyrotechnics, optics, nuclear and automotive sectors" />
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
            <div className="space-y-2">{zones.map(([zone, count]) => { const pct = (count as number / aluminiumpowderRecords.length) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16 text-muted-foreground">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium w-8">{count as number}</span></div>; })}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Delivered', 'In Transit', 'Delayed', 'Processing'].map((s) => { const c = aluminiumpowderRecords.filter((r) => r.status === s).length; return <div key={s} className={`text-center p-3 rounded-lg border ${statusColor(s)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{s}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Investment by Grade (Top 8)</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {aluminiumpowderRecords.slice(0, 8).map((r) => <div key={r.id} className="text-center p-3 rounded-lg border bg-muted/30"><div className="text-sm font-medium truncate">{r.grade}</div><div className="text-lg font-bold" style={{ color: themeColor }}>&#8377;{r.investmentCr}Cr</div><div className="text-xs text-muted-foreground">{r.application}</div></div>)}
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
                    <div className="flex justify-between"><span className="text-muted-foreground">Particle Size (um)</span><span className="font-medium">{record.specProp}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Investment:</span><span className="font-medium" style={{ color: themeColor }}>&#8377;{record.investmentCr}Cr</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City:</span><span className="font-medium">{record.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Route:</span><span className="font-medium text-xs">{record.origin} &#8594; {record.destination}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">Showing {filteredRecords.length} of {aluminiumpowderRecords.length} records</div>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Manufacturer Performance</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const mfrMap: Record<string, number> = {}; aluminiumpowderRecords.forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className="flex items-center gap-2"><span className="text-xs w-40 truncate">{mfr as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Critical', 'High', 'Medium', 'Low'].map((p) => { const c = aluminiumpowderRecords.filter((r) => r.priority === p).length; return <div key={p} className={`text-center p-3 rounded-lg border ${priorityColor(p)}`}><div className="text-lg font-bold">{c}</div><div className="text-xs">{p}</div></div>; })}
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment by Zone</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">{(() => { const zInv: Record<string, number> = {}; aluminiumpowderRecords.forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone as string}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">&#8377;{inv as number}Cr</span></div>; }); })()}</div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Purity Distribution</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {(() => { const ranges = { '99%+': 0, '95-98.9%': 0, '90-94.9%': 0, '<90%': 0 }; aluminiumpowderRecords.forEach((r) => { if (r.purityPercent >= 99) ranges['99%+']++; else if (r.purityPercent >= 95) ranges['95-98.9%']++; else if (r.purityPercent >= 90) ranges['90-94.9%']++; else ranges['<90%']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / aluminiumpowderRecords.length) * 100; return <div key={range} className="flex items-center gap-2"><span className="text-xs w-24">{range}</span><div className="flex-1 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className="text-xs font-medium">{count}</span></div>; }); })()}
            </div>
          </CardContent></Card>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle className="text-base">Supply Chain Intelligence</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Additive Manufacturing Revolution</div><div className="text-xs text-muted-foreground mt-1">HAL Tejas SLM &#8594; ISRO PSLV DMLS &#8594; GRSE sonar array &#8594; &#8377;2,760Cr combined &#8594; highest growth segment</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Defense &amp; Strategic</div><div className="text-xs text-muted-foreground mt-1">DRDO BrahMos thermobaric &#8594; DRDO Akash propellant &#8594; &#8377;1,620Cr combined &#8594; national security critical</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Power &amp; Nuclear</div><div className="text-xs text-muted-foreground mt-1">BHEL GT coating &#8594; IGCAR nuclear &#8594; NTPC FGD &#8594; &#8377;2,040Cr combined &#8594; infrastructure backbone</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Monsoon Disruption Alert</div><div className="text-xs text-muted-foreground mt-1">ALP-B2412 GRSE Project 75I sonar array AM powder delayed &#8594; monsoon Visakhapatnam &#8594; submarine programme at risk</div></div>
          </div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Investment Landscape</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Total Portfolio: &#8377;8,760 Cr</div><div className="text-xs text-muted-foreground mt-1">Across 14 Al powder grades spanning aerospace, defense, space, pyrotechnic, coating, PM, rail, nuclear, automotive &#8594; avg purity 99.11%</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Critical Priority: 7 Records</div><div className="text-xs text-muted-foreground mt-1">HAL Tejas &#8594; DRDO BrahMos &#8594; ISRO PSLV &#8594; BHEL GT &#8594; IGCAR nuclear &#8594; GRSE submarine &#8594; DRDO Akash</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Top Manufacturers</div><div className="text-xs text-muted-foreground mt-1">MIDHANI &#8594; DRDO &#8594; BHEL &#8594; Tata Advanced &#8594; HAL lead strategic &#8594; Shyam Metalloys &#8594; Indian Aluminium drive commercial</div></div>
            <div className="p-3 rounded-lg border-l-4 border-l-slate-500 bg-slate-50/50"><div className="font-medium">Powder Size Spectrum</div><div className="text-xs text-muted-foreground mt-1">Range 15-120 micron &#8594; aerospace finest 15-25 micron &#8594; thermite coarsest 100-120 &#8594; particle size critical to application</div></div>
          </div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
