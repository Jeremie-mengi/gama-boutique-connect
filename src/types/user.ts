export interface ApiBoutique {
  id: string;
  nom: string;
  emplacement: string;
  userId: string;

  createdAt: string;
  updatedAt: string;
}

export interface ApiUser {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  sexe: string;
  role: string;
  dossier: string | null;

  createdAt: string;
  updatedAt: string;

  boutique: ApiBoutique[];
}