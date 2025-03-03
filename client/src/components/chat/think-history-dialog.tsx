import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pin, Trash2 } from "lucide-react";

interface ThinkHistoryDialogProps {
  onSelect: (prompt: string) => void;
}

interface HistoryItem {
  id: string;
  title: string;
  prompt: string;
  isPinned: boolean;
}

export function ThinkHistoryDialog({ onSelect }: ThinkHistoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const generateTitle = (prompt: string): string => {
    const words = prompt.split(' ').slice(0, 5);
    return words.join(' ') + (words.length > 5 ? '...' : '');
  };

  const addToHistory = (prompt: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      title: generateTitle(prompt),
      prompt,
      isPinned: false,
    };
    setHistory(prev => {
      // Check if prompt already exists
      if (prev.some(item => item.prompt === prompt)) {
        return prev;
      }
      return [...prev, newItem];
    });
  };

  const togglePin = (id: string) => {
    setHistory(prev => {
      const updatedHistory = prev.map(item =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      );
      return [...updatedHistory].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });
    });
  };

  const deleteItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleSelect = (prompt: string) => {
    onSelect(prompt);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Think History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Think History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2 p-3 rounded-lg hover:bg-accent cursor-pointer group"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 h-8 ${
                    item.isPinned ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin(item.id);
                  }}
                >
                  <Pin className="h-4 w-4" />
                </Button>
                <div
                  className="flex-1 min-w-0"
                  onClick={() => handleSelect(item.prompt)}
                >
                  <h4 className="font-medium truncate">{item.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.prompt}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 h-8 opacity-0 group-hover:opacity-100 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No history items yet
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}