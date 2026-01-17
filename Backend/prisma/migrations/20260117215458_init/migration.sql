-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_movieId_fkey";

-- AlterTable
ALTER TABLE "post" ALTER COLUMN "movieId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
