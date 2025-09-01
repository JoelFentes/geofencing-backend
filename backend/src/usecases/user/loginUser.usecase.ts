import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../../prisma/client"; 

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; 

export async function loginUser(email: string, password: string) {
  // 1. Buscar usuário no banco
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  // 2. Comparar senha
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // 3. Gerar token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  // 4. Retornar usuário + token
  return { user, token };
}
