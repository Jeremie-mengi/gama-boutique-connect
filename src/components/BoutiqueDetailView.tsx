import { useState } from "react";
import { ArrowLeft, Store, Package, ShoppingBag, User, MapPin, Phone, ImageOff, Tag, FileDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ArticleFormDialog from "./ArticleFormDialog";
import VentesTable from "./VentesTable";
import ImageLightbox from "./ImageLightbox";
import { exportToPdf } from "@/lib/pdfExport";
import {
  type Article, type AppUser, type Boutique, type Vente, type StatutArticle,
  CATEGORIES, STATUTS, formatMoney,
} from "@/lib/mockData";

interface Props {
  boutique: Boutique;
  ventes: Vente[];
  articles: Article[];
  users: AppUser[];
  onBack: () => void;
  onCreateArticle: (a: Article) => void;
}

const ArticleCard = ({ a, onZoom }: { a: Article; onZoom: (a: Article) => void }) => {
  const promo = a.promotions[0];
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
        <h4 className="font-semibold leading-tight line-clamp-2 text-sm">{a.nom}</h4>
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

const STATUT_COLORS: Record<StatutArticle, string> = {
  EN_STOCK: "text-emerald-400",
  RESERVE: "text-amber-400",
  RUPTURE: "text-rose-400",
  RETIRE: "text-muted-foreground",
};

const BoutiqueDetailView = ({ boutique, ventes, articles, users, onBack, onCreateArticle }: Props) => {
  const bVentes = ventes.filter((v) => v.boutique_id === boutique.id);
  const bArticles = articles.filter((a) => a.boutique_id === boutique.id);
  const bUsers = users.filter((u) => u.boutique_id === boutique.id);

  const [statutFilter, setStatutFilter] = useState<StatutArticle | "all">("EN_STOCK");
  const [zoomArticle, setZoomArticle] = useState<Article | null>(null);
  const visibleArticles = statutFilter === "all" ? bArticles : bArticles.filter((a) => a.statut === statutFilter);

  // Compteurs par statut
  const counts = STATUTS.reduce<Record<string, number>>((acc, s) => {
    acc[s.value] = bArticles.filter((a) => a.statut === s.value).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
        <ArrowLeft className="h-4 w-4" /> Retour aux boutiques
      </Button>

      <Card className="p-6 shadow-card border-border/60 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Store className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{boutique.nom}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                {boutique.adresse && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {boutique.adresse}</span>}
                {boutique.telephone && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {boutique.telephone}</span>}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="px-4">
              <div className="text-xs uppercase text-muted-foreground">Articles</div>
              <div className="text-xl font-bold">{bArticles.length}</div>
            </div>
            <div className="px-4 border-l border-border">
              <div className="text-xs uppercase text-muted-foreground">Ventes</div>
              <div className="text-xl font-bold">{bVentes.length}</div>
            </div>
            <div className="px-4 border-l border-border">
              <div className="text-xs uppercase text-muted-foreground">Vendeurs</div>
              <div className="text-xl font-bold">{bUsers.length}</div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="articles" className="w-full">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <TabsList>
            <TabsTrigger value="articles" className="gap-2"><Package className="h-4 w-4" /> Articles ({bArticles.length})</TabsTrigger>
            <TabsTrigger value="ventes" className="gap-2"><ShoppingBag className="h-4 w-4" /> Ventes ({bVentes.length})</TabsTrigger>
            <TabsTrigger value="vendeur" className="gap-2"><User className="h-4 w-4" /> Vendeur ({bUsers.length})</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportToPdf({
                  title: `Articles · ${boutique.nom}`,
                  subtitle: `${visibleArticles.length} article(s)`,
                  columns: [
                    { header: "Code", accessor: (a: Article) => a.code },
                    { header: "Nom", accessor: (a) => a.nom },
                    { header: "Couleur", accessor: (a) => a.couleur },
                    { header: "Taille", accessor: (a) => a.taille ?? "—" },
                    { header: "Statut", accessor: (a) => STATUTS.find((s) => s.value === a.statut)?.label ?? "" },
                    { header: "Restant", accessor: (a) => a.quantiteRestante, align: "right" },
                    { header: "Prix", accessor: (a) => formatMoney(a.prix, a.devise ?? "CDF"), align: "right" },
                  ],
                  rows: visibleArticles,
                })
              }
              disabled={visibleArticles.length === 0}
            >
              <FileDown className="h-4 w-4" /> PDF
            </Button>
            <ArticleFormDialog
              boutiques={[boutique]}
              lockedBoutiqueId={boutique.id}
              onCreate={onCreateArticle}
            />
          </div>
        </div>

        {/* ARTICLES — Kanban une seule colonne avec filtre statut */}
        <TabsContent value="articles">
          <Card className="p-4 shadow-card border-border/60 mb-4">
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex-1 min-w-[220px]">
                <Label className="text-xs text-muted-foreground">Filtrer par statut</Label>
                <Select value={statutFilter} onValueChange={(v) => setStatutFilter(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les articles ({bArticles.length})</SelectItem>
                    {STATUTS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        <span className={STATUT_COLORS[s.value]}>{s.label}</span> ({counts[s.value] ?? 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                {visibleArticles.length} article{visibleArticles.length > 1 ? "s" : ""} affiché{visibleArticles.length > 1 ? "s" : ""}
              </div>
            </div>
          </Card>

          {visibleArticles.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground border-dashed">
              Aucun article pour ce statut.
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleArticles.map((a) => <ArticleCard key={a.id} a={a} onZoom={setZoomArticle} />)}
            </div>
          )}
        </TabsContent>

        {/* VENTES — VentesTable avec filtres */}
        <TabsContent value="ventes">
          <VentesTable
            boutiques={[boutique]}
            ventes={bVentes}
            articles={bArticles}
            title={`Ventes · ${boutique.nom}`}
            showBoutique={false}
          />
        </TabsContent>

        {/* VENDEUR */}
        <TabsContent value="vendeur">
          <Card className="p-6 shadow-card border-border/60">
            {bUsers.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">Aucun vendeur lié à cette boutique.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {bUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-4 bg-card/40">
                    <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{u.full_name}</div>
                      <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                    </div>
                    <Badge variant="outline" className="uppercase text-[10px]">{u.role}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <ImageLightbox
        open={!!zoomArticle}
        onOpenChange={(v) => !v && setZoomArticle(null)}
        images={zoomArticle?.photo ? [zoomArticle.photo] : []}
        title={zoomArticle?.nom}
      />
    </div>
  );
};

export default BoutiqueDetailView;
