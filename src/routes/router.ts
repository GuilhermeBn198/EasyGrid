import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { loginUser, registerUser } from "../services/authService";
import AppError from "../utils/AppError";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware";
import * as semesterController from "../controllers/semester.controller";
import * as userController from "../controllers/usuario.controller";
import * as subjectController from "../controllers/subject.controller";
import * as scheduleController from "../controllers/schedule.controller";

const router = Router();

//////////////////////////////////////////////////// Rotas de autenticação

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

//////////////////////////////////////////////////// Rotas teste de middleware

router.get("/protected", authenticateToken, (req: Request, res: Response) => {
    //verificação do middleware
    res.status(200).json({ message: "Acesso concedido", user: req.user });
});

////////////////////////////////////////////////////  Rotas CRUD para Semesters(protegidas)

router.post(
    "/semester",
    authenticateToken,
    authorizeRole(2), // Somente Coordenadores podem criar
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
router.patch(
    "/semester/:id",
    authenticateToken,
    authorizeRole(2), // Somente Coordenadores podem criar
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
    authorizeRole(2), // Somente Coordenadores podem criar
    semesterController.deleteSemester
);

/////////////////////////////////////////////////// Rotas CRUD para criação de usuarios(protegidas) por coordenadores

router.post(
    "/usuario",
    authenticateToken,
    authorizeRole(2), // Somente Coordenadores podem criar
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
    userController.createUser
);

router.get("/usuario", authenticateToken, userController.getUsers);
router.get("/usuario/:id", authenticateToken, userController.getUserById);
router.patch("/usuario/:id", authenticateToken, userController.updateUser);
router.delete(
    "/usuario/:id",
    authenticateToken,
    authorizeRole(2), // Somente Coordenadores podem criar
    userController.deleteUser
);

export default router;

////////////////////////////////////////////////////  Rotas CRUD para matérias(protegidas)

router.post(
    "/subject",
    authenticateToken,
    authorizeRole(2), // Somente Coordenadores podem criar
    [
        body("nome").notEmpty().withMessage("Nome é obrigatório"),
        body("semestreId")
            .isInt()
            .withMessage("ID do semestre deve ser um número inteiro"),
        body("professorIds")
            .optional()
            .isArray()
            .withMessage(
                "Os IDs dos professores devem ser um array de números inteiros"
            ),
        body("professorIds.*")
            .isInt()
            .withMessage("Cada ID de professor deve ser um número inteiro"),
    ],
    subjectController.createSubject
);
router.get("/subject", authenticateToken, subjectController.getSubjects);
router.get("/subject/:id", authenticateToken, subjectController.getSubjectById);
router.patch(
    "/subject/:id",
    authenticateToken,
    authorizeRole(2), // Somente Coordenadores podem editar
    [
        body("nome").notEmpty().withMessage("Nome é obrigatório"),
        body("semestreId")
            .isInt()
            .withMessage("ID do semestre deve ser um número inteiro"),
        body("professorIds")
            .optional()
            .isArray()
            .withMessage(
                "Os IDs dos professores devem ser um array de números inteiros"
            ),
        body("professorIds.*")
            .isInt()
            .withMessage("Cada ID de professor deve ser um número inteiro"),
    ],
    subjectController.updateSubject
);
router.delete(
    "/subject/:id",
    authenticateToken,
    authorizeRole(2), // Somente Coordenadores podem deletar
    subjectController.deleteSubject
);


/////////////////////////////////////////// Rotas CRUD para Schedules


router.post(
    "/schedules",
    authenticateToken,
    authorizeRole(2), // Somente Coordenadores podem editar
    scheduleController.createNewSchedule
);
router.get("/schedules", scheduleController.getAllSchedules);
router.get("/schedules/:id", scheduleController.getScheduleById);
router.patch(
    "/schedules/:id",
    authenticateToken,
    authorizeRole(2), // Somente Coordenadores podem editar
    scheduleController.updateScheduleById
);
router.delete(
    "/schedules/:id",
    authenticateToken,
    authorizeRole(2), // Somente Coordenadores podem editar
    scheduleController.deleteScheduleById
);
