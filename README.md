# JNxKeys.github.io

Sitio estático de JNxKeys: venta de licencias digitales originales (Windows, ESET, Google One AI Plus, Kaspersky, Microsoft Office, ChatGPT Plus, Canva Pro, CapCut Pro) para clientes en Perú, con pago por Yape o Western Union y entrega coordinada por WhatsApp. El catálogo completo (precios, costos internos, combos) vive en un documento externo llamado "Base de Conocimiento JNxKeys" que el negocio mantiene fuera del repo — cuando falte verificar si un producto/precio del sitio está actualizado, hay que pedirle ese documento al dueño del negocio.

## Estructura

```
index.html       # Hub/landing con enlaces a cada producto
windows/         # Página de producto Windows 10 Pro / 11 Pro
eset/            # Página de producto ESET Antivirus
google-one/      # Página de producto Google One AI Plus
kaspersky/       # Página de producto Kaspersky Antivirus
office/          # Página de producto Microsoft Office
chatgpt/         # Página de producto ChatGPT Plus
canva/           # Página de producto Canva Pro
capcut/          # Página de producto CapCut Pro
apple-one/       # Página de producto Apple One (INACTIVA temporalmente, ver Notas)
combos/          # Página con los 10 combos (paquetes de varios productos)
assets/img/      # Logos e imágenes compartidas
assets/css/      # CSS compartido entre las páginas de producto
assets/js/products.js  # Registro central de productos activos/inactivos (ver "Activar o desactivar un producto")
robots.txt       # Directivas para crawlers
sitemap.xml      # Sitemap para buscadores
```

Cada página de producto es un mini-SPA de 3 pantallas (producto → confianza → pago), controladas por la función `goScreen()` en JavaScript inline. No hay build ni framework: es HTML estático servido directamente por GitHub Pages.

## Patrones comunes entre páginas de producto

Las páginas de producto activas (`windows/`, `eset/`, `google-one/`, `kaspersky/`, `office/`, `chatgpt/`, `canva/`, `capcut/`) siguen la misma estructura, replicada manualmente en cada archivo (no hay componentes compartidos):

- **Cinta de marca** (`.top-ribbon`) al inicio de la pantalla 1: logo chico + "JNxKeys · Licencias digitales originales" sobre un degradado con los colores de esa página. Reemplaza el logo grande que existía antes.
- **Botón "Pedir por WhatsApp" por tarjeta de producto/plan** (`.card-wa-btn` / `.plan-wa-btn`): cada tarjeta arma su propio mensaje de WhatsApp con el nombre del producto/plan específico (no un mensaje genérico). En Google One, además, el precio Mensual/Anual (u otra duración) es seleccionable — el botón toma el texto y precio de la opción marcada.
- **Botón de compartir por tarjeta** (`.card-share-btn` / `.plan-share-btn`): abre WhatsApp con un mensaje armado (`nombre + precio + link directo a esa tarjeta + link a Facebook`). El link usa un ancla (`#id-de-la-tarjeta`) hacia un `id` puesto en cada tarjeta; un script al final de cada página hace `scrollIntoView()` si la URL trae ese hash al cargar.
- **Botón flotante de WhatsApp** (`.wa-fab`), fijo abajo a la derecha en todas las páginas (producto, combos y el hub), con mensaje genérico de contacto.
- **Sección "¿Qué incluye?"** (`.feat-section`, reutilizada en `windows/`, `chatgpt/`, `canva/` y `capcut/`): lista de funciones/beneficios concretos del producto, con ícono + nombre + descripción corta por ítem. Windows además tiene una segunda sección "Beneficios generales" que compara Windows 10 Pro vs 11 Pro (Windows 10 ya no recibe soporte de Microsoft desde oct. 2025; ambas licencias vendidas son edición Pro).
- **Nota de venta cruzada hacia combos** (`.combo-note`, en `windows/` y `chatgpt/`): enlaza al combo de `/combos/` que incluye ese producto. Los combos, a su vez, enlazan de vuelta a la página del producto individual dentro de su listado "incluye" — el enlace es bidireccional. Canva y CapCut no forman parte de ningún combo todavía, así que no tienen esta nota.
- **Garantía especial de CapCut** (`.guarantee25`): CapCut Pro tiene una garantía propia de 25 días (reactivación o devolución) distinta del texto de garantía genérico que usan las demás páginas — aparece como caja destacada en la pantalla 1 y también reemplaza el texto de la caja `.guarantee` estándar en la pantalla 2.

