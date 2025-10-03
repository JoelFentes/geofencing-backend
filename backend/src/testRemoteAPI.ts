async function testRemoteAPI() {
  const url = "https://geofencing-api.onrender.com/api/users/signup";

  const payload = {
    name: "Joel",
    email: `joel${Date.now()}@teste.com`,
    password: "123456"
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) console.log("✅ Sucesso:", data);
    else console.error("❌ Erro:", data);
  } catch (err: any) {
    console.error("Erro de conexão:", err.message);
  }
}

testRemoteAPI();
