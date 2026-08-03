'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface SCRRecord {
  id: string;
  projectId: string;
  resilienceDomain: string;
  infrastructureType: string;
  technologyStack: string;
  city: string;
  populationCovered: number;
  investmentCr: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: SCRRecord[] = [
  { id: 'SCR-0001', projectId: 'SCR-F24MUM', resilienceDomain: 'Flood Resilience', infrastructureType: 'IoT Flood Sensor Network', technologyStack: 'LoRaWAN + AI Predictive', city: 'Mumbai', populationCovered: 2400000, investmentCr: 350, status: 'In Transit', priority: 'Critical', origin: 'NEERI Nagpur', destination: 'MCGM Worli Depot', shipDate: '2026-07-25', transitDays: 3, zone: 'West', remarks: '2400 sensor nodes across Mithi River catchment &#8212; LoRaWAN water-level + AI flood prediction 4hr advance warning covering 24 lakh citizens' },
  { id: 'SCR-0002', projectId: 'SCR-H24CHN', resilienceDomain: 'Heat Resilience', infrastructureType: 'Urban Cool Roof Program', technologyStack: 'Cool Paint + Green Cover', city: 'Chennai', populationCovered: 1800000, investmentCr: 220, status: 'Delivered', priority: 'High', origin: 'Nexus Baddi Plant', destination: 'GCC T. Nagar Depot', shipDate: '2026-07-10', transitDays: 2, zone: 'South', remarks: '18 sq km cool roof coating + 500 tree pits under Chennai Heat Action Plan &#8212; reducing surface temp 3&#176;C in high-density central Chennai' },
  { id: 'SCR-0003', projectId: 'SCR-E24HYD', resilienceDomain: 'Earthquake Resilience', infrastructureType: 'Seismic Retrofit Sensors', technologyStack: 'MEMS Accelerometer + Digital Twin', city: 'Hyderabad', populationCovered: 950000, investmentCr: 480, status: 'In Transit', priority: 'Critical', origin: 'NGRI Hyderabad', destination: 'GHMC Jubilee Hills', shipDate: '2026-07-28', transitDays: 1, zone: 'South', remarks: 'Zone III seismic microzonation with 1200 MEMS accelerometers &#8212; real-time structural health monitoring of 350 critical public buildings' },
  { id: 'SCR-0004', projectId: 'SCR-D24DEL', resilienceDomain: 'Drought Resilience', infrastructureType: 'Smart Water ATMs + Reuse Grid', technologyStack: 'IoT Water Meter + Treated STP Reuse', city: 'Delhi', populationCovered: 3200000, investmentCr: 520, status: 'Delivered', priority: 'High', origin: 'ION Exchange Navi Mumbai', destination: 'DJB Bhagirathi Office', shipDate: '2026-07-08', transitDays: 3, zone: 'North', remarks: '800 water ATMs + 150 km dual-plumbing treated STP reuse network &#8212; saving 120 MGD freshwater in water-scarce South & East Delhi' },
  { id: 'SCR-0005', projectId: 'SCR-C24BNG', resilienceDomain: 'Cyclone Resilience', infrastructureType: 'Cyclone Shelter + Early Warning', technologyStack: 'IMD Doppler Radar + Shelter Network', city: 'Bhubaneswar', populationCovered: 1500000, investmentCr: 290, status: 'In Transit', priority: 'Critical', origin: 'ECL Kolkata Factory', destination: 'BMC Saheed Nagar Depot', shipDate: '2026-07-22', transitDays: 2, zone: 'East', remarks: '75 multi-purpose cyclone shelters with IMD Doppler radar early warning &#8212; covering 15 lakh coastal Odisha population in Category 5 cyclone zones' },
  { id: 'SCR-0006', projectId: 'SCR-A24AHM', resilienceDomain: 'Air Quality Resilience', infrastructureType: 'Hyperlocal AQI Grid + Smog Tower', technologyStack: 'Low-Cost Sensor Mesh + ML Dispersion', city: 'Ahmedabad', populationCovered: 1200000, investmentCr: 180, status: 'Processing', priority: 'Medium', origin: 'IIT-K GPDR Lab', destination: 'AMC Ashram Road', shipDate: '2026-07-30', transitDays: 1, zone: 'West', remarks: '2000 hyperlocal AQI sensors + 5 smog towers in industrial-VI corridor &#8212; AI-based pollution hotspot identification for 12 lakh residents' },
  { id: 'SCR-0007', projectId: 'SCR-P24BLR', resilienceDomain: 'Power Resilience', infrastructureType: 'Microgrid + Battery Islanding', technologyStack: 'Solar PV + BESS + Grid-Forming', city: 'Bengaluru', populationCovered: 850000, investmentCr: 620, status: 'Delivered', priority: 'High', origin: 'Ather Energy Hosur', destination: 'BBMP Koramangala Depot', shipDate: '2026-07-05', transitDays: 1, zone: 'South', remarks: '50 MW solar microgrid + 100 MWh BESS for 850K citizens &#8212; grid-forming inverters enabling islanding during power outages in South Bengaluru tech corridor' },
  { id: 'SCR-0008', projectId: 'SCR-L24KOL', resilienceDomain: 'Landslide Resilience', infrastructureType: 'InSAR Monitoring + Retaining Wall', technologyStack: 'Satellite InSAR + IoT inclinometer', city: 'Kolkata', populationCovered: 450000, investmentCr: 140, status: 'Delayed', priority: 'Medium', origin: 'ISRO Ahmedabad', destination: 'KMC Salt Lake Depot', shipDate: '2026-07-18', transitDays: 3, zone: 'East', remarks: 'InSAR satellite-based subsidence monitoring for Darjeeling hill slums &#8212; 4.5 lakh landslide-prone residents with IoT inclinometer alert network covering 200 sites' },
  { id: 'SCR-0009', projectId: 'SCR-T24JPR', resilienceDomain: 'Traffic Resilience', infrastructureType: 'AI Traffic Adaptive Signals', technologyStack: 'CV Camera + Edge AI + V2X', city: 'Jaipur', populationCovered: 1600000, investmentCr: 310, status: 'In Transit', priority: 'High', origin: 'BEL Ghaziabad', destination: 'JMC MI Road HQ', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: '250 AI-adaptive traffic signals + V2X communication at 50 junctions &#8212; real-time congestion management covering 16 lakh Jaipur metro citizens with 30% travel time reduction' },
  { id: 'SCR-0010', projectId: 'SCR-W24PUN', resilienceDomain: 'Water Resilience', infrastructureType: 'Rainwater Harvest Grid + Aquifer Recharge', technologyStack: 'IoT Level Sensor + Managed Aquifer Recharge', city: 'Pune', populationCovered: 980000, investmentCr: 275, status: 'Delivered', priority: 'High', origin: 'CSIR-NGRI Pune', destination: 'PMC Shivajinagar Depot', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: '5000 rainwater harvesting structures + 100 aquifer recharge wells &#8212; IoT-monitored MAR network adding 15 MCM/yr groundwater for 9.8 lakh water-stressed Pune citizens' },
  { id: 'SCR-0011', projectId: 'SCR-G24SUR', resilienceDomain: 'Grid Resilience', infrastructureType: 'Underground Cable + Automated Recloser', technologyStack: 'XLPE Cable + SCADA Automation', city: 'Surat', populationCovered: 1100000, investmentCr: 390, status: 'Processing', priority: 'Medium', origin: 'KEC International Kolkata', destination: 'SIVL Ring Road Depot', shipDate: '2026-08-02', transitDays: 3, zone: 'West', remarks: '350 km underground XLPE cable + 80 automated reclosers &#8212; SAIDI reduction from 4hr to 0.5hr for 11 lakh Surat diamond & textile industry consumers' },
  { id: 'SCR-0012', projectId: 'SCR-F24KOC', resilienceDomain: 'Fire Resilience', infrastructureType: 'Smart Fire Detection + Response Network', technologyStack: 'Multi-Sensor IoT + AI Fire Spread Model', city: 'Kochi', populationCovered: 620000, investmentCr: 165, status: 'In Transit', priority: 'High', origin: 'Keltron Trivandrum', destination: 'Kochi Corporation Ernakulam', shipDate: '2026-07-27', transitDays: 1, zone: 'South', remarks: '1500 multi-sensor fire detectors + AI-driven fire spread model &#8212; automated response dispatch for 6.2 lakh citizens in high-density Ernakulam heritage zone' },
  { id: 'SCR-0013', projectId: 'SCR-D24LUD', resilienceDomain: 'Disease Resilience', infrastructureType: 'Wastewater Surveillance + Health Grid', technologyStack: 'RT-PCR WW Surveillance + AI Epidemiology', city: 'Ludhiana', populationCovered: 780000, investmentCr: 95, status: 'Delivered', priority: 'Medium', origin: 'IMTech Chandigarh', destination: 'MC Ludhiana Civil Lines', shipDate: '2026-07-14', transitDays: 1, zone: 'North', remarks: '45 wastewater surveillance nodes + AI epidemiological dashboard &#8212; 7.8 lakh citizens covered for early pathogen detection in industrial Ludhiana' },
  { id: 'SCR-0014', projectId: 'SCR-R24IND', resilienceDomain: 'Rescue Resilience', infrastructureType: 'Drone Emergency + GIS Command Center', technologyStack: 'BVLOS Drone + GIS + Satellite Comms', city: 'Indore', populationCovered: 1350000, investmentCr: 210, status: 'In Transit', priority: 'Critical', origin: 'Drishti Works Bengaluru', destination: 'IMC MG Road HQ', shipDate: '2026-07-24', transitDays: 2, zone: 'West', remarks: '50 BVLOS emergency drones + GIS-based command center &#8212; post-disaster rapid assessment for 13.5 lakh Indore citizens with 15-min response time across 350 sq km' },
];

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#4f46e5', '#7c3aed', '#5b21b6', '#6d28d9'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 7 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 2 }, { value: 'Delayed', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 6 }, { value: 'Medium', count: 4 },
  ]},
  { label: 'Resilience Domain', key: 'resilienceDomain', options: [
    { value: 'Flood Resilience', count: 1 }, { value: 'Heat Resilience', count: 1 }, { value: 'Earthquake Resilience', count: 1 }, { value: 'Drought Resilience', count: 1 }, { value: 'Cyclone Resilience', count: 1 }, { value: 'Air Quality Resilience', count: 1 }, { value: 'Power Resilience', count: 1 }, { value: 'Landslide Resilience', count: 1 }, { value: 'Traffic Resilience', count: 1 }, { value: 'Water Resilience', count: 1 }, { value: 'Grid Resilience', count: 1 }, { value: 'Fire Resilience', count: 1 }, { value: 'Disease Resilience', count: 1 }, { value: 'Rescue Resilience', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 3 }, { value: 'South', count: 4 }, { value: 'West', count: 4 }, { value: 'East', count: 3 },
  ]},
];

