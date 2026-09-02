import re

# Read Office CSS
with open('office/index.html', 'r', encoding='utf-8') as f:
    office_html = f.read()

# Extract Office's <style> block
office_style_match = re.search(r'<style>(.*?)</style>', office_html, flags=re.DOTALL)
office_style = office_style_match.group(1) if office_style_match else ""

# Extract the block starting from .trust-hero to just before .wu-hero
# Let's search for .trust-hero in office_style
start_idx = office_style.find('.trust-hero {')
end_idx = office_style.find('/*  ? ? ?', start_idx) # The next big comment section
if end_idx == -1: end_idx = office_style.find('.wu-hero')

office_s2_css = office_style[start_idx:end_idx].strip()

with open('t1.txt', 'w', encoding='utf-8') as f: f.write(office_s2_css)
