import { useEffect, useState } from "react";
import { Users, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  boutique_id: string | null;
}
interface BoutiqueOpt { id: string; nom: string; }
interface RoleRow { user_id: string; role: "admin" | "vendeur"; }

const UsersManager = () => {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [boutiques, setBoutiques] = useState<BoutiqueOpt[]>([]);
  const [roles, setRoles] = useState<Record<string, ("admin" | "vendeur")[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: pr }, { data: bo }, { data: ro }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, boutique_id").order("created_at", { ascending: false }),
      supabase.from("boutiques").select("id, nom").order("nom"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    setProfiles(pr ?? []);
    setBoutiques(bo ?? []);
    const map: Record<string, ("admin" | "vendeur")[]> = {};
    (ro as RoleRow[] | null)?.forEach((r) => {
      map[r.user_id] = [...(map[r.user_id] ?? []), r.role];
    });
    setRoles(map);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const assignBoutique = async (userId: string, boutiqueId: string) => {
    const value = boutiqueId === "none" ? null : boutiqueId;
    const { error } = await supabase.from("profiles").update({ boutique_id: value }).eq("id", userId);
    if (error) toast.error(error.message);
    else {
      toast.success("Boutique assignée");
      fetchAll();
    }
  };

  const changeRole = async (userId: string, newRole: "admin" | "vendeur") => {
    // Supprimer rôles existants puis insérer nouveau
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    if (error) toast.error(error.message);
    else {
      toast.success("Rôle mis à jour");
      fetchAll();
    }
  };

  const primaryRole = (uid: string): "admin" | "vendeur" => {
    const r = roles[uid] ?? [];
    return r.includes("admin") ? "admin" : "vendeur";
  };

  return (
    <Card className="p-6 shadow-card border-border/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl">Utilisateurs</h2>
          <p className="text-sm text-muted-foreground">
            {profiles.length} membre{profiles.length > 1 ? "s" : ""} · invitez-les à s'inscrire puis assignez leur boutique
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Chargement...</p>
      ) : profiles.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Aucun utilisateur pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Boutique</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((p) => {
                const role = primaryRole(p.id);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{p.email}</TableCell>
                    <TableCell>
                      <Select value={role} onValueChange={(v) => changeRole(p.id, v as "admin" | "vendeur")}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            <Badge variant={role === "admin" ? "default" : "secondary"} className="gap-1">
                              {role === "admin" && <Shield className="h-3 w-3" />}
                              {role}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="vendeur">Vendeur</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={p.boutique_id ?? "none"}
                        onValueChange={(v) => assignBoutique(p.id, v)}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Aucune" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucune</SelectItem>
                          {boutiques.map((b) => (
                            <SelectItem key={b.id} value={b.id}>{b.nom}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default UsersManager;
