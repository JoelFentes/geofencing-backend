import request from "supertest";
import { app } from "../../src/server"; // Ajuste o caminho se necessário
import { prisma } from "../../src/prisma/client";
import bcrypt from "bcrypt";

// Limpeza completa antes de cada teste
// IMPORTANTE: Deletar 'Reminder' antes de 'User' por causa da chave estrangeira (Cascade)
beforeEach(async () => {
  await prisma.reminder.deleteMany();
  await prisma.user.deleteMany();
});

// Fechar conexão após todos os testes
afterAll(async () => {
  await prisma.$disconnect();
});

describe("Integration: User & Auth", () => {
  
  // --- GET USERS ---
  it("GET /users → deve retornar lista vazia inicialmente", async () => {
    const response = await request(app).get("/users");
    
    // Aceita 200 OK
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  // --- SIGNUP ---
  it("POST /users/signup → deve criar um usuário com sucesso", async () => {
    const email = `teste_${Date.now()}@test.com`;
    
    const response = await request(app)
      .post("/users/signup")
      .send({
        name: "Joel Teste",
        email,
        password: "123456",
        photo: "avatar.png"
      });

    // Aceita 201 (Created) ou 200 (OK)
    expect([200, 201]).toContain(response.status);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(email);
    expect(response.body).not.toHaveProperty("password"); // Segurança
  });

  it("POST /users/signup → não deve permitir e-mail duplicado", async () => {
    const email = `duplicado_${Date.now()}@test.com`;

    // 1. Cria o primeiro
    await prisma.user.create({
      data: {
        name: "Primeiro",
        email,
        password: "hash",
        createdAt: new Date()
      } as any
    });

    // 2. Tenta criar o segundo igual
    const response = await request(app).post("/users/signup").send({
      name: "Segundo",
      email,
      password: "123456"
    });

    expect(response.status).toBe(400); // Ou 500, dependendo do seu tratamento de erro
    // Verifique se a mensagem de erro bate com o seu throw new Error
    expect(response.body).toMatchObject({ error: expect.stringMatching(/uso|existe/) });
  });

  // --- LOGIN ---
  it("POST /users/login → deve autenticar e retornar token", async () => {
    const email = `login_${Date.now()}@test.com`;
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Cria usuário direto no banco para testar o login
    await prisma.user.create({
      data: { name: "Login User", email, password: hashedPassword, createdAt: new Date() } as any
    });

    const response = await request(app).post("/users/login").send({
      email,
      password: "123456"
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe(email);
  });

  it("POST /users/login → deve falhar com senha incorreta", async () => {
    const email = `wrongpass_${Date.now()}@test.com`;
    const hashedPassword = await bcrypt.hash("123456", 10);

    await prisma.user.create({
      data: { name: "User", email, password: hashedPassword, createdAt: new Date() } as any
    });

    const response = await request(app).post("/users/login").send({
      email,
      password: "wrongpass" // Senha errada
    });

    expect(response.status).toBe(400); // Ou 401
    expect(response.body.error).toMatch(/Invalid|credentials/i);
  });
});