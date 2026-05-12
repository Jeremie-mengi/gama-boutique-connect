import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";

const Auth = () => {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      if (!data) {
        throw new Error("Erreur de connexion");
      }

      // Zustand login (user + tokens + remember 7 jours)
      login(data.data, rememberMe);

      toast.success("Connexion réussie");

      navigate("/dashboard");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Une erreur est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-dark">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-primary shadow-glow mb-4">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-bold">
            <span className="text-gradient">
              GAMA
            </span>{" "}
            Boutique
          </h1>

          <p className="text-muted-foreground mt-2 text-sm">
            La gestion mode, simplement.
          </p>
        </div>

        {/* Card */}
        <Card className="p-6 shadow-elegant border-border/60">
          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                required
                placeholder="vous@gama.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Mot de passe
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) =>
                  setRememberMe(
                    checked as boolean
                  )
                }
              />

              <Label
                htmlFor="remember"
                className="text-sm cursor-pointer"
              >
                Se souvenir de moi (7 jours)
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="hero"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Connexion..."
                : "Se connecter"}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          © GAMA Boutique
        </p>
      </div>
    </div>
  );
};

export default Auth;