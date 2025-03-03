import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ImagePreviewModalProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export function ImagePreviewModal({
  images,
  initialIndex = 0,
  open,
  onClose
}: ImagePreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      handleNext();
    } else if (e.key === "ArrowLeft") {
      handlePrevious();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none"
        onKeyDown={handleKeyDown}
      >
        <div className="relative w-full h-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={cn(
              "absolute top-2 right-2 z-50",
              "bg-background/80 hover:bg-accent",
              "backdrop-blur-sm"
            )}
          >
            <X className="h-4 w-4" />
          </Button>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 z-50",
                  "bg-background/80 hover:bg-accent",
                  "backdrop-blur-sm"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 z-50",
                  "bg-background/80 hover:bg-accent",
                  "backdrop-blur-sm"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Button>
            </>
          )}

          <div
            className={cn(
              "relative w-full h-full flex items-center justify-center",
              "min-h-[200px] bg-background/80 backdrop-blur-sm rounded-lg"
            )}
          >
            <img
              src={images[currentIndex]}
              alt={`Preview ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>

          {images.length > 1 && (
            <div className={cn(
              "absolute bottom-4 left-1/2 -translate-x-1/2",
              "flex items-center gap-1 px-2 py-1 rounded-full",
              "bg-background/80 backdrop-blur-sm"
            )}>
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentIndex
                      ? "bg-primary"
                      : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}