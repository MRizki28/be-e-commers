-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_user_key" ON "Profile"("id_user");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
