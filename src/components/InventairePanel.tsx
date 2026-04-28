import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Package, CalendarRange } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Article, Boutique } from "@/lib/mockData";

interface Props {
  boutiques: Boutique[];
  articles: Article[];
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " F";
const toInputDate = (iso: string) => iso.slice(0, 10);

const InventairePanel = ({ boutiques, articles }: Props) => {
  // Période par défaut : derniers 30 jours
  const today = new Date();
  const past = new Date(today.getTime() - 30 * 86400000);
  const [from, setFrom] = useState(toInputDate(past.toISOString()));
  const [to, setTo] = useState(toInputDate(today.toISOString()));

  const filtered = useMemo(() => {
    const fromTs = +new Date(from);
    const toTs = +new Date(to) + 86400000; // inclure jour
    return articles.filter((a) => {
      const t = +new Date(a.date_ajout);
      return t >= fromTs && t <= toTs;
    });
  }, [articles, from, to]);

  const nameOf = (id: string) => boutiques.find((b) => b.id === id)?.nom ?? "—";
  const totalStock = filtered.reduce((s, a) => s + a.stock, 0);
  const totalValeur = filtered.reduce((s, a) => s + a.stock * a.prix, 0);

  return (
    <Card className="p-6 shadow-card border-border/60">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-xl">Inventaire</h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} articles · {totalStock} unités · {fmt(totalValeur)} en stock
            </p>
          </div>
        </div>

        <div className="flex items-end gap-2 flex-wrap">
          <CalendarRange className="h-4 w-4 text-primary mb-2.5" />
          <div>
            <Label htmlFor="from" className="text-xs text-muted-foreground">Du</Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 w-[150px]" />
          </div>
          <div>
            <Label htmlFor="to" className="text-xs text-muted-foreground">Au</Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-9 w-[150px]" />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Aucun article sur cette période.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Boutique</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Prix</TableHead>
                <TableHead className="text-right">Valeur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.nom}</TableCell>
                  <TableCell>{nameOf(a.boutique_id)}</TableCell>
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
    </Card>
  );
};

export default InventairePanel;
