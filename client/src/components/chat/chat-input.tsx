import { useRef, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useChatInputContext } from "@/contexts/chat-input-context";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  isDeepThinkActive?: boolean;
  deepThinkModelName?: string;
}

export function ChatInput({ value, onChange, onSend, disabled, isDeepThinkActive = false, deepThinkModelName }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { insertText } = useChatInputContext();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
        {isDeepThinkActive && deepThinkModelName && (
          <div className="absolute top-1 left-4 text-xs text-muted-foreground">
            Deep Think: {deepThinkModelName}
          </div>
        )}
        <div className="md:h-[108px] flex items-center py-2 md:py-0 transition-all duration-300 ease-in-out">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift + Enter for new line)"
            className="w-full resize-none min-h-[60px] md:min-h-[90px] max-h-[90px] border-2 border-black dark:border-white rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-gray-600 dark:hover:border-gray-300 transition-colors duration-200"
            disabled={disabled}
          />
        </div>
      </div>
    </motion.div>
  );
}
