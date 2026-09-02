import re
with open('office/index.html', 'r', encoding='utf-8') as f:
    c = f.read()
match = re.search(r'\.trust-grid \{.*?\}.*?\.trust-card \{.*?\}', c, flags=re.DOTALL)
if match:
    with open('t1.txt', 'w', encoding='utf-8') as o: o.write(match.group(0))

with open('windows/index.html', 'r', encoding='utf-8') as f:
    c = f.read()
match = re.search(r'\.trust-grid \{.*?\}.*?\.trust-card \{.*?\}', c, flags=re.DOTALL)
if match:
    with open('t2.txt', 'w', encoding='utf-8') as o: o.write(match.group(0))
