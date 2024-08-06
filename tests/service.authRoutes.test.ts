import supertest from 'supertest';
import app from '../src/server'; // Certifique-se que o caminho para o servidor está correto

describe('Auth Routes', () => {
  describe('POST /auth/register', () => {
    it('Pass 201: O usuário deve ser registrado', async () => {
      const bodyRequest = {
        email: 'test@example.com',
        nome: 'Test User',
        senha: 'password123',
        tipo: 1, // 1 para Professor
      };
      const res = await supertest(app)
        .post('/auth/register')
        .send(bodyRequest);
      const { status, body } = res;
      try {
        expect(status).toBe(201);
        expect(body).toHaveProperty('id');
        expect(body.email).toBe(bodyRequest.email);
      } catch (error) {
        const details = { details: body };
        throw new Error(`${error.message} \n  ${JSON.stringify(details, null, 2)}`);
      }
    });

    it('Error 400: Todos os campos devem ser obrigatórios', async () => {
      const bodyRequest = {
        email: '',
        nome: '',
        senha: '',
        tipo: null,
      };
      const res = await supertest(app)
        .post('/auth/register')
        .send(bodyRequest);
      const { status, body } = res;
      try {
        expect(status).toBe(400);
        expect(body).toHaveProperty('errors');
      } catch (error) {
        const details = { details: body };
        throw new Error(`${error.message} \n  ${JSON.stringify(details, null, 2)}`);
      }
    });
  });

  describe('POST /auth/login', () => {
    it('Pass 200: O usuário deve ser autenticado', async () => {
      // Primeiro, registre um usuário para garantir que existe
      const registerRequest = {
        email: 'login@example.com',
        nome: 'Login User',
        senha: 'password123',
        tipo: 1, // 1 para Professor
      };
      await supertest(app)
        .post('/auth/register')
        .send(registerRequest);

      const loginRequest = {
        email: 'login@example.com',
        senha: 'password123',
      };
      const res = await supertest(app)
        .post('/auth/login')
        .send(loginRequest);
      const { status, body } = res;
      try {
        expect(status).toBe(200);
        expect(body).toHaveProperty('token');
        expect(body.user.email).toBe(loginRequest.email);
      } catch (error) {
        const details = { details: body };
        throw new Error(`${error.message} \n  ${JSON.stringify(details, null, 2)}`);
      }
    });

    it('Error 401: Email ou senha inválidos', async () => {
      const loginRequest = {
        email: 'invalid@example.com',
        senha: 'invalidpassword',
      };
      const res = await supertest(app)
        .post('/auth/login')
        .send(loginRequest);
      const { status, body } = res;
      try {
        expect(status).toBe(401);
        expect(body).toHaveProperty('error');
        expect(body.error).toBe('Invalid email or password');
      } catch (error) {
        const details = { details: body };
        throw new Error(`${error.message} \n  ${JSON.stringify(details, null, 2)}`);
      }
    });
  });
});
