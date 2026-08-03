'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface MSSRecord {
  id: string;
  batchNo: string;
  saltType: string;
  containment: string;
  application: string;
  capacityMWh: number;
  tempC: number;
  durationHrs: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: MSSRecord[] = [
  { id: 'MSS-0001', batchNo: 'MSS-T2401', saltType: 'Solar Salt (60% NaNO3 + 40% KNO3)', containment: 'Two-Tank Molten Salt', application: 'CSP Peaker Plant', capacityMWh: 2800, tempC: 565, durationHrs: 10, status: 'In Transit', priority: 'Critical', origin: 'Bhilwara (Godawari Power)', destination: 'Jaisalmer (NTPC CSP)', shipDate: '2026-07-20', transitDays: 4, zone: 'North', remarks: '2,800 MWh solar salt TES at 565C hot tank for NTPC Jaisalmer 250MW CSP peaker plant &#8212; 10hr storage, Rajasthan Desert' },
  { id: 'MSS-0002', batchNo: 'MSS-T2402', saltType: 'Hitec (NaNO3+NaNO2+KNO3)', containment: 'Single-Tank Thermocline', application: 'Industrial Process Heat', capacityMWh: 450, tempC: 454, durationHrs: 8, status: 'Delivered', priority: 'High', origin: 'Chennai (L&amp;T Energy)', destination: 'Vizag (Visakhapatnam Steel)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: '450 MWh HitecXL thermocline for Vizag Steel annealing furnace pre-heat at 454C &#8212; replacing gas-fired reheating' },
  { id: 'MSS-0003', batchNo: 'MSS-T2403', saltType: 'Solar Salt (60/40)', containment: 'Two-Tank Molten Salt', application: 'CSP Baseload Hybrid', capacityMWh: 5400, tempC: 565, durationHrs: 15, status: 'Processing', priority: 'Critical', origin: 'Mumbai (Tata Power Solar)', destination: 'Bhuj (Adani Solar CSP)', shipDate: '2026-07-23', transitDays: 3, zone: 'West', remarks: '5,400 MWh solar salt TES for Adani Bhuj 350MW CSP-baseload &#8212; 15hr storage, 24/7 grid supply Gujarat' },
  { id: 'MSS-0004', batchNo: 'MSS-T2404', saltType: 'Chloride Salt (NaCl+KCl+MgCl2)', containment: 'Two-Tank Molten Salt', application: 'Gen3 CSP Tower', capacityMWh: 3200, tempC: 720, durationHrs: 12, status: 'In Transit', priority: 'Critical', origin: 'Bengaluru (BHEL R&amp;D)', destination: 'Hyderabad (NRDC Gen3)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: '3,200 MWh chloride salt at 720C for NRDC Hyderabad Gen3 CSP tower pilot &#8212; 40% efficiency gain over nitrate' },
  { id: 'MSS-0005', batchNo: 'MSS-T2405', saltType: 'Solar Salt (60/40)', containment: 'Two-Tank Molten Salt', application: 'Desalination Plant', capacityMWh: 800, tempC: 565, durationHrs: 6, status: 'Delayed', priority: 'Medium', origin: 'Ahmedabad (Sterling&amp;Wilson)', destination: 'Jamnagar (Reliance Desal)', shipDate: '2026-07-12', transitDays: 14, zone: 'West', remarks: '800 MWh solar salt TES for Reliance Jamnagar thermal desalination CSP &#8212; salt impurity rejection during freeze-thaw test delay' },
  { id: 'MSS-0006', batchNo: 'MSS-T2406', saltType: 'HitecXL (CaNO3+NaNO3+KNO3)', containment: 'Single-Tank Thermocline', application: 'Food Processing Heat', capacityMWh: 180, tempC: 500, durationHrs: 10, status: 'Delivered', priority: 'High', origin: 'Delhi (Thermax Solar)', destination: 'Nashik (PepsiCo Plant)', shipDate: '2026-07-16', transitDays: 2, zone: 'North', remarks: '180 MWh HitecXL thermocline for PepsiCo Nashik food processing steam at 500C &#8212; 10hr off-peak thermal storage' },
  { id: 'MSS-0007', batchNo: 'MSS-T2407', saltType: 'Solar Salt (60/40)', containment: 'Packed-Bed Thermocline', application: 'District Heating Pilot', capacityMWh: 350, tempC: 565, durationHrs: 8, status: 'In Transit', priority: 'High', origin: 'Kolkata (CESC Solar)', destination: 'Bhubaneswar (Odisha Discom)', shipDate: '2026-07-21', transitDays: 2, zone: 'East', remarks: '350 MWh packed-bed thermocline for Bhubaneswar district heating pilot &#8212; rocks+salt dual-media reducing cost 25%' },
  { id: 'MSS-0008', batchNo: 'MSS-T2408', saltType: 'Chloride Salt (NaCl+MgCl2)', containment: 'Two-Tank Molten Salt', application: 'Steel Smelting Heat', capacityMWh: 1200, tempC: 700, durationHrs: 6, status: 'Delivered', priority: 'Medium', origin: 'Rourkela (SAIL R&amp;D)', destination: 'Jamshedpur (Tata Steel)', shipDate: '2026-07-15', transitDays: 3, zone: 'East', remarks: '1,200 MWh chloride salt at 700C for Tata Steel electric arc furnace pre-heating &#8212; replacing 30MW arc electrode' },
  { id: 'MSS-0009', batchNo: 'MSS-T2409', saltType: 'Nitrate Salt (NaNO3+KNO3)', containment: 'Two-Tank Molten Salt', application: 'Textile Mill Steam', capacityMWh: 250, tempC: 400, durationHrs: 8, status: 'Processing', priority: 'High', origin: 'Coimbatore (ISRO-TSW)', destination: 'Tirupur (TCP Mill)', shipDate: '2026-07-24', transitDays: 0, zone: 'South', remarks: '250 MWh nitrate TES for Tirupur textile dyeing mill steam at 400C &#8212; solar thermal replacing 8tonne/day coal' },
  { id: 'MSS-0010', batchNo: 'MSS-T2410', saltType: 'Solar Salt (60/40)', containment: 'Two-Tank Molten Salt', application: 'Green H2 Production', capacityMWh: 1800, tempC: 565, durationHrs: 12, status: 'In Transit', priority: 'High', origin: 'Pune (Bloom Energy)', destination: 'Barmer (NTPC Green H2)', shipDate: '2026-07-22', transitDays: 5, zone: 'North', remarks: '1,800 MWh solar salt TES for NTPC Barmer green H2 CSP &#8212; 12hr thermal storage driving SOEC electrolyzer at 800C' },
  { id: 'MSS-0011', batchNo: 'MSS-T2411', saltType: 'Hitec (7%NaNO3+49%KNO3+44%NaNO2)', containment: 'Single-Tank Thermocline', application: 'Pharmaceutical Sterilization', capacityMWh: 120, tempC: 454, durationHrs: 6, status: 'Delivered', priority: 'Medium', origin: 'Hyderabad (Dr. Reddy&apos;s Solar)', destination: 'Visakhapatnam (Pharma Zone)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: '120 MWh Hitec thermocline for Vizag Pharma SEZ autoclave sterilization &#8212; 454C steam generation' },
  { id: 'MSS-0012', batchNo: 'MSS-T2412', saltType: 'Solar Salt (60/40)', containment: 'Two-Tank Molten Salt', application: 'Oil Refinery Heat', capacityMWh: 2200, tempC: 565, durationHrs: 10, status: 'Delayed', priority: 'Low', origin: 'Mumbai (BPCL Solar)', destination: 'Mangalore (MRPL Refinery)', shipDate: '2026-07-10', transitDays: 16, zone: 'West', remarks: '2,200 MWh solar salt for MRPL Mangalore refinery crude pre-heating &#8212; nitrate salt moisture contamination delay' },
  { id: 'MSS-0013', batchNo: 'MSS-T2413', saltType: 'Fluoride Salt (LiF+NaF+KF FLiNaK)', containment: 'Two-Tank Molten Salt', application: 'Advanced Reactor Coolant', capacityMWh: 600, tempC: 700, durationHrs: 24, status: 'In Transit', priority: 'Critical', origin: 'Kalpakkam (IGCAR)', destination: 'Tarapur (NPCIL MSR)', shipDate: '2026-07-20', transitDays: 3, zone: 'West', remarks: '600 MWh FLiNaK fluoride salt at 700C for NPCIL Tarapur Molten Salt Reactor coolant loop &#8212; 24hr decay heat removal' },
  { id: 'MSS-0014', batchNo: 'MSS-T2414', saltType: 'Solar Salt (60/40)', containment: 'Two-Tank Molten Salt', application: 'Cement Calciner', capacityMWh: 900, tempC: 565, durationHrs: 6, status: 'Processing', priority: 'Critical', origin: 'Chandrapur (ACC Solar)', destination: 'Nagpur (ACC Cement)', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: '900 MWh solar salt TES for ACC Nagpur cement calciner &#8212; 565C thermal storage displacing coal-fired calcination by 40%' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Salt Type', key: 'saltType', options: [
    { value: 'Solar Salt (60/40)', count: 7 }, { value: 'Chloride Salt (NaCl+KCl+MgCl2)', count: 2 }, { value: 'Hitec (NaNO3+NaNO2+KNO3)', count: 1 }, { value: 'Fluoride Salt (LiF+NaF+KF FLiNaK)', count: 1 },
  ]},
  { label: 'Application', key: 'application', options: [
    { value: 'CSP Peaker Plant', count: 1 }, { value: 'Industrial Process Heat', count: 1 }, { value: 'CSP Baseload Hybrid', count: 1 }, { value: 'Desalination Plant', count: 1 },
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
  { title: 'Total Shipments', value: 14, sub: 'MSS Logistics Batches', color: 'text-rose-800' },
  { title: 'Total Storage', value: '20,570 MWh', sub: 'Thermal Energy', color: 'text-red-700' },
  { title: 'Max Temperature', value: '720 &#176;C', sub: 'Chloride Gen3', color: 'text-orange-700' },
  { title: 'National Target', value: '\u20b922,000Cr', sub: 'CSP Thermal Storage', color: 'text-rose-700' },
];

export default function MoltenSaltStorageLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.saltType} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof MSSRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByApp = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application, (map.get(r.application) || 0) + r.capacityMWh); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, capacityMWh]) => ({ name: name.slice(0, 20), capacityMWh }));
  }, []);

  const saltDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.saltType.split('(')[0].trim(); map.set(s, (map.get(s) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const marketTrend = useMemo(() => [
    { year: '2022', mwh: 1200 }, { year: '2023', mwh: 4500 }, { year: '2024', mwh: 15000 }, { year: '2025', mwh: 38000 }, { year: '2026', mwh: 85000 }, { year: '2027', mwh: 180000 }, { year: '2028', mwh: 400000 },
  ], []);

  const tempData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), tempC: r.tempC }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const durationByType = useMemo(() => {
    return Array.from(new Map(records.map((r) => [r.saltType.split('(')[0].trim().slice(0, 14), { name: r.saltType.split('(')[0].trim().slice(0, 14), durationHrs: r.durationHrs }])).entries()).reduce((acc, [, v]) => { const e = acc.find((a) => a.name === v.name); if (e) e.durationHrs = Math.max(e.durationHrs, v.durationHrs); else acc.push({...v}); return acc; }, [] as { name: string; durationHrs: number }[]).sort((a, b) => b.durationHrs - a.durationHrs);
  }, []);

  const COLORS = ['#e11d48', '#be123c', '#9f1239', '#881337', '#f43f5e', '#fb7185'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="mss-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Energy Storage' }, { label: 'Molten Salt' }]} />
      <PageHeader title="Molten Salt Thermal Storage Logistics" description="Indian molten salt thermal energy storage &#8212; solar salt NaNO3/KNO3 60/40, Hitec NaNO3/NaNO2/KNO3, HitecXL CaNO3/KNO3/NaNO3, chloride NaCl/KCl/MgCl2, fluoride LiF/NaF/KF FLiNaK for CSP tower trough, industrial process heat, green hydrogen SOEC, steel smelting, cement calcination, desalination, district heating, pharmaceutical sterilization, and advanced reactor coolant applications" />

      <div className="mss-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="mss-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="mss-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`mss-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-rose-700 text-rose-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="mss-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="mss-chart-card"><CardHeader><CardTitle className="text-sm">Storage Capacity by Application (MWh)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByApp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityMWh" fill="#e11d48" radius={[4,4,0,0]} name="MWh" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="mss-chart-card"><CardHeader><CardTitle className="text-sm">Salt Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={saltDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#e11d48" /><Cell fill="#be123c" /><Cell fill="#9f1239" /><Cell fill="#881337" /><Cell fill="#f43f5e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="mss-chart-card"><CardHeader><CardTitle className="text-sm">India TES Market Growth (MWh/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={marketTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="mwh" stroke="#f43f5e" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="mss-chart-card"><CardHeader><CardTitle className="text-sm">Operating Temperature (&#176;C) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={tempData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="tempC" fill="#be123c" radius={[4,4,0,0]} name="Temp C" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="mss-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Salt Type</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">MWh</th><th className="px-2 py-2 text-right">&#176;C</th><th className="px-2 py-2 text-right">hrs</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`mss-table-row border-b hover:bg-rose-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.saltType.split('(')[0].trim().slice(0, 18)}</td>
                  <td className="px-2 py-2 text-xs">{r.application.slice(0, 22)}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacityMWh.toLocaleString()}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.tempC}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.durationHrs}h</td>
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
        <div className="mss-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="mss-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#e11d48" /><Cell fill="#be123c" /><Cell fill="#9f1239" /><Cell fill="#881337" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="mss-chart-card"><CardHeader><CardTitle className="text-sm">Max Duration (hrs) by Salt Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={durationByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="durationHrs" fill="#e11d48" radius={[4,4,0,0]} name="Hours" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="mss-chart-card"><CardHeader><CardTitle className="text-sm">Temperature vs Capacity</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), temp: r.tempC, mwh: Math.round(r.capacityMWh / 100) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="temp" stroke="#e11d48" strokeWidth={2} name="Temp C" /><Line type="monotone" dataKey="mwh" stroke="#f43f5e" strokeWidth={2} name="MWh/100" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="mss-chart-card"><CardHeader><CardTitle className="text-sm">Containment Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={Array.from(new Map(records.map((r) => [r.containment, { name: r.containment, value: 1 }])).values())} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name.slice(0,14)} ${(percent * 100).toFixed(0)}%`}><Cell fill="#e11d48" /><Cell fill="#be123c" /><Cell fill="#9f1239" /><Cell fill="#881337" /><Cell fill="#f43f5e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="mss-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="mss-insight-card border-l-4 border-l-rose-700"><CardHeader><CardTitle className="text-sm text-rose-800">India CSP Thermal Storage Target: 400,000 MWh by 2028</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s Ministry of New and Renewable Energy (MNRE) targeting 400,000 MWh molten salt thermal energy storage capacity by 2028 under National CSP Mission Phase-2. Phase-1 (2024-2026): 85,000 MWh across 5 GW CSP projects in Rajasthan Jaisalmer (MSS-0001), Gujarat Bhuj (MSS-0003), and Ladakh Leh &#8212; solar salt 60/40 NaNO3/KNO3 at 565C hot tank / 290C cold tank with two-tank configuration. Solar salt cost: &#8377;42/kg from Gujarat Fluorochemicals and Tata Chemicals Mithapur, India&apos;s largest nitrate salt producers at 2.5 million tonnes/year combined. Phase-2 (2026-2028): 315,000 MWh expansion including 120,000 MWh Gen3 chloride salt at 720C (MSS-0004) achieving 40% higher Carnot efficiency and 50% cost reduction vs nitrate salt &#8212; BHEL Bengaluru developing India&apos;s first chloride salt production at 8,000 tonnes/year. Key advantage: 24-hour baseload CSP at LCOE &#8377;4.2/kWh vs solar PV+Li-ion battery &#8377;5.8/kWh for equivalent storage duration above 10 hours. Total investment &#8377;22,000Cr with &#8377;12,000Cr from MNRE viability gap funding and &#8377;10,000Cr from NTPC, Adani, Tata Power equity. India&apos;s CSP corridor: Rajasthan-Gujarat-Karnataka targeting 15 GW CSP with 6 GW TES by 2030.</p></CardContent></Card>
          <Card className="mss-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Shipments: MSS-0005 and MSS-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">MSS-0005 (Sterling&amp;Wilson Ahmedabad to Reliance Jamnagar, 14-day delay): 800 MWh solar salt TES for Reliance Jamnagar thermal desalination CSP &#8214; nitrate salt impurity rejection during freeze-thaw cycling test at 290C cold tank temperature. Sample analysis revealed magnesium chloride contamination at 0.8% (specification maximum 0.2%) causing salt crystallization point depression from 222C to 195C and cold tank viscosity increase 3x. Sterling&amp;Wilson quarantining 180 tonnes of suspect salt batch from Gujarat Fluorochemicals and ordering replacement from Tata Chemicals Mithapur at &#8377;42/kg premium grade (&#8377;75.6L replacement cost). Impact: Reliance Jamnagar desalination CSP commissioning delayed 14 days, temporary 5 MGD desalination capacity reduced to 3 MGD using backup MSF flash distillation at 12 kWh/m3 vs target 8 kWh/m3 thermal. MSS-0012 (BPCL Mumbai to MRPL Mangalore, 16-day delay): 2,200 MWh solar salt for MRPL Mangalore refinery crude pre-heating &#8214; moisture contamination detected during rail transport from Mumbai to Mangalore due to inadequate waterproof tarpaulin covering during monsoon transit. Nitrate salt moisture content measured 1.2% (max 0.05%) requiring 72-hour vacuum drying at 200C before tank filling. BPCL replacing entire 440-tonne salt shipment at &#8377;1.85Cr, with improved triple-layer waterproof packaging for all future coastal monsoon transit routes. MRPL refinery operating crude pre-heater on backup gas firing at &#8377;12Cr/month additional fuel cost.</p></CardContent></Card>
          <Card className="mss-insight-card border-l-4 border-l-orange-600"><CardHeader><CardTitle className="text-sm text-orange-700">Gen3 Chloride Salt: 720C Next-Gen CSP</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">MSS-0004: 3,200 MWh chloride salt (NaCl+KCl+MgCl2) at 720C operating temperature for NRDC Hyderabad Gen3 CSP tower pilot &#8214; India&apos;s first supercritical CO2 Brayton cycle CSP demonstration. Chloride salt advantage: 720C operating temperature enables sCO2 turbine cycle at 48% thermal-to-electric efficiency (vs 42% for nitrate salt at 565C with steam turbine), reducing levelized cost of electricity by 18%. Salt cost: &#8377;8/kg chloride vs &#8377;42/kg nitrate &#8214; 5x cheaper raw material using abundant NaCl and MgCl2 from Tata Chemicals and Hindalco. Challenge: chloride salt is 15x more corrosive than nitrate at elevated temperatures, requiring Inconel 625 and Hastelloy N alloys for hot tank and piping from Mishra Dhatu Nigam (MIDHANI) Hyderabad at &#8377;12,000/kg vs &#8377;800/kg carbon steel for nitrate tanks. NRDC Gen3 pilot: 50 MW thermal receiver on 200m tower, 100 MWh first-phase TES at 720C/500C, sCO2 turbine 10 MW electrical output. Full-scale target: 250 MW sCO2 CSP tower with 3,200 MWh chloride TES at LCOE &#8377;3.4/kWh. India&apos;s Gen3 CSP programme funded at &#8377;2,800Cr under US-India CLEANergy cooperation with NREL providing sCO2 turbine design transfer to BHEL Hyderabad. BHEL targeting commercial Gen3 CSP deployment by 2028 with indigenous chloride salt production at 50,000 tonnes/year.</p></CardContent></Card>
          <Card className="mss-insight-card border-l-4 border-l-pink-600"><CardHeader><CardTitle className="text-sm text-pink-700">FLiNaK Fluoride Salt: NPCIL Molten Salt Reactor</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">MSS-0013: 600 MWh FLiNaK (LiF-NaF-KF) fluoride salt at 700C for NPCIL Tarapur Molten Salt Reactor (MSR) coolant loop &#8212; India&apos;s first civilian molten salt reactor thermal storage and decay heat removal system. FLiNaK properties: melting point 454C, boiling point 1,570C, density 2,070 kg/m3 at 700C, thermal conductivity 1.0 W/mK, negligible vapor pressure enabling atmospheric-pressure operation. IGCAR Kalpakkam producing FLiNaK through electrochemical purification of LiF (from Indian Lithium Corporation Kharagpur), NaF (from Tata Chemicals), and KF (from Hindustan Fluorocarbon) at &#8377;12,000/kg high-purity nuclear grade. MSR coolant loop: primary FLiNaK at 700C inlet / 800C outlet circulating through graphite-moderated core at 4 m/s, transferring 350 MW thermal to intermediate NaF-BeF2 (FLiBe) salt loop and then to supercritical steam cycle at 600C / 240 bar. Thermal storage function: 600 MWh FLiNaK buffer tank provides 24-hour decay heat removal during reactor shutdown or SCRAM events, eliminating need for emergency diesel generators. Safety advantage: FLiNaK is chemically inert with air/water, no hydrogen generation risk, and negative temperature coefficient providing passive safety. NPCIL targeting 300 MW thermal MSR commercial unit by 2030 at &#8377;8,500Cr, with FLiNaK production scaled to 500 tonnes/year at IGCAR new salt production facility under Indira Gandhi Centre for Atomic Research expansion programme.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
