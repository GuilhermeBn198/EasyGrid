import supertest from 'supertest';
import app from '../src/server';

describe("Schedule CRUD", () => {
  let token: string;
  let userId: number;
  let subjectId: number;
  let scheduleId: number;

  beforeAll(async () => {
    const registerRes = await supertest(app).post("/api/register").send({
      email: `test${Date.now()}@test.com`,
      nome: "Test User",
      senha: "password",
      tipo: 1,
    });
    token = registerRes.body.token;
    userId = registerRes.body.user.id;

    const semesterRes = await supertest(app)
      .post("/api/semester")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Spring 2025", prioridade: 1 });

    const subjectRes = await supertest(app)
      .post("/api/subject")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Mathematics", semestreId: semesterRes.body.id });

    subjectId = subjectRes.body.id;
  });

  it("should create a new schedule", async () => {
    const res = await supertest(app)
      .post("/api/schedule")
      .set("Authorization", `Bearer ${token}`)
      .send({ materiaId: subjectId, usuarioId: userId, dia: 1, horario: 10 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("materiaId", subjectId);
    expect(res.body).toHaveProperty("usuarioId", userId);
    expect(res.body).toHaveProperty("dia", 1);
    expect(res.body).toHaveProperty("horario", 10);

    scheduleId = res.body.id;
  });

  it("should get all schedules", async () => {
    const res = await supertest(app)
      .get("/api/schedule")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should get a schedule by ID", async () => {
    const res = await supertest(app)
      .get(`/api/schedule/${scheduleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", scheduleId);
    expect(res.body).toHaveProperty("materiaId", subjectId);
    expect(res.body).toHaveProperty("usuarioId", userId);
  });

  it("should update a schedule", async () => {
    const res = await supertest(app)
      .put(`/api/schedule/${scheduleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ dia: 2, horario: 14 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", scheduleId);
    expect(res.body).toHaveProperty("dia", 2);
    expect(res.body).toHaveProperty("horario", 14);
  });

  it("should delete a schedule", async () => {
    const res = await supertest(app)
      .delete(`/api/schedule/${scheduleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);

    const getRes = await supertest(app)
      .get(`/api/schedule/${scheduleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });
});
