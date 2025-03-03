import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePuter } from "../../contexts/puter-context";
import { Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (images: Array<{ id: string; url: string }>) => void;
}

export function ImageUploadDialog({
  open,
  onClose,
  onUpload
}: ImageUploadDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<Array<{ file: File; preview: string }>>([]);
  const { isInitialized: isPuterInitialized, puter } = usePuter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      toast({
        description: "Please select valid image files",
        variant: "destructive"
      });
      return;
    }

    // Create preview URLs
    const newPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const ensureTempDirectory = async () => {
    if (!puter?.fs) return;

    try {
      const tempExists = await puter.fs.exists('/temp');
      if (!tempExists) {
        await puter.fs.mkdir('/temp');
      }
    } catch (error) {
      console.error('Failed to create temp directory:', error);
      throw new Error('Failed to create temporary storage');
    }
  };

  const handleUpload = async () => {
    if (!isPuterInitialized || !puter?.fs) {
      toast({
        description: "Upload service not available",
        variant: "destructive"
      });
      return;
    }

    if (previewImages.length === 0) {
      toast({
        description: "Please select images to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      await ensureTempDirectory();

      const uploadedImages = await Promise.all(
        previewImages.map(async ({ file }) => {
          const timestamp = Date.now();
          const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          
          try {
            const uploadedFile = await puter.fs.write(`/temp/${filename}`, file);
            const url = await puter.fs.getPublicURL(uploadedFile.path);
            
            return {
              id: uploadedFile.id,
              url
            };
          } catch (error) {
            console.error('Failed to upload image:', error);
            throw error;
          }
        })
      );

      onUpload(uploadedImages);
      handleClose();
      
      toast({
        description: `Successfully uploaded ${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''}`,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    // Cleanup preview URLs
    previewImages.forEach(img => URL.revokeObjectURL(img.preview));
    setPreviewImages([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label
              htmlFor="images"
              className={cn(
                "flex flex-col items-center justify-center",
                "w-full h-32 border-2 border-dashed rounded-lg",
                "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
                "transition-colors duration-200"
              )}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click to upload images
                </p>
              </div>
              <input
                id="images"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>
          </div>

          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previewImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg border-2 border-black dark:border-white"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    disabled={isUploading}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={previewImages.length === 0 || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
