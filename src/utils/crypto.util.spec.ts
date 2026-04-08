import { generateOpaqueToken, hashTokenSha256, decrypt } from './crypto.util';
import crypto from 'crypto';

describe('CryptoUtil', () => {
  describe('generateOpaqueToken', () => {
    it('should generate a base64url token with default 64 bytes', () => {
      const token = generateOpaqueToken();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('should generate a base64url token with custom bytes', () => {
      const token32 = generateOpaqueToken(32);
      const token128 = generateOpaqueToken(128);
      expect(typeof token32).toBe('string');
      expect(typeof token128).toBe('string');
      expect(token32.length).toBeGreaterThan(0);
      expect(token128.length).toBeGreaterThan(token32.length);
    });

    it('should generate unique tokens each call', () => {
      const token1 = generateOpaqueToken(32);
      const token2 = generateOpaqueToken(32);
      expect(token1).not.toBe(token2);
    });
  });

  describe('hashTokenSha256', () => {
    it('should return a hex-encoded SHA256 hash', () => {
      const token = 'test-token';
      const pepper = 'test-pepper';
      const hash = hashTokenSha256(token, pepper);
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64);
      expect(hash).toMatch(/^[a-f0-9]+$/);
    });

    it('should return same hash for same token and pepper', () => {
      const token = 'test-token';
      const pepper = 'test-pepper';
      const hash1 = hashTokenSha256(token, pepper);
      const hash2 = hashTokenSha256(token, pepper);
      expect(hash1).toBe(hash2);
    });

    it('should return different hash for different peppers', () => {
      const token = 'test-token';
      const hash1 = hashTokenSha256(token, 'pepper1');
      const hash2 = hashTokenSha256(token, 'pepper2');
      expect(hash1).not.toBe(hash2);
    });

    it('should return different hash for different tokens', () => {
      const pepper = 'test-pepper';
      const hash1 = hashTokenSha256('token1', pepper);
      const hash2 = hashTokenSha256('token2', pepper);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('decrypt', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should decrypt base64 encoded ciphertext', () => {
      const crypto = require('crypto');
      const key = Buffer.from('0123456789abcdef0123456789abcdef', 'utf8');
      const iv = Buffer.from('1234567890abcdef', 'utf8');
      const plaintext = 'Hello World';
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(plaintext, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      process.env.CRYPTO_ENC = key.toString('utf8');
      process.env.CRYPTO_IV = iv.toString('utf8');

      const result = decrypt(encrypted);
      expect(result).toBe(plaintext);
    });

    it('should return error on invalid ciphertext', () => {
      const crypto = require('crypto');
      const key = Buffer.from('0123456789abcdef0123456789abcdef', 'utf8');
      const iv = Buffer.from('1234567890abcdef', 'utf8');
      process.env.CRYPTO_ENC = key.toString('utf8');
      process.env.CRYPTO_IV = iv.toString('utf8');

      const result = decrypt('invalid-ciphertext-base64==');
      expect(result).toHaveProperty('message');
    });
  });
});
