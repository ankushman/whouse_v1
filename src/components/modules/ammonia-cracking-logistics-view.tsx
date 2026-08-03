'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface AMCRecord {
  id: string;
  batchNo: string;
  crackerType: string;
  catalyst: string;
  application: string;
  capacityTPD: number;
  conversionRate: number;
  h2Purity: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: AMCRecord[] = [
  { id: 'AMC-0001', batchNo: 'AMC-B2401', crackerType: 'Autothermal Cracking', catalyst: 'Ni-Al2O3', application: 'H2 Refueling Station', capacityTPD: 120, conversionRate: 98, h2Purity: 99.999, status: 'In Transit', priority: 'Critical', origin: 'Gandhinagar (Reliance Cracker)', destination: 'Delhi (IOCL H2 Station)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'Reliance autothermal NH3 cracker 120TPD for Delhi IOCL H2 station' },
  { id: 'AMC-0002', batchNo: 'AMC-B2402', crackerType: 'Membrane Reactor', catalyst: 'Ru-Cs-MgO', application: 'Fuel Cell Vehicle Fleet', capacityTPD: 50, conversionRate: 99, h2Purity: 99.9999, status: 'Delivered', priority: 'High', origin: 'Bengaluru (IISc Membrane)', destination: 'Hyderabad (Ola FC Fleet)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'IISc Ru-Cs membrane reactor ultra-pure H2 for Ola FC taxi fleet' },
  { id: 'AMC-0003', batchNo: 'AMC-B2403', crackerType: 'Thermal Cracking', catalyst: 'Fe-Cr Alloy', application: 'Industrial Heat', capacityTPD: 200, conversionRate: 95, h2Purity: 99.99, status: 'Processing', priority: 'Critical', origin: 'Mumbai (L&amp;T Hydrogen)', destination: 'Jamnagar (Reliance Refinery)', shipDate: '2026-07-23', transitDays: 2, zone: 'West', remarks: 'L&amp;T thermal cracker for Reliance refinery green H2 supply' },
  { id: 'AMC-0004', batchNo: 'AMC-B2404', crackerType: 'Plasma Cracking', catalyst: 'Non-Catalytic', application: 'Power Generation', capacityTPD: 80, conversionRate: 96, h2Purity: 99.99, status: 'In Transit', priority: 'High', origin: 'Pune (BHEL Plasma)', destination: 'Nagpur (MAHAGENCO Gas)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: 'BHEL plasma arc NH3 cracker for gas turbine power generation' },
  { id: 'AMC-0005', batchNo: 'AMC-B2405', crackerType: 'Electrochemical Cracking', catalyst: 'Solid Oxide Electrolyte', application: 'Steel DRI Plant', capacityTPD: 300, conversionRate: 97, h2Purity: 99.99, status: 'Delayed', priority: 'Critical', origin: 'Jamshedpur (Tata Steel Cracker)', destination: 'Kalinganagar (Tata Steel DRI)', shipDate: '2026-07-12', transitDays: 12, zone: 'East', remarks: 'Tata electrochemical SOE NH3 cracker for DRI plant green steel H2' },
  { id: 'AMC-0006', batchNo: 'AMC-B2406', crackerType: 'Autothermal Cracking', catalyst: 'Ni-CeO2', application: 'Fertilizer Plant', capacityTPD: 150, conversionRate: 98, h2Purity: 99.99, status: 'Delivered', priority: 'Medium', origin: 'Sindri (IFFCO Cracker)', destination: 'Gorakhpur (IFFCO Urea)', shipDate: '2026-07-16', transitDays: 3, zone: 'East', remarks: 'IFFCO NH3 cracker for green urea production 99.99% H2' },
  { id: 'AMC-0007', batchNo: 'AMC-B2407', crackerType: 'Membrane Reactor', catalyst: 'Pd-Ag Alloy', application: 'Shipping Bunker', capacityTPD: 100, conversionRate: 99, h2Purity: 99.9999, status: 'In Transit', priority: 'High', origin: 'Chennai (BHEL Membrane)', destination: 'Tuticorin Port (SCI Vessel)', shipDate: '2026-07-21', transitDays: 2, zone: 'South', remarks: 'BHEL Pd-Ag membrane NH3 cracker for SCI vessel onboard H2 fuel' },
  { id: 'AMC-0008', batchNo: 'AMC-B2408', crackerType: 'Thermal Cracking', catalyst: 'Co-Mo Alloy', application: 'Petrochemical Feed', capacityTPD: 250, conversionRate: 94, h2Purity: 99.95, status: 'Delivered', priority: 'High', origin: 'Vadodara (IOC Aromatics)', destination: 'Baroda (Reliance Polyprop)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'IOCL thermal cracker for polypropylene synthesis H2 feedstock' },
  { id: 'AMC-0009', batchNo: 'AMC-B2409', crackerType: 'Plasma Cracking', catalyst: 'Non-Catalytic', application: 'Mining Truck Fleet', capacityTPD: 60, conversionRate: 96, h2Purity: 99.99, status: 'Processing', priority: 'Medium', origin: 'Dhanbad (BEML Cracker)', destination: 'Jharia (CIL Mining)', shipDate: '2026-07-24', transitDays: 1, zone: 'East', remarks: 'BEML plasma cracker for mining dump truck FC H2 supply' },
  { id: 'AMC-0010', batchNo: 'AMC-B2410', crackerType: 'Autothermal Cracking', catalyst: 'Ni-Ru/Al2O3', application: 'Railway Locomotive', capacityTPD: 90, conversionRate: 98, h2Purity: 99.999, status: 'In Transit', priority: 'High', origin: 'Chennai (RCF Railways)', destination: 'Varanasi (NER Railways)', shipDate: '2026-07-22', transitDays: 3, zone: 'South', remarks: 'RCF autothermal cracker for Vande Bharat FC hybrid locomotive' },
  { id: 'AMC-0011', batchNo: 'AMC-B2411', crackerType: 'Electrochemical Cracking', catalyst: 'Proton Conductor', application: 'Data Center UPS', capacityTPD: 40, conversionRate: 97, h2Purity: 99.999, status: 'Delivered', priority: 'Low', origin: 'Hyderabad (TCS Innovation)', destination: 'Chennai (Azure DC)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'TCS proton conductor electrochemical cracker for DC FC backup' },
  { id: 'AMC-0012', batchNo: 'AMC-B2412', crackerType: 'Thermal Cracking', catalyst: 'Fe-Based', application: 'Cement Kiln', capacityTPD: 350, conversionRate: 95, h2Purity: 99.95, status: 'Delayed', priority: 'Critical', origin: 'Mumbai (Thermax Cracker)', destination: 'Kolkata (ACC Cement)', shipDate: '2026-07-10', transitDays: 15, zone: 'West', remarks: 'Thermax thermal cracker for ACC cement kiln green H2 combustion' },
  { id: 'AMC-0013', batchNo: 'AMC-B2413', crackerType: 'Membrane Reactor', catalyst: 'Ni-Ceramic', application: 'H2 Refueling Station', capacityTPD: 70, conversionRate: 99, h2Purity: 99.9999, status: 'In Transit', priority: 'Medium', origin: 'Bengaluru (KPIT Fuel Cell)', destination: 'Mysuru (NTPC H2 Hub)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: 'KPIT ceramic membrane cracker for Karnataka H2 highway corridor' },
  { id: 'AMC-0014', batchNo: 'AMC-B2414', crackerType: 'Autothermal Cracking', catalyst: 'Ni-La2O3', application: 'Glass Manufacturing', capacityTPD: 180, conversionRate: 97, h2Purity: 99.99, status: 'Processing', priority: 'Medium', origin: 'Kolkata (SAIL Glass Unit)', destination: 'Ranchi (Asahi Glass)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'SAIL autothermal cracker for float glass manufacturing green H2' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Cracker Type', key: 'crackerType', options: [
    { value: 'Autothermal Cracking', count: 4 }, { value: 'Membrane Reactor', count: 3 }, { value: 'Thermal Cracking', count: 3 }, { value: 'Plasma Cracking', count: 2 },
  ]},
  { label: 'Application', key: 'application', options: [
    { value: 'H2 Refueling Station', count: 2 }, { value: 'Fuel Cell Vehicle Fleet', count: 1 }, { value: 'Industrial Heat', count: 1 }, { value: 'Steel DRI Plant', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 5 }, { value: 'South', count: 5 }, { value: 'East', count: 4 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Crackers', value: 14, sub: 'NH3 to H2 Units', color: 'text-rose-800' },
  { title: 'Combined Output', value: '2,040 TPD', sub: 'Green H2 from NH3', color: 'text-pink-700' },
  { title: 'Avg Conversion', value: '97.2%', sub: 'Membrane 99% Peak', color: 'text-fuchsia-700' },
  { title: 'National Target', value: '\u20b98,500Cr', sub: 'NH3 H2 Hub Mission', color: 'text-red-700' },
];

export default function AmmoniaCrackingLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.crackerType} ${r.catalyst} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof AMCRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.crackerType.split(' ')[0], (map.get(r.crackerType.split(' ')[0]) || 0) + r.capacityTPD); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).map(([name, capacityTPD]) => ({ name, capacityTPD }));
  }, []);

  const catalystDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.catalyst, (map.get(r.catalyst) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const prodTrend = useMemo(() => [
    { year: '2022', tpd: 50 }, { year: '2023', tpd: 150 }, { year: '2024', tpd: 400 }, { year: '2025', tpd: 900 }, { year: '2026', tpd: 1500 }, { year: '2027', tpd: 2500 }, { year: '2028', tpd: 4000 },
  ], []);

  const convData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), conv: r.conversionRate }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const purityByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.crackerType.split(' ')[0], (map.get(r.crackerType.split(' ')[0]) || 0) + r.h2Purity); });
    return Array.from(map.entries()).map(([name, purity]) => ({ name, purity: Math.round(purity / records.filter((r) => r.crackerType.split(' ')[0] === name).length * 10) / 10 }));
  }, []);

  const COLORS = ['#be123c', '#e11d48', '#9333ea', '#db2777', '#0f766e'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="amc-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Green Hydrogen' }, { label: 'Ammonia Cracking' }]} />
      <PageHeader title="Ammonia Cracking Logistics" description="Indian NH3-to-H2 supply chain \u2014 autothermal, membrane reactor, thermal, plasma, electrochemical cracking for refueling, mobility, steel, cement, shipping, and power generation" />

      <div className="amc-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="amc-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="amc-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`amc-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-rose-700 text-rose-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="amc-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="amc-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Cracker Type (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityTPD" fill="#be123c" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="amc-chart-card"><CardHeader><CardTitle className="text-sm">Catalyst Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={catalystDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#be123c" /><Cell fill="#e11d48" /><Cell fill="#9333ea" /><Cell fill="#db2777" /><Cell fill="#0f766e" /><Cell fill="#059669" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="amc-chart-card"><CardHeader><CardTitle className="text-sm">India NH3 Cracking Growth (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={prodTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="tpd" stroke="#e11d48" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="amc-chart-card"><CardHeader><CardTitle className="text-sm">Conversion Rate by Batch (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={convData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis domain={[90, 100]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="conv" fill="#9333ea" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="amc-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-left">Catalyst</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">TPD</th><th className="px-2 py-2 text-right">Conv%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`amc-table-row border-b hover:bg-rose-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.crackerType}</td>
                  <td className="px-2 py-2 text-xs">{r.catalyst}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacityTPD}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.conversionRate}</td>
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
        <div className="amc-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="amc-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#be123c" /><Cell fill="#e11d48" /><Cell fill="#0f766e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="amc-chart-card"><CardHeader><CardTitle className="text-sm">H2 Purity by Cracker Type (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={purityByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis domain={[99.9, 100]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="purity" fill="#db2777" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="amc-chart-card"><CardHeader><CardTitle className="text-sm">Conversion vs Capacity (Batch)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), conv: r.conversionRate, cap: r.capacityTPD }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="conv" stroke="#e11d48" strokeWidth={2} name="Conv%" /><Line type="monotone" dataKey="cap" stroke="#9333ea" strokeWidth={2} name="TPD" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="amc-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Application (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={Array.from(new Map(records.map((r) => [r.application, records.filter((x) => x.application === r.application).reduce((s, x) => s + x.capacityTPD, 0)])).entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, capacityTPD]) => ({ name: name.slice(0, 16), capacityTPD }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityTPD" fill="#be123c" radius={[4,4,0,0]} name="TPD" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="amc-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="amc-insight-card border-l-4 border-l-rose-700"><CardHeader><CardTitle className="text-sm text-rose-800">Reliance Gandhinagar: India&apos;s Largest NH3 Cracker</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Reliance Industries commissioned 120TPD autothermal ammonia cracking plant (AMC-0001) at Jamnagar using Ni-Al2O3 catalyst developed in-house at Reliance Technology Center. Plant receives green ammonia from Reliance Hazira green methanol-derived ammonia pipeline and cracks it at 850C producing 99.999% pure H2 for IOCL Delhi H2 refueling station network. Autothermal process combines partial oxidation with catalytic cracking achieving 98% single-pass conversion without external heat input. Reliance targeting 500TPD NH3 cracking capacity by 2028 for pan-India H2 highway corridor connecting Delhi-Mumbai-Jaipur-Ahmedabad. Ammonia as H2 carrier offers 3x volumetric energy density vs compressed H2 — enabling cost-effective long-distance transport from Gujarat production hub to North Indian demand centers. Cost: \u20b9280/kg H2 at dispensed vs \u20b9450/kg from electrolytic H2 at station.</p></CardContent></Card>
          <Card className="amc-insight-card border-l-4 border-l-purple-600"><CardHeader><CardTitle className="text-sm text-purple-700">IISc Membrane Reactor: Ultra-Pure H2 Breakthrough</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">IISc Bengaluru developed Ru-Cs-MgO catalytic membrane reactor (AMC-0002) achieving 99.9999% H2 purity — the highest purity ever from ammonia cracking in India. Pd-Ag alloy membrane selectively permeates H2 at 500C while retaining unreacted NH3 and N2 for recycle loop. 50TPD unit supplies Ola FC taxi fleet in Hyderabad with PEM-grade H2 requiring no post-purification. IISc catalysis department achieved 100,000-hour membrane stability — 3x better than commercial Palladium membranes imported from Japan. Technology licensed to KPIT Technologies for mass production. Ola planning 1,000 FC taxis across 5 cities by 2028 using distributed NH3 cracking hubs. Each hub services 200 vehicles within 50km radius. Total IISc NH3 cracking programme: \u20b9850Cr DST grant for nationwide deployment at 50 highway locations.</p></CardContent></Card>
          <Card className="amc-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Shipments: AMC-0005 and AMC-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">AMC-0005 (Tata Jamshedpur to Kalinganagar, 12-day delay): 300TPD electrochemical solid oxide NH3 cracker for Tata Steel DRI plant green hydrogen — solid oxide electrolyte stack damaged during rail transport on Howrah-Chennai line. SOE elements cracked due to vibration from poor rail wagon suspension on Jharkhand section. Tata Steel filed insurance claim for \u20b935Cr replacement stack from BHEL. Kalinganagar DRI plant using backup SMR H2 at \u20b9150/kg premium. AMC-0012 (Thermax Mumbai to ACC Kolkata, 15-day delay): 350TPD thermal cracker for ACC cement kiln — monsoon flooding disrupted NH6 near Nagpur forcing 3-day road detour through MP. Fe-Cr catalyst beds intact but thermal insulation panels need resealing after water ingress. ACC cement kiln green H2 combustion delayed — continuing coal firing at \u20b9450/day excess CO2 cost. Thermax dispatching replacement insulation kit via air freight.</p></CardContent></Card>
          <Card className="amc-insight-card border-l-4 border-l-emerald-600"><CardHeader><CardTitle className="text-sm text-emerald-700">BHEL Plasma Arc: Zero-Catalyst NH3 Cracking</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">BHEL Pune deployed 80TPD plasma arc ammonia cracker (AMC-0004) for MAHAGRID Nagpur gas turbine power generation — India&apos;s first non-catalytic NH3 cracking technology. Plasma arc at 5,000C dissociates NH3 into H2 and N2 without catalyst bed, eliminating catalyst degradation and poisoning issues. 96% conversion at 10MW plasma power with 4-year electrode life. Output H2 at 99.99% purity suitable for gas turbine combustion with NOx below 5ppm due to pure H2 flame. MAHAGENCO using cracked H2 for 300MW gas turbine peaking power — replacing natural gas during peak demand. BHEL plasma technology developed jointly with BARC plasma physics division under Make in India advanced manufacturing programme. Export potential: 3 countries in ASEAN expressing interest for island grids. BHEL targeting 200TPD plasma crackers by 2028 for grid-scale H2-from-NH3 power generation across India&apos;s 14 gas turbine power stations.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
