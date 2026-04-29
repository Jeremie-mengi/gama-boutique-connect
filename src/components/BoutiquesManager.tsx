import { useState } from "react";
import { Plus, Store, Pencil, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Boutique } from "@/lib/mockData";

interface Props {
  boutiques: Boutique[];
  setBoutiques: React.Dispatch<React.SetStateAction<Boutique[]>>;
  onSelect?: (id: string) => void;
  countsFor?: (id: string) => { articles: number; ventes: number };
}

const BoutiquesManager = ({ boutiques, setBoutiques, onSelect, countsFor }: Props) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Boutique | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nom = String(fd.get("nom") ?? "").trim();
    if (!nom) { toast.error("Le nom est requis"); return; }
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

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Supprimer cette boutique ?")) return;
    setBoutiques((prev) => prev.filter((b) => b.id !== id));
    toast.success("Boutique supprimée");
  };

  const handleEdit = (e: React.MouseEvent, b: Boutique) => {
    e.stopPropagation();
    setEditing(b);
    setOpen(true);
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
              {boutiques.length} boutique{boutiques.length > 1 ? "s" : ""} · cliquez pour voir le détail
            </p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button variant="hero"><Plus className="h-4 w-4" /> Nouvelle boutique</Button>
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {boutiques.map((b) => {
            const c = countsFor?.(b.id);
            return (
              <button
                key={b.id}
                onClick={() => onSelect?.(b.id)}
                className="text-left group rounded-xl border border-border/60 bg-card hover:border-primary/50 hover:shadow-glow transition-all p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{b.nom}</div>
                      <div className="text-xs text-muted-foreground truncate">{b.adresse ?? "—"}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                </div>
                {c && (
                  <div className="flex gap-3 text-xs">
                    <span className="rounded-md bg-muted/40 px-2 py-1"><b>{c.articles}</b> articles</span>
                    <span className="rounded-md bg-muted/40 px-2 py-1"><b>{c.ventes}</b> ventes</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="text-xs text-muted-foreground">{b.telephone ?? "—"}</span>
                  <div className="flex">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleEdit(e, b)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleDelete(e, b.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default BoutiquesManager;
