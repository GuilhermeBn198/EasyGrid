import supertest from 'supertest';
import app from '../src/server';

describe("Subject CRUD", () => {
  let token: string;
  let subjectId: number;
  let semesterId: number;

  beforeAll(async () => {
    const registerRes = await supertest(app).post("/api/register").send({
      email: `test${Date.now()}@test.com`,
      nome: "Test User",
      senha: "password",
      tipo: 2, // Coordenador
    });
    token = registerRes.body.token;

    const semesterRes = await supertest(app)
      .post("/api/semester")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "semestre 1", prioridade: 1 });
    
    semesterId = semesterRes.body.id;
  });

  it("should create a new subject", async () => {
    const res = await supertest(app)
      .post("/api/subject")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        nome: "Estrutura de Dados",
        horario: "24M12", // Exemplo de horário: Terça e Quarta, de 8h às 10h
        semesterId 
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("nome", "Estrutura de Dados");
    expect(res.body).toHaveProperty("horario", "24M12");
    expect(res.body).toHaveProperty("semestreId", semesterId);

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
    expect(res.body).toHaveProperty("nome", "Estrutura de Dados");
    expect(res.body).toHaveProperty("horario", "24M12");
    expect(res.body).toHaveProperty("semestreId", semesterId);
  });

  it("should update a subject", async () => {
    const res = await supertest(app)
      .put(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        nome: "Estrutura de Dados 2",
        horario: "35T12" // Novo horário: Quarta e Quinta, de 14h às 16h
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", subjectId);
    expect(res.body).toHaveProperty("nome", "Estrutura de Dados 2");
    expect(res.body).toHaveProperty("horario", "35T12");
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
