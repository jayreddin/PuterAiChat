import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DeepThinkDialogProps {
  onModelSelect: (model: string | null) => void;
  selectedModel: string | null;
}

const DEEP_THINK_MODELS = [
  { id: "deepseek-reasoning", name: "Deepseek-reasoning" },
  { id: "claude-3-5", name: "Claude 3.5" },
  { id: "gemini-2-flash", name: "Gemini 2.0 Flash" },
  { id: "mistral-large", name: "Mistral-Large" }
];

export function DeepThinkDialog({ onModelSelect, selectedModel }: DeepThinkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(selectedModel);

  const handleSave = () => {
    onModelSelect(selected);
    setIsOpen(false);
  };

  const handleModelSelect = (modelId: string) => {
    setSelected(modelId === selected ? null : modelId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Brain className="h-4 w-4" />
      </Button>
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deep Think Models</DialogTitle>
            <DialogDescription>Select a model to use for deep thinking.</DialogDescription>
          </DialogHeader>
        <div className="grid gap-4 py-4">
          {DEEP_THINK_MODELS.map((model) => (
            <div key={model.id} className="flex items-center space-x-2">
              <Checkbox 
                id={model.id} 
                checked={selected === model.id}
                onCheckedChange={() => handleModelSelect(model.id)}
              />
              <Label htmlFor={model.id}>{model.name}</Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
