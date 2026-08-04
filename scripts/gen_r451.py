#!/usr/bin/env python3
"""R451 generator: Tungsten Metal + Phosphorus Red logistics modules."""
import re, os

TEMPLATE = "src/components/modules/zinc-oxide-logistics-view.tsx"
OUT_DIR = "src/components/modules"

def fmt_record(r):
    parts = [f"'{r[i]}'" for i in range(len(r))]
    return '  [' + ', '.join(parts) + ']'

def generate_module(mod):
    with open(TEMPLATE) as f:
        content = f.read()
    content = re.sub(r"import \{ \w+ \} from 'lucide-react'", f"import {{ {mod['icon']} }} from 'lucide-react'", content)
    content = re.sub(r'const \w+_RECORDS', f"const {mod['var']}_RECORDS", content)
    rec_block = ',\n'.join(fmt_record(r) for r in mod['records'])
    content = re.sub(r"const \w+_RECORDS = \[.*?\];", f"const {mod['var']}_RECORDS = [\n{rec_block}\n];", content, flags=re.DOTALL)
    content = re.sub(r'export default function \w+', f"export default function {mod['func']}", content)
    content = re.sub(r'return \w+_RECORDS\.filter', f"return {mod['var']}_RECORDS.filter", content)
    content = re.sub(r'<\w+ className="w-5 h-5"', f"<{mod['icon']} className=\"w-5 h-5\"", content)
    for _ in range(2):
        content = re.sub(r"color: '[^']+'", f"color: '{mod['color']}'", content, count=1)
    content = re.sub(r"backgroundColor: '[^']+'", f"backgroundColor: '{mod['color']}22'", content)
    content = re.sub(r'<h2 className="text-xl font-bold">[^<]+</h2>', f'<h2 className="text-xl font-bold">{mod["title"]} Logistics</h2>', content)
    content = re.sub(r'<p className="text-sm text-gray-400">[^<]+</p>', f'<p className="text-sm text-gray-400">{mod["subtitle"]}</p>', content)
    out_path = os.path.join(OUT_DIR, mod['filename'])
    with open(out_path, 'w') as f:
        f.write(content)
    print(f"Generated {out_path} ({len(content.splitlines())} lines)")

