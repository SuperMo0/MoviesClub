/*
  Warnings:

  - Made the column `movieId` on table `post` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_movieId_fkey";

-- AlterTable
ALTER TABLE "comment" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "genre" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "movie" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "rating" INTEGER,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "movieId" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
