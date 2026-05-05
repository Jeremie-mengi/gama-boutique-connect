import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import VendeurDashboard from "@/components/VendeurDashboard";
import {
  mockBoutiques, mockUsers, mockVentes, mockDepenses, mockArticles,
  type AppUser, type Role,
} from "@/lib/mockData";

const UserBoutique = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState(mockArticles);
  const [depenses, setDepenses] = useState(mockDepenses);
  const [ventes] = useState(mockVentes);
  const [boutiques] = useState(mockBoutiques);
  const [users] = useState(mockUsers);

  // Default to a vendeur user (first one with a boutique)
  const defaultUser = useMemo(
    () => users.find((u) => u.role === "vendeur" && u.boutique_id) ?? users[1] ?? users[0],
    [users]
  );
  const [currentUser, setCurrentUser] = useState<AppUser>(defaultUser);

  const boutiqueName = useMemo(
    () => boutiques.find((b) => b.id === currentUser.boutique_id)?.nom ?? null,
    [boutiques, currentUser]
  );

  const handleSwitchRole = (role: Role) => {
    if (role === "admin") {
      navigate("/dashboard");
      return;
    }
    const target = users.find((u) => u.role === role && u.boutique_id) ?? currentUser;
    setCurrentUser(target);
  };

  return (
    <VendeurDashboard
      currentUser={currentUser}
      boutiqueName={boutiqueName}
      articles={articles.filter((a) => !currentUser.boutique_id || a.boutique_id === currentUser.boutique_id)}
      ventes={ventes.filter((v) => !currentUser.boutique_id || v.boutique_id === currentUser.boutique_id)}
      depenses={depenses.filter((d) => !currentUser.boutique_id || d.boutique_id === currentUser.boutique_id)}
      boutiques={boutiques}
      setArticles={setArticles}
      setDepenses={setDepenses}
      onSwitchRole={handleSwitchRole}
      onLogout={() => navigate("/auth")}
    />
  );
};

export default UserBoutique;
