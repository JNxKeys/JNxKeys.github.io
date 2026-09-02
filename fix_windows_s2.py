import re
with open('windows/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

match_s2 = re.search(r'(<div class="how-steps">.*?)</div>\s*</div>\s*<div class="bnav">', c, flags=re.DOTALL)
if match_s2:
    steps_html = match_s2.group(1) + '</div>'
    new_s2 = f'<div class="content-with-ad-grid">\n    {steps_html}\n    <div class="ad-slot" data-ad-id="windows_confianza_ad"></div>\n  </div>'
    c = c.replace(steps_html, new_s2)
    with open('windows/index.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print('Restored')
else:
    print('Not found')
