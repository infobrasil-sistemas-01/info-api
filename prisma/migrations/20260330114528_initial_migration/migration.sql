-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "user" VARCHAR(78) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "db_credentials_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "db_credentials" (
    "id" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "database" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "db_id" INTEGER NOT NULL,

    CONSTRAINT "db_credentials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_db_credentials_id_fkey" FOREIGN KEY ("db_credentials_id") REFERENCES "db_credentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
