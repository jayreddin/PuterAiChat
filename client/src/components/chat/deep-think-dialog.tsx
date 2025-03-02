import { memo, useState, FormEvent, ChangeEvent, useEffect } from "react";
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
import { ModelSelect } from "./model-select";
import { ExampleButton } from "./example-button";
import { loadSavedModel, saveSelectedModel } from "@/lib/models";

export interface DeepThinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (thoughts: string, modelId: string) => void;
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
  const [selectedModel, setSelectedModel] = useState(loadSavedModel().id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedModel(loadSavedModel().id);
    }
  }, [open]);

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
      saveSelectedModel(selectedModel);
      const formattedThoughts = `<deep-think model="${selectedModel}">\n${thoughts.trim()}\n</deep-think>`;
      onSubmit(formattedThoughts, selectedModel);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to submit thoughts:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExampleSelect = (example: string) => {
    setThoughts(example);
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
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Deep Thinking Space
            </DialogTitle>
            <div className="flex items-center gap-2">
              <ExampleButton onSelect={handleExampleSelect} />
              <ModelSelect
                value={selectedModel}
                onValueChange={setSelectedModel}
              />
            </div>
          </div>
          <DialogDescription>
            Use this space to think step-by-step about complex problems.
            Your thoughts will be processed by the selected AI model for deeper analysis.
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
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Processing..." : "Think Deeply"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

DeepThinkDialog.displayName = "DeepThinkDialog";
