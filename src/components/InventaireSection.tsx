import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Package, CalendarRange, Search, X, ImageOff, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ArticleFormDialog from "./ArticleFormDialog";
import ArticleExcelImport from "./ArticleExcelImport";
import ExportButtons from "./ExportButtons";
import ImageLightbox from "./ImageLightbox";
import QrCode from "./QrCode";
import { useBoutiqueStore } from "@/store/boutiqueStore";

interface Article {
  id: string;
  code: string;
  nom: string;
  boutique_id: string;
  couleur: string;
  taille?: string;
  categorie: string;
  prix: number;
  devise: string;
  quantiteEntree: number;
  quantiteRestante: number;
  quantiteVendue: number;
  photo?: string;
  dateEntreeStock: string;
  promotions: any[];
}

const CATEGORIES = [
  { value: "VETEMENT", label: "Vêtement" },
  { value: "CHAUSSURE", label: "Chaussure" },
  { value: "ACCESSOIRE", label: "Accessoire" },
];

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " F";
const toInputDate = (iso: string) => iso.slice(0, 10);

type NumOp = "all" | "gte" | "lte" | "eq";
const numFilter = (val: number, op: NumOp, ref: string) => {
  if (op === "all" || ref === "") return true;
  const r = Number(ref);
  if (Number.isNaN(r)) return true;
  if (op === "gte") return val >= r;
  if (op === "lte") return val <= r;
  return val === r;
};

