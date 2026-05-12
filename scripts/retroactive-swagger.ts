import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

async function retroactive() {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  if (!fs.existsSync(changelogPath)) {
    console.error('❌ CHANGELOG.md não encontrado.');
    process.exit(1);
  }

  const changelog = fs.readFileSync(changelogPath, 'utf8');
  // Regex para encontrar versões no formato ## [1.3.0] ou ## 0.0.2
  const versionRegex = /## \[?(\d+\.\d+\.\d+)\]?/g;
  let match;
  const versions: string[] = [];

  while ((match = versionRegex.exec(changelog)) !== null) {
    versions.push(match[1]);
  }

  if (versions.length === 0) {
    console.warn('⚠️ Nenhuma versão encontrada no CHANGELOG.md.');
    process.exit(0);
  }

  // Remover duplicatas e ordenar (opcional)
  const uniqueVersions = Array.from(new Set(versions));

  console.log(`🔍 Encontradas ${uniqueVersions.length} versões no changelog: ${uniqueVersions.join(', ')}`);

  // Primeiro, vamos gerar a spec atual para usar como base
  console.log('📦 Gerando spec atual como base para histórico...');
  try {
    // Usamos ts-node para rodar o script de geração com tsconfig-paths para resolver caminhos absolutos
    execSync('npx ts-node --transpile-only -r tsconfig-paths/register scripts/generate-swagger.ts', { stdio: 'inherit' });
  } catch (e) {
    console.error('❌ Falha ao gerar spec base.');
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  const currentVersion = packageJson.version;
  const sourcePath = path.join(process.cwd(), 'docs', 'swagger', `swagger-${currentVersion}.json`);

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Arquivo base ${sourcePath} não encontrado.`);
    process.exit(1);
  }

  for (const version of uniqueVersions) {
    if (version === currentVersion) continue;
    
    const targetPath = path.join(process.cwd(), 'docs', 'swagger', `swagger-${version}.json`);
    if (!fs.existsSync(targetPath)) {
      // Faz uma cópia da spec atual para a versão antiga e ajusta o campo version no JSON
      const spec = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
      if (spec.info) {
        spec.info.version = version;
      }
      fs.writeFileSync(targetPath, JSON.stringify(spec, null, 2));
      console.log(`✅ Criada spec retroativa: v${version}`);
    } else {
      console.log(`⏩ Versão v${version} já existe, pulando.`);
    }
  }

  console.log('✨ Processo retroativo concluído com sucesso!');
}

retroactive().catch(err => {
  console.error('❌ Erro no script retroativo:', err);
  process.exit(1);
});
