#!/usr/bin/env python3
"""R443: Neodymium Oxide + Praseodymium Oxide clone-and-customize generator."""
import re, os

TEMPLATE = '/home/z/my-project/src/components/modules/zinc-oxide-logistics-view.tsx'
OUT_DIR = '/home/z/my-project/src/components/modules'

MODULES = [
    {
        'slug': 'neodymium-oxide',
        'title': 'Neodymium Oxide',
        'icon': 'Hexagon',
        'color': '#0369a1',
        'prefix': 'ndo',
        'subtitle': 'Nd2O3 NdFeB magnet &#8226; Laser crystal &#8226; Catalyst &#8226; Glass colorant supply chain',
        'var': 'neodymium_oxide',
        'func': 'Neodymium_OxideLogisticsView',
        'file': 'neodymium-oxide-logistics-view.tsx',
        'records': [
            ['NDO-A2401', 'B24-NDO-001', 'Mumbai', 'MIDHANI', 'Nd2O3 99.99% NdFeB Magnet', 'EV Motor', '99.99%', '2215 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West'],
            ['NDO-A2402', 'B24-NDO-002', 'Bengaluru', 'DRDO DMRL', 'Nd2O3 99.9% Nd:YAG Laser', 'Medical Laser', '99.9%', '2215 degC', '&#8377;940 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South'],
            ['NDO-A2403', 'B24-NDO-003', 'Hyderabad', 'Tata Advanced Materials', 'Nd2O3 99.7% Petroleum Cracking', 'FCC Catalyst', '99.7%', '2215 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South'],
            ['NDO-A2404', 'B24-NDO-004', 'Chennai', 'Bharat Forge', 'Nd2O3 99.5% Glass Colorant', 'Purple Tint', '99.5%', '2215 degC', '&#8377;900 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South'],
            ['NDO-A2405', 'B24-NDO-005', 'Kolkata', 'Shyam Chemicals', 'Nd2O3 99.3% Dielectric Ceramic', 'Capacitor KLM', '99.3%', '2215 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East'],
            ['NDO-A2406', 'B24-NDO-006', 'Noida', 'BHEL R&amp;D', 'Nd2O3 99.8% Wind Turbine Gen', 'Permanent Mag', '99.8%', '2215 degC', '&#8377;940 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North'],
            ['NDO-A2407', 'B24-NDO-007', 'Pune', 'Godrej Chemicals', 'Nd2O3 99.0% Headphone Driver', 'Neodymium SPK', '99.0%', '2215 degC', '&#8377;800 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West'],
            ['NDO-A2408', 'B24-NDO-008', 'Jaipur', 'Rajasthan Chemicals', 'Nd2O3 98.5% Glaze Enamel', 'Art Ceramic', '98.5%', '2215 degC', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North'],
            ['NDO-A2409', 'B24-NDO-009', 'Guwahati', 'Assam Chemicals', 'Nd2O3 99.6% MRI Contrast', 'Gd-DTPA Prep', '99.6%', '2215 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East'],
            ['NDO-A2410', 'B24-NDO-010', 'Ahmedabad', 'Gujarat Chemicals', 'Nd2O3 99.95% Drone Motor', 'UAV BLDC', '99.95%', '2215 degC', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West'],
            ['NDO-A2411', 'B24-NDO-011', 'Lucknow', 'UP Chemicals', 'Nd2O3 99.2% Spark Plug', 'Ignition Electrode', '99.2%', '2215 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North'],
            ['NDO-A2412', 'B24-NDO-012', 'Visakhapatnam', 'Vizag Chemicals', 'Nd2O3 99.8% Submarine Motor', 'Torpedo Drive', '99.8%', '2215 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South'],
            ['NDO-A2413', 'B24-NDO-013', 'Balasore', 'DRDO TBRL', 'Nd2O3 99.4% Missile Actuator', 'Fin Control', '99.4%', '2215 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East'],
            ['NDO-A2414', 'B24-NDO-014', 'Bhilai', 'SAIL Chemicals', 'Nd2O3 97% General Chemical', 'Alloy Additive', '97.0%', '2215 degC', '&#8377;640 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East'],
        ],
    },
    {
        'slug': 'praseodymium-oxide',
        'title': 'Praseodymium Oxide',
        'icon': 'Dumbbell',
        'color': '#65a30d',
        'prefix': 'pro',
        'subtitle': 'Pr6O11 aircraft alloy &#8226; Ceramic glaze &#8226; Glass polish &#8226; Carbon arc electrode supply chain',
        'var': 'praseodymium_oxide',
        'func': 'Praseodymium_OxideLogisticsView',
        'file': 'praseodymium-oxide-logistics-view.tsx',
        'records': [
            ['PRO-A2401', 'B24-PRO-001', 'Mumbai', 'MIDHANI', 'Pr6O11 99.9% Aircraft Alloy', 'Jet Engine Fan', '99.9%', '2200 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West'],
            ['PRO-A2402', 'B24-PRO-002', 'Bengaluru', 'DRDO DMRL', 'Pr6O11 99.7% Ceramic Glaze', 'Yellow Tint', '99.7%', '2200 degC', '&#8377;920 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South'],
            ['PRO-A2403', 'B24-PRO-003', 'Hyderabad', 'Tata Chemicals', 'Pr6O11 99.5% Glass Polish', 'Optical Grade', '99.5%', '2200 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South'],
            ['PRO-A2404', 'B24-PRO-004', 'Chennai', 'Bharat Forge', 'Pr6O11 99.0% Carbon Arc', 'Searchlight Electrode', '99.0%', '2200 degC', '&#8377;880 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South'],
            ['PRO-A2405', 'B24-PRO-005', 'Kolkata', 'Shyam Chemicals', 'Pr6O11 99.3% Eyeglass Lens', 'Photochromic', '99.3%', '2200 degC', '&#8377;860 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East'],
            ['PRO-A2406', 'B24-PRO-006', 'Noida', 'BHEL R&amp;D', 'Pr6O11 99.8% Denture Ceramic', 'Dental Prosthetic', '99.8%', '2200 degC', '&#8377;920 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North'],
            ['PRO-A2407', 'B24-PRO-007', 'Pune', 'Godrej Chemicals', 'Pr6O11 99.0% Fiber Optic', 'Signal Amplifier', '99.0%', '2200 degC', '&#8377;800 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West'],
            ['PRO-A2408', 'B24-PRO-008', 'Jaipur', 'Rajasthan Chemicals', 'Pr6O11 98.5% Pigment', 'Praseodymium Yellow', '98.5%', '2200 degC', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North'],
            ['PRO-A2409', 'B24-PRO-009', 'Guwahati', 'Assam Chemicals', 'Pr6O11 99.6% Enamel Frit', 'Vitreous Coating', '99.6%', '2200 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East'],
            ['PRO-A2410', 'B24-PRO-010', 'Ahmedabad', 'Gujarat Chemicals', 'Pr6O11 99.95% Permanet Mag', 'PrCo5 Alloy', '99.95%', '2200 degC', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West'],
            ['PRO-A2411', 'B24-PRO-011', 'Lucknow', 'UP Chemicals', 'Pr6O11 99.2% Crack Catalyst', 'Petroleum Refine', '99.2%', '2200 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North'],
            ['PRO-A2412', 'B24-PRO-012', 'Visakhapatnam', 'Vizag Chemicals', 'Pr6O11 99.8% Submarine Hull', 'Sonar Dome Coating', '99.8%', '2200 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South'],
            ['PRO-A2413', 'B24-PRO-013', 'Balasore', 'DRDO TBRL', 'Pr6O11 99.4% Missile Fuselage', 'Al-Mg-Pr Alloy', '99.4%', '2200 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East'],
            ['PRO-A2414', 'B24-PRO-014', 'Bhilai', 'SAIL Chemicals', 'Pr6O11 97% General Chemical', 'Alloy Additive', '97.0%', '2200 degC', '&#8377;640 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East'],
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
print("Done R443")
