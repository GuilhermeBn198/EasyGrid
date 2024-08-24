import { Request, Response, NextFunction } from "express";
import prisma from "../prismaClient";
import AppError from "../utils/AppError";

export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nome, semestreId, professorIds } = req.body;

        const subject = await prisma.subject.create({
            data: {
                nome,
                semestre: { connect: { id: semestreId } },
                professores: professorIds ? { connect: professorIds.map((id: number) => ({ id })) } : undefined,
            },
        });

        res.status(201).json(subject);
    } catch (error) {
        next(new AppError("Erro ao criar matéria", 400));
    }
};

export const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subjects = await prisma.subject.findMany({
            include: {
                semestre: true,
                professores: true || false || undefined, //testar depois apenas true ou false, ou apenas true.
                horarios: true,
            },
        });

        res.status(200).json(subjects);
    } catch (error) {
        next(new AppError("Erro ao buscar matérias", 400));
    }
};

export const getSubjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const subject = await prisma.subject.findUnique({
            where: { id: Number(id) },
            include: {
                semestre: true,
                professores: true || false || undefined, //testar depois apenas true ou false, ou apenas true.
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

export const updateSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { nome, semestreId, professorIds } = req.body;

        const subject = await prisma.subject.update({
            where: { id: Number(id) },
            data: {
                nome,
                semestre: { connect: { id: semestreId } },
                professores: professorIds ? { set: professorIds.map((id: number) => ({ id })) } : undefined,
            },
        });

        res.status(200).json(subject);
    } catch (error) {
        next(new AppError("Erro ao atualizar matéria", 400));
    }
};

export const deleteSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.subject.delete({
            where: { id: Number(id) },
        });

        res.status(204).send();
    } catch (error) {
        next(new AppError("Erro ao deletar matéria", 400));
    }
};
