import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import supertest from 'supertest';
import app from '../src/server';

describe("Subject CRUD", () => {
  let coordinatorToken: string;
  let professorToken: string;
  let subjectId: number;
  let dataSemTest: { id: number; nome: string; prioridade: number };
  let professorTest: any;

  beforeAll(async () => {
    // Criar um semestre para associar a matéria
    dataSemTest = await prisma.semester.create({
        data: { nome: "Semestre 1", prioridade: 1 },
    });

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

    professorTest = registerProfessorRes.body
    professorToken = registerProfessorRes.body.token;

    // Registrar uma subject anterior
    const res = await supertest(app)
    .post("/api/subject")
    .set("Authorization", `Bearer ${coordinatorToken}`)
    .send({ nome: "Mathematics", semestreId: dataSemTest.id, professorId: professorTest.user.id });
    
    subjectId = res.body.id;
});


  it("Pass 201: Deve permitir que um coordenador crie uma nova matéria com um professor", async () => {
    const res = await supertest(app)
      .post("/api/subject")
      .set("Authorization", `Bearer ${coordinatorToken}`)
      .send({ nome: "Mathematics", semestreId: dataSemTest.id, professorId: professorTest.user.id });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("nome", "Mathematics");
    expect(res.body).toHaveProperty("semestreId", dataSemTest.id);
    expect(res.body).toHaveProperty("professorId", professorTest.user.id);
    
});

  it("Erro 403: Deve impedir que um professor crie uma nova matéria", async () => {
    const res = await supertest(app)
      .post("/api/subject")
      .set("Authorization", `Bearer ${professorToken}`)
      .send({ nome: "Physics", semestreId: 2 });

    expect(res.status).toBe(403); // Forbidden
  });

  it("Pass 200: Deve permitir que todos os usuários obtenham todas as matérias", async () => {
    const res = await supertest(app)
      .get("/api/subject")
      .set("Authorization", `Bearer ${coordinatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("Pass 200: Deve permitir que todos os usuários obtenham uma matéria por ID", async () => {
    const res = await supertest(app)
      .get(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", subjectId);
    expect(res.body).toHaveProperty("nome", "Mathematics");
  });

  // it("Pass 200: Deve permitir que um coordenador atualize uma matéria", async () => {
  //   const res = await supertest(app)
  //     .patch(`/api/subject/${dataSemTest.id}`)
  //     .set("Authorization", `Bearer ${coordinatorToken}`)
  //     .send({ nome: "Advanced Mathematics", semestreId: 1 });

  //   expect(res.status).toBe(200);
  //   expect(res.body).toHaveProperty("id", subjectId);
  //   expect(res.body).toHaveProperty("nome", "Advanced Mathematics");
  //   expect(res.body).toHaveProperty("semestreId", 1);
  // });

  it("Erro 403: Deve impedir que um professor atualize uma matéria", async () => {
    const res = await supertest(app)
      .patch(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${professorToken}`)
      .send({ nome: "Physics II", semestreId: 2 });

    expect(res.status).toBe(403); // Forbidden
  });

  it("Pass 200: Deve permitir que um coordenador delete uma matéria", async () => {
    const res = await supertest(app)
      .delete(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${coordinatorToken}`);

    expect(res.status).toBe(204);

    const getRes = await supertest(app)
      .get(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${coordinatorToken}`);

    expect(getRes.status).toBe(404);
  });

  it("Erro 403: Deve impedir que um professor delete uma matéria", async () => {
    const res = await supertest(app)
      .delete(`/api/subject/${subjectId}`)
      .set("Authorization", `Bearer ${professorToken}`);

    expect(res.status).toBe(403); // Forbidden
  });
});
