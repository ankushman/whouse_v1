'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface FCRecord {
  id: string;
  batchNo: string;
  cellType: string;
  stackConfig: string;
  application: string;
  powerKW: number;
  efficiency: number;
  stackLifeHrs: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: FCRecord[] = [
  { id: 'FCS-0001', batchNo: 'FCS-B2401', cellType: 'PEM', stackConfig: '100-cell 80kW', application: 'Bus Fleet', powerKW: 80, efficiency: 58, stackLifeHrs: 20000, status: 'In Transit', priority: 'Critical', origin: 'Pune (BHEL FC)', destination: 'Delhi (DTC Bus Depot)', shipDate: '2026-07-20', transitDays: 3, zone: 'West', remarks: 'Delhi Transport 100 FC bus fleet Phase-2' },
  { id: 'FCS-0002', batchNo: 'FCS-B2402', cellType: 'PEM', stackConfig: '200-cell 150kW', application: 'Truck Freight', powerKW: 150, efficiency: 55, stackLifeHrs: 25000, status: 'Delivered', priority: 'High', origin: 'Chennai (Ashok Leyland)', destination: 'Mumbai (Tata Freight)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'NH48 FC freight truck 25-ton payload' },
  { id: 'FCS-0003', batchNo: 'FCS-B2403', cellType: 'SOFC', stackConfig: '50-cell 5kW', application: 'Telecom Tower', powerKW: 5, efficiency: 62, stackLifeHrs: 40000, status: 'Processing', priority: 'Medium', origin: 'Bengaluru (IISc FC Lab)', destination: 'Guwahati (Airtel Tower)', shipDate: '2026-07-22', transitDays: 5, zone: 'South', remarks: 'NE India tower backup replacing diesel genset' },
  { id: 'FCS-0004', batchNo: 'FCS-B2404', cellType: 'PEM', stackConfig: '400-cell 300kW', application: 'Railway Locomotive', powerKW: 300, efficiency: 56, stackLifeHrs: 30000, status: 'Delayed', priority: 'Critical', origin: 'Kolkata (RCF Railways)', destination: 'Varanasi (NR Railways)', shipDate: '2026-07-14', transitDays: 11, zone: 'East', remarks: 'Vande Bharat FC hybrid retrofit locomotive' },
  { id: 'FCS-0005', batchNo: 'FCS-B2405', cellType: 'AFC', stackConfig: '60-cell 10kW', application: 'Spacecraft EPS', powerKW: 10, efficiency: 65, stackLifeHrs: 10000, status: 'In Transit', priority: 'Critical', origin: 'Thiruvananthapuram (VSSC-ISRO)', destination: 'Bengaluru (ISRO HQ)', shipDate: '2026-07-21', transitDays: 3, zone: 'South', remarks: 'Gaganyaan FC auxiliary power unit' },
  { id: 'FCS-0006', batchNo: 'FCS-B2406', cellType: 'PEM', stackConfig: '80-cell 60kW', application: 'Forklift Fleet', powerKW: 60, efficiency: 57, stackLifeHrs: 18000, status: 'Delivered', priority: 'Medium', origin: 'Manesar (Maruti Suzuki)', destination: 'Gurgaon (Honda Warehouse)', shipDate: '2026-07-17', transitDays: 1, zone: 'North', remarks: 'Warehouse FC forklift zero-emission indoor' },
  { id: 'FCS-0007', batchNo: 'FCS-B2407', cellType: 'SOFC', stackConfig: '100-cell 25kW', application: 'Hotel CHP', powerKW: 25, efficiency: 85, stackLifeHrs: 60000, status: 'Processing', priority: 'Low', origin: 'Mumbai (Thermax Energy)', destination: 'Goa (Taj Hotels)', shipDate: '2026-07-23', transitDays: 2, zone: 'West', remarks: 'Combined heat power hotel trigeneration' },
  { id: 'FCS-0008', batchNo: 'FCS-B2408', cellType: 'PEM', stackConfig: '150-cell 120kW', application: 'Mining Dump Truck', powerKW: 120, efficiency: 54, stackLifeHrs: 22000, status: 'In Transit', priority: 'High', origin: 'Dhanbad (BEML Mining)', destination: 'Jharia (CIL Opencast)', shipDate: '2026-07-19', transitDays: 1, zone: 'East', remarks: 'Underground mining zero-emission 100T dumper' },
  { id: 'FCS-0009', batchNo: 'FCS-B2409', cellType: 'DMFC', stackConfig: '40-cell 2kW', application: 'Military Field Unit', powerKW: 2, efficiency: 42, stackLifeHrs: 5000, status: 'Delivered', priority: 'High', origin: 'Pune (DRDO Lab)', destination: 'Leh (Indian Army)', shipDate: '2026-07-16', transitDays: 5, zone: 'West', remarks: 'Portable methanol FC for forward base power' },
  { id: 'FCS-0010', batchNo: 'FCS-B2410', cellType: 'PEM', stackConfig: '300-cell 250kW', application: 'Marine Vessel', powerKW: 250, efficiency: 56, stackLifeHrs: 28000, status: 'Processing', priority: 'Medium', origin: 'Kochi (GRSE Shipyard)', destination: 'Mumbai (SCI Ferry)', shipDate: '2026-07-24', transitDays: 3, zone: 'South', remarks: 'Mumbai RoRo ferry FC propulsion zero tailpipe' },
  { id: 'FCS-0011', batchNo: 'FCS-B2411', cellType: 'SOFC', stackConfig: '80-cell 15kW', application: 'Data Center UPS', powerKW: 15, efficiency: 80, stackLifeHrs: 50000, status: 'In Transit', priority: 'High', origin: 'Hyderabad (Reliance Jio)', destination: 'Chennai (Azure DC)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: 'DC backup SOFC 99.99% uptime 72hr runtime' },
  { id: 'FCS-0012', batchNo: 'FCS-B2412', cellType: 'PEM', stackConfig: '50-cell 30kW', application: 'Airport GSE', powerKW: 30, efficiency: 59, stackLifeHrs: 15000, status: 'Delivered', priority: 'Medium', origin: 'Bengaluru (HAL Airport)', destination: 'Delhi (DIAL Tarmac)', shipDate: '2026-07-13', transitDays: 2, zone: 'South', remarks: 'Airport ground support equipment FC tractor' },
  { id: 'FCS-0013', batchNo: 'FCS-B2413', cellType: 'AFC', stackConfig: '100-cell 20kW', application: 'Submarine AIP', powerKW: 20, efficiency: 68, stackLifeHrs: 12000, status: 'Delayed', priority: 'Critical', origin: 'Vishakapatnam (MDL Naval)', destination: 'Mumbai (NRDL Navy)', shipDate: '2026-07-11', transitDays: 15, zone: 'East', remarks: 'Scorpene-class submarine Air-Independent Propulsion' },
  { id: 'FCS-0014', batchNo: 'FCS-B2414', cellType: 'PEM', stackConfig: '200-cell 180kW', application: 'City Taxi Fleet', powerKW: 180, efficiency: 57, stackLifeHrs: 20000, status: 'In Transit', priority: 'High', origin: 'Chennai (Ola EV)', destination: 'Hyderabad (OLA FC Hub)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'FC taxi Phase-1 200 vehicles Hyderabad' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Cell Type', key: 'cellType', options: [
    { value: 'PEM', count: 9 }, { value: 'SOFC', count: 3 }, { value: 'AFC', count: 2 },
  ]},
  { label: 'Application', key: 'application', options: [
    { value: 'Bus Fleet', count: 1 }, { value: 'Truck Freight', count: 1 }, { value: 'Telecom Tower', count: 1 }, { value: 'Railway Locomotive', count: 1 }, { value: 'Spacecraft EPS', count: 1 }, { value: 'Forklift Fleet', count: 1 }, { value: 'Hotel CHP', count: 1 }, { value: 'Mining Dump Truck', count: 1 }, { value: 'Military Field Unit', count: 1 }, { value: 'Marine Vessel', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 5 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 7 }, { value: 'West', count: 4 }, { value: 'East', count: 2 }, { value: 'North', count: 1 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Stacks', value: 14, sub: 'FC Assemblies', color: 'text-cyan-800' },
  { title: 'Combined Power', value: '1,467 kW', sub: 'All Cell Types', color: 'text-teal-700' },
  { title: 'Avg Efficiency', value: '60.1%', sub: 'SOFC 85% CHP Peak', color: 'text-indigo-700' },
  { title: 'National Target', value: '\u20b925,000Cr', sub: 'Green Hydrogen FC 2030', color: 'text-emerald-700' },
];

export default function HydrogenFuelCellStackLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.cellType} ${r.stackConfig} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof FCRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const powerByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.cellType, (map.get(r.cellType) || 0) + r.powerKW); });
    return Array.from(map.entries()).map(([name, powerKW]) => ({ name, powerKW }));
  }, []);

  const typeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.cellType, (map.get(r.cellType) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const effTrend = useMemo(() => [
    { month: 'Jan', eff: 52 }, { month: 'Feb', eff: 54 }, { month: 'Mar', eff: 55 }, { month: 'Apr', eff: 57 }, { month: 'May', eff: 58 }, { month: 'Jun', eff: 59 }, { month: 'Jul', eff: 60 },
  ], []);

  const lifeData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), life: r.stackLifeHrs / 1000 }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const powerByApp = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application.split(' ')[0], (map.get(r.application.split(' ')[0]) || 0) + r.powerKW); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, powerKW]) => ({ name: name.slice(0, 10), powerKW }));
  }, []);

  const COLORS = ['#0c4a6e', '#0891b2', '#7c3aed', '#dc2626', '#059669'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="fcs-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Green Hydrogen' }, { label: 'Fuel Cell Stack' }]} />
      <PageHeader title="Hydrogen Fuel Cell Stack Logistics" description="Indian FC supply chain \u2014 PEM, SOFC, AFC, DMFC stacks for mobility, power backup, marine, defense, and space applications" />

      <div className="fcs-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="fcs-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="fcs-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`fcs-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-cyan-700 text-cyan-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="fcs-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="fcs-chart-card"><CardHeader><CardTitle className="text-sm">Power by Cell Type (kW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={powerByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="powerKW" fill="#0c4a6e" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="fcs-chart-card"><CardHeader><CardTitle className="text-sm">Cell Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0c4a6e" /><Cell fill="#0891b2" /><Cell fill="#7c3aed" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="fcs-chart-card"><CardHeader><CardTitle className="text-sm">Efficiency Trend (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={effTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[48, 65]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="eff" stroke="#0891b2" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="fcs-chart-card"><CardHeader><CardTitle className="text-sm">Stack Life by Batch (k-hrs)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={lifeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="life" fill="#7c3aed" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="fcs-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-left">Config</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">kW</th><th className="px-2 py-2 text-right">Eff%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`fcs-table-row border-b hover:bg-cyan-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.cellType}</td>
                  <td className="px-2 py-2 text-xs">{r.stackConfig}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.powerKW}</td>
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
        <div className="fcs-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="fcs-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0c4a6e" /><Cell fill="#0891b2" /><Cell fill="#7c3aed" /><Cell fill="#dc2626" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="fcs-chart-card"><CardHeader><CardTitle className="text-sm">Power by Application (kW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={powerByApp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="powerKW" fill="#dc2626" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="fcs-chart-card"><CardHeader><CardTitle className="text-sm">Efficiency vs Power (Batch View)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), eff: r.efficiency, power: r.powerKW }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="eff" stroke="#0891b2" strokeWidth={2} name="Eff%" /><Line type="monotone" dataKey="power" stroke="#0c4a6e" strokeWidth={2} name="kW" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="fcs-chart-card"><CardHeader><CardTitle className="text-sm">Stack Life Hours by Cell Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={Array.from(new Map(records.map((r) => [r.cellType, Math.max(...records.filter((x) => x.cellType === r.cellType).map((x) => x.stackLifeHrs))])).entries()).map(([name, life]) => ({ name, life: life / 1000 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="life" fill="#059669" radius={[4,4,0,0]} name="k-hrs" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="fcs-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="fcs-insight-card border-l-4 border-l-cyan-700"><CardHeader><CardTitle className="text-sm text-cyan-800">BHEL PEM Stack: India&apos;s Bus Fuel Cell Powerhouse</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">BHEL Pune delivered 80kW PEM fuel cell stacks (FCS-0001, 100-cell configuration) for Delhi Transport Corporation&apos;s 100-bus fleet Phase-2 under FAME-II subsidy. Each bus carries 4x 20kW stacks with compressed H2 at 350bar, range 450km per fill. BHEL developed indigenous Pt-on-C catalyst with 0.2mg/cm2 loading — 40% lower than imported Gore MEA. Cost reduction: stack at \u20b935/kW vs imported \u20b985/kW. Target: 1,000 FC buses across 10 cities by 2028, total \u20b94,500Cr under National Hydrogen Energy Mission. DTC reporting 30% lower per-km operating cost vs CNG bus and 85% reduction in particulate emissions.</p></CardContent></Card>
          <Card className="fcs-insight-card border-l-4 border-l-indigo-500"><CardHeader><CardTitle className="text-sm text-indigo-700">SOFC CHP: Thermax Hotel Trigeneration</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Thermax Mumbai supplied 25kW SOFC stacks (FCS-0007) for Taj Hotels Goa — India&apos;s first hotel trigeneration using SOFC for combined heat, power, and cooling. SOFC operates at 85% total efficiency (60% electrical + 25% thermal for hot water and absorption chilling). Bloom Energy India partnership for solid oxide technology transfer. Natural gas fed SOFC eliminates diesel backup — saving \u20b945L/year in fuel cost for the 200-room property. Stack life: 60,000 hours (7 years continuous). Water consumption: 60% lower than diesel generator for equivalent output. Thermax targeting 500 hotel SOFC installations across India by 2030, market size \u20b92,800Cr.</p></CardContent></Card>
          <Card className="fcs-insight-card border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm text-amber-700">Delayed Batches: FCS-0004 and FCS-0013</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">FCS-0004 (RCF Kolkata to NR Railways Varanasi, 11-day delay): 300kW PEM stacks for Vande Bharat FC hybrid locomotive — RCF awaiting RDSO safety certification for onboard hydrogen storage. 700bar tank system from Hexagon Purus Norway delayed by 3 weeks at Kolkata customs due to UN33 pressure vessel import compliance. RDSO testing scheduled for August first week. FCS-0013 (MDL Vizag to NRDL Navy, 15-day delay): 20kW AFC stacks for Scorpene submarine AIP — classified defense shipment requiring naval escort delayed due to monsoon sea conditions in Bay of Bengal. MDL proposing air transport via C-17 Globemaster to meet project deadline. Cost impact: \u20b912Cr expedited logistics.</p></CardContent></Card>
          <Card className="fcs-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">ISRO AFC Stack: Gaganyaan Power Revolution</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">VSSC Thiruvananthapuram produced 10kW AFC (alkaline fuel cell) stacks (FCS-0005) for Gaganyaan crew module auxiliary power — the first Indian crewed spacecraft to use fuel cell technology. AFC chosen over PEM for space due to zero precious metal catalyst requirement (uses nickel-based electrodes), critical for cost reduction in crewed missions. Operates with liquid hydrogen and oxygen reactants stored at cryogenic temperatures. VSSC demonstrated 10,000-hour endurance in ground test — sufficient for 7-day crewed mission with 50% margin. ISRO planning AFC for future Chandrayaan lunar surface rover power station: 50kW module operating in -173\u00b0C lunar night using regenerative fuel cell. Total ISRO FC programme budget: \u20b9850Cr through 2030.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
