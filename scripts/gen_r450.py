#!/usr/bin/env python3
"""R450 generator: Chromium Metal + Molybdenum Metal logistics modules."""
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

chromium_records = [
    ["CRM-A2401","CRM-2024-B001","Mumbai","MIDHANI","Cr 99.99% Stainless Steel","304/316 austenitic SS","99.99%","density 7.19 g/cm3","&#8377;960 Cr","In Transit","Critical","Delhi","Mumbai","2024-03-15","8","West","SAIL stainless steel melt stock"],
    ["CRM-A2402","CRM-2024-B002","Bengaluru","DRDO DMRL","Cr 99.9% Aerospace Alloy","Ni-Cr superalloy turbine blade","99.9%","creep 850 degC","&#8377;940 Cr","Delivered","High","Chennai","Bengaluru","2024-03-10","6","South","GTRE GTX-35 VS turbine"],
    ["CRM-A2403","CRM-2024-B003","Hyderabad","Tata Chemicals","Cr 99.7% Chrome Plating","Decorative hexavalent plating","99.7%","hardness 900 HV","&#8377;760 Cr","Processing","Medium","Kolkata","Hyderabad","2024-03-20","7","Central","Auto bumper chrome line"],
    ["CRM-A2404","CRM-2024-B004","Chennai","Bharat Forge","Cr 99.5% Leather Tanning","Trivalent Cr tanning agent","99.5%","Cr2O3 35% basicity","&#8377;700 Cr","In Transit","Medium","Delhi","Chennai","2024-03-18","9","South","Leather industry tanning"],
    ["CRM-A2405","CRM-2024-B005","Delhi","Shyam Chemicals","Cr 99.3% Pigment Green","Chrome green pigment","99.3%","CIE L*65 a*(-20) b*(15)","&#8377;680 Cr","Stored","Low","Jaipur","Delhi","2024-02-28","4","North","Paint pigment batch"],
    ["CRM-A2406","CRM-2024-B006","Kolkata","BHEL R&amp;D","Cr 99.8% Boiler Tube","Cr-Mo boiler steel tube","99.8%","yield 415 MPa","&#8377;920 Cr","In Transit","High","Vishakhapatnam","Kolkata","2024-03-22","12","East","BHEL power plant boiler"],
    ["CRM-A2407","CRM-2024-B007","Jaipur","Godrej Chemicals","Cr 99.0% Refractory Brick","Mg-Cr refractory lining","99.0%","melting point 1907 degC","&#8377;740 Cr","Stored","Low","Mumbai","Jaipur","2024-02-25","5","West","Cement kiln refractory"],
    ["CRM-A2408","CRM-2024-B008","Ahmedabad","Rajasthan Chemicals","Cr 99.6% Corrosion Resistant","Chemical plant alloy pipe","99.6%","pitting resistance 42","&#8377;860 Cr","In Transit","Medium","Jodhpur","Ahmedabad","2024-03-25","7","West","Petrochemical piping"],
    ["CRM-A2409","CRM-2024-B009","Guwahati","Assam Chemicals","Cr 99.4% Wood Preservative","CCA treated timber","99.4%","retention 6.4 kg/m3","&#8377;660 Cr","Processing","Medium","Dibrugarh","Guwahati","2024-03-12","3","East","Railway sleeper treatment"],
    ["CRM-A2410","CRM-2024-B010","Lucknow","UP Chemicals","Cr 99.95% Submarine Propeller","Ni-Cr-Mn submarine prop alloy","99.95%","yield 690 MPa","&#8377;960 Cr","In Transit","Critical","Vishakhapatnam","Lucknow","2024-03-28","11","North","IN Navy submarine propeller"],
    ["CRM-A2411","CRM-2024-B011","Pune","Gujarat Chemicals","Cr 99.2% Cutting Tool","Cr-V steel cutting tool","99.2%","hardness 58 HRC","&#8377;820 Cr","Stored","Medium","Surat","Pune","2024-03-05","4","West","Machining tool stock"],
    ["CRM-A2412","CRM-2024-B012","Vishakhapatnam","Vizag Chemicals","Cr 99.8% Warship Hull Steel","Cr-Ni-Mo naval armor plate","99.8%","yield 785 MPa","&#8377;960 Cr","Delayed","Critical","Chennai","Vishakhapatnam","2024-02-15","28","South","Monsoon delay naval armor"],
    ["CRM-A2413","CRM-2024-B013","Bhubaneswar","DRDO TBRL","Cr 99.4% Missile Nozzle","Cr-Ni rocket nozzle throat","99.4%","temp 1200 degC","&#8377;940 Cr","In Transit","High","Balasore","Bhubaneswar","2024-03-30","2","East","DRDO missile nozzle insert"],
    ["CRM-A2414","CRM-2024-B014","Rourkela","SAIL Chemicals","Cr 97% General Alloy","Foundry Cr addition","97.0%","C impurity 0.1%","&#8377;640 Cr","Stored","Low","Ranchi","Rourkela","2024-02-20","3","East","SAIL alloy steel charge"],
]

