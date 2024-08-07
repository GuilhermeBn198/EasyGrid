import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { loginUser, registerUser } from "../services/authService";
import AppError from "../utils/AppError";
const router = Router();

// landing page data
// router.get('/', )

//rotas login usuario

router.post(
    "/register",
    [
        body("email").isEmail().withMessage("Email inválido"),
        body("nome").notEmpty().withMessage("Nome é obrigatório"),
        body("senha")
            .isLength({ min: 6 })
            .withMessage("Senha deve ter no mínimo 6 caracteres"),
        body("tipo")
            .isIn([1, 2])
            .withMessage("Tipo deve ser 1 (Professor) ou 2 (Coordenador)"),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError("Dados inválidos", 400));
        }

        const { email, nome, senha, tipo } = req.body;
        try {
            const user = await registerUser(email, nome, senha, tipo);
            res.status(201).json(user);
        } catch (err: any) {
            next(new AppError(err.message, 500));
        }
    }
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Email inválido"),
        body("senha").notEmpty().withMessage("Senha é obrigatória"),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError("Dados inválidos", 400));
        }

        const { email, senha } = req.body;
        try {
            const { token, user } = await loginUser(email, senha);
            res.status(200).json({ token, user });
        } catch (err: any) {
            next(err);
        }
    }
);

//rotas do usuario
// router.post('/usuario/novaConta', usuarioController.create)
// router.get('/usuario/novaConta', usuarioController.create)
// router.put('/usuario/{:id}', usuarioController.create)
// router.delete('/usuario/{:id}', usuarioController.create)

export default router;
