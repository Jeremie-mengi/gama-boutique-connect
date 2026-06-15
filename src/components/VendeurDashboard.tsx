import { useState, useMemo } from "react";
import { LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import VendeurSidebar, { type VendeurSection } from "./VendeurSidebar";
import VendeurStats from "./VendeurStats";
import ArticlesSection from "./ArticlesSection";
import VentesTable from "./VentesTable";
import FinancesPanel from "./FinancesPanel";
import RapportSection from "./RapportSection";
import type { AppUser, Article, Boutique, Depense, Role, Vente } from "@/lib/mockData";

const LABELS: Record<VendeurSection, string> = {
  overview: "Vue d'ensemble",
  articles: "Articles",
  ventes: "Ventes",
  finances: "Finances",
  rapport: "Rapport",
};

interface Props {
  currentUser: AppUser;
  boutiqueName: string | null;
  articles: Article[];
  ventes: Vente[];
  depenses: Depense[];
  boutiques: Boutique[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  setDepenses: React.Dispatch<React.SetStateAction<Depense[]>>;
  onSwitchRole: (r: Role) => void;
  onLogout: () => void;
}

const VendeurDashboard = ({
  currentUser, boutiqueName, articles, ventes, depenses, boutiques,
  setArticles, setDepenses, onSwitchRole, onLogout,
}: Props) => {
  const [section, setSection] = useState<VendeurSection>("overview");

  const myBoutiques = useMemo(
    () => (currentUser.boutique_id ? boutiques.filter((b) => b.id === currentUser.boutique_id) : boutiques),
    [boutiques, currentUser.boutique_id]
  );

  const renderSection = () => {
    switch (section) {
      case "overview":
        return (
          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-dark p-6 shadow-elegant">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
                  <Shield className="h-3 w-3" /> {boutiqueName ?? "Boutique"}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Bonjour <span className="text-gradient">{currentUser.full_name}</span>
                </h1>
                <p className="text-muted-foreground">Suivi de votre boutique en temps réel.</p>
              </div>
            </section>
            <VendeurStats articles={articles} ventes={ventes} depenses={depenses} />
          </div>
        );
      case "articles":
        return <ArticlesSection />;
      case "ventes":
        return <VentesTable boutiques={myBoutiques} ventes={ventes} articles={articles} showBoutique={false} />;
      case "finances":
        return <FinancesPanel boutiques={myBoutiques} ventes={ventes} depenses={depenses} setDepenses={setDepenses} />;
      case "rapport":
        return <RapportSection />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <VendeurSidebar active={section} onChange={setSection} boutiqueName={boutiqueName} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40 flex items-center px-4 gap-3">
            <SidebarTrigger />
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-wider text-muted-foreground truncate">{boutiqueName ?? "Vendeur"}</div>
              <div className="font-semibold leading-tight truncate">{LABELS[section]}</div>
            </div>
            <Select value={currentUser.role} onValueChange={(v) => onSwitchRole(v as Role)}>
              <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="vendeur">Vendeur</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium">{currentUser.full_name}</span>
              <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">{currentUser.role}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Quitter</span>
            </Button>
          </header>
          <main className="flex-1 p-6 space-y-6">{renderSection()}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default VendeurDashboard;
