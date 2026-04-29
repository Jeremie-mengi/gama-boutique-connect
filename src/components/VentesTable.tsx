import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import VentesFilters, { applyVentesFilters, emptyFilters, type VentesFilterState } from "./VentesFilters";
import type { Boutique, Vente } from "@/lib/mockData";
import { formatMoney } from "@/lib/mockData";

interface Props {
  boutiques: Boutique[];
  ventes: Vente[];
  title?: string;
  showBoutique?: boolean;
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "2-digit" });

const VentesTable = ({ boutiques, ventes, title = "Tableau des ventes", showBoutique = true }: Props) => {
  const [filters, setFilters] = useState<VentesFilterState>(emptyFilters);
  const filtered = applyVentesFilters(ventes, filters);
  const sorted = [...filtered].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const nameOf = (id: string) => boutiques.find((b) => b.id === id)?.nom ?? "—";

  // Totaux par devise
  const totals = sorted.reduce<Record<string, number>>((acc, v) => {
    acc[v.devise] = (acc[v.devise] ?? 0) + v.montant;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <VentesFilters value={filters} onChange={setFilters} />

      <Card className="p-6 shadow-card border-border/60">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-xl">{title}</h2>
              <p className="text-sm text-muted-foreground">{sorted.length} transaction{sorted.length > 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(totals).map(([dev, total]) => (
              <div key={dev} className="rounded-lg border border-border/60 bg-card/40 px-3 py-2">
                <div className="text-[10px] uppercase text-muted-foreground">Total {dev}</div>
                <div className="text-sm font-bold text-primary">{formatMoney(total, dev as any)}</div>
              </div>
            ))}
          </div>
        </div>

        {sorted.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">Aucune vente.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead>Couleur</TableHead>
                  {showBoutique && <TableHead>Boutique</TableHead>}
                  <TableHead className="text-right">Qté</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="text-muted-foreground">{fmtDate(v.date)}</TableCell>
                    <TableCell className="font-mono text-xs">{v.code ?? "—"}</TableCell>
                    <TableCell className="font-medium">{v.article}</TableCell>
                    <TableCell>{v.couleur ? <Badge variant="outline" className="text-[10px]">{v.couleur}</Badge> : "—"}</TableCell>
                    {showBoutique && <TableCell>{nameOf(v.boutique_id)}</TableCell>}
                    <TableCell className="text-right">{v.quantite}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{formatMoney(v.montant, v.devise)}</TableCell>
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

export default VentesTable;
