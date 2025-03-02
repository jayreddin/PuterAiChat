import { useState, useCallback } from "react";
import { X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImagePreviewModal } from "./image-preview-modal";
import { toast } from "@/hooks/use-toast";
import { usePuter } from "@/contexts/puter-context";
import type { PuterAPI } from "@/types/puter";

interface UploadingImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string;
}

export interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImagesUploaded: (images: { id: string; url: string }[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 10;

function isPuterImageUploadAvailable(puter: PuterAPI | undefined): boolean {
  return !!(puter?.ai?.uploadImage);
}

export const ImageUploadDialog = ({
  open,
  onOpenChange,
  onImagesUploaded
}: ImageUploadDialogProps) => {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const { isInitialized: isPuterInitialized } = usePuter();

  const resetForm = () => {
    uploadingImages.forEach(img => {
      if (img.preview) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setUploadingImages([]);
    setSelectedPreview(null);
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

    // Filter out files that are too large
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the maximum file size of 10MB`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    // Check if adding these files would exceed the maximum
    if (uploadingImages.length + validFiles.length > MAX_FILES) {
      toast({
        title: "Too Many Files",
        description: `Maximum of ${MAX_FILES} files allowed`,
        variant: "destructive"
      });
      return;
    }

    const newImages: UploadingImage[] = validFiles.map(file => ({
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
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setUploadingImages(prev => prev.map(img => 
          img.id === image.id ? { 
            ...img, 
            status: "error",
            error: `Upload failed: ${errorMessage}`
          } : img
        ));
        toast({
          title: "Upload Error",
          description: `Failed to upload ${image.file.name}. Please try again.`,
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
    disabled: !isPuterInitialized,
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES
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

  const failedUploads = uploadingImages.filter(img => img.status === "error").length;
  const hasCompletedUploads = uploadingImages.some(img => img.status === "complete");

  return (
    <>
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

          {!isPuterInitialized && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Service Initializing</AlertTitle>
              <AlertDescription>
                Please wait while the upload service initializes...
              </AlertDescription>
            </Alert>
          )}

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
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              {!isPuterInitialized ? (
                <p>Upload service initializing...</p>
              ) : isDragActive ? (
                <p>Drop the images here ...</p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop images here, or click to select files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PNG, JPG, GIF, WebP up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>

          {uploadingImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {uploadingImages.map((image) => (
                <div key={image.id} className="relative group">
                  <div 
                    className="relative aspect-square rounded-lg overflow-hidden border cursor-pointer"
                    onClick={() => setSelectedPreview(image.preview)}
                  >
                    <img
                      src={image.preview}
                      alt={`Upload preview ${image.file.name}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {image.status === "uploading" && (
                    <Progress value={image.progress} className="mt-2" />
                  )}
                  {image.status === "error" && (
                    <div className="mt-1 p-1 bg-destructive/10 rounded text-xs text-destructive">
                      {image.error || "Upload failed"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {failedUploads > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upload Failed</AlertTitle>
              <AlertDescription>
                {failedUploads} {failedUploads === 1 ? "image" : "images"} failed to upload.
                Please try again or remove failed uploads.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApply}
              disabled={!hasCompletedUploads}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedPreview && (
        <ImagePreviewModal
          src={selectedPreview}
          open={true}
          onOpenChange={(open) => !open && setSelectedPreview(null)}
        />
      )}
    </>
  );
};

ImageUploadDialog.displayName = "ImageUploadDialog";
