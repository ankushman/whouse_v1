'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface PlasmaRecord {
  id: string;
  batchNo: string;
  feedstock: string;
  reactorType: string;
  application: string;
  capacityTPD: number;
  syngasQuality: number;
  charYield: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: PlasmaRecord[] = [
  { id: 'PLG-0001', batchNo: 'PLG-B2401', feedstock: 'Municipal Solid Waste', reactorType: 'DC Arc Plasma (2MW)', application: 'Syngas to Power', capacityTPD: 200, syngasQuality: 85, charYield: 5, status: 'In Transit', priority: 'Critical', origin: 'Delhi (NTPC Vidyut)', destination: 'Noida (UPPCL Grid)', shipDate: '2026-07-20', transitDays: 1, zone: 'North', remarks: '200 TPD DC arc plasma gasification for NTPC Delhi waste-to-power syngas 10MW gas turbine Noida grid supply' },
  { id: 'PLG-0002', batchNo: 'PLG-B2402', feedstock: 'Medical/Biohazard Waste', reactorType: 'RF Plasma Torch (500kW)', application: 'Safe Hazard Destruction', capacityTPD: 50, syngasQuality: 92, charYield: 2, status: 'Delivered', priority: 'Critical', origin: 'Mumbai (BWC Plasma)', destination: 'Mumbai (BMC Hospital)', shipDate: '2026-07-18', transitDays: 0, zone: 'West', remarks: '50 TPD RF plasma torch medical waste destruction at 3,000C &#8214; 99.99% DRE for BMC hospital biohazard disposal zero-ash' },
  { id: 'PLG-0003', batchNo: 'PLG-B2403', feedstock: 'E-Waste (PCB Boards)', reactorType: 'Transfer Arc Plasma (1MW)', application: 'Metal Recovery', capacityTPD: 30, syngasQuality: 78, charYield: 15, status: 'Processing', priority: 'High', origin: 'Bengaluru (CERC E-Waste)', destination: 'Hyderabad (CSIR-NML)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: '30 TPD transfer arc plasma e-waste recovery Cu Au Ag Pd from PCB boards at 5,000C &#8214; 95% metal recovery' },
  { id: 'PLG-0004', batchNo: 'PLG-B2404', feedstock: 'Automobile Shredder Residue', reactorType: 'DC Arc Plasma (3MW)', application: 'Syngas to Chemical', capacityTPD: 150, syngasQuality: 80, charYield: 8, status: 'In Transit', priority: 'High', origin: 'Chennai (Tata Auto)', destination: 'Ennore (IOCL Methanol)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: '150 TPD plasma gasification ASR for IOCL Ennore methanol synthesis from syngas H2+CO at 0.7 ratio' },
  { id: 'PLG-0005', batchNo: 'PLG-B2405', feedstock: 'Sewage Sludge', reactorType: 'Induction Plasma (750kW)', application: 'Phosphorus Recovery', capacityTPD: 80, syngasQuality: 75, charYield: 20, status: 'Delayed', priority: 'Medium', origin: 'Pune (PCSIR Sludge)', destination: 'Nagpur (Nagpur Corp)', shipDate: '2026-07-12', transitDays: 10, zone: 'West', remarks: '80 TPD induction plasma sewage sludge for phosphorus recovery &#8214; plasma vitrified slag delay 10 days refractory repair' },
  { id: 'PLG-0006', batchNo: 'PLG-B2406', feedstock: 'Coal Fly Ash', reactorType: 'Thermal Plasma (1.5MW)', application: 'Vitrified Glass Aggregate', capacityTPD: 300, syngasQuality: 0, charYield: 95, status: 'Delivered', priority: 'High', origin: 'Raichur (KPCL Ash)', destination: 'Bangalore (BBMP Roads)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: '300 TPD thermal plasma vitrification of coal fly ash to glass aggregate for Bangalore road construction replacing gravel' },
  { id: 'PLG-0007', batchNo: 'PLG-B2407', feedstock: 'Biomass (Rice Straw)', reactorType: 'DC Arc Plasma (1MW)', application: 'Green Hydrogen Production', capacityTPD: 100, syngasQuality: 88, charYield: 8, status: 'In Transit', priority: 'Critical', origin: 'Karnal (IARI Plasma)', destination: 'Panipat (IOCL H2)', shipDate: '2026-07-21', transitDays: 1, zone: 'North', remarks: '100 TPD plasma rice straw to green H2 &#8214; ultra-hot plasma reforming eliminates tar 99.9% for clean H2 separation' },
  { id: 'PLG-0008', batchNo: 'PLG-B2408', feedstock: 'Tire Derived Fuel', reactorType: 'Transfer Arc Plasma (2MW)', application: 'Carbon Black Recovery', capacityTPD: 120, syngasQuality: 82, charYield: 35, status: 'Delivered', priority: 'Medium', origin: 'Nagpur (CEAT Tyre)', destination: 'Mumbai (Birla Carbon)', shipDate: '2026-07-15', transitDays: 2, zone: 'West', remarks: '120 TPD plasma tire pyrolysis &#8214; 35% carbon black yield (vulcanization grade), syngas to plant power, steel belt recovery' },
  { id: 'PLG-0009', batchNo: 'PLG-B2409', feedstock: 'Industrial Hazardous Waste', reactorType: 'RF Plasma Torch (1MW)', application: 'Toxic Destruction', capacityTPD: 60, syngasQuality: 90, charYield: 3, status: 'Processing', priority: 'Critical', origin: 'Ankleshwar (Gujarat PCB)', destination: 'Vadodara (Gujarat Env)', shipDate: '2026-07-24', transitDays: 1, zone: 'West', remarks: '60 TPD RF plasma industrial hazardous waste destruction for Ankleshwar GIDC &#8214; cyanide organochlorine at 99.9999% DRE' },
  { id: 'PLG-0010', batchNo: 'PLG-B2410', feedstock: 'Refinery Sludge', reactorType: 'DC Arc Plasma (2.5MW)', application: 'Oil Recovery + Syngas', capacityTPD: 180, syngasQuality: 84, charYield: 10, status: 'In Transit', priority: 'High', origin: 'Jamnagar (Reliance Ref)', destination: 'Gandhinagar (Gujarat Petro)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: '180 TPD plasma refinery tank bottom sludge &#8214; oil recovery 60%, syngas 30%, vitrified slag for construction' },
  { id: 'PLG-0011', batchNo: 'PLG-B2411', feedstock: 'Asbestos Waste', reactorType: 'Thermal Plasma (500kW)', application: 'Asbestos Destruction', capacityTPD: 25, syngasQuality: 0, charYield: 98, status: 'Delivered', priority: 'High', origin: 'Kolkata (Asbestos Cement)', destination: 'Haldia (WB Env)', shipDate: '2026-07-17', transitDays: 2, zone: 'East', remarks: '25 TPD plasma asbestos fiber destruction at 1,600C &#8214; diopside glass slag non-hazardous, zero asbestos fiber release' },
  { id: 'PLG-0012', batchNo: 'PLG-B2412', feedstock: 'Petrochemical Waste', reactorType: 'DC Arc Plasma (1.5MW)', application: 'Syngas to Methanol', capacityTPD: 100, syngasQuality: 86, charYield: 6, status: 'Delayed', priority: 'Critical', origin: 'Dahej (Reliance Pet)', destination: 'Baroda (GSFC Plant)', shipDate: '2026-07-10', transitDays: 18, zone: 'West', remarks: '100 TPD plasma petrochemical waste to methanol syngas &#8214; electrode wear delay 18 days graphite electrode supply issue' },
  { id: 'PLG-0013', batchNo: 'PLG-B2413', feedstock: 'Biomass (Sugarcane Trash)', reactorType: 'Induction Plasma (1MW)', application: 'Biochar + Syngas', capacityTPD: 130, syngasQuality: 83, charYield: 25, status: 'In Transit', priority: 'Medium', origin: 'Kolhapur (SK Sugar)', destination: 'Pune (Agri Biochar)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: '130 TPD plasma sugarcane trash &#8214; 25% biochar at 70% carbon for soil amendment, syngas to plant power self-sufficient' },
  { id: 'PLG-0014', batchNo: 'PLG-B2414', feedstock: 'Nuclear Waste Simulant', reactorType: 'DC Arc Plasma (3MW)', application: 'Vitrification Immobilization', capacityTPD: 15, syngasQuality: 0, charYield: 100, status: 'Processing', priority: 'Critical', origin: 'Kalpakkam (BARC)', destination: 'Tarapur (NPCIL Store)', shipDate: '2026-07-25', transitDays: 2, zone: 'South', remarks: '15 TPD DC arc plasma vitrification low-level radioactive waste immobilization in borosilicate glass matrix for 10,000yr storage' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Feedstock', key: 'feedstock', options: [
    { value: 'Municipal Solid Waste', count: 1 }, { value: 'Medical/Biohazard Waste', count: 1 }, { value: 'E-Waste (PCB Boards)', count: 1 }, { value: 'Automobile Shredder Residue', count: 1 },
  ]},
  { label: 'Application', key: 'application', options: [
    { value: 'Syngas to Power', count: 1 }, { value: 'Safe Hazard Destruction', count: 1 }, { value: 'Metal Recovery', count: 1 }, { value: 'Green Hydrogen Production', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 6 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 5 }, { value: 'South', count: 4 }, { value: 'North', count: 2 }, { value: 'East', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Batches', value: 14, sub: 'Plasma Gasification', color: 'text-orange-800' },
  { title: 'Combined Capacity', value: '1,575 TPD', sub: 'All Reactor Types', color: 'text-red-700' },
  { title: 'Avg Syngas Quality', value: '84.4%', sub: 'Medical Waste 92% Peak', color: 'text-amber-700' },
  { title: 'National Target', value: '\u20b96,500Cr', sub: 'Swachh Bharat Waste-Energy', color: 'text-rose-700' },
];

export default function PlasmaGasificationLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.feedstock} ${r.reactorType} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof PlasmaRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByFeed = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.feedstock.split(' ')[0], (map.get(r.feedstock.split(' ')[0]) || 0) + r.capacityTPD); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, capacityTPD]) => ({ name: name.slice(0, 14), capacityTPD }));
  }, []);

  const reactorDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.reactorType.split('(')[0].trim(); map.set(s, (map.get(s) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const prodTrend = useMemo(() => [
    { year: '2022', tpd: 200 }, { year: '2023', tpd: 600 }, { year: '2024', tpd: 1800 }, { year: '2025', tpd: 4000 }, { year: '2026', tpd: 8000 }, { year: '2027', tpd: 15000 }, { year: '2028', tpd: 28000 },
  ], []);

  const syngasData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), syngas: r.syngasQuality }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const capacityByApp = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application, (map.get(r.application) || 0) + r.capacityTPD); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, capacityTPD]) => ({ name: name.slice(0, 18), capacityTPD }));
  }, []);

  const COLORS = ['#ea580c', '#f97316', '#c2410c', '#9a3412', '#7c2d12'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="plg-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Waste-to-Energy' }, { label: 'Plasma Gasification' }]} />
      <PageHeader title="Plasma Gasification Logistics" description="Indian plasma gasification supply chain &#8212; DC arc, RF torch, transfer arc, induction, and thermal plasma reactors for MSW-to-power, medical waste destruction, e-waste metal recovery, green H2, fly ash vitrification, asbestos destruction, and nuclear waste immobilization" />

      <div className="plg-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="plg-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="plg-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`plg-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-orange-700 text-orange-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="plg-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="plg-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Feedstock (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByFeed}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityTPD" fill="#ea580c" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="plg-chart-card"><CardHeader><CardTitle className="text-sm">Reactor Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={reactorDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#ea580c" /><Cell fill="#f97316" /><Cell fill="#c2410c" /><Cell fill="#9a3412" /><Cell fill="#7c2d12" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="plg-chart-card"><CardHeader><CardTitle className="text-sm">Plasma Gasification Growth (TPD/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={prodTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="tpd" stroke="#f97316" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="plg-chart-card"><CardHeader><CardTitle className="text-sm">Syngas Quality (%) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={syngasData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="syngas" fill="#c2410c" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="plg-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Feedstock</th><th className="px-2 py-2 text-left">Reactor</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">TPD</th><th className="px-2 py-2 text-right">Syngas%</th><th className="px-2 py-2 text-right">Char%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`plg-table-row border-b hover:bg-orange-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.feedstock}</td>
                  <td className="px-2 py-2 text-xs">{r.reactorType.split('(')[0].trim()}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacityTPD}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.syngasQuality}%</td>
                  <td className="px-2 py-2 text-right font-mono">{r.charYield}%</td>
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
        <div className="plg-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="plg-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#ea580c" /><Cell fill="#f97316" /><Cell fill="#c2410c" /><Cell fill="#9a3412" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="plg-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Application (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByApp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityTPD" fill="#ea580c" radius={[4,4,0,0]} name="TPD" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="plg-chart-card"><CardHeader><CardTitle className="text-sm">Syngas Quality vs Char Yield</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).filter((r) => r.syngasQuality > 0).map((r) => ({ name: r.feedstock.split(' ')[0].slice(0, 8), syngas: r.syngasQuality, char: r.charYield }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="syngas" stroke="#ea580c" strokeWidth={2} name="Syngas%" /><Line type="monotone" dataKey="char" stroke="#f97316" strokeWidth={2} name="Char%" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="plg-chart-card"><CardHeader><CardTitle className="text-sm">Reactor Power Rating (MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={records.slice(0, 10).map((r) => ({ name: r.reactorType.split('(')[1].replace('MW)', ''), mw: parseFloat(r.reactorType.match(/\d+\.?\d*(?=MW)/)?.[0] || '0') }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="mw" fill="#c2410c" radius={[4,4,0,0]} name="MW" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="plg-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="plg-insight-card border-l-4 border-l-orange-700"><CardHeader><CardTitle className="text-sm text-orange-800">India Plasma Arc: Swachh Bharat Waste-to-Energy Revolution</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India generates 62 MT municipal solid waste annually, 80% landfilled causing groundwater contamination and methane emissions. Plasma arc gasification at 3,000-15,000C decomposes any organic/inorganic waste into clean syngas (H2+CO) and vitrified slag, eliminating landfill requirements. PLG-0001: NTPC Vidyut Delhi 200 TPD DC arc plasma plant processing Delhi NCR municipal waste into 10MW gas turbine syngas power &#8214; 70% diversion from Ghazipur landfill (India&apos;s tallest garbage mountain at 65m). Syngas quality 85% (H2:CO ratio 1.5:1) with tar content below 5 mg/Nm3 compared to 500 mg/Nm3 in conventional gasification. Vitrified slag used for road construction aggregate. NTPC targeting 2,000 TPD plasma gasification capacity across 10 Indian metro cities by 2028. India&apos;s installed waste-to-energy capacity currently 180 MW from 60 plants &#8214; plasma technology adding 500 MW by 2028. Swachh Bharat Mission 2.0 allocating &#8377;6,500Cr for advanced waste-to-energy including plasma arc, with &#8377;15 lakh per TPD capital cost vs &#8377;8 lakh for mass burn incineration but 3x higher energy recovery.</p></CardContent></Card>
          <Card className="plg-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: PLG-0005 and PLG-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">PLG-0005 (Pune PCSIR to Nagpur Corp, 10-day delay): 80 TPD induction plasma sewage sludge gasification &#8214; high silica content in Pune sewage sludge caused refractory lining erosion in plasma reactor at 1,800C operating temperature. Plasma torch operating at 750kW producing excessive slag viscosity at 85% SiO2 composition, blocking slag tap hole. New chrome-alumina refractory with 15% higher thermal shock resistance ordered from Dalmia Refractories at &#8377;2.8Cr. Nagpur Corporation sewage treatment plant overflowing during monsoon without plasma phosphorus recovery system online &#8214; phosphorus discharge exceeding 2 mg/L CPCB limit. PLG-0012 (Dahej Reliance to Baroda GSFC, 18-day delay): 100 TPD DC arc plasma petrochemical waste to methanol syngas &#8214; graphite electrode consumption rate 2.3x higher than expected at Dahej high-chlorine waste, requiring frequent electrode replacement (every 120 hrs vs design 280 hrs). Graphite electrode supply from HEG Limited delayed by 18 days due to imported petroleum needle coke shortage. GSFC Baroda methanol plant relying on pipeline natural gas as interim feedstock at &#8377;45/kg vs &#8377;28/kg plasma syngas methanol target.</p></CardContent></Card>
          <Card className="plg-insight-card border-l-4 border-l-amber-600"><CardHeader><CardTitle className="text-sm text-amber-700">E-Waste Plasma: Urban Mining Gold Rush</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India generates 3.2 MT e-waste annually (world&apos;s 3rd largest), containing 3,500 tonnes of copper, 180 tonnes of gold, and 60 tonnes of palladium. Conventional e-waste recycling recovers only 30% metals through acid leaching. PLG-0003: CERC Bengaluru transfer arc plasma reactor processing 30 TPD PCB boards at 5,000C, achieving 95% metal recovery (Cu Au Ag Pd Sn) from e-waste &#8214; plasma dissociation vaporizes organic resin matrix at 99.999% destruction, leaving molten metal phase collected at reactor bottom. Gold recovery: 3.2 g/ton PCB vs 1.8 g/ton conventional cyanidation. Palladium recovery: 0.8 g/ton PCB enabling India to reduce 40% Pd import for automotive catalytic converter manufacturing. CSIR-NML Hyderabad downstream refinery processes plasma metal output into high-purity (99.99%) metals for electronics manufacturing. India e-waste formal recycling capacity: 0.8 MTPA vs 3.2 MTPA generation &#8214; plasma technology scaling to 500 TPD across 5 cities to bridge 60% recycling gap. Investment: &#8377;850Cr per 100 TPD plant. CPCB E-Waste Management Rules 2022 mandating plasma-grade recycling for all PCB waste above 10 tonnes/year.</p></CardContent></Card>
          <Card className="plg-insight-card border-l-4 border-l-yellow-600"><CardHeader><CardTitle className="text-sm text-yellow-700">BARC Nuclear Waste Vitrification: 10,000-Year Safety</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">BARC Kalpakkam developing India&apos;s first DC arc plasma vitrification system (PLG-0014) for low-level radioactive waste immobilization &#8214; 15 TPD capacity plasma arc at 3MW dissolves radioactive waste in borosilicate glass matrix at 1,200-1,500C, creating stable vitrified waste form exceeding international durability standards. Conventional Joule-heated ceramic melter processing 25 TPD LLW at Tarapur has 15-year refractory lifetime limitation; plasma arc melter offers 25-year lifetime with water-cooled copper crucible eliminating refractory corrosion issue. Vitrified waste monoliths stored in underground engineered facility at NPCIL Tarapur &#8214; leach rate below 0.1 g/m2/day for 10,000-year safety period per International Atomic Energy Agency (IAEA) standards. BARC plasma vitrification also applicable to high-level waste (HLW) from reprocessing at Kalpakkam &#8214; 137Cs and 90Sr immobilization in glass-ceramic composite. India&apos;s nuclear waste inventory: 5,000 m3 LLW + 300 m3 HLW from 22 reactors. Plasma vitrification reducing final waste volume by 70% compared to cementation. Technology transfer to NPCIL Tarapur and BHAVINI Kalpakkam for commercial operation by 2028.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
