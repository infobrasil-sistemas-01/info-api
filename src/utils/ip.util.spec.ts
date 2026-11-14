import { extractClientIp } from './ip.util';

describe('extractClientIp', () => {
  it('should return CF-Connecting-IP as highest priority', () => {
    const req = {
      headers: {
        'cf-connecting-ip': '203.0.113.195',
        'x-real-ip': '192.168.243.6',
        'x-forwarded-for': '198.51.100.1, 192.168.243.6',
      },
      ip: '192.168.243.6',
    };
    expect(extractClientIp(req)).toBe('203.0.113.195');
  });

  it('should return X-Real-IP when CF-Connecting-IP is absent', () => {
    const req = {
      headers: {
        'x-real-ip': '177.136.240.10',
        'x-forwarded-for': '177.136.240.10, 192.168.243.6',
      },
      ip: '192.168.243.6',
    };
    expect(extractClientIp(req)).toBe('177.136.240.10');
  });

  it('should return first IP from X-Forwarded-For list when X-Real-IP is absent', () => {
    const req = {
      headers: {
        'x-forwarded-for': '201.86.10.5, 172.18.0.2, 192.168.243.6',
      },
      ip: '192.168.243.6',
    };
    expect(extractClientIp(req)).toBe('201.86.10.5');
  });

  it('should fallback to req.ip when proxy headers are absent', () => {
    const req = {
      headers: {},
      ip: '189.40.20.1',
    };
    expect(extractClientIp(req)).toBe('189.40.20.1');
  });

  it('should fallback to socket.remoteAddress when req.ip is absent', () => {
    const req = {
      headers: {},
      socket: { remoteAddress: '192.0.2.1' },
    };
    expect(extractClientIp(req)).toBe('192.0.2.1');
  });

  it('should return unknown when request is null or empty', () => {
    expect(extractClientIp(null)).toBe('unknown');
    expect(extractClientIp({})).toBe('unknown');
  });
});
