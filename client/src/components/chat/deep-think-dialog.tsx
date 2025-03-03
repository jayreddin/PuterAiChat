import { memo, useState, FormEvent, ChangeEvent, useEffect, useCallback } from "react";
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
import { Brain, History, Pin, Trash2 } from "lucide-react";
import { ModelSelect } from "./model-select";
import { loadSavedModel, saveSelectedModel } from "@/lib/models";
import { ExampleButton } from "./example-button";

export interface DeepThinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (thoughts: string, modelId: string) => void;
}

interface ThinkHistoryItem {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  isPinned: boolean;
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
  const [showHistory, setShowHistory] = useState(false);
  const [thinkHistory, setThinkHistory] = useState<ThinkHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('thinkHistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (open) {
      setSelectedModel(loadSavedModel().id);
    }
  }, [open]);

  const resetForm = () => {
    setThoughts("");
    setIsSubmitting(false);
  };

  const generateTitle = (content: string): string => {
    const firstLine = content.split('\n')[0];
    return firstLine.slice(0, 40) + (firstLine.length > 40 ? '...' : '');
  };

  const saveToHistory = (content: string) => {
    const newItem: ThinkHistoryItem = {
      id: Date.now().toString(),
      title: generateTitle(content),
      content,
      timestamp: Date.now(),
      isPinned: false
    };

    setThinkHistory(prev => {
      const newHistory = [newItem, ...prev];
      localStorage.setItem('thinkHistory', JSON.stringify(newHistory));
      return newHistory;
    });
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
      saveToHistory(thoughts.trim()); // Save to history before formatting
      onSubmit(formattedThoughts, selectedModel);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to submit thoughts:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExampleSelect = useCallback((example: string) => {
    setThoughts(example);
  }, []);

  const handleHistorySelect = (content: string) => {
    setThoughts(content);
    setShowHistory(false);
  };

  const togglePin = (id: string) => {
    setThinkHistory(prev => {
      const newHistory = prev.map(item => {
        if (item.id === id) {
          return { ...item, isPinned: !item.isPinned };
        }
        return item;
      }).sort((a, b) => {
        if (a.isPinned === b.isPinned) {
          return b.timestamp - a.timestamp;
        }
        return a.isPinned ? -1 : 1;
      });
      
      localStorage.setItem('thinkHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const deleteHistoryItem = (id: string) => {
    setThinkHistory(prev => {
      const newHistory = prev.filter(item => item.id !== id);
      localStorage.setItem('thinkHistory', JSON.stringify(newHistory));
      return newHistory;
    });
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
          <DialogTitle className="flex items-center justify-center gap-2">
            <Brain className="h-5 w-5" />
            Deep Thinking Space
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between w-full">
          <ExampleButton onSelect={handleExampleSelect} />
          <div className="flex items-center space-x-2">
            <ModelSelect
              value={selectedModel}
              onValueChange={setSelectedModel}
            />
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              Think History
            </Button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="py-4">
            <ThoughtInput
              value={thoughts}
              onChange={setThoughts}
              maxLength={MAX_CHARS}
            />
          </div>
          <div className="flex justify-between items-center">
            <Button 
              type="submit" 
              disabled={!thoughts.trim() || isSubmitting}
              className="flex-1 sm:flex-none"
            >
              {isSubmitting ? "Processing..." : "Think Deeply"}
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={() => saveToHistory(thoughts.trim())}
              disabled={!thoughts.trim()}
            >
              Save Prompt
            </Button>
          </div>
        </form>

        {/* Think History Dialog */}
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thought History</DialogTitle>
              <DialogDescription>
                Previous reasoning prompts
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto space-y-2">
              {thinkHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePin(item.id)}
                    className={item.isPinned ? "text-blue-500" : ""}
                  >
                    <Pin className="h-4 w-4" />
                  </Button>
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleHistorySelect(item.content)}
                  >
                    <div className="font-medium">{item.title}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHistoryItem(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {thinkHistory.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No saved prompts yet
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
});

DeepThinkDialog.displayName = "DeepThinkDialog";
