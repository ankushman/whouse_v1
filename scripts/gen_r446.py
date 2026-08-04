#!/usr/bin/env python3
"""R446: Dysprosium Oxide + Holmium Oxide clone-and-customize generator."""
import re, os

TEMPLATE = '/home/z/my-project/src/components/modules/zinc-oxide-logistics-view.tsx'
OUT_DIR = '/home/z/my-project/src/components/modules'

MODULES = [
    {
        'slug': 'dysprosium-oxide',
        'title': 'Dysprosium Oxide',
        'icon': 'Waves',
        'color': '#7c2d12',
        'prefix': 'dyo',
        'subtitle': 'Dy2O3 NdFeB additive &#8226; Nuclear reactor &#8226; Data storage &#8226; Laser material supply chain',
        'var': 'dysprosium_oxide',
        'func': 'Dysprosium_OxideLogisticsView',
        'file': 'dysprosium-oxide-logistics-view.tsx',
        'records': [
            ['DYO-A2401', 'B24-DYO-001', 'Mumbai', 'MIDHANI', 'Dy2O3 99.99% NdFeB Additive', 'EV Motor Mag', '99.99%', '2340 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West'],
            ['DYO-A2402', 'B24-DYO-002', 'Bengaluru', 'DRDO DMRL', 'Dy2O3 99.9% Nuclear Control', 'Neutron Absorb', '99.9%', '2340 degC', '&#8377;940 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South'],
            ['DYO-A2403', 'B24-DYO-003', 'Hyderabad', 'Tata Advanced Materials', 'Dy2O3 99.7% Hard Disk Mag', 'HDD Perp Rec', '99.7%', '2340 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South'],
            ['DYO-A2404', 'B24-DYO-004', 'Chennai', 'Bharat Forge', 'Dy2O3 99.5% Magneto-Strict', 'Sonar Transduce', '99.5%', '2340 degC', '&#8377;900 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South'],
            ['DYO-A2405', 'B24-DYO-005', 'Kolkata', 'Shyam Chemicals', 'Dy2O3 99.3% Ceramic Glaze', 'Yellow Tint', '99.3%', '2340 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East'],
            ['DYO-A2406', 'B24-DYO-006', 'Noida', 'BHEL R&amp;D', 'Dy2O3 99.8% Terfenol-D Alloy', 'Vibration Sensor', '99.8%', '2340 degC', '&#8377;940 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North'],
            ['DYO-A2407', 'B24-DYO-007', 'Pune', 'Godrej Chemicals', 'Dy2O3 99.0% Glass Additive', 'Refractive Mod', '99.0%', '2340 degC', '&#8377;800 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West'],
            ['DYO-A2408', 'B24-DYO-008', 'Jaipur', 'Rajasthan Chemicals', 'Dy2O3 98.5% Halide Lamp', 'Metal Halide', '98.5%', '2340 degC', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North'],
            ['DYO-A2409', 'B24-DYO-009', 'Guwahati', 'Assam Chemicals', 'Dy2O3 99.6% Wind Gen Mag', 'Direct Drive', '99.6%', '2340 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East'],
            ['DYO-A2410', 'B24-DYO-010', 'Ahmedabad', 'Gujarat Chemicals', 'Dy2O3 99.95% Drone Motor', 'UAV High-Temp', '99.95%', '2340 degC', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West'],
            ['DYO-A2411', 'B24-DYO-011', 'Lucknow', 'UP Chemicals', 'Dy2O3 99.2% MRI Contrast', 'T2* Agent', '99.2%', '2340 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North'],
            ['DYO-A2412', 'B24-DYO-012', 'Visakhapatnam', 'Vizag Chemicals', 'Dy2O3 99.8% Submarine Stealth', 'Mag Anomaly Coat', '99.8%', '2340 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South'],
            ['DYO-A2413', 'B24-DYO-013', 'Balasore', 'DRDO TBRL', 'Dy2O3 99.4% Missile Gyro', 'Inertial Sensor', '99.4%', '2340 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East'],
            ['DYO-A2414', 'B24-DYO-014', 'Bhilai', 'SAIL Chemicals', 'Dy2O3 97% General Chemical', 'Alloy Additive', '97.0%', '2340 degC', '&#8377;640 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East'],
        ],
    },
    {
        'slug': 'holmium-oxide',
        'title': 'Holmium Oxide',
        'icon': 'Crosshair',
        'color': '#b45309',
        'prefix': 'hoo',
        'subtitle': 'Ho2O3 laser rod &#8226; Magnetic pole &#8226; Nuclear control &#8226; Fiber optic supply chain',
        'var': 'holmium_oxide',
        'func': 'Holmium_OxideLogisticsView',
        'file': 'holmium-oxide-logistics-view.tsx',
        'records': [
            ['HOO-A2401', 'B24-HOO-001', 'Mumbai', 'MIDHANI', 'Ho2O3 99.99% Laser Rod', 'Holmium YAG', '99.99%', '2415 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West'],
            ['HOO-A2402', 'B24-HOO-002', 'Bengaluru', 'DRDO DMRL', 'Ho2O3 99.9% Magnetic Pole', 'MRI Pole Tip', '99.9%', '2415 degC', '&#8377;940 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South'],
            ['HOO-A2403', 'B24-HOO-003', 'Hyderabad', 'Tata Chemicals', 'Ho2O3 99.7% Nuclear Absorber', 'Control Rod', '99.7%', '2415 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South'],
            ['HOO-A2404', 'B24-HOO-004', 'Chennai', 'Bharat Forge', 'Ho2O3 99.5% Fiber Optic', 'EDFA Amplif', '99.5%', '2415 degC', '&#8377;900 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South'],
            ['HOO-A2405', 'B24-HOO-005', 'Kolkata', 'Shyam Chemicals', 'Ho2O3 99.3% Ceramic Capacitor', 'Dielectric KHo', '99.3%', '2415 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East'],
            ['HOO-A2406', 'B24-HOO-006', 'Noida', 'BHEL R&amp;D', 'Ho2O3 99.8% Medical Laser', 'Surgery Ho:YAG', '99.8%', '2415 degC', '&#8377;940 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North'],
            ['HOO-A2407', 'B24-HOO-007', 'Pune', 'Godrej Chemicals', 'Ho2O3 99.0% Glass Colorant', 'Yellow-Green', '99.0%', '2415 degC', '&#8377;800 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West'],
            ['HOO-A2408', 'B24-HOO-008', 'Jaipur', 'Rajasthan Chemicals', 'Ho2O3 98.5% Glaze Pigment', 'Art Ceramic', '98.5%', '2415 degC', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North'],
            ['HOO-A2409', 'B24-HOO-009', 'Guwahati', 'Assam Chemicals', 'Ho2O3 99.6% Laser Range', 'LIDAR Target', '99.6%', '2415 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East'],
            ['HOO-A2410', 'B24-HOO-010', 'Ahmedabad', 'Gujarat Chemicals', 'Ho2O3 99.95% Submarine LIDAR', 'Depth Sounder', '99.95%', '2415 degC', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West'],
            ['HOO-A2411', 'B24-HOO-011', 'Lucknow', 'UP Chemicals', 'Ho2O3 99.2% Flux Crystal', 'Czochralski', '99.2%', '2415 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North'],
            ['HOO-A2412', 'B24-HOO-012', 'Visakhapatnam', 'Vizag Chemicals', 'Ho2O3 99.8% Warship Mag', 'Pole Piece Shield', '99.8%', '2415 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South'],
            ['HOO-A2413', 'B24-HOO-013', 'Balasore', 'DRDO TBRL', 'Ho2O3 99.4% Missile Seeker', 'Laser Target', '99.4%', '2415 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East'],
            ['HOO-A2414', 'B24-HOO-014', 'Bhilai', 'SAIL Chemicals', 'Ho2O3 97% General Chemical', 'Alloy Additive', '97.0%', '2415 degC', '&#8377;640 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East'],
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
print("Done R446")
