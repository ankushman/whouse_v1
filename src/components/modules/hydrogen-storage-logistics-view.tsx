'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface H2SRecord {
  id: string;
  batchNo: string;
  storageType: string;
  material: string;
  application: string;
  capacityKg: number;
  pressure: number;
  operatingTemp: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: H2SRecord[] = [
  { id: 'H2S-0001', batchNo: 'H2S-T2401', storageType: 'Compressed Gas (Type IV)', material: 'Carbon Fiber Composite', application: 'FC Bus Refueling Station', capacityKg: 2500, pressure: 700, operatingTemp: 25, status: 'In Transit', priority: 'Critical', origin: 'Gurgaon (Hexagon Purus)', destination: 'Delhi IGI FC Hub', shipDate: '2026-07-20', transitDays: 1, zone: 'North', remarks: '2,500 kg Type IV CFRP tanks at 700bar for Delhi airport hydrogen refueling station serving Tata FC bus fleet' },
  { id: 'H2S-0002', batchNo: 'H2S-T2402', storageType: 'Liquid H2 (Cryogenic)', material: 'Stainless Steel 304L', application: 'Space Launch Vehicle Fuel', capacityKg: 18000, pressure: 1, operatingTemp: -253, status: 'Delivered', priority: 'Critical', origin: 'Mahendragiri (ISRO/LPSC)', destination: 'Sriharikota (SDSC SHAR)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: '18,000 kg liquid H2 cryo tank for GSLV Mk-III LVM3 upper stage cryogenic LH2 propellant at SDSC' },
  { id: 'H2S-0003', batchNo: 'H2S-T2403', storageType: 'Metal Hydride (MgH2)', material: 'Magnesium Alloy Canister', application: 'Rural Off-Grid Power', capacityKg: 500, pressure: 5, operatingTemp: 300, status: 'Processing', priority: 'High', origin: 'Hyderabad (CSIR-IMMT)', destination: 'Karimnagar (Tata FC Micro)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: '500 kg MgH2 metal hydride canisters for Tata Power FC microgrid Karimnagar off-grid village electrification' },
  { id: 'H2S-0004', batchNo: 'H2S-T2404', storageType: 'Underground Salt Cavern', material: 'Solution Mined Salt', application: 'Grid Balancing Reservoir', capacityKg: 500000, pressure: 120, operatingTemp: 35, status: 'In Transit', priority: 'Critical', origin: 'Kutch (Adani Cavern)', destination: 'Gandhinagar (GSECL)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: '500 tonnes underground salt cavern H2 storage at 120bar for GSECL grid-scale energy balancing 200MW equivalent' },
  { id: 'H2S-0005', batchNo: 'H2S-T2405', storageType: 'Compressed Gas (Type III)', material: 'Aluminum-Lined Composite', application: 'FC Forklift Fleet Warehouse', capacityKg: 800, pressure: 350, operatingTemp: 25, status: 'Delayed', priority: 'Medium', origin: 'Pune (Faurecia Exa)', destination: 'Mumbai (Reliance WMS)', shipDate: '2026-07-12', transitDays: 12, zone: 'West', remarks: '800 kg Type III Al-lined composite tanks for Reliance Jio warehouse FC forklift fleet — composite cure defect delay' },
  { id: 'H2S-0006', batchNo: 'H2S-T2406', storageType: 'Liquid H2 (Cryogenic)', material: 'Inner Lindar Aluminum', application: 'Marine Vessel LH2 Bunker', capacityKg: 12000, pressure: 3, operatingTemp: -253, status: 'Delivered', priority: 'Critical', origin: 'Kochi (Linde India)', destination: 'Tuticorin Port (SCI)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: '12,000 kg LH2 cryo bunker tank for SCI Tuticorin green ammonia production and H2 ship-to-ship bunkering' },
  { id: 'H2S-0007', batchNo: 'H2S-T2407', storageType: 'Metal Hydride (LaNi5)', material: 'Lanthanum-Nickel Alloy', application: 'Defense Electronics Cooling', capacityKg: 200, pressure: 8, operatingTemp: 80, status: 'In Transit', priority: 'High', origin: 'Mumbai (BARC Hydride)', destination: 'Bengaluru (DRDO-LRDE)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: '200 kg LaNi5 metal hydride for DRDO phased-array radar H2 cooling system replacing liquid nitrogen' },
  { id: 'H2S-0008', batchNo: 'H2S-T2408', storageType: 'Compressed Gas (Type IV)', material: 'Carbon Fiber HDPE Liner', application: 'Automotive FC Vehicle Tank', capacityKg: 5000, pressure: 700, operatingTemp: 25, status: 'Delivered', priority: 'High', origin: 'Chennai (Toyota Tsusho)', destination: 'Bengaluru (Toyota FC Plant)', shipDate: '2026-07-15', transitDays: 1, zone: 'South', remarks: '5,000 kg Type IV automotive-grade tanks for Toyota FC Mirai assembly Bengaluru — 700bar 5kg/tank range 650km' },
  { id: 'H2S-0009', batchNo: 'H2S-T2409', storageType: 'Underground Lined Rock Cavern', material: 'Concrete + HDPE Membrane', application: 'Industrial H2 Buffer', capacityKg: 200000, pressure: 45, operatingTemp: 30, status: 'Processing', priority: 'Critical', origin: 'Vizag (SAIL LRC)', destination: 'Ranchi (JSW Steel)', shipDate: '2026-07-24', transitDays: 3, zone: 'East', remarks: '200 tonnes lined rock cavern at 45bar for JSW Ranchi DRI plant H2 buffer — 48hr supply backup' },
  { id: 'H2S-0010', batchNo: 'H2S-T2410', storageType: 'Liquid Organic H2 Carrier', material: 'Toluene/MCH System', application: 'Cross-Country H2 Transport', capacityKg: 8000, pressure: 2, operatingTemp: 180, status: 'In Transit', priority: 'High', origin: 'Mumbai (Chiyoda LOHC)', destination: 'Kolkata (Exxon LOHC)', shipDate: '2026-07-22', transitDays: 3, zone: 'East', remarks: '8,000 kg Methylcyclohexane LOHC system for Mumbai-Kolkata ambient-temperature H2 transport — dehydrogenation Kolkata' },
  { id: 'H2S-0011', batchNo: 'H2S-T2411', storageType: 'Compressed Gas (Type I Steel)', material: 'Seamless Steel SA-516', application: 'Industrial Process H2', capacityKg: 15000, pressure: 200, operatingTemp: 40, status: 'Delivered', priority: 'Medium', origin: 'Jamshedpur (Tata Steel Cyl)', destination: 'Rourkela (SAIL Refinery)', shipDate: '2026-07-17', transitDays: 2, zone: 'East', remarks: '15,000 kg steel Type I cylinders at 200bar for SAIL Rourkela refinery hydrocracking unit H2 supply' },
  { id: 'H2S-0012', batchNo: 'H2S-T2412', storageType: 'Metal Hydride (TiFe)', material: 'Iron-Titanium Alloy', application: 'Telecom Tower Backup', capacityKg: 150, pressure: 10, operatingTemp: 50, status: 'Delayed', priority: 'Low', origin: 'Noida (BHEL Hydride)', destination: 'Lucknow (Airtel Tower)', shipDate: '2026-07-10', transitDays: 18, zone: 'North', remarks: '150 kg TiFe hydride for Airtel telecom tower FC backup — alloy powder sintering defect delayed production 18 days' },
  { id: 'H2S-0013', batchNo: 'H2S-T2413', storageType: 'Compressed Gas (Type IV)', material: 'Glass Fiber HDPE Liner', application: 'Hospital FC Backup Power', capacityKg: 300, pressure: 450, operatingTemp: 25, status: 'In Transit', priority: 'Medium', origin: 'Ahmedabad (Plug Power India)', destination: 'Jaipur (Apollo Hospital)', shipDate: '2026-07-20', transitDays: 1, zone: 'North', remarks: '300 kg Type IV GF/HDPE tanks at 450bar for Apollo Jaipur hospital 200kW PEM FC backup power system' },
  { id: 'H2S-0014', batchNo: 'H2S-T2414', storageType: 'Chemical H2 Storage (Ammonia)', material: 'Pressurized NH3 Tank', application: 'Remote Mining Power', capacityKg: 25000, pressure: 15, operatingTemp: 25, status: 'Processing', priority: 'Critical', origin: 'Jamnagar (Reliance NH3)', destination: 'Jharkhand (Coal India Mine)', shipDate: '2026-07-25', transitDays: 5, zone: 'East', remarks: '25,000 kg NH3 chemical H2 storage for Coal India Jharkhand open-pit mine 5MW FC power — NH3 cracking on-site' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Storage Type', key: 'storageType', options: [
    { value: 'Compressed Gas (Type IV)', count: 4 }, { value: 'Liquid H2 (Cryogenic)', count: 2 }, { value: 'Metal Hydride (MgH2)', count: 1 }, { value: 'Underground Salt Cavern', count: 1 },
  ]},
  { label: 'Application', key: 'application', options: [
    { value: 'FC Bus Refueling Station', count: 1 }, { value: 'Space Launch Vehicle Fuel', count: 1 }, { value: 'Grid Balancing Reservoir', count: 1 }, { value: 'Automotive FC Vehicle Tank', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 5 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 4 }, { value: 'North', count: 3 }, { value: 'West', count: 3 }, { value: 'East', count: 4 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Shipments', value: 14, sub: 'H2 Storage Systems', color: 'text-violet-800' },
  { title: 'Total Capacity', value: '861.6 tonnes', sub: 'All Storage Types', color: 'text-purple-700' },
  { title: 'Highest Pressure', value: '700 bar', sub: 'Type IV CGH2', color: 'text-fuchsia-700' },
  { title: 'National Target', value: '\u20b918,000Cr', sub: 'National H2 Storage Mission', color: 'text-indigo-700' },
];

export default function HydrogenStorageLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.storageType} ${r.material} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof H2SRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const key = r.storageType.split('(')[0].trim(); map.set(key, (map.get(key) || 0) + r.capacityKg); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, capacityKg]) => ({ name: name.slice(0, 16), capacityKg: Math.round(capacityKg / 1000) }));
  }, []);

  const materialDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.material.split(' ').slice(0, 2).join(' '); map.set(s, (map.get(s) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const prodTrend = useMemo(() => [
    { year: '2022', ton: 50 }, { year: '2023', ton: 200 }, { year: '2024', ton: 800 }, { year: '2025', ton: 2500 }, { year: '2026', ton: 6000 }, { year: '2027', ton: 15000 }, { year: '2028', ton: 35000 },
  ], []);

  const pressureData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), pressure: r.pressure }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const capacityByApp = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application, (map.get(r.application) || 0) + r.capacityKg); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, capacityKg]) => ({ name: name.slice(0, 16), capacityKg: Math.round(capacityKg / 1000) }));
  }, []);

  const COLORS = ['#7c3aed', '#8b5cf6', '#6d28d9', '#5b21b6', '#4c1d95'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="hs2-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'H2 Infrastructure' }, { label: 'H2 Storage' }]} />
      <PageHeader title="Hydrogen Storage Logistics" description="Indian hydrogen storage and distribution &#8212; compressed gas Type I/III/IV, liquid H2 cryogenic, metal hydride MgH2/LaNi5/TiFe, underground salt cavern, lined rock cavern, LOHC toluene/MCH, and ammonia chemical storage for mobility, grid, defense, space, and industrial sectors" />

      <div className="hs2-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="hs2-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="hs2-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`hs2-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-violet-700 text-violet-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="hs2-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="hs2-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Storage Type (tonnes)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityKg" fill="#7c3aed" radius={[4,4,0,0]} name="tonnes" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="hs2-chart-card"><CardHeader><CardTitle className="text-sm">Storage Material Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={materialDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#7c3aed" /><Cell fill="#8b5cf6" /><Cell fill="#6d28d9" /><Cell fill="#5b21b6" /><Cell fill="#4c1d95" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="hs2-chart-card"><CardHeader><CardTitle className="text-sm">H2 Storage Market Growth (tonnes/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={prodTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="ton" stroke="#8b5cf6" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="hs2-chart-card"><CardHeader><CardTitle className="text-sm">Pressure (bar) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={pressureData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="pressure" fill="#6d28d9" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="hs2-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Storage Type</th><th className="px-2 py-2 text-left">Material</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">kg</th><th className="px-2 py-2 text-right">bar</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`hs2-table-row border-b hover:bg-violet-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.storageType.split('(')[0].trim()}</td>
                  <td className="px-2 py-2 text-xs">{r.material.split(' ').slice(0, 2).join(' ')}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacityKg >= 1000 ? `${(r.capacityKg/1000).toFixed(0)}K` : r.capacityKg}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.pressure}</td>
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
        <div className="hs2-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="hs2-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#7c3aed" /><Cell fill="#8b5cf6" /><Cell fill="#6d28d9" /><Cell fill="#5b21b6" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="hs2-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Application (tonnes)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByApp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityKg" fill="#7c3aed" radius={[4,4,0,0]} name="tonnes" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="hs2-chart-card"><CardHeader><CardTitle className="text-sm">Pressure vs Capacity</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), bar: Math.min(r.pressure, 800), ton: Math.round(r.capacityKg / 1000) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="bar" stroke="#7c3aed" strokeWidth={2} name="bar" /><Line type="monotone" dataKey="ton" stroke="#8b5cf6" strokeWidth={2} name="tonnes" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="hs2-chart-card"><CardHeader><CardTitle className="text-sm">Temperature Range by Storage Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={Array.from(new Map(records.map((r) => [r.storageType.split('(')[0].trim().slice(0, 12), { name: r.storageType.split('(')[0].trim().slice(0, 12), temp: r.operatingTemp }])).entries()).map(([, v]) => ({ name: v.name, temp: v.temp }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="temp" fill="#6d28d9" radius={[4,4,0,0]} name="Temp C" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="hs2-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hs2-insight-card border-l-4 border-l-violet-700"><CardHeader><CardTitle className="text-sm text-violet-800">India H2 Storage Mission: 35,000 Tonnes/Year by 2028</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s National Hydrogen Storage Mission targeting 35,000 tonnes annual H2 storage capacity by 2028, covering compressed gas, liquid H2, metal hydride, and underground storage across the value chain. Phase-1 (2024-2026): 500 tonnes CGH2 Type IV tank manufacturing at Hexagon Purus Gurgaon and Toyota Tsusho Chennai for automotive FC vehicles (H2S-0001, H2S-0008) &#8214; India targeting 1 million FC vehicles by 2030 requiring 700bar Type IV tanks at &#8377;3.5 lakh/tank cost reduction from current &#8377;8 lakh. Phase-2 (2026-2028): Underground salt cavern storage in Kutch-Gujarat and Rajasthan basins for grid-scale energy storage (H2S-0004) &#8214; Adani Kutch developing 500-tonne capacity salt cavern at 120bar for GSECL 200MW grid balancing, equivalent to 4 GWh electrical storage at 60% round-trip efficiency. BARC developing high-density MgH2 metal hydride storage at 6.5 wt% H2 capacity for rural distributed storage (H2S-0003). Total investment: &#8377;18,000Cr including manufacturing, cavern development, and safety infrastructure.</p></CardContent></Card>
          <Card className="hs2-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Shipments: H2S-0005 and H2S-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">H2S-0005 (Pune Faurecia to Mumbai Reliance, 12-day delay): 800 kg Type III aluminum-lined composite tanks for Reliance Jio warehouse FC forklift fleet &#8214; composite overwrap cure cycle defect detected during burst pressure test at 525bar (target 525bar minimum). Faurecia Exa Pune investigating carbon fiber prepreg layup inconsistency in dome section, requiring 3 additional cure cycles and re-testing per ISO 11119-3. Reliance warehouse FC forklift fleet deployment delayed from 25 units to 15 units with remaining steel cylinder interim. H2S-0012 (Noida BHEL to Lucknow Airtel, 18-day delay): 150 kg TiFe metal hydride canisters for Airtel telecom tower fuel cell backup &#8214; titanium-iron alloy powder sintering at 800C showed hydrogen capacity degradation from 1.8 wt% to 1.2 wt% after 50 charge cycles, failing Airtel minimum 1.5 wt% specification. BHEL investigating iron oxide contamination in TiFe powder batch from supplier Indian Rare Earths subsidiary. Replacement batch ordered with 99.99% purity Fe from Mishra Dhatu Nigam (MIDHANI).</p></CardContent></Card>
          <Card className="hs2-insight-card border-l-4 border-l-indigo-600"><CardHeader><CardTitle className="text-sm text-indigo-700">ISRO Cryogenic LH2: Space Launch Fuel Storage</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">ISRO LPSC Mahendragiri manufacturing liquid hydrogen (LH2) cryogenic storage tanks (H2S-0002) for GSLV Mk-III LVM3 upper stage &#8214; 18,000 kg capacity double-walled stainless steel 304L inner vessel with multilayer vacuum insulation maintaining -253C for 48-hour hold time. LH2 density at 71 kg/m3 requires 254 m3 tank volume, 40% larger than equivalent LOX due to ultra-low density. ISRO also supplying 12,000 kg LH2 cryo bunker tank (H2S-0006) via Linde India Kochi for SCI Tuticorin green ammonia production and maritime LH2 bunkering. India&apos;s space program consuming 200 tonnes LH2 annually for 4-6 LVM3 launches, with Gaganyaan human-rated program requiring 600 tonnes LH2 for 2 uncrewed + 1 crewed missions. LPSC developing next-generation 35,000 kg super-critical LH2 tank for NGLV Next-Gen Launch Vehicle at &#8377;2,800Cr. Cryogenic boil-off management: zero-loss helium Brayton refrigeration system maintains sub-atmospheric boil-off pressure. India targeting 80% domestic LH2 production by 2028 through BARC and IGCAR electrolyzer-to-liquefier integration.</p></CardContent></Card>
          <Card className="hs2-insight-card border-l-4 border-l-purple-600"><CardHeader><CardTitle className="text-sm text-purple-700">LOHC Transport: Mumbai-Kolkata Ambient H2 Shipping</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Chiyoda Corporation SPRE Hydrogen toluene/MCH (methylcyclohexane) Liquid Organic Hydrogen Carrier system (H2S-0010) enabling ambient-temperature hydrogen transport from Mumbai to Kolkata &#8214; 8,000 kg H2 stored as MCH liquid at room temperature 2bar pressure. Hydrogenation at Mumbai terminal: toluene + 3H2 &#8594; methylcyclohexane at 200C 30bar over Pt/Al2O3 catalyst. MCH transported by conventional chemical tanker truck (no special cryogenic handling). Dehydrogenation at Kolkata Exxon terminal: MCH &#8594; toluene + 3H2 at 300C over Pt catalyst, 95% H2 recovery at 65% thermal efficiency. LOHC advantage: 1000km transport at ambient conditions vs LH2 requiring -253C cryogenic chain. Toluene recycled back to Mumbai in closed loop. Cost: &#8377;280/kg H2 transport vs &#8377;450/kg for LH2 truck and &#8377;180/kg for 70bar CGH2 pipeline over same distance. India targeting 10 LOHC routes connecting Gujarat-Haryana green H2 hubs to eastern industrial demand centers by 2028. Chiyoda India developing Brindavan LOHC terminal at Ennore Port Chennai for Japan-India green hydrogen maritime corridor.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
