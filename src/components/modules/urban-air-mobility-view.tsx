'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface UAMRecord {
  id: string;
  projectId: string;
  city: string;
  vertiport: string;
  operator: string;
  aircraftType: string;
  seats: number;
  rangeKm: number;
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

const records: UAMRecord[] = [
  { id: 'UAM-0001', projectId: 'UAM-D26DL1', city: 'Delhi', vertiport: 'Connaught Place Vertiport Hub', operator: 'BLADE India', aircraftType: 'eVTOL Lilium Jet (7-seater)', seats: 7, rangeKm: 300, investmentCr: 350, status: 'In Transit', priority: 'Critical', origin: 'BLADE India HQ Mumbai', destination: 'Connaught Place Delhi', shipDate: '2026-07-28', transitDays: 2, zone: 'North', remarks: 'BLADE India Connaught Place &#8594; Delhi NCR&apos;s first urban air mobility vertiport at Connaught Place with 6 landing pads serving eVTOL air taxi routes. Lilium Jet 7-seater with 300 km range connects Delhi to Jaipur (240 km), Agra (200 km) and Chandigarh (260 km) in under 45 minutes. &#8377;350Cr investment includes vertiport terminal, charging infrastructure, ATC integration and passenger lounge. Delhi NCR&apos;s 3 crore daily commuters face 90-minute average commute &#8594; BLADE air taxi reduces Gurgaon to Connaught Place from 75 minutes to 8 minutes. BLADE&apos;s app-based booking at &#8377;3,000-5,000 per seat targets business executives and medical emergency transport' },
  { id: 'UAM-0002', projectId: 'UAM-M26MUM1', city: 'Mumbai', vertiport: 'BKC Vertiport Terminal', operator: 'Joby Aviation India', aircraftType: 'eVTOL Joby S4 (4-seater)', seats: 4, rangeKm: 240, investmentCr: 420, status: 'Delivered', priority: 'Critical', origin: 'Joby Aviation HQ Santa Cruz', destination: 'BKC Mumbai', shipDate: '2026-07-10', transitDays: 3, zone: 'West', remarks: 'Joby Aviation BKC &#8594; Mumbai&apos;s premium vertiport at Bandra-Kurla Complex with 8 pads serving South Mumbai, Navi Mumbai, Pune and Nashik routes. Joby S4 4-seater at 240 km range reduces Mumbai-Pune from 3.5 hours to 22 minutes &#8594; saving &#8377;15,000 per executive travel day. &#8377;420Cr investment includes rooftop vertiport on BKC Tower 2, battery swapping station, and marine vertiport at Gateway of India. Mumbai&apos;s 2.2 crore daily commuters create world&apos;s densest UAM demand &#8594; BKC-Downtown (12 min) replaces 90-minute road journey. Joby targets 500 daily flights from Mumbai by 2028 &#8594; connecting 8 vertiports across Mumbai Metropolitan Region' },
  { id: 'UAM-0003', projectId: 'UAM-B26BLR1', city: 'Bengaluru', vertiport: 'HAL Airport Vertiport', operator: 'InterGlobe Enterprises', aircraftType: 'eVTOL Archer Midnight (5-seater)', seats: 5, rangeKm: 240, investmentCr: 280, status: 'Processing', priority: 'High', origin: 'InterGlobe HQ Gurgaon', destination: 'HAL Airport Bengaluru', shipDate: '2026-08-01', transitDays: 2, zone: 'South', remarks: 'InterGlobe Enterprises Bengaluru &#8594; India&apos;s first eVTOL air taxi service on HAL Airport campus with 4 pads connecting to Electronic City, Whitefield, Mysuru and Chennai. Archer Midnight 5-seater at 240 km range &#8594; Bengaluru-Mysuru in 30 minutes vs 3.5 hours road. &#8377;280Cr investment leverages HAL Airport&apos;s underused GA area &#8594; vertiport integrated with airport terminal for seamless air-rail transfers. Bengaluru&apos;s 85 lakh daily commuters face India&apos;s worst traffic (average 71 seconds/km) &#8594; air taxi offers reliable 8-30 minute alternatives. InterGlobe (IndiGo parent) brings aviation expertise &#8594; targeting 200 daily flights across 6 Karnataka vertiports by 2028' },
  { id: 'UAM-0004', projectId: 'UAM-C26CHN1', city: 'Chennai', vertiport: 'Guindy Industrial Vertiport', operator: 'Eve Air Mobility India', aircraftType: 'eVTOL Eve Eve (4-seater)', seats: 4, rangeKm: 200, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'Eve Air Mobility Embraer Brazil', destination: 'Guindy Chennai', shipDate: '2026-07-08', transitDays: 3, zone: 'South', remarks: 'Eve Air Mobility Guindy &#8594; Chennai&apos;s industrial vertiport serving auto and IT corridor air taxi routes from Guindy to Sriperumbudur, Mahindra City and Pondicherry. Eve 4-seater at 200 km range &#8594; Chennai-Pondicherry in 25 minutes vs 3.5 hours ECR road. &#8377;195Cr investment includes 6 landing pads, passenger terminal and charging depot. Chennai&apos;s growing IT corridor (3 million tech workers) creates strong demand for Guindy-Siruseri (12 min) air taxi route. Eve&apos;s quiet operation (65 dB) enables vertiports near residential areas &#8594; Chennai&apos;s dense urban fabric benefits from rooftop vertiport placement on IT parks and hospitals' },
  { id: 'UAM-0005', projectId: 'UAM-H26HYD1', city: 'Hyderabad', vertiport: 'HITEC City Skyport', operator: 'Volaris Air Taxi', aircraftType: 'eVTOL Beta Alia (6-seater)', seats: 6, rangeKm: 460, investmentCr: 310, status: 'In Transit', priority: 'High', origin: 'Volaris Engineering Bengaluru', destination: 'HITEC City Hyderabad', shipDate: '2026-07-26', transitDays: 2, zone: 'South', remarks: 'Volaris Air Taxi HITEC City &#8594; Hyderabad&apos;s tech park vertiport with 6 pads serving routes to Gachibowli, Cyberabad, Warangal and Vijayawada. Beta Alia 6-seater at 460 km range &#8594; India&apos;s longest-range eVTOL connecting Hyderabad-Vijayawada in 55 minutes. &#8377;310Cr investment includes rooftop vertiport on L&amp;T Hyderabad and lakeside vertiport at Hussain Sagar. Hyderabad&apos;s 55 lakh tech workers in HITEC City-Gachibowli corridor face 45-minute commutes &#8594; air taxi reduces to 6 minutes. Telangana UAM policy 2026 designates 25 vertiport sites across Hyderabad Metro &#8594; Volaris wins 5-year exclusive for HITEC City and Gachibowli vertiports' },
  { id: 'UAM-0006', projectId: 'UAM-K26KOL1', city: 'Kolkata', vertiport: 'Salt Lake Vertiport Hub', operator: 'BLADE India', aircraftType: 'eVTOL Lilium Jet (7-seater)', seats: 7, rangeKm: 300, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'BLADE India Kolkata Hub', destination: 'Salt Lake Kolkata', shipDate: '2026-07-14', transitDays: 2, zone: 'East', remarks: 'BLADE India Salt Lake &#8594; Kolkata&apos;s IT hub vertiport connecting Salt Lake, New Town, Howrah and Siliguri routes. Lilium Jet 7-seater at 300 km range &#8594; Kolkata-Siliguri (460 km via intermediate stop at Burdwan) in 75 minutes vs 12 hours road. &#8377;165Cr investment includes vertiport on New Town Eco Park and Hooghly riverside vertiport. Kolkata&apos;s 20 lakh daily IT commuters in Salt Lake-New Town corridor create high demand &#8594; air taxi reduces New Town to Park Street from 60 minutes to 8 minutes. BLADE partners with West Bengal Transport Corp for airport shuttle &#8594; Dum Dum Airport to Park Street in 6 minutes replacing 90-minute taxi' },
  { id: 'UAM-0007', projectId: 'UAM-A26AHD1', city: 'Ahmedabad', vertiport: 'SG Highway Vertiport', operator: 'Joby Aviation India', aircraftType: 'eVTOL Joby S4 (4-seater)', seats: 4, rangeKm: 240, investmentCr: 175, status: 'Delivered', priority: 'Medium', origin: 'Joby Aviation Mumbai Hub', destination: 'SG Highway Ahmedabad', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: 'Joby Aviation SG Highway &#8594; Ahmedabad&apos;s highway corridor vertiport connecting to Gandhinagar, Surat, Vadodara and Udaipur. Joby S4 4-seater at 240 km range &#8594; Ahmedabad-Udaipur in 55 minutes vs 5 hours road via National Highway. &#8377;175Cr investment includes vertiport on SG Highway flyover and GIFT City rooftop vertiport. Ahmedabad-Gandhinagar (30 km, 6 min) serves Gujarat&apos;s government corridor &#8594; 50 daily VIP flights during assembly sessions. SG Highway&apos;s 2 lakh daily commuters benefit from vertiport access &#8594; reducing 75-minute commute to 8 minutes. Joby targets Gujarat network of 8 vertiports by 2028 &#8594; connecting Ahmedabad, Gandhinagar, Surat, Vadodara, Rajkot, Jamnagar, Bhuj and Udaipur' },
  { id: 'UAM-0008', projectId: 'UAM-P26PNQ1', city: 'Pune', vertiport: 'Hinjewadi Tech Vertiport', operator: 'InterGlobe Enterprises', aircraftType: 'eVTOL Archer Midnight (5-seater)', seats: 5, rangeKm: 240, investmentCr: 225, status: 'In Transit', priority: 'Medium', origin: 'InterGlobe Pune Site', destination: 'Hinjewadi Tech Park', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: 'InterGlobe Enterprises Hinjewadi &#8594; Pune&apos;s tech park vertiport connecting Hinjewadi to Pune Station, Navi Mumbai and Mumbai. Archer Midnight 5-seater at 240 km range &#8594; Pune-Mumbai in 22 minutes vs 3.5 hours Expressway. &#8377;225Cr investment includes vertiport on Hinjewadi IT park rooftop and Pune airport integration. Hinjewadi&apos;s 4 lakh daily IT commuters face 90-minute Hinjewadi-Pune Station journey &#8594; air taxi reduces to 6 minutes. Pune-Mumbai Expressway carries 1.5 lakh vehicles/day &#8594; air taxi absorbs 5% of premium traffic reducing highway congestion. InterGlobe plans Pune-Aurangabad and Pune-Shirdi pilgrimage routes at &#8377;2,500/seat' },
  { id: 'UAM-0009', projectId: 'UAM-G26GAU1', city: 'Guwahati', vertiport: 'Paltan Bazaar Vertiport', operator: 'Volaris Air Taxi', aircraftType: 'eVTOL Beta Alia (6-seater)', seats: 6, rangeKm: 460, investmentCr: 85, status: 'Delivered', priority: 'Medium', origin: 'Volaris Guwahati Assembly', destination: 'Paltan Bazaar Guwahati', shipDate: '2026-07-08', transitDays: 4, zone: 'East', remarks: 'Volaris Air Taxi Guwahati &#8594; Northeast India&apos;s first vertiport at Paltan Bazaar serving inter-city routes to Shillong, Silchar, Tezpur and Dimapur. Beta Alia 6-seater at 460 km range &#8594; Guwahati-Shillong in 18 minutes vs 3.5 hours road. &#8377;85Cr investment leverages existing Assam helicopter pads upgraded to eVTOL specification. Northeast India&apos;s challenging terrain makes air mobility essential &#8594; roads cut by landslides and monsoon flooding leave communities isolated 60 days/year. Volaris replaces helicopter shuttle (&#8377;25,000/hr) at &#8377;3,000/seat &#8594; 80% cost reduction for Assam government officials. Guwahati vertiport targets 100 daily flights connecting 7 Northeast capitals by 2028' },
  { id: 'UAM-0010', projectId: 'UAM-J26JPR1', city: 'Jaipur', vertiport: 'Mansarovar Vertiport', operator: 'BLADE India', aircraftType: 'eVTOL Lilium Jet (7-seater)', seats: 7, rangeKm: 300, investmentCr: 120, status: 'Processing', priority: 'Medium', origin: 'BLADE India Delhi Hub', destination: 'Mansarovar Jaipur', shipDate: '2026-08-02', transitDays: 1, zone: 'North', remarks: 'BLADE India Mansarovar &#8594; Jaipur&apos;s tourism vertiport connecting to Delhi, Udaipur, Jodhpur and Ajmer pilgrimage routes. Lilium Jet 7-seater at 300 km range &#8594; Jaipur-Delhi in 35 minutes vs 5 hours road. &#8377;120Cr investment includes vertiport near Mansarovar lake and Nahargarh hilltop scenic vertiport. Jaipur receives 50 lakh tourists/yr &#8594; air taxi enables same-day Delhi-Jaipur-Udaipur golden triangle circuit in 3 hours total travel time. Rajasthan tourism department subsidises tourist air taxi at &#8377;2,500/seat for first 2 years &#8594; boosting premium tourism revenue by &#8377;500Cr/yr. BLADE targets Jaipur-Jodhpur (25 min) and Jaipur-Jaisalmer (45 min via Jodhpur stop) desert tourism routes' },
  { id: 'UAM-0011', projectId: 'UAM-K26KOC1', city: 'Kochi', vertiport: 'Lulu Mall Vertiport', operator: 'Eve Air Mobility India', aircraftType: 'eVTOL Eve Eve (4-seater)', seats: 4, rangeKm: 200, investmentCr: 95, status: 'Delivered', priority: 'Medium', origin: 'Eve Air Mobility Kochi', destination: 'Lulu Mall Edappally', shipDate: '2026-07-12', transitDays: 2, zone: 'South', remarks: 'Eve Air Mobility Kochi &#8594; Kerala&apos;s first vertiport at Lulu Mall Edappally connecting to Fort Kochi, Trivandrum and Kozhikode. Eve 4-seater at 200 km range &#8594; Kochi-Trivandrum in 45 minutes vs 4.5 hours road. &#8377;95Cr investment includes rooftop vertiport on Lulu Mall (India&apos;s largest mall) and waterfront vertiport at Marine Drive. Kochi&apos;s 15 lakh daily commuters and 20 lakh annual tourists create diverse demand &#8594; airport shuttle (CIAL to Marine Drive in 6 min) and tourism routes (Fort Kochi to Munnar via intermediate). Kerala government mandates vertiports at all government medical colleges &#8594; organ transport in under 30 minutes saving lives across 14 districts' },
  { id: 'UAM-0012', projectId: 'UAM-V26VIZ1', city: 'Visakhapatnam', vertiport: 'Dwaraka Nagar Vertiport', operator: 'Volaris Air Taxi', aircraftType: 'eVTOL Beta Alia (6-seater)', seats: 6, rangeKm: 460, investmentCr: 110, status: 'Delivered', priority: 'Medium', origin: 'Volaris Vizag Assembly', destination: 'Dwaraka Nagar Vizag', shipDate: '2026-07-08', transitDays: 2, zone: 'South', remarks: 'Volaris Air Taxi Vizag &#8594; Andhra&apos;s port-city vertiport connecting to Hyderabad, Vijayawada, Rajahmundry and Bhubaneswar. Beta Alia 6-seater at 460 km range &#8594; Vizag-Hyderabad in 55 minutes vs 8 hours road. &#8377;110Cr investment includes vertiport at Vizag IT SEZ and port industrial vertiport at HPCL refinery. Vizag&apos;s growing IT and pharma sectors create business demand &#8594; HPCL and Vishaka Shipyard executives commute between Vizag and Hyderabad daily. Industrial vertiport serves offshore platform crew change &#8594; replacing 6-hour boat ride with 25-minute eVTOL flight to ONGC rigs. Vizag-Bhubaneswar (35 min) connects two major Odisha-AP ports &#8594; enabling same-day port-to-port executive meetings' },
  { id: 'UAM-0013', projectId: 'UAM-L26LKO1', city: 'Lucknow', vertiport: 'Gomti Nagar Vertiport', operator: 'Joby Aviation India', aircraftType: 'eVTOL Joby S4 (4-seater)', seats: 4, rangeKm: 240, investmentCr: 155, status: 'In Transit', priority: 'Medium', origin: 'Joby Aviation Delhi Depot', destination: 'Gomti Nagar Lucknow', shipDate: '2026-07-24', transitDays: 1, zone: 'North', remarks: 'Joby Aviation Gomti Nagar &#8594; UP capital&apos;s vertiport connecting to Delhi, Agra, Varanasi and Ayodhya. Joby S4 4-seater at 240 km range &#8594; Lucknow-Delhi in 35 minutes vs 6 hours Shatabdi. &#8377;155Cr investment includes vertiport on Gomti Nagar IT park and Hazratganj city centre vertiport. UP&apos;s 24 crore population and 8 state government daily flights create strong demand &#8594; Lucknow-Ayodhya (30 min) serves 50 lakh annual Ram Mandir pilgrims. UP UAM policy 2026 designates vertiports at 15 government hospitals for organ and emergency medical transport &#8594; Lucknow SGPGI to district hospitals in under 20 minutes. Joby targets 150 daily flights across UP by 2028 including Lucknow-Agra-Varanasi golden triangle' },
  { id: 'UAM-0014', projectId: 'UAM-I26IND1', city: 'Indore', vertiport: 'Vijay Nagar Vertiport', operator: 'InterGlobe Enterprises', aircraftType: 'eVTOL Archer Midnight (5-seater)', seats: 5, rangeKm: 240, investmentCr: 105, status: 'Delivered', priority: 'Medium', origin: 'InterGlobe Indore Site', destination: 'Vijay Nagar Indore', shipDate: '2026-07-12', transitDays: 2, zone: 'North', remarks: 'InterGlobe Enterprises Vijay Nagar &#8594; Indore&apos;s commercial hub vertiport connecting to Bhopal, Ujjain and Mandu tourism routes. Archer Midnight 5-seater at 240 km range &#8594; Indore-Bhopal in 20 minutes vs 3 hours road. &#8377;105Cr investment includes vertiport on Vijay Nagar mall rooftop and Mahatma Gandhi Tower helipad upgrade. Indore&apos;s status as India&apos;s cleanest city aligns with zero-emission eVTOL vision &#8594; all vertiports powered by MP&apos;s renewable energy grid. Indore-Ujjain (12 min) serves Mahakal temple&apos;s 5 crore annual pilgrims &#8594; reducing Ujjain&apos;s traffic congestion by 30% during Mahashivratri. InterGlobe targets MP network of 6 vertiports (Indore, Bhopal, Jabalpur, Gwalior, Ujjain, Sanchi) by 2029' },
];

