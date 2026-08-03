'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface CCSRecord {
  id: string;
  batchNo: string;
  captureTech: string;
  storageType: string;
  source: string;
  capacityTPD: number;
  captureRate: number;
  costPerTonne: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: CCSRecord[] = [
  { id: 'CCS-0001', batchNo: 'CCS-B2401', captureTech: 'Post-Combustion Amine', storageType: 'Deep Saline Aquifer', source: 'Coal Power Plant', capacityTPD: 3500, captureRate: 90, costPerTonne: 5200, status: 'In Transit', priority: 'Critical', origin: 'Singrauli (NTPC)', destination: 'Banda (Vindhyachal Aquifer)', shipDate: '2026-07-20', transitDays: 2, zone: 'North', remarks: 'NTPC 500MW post-combustion amine scrubbing CO2 pipeline injection' },
  { id: 'CCS-0002', batchNo: 'CCS-B2402', captureTech: 'Pre-Combustion Selexol', storageType: 'Depleted Gas Reservoir', source: 'Steel Blast Furnace', capacityTPD: 5000, captureRate: 95, costPerTonne: 6800, status: 'Delivered', priority: 'High', origin: 'Jamshedpur (Tata Steel)', destination: 'Raniganj (ONGC Reservoir)', shipDate: '2026-07-18', transitDays: 3, zone: 'East', remarks: 'Tata Steel BF gas pre-combustion Selexol CO2 for EOR + storage' },
  { id: 'CCS-0003', batchNo: 'CCS-B2403', captureTech: 'Oxy-Fuel Combustion', storageType: 'Enhanced Oil Recovery', source: 'Cement Kiln', capacityTPD: 4200, captureRate: 97, costPerTonne: 7500, status: 'Processing', priority: 'Critical', origin: 'Mumbai (ACC Cement)', destination: 'Mumbai Offshore (ONGC)', shipDate: '2026-07-23', transitDays: 1, zone: 'West', remarks: 'ACC cement kiln oxy-fuel CO2 for Mumbai High EOR offshore' },
  { id: 'CCS-0004', batchNo: 'CCS-B2404', captureTech: 'Post-Combustion Amine', storageType: 'Basalt Mineralization', source: 'Refinery FCC', capacityTPD: 2800, captureRate: 88, costPerTonne: 5500, status: 'In Transit', priority: 'High', origin: 'Jamnagar (Reliance Refinery)', destination: 'Kutch (Basalt Formation)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: 'Reliance FCC unit CO2 basalt mineralization permanent storage' },
  { id: 'CCS-0005', batchNo: 'CCS-B2405', captureTech: 'DAC (Solid Sorbent)', storageType: 'Deep Saline Aquifer', source: 'Direct Air Capture', capacityTPD: 500, captureRate: 92, costPerTonne: 18000, status: 'Delayed', priority: 'High', origin: 'Jaisalmer (DAC Plant 1)', destination: 'Barmer (Aquifer Injection)', shipDate: '2026-07-12', transitDays: 16, zone: 'North', remarks: 'DAC sorbent replacement delay CSIR-NCL supply chain monsoon' },
  { id: 'CCS-0006', batchNo: 'CCS-B2406', captureTech: 'Chemical Looping', storageType: 'Enhanced Coal Bed Methane', source: 'Petrochemical Cracker', capacityTPD: 3200, captureRate: 96, costPerTonne: 6200, status: 'Delivered', priority: 'Medium', origin: 'Vadodara (Reliance Petrochem)', destination: 'Surat (Coal Bed Methane)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'Reliance petrochemical cracker CLC CO2 for ECBM Surat basin' },
  { id: 'CCS-0007', batchNo: 'CCS-B2407', captureTech: 'Post-Combustion Membrane', storageType: 'Depleted Oil Reservoir', source: 'Gas Turbine CHP', capacityTPD: 1500, captureRate: 85, costPerTonne: 4800, status: 'In Transit', priority: 'Medium', origin: 'Gandhinagar (GSECL Gas)', destination: 'Ahmedabad (Cambay Reservoir)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'GSECL gas turbine membrane CO2 injection Cambay basin depleted' },
  { id: 'CCS-0008', batchNo: 'CCS-B2408', captureTech: 'Pre-Combustion MDEA', storageType: 'Deep Saline Aquifer', source: 'Fertilizer Plant', capacityTPD: 2200, captureRate: 94, costPerTonne: 4500, status: 'Delivered', priority: 'High', origin: 'Sindri (IFFCO)', destination: 'Hazaribag (Aquifer Site)', shipDate: '2026-07-15', transitDays: 3, zone: 'East', remarks: 'IFFCO fertilizer MDEA sweetening CO2 aquifer storage Hazaribag' },
  { id: 'CCS-0009', batchNo: 'CCS-B2409', captureTech: 'Oxy-Fuel Combustion', storageType: 'Enhanced Oil Recovery', source: 'Aluminum Smelter', capacityTPD: 6000, captureRate: 98, costPerTonne: 8200, status: 'Processing', priority: 'Critical', origin: 'Korba (NALCO Smelter)', destination: 'Rajahmundry (ONGC EOR)', shipDate: '2026-07-24', transitDays: 4, zone: 'East', remarks: 'NALCO anode bake furnace oxy-fuel CO2 Godavari basin EOR' },
  { id: 'CCS-0010', batchNo: 'CCS-B2410', captureTech: 'Post-Combustion Amine', storageType: 'Basalt Mineralization', source: 'LNG Terminal', capacityTPD: 1200, captureRate: 90, costPerTonne: 5800, status: 'In Transit', priority: 'Medium', origin: 'Dahej (GAIL LNG)', destination: 'Bharuch (Deccan Basalt)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'GAIL LNG regasification CO2 basalt mineralization Deccan trap' },
  { id: 'CCS-0011', batchNo: 'CCS-B2411', captureTech: 'DAC (Liquid Solvent)', storageType: 'Deep Saline Aquifer', source: 'Direct Air Capture', capacityTPD: 300, captureRate: 95, costPerTonne: 22000, status: 'Delivered', priority: 'Low', origin: 'Leh (IIT-B DAC High Alt)', destination: 'Leh Valley (Aquifer)', shipDate: '2026-07-17', transitDays: 0, zone: 'North', remarks: 'IIT-Bombay high-altitude DAC KOH solvent low-temp aquifer' },
  { id: 'CCS-0012', batchNo: 'CCS-B2412', captureTech: 'Post-Combustion Amine', storageType: 'Enhanced Oil Recovery', source: 'Thermal Power Station', capacityTPD: 4500, captureRate: 92, costPerTonne: 5000, status: 'Delayed', priority: 'Critical', origin: 'Mundra (Adani Power)', destination: 'Mumbai Offshore (ONGC)', shipDate: '2026-07-11', transitDays: 19, zone: 'West', remarks: 'Adani 660MW amine CO2 pipeline rupture Gujarat monsoon repair' },
  { id: 'CCS-0013', batchNo: 'CCS-B2413', captureTech: 'Chemical Looping', storageType: 'Basalt Mineralization', source: 'Iron Ore Pellet Plant', capacityTPD: 3800, captureRate: 94, costPerTonne: 7000, status: 'In Transit', priority: 'High', origin: 'Bellary (JSW Steel)', destination: 'Raichur (Cuddapah Basalt)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: 'JSW pellet plant CLC CO2 Cuddapah supergroup basalt storage' },
  { id: 'CCS-0014', batchNo: 'CCS-B2414', captureTech: 'Post-Combustion Membrane', storageType: 'Depleted Gas Reservoir', source: 'Data Center', capacityTPD: 200, captureRate: 80, costPerTonne: 12000, status: 'Processing', priority: 'Low', origin: 'Pune (Tata Power DC)', destination: 'Dombivli (Krishna Godavari)', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: 'Tata DC gas turbine membrane CO2 small-scale pilot storage' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Capture Tech', key: 'captureTech', options: [
    { value: 'Post-Combustion Amine', count: 4 }, { value: 'Oxy-Fuel Combustion', count: 2 }, { value: 'Chemical Looping', count: 2 }, { value: 'DAC (Solid Sorbent)', count: 1 },
  ]},
  { label: 'Source', key: 'source', options: [
    { value: 'Coal Power Plant', count: 1 }, { value: 'Steel Blast Furnace', count: 1 }, { value: 'Cement Kiln', count: 1 }, { value: 'Refinery FCC', count: 1 }, { value: 'Direct Air Capture', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 7 }, { value: 'East', count: 4 }, { value: 'North', count: 3 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total CCS Units', value: 14, sub: 'Capture Installations', color: 'text-slate-800' },
  { title: 'Combined Capacity', value: '38,400 TPD', sub: 'CO2 Captured', color: 'text-gray-700' },
  { title: 'Avg Capture Rate', value: '92.0%', sub: 'Oxy-Fuel 97-98% Peak', color: 'text-zinc-700' },
  { title: 'National Target', value: '\u20b935,000Cr', sub: 'CCUS Mission 2030', color: 'text-neutral-700' },
];

export default function CarbonCaptureStorageLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.captureTech} ${r.storageType} ${r.source} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof CCSRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByTech = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.captureTech.split(' ')[0], (map.get(r.captureTech.split(' ')[0]) || 0) + r.capacityTPD); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, capacityTPD]) => ({ name: name.slice(0, 12), capacityTPD }));
  }, []);

  const storageDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.storageType.split(' ').slice(0, 2).join(' '); map.set(s, (map.get(s) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const captureTrend = useMemo(() => [
    { year: '2020', tpd: 2000 }, { year: '2021', tpd: 5000 }, { year: '2022', tpd: 9000 }, { year: '2023', tpd: 14000 }, { year: '2024', tpd: 22000 }, { year: '2025', tpd: 30000 }, { year: '2026', tpd: 38400 },
  ], []);

  const costData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), cost: r.costPerTonne / 1000 }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const rateBySource = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.source.split(' ')[0], (map.get(r.source.split(' ')[0]) || 0) + r.captureRate); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, rate]) => ({ name: name.slice(0, 10), rate }));
  }, []);

  const COLORS = ['#475569', '#64748b', '#0f766e', '#b45309', '#7c3aed', '#dc2626'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="ccs-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Carbon Management' }, { label: 'CCS Logistics' }]} />
      <PageHeader title="Carbon Capture &amp; Storage Logistics" description="Indian CCUS supply chain \u2014 post-combustion amine, pre-combustion Selexol/MDEA, oxy-fuel, chemical looping, DAC for power, steel, cement, refinery, and direct air capture with aquifer, EOR, basalt storage" />

      <div className="ccs-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="ccs-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="ccs-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`ccs-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-slate-700 text-slate-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="ccs-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="ccs-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Capture Tech (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByTech}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityTPD" fill="#475569" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ccs-chart-card"><CardHeader><CardTitle className="text-sm">Storage Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={storageDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#475569" /><Cell fill="#64748b" /><Cell fill="#0f766e" /><Cell fill="#b45309" /><Cell fill="#7c3aed" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="ccs-chart-card"><CardHeader><CardTitle className="text-sm">India CCS Capacity Growth (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={captureTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="tpd" stroke="#64748b" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="ccs-chart-card"><CardHeader><CardTitle className="text-sm">Cost per Tonne CO2 (x\u20b91K)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={costData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="cost" fill="#0f766e" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="ccs-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Capture Tech</th><th className="px-2 py-2 text-left">Storage</th><th className="px-2 py-2 text-left">Source</th><th className="px-2 py-2 text-right">TPD</th><th className="px-2 py-2 text-right">Rate%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`ccs-table-row border-b hover:bg-slate-50/50 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.captureTech}</td>
                  <td className="px-2 py-2 text-xs">{r.storageType}</td>
                  <td className="px-2 py-2 text-xs">{r.source}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacityTPD}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.captureRate}</td>
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
        <div className="ccs-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="ccs-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#475569" /><Cell fill="#64748b" /><Cell fill="#0f766e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="ccs-chart-card"><CardHeader><CardTitle className="text-sm">Capture Rate by Source (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={rateBySource}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="rate" fill="#475569" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ccs-chart-card"><CardHeader><CardTitle className="text-sm">Capture Rate vs Cost (Batch)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), rate: r.captureRate, cost: r.costPerTonne / 100 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="rate" stroke="#64748b" strokeWidth={2} name="Rate%" /><Line type="monotone" dataKey="cost" stroke="#b45309" strokeWidth={2} name="Cost \u20b9x100" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="ccs-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Storage Type (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={Array.from(new Map(records.map((r) => [r.storageType.split(' ').slice(0, 2).join(' '), records.filter((x) => x.storageType === r.storageType).reduce((sum, x) => sum + x.capacityTPD, 0)])).entries()).map(([name, capacityTPD]) => ({ name, capacityTPD }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityTPD" fill="#7c3aed" radius={[4,4,0,0]} name="TPD" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="ccs-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="ccs-insight-card border-l-4 border-l-slate-700"><CardHeader><CardTitle className="text-sm text-slate-800">NTPC Singrauli: India&apos;s Largest Post-Combustion CCS</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">NTPC Singrauli commissioned 3,500 TPD post-combustion amine scrubbing unit (CCS-0001) on 500MW Unit-13 — India&apos;s first utility-scale CCS on coal power plant. MEA-based solvent at 30% concentration with lean/rich heat exchanger recovering 85% of regeneration energy. CO2 compressed to 150bar for pipeline transport to Vindhyachal deep saline aquifer at 1,200m depth. Storage capacity: 50MT CO2 over 25 years in Bhandra sandstone formation with 30m caprock seal. NTPC targeting CCS retrofit on 10GW of coal fleet by 2035 — total investment \u20b915,000Cr. Carbon credit monetization: \u20b94,500/tonne CO2 at current EU ETS price equivalent, generating \u20b91,600Cr annual revenue from carbon offsets. Ministry of Power mandating CCS-ready design for all new coal plants above 300MW.</p></CardContent></Card>
          <Card className="ccs-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: CCS-0005 and CCS-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">CCS-0005 (Jaisalmer DAC Plant to Barmer, 16-day delay): 500 TPD direct air capture using solid amine sorbent from CSIR-NCL Pune — sorbent cartridge replacement delayed by monsoon flooding on NH11 from Ahmedabad. DAC plant operates at Rajasthan desert ambient 45C — 30% higher energy for fan blowers vs temperate DAC. Sorbent degradation rate 5% per 1,000 cycles requiring quarterly replacement. CCS-0012 (Mundra Adani Power to Mumbai Offshore, 19-day delay): 4,500 TPD CO2 pipeline from Adani Mundra 660MW plant ruptured at 47km mark due to Gujarat monsoon ground subsidence. Pipeline section replaced with API 5L X70 grade — higher corrosion resistance. Adani Power estimated \u20b925Cr production loss during 19-day outage. Offshore ONGC Mumbai High EOR injection delayed to August — 800,000 barrel incremental oil recovery at risk.</p></CardContent></Card>
          <Card className="ccs-insight-card border-l-4 border-l-teal-600"><CardHeader><CardTitle className="text-sm text-teal-700">Tata Steel Jamshedpur: Green Steel CCS Pioneer</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Tata Steel Jamshedpur deployed 5,000 TPD pre-combustion Selexol CO2 capture (CCS-0002) on blast furnace gas — the first Indian steelmaker to implement CCUS at commercial scale. Selexol physical solvent removes CO2 from shifted syngas at 40bar pressure with 95% capture rate, producing 99.5% pure CO2 for pipeline transport to ONGC Raniganj depleted reservoir for enhanced oil recovery. Dual benefit: 500,000 barrels incremental oil recovery over 10 years plus permanent CO2 storage. Tata Steel targeting net-zero by 2035 — CCS contributing 40% of emission reduction alongside electric arc furnace transition and hydrogen-based direct reduced iron. Deccan basalts near Jamshedpur offer additional 10GT permanent mineralization storage capacity. Green steel premium: \u20b94,000/tonne for CCS-certified steel in European export market.</p></CardContent></Card>
          <Card className="ccs-insight-card border-l-4 border-l-amber-600"><CardHeader><CardTitle className="text-sm text-amber-700">Reliance Jamnagar: Basalt Mineralization Breakthrough</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Reliance Jamnagar refinery deployed 2,800 TPD CO2 for Deccan Trap basalt mineralization (CCS-0004) — India&apos;s first in-situ mineral carbonation project. CO2 injected into vesicular basalt at 500-800m depth where it reacts with calcium-magnesium silicate minerals forming stable carbonate crystals within 2-5 years. Unlike aquifer storage requiring caprock integrity monitoring for millennia, basalt mineralization permanently locks CO2 as solid rock within years. Kutch basalt formation: 30GT storage capacity covering 5,000 sq km. Reliance partnering with IIT-B for mineralization kinetics optimization — carbFix methodology adapted from Iceland. Cost: \u20b95,500/tonne vs \u20b912,000 for DAC-to-mineralization pathway. Reliance targeting 50,000 TPD by 2028 across Jamnagar, Vadodara, and Hazira refinery complex.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
