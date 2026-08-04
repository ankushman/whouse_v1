#!/usr/bin/env python3
"""R455 Generator: Bismuth Metal Logistics + Indium Metal Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Bismuth Metal: Bi ---
# Prefix: bsm, Icon: Pill, Color: #be185d (pink-dark), density 9.78 g/cm3
bsm_records = [
    ['BSM-A2401', 'B24-BSM-001', 'Mumbai', 'MIDHANI', 'Bi 99.99% Pepto-Bismol Pharma', 'Anti-Diarrheal', '99.99%', '9.78 g/cm3', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Abbott Bi sub-salicylate'],
    ['BSM-A2402', 'B24-BSM-002', 'Bengaluru', 'DRDO DMRL', 'Bi 99.95% Bismuth-Tin Fusible Plug', 'Nuclear Safety', '99.95%', '9.78 g/cm3', '&#8377;900 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'NPCIL Tarapur reactor safety'],
    ['BSM-A2403', 'B24-BSM-003', 'Hyderabad', 'Tata Chemicals', 'Bi 99.9% Free-Cutting Steel Machinability', 'Brass Rod', '99.9%', '9.78 g/cm3', '&#8377;840 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Bharat Forge free-cut steel'],
    ['BSM-A2404', 'B24-BSM-004', 'Chennai', 'Bharat Forge', 'Bi 99.5% Low-Melting Alloy Solder', 'Fire Sprinkler', '99.5%', '9.78 g/cm3', '&#8377;780 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Honeywell Bi-Sn fusible link'],
    ['BSM-A2405', 'B24-BSM-005', 'Kolkata', 'Shyam Chemicals', 'Bi 99.85% Bismuth Subcarbonate Pigment', 'Pearlescent Paint', '99.85%', '9.78 g/cm3', '&#8377;820 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Asian Paints Bi pearl coat'],
    ['BSM-A2406', 'B24-BSM-006', 'Noida', 'BHEL R&amp;D', 'Bi 99.8% Bismuth Germanate Crystal', 'PET Scintillator', '99.8%', '9.78 g/cm3', '&#8377;860 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO nuclear BGO detector'],
    ['BSM-A2407', 'B24-BSM-007', 'Pune', 'Godrej Chemicals', 'Bi 99.93% Shotgun Pellet Lead-Free', 'Green Ammo', '99.93%', '9.78 g/cm3', '&#8377;880 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'IOF lead-free Bi shot'],
    ['BSM-A2408', 'B24-BSM-008', 'Jaipur', 'Rajasthan Chemicals', 'Bi 99.0% Metallurgical Additive', 'Foundry Alloy', '99.0%', '9.78 g/cm3', '&#8377;640 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Rajasthan foundry Bi charge'],
    ['BSM-A2409', 'B24-BSM-009', 'Guwahati', 'Assam Chemicals', 'Bi 99.7% X-Ray Contrast Agent', 'Medical Imaging', '99.7%', '9.78 g/cm3', '&#8377;880 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'AIIMS CT Bi contrast'],
    ['BSM-A2410', 'B24-BSM-010', 'Ahmedabad', 'Gujarat Chemicals', 'Bi 99.99% Semiconductor Dopant', 'Bismuth Telluride', '99.99%', '9.78 g/cm3', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'IISc Bi2Te3 thermoelectric'],
    ['BSM-A2411', 'B24-BSM-011', 'Lucknow', 'UP Chemicals', 'Bi 99.4% Cosmetics Pearlescent Powder', 'Nail Polish', '99.4%', '9.78 g/cm3', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Lakme Bi pearlescent'],
    ['BSM-A2412', 'B24-BSM-012', 'Visakhapatnam', 'Vizag Chemicals', 'Bi 99.95% Submarine EMI Shielding', 'Magnetic Bi-Alloy', '99.95%', '9.78 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK EMI Bi layer'],
    ['BSM-A2413', 'B24-BSM-013', 'Balasore', 'DRDO TBRL', 'Bi 99.8% Warship Explosive Replacement', 'Green Munition', '99.8%', '9.78 g/cm3', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO lead-free Bi explosive'],
    ['BSM-A2414', 'B24-BSM-014', 'Bhilai', 'SAIL Chemicals', 'Bi 97% General Low-Melt Alloy', 'Fusible Plug', '97.0%', '9.78 g/cm3', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL boiler Bi-Sn plug'],
]

# --- Indium Metal: In ---
# Prefix: inm, Icon: Binary, Color: #4f46e5 (indigo-dark), density 7.31 g/cm3
inm_records = [
    ['INM-A2401', 'B24-INM-001', 'Mumbai', 'MIDHANI', 'In 99.99% ITO Sputtering Target', 'Touch Screen', '99.99%', '7.31 g/cm3', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Corning Gorilla ITO coat'],
    ['INM-A2402', 'B24-INM-002', 'Bengaluru', 'DRDO DMRL', 'In 99.95% Solder Alloy In-Sn', 'Aerospace Bond', '99.95%', '7.31 g/cm3', '&#8377;920 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'ISRO satellite In-Sn bond'],
    ['INM-A2403', 'B24-INM-003', 'Hyderabad', 'Tata Chemicals', 'In 99.9% LCD Semiconductor', 'Flat Panel', '99.9%', '7.31 g/cm3', '&#8377;880 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Samsung LCD ITO target'],
    ['INM-A2404', 'B24-INM-004', 'Chennai', 'Bharat Forge', 'In 99.5% Low-Melting Solder Paste', 'Wafer Bump', '99.5%', '7.31 g/cm3', '&#8377;800 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Dixon wafer In bump'],
    ['INM-A2405', 'B24-INM-005', 'Kolkata', 'Shyam Chemicals', 'In 99.85% CIGS Thin-Film Solar', 'Photovoltaic', '99.85%', '7.31 g/cm3', '&#8377;860 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Tata Power CIGS panel'],
    ['INM-A2406', 'B24-INM-006', 'Noida', 'BHEL R&amp;D', 'In 99.8% Germanium Transistor Base', 'Infrared Lens', '99.8%', '7.31 g/cm3', '&#8377;840 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO thermal Imager InGe'],
    ['INM-A2407', 'B24-INM-007', 'Pune', 'Godrej Chemicals', 'In 99.93% Dental Alloy', 'Orthodontic Wire', '99.93%', '7.31 g/cm3', '&#8377;820 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', '3M dental In-Pd alloy'],
    ['INM-A2408', 'B24-INM-008', 'Jaipur', 'Rajasthan Chemicals', 'In 99.0% Bearing Alloy', 'Turbine Sleeve', '99.0%', '7.31 g/cm3', '&#8377;680 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'BHEL sleeve bearing alloy'],
    ['INM-A2409', 'B24-INM-009', 'Guwahati', 'Assam Chemicals', 'In 99.7% Galium-Indium Arsenide', 'Solar Cell', '99.7%', '7.31 g/cm3', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IISc GaInAs research cell'],
    ['INM-A2410', 'B24-INM-010', 'Ahmedabad', 'Gujarat Chemicals', 'In 99.99% Transparent Conductive Film', 'Flexible OLED', '99.99%', '7.31 g/cm3', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'MicroOLED In flex screen'],
    ['INM-A2411', 'B24-INM-011', 'Lucknow', 'UP Chemicals', 'In 99.3% Sealed Battery Electrolyte', 'Hermetic Cell', '99.3%', '7.31 g/cm3', '&#8377;740 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Exide sealed In electrolyte'],
    ['INM-A2412', 'B24-INM-012', 'Visakhapatnam', 'Vizag Chemicals', 'In 99.95% Submarine Sonar Transducer', 'Acoustic Crystal', '99.95%', '7.31 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK bow array'],
    ['INM-A2413', 'B24-INM-013', 'Balasore', 'DRDO TBRL', 'In 99.8% Warship Thermal Imaging', 'IR Seeker', '99.8%', '7.31 g/cm3', '&#8377;920 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval IR InGe lens'],
    ['INM-A2414', 'B24-INM-014', 'Bhilai', 'SAIL Chemicals', 'In 97% General Solder Preform', 'Electronics', '97.0%', '7.31 g/cm3', '&#8377;620 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL In solder preform'],
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


# --- Generate Bismuth Metal ---
bsm_config = {
    'prefix': 'bsm', 'icon': 'Pill', 'color': '#be185d',
    'title': 'Bismuth Metal Logistics',
    'subtitle': 'Bi pharma compound &#8226; Fusible alloy &#8226; Lead-free solder &#8226; Submarine EMI shield supply chain',
    'fn_name': 'BismuthMetalLogisticsView',
}
with open('src/components/modules/bismuth-metal-logistics-view.tsx', 'w') as f:
    f.write(gen_module(bsm_records, bsm_config))
print("Generated: bismuth-metal-logistics-view.tsx")

# --- Generate Indium Metal ---
inm_config = {
    'prefix': 'inm', 'icon': 'Binary', 'color': '#4f46e5',
    'title': 'Indium Metal Logistics',
    'subtitle': 'In ITO target &#8226; LCD semiconductor &#8226; CIGS solar &#8226; Submarine sonar transducer supply chain',
    'fn_name': 'IndiumMetalLogisticsView',
}
with open('src/components/modules/indium-metal-logistics-view.tsx', 'w') as f:
    f.write(gen_module(inm_records, inm_config))
print("Generated: indium-metal-logistics-view.tsx")

# --- Verify ---
for fname in ['src/components/modules/bismuth-metal-logistics-view.tsx', 'src/components/modules/indium-metal-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
