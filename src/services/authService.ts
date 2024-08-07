import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();
const JWT_SECRET = 'your_secret_key'; // Troque por uma chave secreta mais segura

export const registerUser = async (email: string, nome: string, senha: string, tipo: number) => {
  const hashedPassword = await bcrypt.hash(senha, 10);
  const user = await prisma.user.create({
    data: {
      email,
      nome,
      senha: hashedPassword,
      tipo,
    },
  });
  return user;
};

export const loginUser = async (email: string, senha: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(senha, user.senha))) {
    throw new AppError('Email ou senha inválidos', 401);
  }

  const token = jwt.sign({ userId: user.id, tipo: user.tipo }, JWT_SECRET, { expiresIn: '1h' });
  return { token, user };
};
