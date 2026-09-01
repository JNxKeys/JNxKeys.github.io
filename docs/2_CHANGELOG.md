# 2. Changelog - JNxKeys

Historial de versiones y actualizaciones significativas del sitio web.

## [1.0.0] - Versión Inicial Base (Actual)
### Añadido
- Lanzamiento del Hub principal (`index.html`) con UI moderna (fondo degradado, tipografía Outfit).
- Implementación del carrusel de "Combos" en el home para estrategias de cross-selling y up-selling.
- Creación de landings individuales tipo "Mini-SPA" para los siguientes productos:
  - Windows (10 Pro / 11 Pro)
  - Microsoft Office (2019 / 2021 / 365)
  - Google One AI Plus
  - ChatGPT Plus
  - Antivirus ESET y Kaspersky
  - Diseño y Video: Canva Pro y CapCut Pro
- Implementación de botones de redirección a WhatsApp "Deep-Linked", pre-llenados con el producto/plan seleccionado.
- Archivo central `assets/js/products.js` para control global de disponibilidad (mostrar/ocultar productos).
- Configuración de Google Analytics 4 (GA4) con tracking de eventos personalizados (`whatsapp_click`, `product_click`, `combo_click`, etc.).
- SEO Básico: Etiquetas Meta, Open Graph (para compartir en redes), Twitter Cards y marcado semántico Schema.org.

### Deprecado / Oculto
- Producto *Apple One* configurado en HTML pero oculto temporalmente en la UI principal vía JavaScript.
