import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Code2, Link, Brain, Settings2 } from "lucide-react";
import { forwardRef, useState } from "react";
import { useChatInputContext } from "@/contexts/chat-input-context";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useDarkMode } from "@/hooks/use-dark-mode"; // Now correctly implemented
import { CodeEditor } from "@/components/chat/code-editor"; // Props fixed

// Create wrapper components that properly handle ref forwarding with tooltips
interface TooltipButtonProps {
  tooltip: string;
  icon: React.ReactNode;
  onClick?: () => void; 
}

const TooltipButton = forwardRef<HTMLButtonElement, TooltipButtonProps>(
  ({ tooltip, icon, onClick }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            ref={ref} 
            variant="ghost" 
            size="icon" 
            className="hover:bg-muted" 
            onClick={onClick}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);
TooltipButton.displayName = "TooltipButton";

interface DialogStandaloneProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface InsertDialogStandaloneProps extends DialogStandaloneProps {
  onInsert: (text: string) => void;
}

// Standalone dialog components
function CodeInputDialogStandalone({ open, onOpenChange, onInsert }: InsertDialogStandaloneProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const { isDarkMode } = useDarkMode();
  
  const handleInsert = () => {
    const codeBlock = `\`\`\`${language}\n${code}\n\`\`\``;
    onInsert(codeBlock);
    onOpenChange(false);
    setCode("");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
}

function WebAddressDialogStandalone({ open, onOpenChange, onInsert }: InsertDialogStandaloneProps) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  
  const handleInsert = () => {
    const markdownLink = text ? `[${text}](${url})` : url;
    onInsert(markdownLink);
    onOpenChange(false);
    setUrl("");
    setText("");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text" className="text-right">
              Text
            </Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="col-span-3"
              placeholder="(Optional) Display text"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleInsert}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeepThinkDialogStandalone({ open, onOpenChange, onInsert }: InsertDialogStandaloneProps) {
  const [thoughts, setThoughts] = useState("");
  
  const handleInsert = () => {
    const formattedThoughts = `<deep-think>\n${thoughts}\n</deep-think>`;
    onInsert(formattedThoughts);
    onOpenChange(false);
    setThoughts("");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Deep Thinking Space</DialogTitle>
          <DialogDescription>
            Use this space to think step-by-step about complex problems.
            Your thoughts will be processed by the AI for deeper analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            className="min-h-[200px]"
            placeholder="Enter your step-by-step reasoning here..."
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleInsert}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SettingsDialogStandalone({ open, onOpenChange }: DialogStandaloneProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function UtilityBar() {
  const { insertText } = useChatInputContext();
  
  // Using controlled dialog pattern rather than using tooltips with dialog components directly
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [deepThinkDialogOpen, setDeepThinkDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  
  return (
    <>
      <TooltipProvider>
        <div className="flex items-center space-x-2">
          <TooltipButton 
            tooltip="Insert code" 
            icon={<Code2 className="h-5 w-5" />} 
            onClick={() => setCodeDialogOpen(true)}
          />
          
          <TooltipButton 
            tooltip="Insert link" 
            icon={<Link className="h-5 w-5" />} 
            onClick={() => setLinkDialogOpen(true)}
          />
          
          <TooltipButton 
            tooltip="Deep thinking space" 
            icon={<Brain className="h-5 w-5" />} 
            onClick={() => setDeepThinkDialogOpen(true)}
          />
          
          <TooltipButton 
            tooltip="Settings" 
            icon={<Settings2 className="h-5 w-5" />} 
            onClick={() => setSettingsDialogOpen(true)}
          />
        </div>
      </TooltipProvider>
      
      {/* Standalone dialog components */}
      <CodeInputDialogStandalone 
        open={codeDialogOpen} 
        onOpenChange={setCodeDialogOpen} 
        onInsert={insertText}
      />
      
      <WebAddressDialogStandalone 
        open={linkDialogOpen} 
        onOpenChange={setLinkDialogOpen} 
        onInsert={insertText}
      />
      
      <DeepThinkDialogStandalone 
        open={deepThinkDialogOpen} 
        onOpenChange={setDeepThinkDialogOpen} 
        onInsert={insertText}
      />
      
      <SettingsDialogStandalone 
        open={settingsDialogOpen} 
        onOpenChange={setSettingsDialogOpen}
      />
    </>
  );
}
