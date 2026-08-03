'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface UCMRecord {
  id: string;
  projectId: string;
  canopyType: string;
  species: string;
  city: string;
  treesPlanted: number;
  canopyCoverSqKm: number;
  carbonSequestrationTonsPerYear: number;
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

const records: UCMRecord[] = [
  { id: 'UCM-0001', projectId: 'UCM-B26DEL', canopyType: 'Avenue Plantation', species: 'Neem + Peepal + Banyan', city: 'Delhi', treesPlanted: 250000, canopyCoverSqKm: 18.5, carbonSequestrationTonsPerYear: 12500, investmentCr: 185, status: 'In Transit', priority: 'Critical', origin: 'Forest Research Institute Dehradun', destination: 'DIP Nursery Lodhi Garden', shipDate: '2026-07-28', transitDays: 1, zone: 'North', remarks: '2.5 lakh avenue trees along 800 km Delhi roads &#8212; Neem-Peepal-Banyan mix for 18.5 sq km canopy adding 12,500 tCO2/yr sequestration under Delhi Green Action Plan' },
  { id: 'UCM-0002', projectId: 'UCM-P26BLR', canopyType: 'Urban Forest Blocks', species: 'Pongamia + Cassia + Peltophorum', city: 'Bengaluru', treesPlanted: 180000, canopyCoverSqKm: 14.2, carbonSequestrationTonsPerYear: 9800, investmentCr: 210, status: 'Delivered', priority: 'High', origin: 'IFGTB Bengaluru', destination: 'BBMP Cubbon Park Nursery', shipDate: '2026-07-10', transitDays: 1, zone: 'South', remarks: '1.8 lakh urban forest trees creating 14.2 sq km canopy &#8212; targeting 3&#176;C UHI reduction in tech corridor Bengaluru with native Pongamia-Cassia shade species' },
  { id: 'UCM-0003', projectId: 'UCM-M26MUM', canopyType: 'Mangrove Buffer', species: 'Avicennia + Rhizophora + Sonneratia', city: 'Mumbai', treesPlanted: 350000, canopyCoverSqKm: 22.0, carbonSequestrationTonsPerYear: 28000, investmentCr: 320, status: 'In Transit', priority: 'Critical', origin: 'ICMAM Chennai', destination: 'MCGB Gorai Mangrove Nursery', shipDate: '2026-07-25', transitDays: 3, zone: 'West', remarks: '3.5 lakh mangrove saplings along 65 km Mumbai coastline &#8212; Avicennia-Rhizophora-Sonneratia tri-species providing 22 sq km blue carbon sink + 28,000 tCO2/yr sequestration + storm surge buffer' },
  { id: 'UCM-0004', projectId: 'UCM-C26CHN', canopyType: 'Temple Garden Canopy', species: 'Pungan + Arasu + Vembu', city: 'Chennai', treesPlanted: 120000, canopyCoverSqKm: 8.5, carbonSequestrationTonsPerYear: 6200, investmentCr: 95, status: 'Delivered', priority: 'Medium', origin: 'TNAU Coimbatore', destination: 'GCC Adyar Tree Bank', shipDate: '2026-07-08', transitDays: 1, zone: 'South', remarks: '1.2 lakh native tropical trees for temple gardens &amp; heritage streets &#8212; Pungan-Arasu-Vembu (Tamil) species creating 8.5 sq km shade canopy reducing Chennai heat island by 2.5&#176;C' },
  { id: 'UCM-0005', projectId: 'UCM-R26HYD', canopyType: 'Lake Foreshore Buffer', species: 'Ficus + Terminalia + Millettia', city: 'Hyderabad', treesPlanted: 95000, canopyCoverSqKm: 11.0, carbonSequestrationTonsPerYear: 7800, investmentCr: 140, status: 'Processing', priority: 'High', origin: 'NBRI Lucknow', destination: 'HMDA KBR Park Nursery', shipDate: '2026-07-30', transitDays: 2, zone: 'South', remarks: '95,000 lake-foreshore trees across Hussain Sagar + 50 city lakes &#8212; Ficus-Terminalia-Millettia buffer strips creating 11 sq km green buffer improving groundwater recharge by 35%' },
  { id: 'UCM-0006', projectId: 'UCM-T26KOL', canopyType: 'Rooftop Urban Forest', species: 'Moringa + Curry Leaf + Amla', city: 'Kolkata', treesPlanted: 60000, canopyCoverSqKm: 4.2, carbonSequestrationTonsPerYear: 3100, investmentCr: 55, status: 'In Transit', priority: 'Medium', origin: 'ARI Kolkata', destination: 'KMC Rabindra Sarobar Nursery', shipDate: '2026-07-26', transitDays: 1, zone: 'East', remarks: '60,000 rooftop Moringa-Curry-Amla food forest trees &#8212; 4.2 sq km distributed canopy on 15,000 rooftops providing nutrition + shade + 3,100 tCO2/yr in densely populated Kolkata' },
  { id: 'UCM-0007', projectId: 'UCM-W26PUN', canopyType: 'Biodiversity Corridor', species: 'Jamun + Karanj + Arjun', city: 'Pune', treesPlanted: 150000, canopyCoverSqKm: 12.8, carbonSequestrationTonsPerYear: 9500, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'BAIF Pune', destination: 'PMC Vetal Hill Depot', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: '1.5 lakh biodiversity corridor trees along 85 km hill &amp; river &#8212; Jamun-Karanj-Arjun native species creating 12.8 sq km wildlife corridor canopy with 9,500 tCO2/yr' },
  { id: 'UCM-0008', projectId: 'UCM-A26JPR', canopyType: 'Heritage Street Canopy', species: 'Ashoka + Kachnar + Maulsari', city: 'Jaipur', treesPlanted: 75000, canopyCoverSqKm: 6.5, carbonSequestrationTonsPerYear: 4200, investmentCr: 85, status: 'In Transit', priority: 'High', origin: 'AFRI Jodhpur', destination: 'JMC Nahargarh Nursery', shipDate: '2026-07-27', transitDays: 1, zone: 'North', remarks: '75,000 heritage street trees along Pink City heritage walks &#8212; Ashoka-Kachnar-Maulsari flowering species creating 6.5 sq km canopy for microclimate cooling in Jaipur&apos;s tourist zones' },
  { id: 'UCM-0009', projectId: 'UCM-H26AHM', canopyType: 'Industrial Green Belt', species: 'Azadirachta + Dalbergia + Tectona', city: 'Ahmedabad', treesPlanted: 110000, canopyCoverSqKm: 9.0, carbonSequestrationTonsPerYear: 6500, investmentCr: 120, status: 'Delayed', priority: 'Medium', origin: 'GEB Gandhinagar', destination: 'AMC Naroda Green Belt', shipDate: '2026-07-18', transitDays: 1, zone: 'West', remarks: '1.1 lakh industrial green belt trees around Naroda-Vatva-Odhav &#8212; Azadirachta-Dalbergia-Tectona pollution-tolerant species creating 9 sq km buffer absorbing VOC + PM2.5 from 350 factories' },
  { id: 'UCM-0010', projectId: 'UCM-I26LUD', canopyType: 'Rural-Urban Fringe Canopy', species: 'Shisham + Kadam + Siris', city: 'Ludhiana', treesPlanted: 85000, canopyCoverSqKm: 7.2, carbonSequestrationTonsPerYear: 4800, investmentCr: 68, status: 'Processing', priority: 'Medium', origin: 'PAU Ludhiana', destination: 'MC Ludhiana Focal Point', shipDate: '2026-08-01', transitDays: 1, zone: 'North', remarks: '85,000 fringe zone trees along Buddha Nullah &#8212; Shisham-Kadam-Siris riparian species creating 7.2 sq km bioremediation canopy treating industrial effluent while sequestering 4,800 tCO2/yr' },
  { id: 'UCM-0011', projectId: 'UCM-S26SUR', canopyType: 'Mangrove Urban Mix', species: 'Sonneratia + Avicennia + Bruguiera', city: 'Surat', treesPlanted: 200000, canopyCoverSqKm: 15.0, carbonSequestrationTonsPerYear: 18000, investmentCr: 245, status: 'Delivered', priority: 'High', origin: 'Gujarat Ecological Society', destination: 'SMC Dumas Mangrove Nursery', shipDate: '2026-07-05', transitDays: 1, zone: 'West', remarks: '2 lakh mangrove-urban mix trees along Tapi estuary &#8212; 15 sq km coastal + urban canopy combining blue &amp; green carbon sink with 18,000 tCO2/yr sequestration for diamond city Surat' },
  { id: 'UCM-0012', projectId: 'UCM-F26BNG', canopyType: 'Coastal Shelter Belt', species: 'Casuarina + Pandanus + Spinifex', city: 'Bhubaneswar', treesPlanted: 160000, canopyCoverSqKm: 10.5, carbonSequestrationTonsPerYear: 8200, investmentCr: 130, status: 'In Transit', priority: 'Critical', origin: 'CIFA Bhubaneswar', destination: 'BMC Puri Coastal Depot', shipDate: '2026-07-24', transitDays: 1, zone: 'East', remarks: '1.6 lakh coastal shelter belt trees along Puri-Konark coast &#8212; Casuarina-Pandanus-Spinifex species creating 10.5 sq km bio-shield against cyclone storm surge + 8,200 tCO2/yr' },
  { id: 'UCM-0013', projectId: 'UCM-G26IND', canopyType: 'Smart Sensor-Enabled Canopy', species: 'Nyctanthes + Millingtonia + Bauhinia', city: 'Indore', treesPlanted: 65000, canopyCoverSqKm: 5.5, carbonSequestrationTonsPerYear: 3500, investmentCr: 92, status: 'Delivered', priority: 'Medium', origin: 'IFE Jaipur', destination: 'IMC Lal Bagh Nursery', shipDate: '2026-07-14', transitDays: 2, zone: 'West', remarks: '65,000 IoT-sensor-enabled flowering trees across Smart City Indore &#8212; Nyctanthes-Millingtonia-Bauhinia creating 5.5 sq km monitored canopy with real-time tree health &amp; transpiration sensors' },
  { id: 'UCM-0014', projectId: 'UCM-V26KOZ', canopyType: 'Hill Slope Afforestation', species: 'Oak + Chestnut + Magnolia', city: 'Kochi', treesPlanted: 50000, canopyCoverSqKm: 8.0, carbonSequestrationTonsPerYear: 5500, investmentCr: 72, status: 'In Transit', priority: 'High', origin: 'KFRI Thrissur', destination: 'Kochi Corporation Vypin', shipDate: '2026-07-29', transitDays: 1, zone: 'South', remarks: '50,000 hill-slope trees across Western Ghats fringe villages &#8212; Oak-Chestnut-Magnolia creating 8 sq km slope-stabilizing canopy sequestering 5,500 tCO2/yr while preventing 200+ landslide events' },
];

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#047857', '#065f46', '#064e3b', '#047857'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 6 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 2 }, { value: 'Delayed', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 2 }, { value: 'High', count: 6 }, { value: 'Medium', count: 5 },
  ]},
  { label: 'Canopy Type', key: 'canopyType', options: [
    { value: 'Avenue Plantation', count: 1 }, { value: 'Urban Forest Blocks', count: 1 }, { value: 'Mangrove Buffer', count: 1 }, { value: 'Temple Garden Canopy', count: 1 }, { value: 'Lake Foreshore Buffer', count: 1 }, { value: 'Rooftop Urban Forest', count: 1 }, { value: 'Biodiversity Corridor', count: 1 }, { value: 'Heritage Street Canopy', count: 1 }, { value: 'Industrial Green Belt', count: 1 }, { value: 'Rural-Urban Fringe Canopy', count: 1 }, { value: 'Mangrove Urban Mix', count: 1 }, { value: 'Coastal Shelter Belt', count: 1 }, { value: 'Smart Sensor-Enabled Canopy', count: 1 }, { value: 'Hill Slope Afforestation', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 3 }, { value: 'South', count: 4 }, { value: 'West', count: 4 }, { value: 'East', count: 3 },
  ]},
];

