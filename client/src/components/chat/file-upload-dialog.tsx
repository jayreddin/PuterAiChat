import { memo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

interface UploadingFile {
  id: string;
  file: File;
  name: string;
  progress: number;
  status: "uploading" | "complete" | "error";
}

export interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesUploaded: (files: { id: string; url: string; name: string }[]) => void;
}

export const FileUploadDialog = memo(({
  open,
  onOpenChange,
  onFilesUploaded
}: FileUploadDialogProps) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setUploadingFiles([]);
    setIsSubmitting(false);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadingFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      name: file.name,
      progress: 0,
      status: "uploading"
    }));

    setUploadingFiles(prev => [...prev, ...newFiles]);

    // Upload each file
    for (const fileData of newFiles) {
      try {
        if (!window.puter?.files) {
          throw new Error("Puter file upload not available");
        }

        const updateProgress = (progress: number) => {
          setUploadingFiles(prev => prev.map(f => 
            f.id === fileData.id ? { ...f, progress } : f
          ));
        };

        const result = await window.puter.files.upload(fileData.file, {
          onProgress: (progress) => updateProgress(progress * 100)
        });

        setUploadingFiles(prev => prev.map(f => 
          f.id === fileData.id 
            ? { ...f, status: "complete", progress: 100 } 
            : f
        ));
      } catch (error) {
        console.error("Failed to upload file:", error);
        setUploadingFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: "error" } : f
        ));
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== f.id));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const completedFiles = uploadingFiles
        .filter(f => f.status === "complete")
        .map(f => ({
          id: f.id,
          name: f.name,
          url: `/files/${f.id}` // This should be replaced with actual URL from Puter
        }));

      if (completedFiles.length > 0) {
        onFilesUploaded(completedFiles);
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to process files:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(openState) => {
        onOpenChange(openState);
        if (!openState) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag and drop files here or click to select files to upload.
            The files will be processed and made available for analysis.
          </DialogDescription>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200 ease-in-out
            ${isDragActive ? "border-primary bg-primary/5" : "border-muted"}
            hover:border-primary hover:bg-primary/5
          `}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>

        {uploadingFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadingFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{file.name}</span>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <Progress value={file.progress} />
                </div>
                {file.status === "error" && (
                  <span className="text-sm text-red-500">Upload failed</span>
                )}
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!uploadingFiles.some(f => f.status === "complete") || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

FileUploadDialog.displayName = "FileUploadDialog";
