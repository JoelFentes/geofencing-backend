import bcrypt from "bcrypt";
import { prisma } from "../../prisma/client";

interface SignupI {
  name: string;
  email: string;
  password: string;
}

export async function signupUser(data: SignupI) {
  const userExists = await prisma.user.findUnique({
    where: { email: data.email }
    
  });
  

  if (userExists) {
    throw new Error("E-mail já está em uso");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword, 
      createdAt: new Date()
    }
  });

  return newUser;
}
