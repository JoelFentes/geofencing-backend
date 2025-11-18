import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // Verifica se o token foi enviado
  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  // O header vem no formato: "Bearer token_aqui"
  const [, token] = authHeader.split(" ");

  try {
    // Valida e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Salva os dados do usuário dentro da requisição (userId, email, etc)
    (req as any).user = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
