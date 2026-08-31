import 'dotenv/config';
import { encrypt } from '../src/utils/crypto.util';

const args = process.argv.slice(2);
const plainPassword = args[0];

if (!plainPassword) {
  console.error('❌ Uso: npm run encrypt <senha_em_texto_puro>');
  console.error('Exemplo: npm run encrypt masterkey');
  process.exit(1);
}

if (!process.env.CRYPTO_ENC || !process.env.CRYPTO_IV) {
  console.error('❌ Variáveis CRYPTO_ENC ou CRYPTO_IV não encontradas no .env!');
  process.exit(1);
}

try {
  const encrypted = encrypt(plainPassword);
  console.log('\n🔒 Senha encriptada com sucesso:');
  console.log(`\x1b[32m${encrypted}\x1b[0m\n`);
  console.log('Copie e cole no seu .env como:');
  console.log(`PXXX="${encrypted}"\n`);
} catch (error: any) {
  console.error('❌ Erro ao encriptar:', error.message);
  process.exit(1);
}
