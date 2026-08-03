'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface H2PipeRecord {
  id: string;
  batchNo: string;
  pipeSegment: string;
  h2Source: string;
  endUse: string;
  flowKgHr: number;
  pressure: number;
  diameter: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  installDate: string;
  lengthKm: number;
  zone: string;
  remarks: string;
}

const records: H2PipeRecord[] = [
  { id: 'H2P-0001', batchNo: 'H2P-S2401', pipeSegment: 'Gujarat Green H2 Trunk', h2Source: 'Electrolytic (Solar)', endUse: 'Refinery Desulfurization', flowKgHr: 4500, pressure: 70, diameter: 16, status: 'In Transit', priority: 'Critical', origin: 'Bhadla (NTPC Electrolyzer)', destination: 'Jamnagar (Reliance Refinery)', installDate: '2026-07-20', lengthKm: 350, zone: 'West', remarks: '350km 16in 70bar green H2 trunk from Bhadla solar electrolyzer hub to Reliance Jamnagar refinery diesel desulfurization' },
  { id: 'H2P-0002', batchNo: 'H2P-S2402', pipeSegment: 'UP Industrial H2 Corridor', h2Source: 'Reformer (Natural Gas)', endUse: 'Steel DRI Reduction', flowKgHr: 3200, pressure: 50, diameter: 12, status: 'Delivered', priority: 'High', origin: 'Auraiya (GAIL Reformers)', destination: 'Sonebhadra (ArcelorMittal DRI)', installDate: '2026-07-18', lengthKm: 420, zone: 'North', remarks: '420km 12in 50bar NG reformer H2 for ArcelorMittal Sonebhadra 5MTPA DRI steel plant replacing coal blast furnace' },
  { id: 'H2P-0003', batchNo: 'H2P-S2403', pipeSegment: 'Kerala Bio-H2 Loop', h2Source: 'Biomass Gasification', endUse: 'Fertilizer Haber-Bosch', flowKgHr: 1800, pressure: 35, diameter: 8, status: 'Processing', priority: 'High', origin: 'Thrissur (FACT Bio-H2)', destination: 'Alappuzha (IFFCO Plant)', installDate: '2026-07-23', lengthKm: 120, zone: 'South', remarks: '120km 8in 35bar biomass gasification H2 for IFFCO Alappuzha green ammonia Haber-Bosch fertilizer synthesis' },
  { id: 'H2P-0004', batchNo: 'H2P-S2404', pipeSegment: 'Rajasthan Solar H2 Hub', h2Source: 'Electrolytic (Wind+Solar)', endUse: 'Chemical Methanol Synthesis', flowKgHr: 5800, pressure: 100, diameter: 20, status: 'In Transit', priority: 'Critical', origin: 'Jaisalmer (Adani Electrolyzer)', destination: 'Barmer (HPCL Refinery)', installDate: '2026-07-19', lengthKm: 280, zone: 'West', remarks: '280km 20in 100bar wind-solar electrolyzer H2 for HPCL Barmer green methanol synthesis e-fuel production' },
  { id: 'H2P-0005', batchNo: 'H2P-S2405', pipeSegment: 'Jharkhand Steel H2 Link', h2Source: 'Coal Gasification (Blue)', endUse: 'Sponge Iron Direct Reduction', flowKgHr: 2500, pressure: 45, diameter: 12, status: 'Delayed', priority: 'High', origin: 'Dhanbad (SAIL Coal Gasifier)', destination: 'Ranchi (JSW Steel DRI)', installDate: '2026-07-12', lengthKm: 160, zone: 'East', remarks: '160km 12in 45bar blue H2 from SAIL coal gasifier to JSW Ranchi DRI — monsoon land acquisition delay 12 days' },
  { id: 'H2P-0006', batchNo: 'H2P-S2406', pipeSegment: 'Tamil Nadu Wind H2 Express', h2Source: 'Electrolytic (Offshore Wind)', endUse: 'Power-to-Ammonia Export', flowKgHr: 6200, pressure: 80, diameter: 20, status: 'Delivered', priority: 'Critical', origin: 'Ramanathapuram (Vestas Electrolyzer)', destination: 'Tuticorin Port (NTPC Terminal)', installDate: '2026-07-16', lengthKm: 180, zone: 'South', remarks: '180km 20in 80bar offshore wind electrolyzer H2 to Tuticorin green ammonia export terminal Japan Korea market' },
  { id: 'H2P-0007', batchNo: 'H2P-S2407', pipeSegment: 'MP Green H2 Rural Grid', h2Source: 'Electrolytic (Solar)', endUse: 'Fuel Cell Power Station', flowKgHr: 800, pressure: 20, diameter: 6, status: 'In Transit', priority: 'Medium', origin: 'Rewa (MP Power Solar)', destination: 'Bhopal (MPGCL FC Plant)', installDate: '2026-07-21', lengthKm: 220, zone: 'North', remarks: '220km 6in 20bar solar electrolyzer H2 for MPGCL Bhopal 10MW PEM fuel cell grid balancing peaking power' },
  { id: 'H2P-0008', batchNo: 'H2P-S2408', pipeSegment: 'AP Hydrogen Highway', h2Source: 'Electrolytic (Nuclear)', endUse: 'FC Bus Fleet Refueling', flowKgHr: 1500, pressure: 50, diameter: 10, status: 'Delivered', priority: 'High', origin: 'Kakrapar (NPCIL PHWR)', destination: 'Vizag (Tata FC Station)', installDate: '2026-07-15', lengthKm: 350, zone: 'South', remarks: '350km 10in 50bar nuclear H2 from Kakrapar PHWR for Tata Motors FC bus fleet Vizag-Hyderabad hydrogen highway' },
  { id: 'H2P-0009', batchNo: 'H2P-S2409', pipeSegment: 'NE Bio-H2 Network', h2Source: 'Biomass Syngas', endUse: 'Tea Estate Fuel Cells', flowKgHr: 600, pressure: 15, diameter: 4, status: 'Processing', priority: 'Low', origin: 'Jorhat (Tocklai Biomass)', destination: 'Guwahati (Assam Bio-FC)', installDate: '2026-07-24', lengthKm: 300, zone: 'East', remarks: '300km 4in 15bar biomass syngas H2 for Assam tea estate fuel cell microgrid replacing diesel generators remote area' },
  { id: 'H2P-0010', batchNo: 'H2P-S2410', pipeSegment: 'Maharashtra Industrial H2 Ring', h2Source: 'Reformer (NG+CCS)', endUse: 'Glass Manufacturing Melt', flowKgHr: 2000, pressure: 40, diameter: 10, status: 'In Transit', priority: 'High', origin: 'Thane (GAIL NG CCS Hub)', destination: 'Nashik (Asahi Glass Plant)', installDate: '2026-07-22', lengthKm: 150, zone: 'West', remarks: '150km 10in 40bar blue H2 from GAIL Thane NG reformer with CCS for Asahi Nashik float glass furnace oxy-H2 firing' },
  { id: 'H2P-0011', batchNo: 'H2P-S2411', pipeSegment: 'Punjab Agri-H2 Spur', h2Source: 'Electrolytic (Solar)', endUse: 'Green Ammonia Fertilizer', flowKgHr: 1200, pressure: 30, diameter: 6, status: 'Delivered', priority: 'Medium', origin: 'Bathinda (NFL Solar H2)', destination: 'Ludhiana (CFCL Plant)', installDate: '2026-07-17', lengthKm: 100, zone: 'North', remarks: '100km 6in 30bar solar electrolyzer H2 for CFCL green ammonia fertilizer replacing imported urea Punjab farming' },
  { id: 'H2P-0012', batchNo: 'H2P-S2412', pipeSegment: 'WB Coal-to-H2 Transition', h2Source: 'Coal Gasification (Blue CCS)', endUse: 'Cement Calciner Fuel', flowKgHr: 3000, pressure: 55, diameter: 14, status: 'Delayed', priority: 'Critical', origin: 'Asansol (ECL Coal Gasifier)', destination: 'Salboni (ACC Cement)', installDate: '2026-07-10', lengthKm: 190, zone: 'East', remarks: '190km 14in 55bar blue H2 with CCS from ECL Asansol to ACC Salboni cement kiln oxy-H2 calciner — pipe river crossing permit delay' },
  { id: 'H2P-0013', batchNo: 'H2P-S2413', pipeSegment: 'Karnataka IT H2 Grid', h2Source: 'Electrolytic (Hydro)', endUse: 'Data Center Backup Power', flowKgHr: 900, pressure: 25, diameter: 6, status: 'In Transit', priority: 'Medium', origin: 'Sivasamudram (KPCL Hydro)', destination: 'Bengaluru (Infosys FC Farm)', installDate: '2026-07-20', lengthKm: 140, zone: 'South', remarks: '140km 6in 25bar hydro electrolyzer H2 for Infosys Bengaluru data center 5MW PEM fuel cell backup power system' },
  { id: 'H2P-0014', batchNo: 'H2P-S2414', pipeSegment: 'Gujarat Port H2 Export Line', h2Source: 'Electrolytic (Wind+Solar)', endUse: 'Liquefied H2 Export', flowKgHr: 7000, pressure: 100, diameter: 24, status: 'Processing', priority: 'Critical', origin: 'Kutch (Adani Mega Electrolyzer)', destination: 'Mundra LNG-H2 Terminal', installDate: '2026-07-25', lengthKm: 200, zone: 'West', remarks: '200km 24in 100bar mega-scale wind-solar electrolyzer H2 to Mundra liquid H2 export terminal for Europe Japan market' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'H2 Source', key: 'h2Source', options: [
    { value: 'Electrolytic (Solar)', count: 4 }, { value: 'Reformer (Natural Gas)', count: 1 }, { value: 'Biomass Gasification', count: 1 }, { value: 'Electrolytic (Wind+Solar)', count: 2 },
  ]},
  { label: 'End Use', key: 'endUse', options: [
    { value: 'Refinery Desulfurization', count: 1 }, { value: 'Steel DRI Reduction', count: 1 }, { value: 'Fertilizer Haber-Bosch', count: 2 }, { value: 'Power-to-Ammonia Export', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 5 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 4 }, { value: 'South', count: 4 }, { value: 'North', count: 3 }, { value: 'East', count: 3 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Segments', value: 14, sub: 'H2 Pipeline Network', color: 'text-cyan-800' },
  { title: 'Total Pipeline', value: '3,240 km', sub: 'Cross-India Network', color: 'text-teal-700' },
  { title: 'Peak Flow Rate', value: '7,000 kg/hr', sub: 'Gujarat Export Line', color: 'text-sky-700' },
  { title: 'National Target', value: '\u20b925,000Cr', sub: 'National H2 Pipeline Grid', color: 'text-indigo-700' },
];

export default function HydrogenPipelineLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.pipeSegment} ${r.h2Source} ${r.endUse} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof H2PipeRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const flowBySource = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const key = r.h2Source.split('(')[0].trim(); map.set(key, (map.get(key) || 0) + r.flowKgHr); });
    return Array.from(map.entries()).map(([name, flowKgHr]) => ({ name: name.slice(0, 14), flowKgHr }));
  }, []);

  const sourceDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.h2Source.split('(')[0].trim(); map.set(s, (map.get(s) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const prodTrend = useMemo(() => [
    { year: '2022', km: 200 }, { year: '2023', km: 800 }, { year: '2024', km: 2200 }, { year: '2025', km: 4800 }, { year: '2026', km: 8500 }, { year: '2027', km: 15000 }, { year: '2028', km: 25000 },
  ], []);

  const pressureData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), pressure: r.pressure, diameter: r.diameter }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const flowByEndUse = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.endUse, (map.get(r.endUse) || 0) + r.flowKgHr); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, flowKgHr]) => ({ name: name.slice(0, 18), flowKgHr }));
  }, []);

  const COLORS = ['#0891b2', '#06b6d4', '#0e7490', '#155e75', '#164e63'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="hp2-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Energy Infrastructure' }, { label: 'H2 Pipeline' }]} />
      <PageHeader title="Hydrogen Pipeline Logistics" description="Indian hydrogen pipeline transport network &#8212; green, blue, and grey H2 trunk lines, industrial corridors, and export terminals connecting electrolyzers, reformers, and gasifiers to refineries, steel DRI, fertilizer, fuel cells, and export markets" />

      <div className="hp2-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="hp2-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="hp2-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`hp2-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-cyan-700 text-cyan-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="hp2-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="hp2-chart-card"><CardHeader><CardTitle className="text-sm">Flow Rate by H2 Source (kg/hr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={flowBySource}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="flowKgHr" fill="#0891b2" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="hp2-chart-card"><CardHeader><CardTitle className="text-sm">H2 Source Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={sourceDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0891b2" /><Cell fill="#06b6d4" /><Cell fill="#0e7490" /><Cell fill="#155e75" /><Cell fill="#164e63" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="hp2-chart-card"><CardHeader><CardTitle className="text-sm">H2 Pipeline Network Growth (km)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={prodTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="km" stroke="#06b6d4" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="hp2-chart-card"><CardHeader><CardTitle className="text-sm">Pressure (bar) and Diameter (in) by Segment</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={pressureData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="pressure" stroke="#0891b2" strokeWidth={2} name="bar" /><Line type="monotone" dataKey="diameter" stroke="#0e7490" strokeWidth={2} name="inch" /></LineChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="hp2-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Segment</th><th className="px-2 py-2 text-left">Source</th><th className="px-2 py-2 text-left">End Use</th><th className="px-2 py-2 text-right">kg/hr</th><th className="px-2 py-2 text-right">bar</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-right">km</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`hp2-table-row border-b hover:bg-cyan-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.pipeSegment}</td>
                  <td className="px-2 py-2 text-xs">{r.h2Source}</td>
                  <td className="px-2 py-2 text-xs">{r.endUse}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.flowKgHr.toLocaleString()}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.pressure}</td>
                  <td className="px-2 py-2"><Badge variant="outline" className={statusBadge[r.status]}>{r.status}</Badge></td>
                  <td className="px-2 py-2"><Badge variant="outline" className={statusColor[r.priority]}>{r.priority}</Badge></td>
                  <td className="px-2 py-2 text-right font-mono">{r.lengthKm}</td>
                  <td className="px-2 py-2 text-xs">{r.origin} &#8594; {r.destination}</td>
                  <td className="px-2 py-2 text-xs text-muted-foreground">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="hp2-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="hp2-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0891b2" /><Cell fill="#06b6d4" /><Cell fill="#0e7490" /><Cell fill="#155e75" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="hp2-chart-card"><CardHeader><CardTitle className="text-sm">Flow Rate by End Use (kg/hr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={flowByEndUse}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="flowKgHr" fill="#0891b2" radius={[4,4,0,0]} name="kg/hr" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="hp2-chart-card"><CardHeader><CardTitle className="text-sm">Pipeline Length vs Flow Rate</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.pipeSegment.split(' ')[0].slice(0, 8), km: r.lengthKm, flow: r.flowKgHr }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="km" stroke="#0891b2" strokeWidth={2} name="km" /><Line type="monotone" dataKey="flow" stroke="#06b6d4" strokeWidth={2} name="kg/hr" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="hp2-chart-card"><CardHeader><CardTitle className="text-sm">Diameter Distribution (inches)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={Array.from(new Map(records.map((r) => [r.diameter + 'in', records.filter((x) => x.diameter === r.diameter).length])).entries()).map(([name, value]) => ({ name, value }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0891b2" /><Cell fill="#06b6d4" /><Cell fill="#0e7490" /><Cell fill="#155e75" /><Cell fill="#164e63" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="hp2-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hp2-insight-card border-l-4 border-l-cyan-700"><CardHeader><CardTitle className="text-sm text-cyan-800">India&apos;s National H2 Pipeline Grid: Connecting Green H2 Supply to Demand</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s National Hydrogen Pipeline Grid program targeting 25,000 km of hydrogen transmission pipelines by 2030, connecting green hydrogen supply hubs to industrial demand centers. Phase-1: 4,500 km linking Rajasthan solar belt (Bhadla, Jaisalmer) to Gujarat refineries (Reliance Jamnagar, HPCL Barmer, Essar Vadinar) via 16-24 inch 70-100bar trunk lines (H2P-0001, H2P-0004, H2P-0014). Phase-2: 8,000 km connecting Tamil Nadu offshore wind H2 to southern industrial corridor and Tuticorin green ammonia export terminal (H2P-0006). Phase-3: 12,500 km pan-India network linking nuclear, hydro, and biomass H2 sources to fertilizer, steel, cement, and FC fleet demand centers. Pipeline materials: API 5L X70/X80 steel with hydrogen-compatible polyethylene fusion-bonded epoxy (FBE) internal coating. IGGL-GAIL joint venture executing 60% of Phase-1 route. India&apos;s existing 2,700 km natural gas pipeline network being assessed for H2 blending up to 20% volume — GAIL Hazira-Vijaipur-Jagdishpur HVJ pipeline as first candidate for H2 blending trial. Total investment: &#8377;25,000Cr with &#8377;5,000Cr viability gap funding.</p></CardContent></Card>
          <Card className="hp2-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Segments: H2P-0005 and H2P-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">H2P-0005 (Dhanbad SAIL to Ranchi JSW, 160km, 12-day delay): Blue H2 from SAIL Dhanbad coal gasifier to JSW Ranchi 5MTPA DRI plant — monsoon season delayed Right-of-Way (RoW) land acquisition for 12km stretch through Jharkhand forest buffer zone requiring MoEFCC Stage-II clearance under Forest Conservation Act. 600 landowners affected, compensation dispute at 4 village panchayats. Pipe routing diverted 3km to avoid elephant corridor, adding &#8377;180Cr to project cost. JSW Ranchi DRI commissioning delayed by 3 months pending H2 supply. H2P-0012 (Asansol ECL to Salboni ACC, 190km, 14-day delay): Blue H2 with CCS from ECL Asansol coal gasifier to ACC Salboni cement kiln oxy-H2 calciner — river crossing permit for Damodar River 48in cased crossing pending National Dam Safety Authority (NDSA) review due to proximity of 4m high-pressure H2 pipeline to 35-year-old Damodar irrigation barrage. Pipeline pressure reduced from 55bar to 40bar interim as safety precaution, increasing pumping energy by 25%. ACC cement kiln H2-ready burner installed but awaiting supply.</p></CardContent></Card>
          <Card className="hp2-insight-card border-l-4 border-l-teal-600"><CardHeader><CardTitle className="text-sm text-teal-700">Gujarat Export Line: India&apos;s Gateway to Global Hydrogen Trade</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Adani Kutch 24in 100bar mega-scale hydrogen pipeline (H2P-0014) connecting 5GW electrolyzer complex at Kutch to Mundra liquid H2 export terminal — India&apos;s first purpose-built H2 export pipeline at 7,000 kg/hr throughput. Kutch electrolyzer hub combines 3GW solar + 2GW wind powering alkaline electrolyzer array producing 350 TPD green H2. Mundra terminal features 2x 5,000 m3 liquid hydrogen storage spheres at -253C, two 40,000 DWT LH2 tanker berths for Japan and South Korea export routes. India targeting 10 MTPA green H2 export by 2035, positioning as global green H2 supplier leveraging 300+ sunny days and 7,500 km coastline. Pipeline designed for future expansion to 14,000 kg/hr with compressor stations every 80km. Cost: &#8377;3,200Cr pipeline + &#8377;8,500Cr Mundra LH2 terminal. Japan METI signed MOU for 2 MTPA LH2 offtake at &#8377;280/kg FOB Mundra. First shipment Q3 2027. Pipeline crossing through Kutch Desert National Park wildlife corridor — buried at 4m depth with continuous H2 leak detection fiber-optic sensing.</p></CardContent></Card>
          <Card className="hp2-insight-card border-l-4 border-l-indigo-600"><CardHeader><CardTitle className="text-sm text-indigo-700">Tamil Nadu Wind H2 Express: Power-to-Ammonia Export Corridor</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">NTPC Ramanathapuram-Vestas offshore wind joint venture commissioned 180km 20in 80bar hydrogen express pipeline (H2P-0006) connecting 2GW offshore wind farm electrolyzer to Tuticorin green ammonia export terminal. Offshore wind turbines 30km from Rameshwaram coast in Palk Strait powering 10 PEM electrolyzer modules at 6,200 kg/hr total green H2 output. Tuticorin terminal features Haber-Bosch green ammonia synthesis plant at 800 TPD capacity with air separation unit and H2 compressor train. Green ammonia exported as NH3 at -33C to Japan JERA, South Korea KEPKO, and European YARA buyers. India-Australia Green Corridor: joint NH3 bunkering network with Port of Newcastle. NTPC leveraging existing Tuticorin coal terminal infrastructure for ammonia tanker berths. Each ammonia shipment carries energy equivalent of 500 GWh, replacing 170,000 tonnes coal. Pipeline ROI: 14% IRR at &#8377;180/kg NH3 FOB. Investment: &#8377;4,800Cr including offshore electrolyzer platform, subsea pipeline section, and ammonia synthesis terminal.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
