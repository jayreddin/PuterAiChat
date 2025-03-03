import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { reasoningExamples } from "@/lib/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExampleButtonProps {
  onSelect?: (example: string) => void;
}

export function ExampleButton({ onSelect }: ExampleButtonProps) {
  const [showExamples, setShowExamples] = useState(false);

  const handleSelect = (content: string) => {
    onSelect?.(content);
    setShowExamples(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowExamples(true)}
        className="flex items-center gap-2"
      >
        <Lightbulb className="h-4 w-4" />
        Examples
      </Button>

      <Dialog open={showExamples} onOpenChange={setShowExamples}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Deep Thinking Examples</DialogTitle>
            <DialogDescription>
              Select a reasoning framework to get started
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {reasoningExamples.map((example) => (
                <div
                  key={example.title}
                  onClick={() => handleSelect(example.content)}
                  className="group relative rounded-lg border p-4 hover:bg-accent cursor-pointer transition-colors duration-200"
                >
                  <h3 className="font-medium text-sm mb-2">{example.title}</h3>
                  <div className="text-sm text-muted-foreground">
                    <div className="line-clamp-3 whitespace-pre-line">
                      {example.content}
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-lg ring-offset-background transition-shadow hover:ring-2 hover:ring-ring hover:ring-offset-2" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}