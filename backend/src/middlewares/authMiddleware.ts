import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Definição da interface do token decodificado
interface DecodedToken {
  userId: number; // O ID está sendo salvo como 'userId' no token
  email: string;
  iat: number;
  exp: number;
}

// Estendendo o objeto Request para incluir 'userId'
declare global {
  namespace Express {
    interface Request {
      userId?: string; // O controller espera que o ID seja uma string
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // 1. Verifica se o token foi enviado
  if (!authHeader) {
    // Retorna JSON, evitando o erro de HTML/JSON Parse no frontend
    return res.status(401).json({ error: "Token not provided" });
  }

  // O header vem no formato: "Bearer token_aqui"
  const [, token] = authHeader.split(" ");

  try {
    // 2. Valida e decodifica o token
    // Força a tipagem para o TypeScript saber o que há dentro de 'decoded'
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken; 

    // 3. Salva o ID do usuário na requisição
    // O controller espera 'req.userId' como string, então convertemos de number
    (req as any).userId = String(decoded.userId); 

    // 4. Continua o fluxo para o próximo middleware/controller
    return next();
  } catch (error) {
    // Retorna JSON para erros de token (expirado, inválido, etc.)
    return res.status(401).json({ error: "Invalid token" });
  }
}