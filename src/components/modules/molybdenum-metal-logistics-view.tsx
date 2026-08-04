'use client';
import { useState, useMemo } from 'react';
import { Wind } from 'lucide-react';

const MOM_RECORDS = [
  ['MOM-A2401', 'MOM-2024-B001', 'Mumbai', 'MIDHANI', 'Mo 99.95% Superalloy Blade', 'Ni-base superalloy turbine blade', '99.95%', 'density 10.28 g/cm3', '&#8377;960 Cr', 'In Transit', 'Critical', 'Delhi', 'Mumbai', '2024-03-15', '9', 'West', 'HAL HTT-4000 turbine'],
  ['MOM-A2402', 'MOM-2024-B002', 'Bengaluru', 'DRDO DMRL', 'Mo 99.9% Missile Thruster', 'Mo rocket thruster nozzle', '99.9%', 'melting point 2623 degC', '&#8377;940 Cr', 'Delivered', 'High', 'Chennai', 'Bengaluru', '2024-03-10', '6', 'South', 'ISRO Vikas engine nozzle'],
  ['MOM-A2403', 'MOM-2024-B003', 'Hyderabad', 'Tata Chemicals', 'Mo 99.7% Petroleum Catalyst', 'MoS2 hydrodesulfurization cat', '99.7%', 'surface area 180 m2/g', '&#8377;860 Cr', 'Processing', 'Medium', 'Vishakhapatnam', 'Hyderabad', '2024-03-20', '7', 'Central', 'IOC refinery HDS catalyst'],
  ['MOM-A2404', 'MOM-2024-B004', 'Chennai', 'Bharat Forge', 'Mo 99.5% Structural Steel', 'HSLA Mo-V microalloy steel', '99.5%', 'yield 550 MPa', '&#8377;800 Cr', 'In Transit', 'Medium', 'Kolkata', 'Chennai', '2024-03-18', '10', 'South', 'Bridge structural steel'],
  ['MOM-A2405', 'MOM-2024-B005', 'Delhi', 'Shyam Chemicals', 'Mo 99.3% Glass Electrode', 'Mo glass pH electrode', '99.3%', 'pH range 0-14', '&#8377;720 Cr', 'Stored', 'Low', 'Jaipur', 'Delhi', '2024-02-28', '4', 'North', 'Lab electrode batch'],
  ['MOM-A2406', 'MOM-2024-B006', 'Kolkata', 'BHEL R&amp;D', 'Mo 99.8% Boiler Pipe', 'Cr-Mo boiler alloy pipe', '99.8%', 'creep 550 degC', '&#8377;920 Cr', 'In Transit', 'High', 'Vishakhapatnam', 'Kolkata', '2024-03-22', '12', 'East', 'BHEL supercritical boiler'],
  ['MOM-A2407', 'MOM-2024-B007', 'Jaipur', 'Godrej Chemicals', 'Mo 99.0% X-Ray Tube', 'Mo target anode X-ray tube', '99.0%', 'emission K-alpha 17.5keV', '&#8377;840 Cr', 'Stored', 'Low', 'Mumbai', 'Jaipur', '2024-02-25', '5', 'West', 'Medical X-ray tube target'],
  ['MOM-A2408', 'MOM-2024-B008', 'Ahmedabad', 'Rajasthan Chemicals', 'Mo 99.6% Spraying Coating', 'Plasma spray Mo coating', '99.6%', 'hardness 1400 HV', '&#8377;880 Cr', 'In Transit', 'Medium', 'Jodhpur', 'Ahmedabad', '2024-03-25', '7', 'West', 'Piston ring thermal spray'],
  ['MOM-A2409', 'MOM-2024-B009', 'Guwahati', 'Assam Chemicals', 'Mo 99.4% Polymer Additive', 'MoO3 flame retardant synergist', '99.4%', 'LOI increase 8%', '&#8377;700 Cr', 'Processing', 'Medium', 'Dibrugarh', 'Guwahati', '2024-03-12', '3', 'East', 'Wire cable FR additive'],
  ['MOM-A2410', 'MOM-2024-B010', 'Lucknow', 'UP Chemicals', 'Mo 99.95% Submarine Reactor', 'Mo-TZM reactor vessel', '99.95%', 'yield 690 MPa', '&#8377;960 Cr', 'In Transit', 'Critical', 'Vishakhapatnam', 'Lucknow', '2024-03-28', '11', 'North', 'IN Navy reactor pressure vessel'],
  ['MOM-A2411', 'MOM-2024-B011', 'Pune', 'Gujarat Chemicals', 'Mo 99.2% Filament', 'Mo lighting filament wire', '99.2%', 'diameter 0.1mm', '&#8377;780 Cr', 'Stored', 'Medium', 'Surat', 'Pune', '2024-03-05', '4', 'West', 'Halogen lamp filament'],
  ['MOM-A2412', 'MOM-2024-B012', 'Vishakhapatnam', 'Vizag Chemicals', 'Mo 99.8% Warship Engine', 'Mo steel warship diesel piston', '99.8%', 'temp 450 degC', '&#8377;960 Cr', 'Delayed', 'Critical', 'Chennai', 'Vishakhapatnam', '2024-02-15', '28', 'South', 'Monsoon delay naval depot'],
  ['MOM-A2413', 'MOM-2024-B013', 'Bhubaneswar', 'DRDO TBRL', 'Mo 99.4% Missile Fin', 'Mo alloy missile tail fin', '99.4%', 'yield 520 MPa', '&#8377;940 Cr', 'In Transit', 'High', 'Balasore', 'Bhubaneswar', '2024-03-30', '2', 'East', 'DRDO missile fin stock'],
  ['MOM-A2414', 'MOM-2024-B014', 'Rourkela', 'SAIL Chemicals', 'Mo 97% General Alloy', 'Steel alloy Mo addition', '97.0%', 'Fe impurity 2%', '&#8377;640 Cr', 'Stored', 'Low', 'Ranchi', 'Rourkela', '2024-02-20', '3', 'East', 'SAIL alloy steel charge']
];

export default function MolybdenumMetalLogisticsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');

  const filtered = useMemo(() => {
    return MOM_RECORDS.filter(r => {
      const match = r[1].toLowerCase().includes(searchTerm.toLowerCase()) ||
        r[2].toLowerCase().includes(searchTerm.toLowerCase()) ||
        r[3].toLowerCase().includes(searchTerm.toLowerCase()) ||
        r[4].toLowerCase().includes(searchTerm.toLowerCase());
      const sMatch = statusFilter === 'all' || r[10] === statusFilter;
      return match && sMatch;
    });
  }, [searchTerm, statusFilter]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const invest = filtered.reduce((s, r) => s + Number(String(r[8]).replace(/[^0-9.]/g, '') || 0), 0);
    const delayed = filtered.filter(r => r[10] === 'delayed').length;
    const avgPurity = filtered.reduce((s, r) => s + parseFloat(String(r[5]).replace('%', '')), 0) / (total || 1);
    return { total, invest: (invest / 100).toFixed(1), delayed, avgPurity: avgPurity.toFixed(2) };
  }, [filtered]);

  const statusColor = (s) => {
    if (s === 'in-transit') return 'bg-blue-500/20 text-blue-400';
    if (s === 'delivered') return 'bg-green-500/20 text-green-400';
    if (s === 'delayed') return 'bg-red-500/20 text-red-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  const priorityColor = (p) => {
    if (p === 'critical') return 'bg-red-500/20 text-red-400';
    if (p === 'high') return 'bg-orange-500/20 text-orange-400';
    if (p === 'medium') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  };

  const tabs = ['dashboard', 'registry', 'analytics', 'insights'];
  const zoneData = useMemo(() => {
    const zones: Record<string, number> = {};
    filtered.forEach(r => { zones[r[16]] = (zones[r[16]] || 0) + 1; });
    return Object.entries(zones).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#0e749022' }}>
          <Wind className="w-5 h-5" style={{ color: '#0e7490' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Molybdenum Metal Logistics</h2>
          <p className="text-sm text-gray-400">Mo superalloy turbine blade, rocket nozzle, petroleum catalyst, reactor vessel supply chain tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Batches', value: kpis.total, color: '16a34a' },
          { label: 'Investment (Cr)', value: kpis.invest, color: '16a34a' },
          { label: 'Delayed', value: kpis.delayed, color: '#ef4444' },
          { label: 'Avg Purity', value: kpis.avgPurity + '%', color: '16a34a' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <p className="text-xs text-gray-400">{k.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-gray-700/50 pb-2">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <input type="text" placeholder="Search batch, city, manufacturer..."
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-600" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-white focus:outline-none focus:border-gray-600">
          <option value="all">All Status</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="delayed">Delayed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Melting Point Distribution</h3>
            {zoneData.map(([zone, count]) => (
              <div key={zone} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-400 w-20">{zone}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-700/50">
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#0e749022', width: `${(count / kpis.total * 100).toFixed(0)}%` }} />
                </div>
                <span className="text-xs text-gray-400">{count}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Recent Activity</h3>
            {filtered.slice(0, 5).map(r => (
              <div key={r[0]} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(r[10])}`}>{r[10]}</span>
                  <span className="text-sm text-gray-300">{r[1]}</span>
                </div>
                <span className="text-xs text-gray-500">{r[13]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
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
              {filtered.map(r => (
                <tr key={r[0]} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3 text-white font-mono">{r[1]}</td>
                  <td className="px-4 py-3 text-gray-300">{r[2]}</td>
                  <td className="px-4 py-3 text-gray-300">{r[3]}</td>
                  <td className="px-4 py-3 text-gray-300">{r[4]}</td>
                  <td className="px-4 py-3 text-gray-300">{r[5]}</td>
                  <td className="px-4 py-3 text-gray-300">{r[6]}</td>
                  <td className="px-4 py-3 text-gray-300 font-mono">{r[8]}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(r[10])}`}>{r[10]}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor(r[11])}`}>{r[11]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Manufacturer Performance</h3>
            {(() => { const mfg: Record<string, number> = {}; filtered.forEach(r => { mfg[r[3]] = (mfg[r[3]] || 0) + 1; }); return Object.entries(mfg).sort((a,b) => b[1]-a[1]).slice(0,6).map(([m,c]) => ( <div key={m} className="flex items-center gap-3 mb-2"> <span className="text-xs text-gray-400 w-32 truncate">{m}</span> <div className="flex-1 h-2 rounded-full bg-gray-700/50"> <div className="h-2 rounded-full" style={{ backgroundColor: '#0e749022', width: `${(c/kpis.total*100).toFixed(0)}%` }} /> </div> <span className="text-xs text-gray-400">{c}</span> </div> )); })()}
          </div>
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Melting Point Distribution</h3>
            {filtered.slice(0, 8).map(r => (
              <div key={r[0]} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-400 w-28 truncate">{r[4]}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-700/50">
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#0e749022', width: `${Math.min(100, parseFloat(String(r[7]).replace(/[^0-9.]/g, '')) / 2)}%` }} />
                </div>
                <span className="text-xs text-gray-400">{r[7]} W/mK</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Supply Chain Intelligence</h3>
            {filtered.filter(r => r[10] === 'delayed').map(r => (
              <div key={r[0]} className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Delayed</span>
                  <span className="text-sm font-medium text-white">{r[1]}</span>
                </div>
                <p className="text-xs text-gray-400">{r[2]} &#8594; {r[12]} | Transit: {r[14]}d | {r[15]}</p>
              </div>
            ))}
            {filtered.filter(r => r[11] === 'critical').slice(0, 3).map(r => (
              <div key={r[0]} className="mb-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">Critical</span>
                  <span className="text-sm font-medium text-white">{r[1]}</span>
                </div>
                <p className="text-xs text-gray-400">{r[5]} | {r[3]} | Ship: {r[13]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}