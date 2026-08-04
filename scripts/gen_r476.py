#!/usr/bin/env python3
"""R476 Generator: Barium Fluoride Logistics + Cerium Fluoride Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Barium Fluoride: BaF2 ---
# Prefix: baf, Icon: Space, Color: #6d28d9 (violet-dark), MP 1368 degC, density 4.89 g/cm3
# BaF2: fast scintillator (sub-ns), EUV lithography optic, IR transparent window,
# optical coating, flux for metallurgy, neutron detection crystal
baf_records = [
    ['BAF-A2401', 'B24-BAF-001', 'Mumbai', 'MIDHANI', 'BaF2 99.99% Fast Scintillation Detector Crystal', 'Sub-ns Timing', '99.99%', '1368 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'BARC BaF2 scintillator'],
    ['BAF-A2402', 'B24-BAF-002', 'Bengaluru', 'DRDO DMRL', 'BaF2 99.999% EUV Lithography Multilayer Optic', '13.5 nm EUV Refl', '99.999%', '1368 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc BaF2 EUV optic'],
    ['BAF-A2403', 'B24-BAF-003', 'Hyderabad', 'Tata Chemicals', 'BaF2 99.95% IR Transparent Optical Window', '0.15-12 um Range', '99.95%', '1368 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'DRDO BaF2 IR window'],
    ['BAF-A2404', 'B24-BAF-004', 'Chennai', 'Bharat Forge', 'BaF2 99.9% Anti-Reflective Optical Coating', 'UV-Vis-IR AR', '99.9%', '1368 degC', '&#8377;860 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'ISRO BaF2 AR coat'],
    ['BAF-A2405', 'B24-BAF-005', 'Kolkata', 'Shyam Chemicals', 'BaF2 99.7% Aluminum Smelting Flux Additive', 'Cryolite Enhancer', '99.7%', '1368 degC', '&#8377;780 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Hindalco BaF2 flux'],
    ['BAF-A2406', 'B24-BAF-006', 'Noida', 'BHEL R&amp;D', 'BaF2 99.98% Missile Seeker IR Window', 'Dual-Band RF-IR', '99.98%', '1368 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO Astra BaF2 win'],
    ['BAF-A2407', 'B24-BAF-007', 'Pune', 'Godrej Chemicals', 'BaF2 99.5% Glass Additive for Refractive Index', 'Optical Glass Crown', '99.5%', '1368 degC', '&#8377;740 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'BEL BaF2 optical glass'],
    ['BAF-A2408', 'B24-BAF-008', 'Jaipur', 'Rajasthan Chemicals', 'BaF2 99.85% Neutron Detection Crystal Array', 'He-3 Alternative', '99.85%', '1368 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'BARC BaF2 neutron'],
    ['BAF-A2409', 'B24-BAF-009', 'Guwahati', 'Assam Chemicals', 'BaF2 99.99% High-Energy Physics Calorimeter', 'EM Shower Detect', '99.99%', '1368 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G BaF2 calorimeter'],
    ['BAF-A2410', 'B24-BAF-010', 'Ahmedabad', 'Gujarat Chemicals', 'BaF2 99.6% Welding Electrode Flux Core', 'Submerged Arc Flux', '99.6%', '1368 degC', '&#8377;820 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'SAIL BaF2 weld flux'],
    ['BAF-A2411', 'B24-BAF-011', 'Lucknow', 'UP Chemicals', 'BaF2 99.4% Dental X-Ray Image Plate', 'Phosphor Storage', '99.4%', '1368 degC', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'BEL BaF2 dental plate'],
    ['BAF-A2412', 'B24-BAF-012', 'Visakhapatnam', 'Vizag Chemicals', 'BaF2 99.92% Submarine Periscope UV-NIR Lens', 'EO Mast Multi-Band', '99.92%', '1368 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK pers lens'],
    ['BAF-A2413', 'B24-BAF-013', 'Balasore', 'DRDO TBRL', 'BaF2 99.99% Hypersonic Telemetry Optical Port', 'Mach 7+ Data Link', '99.99%', '1368 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV BaF2 port'],
    ['BAF-A2414', 'B24-BAF-014', 'Bhilai', 'SAIL Chemicals', 'BaF2 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '1368 degC', '&#8377;520 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL BaF2 industrial'],
]

# --- Cerium Fluoride: CeF3 ---
# Prefix: cef, Icon: Clover, Color: #b45309 (amber-dark), MP 1460 degC, density 6.16 g/cm3
# CeF3: gamma-ray scintillator, UV transparent optic, glass polish compound,
# optical fiber dopant, automotive catalytic converter washcoat, carbon arc lamp
cef_records = [
    ['CEF-A2401', 'B24-CEF-001', 'Mumbai', 'MIDHANI', 'CeF3 99.99% Gamma-Ray Scintillator Crystal', 'PET Scanner Det', '99.99%', '1460 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'BARC CeF3 gamma scint'],
    ['CEF-A2402', 'B24-CEF-002', 'Bengaluru', 'DRDO DMRL', 'CeF3 99.999% Deep-UV Transparent Optical Window', '180-300 nm UV', '99.999%', '1460 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc CeF3 UV window'],
    ['CEF-A2403', 'B24-CEF-003', 'Hyderabad', 'Tata Chemicals', 'CeF3 99.95% High-Precision Glass Polish Compound', 'Sub-nm Finish CMP', '99.95%', '1460 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'BEL CeF3 polish'],
    ['CEF-A2404', 'B24-CEF-004', 'Chennai', 'Bharat Forge', 'CeF3 99.9% Optical Fiber Doping Agent', 'Low-Loss Fluorozirconate', '99.9%', '1460 degC', '&#8377;860 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Sterlite CeF3 fiber dopant'],
    ['CEF-A2405', 'B24-CEF-005', 'Kolkata', 'Shyam Chemicals', 'CeF3 99.7% Automotive Catalytic Washcoat', 'Diesel Emission Cat', '99.7%', '1460 degC', '&#8377;800 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Bajaj CeF3 catalytic'],
    ['CEF-A2406', 'B24-CEF-006', 'Noida', 'BHEL R&amp;D', 'CeF3 99.98% Missile Seeker Optical Filter', 'Solar-Blind UV Cut', '99.98%', '1460 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO CeF3 UV filter'],
    ['CEF-A2407', 'B24-CEF-007', 'Pune', 'Godrej Chemicals', 'CeF3 99.5% Carbon Arc Lamp Electrode Additive', 'Cinema Projection', '99.5%', '1460 degC', '&#8377;740 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Surya Roshni CeF3 arc'],
    ['CEF-A2408', 'B24-CEF-008', 'Jaipur', 'Rajasthan Chemicals', 'CeF3 99.85% Nuclear Reactor Control Rod Poison', 'Neutron Absorber', '99.85%', '1460 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'BARC CeF3 ctrl poison'],
    ['CEF-A2409', 'B24-CEF-009', 'Guwahati', 'Assam Chemicals', 'CeF3 99.99% High-Resolution Gamma Spectrometer', 'HPGe Alternative', '99.99%', '1460 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G CeF3 gamma spec'],
    ['CEF-A2410', 'B24-CEF-010', 'Ahmedabad', 'Gujarat Chemicals', 'CeF3 99.6% Self-Cleaning Glass Coating', 'Photocatalytic CeO2', '99.6%', '1460 degC', '&#8377;820 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Saint-Gobain CeF3 coat'],
    ['CEF-A2411', 'B24-CEF-011', 'Lucknow', 'UP Chemicals', 'CeF3 99.4% Welding Flux Rare-Earth Additive', 'Arc Stability RE', '99.4%', '1460 degC', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'SAIL CeF3 weld RE'],
    ['CEF-A2412', 'B24-CEF-012', 'Visakhapatnam', 'Vizag Chemicals', 'CeF3 99.92% Submarine Hull Anti-Fouling Paint', 'Biofouling Prevent', '99.92%', '1460 degC', '&#8377;900 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK hull paint'],
    ['CEF-A2413', 'B24-CEF-013', 'Balasore', 'DRDO TBRL', 'CeF3 99.99% Hypersonic Engine Thermal Barrier', 'Mach 7+ TBC Coat', '99.99%', '1460 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV CeF3 TBC'],
    ['CEF-A2414', 'B24-CEF-014', 'Bhilai', 'SAIL Chemicals', 'CeF3 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '1460 degC', '&#8377;540 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL CeF3 industrial'],
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


baf_config = {
    'prefix': 'baf', 'icon': 'Space', 'color': '#6d28d9',
    'title': 'Barium Fluoride Logistics',
    'subtitle': 'BaF2 fast scintillator &#8226; EUV lithography optic &#8226; IR transparent window &#8226; Neutron detection supply chain',
    'fn_name': 'BariumFluorideLogisticsView',
}
with open('src/components/modules/barium-fluoride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(baf_records, baf_config))
print("Generated: barium-fluoride-logistics-view.tsx")

cef_config = {
    'prefix': 'cef', 'icon': 'Clover', 'color': '#b45309',
    'title': 'Cerium Fluoride Logistics',
    'subtitle': 'CeF3 gamma scintillator &#8226; UV transparent optic &#8226; Glass polish &#8226; Catalytic washcoat supply chain',
    'fn_name': 'CeriumFluorideLogisticsView',
}
with open('src/components/modules/cerium-fluoride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(cef_records, cef_config))
print("Generated: cerium-fluoride-logistics-view.tsx")

for fname in ['src/components/modules/barium-fluoride-logistics-view.tsx', 'src/components/modules/cerium-fluoride-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
