"""Deduplicate imports in dashboard-view.tsx while preserving order and non-import lines."""
import re

filepath = "/home/z/my-project/src/components/dashboard/dashboard-view.tsx"

with open(filepath, "r") as f:
    lines = f.readlines()

seen_imports = set()
result = []
removed = 0

for line in lines:
    stripped = line.rstrip()
    # Check if this is a single-line import
    if stripped.startswith("import ") and not stripped.endswith(","):
        if stripped in seen_imports:
            removed += 1
            continue
        seen_imports.add(stripped)
    result.append(line)

with open(filepath, "w") as f:
    f.writelines(result)

print(f"Removed {removed} duplicate imports")
print(f"File: {len(result)} lines (was {len(lines)})")
