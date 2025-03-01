import {
  Image,
  FileUp,
  Globe,
  Brain,
  Code2,
  Settings,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CodeInputDialog } from "./code-input-dialog";
import { useContext } from "react";
import { ChatInputContext } from "@/contexts/chat-input-context";

export function UtilityBar() {
  const { insertText } = useContext(ChatInputContext);

  const tools = [
    { icon: Image, label: "Upload Image" },
    { icon: FileUp, label: "Upload File" },
    { icon: Globe, label: "Web Address" },
    { icon: Brain, label: "Deep Think" },
    { 
      icon: Code2, 
      label: "Insert Code",
      onClick: () => document.getElementById('code-dialog-trigger')?.click()
    },
    { icon: Settings, label: "Settings" },
    { icon: History, label: "History" },
  ];

  return (
    <div className="flex gap-2 items-center">
      <TooltipProvider>
        {tools.map(({ icon: Icon, label, onClick }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClick}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
      <CodeInputDialog onInsert={text => insertText?.(text)} />
    </div>
  );
}