// Données factices pour la maquette front (pas de backend).

export type Role = "admin" | "vendeur";

export interface Boutique {
  id: string;
  nom: string;
  adresse: string | null;
  telephone: string | null;
}

export interface AppUser {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  boutique_id: string | null;
}

export const mockBoutiques: Boutique[] = [
  { id: "b1", nom: "GAMA Plateau", adresse: "Avenue de la Mode, Abidjan", telephone: "+225 07 00 00 01" },
  { id: "b2", nom: "GAMA Cocody", adresse: "Boulevard Latrille, Cocody", telephone: "+225 07 00 00 02" },
  { id: "b3", nom: "GAMA Marcory", adresse: "Zone 4, Marcory", telephone: "+225 07 00 00 03" },
];

export const mockUsers: AppUser[] = [
  { id: "u1", full_name: "Aïcha Diallo", email: "aicha@gama.com", role: "admin", boutique_id: null },
  { id: "u2", full_name: "Moussa Koné", email: "moussa@gama.com", role: "vendeur", boutique_id: "b1" },
  { id: "u3", full_name: "Fatou Bamba", email: "fatou@gama.com", role: "vendeur", boutique_id: "b2" },
  { id: "u4", full_name: "Ismaël Touré", email: "ismael@gama.com", role: "vendeur", boutique_id: null },
];

// "Utilisateur connecté" simulé — change cette valeur pour basculer la vue
export const currentMockUser: AppUser = mockUsers[0]; // admin par défaut

// Ventes factices par boutique (maquette)
export interface Vente {
  id: string;
  boutique_id: string;
  montant: number; // en FCFA
  date: string; // ISO
}

const today = new Date();
const d = (offset: number) => new Date(today.getTime() - offset * 86400000).toISOString();

export const mockVentes: Vente[] = [
  { id: "v1", boutique_id: "b1", montant: 45000, date: d(0) },
  { id: "v2", boutique_id: "b1", montant: 78000, date: d(1) },
  { id: "v3", boutique_id: "b2", montant: 120000, date: d(0) },
  { id: "v4", boutique_id: "b2", montant: 32000, date: d(2) },
  { id: "v5", boutique_id: "b3", montant: 56000, date: d(1) },
  { id: "v6", boutique_id: "b1", montant: 89000, date: d(3) },
  { id: "v7", boutique_id: "b3", montant: 145000, date: d(0) },
  { id: "v8", boutique_id: "b2", montant: 67000, date: d(4) },
  { id: "v9", boutique_id: "b1", montant: 34000, date: d(5) },
  { id: "v10", boutique_id: "b3", montant: 92000, date: d(2) },
];
