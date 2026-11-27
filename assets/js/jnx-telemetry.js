/**
 * JNxKeys Telemetry & Lead Tracker Engine
 * Captura silenciosa de intención de compra hacia WhatsApp y telemetría de demanda en tiempo real.
 * Diseñado para operar a $0.00 en conjunto con Cloudflare Workers & Telegram Bot.
 */
(function() {
  'use strict';

  // Endpoint del Cloudflare Worker (por defecto ruta relativa si está en el mismo dominio o variable global)
  var API_HOST = window.JNX_API_URL || '';
  var LEAD_ENDPOINT = API_HOST + '/api/track-lead';
  var VIEW_ENDPOINT = API_HOST + '/api/track-view';

  // Determinar categoría por URL
  function detectCategory(pathname) {
    if (pathname.indexOf('/office') !== -1) return 'Ofimática';
    if (pathname.indexOf('/windows') !== -1) return 'Sistemas Operativos';
    if (pathname.indexOf('/eset') !== -1 || pathname.indexOf('/kaspersky') !== -1) return 'Antivirus';
    if (pathname.indexOf('/canva') !== -1 || pathname.indexOf('/capcut') !== -1) return 'Diseño & Video';
    if (pathname.indexOf('/chatgpt') !== -1 || pathname.indexOf('/google-one') !== -1) return 'Inteligencia Artificial & Cloud';
    if (pathname.indexOf('/combos') !== -1) return 'Packs & Combos';
    if (pathname.indexOf('/empresas') !== -1) return 'Corporativo B2B';
    return 'General';
  }

  // Enviar telemetría de forma no bloqueante (Beacon o Keepalive)
  function sendTelemetry(endpoint, data) {
    try {
      var payload = JSON.stringify(data);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, payload);
      } else {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(function() {});
      }
    } catch (e) {
      // Silencioso para nunca interrumpir al usuario
    }
  }

  // 1. Telemetría de Visita (Para mapear horarios de tráfico real)
  function recordPageView() {
    var device = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ? 'Móvil' : 'Desktop';
    var viewData = {
      path: window.location.pathname,
      category: detectCategory(window.location.pathname),
      device: device,
      referrer: document.referrer || 'Directo',
      screen: window.innerWidth + 'x' + window.innerHeight,
      ts: Date.now()
    };
    sendTelemetry(VIEW_ENDPOINT, viewData);
  }

  // 2. Interceptor Global de Intenciones de Compra (WhatsApp)
  function setupWhatsAppInterceptor() {
    document.addEventListener('click', function(e) {
      // Buscar si el elemento clicado o alguno de sus padres apunta a WhatsApp o es una tarjeta
      var target = e.target;
      var waLink = target.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
      var prodCard = target.closest('.prod-card, .combo-card, .cyber-card, .b2b-card, .product-tab, .plan-slide');

      // Si no es un enlace de WhatsApp directo ni una tarjeta con WhatsApp, continuar
      if (!waLink && !prodCard) return;

      var href = waLink ? waLink.getAttribute('href') : '';
      var onclickAttr = prodCard ? prodCard.getAttribute('onclick') || '' : '';

      // Verificar si hay llamada a wa.me en onclick
      var isWhatsAppAction = (href && href.indexOf('wa.me') !== -1) || 
                             (onclickAttr && onclickAttr.indexOf('wa.me') !== -1) ||
                             (waLink && waLink.classList.contains('wa-fab'));

      if (!isWhatsAppAction) return;

      // Extraer nombre del producto
      var productName = 'Consulta General';
      var price = '';

      // Intento 1: Parámetro text de WhatsApp
      var fullUrl = href || onclickAttr;
      var textMatch = fullUrl.match(/[?&]text=([^&'\"]+)/);
      if (textMatch && textMatch[1]) {
        try {
          var decodedText = decodeURIComponent(textMatch[1]);
          // Si dice "Deseo información de Office 2021..."
          var infoMatch = decodedText.match(/(?:información de|informacion de|consultar por|comprar|pedido de)\s+([^.,\n]+)/i);
          if (infoMatch && infoMatch[1]) {
            productName = infoMatch[1].trim();
          } else {
            productName = decodedText.substring(0, 45).trim();
          }
        } catch (err) {}
      }

      // Intento 2: Nombre de la tarjeta en el DOM
      if (prodCard) {
        var nameEl = prodCard.querySelector('.card-name, .prod-title, .combo-title, .plan-name, h3, h2');
        if (nameEl && (!productName || productName === 'Consulta General')) {
          productName = nameEl.textContent.trim();
        }

        // Extraer precio
        var priceEl = prodCard.querySelector('.price-big, .prod-price, .combo-price, .plan-opt-price, .price');
        if (priceEl) {
          var priceMatch = priceEl.textContent.match(/S\/\.?\s*(\d+(?:\.\d{2})?)/i);
          if (priceMatch) {
            price = priceMatch[1];
          } else {
            price = priceEl.textContent.trim();
          }
        }
      }

      // Si es el botón flotante general
      if (waLink && waLink.classList.contains('wa-fab')) {
        productName = 'WhatsApp Flotante (Asesoría Rápida)';
      }

      var device = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ? 'Móvil' : 'Desktop';

      var leadData = {
        product: productName,
        price: price,
        category: detectCategory(window.location.pathname),
        path: window.location.pathname,
        device: device,
        referrer: document.referrer || 'Directo',
        ts: Date.now()
      };

      // Disparar telemetría instantánea al Worker
      sendTelemetry(LEAD_ENDPOINT, leadData);
    }, true); // Capturing phase para registrar antes de cualquier navegación
  }

  // Inicialización
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      recordPageView();
      setupWhatsAppInterceptor();
    });
  } else {
    recordPageView();
    setupWhatsAppInterceptor();
  }
})();
