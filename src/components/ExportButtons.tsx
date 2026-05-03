import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { exportToPdf, exportToExcel, type PdfExportOptions } from "@/lib/pdfExport";
import { toast } from "sonner";

interface Props<T> extends PdfExportOptions<T> {
  disabled?: boolean;
  size?: "sm" | "default";
}

export function ExportButtons<T>({ disabled, size = "sm", ...opts }: Props<T>) {
  const handleExcel = async () => {
    try {
      await exportToExcel(opts);
      toast.success("Export Excel généré");
    } catch (e) {
      console.error(e);
      toast.error("Échec de l'export Excel");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size={size} onClick={() => exportToPdf(opts)} disabled={disabled}>
        <FileDown className="h-4 w-4" /> PDF
      </Button>
      <Button variant="outline" size={size} onClick={handleExcel} disabled={disabled}>
        <FileSpreadsheet className="h-4 w-4" /> Excel
      </Button>
    </div>
  );
}

export default ExportButtons;
