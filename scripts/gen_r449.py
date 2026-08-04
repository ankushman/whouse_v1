#!/usr/bin/env python3
"""R449 generator: Scandium Oxide + Manganese Electrolytic logistics modules.
All record values are strings to avoid TSC union type issues."""
import re, os

TEMPLATE = "src/components/modules/zinc-oxide-logistics-view.tsx"
OUT_DIR = "src/components/modules"

def fmt_record(r):
    parts = [f"'{r[0]}'", f"'{r[1]}'", f"'{r[2]}'", f"'{r[3]}'", f"'{r[4]}'",
             f"'{r[5]}'", f"'{r[6]}'", f"'{r[7]}'", f"'{r[8]}'", f"'{r[9]}'",
             f"'{r[10]}'", f"'{r[11]}'", f"'{r[12]}'", f"'{r[13]}'", f"'{r[14]}'",
             f"'{r[15]}'", f"'{r[16]}'"]
    return '  [' + ', '.join(parts) + ']'

def generate_module(mod):
    with open(TEMPLATE) as f:
        content = f.read()
    content = re.sub(
        r"import \{ \w+ \} from 'lucide-react'",
        f"import {{ {mod['icon']} }} from 'lucide-react'", content
    )
    content = re.sub(r'const \w+_RECORDS', f"const {mod['var']}_RECORDS", content)
    rec_block = ',\n'.join(fmt_record(r) for r in mod['records'])
    content = re.sub(
        r"const \w+_RECORDS = \[.*?\];",
        f"const {mod['var']}_RECORDS = [\n{rec_block}\n];",
        content, flags=re.DOTALL
    )
    content = re.sub(
        r'export default function \w+',
        f"export default function {mod['func']}", content
    )
    content = re.sub(
        r'return \w+_RECORDS\.filter',
        f"return {mod['var']}_RECORDS.filter", content
    )
    content = re.sub(
        r'<\w+ className="w-5 h-5"',
        f"<{mod['icon']} className=\"w-5 h-5\"", content
    )
    for _ in range(2):
        content = re.sub(r"color: '[^']+'", f"color: '{mod['color']}'", content, count=1)
    content = re.sub(
        r"backgroundColor: '[^']+'",
        f"backgroundColor: '{mod['color']}22'", content
    )
    content = re.sub(
        r'<h2 className="text-xl font-bold">[^<]+</h2>',
        f'<h2 className="text-xl font-bold">{mod["title"]} Logistics</h2>', content
    )
    content = re.sub(
        r'<p className="text-sm text-gray-400">[^<]+</p>',
        f'<p className="text-sm text-gray-400">{mod["subtitle"]}</p>', content
    )
    out_path = os.path.join(OUT_DIR, mod['filename'])
    with open(out_path, 'w') as f:
        f.write(content)
    print(f"Generated {out_path} ({len(content.splitlines())} lines)")

