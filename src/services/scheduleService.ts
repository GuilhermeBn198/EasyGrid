import AppError from '../utils/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// Função para verificar as restrições antes de criar um horário
export async function checkScheduleRestrictions(materiaId: number, usuarioId: number, dia: number, horario: number) {
    // Obtenha o semestre relacionado à matéria
    const materia = await prisma.materia.findUnique({
        where: { id: materiaId },
        select: { semestreId: true },
    });

    if (!materia) {
        throw new AppError('Matéria não encontrada', 404);
    }

    // Verifica sobreposição de horários para matérias no mesmo semestre
    const conflictingMateria = await prisma.schedule.findFirst({
        where: {
            materia: { semestreId: materia.semestreId }, 
            dia, 
            horario,
        },
    });
    if (conflictingMateria) {
        throw new AppError('Cannot overlap schedules for the same semester', 400);
    }

    // Verifica sobreposição de horários para o mesmo professor
    const conflictingProfessor = await prisma.schedule.findFirst({
        where: { usuarioId, dia, horario },
    });
    if (conflictingProfessor) {
        throw new AppError('Professor cannot have overlapping schedules', 400);
    }

    // Verifica se a matéria está sendo alocada em mais de 4 horários
    const schedulesForSubject = await prisma.schedule.findMany({
        where: { materiaId },
    });
    if (schedulesForSubject.length >= 4) {
        throw new AppError('A subject cannot be assigned to more than 4 different time slots', 400);
    }

    // Verifica se os horários são consecutivos
    const lastScheduledHour = schedulesForSubject
        .filter(s => s.dia === dia)
        .map(s => s.horario)
        .sort((a, b) => a - b);

    if (lastScheduledHour.length > 0 && Math.abs(lastScheduledHour[lastScheduledHour.length - 1] - horario) !== 1) {
        throw new AppError('Subjects must be assigned in 2 consecutive hours', 400);
    }

    // Verifica se os horários são após as 16h
    if (horario > 4) {
        throw new AppError('Subjects cannot be assigned to time slots after 16h', 400);
    }

    // Verifica se a alocação é nas sextas ou sábados
    if (dia === 6 || dia === 7) {
        throw new AppError('Subjects cannot be assigned on Fridays or Saturdays', 400);
    }
}

// Função para criar um novo horário no banco de dados
export async function createSchedule(data: { materiaId: number, usuarioId: number, dia: number, horario: number }) {
    try {
        const newSchedule = await prisma.schedule.create({
            data,
        });
        return newSchedule;
    } catch (err: any) {
        throw new AppError(err.message || 'Error creating schedule', 500);
    }
}
