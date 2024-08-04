import { Router } from "express";
import usuarioController from "../controllers/usuario.controller.js";

const router = Router();

//rotas do usuario

router.post('/usuario/novaConta', usuarioController.create)

export default router