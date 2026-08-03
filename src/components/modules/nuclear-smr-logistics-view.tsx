'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface SMRRecord {
  id: string;
  batchNo: string;
  reactorType: string;
  coolant: string;
  application: string;
  powerMW: number;
  efficiency: number;
  designLifeYrs: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: SMRRecord[] = [
  { id: 'SMR-0001', batchNo: 'SMR-B2401', reactorType: 'PWR (Integral)', coolant: 'Pressurized Water', application: 'Industrial Cogeneration', powerMW: 50, efficiency: 33, designLifeYrs: 60, status: 'In Transit', priority: 'Critical', origin: 'Mumbai (BARC)', destination: 'Gandhinagar (Reliance Refinery)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: '50MW PWR integral SMR for Refinery CHP replacing gas turbine' },
  { id: 'SMR-0002', batchNo: 'SMR-B2402', reactorType: 'HTGR (Pebble Bed)', coolant: 'Helium Gas', application: 'Industrial Heat', powerMW: 100, efficiency: 45, designLifeYrs: 40, status: 'Delivered', priority: 'High', origin: 'Kalpakkam (IGCAR)', destination: 'Vizag (HPCL Refinery)', shipDate: '2026-07-17', transitDays: 4, zone: 'South', remarks: '100MW HTR-PM for process heat 950C petrochemical cracking' },
  { id: 'SMR-0003', batchNo: 'SMR-B2403', reactorType: 'SMR (BWR)', coolant: 'Boiling Water', application: 'Grid Power', powerMW: 300, efficiency: 30, designLifeYrs: 60, status: 'Processing', priority: 'Critical', origin: 'Tarapur (NPCIL)', destination: 'Kudankulam (NPCIL Site)', shipDate: '2026-07-23', transitDays: 7, zone: 'West', remarks: '300MW BWR SMR modular unit Kudankulam Phase-3 expansion' },
  { id: 'SMR-0004', batchNo: 'SMR-B2404', reactorType: 'MSR (Liquid Fuel)', coolant: 'FLiBe Molten Salt', application: 'Grid Power', powerMW: 50, efficiency: 44, designLifeYrs: 30, status: 'In Transit', priority: 'High', origin: 'Bhubaneswar (IIT Bhubaneswar)', destination: 'Jodhpur (CAZRI Nuclear)', shipDate: '2026-07-19', transitDays: 5, zone: 'East', remarks: '50MW MSR prototype for Rajasthan desert grid desalination co-gen' },
  { id: 'SMR-0005', batchNo: 'SMR-B2405', reactorType: 'HTGR (Prismatic)', coolant: 'Helium Gas', application: 'Hydrogen Production', powerMW: 200, efficiency: 48, designLifeYrs: 40, status: 'Delayed', priority: 'Critical', origin: 'Hyderabad (BHEL Nuclear)', destination: 'Jamnagar (Reliance Green H2)', shipDate: '2026-07-12', transitDays: 18, zone: 'South', remarks: '200MW HTR for thermochemical H2 production IS cycle 850C' },
  { id: 'SMR-0006', batchNo: 'SMR-B2406', reactorType: 'PWR (Integral)', coolant: 'Pressurized Water', application: 'Mining Power', powerMW: 25, efficiency: 32, designLifeYrs: 60, status: 'Delivered', priority: 'Medium', origin: 'Mumbai (L&amp;T Nuclear)', destination: 'Jharia (Coal India Mining)', shipDate: '2026-07-16', transitDays: 3, zone: 'East', remarks: '25MW underground SMR for continuous mine power eliminating diesel genset' },
  { id: 'SMR-0007', batchNo: 'SMR-B2407', reactorType: 'FNR (Fast Neutron)', coolant: 'Liquid Sodium', application: 'Nuclear Waste Burner', powerMW: 50, efficiency: 40, designLifeYrs: 30, status: 'In Transit', priority: 'High', origin: 'Indore (BARC Fast Breeder)', destination: 'Kalpakkam (BHAVINI PFBR)', shipDate: '2026-07-21', transitDays: 3, zone: 'West', remarks: '50MW fast reactor for actinide burning waste transmutation program' },
  { id: 'SMR-0008', batchNo: 'SMR-B2408', reactorType: 'SMR (PWR)', coolant: 'Pressurized Water', application: 'Data Center', powerMW: 15, efficiency: 33, designLifeYrs: 60, status: 'Delivered', priority: 'Medium', origin: 'Bengaluru (BEL Nuclear)', destination: 'Mumbai (Tata Communications DC)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: '15MW SMR for Tier-IV data center 99.999% uptime zero-carbon' },
  { id: 'SMR-0009', batchNo: 'SMR-B2409', reactorType: 'HTGR (Pebble Bed)', coolant: 'Helium Gas', application: 'Steel Decarbonization', powerMW: 150, efficiency: 45, designLifeYrs: 40, status: 'Processing', priority: 'Critical', origin: 'Jamshedpur (Tata Steel)', destination: 'Kalinganagar (Tata Steel)', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: '150MW HTR for direct reduced iron replacing blast furnace coal' },
  { id: 'SMR-0010', batchNo: 'SMR-B2410', reactorType: 'MSR (Liquid Fuel)', coolant: 'FLiBe Molten Salt', application: 'Marine Propulsion', powerMW: 35, efficiency: 44, designLifeYrs: 25, status: 'In Transit', priority: 'High', origin: 'Vizag (MDL Shipyard)', destination: 'Mumbai (SCI Vessel)', shipDate: '2026-07-22', transitDays: 3, zone: 'South', remarks: '35MW MSR for container ship nuclear propulsion 20yr refueling' },
  { id: 'SMR-0011', batchNo: 'SMR-B2411', reactorType: 'PWR (Integral)', coolant: 'Pressurized Water', application: 'District Heating', powerMW: 10, efficiency: 85, designLifeYrs: 60, status: 'Delivered', priority: 'Low', origin: 'Chandigarh (NIT Design)', destination: 'Leh (Ladakh Heating)', shipDate: '2026-07-14', transitDays: 6, zone: 'North', remarks: '10MW SMR CHP for Ladakh -30C winter district heating network' },
  { id: 'SMR-0012', batchNo: 'SMR-B2412', reactorType: 'FNR (Fast Neutron)', coolant: 'Lead-Bismuth', application: 'Space Power', powerMW: 5, efficiency: 28, designLifeYrs: 15, status: 'Delayed', priority: 'Critical', origin: 'Ahmedabad (PRL-ISRO)', destination: 'Sriharikota (SDSC ISRO)', shipDate: '2026-07-10', transitDays: 20, zone: 'West', remarks: '5MW compact fast reactor for ISRO lunar surface power module' },
  { id: 'SMR-0013', batchNo: 'SMR-B2413', reactorType: 'SMR (BWR)', coolant: 'Boiling Water', application: 'Island Power', powerMW: 50, efficiency: 30, designLifeYrs: 60, status: 'In Transit', priority: 'High', origin: 'Kolkata (Garden Reach)', destination: 'Port Blair (Andaman)', shipDate: '2026-07-20', transitDays: 8, zone: 'East', remarks: '50MW barge-mounted SMR for Andaman&amp;Nicobar island clean power' },
  { id: 'SMR-0014', batchNo: 'SMR-B2414', reactorType: 'HTGR (Prismatic)', coolant: 'Helium Gas', application: 'Cement Decarbonization', powerMW: 100, efficiency: 48, designLifeYrs: 40, status: 'Processing', priority: 'High', origin: 'Mumbai (Thermax Nuclear)', destination: 'Chennai (ACC Cement)', shipDate: '2026-07-25', transitDays: 2, zone: 'West', remarks: '100MW HTR for cement kiln 1450C process heat eliminating coal' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Reactor Type', key: 'reactorType', options: [
    { value: 'PWR (Integral)', count: 4 }, { value: 'HTGR (Pebble Bed)', count: 2 }, { value: 'MSR (Liquid Fuel)', count: 2 }, { value: 'SMR (BWR)', count: 2 },
  ]},
  { label: 'Application', key: 'application', options: [
    { value: 'Grid Power', count: 2 }, { value: 'Industrial Heat', count: 1 }, { value: 'Hydrogen Production', count: 1 }, { value: 'Steel Decarbonization', count: 1 }, { value: 'Data Center', count: 1 }, { value: 'Mining Power', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 5 }, { value: 'High', count: 5 }, { value: 'Medium', count: 2 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 5 }, { value: 'South', count: 5 }, { value: 'East', count: 3 }, { value: 'North', count: 1 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total SMR Units', value: 14, sub: 'Reactor Assemblies', color: 'text-amber-800' },
  { title: 'Combined Capacity', value: '1,195 MW', sub: 'All Reactor Types', color: 'text-orange-700' },
  { title: 'Avg Efficiency', value: '39.2%', sub: 'HTGR 48% Peak', color: 'text-yellow-700' },
  { title: 'National Target', value: '\u20b970,000Cr', sub: 'NPCIL SMR Programme 2047', color: 'text-red-700' },
];

export default function NuclearSmrLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.reactorType} ${r.coolant} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof SMRRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const powerByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.reactorType.split(' ')[0], (map.get(r.reactorType.split(' ')[0]) || 0) + r.powerMW); });
    return Array.from(map.entries()).map(([name, powerMW]) => ({ name, powerMW }));
  }, []);

  const typeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.coolant.split(' ')[0], (map.get(r.coolant.split(' ')[0]) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const capacityTrend = useMemo(() => [
    { year: '2020', mw: 0 }, { year: '2022', mw: 50 }, { year: '2024', mw: 200 }, { year: '2026', mw: 595 }, { year: '2028', mw: 1200 }, { year: '2030', mw: 2500 }, { year: '2035', mw: 7000 },
  ], []);

  const lifeData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), life: r.designLifeYrs }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const powerByApp = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application.split(' ')[0], (map.get(r.application.split(' ')[0]) || 0) + r.powerMW); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, powerMW]) => ({ name: name.slice(0, 12), powerMW }));
  }, []);

  const COLORS = ['#9a3412', '#d97706', '#059669', '#0891b2', '#7c3aed'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="smr-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Nuclear Energy' }, { label: 'SMR Logistics' }]} />
      <PageHeader title="Small Modular Reactor (SMR) Logistics" description="Indian SMR supply chain \u2014 PWR, HTGR, MSR, FNR, BWR reactors for grid, industrial heat, hydrogen, steel, mining, marine, and space applications" />

      <div className="smr-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="smr-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="smr-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`smr-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-orange-700 text-orange-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="smr-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="smr-chart-card"><CardHeader><CardTitle className="text-sm">Power by Reactor Type (MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={powerByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="powerMW" fill="#9a3412" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="smr-chart-card"><CardHeader><CardTitle className="text-sm">Coolant Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#9a3412" /><Cell fill="#d97706" /><Cell fill="#059669" /><Cell fill="#0891b2" /><Cell fill="#7c3aed" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="smr-chart-card"><CardHeader><CardTitle className="text-sm">SMR Capacity Growth India (MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={capacityTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="mw" stroke="#d97706" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="smr-chart-card"><CardHeader><CardTitle className="text-sm">Design Life by Batch (Years)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={lifeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="life" fill="#7c3aed" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="smr-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-left">Coolant</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">MW</th><th className="px-2 py-2 text-right">Eff%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`smr-table-row border-b hover:bg-orange-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.reactorType}</td>
                  <td className="px-2 py-2 text-xs">{r.coolant}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.powerMW}</td>
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
        <div className="smr-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="smr-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#9a3412" /><Cell fill="#d97706" /><Cell fill="#059669" /><Cell fill="#0891b2" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="smr-chart-card"><CardHeader><CardTitle className="text-sm">Power by Application (MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={powerByApp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="powerMW" fill="#d97706" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="smr-chart-card"><CardHeader><CardTitle className="text-sm">Efficiency vs Power (Batch View)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), eff: r.efficiency, power: r.powerMW }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="eff" stroke="#d97706" strokeWidth={2} name="Eff%" /><Line type="monotone" dataKey="power" stroke="#9a3412" strokeWidth={2} name="MW" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="smr-chart-card"><CardHeader><CardTitle className="text-sm">Design Life by Reactor Type (Years)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={Array.from(new Map(records.map((r) => [r.reactorType.split(' ')[0], Math.max(...records.filter((x) => x.reactorType.split(' ')[0] === r.reactorType.split(' ')[0]).map((x) => x.designLifeYrs))])).entries()).map(([name, life]) => ({ name, life }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="life" fill="#059669" radius={[4,4,0,0]} name="Years" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="smr-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="smr-insight-card border-l-4 border-l-orange-700"><CardHeader><CardTitle className="text-sm text-orange-800">BARC 50MW PWR Integral SMR: Reliance Refinery CHP</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">BARC Mumbai delivered 50MW PWR integral SMR (SMR-0001) for Reliance Jamnagar refinery combined heat and power — replacing 4 gas turbines saving 120,000 tonnes CO2/year. PWR integral design eliminates primary coolant piping, enhancing passive safety with natural circulation. Enriched uranium fuel at 4.95% U-235 from IGC Narwapura. 60-year design life with 18-month refueling cycle. BARC indigenously developed the 17x17 fuel assembly with zirconium alloy cladding — first Indian SMR-grade fuel bundle. Cost: \u20b925Cr/MW installed vs \u20b940Cr/MW for imported NuScale equivalent. NPCIL targeting 50 PWR integral SMRs across industrial corridors by 2040 under Atmanirbhar Nuclear mission.</p></CardContent></Card>
          <Card className="smr-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Shipments: SMR-0005 and SMR-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">SMR-0005 (BHEL Hyderabad to Reliance Jamnagar, 18-day delay): 200MW HTGR prismatic block reactor for thermochemical hydrogen production using iodine-sulfur cycle at 850C. Delay caused by HTR fuel pebble qualification — TRISO-coated UO2 particles from BARC failed 2nd irradiation cycle at 1200C. New fuel batch from NFC Hyderabad passed QA on July 28. IS cycle efficiency target 48% vs 30% for PEM electrolysis. SMR-0012 (PRL Ahmedabad to SDSC Sriharikota, 20-day delay): 5MW lead-bismuth cooled fast neutron reactor for ISRO lunar surface power — AERB safety review pending for space-rated containment. Nuclear liability insurance under CLND Act requiring additional \u20b950Cr coverage. ISRO planning to ship via INS Vikramaditya naval escort.</p></CardContent></Card>
          <Card className="smr-insight-card border-l-4 border-l-emerald-600"><CardHeader><CardTitle className="text-sm text-emerald-700">Tata Steel 150MW HTR: Green Steel Revolution</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Tata Steel Jamshedpur commissioned 150MW HTGR pebble bed reactor (SMR-0009) for Kalinganagar steel plant direct reduced iron process — replacing 3 blast furnaces consuming 4.5 million tonnes coal/year. HTR provides 950C process heat via helium primary loop and intermediate salt heat exchanger. Direct reduced iron quality superior to coal-based DRI — carbon content below 2% enabling EAF steelmaking at lower cost. Tata Steel targeting net-zero steel by 2035 — SMR contribution 60% of thermal energy. Government green steel procurement mandate for infrastructure projects from 2028. India steel sector SMR opportunity: \u20b935,000Cr by 2040 across 12 major steel plants.</p></CardContent></Card>
          <Card className="smr-insight-card border-l-4 border-l-cyan-600"><CardHeader><CardTitle className="text-sm text-cyan-700">MDL 35MW MSR: Nuclear Merchant Shipping</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Mazagon Dock Shipyard Vizag built 35MW molten salt reactor (SMR-0010) for Shipping Corporation of India container vessel — India&apos;s first nuclear-powered merchant ship. MSR uses FLiBe molten salt as both fuel carrier and primary coolant, operating at 700C with passive drain tank safety. 20-year refueling interval eliminates port fuel bunkering — saving \u20b9180Cr in lifetime fuel cost per vessel. CO2 reduction: 500,000 tonnes over vessel lifetime. Bhabha Atomic Research Centre developed thorium-based FLiBe fuel cycle — utilizing India&apos;s 846,000 tonnes monazite thorium reserves. Shipping Ministry nuclear propulsion framework expected by 2027 — 10 nuclear merchant vessels planned by 2035 covering Mumbai-Singapore, Chennai-Colombo, and Kandla-Dubai routes.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
