import { LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AppUser, Role } from "@/lib/mockData";
import logo from "@/assets/gama-logo.png";

interface Props {
  user: AppUser;
  onSwitchRole: (role: Role) => void;
}

const AppHeader = ({ user, onSwitchRole }: Props) => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src={logo} alt="GAMA Boutique" className="h-10 w-auto" />
          <div className="hidden sm:block">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Boutique</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* Switch maquette pour basculer admin / vendeur */}
          <Select value={user.role} onValueChange={(v) => onSwitchRole(v as Role)}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="vendeur">Vendeur</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium">{user.full_name}</span>
            <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
              {user.role}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
            <LogOut className="h-4 w-4" />
            Quitter
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
