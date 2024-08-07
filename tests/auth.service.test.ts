import supertest from "supertest";
import app from "../src/server";

describe("Auth Routes", () => {
    describe("POST /auth/register", () => {
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
                expect(bodyResponse).toHaveProperty("id");
            } catch (error: any) {
                const details = { details: bodyResponse };
                throw new Error(
                    `${error.message} \n  ${JSON.stringify(details, null, 2)}`
                );
            }
        });

        it("Error 400: Todos os campos devem ser obrigatórios", async () => {
            const bodyRequest = {
                email: "",
                nome: "",
                senha: "",
                tipo: 0,
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
                throw new Error(
                    `${JSON.stringify(details, null, 2)}`
                );
            }
        });
    });
    describe("POST /auth/login", () => {});
    it("Pass 200: O usuário conseguir logar com sucesso, retornando o token", async () => {
        const bodyRequest = {
            email: "test@test.com",
            senha: "password",
        };
        const res = await supertest(app)
            .post("/api/login")
            .send(bodyRequest);
        const { status } = res;
        const bodyResponse = res.body;
        try {
            expect(status).toBe(200);
            expect(bodyResponse).toHaveProperty("id");
        } catch (error: any) {
            const details = { details: bodyResponse };
            throw new Error(
                `${JSON.stringify(details, null, 2)}`
            );
        }
    });
    it("Error 400: Todos os campos devem ser obrigatórios", async () => {
        const bodyRequest = {
            email: "",
            nome: "",
            senha: "",
            tipo: 0,
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
            throw new Error(
                `${JSON.stringify(details, null, 2)}`
            );
        }
    });
});
