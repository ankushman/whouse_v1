'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface HYPRecord {
  id: string;
  projectId: string;
  corridor: string;
  station: string;
  operator: string;
  technology: string;
  routeLengthKm: number;
  maxSpeedKmph: number;
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

const records: HYPRecord[] = [
  { id: 'HYP-0001', projectId: 'HYP-D26MUMDL1', corridor: 'Mumbai-Delhi', station: 'Hyperloop Terminal Maharashtra', operator: 'Virgin Hyperloop India', technology: 'Maglev Vacuum Tube 1200km/h', routeLengthKm: 1250, maxSpeedKmph: 1200, investmentCr: 85000, status: 'In Transit', priority: 'Critical', origin: 'Virgin Hyperloop HQ London', destination: 'Mumbai Terminal Construction Site', shipDate: '2026-07-28', transitDays: 3, zone: 'West', remarks: 'Virgin Hyperloop Mumbai-Delhi &#8594; India&apos;s flagship hyperloop corridor connecting financial capital to political capital in 55 minutes vs 12 hours by rail. &#8377;85,000Cr investment for 1,250 km route with 10 stations. Maglev vacuum tube technology at 1,200 km/h cruise speed &#8594; pressure maintained at 100 Pa (1/1000th atmosphere). Corridor carries 150 million passengers/yr plus 8 million tonnes freight. Mumbai-Gurgaon section (Phase 1) operational by 2030 at &#8377;25,000Cr &#8594; Phase 2 Delhi-Lucknow extension approved. Conceived as public-private partnership with Indian Railways and Maharashtra/Delhi/Gujarat/Rajasthan state governments' },
  { id: 'HYP-0002', projectId: 'HYP-B26BLRCHN1', corridor: 'Bengaluru-Chennai', station: 'Electronic City Terminal', operator: 'Hyperloop TT India', technology: 'Maglev Passive Levitation 1100km/h', routeLengthKm: 350, maxSpeedKmph: 1100, investmentCr: 22000, status: 'Delivered', priority: 'Critical', origin: 'HTT Engineering Dubai', destination: 'Electronic City Bengaluru', shipDate: '2026-07-10', transitDays: 3, zone: 'South', remarks: 'Hyperloop TT Bengaluru-Chennai &#8594; India&apos;s second hyperloop corridor linking IT capital Bengaluru to port city Chennai in 20 minutes vs 5 hours by road. &#8377;22,000Cr for 350 km with 5 stations: Electronic City, Krishnagiri, Vellore, Kanchipuram, Chennai Port. Passive magnetic levitation requires no power for hover &#8594; 30% energy savings vs active maglev. Bengaluru-Chennai corridor carries 45 million passengers/yr including IT workforce commuting between cities. Phase 1 Bengaluru-Krishnagiri (120 km) operational 2029 &#8594; proving commercial viability for Indian highway median deployment' },
  { id: 'HYP-0003', projectId: 'HYP-D26DELKOL1', corridor: 'Delhi-Kolkata', station: 'Rajiv Chowk Terminal Delhi', operator: 'DP World Hyperloop', technology: 'Maglev Vacuum Tube 1000km/h', routeLengthKm: 1300, maxSpeedKmph: 1000, investmentCr: 72000, status: 'Processing', priority: 'High', origin: 'DP World Logistics HQ Dubai', destination: 'New Delhi Central Terminal', shipDate: '2026-08-01', transitDays: 3, zone: 'North', remarks: 'DP World Hyperloop Delhi-Kolkata &#8594; India&apos;s freight-focused hyperloop corridor connecting NCR to Eastern India in 65 minutes vs 18 hours rail freight. &#8377;72,000Cr for 1,300 km with 8 stations and 3 logistics hubs. Primarily cargo route &#8594; 25 million tonnes/yr freight capacity carrying containers, e-commerce parcels and perishable goods. Delhi-Kolkata carries 40% of India&apos;s east-west freight &#8594; hyperloop reduces logistics cost by 60% at &#8377;1.2/tonne-km vs &#8377;3.0 by rail. DP World leverages Kolkata and Haldia port connectivity &#8594; enabling same-day import delivery to Delhi from Singapore via Chennai port transfer' },
  { id: 'HYP-0004', projectId: 'HYP-H26HYDVIZ1', corridor: 'Hyderabad-Visakhapatnam', station: 'HITEC City Terminal', operator: 'Zeleros Hyperloop', technology: 'Electromagnetic Propulsion 900km/h', routeLengthKm: 620, maxSpeedKmph: 900, investmentCr: 38000, status: 'Delivered', priority: 'High', origin: 'Zeleros Engineering Valencia', destination: 'HITEC City Hyderabad', shipDate: '2026-07-08', transitDays: 3, zone: 'South', remarks: 'Zeleros Hyderabad-Visakhapatnam &#8594; India&apos;s first public-private hyperloop connecting Hyderabad tech hub to Vizag port city in 42 minutes vs 10 hours by rail. &#8377;38,000Cr for 620 km with 6 stations. Electromagnetic propulsion system uses linear induction motors &#8594; simpler than maglev with lower CAPEX. Hyderabad-Vizag corridor serves 28 million passengers/yr including IT professionals commuting to Vizag Special Economic Zone. Vizag port connectivity enables hyperloop freight for Pharma City exports &#8594; temperature-controlled vaccine transport in 42 minutes vs 24-hour cold chain' },
  { id: 'HYP-0005', projectId: 'HYP-A26AHDPUN1', corridor: 'Ahmedabad-Pune', station: 'SG Highway Terminal Ahmedabad', operator: 'Hardt Hyperloop India', technology: 'Superconducting Maglev 1000km/h', routeLengthKm: 620, maxSpeedKmph: 1000, investmentCr: 35000, status: 'In Transit', priority: 'High', origin: 'Hardt Hyperloop Amsterdam', destination: 'SG Highway Terminal Ahmedabad', shipDate: '2026-07-26', transitDays: 3, zone: 'West', remarks: 'Hardt Hyperloop Ahmedabad-Pune &#8594; India&apos;s industrial corridor hyperloop linking Gujarat&apos;s manufacturing hub to Pune&apos;s auto and IT cluster in 38 minutes. &#8377;35,000Cr for 620 km with 6 stations via Vadodara, Surat, Nashik. Superconducting maglev uses liquid nitrogen cooling at -196&#176;C &#8594; zero electrical resistance enabling 1,000 km/h cruise. Ahmedabad-Pune carries 35 million passengers/yr including auto industry executives commuting between Tata Motors Pune and Gujarat&apos;s Sanand plant. Corridor doubles as freight line for auto components &#8594; 15 million tonnes/yr reducing logistics cost by 55%' },
  { id: 'HYP-0006', projectId: 'HYP-C26CHNTRV1', corridor: 'Chennai-Thiruvananthapuram', station: 'Guindy Terminal Chennai', operator: 'TransPod India', technology: 'FluxJet Electromagnetic 1000km/h', routeLengthKm: 700, maxSpeedKmph: 1000, investmentCr: 42000, status: 'Delivered', priority: 'High', origin: 'TransPod Engineering Toronto', destination: 'Chennai Guindy Terminal', shipDate: '2026-07-14', transitDays: 3, zone: 'South', remarks: 'TransPod Chennai-Thiruvananthapuram &#8594; India&apos;s East Coast hyperloop connecting Tamil Nadu capital to Kerala capital in 42 minutes vs 14 hours by rail. &#8377;42,000Cr for 700 km with 7 stations: Chennai, Pondicherry, Cuddalore, Nagapattinam, Madurai, Kochi, Trivandrum. FluxJet electromagnetic propulsion uses contactless power transfer &#8594; no overhead wires needed. Corridor unlocks tourism: Pondicherry beaches, Madurai temple, Kerala backwaters all within 15 minutes of each hyperloop station. Chennai-TRV corridor carries 22 million passengers/yr &#8594; hyperloop tourism premium at &#8377;5,000 vs &#8377;1,800 first-class rail' },
  { id: 'HYP-0007', projectId: 'HYP-K26KOLBBS1', corridor: 'Kolkata-Bhubaneswar', station: 'Salt Lake Terminal Kolkata', operator: 'Virgin Hyperloop India', technology: 'Maglev Vacuum Tube 1100km/h', routeLengthKm: 440, maxSpeedKmph: 1100, investmentCr: 28000, status: 'In Transit', priority: 'Medium', origin: 'Virgin Hyperloop Kolkata Office', destination: 'Salt Lake Terminal', shipDate: '2026-07-25', transitDays: 2, zone: 'East', remarks: 'Virgin Hyperloop Kolkata-Bhubaneswar &#8594; East India&apos;s first hyperloop linking Kolkata to Odisha capital in 24 minutes vs 8 hours by rail. &#8377;28,000Cr for 440 km with 4 stations: Kolkata, Kharagpur, Cuttack, Bhubaneswar. Kharagpur station serves IIT Kharagpur&apos;s hyperloop research centre &#8594; India&apos;s premier hyperloop engineering program. Bhubaneswar station connects to upcoming Vedanta semiconductor fab and Paradip port &#8594; enabling same-day chip-to-device logistics. Kolkata-BBSR corridor carries 18 million passengers/yr and 8 million tonnes freight including steel, coal and minerals from Odisha mines' },
  { id: 'HYP-0008', projectId: 'HYP-J26JPRUDR1', corridor: 'Jaipur-Udaipur', station: 'Mansarovar Terminal Jaipur', operator: 'Hyperloop TT India', technology: 'Maglev Passive Levitation 800km/h', routeLengthKm: 390, maxSpeedKmph: 800, investmentCr: 15000, status: 'Delivered', priority: 'Medium', origin: 'HTT Jaipur Office', destination: 'Mansarovar Terminal', shipDate: '2026-07-12', transitDays: 2, zone: 'North', remarks: 'Hyperloop TT Jaipur-Udaipur &#8594; Rajasthan&apos;s tourism hyperloop connecting state capital to Lake City in 30 minutes vs 7 hours by road. &#8377;15,000Cr for 390 km with 4 stations: Jaipur, Ajmer, Chittorgarh, Udaipur. Tourism-focused corridor &#8594; carrying 12 million passengers/yr including domestic and international tourists visiting Rajasthan&apos;s heritage circuit. Hyperloop enables same-day return from Jaipur to Udaipur &#8594; transforming tourism economics with &#8377;3,500 ticket vs &#8377;2,500 Shatabdi. Ajmer station connects to Ajmer Sharif dargah pilgrim route &#8594; hyperloop carries 5 million pilgrims/yr during Urs festival' },
  { id: 'HYP-0009', projectId: 'HYP-L26LKOWAR1', corridor: 'Lucknow-Varanasi', station: 'Gomti Nagar Terminal Lucknow', operator: 'Zeleros Hyperloop', technology: 'Electromagnetic Propulsion 900km/h', routeLengthKm: 320, maxSpeedKmph: 900, investmentCr: 14000, status: 'Delivered', priority: 'Medium', origin: 'Zeleros Lucknow Office', destination: 'Gomti Nagar Terminal', shipDate: '2026-07-08', transitDays: 2, zone: 'North', remarks: 'Zeleros Hyperloop Lucknow-Varanasi &#8594; UP&apos;s cultural corridor hyperloop connecting state capital to spiritual capital in 22 minutes vs 6 hours by rail. &#8377;14,000Cr for 320 km with 4 stations: Lucknow, Ayodhya, Raebareli, Varanasi. Ayodhya station enables same-day Delhi-Ayodhya pilgrimage via Delhi-Lucknow hyperloop connection &#8594; 50 million pilgrims/yr. Varanasi station connects to IoT-enabled smart logistics for Banarasi silk and handicrafts &#8594; delivering orders across India within hours. UP&apos;s 240 million population creates massive demand &#8594; Lucknow-Varanasi corridor carries 30 million passengers/yr' },
  { id: 'HYP-0010', projectId: 'HYP-G26GOAOMB1', corridor: 'Goa-Mumbai', station: 'Panaji Terminal Goa', operator: 'DP World Hyperloop', technology: 'Maglev Vacuum Tube 1000km/h', routeLengthKm: 560, maxSpeedKmph: 1000, investmentCr: 30000, status: 'Processing', priority: 'Medium', origin: 'DP World Mumbai Office', destination: 'Panaji Terminal Goa', shipDate: '2026-08-02', transitDays: 2, zone: 'West', remarks: 'DP World Hyperloop Goa-Mumbai &#8594; India&apos;s tourism and cargo corridor connecting Mumbai to Goa in 28 minutes vs 10 hours by road. &#8377;30,000Cr for 560 km with 4 stations: Mumbai, Chiplun, Ratnagiri, Panaji. Dual-purpose corridor: passenger tourism (15 million/yr) and freight (port cargo from Mormugao to JNPT). Mumbai-Goa highway carries 60,000 vehicles/day &#8594; hyperloop reduces road congestion by 30% and highway accidents by 40%. Panaji station integrates with Goa International Airport and cruise terminal &#8594; seamless fly-cruise-hyperloop tourism chain. Goa&apos;s 8 million tourist influx finds rapid transit relief with 28-minute Mumbai connection' },
  { id: 'HYP-0011', projectId: 'HYP-N26NAGJBP1', corridor: 'Nagpur-Jabalpur', station: 'MIHAN Terminal Nagpur', operator: 'Hardt Hyperloop India', technology: 'Superconducting Maglev 800km/h', routeLengthKm: 340, maxSpeedKmph: 800, investmentCr: 12000, status: 'Delivered', priority: 'Medium', origin: 'Hardt Nagpur Site Office', destination: 'MIHAN Terminal', shipDate: '2026-07-12', transitDays: 2, zone: 'East', remarks: 'Hardt Hyperloop Nagpur-Jabalpur &#8594; Central India&apos;s freight hyperloop connecting MIHAN multi-modal hub to Jabalpur industrial zone in 26 minutes vs 8 hours by rail. &#8377;12,000Cr for 340 km with 4 stations: Nagpur, Seoni, Mandla, Jabalpur. Primarily cargo route &#8594; carrying 12 million tonnes/yr of steel, cement, timber and agricultural produce. MIHAN (Multi-modal International Cargo Hub) integrates with Nagpur airport &#8594; hyperloop enables 2-hour cargo delivery from Mumbai port to central India. Jabalpur station connects to Ordnance Factory and defense manufacturing cluster &#8594; rapid logistics for defense equipment' },
  { id: 'HYP-0012', projectId: 'HYP-I26INDMYS1', corridor: 'Indore-Mysuru', station: 'Vijay Nagar Terminal Indore', operator: 'TransPod India', technology: 'FluxJet Electromagnetic 900km/h', routeLengthKm: 1400, maxSpeedKmph: 900, investmentCr: 65000, status: 'In Transit', priority: 'High', origin: 'TransPod Bengaluru Hub', destination: 'Vijay Nagar Terminal Indore', shipDate: '2026-07-24', transitDays: 3, zone: 'South', remarks: 'TransPod Indore-Mysuru &#8594; India&apos;s longest north-south hyperloop connecting central India to deep south in 95 minutes vs 30 hours by rail. &#8377;65,000Cr for 1,400 km with 12 stations via Hyderabad, Bengaluru. TransPod&apos;s FluxJet technology tested at Toronto test facility &#8594; first commercial deployment in India. Indore-Mysuru corridor serves India&apos;s pharma corridor (Hyderabad), IT corridor (Bengaluru) and auto corridor (Mysuru-Chennai). Freight capacity 18 million tonnes/yr carrying pharmaceuticals, electronics, auto parts and agricultural produce. Indore&apos;s clean city status aligns with hyperloop&apos;s zero-emission vision &#8594; fully powered by 500 MW solar along route' },
  { id: 'HYP-0013', projectId: 'HYP-S26SRLPNQ1', corridor: 'Sri City-Pune', station: 'Sri City Terminal Andhra', operator: 'Zeleros Hyperloop', technology: 'Electromagnetic Propulsion 1000km/h', routeLengthKm: 820, maxSpeedKmph: 1000, investmentCr: 48000, status: 'Delivered', priority: 'Medium', origin: 'Zeleros Sri City Site', destination: 'Sri City AP Terminal', shipDate: '2026-07-08', transitDays: 3, zone: 'South', remarks: 'Zeleros Hyperloop Sri City-Pune &#8594; India&apos;s manufacturing logistics corridor connecting AP&apos;s Sri City SEZ to Pune&apos;s auto cluster in 50 minutes vs 18 hours truck transport. &#8377;48,000Cr for 820 km with 7 stations via Hyderabad, Solapur. Primarily freight route &#8594; 20 million tonnes/yr carrying auto components, electronics, textiles and FMCG. Sri City hosts Kia Motors, Foxconn, Colgate-Palmolive factories &#8594; hyperloop reduces just-in-time inventory cost by 70%. Pune station connects to Tata Motors, Bajaj, Mahindra and Mercedes-Benz plants &#8594; enabling hyper-synchronized manufacturing between AP and Pune auto ecosystems' },
  { id: 'HYP-0014', projectId: 'HYP-G26GJRGIR1', corridor: 'Gandhinagar-Gir', station: 'GIFT City Terminal', operator: 'Hyperloop TT India', technology: 'Maglev Passive Levitation 700km/h', routeLengthKm: 320, maxSpeedKmph: 700, investmentCr: 11000, status: 'Delivered', priority: 'Low', origin: 'HTT Gandhinagar Office', destination: 'GIFT City Terminal', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: 'Hyperloop TT Gandhinagar-Gir &#8594; Gujarat&apos;s eco-tourism hyperloop connecting GIFT City to Gir National Park in 25 minutes vs 6 hours by road. &#8377;11,000Cr for 320 km with 4 stations: Gandhinagar, Rajkot, Junagadh, Gir. Tourism and conservation corridor &#8594; carrying 8 million passengers/yr including wildlife tourists visiting Asiatic lions. Lower speed (700 km/h) optimized for wildlife safety &#8594; elevated tube avoids forest fragmentation and animal corridors. Rajkot station connects to Saurashtra industrial belt &#8594; dual-purpose tourism and freight for Rajkot&apos;s engineering goods. Gujarat&apos;s 12th hyperloop route leverages state&apos;s existing highway median for tube installation at 40% lower cost' },
];

