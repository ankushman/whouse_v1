#!/usr/bin/env python3
"""R445: Europium Oxide + Terbium Oxide clone-and-customize generator."""
import re, os

TEMPLATE = '/home/z/my-project/src/components/modules/zinc-oxide-logistics-view.tsx'
OUT_DIR = '/home/z/my-project/src/components/modules'

MODULES = [
    {
        'slug': 'europium-oxide',
        'title': 'Europium Oxide',
        'icon': 'Sunset',
        'color': '#be185d',
        'prefix': 'euo',
        'subtitle': 'Eu2O3 red phosphor &#8226; LED display &#8226; Euro banknote &#8226; Nuclear control supply chain',
        'var': 'europium_oxide',
        'func': 'Europium_OxideLogisticsView',
        'file': 'europium-oxide-logistics-view.tsx',
        'records': [
            ['EUO-A2401', 'B24-EUO-001', 'Mumbai', 'MIDHANI', 'Eu2O3 99.99% Red Phosphor', 'CRT Display', '99.99%', '2350 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West'],
            ['EUO-A2402', 'B24-EUO-002', 'Bengaluru', 'DRDO DMRL', 'Eu2O3 99.9% LED Phosphor', 'White LED YAG', '99.9%', '2350 degC', '&#8377;940 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South'],
            ['EUO-A2403', 'B24-EUO-003', 'Hyderabad', 'Tata Chemicals', 'Eu2O3 99.7% Euro Banknote', 'Security Ink', '99.7%', '2350 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South'],
            ['EUO-A2404', 'B24-EUO-004', 'Chennai', 'Bharat Forge', 'Eu2O3 99.5% Nuclear Control', 'Neutron Poison', '99.5%', '2350 degC', '&#8377;900 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South'],
            ['EUO-A2405', 'B24-EUO-005', 'Kolkata', 'Shyam Chemicals', 'Eu2O3 99.3% Fluorescent Lamp', 'Trichromatic', '99.3%', '2350 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East'],
            ['EUO-A2406', 'B24-EUO-006', 'Noida', 'BHEL R&amp;D', 'Eu2O3 99.8% OLED Emit', 'Red Pixel', '99.8%', '2350 degC', '&#8377;940 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North'],
            ['EUO-A2407', 'B24-EUO-007', 'Pune', 'Godrej Chemicals', 'Eu2O3 99.0% Glass Colorant', 'Red Tint', '99.0%', '2350 degC', '&#8377;800 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West'],
            ['EUO-A2408', 'B24-EUO-008', 'Jaipur', 'Rajasthan Chemicals', 'Eu2O3 98.5% Anti-Counterfeit', 'Currency Marker', '98.5%', '2350 degC', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North'],
            ['EUO-A2409', 'B24-EUO-009', 'Guwahati', 'Assam Chemicals', 'Eu2O3 99.6% Laser Gain Media', 'Eu-doped YAG', '99.6%', '2350 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East'],
            ['EUO-A2410', 'B24-EUO-010', 'Ahmedabad', 'Gujarat Chemicals', 'Eu2O3 99.95% Submarine Display', 'Red HUD Panel', '99.95%', '2350 degC', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West'],
            ['EUO-A2411', 'B24-EUO-011', 'Lucknow', 'UP Chemicals', 'Eu2O3 99.2% Photoluminescent', 'Emergency Sign', '99.2%', '2350 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North'],
            ['EUO-A2412', 'B24-EUO-012', 'Visakhapatnam', 'Vizag Chemicals', 'Eu2O3 99.8% Warship Night Vision', 'IR Panel Glow', '99.8%', '2350 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South'],
            ['EUO-A2413', 'B24-EUO-013', 'Balasore', 'DRDO TBRL', 'Eu2O3 99.4% Missile Flare', 'IR Decoy Phos', '99.4%', '2350 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East'],
            ['EUO-A2414', 'B24-EUO-014', 'Bhilai', 'SAIL Chemicals', 'Eu2O3 97% General Chemical', 'Alloy Additive', '97.0%', '2350 degC', '&#8377;640 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East'],
        ],
    },
    {
        'slug': 'terbium-oxide',
        'title': 'Terbium Oxide',
        'icon': 'Lightbulb',
        'color': '#15803d',
        'prefix': 'tbo',
        'subtitle': 'Tb4O7 green phosphor &#8226; LCD display &#8226; Fluorescent lamp &#8226; Sonar system supply chain',
        'var': 'terbium_oxide',
        'func': 'Terbium_OxideLogisticsView',
        'file': 'terbium-oxide-logistics-view.tsx',
        'records': [
            ['TBO-A2401', 'B24-TBO-001', 'Mumbai', 'MIDHANI', 'Tb4O7 99.99% Green Phosphor', 'CRT Display', '99.99%', '2387 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West'],
            ['TBO-A2402', 'B24-TBO-002', 'Bengaluru', 'DRDO DMRL', 'Tb4O7 99.9% LCD Backlight', 'CCFL Tube', '99.9%', '2387 degC', '&#8377;940 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South'],
            ['TBO-A2403', 'B24-TBO-003', 'Hyderabad', 'Tata Chemicals', 'Tb4O7 99.7% Fluorescent Lamp', 'Trichromatic', '99.7%', '2387 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South'],
            ['TBO-A2404', 'B24-TBO-004', 'Chennai', 'Bharat Forge', 'Tb4O7 99.5% Magneto-Optical', 'FARADAY Rotator', '99.5%', '2387 degC', '&#8377;900 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South'],
            ['TBO-A2405', 'B24-TBO-005', 'Kolkata', 'Shyam Chemicals', 'Tb4O7 99.3% Ceramic Capacitor', 'Dielectric KTB', '99.3%', '2387 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East'],
            ['TBO-A2406', 'B24-TBO-006', 'Noida', 'BHEL R&amp;D', 'Tb4O7 99.8% X-Ray Intensif', 'Gd2O2S:Tb Film', '99.8%', '2387 degC', '&#8377;940 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North'],
            ['TBO-A2407', 'B24-TBO-007', 'Pune', 'Godrej Chemicals', 'Tb4O7 99.0% Green LED', 'InGaN Phosphor', '99.0%', '2387 degC', '&#8377;800 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West'],
            ['TBO-A2408', 'B24-TBO-008', 'Jaipur', 'Rajasthan Chemicals', 'Tb4O7 98.5% Glass Additive', 'Refractive Mod', '98.5%', '2387 degC', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North'],
            ['TBO-A2409', 'B24-TBO-009', 'Guwahati', 'Assam Chemicals', 'Tb4O7 99.6% Fuel Cell Cat', 'SOFC Anode', '99.6%', '2387 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East'],
            ['TBO-A2410', 'B24-TBO-010', 'Ahmedabad', 'Gujarat Chemicals', 'Tb4O7 99.95% Submarine Sonar', 'Magneto-Optic Sensor', '99.95%', '2387 degC', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West'],
            ['TBO-A2411', 'B24-TBO-011', 'Lucknow', 'UP Chemicals', 'Tb4O7 99.2% Dental X-Ray', 'Imaging Plate', '99.2%', '2387 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North'],
            ['TBO-A2412', 'B24-TBO-012', 'Visakhapatnam', 'Vizag Chemicals', 'Tb4O7 99.8% Warship Radar', 'Magneto-Optic Iso', '99.8%', '2387 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South'],
            ['TBO-A2413', 'B24-TBO-013', 'Balasore', 'DRDO TBRL', 'Tb4O7 99.4% Missile Seeker', 'IR Phosphor', '99.4%', '2387 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East'],
            ['TBO-A2414', 'B24-TBO-014', 'Bhilai', 'SAIL Chemicals', 'Tb4O7 97% General Chemical', 'Alloy Additive', '97.0%', '2387 degC', '&#8377;640 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East'],
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
print("Done R445")
