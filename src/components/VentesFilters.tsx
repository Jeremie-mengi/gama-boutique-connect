import { useMemo } from "react";
import { Search, X, CalendarRange } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Vente } from "@/lib/mockData";
import { DEVISES } from "@/lib/mockData";

export type Periode = "all" | "jour" | "semaine" | "mois" | "annee";
export type NumOp = "all" | "gte" | "lte" | "eq";

export interface VentesFilterState {
  from: string;
  to: string;
  periode: Periode;
  code: string;
  article: string;
  couleur: string;
  devise: string;
  qteOp: NumOp;
  qteVal: string;
  montantOp: NumOp;
  montantVal: string;
}

export const emptyFilters: VentesFilterState = {
  from: "", to: "", periode: "all",
  code: "", article: "", couleur: "", devise: "all",
  qteOp: "all", qteVal: "", montantOp: "all", montantVal: "",
};

const numCheck = (val: number, op: NumOp, ref: string) => {
  if (op === "all" || ref === "") return true;
  const r = Number(ref);
  if (Number.isNaN(r)) return true;
  if (op === "gte") return val >= r;
  if (op === "lte") return val <= r;
  return val === r;
};

const periodeStart = (p: Periode) => {
  const now = new Date();
  switch (p) {
    case "jour": return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    case "semaine": {
      const day = (now.getDay() + 6) % 7;
      const monday = new Date(now); monday.setDate(now.getDate() - day); monday.setHours(0, 0, 0, 0);
      return monday.getTime();
    }
    case "mois": return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    case "annee": return new Date(now.getFullYear(), 0, 1).getTime();
    default: return null;
  }
};

export const applyVentesFilters = (ventes: Vente[], f: VentesFilterState) =>
  ventes.filter((v) => {
    const ts = +new Date(v.date);
    if (f.from && ts < +new Date(f.from)) return false;
    if (f.to && ts > +new Date(f.to) + 86400000) return false;
    const ps = periodeStart(f.periode);
    if (ps !== null && ts < ps) return false;
    if (f.code && !(v.code ?? "").toLowerCase().includes(f.code.toLowerCase())) return false;
    if (f.article && !v.article.toLowerCase().includes(f.article.toLowerCase())) return false;
    if (f.couleur && !(v.couleur ?? "").toLowerCase().includes(f.couleur.toLowerCase())) return false;
    if (f.devise !== "all" && v.devise !== f.devise) return false;
    if (!numCheck(v.quantite, f.qteOp, f.qteVal)) return false;
    if (!numCheck(v.montant, f.montantOp, f.montantVal)) return false;
    return true;
  });

interface Props {
  value: VentesFilterState;
  onChange: (v: VentesFilterState) => void;
}

const VentesFilters = ({ value, onChange }: Props) => {
  const set = (patch: Partial<VentesFilterState>) => onChange({ ...value, ...patch });
  const reset = () => onChange(emptyFilters);

  const activeCount = useMemo(() => {
    let c = 0;
    if (value.from) c++; if (value.to) c++; if (value.periode !== "all") c++;
    if (value.code) c++; if (value.article) c++; if (value.couleur) c++;
    if (value.devise !== "all") c++;
    if (value.qteOp !== "all" && value.qteVal) c++;
    if (value.montantOp !== "all" && value.montantVal) c++;
    return c;
  }, [value]);

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Search className="h-4 w-4 text-primary" />
          Filtres ventes
          {activeCount > 0 && (
            <span className="rounded-full bg-primary/15 text-primary text-[10px] px-2 py-0.5">{activeCount}</span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>
          <X className="h-3.5 w-3.5" /> Réinitialiser
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <Label className="text-xs text-muted-foreground flex items-center gap-1"><CalendarRange className="h-3 w-3" /> Du</Label>
          <Input type="date" value={value.from} onChange={(e) => set({ from: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground flex items-center gap-1"><CalendarRange className="h-3 w-3" /> Au</Label>
          <Input type="date" value={value.to} onChange={(e) => set({ to: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Période rapide</Label>
          <Select value={value.periode} onValueChange={(v) => set({ periode: v as Periode })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="jour">Aujourd'hui</SelectItem>
              <SelectItem value="semaine">Cette semaine</SelectItem>
              <SelectItem value="mois">Ce mois</SelectItem>
              <SelectItem value="annee">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Code</Label>
          <Input value={value.code} onChange={(e) => set({ code: e.target.value })} placeholder="CHM-001" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Article</Label>
          <Input value={value.article} onChange={(e) => set({ article: e.target.value })} placeholder="Chemise..." />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Couleur</Label>
          <Input value={value.couleur} onChange={(e) => set({ couleur: e.target.value })} placeholder="Blanc" />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Devise</Label>
          <Select value={value.devise} onValueChange={(v) => set({ devise: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {DEVISES.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Quantité</Label>
          <div className="flex gap-2">
            <Select value={value.qteOp} onValueChange={(v) => set({ qteOp: v as NumOp })}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="gte">≥</SelectItem>
                <SelectItem value="lte">≤</SelectItem>
                <SelectItem value="eq">=</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" value={value.qteVal} onChange={(e) => set({ qteVal: e.target.value })} disabled={value.qteOp === "all"} />
          </div>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Montant</Label>
          <div className="flex gap-2">
            <Select value={value.montantOp} onValueChange={(v) => set({ montantOp: v as NumOp })}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="gte">≥</SelectItem>
                <SelectItem value="lte">≤</SelectItem>
                <SelectItem value="eq">=</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" value={value.montantVal} onChange={(e) => set({ montantVal: e.target.value })} disabled={value.montantOp === "all"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentesFilters;
