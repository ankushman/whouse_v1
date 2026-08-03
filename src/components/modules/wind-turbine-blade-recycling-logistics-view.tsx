'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface WTBRecord {
  id: string;
  batchNo: string;
  bladeModel: string;
  bladeLength: number;
  material: string;
  recyclingMethod: string;
  outputProduct: string;
  bladeWeight: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: WTBRecord[] = [
  { id: 'WTB-0001', batchNo: 'WTB-B2401', bladeModel: 'Vestas V110-2.0', bladeLength: 55, material: 'GFRP Epoxy', recyclingMethod: 'Mechanical Shredding', outputProduct: 'Glass Fiber Filler', bladeWeight: 12, status: 'In Transit', priority: 'Critical', origin: 'Jaisalmer (Vestas Rep)', destination: 'Bhilwara (JK Cement)', shipDate: '2026-07-20', transitDays: 3, zone: 'North', remarks: '55m GFRP blade mechanical shredding to glass fiber filler for JK Cement clinker replacement &#8212; 12 tonnes/blade' },
  { id: 'WTB-0002', batchNo: 'WTB-B2402', bladeModel: 'Suzlon S111-2.1', bladeLength: 56, material: 'GFRP Vinyl Ester', recyclingMethod: 'Pyrolysis', outputProduct: 'Glass Fiber + Pyro-Gas', bladeWeight: 14, status: 'Delivered', priority: 'High', origin: 'Dhule (Suzlon Rep)', destination: 'Nagpur (NPCIL Ash)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: '56m Suzlon blade pyrolysis for glass fiber recovery + syngas for NPCIL thermal power plant co-firing' },
  { id: 'WTB-0003', batchNo: 'WTB-B2403', bladeModel: 'GE V136-3.8', bladeLength: 68, material: 'GFRP + Carbon Hybrid', recyclingMethod: 'Chemical Solvolysis', outputProduct: 'Clean Glass Fiber', bladeWeight: 22, status: 'Processing', priority: 'High', origin: 'Kanyakumari (GE Rep)', destination: 'Chennai (Adani Composites)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: '68m GE hybrid blade chemical solvolysis recovering clean glass fiber for Adani new wind blade composite input' },
  { id: 'WTB-0004', batchNo: 'WTB-B2404', bladeModel: 'Siemens SG126-4.0', bladeLength: 63, material: 'GFRP Epoxy', recyclingMethod: 'Mechanical Shredding', outputProduct: 'Raw Composite Powder', bladeWeight: 18, status: 'In Transit', priority: 'Critical', origin: 'Kutch (Siemens Rep)', destination: 'Ahmedabad (Reliance Chem)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: '63m Siemens blade shredded to composite powder for Reliance Ahmedabad chemical filler and polymer reinforcement' },
  { id: 'WTB-0005', batchNo: 'WTB-B2405', bladeModel: 'Suzlon S120-2.1', bladeLength: 60, material: 'GFRP Polyester', recyclingMethod: 'Co-Processing Cement Kiln', outputProduct: 'Thermal Energy + SiCa', bladeWeight: 16, status: 'Delayed', priority: 'Medium', origin: 'Tirunelveli (Suzlon Rep)', destination: 'Ramanathapuram (India Cements)', shipDate: '2026-07-12', transitDays: 14, zone: 'South', remarks: '60m blade co-processed in cement kiln &#8212; logistics approval for oversized blade transport on TN highway delayed 14 days' },
  { id: 'WTB-0006', batchNo: 'WTB-B2406', bladeModel: 'Vestas V150-4.2', bladeLength: 75, material: 'GFRP Epoxy', recyclingMethod: 'Pyrolysis + CFD Recovery', outputProduct: 'High-Value CFD Fiber', bladeWeight: 28, status: 'Delivered', priority: 'High', origin: 'Kolar (Vestas Rep)', destination: 'Bengaluru (CSIR-NAL)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: '75m blade pyrolysis recovering high-value carbon fiber dispersion for CSIR-NAL aerospace research program' },
  { id: 'WTB-0007', batchNo: 'WTB-B2407', bladeModel: 'Inox S95-2.0', bladeLength: 48, material: 'GFRP Vinyl Ester', recyclingMethod: 'Mechanical Grinding', outputProduct: 'Fine Glass Powder', bladeWeight: 10, status: 'In Transit', priority: 'High', origin: 'Guntur (Inox Rep)', destination: 'Vijayawada (ACC Ltd)', shipDate: '2026-07-21', transitDays: 1, zone: 'South', remarks: '48m Inox blade ground to fine glass powder for ACC Vijayawada white cement additive and pozzolanic material' },
  { id: 'WTB-0008', batchNo: 'WTB-B2408', bladeModel: 'Repoweri R86-2.0', bladeLength: 43, material: 'GFRP Polyester', recyclingMethod: 'Co-Processing Cement Kiln', outputProduct: 'Calcium Silicate', bladeWeight: 8, status: 'Delivered', priority: 'Medium', origin: 'Osmanabad (Repoweri)', destination: 'Solapur (UltraTech Cement)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: '43m blade co-processed in UltraTech Solapur cement kiln &#8212; silica-rich blade replaces 5% limestone feed' },
  { id: 'WTB-0009', batchNo: 'WTB-B2409', bladeModel: 'Gamesa G114-2.1', bladeLength: 57, material: 'GFRP Epoxy', recyclingMethod: 'Chemical Solvolysis', outputProduct: 'Epoxy Monomer Recycle', bladeWeight: 15, status: 'Processing', priority: 'High', origin: 'Jodhpur (Gamesa Rep)', destination: 'Jaipur (Rajasthan Polymers)', shipDate: '2026-07-24', transitDays: 1, zone: 'North', remarks: '57m Gamesa blade solvolysis recovering epoxy monomer for Rajasthan Polymers virgin resin replacement at 30% blend' },
  { id: 'WTB-0010', batchNo: 'WTB-B2410', bladeModel: 'Siemens SG93-2.4', bladeLength: 47, material: 'GFRP Epoxy', recyclingMethod: 'Mechanical Shredding', outputProduct: 'Composite Pellets', bladeWeight: 11, status: 'In Transit', priority: 'High', origin: 'Dewas (Siemens Rep)', destination: 'Indore (Tata Plastics)', shipDate: '2026-07-22', transitDays: 1, zone: 'North', remarks: '47m Siemens blade shredded to composite pellets for Tata Plastics Indore injection molding compound input' },
  { id: 'WTB-0011', batchNo: 'WTB-B2411', bladeModel: 'Suzlon S97-2.1', bladeLength: 49, material: 'GFRP Vinyl Ester', recyclingMethod: 'Pyrolysis', outputProduct: 'Glass Fiber + Bio-Oil', bladeWeight: 13, status: 'Delivered', priority: 'Medium', origin: 'Dharwad (Suzlon Rep)', destination: 'Hubli (Karnataka Biofuel)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: '49m blade pyrolysis yielding glass fiber + bio-oil for Karnataka State Biofuel Development Board biodiesel blend' },
  { id: 'WTB-0012', batchNo: 'WTB-B2412', bladeModel: 'Vestas V126-3.45', bladeLength: 62, material: 'GFRP Epoxy', recyclingMethod: 'Co-Processing Cement Kiln', outputProduct: 'Silica + Thermal Energy', bladeWeight: 19, status: 'Delayed', priority: 'Low', origin: 'Kanyakumari (Vestas Rep)', destination: 'Tirunelveli (Dalmia Cement)', shipDate: '2026-07-10', transitDays: 16, zone: 'South', remarks: '62m blade cement kiln co-processing &#8212; Dalmia Tirunelveli kiln shutdown for scheduled maintenance, blade staging delay 16 days' },
  { id: 'WTB-0013', batchNo: 'WTB-B2413', bladeModel: 'GE V82-1.7', bladeLength: 41, material: 'GFRP Polyester', recyclingMethod: 'Mechanical Shredding', outputProduct: 'FRP Reconstituted Panel', bladeWeight: 7, status: 'In Transit', priority: 'Critical', origin: 'Gujarat (GE Rep)', destination: 'Bharuch (NGEL LowCost)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: '41m blade shredded and reconstituted into low-cost FRP panels for NGEL Bharuch affordable housing prefab walls' },
  { id: 'WTB-0014', batchNo: 'WTB-B2414', bladeModel: 'Nordex N117-2.4', bladeLength: 59, material: 'GFRP Epoxy', recyclingMethod: 'Chemical Solvolysis', outputProduct: 'Reclaimed Epoxy Resin', bladeWeight: 17, status: 'Processing', priority: 'Critical', origin: 'Madhya Pradesh (Nordex Rep)', destination: 'Bhopal (BHEL Composites)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: '59m Nordex blade solvolysis reclaiming epoxy resin for BHEL Bhopal wind turbine component remanufacturing program' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Recycling Method', key: 'recyclingMethod', options: [
    { value: 'Mechanical Shredding', count: 4 }, { value: 'Chemical Solvolysis', count: 3 }, { value: 'Co-Processing Cement Kiln', count: 3 }, { value: 'Pyrolysis', count: 2 },
  ]},
  { label: 'Output Product', key: 'outputProduct', options: [
    { value: 'Glass Fiber Filler', count: 1 }, { value: 'Glass Fiber + Pyro-Gas', count: 1 }, { value: 'Clean Glass Fiber', count: 1 }, { value: 'Raw Composite Powder', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 6 }, { value: 'North', count: 4 }, { value: 'West', count: 3 }, { value: 'East', count: 1 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Blades', value: 14, sub: 'Recycled Turbine Blades', color: 'text-cyan-800' },
  { title: 'Total Weight', value: '210 tonnes', sub: 'Composite Material', color: 'text-teal-700' },
  { title: 'Max Length', value: '75 m', sub: 'Vestas V150-4.2', color: 'text-blue-700' },
  { title: 'National Target', value: '\u20b94,200Cr', sub: 'Blade Recycling Mission', color: 'text-cyan-700' },
];

export default function WindTurbineBladeRecyclingLogisticsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => ((prev) => {
      const next = { ...prev };
      const arr = next[key] || [];
      if (arr.includes(value)) { next[key] = arr.filter((v: string) => v !== value); if (next[key].length === 0) delete next[key]; } else { next[key] = [...arr, value]; }
      return next;
    })(prev));
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.bladeModel} ${r.recyclingMethod} ${r.outputProduct} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof WTBRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const weightByMethod = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.recyclingMethod.split(' ')[0], (map.get(r.recyclingMethod.split(' ')[0]) || 0) + r.bladeWeight); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, bladeWeight]) => ({ name: name.slice(0, 14), bladeWeight }));
  }, []);

  const materialDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.material, (map.get(r.material) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name: name.slice(0, 16), value }));
  }, []);

  const marketTrend = useMemo(() => [
    { year: '2022', blades: 120 }, { year: '2023', blades: 350 }, { year: '2024', blades: 800 }, { year: '2025', blades: 1800 }, { year: '2026', blades: 3500 }, { year: '2027', blades: 7000 }, { year: '2028', blades: 15000 },
  ], []);

  const lengthData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), length: r.bladeLength }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const outputByMethod = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.recyclingMethod, (map.get(r.recyclingMethod) || 0) + r.bladeWeight); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, bladeWeight]) => ({ name: name.slice(0, 18), bladeWeight }));
  }, []);

  const COLORS = ['#0891b2', '#0e7490', '#155e75', '#164e63', '#06b6d4', '#22d3ee'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="wbr-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Circular Economy' }, { label: 'WTB Recycling' }]} />
      <PageHeader title="Wind Turbine Blade Recycling Logistics" description="Indian wind turbine blade circular economy &#8212; GFRP epoxy vinyl ester polyester composite blade recycling through mechanical shredding, pyrolysis thermal decomposition, chemical solvolysis epoxy recovery, and cement kiln co-processing for glass fiber filler, composite pellets, reclaimed resin, calcium silicate, bio-oil, and FRP reconstituted panel applications under National Blade Recycling Mission" />

      <div className="wbr-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="wbr-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="wbr-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`wbr-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-cyan-700 text-cyan-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="wbr-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="wbr-chart-card"><CardHeader><CardTitle className="text-sm">Weight by Recycling Method (tonnes)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={weightByMethod}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="bladeWeight" fill="#0891b2" radius={[4,4,0,0]} name="tonnes" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="wbr-chart-card"><CardHeader><CardTitle className="text-sm">Blade Material Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={materialDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name.slice(0,10)} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0891b2" /><Cell fill="#0e7490" /><Cell fill="#155e75" /><Cell fill="#164e63" /><Cell fill="#06b6d4" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="wbr-chart-card"><CardHeader><CardTitle className="text-sm">India WTB Recycling Growth (blades/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={marketTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="blades" stroke="#06b6d4" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="wbr-chart-card"><CardHeader><CardTitle className="text-sm">Blade Length (m) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={lengthData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="length" fill="#0e7490" radius={[4,4,0,0]} name="meters" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="wbr-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Blade Model</th><th className="px-2 py-2 text-left">Recycling</th><th className="px-2 py-2 text-right">m</th><th className="px-2 py-2 text-right">tonnes</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`wbr-table-row border-b hover:bg-cyan-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.bladeModel}</td>
                  <td className="px-2 py-2 text-xs">{r.recyclingMethod.split(' ')[0]}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.bladeLength}m</td>
                  <td className="px-2 py-2 text-right font-mono">{r.bladeWeight}t</td>
                  <td className="px-2 py-2"><Badge variant="outline" className={statusBadge[r.status]}>{r.status}</Badge></td>
                  <td className="px-2 py-2"><Badge variant="outline" className={statusColor[r.priority]}>{r.priority}</Badge></td>
                  <td className="px-2 py-2 text-xs">{r.origin} &#8594; {r.destination}</td>
                  <td className="px-2 py-2 text-xs text-muted-foreground">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="wbr-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="wbr-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0891b2" /><Cell fill="#0e7490" /><Cell fill="#155e75" /><Cell fill="#164e63" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="wbr-chart-card"><CardHeader><CardTitle className="text-sm">Output Weight by Full Method (tonnes)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={outputByMethod}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="bladeWeight" fill="#0891b2" radius={[4,4,0,0]} name="tonnes" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="wbr-chart-card"><CardHeader><CardTitle className="text-sm">Blade Length vs Weight</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), len: r.bladeLength, wt: r.bladeWeight }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="len" stroke="#0891b2" strokeWidth={2} name="length m" /><Line type="monotone" dataKey="wt" stroke="#06b6d4" strokeWidth={2} name="weight t" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="wbr-chart-card"><CardHeader><CardTitle className="text-sm">Recycling Method Count</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={Array.from(new Map(records.map((r) => [r.recyclingMethod, { name: r.recyclingMethod.split('(')[0].trim().slice(0, 16), value: 1 }])).values())} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0891b2" /><Cell fill="#0e7490" /><Cell fill="#155e75" /><Cell fill="#164e63" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="wbr-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="wbr-insight-card border-l-4 border-l-cyan-700"><CardHeader><CardTitle className="text-sm text-cyan-800">India WTB Recycling Target: 15,000 Blades by 2028</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s Ministry of New and Renewable Energy (MNRE) National Wind Turbine Blade Recycling Programme targeting 15,000 blades processed per year by 2028. India has 45 GW installed wind capacity with 65,000+ turbine blades approaching 20-year end-of-life, generating 2.5 million tonnes of composite waste. Phase-1 (2024-2026): 3,500 blades/year via mechanical shredding (Vestas Jaisalmer WTB-0001, Siemens Kutch WTB-0004) and cement kiln co-processing (Suzlon Tirunelveli WTB-0005, Inox Kolar WTB-0008) as lowest-cost routes at &#8377;2,500/tonne. Phase-2 (2026-2028): 15,000 blades/year adding chemical solvolysis (GE Kanyakumari WTB-0003, Gamesa Jodhpur WTB-0009) for high-value fiber recovery at &#8377;8,500/tonne and pyrolysis (Suzlon Dhule WTB-0002, Vestas Kolar WTB-0006) for glass fiber + syngas co-products. Total investment &#8377;4,200Cr with &#8377;1,800Cr MNRE PLI subsidy for blade recycling infrastructure, &#8377;1,400Cr OEM contributions from Suzlon (30% market share), Vestas, Siemens-Gamesa, GE, and &#8377;1,000Cr cement industry co-processing investment. Extended Producer Responsibility (EPR) framework: blade manufacturers mandating 80% blade material recovery rate by 2027, 95% by 2030. India targeting zero blade landfill by 2027 under Hazardous Waste Rules amendment.</p></CardContent></Card>
          <Card className="wbr-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Shipments: WTB-0005 and WTB-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">WTB-0005 (Suzlon Tirunelveli to India Cements Ramanathapuram, 14-day delay): 60m Suzlon S120-2.1 blade co-processing in cement kiln &#8214; oversized blade transport logistics approval delayed by Tamil Nadu Highway Department for 65m blade on 14-axle trailer requiring police escort and road-width verification on NH-44 and state highway SH-49. Blade width 4.2m at root section exceeds standard 3.5m trailer width, requiring NHAI special permit at &#8377;2.5L per blade convoy. Suzlon logistics subcontractor BLR Logistics resubmitting route survey after NHAI rejected initial Madurai bypass route due to 4.8m underpass height restriction. India Cements Ramanathapuram kiln co-processing capacity 15 blades/month at &#8377;2,200/tonne thermal credit. Suzlon 180 blades queued at Tirunelveli storage yard occupying 12,000 m2 of OEM blade refurbishment center. WTB-0012 (Vestas Kanyakumari to Dalmia Cement Tirunelveli, 16-day delay): 62m Vestas V126 blade for Dalmia Tirunelveli kiln co-processing &#8212; Dalmia cement kiln 4,500 TPD clinker line underwent scheduled 16-day annual shutdown for refractory relining and kiln drive motor replacement. Blade staging at Vestas Kanyakumari service center at &#8377;50,000/month storage cost. Dalmia kiln restart August 1 with blade co-processing resuming at 2 blades/day thermal substitution rate of 8% replacing petcoke at &#8377;18,000/tonne.</p></CardContent></Card>
          <Card className="wbr-insight-card border-l-4 border-l-teal-600"><CardHeader><CardTitle className="text-sm text-teal-700">Chemical Solvolysis: Epoxy Recovery Breakthrough</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">WTB-0003: GE V136-3.8 hybrid 68m blade chemical solvolysis at Kanyakumari &#8214; India&apos;s first commercial-scale solvolysis plant recovering clean glass fiber and reclaimed epoxy resin from GFRP/carbon hybrid wind blade composite. Solvolysis process: blade sections immersed in supercritical ethanol at 250C 100 bar for 4 hours dissolving epoxy matrix while preserving fiber integrity at 95% tensile strength retention. Recovered glass fiber: 8 tonnes/blade of continuous unidirectional fiber chopped to 25mm length for Adani Composites Chennai new blade manufacturing input at &#8377;45/kg (vs virgin &#8377;85/kg imported E-glass). Reclaimed epoxy monomer: bisphenol-A diglycidyl ether (DGEBA) at 80% purity suitable for non-structural composite applications. CSIR-NAL Bengaluru validating reclaimed fiber for aerospace interior panels (overhead bins, tray tables) under DGCA airworthiness certification. Gamesa Jodhpur WTB-0009: alternative solvolysis using formic acid at 120C ambient pressure achieving 70% epoxy recovery for Rajasthan Polymers Jaipur virgin resin replacement at 30% blend ratio. India&apos;s solvolysis capacity: 200 blades/year at Kanyakumari (GE-Vestas joint venture) expanding to 800 blades/year by 2028. Cost trajectory: &#8377;8,500/tonne currently (2026) targeting &#8377;5,000/tonne by 2028 through solvent recovery optimization and process heat integration with adjacent Suzlon blade factory.</p></CardContent></Card>
          <Card className="wbr-insight-card border-l-4 border-l-blue-600"><CardHeader><CardTitle className="text-sm text-blue-700">FRP Reconstituted Panels: Affordable Housing</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">WTB-0013: 41m GE V82-1.7 blade mechanically shredded and reconstituted into low-cost FRP panels for NGEL (NTPC Green Energy) Bharuch affordable housing prefab wall system &#8212; India&apos;s first large-scale application of recycled wind blade material in building construction. Process: blade sections mechanically shredded to 20mm composite flakes &#8594; mixed with fly ash (30%), cement binder (15%), and polyester resin (10%) &#8594; hot-pressed into 2.4m x 1.2m x 50mm sandwich panels with density 1,200 kg/m3, thermal conductivity 0.35 W/mK, and flexural strength 18 MPa. Panel properties meet BIS IS 15468 prefabricated building panel standards for single-story affordable housing under PM Awas Yojana (PMAY) rural housing program. Cost: &#8377;450/m2 panel (vs &#8377;750/m2 conventional FRP panel using virgin materials) &#8214; 40% cost reduction from zero-cost blade feedstock plus &#8377;150/m2 processing. NGEL Bharuch pilot: 500 affordable housing units (25 m2 each) requiring 12,500 m2 panel equivalent to 250 recycled blades/year. India&apos;s affordable housing demand: 29 million urban housing units by 2025 under PMAY requiring 725 million m2 prefab panels. WTB panel potential: 5% of PMAY demand (36 million m2) requiring 720,000 recycled blades &#8214; creating a circular economy value chain from wind energy to affordable housing. Environmental benefit: each recycled blade avoids 12 tonnes CO2 from landfill decomposition and replaces 8 tonnes of virgin cement in panel manufacturing.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
