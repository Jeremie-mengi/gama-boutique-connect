import { api } from "./api";
import type { Article, Promotion } from "./mockData";

/**
 * Backend article create payload.
 * - boutiqueId : envoyé dans le body (champ exact attendu par l'API).
 * - utilisateur créateur : déduit automatiquement par le backend depuis le Bearer token.
 */
export interface CreateArticleApiPayload {
  boutiqueId: string;
  code: string;
  nom: string;
  couleur: string;
  categorie: string;
  description?: string | null;
  photo?: string | null;
  observation?: string | null;
  statut?: string;
  taille?: string | null;
  serie?: string | null;
  demiSerie?: boolean;
}

export interface ApiArticle {
  id: string;
  code: string;
  nom: string;
  description: string | null;
  photo: string | null;
  categorie: string;
  couleur: string;
  observation: string | null;
  qrcode?: string;
  statut: string;
  createdAt: string;
  updatedAt: string;
  prix?: any[];
  variations?: any[];
  boutique?: { id: string; nom?: string } | null;
  boutiqueId?: string | null;
  taille?: string | null;
  serie?: string | null;
  demiSerie?: boolean;
}

export interface CreateArticleApiResponse {
  message: string;
  data: ApiArticle;
}

export const createArticleApi = async (payload: CreateArticleApiPayload) => {
  const { data } = await api.post<CreateArticleApiResponse>("/articles/create", payload);
  return data.data;
};

export const fetchAllArticlesApi = async (): Promise<ApiArticle[]> => {
  const { data } = await api.get<{ data: ApiArticle[] }>("/articles/all");
  return data.data ?? [];
};

/** Convertit un article API en Article local pour l'affichage. */
export const apiArticleToLocal = (
  a: ApiArticle,
  extras?: {
    boutique_id?: string;
    prix?: number;
    devise?: Article["devise"];
    quantiteEntree?: number;
    promotions?: Promotion[];
  }
): Article => {
  const firstPrix = Array.isArray(a.prix) && a.prix.length > 0 ? a.prix[0] : null;
  const prixMontant =
    extras?.prix ??
    (firstPrix && typeof firstPrix === "object"
      ? Number(firstPrix.montant ?? firstPrix.prix ?? 0)
      : 0);
  const devise =
    extras?.devise ??
    ((firstPrix && typeof firstPrix === "object" ? firstPrix.devise : null) ?? "CDF");

  const qEntree = extras?.quantiteEntree ?? 0;

  return {
    id: a.id,
    boutique_id: extras?.boutique_id ?? a.boutique?.id ?? a.boutiqueId ?? "",
    code: a.code,
    nom: a.nom,
    description: a.description,
    photo: a.photo ?? a.qrcode ?? null,
    categorie: a.categorie as Article["categorie"],
    couleur: a.couleur,
    observation: a.observation,
    statut: a.statut as Article["statut"],
    taille: a.taille ?? null,
    serie: a.serie ?? null,
    demiSerie: !!a.demiSerie,
    prix: prixMontant,
    devise: devise as Article["devise"],
    quantiteEntree: qEntree,
    quantiteVendue: 0,
    quantiteRestante: qEntree,
    dateEntreeStock: a.createdAt,
    promotions: extras?.promotions ?? [],
  };
};
