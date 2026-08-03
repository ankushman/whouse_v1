'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface STERecord {
  id: string;
  batchNo: string;
  sludgeSource: string;
  treatmentProcess: string;
  energyOutput: string;
  capacityTPD: number;
  biogasM3: number;
  powerKW: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: STERecord[] = [
  { id: 'STE-0001', batchNo: 'STE-P2401', sludgeSource: 'Municipal STP Sludge', treatmentProcess: 'Anaerobic Digestion + CHP', energyOutput: 'Biogas 65% CH4', capacityTPD: 500, biogasM3: 7500, powerKW: 2500, status: 'In Transit', priority: 'Critical', origin: 'Delhi (DWSSD Okhla)', destination: 'Noida (UP Jal Nigam)', shipDate: '2026-07-20', transitDays: 1, zone: 'North', remarks: '500 TPD Okhla STP sludge anaerobic digester biogas CHP &#8212; 7,500 m3/day biogas 65% CH4 feeding 2.5 MW gas engine for Okhla STP self-powering' },
  { id: 'STE-0002', batchNo: 'STE-P2402', sludgeSource: 'Industrial ETP Sludge', treatmentProcess: 'Incineration + WHRB', energyOutput: 'Steam 12 bar', capacityTPD: 200, biogasM3: 0, powerKW: 800, status: 'Delivered', priority: 'High', origin: 'Tirupur (Dyeing ETP)', destination: 'Erode (TNPCB Cluster)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: '200 TPD textile dyeing ETP sludge incinerator with waste heat recovery boiler &#8212; 12 bar steam for process heating replacing coal boiler' },
  { id: 'STE-0003', batchNo: 'STE-P2403', sludgeSource: 'Municipal STP Sludge', treatmentProcess: 'Gasification + Syngas', energyOutput: 'Syngas 18 MJ/m3', capacityTPD: 300, biogasM3: 0, powerKW: 3500, status: 'Processing', priority: 'High', origin: 'Bengaluru (BBMP KGF)', destination: 'Mysore (KUWSSB)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: '300 TPD BBMP KGF sludge gasification producing syngas 18 MJ/m3 &#8214; 3.5 MW power to grid plus 5 tonnes/day biochar co-product' },
  { id: 'STE-0004', batchNo: 'STE-P2404', sludgeSource: 'Tannery ETP Sludge', treatmentProcess: 'Pyrolysis + Bio-Oil', energyOutput: 'Bio-Oil 28% Yield', capacityTPD: 100, biogasM3: 0, powerKW: 600, status: 'In Transit', priority: 'Critical', origin: 'Kanpur (Unnao Tannery)', destination: 'Agra (UPPCB Treatment)', shipDate: '2026-07-19', transitDays: 1, zone: 'North', remarks: '100 TPD tannery chrome-laden sludge pyrolysis at 500C &#8214; bio-oil recovery 28% yield + char stabilization of Cr(VI) to Cr(III)' },
  { id: 'STE-0005', batchNo: 'STE-P2405', sludgeSource: 'Municipal STP Sludge', treatmentProcess: 'Anaerobic Digestion + FC', energyOutput: 'H2 + Biogas', capacityTPD: 400, biogasM3: 6000, powerKW: 1800, status: 'Delayed', priority: 'Medium', origin: 'Pune (PCMC Nigdi)', destination: 'Nashik (Nashik Munc Corp)', shipDate: '2026-07-12', transitDays: 14, zone: 'West', remarks: '400 TPD PCMC Nigdi sludge AD + fuel cell CHP &#8212; Bloom Energy 200 kW SOFC delay, interim gas engine at 80% capacity' },
  { id: 'STE-0006', batchNo: 'STE-P2406', sludgeSource: 'Pharma ETP Sludge', treatmentProcess: 'Plasma Arc Destruction', energyOutput: 'Vitrified Slag + Syngas', capacityTPD: 50, biogasM3: 0, powerKW: 400, status: 'Delivered', priority: 'High', origin: 'Hyderabad (Dr. Reddy&apos;s ETP)', destination: 'Vizag (Pharma SEZ)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: '50 TPD pharmaceutical ETP sludge plasma arc at 5,000C &#8212; complete organic destruction + syngas 4 MW equivalent thermal' },
  { id: 'STE-0007', batchNo: 'STE-P2407', sludgeSource: 'Municipal STP Sludge', treatmentProcess: 'Semi-Dry AD + Biogas', energyOutput: 'Biogas 58% CH4', capacityTPD: 350, biogasM3: 5200, powerKW: 1600, status: 'In Transit', priority: 'High', origin: 'Kolkata (KMDA Tonga)', destination: 'Howrah (WBPHED)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: '350 TPD Kolkata Tonga STP sludge semi-dry AD &#8214; 5,200 m3/day biogas 1.6 MW CHP covering KMDA 40% STP power demand' },
  { id: 'STE-0008', batchNo: 'STE-P2408', sludgeSource: 'Sugar Mill Effluent', treatmentProcess: 'Methane Recovery + Cogen', energyOutput: 'Bagasse + Biogas Steam', capacityTPD: 250, biogasM3: 4000, powerKW: 2200, status: 'Delivered', priority: 'Medium', origin: 'Kolhapur (Sugar Cogen)', destination: 'Sangli (Maha Sugar)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: '250 TPD sugar mill press mud + effluent biogas co-generation with bagasse boiler &#8212; 2.2 MW export to MSEDCL grid' },
  { id: 'STE-0009', batchNo: 'STE-P2409', sludgeSource: 'Municipal STP Sludge', treatmentProcess: 'AD + Upgraded Biogas (CBG)', energyOutput: 'Compressed BioGas', capacityTPD: 600, biogasM3: 9000, powerKW: 3200, status: 'Processing', priority: 'High', origin: 'Ahmedabad (AMC Pirana)', destination: 'Gandhinagar (Gujarat Gas)', shipDate: '2026-07-24', transitDays: 1, zone: 'West', remarks: '600 TPD Pirana STP sludge AD with biogas upgrading to CBG at 97% CH4 &#8214; 3.2 MW equivalent CBG for Gujarat Gas vehicular pipeline' },
  { id: 'STE-0010', batchNo: 'STE-P2410', sludgeSource: 'Pulp &amp; Paper Mill Sludge', treatmentProcess: 'Biomass Gasifier', energyOutput: 'Producer Gas + Steam', capacityTPD: 180, biogasM3: 0, powerKW: 1400, status: 'In Transit', priority: 'High', origin: 'Bhadrachalam (ITC PSP)', destination: 'Rajahmundry (AP Paper)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: '180 TPD ITC Bhadrachalam pulp mill sludge biomass gasifier &#8214; 1.4 MW power + process steam reducing wood chip demand 15%' },
  { id: 'STE-0011', batchNo: 'STE-P2411', sludgeSource: 'Distillery Spent Wash', treatmentProcess: 'Biomethanation + Cogen', energyOutput: 'Biogas 70% CH4', capacityTPD: 400, biogasM3: 12000, powerKW: 4500, status: 'Delivered', priority: 'Medium', origin: 'Sangli (United Spirits)', destination: 'Satara (Maha Ethanol)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: '400 TPD distillery spent wash biomethanation &#8212; 12,000 m3/day biogas 4.5 MW cogen replacing 8,000 L/day furnace oil' },
  { id: 'STE-0012', batchNo: 'STE-P2412', sludgeSource: 'Municipal STP Sludge', treatmentProcess: 'AD + Sludge Drying + RDF', energyOutput: 'Refuse Derived Fuel', capacityTPD: 450, biogasM3: 6800, powerKW: 2000, status: 'Delayed', priority: 'Low', origin: 'Chennai (CMWSSB Kodungaiyur)', destination: 'Tiruvallur (TN RDF Plant)', shipDate: '2026-07-10', transitDays: 16, zone: 'South', remarks: '450 TPD Chennai Kodungaiyur sludge AD + thermal drying to RDF pellets &#8212; dryer commissioning delay 16 days, interim wet AD only' },
  { id: 'STE-0013', batchNo: 'STE-P2413', sludgeSource: 'Petrochemical ETP Sludge', treatmentProcess: 'Supercritical Water Oxidation', energyOutput: 'Power + Heat Recovery', capacityTPD: 30, biogasM3: 0, powerKW: 300, status: 'In Transit', priority: 'Critical', origin: 'Vadodara (IOCL Gujarat)', destination: 'Dahej (ONGC Refinery)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: '30 TPD IOCL Vadodara petrochemical sludge SCWO at 374C 22 MPa &#8212; complete organic destruction 99.9% + 300 kW power recovery' },
  { id: 'STE-0014', batchNo: 'STE-P2414', sludgeSource: 'Municipal STP Sludge', treatmentProcess: 'AD + Phosphorus Recovery', energyOutput: 'Biogas + Struvite', capacityTPD: 280, biogasM3: 4200, powerKW: 1200, status: 'Processing', priority: 'Critical', origin: 'Nagpur (NMC Bhandewadi)', destination: 'Amravati (Vidarbha Fert)', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: '280 TPD Nagpur Bhandewadi sludge AD + struvite phosphorus recovery &#8212; 1.2 MW biogas + 8 TPD struvite fertilizer for Vidarbha' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Treatment Process', key: 'treatmentProcess', options: [
    { value: 'Anaerobic Digestion + CHP', count: 1 }, { value: 'Incineration + WHRB', count: 1 }, { value: 'Gasification + Syngas', count: 1 }, { value: 'Pyrolysis + Bio-Oil', count: 1 },
  ]},
  { label: 'Sludge Source', key: 'sludgeSource', options: [
    { value: 'Municipal STP Sludge', count: 7 }, { value: 'Industrial ETP Sludge', count: 3 }, { value: 'Distillery Spent Wash', count: 1 }, { value: 'Sugar Mill Effluent', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 5 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 5 }, { value: 'West', count: 5 }, { value: 'North', count: 3 }, { value: 'East', count: 1 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Plants', value: 14, sub: 'Sludge-to-Energy Sites', color: 'text-fuchsia-800' },
  { title: 'Total Capacity', value: '4,140 TPD', sub: 'Sludge Processed', color: 'text-purple-700' },
  { title: 'Total Power', value: '24.1 MW', sub: 'Energy Output', color: 'text-pink-700' },
  { title: 'National Mission', value: '\u20b98,500Cr', sub: 'Swachh Bharat 2.0', color: 'text-fuchsia-700' },
];

export default function SludgeToEnergyLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.sludgeSource} ${r.treatmentProcess} ${r.energyOutput} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof STERecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const powerByProcess = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.treatmentProcess.split('+')[0].trim().slice(0, 18); map.set(s, (map.get(s) || 0) + r.powerKW); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, powerKW]) => ({ name, powerKW }));
  }, []);

  const sourceDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.sludgeSource, (map.get(r.sludgeSource) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name: name.slice(0, 20), value }));
  }, []);

  const marketTrend = useMemo(() => [
    { year: '2022', mw: 45 }, { year: '2023', mw: 120 }, { year: '2024', mw: 280 }, { year: '2025', mw: 580 }, { year: '2026', mw: 1200 }, { year: '2027', mw: 2500 }, { year: '2028', mw: 5000 },
  ], []);

  const biogasData = useMemo(() => {
    return records.filter((r, i) => i % 2 === 0 && r.biogasM3 > 0).map((r) => ({ name: r.batchNo.slice(-2), biogas: r.biogasM3 }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const capacityBySource = useMemo(() => {
    return Array.from(new Map(records.map((r) => [r.sludgeSource.split(' ')[0], { name: r.sludgeSource.split(' ')[0], capacity: r.capacityTPD }])).values()).reduce((acc, v) => { const e = acc.find((a) => a.name === v.name); if (e) e.capacity += v.capacity; else acc.push({...v}); return acc; }, [] as { name: string; capacity: number }[]).sort((a, b) => b.capacity - a.capacity).slice(0, 6);
  }, []);

  const COLORS = ['#d946ef', '#c026d3', '#a21caf', '#86198f', '#e879f9', '#f0abfc'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="ste-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Waste-to-Energy' }, { label: 'Sludge-to-Energy' }]} />
      <PageHeader title="Sludge-to-Energy Logistics" description="Indian sludge-to-energy conversion &#8212; municipal STP anaerobic digestion biogas CHP, industrial ETP incineration waste heat recovery, gasification syngas, pyrolysis bio-oil, plasma arc destruction, supercritical water oxidation, biomethanation cogeneration, compressed biogas CBG upgrading, RDF refuse derived fuel, and phosphorus struvite recovery from sewage industrial tannery pharma sugar distillery petrochemical sludge under Swachh Bharat Mission 2.0" />

      <div className="ste-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="ste-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="ste-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`ste-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-fuchsia-700 text-fuchsia-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="ste-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="ste-chart-card"><CardHeader><CardTitle className="text-sm">Power Output by Process (kW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={powerByProcess}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="powerKW" fill="#d946ef" radius={[4,4,0,0]} name="kW" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ste-chart-card"><CardHeader><CardTitle className="text-sm">Sludge Source Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={sourceDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name.slice(0,10)} ${(percent * 100).toFixed(0)}%`}><Cell fill="#d946ef" /><Cell fill="#c026d3" /><Cell fill="#a21caf" /><Cell fill="#86198f" /><Cell fill="#e879f9" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="ste-chart-card"><CardHeader><CardTitle className="text-sm">India Sludge-to-Energy Growth (MW/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={marketTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="mw" stroke="#e879f9" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="ste-chart-card"><CardHeader><CardTitle className="text-sm">Biogas Production (m3/day) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={biogasData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="biogas" fill="#c026d3" radius={[4,4,0,0]} name="m3/day" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="ste-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Source</th><th className="px-2 py-2 text-left">Process</th><th className="px-2 py-2 text-right">TPD</th><th className="px-2 py-2 text-right">kW</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`ste-table-row border-b hover:bg-fuchsia-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.sludgeSource.split(' ').slice(0, 2).join(' ')}</td>
                  <td className="px-2 py-2 text-xs">{r.treatmentProcess.split('+')[0].trim().slice(0, 18)}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacityTPD}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.powerKW}</td>
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
        <div className="ste-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="ste-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#d946ef" /><Cell fill="#c026d3" /><Cell fill="#a21caf" /><Cell fill="#86198f" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="ste-chart-card"><CardHeader><CardTitle className="text-sm">Capacity (TPD) by Sludge Source</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityBySource}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacity" fill="#d946ef" radius={[4,4,0,0]} name="TPD" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ste-chart-card"><CardHeader><CardTitle className="text-sm">Capacity vs Power Output</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), tpd: r.capacityTPD, kw: r.powerKW }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="tpd" stroke="#d946ef" strokeWidth={2} name="TPD" /><Line type="monotone" dataKey="kw" stroke="#e879f9" strokeWidth={2} name="kW" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="ste-chart-card"><CardHeader><CardTitle className="text-sm">Energy Output Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={Array.from(new Map(records.map((r) => [r.energyOutput.split(' ')[0], { name: r.energyOutput.split(' ').slice(0, 2).join(' '), value: 1 }])).values())} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#d946ef" /><Cell fill="#c026d3" /><Cell fill="#a21caf" /><Cell fill="#86198f" /><Cell fill="#e879f9" /><Cell fill="#f0abfc" /><Cell fill="#d946ef" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="ste-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="ste-insight-card border-l-4 border-l-fuchsia-700"><CardHeader><CardTitle className="text-sm text-fuchsia-800">India Sludge-to-Energy Target: 5,000 MW by 2028</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s Swachh Bharat Mission 2.0 targeting 5,000 MW sludge-to-energy capacity by 2028 from 62,000 MLD sewage treatment plants generating 72,000 TPD sludge nationwide. Phase-1 (2024-2026): 1,200 MW from municipal STP anaerobic digestion at Delhi Okhla (STE-0001, 2.5 MW), Kolkata Tonga (STE-0007, 1.6 MW), Pune PCMC (STE-0005, 1.8 MW), and Ahmedabad Pirana (STE-0009, 3.2 MW CBG). Biogas potential: 72,000 TPD sludge producing 1.08 billion m3/year biogas (65% CH4) at 200 m3 biogas/tonne VS destruction &#8214; equivalent to 6,500 MW electrical or 18 million kg CBG annually. Phase-2 (2026-2028): 3,800 MW adding industrial ETP sludge incineration at Tirupur textile (STE-0002), Kanpur tannery (STE-0004), Hyderabad pharma (STE-0006), Vadodara petrochemical (STE-0013), plus distillery spent wash biomethanation at Sangli (STE-0011, 4.5 MW). Total investment &#8377;8,500Cr under Swachh Bharat 2.0 with &#8377;4,200Cr central subsidy, &#8377;2,800Cr state contribution, and &#8377;1,500Cr PPP private operator equity. CPCB (Central Pollution Control Board) mandating zero liquid discharge (ZLD) for all 625 STPs above 10 MLD capacity by 2027 &#8212; sludge-to-energy providing energy-positive ZLD compliance.</p></CardContent></Card>
          <Card className="ste-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Deployments: STE-0005 and STE-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">STE-0005 (PCMC Nigdi to Nashik, 14-day delay): 400 TPD Pune PCMC sludge anaerobic digester + Bloom Energy 200 kW SOFC CHP system &#8212; Bloom Energy SOFC delivery from US factory delayed by yttria-stabilized zirconia (YSZ) electrolyte supply chain constraint (same issue as MG-0005 microgrid). PCMC Nigdi AD digester operational producing 6,000 m3/day biogas, but SOFC commissioning pending. Interim solution: Wartsila 1.4 MW gas engine operating at 80% capacity using 80% of biogas, with 20% flared. Nashik Municipal Corporation receiving only biogas (via pipeline) without CHP power output as originally contracted. Revenue impact: &#8377;45L/month lost power sales to MSEDCL grid at &#8377;7.8/kWh. STE-0012 (Chennai Kodungaiyur to Tiruvallur, 16-day delay): 450 TPD CMWSSB Kodungaiyur sludge AD + thermal drying to RDF pellets &#8214; Andritz belt dryer commissioning delayed 16 days by vibration sensor calibration issue on dryer discharge conveyor causing premature belt tracking fault. AD portion operational: 6,800 m3/day biogas feeding 2 MW gas engine. RDF pellet production suspended pending dryer fix &#8212; 120 TPD wet sludge backlog accumulating at Kodungaiyur. Andritz Austria service engineer scheduled for August 5 with replacement vibration sensor module. TN RDF Plant Tiruvallur operating at 30% RDF input capacity using alternate MSW-RDF source at &#8377;3,200/tonne vs sludge-RDF target &#8377;2,100/tonne.</p></CardContent></Card>
          <Card className="ste-insight-card border-l-4 border-l-purple-600"><CardHeader><CardTitle className="text-sm text-purple-700">CBG from STP Sludge: Ahmedabad Pirana Model</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">STE-0009: 600 TPD Ahmedabad Pirana STP sludge anaerobic digestion with biogas upgrading to compressed bio-gas (CBG) at 97% CH4 &#8214; India&apos;s first large-scale sewage-sludge-to-CBG facility meeting IS 16087 vehicular fuel specification. AD process: thermophilic anaerobic digester at 55C 20-day HRT producing 9,000 m3/day raw biogas at 65% CH4. Upgrading: amine scrubbing (MEA 15% solution) removing CO2 and H2S to achieve 97% CH4, &#60;10 ppm H2S. CBG compression: 250 bar multi-stage compressor from Ariel India filling 12-tonne cascade CNG tube skids for transport to Gujarat Gas pipeline injection at &#8377;52/kg CBG vs CNG &#8377;85/kg. Output: 3.2 MW thermal equivalent CBG serving 850 Gujarat Gas CNG stations in Ahmedabad metro &#8214; displacing 18,000 kg/day fossil CNG. Revenue model: AMC Pirana CBG plant earning &#8377;52/kg CBG sales (&#8377;34Cr/year) minus &#8377;22/kg operating cost (&#8377;14.5Cr/year) = &#8377;19.5Cr annual surplus. India CBG from sewage potential: 200 million kg/year by 2030 from 150 large STP cities &#8214; 10% of SATAT CBG blending mandate (450 million kg/year total). NGT (National Green Tribunal) mandating all STPs above 50 MLD to integrate sludge energy recovery by 2027 under MOC&amp;E circular. Gujarat leading with 8 STP-to-CBG projects under Gujarat Green Gas Mission at &#8377;1,200Cr cumulative investment.</p></CardContent></Card>
          <Card className="ste-insight-card border-l-4 border-l-pink-600"><CardHeader><CardTitle className="text-sm text-pink-700">Struvite Recovery: Nagpur Phosphorus Circular Economy</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">STE-0014: 280 TPD Nagpur Bhandewadi STP sludge AD + phosphorus recovery producing struvite (magnesium ammonium phosphate, MgNH4PO4-6H2O) &#8212; India&apos;s first municipal sewage struvite recovery plant integrated with biogas energy. Process: post-AD sludge liquor (centrate) containing 120 mg/L PO4 and 450 mg/L NH4-N &#8594; magnesium chloride dosing at pH 8.5-9.0 in fluidized bed reactor &#8594; struvite crystal nucleation and growth to 2mm pearl-shaped granules at 8 TPD production rate. Struvite quality: 26% P2O5 equivalent ( meets IS 6501 fertilizer grade), heavy metals below EU REACH limits, suitable for direct agricultural application as slow-release NPK fertilizer. Market: Vidarbha region cotton-soybean farmers purchasing struvite at &#8377;8,500/tonne vs DAP &#8377;27,000/tonne (&#8377;18,500/tonne discount reflecting slow-release characteristics). Revenue: 8 TPD at &#8377;8,500 = &#8377;2.48Cr/year. Co-benefit: phosphorus removal from centrate prevents AD digester struvite scaling (saves &#8377;80L/year descaling maintenance). India phosphorus crisis: 95% rock phosphate imported at &#8377;1,20,000/tonne, while sewage contains 60,000 tonnes phosphorus/year (replacing &#8377;7,200Cr import). NMC Nagpur targeting 5 additional struvite plants by 2028 at Nagpur Pashan, Kalyan, Thane, and Nashik under National Phosphorus Recovery Programme at &#8377;45Cr total.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
