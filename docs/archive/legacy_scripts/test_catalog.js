const { getAccessToken, CONFIG } = require('./ingram_api');

async function testCatalog() {
  try {
    const token = await getAccessToken();
    console.log('✓ Token activo obtenido.');

    // En Ingram Apigee el path es /resellers/v6/...
    const pnaUrl = `https://api.ingrammicro.com:443/resellers/v6/catalog/priceandavailability`;
    console.log(`\nConsultando ${pnaUrl}...`);
    
    const pnaRes = await fetch(pnaUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'IM-CustomerNumber': CONFIG.customerNumber,
        'IM-CountryCode': CONFIG.countryCode,
        'IM-CorrelationID': 'jnx-test-' + Date.now(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        products: [
          { ingramPartNumber: "4A0036" }
        ]
      })
    });

    console.log(`Estado: ${pnaRes.status} ${pnaRes.statusText}`);
    const pnaData = await pnaRes.json();
    console.log('Respuesta Price & Availability:');
    console.log(JSON.stringify(pnaData, null, 2));

  } catch (err) {
    console.error('Error durante la prueba de catálogo:', err);
  }
}

testCatalog();
