import request from "supertest";
import app from "../index";
import { prisma } from "../prisma/client";

// Limpa usuários antes de cada teste
beforeEach(async () => {
  await prisma.user.deleteMany();
});

describe("User Controllers", () => {
  it("GET /users → deve retornar lista de usuários vazia inicialmente", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("POST /users/signup → deve criar um usuário", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        name: "Joel",
        email: "joel@test.com",
        password: "123456"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe("joel@test.com");
  });

  it("POST /users/signup → não deve permitir e-mail duplicado", async () => {
    await request(app).post("/api/users/signup").send({
      name: "Joel",
      email: "joel@test.com",
      password: "123456"
    });

    const response = await request(app).post("/api/users/signup").send({
      name: "Outro",
      email: "joel@test.com",
      password: "654321"
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("E-mail já está em uso");
  });
});
