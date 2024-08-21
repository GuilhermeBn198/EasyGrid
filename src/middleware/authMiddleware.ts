import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";

const JWT_SECRET = "your_secret_key"; // Troque por uma chave secreta mais segura

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("Token não fornecido ou malformado", 401));
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return next(new AppError("Token inválido ou expirado", 403));
        }
        req.user = user as any; // Remova o "as any" após configurar corretamente os tipos do usuário
        console.log("Authenticated User do authMiddleware.ts:", req.user);
        next();
    });
};
