'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface MeOHRecord {
  id: string;
  batchNo: string;
  processRoute: string;
  feedstock: string;
  application: string;
  capacityTPD: number;
  purity: number;
  carbonIntensity: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: MeOHRecord[] = [
  { id: 'GMH-0001', batchNo: 'GMH-B2401', processRoute: 'Green H2 + CO2', feedstock: 'Renewable H2 + Biomass CO2', application: 'Marine Fuel', capacityTPD: 500, purity: 99.9, carbonIntensity: 0.1, status: 'In Transit', priority: 'Critical', origin: 'Hazira (Reliance Green MeOH)', destination: 'Kandla Port (SCI Tanker)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: '500TPD green methanol for Shipping Corp India dual-fuel vessel' },
  { id: 'GMH-0002', batchNo: 'GMH-B2402', processRoute: 'Biomass Gasification', feedstock: 'Rice Husk + Agricultural Waste', application: 'Chemical Feedstock', capacityTPD: 300, purity: 99.5, carbonIntensity: 0.3, status: 'Delivered', priority: 'High', origin: 'Karnal (IIT-D Biomass Plant)', destination: 'Panipat (IOCL Petrochem)', shipDate: '2026-07-18', transitDays: 1, zone: 'North', remarks: 'Rice husk biomass gasification methanol IOCL olefin feedstock' },
  { id: 'GMH-0003', batchNo: 'GMH-B2403', processRoute: 'Green H2 + CO2', feedstock: 'Solar H2 + Flue Gas CO2', application: 'Shipping Bunker', capacityTPD: 800, purity: 99.9, carbonIntensity: 0.05, status: 'Processing', priority: 'Critical', origin: 'Tuticorin (NTPC Green MeOH)', destination: 'Chennai Port (Maersk)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: '800TPD solar H2 + flue CO2 for Maersk green shipping corridor' },
  { id: 'GMH-0004', batchNo: 'GMH-B2404', processRoute: 'e-Methanol (Electrolysis)', feedstock: 'Wind H2 + DAC CO2', application: 'Marine Fuel', capacityTPD: 250, purity: 99.9, carbonIntensity: 0.02, status: 'In Transit', priority: 'High', origin: 'Gujarat Coast (Adani Wind MeOH)', destination: 'Mundra Port (Adani Shipping)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: '250TPD offshore wind electrolysis e-methanol Mundra bunkering' },
  { id: 'GMH-0005', batchNo: 'GMH-B2405', processRoute: 'Biogas Reforming', feedstock: 'Municipal Solid Waste', application: 'Transport Fuel', capacityTPD: 150, purity: 99.2, carbonIntensity: 0.4, status: 'Delayed', priority: 'Medium', origin: 'Pune (NMMC Biogas Plant)', destination: 'Mumbai (BPCL Blending)', shipDate: '2026-07-12', transitDays: 14, zone: 'West', remarks: 'MSW biogas-to-methanol M15 blending BS-VI fuel delay' },
  { id: 'GMH-0006', batchNo: 'GMH-B2406', processRoute: 'Green H2 + CO2', feedstock: 'Green H2 + Cement CO2', application: 'Chemical Industry', capacityTPD: 400, purity: 99.8, carbonIntensity: 0.08, status: 'Delivered', priority: 'High', origin: 'Mumbai (Thermax CCS-MeOH)', destination: 'Navi Mumbai (L&amp;T Chem)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'Cement CO2 + Thermax H2 for formaldehyde production circular' },
  { id: 'GMH-0007', batchNo: 'GMH-B2407', processRoute: 'Biomass Gasification', feedstock: 'Sugarcane Bagasse', application: 'Fuel Additive', capacityTPD: 200, purity: 99.5, carbonIntensity: 0.2, status: 'In Transit', priority: 'Medium', origin: 'Belgaum (Renuka Sugars)', destination: 'Bengaluru (HPCL Blending)', shipDate: '2026-07-21', transitDays: 2, zone: 'South', remarks: 'Bagasse biomass gasification MeOH M5 fuel additive Karnataka' },
  { id: 'GMH-0008', batchNo: 'GMH-B2408', processRoute: 'e-Methanol (Electrolysis)', feedstock: 'Solar H2 + Direct Air CO2', application: 'Power Generation', capacityTPD: 600, purity: 99.9, carbonIntensity: 0.01, status: 'Delivered', priority: 'Critical', origin: 'Bhadla (NTPC Solar MeOH)', destination: 'Jodhpur (Rajasthan Grid)', shipDate: '2026-07-15', transitDays: 2, zone: 'North', remarks: '600TPD solar H2 + DAC CO2 methanol for gas turbine fuel' },
  { id: 'GMH-0009', batchNo: 'GMH-B2409', processRoute: 'Green H2 + CO2', feedstock: 'Electrolytic H2 + Steel CO2', application: 'Marine Fuel', capacityTPD: 350, purity: 99.8, carbonIntensity: 0.06, status: 'Processing', priority: 'Critical', origin: 'Visakhapatnam (Vizag Steel MeOH)', destination: 'Vizag Port (SCI Vessel)', shipDate: '2026-07-24', transitDays: 1, zone: 'East', remarks: 'Vizag Steel CO2 + H2 green methanol for SCI coastal vessel' },
  { id: 'GMH-0010', batchNo: 'GMH-B2410', processRoute: 'Biogas Reforming', feedstock: 'Distillery Spent Wash', application: 'Chemical Feedstock', capacityTPD: 100, purity: 99.0, carbonIntensity: 0.5, status: 'In Transit', priority: 'Low', origin: 'Nashik (Sula Distillery)', destination: 'Pune (BASF India)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'Spent wash biogas-to-methanol BASF acetic acid feedstock' },
  { id: 'GMH-0011', batchNo: 'GMH-B2411', processRoute: 'Biomass Gasification', feedstock: 'Coconut Shell + Wood', application: 'Cooking Fuel', capacityTPD: 80, purity: 99.3, carbonIntensity: 0.3, status: 'Delivered', priority: 'Low', origin: 'Kerala (KIRAN Biomass)', destination: 'Kochi (IOC Distributor)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: 'Coconut shell gasification MeOH clean cooking fuel Kerala rural' },
  { id: 'GMH-0012', batchNo: 'GMH-B2412', processRoute: 'Green H2 + CO2', feedstock: 'Nuclear H2 + Captured CO2', application: 'Marine Fuel', capacityTPD: 700, purity: 99.9, carbonIntensity: 0.03, status: 'Delayed', priority: 'Critical', origin: 'Kalpakkam (BARC MeOH Plant)', destination: 'Chennai Port (Evergreen)', shipDate: '2026-07-10', transitDays: 21, zone: 'South', remarks: 'Nuclear H2 green methanol Evergreen marine AER certification delay' },
  { id: 'GMH-0013', batchNo: 'GMH-B2413', processRoute: 'e-Methanol (Electrolysis)', feedstock: 'Hydro H2 + Flue CO2', application: 'Shipping Bunker', capacityTPD: 450, purity: 99.9, carbonIntensity: 0.04, status: 'In Transit', priority: 'High', origin: 'Sikkim (NHPC Hydro MeOH)', destination: 'Kolkata Port (Hapag-Lloyd)', shipDate: '2026-07-20', transitDays: 4, zone: 'East', remarks: '450TPD hydro electrolysis methanol Hapag-Lloyd India-EU route' },
  { id: 'GMH-0014', batchNo: 'GMH-B2414', processRoute: 'Biogas Reforming', feedstock: 'Poultry Litter + Agri Waste', application: 'Fuel Blending', capacityTPD: 120, purity: 99.1, carbonIntensity: 0.4, status: 'Processing', priority: 'Medium', origin: 'Namakkal (Venkateshwara Hatcheries)', destination: 'Salem (TN Distilleries)', shipDate: '2026-07-25', transitDays: 2, zone: 'South', remarks: 'Poultry litter biogas methanol M10 blending TN fuel supply' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Process Route', key: 'processRoute', options: [
    { value: 'Green H2 + CO2', count: 5 }, { value: 'Biomass Gasification', count: 3 }, { value: 'e-Methanol (Electrolysis)', count: 3 }, { value: 'Biogas Reforming', count: 3 },
  ]},
  { label: 'Application', key: 'application', options: [
    { value: 'Marine Fuel', count: 4 }, { value: 'Chemical Feedstock', count: 2 }, { value: 'Shipping Bunker', count: 2 }, { value: 'Transport Fuel', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 5 }, { value: 'South', count: 5 }, { value: 'North', count: 2 }, { value: 'East', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Batches', value: 14, sub: 'Green Methanol', color: 'text-green-800' },
  { title: 'Combined Output', value: '5,000 TPD', sub: 'All Process Routes', color: 'text-lime-700' },
  { title: 'Avg Purity', value: '99.6%', sub: 'e-MeOH 99.9% Peak', color: 'text-emerald-700' },
  { title: 'National Target', value: '\u20b912,000Cr', sub: 'Green Methanol Mission', color: 'text-teal-700' },
];

export default function GreenMethanolLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.processRoute} ${r.feedstock} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof MeOHRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByRoute = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const key = r.processRoute.split(' ')[0]; map.set(key, (map.get(key) || 0) + r.capacityTPD); });
    return Array.from(map.entries()).map(([name, capacityTPD]) => ({ name, capacityTPD }));
  }, []);

  const feedstockDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.feedstock.split(' ').slice(0, 2).join(' '); map.set(s, (map.get(s) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const prodTrend = useMemo(() => [
    { year: '2022', tpd: 100 }, { year: '2023', tpd: 400 }, { year: '2024', tpd: 900 }, { year: '2025', tpd: 2000 }, { year: '2026', tpd: 3500 }, { year: '2027', tpd: 5500 }, { year: '2028', tpd: 8000 },
  ], []);

  const ciData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), ci: r.carbonIntensity * 100 }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const purityByApp = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application.split(' ')[0], (map.get(r.application.split(' ')[0]) || 0) + r.purity); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, purity]) => ({ name: name.slice(0, 12), purity: Math.round(purity) }));
  }, []);

  const COLORS = ['#15803d', '#65a30d', '#0d9488', '#059669', '#475569'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="gmh-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Green Fuels' }, { label: 'Green Methanol' }]} />
      <PageHeader title="Green Methanol Logistics" description="Indian green methanol supply chain \u2014 green H2+CO2 synthesis, biomass gasification, e-methanol electrolysis, biogas reforming for marine fuel, shipping bunker, chemical feedstock, and transport blending" />

      <div className="gmh-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="gmh-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="gmh-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`gmh-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-green-700 text-green-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="gmh-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="gmh-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Process Route (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByRoute}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityTPD" fill="#15803d" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="gmh-chart-card"><CardHeader><CardTitle className="text-sm">Feedstock Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={feedstockDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#15803d" /><Cell fill="#65a30d" /><Cell fill="#0d9488" /><Cell fill="#059669" /><Cell fill="#475569" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="gmh-chart-card"><CardHeader><CardTitle className="text-sm">Green Methanol Production Growth (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={prodTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="tpd" stroke="#65a30d" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="gmh-chart-card"><CardHeader><CardTitle className="text-sm">Carbon Intensity (gCO2/MJ) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={ciData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="ci" fill="#059669" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="gmh-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Feedstock</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">TPD</th><th className="px-2 py-2 text-right">Pure%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`gmh-table-row border-b hover:bg-green-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.processRoute}</td>
                  <td className="px-2 py-2 text-xs">{r.feedstock}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacityTPD}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.purity}</td>
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
        <div className="gmh-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="gmh-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#15803d" /><Cell fill="#65a30d" /><Cell fill="#0d9488" /><Cell fill="#475569" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="gmh-chart-card"><CardHeader><CardTitle className="text-sm">Purity by Application (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={purityByApp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis domain={[95, 105]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="purity" fill="#15803d" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="gmh-chart-card"><CardHeader><CardTitle className="text-sm">Capacity vs Carbon Intensity (Batch)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), cap: r.capacityTPD, ci: r.carbonIntensity * 100 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="cap" stroke="#15803d" strokeWidth={2} name="TPD" /><Line type="monotone" dataKey="ci" stroke="#65a30d" strokeWidth={2} name="CI gCO2" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="gmh-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Application (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={Array.from(new Map(records.map((r) => [r.application, records.filter((x) => x.application === r.application).reduce((s, x) => s + x.capacityTPD, 0)])).entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, capacityTPD]) => ({ name: name.slice(0, 14), capacityTPD }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityTPD" fill="#0d9488" radius={[4,4,0,0]} name="TPD" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="gmh-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="gmh-insight-card border-l-4 border-l-green-700"><CardHeader><CardTitle className="text-sm text-green-800">Reliance Hazira: India&apos;s First Commercial Green Methanol</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Reliance Hazira commissioned 500TPD green methanol plant (GMH-0001) using renewable hydrogen from 2GW solar electrolysis combined with captured CO2 from biomass gasification. Methanol synthesis via copper-zinc-alumina catalyst at 250bar 250C producing 99.9% pure fuel-grade methanol. First shipment to Kandla Port for SCI dual-fuel coastal tanker converting from HFO to green methanol — 40% reduction in well-to-wake CO2 emissions. Reliance targeting 2,000TPD by 2028 for international shipping fuel supply under IMO 2030 greenhouse gas strategy. Cost competitiveness: green methanol at \u20b935/kg vs VLSFO at \u20b945/kg with carbon tax. Reliance developing green methanol bunkering hub at Hazira port for India-Singapore and India-Gulf shipping corridors.</p></CardContent></Card>
          <Card className="gmh-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Shipments: GMH-0005 and GMH-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">GMH-0005 (Pune NMMC to BPCL Mumbai, 14-day delay): 150TPD municipal solid waste biogas-to-methanol for M15 transport fuel blending — MSW feedstock contamination issue forced plant shutdown for 2 weeks. NMMC sorting facility overloaded during monsoon with 40% higher wet waste volume. BPCL Mumbai refinery M15 blending depot awaiting feedstock — BS-VI compliant blend requires methanol purity above 99%. GMH-0012 (Kalpakkam BARC to Chennai Evergreen, 21-day delay): 700TPD nuclear hydrogen green methanol delayed by AERB regulatory certification for nuclear-derived chemical product. IGC fuel from BARC fast breeder meets non-proliferation requirements but novel nuclear-to-methanol pathway requires new safety case. BARC developed catalyst withstanding trace tritium — Evergreen AER certification pending EU FuelEU Maritime compliance verification.</p></CardContent></Card>
          <Card className="gmh-insight-card border-l-4 border-l-teal-600"><CardHeader><CardTitle className="text-sm text-teal-700">NTPC Tuticorin: Solar Methanol Shipping Corridor</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">NTPC Tuticorin deployed 800TPD green methanol plant (GMH-0003) using solar-powered alkaline electrolysis producing green H2, combined with flue gas CO2 from existing NTPC coal plant for circular carbon utilization. Methanol synthesis at 99.9% purity meeting Maersk dual-fuel engine specification. Chennai Port bunkering hub for Maersk green shipping corridor India-Europe route — 18-day transit time replacing VLSFO. Each vessel saves 8,000 tonnes CO2 per voyage. NTPC leveraging 500MW solar farm at Ramagundam powering electrolyzer array. IMO certification for green methanol marine fuel obtained from DNV. India green shipping corridor network: Chennai-Mumbai, Kandla-Dubai, Vizag-Singapore targeting 15 methanol-fueled vessels by 2028. Total investment: \u20b93,500Cr including port bunkering infrastructure.</p></CardContent></Card>
          <Card className="gmh-insight-card border-l-4 border-l-lime-600"><CardHeader><CardTitle className="text-sm text-lime-700">Adani Offshore Wind e-Methanol: Zero-Carbon Marine Fuel</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Adani Green Energy commissioned 250TPD offshore wind-powered e-methanol plant (GMH-0004) off Gujarat coast — India&apos;s first offshore green methanol facility. 200MW offshore wind turbines directly power PEM electrolyzers, eliminating grid transmission losses. CO2 sourced from direct air capture unit co-located on platform, producing e-methanol with record-low 0.02 gCO2/MJ carbon intensity — 98% lower than conventional methanol. Floating production storage and offloading (FPSO) platform with onboard methanol storage for direct ship-to-ship bunkering at Mundra Port. Adani targeting 1,000TPD offshore e-methanol by 2030 across Gujarat and Tamil Nadu offshore wind zones. Cost premium: 15% vs H2+flue route but enables premium green shipping certification for EU ports under Carbon Border Adjustment Mechanism (CBAM).</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
