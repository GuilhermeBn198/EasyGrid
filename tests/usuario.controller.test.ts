import supertest from 'supertest';
import app from '../src/server';

describe("User CRUD", () => {
    let adminToken: string;
    let userId: number;

    beforeAll(async () => {
        // Registrar um usuário coordenador
        const adminRes = await supertest(app).post("/api/register").send({
            email: `admin${Date.now()}@test.com`,
            nome: "Admin User",
            senha: "password",
            tipo: 2, // Coordenador
        });
        adminToken = adminRes.body.token;
    });

    it("Pass 201: Deve criar um novo usuário", async () => {
        const res = await supertest(app)
            .post("/api/usuario")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                email: `user${Date.now()}@test.com`,
                nome: "Test User",
                senha: "password",
                tipo: 1, // Professor
            });
    
        expect(res.status).toBe(201);
        expect(res.body.user).toHaveProperty("id");  // Modificado para res.body.user
        expect(res.body.user).toHaveProperty("nome", "Test User");  // Modificado para res.body.user
    
        userId = res.body.user.id;  // Modificado para res.body.user
    });

    it("Pass 200: Deve obter todos os usuários", async () => {
        const res = await supertest(app)
            .get("/api/usuario")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it("Pass 200: Deve obter um usuário por ID", async () => {
        const res = await supertest(app)
            .get(`/api/usuario/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", userId);
        expect(res.body).toHaveProperty("nome", "Test User");
    });

    it("Pass 200: Deve atualizar um usuário", async () => {
        const res = await supertest(app)
            .patch(`/api/usuario/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                nome: "Updated User",
                email: `updated${Date.now()}@test.com`,
                senha: "newpassword",
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", userId);
        expect(res.body).toHaveProperty("nome", "Updated User");
    });

    it("Pass 200: Deve deletar um usuário", async () => {
        const res = await supertest(app)
            .delete(`/api/usuario/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(204);

        const getRes = await supertest(app)
            .get(`/api/usuario/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(getRes.status).toBe(404);
    });
});
