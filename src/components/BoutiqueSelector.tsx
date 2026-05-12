import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBoutiqueStore } from "@/store/boutiqueStore";

interface Props {
  value: string; // "all" ou boutique id
  onChange: (v: string) => void;
}

const BoutiqueSelector = ({ value, onChange }: Props) => {
  const { boutiques } = useBoutiqueStore();

  return (
    <div className="flex items-center gap-3 flex-wrap rounded-xl border border-border/60 bg-card/40 p-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4 text-primary" />
        Filtrer par boutique
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[240px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les boutiques</SelectItem>
          {boutiques.map((b) => (
            <SelectItem key={b.id} value={b.id}>{b.nom}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BoutiqueSelector;