/**
 * JNxKeys Telemetry, Metrics & Telegram Operations Center (Cloudflare Worker)
 * Arquitectura Serverless $0.00:
 * - Telemetría de Intención (WhatsApp Leads) y Vistas
 * - Base de Datos KV (JNX_METRICS)
 * - Bot de Telegram interactivo con botones de cobro en 1 toque
 * - Horarios pico y mapa de calor de demanda
 * - Cloudflare GraphQL Analytics (tráfico real inmune a AdBlock)
 * - QuickChart (Gráficos automáticos)
 * - Google Gemini IA (Diagnóstico de stock y estrategia de ofertas)
 */

export default {
  // Manejador de peticiones HTTP (Webhooks y API)
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Headers CORS para permitir llamadas desde jnxkeys.com
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. Endpoint: Captura de Intención de Compra (Clic a WhatsApp)
      if (url.pathname === '/api/track-lead' && request.method === 'POST') {
        const data = await request.json();
        const res = await handleTrackLead(data, request, env);
        return new Response(JSON.stringify(res), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 2. Endpoint: Captura de Vista de Página
      if (url.pathname === '/api/track-view' && request.method === 'POST') {
        const data = await request.json();
        const res = await handleTrackView(data, request, env);
        return new Response(JSON.stringify(res), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 3. Endpoint: Webhook de Telegram
      if (url.pathname === '/api/telegram-webhook' && request.method === 'POST') {
        const update = await request.json();
        await handleTelegramUpdate(update, env);
        return new Response('OK', { headers: corsHeaders });
      }

      // 4. Endpoint de salud / prueba
      if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({ status: 'ok', service: 'JNxKeys Analytics Bot' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },

  // Manejador de Tareas Programadas (Crons)
  async scheduled(event, env, ctx) {
    const cron = event.cron;
    const nowLima = getLimaDateTime();

    // Lunes 8:00 AM (13:00 UTC) -> Reporte Semanal
    if (cron === '0 13 * * 1') {
      await sendWeeklyReport(env);
    }
    // Día 1 de cada mes a las 6:00 AM (11:00 UTC) -> Reporte Mensual Ejecutivo con Gemini
    else if (cron === '0 11 1 * *') {
      await sendMonthlyReport(env);
    }
    // Diario 11:30 PM (04:30 UTC siguiente día) -> Cierre de Caja Nocturno
    else if (cron === '30 4 * * *') {
      await sendDailySummary(env);
    }
  }
};

/* =========================================================================
   UTILIDADES DE HORA Y FECHA (HORA OFICIAL PERÚ UTC-5)
========================================================================= */
function getLimaDateTime(dateObj = new Date()) {
  const formatter = new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(dateObj);
  const getPart = (type) => parts.find(p => p.type === type)?.value || '';

  const y = getPart('year');
  const m = getPart('month');
  const d = getPart('day');
  const hour = getPart('hour');
  const min = getPart('minute');

  return {
    dateKey: `${y}-${m}-${d}`,      // 2026-11-21
    monthKey: `${y}-${m}`,          // 2026-11
    hourKey: hour,                  // "20" (de 00 a 23)
    displayTime: `${hour}:${min}`,  // "20:45"
    displayDate: `${d}/${m}/${y}`
  };
}

/* =========================================================================
   1. REGISTRO DE INTENCIÓN DE COMPRA (LEAD WHATSAPP)
========================================================================= */
async function handleTrackLead(data, request, env) {
  const time = getLimaDateTime();
  const leadId = 'JNX-L' + Math.floor(1000 + Math.random() * 9000);

  // Ubicación detectada por Cloudflare
  const city = request.cf?.city || 'Lima';
  const country = request.cf?.country || 'PE';
  const region = request.cf?.region || 'Lima';

  const product = data.product || 'Licencia General';
  const price = data.price ? String(data.price).replace(/[^0-9.]/g, '') : '';
  const category = data.category || 'General';
  const page = data.path || '/';
  const device = data.device || 'Móvil';

  const leadRecord = {
    id: leadId,
    product,
    price,
    category,
    page,
    device,
    city,
    country,
    date: time.dateKey,
    time: time.displayTime,
    hour: time.hourKey,
    status: 'pending',
    ts: Date.now()
  };

  // Guardar lead individual en KV (expira en 45 días)
  if (env.JNX_METRICS) {
    await env.JNX_METRICS.put(`lead:${time.dateKey}:${leadId}`, JSON.stringify(leadRecord), {
      expirationTtl: 60 * 60 * 24 * 45
    });

    // Actualizar métricas acumuladas del día
    const dayStatsKey = `day:${time.dateKey}`;
    let dayStats = await env.JNX_METRICS.get(dayStatsKey, { type: 'json' });
    if (!dayStats) {
      dayStats = createEmptyDayStats(time.dateKey);
    }

    dayStats.total_leads = (dayStats.total_leads || 0) + 1;
    dayStats.by_product[product] = (dayStats.by_product[product] || 0) + 1;
    dayStats.by_category[category] = (dayStats.by_category[category] || 0) + 1;
    dayStats.by_hour[time.hourKey] = (dayStats.by_hour[time.hourKey] || 0) + 1;
    dayStats.by_city[city] = (dayStats.by_city[city] || 0) + 1;

    await env.JNX_METRICS.put(dayStatsKey, JSON.stringify(dayStats));
  }

  // Notificación Push instantánea a Telegram
  await sendLeadToTelegram(leadRecord, env);

  return { success: true, leadId };
}

/* =========================================================================
   2. REGISTRO DE VISTA DE PÁGINA (TELEMETRÍA DE HORARIOS)
========================================================================= */
async function handleTrackView(data, request, env) {
  if (!env.JNX_METRICS) return { success: true };
  const time = getLimaDateTime();

  const dayStatsKey = `day:${time.dateKey}`;
  let dayStats = await env.JNX_METRICS.get(dayStatsKey, { type: 'json' });
  if (!dayStats) {
    dayStats = createEmptyDayStats(time.dateKey);
  }

  dayStats.total_views = (dayStats.total_views || 0) + 1;
  dayStats.by_hour[time.hourKey] = (dayStats.by_hour[time.hourKey] || 0) + 1;

  await env.JNX_METRICS.put(dayStatsKey, JSON.stringify(dayStats));
  return { success: true };
}

function createEmptyDayStats(dateStr) {
  const hours = {};
  for (let i = 0; i < 24; i++) {
    hours[String(i).padStart(2, '0')] = 0;
  }
  return {
    date: dateStr,
    total_views: 0,
    total_leads: 0,
    total_sales: 0,
    total_revenue_pen: 0,
    by_product: {},
    by_category: {},
    by_hour: hours,
    by_city: {}
  };
}

/* =========================================================================
   3. NOTIFICACIONES PUSH A TELEGRAM
========================================================================= */
async function sendLeadToTelegram(lead, env) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;

  const priceTag = lead.price ? `S/ ${lead.price}` : 'Por cotizar';
  const text = 
    `🔔 *NUEVA INTENCIÓN DE COMPRA #${lead.id}*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 *Producto:* ${escapeMarkdown(lead.product)}\n` +
    `💰 *Precio Ref:* \`${priceTag}\`\n` +
    `🏷️ *Categoría:* ${lead.category}\n` +
    `📄 *Página:* \`${lead.page}\`\n` +
    `📱 *Dispositivo:* ${lead.device}\n` +
    `📍 *Ubicación:* ${lead.city}, ${lead.country}\n` +
    `🕒 *Hora:* ${lead.time} (Hora Perú)\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💬 _El cliente acaba de hacer clic en tu WhatsApp._\n` +
    `_Cuando te confirme el pago por Yape/Plin, márcalo abajo:_`;

  // Botones en línea interactivos
  const inline_keyboard = [];
  if (lead.price && !isNaN(Number(lead.price))) {
    inline_keyboard.push([
      { text: `✅ Cobrado S/ ${lead.price}`, callback_data: `paid:${lead.id}:${lead.price}` },
      { text: `❌ No concretó`, callback_data: `cancel:${lead.id}` }
    ]);
  } else {
    inline_keyboard.push([
      { text: `✅ Cobrado (S/ 70)`, callback_data: `paid:${lead.id}:70` },
      { text: `✅ Cobrado (S/ 50)`, callback_data: `paid:${lead.id}:50` }
    ]);
    inline_keyboard.push([
      { text: `❌ No concretó`, callback_data: `cancel:${lead.id}` }
    ]);
  }

  await callTelegram('sendMessage', {
    chat_id: env.TELEGRAM_CHAT_ID,
    text,
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard }
  }, env);
}

/* =========================================================================
   4. CONTROLADOR DE EVENTOS DE TELEGRAM (COMANDOS Y CALLBACKS)
========================================================================= */
async function handleTelegramUpdate(update, env) {
  // Manejo de botones interactivos
  if (update.callback_query) {
    await handleCallbackQuery(update.callback_query, env);
    return;
  }

  // Manejo de mensajes de texto
  const msg = update.message;
  if (!msg || !msg.text) return;

  // Filtro de seguridad: Solo el administrador autorizado
  if (String(msg.chat.id) !== String(env.TELEGRAM_CHAT_ID)) {
    await callTelegram('sendMessage', {
      chat_id: msg.chat.id,
      text: '⛔ Acceso no autorizado. Este bot es el centro de mando privado de JNxKeys.'
    }, env);
    return;
  }

  const text = msg.text.trim();
  const args = text.split(/\s+/);
  const cmd = args[0].toLowerCase();

  switch (cmd) {
    case '/start':
    case '/menu':
    case '/ayuda':
      await cmdHelp(msg.chat.id, env);
      break;

    case '/resumen':
    case '/hoy':
      await cmdDailySummary(msg.chat.id, env);
      break;

    case '/horarios':
    case '/horas':
      await cmdPeakHours(msg.chat.id, env);
      break;

    case '/top':
    case '/ranking':
      await cmdTopProducts(msg.chat.id, env);
      break;

    case '/visitas':
    case '/trafico':
      await cmdCloudflareTraffic(msg.chat.id, env);
      break;

    case '/semana':
      await sendWeeklyReport(env, msg.chat.id);
      break;

    case '/mes':
      await sendMonthlyReport(env, msg.chat.id);
      break;

    case '/venta':
      await cmdManualSale(args, msg.chat.id, env);
      break;

    default:
      await callTelegram('sendMessage', {
        chat_id: msg.chat.id,
        text: `Comando no reconocido. Escribe /menu para ver la lista de comandos disponibles.`
      }, env);
      break;
  }
}

// Menú interactivo
async function cmdHelp(chatId, env) {
  const menuText = 
    `🛡️ *JNxKeys — CENTRO DE CONTROL & TELEMETRÍA* 🛡️\n\n` +
    `📊 *OPERACIÓN & DEMANDA DIARIA:*\n` +
    `• \`/resumen\` — Balance del día: visitas, clics a WhatsApp y ventas.\n` +
    `• \`/horarios\` — Mapa de calor: horas pico en que la gente busca licencias.\n` +
    `• \`/top\` — Ranking de los 5 productos con mayor intención de compra.\n` +
    `• \`/venta [producto] [monto]\` — Registrar venta manual en caja (ej: \`/venta office-2021 70\`).\n\n` +
    `🌐 *TRÁFICO & ESTRATEGIA (Cloudflare + IA):*\n` +
    `• \`/visitas\` — Tráfico real Cloudflare (visitantes únicos sin AdBlock).\n` +
    `• \`/semana\` — Rendimiento de los últimos 7 días con gráfico.\n` +
    `• \`/mes\` — Reporte consolidado con gráfico de dona y diagnóstico de Gemini IA.\n\n` +
    `_💡 Tip: Cuando un cliente te escriba y pague por Yape, puedes confirmar el cobro directamente tocando los botones bajo cada alerta._`;

  await callTelegram('sendMessage', {
    chat_id: chatId,
    text: menuText,
    parse_mode: 'Markdown'
  }, env);
}

// Clics a botones de confirmar cobro
async function handleCallbackQuery(cb, env) {
  const data = cb.data;
  const parts = data.split(':');
  const action = parts[0];
  const leadId = parts[1];
  const amount = Number(parts[2] || 0);

  if (action === 'paid') {
    const time = getLimaDateTime();
    const dayKey = `day:${time.dateKey}`;
    let dayStats = await env.JNX_METRICS.get(dayKey, { type: 'json' }) || createEmptyDayStats(time.dateKey);

    dayStats.total_sales = (dayStats.total_sales || 0) + 1;
    dayStats.total_revenue_pen = (dayStats.total_revenue_pen || 0) + amount;
    await env.JNX_METRICS.put(dayKey, JSON.stringify(dayStats));

    // Confirmar callback
    await callTelegram('answerCallbackQuery', {
      callback_query_id: cb.id,
      text: `✅ ¡Cobro de S/ ${amount} registrado en caja!`
    }, env);

    // Editar mensaje original
    await callTelegram('editMessageText', {
      chat_id: cb.message.chat.id,
      message_id: cb.message.message_id,
      text: `${cb.message.text}\n\n✅ *VENTA COBRADA:* \`S/ ${amount.toFixed(2)}\`\n🎉 _Registrado en caja de hoy._`,
      parse_mode: 'Markdown'
    }, env);
  } else if (action === 'cancel') {
    await callTelegram('answerCallbackQuery', {
      callback_query_id: cb.id,
      text: 'Marcado como no concretado.'
    }, env);

    await callTelegram('editMessageText', {
      chat_id: cb.message.chat.id,
      message_id: cb.message.message_id,
      text: `${cb.message.text}\n\n❌ *NO CONCRETADO*`,
      parse_mode: 'Markdown'
    }, env);
  }
}

// Comando /resumen (Balance del día)
async function cmdDailySummary(chatId, env) {
  const time = getLimaDateTime();
  const dayStats = await env.JNX_METRICS.get(`day:${time.dateKey}`, { type: 'json' }) || createEmptyDayStats(time.dateKey);

  const leads = dayStats.total_leads || 0;
  const sales = dayStats.total_sales || 0;
  const rev = (dayStats.total_revenue_pen || 0).toFixed(2);
  const conversionRate = leads > 0 ? ((sales / leads) * 100).toFixed(1) : '0.0';

  // Ordenar productos más consultados
  const topProds = Object.entries(dayStats.by_product || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([p, count], i) => `  ${i + 1}. ${p} (${count} clics)`)
    .join('\n') || '  (Sin consultas registradas hoy)';

  const text = 
    `📅 *BALANCE DIARIO DE JNxKeys* — \`${time.displayDate}\`\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 *Caja en Soles:* \`S/ ${rev}\`\n` +
    `📦 *Ventas Cerradas:* \`${sales}\`\n` +
    `💬 *Clics a WhatsApp:* \`${leads}\`\n` +
    `🎯 *Efectividad de Cierre:* \`${conversionRate}%\`\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🔥 *Lo más pedido hoy:*\n${topProds}\n\n` +
    `_Consulta las horas de mayor actividad con /horarios._`;

  await callTelegram('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown'
  }, env);
}

// Comando /horarios (Mapa de calor de horas pico)
async function cmdPeakHours(chatId, env) {
  const time = getLimaDateTime();
  const dayStats = await env.JNX_METRICS.get(`day:${time.dateKey}`, { type: 'json' }) || createEmptyDayStats(time.dateKey);
  const hours = dayStats.by_hour || {};

  // Formato de bloques horarios
  const blocks = [
    { label: '🌅 Madrugada (00h - 06h)', hours: ['00','01','02','03','04','05'] },
    { label: '☕ Mañana (06h - 12h)',    hours: ['06','07','08','09','10','11'] },
    { label: '☀️ Tarde (12h - 18h)',     hours: ['12','13','14','15','16','17'] },
    { label: '🌙 Noche (18h - 00h)',     hours: ['18','19','20','21','22','23'] }
  ];

  let body = '';
  let maxCount = 0;
  let bestBlock = '';

  for (const b of blocks) {
    const total = b.hours.reduce((acc, h) => acc + (hours[h] || 0), 0);
    if (total > maxCount) {
      maxCount = total;
      bestBlock = b.label;
    }
    const bar = '█'.repeat(Math.min(total, 15));
    body += `${b.label}\n  ${bar} \`${total} consultas\`\n\n`;
  }

  const text = 
    `🕒 *MAPA DE HORARIOS & PICOS DE DEMANDA*\n` +
    `📅 Fecha: \`${time.displayDate}\`\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    body +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🎯 *Conclusión Estratégica:*\n` +
    (maxCount > 0 
      ? `Tu franja más activa hoy fue: *${bestBlock}* con ${maxCount} consultas.\n💡 *Recomendación:* Mantén atención inmediata en WhatsApp en esa franja horaria para maximizar el cierre de ventas.`
      : `Aún no hay suficientes datos hoy para proyectar la hora pico.`);

  await callTelegram('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown'
  }, env);
}

// Comando /top (Productos más demandados)
async function cmdTopProducts(chatId, env) {
  const time = getLimaDateTime();
  const dayStats = await env.JNX_METRICS.get(`day:${time.dateKey}`, { type: 'json' }) || createEmptyDayStats(time.dateKey);
  const prods = Object.entries(dayStats.by_product || {}).sort((a,b) => b[1] - a[1]);

  if (prods.length === 0) {
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: 'Aún no hay registros de clics en productos hoy.'
    }, env);
    return;
  }

  const lines = prods.slice(0, 7).map(([name, count], i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '▫️';
    return `${medal} *${name}:* \`${count} consultas a WhatsApp\``;
  }).join('\n');

  const text = 
    `🏆 *RANKING DE INTENCIÓN DE COMPRA (HOY)*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    lines + `\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💡 _Los productos en el Top 1 y Top 2 son ideales para publicar como Ofertas Flash en tus estados de WhatsApp._`;

  await callTelegram('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown'
  }, env);
}

// Comando /venta manual
async function cmdManualSale(args, chatId, env) {
  if (args.length < 3) {
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: 'Uso: `/venta [nombre_producto] [monto]`\nEjemplo: `/venta office-2021 70`',
      parse_mode: 'Markdown'
    }, env);
    return;
  }

  const prod = args.slice(1, -1).join(' ');
  const amount = Number(args[args.length - 1]);
  if (isNaN(amount) || amount <= 0) {
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: 'El monto ingresado no es válido.'
    }, env);
    return;
  }

  const time = getLimaDateTime();
  const dayKey = `day:${time.dateKey}`;
  let dayStats = await env.JNX_METRICS.get(dayKey, { type: 'json' }) || createEmptyDayStats(time.dateKey);

  dayStats.total_sales = (dayStats.total_sales || 0) + 1;
  dayStats.total_revenue_pen = (dayStats.total_revenue_pen || 0) + amount;
  dayStats.by_product[prod] = (dayStats.by_product[prod] || 0) + 1;
  await env.JNX_METRICS.put(dayKey, JSON.stringify(dayStats));

  await callTelegram('sendMessage', {
    chat_id: chatId,
    text: `✅ *Venta Manual Registrada*\n📦 *Producto:* ${prod}\n💰 *Monto:* S/ ${amount.toFixed(2)}\n🎉 Sumado a la caja de hoy.`,
    parse_mode: 'Markdown'
  }, env);
}

// Comando /visitas (Cloudflare GraphQL Analytics)
async function cmdCloudflareTraffic(chatId, env) {
  if (!env.CF_API_TOKEN || !env.CF_ZONE_ID) {
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: '⚠️ Faltan configurar los secretos `CF_API_TOKEN` o `CF_ZONE_ID` para consultar el tráfico real.'
    }, env);
    return;
  }

  try {
    const query = `
      query GetZoneAnalytics($zoneTag: string!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            httpRequests1dGroups(limit: 1, filter: { date_geq: "2026-11-01" }) {
              dimensions { date }
              sum {
                requests
                pageViews
              }
              uniq {
                uniques
              }
            }
          }
        }
      }
    `;

    const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.CF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: { zoneTag: env.CF_ZONE_ID }
      })
    });

    const data = await res.json();
    const group = data?.data?.viewer?.zones?.[0]?.httpRequests1dGroups?.[0];

    if (!group) {
      await callTelegram('sendMessage', {
        chat_id: chatId,
        text: '🌐 Cloudflare aún está recopilando datos de tráfico del día.'
      }, env);
      return;
    }

    const uniques = group.uniq.uniques;
    const pageViews = group.sum.pageViews;
    const requests = group.sum.requests;

    const text = 
      `🌐 *TRÁFICO REAL EN CLOUDFLARE (Inmune a AdBlock)*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👥 *Visitantes Únicos Reales:* \`${uniques}\`\n` +
      `📄 *Páginas Vistas:* \`${pageViews}\`\n` +
      `⚡ *Solicitudes Totales:* \`${requests}\`\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `_Datos tomados directamente desde los servidores perimetrales de Cloudflare._`;

    await callTelegram('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown'
    }, env);
  } catch (err) {
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: `Error al consultar Cloudflare Analytics: ${err.message}`
    }, env);
  }
}

/* =========================================================================
   5. REPORTE MENSUAL CONSOLIDADO (/mes) + GEMINI + QUICKCHART
========================================================================= */
async function sendMonthlyReport(env, targetChatId = null) {
  const chatId = targetChatId || env.TELEGRAM_CHAT_ID;
  if (!chatId) return;

  const time = getLimaDateTime();
  const dayStats = await env.JNX_METRICS.get(`day:${time.dateKey}`, { type: 'json' }) || createEmptyDayStats(time.dateKey);

  const leads = dayStats.total_leads || 0;
  const sales = dayStats.total_sales || 0;
  const rev = (dayStats.total_revenue_pen || 0);

  // 1. Gráfico de QuickChart (Dona de Categorías)
  const catEntries = Object.entries(dayStats.by_category || {});
  const labels = catEntries.map(e => e[0]);
  const values = catEntries.map(e => e[1]);

  let chartUrl = '';
  if (values.length > 0) {
    const chartConfig = {
      type: 'doughnut',
      data: {
        labels: labels.length ? labels : ['Sin datos'],
        datasets: [{
          data: values.length ? values : [1],
          backgroundColor: ['#2563EB', '#38BDF8', '#10B981', '#F59E0B', '#8B5CF6']
        }]
      },
      options: {
        title: { display: true, text: 'Distribución de Demanda por Categoría (JNxKeys)' },
        plugins: { legend: { position: 'bottom' } }
      }
    };
    chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&w=600&h=400&bkg=white`;
  }

  // 2. Consulta a Google Gemini 1.5 Flash para Diagnóstico Comercial
  let aiAdvice = 'Continúa fortaleciendo las ofertas flash de Office y Windows en horarios nocturnos.';
  if (env.GEMINI_API_KEY) {
    aiAdvice = await getGeminiAnalysis(dayStats, env);
  }

  const caption = 
    `🏛️ *REPORTE MENSUAL EJECUTIVO — JNxKeys*\n` +
    `📅 Período: \`${time.monthKey}\`\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 *Facturación en Caja:* \`S/ ${rev.toFixed(2)}\`\n` +
    `📦 *Ventas Totales:* \`${sales}\`\n` +
    `💬 *Interesados en WhatsApp:* \`${leads}\`\n` +
    `🎯 *Efectividad:* \`${leads > 0 ? ((sales/leads)*100).toFixed(1) : '0.0'}%\`\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🧠 *DIAGNÓSTICO ESTRATÉGICO CON GEMINI IA:*\n` +
    `${aiAdvice}\n\n` +
    `_Generado automáticamente a $0.00 de costo de operación._`;

  if (chartUrl) {
    await callTelegram('sendPhoto', {
      chat_id: chatId,
      photo: chartUrl,
      caption,
      parse_mode: 'Markdown'
    }, env);
  } else {
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: caption,
      parse_mode: 'Markdown'
    }, env);
  }
}

