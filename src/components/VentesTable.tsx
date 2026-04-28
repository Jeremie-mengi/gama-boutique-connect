import { Card } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Boutique, Vente } from "@/lib/mockData";

interface Props {
  boutiques: Boutique[];
  ventes: Vente[];
  title?: string;
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " F";
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

const VentesTable = ({ boutiques, ventes, title = "Tableau des ventes" }: Props) => {
  const sorted = [...ventes].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const nameOf = (id: string) => boutiques.find((b) => b.id === id)?.nom ?? "—";

  return (
    <Card className="p-6 shadow-card border-border/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Receipt className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-xl">{title}</h2>
          <p className="text-sm text-muted-foreground">{sorted.length} transaction{sorted.length > 1 ? "s" : ""}</p>
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
                <TableHead>Boutique</TableHead>
                <TableHead>Article</TableHead>
                <TableHead className="text-right">Qté</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="text-muted-foreground">{fmtDate(v.date)}</TableCell>
                  <TableCell>{nameOf(v.boutique_id)}</TableCell>
                  <TableCell className="font-medium">{v.article}</TableCell>
                  <TableCell className="text-right">{v.quantite}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">{fmt(v.montant)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default VentesTable;
