import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import type { Boutique, Vente } from "@/lib/mockData";

interface Props {
  boutiques: Boutique[];
  ventes: Vente[];
}

const formatFCFA = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " F";

const VentesParBoutique = ({ boutiques, ventes }: Props) => {
  const data = boutiques
    .map((b) => {
      const vs = ventes.filter((v) => v.boutique_id === b.id);
      return {
        id: b.id,
        nom: b.nom,
        total: vs.reduce((s, v) => s + v.montant, 0),
        nb: vs.length,
      };
    })
    .sort((a, b) => b.total - a.total);

  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <Card className="p-6 shadow-card border-border/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-xl">Ventes par boutique</h2>
          <p className="text-sm text-muted-foreground">Performance comparée</p>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Aucune donnée.</p>
      ) : (
        <div className="space-y-4">
          {data.map((d) => (
            <div key={d.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{d.nom}</span>
                <span className="text-muted-foreground">
                  <span className="text-foreground font-semibold">{formatFCFA(d.total)}</span>
                  <span className="mx-2">·</span>
                  {d.nb} vente{d.nb > 1 ? "s" : ""}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-gradient-primary rounded-full transition-smooth"
                  style={{ width: `${(d.total / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default VentesParBoutique;
