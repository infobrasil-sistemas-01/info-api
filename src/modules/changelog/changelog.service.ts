import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface HumanReleaseItem {
  module: string;
  type: 'feature' | 'fix' | 'security' | 'improvement';
  title: string;
  description: string;
  impact: string;
  originalCommit?: string;
  commitHash?: string;
}

export interface HumanRelease {
  version: string;
  date: string;
  title: string;
  summary: string;
  highlights: string[];
  items: HumanReleaseItem[];
  totalChanges: number;
}

export interface ChangelogStats {
  totalVersions: number;
  currentVersion: string;
  lastReleaseDate: string;
  totalFeatures: number;
  totalFixes: number;
  totalSecurities: number;
}

@Injectable()
export class ChangelogService {
  private readonly logger = new Logger(ChangelogService.name);
  private cachedReleases: HumanRelease[] | null = null;
  private lastCacheTime = 0;
  private readonly CACHE_TTL_MS = 60 * 1000; // 1 minuto em produção

  private getReleasesFilePath(): string {
    const devPath = path.join(
      process.cwd(),
      'docs',
      'changelog',
      'releases.json',
    );
    if (fs.existsSync(devPath)) {
      return devPath;
    }
    const altPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'docs',
      'changelog',
      'releases.json',
    );
    if (fs.existsSync(altPath)) {
      return altPath;
    }
    return devPath;
  }

  public getAllReleases(): HumanRelease[] {
    const now = Date.now();
    if (this.cachedReleases && now - this.lastCacheTime < this.CACHE_TTL_MS) {
      return this.cachedReleases;
    }

    try {
      const filePath = this.getReleasesFilePath();
      if (!fs.existsSync(filePath)) {
        this.logger.warn(
          `Arquivo de releases humanizadas não encontrado em: ${filePath}`,
        );
        return [];
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const releases: HumanRelease[] = JSON.parse(content);

      // Ordenar por SemVer decrescente
      releases.sort((a, b) =>
        b.version.localeCompare(a.version, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      );

      this.cachedReleases = releases;
      this.lastCacheTime = now;
      return releases;
    } catch (err: any) {
      this.logger.error(
        `Erro ao carregar releases humanizadas: ${err.message}`,
        err.stack,
      );
      return [];
    }
  }

  public getReleaseByVersion(version: string): HumanRelease | null {
    const normalized = version.replace(/^v/i, '');
    const releases = this.getAllReleases();
    return releases.find((r) => r.version === normalized) || null;
  }

  public getStats(): ChangelogStats {
    const releases = this.getAllReleases();
    let totalFeatures = 0;
    let totalFixes = 0;
    let totalSecurities = 0;

    for (const rel of releases) {
      for (const item of rel.items) {
        if (item.type === 'feature') totalFeatures++;
        else if (item.type === 'fix') totalFixes++;
        else if (item.type === 'security') totalSecurities++;
      }
    }

    const currentVersion = releases.length > 0 ? releases[0].version : '1.0.0';
    const lastReleaseDate = releases.length > 0 ? releases[0].date : '';

    return {
      totalVersions: releases.length,
      currentVersion,
      lastReleaseDate,
      totalFeatures,
      totalFixes,
      totalSecurities,
    };
  }
}
