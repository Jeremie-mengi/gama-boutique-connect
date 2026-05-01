import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Hash, Palette, Store, Package, Receipt, ImageOff, Maximize2, FileDown } from "lucide-react";
import { formatMoney, type Article, type Boutique, type Vente } from "@/lib/mockData";
import ImageLightbox from "./ImageLightbox";
import { exportToPdf } from "@/lib/pdfExport";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  vente: Vente | null;
  boutiques: Boutique[];
  articles: Article[];
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

const VenteDetailDialog = ({ open, onOpenChange, vente, boutiques, articles }: Props) => {
  const [zoom, setZoom] = useState(false);
  if (!vente) return null;

  const boutique = boutiques.find((b) => b.id === vente.boutique_id);
  const article = articles.find((a) => (vente.code && a.code === vente.code) || a.nom === vente.article);
  const photo = article?.photo ?? null;

  const handlePdf = () => {
    exportToPdf({
      title: `Vente ${vente.code ?? vente.id.slice(0, 6)}`,
      subtitle: `${vente.article} · ${boutique?.nom ?? ""}`,
      columns: [
        { header: "Champ", accessor: (r: { k: string; v: string }) => r.k },
        { header: "Valeur", accessor: (r) => r.v },
      ],
      rows: [
        { k: "Date", v: fmtDate(vente.date) },
        { k: "Code", v: vente.code ?? "—" },
        { k: "Article", v: vente.article },
        { k: "Couleur", v: vente.couleur ?? "—" },
        { k: "Boutique", v: boutique?.nom ?? "—" },
        { k: "Quantité", v: String(vente.quantite) },
        { k: "Montant", v: formatMoney(vente.montant, vente.devise) },
      ],
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Détail de la vente {vente.code ?? vente.id}</DialogTitle>

          <div className="grid md:grid-cols-2">
            {/* Photo */}
            <div className="relative bg-gradient-to-br from-muted/40 to-muted/10 aspect-square md:aspect-auto md:min-h-[420px] flex items-center justify-center">
              {photo ? (
                <>
                  <img src={photo} alt={vente.article} className="w-full h-full object-cover" />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setZoom(true)}
                    className="absolute bottom-3 right-3 backdrop-blur"
                  >
                    <Maximize2 className="h-4 w-4" /> Voir en grand
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
                  <ImageOff className="h-14 w-14" />
                  <span className="text-sm">Aucune photo</span>
                </div>
              )}
            </div>

            {/* Détails */}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Vente</div>
                  <h3 className="font-bold text-xl leading-tight">{vente.article}</h3>
                </div>
                <Receipt className="h-6 w-6 text-primary shrink-0" />
              </div>

              <div className="rounded-lg border border-border/60 bg-card/40 p-4">
                <div className="text-xs uppercase text-muted-foreground">Montant total</div>
                <div className="text-3xl font-bold text-primary">{formatMoney(vente.montant, vente.devise)}</div>
                <div className="text-sm text-muted-foreground mt-1">Quantité : {vente.quantite}</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> {fmtDate(vente.date)}</div>
                <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground" /> <span className="font-mono">{vente.code ?? "—"}</span></div>
                <div className="flex items-center gap-2"><Store className="h-4 w-4 text-muted-foreground" /> {boutique?.nom ?? "—"}</div>
                {vente.couleur && (
                  <div className="flex items-center gap-2"><Palette className="h-4 w-4 text-muted-foreground" /> <Badge variant="outline">{vente.couleur}</Badge></div>
                )}
                {article && (
                  <div className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" /> Stock restant : {article.quantiteRestante}/{article.quantiteEntree}</div>
                )}
              </div>

              <Button onClick={handlePdf} variant="hero" className="w-full">
                <FileDown className="h-4 w-4" /> Exporter en PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ImageLightbox
        open={zoom}
        onOpenChange={setZoom}
        images={photo ? [photo] : []}
        title={vente.article}
      />
    </>
  );
};

export default VenteDetailDialog;
