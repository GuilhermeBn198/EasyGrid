-- CreateTable
CREATE TABLE "Semestre" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "prioridade" INTEGER NOT NULL,

    CONSTRAINT "Semestre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "semestre" INTEGER NOT NULL,
    "atribuido" BOOLEAN NOT NULL DEFAULT false,
    "professor" INTEGER NOT NULL,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dia" (
    "id" SERIAL NOT NULL,
    "dia" TEXT NOT NULL,

    CONSTRAINT "Dia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" SERIAL NOT NULL,
    "hora" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL DEFAULT 'dcc1234',
    "name" TEXT NOT NULL,
    "coordenador" TEXT NOT NULL DEFAULT 'N',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DiaToHorario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Horario_userId_key" ON "Horario"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_DiaToHorario_AB_unique" ON "_DiaToHorario"("A", "B");

-- CreateIndex
CREATE INDEX "_DiaToHorario_B_index" ON "_DiaToHorario"("B");

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_semestre_fkey" FOREIGN KEY ("semestre") REFERENCES "Semestre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_professor_fkey" FOREIGN KEY ("professor") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiaToHorario" ADD CONSTRAINT "_DiaToHorario_A_fkey" FOREIGN KEY ("A") REFERENCES "Dia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiaToHorario" ADD CONSTRAINT "_DiaToHorario_B_fkey" FOREIGN KEY ("B") REFERENCES "Horario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
