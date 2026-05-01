import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart2, FileDown } from "lucide-react";
import { exportToPdf } from "@/lib/pdfExport";

const RapportSection = () => {
  const handleExport = () => {
    exportToPdf({
      title: "Rapport global",
      subtitle: "Synthèse à compléter",
      columns: [
        { header: "Section", accessor: (r: { s: string; v: string }) => r.s },
        { header: "Détail", accessor: (r) => r.v },
      ],
      rows: [
        { s: "Ventes", v: "À renseigner depuis l'onglet Ventes" },
        { s: "Finances", v: "À renseigner depuis l'onglet Finances" },
        { s: "Inventaire", v: "À renseigner depuis l'onglet Inventaire" },
      ],
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-card border-border/60">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileBarChart2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-2xl">Rapports</h2>
              <p className="text-sm text-muted-foreground">Génération et consultation des rapports</p>
            </div>
          </div>
          <Button variant="hero" onClick={handleExport}>
            <FileDown className="h-4 w-4" /> Exporter en PDF
          </Button>
        </div>
      </Card>

      <Card className="p-16 text-center border-dashed border-border/60">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted/30 mb-4">
          <FileBarChart2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-1">Aucun rapport disponible</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Cette section est prête à accueillir vos rapports (ventes, finances, inventaire...).
          Utilisez le bouton « Exporter en PDF » ci-dessus pour générer un modèle.
        </p>
      </Card>
    </div>
  );
};

export default RapportSection;
