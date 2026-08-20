import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../services/etudiantService";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: "admin" | "user";
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Token manquant ou invalide", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!JWT_SECRET) {
      throw new AppError("Configuration serveur invalide (JWT_SECRET manquant)", 500);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      role: "admin" | "user";
    };

    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expiré", 401));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Token invalide", 401));
    }
    next(err);
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return next(new AppError("Accès réservé aux administrateurs", 403));
  }
  next();
};