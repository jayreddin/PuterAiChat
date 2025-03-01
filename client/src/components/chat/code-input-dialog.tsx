import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
// Assuming CodeEditor needs forwardRef.  This is a best guess without seeing its implementation
import { CodeEditor } from "./code-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface CodeInputDialogProps {
  onInsert: (text: string) => void;
}

export function CodeInputDialog({ onInsert }: CodeInputDialogProps) {
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
        <Button variant="ghost" size="icon" className="hover:bg-muted">
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
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}