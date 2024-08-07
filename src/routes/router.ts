import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { loginUser, registerUser } from "../services/authService";
import AppError from "../utils/AppError";
import { authenticateToken } from "../middleware/authMiddleware";
import * as semesterController from "../controllers/semester.controller";
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
            const { token, user } = await registerUser(
                email,
                nome,
                senha,
                tipo
            );
            res.status(201).json({ token, user });
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

// rotas protegidas pelo middleware de autenticação
router.get("/protected", authenticateToken, (req: Request, res: Response) => {
    //verificação do middleware
    res.status(200).json({ message: "Acesso concedido", user: req.user });
});

router.post(
    "/semester",
    authenticateToken,
    [
        body("nome").notEmpty().withMessage("Nome é obrigatório"),
        body("prioridade")
            .isInt()
            .withMessage("Prioridade deve ser um número inteiro"),
    ],
    semesterController.createSemester
);
router.get("/semester", authenticateToken, semesterController.getSemesters);
router.get(
    "/semester/:id",
    authenticateToken,
    semesterController.getSemesterById
);
router.put(
    "/semester/:id",
    authenticateToken,
    [
        body("nome").notEmpty().withMessage("Nome é obrigatório"),
        body("prioridade")
            .isInt()
            .withMessage("Prioridade deve ser um número inteiro"),
    ],
    semesterController.updateSemester
);
router.delete(
    "/semester/:id",
    authenticateToken,
    semesterController.deleteSemester
);

//rotas do usuario
// router.post('/usuario/novaConta', usuarioController.create)
// router.get('/usuario/novaConta', usuarioController.create)
// router.put('/usuario/{:id}', usuarioController.create)
// router.delete('/usuario/{:id}', usuarioController.create)

export default router;