const COLORS = ['#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#7e22ce', '#6b21a8', '#581c87', '#3b0764'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 4 }, { value: 'Delivered', count: 7 }, { value: 'Processing', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 2 }, { value: 'High', count: 5 }, { value: 'Medium', count: 6 }, { value: 'Low', count: 1 },
  ]},
  { label: 'Technology', key: 'technology', options: [
    { value: 'Maglev Vacuum Tube 1200km/h', count: 1 }, { value: 'Maglev Passive Levitation 1100km/h', count: 1 }, { value: 'Maglev Vacuum Tube 1000km/h', count: 1 }, { value: 'Electromagnetic Propulsion 900km/h', count: 2 }, { value: 'Superconducting Maglev 1000km/h', count: 1 }, { value: 'FluxJet Electromagnetic 1000km/h', count: 2 }, { value: 'Maglev Vacuum Tube 1100km/h', count: 1 }, { value: 'Maglev Passive Levitation 800km/h', count: 1 }, { value: 'Superconducting Maglev 800km/h', count: 1 }, { value: 'Maglev Passive Levitation 700km/h', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 5 }, { value: 'West', count: 4 }, { value: 'North', count: 3 }, { value: 'East', count: 3 },
  ]},
];

export default function HyperloopLogisticsView() {
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
    return records.filter((r: HYPRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.corridor.toLowerCase().includes(searchQuery.toLowerCase()) || r.station.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof HYPRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalRouteKm = records.reduce((s, r) => s + r.routeLengthKm, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const avgSpeed = Math.round(records.reduce((s, r) => s + r.maxSpeedKmph, 0) / records.length);
  const avgCostKm = Math.round(totalInv / totalRouteKm);

  const kpiData = [
    { label: 'Total Network Length', value: `${(totalRouteKm / 1000).toFixed(1)}K km`, sub: 'Hyperloop Corridors' },
    { label: 'Avg Cruise Speed', value: `${avgSpeed} km/h`, sub: 'Vacuum Tube Maglev' },
    { label: 'Stations Network', value: '76 Stations', sub: 'Across 14 Corridors' },
    { label: 'Total Investment', value: `&#8377;${(totalInv / 1000).toFixed(0)}K Cr`, sub: `&#8377;${avgCostKm}Cr/km avg cost` },
  ];

  const corridorData = useMemo(() => records.map(r => ({ corridor: r.corridor, km: r.routeLengthKm, speed: r.maxSpeedKmph })).sort((a, b) => b.km - a.km), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const kmVsSpeed = useMemo(() => records.map(r => ({ corridor: r.corridor, km: r.routeLengthKm, speed: r.maxSpeedKmph })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 hyp-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Hyperloop' }]} />
      <PageHeader title="Hyperloop Logistics" description="Next-generation vacuum tube maglev transportation network across India connecting major cities at 700-1200 km/h with passenger and freight hyperloop corridors spanning 10,000 km" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#9333ea] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="hyp-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#9333ea]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="hyp-chart-card"><CardHeader><CardTitle className="text-base">Corridor Length (km)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={corridorData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="corridor" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="km" fill="#9333ea" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="hyp-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#9333ea" /><Cell fill="#a855f7" /><Cell fill="#c084fc" /><Cell fill="#7e22ce" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'hyp-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Hyperloop Corridor Registry' : 'Recent Deployments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#9333ea] bg-purple-50/20'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.corridor} &#8594; {r.routeLengthKm} km | {r.maxSpeedKmph} km/h | &#8377;${(r.investmentCr).toLocaleString()}Cr</span>
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
          <Card className="hyp-chart-card"><CardHeader><CardTitle className="text-base">Route Length vs Max Speed</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={kmVsSpeed}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="corridor" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="km" stroke="#9333ea" strokeWidth={2} name="Route (km)" /><Line yAxisId="right" type="monotone" dataKey="speed" stroke="#7e22ce" strokeWidth={2} name="Speed (km/h)" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="hyp-chart-card"><CardHeader><CardTitle className="text-base">Investment per Corridor (&#8377;K Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ corridor: r.corridor, inv: +(r.investmentCr / 1000).toFixed(0) }))}><XAxis dataKey="corridor" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="inv" fill="#a855f7" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="hyp-chart-card"><CardHeader><CardTitle className="text-base">Total Investment by Zone (&#8377;K Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.zone] = (m[r.zone] || 0) + r.investmentCr; return m; }, {})).map(([k, v]) => ({ zone: k, inv: +(v / 1000).toFixed(0) }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="inv" fill="#7e22ce" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="hyp-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 4 }, { name: 'Delivered', value: 7 }, { name: 'Processing', value: 2 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#9333ea" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hyp-insight-card"><CardHeader><CardTitle className="text-base">Mumbai-Delhi: India&apos;s Flagship Hyperloop</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Virgin Hyperloop Mumbai-Delhi (HYP-0001) at &#8377;85,000Cr is India&apos;s largest infrastructure project &#8594; 1,250 km corridor in 55 minutes vs 12 hours rail. Carrying 150 million passengers/yr plus 8 million tonnes freight, it transforms India&apos;s busiest transport corridor. Phase 1 Mumbai-Gurgaon (&#8377;25,000Cr) targets 2030 opening &#8594; proving financial viability before full corridor completion in 2034. Tube installed along NH-8 median &#8594; land acquisition cost near zero vs &#8377;5,000Cr/km for conventional HSR. Mumbai-Delhi hyperloop at &#8377;68Cr/km is 60% cheaper than bullet train at &#8377;170Cr/km while being 5x faster.</p></CardContent></Card>
          <Card className="hyp-insight-card"><CardHeader><CardTitle className="text-base">5 Technology Platforms Competing</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">India&apos;s hyperloop portfolio features 5 competing technology platforms &#8594; Virgin (maglev vacuum tube), Hyperloop TT (passive levitation), Zeleros (electromagnetic propulsion), Hardt (superconducting maglev) and TransPod (FluxJet electromagnetic). Each has distinct advantages: Virgin&apos;s proven scale, HTT&apos;s passive levitation energy savings (30%), Zeleros&apos; simpler linear motors, Hardt&apos;s superconducting efficiency, and TransPod&apos;s contactless power transfer. India&apos;s multi-vendor approach reduces technology lock-in risk &#8594; IITs and DRDO evaluate each platform independently. The competition drives costs down 25% vs single-vendor scenario &#8594; saving &#8377;1,00,000Cr across the network.</p></CardContent></Card>
          <Card className="hyp-insight-card"><CardHeader><CardTitle className="text-base">Hyperloop vs Bullet Train: India Chooses Both</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">India deploys both hyperloop and bullet train &#8594; Mumbai-Ahmedabad bullet train (&#8377;1.08 lakh Cr, 508 km, 320 km/h) and Mumbai-Delhi hyperloop (&#8377;85,000Cr, 1,250 km, 1,200 km/h) serve different markets. Bullet train targets premium intercity passenger travel at &#8377;5,000 fare &#8594; hyperloop serves time-critical freight and business travel at &#8377;3,500. Hyperloop&apos;s vacuum tube advantage: 5x speed, 60% lower CAPEX/km, 70% lower energy per passenger-km. India&apos;s 10,000 km hyperloop vision (&#8377;5,00,000Cr) complements 3,000 km bullet train network (&#8377;5,00,000Cr) &#8594; combined network covers 90% of India&apos;s trillion-dollar freight market.</p></CardContent></Card>
          <Card className="hyp-insight-card"><CardHeader><CardTitle className="text-base">India Hyperloop Target: 10,000 km by 2038</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Portfolio of 14 corridors at 9,690 km and &#8377;5,37,000Cr demonstrates India&apos;s commitment to hyperloop &#8594; world&apos;s largest planned network surpassing all other countries combined. India&apos;s population density (450/km&#178;) and intercity distances (200-1,400 km) are ideal for hyperloop economics. NITI Aayog estimates &#8377;12 lakh Cr annual economic benefit at full network: &#8377;4 lakh Cr time savings, &#8377;3 lakh Cr freight cost reduction, &#8377;2 lakh Cr accident reduction, &#8377;3 lakh Cr new city development along corridors. India&apos;s highway median (65,000 km national highways) provides ready-made hyperloop right-of-way &#8594; reducing land cost to 5% of total project cost vs 40% for conventional rail.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
