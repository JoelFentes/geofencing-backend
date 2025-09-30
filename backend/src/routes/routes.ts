import { Router } from "express";
import userRoutes from "./user.routes";
import reminderRoutes from "./reminder.routes";

const router = Router();

// Todas as rotas de usuário ficam sob /users
router.use("/users", userRoutes);

// Todas as rotas de lembrete ficam sob /reminders
router.use("/reminders", reminderRoutes);


export default router;
