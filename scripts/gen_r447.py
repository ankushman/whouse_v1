#!/usr/bin/env python3
"""R447: Erbium Oxide + Ytterbium Oxide clone-and-customize generator."""
import re, os

TEMPLATE = '/home/z/my-project/src/components/modules/zinc-oxide-logistics-view.tsx'
OUT_DIR = '/home/z/my-project/src/components/modules'

MODULES = [
    {
        'slug': 'erbium-oxide',
        'title': 'Erbium Oxide',
        'icon': 'Radio',
        'color': '#be123c',
        'prefix': 'ero',
        'subtitle': 'Er2O3 fiber amplifier &#8226; Laser rod &#8226; Glass colorant &#8226; Nuclear tech supply chain',
        'var': 'erbium_oxide',
        'func': 'Erbium_OxideLogisticsView',
        'file': 'erbium-oxide-logistics-view.tsx',
        'records': [
            ['ERO-A2401', 'B24-ERO-001', 'Mumbai', 'MIDHANI', 'Er2O3 99.99% EDFA Amplifier', 'Fiber Optic Repeater', '99.99%', '2387 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West'],
            ['ERO-A2402', 'B24-ERO-002', 'Bengaluru', 'DRDO DMRL', 'Er2O3 99.9% Er:Glass Laser', 'Eye-Safe 1.5um', '99.9%', '2387 degC', '&#8377;940 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South'],
            ['ERO-A2403', 'B24-ERO-003', 'Hyderabad', 'Tata Chemicals', 'Er2O3 99.7% Optical Amplifier', 'DWDM Channel', '99.7%', '2387 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South'],
            ['ERO-A2404', 'B24-ERO-004', 'Chennai', 'Bharat Forge', 'Er2O3 99.5% Upconversion Phosphor', 'Green Emission', '99.5%', '2387 degC', '&#8377;900 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South'],
            ['ERO-A2405', 'B24-ERO-005', 'Kolkata', 'Shyam Chemicals', 'Er2O3 99.3% Pink Glass Colorant', 'Art Glass Tint', '99.3%', '2387 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East'],
            ['ERO-A2406', 'B24-ERO-006', 'Noida', 'BHEL R&amp;D', 'Er2O3 99.8% Telecom Amplifier', 'C-Band EDFA', '99.8%', '2387 degC', '&#8377;940 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North'],
            ['ERO-A2407', 'B24-ERO-007', 'Pune', 'Godrej Chemicals', 'Er2O3 99.0% Crystal Substrate', 'Er-doped YAG', '99.0%', '2387 degC', '&#8377;800 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West'],
            ['ERO-A2408', 'B24-ERO-008', 'Jaipur', 'Rajasthan Chemicals', 'Er2O3 98.5% Ceramic Glaze', 'Pink Hue', '98.5%', '2387 degC', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North'],
            ['ERO-A2409', 'B24-ERO-009', 'Guwahati', 'Assam Chemicals', 'Er2O3 99.6% Laser Range', 'Range Finder', '99.6%', '2387 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East'],
            ['ERO-A2410', 'B24-ERO-010', 'Ahmedabad', 'Gujarat Chemicals', 'Er2O3 99.95% Submarine Comms', 'Undersea EDFA', '99.95%', '2387 degC', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West'],
            ['ERO-A2411', 'B24-ERO-011', 'Lucknow', 'UP Chemicals', 'Er2O3 99.2% Photo-Catalyst', 'UV Degrade', '99.2%', '2387 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North'],
            ['ERO-A2412', 'B24-ERO-012', 'Visakhapatnam', 'Vizag Chemicals', 'Er2O3 99.8% Warship EW Suite', 'Signal Amplifier', '99.8%', '2387 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South'],
            ['ERO-A2413', 'B24-ERO-013', 'Balasore', 'DRDO TBRL', 'Er2O3 99.4% Missile Comm', 'Er:YAG Link', '99.4%', '2387 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East'],
            ['ERO-A2414', 'B24-ERO-014', 'Bhilai', 'SAIL Chemicals', 'Er2O3 97% General Chemical', 'Alloy Additive', '97.0%', '2387 degC', '&#8377;640 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East'],
        ],
    },
    {
        'slug': 'ytterbium-oxide',
        'title': 'Ytterbium Oxide',
        'icon': 'Cpu',
        'color': '#1e40af',
        'prefix': 'ybo',
        'subtitle': 'Yb2O3 laser medium &#8226; Quantum memory &#8226; Steel alloy &#8226; Nuclear monitor supply chain',
        'var': 'ytterbium_oxide',
        'func': 'Ytterbium_OxideLogisticsView',
        'file': 'ytterbium-oxide-logistics-view.tsx',
        'records': [
            ['YBO-A2401', 'B24-YBO-001', 'Mumbai', 'MIDHANI', 'Yb2O3 99.99% Yb:YAG Laser', 'High Power CW', '99.99%', '2377 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West'],
            ['YBO-A2402', 'B24-YBO-002', 'Bengaluru', 'DRDO DMRL', 'Yb2O3 99.9% Quantum Memory', 'Qubit Storage', '99.9%', '2377 degC', '&#8377;940 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South'],
            ['YBO-A2403', 'B24-YBO-003', 'Hyderabad', 'Tata Chemicals', 'Yb2O3 99.7% Stainless Steel', 'Grain Refiner', '99.7%', '2377 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South'],
            ['YBO-A2404', 'B24-YBO-004', 'Chennai', 'Bharat Forge', 'Yb2O3 99.5% Dental Ceramic', 'Zirconia Add', '99.5%', '2377 degC', '&#8377;900 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South'],
            ['YBO-A2405', 'B24-YBO-005', 'Kolkata', 'Shyam Chemicals', 'Yb2O3 99.3% Crystal Flux', 'Sapphire Growth', '99.3%', '2377 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East'],
            ['YBO-A2406', 'B24-YBO-006', 'Noida', 'BHEL R&amp;D', 'Yb2O3 99.8% Solar Cell', 'Perovskite Boost', '99.8%', '2377 degC', '&#8377;940 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North'],
            ['YBO-A2407', 'B24-YBO-007', 'Pune', 'Godrej Chemicals', 'Yb2O3 99.0% Spark Plug', 'Iridium-Alloy', '99.0%', '2377 degC', '&#8377;800 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West'],
            ['YBO-A2408', 'B24-YBO-008', 'Jaipur', 'Rajasthan Chemicals', 'Yb2O3 98.5% Glass Additive', 'UV Filter', '98.5%', '2377 degC', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North'],
            ['YBO-A2409', 'B24-YBO-009', 'Guwahati', 'Assam Chemicals', 'Yb2O3 99.6% Laser Welding', 'Industrial CW', '99.6%', '2377 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East'],
            ['YBO-A2410', 'B24-YBO-010', 'Ahmedabad', 'Gujarat Chemicals', 'Yb2O3 99.95% Submarine Laser', 'Deep Sea Comms', '99.95%', '2377 degC', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West'],
            ['YBO-A2411', 'B24-YBO-011', 'Lucknow', 'UP Chemicals', 'Yb2O3 99.2% Atomic Clock', 'Optical Lattice', '99.2%', '2377 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North'],
            ['YBO-A2412', 'B24-YBO-012', 'Visakhapatnam', 'Vizag Chemicals', 'Yb2O3 99.8% Warship Laser', 'Yb:Fiber Weapon', '99.8%', '2377 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South'],
            ['YBO-A2413', 'B24-YBO-013', 'Balasore', 'DRDO TBRL', 'Yb2O3 99.4% Missile IRCM', 'Directed Energy', '99.4%', '2377 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East'],
            ['YBO-A2414', 'B24-YBO-014', 'Bhilai', 'SAIL Chemicals', 'Yb2O3 97% General Chemical', 'Alloy Additive', '97.0%', '2377 degC', '&#8377;640 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East'],
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
print("Done R447")
