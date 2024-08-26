import supertest from 'supertest';
import app from '../src/server';

describe("Subject CRUD", () => {
  let coordinatorToken: string;
  let professorToken: string;
  let subjectId: number;

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

  it("should allow a coordinator to create a new subject", async () => {
    const res = await supertest(app)
      .post("/api/subject")
      .set("Authorization", `Bearer ${coordinatorToken}`)
      .send({ nome: "Mathematics", semestreId: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("nome", "Mathematics");
    expect(res.body).toHaveProperty("semestreId", 1);

    subjectId = res.body.id;
  });

  it("should prevent a professor from creating a new subject", async () => {
    const res = await supertest(app)
      .post("/api/subject")
      .set("Authorization", `Bearer ${professorToken}`)
      .send({ nome: "Physics", semestreId: 2 });

    expect(res.status).toBe(403); // Forbidden
  });

  it("should allow all users to get all subjects", async () => {
    const res = await supertest(app)
      .get("/api/subject")
      .set("Authorization", `Bearer ${coordinatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should allow all users to get a subject by ID", async () => {
    const res = await supertest(app)
      .get(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", subjectId);
    expect(res.body).toHaveProperty("nome", "Mathematics");
  });

  it("should allow a coordinator to update a subject", async () => {
    const res = await supertest(app)
      .put(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${coordinatorToken}`)
      .send({ nome: "Advanced Mathematics", semestreId: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", subjectId);
    expect(res.body).toHaveProperty("nome", "Advanced Mathematics");
    expect(res.body).toHaveProperty("semestreId", 1);
  });

  it("should prevent a professor from updating a subject", async () => {
    const res = await supertest(app)
      .put(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${professorToken}`)
      .send({ nome: "Physics II", semestreId: 2 });

    expect(res.status).toBe(403); // Forbidden
  });

  it("should allow a coordinator to delete a subject", async () => {
    const res = await supertest(app)
      .delete(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${coordinatorToken}`);

    expect(res.status).toBe(204);

    const getRes = await supertest(app)
      .get(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${coordinatorToken}`);

    expect(getRes.status).toBe(404);
  });

  it("should prevent a professor from deleting a subject", async () => {
    const res = await supertest(app)
      .delete(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${professorToken}`);

    expect(res.status).toBe(403); // Forbidden
  });
});
