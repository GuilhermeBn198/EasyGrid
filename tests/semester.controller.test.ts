import supertest from 'supertest';
import app from '../src/server';

describe("Semester CRUD", () => {
  let token: string;
  let semesterId: number;

  beforeAll(async () => {
    const registerRes = await supertest(app).post("/api/register").send({
      email: `test${Date.now()}@test.com`,
      nome: "Test User",
      senha: "password",
      tipo: 1,
    });
    token = registerRes.body.token;
  });

  it("should create a new semester", async () => {
    const res = await supertest(app)
      .post("/api/semester")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Fall 2024", prioridade: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("nome", "Fall 2024");
    expect(res.body).toHaveProperty("prioridade", 1);

    semesterId = res.body.id;
  });

  it("should get all semesters", async () => {
    const res = await supertest(app)
      .get("/api/semester")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should get a semester by ID", async () => {
    const res = await supertest(app)
      .get(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", semesterId);
    expect(res.body).toHaveProperty("nome", "Fall 2024");
  });

  it("should update a semester", async () => {
    const res = await supertest(app)
      .put(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Spring 2025", prioridade: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", semesterId);
    expect(res.body).toHaveProperty("nome", "Spring 2025");
    expect(res.body).toHaveProperty("prioridade", 2);
  });

  it("should delete a semester", async () => {
    const res = await supertest(app)
      .delete(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);

    const getRes = await supertest(app)
      .get(`/api/semester/${semesterId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });
});
