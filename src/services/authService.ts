import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as usersRepository from "../repositories/userRepository";
import { UserInput, UserPublic } from "../models/userModel";
import { AppError } from "./etudiantService";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toPublicUser = (user: { id: number; email: string; role: string; created_at: Date }): UserPublic => {
  return {
    id: user.id,
    email: user.email,
    role: user.role as "admin" | "user",
    created_at: user.created_at,
  };
};

export const register = async (data: UserInput): Promise<UserPublic> => {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError("email et password sont obligatoires", 400);
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new AppError("Format d'email invalide", 400);
  }

  if (password.length < 6) {
    throw new AppError("Le mot de passe doit contenir au moins 6 caractères", 400);
  }

  const existing = await usersRepository.findByEmail(email);
  if (existing) {
    throw new AppError("Cet email est déjà utilisé", 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const role = data.role || "user";

  const user = await usersRepository.create({ email, password: hashedPassword, role });
  return toPublicUser(user);
};

export const login = async (email: string, password: string): Promise<{ token: string; user: UserPublic }> => {
  if (!email || !password) {
    throw new AppError("email et password sont obligatoires", 400);
  }

  const user = await usersRepository.findByEmail(email);
  if (!user) {
    throw new AppError("Email ou mot de passe incorrect", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Email ou mot de passe incorrect", 401);
  }

  if (!JWT_SECRET) {
    throw new AppError("Configuration serveur invalide (JWT_SECRET manquant)", 500);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );

  return { token, user: toPublicUser(user) };
};