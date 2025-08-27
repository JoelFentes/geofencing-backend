"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("./prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
// GET todos os usuários
router.get("/users", async (_req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany();
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Erro no servidor");
    }
});
// POST criar usuário
router.post("/users", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    try {
        const newUser = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        res.json(newUser);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Erro ao criar usuário");
    }
});
exports.default = router;
