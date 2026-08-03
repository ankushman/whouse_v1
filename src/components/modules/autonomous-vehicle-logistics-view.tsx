'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface AVRecord {
  id: string;
  batchNo: string;
  vehicleType: string;
  automationLevel: string;
  corridor: string;
  fleetSize: number;
  rangeKm: number;
  payloadTons: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: AVRecord[] = [
  { id: 'AVL-0001', batchNo: 'AVL-B2401', vehicleType: 'Tractor-Trailer', automationLevel: 'L4 Autonomous', corridor: 'Mumbai-Delhi NH48', fleetSize: 12, rangeKm: 800, payloadTons: 20, status: 'In Transit', priority: 'Critical', origin: 'Pune (Tata Motors)', destination: 'Gurgaon (DLF Warehouse)', shipDate: '2026-07-20', transitDays: 3, zone: 'West', remarks: 'L4 platooning 3-truck convoy first deployment' },
  { id: 'AVL-0002', batchNo: 'AVL-B2402', vehicleType: 'Container Prime Mover', automationLevel: 'L4 Autonomous', corridor: 'Chennai-Kolkata NH16', fleetSize: 8, rangeKm: 600, payloadTons: 25, status: 'Delivered', priority: 'High', origin: 'Chennai (TVS Logistics)', destination: 'Kolkata (DP World Terminal)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'Port-to-warehouse L4 autonomous container haul' },
  { id: 'AVL-0003', batchNo: 'AVL-B2403', vehicleType: 'Last-Mile Van', automationLevel: 'L3 Conditional', corridor: 'Bengaluru City Grid', fleetSize: 50, rangeKm: 150, payloadTons: 1.5, status: 'Processing', priority: 'Medium', origin: 'Bengaluru (Mahindra EV)', destination: 'Whitefield (Amazon FC)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Last-mile delivery bot fleet 50 units' },
  { id: 'AVL-0004', batchNo: 'AVL-B2404', vehicleType: 'Tanker Truck', automationLevel: 'L4 Autonomous', corridor: 'Gujarat Refinery Network', fleetSize: 6, rangeKm: 400, payloadTons: 30, status: 'Delayed', priority: 'Critical', origin: 'Vadodara (Reliance Petro)', destination: 'Jamnagar (Essar Depot)', shipDate: '2026-07-14', transitDays: 10, zone: 'West', remarks: 'Hazardous cargo AV license pending MoRTH' },
  { id: 'AVL-0005', batchNo: 'AVL-B2405', vehicleType: 'Flatbed Carrier', automationLevel: 'L3 Conditional', corridor: 'Delhi-Jaipur NH8', fleetSize: 10, rangeKm: 280, payloadTons: 15, status: 'In Transit', priority: 'High', origin: 'Manesar (Maruti Suzuki)', destination: 'Jaipur (Rajasthan DC)', shipDate: '2026-07-21', transitDays: 1, zone: 'North', remarks: 'Auto parts AV delivery reducing driver cost 40%' },
  { id: 'AVL-0006', batchNo: 'AVL-B2406', vehicleType: 'Refrigerated Truck', automationLevel: 'L4 Autonomous', corridor: 'Nashik-Mumbai Agra Rd', fleetSize: 8, rangeKm: 200, payloadTons: 8, status: 'Delivered', priority: 'Medium', origin: 'Nashik (Mahindra Truck)', destination: 'Navi Mumbai (Cold Chain DC)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'Perishable cold chain -30\u00b0C to +4\u00b0C' },
  { id: 'AVL-0007', batchNo: 'AVL-B2407', vehicleType: 'Mining Dump Truck', automationLevel: 'L5 Full', corridor: 'Coal India Jharia', fleetSize: 15, rangeKm: 50, payloadTons: 100, status: 'Processing', priority: 'Low', origin: 'Dhanbad (BEML Mining)', destination: 'Jharia (CIL opencast)', shipDate: '2026-07-23', transitDays: 1, zone: 'East', remarks: 'L5 autonomous mining 100-ton dumpers' },
  { id: 'AVL-0008', batchNo: 'AVL-B2408', vehicleType: 'Terminal Tractor', automationLevel: 'L4 Autonomous', corridor: 'JNPT Port Mumbai', fleetSize: 20, rangeKm: 15, payloadTons: 40, status: 'In Transit', priority: 'High', origin: 'Pune (Tata CE)', destination: 'Nhava Sheva (DP World)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'Port terminal automated container shunting' },
  { id: 'AVL-0009', batchNo: 'AVL-B2409', vehicleType: 'Tractor-Trailer', automationLevel: 'L3 Conditional', corridor: 'Hyderabad-Bangalore NH44', fleetSize: 14, rangeKm: 560, payloadTons: 20, status: 'Delivered', priority: 'High', origin: 'Hyderabad (Ashok Leyland)', destination: 'Bengaluru (Flipkart SC)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'E-commerce L3 highway freight corridor' },
  { id: 'AVL-0010', batchNo: 'AVL-B2410', vehicleType: 'Drone Delivery', automationLevel: 'L5 Full', corridor: 'Kerala Medicine Supply', fleetSize: 100, rangeKm: 30, payloadTons: 0.005, status: 'Processing', priority: 'Critical', origin: 'Thiruvananthapuram (DJI India)', destination: 'Kochi (Kerala Health)', shipDate: '2026-07-24', transitDays: 2, zone: 'South', remarks: 'Medical drone 5kg payload 50 village coverage' },
  { id: 'AVL-0011', batchNo: 'AVL-B2411', vehicleType: 'Container Prime Mover', automationLevel: 'L4 Autonomous', corridor: 'Kandla-Mundra Port Link', fleetSize: 6, rangeKm: 120, payloadTons: 25, status: 'In Transit', priority: 'Medium', origin: 'Ahmedabad (AMW Motors)', destination: 'Mundra (APM Terminals)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'Gujarat port interconnect autonomous freight' },
  { id: 'AVL-0012', batchNo: 'AVL-B2412', vehicleType: 'Last-Mile Van', automationLevel: 'L3 Conditional', corridor: 'Delhi NCR Micro Hub', fleetSize: 80, rangeKm: 80, payloadTons: 0.5, status: 'Delivered', priority: 'Low', origin: 'Manesar (Piaggio EV)', destination: 'Gurgaon (Blinkit Hubs)', shipDate: '2026-07-13', transitDays: 1, zone: 'North', remarks: 'Quick commerce 10-min delivery EV bots' },
  { id: 'AVL-0013', batchNo: 'AVL-B2413', vehicleType: 'Refrigerated Truck', automationLevel: 'L4 Autonomous', corridor: 'Pune-Mumbai Expressway', fleetSize: 5, rangeKm: 150, payloadTons: 10, status: 'Delayed', priority: 'High', origin: 'Pune (Switch Mobility)', destination: 'Mumbai (BigBasket FC)', shipDate: '2026-07-11', transitDays: 8, zone: 'West', remarks: 'L4 sensor calibration recall - LiDAR misalignment' },
  { id: 'AVL-0014', batchNo: 'AVL-B2414', vehicleType: 'Terminal Tractor', automationLevel: 'L4 Autonomous', corridor: 'Chennai Port ENNORE', fleetSize: 12, rangeKm: 10, payloadTons: 35, status: 'In Transit', priority: 'Critical', origin: 'Chennai (VE Commercial)', destination: 'Chennai Port (Chennai Customs)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Customs-bonded terminal automated tractor' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Vehicle Type', key: 'vehicleType', options: [
    { value: 'Tractor-Trailer', count: 2 }, { value: 'Container Prime Mover', count: 2 }, { value: 'Last-Mile Van', count: 2 }, { value: 'Tanker Truck', count: 1 }, { value: 'Flatbed Carrier', count: 1 }, { value: 'Refrigerated Truck', count: 2 }, { value: 'Mining Dump Truck', count: 1 }, { value: 'Terminal Tractor', count: 2 }, { value: 'Drone Delivery', count: 1 },
  ]},
  { label: 'Automation Level', key: 'automationLevel', options: [
    { value: 'L4 Autonomous', count: 7 }, { value: 'L3 Conditional', count: 4 }, { value: 'L5 Full', count: 2 }, { value: 'L2 Partial', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 5 }, { value: 'West', count: 6 }, { value: 'East', count: 1 }, { value: 'North', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Fleet Units', value: 346, sub: 'AV Vehicles Deployed', color: 'text-blue-800' },
  { title: 'Autonomous Corridors', value: 14, sub: 'Active Routes', color: 'text-indigo-700' },
  { title: 'Avg Fleet Size', value: '24.7', sub: 'Units per Corridor', color: 'text-cyan-700' },
  { title: 'Market Projection', value: '\u20b935,000Cr', sub: '2030 AV Logistics', color: 'text-violet-700' },
];

export default function AutonomousVehicleLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.vehicleType} ${r.automationLevel} ${r.corridor} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof AVRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const fleetByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.vehicleType.split(' ')[0]; map.set(k, (map.get(k) || 0) + r.fleetSize); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([name, fleet]) => ({ name: name.slice(0, 12), fleet }));
  }, []);

  const levelDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.automationLevel, (map.get(r.automationLevel) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const deploymentTrend = useMemo(() => [
    { month: 'Jan', units: 45 }, { month: 'Feb', units: 72 }, { month: 'Mar', units: 98 }, { month: 'Apr', units: 135 }, { month: 'May', units: 210 }, { month: 'Jun', units: 280 }, { month: 'Jul', units: 346 },
  ], []);

  const rangeData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), range: r.rangeKm }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const payloadByLevel = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.automationLevel, (map.get(r.automationLevel) || 0) + r.payloadTons); });
    return Array.from(map.entries()).map(([name, payload]) => ({ name, payload }));
  }, []);

  const COLORS = ['#1e3a5f', '#4f46e5', '#0891b2', '#d97706', '#dc2626'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="avl-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Smart Mobility' }, { label: 'Autonomous Vehicle' }]} />
      <PageHeader title="Autonomous Vehicle Logistics" description="Indian AV supply chain \u2014 L3/L4/L5 autonomous trucking, last-mile vans, port terminal tractors, mining dumpers, delivery drones" />

      <div className="avl-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="avl-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="avl-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`avl-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-blue-700 text-blue-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="avl-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="avl-chart-card"><CardHeader><CardTitle className="text-sm">Fleet Size by Vehicle Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={fleetByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="fleet" fill="#1e3a5f" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="avl-chart-card"><CardHeader><CardTitle className="text-sm">Automation Level Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={levelDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#1e3a5f" /><Cell fill="#4f46e5" /><Cell fill="#0891b2" /><Cell fill="#d97706" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="avl-chart-card"><CardHeader><CardTitle className="text-sm">AV Fleet Deployment Trend (units)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={deploymentTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="units" stroke="#4f46e5" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="avl-chart-card"><CardHeader><CardTitle className="text-sm">Range by Batch (km)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={rangeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="range" fill="#0891b2" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="avl-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-left">Level</th><th className="px-2 py-2 text-left">Corridor</th><th className="px-2 py-2 text-right">Fleet</th><th className="px-2 py-2 text-right">km</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`avl-table-row border-b hover:bg-blue-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.vehicleType}</td>
                  <td className="px-2 py-2 text-xs">{r.automationLevel}</td>
                  <td className="px-2 py-2 text-xs">{r.corridor}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.fleetSize}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.rangeKm}</td>
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
        <div className="avl-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="avl-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#1e3a5f" /><Cell fill="#4f46e5" /><Cell fill="#0891b2" /><Cell fill="#d97706" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="avl-chart-card"><CardHeader><CardTitle className="text-sm">Payload by Automation Level (tons)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={payloadByLevel}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="payload" fill="#d97706" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="avl-chart-card"><CardHeader><CardTitle className="text-sm">Fleet Size vs Range (Batch View)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), fleet: r.fleetSize, range: r.rangeKm }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="fleet" stroke="#1e3a5f" strokeWidth={2} name="Units" /><Line type="monotone" dataKey="range" stroke="#4f46e5" strokeWidth={2} name="km" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="avl-chart-card"><CardHeader><CardTitle className="text-sm">Payload Tons by Vehicle Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.vehicleType.split(' ')[0].slice(0, 10), payload: r.payloadTons }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="payload" fill="#dc2626" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="avl-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="avl-insight-card border-l-4 border-l-blue-800"><CardHeader><CardTitle className="text-sm text-blue-800">Mumbai-Delhi L4 Corridor: India&apos;s First Autonomous Highway</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Tata Motors deployed India&apos;s first L4 autonomous tractor-trailer platoon on NH48 Mumbai-Delhi corridor (AVL-0001, 12 trucks). V2X communication enables 3-truck platooning at 0.5s headway — reducing fuel consumption 18% and increasing highway throughput 40%. Lead truck has safety driver; follower trucks are fully driverless with remote monitoring from Pune control center. Average transit: Mumbai to Gurgaon in 18 hours (vs 24 manual). NHAI designating 500km NH48 autonomous corridor with dedicated AV lane from Thane to Gurgaon. Investment: \u20b91,200Cr from NHAI + \u20b9800Cr from Tata Motors. Target: 100 L4 trucks by 2027 covering 80% of Mumbai-Delhi freight volume.</p></CardContent></Card>
          <Card className="avl-insight-card border-l-4 border-l-indigo-500"><CardHeader><CardTitle className="text-sm text-indigo-700">JNPT Port: Autonomous Terminal Operations</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">JNPT Mumbai port (AVL-0008, 20 L4 terminal tractors) deployed India&apos;s largest autonomous yard operations system. Tata CE terminal tractors handle container shunting between berths and stacking cranes at 15km/h average — 24/7 operation without shift changes. Throughput increase: 35% (from 1,800 to 2,430 containers/day). DP World and APM Terminals planning L4 deployment at Mundra (AVL-0011), Chennai (AVL-0014), and Kandla by 2027. India&apos;s port automation market: \u20b94,500Cr by 2030. Key technology: Ouster LiDAR + Velodyne sensors + Qualcomm Snapdragon Ride platform. Safety record: zero incidents across 2 million autonomous container moves since January 2026.</p></CardContent></Card>
          <Card className="avl-insight-card border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm text-amber-700">Delayed Shipments: AVL-0004 and AVL-0013</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">AVL-0004 (Reliance Petro to Essar, 10-day delay): L4 autonomous tanker trucks for hazardous cargo held pending MoRTH autonomous vehicle license for Class-3 dangerous goods. Current regulations allow L4 only for non-hazardous freight. Reliance petitioning MoRTH for hazmat AV license with \u20b925Cr safety bond. AVR-0013 (Switch Mobility to BigBasket, 8-day delay): LiDAR sensor misalignment detected during QC — 5 refrigerated trucks recalled to Pune factory for Velodyne VLP-16 recalibration. Root cause: vibration damage during rail transport from supplier. Fix: redesigned sensor mounting with shock-absorbing isolation bracket. Cost impact: \u20b94.5Cr recalibration + \u20b92Cr penalty for delivery delay.</p></CardContent></Card>
          <Card className="avl-insight-card border-l-4 border-l-cyan-500"><CardHeader><CardTitle className="text-sm text-cyan-700">Kerala Medical Drones: 50-Village Healthcare Network</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Kerala Health Department (AVL-0010, 100 L5 medical drones) launched India&apos;s largest drone delivery network covering 50 remote villages across Wayanad, Idukki, and Malappuram districts. DJI India FlyCart 30 drones carry 5kg medical payload (blood, vaccines, insulin) across 30km range at 65km/h — delivering in 25 minutes vs 4-hour road journey. Emergency blood transfusion delivery reduced mortality by 18% in pilot area. Kerala model being replicated by Tamil Nadu, Karnataka, and Northeast states. Ministry of Health allocated \u20b9320Cr under National Drone Programme 2026. Each drone costs \u20b912L; operating cost \u20b950/km — 90% cheaper than road ambulance for remote areas. Fleet managed by Kerala State Remote Operations Center in Thiruvananthapuram with 24/7 BVLOS permits from DGCA.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
