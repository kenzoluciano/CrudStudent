import { Request, Response, NextFunction } from "express";
import pool from "../db/pool";

export const getAllEtudiants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query("SELECT * FROM etudiants ORDER BY id");
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getEtudiantById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM etudiants WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createEtudiant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nom, prenom, email, date_naissance } = req.body;

    if (!nom || !prenom || !email) {
      return res.status(400).json({ message: "nom, prenom et email sont obligatoires" });
    }

    const result = await pool.query(
      "INSERT INTO etudiants (nom, prenom, email, date_naissance) VALUES ($1, $2, $3, $4) RETURNING *",
      [nom, prenom, email, date_naissance]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};


export const updateEtudiant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, date_naissance } = req.body;

    if (!nom || !prenom || !email) {
      return res.status(400).json({ message: "nom, prenom et email sont obligatoires" });
    }

    const result = await pool.query(
      "UPDATE etudiants SET nom = $1, prenom = $2, email = $3, date_naissance = $4 WHERE id = $5 RETURNING *",
      [nom, prenom, email, date_naissance, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};


export const patchEtudiant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    const keys = Object.keys(fields);
    if (keys.length === 0) {
      return res.status(400).json({ message: "Aucun champ à modifier" });
    }

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
    const values = Object.values(fields);

    const result = await pool.query(
      `UPDATE etudiants SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteEtudiant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM etudiants WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
