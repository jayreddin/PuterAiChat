import { useRef, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useChatInputContext } from "@/contexts/chat-input-context";

interface ChatInputProps {
  onSend: (message: string) => void;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, value, onChange, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { insertText } = useChatInputContext();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend(value.trim());
        onChange("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
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
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Shift + Enter for new line)"
          className="w-full resize-none min-h-[60px] max-h-[200px] border-2 border-black dark:border-white rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={disabled}
        />
      </div>
    </motion.div>
  );
}
