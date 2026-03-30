import { createHmac, randomBytes } from 'crypto';

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
