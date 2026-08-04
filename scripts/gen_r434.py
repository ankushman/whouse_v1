#!/usr/bin/env python3
"""R434 Generator: Strontium Titanate (SrTiO3) + Yttrium Oxide (Y2O3) logistics modules."""
import re

TEMPLATE = "/home/z/my-project/src/components/modules/aluminium-nitride-logistics-view.tsx"
OUT_DIR = "/home/z/my-project/src/components/modules"

def clone_module(slug_var, slug_camel, icon, hex_color, title, subtitle, spec_label, spec_unit, records):
    dst = f"{OUT_DIR}/{slug_var.replace('_','-')}-logistics-view.tsx"
    with open(TEMPLATE, 'r') as f:
        content = f.read()
    old_icon = re.search(r"import \{ (\w+) \} from 'lucide-react';", content).group(1)
    content = content.replace(f"import {{ {old_icon} }} from 'lucide-react';", f"import {{ {icon} }} from 'lucide-react';")
    old_var = re.search(r'const (\w+_RECORDS) =', content).group(1)
    content = content.replace(f'const {old_var} =', f'const {slug_var}_RECORDS =')
    content = content.replace(f'return {old_var}.filter', f'return {slug_var}_RECORDS.filter')
    old_fn = re.search(r'export default function (\w+LogisticsView)', content).group(1)
    content = content.replace(f'function {old_fn}()', f'function {slug_camel}LogisticsView()')
    old_colors = re.findall(r"'#[0-9a-fA-F]{6}'", content)
    if old_colors:
        content = content.replace(old_colors[0], f"'{hex_color}'")
    content = content.replace(f'<{old_icon} className', f'<{icon} className')
    content = re.sub(r'<h2 className="text-xl font-bold">.*?</h2>', f'<h2 className="text-xl font-bold">{title}</h2>', content)
    content = re.sub(r'<p className="text-sm text-gray-400">.*?</p>', f'<p className="text-sm text-gray-400">{subtitle}</p>', content, count=1)
    content = re.sub(r'>\w[\w\s]+\w Distribution</h3>', f'>{spec_label} Distribution</h3>', content)
    content = re.sub(r'\{\{r\[7\]\}\} \w[\w/]+</span>', f'{{r[7]}} {spec_unit}</span>', content)
    rec_str = "\n".join("  [" + ", ".join(f"'{x}'" for x in r) + "]," for r in records)
    content = re.sub(r'const \w+_RECORDS = \[\n.*?\n\];', f'const {slug_var}_RECORDS = [\n{rec_str}\n];', content, flags=re.DOTALL)
    with open(dst, 'w') as f:
        f.write(content)
    print(f"  Written: {dst}")
    return dst