scandium_records = [
    ["SCO-A2401","SCO-2024-B001","Hyderabad","MIDHANI","Sc2O3 99.99% Aerospace Alloy","Al-Li-Sc aerospace structural","99.99%","density 3.86 g/cm3","&#8377;960 Cr","In Transit","Critical","Mumbai","Hyderabad","2024-03-15","10","Central","ISRO GSLV Mk-III tank dome"],
    ["SCO-A2402","SCO-2024-B002","Bengaluru","DRDO DMRL","Sc2O3 99.9% Fighter Jet Panel","Al-Mg-Sc fighter fuselage skin","99.9%","yield 380 MPa","&#8377;940 Cr","Delivered","High","Chennai","Bengaluru","2024-03-10","7","South","Tejas Mk2 wing panel batch"],
    ["SCO-A2403","SCO-2024-B003","Mumbai","Tata Chemicals","Sc2O3 99.7% Baseball Bat","Al-Sc high-performance bat","99.7%","density 2.78 g/cm3","&#8377;720 Cr","Processing","Medium","Kolkata","Mumbai","2024-03-20","6","West","Tata sports equipment alloy"],
    ["SCO-A2404","SCO-2024-B004","Chennai","Bharat Forge","Sc2O3 99.5% Bicycle Frame","Al-Sc lightweight bicycle","99.5%","tensile 420 MPa","&#8377;700 Cr","In Transit","Medium","Delhi","Chennai","2024-03-18","9","South","Premium cycle frame export"],
    ["SCO-A2405","SCO-2024-B005","Delhi","Shyam Chemicals","Sc2O3 99.3% Solid Oxide Fuel Cell","ScSZ electrolyte membrane","99.3%","ionic cond 0.1 S/cm","&#8377;880 Cr","Stored","Low","Jaipur","Delhi","2024-02-28","4","North","SOFC fuel cell stack"],
    ["SCO-A2406","SCO-2024-B006","Kolkata","BHEL R&amp;D","Sc2O3 99.8% Laser Crystal","Sc-doped GGG substrate","99.8%","lattice 12.38 A","&#8377;900 Cr","In Transit","High","Vishakhapatnam","Kolkata","2024-03-22","12","East","BHEL laser diode substrate"],
    ["SCO-A2407","SCO-2024-B007","Jaipur","Godrej Chemicals","Sc2O3 99.0% Metal Halide Lamp","ScI3 lamp arc tube","99.0%","CRI 96","&#8377;680 Cr","Stored","Low","Mumbai","Jaipur","2024-02-25","5","West","Studio lighting lamp batch"],
    ["SCO-A2408","SCO-2024-B008","Ahmedabad","Rajasthan Chemicals","Sc2O3 98.5% Ceramic Capacitor","Sc-doped BaTiO3 KPM","98.5%","K 3500 dielectric","&#8377;860 Cr","In Transit","Medium","Jodhpur","Ahmedabad","2024-03-25","7","West","MLCC multilayer capacitor"],
    ["SCO-A2409","SCO-2024-B009","Guwahati","Assam Chemicals","Sc2O3 99.6% Optical Glass","High-refractive lens glass","99.6%","n 1.88 RI","&#8377;880 Cr","Processing","Medium","Dibrugarh","Guwahati","2024-03-12","3","East","Camera lens glass batch"],
    ["SCO-A2410","SCO-2024-B010","Lucknow","UP Chemicals","Sc2O3 99.95% Submarine Hull","Al-Mg-Sc submarine pressure hull","99.95%","yield 450 MPa","&#8377;960 Cr","In Transit","Critical","Vishakhapatnam","Lucknow","2024-03-28","10","North","IN Navy submarine hull alloy"],
    ["SCO-A2411","SCO-2024-B011","Pune","Gujarat Chemicals","Sc2O3 99.2% Welding Wire","Al-Sc filler wire 5356","99.2%","fluidity 98%","&#8377;820 Cr","Stored","Medium","Surat","Pune","2024-03-05","4","West","Aerospace weld wire stock"],
    ["SCO-A2412","SCO-2024-B012","Vishakhapatnam","Vizag Chemicals","Sc2O3 99.8% Warship Superstructure","Al-Sc naval superstructure","99.8%","yield 400 MPa","&#8377;960 Cr","Delayed","Critical","Chennai","Vishakhapatnam","2024-02-15","28","South","Monsoon delay naval depot"],
    ["SCO-A2413","SCO-2024-B013","Bhubaneswar","DRDO TBRL","Sc2O3 99.4% Missile Airframe","Al-Li-Sc missile body tube","99.4%","density 2.64 g/cm3","&#8377;940 Cr","In Transit","High","Balasore","Bhubaneswar","2024-03-30","2","East","DRDO Astra missile airframe"],
    ["SCO-A2414","SCO-2024-B014","Rourkela","SAIL Chemicals","Sc2O3 97% General Chemical","Industrial grain refiner","97.0%","Al grain 15um","&#8377;640 Cr","Stored","Low","Ranchi","Rourkela","2024-02-20","3","East","SAIL aluminum grain refiner"],
]

