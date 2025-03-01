import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";

interface FileUploadDialogProps {
  onInsert: (text: string) => void;
}

export function FileUploadDialog({ onInsert }: FileUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    // Placeholder for future implementation
    onInsert("[File placeholder]");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <FileUp className="h-4 w-4" />
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>Upload a file to be used in the chat.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-12">
            <FileUp className="h-8 w-8 mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop a file, or click to browse
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Insert File</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
