# 3. Manual Operativo - JNxKeys

Guía para la administración y mantenimiento del negocio y el sitio web en el día a día.

## 1. Ocultar o Activar un Producto
No es necesario borrar el código HTML para ocultar un producto agotado o inactivo temporalmente.
1. Abrir el archivo `assets/js/products.js`.
2. Ubicar la variable global `window.JNX_PRODUCTS`.
3. Cambiar el valor `active` a `false` para ocultar o `true` para mostrar.
```javascript
window.JNX_PRODUCTS = {
  "apple-one": { active: false }, // Producto Oculto
  "windows": { active: true }     // Producto Visible
};
```
*Nota: El script en el index ocultará automáticamente las tarjetas y sus categorías contenedoras si no hay productos activos en ellas.*

## 2. Actualización de Precios
Los precios actuales están estáticos ("hardcodeados") en el HTML. Para cambiar un precio:
1. Ir a `index.html` (para cambiar el precio "Desde S/XX" de presentación en la tarjeta del hub).
2. Ir a la carpeta del producto respectivo (ej. `windows/index.html`) y actualizar el precio en la pantalla de detalles (Card de plan) y en la pantalla final de pago.

## 3. Gestión de Ventas por WhatsApp (Flujo Conversacional)
- **Recepción:** El cliente llega con un mensaje pre-armado vía botón (ej. "Quiero información sobre Windows 11 Pro").
- **Validación:** Confirmar la disponibilidad y enviar los métodos de pago (Código QR de Yape o Número de Cuenta).
- **Cierre:** Una vez que el usuario envíe la captura del comprobante, entregar la licencia alfanumérica (Office/Windows/Antivirus) o procesar el enlace de invitación (Canva/Google One).
- **Soporte Post-Venta:** Brindar instrucciones claras de activación y links oficiales de descarga para garantizar una buena experiencia y evitar reportes.

## 4. Cambio de Número de WhatsApp
Actualmente el número de atención (`925 244 643`) está escrito en los enlaces de múltiples archivos con el formato `href="https://wa.me/51925244643?text=..."`.
Si el número del negocio cambia, se debe usar la función de "Buscar y Reemplazar" en el editor de código en todo el proyecto buscando `51925244643` y reemplazándolo por el nuevo número (incluyendo el código de país `51` para Perú sin el signo más).
