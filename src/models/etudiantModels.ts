export interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  date_naissance: Date | null;
}

export type EtudiantInput = Omit<Etudiant, "id">;

export type EtudiantPartialInput = Partial<EtudiantInput>;