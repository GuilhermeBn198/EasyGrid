import supertest from 'supertest';
import app from '../src/server';

describe("Subject CRUD", () => {
  let token: string;
  let semesterId: number;
  let subjectId: number;

  beforeAll(async () => {
    // Registra um usuário coordenador e obtém o token de autenticação
    const registerRes = await supertest(app).post("/api/register").send({
      email: `test${Date.now()}@test.com`,
      nome: "Test Coordinator",
      senha: "password",
      tipo: 2, // Coordenador
    });
    token = registerRes.body.token;

    // Cria um semestre para associar a matéria
    const semesterRes = await supertest(app)
      .post("/api/semester")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Spring 2025", prioridade: 1 });

    semesterId = semesterRes.body.id;
  });

  it("should create a new subject", async () => {
    const res = await supertest(app)
      .post("/api/subject")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Matemática", semesterId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("nome", "Matemática");

    subjectId = res.body.id;
  });

  it("should get all subjects", async () => {
    const res = await supertest(app)
      .get("/api/subject")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should get a subject by ID", async () => {
    const res = await supertest(app)
      .get(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", subjectId);
    expect(res.body).toHaveProperty("nome", "Matemática");
  });

  it("should update a subject", async () => {
    const res = await supertest(app)
      .put(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Matemática Avançada" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", subjectId);
    expect(res.body).toHaveProperty("nome", "Matemática Avançada");
  });

  it("should delete a subject", async () => {
    const res = await supertest(app)
      .delete(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);

    const getRes = await supertest(app)
      .get(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });
});