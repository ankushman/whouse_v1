#!/usr/bin/env python3
"""R444: Samarium Oxide + Gadolinium Oxide clone-and-customize generator."""
import re, os

TEMPLATE = '/home/z/my-project/src/components/modules/zinc-oxide-logistics-view.tsx'
OUT_DIR = '/home/z/my-project/src/components/modules'

MODULES = [
    {
        'slug': 'samarium-oxide',
        'title': 'Samarium Oxide',
        'icon': 'Sparkle',
        'color': '#0f766e',
        'prefix': 'smo',
        'subtitle': 'Sm2O3 SmCo magnet &#8226; Nuclear reactor &#8226; Catalyst &#8226; Optical glass supply chain',
        'var': 'samarium_oxide',
        'func': 'Samarium_OxideLogisticsView',
        'file': 'samarium-oxide-logistics-view.tsx',
        'records': [
            ['SMO-A2401', 'B24-SMO-001', 'Mumbai', 'MIDHANI', 'Sm2O3 99.99% SmCo Magnet', 'Satellite Motor', '99.99%', '2320 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West'],
            ['SMO-A2402', 'B24-SMO-002', 'Bengaluru', 'DRDO DMRL', 'Sm2O3 99.9% Nuclear Absorber', 'Control Rod', '99.9%', '2320 degC', '&#8377;940 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South'],
            ['SMO-A2403', 'B24-SMO-003', 'Hyderabad', 'Tata Advanced Materials', 'Sm2O3 99.7% DeNOx Catalyst', 'Power Plant SCR', '99.7%', '2320 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South'],
            ['SMO-A2404', 'B24-SMO-004', 'Chennai', 'Bharat Forge', 'Sm2O3 99.5% Optical Glass', 'IR Transmit', '99.5%', '2320 degC', '&#8377;900 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South'],
            ['SMO-A2405', 'B24-SMO-005', 'Kolkata', 'Shyam Chemicals', 'Sm2O3 99.3% Ceramic Capacitor', 'Dielectric KPM', '99.3%', '2320 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East'],
            ['SMO-A2406', 'B24-SMO-006', 'Noida', 'BHEL R&amp;D', 'Sm2O3 99.8% MRAM Memory', 'Spintronic', '99.8%', '2320 degC', '&#8377;940 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North'],
            ['SMO-A2407', 'B24-SMO-007', 'Pune', 'Godrej Chemicals', 'Sm2O3 99.0% Carbon Electrode', 'Arc Lamp', '99.0%', '2320 degC', '&#8377;800 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West'],
            ['SMO-A2408', 'B24-SMO-008', 'Jaipur', 'Rajasthan Chemicals', 'Sm2O3 98.5% Paint Pigment', 'Sm Hues', '98.5%', '2320 degC', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North'],
            ['SMO-A2409', 'B24-SMO-009', 'Guwahati', 'Assam Chemicals', 'Sm2O3 99.6% Hydrogen Storage', 'Metal Hydride', '99.6%', '2320 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East'],
            ['SMO-A2410', 'B24-SMO-010', 'Ahmedabad', 'Gujarat Chemicals', 'Sm2O3 99.95% Quantum Dot', 'Display Phosphor', '99.95%', '2320 degC', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West'],
            ['SMO-A2411', 'B24-SMO-011', 'Lucknow', 'UP Chemicals', 'Sm2O3 99.2% Polyethylene Cat', 'PET Polymerize', '99.2%', '2320 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North'],
            ['SMO-A2412', 'B24-SMO-012', 'Visakhapatnam', 'Vizag Chemicals', 'Sm2O3 99.8% Submarine Motor', 'Quiet Drive', '99.8%', '2320 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South'],
            ['SMO-A2413', 'B24-SMO-013', 'Balasore', 'DRDO TBRL', 'Sm2O3 99.4% Missile Guidance', 'Gyro Scope', '99.4%', '2320 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East'],
            ['SMO-A2414', 'B24-SMO-014', 'Bhilai', 'SAIL Chemicals', 'Sm2O3 97% General Chemical', 'Alloy Additive', '97.0%', '2320 degC', '&#8377;640 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East'],
        ],
    },
    {
        'slug': 'gadolinium-oxide',
        'title': 'Gadolinium Oxide',
        'icon': 'Scan',
        'color': '#9333ea',
        'prefix': 'gdo',
        'subtitle': 'Gd2O3 MRI contrast &#8226; Nuclear reactor &#8226; Phosphor &#8226; Optical coating supply chain',
        'var': 'gadolinium_oxide',
        'func': 'Gadolinium_OxideLogisticsView',
        'file': 'gadolinium-oxide-logistics-view.tsx',
        'records': [
            ['GDO-A2401', 'B24-GDO-001', 'Mumbai', 'MIDHANI', 'Gd2O3 99.99% MRI Contrast', 'Gd-DTPA Agent', '99.99%', '2420 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West'],
            ['GDO-A2402', 'B24-GDO-002', 'Bengaluru', 'DRDO DMRL', 'Gd2O3 99.9% Nuclear Shield', 'Neutron Absorber', '99.9%', '2420 degC', '&#8377;940 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South'],
            ['GDO-A2403', 'B24-GDO-003', 'Hyderabad', 'Tata Chemicals', 'Gd2O3 99.7% Green Phosphor', 'X-Ray Intensif', '99.7%', '2420 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South'],
            ['GDO-A2404', 'B24-GDO-004', 'Chennai', 'Bharat Forge', 'Gd2O3 99.5% Optical Coating', 'AR Thin Film', '99.5%', '2420 degC', '&#8377;900 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South'],
            ['GDO-A2405', 'B24-GDO-005', 'Kolkata', 'Shyam Chemicals', 'Gd2O3 99.3% Refractory', 'High-Temp Kiln', '99.3%', '2420 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East'],
            ['GDO-A2406', 'B24-GDO-006', 'Noida', 'BHEL R&amp;D', 'Gd2O3 99.8% Flash Memory', 'Magnetoresist', '99.8%', '2420 degC', '&#8377;940 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North'],
            ['GDO-A2407', 'B24-GDO-007', 'Pune', 'Godrej Chemicals', 'Gd2O3 99.0% Glass Additive', 'UV Cut Filter', '99.0%', '2420 degC', '&#8377;800 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West'],
            ['GDO-A2408', 'B24-GDO-008', 'Jaipur', 'Rajasthan Chemicals', 'Gd2O3 98.5% Ceramic Glaze', 'Opacifier', '98.5%', '2420 degC', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North'],
            ['GDO-A2409', 'B24-GDO-009', 'Guwahati', 'Assam Chemicals', 'Gd2O3 99.6% Scintillator', 'PET Scan Detect', '99.6%', '2420 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East'],
            ['GDO-A2410', 'B24-GDO-010', 'Ahmedabad', 'Gujarat Chemicals', 'Gd2O3 99.95% Submarine Sonar', 'Garnet Crystal', '99.95%', '2420 degC', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West'],
            ['GDO-A2411', 'B24-GDO-011', 'Lucknow', 'UP Chemicals', 'Gd2O3 99.2% Fuel Cell', 'SOFC Electrolyte', '99.2%', '2420 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North'],
            ['GDO-A2412', 'B24-GDO-012', 'Visakhapatnam', 'Vizag Chemicals', 'Gd2O3 99.8% Warship Reactor', 'Neutron Shield', '99.8%', '2420 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South'],
            ['GDO-A2413', 'B24-GDO-013', 'Balasore', 'DRDO TBRL', 'Gd2O3 99.4% Missile Seeker', 'IR Detector', '99.4%', '2420 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East'],
            ['GDO-A2414', 'B24-GDO-014', 'Bhilai', 'SAIL Chemicals', 'Gd2O3 97% General Chemical', 'Alloy Additive', '97.0%', '2420 degC', '&#8377;640 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East'],
        ],
    },
]

def fmt_record(r):
    parts = []
    for v in r:
        s = str(v)
        if s.startswith("'") or s.startswith('"'):
            parts.append(s)
        else:
            parts.append(f"'{s}'")
    return '  [' + ', '.join(parts) + ']'

def generate_module(mod):
    out = os.path.join(OUT_DIR, mod['file'])
    if os.path.exists(out):
        print(f"EXISTS: {out}")
        return
    with open(TEMPLATE) as f:
        content = f.read()

    content = re.sub(r"import \{ \w+ \} from 'lucide-react'", f"import {{ {mod['icon']} }} from 'lucide-react'", content)
    content = re.sub(r'const \w+_RECORDS', f"const {mod['var']}_RECORDS", content)
    rec_block = ',\n'.join(fmt_record(r) for r in mod['records'])
    content = re.sub(r"const \w+_RECORDS = \[.*?\];", f"const {mod['var']}_RECORDS = [\n{rec_block}\n];", content, flags=re.DOTALL)
    content = re.sub(r'export default function \w+', f"export default function {mod['func']}", content)
    content = re.sub(r'return \w+_RECORDS\.filter', f"return {mod['var']}_RECORDS.filter", content)
    content = re.sub(r'<\w+ className="w-5 h-5"', f"<{mod['icon']} className=\"w-5 h-5\"", content)
    content = re.sub(r"color: '[^']+'", f"color: '{mod['color']}'", content)
    content = re.sub(r"color: '[^']+'", f"color: '{mod['color']}'", content)
    content = re.sub(r"backgroundColor: '[^']+'", f"backgroundColor: '{mod['color']}22'", content)
    content = re.sub(r'<h2 className="text-xl font-bold">[^<]+</h2>', f'<h2 className="text-xl font-bold">{mod["title"]} Logistics</h2>', content)
    content = re.sub(r'<p className="text-sm text-gray-400">[^<]+</p>', f'<p className="text-sm text-gray-400">{mod["subtitle"]}</p>', content)

    with open(out, 'w') as f:
        f.write(content)
    print(f"CREATED: {out}")

for mod in MODULES:
    generate_module(mod)
print("Done R444")
