import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Package, Search, X, ImageOff, Tag, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ArticleFormDialog from "./ArticleFormDialog";
import ArticleExcelImport from "./ArticleExcelImport";
import ImageLightbox from "./ImageLightbox";
import ExportButtons from "./ExportButtons";
import QrCode from "./QrCode";
import { useBoutiqueStore } from "@/store/boutiqueStore";
import { toast } from "sonner";

// Types
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
  statut: string;
  photo?: string;
  dateEntreeStock: string;
  promotions: any[];
}

type StatutArticle = "EN_STOCK" | "RUPTURE" | "PROMOTION";
type NumOp = "all" | "gte" | "lte" | "eq";

const CATEGORIES = [
  { value: "VETEMENT", label: "Vêtement" },
  { value: "CHAUSSURE", label: "Chaussure" },
  { value: "ACCESSOIRE", label: "Accessoire" },
];

const STATUTS = [
  { value: "EN_STOCK", label: "En stock" },
  { value: "RUPTURE", label: "Rupture" },
  { value: "PROMOTION", label: "Promotion" },
];

const formatMoney = (amount: number, currency: string = "CDF") => {
  return new Intl.NumberFormat("fr-FR").format(amount) + " " + currency;
};

const numFilter = (val: number, op: NumOp, ref: string) => {
  if (op === "all" || ref === "") return true;
  const r = Number(ref);
  if (Number.isNaN(r)) return true;
  if (op === "gte") return val >= r;
  if (op === "lte") return val <= r;
  return val === r;
};

const ArticleCard = ({ a, boutiqueName, onZoom }: { a: Article; boutiqueName: string; onZoom: (a: Article) => void }) => {
  const promo = a.promotions?.[0];
  const lowStock = a.quantiteRestante <= 6;
  
  return (
    <div className="group rounded-xl border border-border/60 bg-card overflow-hidden shadow-card hover:shadow-glow hover:border-primary/40 transition-all">
      <button
        type="button"
        onClick={() => onZoom(a)}
        className="relative aspect-square w-full bg-gradient-to-br from-muted/40 to-muted/10 flex items-center justify-center overflow-hidden cursor-zoom-in"
        aria-label={`Voir ${a.nom} en grand`}
      >
        {a.photo ? (
          <img src={a.photo} alt={a.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
            <ImageOff className="h-12 w-12" />
            <span className="text-xs">Pas de photo</span>
          </div>
        )}
        {promo && (
          <div className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-glow">
            <Tag className="h-3 w-3" /> -{promo.pourcentage}%
          </div>
        )}
        <div className="absolute top-2 right-2 rounded-md bg-background/85 backdrop-blur px-2 py-0.5 text-[10px] font-mono">
          {a.code}
        </div>
      </button>
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold leading-tight line-clamp-2 text-sm">{a.nom}</h4>
            <div className="text-[11px] text-muted-foreground truncate">{boutiqueName}</div>
          </div>
          <QrCode value={`${a.code}|${a.nom}`} size={48} className="shrink-0" />
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{a.couleur}</Badge>
          {a.taille && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{a.taille}</Badge>}
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {CATEGORIES.find((c) => c.value === a.categorie)?.label}
          </Badge>
        </div>
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Restant</div>
            <div className={`text-sm font-bold ${lowStock ? "text-rose-400" : ""}`}>
              {a.quantiteRestante}<span className="text-muted-foreground font-normal">/{a.quantiteEntree}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase text-muted-foreground">Prix</div>
            <div className="text-sm font-bold text-primary">{formatMoney(a.prix, a.devise ?? "CDF")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticlesSection = () => {
  const { boutiques, articles: storeArticles, articlesLoading, fetchArticles, addArticle } = useBoutiqueStore();
  
  const [boutique, setBoutique] = useState<string>("all");
  const [statut, setStatut] = useState<StatutArticle | "all">("all");
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

  const nameOf = (id: string) => boutiques.find((b) => b.id === id)?.nom ?? "—";

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (boutique !== "all" && a.boutique_id !== boutique) return false;
      if (statut !== "all" && a.statut !== statut) return false;
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
  }, [articles, boutique, statut, code, nom, couleur, taille, categorie, promo, prixOp, prixVal, restOp, restVal, vendOp, vendVal]);

  const reset = () => {
    setBoutique("all"); setStatut("all"); setCode(""); setNom(""); setCouleur(""); setTaille("");
    setCategorie("all"); setPromo("all");
    setPrixOp("all"); setPrixVal(""); setRestOp("all"); setRestVal(""); setVendOp("all"); setVendVal("");
  };

  if (articlesLoading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-card border-border/60">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-2xl">Tous les articles</h2>
              <p className="text-sm text-muted-foreground">Recherche multicritères</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ExportButtons
              title="Articles"
              subtitle={`${filtered.length} article(s) filtré(s)`}
              columns={[
                { header: "Code", accessor: (a: Article) => a.code },
                { header: "Nom", accessor: (a: Article) => a.nom },
                { header: "Boutique", accessor: (a: Article) => nameOf(a.boutique_id) },
                { header: "Couleur", accessor: (a: Article) => a.couleur },
                { header: "Taille", accessor: (a: Article) => a.taille ?? "—" },
                { header: "Catégorie", accessor: (a: Article) => CATEGORIES.find((c) => c.value === a.categorie)?.label ?? "" },
                { header: "Restant", accessor: (a: Article) => a.quantiteRestante, align: "right" },
                { header: "Vendu", accessor: (a: Article) => a.quantiteVendue, align: "right" },
                { header: "Prix", accessor: (a: Article) => formatMoney(a.prix, a.devise ?? "CDF"), align: "right" },
                { header: "Promo", accessor: (a: Article) => a.promotions?.[0] ? `-${a.promotions[0].pourcentage}%` : "—" },
              ]}
              rows={filtered}
              imageAccessor={(a: Article) => a.photo}
              qrAccessor={(a: Article) => `${a.code}|${a.nom}`}
              disabled={filtered.length === 0}
            />
            <ArticleExcelImport boutiques={boutiques as any} onImport={(imported) => imported.forEach((a) => addArticle(a as any))} />
            <ArticleFormDialog boutiques={boutiques as any} onCreate={(a) => addArticle(a as any)} />
          </div>
        </div>

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
            <Label className="text-xs text-muted-foreground">Statut</Label>
            <Select value={statut} onValueChange={(v) => setStatut(v as any)}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {STATUTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Catégorie</Label>
            <Select value={categorie} onValueChange={setCategorie}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border border-border/60 bg-card/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Search className="h-4 w-4 text-primary" /> Filtres avancés
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
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
                <Input type="number" value={prixVal} onChange={(e) => setPrixVal(e.target.value)} disabled={prixOp === "all"} />
              </div>
            </div>
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

        <div className="text-sm text-muted-foreground mt-4">
          {filtered.length} article{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground border-dashed">
          Aucun article ne correspond aux filtres.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((a) => <ArticleCard key={a.id} a={a} boutiqueName={nameOf(a.boutique_id)} onZoom={setZoomArticle} />)}
        </div>
      )}

      <ImageLightbox
        open={!!zoomArticle}
        onOpenChange={(v) => !v && setZoomArticle(null)}
        images={zoomArticle?.photo ? [zoomArticle.photo] : []}
        title={zoomArticle?.nom}
      />
    </div>
  );
};

export default ArticlesSection;