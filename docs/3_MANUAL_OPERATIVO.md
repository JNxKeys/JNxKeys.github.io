# 3. Manual Operativo - JNxKeys

Guía paso a paso para la administración, curaduría de inventario y atención comercial en el día a día.

---

## 1. Inicio del Servidor Local & Acceso Remoto
Para administrar la tienda, usar el Curador B2B o probar el sitio en red local:
1. Abrir terminal en la carpeta raíz del proyecto.
2. Ejecutar el servidor Node.js:
   ```powershell
   node server.js
   ```
3. El servidor quedará activo en el puerto `8080`:
   - Desde la misma PC: `http://localhost:8080/`
   - Desde una laptop en la misma red Wi-Fi: `http://192.168.1.107:8080/`

---

## 2. Uso del Curador B2B & Margen Mayorista (`/admin/curador-b2b/`)
Permite definir qué productos se venden a empresas, en qué carrusel aparecen y con qué margen:

1. **Abrir la herramienta:** Ingresar a `http://localhost:8080/admin/curador-b2b/` (o desde la laptop remota).
2. **Filtrar o Buscar:** Usar los botones de categoría (*1. Antivirus*, *2. Ofimática*, *3. Sistemas*, *4. Diseño & IA*) o la barra de búsqueda.
3. **Activar / Desactivar Productos:** Usar el switch toggle verde a la izquierda.
4. **Asignar Carrusel y Badge:** 
   - Seleccionar el carrusel de destino en el menú desplegable.
   - Modificar la etiqueta destacada (ej. *Más Vendido*, *Consola Cloud*, *De Por Vida*).
5. **Configurar Link de Publicidad (`detail_link`):**
   - Escribir la URL de destino (ej. `https://jnxkeys.com/office/`).
   - Clic en el botón `↗` para probar que el enlace funcione correctamente.
6. **Ajustar Condiciones & Visibilidad:**
   - `Tiempo Licencia:` Definir la duración oficial (*1 Año Oficial*, *Permanente De Por Vida*).
   - `Tipo de Paga:` Definir la modalidad (*Suscripción Anual*, *Pago Único*).
   - `Disponibilidad:` Indicar el tiempo de entrega (*⚡ Activación < 15 min*, *⚡ Entrega Inmediata*).
7. **Ajustar Precio de Venta:** Modificar el valor en la columna *Tu Precio Venta (S/)*. El margen neto en S/ y % se recalcula automáticamente en vivo.
8. **Publicar Cambios:** Hacer clic en el botón superior verde **"💾 Guardar y Publicar en Tienda"**. Los cambios impactarán de inmediato en `/empresas/`.

---

## 3. Administración de Anuncios y Promociones (`/admin/`)
1. Ingresar a `http://localhost:8080/admin/`.
2. Modificar el texto de la franja superior (Header Bar) o la ventana emergente (Modal).
3. Establecer la fecha límite del contador de cuenta regresiva.
4. Hacer clic en **"Guardar Anuncios"** para persistir la configuración en `assets/data/ads.json`.

---

## 4. Gestión de Ventas B2B (Flujo Corporativo con Factura)
1. **Recepción:** El cliente hace clic en *"Cotizar con Factura"* desde cualquier tarjeta de `/empresas/` y llega a WhatsApp con un mensaje estructurado con el nombre del producto y el precio acordado.
2. **Datos Fiscales:** Solicitar el número de RUC (10 o 20) y Razón Social de la empresa.
3. **Verificación de Régimen:** Validar que el cliente requiera Factura Electrónica para deducción tributaria ante SUNAT.
4. **Pago Empresarial:** Proporcionar las opciones de abono:
   - Transferencia directa a cuenta corriente BCP Empresarial.
   - Enlace de pago con tarjeta de crédito/débito empresarial (Izipay / Visa).
5. **Aprovisionamiento y Entrega:**
   - Licencias de software (Windows/Office/Server): Envío de clave digital + enlace ISO oficial + guía de activación.
   - Soluciones en la nube (Microsoft 365, Google Workspace, ESET Protect): Asignación en el tenant corporativo o invitación a la consola de administración del cliente.
6. **Emisión de Comprobante:** Emitir y adjuntar la Factura Electrónica (PDF + XML) al cliente.

---

## 5. Verificación del Conector de API Ingram Micro
Para verificar el estado de la conexión OAuth2 con Ingram Micro:
```powershell
node scripts/ingram_api.js
```
El script leerá las credenciales desde `.env`, realizará la solicitud a `api.ingrammicro.com:443/oauth/oauth30/token` y mostrará:
`✓ Token obtenido exitosamente: Bearer ...`

---

## 6. Respaldo de Cambios en Git y GitHub
Siempre que se realicen cambios significativos en código o precios:
```powershell
git -c safe.directory=* add -A
git -c safe.directory=* commit -m "chore: actualizacion de catalogo y configuraciones"
git -c safe.directory=* push origin main
```
Esto asegura que todo el trabajo quede respaldado en la nube de GitHub (`origin/main`).
