#!/usr/bin/env python3
"""R448 generator: Lutetium Oxide + Thulium Oxide logistics modules.
FIXED: investCr and transitDays as strings (matching template pattern)."""
import re, os

TEMPLATE = "src/components/modules/zinc-oxide-logistics-view.tsx"
OUT_DIR = "src/components/modules"

def fmt_record(r):
    # 17-element tuple: all values as strings to avoid TSC union type issues
    # (id, batchNo, city, mfr, grade, app, purity, specProp, investCr, status, priority, origin, dest, shipDate, transitDays, zone, remarks)
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
    # Replace color (2 occurrences)
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

lutetium_records = [
    ["LUO-A2401","LUO-2024-B001","Hyderabad","MIDHANI","Lu2O3 99.99% PET Scintillator","Lu-doped GSO scintillator crystal","99.99%","density 9.42 g/cm3","&#8377;960 Cr","In Transit","Critical","Mumbai","Hyderabad","2024-03-15","12","Central","DRDO nuclear imaging priority"],
    ["LUO-A2402","LUO-2024-B002","Bengaluru","DRDO DMRL","Lu2O3 99.9% Refractory Liner","High-temp furnace refractory","99.9%","melting point 2490 degC","&#8377;940 Cr","Delivered","High","Chennai","Bengaluru","2024-03-10","8","South","ISRO rocket nozzle liner"],
    ["LUO-A2403","LUO-2024-B003","Mumbai","Tata Chemicals","Lu2O3 99.7% Laser Crystal","Lu-doped YAG gain media","99.7%","emission 975nm","&#8377;920 Cr","Processing","Medium","Kolkata","Mumbai","2024-03-20","6","West","Tata laser research lab"],
    ["LUO-A2404","LUO-2024-B004","Chennai","Bharat Forge","Lu2O3 99.5% Ceramic Capacitor","Lu-doped KPM dielectric","99.5%","K 2400 dielectric","&#8377;900 Cr","In Transit","Medium","Delhi","Chennai","2024-03-18","10","North","Defense electronics capacitor"],
    ["LUO-A2405","LUO-2024-B005","Delhi","Shyam Chemicals","Lu2O3 99.3% Glass Additive","Refractive index modifier","99.3%","n 2.12 RI","&#8377;880 Cr","Stored","Low","Jaipur","Delhi","2024-02-28","4","North","Specialty glass batch"],
    ["LUO-A2406","LUO-2024-B006","Kolkata","BHEL R&amp;D","Lu2O3 99.8% Catalyst","Petroleum cracking catalyst","99.8%","surface area 12 m2/g","&#8377;920 Cr","In Transit","High","Vishakhapatnam","Kolkata","2024-03-22","14","East","BHEL power plant catalyst"],
    ["LUO-A2407","LUO-2024-B007","Jaipur","Godrej Chemicals","Lu2O3 99.0% Phosphor","X-ray phosphor activator","99.0%","emission 450nm blue","&#8377;860 Cr","Stored","Low","Mumbai","Jaipur","2024-02-25","5","West","Godrej imaging division"],
    ["LUO-A2408","LUO-2024-B008","Ahmedabad","Rajasthan Chemicals","Lu2O3 98.5% Nuclear Reactor","Neutron poison absorber","98.5%","sigma 106 barns thermal","&#8377;940 Cr","In Transit","Critical","Jodhpur","Ahmedabad","2024-03-25","7","West","Nuclear power corp absorber"],
    ["LUO-A2409","LUO-2024-B009","Guwahati","Assam Chemicals","Lu2O3 99.6% Optical Coating","Thin film AR coating","99.6%","n 2.1 at 633nm","&#8377;900 Cr","Processing","Medium","Dibrugarh","Guwahati","2024-03-12","3","East","Optical lens coating line"],
    ["LUO-A2410","LUO-2024-B010","Lucknow","UP Chemicals","Lu2O3 99.95% Medical Isotope","Lu-177 generator precursor","99.95%","t1/2 6.71d Lu-177","&#8377;960 Cr","In Transit","Critical","Mumbai","Lucknow","2024-03-28","9","Central","Tata Memorial cancer therapy"],
    ["LUO-A2411","LUO-2024-B011","Pune","Gujarat Chemicals","Lu2O3 99.2% Flash Memory","MRAM spintronic layer","99.2%","rho 2.6 uOhm-cm","&#8377;920 Cr","Stored","Medium","Surat","Pune","2024-03-05","4","West","Semiconductor MRAM fab"],
    ["LUO-A2412","LUO-2024-B012","Vishakhapatnam","Vizag Chemicals","Lu2O3 99.8% Warship Reactor Shield","Naval reactor neutron shield","99.8%","sigma 106 barns thermal","&#8377;960 Cr","Delayed","Critical","Chennai","Vishakhapatnam","2024-02-15","28","South","Monsoon delay naval depot"],
    ["LUO-A2413","LUO-2024-B013","Bhubaneswar","DRDO TBRL","Lu2O3 99.4% Missile IR Window","Seeker dome IR transparent","99.4%","transmission 85% 3-5um","&#8377;940 Cr","In Transit","High","Balasore","Bhubaneswar","2024-03-30","2","East","DRDO missile seeker dome"],
    ["LUO-A2414","LUO-2024-B014","Rourkela","SAIL Chemicals","Lu2O3 97% General Chemical","Industrial grade alloy additive","97.0%","Fe impurity 0.8%","&#8377;860 Cr","Stored","Low","Ranchi","Rourkela","2024-02-20","3","East","SAIL steel additive batch"],
]

