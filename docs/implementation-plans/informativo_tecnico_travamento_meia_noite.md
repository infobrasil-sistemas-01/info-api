# Informativo Técnico: Diagnóstico e Mitigação do Travamento Noturno da API

**Autor:** Gabriel Camurça Bezerra - Desenvolvedor FullStack  
**Data:** 06 de Setembro de 2026  

---

Olá, equipe,

Gostaria de formalizar o diagnóstico e a resolução de um incidente recorrente que estávamos enfrentando em nosso ambiente de produção, caracterizado pelo travamento total da API e retornos constantes de `504 Gateway Timeout` pontualmente à meia-noite.

Ao longo desta investigação, mapeei a raiz do problema, apliquei uma contenção emergencial para estancar o "sangramento" do sistema e tracei a rota definitiva para a próxima janela de manutenção. Abaixo, detalho as descobertas.

## 1. O Diagnóstico

Nos últimos dias, observei que a API parava de processar requisições exatamente após as `00:00:00 BRT` (Horário de Brasília), exigindo intervenção manual no dia seguinte para voltar a operar. 

Durante minha análise de processos em background, encontrei a causa: em Maio deste ano, implementei um *Cron Job* no `status.service.ts` (`EVERY_DAY_AT_3AM`) responsável por realizar uma limpeza (`deleteMany`) de logs antigos no nosso banco de dados. 

Acontece que o nosso contêiner Docker (`node:22-alpine`) roda sob o fuso horário padrão **UTC**. Portanto, as `03:00 AM UTC` coincidem com exatidão com a nossa **meia-noite (00:00 BRT)**. 

Com o crescimento da base de dados ao longo dos últimos 4 meses, essa operação maciça de deleção passou a gerar uma contenção de conexões (*locks*) no motor do PostgreSQL/Prisma. Esse gargalo paralisava a thread principal do Node.js (o *Event Loop*), impedindo a aplicação de responder a novas requisições e a mantendo em um estado de "congelamento silencioso" (*silent freeze*). Pior: como o Docker não derruba proativamente contêineres que falham no *healthcheck*, a API não reiniciava sozinha.

## 2. A Ação de Mitigação Imediata

Para garantir que a nossa operação não caia novamente durante a madrugada enquanto refatoramos a estrutura, apliquei uma **medida emergencial imediata**:

- **Desativação do Cron:** Comentei e desativei a rotina `cleanup` no código-fonte da aplicação. Dessa forma, eliminamos instantaneamente o gatilho que travava o banco e a API.
- **Auto-Healing de Contêineres:** Implementei uma camada de resiliência extra no `docker-compose.yml` utilizando o serviço `willfarrell/autoheal`. A partir do próximo deploy, qualquer contêiner da nossa malha que reportar lentidão extrema ou travamento (falhando seguidamente no healthcheck) será detectado e reiniciado automaticamente pelo Docker em até 30 segundos, sem a necessidade de intervenção humana.

## 3. Próximos Passos (Correção Definitiva)

Com a estabilidade noturna assegurada, listei os seguintes itens de melhoria que pretendo abordar nas próximas *sprints* para sanar o débito técnico:

1. **Limpeza em Lotes (Batching):** Vou refatorar a rotina de limpeza do banco. Em vez de utilizar um único comando `deleteMany` agressivo, a exclusão ocorrerá de forma particionada (ex: `LIMIT 500`) com pequenas pausas iterativas, evitando *locks* no banco.
2. **Normalização do Fuso Horário:** Adicionarei a variável `TZ=America/Sao_Paulo` nos contêineres de infraestrutura, garantindo que cronogramas futuros rodem de fato de madrugada no Brasil, fora do pico transacional.

Sigo à disposição caso alguém tenha dúvidas sobre as medidas tomadas ou deseje aprofundar-se nos detalhes arquiteturais.

Atenciosamente,

**Gabriel Camurça Bezerra**  
Desenvolvedor FullStack
