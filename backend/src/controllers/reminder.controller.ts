import { Request, Response } from "express";
import { createReminder } from "../usecases/reminder/createReminder.usecase";
import { listReminders } from "../usecases/reminder/listReminders.usecase";
import { deleteReminder } from "../usecases/reminder/deleteReminder.usecase";

export async function createReminderController(req: Request, res: Response) {
  try {
    const reminder = await createReminder({
      ...req.body,
      userId: req.body.userId, 
    });
    return res.status(201).json(reminder);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function listRemindersController(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const reminders = await listReminders(Number(userId));
    return res.json(reminders);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function deleteReminderController(req: Request, res: Response) {
  try {
    const { id, userId } = req.params;
    const result = await deleteReminder(Number(id), Number(userId));
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
