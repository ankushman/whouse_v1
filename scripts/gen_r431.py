#!/usr/bin/env python3
"""R431 Generator: Aluminium Nitride (AlN) + Lithium Carbide (Li2C2) logistics modules."""
import os

BASE = "/home/z/my-project/src/components/modules"

def esc(s):
    # Don't double-encode already-valid HTML entities like &#8377;
    # Only escape raw & and other characters
    s = s.replace("°", "&#176;")
    s = s.replace("₹", "&#8377;")
    s = s.replace(">", "&#8594;")
    s = s.replace("<", "&lt;")
    # Escape raw & that is NOT part of an entity
    import re
    s = re.sub(r'&(?!#|amp;)', '&amp;', s)
    return s

def gen_module(slug, css_prefix, hex_color, icon, title, subtitle, chem_formula, app_field, purity_unit, spec_prop_label, spec_prop_unit, records_data):
    lines = []
    q = esc  # alias
    lines.append(f"""'use client';
import {{ useState, useMemo }} from 'react';
import {{ {icon} }} from 'lucide-react';

const {slug.replace('-','_')}_RECORDS = [
{records_data}
];

export default function {slug.title().replace('-','_')}LogisticsView() {{
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');

  const filtered = useMemo(() => {{
    return {slug.replace('-','_')}_RECORDS.filter(r => {{
      const match = r[1].toLowerCase().includes(searchTerm.toLowerCase()) ||
        r[2].toLowerCase().includes(searchTerm.toLowerCase()) ||
        r[3].toLowerCase().includes(searchTerm.toLowerCase()) ||
        r[4].toLowerCase().includes(searchTerm.toLowerCase());
      const sMatch = statusFilter === 'all' || r[10] === statusFilter;
      return match && sMatch;
    }});
  }}, [searchTerm, statusFilter]);

  const kpis = useMemo(() => {{
    const total = filtered.length;
    const invest = filtered.reduce((s, r) => s + Number(String(r[8]).replace(/[^0-9.]/g, '') || 0), 0);
    const delayed = filtered.filter(r => r[10] === 'delayed').length;
    const avgPurity = filtered.reduce((s, r) => s + parseFloat(String(r[5]).replace('%', '')), 0) / (total || 1);
    return {{ total, invest: (invest / 100).toFixed(1), delayed, avgPurity: avgPurity.toFixed(2) }};
  }}, [filtered]);

  const statusColor = (s) => {{
    if (s === 'in-transit') return 'bg-blue-500/20 text-blue-400';
    if (s === 'delivered') return 'bg-green-500/20 text-green-400';
    if (s === 'delayed') return 'bg-red-500/20 text-red-400';
    return 'bg-gray-500/20 text-gray-400';
  }};

  const priorityColor = (p) => {{
    if (p === 'critical') return 'bg-red-500/20 text-red-400';
    if (p === 'high') return 'bg-orange-500/20 text-orange-400';
    if (p === 'medium') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  }};

  const tabs = ['dashboard', 'registry', 'analytics', 'insights'];
  const zoneData = useMemo(() => {{
    const zones: Record<string, number> = {{}};
    filtered.forEach(r => {{ zones[r[16]] = (zones[r[16]] || 0) + 1; }});
    return Object.entries(zones).sort((a, b) => b[1] - a[1]);
  }}, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{{{ backgroundColor: '{hex_color}22' }}}}>
          <{icon} className="w-5 h-5" style={{{{ color: '{hex_color}' }}}} />
        </div>
        <div>
          <h2 className="text-xl font-bold">{q(title)}</h2>
          <p className="text-sm text-gray-400">{q(subtitle)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {{[
          {{ label: 'Total Batches', value: kpis.total, color: '{hex_color}' }},
          {{ label: 'Investment (Cr)', value: kpis.invest, color: '{hex_color}' }},
          {{ label: 'Delayed', value: kpis.delayed, color: '#ef4444' }},
          {{ label: 'Avg Purity', value: kpis.avgPurity + '%', color: '{hex_color}' }},
        ].map(k => (
          <div key={{k.label}} className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <p className="text-xs text-gray-400">{{k.label}}</p>
            <p className="text-2xl font-bold mt-1" style={{{{ color: k.color }}}}>{{k.value}}</p>
          </div>
        ))}}
      </div>

      <div className="flex gap-2 border-b border-gray-700/50 pb-2">
        {{tabs.map(t => (
          <button key={{t}} onClick={{() => setActiveTab(t)}}
            className={{`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${{activeTab === t ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}}`}}>
            {{t.charAt(0).toUpperCase() + t.slice(1)}}
          </button>
        ))}}
      </div>

      <div className="flex gap-3 flex-wrap">
        <input type="text" placeholder="Search batch, city, manufacturer..."
          value={{searchTerm}} onChange={{e => setSearchTerm(e.target.value)}}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-600" />
        <select value={{statusFilter}} onChange={{e => setStatusFilter(e.target.value)}}
          className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-white focus:outline-none focus:border-gray-600">
          <option value="all">All Status</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="delayed">Delayed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {{activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Zone Distribution</h3>
            {{zoneData.map(([zone, count]) => (
              <div key={{zone}} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-400 w-20">{{zone}}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-700/50">
                  <div className="h-2 rounded-full" style={{{{ backgroundColor: '{hex_color}', width: `${{(count / kpis.total * 100).toFixed(0)}}%` }}}} />
                </div>
                <span className="text-xs text-gray-400">{{count}}</span>
              </div>
            ))}}
          </div>
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Recent Activity</h3>
            {{filtered.slice(0, 5).map(r => (
              <div key={{r[0]}} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={{`text-xs px-2 py-0.5 rounded-full ${{statusColor(r[10])}}`}}>{{r[10]}}</span>
                  <span className="text-sm text-gray-300">{{r[1]}}</span>
                </div>
                <span className="text-xs text-gray-500">{{r[13]}}</span>
              </div>
            ))}}
          </div>
        </div>
      )}}

      {{activeTab === 'registry' && (
        <div className="overflow-x-auto rounded-xl border border-gray-700/50">
          <table className="w-full text-sm">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Batch</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">City</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Manufacturer</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Grade</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">App</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Purity</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Invest (Cr)</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Status</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {{filtered.map(r => (
                <tr key={{r[0]}} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3 text-white font-mono">{{r[1]}}</td>
                  <td className="px-4 py-3 text-gray-300">{{r[2]}}</td>
                  <td className="px-4 py-3 text-gray-300">{{r[3]}}</td>
                  <td className="px-4 py-3 text-gray-300">{{r[4]}}</td>
                  <td className="px-4 py-3 text-gray-300">{{r[5]}}</td>
                  <td className="px-4 py-3 text-gray-300">{{r[6]}}</td>
                  <td className="px-4 py-3 text-gray-300 font-mono">{{r[8]}}</td>
                  <td className="px-4 py-3"><span className={{`text-xs px-2 py-0.5 rounded-full ${{statusColor(r[10])}}`}}>{{r[10]}}</span></td>
                  <td className="px-4 py-3"><span className={{`text-xs px-2 py-0.5 rounded-full ${{priorityColor(r[11])}}`}}>{{r[11]}}</span></td>
                </tr>
              ))}}
            </tbody>
          </table>
        </div>
      )}}

      {{activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Manufacturer Performance</h3>
            {{(() => {{ const mfg: Record<string, number> = {{}}; filtered.forEach(r => {{ mfg[r[3]] = (mfg[r[3]] || 0) + 1; }}); return Object.entries(mfg).sort((a,b) => b[1]-a[1]).slice(0,6).map(([m,c]) => ( <div key={{m}} className="flex items-center gap-3 mb-2"> <span className="text-xs text-gray-400 w-32 truncate">{{m}}</span> <div className="flex-1 h-2 rounded-full bg-gray-700/50"> <div className="h-2 rounded-full" style={{{{ backgroundColor: '{hex_color}', width: `${{(c/kpis.total*100).toFixed(0)}}%` }}}} /> </div> <span className="text-xs text-gray-400">{{c}}</span> </div> )); }})()}}
          </div>
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">{q(spec_prop_label)} Distribution</h3>
            {{filtered.slice(0, 8).map(r => (
              <div key={{r[0]}} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-400 w-28 truncate">{{r[4]}}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-700/50">
                  <div className="h-2 rounded-full" style={{{{ backgroundColor: '{hex_color}', width: `${{Math.min(100, parseFloat(String(r[7]).replace(/[^0-9.]/g, '')) / 2)}}%` }}}} />
                </div>
                <span className="text-xs text-gray-400">{{r[7]}} {q(spec_prop_unit)}</span>
              </div>
            ))}}
          </div>
        </div>
      )}}

      {{activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Supply Chain Intelligence</h3>
            {{filtered.filter(r => r[10] === 'delayed').map(r => (
              <div key={{r[0]}} className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Delayed</span>
                  <span className="text-sm font-medium text-white">{{r[1]}}</span>
                </div>
                <p className="text-xs text-gray-400">{{r[2]}} &#8594; {{r[12]}} | Transit: {{r[14]}}d | {{r[15]}}</p>
              </div>
            ))}}
            {{filtered.filter(r => r[11] === 'critical').slice(0, 3).map(r => (
              <div key={{r[0]}} className="mb-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">Critical</span>
                  <span className="text-sm font-medium text-white">{{r[1]}}</span>
                </div>
                <p className="text-xs text-gray-400">{{r[5]}} | {{r[3]}} | Ship: {{r[13]}}</p>
              </div>
            ))}}
          </div>
        </div>
      )}}
    </div>
  );
}}""")

    filepath = os.path.join(BASE, f"{slug}-logistics-view.tsx")
    with open(filepath, 'w') as f:
        f.write('\n'.join(lines))
    print(f"  Written: {filepath} ({len(lines)} lines)")
    return filepath


