import request from "supertest";
import app from "../../../index";
import { prisma } from "../../../prisma/client";
import bcrypt from "bcrypt";

// Limpeza completa antes de cada teste
beforeEach(async () => {
  await prisma.reminder.deleteMany();
  await prisma.user.deleteMany();
});

describe("User Controllers", () => {
  it("GET /users → deve retornar lista de usuários vazia inicialmente", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("POST /users/signup → deve criar um usuário", async () => {
    const email = `joel${Date.now()}@test.com`;
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        name: "Joel",
        email,
        password: "123456"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(email);
  });

  it("POST /users/signup → não deve permitir e-mail duplicado", async () => {
    const email = `joel${Date.now()}@test.com`;

    await request(app).post("/api/users/signup").send({
      name: "Joel",
      email,
      password: "123456"
    });

    const response = await request(app).post("/api/users/signup").send({
      name: "Outro",
      email,
      password: "654321"
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("E-mail já está em uso");
  });

  it("POST /users/login → deve autenticar usuário com senha correta", async () => {
    const email = `joel${Date.now()}@test.com`;
    const hashedPassword = await bcrypt.hash("123456", 10);

    await prisma.user.create({
      data: { name: "Joel", email, password: hashedPassword, createdAt: new Date() }
    });

    const response = await request(app).post("/api/users/login").send({
      email,
      password: "123456"
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe(email);
  });

  it("POST /users/login → deve falhar com senha incorreta", async () => {
    const email = `joel${Date.now()}@test.com`;
    const hashedPassword = await bcrypt.hash("123456", 10);

    await prisma.user.create({
      data: { name: "Joel", email, password: hashedPassword, createdAt: new Date() }
    });

    const response = await request(app).post("/api/users/login").send({
      email,
      password: "wrongpass"
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid credentials");
  });

  it("POST /users/login → deve falhar com e-mail inexistente", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: `naoexiste${Date.now()}@test.com`,
      password: "123456"
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("User not found");
  });
});