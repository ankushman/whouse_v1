#!/usr/bin/env python3
"""Fix oklch() values in text-shadow properties to avoid lightningcss panic."""

import re
import sys

CSS_PATH = "/home/z/my-project/src/app/globals.css"

# Mapping from oklch(L C H) -> (R, G, B) for text-shadow replacements
OKLCH_TO_RGB = {
    "0.55 0.2 250":   (59, 94, 255),    # blue
    "0.65 0.2 300":   (196, 77, 255),   # violet
    "0.7 0.18 250":   (96, 128, 255),   # lighter blue
    "0.55 0.17 160":  (0, 204, 136),    # green
    "0.7 0.17 160":   (51, 221, 153),   # lighter green
    "0.65 0.18 80":   (204, 170, 0),    # yellow/gold
    "0.8 0.16 80":    (238, 204, 51),   # lighter yellow
    "0.6 0.2 250":    (85, 112, 255),   # medium blue
    "0.6 0.22 25":    (255, 85, 96),    # red
    "0.623 0.214 259": (99, 102, 241),  # indigo
    "0.7 0.17 163":   (16, 185, 129),   # emerald
    "0.8 0.17 86":    (234, 179, 8),    # amber
    "0.65 0.22 15":   (239, 68, 68),    # red
    "0 0 0":           (0, 0, 0),        # black
    "0.6 0.2 145":    (0, 185, 125),    # green (approx, hue 145)
}


def oklch_replacer(match: re.Match) -> str:
    """Replace a single oklch() match with rgba()."""
    lch_part = match.group(1).strip()  # e.g. "0.55 0.2 250 / 0.5"
    alpha = match.group(2)             # e.g. "0.5" or None

    # Normalize spaces in the LCH part
    lch_normalized = " ".join(lch_part.split())

    # Look up the RGB values
    rgb = OKLCH_TO_RGB.get(lch_normalized)
    if rgb is None:
        print(f"  WARNING: No RGB mapping for oklch({lch_normalized})", file=sys.stderr)
        return match.group(0)  # leave unchanged

    if alpha is not None:
        return f"rgba({rgb[0]}, {rgb[1]}, {rgb[2]}, {alpha})"
    else:
        return f"rgba({rgb[0]}, {rgb[1]}, {rgb[2]}, 1)"


def fix_text_shadow_oklch(css: str) -> tuple[str, int]:
    """Find all text-shadow properties and replace oklch() values within them."""
    count = 0

    # Regex to match text-shadow property declarations (possibly multiline, up to semicolon)
    # This handles both single-line and multi-line text-shadow values.
    # We use a callback to only modify oklch() within those blocks.
    
    # Pattern for text-shadow: from the property name to the terminating semicolon
    # It handles multiline values (the glitch-text case) and keyframe variants.
    text_shadow_pattern = re.compile(
        r'(text-shadow\s*:\s*)(.*?)(;)',
        re.DOTALL
    )

    # Pattern for individual oklch() calls
    oklch_pattern = re.compile(
        r'oklch\(\s*([\d.\s]+?)\s*(?:/\s*([\d.]+))?\s*\)'
    )

    def replace_in_shadow_block(m: re.Match) -> str:
        nonlocal count
        prefix = m.group(1)
        body = m.group(2)
        suffix = m.group(3)

        new_body, sub_count = oklch_pattern.subn(oklch_replacer, body)
        count += sub_count
        return prefix + new_body + suffix

    result = text_shadow_pattern.sub(replace_in_shadow_block, css)
    return result, count


def main():
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        css = f.read()

    # Count oklch in text-shadow before
    ts_oklch_before = len(re.findall(r'text-shadow[^;]*oklch\(', css, re.DOTALL))
    print(f"Found {ts_oklch_before} text-shadow declarations containing oklch() values.")

    # Count individual oklch() occurrences in text-shadow
    ts_blocks = re.findall(r'text-shadow\s*:\s*.*?;', css, re.DOTALL)
    individual_count_before = sum(len(re.findall(r'oklch\(', block)) for block in ts_blocks)
    print(f"Found {individual_count_before} individual oklch() values in text-shadow properties.")

    # Fix
    new_css, replacements = fix_text_shadow_oklch(css)

    # Verify no oklch remains in text-shadow
    ts_blocks_after = re.findall(r'text-shadow\s*:\s*.*?;', new_css, re.DOTALL)
    remaining = sum(len(re.findall(r'oklch\(', block)) for block in ts_blocks_after)

    # Verify oklch still exists in other properties (should be preserved)
    other_oklch = len(re.findall(r'oklch\(', new_css)) - remaining
    print(f"Replaced {replacements} oklch() values in text-shadow properties.")
    print(f"Remaining oklch() in text-shadow: {remaining}")
    print(f"oklch() in other properties (preserved): {other_oklch}")

    if replacements > 0:
        with open(CSS_PATH, "w", encoding="utf-8") as f:
            f.write(new_css)
        print(f"\nSuccessfully wrote fixed CSS to {CSS_PATH}")
    else:
        print("\nNo replacements needed.")

    if remaining > 0:
        print(f"WARNING: {remaining} oklch() values remain in text-shadow!", file=sys.stderr)
        sys.exit(1)

    print(f"\nDone. Total replacements: {replacements}")


if __name__ == "__main__":
    main()
