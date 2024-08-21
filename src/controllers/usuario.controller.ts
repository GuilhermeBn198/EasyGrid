import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { registerUser } from '../services/authService';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, nome, senha, tipo } = req.body;

        if (!req.user || req.user.tipo !== 2) {
            throw new AppError('Acesso negado. Apenas coordenadores podem criar usuários.', 403);
        }

        const { token, user } = await registerUser(email, nome, senha, tipo);
        res.status(201).json({token, user});
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
            where: { tipo: 1 || 2 }
        });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Convertendo o id para número inteiro
        const userId = parseInt(id, 10);

        // Verificar se a conversão foi bem-sucedida
        if (isNaN(userId)) {
            return next(new AppError('ID inválido', 400));
        }

        // Encontrar o usuário no banco de dados
        const user = await prisma.user.findUnique({
            where: {
                id: userId, // Passar id corretamente
            },
        });

        if (!user) {
            throw new AppError('Usuário não encontrado', 404);
        }
        console.log("Authenticated User do usuario.controller.ts:", req.user);
        console.log("User id recebido a partir de req.params do usuario.controller.ts:", id);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { nome, email, senha } = req.body;

        if (!req.user) {
            throw new AppError('Acesso negado. Apenas coordenadores podem atualizar usuários.', 403);
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { nome, email, senha },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            throw new AppError('Acesso negado. Apenas coordenadores podem deletar usuários.', 403);
        }

        await prisma.user.delete({ where: { id: Number(id) } });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
