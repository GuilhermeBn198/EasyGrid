import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createSemester = async (req: Request, res: Response, next: NextFunction) => {
  const { nome, prioridade } = req.body;

  try {
    const semester = await prisma.semester.create({
      data: { nome, prioridade },
    });
    // console.log(semester.nome+"criacao semestre");
    res.status(201).json(semester);
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};

export const getSemesters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const semesters = await prisma.semester.findMany();
    // console.log([semesters]+"todos os ids")
    res.status(200).json(semesters);
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};

export const getSemesterById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const semester = await prisma.semester.findUnique({ where: { id: Number(id) } });
    if (!semester) {
      return next(new AppError('Semester not found', 404));
    }
    // console.log(semester.nome+"id unico ok");
    
    res.status(200).json(semester);
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};

export const updateSemester = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { nome, prioridade } = req.body;

  try {
    const semester = await prisma.semester.update({
      where: { id: Number(id) },
      data: { nome, prioridade },
    });
    res.status(200).json(semester);
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};

export const deleteSemester = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await prisma.semester.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};