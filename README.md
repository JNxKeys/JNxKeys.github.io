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
combos/          # Página con los 10 combos (paquetes de varios productos)
assets/img/      # Logos e imágenes compartidas
assets/css/      # CSS compartido entre las páginas de producto
robots.txt       # Directivas para crawlers
sitemap.xml      # Sitemap para buscadores
```

Cada página de producto es un mini-SPA de 3 pantallas (producto → confianza → pago), controladas por la función `goScreen()` en JavaScript inline. No hay build ni framework: es HTML estático servido directamente por GitHub Pages.

## Patrones comunes entre páginas de producto

Las 5 páginas de producto (`apple one/`, `eset/`, `google one/`, `kaspersky/`, `office/`) siguen la misma estructura, replicada manualmente en cada archivo (no hay componentes compartidos):

- **Cinta de marca** (`.top-ribbon`) al inicio de la pantalla 1: logo chico + "JNxKeys · Licencias digitales originales" sobre un degradado con los colores de esa página. Reemplaza el logo grande que existía antes.
- **Botón "Pedir por WhatsApp" por tarjeta de producto/plan** (`.card-wa-btn` / `.plan-wa-btn`): cada tarjeta arma su propio mensaje de WhatsApp con el nombre del producto/plan específico (no un mensaje genérico). En Google One, además, el precio Mensual/Anual (u otra duración) es seleccionable — el botón toma el texto y precio de la opción marcada.
- **Botón de compartir por tarjeta** (`.card-share-btn` / `.plan-share-btn`): abre WhatsApp con un mensaje armado (`nombre + precio + link directo a esa tarjeta + link a Facebook`). El link usa un ancla (`#id-de-la-tarjeta`) hacia un `id` puesto en cada tarjeta; un script al final de cada página hace `scrollIntoView()` si la URL trae ese hash al cargar.
- **Botón flotante de WhatsApp** (`.wa-fab`), fijo abajo a la derecha en todas las páginas (producto, combos y el hub), con mensaje genérico de contacto.

`/combos/` sigue el mismo patrón de botón de compartir con deep-link por combo, pero no tiene las 3 pantallas (producto/confianza/pago) de las páginas de producto individuales.

## Eventos de GA4

Todas las páginas cargan el mismo tag (`G-XTFDKH1ESP`). Eventos personalizados en uso: `whatsapp_click`, `product_share`, `plan_share`, `combo_share`, `screen_view_product`, `product_click`, `combo_click`, `combos_expand`, `more_combos_click`.

## Notas

- Las carpetas `apple one/` y `google one/` llevan un espacio en el nombre intencionalmente — no renombrar, ya que rompería enlaces existentes compartidos con clientes.
- El número de WhatsApp/Yape (`925 244 643`) está escrito directamente en el HTML de cada página (varias veces por página: botones por tarjeta, botón de contacto, nav inferior, botón flotante, datos de pago). Si cambia, hay que actualizarlo manualmente en cada archivo — no hay una constante centralizada.
- `assets/css/common.css` contiene únicamente reglas verificadas como idénticas entre las páginas de producto; cada página conserva su propia paleta de colores (`:root`) y estilos específicos en su propio `<style>`.
- Métodos de pago por página: ESET y Office aceptan Yape (Perú) y Western Union (internacional). Google One, Kaspersky y Apple One solo aceptan Yape y están limitados a cuentas/clientes en Perú.
