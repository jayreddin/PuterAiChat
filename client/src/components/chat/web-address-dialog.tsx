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

export interface WebAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (url: string) => void;
}

export const WebAddressDialog = memo(({
  open,
  onOpenChange,
  onSubmit
}: WebAddressDialogProps) => {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setUrl("");
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
      onSubmit(formattedUrl);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to submit URL:', error);
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
          <div className="py-4">
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={handleUrlChange}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!url.trim() || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

WebAddressDialog.displayName = "WebAddressDialog";
