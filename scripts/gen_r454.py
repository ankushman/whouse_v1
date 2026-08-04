#!/usr/bin/env python3
"""R454 Generator: Zinc Dust Logistics + Antimony Metal Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Zinc Dust: Zn ---
# Prefix: znd, Icon: ThermometerSun, Color: #65a30d (lime-dark), density 7.14 g/cm3
znd_records = [
    ['ZND-A2401', 'B24-ZND-001', 'Mumbai', 'MIDHANI', 'Zn Dust 99.9% Galvanizing Spray', 'Hot-Dip Galv', '99.9%', '7.14 g/cm3', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'SAIL Tata Steel HDG line'],
    ['ZND-A2402', 'B24-ZND-002', 'Bengaluru', 'DRDO DMRL', 'Zn Dust 99.7% Rocket Propellant Additive', 'Solid Fuel', '99.7%', '7.14 g/cm3', '&#8377;880 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'DRDO Akash Zn propellant'],
    ['ZND-A2403', 'B24-ZND-003', 'Hyderabad', 'Tata Chemicals', 'Zn Dust 99.5% Zinc Oxide Feedstock', 'Chemical Plant', '99.5%', '7.14 g/cm3', '&#8377;780 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'ZnO nanoparticle feedstock'],
    ['ZND-A2404', 'B24-ZND-004', 'Chennai', 'Bharat Forge', 'Zn Dust 99.0% Sacrificial Anode', 'Marine CP', '99.0%', '7.14 g/cm3', '&#8377;740 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Port Trust jetty anode'],
    ['ZND-A2405', 'B24-ZND-005', 'Kolkata', 'Shyam Chemicals', 'Zn Dust 99.8% Automotive Undercoat', 'Cold Galv Spray', '99.8%', '7.14 g/cm3', '&#8377;860 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Maruti chassis Zn spray'],
    ['ZND-A2406', 'B24-ZND-006', 'Noida', 'BHEL R&amp;D', 'Zn Dust 99.3% Zinc-Air Battery', 'Hearing Aid', '99.3%', '7.14 g/cm3', '&#8377;800 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BHEL Zn-air grid storage'],
    ['ZND-A2407', 'B24-ZND-007', 'Pune', 'Godrej Chemicals', 'Zn Dust 99.6% Rubber Curing Activator', 'Latex Glove', '99.6%', '7.14 g/cm3', '&#8377;820 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Kerala rubber ZnO activator'],
    ['ZND-A2408', 'B24-ZND-008', 'Jaipur', 'Rajasthan Chemicals', 'Zn Dust 98.5% Crop Nutrient Foliar', 'Zinc Sulfate', '98.5%', '7.14 g/cm3', '&#8377;640 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Rajasthan wheat Zn foliar'],
    ['ZND-A2409', 'B24-ZND-009', 'Guwahati', 'Assam Chemicals', 'Zn Dust 99.4% Corrosion Inhibitor', 'Cooling Water', '99.4%', '7.14 g/cm3', '&#8377;800 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Numaligarh refinery CWI'],
    ['ZND-A2410', 'B24-ZND-010', 'Ahmedabad', 'Gujarat Chemicals', 'Zn Dust 99.95% Anti-Corrosion Paint Pigment', 'Epoxy Primer', '99.95%', '7.14 g/cm3', '&#8377;940 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Asian Paints Zn-rich primer'],
    ['ZND-A2411', 'B24-ZND-011', 'Lucknow', 'UP Chemicals', 'Zn Dust 99.2% Die Casting Alloy', 'Zn-Al Zamak', '99.2%', '7.14 g/cm3', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'auto door handle Zamak'],
    ['ZND-A2412', 'B24-ZND-012', 'Visakhapatnam', 'Vizag Chemicals', 'Zn Dust 99.8% Submarine Hull Cathodic Protect', 'Naval CP', '99.8%', '7.14 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK hull Zn block'],
    ['ZND-A2413', 'B24-ZND-013', 'Balasore', 'DRDO TBRL', 'Zn Dust 99.6% Warship Smoke Screening', 'IR Obscurant', '99.6%', '7.14 g/cm3', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval smoke grenade'],
    ['ZND-A2414', 'B24-ZND-014', 'Bhilai', 'SAIL Chemicals', 'Zn Dust 97% General Metallurgical', 'Brass Making', '97.0%', '7.14 g/cm3', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL brass furnace charge'],
]

# --- Antimony Metal: Sb ---
# Prefix: sbm, Icon: Compass, Color: #dc2626 (red-dark), density 6.69 g/cm3
sbm_records = [
    ['SBM-A2401', 'B24-SBM-001', 'Mumbai', 'MIDHANI', 'Sb 99.9% Lead-Acid Battery Grid', 'Automotive SLA', '99.9%', '6.69 g/cm3', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Exide Pb-Sb grid alloy'],
    ['SBM-A2402', 'B24-SBM-002', 'Bengaluru', 'DRDO DMRL', 'Sb 99.95% Explosive Priming Mixture', 'RDX Booster', '99.95%', '6.69 g/cm3', '&#8377;900 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'OFB Sb-based initiator'],
    ['SBM-A2403', 'B24-SBM-003', 'Hyderabad', 'Tata Chemicals', 'Sb 99.7% PET Catalyst', 'Polyester Fiber', '99.7%', '6.69 g/cm3', '&#8377;780 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Reliance PET Sb2O3 cat'],
    ['SBM-A2404', 'B24-SBM-004', 'Chennai', 'Bharat Forge', 'Sb 99.5% Babbitt Bearing Alloy', 'Turbine Journal', '99.5%', '6.69 g/cm3', '&#8377;760 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BHEL Babbitt sleeve bearing'],
    ['SBM-A2405', 'B24-SBM-005', 'Kolkata', 'Shyam Chemicals', 'Sb 99.85% Flame Retardant Synergist', 'Br-Sb Halogen', '99.85%', '6.69 g/cm3', '&#8377;840 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Halogen-free FR textile'],
    ['SBM-A2406', 'B24-SBM-006', 'Noida', 'BHEL R&amp;D', 'Sb 99.8% Semiconductor Diode', 'Infrared Detector', '99.8%', '6.69 g/cm3', '&#8377;800 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO IR detector In-Sb'],
    ['SBM-A2407', 'B24-SBM-007', 'Pune', 'Godrej Chemicals', 'Sb 99.93% Glass Opacifier', 'CRT Television', '99.93%', '6.69 g/cm3', '&#8377;820 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Videocon CRT Sb2O3'],
    ['SBM-A2408', 'B24-SBM-008', 'Jaipur', 'Rajasthan Chemicals', 'Sb 99.0% Cable Sheathing PVC', 'Power Cable', '99.0%', '6.69 g/cm3', '&#8377;640 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'PowerGrid cable Sb2O3'],
    ['SBM-A2409', 'B24-SBM-009', 'Guwahati', 'Assam Chemicals', 'Sb 99.6% ammunition Hardening', 'Small Arms', '99.6%', '6.69 g/cm3', '&#8377;860 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'OFB bullet Pb-Sb core'],
    ['SBM-A2410', 'B24-SBM-010', 'Ahmedabad', 'Gujarat Chemicals', 'Sb 99.95% Type Metal Alloy', 'Precision Casting', '99.95%', '6.69 g/cm3', '&#8377;940 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Printing press type alloy'],
    ['SBM-A2411', 'B24-SBM-011', 'Lucknow', 'UP Chemicals', 'Sb 99.3% Rubber Vulcanization', 'Tyre Compound', '99.3%', '6.69 g/cm3', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'MRF tyre Sb vulcanizer'],
    ['SBM-A2412', 'B24-SBM-012', 'Visakhapatnam', 'Vizag Chemicals', 'Sb 99.8% Submarine Battery Grid', 'Naval SLA Bank', '99.8%', '6.69 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK Pb-Sb battery'],
    ['SBM-A2413', 'B24-SBM-013', 'Balasore', 'DRDO TBRL', 'Sb 99.6% Warship Missile Tracer', 'Pyrotechnic', '99.6%', '6.69 g/cm3', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO BrahMos tracer flare'],
    ['SBM-A2414', 'B24-SBM-014', 'Bhilai', 'SAIL Chemicals', 'Sb 97% General Alloy Hardener', 'Lead Alloy', '97.0%', '6.69 g/cm3', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Pb-Sb sheet roller'],
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


# --- Generate Zinc Dust ---
znd_config = {
    'prefix': 'znd', 'icon': 'ThermometerSun', 'color': '#65a30d',
    'title': 'Zinc Dust Logistics',
    'subtitle': 'Zn galvanizing spray &#8226; Battery anode &#8226; Rubber activator &#8226; Submarine hull CP supply chain',
    'fn_name': 'ZincDustLogisticsView',
}
znd_output = gen_module(znd_records, znd_config)
with open('src/components/modules/zinc-dust-logistics-view.tsx', 'w') as f:
    f.write(znd_output)
print(f"Generated: zinc-dust-logistics-view.tsx ({len(znd_output.splitlines())} lines)")

# --- Generate Antimony Metal ---
sbm_config = {
    'prefix': 'sbm', 'icon': 'Compass', 'color': '#dc2626',
    'title': 'Antimony Metal Logistics',
    'subtitle': 'Sb battery grid &#8226; PET catalyst &#8226; Flame retardant &#8226; Submarine battery supply chain',
    'fn_name': 'AntimonyMetalLogisticsView',
}
sbm_output = gen_module(sbm_records, sbm_config)
with open('src/components/modules/antimony-metal-logistics-view.tsx', 'w') as f:
    f.write(sbm_output)
print(f"Generated: antimony-metal-logistics-view.tsx ({len(sbm_output.splitlines())} lines)")

# --- Verify no : typos ---
for fname in ['src/components/modules/zinc-dust-logistics-view.tsx', 'src/components/modules/antimony-metal-logistics-view.tsx']:
    with open(fname, 'r') as f:
        content = f.read()
    record_section = content[content.find('RECORDS = ['):content.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", record_section)
    if bad:
        print(f"  WARNING: {fname} — {len(bad)} colon typos!")
    else:
        print(f"  OK: {fname} — clean, commas={record_section.count(',')}")
