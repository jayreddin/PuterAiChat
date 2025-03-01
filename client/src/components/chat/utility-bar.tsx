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

const tools = [
  { icon: Image, label: "Upload Image" },
  { icon: FileUp, label: "Upload File" },
  { icon: Globe, label: "Web Address" },
  { icon: Brain, label: "Deep Think" },
  { icon: Code2, label: "Code Settings" },
  { icon: Settings, label: "Settings" },
  { icon: History, label: "History" },
];

export function UtilityBar() {
  return (
    <div className="flex gap-2 items-center">
      <TooltipProvider>
        {tools.map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
