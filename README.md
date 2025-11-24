# 🛰️ Orbit Notes – Backend

O **Orbit Notes – Backend** é a API responsável por fornecer autenticação, gerenciamento de usuários, notas e lembretes baseados em geolocalização para o aplicativo mobile Orbit.

Este serviço foi desenvolvido com foco em escalabilidade e organização, utilizando **TypeScript**, **Prisma ORM** e arquitetura modular baseada em casos de uso (Clean Architecture).

## 🛠️ Tecnologias

* **Node.js** & **Express**
* **TypeScript**
* **Prisma ORM** (PostgreSQL)
* **JWT** (Autenticação) & **Bcrypt** (Segurança)
* **Jest** & **Supertest** (Testes Unitários e de Integração)

---

## ✨ Funcionalidades da Entrega Atual

Nesta versão, foram implementados e testados os seguintes fluxos principais:

1.  🆕 **CreateReminderWithGeofencing:** Lógica complexa que valida a existência de coordenadas geográficas antes de permitir a criação de um lembrete de localização.
2.  🆕 **UpdateUser:** Permite que usuários autenticados atualizem seus dados cadastrais (nome e foto).
3.  🆕 **ForgotPassword:** Fluxo de recuperação de conta que valida a existência do e-mail e gera um token de reset (simulado).

---

## 🗺️ Mapeamento de Serviços e Casos de Uso

Abaixo, a relação entre os serviços implementados e os problemas que eles resolvem no domínio da aplicação.

| Serviço | Caso de Uso | Descrição |
| :--- | :--- | :--- |
| **Auth / User** | **Registrar Usuário** | Criação de conta com criptografia de senha e suporte a foto de perfil. |
| | **Autenticação (Login)** | Validação de credenciais e emissão de token JWT (duração 24h). |
| | **Atualizar Perfil** (🆕) | Alteração de nome e foto de perfil de um usuário autenticado. |
| | **Recuperar Senha** (🆕) | Validação de e-mail e geração de token para redefinição de senha. |
| | **Listagem de Usuários** | Visualização de todos os usuários cadastrados (Admin/Debug). |
| **Reminders** | **Criar com Geofencing** (🆕) | Cria lembrete vinculado obrigatoriamente a uma geofence (lat/long/raio). |
| | **Listar Lembretes** | Busca todos os lembretes ativos de um ID de usuário específico. |
| | **Excluir Lembrete** | Remoção lógica ou física de um lembrete, validando a posse do usuário. |

---

## 🚀 Documentação da API (Endpoints)

Baseado na implementação atual das rotas (`userRoutes` e `reminderRoutes`).

### 👤 Usuários (`/users`)

#### 1. Criar Usuário (Signup)
* **Rota:** `POST /users/signup`
* **Descrição:** Cria um novo usuário no banco de dados.
* **Body:**
    ```json
    {
      "name": "Maria Silva",
      "email": "maria@email.com",
      "password": "senha_segura",
      "photo": "url_da_foto_opcional"
    }
    ```

#### 2. Autenticação (Login)
* **Rota:** `POST /users/login`
* **Response (200):** Retorna objeto `user` e o `token`.

#### 3. Atualizar Usuário (🆕)
* **Rota:** `PUT /users/update`
* **Headers:** `Authorization: Bearer <token>`
* **Descrição:** Atualiza dados cadastrais do usuário logado.
* **Body:**
    ```json
    {
      "userId": 1,
      "name": "Maria Souza",
      "photo": "nova_url_foto.png"
    }
    ```

#### 4. Recuperar Senha (🆕)
* **Rota:** `POST /users/forgot-password`
* **Descrição:** Verifica se o e-mail existe e inicia o fluxo de recuperação.
* **Body:** `{"email": "maria@email.com"}`
* **Response:** Retorna o token de reset (simulação).

---

### 📍 Lembretes (`/reminders`)

#### 1. Criar Lembrete com Geofencing (🆕)
* **Rota:** `POST /reminders/`
* **Descrição:** Cria um lembrete vinculado a uma localização geográfica.
* **Regra de Negócio:** O campo `geofencing` deve conter ao menos uma coordenada válida, caso contrário o sistema rejeita a criação.
* **Body:**
    ```json
    {
      "title": "Comprar leite",
      "date": "2023-12-25T10:00:00.000Z",
      "userId": 1,
      "geofencing": {
        "create": [
          {
            "latitude": -23.5505,
            "longitude": -46.6333,
            "radius": 100
          }
        ]
      }
    }
    ```

