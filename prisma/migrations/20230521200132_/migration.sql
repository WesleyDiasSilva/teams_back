-- CreateTable
CREATE TABLE "remember_codes" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "remember_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "remember_codes_token_key" ON "remember_codes"("token");

-- CreateIndex
CREATE UNIQUE INDEX "remember_codes_user_id_key" ON "remember_codes"("user_id");

-- AddForeignKey
ALTER TABLE "remember_codes" ADD CONSTRAINT "remember_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
