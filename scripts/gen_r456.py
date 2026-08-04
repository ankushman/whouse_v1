#!/usr/bin/env python3
"""R456 Generator: Gallium Metal Logistics + Tellurium Metal Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Gallium Metal: Ga ---
# Prefix: gam, Icon: CloudRain, Color: #0369a1 (sky-dark), density 5.91 g/cm3, mp 29.76 degC
gam_records = [
    ['GAM-A2401', 'B24-GAM-001', 'Mumbai', 'MIDHANI', 'Ga 99.9999% GaAs Wafer', 'LED Epitaxy', '99.9999%', '5.91 g/cm3', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Osram GaAs LED wafer'],
    ['GAM-A2402', 'B24-GAM-002', 'Bengaluru', 'DRDO DMRL', 'Ga 99.999% GaN RF Amplifier', 'Radar T/R Module', '99.999%', '5.91 g/cm3', '&#8377;940 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'DRDO AESA GaN MMIC'],
    ['GAM-A2403', 'B24-GAM-003', 'Hyderabad', 'Tata Chemicals', 'Ga 99.99% GaInP Solar Cell', 'Space PV Panel', '99.99%', '5.91 g/cm3', '&#8377;900 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'ISRO GSAT-4 GaInP cell'],
    ['GAM-A2404', 'B24-GAM-004', 'Chennai', 'Bharat Forge', 'Ga 99.95% Liquid Metal Thermal Interface', 'CPU Cooling', '99.95%', '5.91 g/cm3', '&#8377;860 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Intel Ga LM TIM pad'],
    ['GAM-A2405', 'B24-GAM-005', 'Kolkata', 'Shyam Chemicals', 'Ga 99.9% Ga2O3 Power Device', '1200V Schottky', '99.9%', '5.91 g/cm3', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'IISc Ga2O3 MOSFET'],
    ['GAM-A2406', 'B24-GAM-006', 'Noida', 'BHEL R&amp;D', 'Ga 99.85% Neutron Transmutation Doping', 'Si Wafer Dope', '99.85%', '5.91 g/cm3', '&#8377;820 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BHEL Si NTD Ga flux'],
    ['GAM-A2407', 'B24-GAM-007', 'Pune', 'Godrej Chemicals', 'Ga 99.995% VCSEL Laser Diode', 'Datacom Fiber', '99.995%', '5.91 g/cm3', '&#8377;900 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'II-VI 850nm VCSEL'],
    ['GAM-A2408', 'B24-GAM-008', 'Jaipur', 'Rajasthan Chemicals', 'Ga 99.5% Galinstan Thermometer', 'Medical Device', '99.5%', '5.91 g/cm3', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Rajasthan hospital Ga thermometer'],
    ['GAM-A2409', 'B24-GAM-009', 'Guwahati', 'Assam Chemicals', 'Ga 99.9% Antenna 5G Phased Array', 'mmWave Beam', '99.9%', '5.91 g/cm3', '&#8377;880 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Jio 5G GaN PA module'],
    ['GAM-A2410', 'B24-GAM-010', 'Ahmedabad', 'Gujarat Chemicals', 'Ga 99.9999% Satellite Solar Panel', 'MVP Multi-Junction', '99.9999%', '5.91 g/cm3', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'ISRO NavIC triple-junction'],
    ['GAM-A2411', 'B24-GAM-011', 'Lucknow', 'UP Chemicals', 'Ga 99.7% Flexible Solar Film', 'CIGS Roll-to-Roll', '99.7%', '5.91 g/cm3', '&#8377;780 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Tata Power flex PV'],
    ['GAM-A2412', 'B24-GAM-012', 'Visakhapatnam', 'Vizag Chemicals', 'Ga 99.99% Submarine Sonar GaN Array', 'Bow-Mounted', '99.99%', '5.91 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK GaN sonar'],
    ['GAM-A2413', 'B24-GAM-013', 'Balasore', 'DRDO TBRL', 'Ga 99.9% Warship EW Jammer', 'Active MMIC', '99.9%', '5.91 g/cm3', '&#8377;920 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval GaN jammer'],
    ['GAM-A2414', 'B24-GAM-014', 'Bhilai', 'SAIL Chemicals', 'Ga 99.0% General Alloy Additive', 'Low-Melt Alloy', '99.0%', '5.91 g/cm3', '&#8377;600 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Ga alloy charge'],
]

# --- Tellurium Metal: Te ---
# Prefix: tlm, Icon: Key, Color: #9333ea (purple-dark), density 6.24 g/cm3
tlm_records = [
    ['TLM-A2401', 'B24-TLM-001', 'Mumbai', 'MIDHANI', 'Te 99.999% CdTe Solar Cell', 'Thin-Film PV', '99.999%', '6.24 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Tata Power CdTe module'],
    ['TLM-A2402', 'B24-TLM-002', 'Bengaluru', 'DRDO DMRL', 'Te 99.99% Bi2Te3 Thermoelectric', 'RTG Power', '99.99%', '6.24 g/cm3', '&#8377;920 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'ISRO deep-space RTG'],
    ['TLM-A2403', 'B24-TLM-003', 'Hyderabad', 'Tata Chemicals', 'Te 99.9% Phase-Change Memory', 'PCM Chip', '99.9%', '6.24 g/cm3', '&#8377;880 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'IISc Ge2Sb2Te5 PCM'],
    ['TLM-A2404', 'B24-TLM-004', 'Chennai', 'Bharat Forge', 'Te 99.5% Rubber Vulcanization Accelerator', ' tyre Compound', '99.5%', '6.24 g/cm3', '&#8377;760 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'MRF tyre Te vulcanizer'],
    ['TLM-A2405', 'B24-TLM-005', 'Kolkata', 'Shyam Chemicals', 'Te 99.85% Copper Telluride Alloy', 'Machinable Cu', '99.85%', '6.24 g/cm3', '&#8377;820 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'BHEL free-machining CuTe'],
    ['TLM-A2406', 'B24-TLM-006', 'Noida', 'BHEL R&amp;D', 'Te 99.8% Thermoelectric Cooler', 'Peltier Module', '99.8%', '6.24 g/cm3', '&#8377;840 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Blue Star Peltier cooler'],
    ['TLM-A2407', 'B24-TLM-007', 'Pune', 'Godrej Chemicals', 'Te 99.95% Infrared Optics CdHgTe', 'FLIR Detector', '99.95%', '6.24 g/cm3', '&#8377;900 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'DRDO MCT thermal sight'],
    ['TLM-A2408', 'B24-TLM-008', 'Jaipur', 'Rajasthan Chemicals', 'Te 99.0% Glass Colorant', 'Blue-Green Glass', '99.0%', '6.24 g/cm3', '&#8377;640 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Asahi Te glass colorant'],
    ['TLM-A2409', 'B24-TLM-009', 'Guwahati', 'Assam Chemicals', 'Te 99.7% Selenium-Tellurium Photoreceptor', 'Laser Printer', '99.7%', '6.24 g/cm3', '&#8377;800 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'HP laser printer drum'],
    ['TLM-A2410', 'B24-TLM-010', 'Ahmedabad', 'Gujarat Chemicals', 'Te 99.999% Topological Insulator', 'Quantum Research', '99.999%', '6.24 g/cm3', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'IISc Bi2Te3 TI research'],
    ['TLM-A2411', 'B24-TLM-011', 'Lucknow', 'UP Chemicals', 'Te 99.4% Lead Telluride IR Emitter', 'Heat Lamp', '99.4%', '6.24 g/cm3', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Havells PbTe IR heater'],
    ['TLM-A2412', 'B24-TLM-012', 'Visakhapatnam', 'Vizag Chemicals', 'Te 99.95% Submarine Thermoelectric Generator', 'AIP Power', '99.95%', '6.24 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK AIP Te module'],
    ['TLM-A2413', 'B24-TLM-013', 'Balasore', 'DRDO TBRL', 'Te 99.8% Warship Thermal Imaging MCT', 'Naval FLIR', '99.8%', '6.24 g/cm3', '&#8377;920 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO warship IR MCT'],
    ['TLM-A2414', 'B24-TLM-014', 'Bhilai', 'SAIL Chemicals', 'Te 97% General Metallurgical', 'Steel Additive', '97.0%', '6.24 g/cm3', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL steel Te deox'],
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


# --- Generate Gallium Metal ---
gam_config = {
    'prefix': 'gam', 'icon': 'CloudRain', 'color': '#0369a1',
    'title': 'Gallium Metal Logistics',
    'subtitle': 'Ga GaAs wafer &#8226; GaN radar &#8226; GaInP solar &#8226; Submarine sonar array supply chain',
    'fn_name': 'GalliumMetalLogisticsView',
}
with open('src/components/modules/gallium-metal-logistics-view.tsx', 'w') as f:
    f.write(gen_module(gam_records, gam_config))
print("Generated: gallium-metal-logistics-view.tsx")

# --- Generate Tellurium Metal ---
tlm_config = {
    'prefix': 'tlm', 'icon': 'Key', 'color': '#9333ea',
    'title': 'Tellurium Metal Logistics',
    'subtitle': 'Te CdTe solar &#8226; Bi2Te3 thermoelectric &#8226; PCM memory &#8226; Submarine AIP supply chain',
    'fn_name': 'TelluriumMetalLogisticsView',
}
with open('src/components/modules/tellurium-metal-logistics-view.tsx', 'w') as f:
    f.write(gen_module(tlm_records, tlm_config))
print("Generated: tellurium-metal-logistics-view.tsx")

# --- Verify ---
for fname in ['src/components/modules/gallium-metal-logistics-view.tsx', 'src/components/modules/tellurium-metal-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
