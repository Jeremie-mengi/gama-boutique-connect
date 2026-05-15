import { api } from "./api";
import type { AppUser, Role, Sexe } from "./mockData";

export interface ApiUser {
  id: string;
  nom: string;
  email: string;
  telephone?: string | null;
  sexe?: string | null;
  role?: string | null;
  dossier?: string | null;
  boutique?: { id: string }[] | null;
  createdAt?: string;
  updatedAt?: string;
}

const sexeFromApi = (s?: string | null): Sexe => {
  if (!s) return "M";
  const v = s.toLowerCase();
  if (v.startsWith("m")) return "M";
  if (v.startsWith("f")) return "F";
  return "AUTRE";
};
const sexeToApi = (s?: Sexe | null): string => {
  if (s === "F") return "Feminin";
  if (s === "AUTRE") return "Autre";
  return "Masculin";
};

const roleFromApi = (r?: string | null): Role => {
  const v = (r ?? "").toLowerCase();
  if (v === "admin") return "admin";
  if (v === "vendeur") return "vendeur";
  if (v === "agent_inventaire" || v === "agent inventaire") return "agent_inventaire";
  if (v === "agent_simple" || v === "agent simple") return "agent_simple";
  if (v === "garde") return "garde";
  return "vendeur";
};
const roleToApi = (r: Role): string => {
  switch (r) {
    case "admin": return "ADMIN";
    case "vendeur": return "VENDEUR";
    case "agent_inventaire": return "AGENT_INVENTAIRE";
    case "agent_simple": return "AGENT_SIMPLE";
    case "garde": return "GARDE";
  }
};

export const apiUserToLocal = (u: ApiUser): AppUser => ({
  id: u.id,
  full_name: u.nom,
  email: u.email,
  telephone: u.telephone ?? null,
  sexe: sexeFromApi(u.sexe),
  role: roleFromApi(u.role),
  boutique_id: u.boutique && u.boutique.length > 0 ? u.boutique[0].id : null,
  dossier: u.dossier
    ? { name: u.dossier, size: 0, type: "", uploadedAt: u.updatedAt ?? new Date().toISOString() }
    : null,
});

export async function fetchAllUsers(): Promise<AppUser[]> {
  const res = await api.get("/user/all");
  const data: ApiUser[] = res.data?.data ?? [];
  return data.map(apiUserToLocal);
}

export async function fetchUser(id: string): Promise<AppUser> {
  const res = await api.get(`/user/${id}`);
  return apiUserToLocal(res.data?.data);
}

export interface UpdateUserPayload {
  nom?: string;
  email?: string;
  telephone?: string | null;
  sexe?: Sexe | null;
  role?: Role;
}

export async function updateUserApi(id: string, patch: UpdateUserPayload): Promise<AppUser> {
  const body: Record<string, unknown> = {};
  if (patch.nom !== undefined) body.nom = patch.nom;
  if (patch.email !== undefined) body.email = patch.email;
  if (patch.telephone !== undefined) body.telephone = patch.telephone;
  if (patch.sexe !== undefined) body.sexe = sexeToApi(patch.sexe);
  if (patch.role !== undefined) body.role = roleToApi(patch.role);
  const res = await api.patch(`/user/${id}`, body);
  return apiUserToLocal(res.data?.data ?? { id, nom: patch.nom ?? "", email: patch.email ?? "" });
}

export async function deleteUserApi(id: string): Promise<void> {
  await api.delete(`/user/${id}`);
}
