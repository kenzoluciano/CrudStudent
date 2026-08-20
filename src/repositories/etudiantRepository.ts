import pool from "../db/pool";
import { Etudiant, EtudiantInput, EtudiantPartialInput } from "../models/etudiantModels";

export const findAll = async (): Promise<Etudiant[]> => {
  const result = await pool.query("SELECT * FROM etudiants ORDER BY id");
  return result.rows;
};

export const findById = async (id: number): Promise<Etudiant | null> => {
  const result = await pool.query("SELECT * FROM etudiants WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const findByEmail = async (email: string): Promise<Etudiant | null> => {
  const result = await pool.query("SELECT * FROM etudiants WHERE email = $1", [email]);
  return result.rows[0] || null;
};

export const create = async (data: EtudiantInput): Promise<Etudiant> => {
  const { nom, prenom, email, date_naissance } = data;
  const result = await pool.query(
    "INSERT INTO etudiants (nom, prenom, email, date_naissance) VALUES ($1, $2, $3, $4) RETURNING *",
    [nom, prenom, email, date_naissance]
  );
  return result.rows[0];
};

export const update = async (id: number, data: EtudiantInput): Promise<Etudiant | null> => {
  const { nom, prenom, email, date_naissance } = data;
  const result = await pool.query(
    "UPDATE etudiants SET nom = $1, prenom = $2, email = $3, date_naissance = $4 WHERE id = $5 RETURNING *",
    [nom, prenom, email, date_naissance, id]
  );
  return result.rows[0] || null;
};

export const patch = async (id: number, fields: EtudiantPartialInput): Promise<Etudiant | null> => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

  const result = await pool.query(
    `UPDATE etudiants SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );
  return result.rows[0] || null;
};

export const remove = async (id: number): Promise<Etudiant | null> => {
  const result = await pool.query("DELETE FROM etudiants WHERE id = $1 RETURNING *", [id]);
  return result.rows[0] || null;
};

export const count = async (): Promise<number> => {
  const result = await pool.query("SELECT COUNT(*) FROM etudiants");
  return parseInt(result.rows[0].count, 10);
};

export const findAllBirthDates = async (): Promise<(Date | null)[]> => {
  const result = await pool.query("SELECT date_naissance FROM etudiants");
  return result.rows.map((row) => row.date_naissance);
};