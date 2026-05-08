import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { FileSpreadsheet, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  type Article, type Boutique, type Categorie, type StatutArticle, type Devise,
  CATEGORIES, STATUTS, DEVISES,
} from "@/lib/mockData";

interface Props {
  boutiques: Boutique[];
  /** Si fourni, force la boutique pour toutes les lignes importées. */
  lockedBoutiqueId?: string;
  onImport: (articles: Article[]) => void;
}

const norm = (s: unknown) => String(s ?? "").trim();
const numOr = (v: unknown, def = 0) => {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : def;
};

const matchEnum = <T extends string>(v: unknown, allowed: readonly T[], def: T): T => {
  const x = norm(v).toUpperCase();
  return (allowed as readonly string[]).includes(x) ? (x as T) : def;
};

const ArticleExcelImport = ({ boutiques, lockedBoutiqueId, onImport }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const downloadTemplate = () => {
    const headers = [
      "boutique_nom", "code", "nom", "description", "photo",
      "categorie", "couleur", "observation", "statut", "taille",
      "serie", "demiSerie", "prix", "devise", "quantiteEntree",
    ];
    const example = [
      lockedBoutiqueId
        ? boutiques.find((b) => b.id === lockedBoutiqueId)?.nom ?? ""
        : boutiques[0]?.nom ?? "",
      "CHM-IMP-1", "Chemise importée", "Chemise lin", "",
      "PRET_A_PORTER", "Blanc", "", "EN_STOCK", "L",
      "Été 2026", "non", 22500, "CDF", 30,
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Articles");
    XLSX.writeFile(wb, "modele_import_articles.xlsx");
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    try {
      const buf = await f.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
      if (rows.length === 0) {
        toast.error("Fichier vide");
        return;
      }
      const allowedCats = CATEGORIES.map((c) => c.value) as readonly Categorie[];
      const allowedStat = STATUTS.map((s) => s.value) as readonly StatutArticle[];
      const allowedDev = DEVISES.map((d) => d.value) as readonly Devise[];

      const errors: string[] = [];
      const articles: Article[] = [];

      rows.forEach((r, idx) => {
        const code = norm(r["code"]);
        const nom = norm(r["nom"]);
        const couleur = norm(r["couleur"]);
        let boutique_id = lockedBoutiqueId ?? "";
        if (!lockedBoutiqueId) {
          const bn = norm(r["boutique_nom"]).toLowerCase();
          const found = boutiques.find((b) => b.nom.toLowerCase() === bn);
          if (!found) {
            errors.push(`Ligne ${idx + 2}: boutique "${r["boutique_nom"]}" introuvable`);
            return;
          }
          boutique_id = found.id;
        }
        if (!code || !nom || !couleur) {
          errors.push(`Ligne ${idx + 2}: code, nom et couleur obligatoires`);
          return;
        }
        const qte = numOr(r["quantiteEntree"], 0);
        const demi = ["1", "true", "vrai", "oui", "yes"].includes(norm(r["demiSerie"]).toLowerCase());

        articles.push({
          id: crypto.randomUUID(),
          boutique_id,
          code,
          nom,
          description: norm(r["description"]) || null,
          photo: norm(r["photo"]) || null,
          categorie: matchEnum(r["categorie"], allowedCats, "PRET_A_PORTER"),
          couleur,
          observation: norm(r["observation"]) || null,
          statut: matchEnum(r["statut"], allowedStat, "EN_STOCK"),
          taille: norm(r["taille"]) || null,
          serie: norm(r["serie"]) || null,
          demiSerie: demi,
          prix: numOr(r["prix"], 0),
          devise: matchEnum(r["devise"], allowedDev, "CDF"),
          quantiteEntree: qte,
          quantiteVendue: 0,
          quantiteRestante: qte,
          dateEntreeStock: new Date().toISOString(),
          promotions: [],
        });
      });

      if (articles.length === 0) {
        toast.error(errors[0] ?? "Aucun article valide");
        return;
      }
      onImport(articles);
      toast.success(`${articles.length} article(s) importé(s)${errors.length ? ` · ${errors.length} ignoré(s)` : ""}`);
    } catch (err) {
      console.error(err);
      toast.error("Lecture du fichier impossible");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleFile}
      />
      <Button variant="outline" size="sm" onClick={downloadTemplate} title="Télécharger un modèle Excel">
        <Download className="h-4 w-4" /> Modèle
      </Button>
      <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
        <FileSpreadsheet className="h-4 w-4" /> Importer Excel
      </Button>
    </>
  );
};

export default ArticleExcelImport;
