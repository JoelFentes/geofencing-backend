import request from "supertest";

// URL da sua API em produção
const BASE_URL = "https://geofencing-api.onrender.com/api";

// Função para gerar e-mails únicos e evitar erro de "Email já existe"
const generateEmail = () => `teste_live_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`;

describe("Live Integration: Auth & Users", () => {
  
  const uniqueEmail = generateEmail();
  const defaultPassword = "123";

  it("POST /users/signup → deve criar um usuário no banco da nuvem", async () => {
    const response = await request(BASE_URL)
      .post("/users/signup") // Confirme se a rota é essa ou /auth/signup
      .send({
        name: "Teste Integração Nuvem",
        email: uniqueEmail,
        password: defaultPassword,
        photo: "https://i.imgur.com/foto.png"
      });

    // Aceita 200 ou 201
    expect([200, 201]).toContain(response.status);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(uniqueEmail);
  });

  it("POST /users/signup → não deve permitir e-mail duplicado", async () => {
    // Tenta criar de novo com o MESMO e-mail do teste anterior
    const response = await request(BASE_URL)
      .post("/users/signup")
      .send({
        name: "Duplicado",
        email: uniqueEmail, // Mesmo email
        password: "123"
      });

    expect(response.status).toBe(400); // Ou 500, dependendo do seu erro
    // Ajuste a mensagem abaixo conforme o retorno da sua API real
    // expect(response.body.error).toMatch(/existe|uso/i); 
  });

  it("POST /users/login → deve autenticar usuário criado", async () => {
    const response = await request(BASE_URL)
      .post("/users/login")
      .send({
        email: uniqueEmail,
        password: defaultPassword
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe(uniqueEmail);
  });

  it("POST /users/login → deve falhar com senha errada", async () => {
    const response = await request(BASE_URL)
      .post("/users/login")
      .send({
        email: uniqueEmail,
        password: "senha_errada_proposital"
      });

    expect(response.status).toBe(400); // Ou 401
  });
});