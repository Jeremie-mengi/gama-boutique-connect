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
