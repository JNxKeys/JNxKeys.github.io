# 4. Marketing y SEO - JNxKeys

Estrategias de captación, analítica y optimización de conversiones para el negocio.

## SEO On-Page
- **Estructura de URLs Amigables:** El sitio utiliza carpetas semánticas (ej. `/windows/`, `/office/`) con un `index.html` interno para generar URLs limpias y fáciles de compartir sin el sufijo `.html`.
- **Metadatos Optimizados:** Títulos y meta descripciones únicos por cada producto, enfocados en intenciones de búsqueda locales ("long-tail keywords") como *"comprar windows 11 pro peru"* o *"antivirus original peru"*.
- **Marcado de Datos Estructurados (Schema.org):**
  - Tipo `Organization` en el index principal para definir la entidad "JNxKeys".
  - Se utiliza para mejorar la forma en que Google lee el sitio y mostrar resultados enriquecidos.
- **Rastreo:** `sitemap.xml` y `robots.txt` implementados en la raíz para guiar a los crawlers de los motores de búsqueda.

## Analítica (Google Analytics 4)
- **ID de Medición Activo:** `G-XTFDKH1ESP`
- **Eventos Personalizados Clave Trackeados:**
  - `whatsapp_click`: Cuando el usuario hace clic en el botón flotante o los botones de compra final. Esencial para medir la **Tasa de Conversión (Leads generados)**.
  - `product_click`: Clics en tarjetas del hub principal para ver qué producto atrae más interés.
  - `combo_click`: Clics en ofertas de la pasarela de combos.
  - `screen_view_product`: Tracking interno de las "mini-SPAs" para saber en qué paso exacto del embudo abandona el usuario (Paso 1: Info -> Paso 2: Confianza -> Paso 3: Pago).
  - `product_share` / `combo_share`: Medición de la viralidad o cuántas personas comparten productos con sus conocidos.

## Estrategias de Conversión (CRO)
- **Venta Cruzada y Up-Selling (Combos):** Posicionados estratégicamente en la parte superior del hub para aumentar el AOV (Average Order Value - Ticket Promedio) mostrando el ahorro al comprar paquetes. También se sugieren en las páginas individuales.
- **Micro-Copys de Confianza:** El mercado de licencias sufre de desconfianza. El diseño ataca esto con insignias claras de "Licencias originales", "Pago seguro Yape" y "Activación inmediata" antes del call to action.
- **Deep-linking (Reducción de Fricción):** Al compartir un producto o un combo, el enlace incluye un hash (ej. `#oficina-segura-estandar`). El JavaScript detecta el hash y hace un `scrollIntoView` automático hacia esa oferta, facilitando la conversión.
