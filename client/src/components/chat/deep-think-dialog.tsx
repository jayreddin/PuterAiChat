import { memo, useState, forwardRef, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Brain } from "lucide-react";

export interface DeepThinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (thoughts: string) => void;
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

export const DeepThinkDialog = memo(({ 
  open,
  onOpenChange,
  onSubmit
}: DeepThinkDialogProps) => {
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
      onSubmit(formattedThoughts);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to submit thoughts:', error);
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
              {isSubmitting ? "Processing..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

DeepThinkDialog.displayName = "DeepThinkDialog";
