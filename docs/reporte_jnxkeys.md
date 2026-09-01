# Reporte Integral del Sitio Web: JNxKeys

Este documento proporciona un análisis profundo y detallado del sitio web estático `jnxkeys.github.io`. Está estructurado para servir como **contexto maestro para cualquier Asistente de IA**, permitiéndole entender rápidamente el modelo de negocio, la tecnología, la estructura y las posibles áreas de mejora u optimización (CRO, SEO, Ventas).

---

## 1. Modelo de Negocio y Operaciones
- **Nicho:** Venta de licencias digitales de software y suscripciones premium (100% originales).
- **Público Objetivo:** Principalmente usuarios en Perú (Estudiantes, Negocios locales, Consultores).
- **Flujo de Venta:** Es un modelo de "venta conversacional" (Conversational Commerce). El sitio actúa como un catálogo/landing page, pero la transacción, atención y entrega se cierran de forma manual e inmediata a través de **WhatsApp**.
- **Métodos de Pago:** 
  - **Yape:** Para clientes locales (Perú).
  - **Western Union:** Para clientes internacionales (solo aplica a productos que no tienen restricción geográfica. *Google One y Kaspersky están limitados a cuentas de Perú*).
- **Base de Conocimiento:** Los costos internos, precios maestros y detalles de combos no residen en el código fuente, sino en un documento externo mantenido por el dueño.

## 2. Arquitectura Tecnológica
- **Stack:** HTML5, CSS3, Vanilla JavaScript (JS inline y scripts básicos).
- **Hosting:** GitHub Pages (sitio estático, sin backend, sin servidor propio).
- **Frameworks:** Ninguno. Es un desarrollo custom sin librerías pesadas como React, Vue o Bootstrap.
- **Flujo de Páginas:** Las páginas de producto funcionan como **mini-SPAs (Single Page Applications)**. Una sola carga HTML contiene 3 "pantallas" (Producto → Confianza → Pago), las cuales se alternan ocultando/mostrando elementos del DOM con JS (`goScreen()`).

## 3. Estructura y Navegación del Sitio
El sitio tiene un hub principal y páginas dedicadas por producto, además de una sección de ofertas.

- **`/` (index.html - Hub Principal):** Presenta las categorías de productos, carrusel promocional de "Combos" y propuestas de valor (confianza, licencias originales, pago seguro).
- **`/combos/`:** Landing page dedicada a 10 ofertas empaquetadas (packs de productos con descuento cruzado).
- **Páginas de Producto Individuales:**
  - `windows/`: SO (Windows 10 Pro / 11 Pro)
  - `office/`: Productividad (Microsoft 365, Office 2019/2021)
  - `eset/` & `kaspersky/`: Seguridad (Antivirus)
  - `google-one/` & `chatgpt/`: Inteligencia Artificial (Planes Plus, Gemini Advanced)
  - `canva/` & `capcut/`: Diseño y Video Pro
  - `apple-one/`: Entretenimiento (*Actualmente inactiva/oculta temporalmente a nivel JS y SEO*).

## 4. UI/UX y Patrones de Componentes
Aunque no usa frameworks, el sitio mantiene consistencia a través de patrones de diseño replicados:
- **Cinta de Marca (Top Ribbon):** Presente en todas las pantallas iniciales, refuerza la identidad con un degradado de color específico para cada producto.
- **Deep-linking en Botones (WhatsApp):** Los botones "Pedir por WhatsApp" no envían un simple "Hola". Generan un mensaje pre-armado con el nombre exacto del producto o plan seleccionado. Si es una suscripción (ej. Google One mensual/anual), el texto incluye esa variable.
- **Botones de Compartir (Share):** Generan un enlace que apunta directamente a una tarjeta específica mediante anclas (`#id-de-la-tarjeta`). Un script de JS hace `scrollIntoView()` al cargar si detecta el hash.
- **Botón Flotante de WhatsApp (FAB):** Global en todas las páginas, fijado abajo a la derecha.
- **Cross-Selling (Venta Cruzada):** Notas dentro de páginas individuales (ej. Windows, ChatGPT) que sugieren al usuario comprar un "Combo" que incluye ese software por un mejor precio.

## 5. Marketing, Analítica y SEO
- **Analítica:** Implementación de **Google Analytics 4 (GA4)**. 
  - **Eventos Personalizados Configurados:** `whatsapp_click`, `product_share`, `plan_share`, `combo_share`, `screen_view_product`, `product_click`, `combo_click`, `combos_expand`, `more_combos_click`.
- **SEO On-Page:**
  - Cada producto tiene su propio `<title>` y `<meta description>` (evitando canibalización).
  - Implementación de marcado de datos estructurados (Schema.org): `Organization` en el index, y `Product`/`Offer` en las landings específicas.
  - Generación de `sitemap.xml` manual y `robots.txt`.
- **Manejo de Productos Inactivos:** En lugar de borrar código, existe un script central (`assets/js/products.js`) con una variable `window.JNX_PRODUCTS`. Modificando `active: false` se ocultan las tarjetas dinámicamente en el hub principal.

## 6. Limitaciones Actuales y Deuda Técnica (Insights para la IA)
*Al pedirle ideas a la IA, puedes pedirle que se enfoque en solucionar o mejorar estos aspectos:*

1. **Gestión de Contacto Manual (Hardcoding):** El número de WhatsApp (`925 244 643`) está escrito en múltiples líneas del HTML a lo largo de cada archivo. Si cambia el número, requiere un "Buscar y Reemplazar" masivo en todo el repositorio.
2. **Código Duplicado en CSS y Estructura:** Al no usar un generador de sitios estáticos (SSG como Astro, Eleventy o Hugo) ni componentes, la estructura UI (como los botones de WhatsApp o navbars) y mucho CSS se repite en cada archivo `index.html` de los subdirectorios, dificultando mantenimientos globales.
3. **Escalabilidad de Productos B2B:** La base de conocimiento menciona licencias como *ESET Small Business Security* que requieren ventas B2B por volumen. El sitio actual está diseñado exclusivamente para B2C (tarjetas de precio unitario). No hay un flujo para cotizaciones empresariales.
4. **Carencia de Flujo de Abandono (Remarketing nulo):** Al depender 100% de que el cliente inicie el chat de WhatsApp, los usuarios que llegan hasta el botón pero no envían el mensaje se pierden. No hay captura de lead (formulario de email o similar) pre-WhatsApp.

---
**Nota para la IA asistente:** Utiliza este contexto para proponer estrategias de optimización de conversión (CRO), nuevas ideas de promociones, mejoras en el tracking, refactorización técnica progresiva o nuevas líneas de negocio viables bajo esta infraestructura estática.
