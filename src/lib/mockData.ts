// Données factices pour la maquette front (pas de backend).

export type Role = "admin" | "vendeur" | "agent_inventaire" | "agent_simple" | "garde";

export const ROLES: { value: Role; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "vendeur", label: "Vendeur" },
  { value: "agent_inventaire", label: "Agent inventaire" },
  { value: "agent_simple", label: "Agent simple" },
  { value: "garde", label: "Garde" },
];

export const roleLabel = (r: Role) => ROLES.find((x) => x.value === r)?.label ?? r;

export type Devise = "USD" | "CDF" | "EUR";

export const DEVISES: { value: Devise; label: string; symbol: string }[] = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "CDF", label: "CDF (FC)", symbol: "FC" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
];

export const formatMoney = (amount: number, devise: Devise = "CDF") => {
  const sym = DEVISES.find((d) => d.value === devise)?.symbol ?? "";
  return `${new Intl.NumberFormat("fr-FR").format(amount)} ${sym}`;
};

export interface Boutique {
  id: string;
  nom: string;
  adresse: string | null;
  telephone: string | null;
}

export interface DossierFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export type Sexe = "M" | "F" | "AUTRE";

export const SEXES: { value: Sexe; label: string }[] = [
  { value: "M", label: "Masculin" },
  { value: "F", label: "Féminin" },
  { value: "AUTRE", label: "Autre" },
];

export const sexeLabel = (s?: Sexe | null) => SEXES.find((x) => x.value === s)?.label ?? "—";

export interface AppUser {
  id: string;
  full_name: string;
  email: string;
  telephone?: string | null;
  sexe?: Sexe | null;
  role: Role;
  boutique_id: string | null;
  dossier?: DossierFile | null;
}

export const mockBoutiques: Boutique[] = [
  { id: "b1", nom: "GAMA Plateau", adresse: "Avenue de la Mode, Abidjan", telephone: "+225 07 00 00 01" },
  { id: "b2", nom: "GAMA Cocody", adresse: "Boulevard Latrille, Cocody", telephone: "+225 07 00 00 02" },
  { id: "b3", nom: "GAMA Marcory", adresse: "Zone 4, Marcory", telephone: "+225 07 00 00 03" },
];

export const mockUsers: AppUser[] = [
  { id: "u1", full_name: "Aïcha Diallo", email: "aicha@gama.com", telephone: "+225 07 11 22 33", sexe: "F", role: "admin", boutique_id: null },
  { id: "u2", full_name: "Moussa Koné", email: "moussa@gama.com", telephone: "+225 07 44 55 66", sexe: "M", role: "vendeur", boutique_id: "b1" },
  { id: "u3", full_name: "Fatou Bamba", email: "fatou@gama.com", telephone: "+225 07 77 88 99", sexe: "F", role: "vendeur", boutique_id: "b2" },
  { id: "u4", full_name: "Ismaël Touré", email: "ismael@gama.com", telephone: null, sexe: "M", role: "vendeur", boutique_id: null },
];

export const currentMockUser: AppUser = mockUsers[0];

// Ventes
export interface Vente {
  id: string;
  boutique_id: string;
  montant: number;
  devise: Devise;
  date: string;
  article: string;
  code?: string;
  couleur?: string;
  quantite: number;
}

const today = new Date();
const d = (offset: number) => new Date(today.getTime() - offset * 86400000).toISOString();

