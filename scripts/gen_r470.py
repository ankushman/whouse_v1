#!/usr/bin/env python3
"""R470 Generator: Antimony Trisulfide Logistics + Calcium Fluoride Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Antimony Trisulfide: Sb2S3 ---
# Prefix: ats, Icon: Accessibility, Color: #831843 (pink-dark), MP 550 degC, density 4.64 g/cm3
ats_records = [
    ['ATS-A2401', 'B24-ATS-001', 'Mumbai', 'MIDHANI', 'Sb2S3 99.9% Solar Cell Absorber Layer', 'Thin-Film PV', '99.9%', '550 degC', '&#8377;820 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Tata Power Sb2S3 PV'],
    ['ATS-A2402', 'B24-ATS-002', 'Bengaluru', 'DRDO DMRL', 'Sb2S3 99.95% Warship Infrared Camouflage Paint', 'IR Signature Sup', '99.95%', '550 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'BEL Naval IR camo'],
    ['ATS-A2403', 'B24-ATS-003', 'Hyderabad', 'Tata Chemicals', 'Sb2S3 99.7% Photodetector Photoconductor', 'SWIR Sensor', '99.7%', '550 degC', '&#8377;860 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'IISc Sb2S3 SWIR det'],
    ['ATS-A2404', 'B24-ATS-004', 'Chennai', 'Bharat Forge', 'Sb2S3 99.85% Match Head Friction Ignition', 'Ammunition Primer', '99.85%', '550 degC', '&#8377;800 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'OFB Ordnance Sb2S3'],
    ['ATS-A2405', 'B24-ATS-005', 'Kolkata', 'Shyam Chemicals', 'Sb2S3 99.3% Flame-Retardant Textile Synergist', 'Fire-Resist Coat', '99.3%', '550 degC', '&#8377;740 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Bhilwara FR Sb2S3'],
    ['ATS-A2406', 'B24-ATS-006', 'Noida', 'BHEL R&amp;D', 'Sb2S3 99.8% Submarine Periscope IR Filter', 'EO Mast Imaging', '99.8%', '550 degC', '&#8377;920 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Mazagon Dock Sb2S3 IR'],
    ['ATS-A2407', 'B24-ATS-007', 'Pune', 'Godrej Chemicals', 'Sb2S3 99.0% Safety Match Striker Surface', 'Consumer Goods', '99.0%', '550 degC', '&#8377;680 Cr', 'in-transit', 'low', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Wimco Sb2S3 striker'],
    ['ATS-A2408', 'B24-ATS-008', 'Jaipur', 'Rajasthan Chemicals', 'Sb2S3 99.6% Missile Smoke Screening Canister', 'Obscurant Grenade', '99.6%', '550 degC', '&#8377;880 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'DRDO smoke Sb2S3'],
    ['ATS-A2409', 'B24-ATS-009', 'Guwahati', 'Assam Chemicals', 'Sb2S3 99.92% Cathode Material Solid-State Bat', 'Sulfide Battery', '99.92%', '550 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G Sb2S3 solid-state'],
    ['ATS-A2410', 'B24-ATS-010', 'Ahmedabad', 'Gujarat Chemicals', 'Sb2S3 99.4% TV Camera Tube Target Plate', 'Vidicon Sensor', '99.4%', '550 degC', '&#8377;760 Cr', 'pending', 'medium', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'BEL Optronic Sb2S3'],
    ['ATS-A2411', 'B24-ATS-011', 'Lucknow', 'UP Chemicals', 'Sb2S3 99.8% Brake Lining Friction Modifier', 'Auto Safety Pad', '99.8%', '550 degC', '&#8377;780 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Bosch Sb2S3 brake pad'],
    ['ATS-A2412', 'B24-ATS-012', 'Visakhapatnam', 'Vizag Chemicals', 'Sb2S3 99.85% Submarine Hull Anode Sacrificial', 'Cathodic Protect', '99.85%', '550 degC', '&#8377;900 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK hull anode'],
    ['ATS-A2413', 'B24-ATS-013', 'Balasore', 'DRDO TBRL', 'Sb2S3 99.95% Hypersonic Thermal Imaging Window', 'Mach 7+ IR Dome', '99.95%', '550 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV Sb2S3 IR'],
    ['ATS-A2414', 'B24-ATS-014', 'Bhilai', 'SAIL Chemicals', 'Sb2S3 98.0% General Industrial Grade', 'Process Chemical', '98.0%', '550 degC', '&#8377;520 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Sb2S3 pigment'],
]

# --- Calcium Fluoride: CaF2 ---
# Prefix: caf, Icon: Earth, Color: #155e75 (cyan-steel), MP 1418 degC, density 3.18 g/cm3
caf_records = [
    ['CAF-A2401', 'B24-CAF-001', 'Mumbai', 'MIDHANI', 'CaF2 99.9% Deep-UV Lithography Lens', 'EUV DUV Optic', '99.9%', '1418 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'IISc CaF2 DUV lens'],
    ['CAF-A2402', 'B24-CAF-002', 'Bengaluru', 'DRDO DMRL', 'CaF2 99.95% Excimer Laser Window', 'KrF ArF Optic', '99.95%', '1418 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc excimer CaF2 win'],
    ['CAF-A2403', 'B24-CAF-003', 'Hyderabad', 'Tata Chemicals', 'CaF2 99.7% Submarine Periscope IR Prism', 'Optical Element', '99.7%', '1418 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Mazagon Dock CaF2 prism'],
    ['CAF-A2404', 'B24-CAF-004', 'Chennai', 'Bharat Forge', 'CaF2 99.85% Space Telescope Mirror Substrate', 'Astronomical Optic', '99.85%', '1418 degC', '&#8377;920 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'ISRO CaF2 mirror sub'],
    ['CAF-A2405', 'B24-CAF-005', 'Kolkata', 'Shyam Chemicals', 'CaF2 99.3% Aluminum Smelting Flux Agent', 'Cryolite Additive', '99.3%', '1418 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Hindalco CaF2 flux'],
    ['CAF-A2406', 'B24-CAF-006', 'Noida', 'BHEL R&amp;D', 'CaF2 99.8% Warship Laser Rangefinder Window', 'Naval LIDAR', '99.8%', '1418 degC', '&#8377;920 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BEL Naval CaF2 laser'],
    ['CAF-A2407', 'B24-CAF-007', 'Pune', 'Godrej Chemicals', 'CaF2 99.0% Fluorescent Lamp Phosphor Host', 'UV-Visible Convert', '99.0%', '1418 degC', '&#8377;740 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Surya Roshni CaF2 lamp'],
    ['CAF-A2408', 'B24-CAF-008', 'Jaipur', 'Rajasthan Chemicals', 'CaF2 99.6% Missile Seeker IR Dome Window', 'RF Transparent', '99.6%', '1418 degC', '&#8377;880 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'DRDO Astra CaF2 dome'],
    ['CAF-A2409', 'B24-CAF-009', 'Guwahati', 'Assam Chemicals', 'CaF2 99.92% Nuclear Reactor Fuel Salt Coolant', 'Molten Salt MSR', '99.92%', '1418 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'BARC CaF2 fuel salt'],
    ['CAF-A2410', 'B24-CAF-010', 'Ahmedabad', 'Gujarat Chemicals', 'CaF2 99.4% Optical Fiber Preform Doping', 'Low-Loss Fiber', '99.4%', '1418 degC', '&#8377;820 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Sterlite CaF2 preform'],
    ['CAF-A2411', 'B24-CAF-011', 'Lucknow', 'UP Chemicals', 'CaF2 99.8% Welding Arc Flux Coating', 'Shielding Gas Alt', '99.8%', '1418 degC', '&#8377;780 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'SAIL CaF2 weld flux'],
    ['CAF-A2412', 'B24-CAF-012', 'Visakhapatnam', 'Vizag Chemicals', 'CaF2 99.85% Submarine Sonar Acoustic Window', 'Sound Transparent', '99.85%', '1418 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK sonar win'],
    ['CAF-A2413', 'B24-CAF-013', 'Balasore', 'DRDO TBRL', 'CaF2 99.95% Hypersonic Seeker Thermal Lens', 'Mach 7+ Optic', '99.95%', '1418 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV CaF2 lens'],
    ['CAF-A2414', 'B24-CAF-014', 'Bhilai', 'SAIL Chemicals', 'CaF2 98.0% General Industrial Grade', 'Process Chemical', '98.0%', '1418 degC', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL CaF2 fluorspar'],
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


ats_config = {
    'prefix': 'ats', 'icon': 'Accessibility', 'color': '#831843',
    'title': 'Antimony Trisulfide Logistics',
    'subtitle': 'Sb2S3 solar absorber &#8226; Warship IR camo &#8226; Submarine periscope filter &#8226; Solid-state battery supply chain',
    'fn_name': 'AntimonyTrisulfideLogisticsView',
}
with open('src/components/modules/antimony-trisulfide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(ats_records, ats_config))
print("Generated: antimony-trisulfide-logistics-view.tsx")

caf_config = {
    'prefix': 'caf', 'icon': 'Earth', 'color': '#155e75',
    'title': 'Calcium Fluoride Logistics',
    'subtitle': 'CaF2 DUV lithography &#8226; Excimer laser &#8226; Submarine sonar window &#8226; Nuclear fuel salt supply chain',
    'fn_name': 'CalciumFluorideLogisticsView',
}
with open('src/components/modules/calcium-fluoride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(caf_records, caf_config))
print("Generated: calcium-fluoride-logistics-view.tsx")

for fname in ['src/components/modules/antimony-trisulfide-logistics-view.tsx', 'src/components/modules/calcium-fluoride-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
