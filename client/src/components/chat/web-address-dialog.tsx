import { memo, useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useUrlPreview } from "@/hooks/use-url-preview";
import { toast } from "@/hooks/use-toast";

export interface WebAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (url: string, metadata?: { title?: string, description?: string }) => void;
}

export const WebAddressDialog = memo(({
  open,
  onOpenChange,
  onSubmit
}: WebAddressDialogProps) => {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const preview = useUrlPreview(url.trim() || null);

  const resetForm = () => {
    setUrl("");
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      return;
    }

    if (preview.error) {
      toast({
        title: "Preview Error",
        description: "There was an issue loading the URL preview. Please check the URL and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `http://${formattedUrl}`;
      }
      onSubmit(formattedUrl, {
        title: preview.title || undefined,
        description: preview.description || undefined
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to submit URL:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit the URL. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(openState) => {
        onOpenChange(openState);
        if (!openState) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Web Address</DialogTitle>
          <DialogDescription>
            Enter a URL to analyze its content and incorporate it into the conversation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="py-4 space-y-4">
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={handleUrlChange}
              className="w-full"
            />

            {url.trim() && (
              <div className="relative mt-2 p-4 border rounded-lg bg-muted/50">
                {preview.loading ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading preview...</span>
                  </div>
                ) : preview.error ? (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                    <p className="text-sm font-medium">Failed to load preview</p>
                    <p className="text-xs mt-1 text-muted-foreground">{preview.error}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {preview.image && (
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={preview.image} 
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    )}
                    {preview.title && (
                      <h3 className="font-medium leading-snug">{preview.title}</h3>
                    )}
                    {preview.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {preview.description}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground truncate">
                      {url.trim()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!url.trim() || isSubmitting || preview.loading || !!preview.error}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Processing..." : "Add to Chat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

WebAddressDialog.displayName = "WebAddressDialog";
