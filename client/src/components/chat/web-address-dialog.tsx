import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "lucide-react";

interface WebAddressDialogProps {
  onInsert: (text: string) => void;
}

export const WebAddressDialog = forwardRef<HTMLButtonElement, WebAddressDialogProps>(({ onInsert }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  
  const handleInsert = () => {
    const markdownLink = text ? `[${text}](${url})` : url;
    onInsert(markdownLink);
    setIsOpen(false);
    setUrl("");
    setText("");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* Added ref here */}
        <Button ref={ref} variant="ghost" size="icon" className="hover:bg-muted">
          <Link className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text" className="text-right">
              Text
            </Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="col-span-3"
              placeholder="(Optional) Display text"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleInsert}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

// Add displayName
WebAddressDialog.displayName = "WebAddressDialog";
