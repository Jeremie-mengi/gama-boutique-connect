import { ArrowLeft, Store, Package, ShoppingBag, User, MapPin, Phone, ImageOff, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ArticleFormDialog from "./ArticleFormDialog";
import {
  type Article, type AppUser, type Boutique, type Vente,
  CATEGORIES,
} from "@/lib/mockData";

interface Props {
  boutique: Boutique;
  ventes: Vente[];
  articles: Article[];
  users: AppUser[];
  onBack: () => void;
  onCreateArticle: (a: Article) => void;
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " F";
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

// Colonnes Kanban basées sur le statut de stock
const COLUMNS = [
  { key: "EN_STOCK", title: "En stock", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
  { key: "RESERVE", title: "Réservés", color: "bg-amber-500/10 border-amber-500/30 text-amber-400" },
  { key: "RUPTURE", title: "Rupture", color: "bg-rose-500/10 border-rose-500/30 text-rose-400" },
  { key: "RETIRE", title: "Retirés", color: "bg-muted/40 border-border text-muted-foreground" },
] as const;

const ArticleCard = ({ a }: { a: Article }) => {
  const promo = a.promotions[0];
  const lowStock = a.quantiteRestante <= 6;
  return (
    <div className="group rounded-xl border border-border/60 bg-card overflow-hidden shadow-card hover:shadow-glow hover:border-primary/40 transition-all">
      {/* Image grande et lisible */}
      <div className="relative aspect-square bg-gradient-to-br from-muted/40 to-muted/10 flex items-center justify-center overflow-hidden">
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
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold leading-tight line-clamp-2 text-sm">{a.nom}</h4>
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
            <div className="text-sm font-bold text-primary">{fmt(a.prix)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BoutiqueDetailView = ({ boutique, ventes, articles, users, onBack, onCreateArticle }: Props) => {
  const bVentes = ventes.filter((v) => v.boutique_id === boutique.id);
  const bArticles = articles.filter((a) => a.boutique_id === boutique.id);
  const bUsers = users.filter((u) => u.boutique_id === boutique.id);
  const ca = bVentes.reduce((s, v) => s + v.montant, 0);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
        <ArrowLeft className="h-4 w-4" /> Retour aux boutiques
      </Button>

      {/* En-tête boutique */}
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
              <div className="text-xs uppercase text-muted-foreground">CA</div>
              <div className="text-xl font-bold text-primary">{fmt(ca)}</div>
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
          <ArticleFormDialog
            boutiques={[boutique]}
            lockedBoutiqueId={boutique.id}
            onCreate={onCreateArticle}
          />
        </div>

        {/* KANBAN ARTICLES */}
        <TabsContent value="articles">
          {bArticles.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground border-dashed">
              Aucun article. Créez-en un avec le bouton ci-dessus.
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {COLUMNS.map((col) => {
                const items = bArticles.filter((a) => a.statut === col.key);
                return (
                  <div key={col.key} className="rounded-xl bg-card/40 border border-border/60 p-3 flex flex-col min-h-[200px]">
                    <div className={`flex items-center justify-between rounded-lg border px-3 py-2 mb-3 ${col.color}`}>
                      <span className="text-xs font-bold uppercase tracking-wide">{col.title}</span>
                      <span className="text-xs font-bold">{items.length}</span>
                    </div>
                    <div className="space-y-3 flex-1">
                      {items.length === 0 ? (
                        <div className="text-xs text-muted-foreground/60 text-center py-6">—</div>
                      ) : items.map((a) => <ArticleCard key={a.id} a={a} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* VENTES */}
        <TabsContent value="ventes">
          <Card className="p-4 shadow-card border-border/60">
            {bVentes.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">Aucune vente.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Article</TableHead>
                    <TableHead className="text-right">Qté</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...bVentes].sort((a, b) => +new Date(b.date) - +new Date(a.date)).map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="text-muted-foreground">{fmtDate(v.date)}</TableCell>
                      <TableCell className="font-medium">{v.article}</TableCell>
                      <TableCell className="text-right">{v.quantite}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">{fmt(v.montant)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
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
    </div>
  );
};

export default BoutiqueDetailView;
