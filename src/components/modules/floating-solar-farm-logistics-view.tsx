'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface FSFRecord {
  id: string;
  batchNo: string;
  panelType: string;
  deploymentSite: string;
  installedCapacity: number;
  waterBody: string;
  panelEfficiency: number;
  waterCoverage: number;
  anchorType: string;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: FSFRecord[] = [
  { id: 'FSF-0001', batchNo: 'FSF-B2401', panelType: 'Mono PERC Float', deploymentSite: 'Ramagundam Reservoir', installedCapacity: 250, waterBody: 'Dam Reservoir', panelEfficiency: 22.5, waterCoverage: 4.5, anchorType: 'HDPE Pontoon', status: 'In Transit', priority: 'Critical', origin: 'Hyderabad (NELCO)', destination: 'Ramagundam (NTPC)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Phase-2 expansion — 100MW total' },
  { id: 'FSF-0002', batchNo: 'FSF-B2402', panelType: 'Bifacial Float', deploymentSite: 'Srisailam Dam', installedCapacity: 400, waterBody: 'Dam Reservoir', panelEfficiency: 24.2, waterCoverage: 6.0, anchorType: 'Concrete Mooring', status: 'Delivered', priority: 'High', origin: 'Mumbai (Waaree)', destination: 'Srisailam (TSGENCO)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'Bifacial gain +12% from water reflection' },
  { id: 'FSF-0003', batchNo: 'FSF-B2403', panelType: 'Thin-Film Float', deploymentSite: 'Gandhi Sagar Lake', installedCapacity: 50, waterBody: 'Urban Lake', panelEfficiency: 18.5, waterCoverage: 1.2, anchorType: 'Modular Frame', status: 'Processing', priority: 'Medium', origin: 'Pune (Tata Solar)', destination: 'Bhopal (MPPKVVCL)', shipDate: '2026-07-22', transitDays: 3, zone: 'Central', remarks: 'Flexible thin-film for heritage lake' },
  { id: 'FSF-0004', batchNo: 'FSF-B2404', panelType: 'Mono PERC Float', deploymentSite: 'Rihand Reservoir', installedCapacity: 600, waterBody: 'Dam Reservoir', panelEfficiency: 23.0, waterCoverage: 8.5, anchorType: 'Steel Pile', status: 'Delayed', priority: 'Critical', origin: 'Gurgaon (Adani Solar)', destination: 'Rihand (NTPC)', shipDate: '2026-07-15', transitDays: 7, zone: 'North', remarks: 'Heavy steel mooring — rail transport delay' },
  { id: 'FSF-0005', batchNo: 'FSF-B2405', panelType: 'HJT Float', deploymentSite: 'Koyna Reservoir', installedCapacity: 350, waterBody: 'Dam Reservoir', panelEfficiency: 26.8, waterCoverage: 5.2, anchorType: 'HDPE Pontoon', status: 'In Transit', priority: 'High', origin: 'Bengaluru (Vikram Solar)', destination: 'Koyna (MSEDCL)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Heterojunction tech — highest efficiency' },
  { id: 'FSF-0006', batchNo: 'FSF-B2406', panelType: 'Bifacial Float', deploymentSite: 'Loktak Lake', installedCapacity: 100, waterBody: 'Natural Lake', panelEfficiency: 23.8, waterCoverage: 2.0, anchorType: 'Eco Anchor', status: 'Delivered', priority: 'Medium', origin: 'Guwahati (NE Solar)', destination: 'Imphal (MANIREDA)', shipDate: '2026-07-17', transitDays: 5, zone: 'East', remarks: 'Eco-sensitive floating system' },
  { id: 'FSF-0007', batchNo: 'FSF-B2407', panelType: 'Mono PERC Float', deploymentSite: 'Nagarjuna Sagar', installedCapacity: 500, waterBody: 'Dam Reservoir', panelEfficiency: 22.0, waterCoverage: 7.0, anchorType: 'Concrete Mooring', status: 'Processing', priority: 'Low', origin: 'Chennai (RenSys)', destination: 'Nagarjuna Sagar (APGENCO)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'Tilt-optimized for 16N latitude' },
  { id: 'FSF-0008', batchNo: 'FSF-B2408', panelType: 'HJT Float', deploymentSite: 'Idukki Reservoir', installedCapacity: 200, waterBody: 'Dam Reservoir', panelEfficiency: 25.5, waterCoverage: 3.5, anchorType: 'HDPE Pontoon', status: 'In Transit', priority: 'High', origin: 'Kochi (EMMVEE)', destination: 'Idukki (KSEB)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: 'Monsoon-ready waterproof connectors' },
  { id: 'FSF-0009', batchNo: 'FSF-B2409', panelType: 'Bifacial Float', deploymentSite: 'Gobind Sagar', installedCapacity: 450, waterBody: 'Dam Reservoir', panelEfficiency: 23.5, waterCoverage: 6.5, anchorType: 'Steel Pile', status: 'Delivered', priority: 'Medium', origin: 'Chandigarh (Him Solar)', destination: 'Bilaspur (HPSEBL)', shipDate: '2026-07-16', transitDays: 3, zone: 'North', remarks: 'Himachal floating solar pilot' },
  { id: 'FSF-0010', batchNo: 'FSF-B2410', panelType: 'Thin-Film Float', deploymentSite: 'Hussain Sagar', installedCapacity: 75, waterBody: 'Urban Lake', panelEfficiency: 19.0, waterCoverage: 1.8, anchorType: 'Modular Frame', status: 'Processing', priority: 'Critical', origin: 'Hyderabad (Cyient)', destination: 'Hyderabad (TS-GMC)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: 'Smart city beautification + power' },
  { id: 'FSF-0011', batchNo: 'FSF-B2411', panelType: 'Mono PERC Float', deploymentSite: 'Tawa Reservoir', installedCapacity: 300, waterBody: 'Dam Reservoir', panelEfficiency: 22.8, waterCoverage: 4.8, anchorType: 'HDPE Pontoon', status: 'In Transit', priority: 'High', origin: 'Indore (Goldi Solar)', destination: 'Itarsi (MPRVUNL)', shipDate: '2026-07-20', transitDays: 2, zone: 'Central', remarks: 'Madhya Pradesh state pilot' },
  { id: 'FSF-0012', batchNo: 'FSF-B2412', panelType: 'Bifacial Float', deploymentSite: 'Pochampad Lake', installedCapacity: 150, waterBody: 'Irrigation Tank', panelEfficiency: 24.0, waterCoverage: 2.5, anchorType: 'Eco Anchor', status: 'Delivered', priority: 'Low', origin: 'Warangal (Photon)', destination: 'Karimnagar (TSGENCO)', shipDate: '2026-07-14', transitDays: 1, zone: 'South', remarks: 'Irrigation tank floating solar' },
  { id: 'FSF-0013', batchNo: 'FSF-B2413', panelType: 'HJT Float', deploymentSite: 'Meena Reservoir', installedCapacity: 280, waterBody: 'Dam Reservoir', panelEfficiency: 26.0, waterCoverage: 4.2, anchorType: 'Concrete Mooring', status: 'Delayed', priority: 'High', origin: 'Ahmedabad (Preston)', destination: 'Banswada (TSGENCO)', shipDate: '2026-07-12', transitDays: 9, zone: 'South', remarks: 'Ghat road landslide — alternate route' },
  { id: 'FSF-0014', batchNo: 'FSF-B2414', panelType: 'Mono PERC Float', deploymentSite: 'Ujani Dam', installedCapacity: 550, waterBody: 'Dam Reservoir', panelEfficiency: 22.2, waterCoverage: 7.5, anchorType: 'HDPE Pontoon', status: 'In Transit', priority: 'Medium', origin: 'Mumbai (Waaree)', destination: 'Pandharpur (MSEDCL)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'Maharashtra largest floating site' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Panel Type', key: 'panelType', options: [
    { value: 'Mono PERC Float', count: 5 }, { value: 'Bifacial Float', count: 4 }, { value: 'HJT Float', count: 3 }, { value: 'Thin-Film Float', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 3 }, { value: 'High', count: 4 }, { value: 'Medium', count: 4 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 7 }, { value: 'West', count: 2 }, { value: 'North', count: 2 }, { value: 'Central', count: 2 }, { value: 'East', count: 1 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Sites', value: 14, sub: 'Water Bodies', color: 'text-amber-700' },
  { title: 'Total Capacity', value: '4,255 MW', sub: 'Installed', color: 'text-orange-700' },
  { title: 'Avg Efficiency', value: '23.1%', sub: 'Panel Rating', color: 'text-yellow-700' },
  { title: 'Water Coverage', value: '67.7 ha', sub: 'Total Footprint', color: 'text-blue-700' },
];

export default function FloatingSolarFarmLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.panelType} ${r.deploymentSite} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof FSFRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.panelType.split(' ')[0]; map.set(k, (map.get(k) || 0) + r.installedCapacity); });
    return Array.from(map.entries()).map(([name, capacity]) => ({ name, capacity }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const efficiencyTrend = useMemo(() => [
    { month: 'Jan', eff: 19.5 }, { month: 'Feb', eff: 20.2 }, { month: 'Mar', eff: 20.8 }, { month: 'Apr', eff: 21.5 }, { month: 'May', eff: 22.0 }, { month: 'Jun', eff: 22.6 }, { month: 'Jul', eff: 23.1 },
  ], []);

  const coverageByAnchor = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.anchorType, (map.get(r.anchorType) || 0) + r.waterCoverage); });
    return Array.from(map.entries()).map(([name, coverage]) => ({ name: name.slice(0, 10), coverage: Math.round(coverage * 10) / 10 }));
  }, []);

  const capacityByBody = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.waterBody, (map.get(r.waterBody) || 0) + r.installedCapacity); });
    return Array.from(map.entries()).map(([name, capacity]) => ({ name, capacity }));
  }, []);

  const priorityDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.priority, (map.get(r.priority) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const waterEvapData = useMemo(() => {
    return records.slice(0, 7).map((r) => ({ name: r.batchNo.slice(-2), saved: Math.round(r.waterCoverage * 12.5) }));
  }, []);

  const COLORS = ['#b45309', '#14532d', '#0c4a6e', '#581c87', '#7c2d12'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="fsf-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Solar Energy' }, { label: 'Floating Solar' }]} />
      <PageHeader title="Floating Solar Farm Logistics" description="Indian floating PV supply chain \u2014 Mono PERC, Bifacial, HJT, Thin-Film panels & reservoir deployment tracking" />

      <div className="fsf-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="fsf-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="fsf-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`fsf-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-amber-600 text-amber-700' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="fsf-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="fsf-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Panel Type (MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacity" fill="#b45309" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="fsf-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#b45309" /><Cell fill="#14532d" /><Cell fill="#0c4a6e" /><Cell fill="#581c87" /><Cell fill="#7c2d12" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="fsf-chart-card"><CardHeader><CardTitle className="text-sm">Panel Efficiency Trend (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={efficiencyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[18, 26]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="eff" stroke="#14532d" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="fsf-chart-card"><CardHeader><CardTitle className="text-sm">Water Coverage by Anchor Type (ha)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={coverageByAnchor}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="coverage" fill="#0c4a6e" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="fsf-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Panel</th><th className="px-2 py-2 text-left">Site</th><th className="px-2 py-2 text-right">MW</th><th className="px-2 py-2 text-right">Eff%</th><th className="px-2 py-2 text-right">ha</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`fsf-table-row border-b hover:bg-amber-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.panelType}</td>
                  <td className="px-2 py-2 text-xs">{r.deploymentSite}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.installedCapacity}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.panelEfficiency}%</td>
                  <td className="px-2 py-2 text-right font-mono">{r.waterCoverage}</td>
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
        <div className="fsf-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="fsf-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Water Body (MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByBody}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacity" fill="#14532d" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="fsf-chart-card"><CardHeader><CardTitle className="text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={priorityDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#dc2626" /><Cell fill="#d97706" /><Cell fill="#2563eb" /><Cell fill="#16a34a" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="fsf-chart-card"><CardHeader><CardTitle className="text-sm">Water Evaporation Saved (ML/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={waterEvapData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="saved" fill="#581c87" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="fsf-chart-card"><CardHeader><CardTitle className="text-sm">Capacity vs Efficiency</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), capacity: r.installedCapacity, eff: r.panelEfficiency }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="capacity" stroke="#b45309" strokeWidth={2} name="MW" /><Line type="monotone" dataKey="eff" stroke="#14532d" strokeWidth={2} name="Efficiency %" /></LineChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="fsf-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="fsf-insight-card border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm text-amber-700">NTPC Ramagundam: India&apos;s Largest Floating Solar</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">NTPC Ramagundam (FSF-0001, 250MW Phase-2) is India&apos;s largest floating solar installation at 100MW Phase-1 operational. Built on 450ha of Ramagundam reservoir using HDPE pontoon anchoring. Water evaporation reduced by 70% under panel coverage. Cooling effect from water boosts panel output by 5-7% vs ground-mounted. Total project cost: \u20b94,500Cr. Commissioned Phase-1 in 2023, Phase-2 targeted Dec 2026. NHPC and NTPC jointly targeting 10GW floating solar on dam reservoirs by 2030.</p></CardContent></Card>
          <Card className="fsf-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">HJT Technology: Premium Efficiency for Water</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Heterojunction Technology (HJT) panels (FSF-0005, FSF-0008, FSF-0013) deliver 25.5-26.8% efficiency — 15% higher than Mono PERC. Premium justified by water cooling: ambient temperature drop of 8-12\u00b0C under floating conditions, reducing thermal degradation. Vikram Solar Bengaluru manufacturing 500MW/year HJT float-rated panels. Price premium: \u20b94/Wp vs \u20b92.8/Wp for PERC, offset by 15% higher energy yield. MNRE subsidy: \u20b90.50/Wp additional for float-rated modules under PM-KUSUM.</p></CardContent></Card>
          <Card className="fsf-insight-card border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm text-sky-700">Dual Benefit: Power Generation + Water Conservation</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Floating solar provides dual value: 4,255MW generation plus 67.7ha water surface coverage preventing evaporation. Estimated water savings: 846 million litres/year across 14 sites. Critical for water-stressed states: Telangana (Ramagundam, Nagarjuna Sagar), MP (Tawa Reservoir), Maharashtra (Ujani Dam). Evaporation savings valued at \u20b912Cr/year at current irrigation water rates. Additional benefit: reduced algae growth under panel shading improves water quality for downstream use.</p></CardContent></Card>
          <Card className="fsf-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Shipments: FSF-0004 & FSF-0013</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">FSF-0004 (Rihand Reservoir, 600MW): steel pile mooring system delayed 7 days — Indian Railways cargo backlog on Howrah-Delhi corridor for 180T steel structures. FSF-0013 (Meena Reservoir, 280MW): landslide blocked NH44 ghat section for 9 days, HJT panels rerouted via Hyderabad adding 300km. Mitigation: pre-position mooring hardware at dam sites; maintain alternate road routes for monsoon. Financial impact: \u20b985L per day delay for 600MW project = \u20b959.5L total.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