molybdenum_records = [
    ["MOM-A2401","MOM-2024-B001","Mumbai","MIDHANI","Mo 99.95% Superalloy Blade","Ni-base superalloy turbine blade","99.95%","density 10.28 g/cm3","&#8377;960 Cr","In Transit","Critical","Delhi","Mumbai","2024-03-15","9","West","HAL HTT-4000 turbine"],
    ["MOM-A2402","MOM-2024-B002","Bengaluru","DRDO DMRL","Mo 99.9% Missile Thruster","Mo rocket thruster nozzle","99.9%","melting point 2623 degC","&#8377;940 Cr","Delivered","High","Chennai","Bengaluru","2024-03-10","6","South","ISRO Vikas engine nozzle"],
    ["MOM-A2403","MOM-2024-B003","Hyderabad","Tata Chemicals","Mo 99.7% Petroleum Catalyst","MoS2 hydrodesulfurization cat","99.7%","surface area 180 m2/g","&#8377;860 Cr","Processing","Medium","Vishakhapatnam","Hyderabad","2024-03-20","7","Central","IOC refinery HDS catalyst"],
    ["MOM-A2404","MOM-2024-B004","Chennai","Bharat Forge","Mo 99.5% Structural Steel","HSLA Mo-V microalloy steel","99.5%","yield 550 MPa","&#8377;800 Cr","In Transit","Medium","Kolkata","Chennai","2024-03-18","10","South","Bridge structural steel"],
    ["MOM-A2405","MOM-2024-B005","Delhi","Shyam Chemicals","Mo 99.3% Glass Electrode","Mo glass pH electrode","99.3%","pH range 0-14","&#8377;720 Cr","Stored","Low","Jaipur","Delhi","2024-02-28","4","North","Lab electrode batch"],
    ["MOM-A2406","MOM-2024-B006","Kolkata","BHEL R&amp;D","Mo 99.8% Boiler Pipe","Cr-Mo boiler alloy pipe","99.8%","creep 550 degC","&#8377;920 Cr","In Transit","High","Vishakhapatnam","Kolkata","2024-03-22","12","East","BHEL supercritical boiler"],
    ["MOM-A2407","MOM-2024-B007","Jaipur","Godrej Chemicals","Mo 99.0% X-Ray Tube","Mo target anode X-ray tube","99.0%","emission K-alpha 17.5keV","&#8377;840 Cr","Stored","Low","Mumbai","Jaipur","2024-02-25","5","West","Medical X-ray tube target"],
    ["MOM-A2408","MOM-2024-B008","Ahmedabad","Rajasthan Chemicals","Mo 99.6% Spraying Coating","Plasma spray Mo coating","99.6%","hardness 1400 HV","&#8377;880 Cr","In Transit","Medium","Jodhpur","Ahmedabad","2024-03-25","7","West","Piston ring thermal spray"],
    ["MOM-A2409","MOM-2024-B009","Guwahati","Assam Chemicals","Mo 99.4% Polymer Additive","MoO3 flame retardant synergist","99.4%","LOI increase 8%","&#8377;700 Cr","Processing","Medium","Dibrugarh","Guwahati","2024-03-12","3","East","Wire cable FR additive"],
    ["MOM-A2410","MOM-2024-B010","Lucknow","UP Chemicals","Mo 99.95% Submarine Reactor","Mo-TZM reactor vessel","99.95%","yield 690 MPa","&#8377;960 Cr","In Transit","Critical","Vishakhapatnam","Lucknow","2024-03-28","11","North","IN Navy reactor pressure vessel"],
    ["MOM-A2411","MOM-2024-B011","Pune","Gujarat Chemicals","Mo 99.2% Filament","Mo lighting filament wire","99.2%","diameter 0.1mm","&#8377;780 Cr","Stored","Medium","Surat","Pune","2024-03-05","4","West","Halogen lamp filament"],
    ["MOM-A2412","MOM-2024-B012","Vishakhapatnam","Vizag Chemicals","Mo 99.8% Warship Engine","Mo steel warship diesel piston","99.8%","temp 450 degC","&#8377;960 Cr","Delayed","Critical","Chennai","Vishakhapatnam","2024-02-15","28","South","Monsoon delay naval depot"],
    ["MOM-A2413","MOM-2024-B013","Bhubaneswar","DRDO TBRL","Mo 99.4% Missile Fin","Mo alloy missile tail fin","99.4%","yield 520 MPa","&#8377;940 Cr","In Transit","High","Balasore","Bhubaneswar","2024-03-30","2","East","DRDO missile fin stock"],
    ["MOM-A2414","MOM-2024-B014","Rourkela","SAIL Chemicals","Mo 97% General Alloy","Steel alloy Mo addition","97.0%","Fe impurity 2%","&#8377;640 Cr","Stored","Low","Ranchi","Rourkela","2024-02-20","3","East","SAIL alloy steel charge"],
]

modules = [
    {
        "filename": "chromium-metal-logistics-view.tsx",
        "var": "CRM",
        "func": "ChromiumMetalLogisticsView",
        "icon": "FlaskRound",
        "color": "#b91c1c",
        "title": "Chromium Metal",
        "subtitle": "Cr stainless steel, aerospace superalloy, chrome plating, naval armor supply chain tracking",
        "records": chromium_records,
    },
    {
        "filename": "molybdenum-metal-logistics-view.tsx",
        "var": "MOM",
        "func": "MolybdenumMetalLogisticsView",
        "icon": "Wind",
        "color": "#0e7490",
        "title": "Molybdenum Metal",
        "subtitle": "Mo superalloy turbine blade, rocket nozzle, petroleum catalyst, reactor vessel supply chain tracking",
        "records": molybdenum_records,
    },
]

for mod in modules:
    generate_module(mod)
print("R450 generation complete: 2 modules")
