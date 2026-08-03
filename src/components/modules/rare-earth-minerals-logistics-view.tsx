'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface RareEarthRecord {
  id: string;
  batchNo: string;
  mineralType: string;
  oreSource: string;
  application: string;
  quantityMT: number;
  grade: number;
  processMethod: string;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: RareEarthRecord[] = [
  { id: 'REM-0001', batchNo: 'REM-B2401', mineralType: 'Monazite Sand', oreSource: 'Beach Placer (Kerala)', application: 'NdFeB Magnets', quantityMT: 450, grade: 8.2, processMethod: 'Alkaline Digestion', status: 'In Transit', priority: 'Critical', origin: 'Chavara (IREL)', destination: 'Visakhapatnam (BEML)', shipDate: '2026-07-20', transitDays: 3, zone: 'South', remarks: '450 MT monazite sand for NdFeB permanent magnets in BEML electric traction motors' },
  { id: 'REM-0002', batchNo: 'REM-B2402', mineralType: 'Bastnasite', oreSource: 'Carbonatite (Amba Dongar)', application: 'Phosphors / LED', quantityMT: 280, grade: 12.5, processMethod: 'Acid Baking', status: 'Delivered', priority: 'High', origin: 'Chhota Udepur (AMPRIL)', destination: 'Mumbai (Bharat Electronics)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: '280 MT bastnasite for europium-yttrium phosphors in BEL LED display systems defense' },
  { id: 'REM-0003', batchNo: 'REM-B2403', mineralType: 'Xenotime', oreSource: 'Granite Pegmatite (AP)', application: 'EV Motor Magnets', quantityMT: 150, grade: 22.0, processMethod: 'Solvent Extraction', status: 'Processing', priority: 'Critical', origin: 'Nellore (NMDC)', destination: 'Pune (Tata Motors)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: '150 MT xenotime high-yttrium for Tata Nexon EV motor NdFeB magnet supply chain' },
  { id: 'REM-0004', batchNo: 'REM-B2404', mineralType: 'Ion-Adsorption Clay', oreSource: 'Laterite (Odisha)', application: 'Wind Turbine Generators', quantityMT: 600, grade: 6.8, processMethod: 'In-Situ Leaching', status: 'In Transit', priority: 'Critical', origin: 'Ganjam (Odisha Mining)', destination: 'Chennai (Vestas India)', shipDate: '2026-07-19', transitDays: 2, zone: 'East', remarks: '600 MT ion-adsorption clay REE for Vestas 4MW offshore turbine permanent magnet generators' },
  { id: 'REM-0005', batchNo: 'REM-B2405', mineralType: 'Monazite Sand', oreSource: 'Beach Placer (Tamil Nadu)', application: 'Defense Electronics', quantityMT: 320, grade: 7.5, processMethod: 'Alkaline Digestion', status: 'Delayed', priority: 'High', origin: 'Manavalakurichi (IREL)', destination: 'Bengaluru (DRDO-BEL)', shipDate: '2026-07-12', transitDays: 12, zone: 'South', remarks: '320 MT monazite for DRDO radar phased-array antenna REE magnets — plant shutdown for environmental compliance upgrade' },
  { id: 'REM-0006', batchNo: 'REM-B2406', mineralType: 'Apatite', oreSource: 'Phosphate Rock (Udaipur)', application: 'Fertilizer REE Recovery', quantityMT: 850, grade: 1.2, processMethod: 'By-Product Recovery', status: 'Delivered', priority: 'Medium', origin: 'Jhamarkotra (RSMML)', destination: 'Paradeep (IFFCO)', shipDate: '2026-07-16', transitDays: 3, zone: 'West', remarks: '850 MT apatite phosphate rock with REE by-product recovery at IFFCO Paradeep phosphoric acid plant' },
  { id: 'REM-0007', batchNo: 'REM-B2407', mineralType: 'Allanite', oreSource: 'Metamorphic (Karnataka)', application: 'Battery Cathodes', quantityMT: 200, grade: 15.0, processMethod: 'Crack-Leach-Precipitate', status: 'In Transit', priority: 'High', origin: 'Raichur (Karnataka Mining)', destination: 'Gurgaon (Exicom)', shipDate: '2026-07-21', transitDays: 2, zone: 'South', remarks: '200 MT allanite for Exicom LFP battery cathode REE doping improving cycle life by 30%' },
  { id: 'REM-0008', batchNo: 'REM-B2408', mineralType: 'Bastnasite', oreSource: 'Carbonatite (Song Mao V.)', application: 'Fiber Optics', quantityMT: 120, grade: 18.0, processMethod: 'Fluorination', status: 'Delivered', priority: 'Medium', origin: 'Kolkata (Manaksia)', destination: 'Pune (Sterlite Tech)', shipDate: '2026-07-15', transitDays: 2, zone: 'East', remarks: '120 MT bastnasite imported ore for erbium-doped fiber amplifier manufacturing Sterlite Telecom' },
  { id: 'REM-0009', batchNo: 'REM-B2409', mineralType: 'Monazite Sand', oreSource: 'Beach Placer (Odisha)', application: 'Nuclear Fuel (Th)', quantityMT: 500, grade: 9.0, processMethod: 'Thorium Extraction', status: 'Processing', priority: 'Critical', origin: 'Chatrapur (IREL)', destination: 'Kalpakkam (BARC)', shipDate: '2026-07-24', transitDays: 3, zone: 'East', remarks: '500 MT high-thorium monazite for BARC AHWR third-stage nuclear fuel thorium extraction program' },
  { id: 'REM-0010', batchNo: 'REM-B2410', mineralType: 'Rare Earth Oxide Mix', oreSource: 'Recycled E-Waste', application: 'Consumer Electronics', quantityMT: 90, grade: 45.0, processMethod: 'Hydrometallurgical', status: 'In Transit', priority: 'Low', origin: 'Roorkee (CSIR-IMMT)', destination: 'Noida (Samsung R&amp;D)', shipDate: '2026-07-22', transitDays: 1, zone: 'North', remarks: '90 MT recycled REE oxides from e-waste for Samsung smartphone speaker magnets display recycling' },
  { id: 'REM-0011', batchNo: 'REM-B2411', mineralType: 'Gadolinite', oreSource: 'Granite (Meghalaya)', application: 'Medical Imaging (MRI)', quantityMT: 75, grade: 28.0, processMethod: 'Selective Leaching', status: 'Delivered', priority: 'High', origin: 'Shillong (Meghalaya Mining)', destination: 'Hyderabad (ELICO)', shipDate: '2026-07-17', transitDays: 3, zone: 'East', remarks: '75 MT gadolinite for gadolinium extraction used in GE MRI contrast agent manufacturing India' },
  { id: 'REM-0012', batchNo: 'REM-B2412', mineralType: 'Loparite', oreSource: 'Alkaline Complex (Kola)', application: 'Automotive Catalytic Conv.', quantityMT: 180, grade: 20.0, processMethod: 'Chlorination', status: 'Delayed', priority: 'Critical', origin: 'Mumbai Port (Import)', destination: 'Chennai (Bosch)', shipDate: '2026-07-10', transitDays: 20, zone: 'West', remarks: '180 MT loparite imported for cerium-zirconium catalytic converter substrate — customs clearance delay Russian origin sanctions review' },
  { id: 'REM-0013', batchNo: 'REM-B2413', mineralType: 'Ion-Adsorption Clay', oreSource: 'Laterite (Chhattisgarh)', application: 'Solar Panel Manufacturing', quantityMT: 350, grade: 5.5, processMethod: 'Ammonium Sulfate Leach', status: 'In Transit', priority: 'High', origin: 'Dantewada (NMDC)', destination: 'Hyderabad (Tata Solar)', shipDate: '2026-07-20', transitDays: 2, zone: 'East', remarks: '350 MT ion-adsorption clay REE for Tata Solar PV panel europium-yttrium phosphor coating' },
  { id: 'REM-0014', batchNo: 'REM-B2414', mineralType: 'Monazite Sand', oreSource: 'Beach Placer (Maharashtra)', application: 'Satellite Propulsion', quantityMT: 100, grade: 8.8, processMethod: 'Thorium Co-Extraction', status: 'Processing', priority: 'Critical', origin: 'Vengurla (IREL)', destination: 'Ahmedabad (ISRO/ISAC)', shipDate: '2026-07-25', transitDays: 2, zone: 'West', remarks: '100 MT monazite for ISRO satellite xenon-ion thruster REE cathode and thorium nuclear power source research' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Mineral Type', key: 'mineralType', options: [
    { value: 'Monazite Sand', count: 5 }, { value: 'Ion-Adsorption Clay', count: 2 }, { value: 'Bastnasite', count: 2 }, { value: 'Xenotime', count: 1 },
  ]},
  { label: 'Application', key: 'application', options: [
    { value: 'NdFeB Magnets', count: 2 }, { value: 'Defense Electronics', count: 1 }, { value: 'EV Motor Magnets', count: 1 }, { value: 'Wind Turbine Generators', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 6 }, { value: 'High', count: 4 }, { value: 'Medium', count: 2 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 4 }, { value: 'East', count: 4 }, { value: 'West', count: 3 }, { value: 'North', count: 1 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Batches', value: 14, sub: 'Rare Earth Minerals', color: 'text-amber-800' },
  { title: 'Combined Volume', value: '4,270 MT', sub: 'All Mineral Types', color: 'text-orange-700' },
  { title: 'Avg REO Grade', value: '14.6%', sub: 'Recycled 45% Peak', color: 'text-yellow-700' },
  { title: 'National Target', value: '\u20b922,000Cr', sub: 'Critical Mineral Mission', color: 'text-stone-600' },
];

export default function RareEarthMineralsLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.mineralType} ${r.oreSource} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof RareEarthRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const volumeByMineral = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.mineralType, (map.get(r.mineralType) || 0) + r.quantityMT); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, quantityMT]) => ({ name: name.slice(0, 16), quantityMT }));
  }, []);

  const sourceDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.oreSource.split(' ').slice(0, 2).join(' '); map.set(s, (map.get(s) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const prodTrend = useMemo(() => [
    { year: '2021', mt: 500 }, { year: '2022', mt: 900 }, { year: '2023', mt: 1800 }, { year: '2024', mt: 3200 }, { year: '2025', mt: 5500 }, { year: '2026', mt: 8000 }, { year: '2027', mt: 12000 },
  ], []);

  const gradeData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), grade: r.grade }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const volumeByApp = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application, (map.get(r.application) || 0) + r.quantityMT); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, quantityMT]) => ({ name: name.slice(0, 18), quantityMT }));
  }, []);

  const COLORS = ['#d97706', '#b45309', '#92400e', '#78350f', '#854d0e'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="rem-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Critical Minerals' }, { label: 'Rare Earth' }]} />
      <PageHeader title="Rare Earth Minerals Logistics" description="Indian rare earth element supply chain &#8212; monazite, bastnasite, xenotime, ion-adsorption clay for NdFeB magnets, EV motors, wind turbines, defense electronics, nuclear thorium, and LED phosphors" />

      <div className="rem-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="rem-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="rem-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`rem-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-amber-700 text-amber-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="rem-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">Volume by Mineral Type (MT)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={volumeByMineral}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="quantityMT" fill="#d97706" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">Ore Source Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={sourceDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#d97706" /><Cell fill="#b45309" /><Cell fill="#92400e" /><Cell fill="#78350f" /><Cell fill="#854d0e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">Rare Earth Production Growth (MT/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={prodTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="mt" stroke="#b45309" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">REO Grade (%) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={gradeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="grade" fill="#92400e" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="rem-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Mineral</th><th className="px-2 py-2 text-left">Source</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">MT</th><th className="px-2 py-2 text-right">Grade%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`rem-table-row border-b hover:bg-amber-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.mineralType}</td>
                  <td className="px-2 py-2 text-xs">{r.oreSource}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.quantityMT}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.grade}</td>
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
        <div className="rem-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#d97706" /><Cell fill="#b45309" /><Cell fill="#92400e" /><Cell fill="#78350f" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">Volume by Application (MT)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={volumeByApp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="quantityMT" fill="#d97706" radius={[4,4,0,0]} name="MT" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">Volume vs Grade by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), vol: r.quantityMT, grade: r.grade }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="vol" stroke="#d97706" strokeWidth={2} name="MT" /><Line type="monotone" dataKey="grade" stroke="#b45309" strokeWidth={2} name="Grade%" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="rem-chart-card"><CardHeader><CardTitle className="text-sm">Process Method Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={Array.from(new Map(records.map((r) => [r.processMethod, records.filter((x) => x.processMethod === r.processMethod).length])).entries()).map(([name, value]) => ({ name, value }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#d97706" /><Cell fill="#b45309" /><Cell fill="#92400e" /><Cell fill="#78350f" /><Cell fill="#854d0e" /><Cell fill="#ca8a04" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="rem-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="rem-insight-card border-l-4 border-l-amber-700"><CardHeader><CardTitle className="text-sm text-amber-800">IREL Chavara: India&apos;s Monazite Beach Sand REE Anchor</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Indian Rare Earths Ltd (IREL) Chavara Kerala operates India&apos;s largest monazite beach sand processing facility (REM-0001), mining 6,500 tonnes per day of heavy mineral sand from 22km stretch of Chavara-Payyanur coastline. Monazite concentrate at 8.2% total rare earth oxide (TREO) processed via alkaline digestion with NaOH at 140C producing mixed REE hydroxide precipitate, then solvent extraction separated into individual rare earth oxides: neodymium oxide for BEML traction motors, dysprosium for high-coercivity magnets, cerium for catalytic converters. IREL supplying 450 MT batch to BEML Visakhapatnam for Vande Bharat Express next-gen permanent magnet synchronous motors. India holds world&apos;s largest monazite reserve estimated 12 million tonnes TREO along Kerala-Tamil Nadu-Odisha coastlines. IREL expanding Chavara capacity from 12,000 TPA to 25,000 TPA by 2028 with &#8377;1,800Cr investment under Critical Mineral Mission.</p></CardContent></Card>
          <Card className="rem-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Shipments: REM-0005 and REM-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">REM-0005 (Manavalakurichi IREL to Bengaluru DRDO-BEL, 12-day delay): 320 MT monazite sand for DRDO phased-array radar europium-yttrium phosphor and neodymium magnet components — IREL Manavalakurichi plant shutdown for AERB-mandated radioactive waste management system upgrade. Monazite contains 8-10% thorium oxide requiring Category IV nuclear material handling per AERB safety code. New radwaste immobilization facility with cement-based encapsulation delayed by civil contractor issues. DRDO-BEL radar program for Uttam AESA fighter radar facing component shortage. REM-0012 (Mumbai Port to Chennai Bosch, 20-day delay): 180 MT loparite imported from Kola Peninsula Russia for cerium-zirconium automotive catalytic converter substrate — DGFT additional scrutiny under Russia sanctions framework requiring origin verification and end-use certificate from Russian supplier Norilsk Nickel. Bosch Chennai catalytic converter line operating on buffer stock with 3 weeks coverage remaining.</p></CardContent></Card>
          <Card className="rem-insight-card border-l-4 border-l-orange-600"><CardHeader><CardTitle className="text-sm text-orange-700">Karnataka Xenotime: Critical NdFeB Supply for EV Nation</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">NMDC Nellore mining xenotime ore from granite pegmatite deposits in Anantapur district (REM-0003) at exceptional 22% TREO grade — India&apos;s highest-grade rare earth deposit. Xenotime rich in yttrium and heavy rare earths dysprosium-terbium essential for high-temperature NdFeB magnets in Tata Motors Nexon EV and Punch EV powertrains. 150 MT batch shipped to Tata Motors Pune for in-house magnet production line, reducing India&apos;s 95% dependence on Chinese NdFeB magnet imports. CSIR-NML Jamshedpur developing xenotime processing flowsheet: sulfuric acid bake at 200C, water leach, solvent extraction with PC-88A for yttrium separation, then oxalate precipitation for dysprosium oxide. Tata Motors targeting 100% domestic NdFeB magnet sourcing by 2030 for 500,000 EV annual production. India EV magnet demand forecast: 8,000 TPA NdFeB by 2028, 25,000 TPA by 2032. Xenotime supply chain investment: &#8377;3,500Cr including mining beneficiation plant at Nellore and separation facility at Visakhapatnam.</p></CardContent></Card>
          <Card className="rem-insight-card border-l-4 border-l-stone-600"><CardHeader><CardTitle className="text-sm text-stone-700">BARC Kalpakkam: Thorium Monazite for Three-Stage Nuclear</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">BARC Kalpakkam receiving 500 MT high-thorium monazite concentrate (REM-0009) from IREL Chatrapur Odisha for India&apos;s three-stage nuclear power program thorium extraction. Monazite at 9% TREO with 8-9% ThO2 — thorium extracted via caustic digestion, then purified to nuclear-grade ThO4 via solvent extraction and ion exchange. Thorium oxide pelletized and sintered for Advanced Heavy Water Reactor (AHWR) fuel bundles at BARC fuel fabrication facility. India&apos;s thorium reserve estimated 360,000 tonnes — enough for 500 GWe-years of nuclear energy. AHWR-300 prototype under construction at Tarapur demonstrating thorium-based closed fuel cycle. ISRO also sourcing monazite (REM-0014) from IREL Vengurla for radioisotope thermoelectric generator (RTG) research for deep-space missions and satellite nuclear power sources. Dual-use thorium-REE supply chain critical for both energy security and space program. Investment: &#8377;5,500Cr thorium extraction infrastructure including new facility at BARC Tarapur.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
