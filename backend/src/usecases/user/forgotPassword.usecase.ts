import { prisma } from "../../prisma/client";
import crypto from "crypto"; 

export async function forgotPassword(email: string) {
  // 1. Verifica se usuário existe
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // 2. Gera um token aleatório (simulação de reset token)
  const resetToken = crypto.randomBytes(20).toString("hex");

  // 3. Aqui você salvaria o token no banco com uma validade, 
  // mas para manter simples, vamos apenas retorná-lo.
  
  return {
    message: "Token de recuperação gerado",
    resetToken: resetToken,
    emailSentTo: user.email
  };
}