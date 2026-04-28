import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Package, CalendarRange, Plus, Tag, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  type Article, type Boutique, type Categorie, type StatutArticle, type Promotion,
  CATEGORIES, STATUTS,
} from "@/lib/mockData";

interface Props {
  boutiques: Boutique[];
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " F";
const toInputDate = (iso: string) => iso.slice(0, 10);

const InventaireSection = ({ boutiques, articles, setArticles }: Props) => {
  const today = new Date();
  const past = new Date(today.getTime() - 30 * 86400000);

  const [boutique, setBoutique] = useState<string>("all");
  const [from, setFrom] = useState(toInputDate(past.toISOString()));
  const [to, setTo] = useState(toInputDate(today.toISOString()));
  const [open, setOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    boutique_id: boutiques[0]?.id ?? "",
    code: "",
    nom: "",
    description: "",
    photo: "",
    categorie: "PRET_A_PORTER" as Categorie,
    couleur: "",
    observation: "",
    statut: "EN_STOCK" as StatutArticle,
    taille: "",
    serie: "",
    demiSerie: false,
    prix: 0,
    quantiteEntree: 0,
  });
  const [promos, setPromos] = useState<Promotion[]>([]);

  const filtered = useMemo(() => {
    const fromTs = +new Date(from);
    const toTs = +new Date(to) + 86400000;
    return articles.filter((a) => {
      const t = +new Date(a.dateEntreeStock);
      const inDate = t >= fromTs && t <= toTs;
      const inBoutique = boutique === "all" || a.boutique_id === boutique;
      return inDate && inBoutique;
    });
  }, [articles, from, to, boutique]);

  const nameOf = (id: string) => boutiques.find((b) => b.id === id)?.nom ?? "—";
  const totalEntree = filtered.reduce((s, a) => s + a.quantiteEntree, 0);
  const totalRestant = filtered.reduce((s, a) => s + a.quantiteRestante, 0);
  const totalValeur = filtered.reduce((s, a) => s + a.quantiteRestante * a.prix, 0);

  const addPromo = () => {
    if (promos.length >= 2) {
      toast.error("Maximum 2 promotions par article");
      return;
    }
    setPromos((p) => [
      ...p,
      {
        id: crypto.randomUUID(),
        libelle: "",
        pourcentage: 10,
        dateDebut: toInputDate(new Date().toISOString()),
        dateFin: toInputDate(new Date(Date.now() + 7 * 86400000).toISOString()),
      },
    ]);
  };

  const updatePromo = (id: string, patch: Partial<Promotion>) =>
    setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const removePromo = (id: string) => setPromos((prev) => prev.filter((p) => p.id !== id));

  const resetForm = () => {
    setForm({
      boutique_id: boutiques[0]?.id ?? "",
      code: "", nom: "", description: "", photo: "",
      categorie: "PRET_A_PORTER", couleur: "", observation: "",
      statut: "EN_STOCK", taille: "", serie: "", demiSerie: false,
      prix: 0, quantiteEntree: 0,
    });
    setPromos([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
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
      quantiteEntree: Number(form.quantiteEntree) || 0,
      quantiteVendue: 0,
      quantiteRestante: Number(form.quantiteEntree) || 0,
      dateEntreeStock: new Date().toISOString(),
      promotions: promos,
    };
    setArticles((prev) => [article, ...prev]);
    toast.success("Article créé");
    setOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header & filtres */}
      <Card className="p-6 shadow-card border-border/60">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-2xl">Inventaire</h2>
              <p className="text-sm text-muted-foreground">
                Articles par boutique selon une période
              </p>
            </div>
          </div>

          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="h-4 w-4" />
                Nouvel article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouvel article</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Boutique *</Label>
                    <Select value={form.boutique_id} onValueChange={(v) => setForm({ ...form, boutique_id: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {boutiques.map((b) => (
                          <SelectItem key={b.id} value={b.id}>{b.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Prix unitaire (F)</Label>
                    <Input type="number" min={0} value={form.prix} onChange={(e) => setForm({ ...form, prix: Number(e.target.value) })} />
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

                {/* Promotions */}
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
                      <div className="col-span-2.5 space-y-1">
                        <Label className="text-xs">Du</Label>
                        <Input type="date" value={p.dateDebut.slice(0, 10)} onChange={(e) => updatePromo(p.id, { dateDebut: e.target.value })} />
                      </div>
                      <div className="col-span-2.5 space-y-1">
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
        </div>

        {/* Filtres */}
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <Label className="text-xs text-muted-foreground">Boutique</Label>
            <Select value={boutique} onValueChange={setBoutique}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les boutiques</SelectItem>
                {boutiques.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground flex items-center gap-1"><CalendarRange className="h-3 w-3" /> Du</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground flex items-center gap-1"><CalendarRange className="h-3 w-3" /> Au</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-3 sm:grid-cols-4 mt-4">
          <div className="rounded-lg border border-border/60 bg-card/40 p-3">
            <div className="text-xs uppercase text-muted-foreground">Articles</div>
            <div className="text-xl font-bold">{filtered.length}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/40 p-3">
            <div className="text-xs uppercase text-muted-foreground">Qté entrée</div>
            <div className="text-xl font-bold">{totalEntree}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/40 p-3">
            <div className="text-xs uppercase text-muted-foreground">Qté restante</div>
            <div className="text-xl font-bold">{totalRestant}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-gradient-dark p-3">
            <div className="text-xs uppercase text-muted-foreground">Valeur stock</div>
            <div className="text-xl font-bold text-gradient">{fmt(totalValeur)}</div>
          </div>
        </div>
      </Card>

      {/* Liste */}
      <Card className="p-6 shadow-card border-border/60">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm py-12 text-center">
            Aucun article pour ces filtres.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Boutique</TableHead>
                  <TableHead>Couleur</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Entrée</TableHead>
                  <TableHead className="text-right">Vendue</TableHead>
                  <TableHead className="text-right">Restante</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                  <TableHead>Promo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.code}</TableCell>
                    <TableCell className="font-medium">{a.nom}</TableCell>
                    <TableCell className="text-muted-foreground">{nameOf(a.boutique_id)}</TableCell>
                    <TableCell>{a.couleur}</TableCell>
                    <TableCell>{a.taille ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {CATEGORIES.find((c) => c.value === a.categorie)?.label ?? a.categorie}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{a.quantiteEntree}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{a.quantiteVendue}</TableCell>
                    <TableCell className="text-right">
                      <span className={a.quantiteRestante <= 6 ? "text-rose-400 font-semibold" : "font-semibold"}>
                        {a.quantiteRestante}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{fmt(a.prix)}</TableCell>
                    <TableCell>
                      {a.promotions.length > 0 ? (
                        <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/20">
                          -{a.promotions[0].pourcentage}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InventaireSection;
