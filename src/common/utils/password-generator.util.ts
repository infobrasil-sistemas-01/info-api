import { randomInt } from 'crypto';

/**
 * Utilitário para gerar senhas seguras conforme lógica original em Python.
 * Conjunto de caracteres: letras, números e símbolos (!@#$%^&*)
 */
export function generateApiPassword(length = 32): string {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const symbols = '!@#$%^&*';

  const alphabet = letters + digits + symbols;
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = randomInt(0, alphabet.length);
    password += alphabet.charAt(randomIndex);
  }

  return password;
}
