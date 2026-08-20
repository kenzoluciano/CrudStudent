import * as etudiantsRepository from "../repositories/etudiantRepository";
import { Etudiant, EtudiantInput, EtudiantPartialInput } from "../models/etudiantModels";

export class AppError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmailFormat = (email: string) => {
  if (!EMAIL_REGEX.test(email)) {
    throw new AppError("Format d'email invalide", 400);
  }
};

const checkEmailUnique = async (email: string, excludeId?: number) => {
  const existing = await etudiantsRepository.findByEmail(email);
  if (existing && existing.id !== excludeId) {
    throw new AppError("Cet email est déjà utilisé", 409);
  }
};

const validateRequiredFields = (data: Partial<EtudiantInput>) => {
  if (!data.nom || !data.prenom || !data.email) {
    throw new AppError("nom, prenom et email sont obligatoires", 400);
  }
  validateEmailFormat(data.email);
};

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

export const createEtudiant = async (data: EtudiantInput): Promise<Etudiant> => {
  validateRequiredFields(data);
  await checkEmailUnique(data.email);
  return etudiantsRepository.create(data);
};

export const updateEtudiant = async (id: number, data: EtudiantInput): Promise<Etudiant> => {
  validateRequiredFields(data);
  await checkEmailUnique(data.email, id);

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

  if (fields.email) {
    validateEmailFormat(fields.email);
    await checkEmailUnique(fields.email, id);
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

export interface EtudiantsStats {
  total: number;
  parTrancheAge: {
    "moins_de_18": number;
    "18_a_25": number;
    "26_a_35": number;
    "plus_de_35": number;
    "inconnu": number;
  };
}

const calculateAge = (dateNaissance: Date): number => {
  const today = new Date();
  const birth = new Date(dateNaissance);
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age--;
  return age;
};

export const getEtudiantsStats = async (): Promise<EtudiantsStats> => {
  const total = await etudiantsRepository.count();
  const birthDates = await etudiantsRepository.findAllBirthDates();

  const parTrancheAge = {
    moins_de_18: 0,
    "18_a_25": 0,
    "26_a_35": 0,
    plus_de_35: 0,
    inconnu: 0,
  };

  for (const dateNaissance of birthDates) {
    if (!dateNaissance) {
      parTrancheAge.inconnu++;
      continue;
    }
    const age = calculateAge(dateNaissance);
    if (age < 18) parTrancheAge.moins_de_18++;
    else if (age <= 25) parTrancheAge["18_a_25"]++;
    else if (age <= 35) parTrancheAge["26_a_35"]++;
    else parTrancheAge.plus_de_35++;
  }

  return { total, parTrancheAge };
};