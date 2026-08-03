'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface BJFRecord {
  id: string;
  projectId: string;
  feedstock: string;
  processRoute: string;
  certStandard: string;
  airlinePartner: string;
  airport: string;
  blendRatio: number;
  annualVolumeKL: number;
  investmentCr: number;
  co2SavedTonnes: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: BJFRecord[] = [
  { id: 'BJF-0001', projectId: 'BJF-D26DEL', feedstock: 'Used Cooking Oil (UCO)', processRoute: 'HEFA (Hydroprocessed Esters &amp; Fatty Acids)', certStandard: 'ASTM D7566 + IS 17094', airlinePartner: 'Air India', airport: 'DEL Indira Gandhi', blendRatio: 10, annualVolumeKL: 8500, investmentCr: 1200, co2SavedTonnes: 24500, status: 'In Transit', priority: 'Critical', origin: 'Neste Porvola India Depot', destination: 'DEL Fuel Farm Terminal 2', shipDate: '2026-07-28', transitDays: 3, zone: 'North', remarks: '8,500 KL/yr SAF-HEFA blend for Air India hub at Delhi &#8594; 10% blend replacing 850 KL fossil jet fuel monthly. UCO sourced from 1,200+ Delhi NCR restaurants &#8594; 24,500 tCO2/yr reduction. India&apos;s first commercial SAF supply chain under National Bio-Energy Programme targeting 1% SAF blend by 2027' },
  { id: 'BJF-0002', projectId: 'BJF-M26MUM', feedstock: 'Jatropha + Camelina Oil', processRoute: 'ATJ (Alcohol-to-Jet) Fermentation', certStandard: 'ASTM D7566 Annex A5', airlinePartner: 'Vistara', airport: 'MUM Chhatrapati Shivaji', blendRatio: 5, annualVolumeKL: 6200, investmentCr: 950, co2SavedTonnes: 17800, status: 'Delivered', priority: 'Critical', origin: 'Tata BP Biofuels Lote', destination: 'MUM Terminal 1B Fuel Farm', shipDate: '2026-07-10', transitDays: 2, zone: 'West', remarks: '6,200 KL/yr ATJ-SAF from Jatropha cultivation on 12,000 ha Maharashtra wasteland &#8594; 5% blend for Vistara&apos;s 180 daily departures. 17,800 tCO2/yr saved &#8594; supporting tribal farmer cooperatives in Vidarbha with &#8377;12Cr annual feedstock procurement' },
  { id: 'BJF-0003', projectId: 'BJF-B26BLR', feedstock: 'Agricultural Residue (Rice Husk)', processRoute: 'FT (Fischer-Tropsch) Gasification', certStandard: 'ASTM D7566 Annex A1', airlinePartner: 'IndiGo', airport: 'BLR Kempegowda', blendRatio: 8, annualVolumeKL: 7800, investmentCr: 1450, co2SavedTonnes: 22400, status: 'Processing', priority: 'High', origin: 'Praj Industries Kandla', destination: 'BLR SATS Fuel Depot', shipDate: '2026-08-01', transitDays: 4, zone: 'South', remarks: '7,800 KL/yr FT-SAF from rice husk gasification for IndiGo&apos;s largest hub &#8594; 8% blend on 350 daily flights. 22,400 tCO2/yr savings &#8594; Praj Industries proprietary 2G biomass-to-liquid tech from 35,000 TPD rice husk collected across 8 Karnataka districts' },
  { id: 'BJF-0004', projectId: 'BJF-H26HYD', feedstock: 'Sugarcane Ethanol', processRoute: 'SIP (Synthesized Iso-Paraffins)', certStandard: 'ASTM D7566 Annex A2', airlinePartner: 'SpiceJet', airport: 'HYD Rajiv Gandhi', blendRatio: 3, annualVolumeKL: 3200, investmentCr: 680, co2SavedTonnes: 9200, status: 'Delivered', priority: 'High', origin: 'Godavari Sugar Mills Samalkot', destination: 'HYD GMR Fuel Terminal', shipDate: '2026-07-08', transitDays: 2, zone: 'South', remarks: '3,200 KL/yr SIP-SAF from sugarcane ethanol for SpiceJet regional fleet &#8594; 3% blend. 9,200 tCO2/yr savings leveraging Andhra&apos;s 2.4 lakh ha sugarcane belt. Bio-jet from surplus ethanol &#8594; creates dual income stream for sugar mills facing cyclical price pressure' },
  { id: 'BJF-0005', projectId: 'BJF-C26CHN', feedstock: 'Algae Lipid (Microalgae)', processRoute: 'HEFA + Hydrocracking', certStandard: 'CORSIA + IS 17094', airlinePartner: 'Air India Express', airport: 'MAA Chennai', blendRatio: 5, annualVolumeKL: 4100, investmentCr: 1800, co2SavedTonnes: 11800, status: 'In Transit', priority: 'High', origin: 'Sea6 Energy Kovalam', destination: 'MAA AAI Fuel Farm', shipDate: '2026-07-26', transitDays: 1, zone: 'South', remarks: '4,100 KL/yr algae-HEFA SAF for Air India Express &#8594; 5% blend from marine microalgae cultivation in 500 ha Kovalam coastal ponds. 11,800 tCO2/yr savings &#8594; Sea6 Energy&apos;s patented ocean-based algae platform producing 15x more lipid per ha than terrestrial crops' },
  { id: 'BJF-0006', projectId: 'BJF-K26KOL', feedstock: 'Mustard Seed Oil + MSW Oil', processRoute: 'HEFA Co-Processing', certStandard: 'ASTM D7566', airlinePartner: 'SpiceJet', airport: 'CCU Netaji Subhas', blendRatio: 7, annualVolumeKL: 5500, investmentCr: 850, co2SavedTonnes: 15800, status: 'Delayed', priority: 'High', origin: 'IOCL Haldia Refinery', destination: 'CCU AAI Fuel Depot', shipDate: '2026-07-18', transitDays: 2, zone: 'East', remarks: '5,500 KL/yr HEFA co-processing SAF &#8594; 7% blend from mustard oil (Rajasthan) + MSW-derived oil (Kolkata). 15,800 tCO2/yr savings &#8594; IOCL repurposing existing refinery hydrotreater for SAF &#8594; lowest capex model at &#8377;850Cr using &#8377;120Cr repurposed refinery units' },
  { id: 'BJF-0007', projectId: 'BJF-C26COK', feedstock: 'Coconut Oil (Copra)', processRoute: 'HEFA Transesterification', certStandard: 'IS 17094 + CORSIA', airlinePartner: 'IndiGo', airport: 'COK Kochi', blendRatio: 5, annualVolumeKL: 2800, investmentCr: 520, co2SavedTonnes: 8050, status: 'Delivered', priority: 'High', origin: 'Kerala State Coconut Dev Board', destination: 'COK CIAL Fuel Depot', shipDate: '2026-07-14', transitDays: 1, zone: 'South', remarks: '2,800 KL/yr copra-HEFA SAF for IndiGo Kochi hub &#8594; 5% blend leveraging Kerala&apos;s 8 lakh ha coconut plantations. 8,050 tCO2/yr savings &#8594; supports 2.5 lakh coconut farmer families with guaranteed buyback &#8377;85/kg copra vs market &#8377;62/kg' },
  { id: 'BJF-0008', projectId: 'BJF-G26GOI', feedstock: 'Soybean Oil + Waste Fat', processRoute: 'HEFA + Bio-Synfining', certStandard: 'ASTM D7566 Annex A2', airlinePartner: 'Air India', airport: 'GOI Dabolim', blendRatio: 10, annualVolumeKL: 2400, investmentCr: 480, co2SavedTonnes: 6900, status: 'In Transit', priority: 'Medium', origin: 'Hindustan Petroleum Goa', destination: 'GOI Mopa Fuel Farm', shipDate: '2026-07-25', transitDays: 2, zone: 'West', remarks: '2,400 KL/yr SAF for Goa tourism flights &#8594; 10% blend from soybean waste oil + animal fat. 6,900 tCO2/yr savings &#8594; HPCL Goa refinery co-processing unit &#8594; targeting 2 million tourist arrivals with lower carbon flights connecting to 25 international routes' },
  { id: 'BJF-0009', projectId: 'BJF-A26AMD', feedstock: 'Groundnut Shell + Cotton Stalk', processRoute: 'Pyrolysis + FT Synthesis', certStandard: 'ASTM D7566 Annex A1', airlinePartner: 'SpiceJet', airport: 'AMD Sardar Vallabhbhai', blendRatio: 3, annualVolumeKL: 1900, investmentCr: 620, co2SavedTonnes: 5460, status: 'Delivered', priority: 'Medium', origin: 'Gujarat Biofuel Mission Bhavnagar', destination: 'AMD Fuel Terminal', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: '1,900 KL/yr pyrolysis-FT SAF for Ahmedabad &#8594; 3% blend from groundnut shell + cotton stalk &#8594; Gujarat&apos;s 20 lakh MT agricultural waste surplus. 5,460 tCO2/yr savings &#8594; supporting Saurashtra cotton farmers with &#8377;2,500/MT waste procurement at farm gate' },
  { id: 'BJF-0010', projectId: 'BJF-L26LKO', feedstock: 'Sugarcane Molasses Ethanol', processRoute: 'ATJ Catalytic Conversion', certStandard: 'CORSIA Eligible', airlinePartner: 'IndiGo', airport: 'LKO Amausi', blendRatio: 5, annualVolumeKL: 2600, investmentCr: 580, co2SavedTonnes: 7480, status: 'Processing', priority: 'Medium', origin: 'UP State Sugar Corp Lucknow', destination: 'LKO AAI Fuel Farm', shipDate: '2026-08-02', transitDays: 1, zone: 'North', remarks: '2,600 KL/yr ATJ-SAF from UP molasses &#8594; 5% blend for IndiGo Lucknow base. 7,480 tCO2/yr savings &#8594; leveraging UP&apos;s 119 sugar mills producing 1,200 crore litres molasses annually. Dedicated SAF production unit adjacent to UP sugar mill cluster' },
  { id: 'BJF-0011', projectId: 'BJF-G26GAU', feedstock: 'Rice Bran Oil + Sesame Oil', processRoute: 'HEFA Hydrotreating', certStandard: 'ASTM D7566 + IS 17094', airlinePartner: 'Air India', airport: 'GAU Lokpriya Gopinath', blendRatio: 5, annualVolumeKL: 1800, investmentCr: 420, co2SavedTonnes: 5180, status: 'Delivered', priority: 'Medium', origin: 'Assam Biofuel Agency Guwahati', destination: 'GAU Fuel Terminal', shipDate: '2026-07-08', transitDays: 3, zone: 'East', remarks: '1,800 KL/yr HEFA-SAF for Guwahati &#8594; 5% blend from NE region rice bran + sesame oil surplus. 5,180 tCO2/yr savings &#8594; supporting NE biofuel mission for 8 states with 85% forest cover and rich oilseed biodiversity' },
  { id: 'BJF-0012', projectId: 'BJF-T26TJV', feedstock: 'Pongamia Oil (Karanj)', processRoute: 'HEFA + Bio-Synfining', certStandard: 'CORSIA + IS 17094', airlinePartner: 'TruJet', airport: 'TJV Tirupati', blendRatio: 3, annualVolumeKL: 1200, investmentCr: 310, co2SavedTonnes: 3450, status: 'In Transit', priority: 'Medium', origin: 'AP Forest Dept Tirumala', destination: 'TJV Fuel Farm', shipDate: '2026-07-24', transitDays: 2, zone: 'South', remarks: '1,200 KL/yr Pongamia-HEFA SAF &#8594; 3% blend from Tirumala foothills Pongamia plantations. 3,450 tCO2/yr savings &#8594; 15,000 ha community Pongamia orchards on degraded forest land &#8594; merging sacred forest conservation with aviation biofuel for Tirupati temple tourism route' },
  { id: 'BJF-0013', projectId: 'BJF-N26NAG', feedstock: 'Sweet Sorghum Juice Ethanol', processRoute: 'ATJ (Alcohol-to-Jet)', certStandard: 'ASTM D7566 Annex A5', airlinePartner: 'IndiGo', airport: 'NAG Dr Babasaheb Ambedkar', blendRatio: 5, annualVolumeKL: 1500, investmentCr: 390, co2SavedTonnes: 4310, status: 'Delivered', priority: 'Medium', origin: 'Vasantdada Sugar Institute Pune', destination: 'NAG Mihan Fuel Depot', shipDate: '2026-07-14', transitDays: 2, zone: 'West', remarks: '1,500 KL/yr sweet sorghum ATJ-SAF &#8594; 5% blend for Nagpur Mihan aerospace hub. 4,310 tCO2/yr savings &#8594; drought-resistant sweet sorghum on Vidarbha&apos;s rain-fed farms &#8594; producing bio-ethanol on 8,000 ha with 40% less water than sugarcane' },
  { id: 'BJF-0014', projectId: 'BJF-R26RAJ', feedstock: 'Sewage Sludge Lipid + MSW Fat', processRoute: 'HEFA Co-Processing Refinery', certStandard: 'CORSIA + EU RED II', airlinePartner: 'Air India', airport: 'JAI Jaipur', blendRatio: 7, annualVolumeKL: 3400, investmentCr: 720, co2SavedTonnes: 9780, status: 'In Transit', priority: 'High', origin: 'Rajasthan State Pollution Control Jaipur', destination: 'JAI Fuel Farm Terminal', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: '3,400 KL/yr sewage+MSW HEFA-SAF &#8594; 7% blend from Jaipur&apos;s 450 MLD sewage lipid + 2,500 TPD MSW fat recovery. 9,780 tCO2/yr savings &#8594; circular economy model converting urban waste into aviation fuel &#8594; India&apos;s first city-scale waste-to-SAF facility under Swachh Bharat Mission 2.0' },
];

const COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#6d28d9', '#5b21b6', '#4c1d95', '#2e1065'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 5 }, { value: 'Processing', count: 2 }, { value: 'Delayed', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 2 }, { value: 'High', count: 6 }, { value: 'Medium', count: 6 },
  ]},
  { label: 'Process Route', key: 'processRoute', options: [
    { value: 'HEFA (Hydroprocessed Esters & Fatty Acids)', count: 5 }, { value: 'ATJ (Alcohol-to-Jet) Fermentation', count: 3 }, { value: 'FT (Fischer-Tropsch) Gasification', count: 1 }, { value: 'SIP (Synthesized Iso-Paraffins)', count: 1 }, { value: 'HEFA + Hydrocracking', count: 1 }, { value: 'HEFA Co-Processing', count: 1 }, { value: 'HEFA Transesterification', count: 1 }, { value: 'HEFA + Bio-Synfining', count: 2 }, { value: 'Pyrolysis + FT Synthesis', count: 1 }, { value: 'ATJ Catalytic Conversion', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 3 }, { value: 'South', count: 5 }, { value: 'West', count: 3 }, { value: 'East', count: 3 },
  ]},
];

export default function BioJetFuelLogisticsView() {
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
    return records.filter((r: BJFRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.airport.toLowerCase().includes(searchQuery.toLowerCase()) || r.feedstock.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof BJFRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalVolume = records.reduce((s, r) => s + r.annualVolumeKL, 0);
  const totalCO2 = records.reduce((s, r) => s + r.co2SavedTonnes, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const avgBlend = (records.reduce((s, r) => s + r.blendRatio, 0) / records.length).toFixed(1);

  const kpiData = [
    { label: 'Annual SAF Volume', value: `${totalVolume.toLocaleString()} KL`, sub: 'Sustainable Aviation Fuel' },
    { label: 'CO2 Reduction', value: `${(totalCO2 / 1000).toFixed(1)}K tonnes`, sub: 'Per Year Across Airports' },
    { label: 'Avg Blend Ratio', value: `${avgBlend}%`, sub: 'SAF-Fossil Jet Blend' },
    { label: 'Total Investment', value: `&#8377;${totalInv.toLocaleString()}Cr`, sub: 'National Bio-Aviation Mission' },
  ];

  const airportData = useMemo(() => records.map(r => ({ airport: r.airport.split(' ')[0], volume: r.annualVolumeKL, co2: r.co2SavedTonnes })).sort((a, b) => b.volume - a.volume), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const blendVsCO2 = useMemo(() => records.map(r => ({ airport: r.airport.split(' ')[0], blend: r.blendRatio, co2: r.co2SavedTonnes })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 bjf-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Bio Jet Fuel Logistics' }]} />
      <PageHeader title="Bio Jet Fuel Logistics" description="Sustainable aviation fuel supply chain from Indian feedstocks &#8594; HEFA, ATJ, FT process routes to airport fuel farms across India" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#7c3aed] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="bjf-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#7c3aed]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-base">SAF Volume by Airport (KL/yr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={airportData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="airport" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="volume" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#7c3aed" /><Cell fill="#8b5cf6" /><Cell fill="#a78bfa" /><Cell fill="#6d28d9" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'bjf-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Bio Jet Fuel Project Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#7c3aed] bg-violet-50/20'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.airport.split(' ')[0]} &#8594; {r.transitDays}d | {r.blendRatio}% blend | {r.annualVolumeKL.toLocaleString()} KL/yr</span>
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
          <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-base">Blend Ratio vs CO2 Savings</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={blendVsCO2}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="airport" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="blend" stroke="#7c3aed" strokeWidth={2} name="Blend %" /><Line yAxisId="right" type="monotone" dataKey="co2" stroke="#6d28d9" strokeWidth={2} name="CO2 (t/yr)" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-base">CO2 Savings per &#8377;Cr Invested</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ airport: r.airport.split(' ')[0], eff: +(r.co2SavedTonnes / r.investmentCr).toFixed(1) }))}><XAxis dataKey="airport" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="eff" fill="#8b5cf6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-base">Feedstock Diversity by Zone</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + r.annualVolumeKL; return m; }, {})).map(([k, v]) => ({ zone: k, volumeKL: v }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="volumeKL" fill="#6d28d9" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 5 }, { name: 'Delivered', value: 5 }, { name: 'Processing', value: 2 }, { name: 'Delayed', value: 1 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#7c3aed" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /><Cell fill="#ef4444" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bjf-insight-card"><CardHeader><CardTitle className="text-base">Delhi UCO-SAF Leads at 24,500 tCO2/yr</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Delhi&apos;s UCO-HEFA supply chain (BJF-0001) achieves India&apos;s highest SAF volume at 8,500 KL/yr and 24,500 tCO2 reduction &#8212; equivalent to removing 5,300 cars from Delhi roads. Sourcing UCO from 1,200 restaurants across NCR creates a circular economy model &#8594; converting waste cooking oil into aviation fuel while reducing restaurant waste disposal costs by 80%.</p></CardContent></Card>
          <Card className="bjf-insight-card"><CardHeader><CardTitle className="text-base">Bengaluru Rice Husk FT Innovation</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Bengaluru&apos;s rice husk FT-SAF plant (BJF-0003) uses Praj Industries&apos; proprietary 2G biomass-to-liquid technology &#8594; converting 35,000 TPD rice husk into 7,800 KL/yr SAF at 8% blend. Karnataka produces 15 lakh MT rice husk annually &#8594; this plant uses just 2.3% of that waste while generating rural employment for 3,000 collection workers.</p></CardContent></Card>
          <Card className="bjf-insight-card"><CardHeader><CardTitle className="text-base">Kerala Coconut Copra Farmer Impact</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Kerala&apos;s copra-HEFA SAF (BJF-0007) demonstrates how SAF can transform rural agricultural economics &#8594; guaranteed &#8377;85/kg copra buyback (vs market &#8377;62/kg) benefits 2.5 lakh coconut farmer families. The 2,800 KL/yr output is modest but the farmer income uplift model is scalable &#8594; potentially raising coconut farmer incomes by 37% across India&apos;s 8 lakh ha.</p></CardContent></Card>
          <Card className="bjf-insight-card"><CardHeader><CardTitle className="text-base">India SAF Mission &#8594; 2027 Target</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Total portfolio of 54,900 KL/yr SAF and 1,52,590 tCO2/yr reduction across 14 airports at &#8377;12,070Cr represents India&apos;s first commercial SAF network. National target: 1% SAF blend by 2027 and 5% by 2030 &#8594; requiring 300,000 KL/yr by 2027 and 1.5M KL/yr by 2030. Current portfolio meets 18% of 2027 target &#8594; &#8377;65,000Cr additional investment needed across 50 airports.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
