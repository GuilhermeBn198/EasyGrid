import supertest from 'supertest';
import app from '../src/server';

describe("Semester CRUD", () => {
  let coordinatorToken: string;
  let professorToken: string;
  let semesterId: number;

  beforeAll(async () => {
    // Registrar um usuário coordenador
    const registerCoordinatorRes = await supertest(app).post("/api/register").send({
      email: `coordinator${Date.now()}@test.com`,
      nome: "Coordinator User",
      senha: "password",
      tipo: 2, // Coordenador
    });
    coordinatorToken = registerCoordinatorRes.body.token;

    // Registrar um usuário professor
    const registerProfessorRes = await supertest(app).post("/api/register").send({
      email: `professor${Date.now()}@test.com`,
      nome: "Professor User",
      senha: "password",
      tipo: 1, // Professor
    });
    professorToken = registerProfessorRes.body.token;
  });

  it("Pass 201: Deve permitir que um coordenador crie um novo semestre", async () => {
    const res = await supertest(app)
      .post("/api/semester")
      .set("Authorization", `Bearer ${coordinatorToken}`)
      .send({ nome: "Semestre 1", prioridade: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("nome", "Semestre 1");
    expect(res.body).toHaveProperty("prioridade", 1);

    semesterId = res.body.id;
  });

  it("Erro 403: Deve impedir que um professor crie um novo semestre", async () => {
    const res = await supertest(app)
      .post("/api/semester")
      .set("Authorization", `Bearer ${professorToken}`)
      .send({ nome: "Semestre 2", prioridade: 2 });

    expect(res.status).toBe(403); // Forbidden
  });

  it("Pass 200: Deve permitir que todos os usuários obtenham todos os semestres", async () => {
    const res = await supertest(app)
      .get("/api/semester")
      .set("Authorization", `Bearer ${coordinatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("Pass 200: Deve permitir que todos os usuários obtenham um semestre por ID", async () => {
    const res = await supertest(app)
      .get(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", semesterId);
    expect(res.body).toHaveProperty("nome", "Semestre 1");
  });

  it("Pass 200: Deve permitir que um coordenador atualize um semestre", async () => {
    const res = await supertest(app)
      .patch(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${coordinatorToken}`)
      .send({ nome: "Semestre 3", prioridade: 3 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", semesterId);
    expect(res.body).toHaveProperty("nome", "Semestre 3");
    expect(res.body).toHaveProperty("prioridade", 3);
  });

  it("Erro 403: Deve impedir que um professor atualize um semestre", async () => {
    const res = await supertest(app)
      .put(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${professorToken}`)
      .send({ nome: "Semestre 4", prioridade: 4 });

    expect(res.status).toBe(403); // Forbidden
  });

  it("Pass 200: Deve permitir que um coordenador delete um semestre", async () => {
    const res = await supertest(app)
      .delete(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${coordinatorToken}`);

    expect(res.status).toBe(204);

    const getRes = await supertest(app)
      .get(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${coordinatorToken}`);

    expect(getRes.status).toBe(404);
  });

  it("Erro 403: Deve impedir que um professor delete um semestre", async () => {
    const res = await supertest(app)
      .delete(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${professorToken}`);

    expect(res.status).toBe(403); // Forbidden
  });
});
