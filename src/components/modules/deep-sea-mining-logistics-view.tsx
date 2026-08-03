'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface DSMRecord {
  id: string;
  batchNo: string;
  mineralTarget: string;
  seabedType: string;
  application: string;
  tonnageMT: number;
  depthM: number;
  recoverMethod: string;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  sailDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: DSMRecord[] = [
  { id: 'DSM-0001', batchNo: 'DSM-S2401', mineralTarget: 'Polymetallic Nodules', seabedType: 'Abyssal Plain (Clarion-Clipperton)', application: 'Battery Cathode Materials', tonnageMT: 8500, depthM: 4500, recoverMethod: 'Hydraulic Nodule Collector', status: 'In Transit', priority: 'Critical', origin: 'Central Indian Ocean (ISA Area)', destination: 'Chennai Port (NIOT Processing)', sailDate: '2026-07-20', transitDays: 18, zone: 'South', remarks: '8,500 MT polymetallic nodules containing Mn, Ni, Cu, Co for battery cathode precursor supply to NIOT Chennai' },
  { id: 'DSM-0002', batchNo: 'DSM-S2402', mineralTarget: 'Cobalt-Rich Crusts', seabedType: 'Seamount Flank (Andaman Basin)', application: 'Superalloy Turbine Blades', tonnageMT: 3200, depthM: 2500, recoverMethod: 'ROV Cutter Head', status: 'Delivered', priority: 'High', origin: 'Andaman Sea Seamount (ANCP)', destination: 'Visakhapatnam (HAL Aero)', sailDate: '2026-07-18', transitDays: 5, zone: 'East', remarks: '3,200 MT cobalt-rich crusts for HAL HAL Tejas Mk2 superalloy turbine blade cobalt supply chain' },
  { id: 'DSM-0003', batchNo: 'DSM-S2403', mineralTarget: 'Polymetallic Nodules', seabedType: 'Abyssal Plain (Central Indian Basin)', application: 'Steel Alloy Additives', tonnageMT: 12000, depthM: 5200, recoverMethod: 'Hydraulic Nodule Collector', status: 'Processing', priority: 'Critical', origin: 'CIOB (India Pioneer Area)', destination: 'Mumbai Port (Tata Steel)', sailDate: '2026-07-23', transitDays: 15, zone: 'West', remarks: '12,000 MT nodules from India Pioneer Area CIOB for Tata Steel manganese-nickel alloy steel production' },
  { id: 'DSM-0004', batchNo: 'DSM-S2404', mineralTarget: 'Seafloor Massive Sulfides', seabedType: 'Hydrothermal Vent (Mascarene Plateau)', application: 'Copper Wire Cable', tonnageMT: 4500, depthM: 3000, recoverMethod: 'Dredge + Subsea Pump', status: 'In Transit', priority: 'High', origin: 'SW Indian Ridge Vent Field', destination: 'Kochi Port (Sterlite Copper)', sailDate: '2026-07-19', transitDays: 12, zone: 'South', remarks: '4,500 MT seafloor massive sulfides copper-zinc-gold for Sterlite Kochi copper smelter and wire cable plant' },
  { id: 'DSM-0005', batchNo: 'DSM-S2405', mineralTarget: 'Manganese Nodules', seabedType: 'Abyssal Plain (Wharton Basin)', application: 'EV Battery MnO2 Cathode', tonnageMT: 6800, depthM: 4800, recoverMethod: 'Continuous Bucket Chain', status: 'Delayed', priority: 'Critical', origin: 'Wharton Basin (EoI Block)', destination: 'Gujarat Port (Exicom EV)', sailDate: '2026-07-12', transitDays: 25, zone: 'West', remarks: '6,800 MT high-grade manganese nodules for Exicom LMO battery cathode — cyclone delayed surface processing vessel 25 days' },
  { id: 'DSM-0006', batchNo: 'DSM-S2406', mineralTarget: 'Cobalt-Rich Crusts', seabedType: 'Guyot Summit (Laccadive Sea)', application: 'Rare Earth Element Extraction', tonnageMT: 2100, depthM: 1800, recoverMethod: 'ROV Waterjet Mining', status: 'Delivered', priority: 'High', origin: 'Laccadive Guyot (NIOT Survey)', destination: 'Mumbai (IREL Processing)', sailDate: '2026-07-16', transitDays: 8, zone: 'West', remarks: '2,100 MT cobalt-rich crusts with REE enrichment for IREL Mumbai rare earth extraction and recovery' },
  { id: 'DSM-0007', batchNo: 'DSM-S2407', mineralTarget: 'Polymetallic Nodules', seabedType: 'Abyssal Plain (CIOB)', application: 'Fertilizer Micronutrients', tonnageMT: 5500, depthM: 5000, recoverMethod: 'Hydraulic Nodule Collector', status: 'In Transit', priority: 'Medium', origin: 'CIOB Pioneer Zone', destination: 'Paradeep (IFFCO Plant)', sailDate: '2026-07-21', transitDays: 14, zone: 'East', remarks: '5,500 MT nodule-derived manganese-zinc micronutrients for IFFCO Paradeep zincated fertilizer production' },
  { id: 'DSM-0008', batchNo: 'DSM-S2408', mineralTarget: 'Seafloor Massive Sulfides', seabedType: 'Black Smoker (Carlsberg Ridge)', application: 'Electronics Solder Alloy', tonnageMT: 1800, depthM: 3500, recoverMethod: 'ROV Suction Drill', status: 'Delivered', priority: 'Medium', origin: 'Carlsberg Ridge Vent (NIOT)', destination: 'Noida (BEL Electronics)', sailDate: '2026-07-15', transitDays: 10, zone: 'North', remarks: '1,800 MT SMS with high tin-silver-gold for BEL Noida defense electronics solder alloy supply chain' },
  { id: 'DSM-0009', batchNo: 'DSM-S2409', mineralTarget: 'Manganese Nodules', seabedType: 'Abyssal Plain (Mascarene Basin)', application: 'Stainless Steel Production', tonnageMT: 9200, depthM: 4600, recoverMethod: 'Continuous Bucket Chain', status: 'Processing', priority: 'Critical', origin: 'Mascarene Basin (Survey Block)', destination: 'Vizag (JSW Steel)', sailDate: '2026-07-24', transitDays: 16, zone: 'South', remarks: '9,200 MT high-Mn nodules for JSW Vizag 304/316 stainless steel manganese alloying element import replacement' },
  { id: 'DSM-0010', batchNo: 'DSM-S2410', mineralTarget: 'Cobalt-Rich Crusts', seabedType: 'Seamount (Ninetyeast Ridge)', application: 'Jet Engine Superalloy', tonnageMT: 1500, depthM: 2200, recoverMethod: 'ROV Cutter Head', status: 'In Transit', priority: 'High', origin: 'Ninetyeast Ridge Seamount', destination: 'Bengaluru (GE Aerospace)', sailDate: '2026-07-22', transitDays: 12, zone: 'South', remarks: '1,500 MT Co-Cr-rich crusts for GE Aerospace Bengaluru LEAP engine superalloy cobalt sourcing India defense offset' },
  { id: 'DSM-0011', batchNo: 'DSM-S2411', mineralTarget: 'Polymetallic Nodules', seabedType: 'Abyssal Plain (CIOB)', application: 'Aluminum Smelter Anodes', tonnageMT: 7400, depthM: 5100, recoverMethod: 'Hydraulic Nodule Collector', status: 'Delivered', priority: 'Medium', origin: 'CIOB Western Zone', destination: 'Odisha Port (NALCO)', sailDate: '2026-07-17', transitDays: 10, zone: 'East', remarks: '7,400 MT nodules for NALCO SGR aluminum smelter inert anode manganese-silica additive development' },
  { id: 'DSM-0012', batchNo: 'DSM-S2412', mineralTarget: 'Seafloor Massive Sulfides', seabedType: 'Hydrothermal Mound (Rodrigues Triple)', application: 'Gold-Copper Byproduct', tonnageMT: 2200, depthM: 2800, recoverMethod: 'ROV Suction Drill', status: 'Delayed', priority: 'High', origin: 'Rodrigues Triple Junction', destination: 'Mumbai (Hindustan Zinc)', sailDate: '2026-07-10', transitDays: 20, zone: 'West', remarks: '2,200 MT SMS gold-copper-zinc — ROV drill bit failure at 2800m delayed extraction by 20 days pending spare deployment' },
  { id: 'DSM-0013', batchNo: 'DSM-S2413', mineralTarget: 'Manganese Nodules', seabedType: 'Abyssal Plain (Somali Basin)', application: 'Lithium-Ion Battery Mn', tonnageMT: 5600, depthM: 4900, recoverMethod: 'Continuous Bucket Chain', status: 'In Transit', priority: 'Critical', origin: 'Somali Basin (India EoI)', destination: 'Chennai (Amara Raja)', sailDate: '2026-07-20', transitDays: 14, zone: 'South', remarks: '5,600 MT Mn nodules for Amara Raja Chennai Li-ion NMC battery cathode manganese precursor manufacturing' },
  { id: 'DSM-0014', batchNo: 'DSM-S2414', mineralTarget: 'Polymetallic Nodules', seabedType: 'Abyssal Plain (Madagascar Basin)', application: 'Defense Electronics Shielding', tonnageMT: 3800, depthM: 4400, recoverMethod: 'Hydraulic Nodule Collector', status: 'Processing', priority: 'High', origin: 'Madagascar Basin (MoU Area)', destination: 'Hyderabad (DRDO-ECIL)', sailDate: '2026-07-25', transitDays: 13, zone: 'South', remarks: '3,800 MT nodules for DRDO-ECIL electromagnetic shielding composite nickel-copper alloy defense electronics' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Mineral Target', key: 'mineralTarget', options: [
    { value: 'Polymetallic Nodules', count: 5 }, { value: 'Manganese Nodules', count: 3 }, { value: 'Cobalt-Rich Crusts', count: 3 }, { value: 'Seafloor Massive Sulfides', count: 3 },
  ]},
  { label: 'Application', key: 'application', options: [
    { value: 'Battery Cathode Materials', count: 2 }, { value: 'Steel Alloy Additives', count: 1 }, { value: 'Superalloy Turbine Blades', count: 1 }, { value: 'Copper Wire Cable', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 5 }, { value: 'High', count: 5 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 6 }, { value: 'West', count: 3 }, { value: 'East', count: 3 }, { value: 'North', count: 1 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Batches', value: 14, sub: 'Deep Sea Mining', color: 'text-blue-900' },
  { title: 'Combined Tonnage', value: '74,100 MT', sub: 'All Mineral Types', color: 'text-sky-700' },
  { title: 'Avg Depth', value: '3,750 m', sub: 'Deep Abyssal Operations', color: 'text-indigo-700' },
  { title: 'National Target', value: '\u20b915,000Cr', sub: 'Deep Ocean Mission', color: 'text-slate-700' },
];

export default function DeepSeaMiningLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.mineralTarget} ${r.seabedType} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof DSMRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const tonnageByMineral = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.mineralTarget, (map.get(r.mineralTarget) || 0) + r.tonnageMT); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, tonnageMT]) => ({ name: name.slice(0, 18), tonnageMT }));
  }, []);

  const seabedDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.seabedType.split('(')[0].trim(); map.set(s, (map.get(s) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const prodTrend = useMemo(() => [
    { year: '2022', mt: 2000 }, { year: '2023', mt: 8000 }, { year: '2024', mt: 18000 }, { year: '2025', mt: 35000 }, { year: '2026', mt: 65000 }, { year: '2027', mt: 110000 }, { year: '2028', mt: 180000 },
  ], []);

  const depthData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), depth: r.depthM }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const tonnageByApp = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application, (map.get(r.application) || 0) + r.tonnageMT); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, tonnageMT]) => ({ name: name.slice(0, 16), tonnageMT }));
  }, []);

  const COLORS = ['#1e3a5f', '#2563eb', '#1d4ed8', '#1e40af', '#172554'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="dsm-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Blue Economy' }, { label: 'Deep Sea Mining' }]} />
      <PageHeader title="Deep Sea Mining Logistics" description="Indian deep sea mineral exploration and recovery &#8212; polymetallic nodules, cobalt-rich crusts, seafloor massive sulfides from Indian Ocean abyssal plains, seamounts, and hydrothermal vents for battery cathodes, steel alloys, superalloys, rare earths, and electronics" />

      <div className="dsm-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="dsm-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="dsm-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`dsm-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-blue-900 text-blue-900' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="dsm-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="dsm-chart-card"><CardHeader><CardTitle className="text-sm">Tonnage by Mineral Target (MT)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={tonnageByMineral}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="tonnageMT" fill="#1e3a5f" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="dsm-chart-card"><CardHeader><CardTitle className="text-sm">Seabed Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={seabedDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#1e3a5f" /><Cell fill="#2563eb" /><Cell fill="#1d4ed8" /><Cell fill="#1e40af" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="dsm-chart-card"><CardHeader><CardTitle className="text-sm">Deep Sea Mining Production Growth (MT/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={prodTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="mt" stroke="#2563eb" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="dsm-chart-card"><CardHeader><CardTitle className="text-sm">Extraction Depth (m) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={depthData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="depth" fill="#1e40af" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="dsm-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Mineral</th><th className="px-2 py-2 text-left">Seabed</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">MT</th><th className="px-2 py-2 text-right">Depth</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`dsm-table-row border-b hover:bg-blue-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.mineralTarget}</td>
                  <td className="px-2 py-2 text-xs">{r.seabedType.split('(')[0].trim()}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.tonnageMT.toLocaleString()}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.depthM}m</td>
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
        <div className="dsm-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="dsm-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#1e3a5f" /><Cell fill="#2563eb" /><Cell fill="#1d4ed8" /><Cell fill="#1e40af" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="dsm-chart-card"><CardHeader><CardTitle className="text-sm">Tonnage by Application (MT)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={tonnageByApp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="tonnageMT" fill="#1e3a5f" radius={[4,4,0,0]} name="MT" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="dsm-chart-card"><CardHeader><CardTitle className="text-sm">Depth vs Tonnage</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), depth: r.depthM, mt: r.tonnageMT / 1000 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="depth" stroke="#1e3a5f" strokeWidth={2} name="meters" /><Line type="monotone" dataKey="mt" stroke="#2563eb" strokeWidth={2} name="K MT" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="dsm-chart-card"><CardHeader><CardTitle className="text-sm">Recovery Method Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={Array.from(new Map(records.map((r) => [r.recoverMethod, records.filter((x) => x.recoverMethod === r.recoverMethod).length])).entries()).map(([name, value]) => ({ name: name.slice(0, 18), value }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#1e3a5f" /><Cell fill="#2563eb" /><Cell fill="#1d4ed8" /><Cell fill="#1e40af" /><Cell fill="#172554" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="dsm-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="dsm-insight-card border-l-4 border-l-blue-900"><CardHeader><CardTitle className="text-sm text-blue-900">India Deep Ocean Mission: 75,000 sq km Pioneer Area in CIOB</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s Deep Ocean Mission (DOM) under Ministry of Earth Sciences allocated &#8377;15,000Cr for polymetallic nodule exploration and mining in the Central Indian Ocean Basin (CIOB). India holds ISA pioneer investor rights over 75,000 sq km of abyssal plain at 4,500-6,000m depth, containing estimated 380 MT of polymetallic nodules with average composition: Mn 27%, Ni 1.4%, Cu 1.1%, Co 0.25% with Ti and REE traces. NIOT Chennai developed India&apos;s first nodule collector prototype &#8212; a tracked subsea vehicle with hydraulic suction at 15 tonnes/hr collection rate, tested at 5,200m depth during Samudrayaan trial. DSM-0003: 12,000 MT batch from CIOB Pioneer Area represents first commercial-scale nodule recovery, processed at NIOT Chennai metallurgical pilot plant using high-pressure acid leach (HPAL) for Ni-Cu-Co extraction and calcination for Mn recovery. India targeting 3 MTPA nodule production by 2032, replacing 25% of manganese and nickel imports critical for EV battery cathode and stainless steel production. NODCO (National Oceanic Deep-sea Mining Company) incorporated under MoES for commercial deep-sea mining operations.</p></CardContent></Card>
          <Card className="dsm-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: DSM-0005 and DSM-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">DSM-0005 (Wharton Basin to Gujarat Exicom, 25-day delay): 6,800 MT manganese nodules for Exicom EV battery MnO2 cathode precursor &#8212; cyclone in South Indian Ocean disrupted surface processing vessel (SPV) operations for 25 days. Nodule collection continued via ROV at depth but surface crushing, washing, and grading on SPV halted during Force-5 cyclone. Exicom Gujarat LMO cathode plant operated on buffer stock with 6 weeks remaining. Alternative supply from terrestrial Mn ore from MOIL Nagpur at 40% higher cost arranged as contingency. DSM-0012 (Rodrigues Triple Junction to Mumbai Hindustan Zinc, 20-day delay): 2,200 MT seafloor massive sulfides for zinc-copper-gold recovery &#8212; ROV suction drill tungsten carbide bit failure at 2,800m hydrothermal mound, requiring retrieval to surface vessel for bit replacement. Hindalco zinc smelter awaiting copper byproduct feedstock. Spare ROV drill assembly dispatched from NIOT Chennai via Indian Navy submarine rescue vessel INS Nireekshak. New enhanced drill bit with diamond-impregnated cutting face ordered from Baker Hughes for future operations at &#8377;4.5Cr per unit.</p></CardContent></Card>
          <Card className="dsm-insight-card border-l-4 border-l-sky-700"><CardHeader><CardTitle className="text-sm text-sky-700">NIOT Samudrayaan: India&apos;s Manned Submersible at 6,000m</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">NIOT Chennai Samudrayaan deep-sea mining submersible program: India&apos;s first indigenous 6,000m rated manned submersible MATSYA 6000 completed 12 operational dives during R332 survey season, mapping polymetallic nodule density and grade across CIOB Pioneer Area blocks. Two-person titanium sphere crew module rated to 6,000m (600bar) with 12-hour endurance, equipped with hydraulic nodule sampling arms and real-time compositional XRF analysis. Survey data from MATSYA 6000 refined nodule resource estimate from 380 MT to 420 MT across Pioneer Area, with identified high-grade zones exceeding 3.5 kg/m2 abundance. Samudrayaan supporting DSM operations by providing in-situ grade verification before committing collector vehicles to specific seabed transects. ROV-based nodule collector prototypes tested at 5,200m achieving 15 tonnes/hr collection efficiency with 92% nodule recovery and 3% sediment disturbance. ISA Mining Code compliance: NIOT environmental baseline monitoring program documenting benthic ecosystem impact with 20 sediment trap stations and 15 autonomous camera platforms. India committed to zero-discharge mining with 99.5% sediment return to seabed.</p></CardContent></Card>
          <Card className="dsm-insight-card border-l-4 border-l-indigo-700"><CardHeader><CardTitle className="text-sm text-indigo-700">Cobalt-Rich Crusts: Andaman Seamount Strategic Cobalt Reserve</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s Andaman-Nicobar Cobalt Province (ANCP) survey program identified 12 seamounts in Andaman Basin with cobalt-rich ferromanganese crusts at 1,500-2,500m depth. DSM-0002: 3,200 MT cobalt-rich crusts recovered from Andaman seamount flank using NIOT ROV cutter head system, containing 0.8% Co, 0.3% Ni, 0.15% Pt, and 500ppm total REE &#8212; delivering critical cobalt supply for HAL Tejas Mk2 superalloy turbine blades at &#8377;12,000/kg cobalt equivalent, 35% below imported cobalt price. DSM-0010: 1,500 MT additional crusts from Ninetyeast Ridge seamount for GE Aerospace Bengaluru LEAP engine superalloy production, supporting India defense offset commitment for 200 GE F414 engines. India holds 2nd largest cobalt crust resource globally estimated at 12 MT cobalt metal equivalent. NIOT developing automated crust mining ROV with multi-axis cutter capable of 5 tonnes/hr extraction on steep seamount slopes up to 30 degrees. Crust processing flowsheet: crushing &#8594; sulfuric acid leach &#8594; solvent extraction &#8594; electrowinning for cobalt metal, with REE recovery from leach residue. Investment: &#8377;6,500Cr including ROV fleet, processing plant at Port Blair, and Andaman naval base expansion.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
