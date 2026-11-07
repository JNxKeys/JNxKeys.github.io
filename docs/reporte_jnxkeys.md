# Reporte Maestro Integral del Negocio y Sistema: JNxKeys

Este documento proporciona una visión exhaustiva y actualizada del ecosistema tecnológico, comercial y operativo de **JNxKeys** (`jnxkeys.com`). Está estructurado para servir como **contexto maestro tanto para el equipo como para asistentes de IA**, documentando la arquitectura dual (B2C y B2B), alianzas mayoristas, herramientas de curaduría y la hoja de ruta de crecimiento.

---

## 1. Modelo de Negocio y Segmentación Dual

JNxKeys opera un modelo comercial híbrido de alta rentabilidad basado en dos canales claramente diferenciados:

```
                           ┌──────────────────────────────┐
                           │      JNxKeys Ecosystem       │
                           │       (jnxkeys.com)          │
                           └──────────────┬───────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
       [CANAL B2C - CONSUMIDOR]                       [CANAL B2B - EMPRESAS]
       Ruta: / (Home) & Subpáginas                    Ruta: /empresas/
       • Clientes finales, profesionales, estudiantes • Pymes, corporativos, consultores TI
       • Venta unitaria / packs personales            • Licenciamiento por volumen, SaaS y Servers
       • Pagos: Yape / Plin / BCP                     • Factura Electrónica con RUC (10 y 20)
       • Cierre 100% WhatsApp conversacional          • Pasarela Visa/Izipay, transferencias empresa
```

### Canal B2C (Consumo Masivo & Profesionales)
- **Catálogo:** Licencias perpetuas individuales (Windows 11 Pro, Office 2021) y suscripciones compartidas/personales gestionadas (Google One IA, ChatGPT Plus, Canva Pro, CapCut Pro).
- **Flujo:** Landing pages tipo Mini-SPA de 3 pasos (Producto → Confianza → Pago) con deep-linking hacia WhatsApp.

### Canal B2B (Soluciones Corporativas para Empresas)
- **Alianza Estratégica:** Partner mayorista oficial de **Ingram Micro Perú** (Customer ID: `430032`, Cloud Account: `1000843721`).
- **Portal VIP de Clientes:** Intranet de suscripciones en `https://jnxkeys.pe.xvantage.com` que otorga un estatus corporativo de primer nivel a clientes recurrentes.
- **Facturación y Cumplimiento:** Emisión formal de Factura con RUC (deducible al 100% como gasto operativo ante SUNAT).
- **Estructura en 4 Carruseles Temáticos:**
  1. *Ciberseguridad & Antivirus Corporativo* (ESET PROTECT, Kaspersky Small Office / Endpoint Cloud).
  2. *Ofimática & Suites Cloud Empresariales* (Microsoft 365 Business Standard/Basic, Google Workspace 2TB, Office LTSC 2024).
  3. *Sistemas Operativos & Servidores* (Windows 11/10 Pro por volumen, Windows Server 2022/2025, RDS CALs de acceso remoto).
  4. *Diseño, IA & Especialidad* (Adobe Creative Cloud Teams, Autodesk AutoCAD/Revit, Gemini IA Workspace, Canva Equipos).

---

## 2. Arquitectura Tecnológica

