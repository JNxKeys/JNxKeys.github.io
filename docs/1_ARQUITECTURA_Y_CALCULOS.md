# 1. Arquitectura y Cálculos - JNxKeys

## Arquitectura Técnica

- **Tipo de Aplicación:** Arquitectura Híbrida.
  - **Frontend Público:** Sitio estático de alto rendimiento (HTML5 semántico, CSS3 obsidian dark slate, Vanilla JS).
  - **Backend de Curaduría:** Servidor Node.js ligero (`server.js` en puerto `8080`) que proporciona persistencia local/servidor vía endpoints REST para la administración de inventario y anuncios.
- **Patrón UI:** 
  - Canal B2C: Páginas de producto como "Mini-SPAs" alternando pantallas (Producto, Confianza, Pago) vía JS (`goScreen()`).
  - Canal B2B: Landing modular con 4 carruseles temáticos independientes con navegación suave y scroll snap.
- **Almacenamiento de Datos:**
  - `assets/data/b2b_products.json`: Catálogo maestro B2B con costos mayoristas, MSRP, precios de venta, badges, links oficiales y metadatos de visibilidad.
  - `assets/data/ads.json`: Configuración de campañas publicitarias, banners superiores y modales.
  - `assets/js/products.js`: Control de visibilidad rápida del catálogo B2C.

## Estructura de Costos Operativos (Infraestructura)

| Concepto | Proveedor | Costo Estimado (Mensual) |
| :--- | :--- | :--- |
| Frontend Hosting | GitHub Pages | $0.00 |
| Backend Local / Node.js | Servidor Interno / Localhost | $0.00 |
| Base de Datos JSON | Almacenamiento en disco local/repo | $0.00 |
| APIs de Integración | Ingram Micro Reseller API | $0.00 (Incluido con cuenta Partner) |
| **Total Infraestructura** | | **$0.00** |

## Modelo de Negocio, Cálculos y Márgenes Mayoristas

### Canal B2B (Ingram Micro)
- **Costo de Adquisición (COGS):** Precios mayoristas pactados con Ingram Micro Perú en Soles (PEN) y Dólares (USD al tipo de cambio oficial).
- **MSRP (Manufacturer's Suggested Retail Price):** Precio referencial del fabricante que permite calcular el descuento corporativo ofrecido al cliente.
- **Precio de Venta (PVP):** Configurado por César mediante el **Curador B2B** (`/admin/curador-b2b/`).
- **Fórmula de Margen Neto:**
  $$\text{Margen Neto (S/)} = \text{Precio Venta} - \text{Costo Mayorista Ingram}$$
  $$\text{Rentabilidad (\%)} = \left(\frac{\text{Margen Neto}}{\text{Costo Mayorista}}\right) \times 100$$
- **Rentabilidad Promedio del Portafolio:** ~58.4% sobre costos mayoristas.
- **Flujo de Pago Empresarial:** Facturación electrónica formal con RUC (10 y 20). Pagos vía Izipay / Visa y transferencias a cuenta corriente BCP Empresarial.
