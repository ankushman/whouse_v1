'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface OENRecord {
  id: string;
  projectId: string;
  location: string;
  site: string;
  developer: string;
  technology: string;
  capacityMW: number;
  annualGenGWh: number;
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

const records: OENRecord[] = [
  { id: 'OEN-0001', projectId: 'OEN-G26GJ1', location: 'Gujarat', site: 'Gulf of Kutch OTEC Plant', developer: 'Ocean Sun India', technology: 'OTEC (Ocean Thermal) 100MW', capacityMW: 100, annualGenGWh: 876, investmentCr: 2800, status: 'In Transit', priority: 'Critical', origin: 'Ocean Sun HQ Oslo', destination: 'Gulf of Kutch Installation Site', shipDate: '2026-07-28', transitDays: 5, zone: 'West', remarks: 'Ocean Sun Gulf of Kutch &#8594; India&apos;s first Ocean Thermal Energy Conversion plant at 100 MW using 28&#176;C surface and 5&#176;C deep seawater temperature differential. &#8377;2,800Cr investment includes 3,000m cold water pipeline, ammonia working fluid turbine and desalination module producing 50,000 m&#179;/day fresh water. Kutch&apos;s 30&#176;C+ surface temperature provides excellent OTEC gradient &#8594; 876 GWh/yr baseload generation replacing 245,000 tonnes coal. Plant also produces cold-water aquaculture for shrimp farming &#8594; triple revenue from power, water and seafood' },
  { id: 'OEN-0002', projectId: 'OEN-T26TN1', location: 'Tamil Nadu', site: 'Puducherry Wave Energy Farm', developer: 'Wave Energy Scotland India', technology: 'Oscillating Water Column (OWC)', capacityMW: 25, annualGenGWh: 65, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'WES Manufacturing Glasgow', destination: 'Puducherry Coastal Installation', shipDate: '2026-07-10', transitDays: 4, zone: 'South', remarks: 'Wave Energy Scotland Puducherry &#8594; India&apos;s first commercial Oscillating Water Column wave farm at 25 MW deployed 2 km offshore. &#8377;420Cr investment includes 50 OWC units with Wells turbine generators anchored to seabed. Bay of Bengal&apos;s 1.5m average wave height generates 65 GWh/yr &#8594; powering 45,000 coastal households. OWC technology has zero moving parts underwater &#8594; minimal marine life impact and 25-year lifetime. Puducherry&apos;s rocky shoreline provides natural wave amplification &#8594; energy yield 20% above global OWC average' },
  { id: 'OEN-0003', projectId: 'OEN-K26KL1', location: 'Kerala', site: 'Vizhinjam Tidal Stream Array', developer: 'Simec Atlantis India', technology: 'Tidal Stream Generator (MeyGen)', capacityMW: 50, annualGenGWh: 175, investmentCr: 880, status: 'Processing', priority: 'High', origin: 'Simec Atlantis Edinburgh', destination: 'Vizhinjam Deep Water Port', shipDate: '2026-08-01', transitDays: 6, zone: 'South', remarks: 'Simec Atlantis Vizhinjam &#8594; India&apos;s first tidal stream array at 50 MW using 20 horizontal-axis underwater turbines in the Arabian Sea tidal current. &#8377;880Cr investment with 3.5 m/s peak tidal velocity during monsoon season. Tidal stream provides predictable baseload generation &#8594; 175 GWh/yr at 40% capacity factor. Vizhinjam&apos;s deep-water port construction creates synergies for turbine installation and maintenance. Kerala&apos;s 580 km coastline has 15 identified tidal sites with 2,500 MW total potential &#8594; Vizhinjam is first of a 500 MW tidal pipeline' },
  { id: 'OEN-0004', projectId: 'OEN-M26MH1', location: 'Maharashtra', site: 'Mumbai Offshore Wave Converter', developer: 'Bombay Marine Energy', technology: 'Point Absorber Wave Buoy', capacityMW: 15, annualGenGWh: 39, investmentCr: 245, status: 'Delivered', priority: 'High', origin: 'Bombay Marine Shipyard Mumbai', destination: 'Mumbai Harbour Offshore Zone', shipDate: '2026-07-08', transitDays: 1, zone: 'West', remarks: 'Bombay Marine Mumbai &#8594; India&apos;s first point absorber wave energy converter farm at 15 MW deployed off Mumbai coast. &#8377;245Cr investment includes 120 floating buoys with linear generators connected by subsea cables. Arabian Sea&apos;s consistent swell provides 39 GWh/yr &#8594; powering Mumbai&apos;s coastal suburbs. Point absorber technology works in shallow and deep water &#8594; scalable to 200 MW. Mumbai&apos;s wave climate (1.2-2.5m significant height) is ideal for point absorbers &#8594; buoy design inspired by fishing float technology familiar to local maritime community' },
  { id: 'OEN-0005', projectId: 'OEN-O26OR1', location: 'Odisha', site: 'Gopalpur Osmotic Power Plant', developer: 'Statkraft India', technology: 'Salinity Gradient (PRO)', capacityMW: 10, annualGenGWh: 88, investmentCr: 350, status: 'In Transit', priority: 'High', origin: 'Statkraft HQ Oslo', destination: 'Gopalpur Port Estuary', shipDate: '2026-07-26', transitDays: 4, zone: 'East', remarks: 'Statkraft Gopalpur &#8594; India&apos;s first osmotic power plant using salinity gradient between Rushikulya river freshwater and Bay of Bengal seawater. &#8377;350Cr investment includes PRO (Pressure Retarded Osmosis) membranes and brackish water treatment. 10 MW baseload from river-sea mixing &#8594; 88 GWh/yr at 100% capacity factor (no intermittency). Odisha&apos;s 6 major river deltas provide 1,000 MW osmotic potential &#8594; Gopalpur demonstrates commercial viability. Plant operates 24/7 unlike wave or tidal &#8594; ideal for grid stability. Statkraft&apos;s global osmotic R&amp;D (since 2009) achieves 4 W/m&#178; membrane power density &#8594; India&apos;s warm waters increase efficiency by 15%' },
  { id: 'OEN-0006', projectId: 'OEN-A26AP1', location: 'Andhra Pradesh', site: 'Kakinada Tidal Lagoon', developer: 'Tidal Lagoon Power India', technology: 'Tidal Range (Barrage/Lagoon)', capacityMW: 80, annualGenGWh: 210, investmentCr: 1600, status: 'Delivered', priority: 'High', origin: 'TLP Engineering Cardiff', destination: 'Kakinada Bay Construction', shipDate: '2026-07-14', transitDays: 5, zone: 'East', remarks: 'Tidal Lagoon Power Kakinada &#8594; India&apos;s first tidal lagoon at 80 MW enclosing Kakinada Bay with a 5 km breakwater and 24 bulb turbines. &#8377;1,600Cr investment with 40-year lifetime and 210 GWh/yr generation from 1.5m tidal range. Tidal lagoon doubles as coastal protection for Kakinada&apos;s fishing communities &#8594; preventing cyclone storm surge damage worth &#8377;200Cr annually. Breakwater creates recreational lagoon for tourism and aquaculture &#8594; multi-use infrastructure. AP&apos;s 974 km coastline has 8 tidal lagoon sites with 4,000 MW potential &#8594; Kakinada leads India&apos;s tidal range program' },
  { id: 'OEN-0007', projectId: 'OEN-W26WB1', location: 'West Bengal', site: 'Sundarbans Wave-Tidal Hybrid', developer: 'East Coast Ocean Energy', technology: 'Wave + Tidal Hybrid System', capacityMW: 35, annualGenGWh: 98, investmentCr: 580, status: 'Delivered', priority: 'Medium', origin: 'ECOE Fabrication Haldia', destination: 'Sundarbans Buffer Zone', shipDate: '2026-07-12', transitDays: 2, zone: 'East', remarks: 'East Coast Ocean Energy Sundarbans &#8594; World&apos;s first mangrove-compatible wave-tidal hybrid at 35 MW in Sundarbans buffer zone. &#8377;580Cr investment combines 20 MW tidal stream with 15 MW wave OWC &#8594; 98 GWh/yr for Sundarbans eco-tourism and fishing communities. Floating turbine design avoids seabed disturbance &#8594; zero impact on mangrove root systems and tiger habitat. Sundarbans&apos;s 4 m tidal range and 2 m monsoon waves create complementary generation profiles &#8594; hybrid system achieves 55% capacity factor. Project validates ocean energy in UNESCO World Heritage Site &#8594; global template for sensitive marine environments' },
  { id: 'OEN-0008', projectId: 'OEN-K26KA1', location: 'Karnataka', site: 'Mangalore OTEC Demonstration', developer: 'Makai Ocean Engineering India', technology: 'OTEC (Ocean Thermal) 5MW Demo', capacityMW: 5, annualGenGWh: 44, investmentCr: 180, status: 'In Transit', priority: 'Medium', origin: 'Makai Ocean Hawaii', destination: 'Mangalore Offshore Platform', shipDate: '2026-07-25', transitDays: 6, zone: 'South', remarks: 'Makai Ocean Mangalore &#8594; India&apos;s OTEC demonstration plant at 5 MW proving technology for Arabian Sea conditions. &#8377;180Cr investment includes 1,000m cold water pipe, ammonia closed-loop turbine and surface condenser. Arabian Sea&apos;s 28&#176;C surface and 4&#176;C deep water at 1,000m provides 24&#176;C temperature differential &#8594; 44 GWh/yr continuous baseload. Demonstration phase validates turbine efficiency and biofouling control for Indian waters &#8594; successful operation triggers 100 MW Gujarat and 200 MW Tamil Nadu OTEC plants. Mangalore port provides installation base &#8594; Karnataka targets 500 MW ocean thermal by 2030' },
  { id: 'OEN-0009', projectId: 'OEN-L26LKD1', location: 'Lakshadweep', site: 'Minicoy Atoll Wave Farm', developer: 'Ocean Sun India', technology: 'Floating Solar-Wave Hybrid', capacityMW: 8, annualGenGWh: 22, investmentCr: 95, status: 'Delivered', priority: 'Medium', origin: 'Ocean Sun Kochi Assembly', destination: 'Minicoy Atoll Lagoon', shipDate: '2026-07-08', transitDays: 5, zone: 'West', remarks: 'Ocean Sun Minicoy &#8594; India&apos;s first island wave-solar hybrid plant at 8 MW replacing Lakshadweep&apos;s diesel generators. &#8377;95Cr investment combines 3 MW floating solar panels with 5 MW wave ring generators inside Minicoy&apos;s atoll lagoon. Lagoon provides natural wave amplification and calm installation conditions &#8594; 22 GWh/yr eliminates 8 million litres diesel import annually. Lakshadweep&apos;s 36 islands consume 50 GWh/yr from diesel at &#8377;32/unit &#8594; wave-solar hybrid reduces cost to &#8377;6/unit. Project demonstrates energy independence for India&apos;s island territories &#8594; scalable to Andaman and Nicobar Islands' },
  { id: 'OEN-0010', projectId: 'OEN-A26AN1', location: 'Andaman', site: 'Port Blair OTEC Mini-Grid', developer: 'Makai Ocean Engineering India', technology: 'OTEC + Desalination Mini-Grid', capacityMW: 3, annualGenGWh: 26, investmentCr: 85, status: 'Processing', priority: 'Medium', origin: 'Makai Ocean Chennai Facility', destination: 'Port Blair Offshore', shipDate: '2026-08-02', transitDays: 7, zone: 'East', remarks: 'Makai Ocean Port Blair &#8594; India&apos;s first OTEC-powered desalination mini-grid for Andaman &amp; Nicobar Islands. &#8377;85Cr investment at 3 MW power plus 2,000 m&#179;/day desalinated water for Port Blair. Andaman Sea&apos;s warm surface (30&#176;C) and deep cold water (4&#176;C at 800m) provide 26&#176;C OTEC gradient &#8594; 26 GWh/yr plus 730,000 m&#179;/yr fresh water. Replaces Port Blair&apos;s diesel generators and reverse osmosis plants &#8594; saving &#8377;180Cr/yr in diesel and electricity costs. Mini-grid model supports island cluster electrification &#8594; applicable to 572 Indian islands' },
  { id: 'OEN-0011', projectId: 'OEN-G26GJ2', location: 'Gujarat', site: 'Diu Wave Energy Breakwater', developer: 'Bombay Marine Energy', technology: 'Overtopping Wave Device', capacityMW: 12, annualGenGWh: 32, investmentCr: 195, status: 'Delivered', priority: 'Medium', origin: 'Bombay Marine Diu Site', destination: 'Diu Coast Breakwater Integration', shipDate: '2026-07-12', transitDays: 2, zone: 'West', remarks: 'Bombay Marine Diu &#8594; India&apos;s first overtopping wave energy device integrated into Diu&apos;s existing breakwater at 12 MW. &#8377;195Cr investment retrofits 240 overtopping reservoirs into the 2 km breakwater &#8594; waves spill into reservoirs and drain through low-head turbines. Overtopping technology is simplest and most robust wave device &#8594; zero underwater moving parts and 50-year lifetime. Diu&apos;s 1-2m wave climate generates 32 GWh/yr &#8594; powering 100% of Diu&apos;s 25 GWh/yr demand with surplus exported to mainland. Breakwater integration reduces CAPEX by 40% vs standalone wave farms &#8594; Diu becomes India&apos;s first wave-powered territory' },
  { id: 'OEN-0012', projectId: 'OEN-T26TN2', location: 'Tamil Nadu', site: 'Rameswaram Tidal Fence', developer: 'Simec Atlantis India', technology: 'Tidal Fence (Vertical Axis)', capacityMW: 20, annualGenGWh: 52, investmentCr: 380, status: 'In Transit', priority: 'Medium', origin: 'Simec Atlantis Tuticorin', destination: 'Pamban Channel Rameswaram', shipDate: '2026-07-24', transitDays: 3, zone: 'South', remarks: 'Simec Atlantis Rameswaram &#8594; India&apos;s first tidal fence at 20 MW spanning Pamban Channel with 40 vertical-axis turbines mounted on a cross-structure. &#8377;380Cr investment exploits 3 m/s peak tidal flow through India&apos;s narrowest tidal strait. Tidal fence is cheaper than barrage &#8594; open structure allows fish passage and sediment transport. Palk Strait&apos;s 4 m tidal range and narrow channel create focused tidal jet &#8594; 52 GWh/yr at 30% capacity factor. Rameswaram&apos;s pilgrimage tourism (4M visitors/yr) creates visible showcase &#8594; tidal fence designed as tourist attraction with underwater viewing gallery' },
  { id: 'OEN-0013', projectId: 'OEN-M26MH2', location: 'Maharashtra', site: 'Ratnagiri Wave Energy Hub', developer: 'Wave Energy Scotland India', technology: 'Multi-Technology Wave Array', capacityMW: 40, annualGenGWh: 105, investmentCr: 720, status: 'Delivered', priority: 'High', origin: 'WES Ratnagiri Assembly', destination: 'Ratnagiri Coast Offshore', shipDate: '2026-07-08', transitDays: 1, zone: 'West', remarks: 'Wave Energy Scotland Ratnagiri &#8594; India&apos;s multi-technology wave energy test and demonstration hub at 40 MW combining OWC, point absorber and attenuator devices. &#8377;720Cr investment includes wave flume test facility, submarine cable hub and 15 km&#178; offshore array zone. Ratnagiri&apos;s Arabian Sea coast provides India&apos;s best wave resource &#8594; 2.5m average height with 8-second period. Hub enables technology comparison: OWC (15 MW), point absorber (15 MW), attenuator (10 MW) &#8594; generates 105 GWh/yr while testing 3 technologies. Ratnagiri port provides marine operations base &#8594; hub to certify wave devices for Indian Maritime Agency standards' },
  { id: 'OEN-0014', projectId: 'OEN-P26PDY1', location: 'Puducherry', site: 'Auroville Wave-Powered Desal', developer: 'East Coast Ocean Energy', technology: 'Wave-Powered RO Desalination', capacityMW: 2, annualGenGWh: 6, investmentCr: 45, status: 'Delivered', priority: 'Medium', origin: 'ECOE Puducherry Workshop', destination: 'Auroville Coastal Site', shipDate: '2026-07-12', transitDays: 1, zone: 'South', remarks: 'East Coast Ocean Energy Auroville &#8594; India&apos;s first wave-powered reverse osmosis desalination plant at 2 MW providing 5,000 m&#179;/day fresh water. &#8377;45Cr investment uses wave energy to directly drive high-pressure RO pumps &#8594; bypassing electricity generation stage for 60% efficiency gain. Auroville&apos;s experimental community proves wave desalination for coastal villages &#8594; water cost &#8377;0.03/litre vs &#8377;0.08/litre for grid-powered RO. Plant operates during monsoon when wave energy peaks but freshwater demand is highest &#8594; natural demand-supply alignment. Technology scalable to Tamil Nadu&apos;s 1,000 coastal villages facing seawater intrusion &#8594; &#8377;4,500Cr market potential' },
];

