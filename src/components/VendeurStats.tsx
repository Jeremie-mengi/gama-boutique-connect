import { Card } from "@/components/ui/card";
import { Shirt, ShoppingBag, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import type { Article, Vente, Depense, Devise } from "@/lib/mockData";
import { formatMoney } from "@/lib/mockData";

interface Props {
  articles: Article[];
  ventes: Vente[];
  depenses: Depense[];
}

const sumByDevise = (rows: { montant: number; devise: Devise }[]) => {
  const acc: Record<Devise, number> = { USD: 0, CDF: 0, EUR: 0 };
  rows.forEach((r) => { acc[r.devise] = (acc[r.devise] ?? 0) + r.montant; });
  return acc;
};

const renderTotals = (acc: Record<Devise, number>) => {
  const parts = (Object.keys(acc) as Devise[]).filter((d) => acc[d] > 0);
  if (parts.length === 0) return "—";
  return parts.map((d) => formatMoney(acc[d], d)).join(" · ");
};

const VendeurStats = ({ articles, ventes, depenses }: Props) => {
  const stockTotal = articles.reduce((s, a) => s + a.quantiteRestante, 0);
  const ca = sumByDevise(ventes.map((v) => ({ montant: v.montant, devise: v.devise })));
  const entrees = sumByDevise(depenses.filter((d) => d.type === "entree"));
  const sorties = sumByDevise(depenses.filter((d) => d.type === "sortie"));

  // Add ventes to entrées
  (Object.keys(ca) as Devise[]).forEach((d) => { entrees[d] = (entrees[d] ?? 0) + ca[d]; });

  const cards = [
    {
      label: "Articles",
      value: articles.length,
      sub: `${stockTotal} unités en stock`,
      icon: Shirt,
      highlight: false,
    },
    {
      label: "Ventes",
      value: ventes.length,
      sub: renderTotals(ca),
      icon: ShoppingBag,
      highlight: true,
    },
    {
      label: "Entrées",
      value: renderTotals(entrees),
      sub: "Ventes + apports",
      icon: ArrowDownCircle,
      highlight: false,
    },
    {
      label: "Sorties",
      value: renderTotals(sorties),
      sub: "Dépenses cumulées",
      icon: ArrowUpCircle,
      highlight: false,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((s) => (
        <Card
          key={s.label}
          className={`p-5 shadow-card border-border/60 relative overflow-hidden ${s.highlight ? "bg-gradient-dark" : ""}`}
        >
          {s.highlight && (
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
          )}
          <div className="relative flex items-start justify-between mb-4">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.highlight ? "bg-gradient-primary shadow-glow" : "bg-primary/10"}`}>
              <s.icon className={`h-5 w-5 ${s.highlight ? "text-primary-foreground" : "text-primary"}`} />
            </div>
          </div>
          <div className="relative">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">{s.label}</div>
            <div className={`text-xl md:text-2xl font-bold break-words ${s.highlight ? "text-gradient" : ""}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1.5">{s.sub}</div>
          </div>
        </Card>
      ))}
    </section>
  );
};

export default VendeurStats;
