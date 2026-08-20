import { Request, Response, NextFunction } from "express";
import * as etudiantsService from "../services/etudiantService";

export const getAllEtudiants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const etudiants = await etudiantsService.getAllEtudiants();
    res.status(200).json(etudiants);
  } catch (err) {
    next(err);
  }
};

export const getEtudiantById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const etudiant = await etudiantsService.getEtudiantById(id);
    res.status(200).json(etudiant);
  } catch (err) {
    next(err);
  }
};

export const createEtudiant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const etudiant = await etudiantsService.createEtudiant(req.body);
    res.status(201).json(etudiant);
  } catch (err) {
    next(err);
  }
};

export const updateEtudiant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const etudiant = await etudiantsService.updateEtudiant(id, req.body);
    res.status(200).json(etudiant);
  } catch (err) {
    next(err);
  }
};

export const patchEtudiant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const etudiant = await etudiantsService.patchEtudiant(id, req.body);
    res.status(200).json(etudiant);
  } catch (err) {
    next(err);
  }
};

export const deleteEtudiant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await etudiantsService.deleteEtudiant(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};