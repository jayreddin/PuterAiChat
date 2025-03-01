import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Input } from "@/components/ui/input";

interface WebAddressDialogProps {
  onInsert: (text: string) => void;
}

export function WebAddressDialog({ onInsert }: WebAddressDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  // Format URL with http/https if needed
  useEffect(() => {
    if (!url) {
      setPreviewUrl("");
      return;
    }

    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = `https://${url}`;
    }
    setPreviewUrl(formattedUrl);
  }, [url]);

  const handleSave = () => {
    if (previewUrl) {
      onInsert(previewUrl);
      setIsOpen(false);
      setUrl("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Globe className="h-4 w-4" />
      </Button>
      <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Web Address</DialogTitle>
            <DialogDescription>Add a web address to be used in the chat.</DialogDescription>
          </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Enter web address (e.g., example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          
          {previewUrl && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <div className="border rounded-md p-2 flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{previewUrl}</span>
              </div>
              <div className="mt-4 border rounded-md overflow-hidden h-24 bg-muted flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Website preview</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!url}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
