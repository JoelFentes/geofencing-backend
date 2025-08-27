import { Request, Response } from "express";
import { signupUser } from "../usecases/user/signupUser.usecase";
import { listUsers } from "../usecases/user/listUsers.usecase";

export async function signupController(req: Request, res: Response) {
  try {
    const user = await signupUser(req.body);
    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function listUsersController(req: Request, res: Response) {
  try {
    const users = await listUsers();
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao listar usuários" });
  }
}
