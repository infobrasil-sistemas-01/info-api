import * as fs from 'fs';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Converter = require('openapi-to-postmanv2');

const args = process.argv.slice(2);
const swaggerFileArg = args.find((arg) => arg.startsWith('--swaggerFile='));

let swaggerPath = '';
if (swaggerFileArg) {
  swaggerPath = path.resolve(process.cwd(), swaggerFileArg.split('=')[1]);
} else {
  const docsDir = path.join(process.cwd(), 'docs', 'swagger');
  if (fs.existsSync(docsDir)) {
    const files = fs
      .readdirSync(docsDir)
      .filter((f) => f.startsWith('swagger-') && f.endsWith('.json'));
    if (files.length > 0) {
      files.sort((a, b) =>
        b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }),
      );
      swaggerPath = path.join(docsDir, files[0]);
    } else {
      swaggerPath = path.join(process.cwd(), 'swagger-spec.json');
    }
  } else {
    swaggerPath = path.join(process.cwd(), 'swagger-spec.json');
  }
}

if (!fs.existsSync(swaggerPath)) {
  console.error(`❌ Arquivo OpenAPI spec não encontrado em: ${swaggerPath}`);
  console.log('💡 Dica: Execute primeiro `npm run swagger:generate` para gerar a spec.');
  process.exit(1);
}

console.log(`📦 Carregando especificação OpenAPI de: ${swaggerPath}`);
const swaggerContent = fs.readFileSync(swaggerPath, 'utf8');
const swaggerJson = JSON.parse(swaggerContent);

// Fixa o servidor na URL de produção conforme requisito
swaggerJson.servers = [
  {
    url: 'https://info-api.infobrasilsistemas.com.br',
    description: 'Servidor de Produção Oficial',
  },
];

const conversionOptions = {
  folderStrategy: 'Tags',
  requestParametersResolution: 'Example',
  exampleParametersResolution: 'Example',
  includeAuthInfoInExample: true,
  enableOptionalParameters: false,
  optimizeConversion: true,
  stackLimit: 50,
};

Converter.convert(
  { type: 'json', data: swaggerJson },
  conversionOptions,
  (err: any, conversionResult: any) => {
    if (err) {
      console.error('❌ Erro na conversão para Postman Collection:', err);
      process.exit(1);
    }

    if (!conversionResult.result) {
      console.error(
        '❌ Falha ao converter OpenAPI para Postman:',
        conversionResult.reason,
      );
      process.exit(1);
    }

    const collection = conversionResult.output[0].data;

    // Customizações DX na Collection gerada
    collection.info.name = 'InfoBrasil API - Postman Collection (Oficial)';
    collection.info.description =
      'Coleção oficial da InfoAPI para testes e integrações com o ecossistema InfoBrasil ERP. Produzida para ambiente de produção.';

    // Configuração de Variáveis de Coleção (baseUrl e tokens)
    collection.variable = collection.variable || [];
    
    // Atualizar ou inserir baseUrl
    const baseUrlIndex = collection.variable.findIndex((v: any) => v.key === 'baseUrl');
    const baseUrlVar = {
      key: 'baseUrl',
      value: 'https://info-api.infobrasilsistemas.com.br',
      type: 'string',
    };
    if (baseUrlIndex >= 0) {
      collection.variable[baseUrlIndex] = baseUrlVar;
    } else {
      collection.variable.push(baseUrlVar);
    }

    // Variáveis de Autenticação
    if (!collection.variable.some((v: any) => v.key === 'bearerToken')) {
      collection.variable.push({
        key: 'bearerToken',
        value: '',
        type: 'string',
      });
    }
    if (!collection.variable.some((v: any) => v.key === 'username')) {
      collection.variable.push({
        key: 'username',
        value: '',
        type: 'string',
      });
    }
    if (!collection.variable.some((v: any) => v.key === 'password')) {
      collection.variable.push({
        key: 'password',
        value: '',
        type: 'string',
      });
    }

    // Configurar autenticação padrão da Collection para Bearer Token
    collection.auth = {
      type: 'bearer',
      bearer: [
        {
          key: 'token',
          value: '{{bearerToken}}',
          type: 'string',
        },
      ],
    };

    // Percorrer os itens e injetar script de teste no Login para extrair o access_token
    function processItems(items: any[]) {
      if (!items || !Array.isArray(items)) return;

      for (const item of items) {
        if (item.request) {
          const urlRaw = typeof item.request.url === 'string' 
            ? item.request.url 
            : item.request.url?.raw || '';

          const isLogin =
            item.name?.toLowerCase().includes('login') ||
            urlRaw.includes('/auth/login') ||
            (Array.isArray(item.request.url?.path) &&
              item.request.url.path.includes('login'));

          if (isLogin) {
            console.log(`🔑 Injetando script de extração automática de JWT no item: "${item.name}"`);
            item.event = item.event || [];
            item.event.push({
              listen: 'test',
              script: {
                type: 'text/javascript',
                exec: [
                  'if (pm.response.code === 200 || pm.response.code === 201) {',
                  '    var jsonData = pm.response.json();',
                  '    if (jsonData && jsonData.access_token) {',
                  "        pm.collectionVariables.set('bearerToken', jsonData.access_token);",
                  "        console.log('✅ Token JWT salvo automaticamente na variável {{bearerToken}}!');",
                  '    }',
                  '}',
                ],
              },
            });

            // Configurar Basic Auth para o Login
            item.request.auth = {
              type: 'basic',
              basic: [
                {
                  key: 'username',
                  value: '{{username}}',
                  type: 'string',
                },
                {
                  key: 'password',
                  value: '{{password}}',
                  type: 'string',
                },
              ],
            };
          }
        }

        if (item.item) {
          processItems(item.item);
        }
      }
    }

    processItems(collection.item);

    // Salvar destinos
    const docsDir = path.join(process.cwd(), 'docs', 'swagger');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    const targetFile = path.join(docsDir, 'infoapi-postman-collection.json');
    fs.writeFileSync(targetFile, JSON.stringify(collection, null, 2), 'utf8');

    // Salvar também na raiz para fácil consumo
    const rootTargetFile = path.join(process.cwd(), 'infoapi-postman-collection.json');
    fs.writeFileSync(rootTargetFile, JSON.stringify(collection, null, 2), 'utf8');

    console.log(`✅ Postman Collection gerada com sucesso em:`);
    console.log(`   - ${targetFile}`);
    console.log(`   - ${rootTargetFile}`);
  },
);

