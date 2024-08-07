/*
  Warnings:

  - You are about to drop the column `coordenador` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Dia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Horario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Materia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Semestre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DiaToHorario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nome]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nome` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Horario" DROP CONSTRAINT "Horario_userId_fkey";

-- DropForeignKey
ALTER TABLE "Materia" DROP CONSTRAINT "Materia_professor_fkey";

-- DropForeignKey
ALTER TABLE "Materia" DROP CONSTRAINT "Materia_semestre_fkey";

-- DropForeignKey
ALTER TABLE "_DiaToHorario" DROP CONSTRAINT "_DiaToHorario_A_fkey";

-- DropForeignKey
ALTER TABLE "_DiaToHorario" DROP CONSTRAINT "_DiaToHorario_B_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "coordenador",
DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "tipo" INTEGER NOT NULL,
ALTER COLUMN "senha" DROP DEFAULT;

-- DropTable
DROP TABLE "Dia";

-- DropTable
DROP TABLE "Horario";

-- DropTable
DROP TABLE "Materia";

-- DropTable
DROP TABLE "Semestre";

-- DropTable
DROP TABLE "_DiaToHorario";

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "semestreId" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "materiaId" INTEGER,
    "usuarioId" INTEGER,
    "dia" INTEGER NOT NULL,
    "horario" INTEGER NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semester" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "prioridade" INTEGER NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserSubjects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserSubjects_AB_unique" ON "_UserSubjects"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSubjects_B_index" ON "_UserSubjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_nome_key" ON "User"("nome");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_semestreId_fkey" FOREIGN KEY ("semestreId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSubjects" ADD CONSTRAINT "_UserSubjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSubjects" ADD CONSTRAINT "_UserSubjects_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
