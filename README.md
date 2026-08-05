# JNxKeys.github.io

Sitio estático de JNxKeys: venta de licencias digitales originales (Apple One, ESET, Google One AI Plus, Kaspersky, Microsoft Office) para clientes en Perú, con pago por Yape o Western Union y entrega coordinada por WhatsApp.

## Estructura

```
index.html       # Hub/landing con enlaces a cada producto
apple one/       # Página de producto Apple One
eset/            # Página de producto ESET Antivirus
google one/      # Página de producto Google One AI Plus
kaspersky/       # Página de producto Kaspersky Antivirus
office/          # Página de producto Microsoft Office
assets/img/      # Logos e imágenes compartidas
assets/css/      # CSS compartido entre las páginas de producto
```

Cada página de producto es un mini-SPA de 3 pantallas (producto → confianza → pago), controladas por la función `goScreen()` en JavaScript inline. No hay build ni framework: es HTML estático servido directamente por GitHub Pages.

## Notas

- Las carpetas `apple one/` y `google one/` llevan un espacio en el nombre intencionalmente — no renombrar, ya que rompería enlaces existentes compartidos con clientes.
- El número de WhatsApp/Yape (`925 244 643`) está escrito directamente en el HTML de cada página de producto (dos veces por página). Si cambia, hay que actualizarlo manualmente en cada archivo.
- `assets/css/common.css` contiene únicamente reglas verificadas como idénticas entre las 5 páginas de producto; cada página conserva su propia paleta de colores (`:root`) y estilos específicos en su propio `<style>`.
