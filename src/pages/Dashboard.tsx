import { useState, useMemo } from "react";
import { Store, Shield, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import AppHeader from "@/components/AppHeader";
import BoutiquesManager from "@/components/BoutiquesManager";
import UsersManager from "@/components/UsersManager";
import StatsCards from "@/components/StatsCards";
import VentesParBoutique from "@/components/VentesParBoutique";
import {
  mockBoutiques,
  mockUsers,
  mockVentes,
  currentMockUser,
  type AppUser,
  type Boutique,
  type Role,
} from "@/lib/mockData";

const Dashboard = () => {
  const [boutiques, setBoutiques] = useState<Boutique[]>(mockBoutiques);
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [ventes] = useState(mockVentes);
  const [currentUser, setCurrentUser] = useState<AppUser>(currentMockUser);

  const currentBoutiqueName = useMemo(
    () => boutiques.find((b) => b.id === currentUser.boutique_id)?.nom ?? null,
    [boutiques, currentUser]
  );

  const handleSwitchRole = (role: Role) => {
    // Bascule la vue maquette : prend le 1er user du rôle choisi
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
                ? "Pilotez vos boutiques GAMA, créez vos équipes et attribuez-leur leur point de vente."
                : currentBoutiqueName
                  ? `Vous gérez la boutique « ${currentBoutiqueName} ».`
                  : "Aucune boutique ne vous est encore assignée."}
            </p>
          </div>
        </section>

        {isAdmin ? (
          <>
            <StatsCards users={users} boutiques={boutiques} ventes={ventes} />
            <VentesParBoutique boutiques={boutiques} ventes={ventes} />
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
