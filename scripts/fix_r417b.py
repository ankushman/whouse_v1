#!/usr/bin/env python3
"""Fix f-string issues in gen_r417b.py"""
with open('/home/z/my-project/scripts/gen_r417b.py', 'r') as f:
    lines = f.readlines()

# Find lines with f" that contain JSX ${ or mfrMap/zInv/ranges JSX patterns
new_lines = []
for i, line in enumerate(lines):
    stripped = line.strip()
    # Keep print statements and simple f-strings (OUTPUT, import, interface, etc.)
    # But convert JSX-heavy f-strings
    if stripped.startswith("lines.append(f\"") and any(x in line for x in ["mfrMap", "zInv", "ranges", "kpiData.total.toLocaleString"]):
        # Remove f" prefix, use regular string
        converted = line.replace('lines.append(f"', 'lines.append("')
        # Replace {{ with { and }} with } (these were f-string escapes)
        # But only at the right places - this is tricky
        # Actually, for the JSX lines, we need string concat for VARIABLE_NAME
        # Let's just manually handle each one
        if "mfrMap" in line:
            converted = 'lines.append("              {(() => { const mfrMap: Record<string, number> = {}; " + VARIABLE_NAME + ".forEach((r) => { mfrMap[r.manufacturer] = (mfrMap[r.manufacturer] || 0) + r.investmentCr; }); return Object.entries(mfrMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([mfr, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={mfr} className=\\"flex items-center gap-2\\"><span className=\\"text-xs w-40 truncate\\">{mfr as string}</span><div className=\\"flex-1 h-2 bg-muted rounded-full\\"><div className=\\"h-2 rounded-full\\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\\"text-xs font-medium\\">&#8377;{inv as number}Cr</span></div>; }); })()}")\n'
        elif "zInv" in line:
            converted = 'lines.append("            <div className=\\"space-y-2\\">{(() => { const zInv: Record<string, number> = {}; " + VARIABLE_NAME + ".forEach((r) => { zInv[r.zone] = (zInv[r.zone] || 0) + r.investmentCr; }); return Object.entries(zInv).sort((a, b) => b[1] - a[1]).map(([zone, inv]) => { const pct = (inv as number / kpiData.total) * 100; return <div key={zone} className=\\"flex items-center gap-2\\"><span className=\\"text-xs w-16\\">{zone as string}</span><div className=\\"flex-1 h-2 bg-muted rounded-full\\"><div className=\\"h-2 rounded-full\\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\\"text-xs font-medium\\">&#8377;{inv as number}Cr</span></div>; }); })()}")\n'
        elif "ranges" in line:
            converted = 'lines.append("              {(() => { const ranges = { \'99.99%+\': 0, \'99.95-99.98%\': 0, \'99.6-99.94%\': 0, \'&lt;99.6%\': 0 }; " + VARIABLE_NAME + ".forEach((r) => { if (r.purityPercent >= 99.99) ranges[\'99.99%+\']++; else if (r.purityPercent >= 99.95) ranges[\'99.95-99.98%\']++; else if (r.purityPercent >= 99.6) ranges[\'99.6-99.94%\']++; else ranges[\'&lt;99.6%\']++; }); return (Object.entries(ranges) as [string, number][]).filter(([, v]) => v > 0).map(([range, count]) => { const pct = (count / " + VARIABLE_NAME + ".length) * 100; return <div key={range} className=\\"flex items-center gap-2\\"><span className=\\"text-xs w-24\\">{range}</span><div className=\\"flex-1 h-2 bg-muted rounded-full\\"><div className=\\"h-2 rounded-full\\" style={{ width: `${pct}%`, backgroundColor: themeColor }} /></div><span className=\\"text-xs font-medium\\">{count}</span></div>; }); })()}")\n'
        elif "kpiData.total.toLocaleString" in line:
            converted = 'lines.append("            <div className=\\"p-3 rounded-lg border-l-4 border-l-sky-500 bg-sky-50/50\\"><div className=\\"font-medium\\">Total Portfolio: &#8377;{kpiData.total.toLocaleString()} Cr</div><div className=\\"text-xs text-muted-foreground mt-1\\">Across 14 silica glass grades spanning optical, solar, pharma, telecom, auto, naval and semiconductor &#8594; avg purity {kpiData.avgPurity}%</div></div>")\n'
        new_lines.append(converted)
    else:
        new_lines.append(line)

with open('/home/z/my-project/scripts/gen_r417b.py', 'w') as f:
    f.writelines(new_lines)

print("Fixed gen_r417b.py")
