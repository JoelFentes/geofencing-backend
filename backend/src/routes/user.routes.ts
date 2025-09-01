import { Router } from "express";
import { signupController, listUsersController, loginController } from "../controllers/user.controller";

const userRoutes = Router();

// GET todos os usuários → /users
userRoutes.get("/", listUsersController);

// POST criar usuário → /users/signup
userRoutes.post("/signup", signupController);

// // POST logar usuário → /users/login
userRoutes.post("/login", loginController);

export default userRoutes;
