# 1. Arquitectura y Cálculos - JNxKeys

## Arquitectura Técnica
- **Tipo de Aplicación:** Sitio Web Estático (SSG - Static Site Generation manual).
- **Patrón UI:** Páginas de producto como "Mini-SPAs". Una sola página HTML carga múltiples vistas (Producto, Confianza, Pago) que se alternan con JavaScript modificando el DOM mediante funciones (ej. `goScreen()`).
- **Base de Datos:** Ninguna en producción. Los productos y estados de disponibilidad básicos se manejan en cliente mediante el archivo `assets/js/products.js`.

## Estructura de Costos Operativos (Infraestructura)
Al utilizar una arquitectura "Serverless / Static" en un proveedor gratuito, los costos de mantenimiento técnico son prácticamente nulos, permitiendo maximizar los márgenes.

| Concepto | Proveedor | Costo Estimado (Mensual) |
| :--- | :--- | :--- |
| Hosting | GitHub Pages | $0.00 |
| Base de Datos | N/A | $0.00 |
| Dominio | GitHub (subdominio) | $0.00 |
| **Total Infraestructura** | | **$0.00** |

## Modelo de Negocio, Cálculos y Márgenes
- **Costo de Adquisición (COGS):** Compra mayorista de licencias (Windows, Office, Antivirus) y gestión integral de cuentas familiares (Google One, Canva, ChatGPT). Los detalles de precios de costo se manejan offline (Excel/Notion).
- **Precio de Venta (PVP):** Establecido en Soles (PEN) con enfoque altamente competitivo en el mercado peruano.
- **Flujo de Caja:** Inmediato (mediante Yape/Plin o transferencias directas). Sin comisiones porcentuales ni fijas de pasarelas de pago tipo Stripe o MercadoPago, lo que maximiza el margen neto por cada transacción realizada por WhatsApp.
