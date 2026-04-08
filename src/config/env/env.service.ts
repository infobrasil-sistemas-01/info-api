import { Injectable } from '@nestjs/common';
import { Env, envSchema } from './env.schema';

@Injectable()
export class EnvService {
  private readonly env: Env;

  constructor() {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
      console.error('❌ Invalid environment variables');
      console.error(parsed.error.format());
      throw new Error('Invalid environment variables');
    }

    this.env = parsed.data;
  }

  get<T extends keyof Env>(key: T): Env[T] {
    return this.env[key];
  }

  getAll(): Env {
    return this.env;
  }

  // =========================
  // Helpers (não quebram nada)
  // =========================

  /**
   * Retorna string obrigatória (trim aplicada). Se vier vazia, lança erro.
   */
  getString<T extends keyof Env>(key: T): string {
    const v = this.env[key] as unknown;
    if (typeof v !== 'string') {
      throw new Error(
        `EnvService: ${String(key)} expected string, got ${typeof v}`,
      );
    }
    const trimmed = v.trim();
    if (!trimmed) {
      throw new Error(`EnvService: ${String(key)} is empty`);
    }
    return trimmed;
  }

  /**
   * Retorna string opcional (trim aplicada). Se vazio/undefined/null => undefined.
   */
  getOptionalString<T extends keyof Env>(key: T): string | undefined {
    const v = this.env[key] as unknown;
    if (v == null) return undefined;
    if (typeof v !== 'string') {
      throw new Error(
        `EnvService: ${String(key)} expected string, got ${typeof v}`,
      );
    }
    const trimmed = v.trim();
    return trimmed ? trimmed : undefined;
  }

  /**
   * Retorna inteiro. Se a sua schema já tipa como number, ok.
   * Se vier como string (em algum schema), tenta parse.
   */
  getInt<T extends keyof Env>(key: T): number {
    const v = this.env[key] as unknown;

    if (typeof v === 'number' && Number.isFinite(v)) return Math.trunc(v);

    if (typeof v === 'string') {
      const n = Number.parseInt(v.trim(), 10);
      if (Number.isFinite(n)) return n;
    }

    throw new Error(`EnvService: ${String(key)} expected int, got ${typeof v}`);
  }

  /**
   * Retorna boolean. Se schema tipa boolean, ok.
   * Se vier string ("true"/"false"/"1"/"0"), converte.
   */
  getBool<T extends keyof Env>(key: T, defaultValue?: boolean): boolean {
    const v = this.env[key] as unknown;

    if (typeof v === 'boolean') return v;

    if (typeof v === 'string') {
      const s = v.trim().toLowerCase();
      if (s === 'true' || s === '1' || s === 'yes') return true;
      if (s === 'false' || s === '0' || s === 'no') return false;
      if (!s && defaultValue !== undefined) return defaultValue;
    }

    if ((v == null || v === '') && defaultValue !== undefined)
      return defaultValue;

    throw new Error(
      `EnvService: ${String(key)} expected bool, got ${typeof v}`,
    );
  }

  /**
   * Retorna string com default (útil pra chaves opcionais).
   */
  getStringOr<T extends keyof Env>(key: T, fallback: string): string {
    const opt = this.getOptionalString(key);
    return opt ?? fallback;
  }

  /**
   * Retorna uma env string por nome dinâmico.
   * Útil para cenários em que a key é montada em runtime
   * (ex.: REGISTRY_ENC_KEY_<KEY_ID>).
   */
  getDynamicString(name: string): string {
    const record = this.env as Record<string, unknown>;
    const value = record[name];

    if (typeof value !== 'string') {
      throw new Error(
        `EnvService: ${name} expected string, got ${typeof value}`,
      );
    }

    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error(`EnvService: ${name} is empty`);
    }

    return trimmed;
  }

  /**
   * Indica se o ambiente é production.
   */
  get isProduction(): boolean {
    return this.env.NODE_ENV === 'production';
  }

  /**
   * Ambiente é development.
   */
  get isDevelopment(): boolean {
    return this.env.NODE_ENV === 'development';
  }

  /**
   * Ambiente é test.
   */
  get isTest(): boolean {
    return this.env.NODE_ENV === 'test';
  }
}