# ===== MODULE 1: Strontium Titanate (SrTiO3) =====
# Microwave resonator, DRAM capacitor, substrate, thermistor, ferroelectric
srtio3_records = [
  ("STO-A2401","B24-STO-001","Bengaluru","MIDHANI","SrTiO3 99.99% Substrate Wafer","GaN-on-STO","99.99%","2353 K","&#8377;920 Cr","in-transit","critical","Bengaluru","Hyderabad","2024-07-15","3","South"),
  ("STO-A2402","B24-STO-002","Hyderabad","DRDO DMRL","SrTiO3 99.9% Microwave Resonator","Radar Filter","99.9%","2350 K","&#8377;900 Cr","delivered","critical","Hyderabad","Hyderabad","2024-07-10","1","South"),
  ("STO-A2403","B24-STO-003","Mumbai","Tata Electronics","SrTiO3 99.95% DRAM Capacitor","High-k Stack","99.95%","2353 K","&#8377;940 Cr","in-transit","critical","Mumbai","Pune","2024-07-18","2","West"),
  ("STO-A2404","B24-STO-004","Chennai","Bharat Forge","SrTiO3 99.0% Thermistor","Temp Sensor","99.0%","2340 K","&#8377;720 Cr","delivered","medium","Chennai","Chennai","2024-07-08","0","South"),
  ("STO-A2405","B24-STO-005","Kolkata","Shyam Ceramics","SrTiO3 99.7% Ferroelectric","FeRAM Gate","99.7%","2352 K","&#8377;860 Cr","in-transit","high","Kolkata","Kolkata","2024-07-20","1","East"),
  ("STO-A2406","B24-STO-006","Noida","BHEL R&amp;D","SrTiO3 99.5% Boundary Layer","YBCO Buffer","99.5%","2348 K","&#8377;800 Cr","delivered","high","Noida","Noida","2024-07-12","0","North"),
  ("STO-A2407","B24-STO-007","Pune","Godrej Ceramics","SrTiO3 99.8% Varactor Tuning","5G RF","99.8%","2351 K","&#8377;880 Cr","in-transit","critical","Pune","Mumbai","2024-07-16","2","West"),
  ("STO-A2408","B24-STO-008","Jaipur","Rajasthan Ceramics","SrTiO3 98.5% Gas Sensor","NOx Detect","98.5%","2330 K","&#8377;680 Cr","delivered","medium","Jaipur","Delhi","2024-07-09","2","North"),
  ("STO-A2409","B24-STO-009","Guwahati","Assam Ceramics","SrTiO3 99.6% PTC Thermistor","Motor Protector","99.6%","2349 K","&#8377;800 Cr","in-transit","high","Guwahati","Kolkata","2024-07-22","4","East"),
  ("STO-A2410","B24-STO-010","Ahmedabad","Gujarat Ceramics","SrTiO3 99.98% Quantum Well","Oxide Hetero","99.98%","2353 K","&#8377;960 Cr","pending","critical","Ahmedabad","Bengaluru","2024-07-25","3","West"),
  ("STO-A2411","B24-STO-011","Lucknow","UP Ceramics","SrTiO3 99.3% Capacitor Dielectric","MLCC Layer","99.3%","2345 K","&#8377;760 Cr","delivered","high","Lucknow","Noida","2024-07-11","2","North"),
  ("STO-A2412","B24-STO-012","Visakhapatnam","Vizag Ceramics","SrTiO3 99.9% Submarine Sonar","Acoustic Match","99.9%","2350 K","&#8377;940 Cr","delayed","critical","Visakhapatnam","Visakhapatnam","2024-07-06","28","South"),
  ("STO-A2413","B24-STO-013","Balasore","DRDO TBRL","SrTiO3 99.7% Phased Array","AESA Module","99.7%","2352 K","&#8377;900 Cr","in-transit","critical","Balasore","Chandipur","2024-07-19","2","East"),
  ("STO-A2414","B24-STO-014","Bhilai","SAIL Ceramics","SrTiO3 97% General Ceramic","Spark Plug","97.0%","2320 K","&#8377;640 Cr","delivered","low","Bhilai","Bhilai","2024-07-05","0","East"),
]

print("=== R434a: Strontium Titanate Logistics ===")
clone_module("strontium_titanate", "Strontium_Titanate", "Satellite", "7c3aed",
  "Strontium Titanate Logistics",
  "SrTiO3 perovskite substrate &#8226; Microwave resonator &#8226; High-k capacitor &#8226; Quantum well supply chain",
  "Curie Temperature", "K",
  srtio3_records)


