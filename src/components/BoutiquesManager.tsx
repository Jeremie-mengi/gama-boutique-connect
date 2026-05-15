import { useState, useEffect } from "react";
import { Plus, Store, Pencil, Trash2, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useBoutiqueStore } from "@/store/boutiqueStore";
import { useAuthStore } from "@/store/authStore";

interface Props {
  onSelect?: (id: string) => void;
}

const BoutiquesManager = ({ onSelect }: Props) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);

  // Store actions and state
  const { 
    boutiques, 
    loading, 
    error, 
    fetchBoutiques, 
    createBoutique, 
    updateBoutique, 
    deleteBoutique 
  } = useBoutiqueStore();

  // Get auth state
  const { user, isAuthenticated } = useAuthStore();

  // Fetch boutiques on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchBoutiques();
    }
  }, [isAuthenticated, fetchBoutiques]);

  // Show error toast if any
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nom = String(fd.get("nom") ?? "").trim();
    const emplacement = String(fd.get("emplacement") ?? "").trim();
    
    if (!nom) { 
      toast.error("Le nom est requis"); 
      return; 
    }
    
    if (!emplacement) { 
      toast.error("L'emplacement est requis"); 
      return; 
    }

    try {
      if (editing) {
        // Update boutique
        await updateBoutique(editing.id, {
          nom,
          emplacement,
        });
        toast.success("Boutique mise à jour");
      } else {
        // Create boutique - userId will be taken from auth store automatically
        await createBoutique({
          nom,
          emplacement,
        });
        toast.success("Boutique créée");
      }
      setOpen(false);
      setEditing(null);
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Supprimer cette boutique ?")) return;
    
    setLoadingDelete(id);
    try {
      await deleteBoutique(id);
      toast.success("Boutique supprimée");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression");
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleEdit = (e: React.MouseEvent, b: any) => {
    e.stopPropagation();
    setEditing(b);
    setOpen(true);
  };

  // Helper to get counts from the store
  const getCountsFor = (id: string) => {
    const boutique = useBoutiqueStore.getState().getBoutiqueById(id);
    if (!boutique) return { articles: 0, ventes: 0 };
    return {
      articles: boutique.articles?.length || 0,
      ventes: boutique.ventes?.length || 0,
    };
  };

  // Don't show if not authenticated
  if (!isAuthenticated) {
    return null;
  }

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
              {loading ? "Chargement..." : `${boutiques.length} boutique${boutiques.length > 1 ? "s" : ""} · cliquez pour voir le détail`}
            </p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button variant="hero" disabled={loading}>
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
                <Input 
                  id="nom" 
                  name="nom" 
                  required 
                  defaultValue={editing?.nom ?? ""} 
                  placeholder="GAMA Plateau" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emplacement">Emplacement *</Label>
                <Input 
                  id="emplacement" 
                  name="emplacement" 
                  required 
                  defaultValue={editing?.emplacement ?? editing?.adresse ?? ""} 
                  placeholder="Avenue de la Mode" 
                />
              </div>
              <DialogFooter>
                <Button type="submit" variant="hero" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editing ? "Enregistrer" : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && boutiques.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : boutiques.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Aucune boutique.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {boutiques.map((b) => {
            const c = getCountsFor(b.id);
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
                      <div className="text-xs text-muted-foreground truncate">
                        {b.adresse || b.emplacement || "—"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                </div>
                
                <div className="flex gap-3 text-xs">
                  <span className="rounded-md bg-muted/40 px-2 py-1">
                    <b>{c.articles}</b> articles
                  </span>
                  <span className="rounded-md bg-muted/40 px-2 py-1">
                    <b>{c.ventes}</b> ventes
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="text-xs text-muted-foreground">
                    {b.user?.telephone || b.telephone || "—"}
                  </span>
                  <div className="flex">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={(e) => handleEdit(e, b)}
                      disabled={loadingDelete === b.id}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={(e) => handleDelete(e, b.id)}
                      disabled={loadingDelete === b.id}
                    >
                      {loadingDelete === b.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
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