export default function UrbanCanopyMicroclimateLogisticsView() {
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
    return records.filter((r: UCMRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.city.toLowerCase().includes(searchQuery.toLowerCase()) || r.canopyType.toLowerCase().includes(searchQuery.toLowerCase()) || r.species.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof UCMRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalTrees = records.reduce((s, r) => s + r.treesPlanted, 0);
  const totalCanopy = records.reduce((s, r) => s + r.canopyCoverSqKm, 0);
  const totalCarbon = records.reduce((s, r) => s + r.carbonSequestrationTonsPerYear, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);

  const kpiData = [
    { label: 'Total Trees Planted', value: `${(totalTrees / 1000).toFixed(0)}K`, sub: '14 Urban Canopy Projects' },
    { label: 'Total Canopy Cover', value: `${totalCanopy.toFixed(0)} sq km`, sub: 'Across 14 Indian Cities' },
    { label: 'Carbon Sink', value: `${(totalCarbon / 1000).toFixed(0)}K tCO2/yr`, sub: 'Annual Sequestration' },
    { label: 'Total Investment', value: `&#8377;${totalInv}Cr`, sub: `&#8377;${(totalInv / totalTrees * 1000).toFixed(0)}/tree avg` },
  ];

  const cityTrees = useMemo(() => records.map(r => ({ city: r.city, trees: r.treesPlanted, carbon: r.carbonSequestrationTonsPerYear })).sort((a, b) => b.trees - a.trees), []);
  const canopyByType = useMemo(() => records.map(r => ({ type: r.canopyType.split(' ')[0], sqKm: r.canopyCoverSqKm })), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const carbonTrend = useMemo(() => records.map(r => ({ city: r.city, seq: r.carbonSequestrationTonsPerYear / 1000, inv: r.investmentCr })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 ucm-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Urban Canopy Microclimate' }]} />
      <PageHeader title="Urban Canopy Microclimate Logistics" description="Urban forestry &amp; green canopy management for Indian city microclimate regulation and carbon sequestration" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#059669] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="ucm-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#059669]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: kpi.sub }} /></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="ucm-chart-card"><CardHeader><CardTitle className="text-base">Trees Planted by City</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cityTrees}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Bar dataKey="trees" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="ucm-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#059669" /><Cell fill="#10b981" /><Cell fill="#34d399" /><Cell fill="#047857" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'ucm-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Canopy Project Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#059669] bg-emerald-50/20'}`}>
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
          <Card className="ucm-chart-card"><CardHeader><CardTitle className="text-base">Canopy Cover by Type (sq km)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={canopyByType} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="type" tick={{ fontSize: 9 }} width={100} /><Tooltip /><Bar dataKey="sqKm" fill="#10b981" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ucm-chart-card"><CardHeader><CardTitle className="text-base">Carbon Sequestration vs Investment</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={carbonTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="seq" stroke="#059669" strokeWidth={2} name="Seq (K tCO2/yr)" /><Line yAxisId="right" type="monotone" dataKey="inv" stroke="#047857" strokeWidth={2} name="Invest (&#8377;Cr)" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="ucm-chart-card"><CardHeader><CardTitle className="text-base">Trees Per Lakh Investment</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ city: r.city, treesPerCr: Math.round(r.treesPlanted / r.investmentCr * 100) }))}><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="treesPerCr" fill="#34d399" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ucm-chart-card"><CardHeader><CardTitle className="text-base">Species Diversity Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'Mangrove', value: 3 }, { name: 'Native Tropical', value: 4 }, { name: 'Avenue', value: 2 }, { name: 'Heritage', value: 1 }, { name: 'Industrial', value: 2 }, { name: 'Hill Slope', value: 1 }, { name: 'Rooftop Food', value: 1 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#059669" /><Cell fill="#10b981" /><Cell fill="#34d399" /><Cell fill="#6ee7b7" /><Cell fill="#047857" /><Cell fill="#065f46" /><Cell fill="#064e3b" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="ucm-insight-card"><CardHeader><CardTitle className="text-base">Mangrove Carbon Kings</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Mumbai mangrove buffer (UCM-0003) and Surat mangrove-urban mix (UCM-0011) together sequester 46,000 tCO2/yr from 5.5 lakh trees &#8212; representing India&apos;s highest urban blue carbon investment at &#8377;565Cr. Blue carbon sequestration rate is 2.3x higher per tree than terrestrial canopy.</p></CardContent></Card>
          <Card className="ucm-insight-card"><CardHeader><CardTitle className="text-base">Smart Sensor-Enabled Trees</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Indore&apos;s IoT-enabled canopy (UCM-0013) represents a pioneering approach &#8212; real-time tree health monitoring with transpiration sensors, soil moisture probes, and growth cameras. This data-driven urban forestry model can reduce tree mortality from 20% to under 5%, saving &#8377;15-20Cr per city in replacement costs.</p></CardContent></Card>
          <Card className="ucm-insight-card"><CardHeader><CardTitle className="text-base">Industrial Green Belt Impact</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Ahmedabad&apos;s industrial green belt (UCM-0009) around Naroda-Vatva uses pollution-tolerant Azadirachta-Dalbergia-Tectona species that absorb VOC and PM2.5 directly from 350 factories. Combined with Ludhiana&apos;s Buddha Nullah riparian buffer (UCM-0010), these projects demonstrate phytoremediation at scale for industrial cities.</p></CardContent></Card>
          <Card className="ucm-insight-card"><CardHeader><CardTitle className="text-base">Heritage + Canopy Synergy</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Chennai temple garden canopy (UCM-0004) using native Tamil species (Pungan-Arasu-Vembu) and Jaipur heritage street canopy (UCM-0008) with flowering Ashoka-Kachnar-Maulsari show how urban forestry can enhance cultural heritage tourism while providing microclimate benefits. ROI includes 40% increase in footfall to heritage zones.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
