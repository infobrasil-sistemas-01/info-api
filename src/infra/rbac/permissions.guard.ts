// src/infra/rbac/permissions.guard.ts

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSIONS_META_KEY } from './permissions.decorator';
import type { PermissionsRequirement } from './permissions.types';
import { RbacContextService } from './rbac-context.service';

import type { JwtPayload } from 'src/modules/auth/types/jwt-payload';

type ReqWithUser = {
  user?: JwtPayload;
  log?: any;
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly ctx: RbacContextService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement =
      this.reflector.get<PermissionsRequirement>(
        PERMISSIONS_META_KEY,
        context.getHandler(),
      ) ??
      this.reflector.get<PermissionsRequirement>(
        PERMISSIONS_META_KEY,
        context.getClass(),
      );

    // rota sem requirement => liberado
    if (!requirement) return true;

    const req = context.switchToHttp().getRequest<ReqWithUser>();
    const payload = req.user;

    if (!payload?.sub) {
      throw new UnauthorizedException('Unauthorized');
    }

    const userId = payload.sub;

    const snap = await this.ctx.getOrResolve(userId);

    // opcional: enriquecer log
    if (req.log) {
      req.log = req.log.child({
        userId,
        roles: snap.roles,
      });
    }

    const ok = this.evaluate(requirement, snap.allowedKeys);

    if (!ok) {
      throw new ForbiddenException('Você não possui permissão para executar esta ação. Entre em contato com o time técnico da InfoBrasil.');
    }

    return true;
  }

  private evaluate(req: PermissionsRequirement, allowed: Set<string>): boolean {
    const anyOf = req.anyOf?.filter(Boolean) ?? [];
    const allOf = req.allOf?.filter(Boolean) ?? [];

    // allOf: precisa ter todas
    for (const p of allOf) {
      if (!allowed.has(p)) return false;
    }

    // anyOf: precisa ter pelo menos uma
    if (anyOf.length > 0) {
      for (const p of anyOf) {
        if (allowed.has(p)) return true;
      }
      return false;
    }

    return true;
  }
}