export const mockVentes: Vente[] = [
  { id: "v1", boutique_id: "b1", montant: 45, devise: "USD", date: d(0), article: "Chemise lin", code: "CHM-001", couleur: "Blanc", quantite: 2 },
  { id: "v2", boutique_id: "b1", montant: 78000, devise: "CDF", date: d(1), article: "Veste cuir", code: "VES-014", couleur: "Noir", quantite: 1 },
  { id: "v3", boutique_id: "b2", montant: 110, devise: "EUR", date: d(0), article: "Robe soirée", code: "ROB-022", couleur: "Doré", quantite: 2 },
  { id: "v4", boutique_id: "b2", montant: 32000, devise: "CDF", date: d(2), article: "T-shirt premium", code: "TSH-099", couleur: "Blanc", quantite: 4 },
  { id: "v5", boutique_id: "b3", montant: 56, devise: "USD", date: d(1), article: "Jean slim", code: "JEA-045", couleur: "Bleu", quantite: 2 },
  { id: "v6", boutique_id: "b1", montant: 89000, devise: "CDF", date: d(3), article: "Costume 2 pièces", code: "CST-002", couleur: "Gris", quantite: 1 },
  { id: "v7", boutique_id: "b3", montant: 145, devise: "USD", date: d(0), article: "Manteau laine", code: "MNT-003", couleur: "Camel", quantite: 1 },
  { id: "v8", boutique_id: "b2", montant: 67000, devise: "CDF", date: d(4), article: "Ensemble bogolan", code: "ENS-031", couleur: "Indigo", quantite: 1 },
  { id: "v9", boutique_id: "b1", montant: 34, devise: "EUR", date: d(5), article: "Polo coton", code: "POL-007", couleur: "Orange", quantite: 3 },
  { id: "v10", boutique_id: "b3", montant: 92, devise: "USD", date: d(2), article: "Sneakers édition", code: "SNK-Ed1", couleur: "Noir/Orange", quantite: 1 },
];

// Dépenses & Entrées (Finances)
export interface Depense {
  id: string;
  boutique_id: string;
  libelle: string;
  montant: number;
  devise: Devise;
  date: string;
  categorie: "loyer" | "salaire" | "achat" | "autre";
  type: "entree" | "sortie";
}

export const mockDepenses: Depense[] = [
  { id: "dp1", boutique_id: "b1", libelle: "Loyer mensuel", montant: 150000, devise: "CDF", date: d(2), categorie: "loyer", type: "sortie" },
  { id: "dp2", boutique_id: "b1", libelle: "Réassort tissus", montant: 80, devise: "USD", date: d(4), categorie: "achat", type: "sortie" },
  { id: "dp3", boutique_id: "b2", libelle: "Salaire vendeuse", montant: 120000, devise: "CDF", date: d(1), categorie: "salaire", type: "sortie" },
  { id: "dp4", boutique_id: "b2", libelle: "Sacs emballage", montant: 25, devise: "EUR", date: d(3), categorie: "achat", type: "sortie" },
  { id: "dp5", boutique_id: "b3", libelle: "Loyer mensuel", montant: 180000, devise: "CDF", date: d(2), categorie: "loyer", type: "sortie" },
  { id: "dp6", boutique_id: "b3", libelle: "Publicité Instagram", montant: 40, devise: "USD", date: d(5), categorie: "autre", type: "sortie" },
  { id: "dp7", boutique_id: "b1", libelle: "Apport associé", montant: 500, devise: "USD", date: d(6), categorie: "autre", type: "entree" },
  { id: "dp8", boutique_id: "b2", libelle: "Remboursement client", montant: 50, devise: "EUR", date: d(7), categorie: "autre", type: "entree" },
];

// Articles enrichis
export type Categorie = "PRET_A_PORTER" | "ACCESSOIRE" | "CHAUSSURE" | "TRADITIONNEL" | "AUTRE";
export type StatutArticle = "EN_STOCK" | "RUPTURE" | "RESERVE" | "RETIRE";

export const CATEGORIES: { value: Categorie; label: string }[] = [
  { value: "PRET_A_PORTER", label: "Prêt-à-porter" },
  { value: "ACCESSOIRE", label: "Accessoire" },
  { value: "CHAUSSURE", label: "Chaussure" },
  { value: "TRADITIONNEL", label: "Traditionnel" },
  { value: "AUTRE", label: "Autre" },
];

export const STATUTS: { value: StatutArticle; label: string }[] = [
  { value: "EN_STOCK", label: "En stock" },
  { value: "RUPTURE", label: "Rupture" },
  { value: "RESERVE", label: "Réservé" },
  { value: "RETIRE", label: "Retiré" },
];

export interface Promotion {
  id: string;
  libelle: string;
  pourcentage: number;
  dateDebut: string;
  dateFin: string;
}

export interface Article {
  id: string;
  boutique_id: string;
  code: string;
  nom: string;
  description?: string | null;
  photo?: string | null;
  categorie: Categorie;
  couleur: string;
  observation?: string | null;
  statut: StatutArticle;
  taille?: string | null;
  serie?: string | null;
  demiSerie: boolean;
  prix: number;
  devise?: Devise;
  quantiteEntree: number;
  quantiteVendue: number;
  quantiteRestante: number;
  dateEntreeStock: string;
  promotions: Promotion[];
}

