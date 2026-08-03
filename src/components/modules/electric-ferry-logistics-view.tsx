'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface EFRecord {
  id: string;
  batchNo: string;
  vesselType: string;
  propulsion: string;
  route: string;
  capacity: number;
  rangeKm: number;
  batteryKWh: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: EFRecord[] = [
  { id: 'EF-0001', batchNo: 'EF-V2401', vesselType: 'Passenger Ferry', propulsion: 'Battery Electric', route: 'Gateway of India &#8594; Elephanta', capacity: 200, rangeKm: 45, batteryKWh: 800, status: 'In Transit', priority: 'Critical', origin: 'Mumbai (Mazagon Dock)', destination: 'Elephanta Jetty (MTDC)', shipDate: '2026-07-20', transitDays: 0, zone: 'West', remarks: '200-pax battery-electric ferry for Mumbai Elephanta Island tourist route &#8212; 800 kWh LiFePO4, 45km range, 12 nautical mile crossing' },
  { id: 'EF-0002', batchNo: 'EF-V2402', vesselType: 'Ro-Ro Ferry', propulsion: 'Battery Electric', route: 'Kochi &#8594; Vypen Island', capacity: 500, rangeKm: 30, batteryKWh: 1200, status: 'Delivered', priority: 'High', origin: 'Ernakulam (Cochin Ship)', destination: 'Vypen Terminal (SWTD)', shipDate: '2026-07-18', transitDays: 0, zone: 'South', remarks: '500-pax Ro-Ro electric ferry for Kochi-Vypen with vehicle deck &#8212; 1,200 kWh LiFePO4, 8km each way, 15min crossing' },
  { id: 'EF-0003', batchNo: 'EF-V2403', vesselType: 'Catamaran Ferry', propulsion: 'Hybrid Electric-Diesel', route: 'Howrah &#8594; Shibpur (Hooghly)', capacity: 300, rangeKm: 60, batteryKWh: 600, status: 'Processing', priority: 'High', origin: 'Kolkata (Garden Reach)', destination: 'Shibpur Ghat (WBTD)', shipDate: '2026-07-23', transitDays: 0, zone: 'East', remarks: '300-pax hybrid catamaran for Hooghly River Howrah-Shibpur commuter &#8212; 600 kWh battery + 200kW diesel genset backup' },
  { id: 'EF-0004', batchNo: 'EF-V2404', vesselType: 'Passenger Ferry', propulsion: 'Battery Electric', route: 'Varanasi &#8594; Sarnath (Ganges)', capacity: 150, rangeKm: 35, batteryKWh: 500, status: 'In Transit', priority: 'Critical', origin: 'Varanasi (CESU)', destination: 'Sarnath Ghat (UPSTDC)', shipDate: '2026-07-19', transitDays: 0, zone: 'North', remarks: '150-pax solar-roof electric ferry for Varanasi-Sarnath heritage route &#8212; 500 kWh + 80kWp solar, Ganges heritage corridor' },
  { id: 'EF-0005', batchNo: 'EF-V2405', vesselType: 'Cargo Ferry', propulsion: 'Battery Electric', route: 'Mumbai Port &#8594; Nhava Sheva', capacity: 80, rangeKm: 25, batteryKWh: 1500, status: 'Delayed', priority: 'Medium', origin: 'Mumbai (L&amp;T Ship)', destination: 'JNPT Terminal (JNPT)', shipDate: '2026-07-12', transitDays: 10, zone: 'West', remarks: '80-tonne electric cargo feeder for Mumbai Port-JNPT container short-sea &#8212; 1,500 kWh, battery management system firmware delay' },
  { id: 'EF-0006', batchNo: 'EF-V2406', vesselType: 'Passenger Ferry', propulsion: 'Hydrogen Fuel Cell', route: 'Gujarat &#8594; Diu (Sea)', capacity: 250, rangeKm: 180, batteryKWh: 400, status: 'Delivered', priority: 'High', origin: 'Surat (ABG Shipyard)', destination: 'Diu Port (DPT)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: '250-pax hydrogen FC ferry for Surat-Diu sea route &#8212; 200kW PEM FC + 400 kWh battery buffer, 180km range' },
  { id: 'EF-0007', batchNo: 'EF-V2407', vesselType: 'Catamaran Ferry', propulsion: 'Battery Electric', route: 'Andaman &#8594; Havelock', capacity: 100, rangeKm: 70, batteryKWh: 2400, status: 'In Transit', priority: 'Critical', origin: 'Port Blair (SL Ship)', destination: 'Havelock Jetty (AAST)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: '100-pax electric catamaran for Port Blair-Havelock Island tourist route &#8212; 2,400 kWh, 70km open-sea range' },
  { id: 'EF-0008', batchNo: 'EF-V2408', vesselType: 'Passenger Ferry', propulsion: 'Battery Electric', route: 'Allahabad &#8594; Sangam (Ganges)', capacity: 120, rangeKm: 20, batteryKWh: 350, status: 'Delivered', priority: 'Medium', origin: 'Prayagraj (CESU)', destination: 'Sangam Ghat (UPSTDC)', shipDate: '2026-07-15', transitDays: 0, zone: 'North', remarks: '120-pax electric ferry for Prayagraj Sangam confluence religious route &#8212; 350 kWh, Kumbh Mela surge capacity' },
  { id: 'EF-0009', batchNo: 'EF-V2409', vesselType: 'Ro-Ro Ferry', propulsion: 'Hybrid Electric-LNG', route: 'Goa &#8594; Diu (Coastal)', capacity: 400, rangeKm: 250, batteryKWh: 800, status: 'Processing', priority: 'High', origin: 'Vasco (Goa Shipyard)', destination: 'Diu Terminal (DPT)', shipDate: '2026-07-24', transitDays: 1, zone: 'West', remarks: '400-pax hybrid electric-LNG ferry for Goa-Diu coastal route &#8212; 800 kWh battery + 300kW LNG genset, 250km range' },
  { id: 'EF-0010', batchNo: 'EF-V2410', vesselType: 'Cargo Ferry', propulsion: 'Battery Electric', route: 'Kolkata &#8594; Haldia (Hooghly)', capacity: 150, rangeKm: 55, batteryKWh: 1800, status: 'In Transit', priority: 'High', origin: 'Kolkata (GRSE)', destination: 'Haldia Dock (SYL)', shipDate: '2026-07-22', transitDays: 0, zone: 'East', remarks: '150-tonne electric cargo feeder for Kolkata-Haldia bulk commodity &#8212; 1,800 kWh, replacing 500kW diesel fleet' },
  { id: 'EF-0011', batchNo: 'EF-V2411', vesselType: 'Passenger Ferry', propulsion: 'Battery Electric', route: 'Chennai &#8594; Pulicat Lake', capacity: 80, rangeKm: 25, batteryKWh: 300, status: 'Delivered', priority: 'Medium', origin: 'Chennai (CSSL)', destination: 'Pulicat Jetty (TNSTDC)', shipDate: '2026-07-17', transitDays: 0, zone: 'South', remarks: '80-pax electric ferry for Chennai-Pulicat Lake bird sanctuary eco-tourism &#8212; 300 kWh, zero-emission wetland preserve' },
  { id: 'EF-0012', batchNo: 'EF-V2412', vesselType: 'Catamaran Ferry', propulsion: 'Battery Electric', route: 'Lakshadweep &#8594; Agatti', capacity: 60, rangeKm: 120, batteryKWh: 2000, status: 'Delayed', priority: 'Low', origin: 'Kochi (Cochin Ship)', destination: 'Agatti Island (LAKD)', shipDate: '2026-07-10', transitDays: 18, zone: 'South', remarks: '60-pax electric catamaran for Kochi-Agatti inter-island &#8212; 2,000 kWh, cyclone-rated hull certification delayed' },
  { id: 'EF-0013', batchNo: 'EF-V2413', vesselType: 'Passenger Ferry', propulsion: 'Hydrogen Fuel Cell', route: 'Gujarat &#8594; Somnath (Coastal)', capacity: 180, rangeKm: 150, batteryKWh: 350, status: 'In Transit', priority: 'Critical', origin: 'Bhavnagar (ABG Ship)', destination: 'Somnath Port (GMB)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: '180-pax hydrogen FC ferry for Bhavnagar-Somnath coastal pilgrimage &#8212; 150kW PEM FC + 350 kWh, Gujarat green H2 corridor' },
  { id: 'EF-0014', batchNo: 'EF-V2414', vesselType: 'Ro-Ro Ferry', propulsion: 'Battery Electric', route: 'Brahmaputra &#8594; Majuli Island', capacity: 200, rangeKm: 40, batteryKWh: 900, status: 'Processing', priority: 'Critical', origin: 'Guwahati (DFS)', destination: 'Majuli Ghat (AS IWTD)', shipDate: '2026-07-25', transitDays: 0, zone: 'East', remarks: '200-pax electric Ro-Ro for Brahmaputra Guwahati-Majuli &#8212; 900 kWh, world&apos;s largest river island, eco-sensitive zone' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Vessel Type', key: 'vesselType', options: [
    { value: 'Passenger Ferry', count: 6 }, { value: 'Catamaran Ferry', count: 3 }, { value: 'Ro-Ro Ferry', count: 3 }, { value: 'Cargo Ferry', count: 2 },
  ]},
  { label: 'Propulsion', key: 'propulsion', options: [
    { value: 'Battery Electric', count: 8 }, { value: 'Hydrogen Fuel Cell', count: 2 }, { value: 'Hybrid Electric-Diesel', count: 1 }, { value: 'Hybrid Electric-LNG', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 5 }, { value: 'High', count: 5 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 6 }, { value: 'South', count: 3 }, { value: 'East', count: 3 }, { value: 'North', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Vessels', value: 14, sub: 'Electric Ferry Fleet', color: 'text-sky-800' },
  { title: 'Total Battery', value: '13,750 kWh', sub: 'Combined Capacity', color: 'text-blue-700' },
  { title: 'Max Range', value: '250 km', sub: 'Goa-Diu Hybrid', color: 'text-indigo-700' },
  { title: 'National Mission', value: '\u20b98,200Cr', sub: 'Electric Water Transport', color: 'text-sky-700' },
];

export default function ElectricFerryLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.vesselType} ${r.propulsion} ${r.route} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof EFRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.vesselType, (map.get(r.vesselType) || 0) + r.capacity); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, capacity]) => ({ name, capacity }));
  }, []);

  const propulsionDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.propulsion, (map.get(r.propulsion) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const marketTrend = useMemo(() => [
    { year: '2022', vessels: 12 }, { year: '2023', vessels: 35 }, { year: '2024', vessels: 80 }, { year: '2025', vessels: 180 }, { year: '2026', vessels: 350 }, { year: '2027', vessels: 700 }, { year: '2028', vessels: 1500 },
  ], []);

  const batteryData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), batteryKWh: r.batteryKWh }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const rangeByPropulsion = useMemo(() => {
    return Array.from(new Map(records.map((r) => [r.propulsion.split(' ')[0], { name: r.propulsion.split(' ')[0], range: r.rangeKm }])).values());
  }, []);

  const COLORS = ['#0284c7', '#0369a1', '#075985', '#0c4a6e', '#0ea5e9', '#38bdf8'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="efy-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Maritime Transport' }, { label: 'Electric Ferry' }]} />
      <PageHeader title="Electric Ferry Logistics" description="Indian electric and hybrid ferry water transport &#8212; battery-electric passenger Ro-Ro cargo catamaran, hydrogen fuel cell PEM, hybrid electric-diesel and electric-LNG propulsion for inland river Ganges Brahmaputra Hooghly, coastal Goa Diu Gujarat, island Andaman Lakshadweep routes under National Electric Water Transport Mission" />

      <div className="efy-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="efy-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="efy-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`efy-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-sky-700 text-sky-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="efy-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="efy-chart-card"><CardHeader><CardTitle className="text-sm">Passenger Capacity by Vessel Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacity" fill="#0284c7" radius={[4,4,0,0]} name="pax/tonnes" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="efy-chart-card"><CardHeader><CardTitle className="text-sm">Propulsion Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={propulsionDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0284c7" /><Cell fill="#0369a1" /><Cell fill="#075985" /><Cell fill="#0c4a6e" /><Cell fill="#0ea5e9" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="efy-chart-card"><CardHeader><CardTitle className="text-sm">India Electric Ferry Fleet Growth (vessels/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={marketTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="vessels" stroke="#0ea5e9" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="efy-chart-card"><CardHeader><CardTitle className="text-sm">Battery Capacity (kWh) by Vessel</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={batteryData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="batteryKWh" fill="#0369a1" radius={[4,4,0,0]} name="kWh" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="efy-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-left">Propulsion</th><th className="px-2 py-2 text-right">Pax/Ton</th><th className="px-2 py-2 text-right">Range</th><th className="px-2 py-2 text-right">kWh</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Origin &#8594; Dest</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`efy-table-row border-b hover:bg-sky-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.vesselType}</td>
                  <td className="px-2 py-2 text-xs">{r.propulsion.split(' ').slice(0, 2).join(' ')}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacity}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.rangeKm}km</td>
                  <td className="px-2 py-2 text-right font-mono">{r.batteryKWh}</td>
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
        <div className="efy-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="efy-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0284c7" /><Cell fill="#0369a1" /><Cell fill="#075985" /><Cell fill="#0c4a6e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="efy-chart-card"><CardHeader><CardTitle className="text-sm">Range (km) by Propulsion Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={rangeByPropulsion}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="range" fill="#0284c7" radius={[4,4,0,0]} name="km" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="efy-chart-card"><CardHeader><CardTitle className="text-sm">Battery kWh vs Passenger Capacity</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), kWh: r.batteryKWh, pax: r.capacity }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="kWh" stroke="#0284c7" strokeWidth={2} name="kWh" /><Line type="monotone" dataKey="pax" stroke="#0ea5e9" strokeWidth={2} name="pax" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="efy-chart-card"><CardHeader><CardTitle className="text-sm">Fleet by Zone and Propulsion</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={Array.from(new Map(records.map((r) => [`${r.zone}-${r.propulsion.split(' ')[0]}`, { name: `${r.zone}`, count: 1, type: r.propulsion.split(' ')[0] }])).entries()).reduce((acc, [key, val]) => { const existing = acc.find((a) => a.name === val.name); if (existing) existing.count += val.count; else acc.push({ name: val.name, count: val.count }); return acc; }, [] as { name: string; count: number }[]).sort((a, b) => b.count - a.count)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="count" fill="#0369a1" radius={[4,4,0,0]} name="Vessels" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="efy-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="efy-insight-card border-l-4 border-l-sky-700"><CardHeader><CardTitle className="text-sm text-sky-800">National Electric Water Transport Mission: 1,500 Vessels by 2028</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s Ministry of Ports, Shipping and Waterways (MoPSW) National Electric Water Transport Mission targeting 1,500 electric and hybrid ferry vessels by 2028 across inland waterways, coastal routes, and island territories. Phase-1 (2024-2026): 350 vessels deployed on 12 priority routes &#8212; Ganges Varanasi-Sarnath (EF-0004), Brahmaputra Guwahati-Majuli (EF-0014), Kochi-Vypen (EF-0002), Mumbai Elephanta (EF-0001), and Hooghly Howrah-Shibpur (EF-0003). Battery technology: LiFePO4 cells from Exicom Telematics Hyderabad and Amara Raja Chennai at &#8377;4.5Cr/MWh pack cost (target &#8377;2.8Cr/MWh by 2028). Charging infrastructure: 50 kW shore-based fast chargers at 28 ports, 150 kW opportunity charging at 12 intermediate jetties. Phase-2 (2026-2028): 1,150 additional vessels including hydrogen fuel cell ferries on Gujarat coastal corridor (EF-0006, EF-0013) and Andaman-Lakshadweep inter-island routes (EF-0007, EF-0012). Total investment &#8377;8,200Cr with &#8377;3,500Cr from Sagarmala Programme and &#8377;4,700Cr from state governments and private operators. India Inland Waterways Authority (IWAI) estimating 60% reduction in waterway transport emissions and &#8377;450Cr annual fuel savings across national waterway network.</p></CardContent></Card>
          <Card className="efy-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Vessels: EF-0005 and EF-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">EF-0005 (L&amp;T Mumbai to JNPT, 10-day delay): 80-tonne electric cargo feeder for Mumbai Port-JNPT container short-sea route &#8212; battery management system (BMS) firmware v3.2.1 exhibiting cell-balancing drift exceeding 50mV threshold during rapid charge at 150 kW, triggering charge safety interlock cutoff at 80% SOC instead of target 95%. L&amp;T Shipbuilding working with BMS provider Star Plus Electronics Noida on firmware patch v3.2.4 implementing adaptive cell-balancing algorithm with temperature-compensated voltage tracking. JNPT cargo backlog estimated at 200 TEU/day affecting 3 shipping lines. EF-0012 (Cochin Ship to Agatti Island, 18-day delay): 60-pax electric catamaran for Kochi-Agatti Lakshadweep inter-island route &#8212; Indian Register of Shipping (IRS) cyclone-rated hull certification pending, requiring additional forward bulkhead reinforcement to meet Category-5 cyclone structural load requirement of 45 kN/m2 wind pressure at 35m/s sustained gusts. Cochin Shipyard retrofitting 8mm DH36 steel stiffener plates at additional &#8377;1.2Cr cost. Lakshadweep Administration tourism season impact: estimated &#8377;3.5Cr lost revenue from 45 days of missed tourist sailings. Replacement diesel catamaran deployed temporarily consuming 800 liters/day diesel.</p></CardContent></Card>
          <Card className="efy-insight-card border-l-4 border-l-blue-600"><CardHeader><CardTitle className="text-sm text-blue-700">Hydrogen Fuel Cell Ferries: Gujarat Green H2 Maritime Corridor</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Gujarat emerging as India&apos;s hydrogen fuel cell ferry hub with two FC vessels deployed: EF-0006 Surat-Diu (250-pax, 200kW PEM FC + 400 kWh battery, 180km range) and EF-0013 Bhavnagar-Somnath (180-pax, 150kW PEM FC + 350 kWh, 150km range). PEM fuel cell stacks from Bloom Energy India Pune using Ballard FCgen-HD technology with 30,000-hour durability target. Green hydrogen supplied from Adani Kutch electrolyzer (10 MW alkaline) at &#8377;280/kg H2 delivered to Surat and Bhavnagar bunkering terminals. H2 storage: 350 bar Type IV onboard tanks from Hexagon Purus Gurgaon (same supplier as H2S-0001). FC system efficiency: 55% electrical, 85% with waste-heat recovery for cabin heating. Range advantage: 180km FC-only vs 70km battery-only for equivalent vessel weight &#8214; critical for open-sea routes where charging infrastructure unavailable. Gujarat Maritime Board targeting 10 hydrogen FC ferries across 5 coastal-pilgrimage routes (Somnath, Dwarka, Porbandar, Diu, Gir Somnath) by 2028 under Gujarat Green H2 Maritime Corridor with &#8377;1,800Cr state investment.</p></CardContent></Card>
          <Card className="efy-insight-card border-l-4 border-l-indigo-600"><CardHeader><CardTitle className="text-sm text-indigo-700">Brahmaputra Electric Ferry: World&apos;s Largest River Island</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">EF-0014: 200-pax electric Ro-Ro ferry for Guwahati-Majuli Brahmaputra River route serving Majuli Island &#8214; world&apos;s largest river island at 880 km2, shrinking from 1,250 km2 due to erosion, now UNESCO tentative World Heritage Site. Vessel specifications: 900 kWh LiFePO4 battery pack from Amara Raja Chennai, 35km range, 4km crossing at 15 knots, charging at Guwahati-Assam IWTD jetty with 200 kW dual-plug charger during 90-minute turnaround. Assam Inland Water Transport Development (AS IWTD) operating under &#8377;680Cr state electric waterway programme with 25 battery-electric vessels planned across Brahmaputra-Barak river system. Environmental impact: replacing 12 diesel ferries consuming 4,200 liters/day diesel (&#8377;3.8Cr annual fuel cost, 11,000 tonnes CO2/year). Majuli&apos;s Satra (Vaishnavite monasteries) and Mask dance tradition draw 200,000 annual tourists requiring reliable zero-emission transport. Vessel designed with shallow draft 1.8m for low-water Brahmaputra navigation (minimum depth 2.5m in dry season) and reinforced bow for floating debris common during monsoon flooding. Charging infrastructure integrated with Assam State Electricity Board grid supplemented by 500 kWp floating solar array on Brahmaputra near Guwahati.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
