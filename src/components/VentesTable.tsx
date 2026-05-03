import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Receipt, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import VentesFilters, { applyVentesFilters, emptyFilters, type VentesFilterState } from "./VentesFilters";
import VenteDetailDialog from "./VenteDetailDialog";
import type { Article, Boutique, Vente } from "@/lib/mockData";
import { formatMoney } from "@/lib/mockData";
import ExportButtons from "./ExportButtons";

interface Props {
  boutiques: Boutique[];
  ventes: Vente[];
  articles?: Article[];
  title?: string;
  showBoutique?: boolean;
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "2-digit" });

const VentesTable = ({ boutiques, ventes, articles = [], title = "Tableau des ventes", showBoutique = true }: Props) => {
  const [filters, setFilters] = useState<VentesFilterState>(emptyFilters);
  const [openVente, setOpenVente] = useState<Vente | null>(null);

  const filtered = applyVentesFilters(ventes, filters);
  const sorted = [...filtered].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const nameOf = (id: string) => boutiques.find((b) => b.id === id)?.nom ?? "—";
  const photoOf = (v: Vente) =>
    articles.find((a) => (v.code && a.code === v.code) || a.nom === v.article)?.photo ?? null;

  const totals = sorted.reduce<Record<string, number>>((acc, v) => {
    acc[v.devise] = (acc[v.devise] ?? 0) + v.montant;
    return acc;
  }, {});

  const exportColumns = [
    { header: "Date", accessor: (v: Vente) => fmtDate(v.date) },
    { header: "Code", accessor: (v: Vente) => v.code ?? "—" },
    { header: "Article", accessor: (v: Vente) => v.article },
    { header: "Couleur", accessor: (v: Vente) => v.couleur ?? "—" },
    ...(showBoutique ? [{ header: "Boutique", accessor: (v: Vente) => nameOf(v.boutique_id) }] : []),
    { header: "Qté", accessor: (v: Vente) => v.quantite, align: "right" as const },
    { header: "Montant", accessor: (v: Vente) => formatMoney(v.montant, v.devise), align: "right" as const },
  ];
  const exportTotals = Object.entries(totals).map(([dev, t]) => ({ label: `Total ${dev}`, value: formatMoney(t, dev as any) }));

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
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(totals).map(([dev, total]) => (
              <div key={dev} className="rounded-lg border border-border/60 bg-card/40 px-3 py-2">
                <div className="text-[10px] uppercase text-muted-foreground">Total {dev}</div>
                <div className="text-sm font-bold text-primary">{formatMoney(total, dev as any)}</div>
              </div>
            ))}
            <ExportButtons
              title={title}
              subtitle={`${sorted.length} transaction(s)`}
              columns={exportColumns}
              rows={sorted}
              totals={exportTotals}
              imageAccessor={(v: Vente) => photoOf(v)}
              disabled={sorted.length === 0}
            />
          </div>
        </div>

        {sorted.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">Aucune vente.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Photo</TableHead>
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
                {sorted.map((v) => {
                  const photo = photoOf(v);
                  return (
                    <TableRow
                      key={v.id}
                      onClick={() => setOpenVente(v)}
                      className="cursor-pointer hover:bg-muted/30"
                    >
                      <TableCell>
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted/40 flex items-center justify-center">
                          {photo ? (
                            <img src={photo} alt={v.article} className="h-full w-full object-cover" loading="lazy" />
                          ) : (
                            <ImageOff className="h-5 w-5 text-muted-foreground/60" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{fmtDate(v.date)}</TableCell>
                      <TableCell className="font-mono text-xs">{v.code ?? "—"}</TableCell>
                      <TableCell className="font-medium">{v.article}</TableCell>
                      <TableCell>{v.couleur ? <Badge variant="outline" className="text-[10px]">{v.couleur}</Badge> : "—"}</TableCell>
                      {showBoutique && <TableCell>{nameOf(v.boutique_id)}</TableCell>}
                      <TableCell className="text-right">{v.quantite}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">{formatMoney(v.montant, v.devise)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <VenteDetailDialog
        open={!!openVente}
        onOpenChange={(v) => !v && setOpenVente(null)}
        vente={openVente}
        boutiques={boutiques}
        articles={articles}
      />
    </div>
  );
};

export default VentesTable;
