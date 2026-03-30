import { createHmac, randomBytes } from 'crypto';
import crypto from 'crypto';

export function generateOpaqueToken(bytes = 64): string {
  return randomBytes(bytes).toString('base64url');
}

/**
 * Recomendado: HMAC-SHA256(token) usando pepper como chave.
 * - pepper nunca vai para o banco
 * - banco armazena apenas o hash
 */
export function hashTokenSha256(token: string, pepper: string): string {
  return createHmac('sha256', pepper).update(token).digest('hex');
}

export const decrypt = (text: any) => {
  try {
    let decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      process.env.CRYPTO_ENC as string,
      process.env.CRYPTO_IV as string,
    );
    let decrypted = decipher.update(text, 'base64', 'utf8');
    return decrypted + decipher.final('utf8');
  } catch (error) {
    return error;
  }
};