const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#0f766e', '#115e59', '#134e4a', '#042f2e'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 4 }, { value: 'Delivered', count: 7 }, { value: 'Processing', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 2 }, { value: 'High', count: 4 }, { value: 'Medium', count: 8 },
  ]},
  { label: 'Aircraft', key: 'aircraftType', options: [
    { value: 'eVTOL Lilium Jet (7-seater)', count: 3 }, { value: 'eVTOL Joby S4 (4-seater)', count: 3 }, { value: 'eVTOL Archer Midnight (5-seater)', count: 3 }, { value: 'eVTOL Eve Eve (4-seater)', count: 2 }, { value: 'eVTOL Beta Alia (6-seater)', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 5 }, { value: 'West', count: 3 }, { value: 'North', count: 3 }, { value: 'East', count: 3 },
  ]},
];

export default function UrbanAirMobilityView() {
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
    return records.filter((r: UAMRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.city.toLowerCase().includes(searchQuery.toLowerCase()) || r.vertiport.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof UAMRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalInvestment = records.reduce((s, r) => s + r.investmentCr, 0);
  const totalSeats = records.reduce((s, r) => s + r.seats * 50, 0); // assume 50 flights/day per vertiport
  const avgRange = Math.round(records.reduce((s, r) => s + r.rangeKm, 0) / records.length);
  const totalVertiports = records.length;

  const kpiData = [
    { label: 'Vertiport Network', value: `${totalVertiports} Cities`, sub: 'eVTOL Landing Infrastructure' },
    { label: 'Avg Range', value: `${avgRange} km`, sub: 'eVTOL Aircraft Capability' },
    { label: 'Daily Seat Capacity', value: `${totalSeats.toLocaleString()}`, sub: 'Across All Vertiports' },
    { label: 'Total Investment', value: `&#8377;${totalInvestment.toLocaleString()}Cr`, sub: 'Urban Air Mobility Build' },
  ];

  const cityData = useMemo(() => records.map(r => ({ city: r.city, inv: r.investmentCr, range: r.rangeKm })).sort((a, b) => b.inv - a.inv), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const rangeVsSeats = useMemo(() => records.map(r => ({ city: r.city, range: r.rangeKm, seats: r.seats })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 uam-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Urban Air Mobility' }]} />
      <PageHeader title="Urban Air Mobility Logistics" description="eVTOL air taxi network across India&apos;s cities with vertiport infrastructure, Lilium Joby Archer Eve and Beta Alia aircraft connecting metropolitan regions in minutes instead of hours" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#0d9488] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="uam-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#0d9488]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="uam-chart-card"><CardHeader><CardTitle className="text-base">Investment by City (&#8377;Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="inv" fill="#0d9488" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="uam-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#0d9488" /><Cell fill="#14b8a6" /><Cell fill="#2dd4bf" /><Cell fill="#0f766e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'uam-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Vertiport Registry' : 'Recent Deployments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#0d9488] bg-teal-50/20'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.city} &#8594; {r.seats} seats | {r.rangeKm} km | &#8377;{r.investmentCr}Cr</span>
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
          <Card className="uam-chart-card"><CardHeader><CardTitle className="text-base">Range vs Seats</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={rangeVsSeats}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="range" stroke="#0d9488" strokeWidth={2} name="Range (km)" /><Line yAxisId="right" type="monotone" dataKey="seats" stroke="#0f766e" strokeWidth={2} name="Seats" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="uam-chart-card"><CardHeader><CardTitle className="text-base">Aircraft Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'Lilium Jet', value: 3 }, { name: 'Joby S4', value: 3 }, { name: 'Archer Midnight', value: 3 }, { name: 'Eve Eve', value: 2 }, { name: 'Beta Alia', value: 3 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#0d9488" /><Cell fill="#14b8a6" /><Cell fill="#2dd4bf" /><Cell fill="#0f766e" /><Cell fill="#115e59" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="uam-chart-card"><CardHeader><CardTitle className="text-base">Investment by Zone (&#8377;Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.zone] = (m[r.zone] || 0) + r.investmentCr; return m; }, {})).map(([k, v]) => ({ zone: k, inv: v }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="inv" fill="#0f766e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="uam-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 4 }, { name: 'Delivered', value: 7 }, { name: 'Processing', value: 2 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#0d9488" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="uam-insight-card"><CardHeader><CardTitle className="text-base">5 eVTOL Platforms Battle for Indian Skies</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">India&apos;s UAM portfolio deploys 5 competing eVTOL platforms &#8594; Lilium Jet (7-seater, 300 km, jet-based), Joby S4 (4-seater, 240 km, most certified), Archer Midnight (5-seater, 240 km, quietest at 55 dB), Eve Eve (4-seater, 200 km, Embraer-backed) and Beta Alia (6-seater, 460 km, longest range). Each serves different routes: Lilium for high-density corridors (Delhi-Jaipur), Joby for premium metro (Mumbai-BKC), Archer for tech parks (Bengaluru, Pune), Eve for industrial cities (Chennai, Kochi), Beta Alia for remote regions (Guwahati, Vizag). Multi-platform strategy ensures no single technology dependency &#8594; DGCA certifying all 5 platforms simultaneously.</p></CardContent></Card>
          <Card className="uam-insight-card"><CardHeader><CardTitle className="text-base">Medical Emergency: UAM Saves Lives</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Kerala, UP and Assam mandate vertiport access at government medical colleges &#8594; organ transport from Kochi to Trivandrum Medical College in 45 minutes vs 5-hour road ambulance. UP&apos;s 15 hospital vertiports enable Lucknow SGPGI to district hospitals in 20 minutes &#8594; covering heart, liver and kidney transplant logistics. Assam&apos;s Guwahati vertiport enables organ delivery to Silchar Medical College (200 km) in 25 minutes during monsoon when roads are impassable. BLADE India&apos;s medical emergency service at &#8377;15,000/flight replaces helicopter (&#8377;1,50,000) &#8594; making air ambulance accessible to middle-class families. Estimated 5,000 lives saved annually across India&apos;s hospital vertiport network.</p></CardContent></Card>
          <Card className="uam-insight-card"><CardHeader><CardTitle className="text-base">Tourism UAM: Golden Triangle in 3 Hours</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Jaipur (UAM-0010) vertiport enables India&apos;s tourism revolution &#8594; Delhi-Agra-Jaipur golden triangle circuit in 3 hours total travel vs 14 hours by road. Rajasthan government subsidises tourist air taxi at &#8377;2,500/seat &#8594; enabling same-day return from Delhi to all Rajasthan destinations. Jaipur-Jodhpur (25 min), Jaipur-Jaisalmer (45 min via Jodhpur), Jaipur-Udaipur (30 min) create aerial tourism circuit &#8594; Rajasthan targets &#8377;500Cr additional tourism revenue. Similarly, Kerala UAM connects Kochi-Munnar-Thekkady-Kumarakom aerial circuit &#8594; replacing 8-hour road trips with 40-minute flights. India&apos;s 2 billion domestic tourists/yr represent &#8377;15,000Cr UAM tourism market.</p></CardContent></Card>
          <Card className="uam-insight-card"><CardHeader><CardTitle className="text-base">India UAM Target: 200 Vertiports by 2032</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Portfolio of 14 vertiports at &#8377;2,690Cr demonstrates India&apos;s UAM commitment &#8594; DGCA estimates 200 vertiports needed by 2032 serving 50 million annual flights. India&apos;s 100+ cities with 1M+ population and 500 km average inter-city distance create ideal UAM economics. At &#8377;200Cr average per vertiport, total investment &#8377;40,000Cr &#8594; financed by 60% private equity, 25% airport operator partnerships, 15% state government infrastructure bonds. UAM generates &#8377;3,000/seat average revenue &#8594; at 50 million flights/yr, annual market &#8377;1,50,000Cr. BLADE India, Joby, InterGlobe, Volaris and Eve competing for India&apos;s &#8377;2,00,000Cr UAM market by 2035 &#8594; world&apos;s largest by passenger volume.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
