import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Wallet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Boutique, Depense, Vente, Devise } from "@/lib/mockData";
import { DEVISES, formatMoney } from "@/lib/mockData";

interface Props {
  boutiques: Boutique[];
  ventes: Vente[];
  depenses: Depense[];
  setDepenses: React.Dispatch<React.SetStateAction<Depense[]>>;
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "2-digit" });

const FinancesPanel = ({ boutiques, ventes, depenses, setDepenses }: Props) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"entree" | "sortie">("sortie");
  const [boutiqueId, setBoutiqueId] = useState(boutiques[0]?.id ?? "");
  const [libelle, setLibelle] = useState("");
  const [montant, setMontant] = useState<number>(0);
  const [devise, setDevise] = useState<Devise>("CDF");
  const [categorie, setCategorie] = useState<Depense["categorie"]>("achat");

  const nameOf = (id: string) => boutiques.find((b) => b.id === id)?.nom ?? "—";

  // Totaux par devise
  const totals = useMemo(() => {
    const acc: Record<Devise, { entrees: number; sorties: number }> = {
      USD: { entrees: 0, sorties: 0 },
      CDF: { entrees: 0, sorties: 0 },
      EUR: { entrees: 0, sorties: 0 },
    };
    ventes.forEach((v) => { acc[v.devise].entrees += v.montant; });
    depenses.forEach((d) => {
      if (d.type === "entree") acc[d.devise].entrees += d.montant;
      else acc[d.devise].sorties += d.montant;
    });
    return acc;
  }, [ventes, depenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boutiqueId || !libelle.trim() || !montant) {
      toast.error("Boutique, libellé et montant requis");
      return;
    }
    setDepenses((prev) => [{
      id: crypto.randomUUID(),
      boutique_id: boutiqueId,
      libelle: libelle.trim(),
      montant: Number(montant),
      devise,
      categorie,
      type,
      date: new Date().toISOString(),
    }, ...prev]);
    toast.success(type === "entree" ? "Entrée enregistrée" : "Sortie enregistrée");
    setOpen(false);
    setLibelle(""); setMontant(0);
  };

  const movements = [...depenses].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <Card className="p-6 shadow-card border-border/60">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-xl">Finances</h2>
            <p className="text-sm text-muted-foreground">Entrées & sorties multi-devises</p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero"><Plus className="h-4 w-4" /> Nouveau mouvement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau mouvement financier</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entree">Entrée (+)</SelectItem>
                      <SelectItem value="sortie">Sortie (-)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Boutique</Label>
                  <Select value={boutiqueId} onValueChange={setBoutiqueId}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {boutiques.map((b) => <SelectItem key={b.id} value={b.id}>{b.nom}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Libellé</Label>
                <Input value={libelle} onChange={(e) => setLibelle(e.target.value)} placeholder="Loyer, achat tissus..." />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Montant</Label>
                  <Input type="number" min={0} value={montant} onChange={(e) => setMontant(Number(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Devise</Label>
                  <Select value={devise} onValueChange={(v) => setDevise(v as Devise)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DEVISES.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Catégorie</Label>
                  <Select value={categorie} onValueChange={(v) => setCategorie(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loyer">Loyer</SelectItem>
                      <SelectItem value="salaire">Salaire</SelectItem>
                      <SelectItem value="achat">Achat</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" variant="hero">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Totaux par devise */}
      <div className="grid gap-3 md:grid-cols-3 mb-6">
        {DEVISES.map((d) => {
          const t = totals[d.value];
          const solde = t.entrees - t.sorties;
          return (
            <div key={d.value} className="rounded-xl border border-border/60 bg-gradient-dark p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-base">{d.label}</span>
                <Wallet className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><ArrowUpCircle className="h-3.5 w-3.5 text-emerald-400" /> Entrées</span>
                  <span className="font-semibold text-emerald-400">{formatMoney(t.entrees, d.value)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><ArrowDownCircle className="h-3.5 w-3.5 text-rose-400" /> Sorties</span>
                  <span className="font-semibold text-rose-400">{formatMoney(t.sorties, d.value)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-1.5 mt-1.5">
                  <span className="font-semibold">Solde</span>
                  <span className={`font-bold ${solde >= 0 ? "text-primary" : "text-rose-400"}`}>{formatMoney(solde, d.value)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Mouvements</h3>
      {movements.length === 0 ? (
        <p className="text-muted-foreground text-sm py-6 text-center">Aucun mouvement.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Boutique</TableHead>
                <TableHead>Libellé</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((d) => {
                const isEntree = d.type === "entree";
                return (
                  <TableRow key={d.id}>
                    <TableCell className="text-muted-foreground">{fmtDate(d.date)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={isEntree ? "border-emerald-500/40 text-emerald-400" : "border-rose-500/40 text-rose-400"}>
                        {isEntree ? "Entrée" : "Sortie"}
                      </Badge>
                    </TableCell>
                    <TableCell>{nameOf(d.boutique_id)}</TableCell>
                    <TableCell className="font-medium">{d.libelle}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{d.categorie}</Badge></TableCell>
                    <TableCell className={`text-right font-semibold ${isEntree ? "text-emerald-400" : "text-rose-400"}`}>
                      {isEntree ? "+ " : "- "}{formatMoney(d.montant, d.devise)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default FinancesPanel;
