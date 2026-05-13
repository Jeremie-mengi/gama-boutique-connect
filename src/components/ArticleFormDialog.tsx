import { useState } from "react";
import { Plus, Tag, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  type Article, type Boutique, type Categorie, type StatutArticle, type Promotion, type Devise,
  CATEGORIES, STATUTS, DEVISES,
} from "@/lib/mockData";
import { createArticleApi, apiArticleToLocal } from "@/lib/articlesApi";
import { useAuthStore } from "@/store/authStore";

interface Props {
  boutiques: Boutique[];
  /** Si fourni, la boutique est verrouillée */
  lockedBoutiqueId?: string;
  trigger?: React.ReactNode;
  onCreate: (article: Article) => void;
}

const toInputDate = (iso: string) => iso.slice(0, 10);

const ArticleFormDialog = ({ boutiques, lockedBoutiqueId, trigger, onCreate }: Props) => {
  const [open, setOpen] = useState(false);
  const initialBoutique = lockedBoutiqueId ?? boutiques[0]?.id ?? "";

  const [form, setForm] = useState({
    boutique_id: initialBoutique,
    code: "", nom: "", description: "", photo: "",
    categorie: "PRET_A_PORTER" as Categorie,
    couleur: "", observation: "",
    statut: "EN_STOCK" as StatutArticle,
    taille: "", serie: "", demiSerie: false,
    prix: 0, devise: "CDF" as Devise, quantiteEntree: 0,
  });
  const [promos, setPromos] = useState<Promotion[]>([]);

  const reset = () => {
    setForm({
      boutique_id: lockedBoutiqueId ?? boutiques[0]?.id ?? "",
      code: "", nom: "", description: "", photo: "",
      categorie: "PRET_A_PORTER", couleur: "", observation: "",
      statut: "EN_STOCK", taille: "", serie: "", demiSerie: false,
      prix: 0, devise: "CDF", quantiteEntree: 0,
    });
    setPromos([]);
  };

  const addPromo = () => {
    if (promos.length >= 2) { toast.error("Maximum 2 promotions"); return; }
    setPromos((p) => [...p, {
      id: crypto.randomUUID(), libelle: "", pourcentage: 10,
      dateDebut: toInputDate(new Date().toISOString()),
      dateFin: toInputDate(new Date(Date.now() + 7 * 86400000).toISOString()),
    }]);
  };
  const updatePromo = (id: string, patch: Partial<Promotion>) =>
    setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const removePromo = (id: string) => setPromos((prev) => prev.filter((p) => p.id !== id));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.boutique_id || !form.code.trim() || !form.nom.trim() || !form.couleur.trim()) {
      toast.error("Boutique, code, nom et couleur sont obligatoires");
      return;
    }
    const article: Article = {
      id: crypto.randomUUID(),
      boutique_id: form.boutique_id,
      code: form.code.trim(),
      nom: form.nom.trim(),
      description: form.description.trim() || null,
      photo: form.photo.trim() || null,
      categorie: form.categorie,
      couleur: form.couleur.trim(),
      observation: form.observation.trim() || null,
      statut: form.statut,
      taille: form.taille.trim() || null,
      serie: form.serie.trim() || null,
      demiSerie: form.demiSerie,
      prix: Number(form.prix) || 0,
      devise: form.devise,
      quantiteEntree: Number(form.quantiteEntree) || 0,
      quantiteVendue: 0,
      quantiteRestante: Number(form.quantiteEntree) || 0,
      dateEntreeStock: new Date().toISOString(),
      promotions: promos,
    };
    onCreate(article);
    toast.success("Article créé");
    setOpen(false);
    reset();
  };

  const lockedName = lockedBoutiqueId ? boutiques.find((b) => b.id === lockedBoutiqueId)?.nom : null;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="hero"><Plus className="h-4 w-4" /> Nouvel article</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Nouvel article {lockedName && <span className="text-primary">· {lockedName}</span>}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Boutique *</Label>
              {lockedBoutiqueId ? (
                <Input value={lockedName ?? ""} disabled />
              ) : (
                <Select value={form.boutique_id} onValueChange={(v) => setForm({ ...form, boutique_id: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {boutiques.map((b) => (<SelectItem key={b.id} value={b.id}>{b.nom}</SelectItem>))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Code *</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="CHM-001" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Nom *</Label>
            <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Chemise lin blanc" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Catégorie</Label>
              <Select value={form.categorie} onValueChange={(v) => setForm({ ...form, categorie: v as Categorie })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Couleur *</Label>
              <Input value={form.couleur} onChange={(e) => setForm({ ...form, couleur: e.target.value })} placeholder="Blanc" />
            </div>
            <div className="space-y-1.5">
              <Label>Statut</Label>
              <Select value={form.statut} onValueChange={(v) => setForm({ ...form, statut: v as StatutArticle })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Taille</Label>
              <Input value={form.taille} onChange={(e) => setForm({ ...form, taille: e.target.value })} placeholder="M, 42..." />
            </div>
            <div className="space-y-1.5">
              <Label>Série</Label>
              <Input value={form.serie} onChange={(e) => setForm({ ...form, serie: e.target.value })} placeholder="Été 2026" />
            </div>
            <div className="space-y-1.5">
              <Label className="block">Demi-série</Label>
              <div className="flex items-center h-10 gap-2">
                <Switch checked={form.demiSerie} onCheckedChange={(v) => setForm({ ...form, demiSerie: v })} />
                <span className="text-sm text-muted-foreground">{form.demiSerie ? "Oui" : "Non"}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Prix de vente</Label>
              <Input type="number" min={0} value={form.prix} onChange={(e) => setForm({ ...form, prix: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label>Devise</Label>
              <Select value={form.devise} onValueChange={(v) => setForm({ ...form, devise: v as Devise })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEVISES.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Quantité entrée</Label>
              <Input type="number" min={0} value={form.quantiteEntree} onChange={(e) => setForm({ ...form, quantiteEntree: Number(e.target.value) })} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Photo (URL)</Label>
            <Input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="https://..." />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <Label>Observation</Label>
            <Textarea rows={2} value={form.observation} onChange={(e) => setForm({ ...form, observation: e.target.value })} />
          </div>

          <div className="space-y-3 rounded-lg border border-border/60 p-4 bg-card/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <Label className="m-0">Promotions ({promos.length}/2)</Label>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addPromo} disabled={promos.length >= 2}>
                <Plus className="h-3.5 w-3.5" /> Ajouter
              </Button>
            </div>
            {promos.map((p) => (
              <div key={p.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4 space-y-1">
                  <Label className="text-xs">Libellé</Label>
                  <Input value={p.libelle} onChange={(e) => updatePromo(p.id, { libelle: e.target.value })} placeholder="Soldes" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">%</Label>
                  <Input type="number" min={0} max={100} value={p.pourcentage} onChange={(e) => updatePromo(p.id, { pourcentage: Number(e.target.value) })} />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Du</Label>
                  <Input type="date" value={p.dateDebut.slice(0, 10)} onChange={(e) => updatePromo(p.id, { dateDebut: e.target.value })} />
                </div>
                <div className="col-span-3 space-y-1">
                  <Label className="text-xs">Au</Label>
                  <Input type="date" value={p.dateFin.slice(0, 10)} onChange={(e) => updatePromo(p.id, { dateFin: e.target.value })} />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removePromo(p.id)} className="col-span-1">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="submit" variant="hero">Créer l'article</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleFormDialog;
