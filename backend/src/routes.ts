import { Router } from "express";
import { prisma } from "./prisma";

const router = Router();

// Teste simples
router.get("/", (_req, res) => {
  res.send("API funcionando!");
});

// GET todos os usuários
router.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// POST criar usuário
router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = await prisma.user.create({
    data: { name, email, password, createdAt: new Date() }
  });
  res.json(newUser);
});

export default router;
