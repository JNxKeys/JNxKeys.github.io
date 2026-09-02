import re
with open('windows/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

match = re.search(r'<a class="wa-fab"[^>]*>', c)
if match:
    print(match.group(0))