El sistema combina la velocidad y estabilidad de frontend estático con un backend administrativo modular para la curaduría de inventario:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             FRONTEND PUBLICO                                │
│   • HTML5 semántico, CSS3 obsidian dark slate (#0A0F1D, #0F172A)            │
│   • Vanilla JavaScript de alto rendimiento (sin frameworks pesados)         │
│   • Carruseles con navegación suave horizontal y scroll snap                │
│   • Hidratación dinámica en vivo vía syncLiveB2BData()                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND LOCAL & API REST                            │
│   • Node.js nativo (server.js en puerto 8080, 0.0.0.0 LAN access)           │
│   • GET /api/b2b-products       -> Lee catálogo central b2b_products.json   │
│   • POST /api/save-b2b-products -> Guarda catálogo curado y márgenes        │
│   • POST /api/save-ads          -> Actualiza franjas y modales de anuncios  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      INTEGRACIONES EXTERNAS & APIS                          │
│   • Ingram Micro Developer API (OAuth 2.0 / apigee gateway)                 │
│   • Google Analytics 4 (ID: G-XTFDKH1ESP con tracking de eventos B2B)       │
│   • WhatsApp Business API (enlaces estructurados con precio y RUC)          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Herramientas Administrativas Internas

### 1. Curador B2B & Margen Mayorista (`/admin/curador-b2b/`)
Permite a César (administrador) evaluar oportunidades de catálogo mayorista y gestionar la rentabilidad en tiempo real:
- **Agrupación Carrusel & Etiqueta:** Mantiene en una sola celda compacta la asignación de carrusel (1 a 4) y la etiqueta destacada (*Consola Cloud*, *Más Vendido*, *Permanente*).
- **Link de Publicidad / Ficha Técnica Oficial (`detail_link`):** Campo editable con botón de prueba directa `↗` para enlazar cada software a su landing o ficha de especificaciones detallada.
- **Bloque de Condiciones & Visibilidad Comercial:**
  - `⏱️ Tiempo Licencia` (ej: *1 Año Oficial*, *Permanente De Por Vida*).
  - `💳 Tipo de Paga` (ej: *Suscripción Anual*, *Pago Único (Sin cuotas)*).
  - `⚡ Disponibilidad / Entrega` (ej: *⚡ Activación < 15 min*, *⚡ Entrega Inmediata*).
- **Cálculo Dinámico de Márgenes:** Muestra en vivo Costo Ingram (S/), MSRP sugerido, margen neto en S/ y rentabilidad porcentual (`+S/ XX.XX (XX%)`) al escribir cualquier nuevo precio de venta.
- **Publicación Instantánea:** El botón *“💾 Guardar y Publicar en Tienda”* actualiza el archivo maestro `assets/data/b2b_products.json` y sincroniza la tienda corporativa sin tocar código.

### 2. Gestor de Anuncios y Promociones (`/admin/`)
- Control de banner superior (franja de anuncio) y ventana modal promocional.
- Permite activar/desactivar ofertas especiales, editar textos, enlaces y temporizadores de cuenta regresiva.

---

## 4. Estructura de Datos (`assets/data/b2b_products.json`)

Cada producto del catálogo B2B maneja el siguiente esquema completo:

```json
{
  "id": "m365-business-standard",
  "name": "Microsoft 365 Business Standard",
  "category": "ofimatica",
  "badge": "Más Vendido",
  "badge_class": "badge-cloud",
  "desc": "Apps instalables de escritorio en 5 PCs/Macs + Correo corporativo 50GB + 1TB OneDrive.",
  "pay_type": "Suscripción Recurrente",
  "duration": "1 Año Oficial",
  "availability": "⚡ Alta en Tenant Oficial",
  "detail_link": "https://jnxkeys.com/office/",
  "cost_usd": 11.20,
  "cost_pen": 42.50,
  "msrp_pen": 65.00,
  "sale_price_pen": "65.00",
  "price_label": "Mensual o Anual",
  "features": [
    "Word, Excel, PowerPoint, Outlook, Teams",
    "Correo corporativo con tu dominio",
    "1TB de almacenamiento en la nube"
  ],
  "active": true
}
```

---

## 5. Estado de la Integración con Ingram Micro

| Componente | Estado Actual | Observaciones / Próxima Acción |
| :--- | :--- | :--- |
| **Cuenta Ingram Perú** | `Activa (ID: 430032)` | RUC validado, acceso a catálogo Perú (XVANTAGE). |
| **Cloud Account CloudBlue** | `Activa (ID: 1000843721)` | Asociación con Google Workspace en estado *"En procesamiento"*. |
| **Ingram Developer App (Prod)** | `430032-JNxKeys_Catalog` | Estado: **In Review** (revisión administrativa 24-48h). |
| **Ingram Developer App (Sandbox)** | `430032-SandboxApp` | Estado: **In Review**. |
| **Handshake OAuth 2.0** | `Completado ✓ (200 OK)` | Token Bearer verificado mediante `scripts/ingram_api.js`. |
| **Xvantage MCP Server** | `Disponible para Habilitar` | Detectado en el catálogo de integraciones de Ingram XVANTAGE. |

---

## 6. Filosofía UX: "El detalle se va al link"

Para evitar tarjetas sobrecargadas que saturen al tomador de decisiones empresarial:
1. **En la tarjeta de la tienda:** Se exponen únicamente los 3 puntos de decisión clave:
   - Tiempo de Licencia (`⏱️ 1 Año`, `⏱️ De Por Vida`)
   - Tipo de Pago (`💳 Suscripción Anual`, `💳 Pago Único`)
   - Disponibilidad (`⚡ Entrega Inmediata`, `⚡ Activación < 15 min`)
2. **Doble Botón de Acción:**
   - **`[ 📄 Ficha Oficial ↗ ]`**: Abre el enlace de publicidad o especificaciones completas (`detail_link`) en una nueva pestaña.
   - **`[ Cotizar 💬 ]`**: Redirige al WhatsApp corporativo con un mensaje estructurado con el nombre del software, precio de venta en soles y solicitud de Factura con RUC.

---

## 7. Hoja de Ruta: ¿Qué continúa a continuación?

Las siguientes etapas estratégicas están priorizadas para la consolidación comercial:

### Fase 1: Automatización y Aprobación de APIs (Inmediato)
- [ ] **Monitorear aprobación de la App en Ingram:** Una vez aprobada `430032-JNxKeys_Catalog` en Developer Portal, activar la consulta directa del endpoint de `Price and Availability` para sincronizar costos mayoristas automáticamente.
- [ ] **Habilitar MCP Server en Ingram XVANTAGE:** Evaluar la integración nativa del MCP Server de Ingram Micro para consultas de inventario mediante agentes de IA.
- [ ] **Seguimiento a Google Workspace:** Verificar en CloudBlue la culminación del procesamiento para comercializar tenants directos de Google.

### Fase 2: Captura y Cierre de Leads B2B (CRO & Ventas)
- [ ] **Modal de Solicitud de Cotización Formal (PDF):** Agregar un formulario rápido para empresas que requieren orden de compra o proforma formal en PDF antes de transferir.
- [ ] **Plantilla Automatizada de Cotización:** Generar proformas con membrete de JNxKeys, datos de cuenta bancaria BCP/Interbank y condiciones comerciales en 1 clic.
- [ ] **Landings de Especialidad:** Conectar fichas técnicas detalladas para *Windows Server*, *RDS CALs* y *Autodesk Revit/AutoCAD*.

### Fase 3: Despliegue en Servidor de Producción
- [ ] Configurar el servicio Node.js en hosting de producción (o contenedor VPS/Render/Railway) para que el Curador B2B mantenga persistencia online fuera del entorno local.
- [ ] Configurar respaldos automáticos de `b2b_products.json` y `ads.json` sincronizados con el repositorio GitHub.