#### 2. Listar e Excluir
* **GET** `/reminders/:userId` - Lista lembretes do usuário.
* **DELETE** `/reminders/:id/:userId` - Apaga um lembrete (apenas se pertencer ao usuário).

---

## 🧪 Testes e Qualidade de Código

O projeto utiliza uma abordagem híbrida de testes para garantir a qualidade do software, utilizando **Jest** para testes unitários e **Supertest** para testes de integração.

### 1. Testes Unitários (Unit Tests)
A estratégia adotada utiliza **Mocks** para isolar as regras de negócio, simulando o comportamento do banco de dados (`Prisma`) e bibliotecas externas (`bcrypt`, `jsonwebtoken`). Isso garante que os testes sejam rápidos e não dependam de uma conexão real.

#### 📂 Cobertura dos Testes Unitários

**🔐 Autenticação e Usuários (`UserUseCase`)**
* ✅ **Signup:** Criação de usuário com sucesso e bloqueio de e-mails duplicados.
* ✅ **Login:** Geração de token JWT válida e bloqueio de credenciais incorretas.
* ✅ **UpdateUser (🆕):** Atualização de perfil mockada com sucesso.
* ✅ **ForgotPassword (🆕):** Geração de token simulado apenas para e-mails existentes.

**⏰ Lembretes (`ReminderUseCase`)**
* ✅ **Geofencing (🆕):** Validação rígida garantindo que o lembrete tenha coordenadas lat/long válidas.
* ✅ **Criação:** Sucesso ao criar com dados completos.
* ✅ **Exclusão:** Garantia de que apenas o dono do lembrete pode excluí-lo.

### 2. Testes de Integração (E2E - Live API)
Utilizamos **Supertest** para testar a **API real hospedada na nuvem** (Render). O foco é validar o fluxo completo em produção.

#### 📂 Cobertura dos Testes de Integração
* ✅ **Cadastro Real:** Criação de usuário no banco da nuvem.
* ✅ **Login Real:** Obtenção de Token JWT válido do servidor.
* ✅ **Fluxo Completo:** Uso do Token recebido para criar um Lembrete com Geofencing autenticado.

---

### 📝 Exemplo de Teste (Unitário com Mock)

Abaixo, um exemplo real do projeto demonstrando como simulamos o banco de dados para testar o cadastro:

```typescript
it("deve criar um novo usuário com senha criptografada", async () => {
  // 1. Mock: Simula que usuário ainda NÃO existe no banco
  (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

  // 2. Mock: Simula o hash da senha
  (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpass");

  // 3. Mock: Simula a criação bem-sucedida no Prisma
  (prisma.user.create as jest.Mock).mockResolvedValue({
    id: 1,
    name: "Joel",
    email: "joel@test.com",
    password: "hashedpass",
  });

  // Execução do caso de uso
  const result = await signupUser({
    name: "Joel",
    email: "joel@test.com",
    password: "123456",
  });

  // Asserções
  expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
  expect(result.password).toEqual("hashedpass");
});
````

### 🏃‍♂️ Como rodar os testes

**Testes Unitários:**

```bash
npm test
```

**Testes de Integração (Live API):**

```bash
npm run test:integration
```

-----

## 📦 Instalação e Execução

1.  **Instalar dependências:**

    ```bash
    npm install
    ```

2.  **Configurar variáveis de ambiente (`.env`):**

    ```env
    DATABASE_URL="postgresql://user:pass@localhost:5432/orbitdb"
    JWT_SECRET="sua_chave_secreta"
    ```

3.  **Rodar Migrations (Prisma):**

    ```bash
    npx prisma migrate dev
    ```

4.  **Iniciar Servidor:**

    ```bash
    npm run dev
    ```

-----

## 🎨 Protótipo e Diagramas

### Protótipo Figma

\<img width="1767" height="629" alt="image" src="https://github.com/user-attachments/assets/cb0260b4-83f0-494c-abec-c9f89767ffe5" /\>

### Diagrama de Caso de Uso

\<img width="1103" height="711" alt="image" src="https://github.com/user-attachments/assets/301477f7-9c7a-4fa9-b8f2-c30157470b62" /\>

*Documentação gerada para fins acadêmicos – Projeto Orbit Notes.*

```