export const mockArticles: Article[] = [
  {
    id: "a1", boutique_id: "b1", code: "CHM-001", nom: "Chemise lin blanc", categorie: "PRET_A_PORTER",
    couleur: "Blanc", taille: "L", serie: "Été 2026", demiSerie: false, statut: "EN_STOCK",
    photo: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    prix: 22500, quantiteEntree: 30, quantiteVendue: 6, quantiteRestante: 24, dateEntreeStock: d(10),
    promotions: [{ id: "p1", libelle: "Soldes été", pourcentage: 15, dateDebut: d(5), dateFin: d(-10) }],
  },
  {
    id: "a2", boutique_id: "b1", code: "VES-014", nom: "Veste cuir noir", categorie: "PRET_A_PORTER",
    couleur: "Noir", taille: "M", serie: null, demiSerie: false, statut: "EN_STOCK",
    photo: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    prix: 78000, quantiteEntree: 10, quantiteVendue: 4, quantiteRestante: 6, dateEntreeStock: d(8),
    promotions: [],
  },
  {
    id: "a3", boutique_id: "b1", code: "POL-007", nom: "Polo coton GAMA", categorie: "PRET_A_PORTER",
    couleur: "Orange", taille: "XL", serie: "Capsule", demiSerie: true, statut: "RESERVE",
    photo: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80",
    prix: 12500, quantiteEntree: 50, quantiteVendue: 10, quantiteRestante: 40, dateEntreeStock: d(3),
    promotions: [],
  },
  {
    id: "a4", boutique_id: "b2", code: "ROB-022", nom: "Robe soirée dorée", categorie: "PRET_A_PORTER",
    couleur: "Doré", taille: "S", serie: "Gala", demiSerie: false, statut: "EN_STOCK",
    photo: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    prix: 60000, quantiteEntree: 12, quantiteVendue: 4, quantiteRestante: 8, dateEntreeStock: d(12),
    promotions: [],
  },
  {
    id: "a5", boutique_id: "b2", code: "ENS-031", nom: "Ensemble bogolan", categorie: "TRADITIONNEL",
    couleur: "Indigo", taille: "M", serie: null, demiSerie: false, statut: "EN_STOCK",
    photo: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    prix: 67000, quantiteEntree: 20, quantiteVendue: 5, quantiteRestante: 15, dateEntreeStock: d(6),
    promotions: [{ id: "p2", libelle: "Promo Tabaski", pourcentage: 10, dateDebut: d(2), dateFin: d(-5) }],
  },
  {
    id: "a6", boutique_id: "b2", code: "TSH-099", nom: "T-shirt premium", categorie: "PRET_A_PORTER",
    couleur: "Blanc", taille: "L", serie: null, demiSerie: false, statut: "RUPTURE",
    photo: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    prix: 8000, quantiteEntree: 40, quantiteVendue: 40, quantiteRestante: 0, dateEntreeStock: d(2),
    promotions: [],
  },
  {
    id: "a7", boutique_id: "b3", code: "MNT-003", nom: "Manteau laine", categorie: "PRET_A_PORTER",
    couleur: "Camel", taille: "M", serie: "Hiver", demiSerie: false, statut: "EN_STOCK",
    photo: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&q=80",
    prix: 145000, quantiteEntree: 6, quantiteVendue: 2, quantiteRestante: 4, dateEntreeStock: d(15),
    promotions: [],
  },
  {
    id: "a8", boutique_id: "b3", code: "JEA-045", nom: "Jean slim", categorie: "PRET_A_PORTER",
    couleur: "Bleu", taille: "32", serie: null, demiSerie: false, statut: "EN_STOCK",
    photo: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    prix: 28000, quantiteEntree: 30, quantiteVendue: 8, quantiteRestante: 22, dateEntreeStock: d(7),
    promotions: [],
  },
  {
    id: "a9", boutique_id: "b3", code: "SNK-Ed1", nom: "Sneakers édition", categorie: "CHAUSSURE",
    couleur: "Noir/Orange", taille: "42", serie: "Édition limitée", demiSerie: false, statut: "RETIRE",
    photo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    prix: 92000, quantiteEntree: 15, quantiteVendue: 4, quantiteRestante: 11, dateEntreeStock: d(4),
    promotions: [],
  },
];
