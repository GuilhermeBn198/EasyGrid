import { Router } from "express";
import usuarioController from "../controllers/usuario.controller.ts";
import { body, validationResult } from "express-validator";
import { loginUser, registerUser } from "../services/authService.ts";

const router = Router();

// landing page data
// router.get('/', )


//rotas login usuario
router.post('/register', 
    [
      body('email').isEmail(),
      body('nome').notEmpty(),
      body('senha').isLength({ min: 6 }),
      body('tipo').isIn([1, 2]), // 1 para Professor, 2 para Coordenador
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, nome, senha, tipo } = req.body;
      try {
        const user = await registerUser(email, nome, senha, tipo);
        res.status(201).json(user);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );
  
  router.post('/login', 
    [
      body('email').isEmail(),
      body('senha').notEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, senha } = req.body;
      try {
        const { token, user } = await loginUser(email, senha);
        res.status(200).json({ token, user });
      } catch (err) {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    }
  );

//rotas do usuario
router.post('/usuario/novaConta', usuarioController.create)
// router.get('/usuario/novaConta', usuarioController.create)
// router.put('/usuario/{:id}', usuarioController.create)
// router.delete('/usuario/{:id}', usuarioController.create)

export default router