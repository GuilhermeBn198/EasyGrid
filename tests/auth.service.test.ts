import supertest from "supertest";
import app from "../src/server";

describe("Auth Routes", () => {
    describe("POST /register", () => {
        it("Pass 201: O usuário deve ser registrado", async () => {
            const bodyRequest = {
                email: `test${Date.now()}@test.com`,
                nome: "Test User",
                senha: "password",
                tipo: 1,
            };
            const res = await supertest(app)
                .post("/api/register")
                .send(bodyRequest);

            const { status } = res;
            const bodyResponse = res.body;

            try {
                expect(status).toBe(201);
                expect(bodyResponse).toHaveProperty("token");
                expect(bodyResponse).toHaveProperty("user");
                expect(bodyResponse.user).toHaveProperty("id");
            } catch (error: any) {
                const details = { details: bodyResponse };
                throw new Error(
                    `${error.message} \n  ${JSON.stringify(details, null, 2)}`
                );
            }
        });

        it("Erro 400: Todos os campos devem ser obrigatórios", async () => {
            const bodyRequest = {
                email: "",
                nome: "",
                senha: "",
                tipo: 2,
            };
            const res = await supertest(app)
                .post("/api/register")
                .send(bodyRequest);
            const { body, status } = res;
            try {
                expect(status).toBe(400);
                expect(body).toHaveProperty("status");
                expect(body.status).toBe("error");
                expect(body).toHaveProperty("statusCode");
                expect(body.statusCode).toBe(400);
                expect(body).toHaveProperty("message");
            } catch (error: any) {
                const details = { details: body };
                throw new Error(`${JSON.stringify(details, null, 2)}`);
            }
        });
    });

    describe("POST /login", () => {
        // it("Pass 200: O usuário deve ser autenticado com sucesso", async () => {
        //     const bodyRequest = { 
        //         email: "bguilherme51@gmail.com",
        //         senha: "OOOOay198!@#",
        //     };
        //     const res = await supertest(app) //requisição apenas com usuarios existentes
        //         .post("/api/login")
        //         .send(bodyRequest);
        //     const { status, body } = res;
        //     try {
        //         expect(status).toBe(200);
        //         expect(body).toHaveProperty("token");
        //         expect(body).toHaveProperty("user");
        //         expect(body.user).toHaveProperty("id");
        //     } catch (error: any) {
        //         const details = { details: body };
        //         throw new Error(
        //             `${error.message} \n  ${JSON.stringify(details, null, 2)}`
        //         );
        //     }
        // });

        it("Error 401: Email ou senha inválidos", async () => {
            const bodyRequest = {
                email: "test@test.com",
                senha: "wrongpassword",
            };
            const res = await supertest(app)
                .post("/api/login")
                .send(bodyRequest);
            const { status, body } = res;
            try {
                expect(status).toBe(401);
                expect(body).toHaveProperty("status");
                expect(body.status).toBe("error");
                expect(body).toHaveProperty("statusCode");
                expect(body.statusCode).toBe(401);
                expect(body).toHaveProperty("message");
                expect(body.message).toBe("Email ou senha inválidos");
            } catch (error: any) {
                const details = { details: body };
                throw new Error(
                    `${error.message} \n  ${JSON.stringify(details, null, 2)}`
                );
            }
        });

        it("Error 400: Campos obrigatórios ausentes ou inválidos", async () => {
            const bodyRequest = {
                email: "",
                senha: "",
            };
            const res = await supertest(app)
                .post("/api/login")
                .send(bodyRequest);
            const { status, body } = res;
            try {
                expect(status).toBe(400);
                expect(body).toHaveProperty("status");
                expect(body.status).toBe("error");
                expect(body).toHaveProperty("statusCode");
                expect(body.statusCode).toBe(400);
                expect(body).toHaveProperty("message");
            } catch (error: any) {
                const details = { details: body };
                throw new Error(
                    `${error.message} \n  ${JSON.stringify(details, null, 2)}`
                );
            }
        });
    });
    describe("Auth Middleware", () => {
        let token: string;

        beforeAll(async () => {
            const res = await supertest(app)
                .post("/api/register")
                .send({
                    email: `test${Date.now()}@test.com`,
                    nome: "Test User",
                    senha: "password",
                    tipo: 1,
                });

            if (res.status === 201) {
                token = res.body.token;
            } else if (
                res.status === 500 &&
                res.body.message &&
                res.body.message.includes("already exists")
            ) {
                const loginRes = await supertest(app).post("/api/login").send({
                    email: "test@test.com",
                    senha: "password",
                });
                token = loginRes.body.token;
            } else {
                throw new Error(
                    `Unexpected error during user registration: ${res.body.message}`
                );
            }
        });

        it("Pass 200: Deve conceder acesso à rota protegida com token válido", async () => {
            const res = await supertest(app)
                .get("/api/protected")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "Acesso concedido");
            expect(res.body).toHaveProperty("user");
        });

        it("Erro 401: Deve negar acesso à rota protegida com token inválido", async () => {
            const res = await supertest(app)
                .get("/api/protected")
                .set("Authorization", "Bearer invalidtoken");

            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty(
                "message",
                "Token inválido ou expirado"
            );
        });

        it("Erro 401: Deve negar acesso à rota protegida sem token", async () => {
            const res = await supertest(app).get("/api/protected");

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty(
                "message",
                "Token não fornecido ou malformado"
            );
        });
    });
});
