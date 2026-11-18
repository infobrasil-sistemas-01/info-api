-- AlterTable
ALTER TABLE "webhook_subscriptions" ALTER COLUMN "last_order_id" SET DATA TYPE BIGINT;
ALTER TABLE "webhook_subscriptions" ALTER COLUMN "last_product_id" SET DATA TYPE BIGINT;
ALTER TABLE "webhook_subscriptions" ALTER COLUMN "last_delivery_id" SET DATA TYPE BIGINT;
ALTER TABLE "webhook_subscriptions" ALTER COLUMN "last_account_payable_id" SET DATA TYPE BIGINT;
ALTER TABLE "webhook_subscriptions" ALTER COLUMN "last_account_receivable_id" SET DATA TYPE BIGINT;
