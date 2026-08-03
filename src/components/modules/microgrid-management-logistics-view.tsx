'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface MGRecord {
  id: string;
  batchNo: string;
  microgridType: string;
  energySource: string;
  application: string;
  capacityKw: number;
  storageKWh: number;
  loads: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: MGRecord[] = [
  { id: 'MG-0001', batchNo: 'MG-G2401', microgridType: 'Solar + Battery', energySource: 'Rooftop PV 500kWp', application: 'Rural Village Electrification', capacityKw: 500, storageKWh: 1200, loads: 180, status: 'In Transit', priority: 'Critical', origin: 'Bengaluru (Ather Grid)', destination: 'Raichur (Karnataka PUC)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: '500kWp rooftop PV + 1,200 kWh LiFePO4 for Raichur village 180 household electrification under Saubhagya scheme' },
  { id: 'MG-0002', batchNo: 'MG-G2402', microgridType: 'Wind + Battery', energySource: 'Micro Wind 200kW', application: 'Island Community Power', capacityKw: 200, storageKWh: 800, loads: 95, status: 'Delivered', priority: 'High', origin: 'Chennai (Vestas Micro)', destination: 'Lakshadweep Minicoy (LAKD)', shipDate: '2026-07-18', transitDays: 3, zone: 'South', remarks: '200kW micro wind turbine + 800 kWh battery for Minicoy Island 95 household power replacing diesel gensets' },
  { id: 'MG-0003', batchNo: 'MG-G2403', microgridType: 'Solar + Diesel Hybrid', energySource: 'PV 800kWp + 200kW DG', application: 'Telecom Tower Cluster', capacityKw: 1000, storageKWh: 500, loads: 45, status: 'Processing', priority: 'High', origin: 'Gurgaon (Tata Power)', destination: 'Jaisalmer (RJ Discom)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: '800kWp PV + 200kW diesel backup + 500 kWh battery for 45 telecom tower sites in Jaisalmer desert cluster' },
  { id: 'MG-0004', batchNo: 'MG-G2404', microgridType: 'Biomass + Battery', energySource: 'Rice Husk Gasifier 300kW', application: 'Rice Mill Industrial Park', capacityKw: 300, storageKWh: 400, loads: 12, status: 'In Transit', priority: 'Critical', origin: 'Pune (Thermax Bio)', destination: 'Amravati (NTPC Biomass)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: '300kW rice husk gasifier + 400 kWh battery for Amravati rice mill industrial park 12 continuous loads' },
  { id: 'MG-0005', batchNo: 'MG-G2405', microgridType: 'Solar + FC', energySource: 'PV 400kWp + 100kW FC', application: 'Hospital Backup Power', capacityKw: 500, storageKWh: 2000, loads: 8, status: 'Delayed', priority: 'Medium', origin: 'Hyderabad (Bloom India)', destination: 'Nagpur (AIIMS Hospital)', shipDate: '2026-07-12', transitDays: 14, zone: 'West', remarks: '400kWp PV + 100kW Bloom FC + 2,000 kWh battery for AIIMS Nagpur 8 critical ward backup &#8212; FC stack delay' },
  { id: 'MG-0006', batchNo: 'MG-G2406', microgridType: 'Solar + Battery', energySource: 'Floating PV 350kWp', application: 'Water Treatment Plant', capacityKw: 350, storageKWh: 700, loads: 6, status: 'Delivered', priority: 'High', origin: 'Noida (Azure Power)', destination: 'Mathura (UP Jal Nigam)', shipDate: '2026-07-16', transitDays: 1, zone: 'North', remarks: '350kWp floating solar on Gomti reservoir + 700 kWh battery for Mathura water treatment 6 pump loads' },
  { id: 'MG-0007', batchNo: 'MG-G2407', microgridType: 'Wind + Solar Hybrid', energySource: 'Wind 150kW + PV 300kWp', application: 'University Campus', capacityKw: 450, storageKWh: 900, loads: 22, status: 'In Transit', priority: 'High', origin: 'Coimbatore (Sterling&amp;Wilson)', destination: 'Madurai (Anna University)', shipDate: '2026-07-21', transitDays: 1, zone: 'South', remarks: '150kW micro wind + 300kWp rooftop PV + 900 kWh battery for Anna University Madurai 22 building campus' },
  { id: 'MG-0008', batchNo: 'MG-G2408', microgridType: 'Solar + Battery', energySource: 'Carport PV 250kWp', application: 'EV Charging Hub', capacityKw: 250, storageKWh: 500, loads: 16, status: 'Delivered', priority: 'Medium', origin: 'Mumbai (Tata Power EV)', destination: 'Pune (ChargeZone Hub)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: '250kWp carport solar + 500 kWh battery for ChargeZone Pune 16-bay DC fast charging hub peak shaving' },
  { id: 'MG-0009', batchNo: 'MG-G2409', microgridType: 'Hydro + Battery', energySource: 'Micro Hydro 100kW', application: 'Hill Station Resort', capacityKw: 100, storageKWh: 300, loads: 15, status: 'Processing', priority: 'High', origin: 'Dehradun (JSW Energy)', destination: 'Mussoorie (UP Tourism)', shipDate: '2026-07-24', transitDays: 1, zone: 'North', remarks: '100kW micro hydro + 300 kWh battery for Mussoorie 15 hotel resort cluster seasonal peak management' },
  { id: 'MG-0010', batchNo: 'MG-G2410', microgridType: 'Solar + Battery + EV', energySource: 'PV 600kWp + V2G', application: 'Industrial Warehouse', capacityKw: 600, storageKWh: 1500, loads: 8, status: 'In Transit', priority: 'High', origin: 'Ahmedabad (Adani Solar)', destination: 'Surat (Reliance WMS)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: '600kWp PV + 1,500 kWh battery + 20 EV V2G fleet for Reliance Surat warehouse demand charge management' },
  { id: 'MG-0011', batchNo: 'MG-G2411', microgridType: 'Solar + Battery', energySource: 'Agrivoltaic 180kWp', application: 'Cold Storage Chain', capacityKw: 180, storageKWh: 600, loads: 4, status: 'Delivered', priority: 'Medium', origin: 'Jaipur (Hero Future)', destination: 'Alwar (Nafed Cold Store)', shipDate: '2026-07-17', transitDays: 1, zone: 'North', remarks: '180kWp agrivoltaic + 600 kWh battery for Nafed Alwar 4 cold storage potato-onion preservation 24/7 cooling' },
  { id: 'MG-0012', batchNo: 'MG-G2412', microgridType: 'Diesel + Battery ESS', energySource: 'Existing 500kW DG + BESS', application: 'Mining Off-Grid', capacityKw: 500, storageKWh: 1000, loads: 6, status: 'Delayed', priority: 'Low', origin: 'Ranchi (BHEL Energy)', destination: 'Jharkhand (Hindalco Mine)', shipDate: '2026-07-10', transitDays: 16, zone: 'East', remarks: '500kW diesel retrofit + 1,000 kWh BESS for Hindalco Jharkhand bauxite mine 6 continuous excavator loads &#8212; transformer delay' },
  { id: 'MG-0013', batchNo: 'MG-G2413', microgridType: 'Solar + FC + Battery', energySource: 'PV 300kWp + 50kW SOFC', application: 'Defence Forward Post', capacityKw: 350, storageKWh: 2500, loads: 3, status: 'In Transit', priority: 'Critical', origin: 'Bengaluru (BEL Energy)', destination: 'Leh (DRDO Battalion)', shipDate: '2026-07-20', transitDays: 5, zone: 'North', remarks: '300kWp PV + 50kW Bloom SOFC + 2,500 kWh battery for DRDO Leh forward post -30C winter operations' },
  { id: 'MG-0014', batchNo: 'MG-G2414', microgridType: 'Solar + Battery', energySource: 'Canal-Top PV 120kWp', application: 'Irrigation Pump Set', capacityKw: 120, storageKWh: 250, loads: 20, status: 'Processing', priority: 'Critical', origin: 'Gandhinagar (GSECL Solar)', destination: 'Kutch (GMDC Irrigation)', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: '120kWp canal-top solar + 250 kWh battery for Kutch 20 irrigation pump sets reducing diesel pump dependence by 80%' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Microgrid Type', key: 'microgridType', options: [
    { value: 'Solar + Battery', count: 6 }, { value: 'Wind + Battery', count: 1 }, { value: 'Solar + Diesel Hybrid', count: 1 }, { value: 'Biomass + Battery', count: 1 },
  ]},
  { label: 'Application', key: 'application', options: [
    { value: 'Rural Village Electrification', count: 1 }, { value: 'Island Community Power', count: 1 }, { value: 'Telecom Tower Cluster', count: 1 }, { value: 'Hospital Backup Power', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 5 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 4 }, { value: 'South', count: 3 }, { value: 'North', count: 5 }, { value: 'East', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Microgrids', value: 14, sub: 'Deployed Systems', color: 'text-amber-800' },
  { title: 'Total Capacity', value: '5,300 kW', sub: 'Combined Power', color: 'text-yellow-700' },
  { title: 'Total Storage', value: '12,550 kWh', sub: 'Battery + H2', color: 'text-orange-700' },
  { title: 'National Mission', value: '\u20b915,800Cr', sub: 'Smart Microgrid Programme', color: 'text-amber-700' },
];

export default function MicrogridManagementLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.microgridType} ${r.energySource} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof MGRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.microgridType, (map.get(r.microgridType) || 0) + r.capacityKw); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, capacityKw]) => ({ name: name.slice(0, 18), capacityKw }));
  }, []);

  const applicationDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application, (map.get(r.application) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name: name.slice(0, 22), value }));
  }, []);

  const marketTrend = useMemo(() => [
    { year: '2022', mw: 45 }, { year: '2023', mw: 120 }, { year: '2024', mw: 350 }, { year: '2025', mw: 800 }, { year: '2026', mw: 1800 }, { year: '2027', mw: 4200 }, { year: '2028', mw: 9500 },
  ], []);

  const storageData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), storageKWh: r.storageKWh }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const capacityByApp = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application, (map.get(r.application) || 0) + r.capacityKw); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, capacityKw]) => ({ name: name.slice(0, 18), capacityKw }));
  }, []);

  const COLORS = ['#d97706', '#b45309', '#92400e', '#78350f', '#f59e0b', '#fbbf24'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="mgm-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Energy Systems' }, { label: 'Microgrid' }]} />
      <PageHeader title="Microgrid Management Logistics" description="Indian microgrid energy systems &#8212; solar PV rooftop floating canal-top agrivoltaic, micro wind turbine, biomass gasifier rice husk, micro hydro, fuel cell SOFC PEM, battery BESS LiFePO4, hybrid solar-diesel, V2G electric vehicle-to-grid for village electrification island telecom hospital mining defence irrigation and industrial warehouse applications" />

      <div className="mgm-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="mgm-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="mgm-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`mgm-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-amber-700 text-amber-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="mgm-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="mgm-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Microgrid Type (kW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityKw" fill="#d97706" radius={[4,4,0,0]} name="kW" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="mgm-chart-card"><CardHeader><CardTitle className="text-sm">Application Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={applicationDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name.slice(0,10)} ${(percent * 100).toFixed(0)}%`}><Cell fill="#d97706" /><Cell fill="#b45309" /><Cell fill="#92400e" /><Cell fill="#78350f" /><Cell fill="#f59e0b" /><Cell fill="#fbbf24" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="mgm-chart-card"><CardHeader><CardTitle className="text-sm">India Microgrid Market Growth (MW/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={marketTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="mw" stroke="#f59e0b" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="mgm-chart-card"><CardHeader><CardTitle className="text-sm">Storage Capacity (kWh) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={storageData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="storageKWh" fill="#b45309" radius={[4,4,0,0]} name="kWh" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="mgm-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">kW</th><th className="px-2 py-2 text-right">kWh</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`mgm-table-row border-b hover:bg-amber-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.microgridType}</td>
                  <td className="px-2 py-2 text-xs">{r.application.slice(0, 24)}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacityKw}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.storageKWh.toLocaleString()}</td>
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
        <div className="mgm-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="mgm-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#d97706" /><Cell fill="#b45309" /><Cell fill="#92400e" /><Cell fill="#78350f" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="mgm-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Application (kW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByApp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityKw" fill="#d97706" radius={[4,4,0,0]} name="kW" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="mgm-chart-card"><CardHeader><CardTitle className="text-sm">Capacity vs Storage</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), kw: r.capacityKw, kwh: Math.round(r.storageKWh / 10) }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="kw" stroke="#d97706" strokeWidth={2} name="kW" /><Line type="monotone" dataKey="kwh" stroke="#f59e0b" strokeWidth={2} name="kWh/10" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="mgm-chart-card"><CardHeader><CardTitle className="text-sm">Load Count by Application</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={Array.from(new Map(records.map((r) => [r.application.slice(0, 16), { name: r.application.slice(0, 16), loads: r.loads }])).entries()).reduce((acc, [, v]) => { const e = acc.find((a) => a.name === v.name); if (e) e.loads += v.loads; else acc.push({...v}); return acc; }, [] as { name: string; loads: number }[]).sort((a, b) => b.loads - a.loads).slice(0, 6)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="loads" fill="#92400e" radius={[4,4,0,0]} name="Loads" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="mgm-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="mgm-insight-card border-l-4 border-l-amber-700"><CardHeader><CardTitle className="text-sm text-amber-800">India Smart Microgrid Programme: 9,500 MW by 2028</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s Ministry of New and Renewable Energy (MNRE) Smart Microgrid Programme targeting 9,500 MW installed microgrid capacity by 2028 under the National Solar Mission Phase-3 framework. Phase-1 (2024-2026): 1,800 MW focusing on solar-plus-battery rural electrification in Karnataka (MG-0001), Rajasthan telecom towers (MG-0003), and UP floating solar water treatment (MG-0006). Solar PV component cost reduced to &#8377;18/Wp from &#8377;35/Wp in 2022, with LiFePO4 battery pack at &#8377;4.5Cr/MWh. Phase-2 (2026-2028): 7,700 MW expansion including 2,500 MW island microgrids for Andaman-Lakshadweep (MG-0002), 1,500 MW defence forward posts (MG-0013), 1,200 MW cold storage agricultural chain (MG-0011), and 2,500 MW industrial microgrids with V2G integration (MG-0010). Total investment &#8377;15,800Cr with &#8377;8,200Cr from MNRE subsidy, &#8377;4,600Cr state contributions, and &#8377;3,000Cr private investment. India targeting 100,000 microgrid-connected villages by 2030, displacing 4.2 million diesel generators and reducing CO2 by 28 million tonnes/year. Microgrid controller: IoT-enabled cloud SCADA from Tata Power CDRL Bengaluru with 4G/LTE remote monitoring and AI-based load forecasting achieving 92% renewable fraction.</p></CardContent></Card>
          <Card className="mgm-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Deployments: MG-0005 and MG-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">MG-0005 (Bloom Energy Hyderabad to AIIMS Nagpur, 14-day delay): 400kWp PV + 100kW Bloom Energy SOFC fuel cell + 2,000 kWh battery for AIIMS Nagpur 8 critical ward backup power &#8214; Bloom SOFC stack delivery from US factory delayed by supply chain constraint on yttria-stabilized zirconia (YSZ) electrolyte material. SOFC operating at 850C internal reforming natural gas to H2+CO, 55% electrical efficiency. AIIMS Nagpur currently running on 3 x 500kW diesel gensets at &#8377;12/litre consuming 600 litres/day (&#8377;2.64Cr/month). Battery-only interim solution deployed at 60% capacity covering 5 of 8 wards. Full system expected operational by August 15 with SOFC commissioning requiring 72-hour thermal ramp-up protocol. MG-0012 (BHEL Ranchi to Hindalco Jharkhand mine, 16-day delay): 500kW diesel retrofit + 1,000 kWh BESS for Hindalco Jharkhand bauxite mining 6 continuous excavator loads &#8212; 2.5 MVA step-down transformer from Crompton Greaves delayed due to factory fire at Bhopal plant. Transformer critical for 415V BESS inverter grid-forming connection. Hindalco mine operating at 70% capacity using existing 500kW diesel genset at 24-hour operation. BHEL expediting transformer from alternate CG Aurangabad production line. Estimated production loss: 2,400 tonnes bauxite/day at &#8377;2,200/tonne (&#8377;52.8L/day revenue impact).</p></CardContent></Card>
          <Card className="mgm-insight-card border-l-4 border-l-yellow-600"><CardHeader><CardTitle className="text-sm text-yellow-700">DRDO Leh Forward Post: -30C Arctic Microgrid</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">MG-0013: 300kWp PV + 50kW Bloom SOFC + 2,500 kWh battery microgrid for DRDO forward post at Leh-Ladakh 3,500m altitude &#8214; India&apos;s highest-altitude defence microgrid operating at -30C winter conditions. Solar PV: bifacial HIT panels from Adani Solar with rear-side snow-reflected gain of 15% at high-altitude irradiance 2,200 kWh/m2/year (vs 1,800 at plains). Battery: thermal-management LiFePO4 from Amara Raja with insulated heated enclosure maintaining cells at 5-35C using waste heat from SOFC exhaust. SOFC fuel cell: Bloom Energy 50kW solid-oxide running on bottled LPG (propane-butane mix) at 850C internal temperature providing base-load power during 90-day winter when solar irradiance drops to 1.5 peak-sun-hours. System redundancy: triple-layer architecture &#8214; PV primary (day), battery buffer (4hr), SOFC backup (night/winter). DRDO targeting 15 additional forward posts across Siachen Glacier, Daulat Beg Oldi, and Galwan Valley by 2028 under Project Him-Microgrid at &#8377;850Cr total. Each post microgrid reduces diesel air-drop logistics by &#8377;4Cr/year per location. Current diesel supply: helicopter air-drop at &#8377;180/litre delivered vs &#8377;80/litre LPG delivered equivalent energy.</p></CardContent></Card>
          <Card className="mgm-insight-card border-l-4 border-l-orange-600"><CardHeader><CardTitle className="text-sm text-orange-700">V2G Microgrid: Reliance Surat Warehouse</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">MG-0010: 600kWp PV + 1,500 kWh stationary battery + 20 EV V2G fleet microgrid for Reliance Surat warehouse demand charge management &#8214; India&apos;s first commercial-scale vehicle-to-grid deployment. V2G system: 20 Tata Tigor EV fleet vehicles with bidirectional chargers from Ather Energy providing 100kW aggregate V2G discharge during evening peak (6-9 PM), reducing Reliance warehouse demand charge by 35% from &#8377;8.5/kVA/month to &#8377;5.5/kVA/month saving &#8377;1.44Cr annually. V2G protocol: CHAdeMO bidirectional DC at 10kW per vehicle, cycle management ensures minimum 80% SOC for next-day warehouse logistics duty. PV generation: 600kWp rooftop at 4.5 peak-sun-hours producing 2,700 kWh/day, excess to battery during 10AM-2PM. Stationary battery: 1,500 kWh LiFePO4 from Exicom Telematics providing 2.5hr peak shaving and frequency regulation ancillary revenue of &#8377;18L/month from GUVNL grid operator. Microgrid controller: AI-based dispatch optimization from IIT-Bombay startup using day-ahead load forecasting at 94% accuracy and real-time electricity price signal from Indian Energy Exchange (IEX). India V2G potential: 50 GWh storage from 3 million EVs by 2030 under FAME-III V2G incentive of &#8377;15,000/vehicle retrofit cost.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
