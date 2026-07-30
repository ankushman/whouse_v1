#!/usr/bin/env python3
"""R256 v2: Safely integrate SearchFilterToolbar into modules.
Properly handles import injection by inserting on separate lines.
"""

import os, re, glob

MODULES_DIR = '/home/z/my-project/src/components/modules'

def add_import(content, from_path, item_name):
    """Add an import item to existing import from same path, or create new line."""
    # Check if already imported
    if item_name in content:
        return content, False
    
    # Find existing import from this path
    pattern = r'import\s*\{([^}]+)\}\s*from\s*"' + re.escape(from_path) + r'"'
    match = re.search(pattern, content)
    if match:
        existing_items = match.group(1).strip()
        new_items = existing_items + ', ' + item_name
        old_line = match.group(0)
        new_line = 'import { ' + new_items + ' } from "' + from_path + '"'
        content = content.replace(old_line, new_line, 1)
        return content, True
    
    # No existing import - add new import line
    # Find the last import line
    lines = content.split('\n')
    last_import_idx = 0
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('import ') and not stripped.startswith('//'):
            last_import_idx = i
    
    new_line = 'import { ' + item_name + ' } from "' + from_path + '"'
    lines.insert(last_import_idx + 1, new_line)
    return '\n'.join(lines), True

def process_module(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Extract interface fields (first interface with id: string)
    int_match = re.search(r'interface\s+(\w+)\s*\{([^}]*id:\s*string[^}]*)\}', content)
    if not int_match:
        return False, "no interface with id"
    
    body = int_match.group(2)
    fields = [f.strip() for f in re.findall(r'(\w+)\s*:', body) if f.strip() != 'id']
    if not fields:
        return False, "no fields"
    
    # Pick search fields (prefer name-like, status, type, city)
    preferred = ['name','company','title','status','type','category','description','city','region','partner','supplier','carrier','warehouse','customer','product','sku','orderId','pickupId','supplierName']
    search_fields = []
    for p in preferred:
        if p in fields and p not in search_fields:
            search_fields.append(p)
    for f in fields:
        if len(search_fields) >= 3:
            break
        if f not in search_fields:
            search_fields.append(f)
    if not search_fields:
        return False, "no search fields"
    
    # Find a data variable used in .map() for table rows
    data_var = None
    for m in re.finditer(r'const\s+(\w+)\s*=\s*useMemo', content):
        var = m.group(1)
        # Check this var is used with .map for table rows
        # Look for: {varName.map( or varName.filter(
        if var + '.map(' in content or var + '.filter(' in content:
            data_var = var
            break
    if not data_var:
        return False, "no data var"
    
    search_fields_str = ', '.join(repr(f) for f in search_fields)
    
    # Add imports
    content, added1 = add_import(content, '@/hooks/use-search-filter', 'useSearchFilter')
    content, added2 = add_import(content, '@/components/shared/search-filter-toolbar', 'SearchFilterToolbar')
    
    # Add useSearchFilter hook after data variable
    hook_line = '  const sf = useSearchFilter({{ items: {data_var}, searchFields: [{search_fields_str}] }})'
    
    # Find the useMemo line for data_var and insert hook after it
    # Pattern: const dataVar = useMemo(() => ..., [])
    # The hook should go AFTER the closing ) of useMemo
    # Find: const dataVar = useMemo( 
    # Then find matching closing ) after []
    
    hook_pattern = r'(const\s+' + re.escape(data_var) + r'\s*=\s*useMemo\(\s*\(\)\s*=>\s*\w+\([^)]*\)\s*,\s*\[\s*\]\s*\))'
    hook_match = re.search(hook_pattern, content)
    if not hook_match:
        # Try simpler pattern: find the useMemo line for data_var
        simpler = r'const\s+' + re.escape(data_var) + r'\s*=\s*useMemo'
        s_match = re.search(simpler, content)
        if s_match:
            # Find end of this expression (line ending with []))
            start = s_match.start()
            remaining = content[start:]
            # Find the closing )) or ])
            end_patterns = [r'\]\s*\)', r'\)\s*,\s*\[\s*\]\s*\)']
            end_pos = None
            for ep in end_patterns:
                em = re.search(ep, remaining)
                if em:
                    end_pos = start + em.end()
                    break
            if end_pos:
                content = content[:end_pos] + '\n' + hook_line + content[end_pos:]
    
    if 'const sf' not in content:
        # Fallback: couldn't insert hook, skip
        return False, "hook insertion failed"
    
    # Replace data_var.map with sf.filteredItems.map in JSX
    # Be careful: only replace in JSX context (after return statement)
    return_idx = content.find('return (')
    if return_idx < 0:
        return False, "no return"
    
    jsx_part = content[return_idx:]
    # Count occurrences before and after replacement
    before_count = jsx_part.count(data_var + '.map(')
    jsx_part = jsx_part.replace(data_var + '.map(', 'sf.filteredItems.map(')
    after_count = jsx_part.count('sf.filteredItems.map(')
    content = content[:return_idx] + jsx_part
    
    # Add SearchFilterToolbar before the Card containing a Table
    toolbar_jsx = '<SearchFilterToolbar\n          searchQuery={sf.searchQuery}\n          onSearchChange={sf.setSearchQuery}\n          onClearSearch={sf.clearSearch}\n          activeFilters={sf.activeFilters}\n          filterGroups={sf.filterGroupsWithCounts}\n          onToggleFilter={sf.toggleFilter}\n          onClearAllFilters={sf.clearAllFilters}\n          totalItems={sf.totalItems}\n          filteredCount={sf.filteredCount}\n        />'
    
    # Find Card pattern that wraps table: <Card ...><CardContent ...><Table
    card_pattern = r'(<Card\s[^>]*>)\n(\s*)(<CardContent[^>]*>)\n(\s*)(<Table)'
    card_match = re.search(card_pattern, content)
    if card_match:
        # Insert toolbar before the Card
        insert_pos = card_match.start()
        indent = card_match.group(2)
        content = content[:insert_pos] + toolbar_jsx + '\n' + indent + content[insert_pos:]
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    return True, f"fields={search_fields}, data={data_var}, maps={after_count}"

# Find candidates
candidates = []
for fp in sorted(glob.glob(os.path.join(MODULES_DIR, '*-view.tsx'))):
    with open(fp, 'r') as f:
        c = f.read()
    if 'useMemo' in c and '<Table' in c and re.search(r'interface\s+\w+\s*\{[^}]*id:\s*string', c):
        if 'SearchFilterToolbar' not in c:
            candidates.append(fp)

success = 0
results = []
for fp in candidates[:35]:
    ok, detail = process_module(fp)
    name = os.path.basename(fp)
    if ok:
        results.append((name, "OK", detail))
        success += 1
    else:
        results.append((name, "SKIP", detail))

print(f"R256 SearchFilterToolbar v2: {success}/{len(candidates[:35])} modules")
for n, s, d in results:
    print(f"  [{s}] {n}: {d}")
