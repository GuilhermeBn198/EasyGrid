-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" INTEGER NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "semestreId" INTEGER NOT NULL,
    "professorId" INTEGER,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "materiaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_materiaId_dia_horario_key" ON "Schedule"("materiaId", "dia", "horario");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_usuarioId_dia_horario_key" ON "Schedule"("usuarioId", "dia", "horario");

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_semestreId_fkey" FOREIGN KEY ("semestreId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
