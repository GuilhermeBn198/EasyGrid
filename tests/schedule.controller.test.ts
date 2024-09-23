import supertest from 'supertest';
import app from '../src/server';

describe("Schedule Creation Restrictions", () => {
    let coordinatorToken: string;
    let subjectId1: number;
    let subjectId2: number;

    beforeAll(async () => {
        // Setup: Register coordinator and create subjects and semesters
        const registerCoordinatorRes = await supertest(app).post("/api/register").send({
            email: `coordinator${Date.now()}@test.com`,
            nome: "Coordinator User",
            senha: "password",
            tipo: 2, // Coordenador
        });
        coordinatorToken = registerCoordinatorRes.body.token;

        // Create Semester
        const semesterRes = await supertest(app)
            .post("/api/semester")
            .set("Authorization", `Bearer ${coordinatorToken}`)
            .send({ nome: "Semestre 1", prioridade: 1 });
        
        const semesterId = semesterRes.body.id;

        // Create Subjects
        const subjectRes1 = await supertest(app)
            .post("/api/subject")
            .set("Authorization", `Bearer ${coordinatorToken}`)
            .send({ nome: "Matéria 1", semestreId: semesterId });

        subjectId1 = subjectRes1.body.id;

        const subjectRes2 = await supertest(app)
            .post("/api/subject")
            .set("Authorization", `Bearer ${coordinatorToken}`)
            .send({ nome: "Matéria 2", semestreId: semesterId });

        subjectId2 = subjectRes2.body.id;
    });

    it("Erro 409: Deve impedir sobreposição de horários para matérias no mesmo semestre", async () => {
        await supertest(app)
            .post("/api/schedules")
            .set("Authorization", `Bearer ${coordinatorToken}`)
            .send({ materiaId: subjectId1, dia: 2, horario: 1 });

        const res = await supertest(app)
            .post("/api/schedules")
            .set("Authorization", `Bearer ${coordinatorToken}`)
            .send({ materiaId: subjectId2, dia: 2, horario: 1 });

        expect(res.status).toBe(400); // Bad Request
        expect(res.body.message).toMatch(/Professor cannot have overlapping schedules/);
    });

    it("Erro 409: Deve impedir sobreposição de horários para o mesmo professor", async () => {
        await supertest(app)
            .post("/api/schedules")
            .set("Authorization", `Bearer ${coordinatorToken}`)
            .send({ materiaId: subjectId1, usuarioId: 1, dia: 3, horario: 2 });

        const res = await supertest(app)
            .post("/api/schedules")
            .set("Authorization", `Bearer ${coordinatorToken}`)
            .send({ materiaId: subjectId2, usuarioId: 1, dia: 3, horario: 2 });

        expect(res.status).toBe(400); // Bad Request
        expect(res.body.message).toMatch(/professor cannot have overlapping schedules/);
    });

    it("Erro 400: Deve impedir que uma matéria seja alocada em mais de 4 horários diferentes", async () => {
        // Assign up to 4 time slots
        for (let i = 1; i <= 4; i++) {
            await supertest(app)
                .post("/api/schedules")
                .set("Authorization", `Bearer ${coordinatorToken}`)
                .send({ materiaId: subjectId1, dia: 2, horario: i });
        }

        // Attempt to assign a 5th time slot
        const res = await supertest(app)
            .post("/api/schedules")
            .set("Authorization", `Bearer ${coordinatorToken}`)
            .send({ materiaId: subjectId1, dia: 3, horario: 1 });

        expect(res.status).toBe(400); // Bad Request
        expect(res.body.message).toMatch(/cannot be assigned to more than 4 different time slots/);
    });

    it("Erro 400: Deve exigir que as matérias sejam alocadas em 2 horários consecutivos", async () => {
        const res = await supertest(app)
            .post("/api/schedules")
            .set("Authorization", `Bearer ${coordinatorToken}`)
            .send({ materiaId: subjectId1, dia: 4, horario: 1 });

        expect(res.status).toBe(400); // Bad Request
        expect(res.body.message).toMatch(/must be assigned in 2 consecutive hours/);

        // Correct consecutive assignment
        const resCorrect = await supertest(app)
            .post("/api/schedules")
            .set("Authorization", `Bearer ${coordinatorToken}`)
            .send({ materiaId: subjectId1, dia: 4, horario: 1 })
            .then(() =>
                supertest(app)
                    .post("/api/schedule")
                    .set("Authorization", `Bearer ${coordinatorToken}`)
                    .send({ materiaId: subjectId1, dia: 4, horario: 2 })
            );

        expect(resCorrect.status).toBe(201); // Created
    });

    it("Erro 400: Deve impedir que matérias sejam alocadas em horários após as 16h", async () => {
        const res = await supertest(app)
            .post("/api/schedules")
            .set("Authorization", `Bearer ${coordinatorToken}`)
            .send({ materiaId: subjectId1, dia: 5, horario: 5 }); // 18h-19h

        expect(res.status).toBe(400); // Bad Request
        expect(res.body.message).toMatch(/cannot be assigned to time slots after 16h/);
    });

    it("Erro 400: Deve impedir que matérias sejam alocadas nas sextas e sábados", async () => {
        const resFriday = await supertest(app)
            .post("/api/schedules")
            .set("Authorization", `Bearer ${coordinatorToken}`)
            .send({ materiaId: subjectId1, dia: 6, horario: 1 }); // Friday

        expect(resFriday.status).toBe(400); // Bad Request
        expect(resFriday.body.message).toMatch(/Subjects cannot be assigned on Fridays or Saturdays/);

        const resSaturday = await supertest(app)
            .post("/api/schedules")
            .set("Authorization", `Bearer ${coordinatorToken}`)
            .send({ materiaId: subjectId1, dia: 7, horario: 1 }); // Saturday

        expect(resSaturday.status).toBe(400); // Bad Request
        expect(resSaturday.body.message).toMatch(/Subjects cannot be assigned on Fridays or Saturdays/);
    });
});
