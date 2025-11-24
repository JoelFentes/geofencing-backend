

# 🛰️ Orbit Notes – Backend

O **Orbit Notes – Backend** é a API responsável por fornecer autenticação, gerenciamento de usuários, notas e lembretes baseados em geolocalização para o aplicativo mobile Orbit.

Este serviço foi desenvolvido com foco em escalabilidade e organização, utilizando **TypeScript**, **Prisma ORM** e arquitetura modular baseada em casos de uso (Clean Architecture).

## 🛠️ Tecnologias

  * **Node.js** & **Express**
  * **TypeScript**
  * **Prisma ORM** (PostgreSQL)
  * **JWT** (Autenticação) & **Bcrypt** (Segurança)
  * **Jest** (Testes Unitários e Mocks)

-----

## 🗺️ Mapeamento de Serviços e Casos de Uso

Abaixo, a relação entre os serviços implementados e os problemas que eles resolvem no domínio da aplicação.

| Serviço | Caso de Uso | Descrição |
| :--- | :--- | :--- |
| **Auth / User** | **Registrar Usuário** | Criação de conta com criptografia de senha e suporte a foto de perfil. |
| | **Autenticação (Login)** | Validação de credenciais e emissão de token JWT (duração 24h). |
| | **Listagem de Usuários** | Visualização de todos os usuários cadastrados (Admin/Debug). |
| | **Atualizar Perfil** | Alteração de nome e foto de perfil de um usuário autenticado. |
| **Reminders** | **Criar Lembrete (Simples)** | Cria um lembrete básico com título e data. |
| | **Criar com Geofencing** | Cria lembrete vinculado a coordenadas (latitude/longitude/raio). |
| | **Listar Lembretes** | Busca todos os lembretes ativos de um ID de usuário específico. |
| | **Excluir Lembrete** | Remoção lógica ou física de um lembrete, validando a posse do usuário. |

-----

## 🚀 Documentação da API (Endpoints)

Baseado na implementação atual das rotas (`userRoutes` e `reminderRoutes`).

### 👤 Usuários (`/users`)

#### 1\. Criar Usuário (Signup)

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
  * **Regras:**
      * Verifica se o e-mail já existe.
      * Senha é salva criptografada (hash).

#### 2\. Autenticação (Login)

  * **Rota:** `POST /users/login`
  * **Descrição:** Autentica o usuário.
  * **Body:**
    ```json
    {
      "email": "maria@email.com",
      "password": "senha_segura"
    }
    ```
  * **Response (200):** Retorna objeto `user` e o `token`.

#### 3\. Atualizar Usuário

  * **Rota:** `PUT /users/update`
  * **Headers:** `Authorization: Bearer <token>`
  * **Descrição:** Atualiza dados cadastrais.
  * **Body:**
    ```json
    {
      "userId": 1,
      "name": "Maria S.",
      "photo": "nova_url_foto"
    }
    ```

#### 4\. Listar Todos

  * **Rota:** `GET /users/`
  * **Descrição:** Retorna lista de usuários ordenada por criação (decrescente).

-----

### 📍 Lembretes (`/reminders`)

#### 1\. Criar Lembrete (Com ou sem Geofencing)

  * **Rota:** `POST /reminders/`
  * **Descrição:** Cria um lembrete. Suporta lógica condicional para geofencing.
  * **Body (Exemplo com Geofence):**
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
  * **Regras de Negócio:**
      * `title` e `date` são obrigatórios.
      * Se enviar objeto `geofencing`, deve conter ao menos 1 local.

#### 2\. Listar Lembretes do Usuário

  * **Rota:** `GET /reminders/:userId`
  * **Parâmetros:** `userId` (ID numérico do usuário).
  * **Descrição:** Retorna todos os lembretes vinculados àquele ID.

#### 3\. Excluir Lembrete

  * **Rota:** `DELETE /reminders/:id/:userId`
  * **Parâmetros:**
      * `id`: ID do lembrete.
      * `userId`: ID do usuário (para garantir que ninguém apague lembrete de outro).
  * **Erro:** Retorna erro se o lembrete não for encontrado ou não pertencer ao usuário.

-----

## 🧪 Testes e Qualidade de Código

O projeto utiliza **Jest** para testes unitários. A estratégia adotada utiliza **Mocks** para isolar as regras de negócio, simulando o comportamento do banco de dados (`Prisma`) e bibliotecas externas (`bcrypt`, `jsonwebtoken`).

Isso garante que os testes sejam rápidos e não dependam de uma conexão real com o banco de dados.

### 📂 Cobertura dos Testes

Os testes implementados cobrem os seguintes cenários:

#### 🔐 Autenticação e Usuários (`UserUseCase`)

  * ✅ **Signup:** Criação de usuário com sucesso (senha hasheada) e bloqueio de e-mails duplicados.
  * ✅ **Login:** Geração de token JWT válida e bloqueio de credenciais incorretas ou usuários inexistentes.
  * ✅ **Listagem:** Retorno ordenado de usuários.

#### ⏰ Lembretes (`ReminderUseCase`)

  * ✅ **Criação:** Sucesso ao criar com dados completos e validação de campos obrigatórios (`title`, `date`).
  * ✅ **Listagem:** Filtro correto de lembretes por `userId`.
  * ✅ **Exclusão:** Garantia de que apenas o dono do lembrete pode excluí-lo.

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
```

### 🏃‍♂️ Como rodar os testes

```bash
npm test
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

# Protótipo Figma


<img width="1767" height="629" alt="image" src="https://github.com/user-attachments/assets/cb0260b4-83f0-494c-abec-c9f89767ffe5" />


-----

# Diagrama de Caso de Uso

<img width="1103" height="711" alt="image" src="https://github.com/user-attachments/assets/301477f7-9c7a-4fa9-b8f2-c30157470b62" />


*Documentação gerada para fins acadêmicos – Projeto Orbit Notes.*
