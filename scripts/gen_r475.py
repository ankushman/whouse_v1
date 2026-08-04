#!/usr/bin/env python3
"""R475 Generator: Nano Alumina Logistics + Lanthanum Fluoride Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Nano Alumina: Al2O3-nano ---
# Prefix: aon, Icon: Fish, Color: #1d4ed8 (blue), MP 2072 degC, density 3.95 g/cm3
# Al2O3 nano: CMP slurry for semiconductor, bio-ceramic implant, catalyst support,
# advanced ceramic armor, wear-resistant coating, adsorbent, refractory
aon_records = [
    ['AON-A2401', 'B24-AON-001', 'Mumbai', 'MIDHANI', 'Al2O3-nano 99.99% Semiconductor CMP Slurry', '22nm Node Polish', '99.99%', '2072 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Tata SED Al2O3 CMP'],
    ['AON-A2402', 'B24-AON-002', 'Bengaluru', 'DRDO DMRL', 'Al2O3-nano 99.95% Ceramic Body Armor Plate', 'ESAPI Class IV', '99.95%', '2072 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'DRDO Al2O3 armor'],
    ['AON-A2403', 'B24-AON-003', 'Hyderabad', 'Tata Chemicals', 'Al2O3-nano 99.9% Bio-Ceramic Hip Implant Coating', 'Hydroxyapatite Bond', '99.9%', '2072 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Apollo Al2O3 implant'],
    ['AON-A2404', 'B24-AON-004', 'Chennai', 'Bharat Forge', 'Al2O3-nano 99.85% FCC Catalyst Support Substrate', 'Petroleum Refining', '99.85%', '2072 degC', '&#8377;840 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'IOC Al2O3 FCC cat'],
    ['AON-A2405', 'B24-AON-005', 'Kolkata', 'Shyam Chemicals', 'Al2O3-nano 99.7% Water Fluoride Adsorbent Media', 'Defluoridation Filter', '99.7%', '2072 degC', '&#8377;780 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'PHED Al2O3 fluoride'],
    ['AON-A2406', 'B24-AON-006', 'Noida', 'BHEL R&amp;D', 'Al2O3-nano 99.98% Missile Radome Thermal Coating', 'Radome Ablative', '99.98%', '2072 degC', '&#8377;920 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO Al2O3 radome'],
    ['AON-A2407', 'B24-AON-007', 'Pune', 'Godrej Chemicals', 'Al2O3-nano 99.5% Wear-Resistant Cutting Tool Insert', 'Ceramic Turning', '99.5%', '2072 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'BHEL Al2O3 tool bit'],
    ['AON-A2408', 'B24-AON-008', 'Jaipur', 'Rajasthan Chemicals', 'Al2O3-nano 99.8% High-Temp Refractory Brick Liner', 'Steel Furnace', '99.8%', '2072 degC', '&#8377;860 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'SAIL Al2O3 refractory'],
    ['AON-A2409', 'B24-AON-009', 'Guwahati', 'Assam Chemicals', 'Al2O3-nano 99.92% LED Phosphor Host Matrix', 'YAG:Ce Conversion', '99.92%', '2072 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G Al2O3 phosphor'],
    ['AON-A2410', 'B24-AON-010', 'Ahmedabad', 'Gujarat Chemicals', 'Al2O3-nano 99.6% Lithium-Ion Battery Separator Coating', 'Ceramic Coated PE', '99.6%', '2072 degC', '&#8377;840 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Reliance Al2O3 separator'],
    ['AON-A2411', 'B24-AON-011', 'Lucknow', 'UP Chemicals', 'Al2O3-nano 99.4% Industrial Desiccant Drying Agent', 'Packed Column', '99.4%', '2072 degC', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'BHEL Al2O3 desiccant'],
    ['AON-A2412', 'B24-AON-012', 'Visakhapatnam', 'Vizag Chemicals', 'Al2O3-nano 99.85% Submarine Propeller Erosion Coat', 'Anti-Cavitation', '99.85%', '2072 degC', '&#8377;920 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK prop coat'],
    ['AON-A2413', 'B24-AON-013', 'Balasore', 'DRDO TBRL', 'Al2O3-nano 99.95% Hypersonic Ablative Heat Shield', 'Mach 7+ TPS Tile', '99.95%', '2072 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV Al2O3 TPS'],
    ['AON-A2414', 'B24-AON-014', 'Bhilai', 'SAIL Chemicals', 'Al2O3-nano 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '2072 degC', '&#8377;520 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Al2O3 industrial'],
]

# --- Lanthanum Fluoride: LaF3 ---
# Prefix: ltf, Icon: Shell, Color: #0f766e (teal-dark), MP 1493 degC, density 5.94 g/cm3
# LaF3: UV optical coating, fluoride ion battery electrolyte, fiber laser host,
# scintillator crystal, arc welding flux, IR transparent window
ltf_records = [
    ['LTF-A2401', 'B24-LTF-001', 'Mumbai', 'MIDHANI', 'LaF3 99.99% Deep-UV Optical Coating', '193nm DUV AR Coat', '99.99%', '1493 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'IISc LaF3 DUV coat'],
    ['LTF-A2402', 'B24-LTF-002', 'Bengaluru', 'DRDO DMRL', 'LaF3 99.999% Fluoride Ion Battery Electrolyte', 'Solid-State FIB', '99.999%', '1493 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IIT-B LaF3 FIB electrolyte'],
    ['LTF-A2403', 'B24-LTF-003', 'Hyderabad', 'Tata Chemicals', 'LaF3 99.95% Fiber Laser Host Crystal', 'Nd:LaF3 1.06um', '99.95%', '1493 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'DRDO LaF3 fiber laser'],
    ['LTF-A2404', 'B24-LTF-004', 'Chennai', 'Bharat Forge', 'LaF3 99.9% Scintillation Detector Crystal', 'Gamma Spectroscopy', '99.9%', '1493 degC', '&#8377;860 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BARC LaF3 scintillator'],
    ['LTF-A2405', 'B24-LTF-005', 'Kolkata', 'Shyam Chemicals', 'LaF3 99.7% Magnesium Smelting Flux Additive', 'Mg Casting Flux', '99.7%', '1493 degC', '&#8377;780 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Vedanta LaF3 Mg flux'],
    ['LTF-A2406', 'B24-LTF-006', 'Noida', 'BHEL R&amp;D', 'LaF3 99.98% Missile IR Dome Coating Stack', 'MWIR/Dual-Band AR', '99.98%', '1493 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO Astra LaF3 dome'],
    ['LTF-A2407', 'B24-LTF-007', 'Pune', 'Godrej Chemicals', 'LaF3 99.5% Carbon Arc Lamp Electrode Core', 'Cinema Projector', '99.5%', '1493 degC', '&#8377;740 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Surya Roshni LaF3 arc'],
    ['LTF-A2408', 'B24-LTF-008', 'Jaipur', 'Rajasthan Chemicals', 'LaF3 99.85% Space Telescope Mirror Coating', 'UV-Al Reflective', '99.85%', '1493 degC', '&#8377;920 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'ISRO LaF3 mirror coat'],
    ['LTF-A2409', 'B24-LTF-009', 'Guwahati', 'Assam Chemicals', 'LaF3 99.99% Neutron Absorption Control Rod', 'Nuclear Moderator', '99.99%', '1493 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'BARC LaF3 ctrl rod'],
    ['LTF-A2410', 'B24-LTF-010', 'Ahmedabad', 'Gujarat Chemicals', 'LaF3 99.6% Optical Fiber Preform Doping', 'Low-Loss Fluoride', '99.6%', '1493 degC', '&#8377;820 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Sterlite LaF3 preform'],
    ['LTF-A2411', 'B24-LTF-011', 'Lucknow', 'UP Chemicals', 'LaF3 99.4% Welding Flux Coating Compound', 'Submerged Arc', '99.4%', '1493 degC', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'SAIL LaF3 weld flux'],
    ['LTF-A2412', 'B24-LTF-012', 'Visakhapatnam', 'Vizag Chemicals', 'LaF3 99.92% Submarine Sonar Transducer Coat', 'Acoustic Match', '99.92%', '1493 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK transducer'],
    ['LTF-A2413', 'B24-LTF-013', 'Balasore', 'DRDO TBRL', 'LaF3 99.99% Hypersonic Wind Tunnel Window', 'Mach 7+ Optical', '99.99%', '1493 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV LaF3 win'],
    ['LTF-A2414', 'B24-LTF-014', 'Bhilai', 'SAIL Chemicals', 'LaF3 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '1493 degC', '&#8377;540 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL LaF3 industrial'],
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


aon_config = {
    'prefix': 'aon', 'icon': 'Fish', 'color': '#1d4ed8',
    'title': 'Nano Alumina Logistics',
    'subtitle': 'Al2O3-nano CMP slurry &#8226; Ceramic armor &#8226; Bio-ceramic implant &#8226; Catalyst support supply chain',
    'fn_name': 'NanoAluminaLogisticsView',
}
with open('src/components/modules/nano-alumina-logistics-view.tsx', 'w') as f:
    f.write(gen_module(aon_records, aon_config))
print("Generated: nano-alumina-logistics-view.tsx")

ltf_config = {
    'prefix': 'ltf', 'icon': 'Shell', 'color': '#0f766e',
    'title': 'Lanthanum Fluoride Logistics',
    'subtitle': 'LaF3 DUV optical coating &#8226; Fluoride ion battery &#8226; Fiber laser host &#8226; Scintillator supply chain',
    'fn_name': 'LanthanumFluorideLogisticsView',
}
with open('src/components/modules/lanthanum-fluoride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(ltf_records, ltf_config))
print("Generated: lanthanum-fluoride-logistics-view.tsx")

for fname in ['src/components/modules/nano-alumina-logistics-view.tsx', 'src/components/modules/lanthanum-fluoride-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