thulium_records = [
    ["TMO-A2401","TMO-2024-B001","Mumbai","MIDHANI","Tm2O3 99.99% Portable X-Ray","Tm-doped GSO portable detector","99.99%","density 7.58 g/cm3","&#8377;960 Cr","In Transit","Critical","Delhi","Mumbai","2024-03-15","10","West","Defense field hospital X-ray"],
    ["TMO-A2402","TMO-2024-B002","Bengaluru","DRDO DMRL","Tm2O3 99.9% Fiber Amplifier","Tm-doped fiber S-band amplifier","99.9%","emission 1470nm","&#8377;940 Cr","Delivered","High","Chennai","Bengaluru","2024-03-10","7","South","ISRO S-band telemetry amp"],
    ["TMO-A2403","TMO-2024-B003","Hyderabad","Tata Chemicals","Tm2O3 99.7% Laser Welding","Tm:YAG 2um industrial laser","99.7%","emission 2010nm CW","&#8377;920 Cr","Processing","Medium","Vishakhapatnam","Hyderabad","2024-03-20","8","Central","Tata heavy laser welder"],
    ["TMO-A2404","TMO-2024-B004","Chennai","Bharat Forge","Tm2O3 99.5% Upconversion","Green UC phosphor emitter","99.5%","emission 540nm green","&#8377;900 Cr","In Transit","Medium","Kolkata","Chennai","2024-03-18","11","South","Display tech UC phosphor"],
    ["TMO-A2405","TMO-2024-B005","Delhi","Shyam Chemicals","Tm2O3 99.3% Ceramic Glaze","Blue ceramic glaze tint","99.3%","CIE L*82 a*(-4) b*(-8)","&#8377;880 Cr","Stored","Low","Jaipur","Delhi","2024-02-28","4","North","Pottery glaze formulation"],
    ["TMO-A2406","TMO-2024-B006","Pune","BHEL R&amp;D","Tm2O3 99.8% Medical Laser","Tm:YAG tissue ablation laser","99.8%","emission 2010nm pulsed","&#8377;940 Cr","In Transit","High","Mumbai","Pune","2024-03-22","6","West","BHEL surgical laser unit"],
    ["TMO-A2407","TMO-2024-B007","Kolkata","Godrej Chemicals","Tm2O3 99.0% Glass Colorant","Blue glass colorant additive","99.0%","absorption 680nm peak","&#8377;860 Cr","Stored","Low","Guwahati","Kolkata","2024-02-25","5","East","Art glass batch"],
    ["TMO-A2408","TMO-2024-B008","Ahmedabad","Rajasthan Chemicals","Tm2O3 98.5% Arc Lamp Electrode","Metal halide lamp electrode","98.5%","work function 2.8eV","&#8377;900 Cr","In Transit","Medium","Jodhpur","Ahmedabad","2024-03-25","7","West","Cinema projector lamp"],
    ["TMO-A2409","TMO-2024-B009","Guwahati","Assam Chemicals","Tm2O3 99.6% Nuclear Shield","Reactor neutron shield absorber","99.6%","sigma 100 barns thermal","&#8377;940 Cr","Processing","High","Dibrugarh","Guwahati","2024-03-12","3","East","BARC shield panel"],
    ["TMO-A2410","TMO-2024-B010","Lucknow","UP Chemicals","Tm2O3 99.95% Submarine LIDAR","Blue-green undersea LIDAR","99.95%","emission 2010nm eye-safe","&#8377;960 Cr","In Transit","Critical","Vishakhapatnam","Lucknow","2024-03-28","12","North","IN Navy submarine depth sounder"],
    ["TMO-A2411","TMO-2024-B011","Jaipur","Gujarat Chemicals","Tm2O3 99.2% MRI Contrast","Tm-DTPA contrast agent precursor","99.2%","relaxivity 4.2 mM-1s-1","&#8377;920 Cr","Stored","Medium","Surat","Jaipur","2024-03-05","4","West","AIIMS diagnostic imaging"],
    ["TMO-A2412","TMO-2024-B012","Vishakhapatnam","Vizag Chemicals","Tm2O3 99.8% Warship Laser Comm","Naval IR laser comm link","99.8%","emission 2010nm 10W CW","&#8377;960 Cr","Delayed","Critical","Chennai","Vishakhapatnam","2024-02-15","28","South","Monsoon delay naval comms"],
    ["TMO-A2413","TMO-2024-B013","Bhubaneswar","DRDO TBRL","Tm2O3 99.4% Missile Seeker","IR seeker Tm-doped detector","99.4%","D* 1.2e11 cmHz1/2/W","&#8377;940 Cr","In Transit","High","Balasore","Bhubaneswar","2024-03-30","2","East","DRDO missile IR homing"],
    ["TMO-A2414","TMO-2024-B014","Rourkela","SAIL Chemicals","Tm2O3 97% General Chemical","Industrial alloy additive grade","97.0%","Yb impurity 0.5%","&#8377;860 Cr","Stored","Low","Ranchi","Rourkela","2024-02-20","3","East","SAIL steel deoxidizer"],
]

modules = [
    {
        "filename": "lutetium-oxide-logistics-view.tsx",
        "var": "LUO",
        "func": "LutetiumOxideLogisticsView",
        "icon": "Atom",
        "color": "#6d28d9",
        "title": "Lutetium Oxide",
        "subtitle": "Lu2O3 PET scintillator, catalyst, nuclear reactor shield, optical coating supply chain tracking",
        "records": lutetium_records,
    },
    {
        "filename": "thulium-oxide-logistics-view.tsx",
        "var": "TMO",
        "func": "ThuliumOxideLogisticsView",
        "icon": "ShieldCheck",
        "color": "#0891b2",
        "title": "Thulium Oxide",
        "subtitle": "Tm2O3 portable X-ray, fiber amplifier, medical laser, submarine LIDAR supply chain tracking",
        "records": thulium_records,
    },
]

for mod in modules:
    generate_module(mod)
print("R448 generation complete: 2 modules (all-string records)")
