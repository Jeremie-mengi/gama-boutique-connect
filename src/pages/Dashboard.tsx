import { useState, useMemo } from "react";
import { Store, Shield, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import AppHeader from "@/components/AppHeader";
import BoutiquesManager from "@/components/BoutiquesManager";
import UsersManager from "@/components/UsersManager";
import StatsCards from "@/components/StatsCards";
import VentesParBoutique from "@/components/VentesParBoutique";
import BoutiqueSelector from "@/components/BoutiqueSelector";
import VentesTable from "@/components/VentesTable";
import FinancesPanel from "@/components/FinancesPanel";
import InventairePanel from "@/components/InventairePanel";
import BoutiqueDetail from "@/components/BoutiqueDetail";
import {
  mockBoutiques,
  mockUsers,
  mockVentes,
  mockDepenses,
  mockArticles,
  currentMockUser,
  type AppUser,
  type Boutique,
  type Role,
} from "@/lib/mockData";

const Dashboard = () => {
  const [boutiques, setBoutiques] = useState<Boutique[]>(mockBoutiques);
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [ventes] = useState(mockVentes);
  const [depenses] = useState(mockDepenses);
  const [articles] = useState(mockArticles);
  const [currentUser, setCurrentUser] = useState<AppUser>(currentMockUser);
  const [selectedBoutique, setSelectedBoutique] = useState<string>("all");

  const currentBoutiqueName = useMemo(
    () => boutiques.find((b) => b.id === currentUser.boutique_id)?.nom ?? null,
    [boutiques, currentUser]
  );

  // Filtrage selon la boutique sélectionnée
  const isAll = selectedBoutique === "all";
  const fVentes = useMemo(
    () => (isAll ? ventes : ventes.filter((v) => v.boutique_id === selectedBoutique)),
    [ventes, selectedBoutique, isAll]
  );
  const fDepenses = useMemo(
    () => (isAll ? depenses : depenses.filter((d) => d.boutique_id === selectedBoutique)),
    [depenses, selectedBoutique, isAll]
  );
  const fArticles = useMemo(
    () => (isAll ? articles : articles.filter((a) => a.boutique_id === selectedBoutique)),
    [articles, selectedBoutique, isAll]
  );
  const fUsers = useMemo(
    () => (isAll ? users : users.filter((u) => u.boutique_id === selectedBoutique || u.role === "admin")),
    [users, selectedBoutique, isAll]
  );
  const fBoutiques = useMemo(
    () => (isAll ? boutiques : boutiques.filter((b) => b.id === selectedBoutique)),
    [boutiques, selectedBoutique, isAll]
  );
  const selectedBoutiqueObj = useMemo(
    () => (isAll ? null : boutiques.find((b) => b.id === selectedBoutique) ?? null),
    [boutiques, selectedBoutique, isAll]
  );

  const handleSwitchRole = (role: Role) => {
    const target = users.find((u) => u.role === role) ?? currentUser;
    setCurrentUser(target);
  };

  const isAdmin = currentUser.role === "admin";

  return (
    <div className="min-h-screen">
      <AppHeader user={currentUser} onSwitchRole={handleSwitchRole} />

      <main className="container py-8 space-y-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-dark p-8 shadow-elegant">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
              {isAdmin ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
              Espace {isAdmin ? "administrateur" : "vendeur"}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Bonjour <span className="text-gradient">{currentUser.full_name}</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              {isAdmin
                ? "Pilotez vos boutiques GAMA, suivez vos finances et votre inventaire."
                : currentBoutiqueName
                  ? `Vous gérez la boutique « ${currentBoutiqueName} ».`
                  : "Aucune boutique ne vous est encore assignée."}
            </p>
          </div>
        </section>

        {isAdmin ? (
          <>
            <BoutiqueSelector
              boutiques={boutiques}
              value={selectedBoutique}
              onChange={setSelectedBoutique}
            />

            <StatsCards users={fUsers} boutiques={fBoutiques} ventes={fVentes} />

            <VentesParBoutique boutiques={fBoutiques} ventes={fVentes} />

            {/* Vue dédiée d'une boutique : 2 sections (ventes + articles) */}
            {selectedBoutiqueObj && (
              <BoutiqueDetail
                boutique={selectedBoutiqueObj}
                ventes={ventes}
                articles={articles}
              />
            )}

            {/* Tableau global des ventes (filtré) */}
            <VentesTable boutiques={boutiques} ventes={fVentes} />

            {/* Finances : entrées / sorties */}
            <FinancesPanel boutiques={boutiques} ventes={fVentes} depenses={fDepenses} />

            {/* Inventaire avec période */}
            <InventairePanel boutiques={boutiques} articles={fArticles} />

            <BoutiquesManager boutiques={boutiques} setBoutiques={setBoutiques} />
            <UsersManager users={users} setUsers={setUsers} boutiques={boutiques} />
          </>
        ) : (
          <Card className="p-8 text-center shadow-card border-border/60">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Store className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-bold text-2xl mb-2">
              {currentBoutiqueName ?? "En attente d'assignation"}
            </h2>
            <p className="text-muted-foreground">
              Votre interface de vente apparaîtra ici dans les prochaines versions.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
