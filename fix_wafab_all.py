import glob
import re

for filepath in glob.glob('*/index.html'):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            c = f.read()
        
        # Regex to find <a ... class="wa-fab" ... style="..." ...>
        # and remove the style="..."
        new_c = re.sub(r'(<a[^>]*class="wa-fab"[^>]*) style="[^"]*"', r'\1', c)
        new_c = re.sub(r'(<a[^>]*style="[^"]*")[^>]*class="wa-fab"', lambda m: m.group(0).replace(re.search(r' style="[^"]*"', m.group(0)).group(0), ''), new_c)
        
        # Or even simpler: find the wa-fab tag and just replace the exact inline style strings we know they have.
        new_c = new_c.replace(' style="position: fixed; bottom: 20px; right: 20px; z-index: 100; text-decoration: none;"', '')
        new_c = new_c.replace(' style="position:fixed;bottom:20px;right:20px;z-index:100;text-decoration:none;"', '')
        
        if c != new_c:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_c)
            print(f"Fixed inline style in {filepath}")
    except Exception as e:
        print(f"Error on {filepath}: {e}")
