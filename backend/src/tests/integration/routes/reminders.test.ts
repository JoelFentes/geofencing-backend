import request from "supertest";

const BASE_URL = "https://geofencing-api.onrender.com/api";

// Gera um e-mail aleatório para cada execução de teste
const generateEmail = () => `reminder_debug_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`;

describe("Live Integration: Reminders", () => {
  let token: string;
  let userId: number;

  // SETUP: Cria usuário e faz login
  beforeAll(async () => {
    const email = generateEmail();
    const password = "123";

    // 1. Signup
    const signupRes = await request(BASE_URL).post("/users/signup").send({
      name: "Debug User",
      email,
      password,
    });
    
    // Tenta pegar ID do signup, se não der, pegamos do login
    if (signupRes.body && signupRes.body.id) {
        userId = signupRes.body.id;
    }

    // 2. Login
    const loginRes = await request(BASE_URL).post("/users/login").send({
      email,
      password
    });

    token = loginRes.body.token;
    
    // Garante que temos o ID
    if (!userId && loginRes.body.user) {
        userId = loginRes.body.user.id;
    }

    // LOG DE DEBUG DO SETUP
    console.log("--- SETUP ---");
    console.log("User Email:", email);
    console.log("UserID Capturado:", userId);
    console.log("Token Capturado:", token ? "Sim (Token presente)" : "NÃO");
    console.log("-------------");
  });

  it("POST /reminders → deve criar lembrete (com Geofence)", async () => {
    // Verificação de segurança antes de tentar
    if (!token || !userId) {
        throw new Error("FALHA NO SETUP: Token ou UserId não foram gerados. Verifique o console acima.");
    }

   const payload = {
    title: "Lembrete Nuvem Debug",
    date: new Date().toISOString(),
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    userId,
    geofencing: {
        create: [
        {
            latitude: -23.55,
            longitude: -46.63,
            radius: 100
        }
        ]
    }
    };


    const response = await request(BASE_URL)
      .post("/reminders")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    // --- DEBUGGING DO ERRO 400 ---
    if (response.status !== 200 && response.status !== 201) {
        console.error("❌ ERRO AO CRIAR LEMBRETE:");
        console.error("Status:", response.status);
        console.error("Body (Erro do Backend):", JSON.stringify(response.body, null, 2));
    }

    expect([200, 201]).toContain(response.status);
    expect(response.body.title).toBe("Lembrete Nuvem Debug");
  });

  it("GET /reminders/:userId → deve listar lembretes", async () => {
    // Se o teste anterior falhar, este provavelmente falhará também (lista vazia)
    // Mas vamos logar o erro caso não seja 200
    const response = await request(BASE_URL)
      .get(`/reminders/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    if (response.status !== 200) {
        console.error("❌ ERRO AO LISTAR:");
        console.error(response.body);
    } else if (response.body.length === 0) {
        console.warn("⚠️ ALERTA: A lista voltou vazia (provavelmente o POST falhou).");
    }

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});