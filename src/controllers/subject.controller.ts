import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import AppError from "../utils/AppError";

const prisma = new PrismaClient();

export const createSubject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { nome, semestreId, professorId } = req.body; // Note que mudamos para singular

        // Verificar se o semestre existe
        const semestre = await prisma.semester.findUnique({
            where: { id: semestreId },
        });

        if (!semestre) {
            return next(
                new AppError(
                    "Semestre não encontrado ao tentar criar uma materia",
                    400
                )
            );
        }

        const subject = await prisma.materia.create({
            data: {
                nome,
                semestre: { connect: { id: semestreId } },
                professor: professorId
                    ? { connect: { id: professorId } }
                    : undefined,
            },
        });

        res.status(201).json(subject);
    } catch (error) {
        next(new AppError("Erro ao criar matéria", 400));
    }
};

export const getSubjects = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const subjects = await prisma.materia.findMany({
            include: {
                semestre: true,
                professor: true || false || undefined, //testar depois apenas true ou false, ou apenas true.
                horarios: true,
            },
        });

        res.status(200).json(subjects);
    } catch (error) {
        next(new AppError("Erro ao buscar matérias", 400));
    }
};

export const getSubjectById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const subject = await prisma.materia.findUnique({
            where: { id: Number(id) },
            include: {
                semestre: true,
                professor: true || false || undefined, //testar depois apenas true ou false, ou apenas true.
                horarios: true,
            },
        });

        if (!subject) {
            return next(new AppError("Matéria não encontrada", 404));
        }

        res.status(200).json(subject);
    } catch (error) {
        next(new AppError("Erro ao buscar matéria", 400));
    }
};

export const updateSubject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { nome, semestreId, professorId } = req.body; // Note que mudamos para singular

        const subject = await prisma.materia.update({
            where: { id: Number(id) },
            data: {
                nome,
                semestre: { connect: { id: semestreId } },
                professor: professorId
                    ? { connect: { id: professorId } }
                    : { disconnect: true },
            },
        });

        res.status(200).json(subject);
    } catch (error) {
        next(new AppError("Erro ao atualizar matéria", 400));
    }
};

export const deleteSubject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        await prisma.materia.delete({
            where: { id: Number(id) },
        });

        res.status(204).send();
    } catch (error) {
        next(new AppError("Erro ao deletar matéria", 400));
    }
};