manganese_records = [
    ["MNE-A2401","MNE-2024-B001","Mumbai","MIDHANI","Mn 99.9% Electrolytic Battery","Li-ion NMC cathode precursor","99.9%","purity 99.9%","&#8377;900 Cr","In Transit","Critical","Delhi","Mumbai","2024-03-15","8","West","EV battery cathode plant"],
    ["MNE-A2402","MNE-2024-B002","Bengaluru","DRDO DMRL","Mn 99.7% Steel Deoxidizer","Steel ladle deoxidation","99.7%","Mn recovery 92%","&#8377;840 Cr","Delivered","High","Chennai","Bengaluru","2024-03-10","5","South","BHEL steel plant deox batch"],
    ["MNE-A2403","MNE-2024-B003","Hyderabad","Tata Chemicals","Mn 99.5% Aluminum Alloy","Al-Mn 3003 series alloy","99.5%","tensile 130 MPa","&#8377;760 Cr","Processing","Medium","Vishakhapatnam","Hyderabad","2024-03-20","6","Central","Tata beverage can stock"],
    ["MNE-A2404","MNE-2024-B004","Chennai","Bharat Forge","Mn 99.3% Ferromanganese","FeMn 75% alloy","99.3%","C content 1.2%","&#8377;800 Cr","In Transit","Medium","Kolkata","Chennai","2024-03-18","10","South","SAIL blast furnace charge"],
    ["MNE-A2405","MNE-2024-B005","Delhi","Shyam Chemicals","Mn 99.8% Potassium Permanganate","KMnO4 water treatment","99.8%","purity 99.5% KMnO4","&#8377;880 Cr","Stored","Low","Jaipur","Delhi","2024-02-28","4","North","Municipal water treatment"],
    ["MNE-A2406","MNE-2024-B006","Kolkata","BHEL R&amp;D","Mn 99.6% Silicomanganese","SiMn 65-17 alloy","99.6%","Si 17% Mn 65%","&#8377;860 Cr","In Transit","High","Vishakhapatnam","Kolkata","2024-03-22","12","East","BHEL steel desulfurization"],
    ["MNE-A2407","MNE-2024-B007","Jaipur","Godrej Chemicals","Mn 99.0% Dry Cell Battery","Zn-Mn alkaline AA cell","99.0%","capacity 2850 mAh","&#8377;720 Cr","Stored","Low","Mumbai","Jaipur","2024-02-25","5","West","Godrej battery division"],
    ["MNE-A2408","MNE-2024-B008","Ahmedabad","Rajasthan Chemicals","Mn 98.5% Welding Flux","Submerged arc welding flux","98.5%","basicity index 1.2","&#8377;780 Cr","In Transit","Medium","Jodhpur","Ahmedabad","2024-03-25","7","West","Pipeline weld flux supply"],
    ["MNE-A2409","MNE-2024-B009","Guwahati","Assam Chemicals","Mn 99.4% Fertilizer Micro","Mn-EDTA micronutrient","99.4%","solubility 150 g/L","&#8377;700 Cr","Processing","Medium","Dibrugarh","Guwahati","2024-03-12","3","East","Tea garden Mn fertilizer"],
    ["MNE-A2410","MNE-2024-B010","Lucknow","UP Chemicals","Mn 99.95% Submarine Battery","LiMn2O4 submarine cell","99.95%","energy 120 Wh/kg","&#8377;960 Cr","In Transit","Critical","Vishakhapatnam","Lucknow","2024-03-28","11","North","IN Navy submarine battery bank"],
    ["MNE-A2411","MNE-2024-B011","Pune","Gujarat Chemicals","Mn 99.2% Ferrite Core","MnZn soft ferrite core","99.2%","mu 2000 initial","&#8377;820 Cr","Stored","Medium","Surat","Pune","2024-03-05","4","West","SMPS transformer core"],
    ["MNE-A2412","MNE-2024-B012","Vishakhapatnam","Vizag Chemicals","Mn 99.8% Warship Steel Armor","Special naval steel Mn alloy","99.8%","yield 690 MPa","&#8377;960 Cr","Delayed","Critical","Chennai","Vishakhapatnam","2024-02-15","28","South","Monsoon delay naval armor"],
    ["MNE-A2413","MNE-2024-B013","Bhubaneswar","DRDO TBRL","Mn 99.4% Missile Propellant","MnO2 ammonium perchlorate","99.4%","decomp temp 535 degC","&#8377;940 Cr","In Transit","High","Balasore","Bhubaneswar","2024-03-30","2","East","DRDO missile solid propellant"],
    ["MNE-A2414","MNE-2024-B014","Rourkela","SAIL Chemicals","Mn 97% General Chemical","Industrial ferroalloy grade","97.0%","Fe impurity 2%","&#8377;640 Cr","Stored","Low","Ranchi","Rourkela","2024-02-20","3","East","SAIL foundry alloy charge"],
]

modules = [
    {
        "filename": "scandium-oxide-logistics-view.tsx",
        "var": "SCO",
        "func": "ScandiumOxideLogisticsView",
        "icon": "Fingerprint",
        "color": "#059669",
        "title": "Scandium Oxide",
        "subtitle": "Sc2O3 aerospace alloy, SOFC fuel cell, laser crystal, naval superstructure supply chain tracking",
        "records": scandium_records,
    },
    {
        "filename": "manganese-electrolytic-logistics-view.tsx",
        "var": "MNE",
        "func": "ManganeseElectrolyticLogisticsView",
        "icon": "Droplet",
        "color": "#4338ca",
        "title": "Manganese Electrolytic",
        "subtitle": "Mn electrolytic battery cathode, steel deoxidizer, welding flux, submarine battery supply chain tracking",
        "records": manganese_records,
    },
]

for mod in modules:
    generate_module(mod)
print("R449 generation complete: 2 modules")
