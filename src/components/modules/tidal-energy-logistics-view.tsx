'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface TidalRecord {
  id: string;
  batchNo: string;
  turbineType: string;
  deploymentSite: string;
  ratedPower: number;
  tidalRange: number;
  flowSpeed: number;
  rotorDiameter: number;
  capacityFactor: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: TidalRecord[] = [
  { id: 'TDE-0001', batchNo: 'TDE-B2401', turbineType: 'Horizontal Axis Tidal', deploymentSite: 'Gulf of Kutch', ratedPower: 500, tidalRange: 5.2, flowSpeed: 3.8, rotorDiameter: 18, capacityFactor: 28, status: 'In Transit', priority: 'Critical', origin: 'Mumbai (Mazagon Dock)', destination: 'Mundra (Adani)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: '1MW triple-rotor tidal stream' },
  { id: 'TDE-0002', batchNo: 'TDE-B2402', turbineType: 'Vertical Axis Darrieus', deploymentSite: 'Sundarbans Delta', ratedPower: 250, tidalRange: 3.5, flowSpeed: 2.8, rotorDiameter: 12, capacityFactor: 24, status: 'Delivered', priority: 'High', origin: 'Kolkata (Garden Reach)', destination: 'Sagar Island (WBREDA)', shipDate: '2026-07-18', transitDays: 3, zone: 'East', remarks: 'Delta-adapted vertical turbine' },
  { id: 'TDE-0003', batchNo: 'TDE-B2403', turbineType: 'Barrage Tidal', deploymentSite: 'Kutch Tidal Barrage', ratedPower: 3000, tidalRange: 7.5, flowSpeed: 4.5, rotorDiameter: 25, capacityFactor: 22, status: 'Processing', priority: 'Medium', origin: 'Ahmedabad (Adani Heavy)', destination: 'Gulf of Kutch (GSEC)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'Bulb turbine for barrage sluice' },
  { id: 'TDE-0004', batchNo: 'TDE-B2404', turbineType: 'Horizontal Axis Tidal', deploymentSite: 'Hooghly Estuary', ratedPower: 350, tidalRange: 4.0, flowSpeed: 3.2, rotorDiameter: 16, capacityFactor: 26, status: 'Delayed', priority: 'Critical', origin: 'Bhubaneswar (NALCO)', destination: 'Kolkata (CESC)', shipDate: '2026-07-15', transitDays: 7, zone: 'East', remarks: 'Estuary silt protection delay' },
  { id: 'TDE-0005', batchNo: 'TDE-B2405', turbineType: 'Oscillating Hydrofoil', deploymentSite: 'Minicoy Atoll', ratedPower: 200, tidalRange: 2.8, flowSpeed: 2.5, rotorDiameter: 10, capacityFactor: 32, status: 'In Transit', priority: 'High', origin: 'Kochi (VSSC)', destination: 'Lakshadweep (ANIL)', shipDate: '2026-07-21', transitDays: 6, zone: 'South', remarks: 'Lakshadweep island micro-grid' },
  { id: 'TDE-0006', batchNo: 'TDE-B2406', turbineType: 'Vertical Axis Darrieus', deploymentSite: 'Daman Estuary', ratedPower: 150, tidalRange: 3.0, flowSpeed: 2.6, rotorDiameter: 8, capacityFactor: 25, status: 'Delivered', priority: 'Medium', origin: 'Surat (SVNIT)', destination: 'Daman (DNH Power)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'Compact vertical turbine' },
  { id: 'TDE-0007', batchNo: 'TDE-B2407', turbineType: 'Horizontal Axis Tidal', deploymentSite: 'Gulf of Cambay', ratedPower: 800, tidalRange: 8.0, flowSpeed: 5.0, rotorDiameter: 20, capacityFactor: 30, status: 'Processing', priority: 'Low', origin: 'Bengaluru (L&T)', destination: 'Bhavnagar (GMB)', shipDate: '2026-07-23', transitDays: 2, zone: 'West', remarks: 'Cambay high-range turbine' },
  { id: 'TDE-0008', batchNo: 'TDE-B2408', turbineType: 'Barrage Tidal', deploymentSite: 'Mahi Estuary Barrage', ratedPower: 1500, tidalRange: 6.5, flowSpeed: 4.0, rotorDiameter: 22, capacityFactor: 23, status: 'In Transit', priority: 'High', origin: 'Vadodara (GSFC)', destination: 'Mahi Estuary (GSECL)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: 'Ebb-generation bulb turbine' },
  { id: 'TDE-0009', batchNo: 'TDE-B2409', turbineType: 'Oscillating Hydrofoil', deploymentSite: 'Andaman Passage', ratedPower: 400, tidalRange: 3.8, flowSpeed: 3.0, rotorDiameter: 14, capacityFactor: 35, status: 'Delivered', priority: 'Medium', origin: 'Chennai (IIT-M)', destination: 'Port Blair (ANIL)', shipDate: '2026-07-16', transitDays: 5, zone: 'South', remarks: 'Deep channel oscillating wing' },
  { id: 'TDE-0010', batchNo: 'TDE-B2410', turbineType: 'Horizontal Axis Tidal', deploymentSite: 'Palk Strait', ratedPower: 600, tidalRange: 4.5, flowSpeed: 3.5, rotorDiameter: 18, capacityFactor: 27, status: 'Processing', priority: 'Critical', origin: 'Rameswaram (TN Fisheries)', destination: 'Pamban (TNEB)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: 'Palk Strait tidal stream pilot' },
  { id: 'TDE-0011', batchNo: 'TDE-B2411', turbineType: 'Vertical Axis Darrieus', deploymentSite: 'Mandovi Estuary', ratedPower: 180, tidalRange: 2.5, flowSpeed: 2.2, rotorDiameter: 9, capacityFactor: 22, status: 'In Transit', priority: 'High', origin: 'Goa (NIO)', destination: 'Panaji (GEDCOM)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'Tourist estuary pilot' },
  { id: 'TDE-0012', batchNo: 'TDE-B2412', turbineType: 'Barrage Tidal', deploymentSite: 'Gulf of Khambhat', ratedPower: 5000, tidalRange: 10.5, flowSpeed: 5.5, rotorDiameter: 28, capacityFactor: 20, status: 'Delivered', priority: 'Low', origin: 'Mumbai (L&T Heavy)', destination: 'Khambhat (NTPC)', shipDate: '2026-07-14', transitDays: 3, zone: 'West', remarks: 'Khambhat mega-barrage turbine' },
  { id: 'TDE-0013', batchNo: 'TDE-B2413', turbineType: 'Horizontal Axis Tidal', deploymentSite: 'Cochin Backwaters', ratedPower: 120, tidalRange: 1.5, flowSpeed: 1.8, rotorDiameter: 7, capacityFactor: 18, status: 'Delayed', priority: 'High', origin: 'Alappuzha (KSEB)', destination: 'Cochin (BPCL)', shipDate: '2026-07-12', transitDays: 9, zone: 'South', remarks: 'Backwater monsoon shipping' },
  { id: 'TDE-0014', batchNo: 'TDE-B2414', turbineType: 'Oscillating Hydrofoil', deploymentSite: 'Gulf of Mannar', ratedPower: 300, tidalRange: 3.2, flowSpeed: 2.8, rotorDiameter: 11, capacityFactor: 29, status: 'In Transit', priority: 'Medium', origin: 'Tuticorin (VOC Port)', destination: 'Rameswaram (TNEB)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'Marine bio-fouling resistant' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Turbine Type', key: 'turbineType', options: [
    { value: 'Horizontal Axis Tidal', count: 4 }, { value: 'Vertical Axis Darrieus', count: 3 }, { value: 'Barrage Tidal', count: 3 }, { value: 'Oscillating Hydrofoil', count: 3 }, { value: 'Cross-Flow', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 3 }, { value: 'High', count: 4 }, { value: 'Medium', count: 4 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 6 }, { value: 'South', count: 6 }, { value: 'East', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Turbines', value: 14, sub: 'Active Units', color: 'text-indigo-700' },
  { title: 'Combined Power', value: '14,350 kW', sub: 'Rated Capacity', color: 'text-blue-700' },
  { title: 'Avg Capacity Factor', value: '25.9%', sub: 'Tidal vs Solar 22%', color: 'text-teal-700' },
  { title: 'Max Tidal Range', value: '10.5 m', sub: 'Gulf of Khambhat', color: 'text-purple-700' },
];

export default function TidalEnergyLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.turbineType} ${r.deploymentSite} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof TidalRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const powerByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.turbineType.split(' ')[0]; map.set(k, (map.get(k) || 0) + r.ratedPower); });
    return Array.from(map.entries()).map(([name, power]) => ({ name: name.slice(0, 12), power }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const cfTrend = useMemo(() => [
    { month: 'Jan', cf: 20 }, { month: 'Feb', cf: 21 }, { month: 'Mar', cf: 22 }, { month: 'Apr', cf: 23 }, { month: 'May', cf: 24 }, { month: 'Jun', cf: 25 }, { month: 'Jul', cf: 26 },
  ], []);

  const rangeData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), range: r.tidalRange }));
  }, []);

  const speedBySite = useMemo(() => {
    return records.slice(0, 7).map((r) => ({ name: r.deploymentSite.split(' ')[0].slice(0, 8), speed: r.flowSpeed }));
  }, []);

  const priorityDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.priority, (map.get(r.priority) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const diameterData = useMemo(() => {
    return records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), diameter: r.rotorDiameter }));
  }, []);

  const COLORS = ['#1e3a5f', '#14532d', '#581c87', '#7c2d12', '#0c4a6e'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="tde-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Marine Energy' }, { label: 'Tidal Energy' }]} />
      <PageHeader title="Tidal Energy Logistics" description="Indian tidal energy supply chain \u2014 HAT, VAT Darrieus, Barrage, Oscillating Hydrofoil turbine tracking" />

      <div className="tde-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="tde-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="tde-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tde-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="tde-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="tde-chart-card"><CardHeader><CardTitle className="text-sm">Power by Turbine Type (kW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={powerByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="power" fill="#1e3a5f" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="tde-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#1e3a5f" /><Cell fill="#14532d" /><Cell fill="#581c87" /><Cell fill="#7c2d12" /><Cell fill="#0c4a6e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="tde-chart-card"><CardHeader><CardTitle className="text-sm">Capacity Factor Trend (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={cfTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[15, 30]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="cf" stroke="#14532d" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="tde-chart-card"><CardHeader><CardTitle className="text-sm">Tidal Range by Batch (m)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={rangeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="range" fill="#581c87" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="tde-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-left">Site</th><th className="px-2 py-2 text-right">kW</th><th className="px-2 py-2 text-right">m</th><th className="px-2 py-2 text-right">m/s</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`tde-table-row border-b hover:bg-indigo-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.turbineType}</td>
                  <td className="px-2 py-2 text-xs">{r.deploymentSite}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.ratedPower}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.tidalRange}m</td>
                  <td className="px-2 py-2 text-right font-mono">{r.flowSpeed}</td>
                  <td className="px-2 py-2"><Badge variant="outline" className={statusBadge[r.status]}>{r.status}</Badge></td>
                  <td className="px-2 py-2"><Badge variant="outline" className={statusColor[r.priority]}>{r.priority}</Badge></td>
                  <td className="px-2 py-2 text-xs">{r.origin} \u2192 {r.destination}</td>
                  <td className="px-2 py-2 text-xs text-muted-foreground">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="tde-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="tde-chart-card"><CardHeader><CardTitle className="text-sm">Flow Speed by Deployment Site (m/s)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={speedBySite}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis domain={[0, 6]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="speed" fill="#0c4a6e" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="tde-chart-card"><CardHeader><CardTitle className="text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={priorityDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#dc2626" /><Cell fill="#d97706" /><Cell fill="#2563eb" /><Cell fill="#16a34a" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="tde-chart-card"><CardHeader><CardTitle className="text-sm">Rotor Diameter by Batch (m)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={diameterData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="diameter" fill="#7c2d12" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="tde-chart-card"><CardHeader><CardTitle className="text-sm">Power vs Capacity Factor</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), power: r.ratedPower, cf: r.capacityFactor }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="power" stroke="#1e3a5f" strokeWidth={2} name="kW" /><Line type="monotone" dataKey="cf" stroke="#14532d" strokeWidth={2} name="CF %" /></LineChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="tde-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="tde-insight-card border-l-4 border-l-indigo-500"><CardHeader><CardTitle className="text-sm text-indigo-700">Gulf of Khambhat: World&apos;s Highest Tidal Range</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Gulf of Khambhat (TDE-0012) records 10.5m tidal range — highest in India and among top 5 globally. NTPC planning 5,000MW mega-barrage with 250 bulb turbines (L&T Heavy manufactured). Challenge: extreme silt load requires 6-month desilting cycle. Estimated cost: \u20b945,000Cr for full 5GW. Phase-1: 500MW pilot by 2029. Environmental concern: mangrove ecosystem impact — compulsory 200ha mangrove offset. Current status: DPR submitted to MoEFCC awaiting clearance.</p></CardContent></Card>
          <Card className="tde-insight-card border-l-4 border-l-teal-500"><CardHeader><CardTitle className="text-sm text-teal-700">Sundarbans Delta: Eco-Sensitive Tidal Power</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Sundarbans (TDE-0002, 250MW) combines tidal energy with mangrove conservation. Vertical Axis Darrieus turbines chosen for minimal marine life impact. Sagar Island micro-grid powers 50,000 households replacing diesel generators saving \u20b98Cr/year. Kolkata Garden Reach fabricates corrosion-resistant SS316L turbine blades for estuarine conditions. WBREDA coordinating with Sundarbans Biosphere Reserve for ecological monitoring. Target: 1GW across delta by 2035, \u20b93,200Cr total investment.</p></CardContent></Card>
          <Card className="tde-insight-card border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm text-amber-700">Delayed Shipments: TDE-0004 & TDE-0013</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">TDE-0004 (Hooghly Estuary, 350MW): delayed 7 days at Haldia port — Hooghly silt accumulation prevented heavy-lift vessel berthing. Desilting dredger contracted at \u20b945L/day. TDE-0013 (Cochin Backwaters, 120MW): 9-day delay due to monsoon shipping restrictions in backwater channels. Only daylight transit permitted for oversized cargo. Mitigation: schedule backwater shipments Oct-May dry season only. Financial impact: \u20b962L total demurrage.</p></CardContent></Card>
          <Card className="tde-insight-card border-l-4 border-l-purple-500"><CardHeader><CardTitle className="text-sm text-purple-700">Oscillating Hydrofoil: Emerging Technology</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Oscillating Hydrofoil turbines (TDE-0005, 0009, 0014) achieve highest capacity factor at 29-35% — surpassing horizontal axis designs. Bio-Wing Technology from IIT-M Chennai uses oscillating wing with 40% lower maintenance than rotating turbines. Minicoy Atoll (TDE-0005) pilot: 200MW for Lakshadweep island grid, replacing \u20b915Cr/month diesel spend. Payback: 3.8 years. MNRE evaluating scale-up to 1GW for all UT islands. Funding: \u20b9780Cr under Island Development Programme.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
