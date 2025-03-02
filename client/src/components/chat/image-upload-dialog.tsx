import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { usePuter } from "@/contexts/puter-context";
import type { PuterAPI } from "@/types/puter";

interface UploadingImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "uploading" | "complete" | "error";
}

export interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImagesUploaded: (images: { id: string; url: string }[]) => void;
}

function isPuterImageUploadAvailable(puter: PuterAPI | undefined): boolean {
  return !!(puter?.ai?.uploadImage);
}

export const ImageUploadDialog = ({
  open,
  onOpenChange,
  onImagesUploaded
}: ImageUploadDialogProps) => {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const { isInitialized: isPuterInitialized } = usePuter();

  const resetForm = () => {
    uploadingImages.forEach(img => {
      if (img.preview) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setUploadingImages([]);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!isPuterInitialized || !window.puter || !isPuterImageUploadAvailable(window.puter)) {
      toast({
        title: "Upload Error",
        description: "Image upload service is not available",
        variant: "destructive"
      });
      return;
    }

    const newImages: UploadingImage[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "uploading"
    }));

    setUploadingImages(prev => [...prev, ...newImages]);

    // Upload each image
    for (const image of newImages) {
      try {
        const updateProgress = (progress: number) => {
          setUploadingImages(prev => prev.map(img => 
            img.id === image.id ? { ...img, progress } : img
          ));
        };

        const uploadResult = await window.puter.ai.uploadImage(image.file, {
          onProgress: (progress: number) => updateProgress(progress * 100)
        });

        if (uploadResult?.url) {
          setUploadingImages(prev => prev.map(img => 
            img.id === image.id 
              ? { ...img, status: "complete", progress: 100 } 
              : img
          ));
        } else {
          throw new Error("Upload failed - invalid response");
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
        setUploadingImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: "error" } : img
        ));
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [isPuterInitialized]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"]
    },
    multiple: true,
    disabled: !isPuterInitialized
  });

  const removeImage = (id: string) => {
    setUploadingImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleApply = () => {
    const completedImages = uploadingImages
      .filter(img => img.status === "complete")
      .map(img => ({
        id: img.id,
        url: img.preview
      }));

    if (completedImages.length > 0) {
      onImagesUploaded(completedImages);
      onOpenChange(false);
      resetForm();
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(openState) => {
        onOpenChange(openState);
        if (!openState) {
          resetForm();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200 ease-in-out
            ${isDragActive ? "border-primary bg-primary/5" : "border-muted"}
            ${!isPuterInitialized ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5"}
          `}
        >
          <input {...getInputProps()} />
          {!isPuterInitialized ? (
            <p>Please wait while the upload service initializes...</p>
          ) : isDragActive ? (
            <p>Drop the images here ...</p>
          ) : (
            <p>Drag & drop images here, or click to select files</p>
          )}
        </div>

        {uploadingImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {uploadingImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden border">
                  <img
                    src={image.preview}
                    alt="Upload preview"
                    className="object-cover w-full h-full"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {image.status === "uploading" && (
                  <Progress value={image.progress} className="mt-2" />
                )}
                {image.status === "error" && (
                  <p className="text-sm text-red-500 mt-1">Upload failed</p>
                )}
              </div>
            ))}
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleApply}
            disabled={!uploadingImages.some(img => img.status === "complete")}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

ImageUploadDialog.displayName = "ImageUploadDialog";
