---
Task ID: R462 — Selenium Dioxide Logistics + Ammonium Vanadate Logistics
Agent: Main Agent (Cron Loop)
Task: R462 — 2 new Indian logistics modules for selenium dioxide (SeO2) photoreceptor/glass decolorizer/CZTSSe solar/submarine optronic mast supply chain and ammonium vanadate (NH4VO3) catalyst/VRFB battery/ferrovanadium/submarine V-AIP fuel cell supply chain.

Work Log:
- Read worklog: R461 complete (commit 0f09c47), 748 exports, ~63,224 CSS
- TSC pre-validation: 0 errors in src/
- Candidate scan: selenium-dioxide (CLEAN), ammonium-vanadate (CLEAN), lithium-carbonate (CLEAN), sodium-sulfate (CLEAN), cobalt-oxide (EXISTS), nickel-sulfate (EXISTS)
- Icons verified: Citrus (0 uses, confirmed), Clock (0 uses, confirmed)
- Created Selenium Dioxide Logistics (R462a): 227 lines, sed-* amber-dark #a16207, 14 records
  - 14 grades: SeO2 99.5% Glass Decolorizer, 99.9% Photoreceptor, 99.3% CdSe Pigment, 99.7% Rubber Vulcanization, 99.85% CZTSSe Solar, 99.8% Se Rectifier, 99.6% Anti-Dandruff, 99.0% Vitamin Supplement, 99.4% SS Passivate, 99.92% CIGS Semiconductor, 99.2% Fungicide, 99.95% Submarine Optronic Mast, 99.8% Warship IR Lens, 97.5% General
  - Applications: Asahi glass SeO2 decolor, HP LaserJet Se drum, Asahi CdSe ruby glass, MRF Se-accel tyre cure, Tata Power CZTSSe PV, BHEL legacy Se rectifier, HUL SeS2 anti-dandruff, Abbott Se vitamin tab, Jindal SS Se passivate, IISc CIGS Se target, IFFCO Se foliar, IN Navy SSK optronic mast, DRDO naval IR GeSe lens, SAIL steel Se deox
  - Rs 12,100 Cr total, avg 99.35%, density 3.95 g/cm3
  - Delayed: SED-A2412 (28d, monsoon Visakhapatnam, submarine optronic mast Se-cell)
- Created Ammonium Vanadate Logistics (R462b): 227 lines, amv-* red #dc2626, 14 records
  - 14 grades: NH4VO3 99.5% H2SO4 Catalyst, 99.9% Ceramic Pigment, 99.3% Glass UV Absorber, 99.7% Ferrovanadium Feed, 99.85% VRFB Battery, 99.8% Phthalic Anhydride, 99.6% Dye Mordant, 99.0% Corrosion Inhibitor, 99.4% Maleic Anhydride, 99.92% Li-V Battery, 99.2% Desulfurization, 99.95% Submarine V-AIP, 99.8% Warship SCR DeNOx, 98.0% General
  - Applications: Tata Chemicals V2O5 pellet, Morbi V-blue ceramic, Asahi V-UV glass, SAIL FeV80 V feed, Tata Power VRFB electrolyte, Thirumalai V2O5 PA cat, Bhilwara V-dye fixative, Asian Paints V-inhibitor, IOC Haldia MA cat, IISc Li-V battery, NTPC V2O5 DeSOx, IN Navy SSK V-AIP stack, DRDO naval LM2500 SCR, SAIL V2O5 process cat
  - Rs 12,100 Cr total, avg 99.35%, density 2.33 g/cm3
  - Delayed: AMV-A2412 (28d, monsoon Visakhapatnam, submarine V-AIP fuel cell stack)
- TSC: 0 errors in src/
- Three-file registration: index.ts (750 exports), page.tsx (1280 viewMap entries), app-store.ts (762 navItems)
- CSS appended: 16 new rules (~63,248 total)
- Git commit: 32b3f47, pushed to main

Stage Summary:
- Project now: 750 module exports, 762 navItems, ~63,248 CSS lines, 1280 viewMap entries, 0 TSC errors in src/
- Selenium Dioxide: Submarine optronic &#8377;960Cr, CIGS semiconductor &#8377;960Cr, photoreceptor &#8377;900Cr, CZTSSe solar &#8377;880Cr
- Ammonium Vanadate: Submarine V-AIP &#8377;960Cr, Li-V battery &#8377;960Cr, VRFB &#8377;920Cr, H2SO4 catalyst &#8377;940Cr
- Delayed: SED-A2412 (28d), AMV-A2412 (28d) — both monsoon Visakhapatnam naval corridor

**Project Current State:**
- 750 module exports, 762 navItems, ~63,248 CSS lines, 1280 viewMap entries, 0 TSC errors in src/

**Risks:**
- globals.css 63K+ lines, dev server OOM — TSC-only QA gate
- SeO2 99.9% photoreceptor — Se is scarce (68th in crust), imported from China/Japan/Korea
- NH4VO3 99.95% V-AIP — strategic naval AIP technology, China/Russia supply dependency
- NH4VO3 99.92% Li-V battery — emerging cathode, limited global production
- Next clean candidates: lithium-carbonate, sodium-sulfate, beryllium-oxide, zirconium-oxide, neodymium-oxide, yttrium-oxide
