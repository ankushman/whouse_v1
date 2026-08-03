'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface ECHRecord {
  id: string;
  hubId: string;
  city: string;
  corridor: string;
  operator: string;
  chargerType: string;
  totalKw: number;
  monthlySessions: number;
  revenueLakh: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: ECHRecord[] = [
  { id: 'ECH-0001', hubId: 'ECH-D26DL1', city: 'Delhi', corridor: 'Delhi-Jaipur NH8', operator: 'Tata Power EZ Drive', chargerType: 'DC 150kW CCS2 + DC 50kW CHAdeMO', totalKw: 2400, monthlySessions: 8400, revenueLakh: 126, status: 'In Transit', priority: 'Critical', origin: 'Tata Power Depot Okhla', destination: 'Manesar Hub Haryana', shipDate: '2026-07-28', transitDays: 1, zone: 'North', remarks: 'Delhi-Jaipur NH8 corridor flagship hub with 16 DC fast chargers &#8594; 2,400 kW total capacity serving 8,400 monthly sessions. CCS2 + CHAdeMO dual protocol for EV cars and buses &#8594; &#8377;1.26Cr monthly revenue. Strategic location at Manesar for inter-city express charging with solar carport canopy generating 180 kW peak' },
  { id: 'ECH-0002', hubId: 'ECH-M26MUM1', city: 'Mumbai', corridor: 'Mumbai-Pune Expressway', operator: 'Reliance Jio Charge', chargerType: 'DC 350kW + DC 150kW', totalKw: 3200, monthlySessions: 9200, revenueLakh: 156, status: 'Delivered', priority: 'Critical', origin: 'Jio Charge Worli', destination: 'Lonavala Hub Expressway', shipDate: '2026-07-10', transitDays: 1, zone: 'West', remarks: 'Mumbai-Pune expressway premium hub with 350 kW ultra-fast chargers &#8594; 15-minute charge for 200 km range. 9,200 monthly sessions at &#8377;1.56Cr revenue. Battery storage integration of 500 kWh for peak demand management &#8594; serving Tesla, Tata Nexon EV and Mercedes EQS users on India&apos;s busiest expressway' },
  { id: 'ECH-0003', hubId: 'ECH-B26BLR1', city: 'Bengaluru', corridor: 'Bengaluru-Chennai NH44', operator: 'Ather Grid + BESCOM', chargerType: 'DC 50kW + AC 22kW Type-2', totalKw: 1600, monthlySessions: 6500, revenueLakh: 78, status: 'Processing', priority: 'High', origin: 'BESCOM KR Puram', destination: 'Hoskote Truck Stop', shipDate: '2026-08-01', transitDays: 1, zone: 'South', remarks: 'Bengaluru-Chennai NH44 hub with mixed DC/AC charging &#8594; 1,600 kW serving 6,500 monthly sessions. Focus on last-mile delivery EVs and interstate commuter cars &#8594; &#8377;78L monthly revenue. AI-driven dynamic pricing during peak hours at &#8377;18/kWh and off-peak at &#8377;8/kWh &#8594; connected to BESCOM smart grid' },
  { id: 'ECH-0004', hubId: 'ECH-C26CHN1', city: 'Chennai', corridor: 'Chennai-Bengaluru NH75', operator: 'Zeon Electric', chargerType: 'DC 150kW CCS2 + DC 30kW GB/T', totalKw: 1200, monthlySessions: 4200, revenueLakh: 55, status: 'In Transit', priority: 'High', origin: 'Zeon Depot Guindy', destination: 'Vellore Hub NH75', shipDate: '2026-07-26', transitDays: 1, zone: 'South', remarks: 'Chennai-Vellore corridor hub with 1,200 kW capacity &#8594; CCS2 for Indian EVs + GB/T for Chinese-manufactured electric buses serving Tamil Nadu STU fleet. 4,200 monthly sessions &#8594; &#8377;55L revenue. V2G-ready chargers for vehicle-to-grid bidirectional flow &#8594; pilot with 10 Olectra BYD electric buses' },
  { id: 'ECH-0005', hubId: 'ECH-H26HYD1', city: 'Hyderabad', corridor: 'Hyderabad-Vijayawada NH65', operator: 'Green Mobililty (EESL)', chargerType: 'DC 100kW + DC 50kW', totalKw: 1800, monthlySessions: 5800, revenueLakh: 82, status: 'Delivered', priority: 'High', origin: 'EESL Begumpet', destination: 'Suryapet Hub NH65', shipDate: '2026-07-08', transitDays: 2, zone: 'South', remarks: 'Hyderabad-Vijayawada corridor hub with 1,800 kW &#8594; 5,800 monthly sessions. EESL partnership with Telangana STU for electric bus fleet charging &#8594; &#8377;82L monthly revenue. Solar-powered with 400 kW rooftop PV &#8594; net-zero energy target by 2027. Charging 45 electric buses nightly with overnight scheduling algorithm' },
  { id: 'ECH-0006', hubId: 'ECH-K26KOL1', city: 'Kolkata', corridor: 'Kolkata-Durgapur NH19', operator: 'Charge+Zone', chargerType: 'DC 150kW + AC 7.4kW', totalKw: 950, monthlySessions: 3600, revenueLakh: 42, status: 'Delayed', priority: 'High', origin: 'ChargeZone Sector V', destination: 'Durgapur Hub NH19', shipDate: '2026-07-18', transitDays: 2, zone: 'East', remarks: 'Kolkata-Durgapur industrial corridor hub &#8594; 950 kW for heavy-duty truck charging and inter-city cars. Delayed due to transformer upgrade from 1 MVA to 2.5 MVA &#8594; 3,600 sessions at &#8377;42L revenue. Unique focus on mining dump truck electrification for Coal India subsidiary BCCL &#8594; 200 kWh battery swap station adjacent' },
  { id: 'ECH-0007', hubId: 'ECH-A26AHM1', city: 'Ahmedabad', corridor: 'Ahmedabad-Udaipur NH48', operator: 'Adani Total Energies', chargerType: 'DC 250kW + DC 100kW', totalKw: 2100, monthlySessions: 7200, revenueLakh: 108, status: 'Delivered', priority: 'High', origin: 'Adani Charge SG Highway', destination: 'Himmatnagar Hub NH48', shipDate: '2026-07-14', transitDays: 1, zone: 'West', remarks: 'Ahmedabad-Udaipur NH48 premium hub with 2,100 kW &#8594; 7,200 monthly sessions at &#8377;1.08Cr revenue. Integrated with Adani&apos;s 500 MW solar farm for green electron supply. DC 250 kW chargers deliver 80% SOC in 20 minutes &#8594; serving Gujarat STU electric bus fleet and interstate travelers. First hub with ISO 15118 plug-and-charge authentication' },
  { id: 'ECH-0008', hubId: 'ECH-P26PUN1', city: 'Pune', corridor: 'Pune-Satara NH48', operator: 'Sun Mobility + MSEDCL', chargerType: 'AC 22kW + Battery Swap', totalKw: 800, monthlySessions: 5500, revenueLakh: 62, status: 'In Transit', priority: 'Medium', origin: 'Sun Mobility Hinjewadi', destination: 'Satara Hub NH48', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: 'Pune-Satara corridor with battery swap focus &#8594; 800 kW fixed + 4 swap stations. 5,500 monthly sessions &#8594; &#8377;62L revenue. Sun Mobility&apos;s standardized swap packs serve 3-wheelers and 2-wheelers &#8594; 90-second swap time. MSEDCL grid integration with demand response &#8594; hub operates as virtual power plant during peak evening hours' },
  { id: 'ECH-0009', hubId: 'ECH-J26JPR1', city: 'Jaipur', corridor: 'Jaipur-Delhi NH8', operator: 'Rajasthan EV Grid', chargerType: 'DC 150kW + DC 30kW', totalKw: 1400, monthlySessions: 4100, revenueLakh: 52, status: 'Delivered', priority: 'Medium', origin: 'REVG Mansarovar', destination: 'Shahpura Hub NH8', shipDate: '2026-07-12', transitDays: 1, zone: 'North', remarks: 'Jaipur-Delhi return corridor hub &#8594; 1,400 kW with 4,100 monthly sessions at &#8377;52L revenue. Rajasthan&apos;s first desert-rated charging station with dust-proof enclosures and 55&#176;C operating temperature tolerance. Solar-wind hybrid microgrid with 250 kW PV + 100 kW wind turbine &#8594; off-grid capable for highway reliability' },
  { id: 'ECH-0010', hubId: 'ECH-L26LKO1', city: 'Lucknow', corridor: 'Lucknow-Kanpur NH27', operator: 'EV Motors + UPSEDCL', chargerType: 'DC 100kW + AC 22kW', totalKw: 1100, monthlySessions: 3800, revenueLakh: 44, status: 'Processing', priority: 'Medium', origin: 'EV Motors Gomti Nagar', destination: 'Unnao Hub NH27', shipDate: '2026-08-02', transitDays: 1, zone: 'North', remarks: 'Lucknow-Kanpur industrial corridor hub &#8594; 1,100 kW serving UP&apos;s most productive highway stretch. 3,800 monthly sessions at &#8377;44L revenue. Partnership with UPSRTC for 200 electric bus overnight charging &#8594; scheduled 11 PM to 6 AM. Green hydrogen electrolyzer planned for 2027 &#8594; 100% renewable charging by 2028 target' },
  { id: 'ECH-0011', hubId: 'ECH-G26GAU1', city: 'Guwahati', corridor: 'Guwahati-Shillong NH6', operator: 'NEEPCO Green Charge', chargerType: 'DC 50kW + AC 22kW', totalKw: 400, monthlySessions: 1200, revenueLakh: 14, status: 'Delivered', priority: 'Medium', origin: 'NEEPCO Beltola', destination: 'Nongpoh Hub NH6', shipDate: '2026-07-08', transitDays: 2, zone: 'East', remarks: 'Northeast India&apos;s first inter-state charging hub &#8594; 400 kW on Guwahati-Shillong corridor. 1,200 monthly sessions at &#8377;14L revenue. Micro-hydro powered from NEEPCO&apos;s 50 MW Umtru plant &#8594; 100% renewable. Designed for altitude and humidity &#8594; critical for EV tourism growth in Meghalaya and Assam hill circuits' },
  { id: 'ECH-0012', hubId: 'ECH-C26COC1', city: 'Kochi', corridor: 'Kochi-Coimbatore NH544', operator: 'KSEB e-Charge', chargerType: 'DC 100kW + AC 22kW', totalKw: 700, monthlySessions: 2800, revenueLakh: 32, status: 'In Transit', priority: 'Medium', origin: 'KSEB Vyttila', destination: 'Palakkad Hub NH544', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: 'Kochi-Coimbatore corridor hub with 700 kW &#8594; 2,800 monthly sessions at &#8377;32L revenue. KSEB&apos;s first green corridor hub powered by 200 kW floating solar on Vembanad backwaters. Serves Kerala&apos;s electric autorickshaw conversion program &#8594; 500 AC 22kW connectors for overnight fleet charging &#8594; integrated with Kerala&apos;s RESCO model' },
  { id: 'ECH-0013', hubId: 'ECH-V26VIZ1', city: 'Visakhapatnam', corridor: 'Vizag-Vijayawada NH16', operator: 'APEPDCL Charge', chargerType: 'DC 150kW + AC 22kW', totalKw: 900, monthlySessions: 3200, revenueLakh: 38, status: 'Delivered', priority: 'Medium', origin: 'APEPDCL MVP Colony', destination: 'Tuni Hub NH16', shipDate: '2026-07-12', transitDays: 1, zone: 'South', remarks: 'Vizag-Vijayawada east coast corridor hub &#8594; 900 kW for port-to-city EV logistics. 3,200 monthly sessions at &#8377;38L revenue. Vizag Port Authority partnership for electric drayage trucks &#8594; 20 trucks with automated docking and charging. Wind-powered from AP&apos;s 4 GW coastal wind farms &#8594; cyclone-resistant design with IP65 enclosures rated for 200 kmph winds' },
  { id: 'ECH-0014', hubId: 'ECH-N26NGP1', city: 'Nagpur', corridor: 'Nagpur-Aurangabad NH361', operator: 'Magenta Charge (MSDCCL)', chargerType: 'DC 150kW + DC 50kW', totalKw: 1300, monthlySessions: 4500, revenueLakh: 56, status: 'In Transit', priority: 'Medium', origin: 'Magenta Hingna', destination: 'Washim Hub NH361', shipDate: '2026-07-27', transitDays: 2, zone: 'West', remarks: 'Nagpur geographical center hub &#8594; 1,300 kW at India&apos;s logistic crossroads connecting 4 national highways. 4,500 monthly sessions at &#8377;56L revenue. Magenta&apos;s Swappable Battery Network serves 3,000 electric 3-wheelers monthly &#8594; Nagpur is testing ground for vehicle-to-grid pilot with 50 vehicles feeding 200 kW back during evening peak hours' },
];

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#15803d', '#166534', '#14532d', '#0f6f2a'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 6 }, { value: 'Processing', count: 2 }, { value: 'Delayed', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 2 }, { value: 'High', count: 5 }, { value: 'Medium', count: 7 },
  ]},
  { label: 'Operator', key: 'operator', options: [
    { value: 'Tata Power EZ Drive', count: 1 }, { value: 'Reliance Jio Charge', count: 1 }, { value: 'Ather Grid + BESCOM', count: 1 }, { value: 'Zeon Electric', count: 1 }, { value: 'Green Mobililty (EESL)', count: 1 }, { value: 'Charge+Zone', count: 1 }, { value: 'Adani Total Energies', count: 1 }, { value: 'Sun Mobility + MSEDCL', count: 1 }, { value: 'Rajasthan EV Grid', count: 1 }, { value: 'EV Motors + UPSEDCL', count: 1 }, { value: 'NEEEPCO Green Charge', count: 1 }, { value: 'KSEB e-Charge', count: 1 }, { value: 'APEPDCL Charge', count: 1 }, { value: 'Magenta Charge (MSDCCL)', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 4 }, { value: 'South', count: 5 }, { value: 'West', count: 4 }, { value: 'East', count: 1 },
  ]},
];