const COLORS = ['#0369a1', '#0284c7', '#0ea5e9', '#38bdf8', '#075985', '#0c4a6e', '#082f49', '#065f46'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 4 }, { value: 'Delivered', count: 7 }, { value: 'Processing', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 2 }, { value: 'High', count: 5 }, { value: 'Medium', count: 7 },
  ]},
  { label: 'Technology', key: 'technology', options: [
    { value: 'OTEC (Ocean Thermal) 100MW', count: 1 }, { value: 'Oscillating Water Column (OWC)', count: 1 }, { value: 'Tidal Stream Generator (MeyGen)', count: 1 }, { value: 'Point Absorber Wave Buoy', count: 1 }, { value: 'Salinity Gradient (PRO)', count: 1 }, { value: 'Tidal Range (Barrage/Lagoon)', count: 1 }, { value: 'Wave + Tidal Hybrid System', count: 1 }, { value: 'OTEC (Ocean Thermal) 5MW Demo', count: 1 }, { value: 'Floating Solar-Wave Hybrid', count: 1 }, { value: 'OTEC + Desalination Mini-Grid', count: 1 }, { value: 'Overtopping Wave Device', count: 1 }, { value: 'Tidal Fence (Vertical Axis)', count: 1 }, { value: 'Multi-Technology Wave Array', count: 1 }, { value: 'Wave-Powered RO Desalination', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 5 }, { value: 'West', count: 4 }, { value: 'East', count: 4 }, { value: 'North', count: 1 },
  ]},
];

