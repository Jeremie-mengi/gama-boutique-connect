import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/gama-logo.png";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/auth", { replace: true }), 8000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow opacity-60 pointer-events-none" />
      <div className="relative flex flex-col items-center gap-10">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse" />
          <img
            src={logo}
            alt="GAMA Boutique"
            className="relative h-40 w-auto md:h-52 animate-pulse drop-shadow-[0_10px_40px_rgba(255,120,30,0.45)]"
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="h-1 w-56 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-1/3 bg-gradient-primary rounded-full animate-[loading_1.4s_ease-in-out_infinite]" />
          </div>
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
            Chargement…
          </p>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default Splash;
