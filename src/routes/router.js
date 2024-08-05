import { Router } from "express";
import usuarioController from "../controllers/usuario.controller.js";

const router = Router();

// landing page data
// router.get('/', )


//rotas login usuario
// router.post('/login', usuarioController.create)
// router.post('/signup', usuarioController.create)

//rotas do usuario
router.post('/usuario/novaConta', usuarioController.create)
// router.get('/usuario/novaConta', usuarioController.create)
// router.put('/usuario/{:id}', usuarioController.create)
// router.delete('/usuario/{:id}', usuarioController.create)

export default router