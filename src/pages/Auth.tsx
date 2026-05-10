import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, kind: "login" | "signup") => {
    e.preventDefault();
    toast.success(kind === "login" ? "Connexion (maquette)" : "Compte créé (maquette)");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-dark">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-primary shadow-glow mb-4">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">GAMA</span> Boutique
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            La gestion mode, simplement.
          </p>
        </div>

        <Card className="p-6 shadow-elegant border-border/60">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={(e) => handleSubmit(e, "login")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" required placeholder="vous@gama.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <Input id="login-password" type="password" required />
                </div>
                <Button type="submit" variant="hero" className="w-full">Se connecter</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={(e) => handleSubmit(e, "signup")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nom complet</Label>
                  <Input id="signup-name" required placeholder="Aïcha Diallo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" required placeholder="vous@gama.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input id="signup-password" type="password" required minLength={6} />
                </div>
                <Button type="submit" variant="hero" className="w-full">Créer mon compte</Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Maquette visuelle — aucune authentification réelle pour l'instant.
        </p>
      </div>
    </div>
  );
};

export default Auth;
