#!/usr/bin/env python3
"""Fix unicode escapes in omnichannel module — replace \\u{XXXX} with actual emoji chars"""

import re

EMOJI_MAP = {
    '1f4e6': '📦', '1f69a': '🚚', '1f50d': '🔍', '2705': '✅', '274c': '❌',
    '1f4b0': '💰', '1f504': '🔄', '1f3c1': '🏆', '1f4f1': '📱', '1f310': '🌐',
    '1f3ea': '🏬', '1f4f2': '📲', '1f4f7': '📷', '1f4cf': '📏', '1f3a8': '🎨',
    '26a0': '⚠', '1f6d1': '🛑', '1f914': '🤔', '1f4ad': '💭', '1f552': '⏰',
    '1f4a5': '💥', '1f441': '👁', '2699': '⚙', '1f4d0': '📐', '1f48e': '💎',
    '1f6e1': '🛡', '1f50b': '🔋', '1f9fc': '🧼', '1f4b3': '💳', '1f3e6': '🏦',
    '1f91d': '🤝', '1f45b': '👜', '1f3af': '🎯', '2b06': '⬆', '1f527': '🔧',
    '1f392': '🎒', '1f534': '🔴', '1f535': '🔵', '26aa': '⚪', '1f4cd': '📍',
}

filepath = '/home/z/my-project/src/components/modules/omnichannel-returns-hub-view.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Replace \\u{XXXX} and \\uXXXX patterns
def replace_unicode(match):
    code = match.group(1).lower()
    # Handle variation selector
    code = code.replace('ufe0f', '').replace('fe0f', '')
    if code in EMOJI_MAP:
        return EMOJI_MAP[code]
    try:
        return chr(int(code, 16))
    except:
        return match.group(0)

# Pattern for \u{XXXXX} form
content = re.sub(r'\\u\{([0-9a-fA-F]+)\}', replace_unicode, content)
# Pattern for \uXXXX form (4 hex digits, no braces)
content = re.sub(r'\\u([0-9a-fA-F]{4})', replace_unicode, content)

with open(filepath, 'w') as f:
    f.write(content)

print(f"Fixed unicode escapes in {filepath}")
