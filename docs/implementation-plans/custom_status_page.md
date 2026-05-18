# Plano de Implementação: Custom Status Page

Implementar uma página de status interna (`/status`) com monitoramento automático a cada 60 segundos, persistência de histórico e visual premium.

## 1. Banco de Dados (Prisma)
- [ ] Adicionar modelo `StatusLog` no `schema.prisma`.
- [ ] Rodar migration: `npx prisma migrate dev --name create_status_logs`.

## 2. Backend (`StatusModule`)
- [ ] Criar `src/modules/status`.
- [ ] Implementar `StatusService`:
    - Método `checkStatus()`: Verifica conexão com o DB e mede latência.
    - Cron Job (`@Interval(60000)`): Executa o check e salva no banco.
    - Método `getHistory()`: Retorna os logs das últimas 24h/7dias formatados para o gráfico.
- [ ] Implementar `StatusController`:
    - `GET /api/v1/status/data`: Retorna o JSON com o histórico.
    - `GET /status`: Retorna o HTML da página (ou usar `serve-static`).

## 3. Frontend (Status Page UI)
- [ ] Criar `src/modules/status/templates/status.html`.
- [ ] Design:
    - **Aesthetics**: Dark mode, Glassmorphism.
    - **Componentes**:
        - Status atual (Big Badge).
        - Gráfico de uptime (last 24 hours/30 days).
        - Lista de incidentes recentes (se houver logs de "DOWN").
        - Tempo de resposta (latency) médio.

## 4. Integração
- [ ] Registrar `StatusModule` no `AppModule`.
- [ ] Configurar `@nestjs/schedule` no `AppModule`.
- [ ] Atualizar o link de status no `swagger.ts` para apontar para a nossa nova página interna.

## Verificação
- [ ] Simular um "DOWN" (ex: desativando banco localmente) e verificar se o log é gerado.
- [ ] Validar o tempo de resposta exibido na página.
