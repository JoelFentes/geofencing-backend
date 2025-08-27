import { Router } from "express";
import userRoutes from "./user.routes";

const router = Router();

// Todas as rotas de usuário ficam sob /users
router.use("/users", userRoutes);

export default router;
