/**
 * Extrai o IP real do cliente a partir dos cabeçalhos de proxy e socket.
 *
 * Ordem de prioridade:
 * 1. CF-Connecting-IP (Cloudflare)
 * 2. X-Real-IP (Nginx / Gateway)
 * 3. X-Forwarded-For (primeiro IP da cadeia quando há múltiplos proxies)
 * 4. req.ip (resolvido pelo Express)
 * 5. req.socket.remoteAddress
 */
export function extractClientIp(req: any): string {
  if (!req) return 'unknown';

  const headers = req.headers || {};

  // 1. Cloudflare
  const cfConnectingIp =
    headers['cf-connecting-ip'] ?? headers['CF-Connecting-IP'];
  if (cfConnectingIp && typeof cfConnectingIp === 'string') {
    const trimmed = cfConnectingIp.trim();
    if (trimmed) return trimmed;
  }

  // 2. Nginx X-Real-IP
  const xRealIp = headers['x-real-ip'] ?? headers['X-Real-IP'];
  if (xRealIp && typeof xRealIp === 'string') {
    const trimmed = xRealIp.trim();
    if (trimmed) return trimmed;
  }

  // 3. X-Forwarded-For (pega o primeiro IP da lista de saltos)
  const xForwardedFor =
    headers['x-forwarded-for'] ?? headers['X-Forwarded-For'];
  if (xForwardedFor) {
    const raw = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
    if (typeof raw === 'string') {
      const firstIp = raw.split(',')[0].trim();
      if (firstIp) return firstIp;
    }
  }

  // 4. req.ip (quando trust proxy resolve)
  if (typeof req.ip === 'string' && req.ip.trim()) {
    return req.ip.trim();
  }

  // 5. Socket direto
  if (
    req.socket?.remoteAddress &&
    typeof req.socket.remoteAddress === 'string'
  ) {
    return req.socket.remoteAddress.trim();
  }

  return 'unknown';
}
