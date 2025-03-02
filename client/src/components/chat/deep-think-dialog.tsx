import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Brain } from "lucide-react";

interface DeepThinkDialogProps {
  onInsert: (text: string) => void;
}

export const DeepThinkDialog = forwardRef<HTMLButtonElement, DeepThinkDialogProps>(({ onInsert }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thoughts, setThoughts] = useState("");
  
  const handleInsert = () => {
    const formattedThoughts = `<deep-think>\n${thoughts}\n</deep-think>`;
    onInsert(formattedThoughts);
    setIsOpen(false);
    setThoughts("");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* Added ref here */}
        <Button ref={ref} variant="ghost" size="icon" className="hover:bg-muted">
          <Brain className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Deep Thinking Space</DialogTitle>
          <DialogDescription>
            Use this space to think step-by-step about complex problems.
            Your thoughts will be processed by the AI for deeper analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            className="min-h-[200px]"
            placeholder="Enter your step-by-step reasoning here..."
          />
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
DeepThinkDialog.displayName = "DeepThinkDialog";
