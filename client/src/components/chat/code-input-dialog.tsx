import { Suspense, lazy, memo, useState, forwardRef, useContext } from "react";
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
import { useDarkMode } from "@/hooks/use-dark-mode";

// Lazy load CodeEditor component
const CodeEditor = lazy(() => import("@/components/chat/code-editor").then(module => ({
  default: module.CodeEditor
})));

interface CodeInputDialogProps {
  onInsert: (text: string) => void;
}

const CodeInputDialogComponent = forwardRef<HTMLButtonElement, CodeInputDialogProps>(({ onInsert }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const { isDarkMode } = useDarkMode();
  
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
          <Suspense fallback={
            <div className="flex items-center justify-center h-[300px] bg-muted">
              Loading editor...
            </div>
          }>
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
              theme={isDarkMode ? "vs-dark" : "vs-light"}
              height="300px"
            />
          </Suspense>
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

CodeInputDialogComponent.displayName = "CodeInputDialog";

// Memoize the component to prevent unnecessary re-renders
export const CodeInputDialog = memo(CodeInputDialogComponent);
