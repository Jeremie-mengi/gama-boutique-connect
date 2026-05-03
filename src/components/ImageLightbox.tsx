import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ImageOff, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  images: string[];
  title?: string;
  startIndex?: number;
}

const ZoomableImage = ({ src, alt }: { src: string; alt: string }) => {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const reset = () => { setScale(1); setPos({ x: 0, y: 0 }); };
  const zoomIn = () => setScale((s) => Math.min(5, +(s + 0.5).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(1, +(s - 0.5).toFixed(2)));

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale((s) => Math.max(1, Math.min(5, +(s + delta).toFixed(2))));
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
    dragRef.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    setPos({ x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y });
  };
  const onMouseUp = () => { dragRef.current = null; };

  const handleDoubleClick = () => {
    if (scale === 1) setScale(2);
    else reset();
  };

  return (
    <div
      className="relative w-full bg-black/40 rounded-lg overflow-hidden flex items-center justify-center select-none"
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{ cursor: scale > 1 ? (dragRef.current ? "grabbing" : "grab") : "zoom-in" }}
    >
      <img
        src={src}
        alt={alt}
        onDoubleClick={handleDoubleClick}
        draggable={false}
        className="max-h-[75vh] w-auto object-contain transition-transform duration-100"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-background/80 backdrop-blur px-2 py-1 shadow-md">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomOut} title="Dézoomer">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs font-mono w-10 text-center">{Math.round(scale * 100)}%</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomIn} title="Zoomer">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={reset} title="Réinitialiser">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const ImageLightbox = ({ open, onOpenChange, images, title, startIndex = 0 }: Props) => {
  const safe = images.filter(Boolean);
  // Force remount when reopening to reset zoom
  const [k, setK] = useState(0);
  useEffect(() => { if (open) setK((x) => x + 1); }, [open]);

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
          <Carousel key={k} opts={{ startIndex, loop: safe.length > 1, watchDrag: false }} className="w-full">
            <CarouselContent>
              {safe.map((src, i) => (
                <CarouselItem key={i}>
                  <ZoomableImage src={src} alt={`${title ?? "Image"} ${i + 1}`} />
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
        <p className="text-[11px] text-muted-foreground text-center mt-2">
          Molette pour zoomer · Double-clic pour basculer · Glisser pour déplacer
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
