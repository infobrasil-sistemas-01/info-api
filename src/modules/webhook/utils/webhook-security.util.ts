import { BadRequestException } from '@nestjs/common';
import * as dns from 'dns';
import * as net from 'net';

/**
 * Verifica se um endereço IPv4 está em faixas privadas, de loopback ou reservadas (RFC 1918, RFC 3927, etc.)
 */
export function isPrivateOrReservedIpv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Formato inválido considera-se inseguro
  }

  const [b0, b1] = parts;

  // 0.0.0.0/8 (Current network)
  if (b0 === 0) return true;

  // 10.0.0.0/8 (Private network RFC 1918)
  if (b0 === 10) return true;

  // 127.0.0.0/8 (Loopback)
  if (b0 === 127) return true;

  // 100.64.0.0/10 (Shared Address Space / CGNAT RFC 6598)
  if (b0 === 100 && b1 >= 64 && b1 <= 127) return true;

  // 169.254.0.0/16 (Link-local RFC 3927)
  if (b0 === 169 && b1 === 254) return true;

  // 172.16.0.0/12 (Private network RFC 1918)
  if (b0 === 172 && b1 >= 16 && b1 <= 31) return true;

  // 192.0.0.0/24 (IETF Protocol Assignments RFC 6890)
  if (b0 === 192 && b1 === 0 && parts[2] === 0) return true;

  // 192.168.0.0/16 (Private network RFC 1918)
  if (b0 === 192 && b1 === 168) return true;

  // 198.18.0.0/15 (Benchmarking RFC 2544)
  if (b0 === 198 && (b1 === 18 || b1 === 19)) return true;

  // 224.0.0.0/4 (Multicast RFC 5771)
  if (b0 >= 224 && b0 <= 239) return true;

  // 240.0.0.0/4 (Reserved RFC 1112)
  if (b0 >= 240) return true;

  return false;
}

/**
 * Verifica se um endereço IPv6 é privado, de loopback ou reservado
 */
export function isPrivateOrReservedIpv6(ip: string): boolean {
  const normalized = ip.toLowerCase().trim();

  // ::1 (Loopback) ou :: (Unspecified)
  if (normalized === '::1' || normalized === '::') return true;

  // IPv4-mapped IPv6 (::ffff:192.168.1.1)
  if (normalized.startsWith('::ffff:')) {
    const ipv4Part = normalized.replace('::ffff:', '');
    if (net.isIPv4(ipv4Part)) {
      return isPrivateOrReservedIpv4(ipv4Part);
    }
    return true;
  }

  // fc00::/7 (Unique Local Address RFC 4193)
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;

  // fe80::/10 (Link-Local unicast RFC 4291)
  if (
    normalized.startsWith('fe8') ||
    normalized.startsWith('fe9') ||
    normalized.startsWith('fea') ||
    normalized.startsWith('feb')
  ) {
    return true;
  }

  return false;
}

export function isPrivateOrReservedIp(ip: string): boolean {
  const version = net.isIP(ip);
  if (version === 4) return isPrivateOrReservedIpv4(ip);
  if (version === 6) return isPrivateOrReservedIpv6(ip);
  return true; // Se não for IP reconhecido, bloqueia
}

/**
 * Validação sintática preliminar da URL
 */
export function validateWebhookUrlSyntax(urlStr: string): { valid: boolean; reason?: string } {
  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    return { valid: false, reason: 'URL inválida ou malformatada.' };
  }

  // 1. Protocolo: deve ser HTTPS (ou HTTP em ambiente estrito de desenvolvimento)
  const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  if (parsed.protocol !== 'https:' && (!isDev || parsed.protocol !== 'http:')) {
    return { valid: false, reason: 'A URL de Webhook deve utilizar obrigatoriamente o protocolo HTTPS.' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 2. Não pode ser IP literal (IPv4 ou IPv6)
  if (net.isIP(hostname) !== 0) {
    return { valid: false, reason: 'A URL de Webhook não pode ser um endereço IP literal. Utilize um domínio/FQDN válido.' };
  }

  // 3. Não pode ser localhost ou domínios locais
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan')
  ) {
    return { valid: false, reason: 'A URL de Webhook não pode apontar para localhost ou domínios de rede interna (.local, .internal).' };
  }

  // 4. Não pode pertencer ao domínio raiz da InfoBrasil
  if (
    hostname === 'infobrasil.com.br' ||
    hostname.endsWith('.infobrasil.com.br') ||
    hostname === 'infobrasil.net.br' ||
    hostname.endsWith('.infobrasil.net.br')
  ) {
    return { valid: false, reason: 'A URL de Webhook não pode pertencer ao domínio raiz da InfoBrasil.' };
  }

  return { valid: true };
}

/**
 * Validação de segurança anti-SSRF com resolução de DNS
 */
export async function assertPublicWebhookUrl(urlStr: string): Promise<void> {
  const syntaxCheck = validateWebhookUrlSyntax(urlStr);
  if (!syntaxCheck.valid) {
    throw new BadRequestException(syntaxCheck.reason);
  }

  const parsed = new URL(urlStr);
  const hostname = parsed.hostname;

  // Realiza a resolução de DNS para todos os IPs associados
  try {
    const lookupResults = await dns.promises.lookup(hostname, { all: true });

    if (!lookupResults || lookupResults.length === 0) {
      throw new BadRequestException(`Não foi possível resolver o domínio informado: ${hostname}`);
    }

    for (const record of lookupResults) {
      if (isPrivateOrReservedIp(record.address)) {
        throw new BadRequestException(
          `A URL de Webhook resolve para um endereço de rede privada/reservada (${record.address}). Bloqueado por política anti-SSRF.`,
        );
      }
    }
  } catch (err: any) {
    if (err instanceof BadRequestException) throw err;
    throw new BadRequestException(
      `Falha na resolução de DNS para ${hostname}: ${err.message}`,
    );
  }
}
