/**
 * Conector Oficial de API Ingram Micro XVANTAGE para JNxKeys
 * Soporta autenticación OAuth 2.0 y consulta de catálogo/precios.
 */

const fs = require('fs');
const path = require('path');

// Cargar variables de entorno desde .env si existe (sin dependencias externas)
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const CONFIG = {
  customerNumber: process.env.INGRAM_CUSTOMER_NUMBER || '430032',
  countryCode: process.env.INGRAM_COUNTRY_CODE || 'PE',
  environment: process.env.INGRAM_ENVIRONMENT || 'sandbox',
  authUrl: 'https://api.ingrammicro.com:443/oauth/oauth30/token',
  sandboxBaseUrl: 'https://api.ingrammicro.com:443/sandbox',
  prodBaseUrl: 'https://api.ingrammicro.com:443',
};

function getCredentials() {
  const isProd = CONFIG.environment === 'production';
  return {
    clientId: isProd ? process.env.INGRAM_PROD_CLIENT_ID : process.env.INGRAM_SANDBOX_CLIENT_ID,
    clientSecret: isProd ? process.env.INGRAM_PROD_CLIENT_SECRET : process.env.INGRAM_SANDBOX_CLIENT_SECRET,
  };
}

/**
 * Obtiene el Token de acceso OAuth2 Bearer
 */
async function getAccessToken() {
  const { clientId, clientSecret } = getCredentials();

  if (!clientId || !clientSecret || clientId.startsWith('pega_')) {
    throw new Error('Faltan credenciales de Ingram Micro. Configura tu archivo .env con el Client ID y Client Secret.');
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(CONFIG.authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Error en autenticación con Ingram Micro (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Consulta precios y disponibilidad de productos por SKU / VPN
 */
async function checkPriceAndAvailability(productsList = []) {
  const token = await getAccessToken();
  const isProd = CONFIG.environment === 'production';
  const baseUrl = isProd ? CONFIG.prodBaseUrl : CONFIG.sandboxBaseUrl;
  const endpoint = `${baseUrl}/resellers/v6/catalog/priceandavailability`;

  const correlationId = 'jnx-' + Date.now();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'IM-CustomerNumber': CONFIG.customerNumber,
      'IM-CountryCode': CONFIG.countryCode,
      'IM-CorrelationID': correlationId,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      products: productsList,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Error al consultar catálogo de Ingram (${response.status}): ${errText}`);
  }

  return await response.json();
}

// Ejecución directa de prueba desde terminal
if (require.main === module) {
  (async () => {
    console.log('='.repeat(60));
    console.log('Probando Conexión con Ingram Micro XVANTAGE API...');
    console.log(`Entorno: ${CONFIG.environment.toUpperCase()}`);
    console.log(`Customer Number: ${CONFIG.customerNumber} | País: ${CONFIG.countryCode}`);
    console.log('='.repeat(60));

    try {
      console.log('1. Solicitando Token OAuth 2.0...');
      const token = await getAccessToken();
      console.log('✓ Token obtenido exitosamente: ' + token.substring(0, 15) + '...');
      console.log('✓ Conexión con Ingram Micro establecida correctamente.');
    } catch (err) {
      console.error('✗ Fallo en la prueba de conexión:');
      console.error(err.message);
      console.log('\nPara solucionarlo:');
      console.log('1. Copia el archivo .env.example a .env');
      console.log('2. Pega tu Client ID y Client Secret obtenidos en el portal de desarrollador.');
    }
  })();
}

module.exports = {
  getAccessToken,
  checkPriceAndAvailability,
  CONFIG,
};
