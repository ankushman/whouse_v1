'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface ReactorRecord {
  id: string;
  batchNo: string;
  componentType: string;
  reactorDesign: string;
  plasmaTemp: number;
  confinementTime: number;
  neutronFlux: number;
  heatLoad: number;
  weight: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: ReactorRecord[] = [
  { id: 'FER-0001', batchNo: 'FER-B2401', componentType: 'Toroidal Field Coil', reactorDesign: 'ITER-Derived Tokamak', plasmaTemp: 150, confinementTime: 500, neutronFlux: 2.8, heatLoad: 15, weight: 120, status: 'In Transit', priority: 'Critical', origin: 'Gandhinagar (ITER-India)', destination: 'Mumbai (BARC)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: '18-tonne TF coil segment' },
  { id: 'FER-0002', batchNo: 'FER-B2402', componentType: 'Divertor Plate', reactorDesign: 'STEAM Iterative Tokamak', plasmaTemp: 180, confinementTime: 400, neutronFlux: 3.5, heatLoad: 20, weight: 85, status: 'Delivered', priority: 'High', origin: 'Bengaluru (IISc)', destination: 'Chennai (IGCAR)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'W-tungsten monoblock' },
  { id: 'FER-0003', batchNo: 'FER-B2403', componentType: 'First Wall Panel', reactorDesign: 'SST-1 Upgrade', plasmaTemp: 120, confinementTime: 300, neutronFlux: 1.5, heatLoad: 10, weight: 45, status: 'Processing', priority: 'Medium', origin: 'Ahmedabad (IPR)', destination: 'Gandhinagar (PRL)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'Beryllium-coated FW panel' },
  { id: 'FER-0004', batchNo: 'FER-B2404', componentType: 'Cryostat Vessel', reactorDesign: 'DEMO Tokamak', plasmaTemp: 200, confinementTime: 800, neutronFlux: 4.2, heatLoad: 25, weight: 380, status: 'Delayed', priority: 'Critical', origin: 'Larsen & Toubro (Hazira)', destination: 'ITER Cadarache', shipDate: '2026-07-15', transitDays: 30, zone: 'West', remarks: 'Heavy cryostat section - port delay' },
  { id: 'FER-0005', batchNo: 'FER-B2405', componentType: 'Superconducting Cable', reactorDesign: 'SST-2 Tokamak', plasmaTemp: 160, confinementTime: 600, neutronFlux: 3.0, heatLoad: 18, weight: 25, status: 'In Transit', priority: 'High', origin: 'Mumbai (Homi Bhabha)', destination: 'Delhi (DAE HQ)', shipDate: '2026-07-21', transitDays: 3, zone: 'North', remarks: 'Nb3Sn SC cable spool' },
  { id: 'FER-0006', batchNo: 'FER-B2406', componentType: 'Neutral Beam Injector', reactorDesign: 'ADITYA-U Upgrade', plasmaTemp: 90, confinementTime: 200, neutronFlux: 0.8, heatLoad: 8, weight: 60, status: 'Delivered', priority: 'Medium', origin: 'Gandhinagar (IPR)', destination: 'Indore (DAE)', shipDate: '2026-07-17', transitDays: 2, zone: 'West', remarks: '80keV NBI unit' },
  { id: 'FER-0007', batchNo: 'FER-B2407', componentType: 'Blanket Module', reactorDesign: 'TBM ITER Test', plasmaTemp: 140, confinementTime: 450, neutronFlux: 2.5, heatLoad: 12, weight: 95, status: 'Processing', priority: 'Low', origin: 'Kolkata (Saha Institute)', destination: 'Mumbai (BARC)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'Li4SiO4 ceramic breeder' },
  { id: 'FER-0008', batchNo: 'FER-B2408', componentType: 'Vacuum Vessel Sector', reactorDesign: 'ITER-Derived Tokamak', plasmaTemp: 170, confinementTime: 550, neutronFlux: 3.2, heatLoad: 16, weight: 210, status: 'In Transit', priority: 'High', origin: 'Visakhapatnam (HSL)', destination: 'Chennai (IGCAR)', shipDate: '2026-07-19', transitDays: 3, zone: 'South', remarks: 'Double-wall SS sector' },
  { id: 'FER-0009', batchNo: 'FER-B2409', componentType: 'Diagnostic Port Plug', reactorDesign: 'STEAM Iterative Tokamak', plasmaTemp: 130, confinementTime: 350, neutronFlux: 1.8, heatLoad: 5, weight: 18, status: 'Delivered', priority: 'Medium', origin: 'Hyderabad (ARCI)', destination: 'Bengaluru (IISc)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'X-ray crystal spectrometer' },
  { id: 'FER-0010', batchNo: 'FER-B2410', componentType: 'Stellarator Coil', reactorDesign: 'Compact Stellarator', plasmaTemp: 100, confinementTime: 700, neutronFlux: 2.0, heatLoad: 7, weight: 35, status: 'Processing', priority: 'Critical', origin: 'Pune (NCL)', destination: 'Gandhinagar (IPR)', shipDate: '2026-07-24', transitDays: 1, zone: 'West', remarks: 'Non-planar modular coil' },
  { id: 'FER-0011', batchNo: 'FER-B2411', componentType: 'Plasma Heating System', reactorDesign: 'ADITYA-U Upgrade', plasmaTemp: 80, confinementTime: 150, neutronFlux: 0.5, heatLoad: 6, weight: 42, status: 'In Transit', priority: 'High', origin: 'Delhi (IIT-D)', destination: 'Gandhinagar (IPR)', shipDate: '2026-07-20', transitDays: 2, zone: 'North', remarks: 'ECH 42GHz gyrotron' },
  { id: 'FER-0012', batchNo: 'FER-B2412', componentType: 'Tritium Breeder Blanket', reactorDesign: 'DEMO Tokamak', plasmaTemp: 220, confinementTime: 1000, neutronFlux: 5.0, heatLoad: 30, weight: 150, status: 'Delivered', priority: 'Low', origin: 'Tiruvananthapuram (VSSC)', destination: 'Kalpakkam (IGCAR)', shipDate: '2026-07-14', transitDays: 3, zone: 'South', remarks: 'Lead-lithium eutectic test' },
  { id: 'FER-0013', batchNo: 'FER-B2413', componentType: 'Magnetic Sensor Array', reactorDesign: 'SST-2 Tokamak', plasmaTemp: 110, confinementTime: 380, neutronFlux: 1.2, heatLoad: 2, weight: 8, status: 'Delayed', priority: 'High', origin: 'Bhopal (AMPRI)', destination: 'Indore (DAE)', shipDate: '2026-07-12', transitDays: 10, zone: 'Central', remarks: 'Hall sensor calibration delay' },
  { id: 'FER-0014', batchNo: 'FER-B2414', componentType: 'Cooling Water Loop', reactorDesign: 'ITER-Derived Tokamak', plasmaTemp: 150, confinementTime: 480, neutronFlux: 2.6, heatLoad: 14, weight: 55, status: 'In Transit', priority: 'Medium', origin: 'Chennai (BHEL)', destination: 'Visakhapatnam (HSL)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'Pressurized water cooling panel' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Reactor Design', key: 'reactorDesign', options: [
    { value: 'ITER-Derived Tokamak', count: 3 }, { value: 'STEAM Iterative Tokamak', count: 2 }, { value: 'SST-1 Upgrade', count: 1 }, { value: 'DEMO Tokamak', count: 2 }, { value: 'SST-2 Tokamak', count: 2 }, { value: 'ADITYA-U Upgrade', count: 2 }, { value: 'TBM ITER Test', count: 1 }, { value: 'Compact Stellarator', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 3 }, { value: 'High', count: 4 }, { value: 'Medium', count: 4 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 5 }, { value: 'South', count: 5 }, { value: 'North', count: 2 }, { value: 'East', count: 1 }, { value: 'Central', count: 1 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Shipments', value: 14, sub: 'Active Components', color: 'text-purple-700' },
  { title: 'Avg Plasma Temp', value: '149 MK', sub: 'ITER Target: 150MK', color: 'text-orange-700' },
  { title: 'Avg Confinement', value: '464 ms', sub: 'Goal: 1000ms', color: 'text-blue-700' },
  { title: 'Total Weight', value: '1,378 T', sub: 'Heavy Components', color: 'text-emerald-700' },
];

export default function FusionEnergyReactorLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.componentType} ${r.reactorDesign} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof ReactorRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const componentTypeData = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.componentType.split(' ')[0]; map.set(k, (map.get(k) || 0) + r.neutronFlux); });
    return Array.from(map.entries()).map(([name, flux]) => ({ name: name.slice(0, 10), flux: Math.round(flux * 10) / 10 }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const plasmaTempTrend = useMemo(() => [
    { month: 'Jan', temp: 110 }, { month: 'Feb', temp: 118 }, { month: 'Mar', temp: 125 }, { month: 'Apr', temp: 132 }, { month: 'May', temp: 140 }, { month: 'Jun', temp: 146 }, { month: 'Jul', temp: 149 },
  ], []);

  const weightByDesign = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.reactorDesign.split(' ')[0]; map.set(k, (map.get(k) || 0) + r.weight); });
    return Array.from(map.entries()).map(([name, weight]) => ({ name: name.slice(0, 8), weight }));
  }, []);

  const confinementData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), time: r.confinementTime }));
  }, []);

  const priorityDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.priority, (map.get(r.priority) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const heatLoadData = useMemo(() => {
    return records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), load: r.heatLoad }));
  }, []);

  const COLORS = ['#581c87', '#7c2d12', '#1e3a5f', '#14532d', '#0c4a6e'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="fer-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Energy' }, { label: 'Fusion Reactor' }]} />
      <PageHeader title="Fusion Energy Reactor Logistics" description="Indian fusion reactor supply chain \u2014 Tokamak, Stellarator, ITER components & plasma confinement tracking" />

      <div className="fer-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="fer-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="fer-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`fer-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-purple-600 text-purple-700' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="fer-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="fer-chart-card"><CardHeader><CardTitle className="text-sm">Neutron Flux by Component (MW/m\u00b2)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={componentTypeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="flux" fill="#581c87" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="fer-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#581c87" /><Cell fill="#7c2d12" /><Cell fill="#1e3a5f" /><Cell fill="#14532d" /><Cell fill="#0c4a6e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="fer-chart-card"><CardHeader><CardTitle className="text-sm">Plasma Temperature Trend (MK)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={plasmaTempTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[100, 160]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="temp" stroke="#7c2d12" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="fer-chart-card"><CardHeader><CardTitle className="text-sm">Weight by Reactor Design (Tonnes)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={weightByDesign}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="weight" fill="#1e3a5f" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="fer-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Component</th><th className="px-2 py-2 text-left">Design</th><th className="px-2 py-2 text-right">MK</th><th className="px-2 py-2 text-right">ms</th><th className="px-2 py-2 text-right">Ton</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`fer-table-row border-b hover:bg-purple-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.componentType}</td>
                  <td className="px-2 py-2 text-xs">{r.reactorDesign}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.plasmaTemp}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.confinementTime}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.weight}</td>
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
        <div className="fer-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="fer-chart-card"><CardHeader><CardTitle className="text-sm">Confinement Time by Batch (ms)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={confinementData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="time" fill="#14532d" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="fer-chart-card"><CardHeader><CardTitle className="text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={priorityDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#dc2626" /><Cell fill="#d97706" /><Cell fill="#2563eb" /><Cell fill="#16a34a" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="fer-chart-card"><CardHeader><CardTitle className="text-sm">Heat Load by Batch (MW/m\u00b2)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={heatLoadData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="load" fill="#0c4a6e" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="fer-chart-card"><CardHeader><CardTitle className="text-sm">Plasma Temp vs Confinement Time</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), temp: r.plasmaTemp, time: r.confinementTime }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="temp" stroke="#7c2d12" strokeWidth={2} name="Temp (MK)" /><Line type="monotone" dataKey="time" stroke="#581c87" strokeWidth={2} name="Confine (ms)" /></LineChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="fer-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="fer-insight-card border-l-4 border-l-purple-500"><CardHeader><CardTitle className="text-sm text-purple-700">ITER-India Contribution: Cryostat & TF Coils</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India shoulders 9% of ITER components: cryostat (L&T Hazira, 3,850 tonnes total), 10% of TF coils (Nb3Sn superconductor, 18T peak field), in-vessel shielding, and cooling water systems. FER-0004 cryostat shipment to Cadarche France faces 30-day transit plus customs, current delay due to Mundra port congestion. L&T dedicated ITER fabrication barge scheduled for Aug 2026. Total ITER-India budget: \u20b92,500Cr committed.</p></CardContent></Card>
          <Card className="fer-insight-card border-l-4 border-l-orange-500"><CardHeader><CardTitle className="text-sm text-orange-700">Plasma Temperature Milestone: 149MK Average</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Current fleet average plasma temperature of 149MK is approaching ITER operational target of 150MK. SST-1 at IPR Gandhinagar achieved 150MK for 500ms in March 2026. ADITYA-U Upgrade targeting 200MK for stellarator-grade confinement. Key challenge: first-wall material survivability at &gt;10MW/m2 heat flux. BARC developing advanced tungsten coating with CVD process, projected 15% improvement in heat tolerance. Budget: \u20b9780Cr for FW R&D through 2028.</p></CardContent></Card>
          <Card className="fer-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">Compact Stellarator: India&apos;s Alternative Path</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">IPR Gandhinagar developing compact stellarator design as complement to tokamak program. Stellarator advantage: steady-state operation without plasma current drive. FER-0010 non-planar modular coil manufactured at NCL Pune using 3D-printed copper mandrel. Target: 100MK plasma, 700ms confinement (currently achieved in simulation). Joint program with Max Planck IPP Greifswald. Funding: \u20b9350Cr from DAE for Phase-1 prototype by 2029.</p></CardContent></Card>
          <Card className="fer-insight-card border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm text-blue-700">Supply Chain Risk: Delayed Shipments FER-0004 & FER-0013</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Two delayed shipments flagged. FER-0004 (380T cryostat vessel, L&T Hazira to ITER Cadarche) delayed 12 days at Mundra port due to oversized cargo handling capacity constraints. FER-0013 (magnetic sensor array, Bhopal to Indore) delayed 10 days for Hall sensor re-calibration after monsoon humidity damage. Mitigation: pre-booked heavy-lift vessel slots at Mundra, climate-controlled packaging for sensitive instruments. Financial impact: \u20b92.2Cr demurrage + expedite costs.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
