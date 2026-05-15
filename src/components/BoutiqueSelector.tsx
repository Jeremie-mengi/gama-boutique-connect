import { useEffect } from "react";
import { Filter } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useBoutiqueStore } from "@/store/boutiqueStore";

interface Props {
  value: string; // "all" ou boutique id
  onChange: (v: string) => void;
}

const BoutiqueSelector = ({ value, onChange }: Props) => {
  const { boutiques, loading, fetchBoutiques } = useBoutiqueStore();

  // Charger les boutiques au montage si nécessaire
  useEffect(() => {
    if (boutiques.length === 0 && !loading) {
      fetchBoutiques();
    }
  }, [boutiques.length, loading, fetchBoutiques]);

  return (
    <div className="flex items-center gap-3 flex-wrap rounded-xl border border-border/60 bg-card/40 p-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4 text-primary" />
        Filtrer par boutique
      </div>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[240px] h-9">
          <SelectValue placeholder="Sélectionner une boutique" />
        </SelectTrigger>
        
        <SelectContent>
          <SelectItem value="all">Toutes les boutiques</SelectItem>
          
          {loading ? (
            <SelectItem value="loading" disabled>
              Chargement des boutiques...
            </SelectItem>
          ) : boutiques.length === 0 ? (
            <SelectItem value="none" disabled>
              Aucune boutique disponible
            </SelectItem>
          ) : (
            boutiques.map((boutique) => (
              <SelectItem key={boutique.id} value={boutique.id}>
                {boutique.nom}
                {boutique.emplacement && ` (${boutique.emplacement})`}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BoutiqueSelector;