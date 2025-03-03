import { useRef, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useChat } from "@/contexts/chat-input-context";
import { CodeAttachment } from "./code-attachment";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  isDeepThinkActive?: boolean;
  deepThinkModelName?: string;
  codeAttachment?: {
    filename: string;
    language: string;
    content: string;
  } | null;
  onRemoveCodeAttachment?: () => void;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  isDeepThinkActive = false,
  deepThinkModelName,
  codeAttachment,
  onRemoveCodeAttachment,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isMobile) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-background"
    >
      <div className="relative w-full">
        {codeAttachment && (
          <div className="absolute -top-12 sm:-top-14 left-2 sm:left-4 z-10">
            <CodeAttachment
              filename={codeAttachment.filename}
              language={codeAttachment.language}
              onRemove={onRemoveCodeAttachment || (() => {})}
            />
          </div>
        )}

        <div className={cn(
          "flex items-center transition-all duration-300 ease-in-out",
          "py-1.5 sm:py-2 md:py-0",
          codeAttachment ? "mt-10 sm:mt-12" : "mt-0",
          "md:h-[108px]"
        )}>
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isMobile ? "Type a message..." : "Type a message... (Shift + Enter for new line)"}
            className={cn(
              "w-full resize-none",
              "text-base sm:text-base", // Increase base text size for better touch
              "min-h-[48px] sm:min-h-[60px] md:min-h-[90px]",
              "max-h-[72px] sm:max-h-[90px]",
              "px-3 sm:px-4", // Increase padding for better touch targets
              "py-2 sm:py-3",
              "border-2 border-black dark:border-white rounded-xl",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "hover:border-gray-600 dark:hover:border-gray-300",
              "transition-colors duration-200",
              "touch-manipulation", // Better touch handling
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          />
        </div>
      </div>
    </motion.div>
  );
}
