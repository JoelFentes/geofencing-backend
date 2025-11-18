import { Router } from "express";
import { signupController, listUsersController, loginController, } from "../controllers/user.controller";
import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";;



const userRoutes = Router();

// GET todos os usuários → /users
userRoutes.get("/", listUsersController);

// POST criar usuário → /users/signup
userRoutes.post("/signup", signupController);

// POST logar usuário → /users/login
userRoutes.post("/login", loginController);

userRoutes.put("/update", authMiddleware, (req, res) =>
  userController.updateUser(req, res)
);


export default userRoutes;