# ===== MODULE 1: Aluminium Nitride (AlN) =====
# Thermal conductivity 170-230 W/mK, high-purity ceramic substrate, semiconductor/defense/space
aln_hex = "#6366f1"  # indigo
aln_prefix = "aln"
aln_icon = "Microchip"
aln_title = "Aluminium Nitride Logistics"
aln_subtitle = "AlN ceramic substrate &#8226; Thermal management &#8226; High-frequency RF &#8226; Defense electronics supply chain"
aln_formula = "AlN"

aln_records = [
  ("ALN-A2401","B24-ALN-001","Hyderabad","MIDHANI","AlN 99.9% RF Substrate","5G Base Station","99.9%","210 W/mK","&#8377;920 Cr","in-transit","critical","Hyderabad","Chennai","2024-07-15","4","South"),
  ("ALN-A2402","B24-ALN-002","Bengaluru","DRDO DMRL","AlN 99.5% LED Heat Sink","LED Thermal Mgmt","99.5%","185 W/mK","&#8377;880 Cr","delivered","high","Bengaluru","Bengaluru","2024-07-10","1","South"),
  ("ALN-A2403","B24-ALN-003","Mumbai","Tata Advanced Materials","AlN 99.8% Power Module","EV Inverter IGBT","99.8%","200 W/mK","&#8377;940 Cr","in-transit","critical","Mumbai","Pune","2024-07-18","2","West"),
  ("ALN-A2404","B24-ALN-004","Pune","Bharat Forge","AlN 99.0% Brake Disc","Rail Brake Pad","99.0%","170 W/mK","&#8377;720 Cr","delivered","medium","Pune","Pune","2024-07-08","0","West"),
  ("ALN-A2405","B24-ALN-005","Chennai","Shyam Ceramics","AlN 99.7% Radar T/R Module","AESA Antenna","99.7%","220 W/mK","&#8377;900 Cr","in-transit","critical","Chennai","Visakhapatnam","2024-07-20","5","South"),
  ("ALN-A2406","B24-ALN-006","Noida","BHEL R&D","AlN 99.3% Gas Insulator","GIS Bushing","99.3%","190 W/mK","&#8377;760 Cr","delivered","high","Noida","Noida","2024-07-12","0","North"),
  ("ALN-A2407","B24-ALN-007","Kolkata","Godrej Ceramics","AlN 99.6% HEMT Package","GaN-on-AlN RF","99.6%","225 W/mK","&#8377;940 Cr","in-transit","critical","Kolkata","Kolkata","2024-07-16","1","East"),
  ("ALN-A2408","B24-ALN-008","Jaipur","Rajasthan Ceramics","AlN 98.5% Heat Spreader","Server CPU Cooler","98.5%","175 W/mK","&#8377;680 Cr","delivered","medium","Jaipur","Gurugram","2024-07-09","2","North"),
  ("ALN-A2409","B24-ALN-009","Guwahati","Assam Ceramics","AlN 99.2% Optocoupler","Fiber Optic Relay","99.2%","195 W/mK","&#8377;800 Cr","in-transit","high","Guwahati","Kolkata","2024-07-22","4","East"),
  ("ALN-A2410","B24-ALN-010","Ahmedabad","Gujarat Ceramics","AlN 99.9% Cryo Sensor","Space Cryostat","99.9%","230 W/mK","&#8377;920 Cr","pending","critical","Ahmedabad","Sriharikota","2024-07-25","6","West"),
  ("ALN-A2411","B24-ALN-011","Lucknow","UP Ceramics","AlN 99.4% Solar Inverter","PV Power Module","99.4%","198 W/mK","&#8377;840 Cr","delivered","high","Lucknow","Lucknow","2024-07-11","0","North"),
  ("ALN-A2412","B24-ALN-012","Visakhapatnam","Vizag Ceramics","AlN 99.8% Sonar Array","Submarine Bow Array","99.8%","215 W/mK","&#8377;940 Cr","delayed","critical","Visakhapatnam","Visakhapatnam","2024-07-06","28","South"),
  ("ALN-A2413","B24-ALN-013","Balasore","DRDO TBRL","AlN 99.6% Missile Seeker","RF Homing Head","99.6%","210 W/mK","&#8377;880 Cr","in-transit","critical","Balasore","Chandipur","2024-07-19","2","East"),
  ("ALN-A2414","B24-ALN-014","Bhilai","SAIL Ceramics","AlN 97% Metallurgical","Blast Furnace Liner","97.0%","160 W/mK","&#8377;640 Cr","delivered","medium","Bhilai","Bhilai","2024-07-05","0","East"),
]