# 17 fields: id, batchNo, city, mfr, grade, app, purity, specProp, investCr, status, priority, origin, dest, shipDate, transitDays, zone, remarks
tungsten_records = [
    ["TUM-A2401","TUM-2024-B001","Mumbai","MIDHANI","W 99.95% Kinetic Penetrator","W-Ni-Fe heavy alloy penetrator","99.95%","density 19.25 g/cm3","&#8377;960 Cr","In Transit","Critical","Delhi","Mumbai","2024-03-15","9","West","DRDO anti-tank fin-stabilized dart"],
    ["TUM-A2402","TUM-2024-B002","Bengaluru","DRDO DMRL","W 99.9% Rocket Nozzle","W-Cu throat insert nozzle","99.9%","melting point 3422 degC","&#8377;940 Cr","Delivered","High","Chennai","Bengaluru","2024-03-10","6","South","ISRO S200 W-Cu nozzle throat"],
    ["TUM-A2403","TUM-2024-B003","Hyderabad","Tata Chemicals","W 99.7% TIG Welding","W inert gas electrode","99.7%","electron work 4.5eV","&#8377;800 Cr","Processing","Medium","Kolkata","Hyderabad","2024-03-20","7","Central","Tata Steel pipe weld electrode"],
    ["TUM-A2404","TUM-2024-B004","Chennai","Bharat Forge","W 99.5% Counterweight","W alloy crane counterweight","99.5%","density 18.7 g/cm3","&#8377;760 Cr","In Transit","Medium","Delhi","Chennai","2024-03-18","10","South","Port crane balance weight"],
    ["TUM-A2405","TUM-2024-B005","Delhi","Shyam Chemicals","W 99.3% Radiation Shield","W medical linear accelerator","99.3%","half-value 3.4mm Pb eq","&#8377;880 Cr","Stored","Low","Jaipur","Delhi","2024-02-28","4","North","AIIMS LINAC collimator"],
    ["TUM-A2406","TUM-2024-B006","Kolkata","BHEL R&amp;D","W 99.8% Turbine Blade","W-Ni-Co superalloy disc","99.8%","creep 1100 degC","&#8377;920 Cr","In Transit","High","Vishakhapatnam","Kolkata","2024-03-22","12","East","HAL HTFE-20 engine disc"],
    ["TUM-A2407","TUM-2024-B007","Jaipur","Godrej Chemicals","W 99.0% Light Bulb Filament","W incandescent coil filament","99.0%","melting point 3422 degC","&#8377;700 Cr","Stored","Low","Mumbai","Jaipur","2024-02-25","5","West","Halogen bulb coil stock"],
    ["TUM-A2408","TUM-2024-B008","Ahmedabad","Rajasthan Chemicals","W 99.6% X-Ray Target","Rotating anode W target","99.6%","emission L-alpha 8.4keV","&#8377;860 Cr","In Transit","Medium","Jodhpur","Ahmedabad","2024-03-25","7","West","CT scan rotating anode"],
    ["TUM-A2409","TUM-2024-B009","Guwahati","Assam Chemicals","W 99.4% Superalloy","W-base OSW superalloy","99.4%","yield 800 MPa 1000 degC","&#8377;900 Cr","Processing","Medium","Dibrugarh","Guwahati","2024-03-12","3","East","GTRE high-temp disc alloy"],
    ["TUM-A2410","TUM-2024-B010","Lucknow","UP Chemicals","W 99.95% Submarine Torpedo","W heavy alloy torpedo weight","99.95%","density 19.25 g/cm3","&#8377;960 Cr","In Transit","Critical","Vishakhapatnam","Lucknow","2024-03-28","11","North","IN Navy heavyweight torpedo"],
    ["TUM-A2411","TUM-2024-B011","Pune","Gujarat Chemicals","W 99.2% Plasma Torch","W plasma arc torch electrode","99.2%","erosion rate 0.5 mg/s","&#8377;820 Cr","Stored","Medium","Surat","Pune","2024-03-05","4","West","Cutting torch electrode"],
    ["TUM-A2412","TUM-2024-B012","Vishakhapatnam","Vizag Chemicals","W 99.8% Warship Ammo","W alloy armor-piercing round","99.8%","penetration 800mm RHA","&#8377;960 Cr","Delayed","Critical","Chennai","Vishakhapatnam","2024-02-15","28","South","Monsoon delay naval depot"],
    ["TUM-A2413","TUM-2024-B013","Bhubaneswar","DRDO TBRL","W 99.4% Missile Shaped Charge","W-copper liner shaped charge","99.4%","jet tip velocity 8 km/s","&#8377;940 Cr","In Transit","High","Balasore","Bhubaneswar","2024-03-30","2","East","DRDO HELINA ATGM warhead"],
    ["TUM-A2414","TUM-2024-B014","Rourkela","SAIL Chemicals","W 97% General Alloy","Foundry W grain refiner","97.0%","Fe impurity 2%","&#8377;640 Cr","Stored","Low","Ranchi","Rourkela","2024-02-20","3","East","SAIL superalloy charge"],
]

