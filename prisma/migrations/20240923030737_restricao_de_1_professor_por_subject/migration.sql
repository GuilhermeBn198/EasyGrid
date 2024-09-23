/*
  Warnings:

  - You are about to drop the `_UserSubjects` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[materiaId,dia,horario]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuarioId,dia,horario]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - Made the column `materiaId` on table `Schedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuarioId` on table `Schedule` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_materiaId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "_UserSubjects" DROP CONSTRAINT "_UserSubjects_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserSubjects" DROP CONSTRAINT "_UserSubjects_B_fkey";

-- AlterTable
ALTER TABLE "Schedule" ALTER COLUMN "materiaId" SET NOT NULL,
ALTER COLUMN "usuarioId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "professorId" INTEGER;

-- DropTable
DROP TABLE "_UserSubjects";

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_materiaId_dia_horario_key" ON "Schedule"("materiaId", "dia", "horario");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_usuarioId_dia_horario_key" ON "Schedule"("usuarioId", "dia", "horario");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
