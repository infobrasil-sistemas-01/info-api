import { Injectable } from '@nestjs/common';
import { RegistryPrismaService } from '../prisma/registry-prisma.service';
import { FirebirdService } from '../firebird/firebird.service';

@Injectable()
export class TenantConnectionService {
  private cache = new Map();

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly firebirdService: FirebirdService,
  ) {}

  async getConnection(credentialsId: string) {
    if (this.cache.has(credentialsId)) {
      return this.cache.get(credentialsId);
    }

    const credentials = await this.prisma.dbCredentials.findUnique({
      where: { id: credentialsId },
    });

    if (!credentials) {
      throw new Error(`Credentials not found for id: ${credentialsId}`);
    }

    if (!credentials.host || !credentials.database || !credentials.user || !credentials.port) {
      throw new Error(`Credentials for id: ${credentialsId} are missing required fields`);
    }

    const connection = await this.firebirdService.getDatabaseConnection({
      host: credentials.host,
      database: credentials.database,
      user: credentials.user,
      id: credentials?.dbId,
      port: credentials.port,
      pageSize: 4096,
    });

    this.cache.set(credentialsId, connection);

    return connection;
  }
}
