import { useState, useMemo } from "react";
import { Shield, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar, { type SectionKey } from "@/components/AppSidebar";
import { useAuthStore } from "@/store/authStore";
import BoutiquesManager from "@/components/BoutiquesManager";
import UsersManager from "@/components/UsersManager";
import StatsCards from "@/components/StatsCards";
import VentesParBoutique from "@/components/VentesParBoutique";
import BoutiqueSelector from "@/components/BoutiqueSelector";
import VentesTable from "@/components/VentesTable";
import FinancesPanel from "@/components/FinancesPanel";
import InventaireSection from "@/components/InventaireSection";
import ArticlesSection from "@/components/ArticlesSection";
import RapportSection from "@/components/RapportSection";
import BoutiqueDetail from "@/components/BoutiqueDetail";
import BoutiqueDetailView from "@/components/BoutiqueDetailView";
import {
  mockBoutiques,
  mockUsers,
  mockVentes,
  mockDepenses,
  mockArticles,
  type AppUser,
  type Boutique,
  type Role,
} from "@/lib/mockData";

const SECTION_LABELS: Record<SectionKey, string> = {
  overview: "Vue d'ensemble",
  boutiques: "Boutiques",
  articles: "Articles",
  users: "Utilisateurs",
  ventes: "Ventes",
  finances: "Finances",
  inventaire: "Inventaire",
  rapport: "Rapport",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [boutiques, setBoutiques] = useState<Boutique[]>(mockBoutiques);
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [ventes, setVentes] = useState(mockVentes);
  const [depenses, setDepenses] = useState(mockDepenses);
  const [articles, setArticles] = useState(mockArticles);
  const [selectedBoutique, setSelectedBoutique] = useState<string>("all");
  const [section, setSection] = useState<SectionKey>("overview");
  const [openedBoutiqueId, setOpenedBoutiqueId] = useState<string | null>(null);
  const currentUser = useAuthStore((state) => state.user);

  const isAll = selectedBoutique === "all";
  const fVentes = useMemo(
    () =>
      isAll ? ventes : ventes.filter((v) => v.boutique_id === selectedBoutique),
    [ventes, selectedBoutique, isAll],
  );
  const fDepenses = useMemo(
    () =>
      isAll
        ? depenses
        : depenses.filter((d) => d.boutique_id === selectedBoutique),
    [depenses, selectedBoutique, isAll],
  );
  const fUsers = useMemo(
    () =>
      isAll
        ? users
        : users.filter(
            (u) => u.boutique_id === selectedBoutique || u.role === "admin",
          ),
    [users, selectedBoutique, isAll],
  );
  const fBoutiques = useMemo(
    () =>
      isAll ? boutiques : boutiques.filter((b) => b.id === selectedBoutique),
    [boutiques, selectedBoutique, isAll],
  );
  const selectedBoutiqueObj = useMemo(
    () =>
      isAll ? null : (boutiques.find((b) => b.id === selectedBoutique) ?? null),
    [boutiques, selectedBoutique, isAll],
  );
  const logout = useAuthStore((state) => state.logout);
  const handleSwitchRole = (role: string) => {
    if (role === "VENDEUR") {
      navigate("/user-boutique");
      return;
    }

    navigate("/dashboard");
  };

  const renderSection = () => {
    switch (section) {
      case "overview":
        return (
          <div className="space-y-6">
            <BoutiqueSelector
              value={selectedBoutique}
              onChange={setSelectedBoutique}
            />
            <StatsCards />
            <VentesParBoutique />
            {selectedBoutiqueObj && (
              <BoutiqueDetail
                boutique={selectedBoutiqueObj}
                ventes={ventes}
                articles={articles as any}
              />
            )}
          </div>
        );
      case "boutiques": {
        const opened = openedBoutiqueId
          ? boutiques.find((b) => b.id === openedBoutiqueId)
          : null;
        if (opened) {
          return (
            <BoutiqueDetailView
              boutique={opened}
              ventes={ventes}
              articles={articles}
              users={users}
              onBack={() => setOpenedBoutiqueId(null)}
              onCreateArticle={(a) => setArticles((prev) => [a, ...prev])}
            />
          );
        }
        return (
          <BoutiquesManager
            onSelect={setOpenedBoutiqueId}
          />
        );
      }
      case "users":
        return <UsersManager />;
      case "ventes":
        return (
          <div className="space-y-6">
            <BoutiqueSelector
              value={selectedBoutique}
              onChange={setSelectedBoutique}
            />
            <VentesTable
              boutiques={boutiques}
              ventes={fVentes}
              articles={articles}
              defaultBoutiqueId={isAll ? undefined : selectedBoutique}
              onCreate={(newVentes) => setVentes((prev) => [...newVentes, ...prev])}
            />
          </div>
        );
      case "finances":
        return (
          <div className="space-y-6">
            <BoutiqueSelector
              value={selectedBoutique}
              onChange={setSelectedBoutique}
            />
            <FinancesPanel
              boutiques={boutiques}
              ventes={fVentes}
              depenses={fDepenses}
              setDepenses={setDepenses}
            />
          </div>
        );
      case "inventaire":
        return <InventaireSection />;
      case "articles":
        return <ArticlesSection />;
      case "rapport":
        return <RapportSection />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar
          active={section}
          onChange={(k) => {
            setSection(k);
            setOpenedBoutiqueId(null);
          }}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40 flex items-center px-4 gap-3">
            <SidebarTrigger />
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Admin
              </div>
              <div className="font-semibold leading-tight">
                {SECTION_LABELS[section]}
              </div>
            </div>
            <Select value={currentUser?.role} onValueChange={handleSwitchRole}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>

                <SelectItem value="VENDEUR">Vendeur</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium">{currentUser?.nom}</span>
              <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                {currentUser?.role}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate("/auth");
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Quitter</span>
            </Button>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {section === "overview" && (
              <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-dark p-6 shadow-elegant">
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
                    <Shield className="h-3 w-3" /> Espace administrateur
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Bonjour{" "}
                    <span className="text-gradient">{currentUser?.nom}</span>
                  </h1>
                  <p className="text-muted-foreground">
                    Pilotez vos boutiques GAMA depuis ce tableau de bord.
                  </p>
                </div>
              </section>
            )}
            {renderSection()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
