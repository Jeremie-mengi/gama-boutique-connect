import { Card } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Boutique, Depense, Vente } from "@/lib/mockData";

interface Props {
  boutiques: Boutique[];
  ventes: Vente[];
  depenses: Depense[];
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " F";
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

const FinancesPanel = ({ boutiques, ventes, depenses }: Props) => {
  const entrees = ventes.reduce((s, v) => s + v.montant, 0);
  const sorties = depenses.reduce((s, d) => s + d.montant, 0);
  const solde = entrees - sorties;
  const nameOf = (id: string) => boutiques.find((b) => b.id === id)?.nom ?? "—";

  const stats = [
    { label: "Entrées", value: entrees, icon: ArrowUpCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Sorties", value: sorties, icon: ArrowDownCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
    { label: "Solde net", value: solde, icon: Wallet, color: solde >= 0 ? "text-primary" : "text-rose-400", bg: "bg-primary/10", highlight: true },
  ];

  return (
    <Card className="p-6 shadow-card border-border/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-xl">Finances</h2>
          <p className="text-sm text-muted-foreground">Entrées & sorties</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border border-border/60 p-4 ${s.highlight ? "bg-gradient-dark" : "bg-card/40"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${s.bg}`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
            </div>
            <div className={`text-xl md:text-2xl font-bold ${s.color}`}>{fmt(s.value)}</div>
          </div>
        ))}
      </div>

      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Dépenses</h3>
      {depenses.length === 0 ? (
        <p className="text-muted-foreground text-sm py-6 text-center">Aucune dépense.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Boutique</TableHead>
                <TableHead>Libellé</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...depenses].sort((a, b) => +new Date(b.date) - +new Date(a.date)).map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="text-muted-foreground">{fmtDate(d.date)}</TableCell>
                  <TableCell>{nameOf(d.boutique_id)}</TableCell>
                  <TableCell className="font-medium">{d.libelle}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{d.categorie}</Badge></TableCell>
                  <TableCell className="text-right font-semibold text-rose-400">- {fmt(d.montant)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default FinancesPanel;
