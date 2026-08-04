#!/usr/bin/env python3
"""R442: Cerium Oxide + Lanthanum Oxide clone-and-customize generator."""
import re, os

TEMPLATE = '/home/z/my-project/src/components/modules/zinc-oxide-logistics-view.tsx'
OUT_DIR = '/home/z/my-project/src/components/modules'

MODULES = [
    {
        'slug': 'cerium-oxide',
        'title': 'Cerium Oxide',
        'icon': 'Gem',
        'color': '#e11d48',
        'prefix': 'ceo',
        'subtitle': 'CeO2 glass polish &#8226; Catalytic converter &#8226; UV absorber &#8226; Fuel cell electrolyte supply chain',
        'var': 'cerium_oxide',
        'func': 'Cerium_OxideLogisticsView',
        'file': 'cerium-oxide-logistics-view.tsx',
        'records': [
            ['CEO-A2401', 'B24-CEO-001', 'Mumbai', 'MIDHANI', 'CeO2 99.99% Glass Polish', 'Optical Lens', '99.99%', '2400 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West'],
            ['CEO-A2402', 'B24-CEO-002', 'Bengaluru', 'DRDO DMRL', 'CeO2 99.9% Catalytic Converter', 'Auto Exhaust', '99.9%', '2400 degC', '&#8377;940 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South'],
            ['CEO-A2403', 'B24-CEO-003', 'Hyderabad', 'Tata Chemicals', 'CeO2 99.7% UV Absorber', 'Sunscreen Coating', '99.7%', '2400 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South'],
            ['CEO-A2404', 'B24-CEO-004', 'Chennai', 'Bharat Forge', 'CeO2 99.5% Fuel Cell Electrolyte', 'SOFC Anode', '99.5%', '2400 degC', '&#8377;880 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South'],
            ['CEO-A2405', 'B24-CEO-005', 'Kolkata', 'Shyam Chemicals', 'CeO2 99.3% Oxygen Storage', 'Three-Way Cat', '99.3%', '2400 degC', '&#8377;860 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East'],
            ['CEO-A2406', 'B24-CEO-006', 'Noida', 'BHEL R&amp;D', 'CeO2 99.8% Phosphor Activator', 'LED YAG:Ce', '99.8%', '2400 degC', '&#8377;920 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North'],
            ['CEO-A2407', 'B24-CEO-007', 'Pune', 'Godrej Chemicals', 'CeO2 99.0% Ceramic Glaze', 'Opacifier', '99.0%', '2400 degC', '&#8377;780 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West'],
            ['CEO-A2408', 'B24-CEO-008', 'Jaipur', 'Rajasthan Chemicals', 'CeO2 98.5% Gas Mantle', 'Incandescent', '98.5%', '2400 degC', '&#8377;640 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North'],
            ['CEO-A2409', 'B24-CEO-009', 'Guwahati', 'Assam Chemicals', 'CeO2 99.6% Water Gas Shift', 'Syngas Catalyst', '99.6%', '2400 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East'],
            ['CEO-A2410', 'B24-CEO-010', 'Ahmedabad', 'Gujarat Chemicals', 'CeO2 99.95% Precision Polish', 'Semiconductor CMP', '99.95%', '2400 degC', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West'],
            ['CEO-A2411', 'B24-CEO-011', 'Lucknow', 'UP Chemicals', 'CeO2 99.2% Diesel Soot', 'DPF Regeneration', '99.2%', '2400 degC', '&#8377;800 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North'],
            ['CEO-A2412', 'B24-CEO-012', 'Visakhapatnam', 'Vizag Chemicals', 'CeO2 99.8% Submarine Periscope', 'Optical Polish', '99.8%', '2400 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South'],
            ['CEO-A2413', 'B24-CEO-013', 'Balasore', 'DRDO TBRL', 'CeO2 99.4% Missile IR Dome', 'Seeker Window', '99.4%', '2400 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East'],
            ['CEO-A2414', 'B24-CEO-014', 'Bhilai', 'SAIL Chemicals', 'CeO2 97% General Chemical', 'Steel Additive', '97.0%', '2400 degC', '&#8377;640 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East'],
        ],
    },
    {
        'slug': 'lanthanum-oxide',
        'title': 'Lanthanum Oxide',
        'icon': 'Orbit',
        'color': '#c026d3',
        'prefix': 'lao',
        'subtitle': 'La2O3 optical lens &#8226; Hydrogenation catalyst &#8226; NiMH battery &#8226; Phosphor host supply chain',
        'var': 'lanthanum_oxide',
        'func': 'Lanthanum_OxideLogisticsView',
        'file': 'lanthanum-oxide-logistics-view.tsx',
        'records': [
            ['LAO-A2401', 'B24-LAO-001', 'Mumbai', 'MIDHANI', 'La2O3 99.99% Optical Lens', 'Camera Zoom', '99.99%', '2315 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West'],
            ['LAO-A2402', 'B24-LAO-002', 'Bengaluru', 'DRDO DMRL', 'La2O3 99.9% Hydrogenation Cat', 'Refinery HDS', '99.9%', '2315 degC', '&#8377;940 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South'],
            ['LAO-A2403', 'B24-LAO-003', 'Hyderabad', 'Tata Chemicals', 'La2O3 99.7% NiMH Battery', 'EV Storage', '99.7%', '2315 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South'],
            ['LAO-A2404', 'B24-LAO-004', 'Chennai', 'Bharat Forge', 'La2O3 99.5% Phosphor Host', 'Eu-doped Red', '99.5%', '2315 degC', '&#8377;900 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South'],
            ['LAO-A2405', 'B24-LAO-005', 'Kolkata', 'Shyam Chemicals', 'La2O3 99.3% Crack Catalyst', 'FCC Zeolite', '99.3%', '2315 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East'],
            ['LAO-A2406', 'B24-LAO-006', 'Noida', 'BHEL R&amp;D', 'La2O3 99.8% Water Treatment', 'Phosphate Removal', '99.8%', '2315 degC', '&#8377;920 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North'],
            ['LAO-A2407', 'B24-LAO-007', 'Pune', 'Godrej Chemicals', 'La2O3 99.0% Glass Additive', 'Refractive Index', '99.0%', '2315 degC', '&#8377;800 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West'],
            ['LAO-A2408', 'B24-LAO-008', 'Jaipur', 'Rajasthan Chemicals', 'La2O3 98.5% Ceramic Dielectric', 'MLCC Capacitor', '98.5%', '2315 degC', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North'],
            ['LAO-A2409', 'B24-LAO-009', 'Guwahati', 'Assam Chemicals', 'La2O3 99.6% DeNOx Catalyst', 'SCR System', '99.6%', '2315 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East'],
            ['LAO-A2410', 'B24-LAO-010', 'Ahmedabad', 'Gujarat Chemicals', 'La2O3 99.95% Laser Crystal', 'Nd:YAG Host', '99.95%', '2315 degC', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West'],
            ['LAO-A2411', 'B24-LAO-011', 'Lucknow', 'UP Chemicals', 'La2O3 99.2% Electrode Binder', 'Solid Oxide FC', '99.2%', '2315 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North'],
            ['LAO-A2412', 'B24-LAO-012', 'Visakhapatnam', 'Vizag Chemicals', 'La2O3 99.8% Submarine Sonar', 'Acoustic Lens', '99.8%', '2315 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South'],
            ['LAO-A2413', 'B24-LAO-013', 'Balasore', 'DRDO TBRL', 'La2O3 99.4% Missile Seeker', 'IR Window', '99.4%', '2315 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East'],
            ['LAO-A2414', 'B24-LAO-014', 'Bhilai', 'SAIL Chemicals', 'La2O3 97% General Chemical', 'Alloy Additive', '97.0%', '2315 degC', '&#8377;640 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East'],
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
    content = re.sub(r"color: '[^']+'", f"color: '{mod['color']}'", content)  # 2nd pass for bar color
    content = re.sub(r"backgroundColor: '[^']+'", f"backgroundColor: '{mod['color']}22'", content)
    content = re.sub(r'<h2 className="text-xl font-bold">[^<]+</h2>', f'<h2 className="text-xl font-bold">{mod["title"]} Logistics</h2>', content)
    content = re.sub(r'<p className="text-sm text-gray-400">[^<]+</p>', f'<p className="text-sm text-gray-400">{mod["subtitle"]}</p>', content)

    with open(out, 'w') as f:
        f.write(content)
    print(f"CREATED: {out}")

for mod in MODULES:
    generate_module(mod)
print("Done R442")