// Llamada a Gemini 1.5 Flash
async function getGeminiAnalysis(stats, env) {
  try {
    const prompt = 
      `Eres el asesor comercial senior de JNxKeys, tienda peruana de licencias digitales originales (Windows, Office, Antivirus, Canva, IA) y hardware corporativo.
Analiza estos datos de demanda del mes:
- Consultas a WhatsApp: ${stats.total_leads}
- Ventas cerradas: ${stats.total_sales}
- Facturación: S/ ${stats.total_revenue_pen}
- Categorías más pedidas: ${JSON.stringify(stats.by_category)}
- Productos con más clics: ${JSON.stringify(stats.by_product)}

En exactamente 3 viñetas concisas y directas:
1. Diagnóstico de la demanda real.
2. Recomendación de qué oferta flash lanzar en WhatsApp para aumentar el cierre.
3. Qué software o producto conviene priorizar en la web.
Sé sumamente accionable y enfocado en el mercado peruano.`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.4 }
      })
    });

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Demanda activa en ofimática y sistemas.';
  } catch (err) {
    return 'Mantener stock de Office 2021 y Windows 11 para atención rápida por WhatsApp.';
  }
}

/* =========================================================================
   6. CLIENTE TELEGRAM HTTP
========================================================================= */
async function callTelegram(method, body, env) {
  if (!env.TELEGRAM_BOT_TOKEN) return;
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

function escapeMarkdown(text) {
  return String(text).replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
}
