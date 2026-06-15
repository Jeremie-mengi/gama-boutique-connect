import { useMemo, useState } from "react";
import { Plus, Trash2, ShoppingCart, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  DEVISES,
  formatMoney,
  type Article,
  type Boutique,
  type Devise,
  type Vente,
} from "@/lib/mockData";

interface LineItem {
  uid: string;
  articleId: string;
  quantite: number;
  prix: number;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  boutiques: Boutique[];
  articles: Article[];
  defaultBoutiqueId?: string;
  onCreate: (ventes: Vente[]) => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);

const VenteFormDialog = ({
  open,
  onOpenChange,
  boutiques,
  articles,
  defaultBoutiqueId,
  onCreate,
}: Props) => {
  const [boutiqueId, setBoutiqueId] = useState<string>(defaultBoutiqueId ?? "");
  const [devise, setDevise] = useState<Devise>("CDF");
  const [items, setItems] = useState<LineItem[]>([]);
  const [search, setSearch] = useState("");

  const boutiqueArticles = useMemo(
    () => (boutiqueId ? articles.filter((a) => a.boutique_id === boutiqueId) : []),
    [boutiqueId, articles],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return boutiqueArticles.slice(0, 12);
    return boutiqueArticles.filter(
      (a) =>
        a.nom.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.couleur.toLowerCase().includes(q),
    );
  }, [search, boutiqueArticles]);

  const addArticle = (a: Article) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.articleId === a.id);
      if (existing) {
        return prev.map((p) =>
          p.articleId === a.id ? { ...p, quantite: p.quantite + 1 } : p,
        );
      }
      return [
        ...prev,
        { uid: uid(), articleId: a.id, quantite: 1, prix: a.prix },
      ];
    });
  };

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setItems((prev) =>
      prev.map((p) => (p.uid === id ? { ...p, ...patch } : p)),
    );
  };
  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((p) => p.uid !== id));

  const total = items.reduce((s, it) => s + it.quantite * it.prix, 0);

  const reset = () => {
    setItems([]);
    setSearch("");
    setBoutiqueId(defaultBoutiqueId ?? "");
    setDevise("CDF");
  };

  const submit = () => {
    if (!boutiqueId) return toast.error("Sélectionnez une boutique");
    if (items.length === 0) return toast.error("Ajoutez au moins un article");
    const date = new Date().toISOString();
    const ventes: Vente[] = items.map((it) => {
      const a = articles.find((x) => x.id === it.articleId)!;
      return {
        id: "v_" + uid(),
        boutique_id: boutiqueId,
        montant: it.quantite * it.prix,
        devise,
        date,
        article: a.nom,
        code: a.code,
        couleur: a.couleur,
        quantite: it.quantite,
      };
    });
    onCreate(ventes);
    toast.success(`Vente enregistrée (${ventes.length} article${ventes.length > 1 ? "s" : ""})`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Nouvelle vente
          </DialogTitle>
          <DialogDescription>
            Choisissez la boutique, ajoutez des articles puis enregistrez.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Boutique</Label>
            <Select value={boutiqueId} onValueChange={setBoutiqueId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une boutique" />
              </SelectTrigger>
              <SelectContent>
                {boutiques.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Devise</Label>
            <Select value={devise} onValueChange={(v) => setDevise(v as Devise)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEVISES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Recherche / ajout d'articles */}
        <div className="space-y-2">
          <Label>Ajouter des articles</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                boutiqueId
                  ? "Rechercher par nom, code, couleur…"
                  : "Sélectionnez d'abord une boutique"
              }
              disabled={!boutiqueId}
              className="pl-9"
            />
          </div>

          {boutiqueId && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground col-span-full py-4 text-center">
                  Aucun article trouvé.
                </p>
              ) : (
                filtered.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => addArticle(a)}
                    className="flex items-center gap-3 p-2 rounded-lg border border-border/60 hover:bg-muted/40 text-left transition"
                  >
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-muted/40 flex-shrink-0">
                      {a.photo ? (
                        <img
                          src={a.photo}
                          alt={a.nom}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{a.nom}</div>
                      <div className="text-[11px] text-muted-foreground flex gap-2">
                        <span className="font-mono">{a.code}</span>
                        <Badge variant="outline" className="text-[10px] py-0">
                          {a.couleur}
                        </Badge>
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-primary flex-shrink-0" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Lignes de la vente */}
        <Card className="p-3 border-border/60">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Articles dans la vente</h3>
            <span className="text-xs text-muted-foreground">
              {items.length} ligne{items.length > 1 ? "s" : ""}
            </span>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Aucun article ajouté.
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((it) => {
                const a = articles.find((x) => x.id === it.articleId);
                if (!a) return null;
                return (
                  <div
                    key={it.uid}
                    className="grid grid-cols-12 gap-2 items-center p-2 rounded-md bg-muted/30"
                  >
                    <div className="col-span-12 sm:col-span-5">
                      <div className="text-sm font-medium truncate">{a.nom}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {a.code} · {a.couleur}
                      </div>
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Label className="text-[10px] uppercase text-muted-foreground">
                        Qté
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        value={it.quantite}
                        onChange={(e) =>
                          updateItem(it.uid, {
                            quantite: Math.max(1, Number(e.target.value) || 1),
                          })
                        }
                        className="h-8"
                      />
                    </div>
                    <div className="col-span-5 sm:col-span-3">
                      <Label className="text-[10px] uppercase text-muted-foreground">
                        Prix unit.
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        value={it.prix}
                        onChange={(e) =>
                          updateItem(it.uid, {
                            prix: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        className="h-8"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1 text-right text-sm font-semibold text-primary">
                      {formatMoney(it.quantite * it.prix, devise)}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeItem(it.uid)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/60">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-lg font-bold text-primary">
              {formatMoney(total, devise)}
            </span>
          </div>
        </Card>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={submit} disabled={items.length === 0 || !boutiqueId}>
            Enregistrer la vente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VenteFormDialog;
