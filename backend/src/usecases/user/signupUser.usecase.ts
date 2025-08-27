import { prisma } from "../../prisma/client";

interface SignupI {
  name: string;
  email: string;
  password: string;
}

export async function signupUser({ name, email, password }: SignupI) {
  const userExists = await prisma.user.findUnique({
    where: { email }
  });

  if (userExists) {
    throw new Error("E-mail já está em uso");
  }

  return prisma.user.create({
    data: {
      name,
      email,
      password,
      createdAt: new Date()
    }
  });
}
