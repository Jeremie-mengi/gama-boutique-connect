import { Users, Store, TrendingUp, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { AppUser, Boutique, Vente } from "@/lib/mockData";

interface Props {
  users: AppUser[];
  boutiques: Boutique[];
  ventes: Vente[];
}

const formatFCFA = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " F";

const StatsCards = ({ users, boutiques, ventes }: Props) => {
  const totalCA = ventes.reduce((s, v) => s + v.montant, 0);
  const nbVentes = ventes.length;
  const panierMoyen = nbVentes ? Math.round(totalCA / nbVentes) : 0;

  const stats = [
    {
      label: "Utilisateurs",
      value: users.length,
      sub: `${users.filter((u) => u.role === "vendeur").length} vendeurs · ${users.filter((u) => u.role === "admin").length} admin`,
      icon: Users,
    },
    {
      label: "Boutiques",
      value: boutiques.length,
      sub: `${users.filter((u) => u.boutique_id).length} users assignés`,
      icon: Store,
    },
    {
      label: "Ventes",
      value: nbVentes,
      sub: `Panier moyen ${formatFCFA(panierMoyen)}`,
      icon: ShoppingBag,
    },
    {
      label: "Chiffre d'affaires",
      value: formatFCFA(totalCA),
      sub: "Cumulé toutes boutiques",
      icon: TrendingUp,
      highlight: true,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card
          key={s.label}
          className={`p-5 shadow-card border-border/60 relative overflow-hidden group transition-smooth hover:border-primary/40 ${
            s.highlight ? "bg-gradient-dark" : ""
          }`}
        >
          {s.highlight && (
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
          )}
          <div className="relative flex items-start justify-between mb-4">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                s.highlight ? "bg-gradient-primary shadow-glow" : "bg-primary/10"
              }`}
            >
              <s.icon
                className={`h-5 w-5 ${s.highlight ? "text-primary-foreground" : "text-primary"}`}
              />
            </div>
          </div>
          <div className="relative">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
              {s.label}
            </div>
            <div className={`text-2xl md:text-3xl font-bold ${s.highlight ? "text-gradient" : ""}`}>
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1.5">{s.sub}</div>
          </div>
        </Card>
      ))}
    </section>
  );
};

export default StatsCards;
