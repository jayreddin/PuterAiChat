import { useState, forwardRef, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Code2 } from "lucide-react";
import { PuterContext } from "@/contexts/puter-context"; // Now correctly exported
import { useDarkMode } from "@/hooks/use-dark-mode"; // Now correctly implemented
import { CodeEditor } from "@/components/chat/code-editor"; // Props fixed

interface CodeInputDialogProps {
  onInsert: (text: string) => void;
}

export const CodeInputDialog = forwardRef<HTMLButtonElement, CodeInputDialogProps>(({ onInsert }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const { isDarkMode } = useDarkMode();
  const puterContext = useContext(PuterContext);
  
  const handleInsert = () => {
    const codeBlock = `\`\`\`${language}\n${code}\n\`\`\``;
    onInsert(codeBlock);
    setIsOpen(false);
    setCode("");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button ref={ref} variant="ghost" size="icon" className="hover:bg-muted">
          <Code2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Insert Code</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-[300px] overflow-hidden">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
            theme={isDarkMode ? "vs-dark" : "vs-light"}
            height="300px"
          />
        </div>
        <DialogFooter className="mt-4">
          <Button type="submit" onClick={handleInsert}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

// Add displayName
CodeInputDialog.displayName = "CodeInputDialog";
