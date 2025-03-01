
import React, { forwardRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Editor from "@monaco-editor/react";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "markdown",
  "plaintext"
];

// Interface for the code input dialog with ref
interface CodeInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  code: string;
  onCodeChange: (code: string) => void;
  onSubmit: () => void;
  language?: string;
}

// Using forwardRef to properly handle ref passing
const CodeInputDialog = forwardRef<HTMLDivElement, CodeInputDialogProps>(({
  open,
  onOpenChange,
  title = "Enter Code",
  description = "Please type or paste your code here:",
  code,
  onCodeChange,
  onSubmit,
  language = "javascript"
}, ref) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col" ref={ref}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden my-4 border rounded-md">
          <Editor
            height="100%"
            defaultLanguage={language}
            value={code}
            onChange={(value) => onCodeChange(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
            }}
          />
        </div>
        <DialogFooter>
          <Button type="button" onClick={onSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

// Important to set displayName for debugging
CodeInputDialog.displayName = "CodeInputDialog";

// Interface for the toolbar button implementation
interface CodeInputButtonProps {
  onInsert: (text: string) => void;
}

// Component for the code input button in the utility bar
export const CodeInputButton = forwardRef<HTMLButtonElement, CodeInputButtonProps>(
  ({ onInsert }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");

    const handleSave = () => {
      const formattedCode = `\`\`\`${language}\n${code}\n\`\`\``;
      onInsert(formattedCode);
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
      <DialogContent className="sm:max-w-[800px] h-[600px]">
        <DialogHeader>
          <DialogTitle>Insert Code</DialogTitle>
          <div className="flex items-center gap-4 mt-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSave}>
              Insert Code
            </Button>
          </div>
        </DialogHeader>
        <div className="mt-4 flex-1 min-h-[400px]">
          <Editor
            height="100%"
            defaultLanguage={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CodeInputDialog;


// Important to set displayName for debugging
CodeInputButton.displayName = "CodeInputButton";