export default function OceanEnergyView() {
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
    return records.filter((r: OENRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase()) || r.site.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof OENRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalCap = records.reduce((s, r) => s + r.capacityMW, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const totalGen = records.reduce((s, r) => s + r.annualGenGWh, 0);
  const avgCapFactor = Math.round((totalGen * 1000) / (totalCap * 8760) * 100);

  const kpiData = [
    { label: 'Total Installed Capacity', value: `${totalCap} MW`, sub: 'Ocean Energy Portfolio' },
    { label: 'Annual Generation', value: `${totalGen.toLocaleString()} GWh`, sub: `Avg ${avgCapFactor}% Capacity Factor` },
    { label: 'Technology Types', value: '10 Types', sub: 'OTEC Wave Tidal Hybrid Osmotic' },
    { label: 'Total Investment', value: `&#8377;${(totalInv / 1000).toFixed(1)}K Cr`, sub: 'Ocean Energy Infrastructure' },
  ];

  const locData = useMemo(() => records.map(r => ({ location: r.location, gen: r.annualGenGWh, cap: r.capacityMW })).sort((a, b) => b.gen - a.gen), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const capVsGen = useMemo(() => records.map(r => ({ location: r.location, cap: r.capacityMW, gen: r.annualGenGWh })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 oen-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Ocean Energy' }]} />
      <PageHeader title="Ocean Energy Logistics" description="India&apos;s ocean energy portfolio spanning OTEC, wave, tidal stream, tidal range, osmotic power and wave-solar hybrid technologies across 14 coastal and island sites" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#0369a1] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="oen-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#0369a1]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="oen-chart-card"><CardHeader><CardTitle className="text-base">Annual Generation by Location (GWh)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={locData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="location" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="gen" fill="#0369a1" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="oen-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#0369a1" /><Cell fill="#0284c7" /><Cell fill="#0ea5e9" /><Cell fill="#075985" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'oen-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Ocean Energy Site Registry' : 'Recent Deployments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#0369a1] bg-sky-50/20'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.location} &#8594; {r.transitDays}d | {r.capacityMW} MW | {r.annualGenGWh} GWh/yr</span>
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
          <Card className="oen-chart-card"><CardHeader><CardTitle className="text-base">Capacity vs Annual Generation</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={capVsGen}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="location" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="cap" stroke="#0369a1" strokeWidth={2} name="Capacity (MW)" /><Line yAxisId="right" type="monotone" dataKey="gen" stroke="#075985" strokeWidth={2} name="Generation (GWh)" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="oen-chart-card"><CardHeader><CardTitle className="text-base">Investment per MW (&#8377;Cr/MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ location: r.location, invMw: +(r.investmentCr / r.capacityMW).toFixed(0) }))}><XAxis dataKey="location" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="invMw" fill="#0284c7" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="oen-chart-card"><CardHeader><CardTitle className="text-base">Total Capacity by Zone (MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.zone] = (m[r.zone] || 0) + r.capacityMW; return m; }, {})).map(([k, v]) => ({ zone: k, cap: v }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="cap" fill="#075985" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="oen-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 4 }, { name: 'Delivered', value: 7 }, { name: 'Processing', value: 2 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#0369a1" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="oen-insight-card"><CardHeader><CardTitle className="text-base">OTEC: India&apos;s Baseload Ocean Power</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">India deploys 3 OTEC plants (OEN-0001, OEN-0008, OEN-0010) totaling 108 MW with unique 24/7 baseload capability &#8594; unlike wave and tidal which are intermittent, OTEC runs continuously using ocean temperature gradient. Gulf of Kutch 100 MW plant (&#8377;2,800Cr) is Asia&apos;s largest OTEC installation &#8594; additionally producing 50,000 m&#179;/day desalinated water. India&apos;s tropical waters (28-30&#176;C surface) provide world&apos;s best OTEC resource &#8594; 40,000 MW potential in Arabian Sea and Bay of Bengal. OTEC simultaneously addresses power, water and aquaculture &#8594; triple-revenue model improves economics by 70% vs single-output plants.</p></CardContent></Card>
          <Card className="oen-insight-card"><CardHeader><CardTitle className="text-base">Wave Energy: 10 Technologies Converging</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">India&apos;s ocean energy portfolio demonstrates remarkable technology diversity &#8594; 10 distinct technologies across 14 sites including OWC, point absorber, attenuator, overtopping, tidal stream, tidal range, tidal fence, osmotic, wave-solar hybrid and wave-powered desalination. Ratnagiri Hub (OEN-0013) is India&apos;s first multi-technology wave testing centre at 40 MW comparing OWC, point absorber and attenuator head-to-head &#8594; establishing performance benchmarks for Indian wave climate. Technology diversity reduces portfolio risk &#8594; if one technology underperforms, others compensate. India targets 1,000 MW ocean energy by 2030 through MNRE&apos;s Ocean Energy Program.</p></CardContent></Card>
          <Card className="oen-insight-card"><CardHeader><CardTitle className="text-base">Island Energy Independence: Diesel-Free by 2028</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Lakshadweep (OEN-0009) and Andaman (OEN-0010) demonstrate ocean energy&apos;s transformative potential for India&apos;s 572 islands &#8594; combined 11 MW replaces 8 million litres/year diesel import at &#8377;180Cr annual savings. Minicoy wave-solar hybrid achieves &#8377;6/unit vs &#8377;32/unit diesel &#8594; 81% cost reduction enabling economic development. Port Blair OTEC mini-grid adds desalination producing 730,000 m&#179;/year &#8594; solving islands&apos; freshwater crisis simultaneously. India&apos;s island territories consume 200 GWh/yr diesel power &#8594; converting 50% to ocean energy by 2028 saves &#8377;800Cr annually and eliminates 550,000 tonnes CO2.</p></CardContent></Card>
          <Card className="oen-insight-card"><CardHeader><CardTitle className="text-base">India Ocean Energy Target: 10,000 MW by 2035</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Portfolio of 405 MW at &#8377;8,363Cr demonstrates India&apos;s ocean energy capability across 10 technologies and 14 coastal sites. India&apos;s 7,517 km coastline offers estimated 55,000 MW ocean energy potential &#8594; 40,000 MW tidal, 10,000 MW wave, 5,000 MW OTEC. MNRE announced &#8377;2/unit ocean energy tariff for first 10 years &#8594; making OTEC and tidal range competitive with solar at &#8377;3/unit. Ocean energy&apos;s baseload advantage (OTEC, osmotic) complements solar/wind intermittency &#8594; critical for grid stability at India&apos;s 500 GW renewable target by 2030. &#8377;25,000Cr investment needed for 10,000 MW by 2035 &#8594; attracting &#8377;12,000Cr FDI from Norway, Scotland and Japan.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