const InventaireSection = () => {
  const { boutiques, articles: storeArticles, articlesLoading, fetchArticles, addArticle } = useBoutiqueStore();
  
  const today = new Date();
  const past = new Date(today.getTime() - 30 * 86400000);

  // Filtres
  const [boutique, setBoutique] = useState<string>("all");
  const [from, setFrom] = useState(toInputDate(past.toISOString()));
  const [to, setTo] = useState(toInputDate(today.toISOString()));
  const [code, setCode] = useState("");
  const [nom, setNom] = useState("");
  const [couleur, setCouleur] = useState("");
  const [taille, setTaille] = useState("");
  const [categorie, setCategorie] = useState<string>("all");
  const [promo, setPromo] = useState<"all" | "yes" | "no">("all");

  const [prixOp, setPrixOp] = useState<NumOp>("all");
  const [prixVal, setPrixVal] = useState("");
  const [restOp, setRestOp] = useState<NumOp>("all");
  const [restVal, setRestVal] = useState("");
  const [vendOp, setVendOp] = useState<NumOp>("all");
  const [vendVal, setVendVal] = useState("");
  const [zoomArticle, setZoomArticle] = useState<Article | null>(null);

  // Load articles from API
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const articles = storeArticles as unknown as Article[];
  const loading = articlesLoading;

  const filtered = useMemo(() => {
    const fromTs = +new Date(from);
    const toTs = +new Date(to) + 86400000;
    return articles.filter((a) => {
      const t = +new Date(a.dateEntreeStock);
      if (!(t >= fromTs && t <= toTs)) return false;
      if (boutique !== "all" && a.boutique_id !== boutique) return false;
      if (code && !a.code.toLowerCase().includes(code.toLowerCase())) return false;
      if (nom && !a.nom.toLowerCase().includes(nom.toLowerCase())) return false;
      if (couleur && !a.couleur.toLowerCase().includes(couleur.toLowerCase())) return false;
      if (taille && !(a.taille ?? "").toLowerCase().includes(taille.toLowerCase())) return false;
      if (categorie !== "all" && a.categorie !== categorie) return false;
      if (promo === "yes" && (!a.promotions || a.promotions.length === 0)) return false;
      if (promo === "no" && a.promotions && a.promotions.length > 0) return false;
      if (!numFilter(a.prix, prixOp, prixVal)) return false;
      if (!numFilter(a.quantiteRestante, restOp, restVal)) return false;
      if (!numFilter(a.quantiteVendue, vendOp, vendVal)) return false;
      return true;
    });
  }, [articles, from, to, boutique, code, nom, couleur, taille, categorie, promo, prixOp, prixVal, restOp, restVal, vendOp, vendVal]);

  const nameOf = (id: string) => boutiques.find((b) => b.id === id)?.nom ?? "—";
  const totalEntree = filtered.reduce((s, a) => s + a.quantiteEntree, 0);
  const totalRestant = filtered.reduce((s, a) => s + a.quantiteRestante, 0);
  const totalValeur = filtered.reduce((s, a) => s + a.quantiteRestante * a.prix, 0);

  const resetFilters = () => {
    setBoutique("all"); setCode(""); setNom(""); setCouleur(""); setTaille("");
    setCategorie("all"); setPromo("all");
    setPrixOp("all"); setPrixVal(""); setRestOp("all"); setRestVal(""); setVendOp("all"); setVendVal("");
  };

  if (loading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 shadow-card border-border/60">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-2xl">Inventaire</h2>
              <p className="text-sm text-muted-foreground">Articles par boutique selon une période</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ExportButtons
              title="Inventaire"
              subtitle={`Période ${from} → ${to} · ${filtered.length} article(s)`}
              columns={[
                { header: "Code", accessor: (a: Article) => a.code },
                { header: "Nom", accessor: (a: Article) => a.nom },
                { header: "Boutique", accessor: (a: Article) => nameOf(a.boutique_id) },
                { header: "Couleur", accessor: (a: Article) => a.couleur },
                { header: "Taille", accessor: (a: Article) => a.taille ?? "—" },
                { header: "Catégorie", accessor: (a: Article) => CATEGORIES.find((c) => c.value === a.categorie)?.label ?? "" },
                { header: "Entrée", accessor: (a: Article) => a.quantiteEntree, align: "right" },
                { header: "Vendue", accessor: (a: Article) => a.quantiteVendue, align: "right" },
                { header: "Restante", accessor: (a: Article) => a.quantiteRestante, align: "right" },
                { header: "Prix", accessor: (a: Article) => fmt(a.prix), align: "right" },
              ]}
              rows={filtered}
              imageAccessor={(a: Article) => a.photo}
              qrAccessor={(a: Article) => `${a.code}|${a.nom}`}
              totals={[
                { label: "Articles", value: String(filtered.length) },
                { label: "Qté entrée", value: String(totalEntree) },
                { label: "Qté restante", value: String(totalRestant) },
                { label: "Valeur stock", value: fmt(totalValeur) },
              ]}
              disabled={filtered.length === 0}
            />
            <ArticleExcelImport boutiques={boutiques as any} onImport={(imported) => imported.forEach((a) => addArticle(a as any))} />
            <ArticleFormDialog boutiques={boutiques as any} onCreate={(a) => addArticle(a as any)} />
          </div>
        </div>

        {/* Filtres principaux */}
        <div className="grid gap-3 md:grid-cols-3 mb-3">
          <div>
            <Label className="text-xs text-muted-foreground">Boutique</Label>
            <Select value={boutique} onValueChange={setBoutique}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les boutiques</SelectItem>
                {boutiques.map((b) => (<SelectItem key={b.id} value={b.id}>{b.nom}</SelectItem>))}
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

        {/* Filtres avancés */}
        <div className="rounded-lg border border-border/60 bg-card/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Search className="h-4 w-4 text-primary" /> Filtres avancés
            </div>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X className="h-3.5 w-3.5" /> Réinitialiser
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <Label className="text-xs text-muted-foreground">Code</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="CHM-001" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Nom</Label>
              <Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Chemise..." />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Couleur</Label>
              <Input value={couleur} onChange={(e) => setCouleur(e.target.value)} placeholder="Blanc" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Taille</Label>
              <Input value={taille} onChange={(e) => setTaille(e.target.value)} placeholder="M, 42..." />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Catégorie</Label>
              <Select value={categorie} onValueChange={setCategorie}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Promotion</Label>
              <Select value={promo} onValueChange={(v) => setPromo(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="yes">Avec promo</SelectItem>
                  <SelectItem value="no">Sans promo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prix */}
            <div>
              <Label className="text-xs text-muted-foreground">Prix</Label>
              <div className="flex gap-2">
                <Select value={prixOp} onValueChange={(v) => setPrixOp(v as NumOp)}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="gte">≥</SelectItem>
                    <SelectItem value="lte">≤</SelectItem>
                    <SelectItem value="eq">=</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" value={prixVal} onChange={(e) => setPrixVal(e.target.value)} placeholder="F" disabled={prixOp === "all"} />
              </div>
            </div>
            {/* Qté restante */}
            <div>
              <Label className="text-xs text-muted-foreground">Qté restante</Label>
              <div className="flex gap-2">
                <Select value={restOp} onValueChange={(v) => setRestOp(v as NumOp)}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="gte">≥</SelectItem>
                    <SelectItem value="lte">≤</SelectItem>
                    <SelectItem value="eq">=</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" value={restVal} onChange={(e) => setRestVal(e.target.value)} disabled={restOp === "all"} />
              </div>
            </div>
            {/* Qté vendue */}
            <div>
              <Label className="text-xs text-muted-foreground">Qté vendue</Label>
              <div className="flex gap-2">
                <Select value={vendOp} onValueChange={(v) => setVendOp(v as NumOp)}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="gte">≥</SelectItem>
                    <SelectItem value="lte">≤</SelectItem>
                    <SelectItem value="eq">=</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" value={vendVal} onChange={(e) => setVendVal(e.target.value)} disabled={vendOp === "all"} />
              </div>
            </div>
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
          <p className="text-muted-foreground text-sm py-12 text-center">Aucun article pour ces filtres.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>QR</TableHead>
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
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => a.photo && setZoomArticle(a)}
                        className="h-12 w-12 rounded-md overflow-hidden bg-muted/30 flex items-center justify-center cursor-zoom-in border border-border/60"
                        aria-label={`Voir ${a.nom}`}
                      >
                        {a.photo ? (
                          <img src={a.photo} alt={a.nom} className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <ImageOff className="h-4 w-4 text-muted-foreground/60" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <QrCode value={`${a.code}|${a.nom}`} size={48} />
                    </TableCell>
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
                      <span className={a.quantiteRestante <= 6 ? "text-rose-400 font-semibold" : ""}>{a.quantiteRestante}</span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{fmt(a.prix)}</TableCell>
                    <TableCell>
                      {a.promotions && a.promotions.length > 0 ? (
                        <Badge className="bg-primary/15 text-primary border-primary/30">
                          -{a.promotions[0].pourcentage}%
                        </Badge>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <ImageLightbox
        open={!!zoomArticle}
        onOpenChange={(v) => !v && setZoomArticle(null)}
        images={zoomArticle?.photo ? [zoomArticle.photo] : []}
        title={zoomArticle?.nom}
      />
    </div>
  );
};

export default InventaireSection;