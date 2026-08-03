'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface WaveRecord {
  id: string;
  batchNo: string;
  converterType: string;
  deploymentSite: string;
  ratedPower: number;
  waveHeight: number;
  wavePeriod: number;
  captureWidth: number;
  efficiency: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: WaveRecord[] = [
  { id: 'OWE-0001', batchNo: 'OWE-B2401', converterType: 'Oscillating Water Column', deploymentSite: 'Vizag Breakwater', ratedPower: 150, waveHeight: 2.5, wavePeriod: 8, captureWidth: 12, efficiency: 38, status: 'In Transit', priority: 'Critical', origin: 'Chennai (NIOT)', destination: 'Visakhapatnam (HSL)', shipDate: '2026-07-20', transitDays: 3, zone: 'South', remarks: 'OWC chamber for port breakwater integration' },
  { id: 'OWE-0002', batchNo: 'OWE-B2402', converterType: 'Point Absorber Buoy', deploymentSite: 'Kanyakumari Nearshore', ratedPower: 50, waveHeight: 1.8, wavePeriod: 7, captureWidth: 8, efficiency: 42, status: 'Delivered', priority: 'High', origin: 'Kochi (CWRDM)', destination: 'Kanyakumari (TNEB)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'Floating buoy array - 10 units' },
  { id: 'OWE-0003', batchNo: 'OWE-B2403', converterType: 'Attenuator Snake', deploymentSite: 'Lakshadweep Offshore', ratedPower: 500, waveHeight: 3.2, wavePeriod: 10, captureWidth: 25, efficiency: 35, status: 'Processing', priority: 'Medium', origin: 'Mumbai (L&T)', destination: 'Lakshadweep (Admiral Bay)', shipDate: '2026-07-22', transitDays: 7, zone: 'West', remarks: 'Multi-body attenuator for island grid' },
  { id: 'OWE-0004', batchNo: 'OWE-B2404', converterType: 'Overtopping Device', deploymentSite: 'Goa Coast', ratedPower: 200, waveHeight: 2.0, wavePeriod: 8, captureWidth: 15, efficiency: 33, status: 'Delayed', priority: 'Critical', origin: 'Bengaluru (IISc)', destination: 'Goa (NIO)', shipDate: '2026-07-15', transitDays: 6, zone: 'West', remarks: 'Ramp reservoir - monsoon shipping delay' },
  { id: 'OWE-0005', batchNo: 'OWE-B2405', converterType: 'Oscillating Wave Surge', deploymentSite: 'Puri Coast', ratedPower: 120, waveHeight: 2.8, wavePeriod: 9, captureWidth: 10, efficiency: 40, status: 'In Transit', priority: 'High', origin: 'Bhubaneswar (NALCO)', destination: 'Puri (OPTCL)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'Bottom-hinged flap converter' },
  { id: 'OWE-0006', batchNo: 'OWE-B2406', converterType: 'Point Absorber Buoy', deploymentSite: 'Andaman Offshore', ratedPower: 300, waveHeight: 3.5, wavePeriod: 11, captureWidth: 20, efficiency: 45, status: 'Delivered', priority: 'Medium', origin: 'Kolkata (IIT-KGP)', destination: 'Port Blair (ANIL)', shipDate: '2026-07-17', transitDays: 5, zone: 'East', remarks: 'Deep-water buoy cluster' },
  { id: 'OWE-0007', batchNo: 'OWE-B2407', converterType: 'Submerged Pressure Differential', deploymentSite: 'Gujarat MHV', ratedPower: 250, waveHeight: 2.2, wavePeriod: 7, captureWidth: 18, efficiency: 30, status: 'Processing', priority: 'Low', origin: 'Ahmedabad (PDPU)', destination: 'Gujarat (GSEC)', shipDate: '2026-07-23', transitDays: 2, zone: 'West', remarks: 'Submerged membrane converter' },
  { id: 'OWE-0008', batchNo: 'OWE-B2408', converterType: 'Oscillating Water Column', deploymentSite: 'Tamil Nadu Coast', ratedPower: 400, waveHeight: 3.0, wavePeriod: 9, captureWidth: 22, efficiency: 36, status: 'In Transit', priority: 'High', origin: 'Chennai (NIOT)', destination: 'Cuddalore (TNEB)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'Multi-resonant OWC with Wells turbine' },
  { id: 'OWE-0009', batchNo: 'OWE-B2409', converterType: 'Attenuator Snake', deploymentSite: 'Maharashtra Coast', ratedPower: 350, waveHeight: 2.8, wavePeriod: 8, captureWidth: 20, efficiency: 34, status: 'Delivered', priority: 'Medium', origin: 'Pune (COEP)', destination: 'Ratnagiri (MSEDCL)', shipDate: '2026-07-16', transitDays: 3, zone: 'West', remarks: 'Articulated snake for Konkan coast' },
  { id: 'OWE-0010', batchNo: 'OWE-B2410', converterType: 'Rotating Mass Gyroscope', deploymentSite: 'Kerala Backwaters', ratedPower: 80, waveHeight: 1.2, wavePeriod: 5, captureWidth: 6, efficiency: 28, status: 'Processing', priority: 'Critical', origin: 'Thiruvananthapuram (VSSC)', destination: 'Alappuzha (KSEB)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: 'Low-energy gyroscope for backwaters' },
  { id: 'OWE-0011', batchNo: 'OWE-B2411', converterType: 'Point Absorber Buoy', deploymentSite: 'Sundarbans Delta', ratedPower: 100, waveHeight: 1.5, wavePeriod: 6, captureWidth: 9, efficiency: 38, status: 'In Transit', priority: 'High', origin: 'Kolkata (Jadavpur Univ)', destination: 'Sundarbans (WBSEDCL)', shipDate: '2026-07-20', transitDays: 4, zone: 'East', remarks: 'Delta-specific buoy with bio-fouling coat' },
  { id: 'OWE-0012', batchNo: 'OWE-B2412', converterType: 'Overtopping Device', deploymentSite: 'Daman Offshore', ratedPower: 180, waveHeight: 2.0, wavePeriod: 7, captureWidth: 14, efficiency: 32, status: 'Delivered', priority: 'Low', origin: 'Surat (SVNIT)', destination: 'Daman (DNH Power)', shipDate: '2026-07-14', transitDays: 2, zone: 'West', remarks: 'Modular ramp device' },
  { id: 'OWE-0013', batchNo: 'OWE-B2413', converterType: 'Oscillating Wave Surge', deploymentSite: 'Konkan Deep Water', ratedPower: 600, waveHeight: 4.0, wavePeriod: 12, captureWidth: 30, efficiency: 44, status: 'Delayed', priority: 'High', origin: 'Mumbai ( Mazagon Dock)', destination: 'Konkan (MSETCL)', shipDate: '2026-07-12', transitDays: 8, zone: 'West', remarks: 'Heavy flap - weather window missed' },
  { id: 'OWE-0014', batchNo: 'OWE-B2414', converterType: 'Submerged Pressure Differential', deploymentSite: 'Maldives Offshore', ratedPower: 450, waveHeight: 3.8, wavePeriod: 11, captureWidth: 28, efficiency: 41, status: 'In Transit', priority: 'Medium', origin: 'Kochi (CWRDM)', destination: 'Male (STELCO)', shipDate: '2026-07-22', transitDays: 6, zone: 'South', remarks: 'Export order - Maldives grid' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Converter Type', key: 'converterType', options: [
    { value: 'Oscillating Water Column', count: 2 }, { value: 'Point Absorber Buoy', count: 3 }, { value: 'Attenuator Snake', count: 2 }, { value: 'Overtopping Device', count: 2 }, { value: 'Oscillating Wave Surge', count: 2 }, { value: 'Submerged Pressure Differential', count: 2 }, { value: 'Rotating Mass Gyroscope', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 3 }, { value: 'High', count: 4 }, { value: 'Medium', count: 4 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 5 }, { value: 'West', count: 5 }, { value: 'East', count: 3 }, { value: 'North', count: 0 }, { value: 'Central', count: 0 }, { value: 'Island', count: 1 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Converters', value: 14, sub: 'Active Deployments', color: 'text-cyan-700' },
  { title: 'Combined Power', value: '3,850 kW', sub: 'Rated Capacity', color: 'text-blue-700' },
  { title: 'Avg Efficiency', value: '36.6%', sub: 'Wave-to-Wire', color: 'text-teal-700' },
  { title: 'Avg Wave Height', value: '2.6 m', sub: 'Significant Height', color: 'text-indigo-700' },
];

export default function OceanWaveEnergyLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.converterType} ${r.deploymentSite} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof WaveRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const powerByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.converterType.split(' ')[0]; map.set(k, (map.get(k) || 0) + r.ratedPower); });
    return Array.from(map.entries()).map(([name, power]) => ({ name: name.slice(0, 12), power }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const efficiencyTrend = useMemo(() => [
    { month: 'Jan', eff: 28 }, { month: 'Feb', eff: 30 }, { month: 'Mar', eff: 32 }, { month: 'Apr', eff: 33 }, { month: 'May', eff: 35 }, { month: 'Jun', eff: 36 }, { month: 'Jul', eff: 37 },
  ], []);

  const captureWidthData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), width: r.captureWidth }));
  }, []);

  const efficiencyByType = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    records.forEach((r) => { const k = r.converterType.split(' ')[0]; const entry = map.get(k) || { total: 0, count: 0 }; entry.total += r.efficiency; entry.count += 1; map.set(k, entry); });
    return Array.from(map.entries()).map(([name, { total, count }]) => ({ name: name.slice(0, 12), eff: Math.round(total / count) }));
  }, []);

  const priorityDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.priority, (map.get(r.priority) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const waveHeightData = useMemo(() => {
    return records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), height: r.waveHeight }));
  }, []);

  const COLORS = ['#0c4a6e', '#14532d', '#581c87', '#7c2d12', '#1e3a5f'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="owe-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Marine Energy' }, { label: 'Ocean Wave' }]} />
      <PageHeader title="Ocean Wave Energy Logistics" description="Indian wave energy converter supply chain \u2014 OWC, Point Absorber, Attenuator & Overtopping device tracking" />

      <div className="owe-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="owe-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="owe-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`owe-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-cyan-600 text-cyan-700' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="owe-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="owe-chart-card"><CardHeader><CardTitle className="text-sm">Power by Converter Type (kW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={powerByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="power" fill="#0c4a6e" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="owe-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0c4a6e" /><Cell fill="#14532d" /><Cell fill="#581c87" /><Cell fill="#7c2d12" /><Cell fill="#1e3a5f" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="owe-chart-card"><CardHeader><CardTitle className="text-sm">Efficiency Trend (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={efficiencyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[25, 45]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="eff" stroke="#14532d" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="owe-chart-card"><CardHeader><CardTitle className="text-sm">Capture Width by Batch (m)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={captureWidthData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="width" fill="#581c87" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="owe-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-left">Site</th><th className="px-2 py-2 text-right">kW</th><th className="px-2 py-2 text-right">m</th><th className="px-2 py-2 text-right">Eff%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`owe-table-row border-b hover:bg-cyan-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.converterType}</td>
                  <td className="px-2 py-2 text-xs">{r.deploymentSite}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.ratedPower}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.waveHeight}m</td>
                  <td className="px-2 py-2 text-right font-mono">{r.efficiency}%</td>
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
        <div className="owe-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="owe-chart-card"><CardHeader><CardTitle className="text-sm">Efficiency by Converter Type (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={efficiencyByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis domain={[25, 50]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="eff" fill="#14532d" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="owe-chart-card"><CardHeader><CardTitle className="text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={priorityDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#dc2626" /><Cell fill="#d97706" /><Cell fill="#2563eb" /><Cell fill="#16a34a" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="owe-chart-card"><CardHeader><CardTitle className="text-sm">Wave Height by Batch (m)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={waveHeightData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="height" fill="#7c2d12" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="owe-chart-card"><CardHeader><CardTitle className="text-sm">Power vs Efficiency</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), power: r.ratedPower, eff: r.efficiency }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="power" stroke="#0c4a6e" strokeWidth={2} name="Power (kW)" /><Line type="monotone" dataKey="eff" stroke="#14532d" strokeWidth={2} name="Efficiency (%)" /></LineChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="owe-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="owe-insight-card border-l-4 border-l-cyan-500"><CardHeader><CardTitle className="text-sm text-cyan-700">NIOT Vizag: India&apos;s Wave Energy Flagship</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">National Institute of Ocean Technology (NIOT) Chennai operates India&apos;s only grid-connected wave energy pilot at Vizag breakwater. 150kW OWC chamber feeding 30 households. Twin Wells turbine design achieves 38% wave-to-wire efficiency. OWE-0001 shipment delivers second OWC chamber for capacity expansion to 300kW. MNRE funding: \u20b945Cr for Phase-2 deployment along 6 coastline sites by 2028. Total Indian wave energy potential: 40GW along 7,500km coastline.</p></CardContent></Card>
          <Card className="owe-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">Lakshadweep Island Micro-Grid: Diesel Offset</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Lakshadweep archipelago spends \u20b912Cr/month on diesel for power generation. Attenuator Snake (OWE-0003, 500kW) targets 60% diesel offset for Kavaratti island grid. Multi-body articulated snake with 25m capture width, deployed at 200m depth. Challenge: 7-day transit from Mumbai requires marine-grade corrosion-resistant packaging. Saltwater bio-fouling protection: anti-fouling copper-nickel alloy cladding on submerged joints. Payback: 4.2 years at current diesel cost of \u20b985/L.</p></CardContent></Card>
          <Card className="owe-insight-card border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm text-amber-700">Delayed Shipments: Monsoon Window Constraints</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Two delayed shipments (OWE-0004 Goa overtopping, OWE-0013 Konkan flap) caused by missed monsoon weather windows. Indian west coast experiences June-September heavy swell period (Hs &gt; 4m), unsafe for converter deployment operations. Recommended: pre-position components in March-May dry season, use monsoon period for assembly onshore. Financial impact: \u20b935L per month delay per converter. Projected: schedule all west coast deployments before June 1.</p></CardContent></Card>
          <Card className="owe-insight-card border-l-4 border-l-purple-500"><CardHeader><CardTitle className="text-sm text-purple-700">Export Potential: Maldives & Sri Lanka Wave Grid</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">OWE-0014 marks first export order: submerged pressure differential converter to STELCO Maldives (450kW). Maldives faces identical challenges as Lakshadweep: diesel dependence, high electricity cost ($0.35/kWh), abundant wave resource. NIOT negotiating with Sri Lanka CEB for Trincomalee deployment (3.5m avg wave height, highest in South Asia). Pipeline: 5 export orders totaling 2,200kW by 2028. Revenue potential: \u20b965Cr from marine energy exports under ISA framework.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
