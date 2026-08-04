#!/usr/bin/env python3
"""R479 Generator: Strontium Fluoride Logistics + Thorium Dioxide Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Strontium Fluoride: SrF2 ---
# Prefix: srf, Icon: Shrimp, Color: #0e7490 (dark cyan), MP 1477 degC, density 4.24 g/cm3
# SrF2: UV laser window optics, scintillator crystal, missile IR dome,
# vacuum ultraviolet lens coating, CaF2 alternative high-refractive, LiF bonding
srf_records = [
    ['SRF-A2401', 'B24-SRF-001', 'Mumbai', 'MIDHANI', 'SrF2 99.99% UV Excimer Laser Window', 'KrF 248 nm Optic', '99.99%', '1477 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'DRDO SrF2 laser win'],
    ['SRF-A2402', 'B24-SRF-002', 'Bengaluru', 'DRDO DMRL', 'SrF2 99.999% Scintillator Crystal Array', 'Cerenkov Detector', '99.999%', '1477 degC', '&#8377;980 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc SrF2 scintillator'],
    ['SRF-A2403', 'B24-SRF-003', 'Hyderabad', 'Tata Chemicals', 'SrF2 99.95% Missile IR Seeker Transparent Dome', 'Astra Mk-1 Radome', '99.95%', '1477 degC', '&#8377;960 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'DRDO SrF2 IR dome'],
    ['SRF-A2404', 'B24-SRF-004', 'Chennai', 'Bharat Forge', 'SrF2 99.9% Vacuum Ultraviolet Lens Coating', 'VUV 100-200 nm', '99.9%', '1477 degC', '&#8377;880 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'IIT-M SrF2 VUV lens'],
    ['SRF-A2405', 'B24-SRF-005', 'Kolkata', 'Shyam Chemicals', 'SrF2 99.7% CaF2 Alternative High-Refractive Optic', 'n=1.44 UV Grade', '99.7%', '1477 degC', '&#8377;860 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Opto India SrF2 optic'],
    ['SRF-A2406', 'B24-SRF-006', 'Noida', 'BHEL R&amp;D', 'SrF2 99.98% Single Crystal Substrate Wafer', 'SrF2(111) Substrate', '99.98%', '1477 degC', '&#8377;920 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'SSPL SrF2 wafer'],
    ['SRF-A2407', 'B24-SRF-007', 'Pune', 'Godrej Chemicals', 'SrF2 99.5% Optical Thin-Film Deposition Source', 'E-Beam Evaporation', '99.5%', '1477 degC', '&#8377;800 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Thin Films SrF2 dep'],
    ['SRF-A2408', 'B24-SRF-008', 'Jaipur', 'Rajasthan Chemicals', 'SrF2 99.8% Dental Glass-Ceramic Filler', 'Bioactive Glass', '99.8%', '1477 degC', '&#8377;760 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', '3M India SrF2 dental'],
    ['SRF-A2409', 'B24-SRF-009', 'Guwahati', 'Assam Chemicals', 'SrF2 99.99% Fluorescence Spectroscopy Cell', 'XRF Sample Holder', '99.99%', '1477 degC', '&#8377;880 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G SrF2 XRF cell'],
    ['SRF-A2410', 'B24-SRF-010', 'Ahmedabad', 'Gujarat Chemicals', 'SrF2 99.6% Fiber Optic Cladding Dopant', 'Fluorosilicate Reflector', '99.6%', '1477 degC', '&#8377;840 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Sterlite SrF2 cladding'],
    ['SRF-A2411', 'B24-SRF-011', 'Lucknow', 'UP Chemicals', 'SrF2 99.4% Welding Arc Flux Additive', 'Strontium-Alloy Flux', '99.4%', '1477 degC', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'WELD India SrF2 flux'],
    ['SRF-A2412', 'B24-SRF-012', 'Visakhapatnam', 'Vizag Chemicals', 'SrF2 99.92% Submarine Periscope Optical Prism', 'Type 209 Periscope', '99.92%', '1477 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK prism'],
    ['SRF-A2413', 'B24-SRF-013', 'Balasore', 'DRDO TBRL', 'SrF2 99.99% Hypersonic Reentry Window Sensor', 'Mach 8+ UV Sensor', '99.99%', '1477 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV SrF2'],
    ['SRF-A2414', 'B24-SRF-014', 'Bhilai', 'SAIL Chemicals', 'SrF2 99.0% General Optical Grade', 'Process Chemical', '99.0%', '1477 degC', '&#8377;540 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL SrF2 industrial'],
]

# --- Thorium Dioxide: ThO2 ---
# Prefix: tho, Icon: Nuclear, Color: #a16207 (dark yellow), MP 3350 degC, density 10.0 g/cm3
# ThO2: India thorium nuclear fuel (3-stage program), gas mantle incandescent,
# high-temperature ceramic crucible, nuclear breeder blanket, refractory coating,
# BARC advanced heavy water reactor (AHWR) fuel
tho_records = [
    ['THO-A2401', 'B24-THO-001', 'Mumbai', 'MIDHANI', 'ThO2 99.99% AHWR Thorium Fuel Pellet', 'India 3-Stage Nuclear', '99.99%', '3350 degC', '&#8377;1200 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'BARC ThO2 AHWR fuel'],
    ['THO-A2402', 'B24-THO-002', 'Bengaluru', 'DRDO DMRL', 'ThO2 99.999% Gas Mantle Incandescent Fabric', 'Welsbach Mantle', '99.999%', '3350 degC', '&#8377;980 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc ThO2 mantle'],
    ['THO-A2403', 'B24-THO-003', 'Hyderabad', 'Tata Chemicals', 'ThO2 99.95% High-Temp Ceramic Crucible Liner', '2500 degC Refractory', '99.95%', '3350 degC', '&#8377;1060 Cr', 'in-transit', 'critical', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'DRDO ThO2 crucible'],
    ['THO-A2404', 'B24-THO-004', 'Chennai', 'Bharat Forge', 'ThO2 99.9% PFBR Breeder Blanket Oxide', 'Fast Breeder ThO2', '99.9%', '3350 degC', '&#8377;1100 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'IGCAR ThO2 blanket'],
    ['THO-A2405', 'B24-THO-005', 'Kolkata', 'Shyam Chemicals', 'ThO2 99.7% Nuclear Grade Refractory Coating', 'Thoria Dispersion', '99.7%', '3350 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'NPCIL ThO2 coating'],
    ['THO-A2406', 'B24-THO-006', 'Noida', 'BHEL R&amp;D', 'ThO2 99.98% Stabilized Zirconia Dopant', 'ThO2-ZrO2 Composite', '99.98%', '3350 degC', '&#8377;1040 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BHEL ThO2 SZ dopant'],
    ['THO-A2407', 'B24-THO-007', 'Pune', 'Godrej Chemicals', 'ThO2 99.5% Tungsten-Thoria Dispersion Electrode', 'WTED Arc Welding', '99.5%', '3350 degC', '&#8377;900 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'ESAB ThO2 WTED'],
    ['THO-A2408', 'B24-THO-008', 'Jaipur', 'Rajasthan Chemicals', 'ThO2 99.8% Glass Refractive Index Modifier', 'High-n Optical Glass', '99.8%', '3350 degC', '&#8377;860 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'IIT-R ThO2 glass'],
    ['THO-A2409', 'B24-THO-009', 'Guwahati', 'Assam Chemicals', 'ThO2 99.99% Catalytic Oxidation Promoter', 'CO Oxidation Catalyst', '99.99%', '3350 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G ThO2 catalyst'],
    ['THO-A2410', 'B24-THO-010', 'Ahmedabad', 'Gujarat Chemicals', 'ThO2 99.6% Molten Salt Reactor Containment', 'Fluoride Salt Barrier', '99.6%', '3350 degC', '&#8377;1000 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'BARC ThO2 MSR cont'],
    ['THO-A2411', 'B24-THO-011', 'Lucknow', 'UP Chemicals', 'ThO2 99.4% Oxygen Sensor Thoria Electrolyte', 'Nernst Cell YDT', '99.4%', '3350 degC', '&#8377;820 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'BHEL ThO2 O2 sensor'],
    ['THO-A2412', 'B24-THO-012', 'Visakhapatnam', 'Vizag Chemicals', 'ThO2 99.92% Submarine Reactor ThO2-UO2 Mixed Oxide', 'PHWR MOX Fuel', '99.92%', '3350 degC', '&#8377;1200 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSN MOX fuel'],
    ['THO-A2413', 'B24-THO-013', 'Balasore', 'DRDO TBRL', 'ThO2 99.99% Hypersonic Thermal Protection Tile', 'Mach 10+ TPS Tile', '99.99%', '3350 degC', '&#8377;1160 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV ThO2 TPS'],
    ['THO-A2414', 'B24-THO-014', 'Bhilai', 'SAIL Chemicals', 'ThO2 99.0% General Refractory Grade', 'Process Chemical', '99.0%', '3350 degC', '&#8377;680 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL ThO2 refractory'],
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


srf_config = {
    'prefix': 'srf', 'icon': 'Shrimp', 'color': '#0e7490',
    'title': 'Strontium Fluoride Logistics',
    'subtitle': 'SrF2 UV laser window &#8226; Scintillator crystal &#8226; VUV optic &#8226; Missile IR dome supply chain',
    'fn_name': 'StrontiumFluorideLogisticsView',
}
with open('src/components/modules/strontium-fluoride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(srf_records, srf_config))
print("Generated: strontium-fluoride-logistics-view.tsx")

tho_config = {
    'prefix': 'tho', 'icon': 'Nuclear', 'color': '#a16207',
    'title': 'Thorium Dioxide Logistics',
    'subtitle': 'ThO2 AHWR thorium fuel &#8226; Gas mantle &#8226; Breeder blanket &#8226; Refractory ceramic supply chain',
    'fn_name': 'ThoriumDioxideLogisticsView',
}
with open('src/components/modules/thorium-dioxide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(tho_records, tho_config))
print("Generated: thorium-dioxide-logistics-view.tsx")

for fname in ['src/components/modules/strontium-fluoride-logistics-view.tsx', 'src/components/modules/thorium-dioxide-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
