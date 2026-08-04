#!/usr/bin/env python3
"""R463 Generator: Lithium Carbonate Logistics + Sodium Sulfate Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Lithium Carbonate: Li2CO3 ---
# Prefix: lic, Icon: Candy, Color: #be123c (rose-dark, Li-rose), density 2.11 g/cm3
lic_records = [
    ['LIC-A2401', 'B24-LIC-001', 'Mumbai', 'MIDHANI', 'Li2CO3 99.5% Li-Ion Battery Cathode', 'NMC/LFP Precursor', '99.5%', '2.11 g/cm3', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Exide NMC-622 cathode'],
    ['LIC-A2402', 'B24-LIC-002', 'Bengaluru', 'DRDO DMRL', 'Li2CO3 99.95% Aerospace Li-Al Alloy', 'Fighter Fuselage', '99.95%', '2.11 g/cm3', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'HAL Tejas Li-Al panel'],
    ['LIC-A2403', 'B24-LIC-003', 'Hyderabad', 'Tata Chemicals', 'Li2CO3 99.3% Glass Ceramic Crockery', 'Glass-Ceramic Cooktop', '99.3%', '2.11 g/cm3', '&#8377;780 Cr', 'in-transit', 'medium', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'La Opala Li glass-ceramic'],
    ['LIC-A2404', 'B24-LIC-004', 'Chennai', 'Bharat Forge', 'Li2CO3 99.7% EV Battery Grade LFP', 'LiFePO4 Cathode', '99.7%', '2.11 g/cm3', '&#8377;900 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Ola Electric LFP pack'],
    ['LIC-A2405', 'B24-LIC-005', 'Kolkata', 'Shyam Chemicals', 'Li2CO3 99.85% Pharmaceutical Mood Stabilizer', 'Lithium Carbonate Tab', '99.85%', '2.11 g/cm3', '&#8377;860 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Sun Pharma LiCO3 tab'],
    ['LIC-A2406', 'B24-LIC-006', 'Noida', 'BHEL R&amp;D', 'Li2CO3 99.8% Grid Storage BESS', 'MWh LFP Container', '99.8%', '2.11 g/cm3', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Tata Power LFP BESS'],
    ['LIC-A2407', 'B24-LIC-007', 'Pune', 'Godrej Chemicals', 'Li2CO3 99.6% Grease Thickener Lithium Soap', 'Lithium Stearate', '99.6%', '2.11 g/cm3', '&#8377;800 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Castrol Li multi-grease'],
    ['LIC-A2408', 'B24-LIC-008', 'Jaipur', 'Rajasthan Chemicals', 'Li2CO3 99.0% Ceramic Glaze Flux', 'Porcelain Frit', '99.0%', '2.11 g/cm3', '&#8377;720 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Morbi Li glaze flux'],
    ['LIC-A2409', 'B24-LIC-009', 'Guwahati', 'Assam Chemicals', 'Li2CO3 99.4% Aluminium Smelting Flux', 'Li Cryolite Bath', '99.4%', '2.11 g/cm3', '&#8377;780 Cr', 'in-transit', 'medium', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Hindalco Li cryolite'],
    ['LIC-A2410', 'B24-LIC-010', 'Ahmedabad', 'Gujarat Chemicals', 'Li2CO3 99.92% Solid-State Battery Electrolyte', 'Li-PSS Latent', '99.92%', '2.11 g/cm3', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'IISc solid-state Li cell'],
    ['LIC-A2411', 'B24-LIC-011', 'Lucknow', 'UP Chemicals', 'Li2CO3 99.2% CO2 Scrubber Absorbent', 'Direct Air Capture', '99.2%', '2.11 g/cm3', '&#8377;740 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Tata Steel DAC Li absorb'],
    ['LIC-A2412', 'B24-LIC-012', 'Visakhapatnam', 'Vizag Chemicals', 'Li2CO3 99.95% Submarine Li-Ion Propulsion', 'SSN AIP Battery', '99.95%', '2.11 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK Li-Ion AIP'],
    ['LIC-A2413', 'B24-LIC-013', 'Balasore', 'DRDO TBRL', 'Li2CO3 99.8% Warship Torpedo Li Battery', 'Lightweight Munition', '99.8%', '2.11 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval Li torpedo cell'],
    ['LIC-A2414', 'B24-LIC-014', 'Bhilai', 'SAIL Chemicals', 'Li2CO3 98.0% General Industrial Grade', 'Process Chemical', '98.0%', '2.11 g/cm3', '&#8377;600 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Li flux charge'],
]

# --- Sodium Sulfate: Na2SO4 ---
# Prefix: sos, Icon: Clipboard, Color: #64748b (slate, Na-grey), density 2.68 g/cm3
sos_records = [
    ['SOS-A2401', 'B24-SOS-001', 'Mumbai', 'MIDHANI', 'Na2SO4 99.5% Kraft Paper Pulp Digester', 'Paper Chemical', '99.5%', '2.68 g/cm3', '&#8377;780 Cr', 'in-transit', 'medium', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'JK Paper kraft pulping'],
    ['SOS-A2402', 'B24-SOS-002', 'Bengaluru', 'DRDO DMRL', 'Na2SO4 99.9% Detergent Powder Builder', 'Surfactant Carrier', '99.9%', '2.68 g/cm3', '&#8377;840 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'HUL Surf Excel Na2SO4'],
    ['SOS-A2403', 'B24-SOS-003', 'Hyderabad', 'Tata Chemicals', 'Na2SO4 99.3% Glass Batch Cullet Modifier', 'Soda-Lime Glass', '99.3%', '2.68 g/cm3', '&#8377;760 Cr', 'in-transit', 'medium', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Asahi glass Na2SO4 batch'],
    ['SOS-A2404', 'B24-SOS-004', 'Chennai', 'Bharat Forge', 'Na2SO4 99.7% Textile Dye Leveling Agent', 'Fabric Auxillary', '99.7%', '2.68 g/cm3', '&#8377;800 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Bhilwara dye leveler'],
    ['SOS-A2405', 'B24-SOS-005', 'Kolkata', 'Shyam Chemicals', 'Na2SO4 99.85% Sodium Sulfide Feedstock', 'Kraft Liquor', '99.85%', '2.68 g/cm3', '&#8377;820 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'ITC paper Na2S precusor'],
    ['SOS-A2406', 'B24-SOS-006', 'Noida', 'BHEL R&amp;D', 'Na2SO4 99.8% Thermal Energy Storage PCM', 'Solar Molten Salt', '99.8%', '2.68 g/cm3', '&#8377;860 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Tata Power CSP PCM'],
    ['SOS-A2407', 'B24-SOS-007', 'Pune', 'Godrej Chemicals', 'Na2SO4 99.6% Animal Feed Mineral Supplement', 'Cattle Na Source', '99.6%', '2.68 g/cm3', '&#8377;740 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Amul dairy Na premix'],
    ['SOS-A2408', 'B24-SOS-008', 'Jaipur', 'Rajasthan Chemicals', 'Na2SO4 99.0% Starch Modified Additive', 'Food Processing', '99.0%', '2.68 g/cm3', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Rajasthan starch Na2SO4'],
    ['SOS-A2409', 'B24-SOS-009', 'Guwahati', 'Assam Chemicals', 'Na2SO4 99.4% Deflocculant Ceramic Glaze', 'Clay Suspension', '99.4%', '2.68 g/cm3', '&#8377;720 Cr', 'in-transit', 'medium', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Morbi tile Na2SO4 defloc'],
    ['SOS-A2410', 'B24-SOS-010', 'Ahmedabad', 'Gujarat Chemicals', 'Na2SO4 99.92% High-Purity Reagent AR', 'Lab Chemical', '99.92%', '2.68 g/cm3', '&#8377;880 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'IISc analytical Na2SO4'],
    ['SOS-A2411', 'B24-SOS-011', 'Lucknow', 'UP Chemicals', 'Na2SO4 99.2% Fire Retardant Textile Treatment', 'Flame-Resist Coat', '99.2%', '2.68 g/cm3', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Bhilwara FR Na treat'],
    ['SOS-A2412', 'B24-SOS-012', 'Visakhapatnam', 'Vizag Chemicals', 'Na2SO4 99.9% Submarine Desalination Brine', 'Reverse Osmosis Pre', '99.9%', '2.68 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK RO purify'],
    ['SOS-A2413', 'B24-SOS-013', 'Balasore', 'DRDO TBRL', 'Na2SO4 99.8% Warship Exhaust Gas Scrubber', 'Marine DeSOx Wash', '99.8%', '2.68 g/cm3', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval exhaust wash'],
    ['SOS-A2414', 'B24-SOS-014', 'Bhilai', 'SAIL Chemicals', 'Na2SO4 98.0% General Industrial Grade', 'Process Chemical', '98.0%', '2.68 g/cm3', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Na2SO4 process salt'],
]


def fmt_record(r):
    parts = [f"'{r[i]}'" for i in range(len(r))]
    return '  [' + ', '.join(parts) + ']'


def gen_module(records, config):
    with open(TEMPLATE_PATH, 'r') as f:
        template = f.read()
    prefix = config['prefix']
    icon = config['icon']
    color = config['color']
    title = config['title']
    subtitle = config['subtitle']
    fn_name = config['fn_name']
    rec_strs = [fmt_record(r) for r in records]
    rec_block = f"const {prefix}_RECORDS = [\n" + ',\n'.join(rec_strs) + "\n];"
    template = re.sub(r"const [\w]+_RECORDS = \[.*?\];", rec_block, template, flags=re.DOTALL)
    template = re.sub(r"import \{ \w+ \} from 'lucide-react';", f"import {{ {icon} }} from 'lucide-react';", template)
    template = re.sub(r"export default function \w+LogisticsView\(\)", f"export default function {fn_name}()", template)
    template = re.sub(r"zinc_oxide_RECORDS", f"{prefix}_RECORDS", template)
    template = template.replace('Zinc Oxide Logistics', title)
    template = template.replace('ZnO varistor &#8226; UV blocker &#8226; Rubber vulcanization &#8226; TCO electrode supply chain', subtitle)
    template = re.sub(r'<ShieldCheck className="w-5 h-5"', f'<{icon} className="w-5 h-5"', template)
    template = re.sub(r"'16a34a'", f"'{color}'", template)
    template = re.sub(r"backgroundColor: '#6366f122'", f"backgroundColor: '{color}22'", template)
    return template


# --- Generate Lithium Carbonate ---
lic_config = {
    'prefix': 'lic', 'icon': 'Candy', 'color': '#be123c',
    'title': 'Lithium Carbonate Logistics',
    'subtitle': 'Li2CO3 Li-Ion cathode &#8226; EV LFP &#8226; Aerospace Li-Al &#8226; Submarine Li-Ion AIP propulsion supply chain',
    'fn_name': 'LithiumCarbonateLogisticsView',
}
with open('src/components/modules/lithium-carbonate-logistics-view.tsx', 'w') as f:
    f.write(gen_module(lic_records, lic_config))
print("Generated: lithium-carbonate-logistics-view.tsx")

# --- Generate Sodium Sulfate ---
sos_config = {
    'prefix': 'sos', 'icon': 'Clipboard', 'color': '#64748b',
    'title': 'Sodium Sulfate Logistics',
    'subtitle': 'Na2SO4 detergent builder &#8226; Kraft pulp &#8226; Glass batch &#8226; Submarine RO desalination supply chain',
    'fn_name': 'SodiumSulfateLogisticsView',
}
with open('src/components/modules/sodium-sulfate-logistics-view.tsx', 'w') as f:
    f.write(gen_module(sos_records, sos_config))
print("Generated: sodium-sulfate-logistics-view.tsx")

# --- Verify ---
for fname in ['src/components/modules/lithium-carbonate-logistics-view.tsx', 'src/components/modules/sodium-sulfate-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
