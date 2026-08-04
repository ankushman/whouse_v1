#!/usr/bin/env python3
"""R472 Generator: Cadmium Telluride Logistics + Gallium Phosphide Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Cadmium Telluride: CdTe ---
# Prefix: cdt, Icon: ShieldHalf, Color: #d97706 (amber), MP 1092 degC, density 5.85 g/cm3
# CdTe: thin-film PV champion (First Solar), gamma-ray detector, IR window, II-VI semiconductor
cdt_records = [
    ['CDT-A2401', 'B24-CDT-001', 'Mumbai', 'MIDHANI', 'CdTe 99.999% Thin-Film Solar Cell Absorber', 'CdTe/CdS PV Stack', '99.999%', '1092 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Tata Power CdTe PV'],
    ['CDT-A2402', 'B24-CDT-002', 'Bengaluru', 'DRDO DMRL', 'CdTe 99.995% Gamma-Ray Detector Crystal', 'Nuclear Spectroscopy', '99.995%', '1092 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'BARC CdTe gamma det'],
    ['CDT-A2403', 'B24-CDT-003', 'Hyderabad', 'Tata Chemicals', 'CdTe 99.99% High-Pressure IR Window', 'MWIR 8-12 um Optic', '99.99%', '1092 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'DRDO CdTe IR window'],
    ['CDT-A2404', 'B24-CDT-004', 'Chennai', 'Bharat Forge', 'CdTe 99.97% Radiation Dosimeter Chip', 'Personal Dosimetry', '99.97%', '1092 degC', '&#8377;840 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BARC CdTe dosimeter'],
    ['CDT-A2405', 'B24-CDT-005', 'Kolkata', 'Shyam Chemicals', 'CdTe 99.9% Solar Panel Back Contact Foil', 'Thin-Film Electrode', '99.9%', '1092 degC', '&#8377;820 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Tata Power CdTe foil'],
    ['CDT-A2406', 'B24-CDT-006', 'Noida', 'BHEL R&amp;D', 'CdTe 99.98% X-Ray Flat Panel Detector', 'Digital Imaging', '99.98%', '1092 degC', '&#8377;920 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BEL CdTe X-ray panel'],
    ['CDT-A2407', 'B24-CDT-007', 'Pune', 'Godrej Chemicals', 'CdTe 99.5% Electroluminescent Display Layer', 'EL Thin Film', '99.5%', '1092 degC', '&#8377;740 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'BEL Optronic CdTe EL'],
    ['CDT-A2408', 'B24-CDT-008', 'Jaipur', 'Rajasthan Chemicals', 'CdTe 99.8% Nuclear Waste Monitor Crystal', 'Safeguard Scanner', '99.8%', '1092 degC', '&#8377;880 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'DRDO CdTe nuke scan'],
    ['CDT-A2409', 'B24-CDT-009', 'Guwahati', 'Assam Chemicals', 'CdTe 99.96% Photovoltaic Quantum Well Stack', 'Multi-Junction Cell', '99.96%', '1092 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G CdTe QW stack'],
    ['CDT-A2410', 'B24-CDT-010', 'Ahmedabad', 'Gujarat Chemicals', 'CdTe 99.6% Terahertz Emitter Crystal', 'THz Optoelectronic', '99.6%', '1092 degC', '&#8377;860 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'ISRO CdTe THz emit'],
    ['CDT-A2411', 'B24-CDT-011', 'Lucknow', 'UP Chemicals', 'CdTe 99.4% Solar Water Pump Controller', 'Off-Grid PV Pump', '99.4%', '1092 degC', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'BHEL CdTe pump ctrl'],
    ['CDT-A2412', 'B24-CDT-012', 'Visakhapatnam', 'Vizag Chemicals', 'CdTe 99.92% Submarine Radiation Shield Panel', 'Nuclear Sub Shield', '99.92%', '1092 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSN rad panel'],
    ['CDT-A2413', 'B24-CDT-013', 'Balasore', 'DRDO TBRL', 'CdTe 99.995% Hypersonic Reentry Heat Sensor', 'Mach 7+ Thermal Det', '99.995%', '1092 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV CdTe sensor'],
    ['CDT-A2414', 'B24-CDT-014', 'Bhilai', 'SAIL Chemicals', 'CdTe 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '1092 degC', '&#8377;540 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL CdTe industrial'],
]

# --- Gallium Phosphide: GaP ---
# Prefix: gap, Icon: Coffee, Color: #059669 (emerald), MP 1465 degC, density 4.14 g/cm3
# GaP: green/red LED, photodetector, high-temperature electronics, solar cell window,
# radiation-hard semiconductor, III-V compound
gap_records = [
    ['GAP-A2401', 'B24-GAP-001', 'Mumbai', 'MIDHANI', 'GaP 99.9999% Green LED Epitaxial Wafer', 'Visible LED Substrate', '99.9999%', '1465 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'BEL GaP LED wafer'],
    ['GAP-A2402', 'B24-GAP-002', 'Bengaluru', 'DRDO DMRL', 'GaP 99.999% UV Photodetector Element', 'Solar Blind UV Det', '99.999%', '1465 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'DRDO GaP UV det'],
    ['GAP-A2403', 'B24-GAP-003', 'Hyderabad', 'Tata Chemicals', 'GaP 99.99% High-Temperature Power IC', 'Rad-Hard Power IC', '99.99%', '1465 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'ISRO GaP power IC'],
    ['GAP-A2404', 'B24-GAP-004', 'Chennai', 'Bharat Forge', 'GaP 99.97% Multi-Chip LED Array', 'Display Backlight', '99.97%', '1465 degC', '&#8377;840 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BEL GaP LED array'],
    ['GAP-A2405', 'B24-GAP-005', 'Kolkata', 'Shyam Chemicals', 'GaP 99.9% Nitrogen-Doped Green Emitter', 'GaP:N LED Grade', '99.9%', '1465 degC', '&#8377;820 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'BEL GaP:N indicator'],
    ['GAP-A2406', 'B24-GAP-006', 'Noida', 'BHEL R&amp;D', 'GaP 99.995% Missile Seeker IR Photodiode', 'Homing Sensor', '99.995%', '1465 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO Astra GaP det'],
    ['GAP-A2407', 'B24-GAP-007', 'Pune', 'Godrej Chemicals', 'GaP 99.5% Light-Emitting Diode Lamp Grade', 'General LED Phosphor', '99.5%', '1465 degC', '&#8377;740 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Bajaj GaP LED lamp'],
    ['GAP-A2408', 'B24-GAP-008', 'Jaipur', 'Rajasthan Chemicals', 'GaP 99.98% Space Solar Cell Window Layer', 'Radiation Tolerant PV', '99.98%', '1465 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'ISRO GaP space PV'],
    ['GAP-A2409', 'B24-GAP-009', 'Guwahati', 'Assam Chemicals', 'GaP 99.999% Thermoelectric Cooler Substrate', 'Peltier Junction', '99.999%', '1465 degC', '&#8377;880 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G GaP Peltier'],
    ['GAP-A2410', 'B24-GAP-010', 'Ahmedabad', 'Gujarat Chemicals', 'GaP 99.6% Optoisolator Coupling Element', 'Signal Isolation', '99.6%', '1465 degC', '&#8377;820 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'BEL GaP optoisolator'],
    ['GAP-A2411', 'B24-GAP-011', 'Lucknow', 'UP Chemicals', 'GaP 99.4% Atomic Clock Frequency Standard', 'Precision Timing', '99.4%', '1465 degC', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'ISRO GaP clock std'],
    ['GAP-A2412', 'B24-GAP-012', 'Visakhapatnam', 'Vizag Chemicals', 'GaP 99.97% Submarine Periscope LED Illuminator', 'EO Mast Light', '99.97%', '1465 degC', '&#8377;920 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK LED illum'],
    ['GAP-A2413', 'B24-GAP-013', 'Balasore', 'DRDO TBRL', 'GaP 99.999% Hypersonic Surface Temperature Sensor', 'Mach 7+ Pyrometer', '99.999%', '1465 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV GaP pyro'],
    ['GAP-A2414', 'B24-GAP-014', 'Bhilai', 'SAIL Chemicals', 'GaP 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '1465 degC', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL GaP industrial'],
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


cdt_config = {
    'prefix': 'cdt', 'icon': 'ShieldHalf', 'color': '#d97706',
    'title': 'Cadmium Telluride Logistics',
    'subtitle': 'CdTe thin-film PV champion &#8226; Gamma-ray detector &#8226; X-ray flat panel &#8226; Nuclear shield supply chain',
    'fn_name': 'CadmiumTellurideLogisticsView',
}
with open('src/components/modules/cadmium-telluride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(cdt_records, cdt_config))
print("Generated: cadmium-telluride-logistics-view.tsx")

gap_config = {
    'prefix': 'gap', 'icon': 'Coffee', 'color': '#059669',
    'title': 'Gallium Phosphide Logistics',
    'subtitle': 'GaP green LED wafer &#8226; UV photodetector &#8226; Space solar cell &#8226; Radiation-hard IC supply chain',
    'fn_name': 'GalliumPhosphideLogisticsView',
}
with open('src/components/modules/gallium-phosphide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(gap_records, gap_config))
print("Generated: gallium-phosphide-logistics-view.tsx")

for fname in ['src/components/modules/cadmium-telluride-logistics-view.tsx', 'src/components/modules/gallium-phosphide-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
