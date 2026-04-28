import { Card } from "@/components/ui/card";
import { Store, ShoppingBag, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Article, Boutique, Vente } from "@/lib/mockData";

interface Props {
  boutique: Boutique;
  ventes: Vente[];
  articles: Article[];
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " F";
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

const BoutiqueDetail = ({ boutique, ventes, articles }: Props) => {
  const bVentes = ventes.filter((v) => v.boutique_id === boutique.id);
  const bArticles = articles.filter((a) => a.boutique_id === boutique.id);
  const ca = bVentes.reduce((s, v) => s + v.montant, 0);

  return (
    <Card className="p-6 shadow-card border-border/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Store className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-bold text-2xl">{boutique.nom}</h2>
          <p className="text-sm text-muted-foreground">
            {boutique.adresse ?? "—"} · {bVentes.length} ventes · {fmt(ca)} de CA
          </p>
        </div>
      </div>

      <Tabs defaultValue="ventes" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="ventes" className="gap-2">
            <ShoppingBag className="h-4 w-4" /> Ventes ({bVentes.length})
          </TabsTrigger>
          <TabsTrigger value="articles" className="gap-2">
            <Package className="h-4 w-4" /> Articles ({bArticles.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ventes">
          {bVentes.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">Aucune vente pour cette boutique.</p>
          ) : (
            <div className="overflow-x-auto">
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
            </div>
          )}
        </TabsContent>

        <TabsContent value="articles">
          {bArticles.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">Aucun article pour cette boutique.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Prix</TableHead>
                    <TableHead className="text-right">Valeur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bArticles.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.nom}</TableCell>
                      <TableCell><Badge variant="outline">{a.categorie}</Badge></TableCell>
                      <TableCell className="text-right">
                        <span className={a.stock <= 6 ? "text-rose-400 font-semibold" : ""}>{a.stock}</span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{fmt(a.prix)}</TableCell>
                      <TableCell className="text-right font-semibold">{fmt(a.stock * a.prix)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default BoutiqueDetail;
