import React, { forwardRef, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code2, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { detectLanguage } from "@/lib/code-utils";
import { useLocalStorage } from "@/hooks/use-local-storage";

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

// Interface for code settings
interface CodeSettings {
  defaultLanguage: string;
  autoDetectLanguage: boolean;
  usePrettier: boolean;
  useAIComments: boolean;
}

// Default settings
const DEFAULT_SETTINGS: CodeSettings = {
  defaultLanguage: "javascript",
  autoDetectLanguage: true,
  usePrettier: true,
  useAIComments: true
};

export interface CodeInputButtonProps {
  onCodeSubmit?: (code: string, language: string) => void;
}

export function CodeInputButton({ onCodeSubmit }: CodeInputButtonProps) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  // Use local storage for persistent settings
  const [settings, setSettings] = useLocalStorage<CodeSettings>(
    "code-input-settings",
    DEFAULT_SETTINGS
  );

  // Temporary settings for the settings dialog
  const [tempSettings, setTempSettings] = useState<CodeSettings>(settings);

  // Update language when settings change
  useEffect(() => {
    setLanguage(settings.defaultLanguage);
  }, [settings.defaultLanguage]);

  // Auto-detect language if enabled
  useEffect(() => {
    if (code && settings.autoDetectLanguage) {
      const detectedLang = detectLanguage(code);
      if (detectedLang && LANGUAGES.includes(detectedLang)) {
        setLanguage(detectedLang);
      }
    }
  }, [code, settings.autoDetectLanguage]);

  const handleCodeSubmit = () => {
    if (onCodeSubmit && code) {
      onCodeSubmit(code, language);
      setCode("");
      setOpen(false);
    }
  };

  const openSettingsDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempSettings({...settings});
    setSettingsOpen(true);
  };

  const saveSettings = () => {
    setSettings(tempSettings);
    setSettingsOpen(false);
  };

  return (
    <>
      {/* Main Code Input Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Code2 className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Insert Code</DialogTitle>
            <DialogDescription>
              Add a code snippet to your message
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-hidden my-4">
            <Editor
              height="30vh"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false
              }}
            />
          </div>

          <DialogFooter className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="icon" 
                onClick={openSettingsDialog}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleCodeSubmit}>Insert Code</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Code Settings</DialogTitle>
            <DialogDescription>
              Configure code input preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="defaultLanguage">Default Code Type</Label>
              <Select 
                value={tempSettings.defaultLanguage} 
                onValueChange={(value) => setTempSettings({...tempSettings, defaultLanguage: value})}
              >
                <SelectTrigger id="defaultLanguage" className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoDetectLanguage" className="flex-grow">
                Auto Code Type Recognition
              </Label>
              <Switch 
                id="autoDetectLanguage" 
                checked={tempSettings.autoDetectLanguage}
                onCheckedChange={(checked) => setTempSettings({...tempSettings, autoDetectLanguage: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="usePrettier" className="flex-grow">
                Prettier Formatting
              </Label>
              <Switch 
                id="usePrettier" 
                checked={tempSettings.usePrettier}
                onCheckedChange={(checked) => setTempSettings({...tempSettings, usePrettier: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="useAIComments" className="flex-grow">
                AI Code Comments
              </Label>
              <Switch 
                id="useAIComments" 
                checked={tempSettings.useAIComments}
                onCheckedChange={(checked) => setTempSettings({...tempSettings, useAIComments: checked})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSettings}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// For use in the ChatInput component
export interface CodeAttachment {
  code: string;
  language: string;
}