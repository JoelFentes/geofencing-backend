import { Router } from "express";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs"; 


const router = Router();


// GET todos os usuários
router.get("/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

// POST criar usuário
router.post("/users", async (req, res) => {

const { name, email, password, createdAt } = req.body;
const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
    data: {
        name,
        email,
        password: hashedPassword,
        createdAt
    },
    });
    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao criar usuário");
  }
});

export default router;
