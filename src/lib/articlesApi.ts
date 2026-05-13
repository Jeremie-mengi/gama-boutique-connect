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

export interface CreateArticleApiResponse {
  message: string;
  data: {
    id: string;
    code: string;
    nom: string;
    description: string | null;
    photo: string | null;
    categorie: string;
    couleur: string;
    observation: string | null;
    qrcode: string;
    statut: string;
    createdAt: string;
    updatedAt: string;
    prix: unknown[];
    variations: unknown[];
  };
}

export const createArticleApi = async (payload: CreateArticleApiPayload) => {
  const { data } = await api.post<CreateArticleApiResponse>("/articles/create", payload);
  return data.data;
};

/** Convertit la réponse API en Article local pour l'affichage. */
export const apiArticleToLocal = (
  api: CreateArticleApiResponse["data"],
  extras: {
    boutique_id: string;
    prix: number;
    devise: Article["devise"];
    quantiteEntree: number;
    promotions: Promotion[];
  }
): Article => ({
  id: api.id,
  boutique_id: extras.boutique_id,
  code: api.code,
  nom: api.nom,
  description: api.description,
  photo: api.photo ?? api.qrcode ?? null,
  categorie: api.categorie as Article["categorie"],
  couleur: api.couleur,
  observation: api.observation,
  statut: api.statut as Article["statut"],
  taille: null,
  serie: null,
  demiSerie: false,
  prix: extras.prix,
  devise: extras.devise,
  quantiteEntree: extras.quantiteEntree,
  quantiteVendue: 0,
  quantiteRestante: extras.quantiteEntree,
  dateEntreeStock: api.createdAt,
  promotions: extras.promotions,
});
