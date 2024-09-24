import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { PrismaClient } from '@prisma/client';
import { checkScheduleRestrictions, createSchedule } from '../services/scheduleService';


const prisma = new PrismaClient();


// Função de criação de schedule
export const createNewSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { materiaId, usuarioId, dia, horario } = req.body;

        // Validação de campos obrigatórios
        if (!materiaId) {
            return res.status(400).json({ message: "materiaId is required" });
        }
        if (!usuarioId) {
            return res.status(400).json({ message: "usuarioId is required" });
        }
        if (!dia || dia < 1 || dia > 5) {
            return res.status(400).json({ message: "Invalid 'dia', must be between 1 and 5" });
        }
        if (!horario || horario < 1 || horario > 4) {
            return res.status(400).json({ message: "Invalid 'horario', must be between 1 and 4" });
        }

        // Supondo que você tenha uma função de serviço para criar o schedule
        const newSchedule = await createSchedule({
            materiaId,
            usuarioId,
            dia,
            horario,
        });

        return res.status(201).json(newSchedule);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
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