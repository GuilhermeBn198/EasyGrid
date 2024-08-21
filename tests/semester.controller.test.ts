import supertest from 'supertest';
import app from '../src/server';

describe("Semester CRUD", () => {
  let coordinatorToken: string;
  let semesterId: number;

  beforeAll(async () => {
    // Registrar um usuário coordenador
    const registerRes = await supertest(app).post("/api/register").send({
      email: `coordinator${Date.now()}@test.com`,
      nome: "Coordinator User",
      senha: "password",
      tipo: 2, // Coordenador
    });
    coordinatorToken = registerRes.body.token;
  });

  it("should create a new semester", async () => {
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

  it("should prevent a non-coordinator from creating a semester", async () => {
    const registerRes = await supertest(app).post("/api/register").send({
      email: `professor${Date.now()}@test.com`,
      nome: "Professor User",
      senha: "password",
      tipo: 1, // Professor
    });
    const professorToken = registerRes.body.token;

    const res = await supertest(app)
      .post("/api/semester")
      .set("Authorization", `Bearer ${professorToken}`)
      .send({ nome: "Semestre 2", prioridade: 2 });

    expect(res.status).toBe(403); // Forbidden
  });

  it("should get all semesters", async () => {
    const res = await supertest(app)
      .get("/api/semester")
      .set("Authorization", `Bearer ${coordinatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should get a semester by ID", async () => {
    const res = await supertest(app)
      .get(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${coordinatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", semesterId);
    expect(res.body).toHaveProperty("nome", "Semestre 1");
  });

  it("should update a semester", async () => {
    const res = await supertest(app)
      .put(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${coordinatorToken}`)
      .send({ nome: "Semestre 3", prioridade: 3 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", semesterId);
    expect(res.body).toHaveProperty("nome", "Semestre 3");
    expect(res.body).toHaveProperty("prioridade", 3);
  });

  it("should prevent a non-coordinator from updating a semester", async () => {
    const registerRes = await supertest(app).post("/api/register").send({
      email: `professor${Date.now()}@test.com`,
      nome: "Professor User",
      senha: "password",
      tipo: 1, // Professor
    });
    const professorToken = registerRes.body.token;

    const res = await supertest(app)
      .put(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${professorToken}`)
      .send({ nome: "Semestre 4", prioridade: 4 });

    expect(res.status).toBe(403); // Forbidden
  });

  it("should delete a semester", async () => {
    const res = await supertest(app)
      .delete(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${coordinatorToken}`);

    expect(res.status).toBe(204);

    const getRes = await supertest(app)
      .get(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${coordinatorToken}`);

    expect(getRes.status).toBe(404);
  });

  it("should prevent a non-coordinator from deleting a semester", async () => {
    const registerRes = await supertest(app).post("/api/register").send({
      email: `professor${Date.now()}@test.com`,
      nome: "Professor User",
      senha: "password",
      tipo: 1, // Professor
    });
    const professorToken = registerRes.body.token;

    const res = await supertest(app)
      .delete(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${professorToken}`);

    expect(res.status).toBe(403); // Forbidden
  });
});
