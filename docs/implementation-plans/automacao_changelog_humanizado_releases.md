# Automação do Changelog Humanizado no Ciclo de Releases

## 1. Contexto e Motivação

O projeto conta com o script de síntese semântica de lançamentos `scripts/generate-human-changelog.ts` (`npm run changelog:human`), responsável por transformar o `CHANGELOG.md` bruto gerado pelo `commit-and-tag-version` em:
- Uma base estruturada em JSON (`docs/changelog/releases.json`) para consumo no Portal do Cliente e no Painel Administrativo.
- Um documento humanizado em Markdown em português (`docs/changelog/CHANGELOG.pt-BR.md`).

Anteriormente, essa execução dependia de acionamento manual após o processo de release, o que gerava inconsistência temporal entre as tags git e os artefatos de documentação, além de deixar a working tree suja após a publicação de uma nova versão.

---

## 2. Escopo das Alterações

### 2.1 Configuração do `commit-and-tag-version` (`.versionrc`)
- Inserir o hook de ciclo de vida `"postchangelog"`:
  - Executa `npm run changelog:human` imediatamente após a escrita do novo bloco de versão no `CHANGELOG.md` raiz.
- Atualizar o hook de ciclo de vida `"precommit"`:
  - Adicionar o diretório `docs/changelog` ao estágio de preparação do git (`git add docs/swagger swagger-spec.json docs/changelog`).
- Isso garante **atomicidade**: a documentação técnica (Swagger/OpenAPI) e a documentação humanizada (JSON + Markdown) são commitadas e taggeadas exatamente no mesmo commit assinado da release.

---

## 3. Critérios de Sucesso
- `.versionrc` devidamente atualizado com os hooks `postchangelog` e `precommit`.
- Validação da execução do script `npm run changelog:human` garantindo integridade dos artefatos em `docs/changelog/`.
