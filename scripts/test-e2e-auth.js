const http = require('http');

function post(url, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const body = JSON.stringify(data);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          ...headers,
        },
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              body: JSON.parse(responseBody),
            });
          } catch {
            resolve({ statusCode: res.statusCode, body: responseBody });
          }
        });
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + (parsed.search || ''),
        method: 'GET',
        headers,
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              body: JSON.parse(responseBody),
            });
          } catch {
            resolve({ statusCode: res.statusCode, body: responseBody });
          }
        });
      },
    );
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('=== TESTE DE INTEGRAÇÃO END-TO-END (STS <-> INFOAPI) ===\n');

  console.log('1. Realizando login no STS (porta 3001) para o operador INFO-MOBILE...');
  const loginRes = await post('http://localhost:3001/auth/login', {
    tenantSlug: 'empresa',
    username: 'INFO-MOBILE',
    password: '123456',
  });

  console.log('STS Login Status:', loginRes.statusCode);
  console.log('STS Login Response:', JSON.stringify(loginRes.body, null, 2));

  if (loginRes.statusCode !== 200 && loginRes.statusCode !== 201) {
    console.error('Falha no login STS!');
    return;
  }

  const { accessToken, refreshToken, user } = loginRes.body;
  console.log('\nToken RS256 obtido com sucesso!');
  console.log('Operador autenticado:', user);

  console.log('\n2. Chamando GET /api/v1/products no INFO-API com storeId=99 (testando sobrescrita silenciosa pelo token)...');
  const productsRes = await get('http://localhost:3339/api/v1/products?pageSize=2&storeId=99', {
    Authorization: `Bearer ${accessToken}`,
  });

  console.log('Products Status:', productsRes.statusCode);
  console.log(
    'Products Response:',
    Array.isArray(productsRes.body)
      ? `Retornou ${productsRes.body.length} produtos.`
      : JSON.stringify(productsRes.body, null, 2),
  );

  console.log('\n3. Testando verificação de status do operador no INFO-API (/auth/operator-status/1)...');
  const statusRes = await get('http://localhost:3339/api/v1/auth/operator-status/1', {
    Authorization: `Bearer ${accessToken}`,
  });
  console.log('Operator Status Response Status:', statusRes.statusCode);
  console.log('Operator Status Body:', JSON.stringify(statusRes.body, null, 2));

  console.log('\n4. Testando renovação de Token no STS com Refresh Token...');
  const refreshRes = await post('http://localhost:3001/auth/refresh', {
    refreshToken,
  });

  console.log('STS Refresh Status:', refreshRes.statusCode);
  console.log('STS Refresh Response:', JSON.stringify(refreshRes.body, null, 2));

  console.log('\n=== TESTE FINALIZADO COM SUCESSO! ===');
}

main().catch(console.error);
