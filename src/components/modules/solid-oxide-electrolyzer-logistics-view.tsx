'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface SOECRecord {
  id: string;
  batchNo: string;
  cellDesign: string;
  electrolyte: string;
  application: string;
  capacityNm3h: number;
  efficiency: number;
  tempC: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: SOECRecord[] = [
  { id: 'SOC-0001', batchNo: 'SOC-B2401', cellDesign: 'Planar ASC', electrolyte: 'YSZ (8YSZ)', application: 'Green Steel', capacityNm3h: 5000, efficiency: 95, tempC: 850, status: 'In Transit', priority: 'Critical', origin: 'Jamshedpur (Tata Steel)', destination: 'Kalinganagar (Tata Steel Plant)', shipDate: '2026-07-20', transitDays: 3, zone: 'East', remarks: 'DRI green steel H2 reduction' },
  { id: 'SOC-0002', batchNo: 'SOC-B2402', cellDesign: 'Tubular ESC', electrolyte: 'ScSZ', application: 'Ammonia Synthesis', capacityNm3h: 10000, efficiency: 92, tempC: 900, status: 'Delivered', priority: 'High', origin: 'Mumbai (L&T Heavy)', destination: 'Hazira (Reliance Green NH3)', shipDate: '2026-07-18', transitDays: 1, zone: 'West', remarks: 'Green ammonia Haber-Bosch H2 feed' },
  { id: 'SOC-0003', batchNo: 'SOC-B2403', cellDesign: 'Planar ASC', electrolyte: 'GDC-YSZ', application: 'Refinery Desulfurization', capacityNm3h: 3000, efficiency: 94, tempC: 800, status: 'Processing', priority: 'Medium', origin: 'Bengaluru (BHEL R&D)', destination: 'Vadodara (IOCL Refinery)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'Hydro-desulfurization green H2' },
  { id: 'SOC-0004', batchNo: 'SOC-B2404', cellDesign: 'Planar ESC', electrolyte: 'YSZ (8YSZ)', application: 'Syngas Production', capacityNm3h: 8000, efficiency: 88, tempC: 850, status: 'Delayed', priority: 'Critical', origin: 'Vijayawada (BHEL Boilers)', destination: 'Sikka (GSPL Petrochem)', shipDate: '2026-07-14', transitDays: 10, zone: 'South', remarks: 'Co-electrolysis H2+CO syngas' },
  { id: 'SOC-0005', batchNo: 'SOC-B2405', cellDesign: 'Tubular ASC', electrolyte: 'LSGM', application: 'Methanol Synthesis', capacityNm3h: 6000, efficiency: 90, tempC: 750, status: 'In Transit', priority: 'High', origin: 'Mumbai (Thermax)', destination: 'Mangalore (MRPL)', shipDate: '2026-07-21', transitDays: 4, zone: 'West', remarks: 'Green methanol from CO2+H2' },
  { id: 'SOC-0006', batchNo: 'SOC-B2406', cellDesign: 'Planar ASC', electrolyte: 'YSZ (8YSZ)', application: 'Power-to-Gas', capacityNm3h: 2000, efficiency: 96, tempC: 850, status: 'Delivered', priority: 'Medium', origin: 'Pune (Cummins India)', destination: 'Panipat (GAIL P2G)', shipDate: '2026-07-17', transitDays: 1, zone: 'North', remarks: 'Grid-scale H2 underground storage' },
  { id: 'SOC-0007', batchNo: 'SOC-B2407', cellDesign: 'Planar ESC', electrolyte: 'GDC', application: 'Fuel Cell APU', capacityNm3h: 100, efficiency: 97, tempC: 700, status: 'Processing', priority: 'Low', origin: 'Thiruvananthapuram (VSSC)', destination: 'Bengaluru (ISRO FC)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'Space FC regenerative mode APU' },
  { id: 'SOC-0008', batchNo: 'SOC-B2408', cellDesign: 'Tubular ASC', electrolyte: 'ScSZ', application: 'Cement Decarbonization', capacityNm3h: 4000, efficiency: 93, tempC: 850, status: 'In Transit', priority: 'High', origin: 'Kolkata (Shree Cement)', destination: 'Bilaspur (ACC Ltd)', shipDate: '2026-07-19', transitDays: 2, zone: 'East', remarks: 'Cement kiln green H2 calcination' },
  { id: 'SOC-0009', batchNo: 'SOC-B2409', cellDesign: 'Planar ASC', electrolyte: 'YSZ (8YSZ)', application: 'Glass Manufacturing', capacityNm3h: 1500, efficiency: 94, tempC: 800, status: 'Delivered', priority: 'Medium', origin: 'Bengaluru (IISc)', destination: 'Nashik (Asahi Glass India)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Float glass furnace H2-oxy fuel' },
  { id: 'SOC-0010', batchNo: 'SOC-B2410', cellDesign: 'Planar ESC', electrolyte: 'YSZ (3YSZ)', application: 'e-Fuels Aviation', capacityNm3h: 12000, efficiency: 87, tempC: 900, status: 'Processing', priority: 'Critical', origin: 'Hyderabad (HAL Aviation)', destination: 'Bangalore (IAF Depot)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: 'Synthetic aviation fuel SAF from CO2' },
  { id: 'SOC-0011', batchNo: 'SOC-B2411', cellDesign: 'Tubular ASC', electrolyte: 'GDC-YSZ', application: 'Copper Smelting', capacityNm3h: 2500, efficiency: 91, tempC: 800, status: 'In Transit', priority: 'Medium', origin: 'Bhilai (SAIL R&D)', destination: 'Khetri (HCL Smelter)', shipDate: '2026-07-20', transitDays: 3, zone: 'West', remarks: 'Copper flash smelting green H2' },
  { id: 'SOC-0012', batchNo: 'SOC-B2412', cellDesign: 'Planar ASC', electrolyte: 'YSZ (8YSZ)', application: 'Data Center Hydrogen', capacityNm3h: 800, efficiency: 95, tempC: 850, status: 'Delivered', priority: 'High', origin: 'Chennai (Flex Power)', destination: 'Pune (Google DC)', shipDate: '2026-07-13', transitDays: 2, zone: 'South', remarks: 'DC H2 fuel cell continuous power' },
  { id: 'SOC-0013', batchNo: 'SOC-B2413', cellDesign: 'Planar ESC', electrolyte: 'ScSZ', application: 'Aluminum Smelting', capacityNm3h: 7000, efficiency: 89, tempC: 900, status: 'Delayed', priority: 'High', origin: 'New Delhi (Nalco R&D)', destination: 'Koraput (NALCO Smelter)', shipDate: '2026-07-11', transitDays: 15, zone: 'East', remarks: 'Al Hall-Heroult green H2 anode' },
  { id: 'SOC-0014', batchNo: 'SOC-B2414', cellDesign: 'Tubular ASC', electrolyte: 'LSGM', application: 'Nuclear Hydrogen', capacityNm3h: 15000, efficiency: 92, tempC: 850, status: 'In Transit', priority: 'Critical', origin: 'Mumbai (BARC)', destination: 'Kalpakkam (BHAVINI)', shipDate: '2026-07-22', transitDays: 3, zone: 'South', remarks: 'HTGR-coupled SOEC 15kNm3/h for BHAVINI' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Cell Design', key: 'cellDesign', options: [
    { value: 'Planar ASC', count: 6 }, { value: 'Planar ESC', count: 4 }, { value: 'Tubular ASC', count: 3 }, { value: 'Tubular ESC', count: 1 },
  ]},
  { label: 'Application', key: 'application', options: [
    { value: 'Green Steel', count: 1 }, { value: 'Ammonia Synthesis', count: 1 }, { value: 'Refinery Desulfurization', count: 1 }, { value: 'Syngas Production', count: 1 }, { value: 'Methanol Synthesis', count: 1 }, { value: 'Power-to-Gas', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 4 }, { value: 'Medium', count: 4 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 7 }, { value: 'East', count: 3 }, { value: 'West', count: 2 }, { value: 'North', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Units', value: 14, sub: 'SOEC Assemblies', color: 'text-rose-800' },
  { title: 'Combined H2 Output', value: '81.4k Nm3/h', sub: 'Hydrogen Capacity', color: 'text-red-700' },
  { title: 'Avg Efficiency', value: '92.1%', sub: 'SOEC 800-900\u00b0C', color: 'text-orange-700' },
  { title: 'Green H2 Target', value: '\u20b918,000Cr', sub: 'National H2 Mission', color: 'text-amber-700' },
];

export default function SolidOxideElectrolyzerLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.cellDesign} ${r.electrolyte} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof SOECRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capByDesign = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.cellDesign.split(' ')[0], (map.get(r.cellDesign.split(' ')[0]) || 0) + r.capacityNm3h); });
    return Array.from(map.entries()).map(([name, capacityNm3h]) => ({ name, capacityNm3h: capacityNm3h / 1000 }));
  }, []);

  const designDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.cellDesign, (map.get(r.cellDesign) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name: name.slice(0, 12), value }));
  }, []);

  const effTrend = useMemo(() => [
    { month: 'Jan', eff: 85 }, { month: 'Feb', eff: 87 }, { month: 'Mar', eff: 89 }, { month: 'Apr', eff: 90 }, { month: 'May', eff: 91 }, { month: 'Jun', eff: 91.5 }, { month: 'Jul', eff: 92.1 },
  ], []);

  const capData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), cap: r.capacityNm3h / 1000 }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const tempByApp = useMemo(() => {
    const map = new Map<string, number>();
    const cnt = new Map<string, number>();
    records.forEach((r) => { const k = r.application.split(' ')[0].slice(0, 8); map.set(k, (map.get(k) || 0) + r.tempC); cnt.set(k, (cnt.get(k) || 0) + 1); });
    return Array.from(map.entries()).slice(0, 6).map(([name, total]) => ({ name, avgTemp: Math.round(total / (cnt.get(name) || 1)) }));
  }, []);

  const COLORS = ['#9f1239', '#e11d48', '#f43f5e', '#fb923c', '#f59e0b', '#84cc16'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="soc-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Green Hydrogen' }, { label: 'SOEC Electrolyzer' }]} />
      <PageHeader title="Solid Oxide Electrolyzer Cell Logistics" description="Indian SOEC supply chain \u2014 Planar/Tubular ASC/ESC with YSZ/ScSZ/GDC/LSGM electrolytes for green steel, ammonia, SAF, and nuclear H2" />

      <div className="soc-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="soc-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="soc-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`soc-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-rose-600 text-rose-700' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="soc-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="soc-chart-card"><CardHeader><CardTitle className="text-sm">H2 Capacity by Cell Design (kNm3/h)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capByDesign}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityNm3h" fill="#9f1239" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="soc-chart-card"><CardHeader><CardTitle className="text-sm">Cell Design Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={designDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#9f1239" /><Cell fill="#e11d48" /><Cell fill="#f43f5e" /><Cell fill="#fb923c" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="soc-chart-card"><CardHeader><CardTitle className="text-sm">Efficiency Trend (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={effTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[82, 96]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="eff" stroke="#e11d48" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="soc-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Batch (kNm3/h)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="cap" fill="#f43f5e" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="soc-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Design</th><th className="px-2 py-2 text-left">Electrolyte</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">Nm3/h</th><th className="px-2 py-2 text-right">Eff%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`soc-table-row border-b hover:bg-rose-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.cellDesign}</td>
                  <td className="px-2 py-2 text-xs">{r.electrolyte}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacityNm3h}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.efficiency}</td>
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
        <div className="soc-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="soc-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#9f1239" /><Cell fill="#e11d48" /><Cell fill="#f43f5e" /><Cell fill="#fb923c" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="soc-chart-card"><CardHeader><CardTitle className="text-sm">Avg Temp by Application (\u00b0C)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={tempByApp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis domain={[700, 950]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="avgTemp" fill="#f59e0b" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="soc-chart-card"><CardHeader><CardTitle className="text-sm">Efficiency vs Capacity (Batch View)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), eff: r.efficiency, cap: r.capacityNm3h / 1000 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="eff" stroke="#9f1239" strokeWidth={2} name="Eff%" /><Line type="monotone" dataKey="cap" stroke="#f43f5e" strokeWidth={2} name="kNm3/h" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="soc-chart-card"><CardHeader><CardTitle className="text-sm">Output by Application (kNm3/h)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.application.split(' ')[0].slice(0, 10), cap: r.capacityNm3h / 1000 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="cap" fill="#84cc16" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="soc-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="soc-insight-card border-l-4 border-l-rose-600"><CardHeader><CardTitle className="text-sm text-rose-700">Tata Steel: 5,000 Nm3/h SOEC for Green Steel</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Tata Steel deploying India&apos;s largest SOEC installation (SOC-0001, 5,000 Nm3/h) at Kalinganagar for direct reduced iron (DRI) green steel production. Planar ASC cell design with 8YSZ electrolyte at 850\u00b0C achieves 95% electrical-to-hydrogen efficiency — 30% higher than PEM electrolyzer at same capacity. SOEC advantage: high-grade waste heat from steel blast furnace (800-900\u00b0C) can be co-fed, reducing electricity consumption by 25%. Tata Steel targeting 10Mt green steel by 2030, replacing coal-based BF with H2-DRI. Total SOEC requirement: 50,000 Nm3/h across Jamshedpur and Kalinganagar. BARC and BHEL jointly developing indigenous SOEC stack with Indian rare-earth scandia-doped zirconia from IREL Kerala — reducing cell cost 50% vs imported Bloom Energy stacks.</p></CardContent></Card>
          <Card className="soc-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">BARC Nuclear-SOEC: HTGR-Coupled 15k Nm3/h</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">BARC Mumbai delivering world&apos;s first nuclear-coupled SOEC (SOC-0014, 15,000 Nm3/h) to BHAVINI Kalpakkam — combining High-Temperature Gas-Cooled Reactor (HTGR) waste heat at 950\u00b0C with SOEC for ultra-efficient hydrogen production. Nuclear-SOEC system achieves 92% efficiency using thermal energy from reactor instead of electricity — producing H2 at \u20b9120/kg vs grid-SOEC \u20b9280/kg. BARC designed tubular ASC cells with LSGM (lanthanum strontium gallium manganite) electrolyte for superior ionic conductivity at reduced temperature 750\u00b0C. Project classified under DAE strategic programme: \u20b94,500Cr allocated. Target: 50MW nuclear-SOEC by 2030 for naval propulsion fuel and strategic H2 reserve. India&apos;s three-stage nuclear programme integrating hydrogen as energy carrier.</p></CardContent></Card>
          <Card className="soc-insight-card border-l-4 border-l-orange-500"><CardHeader><CardTitle className="text-sm text-orange-700">Delayed Batches: SOC-0004 and SOC-0013</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">SOC-0004 (BHEL Vijayawada to GSPL Sikka, 10-day delay): 8,000 Nm3/h planar ESC SOEC for co-electrolysis syngas production — H2+CO output for petrochemical Fischer-Tropsch synthesis. Delay caused by BHEL boiler division facility shutdown due to monsoon flooding of Godavari river. Rerouted critical cell stack components via Chennai port at \u20b935L additional freight. SOC-0013 (NALCO Delhi to Koraput, 15-day delay): 7,000 Nm3/h SOEC for green aluminum smelting — highway transport from Delhi to Odisha blocked by Chhattisgarh tribal protest bandh on NH44. Rerouted via Kolkata-Ranchi at 3-day detour. NALCO losing \u20b95.2Cr/month on carbon credits due to continued coal-based anode smelting. New SOP: maintain 2-week electrolyte buffer stock at Koraput plant for monsoon season.</p></CardContent></Card>
          <Card className="soc-insight-card border-l-4 border-l-amber-600"><CardHeader><CardTitle className="text-sm text-amber-700">SOEC e-SAF: Indian Aviation&apos;s Net-Zero Path</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">HAL Bengaluru delivering 12,000 Nm3/h SOEC (SOC-0010) to Indian Air Force for synthetic aviation fuel (SAF) production — world&apos;s largest military e-fuels project. SOEC co-electrolyzes CO2 (captured from biogas) and steam at 900\u00b0C to produce syngas, which is then converted to synthetic kerosene via Fischer-Tropsch process. Each SOEC unit produces 4,500 tonne SAF/year — enough for 200 fighter jet sorties. IAF targeting 10% SAF blend by 2028 and 50% by 2035 under Net Zero Aviation Roadmap. Cost: current e-SAF at \u20b9180/liter vs Jet-A1 at \u20b985/liter, expected to reach parity by 2032 with SOEC efficiency improvements and cheaper renewable electricity. Total programme: \u20b98,500Cr under MoD strategic energy security fund.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
