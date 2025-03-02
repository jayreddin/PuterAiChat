import { memo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CodeEditor } from "./code-editor";
import { Maximize, Settings as SettingsIcon, Minimize } from "lucide-react";
import { CodeSettingsDialog } from "./code-settings-dialog";

export interface CodeInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (codeAttachment: { filename: string; language: string; content: string }) => void;
}

const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "markdown", label: "Markdown" },
  { value: "yaml", label: "YAML" },
  { value: "shell", label: "Shell Script" },
];

const getFileExtension = (language: string): string => {
  const extensionMap: { [key: string]: string } = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    csharp: "cs",
    cpp: "cpp",
    php: "php",
    ruby: "rb",
    go: "go",
    rust: "rs",
    sql: "sql",
    html: "html",
    css: "css",
    json: "json",
    xml: "xml",
    markdown: "md",
    yaml: "yml",
    shell: "sh"
  };
  return extensionMap[language] || "txt";
};

export const CodeInputDialog = memo(({
  open,
  onOpenChange,
  onSubmit
}: CodeInputDialogProps) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const resetDialog = useCallback(() => {
    setCode("");
    setLanguage("javascript");
    setSettingsOpen(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (code.trim()) {
      const timestamp = new Date().getTime();
      const ext = getFileExtension(language);
      const filename = `code-${timestamp}.${ext}`;
      
      const codeAttachment = {
        filename,
        language,
        content: code.trim()
      };

      onSubmit?.(codeAttachment);
      onOpenChange(false);
      resetDialog();
    }
  }, [code, language, onSubmit, onOpenChange, resetDialog]);

  const toggleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  }, [isFullScreen]);

  return (
    <>
      <Dialog 
        open={open} 
        onOpenChange={(openState) => {
          onOpenChange(openState);
          if (!openState) {
            resetDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-[800px] h-[600px] p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-center flex-1">Add Code</DialogTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSettingsOpen(true)}
                      title="Code Settings"
                    >
                      <SettingsIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullScreen}
                      title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="p-4 border-b">
              <Select 
                value={language} 
                onValueChange={setLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-h-0">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                height="100%"
              />
            </div>

            <div className="p-4 border-t">
              <DialogFooter>
                <Button 
                  onClick={handleSubmit}
                  disabled={!code.trim()}
                  className="w-32"
                >
                  Insert
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CodeSettingsDialog 
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </>
  );
});

CodeInputDialog.displayName = "CodeInputDialog";
