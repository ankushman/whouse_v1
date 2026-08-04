#!/usr/bin/env python3
"""R468 Generator: Magnesium Ingot Logistics + Yttria-Stabilized Zirconia Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Magnesium Ingot: Mg ---
# Prefix: mgi, Icon: Bomb, Color: #6b7280 (gray-metal), MP 650 degC, density 1.74 g/cm3
mgi_records = [
    ['MGI-A2401', 'B24-MGI-001', 'Mumbai', 'MIDHANI', 'Mg 99.9% Fighter Jet Airframe Alloy Panel', 'Lightweight Fuselage', '99.9%', '650 degC', '&#8377;840 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'HAL Tejas Mg panel'],
    ['MGI-A2402', 'B24-MGI-002', 'Bengaluru', 'DRDO DMRL', 'Mg 99.95% Aerospace Wheel Forging', 'Landing Gear Rim', '99.95%', '650 degC', '&#8377;900 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'HAL Mg wheel forge'],
    ['MGI-A2403', 'B24-MGI-003', 'Hyderabad', 'Tata Chemicals', 'Mg 99.7% Automobile Die-Cast Engine Block', 'Lightweight Chassis', '99.7%', '650 degC', '&#8377;820 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Tata Motors Mg block'],
    ['MGI-A2404', 'B24-MGI-004', 'Chennai', 'Bharat Forge', 'Mg 99.85% Submarine Ballast Tank Bracket', 'Anti-Corrosion Fix', '99.85%', '650 degC', '&#8377;880 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Mazagon Dock Mg ballast'],
    ['MGI-A2405', 'B24-MGI-005', 'Kolkata', 'Shyam Chemicals', 'Mg 99.3% Steel Desulfurization Reagent', 'Foundry Injection', '99.3%', '650 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'SAIL Mg desulf reagent'],
    ['MGI-A2406', 'B24-MGI-006', 'Noida', 'BHEL R&amp;D', 'Mg 99.8% Laptop Casing Die-Cast Shell', 'Consumer Electronics', '99.8%', '650 degC', '&#8377;800 Cr', 'delivered', 'medium', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Dixon Mg laptop shell'],
    ['MGI-A2407', 'B24-MGI-007', 'Pune', 'Godrej Chemicals', 'Mg 99.0% Sacrificial Anode Pipeline', 'Cathodic Protection', '99.0%', '650 degC', '&#8377;740 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'GAIL Mg anode pipe'],
    ['MGI-A2408', 'B24-MGI-008', 'Jaipur', 'Rajasthan Chemicals', 'Mg 99.6% Warship Deck Light Alloy Grating', 'Naval Non-Skid', '99.6%', '650 degC', '&#8377;860 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'GRSE Mg deck grating'],
    ['MGI-A2409', 'B24-MGI-009', 'Guwahati', 'Assam Chemicals', 'Mg 99.92% EV Battery Fire Suppression', 'Thermal Runaway Sh', '99.92%', '650 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Ola Mg fire suppress'],
    ['MGI-A2410', 'B24-MGI-010', 'Ahmedabad', 'Gujarat Chemicals', 'Mg 99.4% Textile Spinning Frame Housing', 'Machinery Housing', '99.4%', '650 degC', '&#8377;720 Cr', 'pending', 'medium', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Arvind Mg spinning frame'],
    ['MGI-A2411', 'B24-MGI-011', 'Lucknow', 'UP Chemicals', 'Mg 99.8% Telecom Tower Antenna Mast', 'Lightweight Tower', '99.8%', '650 degC', '&#8377;820 Cr', 'delivered', 'high', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Jio Mg tower mast'],
    ['MGI-A2412', 'B24-MGI-012', 'Visakhapatnam', 'Vizag Chemicals', 'Mg 99.85% Submarine Escape Chamber Hull', 'Pressure Vessel Light', '99.85%', '650 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK escape hull'],
    ['MGI-A2413', 'B24-MGI-013', 'Balasore', 'DRDO TBRL', 'Mg 99.95% Flare Decoy Illuminant Shell', 'Countermeasure Chaff', '99.95%', '650 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO Mg flare decoy'],
    ['MGI-A2414', 'B24-MGI-014', 'Bhilai', 'SAIL Chemicals', 'Mg 98.0% General Industrial Grade', 'Process Alloy', '98.0%', '650 degC', '&#8377;540 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Mg alloy stock'],
]

# --- Yttria-Stabilized Zirconia: YSZ ---
# Prefix: ysz, Icon: Braces, Color: #b45309 (amber-dark), MP 2715 degC, density 6.05 g/cm3
ysz_records = [
    ['YSZ-A2401', 'B24-YSZ-001', 'Mumbai', 'MIDHANI', 'YSZ 99.9% Gas Turbine Blade TBC Coat', 'Aero Engine Hot Sec', '99.9%', '2715 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'HAL Tejas GT TBC coat'],
    ['YSZ-A2402', 'B24-YSZ-002', 'Bengaluru', 'DRDO DMRL', 'YSZ 99.95% Solid Oxide Fuel Cell Electrolyte', 'Power Generation', '99.95%', '2715 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'BHEL SOFC YSZ electro'],
    ['YSZ-A2403', 'B24-YSZ-003', 'Hyderabad', 'Tata Chemicals', 'YSZ 99.7% Thermal Barrier Coating Piston', 'Automotive Turbo', '99.7%', '2715 degC', '&#8377;860 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Cummins YSZ TBC piston'],
    ['YSZ-A2404', 'B24-YSZ-004', 'Chennai', 'Bharat Forge', 'YSZ 99.85% Submarine Exhaust Insulation Tile', 'Naval Diesel Muff', '99.85%', '2715 degC', '&#8377;920 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Mazagon Dock YSZ exht'],
    ['YSZ-A2405', 'B24-YSZ-005', 'Kolkata', 'Shyam Chemicals', 'YSZ 99.3% Oxygen Sensor Ceramic Lambda', 'Emissions Control', '99.3%', '2715 degC', '&#8377;800 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'MICO Bosch YSZ O2'],
    ['YSZ-A2406', 'B24-YSZ-006', 'Noida', 'BHEL R&amp;D', 'YSZ 99.8% Warship Gas Turbine Combustor', 'Marine Powerplant', '99.8%', '2715 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'GRSE LM2500 YSZ liner'],
    ['YSZ-A2407', 'B24-YSZ-007', 'Pune', 'Godrej Chemicals', 'YSZ 99.0% Dental Crown Prosthetic', 'Bioceramic Implant', '99.0%', '2715 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Apolo YSZ dental crown'],
    ['YSZ-A2408', 'B24-YSZ-008', 'Jaipur', 'Rajasthan Chemicals', 'YSZ 99.6% Missile Radome Nose Cone', 'RF Transparent', '99.6%', '2715 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'DRDO Astra YSZ radome'],
    ['YSZ-A2409', 'B24-YSZ-009', 'Guwahati', 'Assam Chemicals', 'YSZ 99.92% Nuclear Fuel Pellet Cladding', 'Zirconium Ceramic', '99.92%', '2715 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'NPCIL YSZ cladding'],
    ['YSZ-A2410', 'B24-YSZ-010', 'Ahmedabad', 'Gujarat Chemicals', 'YSZ 99.4% Cutting Tool Ceramic Insert', 'Machining Indexable', '99.4%', '2715 degC', '&#8377;780 Cr', 'pending', 'medium', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Sandvik YSZ insert'],
    ['YSZ-A2411', 'B24-YSZ-011', 'Lucknow', 'UP Chemicals', 'YSZ 99.8% Steel Continuous Casting Nozzle', 'Foundry Refractory', '99.8%', '2715 degC', '&#8377;840 Cr', 'delivered', 'high', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Tata Steel YSZ nozzle'],
    ['YSZ-A2412', 'B24-YSZ-012', 'Visakhapatnam', 'Vizag Chemicals', 'YSZ 99.85% Submarine Reactor Thermal Shield', 'Nuke Containment', '99.85%', '2715 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSBN YSZ shield'],
    ['YSZ-A2413', 'B24-YSZ-013', 'Balasore', 'DRDO TBRL', 'YSZ 99.95% Hypersonic Scramjet Combustor Lin', 'Mach 7+ Thermal', '99.95%', '2715 degC', '&#8377;980 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO scramjet YSZ lin'],
    ['YSZ-A2414', 'B24-YSZ-014', 'Bhilai', 'SAIL Chemicals', 'YSZ 98.0% General Industrial Grade', 'Refractory Ceramic', '98.0%', '2715 degC', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL YSZ refractory'],
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


# --- Generate Magnesium Ingot ---
mgi_config = {
    'prefix': 'mgi', 'icon': 'Bomb', 'color': '#6b7280',
    'title': 'Magnesium Ingot Logistics',
    'subtitle': 'Mg airframe alloy &#8226; Die-cast chassis &#8226; Submarine ballast &#8226; Flare decoy countermeasure supply chain',
    'fn_name': 'MagnesiumIngotLogisticsView',
}
with open('src/components/modules/magnesium-ingot-logistics-view.tsx', 'w') as f:
    f.write(gen_module(mgi_records, mgi_config))
print("Generated: magnesium-ingot-logistics-view.tsx")

# --- Generate YSZ ---
ysz_config = {
    'prefix': 'ysz', 'icon': 'Braces', 'color': '#b45309',
    'title': 'Yttria-Stabilized Zirconia Logistics',
    'subtitle': 'YSZ thermal barrier &#8226; SOFC electrolyte &#8226; Submarine reactor shield &#8226; Hypersonic scramjet supply chain',
    'fn_name': 'YttriaStabilizedZirconiaLogisticsView',
}
with open('src/components/modules/yttria-stabilized-zirconia-logistics-view.tsx', 'w') as f:
    f.write(gen_module(ysz_records, ysz_config))
print("Generated: yttria-stabilized-zirconia-logistics-view.tsx")

for fname in ['src/components/modules/magnesium-ingot-logistics-view.tsx', 'src/components/modules/yttria-stabilized-zirconia-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
    print(f"  Lines: {c.count(chr(10))+1}")
