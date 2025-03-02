import { memo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Code2, Link, Brain, Settings2 } from "lucide-react";
import { useChatInputContext } from "@/contexts/chat-input-context";
import { CodeInputDialog } from "./code-input-dialog";
import { WebAddressDialog } from "./web-address-dialog";
import { DeepThinkDialog } from "./deep-think-dialog";
import { SettingsDialog } from "./settings-dialog";

interface TooltipButtonProps {
  tooltip: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const TooltipButton = memo(({ tooltip, children, onClick, disabled }: TooltipButtonProps) => (
  <Tooltip>
    <TooltipTrigger 
      onClick={onClick}
      disabled={disabled}
      aria-label={tooltip}
    >
      {children}
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
));

TooltipButton.displayName = "TooltipButton";

const UtilityBarComponent = () => {
  const { insertText } = useChatInputContext();

  return (
    <TooltipProvider>
      <div 
        className="flex items-center space-x-2" 
        role="toolbar" 
        aria-label="Text formatting tools"
      >
        <CodeInputDialog 
          onInsert={insertText}
          ref={(ref) => {
            if (ref) {
              ref.setAttribute('aria-label', 'Insert code');
            }
          }}
        />

        <WebAddressDialog 
          onInsert={insertText}
          ref={(ref) => {
            if (ref) {
              ref.setAttribute('aria-label', 'Insert link');
            }
          }}
        />

        <DeepThinkDialog 
          onInsert={insertText}
          ref={(ref) => {
            if (ref) {
              ref.setAttribute('aria-label', 'Deep thinking space');
            }
          }}
        />

        <SettingsDialog 
          ref={(ref) => {
            if (ref) {
              ref.setAttribute('aria-label', 'Settings');
            }
          }}
        />
      </div>
    </TooltipProvider>
  );
};

UtilityBarComponent.displayName = "UtilityBar";

export const UtilityBar = memo(UtilityBarComponent);
