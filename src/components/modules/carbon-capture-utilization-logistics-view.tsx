'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface CCURecord {
  id: string;
  batchNo: string;
  captureTech: string;
  feedstock: string;
  utilization: string;
  captureCapacity: number;
  co2Purity: number;
  energyKWh: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: CCURecord[] = [
  { id: 'CCU-0001', batchNo: 'CCU-P2401', captureTech: 'Post-Combustion Amine', feedstock: 'Flue Gas (Coal)', utilization: 'Enhanced Oil Recovery', captureCapacity: 5000, co2Purity: 99.5, energyKWh: 320, status: 'In Transit', priority: 'Critical', origin: 'Singrauli (NTPC)', destination: 'Mumbai (ONGC EOR)', shipDate: '2026-07-20', transitDays: 4, zone: 'West', remarks: '5,000 TPA post-combustion MEA amine scrubbing unit from NTPC Singrauli for ONGC Mumbai offshore EOR injection at 1,500m depth' },
  { id: 'CCU-0002', batchNo: 'CCU-P2402', captureTech: 'Pre-Combustion Selexol', feedstock: 'Syngas (NG)', utilization: 'Urea Production', captureCapacity: 3200, co2Purity: 99.9, energyKWh: 180, status: 'Delivered', priority: 'High', origin: 'Gujrat (Reliance)', destination: 'Hazira (IFFCO Plant)', shipDate: '2026-07-18', transitDays: 1, zone: 'West', remarks: '3,200 TPA pre-combustion Selexol CO2 from Reliance Hazira gasification syngas for IFFCO urea synthesis at 140bar reactor' },
  { id: 'CCU-0003', batchNo: 'CCU-P2403', captureTech: 'Oxy-Fuel Combustion', feedstock: 'Petcoke', utilization: 'Building Material', captureCapacity: 2800, co2Purity: 97.8, energyKWh: 410, status: 'Processing', priority: 'High', origin: 'Jamnagar (Reliance)', destination: 'Mundra (Adani Cement)', shipDate: '2026-07-23', transitDays: 1, zone: 'West', remarks: '2,800 TPA oxy-fuel CO2 from Reliance Jamnagar petcoke gasifier for Adani Mundra carbonated concrete block manufacturing' },
  { id: 'CCU-0004', batchNo: 'CCU-P2404', captureTech: 'Direct Air Capture (DAC)', feedstock: 'Atmospheric CO2', utilization: 'Green Methanol', captureCapacity: 500, co2Purity: 99.8, energyKWh: 1800, status: 'In Transit', priority: 'Critical', origin: 'Kanyakumari (CarbonClean)', destination: 'Tuticorin (ACME Syn)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: '500 TPA DAC unit from CarbonClean Kanyakumari coastal site for ACME Tuticorin green methanol synthesis with renewable H2' },
  { id: 'CCU-0005', batchNo: 'CCU-P2405', captureTech: 'Calcium Looping', feedstock: 'Cement Kiln', utilization: 'Mineralization', captureCapacity: 4500, co2Purity: 95.2, energyKWh: 290, status: 'Delayed', priority: 'Medium', origin: 'Chhattisgarh (ACC Ltd)', destination: 'Raipur (Neyveli Lignite)', shipDate: '2026-07-12', transitDays: 14, zone: 'East', remarks: '4,500 TPA calcium looping CO2 capture from ACC Chhattisgarh cement kiln for Neyveli mineral carbonation &#8212; sorbent degradation delay' },
  { id: 'CCU-0006', batchNo: 'CCU-P2406', captureTech: 'Membrane Separation', feedstock: 'Biogas', utilization: 'Food-Grade CO2', captureCapacity: 1200, co2Purity: 99.99, energyKWh: 95, status: 'Delivered', priority: 'High', origin: 'Pune (Thermax Bio)', destination: 'Nashik (PepsiCo Bev)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: '1,200 TPA membrane CO2 from Thermax biogas upgrade for PepsiCo Nashik beverage carbonation &#8212; food-grade 99.99% purity' },
  { id: 'CCU-0007', batchNo: 'CCU-P2407', captureTech: 'Chemical Looping', feedstock: 'Steel Blast Furnace', utilization: 'Syngas Recycling', captureCapacity: 6000, co2Purity: 98.6, energyKWh: 250, status: 'In Transit', priority: 'Critical', origin: 'Jamshedpur (Tata Steel)', destination: 'Kalinganagar (JSW Steel)', shipDate: '2026-07-21', transitDays: 3, zone: 'East', remarks: '6,000 TPA chemical looping iron-oxide oxygen carrier for Tata Steel blast furnace gas recycling to JSW Kalinganagar' },
  { id: 'CCU-0008', batchNo: 'CCU-P2408', captureTech: 'Post-Combustion Amine', feedstock: 'Flue Gas (Gas)', utilization: 'Greenhouse Farming', captureCapacity: 800, co2Purity: 98.5, energyKWh: 310, status: 'Delivered', priority: 'Medium', origin: 'Dahej (GAIL)', destination: 'Sri Ganganagar (AgriVent)', shipDate: '2026-07-15', transitDays: 3, zone: 'North', remarks: '800 TPA amine CO2 from GAIL Dahej gas processing for AgriVent Sri Ganganagar tomato greenhouse CO2 enrichment at 1,200 ppm' },
  { id: 'CCU-0009', batchNo: 'CCU-P2409', captureTech: 'Electrochemical Capture', feedstock: 'Flue Gas (Power)', utilization: 'Sodium Carbonate', captureCapacity: 2000, co2Purity: 96.0, energyKWh: 420, status: 'Processing', priority: 'High', origin: 'Vijayawada (VST PS)', destination: 'Visakhapatnam (TCL Chem)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: '2,000 TPA electrochemical pH-swing CO2 capture from VST Vijayawada power plant for Tata Chemicals Vizag soda ash production' },
  { id: 'CCU-0010', batchNo: 'CCU-P2410', captureTech: 'Pre-Combustion Selexol', feedstock: 'Syngas (Coal)', utilization: 'Polycarbonate', captureCapacity: 3800, co2Purity: 99.7, energyKWh: 195, status: 'In Transit', priority: 'High', origin: 'Dhanbad (BCCL)', destination: 'Rishra (Hikal Chem)', shipDate: '2026-07-22', transitDays: 2, zone: 'East', remarks: '3,800 TPA Selexol CO2 from BCCL Dhanbad coal gasification for Hikal Rishra polycarbonate and phosgene-free isocyanate route' },
  { id: 'CCU-0011', batchNo: 'CCU-P2411', captureTech: 'Post-Combustion Amine', feedstock: 'Flue Gas (Refinery)', utilization: 'Algae Biofuel', captureCapacity: 1500, co2Purity: 92.0, energyKWh: 340, status: 'Delivered', priority: 'Medium', origin: 'Bina (BPCL)', destination: 'Bhilwara (Reliance Bio)', shipDate: '2026-07-17', transitDays: 5, zone: 'North', remarks: '1,500 TPA amine CO2 from BPCL Bina refinery flue gas for Reliance Bhilwara algae photobioreactor biofuel production' },
  { id: 'CCU-0012', batchNo: 'CCU-P2412', captureTech: 'Mineralization Direct', feedstock: 'Industrial Waste', utilization: 'Precipitated CaCO3', captureCapacity: 900, co2Purity: 85.0, energyKWh: 45, status: 'Delayed', priority: 'Low', origin: 'Jodhpur (Shree Cement)', destination: 'Ahmedabad (ACC Min)', shipDate: '2026-07-10', transitDays: 16, zone: 'West', remarks: '900 TPA direct mineralization of steel slag CO2 for Shree Cement precipitated CaCO3 filler &#8212; reactor seal gasket failure' },
  { id: 'CCU-0013', batchNo: 'CCU-P2413', captureTech: 'Oxy-Fuel Combustion', feedstock: 'Natural Gas', utilization: 'EOR Offshore', captureCapacity: 4200, co2Purity: 98.9, energyKWh: 380, status: 'In Transit', priority: 'Critical', origin: 'Kakinada (ONGC)', destination: 'Mumbai High (ONGC)', shipDate: '2026-07-20', transitDays: 3, zone: 'West', remarks: '4,200 TPA oxy-fuel CO2 from ONGC Kakinada gas processing for Mumbai High offshore EOR in Bassein field at 2,100m' },
  { id: 'CCU-0014', batchNo: 'CCU-P2414', captureTech: 'Bioenergy CCS (BECCS)', feedstock: 'Biomass Rice Husk', utilization: 'Carbon Negative Credit', captureCapacity: 3500, co2Purity: 99.2, energyKWh: 260, status: 'Processing', priority: 'Critical', origin: 'Guntur (IARI BECCS)', destination: 'Hyderabad (NICDC Reg)', shipDate: '2026-07-25', transitDays: 1, zone: 'South', remarks: '3,500 TPA BECCS rice husk gasification CO2 capture for National Carbon Credit registry &#8212; negative emissions certified' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Capture Tech', key: 'captureTech', options: [
    { value: 'Post-Combustion Amine', count: 4 }, { value: 'Pre-Combustion Selexol', count: 2 }, { value: 'Oxy-Fuel Combustion', count: 2 }, { value: 'Direct Air Capture (DAC)', count: 1 },
  ]},
  { label: 'Utilization', key: 'utilization', options: [
    { value: 'Enhanced Oil Recovery', count: 2 }, { value: 'Urea Production', count: 1 }, { value: 'Green Methanol', count: 1 }, { value: 'Carbon Negative Credit', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 5 }, { value: 'High', count: 5 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 5 }, { value: 'South', count: 4 }, { value: 'East', count: 3 }, { value: 'North', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Shipments', value: 14, sub: 'CCU Logistics Batches', color: 'text-teal-800' },
  { title: 'Total Capture Capacity', value: '39,400 TPA', sub: 'CO2 Utilization', color: 'text-cyan-700' },
  { title: 'Highest Purity', value: '99.99%', sub: 'Membrane Biogas', color: 'text-emerald-700' },
  { title: 'National Mission', value: '\u20b912,500Cr', sub: 'Carbon Capture Mission', color: 'text-teal-700' },
];

export default function CarbonCaptureUtilizationLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.captureTech} ${r.feedstock} ${r.utilization} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof CCURecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByTech = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const key = r.captureTech.split('(')[0].trim().slice(0, 18); map.set(key, (map.get(key) || 0) + r.captureCapacity); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, captureCapacity]) => ({ name, captureCapacity }));
  }, []);

  const utilizationDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.utilization, (map.get(r.utilization) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const marketTrend = useMemo(() => [
    { year: '2022', tpa: 800 }, { year: '2023', tpa: 3200 }, { year: '2024', tpa: 12000 }, { year: '2025', tpa: 28000 }, { year: '2026', tpa: 55000 }, { year: '2027', tpa: 120000 }, { year: '2028', tpa: 250000 },
  ], []);

  const purityData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), purity: r.co2Purity }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const energyByTech = useMemo(() => {
    return Array.from(new Map(records.map((r) => [r.captureTech.split('(')[0].trim().slice(0, 16), { name: r.captureTech.split('(')[0].trim().slice(0, 16), energy: r.energyKWh }])).entries()).map(([, v]) => ({ name: v.name, energy: v.energy }));
  }, []);

  const COLORS = ['#0d9488', '#14b8a6', '#0f766e', '#115e59', '#134e4a', '#047857'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="ccu-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Carbon Management' }, { label: 'CCU' }]} />
      <PageHeader title="Carbon Capture &amp; Utilization Logistics" description="Indian carbon capture utilization and storage &#8212; post-combustion amine MEA, pre-combustion Selexol, oxy-fuel combustion, direct air capture DAC, calcium looping, chemical looping, membrane biogas, electrochemical pH-swing, and BECCS biomass &#8214; utilization for EOR, urea, methanol, building materials, algae biofuel, food-grade CO2, and carbon-negative credits" />

      <div className="ccu-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="ccu-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="ccu-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`ccu-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-teal-700 text-teal-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="ccu-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="ccu-chart-card"><CardHeader><CardTitle className="text-sm">Capture Capacity by Technology (TPA)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByTech}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="captureCapacity" fill="#0d9488" radius={[4,4,0,0]} name="TPA" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ccu-chart-card"><CardHeader><CardTitle className="text-sm">Utilization Pathway Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={utilizationDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0d9488" /><Cell fill="#14b8a6" /><Cell fill="#0f766e" /><Cell fill="#115e59" /><Cell fill="#134e4a" /><Cell fill="#047857" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="ccu-chart-card"><CardHeader><CardTitle className="text-sm">India CCU Market Growth (TPA/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={marketTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="tpa" stroke="#14b8a6" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="ccu-chart-card"><CardHeader><CardTitle className="text-sm">CO2 Purity (%) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={purityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} domain={[80, 100]} /><Tooltip /><Bar dataKey="purity" fill="#0f766e" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="ccu-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Capture Tech</th><th className="px-2 py-2 text-left">Utilization</th><th className="px-2 py-2 text-right">TPA</th><th className="px-2 py-2 text-right">Purity%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`ccu-table-row border-b hover:bg-teal-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.captureTech.split('(')[0].trim()}</td>
                  <td className="px-2 py-2 text-xs">{r.utilization}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.captureCapacity.toLocaleString()}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.co2Purity}%</td>
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
        <div className="ccu-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="ccu-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0d9488" /><Cell fill="#14b8a6" /><Cell fill="#0f766e" /><Cell fill="#115e59" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="ccu-chart-card"><CardHeader><CardTitle className="text-sm">Energy Consumption by Technology (kWh/tonne CO2)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={energyByTech}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="energy" fill="#0d9488" radius={[4,4,0,0]} name="kWh/t" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ccu-chart-card"><CardHeader><CardTitle className="text-sm">Capacity vs Energy Intensity</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), cap: r.captureCapacity, energy: r.energyKWh }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="cap" stroke="#0d9488" strokeWidth={2} name="TPA" /><Line type="monotone" dataKey="energy" stroke="#14b8a6" strokeWidth={2} name="kWh/t" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="ccu-chart-card"><CardHeader><CardTitle className="text-sm">Feedstock Source Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={Array.from(new Map(records.map((r) => [r.feedstock, { name: r.feedstock, value: 1 }])).values())} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name.slice(0,12)} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0d9488" /><Cell fill="#14b8a6" /><Cell fill="#0f766e" /><Cell fill="#115e59" /><Cell fill="#134e4a" /><Cell fill="#047857" /><Cell fill="#065f46" /><Cell fill="#064e3b" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="ccu-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="ccu-insight-card border-l-4 border-l-teal-700"><CardHeader><CardTitle className="text-sm text-teal-800">India Carbon Capture Mission: 250,000 TPA by 2028</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s National Carbon Capture Mission targeting 250,000 tonnes per annum CO2 capture and utilization capacity by 2028 under the National Mission for Green India framework. Phase-1 (2024-2026): 55,000 TPA focusing on post-combustion amine scrubbing at NTPC Singrauli (5,000 TPA, CCU-0001) and Tata Steel Jamshedpur blast furnace (6,000 TPA, CCU-0007) for industrial-scale CO2 capture. Phase-2 (2026-2028): 195,000 TPA expansion including BECCS rice husk gasification at IARI Guntur (3,500 TPA, CCU-0014), DAC at CarbonClean Kanyakumari (500 TPA, CCU-0004), and 15 new industrial sites. Total investment &#8377;12,500Cr with &#8377;4,200Cr government subsidy under National Clean Energy Programme. India&apos;s CCU roadmap prioritizes high-value utilization: urea synthesis (&#8377;5,500/tonne CO2 credit), enhanced oil recovery (&#8377;3,800/tonne), and green methanol (&#8377;7,200/tonne). MoEFCC implementing carbon credit certification under Paris Agreement Article 6.4 mechanism for international carbon market access.</p></CardContent></Card>
          <Card className="ccu-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Shipments: CCU-0005 and CCU-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">CCU-0005 (ACC Chhattisgarh to Neyveli Lignite, 14-day delay): 4,500 TPA calcium looping CO2 capture unit from ACC Chhattisgarh cement kiln for Neyveli mineral carbonation &#8212; calcium oxide sorbent experiencing accelerated degradation at 650C cycling temperature, dropping from 92% to 71% capture efficiency after 300 cycles. ACC investigating dolomite-derived CaO with MgO stabilizer additive from Tata Steel Jamshedpur trial batch. Replacement sorbent shipment from Gujarat Fluorochemicals expected to restore 88% capture efficiency. CCU-0012 (Shree Cement Jodhpur to ACC Ahmedabad, 16-day delay): 900 TPA direct mineralization reactor for steel slag CO2-to-precipitated CaCO3 conversion &#8212; reactor high-pressure seal gasket (Viton FKM) failure at 35bar CO2 injection pressure due to unexpected temperature spike to 180C during exothermic carbonation. Shree Cement sourcing replacement GHL-HT perfluoroelastomer seals from Greene Tweed USA with 30-day lead time. Interim production using backup ambient-pressure carbonation at 40% capacity. Estimated revenue impact: &#8377;2.4Cr from lost precipitated CaCO3 sales to paint and plastic filler markets.</p></CardContent></Card>
          <Card className="ccu-insight-card border-l-4 border-l-cyan-600"><CardHeader><CardTitle className="text-sm text-cyan-700">Direct Air Capture: CarbonClean Kanyakumari Coastal Site</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">CarbonClean Solutions India operating 500 TPA DAC unit (CCU-0004) at Kanyakumari coastal site leveraging consistent 25-32C ambient temperature and 78% humidity optimal for solid amine sorbent CO2 adsorption. DAC process: ambient air drawn through structured amine-functionalized ceramic honeycomb contactors at 2.5 m/s face velocity, capturing 0.04% CO2 from atmosphere. Two-stage temperature-swing desorption at 85C and 120C achieves 99.8% CO2 purity suitable for ACME Tuticorin green methanol synthesis (&#8377;52/kg methanol production cost). Energy consumption 1,800 kWh/tonne CO2 &#8212; 5x higher than point-source capture but enables negative emissions certification under Carbon Removal Credits framework. CarbonClean targeting 5,000 TPA DAC expansion by 2027 with next-gen sorbent reducing energy to 900 kWh/tonne. India DAC potential: 10,000 TPA by 2030 across 20 coastal sites leveraging Arabian Sea and Bay of Bengal consistent humidity profiles. CO2-to-methanol: 3H2 + CO2 &#8594; CH3OH + H2O over Cu/ZnO/Al2O3 catalyst at 250C 50bar for ACME green methanol maritime fuel blending mandate.</p></CardContent></Card>
          <Card className="ccu-insight-card border-l-4 border-l-emerald-600"><CardHeader><CardTitle className="text-sm text-emerald-700">BECCS Rice Husk: Negative Emissions Certified</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">IARI New Delhi developing 3,500 TPA BECCS unit (CCU-0014) at Guntur Andhra Pradesh rice belt &#8214; rice husk biomass gasification with integrated CO2 capture achieving certified negative emissions. Process flow: 48,000 tonnes/year rice husk from Guntur-Nellore-Kurnool rice mills &#8594; fluidized bed gasification at 750C &#8594; syngas (CO+H2) with post-combustion MEA amine CO2 capture at 99.2% purity &#8594; captured CO2 sent to NICDC Hyderabad for carbon-negative credit registration. Net carbon balance: -3,500 tonnes CO2/year (biogenic carbon removed from atmosphere minus capture energy penalty). Revenue streams: &#8377;6,200/tonne carbon removal credits (&#8377;21.7Cr annual), biochar co-product (&#8377;8Cr from soil amendment sales), and syngas electricity (&#8377;3.2Cr from 2.5MW grid feed). India&apos;s BECCS potential estimated at 50 million tonnes CO2/year from agricultural residue (rice husk, wheat straw, sugarcane bagasse) by 2040. IARI pilot validated at 90% capacity factor over 6-month trial. MoEFCC registering BECCS as India&apos;s first UNFCCC Article 6.4 methodology for negative emissions credits. Next phase: scaling to 15,000 TPA at 3 additional rice belt sites in Punjab, Uttar Pradesh, and West Bengal by 2028.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
