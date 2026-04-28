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
  article: string;
  quantite: number;
}

const today = new Date();
const d = (offset: number) => new Date(today.getTime() - offset * 86400000).toISOString();

export const mockVentes: Vente[] = [
  { id: "v1", boutique_id: "b1", montant: 45000, date: d(0), article: "Chemise lin", quantite: 2 },
  { id: "v2", boutique_id: "b1", montant: 78000, date: d(1), article: "Veste cuir", quantite: 1 },
  { id: "v3", boutique_id: "b2", montant: 120000, date: d(0), article: "Robe soirée", quantite: 2 },
  { id: "v4", boutique_id: "b2", montant: 32000, date: d(2), article: "T-shirt premium", quantite: 4 },
  { id: "v5", boutique_id: "b3", montant: 56000, date: d(1), article: "Jean slim", quantite: 2 },
  { id: "v6", boutique_id: "b1", montant: 89000, date: d(3), article: "Costume 2 pièces", quantite: 1 },
  { id: "v7", boutique_id: "b3", montant: 145000, date: d(0), article: "Manteau laine", quantite: 1 },
  { id: "v8", boutique_id: "b2", montant: 67000, date: d(4), article: "Ensemble bogolan", quantite: 1 },
  { id: "v9", boutique_id: "b1", montant: 34000, date: d(5), article: "Polo coton", quantite: 3 },
  { id: "v10", boutique_id: "b3", montant: 92000, date: d(2), article: "Sneakers édition", quantite: 1 },
];

// Dépenses (sorties) par boutique
export interface Depense {
  id: string;
  boutique_id: string;
  libelle: string;
  montant: number;
  date: string;
  categorie: "loyer" | "salaire" | "achat" | "autre";
}

export const mockDepenses: Depense[] = [
  { id: "dp1", boutique_id: "b1", libelle: "Loyer mensuel", montant: 150000, date: d(2), categorie: "loyer" },
  { id: "dp2", boutique_id: "b1", libelle: "Réassort tissus", montant: 80000, date: d(4), categorie: "achat" },
  { id: "dp3", boutique_id: "b2", libelle: "Salaire vendeuse", montant: 120000, date: d(1), categorie: "salaire" },
  { id: "dp4", boutique_id: "b2", libelle: "Sacs emballage", montant: 25000, date: d(3), categorie: "achat" },
  { id: "dp5", boutique_id: "b3", libelle: "Loyer mensuel", montant: 180000, date: d(2), categorie: "loyer" },
  { id: "dp6", boutique_id: "b3", libelle: "Publicité Instagram", montant: 40000, date: d(5), categorie: "autre" },
];

// Articles d'inventaire par boutique
export interface Article {
  id: string;
  boutique_id: string;
  nom: string;
  categorie: string;
  stock: number;
  prix: number;
  date_ajout: string;
}

export const mockArticles: Article[] = [
  { id: "a1", boutique_id: "b1", nom: "Chemise lin blanc", categorie: "Homme", stock: 24, prix: 22500, date_ajout: d(10) },
  { id: "a2", boutique_id: "b1", nom: "Veste cuir noir", categorie: "Homme", stock: 6, prix: 78000, date_ajout: d(8) },
  { id: "a3", boutique_id: "b1", nom: "Polo coton GAMA", categorie: "Homme", stock: 40, prix: 12500, date_ajout: d(3) },
  { id: "a4", boutique_id: "b2", nom: "Robe soirée dorée", categorie: "Femme", stock: 8, prix: 60000, date_ajout: d(12) },
  { id: "a5", boutique_id: "b2", nom: "Ensemble bogolan", categorie: "Femme", stock: 15, prix: 67000, date_ajout: d(6) },
  { id: "a6", boutique_id: "b2", nom: "T-shirt premium", categorie: "Unisexe", stock: 32, prix: 8000, date_ajout: d(2) },
  { id: "a7", boutique_id: "b3", nom: "Manteau laine", categorie: "Femme", stock: 4, prix: 145000, date_ajout: d(15) },
  { id: "a8", boutique_id: "b3", nom: "Jean slim", categorie: "Unisexe", stock: 22, prix: 28000, date_ajout: d(7) },
  { id: "a9", boutique_id: "b3", nom: "Sneakers édition", categorie: "Unisexe", stock: 11, prix: 92000, date_ajout: d(4) },
];
