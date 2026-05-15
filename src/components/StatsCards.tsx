import { useEffect, useState } from "react";
import { Users, Store, TrendingUp, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface DashboardStats {
  totalUsers: number;
  vendeurs: number;
  admins: number;
  usersWithBoutique: number;
  totalBoutiques: number;
  totalVentes: number;
  totalCA: number;
  panierMoyen: number;
}

interface User {
  id: string;
  nom: string;
  email: string;
  role: string;
  boutique?: any[];
}

interface Boutique {
  id: string;
  nom: string;
  emplacement: string;
}

interface Vente {
  id: string;
  totalVente: number;
  devise: string;
  boutiqueId: string;
  vendeurId: string;
  createdAt: string;
}

const formatFCFA = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " F";

const StatsCards = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    vendeurs: 0,
    admins: 0,
    usersWithBoutique: 0,
    totalBoutiques: 0,
    totalVentes: 0,
    totalCA: 0,
    panierMoyen: 0,
  });

  // Récupérer tous les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await api.get("/user/all");
      const users: User[] = response.data.data;
      
      const vendeurs = users.filter((u) => u.role === "VENDEUR").length;
      const admins = users.filter((u) => u.role === "ADMIN").length;
      const usersWithBoutique = users.filter((u) => u.boutique && u.boutique.length > 0).length;
      
      return { users: users.length, vendeurs, admins, usersWithBoutique };
    } catch (error) {
      console.error("Erreur chargement users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
      return { users: 0, vendeurs: 0, admins: 0, usersWithBoutique: 0 };
    }
  };

  // Récupérer toutes les boutiques
  const fetchBoutiques = async () => {
    try {
      const response = await api.get("/boutiques/all");
      const boutiques: Boutique[] = response.data.data;
      return boutiques.length;
    } catch (error) {
      console.error("Erreur chargement boutiques:", error);
      toast.error("Erreur lors du chargement des boutiques");
      return 0;
    }
  };

  // Récupérer toutes les ventes
  const fetchVentes = async () => {
    try {
      const response = await api.get("/ventes/all");
      const ventes: Vente[] = response.data.data;
      
      const totalCA = ventes.reduce((sum, v) => sum + v.totalVente, 0);
      const totalVentes = ventes.length;
      const panierMoyen = totalVentes > 0 ? Math.round(totalCA / totalVentes) : 0;
      
      return { totalVentes, totalCA, panierMoyen };
    } catch (error) {
      console.error("Erreur chargement ventes:", error);
      toast.error("Erreur lors du chargement des ventes");
      return { totalVentes: 0, totalCA: 0, panierMoyen: 0 };
    }
  };

  // Récupérer les stats depuis le dashboard (si disponible)
  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/stats/dashboard");
      return response.data.data;
    } catch (error) {
      console.error("Erreur chargement dashboard stats:", error);
      // Si l'endpoint n'existe pas encore, on utilise les appels individuels
      return null;
    }
  };

  // Charger toutes les données
  const loadAllStats = async () => {
    try {
      setLoading(true);
      
      // Essayer d'abord l'endpoint dashboard
      const dashboardData = await fetchDashboardStats();
      
      if (dashboardData) {
        // Si l'endpoint dashboard existe, on l'utilise
        setStats({
          totalUsers: dashboardData.totalUsers || 0,
          vendeurs: dashboardData.vendeurs || 0,
          admins: dashboardData.admins || 0,
          usersWithBoutique: dashboardData.usersWithBoutique || 0,
          totalBoutiques: dashboardData.totalBoutiques || 0,
          totalVentes: dashboardData.totalVentes || 0,
          totalCA: dashboardData.totalCA || 0,
          panierMoyen: dashboardData.panierMoyen || 0,
        });
      } else {
        // Sinon, on fait les appels individuels
        const [usersStats, totalBoutiques, ventesStats] = await Promise.all([
          fetchUsers(),
          fetchBoutiques(),
          fetchVentes()
        ]);
        
        setStats({
          totalUsers: usersStats.users,
          vendeurs: usersStats.vendeurs,
          admins: usersStats.admins,
          usersWithBoutique: usersStats.usersWithBoutique,
          totalBoutiques: totalBoutiques,
          totalVentes: ventesStats.totalVentes,
          totalCA: ventesStats.totalCA,
          panierMoyen: ventesStats.panierMoyen,
        });
      }
    } catch (error) {
      console.error("Erreur globale:", error);
      toast.error("Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllStats();
  }, []);

  const statsCards = [
    {
      label: "Utilisateurs",
      value: stats.totalUsers,
      sub: `${stats.vendeurs} vendeurs · ${stats.admins} admin`,
      icon: Users,
    },
    {
      label: "Boutiques",
      value: stats.totalBoutiques,
      sub: `${stats.usersWithBoutique} utilisateurs assignés`,
      icon: Store,
    },
    {
      label: "Ventes",
      value: stats.totalVentes,
      sub: `Panier moyen ${formatFCFA(stats.panierMoyen)}`,
      icon: ShoppingBag,
    },
    {
      label: "Chiffre d'affaires",
      value: formatFCFA(stats.totalCA),
      sub: "Cumulé toutes boutiques",
      icon: TrendingUp,
      highlight: true,
    },
  ];

  if (loading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5 shadow-card border-border/60">
            <div className="animate-pulse">
              <div className="h-10 w-10 rounded-lg bg-primary/10 mb-4" />
              <div className="h-4 w-24 bg-primary/10 rounded mb-2" />
              <div className="h-8 w-32 bg-primary/10 rounded mb-2" />
              <div className="h-3 w-40 bg-primary/10 rounded" />
            </div>
          </Card>
        ))}
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((s) => (
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