import pool from "../db/pool";
import { User, UserInput } from "../models/userModel";

export const findByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
};

export const findById = async (id: number): Promise<User | null> => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const create = async (data: {
  email: string;
  password: string;
  role: "admin" | "user";
}): Promise<User> => {
  const { email, password, role } = data;
  const result = await pool.query(
    "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
    [email, password, role]
  );
  return result.rows[0];
};