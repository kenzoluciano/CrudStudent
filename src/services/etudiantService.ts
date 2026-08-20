import * as etudiantsRepository from "../repositories/etudiantRepository";
import { Etudiant, EtudiantInput, EtudiantPartialInput } from "../models/etudiantModels";

export class AppError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const getAllEtudiants = async (): Promise<Etudiant[]> => {
  return etudiantsRepository.findAll();
};

export const getEtudiantById = async (id: number): Promise<Etudiant> => {
  const etudiant = await etudiantsRepository.findById(id);
  if (!etudiant) {
    throw new AppError("Étudiant non trouvé", 404);
  }
  return etudiant;
};

const validateRequiredFields = (data: Partial<EtudiantInput>) => {
  if (!data.nom || !data.prenom || !data.email) {
    throw new AppError("nom, prenom et email sont obligatoires", 400);
  }
};

export const createEtudiant = async (data: EtudiantInput): Promise<Etudiant> => {
  validateRequiredFields(data);
  return etudiantsRepository.create(data);
};

export const updateEtudiant = async (id: number, data: EtudiantInput): Promise<Etudiant> => {
  validateRequiredFields(data);

  const updated = await etudiantsRepository.update(id, data);
  if (!updated) {
    throw new AppError("Étudiant non trouvé", 404);
  }
  return updated;
};

export const patchEtudiant = async (id: number, fields: EtudiantPartialInput): Promise<Etudiant> => {
  const keys = Object.keys(fields);
  if (keys.length === 0) {
    throw new AppError("Aucun champ à modifier", 400);
  }

  const updated = await etudiantsRepository.patch(id, fields);
  if (!updated) {
    throw new AppError("Étudiant non trouvé", 404);
  }
  return updated;
};

export const deleteEtudiant = async (id: number): Promise<void> => {
  const deleted = await etudiantsRepository.remove(id);
  if (!deleted) {
    throw new AppError("Étudiant non trouvé", 404);
  }
};