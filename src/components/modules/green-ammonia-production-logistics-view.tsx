'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface ProductionRecord {
  id: string;
  batchNo: string;
  feedstock: string;
  technology: string;
  productionCapacity: number;
  energyCost: number;
  emissionIntensity: number;
  purity: number;
  dailyOutput: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: ProductionRecord[] = [
  { id: 'GAP-0001', batchNo: 'GAP-B2401', feedstock: 'Green H2 + Air', technology: 'Haber-Bosch Electrolyser', productionCapacity: 1500, energyCost: 7200, emissionIntensity: 0.12, purity: 99.9, dailyOutput: 450, status: 'In Transit', priority: 'Critical', origin: 'Gujarat (Reliance)', destination: 'Mumbai (RIL Refinery)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'First green ammonia shipment' },
  { id: 'GAP-0002', batchNo: 'GAP-B2402', feedstock: 'Biomass Syngas', technology: 'Gasification Looping', productionCapacity: 800, energyCost: 5800, emissionIntensity: 0.35, purity: 99.5, dailyOutput: 240, status: 'Delivered', priority: 'High', origin: 'Odisha (NALCO)', destination: 'Kolkata (IFFCO)', shipDate: '2026-07-18', transitDays: 3, zone: 'East', remarks: 'Biomass-derived green ammonia' },
  { id: 'GAP-0003', batchNo: 'GAP-B2403', feedstock: 'Solar H2 + N2', technology: 'Solid Oxide Electrolysis', productionCapacity: 2000, energyCost: 6500, emissionIntensity: 0.08, purity: 99.8, dailyOutput: 600, status: 'Processing', priority: 'Medium', origin: 'Rajasthan (NTPC Solar)', destination: 'Delhi (IARI)', shipDate: '2026-07-22', transitDays: 5, zone: 'North', remarks: 'SOE-powered green ammonia' },
  { id: 'GAP-0004', batchNo: 'GAP-B2404', feedstock: 'Wind H2 + N2', technology: 'Alkaline Electrolyser HB', productionCapacity: 1200, energyCost: 6800, emissionIntensity: 0.15, purity: 99.7, dailyOutput: 360, status: 'Delayed', priority: 'Critical', origin: 'Tamil Nadu (Adani Wind)', destination: 'Bengaluru (BASF)', shipDate: '2026-07-15', transitDays: 8, zone: 'South', remarks: 'Wind farm output variability delay' },
  { id: 'GAP-0005', batchNo: 'GAP-B2405', feedstock: 'Green H2 + CCS N2', technology: 'Haber-Bosch + CCS', productionCapacity: 2500, energyCost: 7800, emissionIntensity: 0.05, purity: 99.9, dailyOutput: 750, status: 'In Transit', priority: 'High', origin: 'Assam (Oil India)', destination: 'Guwahati (IFFCO)', shipDate: '2026-07-21', transitDays: 2, zone: 'East', remarks: 'Blue-green hybrid production' },
  { id: 'GAP-0006', batchNo: 'GAP-B2406', feedstock: 'Methane Pyrolysis H2', technology: 'Turquoise H2 + HB', productionCapacity: 900, energyCost: 5200, emissionIntensity: 0.22, purity: 99.6, dailyOutput: 270, status: 'Delivered', priority: 'Medium', origin: 'Kerala (BPCL Kochi)', destination: 'Chennai (NPCI)', shipDate: '2026-07-17', transitDays: 3, zone: 'South', remarks: 'Turquoise hydrogen feedstock' },
  { id: 'GAP-0007', batchNo: 'GAP-B2407', feedstock: 'Solar H2 + Air', technology: 'PEM Electrolyser HB', productionCapacity: 1800, energyCost: 7500, emissionIntensity: 0.10, purity: 99.8, dailyOutput: 540, status: 'Processing', priority: 'Low', origin: 'MP (NTPC Sagar)', destination: 'Bhopal (CFCL)', shipDate: '2026-07-23', transitDays: 1, zone: 'Central', remarks: 'PEM-based pilot production' },
  { id: 'GAP-0008', batchNo: 'GAP-B2408', feedstock: 'Offshore Wind H2', technology: 'AWE + Haber-Bosch', productionCapacity: 3000, energyCost: 7000, emissionIntensity: 0.06, purity: 99.9, dailyOutput: 900, status: 'In Transit', priority: 'High', origin: 'Gujarat (Adani Green)', destination: 'Ahmedabad (GNFC)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'Offshore wind-powered green H2' },
  { id: 'GAP-0009', batchNo: 'GAP-B2409', feedstock: 'Biomethane + N2', technology: 'Autothermal Reforming', productionCapacity: 600, energyCost: 4800, emissionIntensity: 0.40, purity: 99.2, dailyOutput: 180, status: 'Delivered', priority: 'Medium', origin: 'Punjab (Punjab Energy)', destination: 'Chandigarh (PAU)', shipDate: '2026-07-16', transitDays: 1, zone: 'North', remarks: 'Agri-waste biomethane route' },
  { id: 'GAP-0010', batchNo: 'GAP-B2410', feedstock: 'Green H2 + N2', technology: 'Molten Catalytic HB', productionCapacity: 2200, energyCost: 6200, emissionIntensity: 0.09, purity: 99.9, dailyOutput: 660, status: 'Processing', priority: 'Critical', origin: 'Karnataka (IOCL)', destination: 'Mangalore (MRPL)', shipDate: '2026-07-24', transitDays: 4, zone: 'South', remarks: 'Next-gen molten catalyst' },
  { id: 'GAP-0011', batchNo: 'GAP-B2411', feedstock: 'Hydro + Solar H2', technology: 'AWE + Haber-Bosch', productionCapacity: 1600, energyCost: 5500, emissionIntensity: 0.07, purity: 99.8, dailyOutput: 480, status: 'In Transit', priority: 'High', origin: 'Himachal (SJVN)', destination: 'Delhi (DFPCL)', shipDate: '2026-07-20', transitDays: 3, zone: 'North', remarks: 'Hydro-solar hybrid H2' },
  { id: 'GAP-0012', batchNo: 'GAP-B2412', feedstock: 'Waste-to-H2', technology: 'Plasma Gasification HB', productionCapacity: 400, energyCost: 8000, emissionIntensity: 0.18, purity: 98.9, dailyOutput: 120, status: 'Delivered', priority: 'Low', origin: 'Maharashtra (BMC Mumbai)', destination: 'Pune (Deepak Fert)', shipDate: '2026-07-14', transitDays: 2, zone: 'West', remarks: 'Municipal waste H2 route' },
  { id: 'GAP-0013', batchNo: 'GAP-B2413', feedstock: 'Nuclear H2 + N2', technology: 'HTGR + Haber-Bosch', productionCapacity: 3500, energyCost: 4500, emissionIntensity: 0.02, purity: 99.9, dailyOutput: 1050, status: 'Delayed', priority: 'High', origin: 'Gujarat (BHAVINI)', destination: 'Baroda (GSFC)', shipDate: '2026-07-12', transitDays: 10, zone: 'West', remarks: 'Nuclear H2 trial - regulatory delay' },
  { id: 'GAP-0014', batchNo: 'GAP-B2414', feedstock: 'Green H2 + Air', technology: 'Membrane Reactor HB', productionCapacity: 1000, energyCost: 6900, emissionIntensity: 0.11, purity: 99.7, dailyOutput: 300, status: 'In Transit', priority: 'Medium', origin: 'AP (NTPC Simhadri)', destination: 'Visakhapatnam (NFL)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Membrane reactor prototype' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Technology', key: 'technology', options: [
    { value: 'Haber-Bosch Electrolyser', count: 1 }, { value: 'Gasification Looping', count: 1 }, { value: 'Solid Oxide Electrolysis', count: 1 }, { value: 'Alkaline Electrolyser HB', count: 1 }, { value: 'Haber-Bosch + CCS', count: 1 }, { value: 'Turquoise H2 + HB', count: 1 }, { value: 'PEM Electrolyser HB', count: 1 }, { value: 'AWE + Haber-Bosch', count: 2 }, { value: 'Autothermal Reforming', count: 1 }, { value: 'Molten Catalytic HB', count: 1 }, { value: 'Plasma Gasification HB', count: 1 }, { value: 'HTGR + Haber-Bosch', count: 1 }, { value: 'Membrane Reactor HB', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 3 }, { value: 'High', count: 4 }, { value: 'Medium', count: 4 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 4 }, { value: 'South', count: 4 }, { value: 'North', count: 3 }, { value: 'East', count: 2 }, { value: 'Central', count: 1 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Production', value: '21,500 TPD', sub: 'Across All Plants', color: 'text-emerald-700' },
  { title: 'Avg Energy Cost', value: '\u20b96,550/T', sub: 'Per Tonne NH3', color: 'text-blue-700' },
  { title: 'Carbon Intensity', value: '0.15 kgCO2/kg', sub: 'Best: 0.02 Nuclear', color: 'text-purple-700' },
  { title: 'Avg Purity', value: '99.6%', sub: 'Target 99.95%', color: 'text-orange-700' },
];

export default function GreenAmmoniaProductionLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.feedstock} ${r.technology} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof ProductionRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByFeedstock = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.feedstock.split(' ')[0]; map.set(k, (map.get(k) || 0) + r.productionCapacity); });
    return Array.from(map.entries()).map(([name, capacity]) => ({ name, capacity }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const costTrend = useMemo(() => [
    { month: 'Jan', cost: 8200 }, { month: 'Feb', cost: 7900 }, { month: 'Mar', cost: 7600 }, { month: 'Apr', cost: 7300 }, { month: 'May', cost: 7000 }, { month: 'Jun', cost: 6800 }, { month: 'Jul', cost: 6550 },
  ], []);

  const emissionData = useMemo(() => {
    return records.slice(0, 7).map((r) => ({ name: r.batchNo.slice(-2), intensity: r.emissionIntensity }));
  }, []);

  const dailyOutputData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), output: r.dailyOutput }));
  }, []);

  const purityByZone = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    records.forEach((r) => { const entry = map.get(r.zone) || { total: 0, count: 0 }; entry.total += r.purity; entry.count += 1; map.set(r.zone, entry); });
    return Array.from(map.entries()).map(([name, { total, count }]) => ({ name, purity: Math.round(total / count * 10) / 10 }));
  }, []);

  const priorityDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.priority, (map.get(r.priority) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const COLORS = ['#14532d', '#1e3a5f', '#7c2d12', '#581c87', '#0c4a6e'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="gap-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Energy' }, { label: 'Green Ammonia' }]} />
      <PageHeader title="Green Ammonia Production Logistics" description="Indian green ammonia supply chain \u2014 Electrolyser, CCS, Biomass & Nuclear hydrogen-to-ammonia tracking" />

      <div className="gap-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="gap-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="gap-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`gap-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="gap-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="gap-chart-card"><CardHeader><CardTitle className="text-sm">Production Capacity by Feedstock (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByFeedstock}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacity" fill="#14532d" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="gap-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#14532d" /><Cell fill="#1e3a5f" /><Cell fill="#7c2d12" /><Cell fill="#581c87" /><Cell fill="#0c4a6e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="gap-chart-card"><CardHeader><CardTitle className="text-sm">Energy Cost Trend (\u20b9/T NH3)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={costTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="cost" stroke="#1e3a5f" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="gap-chart-card"><CardHeader><CardTitle className="text-sm">Carbon Intensity (kgCO2/kg NH3)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={emissionData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="intensity" fill="#7c2d12" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="gap-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Feedstock</th><th className="px-2 py-2 text-left">Technology</th><th className="px-2 py-2 text-right">TPD</th><th className="px-2 py-2 text-right">\u20b9/T</th><th className="px-2 py-2 text-right">Emission</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`gap-table-row border-b hover:bg-emerald-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.feedstock}</td>
                  <td className="px-2 py-2 text-xs">{r.technology}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.productionCapacity.toLocaleString()}</td>
                  <td className="px-2 py-2 text-right font-mono">\u20b9{r.energyCost.toLocaleString()}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.emissionIntensity}</td>
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
        <div className="gap-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="gap-chart-card"><CardHeader><CardTitle className="text-sm">Daily Output by Batch (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={dailyOutputData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="output" fill="#2d6a4f" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="gap-chart-card"><CardHeader><CardTitle className="text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={priorityDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#dc2626" /><Cell fill="#d97706" /><Cell fill="#2563eb" /><Cell fill="#16a34a" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="gap-chart-card"><CardHeader><CardTitle className="text-sm">Purity by Zone (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={purityByZone}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis domain={[98.5, 100]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="purity" fill="#581c87" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="gap-chart-card"><CardHeader><CardTitle className="text-sm">Capacity vs Emission Intensity</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), capacity: r.productionCapacity, emission: r.emissionIntensity }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="capacity" stroke="#14532d" strokeWidth={2} name="TPD" /><Line type="monotone" dataKey="emission" stroke="#dc2626" strokeWidth={2} name="kgCO2/kg" /></LineChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="gap-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="gap-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">Green Hydrogen Electrolyser Scale-Up</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India targets 5MTPA green hydrogen by 2030 under National Green Hydrogen Mission. Current installed electrolyser capacity: 350MW, scaling to 10GW. SIGHT incentive: \u20b92,400Cr production-linked subsidy. Leading electrolyser suppliers: Sterling & Wilson, AdvIn, John Cockerill. Cost trajectory: \u20b98,200/T in Jan 2026 to \u20b96,550/T in Jul 2026 (-20% decline). Key enabler: PLI for 3GW electrolyser manufacturing at Mundra and Kandla SEZ.</p></CardContent></Card>
          <Card className="gap-insight-card border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm text-blue-700">Nuclear Green Ammonia Breakthrough</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">GAP-0013 (BHAVINI nuclear H2) achieves lowest carbon intensity at 0.02 kgCO2/kg NH3 \u2014 6x better than biomass routes. HTGR reactor at Kalpakkam produces H2 at \u20b94,500/T, the cheapest green ammonia pathway. However, 10-day regulatory delay highlights AERB approval bottleneck. Recommended: fast-track nuclear-green ammonia licensing framework with DAE-AERB joint committee for pre-clearance. Projected: \u20b91,500Cr saved annually if nuclear route achieves 10% market share.</p></CardContent></Card>
          <Card className="gap-insight-card border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm text-amber-700">Biomass Gasification: Low-Cost Entry Point</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Biomass syngas route (GAP-0002, NALCO Odisha) offers lowest energy cost at \u20b95,800/T but highest emission intensity at 0.35 kgCO2/kg. Suitability: rural fertilizer plants in Punjab and UP with abundant agri-residue. Current agri-waste supply: 600MTPD potential, utilized only 15%. Recommended: co-locate gasifiers with existing NPK blending plants. IFFCO pilot at Paradip processing 200TPD paddy straw, producing 60TPD green ammonia for local fertilizer use.</p></CardContent></Card>
          <Card className="gap-insight-card border-l-4 border-l-purple-500"><CardHeader><CardTitle className="text-sm text-purple-700">Ammonia as Energy Carrier: Maritime & Storage</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Green ammonia emerging as hydrogen carrier for maritime fuel (IMO 2030) and long-duration energy storage. Adani Ports planning NH3 bunkering at Mundra and Kandla by 2027. Storage advantage: \u22121 bar, 25\u00b0C vs H2 at 700 bar. Green ammonia trading potential: India export to Japan/Korea at \u20b97,500/T CIF. Market size: \u20b945,000Cr by 2030. Key infrastructure: NH3 pipeline from Gujarat to Delhi (GSFC-NFL corridor) and coastal storage terminals at Vizag and Paradip.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
