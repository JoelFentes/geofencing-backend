import { Router } from "express";
import { 
  createReminderController, 
  listRemindersController, 
  deleteReminderController 
} from "../controllers/reminder.controller";

const reminderRoutes = Router();

// Criar lembrete
reminderRoutes.post("/", createReminderController);

// Listar lembretes de um usuário
reminderRoutes.get("/:userId", listRemindersController);

// Excluir lembrete
reminderRoutes.delete("/:id/:userId", deleteReminderController);

export default reminderRoutes;