phosphorus_records = [
    ["PHR-A2401","PHR-2024-B001","Mumbai","MIDHANI","P 99.99% Phosphor Bronze","Sn-P alloy bearing shell","99.99%","melting point 993 degC","&#8377;920 Cr","In Transit","Critical","Delhi","Mumbai","2024-03-15","8","West","DRDO missile actuator bearing"],
    ["PHR-A2402","PHR-2024-B002","Bengaluru","DRDO DMRL","P 99.9% WP Smoke Screen","WP military smoke grenade","99.9%","auto-ignite 34 degC","&#8377;940 Cr","Delivered","High","Chennai","Bengaluru","2024-03-10","6","South","Infantry WP smoke canister"],
    ["PHR-A2403","PHR-2024-B003","Hyderabad","Tata Chemicals","P 99.7% Safety Match","Red phosphorus match head","99.7%","friction ignite 260 degC","&#8377;680 Cr","Processing","Medium","Kolkata","Hyderabad","2024-03-20","7","Central","Wimco safety match plant"],
    ["PHR-A2404","PHR-2024-B004","Chennai","Bharat Forge","P 99.5% Flame Retardant","APP flame retardant textile","99.5%","LOI increase 12%","&#8377;760 Cr","In Transit","Medium","Delhi","Chennai","2024-03-18","9","South","Railway seat FR treatment"],
    ["PHR-A2405","PHR-2024-B005","Delhi","Shyam Chemicals","P 99.3% Semiconductor","N-type P dopant wafer","99.3%","carrier conc 1e15","&#8377;880 Cr","Stored","Low","Jaipur","Delhi","2024-02-28","4","North","SCL silicon foundry dopant"],
    ["PHR-A2406","PHR-2024-B006","Kolkata","BHEL R&amp;D","P 99.8% Fertilizer","DAP/MAP phosphate fert","99.8%","P2O5 46% grade","&#8377;800 Cr","In Transit","High","Vishakhapatnam","Kolkata","2024-03-22","12","East","IFFCO DAP fertilizer plant"],
    ["PHR-A2407","PHR-2024-B007","Jaipur","Godrej Chemicals","P 99.0% Food Additive","Sodium phosphate food grade","99.0%","FSSAI certified","&#8377;660 Cr","Stored","Low","Mumbai","Jaipur","2024-02-25","5","West","Bakery leavening agent"],
    ["PHR-A2408","PHR-2024-B008","Ahmedabad","Rajasthan Chemicals","P 99.6% Steel Deoxidizer","Ferro-phosphorus steel additive","99.6%","P content 25%","&#8377;720 Cr","In Transit","Medium","Jodhpur","Ahmedabad","2024-03-25","7","West","SAIL steel deox batch"],
    ["PHR-A2409","PHR-2024-B009","Guwahati","Assam Chemicals","P 99.4% Lithium Battery","LiFePO4 cathode material","99.4%","capacity 160 mAh/g","&#8377;900 Cr","Processing","Medium","Dibrugarh","Guwahati","2024-03-12","3","East","EV LFP cell cathode"],
    ["PHR-A2410","PHR-2024-B010","Lucknow","UP Chemicals","P 99.95% Submarine Battery","LiFePO4 submarine cell","99.95%","cycle life 6000","&#8377;960 Cr","In Transit","Critical","Vishakhapatnam","Lucknow","2024-03-28","11","North","IN Navy submarine LFP bank"],
    ["PHR-A2411","PHR-2024-B011","Pune","Gujarat Chemicals","P 99.2% Detergent","STPP detergent builder","99.2%","Na5P3O10 94%","&#8377;700 Cr","Stored","Medium","Surat","Pune","2024-03-05","4","West","Surf Excel STPP supply"],
    ["PHR-A2412","PHR-2024-B012","Vishakhapatnam","Vizag Chemicals","P 99.8% Warship Incendiary","WP naval incendiary round","99.8%","burn temp 2760 degC","&#8377;960 Cr","Delayed","Critical","Chennai","Vishakhapatnam","2024-02-15","28","South","Monsoon delay naval depot"],
    ["PHR-A2413","PHR-2024-B013","Bhubaneswar","DRDO TBRL","P 99.4% Missile Tracer","WP tracer flare composition","99.4%","burn time 4.5s","&#8377;940 Cr","In Transit","High","Balasore","Bhubaneswar","2024-03-30","2","East","DRDO missile tracer element"],
    ["PHR-A2414","PHR-2024-B014","Rourkela","SAIL Chemicals","P 97% Industrial Grade","Phosphoric acid 85% tech","97.0%","H3PO4 85% conc","&#8377;640 Cr","Stored","Low","Ranchi","Rourkela","2024-02-20","3","East","Industrial acid plant"],
]

modules = [
    {
        "filename": "tungsten-metal-logistics-view.tsx",
        "var": "TUM",
        "func": "TungstenMetalLogisticsView",
        "icon": "Swords",
        "color": "#1e293b",
        "title": "Tungsten Metal",
        "subtitle": "W kinetic penetrator, rocket nozzle, turbine blade, radiation shield, submarine torpedo supply chain tracking",
        "records": tungsten_records,
    },
    {
        "filename": "phosphorus-red-logistics-view.tsx",
        "var": "PHR",
        "func": "PhosphorusRedLogisticsView",
        "icon": "SprayCan",
        "color": "#dc2626",
        "title": "Phosphorus Red",
        "subtitle": "P red phosphor bronze, WP smoke screen, flame retardant, LiFePO4 battery, naval incendiary supply chain tracking",
        "records": phosphorus_records,
    },
]

for mod in modules:
    generate_module(mod)
print("R451 generation complete: 2 modules")
