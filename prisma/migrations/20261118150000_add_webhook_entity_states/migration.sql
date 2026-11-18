-- CreateTable
CREATE TABLE "webhook_entity_states" (
    "id" TEXT NOT NULL,
    "tenant_id" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" VARCHAR(100) NOT NULL,
    "state_hash" VARCHAR(64) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_entity_states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webhook_entity_states_tenant_id_entity_type_entity_id_key" ON "webhook_entity_states"("tenant_id", "entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "webhook_entity_states_tenant_id_entity_type_idx" ON "webhook_entity_states"("tenant_id", "entity_type");