aln_rec_str = ""
for r in aln_records:
    aln_rec_str += "  [" + ", ".join(f"'{esc(x)}'" for x in r) + "],\n"

print("=== R431a: Aluminium Nitride Logistics ===")
aln_path = gen_module(
    "aluminium-nitride", aln_prefix, aln_hex, aln_icon,
    aln_title, aln_subtitle, aln_formula,
    "semiconductor", "%", "Thermal Conductivity", "W/mK",
    aln_rec_str
)

# ===== MODULE 2: Lithium Carbide (Li2C2) =====
# Nuclear tritium breeding, battery anode precursor, high-energy chemistry
li2c2_hex = "#f59e0b"  # amber
li2c2_prefix = "lc"
li2c2_icon = "Flame"
li2c2_title = "Lithium Carbide Logistics"
li2c2_subtitle = "Li2C2 tritium breeder &#8226; Nuclear fusion &#8226; Battery chemistry &#8226; High-energy supply chain"
li2c2_formula = "Li2C2"

li2c2_records = [
  ("LC-A2401","B24-LC-001","Mumbai","MIDHANI","Li2C2 99.9% Breeder Grade","Fusion Blanket","99.9%","2.61 g/cm3","&#8377;920 Cr","in-transit","critical","Mumbai","Kalpakkam","2024-07-15","5","West"),
  ("LC-A2402","B24-LC-002","Hyderabad","DRDO DMRL","Li2C2 99.5% Battery Precursor","Li-ion Anode","99.5%","2.58 g/cm3","&#8377;880 Cr","delivered","high","Hyderabad","Hyderabad","2024-07-10","1","South"),
  ("LC-A2403","B24-LC-003","Bengaluru","Tata Chemicals","Li2C2 99.7% Tritium Source","ITER Component","99.7%","2.60 g/cm3","&#8377;940 Cr","in-transit","critical","Bengaluru","Gandhinagar","2024-07-18","3","South"),
  ("LC-A2404","B24-LC-004","Chennai","Bharat Forge","Li2C2 99.0% Acetylene Gen","Industrial Gas","99.0%","2.55 g/cm3","&#8377;720 Cr","delivered","medium","Chennai","Chennai","2024-07-08","0","South"),
  ("LC-A2405","B24-LC-005","Kolkata","Shyam Chemicals","Li2C2 99.8% Nuclear Shield","Fast Breeder","99.8%","2.63 g/cm3","&#8377;900 Cr","in-transit","critical","Kolkata","Kalpakkam","2024-07-20","6","East"),
  ("LC-A2406","B24-LC-006","Noida","BHEL R&D","Li2C2 99.3% EV Battery","Solid State Cell","99.3%","2.57 g/cm3","&#8377;760 Cr","pending","high","Noida","Pune","2024-07-25","3","North"),
  ("LC-A2407","B24-LC-007","Pune","Godrej Chemicals","Li2C2 99.6% Rocket Fuel","Hypergolic Mix","99.6%","2.62 g/cm3","&#8377;840 Cr","in-transit","critical","Pune","Sriharikota","2024-07-16","4","West"),
  ("LC-A2408","B24-LC-008","Jaipur","Rajasthan Lithium","Li2C2 98.5% Steel Degasser","Metallurgical","98.5%","2.50 g/cm3","&#8377;680 Cr","delivered","medium","Jaipur","Bhilai","2024-07-09","2","North"),
  ("LC-A2409","B24-LC-009","Guwahati","Assam Chemicals","Li2C2 99.2% Pharma Inter","Drug Synthesis","99.2%","2.59 g/cm3","&#8377;800 Cr","in-transit","high","Guwahati","Kolkata","2024-07-22","5","East"),
  ("LC-A2410","B24-LC-010","Ahmedabad","Gujarat Lithium","Li2C2 99.95% Fusion Demo","SST-1 Tokamak","99.95%","2.64 g/cm3","&#8377;960 Cr","pending","critical","Ahmedabad","Gandhinagar","2024-07-28","3","West"),
  ("LC-A2411","B24-LC-011","Lucknow","UP Lithium","Li2C2 99.1% Grid Storage","Na-ion Battery","99.1%","2.56 g/cm3","&#8377;720 Cr","delivered","medium","Lucknow","Lucknow","2024-07-11","0","North"),
  ("LC-A2412","B24-LC-012","Visakhapatnam","Vizag Lithium","Li2C2 99.8% Submarine Battery","Li-S Air Cell","99.8%","2.61 g/cm3","&#8377;940 Cr","delayed","critical","Visakhapatnam","Visakhapatnam","2024-07-06","28","South"),
  ("LC-A2413","B24-LC-013","Balasore","DRDO TBRL","Li2C2 99.4% Missile Battery","TPG Thruster","99.4%","2.58 g/cm3","&#8377;860 Cr","in-transit","high","Balasore","Chandipur","2024-07-19","2","East"),
  ("LC-A2414","B24-LC-014","Bhilai","SAIL Lithium","Li2C2 97% General Purpose","Chemical Feedstock","97.0%","2.48 g/cm3","&#8377;640 Cr","delivered","low","Bhilai","Bhilai","2024-07-05","0","East"),
]

li2c2_rec_str = ""
for r in li2c2_records:
    li2c2_rec_str += "  [" + ", ".join(f"'{esc(x)}'" for x in r) + "],\n"

print("\n=== R431b: Lithium Carbide Logistics ===")
lc_path = gen_module(
    "lithium-carbide", li2c2_prefix, li2c2_hex, li2c2_icon,
    li2c2_title, li2c2_subtitle, li2c2_formula,
    "nuclear", "%", "Density", "g/cm3",
    li2c2_rec_str
)

print(f"\n=== R431 Generation Complete ===")
print(f"  aluminium-nitride: {aln_path}")
print(f"  lithium-carbide: {lc_path}")
