import { useState, forwardRef, useContext, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code2, Settings } from "lucide-react";
import { CodeEditor } from "./code-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { CodeSettingsDialog } from "./CodeSettingsDialog";
import { useChatInputContext } from "@/contexts/chat-input-context";

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

export const CodeInputDialog = forwardRef<HTMLDivElement, CodeInputDialogProps>(({ onInsert }, ref) => {
  const { insertText } = useChatInputContext();
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('code-settings');
    return (stored && JSON.parse(stored).defaultLanguage) || "javascript";
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Auto-detect language (implementation needed)
  }, [code]);

  const handleSave = () => {
    const formattedCode = `\`\`\`${language}\n${code}\n\`\`\``;
    insertText(formattedCode);
    setIsOpen(false);
    setCode("");
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted">
          <Code2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[600px]">
        {showSettings ? (
          <div>CodeSettingsDialog</div>
        ) : (
          <>
            <DialogHeader>
              <DialogDescription>Insert code into the chat.</DialogDescription>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-center flex-grow">Insert Code</DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(true)}
                  className="ml-auto"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2">
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
              </div>
            </DialogHeader>
            <div className="mt-4 flex-1 min-h-[400px]">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
              />
            </div>
            <DialogFooter className="mt-4 gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Insert</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});
