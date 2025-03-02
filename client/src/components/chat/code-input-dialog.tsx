import { memo, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeEditor } from "./code-editor";
import { Maximize, Settings as SettingsIcon, Minimize } from "lucide-react"; // Import Minimize icon
import { CodeSettingsDialog } from "./code-settings-dialog.tsx"; // Import the new component with explicit extension

export interface CodeInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (code: string, language: string) => void;
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

export const CodeInputDialog = memo(({
  open,
  onOpenChange,
  onSubmit
}: CodeInputDialogProps) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false); // State for fullscreen
  const [settingsOpen, setSettingsOpen] = useState(false); // State for settings dialog

  const resetForm = () => {
    setCode("");
    setLanguage("javascript");
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit(code.trim(), language);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to submit code:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      // Enter fullscreen
      const element = document.documentElement; // Or a specific element if needed
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(openState) => {
        onOpenChange(openState);
        if (!openState) resetForm();
      }}
    >
      <DialogContent className={`sm:max-w-[800px] p-0 ${isFullScreen ? 'max-w-full h-screen' : ''}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 pb-0">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Add Code</DialogTitle>
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
              <DialogDescription>
                Enter code to analyze or modify. The code will be processed with syntax highlighting
                and proper formatting.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <ScrollArea className="flex-1 h-full px-6"> {/* Added h-full here */}
            <form onSubmit={handleSubmit} className="space-y-4"> {/* Removed py-4 */}
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
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  height="100%"
                />
            </form>
          </ScrollArea>
          
          <div className="p-6 pt-0">
            <DialogFooter>
              <Button 
                type="submit"
                onClick={handleSubmit}
                disabled={!code.trim() || isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Processing..." : "Submit Code"}
              </Button>
            </DialogFooter>
          </div>
        </div>
        <CodeSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </DialogContent>
    </Dialog>
  );
});

CodeInputDialog.displayName = "CodeInputDialog";
