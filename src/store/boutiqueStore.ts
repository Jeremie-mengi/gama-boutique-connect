import { create } from "zustand";
import { api } from "@/lib/api";
import { useAuthStore } from "./authStore";

/* =========================
   TYPES
========================= */

export interface Boutique {
  id: string;
  nom: string;
  adresse: string | null;
  telephone: string | null;
  emplacement?: string | null;

  user?: any;

  articles: any[];
  ventes: any[];
  transactions: any[];
  rapports: any[];
  inventaires: any[];
  mouvements: any[];

  createdAt?: string;
  updatedAt?: string;
}

interface CreateBoutiqueDTO {
  nom: string;
  emplacement: string;
  userId: string;
}

interface UpdateBoutiqueDTO {
  nom: string;
  emplacement: string;
}

/* =========================
   STORE TYPE
========================= */

interface BoutiqueStore {
  boutiques: Boutique[];
  loading: boolean;
  error: string | null;

  /* actions */
  fetchBoutiques: () => Promise<void>;
  createBoutique: (data: Omit<CreateBoutiqueDTO, 'userId'>) => Promise<void>;
  updateBoutique: (id: string, data: UpdateBoutiqueDTO) => Promise<void>;
  deleteBoutique: (id: string) => Promise<void>;
  getBoutiqueById: (id: string) => Boutique | undefined;

  /* computed helpers */
  getAllArticles: () => any[];
  getAllVentes: () => any[];
  getAllInventaires: () => any[];
}

/* =========================
   STORE
========================= */

export const useBoutiqueStore = create<BoutiqueStore>(
  (set, get) => ({
    boutiques: [],
    loading: false,
    error: null,

    /* =========================
       FETCH ALL BOUTIQUES
    ========================= */
    fetchBoutiques: async () => {
      try {
        set({ loading: true, error: null });

        const response = await api.get("/boutiques/all");

        const formatted: Boutique[] = response.data.data.map((b: any) => ({
          id: b.id,
          nom: b.nom,
          adresse: b.emplacement,
          emplacement: b.emplacement,
          telephone: b.user?.telephone || null,

          user: b.user,

          articles: b.articles || [],
          ventes: b.ventes || [],
          transactions: b.transactions || [],
          rapports: b.rapports || [],
          inventaires: b.inventaires || [],
          mouvements: b.mouvements || [],

          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
        }));

        set({ boutiques: formatted });
      } catch (error: any) {
        console.error("fetchBoutiques error:", error);

        set({
          error: error?.message || "Erreur lors du chargement des boutiques",
        });
      } finally {
        set({ loading: false });
      }
    },

    /* =========================
       CREATE BOUTIQUE
    ========================= */
    createBoutique: async (data) => {
      try {
        set({ loading: true, error: null });

        // Get the current user from auth store
        const { user } = useAuthStore.getState();
        
        if (!user) {
          throw new Error("Utilisateur non connecté");
        }

        const payload: CreateBoutiqueDTO = {
          nom: data.nom,
          emplacement: data.emplacement,
          userId: user.id,
        };

        const response = await api.post("/boutiques/create", payload);

        // Refresh the list
        await get().fetchBoutiques();
        
        return response.data;
      } catch (error: any) {
        console.error("createBoutique error:", error);

        set({
          error: error?.message || "Erreur lors de la création",
        });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    /* =========================
       UPDATE BOUTIQUE
    ========================= */
    updateBoutique: async (id, data) => {
      try {
        set({ loading: true, error: null });

        const response = await api.patch(`/boutiques/${id}`, data);

        // Refresh the list to get updated data
        await get().fetchBoutiques();
        
        return response.data;
      } catch (error: any) {
        console.error("updateBoutique error:", error);

        set({
          error: error?.message || "Erreur lors de la mise à jour",
        });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    /* =========================
       DELETE BOUTIQUE
    ========================= */
    deleteBoutique: async (id) => {
      try {
        set({ loading: true, error: null });

        const response = await api.delete(`/boutiques/${id}`);

        // Update local state optimistically
        set({ boutiques: get().boutiques.filter(b => b.id !== id) });
        
        return response.data;
      } catch (error: any) {
        console.error("deleteBoutique error:", error);

        set({
          error: error?.message || "Erreur lors de la suppression",
        });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    /* =========================
       GET ONE BOUTIQUE
    ========================= */
    getBoutiqueById: (id) => {
      return get().boutiques.find((b) => b.id === id);
    },

    /* =========================
       HELPERS / COMPUTED
    ========================= */
    getAllArticles: () => {
      return get().boutiques.flatMap((b) => b.articles);
    },

    getAllVentes: () => {
      return get().boutiques.flatMap((b) => b.ventes);
    },

    getAllInventaires: () => {
      return get().boutiques.flatMap((b) => b.inventaires);
    },
  })
);