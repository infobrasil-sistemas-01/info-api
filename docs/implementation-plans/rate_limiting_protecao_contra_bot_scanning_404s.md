# Rate Limiting — Proteção Contra Bot Scanning (404s)

## Contexto

A API está recebendo carga de bots de varredura de vulnerabilidades que enumeram rotas aleatórias (`/admin`, `/.env`, `/wp-login.php` etc.), gerando rajadas de `404 NotFoundException`. Isso:
- Polui os logs do GlitchTip/Sentry com ruído
- Consome recursos do event loop do Node.js desnecessariamente
- Pode escalar para um volume que degrade a aplicação

**Restrições:** single instance, sem Redis, sem controle do Nginx.

---

## Visão Geral da Solução

Duas camadas complementares, sem dependências externas:

```
Request → [Middleware: IpBlocklist] → NestJS Router
                                           │
                               Rota existe? Não → NotFoundException
                                                        │
                                              [AllExceptionsFilter]
                                                        │
                                          Incrementa contador 404 do IP
                                          Se threshold → bloqueia IP
```

### Camada 1 — Bloqueio por acúmulo de 404s (problema principal)
Serviço singleton em memória que rastreia 404s por IP com janela deslizante.
Quando um IP ultrapassa o threshold → é bloqueado por N minutos.
Um middleware global verifica o blocklist *antes* do roteamento, retornando `429` imediatamente para IPs bloqueados.

### Camada 2 — Throttle geral pré-autenticação (proteção secundária)
`@nestjs/throttler` com limite permissivo para não travar clientes legítimos, mas que impede flood puro de qualquer rota não autenticada.

---

## Thresholds Propostos

| Parâmetro | Valor | Raciocínio |
|---|---|---|
| Janela de contagem de 404s | 2 minutos | Janela curta captura padrão de scanner |
| Limite de 404s para bloqueio | 20 hits | Um cliente legítimo raramente erra 20 rotas seguidas |
| Duração do bloqueio | 30 minutos | Suficiente para desestimular bots sem afetar humanos com IP dinâmico |
| Throttle geral (não autenticado) | 60 req/min | ~1 req/s é mais que suficiente para chamadas pontuais |
| Throttle geral (autenticado) | 300 req/min | Headroom para clientes frequentes no futuro |

> [!IMPORTANT]
> Esses valores são **ponto de partida**. Após deploy, monitore os logs para ajustar — especialmente o limite de 300 req/min autenticado, que pode precisar subir conforme os clientes crescem.

---

## Open Questions

> [!IMPORTANT]
> **IP real com Nginx:** Como há um proxy reverso na frente, o `request.ip` do Express retorna o IP do Nginx, não do cliente. Precisamos confiar no header `X-Forwarded-For` adicionando `app.set('trust proxy', 1)` no `main.ts`. Você confirma que o Nginx está configurado para passar esse header? (É o comportamento padrão do Nginx, mas vale confirmar.)

> [!NOTE]
> **Limpeza de memória:** O `IpBlocklistService` vai ter entradas acumulando. Vamos implementar uma limpeza periódica a cada 5 minutos para remover entradas expiradas, mantendo o footprint de memória controlado. Para o volume esperado, isso é totalmente suficiente.

---

## Proposed Changes

### Nova estrutura de arquivos

```
src/common/
├── filters/
│   └── all-exceptions.filter.ts   ← MODIFY (integrar com IpBlocklistService)
├── interceptors/
│   └── logging.interceptor.ts     (sem alteração)
├── logger/
│   └── logger.service.ts          (sem alteração)
├── middleware/
│   └── ip-blocklist.middleware.ts ← NEW
└── throttle/
    └── ip-blocklist.service.ts    ← NEW
```

---

### Camada 1 — Serviço de Blocklist

#### [NEW] ip-blocklist.service.ts
`src/common/throttle/ip-blocklist.service.ts`

Serviço `@Injectable({ scope: Scope.DEFAULT })` (singleton) com:
- `record404(ip: string): void` — incrementa contador; se atingir threshold, move para blocklist com TTL
- `isBlocked(ip: string): boolean` — verifica blocklist, limpando entradas expiradas
- Limpeza periódica via `setInterval` no `onModuleInit`
- Loga no Sentry quando um IP é bloqueado (breadcrumb + `logger.warn`)

#### [NEW] ip-blocklist.middleware.ts
`src/common/middleware/ip-blocklist.middleware.ts`

`NestMiddleware` global que:
- Extrai o IP real respeitando `X-Forwarded-For` (já tratado pelo Express com `trust proxy`)
- Ignora `127.0.0.1` e `::1` (loopback) — nunca bloqueia localhost
- Se `isBlocked(ip)` → responde `429` com `Retry-After` header e body JSON padronizado
- Caso contrário → `next()`

#### [MODIFY] all-exceptions.filter.ts
Injetar `IpBlocklistService` e chamar `record404(ip)` quando `status === 404`.

---

### Camada 2 — Throttler Geral

#### [MODIFY] app.module.ts
Adicionar `ThrottlerModule.forRootAsync()` com dois limiters:
- `unauthenticated`: 60 req / 60s
- `authenticated`: 300 req / 60s

#### [MODIFY] main.ts
Adicionar `app.set('trust proxy', 1)` para IP real com Nginx.

#### Aplicação do Guard
O `ThrottlerGuard` padrão será usado globalmente via `APP_GUARD`. A lógica de "autenticado vs não autenticado" será implementada via `ThrottlerGuard` customizado que verifica presença do JWT no header antes de escolher qual limiter aplicar.

> [!NOTE]
> Rotas autenticadas que excedem o limite retornam `429`. Isso não afetará clientes normais — 300 req/min é 5 req/s, bastante folga.

---

## Verification Plan

### Testes manuais (pós-implementação)
1. Disparar 20+ requisições para `/api/v1/inexistente` em sequência → deve retornar `429` a partir do 21° hit com `Retry-After`
2. Verificar que rotas válidas autenticadas continuam funcionando normalmente
3. Verificar que o GlitchTip recebe um `warn` quando um IP é bloqueado
4. Aguardar 30 minutos e verificar que o IP bloqueado volta a funcionar

### Observação pós-deploy
- Monitorar o GlitchTip/Sentry pelos primeiros dias para ver se algum cliente legítimo está sendo bloqueado
- Ajustar threshold de 404s e duração do bloqueio conforme necessário