export default function SmartCityResilienceHubLogisticsView() {
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
    return records.filter((r: SCRRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.city.toLowerCase().includes(searchQuery.toLowerCase()) || r.resilienceDomain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof SCRRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalPop = records.reduce((s, r) => s + r.populationCovered, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const kpiData = [
    { label: 'Total Investment', value: `&#8377;${(totalInv / 100).toFixed(0)}Cr`, sub: '14 Smart City Projects' },
    { label: 'Population Covered', value: `${(totalPop / 100000).toFixed(1)}M`, sub: 'Across 14 Indian Cities' },
    { label: 'Active Deployments', value: `${filteredRecords.filter(r => r.status === 'In Transit').length}`, sub: `${records.filter(r => r.status === 'Delivered').length} Completed` },
    { label: 'Avg Investment', value: `&#8377;${(totalInv / records.length).toFixed(0)}Cr`, sub: 'Per City Project' },
  ];

  const cityInvestment = useMemo(() => records.map(r => ({ city: r.city, investment: r.investmentCr, pop: r.populationCovered })).sort((a, b) => b.investment - a.investment), []);
  const domainStatus = useMemo(() => {
    const m: Record<string, { delivered: number; inTransit: number; processing: number; delayed: number }> = {};
    records.forEach(r => {
      if (!m[r.resilienceDomain]) m[r.resilienceDomain] = { delivered: 0, inTransit: 0, processing: 0, delayed: 0 };
      if (r.status === 'Delivered') m[r.resilienceDomain].delivered++;
      else if (r.status === 'In Transit') m[r.resilienceDomain].inTransit++;
      else if (r.status === 'Processing') m[r.resilienceDomain].processing++;
      else m[r.resilienceDomain].delayed++;
    });
    return Object.entries(m).map(([k, v]) => ({ domain: k.split(' ')[0], ...v }));
  }, []);

  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);

  const popVsInv = useMemo(() => records.map(r => ({ city: r.city, population: r.populationCovered / 100000, investment: r.investmentCr })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 scr-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Smart City Resilience Hub' }]} />
      <PageHeader title="Smart City Resilience Hub Logistics" description="Climate-adaptive urban infrastructure &amp; emergency response supply chain for Indian cities" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#6366f1] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="scr-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#6366f1]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="scr-chart-card"><CardHeader><CardTitle className="text-base">City Investment (&#8377;Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cityInvestment}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Bar dataKey="investment" fill="#6366f1" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="scr-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#6366f1" /><Cell fill="#8b5cf6" /><Cell fill="#a78bfa" /><Cell fill="#4f46e5" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'scr-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Project Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#6366f1] bg-indigo-50/20'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.city} &#8594; {r.transitDays}d</span>
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
          <Card className="scr-chart-card"><CardHeader><CardTitle className="text-base">Domain Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={domainStatus}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="domain" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Legend /><Bar dataKey="delivered" stackId="a" fill="#22c55e" /><Bar dataKey="inTransit" stackId="a" fill="#6366f1" /><Bar dataKey="processing" stackId="a" fill="#f59e0b" /><Bar dataKey="delayed" stackId="a" fill="#ef4444" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="scr-chart-card"><CardHeader><CardTitle className="text-base">Population vs Investment</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={popVsInv}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="population" stroke="#6366f1" strokeWidth={2} /><Line yAxisId="right" type="monotone" dataKey="investment" stroke="#8b5cf6" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="scr-chart-card"><CardHeader><CardTitle className="text-base">Investment by Technology</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.slice(0, 8).map(r => ({ id: r.id, inv: r.investmentCr }))}><XAxis dataKey="id" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="inv" fill="#4f46e5" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="scr-chart-card"><CardHeader><CardTitle className="text-base">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'Critical', value: records.filter(r => r.priority === 'Critical').length }, { name: 'High', value: records.filter(r => r.priority === 'High').length }, { name: 'Medium', value: records.filter(r => r.priority === 'Medium').length }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#ef4444" /><Cell fill="#f59e0b" /><Cell fill="#6366f1" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="scr-insight-card"><CardHeader><CardTitle className="text-base">Flood-Prone Metro Priority</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Mumbai Mithi River IoT sensor network (SCR-0001) covers 24 lakh citizens with 4-hour advance flood warning. Investment of &#8377;350Cr is critical given 2005 &amp; 2017 flood recurrence. Combined with Chennai cool roof program (SCR-0002), these two projects address the highest climate vulnerability corridors in India.</p></CardContent></Card>
          <Card className="scr-insight-card"><CardHeader><CardTitle className="text-base">Seismic + Grid Resilience Synergy</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Hyderabad seismic retrofit sensors (SCR-0003) at &#8377;480Cr and Bengaluru microgrid islanding (SCR-0007) at &#8377;620Cr together create a model for multi-hazard resilience. Total &#8377;1,100Cr investment across South zone demonstrates highest concentration of resilience capital.</p></CardContent></Card>
          <Card className="scr-insight-card"><CardHeader><CardTitle className="text-base">Water Security Integration</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Delhi smart water ATMs (SCR-0004) saving 120 MGD freshwater and Pune aquifer recharge (SCR-0010) adding 15 MCM/yr represent India&apos;s most comprehensive urban water resilience programs. Together covering 41.8 lakh citizens, these set the template for SCORP Mission cities.</p></CardContent></Card>
          <Card className="scr-insight-card"><CardHeader><CardTitle className="text-base">Drone-Based Emergency Response</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Indore BVLOS drone network (SCR-0014) with 15-minute response time and Kochi fire detection AI (SCR-0012) represent the next generation of urban emergency infrastructure. Both projects leverage edge AI for real-time decision-making, reducing dependency on manual emergency dispatch.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
