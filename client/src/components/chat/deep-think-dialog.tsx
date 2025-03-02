import { memo, useState, forwardRef, FormEvent, ChangeEvent } from "react";
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

const MAX_CHARS = 2000;

const ThoughtInput = memo(({ 
  value, 
  onChange, 
  maxLength 
}: { 
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={handleChange}
        className="min-h-[200px] resize-y"
        placeholder="Enter your step-by-step reasoning here..."
      />
      <div className="text-sm text-muted-foreground text-right">
        {value.length}/{maxLength} characters
      </div>
    </div>
  );
});

ThoughtInput.displayName = "ThoughtInput";

const DeepThinkDialogComponent = forwardRef<HTMLButtonElement, DeepThinkDialogProps>(({ onInsert }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thoughts, setThoughts] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setThoughts("");
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!thoughts.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedThoughts = `<deep-think>\n${thoughts.trim()}\n</deep-think>`;
      onInsert(formattedThoughts);
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to insert thoughts:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button 
          ref={ref} 
          variant="ghost" 
          size="icon" 
          className="hover:bg-muted"
          aria-label="Deep Think"
        >
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="py-4">
            <ThoughtInput
              value={thoughts}
              onChange={setThoughts}
              maxLength={MAX_CHARS}
            />
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!thoughts.trim() || isSubmitting}
            >
              {isSubmitting ? "Inserting..." : "Insert"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

DeepThinkDialogComponent.displayName = "DeepThinkDialog";

export const DeepThinkDialog = memo(DeepThinkDialogComponent);
