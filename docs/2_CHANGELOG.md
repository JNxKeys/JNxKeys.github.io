# 2. Changelog - JNxKeys

Historial de versiones y actualizaciones significativas del sitio web y herramientas comerciales.

---

## [1.2.0] - 2026-11-07 — Curador B2B Avanzado & Visibilidad Comercial
### Añadido
- **Consolidación en Curador B2B (`admin/curador-b2b/index.html`):**
  - Fila compacta que integra **Carrusel Asignado** y **Etiqueta/Badge** en una sola celda estructurada.
  - Campo editable para **Link de Publicidad / Ficha Técnica Oficial (`detail_link`)** con botón de previsualización `↗` en tiempo real.
  - Bloque de **Condiciones & Visibilidad Comercial** con inputs para:
    - `Tiempo de Licencia` (ej. *1 Año Oficial*, *Permanente De Por Vida*).
    - `Tipo de Paga` (ej. *Suscripción Anual*, *Pago Único (Sin cuotas)*).
    - `Disponibilidad / Entrega` (ej. *⚡ Activación < 15 min*, *⚡ Entrega Inmediata*).
- **UX de Tarjetas en Tienda B2B (`empresas/index.html`):**
  - Implementación de la filosofía *"El detalle se va al link"*.
  - Píldoras de visibilidad comercial en cada tarjeta: `⏱️ Tiempo`, `💳 Tipo de Pago`, `⚡ Entrega`.
  - Doble botón de acción por tarjeta: `[ 📄 Ficha Oficial ↗ ]` (apunta a `detail_link`) y `[ Cotizar 💬 ]` (apunta a WhatsApp con precio dinámico y RUC).
  - Sincronización dinámica automática (`syncLiveB2BData()`) para hidratar las tarjetas desde `b2b_products.json`.
- **Estructura de Datos:** Actualización del esquema en `assets/data/b2b_products.json` para almacenar `detail_link`, `pay_type`, `duration` y `availability`.

---

## [1.1.0] - 2026-11-07 — División Empresas B2B & Integración Ingram Micro
### Añadido
- **Nueva Landing B2B (`empresas/index.html`):**
  - 4 carruseles temáticos interactivos: Ciberseguridad, Ofimática Cloud, Sistemas/Servidores y Diseño/IA.
  - Banner VIP de la Intranet Corporativa enlazando al portal de suscripciones Ingram XVANTAGE (`jnxkeys.pe.xvantage.com`).
  - Barra de confianza en medios de pago: Factura con RUC (10 y 20), Visa, Izipay y BCP Empresarial.
- **Backend Node.js (`server.js`):**
  - Servidor HTTP ligero escuchando en puerto `8080` (accesible en LAN y local).
  - Endpoints REST: `GET /api/b2b-products`, `POST /api/save-b2b-products` y `POST /api/save-ads`.
- **Curador de Rentabilidad Mayorista (`admin/curador-b2b/index.html`):**
  - Panel administrativo con cálculo dinámico de márgenes en soles y porcentaje (`+S/ XX (XX%)`).
  - Switch de activación ON/OFF por producto.
  - Filtro rápido por categoría y buscador en tiempo real.
- **Conector Ingram Micro Developer API (`scripts/ingram_api.js`):**
  - Handshake OAuth 2.0 funcional con generación de tokens Bearer validados ante Apigee.
- **Navegación & SEO:**
  - Enlace directo a `Empresas` en la barra de navegación principal de `index.html`.
  - Inclusión de `https://jnxkeys.com/empresas/` en `sitemap.xml` con prioridad `0.9`.

---

## [1.0.0] - Versión Inicial Base
### Añadido
- Lanzamiento del Hub principal (`index.html`) con UI moderna (fondo degradado, tipografía Outfit).
- Implementación del carrusel de "Combos" en el home para estrategias de cross-selling y up-selling.
- Creación de landings individuales tipo "Mini-SPA" para Windows, Office, Google One AI Plus, ChatGPT Plus, ESET, Kaspersky, Canva Pro y CapCut Pro.
- Implementación de botones de redirección a WhatsApp "Deep-Linked", pre-llenados con el producto/plan seleccionado.
- Archivo central `assets/js/products.js` para control global de disponibilidad (mostrar/ocultar productos).
- Configuración de Google Analytics 4 (GA4) con tracking de eventos personalizados.
- SEO Básico: Etiquetas Meta, Open Graph, Twitter Cards y marcado semántico Schema.org.

### Deprecado / Oculto
- Producto *Apple One* configurado en HTML pero oculto temporalmente en la UI principal vía JavaScript.
