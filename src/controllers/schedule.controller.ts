import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { PrismaClient } from '@prisma/client';
import { checkScheduleRestrictions, createSchedule } from '../services/scheduleService';


const prisma = new PrismaClient();

// Criar um novo horário
export const createNewSchedule = async (req: Request, res: Response, next: NextFunction) => {
    const { materiaId, usuarioId, dia, horario } = req.body;

    try {
        // Verifica restrições antes de criar o horário
        await checkScheduleRestrictions(materiaId, usuarioId, dia, horario);

        // Cria o novo horário
        const newSchedule = await createSchedule({ materiaId, usuarioId, dia, horario });

        res.status(201).json(newSchedule);
    } catch (err: any) {
        next(new AppError(err.message, err.statusCode || 500));
    }
};

// Buscar todos os horários
export const getAllSchedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schedules = await prisma.schedule.findMany();
        res.status(200).json(schedules);
    } catch (err: any) {
        next(new AppError('Error fetching schedules', 500));
    }
};

// Buscar horário por ID
export const getScheduleById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const schedule = await prisma.schedule.findUnique({
            where: { id: Number(id) },
        });

        if (!schedule) {
            return next(new AppError(`Schedule with ID ${id} not found`, 404));
        }

        res.status(200).json(schedule);
    } catch (err: any) {
        next(new AppError('Error fetching schedule by ID', 500));
    }
};

// Atualizar horário por ID
export const updateScheduleById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { materiaId, usuarioId, dia, horario } = req.body;

    try {
        // Verifica se o horário existe
        const existingSchedule = await prisma.schedule.findUnique({
            where: { id: Number(id) },
        });

        if (!existingSchedule) {
            return next(new AppError(`Schedule with ID ${id} not found`, 404));
        }

        // Verifica restrições antes de atualizar o horário
        await checkScheduleRestrictions(materiaId, usuarioId, dia, horario);

        // Atualiza o horário
        const updatedSchedule = await prisma.schedule.update({
            where: { id: Number(id) },
            data: { materiaId, usuarioId, dia, horario },
        });

        res.status(200).json(updatedSchedule);
    } catch (err: any) {
        next(new AppError('Error updating schedule', 500));
    }
};

// Deletar horário por ID
export const deleteScheduleById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const existingSchedule = await prisma.schedule.findUnique({
            where: { id: Number(id) },
        });

        if (!existingSchedule) {
            return next(new AppError(`Schedule with ID ${id} not found`, 404));
        }

        await prisma.schedule.delete({
            where: { id: Number(id) },
        });

        res.status(204).send();
    } catch (err: any) {
        next(new AppError('Error deleting schedule', 500));
    }
};