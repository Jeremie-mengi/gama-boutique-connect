import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ImageOff } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  images: string[];
  title?: string;
  startIndex?: number;
}

const ImageLightbox = ({ open, onOpenChange, images, title, startIndex = 0 }: Props) => {
  const safe = images.filter(Boolean);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-4 sm:p-6 bg-background">
        <DialogTitle className="text-base font-semibold mb-2 truncate">
          {title ?? "Aperçu"}
        </DialogTitle>
        {safe.length === 0 ? (
          <div className="aspect-video rounded-lg bg-muted/30 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="h-10 w-10" />
            <span className="text-sm">Aucune image disponible</span>
          </div>
        ) : (
          <Carousel opts={{ startIndex, loop: safe.length > 1 }} className="w-full">
            <CarouselContent>
              {safe.map((src, i) => (
                <CarouselItem key={i}>
                  <div className="flex items-center justify-center bg-black/40 rounded-lg overflow-hidden">
                    <img
                      src={src}
                      alt={`${title ?? "Image"} ${i + 1}`}
                      className="max-h-[75vh] w-auto object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {safe.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
