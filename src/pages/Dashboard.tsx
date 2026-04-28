import { useState, useMemo } from "react";
import { Shield, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar, { type SectionKey } from "@/components/AppSidebar";
import BoutiquesManager from "@/components/BoutiquesManager";
import UsersManager from "@/components/UsersManager";
import StatsCards from "@/components/StatsCards";
import VentesParBoutique from "@/components/VentesParBoutique";
import BoutiqueSelector from "@/components/BoutiqueSelector";
import VentesTable from "@/components/VentesTable";
import FinancesPanel from "@/components/FinancesPanel";
import InventaireSection from "@/components/InventaireSection";
import BoutiqueDetail from "@/components/BoutiqueDetail";
import {
  mockBoutiques, mockUsers, mockVentes, mockDepenses, mockArticles,
  currentMockUser, type AppUser, type Boutique, type Role,
} from "@/lib/mockData";

const SECTION_LABELS: Record<SectionKey, string> = {
  overview: "Vue d'ensemble",
  boutiques: "Boutiques",
  users: "Utilisateurs",
  ventes: "Ventes",
  finances: "Finances",
  inventaire: "Inventaire",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [boutiques, setBoutiques] = useState<Boutique[]>(mockBoutiques);
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [ventes] = useState(mockVentes);
  const [depenses] = useState(mockDepenses);
  const [articles, setArticles] = useState(mockArticles);
  const [currentUser, setCurrentUser] = useState<AppUser>(currentMockUser);
  const [selectedBoutique, setSelectedBoutique] = useState<string>("all");
  const [section, setSection] = useState<SectionKey>("overview");

  const isAdmin = currentUser.role === "admin";
  const currentBoutiqueName = useMemo(
    () => boutiques.find((b) => b.id === currentUser.boutique_id)?.nom ?? null,
    [boutiques, currentUser]
  );

  const isAll = selectedBoutique === "all";
  const fVentes = useMemo(() => isAll ? ventes : ventes.filter((v) => v.boutique_id === selectedBoutique), [ventes, selectedBoutique, isAll]);
  const fDepenses = useMemo(() => isAll ? depenses : depenses.filter((d) => d.boutique_id === selectedBoutique), [depenses, selectedBoutique, isAll]);
  const fUsers = useMemo(() => isAll ? users : users.filter((u) => u.boutique_id === selectedBoutique || u.role === "admin"), [users, selectedBoutique, isAll]);
  const fBoutiques = useMemo(() => isAll ? boutiques : boutiques.filter((b) => b.id === selectedBoutique), [boutiques, selectedBoutique, isAll]);
  const selectedBoutiqueObj = useMemo(() => isAll ? null : boutiques.find((b) => b.id === selectedBoutique) ?? null, [boutiques, selectedBoutique, isAll]);

  const handleSwitchRole = (role: Role) => {
    const target = users.find((u) => u.role === role) ?? currentUser;
    setCurrentUser(target);
  };

  const renderSection = () => {
    switch (section) {
      case "overview":
        return (
          <div className="space-y-6">
            <BoutiqueSelector boutiques={boutiques} value={selectedBoutique} onChange={setSelectedBoutique} />
            <StatsCards users={fUsers} boutiques={fBoutiques} ventes={fVentes} />
            <VentesParBoutique boutiques={fBoutiques} ventes={fVentes} />
            {selectedBoutiqueObj && (
              <BoutiqueDetail boutique={selectedBoutiqueObj} ventes={ventes} articles={articles as any} />
            )}
          </div>
        );
      case "boutiques":
        return <BoutiquesManager boutiques={boutiques} setBoutiques={setBoutiques} />;
      case "users":
        return <UsersManager users={users} setUsers={setUsers} boutiques={boutiques} />;
      case "ventes":
        return (
          <div className="space-y-6">
            <BoutiqueSelector boutiques={boutiques} value={selectedBoutique} onChange={setSelectedBoutique} />
            <VentesTable boutiques={boutiques} ventes={fVentes} />
          </div>
        );
      case "finances":
        return (
          <div className="space-y-6">
            <BoutiqueSelector boutiques={boutiques} value={selectedBoutique} onChange={setSelectedBoutique} />
            <FinancesPanel boutiques={boutiques} ventes={fVentes} depenses={fDepenses} />
          </div>
        );
      case "inventaire":
        return <InventaireSection boutiques={boutiques} articles={articles} setArticles={setArticles} />;
    }
  };

  if (!isAdmin) {
    // Vue vendeur (header simple, pas de sidebar)
    return (
      <div className="min-h-screen">
        <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="container flex h-16 items-center justify-between">
            <div className="font-bold">GAMA Boutique</div>
            <div className="flex items-center gap-3">
              <Select value={currentUser.role} onValueChange={(v) => handleSwitchRole(v as Role)}>
                <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="vendeur">Vendeur</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                <LogOut className="h-4 w-4" /> Quitter
              </Button>
            </div>
          </div>
        </header>
        <main className="container py-8">
          <Card className="p-8 text-center shadow-card border-border/60">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
              <User className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-bold text-2xl mb-2">{currentBoutiqueName ?? "En attente d'assignation"}</h2>
            <p className="text-muted-foreground">Votre interface de vente apparaîtra ici prochainement.</p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar active={section} onChange={setSection} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40 flex items-center px-4 gap-3">
            <SidebarTrigger />
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Admin</div>
              <div className="font-semibold leading-tight">{SECTION_LABELS[section]}</div>
            </div>
            <Select value={currentUser.role} onValueChange={(v) => handleSwitchRole(v as Role)}>
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
            <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
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
                    Bonjour <span className="text-gradient">{currentUser.full_name}</span>
                  </h1>
                  <p className="text-muted-foreground">Pilotez vos boutiques GAMA depuis ce tableau de bord.</p>
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
