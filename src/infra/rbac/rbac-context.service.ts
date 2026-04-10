// src/infra/rbac/rbac-context.service.ts

import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

import { PermissionResolver } from './permission-resolver.service';
import type {
  PermissionSnapshot,
  ResolvePermissionsOptions,
} from './permissions.types';

type ReqWithCache = Request & {
  __permCache?: Map<string, PermissionSnapshot>;
};

@Injectable({ scope: Scope.REQUEST })
export class RbacContextService {
  constructor(
    @Inject(REQUEST) private readonly req: ReqWithCache,
    private readonly resolver: PermissionResolver,
  ) {}

  async getOrResolve(
    userId: number,
    options: ResolvePermissionsOptions = {},
  ): Promise<PermissionSnapshot> {
    if (!this.req.__permCache) {
      this.req.__permCache = new Map();
    }

    const key = `${userId}:bypass=${options.bypassCache ? 1 : 0}`;

    const hit = this.req.__permCache.get(key);
    if (hit) return hit;

    const snap = await this.resolver.resolve(userId);
    this.req.__permCache.set(key, snap);

    return snap;
  }
}