`/combos/` sigue el mismo patrón de botón de compartir con deep-link por combo, pero no tiene las 3 pantallas (producto/confianza/pago) de las páginas de producto individuales.

El hub (`index.html`) agrupa los productos en categorías (`.group`/`.eyebrow`): Sistema Operativo (Windows), Productividad (Office), Inteligencia Artificial (Google One AI Plus, ChatGPT Plus — agrupados juntos porque su propuesta central es IA, no ofimática), Seguridad (ESET, Kaspersky), Diseño y Video (Canva Pro, CapCut Pro). La categoría Entretenimiento (Apple One) existe en el HTML pero está oculta — ver "Activar o desactivar un producto".

## Activar o desactivar un producto en el hub

`assets/js/products.js` define `window.JNX_PRODUCTS`, un registro `{ "id-de-producto": { active: true|false } }`. Un script al final de `index.html` lee ese objeto y oculta/muestra cada tarjeta `[data-product="id"]`; si una categoría (`.group`) se queda sin tarjetas visibles, también se oculta automáticamente. Para activar o desactivar un producto del hub basta con cambiar su `active` en ese archivo y subir el cambio — no borra nada del HTML.

Esto **solo controla la visibilidad de la tarjeta en el hub**. No es un panel de administración con backend (GitHub Pages no tiene servidor, así que cualquier credencial de escritura embebida en el sitio quedaría expuesta al público) — sigue siendo necesario editar `sitemap.xml` y el `<meta name="robots">` de la página del producto a mano si se quiere sacarlo también de buscadores, tal como se hizo con Apple One.

## Eventos de GA4

Todas las páginas cargan el mismo tag (`G-XTFDKH1ESP`). Eventos personalizados en uso: `whatsapp_click`, `product_share`, `plan_share`, `combo_share`, `screen_view_product`, `product_click`, `combo_click`, `combos_expand`, `more_combos_click`.

## Notas

- Las carpetas `apple-one/` y `google-one/` llevan un espacio en el nombre intencionalmente — no renombrar, ya que rompería enlaces existentes compartidos con clientes.
- El número de WhatsApp/Yape (`925 244 643`) está escrito directamente en el HTML de cada página (varias veces por página: botones por tarjeta, botón de contacto, nav inferior, botón flotante, datos de pago). Si cambia, hay que actualizarlo manualmente en cada archivo — no hay una constante centralizada.
- `assets/css/common.css` contiene únicamente reglas verificadas como idénticas entre las páginas de producto; cada página conserva su propia paleta de colores (`:root`) y estilos específicos en su propio `<style>`.
- Métodos de pago por página: Windows, ESET, Office, ChatGPT Plus, Canva Pro y CapCut Pro aceptan Yape (Perú) y Western Union (internacional, enruta a la misma cuenta Yape). Google One y Kaspersky solo aceptan Yape — la activación/suscripción de esos dos está atada técnicamente a cuentas de Perú, así que no tiene sentido ofrecer pago internacional ahí.
- **Apple One está desactivado temporalmente** (a pedido del negocio): su tarjeta sigue en el HTML del hub pero oculta vía `assets/js/products.js` (`active: false`), no aparece en el sitemap, y su página tiene `meta robots noindex`. Para reactivarla hay que poner `active: true` en `products.js`, agregarla de nuevo al sitemap.xml y quitar el noindex.
- Productos que existen en la Base de Conocimiento pero **todavía no tienen página propia**: ESET Small Business Security (venta B2B por volumen, no es un simple card de precio fijo — pendiente de detallar).
- **SEO/GEO**: cada página tiene `<title>` y `<meta description>` únicos (nunca copiar el mismo texto entre dos páginas — es contenido duplicado y perjudica el ranking de ambas). El hub tiene JSON-LD `Organization` enriquecido con `address` (solo `addressCountry: "PE"`, sin ciudad — no confirmada), `areaServed` y `sameAs` (Facebook). Cada página de producto tiene su propio JSON-LD `Product`/`Offer`. No usar tipos de schema.org inventados (ej. "SoftwareStore" no existe en el vocabulario oficial) — verificar contra schema.org/docs/full.html antes de agregar un `@type` nuevo.
