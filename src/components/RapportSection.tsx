import { Card } from "@/components/ui/card";
import { FileBarChart2 } from "lucide-react";

const RapportSection = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-card border-border/60">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileBarChart2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-2xl">Rapports</h2>
            <p className="text-sm text-muted-foreground">Génération et consultation des rapports</p>
          </div>
        </div>
      </Card>

      <Card className="p-16 text-center border-dashed border-border/60">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted/30 mb-4">
          <FileBarChart2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-1">Aucun rapport disponible</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Cette section est prête à accueillir vos rapports (ventes, finances, inventaire...).
        </p>
      </Card>
    </div>
  );
};

export default RapportSection;
