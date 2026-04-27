import { useState } from "react";
import { Plus, Store, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import type { Boutique } from "@/lib/mockData";

interface Props {
  boutiques: Boutique[];
  setBoutiques: React.Dispatch<React.SetStateAction<Boutique[]>>;
}

const BoutiquesManager = ({ boutiques, setBoutiques }: Props) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Boutique | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nom = String(fd.get("nom") ?? "").trim();
    if (!nom) {
      toast.error("Le nom est requis");
      return;
    }
    const payload = {
      nom,
      adresse: String(fd.get("adresse") ?? "").trim() || null,
      telephone: String(fd.get("telephone") ?? "").trim() || null,
    };
    if (editing) {
      setBoutiques((prev) => prev.map((b) => (b.id === editing.id ? { ...b, ...payload } : b)));
      toast.success("Boutique mise à jour");
    } else {
      setBoutiques((prev) => [{ id: crypto.randomUUID(), ...payload }, ...prev]);
      toast.success("Boutique créée");
    }
    setOpen(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer cette boutique ?")) return;
    setBoutiques((prev) => prev.filter((b) => b.id !== id));
    toast.success("Boutique supprimée");
  };

  return (
    <Card className="p-6 shadow-card border-border/60">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-xl">Boutiques</h2>
            <p className="text-sm text-muted-foreground">
              {boutiques.length} boutique{boutiques.length > 1 ? "s" : ""}
            </p>
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

      {boutiques.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Aucune boutique.</p>
      ) : (
        <div className="overflow-x-auto">
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
        </div>
      )}
    </Card>
  );
};

export default BoutiquesManager;
