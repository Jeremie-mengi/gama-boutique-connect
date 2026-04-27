import { useEffect, useState } from "react";
import { Plus, Store, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Boutique {
  id: string;
  nom: string;
  adresse: string | null;
  telephone: string | null;
}

const BoutiquesManager = () => {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Boutique | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBoutiques = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("boutiques")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setBoutiques(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBoutiques();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      nom: String(fd.get("nom") ?? "").trim(),
      adresse: String(fd.get("adresse") ?? "").trim() || null,
      telephone: String(fd.get("telephone") ?? "").trim() || null,
    };
    if (!payload.nom) {
      toast.error("Le nom est requis");
      return;
    }

    const { error } = editing
      ? await supabase.from("boutiques").update(payload).eq("id", editing.id)
      : await supabase.from("boutiques").insert(payload);

    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Boutique mise à jour" : "Boutique créée");
      setOpen(false);
      setEditing(null);
      fetchBoutiques();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette boutique ?")) return;
    const { error } = await supabase.from("boutiques").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Boutique supprimée");
      fetchBoutiques();
    }
  };

  return (
    <Card className="p-6 shadow-card border-border/60">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl">Boutiques</h2>
            <p className="text-sm text-muted-foreground">{boutiques.length} boutique{boutiques.length > 1 ? "s" : ""}</p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4" />
              Nouvelle boutique
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Modifier la boutique" : "Nouvelle boutique"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input id="nom" name="nom" required defaultValue={editing?.nom ?? ""} placeholder="GAMA Plateau" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input id="adresse" name="adresse" defaultValue={editing?.adresse ?? ""} placeholder="Avenue de la Mode" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input id="telephone" name="telephone" defaultValue={editing?.telephone ?? ""} placeholder="+225 ..." />
              </div>
              <DialogFooter>
                <Button type="submit" variant="hero">{editing ? "Enregistrer" : "Créer"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Chargement...</p>
      ) : boutiques.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Aucune boutique. Créez la première !</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boutiques.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.nom}</TableCell>
                <TableCell className="text-muted-foreground">{b.adresse ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{b.telephone ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(b); setOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default BoutiquesManager;
