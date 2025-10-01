import { Request, Response } from "express";
import { signupUser } from "../usecases/user/signupUser.usecase";
import { listUsers } from "../usecases/user/listUsers.usecase";
import { loginUser } from "../usecases/user/loginUser.usecase";

export const signupController = async (req: Request, res: Response) => {
  console.log("Body recebido:", req.body); // <-- aqui para debug

  try {
    const newUser = await signupUser(req.body);
    res.status(201).json(newUser);
  } catch (err: any) {
    console.error("Erro no signup:", err); // <-- logs detalhados
    res.status(400).json({ error: err.message });
  }
};
export async function listUsersController(req: Request, res: Response) {
  try {
    const users = await listUsers();
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao listar usuários" });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
