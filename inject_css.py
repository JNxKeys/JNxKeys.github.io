import re

with open('windows/index.html', 'r', encoding='utf-8') as f:
    win_html = f.read()

# Extract Office's <style> block
with open('office/index.html', 'r', encoding='utf-8') as f:
    office_html = f.read()
office_style_match = re.search(r'<style>(.*?)</style>', office_html, flags=re.DOTALL)
office_style = office_style_match.group(1)

# Extract S2 CSS from Office
start_idx = office_style.find('.trust-hero {')
end_idx = office_style.find('/*  ? ? ?', start_idx) 
if end_idx == -1: end_idx = office_style.find('/* ══════════ SCREEN 3', start_idx)
office_s2_css = office_style[start_idx:end_idx].strip()

# Find the block in Windows to replace
win_start = win_html.find('.trust-hero {')
win_end = win_html.find('/* HERO GRID', win_start)

# In Windows, we also have .trust-grid inside a media query! We need to make sure we don't break that, or we can just remove it because Office handles it differently.
# Office handles it by setting .trust-grid { grid-template-columns: 1fr 1fr; } by default, and @media { grid-template-columns: repeat(4, 1fr) !important; } somewhere else?
# Let's check Office's media queries for .trust-grid.
# Wait, Office CSS doesn't have a media query for trust-grid in the block I extracted.
# Let's just do a simple replacement of the main styles.

win_new_html = win_html[:win_start] + office_s2_css + '\n\n' + win_html[win_end:]

with open('windows/index.html', 'w', encoding='utf-8') as f:
    f.write(win_new_html)

print("CSS injected")