# ===== MODULE 2: Yttrium Oxide (Y2O3) =====
# YAG laser host, phosphor, thermal barrier, superconductor, optical coating
y2o3_records = [
  ("Y2O-A2401","B24-Y2O-001","Mumbai","MIDHANI","Y2O3 99.99% YAG Laser Host","Nd:YAG Rod","99.99%","2430 degC","&#8377;940 Cr","in-transit","critical","Mumbai","Pune","2024-07-15","3","West"),
  ("Y2O-A2402","B24-Y2O-002","Bengaluru","DRDO DMRL","Y2O3 99.9% Missile Seeker","IR Window","99.9%","2420 degC","&#8377;920 Cr","delivered","critical","Bengaluru","Bengaluru","2024-07-10","1","South"),
  ("Y2O-A2403","B24-Y2O-003","Hyderabad","Tata Advanced Materials","Y2O3 99.95% Phosphor LED","White LED","99.95%","2430 degC","&#8377;880 Cr","in-transit","high","Hyderabad","Hyderabad","2024-07-18","2","South"),
  ("Y2O-A2404","B24-Y2O-004","Chennai","Bharat Forge","Y2O3 99.0% Thermal Barrier","GT Blade TBC","99.0%","2410 degC","&#8377;760 Cr","delivered","medium","Chennai","Chennai","2024-07-08","0","South"),
  ("Y2O-A2405","B24-Y2O-005","Kolkata","Shyam Ceramics","Y2O3 99.8% Sintering Aid","SiC Ceramic","99.8%","2425 degC","&#8377;840 Cr","in-transit","high","Kolkata","Kolkata","2024-07-20","1","East"),
  ("Y2O-A2406","B24-Y2O-006","Noida","BHEL R&amp;D","Y2O3 99.5% Optical Coating","Anti-Reflect","99.5%","2415 degC","&#8377;800 Cr","delivered","high","Noida","Noida","2024-07-12","0","North"),
  ("Y2O-A2407","B24-Y2O-007","Pune","Godrej Ceramics","Y2O3 99.7% Superconductor YBCO","HTS Wire","99.7%","2425 degC","&#8377;900 Cr","in-transit","critical","Pune","Mumbai","2024-07-16","2","West"),
  ("Y2O-A2408","B24-Y2O-008","Jaipur","Rajasthan Ceramics","Y2O3 98.5% Welding Rod","Tungsten Elec","98.5%","2400 degC","&#8377;700 Cr","delivered","medium","Jaipur","Bhilai","2024-07-09","2","North"),
  ("Y2O-A2409","B24-Y2O-009","Guwahati","Assam Ceramics","Y2O3 99.6% Glass Additive","Optical Glass","99.6%","2420 degC","&#8377;840 Cr","in-transit","high","Guwahati","Kolkata","2024-07-22","4","East"),
  ("Y2O-A2410","B24-Y2O-010","Ahmedabad","Gujarat Ceramics","Y2O3 99.98% Space Laser","LIDAR Trans","99.98%","2430 degC","&#8377;960 Cr","pending","critical","Ahmedabad","Sriharikota","2024-07-25","6","West"),
  ("Y2O-A2411","B24-Y2O-011","Lucknow","UP Ceramics","Y2O3 99.3% Plasma Spray","Turbine Coat","99.3%","2410 degC","&#8377;760 Cr","delivered","high","Lucknow","Lucknow","2024-07-11","0","North"),
  ("Y2O-A2412","B24-Y2O-012","Visakhapatnam","Vizag Ceramics","Y2O3 99.8% Submarine Periscope","IR Lens","99.8%","2425 degC","&#8377;940 Cr","delayed","critical","Visakhapatnam","Visakhapatnam","2024-07-06","28","South"),
  ("Y2O-A2413","B24-Y2O-013","Balasore","DRDO TBRL","Y2O3 99.7% Missile Dome","Radome Coat","99.7%","2420 degC","&#8377;880 Cr","in-transit","critical","Balasore","Chandipur","2024-07-19","2","East"),
  ("Y2O-A2414","B24-Y2O-014","Bhilai","SAIL Ceramics","Y2O3 97% General Refractory","Foundry","97.0%","2380 degC","&#8377;640 Cr","delivered","low","Bhilai","Bhilai","2024-07-05","0","East"),
]

print("\n=== R434b: Yttrium Oxide Logistics ===")
clone_module("yttrium_oxide", "Yttrium_Oxide", "Star", "dc2626",
  "Yttrium Oxide Logistics",
  "Y2O3 YAG laser host &#8226; Phosphor &#8226; Thermal barrier &#8226; Superconductor supply chain",
  "Melting Point", "degC",
  y2o3_records)

print("\n=== R434 Generation Complete ===")
