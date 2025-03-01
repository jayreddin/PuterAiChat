import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

interface ImageUploadDialogProps {
  onInsert: (text: string) => void;
}

export function ImageUploadDialog({ onInsert }: ImageUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    // Placeholder for future implementation
    onInsert("[Image placeholder]");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Image className="h-4 w-4" />
      </Button>
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>Upload an image to be used in the chat.</DialogDescription>
          </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-12">
            <Image className="h-8 w-8 mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop an image, or click to browse
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Insert Image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
