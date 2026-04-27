import { useEffect, useState } from "react";
import { Store, Shield, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import AppHeader from "@/components/AppHeader";
import BoutiquesManager from "@/components/BoutiquesManager";
import UsersManager from "@/components/UsersManager";

interface ProfileInfo {
  full_name: string | null;
  boutique_nom: string | null;
}

const Dashboard = () => {
  const { user, role } = useAuth();
  const [info, setInfo] = useState<ProfileInfo>({ full_name: null, boutique_nom: null });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, boutiques(nom)")
        .eq("id", user.id)
        .maybeSingle();
      const boutiques = data?.boutiques as { nom: string } | { nom: string }[] | null | undefined;
      const boutiqueNom = Array.isArray(boutiques) ? boutiques[0]?.nom ?? null : boutiques?.nom ?? null;
      setInfo({
        full_name: data?.full_name ?? null,
        boutique_nom: boutiqueNom,
      });
    })();
  }, [user]);

  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="container py-8 space-y-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-dark p-8 shadow-elegant">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
              {isAdmin ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
              Espace {isAdmin ? "administrateur" : "vendeur"}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Bonjour <span className="text-gradient">{info.full_name || user?.email}</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              {isAdmin
                ? "Pilotez vos boutiques GAMA, créez vos équipes et attribuez-leur leur point de vente."
                : info.boutique_nom
                  ? `Vous gérez la boutique « ${info.boutique_nom} ».`
                  : "Aucune boutique ne vous est encore assignée. Contactez votre administrateur."}
            </p>
          </div>
        </section>

        {isAdmin ? (
          <>
            <BoutiquesManager />
            <UsersManager />
          </>
        ) : (
          <Card className="p-8 text-center shadow-card border-border/60">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Store className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-display font-bold text-2xl mb-2">
              {info.boutique_nom ?? "En attente d'assignation"}
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