export default function EVChargingHubLogisticsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registry' | 'analytics' | 'insights'>('dashboard');

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev: Record<string, string[]>) => {
      const next = { ...prev };
      const arr = next[key] || [];
      if (arr.includes(value)) {
        next[key] = arr.filter((v: string) => v !== value);
        if (next[key].length === 0) delete next[key];
      } else {
        next[key] = [...arr, value];
      }
      return next;
    });
  };

  const clearAllFilters = () => setActiveFilters({});

  const filteredRecords = useMemo(() => {
    return records.filter((r: ECHRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.city.toLowerCase().includes(searchQuery.toLowerCase()) || r.corridor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof ECHRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalKw = records.reduce((s, r) => s + r.totalKw, 0);
  const totalSessions = records.reduce((s, r) => s + r.monthlySessions, 0);
  const totalRevenue = records.reduce((s, r) => s + r.revenueLakh, 0);
  const avgSessions = Math.round(totalSessions / records.length);

  const kpiData = [
    { label: 'Total Charging Capacity', value: `${(totalKw / 1000).toFixed(1)} MW`, sub: 'Across 14 Hub Locations' },
    { label: 'Monthly Sessions', value: `${totalSessions.toLocaleString()}`, sub: 'Combined EV Charging Events' },
    { label: 'Avg Sessions per Hub', value: `${avgSessions.toLocaleString()}`, sub: 'Per Month per Location' },
    { label: 'Monthly Revenue', value: `&#8377;${totalRevenue}L`, sub: 'Combined Hub Revenue' },
  ];

  const cityData = useMemo(() => records.map(r => ({ city: r.city, sessions: r.monthlySessions, kw: r.totalKw })).sort((a, b) => b.sessions - a.sessions), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const kwVsSessions = useMemo(() => records.map(r => ({ city: r.city, kw: r.totalKw, sessions: r.monthlySessions })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 ech-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'EV Charging Hub' }]} />
      <PageHeader title="EV Charging Hub Logistics" description="Inter-city fast charging network for electric vehicles across Indian national highway corridors with DC ultra-fast chargers, battery swap, and V2G integration" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#16a34a] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="ech-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#16a34a]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="ech-chart-card"><CardHeader><CardTitle className="text-base">Monthly Sessions by City</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="sessions" fill="#16a34a" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="ech-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#16a34a" /><Cell fill="#22c55e" /><Cell fill="#4ade80" /><Cell fill="#15803d" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'ech-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'EV Charging Hub Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#16a34a] bg-green-50/20'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.city} &#8594; {r.transitDays}d | {r.totalKw} kW | {r.monthlySessions} sessions/mo</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: r.remarks }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="ech-chart-card"><CardHeader><CardTitle className="text-base">Capacity vs Sessions</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={kwVsSessions}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="kw" stroke="#16a34a" strokeWidth={2} name="Capacity (kW)" /><Line yAxisId="right" type="monotone" dataKey="sessions" stroke="#15803d" strokeWidth={2} name="Sessions" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="ech-chart-card"><CardHeader><CardTitle className="text-base">Revenue per kW (Lakh/kW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ city: r.city, revKw: +(r.revenueLakh / r.totalKw * 1000).toFixed(1) }))}><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="revKw" fill="#22c55e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ech-chart-card"><CardHeader><CardTitle className="text-base">Total Capacity by Zone (MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.zone] = (m[r.zone] || 0) + r.totalKw; return m; }, {})).map(([k, v]) => ({ zone: k, mw: +(v / 1000).toFixed(2) }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="mw" fill="#15803d" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ech-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 5 }, { name: 'Delivered', value: 6 }, { name: 'Processing', value: 2 }, { name: 'Delayed', value: 1 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#16a34a" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /><Cell fill="#ef4444" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="ech-insight-card"><CardHeader><CardTitle className="text-base">Mumbai-Pune Expressway Sets Ultra-Fast Benchmark</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Reliance Jio Charge&apos;s Lonavala hub (ECH-0002) deploys India&apos;s first 350 kW ultra-fast chargers enabling 15-minute 200 km range top-up. At &#8377;1.56Cr monthly revenue from 9,200 sessions &#8594; it generates 2.4x the revenue of comparable hubs. The 500 kWh battery storage system enables peak shaving &#8594; avoiding grid capacity charges of &#8377;18L/month. This hub serves as the blueprint for all future NHAI expressway charging plazas.</p></CardContent></Card>
          <Card className="ech-insight-card"><CardHeader><CardTitle className="text-base">Adani Ahmedabad Hub Achieves 100% Green Charging</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Adani Total Energies&apos; SG Highway hub (ECH-0007) is India&apos;s first charging hub with direct solar farm PPA at &#8377;2.8/kWh &#8594; reducing operating cost by 65% vs grid power. The 500 kW solar farm generates 750 MWh annually &#8594; exceeding hub consumption of 680 MWh. ISO 15118 plug-and-charge eliminates RFID cards &#8594; vehicles authenticate automatically. Revenue of &#8377;1.08Cr/month at 90% utilization proves EV charging profitability.</p></CardContent></Card>
          <Card className="ech-insight-card"><CardHeader><CardTitle className="text-base">Battery Swap Model Disrupts Tier-2 Cities</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Sun Mobility + MSEDCL&apos;s Pune-Satara hub (ECH-0008) proves battery swap outperforms plug-in charging for commercial fleets. 90-second swaps for 3-wheelers vs 45-minute DC charge &#8594; 30x faster turnaround. At &#8377;62L monthly revenue serving 5,500 swaps &#8594; the per-session cost is &#8377;113. The hub doubles as a virtual power plant &#8594; feeding 200 kW back to MSEDCL during evening peak demand from idle battery packs.</p></CardContent></Card>
          <Card className="ech-insight-card"><CardHeader><CardTitle className="text-base">National EV Charging Network Scaling Plan</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">The 14-hub portfolio represents 19.95 MW total capacity and 69,800 monthly charging sessions at &#8377;8.99Cr annual revenue run rate. India targets 46,000 public chargers by 2030 under FAME-III &#8594; requiring 3,300 hub installations at &#8377;15Cr each &#8594; total &#8377;49,500Cr investment. Current hubs demonstrate 35% average utilization &#8594; scaling to 70% via dynamic pricing and fleet anchoring contracts could achieve &#8377;3,600Cr annual revenue by 2030.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
